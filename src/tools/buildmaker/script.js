const $=id=>document.getElementById(id);
const MUTN=["None","Silver","Gold","Diamond","Granite","Overclocked","Festive","Sunforged","Prismatic"];
const STATS=["Luck","Capacity","Size Boost","Modifier Boost","Sell Boost","Dig Strength","Dig Speed","Shake Strength","Shake Speed","Walk Speed","Inventory Size","Toughness"];
const PCT=new Set(["Size Boost","Modifier Boost","Sell Boost","Dig Speed","Shake Speed"]);
const CONSOPT=[["none","None"],["pick","Pick my own"],["mine","As in the Stat Calculator"],["all","Every potion and consumable"]];
let S={w:{Luck:1,Capacity:.6},cons:"none",muts:MUTN.filter(m=>m!=="Festive"),perfect:true,streak:true,sun:true,nomad:true,night:false,evMeteor:false,evWeather:false,pickPots:[],pickCons:[],owned:false,tools:true,trinket:true,museum:true};
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
  drawPick();
  $("consTxt").textContent=S.cons==="pick"?"Tick the potions and consumables you'll have on. Only those count.":S.cons==="all"?"Every potion and consumable counts as active at once, including the limited event ones.":S.cons==="mine"?"Uses the potions and consumables you've turned on in the Stat Calculator.":"No potions or consumables: the build is worked out on gear, museum and your lasting boosts only.";
  $("muts").innerHTML=MUTN.map(m=>`<button type="button" class="chip" data-m="${m}" aria-pressed="${S.muts.includes(m)}">${m}</button>`).join("");
  ["perfect","streak","sun","nomad","night","owned","tools","trinket","museum","evMeteor","evWeather"].forEach(k=>$(k).checked=!!S[k]);$("streak").disabled=!S.perfect;
  const off=[!S.perfect&&"no perfect digs",S.perfect&&!S.streak&&"no full streak",!S.sun&&"no Sun Blessing",!S.nomad&&"Nomad not stacked",S.night?"night":"day"].filter(Boolean);
  $("asSum").textContent="Assuming: "+off.join(", ")}
// ---- pick your own potions and consumables ----
const POTS=((P.x2||{}).potions||[]);let CONSL=[];
const isMoney=p=>/\$/.test(p.cost||"");
function drawPick(){$("consPick").hidden=S.cons!=="pick";if(S.cons!=="pick")return;
  const grp=(t,list,key)=>list.length?`<div class="pkg"><span class="lab">${t}</span>${list.map(x=>`<label class="ck"><input type="checkbox" data-pk="${key}" value="${esc(x.n)}"${S[key].includes(x.n)?" checked":""}><span><b>${esc(x.n)}</b><small>${esc(String(x.fx||"").replace(/\s*\([^)]*\)\s*$/,""))}</small></span></label>`).join("")}</div>`:"";
  $("pkList").innerHTML=grp("Potions",POTS,"pickPots")+grp("Consumables",CONSL,"pickCons");
  const n=S.pickPots.length+S.pickCons.length;$("pkCount").textContent=n?`${n} ticked`:"Nothing ticked"}
$("pkList").addEventListener("change",e=>{const t=e.target.closest("[data-pk]");if(!t)return;const k=t.dataset.pk;S[k]=t.checked?[...new Set([...S[k],t.value])]:S[k].filter(x=>x!==t.value);save();drawPick()});
$("pkAll").onclick=()=>{S.pickPots=POTS.map(p=>p.n);S.pickCons=CONSL.map(c=>c.n);save();drawPick()};
$("pkNone").onclick=()=>{S.pickPots=[];S.pickCons=[];save();drawPick()};
$("pkMoney").onclick=()=>{S.pickPots=POTS.filter(isMoney).map(p=>p.n);S.pickCons=[];save();drawPick()};
$("pkCalc").onclick=async()=>{let st=null;try{const cw=await window.parent.ptCalcWin();st=cw.ptCalcSnapshot()}catch(e){}if(!st){ptToast("Couldn't read the Stat Calculator");return}
  S.pickPots=(st.pots||[]).slice();S.pickCons=(st.cons||[]).slice();save();drawPick();ptToast("Copied from the Stat Calculator")};
(async()=>{try{const cw=await window.parent.ptCalcWin();CONSL=cw.ptConsumables?cw.ptConsumables():[];drawPick()}catch(e){}})();
document.addEventListener("click",e=>{const c=e.target.closest("[data-c]");if(c){S.cons=c.dataset.c;save();drawForm();return}
  const m=e.target.closest("[data-m]");if(m){const n=m.dataset.m;S.muts=S.muts.includes(n)?S.muts.filter(x=>x!==n):S.muts.concat([n]);save();drawForm()}});
["perfect","streak","sun","nomad","night","owned","tools","trinket","museum","evMeteor","evWeather"].forEach(k=>$(k).addEventListener("change",()=>{S[k]=$(k).checked;save();drawForm()}));
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
  const R=await cw.ptFindBuild({muts:S.muts,tools:S.tools,trinket:S.trinket,museum:S.museum,owned:S.owned,perfect:S.perfect,streak:S.streak,sun:S.sun,nomad:S.nomad,night:S.night,events:{meteor:!!S.evMeteor,weather:!!S.evWeather},cons:S.cons,pots:S.pickPots,consList:S.pickCons,fresh:true,useful:W.map(x=>x[0])},t=>scoreOf(t,W),(i,n)=>$("prog").textContent=`Searching… ${i+1} of ${n}`);
  btn.disabled=false;$("prog").textContent="";LAST={R,W,cw,cons:S.cons,picked:[...S.pickPots,...S.pickCons],ev:{meteor:!!S.evMeteor,weather:!!S.evWeather}};showRes()};
const fv=(s,v)=>PCT.has(s)?fmt(v,v<10?1:0)+"%":fmt(v,Math.abs(v)<10?2:0);
// the build laid out on the page: pan and shovel, equipment and museum, each with its picture
const IC=(k,n)=>{try{return window.parent.ptIcon(k,n)||""}catch(e){return ""}};
const EQR=Object.fromEntries(P.equip.map(e=>[e.n,e])),MNR=Object.fromEntries(P.mins.map(m=>[m.n,m]));
const pic=(src,alt)=>src?`<img src="${src}" alt="" loading="lazy">`:`<span class="noimg" aria-hidden="true">${esc((alt||"?")[0])}</span>`;
function buildHTML(st,cw){
  const tool=(lab,kind,n,en)=>`<div class="bk tool"><div class="ic">${pic(IC(kind,n),n)}</div><div><span class="lab">${lab}</span><b>${esc(n||"-")}</b>${en?`<small class="en">${esc(en)}</small>`:""}</div></div>`;
  const top=`<div class="bgrid3">${tool("Pan","Pan",st.pan,st.panEn)}${tool("Shovel","Shovel",st.shovel,st.shEn)}<div class="bk tool"><div class="ic">${st.trinket?pic(IC("Trinket",st.trinket),st.trinket):""}</div><div><span class="lab">Trinket</span><b>${esc(st.trinket||"None")}</b></div></div></div>`;
  const card=([k,l])=>{const v=(st.slots||{})[k];if(!v||!v.n)return `<div class="bk eq empty"><span class="lab">${l}</span><b>-</b></div>`;const x=EQR[v.n]||{};const col=rc(x.r||"");
    return `<div class="bk eq" style="--rc:${col}"><div class="ic">${pic(IC("Equipment",v.n),v.n)}</div><div><span class="lab">${l}</span><b style="color:${col}">${esc(v.n)}</b><small>${esc(x.r||"")}, ${v.l==="5"?"5":"6"}★${v.m&&v.m!=="None"?`, <span class="mu">${esc(v.m)}</span>`:""}${(v.q??100)!==100?`, ${v.q}%`:""}</small></div></div>`};
  const defs=cw.ptSlotDefs(),eq=`<div class="bgrid2">${defs.filter(d=>d[2]!=="Ring").map(card).join("")}</div><div class="rings">${defs.filter(d=>d[2]==="Ring").map(card).join("")}</div>`;
  let mus="";const bd=st.museumBoard;if(bd&&Object.values(bd).some(a=>(a||[]).some(x=>x&&x.m)))mus=`<h3 class="sec">Museum</h3>${ptMuseumView(bd,{empty:"Nothing here helps"})}`;
  return `${top}<h3 class="sec">Equipment</h3>${eq}${mus}`}
async function showRes(){const L=LAST;if(!L){$("resCard").hidden=true;return}$("resCard").hidden=false;const {R,cw,W}=L;const t=R.tot;
  const wOf=s=>(W.find(x=>x[0]===s)||[,0])[1];
  const ws=STATS.filter(s=>wOf(s)>0),rest=STATS.filter(s=>!(wOf(s)>0)&&Math.abs(+t[s]||0)>1e-9);
  const tile=s=>`<div><span class="lab">${s}${wOf(s)>0?`, ${wOf(s).toFixed(1)}`:""}</span><b>${fv(s,+t[s]||0)}</b></div>`;
  $("res").innerHTML=`<p class="hint">Weights: ${esc(wTxt())}, Consumables: ${esc(consTxt(L))}, Events: ${esc([L.ev.meteor&&"Meteor Shower 2×",L.ev.weather&&"weather 1.5×"].filter(Boolean).join(", ")||"none")}</p>
    <div class="sum">${ws.map(tile).join("")}</div>
    ${buildHTML(R.st,cw)}
    ${rest.length?`<details class="own"><summary><b>Every other stat</b></summary><div class="sum">${rest.map(tile).join("")}</div></details>`:""}
    ${cw.ptWhyHTML?cw.ptWhyHTML(R):""}
    <div class="acts" style="margin-top:12px"><button type="button" class="btn pri" id="toSheet">Save as build sheet</button><button type="button" class="btn" id="saveImg">Save as image</button><button type="button" class="btn" id="share">Share link</button><button type="button" class="btn" id="use">Use in Stat Calculator</button><button type="button" class="btn" id="csv">Download as spreadsheet</button></div>`}
const consTxt=L=>L.cons==="pick"?(L.picked.length?L.picked.join(", "):"none ticked"):(CONSOPT.find(x=>x[0]===L.cons)||[,""])[1];
const wTxt=()=>LAST.W.map(([s,w])=>`${s} ${w.toFixed(1)}`).join(", ");
function sheetText(){return LAST.cw.ptBuildTextOf(LAST.R.st).replace(/^(Title:[^\n]*\n)/,`$1Subtitle: Build Maker: ${wTxt()}\n`)}
document.addEventListener("click",async e=>{if(!LAST)return;
  if(e.target.closest("#toSheet")){try{window.parent.ptCallTool("builds","ptAddBuildText",sheetText());ptToast("Saved to Build Sheets")}catch(err){ptToast("Couldn't reach Build Sheets")}return}
  if(e.target.closest("#share")){const url=await ptCopyShare(sheetText());ptToast(url?"Share link copied":"Couldn't copy, your browser blocked it");return}
  if(e.target.closest("#csv")){const L=LAST;const head=[["Goal","Build Maker"],["Weights",wTxt()],["Consumables",consTxt(L)],["Events",[L.ev.meteor&&"Meteor Shower 2×",L.ev.weather&&"Weather 1.5×"].filter(Boolean).join(", ")||"none"],[]];
    STATS.forEach(s=>head.push([s,Math.round((+L.R.tot[s]||0)*100)/100]));head.push([]);
    const st=L.R.st,it=v=>v&&v.n?v.n+(v.m&&v.m!=="None"?` (${v.m})`:""):"";head.push(["Part","Build"],["Pan",[st.pan,st.panEn].filter(Boolean).join(", ")],["Shovel",[st.shovel,st.shEn].filter(Boolean).join(", ")],["Trinket",st.trinket||""]);
    L.cw.ptSlotDefs().forEach(([k,l])=>head.push([l,it((st.slots||{})[k])]));
    if(L.R.museum){head.push([],["Museum","Mineral","Modifier"]);L.cw.ptMusRows().forEach(([r])=>((st.museumBoard||{})[r]||[]).forEach((x,i)=>{if(x&&x.m)head.push([`${r} ${i+1}`,x.m,x.u||""])}))}
    if(L.R.assume){head.push([],["Assumes"]);L.R.assume.forEach(a=>head.push([a]))}
    if(await ptDownloadCSV("Build Maker",head))ptToast("Download started");return}
  if(e.target.closest("#saveImg")){const L=LAST;if(!L.cw.ptBuildImage){ptToast("Couldn't draw the image");return}ptSaveImg("Build Maker build",()=>L.cw.ptBuildImage(L.R.st,"Build Maker build"));return}
  if(e.target.closest("#use")){LAST.cw.ptUseBuild(LAST.R.st,LAST.R.museum);ptToast("Loaded into the Stat Calculator")}});
drawW();drawForm();
(async()=>{try{const cw=await window.parent.ptCalcWin();if(cw&&cw.ptWhyCSS)document.head.insertAdjacentHTML("beforeend",`<style>${cw.ptWhyCSS}</style>`)}catch(e){}})();
document.addEventListener("click",e=>{const o=e.target.closest("[data-opentool]");if(o){try{window.parent.ptOpenTool(o.dataset.opentool)}catch(err){}}});
