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
window.ptAccentCSS = () => {
  const a = PT_ACCENTS[SET.accent] || PT_ACCENTS.teal;
  const L = `--accent:${a[1]};--accent-fg:#ffffff`,
    D = `--accent:${a[2]};--accent-fg:#101418`;
  return `:root:root{${L}}@media (prefers-color-scheme:dark){:root:root:not([data-theme="light"]){${D}}}:root:root[data-theme="dark"]{${D}}`;
};
// the toolkit's own look, added to every tool page: gold title marker, rarity-tinted icons, cut corners
window.ptLookCSS = () =>
  ':root{--gold:#a87400}@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--gold:#e0b04a}}:root[data-theme="dark"]{--gold:#e0b04a}' +
  '.wrap>header h1::before{content:"";display:inline-block;width:.36em;height:.36em;margin:0 .42em .14em .06em;background:var(--gold);transform:rotate(45deg);vertical-align:middle;box-shadow:0 0 10px color-mix(in srgb,var(--gold) 45%,transparent)}' +
  '[style*="--rc"] .icon{background:radial-gradient(circle at 50% 58%,color-mix(in srgb,var(--nc,var(--rc)) 24%,transparent),transparent 72%),var(--sunk,rgba(127,127,127,.08));box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--nc,var(--rc)) 38%,transparent)}' +
  "@supports (corner-shape:bevel){*,*::before,*::after{corner-shape:bevel}" +
  ".rt-num,.rarh i,.sheet .tips li::before,.sheet .runes img,.swc button,.stop .num,.dot,.pchip i,.spin,.sw,.sw::after,.swb{corner-shape:round}}";
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
