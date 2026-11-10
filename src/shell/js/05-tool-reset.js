// "Reset this tool": puts one tool's inputs and view back to default. Saved builds, loadouts, boards and lists stay.
const PT_RESET = {
  builds: { keys: ["pbs-current", "pbs-fold", "pbs-hidep", "pbs-rings", "pbs-view"], what: "the open sheet and view (saved builds stay)" },
  boosts: { keys: ["mb-incmut", "mb-stat"] },
  minerals: { keys: ["pm-filters"] },
  locations: { keys: ["pl-loc", "pl-tcopy"] },
  pans: { keys: ["pg-pans"] },
  shovels: { keys: ["pg-shovels"] },
  sluices: { keys: ["pg-sluices"] },
  mododds: { keys: ["pmo-s"] },
  farmroute: { keys: ["pfr-s"], keep: { "pfr-s": ["cl", "cc"] }, what: "inputs and ticks (saved lists stay)" },
  minmuts: { keys: ["pmm-s", "pt-sellcalc"] },
  runes: { keys: ["pr-s"] },
  odds: { keys: ["po-s"] },
  bestcap: { keys: ["pt-bestcap"] },
  buildcmp: { keys: ["pt-bcmp"] },
  dredge: { keys: ["pt-dredge"] },
  eqload: { keys: ["pt-eqload"] },
  museumfind: { keys: ["pmf-s"] },
  quests: { keys: ["pq-f"], what: "filters (your ticked quests stay)" },
  items: { keys: ["pi-cur", "pi-hidetm", "pi-tab"] },
  mutations: { keys: ["pmu-catf", "pmu-hide", "pmu-ofmt", "pmu-pan", "pmu-tab"] },
  equipment: { keys: ["pe-f"] },
  mechanics: { keys: ["pmc-s"] },
  checklist: { keys: ["pc-list"], what: "everything on the checklist" },
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
    f.dataset.ok = "";
    f.srcdoc = f.srcdoc;
  };
}
