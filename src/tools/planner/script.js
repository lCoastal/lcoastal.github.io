
// Random names: one adjective + one noun, drawn fresh on every page load
const NAME_ADJ=["Shiny","Lucky","Molten","Frozen","Glowing","Ancient","Mythic","Dusty","Golden","Cursed","Radiant","Hidden","Mighty","Swift","Heavy","Prismatic","Stormy","Crystal","Rusty","Royal","Sunlit","Moonlit","Gleaming","Rugged","Sparkling"];
const NAME_NOUN=["Pan","Shovel","Nugget","Geode","Vein","Sluice","Prospector","Digger","Ore","Haul","Dredge","Quarry","Relic","Totem","Lode","Cavern","Spade","Pebble","Treasure","Strike","Miner","Gemstone","Riverbed","Deposit","Jackpot"];
const pickOne=a=>a[Math.floor(Math.random()*a.length)];
const randomName=()=>pickOne(NAME_ADJ)+" "+pickOne(NAME_NOUN);
const PAGE_NAME=randomName();
const ORDER=["Exotic","Mythic","Legendary","Epic","Rare","Uncommon","Common"];
const SLOTS={Exotic:1,Mythic:2,Legendary:3,Epic:3,Rare:3,Uncommon:3,Common:3};
const STATS=["Luck","Size Boost","Sell Boost","Capacity","Modifier Boost","Dig Strength","Shake Strength","Dig Speed","Shake Speed","Walk Speed"];
const MULT={Common:.005,Uncommon:.0075,Rare:.0125,Epic:.02,Legendary:.03,Mythic:.05,Exotic:.08};
const MODS=[["None",[],1,""],["Perfect",["Luck","Capacity","Size Boost"],1,"~1 in 26,764"],["Treasured",["Luck"],2,"Treasure chests only"],["Lunar",["Dig Speed","Shake Speed","Walk Speed"],1,"Night only, ~1 in 10,705"],["Voidtorn",["Luck","Capacity"],1,"The Void / Galactic tools / Voidtouched"],["Mutated",["Luck","Dig Strength","Modifier Boost"],1,"~1 in 2,676"],["Cosmic",["Capacity","Shake Strength"],1,"~1 in 535"],["Electrified",["Dig Speed","Shake Speed"],1,"Thunderstorm event only"],["Iridescent",["Luck"],1,"~1 in 134"],["Irradiated",["Modifier Boost"],1,"~1 in 27"],["Crystalline",["Size Boost"],1,"Geodes / Crystal Touch shovel"],["Scorching",["Dig Strength"],1,"~1 in 11"],["Glowing",["Shake Speed"],1,"~1 in 5"],["Pure",["Dig Speed"],1,"~1 in 3"],["Shiny",["Shake Strength"],1,"~1 in 3"]];
const D=[
["Copper","Common",60,[["Size Boost",.04]]],["Gold","Common",40,[["Sell Boost",.05]]],["Amethyst","Common",20,[["Dig Speed",.05]]],["Blue Ice","Common",40,[["Dig Speed",.05]]],["Pyrite","Common",60,[["Capacity",.05]]],["Silver","Common",40,[["Shake Speed",.05]]],["Platinum","Common",40,[["Dig Speed",.05]]],["Seashell","Common",20,[["Capacity",.05]]],["Obsidian","Common",30,[["Size Boost",.04]]],["Pearl","Common",20,[["Shake Speed",.05]]],
["Coral","Uncommon",10,[["Capacity",.08]]],["Glowberry","Uncommon",40,[["Sell Boost",.08]]],["Electrum","Uncommon",40,[["Sell Boost",.08]]],["Neodymium","Uncommon",40,[["Shake Strength",.08]]],["Smoky Quartz","Uncommon",20,[["Shake Strength",.08]]],["Malachite","Uncommon",20,[["Modifier Boost",.08]]],["Sapphire","Uncommon",20,[["Dig Speed",.08]]],["Rock Candy","Uncommon",60,[["Size Boost",.05]]],["Nickel","Uncommon",40,[["Capacity",.08]]],["Titanium","Uncommon",40,[["Dig Speed",.08]]],["Topaz","Uncommon",20,[["Capacity",.08]]],["Zircon","Uncommon",20,[["Size Boost",.05]]],
["Jade","Rare",40,[["Modifier Boost",.13]]],["Azuralite","Rare",30,[["Dig Speed",.13]]],["Glacial Quartz","Rare",40,[["Dig Speed",.13]]],["Amber","Rare",20,[["Sell Boost",.13]]],["Gloomberry","Rare",40,[["Dig Speed",.13]]],["Diopside","Rare",20,[["Modifier Boost",.13]]],["Candy Cane","Rare",40,[["Size Boost",.09]]],["Ruby","Rare",20,[["Shake Strength",.13]]],["Lapis Lazuli","Rare",30,[["Dig Speed",.13]]],["Silver Clamshell","Rare",20,[["Shake Speed",.13]]],["Peridot","Rare",20,[["Luck",.13]]],["Onyx","Rare",30,[["Modifier Boost",.13]]],["Meteoric Iron","Rare",40,[["Shake Strength",.13]]],["Pyrelith","Rare",30,[["Sell Boost",.13]]],["Sandsteel","Rare",30,[["Sell Boost",.13]]],
["Iridium","Epic",40,[["Dig Speed",.2]]],["Ammonite Fossil","Epic",50,[["Capacity",.2]]],["Ashvein","Epic",20,[["Size Boost",.14]]],["Emerald","Epic",20,[["Luck",.2]]],["Golden Pearl","Epic",20,[["Capacity",.2]]],["Borealite","Epic",20,[["Dig Speed",.2]]],["Aurorite","Epic",30,[["Dig Speed",.2]]],["Cobalt","Epic",40,[["Dig Speed",.2]]],["Glowmoss","Epic",60,[["Modifier Boost",.2]]],["Bone","Epic",50,[["Size Boost",.14]]],["Moonstone","Epic",50,[["Shake Speed",.2]]],["Pyronium","Epic",50,[["Sell Boost",.2]]],["Osmium","Epic",80,[["Size Boost",.2]]],["Opal","Epic",20,[["Shake Speed",.2]]],["Lightshard","Epic",20,[["Dig Speed",.2]]],["Mercury","Epic",80,[["Shake Strength",.2]]],["Meteoric Gold","Epic",40,[["Sell Boost",.2]]],["Selenite","Epic",30,[["Shake Speed",.2]]],
["Cinnabar","Legendary",20,[["Size Boost",.21]]],["Diamond","Legendary",20,[["Luck",.3]]],["Fire Opal","Legendary",20,[["Size Boost",.21]]],["Dragon Bone","Legendary",50,[["Size Boost",.21]]],["Catseye","Legendary",20,[["Capacity",.3]]],["Aetherite","Legendary",20,[["Dig Speed",.3]]],["Aquamarine","Legendary",20,[["Dig Speed",.3]]],["Firefly Stone","Legendary",60,[["Capacity",.3]]],["Bismuth","Legendary",80,[["Dig Speed",.3]]],["Gloomcap","Legendary",20,[["Dig Speed",.3]]],["Depleted Shard","Legendary",40,[["Dig Strength",.3]]],["Rose Gold","Legendary",40,[["Shake Strength",.3]]],["Palladium","Legendary",40,[["Sell Boost",.3]]],["Luminum","Legendary",40,[["Capacity",.3]]],["Specterite","Legendary",10,[["Shake Speed",.3]]],["Lost Soul","Legendary",20,[["Dig Speed",.3]]],["Peppermint Prism","Legendary",20,[["Modifier Boost",.3]]],["Radium","Legendary",60,[["Modifier Boost",.3]]],["Nautilus Shell","Legendary",50,[["Capacity",.3]]],["Jasper","Legendary",30,[["Sell Boost",.3]]],["Uranium","Legendary",60,[["Modifier Boost",.3]]],["Volcanic Key","Legendary",20,[["Size Boost",.21]]],["Starshine","Legendary",20,[["Dig Speed",.15],["Shake Speed",.15]]],["Tourmaline","Legendary",24,[["Sell Boost",.3]]],
["Inferlume","Mythic",20,[["Luck",.5]]],["Flarebloom","Mythic",20,[["Luck",.75],["Size Boost",-.5]]],["Frostshard","Mythic",20,[["Dig Strength",.5]]],["Chrysoberyl","Mythic",20,[["Luck",.5]]],["Aetherium","Mythic",20,[["Dig Speed",.5]]],["Agate","Mythic",40,[["Sell Boost",.5]]],["Pink Diamond","Mythic",20,[["Luck",.5]]],["Painite","Mythic",20,[["Size Boost",.35]]],["Prismara","Mythic",20,[["Luck",.25],["Capacity",.25],["Dig Strength",.25],["Shake Strength",.25]]],["Mythril","Mythic",60,[["Shake Strength",.5]]],["Radiant Gold","Mythic",60,[["Sell Boost",.5]]],["Star Garnet","Mythic",20,[["Size Boost",.35]]],["Red Beryl","Mythic",20,[["Size Boost",.35]]],["Vortessence","Mythic",20,[["Capacity",.5]]],["Volcanic Core","Mythic",20,[["Dig Strength",.25],["Size Boost",.2]]],["Sunstone","Mythic",40,[["Sell Boost",.5]]],
["Dinosaur Skull","Exotic",100,[["Sell Boost",.4],["Size Boost",.32]]],["Cryonic Artifact","Exotic",20,[["Dig Strength",1.2],["Shake Strength",1.2],["Dig Speed",-.8],["Shake Speed",-.8]]],["Bloodstone","Exotic",40,[["Size Boost",.56]]],["Astral Spore","Exotic",20,[["Dig Speed",.8]]],["Eternium","Exotic",20,[["Luck",.32],["Dig Speed",.32],["Shake Speed",.32]]],["Adamantine","Exotic",40,[["Modifier Boost",.8]]],["Celestium","Exotic",40,[["Luck",.48],["Shake Speed",.48]]],["Forgotten Totem","Exotic",40,[["Sell Boost",.8]]],["Eye of the Sands","Exotic",50,[["Sell Boost",.88]]],["Pumpkin Soul","Exotic",40,[["Size Boost",.56]]],["North Star","Exotic",40,[["Luck",.2],["Capacity",.2],["Dig Speed",.2],["Shake Speed",.2]]],["Singularium","Exotic",100,[["Capacity",.48],["Size Boost",.48]]],["Solarium","Exotic",40,[["Size Boost",.64]]],["Moonspire","Exotic",40,[["Dig Speed",.32],["Shake Speed",.32],["Walk Speed",.32]]],["Voidstone","Exotic",20,[["Luck",.4],["Capacity",.4]]],["Vineheart","Exotic",40,[["Luck",.8]]],["Umbrite","Exotic",40,[["Dig Speed",.4],["Shake Speed",.4]]],["Starpiercer","Exotic",40,[["Dig Strength",.48],["Shake Strength",.48]]],["Key of Life","Exotic",40,[["Luck",.88]]]
];
const BY=Object.fromEntries(D.map(d=>[d[0],d]));
const MOD=Object.fromEntries(MODS.map(m=>[m[0],m]));
const blank=()=>Object.fromEntries(ORDER.map(r=>[r,Array.from({length:SLOTS[r]},()=>({m:null,u:"None"}))]));
let S=blank();
try{const s=JSON.parse(localStorage.getItem("mp-board")||"null");if(s&&ORDER.every(r=>Array.isArray(s[r])&&s[r].length===SLOTS[r]))S=s;}catch(e){}
const save=()=>{try{localStorage.setItem("mp-board",JSON.stringify(S))}catch(e){}};
// a board sent from the Best Museum Finder
window.ptReloadLoadouts=()=>{try{const x=JSON.parse(localStorage.getItem("mp-loadouts")||"[]");if(Array.isArray(x))L=x.filter(o=>o&&o.name&&o.board)}catch(e){}renderSaved()};
window.ptLoadBoard=(bd,name)=>{const nb=blank();ORDER.forEach(r=>(bd[r]||[]).forEach((sl,i)=>{if(nb[r][i]&&sl&&(BY[sl.m]||sl.m==="Any"))nb[r][i]={m:sl.m,u:modOk(sl.u)?sl.u:"None"}}));S=nb;activeName=null;try{document.getElementById("lname").value=name||""}catch(e){}save();renderBoard();try{renderSaved()}catch(e){}try{toast("Loaded the suggested museum")}catch(e){}};
const rc=r=>"var(--c-"+r.toLowerCase()+")";
const r4=v=>Math.round(v*10000)/10000;
const fx=v=>(v<0?"−":"+")+r4(Math.abs(v))+"×";

// "Any" mineral = any mineral of that rarity (no mineral boost counted, the mutation still counts).
// Mutations can also be "Any" (any modifier, nothing counted) or "Any of: A/B/C" (counts the weakest of those, so totals are a safe minimum).
const anyOfList=u=>String(u||"").startsWith("Any of: ")?String(u).slice(8).split("/").map(x=>x.trim()).filter(x=>MOD[x]):[];
function modOf(u){u=u||"None";if(MOD[u])return MOD[u];if(u==="Any")return ["Any",[],1,""];const l=anyOfList(u);if(l.length)return l.map(x=>MOD[x]).reduce((a,b)=>b[1].length*b[2]<a[1].length*a[2]?b:a);return MOD.None}
const modOk=u=>!!MOD[u]||u==="Any"||anyOfList(u).length>0;
const minLabel=(r,m)=>m==="Any"?"Any "+r:m;
function slotGain(r,slot){const g={};if(slot.m&&BY[slot.m]){BY[slot.m][3].forEach(([s,v])=>g[s]=(g[s]||0)+v);}const md=modOf(slot.u);md[1].forEach(s=>g[s]=(g[s]||0)+MULT[r]*md[2]);return g}
function mineralGain(name){const g={};if(!BY[name])return g;BY[name][3].forEach(([s,v])=>g[s]=(g[s]||0)+v);return g}
function modGain(r,u){const g={};const md=modOf(u);md[1].forEach(s=>g[s]=(g[s]||0)+MULT[r]*md[2]);return g}
function totals(st){const t=Object.fromEntries(STATS.map(s=>[s,0]));ORDER.forEach(r=>st[r].forEach(sl=>{const g=slotGain(r,sl);for(const k in g)t[k]+=g[k]}));return t}
const gainHTML=g=>Object.keys(g).length?Object.entries(g).sort((a,b)=>STATS.indexOf(a[0])-STATS.indexOf(b[0])).map(([s,v])=>`<span class="${v<0?"neg":""}">${s} <em>${fx(v)}</em></span>`).join(""):`<span>No museum bonus</span>`;
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));

function renderBoard(){
  const b=document.getElementById("board");b.innerHTML="";
  ORDER.forEach(r=>{
    const band=document.createElement("section");band.className="band";band.style.setProperty("--rc",rc(r));
    band.innerHTML=`<div class="bh"><h2>${r}</h2><span>${SLOTS[r]} display${SLOTS[r]>1?"s":""} · mutation +${r4(MULT[r])}× per stat</span></div>`;
    const sl=document.createElement("div");sl.className="slots";
    S[r].forEach((slot,i)=>{
      const c=document.createElement("div");c.className="slot";
      c.innerHTML=`<button type="button" class="pick ${slot.m?"":"empty"}" id="m-${r}-${i}"><small>Mineral ${i+1}</small><b${slot.m&&slot.m!=="Any"?` data-mineral="${esc(slot.m)}"`:""}>${slot.m&&slot.m!=="Any"&&window.ptIc?ptIc(slot.m):""}${slot.m?esc(minLabel(r,slot.m)):"Choose mineral"}</b></button>
      <button type="button" class="pick" id="u-${r}-${i}"><small>Mutation</small><b title="${anyOfList(slot.u).length?"Totals count the weakest of these":""}">${esc(slot.u||"None")}</b></button>
      <div class="gives">${slot.m||slot.u!=="None"?gainHTML(slotGain(r,slot)):'<span>Empty display</span>'}</div>`;
      c.querySelector(`#m-${r}-${i}`).onclick=()=>openPicker(r,i,"m");
      c.querySelector(`#u-${r}-${i}`).onclick=()=>openPicker(r,i,"u");
      sl.appendChild(c);
    });
    band.appendChild(sl);b.appendChild(band);
  });
  renderTotals();
}
function renderTotals(){
  const t=totals(S);
  const rows=STATS.map(s=>({s,v:t[s]}));
  document.getElementById("tot").innerHTML=rows.map(({s,v})=>`<div class="trow ${Math.abs(v)<1e-9?"zero":""} ${s==="Luck"||s==="Size Boost"?"lead":""}"><span class="k">${s}</span><span class="v">${Math.abs(v)<1e-9?"—":fx(v)}</span></div>`).join("");
  const n=ORDER.reduce((a,r)=>a+S[r].filter(x=>x.m).length,0);
  document.getElementById("filled").textContent=`${n} of 18 displays filled.`;
}

// picker
let P=null,sortBy="Best",sortRev=false;
const scrim=document.getElementById("scrim");
function openPicker(r,i,kind){P={r,i,kind,multi:false,sel:[],opener:document.getElementById(kind+"-"+r+"-"+i)};sortBy="Best";sortRev=false;drawPicker();scrim.hidden=false;setTimeout(()=>{const c=document.querySelector(".opt.cur")||document.querySelector(".opt:not([disabled])");c&&c.focus()},0)}
function closePicker(){scrim.hidden=true;const o=P&&document.getElementById(P.kind+"-"+P.r+"-"+P.i);P=null;o&&o.focus()}
document.getElementById("pclose").onclick=closePicker;
scrim.addEventListener("click",e=>{if(e.target===scrim)closePicker()});
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!scrim.hidden)closePicker()});
function drawPicker(){
  const {r,i,kind}=P;const cur=S[r][i];
  document.getElementById("ptitle").textContent=(kind==="m"?`${r} mineral`:`Mutation on ${r}`)+` · display ${i+1}`;
  const sorts=document.getElementById("sorts");
  if(kind==="m"){
    sorts.hidden=false;
    sorts.innerHTML=["Best",...STATS.filter(s=>s!=="Walk Speed"),"Name"].map(s=>`<button type="button" class="chip" aria-pressed="${s===sortBy}">${s==="Best"?"Strongest":s}</button>`).join("")+`<button type="button" class="chip dirb" id="pdir" aria-label="Sort direction">${(d=>(d>0?"<b>↑</b> Ascending":"<b>↓</b> Descending"))((sortBy==="Name"?1:-1)*(sortRev?-1:1))}</button>`;
    [...sorts.querySelectorAll(".chip:not(.dirb)")].forEach((c,k)=>c.onclick=()=>{sortBy=["Best",...STATS.filter(s=>s!=="Walk Speed"),"Name"][k];sortRev=false;drawPicker()});
    document.getElementById("pdir").onclick=()=>{sortRev=!sortRev;drawPicker();document.getElementById("pdir").focus()};
  } else sorts.hidden=true;
  const opts=document.getElementById("opts");opts.innerHTML="";
  let list;
  if(kind==="m"){
    const used=S[r].map((x,k)=>k!==i&&x.m).filter(Boolean);
    list=D.filter(d=>d[1]===r);
    const key=d=>sortBy==="Best"?Math.max(...d[3].map(x=>x[1])):sortBy==="Name"?0:(d[3].find(x=>x[0]===sortBy)||[0,-99])[1];
    list.sort((a,b)=>sortBy==="Name"?a[0].localeCompare(b[0]):key(b)-key(a)||a[0].localeCompare(b[0]));if(sortRev)list.reverse();
    const none=document.createElement("button");none.type="button";none.className="opt"+(cur.m?"":" cur");none.innerHTML=`<b>Empty display</b><span class="kg"></span><div class="gives"><span>Remove the mineral</span></div>`;
    hook(none,null);opts.appendChild(none);
    const anyo=document.createElement("button");anyo.type="button";anyo.className="opt"+(cur.m==="Any"?" cur":"");anyo.innerHTML=`<b>Any ${r} mineral</b><span class="kg"></span><div class="gives"><span>Any ${r.toLowerCase()} works here. Only its mutation is counted in the totals.</span></div>`;hook(anyo,"Any");opts.appendChild(anyo);
    list.forEach(d=>{const o=document.createElement("button");o.type="button";o.className="opt"+(cur.m===d[0]?" cur":"");const u=used.includes(d[0]);if(u)o.disabled=true;
      o.dataset.mineral=d[0];o.innerHTML=`<b>${window.ptIc?ptIc(d[0]):""}${esc(d[0])}</b><span class="kg">${d[2]} kg for max</span><div class="gives">${u?"<span>Already in another "+r+" display</span>":gainHTML(mineralGain(d[0]))}</div>`;hook(o,d[0]);opts.appendChild(o)});
  } else {
    if(P.multi){
      const bar=document.createElement("div");bar.className="anybar";bar.innerHTML=`<span>Pick every modifier you'd accept here. Totals count the weakest one.</span><span style="display:flex;gap:6px"><button type="button" class="btn" id="anyCancel">Back</button><button type="button" class="btn primary" id="anyUse"${P.sel.length?"":" disabled"}>Use ${P.sel.length||""} selected</button></span>`;opts.appendChild(bar);
      bar.querySelector("#anyCancel").onclick=()=>{P.multi=false;drawPicker()};
      bar.querySelector("#anyUse").onclick=()=>{if(!P.sel.length)return;const sl=S[P.r][P.i];sl.u=P.sel.length===1?P.sel[0]:"Any of: "+P.sel.join("/");save();renderBoard();closePicker()};
    } else {
      const any=document.createElement("button");any.type="button";any.className="opt"+(cur.u==="Any"?" cur":"");any.innerHTML=`<b>Any modifier</b><span class="kg"></span><div class="gives"><span>Whatever it rolls. Nothing extra is counted in the totals.</span></div>`;hook(any,"Any");opts.appendChild(any);
      const anyof=document.createElement("button");anyof.type="button";anyof.className="opt"+(anyOfList(cur.u).length?" cur":"");anyof.innerHTML=`<b>Any of…</b><span class="kg">pick several</span><div class="gives"><span>${anyOfList(cur.u).length?"Now: "+esc(anyOfList(cur.u).join(", ")):"Choose a few modifiers you'd be happy with"}</span></div>`;
      anyof.onclick=()=>{P.multi=true;P.sel=anyOfList(cur.u).length?anyOfList(cur.u):(MOD[cur.u]&&cur.u!=="None"?[cur.u]:[]);drawPicker()};opts.appendChild(anyof);
    }
    MODS.filter(m=>!P.multi||m[0]!=="None").forEach(m=>{const o=document.createElement("button");o.type="button";const on=P.multi&&P.sel.includes(m[0]);o.className="opt"+(!P.multi&&(cur.u||"None")===m[0]?" cur":"")+(on?" sel":"");
      o.innerHTML=`<b>${P.multi?(on?"☑ ":"☐ "):""}${m[0]}</b><span class="kg">${esc(m[3])}</span><div class="gives">${gainHTML(modGain(r,m[0]))}</div>`;
      if(P.multi){o.setAttribute("aria-pressed",String(on));o.onclick=()=>{P.sel=on?P.sel.filter(x=>x!==m[0]):[...P.sel,m[0]];drawPicker();const b=[...document.querySelectorAll("#opts .opt")].find(x=>x.textContent.includes(m[0]));b&&b.focus()};o.onmouseenter=()=>showPreview(m[0],m[0])}else hook(o,m[0]);opts.appendChild(o)});
  }
  showPreview(null);
}
function trial(val){const st=JSON.parse(JSON.stringify(S));const sl=st[P.r][P.i];if(P.kind==="m")sl.m=val;else sl.u=val;return st}
function showPreview(val,label){
  const pv=document.getElementById("pview");
  if(val===undefined||label===undefined){pv.innerHTML=`<span class="t">Hover or focus an option to preview your museum total.</span>`;return}
  const before=totals(S),after=totals(trial(val));
  const ch=STATS.filter(s=>Math.abs(after[s]-before[s])>1e-9);
  pv.innerHTML=`<span class="t">Museum total with ${esc(label)}</span>`+(ch.length?`<div class="pv">${ch.map(s=>{const d=after[s]-before[s];return `<span>${s} <em>${fx(after[s])}</em> <em class="${d>0?"up":"down"}">(${d>0?"+":"−"}${r4(Math.abs(d))})</em></span>`}).join("")}</div>`:`<div class="pv"><span>No change</span></div>`);
}
function hook(el,val){
  const label=val===null?"this display empty":val;
  el.addEventListener("mouseenter",()=>{if(!el.disabled)showPreview(val,label)});
  el.addEventListener("focus",()=>{if(!el.disabled)showPreview(val,label)});
  el.addEventListener("click",()=>{if(el.disabled)return;const sl=S[P.r][P.i];if(P.kind==="m")sl.m=val;else sl.u=val;save();renderBoard();closePicker()});
}
document.getElementById("opts").addEventListener("mouseleave",()=>showPreview(null));

// ---------- saved loadouts ----------
let L=[];try{const x=JSON.parse(localStorage.getItem("mp-loadouts")||"[]");if(Array.isArray(x))L=x.filter(o=>o&&o.name&&o.board);}catch(e){}
let activeName=null,armDelete=null;
const saveL=()=>{try{localStorage.setItem("mp-loadouts",JSON.stringify(L))}catch(e){}};
const validBoard=b=>b&&ORDER.every(r=>Array.isArray(b[r])&&b[r].length===SLOTS[r]&&b[r].every(s=>s&&(s.m===null||BY[s.m]&&BY[s.m][1]===r)&&MOD[s.u||"None"]));
const clone=o=>JSON.parse(JSON.stringify(o));
const filledCount=b=>ORDER.reduce((a,r)=>a+b[r].filter(x=>x.m).length,0);
function headline(b){const t=totals(b);const top=STATS.filter(s=>t[s]>1e-9).sort((a,c)=>t[c]-t[a]).slice(0,3);return top.length?top.map(s=>s+" "+fx(t[s])).join(" · "):"Empty board"}
function renderSaved(){
  const el=document.getElementById("savedlist");
  if(!L.length){el.innerHTML='<p class="emptylo">No saved loadouts yet. Fill the board below, give it a name and press Save loadout. Saved loadouts stay in this browser; download one to keep a copy or move it to another device.</p>';return}
  el.innerHTML="";
  L.forEach((o,k)=>{
    const row=document.createElement("div");row.className="lo"+(o.name===activeName?" active":"");
    row.innerHTML=`<div class="info"><b>${esc(o.name)}</b><span>${filledCount(o.board)}/18 displays · ${esc(headline(o.board))}</span></div><div class="acts"><button type="button" class="btn sm" id="lo-load-${k}">Load</button><button type="button" class="btn sm" id="lo-dl-${k}">Download</button><button type="button" class="btn sm ${armDelete===k?"warn":""}" id="lo-del-${k}">${armDelete===k?"Confirm delete":"Delete"}</button></div>`;
    el.appendChild(row);
    row.querySelector(`#lo-load-${k}`).onclick=()=>{S=clone(o.board);activeName=o.name;document.getElementById("lname").value=o.name;armDelete=null;save();renderBoard();renderSaved();toast(`Loaded “${o.name}”`)};
    row.querySelector(`#lo-dl-${k}`).onclick=()=>downloadLoadout(o.name,o.board);
    row.querySelector(`#lo-del-${k}`).onclick=()=>{if(armDelete===k){const n=L[k].name;L.splice(k,1);if(activeName===n)activeName=null;armDelete=null;saveL();renderSaved();toast(`Deleted “${n}”`)}else{armDelete=k;renderSaved()}};
  });
}
document.getElementById("saveform").addEventListener("submit",e=>{
  e.preventDefault();const inp=document.getElementById("lname");const name=inp.value.trim();
  if(!name){inp.focus();toast("Give the loadout a name first");return}
  if(!filledCount(S)){toast("Put at least one mineral on the board first");return}
  const i=L.findIndex(o=>o.name.toLowerCase()===name.toLowerCase());
  const entry={name,board:clone(S),saved:new Date().toISOString()};
  if(i>=0){L[i]=entry;toast(`Updated “${name}”`)}else{L.push(entry);toast(`Saved “${name}”`)}
  activeName=name;armDelete=null;saveL();renderSaved();
});

// ---------- download a styled loadout file ----------
function loadoutHTML(name,b){
  const t=totals(b),when=new Date().toLocaleDateString(undefined,{year:"numeric",month:"long",day:"numeric"});
  const bands=ORDER.map(r=>`<section class="band" style="--rc:var(--c-${r.toLowerCase()})"><div class="bh"><h2>${r}</h2><span>${SLOTS[r]} display${SLOTS[r]>1?"s":""}</span></div><div class="slots">${b[r].map(s=>`<div class="slot"><div class="mn">${s.m?esc(s.m):'<i>Empty</i>'}</div><div class="mu">${s.u&&s.u!=="None"?esc(s.u):"No mutation"}</div><div class="gives">${s.m||s.u!=="None"?gainHTML(slotGain(r,s)):""}</div></div>`).join("")}</div></section>`).join("");
  const trows=STATS.map(s=>`<div class="trow ${Math.abs(t[s])<1e-9?"zero":""}"><span>${s}</span><span class="v">${Math.abs(t[s])<1e-9?"—":fx(t[s])}</span></div>`).join("");
  const css=`:root{--bg:#eef0f2;--panel:#fff;--fg:#1d2228;--muted:#5d6670;--line:#d6dbe0;--pos:#0f7c6b;--neg:#b3402f;--c-common:#7a8591;--c-uncommon:#3d8a3f;--c-rare:#2d6fc0;--c-epic:#8a3fc0;--c-legendary:#c98a10;--c-mythic:#c2304a;--c-exotic:#d24ab8;--fd:"Chakra Petch","Segoe UI",system-ui,sans-serif;--fb:"IBM Plex Sans","Segoe UI",system-ui,sans-serif;--fm:"IBM Plex Mono",ui-monospace,Consolas,monospace}
@media (prefers-color-scheme:dark){:root{--bg:#14181c;--panel:#1c2126;--fg:#e6e9ec;--muted:#98a2ad;--line:#2d343b;--pos:#3cc2a8;--neg:#ef7a66;--c-common:#a3adb8;--c-uncommon:#6cc46e;--c-rare:#68a6f0;--c-epic:#b880ee;--c-legendary:#f2b53a;--c-mythic:#f0687f;--c-exotic:#f17ad6;color-scheme:dark}}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--fg);font:15px/1.45 var(--fb)}
.wrap{max-width:1100px;margin:0 auto;padding:28px 16px 48px;display:flex;flex-direction:column;gap:18px}
.eyebrow{font:600 11px var(--fb);text-transform:uppercase;letter-spacing:.08em;color:var(--muted)}
h1{font:700 2.1rem/1.1 var(--fd);margin:4px 0 0}.sub{color:var(--muted);margin:6px 0 0}
.grid{display:grid;grid-template-columns:minmax(0,1fr) 300px;gap:20px;align-items:start}@media(max-width:820px){.grid{grid-template-columns:1fr}.tot{order:-1}}
.board{display:flex;flex-direction:column;gap:14px;min-width:0}.band{display:flex;flex-direction:column;gap:8px}
.bh{display:flex;justify-content:space-between;align-items:baseline;border-bottom:2px solid var(--rc);padding-bottom:3px}.bh h2{font:700 1.05rem var(--fd);margin:0;color:var(--rc);text-transform:uppercase;letter-spacing:.04em}.bh span{font-size:12px;color:var(--muted)}
.slots{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}@media(max-width:600px){.slots{grid-template-columns:1fr}}
.slot{background:var(--panel);border:1px solid var(--line);border-top:3px solid var(--rc);border-radius:8px;padding:10px;display:flex;flex-direction:column;gap:3px}
.mn{font-weight:600}.mn i{color:var(--muted);font-weight:400}.mu{font-size:12.5px;color:var(--muted)}
.gives{font-size:12.5px;display:flex;flex-wrap:wrap;gap:2px 8px}.gives span{color:var(--muted);white-space:nowrap}.gives em{font-style:normal;font-family:var(--fm);color:var(--pos)}.gives .neg em{color:var(--neg)}
.tot{background:var(--panel);border:1px solid var(--line);border-radius:10px;padding:14px;position:sticky;top:12px}.tot h2{font:700 1.15rem var(--fd);margin:0 0 6px}
.trow{display:flex;justify-content:space-between;padding:5px 0;border-bottom:1px solid var(--line);font-size:14px}.trow:last-child{border-bottom:0}.trow .v{font-family:var(--fm)}.zero{color:var(--muted)}
.foot{color:var(--muted);font-size:12px}`;
  const data=JSON.stringify({app:"prospecting-museum-planner",v:1,name,board:b}).replace(/</g,"\\u003c");
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(name)} · Museum Loadout</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@700&family=IBM+Plex+Sans:wght@400;600&family=IBM+Plex+Mono:wght@500&display=swap">
<style>${css}</style></head><body><div class="wrap">
<header><div class="eyebrow">Prospecting museum loadout</div><h1>${esc(name)}</h1><p class="sub">${filledCount(b)} of 18 displays filled · saved ${esc(when)}</p></header>
<div class="grid"><div class="board">${bands}</div><aside class="tot"><h2>Museum total</h2>${trows}</aside></div>
<p class="foot">Values assume each mineral is at or above its max-boost weight. Import this file back into the Prospecting Museum Planner to edit it.</p>
</div><script type="application/json" id="loadout-data">${data}<\/script></body></html>`;
}
let dl=null;
(async()=>{try{if(window.hostBridge&&hostBridge.use){dl=await hostBridge.use("downloads")}}catch(e){dl=null}})();
async function downloadLoadout(name,b){
  const html=loadoutHTML(name,b);
  const filename=(name.replace(/[\\/:*?"<>|]+/g," ").trim()||"Museum loadout")+" - Museum Loadout.html";
  const ps=(()=>{try{return window.parent!==window&&typeof window.parent.ptSave==="function"?window.parent.ptSave:null}catch(e){return null}})();
  if(ps){try{await ps(filename,html);toast("Download started")}catch(e){const c=e&&e.code;if(c!=="declined")toast(c==="rate_limited"?"A save prompt is already open":"Couldn't download here")}return}
  if(window.hostBridge&&hostBridge.use){
    if(!dl){toast("Downloads aren't available in this view");return}
    try{await dl.save({filename,data:html});toast("Download started")}
    catch(e){const c=e&&e.code;if(c==="declined")return;toast(c==="rate_limited"?"A save prompt is already open":"Couldn't download here")}
  } else {
    const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([html],{type:"text/html"}));a.download=filename;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},500);
  }
}
// ---- museum board as a shareable PNG, drawn on a canvas ----
const ICONS=(()=>{try{return Object.fromEntries((window.parent.PTDATA.mins||[]).filter(m=>m.ic).map(m=>[m.n,m.ic]))}catch(e){return {}}})();
const IMGC={Common:"#a3adb8",Uncommon:"#6cc46e",Rare:"#68a6f0",Epic:"#b880ee",Legendary:"#f2b53a",Mythic:"#f0687f",Exotic:"#f17ad6"};
const loadImg=src=>new Promise(r=>{const i=new Image();i.onload=()=>r(i);i.onerror=()=>r(null);i.src=src});
function rr(c,x,y,w,h,r){c.beginPath();c.moveTo(x+r,y);c.arcTo(x+w,y,x+w,y+h,r);c.arcTo(x+w,y+h,x,y+h,r);c.arcTo(x,y+h,x,y,r);c.arcTo(x,y,x+w,y,r);c.closePath()}
function fitText(c,t,max){if(c.measureText(t).width<=max)return t;while(t.length>1&&c.measureText(t+"…").width>max)t=t.slice(0,-1);return t+"…"}
async function boardImage(name,b){
  const W=1200,PAD=36,ROWH=92,HEAD=108,COLW=(W-PAD*2-150)/3;const tot=totals(b);const tl=STATS.filter(k=>tot[k]);
  const totRows=Math.ceil(tl.length/4)||1;const H=HEAD+ORDER.length*(ROWH+10)+40+totRows*44+30;
  const cv=document.createElement("canvas");const sc=2;cv.width=W*sc;cv.height=H*sc;const c=cv.getContext("2d");c.scale(sc,sc);
  const F='"IBM Plex Sans","Segoe UI",system-ui,sans-serif',FD='"Chakra Petch","Segoe UI",system-ui,sans-serif',FM='"IBM Plex Mono",Consolas,monospace';
  c.fillStyle="#14181c";c.fillRect(0,0,W,H);
  c.fillStyle="#e6e9ec";c.font=`700 34px ${FD}`;c.fillText(fitText(c,name,W-PAD*2-200),PAD,PAD+30);
  c.fillStyle="#98a2ad";c.font=`14px ${F}`;c.fillText(`${filledCount(b)} of 18 displays filled · values at max-boost weight`,PAD,PAD+58);
  let y=HEAD;
  for(const r of ORDER){const col=IMGC[r];
    c.fillStyle="#1c2126";rr(c,PAD,y,W-PAD*2,ROWH,10);c.fill();c.strokeStyle=col;c.lineWidth=1.5;rr(c,PAD,y,W-PAD*2,ROWH,10);c.stroke();
    c.fillStyle=col;rr(c,PAD,y,6,ROWH,3);c.fill();
    c.fillStyle=col;c.font=`700 15px ${F}`;c.fillText(r.toUpperCase(),PAD+20,y+ROWH/2+5);
    for(let i=0;i<3;i++){const x=PAD+150+i*COLW;const sl=b[r][i];
      if(i<b[r].length){c.strokeStyle="#2d343b";c.lineWidth=1;c.beginPath();c.moveTo(x,y+12);c.lineTo(x,y+ROWH-12);c.stroke()}
      if(!sl){continue}
      if(!sl.m){c.fillStyle="#5d6670";c.font=`italic 14px ${F}`;c.fillText("Empty",x+16,y+ROWH/2+5);continue}
      const ic=ICONS[sl.m];let tx=x+16;if(ic){const im=await loadImg(ic);if(im){c.fillStyle="#171b1f";rr(c,x+14,y+19,54,54,8);c.fill();c.drawImage(im,x+17,y+22,48,48)}tx=x+80}
      c.fillStyle="#e6e9ec";c.font=`700 17px ${FD}`;c.fillText(fitText(c,minLabel(r,sl.m),COLW-(tx-x)-10),tx,y+34);
      const md=sl.u&&sl.u!=="None"?sl.u:"";const mdg=md?modGain(r,md):{};c.fillStyle=md?"#3cc2a8":"#98a2ad";c.font=`600 11.5px ${F}`;c.fillText(fitText(c,md?md.toUpperCase()+"  "+(()=>{const SH={"Dig Strength":"Dig Str","Shake Strength":"Shake Str","Modifier Boost":"Mod","Dig Speed":"Dig Spd","Shake Speed":"Shake Spd","Walk Speed":"Walk"};return [...new Set(Object.values(mdg))].map(v=>`+${r4(v)}× `+Object.keys(mdg).filter(k=>mdg[k]===v).map(k=>SH[k]||k).join(", ")).join("; ")})():"NO MODIFIER",COLW-(tx-x)-10),tx,y+53);
      const g=mineralGain(sl.m);const txt=Object.entries(g).sort((a,b)=>STATS.indexOf(a[0])-STATS.indexOf(b[0])).map(([k,v])=>`${k} ${v<0?"−":"+"}${r4(Math.abs(v))}×`).join("  ");
      c.fillStyle="#b9c2cb";c.font=`12px ${FM}`;c.fillText(fitText(c,txt,COLW-(tx-x)-10),tx,y+72)}
    y+=ROWH+10}
  y+=14;c.fillStyle="#98a2ad";c.font=`600 13px ${F}`;c.fillText("MUSEUM TOTAL",PAD,y);y+=14;
  const cw=(W-PAD*2-30)/4;tl.forEach((k,i)=>{const x=PAD+(i%4)*(cw+10),yy=y+Math.floor(i/4)*44;c.fillStyle="#1c2126";rr(c,x,yy,cw,36,8);c.fill();c.strokeStyle="#2d343b";rr(c,x,yy,cw,36,8);c.stroke();
    c.fillStyle="#e6e9ec";c.font=`14px ${F}`;c.fillText(k,x+12,yy+23);const v=tot[k];c.fillStyle=v<0?"#ef7a66":"#3cc2a8";c.font=`600 14px ${FM}`;const t=(v<0?"−":"+")+r4(Math.abs(v))+"×";c.fillText(t,x+cw-12-c.measureText(t).width,yy+23)});
  if(!tl.length){c.fillStyle="#5d6670";c.font=`14px ${F}`;c.fillText("No boosts yet",PAD,y+22)}
  c.font=`600 13px ${F}`;const mb="Made by @__coastal";const mw=c.measureText(mb).width+28,mx=W-PAD-mw,my=PAD-6;c.fillStyle="rgba(20,184,166,.14)";rr(c,mx,my,mw,26,13);c.fill();c.strokeStyle="rgba(20,184,166,.6)";c.lineWidth=1;rr(c,mx,my,mw,26,13);c.stroke();c.fillStyle="#14b8a6";c.beginPath();c.arc(mx+12,my+13,3,0,Math.PI*2);c.fill();c.fillStyle="#2dd4bf";c.fillText(mb,mx+20,my+17.5);
  return await new Promise(res=>cv.toBlob(res,"image/png"))}
document.getElementById("imgCur").onclick=async()=>{if(!filledCount(S)){toast("The board is empty");return}
  const n=document.getElementById("lname").value.trim()||activeName||PAGE_NAME;const blob=await boardImage(n,S);if(!blob){toast("Couldn't draw the image");return}
  const filename=(n.replace(/[\\/:*?"<>|]+/g," ").trim().replace(/\.+$/,"")||"Museum")+" - Museum.png";
  const ps=(()=>{try{return window.parent!==window&&typeof window.parent.ptSave==="function"?window.parent.ptSave:null}catch(e){return null}})();
  if(ps){try{await ps(filename,blob);toast((()=>{try{return window.parent.ptImgMsg()}catch(e){return "Image saved"}})())}catch(e){const c=e&&e.code;if(c!=="declined")toast(c==="rate_limited"?"A save prompt is already open":"Couldn't save the image here")}return}
  const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=filename;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},500)};
window.ptBoardImage=()=>boardImage(document.getElementById("lname").value.trim()||PAGE_NAME,S);
document.getElementById("dlCur").onclick=()=>{const n=document.getElementById("lname").value.trim()||activeName||PAGE_NAME;if(!filledCount(S)){toast("The board is empty");return}downloadLoadout(n,S)};

// ---------- import a downloaded loadout ----------
document.getElementById("imp").addEventListener("change",e=>{
  const f=e.target.files&&e.target.files[0];e.target.value="";if(!f)return;
  const rd=new FileReader();rd.onload=()=>{
    try{
      const m=String(rd.result).match(/<script type="application\/json" id="loadout-data">([\s\S]*?)<\/script>/);
      const o=m&&JSON.parse(m[1]);
      if(!o||o.app!=="prospecting-museum-planner"||!validBoard(o.board))throw 0;
      const name=String(o.name||"Imported").slice(0,40);
      const i=L.findIndex(x=>x.name.toLowerCase()===name.toLowerCase());
      const entry={name,board:o.board,saved:new Date().toISOString()};
      if(i>=0)L[i]=entry;else L.push(entry);
      S=clone(o.board);activeName=name;document.getElementById("lname").value=name;saveL();save();renderBoard();renderSaved();toast(`Imported “${name}”`);
    }catch(err){toast("That file isn't a loadout from this planner")}
  };rd.readAsText(f);
});

document.getElementById("pClear").onclick=()=>{S=blank();activeName=null;document.getElementById("lname").value="";save();renderBoard();renderSaved();toast("Board cleared")};
document.getElementById("copy").onclick=()=>{
  const t=totals(S);
  const txt=ORDER.map(r=>r+": "+S[r].map(x=>x.m?x.m+(x.u&&x.u!=="None"?" ("+x.u+")":""):"empty").join(", ")).join("\n")+"\n\nTotal: "+STATS.filter(s=>Math.abs(t[s])>1e-9).map(s=>s+" "+fx(t[s])).join(", ");
  const done=()=>toast("Setup copied");
  try{navigator.clipboard.writeText(txt).then(done,()=>fallback(txt))}catch(e){fallback(txt)}
};
function fallback(txt){const ta=document.createElement("textarea");ta.value=txt;ta.style.position="fixed";ta.style.opacity="0";document.body.appendChild(ta);ta.select();try{document.execCommand("copy");toast("Setup copied")}catch(e){toast("Copy not available here")}ta.remove()}
let tt;function toast(m){let el=document.querySelector(".toast");if(!el){el=document.createElement("div");el.className="toast";el.setAttribute("role","status");document.body.appendChild(el)}el.textContent=m;el.hidden=false;clearTimeout(tt);tt=setTimeout(()=>el.hidden=true,1600)}

renderBoard();renderSaved();document.getElementById("lname").placeholder="Name this board, e.g. "+PAGE_NAME;
