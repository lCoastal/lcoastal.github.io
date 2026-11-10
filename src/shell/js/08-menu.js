// menu groups: [title, colour, [tool or hub id, game image (m: mineral, e: equipment, g: gear)]...]
const SECTIONS = [
  [
    "Builds & stats",
    "#14b8a6",
    [
      ["builds", "e:Celestial Rings.png"],
      ["calc", "e:Prismatic Star.png"],
      ["h-equip", "e:ringofchampions.png"],
      ["h-boosts", "m:Aetherium"],
    ],
  ],
  ["Museum", "#a78bfa", [["h-museum", "m:Key of Life"]]],
  [
    "Luck & mutations",
    "#f59e0b",
    [
      ["h-luck", "m:Gold"],
      ["h-muts", "m:Opal"],
    ],
  ],
  [
    "Crafting & gear",
    "#60a5fa",
    [
      ["checklist", "e:Gold Ring.png"],
      ["h-gear", "g:MeteoricPan.png"],
    ],
  ],
  [
    "World",
    "#4ade80",
    [
      ["minerals", "m:Amethyst"],
      ["locations", "m:Azuralite"],
      ["h-quests", "e:MeteorCore.png"],
      ["events", "m:Starshine"],
    ],
  ],
  [
    "More",
    "#94a3b8",
    [
      ["codes", "m:Radiant Gold"],
      ["tierlist", "m:Diamond"],
      ["mechanics", "m:Aetherite"],
      ["flexcard", "m:Diamond"],
      ["testdata", "m:Gold"],
      ["settings", "m:Meteoric Iron"],
    ],
  ],
];
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
SECTIONS.forEach(([title, col, items]) => {
  const g = document.createElement("div");
  g.className = "dgrp";
  g.style.setProperty("--gc", "var(--muted)");
  g.innerHTML = `<div class="dsec">${title}</div>`;
  items.forEach(([id, ic]) => {
    const h = HUBS.find((x) => x[0] === id);
    const t = h ? { id, name: h[1], desc: h[2] } : LIST.find((x) => x.id === id);
    if (!t) return;
    const b = document.createElement("button");
    b.type = "button";
    b.className = "nav";
    b.id = "nav-" + t.id;
    b.innerHTML = `<span class="ntx"><b>${t.name}</b><span>${t.desc}</span></span>`;
    b.onclick = () => {
      show(h ? (HUBLAST[h[0]] && h[3].some((x) => x[0] === HUBLAST[h[0]]) ? HUBLAST[h[0]] : h[3][0][0]) : t.id);
      closeMenu();
    };
    g.appendChild(b);
  });
  drawer.appendChild(g);
});
