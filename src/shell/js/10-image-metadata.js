// saved pictures carry hidden PNG text tags (author, tool, date) instead of a visible footer
const PT_CRC = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();
function ptCrc(u) {
  let c = 0xffffffff;
  for (let i = 0; i < u.length; i++) c = PT_CRC[(c ^ u[i]) & 255] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}
function ptPngTag(u8) {
  if (u8.length < 33 || u8[1] !== 0x50 || u8[2] !== 0x4e || u8[3] !== 0x47) return u8;
  const d = new Date(),
    pad = (n) => String(n).padStart(2, "0"),
    when = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  const tags = [
    ["Title", "Prospecting Toolkit image"],
    ["Author", "@__coastal"],
    ["Software", "Prospecting Toolkit"],
    ["Comment", "Made with the Prospecting Toolkit by @__coastal"],
    ["Creation Time", when],
  ];
  const enc = (t) => Uint8Array.from(t, (ch) => ch.charCodeAt(0) & 255);
  const chunks = tags.map(([k, v]) => {
    const data = new Uint8Array([...enc(k), 0, ...enc(v)]);
    const out = new Uint8Array(12 + data.length);
    const dv = new DataView(out.buffer);
    dv.setUint32(0, data.length);
    out.set(enc("tEXt"), 4);
    out.set(data, 8);
    dv.setUint32(8 + data.length, ptCrc(out.subarray(4, 8 + data.length)));
    return out;
  });
  const extra = chunks.reduce((t, c) => t + c.length, 0);
  const res = new Uint8Array(u8.length + extra);
  res.set(u8.subarray(0, 33), 0);
  let o = 33;
  chunks.forEach((c) => {
    res.set(c, o);
    o += c.length;
  });
  res.set(u8.subarray(33), o);
  return res;
}
window.ptInstallMeta = (w) => {
  const C = w && w.HTMLCanvasElement && w.HTMLCanvasElement.prototype;
  if (!C || C.__ptm) return;
  C.__ptm = 1;
  const orig = C.toBlob;
  C.toBlob = function (cb, type, q) {
    return orig.call(
      this,
      (b) => {
        if (!b || (type && type !== "image/png")) {
          cb(b);
          return;
        }
        b.arrayBuffer().then(
          (buf) => {
            let out = b;
            try {
              out = new w.Blob([ptPngTag(new Uint8Array(buf))], { type: "image/png" });
            } catch (e) {}
            cb(out);
          },
          () => cb(b),
        );
      },
      type,
      q,
    );
  };
};
