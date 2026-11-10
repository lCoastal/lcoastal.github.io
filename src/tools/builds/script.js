
// Random names: one adjective + one noun, drawn fresh on every page load
const NAME_ADJ=["Shiny","Lucky","Molten","Frozen","Glowing","Ancient","Mythic","Dusty","Golden","Cursed","Radiant","Hidden","Mighty","Swift","Heavy","Prismatic","Stormy","Crystal","Rusty","Royal","Sunlit","Moonlit","Gleaming","Rugged","Sparkling"];
const NAME_NOUN=["Pan","Shovel","Nugget","Geode","Vein","Sluice","Prospector","Digger","Ore","Haul","Dredge","Quarry","Relic","Totem","Lode","Cavern","Spade","Pebble","Treasure","Strike","Miner","Gemstone","Riverbed","Deposit","Jackpot"];
const pickOne=a=>a[Math.floor(Math.random()*a.length)];
const randomName=()=>pickOne(NAME_ADJ)+" "+pickOne(NAME_NOUN);
const PAGE_NAME=randomName();
const ORDER=["Exotic","Mythic","Legendary","Epic","Rare","Uncommon","Common"];
const SLOTS={Exotic:1,Mythic:2,Legendary:3,Epic:3,Rare:3,Uncommon:3,Common:3};
const RCOL={Exotic:"var(--r-exotic)",Mythic:"var(--r-mythic)",Legendary:"var(--r-legendary)",Epic:"var(--r-epic)",Rare:"var(--r-rare)",Uncommon:"var(--r-uncommon)",Common:"var(--r-common)"};
const CODE={"Luck":"L","Capacity":"C","Size Boost":"W","Dig Strength":"D","Dig Speed":"S","Sell Boost":"$","Walk Speed":"K","Modifier Boost":"M","Shake Strength":"A","Shake Speed":"P"};
// stat colours, the same as everywhere else in the toolkit (the sheet is always dark)
const SHX={"Luck":"#86f34a","Capacity":"#f0b44a","Size Boost":"#ff6b6b","Dig Strength":"#ff9d7f","Dig Speed":"#8ecbff","Sell Boost":"#ffd21f","Walk Speed":"#d6dbe0","Modifier Boost":"#39e06a","Shake Strength":"#ff8fb1","Shake Speed":"#b9a6ff"};
const STAT_RE=/\b(luck|capacity|size boost|sell boost|modifier boost|dig strength|dig speed|shake strength|shake speed|walk ?speed)\b/gi;
const statKeyB=w=>{const k=w.toLowerCase().replace("walkspeed","walk speed");return Object.keys(SHX).find(x=>x.toLowerCase()===k)};
// colour every stat name in the sheet's text (only text between tags, never inside attributes)
const colourStats=h=>{const i=h.indexOf("</h1>");const head=i>=0?h.slice(0,i+5):"";return head+cs0(i>=0?h.slice(i+5):h)};
const cs0=h=>h.replace(/>([^<]+)</g,(m,t)=>">"+t.replace(STAT_RE,w=>{const k=statKeyB(w);return k?`<span style="color:${SHX[k]}">${w}</span>`:w})+"<");
const CCOL={L:"#86f34a",C:"#f0b44a",W:"#ff6b6b",D:"#ff9d7f",S:"#8ecbff",$:"#ffd21f",K:"#d6dbe0",M:"#39e06a",A:"#ff8fb1",P:"#b9a6ff","2":"#86f34a","+":"#86f34a","-":"#ff5a5a"};
const D=[
["Copper","Common",60,[["Size Boost",.04]]],["Gold","Common",40,[["Sell Boost",.05]]],["Amethyst","Common",20,[["Dig Speed",.05]]],["Blue Ice","Common",40,[["Dig Speed",.05]]],["Pyrite","Common",60,[["Capacity",.05]]],["Silver","Common",40,[["Shake Speed",.05]]],["Platinum","Common",40,[["Dig Speed",.05]]],["Seashell","Common",20,[["Capacity",.05]]],["Obsidian","Common",30,[["Size Boost",.04]]],["Pearl","Common",20,[["Shake Speed",.05]]],
["Coral","Uncommon",10,[["Capacity",.08]]],["Glowberry","Uncommon",40,[["Sell Boost",.08]]],["Electrum","Uncommon",40,[["Sell Boost",.08]]],["Neodymium","Uncommon",40,[["Shake Strength",.08]]],["Smoky Quartz","Uncommon",20,[["Shake Strength",.08]]],["Malachite","Uncommon",20,[["Modifier Boost",.08]]],["Sapphire","Uncommon",20,[["Dig Speed",.08]]],["Rock Candy","Uncommon",60,[["Size Boost",.05]]],["Nickel","Uncommon",40,[["Capacity",.08]]],["Titanium","Uncommon",40,[["Dig Speed",.08]]],["Topaz","Uncommon",20,[["Capacity",.08]]],["Zircon","Uncommon",20,[["Size Boost",.05]]],
["Jade","Rare",40,[["Modifier Boost",.13]]],["Azuralite","Rare",30,[["Dig Speed",.13]]],["Glacial Quartz","Rare",40,[["Dig Speed",.13]]],["Amber","Rare",20,[["Sell Boost",.13]]],["Gloomberry","Rare",40,[["Dig Speed",.13]]],["Diopside","Rare",20,[["Modifier Boost",.13]]],["Candy Cane","Rare",40,[["Size Boost",.09]]],["Ruby","Rare",20,[["Shake Strength",.13]]],["Lapis Lazuli","Rare",30,[["Dig Speed",.13]]],["Silver Clamshell","Rare",20,[["Shake Speed",.13]]],["Peridot","Rare",20,[["Luck",.13]]],["Onyx","Rare",30,[["Modifier Boost",.13]]],["Meteoric Iron","Rare",40,[["Shake Strength",.13]]],["Pyrelith","Rare",30,[["Sell Boost",.13]]],["Sandsteel","Rare",30,[["Sell Boost",.13]]],
["Iridium","Epic",40,[["Dig Speed",.2]]],["Ammonite Fossil","Epic",50,[["Capacity",.2]]],["Ashvein","Epic",20,[["Size Boost",.14]]],["Emerald","Epic",20,[["Luck",.2]]],["Golden Pearl","Epic",20,[["Capacity",.2]]],["Borealite","Epic",20,[["Dig Speed",.2]]],["Aurorite","Epic",30,[["Dig Speed",.2]]],["Cobalt","Epic",40,[["Dig Speed",.2]]],["Glowmoss","Epic",60,[["Modifier Boost",.2]]],["Bone","Epic",50,[["Size Boost",.14]]],["Moonstone","Epic",50,[["Shake Speed",.2]]],["Pyronium","Epic",50,[["Sell Boost",.2]]],["Osmium","Epic",80,[["Size Boost",.2]]],["Opal","Epic",20,[["Shake Speed",.2]]],["Lightshard","Epic",20,[["Dig Speed",.2]]],["Mercury","Epic",80,[["Shake Strength",.2]]],["Meteoric Gold","Epic",40,[["Sell Boost",.2]]],["Selenite","Epic",30,[["Shake Speed",.2]]],
["Cinnabar","Legendary",20,[["Size Boost",.21]]],["Diamond","Legendary",20,[["Luck",.3]]],["Fire Opal","Legendary",20,[["Size Boost",.21]]],["Dragon Bone","Legendary",50,[["Size Boost",.21]]],["Catseye","Legendary",20,[["Capacity",.3]]],["Aetherite","Legendary",20,[["Dig Speed",.3]]],["Aquamarine","Legendary",20,[["Dig Speed",.3]]],["Firefly Stone","Legendary",60,[["Capacity",.3]]],["Bismuth","Legendary",80,[["Dig Speed",.3]]],["Gloomcap","Legendary",20,[["Dig Speed",.3]]],["Depleted Shard","Legendary",40,[["Dig Strength",.3]]],["Rose Gold","Legendary",40,[["Shake Strength",.3]]],["Palladium","Legendary",40,[["Sell Boost",.3]]],["Luminum","Legendary",40,[["Capacity",.3]]],["Specterite","Legendary",10,[["Shake Speed",.3]]],["Lost Soul","Legendary",20,[["Dig Speed",.3]]],["Peppermint Prism","Legendary",20,[["Modifier Boost",.3]]],["Radium","Legendary",60,[["Modifier Boost",.3]]],["Nautilus Shell","Legendary",50,[["Capacity",.3]]],["Jasper","Legendary",30,[["Sell Boost",.3]]],["Uranium","Legendary",60,[["Modifier Boost",.3]]],["Volcanic Key","Legendary",20,[["Size Boost",.21]]],["Starshine","Legendary",20,[["Dig Speed",.15],["Shake Speed",.15]]],["Tourmaline","Legendary",24,[["Sell Boost",.3]]],
["Inferlume","Mythic",20,[["Luck",.5]]],["Flarebloom","Mythic",20,[["Luck",.75],["Size Boost",-.5]]],["Frostshard","Mythic",20,[["Dig Strength",.5]]],["Chrysoberyl","Mythic",20,[["Luck",.5]]],["Aetherium","Mythic",20,[["Dig Speed",.5]]],["Agate","Mythic",40,[["Sell Boost",.5]]],["Pink Diamond","Mythic",20,[["Luck",.5]]],["Painite","Mythic",20,[["Size Boost",.35]]],["Prismara","Mythic",20,[["Luck",.25],["Capacity",.25],["Dig Strength",.25],["Shake Strength",.25]]],["Mythril","Mythic",60,[["Shake Strength",.5]]],["Radiant Gold","Mythic",60,[["Sell Boost",.5]]],["Star Garnet","Mythic",20,[["Size Boost",.35]]],["Red Beryl","Mythic",20,[["Size Boost",.35]]],["Vortessence","Mythic",20,[["Capacity",.5]]],["Volcanic Core","Mythic",20,[["Dig Strength",.25],["Size Boost",.2]]],["Sunstone","Mythic",40,[["Sell Boost",.5]]],
["Dinosaur Skull","Exotic",100,[["Sell Boost",.4],["Size Boost",.32]]],["Cryonic Artifact","Exotic",20,[["Dig Strength",1.2],["Shake Strength",1.2],["Dig Speed",-.8],["Shake Speed",-.8]]],["Bloodstone","Exotic",40,[["Size Boost",.56]]],["Astral Spore","Exotic",20,[["Dig Speed",.8]]],["Eternium","Exotic",20,[["Luck",.32],["Dig Speed",.32],["Shake Speed",.32]]],["Adamantine","Exotic",40,[["Modifier Boost",.8]]],["Celestium","Exotic",40,[["Luck",.48],["Shake Speed",.48]]],["Forgotten Totem","Exotic",40,[["Sell Boost",.8]]],["Eye of the Sands","Exotic",50,[["Sell Boost",.88]]],["Pumpkin Soul","Exotic",40,[["Size Boost",.56]]],["North Star","Exotic",40,[["Luck",.2],["Capacity",.2],["Dig Speed",.2],["Shake Speed",.2]]],["Singularium","Exotic",100,[["Capacity",.48],["Size Boost",.48]]],["Solarium","Exotic",40,[["Size Boost",.64]]],["Moonspire","Exotic",40,[["Dig Speed",.32],["Shake Speed",.32],["Walk Speed",.32]]],["Voidstone","Exotic",20,[["Luck",.4],["Capacity",.4]]],["Vineheart","Exotic",40,[["Luck",.8]]],["Umbrite","Exotic",40,[["Dig Speed",.4],["Shake Speed",.4]]],["Starpiercer","Exotic",40,[["Dig Strength",.48],["Shake Strength",.48]]],["Key of Life","Exotic",40,[["Luck",.88]]]
];
const BY=Object.fromEntries(D.map(d=>[d[0].toLowerCase(),d]));
const MODS={"Any":"","None":"","Perfect":"LCW","Treasured":"2L","Lunar":"SPK","Voidtorn":"LC","Mutated":"LDM","Cosmic":"CA","Electrified":"SP","Iridescent":"L","Irradiated":"M","Crystalline":"W","Scorching":"D","Glowing":"P","Pure":"S","Shiny":"A"};
const MODCOL={Perfect:"#5ef1e1",Treasured:"#ffd849",Lunar:"#ffe99b",Voidtorn:"#a35bff",Mutated:"#a07bff",Cosmic:"#ff5f9e",Electrified:"#ffeb0b",Iridescent:"#f36bff",Irradiated:"#67ff20",Crystalline:"#b7e6ff",Scorching:"#ff861c",Glowing:"#fff292",Pure:"#ffffff",Shiny:"#d4e7ff"};
const EQMUT={"":"",Silver:"#d6d6d6",Gold:"#ffcc33",Diamond:"#7fd8ff",Granite:"#c8a27a",Overclocked:"#6b8cff",Festive:"#ff6b6b",Prismatic:"#ff5fd2"};
const SUGGEST={
 charm:["Garden Glove","Jade Armband","Speed Coil","Lapis Armband","Gravity Coil","Lava Lantern","Guiding Light","Dragon Claw","Crown","Helm of the Round","Royal Federation Crown","Phoenix Wings","Cryogenic Preserver","Candy Sack","Bunny Ears","Santa Hat","Fossilized Crown","Antlers of Life","Excalibur","Pumpkin Lord","Starlight Wings","Timelocked Soul","Lunar Mask","Witch Hat","Dullahan's Curse","Clockwork"],
 neck:["Amethyst Pendant","Pearl Necklace","Topaz Necklace","Opal Amulet","Mass Accumulator","Spider Bowtie","Phoenix Heart","Celestial Rings","Amulet of Spirits","Shell Necklace","Amulet of Life","Frostthorn Pendant","Waverider","Venomshank","Meteor Core","Santa's Bag","Guardian Pendant"],
 ring:["Gold Ring","Titanium Ring","Smoke Ring","Ruby Ring","Meteor Ring","Moon Ring","Heart of the Ocean","Lightkeeper's Ring","Eye of Fire","Ring of Harvest","5 Gold Rings","Apocalypse Bringer","Mythril Ring","Prismatic Star","Purifying Ring","Ring of Thorns","Solar Ring","Vortex Ring","Umbrite Ring","Otherworldly Ring","Sun's Gift","Dredge Master's Ring","Accretion Disk","Ring of Champions","Ring of the Stars"],
 pan:["Plastic Pan","Metal Pan","Silver Pan","Golden Pan","Magnetic Pan","Meteoric Pan","Diamond Pan","Aurora Pan","Worldshaker","Dragonflame Pan","Fossilized Pan","Galactic Pan","Frostbite Pan","Lifetouched Pan","Pharaoh's","Nebula","Gingerbread"],
 shovel:["Iron Shovel","Steel Shovel","Silver Shovel","Reinforced Shovel","The Excavator","Golden Shovel","Meteoric Shovel","Diamond Shovel","Divine Shovel","Earthbreaker","Dragonflame Shovel","Fossilized Shovel","Galactic Shovel","Icebreaker","Lifetouched Shovel","Pharaoh's","Starcrusher","Venomspade","Candy Cane"]
};
const esc=s=>String(s??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const uid=()=>Math.random().toString(36).slice(2,10);
const PAN_EN=["Forceful","Strong","Swift","Lucky","Boosting","Destructive","Gigantic","Glowing","Greedy","Unstable","Blessed","Midas","Titanic","Cosmic","Divine","Infernal","Prismatic","Cursed","Devouring","Hyperspeed","Irregular","Mystical","Starstruck"];
const SH_EN=["Crystal Touch","Excavating","Geothermal","Mastered","Mythical","Non Euclidean","Overdrive","Rhythmic","Synergized","Tempered","Toughened","Treasure Hunter","Void Touched","Well Balanced","Wormhole"];
function blankBuild(name){return{id:uid(),name:name||randomName(),subtitle:"",warning:"",notes:"",author:"",mod:"Any",modFallback:"",museum:Object.fromEntries(ORDER.map(r=>[r,Array.from({length:SLOTS[r]},()=>({m:[],pick:1,join:"|",mark:"",span:1}))])),charm:{mut:"",name:"",note:""},neck:{mut:"",name:"",note:""},rings:[{count:"",mut:"",name:"",note:""}],split6:false,rings6:[],runes:"",pan:{name:"",enchant:"",trinket:"",note:""},shovel:{name:"",enchant:"",note:""},extras:[],updated:Date.now()}}

// ---------- storage ----------
let B=[],cur=null,armDel=false;
try{const x=JSON.parse(localStorage.getItem("pbs-builds")||"[]");if(Array.isArray(x))B=x.filter(b=>b&&b.id&&b.museum);}catch(e){}
try{cur=localStorage.getItem("pbs-current")}catch(e){}
if(!B.length){const b=blankBuild(PAGE_NAME);B.push(b);}
if(!B.find(b=>b.id===cur))cur=B[0].id;
const getB=()=>B.find(b=>b.id===cur);
let saveT;function persist(){clearTimeout(saveT);saveT=setTimeout(()=>{try{localStorage.setItem("pbs-builds",JSON.stringify(B));localStorage.setItem("pbs-current",cur)}catch(e){}},250)}

// ---------- sheet rendering ----------
function codesHTML(codes){return codes?`<span class="code">${[...codes].map(c=>`<span style="color:${CCOL[c]||"#fff"}">${esc(c)}</span>`).join("")}</span>`:""}
function mineralCodes(name){const d=BY[name.toLowerCase()];if(!d)return"";return d[3].map(([s,v])=>(v<0?"-":"")+CODE[s]).join("")}
// ---------- museum totals (first mineral in each slot + main modifier, at max weight) ----------
const STATS=["Luck","Size Boost","Sell Boost","Capacity","Modifier Boost","Dig Strength","Shake Strength","Dig Speed","Shake Speed","Walk Speed"];
const MULT={Common:.005,Uncommon:.0075,Rare:.0125,Epic:.02,Legendary:.03,Mythic:.05,Exotic:.08};
const MODSTATS={Perfect:[["Luck","Capacity","Size Boost"],1],Treasured:[["Luck"],2],Lunar:[["Dig Speed","Shake Speed","Walk Speed"],1],Voidtorn:[["Luck","Capacity"],1],Mutated:[["Luck","Dig Strength","Modifier Boost"],1],Cosmic:[["Capacity","Shake Strength"],1],Electrified:[["Dig Speed","Shake Speed"],1],Iridescent:[["Luck"],1],Irradiated:[["Modifier Boost"],1],Crystalline:[["Size Boost"],1],Scorching:[["Dig Strength"],1],Glowing:[["Shake Speed"],1],Pure:[["Dig Speed"],1],Shiny:[["Shake Strength"],1]};
const r4=v=>Math.round(v*1000)/1000;
const fx=v=>(v<0?"−":"+")+r4(Math.abs(v))+"×";
function covered(sl,i){for(let j=0;j<i;j++){if(j+Math.max(1,sl[j].span||1)>i)return true}return false}
function gainOf(name){const d=BY[name.toLowerCase()];return d?d[3]:[]}
function museumTotals(b,ov){const t=Object.fromEntries(STATS.map(s=>[s,0]));const md=MODSTATS[b.mod];
  ORDER.forEach(r=>{const sl=b.museum[r];sl.forEach((s,i)=>{if(covered(sl,i))return;const k=s.m.length>1&&s.pick>1?Math.min(s.pick,s.m.length):1;let names=s.m.slice(0,k);if(ov&&ov.r===r&&ov.i===i)names=[ov.name,...names.slice(1)];names.forEach(n=>{if(!n)return;gainOf(n).forEach(([st,v])=>t[st]+=v);if(md)md[0].forEach(st=>t[st]+=MULT[r]*md[1])})})});return t}
const gainsHTML=g=>g.map(([s,v])=>`<span class="${v<0?"neg":""}">${s} <em>${fx(v)}</em></span>`).join("");
function slotHTML(s){
  if(!s.m.length)return"";
  const parts=s.m.map(n=>{const d=BY[n.toLowerCase()];return `<span${d?` data-mineral="${esc(d[0])}"`:""}>${esc(d?d[0]:n)}${d?`<span class="kg">${d[2]}</span>`:""}</span>`});
  const codes=[...new Set(s.m.map(mineralCodes).join(""))].join("");
  const pick=s.m.length>1&&s.pick>1?`<span class="pick">pick ${s.pick}:</span> `:"";
  return `${codesHTML(codes)}${pick}${parts.join(s.join===">"?" &gt; ":" | ")}${s.mark?` <span class="mark">${esc(s.mark)}</span>`:""}`;
}
function modLabel(m){if(!m||m==="None")return"";if(m==="Any")return"Any";return `<span style="color:${MODCOL[m]||"#fff"}">${esc(m)}</span> ${codesHTML(MODS[m])}`}
function eqName(e){return (e.mut?`<span class="mu" style="color:${EQMUT[e.mut]}">${esc(e.mut)}</span>`:"")+esc(e.name)}
const STATN={L:"Luck",C:"Capacity",W:"Size Boost",D:"Dig Strength",S:"Dig Speed",$:"Sell Boost",K:"Walk Speed",M:"Modifier Boost",A:"Shake Strength",P:"Shake Speed"};
let viewMode="table";try{const v=localStorage.getItem("pbs-view");if(v==="text"||v==="table")viewMode=v}catch(e){}
// ---------- the sheet: pictures, names and readable layout ----------
const RHX={Exotic:"#f17ad6",Mythic:"#f0687f",Legendary:"#f2b53a",Epic:"#b880ee",Rare:"#68a6f0",Uncommon:"#6cc46e",Common:"#a3adb8"};
const PDATA=(()=>{try{return window.parent.PTDATA||null}catch(e){return null}})();
const normN=s=>String(s||"").toLowerCase().replace(/[’‘`]/g,"'").replace(/[^a-z0-9]/g,"");
const PICS=(()=>{const out={Equipment:[],Pan:[],Shovel:[],Rune:[]};if(!PDATA)return out;
  (PDATA.equip||[]).forEach(x=>out.Equipment.push(x.n));
  ((PDATA.gear||{}).pans||[]).forEach(x=>out.Pan.push(x.name));((PDATA.gear||{}).shovels||[]).forEach(x=>out.Shovel.push(x.name));
  ((PDATA.x2||{}).runes||[]).forEach(x=>out.Rune.push(x.n));return out})();
const picOf=(kind,name)=>{try{return window.parent.ptIcon(kind,name)||""}catch(e){return ""}};
// match a typed name like "Pharaoh’s" or "Waverider†" to the real item
function findItem(kind,typed){const t=normN(String(typed||"").split("|")[0]);if(!t)return null;const L=PICS[kind]||[];
  return L.find(n=>normN(n)===t)||L.find(n=>normN(n).startsWith(t))||L.find(n=>normN(n).includes(t))||null}
const imgTag=(u,cls)=>u?`<img src="${u}" alt=""${cls?` class="${cls}"`:""}>`:`<span class="ph"${cls?` class="${cls}"`:""}></span>`;
const gainSpans=d=>d?d[3].map(([s,v])=>`<span style="color:${SHX[s]||"#fff"}">${s} ${fx(v)}</span>`).join(""):"";
function slotCard(s,span){
  if(!s.m.length)return `<div class="sl empty"${span>1?` style="grid-column:span ${span}"`:""}>Any mineral</div>`;
  const multi=s.m.length>1;const pick=multi&&s.pick>1?Math.min(s.pick,s.m.length):1;
  const how=!multi?"":pick>1?`Pick ${pick} of these`:s.join===">"?"Best first, then the next":"Any one of these";
  const ops=s.m.map((n,i)=>{const d=BY[n.toLowerCase()];const nm=d?d[0]:n;
    return `<div class="op">${imgTag(d?picOf("Mineral",nm):"")}<span class="nm"${d?` data-mineral="${esc(nm)}"`:""}>${multi&&s.join===">"&&pick===1?`<span class="rk">${i+1}</span>`:""}${esc(nm)}</span><span class="gs">${gainSpans(d)}</span>${d?`<span class="kgl">Max boost at ${d[2]} kg</span>`:""}</div>`}).join("");
  return `<div class="sl"${span>1?` style="grid-column:span ${span}"`:""}>${how?`<span class="how">${how}</span>`:""}${ops}${s.mark?`<span class="mark">${esc(s.mark)}</span>`:""}</div>`}
function modTag(m){if(!m||m==="None"||m==="Any")return `<span class="modtag" style="color:#c7d0d9">Any modifier</span>`;const st=(MODSTATS[m]||[[]])[0];return `<span class="modtag" style="color:${MODCOL[m]||"#fff"}">${esc(m)}</span>${st.length?`<span class="k">boosts ${st.join(", ")}</span>`:""}`}
function gearCard(label,kind,e,extra,rs,count){
  const real=e.name?findItem(kind,e.name):null;const u=real?picOf(kind,real):"";
  const alts=String(e.name||"").split("|").map(x=>x.trim()).filter(Boolean);
  const main=alts[0]||"—";const altT=alts.slice(1);
  const mut=e.mut?`<span class="mu" style="color:${EQMUT[e.mut]}">${esc(e.mut)}</span>`:"";
  return `<div class="gc"${rs?` data-rs="${rs}"`:""}>${u?`<img src="${u}" alt="">`:`<span class="ph">${label.ico||""}</span>`}<div class="gt"><small>${esc(label.t)}</small><b>${mut}${esc(main)}${count?`<span class="cnt">${esc(count)}</span>`:""}</b>${altT.length?`<span class="alt">or ${altT.map(esc).join(" or ")}</span>`:""}${extra||""}${e.note?`<span class="nt">${esc(e.note)}</span>`:""}</div></div>`}
function quickChip(t,kind,name){const real=name?findItem(kind,name):null;const u=real?picOf(kind,real):"";return `<div class="qc">${u?`<img src="${u}" alt="">`:`<span class="ph"></span>`}<span><small>${t}</small><b>${esc(String(name).split("|")[0].trim())}</b></span></div>`}
// rings: always 8 slots; each ring is shown as many times as its count; with 6 ring slots, slots 7 and 8 are locked
const has6=b=>!!b.split6||(b.rings||[]).some(x=>String(x.count||"").includes("/"));
function ringSlots(b,v){const list=b.split6&&v===6?(b.rings6||[]):(b.rings||[]);const out=[];
  list.filter(x=>x.name).forEach(x=>{const c=String(x.count||"").trim();let n;
    if(c.includes("/")){const ps=c.split("/");n=parseInt(ps[b.split6?0:(v===8?0:1)])}else n=parseInt(c);if(!(n>=0))n=1;
    for(let k=0;k<n;k++)out.push({x,first:k===0})});
  return out.slice(0,v)}
function ringGrid(b,v,rs){const got=ringSlots(b,v);let h=`<div class="rings8"${rs?` data-rs="${rs}"`:""}>`;
  for(let i=0;i<8;i++){
    if(i>=v){h+=`<div class="rs lock"><span class="lk">🔒</span><small>Slot ${i+1}</small><span class="lt">Locked</span></div>`;continue}
    const g=got[i];if(!g){h+=`<div class="rs empty"><small>Slot ${i+1}</small><span class="lt">Any ring</span></div>`;continue}
    const e=g.x;const real=findItem("Equipment",e.name);const u=real?picOf("Equipment",real):"";const alts=String(e.name).split("|").map(t=>t.trim()).filter(Boolean);
    h+=`<div class="rs">${u?`<img src="${u}" alt="">`:`<span class="ph">💍</span>`}<small>Slot ${i+1}</small><b>${e.mut?`<span class="mu" style="color:${EQMUT[e.mut]}">${esc(e.mut)}</span>`:""}${esc(alts[0]||"")}</b>${g.first&&e.note?`<span class="lt">${esc(e.note)}</span>`:""}</div>`}
  return h+`</div>`}
function ringGrids(b){if(!(b.rings||[]).some(x=>x.name)&&!(b.rings6||[]).some(x=>x.name))return "";
  return `<div style="display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:8px;margin-top:6px"><h3 style="margin:0;font:700 11px/1 inherit;letter-spacing:.12em;text-transform:uppercase;color:#97a3b0">Rings</h3>${has6(b)?`<div class="rtoggle" role="group" aria-label="Ring slots shown"><span>Ring slots:</span><button type="button" data-rings="8" aria-pressed="${viewRings==="8"}">8 rings</button><button type="button" data-rings="6" aria-pressed="${viewRings==="6"}">6 rings</button></div>`:""}</div>`+(has6(b)?ringGrid(b,8,"8")+ringGrid(b,6,"6"):ringGrid(b,8,""))}
// ---- stats from the build, split by source (worked out by the Stat Calculator, kept until the build changes) ----
const SPCT=new Set(["Shake Speed","Dig Speed","Size Boost","Modifier Boost","Sell Boost"]);
let STATC={key:"",rows:null},statBusy="";
const nfs=(s,v)=>{const a=Math.abs(v);const d=s==="Luck"||s==="Capacity"?0:a<10?2:1;return (+a.toFixed(d)).toLocaleString("en-US",{maximumFractionDigits:d})};
const sv=(s,v,plus)=>!v?'<span class="z">—</span>':(plus?(v<0?"−":"+"):(v<0?"−":""))+nfs(s,v)+(SPCT.has(s)?"%":"");
function statKey(b){return JSON.stringify(calcState(b))}
function statsHTML(b,text){const key=statKey(b);
  if(STATC.key!==key){if(statBusy!==key){statBusy=key;try{window.parent.ptBuildStats(JSON.parse(key)).then(rows=>{STATC={key,rows:rows||[]};statBusy="";if(statKey(getB())===key)renderSheet()})}catch(e){statBusy=""}}return text?"":`<div class="blk"><h3><span class="n">4</span>Your stats</h3><span class="em">Working out stats…</span></div>`}
  const rows=STATC.rows||[];if(!rows.length)return "";
  if(text)return `<section><h2><span class="n">4</span>Your stats</h2><p class="dim" style="font-size:13px">Pan, shovel, equipment and museum only, before potions, totems and events.</p><ul>${rows.map(x=>`<li><b style="color:${SHX[x.s]||"inherit"}">${x.s}</b>: <b>${sv(x.s,x.total)}</b> <span class="gv">(${[x.tools?"pan & shovel "+sv(x.s,x.tools,1):"",x.jewelry?"equipment "+sv(x.s,x.jewelry,1):"",x.museum?"museum +"+(+x.museum.toFixed(3))+"×":""].filter(Boolean).join(", ")})</span></li>`).join("")}</ul></section>`;
  return `<div class="blk"><h3><span class="n">4</span>Your stats</h3><div class="stt"><div class="sth"><span>Stat</span><span>Pan &amp; shovel</span><span>Equipment</span><span>Museum</span><span>Total</span></div>${rows.map(x=>`<div class="str"><b style="color:${SHX[x.s]||"#e8ecf0"}">${x.s}</b><span>${sv(x.s,x.tools,1)}</span><span>${sv(x.s,x.jewelry,1)}</span><span>${x.museum?"+"+(+x.museum.toFixed(3))+"×":'<span class="z">—</span>'}</span><span class="tt">${sv(x.s,x.total)}</span></div>`).join("")}</div><span class="em" style="font-size:12px">Pan, shovel, equipment and museum only, before potions, totems and events. Total = (pan &amp; shovel + equipment) × (1 + museum).</span></div>`}
// shown text: ";" reads as ",", and a ";" at the end of a line is dropped
const tidyT=t=>String(t).replace(/[ \t]*;[ \t]*$/gm,"").replace(/\s*;\s*/g,", ");
const tidy=o=>{if(typeof o==="string")return tidyT(o);if(Array.isArray(o))return o.map(tidy);if(o&&typeof o==="object"){const r={};for(const k in o)r[k]=k==="pic"||k==="id"?o[k]:tidy(o[k]);return r}return o};
function sheetHTML(b0){if(viewMode==="text")return textHTML(b0);const b=tidy(b0);
  const notes=b.notes.split("\n").map(s=>s.trim()).filter(Boolean);
  let h=`<div class="sheet" data-rings="${has6(b)?viewRings:""}"><div class="bh">${b.pic?`<img class="bpic" src="${b.pic}" alt="">`:""}<div class="bht"><h1>${esc(b.name)||"Untitled build"}</h1>${b.subtitle?`<p class="sub">${esc(b.subtitle)}</p>`:""}</div></div>`;
  if(b.warning)h+=`<div class="warnbox"><b>⚠</b><span>${esc(b.warning)}</span></div>`;
  const q=[];if(b.pan.name)q.push(quickChip("Pan","Pan",b.pan.name));if(b.shovel.name)q.push(quickChip("Shovel","Shovel",b.shovel.name));if(b.charm.name)q.push(quickChip("Charm","Equipment",b.charm.name));if(b.neck.name)q.push(quickChip("Necklace","Equipment",b.neck.name));
  if(notes.length)h+=`<div class="tips"><h3>Read this first</h3><ul>${notes.map(n=>`<li><span>${esc(n)}</span></li>`).join("")}</ul></div>`;
  // museum
  h+=`<div class="blk"><h3><span class="n">1</span>Museum</h3><div class="modline"><span class="k">Modifier on every mineral:</span>${modTag(b.mod)}${b.modFallback&&b.modFallback!=="None"?`<span class="k">· if you can't, use</span>${modTag(b.modFallback)}`:""}</div>`;
  ORDER.forEach(r=>{const sl=b.museum[r];let cells="";for(let i=0;i<sl.length;i++){if(covered(sl,i))continue;const sp=Math.min(Math.max(1,sl[i].span||1),sl.length-i);cells+=slotCard(sl[i],sp)}
    h+=`<div class="rrow" style="--rc:${RHX[r]}"><div class="rlab"><b>${r}</b><span>${sl.length} slot${sl.length>1?"s":""}</span></div><div class="slots">${cells}</div></div>`});
  const t=museumTotals(b);const tl=STATS.filter(s=>Math.abs(t[s])>1e-9);
  if(tl.length)h+=`<div class="tot">${tl.map(s=>`<span style="border-color:${SHX[s]}55"><span style="color:${SHX[s]}">${s}</span><em style="color:${t[s]<0?"#ef7a66":"#e8ecf0"}">${fx(t[s])}</em></span>`).join("")}</div><span class="em" style="font-size:12px">Museum total with the first choice in each slot at full weight, including the modifier.</span>`;
  const XS=(b.extra||[]).filter(x=>x&&x.n);if(XS.length)h+=`<div class="xtra"><h4>Backup minerals <span>if one is hard to get</span></h4><div class="xl">${XS.map(x=>{const d=BY[String(x.n).toLowerCase()];const u=d?picOf("Mineral",d[0]):"";return `<div class="xc" style="--rc:${d?RHX[d[1]]:"#56616c"}">${u?`<img src="${u}" alt="">`:""}<span><b style="color:var(--rc)">${esc(d?d[0]:x.n)}</b>${d?`<span class="gs">${gainSpans(d)}</span><small class="kgl">Max boost at ${d[2]} kg</small>`:""}${x.note?`<small class="xnote">${esc(x.note)}</small>`:""}</span></div>`}).join("")}</div></div>`;
  h+=`</div>`;
  // gear
  const cards=[];
  if(b.charm.name||b.charm.note)cards.push(gearCard({t:"Charm",ico:"🔗"},"Equipment",b.charm));
  if(b.neck.name||b.neck.note)cards.push(gearCard({t:"Necklace",ico:"📿"},"Equipment",b.neck));
  h+=`<div class="blk"><h3><span class="n">2</span>Equipment</h3>`;
  h+=cards.length?`<div class="gear">${cards.join("")}</div>`:"";
  h+=ringGrids(b);
  if(b.runes){const rs=b.runes.split(",").map(x=>x.trim()).filter(Boolean);h+=`<h3 style="margin:6px 0 0;font:700 11px/1 inherit;letter-spacing:.12em;text-transform:uppercase;color:#97a3b0">Runes</h3><div class="runes">${rs.map(x=>{const parts=x.split("/").map(y=>y.trim());return `<span>${parts.map(p=>{const real=findItem("Rune",p);const u=real?picOf("Rune",real):"";return (u?`<img src="${u}" alt="">`:"")+esc(p)}).join(' <i class="alt">or</i> ')}</span>`}).join("")}</div>`}
  // extra rows go last, after the rings and runes (same order as the text view)
  const xc=b.extras.filter(x=>x.label||x.name).map(x=>gearCard({t:x.label||"Other",ico:"✦"},"Equipment",x));
  if(xc.length)h+=`<div class="gear" style="margin-top:8px">${xc.join("")}</div>`;
  h+=`</div>`;
  // pan + shovel
  const tc=[];
  if(b.pan.name||b.pan.enchant||b.pan.trinket)tc.push(gearCard({t:"Pan",ico:"🥘"},"Pan",b.pan,`${b.pan.enchant?`<span class="ex"><i>Enchant</i> ${esc(b.pan.enchant)}</span>`:""}${b.pan.trinket?`<span class="ex"><i>Trinket</i> ${esc(b.pan.trinket)}</span>`:""}`));
  if(b.shovel.name||b.shovel.enchant)tc.push(gearCard({t:"Shovel",ico:"⛏"},"Shovel",b.shovel,b.shovel.enchant?`<span class="ex"><i>Enchant</i> ${esc(b.shovel.enchant)}</span>`:""));
  if(tc.length)h+=`<div class="blk"><h3><span class="n">3</span>Pan &amp; shovel</h3><div class="gear">${tc.join("")}</div></div>`;
  if(b.author)h+=`<p class="author">${esc(b.author)}</p>`;
  return colourStats(h+`</div>`)}
function slotText(s){if(!s.m.length)return '<span class="dim">any mineral</span>';
  const one=n=>{const d=BY[n.toLowerCase()];const nm=d?d[0]:n;const u=d?picOf("Mineral",nm):"";const g=d?d[3].map(([st,v])=>`${st} ${fx(v)}`).join(", "):"";return `${u?`<img src="${u}" alt="">`:""}<span${d?` data-mineral="${esc(nm)}"`:""}><b>${esc(nm)}</b></span>${d?` <span class="gv">(${g}, needs ${d[2]} kg)</span>`:""}`};
  let t;if(s.m.length===1)t=one(s.m[0]);
  else if(s.pick>1)t=`pick ${Math.min(s.pick,s.m.length)}: ${s.m.map(one).join(", ")}`;
  else if(s.join===">")t=s.m.map(one).join(" → if you don't have it, ");
  else t=s.m.map(one).join(" <span class=\"dim\">or</span> ");
  return t+(s.mark?` <span class="mark">${esc(s.mark)}</span>`:"")}
function textHTML(b0){const b=tidy(b0);const notes=b.notes.split("\n").map(s=>s.trim()).filter(Boolean);
  const modT=m=>!m||m==="None"||m==="Any"?"<b>any</b>":`<b style="color:${MODCOL[m]||"inherit"}">${esc(m)}</b>`;
  let h=`<div class="sheet" data-rings="${b.split6?viewRings:""}"><div class="bh">${b.pic?`<img class="bpic" src="${b.pic}" alt="">`:""}<div class="bht"><h1>${esc(b.name)||"Untitled build"}</h1>${b.subtitle?`<p class="sub">${esc(b.subtitle)}</p>`:""}</div></div>`;
  if(b.warning)h+=`<div class="warnbox"><b>⚠</b><span>${esc(b.warning)}</span></div>`;
  if(b.split6)h+=`<div class="rtoggle" role="group" aria-label="Ring slots shown"><span>Ring slots:</span><button type="button" data-rings="8" aria-pressed="${viewRings==="8"}">8 rings</button><button type="button" data-rings="6" aria-pressed="${viewRings==="6"}">6 rings</button></div>`;
  h+=`<div class="tx">`;
  if(notes.length)h+=`<section class="tsm"><h2>Read this first</h2><ul>${notes.map(n=>`<li>${esc(n)}</li>`).join("")}</ul></section>`;
  h+=`<section><h2><span class="n">1</span>Museum</h2><p>Use ${modT(b.mod)} modifier on every mineral${b.modFallback&&b.modFallback!=="None"?`; if you can't get it, use ${modT(b.modFallback)}`:""}. Put these in each rarity:</p><ul>`;
  ORDER.forEach(r=>{const sl=b.museum[r];const items=sl.map((s,i)=>covered(sl,i)?null:s).filter(Boolean);
    h+=`<li><span class="r" style="color:${RHX[r]}">${r}</span> <span class="dim">(${sl.length} slot${sl.length>1?"s":""})</span><ol>${items.map(s=>`<li>${slotText(s)}</li>`).join("")}</ol></li>`});
  h+=`</ul>`;
  {const XS=(b.extra||[]).filter(x=>x&&x.n);if(XS.length)h+=`<p>Backup minerals, if one is hard to get:</p><ul>${XS.map(x=>{const d=BY[String(x.n).toLowerCase()];return `<li><b${d?` style="color:${RHX[d[1]]}"`:""}>${esc(d?d[0]:x.n)}</b>${d?` <span class="dim">(${d[1]})</span> ${d[3].map(([st,v])=>`${st} ${fx(v)}`).join(", ")}, max boost at ${d[2]} kg`:""}${x.note?` · ${esc(x.note)}`:""}</li>`}).join("")}</ul>`}
  h+=`</section>`;
  const nm=(kind,e)=>{const real=e.name?findItem(kind,e.name):null;const u=real?picOf(kind,real):"";return (u?`<img src="${u}" alt="">`:"")+(e.mut?`<span style="color:${EQMUT[e.mut]}">${esc(e.mut)}</span> `:"")+`<b>${esc(e.name)}</b>`};
  const nt=n=>n?` <span class="dim">· ${esc(n)}</span>`:"";const eq=[];
  if(b.charm.name||b.charm.note)eq.push(`Charm: ${nm("Equipment",b.charm)}${nt(b.charm.note)}`);
  if(b.neck.name||b.neck.note)eq.push(`Necklace: ${nm("Equipment",b.neck)}${nt(b.neck.note)}`);
  const rings=(list,label,rs)=>{const xs=list.filter(x=>x.name||x.note);if(xs.length)eq.push([`${label}:<ul>${xs.map(x=>`<li>${x.count?`<b>${esc(x.count)}</b> `:""}${nm("Equipment",x)}${nt(x.note)}</li>`).join("")}</ul>`,rs])};
  if(b.split6){rings(b.rings,"Rings (8 ring slots)","8");rings(b.rings6||[],"Rings (6 ring slots)","6")}else rings(b.rings,"Rings","");
  if(b.runes)eq.push(`Runes: <b>${esc(b.runes)}</b>`);
  b.extras.filter(x=>x.label||x.name).forEach(x=>eq.push(`${esc(x.label||"Other")}: ${nm("Equipment",x)}${nt(x.note)}`));
  h+=`<section><h2><span class="n">2</span>Equipment</h2>${eq.length?`<ul>${eq.map(x=>Array.isArray(x)?`<li${x[1]?` data-rs="${x[1]}"`:""}>${x[0]}</li>`:`<li>${x}</li>`).join("")}</ul>`:'<p class="dim">No equipment yet.</p>'}</section>`;
  const tl=[];
  if(b.pan.name||b.pan.enchant)tl.push(`Pan: ${nm("Pan",b.pan)}${b.pan.enchant?` with the <b>${esc(b.pan.enchant)}</b> enchant`:""}${b.pan.trinket?` and the <b>${esc(b.pan.trinket)}</b> trinket`:""}${nt(b.pan.note)}`);
  if(b.shovel.name||b.shovel.enchant)tl.push(`Shovel: ${nm("Shovel",b.shovel)}${b.shovel.enchant?` with the <b>${esc(b.shovel.enchant)}</b> enchant`:""}${nt(b.shovel.note)}`);
  if(tl.length)h+=`<section><h2><span class="n">3</span>Pan &amp; shovel</h2><ul>${tl.map(x=>`<li>${x}</li>`).join("")}</ul></section>`;
  h+=`</div>${b.author?`<p class="author">${esc(b.author)}</p>`:""}</div>`;return colourStats(h)}
let viewRings="8";try{const v=localStorage.getItem("pbs-rings");if(v==="6"||v==="8")viewRings=v}catch(e){}
function renderSheet(){document.querySelectorAll(".vtoggle [data-view]").forEach(x=>x.setAttribute("aria-pressed",String(x.dataset.view===viewMode)));document.getElementById("sheet").innerHTML=sheetHTML(getB())}
document.querySelector(".vtoggle").addEventListener("click",e=>{const t=e.target.closest("[data-view]");if(!t)return;viewMode=t.dataset.view;try{localStorage.setItem("pbs-view",viewMode)}catch(err){}renderSheet()});
document.getElementById("sheet").addEventListener("click",e=>{const t=e.target.closest(".rtoggle button");if(!t)return;viewRings=t.dataset.rings;try{localStorage.setItem("pbs-rings",viewRings)}catch(err){}renderSheet()});

// ---------- editor ----------
function dl(id,list){return `<datalist id="${id}">${list.map(x=>`<option value="${esc(x)}"></option>`).join("")}</datalist>`}
function opts(list,v){return list.map(o=>`<option value="${esc(o)}"${o===v?" selected":""}>${esc(o||"—")}</option>`).join("")}
// example subtitles, one picked at random each time the editor is drawn
const SUB_EX=["Highest average rerolls","Best for Exotic hunting","Max luck, no limited gear","Cheap early-game setup","Fast panning for sell runs","Size-focused for museum weights","Modifier farming build","Balanced all-rounder","Endgame luck stack","Budget build for new players","Night farming setup","Treasure hunting build","Speed build for quests","Big pans, big hauls"];
// Build info, Museum and Equipment can be collapsed; remembered between visits
let FOLD={};try{FOLD=JSON.parse(localStorage.getItem("pbs-fold")||"{}")||{}}catch(e){}
function foldSetup(){document.querySelectorAll("#editor > section.card > h2").forEach(h=>{const k=h.firstChild.textContent.trim();h.classList.add("fold");h.tabIndex=0;h.setAttribute("role","button");
  const card=h.parentElement;const shut=!!FOLD[k];card.classList.toggle("shut",shut);h.setAttribute("aria-expanded",String(!shut));h.title=shut?"Show this section":"Collapse this section";
  if(!h.querySelector(".fh")){const s=document.createElement("span");s.className="fh";h.appendChild(s)}h.querySelector(".fh").textContent=shut?"Show":"Hide"})}
function foldToggle(h){const k=h.firstChild.textContent.trim();FOLD[k]=!FOLD[k];try{localStorage.setItem("pbs-fold",JSON.stringify(FOLD))}catch(e){}foldSetup()}
document.addEventListener("click",e=>{const h=e.target.closest&&e.target.closest("#editor h2.fold");if(h)foldToggle(h)});
document.addEventListener("keydown",e=>{const h=e.target.closest&&e.target.closest("#editor h2.fold");if(h&&(e.key==="Enter"||e.key===" ")){e.preventDefault();foldToggle(h)}});
function renderEditor(){
  const b=getB();const ed=document.getElementById("editor");
  const modList=Object.keys(MODS);
  let h=`<section class="card"><h2>Build info</h2>
  <label class="field"><span>Title</span><input class="inp" autocomplete="off" id="f-name" value="${esc(b.name)}" placeholder="e.g. ${esc(randomName())}"></label>
  <div class="row"><label class="field"><span>Subtitle</span><input class="inp" autocomplete="off" id="f-subtitle" maxlength="120" value="${esc(b.subtitle)}" placeholder="e.g. ${esc(SUB_EX[Math.floor(Math.random()*SUB_EX.length)])}"></label>
  <label class="field"><span>Warning (shown in red)</span><input class="inp" autocomplete="off" id="f-warning" maxlength="200" value="${esc(b.warning)}" placeholder="e.g. Needs modification for Fungal Marsh"></label></div>
  <label class="field"><span>Notes, one bullet per line</span><textarea class="inp" id="f-notes" maxlength="1500" placeholder="This is a one-tap build.&#10;Use with Luck, Strength and Luminant totems.">${esc(b.notes)}</textarea></label>
  <label class="field"><span>Author / credit</span><input class="inp" autocomplete="off" id="f-author" maxlength="60" value="${esc(b.author)}" placeholder="e.g. YourName (@handle)"></label>
  <div class="field"><span>Picture <small style="font-weight:400;color:var(--muted)">shown top left, cropped to a square</small></span><div class="picrow">${b.pic?`<img class="picprev" src="${b.pic}" alt="">`:`<span class="picprev none">No picture</span>`}<label class="btn sm" for="f-pic">${b.pic?"Change":"Upload image"}</label><input type="file" id="f-pic" accept="image/*" hidden>${b.pic?`<button type="button" class="btn sm" data-act="rmpic">Remove</button>`:""}</div></div></section>`;
  h+=`<section class="card"><h2>Museum</h2>
  <div class="row"><label class="field"><span>Modifier</span><select class="inp" id="f-mod">${opts(modList.filter(m=>m!=="None"),b.mod)}</select></label>
  <label class="field"><span>Fallback modifier</span><select class="inp" id="f-modFallback">${opts(["",...modList.filter(m=>m!=="Any"&&m!=="None")],b.modFallback)}</select></label></div>
  <p class="hint">Click a slot’s box to see every mineral with what it gives; hover one to preview the museum total. Add more than one to a slot to list choices; the first one counts in the total.</p>
  <div class="row" style="margin-bottom:8px"><button class="btn sm" type="button" data-act="mymuseum" title="Fill these slots and the modifier from your current board on the Museum Planner page">Use my Museum Planner board</button></div>
  <div class="mtot"><div class="mtoth"><b>Museum total</b><span>first mineral in each slot + main modifier, at max weight</span></div><div class="mtotv" id="mtot"></div></div>`;
  const mname=n=>BY[n.toLowerCase()]?BY[n.toLowerCase()][0]:n;
  ORDER.forEach(r=>{const sl=b.museum[r];
    h+=`<div class="rar" style="--rc:${RHX[r]}"><div class="rarh"><i></i><b>${r}</b><span>${sl.length} slot${sl.length>1?"s":""}</span></div><div class="slotgrid">`;
    sl.forEach((s,i)=>{if(covered(sl,i))return;const sp=Math.min(Math.max(1,s.span||1),sl.length-i);const maxSpan=SLOTS[r]-i;
      const how=s.m.length>1?(s.pick>1?`Pick ${Math.min(s.pick,s.m.length)}`:s.join===">"?"Best first":"Any one"):"";
      h+=`<div class="se"${sp>1?` style="grid-column:span ${sp}"`:""}><div class="seh"><span>Slot ${i+1}${sp>1?`–${i+sp}`:""}</span>${how?`<em>${how}</em>`:""}${s.mark?`<em class="mk">${esc(s.mark)}</em>`:""}</div>
      ${s.m.length?`<div class="mlist">${s.m.map((n,k)=>{const nm=mname(n);const u=BY[n.toLowerCase()]?picOf("Mineral",nm):"";return `<div class="mrow${k===0?" counted":""}" data-mineral="${esc(nm)}" title="${k===0?"Counted in the museum total":"Alternative, not counted in the total"}">${u?`<img src="${u}" alt="">`:`<span class="np"></span>`}<span class="mt"><b>${esc(nm)}</b><span class="cg">${gainsHTML(gainOf(n))}</span></span><button type="button" class="rmx" aria-label="Remove ${esc(n)}" data-act="rm" data-r="${r}" data-i="${i}" data-k="${k}">×</button></div>`}).join("")}</div>`:""}
      <div class="sugg"><input class="inp addm" placeholder="${s.m.length?"+ Add another choice":"+ Add "+(/^[AEIOU]/.test(r)?"an ":"a ")+r.toLowerCase()+" mineral"}" data-act="add" data-r="${r}" data-i="${i}" id="add-${r}-${i}" autocomplete="off" role="combobox" aria-expanded="false" aria-autocomplete="list" aria-controls="sb-${r}-${i}"><div class="sbox" id="sb-${r}-${i}" role="listbox" hidden></div></div>
      </div>`;
    });
    h+=`</div></div>`;
  });
  const XS=b.extra||[];
  h+=`<div class="xed"><div class="xedh"><b>Backup minerals</b><span>In case one is hard to get. Shown on the sheet, not counted in the total.</span></div>
    ${XS.map((x,k)=>{const d=BY[String(x.n).toLowerCase()];const u=d?picOf("Mineral",d[0]):"";return `<div class="xrow" style="--rc:${d?RHX[d[1]]:"var(--line)"}">${u?`<img src="${u}" alt="">`:`<span class="np"></span>`}<span class="xn"><b style="color:var(--rc)">${esc(d?d[0]:x.n)}</b>${d?`<small>${d[1]} · max boost at ${d[2]} kg</small><span class="cg">${gainsHTML(d[3])}</span>`:""}</span><input class="inp" autocomplete="off" data-act="xnote" data-k="${k}" maxlength="80" value="${esc(x.note||"")}" placeholder="Note, e.g. instead of Bloodstone" aria-label="Note for ${esc(x.n)}"><button type="button" class="rmx" data-act="xrm" data-k="${k}" aria-label="Remove ${esc(x.n)}">×</button></div>`}).join("")}
    <div class="xadd"><input class="inp" id="xIn" autocomplete="off" placeholder="+ Add a backup mineral" aria-label="Add a backup mineral"><div class="xbox" id="xBox" hidden></div></div></div>`;
  h+=`</section>`;
  const mutSel=(id,v)=>`<input class="inp mutin" readonly id="${id}" data-sg="dl-mut" value="${esc(v||"")}" placeholder="No mutation" aria-label="Equipment mutation"${v&&EQMUT[v]?` style="color:${EQMUT[v]}"`:""}>`;
  const gpic=(kind,name)=>{const real=name?findItem(kind,name):null;const u=real?picOf(kind,real):"";return `<span class="gpic" data-pk="${kind}">${u?`<img src="${u}" alt="">`:""}</span>`};
  h+=`<section class="card"><h2>Equipment</h2><div class="gedits">
  <div class="ge"><div class="geh">${gpic("Equipment",b.charm.name)}<b>Charm</b></div><div class="g2"><input class="inp" autocomplete="off" id="f-charm-name" list="dl-charm" data-pk="Equipment" value="${esc(b.charm.name)}" placeholder="Charm name">${mutSel("f-charm-mut",b.charm.mut)}</div><input class="inp" autocomplete="off" id="f-charm-note" maxlength="100" value="${esc(b.charm.note)}" placeholder="Notes, e.g. fallback: Pumpkin Lord"></div>
  <div class="ge"><div class="geh">${gpic("Equipment",b.neck.name)}<b>Necklace</b></div><div class="g2"><input class="inp" autocomplete="off" id="f-neck-name" list="dl-neck" data-pk="Equipment" value="${esc(b.neck.name)}" placeholder="Necklace name">${mutSel("f-neck-mut",b.neck.mut)}</div><input class="inp" autocomplete="off" id="f-neck-note" maxlength="100" value="${esc(b.neck.note)}" placeholder="Notes"></div></div>
  <div class="ringh"><b>Rings</b><label class="mini" style="color:var(--fg)"><input type="checkbox" id="f-split6"${b.split6?" checked":""}> Separate 8-slot and 6-slot setups</label></div>`;
  const ringList=(list,p,act,ph)=>{let s="";list.forEach((x,i)=>{s+=`<div class="rge">${gpic("Equipment",x.name)}<input class="inp cnt" autocomplete="off" id="${p}-count-${i}" value="${esc(x.count)}" placeholder="${ph}" aria-label="Count"><input class="inp" autocomplete="off" id="${p}-name-${i}" list="dl-ring" data-pk="Equipment" value="${esc(x.name)}" placeholder="Ring" aria-label="Ring name">${mutSel(p+"-mut-"+i,x.mut)}<input class="inp nt" autocomplete="off" id="${p}-note-${i}" maxlength="100" value="${esc(x.note)}" placeholder="Notes" aria-label="Ring notes"><button type="button" class="x" data-act="rm${act}" data-i="${i}" aria-label="Remove ring">×</button></div>`});return s+`<div class="row"><button class="btn sm" type="button" data-act="add${act}">+ Add ring</button></div>`};
  const cnt=list=>list.reduce((a,x)=>a+(parseInt(x.count)||0),0);
  if(b.split6){
    h+=`<p class="hint"><b>8 ring slots</b> · <span id="cnt8">${cnt(b.rings)}</span>/8 used</p>${ringList(b.rings,"ring","ring","5×")}`;
    h+=`<p class="hint"><b>6 ring slots</b> · <span id="cnt6">${cnt(b.rings6)}</span>/6 used</p>${ringList(b.rings6,"ring6","ring6","3×")}`;
  } else h+=ringList(b.rings,"ring","ring","1×");
  h+=`
  <div class="field"><span>Runes <small style="font-weight:400;color:var(--muted)">one per slot; use / for "either", e.g. Sunblessed/Abyssal</small></span><div class="runegrid">${rslots(b).map((v,i)=>`<input class="inp" autocomplete="off" id="rn-${i}" list="dl-rune" value="${esc(v)}" placeholder="Slot ${i+1}" aria-label="Rune slot ${i+1}">`).join("")}</div><div class="row" style="margin-top:6px"><button class="btn sm" type="button" data-act="myrunes" title="Fill these slots from your loadout on the Runes page">Use my Runes loadout</button></div></div>
  <div class="gedits">
  <div class="ge"><div class="geh">${gpic("Pan",b.pan.name)}<b>Pan</b></div><input class="inp" autocomplete="off" id="f-pan-name" list="dl-pan" data-pk="Pan" value="${esc(b.pan.name)}" placeholder="Pan"><div class="g2 half"><input class="inp" autocomplete="off" id="f-pan-enchant" list="dl-panen" value="${esc(b.pan.enchant)}" placeholder="Enchant"><input class="inp" autocomplete="off" id="f-pan-trinket" list="dl-trinket" value="${esc(b.pan.trinket)}" placeholder="Trinket (optional)"></div></div>
  <div class="ge"><div class="geh">${gpic("Shovel",b.shovel.name)}<b>Shovel</b></div><input class="inp" autocomplete="off" id="f-shovel-name" list="dl-shovel" data-pk="Shovel" value="${esc(b.shovel.name)}" placeholder="Shovel"><div class="g2 half"><input class="inp" autocomplete="off" id="f-shovel-enchant" list="dl-shen" value="${esc(b.shovel.enchant)}" placeholder="Enchant"><input class="inp" autocomplete="off" id="f-shovel-note" maxlength="100" value="${esc(b.shovel.note)}" placeholder="Notes"></div></div></div>
  <b>Extra rows</b><p class="hint">For totems, potions, trinkets or anything else.</p>`;
  b.extras.forEach((x,i)=>{h+=`<div class="eqrow"><input class="inp" autocomplete="off" id="ex-label-${i}" value="${esc(x.label)}" placeholder="Label" aria-label="Row label"><input class="inp" autocomplete="off" id="ex-name-${i}" value="${esc(x.name)}" placeholder="Name" aria-label="Row name"><input class="inp" autocomplete="off" id="ex-note-${i}" maxlength="100" value="${esc(x.note)}" placeholder="Notes" aria-label="Row notes"><button type="button" class="x" data-act="rmex" data-i="${i}" aria-label="Remove row">×</button></div>`});
  h+=`<div class="row"><button class="btn sm" type="button" data-act="addex">Add row</button></div>
  ${dl("dl-charm",SUGGEST.charm)}${dl("dl-neck",SUGGEST.neck)}${dl("dl-ring",SUGGEST.ring)}${dl("dl-pan",SUGGEST.pan)}${dl("dl-shovel",SUGGEST.shovel)}${dl("dl-panen",PAN_EN)}${dl("dl-shen",SH_EN)}${dl("dl-rune",RUNE_NAMES)}${dl("dl-trinket",TRINKETS)}</section>`;
  ed.innerHTML=h;SG=null;renderMTot();hookSugg();foldSetup();
}
// runes: five slots, kept in step with the comma list the sheet shows
const RUNE_NAMES=(()=>{try{const X=window.parent.PTDATA.x2||{};return (X.runes||[]).map(r=>r.n)}catch(e){return []}})();
const TRINKETS=["Alchemist's Crucible","Beach Umbrella","Duplicator","Golden Chalice","Mass Reactor","Tombstone"];
function rslots(b){if(!Array.isArray(b.runeSlots)){const p=String(b.runes||"").split(/\s*,\s*/).filter(Boolean);const a=p.slice(0,4);a.push(p.slice(4).join(", "));b.runeSlots=Array.from({length:5},(_,i)=>a[i]||"")}return b.runeSlots}
const syncRunes=b=>{b.runes=rslots(b).map(x=>String(x||"").trim()).filter(x=>x&&x.toLowerCase()!=="none").join(", ")};
function setPath(b,id,v){
  const rn=id.match(/^rn-(\d)$/);if(rn){rslots(b)[+rn[1]]=v;syncRunes(b);return true}
  const m=id.match(/^f-(\w+)(?:-(\w+))?$/);
  if(m){if(m[2])b[m[1]][m[2]]=v;else b[m[1]]=v;return true}
  let r=id.match(/^ring-(count|name|mut|note)-(\d+)$/);if(r){b.rings[+r[2]][r[1]]=v;return true}
  r=id.match(/^ring6-(count|name|mut|note)-(\d+)$/);if(r){b.rings6[+r[2]][r[1]]=v;return true}
  r=id.match(/^ex-(label|name|note)-(\d+)$/);if(r){b.extras[+r[2]][r[1]]=v;return true}
  return false;
}
const ed=document.getElementById("editor");
ed.addEventListener("input",e=>{const t=e.target,b=getB();if(t.dataset.act==="add"||t.type==="checkbox")return;
  if(t.dataset.act==="pick"){b.museum[t.dataset.r][+t.dataset.i].pick=Math.max(1,Math.min(+t.value||1,b.museum[t.dataset.r][+t.dataset.i].m.length))}
  else if(!setPath(b,t.id,t.value))return;
  if(t.id==="f-name")renderSelect();
  if(/^ring6?-count-/.test(t.id)){const c=l=>(l||[]).reduce((a,x)=>a+(parseInt(x.count)||0),0);const e8=document.getElementById("cnt8"),e6=document.getElementById("cnt6");if(e8)e8.textContent=c(b.rings);if(e6)e6.textContent=c(b.rings6)}
  touch()});
// rings the game only lets you wear one of at a time
const ONE_ONLY=new Set(["dredge master's ring","ring of champions","ring of the stars"]);
function enforceOneOnly(t,b){const r=t.id.match(/^(ring6?)-(count|name)-(\d+)$/);if(!r)return;const list=r[1]==="ring6"?b.rings6:b.rings;const i=+r[3];const x=list[i];if(!x)return;
  const nm=String(x.name||"").trim();if(!ONE_ONLY.has(nm.toLowerCase()))return;
  if(list.some((y,j)=>j!==i&&String(y.name||"").trim().toLowerCase()===nm.toLowerCase())){x.name="";const el=document.getElementById(r[1]+"-name-"+i);if(el)el.value="";toast(`${nm} is already in this setup, and only one can be worn at a time`);touch();return}
  const c=parseInt(x.count);if(c>1||/[\/]/.test(String(x.count||""))){x.count="1×";const el=document.getElementById(r[1]+"-count-"+i);if(el)el.value="1×";toast(`Only one ${nm} can be worn at a time, so the count is set to 1`);
    const cc=l=>(l||[]).reduce((a,y)=>a+(parseInt(y.count)||0),0);const e8=document.getElementById("cnt8"),e6=document.getElementById("cnt6");if(e8)e8.textContent=cc(b.rings);if(e6)e6.textContent=cc(b.rings6);touch()}}
ed.addEventListener("change",e=>{enforceOneOnly(e.target,getB())});
// build picture: crop the middle square and shrink it so it stays small in storage and downloads
ed.addEventListener("change",e=>{const t=e.target;if(t.id!=="f-pic"||!t.files||!t.files[0])return;const f=t.files[0];t.value="";
  if(!/^image\//.test(f.type)){toast("That isn't an image");return}
  const rd=new FileReader();rd.onload=()=>{const im=new Image();im.onload=()=>{const S=200,side=Math.min(im.naturalWidth,im.naturalHeight);if(!side){toast("Couldn't read that image");return}
    const c=document.createElement("canvas");c.width=c.height=S;const x=c.getContext("2d");x.imageSmoothingQuality="high";x.drawImage(im,(im.naturalWidth-side)/2,(im.naturalHeight-side)/2,side,side,0,0,S,S);
    let u=c.toDataURL("image/webp",0.82);if(!u.startsWith("data:image/webp"))u=c.toDataURL("image/jpeg",0.85);
    getB().pic=u;touch();renderEditor();toast("Picture added")};im.onerror=()=>toast("Couldn't read that image");im.src=rd.result};rd.readAsDataURL(f)});
// keep the little picture next to a gear name in step with what's typed
function syncPic(t){if(!t||!t.dataset||!t.dataset.pk)return;const box=t.closest(".ge,.rge");const g=box&&box.querySelector(".gpic");if(!g)return;const real=t.value?findItem(t.dataset.pk,t.value):null;const u=real?picOf(t.dataset.pk,real):"";g.innerHTML=u?`<img src="${u}" alt="">`:""}
ed.addEventListener("input",e=>syncPic(e.target));ed.addEventListener("change",e=>syncPic(e.target));
ed.addEventListener("change",e=>{const t=e.target,b=getB();
  if(t.dataset.act==="join"){b.museum[t.dataset.r][+t.dataset.i].join=t.value;touch()}
  else if(t.dataset.act==="mark"){b.museum[t.dataset.r][+t.dataset.i].mark=t.value;touch()}
  else if(t.dataset.act==="span"){b.museum[t.dataset.r][+t.dataset.i].span=+t.value||1;touch();renderEditor()}
  else if(t.id==="f-split6"){b.split6=t.checked;if(!Array.isArray(b.rings6))b.rings6=[];if(b.split6&&!b.rings6.some(x=>x.name))b.rings6=b.rings.map(x=>Object.assign({},x,{count:(String(x.count).split("/")[1]||x.count||"").trim()}));if(b.split6)b.rings=b.rings.map(x=>Object.assign({},x,{count:String(x.count).split("/")[0].trim()}));
    else b.rings=b.rings.map(x=>{const m=b.rings6.find(y=>y.name&&y.name===x.name);return m&&m.count&&m.count!==x.count&&!String(x.count).includes("/")?Object.assign({},x,{count:x.count+"/"+m.count}):x});
    touch();renderEditor()}});
// ---------- mineral picker with gains and museum-total preview ----------
let SG=null; // {inp, items:[names], hot}
function sbox(inp){return document.getElementById("sb-"+inp.dataset.r+"-"+inp.dataset.i)}
function openSugg(inp){
  const r=inp.dataset.r,i=+inp.dataset.i,b=getB(),slot=b.museum[r][i];const q=inp.value.trim().toLowerCase();
  const usedAt={};b.museum[r].forEach((s,k)=>{if(k!==i)s.m.forEach(x=>{usedAt[x.toLowerCase()]=k+1})});
  const inSlot=slot.m.map(x=>x.toLowerCase());
  let list=D.filter(d=>d[1]===r&&(!q||d[0].toLowerCase().includes(q)));
  list.sort((a,c)=>Math.max(...c[3].map(x=>x[1]))-Math.max(...a[3].map(x=>x[1]))||a[0].localeCompare(c[0]));
  const box=sbox(inp);
  if(!list.length){box.innerHTML=`<div class="spv">No ${r.toLowerCase()} mineral matches “${esc(inp.value)}”.</div>`;box.hidden=false;inp.setAttribute("aria-expanded","true");SG={inp,items:[],hot:-1};return}
  box.innerHTML=`<div class="slist">${list.map((d,k)=>{const lc=d[0].toLowerCase();const here=inSlot.includes(lc);const other=usedAt[lc];const dis=here||!!other;const u=picOf("Mineral",d[0]);return `<button type="button" class="sopt${dis?" taken":""}" role="option" data-mineral="${esc(d[0])}" id="so-${r}-${i}-${k}" data-name="${esc(d[0])}"${dis?' aria-disabled="true"':""}>${u?`<img class="si" src="${u}" alt="">`:'<span class="si"></span>'}<b>${esc(d[0])}</b><span class="kgs">${d[2]} kg for max</span><span class="g">${here?"<span>Already in this slot</span>":other?`<span>Already in slot ${other}</span>`:gainsHTML(d[3])}</span></button>`}).join("")}</div><div class="spv" id="spv-${r}-${i}"><b>Hover a mineral to preview the museum total</b></div>`;
  box.hidden=false;inp.setAttribute("aria-expanded","true");
  SG={inp,items:list.map(d=>d[0]),hot:-1};
}
function closeSugg(){if(!SG)return;const box=sbox(SG.inp);if(box){box.hidden=true}SG.inp.setAttribute("aria-expanded","false");SG.inp.removeAttribute("aria-activedescendant");SG=null}
function previewSugg(name){if(!SG)return;const inp=SG.inp,r=inp.dataset.r,i=+inp.dataset.i,b=getB();const pv=document.getElementById(`spv-${r}-${i}`);if(!pv)return;
  const before=museumTotals(b),after=museumTotals(b,{r,i,name});const ch=STATS.filter(s=>Math.abs(after[s]-before[s])>1e-9);
  const slot=b.museum[r][i];const verb=slot.m.length?`Museum total if ${esc(name)} replaces ${esc(slot.m[0])}`:`Museum total with ${esc(name)}`;
  pv.innerHTML=`<b>${verb}</b>`+(ch.length?ch.map(s=>{const d=after[s]-before[s];return `<span>${s} <em>${fx(after[s])}</em> <em class="${d>0?"":"down"}">(${d>0?"+":"−"}${r4(Math.abs(d))})</em></span>`}).join(""):"<span>No change</span>")}
function setHot(k){if(!SG||!SG.items.length)return;const n=SG.items.length;k=(k+n)%n;SG.hot=k;const r=SG.inp.dataset.r,i=SG.inp.dataset.i;
  sbox(SG.inp).querySelectorAll(".sopt").forEach((o,j)=>o.classList.toggle("hot",j===k));const el=document.getElementById(`so-${r}-${i}-${k}`);if(el){el.scrollIntoView({block:"nearest"});SG.inp.setAttribute("aria-activedescendant",el.id)}previewSugg(SG.items[k])}
let quiet=false;
ed.addEventListener("focusin",e=>{if(e.target.dataset&&e.target.dataset.act==="add"){if(quiet){quiet=false;return}openSugg(e.target)}});
ed.addEventListener("click",e=>{const t=e.target;if(t.dataset&&t.dataset.act==="add"&&!SG)openSugg(t)});
ed.addEventListener("focusout",e=>{if(e.target.dataset&&e.target.dataset.act==="add")setTimeout(()=>{if(SG&&SG.inp===e.target&&document.activeElement!==e.target)closeSugg()},120)});
ed.addEventListener("input",e=>{if(e.target.dataset.act==="add")openSugg(e.target)});
ed.addEventListener("mouseover",e=>{const o=e.target.closest(".sopt");if(o&&SG&&o.getAttribute("aria-disabled")!=="true")previewSugg(o.dataset.name)});
ed.addEventListener("mousedown",e=>{if(e.target.closest(".sbox"))e.preventDefault()});
ed.addEventListener("click",e=>{const o=e.target.closest(".sopt");if(!o||!SG)return;e.stopPropagation();if(o.getAttribute("aria-disabled")==="true")return;addMineral(SG.inp,o.dataset.name)},true);
ed.addEventListener("keydown",e=>{const t=e.target;if(t.dataset.act!=="add")return;
  if(e.key==="ArrowDown"){e.preventDefault();if(!SG)openSugg(t);setHot(SG.hot+1)}
  else if(e.key==="ArrowUp"){e.preventDefault();if(SG)setHot(SG.hot-1)}
  else if(e.key==="Escape"){if(SG){e.preventDefault();closeSugg()}}
  else if(e.key==="Enter"){e.preventDefault();if(SG&&SG.hot>=0)addMineral(t,SG.items[SG.hot]);else addMineral(t)}});
function renderMTot(){const el=document.getElementById("mtot");if(!el)return;const t=museumTotals(getB());const on=STATS.filter(s=>Math.abs(t[s])>1e-9);el.innerHTML=on.length?on.map(s=>`<span>${s} <em${t[s]<0?' style="color:var(--neg)"':""}>${fx(t[s])}</em></span>`).join(""):'<span class="hint">Add minerals to see the total.</span>'}
function addMineral(t,pickName){const v=(pickName||t.value).trim();if(!v)return;const b=getB(),s=b.museum[t.dataset.r][+t.dataset.i];const d=BY[v.toLowerCase()];const name=d?d[0]:v;
  if(d&&d[1]!==t.dataset.r){toast(`${name} is ${d[1]}, not ${t.dataset.r}`);return}
  const other=b.museum[t.dataset.r].findIndex((x,k)=>k!==+t.dataset.i&&x.m.some(y=>y.toLowerCase()===name.toLowerCase()));
  if(other>=0){toast(`${name} is already in ${t.dataset.r} slot ${other+1}. Each mineral can only go in one slot.`);return}
  if(!s.m.some(x=>x.toLowerCase()===name.toLowerCase()))s.m.push(name);
  const keep=t.id;touch();renderEditor();const n=document.getElementById(keep);if(n){quiet=true;n.focus();quiet=false}}
// backup minerals: a small picker with pictures, notes per mineral
function xList(q){q=q.trim().toLowerCase();const have=new Set((getB().extra||[]).map(x=>String(x.n).toLowerCase()));const RO=["Exotic","Mythic","Legendary","Epic","Rare","Uncommon","Common"];
  return D.filter(d=>!have.has(d[0].toLowerCase())&&(!q||d[0].toLowerCase().includes(q))).sort((a,b)=>(q?(b[0].toLowerCase().startsWith(q)-a[0].toLowerCase().startsWith(q)):0)||RO.indexOf(a[1])-RO.indexOf(b[1])||a[0].localeCompare(b[0])).slice(0,8)}
function xDraw(){const i=document.getElementById("xIn"),bx=document.getElementById("xBox");if(!i||!bx)return;const l=xList(i.value);bx.hidden=!l.length;
  bx.innerHTML=l.map(d=>`<button type="button" class="xopt" data-xn="${esc(d[0])}" style="--rc:${RHX[d[1]]}">${picOf("Mineral",d[0])?`<img src="${picOf("Mineral",d[0])}" alt="">`:""}<b>${esc(d[0])}</b><span class="cg">${gainsHTML(d[3])}</span><small>${d[1]}</small></button>`).join("")}
function xAdd(n){const b=getB();b.extra=b.extra||[];const d=BY[String(n).toLowerCase()];if(!d)return;if(b.extra.some(x=>x.n.toLowerCase()===d[0].toLowerCase()))return;b.extra.push({n:d[0],note:""});touch();renderAll();const i=document.getElementById("xIn");if(i)i.focus()}
ed.addEventListener("input",e=>{const t=e.target;if(t.id==="xIn"){xDraw();return}if(t.dataset.act==="xnote"){const b=getB();(b.extra[+t.dataset.k]||{}).note=t.value;touch()}},true);
ed.addEventListener("focusin",e=>{if(e.target.id==="xIn")xDraw()});
ed.addEventListener("focusout",e=>{if(e.target.id==="xIn")setTimeout(()=>{const bx=document.getElementById("xBox");if(bx&&!bx.contains(document.activeElement))bx.hidden=true},150)});
ed.addEventListener("keydown",e=>{if(e.target.id==="xIn"&&e.key==="Enter"){e.preventDefault();const l=xList(e.target.value);if(l[0])xAdd(l[0][0])}if(e.target.id==="xIn"&&e.key==="Escape"){const bx=document.getElementById("xBox");if(bx)bx.hidden=true}});
ed.addEventListener("click",e=>{const o=e.target.closest(".xopt");if(o){e.stopPropagation();xAdd(o.dataset.xn);return}const r=e.target.closest("[data-act=xrm]");if(r){e.stopPropagation();const b=getB();b.extra.splice(+r.dataset.k,1);touch();renderAll()}},true);
ed.addEventListener("click",e=>{const t=e.target.closest("button");if(!t)return;const b=getB(),a=t.dataset.act;
  if(a==="rm"){const s=b.museum[t.dataset.r][+t.dataset.i];s.m.splice(+t.dataset.k,1);s.pick=Math.min(s.pick,Math.max(1,s.m.length));}
  else if(a==="addring")b.rings.push({count:"",mut:"",name:"",note:""});
  else if(a==="rmring")b.rings.splice(+t.dataset.i,1);
  else if(a==="addring6"){if(!Array.isArray(b.rings6))b.rings6=[];b.rings6.push({count:"",mut:"",name:"",note:""})}
  else if(a==="rmring6")b.rings6.splice(+t.dataset.i,1);
  else if(a==="addex")b.extras.push({label:"",name:"",note:""});
  else if(a==="mymuseum"){let bd=null;try{bd=JSON.parse(localStorage.getItem("mp-board")||"null")}catch(e){}
    const real=x=>x&&x.m&&x.m!=="Any";
    if(!bd||!ORDER.some(r=>(bd[r]||[]).some(real))){toast("Your Museum Planner board is empty. Fill it on the Museum Planner page first.");return}
    // the planner has a modifier per slot, a build has one main modifier (+ fallback): use the most common ones
    const cnt={};
    b.museum=Object.fromEntries(ORDER.map(r=>[r,Array.from({length:SLOTS[r]},(_,i)=>{const x=(bd[r]||[])[i];if(!real(x))return {m:[],pick:1,join:"|",mark:"",span:1};
      if(x.u&&x.u!=="None"&&MODS[x.u])cnt[x.u]=(cnt[x.u]||0)+1;const d=BY[String(x.m).toLowerCase()];return {m:[d?d[0]:x.m],pick:1,join:"|",mark:"",span:1}})]));
    const mods=Object.entries(cnt).sort((x,y)=>y[1]-x[1]).map(x=>x[0]);
    if(mods.length){b.mod=mods[0];b.modFallback=mods[1]||""}
    toast(mods.length>1?`Museum filled from your Museum Planner board (modifiers: ${mods[0]}, fallback ${mods[1]})`:"Museum filled from your Museum Planner board")}
  else if(a==="myrunes"){let sel=[];try{sel=(JSON.parse(localStorage.getItem("pr-s")||"{}").sel)||[]}catch(e){}if(!sel.length){toast("Your Runes loadout is empty. Pick runes on the Runes page first.");return}b.runeSlots=Array.from({length:5},(_,i)=>sel[i]||"");syncRunes(b);toast("Runes filled from your loadout")}
  else if(a==="rmex")b.extras.splice(+t.dataset.i,1);
  else if(a==="rmpic")delete b.pic;
  else return;
  touch();renderEditor()});
function touch(){getB().updated=Date.now();persist();renderSheet();renderMTot()}

// ---------- build list ----------
function renderSelect(){const s=document.getElementById("buildSel");s.innerHTML=B.map(b=>`<option value="${b.id}"${b.id===cur?" selected":""}>${esc(b.name||"Untitled build")}</option>`).join("")}
document.getElementById("buildSel").addEventListener("change",e=>{cur=e.target.value;armDel=false;delBtn();persist();renderAll()});

const S1=(m,o)=>Object.assign({m,pick:1,join:"|",mark:"",span:1},o||{});
document.getElementById("bNew").onclick=()=>{const b=blankBuild(randomName());B.push(b);cur=b.id;persist();renderAll();toast("New build added");document.getElementById("f-name").select()};
document.getElementById("bDup").onclick=()=>{const c=JSON.parse(JSON.stringify(getB()));c.id=uid();c.name=(c.name||"Build")+" (copy)";B.push(c);cur=c.id;persist();renderAll();toast("Duplicated")};
function delBtn(){const d=document.getElementById("bDel");d.textContent=armDel?"Confirm delete":"Delete";d.classList.toggle("warn",armDel)}
document.getElementById("bDel").onclick=()=>{if(!armDel){armDel=true;delBtn();return}const n=getB().name;B=B.filter(b=>b.id!==cur);if(!B.length)B.push(blankBuild(randomName()));cur=B[0].id;armDel=false;delBtn();persist();renderAll();toast(`Deleted “${n}”`)};

// ---------- download / import ----------
const SHEET_CSS=[...document.querySelectorAll("style")].map(s=>s.textContent).join("\n").split("/* ===== the build sheet")[1].replace(/^[^\n]*\n/,"");
function fileHTML(b){
  const data=JSON.stringify({app:"prospecting-build-sheets",v:1,build:b}).replace(/</g,"\\u003c");
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(b.name||"Build")} · Prospecting build</title><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=Chakra+Petch:wght@700&display=swap"><style>:root{--s-page:#3b3b3b;--s-cell:#2a2a2a;--s-gold:#c9a227;--s-fill:#7a5a0a;--s-text:#f2f2f2;--s-dim:#bdbdbd;--r-exotic:#ff3b3b;--r-mythic:#ff3fd8;--r-legendary:#ffd21f;--r-epic:#b36bff;--r-rare:#4d8dff;--r-uncommon:#86f34a;--r-common:#ffffff;color-scheme:dark}body{margin:0;background:#0d1014;padding:24px 12px}.sheet{max-width:900px;margin:0 auto}${SHEET_CSS}</style></head><body>${sheetHTML(b)}<script type="application/json" id="build-data">${data}<\/script><script>document.addEventListener("click",function(e){var t=e.target.closest&&e.target.closest(".rtoggle button");if(!t)return;var s=t.closest(".sheet");s.setAttribute("data-rings",t.getAttribute("data-rings"));s.querySelectorAll(".rtoggle button").forEach(function(x){x.setAttribute("aria-pressed",String(x===t))})});<\/script></body></html>`;
}
const parentSave=(()=>{try{return window.parent!==window&&typeof window.parent.ptSave==="function"?window.parent.ptSave:null}catch(e){return null}})();
async function saveFile(filename,data){
  if(parentSave){try{await parentSave(filename,data);return true}catch(e){const c=e&&e.code;if(c!=="declined")toast(c==="rate_limited"?"A save prompt is already open":c==="unavailable"?"Saving isn't available in this view":"Couldn't save here");return false}}
  if(window.hostBridge&&hostBridge.use){if(!dlcap){toast("Downloads aren't available in this view");return false}try{await dlcap.save({filename,data});return true}catch(e){const c=e&&e.code;if(c!=="declined")toast(c==="rate_limited"?"A save prompt is already open":"Couldn't save here");return false}}
  const a=document.createElement("a");a.href=URL.createObjectURL(data instanceof Blob?data:new Blob([data]));a.download=filename;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},500);return true}
document.getElementById("bImg").onclick=async()=>{
  if(typeof html2canvas!=="function"){toast("The image maker didn't load. Check your connection and try again.");return}
  const btn=document.getElementById("bImg");btn.disabled=true;const old=btn.textContent;btn.textContent="Making image…";
  const box=document.createElement("div");box.style.cssText="position:fixed;left:-10000px;top:0;width:920px;pointer-events:none";
  box.innerHTML=sheetHTML(getB());const sh=box.firstElementChild;sh.style.borderRadius="0";
  sh.querySelectorAll(".rtoggle").forEach(t=>t.remove());
  const by=document.createElement("div");by.style.cssText="text-align:right;padding:8px 14px 12px;background:#12161b";const pill=document.createElement("span");pill.textContent="Made by @__coastal";pill.style.cssText="display:inline-block;padding:4px 13px;border-radius:999px;border:1px solid rgba(20,184,166,.6);background:rgba(20,184,166,.14);color:#2dd4bf;font:600 13px 'IBM Plex Sans','Segoe UI',system-ui,sans-serif";by.appendChild(pill);sh.appendChild(by);
  document.body.appendChild(box);
  try{if(document.fonts&&document.fonts.ready)await document.fonts.ready;
    const cv=await html2canvas(sh,{backgroundColor:"#12161b",scale:2,useCORS:true,logging:false});
    const blob=await new Promise(r=>cv.toBlob(r,"image/png"));
    const b=getB();const fn=((b.name||"Build").replace(/[\\/:*?"<>|]+/g," ").trim().replace(/\.+$/,"")||"Build")+".png";
    if(blob&&await saveFile(fn,blob))toast((()=>{try{return window.parent.ptImgMsg()}catch(e){return "Image saved"}})());
  }catch(e){toast("Couldn't make the image"+(e&&e.message?": "+e.message:""))}
  finally{box.remove();btn.disabled=false;btn.textContent=old}};
let dlcap=null;(async()=>{try{if(window.hostBridge&&hostBridge.use)dlcap=await hostBridge.use("downloads")}catch(e){dlcap=null}})();
document.getElementById("bDl").onclick=async()=>{const b=getB();const html=fileHTML(b);const filename=((b.name||"Build").replace(/[\\/:*?"<>|]+/g," ").trim()||"Build")+" - Prospecting Build.html";if(await saveFile(filename,html))toast("Download started")};
document.getElementById("imp").addEventListener("change",e=>{const f=e.target.files&&e.target.files[0];e.target.value="";if(!f)return;const rd=new FileReader();rd.onload=()=>{try{const m=String(rd.result).match(/<script type="application\/json" id="build-data">([\s\S]*?)<\/script>/);const o=m&&JSON.parse(m[1]);if(!o||o.app!=="prospecting-build-sheets"||!o.build||!o.build.museum)throw 0;const nb=Object.assign(blankBuild(),o.build,{id:uid()});ORDER.forEach(r=>{if(!Array.isArray(nb.museum[r])||nb.museum[r].length!==SLOTS[r])nb.museum[r]=blankBuild().museum[r]});if(!Array.isArray(nb.rings6))nb.rings6=[];ORDER.forEach(r=>nb.museum[r].forEach(x=>{if(!x.span)x.span=1}));B.push(nb);cur=nb.id;persist();renderAll();toast(`Imported “${nb.name}”`)}catch(err){toast("That file isn't a build sheet from this page")}};rd.readAsText(f)});

// ---------- view tabs, toast ----------
const split=document.getElementById("split");
function view(v){split.dataset.view=v;document.getElementById("tEdit").setAttribute("aria-pressed",v==="edit");document.getElementById("tPrev").setAttribute("aria-pressed",v==="preview")}
// hide / show the preview, remembered between visits
let hideP=false;try{hideP=localStorage.getItem("pbs-hidep")==="1"}catch(e){}
document.addEventListener("click",e=>{const m=document.getElementById("sMenu");if(!m||!m.open)return;if(!m.contains(e.target)||e.target.closest(".smi"))m.open=false});
document.addEventListener("keydown",e=>{const m=document.getElementById("sMenu");if(e.key==="Escape"&&m&&m.open){m.open=false;m.querySelector("summary").focus()}});
function applyHideP(){split.classList.toggle("nopv",hideP);const hb=document.getElementById("bHideP");hb.textContent=hideP?"Show preview":"Hide preview";hb.setAttribute("aria-pressed",String(hideP));document.querySelector(".topbar .tabs").style.visibility=hideP?"hidden":""}
document.getElementById("bHideP").onclick=()=>{hideP=!hideP;try{localStorage.setItem("pbs-hidep",hideP?"1":"0")}catch(e){}if(hideP)view("edit");applyHideP()};
applyHideP();
document.getElementById("tEdit").onclick=()=>view("edit");document.getElementById("tPrev").onclick=()=>view("preview");
let tt;function toast(m){let el=document.querySelector(".toast");if(!el){el=document.createElement("div");el.className="toast";el.setAttribute("role","status");document.body.appendChild(el)}el.textContent=m;el.hidden=false;clearTimeout(tt);tt=setTimeout(()=>el.hidden=true,1700)}
// ---- Stat Calculator <-> build sheet ----

// ---- suggestion lists that show what each option does ----
const SGINFO=(()=>{const D=(()=>{try{return window.parent.PTDATA||{}}catch(e){return {}}})();const X=D.x2||{},E=D.ench||{},G=D.gear||{};const k=t=>String(t).toLowerCase().replace(/[^a-z0-9]/g,"");const I={};
  const put=(list,name,sub,det)=>{(I[list]=I[list]||{})[k(name)]={sub,det}};
  put("dl-rune","Clear","Empty this rune slot","");["dl-charm","dl-neck","dl-ring","dl-pan","dl-shovel","dl-panen","dl-shen","dl-trinket"].forEach(l=>put(l,"Clear","Empty this slot",""));put("dl-rune","Any rune","Any rune you like works in this slot","");
  (X.runes||[]).forEach(r=>put("dl-rune",r.n,r.d,r.w?"Where: "+r.w:""));
  (X.trinkets||[]).forEach(t=>put("dl-trinket",t.n,t.fx,"How to get: "+t.how));
  const fx=e=>[...Object.entries(e.a||{}).map(([s,v])=>`${s} +${v}`),...Object.entries(e.m||{}).map(([s,v])=>`${s} ×${v}`)].join(", ");
  (E.pan||[]).forEach(e=>put("dl-panen",e.n,fx(e)||"No stat bonus",`Chance per roll: Aurorite ${e.ch[0]}, Aetherite ${e.ch[1]}, Aetherium ${e.ch[2]}`+(e.src?` · Also from: ${e.src}`:"")));
  (E.shovel||[]).forEach(e=>put("dl-shen",e.n,e.d||"",`Chance per roll: Aetherite ${e.ch[0]}, Aetherium ${e.ch[1]}`+(e.lock?" · Needs the Seed of Light quest":"")));
  [["Alchemist's Crucible","Can upgrade the modifier on minerals (which ones isn't fully listed)",""],["Beach Umbrella","Every modified item panned gives +25 base luck for the next pan","Bought at Seashell Isle"],["Duplicator","Mythic and Exotic ores have a 10% chance to be duplicated","Found at Starfall River · needs Crafting Mastery 5"],["Golden Chalice","Digging up a treasure map gives +100% luck for 2 minutes","Found at Fortune River Delta · needs Treasure Mastery 5"],["Mass Reactor","Pans with more than 20 ores destroy the extra and give +25 base luck next pan per destroyed item","Quest at Rotwood Swamp"],["Tombstone","Summons the Halloween Spirit to pan for you and empowers the Pumpkin Set","Found at Haunted Creek"]].forEach(([n,a,b])=>put("dl-trinket",n,a,b));
  (G.pans||[]).forEach(p=>{const sub=[p.luck&&`Luck ${p.luck}`,p.capacity&&`Capacity ${p.capacity}`,p.strength&&`Shake str ${p.strength}`,p.speed&&`Shake speed ${p.speed}`].filter(Boolean).join(" · ");put("dl-pan",p.name,sub,[p.passive&&p.passive!=="None"?"Passive: "+p.passive:"",p.price?"Price: "+p.price:"",p.location?"Where: "+p.location:""].filter(Boolean).join(" · "));if(/ Pan$/.test(p.name))put("dl-pan",p.name.replace(/ Pan$/,""),sub,I["dl-pan"][k(p.name)].det)});
  (G.shovels||[]).forEach(p=>{const sub=[p.strength&&`Dig str ${p.strength}`,p.speed&&`Dig speed ${p.speed}`,p.toughness&&`Toughness ${p.toughness}`].filter(Boolean).join(" · ");put("dl-shovel",p.name,sub,[p.price?"Price: "+p.price:"",p.location?"Where: "+p.location:""].filter(Boolean).join(" · "));if(/ Shovel$/.test(p.name))put("dl-shovel",p.name.replace(/ Shovel$/,""),sub,I["dl-shovel"][k(p.name)].det)});
  // pans and shovels: picture plus their stats, same look as equipment
  [["dl-pan",G.pans||[],/ Pan$/,"Pan"],["dl-shovel",G.shovels||[],/ Shovel$/,"Shovel"]].forEach(([l,list,re,kind])=>list.forEach(p=>{const img=(G.img||{})[p.image]||"";
    [p.name,re.test(p.name)?p.name.replace(re,""):null].filter(Boolean).forEach(n=>{const e=I[l][k(n)];if(!e)return;e.img=img;e.rc="var(--line)";
      e.html=`<b>${esc(p.name)}</b><span class="eqh">${kind}${p.section&&!/^(Main|List)/.test(p.section)?" · limited":""}</span>${e.sub?`<span class="eqh">${esc(e.sub)}</span>`:""}${e.det?`<span class="eqh" style="margin-top:4px">${esc(e.det)}</span>`:""}`})}));
  // equipment: picture, rarity and 6★ max stats, the same look as Equipment Loadouts
  const RC={Common:"#a3adb8",Uncommon:"#6cc46e",Rare:"#68a6f0",Epic:"#b880ee",Legendary:"#f2b53a",Mythic:"#f0687f",Exotic:"#f17ad6",Ascended:"#ffd36b"};
  const SK={"luck":"luck","capacity":"cap","size boost":"size","dig strength":"digstr","dig speed":"digspd","sell boost":"sell","walk speed":"walk","walkspeed":"walk","modifier boost":"mod","shake strength":"shkstr","shake speed":"shkspd","inventory size":"inv","jump power":"jump"};const SC=n=>{const q=SK[String(n).toLowerCase()];return q?`var(--k-${q})`:""};const nf=v=>(+v).toLocaleString("en-US",{maximumFractionDigits:2});
  const EQL={Charm:"dl-charm",Necklace:"dl-neck",Ring:"dl-ring"};const LST={"dl-charm":[],"dl-neck":[],"dl-ring":[]};const RO=["Ascended","Exotic","Mythic","Legendary","Epic","Rare","Uncommon","Common"];
  (D.equip||[]).slice().sort((a,b)=>RO.indexOf(a.r)-RO.indexOf(b.r)||a.n.localeCompare(b.n)).forEach(x=>{const l=EQL[x.slot];if(!l)return;LST[l].push(x.n);
    const st=(x.st||[]).map(s=>[s[0],s[4],s[5]]);
    put(l,x.n,x.r+" · "+st.slice(0,3).map(([n,v,p])=>`${n} +${nf(v)}${p?"%":""}`).join(", ")+(st.length>3?"…":""),"");
    const e=I[l][k(x.n)];e.img=x.img?(D.eimg||{})[x.img]||"":"";e.rc=RC[x.r]||"";
    e.html=`<b style="color:${RC[x.r]||"inherit"}">${esc(x.n)}</b><span class="eqh">${x.r} ${esc(x.slot)} · stats at 6★, 100% quality</span>${st.map(([n,v,p])=>`<span class="eql"><span style="color:${SC(n)||"inherit"}">${esc(n)}</span><span>+${nf(v)}${p?"%":""}</span></span>`).join("")}${x.d?`<span class="eqh" style="margin-top:4px">${esc(x.d)}</span>`:""}`});
  // equipment mutations: hovering one shows what it does to the item (stats multiplied, plus any flat bonus)
  const MPCT=new Set(["Shake Speed","Dig Speed","Size Boost","Modifier Boost","Sell Boost"]);
  put("dl-mut","No mutation","","");I["dl-mut"][k("No mutation")].html=`<b>No mutation</b><span class="eqh">The item's normal stats</span>`;I["dl-mut"][k("No mutation")].plain=true;
  (E.muts||[]).forEach(m=>{put("dl-mut",m.n,"","");const e=I["dl-mut"][k(m.n)];e.plain=true;e.col=EQMUT[m.n]||"";
    const pct=Math.round((m.x-1)*100);
    e.html=`<b style="color:${e.col||"inherit"}">${esc(m.n)}</b><span class="eql"><span>Item's stats</span><span>×${nf(m.x)} (+${pct}%)</span></span>${Object.entries(m.a||{}).map(([n,v])=>`<span class="eql"><span style="color:${SC(n)||"inherit"}">${esc(n)}</span><span>+${nf(v)}${MPCT.has(n)?"%":""} flat</span></span>`).join("")}${m.ev?`<span class="eqh" style="margin-top:4px">${esc(m.ev)}</span>`:""}`});
  return {I,k,LST}})();
const SGLISTS={"dl-mut":()=>["No mutation",...Object.keys(EQMUT).filter(Boolean)],"dl-charm":()=>SGINFO.LST["dl-charm"].length?SGINFO.LST["dl-charm"]:SUGGEST.charm,"dl-neck":()=>SGINFO.LST["dl-neck"].length?SGINFO.LST["dl-neck"]:SUGGEST.neck,"dl-ring":()=>SGINFO.LST["dl-ring"].length?SGINFO.LST["dl-ring"]:SUGGEST.ring,"dl-rune":()=>["Clear","Any rune",...RUNE_NAMES],"dl-panen":()=>PAN_EN,"dl-shen":()=>SH_EN,"dl-trinket":()=>TRINKETS,"dl-pan":()=>PDATA&&PDATA.gear&&PDATA.gear.pans?PDATA.gear.pans.map(x=>x.name):SUGGEST.pan,"dl-shovel":()=>PDATA&&PDATA.gear&&PDATA.gear.shovels?PDATA.gear.shovels.filter(x=>x.name!=="Rusty Shovel").map(x=>x.name):SUGGEST.shovel};
const sgInfo=(list,name)=>{const t=SGINFO.I[list]||{};return t[SGINFO.k(name)]||null};
let SGX=null,SGI=null,SGA=-1;
function sgClose(){if(SGX){SGX.remove();SGX=null;SGI=null;SGA=-1}}
// rune names already used in the other rune slots (a slot can hold "A/B" alternatives)
const runeParts=v=>String(v||"").split("/").map(x=>x.trim().toLowerCase()).filter(x=>x&&x!=="none"&&x!=="any rune");
const runesElsewhere=inp=>new Set([...document.querySelectorAll('#editor [id^="rn-"]')].filter(x=>x!==inp).flatMap(x=>runeParts(x.value)));
// gear slots get a "Clear" option at the top once something is in them
const SGCLR=new Set(["dl-charm","dl-neck","dl-ring","dl-pan","dl-shovel","dl-panen","dl-shen","dl-trinket"]);
let SGPICK=false;
function sgOpen(inp){if(SGPICK)return;const list=inp.dataset.sg;let all=SGLISTS[list]();if(SGCLR.has(list)&&inp.value.trim())all=["Clear",...all];if(list==="dl-rune"){const used=runesElsewhere(inp);all=all.filter(n=>!used.has(n.toLowerCase()))}const q=inp.value.trim().toLowerCase();
  const opts=(all.some(o=>o.toLowerCase()===q)||!q?all:all.filter(o=>o==="Clear"||o.toLowerCase().includes(q)));
  if(!SGX){SGX=document.createElement("div");SGX.className="sgx";SGX.setAttribute("role","listbox");document.body.appendChild(SGX)}SGI=inp;
  const rc=inp.getBoundingClientRect();const w=Math.min(Math.max(rc.width,340),window.innerWidth-16);SGX.style.width=w+"px";SGX.style.left=Math.max(8,Math.min(rc.left+scrollX,window.innerWidth-w-8+scrollX))+"px";SGX.style.top=(rc.bottom+scrollY+4)+"px";
  SGX.innerHTML=opts.length?`<ul>${opts.map((o,i)=>{const f=sgInfo(list,o);return f&&f.plain?`<li role="option" data-i="${i}" data-v="${esc(o)}"><b${f.col?` style="color:${f.col}"`:""}>${esc(o)}</b></li>`:f&&f.html!=null?`<li role="option" class="eqo" data-i="${i}" data-v="${esc(o)}" style="--rc:${f.rc||"var(--line)"}">${f.img?`<img src="${f.img}" alt="">`:`<i></i>`}<span class="eqt"><b>${esc(o)}</b></span></li>`:`<li role="option" data-i="${i}" data-v="${esc(o)}"><b>${esc(o)}</b>${f&&f.sub?`<span>${esc(f.sub)}</span>`:""}</li>`}).join("")}</ul><div class="det" hidden></div>`:'<div class="none">No matches. You can still type your own.</div>';
  SGA=-1}
function sgFocus(i){if(!SGX)return;const li=[...SGX.querySelectorAll("li")];if(!li.length)return;SGA=(i+li.length)%li.length;li.forEach((x,j)=>x.classList.toggle("on",j===SGA));const el=li[SGA];el.scrollIntoView({block:"nearest"});
  const f=sgInfo(SGI.dataset.sg,el.dataset.v);const d=SGX.querySelector(".det");if(d){const rune=SGI.dataset.sg==="dl-rune";d.hidden=!f||(rune&&!f.det);if(f&&f.html!=null){d.hidden=false;d.innerHTML=f.html}else if(f)d.innerHTML=rune?`<b>${esc(el.dataset.v)}</b><span style="color:var(--muted)">${esc(f.det)}</span>`:`<b>${esc(el.dataset.v)}</b>${esc(f.sub||"")}${f.det?`<br><span style="color:var(--muted)">${esc(f.det)}</span>`:""}`}}
// picking closes the list (and keeps it closed while the pick is saved); "Clear" empties the slot and its mutation
function sgPick(v){const inp=SGI;if(inp&&inp.dataset.sg==="dl-mut"){if(v==="No mutation")v="";inp.style.color=EQMUT[v]||""}const clr=v==="Clear"&&(inp.dataset.sg==="dl-rune"||SGCLR.has(inp.dataset.sg));if(clr)v="";inp.value=v;sgClose();SGPICK=true;
  try{inp.dispatchEvent(new Event("input",{bubbles:true}));inp.dispatchEvent(new Event("change",{bubbles:true}));
    if(clr){const ms=document.getElementById(inp.id.replace(/-name(-\d+)?$/,"-mut$1"));if(ms&&ms!==inp&&(ms.tagName==="SELECT"||ms.dataset.sg==="dl-mut")&&ms.value){ms.value="";ms.style.color="";ms.dispatchEvent(new Event("input",{bubbles:true}));ms.dispatchEvent(new Event("change",{bubbles:true}))}}}
  finally{SGPICK=false}sgTitle(inp);const n=document.getElementById(inp.id);if(n&&n===document.activeElement)n.blur()}
function sgTitle(inp){const f=sgInfo(inp.dataset.sg,inp.value);inp.title=f?[f.sub,f.det].filter(Boolean).join("\n"):""}
function hookSugg(){document.querySelectorAll("#editor input[list]").forEach(inp=>{const l=inp.getAttribute("list");if(!SGLISTS[l])return;inp.dataset.sg=l;inp.removeAttribute("list");sgTitle(inp)})}
document.addEventListener("focusin",e=>{const t=e.target;if(t.dataset&&t.dataset.sg)sgOpen(t)});
// the same rune can't go in two slots
document.addEventListener("change",e=>{const t=e.target;if(!t.id||!/^rn-\d$/.test(t.id))return;const used=runesElsewhere(t);const dup=runeParts(t.value).find(x=>used.has(x));if(!dup)return;
  const nm=(RUNE_NAMES.find(n=>n.toLowerCase()===dup)||dup);t.value=runeParts(t.value).filter(x=>!used.has(x)).map(x=>RUNE_NAMES.find(n=>n.toLowerCase()===x)||x).join("/");setPath(getB(),t.id,t.value);touch();sgTitle(t);toast(`${nm} is already in another rune slot`)},true);
document.addEventListener("input",e=>{const t=e.target;if(t.dataset&&t.dataset.sg&&t===document.activeElement){sgOpen(t);sgTitle(t)}});
document.addEventListener("keydown",e=>{if(!SGX||e.target!==SGI)return;if(e.key==="ArrowDown"){e.preventDefault();sgFocus(SGA+1)}else if(e.key==="ArrowUp"){e.preventDefault();sgFocus(SGA-1)}else if(e.key==="Enter"&&SGA>=0){e.preventDefault();const li=SGX.querySelectorAll("li")[SGA];if(li)sgPick(li.dataset.v)}else if(e.key==="Escape"||e.key==="Tab")sgClose()});
document.addEventListener("mouseover",e=>{const li=e.target.closest&&e.target.closest(".sgx li");if(li)sgFocus(+li.dataset.i)});
document.addEventListener("mousedown",e=>{const li=e.target.closest&&e.target.closest(".sgx li");if(li){e.preventDefault();sgPick(li.dataset.v);return}if(SGX&&!e.target.closest(".sgx")&&e.target!==SGI)sgClose()});
document.addEventListener("focusout",e=>{if(e.target===SGI)setTimeout(()=>{if(document.activeElement!==SGI)sgClose()},120)});
window.addEventListener("scroll",e=>{if(!SGI||!SGX||SGX.contains(e.target))return;const rc=SGI.getBoundingClientRect();SGX.style.top=(rc.bottom+scrollY+4)+"px";SGX.style.left=Math.max(8,Math.min(rc.left+scrollX,window.innerWidth-SGX.offsetWidth-8+scrollX))+"px"},true);
window.ptSetRunes=names=>{const b=getB();b.runeSlots=Array.from({length:5},(_,i)=>(names||[])[i]||"");syncRunes(b);touch();renderEditor();toast(`Added ${names.length} rune${names.length===1?"":"s"} to “${b.name||"this build"}”`)};
window.ptAddBuild=src=>{const nb=Object.assign(blankBuild(randomName()),JSON.parse(JSON.stringify(src)),{id:uid(),updated:Date.now()});if(!nb.name)nb.name=randomName();B.push(nb);cur=nb.id;armDel=false;persist();renderAll();toast(`Added “${nb.name}” from the Stat Calculator`)};
window.ptListBuilds=()=>B.map(b=>({id:b.id,name:b.name||"Untitled build"}));
function calcState(b){
  const slots={};const eq=e=>e&&e.name?{n:e.name.trim(),m:e.mut||"None",l:/5★/.test(e.note||"")?"5":/0★/.test(e.note||"")?"0":"6",q:(()=>{const m=String(e.note||"").match(/(\d+)%\s*quality/);return m?+m[1]:100})()}:{};
  slots.neck=eq(b.neck);slots.charm=eq(b.charm);let k=0;
  let total=0;(b.rings||[]).forEach(x=>{if(!x.name)return;const n=Math.max(1,parseInt(x.count)||1);total+=n;for(let i=0;i<n&&k<8;i++)slots["r"+(k++)]=eq(x)});
  const board={};const u=b.mod&&b.mod!=="Any"?b.mod:"None";
  ORDER.forEach(r=>{const sl=b.museum[r]||[];board[r]=Array.from({length:SLOTS[r]},()=>({m:null,u:"None"}));
    sl.forEach((s,i)=>{if(covered(sl,i))return;const k2=s.m.length>1&&s.pick>1?Math.min(s.pick,s.m.length):1;s.m.slice(0,k2).forEach((n,j)=>{if(n&&board[r][i+j])board[r][i+j]={m:n,u}})})});
  return {extraRings:Math.max(0,total-8),from:b.name,pan:(b.pan.name||"").trim(),panEn:(b.pan.enchant||"").trim(),trinket:(b.pan.trinket||"").trim(),shovel:(b.shovel.name||"").trim(),shEn:(b.shovel.enchant||"").trim(),slots,museumBoard:board}}
window.ptCalcState=id=>{const b=B.find(x=>x.id===id)||getB();return calcState(b)};
document.getElementById("bCalc").onclick=()=>{try{window.parent.ptSendCalc(calcState(getB()))}catch(e){toast("Couldn't reach the Stat Calculator")}};
function renderAll(){renderSelect();renderEditor();renderSheet();renderMTot()}
renderAll();persist();
