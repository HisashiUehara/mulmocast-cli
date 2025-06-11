import { GraphAILogger } from "graphai";
import { MulmoStudio, MulmoBeat, MulmoScript, mulmoScriptSchema, mulmoBeatSchema, mulmoStudioSchema } from "../types/index.js";

const rebuildStudio = (currentStudio: MulmoStudio | undefined, mulmoScript: MulmoScript, fileName: string) => {
  const parsed = mulmoStudioSchema.safeParse(currentStudio);
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
    multiLingual: [...Array(mulmoScript.beats.length)].map(() => ({ multiLingualTexts: {} })),
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

export const createOrUpdateStudioData = (_mulmoScript: MulmoScript, currentStudio: MulmoStudio | undefined, fileName: string) => {
  const mulmoScript = _mulmoScript.__test_invalid__ ? _mulmoScript : mulmoScriptSchema.parse(_mulmoScript); // validate and insert default value

  const studio: MulmoStudio = rebuildStudio(currentStudio, mulmoScript, fileName);

  // Addition cloing credit
  if (mulmoScript.$mulmocast.credit === "closing") {
    mulmoScript.beats.push(mulmoCredit(mulmoScript.beats[0].speaker)); // First speaker
  }

  studio.script = mulmoScriptSchema.parse(mulmoScript); // update the script
  studio.beats = studio.script.beats.map((_, index) => studio.beats[index] ?? {});
  mulmoScript.beats.forEach((beat: MulmoBeat, index: number) => {
    // Filling the default values
    studio.script.beats[index] = mulmoBeatSchema.parse(beat);
    if (!studio.multiLingual[index]) {
      studio.multiLingual[index] = { multiLingualTexts: {} };
    }
  });
  return studio;
};
