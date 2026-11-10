// recently viewed (kept per browser)
let RECENT = [];
try {
  RECENT = JSON.parse(localStorage.getItem("pt-recent") || "[]");
  if (!Array.isArray(RECENT)) RECENT = [];
} catch (e) {
  RECENT = [];
}
RECENT = RECENT.filter((r) => r && r.kind !== "Location");
const recentMax = () => {
  let n = 8;
  try {
    const v = JSON.parse(localStorage.getItem("pt-settings") || "{}").recent;
    if (v !== undefined) n = +v;
  } catch (e) {}
  return n >= 0 ? n : 8;
};
RECENT = RECENT.slice(0, recentMax());
window.ptRecent = (kind, name) => {
  if (!kind || !name || kind === "Location" || !recentMax()) return;
  RECENT = [{ kind, name }, ...RECENT.filter((r) => !(r.kind === kind && r.name === name))].slice(0, recentMax());
  try {
    localStorage.setItem("pt-recent", JSON.stringify(RECENT));
  } catch (e) {}
  drawRecent();
};
function drawRecent() {
  const box = document.getElementById("recent");
  if (!box) return;
  box.hidden = !RECENT.length;
  box.querySelector(".rlist").innerHTML = RECENT.map((r, i) => {
    const u = ptIcon(r.kind, r.name);
    return `<div class="rcw"><button type="button" class="rc" data-ri="${i}" title="${ESC(r.kind)}: ${ESC(r.name)}">${u ? `<img src="${u}" alt="">` : `<span class="rl">${ESC(r.name.slice(0, 1))}</span>`}<span>${ESC(r.name)}</span></button><button type="button" class="rx" data-rx="${i}" aria-label="Remove ${ESC(r.name)} from recently viewed" title="Remove">×</button></div>`;
  }).join("");
}
