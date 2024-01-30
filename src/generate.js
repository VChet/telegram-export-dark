import { readFile, readdir, writeFile, mkdir } from "node:fs/promises";
import { dirname, join, parse } from "node:path";
import { fileURLToPath } from 'node:url';
import remapCss from "remap-css";

import mappings from "./mappings.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const sourceFile = join(__dirname, "style_original.css");
const themesFolder = join(__dirname, "themes");
const outputFolder = join(__dirname, "..", "styles");

const exit = (err) => {
  if (err) console.error(err);
  process.exit(err ? 1 : 0);
};

async function main() {
  const initialCss = await readFile(sourceFile, "utf8");
  const themes = await readdir(themesFolder);
  await Promise.all(themes.map(async (file) => {
    const themeColors = await readFile(join(themesFolder, file), "utf8");
    const sourceCss = themeColors + initialCss;
    const output = await remapCss([{ css: sourceCss }], mappings, { validate: true, keep: true });
    const name = parse(file).name;
    const outputPath = join(outputFolder, name, 'css', 'style.css');

    await mkdir(join(outputFolder, name, 'css'), { recursive: true });
    await writeFile(outputPath, output);
  }));
}

main().then(exit).catch(exit);
