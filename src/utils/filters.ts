import "dotenv/config";
import fs from "fs";
import path from "path";
import fsPromise from "fs/promises";
import type { AgentFilterFunction } from "graphai";
import { GraphAILogger } from "graphai";
import { writingMessage } from "./file.js";
import { text2hash } from "./utils.js";
import { MulmoStudioContextMethods } from "../methods/mulmo_studio_context.js";

export const fileCacheAgentFilter: AgentFilterFunction = async (context, next) => {
  const { force, file, index, mulmoContext, sessionType } = context.namedInputs.cache;

  const shouldUseCache = async () => {
    if (force && force.some((element: boolean | undefined) => element)) {
      return false;
    }
    try {
      await fsPromise.access(file);
      return true;
    } catch {
      return false;
    }
  };

  if (await shouldUseCache()) {
    GraphAILogger.debug(`cache: ${path.basename(file)}`);
    return true;
  }
  try {
    MulmoStudioContextMethods.setBeatSessionState(mulmoContext, sessionType, index, true);
    const output = ((await next(context)) as { buffer?: Buffer; text?: string }) || undefined;
    const { buffer, text } = output ?? {};
    if (buffer) {
      writingMessage(file);
      await fsPromise.writeFile(file, buffer);
      return true;
    } else if (text) {
      writingMessage(file);
      await fsPromise.writeFile(file, text, "utf-8");
      return true;
    }
    GraphAILogger.log("no cache, no buffer: " + file);
    return false;
  } finally {
    MulmoStudioContextMethods.setBeatSessionState(mulmoContext, sessionType, index, false);
  }
};

export const browserlessCacheGenerator = (cacheDir: string) => {
  const browserlessCache: AgentFilterFunction = async (context, next) => {
    const cacheKey = text2hash(context?.namedInputs?.url);
    const cachePath = path.resolve(cacheDir, cacheKey + ".txt");
    if (fs.existsSync(cachePath)) {
      // console.log("cache hit!!");
      const text = fs.readFileSync(cachePath, "utf-8");
      return { text };
    }
    // console.log("cache not hit!!");
    const result = (await next(context)) as unknown as { text: string };
    fs.writeFileSync(cachePath, result?.text, "utf8");
    return result;
  };
  return browserlessCache;
};
