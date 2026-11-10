
const $=id=>document.getElementById(id);
const G=P.gear;const EQ=P.equip;const EQB=Object.fromEntries(EQ.map(x=>[x.n,x]));
const STATS=["Luck","Capacity","Shake Strength","Shake Speed","Dig Strength","Dig Speed","Size Boost","Modifier Boost","Sell Boost","Inventory Size","Walk Speed","Toughness"];
const PCT=new Set(["Shake Speed","Dig Speed","Size Boost","Modifier Boost","Sell Boost"]);
const SLOTDEF=[["neck","Necklace","Necklace"],["charm","Charm","Charm"],...Array.from({length:8},(_,i)=>["r"+i,"Ring "+(i+1),"Ring"])];
const MUTS=[["None",1,{}],["Silver",1.1,{}],["Gold",1.2,{}],["Diamond",1.35,{}],["Granite",1.36,{"Dig Strength":24,"Shake Strength":6}],["Overclocked",1.36,{"Dig Speed":10,"Shake Speed":10}],["Festive",1.4,{"Luck":50,"Size Boost":10}],["Prismatic",1.6,{}]];
const MUT=Object.fromEntries(MUTS.map(m=>[m[0],m]));
const mutLabel=m=>m[0]==="None"?"No mutation":`${m[0]} ×${m[1]}${Object.keys(m[2]).length?" +":""}`;
const MULT={Common:.005,Uncommon:.0075,Rare:.0125,Epic:.02,Legendary:.03,Mythic:.05,Exotic:.08};
const MODS=Object.fromEntries(P.mods.map(m=>[m[0],m]));
window.S=null;let S={pan:"",shovel:"",slots:{},mus:"board",b:{},n:{friendTotem:-1,friends:0,mastery:0,flatLuck:0,flatDig:0},owned:false};
window.S=S;try{const s=JSON.parse(localStorage.getItem("pcalc")||"null");if(s)S=Object.assign(S,s,{b:Object.assign({},s.b),n:Object.assign(S.n,s.n)})}catch(e){}
{const seen=new Set();Object.keys(S.slots).sort().forEach(k=>{const v=S.slots[k];if(v&&["Dredge Master's Ring","Ring of Champions","Ring of the Stars"].includes(v.n)){if(seen.has(v.n))v.n="";else seen.add(v.n)}})}
window.S=S;Object.values(S.slots).forEach(v=>{if(v&&v.l==="p"){v.l="6";v.m="Prismatic"}});
const save=()=>{try{localStorage.setItem("pcalc",JSON.stringify(S))}catch(e){}};
const own=n=>!!(Store.get(n)||{}).own;
// tool selects
function fillSel(el,items,cur,blank){const list=items.filter(x=>!S.owned||own(x.name||x.n)||(x.name||x.n)===cur);
  el.innerHTML=(blank?`<option value="">${blank}</option>`:"")+list.map(x=>{const n=x.name||x.n;return `<option value="${esc(n)}"${n===cur?" selected":""}>${esc(n)}${x.r?" · "+x.r:""}</option>`}).join("")}
function buildSlots(){
  $("slots").innerHTML=SLOTDEF.map(([k,l,slot])=>{const v=S.slots[k]||{};return `<div class="slot"><span class="sl">${l}</span>
    <button type="button" class="pick it" data-pick="${k}" aria-haspopup="listbox" aria-label="${l}"></button>
    <select data-lvl="${k}" aria-label="${l} stars"><option value="0">0★</option><option value="5">5★</option><option value="6">6★</option></select>
    <select data-mut="${k}" aria-label="${l} mutation">${MUTS.map(m=>`<option value="${m[0]}">${mutLabel(m)}</option>`).join("")}</select>
    <input type="number" min="0" max="100" data-q="${k}" value="${v.q??100}" aria-label="${l} quality %" title="Quality %"></div>`}).join("");
  SLOTDEF.forEach(([k,,slot])=>{const v=S.slots[k]||{};document.querySelector(`[data-lvl="${k}"]`).value=v.l==="5"||v.l==="0"?v.l:"6";document.querySelector(`[data-mut="${k}"]`).value=v.m||"None"})}
function fillTools(){}
// museum sources: the planner's current board plus every saved loadout
function musSources(){const src=[["none","No museum"],["custom","Custom museum (edit below)"],["board","Museum Planner (current board)"]];try{(JSON.parse(localStorage.getItem("mp-loadouts")||"[]")||[]).forEach(o=>o&&o.name&&src.push(["lo:"+o.name,"Saved loadout: "+o.name]))}catch(e){}return src}
function musBoard(st){st=st||S;try{if(st.mus==="custom")return st.museumBoard||null;if(st.mus==="board")return JSON.parse(localStorage.getItem("mp-board")||"null");if(st.mus.startsWith("lo:")){const o=(JSON.parse(localStorage.getItem("mp-loadouts")||"[]")||[]).find(o=>o&&o.name===st.mus.slice(3));return o&&o.board}}catch(e){}return null}
function musTotals(st){const t={};const b=musBoard(st);if(!b)return {t,n:0};let n=0;
  Object.entries(b).forEach(([r,arr])=>(arr||[]).forEach(sl=>{if(!sl||!sl.m)return;n++;const m=MIN[String(sl.m).toLowerCase()];(m&&m.mu?m.mu.b:[]).forEach(([s,v])=>t[s]=(t[s]||0)+v);
    let md=MODS[sl.u||"None"];if(!md&&String(sl.u||"").startsWith("Any of: ")){const l=String(sl.u).slice(8).split("/").map(x=>MODS[x.trim()]).filter(Boolean);if(l.length)md=l.reduce((a,b)=>b[1].length*b[2]<a[1].length*a[2]?b:a)}if(md)md[1].forEach(s=>t[s]=(t[s]||0)+(MULT[r]||0)*md[2])}));return {t,n}}
function fillMus(){const src=musSources();if(!src.some(s=>s[0]===S.mus))S.mus="board";$("mus").innerHTML=src.map(([v,l])=>`<option value="${esc(v)}"${v===S.mus?" selected":""}>${esc(l)}</option>`).join("")}
// parse "+25% Size Boost, 1.1× additional Luck"
function passive(p){const o={};let lm=1;String(p||"").split(/,\s*/).forEach(t=>{let m=t.match(/^([+\-−]?\d+(?:\.\d+)?)%\s*(Size Boost|Modifier Boost|Sell Boost)/i);if(m){const k=m[2].toLowerCase().replace(/\b\w/g,c=>c.toUpperCase());o[k]=(o[k]||0)+parseFloat(m[1].replace("−","-"))}
  m=t.match(/(\d+(?:\.\d+)?)\s*×\s*additional Luck/i);if(m)lm*=parseFloat(m[1])});return {o,lm}}
const eqVal=(s,l,q,mult)=>{const lo=l==="5"?s[1]:s[3],hi=l==="5"?s[2]:s[4];return (lo+(hi-lo)*q/100)*mult};
function compute(S0){const S=S0||window.S;
  const base=Object.fromEntries(STATS.map(s=>[s,0]));let luckMult=1,totemMult=1;const notes=[];
  const pan=G.pans.find(x=>x.name===S.pan),sh=G.shovels.find(x=>x.name===S.shovel);
  const EN=(P.ench||{pan:[],shovel:[]});const pe=EN.pan.find(e=>e.n===S.panEn),se=EN.shovel.find(e=>e.n===S.shEn);
  if(pan){const pm=k=>pe&&pe.m[k]?pe.m[k]:1;base.Luck+=(num(pan.luck)||0)*pm("Luck");base.Capacity+=(num(pan.capacity)||0)*pm("Capacity");base["Shake Strength"]+=(num(pan.strength)||0)*pm("Shake Strength");const sp=String(pan.speed).includes("%")?num(pan.speed):(num(pan.speed)||0)*100;base["Shake Speed"]+=sp;
    if(pe)Object.entries(pe.a).forEach(([k,v])=>{if(k in base)base[k]+=v});
    const p=passive(pan.passive);Object.entries(p.o).forEach(([k,v])=>base[k]+=v);luckMult*=p.lm;if(/totem/i.test(pan.passive||""))notes.push(`${pan.name} also boosts totems (not counted).`)}
  if(sh){base["Dig Strength"]+=num(sh.strength)||0;base["Dig Speed"]+=(num(sh.speed)||0)*100;base.Toughness=(num(sh.toughness)||0)+(se&&se.tough?se.tough:0);if(se&&!se.tough)notes.push(`${se.n}: ${se.d}`);const p=passive(sh.passive);luckMult*=p.lm;if(/25% buffs from Totems/i.test(sh.passive||""))totemMult=1.25}
  SLOTDEF.forEach(([k])=>{const v=S.slots[k];if(!v||!v.n)return;const x=EQB[v.n];if(!x)return;const mu=MUT[v.m||"None"]||MUTS[0];x.st.forEach(s=>{const n=s[0];if(!(n in base))return;base[n]+=eqVal(s,(v.l==="5"||v.l==="0"?"5":"6"),v.q??100,mu[1])});Object.entries(mu[2]).forEach(([n,a])=>base[n]+=a)});
  const flat=Object.fromEntries(STATS.map(s=>[s,0]));flat.Luck=Math.max(0,+S.n.flatLuck||0);flat["Dig Strength"]=Math.max(0,+S.n.flatDig||0);
  const pile=Object.fromEntries(STATS.map(s=>[s,0]));const mt=musTotals(S);Object.entries(mt.t).forEach(([k,v])=>{if(k in pile)pile[k]+=v});
  const b=S.b;
  // potions add flat points (their % lines go straight onto the % stats)
  (S.pots||[]).forEach(pn=>{const p=((P.x2||{}).potions||[]).find(x=>x.n===pn);if(!p)return;String(p.fx).replace(/\([^)]*\)\s*$/,"").split(/,\s*/).forEach(part=>{const m=part.match(/^\+?(-?[\d.,]+)(%?)\s+(.+)$/);if(!m)return;let k=m[3].trim().replace(/Walkspeed|WalkSpeed/i,"Walk Speed");k=STATS.find(s=>s.toLowerCase()===k.toLowerCase())||k;if(k in flat)flat[k]+=parseFloat(m[1].replace(/,/g,""))})});
  if(b.purity)pile.Luck+=1;
  if(b.vet)pile.Luck+=0.25;
  const RU=S.runes||[];if(RU.includes("Speed I"))flat["Walk Speed"]+=2;if(RU.includes("Mountain Climber"))flat["Walk Speed"]+=3;
  if(RU.includes("Summit Seeker")){const wb=Math.max(0,base["Walk Speed"]+flat["Walk Speed"]);flat["Dig Speed"]+=5*wb;flat["Shake Speed"]+=5*wb}
  RU.filter(n=>/Critical|Annihilation|Discovery|Explorer|Eternity|Singularity|Volcanic|Bunny|Seeker/.test(n)).forEach(n=>{const r=((P.x2||{}).runes||[]).find(x=>x.n===n);if(r)notes.push(`${n}: ${r.d}`)});
  if(b.luckTotem)pile.Luck+=1*totemMult;
  if(b.strTotem){pile["Dig Strength"]+=1*totemMult;pile["Shake Strength"]+=1*totemMult}
  if(b.lumTotem){pile.Capacity+=.5*totemMult;flat["Shake Speed"]+=50;flat["Dig Speed"]+=50}
  const ft=Math.min(19,Math.floor(+S.n.friendTotem));if(ft>=0)pile.Luck+=(0.4+0.2*ft)*totemMult;
  pile.Luck+=Math.max(0,Math.min(.5,.1*(+S.n.friends||0)))+(b.sun?.2:0)+(b.solo?.2:0)+(+S.n.mastery||0);
  if(b.cookie)STATS.forEach(s=>{if(!["Toughness","Inventory Size"].includes(s))pile[s]+=1});
  let ev=1;if(b.meteor)ev*=2;if(b.weather)ev*=1.5;
  const tot={};STATS.forEach(s=>{tot[s]=["Toughness","Inventory Size"].includes(s)?base[s]+flat[s]:(base[s]+flat[s])*(1+pile[s])});
  tot.Luck*=ev*luckMult;
  if((S.runes||[]).includes("Equalizer")){const a=(tot["Dig Speed"]+tot["Shake Speed"])/2;tot["Dig Speed"]=a;tot["Shake Speed"]=a}
  return {base,flat,pile,tot,ev,luckMult,mt,notes,toughness:base.Toughness}}
// ---- isolate parts: which groups count, and what each single part adds ----
const GROUPS=[["tools","Tools"],["jewelry","Jewelry"],["museum","Museum"],["boosts","Boosts"],["events","Events"]];
function strip(st,g){const t=clone(st);
  if(g==="tools"){t.pan="";t.shovel="";t.panEn="";t.shEn="";t.trinket=""}
  else if(g==="jewelry"){t.slots={}}
  else if(g==="museum"){t.mus="none"}
  else if(g==="boosts"){const keep={meteor:t.b.meteor,weather:t.b.weather};t.b=keep;t.n={friendTotem:-1,friends:0,mastery:0,flatLuck:0,flatDig:0};t.pots=[];t.runes=[]}
  else if(g==="events"){t.b=Object.assign({},t.b,{meteor:false,weather:false})}
  return t}
// S.only: null = count everything, otherwise a single part key like "slot:r0", "slot:r0,r1" (same item in several slots) or "group:museum"
function effState(){let t=clone(S);const off=S.isoOff||[];off.forEach(g=>{t=strip(t,g)});
  if(S.only){const keep=S.only;let o=GROUPS.reduce((a,[g])=>strip(a,g),clone(S));
    if(keep.startsWith("group:"))o=Object.assign(o,pick(clone(S),keep.slice(6)));
    else{const [k,v]=keep.split(":");if(k==="pan"){o.pan=S.pan;o.panEn=S.panEn}else if(k==="shovel"){o.shovel=S.shovel;o.shEn=S.shEn}else if(k==="slot"){o.slots={};v.split(",").forEach(x=>{o.slots[x]=S.slots[x]})}}
    t=o}
  return t}
function pick(st,g){if(g==="tools")return {pan:st.pan,shovel:st.shovel,panEn:st.panEn,shEn:st.shEn,trinket:st.trinket};if(g==="jewelry")return {slots:st.slots};if(g==="museum")return {mus:st.mus,museumBoard:st.museumBoard};
  if(g==="boosts")return {b:Object.assign({},st.b,{meteor:false,weather:false}),n:st.n,pots:st.pots,runes:st.runes};if(g==="events")return {b:{meteor:st.b.meteor,weather:st.b.weather}};return {}}
function parts(st){const P2=[];if(st.pan)P2.push(["pan:","Pan: "+st.pan+(st.panEn?" ("+st.panEn+")":""),t=>{t.pan="";t.panEn=""}]);
  if(st.shovel)P2.push(["shovel:","Shovel: "+st.shovel+(st.shEn?" ("+st.shEn+")":""),t=>{t.shovel="";t.shEn=""}]);
  // the same item worn in several slots is one source: "Gold Ring ×3", worked out by taking all of them off together
  const worn=new Map();SLOTDEF.forEach(([k,l])=>{const v=(st.slots||{})[k];if(v&&v.n){if(!worn.has(v.n))worn.set(v.n,[]);worn.get(v.n).push([k,l])}});
  worn.forEach((ks,n)=>P2.push(["slot:"+ks.map(x=>x[0]).join(","),ks.length>1?n+" ×"+ks.length:ks[0][1]+": "+n,t=>{t.slots=Object.assign({},t.slots);ks.forEach(([k])=>delete t.slots[k])}]));
  if(st.mus!=="none")P2.push(["group:museum","Museum",t=>{t.mus="none"}]);
  P2.push(["group:boosts","Boosts (totems, runes, potions, cookie…)",t=>Object.assign(t,strip(t,"boosts"))]);
  if(st.b&&(st.b.meteor||st.b.weather))P2.push(["group:events","Events",t=>{t.b=Object.assign({},t.b,{meteor:false,weather:false})}]);return P2}
const SHOWN=["Luck","Capacity","Size Boost","Modifier Boost","Sell Boost","Dig Strength","Shake Strength","Dig Speed","Shake Speed","Toughness"];
function renderParts(){const base=clone(S);(S.isoOff||[]).forEach(g=>Object.assign(base,strip(base,g)));const full=compute(base);
  const rows=parts(base).map(([key,label,rm])=>{const t=clone(base);rm(t);const r=compute(t);const d={};SHOWN.forEach(s=>{const v=full.tot[s]-r.tot[s];if(Math.abs(v)>1e-6)d[s]=v});return {key,label,d}}).filter(x=>Object.keys(x.d).length);
  rows.sort((a,b)=>(b.d.Luck||0)-(a.d.Luck||0));
  const fv=(s,v)=>(v<0?"−":"+")+(PCT.has(s)?fmt(Math.abs(v),1)+"%":fmt(Math.abs(v),s==="Luck"||s==="Capacity"?0:1));
  // grouped by stat: each stat, its total, then every source that adds to it, biggest first
  const tv=(s,v)=>PCT.has(s)?fmt(v,1)+"%":fmt(v,s==="Luck"||s==="Capacity"?0:1);
  const groups=SHOWN.map(st=>({st,src:rows.filter(x=>x.d[st]).map(x=>({key:x.key,label:x.label,v:x.d[st]})).sort((a,b)=>b.v-a.v)})).filter(g=>g.src.length);
  $("parts").innerHTML=groups.length?groups.map(g=>`<div class="bks"><div class="bkst"><b style="color:${statHex(g.st)}">${esc(g.st)}</b><span>${tv(g.st,full.tot[g.st]||0)} total</span></div>${g.src.map(x=>`<div class="pt${S.only===x.key?" on":""}" role="button" tabindex="0" data-only="${esc(x.key)}" aria-pressed="${S.only===x.key}"><b>${esc(x.label)}</b><span class="lk2" style="color:${x.v<0?"var(--neg,#c53030)":"var(--accent)"}">${fv(g.st,x.v)}</span></div>`).join("")}</div>`).join(""):'<p class="hint">Add some gear or boosts to see where your stats come from.</p>';
  const on=S.showBrk!==false;$("showBrk").checked=on;$("brkBody").hidden=!on}
$("showBrk").addEventListener("change",()=>{S.showBrk=$("showBrk").checked;save();$("brkBody").hidden=!S.showBrk});
function renderIso(){const off=S.isoOff||[];$("isoChips").innerHTML=GROUPS.map(([g,l])=>`<button type="button" class="chip" data-iso="${g}" aria-pressed="${!off.includes(g)&&!S.only}">${l}</button>`).join("");
  const n=$("isoNote");if(S.only){const lbl=(parts(S).find(p=>p[0]===S.only)||[0,"that part"])[1];n.hidden=false;n.innerHTML=`Showing only <b>${esc(lbl)}</b>. <button type="button" class="rst" data-only-clear>Show everything</button>`}else if(off.length){n.hidden=false;n.textContent="Left out: "+off.map(g=>GROUPS.find(x=>x[0]===g)[1]).join(", ")+"."}else n.hidden=true}
document.addEventListener("click",e=>{const c=e.target.closest("[data-iso]");if(c){S.only=null;const g=c.dataset.iso;const off=new Set(S.isoOff||[]);off.has(g)?off.delete(g):off.add(g);S.isoOff=[...off];save();render();return}
  if(e.target.closest("[data-only-clear]")){S.only=null;save();render();return}
  const p=e.target.closest("[data-only]");if(p){S.only=S.only===p.dataset.only?null:p.dataset.only;save();render();return}
  const r=e.target.closest("[data-reset]");if(r){if(!r.classList.contains("arm")){r.classList.add("arm");r.textContent="Sure?";setTimeout(()=>{r.classList.remove("arm");r.textContent="Reset"},2500);return}resetGroup(r.dataset.reset);return}});
document.addEventListener("keydown",e=>{const p=e.target.closest&&e.target.closest("[data-only]");if(p&&(e.key==="Enter"||e.key===" ")){e.preventDefault();p.click()}});
function resetGroup(g){if(g==="tools"){S.pan="";S.shovel="";S.panEn="";S.shEn=""}else if(g==="jewelry"){S.slots={}}else if(g==="museum"){S.mus="none";S.museumBoard=null}
  else if(g==="boosts"){S.b={};S.n={friendTotem:-1,friends:0,mastery:0,flatLuck:0,flatDig:0};S.pots=[];S.runes=[]}S.only=null;save();all()}
$("resetAll").onclick=()=>{const b=$("resetAll");if(!b.classList.contains("arm")){b.classList.add("arm");b.textContent="Reset everything?";setTimeout(()=>{b.classList.remove("arm");b.textContent="Reset everything"},2500);return}
  ["tools","jewelry","museum","boosts"].forEach(g=>resetGroup(g));S.isoOff=[];S.only=null;S.owned=false;b.classList.remove("arm");b.textContent="Reset everything";save();all()};
function render(){
  renderIso();renderParts();
  const r=compute(effState());
  const f=(s,v)=>PCT.has(s)?fmt(v,1)+"%":fmt(v,s==="Luck"||s==="Capacity"?0:1);
  $("out").innerHTML=`<table class="out"><tr><th>Stat</th><th>Gear</th><th>Boost pile</th><th>Total</th></tr>${STATS.map(s=>{const show=r.base[s]||r.tot[s]||s==="Luck";if(!show)return "";
    return `<tr class="${s==="Luck"?"big":""}"><td>${s}</td><td>${f(s,r.base[s]+r.flat[s])}</td><td>${["Toughness","Inventory Size"].includes(s)?"—":"×"+fmt(1+r.pile[s],2)}</td><td class="tot">${f(s,r.tot[s])}</td></tr>`}).join("")}</table>
    <p class="hint" style="margin-top:8px">${[r.ev>1?`Events multiply final luck by ×${r.ev}.`:"",r.luckMult>1?`Your tools add ×${fmt(r.luckMult,2)} luck at the end.`:"",r.mt.n?`Museum: ${r.mt.n} display${r.mt.n===1?"":"s"} counted.`:"No museum counted.",...r.notes].filter(Boolean).join(" ")}</p>`;
  const mtS=musTotals(S);$("musTxt").textContent=S.mus==="none"?"":mtS.n?Object.entries(mtS.t).filter(([,v])=>v).map(([k,v])=>`${k} ${v<0?"−":"+"}${fmt(Math.abs(v),3)}×`).join(" · "):"That museum board is empty. Fill it in on the Museum Planner page.";
}
// ---- save the build as an image: gear, boosts, then the stats table (what "Your stats" shows) ----
const RHX={Ascended:"#ffd36b",Exotic:"#f17ad6",Mythic:"#f0687f",Legendary:"#f2b53a",Epic:"#b880ee",Rare:"#68a6f0",Uncommon:"#6cc46e",Common:"#a3adb8"};
const MUTHX={Silver:"#a9b4be",Gold:"#d9a520",Diamond:"#5fc8e8",Granite:"#8d8d86",Overclocked:"#e0602f",Festive:"#d23c3c",Prismatic:"#c05bd8"};
// copy the stat panel as text, ready to paste into Discord
$("cpStats").onclick=async()=>{const st=effState(),t=compute(st).tot;const gear=[S.pan&&"Pan: "+S.pan,S.shovel&&"Shovel: "+S.shovel].filter(Boolean).join(" · ");
  const lines=SHOW.filter(s=>t[s]).map(s=>`${s}: ${fv(s,t[s])}`);
  if(!lines.length){ptToast("Nothing to copy yet. Pick some gear first.");return}
  const txt=["**My Prospecting stats**",gear,...lines].filter(Boolean).join("\n");let ok=false;
  try{await navigator.clipboard.writeText(txt);ok=true}catch(e){try{const ta=document.createElement("textarea");ta.value=txt;ta.style.position="fixed";ta.style.opacity="0";document.body.appendChild(ta);ta.select();ok=document.execCommand("copy");ta.remove()}catch(e2){}}
  ptToast(ok?"Stats copied, paste them anywhere":"Couldn't copy, your browser blocked it")};
$("toImg").onclick=()=>{const st=effState();const r=compute(st);
  const gear=[];const pan=G.pans.find(x=>x.name===st.pan),sh=G.shovels.find(x=>x.name===st.shovel);
  if(pan)gear.push({cells:[{t:"Pan",col:"#98a2ad"},{t:pan.name,b:true,ic:G.img[pan.image],sub:[st.panEn?"Enchant: "+st.panEn:"No enchant",st.trinket?"Trinket: "+st.trinket:""].filter(Boolean).join(" · ")},{t:"—",col:"#98a2ad"},{t:"—",col:"#98a2ad"},{t:"—",col:"#98a2ad"}]});
  if(sh)gear.push({cells:[{t:"Shovel",col:"#98a2ad"},{t:sh.name,b:true,ic:G.img[sh.image],sub:st.shEn?"Enchant: "+st.shEn:"No enchant"},{t:"—",col:"#98a2ad"},{t:"—",col:"#98a2ad"},{t:"—",col:"#98a2ad"}]});
  SLOTDEF.forEach(([k,l])=>{const v=(st.slots||{})[k];if(!v||!v.n)return;const x=EQB[v.n];const m=v.m||"None";
    gear.push({cells:[{t:l,col:"#98a2ad"},{t:v.n,b:true,ic:x&&P.eimg[x.img],sub:x?x.r:"",subcol:x?(RHX[x.r]||"#98a2ad"):"#98a2ad"},{t:v.l==="0"?"0★":v.l==="5"?"5★":"6★",mono:true,col:"#f2b53a"},{t:m==="None"?"None":m,col:MUTHX[m]||"#98a2ad",b:m!=="None"},{t:(v.q??100)+"%",mono:true}]})});
  const boosts=[];const lab=k=>{const e=document.querySelector(`[data-b="${k}"]`);return e?e.parentElement.textContent.trim():k};
  Object.entries(st.b||{}).forEach(([k,v])=>{if(v)boosts.push({t:lab(k),col:"#e6e9ec"})});
  (st.pots||[]).forEach(n=>boosts.push({t:n,col:"#b880ee"}));(st.runes||[]).forEach(n=>boosts.push({t:n+" rune",col:"#68a6f0"}));
  const n=st.n||{};if(+n.friendTotem>=0)boosts.push({t:`Friendship Totem (${+n.friendTotem} nearby)`,col:"#e6e9ec"});if(+n.friends>0)boosts.push({t:`${+n.friends} friend${+n.friends===1?"":"s"} online`,col:"#e6e9ec"});
  if(+n.mastery>0)boosts.push({t:`Location mastery +${n.mastery}×`,col:"#e6e9ec"});if(+n.flatLuck>0)boosts.push({t:`+${fmt(+n.flatLuck,0)} flat luck`,col:statHex("Luck")});if(+n.flatDig>0)boosts.push({t:`+${fmt(+n.flatDig,0)} flat dig strength`,col:statHex("Dig Strength")});
  const mt=musTotals(st);if(st.mus!=="none"&&mt.n)boosts.push({t:`Museum: ${mt.n} display${mt.n===1?"":"s"}`,col:"#3cc2a8"});
  const stats=STATS.filter(x=>r.base[x]||r.tot[x]||x==="Luck").map(x=>({cells:[{t:x,b:true,col:statHex(x)},{t:fv(x,r.base[x]+r.flat[x]),mono:true},{t:["Toughness","Inventory Size"].includes(x)?"—":"×"+fmt(1+r.pile[x],2),mono:true,col:"#98a2ad"},{t:fv(x,r.tot[x]),mono:true,b:true}]}));
  const secs=[];if(gear.length)secs.push({h:"Gear",cols:[{h:"Slot",w:.14},{h:"Item",w:.42},{h:"Stars",w:.12,al:"r"},{h:"Mutation",w:.18,al:"r"},{h:"Quality",w:.14,al:"r"}],rows:gear});
  if(boosts.length)secs.push({h:"Boosts",cols:[{h:"Active",w:1}],rows:[{cells:[{chips:boosts}]}]});
  secs.push({h:"Stats",cols:[{h:"Stat",w:.34},{h:"Gear",w:.22,al:"r"},{h:"Boost pile",w:.2,al:"r"},{h:"Total",w:.24,al:"r"}],rows:stats});
  const sub=[];const ex=[r.ev>1?`events ×${r.ev} luck`:"",r.luckMult>1?`tools ×${fmt(r.luckMult,2)} luck`:""].filter(Boolean);if(ex.length)sub.push("Includes "+ex.join(" and "));
  if((S.isoOff||[]).length||S.only)sub.push("Only some parts counted");
  if(!gear.length&&!boosts.length){ptToast("Pick some gear first");return}
  ptSaveImg("My build",()=>ptTableImage({title:"My build",sub,sections:secs}))};
// ---- gear picker with hover preview ----
const clone=o=>JSON.parse(JSON.stringify(o));
// rings the game only lets you wear one of at a time
const ONE_ONLY=new Set(["Dredge Master's Ring","Ring of Champions","Ring of the Stars"]);
const takenElsewhere=(k,n)=>ONE_ONLY.has(n)&&SLOTDEF.some(([kk])=>kk!==k&&(S.slots[kk]||{}).n===n);
const slotOf=k=>k==="pan"||k==="shovel"?null:SLOTDEF.find(d=>d[0]===k);
const curName=k=>k==="pan"?S.pan:k==="shovel"?S.shovel:((S.slots[k]||{}).n||"");
const itemsFor=k=>k==="pan"?G.pans.map(x=>({n:x.name,r:"",img:G.img[x.image],x,kind:"pan"})):k==="shovel"?G.shovels.map(x=>({n:x.name,r:"",img:G.img[x.image],x,kind:"shovel"})):EQ.filter(x=>x.slot===slotOf(k)[2]).map(x=>({n:x.n,r:x.r,img:P.eimg[x.img],x,kind:"eq"}));
const withItem=(k,n)=>{const t=clone(S);if(k==="pan")t.pan=n;else if(k==="shovel")t.shovel=n;else{(t.slots[k]=t.slots[k]||{}).n=n}return t};
const SHOW=["Luck","Capacity","Shake Strength","Shake Speed","Dig Strength","Dig Speed","Size Boost","Modifier Boost","Sell Boost","Inventory Size","Walk Speed","Toughness"];
const fv=(s,v)=>PCT.has(s)?fmt(v,1)+"%":fmt(v,s==="Luck"||s==="Capacity"?0:1);
const sgn=(s,d)=>(d>0?"+":d<0?"−":"±")+fv(s,Math.abs(d));
function itemStats(k,it){if(!it)return [];
  if(it.kind==="pan"){const x=it.x;return [["Luck",num(x.luck)],["Capacity",num(x.capacity)],["Shake Strength",num(x.strength)],["Shake Speed",String(x.speed).includes("%")?num(x.speed):num(x.speed)*100],...(x.passive?[["Passive",x.passive]]:[])]}
  if(it.kind==="shovel"){const x=it.x;return [["Dig Strength",num(x.strength)],["Dig Speed",num(x.speed)*100],["Toughness",num(x.toughness)],...(x.passive?[["Passive",x.passive]]:[])]}
  const v=S.slots[k]||{};const mu=MUT[v.m||"None"]||MUTS[0];const out=it.x.st.map(s=>[s[0],eqVal(s,(v.l==="5"||v.l==="0"?"5":"6"),v.q??100,mu[1])]);Object.entries(mu[2]).forEach(([n,a])=>{const o=out.find(z=>z[0]===n);if(o)o[1]+=a;else out.push([n,a])});return out}
function deltaRows(a,b){return SHOW.map(s=>[s,a.tot[s],b.tot[s]]).filter(([s,x,y])=>Math.abs(y-x)>1e-9)}
function previewHtml(k,it,mode){
  const cur=compute(S);
  const head=it?`<div class="pvh">${it.img?`<img src="${it.img}" alt="">`:`<span class="icon"></span>`}<div><b>${esc(it.n)}</b>${it.r?`<span class="rr" style="--rc:${rc(it.r)}">${it.r} ${it.x.slot}</span>`:""}</div></div>`:`<div class="pvh"><div><b>Empty slot</b><span class="muted">Nothing equipped</span></div></div>`;
  const v=S.slots[k]||{};const sub=it&&it.kind==="eq"?` <span style="text-transform:none;letter-spacing:0;font-weight:400">· ${v.l==="0"?"no stars":v.l==="5"?"5★":"6★"}, ${(v.m&&v.m!=="None")?v.m:"no mutation"}, ${v.q??100}% quality</span>`:"";
  const st=itemStats(k,it).map(([n,val])=>n==="Passive"?`<div><span>Passive</span><span style="text-align:right">${esc(val)}</span></div>`:`<div><span>${esc(n)}</span><span class="mono ${val<0?"dn":""}">${PCT.has(n)||(it.kind==="eq"&&it.x.st.find(z=>z[0]===n&&z[5]))?(val>0?"+":"")+fmt(val,1)+"%":(val>0&&it.kind==="eq"?"+":"")+fmt(val,2)}</span></div>`).join("");
  let dl;
  if(mode==="current"){const without=compute(withItem(k,""));dl=deltaRows(without,cur);dl=dl.length?`<div class="pvt">What it adds to your totals</div><div class="pvs">${dl.map(([s,x,y])=>`<div><span>${s}</span><span class="mono ${y>x?"up":"dn"}">${sgn(s,y-x)}</span></div>`).join("")}</div>`:""}
  else if(it&&takenElsewhere(k,it.n)){dl=`<div class="pvt">Only one can be worn</div><span class="muted">${esc(it.n)} is already in another slot.</span>`}
  else{const nx=compute(withItem(k,it?it.n:""));const rows=deltaRows(cur,nx);dl=`<div class="pvt">${curName(k)===(it?it.n:"")?"Already equipped":"Your totals if you pick this"}</div>`+(rows.length?`<div class="pvs">${rows.map(([s,x,y])=>`<div><span>${s}</span><span class="mono">${fv(s,x)} → <b class="${y>x?"up":"dn"}">${fv(s,y)}</b> <span class="${y>x?"up":"dn"}">(${sgn(s,y-x)})</span></span></div>`).join("")}</div>`:`<span class="muted">No change.</span>`)}
  return head+(st?`<div class="pvt">Item stats${sub}</div><div class="pvs">${st}</div>`:"")+dl}
function paintPicks(){document.querySelectorAll("[data-pick]").forEach(b=>{const k=b.dataset.pick;const n=curName(k);const it=n&&itemsFor(k).find(i=>i.n===n);
  b.innerHTML=`${it&&it.img?`<img src="${it.img}" alt="">`:""}<span class="pn ${n?"":"nil"}">${n?esc(n):k==="pan"?"— no pan —":k==="shovel"?"— no shovel —":"— empty —"}</span>${it&&it.r?`<span class="rr" style="--rc:${rc(it.r)}">${it.r}</span>`:""}<span class="car" aria-hidden="true">▾</span>`})}
// open / navigate / pick
const pk=$("picker"),pkQ=$("pkQ"),pkList=$("pkList"),pkPv=$("pkPv"),tip=$("tip");let pkKey=null,pkBtn=null,pkItems=[],pkSel=0;
function openPicker(btn){pkKey=btn.dataset.pick;pkBtn=btn;tip.hidden=true;pkQ.value="";pk.hidden=false;place();listPicker();
  pkSel=Math.max(0,pkItems.findIndex(i=>(i?i.n:"")===curName(pkKey)));markSel();pkQ.focus()}
function place(){const r=pkBtn.getBoundingClientRect(),vw=innerWidth,vh=innerHeight;const w=Math.min(vw-16,vw<=700?440:680);const left=Math.min(Math.max(8,r.left),vw-w-8);
  const below=vh-r.bottom-12,above=r.top-12;const h=Math.min(vw<=700?Math.min(560,vh-16):460,Math.max(below,above,vw<=700?vh-16:0));pk.style.width=w+"px";pk.style.left=left+"px";pk.style.height=h+"px";
  if(vw<=700){pk.style.top=Math.max(8,(vh-h)/2)+"px";pk.style.left=((vw-w)/2)+"px"}else if(below>=Math.min(320,above)){pk.style.top=(r.bottom+4)+"px"}else{pk.style.top=(r.top-4-h)+"px"}}
function listPicker(){const q=pkQ.value.trim().toLowerCase();const cur=compute(S);
  pkItems=[null,...itemsFor(pkKey).filter(i=>(!S.owned||own(i.n)||i.n===curName(pkKey))&&(!q||(i.n+" "+i.r).toLowerCase().includes(q)))];
  pkList.innerHTML=pkItems.map((it,i)=>{let d="";if(it){const nx=compute(withItem(pkKey,it.n));const dv=nx.tot.Luck-cur.tot.Luck;if(Math.abs(dv)>.5)d=`<span class="dl ${dv>0?"up":"dn"}">${dv>0?"+":"−"}${fmt(Math.abs(dv),0)} luck</span>`}
    const blocked=it&&takenElsewhere(pkKey,it.n);if(blocked)d=`<span class="dl">already worn</span>`;
    return `<div class="opt${(it?it.n:"")===curName(pkKey)?" cur":""}${blocked?" off":""}" role="option" id="po${i}" data-oi="${i}" aria-selected="false"${blocked?' aria-disabled="true" title="Only one can be worn at a time"':""}>${it&&it.img?`<img src="${it.img}" alt="">`:`<span style="width:26px"></span>`}<span class="on"><b>${it?esc(it.n):pkKey==="pan"?"No pan":pkKey==="shovel"?"No shovel":"Empty slot"}</b>${it&&it.r?`<span class="rr" style="--rc:${rc(it.r)}">${it.r}</span>`:""}</span>${d}</div>`}).join("");
  pkSel=Math.min(pkSel,pkItems.length-1);markSel()}
function markSel(){pkList.querySelectorAll(".opt").forEach(o=>o.setAttribute("aria-selected",String(+o.dataset.oi===pkSel)));const o=pkList.querySelector(`[data-oi="${pkSel}"]`);if(o){o.scrollIntoView({block:"nearest"});pkQ.setAttribute("aria-activedescendant",o.id)}
  pkPv.innerHTML=previewHtml(pkKey,pkItems[pkSel],"pick")}
function choose(i){const it=pkItems[i];if(it&&takenElsewhere(pkKey,it.n)){pkPv.insertAdjacentHTML("afterbegin",`<p class="hint" style="color:var(--warn)">Only one ${esc(it.n)} can be worn at a time, and it's already in another slot.</p>`);return}const n=it?it.n:"";if(pkKey==="pan")S.pan=n;else if(pkKey==="shovel")S.shovel=n;else (S.slots[pkKey]=S.slots[pkKey]||{}).n=n;save();closePicker();paintPicks();render()}
function closePicker(){if(pk.hidden)return;pk.hidden=true;const b=pkBtn;pkKey=null;b&&b.focus()}
pkQ.addEventListener("input",()=>{pkSel=pkQ.value.trim()?1:0;listPicker();if(pkItems.length<2){pkSel=0;markSel()}});
pkQ.addEventListener("keydown",e=>{if(e.key==="ArrowDown"){e.preventDefault();pkSel=Math.min(pkItems.length-1,pkSel+1);markSel()}else if(e.key==="ArrowUp"){e.preventDefault();pkSel=Math.max(0,pkSel-1);markSel()}else if(e.key==="Enter"){e.preventDefault();choose(pkSel)}else if(e.key==="Escape"){e.preventDefault();closePicker()}else if(e.key==="Tab"){closePicker()}});
pkList.addEventListener("mousemove",e=>{const o=e.target.closest("[data-oi]");if(o&&+o.dataset.oi!==pkSel){pkSel=+o.dataset.oi;markSel()}});
pkList.addEventListener("click",e=>{const o=e.target.closest("[data-oi]");if(o)choose(+o.dataset.oi)});
document.addEventListener("mousedown",e=>{if(!pk.hidden&&!pk.contains(e.target)&&!e.target.closest("[data-pick]"))closePicker()});
document.addEventListener("click",e=>{const b=e.target.closest("[data-pick]");if(!b||e.ctrlKey||e.metaKey)return;if(!pk.hidden&&pkBtn===b){closePicker();return}openPicker(b)});
addEventListener("resize",()=>{if(!pk.hidden)place()});
document.addEventListener("scroll",()=>{if(!pk.hidden)place();tip.hidden=true},true);
// hovering an equipped piece shows what it gives you
let tipT=null;
document.addEventListener("mouseover",e=>{const b=e.target.closest("[data-pick]");if(!b||!pk.hidden||matchMedia("(hover:none)").matches)return;clearTimeout(tipT);tipT=setTimeout(()=>{const k=b.dataset.pick;const n=curName(k);const it=n&&itemsFor(k).find(i=>i.n===n);
  tip.innerHTML=`<div class="pvp">${it?previewHtml(k,it,"current"):'<span class="muted">Empty. Click to pick something and preview how it changes your stats.</span>'}</div>`;tip.hidden=false;
  const r=b.getBoundingClientRect();const tw=290,th=tip.offsetHeight;let x=r.right+8;if(x+tw>innerWidth-8)x=Math.max(8,r.left-tw-8);if(x<8||(r.right+8+tw>innerWidth-8&&r.left-tw-8<8))x=Math.min(innerWidth-tw-8,Math.max(8,r.left));let y=Math.min(innerHeight-th-8,Math.max(8,r.top));if(x<r.right&&x+tw>r.left)y=r.bottom+6>innerHeight-th-8?r.top-th-6:r.bottom+6;tip.style.left=x+"px";tip.style.top=y+"px"},120)});
document.addEventListener("mouseout",e=>{if(e.target.closest("[data-pick]")&&!(e.relatedTarget&&e.relatedTarget.closest&&e.relatedTarget.closest("[data-pick]")===e.target.closest("[data-pick]"))){clearTimeout(tipT);tip.hidden=true}});
function fillEnch(){const EN=P.ench||{pan:[],shovel:[]};
  $("panEn").innerHTML=`<option value="">No enchant</option>`+EN.pan.map(e=>`<option value="${esc(e.n)}"${e.n===S.panEn?" selected":""}>${esc(e.n)}</option>`).join("");
  $("shEn").innerHTML=`<option value="">No enchant</option>`+EN.shovel.map(e=>`<option value="${esc(e.n)}"${e.n===S.shEn?" selected":""}>${esc(e.n)}</option>`).join("");
  // trinkets: their perks only kick in on certain pans (modified items, treasure maps…), so they're listed, not added to the stats
  const TRN=((P.x2||{}).trinkets||[]);if(S.trinket&&!TRN.some(t=>t.n===S.trinket))S.trinket="";
  $("trinket").innerHTML=`<option value="">No trinket</option>`+TRN.map(t=>`<option value="${esc(t.n)}"${t.n===S.trinket?" selected":""}>${esc(t.n)}</option>`).join("");
  const tk=TRN.find(t=>t.n===S.trinket);
  const pe=EN.pan.find(e=>e.n===S.panEn),se=EN.shovel.find(e=>e.n===S.shEn);
  $("enNote").textContent=[tk?`${tk.n}: ${tk.fx} (not counted in the stats, it depends on what you pan)`:"",pe?`${pe.n}: `+[...Object.entries(pe.m).map(([k,v])=>`${v}× pan ${k.toLowerCase()}`),...Object.entries(pe.a).map(([k,v])=>`${v>0?"+":"−"}${Math.abs(v)}${["Shake Speed","Size Boost","Modifier Boost","Sell Boost"].includes(k)?"%":""} ${k.toLowerCase()}`)].join(", ")+".":"",se?`${se.n}: ${se.d}`:""].filter(Boolean).join(" ")}
// ---- custom museum editor ----
const MORDER=["Exotic","Mythic","Legendary","Epic","Rare","Uncommon","Common"],MSLOTS={Exotic:1,Mythic:2,Legendary:3,Epic:3,Rare:3,Uncommon:3,Common:3};
const blankBoard=()=>Object.fromEntries(MORDER.map(r=>[r,Array.from({length:MSLOTS[r]},()=>({m:null,u:"None"}))]));
const boostTxt=m=>m&&m.mu?m.mu.b.map(([s,v])=>`${s} ${v<0?"−":"+"}${Math.abs(v)}×`).join(", "):"";
function musEditor(){const ed=$("musEd");$("musCopy").hidden=S.mus==="custom";if(S.mus!=="custom"){ed.innerHTML="";return}
  if(!S.museumBoard)S.museumBoard=blankBoard();const bd=S.museumBoard;
  ed.innerHTML=MORDER.map(r=>{const opts=P.mins.filter(m=>m.r===r&&m.mu);return `<div class="mrow" style="--rc:${rc(r)}"><span class="rl">${r}</span><div class="mslots">${(bd[r]||[]).map((sl,i)=>`<div class="msl">
    <select data-mm="${r}|${i}" aria-label="${r} display ${i+1}"><option value="">— empty —</option>${opts.map(m=>`<option value="${esc(m.n)}"${m.n===sl.m?" selected":""}>${esc(m.n)} · ${esc(boostTxt(m))}</option>`).join("")}</select>
    <select data-mu="${r}|${i}" aria-label="${r} display ${i+1} modifier">${P.mods.map(md=>`<option value="${esc(md[0])}"${md[0]===(sl.u||"None")?" selected":""}>${md[0]==="None"?"No modifier":esc(md[0])}</option>`).join("")}</select></div>`).join("")}</div></div>`}).join("")}
$("musCopy").onclick=()=>{const src=S.mus==="custom"?null:musBoard();const bd=blankBoard();if(src)MORDER.forEach(r=>(src[r]||[]).forEach((sl,i)=>{if(bd[r][i]&&sl)bd[r][i]={m:sl.m||null,u:sl.u||"None"}}));
  if(S.mus!=="custom"||!S.museumBoard)S.museumBoard=bd;S.mus="custom";save();fillMus();musEditor();render()};
// ---- build sheet <-> calculator ----
function toBuildSheet(){
  const ringSlots=SLOTDEF.filter(d=>d[2]==="Ring").map(([k])=>S.slots[k]||{}).filter(v=>v.n);
  const groups=[];ringSlots.forEach(v=>{const key=v.n+"|"+(v.m||"None")+"|"+(v.l||"6")+"|"+(v.q??100);const g=groups.find(g=>g.key===key);if(g)g.c++;else groups.push({key,v,c:1})});
  const extra=v=>{const t=[];if(v.l==="5")t.push("5★");else if(v.l==="0")t.push("0★");if((v.q??100)!==100)t.push((v.q??100)+"% quality");return t.join(", ")};
  const eqOut=v=>({name:v&&v.n||"",mut:v&&v.m&&v.m!=="None"?v.m:"",note:v&&v.n?extra(v):""});
  const mb=musBoard();const museum={};const mods={};
  MORDER.forEach(r=>{museum[r]=Array.from({length:MSLOTS[r]},(_,i)=>{const sl=mb&&mb[r]&&mb[r][i];if(sl&&sl.m){mods[sl.u||"None"]=(mods[sl.u||"None"]||0)+1}return {m:sl&&sl.m?[sl.m]:[],pick:1,join:"|",mark:"",span:1}})});
  const modList=Object.entries(mods).sort((a,b)=>b[1]-a[1]);const mod=modList.length?modList[0][0]:"Any";
  const notes=[];if(modList.length>1)notes.push("Museum modifiers in the calculator were mixed: "+modList.map(([m,c])=>`${c}× ${m}`).join(", "));
  const r=compute(S);notes.push(`Calculated luck: ${fmt(r.tot.Luck,0)} with the boosts set in the Stat Calculator`);
  return {name:"",subtitle:"From the Stat Calculator",notes:notes.join("\n"),mod:mod==="None"?"Any":mod,museum,
    neck:eqOut(S.slots.neck),charm:eqOut(S.slots.charm),rings:groups.length?groups.map(g=>({count:g.c+"×",name:g.v.n,mut:g.v.m&&g.v.m!=="None"?g.v.m:"",note:extra(g.v)})):[{count:"",mut:"",name:"",note:""}],
    split6:false,rings6:[],pan:{name:S.pan||"",enchant:S.panEn||"",trinket:S.trinket||"",note:""},shovel:{name:S.shovel||"",enchant:S.shEn||"",note:""}}}
$("toBuild").onclick=()=>{try{window.parent.ptSendBuild(toBuildSheet())}catch(e){}};
$("fromBuild").onclick=()=>{try{window.parent.ptPickBuild()}catch(e){}};
// called by the shell with a state made from a build sheet: gear + museum are replaced, boosts are kept
// build sheets are hand-typed, so match names loosely: curly quotes, footnote marks and short names like "Pharaoh's"
const normN=t=>String(t||"").replace(/[’‘`]/g,"'").replace(/[†‡♠♣♥♦*§¹²³]/g,"").replace(/\s+/g," ").trim().toLowerCase();
function resolveName(t,names,suffix){const n=normN(t);if(!n)return "";const L=names.map(x=>[x,normN(x)]);
  return (L.find(([,y])=>y===n)||L.find(([,y])=>suffix&&y===n+" "+suffix)||L.find(([,y])=>y.startsWith(n+" "))||L.find(([,y])=>y.includes(n))||[""])[0]}
window.ptLoadMuseum=bd=>{S.museumBoard=JSON.parse(JSON.stringify(bd));S.mus="custom";save();all()};
window.ptTotals=()=>compute(S).tot;
// stats for a build from Build Sheets, split by where they come from; never changes the calculator's own setup
window.ptBreakdown=st=>{const EN=P.ench||{pan:[],shovel:[]};const R=(t,names,suf)=>resolveName(t,names,suf)||"";
  const slots={};Object.entries(st.slots||{}).forEach(([k,v])=>{if(!v||!v.n){slots[k]={};return}const slot=(SLOTDEF.find(d=>d[0]===k)||[])[2];slots[k]=Object.assign({},v,{n:R(v.n,EQ.filter(x=>x.slot===slot).map(x=>x.n),"")})});
  const bd=clone(st.museumBoard||blankBoard());MORDER.forEach(r=>(bd[r]||[]).forEach(sl=>{if(sl&&sl.m)sl.m=R(sl.m,P.mins.filter(x=>x.r===r).map(x=>x.n),"")||null}));
  const T={pan:R(st.pan,G.pans.map(x=>x.name),"pan"),shovel:R(st.shovel,G.shovels.map(x=>x.name),"shovel"),panEn:R(st.panEn,EN.pan.map(e=>e.n),""),shEn:R(st.shEn,EN.shovel.map(e=>e.n),""),trinket:"",slots,mus:"custom",museumBoard:bd,b:{},n:{friendTotem:-1,friends:0,mastery:0,flatLuck:0,flatDig:0},pots:[],runes:[]};
  const full=compute(T),noJ=compute(Object.assign(clone(T),{slots:{}})),noT=compute(Object.assign(clone(T),{pan:"",shovel:"",panEn:"",shEn:""}));
  return STATS.filter(x=>x!=="Inventory Size").map(x=>({s:x,tools:noJ.base[x],jewelry:noT.base[x],museum:full.pile[x],total:full.tot[x]})).filter(r=>r.tools||r.jewelry||r.museum||r.total)};
window.ptLoadState=st=>{const missed=[];
  const R=(t,names,suf,label)=>{const r=resolveName(t,names,suf);if(t&&!r)missed.push(`${label} “${t}”`);return r};
  const EN=P.ench||{pan:[],shovel:[]};
  const slots={};Object.entries(st.slots||{}).forEach(([k,v])=>{if(!v||!v.n){slots[k]={};return}const slot=(SLOTDEF.find(d=>d[0]===k)||[])[2];const n=R(v.n,EQ.filter(x=>x.slot===slot).map(x=>x.n),"",(slot||"item").toLowerCase());slots[k]=Object.assign({},v,{n})});
  // one-only rings: drop repeats
  const seen=new Set();Object.keys(slots).filter(k=>/^r\d/.test(k)).sort().forEach(k=>{const n=slots[k].n;if(n&&ONE_ONLY.has(n)){if(seen.has(n))slots[k]={};else seen.add(n)}});
  const bd=st.museumBoard||blankBoard();MORDER.forEach(r=>(bd[r]||[]).forEach(sl=>{if(sl&&sl.m){const m=R(sl.m,P.mins.filter(x=>x.r===r).map(x=>x.n),"","mineral");sl.m=m||null}}));
  Object.assign(S,{pan:R(st.pan,G.pans.map(x=>x.name),"pan","pan"),shovel:R(st.shovel,G.shovels.map(x=>x.name),"shovel","shovel"),panEn:R(st.panEn,EN.pan.map(e=>e.n),"","pan enchant"),shEn:R(st.shEn,EN.shovel.map(e=>e.n),"","shovel enchant"),trinket:R(st.trinket,((P.x2||{}).trinkets||[]).map(t=>t.n),"","trinket"),slots,mus:"custom",museumBoard:bd});save();all();

  const t=document.createElement("div");t.className="toast";t.setAttribute("role","status");t.textContent=(st.from?`Loaded “${st.from}” from Build Sheets`:"Loaded from Build Sheets")+(missed.length?`. Couldn't match ${missed.join(", ")}, so ${missed.length===1?"it was":"they were"} left empty.`:"")+(st.extraRings?`. The build lists ${st.extraRings} more ring${st.extraRings===1?"":"s"} than the 8 slots, so only the first 8 were used.`:"");Object.assign(t.style,{position:"fixed",left:"50%",bottom:"20px",transform:"translateX(-50%)",background:"var(--fg)",color:"var(--bg)",padding:"8px 14px",borderRadius:"8px",zIndex:60,fontSize:"13.5px"});document.body.appendChild(t);setTimeout(()=>t.remove(),missed.length||st.extraRings?6000:2400)};
function fillPots(){const PO=((P.x2||{}).potions||[]);S.pots=(S.pots||[]).filter(n=>PO.some(p=>p.n===n));
  $("potAdd").innerHTML=`<option value="">Add a potion…</option>`+PO.filter(p=>!S.pots.includes(p.n)).map(p=>`<option value="${esc(p.n)}">${esc(p.n)} · ${esc(p.fx)}</option>`).join("");
  // show / hide the list of active potions (visual only: they still count in the stats)
  let hid=false;try{hid=localStorage.getItem("pc-hidepots")==="1"}catch(e){}
  $("potShow").textContent=hid?"Show potions":"Hide potions";$("potShow").setAttribute("aria-pressed",String(!hid));$("potList").hidden=hid;
  $("potHid").hidden=!hid;$("potHid").textContent=S.pots.length?`${S.pots.length} potion${S.pots.length===1?"":"s"} active, still counted in your stats.`:"No potions active.";
  $("potList").innerHTML=S.pots.map(n=>`<span class="chip" style="cursor:default">${esc(n)} <button type="button" data-rmpot="${esc(n)}" aria-label="Remove ${esc(n)}" style="border:0;background:none;cursor:pointer;color:var(--muted);font-size:14px;padding:0 0 0 4px">×</button></span>`).join("")||'<span class="hint">No potions active.</span>'}
function toast(t){document.querySelectorAll(".ctoast").forEach(x=>x.remove());const d=document.createElement("div");d.className="ctoast";d.setAttribute("role","status");d.textContent=t;d.style.cssText="position:fixed;left:50%;bottom:20px;transform:translateX(-50%);background:var(--fg);color:var(--bg);padding:8px 14px;border-radius:8px;font-size:13.5px;z-index:40";document.body.appendChild(d);setTimeout(()=>d.remove(),2200)}
// every potion bought with money, except the Traveling Merchant's (he isn't always around)
const moneyPots=()=>((P.x2||{}).potions||[]).filter(p=>/\$/.test(p.cost)&&!/travel/i.test(p.where||""));
$("potMoney").onclick=()=>{const add=moneyPots().map(p=>p.n).filter(n=>!(S.pots||[]).includes(n));S.pots=[...(S.pots||[]),...add];save();fillPots();render();toast(add.length?`Added ${add.length} money potion${add.length===1?"":"s"}`:"All money potions are already on")};
$("potShow").onclick=()=>{let hid=false;try{hid=localStorage.getItem("pc-hidepots")==="1"}catch(e){}try{localStorage.setItem("pc-hidepots",hid?"0":"1")}catch(e){}fillPots()};
$("potClear").onclick=()=>{if(!(S.pots||[]).length)return;S.pots=[];save();fillPots();render();toast("Potions cleared")};
document.addEventListener("click",e=>{const b=e.target.closest("[data-rmpot]");if(!b)return;S.pots=(S.pots||[]).filter(n=>n!==b.dataset.rmpot);save();fillPots();render()});
function fillRunes(){const RU=(S.runes||[]).filter(n=>!["Sunblessed","Abyssal","Solitude","Purity","Veteran"].includes(n));$("runeList").innerHTML=RU.map(n=>`<span class="chip" style="cursor:default">${esc(n)}</span>`).join("")||'<span class="hint">None</span>'}
window.ptSetRunes=list=>{S.runes=list||[];S.b.sun=S.runes.includes("Sunblessed")||S.runes.includes("Abyssal");S.b.solo=S.runes.includes("Solitude");S.b.purity=S.runes.includes("Purity");S.b.vet=S.runes.includes("Veteran");save();all()};
$("runePage").onclick=()=>{try{window.parent.ptCallTool("runes","ptOpenItem","")}catch(e){}};
function all(){fillEnch();fillPots();fillRunes();$("allMut").innerHTML=`<option value="">Set all mutations…</option>`+MUTS.map(m=>`<option value="${m[0]}">${m[0]==="None"?"No mutation":m[0]}</option>`).join("");fillTools();buildSlots();paintPicks();fillMus();musEditor();
  document.querySelectorAll("[data-b]").forEach(i=>i.checked=!!S.b[i.dataset.b]);document.querySelectorAll("[data-n]").forEach(i=>i.value=S.n[i.dataset.n]??0);$("ownedOnly").checked=!!S.owned;render()}
document.addEventListener("change",e=>{const t=e.target;
  if(t.id==="potAdd"){if(t.value){S.pots=[...(S.pots||[]),t.value];fillPots()}else return}
  else if(t.dataset.mm){const [r,i]=t.dataset.mm.split("|");S.museumBoard[r][+i].m=t.value||null}
  else if(t.dataset.mu){const [r,i]=t.dataset.mu.split("|");S.museumBoard[r][+i].u=t.value}
  else if(t.id==="mus"){S.mus=t.value;musEditor()}else if(t.id==="panEn"){S.panEn=t.value;fillEnch()}else if(t.id==="shEn"){S.shEn=t.value;fillEnch()}else if(t.id==="trinket"){S.trinket=t.value;fillEnch()}
  else if(t.id==="ownedOnly"){S.owned=t.checked;save();all();return}
  else if(t.dataset.lvl){(S.slots[t.dataset.lvl]=S.slots[t.dataset.lvl]||{}).l=t.value}
  else if(t.dataset.mut){(S.slots[t.dataset.mut]=S.slots[t.dataset.mut]||{}).m=t.value}
  else if(t.id==="allMut"){if(!t.value)return;SLOTDEF.forEach(([k])=>{(S.slots[k]=S.slots[k]||{}).m=t.value;document.querySelector(`[data-mut="${k}"]`).value=t.value});t.value=""}
  else if(t.dataset.q){(S.slots[t.dataset.q]=S.slots[t.dataset.q]||{}).q=Math.min(100,Math.max(0,+t.value||0))}
  else if(t.dataset.b){S.b[t.dataset.b]=t.checked}
  else if(t.dataset.n){S.n[t.dataset.n]=+t.value||0}
  else return;save();render()});
document.addEventListener("input",e=>{const t=e.target;if(t.dataset.q){(S.slots[t.dataset.q]=S.slots[t.dataset.q]||{}).q=Math.min(100,Math.max(0,+t.value||0));save();render()}else if(t.dataset.n&&t.type==="number"){S.n[t.dataset.n]=+t.value||0;save();render()}});
document.querySelector(".seg").addEventListener("click",e=>{const b=e.target.closest("[data-all]");if(!b)return;SLOTDEF.forEach(([k])=>{(S.slots[k]=S.slots[k]||{}).l=b.dataset.all;document.querySelector(`[data-lvl="${k}"]`).value=b.dataset.all});save();render()});
window.onStoreChange=()=>{if(S.owned)all()};
// the museum may have changed while this tool was hidden
window.addEventListener("focus",()=>{fillMus();render()});
window.ptRefresh=()=>{fillMus();render()};
all();
