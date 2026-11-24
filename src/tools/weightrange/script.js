(()=>{
const $=id=>document.getElementById(id);
let S={min:"",sb:"",cap:"",mag:false};try{Object.assign(S,JSON.parse(localStorage.getItem("wr-s")||"{}"))}catch(e){}
const youPush=ptYouLink(S,{sb:"sb",cap:"cap",mag:"mag"},()=>{["sb","cap"].forEach(k=>$(k).value=S[k]);$("mag").checked=!!S.mag;render()});
const save=()=>{try{localStorage.setItem("wr-s",JSON.stringify(S))}catch(e){}youPush()};
ptPageButtons($("acts"),()=>"Weight range "+curName(),()=>ptPageRead($("head"),[{h:"",el:$("sum")},{h:"How heavy the top ones get",el:$("pct")}]),"Estimates from a fitted model, so actual results can differ.");
ptPageButtons($("zacts"),()=>curName()?"Weights in "+curName():"Mineral weights",()=>ptPageRead($("zhead"),[{h:"",el:$("ztbl")}]),"Estimates from a fitted model, so actual results can differ.");
const baseLoc=n=>n.replace(/\s*\((inside|outside) Firefly Zones\)/,"").replace(/\s*\(when in the loot pool\)/,"");
const MINS=P.mins.filter(m=>m.bw>0).sort((a,b)=>a.n.localeCompare(b.n));
const BY=Object.fromEntries(MINS.map(m=>[m.n.toLowerCase(),m]));
// zone -> [{m, p}] from each mineral's drop table
const ZONES={};MINS.forEach(m=>(m.ch||[]).forEach(c=>{const z=baseLoc(c[0]),p=parseFloat(String(c[1]).replace(/[%,]/g,""))/100;const l=ZONES[z]=ZONES[z]||[];const o=l.find(x=>x.m===m);if(o)o.p=Math.max(o.p,p||0);else l.push({m,p:p||0})}));
const ZBY=Object.fromEntries(Object.keys(ZONES).map(z=>[z.toLowerCase(),z]));
// zones where a Volcanic Eruption doubles mineral size
const EV=((P.x2&&P.x2.events)||[]).find(e=>e.n==="Volcanic Eruption");
const ERUPT=new Set(EV?EV.fx.filter(t=>/^\s{2}/.test(t)).map(t=>t.trim()):["Volcanic Sands","Windswept Beach","Volcanic Springs","Magma Furnace","Infernal Heart"]);
const kg=v=>!isFinite(v)?"-":v>=1000?fmt(v,0)+" kg":v>=100?fmt(v,1)+" kg":fmt(v,2)+" kg";
const oneIn=p=>p>=.5?fmt(p*100,0)+"% of them":"1 in "+fmt(Math.round(1/p),0);

["sb","cap"].forEach(k=>{$(k).value=S[k];$(k).addEventListener("input",e=>{S[k]=e.target.value;save();render()})});
$("min").value=S.min;
$("wz").innerHTML=zoneSizeOpts(S.wz||"");$("wz").onchange=e=>{S.wz=e.target.value;save();render()};$("mag").checked=!!S.mag;$("mag").onchange=e=>{S.mag=e.target.checked;save();render()};
$("fromCalc").onclick=async()=>{let t=null;try{t=await window.parent.ptGetTotals()}catch(e){}if(!t)return;
  S.sb=String(Math.round((t["Size Boost"]||0)*10)/10);S.cap=String(Math.round(t.Capacity)||S.cap);$("sb").value=S.sb;$("cap").value=S.cap;save();render()};
// picker: minerals and zones in one list
const curName=()=>{const q=String(S.min).trim().toLowerCase();return BY[q]?BY[q].n:ZBY[q]||""};
const AC=makeAC({inp:$("min"),items:MINS.map(m=>({n:m.n,tag:m.r,ic:m.ic,col:rc(m.r)})).concat(Object.keys(ZONES).map(z=>({n:z,tag:"Zone, "+ZONES[z].length+" minerals"}))),
  cur:curName,icon:()=>{const m=BY[String(S.min).trim().toLowerCase()];return m&&m.ic},pick:x=>{$("min").value=x.n;$("min").dispatchEvent(new Event("input"))}});
// registered after the picker so it can still tell typed text from the current pick
$("min").value=S.min;$("min").addEventListener("input",e=>{S.min=e.target.value;save();render()});

// chart: the weight range cut into equal kg slices; a bar's height is the share of drops in that slice,
// and hovering shows which percentiles the slice covers
const NB=25;
let BANDS=[];
function chart(base,model,M){
  const W=640,H=230,L=46,R=12,T=12,B=30,bw=(WT_MAX-WT_MIN)/NB,x=k=>L+(k-WT_MIN)/(WT_MAX-WT_MIN)*(W-L-R);
  BANDS=[];for(let i=0;i<NB;i++){const k0=WT_MIN+i*bw,k1=k0+bw,s0=model.sf(k0),s1=model.sf(k1);BANDS.push({k0,k1,v:s0-s1,u0:1-s0,u1:1-s1})}
  const top=Math.max(...BANDS.map(b=>b.v)),step=top>.2?.1:top>.1?.05:top>.04?.02:.01,yt=Math.ceil(top/step)*step,y=v=>H-B-v/yt*(H-B-T);
  const ticks=[];for(let v=0;v<=yt+1e-9;v+=step)ticks.push(v);
  const grid=ticks.map(v=>`<line class="grid" x1="${L}" x2="${W-R}" y1="${y(v).toFixed(1)}" y2="${y(v).toFixed(1)}"/><text x="${L-6}" y="${(y(v)+4).toFixed(1)}" text-anchor="end">${fmt(v*100,0)}%</text>`).join("");
  const rects=BANDS.map((b,i)=>`<rect class="pb" data-b="${i}" x="${(x(b.k0)+1).toFixed(1)}" y="${y(b.v).toFixed(1)}" width="${(x(b.k1)-x(b.k0)-2).toFixed(1)}" height="${Math.max(0,H-B-y(b.v)).toFixed(1)}" rx="2"/>`).join("");
  const tk=[0,.25,.5,.75,1].map(f=>WT_MIN+f*(WT_MAX-WT_MIN));
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Share of drops at each weight">${grid}${rects}<line class="ax" x1="${L}" x2="${W-R}" y1="${H-B}" y2="${H-B}"/>
    ${tk.map((k,i)=>`<text x="${x(k)}" y="${H-B+17}" text-anchor="${i===0?"start":i===4?"end":"middle"}">${kg(base*k*M)}</text>`).join("")}</svg><div class="tip" id="tip" hidden></div>`}
const pctl=u=>u<.995?Math.round(u*100):u<.9995?fmt(u*100,1):fmt(u*100,2);
const bandText=(b,base,M)=>`<b>${kg(base*b.k0*M)} – ${kg(base*b.k1*M)}</b><span>${b.v>=.001?fmt(b.v*100,1):fmt(b.v*100,2)}% of drops land here</span><span>${b.u0<.005?`The lightest ${pctl(b.u1)}% of drops`:b.u1>.995?`Percentile ${pctl(b.u0)}–100: the heaviest ${fmt((1-b.u0)*100,1)}%`:`Percentile ${pctl(b.u0)}–${pctl(b.u1)}: heavier than ${pctl(b.u0)}% of drops`}</span>`;

function mineral(m,sb,cap,model,M){
  const base=m.bw*(1+sb/100);
  $("head").innerHTML=`${m.ic?`<img src="${m.ic}" alt="">`:""}<div><b class="mlink" data-mineral="${esc(m.n)}" title="Open ${esc(m.n)}" style="color:${rc(m.r)}">${esc(m.n)}</b><br><span>${esc(m.r)}, base weight ${m.bw} kg, Size Boost ${fmt(sb,1)}%, ${cap?fmt(cap,0)+" capacity":"capacity not set (4,000 used)"}${S.mag?", Solar Magnifier":""}</span></div>`;
  const tile=(l,v,s)=>`<div><span class="lab">${l}</span><b>${v}</b>${s?`<small>${s}</small>`:""}</div>`;
  $("sum").innerHTML=tile("Lightest (est.)",kg(base*WT_MIN*M),"")+tile("Typical",kg(base*model.q(.5)*M),"half come out heavier")+tile("Average",kg(base*model.mean*M),"")+tile("Heaviest (est.)",kg(base*WT_MAX*M),"best guess from test logs");
  // eruption max only for minerals that drop nowhere else
  const zs=[...new Set((m.ch||[]).map(c=>baseLoc(c[0])))],onlyEr=zs.length&&zs.every(z=>ERUPT.has(z));
  if(onlyEr)$("sum").lastElementChild.querySelector("small").textContent=kg(base*WT_MAX*2*M)+" in a Volcanic Eruption";
  $("chart").innerHTML=chart(base,model,M);CUR=[base,M];
  $("chartNote").textContent=`Each bar is an equal slice of the weight range, and its height is how many of your drops land there. Hover a bar to see which percentiles it covers.${cap&&(cap<1856||cap>7240)?" At capacity this far out the shape is a rougher estimate.":""}`;
  $("pct").innerHTML=[[.5,"Top half"],[.25,"Top 25%"],[.1,"Top 10%"],[.01,"Top 1%"],[.001,"Top 0.1%"]].map(([p,l])=>`<div><span>${l}</span><b>${kg(base*model.q(p)*M)}</b><small>or heavier, ${oneIn(p)}</small></div>`).join("");
}

// z is a zone name, or null for every mineral (shown when nothing is picked)
const RORD=["Exotic","Mythic","Legendary","Epic","Rare","Uncommon","Common"];
function zone(z,sb,cap,model,M){
  const list=z?ZONES[z].slice().sort((a,b)=>a.p-b.p):MINS.map(m=>({m,p:0})).sort((a,b)=>RORD.indexOf(a.m.r)-RORD.indexOf(b.m.r)||a.m.n.localeCompare(b.m.n)),er=!!z&&ERUPT.has(z),f=1+sb/100,half=model.q(.5);
  $("zhead").innerHTML=`<div><b>${z?esc(z):"Every mineral"}</b><br><span>${z?"":"Nothing picked, so here's every mineral, "}${list.length} minerals, Size Boost ${fmt(sb,1)}%, ${cap?fmt(cap,0)+" capacity":"capacity not set (4,000 used)"}${S.mag?", Solar Magnifier":""}${z&&zoneSize(z)!==1?`, zone weights ×${zoneSize(z).toFixed(2)}`:!z&&zoneSize(S.wz)!==1?`, zone weights ×${zoneSize(S.wz).toFixed(2)}`:""}${er?", has Volcanic Eruptions":""}</span></div>`;
  const hiAll=Math.max(...list.map(x=>x.m.bw))*f*WT_MAX*M*(er?2:1),loAll=Math.min(...list.map(x=>x.m.bw))*f*WT_MIN*M,lg=v=>Math.log(v/loAll)/Math.log(hiAll/loAll)*100;
  $("ztbl").innerHTML=`<table class="z"><thead><tr><th>Mineral</th><th>Lightest</th><th>Typical</th><th>Heaviest</th>${er?"<th>In an eruption</th>":""}<th class="hide-s"></th></tr></thead><tbody>${list.map(({m})=>{const b=m.bw*f*M,lo=b*WT_MIN,hi=b*WT_MAX;
    return `<tr data-m="${esc(m.n)}" title="Open ${esc(m.n)}"><td><span class="mn">${m.ic?`<img src="${m.ic}" alt="">`:""}<span><span style="color:${rc(m.r)}">${esc(m.n)}</span><small>${esc(m.r)}, base ${m.bw} kg</small></span></span></td><td>${kg(lo)}</td><td>${kg(b*half)}</td><td class="hv">${kg(hi)}</td>${er?`<td class="er">${kg(m.bw*f*WT_MAX*2*M)}</td>`:""}<td class="hide-s" style="width:22%"><div class="rngbar"><i style="left:${lg(lo).toFixed(1)}%;right:${(100-lg(hi)).toFixed(1)}%"></i></div></td></tr>`}).join("")}</tbody></table>
    <p class="hint" style="margin-top:8px">${z?"Rarest first":"By rarity, then A–Z. Pick a mineral or a zone above to narrow it down"}. Click a mineral to see how its weights spread. The bar shows each mineral's range on the same scale.</p>`;
}
$("ztbl").addEventListener("click",e=>{const r=e.target.closest("[data-m]");if(!r)return;S.min=r.dataset.m;$("min").value=S.min;save();render();AC.sync();window.scrollTo({top:0,behavior:"smooth"})});

let CUR=[1,1];
const chartEl=$("chart");
chartEl.addEventListener("mousemove",e=>{const r=e.target.closest(".pb"),tip=$("tip");if(!tip)return;chartEl.querySelectorAll(".pb.on").forEach(x=>x!==r&&x.classList.remove("on"));
  if(!r){tip.hidden=true;return}r.classList.add("on");tip.innerHTML=bandText(BANDS[+r.dataset.b],CUR[0],CUR[1]);tip.hidden=false;
  const cr=chartEl.getBoundingClientRect(),tw=tip.offsetWidth;let lx=e.clientX-cr.left+12;if(lx+tw>cr.width)lx=e.clientX-cr.left-tw-12;tip.style.left=Math.max(0,lx)+"px";tip.style.top=(e.clientY-cr.top-10)+"px"});
chartEl.addEventListener("mouseleave",()=>{const tip=$("tip");if(tip)tip.hidden=true;chartEl.querySelectorAll(".pb.on").forEach(x=>x.classList.remove("on"))});
chartEl.addEventListener("click",e=>e.target.dispatchEvent(new MouseEvent("mousemove",{clientX:e.clientX,clientY:e.clientY,bubbles:true})));
function render(){
  const q=String(S.min).trim().toLowerCase(),m=BY[q],z=!m&&ZBY[q],sb=Math.max(0,+S.sb||0),cap=+S.cap||0,M=(S.mag?1.5:1)*(z?zoneSize(z):zoneSize(S.wz)),model=wtModel(cap||4000);
  $("out").hidden=!m;$("zout").hidden=!!m;
  if(m)mineral(m,sb,cap,model,M);else zone(z||null,sb,cap,model,M);
}
render();
window.ptOpenFor=(kind,name)=>{if(kind!=="mineral")return;S.min=name;$("min").value=name;save();render();try{AC.sync()}catch(e){}};
})();
