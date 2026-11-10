// your luck, capacity and pans per hour, shared by every tool that asks for them
window.ptYou = {
  get: () => {
    try {
      return JSON.parse(localStorage.getItem("pt-you") || "{}") || {};
    } catch (e) {
      return {};
    }
  },
  set: (p) => {
    try {
      const o = Object.assign(window.ptYou.get(), p);
      localStorage.setItem("pt-you", JSON.stringify(o));
    } catch (e) {}
  },
};
// call a function inside a tool once it has loaded
function callTool(id, fn, ...args) {
  show(id);
  const f = frames[id];
  const go = () => {
    try {
      f.contentWindow[fn](...args);
    } catch (e) {}
  };
  try {
    if (f.contentWindow && typeof f.contentWindow[fn] === "function") {
      go();
      return;
    }
  } catch (e) {}
  f.addEventListener("load", () => setTimeout(go, 0), { once: true });
}
// favourites + owned, shared by every tool
let OWN = {};
try {
  OWN = JSON.parse(localStorage.getItem("pt-own") || "{}") || {};
} catch (e) {}
window.ptStore = {
  get: (n) => OWN[n] || {},
  all: () => OWN,
  toggle: (n, k) => {
    const o = Object.assign({}, OWN[n]);
    o[k] = !o[k];
    if (!o.fav && !o.own) delete OWN[n];
    else OWN[n] = o;
    try {
      localStorage.setItem("pt-own", JSON.stringify(OWN));
    } catch (e) {}
    [...Object.values(frames), pop].forEach((f) => {
      try {
        f && f.contentWindow && f.contentWindow.ptStoreChanged && f.contentWindow.ptStoreChanged();
      } catch (e) {}
    });
  },
};
window.ptSendMuseum = (target, bd, name) =>
  target === "planner" ? callTool("planner", "ptLoadBoard", bd, name) : callTool("calc", "ptLoadMuseum", bd);
// save a named board into the Museum Planner's saved loadouts without leaving the current page
window.ptSaveLoadout = (name, board) => {
  let L = [];
  try {
    L = JSON.parse(localStorage.getItem("mp-loadouts") || "[]");
    if (!Array.isArray(L)) L = [];
  } catch (e) {}
  const i = L.findIndex((o) => o && o.name && o.name.toLowerCase() === name.toLowerCase());
  const entry = { name, board, saved: new Date().toISOString() };
  if (i >= 0) L[i] = entry;
  else L.push(entry);
  try {
    localStorage.setItem("mp-loadouts", JSON.stringify(L));
  } catch (e) {
    return false;
  }
  try {
    frames.planner &&
      frames.planner.contentWindow.ptReloadLoadouts &&
      frames.planner.contentWindow.ptReloadLoadouts();
  } catch (e) {}
  return i >= 0 ? "updated" : "saved";
};
// read the Stat Calculator's totals, loading it in the background if needed
window.ptGetTotals = () =>
  new Promise((res) => {
    const had = !!frames.calc;
    const f = frameFor("calc");
    if (!had) f.hidden = true;
    const go = () => {
      try {
        res(f.contentWindow.ptTotals());
      } catch (e) {
        res(null);
      }
    };
    try {
      if (f.contentWindow && f.contentWindow.ptTotals) {
        go();
        return;
      }
    } catch (e) {}
    f.addEventListener("load", () => setTimeout(go, 0), { once: true });
  });
window.ptCallTool = (id, fn, ...a) => callTool(id, fn, ...a);
// stats breakdown for a Build Sheets build, worked out by the Stat Calculator (loaded in the background if needed)
window.ptBuildStats = (st) =>
  new Promise((res) => {
    const had = !!frames.calc;
    const f = frameFor("calc");
    if (!had) f.hidden = true;
    const go = () => {
      try {
        res(f.contentWindow.ptBreakdown(st));
      } catch (e) {
        res(null);
      }
    };
    try {
      if (f.contentWindow && f.contentWindow.ptBreakdown) {
        go();
        return;
      }
    } catch (e) {}
    f.addEventListener("load", () => setTimeout(go, 0), { once: true });
  });

