
const $=id=>document.getElementById(id);
const U=P.gear.upg||{};const SL=P.gear.sluices.filter(s=>U[s.name]);
let S={sl:SL[0]?SL[0].name:"",t:{}};try{Object.assign(S,JSON.parse(localStorage.getItem("psp-s")||"{}"))}catch(e){}
if(!U[S.sl])S.sl=SL[0].name;
const save=()=>{try{localStorage.setItem("psp-s",JSON.stringify(S))}catch(e){}};
const n=v=>parseFloat(String(v).replace(/[$,+]/g,""))||0;
// "+100 / +1,000" -> per tier 100, max tiers 10; "+1" -> a perk
function parseRow([stat,cost,mat,pc,gain]){const g=String(gain).split("/").map(x=>n(x));const perk=g.length<2;const per=g[0],max=perk?1:Math.max(1,Math.round(g[1]/g[0]));
  return {stat,cost:n(cost),mat,pc:parseInt(pc)||1,per,max,perk}}
function rows(){return U[S.sl].rows.map(parseRow)}
const key=r=>S.sl+"|"+r.stat;
function used(){return rows().reduce((s,r)=>s+(S.t[key(r)]||0)*r.pc,0)}
$("sl").innerHTML=SL.map(s=>`<option${s.name===S.sl?" selected":""}>${esc(s.name)}</option>`).join("");
function render(){const R=rows(),pts=U[S.sl].points,u=used();
  $("pts").className="pts"+(u>pts?" over":"");$("pts").innerHTML=`${u} / ${pts} <small>points used</small>`;
  $("ups").innerHTML=R.map((r,i)=>{const t=S.t[key(r)]||0;const m=MIN[r.mat.toLowerCase()];const left=pts-u+t*r.pc;const maxNow=Math.min(r.max,Math.floor(left/r.pc));
    return `<div class="up"><div><b>${esc(r.stat)}</b><span class="c">$${fmt(r.cost,0)} per tier · ${r.pc} pt${r.pc>1?"s":""}${r.perk?"":" per tier"}</span><br><span class="mat" data-mineral="${esc(r.mat)}" title="Ctrl+click to open ${esc(r.mat)}">${m&&m.ic?`<img src="${m.ic}" alt="">`:""}${esc(r.mat)}</span></div>
      ${r.perk?`<label class="sw rng"><input type="checkbox" data-perk="${i}"${t?" checked":""}${!t&&maxNow<1?" disabled":""}> ${t?"Unlocked":"Unlock"}${!t&&maxNow<1?" (not enough points)":""}</label><div class="gain">${t?"on":""}</div>`
      :`<div class="rng"><input type="range" min="0" max="${r.max}" value="${t}" data-tier="${i}" aria-label="${esc(r.stat)} tiers"><output>${t} / ${r.max}</output></div><div class="gain">${t?"+"+fmt(r.per*t,2):""}</div>`}</div>`}).join("");
  const s=P.gear.sluices.find(x=>x.name===S.sl);const base={Luck:n(s.luck),Capacity:n(s.capacity),Efficiency:n(s.efficiency),Toughness:n(s.toughness),"Size Boost":0};
  const add={};R.forEach(r=>{if(!r.perk)add[r.stat]=(add[r.stat]||0)+r.per*(S.t[key(r)]||0)});
  $("stats").innerHTML=Object.keys(base).filter(k=>base[k]||add[k]).map(k=>`<div class="st"><span class="lab">${k}</span><b>${fmt(base[k]+(add[k]||0),2)}</b>${add[k]?`<small>+${fmt(add[k],2)} from upgrades</small>`:`<small style="color:var(--muted)">no upgrades</small>`}</div>`).join("");
  $("perks").innerHTML=R.filter(r=>r.perk&&S.t[key(r)]).map(r=>`<span>${esc(r.stat)}</span>`).join("");
  let cash=0;const mats={};R.forEach(r=>{const t=S.t[key(r)]||0;if(!t)return;cash+=r.cost*t;mats[r.mat]=(mats[r.mat]||0)+t});
  $("costs").innerHTML=`<li><span>Cash</span><b class="mono">$${fmt(cash,0)}</b></li>`+Object.entries(mats).map(([k,v])=>`<li><span data-mineral="${esc(k)}">${esc(k)}</span><span class="mono">${v} tier${v>1?"s":""}</span></li>`).join("")+(cash?"":'<li class="hint">Nothing upgraded yet.</li>');
}
document.addEventListener("input",e=>{const t=e.target;if(t.dataset.tier==null)return;const r=rows()[+t.dataset.tier];const pts=U[S.sl].points;const other=used()-(S.t[key(r)]||0)*r.pc;
  let v=+t.value;while(v>0&&other+v*r.pc>pts)v--;t.value=v;S.t[key(r)]=v;save();render();const nt=document.querySelector(`[data-tier="${t.dataset.tier}"]`);nt&&nt.focus()});
document.addEventListener("change",e=>{const t=e.target;if(t.dataset.perk!=null){const r=rows()[+t.dataset.perk];S.t[key(r)]=t.checked?1:0;save();render();const nt=document.querySelector(`[data-perk="${t.dataset.perk}"]`);nt&&nt.focus()}else if(t.id==="sl"){S.sl=t.value;save();render()}});
$("reset").onclick=()=>{rows().forEach(r=>delete S.t[key(r)]);save();render()};
render();
