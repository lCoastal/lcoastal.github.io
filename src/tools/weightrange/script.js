(()=>{
const $=id=>document.getElementById(id);
let S={min:"",sb:"",cap:"",mag:false};try{Object.assign(S,JSON.parse(localStorage.getItem("wr-s")||"{}"))}catch(e){}
const save=()=>{try{localStorage.setItem("wr-s",JSON.stringify(S))}catch(e){}};
const baseLoc=n=>n.replace(/\s*\((inside|outside) Firefly Zones\)/,"").replace(/\s*\(when in the loot pool\)/,"");
const MINS=P.mins.filter(m=>m.bw>0).sort((a,b)=>a.n.localeCompare(b.n));
const BY=Object.fromEntries(MINS.map(m=>[m.n.toLowerCase(),m]));
// zone -> [{m, p}] from each mineral's drop table
const ZONES={};MINS.forEach(m=>(m.ch||[]).forEach(c=>{const z=baseLoc(c[0]),p=parseFloat(String(c[1]).replace(/[%,]/g,""))/100;const l=ZONES[z]=ZONES[z]||[];const o=l.find(x=>x.m===m);if(o)o.p=Math.max(o.p,p||0);else l.push({m,p:p||0})}));
const ZBY=Object.fromEntries(Object.keys(ZONES).map(z=>[z.toLowerCase(),z]));
// zones where a Volcanic Eruption doubles mineral size
const EV=((P.x2&&P.x2.events)||[]).find(e=>e.n==="Volcanic Eruption");
const ERUPT=new Set(EV?EV.fx.filter(t=>/^\s{2}/.test(t)).map(t=>t.trim()):["Volcanic Sands","Windswept Beach","Volcanic Springs","Magma Furnace","Infernal Heart"]);
const kg=v=>!isFinite(v)?"—":v>=1000?fmt(v,0)+" kg":v>=100?fmt(v,1)+" kg":fmt(v,2)+" kg";
const oneIn=p=>p>=.5?fmt(p*100,0)+"% of them":"1 in "+fmt(Math.round(1/p),0);

["sb","cap"].forEach(k=>{$(k).value=S[k];$(k).addEventListener("input",e=>{S[k]=e.target.value;save();render()})});
$("min").value=S.min;
$("mag").checked=!!S.mag;$("mag").onchange=e=>{S.mag=e.target.checked;save();render()};
$("fromCalc").onclick=async()=>{let t=null;try{t=await window.parent.ptGetTotals()}catch(e){}if(!t)return;
  S.sb=String(Math.round((t["Size Boost"]||0)*10)/10);S.cap=String(Math.round(t.Capacity)||S.cap);$("sb").value=S.sb;$("cap").value=S.cap;save();render()};
// picker: minerals and zones in one list
const curName=()=>{const q=String(S.min).trim().toLowerCase();return BY[q]?BY[q].n:ZBY[q]||""};
const AC=makeAC({inp:$("min"),items:MINS.map(m=>({n:m.n,tag:m.r,ic:m.ic,col:rc(m.r)})).concat(Object.keys(ZONES).map(z=>({n:z,tag:"Zone · "+ZONES[z].length+" minerals"}))),
  cur:curName,icon:()=>{const m=BY[String(S.min).trim().toLowerCase()];return m&&m.ic},pick:x=>{$("min").value=x.n;$("min").dispatchEvent(new Event("input"))}});
// registered after the picker so it can still tell typed text from the current pick
$("min").value=S.min;$("min").addEventListener("input",e=>{S.min=e.target.value;save();render()});

// percentile chart: x is the share of drops (each slice as wide as its share), y is weight in kg;
// each bar reaches the heaviest weight in that slice
const PE=[0,.25,.3,.35,.4,.45,.5,.55,.6,.65,.7,.75,.8,.85,.9,.95,.99,1];
let BANDS=[];
function chart(base,model,M){
  const W=640,H=240,L=58,R=12,T=12,B=30,x=u=>L+u*(W-L-R),top=base*WT_MAX*M,y=v=>H-B-v/top*(H-B-T);
  BANDS=PE.slice(1).map((u,i)=>{const u0=PE[i];return {u0,u1:u,k0:model.q(1-u0),k1:model.q(1-u)}});
  const grid=[0,.25,.5,.75,1].map(f=>`<line class="grid" x1="${L}" x2="${W-R}" y1="${y(top*f)}" y2="${y(top*f)}"/><text x="${L-6}" y="${y(top*f)+4}" text-anchor="end">${kg(top*f)}</text>`).join("");
  const rects=BANDS.map((b,i)=>{const y0=y(0),y1=y(base*b.k1*M);return `<rect class="pb" data-b="${i}" x="${(x(b.u0)+1).toFixed(1)}" y="${y1.toFixed(1)}" width="${Math.max(1.5,x(b.u1)-x(b.u0)-2).toFixed(1)}" height="${Math.max(2,y0-y1).toFixed(1)}" rx="2"/>`}).join("");
  const tk=[0,.25,.5,.75,1];
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Weights by percentile">${grid}${rects}<line class="ax" x1="${L}" x2="${W-R}" y1="${H-B}" y2="${H-B}"/>
    ${tk.map((u,i)=>`<text x="${x(u)}" y="${H-B+17}" text-anchor="${i===0?"start":i===4?"end":"middle"}">${u===0?"lightest":u===1?"heaviest":Math.round(u*100)+"%"}</text>`).join("")}</svg><div class="tip" id="tip" hidden></div>`}
const bandText=(b,base,M)=>{const p0=Math.round(b.u0*100),p1=Math.round(b.u1*100),sh=Math.round((b.u1-b.u0)*100);
  const name=b.u0===0?`Lightest ${p1}%`:b.u1===1?`Top ${100-p0}%`:`Percentile ${p0}–${p1}`;
  const note=b.u0===0?"the group that always comes out small":b.u1===1?"heavier than 99% of drops":`heavier than ${p0}% of drops`;
  return `<b>${name}</b><span>${sh}% of drops · ${note}</span><span class="kg">${kg(base*b.k0*M)} – ${kg(base*b.k1*M)}</span>`};
function mineral(m,sb,cap,model,M){
  const base=m.bw*(1+sb/100);
  $("head").innerHTML=`${m.ic?`<img src="${m.ic}" alt="">`:""}<div><b style="color:${rc(m.r)}">${esc(m.n)}</b><br><span>${esc(m.r)} · base weight ${m.bw} kg · Size Boost ${fmt(sb,1)}% · ${cap?fmt(cap,0)+" capacity":"capacity not set (4,000 used)"}${S.mag?" · Solar Magnifier":""}</span></div>`;
  const tile=(l,v,s)=>`<div><span class="lab">${l}</span><b>${v}</b>${s?`<small>${s}</small>`:""}</div>`;
  $("sum").innerHTML=tile("Lightest possible",kg(base*WT_MIN*M),"")+tile("Typical",kg(base*model.q(.5)*M),"half come out heavier")+tile("Average",kg(base*model.mean*M),"")+tile("Heaviest possible",kg(base*WT_MAX*M),"the same in every zone");
  // eruption max only for minerals that drop nowhere else
  const zs=[...new Set((m.ch||[]).map(c=>baseLoc(c[0])))],onlyEr=zs.length&&zs.every(z=>ERUPT.has(z));
  if(onlyEr)$("sum").lastElementChild.querySelector("small").textContent=kg(base*WT_MAX*2*M)+" in a Volcanic Eruption";
  $("chart").innerHTML=chart(base,model,M);CUR=[base,M];
  $("chartNote").textContent=`Left to right is all your drops from lightest to heaviest: each bar is a slice of them (the lightest 25%, then 5% slices, then the top 1%) and as wide as its share. A bar's height is the heaviest weight in that slice. Hover a bar for its full range.${cap&&(cap<1856||cap>7240)?" Your capacity is outside the tested 1,856–7,240, so the shape is an estimate.":""}`;
  $("pct").innerHTML=[[.5,"Top half"],[.25,"Top 25%"],[.1,"Top 10%"],[.01,"Top 1%"],[.001,"Top 0.1%"]].map(([p,l])=>`<div><span>${l}</span><b>${kg(base*model.q(p)*M)}</b><small>or heavier · ${oneIn(p)}</small></div>`).join("");
}

function zone(z,sb,cap,model,M){
  const list=ZONES[z].slice().sort((a,b)=>a.p-b.p),er=ERUPT.has(z),f=1+sb/100,half=model.q(.5);
  $("zhead").innerHTML=`<div><b>${esc(z)}</b><br><span>${list.length} minerals · Size Boost ${fmt(sb,1)}% · ${cap?fmt(cap,0)+" capacity":"capacity not set (4,000 used)"}${S.mag?" · Solar Magnifier":""}${er?" · 🌋 has Volcanic Eruptions":""}</span></div>`;
  const hiAll=Math.max(...list.map(x=>x.m.bw))*f*WT_MAX*M*(er?2:1),loAll=Math.min(...list.map(x=>x.m.bw))*f*WT_MIN*M,lg=v=>Math.log(v/loAll)/Math.log(hiAll/loAll)*100;
  $("ztbl").innerHTML=`<table class="z"><thead><tr><th>Mineral</th><th>Lightest</th><th>Typical</th><th>Heaviest</th>${er?"<th>In an eruption</th>":""}<th class="hide-s"></th></tr></thead><tbody>${list.map(({m})=>{const b=m.bw*f*M,lo=b*WT_MIN,hi=b*WT_MAX;
    return `<tr data-m="${esc(m.n)}" title="Open ${esc(m.n)}"><td><span class="mn">${m.ic?`<img src="${m.ic}" alt="">`:""}<span><span style="color:${rc(m.r)}">${esc(m.n)}</span><small>${esc(m.r)} · base ${m.bw} kg</small></span></span></td><td>${kg(lo)}</td><td>${kg(b*half)}</td><td class="hv">${kg(hi)}</td>${er?`<td class="er">${kg(m.bw*f*WT_MAX*2*M)}</td>`:""}<td class="hide-s" style="width:22%"><div class="rngbar"><i style="left:${lg(lo).toFixed(1)}%;right:${(100-lg(hi)).toFixed(1)}%"></i></div></td></tr>`}).join("")}</tbody></table>
    <p class="hint" style="margin-top:8px">Rarest first. Click a mineral to see how its weights spread. The bar shows each mineral's range on the same scale.</p>`;
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
  const q=String(S.min).trim().toLowerCase(),m=BY[q],z=!m&&ZBY[q],sb=Math.max(0,+S.sb||0),cap=+S.cap||0,M=S.mag?1.5:1,model=wtModel(cap||4000);
  $("out").hidden=!m;$("zout").hidden=!z;
  if(m)mineral(m,sb,cap,model,M);else if(z)zone(z,sb,cap,model,M);
}
render();
})();
