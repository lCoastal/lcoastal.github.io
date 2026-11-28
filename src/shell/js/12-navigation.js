if (false)
  LIST.forEach((t) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "nav";
    b.id = "nav-" + t.id;
    b.innerHTML = `<b>${t.name}</b><span>${t.desc}</span>`;
    b.onclick = () => {
      show(t.id);
      closeMenu();
    };
    drawer.appendChild(b);
  });
function show(id) {
  if (!TOOLS[id]) id = "builds";
  Object.values(pops).forEach((p) => (p.hidden = true));
  const f = frameFor(id);
  Object.entries(frames).forEach(([k, fr]) => (fr.hidden = k !== id));
  document.getElementById("skel").hidden = !!f.dataset.ok;
  const hub = hubOf(id);
  const curSub = (tid) => {
    const h = hubOf(tid);
    const e = h && h[3].find((x) => x[0] === tid && x[2]);
    return e ? HUBSUB[tid] || e[2] : "";
  };
  const ent = GROUPS.flatMap((g) => g[4]).find((x) => x[0] === id && (!x[2] || x[2] === curSub(id)));
  document.getElementById("curName").textContent = ent ? entryName(ent) : LIST.find((x) => x.id === id).name;
  ptMarkNav(id, curSub(id));
  window.ptToolSeen && ptToolSeen(id, curSub(id));
  const gb = document.getElementById("gBtn");
  if (gb) gb.toggleAttribute("aria-current", id === "settings");
  if (gb && id === "settings") gb.setAttribute("aria-current", "page");
  // the tab strip for grouped tools
  const hb = document.getElementById("hubbar");
  if (hub && (hub[0] !== "g-research" || SET.nerdy)) {
    const col = (GROUPS.find((g) => g[0] === hub[0]) || [])[2] || "";
    hb.style.setProperty("--hc", col);
    hb.innerHTML = hub[3]
      .map(
        ([tid, lab, sub]) =>
          `<button type="button" role="tab" data-hub="${tid}"${sub ? ` data-sub="${sub}"` : ""} aria-selected="${tid === id && (!sub || (HUBSUB[tid] || hub[3].find((x) => x[0] === tid)[2]) === sub)}">${lab}</button>`,
      )
      .join("");
    hb.hidden = false;
    const on = hb.querySelector('[aria-selected="true"]');
    if (on) on.scrollIntoView({ block: "nearest", inline: "nearest" });
  } else {
    hb.hidden = true;
    hb.innerHTML = "";
  }
  if (location.hash !== "#" + id) {
    try {
      history.replaceState(null, "", "#" + id);
    } catch (e) {
      location.hash = id;
    }
  }
  try {
    localStorage.setItem("pt-tool", id);
  } catch (e) {}
  try {
    f.contentWindow && f.contentWindow.ptRefresh && f.contentWindow.ptRefresh();
  } catch (e) {}
}
// some tabs open one part of a page (e.g. Potions and Totems are two parts of one page)
let HUBSUB = {};
// marks the current tool in the menu
function ptMarkNav(id, sub) {
  document.querySelectorAll(".nav[data-tool]").forEach((n) => {
    if (n.dataset.tool === id && (!n.dataset.sub || n.dataset.sub === sub)) n.setAttribute("aria-current", "page");
    else n.removeAttribute("aria-current");
  });
}
window.ptSubChanged = (tid, sub) => {
  HUBSUB[tid] = sub;
  ptMarkNav(tid, sub);
  if (frames[tid] && !frames[tid].hidden && window.ptToolSeen) ptToolSeen(tid, sub);
  const ent = GROUPS.flatMap((g) => g[4]).find((x) => x[0] === tid && x[2] === sub);
  if (ent && frames[tid] && !frames[tid].hidden) document.getElementById("curName").textContent = entryName(ent);
  document
    .querySelectorAll(`#hubbar [data-hub="${tid}"][data-sub]`)
    .forEach((b) => b.setAttribute("aria-selected", String(b.dataset.sub === sub)));
};
function openHubTab(tid, sub) {
  if (sub) {
    HUBSUB[tid] = sub;
    callTool(tid, "ptOpenTab", sub);
  } else show(tid);
}
document.getElementById("hubbar").addEventListener("click", (e) => {
  const b = e.target.closest("[data-hub]");
  if (b) openHubTab(b.dataset.hub, b.dataset.sub);
});
document.getElementById("hubbar").addEventListener("keydown", (e) => {
  if (!/Arrow(Left|Right)/.test(e.key)) return;
  const bs = [...e.currentTarget.querySelectorAll("[data-hub]")];
  const i = bs.findIndex((b) => b.getAttribute("aria-selected") === "true");
  const n = bs[(i + (e.key === "ArrowRight" ? 1 : bs.length - 1)) % bs.length];
  if (n) {
    const k = n.dataset.hub,
      sb = n.dataset.sub;
    openHubTab(k, sb);
    const nb = document.querySelector(`#hubbar [data-hub="${k}"]${sb ? `[data-sub="${sb}"]` : ""}`);
    nb && nb.focus();
  }
});
document.getElementById("gBtn").onclick = () => show("settings");
// the "Prospecting Toolkit" name in the top bar goes home
{
  const br = document.querySelector(".brand small");
  if (br) {
    br.style.cursor = "pointer";
    br.title = "Home";
    br.onclick = () => show("home");
  }
}
