(()=>{
const $=id=>document.getElementById(id);
// [group, title, formula (copied as is), what it means]
const F=[
["Pans","Average minerals per pan",
`average = 0.678 × capacity^0.565`,
"What a full pan gives on average over many pans. Luck doesn't change it."],
["Pans","Fewest and most minerals per pan",
`fewest = ½ × √capacity
most ≈ 2.5 × √capacity`,
"Every full pan lands between these two. Most pans sit in the lower part of that range."],
["Weight","Lightest and heaviest weight",
`lightest = 0.75 × base weight × (1 + Size Boost)
heaviest = 15.5 × base weight × (1 + Size Boost)`,
"Size Boost as a number (1,476% = 14.76). ×1.5 with the Solar Magnifier."],
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
