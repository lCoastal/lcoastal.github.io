// saved/copied pictures follow your theme (light or dark) and accent colour from Settings.
// Every tool draws its pictures in the dark style with the teal accent; while a picture is drawn, each colour it
// uses is translated: teal -> your accent, and in light theme dark greys -> light greys, light text -> dark text,
// bright colours -> their darker light-theme versions. Shadows and dark see-through overlays are left alone.
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
// light: is the window showing the light theme; accent: [light, dark] hex of the chosen accent
function ptMapColor(s, light, accent) {
  const c = ptParseColor(s);
  if (!c) return s;
  let [r, g, b, a] = c;
  const out = (rgb) => (a >= 1 ? `rgb(${rgb.join(",")})` : `rgba(${rgb.join(",")},${a})`);
  if (PT_TEALS.has(`${r},${g},${b}`)) return out(ptHex(light ? accent[0] : accent[1]));
  if (!light) return s;
  const [h, sat, l] = ptRgbToHsl(r, g, b);
  if (a < 1 && l < 0.2) return s; // shadows / dark overlays
  // greys, including the dark blue-greys the pictures use for backgrounds: flip light and dark
  if (sat < 0.2 || (l < 0.3 && sat < 0.5)) return out(ptHslToRgb(h, sat, Math.min(1, Math.max(0, 1.04 - l))));
  if (l > 0.45) return out(ptHslToRgb(h, sat, Math.max(0.25, l - 0.21))); // bright colours: darker for a light page
  return s;
}
window.ptInstallImgTheme = (w) => {
  try {
    const C = w.CanvasRenderingContext2D && w.CanvasRenderingContext2D.prototype;
    if (!C || C.__ptTheme) return;
    C.__ptTheme = 1;
    const state = () => {
      if (w.ptNoImgTheme) return null; // a picture that copies the page as it looks (Build Sheets' sheet)
      const t = w.document.documentElement.getAttribute("data-theme");
      const light = t ? t === "light" : !w.matchMedia("(prefers-color-scheme: dark)").matches;
      const a = PT_ACCENTS[SET.accent] || PT_ACCENTS.teal;
      if (!light && SET.accent === "teal") return null; // the pictures' own style
      return { light, accent: [a[1], a[2]] };
    };
    const map = (v) => {
      if (typeof v !== "string") return v;
      const st = state();
      return st ? ptMapColor(v, st.light, st.accent) : v;
    };
    ["fillStyle", "strokeStyle"].forEach((k) => {
      const d = Object.getOwnPropertyDescriptor(C, k);
      Object.defineProperty(C, k, {
        configurable: true,
        get() {
          return d.get.call(this);
        },
        set(v) {
          d.set.call(this, map(v));
        },
      });
    });
    const G = w.CanvasGradient.prototype,
      add = G.addColorStop;
    G.addColorStop = function (o, c) {
      return add.call(this, o, map(c));
    };
  } catch (e) {}
};
ptInstallImgTheme(window);
