// a second Minerals instance that only shows its pop-up, laid over whatever tool is open
let pop = null,
  popReady = null;
function popFrame() {
  if (pop) return popReady;
  pop = document.createElement("iframe");
  pop.className = "popframe";
  pop.title = "Mineral";
  pop.hidden = true;
  pop.setAttribute("allowtransparency", "true");
  pop.srcdoc = TOOLS.minerals.replace(/<head>/i, "<head>" + PRE + "<script>window.PT_POPUP=1<\/script>");
  popReady = new Promise((res) =>
    pop.addEventListener(
      "load",
      () => {
        syncTheme(pop);
        res(pop);
      },
      { once: true },
    ),
  );
  document.body.appendChild(pop);
  return popReady;
}
window.ptPopupClosed = () => {
  if (pop) pop.hidden = true;
};
window.ptOpen = async (kind, name) => {
  const curTool = (location.hash || "").slice(1);
  if (kind === "mineral" && curTool !== "minerals") {
    const f = await popFrame();
    f.hidden = false;
    try {
      f.contentWindow.openMineral(name);
    } catch (e) {}
    return;
  }
  if (pop) pop.hidden = true;
  if (kind === "equip") {
    callTool("equipment", "ptOpenItem", name);
    return;
  }
  const id = kind === "mineral" ? "minerals" : "locations",
    fn = kind === "mineral" ? "openMineral" : "openLocation";
  show(id);
  const f = frames[id];
  const go = () => {
    try {
      f.contentWindow[fn](name);
    } catch (e) {}
  };
  try {
    if (f.contentWindow && typeof f.contentWindow[fn] === "function") {
      go();
      return;
    }
  } catch (e) {}
  f.addEventListener("load", () => setTimeout(go, 0), { once: true });
};
