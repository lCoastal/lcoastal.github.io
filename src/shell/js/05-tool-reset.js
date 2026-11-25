// "Reset this tool": puts one tool's inputs and view back to default. Saved builds, loadouts, boards and lists stay.
const PT_RESET = {
  builds: { keys: ["pbs-builds", "pbs-current", "pbs-fold", "pbs-hidep", "pbs-rings", "pbs-view"], what: "every build sheet, its name and the view" },
  planner: { keys: ["mp-board", "mp-board-b", "mp-cmp", "mp-cmp-hide", "mp-cmp-names"], what: "the boards and comparison view (saved loadouts stay)" },
  boosts: { keys: ["mb-incmut", "mb-stat", "mb-zone", "mb-pick", "mb-mpick", "mb-pickon", "mb-name"] },
  minerals: { keys: ["pm-filters"] },
  locations: { keys: ["pl-loc", "pl-tcopy"] },
  pans: { keys: ["pg-pans"] },
  shovels: { keys: ["pg-shovels"] },
  sluices: { keys: ["pg-sluices"] },
  sluiceplan: { keys: ["psp-s"] },
  mododds: { keys: ["pmo-s"] },
  weightrange: { keys: ["wr-s"] },
  sizefinder: { keys: ["sf-s"] },
  pansize: { keys: ["ps-s"] },
  rpm: { keys: ["rpm-s"] },
  farmroute: { keys: ["pfr-s"], keep: { "pfr-s": ["cl", "cc"] }, what: "inputs and ticks (saved lists stay)" },
  minmuts: { keys: ["pmm-s", "pt-sellcalc"] },
  runes: { keys: ["pr-s"] },
  odds: { keys: ["po-s"] },
  bestcap: { keys: ["pt-bestcap"] },
  buildcmp: { keys: ["pt-bcmp"] },
  dredge: { keys: ["pt-dredge"] },
  eqload: { keys: ["pt-eqload"] },
  craftquality: { keys: ["c5-s"] },
  eqcompare: { keys: ["eqc-s"] },
  museumfind: { keys: ["pmf-s"] },
  museumopt: { keys: ["mo-s"] },
  quests: { keys: ["pq-f"], what: "filters (your ticked quests stay)" },
  items: { keys: ["pi-cur", "pi-hidetm", "pi-tab"] },
  mutations: { keys: ["pmu-catf", "pmu-hide", "pmu-ofmt", "pmu-pan", "pmu-tab"] },
  equipment: { keys: ["pe-f"] },
  mechanics: { keys: ["pmc-s"] },
  calc: { keys: ["pcalc", "pc-hidepots"], what: "your gear setup and view (saved loadouts stay)" },
  tierlist: { keys: ["pt-tier"], what: "your tier list arrangement" },
  testlog: { keys: ["tl-s"] },
  checklist: { keys: ["pc-list"], what: "everything on the checklist" },
  bestbuild: { keys: ["pt-bestbuild"], what: "the goal, choices and assumptions (your owned ticks stay)" },
  buildmaker: { keys: ["pt-buildmaker"], what: "the weights, consumables, events and choices" },
  // these keep nothing between visits, so a reset just reloads them: searches, filters and open sections clear
  home: { keys: [], what: "the page" },
  npcs: { keys: [], what: "the search and filters" },
  events: { keys: [], what: "the view" },
  formulas: { keys: [], what: "the search" },
  testdata: { keys: [], what: "the loaded file and results (nothing was saved)" },
  codes: { keys: [], what: "the view" },
  settings: { keys: ["pt-settings", "pt-compact"], reloadAll: true, what: "theme, accent and display settings (your stats stay)" },
};
function ptAddReset(f, id) {
  const R = PT_RESET[id];
  let d;
  try {
    d = f.contentDocument;
  } catch (e) {
    return;
  }
  const ft = d && d.querySelector(".pt-ft");
  if (!R || !ft || ft.querySelector(".pt-rs")) return;
  const b = d.createElement("button");
  b.type = "button";
  b.className = "pt-rs";
  b.style.cssText =
    "flex-basis:auto;margin:4px auto 0;padding:3px 12px;border-radius:999px;border:1px solid var(--line,#8884);background:transparent;color:var(--muted,#888);font:500 12px/1.4 inherit;cursor:pointer";
  const label = "Reset this tool";
  b.textContent = label;
  b.title = "Puts " + (R.what || "this tool's inputs and view") + " back to default";
  const wrap = d.createElement("div");
  wrap.style.cssText = "flex-basis:100%;display:flex;justify-content:center";
  wrap.appendChild(b);
  const ver = ft.querySelector(".pt-ver");
  ft.insertBefore(wrap, ver || null);
  let armed = 0;
  b.onclick = () => {
    if (!armed) {
      armed = setTimeout(() => {
        armed = 0;
        b.textContent = label;
        b.style.color = "";
        b.style.borderColor = "";
      }, 4000);
      b.textContent = "Click again to reset";
      b.style.color = b.style.borderColor = "var(--neg,#d33)";
      return;
    }
    clearTimeout(armed);
    R.keys.forEach((k) => {
      try {
        const keep = R.keep && R.keep[k];
        if (keep) {
          const o = JSON.parse(localStorage.getItem(k) || "{}"),
            n = {};
          keep.forEach((p) => {
            if (o[p] !== undefined) n[p] = o[p];
          });
          localStorage.setItem(k, JSON.stringify(n));
        } else localStorage.removeItem(k);
      } catch (e) {}
    });
    if (R.reloadAll) {
      location.reload();
      return;
    }
    f.dataset.ok = "";
    f.srcdoc = f.srcdoc;
  };
}
