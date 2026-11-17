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

// bar chart: share of minerals in each weight band
function chart(base,model,M){
  const W=640,H=210,L=40,R=10,T=14,B=30,N=30,bw=(WT_MAX-WT_MIN)/N,x=k=>L+(k-WT_MIN)/(WT_MAX-WT_MIN)*(W-L-R);
  const bars=[];for(let i=0;i<N;i++){const lo=WT_MIN+i*bw,hi=lo+bw;bars.push([lo,hi,model.sf(lo)-model.sf(hi)])}
  const top=Math.max(...bars.map(b=>b[2])),yt=Math.ceil(top*100/5)*5/100||.05,y=v=>H-B-v/yt*(H-B-T);
  const grid=[0,yt/2,yt].map(v=>`<line class="grid" x1="${L}" x2="${W-R}" y1="${y(v)}" y2="${y(v)}"/><text x="${L-6}" y="${y(v)+4}" text-anchor="end">${fmt(v*100,1)}%</text>`).join("");
  const rects=bars.map(([lo,hi,v])=>`<rect class="bar${lo<WT_SM_HI-.01?" sm":""}" x="${(x(lo)+1).toFixed(1)}" y="${y(v).toFixed(1)}" width="${(x(hi)-x(lo)-2).toFixed(1)}" height="${(H-B-y(v)).toFixed(1)}"><title>${kg(base*lo*M)} – ${kg(base*hi*M)}: ${fmt(v*100,1)}% of them</title></rect>`).join("");
  const tk=[0,.25,.5,.75,1].map(f=>WT_MIN+f*(WT_MAX-WT_MIN));
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Share of minerals at each weight">${grid}${rects}<line class="ax" x1="${L}" x2="${W-R}" y1="${H-B}" y2="${H-B}"/>
    ${tk.map((k,i)=>`<text x="${x(k)}" y="${H-B+17}" text-anchor="${i===0?"start":i===4?"end":"middle"}">${kg(base*k*M)}</text>`).join("")}</svg>`}

function mineral(m,sb,cap,model,M){
  const base=m.bw*(1+sb/100);
  $("head").innerHTML=`${m.ic?`<img src="${m.ic}" alt="">`:""}<div><b style="color:${rc(m.r)}">${esc(m.n)}</b><br><span>${esc(m.r)} · base weight ${m.bw} kg · Size Boost ${fmt(sb,1)}% · ${cap?fmt(cap,0)+" capacity":"capacity not set (4,000 used)"}${S.mag?" · Solar Magnifier":""}</span></div>`;
  const tile=(l,v,s)=>`<div><span class="lab">${l}</span><b>${v}</b>${s?`<small>${s}</small>`:""}</div>`;
  $("sum").innerHTML=tile("Lightest possible",kg(base*WT_MIN*M),"")+tile("Typical",kg(base*model.q(.5)*M),"half come out heavier")+tile("Average",kg(base*model.mean*M),"")+tile("Heaviest possible",kg(base*WT_MAX*M),"the same in every zone");
  // eruption only matters if the mineral drops in an eruption zone
  const ez=[...new Set((m.ch||[]).map(c=>baseLoc(c[0])).filter(z=>ERUPT.has(z)))];
  $("erupt").hidden=!ez.length;
  if(ez.length)$("erupt").innerHTML=`🌋 In a Volcanic Eruption (${esc(ez.join(", "))}) sizes are doubled: up to <b>${kg(base*WT_MAX*2)}</b>${S.mag?" (without the Magnifier; stacking isn't tested)":""}.`;
  $("chart").innerHTML=chart(base,model,M);
  $("chartNote").textContent=`The grey bars on the left are the ${Math.round(WT_SMALL*100)}% that always come out small. The rest spread across the range and lean heavier the bigger your pan.${cap&&(cap<1856||cap>7240)?" Your capacity is outside the tested 1,856–7,240, so the shape is an estimate.":""}`;
  $("pct").innerHTML=[[.5,"Top half"],[.25,"Top 25%"],[.1,"Top 10%"],[.01,"Top 1%"],[.001,"Top 0.1%"]].map(([p,l])=>`<div><span>${l}</span><b>${kg(base*model.q(p)*M)}</b><small>or heavier · ${oneIn(p)}</small></div>`).join("");
}

function zone(z,sb,cap,model,M){
  const list=ZONES[z].slice().sort((a,b)=>a.p-b.p),er=ERUPT.has(z),f=1+sb/100,half=model.q(.5);
  $("zhead").innerHTML=`<div><b>${esc(z)}</b><br><span>${list.length} minerals · Size Boost ${fmt(sb,1)}% · ${cap?fmt(cap,0)+" capacity":"capacity not set (4,000 used)"}${S.mag?" · Solar Magnifier":""}${er?" · 🌋 has Volcanic Eruptions":""}</span></div>`;
  const hiAll=Math.max(...list.map(x=>x.m.bw))*f*WT_MAX*M*(er?2:1),loAll=Math.min(...list.map(x=>x.m.bw))*f*WT_MIN*M,lg=v=>Math.log(v/loAll)/Math.log(hiAll/loAll)*100;
  $("ztbl").innerHTML=`<table class="z"><thead><tr><th>Mineral</th><th>Lightest</th><th>Typical</th><th>Heaviest</th>${er?"<th>In an eruption</th>":""}<th class="hide-s"></th></tr></thead><tbody>${list.map(({m})=>{const b=m.bw*f*M,lo=b*WT_MIN,hi=b*WT_MAX;
    return `<tr data-m="${esc(m.n)}" title="Open ${esc(m.n)}"><td><span class="mn">${m.ic?`<img src="${m.ic}" alt="">`:""}<span><span style="color:${rc(m.r)}">${esc(m.n)}</span><small>${esc(m.r)} · base ${m.bw} kg</small></span></span></td><td>${kg(lo)}</td><td>${kg(b*half)}</td><td class="hv">${kg(hi)}</td>${er?`<td class="er">${kg(m.bw*f*WT_MAX*2)}</td>`:""}<td class="hide-s" style="width:22%"><div class="rngbar"><i style="left:${lg(lo).toFixed(1)}%;right:${(100-lg(hi)).toFixed(1)}%"></i></div></td></tr>`}).join("")}</tbody></table>
    <p class="hint" style="margin-top:8px">Rarest first. Click a mineral to see how its weights spread. The bar shows each mineral's range on the same scale.${er&&S.mag?" The eruption column is without the Magnifier, since stacking isn't tested.":""}</p>`;
}
$("ztbl").addEventListener("click",e=>{const r=e.target.closest("[data-m]");if(!r)return;S.min=r.dataset.m;$("min").value=S.min;save();render();AC.sync();window.scrollTo({top:0,behavior:"smooth"})});

function render(){
  const q=String(S.min).trim().toLowerCase(),m=BY[q],z=!m&&ZBY[q],sb=Math.max(0,+S.sb||0),cap=+S.cap||0,M=S.mag?1.5:1,model=wtModel(cap||4000);
  $("out").hidden=!m;$("zout").hidden=!z;
  if(m)mineral(m,sb,cap,model,M);else if(z)zone(z,sb,cap,model,M);
}
render();
})();
