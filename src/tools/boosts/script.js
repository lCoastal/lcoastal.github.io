
const ICONS=(()=>{try{return Object.fromEntries((window.parent.PTDATA.mins||[]).filter(m=>m.ic).map(m=>[m.n,m.ic]))}catch(e){return {}}})();

const SLOTS={Exotic:1,Mythic:2,Legendary:3,Epic:3,Rare:3,Uncommon:3,Common:3};
const ORDER=["Exotic","Mythic","Legendary","Epic","Rare","Uncommon","Common"];
// [name, rarity, min kg for max boost, [[stat, max boost], ...]]
const D=[
["Copper","Common",60,[["Size Boost",.04]]],["Gold","Common",40,[["Sell Boost",.05]]],["Amethyst","Common",20,[["Dig Speed",.05]]],["Blue Ice","Common",40,[["Dig Speed",.05]]],["Pyrite","Common",60,[["Capacity",.05]]],["Silver","Common",40,[["Shake Speed",.05]]],["Platinum","Common",40,[["Dig Speed",.05]]],["Seashell","Common",20,[["Capacity",.05]]],["Obsidian","Common",30,[["Size Boost",.04]]],["Pearl","Common",20,[["Shake Speed",.05]]],
["Coral","Uncommon",10,[["Capacity",.08]]],["Glowberry","Uncommon",40,[["Sell Boost",.08]]],["Electrum","Uncommon",40,[["Sell Boost",.08]]],["Neodymium","Uncommon",40,[["Shake Strength",.08]]],["Smoky Quartz","Uncommon",20,[["Shake Strength",.08]]],["Malachite","Uncommon",20,[["Modifier Boost",.08]]],["Sapphire","Uncommon",20,[["Dig Speed",.08]]],["Rock Candy","Uncommon",60,[["Size Boost",.05]]],["Nickel","Uncommon",40,[["Capacity",.08]]],["Titanium","Uncommon",40,[["Dig Speed",.08]]],["Topaz","Uncommon",20,[["Capacity",.08]]],["Zircon","Uncommon",20,[["Size Boost",.05]]],
["Jade","Rare",40,[["Modifier Boost",.13]]],["Azuralite","Rare",30,[["Dig Speed",.13]]],["Glacial Quartz","Rare",40,[["Dig Speed",.13]]],["Amber","Rare",20,[["Sell Boost",.13]]],["Gloomberry","Rare",40,[["Dig Speed",.13]]],["Diopside","Rare",20,[["Modifier Boost",.13]]],["Candy Cane","Rare",40,[["Size Boost",.09]]],["Ruby","Rare",20,[["Shake Strength",.13]]],["Lapis Lazuli","Rare",30,[["Dig Speed",.13]]],["Silver Clamshell","Rare",20,[["Shake Speed",.13]]],["Peridot","Rare",20,[["Luck",.13]]],["Onyx","Rare",30,[["Modifier Boost",.13]]],["Meteoric Iron","Rare",40,[["Shake Strength",.13]]],["Pyrelith","Rare",30,[["Sell Boost",.13]]],
["Iridium","Epic",40,[["Dig Speed",.2]]],["Ammonite Fossil","Epic",50,[["Capacity",.2]]],["Ashvein","Epic",20,[["Size Boost",.14]]],["Emerald","Epic",20,[["Luck",.2]]],["Golden Pearl","Epic",20,[["Capacity",.2]]],["Borealite","Epic",20,[["Dig Speed",.2]]],["Aurorite","Epic",30,[["Dig Speed",.2]]],["Cobalt","Epic",40,[["Dig Speed",.2]]],["Glowmoss","Epic",60,[["Modifier Boost",.2]]],["Bone","Epic",50,[["Size Boost",.14]]],["Moonstone","Epic",50,[["Shake Speed",.2]]],["Pyronium","Epic",50,[["Sell Boost",.2]]],["Osmium","Epic",80,[["Size Boost",.2]]],["Opal","Epic",20,[["Shake Speed",.2]]],["Lightshard","Epic",20,[["Dig Speed",.2]]],["Mercury","Epic",80,[["Shake Strength",.2]]],["Meteoric Gold","Epic",40,[["Sell Boost",.2]]],["Selenite","Epic",30,[["Shake Speed",.2]]],
["Cinnabar","Legendary",20,[["Size Boost",.21]]],["Diamond","Legendary",20,[["Luck",.3]]],["Fire Opal","Legendary",20,[["Size Boost",.21]]],["Dragon Bone","Legendary",50,[["Size Boost",.21]]],["Catseye","Legendary",20,[["Capacity",.3]]],["Aetherite","Legendary",20,[["Dig Speed",.3]]],["Aquamarine","Legendary",20,[["Dig Speed",.3]]],["Firefly Stone","Legendary",60,[["Capacity",.3]]],["Bismuth","Legendary",80,[["Dig Speed",.3]]],["Gloomcap","Legendary",20,[["Dig Speed",.3]]],["Depleted Shard","Legendary",40,[["Dig Strength",.3]]],["Rose Gold","Legendary",40,[["Shake Strength",.3]]],["Palladium","Legendary",40,[["Sell Boost",.3]]],["Luminum","Legendary",40,[["Capacity",.3]]],["Specterite","Legendary",10,[["Shake Speed",.3]]],["Lost Soul","Legendary",20,[["Dig Speed",.3]]],["Peppermint Prism","Legendary",20,[["Modifier Boost",.3]]],["Radium","Legendary",60,[["Modifier Boost",.3]]],["Nautilus Shell","Legendary",50,[["Capacity",.3]]],["Jasper","Legendary",30,[["Sell Boost",.3]]],["Uranium","Legendary",60,[["Modifier Boost",.3]]],["Volcanic Key","Legendary",20,[["Size Boost",.21]]],["Starshine","Legendary",20,[["Dig Speed",.15],["Shake Speed",.15]]],["Tourmaline","Legendary",24,[["Sell Boost",.3]]],
["Inferlume","Mythic",20,[["Luck",.5]]],["Flarebloom","Mythic",20,[["Luck",.75],["Size Boost",-.5]]],["Frostshard","Mythic",20,[["Dig Strength",.5]]],["Chrysoberyl","Mythic",20,[["Luck",.5]]],["Aetherium","Mythic",20,[["Dig Speed",.5]]],["Agate","Mythic",40,[["Sell Boost",.5]]],["Pink Diamond","Mythic",20,[["Luck",.5]]],["Painite","Mythic",20,[["Size Boost",.35]]],["Prismara","Mythic",20,[["Luck",.25],["Capacity",.25],["Dig Strength",.25],["Shake Strength",.25]]],["Mythril","Mythic",60,[["Shake Strength",.5]]],["Radiant Gold","Mythic",60,[["Sell Boost",.5]]],["Star Garnet","Mythic",20,[["Size Boost",.35]]],["Red Beryl","Mythic",20,[["Size Boost",.35]]],["Vortessence","Mythic",20,[["Capacity",.5]]],["Volcanic Core","Mythic",20,[["Dig Strength",.25],["Size Boost",.2]]],["Sunstone","Mythic",40,[["Sell Boost",.5]]],
["Dinosaur Skull","Exotic",100,[["Sell Boost",.4],["Size Boost",.32]]],["Cryonic Artifact","Exotic",20,[["Dig Strength",1.2],["Shake Strength",1.2],["Dig Speed",-.8],["Shake Speed",-.8]]],["Bloodstone","Exotic",40,[["Size Boost",.56]]],["Astral Spore","Exotic",20,[["Dig Speed",.8]]],["Eternium","Exotic",20,[["Luck",.32],["Dig Speed",.32],["Shake Speed",.32]]],["Adamantine","Exotic",40,[["Modifier Boost",.8]]],["Celestium","Exotic",40,[["Luck",.48],["Shake Speed",.48]]],["Forgotten Totem","Exotic",40,[["Sell Boost",.8]]],["Eye of the Sands","Exotic",50,[["Sell Boost",.88]]],["Pumpkin Soul","Exotic",40,[["Size Boost",.56]]],["North Star","Exotic",40,[["Luck",.2],["Capacity",.2],["Dig Speed",.2],["Shake Speed",.2]]],["Singularium","Exotic",100,[["Capacity",.48],["Size Boost",.48]]],["Solarium","Exotic",40,[["Size Boost",.64]]],["Moonspire","Exotic",40,[["Dig Speed",.32],["Shake Speed",.32],["Walk Speed",.32]]],["Voidstone","Exotic",20,[["Luck",.4],["Capacity",.4]]],["Vineheart","Exotic",40,[["Luck",.8]]],["Umbrite","Exotic",40,[["Dig Speed",.4],["Shake Speed",.4]]],["Starpiercer","Exotic",40,[["Dig Strength",.48],["Shake Strength",.48]]],
["Sandsteel","Rare",30,[["Sell Boost",.13]]],["Key of Life","Exotic",40,[["Luck",.88]]]
];
const MULT={Common:.005,Uncommon:.0075,Rare:.0125,Epic:.02,Legendary:.03,Mythic:.05,Exotic:.08};
// [modifier, stats, factor, how to get]
const MODS=[
["Perfect","Luck + Capacity + Size Boost",1,"~1 in 26,764"],["Treasured","Luck",2,"Treasure chests only"],["Lunar","Dig Speed + Shake Speed + Walk Speed",1,"~1 in 10,705, night only"],["Voidtorn","Luck + Capacity",1,"The Void, Galactic tools, Voidtouched enchant"],["Mutated","Luck + Dig Strength + Modifier Boost",1,"~1 in 2,676"],["Cosmic","Capacity + Shake Strength",1,"~1 in 535"],["Electrified","Dig Speed + Shake Speed",1,"Thunderstorm event only"],["Iridescent","Luck",1,"~1 in 134"],["Irradiated","Modifier Boost",1,"~1 in 27"],["Crystalline","Size Boost",1,"Geodes, Crystal Touch shovel"],["Scorching","Dig Strength",1,"~1 in 11"],["Glowing","Shake Speed",1,"~1 in 5"],["Pure","Dig Speed",1,"~1 in 3"],["Shiny","Shake Strength",1,"~1 in 3"]];
(function(){
  const R=[...ORDER].reverse();
  const f=v=>"+"+(+v.toFixed(4))+"×";
  document.getElementById("mods").innerHTML=`<table><thead><tr><th>Modifier</th><th>Boosts</th>${R.map(r=>`<th class="w" style="color:var(--c-${r.toLowerCase()})">${r}</th>`).join("")}<th>How to get</th></tr></thead><tbody>${MODS.map(([m,s,k,h])=>`<tr><td class="n">${m}</td><td class="s">${s}</td>${R.map(r=>`<td class="w">${f(MULT[r]*k)}</td>`).join("")}<td class="h">${h}</td></tr>`).join("")}</tbody></table>`;
})();
const STATS=["All","Luck","Size Boost","Modifier Boost","Sell Boost","Capacity","Dig Strength","Dig Speed","Shake Strength","Shake Speed","Walk Speed"];
let stat="All",q="",rev=false;
try{const s=localStorage.getItem("mb-stat");if(s&&STATS.includes(s))stat=s;}catch(e){}
const chips=document.getElementById("chips");
STATS.forEach(s=>{const b=document.createElement("button");b.type="button";b.className="chip pt-k"+(s==="All"?" pt-any":"");if(s!=="All"&&window.ptK)b.style.setProperty("--kc",ptK(s));b.id="chip-"+s.replace(/\s/g,"");b.textContent=s;b.onclick=()=>{stat=s;try{localStorage.setItem("mb-stat",s)}catch(e){}render()};chips.appendChild(b)});
const dirB=document.createElement("button");dirB.type="button";dirB.className="chip dirb";dirB.setAttribute("aria-label","Sort direction");dirB.onclick=()=>{rev=!rev;render()};chips.appendChild(dirB);
const incL=document.createElement("label");incL.className="incm";incL.dataset.ptopt="1";incL.title="Add the mutations table under the minerals in the saved image";incL.innerHTML='<input type="checkbox" id="incMut"> Include mutations';chips.appendChild(incL);
const incMut=incL.querySelector("input");try{incMut.checked=localStorage.getItem("mb-incmut")==="1"}catch(e){}incMut.onchange=()=>{try{localStorage.setItem("mb-incmut",incMut.checked?"1":"0")}catch(e){}};
const imgB=document.createElement("button");imgB.type="button";imgB.className="chip img";imgB.id="toImg";imgB.textContent="Save as image";chips.appendChild(imgB);
document.getElementById("q").addEventListener("input",e=>{q=e.target.value.trim().toLowerCase();render()});
const fmt=v=>(v<0?"−":"+")+Math.abs(v)+"×";
const rc=r=>"var(--c-"+r.toLowerCase()+")";
// the minerals one rarity shows with the current search, stat filter and sort
function rarityRows(r){let rows=D.filter(d=>d[1]===r&&(!q||d[0].toLowerCase().includes(q)));
  if(stat!=="All")rows=rows.filter(d=>d[3].some(([s,v])=>s===stat&&v>0));
  const val=d=>stat==="All"?Math.max(...d[3].map(x=>x[1])):d[3].find(x=>x[0]===stat)[1];
  rows.sort((a,b)=>val(b)-val(a)||a[2]-b[2]||a[0].localeCompare(b[0]));
  const best=stat!=="All"&&rows.length?val(rows[0]):null;if(rev)rows.reverse();return {rows,best,val}}
// weakest-first with a stat picked also turns the rarities around, so Common comes first and each rarity starts with its weakest
const rarOrder=()=>rev&&stat!=="All"?[...ORDER].reverse():ORDER;
function render(){
  [...chips.children].forEach(c=>{if(c!==dirB)c.setAttribute("aria-pressed",String(c.textContent===stat))});
  dirB.innerHTML=rev?"<b>↑</b> Ascending":"<b>↓</b> Descending";dirB.title=rev?(stat!=="All"?"Common first, weakest boost first":"Weakest boost first"):"Strongest boost first";
  const list=document.getElementById("list");list.innerHTML="";
  rarOrder().forEach(r=>{
    const {rows,best,val}=rarityRows(r);
    const sec=document.createElement("section");sec.style.setProperty("--rc",rc(r));
    sec.innerHTML=`<div class="rh"><h2>${r}</h2><span>${SLOTS[r]} museum slot${SLOTS[r]>1?"s":""} · ${rows.length} mineral${rows.length===1?"":"s"}</span></div>`;
    if(!rows.length){const p=document.createElement("p");p.className="empty";p.textContent=stat==="All"?"No matches.":`No ${r} mineral boosts ${stat}.`;sec.appendChild(p);list.appendChild(sec);return}
    const tw=document.createElement("div");tw.className="tw";
    tw.innerHTML=`<table><thead><tr><th>Mineral</th><th>Max boost</th><th class="w">Max boost at</th></tr></thead><tbody>${rows.map(d=>`<tr class="${best!==null&&val(d)===best?"top":""}"><td class="n" data-mineral="${d[0]}"><span class="mn">${ICONS[d[0]]?`<img src="${ICONS[d[0]]}" alt="" width="26" height="26" loading="lazy">`:""}${d[0]}</span></td><td><div class="b">${d[3].map(([s,v])=>`<span class="${v<0?"neg":""}">${s} <em>${fmt(v)}</em></span>`).join("")}</div></td><td class="w">${d[2]} kg</td></tr>`).join("")}</tbody></table>`;
    sec.appendChild(tw);list.appendChild(sec);
  });
}
// ---- save as image: what's shown (search, stat and sort included), rarities in two balanced columns, mutations underneath ----
function toast(t){const d=document.createElement("div");d.className="toast";d.setAttribute("role","status");d.textContent=t;document.body.appendChild(d);setTimeout(()=>d.remove(),2200)}
const IMGC={Common:"#a3adb8",Uncommon:"#6cc46e",Rare:"#68a6f0",Epic:"#b880ee",Legendary:"#f2b53a",Mythic:"#f0687f",Exotic:"#f17ad6"};
const imgTitle=()=>stat==="All"?"Mineral max boosts":"Max "+stat+" boosts";
async function boostsImage(){const F='"IBM Plex Sans","Segoe UI",system-ui,sans-serif',FD='"Chakra Petch","Segoe UI",system-ui,sans-serif',FM='"IBM Plex Mono",Consolas,monospace';try{await document.fonts.ready}catch(e){}
  const W=1700,PAD=40,GAP=30,CW=(W-PAD*2-GAP)/2;
  const meas=document.createElement("canvas").getContext("2d");
  // lay out each mineral's boosts into lines that fit the boost column
  const BW=CW-24-250-96;
  const lines=d=>{meas.font=`13px ${F}`;const out=[[]];let w=0;d[3].forEach(([s,v])=>{const t=s+" "+fmt(v);const tw=meas.measureText(t).width+16;if(w+tw>BW&&out[out.length-1].length){out.push([]);w=0}out[out.length-1].push([s,v]);w+=tw});return out};
  const secs=rarOrder().map(r=>{const x=rarityRows(r);const rows=x.rows.map(d=>({d,ls:lines(d),top:x.best!==null&&x.val(d)===x.best}));rows.forEach(o=>o.h=Math.max(40,o.ls.length*19+21));return {r,rows,h:44+28+rows.reduce((t,o)=>t+o.h,0)+24}}).filter(s=>s.rows.length);
  if(!secs.length)return null;
  // split the rarities (kept in museum order) where the two columns come out closest in height
  let k=1,bestH=Infinity;for(let i=1;i<=secs.length;i++){const a=secs.slice(0,i).reduce((t,s)=>t+s.h,0),b=secs.slice(i).reduce((t,s)=>t+s.h,0);if(Math.max(a,b)<bestH){bestH=Math.max(a,b);k=i}}
  const cols=[secs.slice(0,k),secs.slice(k)];
  const mods=incMut.checked?MODS.filter(([m,st])=>stat==="All"||st.split(" + ").includes(stat)):[];
  meas.font=`12.5px ${F}`;const HW=W-PAD*2-24-150-300-7*92;
  const hl=t=>{const ws=t.split(" ");const o=[];let l="";ws.forEach(w=>{const tt=l?l+" "+w:w;if(meas.measureText(tt).width>HW&&l){o.push(l);l=w}else l=tt});if(l)o.push(l);return o};
  const mrows=mods.map(m=>{const h=hl(m[3]);return {m,h,rh:Math.max(36,h.length*17+19)}});
  const MH=mods.length?44+22+28+mrows.reduce((t,o)=>t+o.rh,0)+10:0;
  const HEAD=PAD+90;const H=HEAD+bestH+(MH?MH+16:0)+40;
  const cv=document.createElement("canvas");const sc=2;cv.width=W*sc;cv.height=H*sc;const c=cv.getContext("2d");c.scale(sc,sc);
  const rr=(x,y,w,h,r)=>{c.beginPath();c.moveTo(x+r,y);c.arcTo(x+w,y,x+w,y+h,r);c.arcTo(x+w,y+h,x,y+h,r);c.arcTo(x,y+h,x,y,r);c.arcTo(x,y,x+w,y,r);c.closePath()};
  const fit=(t,w)=>{if(c.measureText(t).width<=w)return t;while(t.length>1&&c.measureText(t+"…").width>w)t=t.slice(0,-1);return t+"…"};
  const img=src=>new Promise(res=>{if(!src)return res(null);const i=new Image();i.onload=()=>res(i);i.onerror=()=>res(null);i.src=src});
  c.fillStyle="#14181c";c.fillRect(0,0,W,H);
  c.font=`600 13px ${F}`;const mb="Made by @__coastal";const mw=c.measureText(mb).width+28,mx=W-PAD-mw,my=PAD-6;c.fillStyle="rgba(20,184,166,.14)";rr(mx,my,mw,26,13);c.fill();c.strokeStyle="rgba(20,184,166,.6)";c.lineWidth=1;rr(mx,my,mw,26,13);c.stroke();c.fillStyle="#14b8a6";c.beginPath();c.arc(mx+12,my+13,3,0,Math.PI*2);c.fill();c.fillStyle="#2dd4bf";c.fillText(mb,mx+20,my+17.5);
  c.fillStyle="#e6e9ec";c.font=`700 34px ${FD}`;c.fillText(imgTitle(),PAD,PAD+30);
  const n=secs.reduce((t,s)=>t+s.rows.length,0);const sub=[`${n} mineral${n===1?"":"s"}`];if(q)sub.push(`matching "${q}"`);if(stat!=="All")sub.push(rev?"weakest first":"strongest first, best in each rarity marked");
  c.fillStyle="#98a2ad";c.font=`15px ${F}`;c.fillText(sub.join(" · "),PAD,PAD+58);
  const icons={};await Promise.all(secs.flatMap(s=>s.rows.map(o=>img(ICONS[o.d[0]]).then(i=>icons[o.d[0]]=i))));
  cols.forEach((list,ci)=>{const x0=PAD+ci*(CW+GAP);let y=HEAD;
    list.forEach(s=>{const col=IMGC[s.r];
      c.font=`700 19px ${FD}`;c.fillStyle=col;c.fillText(s.r.toUpperCase(),x0,y+24);
      const meta=`${SLOTS[s.r]} museum slot${SLOTS[s.r]>1?"s":""} · ${s.rows.length} mineral${s.rows.length===1?"":"s"}`;c.font=`13px ${F}`;c.fillStyle="#98a2ad";c.fillText(meta,x0+CW-c.measureText(meta).width,y+24);
      c.fillStyle=col;c.fillRect(x0,y+34,CW,2);y+=44;
      const th=s.h-44-24;c.fillStyle="#1c2126";rr(x0,y,CW,th,8);c.fill();c.strokeStyle="#2d343b";c.lineWidth=1;rr(x0,y,CW,th,8);c.stroke();
      c.font=`600 11px ${F}`;c.fillStyle="#98a2ad";c.fillText("MINERAL",x0+12,y+18);c.fillText("MAX BOOST",x0+12+250,y+18);const mt="MAX BOOST AT";c.fillText(mt,x0+CW-12-c.measureText(mt).width,y+18);
      y+=28;
      s.rows.forEach((o,i)=>{c.strokeStyle="#2d343b";c.beginPath();c.moveTo(x0,y);c.lineTo(x0+CW,y);c.stroke();
        const mid=y+20;let tx=x0+12;const ic=icons[o.d[0]];if(ic){c.drawImage(ic,tx,mid-12,24,24);tx+=32}
        c.fillStyle="#e6e9ec";c.font=`600 14px ${F}`;const nm=fit(o.d[0],250-(tx-x0)-(o.top?52:8));c.fillText(nm,tx,mid+5);
        if(o.top){const bx=tx+c.measureText(nm).width+8;c.font=`600 10px ${F}`;const bw=c.measureText("MOST").width+12;c.fillStyle=col;rr(bx,mid-8,bw,16,4);c.fill();c.fillStyle="#14181c";c.fillText("MOST",bx+6,mid+3.5)}
        o.ls.forEach((ln,li)=>{let bx=x0+12+250;const ly=mid+5+li*19;ln.forEach(([st,v])=>{c.font=`13px ${F}`;c.fillStyle="#cfd6dd";c.fillText(st,bx,ly);bx+=c.measureText(st+" ").width;c.font=`500 13px ${FM}`;c.fillStyle=v<0?"#ef7a66":"#3cc2a8";const vt=fmt(v);c.fillText(vt,bx,ly);bx+=c.measureText(vt).width+16})});
        c.font=`500 13px ${FM}`;c.fillStyle="#b9c2cb";const kg=o.d[2]+" kg";c.fillText(kg,x0+CW-12-c.measureText(kg).width,mid+5);
        y+=o.h});
      y+=24})});
  if(MH){let y=HEAD+bestH+16;const x0=PAD,MW=W-PAD*2;
    c.font=`700 19px ${FD}`;c.fillStyle="#e6e9ec";c.fillText("MUTATIONS",x0,y+24);const meta="bonus per stat, by mineral rarity · added on top of the mineral's own boost, whatever its weight";c.font=`13px ${F}`;c.fillStyle="#98a2ad";c.fillText(meta,x0+MW-c.measureText(meta).width,y+24);
    c.fillStyle="#3cc2a8";c.fillRect(x0,y+34,MW,2);y+=44;
    const th=MH-44-10;c.fillStyle="#1c2126";rr(x0,y,MW,th,8);c.fill();c.strokeStyle="#2d343b";rr(x0,y,MW,th,8);c.stroke();
    const R=[...ORDER].reverse();const cx=i=>x0+12+150+300+92*(i+1)-12;
    c.font=`600 11px ${F}`;c.fillStyle="#98a2ad";c.fillText("MODIFIER",x0+12,y+18);c.fillText("BOOSTS",x0+12+150,y+18);R.forEach((r,i)=>{c.fillStyle=IMGC[r];const t=r.toUpperCase();c.fillText(t,cx(i)-c.measureText(t).width,y+18)});c.fillStyle="#98a2ad";c.fillText("HOW TO GET",x0+12+150+300+7*92+12,y+18);
    y+=28;const f4=v=>"+"+(+v.toFixed(4))+"×";
    mrows.forEach(({m,h,rh})=>{c.strokeStyle="#2d343b";c.beginPath();c.moveTo(x0,y);c.lineTo(x0+MW,y);c.stroke();const mid=y+18;
      c.fillStyle="#e6e9ec";c.font=`600 14px ${F}`;c.fillText(m[0],x0+12,mid+5);c.font=`13px ${F}`;c.fillStyle="#cfd6dd";c.fillText(fit(m[1],290),x0+12+150,mid+5);
      c.font=`500 13px ${FM}`;c.fillStyle="#3cc2a8";R.forEach((r,i)=>{const t=f4(MULT[r]*m[2]);c.fillText(t,cx(i)-c.measureText(t).width,mid+5)});
      c.font=`12.5px ${F}`;c.fillStyle="#98a2ad";h.forEach((l,li)=>c.fillText(l,x0+12+150+300+7*92+12,mid+5+li*17));y+=rh})}
  return await new Promise(res=>cv.toBlob(res,"image/png"))}
window.ptBoostsImage=boostsImage;
imgB.onclick=async()=>{let blob=null;try{blob=await boostsImage()}catch(e){console.error(e)}if(!blob){toast("Nothing to save. Change the search or the stat filter.");return}
  const nm=(stat==="All"?"Mineral boosts":stat+" boosts")+".png";
  try{await window.parent.ptSave(nm,blob);toast((()=>{try{return window.parent.ptImgMsg()}catch(e){return "Image saved"}})())}catch(e){const c=e&&e.code;if(c!=="declined")toast(c==="rate_limited"?"A save prompt is already open":"Couldn't save the image here")}};
render();
