// which picture is which: built from the labelled list at the top
const PT_WHO = {};
for (const [k, u] of Object.entries(PT_IMG)) {
  const i = k.indexOf(": ");
  if (i < 0) continue;
  const kind = k.slice(0, i),
    name = k
      .slice(i + 2)
      .replace(/ \(big\)$/, "")
      .replace(/ #\d+$/, "");
  if (!PT_WHO[u]) PT_WHO[u] = { kind, name };
}
window.ptImgWho = (u) => PT_WHO[u] || null;
window.ptIcon = (kind, name) => PT_IMG[kind + ": " + name] || "";
window.ptBig = (u) => {
  const w = PT_WHO[u];
  return (w && PT_IMG[w.kind + ": " + w.name + " (big)"]) || u;
};
const GEARTOOL = { Pan: "pans", Shovel: "shovels", Sluice: "sluices" };
window.ptOpenWho = (w) => {
  if (!w) return;
  try {
    if (w.kind !== "Location" && ptIcon(w.kind, w.name)) ptRecent(w.kind, w.name);
  } catch (e) {}
  if (w.kind === "Mineral") ptOpen("mineral", w.name);
  else if (w.kind === "Equipment") callTool("equipment", "ptOpenItem", w.name);
  else if (GEARTOOL[w.kind]) callTool(GEARTOOL[w.kind], "ptOpenItem", w.name);
  else if (w.kind === "Rune") callTool("runes", "ptOpenItem", w.name);
  else if (w.kind === "Location") ptOpen("location", w.name);
};
