// move setups between the Stat Calculator and Build Sheets
window.ptSendBuild = (b) => callTool("builds", "ptAddBuild", b);
window.ptSendCalc = (st) => callTool("calc", "ptLoadState", st);
window.ptPickBuild = () => {
  const go = () => {
    let list = [];
    try {
      list = frames.builds.contentWindow.ptListBuilds();
    } catch (e) {}
    const dlg = document.getElementById("pickDlg");
    dlg.querySelector("ul").innerHTML = list.length
      ? list.map((b) => `<li><button type="button" data-bid="${ESC(b.id)}">${ESC(b.name)}</button></li>`).join("")
      : '<li class="none">No build sheets yet.</li>';
    dlg.hidden = false;
    const f = dlg.querySelector("button[data-bid]") || dlg.querySelector(".x");
    f && f.focus();
  };
  const had = !!frames.builds;
  const f = frameFor("builds");
  if (!had) f.hidden = true;
  try {
    if (f.contentWindow && f.contentWindow.ptListBuilds) {
      go();
      return;
    }
  } catch (e) {}
  f.addEventListener("load", () => setTimeout(go, 0), { once: true });
};
// add to the crafting checklist from any tool, even before it has been opened
window.ptChecklistAdd = (name, crafts) => {
  const f = frames.checklist;
  try {
    if (f && f.contentWindow && f.contentWindow.addGoal) return f.contentWindow.addGoal(name, crafts);
  } catch (e) {}
  try {
    const S = JSON.parse(localStorage.getItem("pc-list") || "null") || { goals: [], extra: [], have: {} };
    const star = crafts === 2 ? 6 : 5;
    const g = S.goals.find((g) => g.n === name && g.star === star);
    if (g) g.c++;
    else S.goals.push({ n: name, c: 1, star });
    localStorage.setItem("pc-list", JSON.stringify(S));
    return true;
  } catch (e) {}
  // storage blocked: load the checklist in the background and add it there
  const had = !!frames.checklist;
  const fr = frameFor("checklist");
  if (!had) fr.hidden = true;
  fr.addEventListener(
    "load",
    () => {
      try {
        fr.contentWindow.addGoal(name, crafts);
      } catch (e) {}
    },
    { once: true },
  );
  return true;
};
