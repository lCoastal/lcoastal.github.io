// reset everything: click once, wait 5 seconds, then click again within 10 seconds
// compact view: tighter tables and cards in every tool, kept per browser
let COMPACT = false;
try {
  COMPACT = localStorage.getItem("pt-compact") === "1";
} catch (e) {}
window.ptCompactOn = () => COMPACT;
function syncCompact(f) {
  try {
    const r = f && f.contentDocument && f.contentDocument.documentElement;
    if (r) r.toggleAttribute("data-compact", COMPACT);
  } catch (e) {}
}
// settings, shared by every tool and changed from the Settings tool
let SET = {
  short: false,
  dec: 2,
  scroll: true,
  recent: 8,
  hk: { ctrl: true, key: "k" },
  theme: "auto",
  accent: "teal",
  img: "save",
};
try {
  Object.assign(SET, JSON.parse(localStorage.getItem("pt-settings") || "{}"));
} catch (e) {}
window.ptSettings = () => Object.assign({ compact: COMPACT }, SET);
window.ptSetSetting = (k, v) => {
  if (k === "compact") {
    COMPACT = !!v;
    try {
      localStorage.setItem("pt-compact", COMPACT ? "1" : "0");
    } catch (e) {}
    Object.values(frames).forEach(syncCompact);
    if (pop) syncCompact(pop);
  } else {
    SET[k] = v;
    try {
      localStorage.setItem("pt-settings", JSON.stringify(SET));
    } catch (e) {}
    if (k === "recent") {
      RECENT = RECENT.slice(0, +v);
      try {
        localStorage.setItem("pt-recent", JSON.stringify(RECENT));
      } catch (e) {}
      drawRecent();
    }
    if (k === "img")
      [...Object.values(frames), pop].forEach((f) => {
        try {
          f && f.contentWindow.ptImgLabels && f.contentWindow.ptImgLabels();
        } catch (e) {}
      });
    if (k === "theme") applyTheme();
    if (k === "accent") {
      ptAccentInto(document);
      [...Object.values(frames), pop].forEach((f) => {
        try {
          f && ptAccentInto(f.contentDocument);
        } catch (e) {}
      });
    }
    if (k === "short" || k === "dec")
      [...Object.values(frames), pop].forEach((f) => {
        try {
          f && f.contentWindow.ptNumRefresh && f.contentWindow.ptNumRefresh();
        } catch (e) {}
      });
  }
};
window.ptFrameId = (w) =>
  Object.keys(frames).find((k) => {
    try {
      return frames[k].contentWindow === w;
    } catch (e) {
      return false;
    }
  }) || null;
new MutationObserver(() => {
  const cur = document.documentElement.getAttribute("data-theme");
  if (ownTheme !== undefined && cur === ownTheme) {
    Object.values(frames).forEach(syncTheme);
    try {
      if (pop) syncTheme(pop);
    } catch (e) {}
    return;
  }
  hostTheme = cur;
  if (SET.theme === "light" || SET.theme === "dark") {
    if (hostTheme !== SET.theme) applyTheme();
  } else {
    Object.values(frames).forEach(syncTheme);
    if (pop) syncTheme(pop);
  }
}).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
ptAccentInto(document);
applyTheme();
