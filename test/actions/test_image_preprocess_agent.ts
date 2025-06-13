import test from "node:test";
import assert from "node:assert";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import type { MulmoStudioContext, MulmoBeat, Text2ImageAgentInfo } from "../../src/types/index.js";
import { getFileObject } from "../../src/cli/helpers.js";
import { createOrUpdateStudioData } from "../../src/utils/preprocess.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import the actual imagePreprocessAgent function from the source
const { imagePreprocessAgent } = await import("../../src/actions/images.js");

// Helper function to create mock context
const createMockContext = (): MulmoStudioContext => ({
  fileDirs: {
    mulmoFilePath: "/test/path/test.yaml",
    mulmoFileDirPath: "/test/path",
    baseDirPath: "/test",
    outDirPath: "/test/output",
    imageDirPath: "/test/images",
    audioDirPath: "/test/audio",
  },
  studio: {
    filename: "test_studio",
    script: {
      title: "Test Script",
      beats: [],
      canvasSize: { width: 1920, height: 1080 },
    },
    beats: [],
    toJSON: () => "{}",
  },
  force: false,
  sessionState: {
    inSession: {
      audio: false,
      image: false,
      video: false,
      multiLingual: false,
      caption: false,
      pdf: false,
    },
    inBeatSession: {
      audio: {},
      image: {},
      movie: {},
      multiLingual: {},
      caption: {},
    },
  },
});

// Helper function to create mock image agent info
const createMockImageAgentInfo = (): Text2ImageAgentInfo => ({
  provider: "openai",
  agent: "imageOpenaiAgent",
  imageParams: {
    model: "dall-e-3",
    style: "natural",
    moderation: true,
  },
});

// Helper function to create mock beat
const createMockBeat = (overrides: Partial<MulmoBeat> = {}): MulmoBeat => ({
  text: "Test beat text",
  ...overrides,
});

test("imagePreprocessAgent - basic functionality", async () => {
  const context = createMockContext();
  const beat = createMockBeat();
  const imageAgentInfo = createMockImageAgentInfo();

  const result = await imagePreprocessAgent({
    context,
    beat,
    index: 0,
    suffix: "p",
    imageDirPath: "/test/images",
    imageAgentInfo,
    imageRefs: {},
  });

  const expected = {
    imagePath: "/test/images/test_studio/0p.png",
    prompt: "generate image appropriate for the text. text: Test beat text\nnatural",
    imageParams: {
      model: "dall-e-3",
      style: "natural",
      moderation: true,
    },
    movieFile: undefined,
    images: [],
  };

  assert.deepStrictEqual(result, expected);
});

test("imagePreprocessAgent - with movie prompt and text", async () => {
  const context = createMockContext();
  const beat = createMockBeat({
    text: "Test beat text",
    moviePrompt: "Generate a movie of this scene",
    // No explicit imagePrompt, so condition moviePrompt && !imagePrompt is true
  });
  const imageAgentInfo = createMockImageAgentInfo();

  const result = await imagePreprocessAgent({
    context,
    beat,
    index: 1,
    suffix: "p",
    imageDirPath: "/test/images",
    imageAgentInfo,
    imageRefs: {},
  });

  // Since moviePrompt exists and imagePrompt does NOT exist, 
  // only imageParams, movieFile, and images are returned
  const expected = {
    imageParams: {
      model: "dall-e-3",
      style: "natural",
      moderation: true,
    },
    movieFile: "/test/images/test_studio/1.mov",
    images: [],
  };

  assert.deepStrictEqual(result, expected);
});

test("imagePreprocessAgent - movie prompt only (no image prompt)", async () => {
  const context = createMockContext();
  const beat = createMockBeat({
    text: undefined,
    moviePrompt: "Generate a movie of this scene",
  });
  const imageAgentInfo = createMockImageAgentInfo();

  const result = await imagePreprocessAgent({
    context,
    beat,
    index: 2,
    suffix: "p",
    imageDirPath: "/test/images",
    imageAgentInfo,
    imageRefs: {},
  });

  const expected = {
    imageParams: {
      model: "dall-e-3",
      style: "natural",
      moderation: true,
    },
    movieFile: "/test/images/test_studio/2.mov",
    images: [],
  };

  assert.deepStrictEqual(result, expected);
});

test.skip("imagePreprocessAgent - with image plugin (textSlide)", async () => {
  // Skip this test as it requires complex file system setup and Puppeteer
  // The plugin functionality is tested in the actual integration tests
});

test.skip("imagePreprocessAgent - with image plugin (markdown)", async () => {
  // Skip this test as it requires complex file system setup and Puppeteer
});

test.skip("imagePreprocessAgent - with image plugin (chart)", async () => {
  // Skip this test as it requires complex file system setup and Chart.js
});

test.skip("imagePreprocessAgent - with image plugin (mermaid)", async () => {
  // Skip this test as it requires complex file system setup and Mermaid rendering
});

test("imagePreprocessAgent - with imageNames", async () => {
  const context = createMockContext();
  const beat = createMockBeat({
    imageNames: ["image1", "image2"],
  });
  const imageAgentInfo = createMockImageAgentInfo();
  const imageRefs = {
    image1: "/path/to/image1.png",
    image2: "/path/to/image2.png",
    image3: "/path/to/image3.png", // Should not be included
  };

  const result = await imagePreprocessAgent({
    context,
    beat,
    index: 7,
    suffix: "p",
    imageDirPath: "/test/images",
    imageAgentInfo,
    imageRefs,
  });

  const expected = {
    imagePath: "/test/images/test_studio/7p.png",
    prompt: "generate image appropriate for the text. text: Test beat text\nnatural",
    imageParams: {
      model: "dall-e-3",
      style: "natural",
      moderation: true,
    },
    movieFile: undefined,
    images: ["/path/to/image1.png", "/path/to/image2.png"],
  };

  assert.deepStrictEqual(result, expected);
});

test("imagePreprocessAgent - without imageNames (uses all imageRefs)", async () => {
  const context = createMockContext();
  const beat = createMockBeat();
  const imageAgentInfo = createMockImageAgentInfo();
  const imageRefs = {
    image1: "/path/to/image1.png",
    image2: "/path/to/image2.png",
    image3: "/path/to/image3.png",
  };

  const result = await imagePreprocessAgent({
    context,
    beat,
    index: 8,
    suffix: "p",
    imageDirPath: "/test/images",
    imageAgentInfo,
    imageRefs,
  });

  const expected = {
    imagePath: "/test/images/test_studio/8p.png",
    prompt: "generate image appropriate for the text. text: Test beat text\nnatural",
    imageParams: {
      model: "dall-e-3",
      style: "natural",
      moderation: true,
    },
    movieFile: undefined,
    images: ["/path/to/image1.png", "/path/to/image2.png", "/path/to/image3.png"],
  };

  assert.deepStrictEqual(result, expected);
});

test("imagePreprocessAgent - filters undefined image references", async () => {
  const context = createMockContext();
  const beat = createMockBeat({
    imageNames: ["image1", "nonexistent", "image2"],
  });
  const imageAgentInfo = createMockImageAgentInfo();
  const imageRefs = {
    image1: "/path/to/image1.png",
    image2: "/path/to/image2.png",
  };

  const result = await imagePreprocessAgent({
    context,
    beat,
    index: 9,
    suffix: "p",
    imageDirPath: "/test/images",
    imageAgentInfo,
    imageRefs,
  });

  const expected = {
    imagePath: "/test/images/test_studio/9p.png",
    prompt: "generate image appropriate for the text. text: Test beat text\nnatural",
    imageParams: {
      model: "dall-e-3",
      style: "natural",
      moderation: true,
    },
    movieFile: undefined,
    images: ["/path/to/image1.png", "/path/to/image2.png"],
  };

  assert.deepStrictEqual(result, expected);
});

test("imagePreprocessAgent - merges beat and imageAgentInfo imageParams", async () => {
  const context = createMockContext();
  const beat = createMockBeat({
    imageParams: {
      style: "vivid", // Should override imageAgentInfo style
      moderation: false, // Should override imageAgentInfo moderation
    },
  });
  const imageAgentInfo = createMockImageAgentInfo();

  const result = await imagePreprocessAgent({
    context,
    beat,
    index: 10,
    suffix: "p",
    imageDirPath: "/test/images",
    imageAgentInfo,
    imageRefs: {},
  });

  const expected = {
    imagePath: "/test/images/test_studio/10p.png",
    prompt: "generate image appropriate for the text. text: Test beat text\nvivid",
    imageParams: {
      model: "dall-e-3", // From imageAgentInfo
      style: "vivid", // From beat (override)
      moderation: false, // From beat (override)
    },
    movieFile: undefined,
    images: [],
  };

  assert.deepStrictEqual(result, expected);
});

test("imagePreprocessAgent - different suffix", async () => {
  const context = createMockContext();
  const beat = createMockBeat();
  const imageAgentInfo = createMockImageAgentInfo();

  const result = await imagePreprocessAgent({
    context,
    beat,
    index: 11,
    suffix: "_custom",
    imageDirPath: "/test/images",
    imageAgentInfo,
    imageRefs: {},
  });

  const expected = {
    imagePath: "/test/images/test_studio/11_custom.png",
    prompt: "generate image appropriate for the text. text: Test beat text\nnatural",
    imageParams: {
      model: "dall-e-3",
      style: "natural",
      moderation: true,
    },
    movieFile: undefined,
    images: [],
  };

  assert.deepStrictEqual(result, expected);
});

test("imagePreprocessAgent - empty imageRefs", async () => {
  const context = createMockContext();
  const beat = createMockBeat();
  const imageAgentInfo = createMockImageAgentInfo();

  const result = await imagePreprocessAgent({
    context,
    beat,
    index: 12,
    suffix: "p",
    imageDirPath: "/test/images",
    imageAgentInfo,
    imageRefs: {},
  });

  const expected = {
    imagePath: "/test/images/test_studio/12p.png",
    prompt: "generate image appropriate for the text. text: Test beat text\nnatural",
    imageParams: {
      model: "dall-e-3",
      style: "natural",
      moderation: true,
    },
    movieFile: undefined,
    images: [],
  };

  assert.deepStrictEqual(result, expected);
});

test("imagePreprocessAgent - with real sample data", async () => {
  // Load real sample script
  const scriptPath = path.join(__dirname, "../../scripts/test/test.json");
  const scriptData = JSON.parse(fs.readFileSync(scriptPath, "utf8"));
  
  const context = createMockContext();
  context.studio.filename = "test";
  
  const imageAgentInfo = createMockImageAgentInfo();
  
  // Test with the first beat that has imagePrompt
  const beatWithImagePrompt = scriptData.beats.find((beat: any) => beat.imagePrompt);
  if (beatWithImagePrompt) {
    const result = await imagePreprocessAgent({
      context,
      beat: beatWithImagePrompt,
      index: 1,
      suffix: "p",
      imageDirPath: "/test/images",
      imageAgentInfo,
      imageRefs: {},
    });

    const expected = {
      imagePath: "/test/images/test/1p.png",
      prompt: "Blue sky, a flock of birds\n<style>sumie-style",
      imageParams: {
        model: "dall-e-3", // From imageAgentInfo
        style: "<style>sumie-style", // From beat override
        moderation: true, // From imageAgentInfo
      },
      movieFile: undefined,
      images: [],
    };

    assert.deepStrictEqual(result, expected);
  }
});

// Text, imagePrompt, moviePrompt combination patterns
test("imagePreprocessAgent - text only", async () => {
  const context = createMockContext();
  const beat = createMockBeat({
    text: "Only text content",
    // No imagePrompt, no moviePrompt
  });
  const imageAgentInfo = createMockImageAgentInfo();

  const result = await imagePreprocessAgent({
    context,
    beat,
    index: 13,
    suffix: "p",
    imageDirPath: "/test/images",
    imageAgentInfo,
    imageRefs: {},
  });

  const expected = {
    imagePath: "/test/images/test_studio/13p.png",
    prompt: "generate image appropriate for the text. text: Only text content\nnatural",
    imageParams: {
      model: "dall-e-3",
      style: "natural",
      moderation: true,
    },
    movieFile: undefined,
    images: [],
  };

  assert.deepStrictEqual(result, expected);
});

test("imagePreprocessAgent - imagePrompt only", async () => {
  const context = createMockContext();
  const beat = createMockBeat({
    text: undefined,
    imagePrompt: "Only image prompt",
    // No moviePrompt
  });
  const imageAgentInfo = createMockImageAgentInfo();

  const result = await imagePreprocessAgent({
    context,
    beat,
    index: 14,
    suffix: "p",
    imageDirPath: "/test/images",
    imageAgentInfo,
    imageRefs: {},
  });

  const expected = {
    imagePath: "/test/images/test_studio/14p.png",
    prompt: "Only image prompt\nnatural",
    imageParams: {
      model: "dall-e-3",
      style: "natural",
      moderation: true,
    },
    movieFile: undefined,
    images: [],
  };

  assert.deepStrictEqual(result, expected);
});

test("imagePreprocessAgent - moviePrompt only", async () => {
  const context = createMockContext();
  const beat = createMockBeat({
    text: undefined,
    // No imagePrompt
    moviePrompt: "Only movie prompt",
  });
  const imageAgentInfo = createMockImageAgentInfo();

  const result = await imagePreprocessAgent({
    context,
    beat,
    index: 15,
    suffix: "p",
    imageDirPath: "/test/images",
    imageAgentInfo,
    imageRefs: {},
  });

  const expected = {
    imageParams: {
      model: "dall-e-3",
      style: "natural",
      moderation: true,
    },
    movieFile: "/test/images/test_studio/15.mov",
    images: [],
  };

  assert.deepStrictEqual(result, expected);
});

test("imagePreprocessAgent - text + moviePrompt (no imagePrompt)", async () => {
  const context = createMockContext();
  const beat = createMockBeat({
    text: "Text with movie",
    // No imagePrompt
    moviePrompt: "Movie prompt",
  });
  const imageAgentInfo = createMockImageAgentInfo();

  const result = await imagePreprocessAgent({
    context,
    beat,
    index: 16,
    suffix: "p",
    imageDirPath: "/test/images",
    imageAgentInfo,
    imageRefs: {},
  });

  // When moviePrompt is present and imagePrompt is NOT present,
  // the function returns only imageParams, movieFile, and images (no imagePath or prompt)
  const expected = {
    imageParams: {
      model: "dall-e-3",
      style: "natural",
      moderation: true,
    },
    movieFile: "/test/images/test_studio/16.mov",
    images: [],
  };

  assert.deepStrictEqual(result, expected);
});

test("imagePreprocessAgent - imagePrompt + moviePrompt (no text)", async () => {
  const context = createMockContext();
  const beat = createMockBeat({
    text: undefined,
    imagePrompt: "Image prompt",
    moviePrompt: "Movie prompt",
  });
  const imageAgentInfo = createMockImageAgentInfo();

  const result = await imagePreprocessAgent({
    context,
    beat,
    index: 17,
    suffix: "p",
    imageDirPath: "/test/images",
    imageAgentInfo,
    imageRefs: {},
  });

  const expected = {
    imagePath: "/test/images/test_studio/17p.png",
    prompt: "Image prompt\nnatural",
    imageParams: {
      model: "dall-e-3",
      style: "natural",
      moderation: true,
    },
    movieFile: "/test/images/test_studio/17.mov",
    images: [],
  };

  assert.deepStrictEqual(result, expected);
});

test("imagePreprocessAgent - text + imagePrompt + moviePrompt (all three)", async () => {
  const context = createMockContext();
  const beat = createMockBeat({
    text: "Text content",
    imagePrompt: "Image prompt",
    moviePrompt: "Movie prompt",
  });
  const imageAgentInfo = createMockImageAgentInfo();

  const result = await imagePreprocessAgent({
    context,
    beat,
    index: 18,
    suffix: "p",
    imageDirPath: "/test/images",
    imageAgentInfo,
    imageRefs: {},
  });

  const expected = {
    imagePath: "/test/images/test_studio/18p.png",
    prompt: "Image prompt\nnatural", // imagePrompt takes precedence over text
    imageParams: {
      model: "dall-e-3",
      style: "natural",
      moderation: true,
    },
    movieFile: "/test/images/test_studio/18.mov",
    images: [],
  };

  assert.deepStrictEqual(result, expected);
});

test("imagePreprocessAgent - no text, no imagePrompt, no moviePrompt", async () => {
  const context = createMockContext();
  const beat = createMockBeat({
    text: undefined,
    // No imagePrompt, no moviePrompt
  });
  const imageAgentInfo = createMockImageAgentInfo();

  const result = await imagePreprocessAgent({
    context,
    beat,
    index: 19,
    suffix: "p",
    imageDirPath: "/test/images",
    imageAgentInfo,
    imageRefs: {},
  });

  const expected = {
    imagePath: "/test/images/test_studio/19p.png",
    prompt: "generate image appropriate for the text. text: undefined\nnatural",
    imageParams: {
      model: "dall-e-3",
      style: "natural",
      moderation: true,
    },
    movieFile: undefined,
    images: [],
  };

  assert.deepStrictEqual(result, expected);
});

test("imagePreprocessAgent - with both text and imagePrompt", async () => {
  const context = createMockContext();
  const beat = createMockBeat({
    text: "Beat text content",
    imagePrompt: "Custom image prompt",
  });
  const imageAgentInfo = createMockImageAgentInfo();

  const result = await imagePreprocessAgent({
    context,
    beat,
    index: 20,
    suffix: "p",
    imageDirPath: "/test/images",
    imageAgentInfo,
    imageRefs: {},
  });

  const expected = {
    imagePath: "/test/images/test_studio/20p.png",
    prompt: "Custom image prompt\nnatural", // imagePrompt takes precedence
    imageParams: {
      model: "dall-e-3",
      style: "natural",
      moderation: true,
    },
    movieFile: undefined,
    images: [],
  };

  assert.deepStrictEqual(result, expected);
});

test("imagePreprocessAgent - with imageParams override", async () => {
  const context = createMockContext();
  const beat = createMockBeat({
    imagePrompt: "A beautiful sunset",
    imageParams: {
      style: "photorealistic",
      model: "dall-e-2",
    },
  });
  const imageAgentInfo = createMockImageAgentInfo();

  const result = await imagePreprocessAgent({
    context,
    beat,
    index: 21,
    suffix: "p",
    imageDirPath: "/test/images",
    imageAgentInfo,
    imageRefs: {},
  });

  const expected = {
    imagePath: "/test/images/test_studio/21p.png",
    prompt: "A beautiful sunset\nphotorealistic",
    imageParams: {
      model: "dall-e-2", // From beat override
      style: "photorealistic", // From beat override
      moderation: true, // From imageAgentInfo
    },
    movieFile: undefined,
    images: [],
  };

  assert.deepStrictEqual(result, expected);
});