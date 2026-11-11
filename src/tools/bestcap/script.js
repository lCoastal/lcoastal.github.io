let VIEW_BEST=false;
// best shovel enchant by rarity (a simple rule of thumb, shared on/off with the other tools)
const ENCH_BY={Common:"Excavating",Uncommon:"Excavating",Rare:"Excavating",Epic:"Tempered",Legendary:"Tempered",Mythic:"Mythical",Exotic:"Mythical"};
let ENCH_ON=true;try{ENCH_ON=localStorage.getItem("pt-ench")!=="0"}catch(e){}
const enchTag=r=>ENCH_ON&&ENCH_BY[r]?` <span class="ench" title="Best shovel enchant for ${r} minerals">${ENCH_BY[r]}</span>`:"";

const $=id=>document.getElementById(id);
const ORD=["Ascended","Exotic","Mythic","Legendary","Epic","Rare","Uncommon","Common"];
let S={q:"",sort:"rar",hideR:[],luck:null};
try{Object.assign(S,JSON.parse(localStorage.getItem("pt-bestcap")||"{}"))}catch(e){}
if(!Array.isArray(S.hideR))S.hideR=[];
if(!(+S.luck>0)){try{S.luck=+JSON.parse(localStorage.getItem("po-s")||"{}").luck||1000}catch(e){S.luck=1000}}
// your luck / capacity / pans per hour are shared with every tool that asks for them
const youGet=()=>{try{return window.parent.ptYou.get()}catch(e){return {}}};const youSet=p=>{try{window.parent.ptYou.set(p)}catch(e){}};
const youPull=keys=>{const y=youGet();keys.forEach(k=>{if(y[k]!==undefined&&y[k]!==null&&y[k]!=="")S[k]=y[k]});};
youPull(["luck"]);
const save=()=>{try{localStorage.setItem("pt-bestcap",JSON.stringify({sort:S.sort,hideR:S.hideR,luck:S.luck,bestOnly:!!S.bestOnly}))}catch(e){}youSet({luck:S.luck})};
// the cap settings you can pick in game; no cap means you pan at your own luck
const CAPS=[1,5,10,25,50,100,250,500,1000,2500,5000,10000,25000,50000,100000];
// same drop model as Luck Odds: location -> every mineral's listed share there
const LOC={};P.mins.forEach(m=>(m.ch||[]).forEach(c=>{const l=c[0];const p=parseFloat(String(c[1]).replace(/[%,]/g,""))/100;if(!(p>0))return;(LOC[l]=LOC[l]||[]).push({m,p})}));
function fullList(loc){const b=baseLoc(loc);const own=LOC[loc]||[];let out;
  if(b!==loc&&LOC[b])out=LOC[b].filter(x=>!own.some(y=>y.m===x.m)).concat(own);
  // a place like "The Void" that only lists one mineral itself: its real pool is the one listed under its variants
  else if(own.length<2){const seen=new Set();out=[];Object.keys(LOC).filter(v=>v!==loc&&baseLoc(v)===loc).forEach(v=>LOC[v].concat(own).forEach(x=>{if(!seen.has(x.m)){seen.add(x.m);out.push(x)}}))}
  else out=[...own];
  // with only one mineral known there's no drop table to work from, so leave the spot out instead of calling it 100%
  return out.length<2?[]:out}
function shares(loc,L){const list=fullList(loc).sort((a,b)=>a.p-b.p);const tot=list.reduce((s,x)=>s+x.p,0);let c=0;
  const f=(lo,hi,l)=>Math.pow(1-lo,l)-Math.pow(1-hi,l);
  return list.map(x=>{const lo=c/tot,hi=(c+x.p)/tot;c+=x.p;return {m:x.m,eff:0.25*f(lo,hi,1)+0.25*f(lo,hi,Math.max(1,L/2))+0.5*f(lo,hi,Math.max(1,L))}})}
// work out every zone once: each mineral's chance when panning at every cap value
const ROWS=[];
// skip a place that only lists one mineral itself (e.g. The Void): its variant row already covers it
Object.keys(LOC).filter(loc=>LOC[loc].length>1||baseLoc(loc)!==loc).forEach(loc=>{const at=CAPS.map(L=>new Map(shares(loc,L).map(x=>[x.m,x.eff])));
  // a Firefly Zone variant only gets rows for the minerals it lists itself (Firefly Stone); everything else is the same as the zone's own row
  const b=baseLoc(loc);const own=b!==loc&&LOC[b]?new Set(LOC[loc].map(x=>x.m)):null;
  fullList(loc).forEach(({m})=>{if(own&&!own.has(m))return;ROWS.push({m,loc,effs:at.map(mp=>mp.get(m)||0)})})});
const oneInT=p=>{if(!(p>0))return "—";const n=1/p;return "~1 in "+(n<10?fmt(n,1):fmt(Math.round(n),0))};
// chance of each mineral at the luck you typed in, worked out once per zone and kept until the luck changes
let YL={},YLkey=null;
function atYours(r){const L=Math.max(1,+S.luck||1);if(YLkey!==L){YL={};YLkey=L}if(!YL[r.loc])YL[r.loc]=new Map(shares(r.loc,L).map(x=>[x.m,x.eff]));return YL[r.loc].get(r.m)||0}
// best setting at your luck: no cap (your luck) vs every cap below it; on a near tie keep the higher cap / no cap
function bestFor(r){const L=Math.max(1,+S.luck||1);let b={cap:null,eff:atYours(r)};
  for(let i=CAPS.length-1;i>=0;i--){if(CAPS[i]>=L)continue;if(r.effs[i]>b.eff*(1+1e-6))b={cap:CAPS[i],eff:r.effs[i]}}
  b.yours=atYours(r);return b}
// the exact luck where this mineral peaks in this zone (any number, not just the cap steps)
const PEAK=new Map();
function peakLuck(r){const k=r.loc+"|"+r.m.n;if(PEAK.has(k))return PEAK.get(k);const hi=1e7;
  const ev=L=>{const x=shares(r.loc,L).find(y=>y.m===r.m);return x?x.eff:0};
  const N=280;let bi=0,bv=-1;const pts=[];
  for(let i=0;i<=N;i++){const L=Math.pow(hi,i/N);pts.push(L);const v=ev(L);if(v>bv*(1+1e-9)){bv=v;bi=i}}
  let L=pts[bi];
  if(bi>0&&bi<N){let a=pts[bi-1],b=pts[bi+1];for(let k=0;k<40;k++){const m1=a+(b-a)/3,m2=b-(b-a)/3;if(ev(m1)<ev(m2))a=m1;else b=m2}L=(a+b)/2;bv=ev(L)}
  const res={top:bi===N,L:L<10?Math.round(L*10)/10:L<1000?Math.round(L):Math.round(L/10)*10,eff:bv};PEAK.set(k,res);return res}
const peakCell=r=>{const p=peakLuck(r);return p.top?`<span class="hi">Higher is better</span>`:`<b>${fmt(p.L,p.L<10?1:0)}</b><small>${oneInT(p.eff)}</small>`};
const times=x=>(x<10?fmt(x,2):fmt(x,0))+"×";
// why no cap wins: some minerals only get more common with more luck, so a cap never helps them
const noCapTxt=(r,L)=>{const p=r&&peakLuck(r);if(p&&p.top)return "Never cap your luck";if(p&&p.L>L*1.02)return "Your luck is too low, don't cap";return "Your luck is best, don't cap"};
const gain=(b,r)=>{if(b.cap==null){const L=Math.max(1,+S.luck||1),p=r&&peakLuck(r);
    // no cap wins, but if your luck is below where this mineral peaks you'd actually want more luck, not a cap
    return `<span class="same">${noCapTxt(r,L)}</span>`}
  if(!(b.yours>0))return `<span class="gain">Only drops with a cap</span>`;const x=b.eff/b.yours;
  return x>=1.005?`<span class="gain">${times(x)} more often</span>`:`<span class="same">About the same</span>`};
let LIMIT=60,VIEW={mins:[],by:new Map()};
function render(){
  document.querySelectorAll("[data-sort]").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.sort===S.sort)));
  const here=ORD.filter(r=>ROWS.some(x=>x.m.r===r));
    {const allOn=!here.some(r=>S.hideR.includes(r));$("rarF").innerHTML=`<span class="lab">Rarity</span><button type="button" class="chip" data-rall aria-pressed="${allOn}">All</button>`+here.map(r=>`<button type="button" class="chip r" data-r="${r}" style="--rc:${rc(r)}" aria-pressed="${!allOn&&!S.hideR.includes(r)}">${r}</button>`).join("")}
  const q=S.q.trim().toLowerCase();
  // group by mineral, zones inside each mineral sorted by best chance at your luck
  // a search matching any mineral name looks for minerals only; otherwise it's a zone search, which shows every drop there
  const minQ=!!q&&ROWS.some(x=>x.m.n.toLowerCase().includes(q)),zoneQ=!!q&&!minQ,best=S.bestOnly&&!zoneQ;
  const by=new Map();ROWS.filter(x=>!S.hideR.includes(x.m.r)).forEach(x=>{if(!by.has(x.m))by.set(x.m,[]);by.get(x.m).push(x)});
  by.forEach((list,m)=>{let zs=list.map(r=>({r,b:bestFor(r)})).sort((x,y)=>y.b.eff-x.b.eff);
    // best zone only: skip The Void unless the mineral only drops there
    // Abyssal Depth is left out unless the mineral drops nowhere else
    if(minQ&&!m.n.toLowerCase().includes(q))zs=[];
    if(zoneQ)zs=zs.filter(z=>z.r.loc.toLowerCase().includes(q));
    else{const na=zs.filter(z=>!/Abyssal Depth/i.test(z.r.loc));if(na.length)zs=na}
    if(best){const nv=zs.filter(z=>!/Void/.test(z.r.loc));zs=(nv.length?nv:zs).slice(0,1)}
    if(zs.length)by.set(m,zs);else by.delete(m)});
  let mins=[...by.keys()];
  mins.sort(S.sort==="az"?(a,b)=>a.n.localeCompare(b.n):(a,b)=>ORD.indexOf(a.r)-ORD.indexOf(b.r)||a.n.localeCompare(b.n));
  const rows=[...by.values()].flat();const zones=new Set(rows.map(z=>z.r.loc));
  VIEW_BEST=best;$("count").textContent=rows.length?(best?`Showing ${fmt(mins.length,0)} mineral${mins.length===1?"":"s"}, each in its best zone`:`Showing ${fmt(mins.length,0)} mineral${mins.length===1?"":"s"} across ${fmt(zones.size,0)} zones`):"";
  VIEW={mins,by};
  const shown=mins.slice(0,LIMIT);
  $("rows").innerHTML=rows.length?shown.map(m=>{const zs=by.get(m);
    return zs.map(({r,b},i)=>`<tr class="${i?"":"first"}"><td class="mcell">${i?"":`<span class="mn" data-mineral="${esc(m.n)}">${m.ic?`<img src="${m.ic}" alt="" loading="lazy">`:""}<span><b>${esc(m.n)}</b><br><span class="rr" style="--rc:${rc(m.r)}">${m.r}</span>${enchTag(m.r)}</span></span>`}</td><td class="zcell" data-l="Zone"><span class="lk" data-location="${esc(baseLoc(r.loc))}">${esc(r.loc)}</span></td><td data-l="Best luck cap">${b.cap==null?`<span class="cap none">No cap</span>`:`<span class="cap">${fmt(b.cap,0)}</span>`}</td><td class="bl" data-l="Best luck">${peakCell(r)}</td><td class="num" data-l="Chance per mineral">${oneInT(b.eff)}</td><td data-l="Compared to your luck">${gain(b,r)}</td></tr>`).join("")}).join("")
    :`<tr><td colspan="6" class="hint">Nothing matches. Try another search or turn a rarity back on.</td></tr>`;
  $("more").innerHTML=mins.length>LIMIT?`<button type="button" class="btn" id="moreBtn">Show ${fmt(Math.min(60,mins.length-LIMIT),0)} more minerals</button>`:"";
}
$("q").value=S.q;$("luck").value=S.luck;$("bestOnly").checked=!!S.bestOnly;
$("bestOnly").addEventListener("change",()=>{S.bestOnly=$("bestOnly").checked;save();render()});
$("enchOn").checked=ENCH_ON;$("enchOn").addEventListener("change",()=>{ENCH_ON=$("enchOn").checked;try{localStorage.setItem("pt-ench",ENCH_ON?"1":"0")}catch(e){}render()});

$("luck").addEventListener("input",()=>{const v=+$("luck").value;if(v>0){S.luck=v;save();render()}});
$("fromCalc").onclick=async()=>{let t=null;try{t=await window.parent.ptGetTotals()}catch(e){}
  if(!t||!(t.Luck>0)){$("count").textContent="Couldn't read the Stat Calculator. Open it once and set up your gear.";return}S.luck=Math.round(t.Luck);$("luck").value=S.luck;save();render()};
$("q").addEventListener("input",()=>{S.q=$("q").value;LIMIT=60;render()});
// suggestions while you type: pick a mineral or zone, or just keep typing to filter
const ZNS=[...new Set(ROWS.map(r=>r.loc))].sort((a,b)=>a.localeCompare(b));const MNS=[...new Set(ROWS.map(r=>r.m))];
const ACB=makeAC({inp:$("q"),free:true,items:MNS.map(m=>({n:m.n,tag:"Mineral",ic:m.ic,col:rc(m.r)})).concat(ZNS.map(n=>({n,tag:"Zone"}))),
  icon:()=>{const m=MNS.find(m=>m.n.toLowerCase()===S.q.trim().toLowerCase());return m&&m.ic},
  pick:x=>{S.q=x.n;LIMIT=60;render()}});
document.addEventListener("click",e=>{
  const rb=e.target.closest("[data-r]");if(rb){const r=rb.dataset.r,here=[...document.querySelectorAll("#rarF [data-r]")].map(b=>b.dataset.r);let shown=here.filter(x=>!S.hideR.includes(x));shown=shown.length===here.length?[r]:(shown.includes(r)?shown.filter(x=>x!==r):[...shown,r]);S.hideR=(!shown.length||shown.length===here.length)?[]:ORD.filter(x=>!shown.includes(x));save();render();return}
  if(e.target.closest("[data-rall]")){S.hideR=[];save();render();return}
  if(e.target.closest("[data-rnone]")){S.hideR=ORD.slice();save();render();return}
  const sb=e.target.closest("[data-sort]");if(sb){S.sort=sb.dataset.sort;save();render();return}
  if(e.target.closest("#moreBtn")){LIMIT+=60;render()}});
// ---- save what's listed (all of it, not just the first page) as an image ----
function toast(t){const d=document.createElement("div");d.className="toast";d.setAttribute("role","status");d.textContent=t;document.body.appendChild(d);setTimeout(()=>d.remove(),2200)}
const HEX={Ascended:"#ffd36b",Exotic:"#f17ad6",Mythic:"#f0687f",Legendary:"#f2b53a",Epic:"#b880ee",Rare:"#68a6f0",Uncommon:"#6cc46e",Common:"#a3adb8"};
const MAXROWS=25;
// a proper, capitalised name for the image: the mineral or zone you searched for, as the game writes it
function imgName(){const q=S.q.trim();if(!q)return S.bestOnly?"Best zone for each mineral":"Luck caps by zone";const ql=q.toLowerCase();
  const exact=VIEW.mins.find(m=>m.n.toLowerCase()===ql);if(exact)return exact.n;if(VIEW.mins.length===1)return VIEW.mins[0].n;
  const zs=[...new Set([...VIEW.by.values()].flat().map(z=>z.r.loc))].filter(l=>l.toLowerCase().includes(ql));
  const bz=[...new Set(zs.map(baseLoc))];if(bz.length===1)return bz[0];
  return q.replace(/\b\w/g,ch=>ch.toUpperCase())}
async function capImage(){const F='"IBM Plex Sans","Segoe UI",system-ui,sans-serif',FD='"Chakra Petch","Segoe UI",system-ui,sans-serif',FM='"IBM Plex Mono",Consolas,monospace';try{await document.fonts.ready}catch(e){}
  const L=Math.max(1,+S.luck||1);const list=[];let total=0;
  VIEW.mins.forEach(m=>VIEW.by.get(m).forEach((z,i)=>{total++;if(list.length<MAXROWS)list.push({m,first:i===0,...z})}));
  if(!list.length)return null;
  const W=1360,PAD=40,RH=50,HEAD=PAD+92;const extra=total>list.length?34:0;
  const H=HEAD+34+list.length*RH+extra+50;const sc=H*2<30000?2:1;
  const cv=document.createElement("canvas");cv.width=W*sc;cv.height=H*sc;const c=cv.getContext("2d");c.scale(sc,sc);
  const rr=(x,y,w,h,r)=>{c.beginPath();c.moveTo(x+r,y);c.arcTo(x+w,y,x+w,y+h,r);c.arcTo(x+w,y+h,x,y+h,r);c.arcTo(x,y+h,x,y,r);c.arcTo(x,y,x+w,y,r);c.closePath()};
  const fit=(t,w)=>{if(c.measureText(t).width<=w)return t;while(t.length>1&&c.measureText(t+"…").width>w)t=t.slice(0,-1);return t+"…"};
  const img=src=>new Promise(res=>{if(!src)return res(null);const i=new Image();i.onload=()=>res(i);i.onerror=()=>res(null);i.src=src});
  c.fillStyle="#14181c";c.fillRect(0,0,W,H);
  c.font=`600 13px ${F}`;const mb="Made by @__coastal";const mw=c.measureText(mb).width+28,mx=W-PAD-mw,my=PAD-6;c.fillStyle="rgba(20,184,166,.14)";rr(mx,my,mw,26,13);c.fill();c.strokeStyle="rgba(20,184,166,.6)";c.lineWidth=1;rr(mx,my,mw,26,13);c.stroke();c.fillStyle="#14b8a6";c.beginPath();c.arc(mx+12,my+13,3,0,Math.PI*2);c.fill();c.fillStyle="#2dd4bf";c.fillText(mb,mx+20,my+17.5);
  const title=imgName();
  c.fillStyle="#e6e9ec";c.font=`700 34px ${FD}`;c.fillText(fit(title,W-PAD*2-mw-20),PAD,PAD+30);
  const shownR=ORD.filter(r=>!S.hideR.includes(r)&&ROWS.some(x=>x.m.r===r));
  const sub=[`Your luck ${fmt(L,0)}`,`${fmt(VIEW.mins.length,0)} mineral${VIEW.mins.length===1?"":"s"}`];if(VIEW_BEST&&S.q.trim())sub.push("best zone only");if(S.hideR.length)sub.push(shownR.join(", ")||"no rarities");
  c.fillStyle="#98a2ad";c.font=`15px ${F}`;c.fillText(fit(sub.join(" · "),W-PAD*2),PAD,PAD+58);
  const cols=[["Mineral",0],["Zone",250],["Best luck cap",520],["Best luck",670],["Chance per mineral",850],["Compared to your luck",1030]];const X=v=>PAD+12+v;
  let y=HEAD;c.font=`600 11px ${F}`;c.fillStyle="#98a2ad";cols.forEach(([t,x])=>c.fillText(t.toUpperCase(),X(x),y+20));
  y+=30;c.strokeStyle="#2c333a";c.lineWidth=1;c.beginPath();c.moveTo(PAD,y);c.lineTo(W-PAD,y);c.stroke();
  const icons=await Promise.all(list.map(x=>x.first?img(x.m.ic):null));
  list.forEach((x,k)=>{const top=y+k*RH,mid=top+RH/2;const {m,r,b}=x;
    if(x.first&&k){c.strokeStyle="#2c333a";c.beginPath();c.moveTo(PAD,top);c.lineTo(W-PAD,top);c.stroke()}
    else if(k){c.strokeStyle="#20262c";c.setLineDash([3,4]);c.beginPath();c.moveTo(PAD+250,top);c.lineTo(W-PAD,top);c.stroke();c.setLineDash([])}
    if(x.first){let tx=X(0);if(icons[k]){c.drawImage(icons[k],tx,mid-14,28,28);tx+=36}
      c.fillStyle="#e6e9ec";c.font=`600 15px ${F}`;c.fillText(fit(m.n,250-(tx-X(0))-10),tx,mid-2);c.fillStyle=HEX[m.r]||"#98a2ad";c.font=`600 10.5px ${F}`;c.fillText(m.r.toUpperCase(),tx,mid+14)}
    c.fillStyle="#cfd6dd";c.font=`14px ${F}`;c.fillText(fit(r.loc,260),X(250),mid+5);
    // cap pill
    const ct=b.cap==null?"No cap":fmt(b.cap,0);c.font=b.cap==null?`600 13px ${F}`:`600 13px ${FM}`;const pw=c.measureText(ct).width+22;
    c.fillStyle=b.cap==null?"#1c2126":"rgba(20,184,166,.16)";rr(X(520),mid-13,pw,26,13);c.fill();c.strokeStyle=b.cap==null?"#2c333a":"rgba(20,184,166,.55)";rr(X(520),mid-13,pw,26,13);c.stroke();c.fillStyle="#e6e9ec";c.fillText(ct,X(520)+11,mid+5);
    const p=peakLuck(r);if(p.top){c.fillStyle="#98a2ad";c.font=`13px ${F}`;c.fillText("Higher is better",X(670),mid+5)}else{c.fillStyle="#e6e9ec";c.font=`14px ${FM}`;c.fillText(fmt(p.L,p.L<10?1:0),X(670),mid-2);c.fillStyle="#98a2ad";c.font=`11.5px ${FM}`;c.fillText(oneInT(p.eff),X(670),mid+14)}
    c.fillStyle="#e6e9ec";c.font=`14px ${FM}`;c.fillText(oneInT(b.eff),X(850),mid+5);
    let gt,gc="#98a2ad";if(b.cap==null){const p=peakLuck(r);gt=noCapTxt(r,L)}else if(!(b.yours>0)){gt="Only drops with a cap";gc="#3cc2a8"}else{const v=b.eff/b.yours;if(v>=1.005){gt=times(v)+" more often";gc="#3cc2a8"}else gt="About the same"}
    c.fillStyle=gc;c.font=`14px ${F}`;c.fillText(fit(gt,W-PAD-X(1030)),X(1030),mid+5)});
  y+=list.length*RH;
  if(extra){c.fillStyle="#98a2ad";c.font=`italic 13px ${F}`;c.fillText(`…and ${fmt(total-list.length,0)} more. Search or filter to fit them in one image.`,PAD+12,y+22);y+=extra}
  {const et="Estimates only: built on a simplified luck model, so real drops can differ.";c.font=`600 13px ${F}`;const ew=c.measureText(et).width+30,ex=PAD,ey=y+10;c.fillStyle="rgba(239,122,102,.14)";rr(ex,ey,ew,28,14);c.fill();c.strokeStyle="rgba(239,122,102,.65)";c.lineWidth=1;rr(ex,ey,ew,28,14);c.stroke();c.fillStyle="#ef7a66";c.beginPath();c.arc(ex+13,ey+14,3,0,Math.PI*2);c.fill();c.fillText(et,ex+22,ey+18.5)}
  return await new Promise(res=>cv.toBlob(res,"image/png"))}
window.ptCapImage=capImage;
$("toImg").onclick=async()=>{let blob=null;try{blob=await capImage()}catch(e){console.error(e)}if(!blob){toast(VIEW.mins.length?"Couldn't draw the image":"Nothing to save. Change the search or filters.");return}
  const nm=(S.q.trim()?imgName()+" luck caps":"Luck caps").replace(/[\\/:*?"<>|]+/g," ").trim();
  try{await window.parent.ptSave(nm+".png",blob);toast((()=>{try{return window.parent.ptImgMsg()}catch(e){return "Image saved"}})())}catch(e){const c=e&&e.code;if(c!=="declined")toast(c==="rate_limited"?"A save prompt is already open":"Couldn't save the image here")}};
window.ptOpenFor=(kind,name)=>{S.q=name;$("q").value=name;LIMIT=60;render()};
window.ptRefresh=()=>{const o=S.luck;youPull(["luck"]);if(+S.luck!==+o){$("luck").value=S.luck;render()}};
render();
