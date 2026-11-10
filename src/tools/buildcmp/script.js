
const $=id=>document.getElementById(id);
const COLS=["#3cc2a8","#f2b53a","#b880ee","#68a6f0","#f0687f","#6cc46e","#e0602f","#a3adb8"];
let S={b:[{n:"Build 1",luck:"",cap:"",pph:""},{n:"Build 2",luck:"",cap:"",pph:""}],min:"",zone:"",useCap:false};
try{const s=JSON.parse(localStorage.getItem("pt-bcmp")||"null");if(s&&Array.isArray(s.b)&&s.b.length)S=Object.assign(S,s)}catch(e){}
const save=()=>{try{localStorage.setItem("pt-bcmp",JSON.stringify(S))}catch(e){}};
// same drop model as Luck Odds: location -> every mineral's listed share there
const LOC={};P.mins.forEach(m=>(m.ch||[]).forEach(c=>{const l=c[0];const p=parseFloat(String(c[1]).replace(/[%,]/g,""))/100;if(!(p>0))return;(LOC[l]=LOC[l]||[]).push({m,p})}));
function fullList(loc){const b=baseLoc(loc);const own=LOC[loc]||[];let out;
  if(b!==loc&&LOC[b])out=LOC[b].filter(x=>!own.some(y=>y.m===x.m)).concat(own);
  else if(own.length<2){const seen=new Set();out=[];Object.keys(LOC).filter(v=>v!==loc&&baseLoc(v)===loc).forEach(v=>LOC[v].concat(own).forEach(x=>{if(!seen.has(x.m)){seen.add(x.m);out.push(x)}}))}
  else out=[...own];
  return out.length<2?[]:out}
const SH={};
function effAt(loc,m,L){const k=loc+"|"+L;if(!SH[k]){const list=fullList(loc).sort((a,b)=>a.p-b.p);const tot=list.reduce((s,x)=>s+x.p,0);let c=0;const f=(lo,hi,l)=>Math.pow(1-lo,l)-Math.pow(1-hi,l);
    SH[k]=new Map(list.map(x=>{const lo=c/tot,hi=(c+x.p)/tot;c+=x.p;return [x.m,0.25*f(lo,hi,1)+0.25*f(lo,hi,Math.max(1,L/2))+0.5*f(lo,hi,Math.max(1,L))]}))}
  return SH[k].get(m)||0}
const CAPS=[1,5,10,25,50,100,250,500,1000,2500,5000,10000,25000,50000,100000];
// chance per mineral for one build in one zone, at its own luck or at its best cap
function bestEff(loc,m,L){let b={eff:effAt(loc,m,L),cap:null};if(S.useCap)CAPS.forEach(c=>{if(c<L){const e=effAt(loc,m,c);if(e>b.eff*(1+1e-6))b={eff:e,cap:c}}});return b}
const MINS=P.mins.filter(m=>Object.keys(LOC).some(l=>fullList(l).some(x=>x.m===m))).sort((a,b)=>a.n.localeCompare(b.n));
const zonesOf=m=>Object.keys(LOC).filter(l=>fullList(l).some(x=>x.m===m)&&(LOC[l].length>1||baseLoc(l)!==l)).sort((a,b)=>a.localeCompare(b));
const num0=v=>{const n=parseFloat(String(v).replace(/,/g,""));return n>0?n:0};
const oneTxt=p=>{if(!(p>0))return "—";const n=1/p;return "~1 in "+(n<10?fmt(n,1):fmt(Math.round(n),0))};
const pansTxt=x=>!isFinite(x)?"—":x<1?"under 1":fmt(x,x<10?1:0);
const hrs=(pans,pph)=>{if(!(pph>0)||!isFinite(pans))return "";const h=pans/pph;return h*60<1?"under 1 min":h<1?fmt(h*60,0)+" min":h<48?fmt(h,1)+" h":fmt(h/24,1)+" days"};
// ---- builds ----
function renderBuilds(){$("blds").innerHTML=S.b.map((b,i)=>`<div class="bld" style="--bc:${COLS[i%COLS.length]}">
  <div class="bh"><input type="text" class="inp" data-bf="n" data-i="${i}" value="${esc(b.n)}" aria-label="Build name">${S.b.length>1?`<button type="button" class="x" data-rm="${i}" aria-label="Remove ${esc(b.n)}" title="Remove this build">×</button>`:""}</div>
  <div class="row2"><label class="fld"><span class="lab">Luck</span><input type="number" min="1" data-bf="luck" data-i="${i}" value="${esc(b.luck)}"></label><label class="fld"><span class="lab">Capacity</span><input type="number" min="1" data-bf="cap" data-i="${i}" value="${esc(b.cap)}"></label></div>
  <label class="fld"><span class="lab" title="Optional. Bigger pans usually take longer, so this is what makes the time column fair">Pans per hour (optional)</span><input type="number" min="0" data-bf="pph" data-i="${i}" value="${esc(b.pph)}" placeholder="Leave empty for pans only"></label>
  <button type="button" class="btn sm" data-calc="${i}">Use my Stat Calculator stats</button></div>`).join("");
  $("addB").disabled=S.b.length>=8}
$("addB").onclick=()=>{if(S.b.length>=8)return;const last=S.b[S.b.length-1]||{luck:1000,cap:100};S.b.push({n:"Build "+(S.b.length+1),luck:last.luck,cap:last.cap,pph:""});save();renderBuilds();render()};
document.addEventListener("input",e=>{const t=e.target;if(t.dataset.bf==null)return;S.b[+t.dataset.i][t.dataset.bf]=t.value;save();render()});
document.addEventListener("click",async e=>{const r=e.target.closest("[data-rm]");if(r){S.b.splice(+r.dataset.rm,1);save();renderBuilds();render();return}
  const c=e.target.closest("[data-calc]");if(c){let t=null;try{t=await window.parent.ptGetTotals()}catch(err){}if(!t||!(t.Luck>0)){ptToast("Couldn't read the Stat Calculator. Open it once and set up your gear.");return}
    const b=S.b[+c.dataset.calc];b.luck=Math.round(t.Luck);if(t.Capacity>0)b.cap=Math.round(t.Capacity);save();renderBuilds();render()}});
// ---- mineral picker ----
const curMin=()=>MINS.find(m=>m.n.toLowerCase()===String(S.min||"").toLowerCase())||null;
makeAC({inp:$("mq"),items:MINS.map(m=>({n:m.n,tag:m.r,ic:m.ic,col:rc(m.r)})),cur:()=>{const m=curMin();return m?m.n:""},icon:()=>{const m=curMin();return m&&m.ic},pick:x=>{S.min=x.n;S.zone="";save();render()}});
$("zone").onchange=()=>{S.zone=$("zone").value;save();render()};
$("useCap").onchange=()=>{S.useCap=$("useCap").checked;save();render()};
// for "best zone", each build gets the zone where it finds the mineral most often (The Void only if nowhere else)
function rows(){const m=curMin();if(!m)return null;const zs=zonesOf(m);if(!zs.length)return {m,zs,list:[]};
  const list=S.b.map((b,i)=>{const L=Math.max(1,num0(b.luck)||1),C=Math.max(1,num0(b.cap)||1),pph=num0(b.pph);
    const cand=(S.zone&&zs.includes(S.zone))?[S.zone]:(zs.filter(z=>!/Void/.test(z)).length?zs.filter(z=>!/Void/.test(z)):zs);
    let best=null;cand.forEach(z=>{const r=bestEff(z,m,L);if(!best||r.eff>best.eff)best={...r,z}});
    const pp=1-Math.pow(1-best.eff,Math.sqrt(C));const pans=pp>0?1/pp:Infinity;return {i,b,L,C,pph,z:best.z,cap:best.cap,eff:best.eff,pp,pans,hours:pph>0?pans/pph:null}});
  return {m,zs,list}}
function render(){$("useCap").checked=!!S.useCap;const R=rows();const m=R&&R.m;
  $("zone").innerHTML=`<option value="">Best zone for each build</option>`+(R?R.zs.map(z=>`<option value="${esc(z)}"${z===S.zone?" selected":""}>${esc(z)}</option>`).join(""):"");
  if(!m){$("sum").innerHTML="";$("tbl").innerHTML='<p class="hint">Pick a mineral to compare your builds.</p>';return}
  if(!R.list.length){$("sum").innerHTML="";$("tbl").innerHTML='<p class="hint">There are no drop rates for this mineral, so it can\'t be compared.</p>';return}
  const L=R.list,anyT=L.some(x=>x.hours!=null),allT=L.every(x=>x.hours!=null);
  // the zone column only shows when the builds end up panning in different places
  const oneZ=L.every(x=>x.z===L[0].z);
  const key=allT?"hours":"pans";const best=L.reduce((a,x)=>x[key]<a[key]?x:a,L[0]);
  const rel=x=>{if(x===best)return '<span class="tag">Best</span>';const r=x[key]/best[key];return isFinite(r)?`<span class="sl">${fmt(r,r<10?2:1)}× ${allT?"longer":"more pans"}</span>`:"—"};
  $("sum").innerHTML=`<div><span class="lab">Fastest ${allT?"by time":"by pans"}</span><b style="color:${COLS[best.i%COLS.length]}">${esc(best.b.n)}</b><span class="hint">${allT?"about "+hrs(best.pans,best.pph):pansTxt(best.pans)+" pans on average"}</span></div>
    <div><span class="lab">Mineral</span><b><span class="mn" data-mineral="${esc(m.n)}">${m.ic?`<img src="${m.ic}" alt="">`:""}<span>${esc(m.n)} <span class="rr" style="--rc:${rc(m.r)}">${m.r}</span></span></span></b>${oneZ?`<span class="hint">in <span class="lk" data-location="${esc(baseLoc(L[0].z))}">${esc(L[0].z)}</span></span>`:""}</div>
    ${!allT?`<div><span class="lab">Time</span><b style="font-size:.95rem;font-weight:500">${anyT?"Add pans per hour to every build to compare time":"Add pans per hour to compare time"}</b></div>`:""}`;
  $("tbl").innerHTML=`<table class="o"><thead><tr><th>Build</th>${oneZ?"":"<th>Zone</th>"}<th>Per pan</th><th>Pans on average</th>${anyT?"<th>Time</th>":""}<th>Compared</th></tr></thead><tbody>${L.map(x=>`<tr class="${x===best?"win":""}" style="--bc:${COLS[x.i%COLS.length]}">
    <td><span class="bn"><i></i><span>${esc(x.b.n)}<small>${fmt(x.L,0)} luck · ${fmt(x.C,0)} capacity${x.cap!=null?` · cap ${fmt(x.cap,0)}`:""}</small></span></span></td>
    ${oneZ?"":`<td data-l="Zone" style="font-family:var(--f-body);white-space:normal"><span class="lk" data-location="${esc(baseLoc(x.z))}">${esc(x.z)}</span></td>`}
    <td data-l="Per pan">${oneTxt(x.pp)}</td><td data-l="Pans">${pansTxt(x.pans)}</td>${anyT?`<td data-l="Time">${x.hours!=null?hrs(x.pans,x.pph):"—"}</td>`:""}<td data-l="Compared" style="font-family:var(--f-body)">${rel(x)}</td></tr>`).join("")}</tbody></table>
    <p class="hint" style="margin-top:8px">Rare minerals scale with about luck × √capacity, so 1.8× the capacity is worth about 1.34× the luck per pan.</p>`}
// ---- save as image ----
$("toImg").onclick=()=>{const R=rows();if(!R||!R.list.length){ptToast("Pick a mineral first");return}const L=R.list,anyT=L.some(x=>x.hours!=null),allT=L.every(x=>x.hours!=null);const key=allT?"hours":"pans";const best=L.reduce((a,x)=>x[key]<a[key]?x:a,L[0]);
  const HX={Ascended:"#ffd36b",Exotic:"#f17ad6",Mythic:"#f0687f",Legendary:"#f2b53a",Epic:"#b880ee",Rare:"#68a6f0",Uncommon:"#6cc46e",Common:"#a3adb8"};
  const oneZ=L.every(x=>x.z===L[0].z);
  const cols=[{h:"Build",w:(anyT?.28:.32)+(oneZ?.22:0)}].concat(oneZ?[]:[{h:"Zone",w:.22}]).concat([{h:"Per pan",w:.16,al:"r"},{h:"Pans on average",w:.14,al:"r"}]).concat(anyT?[{h:"Time",w:.1,al:"r"}]:[]).concat([{h:"Compared",w:anyT?.1:.16,al:"r"}]);
  const rows2=L.map(x=>{const r=x[key]/best[key];return {cells:[{t:x.b.n,b:true,dot:COLS[x.i%COLS.length],sub:`${fmt(x.L,0)} luck · ${fmt(x.C,0)} capacity${x.cap!=null?" · cap "+fmt(x.cap,0):""}`},...(oneZ?[]:[{t:x.z,wrap:true,fs:13}]),{t:oneTxt(x.pp),mono:true},{t:pansTxt(x.pans),mono:true}].concat(anyT?[{t:x.hours!=null?hrs(x.pans,x.pph):"—",mono:true}]:[]).concat([x===best?{t:"Best",b:true,col:"#3cc2a8"}:{t:isFinite(r)?fmt(r,r<10?2:1)+"×":"—",mono:true,col:"#98a2ad"}])}});
  ptSaveImg(R.m.n+" build comparison",()=>ptTableImage({title:R.m.n,tic:R.m.ic,tcol:HX[R.m.r],sub:[R.m.r,oneZ?L[0].z:"best zone for each build",S.useCap?"best luck cap":"own luck",`${L.length} builds`],sections:[{cols,rows:rows2}],note:"Estimates only: modifiers, Size Boost, enchants, events and weather aren't counted."}))};
window.ptOpenFor=(kind,name)=>{if(kind==="mineral"){S.min=name;S.zone="";save();render()}};
window.ptRefresh=()=>render();
renderBuilds();render();
