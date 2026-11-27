// the menu: every tool, grouped (groups are in 07-hubs.js)
const navImg = (src) => {
  const D = window.PTDATA || {};
  const [k, n] = [src.slice(0, 1), src.slice(2)];
  if (k === "m") {
    const m = (D.mins || []).find((x) => x.n === n);
    return (m && m.ic) || "";
  }
  if (k === "e") return (D.eimg || {})[n] || "";
  if (k === "g") return ((D.gear || {}).img || {})[n] || "";
  return "";
};
{
  const r = document.createElement("div");
  r.className = "dgrp recent";
  r.id = "recent";
  r.hidden = true;
  r.style.setProperty("--gc", "var(--muted)");
  r.innerHTML =
    '<div class="dsec">Recently viewed<button type="button" class="rclr">Clear</button></div><div class="rlist"></div>';
  drawer.appendChild(r);
  r.addEventListener("click", (e) => {
    const x = e.target.closest("[data-rx]");
    if (x) {
      RECENT.splice(+x.dataset.rx, 1);
      try {
        localStorage.setItem("pt-recent", JSON.stringify(RECENT));
      } catch (_) {}
      drawRecent();
      return;
    }
    if (e.target.closest(".rclr")) {
      RECENT = [];
      try {
        localStorage.removeItem("pt-recent");
      } catch (_) {}
      drawRecent();
      return;
    }
    const b = e.target.closest("[data-ri]");
    if (!b) return;
    const it = RECENT[+b.dataset.ri];
    closeMenu();
    ptOpenWho(it);
  });
}
GROUPS.forEach(([gid, title, col, tabs, items]) => {
  const g = document.createElement("div");
  g.className = "dgrp";
  g.style.setProperty("--gc", "var(--muted)");
  g.innerHTML = `<div class="dsec">${title}</div>`;
  items.forEach((x) => {
    const [id, , sub] = x;
    if (!LIST.some((t) => t.id === id)) return;
    const b = document.createElement("button");
    b.type = "button";
    b.className = "nav";
    b.id = "nav-" + id + (sub ? "-" + sub : "");
    b.dataset.tool = id;
    if (sub) b.dataset.sub = sub;
    b.innerHTML = `<span class="ntx"><b>${entryName(x)}</b><span>${entryDesc(x)}</span></span>`;
    b.onclick = () => {
      if (sub) openHubTab(id, sub);
      else show(id);
      closeMenu();
    };
    g.appendChild(b);
  });
  drawer.appendChild(g);
});
