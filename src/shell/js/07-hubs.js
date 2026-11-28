// menu groups: [group id, title, colour, tabs?, [tool id, tab label, sub page, menu name, menu text]...]
// every tool is listed straight in the menu; groups with tabs show the same tools as a tab strip
const GROUPS = [
  ["g-start", "Start", "#94a3b8", false, [["home", "Home"]]],
  [
    "g-build",
    "Builds",
    "#14b8a6",
    true,
    [
      ["bestbuild", "For a Goal"],
      ["buildmaker", "By Stat Priorities"],
      ["calc", "Stat Calculator"],
      ["rpm", "Rolls per Minute"],
      ["builds", "Build Sheets"],
      ["buildcmp", "Compare Builds for a Mineral"],
    ],
  ],
  [
    "g-odds",
    "Odds & weights",
    "#f59e0b",
    true,
    [
      ["odds", "Luck Odds"],
      ["bestcap", "Best Luck Cap"],
      ["mododds", "Modifier Odds"],
      ["minmuts", "Modifier Values"],
      ["weightrange", "Weight Range"],
      ["sizefinder", "Size Boost Finder"],
      ["pansize", "Pan Size"],
    ],
  ],
  [
    "g-museum",
    "Museum",
    "#a78bfa",
    true,
    [
      ["planner", "Planner"],
      ["boosts", "Boosts"],
      ["museumfind", "Best Museum Finder"],
      ["museumopt", "Museum Improver"],
      ["farmroute", "Farm Route"],
    ],
  ],
  [
    "g-craft",
    "Crafting",
    "#fb923c",
    true,
    [
      ["checklist", "Crafting Checklist"],
      ["craftquality", "5-Star Crafter"],
      ["reforge", "Reforge Odds"],
    ],
  ],
  [
    "g-gear",
    "Gear",
    "#60a5fa",
    true,
    [
      ["equipment", "Equipment"],
      ["eqcompare", "Equipment Compare"],
      ["eqload", "Loadouts"],
      ["pans", "Pans"],
      ["shovels", "Shovels"],
      ["sluices", "Sluices"],
      ["sluiceplan", "Sluice Upgrades"],
    ],
  ],
  [
    "g-boosts",
    "Mutations & boosts",
    "#c084fc",
    true,
    [
      ["mutations", "Equipment Mutations", "mut", "Equipment Mutations", "Every equipment mutation and its multiplier"],
      ["mutations", "Pan Enchants", "pan", "Pan Enchants", "Every pan enchant and what it does"],
      ["mutations", "Shovel Enchants", "sh", "Shovel Enchants", "Every shovel enchant and what it does"],
      ["runes", "Runes"],
      ["items", "Potions", "pot", "Potions", "Every potion, its effect, duration and where to get it"],
      ["items", "Totems", "tot", "Totems", "Every totem, its effect and where to get it"],
      ["items", "Trinkets", "trn", "Trinkets", "Every trinket and what it does"],
    ],
  ],
  [
    "g-world",
    "World",
    "#4ade80",
    true,
    [
      ["minerals", "Minerals"],
      ["locations", "Locations"],
      ["quests", "Quests"],
      ["dredge", "Dredge Master"],
      ["npcs", "NPCs"],
      ["events", "Event Clock"],
      ["codes", "Codes"],
    ],
  ],
  [
    "g-research",
    "Research",
    "#f472b6",
    true,
    [
      ["mechanics", "How It Works"],
      ["formulas", "Formulas"],
      ["testlog", "Test Log"],
      ["testdata", "Test Data Check"],
    ],
  ],
  [
    "g-more",
    "More",
    "#94a3b8",
    false,
    [
      ["tierlist", "Tier List"],
      ["settings", "Settings"],
    ],
  ],
];
// groups with tabs, in the shape the tab strip uses: [id, title, text, [[tool, tab label, sub]...]]
const HUBS = GROUPS.filter((g) => g[3]).map((g) => [g[0], g[1], "", g[4].map((x) => [x[0], x[1], x[2]])]);
const hubOf = (id) => HUBS.find((h) => h[3].some((t) => t[0] === id));
// what the menu, the top bar and search call each entry
const entryName = (x) => x[3] || (LIST.find((t) => t.id === x[0]) || {}).name || x[1];
const entryDesc = (x) => x[4] || (LIST.find((t) => t.id === x[0]) || {}).desc || "";
