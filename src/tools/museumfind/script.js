
const $=id=>document.getElementById(id);
const ORDER=["Exotic","Mythic","Legendary","Epic","Rare","Uncommon","Common"],SLOTS={Exotic:1,Mythic:2,Legendary:3,Epic:3,Rare:3,Uncommon:3,Common:3};
const MULT={Common:.005,Uncommon:.0075,Rare:.0125,Epic:.02,Legendary:.03,Mythic:.05,Exotic:.08};
const STATS=["Luck","Size Boost","Sell Boost","Capacity","Modifier Boost","Dig Strength","Shake Strength","Dig Speed","Shake Speed","Walk Speed"];
let S={w:{Luck:5},own:false,skip:[],mods:P.mods.map(m=>m[0]).filter(n=>!["Treasured","Electrified","Crystalline","Voidtorn","Lunar"].includes(n))};
try{const s=JSON.parse(localStorage.getItem("pmf-s")||"null");if(s&&s.w)S=Object.assign(S,s)}catch(e){}
// Perfect is on by default now: switch it on once for older saves
if(!S.perf){S.perf=1;if(!S.mods.includes("Perfect"))S.mods.push("Perfect")}
const save=()=>{try{localStorage.setItem("pmf-s",JSON.stringify(S))}catch(e){}};
$("weights").innerHTML=STATS.map(s=>`<label class="wt"><span>${s}</span><input type="range" min="0" max="5" step="0.1" data-w="${s}" aria-label="${s} weight"><input type="number" class="wn" min="0" max="5" step="0.1" inputmode="decimal" data-w="${s}" aria-label="${s} weight, exact"></label>`).join("");
$("mods").innerHTML=P.mods.map(m=>`<label class="ck"><input type="checkbox" data-mod="${esc(m[0])}"><span>${m[0]==="None"?"No modifier":esc(m[0])}${m[2]>1?" (×"+m[2]+")":""}${m[1].length?`<small class="mfx">${esc(m[1].join(", "))}</small>`:""}</span></label>`).join("");
// The museum is chosen as a whole, not slot by slot. Each weighted stat counts as weight × log(1 + museum total),
// so a stat you already have a lot of is worth less: two stats on the same weight get a fair share each instead of
// the first one in the list taking every tie. Unweighted stats are ignored. Each display gets its own modifier.
const fval=x=>Math.log(1+Math.max(x,-0.99));
function solve(){const own=Store.all();const W=STATS.filter(s=>S.w[s]>0).map(s=>[s,S.w[s]]);
  const mods=P.mods.filter(m=>S.mods.includes(m[0]));if(!mods.some(m=>m[0]==="None"))mods.push(["None",[],1,""]);
  // every mineral × modifier choice for each rarity, with the stats it adds
  const opts={};ORDER.forEach(r=>{opts[r]=[];P.mins.filter(m=>m.r===r&&m.mu&&(!S.own||(own[m.n]||{}).own)&&!(S.skip||[]).includes(m.n)).forEach(m=>mods.forEach(md=>{const g={};
    m.mu.b.forEach(([st,v])=>g[st]=(g[st]||0)+v);md[1].forEach(st=>g[st]=(g[st]||0)+MULT[r]*md[2]);opts[r].push({n:m.n,u:md[0],g})}))});
  const slots=[];ORDER.forEach(r=>{for(let i=0;i<SLOTS[r];i++)slots.push({r,o:null})});
  const T={};W.forEach(([st])=>T[st]=0);
  const score=()=>W.reduce((a,[st,w])=>a+w*fval(T[st]),0);
  const put=(o,sign)=>{if(o)W.forEach(([st])=>{if(o.g[st])T[st]+=sign*o.g[st]})};
  const used=()=>new Set(slots.map(x=>x.o&&x.o.n).filter(Boolean));
  // what changing one slot to option o would add to the score
  const gainOf=(sl,o)=>{const base=score();put(sl.o,-1);put(o,1);const d=score()-base;put(o,-1);put(sl.o,1);return d};
  const EPS=1e-9;
  if(W.length){
    // 1) greedy: keep filling whichever empty display adds the most
    for(;;){let best=null;const u=used();slots.forEach(sl=>{if(sl.o)return;opts[sl.r].forEach(o=>{if(u.has(o.n))return;const d=gainOf(sl,o);if(d>EPS&&(!best||d>best.d+EPS))best={sl,o,d}})});
      if(!best)break;put(best.o,1);best.sl.o=best.o}
    // 2) improve: swap any display for something better (or empty it) until nothing helps
    for(let pass=0;pass<30;pass++){let changed=false;slots.forEach(sl=>{const u=used();if(sl.o)u.delete(sl.o.n);let best={o:null,d:sl.o?gainOf(sl,null):0};
      opts[sl.r].forEach(o=>{if(u.has(o.n))return;const d=gainOf(sl,o);if(d>best.d+EPS)best={o,d}});
      if(best.d>EPS){put(sl.o,-1);put(best.o,1);sl.o=best.o;changed=true}});if(!changed)break}}
  const board={},totals={};ORDER.forEach(r=>{const mine=slots.filter(x=>x.r===r&&x.o).map(x=>x.o);
    // strongest first within a rarity
    mine.sort((a,b)=>W.reduce((t,[st,w])=>t+w*(b.g[st]||0),0)-W.reduce((t,[st,w])=>t+w*(a.g[st]||0),0));
    board[r]=Array.from({length:SLOTS[r]},(_,i)=>mine[i]?{m:mine[i].n,u:mine[i].u}:{m:null,u:"None"});
    board[r].forEach(sl=>{if(!sl.m)return;const m=MIN[sl.m.toLowerCase()];m.mu.b.forEach(([st,v])=>totals[st]=(totals[st]||0)+v);const md=P.mods.find(x=>x[0]===sl.u);if(md)md[1].forEach(st=>totals[st]=(totals[st]||0)+MULT[r]*md[2])})});
  return {board,totals}}
let last=null;
function render(){
  STATS.forEach(s=>document.querySelectorAll(`[data-w="${s}"]`).forEach(i=>{if(i!==document.activeElement||i.type==="range")i.value=S.w[s]||0}));
  document.querySelectorAll("[data-mod]").forEach(c=>c.checked=S.mods.includes(c.dataset.mod));$("ownOnly").checked=!!S.own;
  const r=last=solve();
  const sk=S.skip||[];$("skipped").innerHTML=sk.length?`<div class="skipped"><span class="lab">Skipped for now</span>${sk.map(n=>`<button type="button" class="chip" data-unskip="${esc(n)}" title="Put ${esc(n)} back in the running">${esc(n)} ✕</button>`).join("")}<button type="button" class="btn" data-unskip="*" style="margin-left:auto;font-size:12px;padding:4px 10px">Unskip all</button></div>`:"";
  $("tot").innerHTML=STATS.filter(s=>r.totals[s]).map(s=>`<div class="${r.totals[s]<0?"neg":""}"><span>${s}</span><b>${r.totals[s]<0?"−":"+"}${fmt(Math.abs(r.totals[s]),3)}×</b></div>`).join("")||'<p class="hint">Turn up at least one stat to get a suggestion.</p>';
  $("board").innerHTML=ORDER.map(rr=>`<div class="band" style="--rc:${rc(rr)}"><h3>${rr}</h3><div class="slots">${r.board[rr].map(sl=>{const m=sl.m&&MIN[sl.m.toLowerCase()];
    return m?`<div class="slot" data-mineral="${esc(m.n)}" title="Ctrl+click to open ${esc(m.n)}">${m.ic?`<img src="${m.ic}" alt="">`:""}<div><b>${esc(m.n)}</b><span>${m.mu.b.map(([s,v])=>`${s} <em class="${v<0?"neg":""}">${v<0?"−":"+"}${Math.abs(v)}×</em>`).join(", ")}${sl.u&&sl.u!=="None"?` · ${esc(sl.u)}`:""}${m.mu.kg?` · ${m.mu.kg} kg`:""}</span></div><button type="button" class="skipb" data-skip="${esc(m.n)}" title="Leave ${esc(m.n)} out for now, e.g. if you can't get it yet or it's limited-time. The next best mineral takes its place.">Skip</button></div>`:`<div class="slot"><div><b class="muted">Leave empty</b><span>${S.own?"No owned mineral helps here":"Nothing here helps your goal"}</span></div></div>`}).join("")}</div></div>`).join("");
}
document.addEventListener("input",e=>{const t=e.target;if(t.dataset.w){if(t.value===""&&t.type==="number")return;const v=Math.round(Math.min(5,Math.max(0,+t.value||0))*100)/100;S.w[t.dataset.w]=v;if(!v)delete S.w[t.dataset.w];save();render()}});
document.addEventListener("change",e=>{const t=e.target;if(t.dataset.mod){S.mods=t.checked?[...new Set([...S.mods,t.dataset.mod])]:S.mods.filter(x=>x!==t.dataset.mod);if(!S.mods.includes("None"))S.mods.push("None");save();render()}else if(t.id==="ownOnly"){S.own=t.checked;save();render()}});
document.addEventListener("click",e=>{const k=e.target.closest("[data-skip]");if(k){e.stopPropagation();S.skip=[...new Set([...(S.skip||[]),k.dataset.skip])];save();render();toast(`Skipped ${k.dataset.skip}`);return}
  const u=e.target.closest("[data-unskip]");if(u){const n=u.dataset.unskip;const c=n==="*"?(S.skip||[]).length:1;S.skip=n==="*"?[]:(S.skip||[]).filter(x=>x!==n);save();render();toast(n==="*"?`Unskipped ${c} mineral${c===1?"":"s"}`:`${n} is back in the running`);return}
});
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
