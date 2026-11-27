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
// pinned and recently used tools, at the top of the menu (kept per browser)
const ENTRIES = GROUPS.flatMap((g) => g[4]).filter((x) => LIST.some((t) => t.id === x[0]));
const entKey = (x) => x[0] + (x[2] ? ":" + x[2] : "");
const entByKey = (k) => ENTRIES.find((x) => entKey(x) === k);
const ldKeys = (k) => {
  try {
    const v = JSON.parse(localStorage.getItem(k) || "[]");
    return Array.isArray(v) ? v.filter(entByKey) : [];
  } catch (e) {
    return [];
  }
};
const svKeys = (k, v) => {
  try {
    localStorage.setItem(k, JSON.stringify(v));
  } catch (e) {}
};
let PINS = ldKeys("pt-pins"),
  RTOOLS = ldKeys("pt-rtools");
let CURNAV = ["", ""];
const navHTML = (x, pinBtn) => {
  const k = entKey(x),
    pinned = PINS.includes(k),
    nm = entryName(x);
  return `<div class="navw"><button type="button" class="nav"${pinBtn ? ` id="nav-${x[0]}${x[2] ? "-" + x[2] : ""}"` : ""} data-go="${k}" data-tool="${x[0]}"${x[2] ? ` data-sub="${x[2]}"` : ""}><span class="ntx"><b>${nm}</b><span>${entryDesc(x)}</span></span></button><button type="button" class="pin${pinned ? " on" : ""}" data-pin="${k}" aria-pressed="${pinned}" aria-label="${pinned ? "Unpin" : "Pin"} ${nm}" title="${pinned ? "Unpin" : "Pin to the top"}">${pinned ? "★" : "☆"}</button></div>`;
};
const quick = document.createElement("div");
quick.className = "dgrp quick";
quick.id = "quick";
quick.style.setProperty("--gc", "var(--muted)");
drawer.appendChild(quick);
function drawQuick() {
  const rec = RTOOLS.filter((k) => !PINS.includes(k)).slice(0, 5);
  quick.hidden = !PINS.length && !rec.length;
  quick.innerHTML =
    (PINS.length ? `<div class="dsec">Pinned</div>${PINS.map((k) => navHTML(entByKey(k))).join("")}` : "") +
    (rec.length
      ? `<div class="dsec">Recent tools<button type="button" class="rclr" data-rtclr>Clear</button></div>${rec.map((k) => navHTML(entByKey(k))).join("")}`
      : "");
  drawer.querySelectorAll("[data-pin]").forEach((b) => {
    const on = PINS.includes(b.dataset.pin),
      nm = entryName(entByKey(b.dataset.pin));
    b.classList.toggle("on", on);
    b.textContent = on ? "★" : "☆";
    b.setAttribute("aria-pressed", String(on));
    b.setAttribute("aria-label", (on ? "Unpin " : "Pin ") + nm);
    b.title = on ? "Unpin" : "Pin to the top";
  });
  if (CURNAV[0] && typeof ptMarkNav === "function") ptMarkNav(CURNAV[0], CURNAV[1]);
}
window.ptToolSeen = (id, sub) => {
  CURNAV = [id, sub || ""];
  const x = ENTRIES.find((e) => e[0] === id && (!e[2] || e[2] === sub));
  if (!x || id === "home") return;
  const k = entKey(x);
  if (RTOOLS[0] === k) return;
  RTOOLS = [k, ...RTOOLS.filter((r) => r !== k)].slice(0, 8);
  svKeys("pt-rtools", RTOOLS);
  drawQuick();
};
drawer.addEventListener("click", (e) => {
  const p = e.target.closest("[data-pin]");
  if (p) {
    const k = p.dataset.pin;
    PINS = PINS.includes(k) ? PINS.filter((x) => x !== k) : [...PINS, k];
    svKeys("pt-pins", PINS);
    drawQuick();
    const again = drawer.querySelector(`.navw:not(#quick .navw) [data-pin="${k}"]`) || drawer.querySelector(`[data-pin="${k}"]`);
    if (!p.isConnected && again) again.focus();
    return;
  }
  if (e.target.closest("[data-rtclr]")) {
    RTOOLS = [];
    svKeys("pt-rtools", RTOOLS);
    drawQuick();
    return;
  }
  const g = e.target.closest("[data-go]");
  if (!g) return;
  const x = entByKey(g.dataset.go);
  if (!x) return;
  if (x[2]) openHubTab(x[0], x[2]);
  else show(x[0]);
  closeMenu();
});
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
  g.innerHTML =
    `<div class="dsec">${title}</div>` +
    items
      .filter((x) => LIST.some((t) => t.id === x[0]))
      .map((x) => navHTML(x, true))
      .join("");
  drawer.appendChild(g);
});
drawQuick();
