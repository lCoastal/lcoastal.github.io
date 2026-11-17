const $=id=>document.getElementById(id);
// Test Log: a written summary of every test session behind the toolkit's formulas (no raw data).
// Each session: when, where, setup, how much was logged, what was tested, what it showed, what changed on the site.
const TOPICS={lk:"Luck",my:"Rare minerals",cp:"Capacity",md:"Modifiers",wt:"Drop tables"};
const S=[
{id:"mods-1711",date:"17/11/26",title:"Modifier run with full logging",zone:"Meteor Falls",topics:["md","my"],kind:"md",
 setup:{Luck:"27,800 – 267,000",["Modifier Boost"]:"16.6× (1,660%)",Capacity:"5,462 and 7,240",Time:"22 minutes"},
 amount:{Pans:918,Minerals:84522},
 tested:["How often a mineral gets a normal modifier at a high Modifier Boost","Which modifier you get, at many different luck values","Whether the overnight Mythic result repeats"],
 found:["Minerals logged as \"UNKNOWN\" were really unmodified: in the 263 pans where it shows up there is never a \"None\"","68.8% of minerals got a normal modifier. The toolkit said 39% and never went higher","The rate didn't move with luck: 68–69.5% from 45,000 to 207,000 luck","Modifier mix: Iridescent 28.9%, Cosmic 20.2%, Irradiated 12.7%, Shiny 11.4%, Pure 9.4%, Glowing 6.4%, Mutated 5.6%, Scorching 4.9%, Perfect 0.56%","Mythics again about 1.5× what the luck model said (441 found vs 288), while Gold, Pyrite, Nickel and Diamond were within 1%"],
 changed:["Modifier chance is now 1 − 0.937^boost (no 39% cap)","Which-modifier rolls are now 11.7 × boost^0.84 + 2 per 1,000 luck, with no luck cap","Very rare minerals get up to ×1.9 in the luck model"]},
{id:"night-1711",date:"17/11/26",title:"Overnight run, luck changing every pan",zone:"Meteor Falls",topics:["lk","my","cp"],kind:"lk",
 setup:{Luck:"26,400 – 266,000 (about 1,950 values)",Capacity:"7,240 then 5,462",["Size Boost"]:"14.76×",Time:"1 h 47 min"},
 amount:{Pans:4975,Minerals:457578},
 tested:["The luck formula across a ten times wider luck range than before","Items per pan at two capacities","Whether the Mythic odds listed for Meteor Falls hold"],
 found:["Items per pan: 101.8 at 7,240 capacity and 86.4 at 5,462. The capacity formula predicts 102.5 and 87.5; √capacity would say 85 and 74","Common and uncommon minerals were within 3% of the old luck model; Cobalt, Iridium, Diamond and Radium within ~15%","All four Mythics (Vortessence, Star Garnet, Aetherium, Sunstone) came out at almost exactly 2× the prediction, Starpiercer was spot on","Modifier and weight weren't logged in this run"],
 changed:["Confirmed the new items-per-pan formula","Part of the data for the 17/11 luck model refit"]},
{id:"frd-1711",date:"17/11/26",title:"Fortune River Delta at luck 1 and at 78,000",zone:"Fortune River Delta",topics:["lk","cp","wt"],kind:"lk",
 setup:{Luck:"1 (pans 1–89) and 78,279 (pans 90–269)",Capacity:"5,462",["Size Boost"]:"14.76×",["Modifier Boost"]:"16.6×"},
 amount:{Pans:269,Minerals:23057},
 tested:["Items per pan at a big capacity","Luck at one fixed high value against luck 1"],
 found:["85.7 items per pan, the same at both luck values, so luck doesn't change how many you get","√capacity (73.9) was clearly too low; 0.678 × capacity^0.565 (87.5) fits","The luck-1 pans matched the zone's base drop chances almost exactly (Gold 55.7% vs 54.7%)","Iridium and Moonstone have the same listed odds but came out 326 vs 130, and Aurorite 27× too often: the luck model gave the whole share of tied minerals to just one of them"],
 changed:["Items per pan switched from √capacity to 0.678 × capacity^0.565 in every tool","Minerals with the same odds now split their chance evenly"]},
{id:"weights-1711",date:"17/11/26",title:"The game's drop weights, zone by zone",zone:"All 35 zones",topics:["wt"],kind:"wt",
 setup:{Source:"The game's own weight table",Zones:"35"},
 amount:{Zones:35},
 tested:["Whether the toolkit's drop chances match the game's weights"],
 found:["Every zone matches to within 1%, except The Void","Three zones only differ in name: Abyssal Depths, The Magma Furnace and Rubble Creek","The Void in the game table is a fixed table with Voidstone at 1 in 91.4 million; the toolkit treats it as a rotating pool (1 in 138 million)","So the extra Mythics at Meteor Falls aren't a data mistake"],
 changed:["Nothing needed changing, apart from The Void, which is still open"]},
{id:"sand-1311",date:"13/11/26",title:"Sandstone Stream and Meteor Falls, totem on and off",zone:"Sandstone Stream, Meteor Falls",topics:["lk","md"],kind:"lk",
 setup:{Luck:"24,000 – 61,300",Capacity:"2,833 – 3,494",["Modifier Boost"]:"9.19× – 9.26×",["Luck Totem"]:"On and off"},
 amount:{Minerals:80903},
 tested:["Drops with and without the Luck Totem","Modifier rate at about 9× boost"],
 found:["About 41% of minerals got a normal modifier at 9.2× boost","Meteor Falls Mythics were about 2× the luck model here too"],
 changed:["Part of the data for the 17/11 luck and modifier refits"]},
{id:"fixed-1211",date:"12/11/26",title:"Fixed-luck tests in six zones",zone:"Frozen Peak, Fortune River Delta, Fortune River, Volcanic Springs, Infernal Heart, Sandstone Stream",topics:["lk","md"],kind:"lk",
 setup:{Luck:"Set to 5,000, 10,000, 23,000, 24,000, 35,000, 39,000 and 50,000",Capacity:"2,779",["Size Boost"]:"22.2×",["Modifier Boost"]:"9.26×"},
 amount:{Minerals:258655},
 tested:["The luck formula at low luck values","How the modifier rate changes between zones at the same boost"],
 found:["The low-luck end of the luck model (5,000–10,000) mostly comes from these","Modifier rate at 9.26× boost ranged from 41% (Sandstone Stream) to 57% (Infernal Heart): something other than boost raises it in some sessions","Some event modifiers (Spooky, Ghostly) were still showing up"],
 changed:["Part of the data for the 11/11 and 17/11 luck fits and the 17/11 modifier fit"]},
{id:"low-1211",date:"12/11/26",title:"Low Modifier Boost test",zone:"Fortune River",topics:["md","lk"],kind:"md",
 setup:{Luck:"7,900 and 11,400",["Modifier Boost"]:"1.13×",Capacity:"1,242",["Size Boost"]:"3.32×"},
 amount:{Minerals:69693},
 tested:["How often modifiers show up with almost no Modifier Boost"],
 found:["Only about 10% of minerals got a normal modifier at 1.13× boost","With so little boost the mix leans heavily to Irradiated, Scorching and Glowing; Cosmic and up are rare"],
 changed:["The low end of the modifier formula (1 − 0.937^boost) rests on this"]},
{id:"big-1111",date:"11/11/26",title:"Long sessions in Haunted Creek and Meteor Falls",zone:"Haunted Creek, Meteor Falls, plus Timelocked Sanctuary, Frozen Peak, Astral Caverns, Fungal Marsh, Sandstone Stream, Starfall River, The Void",topics:["lk","my","md"],kind:"lk",
 setup:{Luck:"19,500 – 74,000 (thousands of values)",Capacity:"1,856 – 4,101",["Size Boost"]:"14.2× – 22.4×",["Modifier Boost"]:"5.97× – 9.19×"},
 amount:{Minerals:2353754},
 tested:["The first proper fit of the luck formula","Modifier rate and mix at 6× to 9× boost"],
 found:["Haunted Creek (1.24 million minerals) and Meteor Falls (950,000) are the backbone of the luck model","Mythics in most zones came out 1.5–2.7× more often than the luck model said; zones whose Mythics are only 1 in 3–12 million matched","Normal modifier rate: about 36% at 6× boost and 37–50% at 8.4–9.2×","Halloween event modifiers (Spooky, Ghostly) and Void tools (Voidtorn) were mixed in, so those are left out of the modifier fit"],
 changed:["The 11/11 luck model came from this","Re-used in the 17/11 luck, rare-mineral and modifier refits"]},
];
// headline findings, each pointing at the sessions it comes from
const FIND=[
 ["Luck works like extra rolls of the zone's drop table, keeping the rarest. Best fit: 29% roll once, 3% about luck ÷ 23 times, 19% about 0.41 × luck, 49% about 1.74 × luck.",["big-1111","fixed-1211","sand-1311","night-1711","frd-1711"]],
 ["Very rare minerals (base odds about 1 in 18 million to 1 in 1.6 billion, most Mythics) drop about 1.9× more often than the rolls alone say. Seen in 8 of 11 zones.",["big-1111","sand-1311","night-1711","mods-1711"]],
 ["A full pan holds about 0.678 × capacity^0.565 minerals (≈20 at 400, 87 at 5,462, 102 at 7,240). Luck doesn't change it.",["frd-1711","night-1711"]],
 ["Chance of a normal modifier is 1 − 0.937^boost (×): about 10% at 1.1×, 36% at 6×, 45% at 9×, 69% at 16.6×. Luck doesn't change it.",["low-1211","big-1111","fixed-1211","mods-1711"]],
 ["Which modifier you get works like luck: about 11.7 × boost^0.84 + 2 per 1,000 luck rolls, keeping the rarest.",["big-1111","fixed-1211","mods-1711"]],
 ["The toolkit's drop chances match the game's own weights in 34 of 35 zones.",["weights-1711"]],
];
const OPEN=[
 "Why the very rare band gets ×1.9. It's measured, not explained.",
 "Why the modifier rate at the same boost is about 40% in some sessions and 52–57% in others (zone, weather or a totem?).",
 "The Void: fixed table (Voidstone 1 in 91.4M) or rotating pool (1 in 138M)?",
 "Modifier Boost above 16.6× and luck above 267,000 are untested.",
 "Weights were logged in the 17/11 modifier run but haven't been checked against the weight model yet.",
 "The \"luck caps give about 63% of the cap\" result came from the old luck model and needs re-checking.",
];
const ORDER=S.map(x=>x.id);
let st={t:"",q:""};try{Object.assign(st,JSON.parse(localStorage.getItem("tl-s")||"{}"))}catch(e){}
const save=()=>{try{localStorage.setItem("tl-s",JSON.stringify(st))}catch(e){}};
const n0=v=>Number(v).toLocaleString("en-US");
function tiles(){
  const mins=S.reduce((a,x)=>a+(x.amount.Minerals||0),0),pans=S.reduce((a,x)=>a+(x.amount.Pans||0),0);
  const zones=new Set();S.forEach(x=>x.zone.split(/,\s*|\s+plus\s+/).forEach(z=>{if(!/^All/.test(z))zones.add(z.trim())}));
  $("tiles").innerHTML=[["Minerals logged",n0(mins),"across "+S.filter(x=>x.amount.Minerals).length+" sessions"],
    ["Zones tested",zones.size,"plus the game's table for all 35"],["Luck tested","1 – 267k","most data 5k – 267k"],
    ["Modifier Boost tested","1.1× – 16.6×",""],["Logged pans",n0(pans),"in sessions that counted pans"]]
    .map(([l,v,s])=>`<div class="tile"><span class="lab">${l}</span><b>${v}</b>${s?`<small>${s}</small>`:""}</div>`).join("");
  const nm=id=>{const x=S.find(s=>s.id===id);return x?`<a href="#${id}" data-go="${id}">${esc(x.title)}</a>`:""};
  $("find").innerHTML=FIND.map(([t,ids])=>`<li>${esc(t)} <span class="src">— from: ${ids.map(nm).join(" · ")}</span></li>`).join("");
  $("open").innerHTML=OPEN.map(t=>`<li>${esc(t)}</li>`).join("");
}
function hi(t,q){t=esc(t);if(!q)return t;const i=t.toLowerCase().indexOf(q);return i<0?t:t.slice(0,i)+"<mark>"+t.slice(i,i+q.length)+"</mark>"+t.slice(i+q.length)}
function render(){
  const q=st.q.trim().toLowerCase();
  $("topics").querySelectorAll("[data-t]").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.t===st.t)));
  const rows=S.filter(x=>(!st.t||x.topics.includes(st.t))&&(!q||JSON.stringify(x).toLowerCase().includes(q)));
  $("count").textContent=`${rows.length} of ${S.length} sessions`;
  $("list").innerHTML=rows.length?rows.map(x=>`<article class="ses ${x.kind}" id="${x.id}">
    <div class="sh"><h3>${hi(x.title,q)}</h3><span class="dt">${esc(x.date)}</span></div>
    <div class="tags"><span class="tag">${hi(x.zone,q)}</span>${x.topics.map(t=>`<span class="tag">${TOPICS[t]}</span>`).join("")}</div>
    <div class="setup">${Object.entries(x.amount).map(([k,v])=>`<div><span>${k}</span><b>${n0(v)}</b></div>`).join("")}${Object.entries(x.setup).map(([k,v])=>`<div><span>${esc(k)}</span><b>${hi(v,q)}</b></div>`).join("")}</div>
    <h4>What was tested</h4><ul>${x.tested.map(t=>`<li>${hi(t,q)}</li>`).join("")}</ul>
    <h4>What it showed</h4><ul>${x.found.map(t=>`<li>${hi(t,q)}</li>`).join("")}</ul>
    <h4>What changed on the site</h4><ul class="chg">${x.changed.map(t=>`<li>${hi(t,q)}</li>`).join("")}</ul>
  </article>`).join(""):`<p class="empty">No sessions match.</p>`;
}
$("topics").insertAdjacentHTML("beforeend",`<button type="button" class="chip sm" data-t="">All</button>`+Object.entries(TOPICS).map(([k,v])=>`<button type="button" class="chip sm" data-t="${k}">${v}</button>`).join(""));
$("topics").onclick=e=>{const b=e.target.closest("[data-t]");if(!b)return;st.t=b.dataset.t;save();render()};
$("q").value=st.q;$("q").addEventListener("input",e=>{st.q=e.target.value;save();render()});
document.addEventListener("click",e=>{const a=e.target.closest("[data-go]");if(!a)return;e.preventDefault();st.t="";st.q="";$("q").value="";save();render();const el=$(a.dataset.go);if(el){el.scrollIntoView({behavior:"smooth",block:"start"});el.animate([{outline:"2px solid var(--accent)"},{outline:"2px solid transparent"}],{duration:1600})}});
tiles();render();
