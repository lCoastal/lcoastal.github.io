
const KIND="shovels";
const D={"items": [{"image": "RustyShovel.png", "name": "Rusty Shovel", "description": "A rusty shovel on the verge of breaking apart. It works fine... for now.", "price": "Free", "strength": "1", "speed": "0.8", "toughness": "1", "location": "Given to the player upon joining.", "section": "Main"}, {"image": "IronShovel.png", "name": "Iron Shovel", "description": "A tough iron shovel.", "price": "2,000", "strength": "2", "speed": "0.8", "toughness": "2", "location": "Rubble Creek Sands", "section": "Main"}, {"image": "SteelShovel.png", "name": "Steel Shovel", "description": "A strong shovel made of steel. Can dig through tougher deposits.", "price": "20,000", "strength": "3", "speed": "0.8", "toughness": "2", "location": "Rubble Creek Sands", "section": "Main"}, {"image": "SilverShovel.png", "name": "Silver Shovel", "description": "A lightweight silver shovel. How can silver be this strong?", "price": "75,000", "strength": "4", "speed": "1.1", "toughness": "2", "location": "Rubble Creek Sands", "section": "Main"}, {"image": "ReinforcedShovel.png", "name": "Reinforced Shovel", "description": "A reliable titanium shovel built for tough conditions.", "price": "135,000", "strength": "5", "speed": "0.9", "toughness": "3", "location": "Rubble Creek Sands", "section": "Main"}, {"image": "TheExcavator.png", "name": "The Excavator", "description": "A powerful shovel that can crack through stone.", "price": "320,000", "strength": "7", "speed": "0.7", "toughness": "3", "location": "Fortune River", "section": "Main"}, {"image": "GoldenShovel.png", "name": "Golden Shovel", "description": "A precious shovel made from a rare gold alloy.", "price": "1,333,000", "strength": "8", "speed": "1", "toughness": "3", "location": "Fortune River", "section": "Main"}, {"image": "MeteoricShovel.png", "name": "Meteoric Shovel", "description": "A shovel forged from meteoric iron. Holding it fills you with energy.", "price": "4,000,000", "strength": "7", "speed": "1.5", "toughness": "4", "location": "Fortune River", "section": "Main"}, {"image": "DiamondShovel.png", "name": "Diamond Shovel", "description": "A shovel made from diamond, the hardest material!", "price": "12,500,000", "strength": "12", "speed": "1", "toughness": "4", "location": "Fortune River", "section": "Main"}, {"image": "DivineShovel.png", "name": "Divine Shovel", "description": "A divine shovel blessed with the strength to break through nearly anything.", "price": "40,000,000", "strength": "16", "speed": "1.1", "toughness": "5", "location": "Crystal Cavern River", "section": "Main"}, {"image": "Obsidian_shovel.png", "name": "Obsidian Shovel", "description": "An obsidian shovel. Its fire-resistant properties make it a useful tool in volcanic environments.", "price": "80,000,000", "strength": "20", "speed": "1.2", "toughness": "5", "location": "Caldera Park", "section": "Main"}, {"image": "EarthbreakerShovel.png", "name": "Earthbreaker", "description": "A relic from an ancient civilization. Despite its age, incredible power still lingers within.", "price": "125,000,000", "strength": "30", "speed": "1", "toughness": "5", "location": "Waterfall Temple", "section": "Main"}, {"image": "Dragonflame Shovel.png", "name": "Dragonflame Shovel", "description": "A blazing shovel that burns through all deposits.", "price": "400,000,000", "strength": "50", "speed": "0.65", "toughness": "6", "location": "Magma Furnace", "section": "Main"}, {"image": "Fossilized_Shovel.png", "name": "Fossilized Shovel", "description": "An ancient bone shovel that has been fossilized with age.", "price": "1,000,000,000", "strength": "40", "speed": "1", "toughness": "6", "location": "Ancient Ruins", "section": "Main"}, {"image": "Icebreaker.png", "name": "Icebreaker", "description": "A frozen shovel that can crush through frozen deposits.", "price": "10,000,000,000", "strength": "60", "speed": "1.1", "toughness": "6", "location": "Frozen Peak", "section": "Main"}, {"image": "LifetouchedShovel.png", "name": "Lifetouched Shovel", "description": "A shovel formed by the spirits.", "price": "80,000,000,000", "strength": "100", "speed": "1", "toughness": "7", "location": "Deeproot Spring", "section": "Main"}, {"image": "Abyssal Shovel.png", "name": "Abyssal Shovel", "description": "...", "price": "200,000,000,000", "strength": "125", "speed": "1.1", "toughness": "8", "location": "Abyssal Depth", "section": "Main"}, {"image": "venomspadeshovel.png", "name": "Venomspade Shovel", "description": "A toxic shovel that melts anything it touches", "price": "500,000,000,000", "strength": "200", "speed": "0.8", "toughness": "9", "location": "Fungal Marsh", "section": "Main"}, {"image": "Starcrusher.PNG", "name": "Starcrusher", "description": "A shovel forged from astral materials. Resonates with nearby totems, benefitting more from their effects. (Passive: +25% buffs from Totems, 1.1× additional Luck)", "price": "10,000,000,000,000", "strength": "300", "speed": "1.0", "toughness": "10", "passive": "+25% buffs from Totems, 1.1× additional Luck", "location": "Starfall River", "section": "Main"}, {"image": "Pharaoh_shovel.png", "name": "Pharaoh's Shovel", "description": "A shovel once used by the ruler of a long-lost civilization. (Passive: Sun Blessing)", "price": "100,000,000,000,000", "strength": "500", "speed": "0.8", "toughness": "11", "location": "Lifespring Oasis", "section": "Main"}, {"image": "Galactic Shovel.png", "name": "Galactic Shovel", "description": "A shovel formed from the stars. Has a chance to grant 'Voidtorn' to found items.", "price": "2,000,000,000", "strength": "60", "speed": "0.8", "toughness": "6", "location": "The Void", "section": "Limited-Time Shovels"}, {"image": "pumpkinshovel.webp", "name": "Pumpkin Shovel", "description": "The shovel of the Pumpkin King. Summons a spirit to assist with panning. This spirit is boosted when used with the Pumpkin Pan.", "candy": "1,000", "strength": "100", "speed": "1.25", "toughness": "8", "location": "Haunted Creek", "section": "Limited-Time Shovels"}, {"image": "CandyCane_Shovel.png", "name": "Candy Cane Shovel", "description": "A sugary shovel. Has a chance to give the effects of an XP cookie after panning.", "ornament": "2000", "strength": "140", "speed": "1.0", "toughness": "9", "location": "North Pole", "section": "Limited-Time Shovels"}, {"image": "Cupid's_arrow.png", "name": "Cupid's Arrow", "description": "An oversized arrow shaped into an arrow. Gives a chance to obtain Charming and Rosy modifiers.", "heart crystals": "2000", "strength": "150", "speed": "1.0", "toughness": "9", "location": "Fortune River", "section": "Limited-Time Shovels"}], "img": {"RustyShovel.png": "%%IMG:Shovel: Rusty Shovel%%", "IronShovel.png": "%%IMG:Shovel: Iron Shovel%%", "SteelShovel.png": "%%IMG:Shovel: Steel Shovel%%", "SilverShovel.png": "%%IMG:Shovel: Silver Shovel%%", "ReinforcedShovel.png": "%%IMG:Shovel: Reinforced Shovel%%", "TheExcavator.png": "%%IMG:Shovel: The Excavator%%", "GoldenShovel.png": "%%IMG:Shovel: Golden Shovel%%", "MeteoricShovel.png": "%%IMG:Shovel: Meteoric Shovel%%", "DiamondShovel.png": "%%IMG:Shovel: Diamond Shovel%%", "DivineShovel.png": "%%IMG:Shovel: Divine Shovel%%", "Obsidian_shovel.png": "%%IMG:Shovel: Obsidian Shovel%%", "EarthbreakerShovel.png": "%%IMG:Shovel: Earthbreaker%%", "Dragonflame Shovel.png": "%%IMG:Shovel: Dragonflame Shovel%%", "Fossilized_Shovel.png": "%%IMG:Shovel: Fossilized Shovel%%", "Icebreaker.png": "%%IMG:Shovel: Icebreaker%%", "LifetouchedShovel.png": "%%IMG:Shovel: Lifetouched Shovel%%", "Abyssal Shovel.png": "%%IMG:Shovel: Abyssal Shovel%%", "venomspadeshovel.png": "%%IMG:Shovel: Venomspade Shovel%%", "Starcrusher.PNG": "%%IMG:Shovel: Starcrusher%%", "Pharaoh_shovel.png": "%%IMG:Shovel: Pharaoh's Shovel%%", "Galactic Shovel.png": "%%IMG:Shovel: Galactic Shovel%%", "pumpkinshovel.webp": "%%IMG:Shovel: Pumpkin Shovel%%", "CandyCane_Shovel.png": "%%IMG:Shovel: Candy Cane Shovel%%", "Cupid's_arrow.png": "%%IMG:Shovel: Cupid's Arrow%%"}, "upg": {}, "mins": {}, "locs": ["Rubble Creek Sands", "Rubble Creek Deposits", "Fortune River", "Fortune River Delta", "Sunset Beach", "Crystal Cavern River", "Azuralite Oasis", "Volcanic Sands", "Volcanic Springs", "Windswept Beach", "Magma Furnace", "Infernal Heart", "Frostbite River", "Frostbite Waterfall", "Frozen Peak", "Overgrown Grotto", "Deeproot Spring", "Enchanted Ruins", "Abyssal Depth", "Rotwood Swamp", "Fungal Marsh", "Timelocked Sanctuary", "Meteor Falls", "Starfall River", "Astral Caverns", "Sandstone Stream", "Mystic Floodplains", "Lifespring Oasis", "The Void", "Haunted Creek", "North Pole", "Seashell Beach"]};
try{((window.parent.PTCUSTOM||{})[KIND]||[]).forEach(x=>D.items.push(x))}catch(e){}
const CFG={
  pans:{stats:[["luck","Luck"],["capacity","Capacity"],["strength","Shake Strength","Shake Str."],["speed","Shake Speed","Shake Spd."]],passive:true},
  shovels:{stats:[["strength","Dig Strength","Dig Str."],["speed","Dig Speed","Dig Spd."],["toughness","Toughness"]],passive:true},
  sluices:{stats:[["luck","Luck"],["capacity","Capacity"],["efficiency","Efficiency"],["toughness","Toughness"]],passive:false,upg:true}
}[KIND];
const esc=s=>String(s??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const num=v=>{const s=String(v??"").replace(/,/g,"");const n=parseFloat(s);return isNaN(n)?null:(s.endsWith("%")?n/100:n)};
const fmt=n=>n==null?"—":n.toLocaleString("en-US",{maximumFractionDigits:2});
const rc=r=>"var(--c-"+String(r).toLowerCase()+")";
const LOCS=new Set(D.locs);
const ALIAS={"Rubble Creek":"Rubble Creek Sands","The Magma Furnace":"Magma Furnace","Crystal Caverns":"Crystal Cavern River"};
const locHtml=l=>{const t=ALIAS[l]||l;return LOCS.has(t)?`<span class="lk" data-location="${esc(t)}" title="Ctrl+click to open this location">${esc(l)}</span>`:esc(l)};
const CUR=[["candy","Candy"],["ornament","Ornaments"],["heart crystal","Heart Crystals"],["heart crystals","Heart Crystals"],["eggs","Eggs"]];
// one record per item with numbers parsed once
const ITEMS=D.items.map((x,i)=>{if(/^Given to the player/.test(x.location))x={...x,location:"Starter item"};const ev=!/^(List of|Main)/.test(x.section);let price=num(x.price),cur="$";
  if(x.price==="Free"){price=0;cur="free"}
  if(price==null){const c=CUR.find(([k])=>x[k]!=null);if(c){price=num(x[c[0]]);cur=c[1]}}
  const s={};CFG.stats.forEach(([k])=>s[k]=num(x[k]));
  return {...x,i,ev,price,cur,s,img:D.img[x.image]||""}});
const priceHtml=x=>x.cur==="free"?'Free<small>starter</small>':x.cur==="$"?"$"+fmt(x.price):`${fmt(x.price)}<small>${esc(x.cur)}</small>`;
const passHtml=p=>p?p.split(/,\s*(?![^(]*\))/).map(t=>t.replace(/^([+\-−]?\d+(?:\.\d+)?%)/,(m)=>`<em>${m.replace("-","−")}</em>`)).map(t=>`<span class="${/^<em>−/.test(t)?"neg":""}">${t}</span>`).join(", "):'<span class="none">—</span>';

const Store={get:n=>{try{return window.parent.ptStore.get(n)}catch(e){return {}}},toggle:(n,k)=>{try{window.parent.ptStore.toggle(n,k)}catch(e){}}};
const tgHtml=n=>{const s=Store.get(n);return `<span class="tg"><button type="button" class="fav" data-tg="fav" data-name="${esc(n)}" aria-pressed="${!!s.fav}" title="Favourite" aria-label="Favourite ${esc(n)}">★</button><button type="button" class="own" data-tg="own" data-name="${esc(n)}" aria-pressed="${!!s.own}" title="I own this" aria-label="Owned: ${esc(n)}">✓</button></span>`};
document.addEventListener("click",e=>{const b=e.target.closest("[data-tg]");if(!b)return;e.stopPropagation();Store.toggle(b.dataset.name,b.dataset.tg)},true);
let onlyFav=false,onlyOwn=false;
window.ptStoreChanged=()=>{document.querySelectorAll("[data-tg]").forEach(b=>b.setAttribute("aria-pressed",String(!!Store.get(b.dataset.name)[b.dataset.tg])));if(onlyFav||onlyOwn)render()};
let sortKey="order",sortDir=1,showEv=true;
try{const f=JSON.parse(localStorage.getItem("pg-"+KIND)||"{}");if(f.k)sortKey=f.k;if(f.d)sortDir=f.d;if(f.ev===false)showEv=false}catch(e){}
const q=document.getElementById("q"),list=document.getElementById("list"),evBtn=document.getElementById("evBtn");
evBtn.setAttribute("aria-pressed",String(showEv));
const save=()=>{try{localStorage.setItem("pg-"+KIND,JSON.stringify({k:sortKey,d:sortDir,ev:showEv}))}catch(e){}};
const COLS=[["order","",""],["name","Name",""],["price","Price","n"],...CFG.stats.map(([k,l,sh])=>[k,sh||l,"n"]),...(CFG.passive?[["passive","Passive",""]]:[]),...(CFG.upg?[["pts","Upg.","n"]]:[]),["location","Location",""]];
const val=(x,k)=>k==="order"?x.i:k==="name"?x.name.toLowerCase():k==="price"?(x.cur==="$"||x.cur==="free"?x.price:1e30+x.price):k==="pts"?(D.upg[x.name]?D.upg[x.name].points:-1):k==="passive"?(x.passive||"~"):k==="location"?x.location:x.s[k]??-1;

function table(rows,ev){
  const max={};CFG.stats.forEach(([k])=>max[k]=Math.max(...rows.map(r=>r.s[k]??0)));
  const head=COLS.map(([k,l,c])=>k==="order"?'<th scope="col" aria-label="Icon"></th>':`<th scope="col" class="${c}" aria-sort="${sortKey===k?(sortDir>0?"ascending":"descending"):"none"}"><button type="button" data-sort="${k}" title="Sort by ${l}">${l}${sortKey===k?`<span class="ar">${sortDir>0?"▲":"▼"}</span>`:'<span class="ar idle" aria-hidden="true">⇅</span>'}</button></th>`).join("");
  const body=rows.map(x=>{const u=D.upg[x.name];return `<tr tabindex="0" data-open="${x.i}">
    <td class="ic"><div class="icon">${x.img?`<img src="${x.img}" alt="" width="42" height="42" loading="lazy">`:""}</div></td>
    <td><div class="nm"><b>${esc(x.name)}</b>${ev?"<span>Limited-time</span>":""}${tgHtml(x.name)}</div></td>
    <td class="pr">${priceHtml(x)}</td>
    ${CFG.stats.map(([k])=>{const v=x.s[k];const top=v!=null&&v===max[k]&&rows.length>1;return `<td class="n${top?" top":""}" data-l="${esc((CFG.stats.find(z=>z[0]===k)||[])[2]||(CFG.stats.find(z=>z[0]===k)||[])[1])}" ${top?'title="Highest in this list"':""}>${fmt(v)}${v!=null&&max[k]?`<span class="bar" style="width:${(v/max[k]*100).toFixed(1)}%"></span>`:""}</td>`}).join("")}
    ${CFG.passive?`<td class="ps">${passHtml(x.passive)}</td>`:""}
    ${CFG.upg?`<td class="n" data-l="Upg.">${u?u.points+" pts":'<span class="none">—</span>'}</td>`:""}
    <td class="lc">${locHtml(x.location)}</td></tr>`}).join("");
  return `<section class="grp${ev?" ev":""}"><div class="gh"><b>${ev?"Limited-time "+KIND:"Shop "+KIND}</b><span>${rows.length} ${rows.length===1?"item":"items"}${ev?" · event currency or past events":" · in the order you unlock them"}</span></div>
    <div class="tw"><table class="gear"><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table></div></section>`}

function render(){
  const t=q.value.trim().toLowerCase();
  let rows=ITEMS.filter(x=>(!t||(x.name+" "+(x.passive||"")+" "+x.location+" "+(x.description||"")).toLowerCase().includes(t))&&(showEv||!x.ev)&&(!onlyFav||Store.get(x.name).fav)&&(!onlyOwn||Store.get(x.name).own));
  rows.sort((a,b)=>{const A=val(a,sortKey),B=val(b,sortKey);return (A<B?-1:A>B?1:0)*sortDir||a.i-b.i});
  const shop=rows.filter(x=>!x.ev),evs=rows.filter(x=>x.ev);
  list.innerHTML=(shop.length?table(shop,false):"")+(evs.length?table(evs,true):"")||'<div class="empty">Nothing matches these filters.</div>';
  syncMob();
  document.getElementById("count").textContent=`${rows.length} of ${ITEMS.length} ${KIND}`;
}
q.addEventListener("input",render);
const favBtn=document.getElementById("favBtn"),ownBtn=document.getElementById("ownBtn"),mSort=document.getElementById("mSort");
favBtn.onclick=()=>{onlyFav=!onlyFav;favBtn.setAttribute("aria-pressed",String(onlyFav));render()};
ownBtn.onclick=()=>{onlyOwn=!onlyOwn;ownBtn.setAttribute("aria-pressed",String(onlyOwn));render()};
// phone sort picker (table headers are hidden on phones)
mSort.innerHTML=COLS.filter(c=>c[0]!=="name"&&c[0]!=="location"&&c[0]!=="passive").map(([k,l])=>k==="order"?`<option value="order">Shop order</option>`:`<option value="${k}">${l}</option>`).join("");
const defDir=k=>CFG.stats.some(x=>x[0]===k)||k==="pts"?-1:1;
function syncMob(){if([...mSort.options].some(o=>o.value===sortKey))mSort.value=sortKey;const b=document.getElementById("dirBtn");b.innerHTML=sortDir>0?"<b>↑</b> Ascending":"<b>↓</b> Descending";b.title="Click to sort "+(sortDir>0?"descending":"ascending")}
document.getElementById("dirBtn").onclick=()=>{sortDir=-sortDir;save();render()};
mSort.onchange=()=>{sortKey=mSort.value;sortDir=defDir(sortKey);save();render()};
evBtn.addEventListener("click",()=>{showEv=!showEv;evBtn.setAttribute("aria-pressed",String(showEv));save();render()});
list.addEventListener("click",e=>{
  if(e.ctrlKey||e.metaKey)return;
  const s=e.target.closest("[data-sort]");if(s){const k=s.dataset.sort;const def=CFG.stats.some(x=>x[0]===k)||k==="pts"||k==="price"&&false?-1:1;if(sortKey===k){if(sortDir===def)sortDir=-def;else{sortKey="order";sortDir=1}}else{sortKey=k;sortDir=def}save();render();
    const nb=list.querySelector(`[data-sort="${k}"]`);nb&&nb.focus();return}
  const r=e.target.closest("[data-open]");if(r)openItem(+r.dataset.open)});
list.addEventListener("keydown",e=>{if((e.key==="Enter"||e.key===" ")&&e.target.matches("tr[data-open]")){e.preventDefault();openItem(+e.target.dataset.open)}});

// pop-up
const scrim=document.getElementById("scrim"),page=document.getElementById("page");let lastFocus=null;
function openItem(i){
  const x=ITEMS[i];if(!x)return;try{window.ptRecent&&ptRecent({pans:"Pan",shovels:"Shovel",sluices:"Sluice"}["shovels"],x.name)}catch(e){}
  const prev=x.ev?null:ITEMS.filter(y=>!y.ev&&y.i<x.i).pop();
  const u=D.upg[x.name];
  page.className="page"+(x.ev?" ev":"");
  page.innerHTML=`<div class="ph"><div class="icon">${x.img?`<img src="${window.ptBig?ptBig(x.img):x.img}" alt="" width="120" height="120">`:""}</div>
      <div><span class="sub">${x.ev?"Limited-time":"Shop"}</span><h2 id="pname">${esc(x.name)}</h2></div>
      <div class="pv">${x.cur==="free"?"Free":x.cur==="$"?"$"+fmt(x.price):fmt(x.price)+" "+esc(x.cur)}<small>${locHtml(x.location)}</small></div>
      <button type="button" class="close" id="pclose">Close</button></div>
    ${x.description&&x.description!=="..."?`<p class="desc">${esc(x.description)}</p>`:""}
    <div>${tgHtml(x.name)}</div>
    <div class="psec"><h3>Stats${prev?` <span style="text-transform:none;letter-spacing:0;font-weight:400">· change from ${esc(prev.name)}</span>`:""}</h3>
      <div class="stats">${CFG.stats.map(([k,l])=>{const v=x.s[k],p=prev&&prev.s[k];const d=v!=null&&p!=null?+(v-p).toFixed(3):null;
        return `<div class="st"><span>${l}</span><b>${fmt(v)}</b>${d==null?"":`<small class="${d>0?"up":d<0?"dn":""}">${d>0?"+":d<0?"−":"±"}${fmt(Math.abs(d))}${p?` (${d>=0?"+":"−"}${fmt(Math.abs(d/p*100))}%)`:""}</small>`}</div>`}).join("")}</div></div>
    ${CFG.passive?`<div class="psec"><h3>Passive</h3>${x.passive?`<ul class="pas">${x.passive.split(/,\s*(?![^(]*\))/).map(t=>`<li>${passHtml(t)}</li>`).join("")}</ul>`:'<span class="none">No passive</span>'}</div>`:""}
    ${CFG.upg?`<div class="psec"><h3>Upgrades at the Mad Scientist</h3>${u?`<p class="note">${u.points} upgrade points to spend. Most stats cost 1 point per tier for up to 10 tiers; Size Boost costs 2 per tier and Autocollect/Self-Propulsion are one-off perks.</p>
      <div class="tw"><table class="upg"><tr><th>Stat</th><th class="r">Per tier / max</th><th class="r">Cost per tier</th><th>Material</th><th class="r">Points</th></tr>
      ${u.rows.map(([st,cost,mat,pc,gain])=>{const m=D.mins[mat.toLowerCase()];return `<tr><td>${esc(st)}</td><td class="r">${esc(gain)}</td><td class="r">${esc(cost)}</td>
        <td><span class="mat"${m?` data-mineral="${esc(m.n)}" title="Ctrl+click to open this mineral"`:""}>${m&&m.ic?`<img src="${m.ic}" alt="" width="22" height="22">`:""}<span class="${m?"lk":""}">${esc(mat)}</span>${m?`<span class="rr" style="--rc:${rc(m.r)}">${esc(m.r)}</span>`:""}</span></td><td class="r">${esc(pc)}</td></tr>`}).join("")}</table></div>`:'<span class="none">This sluice can’t be upgraded.</span>'}</div>`:""}
    <div class="psec"><h3>Compare</h3><div class="cmp"><select id="cmpWith" aria-label="Compare with"><option value="">Compare with another ${KIND.slice(0,-1)}…</option>${ITEMS.filter(y=>y!==x).map(y=>`<option value="${y.i}">${esc(y.name)}</option>`).join("")}</select></div><div class="tw" id="cmpOut"></div></div>`;
  document.getElementById("cmpWith").onchange=e=>{const y=ITEMS[+e.target.value];const o=document.getElementById("cmpOut");if(!e.target.value){o.innerHTML="";return}
    const rowsC=[["Price",x.cur==="$"||x.cur==="free"?x.price:null,y.cur==="$"||y.cur==="free"?y.price:null,true],...CFG.stats.map(([k,l])=>[l,x.s[k],y.s[k]])];
    o.innerHTML=`<table class="cmpt"><tr><th>Stat</th><th>${esc(x.name)}</th><th>${esc(y.name)}</th><th>Difference</th></tr>${rowsC.map(([l,a,b,isP])=>{const d=a!=null&&b!=null?+(a-b).toFixed(3):null;const good=isP?d<0:d>0;
      return `<tr><td>${l}</td><td>${isP&&a!=null?"$"+fmt(a):fmt(a)}</td><td>${isP&&b!=null?"$"+fmt(b):fmt(b)}</td><td class="${d?good?"up":"dn":""}">${d==null?"—":(d>0?"+":d<0?"−":"±")+(isP?"$":"")+fmt(Math.abs(d))}</td></tr>`}).join("")}
      ${CFG.passive?`<tr><td>Passive</td><td style="white-space:normal;font-family:var(--f-body)">${passHtml(x.passive)}</td><td style="white-space:normal;font-family:var(--f-body)">${passHtml(y.passive)}</td><td></td></tr>`:""}</table>`};
  lastFocus=document.activeElement;scrim.hidden=false;document.getElementById("pclose").onclick=closeItem;document.getElementById("pclose").focus();
}
function closeItem(){scrim.hidden=true;lastFocus&&lastFocus.focus&&lastFocus.focus()}
scrim.addEventListener("click",e=>{if(e.target===scrim)closeItem()});
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!scrim.hidden)closeItem()});
window.openGear=window.ptOpenItem=name=>{const x=ITEMS.find(y=>y.name.toLowerCase()===String(name).toLowerCase());if(x)openItem(x.i)};
render();
