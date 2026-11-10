
const ORDER=["Exotic","Mythic","Legendary","Epic","Rare","Uncommon","Common"];
const EQ=Object.fromEntries(P.equip.map(x=>[x.n.toLowerCase(),x]));
const $=id=>document.getElementById(id);
let S={goals:[],extra:[],have:{},hide:false};
const load=()=>{try{const s=JSON.parse(localStorage.getItem("pc-list")||"null");if(s&&Array.isArray(s.goals))S=Object.assign({goals:[],extra:[],have:{},hide:false},s)}catch(e){}};
const save=()=>{try{localStorage.setItem("pc-list",JSON.stringify(S))}catch(e){}};
load();
// best non-Void place for a mineral
const VOID_TIP="The Void is left out: its loot pool keeps changing, so it isn't a reliable place to farm.";
// best place to farm, never the Void unless it's the only place
function whereInfo(n){const m=MIN[n.toLowerCase()];if(!m||!m.ch||!m.ch.length)return null;const all=[...m.ch].sort((a,b)=>oneIn(a[2])-oneIn(b[2]));
  const ch=all.filter(c=>!/Void/.test(c[0]));return {ch,voidOnly:!ch.length,hasVoid:all.length>ch.length,best:ch[0]||all[0]}}
function where(n){const w=whereInfo(n);if(!w)return "";const b=w.best;
  const odds=`<span class="mono">~1 in ${isFinite(oneIn(b[2]))?oneIn(b[2]).toLocaleString("en-US"):"?"}</span>`;
  if(w.voidOnly)return `<span title="Only drops in The Void, whose loot pool keeps changing.">Only in <span class="lk" data-location="The Void">The Void</span> ${odds}</span>`;
  return `<span class="lk" data-location="${esc(baseLoc(b[0]))}">${esc(b[0])}</span> ${odds}${w.ch.length>1?` <span class="muted">· +${w.ch.length-1} more</span>`:""}${w.hasVoid?` <span class="vx" title="${VOID_TIP}" tabindex="0" aria-label="${VOID_TIP}">Void excluded</span>`:""}`}
function addGoal(name,crafts){const x=EQ[String(name).toLowerCase()];if(!x)return false;const star=crafts===2?6:5;const g=S.goals.find(g=>g.n===x.n&&g.star===star);if(g)g.c++;else S.goals.push({n:x.n,c:1,star});save();render();return true}
window.reloadChecklist=()=>{load();render()};
window.addGoal=addGoal;
$("addBtn").onclick=()=>{if(!addGoal($("addIn").value.trim(),1)){$("addIn").setCustomValidity("Pick an item from the list");$("addIn").reportValidity();return}$("addIn").value=""};
// pickers with pictures: picking equipment adds it straight away, picking a mineral fills the box so you can set how many
makeAC({inp:$("addIn"),free:true,items:P.equip.map(x=>({n:x.n,tag:(x.r+" "+x.slot).trim(),ic:P.eimg&&P.eimg[x.img],col:rc(x.r)})),pick:x=>{$("addIn").value=x.n;$("addBtn").click()}});
makeAC({inp:$("addMin"),free:true,items:P.mins.map(m=>({n:m.n,tag:m.r,ic:m.ic,col:rc(m.r)})),pick:x=>{$("addMin").value=x.n;$("addMinQ").focus();$("addMinQ").select()}});
$("addIn").addEventListener("input",()=>$("addIn").setCustomValidity(""));
$("addIn").addEventListener("keydown",e=>{if(e.key==="Enter"&&$("addIn").value.trim())$("addBtn").click()});
$("addMinBtn").onclick=()=>{const m=MIN[$("addMin").value.trim().toLowerCase()];if(!m){$("addMin").setCustomValidity("Pick a mineral from the list");$("addMin").reportValidity();return}
  const q=Math.max(1,parseInt($("addMinQ").value)||1);const e=S.extra.find(e=>e.n===m.n);if(e)e.q+=q;else S.extra.push({n:m.n,q});$("addMin").value="";save();render()};
$("addMin").addEventListener("input",()=>$("addMin").setCustomValidity(""));
$("clear").onclick=()=>{if(!S.goals.length&&!S.extra.length)return;S.goals=[];S.extra=[];save();render()};
document.addEventListener("click",e=>{const b=e.target.closest("[data-pm]");if(!b)return;S.pm=b.dataset.pm;save();summary()});
$("hideDone").onclick=()=>{S.hide=!S.hide;save();render()};

function calc(){
  const need={},usedBy={};let cost=0;
  S.goals.forEach(g=>{const x=EQ[g.n.toLowerCase()];if(!x)return;const crafts=g.c*(g.star===6?2:1);if(x.cur==="$"&&x.price)cost+=x.price*crafts;
    x.rec.forEach(([q,n])=>{need[n]=(need[n]||0)+q*crafts;(usedBy[n]=usedBy[n]||new Set).add(g.n)})});
  S.extra.forEach(e=>{need[e.n]=(need[e.n]||0)+e.q;(usedBy[e.n]=usedBy[e.n]||new Set).add("extra")});
  const rows=Object.entries(need).map(([n,q])=>{const m=MIN[n.toLowerCase()];const have=Math.max(0,+S.have[n]||0);return {n,q,m,have,left:Math.max(0,q-have)}})
    .sort((a,b)=>ORDER.indexOf(a.m?a.m.r:"Common")-ORDER.indexOf(b.m?b.m.r:"Common")||b.left-a.left||a.n.localeCompare(b.n));
  const tot=rows.reduce((s,r)=>s+r.q,0),got=rows.reduce((s,r)=>s+Math.min(r.q,r.have),0),done=rows.filter(r=>!r.left).length;
  return {rows,tot,got,done,cost,usedBy}}
// how hard one of a mineral is to get: its best (non-Void) drop odds, or a rarity guess if it has none
const RW={Common:3,Uncommon:10,Rare:60,Epic:400,Legendary:5000,Mythic:2e5,Exotic:2e7,Ascended:1e8};
function effort(n){const w=whereInfo(n);const m=MIN[n.toLowerCase()];if(w&&!w.voidOnly){const o=oneIn(w.best[2]);if(isFinite(o))return o}return RW[m?m.r:"Common"]||3}
function summary(){const {rows,tot,got,done,cost}=calc();const mode=S.pm||"effort";
  const wt=rows.reduce((s,r)=>s+r.q*effort(r.n),0),wg=rows.reduce((s,r)=>s+Math.min(r.q,r.have)*effort(r.n),0);
  const pct=mode==="effort"?(wt?wg/wt*100:0):(tot?got/tot*100:0);
  document.querySelectorAll("[data-pm]").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.pm===mode)));
  $("pLab").textContent=`Progress ${mode==="effort"?"by effort":"by item count"}: ${pct>=99.95||pct===0?fmt(pct,0):pct<0.1?"<0.1":fmt(pct,1)}%`;$("pbarW").setAttribute("aria-valuenow",pct.toFixed(1));
  $("pNote").textContent=mode==="effort"?(rows.length?"Each material counts by how rare it is (its best drop odds).":""):"Every item counts the same, however rare it is.";
  $("sum").innerHTML=`<div><span class="lab">Materials ready</span><b>${done} / ${rows.length}</b></div><div><span class="lab">Items collected</span><b>${fmt(got,0)} / ${fmt(tot,0)}</b></div><div><span class="lab">Crafting fees</span><b>$${fmt(cost,0)}</b></div>`;
  $("pbar").style.width=pct+"%";pie(rows,mode);return rows}
const PAL=["#2a9d8f","#e76f51","#7b61ff","#e9b949","#3a86ff","#e05fa8","#7fae6e","#8d99a6"];
function arc(cx,cy,r,ri,a0,a1){const p=(a,rr)=>[cx+rr*Math.sin(a),cy-rr*Math.cos(a)];const lg=a1-a0>Math.PI?1:0;const [x0,y0]=p(a0,r),[x1,y1]=p(a1,r),[x2,y2]=p(a1,ri),[x3,y3]=p(a0,ri);
  return `M${x0.toFixed(2)} ${y0.toFixed(2)}A${r} ${r} 0 ${lg} 1 ${x1.toFixed(2)} ${y1.toFixed(2)}L${x2.toFixed(2)} ${y2.toFixed(2)}A${ri} ${ri} 0 ${lg} 0 ${x3.toFixed(2)} ${y3.toFixed(2)}Z`}
function pie(rows,mode){const on=S.pie!==false;const btn=$("pieBtn");btn.setAttribute("aria-pressed",String(on));btn.textContent=on?"Hide chart":"Show chart";const el=$("pie");el.hidden=!on;if(!on)return;
  // which materials get their own slice and which colour each one has is fixed (ranked by effort left),
  // so switching between "By effort" and "By item count" only changes slice sizes, never colours
  let parts=pieParts(rows,mode);
  if(!parts.length){el.innerHTML=`<p class="muted" style="margin:0;grid-column:1/-1">${rows.length?"Nothing left to collect. Everything's ready to craft.":"Add something to craft to see what's left."}</p>`;return}
  const tot=parts.reduce((s,x)=>s+x.v,0);let a=0;
  const segs=parts.map((x,i)=>{const sh=x.v/tot;const a0=a,a1=a+Math.max(sh*2*Math.PI,0.0001);a=a1;const full=sh>0.9999;
    const d=full?`M95 10A85 85 0 1 1 94.99 10Z M95 46A49 49 0 1 0 95.01 46Z`:arc(95,95,85,49,a0,a1);
    return `<path d="${d}" fill="${PAL[x.ci%PAL.length]}" fill-rule="evenodd" data-pi="${i}"><title>${esc(x.n)}: ${x.left} left · ${pctTxt(sh*100)}%</title></path>`}).join("");
  el.innerHTML=`<svg viewBox="0 0 190 190" role="img" aria-label="${esc(parts.map((x,i)=>`${x.n} ${pctTxt(x.v/tot*100)}%`).join(", "))}">${segs}<text x="95" y="93" text-anchor="middle" class="ctr">${fmt(parts.reduce((s,x)=>s+x.left,0),0)}</text><text x="95" y="109" text-anchor="middle" class="ctr2">items left</text></svg>
    <ul class="leg">${parts.map((x,i)=>`<li data-pi="${i}"><i style="background:${PAL[x.ci%PAL.length]}"></i><span>${esc(x.n)}</span><span class="mono">${fmt(x.left,0)} left</span><b>${pctTxt(x.v/tot*100)}%</b></li>`).join("")}</ul>
    <p class="muted" style="margin:0;font-size:12.5px;grid-column:1/-1">${mode==="effort"?"Slices show how much of the remaining effort each material is.":"Slices show how many of each material are left."}</p>`}
function pieParts(rows,mode){
  const ranked=rows.filter(r=>r.left).map(r=>({n:r.n,left:r.left,eff:r.left*effort(r.n)})).sort((a,b)=>b.eff-a.eff||a.n.localeCompare(b.n));
  ranked.forEach((x,i)=>x.ci=ranked.length>8?Math.min(i,7):i);
  let parts=ranked.map(x=>({n:x.n,left:x.left,ci:x.ci,v:mode==="effort"?x.eff:x.left}));
  if(parts.length>8){const rest=parts.slice(7);parts=parts.slice(0,7).concat([{n:`${rest.length} others`,left:rest.reduce((s,x)=>s+x.left,0),v:rest.reduce((s,x)=>s+x.v,0),ci:7,other:true}])}
  parts.sort((a,b)=>(a.other?1:0)-(b.other?1:0)||b.v-a.v);
  return parts}
const pctTxt=v=>v>=99.95?"100":v<0.1?"<0.1":fmt(v,1);
$("pieBtn").onclick=()=>{S.pie=S.pie===false;save();summary()};
// hovering a slice or legend row highlights both
$("pie").addEventListener("mouseover",e=>{const t=e.target.closest("[data-pi]");const el=$("pie");el.querySelectorAll("[data-pi]").forEach(x=>x.classList.toggle("on",!!t&&x.dataset.pi===t.dataset.pi));el.classList.toggle("hl",!!t)});
$("pie").addEventListener("mouseleave",()=>{const el=$("pie");el.classList.remove("hl");el.querySelectorAll(".on").forEach(x=>x.classList.remove("on"))});
function render(){
  $("hideDone").setAttribute("aria-pressed",String(S.hide));
  // goals
  $("goals").innerHTML=(S.goals.length||S.extra.length)?S.goals.map((g,i)=>{const x=EQ[g.n.toLowerCase()];const img=x&&P.eimg[x.img];
    return `<div class="goal"><div class="icon">${img?`<img src="${img}" alt="" width="36" height="36">`:""}</div>
      <div class="nm"><b>${esc(g.n)}</b><span class="rr" style="--rc:${rc(x?x.r:"common")}">${x?x.r+" "+x.slot:""}</span></div>
      <button type="button" class="x" data-rm="${i}" aria-label="Remove ${esc(g.n)}">Remove</button>
      <div class="ctl"><span class="step"><button type="button" data-d="${i}" data-v="-1" aria-label="One fewer">−</button><input type="number" min="1" value="${g.c}" data-c="${i}" aria-label="How many ${esc(g.n)}"><button type="button" data-d="${i}" data-v="1" aria-label="One more">+</button></span>
        <span class="seg" role="group" aria-label="Star level"><button type="button" data-star="${i}" data-s="5" aria-pressed="${g.star!==6}">5★</button><button type="button" data-star="${i}" data-s="6" aria-pressed="${g.star===6}">6★</button></span>
        <span class="muted" style="font-size:12.5px">${g.c*(g.star===6?2:1)} craft${g.c*(g.star===6?2:1)===1?"":"s"}</span></div></div>`}).join("")
    +S.extra.map((e,i)=>{const m=MIN[e.n.toLowerCase()];return `<div class="goal"><div class="icon">${m&&m.ic?`<img src="${m.ic}" alt="" width="36" height="36">`:""}</div>
      <div class="nm" data-mineral="${esc(e.n)}"><b>${esc(e.n)}</b><span class="rr" style="--rc:${rc(m?m.r:"common")}">${m?m.r:""} · extra material</span></div>
      <button type="button" class="x" data-rmx="${i}" aria-label="Remove ${esc(e.n)}">Remove</button>
      <div class="ctl"><span class="step"><button type="button" data-dx="${i}" data-v="-1" aria-label="One fewer">−</button><input type="number" min="1" value="${e.q}" data-cx="${i}" aria-label="How many ${esc(e.n)}"><button type="button" data-dx="${i}" data-v="1" aria-label="One more">+</button></span></div></div>`}).join("")
    :'<p class="muted" style="margin:0">Nothing added yet. Add an item above, or open any item on the Equipment page and press “Add to crafting checklist”.</p>';
  const {rows,tot,got,done,cost,usedBy}=calc();summary();
  const vis=rows.filter(r=>!S.hide||r.left);
  $("mats").innerHTML=rows.length?`<table class="mat"><thead><tr><th>Material</th><th style="text-align:right">Need</th><th style="text-align:right">Have</th><th style="text-align:right">Left</th><th>Best place to farm</th></tr></thead><tbody>
    ${vis.map(r=>`<tr class="${r.left?"":"done"}"><td><div class="mn" data-mineral="${esc(r.n)}" title="Ctrl+click to open ${esc(r.n)}">${r.m&&r.m.ic?`<img src="${r.m.ic}" alt="" width="30" height="30" loading="lazy">`:""}<span><b>${esc(r.n)}</b><span class="rr" style="--rc:${rc(r.m?r.m.r:"common")}">${r.m?r.m.r:""}</span> <span class="used">· ${[...usedBy[r.n]].filter(u=>u!=="extra").join(", ")||"extra"}</span></span></div></td>
      <td class="n" data-l="Need">${fmt(r.q,0)}</td><td class="n" data-l="Have"><input type="number" min="0" value="${r.have}" data-have="${esc(r.n)}" aria-label="How many ${esc(r.n)} you have"></td>
      <td class="n st ${r.left?"no":"ok"}" data-l="Left">${r.left?fmt(r.left,0):"✓ done"}</td><td class="w"><div class="where"${(whereInfo(r.n)||{}).hasVoid?` title="${VOID_TIP}"`:""}>${where(r.n)}</div></td></tr>`).join("")}</tbody></table>${vis.length<rows.length?`<p class="muted" style="font-size:12.5px;margin:8px 0 0">${rows.length-vis.length} finished material${rows.length-vis.length===1?"":"s"} hidden.</p>`:""}`
    :'<div class="empty">Your materials will show up here.</div>';
}
document.addEventListener("click",e=>{
  if(e.ctrlKey||e.metaKey)return;const t=e.target.closest("button");if(!t)return;
  if(t.dataset.rm!=null){S.goals.splice(+t.dataset.rm,1)}
  else if(t.dataset.rmx!=null){S.extra.splice(+t.dataset.rmx,1)}
  else if(t.dataset.d!=null){const g=S.goals[+t.dataset.d];g.c=Math.max(1,g.c+ +t.dataset.v)}
  else if(t.dataset.dx!=null){const g=S.extra[+t.dataset.dx];g.q=Math.max(1,g.q+ +t.dataset.v)}
  else if(t.dataset.star!=null){S.goals[+t.dataset.star].star=+t.dataset.s}
  else return;save();render()});
document.addEventListener("change",e=>{const t=e.target;
  if(t.dataset.c!=null){S.goals[+t.dataset.c].c=Math.max(1,parseInt(t.value)||1)}
  else if(t.dataset.cx!=null){S.extra[+t.dataset.cx].q=Math.max(1,parseInt(t.value)||1)}
  else if(t.dataset.have!=null){S.have[t.dataset.have]=Math.max(0,parseInt(t.value)||0);save();
    // update just this row so tabbing through the have-boxes keeps focus
    const r=summary().find(r=>r.n===t.dataset.have);const tr=t.closest("tr");if(r&&tr){tr.classList.toggle("done",!r.left);const c=tr.querySelector("td.st");c.className="n st "+(r.left?"no":"ok");c.textContent=r.left?fmt(r.left,0):"✓ done"}return}
  else return;save();render()});
// ---- save the checklist as an image: what you're crafting, then the materials (follows Hide finished) ----
$("toImg").onclick=()=>{const {rows,tot,got,done,cost}=calc();if(!S.goals.length&&!S.extra.length){ptToast("Add something to craft first");return}
  const mode=S.pm||"effort";const wt=rows.reduce((s,r)=>s+r.q*effort(r.n),0),wg=rows.reduce((s,r)=>s+Math.min(r.q,r.have)*effort(r.n),0);const pct=mode==="effort"?(wt?wg/wt*100:0):(tot?got/tot*100:0);
  const sub=[`Progress ${pctTxt(pct)}% ${mode==="effort"?"by effort":"by item count"}`,`${done} / ${rows.length} materials ready`,`${fmt(got,0)} / ${fmt(tot,0)} items collected`];if(cost)sub.push(`$${fmt(cost,0)} in crafting fees`);
  const goals=S.goals.map(g=>{const x=EQ[g.n.toLowerCase()];const cr=g.c*(g.star===6?2:1);return {cells:[{t:g.n,b:true,ic:x&&P.eimg[x.img],sub:x?x.r+" "+x.slot:"",subcol:x?(RHEX[x.r]||"#98a2ad"):"#98a2ad"},{t:"×"+g.c,mono:true},{t:g.star+"★",mono:true,col:"#f2b53a"},{t:cr+" craft"+(cr===1?"":"s"),col:"#98a2ad"}]}})
    .concat(S.extra.map(e=>{const m=MIN[e.n.toLowerCase()];return {cells:[{t:e.n,b:true,ic:m&&m.ic,sub:(m?m.r+" · ":"")+"extra material",subcol:m?(RHEX[m.r]||"#98a2ad"):"#98a2ad"},{t:"×"+e.q,mono:true},{t:"—",col:"#98a2ad"},{t:"",col:"#98a2ad"}]}}));
  const vis=rows.filter(r=>!S.hide||r.left);
  const mats=vis.map(r=>{const w=whereInfo(r.n);const o=w?oneIn(w.best[2]):NaN;const place=!w?"—":(w.voidOnly?"Only in The Void":w.best[0]);
    return {cells:[{t:r.n,b:true,ic:r.m&&r.m.ic,sub:r.m?r.m.r:"",subcol:r.m?(RHEX[r.m.r]||"#98a2ad"):"#98a2ad"},{t:fmt(r.q,0),mono:true},{t:fmt(r.have,0),mono:true},{t:r.left?fmt(r.left,0):"✓ done",mono:!!r.left,b:!r.left,fs:r.left?14:13.5,col:r.left?"#e6e9ec":"#3cc2a8"},{t:place,wrap:true,sub:w&&isFinite(o)?"~1 in "+o.toLocaleString("en-US"):"",col:w?"#e6e9ec":"#98a2ad"}]}});
  const secs=[{h:"What you're crafting",cols:[{h:"Item",w:.5},{h:"How many",w:.15,al:"r"},{h:"Stars",w:.15,al:"r"},{h:"Crafts",w:.2,al:"r"}],rows:goals}];
  if(mats.length)secs.push({h:"Materials"+(vis.length<rows.length?` (${rows.length-vis.length} finished hidden)`:""),cols:[{h:"Material",w:.32},{h:"Need",w:.1,al:"r"},{h:"Have",w:.1,al:"r"},{h:"Left",w:.12,al:"r"},{h:"Best place to farm",w:.36}],rows:mats});
  // the "What's left" chart, same slices and colours as on the page, with a legend naming each colour
  const pp=pieParts(rows,mode),ptot=pp.reduce((t,x)=>t+x.v,0);
  const pieO=pp.length?{h:"What's left",center:fmt(pp.reduce((t,x)=>t+x.left,0),0),centerSub:"items left",note:mode==="effort"?"Slices show how much of the remaining effort each material is.":"Slices show how many of each material are left.",
    parts:pp.map(x=>({n:x.n,col:PAL[x.ci%PAL.length],v:x.v,left:x.left,pct:pctTxt(x.v/ptot*100)+"%",ic:x.other?null:(MIN[x.n.toLowerCase()]||{}).ic}))}:null;
  ptSaveImg("Crafting checklist",()=>ptTableImage({title:"Crafting list",sub,pie:pieO,sections:secs}))};
const RHEX={Ascended:"#ffd36b",Exotic:"#f17ad6",Mythic:"#f0687f",Legendary:"#f2b53a",Epic:"#b880ee",Rare:"#68a6f0",Uncommon:"#6cc46e",Common:"#a3adb8"};
// ---- farming route for what's left ----
let ROUTE=null;
function renderRoute(){const {rows}=calc();const left=rows.filter(r=>r.left>0);
  if(!left.length){$("rtSum").innerHTML="";$("rtStops").innerHTML=`<div class="empty">${rows.length?"Nothing left to farm. Everything's ready to craft.":"Add something to craft to get a route."}</div>`;$("rtIssues").innerHTML="";ROUTE=null;return}
  const items=left.filter(r=>r.m).map(r=>({m:r.m,u:"None",c:r.left}));
  const R=RT.plan(items);ROUTE=R;
  $("rtSum").innerHTML=RT.sumHTML(R,`<div><span class="lab">Materials to farm</span><b>${R.T.length}</b><span class="hint">${fmt(R.T.reduce((s,t)=>s+t.c,0),0)} items in total</span></div>`);
  $("rtStops").innerHTML=RT.stopsHTML(R,{tick:false});
  if(!R.zones.length)$("rtStops").innerHTML='<div class="empty">Nothing on your list can be farmed with these settings yet. See below for where each item drops.</div>';
  const extra=left.filter(r=>!r.m).map(r=>`<b>${esc(r.n)}</b>: not a mineral, so it isn't on the route.`);
  $("rtIssues").innerHTML=[...R.issues,...extra].map(x=>`<li>${x}</li>`).join("")}
$("rtSet").innerHTML=RT.settingsHTML(false);RT.bind($("rtSet"),renderRoute);
$("copyRoute").onclick=async()=>{if(!ROUTE)return;const txt="Crafting farm route\n"+RT.routeText(ROUTE);let ok=false;
  try{await navigator.clipboard.writeText(txt);ok=true}catch(e){try{const ta=document.createElement("textarea");ta.value=txt;ta.style.position="fixed";ta.style.opacity="0";document.body.appendChild(ta);ta.select();ok=document.execCommand("copy");ta.remove()}catch(e2){}}
  const b=$("copyRoute");const o=b.textContent;b.textContent=ok?"Copied!":"Couldn't copy";setTimeout(()=>b.textContent=o,1500)};

// refresh the route whenever the checklist changes (debounced so typing stays smooth)
{const base=render;let rt=null;render=function(){base.apply(this,arguments);clearTimeout(rt);rt=setTimeout(renderRoute,200)}}
render();
