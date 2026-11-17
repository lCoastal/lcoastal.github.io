(()=>{
const $=id=>document.getElementById(id);
let S={min:"",sb:"",cap:"",mag:false};try{Object.assign(S,JSON.parse(localStorage.getItem("wr-s")||"{}"))}catch(e){}
const save=()=>{try{localStorage.setItem("wr-s",JSON.stringify(S))}catch(e){}};
const MINS=P.mins.filter(m=>m.bw>0).sort((a,b)=>a.n.localeCompare(b.n));
const BY=Object.fromEntries(MINS.map(m=>[m.n.toLowerCase(),m]));
const baseLoc=n=>n.replace(/\s*\((inside|outside) Firefly Zones\)/,"").replace(/\s*\(when in the loot pool\)/,"");
// zones where a Volcanic Eruption doubles mineral size
const EV=((P.x2&&P.x2.events)||[]).find(e=>e.n==="Volcanic Eruption");
const ERUPT=new Set(EV?EV.fx.filter(t=>/^\s{2}/.test(t)).map(t=>t.trim()):["Volcanic Sands","Windswept Beach","Volcanic Springs","Magma Furnace","Infernal Heart"]);
const kg=v=>!isFinite(v)?"—":v>=1000?fmt(v,0)+" kg":v>=100?fmt(v,1)+" kg":fmt(v,2)+" kg";
const oneIn=p=>p<=0?"never":p>=.5?fmt(p*100,1)+"%":"1 in "+fmt(Math.round(1/p),0);

$("mins").innerHTML=MINS.map(m=>`<option value="${esc(m.n)}">`).join("");
["min","sb","cap"].forEach(k=>{$(k).value=S[k];$(k).addEventListener("input",e=>{S[k]=e.target.value;save();render()})});
$("mag").checked=!!S.mag;$("mag").onchange=e=>{S.mag=e.target.checked;save();render()};
$("fromCalc").onclick=async()=>{let t=null;try{t=await window.parent.ptGetTotals()}catch(e){}if(!t)return;
  S.sb=String(Math.round((t["Size Boost"]||0)*10)/10);S.cap=String(Math.round(t.Capacity)||S.cap);$("sb").value=S.sb;$("cap").value=S.cap;save();render()};

function chart(m,base,model,M){
  const W=640,H=200,L=44,R=12,T=12,B=30,xs=k=>L+(k-WT_MIN)/(WT_MAX-WT_MIN)*(W-L-R);
  const pts=[];let top=0;for(let i=0;i<=240;i++){const k=WT_MIN+(WT_MAX-WT_MIN)*i/240,d=model.pdf(Math.min(WT_MAX-1e-6,Math.max(WT_MIN+1e-6,k)));pts.push([k,d]);top=Math.max(top,d)}
  const ys=d=>H-B-d/top*(H-B-T);
  let path=`M${xs(WT_MIN)},${H-B}`+pts.map(([k,d])=>`L${xs(k).toFixed(1)},${ys(d).toFixed(1)}`).join("")+`L${xs(WT_MAX)},${H-B}Z`;
  const ticks=[0,.25,.5,.75,1].map(f=>WT_MIN+f*(WT_MAX-WT_MIN));
  const mk=[[.5,"half beat this"],[.1,"top 10%"]].map(([p,l],j)=>{const k=model.q(p),x=xs(k);return `<line class="mk" x1="${x}" x2="${x}" y1="${T}" y2="${H-B}"/><text class="mkt" x="${x>W*.7?x-4:x+4}" text-anchor="${x>W*.7?"end":"start"}" y="${T+10+j*15}">${l}: ${kg(base*k*M)}</text>`}).join("");
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="How often each weight shows up for ${esc(m.n)}"><line class="ax" x1="${L}" x2="${W-R}" y1="${H-B}" y2="${H-B}"/><path class="area" d="${path}"/>${mk}
    ${ticks.map(k=>`<text x="${xs(k)}" y="${H-B+16}" text-anchor="${k===ticks[0]?"start":k===ticks[4]?"end":"middle"}">${kg(base*k*M)}</text>`).join("")}<text x="${L-6}" y="${T+8}" text-anchor="end">more</text><text x="${L-6}" y="${H-B}" text-anchor="end">less</text></svg>`}

function render(){
  const m=BY[String(S.min).trim().toLowerCase()],sb=Math.max(0,+S.sb||0),cap=+S.cap||0;
  if(!m){$("out").hidden=true;return}
  $("out").hidden=false;
  const M=S.mag?1.5:1,base=m.bw*(1+sb/100),model=wtModel(cap||4000);
  $("head").innerHTML=`${m.ic?`<img src="${m.ic}" alt="">`:""}<div><b>${esc(m.n)}</b><br><span>Base weight ${m.bw} kg · Size Boost ${fmt(sb,1)}% · ${cap?fmt(cap,0)+" capacity":"capacity not set (4,000 used)"}${S.mag?" · Solar Magnifier":""}</span></div>`;
  const tile=(l,v,s)=>`<div><span class="lab">${l}</span><b>${v}</b>${s?`<small>${s}</small>`:""}</div>`;
  $("sum").innerHTML=tile("Lightest possible",kg(base*WT_MIN*M),"0.75 × base × (1 + S)")+tile("Typical (half are heavier)",kg(base*model.q(.5)*M),"")+tile("Average",kg(base*model.mean*M),"")+tile("Heaviest possible",kg(base*WT_MAX*M),"15.5 × base × (1 + S)");
  $("chart").innerHTML=chart(m,base,model,M);
  $("chartNote").textContent=`The spike on the left is the ${Math.round(WT_SMALL*100)}% of minerals that always come out small. ${cap&&(cap<1856||cap>7240)?"Your capacity is outside the tested 1,856–7,240, so the shape is an estimate.":""}`;
  $("pct").innerHTML=`<table class="t"><tr><th>Heavier than</th><th>Chance</th><th>Weight</th></tr>${[.5,.25,.1,.05,.01,.001].map(p=>`<tr><td>Top ${p*100>=1?fmt(p*100,0):fmt(p*100,1)}%</td><td>${oneIn(p)}</td><td>${kg(base*model.q(p)*M)}</td></tr>`).join("")}</table>`;
  const zs=[...new Set((m.ch||[]).map(c=>baseLoc(c[0])))];
  $("zones").innerHTML=zs.length?`<table class="t"><tr><th>Zone</th><th>Heaviest</th><th>In an eruption</th></tr>${zs.map(z=>`<tr><td>${esc(z)}</td><td>${kg(base*WT_MAX*M)}</td><td>${ERUPT.has(z)?kg(base*WT_MAX*2)+(S.mag?' <span class="ev">without Magnifier</span>':""):'<span class="ev">no eruption here</span>'}</td></tr>`).join("")}</table>`:'<p class="hint">This mineral has no listed zones.</p>';
}
render();
})();
