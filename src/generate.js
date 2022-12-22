#!/usr/bin/env node
"use strict";

import remapCss from "remap-css";
import fs from "fs-extra";
import { join, parse } from "path";
import { fileURLToPath } from 'url'

import mappings from "./mappings.js";

const { readFile, readdir, outputFile } = fs

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const sourceFile = join(__dirname, "style_original.css");
const themesFolder = join(__dirname, "themes");
const outputFolder = join(__dirname, "..", "styles");
const remapOptions = { validate: true, keep: true };

const exit = (err) => {
  if (err) console.error(err);
  process.exit(err ? 1 : 0);
};

async function main() {
  const initialCss = await readFile(sourceFile, "utf8");
  const themes = await readdir(themesFolder);
  await Promise.all(themes.map(async (file) => {
    const themeColors = await readFile(join(themesFolder, file), "utf8")
    const sourceCss = themeColors + initialCss;
    const output = await remapCss([{ css: sourceCss }], mappings, remapOptions);
    const name = parse(file).name;
    return outputFile(join(outputFolder, name, 'css', 'style.css'), output);
  }))
}

main().then(exit).catch(exit);
