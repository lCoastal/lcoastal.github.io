// search across everything
const sIn = document.getElementById("sIn"),
  sRes = document.getElementById("sRes"),
  srch = document.getElementById("srch");
const D = window.PTDATA;
const IDX = [];
const sNorm = (t) =>
  String(t || "")
    .toLowerCase()
    .replace(/[’‘`]/g, "'");
const add = (name, type, sub, img, act) => IDX.push({ name, lc: sNorm(name), type, sub, img, act });
D.mins.forEach((m) => add(m.n, "Mineral", m.r, m.ic, () => ptOpen("mineral", m.n)));
D.equip.forEach((x) =>
  add(x.n, "Equipment", x.r + " " + x.slot, D.eimg[x.img], () => callTool("equipment", "ptOpenItem", x.n)),
);
[
  ["pans", "Pan"],
  ["shovels", "Shovel"],
  ["sluices", "Sluice"],
].forEach(([k, t]) =>
  D.gear[k].forEach((x) => add(x.name, t, x.location, D.gear.img[x.image], () => callTool(k, "ptOpenItem", x.name))),
);
D.locs.forEach((l) =>
  add(l.n, "Location", l.rg + (l.t !== "None" ? " · toughness " + l.t : ""), "", () => ptOpen("location", l.n)),
);
((D.codes["Active Codes"] || {}).rows || []).forEach((r) =>
  add(r[0], "Code", "active code", "", () => show("codes")),
);
((D.ench || {}).pan || []).forEach((e) =>
  add(e.n + " (pan enchant)", "Enchant", "Pan enchant", "", () => callTool("mutations", "ptOpenTab", "pan")),
);
((D.ench || {}).shovel || []).forEach((e) =>
  add(e.n + " (shovel enchant)", "Enchant", "Shovel enchant", "", () => callTool("mutations", "ptOpenTab", "sh")),
);
((D.ench || {}).muts || []).forEach((m) =>
  add(m.n + " (mutation)", "Mutation", "Equipment mutation ×" + m.x, "", () =>
    callTool("mutations", "ptOpenTab", "mut"),
  ),
);
[
  "Perfect",
  "Treasured",
  "Lunar",
  "Voidtorn",
  "Mutated",
  "Cosmic",
  "Electrified",
  "Iridescent",
  "Irradiated",
  "Crystalline",
  "Scorching",
  "Glowing",
  "Pure",
  "Shiny",
  "Purified",
  "Charming",
  "Rosy",
  "Ghostly",
  "Spooky",
  "Jolly",
  "Hearthflame",
  "Summer",
  "Tidal",
].forEach((n) =>
  add(n + " (mineral mutation)", "Mutation", "Mineral mutation", "", () => callTool("minmuts", "ptFind", n)),
);
const X2 = D.x2 || {};
(X2.quests || []).forEach((q) =>
  add(q.n, "Quest", (q.npc ? q.npc + " · " : "") + q.loc, "", () => callTool("quests", "ptOpenItem", q.n)),
);
{
  const seen = new Set();
  (X2.npcs || []).forEach((n) => {
    if (seen.has(n.n)) return;
    seen.add(n.n);
    add(n.n, "NPC", n.reg, "", () => callTool("npcs", "ptOpenItem", n.n));
  });
}
(X2.potions || []).forEach((p) => add(p.n, "Potion", p.fx, "", () => callTool("items", "ptOpenTab", "pot")));
(X2.trinkets || []).forEach((t) => add(t.n, "Trinket", t.fx, "", () => callTool("items", "ptOpenTab", "trn")));
(X2.runes || []).forEach((r) =>
  add(r.n + " rune", "Rune", r.d, r.ic || "", () => callTool("runes", "ptOpenItem", r.n)),
);
(X2.events || []).forEach((e) => add(e.n, "Event", e.cat || "Event", "", () => show("events")));
LIST.forEach((t) => add(t.name, "Tool", t.desc, "", () => show(t.id)));
const ESC = (s) =>
  String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
let hits = [],
  sel = 0;
function search() {
  const q = sNorm(sIn.value.trim());
  if (!q) {
    sRes.hidden = true;
    sIn.setAttribute("aria-expanded", "false");
    return;
  }
  hits = IDX.map((x) => ({
    x,
    s:
      x.lc === q
        ? 0
        : x.lc.startsWith(q)
          ? 1
          : x.lc.split(/\s+/).some((w) => w.startsWith(q))
            ? 2
            : x.lc.includes(q)
              ? 3
              : (x.sub || "").toLowerCase().includes(q)
                ? 4
                : 9,
  }))
    .filter((h) => h.s < 9)
    .sort(
      (a, b) =>
        a.s - b.s ||
        (window.ptStore.get(b.x.name).fav ? 1 : 0) - (window.ptStore.get(a.x.name).fav ? 1 : 0) ||
        a.x.name.localeCompare(b.x.name),
    )
    .slice(0, 30);
  // group by type, groups ordered by their best match
  const order = [];
  hits.forEach((h) => {
    if (!order.includes(h.x.type)) order.push(h.x.type);
  });
  hits = order.flatMap((t) => hits.filter((h) => h.x.type === t)).map((h) => h.x);
  sel = 0;
  let html = "",
    last = "";
  hits.forEach((x, i) => {
    if (x.type !== last) {
      html += `<div class="grp" role="presentation">${x.type === "Equipment" ? "Equipment" : x.type + "s"}</div>`;
      last = x.type;
    }
    html += `<button type="button" role="option" id="sr${i}" data-i="${i}" aria-selected="${i === sel}"><span class="ri">${x.img ? `<img src="${x.img}" alt="">` : ""}</span><span class="rt"><b>${ESC(x.name)}</b><span>${ESC(x.sub || "")}</span></span>${window.ptStore.get(x.name).fav ? '<span class="st" aria-label="favourite">★</span>' : ""}</button>`;
  });
  // keep groups in first-seen order but list order must match index order for arrow keys
  sRes.innerHTML = html || '<div class="none">Nothing found.</div>';
  sRes.hidden = false;
  sIn.setAttribute("aria-expanded", "true");
  mark();
}
function mark() {
  sRes.querySelectorAll("[data-i]").forEach((b) => b.setAttribute("aria-selected", String(+b.dataset.i === sel)));
  const b = sRes.querySelector(`[data-i="${sel}"]`);
  if (b) {
    b.scrollIntoView({ block: "nearest" });
    sIn.setAttribute("aria-activedescendant", b.id);
  }
}
function pick(i) {
  const x = hits[i];
  if (!x) return;
  sRes.hidden = true;
  sIn.value = "";
  sIn.setAttribute("aria-expanded", "false");
  srch.classList.remove("open");
  x.act();
}
sIn.addEventListener("input", search);
sIn.addEventListener("keydown", (e) => {
  if (e.key === "ArrowDown") {
    e.preventDefault();
    sel = Math.min(hits.length - 1, sel + 1);
    mark();
  } else if (e.key === "ArrowUp") {
    e.preventDefault();
    sel = Math.max(0, sel - 1);
    mark();
  } else if (e.key === "Enter") {
    e.preventDefault();
    pick(sel);
  } else if (e.key === "Escape") {
    sIn.value = "";
    sRes.hidden = true;
    srch.classList.remove("open");
  }
});
sRes.addEventListener("mousedown", (e) => e.preventDefault());
sRes.addEventListener("click", (e) => {
  const b = e.target.closest("[data-i]");
  if (b) pick(+b.dataset.i);
});
sIn.addEventListener("blur", () =>
  setTimeout(() => {
    sRes.hidden = true;
    srch.classList.remove("open");
  }, 120),
);
document.getElementById("sBtn").onclick = () => {
  srch.classList.add("open");
  sIn.focus();
};
