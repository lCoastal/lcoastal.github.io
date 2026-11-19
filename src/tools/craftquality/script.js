(()=>{
const $=id=>document.getElementById(id);
const C=P.craft||{rec:{},mods:{None:1}};
const REC=C.rec, MODS=C.mods;
const ITEMS=Object.keys(REC).sort((a,b)=>a.localeCompare(b));
const MODLIST=Object.entries(MODS).sort((a,b)=>a[1]-b[1]||a[0].localeCompare(b[0])).map(([k])=>k); // weakest first (None=1)
const BW={},MIC={},DR={};P.mins.forEach(m=>{if(m.bw)BW[m.n]=m.bw;if(m.ic)MIC[m.n]=m.ic;
  const c=(m.ch||[]).map(x=>parseFloat(String(x[1]).replace(/,/g,""))/100).filter(v=>v>0);if(c.length)DR[m.n]=Math.max(...c)});
const EQ={};(P.equip||[]).forEach(x=>{EQ[x.n]=x});
const eqImg=n=>{const x=EQ[n];return x&&x.img?(P.eimg||{})[x.img]||"":""};
const M=u=>MODS[u]||1;
const r4=v=>Math.round(v*10000)/10000, r2=v=>Math.round(v*100)/100;

let S={item:ITEMS[0],sb:"",ores:{}};
try{Object.assign(S,JSON.parse(localStorage.getItem("c5-s")||"{}"))}catch(e){}
if(!REC[S.item])S.item=ITEMS[0];
if(!S.ores||typeof S.ores!=="object")S.ores={};
const youPush=ptYouLink(S,{sb:"sb"},()=>{buildMats();refresh()});
const save=()=>{try{localStorage.setItem("c5-s",JSON.stringify(S))}catch(e){}youPush()};

function ensureOres(){const r=REC[S.item]||[];const o=S.ores[S.item]=S.ores[S.item]||{};
  r.forEach(([mat,n])=>{const a=o[mat]=o[mat]||[];while(a.length<n)a.push({w:"",u:"None"});if(a.length>n)a.length=n});
  Object.keys(o).forEach(k=>{if(!r.some(x=>x[0]===k))delete o[k]});
  return o}
const maxW=mat=>{const bw=BW[mat];if(!bw)return null;const sb=+S.sb||0;return 15.5*bw*(1+sb/100)};
const w5=(mw,qs,m)=>(mw+4*qs)/m; // weight one ore needs to hit Q=5 at modifier multiplier m

function compute(){const r=REC[S.item]||[];const o=ensureOres();
  let totalN=0,sumD=0,perMat=[];
  for(const [mat,n,mw,qs] of r){totalN+=n;const a=o[mat]||[];let mSum=0,filled=0,ores=[];
    for(let i=0;i<n;i++){const e=a[i]||{w:"",u:"None"};const w=+e.w||0,mm=M(e.u);
      if(w>0){const d=(w*mm-mw)/qs;mSum+=d;filled++;ores.push({w,u:e.u,mm,Q:1+d});}
      else ores.push({w:0,u:e.u,mm,Q:null});}
    sumD+=mSum;perMat.push({mat,n,mw,qs,filled,ores,mSum,bw:BW[mat],mx:maxW(mat)});}
  const avgQ=totalN>0?1+sumD/totalN:1;
  const stars=Math.max(1,Math.min(5,Math.floor(avgQ)));
  const remaining=Math.max(0,4*totalN-sumD);
  return {r,totalN,sumD,avgQ,stars,remaining,perMat}}

// Auto-fill for a target star rating. Every ore of a material gets the same size (weight ÷ base weight);
// rarer materials are kept smaller since you have fewer to pick from. Modifiers you already chose are kept.
const PAD=0.05; // aim this much above the target average Q
const ceilTo=(v,d)=>{const f=10**d;return Math.ceil(v*f-1e-9)/f};
function plan(T){const r=REC[S.item]||[];const o=ensureOres();
  const pmax=Math.max(0,...r.map(([m])=>DR[m]||0));
  const mats=r.map(([mat,n,mw,qs])=>{const bw=BW[mat]||1,p=DR[mat];
    const f=p&&pmax?1/(1+0.15*Math.log10(pmax/p)):1;
    return {mat,n,mw,qs,bw,f,mx:maxW(mat),ms:o[mat].map(e=>M(e.u)),floor:mw>0?mw:0.01}});
  const N=mats.reduce((t,m)=>t+m.n,0);
  const need=(T-1+(T>1?PAD:0))*N;
  const wOf=(m,k,cap)=>{let w=Math.max(m.floor,k*m.bw*m.f);if(cap&&m.mx)w=Math.min(w,Math.max(m.floor,m.mx));return w};
  const tot=(k,cap)=>mats.reduce((t,m)=>{const w=wOf(m,k,cap);return t+m.ms.reduce((u,mm)=>u+(w*mm-m.mw)/m.qs,0)},0);
  const solve=cap=>{let lo=0,hi=1;while(tot(hi,cap)<need&&hi<1e9)hi*=2;if(tot(hi,cap)<need)return null;
    for(let i=0;i<80;i++){const md=(lo+hi)/2;if(tot(md,cap)>=need)hi=md;else lo=md}return hi};
  let k=solve(true),over=false;if(k==null){k=solve(false);over=true}
  if(k==null)return null;
  const out=mats.map(m=>{const w=wOf(m,k,!over);const d=w<1?3:2;return {mat:m.mat,w:ceilTo(w,d),mx:m.mx}});
  out.forEach(x=>o[x.mat].forEach(e=>{e.w=String(x.w)}));
  return {T,over:over&&out.some(x=>x.mx&&x.w>x.mx+1e-9)}}
let lastPlan=null;

const starStr=s=>'<span class="stars">'+'&#9733;'.repeat(s)+'<span class="off">'+'&#9733;'.repeat(5-s)+'</span></span>';

function buildMats(){ensureOres();const r=REC[S.item]||[];const o=S.ores[S.item];
  const opt=cur=>MODLIST.map(m=>`<option value="${esc(m)}"${m===cur?" selected":""}>${esc(m)}${MODS[m]!==1?` ×${MODS[m]}`:""}</option>`).join("");
  $("mats").innerHTML=r.map(([mat,n,mw,qs])=>{const a=o[mat];const bw=BW[mat],mx=maxW(mat);
    const rows=a.map((e,i)=>`<div class="orow"><input type="number" class="ow" data-mat="${esc(mat)}" data-i="${i}" min="0" step="any" value="${e.w!==""&&e.w!=null?esc(String(e.w)):""}" placeholder="kg" inputmode="decimal"><select class="ou" data-mat="${esc(mat)}" data-i="${i}">${opt(e.u||"None")}</select><span class="oq" id="q-${esc(mat)}-${i}"></span></div>`).join("");
    return `<section class="card mat"><div class="mhd"><h2>${MIC[mat]?`<img class="mic" src="${MIC[mat]}" alt="">`:""}${esc(mat)} <span class="xn">&times;${n}</span></h2><div class="mmeta">step ${fmt(qs,2)} kg${mw>0?` &middot; min ${fmt(mw,2)} kg`:""}${bw?` &middot; base ${bw} kg`:""}${mx?` &middot; est. max ~${fmt(mx,1)} kg`:""}</div></div>
      ${n>1?`<div class="fillall"><input type="number" class="faw" data-mat="${esc(mat)}" min="0" step="any" placeholder="kg" inputmode="decimal"><select class="fau" data-mat="${esc(mat)}">${opt("None")}</select><button type="button" class="fab" data-mat="${esc(mat)}">Fill all ${n}</button></div>`:""}
      <div class="orows">${rows}</div></section>`}).join("");
}

function refresh(){const o=compute();
  const ex=EQ[S.item],im=eqImg(S.item);
  $("rhead").innerHTML=`${im?`<img class="eic" src="${im}" alt="">`:""}<span><b${ex?` style="color:${rc(ex.r)}"`:""}>${esc(S.item)}</b><small>${ex?esc((ex.r+" "+(ex.slot||"")).trim())+" &middot; ":""}${o.totalN} ore${o.totalN===1?"":"s"} total</small></span>`;
  // per-ore Q badges
  o.perMat.forEach(pm=>pm.ores.forEach((or,i)=>{const el=$(`q-${pm.mat}-${i}`);if(!el)return;
    if(or.Q==null){el.className="oq";el.textContent="";return}
    const q=or.Q;el.textContent=(q>=5?"5★-ready":"Q "+r2(q));el.className="oq "+(q>=5?"good":q>=4?"ok":q>=1?"low":"bad")}));
  // verdict
  const totEntered=o.perMat.reduce((s,p)=>s+p.filled,0);
  let body;
  if(o.remaining<=1e-9){body=`<div class="v5"><b>${starStr(5)} Makes 5-star</b><span>Your ores average Q ${fmt(o.avgQ,2)} — at or above the 5.0 needed. ${totEntered<o.totalN?`(Assuming the ${o.totalN-totEntered} unfilled ore${o.totalN-totEntered===1?"":"s"} are at least minimum weight.)`:""}</span></div>`;}
  else{
    // lightest single ore that closes the gap: a Perfect ore of weight (R·QS + MW) / 24, pick the material needing the least
    const mP=MODS.Perfect||24;let bp=null;
    o.perMat.forEach(pm=>{const w=(o.remaining*pm.qs+pm.mw)/mP;const feasible=pm.mx?w<=pm.mx+1e-9:true;if(!bp||w<bp.w)bp={mat:pm.mat,w,feasible,mx:pm.mx};});
    let tip=bp?`Lightest fix: one <b>Perfect ${esc(bp.mat)}</b> ore of about <b>${fmt(bp.w,bp.w<1?3:2)} kg</b> covers the whole gap (Perfect counts as ×${mP} weight).`:"";
    if(bp&&bp.feasible===false)tip+=` <span class="warn">That's above the estimated max weight (~${fmt(bp.mx,1)} kg, not confirmed), so it might not be reachable. Spreading the gap across several ores is safer.</span>`;
    body=`<div class="vlow"><b>${starStr(o.stars)} ${o.stars}-star right now</b><span>Average quality Q ${fmt(o.avgQ,2)} — 5&#9733; needs 5.00. You're short <b>${fmt(o.remaining,2)}</b> total quality across ${o.totalN} ores.</span><p class="tip">${tip}${bp&&bp.feasible===false?"":" Or spread it over several ores — heavier or better-modified ores make up for lighter ones."}</p></div>`;
  }
  const pk=`<div class="pick5"><span>Auto-fill for</span><span class="sp" role="group" aria-label="Fill weights for a star rating">${[1,2,3,4,5].map(i=>`<button type="button" data-t="${i}"${lastPlan&&i<=lastPlan.T?' class="on"':""} aria-label="${i} star${i>1?"s":""}" title="Fill the lightest weights for ${i}&#9733;">&#9733;</button>`).join("")}</span>${lastPlan?`<small>Filled for ${lastPlan.T}&#9733; with a little to spare, using your modifiers. Heavier base-weight ores carry more, rarer ores are kept lighter.${lastPlan.over?` <span class="warn">Some weights are above the estimated max, so they might not be reachable.</span>`:""}</small>`:`<small>Click a star to fill in weights that reach it.</small>`}</div>`;
  $("verdict").innerHTML=body+pk;
}

$("verdict").addEventListener("click",e=>{const b=e.target.closest(".sp button");if(!b)return;
  const res=plan(+b.dataset.t);if(!res)return;lastPlan=res;save();buildMats();refresh()});
$("mats").addEventListener("input",()=>{lastPlan=null},true);

// item picker
makeAC({inp:$("item"),items:ITEMS.map(n=>{const x=EQ[n];return {n,tag:x?(x.r+" "+(x.slot||"")).trim():"",ic:eqImg(n),col:x?rc(x.r):""}}),
  cur:()=>S.item,icon:()=>eqImg(S.item),pick:x=>{S.item=x.n;lastPlan=null;save();buildMats();refresh()}});
$("sb").value=S.sb;
$("sb").addEventListener("input",e=>{S.sb=e.target.value;lastPlan=null;save();buildMats();refresh()});

$("mats").addEventListener("input",e=>{const t=e.target;
  if(t.classList.contains("ow")){const{mat,i}=t.dataset;ensureOres();S.ores[S.item][mat][+i].w=t.value;save();refresh()}
  else if(t.classList.contains("ou")){const{mat,i}=t.dataset;ensureOres();S.ores[S.item][mat][+i].u=t.value;save();refresh()}
});
$("mats").addEventListener("change",e=>{const t=e.target;if(t.classList.contains("ou")){const{mat,i}=t.dataset;ensureOres();S.ores[S.item][mat][+i].u=t.value;save();refresh()}});
$("mats").addEventListener("click",e=>{const b=e.target.closest(".fab");if(!b)return;lastPlan=null;const mat=b.dataset.mat;const card=b.closest(".mat");
  const w=card.querySelector(".faw").value,u=card.querySelector(".fau").value;ensureOres();
  S.ores[S.item][mat].forEach(o=>{o.w=w;o.u=u});save();buildMats();refresh()});

buildMats();refresh();
})();
