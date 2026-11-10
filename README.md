# lcoastal.github.io
goat level project

Prospecting Toolkit by @__coastal. The live site is `index.html`, one file with every tool, picture and bit of data
built in, so switching tools never loads anything.

**Don't edit `index.html` by hand.** Edit the files in `src/` and push. GitHub Actions rebuilds `index.html` for you.
To build it yourself, run `node build.mjs` (needs Node 18 or newer, nothing else).

## Where things are

```
src/
  page.html          the page skeleton: header comment, top bar, menu markup; @@...@@ lines are filled in by the build
  version.txt        the version shown in the toolkit (bump only when functionality changes)
  shell/
    styles.css       the shell's styling and themes
    js/              the shell's script, split by job; joined in file-name order
                     (01-image-lookup … 05-tool-frames … 08-menu … 17-search … 19-startup)
  tools/
    tools.json       tool ids, in order
    <tool>/          one folder per tool: index.html plus its style.css / script.js
                     (<style data-file="style.css"></style> in index.html is replaced by that file)
  shared/
    common.html      head + styles shared by most tools  (tools use it as %%COMMON%%)
    route.html       farm-route pieces                   (%%ROUTE%%)
  data/
    data.json        which data files make up window.PTDATA, in order
    <key>.js         one per PTDATA key (mins, gear, ench, x2, equip, …)
    minerals-list.json   the minerals list shared by Minerals + Locations (%%MINS%%)
  images/
    images.json      every picture's label ("Mineral: Copper") and file, in order
    <kind>/*.webp    the pictures; tools refer to them as %%IMG:Mineral: Copper%%
build.mjs            builds index.html from src/  (node build.mjs --check: is index.html up to date?)
```

## Adding things

- **A picture:** put the .webp in `src/images/<kind>/` and add `["Kind: Name", "kind/name.webp"]` to `images.json`.
- **A tool:** make `src/tools/<id>/index.html` (+ css/js files) and add the id to `tools/tools.json`; then add it to
  the menu in `src/shell/js/04-tool-list.js` and `08-menu.js`.
- **Data:** edit the matching file in `src/data/`.
