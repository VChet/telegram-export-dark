#!/usr/bin/env node
"use strict";

const remapCss = require("remap-css");
const { join, parse } = require("path");
const { readdir, readFile, outputFile } = require("fs-extra");

const mappings = require("./mappings")
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
