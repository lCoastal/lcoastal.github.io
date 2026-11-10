
const $=id=>document.getElementById(id);
let S={luck:"",cap:"",pph:"",by:"loc",loc:"Fungal Marsh",min:"Astral Spore",hideR:[]};
try{Object.assign(S,JSON.parse(localStorage.getItem("po-s")||"{}"))}catch(e){}
if(!Array.isArray(S.hideR))S.hideR=[];
const ORD=["Ascended","Exotic","Mythic","Legendary","Epic","Rare","Uncommon","Common"];
// your luck / capacity / pans per hour are shared with every tool that asks for them
const youGet=()=>{try{return window.parent.ptYou.get()}catch(e){return {}}};const youSet=p=>{try{window.parent.ptYou.set(p)}catch(e){}};
const youPull=keys=>{const y=youGet();keys.forEach(k=>{if(y[k]!==undefined&&y[k]!==null&&y[k]!=="")S[k]=y[k]});};
youPull(["luck","cap","pph"]);
const save=()=>{try{localStorage.setItem("po-s",JSON.stringify(S))}catch(e){}youSet({luck:S.luck,cap:S.cap,pph:S.pph})};
// location -> [{m, p(base share), raw}] using every mineral's listed drop share there
const LOC={};P.mins.forEach(m=>(m.ch||[]).forEach(c=>{const l=c[0];const p=parseFloat(String(c[1]).replace(/[%,]/g,""))/100;if(!(p>0))return;(LOC[l]=LOC[l]||[]).push({m,p,raw:c})}));
const LOCS=Object.keys(LOC).filter(l=>fullList(l).length).sort((a,b)=>a.localeCompare(b));
const MINS=P.mins.filter(m=>(m.ch||[]).length).map(m=>m.n).sort((a,b)=>a.localeCompare(b));
// rarest first, so each ore's roll window sits after all rarer ones
// a spot like "X (inside Firefly Zones)" only lists the minerals that change there; fill in the rest from X itself
function fullList(loc){const b=baseLoc(loc);const own=LOC[loc]||[];let out;
  if(b!==loc&&LOC[b])out=LOC[b].filter(x=>!own.some(y=>y.m===x.m)).concat(own);
  // a place like "The Void" that only lists one mineral itself: its real pool is the one listed under its variants
  else if(own.length<2){const seen=new Set();out=[];Object.keys(LOC).filter(v=>v!==loc&&baseLoc(v)===loc).forEach(v=>LOC[v].concat(own).forEach(x=>{if(!seen.has(x.m)){seen.add(x.m);out.push(x)}}))}
  else out=[...own];
  // with only one mineral known there's no drop table to work from, so leave the spot out instead of calling it 100%
  return out.length<2?[]:out}
function shares(loc,L){const list=fullList(loc).sort((a,b)=>a.p-b.p);const tot=list.reduce((s,x)=>s+x.p,0);let c=0;
  const f=(lo,hi,l)=>Math.pow(1-lo,l)-Math.pow(1-hi,l);
  return list.map(x=>{const lo=c/tot,hi=(c+x.p)/tot;c+=x.p;const q=0.25*f(lo,hi,1)+0.25*f(lo,hi,Math.max(1,L/2))+0.5*f(lo,hi,Math.max(1,L));return {...x,base:x.p/tot,eff:q}})}
const perPan=()=>Math.max(1,Math.sqrt(Math.max(1,+S.cap||1)));
// chances written as "1 in N", as a percentage, or both (picked with the 1 in / % / Both buttons)
const pctTxt=p=>{const v=p*100;return (v>=10?fmt(v,1):v>=1?fmt(v,2):v>=0.01?fmt(v,3):Number(v.toPrecision(2)).toLocaleString("en-US",{maximumFractionDigits:20}))+"%"};
const oneTxt=p=>{const n=1/p;return `~1 in ${n<10?fmt(n,1):fmt(Math.round(n),0)}`};
const oneInTxt=p=>{if(!(p>0))return "—";const m=S.fmt||"one";if(m==="pct")return pctTxt(p);if(m==="both")return `${oneTxt(p)}<span class="pc2">${pctTxt(p)}</span>`;return oneTxt(p)};
const hrs=pans=>{const pph=+S.pph;if(!(pph>0))return "—";const h=pans/pph;return h*60<1?"under 1 min":h<1?fmt(h*60,0)+" min":h<48?fmt(h,1)+" h":fmt(h/24,1)+" days"};
function row(name,img,r,s){const pp=1-Math.pow(1-s.eff,perPan());const pans=pp>0?1/pp:Infinity;
  return `<tr><td>${name}</td><td data-l="Base">${oneInTxt(s.base)}</td><td data-l="Per ore" class="${s.eff>s.base?"up":""}">${oneInTxt(s.eff)}</td><td data-l="Per pan">${oneInTxt(pp)}</td>${+S.pph>0?`<td data-l="Time">${isFinite(pans)?hrs(pans):"—"}</td>`:""}</tr>`}
function render(){
  $("luck").value=S.luck;$("cap").value=S.cap;$("pph").value=S.pph;
  document.querySelectorAll("[data-fmt]").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.fmt===(S.fmt||"one"))));document.body.classList.toggle("fmt-both",S.fmt==="both");
  if(S.by!=="min")S.by="loc";if(!LOCS.includes(S.loc))S.loc=LOCS[0];if(!MINS.includes(S.min))S.min=MINS[0];
  try{AC.sync()}catch(e){}
  $("perPan").textContent=`About ${fmt(perPan(),1)} minerals per pan at ${fmt(+S.cap,0)} capacity.`;
  const L=Math.max(1,+S.luck||1);const head=`<thead><tr><th>${S.by==="loc"?"Mineral":"Location"}</th><th>Base chance</th><th>Per mineral</th><th>Per pan</th>${+S.pph>0?"<th>Time</th>":""}</tr></thead>`;
  $("rarF").hidden=S.by!=="loc";
  if(S.by==="loc"){const all=shares(S.loc,L);const here=ORD.filter(r=>all.some(x=>x.m.r===r));
    {const allOn=!here.some(r=>S.hideR.includes(r));$("rarF").innerHTML=`<span class="lab">Rarity</span><button type="button" class="chip" data-rall aria-pressed="${allOn}">All</button>`+here.map(r=>`<button type="button" class="chip r" data-r="${r}" style="--rc:${rc(r)}" aria-pressed="${!allOn&&!S.hideR.includes(r)}">${r}</button>`).join("")}
    const rows=all.filter(s=>!S.hideR.includes(s.m.r));
    rows.sort((a,b)=>ORD.indexOf(a.m.r)-ORD.indexOf(b.m.r)||a.p-b.p);
    const byR=r=>rows.filter(x=>x.m.r===r).reduce((s,x)=>s+x.eff,0);
    $("sum").innerHTML=["Exotic","Mythic","Legendary"].filter(r=>!S.hideR.includes(r)).map(r=>`<div><span class="lab" style="color:${rc(r)}">Any ${r}</span><b>${oneInTxt(1-Math.pow(1-byR(r),perPan()))}</b><span class="hint">per pan</span></div>`).join("");
    $("tbl").innerHTML=`<table class="o">${head}<tbody>${rows.length?"":`<tr><td colspan="5" class="hint">No rarities picked. Turn one on above.</td></tr>`}${rows.map(s=>row(`<span class="mn" data-mineral="${esc(s.m.n)}">${s.m.ic?`<img src="${s.m.ic}" alt="" loading="lazy">`:""}<span><b>${esc(s.m.n)}</b><br><span class="rr" style="--rc:${rc(s.m.r)}">${s.m.r}</span></span></span>`,"",s.m.r,s)).join("")}</tbody></table>`}
  else{const m=MIN[S.min.toLowerCase()];const rows=(m.ch||[]).map(c=>c[0]).filter(l=>LOC[l]).map(l=>({l,s:shares(l,L).find(x=>x.m===m)})).filter(x=>x.s).sort((a,b)=>b.s.eff-a.s.eff);
    const best=rows.find(x=>!/Void/.test(x.l))||rows[0];
    $("sum").innerHTML=best?(()=>{const pp=1-Math.pow(1-best.s.eff,perPan());const pans=pp>0?1/pp:Infinity;return `<div><span class="lab">Best place</span><b style="font-family:var(--f-body);font-size:1rem">${esc(best.l)}</b></div><div><span class="lab">Per pan there</span><b>${oneInTxt(pp)}</b>${+S.pph>0&&isFinite(pans)?`<span class="hint">about ${hrs(pans)}</span>`:""}</div>`})():"";
    $("tbl").innerHTML=`<table class="o">${head}<tbody>${rows.map(x=>row(`<span class="lk" data-location="${esc(baseLoc(x.l))}">${esc(x.l)}</span>${/Void/.test(x.l)?' <span class="hint">(loot pool changes)</span>':""}`,"","",x.s)).join("")}</tbody></table>`}
  try{simDraw()}catch(e){}
}
document.addEventListener("click",e=>{const rb=e.target.closest("[data-r]");if(rb){const r=rb.dataset.r,here=[...document.querySelectorAll("#rarF [data-r]")].map(b=>b.dataset.r);let shown=here.filter(x=>!S.hideR.includes(x));shown=shown.length===here.length?[r]:(shown.includes(r)?shown.filter(x=>x!==r):[...shown,r]);S.hideR=(!shown.length||shown.length===here.length)?[]:ORD.filter(x=>!shown.includes(x));save();render();return}
  if(e.target.closest("[data-rall]")){S.hideR=[];save();render();return}
  if(e.target.closest("[data-rnone]")){S.hideR=ORD.slice();save();render();return}const f=e.target.closest("[data-fmt]");if(f){S.fmt=f.dataset.fmt;save();render();return}});
// ---- pan simulator: rolls pans at the picked spot with the same chances as the table ----
let SIM=null;
function simSpot(){if(S.by==="loc")return S.loc;const m=MIN[S.min.toLowerCase()];const rows=(m&&m.ch||[]).map(c=>c[0]).filter(l=>LOC[l]).map(l=>({l,s:shares(l,Math.max(1,+S.luck||1)).find(x=>x.m===m)})).filter(x=>x.s).sort((a,b)=>b.s.eff-a.s.eff);const b=rows.find(x=>!/Void/.test(x.l))||rows[0];return b?b.l:LOCS[0]}
function simKey(){return [simSpot(),Math.max(1,+S.luck||1),Math.max(1,+S.cap||1)].join("|")}
function simRun(n){const spot=simSpot(),L=Math.max(1,+S.luck||1);const list=shares(spot,L);if(!list.length)return;
  SIM={key:simKey(),spot,pans:0,got:{},total:0,best:null,n};
  const cum=[];let t=0;list.forEach(x=>{t+=x.eff;cum.push(t)});const pp=perPan(),whole=Math.floor(pp),frac=pp-whole;const fresh=new Set();
  for(let i=0;i<n;i++){const k=whole+(Math.random()<frac?1:0);for(let j=0;j<k;j++){const r=Math.random()*t;let lo=0,hi=cum.length-1;while(lo<hi){const mid=(lo+hi)>>1;if(cum[mid]<r)lo=mid+1;else hi=mid}
    const x=list[lo];const nm=x.m.n;if(!SIM.got[nm])fresh.add(nm);SIM.got[nm]=(SIM.got[nm]||0)+1;SIM.total++;
    if(!SIM.best||x.eff<SIM.best.eff)SIM.best={n:nm,eff:x.eff}}}
  SIM.pans+=n;simDraw()}
function simDraw(fresh){const out=$("simOut");$("simWhere").textContent="At "+simSpot();document.querySelectorAll("[data-sim]").forEach(b=>b.classList.toggle("on",!!SIM&&+b.dataset.sim===SIM.n));
  if(!SIM||SIM.key!==simKey()){out.innerHTML=SIM?'<p class="hint">Your luck, capacity or spot changed. Pick an amount to pan again.</p>':"";return}
  const items=Object.entries(SIM.got).map(([n,c])=>({m:MIN[n.toLowerCase()],c})).filter(x=>x.m).sort((a,b)=>ORD.indexOf(a.m.r)-ORD.indexOf(b.m.r)||b.c-a.c);
  
  out.innerHTML=`<div class="simsum"><div><span class="lab">Pans</span><b>${fmt(SIM.pans,0)}</b></div><div><span class="lab">Minerals found</span><b>${fmt(SIM.total,0)}</b></div></div>
  <div class="simg">${items.map(x=>`<div class="simi${fresh&&fresh.has(x.m.n)?" new":""}" style="--rc:${rc(x.m.r)}">${x.m.ic?`<img src="${x.m.ic}" alt="">`:""}<span><b>${esc(x.m.n)}</b><small style="color:${rc(x.m.r)}">${esc(x.m.r)}</small></span><em>×${fmt(x.c,0)}</em></div>`).join("")}</div>`}
const simCustom=()=>{const n=Math.round(+$("simN").value);if(!(n>=1)){$("simN").focus();return}const c=Math.min(100000,n);if(c!==n)$("simN").value=c;simRun(c)};
document.addEventListener("click",e=>{const b=e.target.closest("[data-sim]");if(b){simRun(+b.dataset.sim);return}if(e.target.closest("#simGo"))simCustom()});
$("simN").addEventListener("keydown",e=>{if(e.key==="Enter")simCustom()});
// ---- search box: type part of a location or mineral name, then pick from the list ----
const AC=makeAC({inp:$("pick"),items:LOCS.map(n=>({k:"loc",n,tag:"Location"})).concat(MINS.map(n=>{const m=MIN[n.toLowerCase()];return {k:"min",n,tag:"Mineral",ic:m&&m.ic,col:m&&rc(m.r)}})),
  cur:()=>S.by==="loc"?S.loc:S.min,icon:()=>{if(S.by!=="min")return null;const m=MIN[S.min.toLowerCase()];return m&&m.ic},
  pick:x=>{if(x.k==="loc"){S.by="loc";S.loc=x.n}else{S.by="min";S.min=x.n}save();render()}});
["luck","cap","pph"].forEach(k=>$(k).addEventListener("input",()=>{S[k]=$(k).value;save();render()}));
$("fromCalc").onclick=async()=>{let t=null;try{t=await window.parent.ptGetTotals()}catch(e){}
  if(!t){$("perPan").textContent="Couldn't read the Stat Calculator. Open it once and set up your gear.";return}S.luck=Math.round(t.Luck);S.cap=Math.round(t.Capacity)||S.cap;save();render()};
// ---- save the current table as an image (no page controls, just the results) ----
function toast(t){const d=document.createElement("div");d.className="toast";d.setAttribute("role","status");d.textContent=t;document.body.appendChild(d);setTimeout(()=>d.remove(),2200)}
const HEX={Ascended:"#ffd36b",Exotic:"#f17ad6",Mythic:"#f0687f",Legendary:"#f2b53a",Epic:"#b880ee",Rare:"#68a6f0",Uncommon:"#6cc46e",Common:"#a3adb8"};
async function oddsImage(){const L=Math.max(1,+S.luck||1),pp=perPan(),pph=+S.pph>0,mode=S.fmt||"one";
  const F='"IBM Plex Sans","Segoe UI",system-ui,sans-serif',FD='"Chakra Petch","Segoe UI",system-ui,sans-serif',FM='"IBM Plex Mono",Consolas,monospace';try{await document.fonts.ready}catch(e){}
  const oneS=p=>{const n=1/p;return "~1 in "+(n<10?fmt(n,1):fmt(Math.round(n),0))};
  const cell=p=>!(p>0)?["—",""]:mode==="pct"?[pctTxt(p),""]:mode==="both"?[oneS(p),pctTxt(p)]:[oneS(p),""];
  const calc=s=>{const p=1-Math.pow(1-s.eff,pp);const pans=p>0?1/p:Infinity;return {s,p,pans}};
  let title,tcol="#e6e9ec",rows,sums;
  if(S.by==="loc"){title=S.loc;const all=shares(S.loc,L).filter(s=>!S.hideR.includes(s.m.r)).sort((a,b)=>ORD.indexOf(a.m.r)-ORD.indexOf(b.m.r)||a.p-b.p);
    rows=all.map(s=>({name:s.m.n,sub:s.m.r,col:HEX[s.m.r],ic:s.m.ic,...calc(s)}));
    sums=["Exotic","Mythic","Legendary"].filter(r=>!S.hideR.includes(r)&&all.some(x=>x.m.r===r)).map(r=>{const e=all.filter(x=>x.m.r===r).reduce((t,x)=>t+x.eff,0);return {lab:"Any "+r+" · per pan",col:HEX[r],v:cell(1-Math.pow(1-e,pp))}})}
  else{const m=MIN[S.min.toLowerCase()];title=m.n;tcol=HEX[m.r]||tcol;
    const list=(m.ch||[]).map(c=>c[0]).filter(l=>LOC[l]).map(l=>({l,s:shares(l,L).find(x=>x.m===m)})).filter(x=>x.s).sort((a,b)=>b.s.eff-a.s.eff);
    rows=list.map(x=>({name:x.l,sub:/Void/.test(x.l)?"Loot pool changes":"",col:"#98a2ad",ic:null,...calc(x.s)}));
    const best=list.find(x=>!/Void/.test(x.l))||list[0];
    sums=best?[{lab:"Best place",col:"#98a2ad",v:[best.l,""],txt:true},{lab:"Per pan there",col:"#98a2ad",v:(()=>{const c0=calc(best.s),v=cell(c0.p);return v[1]||!(pph&&isFinite(c0.pans))?v:[v[0],"about "+hrs(c0.pans)]})()}]:[]}
  const W=1200,PAD=40,RH=mode==="both"?54:46,SUMH=sums.length?78:0;
  const H=PAD+90+SUMH+(sums.length?18:0)+36+Math.max(1,rows.length)*RH+60;
  const cv=document.createElement("canvas");const sc=2;cv.width=W*sc;cv.height=H*sc;const c=cv.getContext("2d");c.scale(sc,sc);
  const rr=(x,y,w,h,r)=>{c.beginPath();c.moveTo(x+r,y);c.arcTo(x+w,y,x+w,y+h,r);c.arcTo(x+w,y+h,x,y+h,r);c.arcTo(x,y+h,x,y,r);c.arcTo(x,y,x+w,y,r);c.closePath()};
  const fit=(t,w)=>{if(c.measureText(t).width<=w)return t;while(t.length>1&&c.measureText(t+"…").width>w)t=t.slice(0,-1);return t+"…"};
  const img=src=>new Promise(res=>{if(!src)return res(null);const i=new Image();i.onload=()=>res(i);i.onerror=()=>res(null);i.src=src});
  c.fillStyle="#14181c";c.fillRect(0,0,W,H);
  c.font=`600 13px ${F}`;const mb="Made by @__coastal";const mw=c.measureText(mb).width+28,mx=W-PAD-mw,my=PAD-6;c.fillStyle="rgba(20,184,166,.14)";rr(mx,my,mw,26,13);c.fill();c.strokeStyle="rgba(20,184,166,.6)";c.lineWidth=1;rr(mx,my,mw,26,13);c.stroke();c.fillStyle="#14b8a6";c.beginPath();c.arc(mx+12,my+13,3,0,Math.PI*2);c.fill();c.fillStyle="#2dd4bf";c.fillText(mb,mx+20,my+17.5);
  c.fillStyle=tcol;c.font=`700 34px ${FD}`;c.fillText(fit(title,W-PAD*2-mw-20),PAD,PAD+30);
  const sub=[`Luck ${fmt(L,0)}`,`Capacity ${fmt(+S.cap||1,0)}`,`about ${fmt(pp,1)} minerals per pan`];if(pph)sub.push(`${fmt(+S.pph,0)} pans per hour`);
  c.fillStyle="#98a2ad";c.font=`15px ${F}`;c.fillText(sub.join(" · "),PAD,PAD+58);
  let y=PAD+82;
  if(sums.length){const bw=(W-PAD*2-12*(sums.length-1))/sums.length;sums.forEach((b,i)=>{const x=PAD+i*(bw+12);c.fillStyle="#1c2126";rr(x,y,bw,SUMH,10);c.fill();c.strokeStyle="#2c333a";c.lineWidth=1;rr(x,y,bw,SUMH,10);c.stroke();
      c.fillStyle=b.col;c.font=`600 11.5px ${F}`;c.fillText(b.lab.toUpperCase(),x+14,y+24);c.fillStyle="#e6e9ec";c.font=b.txt?`600 19px ${F}`:`500 21px ${FM}`;c.fillText(fit(b.v[0],bw-28),x+14,y+52);
      if(b.v[1]){c.fillStyle="#98a2ad";c.font=`12px ${F}`;c.fillText(fit(b.v[1],bw-28),x+14,y+69)}});y+=SUMH+18}
  const cols=[S.by==="loc"?"Mineral":"Location","Base chance","Per mineral","Per pan"];if(pph)cols.push("Time");
  const nameW=pph?360:420,nw=(W-PAD*2-nameW-24)/(cols.length-1);const cx=i=>PAD+12+nameW+nw*i;
  c.font=`600 11px ${F}`;c.fillStyle="#98a2ad";cols.forEach((t,i)=>{const u=t.toUpperCase();if(!i)c.fillText(u,PAD+12,y+20);else c.fillText(u,cx(i)-c.measureText(u).width,y+20)});
  y+=30;c.strokeStyle="#2c333a";c.beginPath();c.moveTo(PAD,y);c.lineTo(W-PAD,y);c.stroke();
  const icons=await Promise.all(rows.map(r=>img(r.ic)));
  if(!rows.length){c.fillStyle="#5d6670";c.font=`italic 14px ${F}`;c.fillText("No rarities picked",PAD+12,y+28)}
  rows.forEach((r,k)=>{const top=y+k*RH,mid=top+RH/2;if(k%2){c.fillStyle="#191d22";c.fillRect(PAD,top,W-PAD*2,RH)}
    let tx=PAD+12;if(icons[k]){c.drawImage(icons[k],tx,mid-15,30,30);tx+=40}
    c.fillStyle=S.by==="loc"?r.col:"#e6e9ec";c.font=`600 15px ${F}`;c.fillText(fit(r.name,nameW-(tx-PAD)),tx,r.sub?mid-2:mid+5);
    if(r.sub){c.fillStyle=S.by==="loc"?r.col:"#98a2ad";c.globalAlpha=.8;c.font=`11.5px ${F}`;c.fillText(r.sub,tx,mid+14);c.globalAlpha=1}
    const vals=[cell(r.s.base),cell(r.s.eff),cell(r.p)];if(pph)vals.push([isFinite(r.pans)?hrs(r.pans):"—",""]);
    vals.forEach((v,i)=>{const x=cx(i+1);c.font=`14px ${FM}`;c.fillStyle=i===1&&r.s.eff>r.s.base?"#3cc2a8":"#e6e9ec";c.fillText(v[0],x-c.measureText(v[0]).width,v[1]?mid-3:mid+5);
      if(v[1]){c.font=`11.5px ${F}`;c.fillStyle="#98a2ad";c.fillText(v[1],x-c.measureText(v[1]).width,mid+14)}})});
  y+=Math.max(1,rows.length)*RH+28;{const et="Estimates only: modifiers, Size Boost, enchants, events and weather aren't counted, so real odds can differ.";c.font=`600 13px ${F}`;const ew=c.measureText(et).width+30,ex=PAD,ey=y-10;c.fillStyle="rgba(239,122,102,.14)";rr(ex,ey,ew,28,14);c.fill();c.strokeStyle="rgba(239,122,102,.65)";c.lineWidth=1;rr(ex,ey,ew,28,14);c.stroke();c.fillStyle="#ef7a66";c.beginPath();c.arc(ex+13,ey+14,3,0,Math.PI*2);c.fill();c.fillText(et,ex+22,ey+18.5)}
  return await new Promise(res=>cv.toBlob(res,"image/png"))}
window.ptOddsImage=oddsImage;
$("toImg").onclick=async()=>{let blob=null;try{blob=await oddsImage()}catch(e){console.error(e)}if(!blob){toast("Couldn't draw the image");return}
  const nm=((S.by==="loc"?S.loc:S.min)+" odds").replace(/[\\/:*?"<>|]+/g," ").trim();
  try{await window.parent.ptSave(nm+".png",blob);toast((()=>{try{return window.parent.ptImgMsg()}catch(e){return "Image saved"}})())}catch(e){const c=e&&e.code;if(c!=="declined")toast(c==="rate_limited"?"A save prompt is already open":"Couldn't save the image here")}};
window.ptOpenFor=(kind,name)=>{if(kind==="mineral"){S.by="min";S.min=name}else{S.by="loc";S.loc=name}save();render()};
window.ptRefresh=()=>{youPull(["luck","cap","pph"]);render()};
render();
