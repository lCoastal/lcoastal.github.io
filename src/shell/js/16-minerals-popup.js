// a second Minerals or Equipment instance that only shows its pop-up, laid over whatever tool is open
const pops = {},
  popReady = {};
function popFrame(id) {
  if (pops[id]) return popReady[id];
  const pop = (pops[id] = document.createElement("iframe"));
  pop.className = "popframe";
  pop.title = id === "minerals" ? "Mineral" : "Equipment";
  pop.hidden = true;
  pop.setAttribute("allowtransparency", "true");
  pop.srcdoc = TOOLS[id].replace(/<head>/i, "<head>" + PRE + "<script>window.PT_POPUP=1<\/script>");
  popReady[id] = new Promise((res) =>
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
  return popReady[id];
}
window.ptPopupClosed = () => {
  Object.values(pops).forEach((p) => (p.hidden = true));
};
window.ptOpen = async (kind, name) => {
  const curTool = (location.hash || "").slice(1);
  if (kind === "mineral" && curTool !== "minerals") {
    const f = await popFrame("minerals");
    f.hidden = false;
    try {
      f.contentWindow.openMineral(name);
    } catch (e) {}
    return;
  }
  if (kind === "equip" && curTool !== "equipment") {
    const f = await popFrame("equipment");
    f.hidden = false;
    try {
      f.contentWindow.ptOpenItem(name);
    } catch (e) {}
    return;
  }
  window.ptPopupClosed();
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
