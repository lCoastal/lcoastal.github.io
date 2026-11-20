// tools that cover the same ground are grouped into one menu entry with tabs: [hub id, name, menu text, [tool id, tab label]...]
const HUBS = [
  [
    "h-research",
    "Research",
    "How the game works, the formulas, the tests behind them and a checker for your own data",
    [
      ["mechanics", "How It Works"],
      ["formulas", "Formulas"],
      ["testlog", "Test Log"],
      ["testdata", "Test Data Check"],
    ],
  ],
  [
    "h-museum",
    "Museum",
    "Plan, look up boosts, find the best setup and farm it",
    [
      ["planner", "Planner"],
      ["boosts", "Boosts"],
      ["museumfind", "Best Museum Finder"],
      ["museumopt", "Museum Improver"],
      ["farmroute", "Farm Route"],
    ],
  ],
  [
    "h-luck",
    "Luck & Drops",
    "What you find in a pan: drop odds, the best luck cap and modifier odds",
    [
      ["odds", "Luck Odds"],
      ["bestcap", "Best Luck Cap"],
      ["mododds", "Modifier Odds"],
    ],
  ],
  [
    "h-weights",
    "Weights & Pans",
    "How heavy minerals get, the Size Boost you need and how many fit in a pan",
    [
      ["weightrange", "Weight Range"],
      ["sizefinder", "Size Boost Finder"],
      ["pansize", "Pan Size"],
    ],
  ],
  [
    "h-muts",
    "Mutations & Enchants",
    "Mineral mutations, gear mutations and enchants",
    [
      ["minmuts", "Mineral mutations"],
      ["mutations", "Gear mutations", "mut"],
      ["mutations", "Pan enchants", "pan"],
      ["mutations", "Shovel enchants", "sh"],
    ],
  ],
  [
    "h-equip",
    "Equipment",
    "Every ring, necklace and charm, and your loadouts",
    [
      ["equipment", "All equipment"],
      ["eqload", "Loadouts"],
      ["craftquality", "5-Star Crafter"],
      ["eqcompare", "Equipment Compare"],
    ],
  ],
  [
    "h-gear",
    "Pans, Shovels & Sluices",
    "Gear stats and the sluice upgrade planner",
    [
      ["pans", "Pans"],
      ["shovels", "Shovels"],
      ["sluices", "Sluices"],
      ["sluiceplan", "Sluice upgrades"],
    ],
  ],
  [
    "h-boosts",
    "Runes, Potions, Totems & Trinkets",
    "Rune loadouts, potions, totems and trinkets",
    [
      ["runes", "Runes"],
      ["items", "Potions", "pot"],
      ["items", "Totems", "tot"],
      ["items", "Trinkets", "trn"],
    ],
  ],
  [
    "h-quests",
    "Quests & NPCs",
    "Quest tracker, Dredge Master planner and NPCs",
    [
      ["quests", "Quests"],
      ["dredge", "Dredge Master"],
      ["npcs", "NPCs"],
    ],
  ],
  [
    "h-misc",
    "Codes & Tier List",
    "Active codes and a tier list maker",
    [
      ["codes", "Codes"],
      ["tierlist", "Tier List"],
    ],
  ],
];
const hubOf = (id) => HUBS.find((h) => h[3].some((t) => t[0] === id));
let HUBLAST = {};
try {
  HUBLAST = JSON.parse(localStorage.getItem("pt-hubtab") || "{}") || {};
} catch (e) {}
