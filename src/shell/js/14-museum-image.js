// ---- museum image for tools without their own drawer (Best Museum Finder) ----
window.ptMuseumImage = (() => {
  const D = window.PTDATA;
  const ICONS = Object.fromEntries(D.mins.filter((m) => m.ic).map((m) => [m.n, m.ic]));
  const ORDER = ["Exotic", "Mythic", "Legendary", "Epic", "Rare", "Uncommon", "Common"];
  const MULT = {
    Common: 0.005,
    Uncommon: 0.0075,
    Rare: 0.0125,
    Epic: 0.02,
    Legendary: 0.03,
    Mythic: 0.05,
    Exotic: 0.08,
  };
  const STATS = [
    "Luck",
    "Size Boost",
    "Sell Boost",
    "Capacity",
    "Modifier Boost",
    "Dig Strength",
    "Shake Strength",
    "Dig Speed",
    "Shake Speed",
    "Walk Speed",
  ];
  const BYM = Object.fromEntries(D.mins.map((m) => [m.n, m]));
  const MOD = Object.fromEntries(D.mods.map((m) => [m[0], m]));
  const r4 = (v) => Math.round(v * 10000) / 10000;
  const mineralGain = (n) => {
    const g = {};
    ((BYM[n] || {}).mu || { b: [] }).b.forEach(([s, v]) => (g[s] = (g[s] || 0) + v));
    return g;
  };
  const modGain = (r, u) => {
    const g = {};
    const m = MOD[u];
    if (m) m[1].forEach((s) => (g[s] = (g[s] || 0) + MULT[r] * m[2]));
    return g;
  };
  const slotGain = (r, sl) => {
    const g = sl.m ? mineralGain(sl.m) : {};
    Object.entries(modGain(r, sl.u || "None")).forEach(([k, v]) => (g[k] = (g[k] || 0) + v));
    return g;
  };
  const totals = (b) => {
    const t = {};
    ORDER.forEach((r) =>
      (b[r] || []).forEach((sl) => {
        if (!sl || !sl.m) return;
        Object.entries(slotGain(r, sl)).forEach(([k, v]) => (t[k] = (t[k] || 0) + v));
      }),
    );
    return t;
  };
  const filledCount = (b) => ORDER.reduce((n, r) => n + (b[r] || []).filter((sl) => sl && sl.m).length, 0);

  const IMGC = {
    Common: "#a3adb8",
    Uncommon: "#6cc46e",
    Rare: "#68a6f0",
    Epic: "#b880ee",
    Legendary: "#f2b53a",
    Mythic: "#f0687f",
    Exotic: "#f17ad6",
  };
  const loadImg = (src) =>
    new Promise((r) => {
      const i = new Image();
      i.onload = () => r(i);
      i.onerror = () => r(null);
      i.src = src;
    });
  function rr(c, x, y, w, h, r) {
    c.beginPath();
    c.moveTo(x + r, y);
    c.arcTo(x + w, y, x + w, y + h, r);
    c.arcTo(x + w, y + h, x, y + h, r);
    c.arcTo(x, y + h, x, y, r);
    c.arcTo(x, y, x + w, y, r);
    c.closePath();
  }
  function fitText(c, t, max) {
    if (c.measureText(t).width <= max) return t;
    while (t.length > 1 && c.measureText(t + "…").width > max) t = t.slice(0, -1);
    return t + "…";
  }
  async function boardImage(name, b) {
    const W = 1200,
      PAD = 36,
      ROWH = 92,
      HEAD = 108,
      COLW = (W - PAD * 2 - 150) / 3;
    const tot = totals(b);
    const tl = STATS.filter((k) => tot[k]);
    const totRows = Math.ceil(tl.length / 4) || 1;
    const H = HEAD + ORDER.length * (ROWH + 10) + 40 + totRows * 44 + 30;
    const cv = document.createElement("canvas");
    const sc = 2;
    cv.width = W * sc;
    cv.height = H * sc;
    const c = cv.getContext("2d");
    c.scale(sc, sc);
    const F = '"IBM Plex Sans","Segoe UI",system-ui,sans-serif',
      FD = '"Chakra Petch","Segoe UI",system-ui,sans-serif',
      FM = '"IBM Plex Mono",Consolas,monospace';
    c.fillStyle = "#14181c";
    c.fillRect(0, 0, W, H);
    c.fillStyle = "#e6e9ec";
    c.font = `700 34px ${FD}`;
    c.fillText(fitText(c, name, W - PAD * 2 - 200), PAD, PAD + 30);
    c.fillStyle = "#98a2ad";
    c.font = `14px ${F}`;
    c.fillText(`${filledCount(b)} of 18 displays filled · values at max-boost weight`, PAD, PAD + 58);
    let y = HEAD;
    for (const r of ORDER) {
      const col = IMGC[r];
      c.fillStyle = "#1c2126";
      rr(c, PAD, y, W - PAD * 2, ROWH, 10);
      c.fill();
      c.strokeStyle = col;
      c.lineWidth = 1.5;
      rr(c, PAD, y, W - PAD * 2, ROWH, 10);
      c.stroke();
      c.fillStyle = col;
      rr(c, PAD, y, 6, ROWH, 3);
      c.fill();
      c.fillStyle = col;
      c.font = `700 15px ${F}`;
      c.fillText(r.toUpperCase(), PAD + 20, y + ROWH / 2 + 5);
      for (let i = 0; i < 3; i++) {
        const x = PAD + 150 + i * COLW;
        const sl = b[r][i];
        if (i < b[r].length) {
          c.strokeStyle = "#2d343b";
          c.lineWidth = 1;
          c.beginPath();
          c.moveTo(x, y + 12);
          c.lineTo(x, y + ROWH - 12);
          c.stroke();
        }
        if (!sl) {
          continue;
        }
        if (!sl.m) {
          c.fillStyle = "#5d6670";
          c.font = `italic 14px ${F}`;
          c.fillText("Empty", x + 16, y + ROWH / 2 + 5);
          continue;
        }
        const ic = ICONS[sl.m];
        let tx = x + 16;
        if (ic) {
          const im = await loadImg(ic);
          if (im) {
            c.fillStyle = "#171b1f";
            rr(c, x + 14, y + 19, 54, 54, 8);
            c.fill();
            c.drawImage(im, x + 17, y + 22, 48, 48);
          }
          tx = x + 80;
        }
        c.fillStyle = "#e6e9ec";
        c.font = `700 17px ${FD}`;
        c.fillText(fitText(c, sl.m, COLW - (tx - x) - 10), tx, y + 34);
        const md = sl.u && sl.u !== "None" ? sl.u : "";
        const mdg = md ? modGain(r, md) : {};
        c.fillStyle = md ? "#3cc2a8" : "#98a2ad";
        c.font = `600 11.5px ${F}`;
        c.fillText(
          fitText(
            c,
            md
              ? md.toUpperCase() +
                  "  " +
                  (() => {
                    const SH = {
                      "Dig Strength": "Dig Str",
                      "Shake Strength": "Shake Str",
                      "Modifier Boost": "Mod",
                      "Dig Speed": "Dig Spd",
                      "Shake Speed": "Shake Spd",
                      "Walk Speed": "Walk",
                    };
                    return [...new Set(Object.values(mdg))]
                      .map(
                        (v) =>
                          `+${r4(v)}× ` +
                          Object.keys(mdg)
                            .filter((k) => mdg[k] === v)
                            .map((k) => SH[k] || k)
                            .join(", "),
                      )
                      .join("; ");
                  })()
              : "NO MODIFIER",
            COLW - (tx - x) - 10,
          ),
          tx,
          y + 53,
        );
        const g = mineralGain(sl.m);
        const txt = Object.entries(g)
          .sort((a, b) => STATS.indexOf(a[0]) - STATS.indexOf(b[0]))
          .map(([k, v]) => `${k} ${v < 0 ? "−" : "+"}${r4(Math.abs(v))}×`)
          .join("  ");
        c.fillStyle = "#b9c2cb";
        c.font = `12px ${FM}`;
        c.fillText(fitText(c, txt, COLW - (tx - x) - 10), tx, y + 72);
      }
      y += ROWH + 10;
    }
    y += 14;
    c.fillStyle = "#98a2ad";
    c.font = `600 13px ${F}`;
    c.fillText("MUSEUM TOTAL", PAD, y);
    y += 14;
    const cw = (W - PAD * 2 - 30) / 4;
    tl.forEach((k, i) => {
      const x = PAD + (i % 4) * (cw + 10),
        yy = y + Math.floor(i / 4) * 44;
      c.fillStyle = "#1c2126";
      rr(c, x, yy, cw, 36, 8);
      c.fill();
      c.strokeStyle = "#2d343b";
      rr(c, x, yy, cw, 36, 8);
      c.stroke();
      c.fillStyle = "#e6e9ec";
      c.font = `14px ${F}`;
      c.fillText(k, x + 12, yy + 23);
      const v = tot[k];
      c.fillStyle = v < 0 ? "#ef7a66" : "#3cc2a8";
      c.font = `600 14px ${FM}`;
      const t = (v < 0 ? "−" : "+") + r4(Math.abs(v)) + "×";
      c.fillText(t, x + cw - 12 - c.measureText(t).width, yy + 23);
    });
    if (!tl.length) {
      c.fillStyle = "#5d6670";
      c.font = `14px ${F}`;
      c.fillText("No boosts yet", PAD, y + 22);
    }
    c.font = `600 13px ${F}`;
    const mb = "Made by @__coastal";
    const mw = c.measureText(mb).width + 28,
      mx = W - PAD - mw,
      my = PAD - 6;
    c.fillStyle = "rgba(20,184,166,.14)";
    rr(c, mx, my, mw, 26, 13);
    c.fill();
    c.strokeStyle = "rgba(20,184,166,.6)";
    c.lineWidth = 1;
    rr(c, mx, my, mw, 26, 13);
    c.stroke();
    c.fillStyle = "#14b8a6";
    c.beginPath();
    c.arc(mx + 12, my + 13, 3, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = "#2dd4bf";
    c.fillText(mb, mx + 20, my + 17.5);
    return await new Promise((res) => cv.toBlob(res, "image/png"));
  }
  return boardImage;
})();
