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
const add = (name, type, sub, img, act, kw) =>
  IDX.push({ name, lc: sNorm(name), type, sub, img, act, kw: kw ? sNorm(name + " " + sub + " " + kw).split(/[^a-z0-9%']+/) : null });
// words people use for what they want to do, so a goal finds the right tool
const KW = {
  home: "start begin",
  bestbuild: "best build goal loadout setup what to wear exotic mythic farm money rare finds per minute",
  buildmaker: "best build stat priority weights loadout setup one tap strength speed",
  calc: "stats stat panel total my stats luck capacity strength speed calculate",
  rpm: "rolls per minute pans per minute digs shakes speed how fast time",
  builds: "build guide sheet write share image",
  buildcmp: "compare builds which build better versus vs",
  odds: "chance chances odds drop rate how many pans find get mineral luck",
  bestcap: "luck cap best luck too much luck zone where to pan",
  mododds: "modifier chance odds lunar night mutation shiny glowing how many",
  minmuts: "modifier value worth sell price museum boost mineral mutation",
  weightrange: "weight heavy kg biggest smallest max weight size",
  sizefinder: "size boost need weight kg target heavy",
  pansize: "pan size how many minerals per pan capacity fit",
  planner: "museum plan slots totals boosts",
  boosts: "museum boost each mineral max weight value",
  museumfind: "best museum fill goal optimise optimize",
  museumopt: "improve museum better upgrade",
  farmroute: "farm route where to farm zones museum order",
  checklist: "craft crafting materials recipe ingredients what to farm need",
  craftquality: "5 star five star quality ores craft weight stars",
  reforge: "reforge reroll roll max perfect stats stars cost money budget god roll",
  equipment: "rings necklace charm equipment stats recipe",
  eqcompare: "compare rings necklaces charms which better",
  eqload: "loadout equipment rings slots totals",
  pans: "pan stats luck capacity passive",
  shovels: "shovel dig strength dig speed toughness",
  sluices: "sluice stats upgrades",
  sluiceplan: "sluice upgrade points cost mad scientist",
  mutations: "mutation enchant gear pan shovel",
  runes: "rune runes loadout where",
  items: "potion totem trinket effect duration buff",
  minerals: "mineral value price drop rate recipe",
  locations: "location zone area toughness where",
  quests: "quest quests tracker steps",
  dredge: "dredge master requests where to pan luck cap",
  npcs: "npc who where quests",
  events: "event clock timer next meteor shower timed area",
  codes: "codes free redeem",
  mechanics: "how it works explain mechanics luck capacity modifiers weight",
  formulas: "formula formulas math equation",
  testlog: "tests evidence data proof",
  testdata: "check my data test verify",
  "items:pot": "potion potions buff effect duration",
  "items:tot": "totem totems buff",
  "items:trn": "trinket trinkets",
  "mutations:mut": "gear mutation equipment mutation multiplier",
  "mutations:pan": "pan enchant enchants",
  "mutations:sh": "shovel enchant enchants",
  tierlist: "tier list rank ranking",
  settings: "settings theme dark light colour color stats reset",
};

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
  add(l.n, "Location", l.rg + (l.t !== "None" ? ", toughness " + l.t : ""), "", () => ptOpen("location", l.n)),
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
  "Entombed",
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
  add(q.n, "Quest", (q.npc ? q.npc + ", " : "") + q.loc, "", () => callTool("quests", "ptOpenItem", q.n)),
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
LIST.forEach((t) => add(t.name, "Tool", t.desc, "", () => show(t.id), KW[t.id] || " "));
GROUPS.forEach((g) =>
  g[4]
    .filter((x) => x[2])
    .forEach((x) => add(entryName(x), "Tool", entryDesc(x), "", () => openHubTab(x[0], x[2]), KW[x[0] + ":" + x[2]] || " ")),
);
const ESC = (s) =>
  String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
let hits = [],
  sel = 0;
// a tool matches a goal when every word typed starts one of its words ("reroll odds", "how many pans")
const STOP = new Set(["a", "an", "the", "to", "i", "my", "of", "for", "in", "do", "is", "can", "what", "it"]);
function goalHit(x, q) {
  if (!x.kw) return false;
  const ws = q.split(/[^a-z0-9%']+/).filter((w) => w && !STOP.has(w));
  return ws.length > 0 && ws.every((w) => x.kw.some((k) => k.startsWith(w)));
}
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
                : goalHit(x, q)
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
