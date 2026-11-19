// theme (auto follows the device or app, or force light/dark) and accent colour, both from Settings
window.PT_ACCENTS = {
  teal: ["Teal", "#0f7c6b", "#3cc2a8"],
  blue: ["Blue", "#2563eb", "#60a5fa"],
  purple: ["Purple", "#7c3aed", "#a78bfa"],
  pink: ["Pink", "#c0267a", "#f472b6"],
  red: ["Red", "#c62828", "#f87171"],
  orange: ["Orange", "#c2410c", "#fb923c"],
  gold: ["Gold", "#9a6b00", "#facc15"],
};
// font choice: [name, heading font, body font, Google Fonts families to load]
window.PT_FONTS = {
  default: ["Default", '"Chakra Petch"', '"IBM Plex Sans"', ""],
  clean: ["Clean", '"Inter"', '"Inter"', "family=Inter:wght@400;500;600;700"],
  rounded: ["Rounded", '"Nunito"', '"Nunito"', "family=Nunito:wght@400;600;700;800"],
  blocky: ["Blocky", '"Lilita One"', '"Nunito"', "family=Lilita+One&family=Nunito:wght@400;600;700;800"],
  readable: ["Easy to read", '"Atkinson Hyperlegible"', '"Atkinson Hyperlegible"', "family=Atkinson+Hyperlegible:wght@400;700"],
  system: ["System", "system-ui", "system-ui", ""],
};
window.ptFontCSS = () => {
  const f = PT_FONTS[SET.font] || PT_FONTS.default;
  if (f === PT_FONTS.default) return { imp: "", css: "" };
  const tail = ',"Segoe UI",system-ui,sans-serif';
  return {
    imp: f[3] ? `@import url("https://fonts.googleapis.com/css2?${f[3]}&display=swap");` : "",
    css: `:root:root{--f-display:${f[1]}${tail};--f-body:${f[2]}${tail};--f-ui:${f[2]}${tail}}`,
  };
};
window.ptAccentCSS = () => {
  const a = PT_ACCENTS[SET.accent] || PT_ACCENTS.teal;
  const L = `--accent:${a[1]};--accent-fg:#ffffff`,
    D = `--accent:${a[2]};--accent-fg:#101418`;
  const f = ptFontCSS();
  return `${f.imp}:root:root{${L}}@media (prefers-color-scheme:dark){:root:root:not([data-theme="light"]){${D}}}:root:root[data-theme="dark"]{${D}}${f.css}`;
};
// the toolkit's own look, added to every tool page: rarity-tinted icons
window.ptLookCSS = () =>
  '[style*="--rc"] .icon{background:radial-gradient(circle at 50% 58%,color-mix(in srgb,var(--nc,var(--rc)) 24%,transparent),transparent 72%),var(--sunk,rgba(127,127,127,.08));box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--nc,var(--rc)) 38%,transparent)}';
function ptAccentInto(doc) {
  try {
    if (!doc) return;
    let st = doc.getElementById("pt-acc");
    if (!st) {
      st = doc.createElement("style");
      st.id = "pt-acc";
      (doc.head || doc.documentElement).appendChild(st);
    }
    st.textContent = ptAccentCSS();
  } catch (e) {}
}
let hostTheme = document.documentElement.getAttribute("data-theme");
let ownTheme = undefined;
function applyTheme() {
  const r = document.documentElement;
  const want = SET.theme === "light" || SET.theme === "dark" ? SET.theme : hostTheme;
  ownTheme = want || null;
  if (want) r.setAttribute("data-theme", want);
  else r.removeAttribute("data-theme");
  Object.values(frames).forEach(syncTheme);
  try {
    if (pop) syncTheme(pop);
  } catch (e) {}
}
