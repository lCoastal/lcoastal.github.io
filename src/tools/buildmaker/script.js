const $=id=>document.getElementById(id);
const MUTN=["None","Silver","Gold","Diamond","Granite","Overclocked","Festive","Sunforged","Prismatic"];
const STATS=["Luck","Capacity","Size Boost","Modifier Boost","Sell Boost","Dig Strength","Dig Speed","Shake Strength","Shake Speed","Walk Speed","Inventory Size","Toughness"];
// worked out from the stats: a pan costs its digs and shakes at your own times (speed is what you enter, the search only changes strength and capacity)
const DER=["Minerals per minute","Rare finds per minute"];
const panTime=t=>{const C=Math.max(1,t.Capacity);
  const digs=Math.min(Math.ceil(C),Math.ceil(C/Math.max(1e-9,(S.totem?1.5:1)*t["Dig Strength"]))),shakes=Math.min(Math.ceil(C),Math.ceil(C/Math.max(1e-9,t["Shake Strength"])));
  return {digs,shakes,s:digs*digSec()+shakes*shSec()+1.15}};
// seconds per dig and per shake at the speeds you enter, from the community timing tests (as in Rolls per Minute)
const digSec=()=>143.9*Math.pow(Math.max(1,S.digSp),-0.9324),shSec=()=>1/(23.514*Math.max(1,S.shSp)/(442.88+Math.max(1,S.shSp)));
const derived=t=>{const T=Math.max(.01,panTime(t).s);return {"Minerals per minute":panItems(t.Capacity)*60/T,"Rare finds per minute":Math.max(1,t.Luck)*Math.pow(Math.max(1,t.Capacity),.565)*60/T/1e6}};
const PANSTATS=["Capacity","Dig Strength","Shake Strength"];
const TAPOPT=[["any","Don't mind"],["prefer","Prefer one tap"],["must","Must be one tap"]];
const taps=t=>Math.max(1,Math.ceil(t.Capacity/Math.max(1e-9,(S.totem?1.5:1)*t["Dig Strength"])));
const PCT=new Set(["Size Boost","Modifier Boost","Sell Boost","Dig Speed","Shake Speed"]);
const CONSOPT=[["none","None"],["pick","Pick my own"],["mine","As in the Stat Calculator"],["all","Every potion and consumable"]];
let S={w:{Luck:1,Capacity:.6},tap:"prefer",totem:true,digSp:1000,shSp:1000,strFirst:true,cons:"none",muts:["Sunforged","Prismatic"],mutDef:2,perfect:true,streak:true,sun:true,nomad:true,night:false,evMeteor:false,evWeather:false,pickPots:[],pickCons:[],owned:false,tools:true,trinket:true,museum:true};
try{Object.assign(S,JSON.parse(localStorage.getItem("pt-buildmaker")||"{}"))}catch(e){}
if(S.mutDef!==2){S.muts=["Sunforged","Prismatic"];S.mutDef=2}
const save=()=>{try{localStorage.setItem("pt-buildmaker",JSON.stringify(S))}catch(e){}};
const r1=v=>Math.round(Math.min(5,Math.max(0,+v||0))*10)/10;
// ---- form ----
const WROWS=STATS.concat(DER);
$("weights").innerHTML=WROWS.map(s=>`${s===DER[0]?`<span class="wsep">Per minute, from your taps and shakes at your speeds (set below)</span>`:""}`+`<label class="wt" data-row="${s}"><span>${s}</span><input type="range" min="0" max="5" step="0.1" data-w="${s}" aria-label="${s} weight"><input type="number" class="wn" min="0" max="5" step="0.1" inputmode="decimal" data-w="${s}" aria-label="${s} weight, exact"></label>`).join("");
function drawW(skip){WROWS.forEach(s=>{const v=r1(S.w[s]);document.querySelectorAll(`[data-w="${s}"]`).forEach(i=>{if(i!==skip)i.value=i.type==="number"?v.toFixed(1):v});document.querySelector(`[data-row="${s}"]`).classList.toggle("off",!(v>0))})}
$("weights").addEventListener("input",e=>{const t=e.target.closest("[data-w]");if(!t)return;S.w[t.dataset.w]=r1(t.value);save();drawW(t)});
$("weights").addEventListener("change",e=>{const t=e.target.closest("[data-w]");if(t)drawW()});
const setW=o=>{S.w=o;save();drawW()};
$("wLuck").onclick=()=>setW({Luck:1});$("wRare").onclick=()=>setW({Luck:1,Capacity:.6});$("wClear").onclick=()=>setW({});
function drawForm(){
  $("tap").innerHTML=TAPOPT.map(([k,l])=>`<button type="button" class="chip" data-tap="${k}" aria-pressed="${S.tap===k}">${l}</button>`).join("");
  $("tapTxt").textContent=S.tap==="must"?"Only builds that fill the pan in one tap: Dig Strength"+(S.totem?" × 1.5":"")+" at least your Capacity.":S.tap==="prefer"?"A build that needs a second tap counts as if its luck and capacity were halved, a third tap as a third, and so on.":"Taps don't count. Use the per-minute rows above to count pan time instead.";
  ["digSp","shSp"].forEach(k=>{if(document.activeElement!==$(k))$(k).value=S[k]});
  $("ratio").textContent=`About ${fmt(digSec(),2)} s a dig and ${fmt(shSec(),3)} s a shake, so 1 dig costs as much as ${fmt(digSec()/shSec(),1)} shakes`;
  $("totem").checked=!!S.totem;$("strFirst").checked=!!S.strFirst;
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
document.addEventListener("click",e=>{const tp=e.target.closest("[data-tap]");if(tp){S.tap=tp.dataset.tap;save();drawForm();return}
  const c=e.target.closest("[data-c]");if(c){S.cons=c.dataset.c;save();drawForm();return}
  const m=e.target.closest("[data-m]");if(m){const n=m.dataset.m;S.muts=S.muts.includes(n)?S.muts.filter(x=>x!==n):S.muts.concat([n]);save();drawForm()}});
["perfect","streak","sun","nomad","night","owned","tools","trinket","museum","evMeteor","evWeather","totem","strFirst"].forEach(k=>$(k).addEventListener("change",()=>{S[k]=$(k).checked;save();drawForm()}));
["digSp","shSp"].forEach(k=>$(k).addEventListener("input",()=>{const v=parseFloat($(k).value);if(v>0){S[k]=v;save();drawForm()}}));
$("spCalc").onclick=async()=>{let t=null;try{const cw=await window.parent.ptCalcWin();t=cw.ptTotals()}catch(e){}if(!t){ptToast("Couldn't read the Stat Calculator");return}
  S.digSp=Math.round(t["Dig Speed"]);S.shSp=Math.round(t["Shake Speed"]);save();drawForm();ptToast("Copied from the Stat Calculator")};
$("openCalc").onclick=()=>{try{window.parent.ptOpenTool("calc")}catch(e){}};
// ---- scoring: weight × log(1 + stat) for every weighted stat, so doubling a stat on weight 2 counts twice as much as on weight 1 ----
const val=(t,s,d)=>Math.log(1+Math.max(0,+(DER.includes(s)?d[s]:t[s])||0));
// the tap rule: "must" all but rules out a second tap, "prefer" counts it like halving luck and capacity
const scoreOf=(t,W)=>{const d=W.some(([s])=>DER.includes(s))?derived(t):null;let sc=W.reduce((a,[s,w])=>a+w*val(t,s,d),0);
  if(S.tap!=="any"){const n=taps(t);if(n>1)sc-=S.tap==="must"?1e3*(n-1):Math.max(1,W.reduce((a,[s,w])=>a+(s==="Luck"||s==="Capacity"||s==="Rare finds per minute"?w:0),0))*Math.log(n)}
  return sc};
// ---- search ----
let LAST=null;
$("run").onclick=async()=>{const W=WROWS.filter(s=>r1(S.w[s])>0).map(s=>[s,r1(S.w[s])]);
  if(!W.length){ptToast("Give at least one stat a weight above 0");return}
  if(!S.muts.length){ptToast("Pick at least one mutation");return}
  const btn=$("run");btn.disabled=true;$("prog").textContent="Loading the Stat Calculator…";
  let cw=null;try{cw=await window.parent.ptCalcWin()}catch(e){}
  if(!cw||!cw.ptFindBuild){btn.disabled=false;$("prog").textContent="";ptToast("Couldn't load the Stat Calculator");return}
  const R=await cw.ptFindBuild({skip:ptSkipSet(),muts:S.muts,tools:S.tools,trinket:S.trinket,museum:S.museum,owned:S.owned,perfect:S.perfect,streak:S.streak,sun:S.sun,nomad:S.nomad,night:S.night,events:{meteor:!!S.evMeteor,weather:!!S.evWeather},cons:S.cons,pots:S.pickPots,consList:S.pickCons,fresh:true,useful:(()=>{const u=new Set();W.forEach(([s])=>{if(s==="Minerals per minute")PANSTATS.forEach(x=>u.add(x));else if(s==="Rare finds per minute")["Luck"].concat(PANSTATS).forEach(x=>u.add(x));else u.add(s)});if(S.tap!=="any"){u.add("Dig Strength");u.add("Capacity")}return [...u]})(),musUseful:S.strFirst?(()=>{const u=new Set();W.forEach(([s])=>{if(s==="Minerals per minute")PANSTATS.forEach(x=>u.add(x));else if(s==="Rare finds per minute")["Luck"].concat(PANSTATS).forEach(x=>u.add(x));else u.add(s)});if(S.tap!=="any"){u.add("Dig Strength");u.add("Capacity")}return [...u].filter(k=>k!=="Dig Speed"&&k!=="Shake Speed")})():null},t=>scoreOf(t,W),(i,n)=>$("prog").textContent=`Searching… ${i+1} of ${n}`);
  btn.disabled=false;$("prog").textContent="";LAST={R,W,cw,tap:S.tap,totem:S.totem,cons:S.cons,picked:[...S.pickPots,...S.pickCons],ev:{meteor:!!S.evMeteor,weather:!!S.evWeather}};showRes()};
const fv=(s,v)=>PCT.has(s)?fmt(v,v<10?1:0)+"%":fmt(v,Math.abs(v)<10?2:0);
// the build laid out on the page: pan and shovel, equipment and museum, each with its picture
const IC=(k,n)=>{try{return window.parent.ptIcon(k,n)||""}catch(e){return ""}};
const EQR=Object.fromEntries(P.equip.map(e=>[e.n,e])),MNR=Object.fromEntries(P.mins.map(m=>[m.n,m]));
const pic=(src,alt)=>src?`<img src="${src}" alt="" loading="lazy">`:`<span class="noimg" aria-hidden="true">${esc((alt||"?")[0])}</span>`;
const buildHTML=ptBuildCards;
async function showRes(){const L=LAST;if(!L){$("resCard").hidden=true;return}$("resCard").hidden=false;const {R,cw,W}=L;const t=R.tot;
  const wOf=s=>(W.find(x=>x[0]===s)||[,0])[1];
  const ws=STATS.filter(s=>wOf(s)>0),rest=STATS.filter(s=>!(wOf(s)>0)&&Math.abs(+t[s]||0)>1e-9);
  const d=derived(t),pt=panTime(t),nt=Math.max(1,Math.ceil(t.Capacity/Math.max(1e-9,(L.totem?1.5:1)*t["Dig Strength"])));
  const tile=s=>`<div><span class="lab">${s}${wOf(s)>0?`, ${wOf(s).toFixed(1)}`:""}</span><b style="color:${DER.includes(s)?"var(--fg)":statVar(s)}">${DER.includes(s)?fmt(d[s],d[s]<10?2:0):fv(s,+t[s]||0)}</b></div>`;
  const panLine=`<p class="hint">Each pan takes <b>${pt.digs} tap${pt.digs===1?"":"s"}</b>${L.totem?" (with the Strength Totem)":""} and <b>${pt.shakes} shake${pt.shakes===1?"":"s"}</b>: about ${fmt(pt.s,2)} s at ${fmt(S.digSp,0)}% dig and ${fmt(S.shSp,0)}% shake speed, so about ${fmt(d["Minerals per minute"],0)} minerals per minute.</p>`;
  $("res").innerHTML=`<p class="hint">Weights: ${esc(wTxt())}, Consumables: ${esc(consTxt(L))}, Events: ${esc([L.ev.meteor&&"Meteor Shower 2×",L.ev.weather&&"weather 1.5×"].filter(Boolean).join(", ")||"none")}</p>
    <div class="sum">${WROWS.filter(s=>wOf(s)>0).map(tile).join("")}</div>${panLine}
    ${buildHTML(R.st,cw,{skip:true})}
    ${rest.length?`<details class="own"><summary><b>Every other stat</b></summary><div class="sum">${rest.map(tile).join("")}</div></details>`:""}
    ${cw.ptWhyHTML?cw.ptWhyHTML(R):""}
    <div class="acts" style="margin-top:12px"><button type="button" class="btn pri" id="toSheet">Save as build sheet</button><button type="button" class="btn" id="saveImg">Save as image</button><button type="button" class="btn" id="share">Share link</button><button type="button" class="btn" id="use">Use in Stat Calculator</button><button type="button" class="btn" id="csv">Download as spreadsheet</button></div>`}
const consTxt=L=>L.cons==="pick"?(L.picked.length?L.picked.join(", "):"none ticked"):(CONSOPT.find(x=>x[0]===L.cons)||[,""])[1];
const wTxt=()=>LAST.W.map(([s,w])=>`${s} ${w.toFixed(1)}`).join(", ")+(LAST.tap==="must"?", one tap only":LAST.tap==="prefer"?", one tap preferred":"");
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

// skipped parts: the bar under the search button, and a rerun when you skip something from the build
const drawSkips=()=>{const b=document.getElementById("skipBar");if(b)b.innerHTML=ptSkipBar()};drawSkips();
document.addEventListener("pt-skips",e=>{drawSkips();if(e.detail&&e.detail.rerun&&LAST&&!$("run").disabled)$("run").click()});
