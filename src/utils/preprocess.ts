import { GraphAILogger } from "graphai";
import { MulmoStudio, MulmoScript, MulmoPresentationStyle, mulmoStudioSchema, mulmoCaptionParamsSchema } from "../types/index.js";
import { MulmoPresentationStyleMethods, MulmoScriptMethods } from "../methods/index.js";

const rebuildStudio = (currentStudio: MulmoStudio | undefined, mulmoScript: MulmoScript, fileName: string) => {
  const isTest = process.env.NODE_ENV === "test";
  const parsed =
    isTest && currentStudio ? { data: mulmoStudioSchema.parse(currentStudio), success: true, error: null } : mulmoStudioSchema.safeParse(currentStudio);
  if (parsed.success) {
    return parsed.data;
  }
  if (currentStudio) {
    GraphAILogger.info("currentStudio is invalid", parsed.error);
  }
  // We need to parse it to fill default values
  return mulmoStudioSchema.parse({
    script: mulmoScript,
    filename: fileName,
    beats: [...Array(mulmoScript.beats.length)].map(() => ({})),
  });
};

const mulmoCredit = (speaker: string) => {
  return {
    speaker,
    text: "",
    image: {
      type: "image" as const,
      source: {
        kind: "url" as const,
        url: "https://github.com/receptron/mulmocast-cli/raw/refs/heads/main/assets/images/mulmocast_credit.png",
      },
    },
    audio: {
      type: "audio" as const,
      source: {
        kind: "url" as const,
        url: "https://github.com/receptron/mulmocast-cli/raw/refs/heads/main/assets/audio/silent300.mp3",
      },
    },
  };
};

export const createOrUpdateStudioData = (
  _mulmoScript: MulmoScript,
  currentStudio: MulmoStudio | undefined,
  fileName: string,
  videoCaption?: string,
  presentationStyle?: MulmoPresentationStyle | null,
) => {
  const mulmoScript = _mulmoScript.__test_invalid__ ? _mulmoScript : MulmoScriptMethods.validate(_mulmoScript); // validate and insert default value

  const studio: MulmoStudio = rebuildStudio(currentStudio, mulmoScript, fileName);

  // TODO: Move this code out of this function later
  // Addition cloing credit
  if (mulmoScript.$mulmocast.credit === "closing") {
    const defaultSpeaker = MulmoPresentationStyleMethods.getDefaultSpeaker(presentationStyle ?? studio.script);
    mulmoScript.beats.push(mulmoCredit(mulmoScript.beats[0].speaker ?? defaultSpeaker)); // First speaker
  }

  studio.script = MulmoScriptMethods.validate(mulmoScript); // update the script
  studio.beats = studio.script.beats.map((_, index) => studio.beats[index] ?? {});

  if (videoCaption) {
    studio.script.captionParams = mulmoCaptionParamsSchema.parse({
      ...(studio.script.captionParams ?? {}),
      lang: videoCaption,
    });
  }

  return studio;
};
