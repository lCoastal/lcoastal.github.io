const $=id=>document.getElementById(id);
const MUTN=["None","Silver","Gold","Diamond","Granite","Overclocked","Festive","Sunforged","Prismatic"];
let S={tab:"find",goal:"min",min:"",zone:"",useCap:true,muts:MUTN.filter(m=>m!=="Festive"),perfect:true,streak:true,sun:true,nomad:true,trkMax:false,mastery:"",events:"",night:false,owned:false,tools:true,trinket:true,museum:true};
try{Object.assign(S,JSON.parse(localStorage.getItem("pt-bestbuild")||"{}"))}catch(e){}
const save=()=>{try{localStorage.setItem("pt-bestbuild",JSON.stringify(S))}catch(e){}};
const GOALS=[["min","A mineral"],["rare","Rare finds per pan"],["luck","Luck only"]];
// ---- drop model (same as Luck Odds / Best Luck Cap): each mineral's chance per pick at a given luck ----
const CAP_EFF=0.56,CAPS=[1,5,10,25,50,100,250,500,1000,2500,5000,10000,25000,50000,100000];
const LOC={};P.mins.forEach(m=>(m.ch||[]).forEach(c=>{const l=c[0];const p=parseFloat(String(c[1]).replace(/[%,]/g,""))/100;if(!(p>0))return;(LOC[l]=LOC[l]||[]).push({m,p})}));
function fullList(loc){const b=baseLoc(loc);const own=LOC[loc]||[];let out;
  if(b!==loc&&LOC[b])out=LOC[b].filter(x=>!own.some(y=>y.m===x.m)).concat(own);
  else if(own.length<2){const seen=new Set();out=[];Object.keys(LOC).filter(v=>v!==loc&&baseLoc(v)===loc).forEach(v=>LOC[v].concat(own).forEach(x=>{if(!seen.has(x.m)){seen.add(x.m);out.push(x)}}))}
  else out=[...own];
  return out.length<2?[]:out}
// one mineral in one zone: everything but the luck is fixed, so work it out once and keep a quick function of luck
function effFn(loc,m){const list=fullList(loc).sort((a,b)=>a.p-b.p);const tot=list.reduce((s,x)=>s+x.p,0);const x=list.find(y=>y.m===m);if(!x)return null;
  const [lo,hi,sn]=tieSpan(list,x,tot),rb=rareBand(tot/x.p);const f=l=>Math.pow(1-lo,l)-Math.pow(1-hi,l);
  return L=>(.2891*f(1)+.0280*f(Math.max(1,.04317*L))+.1905*f(Math.max(1,.40579*L))+.4924*f(Math.max(1,1.74153*L)))/sn*rb}
const MINS=P.mins.filter(m=>Object.keys(LOC).some(l=>fullList(l).some(x=>x.m===m))).sort((a,b)=>a.n.localeCompare(b.n));
const zonesOf=m=>Object.keys(LOC).filter(l=>fullList(l).some(x=>x.m===m)&&(LOC[l].length>1||baseLoc(l)!==l)).sort((a,b)=>a.localeCompare(b));
const minObj=()=>MINS.find(m=>m.n===S.min)||null;

const oneInT=p=>!(p>0)?"-":p>=.5?fmt(p*100,0)+"% per pan":"1 in "+(1/p<10?fmt(1/p,1):fmt(Math.round(1/p),0))+" pans";
// ---- form ----
function drawForm(){
  $("goal").innerHTML=GOALS.map(([k,l])=>`<button type="button" class="chip" data-g="${k}" aria-pressed="${S.goal===k}">${l}</button>`).join("");
  $("goalTxt").innerHTML=S.goal==="min"?"The best odds per pan for one mineral in one zone, with a luck cap if that helps.":S.goal==="rare"?"Best odds per pan at the rarest minerals: <b>luck × capacity<sup>0.565</sup></b>. Capacity gives more minerals per pan but fades, while luck keeps paying off for the rarest ones.":"Highest total luck. Capacity doesn't count.";
  $("minRow").hidden=S.goal!=="min";
  $("muts").innerHTML=MUTN.map(m=>`<button type="button" class="chip" data-m="${m}" aria-pressed="${S.muts.includes(m)}">${m}</button>`).join("");
  ["perfect","streak","sun","nomad","trkMax","night","owned","tools","trinket","museum","useCap"].forEach(k=>$(k).checked=!!S[k]);$("streak").disabled=!S.perfect;
  $("mastery").value=S.mastery;$("events").value=S.events;
  document.querySelectorAll("[data-tab]").forEach(b=>b.setAttribute("aria-selected",String(b.dataset.tab===S.tab)));$("pane-find").hidden=S.tab!=="find";$("pane-as").hidden=S.tab!=="as";
  const off=[!S.perfect&&"no perfect digs",S.perfect&&!S.streak&&"no full streak",!S.sun&&"no Sun Blessing",!S.nomad&&"Nomad not stacked",S.night?"night":"day"].filter(Boolean);
  $("asSum").innerHTML=`Assuming: ${esc(off.join(", "))}, <button type="button" class="lnk" data-tab="as">change</button>`;
  const m=minObj();$("mq").value=S.min;const zs=m?zonesOf(m):[];
  if(m&&!zs.includes(S.zone)){S.zone=zs.slice().sort((a,b)=>(effFn(b,m)||(()=>0))(1000)-(effFn(a,m)||(()=>0))(1000))[0]||""}
  $("zone").innerHTML=zs.length?zs.map(z=>`<option${z===S.zone?" selected":""}>${esc(z)}</option>`).join(""):'<option value="">Pick a mineral first</option>'}
makeAC({inp:$("mq"),items:MINS.map(m=>({n:m.n,tag:m.r,ic:m.ic,col:rc(m.r)})),icon:()=>{const m=minObj();return m&&m.ic},pick:x=>{S.min=x.n;S.zone="";save();drawForm()}});
document.addEventListener("click",e=>{const g=e.target.closest("[data-g]");if(g){S.goal=g.dataset.g;save();drawForm();return}
  const m=e.target.closest("[data-m]");if(m){const n=m.dataset.m;S.muts=S.muts.includes(n)?S.muts.filter(x=>x!==n):S.muts.concat([n]);save();drawForm();return}});
["perfect","streak","sun","nomad","trkMax","night","owned","tools","trinket","museum","useCap"].forEach(k=>$(k).addEventListener("change",()=>{S[k]=$(k).checked;save();drawForm()}));
["mastery","events"].forEach(k=>$(k).addEventListener("change",()=>{S[k]=$(k).value;save()}));
document.addEventListener("click",e=>{const t=e.target.closest("[data-tab]");if(t){S.tab=t.dataset.tab;save();drawForm();window.scrollTo(0,0)}});
$("openCalc2").onclick=()=>{try{window.parent.ptOpenTool("calc")}catch(e){}};
$("zone").addEventListener("change",()=>{S.zone=$("zone").value;save()});
$("openCalc").onclick=()=>{try{window.parent.ptOpenTool?window.parent.ptOpenTool("calc"):window.parent.location.hash="calc"}catch(e){}};
// ---- search ----
let LAST=null;
$("run").onclick=async()=>{if(!S.muts.length){ptToast("Pick at least one mutation");return}
  let sf,info={};
  if(S.goal==="min"){const m=minObj();if(!m||!S.zone){ptToast("Pick a mineral and a zone first");return}
    const ef=effFn(S.zone,m);if(!ef){ptToast("No drop data for that mineral there");return}
    const capE=CAPS.map(c=>ef(c*CAP_EFF));
    // chance per pan at the better of your own luck and the best cap below it
    const per=(L,C)=>{let p=ef(Math.max(1,L)),cap=null;if(S.useCap)CAPS.forEach((c,i)=>{if(c<L&&capE[i]>p*(1+1e-6)){p=capE[i];cap=c}});return {p:1-Math.pow(1-p,panItems(C)),cap}};
    sf=t=>Math.log(Math.max(1e-300,per(t.Luck,t.Capacity).p));info={m,per}}
  else if(S.goal==="rare")sf=t=>Math.log(Math.max(1e-9,t.Luck))+.565*Math.log(Math.max(1e-9,t.Capacity));
  else sf=t=>Math.log(Math.max(1e-9,t.Luck));
  const btn=$("run");btn.disabled=true;$("prog").textContent="Loading the Stat Calculator…";
  let cw=null;try{cw=await window.parent.ptCalcWin()}catch(e){}
  if(!cw||!cw.ptFindBuild){btn.disabled=false;$("prog").textContent="";ptToast("Couldn't load the Stat Calculator");return}
  const useful=S.goal==="luck"?["Luck"]:["Luck","Capacity"];
  const ev=S.events?{meteor:S.events==="meteor"||S.events==="both",weather:S.events==="weather"||S.events==="both"}:null;
  const R=await cw.ptFindBuild({muts:S.muts,tools:S.tools,trinket:S.trinket,museum:S.museum,owned:S.owned,perfect:S.perfect,streak:S.streak,sun:S.sun,nomad:S.nomad,trkMax:S.trkMax,mastery:S.mastery===""?null:+S.mastery,events:ev,night:S.night,useful},sf,(i,n)=>$("prog").textContent=`Searching… ${i+1} of ${n}`);
  btn.disabled=false;$("prog").textContent="";LAST={R,goal:S.goal,info,cw,zone:S.zone,perfect:S.perfect};showRes()};
function showRes(){const L=LAST;if(!L){$("resCard").hidden=true;return}$("resCard").hidden=false;const {R,cw}=L;const st=R.st,t=R.tot,b=R.base;
  const g=Math.exp(R.sc-R.beforeSc)-1;const gTxt=g>0.0005?(g<1?"+"+fmt(g*100,g<.1?1:0)+"%":"×"+fmt(g+1,g+1<10?2:0)):"no better build found";
  let head="";if(L.goal==="min"){const now=L.info.per(t.Luck,t.Capacity),was=L.info.per(R.before.Luck,R.before.Capacity);
    head=`<div><span class="lab">${esc(L.info.m.n)} in ${esc(L.zone)}</span><b class="pos">${oneInT(now.p)}</b><span class="hint">now ${oneInT(was.p)}</span></div><div><span class="lab">Luck cap</span><b>${now.cap?fmt(now.cap,0):"None"}</b><span class="hint">${now.cap?"pan with this cap on":"pan at your own luck"}</span></div>`}
  else head=`<div><span class="lab">${L.goal==="luck"?"Luck":"Rare finds per pan"}</span><b class="${g>0.0005?"pos":""}">${gTxt}</b><span class="hint">vs your current build</span></div>`;
  const mut=v=>v&&v.m&&v.m!=="None"?` (${esc(v.m)})`:"";const it=v=>v&&v.n?esc(v.n)+mut(v)+(v.l==="6"&&(v.q??100)===100?"":`, ${v.l==="5"?"5":"6"}★ ${v.q??100}%`):"";
  const row=(lab,now,was)=>`<tr class="${now===was?"":"chg"}"><td>${lab}</td><td>${now||"-"}</td><td class="was">${now===was?"":(was||"-")}</td></tr>`;
  const tl=(p,e)=>esc(p||"")+(e?`, ${esc(e)}`:"");
  const rows=[row("Pan",tl(st.pan,st.panEn),tl(b.pan,b.panEn)),row("Shovel",tl(st.shovel,st.shEn),tl(b.shovel,b.shEn)),row("Trinket",esc(st.trinket||""),esc(b.trinket||""))].concat(cw.ptSlotDefs().map(([k,l])=>row(l,it(st.slots[k]),it(b.slots[k]))));
  let mus="";if(R.museum)mus=`<h3 class="sec">Museum</h3>${ptMuseumView(st.museumBoard,{empty:"Nothing here helps"})}`;
  const capL=.565*t.Luck/Math.max(1,t.Capacity);
  $("res").innerHTML=`<div class="sum">${head}<div><span class="lab">Luck</span><b>${fmt(t.Luck,0)}</b><span class="hint">now ${fmt(R.before.Luck,0)}</span></div><div><span class="lab">Capacity</span><b>${fmt(t.Capacity,0)}</b><span class="hint">now ${fmt(R.before.Capacity,0)}</span></div></div>
    ${L.goal==="luck"?"":`<p class="hint">At this build 1 capacity is worth about ${fmt(capL,capL<10?2:0)} luck for the rarest minerals.${L.perfect?"":" Counted as autopan: use Mastered on the shovel for full luck."}</p>`}
    <table class="bt"><tr><th></th><th>Best build</th><th>Now</th></tr>${rows.join("")}</table>${mus}
    ${cw.ptWhyHTML?cw.ptWhyHTML(R):""}
    <div class="acts" style="margin-top:12px"><button type="button" class="btn pri" id="toSheet">Save as build sheet</button><button type="button" class="btn" id="share">Share link</button><button type="button" class="btn" id="use">Use in Stat Calculator</button><button type="button" class="btn" id="csv">Download as spreadsheet</button></div>`}
function sheetText(){const L=LAST;let txt=L.cw.ptBuildTextOf(L.R.st);
  if(L.goal==="min"){const n=L.info.per(L.R.tot.Luck,L.R.tot.Capacity);txt=txt.replace(/^(Title:[^\n]*\n)/,`$1Subtitle: Best build for ${L.info.m.n} in ${L.zone}: about ${oneInT(n.p)}${n.cap?`, with a luck cap of ${fmt(n.cap,0)}`:""}\n`)}
  return txt}
document.addEventListener("click",async e=>{if(!LAST)return;
  if(e.target.closest("#toSheet")){try{window.parent.ptCallTool("builds","ptAddBuildText",sheetText());ptToast("Saved to Build Sheets")}catch(err){ptToast("Couldn't reach Build Sheets")}return}
  if(e.target.closest("#share")){const url=await ptCopyShare(sheetText());ptToast(url?"Share link copied":"Couldn't copy, your browser blocked it");return}
  if(e.target.closest("#csv")){const L=LAST;const head=L.goal==="min"?(()=>{const n=L.info.per(L.R.tot.Luck,L.R.tot.Capacity);return [["Goal",`${L.info.m.n} in ${L.zone}`],["Odds per pan",oneInT(n.p)],["Luck cap",n.cap||"none"],[]]})():[["Goal",L.goal==="luck"?"Luck only":"Rare finds per pan"],[]];
    if(await ptDownloadCSV(L.goal==="min"?`Best build for ${L.info.m.n}`:"Best build",L.cw.ptFinderRows(L.R,head)))ptToast("Download started");return}
  if(e.target.closest("#use")){LAST.cw.ptUseBuild(LAST.R.st,LAST.R.museum);ptToast("Loaded into the Stat Calculator");return}});
// ---- what I own: one list of everything, with tick-all per group ----
const OWNG=[["Pans",(P.gear.pans||[]).map(x=>x.name)],["Shovels",(P.gear.shovels||[]).map(x=>x.name)],["Trinkets",((P.x2||{}).trinkets||[]).map(t=>t.n)],
  ["Necklaces",P.equip.filter(e=>e.slot==="Necklace").map(e=>e.n)],["Charms",P.equip.filter(e=>e.slot==="Charm").map(e=>e.n)],["Rings",P.equip.filter(e=>e.slot==="Ring").map(e=>e.n)]];
const isOwn=n=>!!(Store.get(n)||{}).own;const setOwn=(n,v)=>{if(isOwn(n)!==!!v)Store.toggle(n,"own")};
function drawOwn(){const q=$("ownQ").value.trim().toLowerCase();let tot=0,have=0;
  $("ownList").innerHTML=OWNG.map(([g,list])=>{const shown=list.filter(n=>!q||n.toLowerCase().includes(q));tot+=list.length;have+=list.filter(isOwn).length;if(!shown.length)return "";
    return `<div class="og"><div class="ogh"><b>${g}</b><span class="hint">${list.filter(isOwn).length} of ${list.length}</span><button type="button" class="btn sm" data-oall="${g}">Tick all</button><button type="button" class="btn sm" data-onone="${g}">Untick all</button></div><div class="oit">${shown.map(n=>`<label class="ck"><input type="checkbox" data-own="${esc(n)}"${isOwn(n)?" checked":""}> ${esc(n)}</label>`).join("")}</div></div>`}).join("")||'<p class="hint">Nothing matches.</p>';
  $("ownCount").textContent=`${have} of ${tot} ticked`}
$("ownQ").addEventListener("input",drawOwn);
$("ownList").addEventListener("change",e=>{const t=e.target.closest("[data-own]");if(t){setOwn(t.dataset.own,t.checked);drawOwn()}});
$("ownList").addEventListener("click",e=>{const a=e.target.closest("[data-oall],[data-onone]");if(!a)return;const g=a.dataset.oall||a.dataset.onone,on=!!a.dataset.oall;const q=$("ownQ").value.trim().toLowerCase();
  (OWNG.find(x=>x[0]===g)||[,[]])[1].filter(n=>!q||n.toLowerCase().includes(q)).forEach(n=>setOwn(n,on));drawOwn()});
window.ptStoreChanged=()=>{if(!$("ownBox").open)return;drawOwn()};
$("ownBox").addEventListener("toggle",()=>{if($("ownBox").open)drawOwn()});
drawOwn();
drawForm();
(async()=>{try{const cw=await window.parent.ptCalcWin();if(cw&&cw.ptWhyCSS)document.head.insertAdjacentHTML("beforeend",`<style>${cw.ptWhyCSS}</style>`)}catch(e){}})();
document.addEventListener("click",e=>{const o=e.target.closest("[data-opentool]");if(o){try{window.parent.ptOpenTool(o.dataset.opentool)}catch(err){}}});
