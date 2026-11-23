const $=id=>document.getElementById(id);
const MUTN=["None","Silver","Gold","Diamond","Granite","Overclocked","Festive","Sunforged","Prismatic"];
const STATS=["Luck","Capacity","Size Boost","Modifier Boost","Sell Boost","Dig Strength","Dig Speed","Shake Strength","Shake Speed","Walk Speed","Inventory Size","Toughness"];
const PCT=new Set(["Size Boost","Modifier Boost","Sell Boost","Dig Speed","Shake Speed"]);
const CONSOPT=[["none","None"],["mine","As in the Stat Calculator"],["all","Every potion and consumable"]];
let S={w:{Luck:1,Capacity:.6},cons:"none",muts:MUTN.filter(m=>m!=="Festive"),perfect:true,streak:true,sun:true,nomad:true,night:false,owned:false,tools:true,trinket:true,museum:true};
try{Object.assign(S,JSON.parse(localStorage.getItem("pt-buildmaker")||"{}"))}catch(e){}
const save=()=>{try{localStorage.setItem("pt-buildmaker",JSON.stringify(S))}catch(e){}};
const r1=v=>Math.round(Math.min(5,Math.max(0,+v||0))*10)/10;
// ---- form ----
$("weights").innerHTML=STATS.map(s=>`<label class="wt" data-row="${s}"><span>${s}</span><input type="range" min="0" max="5" step="0.1" data-w="${s}" aria-label="${s} weight"><input type="number" class="wn" min="0" max="5" step="0.1" inputmode="decimal" data-w="${s}" aria-label="${s} weight, exact"></label>`).join("");
function drawW(skip){STATS.forEach(s=>{const v=r1(S.w[s]);document.querySelectorAll(`[data-w="${s}"]`).forEach(i=>{if(i!==skip)i.value=i.type==="number"?v.toFixed(1):v});document.querySelector(`[data-row="${s}"]`).classList.toggle("off",!(v>0))})}
$("weights").addEventListener("input",e=>{const t=e.target.closest("[data-w]");if(!t)return;S.w[t.dataset.w]=r1(t.value);save();drawW(t)});
$("weights").addEventListener("change",e=>{const t=e.target.closest("[data-w]");if(t)drawW()});
const setW=o=>{S.w=o;save();drawW()};
$("wLuck").onclick=()=>setW({Luck:1});$("wRare").onclick=()=>setW({Luck:1,Capacity:.6});$("wClear").onclick=()=>setW({});
function drawForm(){
  $("cons").innerHTML=CONSOPT.map(([k,l])=>`<button type="button" class="chip" data-c="${k}" aria-pressed="${S.cons===k}">${l}</button>`).join("");
  $("consTxt").textContent=S.cons==="all"?"Every potion and consumable counts as active at once, including the limited event ones.":S.cons==="mine"?"Uses the potions and consumables you've turned on in the Stat Calculator.":"No potions or consumables: the build is worked out on gear, museum and your lasting boosts only.";
  $("muts").innerHTML=MUTN.map(m=>`<button type="button" class="chip" data-m="${m}" aria-pressed="${S.muts.includes(m)}">${m}</button>`).join("");
  ["perfect","streak","sun","nomad","night","owned","tools","trinket","museum"].forEach(k=>$(k).checked=!!S[k]);$("streak").disabled=!S.perfect;
  const off=[!S.perfect&&"no perfect digs",S.perfect&&!S.streak&&"no full streak",!S.sun&&"no Sun Blessing",!S.nomad&&"Nomad not stacked",S.night?"night":"day"].filter(Boolean);
  $("asSum").textContent="Assuming: "+off.join(", ")}
document.addEventListener("click",e=>{const c=e.target.closest("[data-c]");if(c){S.cons=c.dataset.c;save();drawForm();return}
  const m=e.target.closest("[data-m]");if(m){const n=m.dataset.m;S.muts=S.muts.includes(n)?S.muts.filter(x=>x!==n):S.muts.concat([n]);save();drawForm()}});
["perfect","streak","sun","nomad","night","owned","tools","trinket","museum"].forEach(k=>$(k).addEventListener("change",()=>{S[k]=$(k).checked;save();drawForm()}));
$("openCalc").onclick=()=>{try{window.parent.ptOpenTool("calc")}catch(e){}};
// ---- scoring: weight × log(1 + stat) for every weighted stat, so doubling a stat on weight 2 counts twice as much as on weight 1 ----
const val=(t,s)=>Math.log(1+Math.max(0,+t[s]||0));
const scoreOf=(t,W)=>W.reduce((a,[s,w])=>a+w*val(t,s),0);
// ---- search ----
let LAST=null;
$("run").onclick=async()=>{const W=STATS.filter(s=>r1(S.w[s])>0).map(s=>[s,r1(S.w[s])]);
  if(!W.length){ptToast("Give at least one stat a weight above 0");return}
  if(!S.muts.length){ptToast("Pick at least one mutation");return}
  const btn=$("run");btn.disabled=true;$("prog").textContent="Loading the Stat Calculator…";
  let cw=null;try{cw=await window.parent.ptCalcWin()}catch(e){}
  if(!cw||!cw.ptFindBuild){btn.disabled=false;$("prog").textContent="";ptToast("Couldn't load the Stat Calculator");return}
  const R=await cw.ptFindBuild({muts:S.muts,tools:S.tools,trinket:S.trinket,museum:S.museum,owned:S.owned,perfect:S.perfect,streak:S.streak,sun:S.sun,nomad:S.nomad,night:S.night,cons:S.cons,fresh:true,useful:W.map(x=>x[0])},t=>scoreOf(t,W),(i,n)=>$("prog").textContent=`Searching… ${i+1} of ${n}`);
  btn.disabled=false;$("prog").textContent="";LAST={R,W,cw,cons:S.cons};showRes()};
const fv=(s,v)=>PCT.has(s)?fmt(v,v<10?1:0)+"%":fmt(v,Math.abs(v)<10?2:0);
let IMGURL="";
async function showRes(){const L=LAST;if(!L){$("resCard").hidden=true;return}$("resCard").hidden=false;const {R,cw,W}=L;const t=R.tot;
  const wOf=s=>(W.find(x=>x[0]===s)||[,0])[1];
  const ws=STATS.filter(s=>wOf(s)>0),rest=STATS.filter(s=>!(wOf(s)>0)&&Math.abs(+t[s]||0)>1e-9);
  const tile=s=>`<div><span class="lab">${s}${wOf(s)>0?` · ${wOf(s).toFixed(1)}`:""}</span><b>${fv(s,+t[s]||0)}</b></div>`;
  $("res").innerHTML=`<p class="hint">Weights: ${esc(wTxt())} · Consumables: ${esc((CONSOPT.find(x=>x[0]===L.cons)||[,""])[1])}</p>
    <div class="sum">${ws.map(tile).join("")}</div>
    <div class="bimg" id="bimg"><span class="hint">Drawing the build…</span></div>
    ${rest.length?`<details class="own"><summary><b>Every other stat</b></summary><div class="sum">${rest.map(tile).join("")}</div></details>`:""}
    ${cw.ptWhyHTML?cw.ptWhyHTML(R):""}
    <div class="acts" style="margin-top:12px"><button type="button" class="btn pri" id="toSheet">Save as build sheet</button><button type="button" class="btn" id="saveImg">Save as image</button><button type="button" class="btn" id="share">Share link</button><button type="button" class="btn" id="use">Use in Stat Calculator</button><button type="button" class="btn" id="csv">Download as spreadsheet</button></div>`;
  let blob=null;try{blob=cw.ptBuildImage?await cw.ptBuildImage(R.st,"Build Maker build"):null}catch(e){console.error(e)}
  if(LAST!==L)return;L.blob=blob;if(IMGURL)URL.revokeObjectURL(IMGURL);IMGURL=blob?URL.createObjectURL(blob):"";
  const gear=[R.st.pan,R.st.shovel,R.st.trinket].concat(Object.values(R.st.slots||{}).map(v=>v&&v.n)).filter(Boolean);
  $("bimg").innerHTML=blob?`<img src="${IMGURL}" alt="${esc("Build: "+gear.join(", "))}">`:'<span class="hint">Couldn\'t draw the build picture.</span>'}
const wTxt=()=>LAST.W.map(([s,w])=>`${s} ${w.toFixed(1)}`).join(", ");
function sheetText(){return LAST.cw.ptBuildTextOf(LAST.R.st).replace(/^(Title:[^\n]*\n)/,`$1Subtitle: Build Maker: ${wTxt()}\n`)}
document.addEventListener("click",async e=>{if(!LAST)return;
  if(e.target.closest("#toSheet")){try{window.parent.ptCallTool("builds","ptAddBuildText",sheetText());ptToast("Saved to Build Sheets")}catch(err){ptToast("Couldn't reach Build Sheets")}return}
  if(e.target.closest("#share")){const url=await ptCopyShare(sheetText());ptToast(url?"Share link copied":"Couldn't copy, your browser blocked it");return}
  if(e.target.closest("#csv")){const L=LAST;const head=[["Goal","Build Maker"],["Weights",wTxt()],["Consumables",(CONSOPT.find(x=>x[0]===L.cons)||[,""])[1]],[]];
    STATS.forEach(s=>head.push([s,Math.round((+L.R.tot[s]||0)*100)/100]));head.push([]);
    const st=L.R.st,it=v=>v&&v.n?v.n+(v.m&&v.m!=="None"?` (${v.m})`:""):"";head.push(["Part","Build"],["Pan",[st.pan,st.panEn].filter(Boolean).join(" · ")],["Shovel",[st.shovel,st.shEn].filter(Boolean).join(" · ")],["Trinket",st.trinket||""]);
    L.cw.ptSlotDefs().forEach(([k,l])=>head.push([l,it((st.slots||{})[k])]));
    if(L.R.museum){head.push([],["Museum","Mineral","Modifier"]);L.cw.ptMusRows().forEach(([r])=>((st.museumBoard||{})[r]||[]).forEach((x,i)=>{if(x&&x.m)head.push([`${r} ${i+1}`,x.m,x.u||""])}))}
    if(L.R.assume){head.push([],["Assumes"]);L.R.assume.forEach(a=>head.push([a]))}
    if(await ptDownloadCSV("Build Maker",head))ptToast("Download started");return}
  if(e.target.closest("#saveImg")){const b=LAST.blob;if(!b){ptToast("The picture isn't ready yet");return}ptSaveImg("Build Maker build",async()=>b);return}
  if(e.target.closest("#use")){LAST.cw.ptUseBuild(LAST.R.st,LAST.R.museum);ptToast("Loaded into the Stat Calculator")}});
drawW();drawForm();
(async()=>{try{const cw=await window.parent.ptCalcWin();if(cw&&cw.ptWhyCSS)document.head.insertAdjacentHTML("beforeend",`<style>${cw.ptWhyCSS}</style>`)}catch(e){}})();
document.addEventListener("click",e=>{const o=e.target.closest("[data-opentool]");if(o){try{window.parent.ptOpenTool(o.dataset.opentool)}catch(err){}}});
