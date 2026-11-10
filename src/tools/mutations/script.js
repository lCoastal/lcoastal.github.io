
const $=id=>document.getElementById(id);
const X=P.ench||{pan:[],shovel:[],muts:[],chances:{},cat:{}};
const PCTS=new Set(["Shake Speed","Size Boost","Modifier Boost","Sell Boost"]);
const MC={Silver:"#a9b4be",Gold:"#d9a520",Diamond:"#5fc8e8",Granite:"#8d8d86",Overclocked:"#e0602f",Festive:"#d23c3c",Prismatic:"#c05bd8"};
// tabs
const TABS=[["mut","p-mut"],["pan","p-pan"],["sh","p-sh"]];
let tab="mut";try{tab=localStorage.getItem("pmu-tab")||"mut"}catch(e){}
// each part is its own tab in the site's top bar, so the heading changes with it
const PAGEINFO={mut:["Gear Mutations","Every equipment mutation, what it does and how likely you are to roll it at the Mutation Forge."],pan:["Pan Enchants","Every pan enchant and what it does.<br>Pick your pan to see what each enchant would give it."],sh:["Shovel Enchants","Every shovel enchant and what it does."]};
function setTab(t){if(!TABS.some(x=>x[0]===t))t="mut";tab=t;$("ttl").textContent=PAGEINFO[t][0];document.querySelector(".lede").innerHTML=PAGEINFO[t][1];document.title=PAGEINFO[t][0];try{window.parent.ptSubChanged&&window.parent.ptSubChanged("mutations",t)}catch(e){}TABS.forEach(([k,p])=>{$("tab-"+k).setAttribute("aria-selected",String(k===t));$("tab-"+k).tabIndex=k===t?0:-1;$(p).hidden=k!==t});try{localStorage.setItem("pmu-tab",t)}catch(e){}}
document.querySelector(".tabs").addEventListener("click",e=>{const b=e.target.closest("[role=tab]");if(b)setTab(b.id.slice(4))});
document.querySelector(".tabs").addEventListener("keydown",e=>{const i=TABS.findIndex(t=>t[0]===tab);if(e.key==="ArrowRight"||e.key==="ArrowLeft"){const n=TABS[(i+(e.key==="ArrowRight"?1:TABS.length-1))%TABS.length][0];setTab(n);$("tab-"+n).focus()}});
window.ptOpenTab=t=>setTab(t);
// gear mutations
$("mcards").innerHTML=X.muts.map(m=>`<div class="mc" style="--mc:${MC[m.n]||"var(--accent)"}"><b>${esc(m.n)}</b><span class="x">×${m.x}</span><small>${Object.entries(m.a).map(([k,v])=>`+${v}${PCTS.has(k)?"%":""} ${esc(k)}`).join(", ")||"all stats"}${m.ev?` · ${esc(m.ev)}`:""}</small></div>`).join("");
const order=["Prismatic","Overclocked","Granite","Diamond","Gold","Silver","None"];
$("chance").innerHTML=`<tr><th>Catalysts</th>${Array.from({length:15},(_,i)=>`<th style="text-align:center">${i+1}</th>`).join("")}</tr>`+order.filter(k=>X.chances[k]).map(k=>`<tr><td class="nm" style="color:${MC[k]||"var(--muted)"}">${k==="None"?"No mutation":k}</td>${X.chances[k].map(v=>{const p=parseFloat(v);return `<td class="h" style="--p:${Math.min(60,p*1.6).toFixed(0)}%">${esc(v)}</td>`}).join("")}</tr>`).join("");
// catalyst list: search + slot, item rarity, catalyst, catalyst rarity filters; kept per browser
const RORD=["Common","Uncommon","Rare","Epic","Legendary","Mythic","Exotic","Ascended"],RDK={Common:"#a3adb8",Uncommon:"#6cc46e",Rare:"#68a6f0",Epic:"#b880ee",Legendary:"#f2b53a",Mythic:"#f0687f",Exotic:"#f17ad6",Ascended:"#ffd36b"};
const EQ=Object.fromEntries(P.equip.map(x=>[x.n,x]));
const CROWS=Object.entries(X.cat).map(([e,c])=>{const x=EQ[e]||{},m=MIN[c.toLowerCase()]||{};return {e,c,er:x.r||"",slot:x.slot||"",cr:m.r||"",ic:m.ic||""}});
let CF={q:"",m:"",s:"er",slot:"",er:[]};try{Object.assign(CF,JSON.parse(localStorage.getItem("pmu-catf")||"{}"))}catch(e){}delete CF.cr;if(!["er","en","cn"].includes(CF.s))CF.s="er";
const ri=r=>{const i=RORD.indexOf(r);return i<0?99:i};
const uniq=a=>[...new Set(a.filter(Boolean))];
const slots=uniq(CROWS.map(r=>r.slot)).sort(),ers=uniq(CROWS.map(r=>r.er)).sort((a,b)=>ri(a)-ri(b));
const catNames=uniq(CROWS.map(r=>r.c)).sort((a,b)=>a.localeCompare(b));
$("catM").innerHTML='<option value="">Any catalyst</option>'+catNames.map(c=>`<option value="${esc(c)}">${esc(c)} (${CROWS.filter(r=>r.c===c).length})</option>`).join("");
const chip=(k,v,on,col)=>`<button type="button" class="chip" data-cf="${k}" data-v="${esc(v)}" aria-pressed="${on}"${col?` style="${on?"":`color:${col}`}"`:""}>${esc(v||"All")}</button>`;
function catRows(){const q=CF.q.trim().toLowerCase();let r=CROWS.filter(x=>(!q||(x.e+" "+x.c).toLowerCase().includes(q))&&(!CF.m||x.c===CF.m)&&(!CF.slot||x.slot===CF.slot)&&(!CF.er.length||CF.er.includes(x.er)));
  const by={er:(a,b)=>ri(a.er)-ri(b.er)||a.e.localeCompare(b.e),en:(a,b)=>a.e.localeCompare(b.e),cn:(a,b)=>a.c.localeCompare(b.c)||ri(a.er)-ri(b.er)}[CF.s]||(()=>0);return r.sort(by)}
function cats(){try{localStorage.setItem("pmu-catf",JSON.stringify(CF))}catch(e){}
  $("catQ").value=CF.q;$("catM").value=CF.m;$("catS").value=CF.s;
  $("catSlot").innerHTML=chip("slot","",!CF.slot)+slots.map(v=>chip("slot",v,CF.slot===v)).join("");
  $("catER").innerHTML=`<button type="button" class="chip" data-cf="erall" data-v="" aria-pressed="${!CF.er.length}">All</button>`+[...ers].reverse().map(v=>`<button type="button" class="chip r" data-cf="er" data-v="${esc(v)}" style="--rc:${rc(v)}" aria-pressed="${CF.er.includes(v)}">${esc(v)}</button>`).join("");
  const rows=catRows();const busy=CF.q||CF.m||CF.slot||CF.er.length;
  $("catN").textContent=busy?`${rows.length} of ${CROWS.length} items`:`${CROWS.length} items`;$("catClr").hidden=!busy;
  $("cats").innerHTML=`<thead><tr><th>Equipment</th><th>Rarity</th><th>Catalyst</th></tr></thead><tbody>${rows.map(x=>
    `<tr><td class="nm">${window.ptIc?ptIc(x.e,"Equipment"):""}${esc(x.e)}</td><td><span class="rr" style="--rc:${x.er?rc(x.er):"var(--muted)"}">${esc((x.er+" "+x.slot).trim())}</span></td><td><span class="mat lk" data-mineral="${esc(x.c)}" title="Ctrl+click to open ${esc(x.c)}">${x.ic?`<img src="${x.ic}" alt="" width="22" height="22" loading="lazy">`:""}${esc(x.c)}</span></td></tr>`).join("")||'<tr><td colspan="3" class="muted">Nothing matches.</td></tr>'}</tbody>`}
$("catQ").oninput=e=>{CF.q=e.target.value;cats()};$("catM").onchange=e=>{CF.m=e.target.value;cats()};$("catS").onchange=e=>{CF.s=e.target.value;cats()};
$("catClr").onclick=()=>{Object.assign(CF,{q:"",m:"",slot:"",er:[]});cats()};
document.addEventListener("click",e=>{const b=e.target.closest("[data-cf]");if(!b)return;const k=b.dataset.cf,v=b.dataset.v;if(k==="slot")CF.slot=v;else if(k==="erall")CF.er=[];else CF[k]=CF[k].includes(v)?CF[k].filter(x=>x!==v):CF[k].concat(v);if(CF.er.length===ers.length)CF.er=[];cats()});
cats();
$("imgCat").onclick=()=>{const rows=catRows();if(!rows.length){ptToast("Nothing to save, no items match");return}
  const f=[CF.slot&&CF.slot+"s",CF.er.length&&CF.er.join("/")+" items",CF.m&&"needs "+CF.m,CF.q&&`"${CF.q}"`].filter(Boolean);
  return ptSaveImg("Equipment catalysts",()=>ptTableImage({title:"Which catalyst each item needs",tic:"",sub:[f.length?f.join(" · "):"All equipment",rows.length+" items"],
    sections:[{cols:[{h:"Equipment",w:.42},{h:"Rarity",w:.26},{h:"Catalyst",w:.32}],
      rows:rows.map(x=>({cells:[{t:x.e,b:true},{t:(x.er+" "+x.slot).trim(),col:RDK[x.er]||"#98a2ad"},{t:x.c,b:true}]}))}],
    note:"Put the catalyst into the Mutation Forge at Frozen Peak to reroll the item's mutation."}))};
// odds shown as % (as in game) or "1 in N"; one setting for both enchant tabs, kept per browser
let OF="pct";try{OF=localStorage.getItem("pmu-ofmt")||"pct"}catch(e){}
const od=v=>{const p=parseFloat(v);if(!(p>0))return "—";if(OF==="pct")return v;const n=100/p;return "1 in "+(n<10?fmt(n,1):fmt(Math.round(n),0))};
const segSync=()=>document.querySelectorAll("[data-ofmt]").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.ofmt===OF)));
// pan enchants
const pans=P.gear.pans;let panN="";try{panN=localStorage.getItem("pmu-pan")||""}catch(e){}
$("panSel").innerHTML=`<option value="">— no pan (just show effects) —</option>`+pans.map(p=>`<option${p.name===panN?" selected":""}>${esc(p.name)}</option>`).join("");
const panBase=p=>({"Luck":num(p.luck)||0,"Capacity":num(p.capacity)||0,"Shake Strength":num(p.strength)||0,"Shake Speed":String(p.speed).includes("%")?num(p.speed):(num(p.speed)||0)*100});
// the stat name in each chip is in that stat's colour (Luck green and so on); "Pan Luck" style multipliers stay white
const sk=k=>`<b class="sk" style="color:${statVar(k)}">${esc(k)}</b>`;
function fxChips(e){const out=[];Object.entries(e.m).forEach(([k,v])=>out.push([`${v}× <b class="sk">Pan ${esc(k)}</b>`,v>=1,k]));Object.entries(e.a).forEach(([k,v])=>out.push([`${v>0?"+":"−"}${Math.abs(v)}${PCTS.has(k)?"%":""} ${sk(k)}`,v>0,k]));return `<div class="fx">${out.map(([t,u,k])=>`<span class="${u?"up":"dn"}" style="--sc:${statVar(k)}">${t}</span>`).join("")}</div>`}
// enchants you hide yourself (Hide button on each row); kept per browser
let HID={pan:[],sh:[]};try{Object.assign(HID,JSON.parse(localStorage.getItem("pmu-hide")||"{}"))}catch(e){}
const saveHid=()=>{try{localStorage.setItem("pmu-hide",JSON.stringify(HID))}catch(e){}};
const hidBar=k=>HID[k].length?`<span>Hidden:</span>${HID[k].map(n=>`<button type="button" class="hb" data-show="${k}|${esc(n)}" title="Show ${esc(n)} again">${esc(n)} ✕</button>`).join("")}<button type="button" class="hb" data-showall="${k}">Show all</button>`:"";
const hideBtn=(k,n)=>`<td class="hc"><button type="button" class="hb" data-hide="${k}|${esc(n)}" aria-label="Hide ${esc(n)}">Hide</button></td>`;
function panRows(){const p=pans.find(x=>x.name===$("panSel").value);const only=$("onlyAeth").checked;const base=p?panBase(p):null;
  const rows=X.pan.filter(e=>(!only||parseFloat(e.ch[2])>0)&&!HID.pan.includes(e.n)).map(e=>{let res=null;if(base){res={};["Luck","Capacity","Shake Strength"].forEach(k=>res[k]=base[k]*(e.m[k]||1)+(e.a[k]||0))}return {e,res}});
  return {p,base,only,rows,bestLuck:base&&rows.length?Math.max(...rows.map(r=>r.res.Luck)):null}}
function panTable(){const {base,rows,bestLuck}=panRows();
  $("pans").innerHTML=`<thead><tr><th>Enchant</th><th>Effect</th>${base?`<th class="r">Pan Luck</th><th class="r">Pan Capacity</th>`:""}<th class="r">Aurorite</th><th class="r">Aetherite</th><th class="r">Aetherium</th><th>Book</th><th></th></tr></thead><tbody>${rows.map(({e,res})=>`<tr class="${res&&res.Luck===bestLuck?"best":""}"><td class="nm">${esc(e.n)}</td><td class="full">${fxChips(e)}</td>
    ${res?`<td class="r" data-l="Luck">${fmt(base.Luck,2)} → <b>${fmt(res.Luck,1)}</b></td><td class="r" data-l="Capacity">${fmt(base.Capacity,2)} → <b>${fmt(res.Capacity,1)}</b></td>`:""}
    <td class="r" data-l="Aurorite">${od(e.ch[0])}</td><td class="r" data-l="Aetherite">${od(e.ch[1])}</td><td class="r" data-l="Aetherium">${od(e.ch[2])}</td><td class="muted" style="font-size:12.5px">${e.src?esc(e.src):"—"}</td>${hideBtn("pan",e.n)}</tr>`).join("")||`<tr><td colspan="10" class="muted">Every enchant here is hidden.</td></tr>`}</tbody>`;
  $("panHid").innerHTML=hidBar("pan");
  try{localStorage.setItem("pmu-pan",$("panSel").value)}catch(e){}}
$("panSel").onchange=panTable;$("onlyAeth").onchange=panTable;panTable();
// shovel enchants
function shTable(){const rows=X.shovel.filter(e=>!HID.sh.includes(e.n));
  $("shovels").innerHTML=`<thead><tr><th>Enchant</th><th>Effect</th><th class="r">Aetherite</th><th class="r">Aetherium</th><th>Unlock</th><th></th></tr></thead><tbody>${rows.map(e=>`<tr><td class="nm">${esc(e.n)}</td><td class="full">${esc(e.d)}</td><td class="r" data-l="Aetherite">${od(e.ch[0])}</td><td class="r" data-l="Aetherium">${od(e.ch[1])}</td><td><span class="lockt ${e.lock?"l":"u"}">${e.lock?"Seed of Light quest":"Always available"}</span></td>${hideBtn("sh",e.n)}</tr>`).join("")||`<tr><td colspan="6" class="muted">Every enchant here is hidden.</td></tr>`}</tbody>`;
  $("shHid").innerHTML=hidBar("sh")}
shTable();
document.addEventListener("click",e=>{const o=e.target.closest("[data-ofmt]");if(o){OF=o.dataset.ofmt;try{localStorage.setItem("pmu-ofmt",OF)}catch(x){}segSync();panTable();shTable();return}
  const h=e.target.closest("[data-hide],[data-show],[data-showall]");if(!h)return;
  if(h.dataset.showall){HID[h.dataset.showall]=[]}else{const [k,n]=(h.dataset.hide||h.dataset.show).split("|");HID[k]=h.dataset.hide?[...new Set([...HID[k],n])]:HID[k].filter(x=>x!==n)}
  saveHid();panTable();shTable()});
// ---- save each tab as an image ----
const MUTHEX={...MC,None:"#98a2ad"};
const chipsOf=e=>{const out=[];Object.entries(e.m).forEach(([k,v])=>out.push({t:`${v}× Pan ${k}`,col:"#e6e9ec"}));Object.entries(e.a).forEach(([k,v])=>out.push({t:`${v>0?"+":"−"}${Math.abs(v)}${PCTS.has(k)?"%":""} ${k}`,col:v>0?statHex(k):"#ef7a66"}));return out};
$("imgMut").onclick=()=>ptSaveImg("Gear mutations",()=>ptTableImage({title:"Gear mutations",sub:["Multiplies every stat on the item","odds per roll at the Mutation Forge, no event"],
  sections:[{h:"What each mutation does",cols:[{h:"Mutation",w:.22},{h:"Stats",w:.1,al:"c"},{h:"Extra bonus",w:.48},{h:"Note",w:.2}],
    rows:X.muts.map(m=>({cells:[{t:m.n,b:true,col:MC[m.n]||"#e6e9ec",dot:MC[m.n]||"#3cc2a8"},{t:"×"+m.x,mono:true,al:"r"},Object.keys(m.a).length?{chips:Object.entries(m.a).map(([k,v])=>({t:`+${v}${PCTS.has(k)?"%":""} ${k}`,col:statHex(k)}))}:{t:"All stats",col:"#98a2ad"},{t:m.ev||"",col:"#98a2ad",wrap:true}]}))},
   {h:"Chance per roll by number of catalysts",cols:[{h:"Catalysts",w:.16}].concat(Array.from({length:15},(_,i)=>({h:String(i+1),w:.84/15,al:"c"}))),
    rows:order.filter(k=>X.chances[k]).map(k=>({cells:[{t:k==="None"?"No mutation":k,b:true,fs:14,col:MUTHEX[k]||"#98a2ad"}].concat(X.chances[k].map(v=>{const p=parseFloat(v);return {t:v,mono:true,fs:11.5,bg:`rgba(60,194,168,${Math.min(.6,p*1.6/100).toFixed(3)})`}}))}))}],
  note:"Odds with no event running. A Prismatic Catalyst applies Prismatic directly."}));
$("imgPan").onclick=()=>{const {p,base,only,rows,bestLuck}=panRows();if(!rows.length){ptToast("Nothing to save, every enchant is hidden");return}
  const cols=base?[{h:"Enchant",w:.14},{h:"Effect",w:.29},{h:"Pan Luck",w:.09,al:"r"},{h:"Pan Capacity",w:.11,al:"r"},{h:"Aurorite",w:.08,al:"r"},{h:"Aetherite",w:.08,al:"r"},{h:"Aetherium",w:.09,al:"r"},{h:"Book",w:.12}]
    :[{h:"Enchant",w:.16},{h:"Effect",w:.4},{h:"Aurorite",w:.1,al:"r"},{h:"Aetherite",w:.1,al:"r"},{h:"Aetherium",w:.1,al:"r"},{h:"Book",w:.14}];
  const sub=[`${rows.length} enchant${rows.length===1?"":"s"}`];if(p)sub.push("on the "+p.name);if(only)sub.push("Aetherium only");if(HID.pan.length)sub.push(`${HID.pan.length} hidden`);
  return ptSaveImg(p?`Pan enchants on ${p.name}`:"Pan enchants",()=>ptTableImage({title:p?`Pan enchants on the ${p.name}`:"Pan enchants",sub,
    sections:[{cols,rows:rows.map(({e,res})=>({cells:[{t:e.n,b:true,col:res&&res.Luck===bestLuck?"#3cc2a8":"#e6e9ec"},{chips:chipsOf(e)}].concat(res?[{t:fmt(res.Luck,1),sub:"from "+fmt(base.Luck,2),mono:true},{t:fmt(res.Capacity,1),sub:"from "+fmt(base.Capacity,2),mono:true}]:[]).concat([{t:od(e.ch[0]),mono:true},{t:od(e.ch[1]),mono:true},{t:od(e.ch[2]),mono:true},{t:e.src||"—",col:"#98a2ad",fs:12.5,wrap:true}])}))}]}))};
$("imgSh").onclick=()=>{const rows=X.shovel.filter(e=>!HID.sh.includes(e.n));if(!rows.length){ptToast("Nothing to save, every enchant is hidden");return}
  const sub=[`${rows.length} enchant${rows.length===1?"":"s"}`,"enchant at the altar in the Azuralite Oasis"];if(HID.sh.length)sub.push(`${HID.sh.length} hidden`);
  return ptSaveImg("Shovel enchants",()=>ptTableImage({title:"Shovel enchants",sub,
    sections:[{cols:[{h:"Enchant",w:.16},{h:"Effect",w:.48},{h:"Aetherite",w:.1,al:"r"},{h:"Aetherium",w:.1,al:"r"},{h:"Unlock",w:.16}],
      rows:rows.map(e=>({cells:[{t:e.n,b:true},{t:e.d,wrap:true},{t:od(e.ch[0]),mono:true},{t:od(e.ch[1]),mono:true},{t:e.lock?"Seed of Light quest":"Always available",col:e.lock?"#f2b53a":"#3cc2a8",fs:12.5,b:true}]}))}]}))};
segSync();setTab(TABS.some(t=>t[0]===tab)?tab:"mut");
