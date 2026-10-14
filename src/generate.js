import { readFile, readdir, writeFile, mkdir } from "node:fs/promises";
import { dirname, join, parse } from "node:path";
import { fileURLToPath } from "node:url";
import remapCss from "remap-css";
import fetchCss from "fetch-css";

import mappings from "./mappings.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
// https://github.com/telegramdesktop/tdesktop/blob/dev/Telegram/Resources/export_html/css/style.css
const sourceFile = "https://github.com/telegramdesktop/tdesktop/raw/dev/Telegram/Resources/export_html/css/style.css";
const themesFolder = join(__dirname, "themes");
const outputFolder = join(__dirname, "..", "styles");

function exit(error) {
  if (error) console.error(error);
  process.exit(error ? 1 : 0);
}

async function main() {
  const sources = await fetchCss([{ url: sourceFile, strict: true }]);
  if (!sources[0]?.css?.trim()) throw new Error("Upstream CSS is empty or unavailable");

  const generatedCss = await remapCss(sources, mappings, { validate: true, keep: true });
  if (!generatedCss?.trim()) throw new Error("Generated CSS is empty");

  const themes = (await readdir(themesFolder)).filter((file) => file.endsWith(".css"));
  if (!themes.length) throw new Error("No themes found");

  const outputs = await Promise.all(themes.map(async (file) => {
    const themeColors = await readFile(join(themesFolder, file), "utf8");
    const name = parse(file).name;
    const outputPath = join(outputFolder, name, "css", "style.css");
    return {
      outputPath,
      content: `${themeColors.trimEnd()}\n${generatedCss}`
    };
  }));

  for (const { outputPath, content } of outputs) {
    await mkdir(dirname(outputPath), { recursive: true });
    await writeFile(outputPath, content);
  }

  console.info(`Generated ${outputs.length} theme stylesheets`);
}

main().then(exit).catch(exit);
