import { images, pdfPuppeteer } from "../../../actions/index.js";
import { CliArgs } from "../../../types/cli_types.js";
import { initializeContext, runTranslateIfNeeded } from "../../helpers.js";

export const handler = async (argv: CliArgs<{ i?: string; pdf_mode: string; pdf_size: string }>) => {
  const context = await initializeContext(argv);
  if (!context) {
    process.exit(1);
  }
  await runTranslateIfNeeded(context, argv);
  await images(context);

  await pdfPuppeteer(context, argv.pdf_mode, argv.pdf_size);
};
