#!/usr/bin/env node
// Builds index.html (the whole site in one file) from the pieces in src/.
//
//   node build.mjs           write index.html
//   node build.mjs --check   fail if index.html is not what src/ builds (used by GitHub Actions)
//
// No dependencies: plain Node 18+.
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(ROOT, "src");
const OUT = path.join(ROOT, "index.html");
const read = (rel) => fs.readFileSync(path.join(SRC, rel), "utf8");
const readJson = (rel) => JSON.parse(read(rel));
const indent = (text, n) =>
  text
    .replace(/\n$/, "")
    .split("\n")
    .map((l) => (l === "" ? l : " ".repeat(n) + l))
    .join("\n");

const VERSION = read("version.txt").trim();

// A JS string literal, written the same way the page has always had them:
// JSON-style escapes, "</" written as "<\/" so it can't end the <script>, and
// whichever quote mark needs fewer escapes.
function jsString(s) {
  let body = JSON.stringify(s).slice(1, -1).replace(/<\//g, "<\\/").replace(/<!--/g, "<\\!--");
  const dq = (body.match(/"/g) || []).length; // each \" counts once
  const sq = (body.match(/'/g) || []).length;
  if (dq > sq) {
    body = body.replace(/\\"/g, '"').replace(/'/g, "\\'");
    return "'" + body + "'";
  }
  return '"' + body + '"';
}

// "key: value," on one line when the key is short, otherwise the value goes on the next line
const entry = (key, value) => (key.length <= 4 ? `    ${key}: ${value},` : `    ${key}:\n      ${value},`);

// every picture, as "Kind: Name": "data:image/webp;base64,..."
function images() {
  return readJson("images/images.json")
    .map(([label, file]) => {
      const b64 = fs.readFileSync(path.join(SRC, "images", file)).toString("base64");
      return `    ${JSON.stringify(label)}:\n      "data:image/webp;base64,${b64}",`;
    })
    .join("\n");
}

// pieces that many tools share; tools mention them as %%COMMON%%, %%ROUTE%%, %%MINS%%
function parts() {
  const mins = JSON.stringify(readJson("data/minerals-list.json"));
  return [
    entry("COMMON", jsString(read("shared/common.html"))),
    entry("ROUTE", jsString(read("shared/route.html"))),
    entry("MINS", jsString(mins)),
  ].join("\n");
}

// each tool's page, with its <style data-file="..."> / <script data-file="..."> filled in
function tools() {
  return readJson("tools/tools.json")
    .map((id) => {
      const dir = `tools/${id}/`;
      let html = read(dir + "index.html").replace(
        /<(style|script) data-file="([^"]+)"><\/\1>/g,
        (_, tag, file) => `<${tag}>${read(dir + file)}</${tag}>`,
      );
      return entry(id, jsString(html));
    })
    .join("\n");
}

// the shared game data (window.PTDATA), one file per part
function data() {
  return readJson("data/data.json")
    .map((key) => {
      const src = read(`data/${key}.js`);
      const m = src.match(/^export default ([\s\S]*);\n$/);
      if (!m) throw new Error(`src/data/${key}.js must be "export default ...;"`);
      const [first, ...rest] = m[1].split("\n");
      return [`    ${key}: ${first}`, ...rest.map((l) => (l === "" ? l : "    " + l))].join("\n") + ",";
    })
    .join("\n");
}

// the shell's script, in file-name order
function js() {
  const dir = path.join(SRC, "shell/js");
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".js"))
    .sort()
    .map((f) => indent(fs.readFileSync(path.join(dir, f), "utf8"), 2))
    .join("\n");
}

const fill = {
  "@@images@@": images,
  "@@parts@@": parts,
  "@@tools@@": tools,
  "@@data@@": data,
  "@@js@@": js,
};
const out = read("page.html")
  .split("\n")
  .map((l) => {
    const css = l.match(/^@@css (.+)@@$/);
    if (css) return indent(read(css[1]), 2);
    return fill[l] ? fill[l]() : l;
  })
  .join("\n")
  .replace("%%PTVER%%", VERSION);

if (process.argv.includes("--check")) {
  const cur = fs.existsSync(OUT) ? fs.readFileSync(OUT, "utf8") : "";
  if (cur !== out) {
    console.error("index.html is out of date: run  node build.mjs  and commit the result.");
    process.exit(1);
  }
  console.log("index.html is up to date (version " + VERSION + ").");
} else {
  fs.writeFileSync(OUT, out);
  console.log(`Built index.html: ${(out.length / 1024 / 1024).toFixed(2)} MB, version ${VERSION}.`);
}
