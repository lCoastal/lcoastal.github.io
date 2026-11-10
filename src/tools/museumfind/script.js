
const $=id=>document.getElementById(id);
const ORDER=["Exotic","Mythic","Legendary","Epic","Rare","Uncommon","Common"],SLOTS={Exotic:1,Mythic:2,Legendary:3,Epic:3,Rare:3,Uncommon:3,Common:3};
const MULT={Common:.005,Uncommon:.0075,Rare:.0125,Epic:.02,Legendary:.03,Mythic:.05,Exotic:.08};
const STATS=["Luck","Size Boost","Sell Boost","Capacity","Modifier Boost","Dig Strength","Shake Strength","Dig Speed","Shake Speed","Walk Speed"];
const PRE={"Max luck":{Luck:5},"Max size":{"Size Boost":5,Luck:1},"Max sell":{"Sell Boost":5,"Size Boost":1},"Luck + size":{Luck:3,"Size Boost":3},"Modifiers":{"Modifier Boost":4,Luck:2},"Speed":{"Dig Speed":3,"Shake Speed":3,"Dig Strength":1,"Shake Strength":1}};
let S={w:{Luck:5},own:false,skip:[],mods:P.mods.map(m=>m[0]).filter(n=>!["Treasured","Perfect","Electrified","Crystalline","Voidtorn","Lunar"].includes(n))};
try{const s=JSON.parse(localStorage.getItem("pmf-s")||"null");if(s&&s.w)S=Object.assign(S,s)}catch(e){}
const save=()=>{try{localStorage.setItem("pmf-s",JSON.stringify(S))}catch(e){}};
$("presets").innerHTML=Object.keys(PRE).map(k=>`<button type="button" class="chip" data-pre="${esc(k)}">${esc(k)}</button>`).join("");
$("weights").innerHTML=STATS.map(s=>`<label class="wt"><span>${s}</span><input type="range" min="0" max="5" step="1" data-w="${s}" aria-label="${s} weight"><output id="o-${s.replace(/\s/g,"")}"></output></label>`).join("");
$("mods").innerHTML=P.mods.map(m=>`<label class="ck"><input type="checkbox" data-mod="${esc(m[0])}">${m[0]==="None"?"No modifier":esc(m[0])}${m[2]>1?" (×"+m[2]+")":""}</label>`).join("");
const val=g=>Object.entries(g).reduce((s,[k,v])=>s+(S.w[k]||0)*v,0);
function solve(){const own=Store.all();const board={},totals={};
  ORDER.forEach(r=>{
    // best modifier for this rarity (same for every display in it)
    let bm=["None",0];P.mods.filter(m=>S.mods.includes(m[0])).forEach(m=>{const g={};m[1].forEach(s=>g[s]=(g[s]||0)+MULT[r]*m[2]);const v=val(g);if(v>bm[1])bm=[m[0],v]});
    const cands=P.mins.filter(m=>m.r===r&&m.mu&&(!S.own||(own[m.n]||{}).own)&&!(S.skip||[]).includes(m.n)).map(m=>{const g={};m.mu.b.forEach(([s,v])=>g[s]=(g[s]||0)+v);return {m,g,v:val(g)}}).sort((a,b)=>b.v-a.v);
    board[r]=Array.from({length:SLOTS[r]},(_,i)=>{const c=cands[i];return c&&(c.v>0||bm[1]>0)?{m:c.m.n,u:bm[0]}:{m:null,u:"None"}});
    board[r].forEach(sl=>{if(!sl.m)return;const m=MIN[sl.m.toLowerCase()];m.mu.b.forEach(([s,v])=>totals[s]=(totals[s]||0)+v);const md=P.mods.find(x=>x[0]===sl.u);if(md)md[1].forEach(s=>totals[s]=(totals[s]||0)+MULT[r]*md[2])})});
  return {board,totals}}
let last=null;
function render(){
  STATS.forEach(s=>{const i=document.querySelector(`[data-w="${s}"]`);i.value=S.w[s]||0;$("o-"+s.replace(/\s/g,"")).textContent=S.w[s]||0});
  document.querySelectorAll("[data-mod]").forEach(c=>c.checked=S.mods.includes(c.dataset.mod));$("ownOnly").checked=!!S.own;
  document.querySelectorAll("[data-pre]").forEach(b=>b.setAttribute("aria-pressed",String(JSON.stringify(PRE[b.dataset.pre])===JSON.stringify(Object.fromEntries(Object.entries(S.w).filter(([,v])=>v))))));
  const r=last=solve();
  const sk=S.skip||[];$("skipped").innerHTML=sk.length?`<div class="skipped"><span class="lab">Skipped for now</span>${sk.map(n=>`<button type="button" class="chip" data-unskip="${esc(n)}" title="Put ${esc(n)} back in the running">${esc(n)} ✕</button>`).join("")}<button type="button" class="btn" data-unskip="*" style="margin-left:auto;font-size:12px;padding:4px 10px">Unskip all</button></div>`:"";
  $("tot").innerHTML=STATS.filter(s=>r.totals[s]).map(s=>`<div class="${r.totals[s]<0?"neg":""}"><span>${s}</span><b>${r.totals[s]<0?"−":"+"}${fmt(Math.abs(r.totals[s]),3)}×</b></div>`).join("")||'<p class="hint">Turn up at least one stat to get a suggestion.</p>';
  $("board").innerHTML=ORDER.map(rr=>`<div class="band" style="--rc:${rc(rr)}"><h3>${rr}</h3><div class="slots">${r.board[rr].map(sl=>{const m=sl.m&&MIN[sl.m.toLowerCase()];
    return m?`<div class="slot" data-mineral="${esc(m.n)}" title="Ctrl+click to open ${esc(m.n)}">${m.ic?`<img src="${m.ic}" alt="">`:""}<div><b>${esc(m.n)}</b><span>${m.mu.b.map(([s,v])=>`${s} <em class="${v<0?"neg":""}">${v<0?"−":"+"}${Math.abs(v)}×</em>`).join(", ")}${sl.u&&sl.u!=="None"?` · ${esc(sl.u)}`:""}${m.mu.kg?` · ${m.mu.kg} kg`:""}</span></div><button type="button" class="skipb" data-skip="${esc(m.n)}" title="Leave ${esc(m.n)} out for now, e.g. if you can't get it yet or it's limited-time. The next best mineral takes its place.">Skip</button></div>`:`<div class="slot"><div><b class="muted">Leave empty</b><span>${S.own?"No owned mineral helps here":"Nothing here helps your goal"}</span></div></div>`}).join("")}</div></div>`).join("");
}
document.addEventListener("input",e=>{const t=e.target;if(t.dataset.w){S.w[t.dataset.w]=+t.value;if(!+t.value)delete S.w[t.dataset.w];save();render()}});
document.addEventListener("change",e=>{const t=e.target;if(t.dataset.mod){S.mods=t.checked?[...new Set([...S.mods,t.dataset.mod])]:S.mods.filter(x=>x!==t.dataset.mod);if(!S.mods.includes("None"))S.mods.push("None");save();render()}else if(t.id==="ownOnly"){S.own=t.checked;save();render()}});
document.addEventListener("click",e=>{const k=e.target.closest("[data-skip]");if(k){e.stopPropagation();S.skip=[...new Set([...(S.skip||[]),k.dataset.skip])];save();render();toast(`Skipped ${k.dataset.skip}`);return}
  const u=e.target.closest("[data-unskip]");if(u){const n=u.dataset.unskip;const c=n==="*"?(S.skip||[]).length:1;S.skip=n==="*"?[]:(S.skip||[]).filter(x=>x!==n);save();render();toast(n==="*"?`Unskipped ${c} mineral${c===1?"":"s"}`:`${n} is back in the running`);return}
  const b=e.target.closest("[data-pre]");if(!b)return;S.w=Object.assign({},PRE[b.dataset.pre]);save();render()});
const plain=()=>Object.fromEntries(ORDER.map(r=>[r,last.board[r].map(sl=>({m:sl.m||null,u:sl.m?sl.u||"None":"None"}))]));
function toast(t){const d=document.createElement("div");d.className="toast";d.setAttribute("role","status");d.textContent=t;document.body.appendChild(d);setTimeout(()=>d.remove(),2200)}
// loadout name: what the user typed, or a random name (never an automatic "Best ...")
const N_ADJ=["Shiny","Lucky","Molten","Frozen","Glowing","Ancient","Mythic","Dusty","Golden","Cursed","Radiant","Hidden","Mighty","Swift","Heavy","Prismatic","Stormy","Crystal","Rusty","Royal","Sunlit","Moonlit","Gleaming","Rugged","Sparkling"];
const N_NOUN=["Pan","Shovel","Nugget","Geode","Vein","Sluice","Prospector","Digger","Ore","Haul","Dredge","Quarry","Relic","Totem","Lode","Cavern","Spade","Pebble","Treasure","Strike","Miner","Gemstone","Riverbed","Deposit","Jackpot"];
const pick1=a=>a[Math.floor(Math.random()*a.length)];let autoName=pick1(N_ADJ)+" "+pick1(N_NOUN);$("lname").placeholder=autoName;
const loName=()=>$("lname").value.trim()||autoName;
$("saveLo").onclick=()=>{if(!Object.values(plain()).some(r=>r.some(s=>s.m))){toast("Pick at least one goal first");return}let r=false;try{r=window.parent.ptSaveLoadout(loName(),plain())}catch(e){}
  toast(r?`${r==="updated"?"Updated":"Saved"} “${loName()}” in the Museum Planner's saved loadouts`:"Couldn't save the loadout")};
$("toImg").onclick=async()=>{const name=loName();
  let blob=null;try{blob=await window.parent.ptMuseumImage(name,plain())}catch(e){}if(!blob){toast("Couldn't draw the image");return}
  try{await window.parent.ptSave(name.replace(/[\\/:*?"<>|]+/g," ")+".png",blob);toast((()=>{try{return window.parent.ptImgMsg()}catch(e){return "Image saved"}})())}catch(e){const c=e&&e.code;if(c!=="declined")toast(c==="rate_limited"?"A save prompt is already open":"Couldn't save the image here")}};
window.ptFinderImage=()=>{const goal=Object.entries(S.w).filter(([,v])=>v).map(([k])=>k);return window.parent.ptMuseumImage(loName(),plain())};
$("toPlanner").onclick=()=>{try{window.parent.ptSendMuseum("planner",plain(),loName())}catch(e){toast("Couldn't reach the Museum Planner")}};
$("toCalc").onclick=()=>{try{window.parent.ptSendMuseum("calc",plain())}catch(e){toast("Couldn't reach the Stat Calculator")}};
window.onStoreChange=()=>{if(S.own)render()};
render();
