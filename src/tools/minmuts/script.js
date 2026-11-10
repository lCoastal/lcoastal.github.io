
const $=id=>document.getElementById(id);
// [name, sell ×, 1 in N (0 = not from normal panning), museum stats, museum factor, how to get, appearance, colour, kind]
const MUTS=[
["Perfect",24,26764,["Luck","Capacity","Size Boost"],1,"Panning, about 1 in 26,764","Cyan, with a glowing, rotating white halo around a four-pointed star","#22b8cf","Panning"],
["Treasured",15,0,["Luck"],2,"Only from treasure chests, where every mineral is Treasured","Gold, with a soft golden sheen","#d4a017","Special"],
["Lunar",14,10705,["Dig Speed","Shake Speed","Walk Speed"],1,"Panning at night only, about 1 in 10,705","Light yellow, with a spiky eight-petal flower of pulsing pink light","#e8c95a","Panning"],
["Voidtorn",11,0,["Luck","Capacity"],1,"Galactic Pan or Galactic Shovel, a shovel with the Voidtouched enchant, or The Void","Deep purple, cracked with glowing purple fissures","#7b3fe4","Special"],
["Mutated",9,2676,["Luck","Dig Strength","Modifier Boost"],1,"Panning, about 1 in 2,676","Purple, with dark purple tentacles of light always moving","#9b4dca","Panning"],
["Cosmic",6,535,["Capacity","Shake Strength"],1,"Panning, about 1 in 535","Vibrant pink, with pink sparks and halos","#e64fa8","Panning"],
["Electrified",5,0,["Dig Speed","Shake Speed"],1,"Panning during a Thunderstorm (admin-only event)","Bright yellow, with small electric sparks and flashes","#f2d22e","Special"],
["Iridescent",3.5,134,["Luck"],1,"Panning, about 1 in 134","Pink-violet, with purple light beams","#c46fe0","Panning"],
["Irradiated",2.5,27,["Modifier Boost"],1,"Panning, about 1 in 27","Green, with radioactive pulses and specks of light","#3fbf4f","Panning"],
["Crystalline",2,0,["Size Boost"],1,"Every mineral from a geode, or 1 in 10 with a Crystal Touch shovel (or Geothermal, indirectly)","Baby blue, with a faceted, amethyst-tinted crystal lattice","#7cc6f0","Special"],
["Scorching",2,11,["Dig Strength"],1,"Panning, about 1 in 11. Volcanic areas and Solar Flare may raise the odds","Orange-red, with heat and ember effects","#f0642a","Panning"],
["Glowing",1.6,5,["Shake Speed"],1,"Panning, about 1 in 5","Yellow, with a soft glow","#f2c230","Panning"],
["Pure",1.35,3,["Dig Speed"],1,"Panning, about 1 in 3","White, with a clean, flawless surface","#cfd6dd","Panning"],
["Shiny",1.2,3,["Shake Strength"],1,"Panning, about 1 in 3","Blue, with a subtle glint and small sparkles","#4b8df0","Panning"],
["Purified",1,0,[],0,"Every mineral while the Purity rune is equipped","White, with no visual effect","#e6e9ec","Special"],
["Charming",1,0,[],0,"Valentine's event, during Rose Rain","Pink, with a subtle glint and small pink sparkles","#f28cb8","Event"],
["Rosy",1,0,[],0,"Valentine's event, during Rose Rain","Red, with a subtle glint and small pink sparkles","#e0485c","Event"],
["Ghostly",1,0,[],0,"Halloween event, at Haunted Creek","Light green, with green smoke and the odd ghostly face","#8fe39a","Event"],
["Spooky",1,0,[],0,"Halloween event, at Haunted Creek or during Hallows' Eve","Turquoise, with white flashes of light","#2fc4b2","Event"],
["Jolly",1,0,[],0,"Christmas event, at the North Pole","","#d94040","Event"],
["Hearthflame",1,0,[],0,"Summer event, during Night of the Bonfire","","#f08a30","Event"],
["Summer",1,0,[],0,"Summer event","","#f5b942","Event"],
["Tidal",1,0,[],0,"Summer event, panning at a beach inside Shifting Tides circles","","#3aa0d8","Event"]
].map(([n,sell,one,stats,f,how,look,c,kind],i)=>({n,sell,one,stats,f,how,look,c,kind,i}));
const MULT={Common:.005,Uncommon:.0075,Rare:.0125,Epic:.02,Legendary:.03,Mythic:.05,Exotic:.08};
const RARS=["Common","Uncommon","Rare","Epic","Legendary","Mythic","Exotic"];
const KINDS=["Panning","Special","Event"];
const KIND_NOTE={Panning:"Can roll on any mineral you pan",Special:"Only from certain tools, places or events",Event:"Seasonal and cosmetic: 1× sell, no museum boost"};
let S={min:"",kg:1,rar:"Legendary",kind:"",sort:"rare",rev:false};try{Object.assign(S,JSON.parse(localStorage.getItem("pmm-s")||"{}"))}catch(e){}
const save=()=>{try{localStorage.setItem("pmm-s",JSON.stringify(S))}catch(e){}};
// weight is shared with the Sell value calculator in the mineral pop-up
const sharedKg=()=>{try{const v=JSON.parse(localStorage.getItem("pt-sellcalc")||"{}").kg;return v===undefined?null:v}catch(e){return null}};
const putKg=v=>{try{const o=JSON.parse(localStorage.getItem("pt-sellcalc")||"{}");o.kg=Math.max(0,+v||0);localStorage.setItem("pt-sellcalc",JSON.stringify(o))}catch(e){}};
{const k=sharedKg();if(k!==null)S.kg=k}
$("rar").innerHTML=RARS.map(r=>`<option>${r}</option>`).join("");
$("kinds").innerHTML=["",...KINDS].map(k=>`<button type="button" class="chip" data-k="${k}">${k||"All"}</button>`).join("");
$("min").value=S.min;$("kg").value=S.kg;$("rar").value=S.rar;$("sort").value=S.sort;
const curMin=()=>MIN[(S.min||"").trim().toLowerCase()]||null;
// money is rounded to 2 decimals and shortened: K thousand, M million, B billion, T trillion, Qa, Qi, then e+ notation
const SUF=["","K","M","B","T","Qa","Qi"];
// full dollar amounts; the Short numbers setting shortens big ones everywhere
const money=v=>{if(!isFinite(v))return "—";const neg=v<0;v=Math.abs(v);return (neg?"-$":"$")+(v>=100?Math.round(v):Number(v.toFixed(2))).toLocaleString("en-US",{maximumFractionDigits:2})};
// rarity order: most common first is "ascending"; non-panning ones go after, rarest-feeling by sell value
const rareKey=m=>m.one?m.one:1e9+(100-m.sell);
// the mutations the filters and sort currently show (the page and the saved image use the same list)
function shownMuts(){const t=$("q").value.trim().toLowerCase();
  let rows=MUTS.filter(x=>(!S.kind||x.kind===S.kind)&&(!t||(x.n+" "+x.how+" "+x.look+" "+x.stats.join(" ")+" "+x.kind).toLowerCase().includes(t)));
  const cmp={rare:(a,b)=>rareKey(b)-rareKey(a)||b.sell-a.sell,sell:(a,b)=>b.sell-a.sell||a.i-b.i,name:(a,b)=>a.n.localeCompare(b.n)}[S.sort];
  rows.sort(cmp);if(S.rev)rows.reverse();return rows}
function render(){
  const m=curMin();const kg=Math.max(0,+S.kg||0);const per=m?num(m.v):null;
  [...$("kinds").children].forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.k===S.kind)));
  const nat=S.sort==="name"?1:S.sort==="sell"?-1:-1;const d=nat*(S.rev?-1:1);
  $("dir").innerHTML=d>0?"<b>↑</b> Ascending":"<b>↓</b> Descending";$("dir").title="Click to sort "+(d>0?"descending":"ascending");
  $("pinfo").innerHTML=m?`<span data-mineral="${esc(m.n)}" class="lk">${esc(m.n)}</span> is ${esc(m.r)} and sells for ${money(per)} per kg, so ${fmt(kg,2)} kg is ${money(per*kg)} with no mutation. Museum values below follow its rarity.`:(S.min?"No mineral by that name. Pick one from the list.":"Pick a mineral to see sell prices. Museum values follow the rarity on the right.");
  const rows=shownMuts();
  const card=x=>{const mv=MULT[S.rar]*x.f;
    return `<article class="m" style="--mc:${x.c}"><div class="mh"><b><span class="dot"></span>${esc(x.n)}</b><span class="tag">${esc(x.kind)}</span></div>
    <div class="nums"><div><span class="lab">Sells for</span><b>${fmt(x.sell,2)}×</b></div><div><span class="lab">${m?esc(fmt(kg,2))+" kg "+esc(m.n):"Chance"}</span><b>${m?money(per*kg*x.sell):x.one?'~1 in '+fmt(x.one,0):"—"}</b></div></div>
    ${m&&x.one?`<p class="row"><span class="lab">Chance</span>~1 in ${fmt(x.one,0)} per mineral</p>`:""}
    <div class="mus">${x.stats.length?x.stats.map(s=>`<span>${esc(s)} <em>+${+(mv).toFixed(4)}×</em></span>`).join(""):'<span style="color:var(--muted);border-color:var(--line)">No museum boost</span>'}</div>
    <p class="row"><span class="lab">How to get</span>${esc(x.how)}</p>
    ${x.look?`<p class="look">${esc(x.look)}</p>`:""}</article>`};
  if(!rows.length){$("list").innerHTML='<div class="empty">No mutations match.</div>';return}
  $("list").innerHTML=S.sort==="rare"&&!S.kind
    ?(S.rev?[...KINDS].reverse():KINDS).map(k=>{const g=rows.filter(x=>x.kind===k);return g.length?`<p class="grp">${k} · ${esc(KIND_NOTE[k])}</p><div class="grid">${g.map(card).join("")}</div>`:""}).join("")
    :`<div class="grid">${rows.map(card).join("")}</div>`;
}
// mineral picker with pictures: pick from the list, or keep typing
makeAC({inp:$("min"),items:P.mins.map(m=>({n:m.n,tag:m.r,ic:m.ic,col:rc(m.r)})),cur:()=>{const m=curMin();return m?m.n:""},icon:()=>{const m=curMin();return m&&m.ic},pick:x=>{$("min").value=x.n;$("min").dispatchEvent(new Event("input"))}});
$("min").addEventListener("input",()=>{S.min=$("min").value;const m=curMin();if(m&&RARS.includes(m.r)){S.rar=m.r;$("rar").value=m.r}save();render()});
$("kg").addEventListener("input",()=>{S.kg=$("kg").value;putKg(S.kg);save();render()});
window.addEventListener("storage",e=>{if(e.key!=="pt-sellcalc")return;const k=sharedKg();if(k!==null&&+k!==+S.kg&&document.activeElement!==$("kg")){S.kg=k;$("kg").value=k;save();render()}});
$("rar").onchange=()=>{S.rar=$("rar").value;save();render()};
$("kinds").onclick=e=>{const b=e.target.closest("[data-k]");if(!b)return;S.kind=b.dataset.k;save();render()};
$("sort").onchange=()=>{S.sort=$("sort").value;S.rev=false;save();render()};
$("dir").onclick=()=>{S.rev=!S.rev;save();render()};
$("q").oninput=render;
$("toImg").onclick=()=>{const rows=shownMuts();if(!rows.length){ptToast("No mutations match, nothing to save");return}
  const m=curMin(),kg=Math.max(0,+S.kg||0),per=m?num(m.v):null,q=$("q").value.trim();
  const cols=[{h:"Mutation",w:.17},{h:"Sells for",w:.09,al:"r"},m?{h:`${fmt(kg,2)} kg ${m.n}`,w:.13,al:"r"}:null,{h:"Chance",w:.12,al:"r"},{h:`Museum (${S.rar})`,w:m?.22:.26},{h:"How to get",w:m?.27:.36}].filter(Boolean);
  const row=x=>{const mv=MULT[S.rar]*x.f;return {cells:[{t:x.n,b:true,col:x.c,dot:x.c,sub:x.kind},{t:fmt(x.sell,2)+"×",mono:true}].concat(m?[{t:money(per*kg*x.sell),mono:true}]:[]).concat([{t:x.one?"~1 in "+fmt(x.one,0):"—",mono:true},x.stats.length?{chips:x.stats.map(st=>({t:`${st} +${+(mv).toFixed(4)}×`,col:statHex(st)}))}:{t:"No museum boost",col:"#98a2ad",fs:12.5},{t:x.how,wrap:true,fs:12.5}])}};
  const grouped=S.sort==="rare"&&!S.kind;
  const list=grouped?(S.rev?[...KINDS].reverse():KINDS).flatMap(k=>{const g=rows.filter(x=>x.kind===k);return g.length?[{group:k+" · "+KIND_NOTE[k]}].concat(g.map(row)):[]}):rows.map(row);
  const sub=[`${rows.length} mutation${rows.length===1?"":"s"}`];if(S.kind)sub.push(S.kind);if(q)sub.push(`matching "${q}"`);sub.push(`museum values for ${S.rar}`);if(m)sub.push(`${fmt(kg,2)} kg ${m.n} sells for ${money(per*kg)} with no mutation`);
  ptSaveImg(m?`${m.n} mutations`:"Mineral mutations",()=>ptTableImage({title:m?`Mutations on ${m.n}`:"Mineral mutations",tic:m&&m.ic,sub,sections:[{cols,rows:list}]}))};
window.ptFind=n=>{$("q").value=n;S.kind="";render()};
$("toOdds").onclick=()=>{try{window.parent.show("mododds")}catch(e){}};
render();
