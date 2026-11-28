// Export colors follow light or dark mode. Semantic colors use a fixed palette.
const PT_TEALS = new Set(["20,184,166", "45,212,191", "60,194,168", "15,124,107", "47,196,178", "42,157,143"]);
const ptHex = (c) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
function ptParseColor(s) {
  s = String(s).trim();
  let m = s.match(/^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i);
  if (m) {
    let h = m[1];
    if (h.length === 3) h = h.replace(/./g, (x) => x + x);
    const a = h.length === 8 ? parseInt(h.slice(6), 16) / 255 : 1;
    return [...ptHex("#" + h.slice(0, 6)), a];
  }
  m = s.match(/^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*(?:,\s*([\d.]+)\s*)?\)$/i);
  if (m) return [+m[1], +m[2], +m[3], m[4] == null ? 1 : +m[4]];
  return null;
}
function ptRgbToHsl(r, g, b) {
  (r /= 255), (g /= 255), (b /= 255);
  const mx = Math.max(r, g, b),
    mn = Math.min(r, g, b),
    l = (mx + mn) / 2;
  if (mx === mn) return [0, 0, l];
  const d = mx - mn,
    s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn);
  const h = mx === r ? (g - b) / d + (g < b ? 6 : 0) : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return [h / 6, s, l];
}
function ptHslToRgb(h, s, l) {
  if (!s) return [l, l, l].map((x) => Math.round(x * 255));
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s,
    p = 2 * l - q;
  const f = (t) => {
    t = (t + 1) % 1;
    return t < 1 / 6 ? p + (q - p) * 6 * t : t < 1 / 2 ? q : t < 2 / 3 ? p + (q - p) * (2 / 3 - t) * 6 : p;
  };
  return [f(h + 1 / 3), f(h), f(h - 1 / 3)].map((x) => Math.round(x * 255));
}
function ptMapLightColor(s) {
  const c = ptParseColor(s);
  if (!c) return s;
  let [r, g, b, a] = c;
  const out = (rgb) => (a >= 1 ? `rgb(${rgb.join(",")})` : `rgba(${rgb.join(",")},${a})`);
  if (PT_TEALS.has(`${r},${g},${b}`)) return out(ptHex("#0f7c6b"));
  const [h, sat, l] = ptRgbToHsl(r, g, b);
  if (a < 1 && l < 0.2) return s; // shadows / dark overlays
  // greys, including the dark blue-greys the pictures use for backgrounds: flip light and dark
  if (sat < 0.2 || (l < 0.3 && sat < 0.5)) return out(ptHslToRgb(h, sat, Math.min(1, Math.max(0, 1.04 - l))));
  if (l > 0.45) return out(ptHslToRgb(h, Math.max(sat, l > 0.7 ? 0.6 : sat), Math.max(0.25, Math.min(0.42, l - 0.21)))); // bright and pale colours: darker for a light page
  return s;
}
// names coloured in pictures: the dark-theme colours (light pictures darken them like every other colour)
const PT_NAMECOL = {
  Perfect: "#5ef1e1", Treasured: "#ffd849", Entombed: "#40c8be", Lunar: "#ffe99b", Voidtorn: "#a35bff", Mutated: "#a07bff", Cosmic: "#ff5f9e",
  Electrified: "#ffeb0b", Iridescent: "#f36bff", Irradiated: "#67ff20", Crystalline: "#b7e6ff", Scorching: "#ff861c", Glowing: "#fff292",
  Pure: "#ffffff", Shiny: "#d4e7ff", Sunforged: "#ffc457", Prismatic: "#c05bd8", Overclocked: "#e0602f", Festive: "#d23c3c",
  Luck: "#c3ffb6", Capacity: "#ffe6b6", "Size Boost": "#ff4444", "Modifier Boost": "#2cff4a", "Sell Boost": "#ffdb1a", "Dig Strength": "#ffc3b0",
  "Dig Speed": "#aadbff", "Shake Strength": "#ffc3b0", "Shake Speed": "#ffffff", "Walk Speed": "#ffffff", Walkspeed: "#ffffff", "Inventory Size": "#da8662", "Jump Power": "#ffbc8c",
};
// light pictures: the same light-theme colours the pages use (set directly, not translated)
const PT_NAMECOL_LIGHT = {
  Perfect: "#0e9c8d", Treasured: "#a88400", Entombed: "#24928a", Lunar: "#8f7a2a", Voidtorn: "#6a1fd1", Mutated: "#5b3fc4", Cosmic: "#c0145a",
  Electrified: "#9c8f00", Iridescent: "#a800b7", Irradiated: "#3a9e00", Crystalline: "#0077b7", Scorching: "#b75500", Glowing: "#9c8a00",
  Pure: "#6b6b6b", Shiny: "#2f63b0", Sunforged: "#b77700", Prismatic: "#7e2394", Overclocked: "#9f3d17", Festive: "#952222",
  Luck: "#2f8f1f", Capacity: "#a8740a", "Size Boost": "#c62828", "Modifier Boost": "#1f8f3a", "Sell Boost": "#9a7a00", "Dig Strength": "#b9532c",
  "Dig Speed": "#2a6fb8", "Shake Strength": "#b9532c", "Shake Speed": "#5d6670", "Walk Speed": "#5d6670", Walkspeed: "#5d6670", "Inventory Size": "#8a4a26", "Jump Power": "#b0602a",
};
const PT_NAMERE = new RegExp("(^|[^A-Za-z'])(" + Object.keys(PT_NAMECOL).sort((a, b) => b.length - a.length).join("|") + ")(?![A-Za-z])", "g");
const PT_OKBEFORE = /^(Max|Your|Total|Base|Extra|Best|More|Less|No|And|Or|With|Without|Each|Every|All|For|Of|Most|Higher|Lower)$/;
// split a line of picture text into [piece, colour or null]; null when nothing in it should be coloured
function ptColorSegs(v) {
  PT_NAMERE.lastIndex = 0;
  let m, last = 0;
  const out = [];
  while ((m = PT_NAMERE.exec(v))) {
    const name = m[2], start = m.index + m[1].length, end = start + name.length;
    const after = v.slice(end).match(/^ ([A-Za-z][a-z]+)/), before = v.slice(0, start).match(/([A-Za-z][a-z']+) $/);
    if (after && /^[A-Z]/.test(after[1])) continue;
    if (before && /^[A-Z]/.test(before[1]) && !PT_OKBEFORE.test(before[1])) continue;
    out.push([v.slice(last, start), null], [name, PT_NAMECOL[name]]);
    last = end;
  }
  if (!out.length) return null;
  out.push([v.slice(last), null]);
  return out;
}
window.ptInstallImgTheme = (w) => {
  try {
    const C = w.CanvasRenderingContext2D && w.CanvasRenderingContext2D.prototype;
    if (!C || C.__ptTheme) return;
    C.__ptTheme = 1;
    const FD = Object.getOwnPropertyDescriptor(C, "fillStyle");
    const isLight = () => {
      if (w.ptNoImgTheme) return false; // Build Sheets supplies final colors from its export stylesheet.
      const mode = w.document.documentElement.getAttribute("data-theme");
      return mode ? mode === "light" : w.matchMedia("(prefers-color-scheme: light)").matches;
    };
    const map = (v) => typeof v === "string" && isLight() ? ptMapLightColor(v) : v;
    // a colour the person picked themselves (a custom tier row colour) is drawn exactly, in any theme
    C.ptFillExact = function (v) {
      this.__ptRaw = v;
      FD.set.call(this, v);
    };
    ["fillStyle", "strokeStyle"].forEach((k) => {
      const d = Object.getOwnPropertyDescriptor(C, k);
      Object.defineProperty(C, k, {
        configurable: true,
        get() {
          return d.get.call(this);
        },
        set(v) {
          if (k === "fillStyle") this.__ptRaw = v;
          d.set.call(this, map(v));
        },
      });
    });
    // stat and mutation names in picture text get their colour too (only on plain grey/white text, never in big titles)
    const ft = C.fillText;
    C.fillText = function (text, x, y, maxW) {
      try {
        // plain numbers drawn in the theme's teal (boost values, shares) come out white like the rest of the text
        if (typeof text === "string" && /^[~+\-−]?\s*[\d.,]+\s*(%|×|x|kg)?$/.test(text.trim())) {
          const raw = ptParseColor(this.__ptRaw || "");
          if (raw && PT_TEALS.has(`${raw[0]},${raw[1]},${raw[2]}`)) {
            const keep = this.fillStyle, keepRaw = this.__ptRaw;
            this.fillStyle = "#e6e9ec";
            const r = ft.apply(this, arguments);
            FD.set.call(this, keep);
            this.__ptRaw = keepRaw;
            return r;
          }
        }
        if (w.ptNoImgColor || maxW != null || typeof text !== "string" || !/[A-Z]/.test(text)) return ft.apply(this, arguments);
        const px = parseFloat((String(this.font).match(/([\d.]+)px/) || [])[1] || 0);
        const cur = ptParseColor(this.fillStyle);
        if (px >= 22 || !cur || ptRgbToHsl(cur[0], cur[1], cur[2])[1] > 0.2) return ft.apply(this, arguments);
        const segs = ptColorSegs(text);
        if (!segs) return ft.apply(this, arguments);
        const al = this.textAlign, fs = this.fillStyle, tot = this.measureText(text).width;
        let cx = al === "right" || al === "end" ? x - tot : al === "center" ? x - tot / 2 : x;
        this.textAlign = "left";
        segs.forEach(([t, col]) => {
          if (!t) return;
          if (col) {
            FD.set.call(this, isLight() ? PT_NAMECOL_LIGHT[t] || col : col);
          } else FD.set.call(this, fs);
          ft.call(this, t, cx, y);
          cx += this.measureText(t).width;
        });
        this.textAlign = al;
        FD.set.call(this, fs);
      } catch (e) {
        return ft.apply(this, arguments);
      }
    };
    const G = w.CanvasGradient.prototype,
      add = G.addColorStop;
    G.addColorStop = function (o, c) {
      return add.call(this, o, map(c));
    };
  } catch (e) {}
};
ptInstallImgTheme(window);
