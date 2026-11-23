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
  const R=await cw.ptFindBuild({muts:S.muts,tools:S.tools,trinket:S.trinket,museum:S.museum,owned:S.owned,perfect:S.perfect,streak:S.streak,sun:S.sun,nomad:S.nomad,night:S.night,cons:S.cons,useful:W.map(x=>x[0])},t=>scoreOf(t,W),(i,n)=>$("prog").textContent=`Searching… ${i+1} of ${n}`);
  btn.disabled=false;$("prog").textContent="";LAST={R,W,cw,cons:S.cons};showRes()};
const fv=(s,v)=>PCT.has(s)?fmt(v,v<10?1:0)+"%":fmt(v,Math.abs(v)<10?2:0);
function showRes(){const L=LAST;if(!L){$("resCard").hidden=true;return}$("resCard").hidden=false;const {R,cw,W}=L;const st=R.st,t=R.tot,b=R.base,bt=R.before;
  const wOf=s=>(W.find(x=>x[0]===s)||[,0])[1];
  const g=Math.exp(R.sc-R.beforeSc)-1;
  const stRows=STATS.map(s=>{const a=+t[s]||0,o=+bt[s]||0,ch=o?a/o-1:(a?1:0),w=wOf(s);const cls=Math.abs(a-o)<1e-9?"":a>o?"up":"dn";
    return `<tr class="${w>0?"":"w0"}"><td>${s}</td><td>${w>0?w.toFixed(1):"—"}</td><td>${fv(s,a)}</td><td>${fv(s,o)}</td><td class="${cls}">${cls?(o?(ch>0?"+":"")+fmt(ch*100,Math.abs(ch)<.1?1:0)+"%":"new"):"="}</td></tr>`}).join("");
  const mut=v=>v&&v.m&&v.m!=="None"?` (${esc(v.m)})`:"";const it=v=>v&&v.n?esc(v.n)+mut(v)+(v.l==="6"&&(v.q??100)===100?"":` · ${v.l==="5"?"5":"6"}★ ${v.q??100}%`):"";
  const row=(lab,now,was)=>`<tr class="${now===was?"":"chg"}"><td>${lab}</td><td>${now||"—"}</td><td class="was">${now===was?"":(was||"—")}</td></tr>`;
  const tl=(p,e)=>esc(p||"")+(e?` · ${esc(e)}`:"");
  const rows=[row("Pan",tl(st.pan,st.panEn),tl(b.pan,b.panEn)),row("Shovel",tl(st.shovel,st.shEn),tl(b.shovel,b.shEn)),row("Trinket",esc(st.trinket||""),esc(b.trinket||""))].concat(cw.ptSlotDefs().map(([k,l])=>row(l,it(st.slots[k]),it(b.slots[k]))));
  let mus="";if(R.museum){const bd=st.museumBoard||{};mus=`<h3 class="sec">Museum</h3><div class="mus">${cw.ptMusRows().map(([r])=>`<div><span class="lab" style="color:${rc(r)}">${r}</span> ${(bd[r]||[]).filter(Boolean).map(x=>`${esc(x.m)}${x.u&&x.u!=="None"?` <span class="hint">(${esc(x.u)})</span>`:""}`).join(", ")||"—"}</div>`).join("")}</div>`}
  $("res").innerHTML=`<div class="sum"><div><span class="lab">Overall</span><b class="${g>0.0005?"pos":""}">${g>0.0005?(g<1?"+"+fmt(g*100,g<.1?1:0)+"%":g+1>=1000?"over ×1,000":"×"+fmt(g+1,g+1<10?2:0)):"no better build found"}</b><span class="hint">weighted, vs your current build</span></div></div>
    <table class="stt"><tr><th>Stat</th><th>Weight</th><th>Build</th><th>Now</th><th>Change</th></tr>${stRows}</table>
    <table class="bt"><tr><th></th><th>Best build</th><th>Now</th></tr>${rows.join("")}</table>${mus}
    ${cw.ptWhyHTML?cw.ptWhyHTML(R):""}
    <div class="acts" style="margin-top:12px"><button type="button" class="btn pri" id="toSheet">Save as build sheet</button><button type="button" class="btn" id="share">Share link</button><button type="button" class="btn" id="use">Use in Stat Calculator</button><button type="button" class="btn" id="csv">Download as spreadsheet</button></div>`}
const wTxt=()=>LAST.W.map(([s,w])=>`${s} ${w.toFixed(1)}`).join(", ");
function sheetText(){return LAST.cw.ptBuildTextOf(LAST.R.st).replace(/^(Title:[^\n]*\n)/,`$1Subtitle: Build Maker: ${wTxt()}\n`)}
document.addEventListener("click",async e=>{if(!LAST)return;
  if(e.target.closest("#toSheet")){try{window.parent.ptCallTool("builds","ptAddBuildText",sheetText());ptToast("Saved to Build Sheets")}catch(err){ptToast("Couldn't reach Build Sheets")}return}
  if(e.target.closest("#share")){const url=await ptCopyShare(sheetText());ptToast(url?"Share link copied":"Couldn't copy, your browser blocked it");return}
  if(e.target.closest("#csv")){const L=LAST;const head=[["Goal","Build Maker"],["Weights",wTxt()],["Consumables",(CONSOPT.find(x=>x[0]===L.cons)||[,""])[1]],[]];
    STATS.forEach(s=>head.push([s,Math.round((+L.R.tot[s]||0)*100)/100,"now",Math.round((+L.R.before[s]||0)*100)/100]));head.push([]);
    if(await ptDownloadCSV("Build Maker",L.cw.ptFinderRows(L.R,head)))ptToast("Download started");return}
  if(e.target.closest("#use")){LAST.cw.ptUseBuild(LAST.R.st,LAST.R.museum);ptToast("Loaded into the Stat Calculator")}});
drawW();drawForm();
(async()=>{try{const cw=await window.parent.ptCalcWin();if(cw&&cw.ptWhyCSS)document.head.insertAdjacentHTML("beforeend",`<style>${cw.ptWhyCSS}</style>`)}catch(e){}})();
document.addEventListener("click",e=>{const o=e.target.closest("[data-opentool]");if(o){try{window.parent.ptOpenTool(o.dataset.opentool)}catch(err){}}});
