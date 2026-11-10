
const $=id=>document.getElementById(id);
let S={luck:null,cap:null,pph:"",trav:50,walk:false,w:[{m:"",n:""},{m:"",n:""},{m:"",n:""}]};
try{Object.assign(S,JSON.parse(localStorage.getItem("pt-dredge")||"{}"))}catch(e){}
try{const o=JSON.parse(localStorage.getItem("po-s")||"{}");if(!(+S.luck>0))S.luck=+o.luck||1000;if(!(+S.cap>0))S.cap=+o.cap||100}catch(e){if(!(+S.luck>0))S.luck=1000;if(!(+S.cap>0))S.cap=100}
if(!Array.isArray(S.w)||S.w.length!==3)S.w=[{m:"",n:""},{m:"",n:""},{m:"",n:""}];
// your luck / capacity / pans per hour are shared with every tool that asks for them
const youGet=()=>{try{return window.parent.ptYou.get()}catch(e){return {}}};const youSet=p=>{try{window.parent.ptYou.set(p)}catch(e){}};
const youPull=keys=>{const y=youGet();keys.forEach(k=>{if(y[k]!==undefined&&y[k]!==null&&y[k]!=="")S[k]=y[k]});};
youPull(["luck","cap","pph"]);
const save=()=>{try{localStorage.setItem("pt-dredge",JSON.stringify(S))}catch(e){}youSet({luck:S.luck,cap:S.cap,pph:S.pph})};
const CAPS=[1,5,10,25,50,100,250,500,1000,2500,5000,10000,25000,50000,100000];
// same drop model as Luck Odds and Best Luck Cap
const LOC={};P.mins.forEach(m=>(m.ch||[]).forEach(c=>{const p=parseFloat(String(c[1]).replace(/[%,]/g,""))/100;if(!(p>0))return;(LOC[c[0]]=LOC[c[0]]||[]).push({m,p})}));
function fullList(loc){const b=baseLoc(loc);const own=LOC[loc]||[];let out;
  if(b!==loc&&LOC[b])out=LOC[b].filter(x=>!own.some(y=>y.m===x.m)).concat(own);
  else if(own.length<2){const seen=new Set();out=[];Object.keys(LOC).filter(v=>v!==loc&&baseLoc(v)===loc).forEach(v=>LOC[v].concat(own).forEach(x=>{if(!seen.has(x.m)){seen.add(x.m);out.push(x)}}))}
  else out=[...own];
  return out.length<2?[]:out}
const SH={};
function shares(loc,L){const k=loc+"|"+L;if(SH[k])return SH[k];const list=fullList(loc).sort((a,b)=>a.p-b.p);const tot=list.reduce((s,x)=>s+x.p,0);let c=0;
  const f=(lo,hi,l)=>Math.pow(1-lo,l)-Math.pow(1-hi,l);const out=new Map();
  list.forEach(x=>{const lo=c/tot,hi=(c+x.p)/tot;c+=x.p;out.set(x.m,0.25*f(lo,hi,1)+0.25*f(lo,hi,Math.max(1,L/2))+0.5*f(lo,hi,Math.max(1,L)))});return SH[k]=out}
// a zone that only lists one mineral itself (The Void) is covered by its variant
const ZONES=Object.keys(LOC).filter(l=>fullList(l).length&&(LOC[l].length>1||baseLoc(l)!==l));
const MINS=P.mins.filter(m=>ZONES.some(z=>fullList(z).some(x=>x.m===m))).sort((a,b)=>a.n.localeCompare(b.n));
// type-to-search suggestions for each wanted mineral (same search box as Luck Odds and Best Luck Cap)
const ACITEMS=MINS.map(m=>({n:m.n,tag:m.r,ic:m.ic,col:rc(m.r)}));
const findMin=t=>{t=String(t||"").trim().toLowerCase();return t?MINS.find(m=>m.n.toLowerCase()===t):null};
const isVoid=z=>/Void/.test(z);
const oneInD=p=>{if(!(p>0))return "—";const n=1/p;return "~1 in "+(n<10?fmt(n,1):fmt(Math.round(n),0))};
const hrs=pans=>{const pph=+S.pph;if(!(pph>0)||!isFinite(pans))return "";const h=pans/pph;return h*60<1?"under 1 min":h<1?fmt(h*60,0)+" min":h<48?fmt(h,1)+" h":fmt(h/24,1)+" days"};
const pansT=x=>!isFinite(x)?"—":x<1?"under 1":x<10?fmt(x,1):fmt(Math.round(x),0);
const pansW=x=>(x<1?"under 1 pan":(x<10?fmt(x,1):fmt(Math.round(x),0))+(Math.round(x*10)/10===1?" pan":" pans"));
// best (zone, cap) for a group of wanted items: the one where the slowest item finishes first
function bestFor(group,L,per){let best=null;
  const tryZones=voidOk=>ZONES.filter(z=>voidOk||!isVoid(z)).forEach(z=>{const fl=fullList(z);if(!group.every(g=>fl.some(x=>x.m===g.m)))return;
    const opts=[null,...CAPS.filter(c=>c<L)];
    opts.forEach(cap=>{const Le=cap==null?L:cap;const sh=shares(z,Le);let worst=0;const its=group.map(g=>{const e=sh.get(g.m)||0;const pans=e>0?g.n/(e*per):Infinity;worst=Math.max(worst,pans);return {g,e,pans}});
      if(!best||worst<best.pans*(1-1e-9)||(Math.abs(worst-best.pans)<=best.pans*1e-9&&cap==null&&best.cap!=null))best={z,cap,pans:worst,its}})});
  // The Void only when something in the group drops nowhere else
  const voidOnly=group.some(g=>!ZONES.some(z=>!isVoid(z)&&fullList(z).some(x=>x.m===g.m)));
  tryZones(voidOnly);return best}
const PARTS={1:[[[0]]],2:[[[0,1]],[[0],[1]]],3:[[[0,1,2]],[[0,1],[2]],[[0,2],[1]],[[1,2],[0]],[[0],[1],[2]]]};
function plan(){const L=Math.max(1,+S.luck||1),per=Math.sqrt(Math.max(1,+S.cap||1));
  // merge repeats of the same mineral
  const want=[];S.w.forEach(w=>{const m=findMin(w.m);const n=Math.max(0,Math.round(+w.n||0));if(!m||!n)return;const o=want.find(x=>x.m===m);if(o)o.n+=n;else want.push({m,n})});
  if(!want.length)return null;
  const options=PARTS[want.length].map(pt=>{const stops=pt.map(ix=>bestFor(ix.map(i=>want[i]),L,per));if(stops.some(s=>!s))return null;return {stops,total:stops.reduce((t,s)=>t+s.pans,0)}}).filter(Boolean);
  if(!options.length)return {want,none:true};
  const fastest=options.reduce((a,b)=>b.total<a.total?b:a);
  // each extra stop costs the travel time; fewer stops also wins if it's within 15% of the best
  const T=walkT();options.forEach(o=>o.cost=o.total+T*(o.stops.length-1));
  const cheapest=options.reduce((a,b)=>b.cost<a.cost?b:a);
  const pick=options.filter(o=>o.cost<=cheapest.cost*1.15).sort((a,b)=>a.stops.length-b.stops.length||a.cost-b.cost)[0];
  const one=options.find(o=>o.stops.length===1);
  return {want,pick,fastest,one}}
function renderWant(){$("want").innerHTML=S.w.map((w,i)=>{const m=findMin(w.m);const bad=w.m&&!m;
  return `<div class="wrow"><span class="n">${i+1}</span><input type="search" data-wm="${i}" value="${esc(w.m)}" placeholder="Mineral, e.g. ${["Gold","Onyx","Diamond"][i]}" autocomplete="off" aria-label="Item ${i+1}"><input type="number" min="1" data-wn="${i}" value="${esc(w.n)}" placeholder="How many" aria-label="How many of item ${i+1}"><span class="ok" id="ok${i}"></span></div>`}).join("");S.w.forEach((_,i)=>okText(i));
  $("want").querySelectorAll("[data-wm]").forEach(inp=>{const i=+inp.dataset.wm;makeAC({inp,free:true,items:ACITEMS,icon:()=>{const m=findMin(S.w[i].m);return m&&m.ic},
    pick:x=>{S.w[i].m=x.n;save();okText(i);render()}})})}
function okText(i){const w=S.w[i];const m=findMin(w.m);const el=$("ok"+i);el.className="ok"+(w.m&&!m?" bad":"");el.innerHTML=w.m&&!m?"Not a mineral with known drop rates":m?`<span class="rr" style="--rc:${rc(m.r)}">${m.r}</span>`:"";el.hidden=!w.m}
function stopHTML(s,k,many){const capH=s.cap==null?`<span class="cap none">No cap</span>`:`<span class="cap">Luck cap ${fmt(s.cap,0)}</span>`;
  return `<div class="stop"><div class="sh"><span>${many?`<span class="num">${k+1}</span>`:""}<b><span class="lk" data-location="${esc(baseLoc(s.z))}">${esc(s.z)}</span></b>${isVoid(s.z)?' <span class="hint">(loot pool changes)</span>':""}</span>${capH}</div>
  <div class="items">${s.its.map(x=>`<div class="item"><span class="mn" data-mineral="${esc(x.g.m.n)}">${x.g.m.ic?`<img src="${x.g.m.ic}" alt="">`:""}<span><b>${fmt(x.g.n,0)}× ${esc(x.g.m.n)}</b></span></span><span class="v">${x.pans<1?"":"~"}${pansW(x.pans)}</span><span class="sub">${oneInD(x.e)} per mineral${hrs(x.pans)?" · about "+hrs(x.pans):""}</span></div>`).join("")}</div>
  <p class="alt">This stop takes ${s.pans<1?"":"about "}<b>${pansW(s.pans)}</b>${hrs(s.pans)?` (${hrs(s.pans)})`:""}, set by its slowest item.</p></div>`}
// walking between zones only counts when it's switched on (off by default)
function walkT(){return S.walk?Math.max(0,+S.trav||0):0}
function render(){$("luck").value=S.luck;$("cap").value=S.cap;$("pph").value=S.pph;$("trav").value=S.trav;$("walkOn").checked=!!S.walk;$("trav").disabled=!S.walk;
  const r=plan();
  if(!r){$("plan").innerHTML='<p class="empty">Type in at least one mineral and how many.</p>';return}
  if(r.none){$("plan").innerHTML='<p class="empty">No zone drops these. Check the names.</p>';return}
  const p=r.pick;const many=p.stops.length>1;
  let h=`<div class="tot"><div><span class="lab">Stops</span><b>${p.stops.length}</b></div><div><span class="lab">Pans in total</span><b>${p.total<1?"":"~"}${pansT(p.total)}</b></div>${S.walk?`<div><span class="lab">Plus walking</span><b>${p.stops.length>1?"~"+fmt((p.stops.length-1)*walkT(),0)+" pans":"none"}</b></div>`:""}${+S.pph>0?`<div><span class="lab">Time</span><b>${hrs(p.total)}</b></div>`:""}</div>`;
  h+=`<div class="stops" style="margin-top:10px">${p.stops.map((s,k)=>stopHTML(s,k,many)).join("")}</div>`;
  const notes=[];
  if(r.fastest!==p&&r.fastest.stops.length>p.stops.length)notes.push(`Splitting it into ${r.fastest.stops.length} stops would be about <b>${pansW(r.fastest.total)}</b> of panning, but ${S.walk?"with the walking between zones it isn't worth it":"that's within 15% of this plan"}, so the plan keeps it to ${p.stops.length} stop${p.stops.length>1?"s":""}.`);
  if(r.one&&r.one!==p)notes.push(`Doing everything in one place (<b>${esc(r.one.stops[0].z)}</b>) would take about <b>${pansW(r.one.total)}</b>, ${fmt(r.one.total/p.total,1)}× as much panning as this plan.`);
  if(!r.one&&r.want.length>1)notes.push("No single zone drops all of these, so it has to be more than one stop.");
  if(notes.length)h+=notes.map(t=>`<p class="alt" style="margin-top:10px">${t}</p>`).join("");
  $("plan").innerHTML=h}
document.addEventListener("input",e=>{const t=e.target;
  if(t.dataset.wm!=null){S.w[+t.dataset.wm].m=t.value;save();okText(+t.dataset.wm);render();return}
  if(t.dataset.wn!=null){S.w[+t.dataset.wn].n=t.value;save();render();return}
  if(["luck","cap","pph","trav"].includes(t.id)){S[t.id]=t.value;save();render()}});
$("walkOn").addEventListener("change",()=>{S.walk=$("walkOn").checked;save();render()});
$("fromCalc").onclick=async()=>{let t=null;try{t=await window.parent.ptGetTotals()}catch(e){}
  if(!t){$("plan").insertAdjacentHTML("afterbegin",'<p class="alt">Couldn\'t read the Stat Calculator. Open it once and set up your gear.</p>');return}S.luck=Math.round(t.Luck);S.cap=Math.round(t.Capacity)||S.cap;save();render()};
window.ptOpenFor=(kind,name)=>{if(kind!=="mineral")return;const i=S.w.findIndex(w=>!w.m);S.w[i<0?0:i].m=name;save();renderWant();render()};
// ---- save the plan as an image: one block per stop, the items to pan there and how long each takes ----
const RHX={Ascended:"#ffd36b",Exotic:"#f17ad6",Mythic:"#f0687f",Legendary:"#f2b53a",Epic:"#b880ee",Rare:"#68a6f0",Uncommon:"#6cc46e",Common:"#a3adb8"};
$("toImg").onclick=()=>{const r=plan();if(!r||r.none){ptToast(r?"No zone drops these, nothing to save":"Type in a mineral and how many first");return}
  const p=r.pick,pph=+S.pph>0;const walk=S.walk&&p.stops.length>1?(p.stops.length-1)*walkT():0;
  const sub=[`Luck ${fmt(Math.max(1,+S.luck||1),0)}`,`Capacity ${fmt(+S.cap||1,0)}`,`${p.stops.length} stop${p.stops.length===1?"":"s"}`,`${p.total<1?"":"~"}${pansW(p.total)} in total`];if(walk)sub.push(`plus ~${fmt(walk,0)} pans walking`);if(pph&&hrs(p.total))sub.push("about "+hrs(p.total));
  const cols=[{h:"Mineral",w:pph?.34:.4},{h:"How many",w:.12,al:"r"},{h:"Per mineral",w:.2,al:"r"},{h:"Pans",w:pph?.17:.28,al:"r"}].concat(pph?[{h:"Time",w:.17,al:"r"}]:[]);
  const rows=[];p.stops.forEach((st,k)=>{rows.push({group:`${p.stops.length>1?"Stop "+(k+1)+" · ":""}${st.z}${isVoid(st.z)?" (loot pool changes)":""} · ${st.cap==null?"No cap":"Luck cap "+fmt(st.cap,0)} · ${st.pans<1?"":"about "}${pansW(st.pans)}`});
    st.its.forEach(x=>rows.push({cells:[{t:x.g.m.n,b:true,ic:x.g.m.ic,sub:x.g.m.r,subcol:RHX[x.g.m.r]||"#98a2ad"},{t:fmt(x.g.n,0)+"×",mono:true},{t:oneInD(x.e),mono:true},{t:(x.pans<1?"":"~")+pansW(x.pans),mono:true}].concat(pph?[{t:hrs(x.pans)||"—",mono:true}]:[])}))});
  const t=r.want.map(w=>`${fmt(w.n,0)}× ${w.m.n}`).join(", ");
  ptSaveImg("Dredge Master plan",()=>ptTableImage({title:"What the Dredge Master wants",sub,sections:[{h:t,cols,rows}],note:"Estimates only: modifiers, Size Boost, enchants, events and weather aren't counted."}))};
window.ptRefresh=()=>{youPull(["luck","cap","pph"]);render()};
renderWant();render();
