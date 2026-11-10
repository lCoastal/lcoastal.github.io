// search shortcut: Ctrl + K by default, changeable in Settings to any combination of up to two keys
window.ptHkLabel = (h) => {
  h = h || {};
  const k = h.key || "";
  const nm = k === " " ? "Space" : k.length === 1 ? k.toUpperCase() : k;
  return [h.ctrl && "Ctrl", h.alt && "Alt", h.shift && "Shift", h.meta && "Cmd", nm].filter(Boolean).join(" + ");
};
window.ptHkRecording = false;
window.ptHotkey = (e, doc) => {
  if (window.ptHkRecording) return false;
  const h = SET.hk || { ctrl: true, key: "k" };
  if (!h.key) return false;
  const k = (e.key || "").toLowerCase();
  if (k !== String(h.key).toLowerCase()) return false;
  const ctrl = e.ctrlKey || (e.metaKey && !h.meta);
  if (
    !!h.ctrl !== ctrl ||
    !!h.alt !== e.altKey ||
    (!!h.shift !== e.shiftKey && (k.length > 1 || /^[a-z]$/.test(k))) ||
    (!!h.meta && !e.metaKey)
  )
    return false;
  if (!h.ctrl && !h.alt && !h.meta) {
    const a = (doc || document).activeElement;
    if (a && (/input|textarea|select/i.test(a.tagName) || a.isContentEditable)) return false;
  }
  e.preventDefault();
  closeMenu && closeMenu();
  srch.classList.add("open");
  sIn.focus();
  sIn.select();
  return true;
};
document.addEventListener("keydown", (e) => {
  if (e.target === sIn) return;
  ptHotkey(e, document);
});
{
  const dlg = document.getElementById("pickDlg");
  const close = () => {
    dlg.hidden = true;
    try {
      frames.calc.contentWindow.document.getElementById("fromBuild").focus();
    } catch (e) {}
  };
  dlg.addEventListener("click", (e) => {
    const b = e.target.closest("[data-bid]");
    if (b) {
      dlg.hidden = true;
      let st = null;
      try {
        st = frames.builds.contentWindow.ptCalcState(b.dataset.bid);
      } catch (err) {}
      if (st) window.ptSendCalc(st);
      return;
    }
    if (e.target === dlg || e.target.closest(".x")) close();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !dlg.hidden) close();
  });
}
