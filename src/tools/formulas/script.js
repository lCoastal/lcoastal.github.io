(()=>{
const $=id=>document.getElementById(id);
// [group, title, formula (copied as is), what it means]
const F=[
["Luck","Chance of a mineral (per mineral picked)",
`List the zone's minerals rarest first, with drop shares p1, p2, … (adding up to 1).
For the mineral in spot k:
a = p1 + … + p(k−1)   (everything rarer)
b = a + pk
f(n) = (1 − a)^n − (1 − b)^n
P = 0.2891·f(1) + 0.0280·f(max(1, 0.04317·L)) + 0.1905·f(max(1, 0.40579·L)) + 0.4924·f(max(1, 1.74153·L))`,
"L is your luck. Minerals with exactly the same odds share their chance evenly."],
["Luck","Very rare boost",
`x = log10(1 ÷ base chance)
up = clamp((x − 7.26) ÷ 0.5, 0, 1)
down = clamp((9.67 − x) ÷ 0.5, 0, 1)
P × (1 + 0.858 · min(up, down))`,
"Most Mythics (base odds about 1 in 18 million to 1 in 1.5 billion) get up to ×1.86."],
["Luck","Chance per pan",
`per pan = 1 − (1 − P)^n
n = 0.678 · capacity^0.565`,
"n is the average number of minerals in a full pan. Pans on average = 1 ÷ per pan."],
["Luck","Events and autopan",
`final luck = luck × 2 (Meteor Shower) × 1.5 (weather event)
autopan without Mastered: luck × ⅔`,
"Weather events: Nimue's Blessing, Blizzard, Swamp Fog, Starfall. They stack with the Meteor Shower."],
["Luck","Luck cap",
`luck used = min(your luck, cap × 0.63)`,
"A capped session behaves like about 63% of the cap. Less certain than the rest."],
["Luck","Senet Die",
`faces: ×0.5, ×0.75, ×1, ×1.25, ×1.5, ×3 (one roll per full pan)
average = (0.5 + 0.75 + 1 + 1.25 + 1.5 + 3) ÷ 6 = ×1.333`,
"Multiplies all of your luck for that pan, events included."],
["Pans","Minerals per pan",
`fewest = ½ × √capacity
average = 0.678 × capacity^0.565
most ≈ 2.5 × √capacity`,
"Luck doesn't change it. Extra-item events and items come on top."],
["Pans","Capacity for a number of minerals",
`possible at all = (n ÷ 2.5)²
on average = (n ÷ 0.678)^(1 ÷ 0.565)
every pan = (2 × n)²`,
"n is the number of minerals you want in a pan."],
["Modifiers","Chance of a modifier",
`chance = 1 − 0.937^B`,
"B is Modifier Boost as a multiplier (1,660% = 16.6). Luck doesn't change it. A Modifier Surge doubles B."],
["Modifiers","Which modifier",
`weights: Shiny 1, Pure 0.8, Glowing 0.5, Scorching 0.25, Irradiated 0.1, Iridescent 0.02, Cosmic 0.005, Mutated 0.001, Lunar 0.00025 (night), Perfect 0.0001
strength R = 11.662 · B^0.838 + 1.96352 · luck ÷ 1000
share = 0.313·f(1) + 0.127·f(max(1, 0.172·R)) + 0.559·f(R)`,
"f(n) is the same keep-the-rarest roll as for luck, over the modifier weights listed rarest first."],
["Weight","Weight of a mineral",
`W = B × (1 + S) × k × M
0.75 ≤ k ≤ 15.5`,
"B base weight, S Size Boost as a number (1,476% = 14.76), M = 1.5 with the Solar Magnifier, 2 in a Volcanic Eruption zone."],
["Weight","Lightest and heaviest",
`lightest = 0.75 × B × (1 + S)
heaviest = 15.5 × B × (1 + S)`,
"Exact. Multiply by M for the Solar Magnifier or an eruption."],
["Weight","How the roll k is spread",
`26.1%: k uniform from 0.75 to 1.88
h: k = 0.75 + 14.75 · x, x ~ Beta(a, 1.99)
rest (73.9% − h): k uniform from 0.75 to 15.5
h = 0.533 · (1 − e^(−(C − 1797) ÷ 2266)), 0 below 1,797
a = 4.24 + 0.000667 · C`,
"C is capacity. Bigger pans lean heavier; luck and the modifier make no difference."],
["Weight","Size Boost for a weight",
`minimum S = W ÷ (15.5 × B × M) − 1`,
"The least Size Boost (as a number) that makes weight W possible at all."],
["Museum","Museum total",
`total multiplier = 1 + sum of every display's boost for that stat`,
"A total of +3.125 Luck means ×4.125. Values assume each mineral is at its max-boost weight."],
["Museum","Modifier on a display",
`per stat: Common 0.005, Uncommon 0.0075, Rare 0.0125, Epic 0.02, Legendary 0.03, Mythic 0.05, Exotic 0.08
Treasured and Entombed count ×2 (Luck only)`,
"Added to every stat the modifier gives, e.g. Perfect gives Luck, Capacity and Size Boost."],
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
