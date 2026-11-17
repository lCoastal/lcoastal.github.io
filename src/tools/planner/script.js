
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
const MODS=[["None",[],1,""],["Perfect",["Luck","Capacity","Size Boost"],1,"~1 in 26,764"],["Treasured",["Luck"],2,"Treasure chests only"],["Entombed",["Luck"],2,"Pharaoh's Tomb only"],["Lunar",["Dig Speed","Shake Speed","Walk Speed"],1,"Night only, ~1 in 10,705"],["Voidtorn",["Luck","Capacity"],1,"The Void / Galactic tools / Voidtouched"],["Mutated",["Luck","Dig Strength","Modifier Boost"],1,"~1 in 2,676"],["Cosmic",["Capacity","Shake Strength"],1,"~1 in 535"],["Electrified",["Dig Speed","Shake Speed"],1,"Thunderstorm event only"],["Iridescent",["Luck"],1,"~1 in 134"],["Irradiated",["Modifier Boost"],1,"~1 in 27"],["Crystalline",["Size Boost"],1,"Geodes / Crystal Touch shovel"],["Scorching",["Dig Strength"],1,"~1 in 11"],["Glowing",["Shake Speed"],1,"~1 in 5"],["Pure",["Dig Speed"],1,"~1 in 3"],["Shiny",["Shake Strength"],1,"~1 in 3"]];
const D=[
["Copper","Common",60,[["Size Boost",.04]]],["Gold","Common",40,[["Sell Boost",.05]]],["Amethyst","Common",20,[["Dig Speed",.05]]],["Blue Ice","Common",40,[["Dig Speed",.05]]],["Pyrite","Common",60,[["Capacity",.05]]],["Silver","Common",40,[["Shake Speed",.05]]],["Platinum","Common",40,[["Dig Speed",.05]]],["Seashell","Common",20,[["Capacity",.05]]],["Obsidian","Common",30,[["Size Boost",.04]]],["Pearl","Common",20,[["Shake Speed",.05]]],
["Coral","Uncommon",10,[["Capacity",.08]]],["Glowberry","Uncommon",40,[["Sell Boost",.08]]],["Electrum","Uncommon",40,[["Sell Boost",.08]]],["Neodymium","Uncommon",40,[["Shake Strength",.08]]],["Smoky Quartz","Uncommon",20,[["Shake Strength",.08]]],["Malachite","Uncommon",20,[["Modifier Boost",.08]]],["Sapphire","Uncommon",20,[["Dig Speed",.08]]],["Rock Candy","Uncommon",60,[["Size Boost",.05]]],["Nickel","Uncommon",40,[["Capacity",.08]]],["Titanium","Uncommon",40,[["Dig Speed",.08]]],["Topaz","Uncommon",20,[["Capacity",.08]]],["Zircon","Uncommon",20,[["Size Boost",.05]]],
["Jade","Rare",40,[["Modifier Boost",.13]]],["Azuralite","Rare",30,[["Dig Speed",.13]]],["Glacial Quartz","Rare",40,[["Dig Speed",.13]]],["Amber","Rare",20,[["Sell Boost",.13]]],["Gloomberry","Rare",40,[["Dig Speed",.13]]],["Diopside","Rare",20,[["Modifier Boost",.13]]],["Candy Cane","Rare",40,[["Size Boost",.09]]],["Ruby","Rare",20,[["Shake Strength",.13]]],["Lapis Lazuli","Rare",30,[["Dig Speed",.13]]],["Silver Clamshell","Rare",20,[["Shake Speed",.13]]],["Peridot","Rare",20,[["Luck",.13]]],["Onyx","Rare",30,[["Modifier Boost",.13]]],["Meteoric Iron","Rare",40,[["Shake Strength",.13]]],["Pyrelith","Rare",30,[["Sell Boost",.13]]],["Sandsteel","Rare",30,[["Sell Boost",.13]]],
["Iridium","Epic",40,[["Dig Speed",.2]]],["Ammonite Fossil","Epic",50,[["Capacity",.2]]],["Ashvein","Epic",20,[["Size Boost",.14]]],["Emerald","Epic",20,[["Luck",.2]]],["Golden Pearl","Epic",20,[["Capacity",.2]]],["Borealite","Epic",20,[["Dig Speed",.2]]],["Aurorite","Epic",30,[["Dig Speed",.2]]],["Cobalt","Epic",40,[["Dig Speed",.2]]],["Glowmoss","Epic",60,[["Modifier Boost",.2]]],["Bone","Epic",50,[["Size Boost",.14]]],["Moonstone","Epic",50,[["Shake Speed",.2]]],["Pyronium","Epic",50,[["Sell Boost",.2]]],["Osmium","Epic",80,[["Size Boost",.2]]],["Opal","Epic",20,[["Shake Speed",.2]]],["Lightshard","Epic",20,[["Dig Speed",.2]]],["Mercury","Epic",80,[["Shake Strength",.2]]],["Meteoric Gold","Epic",40,[["Sell Boost",.2]]],["Selenite","Epic",30,[["Shake Speed",.2]]],
["Cinnabar","Legendary",20,[["Size Boost",.21]]],["Diamond","Legendary",20,[["Luck",.3]]],["Fire Opal","Legendary",20,[["Size Boost",.21]]],["Dragon Bone","Legendary",50,[["Size Boost",.21]]],["Catseye","Legendary",20,[["Capacity",.3]]],["Aetherite","Legendary",20,[["Dig Speed",.3]]],["Aquamarine","Legendary",20,[["Dig Speed",.3]]],["Firefly Stone","Legendary",60,[["Capacity",.3]]],["Bismuth","Legendary",80,[["Dig Speed",.3]]],["Gloomcap","Legendary",20,[["Dig Speed",.3]]],["Depleted Shard","Legendary",40,[["Dig Strength",.3]]],["Rose Gold","Legendary",40,[["Shake Strength",.3]]],["Palladium","Legendary",40,[["Sell Boost",.3]]],["Luminum","Legendary",40,[["Capacity",.3]]],["Specterite","Legendary",10,[["Shake Speed",.3]]],["Lost Soul","Legendary",20,[["Dig Speed",.3]]],["Peppermint Prism","Legendary",20,[["Modifier Boost",.3]]],["Radium","Legendary",60,[["Modifier Boost",.3]]],["Nautilus Shell","Legendary",50,[["Capacity",.3]]],["Jasper","Legendary",30,[["Sell Boost",.3]]],["Uranium","Legendary",60,[["Modifier Boost",.3]]],["Volcanic Key","Legendary",20,[["Size Boost",.21]]],["Starshine","Legendary",20,[["Dig Speed",.15],["Shake Speed",.15]]],["Tourmaline","Legendary",24,[["Sell Boost",.3]]],
["Inferlume","Mythic",20,[["Luck",.5]]],["Flarebloom","Mythic",20,[["Luck",.75],["Size Boost",-.5]]],["Frostshard","Mythic",20,[["Dig Strength",.5]]],["Chrysoberyl","Mythic",20,[["Luck",.5]]],["Aetherium","Mythic",20,[["Dig Speed",.5]]],["Agate","Mythic",40,[["Sell Boost",.5]]],["Pink Diamond","Mythic",20,[["Luck",.5]]],["Painite","Mythic",20,[["Size Boost",.35]]],["Prismara","Mythic",20,[["Luck",.25],["Capacity",.25],["Dig Strength",.25],["Shake Strength",.25]]],["Mythril","Mythic",60,[["Shake Strength",.5]]],["Radiant Gold","Mythic",60,[["Sell Boost",.5]]],["Star Garnet","Mythic",20,[["Size Boost",.35]]],["Red Beryl","Mythic",20,[["Size Boost",.35]]],["Vortessence","Mythic",20,[["Capacity",.5]]],["Volcanic Core","Mythic",20,[["Dig Strength",.25],["Size Boost",.2]]],["Sunstone","Mythic",40,[["Sell Boost",.5]]],
["Dinosaur Skull","Exotic",100,[["Sell Boost",.4],["Size Boost",.32]]],["Cryonic Artifact","Exotic",20,[["Dig Strength",1.2],["Shake Strength",1.2],["Dig Speed",-.8],["Shake Speed",-.8]]],["Bloodstone","Exotic",40,[["Size Boost",.56]]],["Astral Spore","Exotic",20,[["Dig Speed",.8]]],["Eternium","Exotic",20,[["Luck",.32],["Dig Speed",.32],["Shake Speed",.32]]],["Adamantine","Exotic",40,[["Modifier Boost",.8]]],["Celestium","Exotic",40,[["Luck",.48],["Shake Speed",.48]]],["Forgotten Totem","Exotic",40,[["Sell Boost",.8]]],["Eye of the Sands","Exotic",50,[["Sell Boost",.88]]],["Pumpkin Soul","Exotic",40,[["Size Boost",.56]]],["North Star","Exotic",40,[["Luck",.2],["Capacity",.2],["Dig Speed",.2],["Shake Speed",.2]]],["Singularium","Exotic",100,[["Capacity",.48],["Size Boost",.48]]],["Solarium","Exotic",40,[["Size Boost",.64]]],["Moonspire","Exotic",40,[["Dig Speed",.32],["Shake Speed",.32],["Walk Speed",.32]]],["Voidstone","Exotic",20,[["Luck",.4],["Capacity",.4]]],["Vineheart","Exotic",40,[["Luck",.8]]],["Umbrite","Exotic",40,[["Dig Speed",.4],["Shake Speed",.4]]],["Starpiercer","Exotic",40,[["Dig Strength",.48],["Shake Strength",.48]]],["Key of Life","Exotic",40,[["Luck",.88]]],["Natron Salt","Rare",40,[["Capacity",.13]]],["Blue Faience","Epic",30,[["Shake Speed",.2]]],["Scarab Amber","Epic",40,[["Luck",.2]]],["Canopic Gold","Legendary",60,[["Dig Strength",.3]]],["Ushabti","Mythic",40,[["Dig Speed",.5]]],["Sky Iron","Mythic",80,[["Dig Strength",.3],["Luck",.3]]],["Eternal Lotus","Exotic",40,[["Modifier Boost",.56],["Sell Boost",.56]]],["Feather of Ma'at","Exotic",4,[["Luck",.32],["Capacity",.32],["Dig Strength",.32],["Shake Strength",.32],["Dig Speed",.32],["Shake Speed",.32],["Sell Boost",.32],["Modifier Boost",.32],["Size Boost",.24]]]
];
const BY=Object.fromEntries(D.map(d=>[d[0],d]));
const MOD=Object.fromEntries(MODS.map(m=>[m[0],m]));
const blank=()=>Object.fromEntries(ORDER.map(r=>[r,Array.from({length:SLOTS[r]},()=>({m:null,u:"None"}))]));
let S=blank();
try{const s=JSON.parse(localStorage.getItem("mp-board")||"null");if(s&&ORDER.every(r=>Array.isArray(s[r])&&s[r].length===SLOTS[r]))S=s;}catch(e){}
let SB=blank();try{const s=JSON.parse(localStorage.getItem("mp-board-b")||"null");if(s&&ORDER.every(r=>Array.isArray(s[r])&&s[r].length===SLOTS[r]))SB=s;}catch(e){}
let CMP=false,TAB="A",NAMES={A:"",B:""};try{CMP=localStorage.getItem("mp-cmp")==="1";Object.assign(NAMES,JSON.parse(localStorage.getItem("mp-cmp-names")||"{}"))}catch(e){}
const brd=side=>side==="B"?SB:S;
const setBrd=(side,b)=>{if(side==="B")SB=b;else S=b};
const save=()=>{try{localStorage.setItem("mp-board",JSON.stringify(S));localStorage.setItem("mp-board-b",JSON.stringify(SB));localStorage.setItem("mp-cmp",CMP?"1":"0");localStorage.setItem("mp-cmp-names",JSON.stringify(NAMES))}catch(e){}};
// a board sent from the Best Museum Finder
window.ptReloadLoadouts=()=>{try{const x=JSON.parse(localStorage.getItem("mp-loadouts")||"[]");if(Array.isArray(x))L=x.filter(o=>o&&o.name&&o.board)}catch(e){}renderSaved()};
window.ptLoadBoard=(bd,name)=>{const nb=blank();ORDER.forEach(r=>(bd[r]||[]).forEach((sl,i)=>{if(nb[r][i]&&sl&&(BY[sl.m]||sl.m==="Any"))nb[r][i]={m:sl.m,u:modOk(sl.u)?sl.u:"None"}}));S=nb;activeName=null;try{document.getElementById("lname").value=name||""}catch(e){}save();renderBoard();try{renderSaved()}catch(e){}try{toast("Loaded the suggested museum")}catch(e){}};
const rc=r=>"var(--c-"+r.toLowerCase()+")";
const r4=v=>Math.round(v*10000)/10000;
const fx=v=>(v<0?"−":"+")+r4(Math.abs(v))+"×";
// museum totals multiply the stat, so show them as the final multiplier (a +3.125 bonus is ×4.125)
const fxT=v=>r4(1+v)+"×";

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

function drawBoard(el,st,side){
  el.innerHTML="";const bands=[];const other=CMP?brd(side==="A"?"B":"A"):null;
  ORDER.forEach(r=>{
    const band=document.createElement("section");band.className="band";band.style.setProperty("--rc",rc(r));
    band.innerHTML=`<div class="bh"><h2>${r}</h2><span>${SLOTS[r]} display${SLOTS[r]>1?"s":""} · mutation +${r4(MULT[r])}× per stat</span></div>`;
    const sl=document.createElement("div");sl.className="slots";
    st[r].forEach((slot,i)=>{
      const c=document.createElement("div");const o=other&&other[r][i];
      c.className="slot"+(o&&(o.m!==slot.m||(o.u||"None")!==(slot.u||"None"))?" diff":"");
      c.innerHTML=`<button type="button" class="pick ${slot.m?"":"empty"}" id="m-${side}-${r}-${i}"><small>Mineral ${i+1}</small><b${slot.m&&slot.m!=="Any"?` data-mineral="${esc(slot.m)}"`:""}>${slot.m&&slot.m!=="Any"&&window.ptIc?ptIc(slot.m):""}${slot.m?esc(minLabel(r,slot.m)):"Choose mineral"}</b></button>
      <button type="button" class="pick" id="u-${side}-${r}-${i}"><small>Mutation</small><b title="${anyOfList(slot.u).length?"Totals count the weakest of these":""}">${esc(slot.u||"None")}</b></button>
      <div class="gives">${slot.m||slot.u!=="None"?gainHTML(slotGain(r,slot)):'<span>Empty display</span>'}</div>`;
      c.querySelector(`#m-${side}-${r}-${i}`).onclick=()=>openPicker(r,i,"m",side);
      c.querySelector(`#u-${side}-${r}-${i}`).onclick=()=>openPicker(r,i,"u",side);
      sl.appendChild(c);
    });
    band.appendChild(sl);band.dataset.side=side;bands.push(band);el.appendChild(band);
  });
  return bands;
}
const HEAD={A:document.getElementById("headA"),B:document.getElementById("headB")};
function renderBoard(){
  document.getElementById("grid").classList.toggle("cmp",CMP);document.getElementById("cmpBtn").setAttribute("aria-pressed",String(CMP));
  document.getElementById("cmpBtn").textContent=CMP?"Stop comparing":"Compare two museums";
  ["A","B"].forEach(sd=>{const h=HEAD[sd];h.hidden=!CMP;if(CMP)drawHead(sd)});
  document.getElementById("sideB").hidden=true;document.getElementById("tabs").hidden=!CMP;
  document.querySelectorAll("#tabs [data-tab]").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.tab===TAB)));
  document.getElementById("sideA").classList.toggle("off",CMP&&TAB!=="A");document.getElementById("sideB").classList.toggle("off",CMP&&TAB!=="B");
  const pair=document.getElementById("pair");pair.hidden=!CMP;
  if(!CMP){drawBoard(document.getElementById("board"),S,"A");document.getElementById("sideA").hidden=false}
  else{
    // compare: one grid, A and B bands of each rarity on the same row so they line up
    document.getElementById("sideA").hidden=true;
    const a=drawBoard(document.createElement("div"),S,"A"),b=drawBoard(document.createElement("div"),SB,"B");
    pair.innerHTML="";pair.className="pair show"+TAB;
    const hA=HEAD.A,hB=HEAD.B;hA.dataset.side="A";hB.dataset.side="B";
    pair.append(hA,hB);ORDER.forEach((r,k)=>pair.append(a[k],b[k]));
  }
  renderTotals();
}
function renderTotals(){
  document.getElementById("cmpImg").hidden=true;
  if(CMP)return renderDiff();
  document.getElementById("totH").textContent="Museum total";
  const t=totals(S);
  const rows=STATS.map(s=>({s,v:t[s]}));
  document.getElementById("tot").innerHTML=rows.map(({s,v})=>`<div class="trow ${Math.abs(v)<1e-9?"zero":""} ${s==="Luck"||s==="Size Boost"?"lead":""}"><span class="k">${s}</span><span class="v">${Math.abs(v)<1e-9?"—":fxT(v)}</span></div>`).join("");
  const n=ORDER.reduce((a,r)=>a+S[r].filter(x=>x.m).length,0);
  document.getElementById("filled").textContent=`${n} of 18 displays filled.`;
}
const sideName=sd=>NAMES[sd]||("Museum "+sd);
function renderDiff(){
  const a=totals(S),b=totals(SB);
  document.getElementById("totH").textContent=sideName("A")+" vs "+sideName("B");document.getElementById("cmpImg").hidden=false;
  const rows=STATS.filter(k=>Math.abs(a[k])>1e-9||Math.abs(b[k])>1e-9);
  let up=0,dn=0;rows.forEach(k=>{const d=b[k]-a[k];if(d>1e-9)up++;else if(d<-1e-9)dn++});
  document.getElementById("tot").innerHTML=rows.length?`<div class="drow dh"><span>Stat</span><span title="${esc(sideName("A"))}">A</span><span title="${esc(sideName("B"))}">B</span><span>B − A</span></div>`+rows.map(k=>{const d=b[k]-a[k],z=Math.abs(d)<1e-9;
    return `<div class="drow"><span class="k">${k}</span><span class="v">${fxT(a[k])}</span><span class="v">${fxT(b[k])}</span><span class="v ${z?"same":d>0?"up":"down"}">${z?"same":(d>0?"+":"−")+r4(Math.abs(d))}</span></div>`}).join(""):'<p class="hint">Both museums are empty.</p>';
  let nd=0;ORDER.forEach(r=>S[r].forEach((x,i)=>{const y=SB[r][i];if(x.m!==y.m||(x.u||"None")!==(y.u||"None"))nd++}));
  document.getElementById("filled").innerHTML=rows.length?`<b>${esc(sideName("B"))}</b> is better in ${up} stat${up===1?"":"s"} and worse in ${dn} than <b>${esc(sideName("A"))}</b>. ${nd} display${nd===1?"":"s"} differ (outlined).`:"";
}
// header above each side in compare mode: name, load, paste, copy across, clear
function drawHead(sd){
  const h=HEAD[sd],ot=sd==="A"?"B":"A";
  h.innerHTML=`<div class="hrow"><span class="tag">${sd}</span><input class="name" id="nm${sd}" maxlength="40" placeholder="Museum ${sd}" value="${esc(NAMES[sd])}" aria-label="Name of museum ${sd}"></div>
    <div class="hrow"><select id="ld${sd}" aria-label="Load a museum into ${sd}"><option value="">Load…</option>${L.map((o,k)=>`<option value="${k}">${esc(o.name)}</option>`).join("")}</select>
    <button type="button" class="btn sm" id="ps${sd}">Paste</button><button type="button" class="btn sm" id="cp${sd}" title="Copy ${sd} onto ${ot}">Copy to ${ot} ${sd==="A"?"→":"←"}</button><button type="button" class="btn sm" id="cl${sd}">Clear</button></div>`;
  h.querySelector("#nm"+sd).oninput=e=>{NAMES[sd]=e.target.value.trim();save();renderTotals()};
  h.querySelector("#ld"+sd).onchange=e=>{const o=L[+e.target.value];if(!o)return;setBrd(sd,clone(o.board));NAMES[sd]=o.name;save();renderBoard();toast(`Loaded “${o.name}” into ${sd}`)};
  h.querySelector("#ps"+sd).onclick=()=>openPaste(sd);
  h.querySelector("#cp"+sd).onclick=()=>{setBrd(ot,clone(brd(sd)));NAMES[ot]=(NAMES[sd]||"Museum "+sd)+" (copy)";save();renderBoard();toast(`Copied ${sd} to ${ot}`)};
  h.querySelector("#cl"+sd).onclick=()=>{setBrd(sd,blank());NAMES[sd]="";save();renderBoard()};
}
// paste a setup copied as text ("Mythic: Pink Diamond (Perfect), Chrysoberyl (Perfect)" per line)
function parseSetup(txt){const b=blank();let n=0;const fill={};ORDER.forEach(r=>fill[r]=0);
  String(txt).split(/\r?\n/).forEach(line=>{const m=line.match(/^\s*([A-Za-z]+)\s*:\s*(.+)$/);if(!m||/^total/i.test(m[1]))return;
    m[2].split(/,(?![^()]*\))/).forEach(part=>{const p=part.trim().match(/^(.+?)\s*(?:\(([^)]+)\))?$/);if(!p)return;const name=p[1].trim(),mod=(p[2]||"None").trim();
      const d=D.find(x=>x[0].toLowerCase()===name.toLowerCase());const r=d?d[1]:ORDER.find(x=>x.toLowerCase()===m[1].toLowerCase());
      if(!d&&!/^any\b/i.test(name))return;if(!r||fill[r]>=SLOTS[r])return;
      b[r][fill[r]++]={m:d?d[0]:"Any",u:modOk(mod)?mod:"None"};n++})});
  return n?b:null}
let PS=null;
function openPaste(sd){PS=sd;document.getElementById("pasteT").value="";document.getElementById("pasteH").textContent="Paste into "+(sd==="B"?sideName("B"):CMP?sideName("A"):"the board");document.getElementById("pscrim").hidden=false;setTimeout(()=>document.getElementById("pasteT").focus(),0)}
document.getElementById("pasteGo").onclick=()=>{const b=parseSetup(document.getElementById("pasteT").value);if(!b){toast("Couldn't read any minerals from that");return}
  setBrd(PS,b);NAMES[PS]="";if(PS==="A"&&!CMP){activeName=null}save();renderBoard();document.getElementById("pscrim").hidden=true;toast("Setup pasted")};
document.getElementById("pasteX").onclick=()=>document.getElementById("pscrim").hidden=true;
document.getElementById("pscrim").addEventListener("click",e=>{if(e.target.id==="pscrim")e.currentTarget.hidden=true});
document.getElementById("pasteMain").onclick=()=>openPaste("A");
document.getElementById("cmpBtn").onclick=()=>{CMP=!CMP;if(CMP&&!filledCount(SB)&&filledCount(S)){SB=clone(S);NAMES.B=(NAMES.A||document.getElementById("lname").value.trim()||"Museum A")+" (copy)"}TAB="A";save();renderBoard();if(CMP)toast("Change Museum B to see the difference")};
document.getElementById("tabs").addEventListener("click",e=>{const b=e.target.closest("[data-tab]");if(!b)return;TAB=b.dataset.tab;renderBoard()});

// picker
let P=null,sortBy="Best",sortRev=false;
const scrim=document.getElementById("scrim");
function openPicker(r,i,kind,side){side=side||"A";P={r,i,kind,side,multi:false,sel:[],opener:document.getElementById(kind+"-"+side+"-"+r+"-"+i)};sortBy="Best";sortRev=false;drawPicker();scrim.hidden=false;setTimeout(()=>{const c=document.querySelector(".opt.cur")||document.querySelector(".opt:not([disabled])");c&&c.focus()},0)}
function closePicker(){scrim.hidden=true;const o=P&&document.getElementById(P.kind+"-"+P.side+"-"+P.r+"-"+P.i);P=null;o&&o.focus()}
document.getElementById("pclose").onclick=closePicker;
scrim.addEventListener("click",e=>{if(e.target===scrim)closePicker()});
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!scrim.hidden)closePicker()});
function drawPicker(){
  const {r,i,kind}=P;const BS=brd(P.side);const cur=BS[r][i];
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
    const used=BS[r].map((x,k)=>k!==i&&x.m).filter(Boolean);
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
      bar.querySelector("#anyUse").onclick=()=>{if(!P.sel.length)return;const sl=brd(P.side)[P.r][P.i];sl.u=P.sel.length===1?P.sel[0]:"Any of: "+P.sel.join("/");save();renderBoard();closePicker()};
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
function trial(val){const st=JSON.parse(JSON.stringify(brd(P.side)));const sl=st[P.r][P.i];if(P.kind==="m")sl.m=val;else sl.u=val;return st}
function showPreview(val,label){
  const pv=document.getElementById("pview");
  if(val===undefined||label===undefined){pv.innerHTML=`<span class="t">Hover or focus an option to preview your museum total.</span>`;return}
  const before=totals(brd(P.side)),after=totals(trial(val));
  const ch=STATS.filter(s=>Math.abs(after[s]-before[s])>1e-9);
  pv.innerHTML=`<span class="t">Museum total with ${esc(label)}</span>`+(ch.length?`<div class="pv">${ch.map(s=>{const d=after[s]-before[s];return `<span>${s} <em>${fxT(after[s])}</em> <em class="${d>0?"up":"down"}">(${d>0?"+":"−"}${r4(Math.abs(d))})</em></span>`}).join("")}</div>`:`<div class="pv"><span>No change</span></div>`);
}
function hook(el,val){
  const label=val===null?"this display empty":val;
  el.addEventListener("mouseenter",()=>{if(!el.disabled)showPreview(val,label)});
  el.addEventListener("focus",()=>{if(!el.disabled)showPreview(val,label)});
  el.addEventListener("click",()=>{if(el.disabled)return;const sl=brd(P.side)[P.r][P.i];if(P.kind==="m")sl.m=val;else sl.u=val;save();renderBoard();closePicker()});
}
document.getElementById("opts").addEventListener("mouseleave",()=>showPreview(null));

// ---------- saved loadouts ----------
let L=[];try{const x=JSON.parse(localStorage.getItem("mp-loadouts")||"[]");if(Array.isArray(x))L=x.filter(o=>o&&o.name&&o.board);}catch(e){}
let activeName=null,armDelete=null;
const saveL=()=>{try{localStorage.setItem("mp-loadouts",JSON.stringify(L))}catch(e){}};
const validBoard=b=>b&&ORDER.every(r=>Array.isArray(b[r])&&b[r].length===SLOTS[r]&&b[r].every(s=>s&&(s.m===null||BY[s.m]&&BY[s.m][1]===r)&&MOD[s.u||"None"]));
const clone=o=>JSON.parse(JSON.stringify(o));
const filledCount=b=>ORDER.reduce((a,r)=>a+b[r].filter(x=>x.m).length,0);
function headline(b){const t=totals(b);const top=STATS.filter(s=>t[s]>1e-9).sort((a,c)=>t[c]-t[a]).slice(0,3);return top.length?top.map(s=>s+" "+fxT(t[s])).join(" · "):"Empty board"}
function renderSaved(){if(CMP){drawHead("A");drawHead("B")}
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
  const trows=STATS.map(s=>`<div class="trow ${Math.abs(t[s])<1e-9?"zero":""}"><span>${s}</span><span class="v">${Math.abs(t[s])<1e-9?"—":fxT(t[s])}</span></div>`).join("");
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
    c.fillStyle="#e6e9ec";c.font=`14px ${F}`;c.fillText(k,x+12,yy+23);const v=tot[k];c.fillStyle=v<0?"#ef7a66":"#3cc2a8";c.font=`600 14px ${FM}`;const t=fxT(v);c.fillText(t,x+cw-12-c.measureText(t).width,yy+23)});
  if(!tl.length){c.fillStyle="#5d6670";c.font=`14px ${F}`;c.fillText("No boosts yet",PAD,y+22)}
  c.font=`600 13px ${F}`;const mb="Made by @__coastal";const mw=c.measureText(mb).width+28,mx=W-PAD-mw,my=PAD-6;c.fillStyle="rgba(20,184,166,.14)";rr(c,mx,my,mw,26,13);c.fill();c.strokeStyle="rgba(20,184,166,.6)";c.lineWidth=1;rr(c,mx,my,mw,26,13);c.stroke();c.fillStyle="#14b8a6";c.beginPath();c.arc(mx+12,my+13,3,0,Math.PI*2);c.fill();c.fillStyle="#2dd4bf";c.fillText(mb,mx+20,my+17.5);
  return await new Promise(res=>cv.toBlob(res,"image/png"))}
document.getElementById("imgCur").onclick=async()=>{if(CMP)return saveCompare();if(!filledCount(S)){toast("The board is empty");return}
  const n=document.getElementById("lname").value.trim()||activeName||PAGE_NAME;const blob=await boardImage(n,S);if(!blob){toast("Couldn't draw the image");return}
  const filename=(n.replace(/[\\/:*?"<>|]+/g," ").trim().replace(/\.+$/,"")||"Museum")+" - Museum.png";
  const ps=(()=>{try{return window.parent!==window&&typeof window.parent.ptSave==="function"?window.parent.ptSave:null}catch(e){return null}})();
  if(ps){try{await ps(filename,blob);toast((()=>{try{return window.parent.ptImgMsg()}catch(e){return "Image saved"}})())}catch(e){const c=e&&e.code;if(c!=="declined")toast(c==="rate_limited"?"A save prompt is already open":"Couldn't save the image here")}return}
  const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=filename;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},500)};
// ---- comparison of two museums as a PNG: title "A vs B", stat differences, both boards side by side ----
const SHORT={"Dig Strength":"Dig Str","Shake Strength":"Shake Str","Modifier Boost":"Mod Boost","Dig Speed":"Dig Spd","Shake Speed":"Shake Spd","Size Boost":"Size","Sell Boost":"Sell","Walk Speed":"Walk"};
async function compareImage(nA,nB){
  const W=1400,PAD=36,GAP=40,COL=(W-PAD*2-GAP)/2,SW=(COL-16)/3,SH=78;
  const ta=totals(S),tb=totals(SB),rows=STATS.filter(k=>Math.abs(ta[k])>1e-9||Math.abs(tb[k])>1e-9);
  const DCOLS=3,DROWS=Math.max(1,Math.ceil(rows.length/DCOLS)),DH=46;
  const HEAD=134,DIFFH=34+DROWS*(DH+8)+30,COLH=54,BAND=26+SH+14;
  const H=HEAD+DIFFH+COLH+ORDER.length*BAND+34;
  const cv=document.createElement("canvas");const sc=2;cv.width=W*sc;cv.height=H*sc;const c=cv.getContext("2d");c.scale(sc,sc);
  const F='"IBM Plex Sans","Segoe UI",system-ui,sans-serif',FD='"Chakra Petch","Segoe UI",system-ui,sans-serif',FM='"IBM Plex Mono",Consolas,monospace';
  try{await document.fonts.ready}catch(e){}
  c.fillStyle="#14181c";c.fillRect(0,0,W,H);
  // title
  c.font=`700 34px ${FD}`;const tA=fitText(c,nA,(W-PAD*2-260)/2-30),tB=fitText(c,nB,(W-PAD*2-260)/2-30);
  let x=PAD;c.fillStyle="#e6e9ec";c.fillText(tA,x,PAD+32);x+=c.measureText(tA).width+14;c.fillStyle="#3cc2a8";c.font=`700 24px ${FD}`;c.fillText("vs",x,PAD+30);x+=c.measureText("vs").width+14;c.fillStyle="#e6e9ec";c.font=`700 34px ${FD}`;c.fillText(tB,x,PAD+32);
  let up=0,dn=0;rows.forEach(k=>{const d=tb[k]-ta[k];if(d>1e-9)up++;else if(d<-1e-9)dn++});
  let nd=0;ORDER.forEach(r=>S[r].forEach((a,i)=>{const b=SB[r][i];if(a.m!==b.m||(a.u||"None")!==(b.u||"None"))nd++}));
  c.fillStyle="#98a2ad";c.font=`14px ${F}`;c.fillText(`Museum comparison · ${nB} is better in ${up} stat${up===1?"":"s"}, worse in ${dn} · ${nd} display${nd===1?"":"s"} differ · values at max-boost weight`.slice(0,150),PAD,PAD+60);
  c.font=`600 13px ${F}`;const mb="Made by @__coastal";const mw=c.measureText(mb).width+28,mx=W-PAD-mw,my=PAD-6;c.fillStyle="rgba(20,184,166,.14)";rr(c,mx,my,mw,26,13);c.fill();c.strokeStyle="rgba(20,184,166,.6)";c.lineWidth=1;rr(c,mx,my,mw,26,13);c.stroke();c.fillStyle="#14b8a6";c.beginPath();c.arc(mx+12,my+13,3,0,Math.PI*2);c.fill();c.fillStyle="#2dd4bf";c.fillText(mb,mx+20,my+17.5);
  // stat differences
  let y=HEAD;c.fillStyle="#98a2ad";c.font=`600 13px ${F}`;c.fillText("STAT DIFFERENCES  ("+nB.toUpperCase().slice(0,30)+" − "+nA.toUpperCase().slice(0,30)+")",PAD,y);y+=14;
  const dw=(W-PAD*2-(DCOLS-1)*10)/DCOLS;
  rows.forEach((k,i)=>{const xx=PAD+(i%DCOLS)*(dw+10),yy=y+Math.floor(i/DCOLS)*(DH+8),d=tb[k]-ta[k],z=Math.abs(d)<1e-9,col=z?"#98a2ad":d>0?"#3cc2a8":"#ef7a66";
    c.fillStyle="#1c2126";rr(c,xx,yy,dw,DH,9);c.fill();c.strokeStyle=z?"#2d343b":col;c.globalAlpha=z?1:.55;c.lineWidth=1;rr(c,xx,yy,dw,DH,9);c.stroke();c.globalAlpha=1;
    c.fillStyle="#e6e9ec";c.font=`600 14px ${F}`;c.fillText(k,xx+14,yy+28);
    const dt=z?"same":(d>0?"+":"−")+r4(Math.abs(d));c.font=`600 15px ${FM}`;c.fillStyle=col;const dwid=c.measureText(dt).width;c.fillText(dt,xx+dw-14-dwid,yy+29);
    const ab=`${fxT(ta[k])} → ${fxT(tb[k])}`;c.font=`13px ${FM}`;c.fillStyle="#98a2ad";const aw=c.measureText(ab).width;c.fillText(ab,xx+dw-14-dwid-16-aw,yy+28)});
  if(!rows.length){c.fillStyle="#5d6670";c.font=`14px ${F}`;c.fillText("Both museums are empty",PAD,y+28)}
  y=HEAD+DIFFH;
  // column headers
  const colX=[PAD,PAD+COL+GAP];
  [[nA,"A"],[nB,"B"]].forEach(([n,t],j)=>{const xx=colX[j];c.fillStyle="#3cc2a8";rr(c,xx,y,30,30,8);c.fill();c.fillStyle="#14181c";c.font=`700 16px ${FD}`;c.fillText(t,xx+15-c.measureText(t).width/2,y+21);
    c.fillStyle="#e6e9ec";c.font=`700 20px ${FD}`;c.fillText(fitText(c,n,COL-50),xx+42,y+22)});
  const sepTop=y-4;y+=COLH;
  // boards, one rarity per row
  for(const r of ORDER){const col=IMGC[r];
    c.fillStyle=col;c.font=`700 13px ${F}`;
    for(let j=0;j<2;j++){const xx=colX[j];c.fillText(r.toUpperCase(),xx,y+14);c.fillStyle=col;c.globalAlpha=.6;c.fillRect(xx,y+20,COL,2);c.globalAlpha=1}
    for(let j=0;j<2;j++){const st=j?SB:S,ot=j?S:SB,xx=colX[j];
      for(let i=0;i<SLOTS[r];i++){const sl=st[r][i],o=ot[r][i],sx=xx+i*(SW+8),sy=y+28;const diff=sl.m!==o.m||(sl.u||"None")!==(o.u||"None");
        c.fillStyle="#1c2126";rr(c,sx,sy,SW,SH,10);c.fill();c.strokeStyle=diff?"#3cc2a8":"#2d343b";c.lineWidth=diff?2:1;rr(c,sx,sy,SW,SH,10);c.stroke();
        c.fillStyle=col;rr(c,sx,sy,SW,4,2);c.fill();
        if(!sl.m){c.fillStyle="#5d6670";c.font=`italic 14px ${F}`;c.fillText(sl.u&&sl.u!=="None"?"Any · "+sl.u:"Empty",sx+14,sy+SH/2+5);continue}
        let tx=sx+12;const ic=ICONS[sl.m];if(ic){const im=await loadImg(ic);if(im){c.drawImage(im,sx+10,sy+15,48,48)}tx=sx+66}
        c.fillStyle="#e6e9ec";c.font=`700 15px ${FD}`;c.fillText(fitText(c,minLabel(r,sl.m),SW-(tx-sx)-8),tx,sy+28);
        const md=sl.u&&sl.u!=="None"?sl.u:"None";c.fillStyle=md!=="None"?"#3cc2a8":"#98a2ad";c.font=`600 11.5px ${F}`;c.fillText(md.toUpperCase(),tx,sy+46);
        const g=mineralGain(sl.m),gt=Object.entries(g).sort((a,b)=>STATS.indexOf(a[0])-STATS.indexOf(b[0])).map(([k,v])=>`${SHORT[k]||k} ${v<0?"−":"+"}${r4(Math.abs(v))}`).join(" · ");
        c.fillStyle="#b9c2cb";c.font=`11.5px ${FM}`;c.fillText(fitText(c,gt,SW-(tx-sx)-8),tx,sy+64)}}
    y+=BAND}
  // separator between the two museums
  const sx=PAD+COL+GAP/2;c.strokeStyle="#3cc2a8";c.globalAlpha=.45;c.lineWidth=2;c.setLineDash([6,6]);c.beginPath();c.moveTo(sx,sepTop);c.lineTo(sx,y-6);c.stroke();c.setLineDash([]);c.globalAlpha=1;
  return await new Promise(res=>cv.toBlob(res,"image/png"))}
async function saveCompare(){
  if(!filledCount(S)&&!filledCount(SB)){toast("Both museums are empty");return}
  const nA=sideName("A"),nB=sideName("B"),blob=await compareImage(nA,nB);if(!blob){toast("Couldn't draw the image");return}
  const filename=(`${nA} vs ${nB}`.replace(/[\\/:*?"<>|]+/g," ").trim().replace(/\.+$/,"")||"Museums")+" - Museum comparison.png";
  const ps=(()=>{try{return window.parent!==window&&typeof window.parent.ptSave==="function"?window.parent.ptSave:null}catch(e){return null}})();
  if(ps){try{await ps(filename,blob);toast((()=>{try{return window.parent.ptImgMsg()}catch(e){return "Image saved"}})())}catch(e){const c=e&&e.code;if(c!=="declined")toast(c==="rate_limited"?"A save prompt is already open":"Couldn't save the image here")}return}
  const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=filename;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},500)}
document.getElementById("cmpImg").onclick=saveCompare;
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
  const txt=ORDER.map(r=>r+": "+S[r].map(x=>x.m?x.m+(x.u&&x.u!=="None"?" ("+x.u+")":""):"empty").join(", ")).join("\n")+"\n\nTotal: "+STATS.filter(s=>Math.abs(t[s])>1e-9).map(s=>s+" "+fxT(t[s])).join(", ");
  const done=()=>toast("Setup copied");
  try{navigator.clipboard.writeText(txt).then(done,()=>fallback(txt))}catch(e){fallback(txt)}
};
function fallback(txt){const ta=document.createElement("textarea");ta.value=txt;ta.style.position="fixed";ta.style.opacity="0";document.body.appendChild(ta);ta.select();try{document.execCommand("copy");toast("Setup copied")}catch(e){toast("Copy not available here")}ta.remove()}
let tt;function toast(m){let el=document.querySelector(".toast");if(!el){el=document.createElement("div");el.className="toast";el.setAttribute("role","status");document.body.appendChild(el)}el.textContent=m;el.hidden=false;clearTimeout(tt);tt=setTimeout(()=>el.hidden=true,1600)}

renderBoard();renderSaved();document.getElementById("lname").placeholder="Name this board, e.g. "+PAGE_NAME;
