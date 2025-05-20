import { GraphAILogger } from "graphai";
import { MulmoStudio, MulmoStudioContext, MulmoCanvasDimension, BeatMediaType } from "../types/index.js";
import { MulmoScriptMethods } from "../methods/index.js";
import { getAudioArtifactFilePath, getOutputVideoFilePath, writingMessage } from "../utils/file.js";
import { FfmpegContextAddInput, FfmpegContextInit, FfmpegContextPushFormattedAudio, FfmpegContextGenerateOutput } from "../utils/ffmpeg_utils.js";

// const isMac = process.platform === "darwin";
const videoCodec = "libx264"; // "h264_videotoolbox" (macOS only) is too noisy

export const getVideoPart = (inputIndex: number, mediaType: BeatMediaType, duration: number, canvasInfo: MulmoCanvasDimension) => {
  const videoId = `v${inputIndex}`;
  return {
    videoId,
    videoPart:
      `[${inputIndex}:v]` +
      [
        mediaType === "image" ? "loop=loop=-1:size=1:start=0" : "",
        `trim=duration=${duration}`,
        "fps=30",
        "setpts=PTS-STARTPTS",
        `scale=${canvasInfo.width}:${canvasInfo.height}`,
        "setsar=1",
        "format=yuv420p",
      ]
        .filter((a) => a)
        .join(",") +
      `[${videoId}]`,
  };
};

export const getAudioPart = (inputIndex: number, duration: number, delay: number) => {
  const audioId = `a${inputIndex}`;

  return {
    audioId,
    audioPart:
      `[${inputIndex}:a]` +
      `atrim=duration=${duration},` + // Trim to beat duration
      `adelay=${delay}|${delay},` +
      `aformat=sample_fmts=fltp:sample_rates=44100:channel_layouts=stereo` +
      `[${audioId}]`,
  };
};

const getOutputOption = (audioId: string) => {
  return [
    "-preset medium", // Changed from veryfast to medium for better compression
    "-map [v]", // Map the video stream
    `-map ${audioId}`, // Map the audio stream
    `-c:v ${videoCodec}`, // Set video codec
    ...(videoCodec === "libx264" ? ["-crf", "26"] : []), // Add CRF for libx264
    "-threads 8",
    "-filter_threads 8",
    "-b:v 2M", // Reduced from 5M to 2M
    "-bufsize",
    "4M", // Reduced buffer size
    "-maxrate",
    "3M", // Reduced from 7M to 3M
    "-r 30", // Set frame rate
    "-pix_fmt yuv420p", // Set pixel format for better compatibility
    "-c:a aac", // Audio codec
    "-b:a 128k", // Audio bitrate
  ];
};

const createVideo = async (audioArtifactFilePath: string, outputVideoPath: string, studio: MulmoStudio, caption: string | undefined) => {
  const start = performance.now();
  const ffmpegContext = FfmpegContextInit();

  if (studio.beats.some((beat) => !beat.imageFile)) {
    GraphAILogger.info("beat.imageFile is not set. Please run `yarn run images ${file}` ");
    return;
  }

  const canvasInfo = MulmoScriptMethods.getCanvasSize(studio.script);
  const padding = MulmoScriptMethods.getPadding(studio.script) / 1000;

  // Add each image input
  const filterComplexVideoIds: string[] = [];
  const filterComplexAudioIds: string[] = [];

  studio.beats.reduce((timestamp, beat, index) => {
    if (!beat.imageFile || !beat.duration) {
      throw new Error(`beat.imageFile or beat.duration is not set: index=${index}`);
    }
    const inputIndex = FfmpegContextAddInput(ffmpegContext, beat.imageFile);
    const mediaType = MulmoScriptMethods.getImageType(studio.script, studio.script.beats[index]);
    const headOrTail = index === 0 || index === studio.beats.length - 1;
    const duration = beat.duration + (headOrTail ? padding : 0);
    const { videoId, videoPart } = getVideoPart(inputIndex, mediaType, duration, canvasInfo);
    ffmpegContext.filterComplex.push(videoPart);
    if (caption && beat.captionFile) {
      const captionInputIndex = FfmpegContextAddInput(ffmpegContext, beat.captionFile);
      const compositeVideoId = `c${index}`;
      ffmpegContext.filterComplex.push(`[${videoId}][${captionInputIndex}:v]overlay=format=auto[${compositeVideoId}]`);
      filterComplexVideoIds.push(compositeVideoId);
    } else {
      filterComplexVideoIds.push(videoId);
    }

    if (mediaType === "movie") {
      const { audioId, audioPart } = getAudioPart(inputIndex, duration, timestamp * 1000);
      filterComplexAudioIds.push(audioId);
      ffmpegContext.filterComplex.push(audioPart);
    }
    return timestamp + duration;
  }, 0);
  // console.log("*** images", images.audioIds);

  // Concatenate the trimmed images
  ffmpegContext.filterComplex.push(`${filterComplexVideoIds.map((id) => `[${id}]`).join("")}concat=n=${studio.beats.length}:v=1:a=0[v]`);

  const audioIndex = FfmpegContextAddInput(ffmpegContext, audioArtifactFilePath); // Add audio input
  const artifactAudioId = `${audioIndex}:a`;

  const ffmpegContextAudioId = (() => {
    if (filterComplexAudioIds.length > 0) {
      const mainAudioId = "mainaudio";
      const compositeAudioId = "composite";
      const audioIds = filterComplexAudioIds.map((id) => `[${id}]`).join("");
      FfmpegContextPushFormattedAudio(ffmpegContext, `[${artifactAudioId}]`, `[${mainAudioId}]`);
      ffmpegContext.filterComplex.push(
        `[${mainAudioId}]${audioIds}amix=inputs=${filterComplexAudioIds.length + 1}:duration=first:dropout_transition=2[${compositeAudioId}]`,
      );
      return `[${compositeAudioId}]`; // notice that we need to use [mainaudio] instead of mainaudio
    }
    return artifactAudioId;
  })();
  await FfmpegContextGenerateOutput(ffmpegContext, outputVideoPath, getOutputOption(ffmpegContextAudioId));
  const end = performance.now();
  GraphAILogger.info(`Video created successfully! ${Math.round(end - start) / 1000} sec`);
};

export const movie = async (context: MulmoStudioContext) => {
  const { studio, fileDirs, caption } = context;
  const { outDirPath } = fileDirs;
  const audioArtifactFilePath = getAudioArtifactFilePath(outDirPath, studio.filename);
  const outputVideoPath = getOutputVideoFilePath(outDirPath, studio.filename, context.lang, caption);

  await createVideo(audioArtifactFilePath, outputVideoPath, studio, caption);
  writingMessage(outputVideoPath);
};
