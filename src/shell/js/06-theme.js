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
