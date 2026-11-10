
const $=id=>document.getElementById(id);const X=P.x2||{npcs:[],quests:[]};
const norm=s=>String(s||"").toLowerCase().replace(/[’']/g,"").trim();
const QBY={};X.quests.forEach(q=>{if(q.npc)(QBY[norm(q.npc)]=QBY[norm(q.npc)]||[]).push(q)});
// one card per NPC, listing every area they appear in
const NP={};X.npcs.forEach(n=>{const k=norm(n.n);if(!NP[k])NP[k]={n:n.n,regs:[],d:n.d};if(!NP[k].regs.includes(n.reg))NP[k].regs.push(n.reg)});
const LIST=Object.values(NP);const REGS=[...new Set(X.npcs.map(n=>n.reg))];
$("rg").innerHTML+=REGS.map(r=>`<option>${esc(r)}</option>`).join("");
const role=n=>{const t=(n.n+" "+n.d).toLowerCase();const r=[];if(/merchant|shop|vendor|sell|alchemist|trader/.test(t))r.push("Shop");if(/blacksmith|forge|craft|anvil|reforge/.test(t))r.push("Crafting");if(/enchant|altar/.test(t))r.push("Enchanting");return r};
let onlyQ=false;
function render(){const q=$("q").value.trim().toLowerCase(),rg=$("rg").value;$("onlyQ").setAttribute("aria-pressed",String(onlyQ));
  const rows=LIST.filter(n=>(!rg||n.regs.includes(rg))&&(!onlyQ||QBY[norm(n.n)])&&(!q||(n.n+" "+n.d+" "+n.regs.join(" ")+" "+(QBY[norm(n.n)]||[]).map(x=>x.n).join(" ")).toLowerCase().includes(q)));
  $("count").textContent=`${rows.length} of ${LIST.length} NPCs`;
  const regs=rg?[rg]:REGS;
  $("list").innerHTML=regs.map(r=>{const rs=rows.filter(n=>n.regs[0]===r||(rg&&n.regs.includes(r)));if(!rs.length)return "";
    return `<h2 class="rg">${esc(r)}</h2><div class="grid">${rs.map(n=>{const qs=QBY[norm(n.n)]||[];const ro=role(n);
      return `<article class="n"><b>${esc(n.n)}</b><div class="tags">${qs.length?`<span class="q">${qs.length} quest${qs.length>1?"s":""}</span>`:""}${ro.map(x=>`<span class="s">${x}</span>`).join("")}${n.regs.length>1?`<span>Also in ${esc(n.regs.filter(x=>x!==r).join(", "))}</span>`:""}</div>
        ${n.d?`<p>${esc(n.d)}</p>`:""}${qs.length?`<ul class="ql">${qs.map(x=>`<li><button type="button" data-quest="${esc(x.n)}">${esc(x.n)}</button>${/blueprint/i.test(x.rw)?" · blueprint":""}</li>`).join("")}</ul>`:""}</article>`}).join("")}</div>`}).join("")||'<div class="empty">No NPCs match.</div>'}
$("q").oninput=render;$("rg").onchange=render;$("onlyQ").onclick=()=>{onlyQ=!onlyQ;render()};
document.addEventListener("click",e=>{const b=e.target.closest("[data-quest]");if(!b)return;try{window.parent.ptCallTool("quests","ptOpenItem",b.dataset.quest)}catch(err){}});
window.ptOpenItem=name=>{$("q").value=name;$("rg").value="";render()};
render();
