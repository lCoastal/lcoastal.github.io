// older versions gave new builds, loadouts and routes made-up names ("Lucky Geode"); clear those once
(function () {
  if (localStorage.getItem("pt-noautonames")) return;
  const A = new Set(["Ancient", "Cosmic", "Crystal", "Cursed", "Dusty", "Frozen", "Gleaming", "Glowing", "Golden", "Heavy", "Hidden", "Lucky", "Mighty", "Molten", "Moonlit", "Mythic", "Prismatic", "Radiant", "Royal", "Rugged", "Rusty", "Shiny", "Sparkling", "Stormy", "Sunlit", "Swift"]), N = new Set(["Arsenal", "Cavern", "Circuit", "Deposit", "Digger", "Dredge", "Gearset", "Gemstone", "Geode", "Grind", "Haul", "Hoard", "Hunt", "Jackpot", "Kit", "Loadout", "Lode", "Loop", "Miner", "Nugget", "Ore", "Pan", "Pebble", "Prospector", "Quarry", "Relic", "Rig", "Riverbed", "Route", "Run", "Setup", "Shovel", "Sluice", "Spade", "Stash", "Strike", "Sweep", "Toolkit", "Totem", "Treasure", "Trek", "Trip", "Vein"]);
  const auto = (n) => { const w = String(n || "").trim().split(" "); return w.length === 2 && A.has(w[0]) && N.has(w[1]); };
  const fix = (key, get) => {
    try {
      const d = JSON.parse(localStorage.getItem(key) || "null");
      const arr = d && get(d);
      if (!Array.isArray(arr)) return;
      let ch = false;
      arr.forEach((x) => { if (x && auto(x.name)) { x.name = ""; ch = true; } });
      if (ch) localStorage.setItem(key, JSON.stringify(d));
    } catch (e) {}
  };
  fix("pbs-builds", (d) => d);
  fix("pt-eqload", (d) => d.list);
  fix("pfr-s", (d) => d.cl);
  try { localStorage.setItem("pt-noautonames", "1"); } catch (e) {}
})();
