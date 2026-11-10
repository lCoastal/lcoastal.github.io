let dlP = null;
const getDl = () =>
  dlP ||
  (dlP = window.hostBridge && window.hostBridge.use ? window.hostBridge.use("downloads") : Promise.resolve(null));
// pictures can be copied, saved, or both, picked in Settings (Image buttons)
let ptImgLast = "Image saved";
window.ptImgMsg = () => ptImgLast;
async function ptCopyImg(blob) {
  const ws = [...Object.values(frames), pop]
    .map((f) => {
      try {
        return f && f.contentWindow;
      } catch (e) {
        return null;
      }
    })
    .filter(Boolean);
  const w =
    ws.find((x) => {
      try {
        return x.document.hasFocus();
      } catch (e) {
        return false;
      }
    }) || window;
  try {
    if (!w.ClipboardItem || !w.navigator.clipboard || !w.navigator.clipboard.write) return false;
    const b = new w.Blob([await blob.arrayBuffer()], { type: "image/png" });
    await w.navigator.clipboard.write([new w.ClipboardItem({ "image/png": b })]);
    return true;
  } catch (e) {
    return false;
  }
}
window.ptSave = async (filename, data) => {
  if (/\.png$/i.test(filename) && data && typeof data.arrayBuffer === "function") {
    const mode = SET.img || "save";
    if (mode !== "save") {
      const ok = await ptCopyImg(data);
      if (mode === "copy" && ok) {
        ptImgLast = "Image copied, paste it anywhere";
        return true;
      }
      ptImgLast = ok
        ? "Image copied and saved"
        : mode === "copy"
          ? "Couldn't copy here, so it was saved instead"
          : "Image saved, copying isn't allowed here";
    } else ptImgLast = "Image saved";
  }
  const dl = await getDl();
  // no host bridge present (page opened normally in a browser) — just download it the standard way
  if (!dl) {
    const blob =
      data instanceof Blob
        ? data
        : new Blob([data], { type: /\.html?$/i.test(filename) ? "text/html" : "application/octet-stream" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      URL.revokeObjectURL(a.href);
      a.remove();
    }, 1000);
    return true;
  }
  let d = data;
  if (d && typeof d !== "string" && typeof d.arrayBuffer === "function") d = new Blob([await d.arrayBuffer()]);
  return dl.save({ filename, data: d });
};
