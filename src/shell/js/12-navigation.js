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
  if (typeof pop !== "undefined" && pop) pop.hidden = true;
  const f = frameFor(id);
  Object.entries(frames).forEach(([k, fr]) => (fr.hidden = k !== id));
  document.getElementById("skel").hidden = !!f.dataset.ok;
  const hub = hubOf(id);
  document.getElementById("curName").textContent = hub ? hub[1] : LIST.find((x) => x.id === id).name;
  const navId = hub ? hub[0] : id;
  document.querySelectorAll(".nav[id^='nav-']").forEach((n) => {
    if (n.id === "nav-" + navId) n.setAttribute("aria-current", "page");
    else n.removeAttribute("aria-current");
  });
  // the tab strip for grouped tools
  const hb = document.getElementById("hubbar");
  if (hub) {
    HUBLAST[hub[0]] = id;
    try {
      localStorage.setItem("pt-hubtab", JSON.stringify(HUBLAST));
    } catch (e) {}
    const col = (SECTIONS.find((sx) => sx[2].some((x) => x[0] === hub[0])) || [])[1] || "";
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
window.ptSubChanged = (tid, sub) => {
  HUBSUB[tid] = sub;
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
