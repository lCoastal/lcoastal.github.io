function openMenu() {
  if (pop) pop.hidden = true;
  drawer.hidden = false;
  scrim.hidden = false;
  menuBtn.setAttribute("aria-expanded", "true");
  const c = drawer.querySelector('[aria-current="page"]') || drawer.querySelector(".nav");
  c && c.focus();
}
function closeMenu() {
  drawer.hidden = true;
  scrim.hidden = true;
  menuBtn.setAttribute("aria-expanded", "false");
  menuBtn.focus();
}
menuBtn.onclick = () => (drawer.hidden ? openMenu() : closeMenu());
document.getElementById("closeBtn").onclick = closeMenu;
scrim.onclick = closeMenu;
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !drawer.hidden) closeMenu();
});
drawRecent();
window.addEventListener("hashchange", () => {
  const id = location.hash.slice(1);
  if (TOOLS[id]) show(id);
});
let start = location.hash.slice(1);
if (!TOOLS[start]) {
  try {
    start = localStorage.getItem("pt-tool") || "builds";
  } catch (e) {
    start = "builds";
  }
}
show(start);
