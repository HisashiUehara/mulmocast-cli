import { getAvailablePromptTemplates, getAvailableScriptTemplates } from "../src/utils/file.js";
import fs from "fs";
import util from "util";


const main = () => {
  const promptTemplates = getAvailablePromptTemplates();
  const promptData = util.inspect(promptTemplates, {
    depth: null,
    compact: false,
    sorted: true,
    breakLength: 120,
  });
  const promptTsExport = `export const promptTemplates = ${promptData}\n`;
  fs.writeFileSync("./src/data/promptTemplates.ts", promptTsExport, "utf8");

  //  console.log(promptTsExport);

  const scriptTemplates = getAvailableScriptTemplates();
  const scriptData = util.inspect(scriptTemplates, {
    depth: null,
    compact: false,
    sorted: true,
    breakLength: 120,
  });
  const scriptTsExport = `export const scriptTemplates = ${scriptData}\n`;
  //  console.log(scriptTsExport);
  fs.writeFileSync("./src/data/scriptTemplates.ts", scriptTsExport, "utf8");

  
};

main();
