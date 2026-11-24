(()=>{
const $=id=>document.getElementById(id);
// [group, title, formula (copied as is), what it means]
const F=[
["Pans","Average minerals per pan",
`n = 0.678 × C^0.565`,
"n = average minerals in a full pan, C = capacity. Luck doesn't change it."],
["Pans","Fewest and most minerals per pan",
`min = ½ × √C
max ≈ 2.5 × √C`,
"min = fewest minerals a full pan can give, max = most, C = capacity. Most pans sit in the lower part of that range."],
["Weight","Lightest and heaviest weight",
`Wmin = 0.75 × B × (1 + S) × Z
Wmax = 15.5 × B × (1 + S) × Z`,
"Estimated from the lightest and heaviest rolls in our test logs, not confirmed. Wmin = lightest weight (kg), Wmax = heaviest weight (kg), B = the mineral's base weight (kg), S = Size Boost as a number (1,476% = 14.76), Z = the zone's size factor (see below). With the Solar Magnifier multiply by 1.5."],
["Weight","Maximum weight at a Size Boost",
`Wmax = 15.5 × B × (1 + S) × Z`,
"Best guess, from the heaviest rolls in our test logs. Wmax = heaviest weight (kg), B = the mineral's base weight (kg), S = your Size Boost as a number (1,476% = 14.76), Z = the zone's size factor. With the Solar Magnifier multiply by 1.5."],
["Weight","Minimum Size Boost for a weight",
`S = W ÷ (15.5 × B × Z) − 1`,
"S = Size Boost you need, as a number (×100 for %, so 18.35 = 1,835%), W = the weight you want (kg), B = the mineral's base weight (kg), Z = the zone's size factor. With the Solar Magnifier use W ÷ 1.5 instead of W."],
["Weight","Zone size factor",
`Z = 0.80  Rubble Creek
Z = 0.89  Rubble Creek Deposits
Z = 0.93  Fortune River
Z = 0.96  Magma Furnace, Volcanic Sands
Z = 0.97  Azuralite Oasis, Sunset Beach
Z ≈ 1.00  Lifespring Oasis, Sandstone Stream, Volcanic Springs, Frostbite River, Meteor Falls
Z = 1.02  Crystal Cavern River, Starfall River, Frostbite Waterfall
Z = 1.03  Rotwood Swamp
Z = 1.04  Fungal Marsh, Deeproot Spring
Z = 1.05  Enchanted Ruins
Z = 1.06  Frozen Peak, Overgrown Grotto
Z = 1.07  Astral Caverns
Z = 1.12  Infernal Heart, Abyssal Depth, Windswept Beach
Z = 1.20  Timelocked Sanctuary`,
"Z = how much a zone multiplies every weight. Measured on 650,000 minerals in 26 zones; zones not listed count as 1. The best place to chase a heavy piece is Timelocked Sanctuary (20% heavier than most zones)."],
["Luck","Luck from a luck cap",
`L = 0.56 × cap`,
"L = the luck a capped session actually pans at, cap = the cap you set. Measured on 326,000 capped minerals in 17 zones: every cap from 100 to 10,000 landed between 0.54 and 0.60. A cap only helps for minerals that get rarer with more luck; Best Luck Cap works out which."],
["Museum","Museum display boost at a weight",
`boost = Bmax × (W ÷ Kmax)^0.42`,
"boost = the stat boost the display gives, Bmax = its max boost (the mineral page shows \"max boost at X kg\"), Kmax = that X kg, W = the piece's weight (kg). Boost caps at Bmax once W reaches Kmax, and the game shows it rounded down to 2 decimals."],
["Museum","Weight for a target display boost",
`W = Kmax × (target ÷ Bmax)^2.38`,
"W = weight (kg) you need, target = the boost you want, Bmax = the display's max boost, Kmax = the weight for max boost. The boost curve above, solved for weight."],
["Museum","Share of max boost at a weight",
`part = (W ÷ Kmax)^0.42`,
"part = how much of the max boost you get (×100 for %), W = the piece's weight (kg), Kmax = the weight for max boost. Same for every mineral, so half the max-boost weight already gives about 75%."],
];
const box=f=>`<button type="button" class="box" data-copy="${esc(f)}" title="Click to copy"><span class="cp">Copy</span>${esc(f)}</button>`;
let q="";
function render(){const t=q.trim().toLowerCase();const rows=F.filter(x=>!t||x.join(" ").toLowerCase().includes(t));
  const groups=[...new Set(rows.map(x=>x[0]))];
  $("list").innerHTML=rows.length?groups.map(g=>`<section class="grp"><h2>${esc(g)}</h2><div class="cards">${rows.filter(x=>x[0]===g).map(([,h,f,p])=>`<div class="fc"><h3>${esc(h)}</h3>${box(f)}<p>${esc(p)}</p></div>`).join("")}</div></section>`).join(""):`<p class="empty">No formulas match.</p>`}
$("q").addEventListener("input",e=>{q=e.target.value;render()});
$("list").addEventListener("click",async e=>{const b=e.target.closest("[data-copy]");if(!b)return;const txt=b.dataset.copy;
  let ok=false;try{await navigator.clipboard.writeText(txt);ok=true}catch(err){const ta=document.createElement("textarea");ta.value=txt;ta.style.position="fixed";ta.style.opacity="0";document.body.appendChild(ta);ta.select();try{ok=document.execCommand("copy")}catch(_){}ta.remove()}
  const c=b.querySelector(".cp");b.classList.toggle("ok",ok);c.textContent=ok?"Copied":"Couldn't copy";setTimeout(()=>{b.classList.remove("ok");c.textContent="Copy"},1300)});
render();
})();
