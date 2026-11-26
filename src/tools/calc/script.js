
const $=id=>document.getElementById(id);
const G=P.gear;const EQ=P.equip;const EQB=Object.fromEntries(EQ.map(x=>[x.n,x]));
const STATS=["Luck","Capacity","Shake Strength","Shake Speed","Dig Strength","Dig Speed","Size Boost","Modifier Boost","Sell Boost","Inventory Size","Walk Speed","Jump Power","Toughness"];
const PCT=new Set(["Shake Speed","Dig Speed","Size Boost","Modifier Boost","Sell Boost"]);
const SLOTDEF=[["neck","Necklace","Necklace"],["charm","Charm","Charm"],...Array.from({length:8},(_,i)=>["r"+i,"Ring "+(i+1),"Ring"])];
const MUTS=[["None",1,{}],["Silver",1.1,{}],["Gold",1.2,{}],["Diamond",1.35,{}],["Granite",1.36,{"Dig Strength":24,"Shake Strength":6}],["Overclocked",1.36,{"Dig Speed":10,"Shake Speed":10}],["Festive",1.4,{"Luck":50,"Size Boost":10}],["Sunforged",1.5,{"Luck":300,"Sell Boost":30}],["Prismatic",1.6,{}]];
const MUT=Object.fromEntries(MUTS.map(m=>[m[0],m]));
const mutLabel=m=>m[0]==="None"?"No mutation":`${m[0]} ×${m[1]}${Object.keys(m[2]).length?" +":""}`;
const MULT={Common:.005,Uncommon:.0075,Rare:.0125,Epic:.02,Legendary:.03,Mythic:.05,Exotic:.08};
const MODS=Object.fromEntries(P.mods.map(m=>[m[0],m]));
window.S=null;let S={pan:"Rusty Pan",shovel:"Rusty Shovel",slots:{},mus:"board",b:{},n:{friendTotem:-1,friends:0,mastery:0,flatLuck:0,flatDig:0},owned:false};
window.S=S;try{const s=JSON.parse(localStorage.getItem("pcalc")||"null");if(s)S=Object.assign(S,s,{b:Object.assign({},s.b),n:Object.assign(S.n,s.n)})}catch(e){}
{const seen=new Set();Object.keys(S.slots).sort().forEach(k=>{const v=S.slots[k];if(v&&["Dredge Master's Ring","Ring of Champions","Ring of the Stars","Scarab Signet","Embalmer's Ring","Ring of Ra"].includes(v.n)){if(seen.has(v.n))v.n="";else seen.add(v.n)}})}
window.S=S;Object.values(S.slots).forEach(v=>{if(v&&v.l==="p"){v.l="6";v.m="Prismatic"}});
const save=()=>{try{localStorage.setItem("pcalc",JSON.stringify(S))}catch(e){}};
const own=n=>!!(Store.get(n)||{}).own;
// tool selects
function fillSel(el,items,cur,blank){const list=items.filter(x=>!S.owned||own(x.name||x.n)||(x.name||x.n)===cur);
  el.innerHTML=(blank?`<option value="">${blank}</option>`:"")+list.map(x=>{const n=x.name||x.n;return `<option value="${esc(n)}"${n===cur?" selected":""}>${esc(n)}${x.r?", "+x.r:""}</option>`}).join("")}
function buildSlots(){
  $("slots").innerHTML=SLOTDEF.map(([k,l,slot])=>{const v=S.slots[k]||{};return `<div class="slot"><span class="sl">${l}</span>
    <button type="button" class="pick it" data-pick="${k}" aria-haspopup="listbox" aria-label="${l}"></button>
    <select data-lvl="${k}" aria-label="${l} stars"><option value="0">0★</option><option value="5">5★</option><option value="6">6★</option></select>
    <select data-mut="${k}" data-ptmut aria-label="${l} mutation">${MUTS.map(m=>`<option value="${m[0]}">${mutLabel(m)}</option>`).join("")}</select>
    <span class="qw"><button type="button" class="qbtn" data-qopen="${k}" title="Quality: where the roll lands (100% = best). Click to change"${(v.q??100)!==100||v.l==="5"||v.l==="0"?" hidden":""}>100%</button><input type="number" min="0" max="100" data-q="${k}" value="${v.q??100}" aria-label="${l} quality %" title="Quality %"${(v.q??100)!==100||v.l==="5"||v.l==="0"?"":" hidden"}></span></div>`}).join("");
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
// Beach Umbrella and Mass Reactor add base luck for the next pan, from how many minerals a pan holds.
// Minerals per pan (from our logs): average 0.678 × capacity^0.565, most ≈ 2.5 × √capacity.
// Umbrella: +25 per modified mineral (chance 1 − 0.937^(Modifier Boost ×)). Reactor: +25 per mineral over 20.
const TRROLL={"Beach Umbrella":1,"Mass Reactor":1};
function trkLuck(n,cap,mb,max){const c=Math.max(0,cap),k=max?2.5*Math.sqrt(c):.678*Math.pow(c,.565),pm=ptAnyMod(mb);
  return {n:k,pm,luck:n==="Beach Umbrella"?25*k*pm:Math.max(0,25*(k-20))}}
const TRLAB=(n,max)=>TRROLL[n]?`${n} (${max?"max":"average"} roll)`:n;
// permanent quest buffs: kept when boosts are reset
const PERM=["trader","lighthouse","ancient","spirits"];
// Tomb Mastery levels 1–5: flat luck (in-game panel; each level also adds 3s of tomb time)
const TOMB=[0,50,100,200,350,500];
// limited-time consumables: kept apart from potions. Values from the wiki's Relics page.
const CONS=[{n:"Luck Booster",fx:"2× luck, 15 min",p:{Luck:1}},{n:"Candy Corn",fx:"+0.5× luck, 10 min",p:{Luck:.5}},{n:"Gingerbread Cookie",fx:"+0.5× luck, 10 min",p:{Luck:.5}},{n:"Ghost Gummy",fx:"+0.5× strength, 10 min",p:{"Dig Strength":.5,"Shake Strength":.5}}];
// Sun Blessing (Pharaoh's Pan / Shovel passive): one charge meter, counted once, and only with both pieces on
const sunGear=S=>{const pan=G.pans.find(x=>x.name===S.pan),sh=G.shovels.find(x=>x.name===S.shovel);const has=x=>x&&/Sun Blessing/i.test((x.passive||"")+" "+(x.description||""));return [has(pan)?S.pan:"",has(sh)?S.shovel:""].filter(Boolean)};
// the bar only fills with both Pharaoh pieces on (pan and shovel)
const sunOn=S=>!S.noSun&&(sunGear(S).length>1||!!S.sunKeep);
// streak enchants, counted at a full perfect-dig streak while the tick is on: Rhythmic up to 1.3× luck, Non Euclidean up to 2× capacity
const STREAK={"Rhythmic":["Luck",.3],"Non Euclidean":["Capacity",1]};
const rhyOn=S=>!!STREAK[S.shEn]&&S.rhy!==false;
function compute(S0){const S=S0||window.S;
  const base=Object.fromEntries(STATS.map(s=>[s,0]));let luckMult=1,totemMult=1,toolLuck=0;const notes=[];
  const pan=G.pans.find(x=>x.name===S.pan),sh=G.shovels.find(x=>x.name===S.shovel);
  const EN=(P.ench||{pan:[],shovel:[]});const pe=EN.pan.find(e=>e.n===S.panEn),se=EN.shovel.find(e=>e.n===S.shEn);
  if(pan){const pm=k=>pe&&pe.m[k]?pe.m[k]:1;base.Luck+=(num(pan.luck)||0)*pm("Luck");base.Capacity+=(num(pan.capacity)||0)*pm("Capacity");base["Shake Strength"]+=(num(pan.strength)||0)*pm("Shake Strength");const sp=String(pan.speed).includes("%")?num(pan.speed):(num(pan.speed)||0)*100;base["Shake Speed"]+=sp;
    if(pe)Object.entries(pe.a).forEach(([k,v])=>{if(k in base)base[k]+=v});
    const p=passive(pan.passive);Object.entries(p.o).forEach(([k,v])=>base[k]+=v);toolLuck+=p.lm-1;if(/totem/i.test(pan.passive||""))notes.push(`${pan.name} also boosts totems (not counted).`)}
  if(sh){base["Dig Strength"]+=num(sh.strength)||0;base["Dig Speed"]+=(num(sh.speed)||0)*100;base.Toughness=(num(sh.toughness)||0)+(se&&se.tough?se.tough:0);if(se&&!se.tough&&!STREAK[se.n])notes.push(`${se.n}: ${se.d}`);const p=passive(sh.passive);toolLuck+=p.lm-1;if(/25% buffs from Totems/i.test(sh.passive||""))totemMult=1.25}
  // Embalmer's Salt: +0.25% sell value per item panned, up to +100%. Counted as maxed out, added like gear.
  if(S.trinket==="Embalmer's Salt")base["Sell Boost"]+=100;
  SLOTDEF.forEach(([k])=>{const v=S.slots[k];if(!v||!v.n)return;const x=EQB[v.n];if(!x)return;const mu=MUT[v.m||"None"]||MUTS[0];x.st.forEach(s=>{const n=s[0];if(!(n in base))return;base[n]+=eqVal(s,(v.l==="5"||v.l==="0"?"5":"6"),v.q??100,mu[1])});Object.entries(mu[2]).forEach(([n,a])=>base[n]+=a)});
  // at night, pieces with Night Luck (Dullahan's Curse) add it to their luck, scaled by stars, roll and mutation like any stat
  if(S.b.night)SLOTDEF.forEach(([k])=>{const v=S.slots[k];if(!v||!v.n)return;const x=EQB[v.n];if(!x)return;const s=x.st.find(s=>s[0]==="Night Luck");if(!s)return;const mu=MUT[v.m||"None"]||MUTS[0];base.Luck+=eqVal(s,(v.l==="5"||v.l==="0"?"5":"6"),v.q??100,mu[1])});
  const flat=Object.fromEntries(STATS.map(s=>[s,0]));flat.Luck=Math.max(0,+S.n.flatLuck||0);
  // permanent quest luck (flat points): Lighthouse +3, Ancient +5, Spirits +50, Dredge Master +3 a quest, login Experience +5 a point
  flat.Luck+=(S.b.lighthouse?3:0)+(S.b.ancient?5:0)+(S.b.spirits?50:0)+3*Math.max(0,+S.n.dredge||0)+5*Math.max(0,+S.n.xp||0)+(TOMB[+S.n.tomb||0]||0);flat["Dig Strength"]=Math.max(0,+S.n.flatDig||0);
  // Trader's Recommendation: permanent quest reward, +20 flat Sell Boost. Almost everyone has it, so it's on unless unticked.
  if(S.b.trader!==false)flat["Sell Boost"]+=20;
  const pile=Object.fromEntries(STATS.map(s=>[s,0]));
  // Nebula Pan and Starcrusher "1.1× additional Luck": +0.1× on the luck boost pile, like other boosts
  pile.Luck+=toolLuck;const mt=musTotals(S);Object.entries(mt.t).forEach(([k,v])=>{if(k in pile)pile[k]+=v});
  const b=S.b;
  // potions add flat points (their % lines go straight onto the % stats)
  (S.pots||[]).forEach(pn=>{const p=((P.x2||{}).potions||[]).find(x=>x.n===pn);if(!p)return;String(p.fx).replace(/\([^)]*\)\s*$/,"").split(/,\s*/).forEach(part=>{const m=part.match(/^\+?(-?[\d.,]+)(%?)\s+(.+)$/);if(!m)return;let k=m[3].trim().replace(/Walkspeed|WalkSpeed/i,"Walk Speed");k=STATS.find(s=>s.toLowerCase()===k.toLowerCase())||k;if(k in flat)flat[k]+=parseFloat(m[1].replace(/,/g,""))})});
  if(b.purity)pile.Luck+=1;
  if(b.vet)pile.Luck+=0.25;
  const RU=S.runes||[];if(RU.includes("Speed I"))flat["Walk Speed"]+=2;if(RU.includes("Mountain Climber"))flat["Walk Speed"]+=3;
  // Bunny: +5% Modifier Boost for every point of bonus Jump Power (gear), like Summit Seeker does with Walk Speed
  if(RU.includes("Bunny")){const jb=Math.max(0,base["Jump Power"]+flat["Jump Power"]);flat["Modifier Boost"]+=5*jb}
  if(RU.includes("Summit Seeker")){const wb=Math.max(0,base["Walk Speed"]+flat["Walk Speed"]);flat["Dig Speed"]+=5*wb;flat["Shake Speed"]+=5*wb}
  RU.filter(n=>/Critical|Annihilation|Discovery|Explorer|Eternity|Singularity|Volcanic|Seeker/.test(n)).forEach(n=>{const r=((P.x2||{}).runes||[]).find(x=>x.n===n);if(r)notes.push(`${n}: ${r.d}`)});
  if(S.totemKeep)totemMult=S.totemKeep; // breakdown: the shovel's totem bonus is credited to the totem lines
  if(b.luckTotem)pile.Luck+=1*totemMult;
  if(b.strTotem){pile["Dig Strength"]+=1*totemMult;pile["Shake Strength"]+=1*totemMult}
  if(b.lumTotem){pile.Capacity+=.5*totemMult;flat["Shake Speed"]+=50;flat["Dig Speed"]+=50}
  const ft=Math.min(19,Math.floor(+S.n.friendTotem));if(ft>=0)pile.Luck+=(0.4+0.2*ft)*totemMult;
  pile.Luck+=Math.max(0,Math.min(.5,.1*(+S.n.friends||0)))+(b.sun?.2:0)+(b.solo?.2:0)+(+S.n.mastery||0);
  // Sun Blessing at full charge (assumed): +2× luck, +100% dig/shake speed, +0.4× capacity
  if(!S.noSun&&!S.sunKeep&&sunGear(S).length===1)notes.push("Sun Blessing needs both the Pharaoh's Pan and the Pharaoh's Shovel, so it isn't counted with just one.");
  if(sunOn(S)){pile.Luck+=2;pile["Dig Speed"]+=1;pile["Shake Speed"]+=1;pile.Capacity+=.4}
  // Rhythmic shovel enchant at a full perfect-dig streak (assumed when ticked)
  if(rhyOn(S)){const [st,v]=STREAK[S.shEn];pile[st]+=v}
  if(b.daily)pile.Luck+=1;if(b.dailyStr)pile["Dig Strength"]+=1;
  if(b.empower){pile.Luck+=.4;pile.Capacity+=.4}
  if(b.egg){pile.Luck+=.5;pile.Capacity+=.5;pile["Modifier Boost"]+=.5;pile["Walk Speed"]+=.5}
  (S.cons||[]).forEach(cn=>{const c=CONS.find(x=>x.n===cn);if(c)Object.entries(c.p).forEach(([k,v])=>pile[k]+=v)});
  if(b.cookie)STATS.forEach(s=>{if(!["Toughness","Inventory Size"].includes(s))pile[s]+=1});
  // luck trinkets
  if(S.trinket==="Nomad's Compass"&&!S.nomadOff)luckMult*=1.9;  // stacked: 6 deposits × +15%, multiplies total luck (nomadOff: not stacked, counts as nothing)
  if(S.trinket==="Senet Die")luckMult*=1.33;         // x0.5–x3 per full pan, counted as ×1.33
  let trk=null;if(TRROLL[S.trinket]){const cap=(base.Capacity+flat.Capacity)*(1+pile.Capacity),mb=(base["Modifier Boost"]+flat["Modifier Boost"])*(1+pile["Modifier Boost"]);
    trk=trkLuck(S.trinket,cap,mb,!!S.trkMax);if(S.trkFix!=null)trk.luck=S.trkFix;base.Luck+=trk.luck}
  let ev=1;if(b.meteor)ev*=2;if(b.weather)ev*=1.5;
  const tot={};STATS.forEach(s=>{tot[s]=["Toughness","Inventory Size"].includes(s)?base[s]+flat[s]:(base[s]+flat[s])*(1+pile[s])});
  tot.Luck*=ev*luckMult;
  if((S.runes||[]).includes("Equalizer")){const a=(tot["Dig Speed"]+tot["Shake Speed"])/2;tot["Dig Speed"]=a;tot["Shake Speed"]=a}
  return {base,flat,pile,tot,ev,luckMult,mt,notes,trk,totemMult,toughness:base.Toughness}}
// ---- isolate parts: which groups count, and what each single part adds ----
const GROUPS=[["tools","Tools"],["jewelry","Jewelry"],["museum","Museum"],["boosts","Boosts"],["events","Events"]];
function strip(st,g){const t=clone(st);
  if(g==="tools"){t.pan="";t.shovel="";t.panEn="";t.shEn="";t.trinket="";t.trkMax=false}
  else if(g==="jewelry"){t.slots={}}
  else if(g==="museum"){t.mus="none"}
  else if(g==="boosts"){const keep={meteor:t.b.meteor,weather:t.b.weather};PERM.forEach(k=>keep[k]=t.b[k]);t.b=keep;t.n={friendTotem:-1,friends:0,mastery:t.n.mastery||0,flatLuck:0,flatDig:0,dredge:t.n.dredge,xp:t.n.xp,tomb:t.n.tomb};t.pots=[];t.runes=[];t.cons=[]}
  else if(g==="events"){t.b=Object.assign({},t.b,{meteor:false,weather:false})}
  return t}
// S.only: null = count everything, otherwise a single part key like "slot:r0", "slot:r0,r1" (same item in several slots) or "group:museum"
function effState(){let t=clone(S);const off=S.isoOff||[];off.forEach(g=>{t=strip(t,g)});
  if(S.only){const keep=S.only;let o=GROUPS.reduce((a,[g])=>strip(a,g),clone(S));
    if(keep.startsWith("group:"))o=Object.assign(o,pick(clone(S),keep.slice(6)));
    else{const [k,v]=keep.split(":");if(k==="pan"){o.pan=S.pan;o.panEn=S.panEn}else if(k==="shovel"){o.shovel=S.shovel;o.shEn=S.shEn}else if(k==="slot"){o.slots={};v.split(",").forEach(x=>{o.slots[x]=S.slots[x]})}}
    t=o}
  return t}
function pick(st,g){if(g==="tools")return {pan:st.pan,shovel:st.shovel,panEn:st.panEn,shEn:st.shEn,trinket:st.trinket,trkMax:st.trkMax};if(g==="jewelry")return {slots:st.slots};if(g==="museum")return {mus:st.mus,museumBoard:st.museumBoard};
  if(g==="boosts")return {b:Object.assign({},st.b,{meteor:false,weather:false}),n:st.n,pots:st.pots,runes:st.runes,cons:st.cons};if(g==="events")return {b:{meteor:st.b.meteor,weather:st.b.weather}};return {}}
function parts(st){const P2=[];if(st.pan)P2.push(["pan:","Pan: "+st.pan+(st.panEn?" ("+st.panEn+")":""),t=>{t.pan="";t.panEn=""}]);
  if(st.shovel)P2.push(["shovel:","Shovel: "+st.shovel+(st.shEn?" ("+st.shEn+")":""),t=>{t.shovel="";t.shEn=""}]);
  // the same item worn in several slots is one source: "Gold Ring ×3", worked out by taking all of them off together
  const worn=new Map();SLOTDEF.forEach(([k,l])=>{const v=(st.slots||{})[k];if(v&&v.n){if(!worn.has(v.n))worn.set(v.n,[]);worn.get(v.n).push([k,l])}});
  worn.forEach((ks,n)=>P2.push(["slot:"+ks.map(x=>x[0]).join(","),ks.length>1?n+" ×"+ks.length:ks[0][1]+": "+n,t=>{t.slots=Object.assign({},t.slots);ks.forEach(([k])=>delete t.slots[k])}]));
  if(st.mus!=="none")P2.push(["group:museum","Museum",t=>{t.mus="none"}]);
  P2.push(["group:boosts","Boosts (totems, runes, potions, cookie…)",t=>Object.assign(t,strip(t,"boosts"))]);
  if(st.b&&(st.b.meteor||st.b.weather))P2.push(["group:events","Events",t=>{t.b=Object.assign({},t.b,{meteor:false,weather:false})}]);return P2}
const SHOWN=["Luck","Capacity","Size Boost","Modifier Boost","Sell Boost","Dig Strength","Shake Strength","Dig Speed","Shake Speed","Toughness"];
// Split each stat between its sources so the sources add up to the total.
// Stats multiply (gear × boosts × events), so "how much it drops if you take it away" counts the overlap once per
// source and the rows add up to more than the total. Instead each source gets its Shapley share: what it adds on
// average over every order the sources could be added in. Exact for up to 12 sources, a fixed sample above that.
function shares(base,full){const P=parts(base),n=P.length,memo=new Map();
  const val=m=>{let r=memo.get(m);if(r)return r;const t=clone(base);P.forEach((p,i)=>{if(!(m>>i&1))p[2](t)});r=compute(t).tot;memo.set(m,r);return r};
  const phi=P.map(()=>Object.fromEntries(SHOWN.map(s=>[s,0]))),all=(1<<n)-1;
  const addMarg=(i,m,w)=>{const a=val(m|1<<i),b=val(m);SHOWN.forEach(s=>{phi[i][s]+=w*((a[s]||0)-(b[s]||0))})};
  if(n<=12){const fact=[1];for(let k=1;k<=n;k++)fact[k]=fact[k-1]*k;
    for(let m=0;m<=all;m++){let c=0;for(let x=m;x;x&=x-1)c++;const w=fact[c]*fact[n-c-1]/fact[n];for(let i=0;i<n;i++)if(!(m>>i&1))addMarg(i,m,w)}}
  else{let seed=12345;const rnd=()=>{seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296};
    const N=400;for(let k=0;k<N;k++){const o=[...Array(n).keys()];for(let i=n-1;i>0;i--){const j=Math.floor(rnd()*(i+1));[o[i],o[j]]=[o[j],o[i]]}
      let m=0;o.forEach(i=>{addMarg(i,m,1/N);m|=1<<i})}}
  const rows=P.map(([key,label],i)=>{const d={};SHOWN.forEach(s=>{if(Math.abs(phi[i][s])>1e-6)d[s]=phi[i][s]});return {key,label,d}});
  // whatever you'd have with none of these sources
  const zero=val(0),bd={};SHOWN.forEach(s=>{if(Math.abs(zero[s]||0)>1e-6)bd[s]=zero[s]});rows.push({key:null,label:"Base (without any of these)",d:bd});
  return rows.filter(x=>Object.keys(x.d).length)}
// ---- detailed breakdown: every stat is flat points × a multiplier; each source shows what it adds to either side ----
// One line per source: every ring on its own line, every museum display, every potion, totem and rune.
// Each line is "what changes if you take just that away"; anything left over (two sources boosting each other) is shown as "Combined effect".
const TMB=B=>{const sh=G.shovels.find(x=>x.name===B.shovel);return sh&&/25% buffs from Totems/i.test(sh.passive||"")?1.25:1};
// rune switches (S.b.sun etc.) and the runes they stand for, so the breakdown names the rune instead of "sun"
const RUNEFLAG={Sunblessed:"sun",Abyssal:"sun",Solitude:"solo",Purity:"purity",Veteran:"vet"};
const runeCovers=(B,k)=>(B.runes||[]).some(n=>RUNEFLAG[n]===k);
const BLAB={sun:"Sunblessed / Abyssal rune",solo:"Solitude rune",purity:"Purity rune",vet:"Veteran rune",trader:"Trader's Recommendation",lighthouse:"Lighthouse Blessing",ancient:"Ancient Blessing",spirits:"Blessing of the Spirits",daily:"Daily login luck",dailyStr:"Daily login strength",empower:"Empowering sluice",egg:"Easter Sluice (Egg Hunter)"};
function brkSources(B){const L=[];const sunB=sunOn(B);const lab=k=>{if(BLAB[k])return BLAB[k];const e=document.querySelector(`[data-b="${k}"]`);return e?e.parentElement.textContent.trim():k};
  if(B.pan){if(B.panEn)L.push({key:"pan:",label:`Pan enchant: ${B.panEn}`,cut:t=>{t.panEn=""}});L.push({key:"pan:",label:"Pan: "+B.pan,cut:t=>{t.pan="";t.panEn="";if(sunB)t.sunKeep=true},minus:B.panEn?0:null})}
  if(B.shovel){if(B.shEn)L.push({key:"shovel:",label:STREAK[B.shEn]?`${B.shEn} (${rhyOn(B)?"Assuming a full streak":"streak off"})`:`Shovel enchant: ${B.shEn}`,cut:t=>{t.shEn=""}});const tmB=compute(B).totemMult;L.push({key:"shovel:",label:"Shovel: "+B.shovel,cut:t=>{t.shovel="";t.shEn="";if(sunB)t.sunKeep=true;if(tmB!==1)t.totemKeep=tmB},minus:B.shEn?0:null})}
  if(TRROLL[B.trinket]||B.trinket==="Nomad's Compass"||B.trinket==="Senet Die")L.push({key:"pan:",label:"Trinket: "+(B.trinket==="Nomad's Compass"?"Nomad's Compass (×1.9, Assuming 6 deposits stacked)":B.trinket==="Senet Die"?"Senet Die (Assuming ×1.33)":`${B.trinket} (Assuming the ${B.trkMax?"max":"average"} roll)`),cut:t=>{t.trinket=""}});
  if(B.trinket==="Embalmer's Salt")L.push({key:"pan:",label:"Trinket: Embalmer's Salt (Assuming it's maxed)",cut:t=>{t.trinket=""}});
  if(sunOn(B)){const g=sunGear(B);L.push({key:g[0]===B.shovel&&g.length===1?"shovel:":"pan:",label:"Sun Blessing (Assuming it's charged)",cut:t=>{t.noSun=true}})}
  SLOTDEF.forEach(([k,l])=>{const v=(B.slots||{})[k];if(v&&v.n)L.push({key:"slot:"+k,label:`${l}: ${v.n}`,sub:[v.l==="0"?"0★":v.l==="5"?"5★":"6★",v.m&&v.m!=="None"?v.m:"",(v.q??100)<100?(v.q??100)+"%":""].filter(Boolean).join(", "),cut:t=>{t.slots=Object.assign({},t.slots);delete t.slots[k]}})});
  const bd=B.mus!=="none"?musBoard(B):null;
  if(bd)MORDER.forEach(r=>(bd[r]||[]).forEach((sl,i)=>{if(!sl||!sl.m)return;const u=sl.u||"None";
    L.push({key:"group:museum",label:`Museum: ${sl.m==="Any"?"Any "+r:sl.m}`,sub:[sl.m==="Any"?"":r,u==="None"?"":u].filter(Boolean).join(", "),cut:t=>{const b2=JSON.parse(JSON.stringify(musBoard(t)||{}));if(b2[r]&&b2[r][i])b2[r][i]={m:null,u:"None"};t.mus="custom";t.museumBoard=b2}})}));
  Object.entries(B.b||{}).forEach(([k,v])=>{if(!v||k==="meteor"||k==="weather"||k==="trader"||runeCovers(B,k))return;L.push({key:"group:boosts",label:lab(k),sub:/Totem$/.test(k)&&TMB(B)!==1?`incl. the shovel's +${fmt((TMB(B)-1)*100,0)}% totem bonus`:"",cut:t=>{t.b=Object.assign({},t.b,{[k]:false})}})});
  (B.pots||[]).forEach(n=>L.push({key:"group:boosts",label:"Potion: "+n,cut:t=>{t.pots=(t.pots||[]).filter(x=>x!==n)}}));
  (B.cons||[]).forEach(n=>L.push({key:"group:boosts",label:"Consumable: "+n,cut:t=>{t.cons=(t.cons||[]).filter(x=>x!==n)}}));
  (B.runes||[]).forEach(n=>L.push({key:"group:boosts",label:"Rune: "+n,cut:t=>{t.runes=(t.runes||[]).filter(x=>x!==n);const f=RUNEFLAG[n];if(f&&!runeCovers(t,f))t.b=Object.assign({},t.b,{[f]:false})}}));
  const n=B.n||{};
  if(+n.friendTotem>=0)L.push({key:"group:boosts",label:`Friendship Totem (${+n.friendTotem} nearby)`,sub:TMB(B)!==1?`incl. the shovel's +${fmt((TMB(B)-1)*100,0)}% totem bonus`:"",cut:t=>{t.n=Object.assign({},t.n,{friendTotem:-1})}});
  if(+n.friends>0)L.push({key:"group:boosts",label:`${+n.friends} friend${+n.friends===1?"":"s"} online`,cut:t=>{t.n=Object.assign({},t.n,{friends:0})}});
  if(+n.mastery>0)L.push({key:"group:boosts",label:"Location mastery",cut:t=>{t.n=Object.assign({},t.n,{mastery:0})}});
  if(B.b.trader!==false)L.push({key:"group:boosts",label:"Trader's Recommendation",cut:t=>{t.b=Object.assign({},t.b,{trader:false})}});
  if(+n.dredge>0)L.push({key:"group:boosts",label:`Dredge Master (${fmt(+n.dredge,0)} quests)`,cut:t=>{t.n=Object.assign({},t.n,{dredge:0})}});
  if(+n.tomb>0)L.push({key:"group:boosts",label:`Tomb Mastery ${n.tomb}`,cut:t=>{t.n=Object.assign({},t.n,{tomb:0})}});
  if(+n.xp>0)L.push({key:"group:boosts",label:`Login Experience (${fmt(+n.xp,0)} points)`,cut:t=>{t.n=Object.assign({},t.n,{xp:0})}});
  if(+n.flatLuck>0)L.push({key:"group:boosts",label:"Other flat luck",cut:t=>{t.n=Object.assign({},t.n,{flatLuck:0})}});
  if(+n.flatDig>0)L.push({key:"group:boosts",label:"Flat dig strength",cut:t=>{t.n=Object.assign({},t.n,{flatDig:0})}});
  if(B.b&&B.b.meteor)L.push({key:"group:events",label:"Meteor shower",cut:t=>{t.b=Object.assign({},t.b,{meteor:false})}});
  if(B.b&&B.b.weather)L.push({key:"group:events",label:"Weather event",cut:t=>{t.b=Object.assign({},t.b,{weather:false})}});
  return L}
// how much detail: 0 just stats, 1 semi (flat × multiplier = total), 2 full breakdown. Old saves: "show breakdown" off = 0
const brkLvl=()=>S.brkLevel!=null?+S.brkLevel:0;
const LVLN=["Just stats","Semi","Full breakdown"];
// multiplier lines: small museum bonuses (a Common display's +0.005×) need more than 2 decimals; trailing zeros are dropped
const mxf=v=>v>=100?fmt(v,2):String(+v.toFixed(4));
// only stats that boosts multiply; Walk Speed, Jump Power, Inventory Size and Toughness are just added up, so a breakdown says nothing
const BRK_STATS=["Luck","Capacity","Size Boost","Modifier Boost","Sell Boost","Dig Strength","Shake Strength","Dig Speed","Shake Speed"];
const FLAT_ONLY=new Set(["Toughness","Inventory Size"]);
// per-stat breakdown data, shared by the page and the saved image
// returns [{s,flatT,mult,xm,total,F:[{x,v}],M:[{x,v}],X:[{x,v}]}] for every stat you have that isn't switched off
function brkData(B){const R=compute(B);
  // the Umbrella / Reactor luck is credited to the trinket alone: other lines keep it fixed, so a capacity
  // source doesn't also claim the luck the Reactor gets from that capacity
  const src=brkSources(B).map(x=>{const t=clone(B);if(R.trk)t.trkFix=R.trk.luck;x.cut(t);if(!t.trinket)delete t.trkFix;return {...x,W:compute(t)}});
  src.forEach((x,i)=>{if(x.minus===0)x.minusOf=src[i-1]});
  const fl=(o,s)=>(o.base[s]||0)+(o.flat[s]||0),hide=new Set(S.brkHide||[]);
  const stats=BRK_STATS.filter(s=>(Math.abs(R.tot[s]||0)>1e-9||s==="Luck")&&!hide.has(s));
  const out=stats.map(s=>{const fo1=FLAT_ONLY.has(s),flatT=fl(R,s),mult=fo1?1:1+(R.pile[s]||0);const F=[],M=[],X=[];let fSum=0,mSum=0;
    src.forEach(x=>{let df=flatT-fl(x.W,s),dm=fo1?0:(R.pile[s]||0)-(x.W.pile[s]||0);
      if(x.minusOf){df-=flatT-fl(x.minusOf.W,s);dm-=fo1?0:(R.pile[s]||0)-(x.minusOf.W.pile[s]||0)}
      if(Math.abs(df)>1e-9){F.push({x,v:df});fSum+=df}if(Math.abs(dm)>1e-9){M.push({x,v:dm});mSum+=dm}
      if(s==="Luck"){const re=R.ev/(x.W.ev||1),rl=R.luckMult/(x.W.luckMult||1);if(Math.abs(re-1)>1e-9)X.push({x,v:re});if(Math.abs(rl-1)>1e-9)X.push({x,v:rl})}});
    const ov={label:"Combined effect",sub:"two of your things working together, e.g. Mass Reactor luck that comes from your capacity"};
    if(Math.abs(flatT-fSum)>1e-6)F.push({x:ov,v:flatT-fSum});if(!fo1&&Math.abs(mult-1-mSum)>1e-6)M.push({x:ov,v:mult-1-mSum});
    F.sort((a,b)=>b.v-a.v);M.sort((a,b)=>b.v-a.v);
    return {s,flatT,mult,xm:s==="Luck"?(R.ev||1)*(R.luckMult||1):1,total:R.tot[s]||0,F,M,X,fo1}});
  return {R,src,stats:out}}
function renderParts(){const B=clone(S);(S.isoOff||[]).forEach(g=>Object.assign(B,strip(B,g)));const D=brkData(B);
  const tv=(s,v)=>PCT.has(s)?fmt(v,1)+"%":fmt(v,s==="Luck"||s==="Capacity"?0:1);
  const sv=(s,v)=>(v<0?"−":"+")+tv(s,Math.abs(v));
  const row=(x,txt,neg)=>`<div class="pt${x.key&&S.only===x.key?" on":""}"${x.key?` role="button" tabindex="0" data-only="${esc(x.key)}" aria-pressed="${S.only===x.key}"`:""}><b>${esc(x.label)}${x.sub?` <small>${esc(x.sub)}</small>`:""}</b><span class="lk2" style="color:${neg?"var(--neg,#c53030)":"var(--accent)"}">${txt}</span></div>`;
  const lv=brkLvl();
  const cards=lv===1?D.stats.map(({s,flatT,mult,xm,total,fo1})=>`<div class="bks bksemi"><div class="bkst"><b style="color:${statHex(s)}">${esc(s)}</b></div><div class="sem"><div><small>Flat points</small><b>${tv(s,flatT)}</b></div><div><small>Multiplier</small><b>${fo1?"-":"×"+mxf(mult)}</b></div>${xm!==1?`<div><small>Events &amp; tools</small><b>×${fmt(xm,2)}</b></div>`:""}<div class="semt"><small>Total</small><b style="color:${statHex(s)}">${tv(s,total)}</b></div></div></div>`).join(""):D.stats.map(({s,flatT,mult,xm,total,F,M,X,fo1})=>{
    const formula=fo1||(mult===1&&xm===1)?"":`${tv(s,flatT)} × ${mxf(mult)}${xm!==1?` × ${fmt(xm,2)}`:""} = `;
    return `<div class="bks"><div class="bkst"><b style="color:${statHex(s)}">${esc(s)}</b><span>${formula}<em>${tv(s,total)}</em></span></div>
      <div class="bksub"><span>Flat points</span><span>${tv(s,flatT)}</span></div>${F.length?F.map(o=>row(o.x,sv(s,o.v),o.v<0)).join(""):'<p class="bkn">None</p>'}
      ${fo1||!M.length?"":`<div class="bksub"><span>Multiplier (from ×1)</span><span>×${mxf(mult)}</span></div>${M.map(o=>row(o.x,(o.v<0?"−":"+")+mxf(Math.abs(o.v))+"×",o.v<0)).join("")}`}
      ${X.length?`<div class="bksub"><span>Multiplies the total</span><span>×${fmt(xm,2)}</span></div>${X.map(o=>row(o.x,"×"+fmt(o.v,2),o.v<1)).join("")}`:""}</div>`}).join("");
  $("parts").innerHTML=D.src.length||Math.abs(D.R.tot.Luck||0)>0?(cards||'<p class="hint">Every stat is switched off. Turn some on in the Breakdown column of Your stats.</p>'):'<p class="hint">Add some gear or boosts to see where your stats come from.</p>';
  $("brkLvl").value=String(lv);$("brkLvl").setAttribute("aria-valuetext",LVLN[lv]);document.querySelectorAll("[data-lvl]").forEach(b=>b.classList.toggle("on",+b.dataset.lvl===lv));
  $("brkBody").hidden=lv===0;$("parts").classList.toggle("semi",lv===1)}
document.addEventListener("click",e=>{const b=e.target.closest("[data-bstat]");if(!b)return;const h=new Set(S.brkHide||[]);const k=b.dataset.bstat;h.has(k)?h.delete(k):h.add(k);S.brkHide=[...h];save();render()});
// Discord ANSI colors for compact copies ONLY. Full breakdown stays Markdown.
const STAT_ANSI={
  "Modifier Boost":"2;32", // dark green
  "Luck":"1;33",
  "Capacity":"1;35",
  "Size Boost":"1;36",
  "Sell Boost":"1;34",
  "Dig Strength":"1;31",
  "Shake Strength":"1;33",
  "Dig Speed":"1;36",
  "Shake Speed":"1;35",
  "Walk Speed":"1;34",
  "Jump Power":"1;32",
  "Inventory Size":"1;37",
  "Toughness":"1;31"
};
function discordCompactAnsi(lines){
  const esc="\u001b[",reset=esc+"0m";
  const colored=lines.map((line,i)=>{
    if(i===0)return esc+"1;37m"+line.replace(/\*\*/g,"")+reset;
    if(line.startsWith("Pan:"))return esc+"0;37m"+line+reset;
    const stat=Object.keys(STAT_ANSI).find(name=>line.startsWith("**"+name+":**"));
    if(!stat)return line;
    const color=STAT_ANSI[stat]||"0;37";
    return esc+color+"m"+line.replace("**"+stat+":**",stat+":").replace(/\*\*/g,"")+reset;
  });
  return "```ansi\n"+colored.join("\n")+"\n```";
}
const ANSI={Luck:32,Capacity:33,"Size Boost":31,"Modifier Boost":36,"Sell Boost":33,"Dig Strength":31,"Shake Strength":35,"Dig Speed":34,"Shake Speed":35,"Walk Speed":37,"Jump Power":32,"Inventory Size":37,Toughness:37};
$("brkLvl").addEventListener("input",()=>{S.brkLevel=+$("brkLvl").value;save();renderParts()});
document.addEventListener("click",e=>{const b=e.target.closest("[data-lvl]");if(!b)return;S.brkLevel=+b.dataset.lvl;save();renderParts()});
function renderIso(){const off=S.isoOff||[];$("isoChips").innerHTML=GROUPS.map(([g,l])=>`<button type="button" class="chip" data-iso="${g}" aria-pressed="${!off.includes(g)&&!S.only}">${l}</button>`).join("");
  const n=$("isoNote");if(S.only){const lbl=(parts(S).find(p=>p[0]===S.only)||[0,"that part"])[1];n.hidden=false;n.innerHTML=`Showing only <b>${esc(lbl)}</b>. <button type="button" class="rst" data-only-clear>Show everything</button>`}else if(off.length){n.hidden=false;n.textContent="Left out: "+off.map(g=>GROUPS.find(x=>x[0]===g)[1]).join(", ")+"."}else n.hidden=true}
document.addEventListener("click",e=>{const c=e.target.closest("[data-iso]");if(c){S.only=null;const g=c.dataset.iso;const off=new Set(S.isoOff||[]);off.has(g)?off.delete(g):off.add(g);S.isoOff=[...off];save();render();return}
  if(e.target.closest("[data-only-clear]")){S.only=null;save();render();return}
  const p=e.target.closest("[data-only]");if(p){S.only=S.only===p.dataset.only?null:p.dataset.only;save();render();return}
  const r=e.target.closest("[data-reset]");if(r){if(!r.classList.contains("arm")){r.classList.add("arm");r.textContent="Sure?";setTimeout(()=>{r.classList.remove("arm");r.textContent="Reset"},2500);return}resetGroup(r.dataset.reset);return}});
document.addEventListener("keydown",e=>{const p=e.target.closest&&e.target.closest("[data-only]");if(p&&(e.key==="Enter"||e.key===" ")){e.preventDefault();p.click()}});
function resetGroup(g){if(g==="tools"){S.pan="";S.shovel="";S.panEn="";S.shEn=""}else if(g==="jewelry"){S.slots={}}else if(g==="museum"){S.mus="none";S.museumBoard=null}
  else if(g==="boosts"){const kb={};PERM.forEach(k=>{if(k in S.b)kb[k]=S.b[k]});S.b=kb;S.n={friendTotem:-1,friends:0,mastery:S.n.mastery||0,flatLuck:0,flatDig:0,dredge:S.n.dredge,xp:S.n.xp,tomb:S.n.tomb};S.pots=[];S.runes=[];S.cons=[]}S.only=null;save();all()}
$("resetAll").onclick=()=>{const b=$("resetAll");if(!b.classList.contains("arm")){b.classList.add("arm");b.textContent="Reset everything?";setTimeout(()=>{b.classList.remove("arm");b.textContent="Reset everything"},2500);return}
  ["tools","jewelry","museum","boosts"].forEach(g=>resetGroup(g));S.isoOff=[];S.only=null;S.owned=false;b.classList.remove("arm");b.textContent="Reset everything";save();all()};
// ---- what to upgrade next ----------------------------------------------------
// Tries every pan, shovel and piece of equipment in your slots, works out what each one would add to the goal you
// pick, and what it would cost: money from the shop, or the minerals you'd have to farm (turned into pans with the
// same luck model as Luck Odds). Equipment is compared at 6★ and 100% quality, which is the best it can roll.
const UGOALS=[["Luck",{Luck:1}],["Capacity",{Capacity:1}],["Modifier Boost",{"Modifier Boost":1}],["Size Boost",{"Size Boost":1}],["Luck + Size",{Luck:1,"Size Boost":1}],
  ["Selling",{"Sell Boost":1,"Size Boost":.5,Luck:.3}],["Speed",{"Dig Speed":1,"Shake Speed":1,"Dig Strength":.5,"Shake Strength":.5}],
  ["Everything",{Luck:1,Capacity:1,"Size Boost":.6,"Modifier Boost":.6,"Sell Boost":.4,"Dig Speed":.3,"Shake Speed":.3}]];
// drop model, same as Luck Odds: how often each mineral comes up in each zone
const ULOC={};P.mins.forEach(m=>(m.ch||[]).forEach(c=>{const l=c[0];const p=parseFloat(String(c[1]).replace(/[%,]/g,""))/100;if(!(p>0))return;(ULOC[l]=ULOC[l]||[]).push({m,p})}));
function uList(loc){const b=baseLoc(loc),own=ULOC[loc]||[];let out;
  if(b!==loc&&ULOC[b])out=ULOC[b].filter(x=>!own.some(y=>y.m===x.m)).concat(own);
  else if(own.length<2){const seen=new Set();out=[];Object.keys(ULOC).filter(v=>v!==loc&&baseLoc(v)===loc).forEach(v=>ULOC[v].concat(own).forEach(x=>{if(!seen.has(x.m)){seen.add(x.m);out.push(x)}}))}
  else out=[...own];
  return out.length<2?[]:out}
let UPANS=null,UPANSKEY="";
// expected pans to get one of a mineral, at your luck and capacity, in the zone where it comes up most
function pansFor(name){const L=Math.max(1,compute(effState()).tot.Luck||1),cap=Math.max(1,+S.n.cap||+S.cap||1);
  const n=panItems(ucap());const key=Math.round(L)+"|"+Math.round(n*100);
  if(UPANSKEY!==key){UPANSKEY=key;UPANS={};
    Object.keys(ULOC).forEach(loc=>{if(/^The Void/.test(loc))return;const list=uList(loc).sort((a,b)=>a.p-b.p);const tot=list.reduce((s,x)=>s+x.p,0);let c=0;
      const f=(lo,hi,l)=>Math.pow(1-lo,l)-Math.pow(1-hi,l);
      list.forEach(x=>{const [lo,hi,sn]=tieSpan(list,x,tot);
        const eff=(.2891*f(lo,hi,1)+.0280*f(lo,hi,Math.max(1,.04317*L))+.1905*f(lo,hi,Math.max(1,.40579*L))+.4924*f(lo,hi,Math.max(1,1.74153*L)))/sn*rareBand(tot/x.p);
        const per=1-Math.pow(1-eff,n);if(per>0)UPANS[x.m.n]=Math.min(UPANS[x.m.n]==null?Infinity:UPANS[x.m.n],1/per)})})}
  return UPANS[name]}
// your pan capacity: the museum and gear feed it, so read it off your own stats
function ucap(){return Math.max(1,compute(effState()).tot.Capacity||1)}
const uMoney=v=>{const n=typeof v==="number"?v:parseFloat(String(v||"").replace(/[^0-9.]/g,""));
  return !isFinite(n)||n<=0?0:n};
const uMoneyTxt=n=>n>=1e12?"$"+fmt(n/1e12,n<1e13?1:0)+"T":n>=1e9?"$"+fmt(n/1e9,n<1e10?1:0)+"B":n>=1e6?"$"+fmt(n/1e6,n<1e7?1:0)+"M":n>=1e3?"$"+fmt(n/1e3,0)+"k":"$"+fmt(n,0);
const uPansTxt=p=>!p?"":p>=1e9?fmt(p/1e9,1)+"B pans":p>=1e6?fmt(p/1e6,1)+"M pans":p>=1e3?fmt(p/1e3,p<1e4?1:0)+"k pans":fmt(p,0)+" pans";
// what the recipe would cost you in pans (unknown minerals are skipped and flagged)
function recipeCost(x){let pans=0,unknown=0;(x.rec||[]).forEach(([q,n])=>{const p=pansFor(n);if(p==null)unknown++;else pans+=q*p});return {pans,unknown}}
const uScore=(tot,w)=>Object.entries(w).reduce((a,[s,k])=>a+k*Math.log(1+Math.max(0,tot[s]||0)),0);
// Custom goal: a weight per stat. Scores use log(1+stat), so a weight is how much a % gain in that stat is worth:
// Luck 2, Capacity 1 means +10% luck counts as much as +20% capacity.
const UCSTATS=["Luck","Capacity","Size Boost","Modifier Boost","Sell Boost","Dig Strength","Shake Strength","Dig Speed","Shake Speed"];
const ucW=()=>{const w=S.upW||{Luck:1};const o={};UCSTATS.forEach(s=>{if(+w[s]>0)o[s]=+w[s]});return Object.keys(o).length?o:{Luck:1}};
function upGoal(){if(S.upGoal==="Custom")return ["Custom",ucW()];const g=UGOALS.find(g=>g[0]===S.upGoal)||UGOALS[0];return g}
function renderUcw(){const el=$("upCustom");const on=S.upGoal==="Custom";el.hidden=!on;if(!on){el.innerHTML="";return}const w=S.upW||{Luck:1};
  el.innerHTML=UCSTATS.map(s=>{const v=+w[s]||0;return `<label><span style="color:${statHex(s)}">${esc(s)}</span><input type="range" min="0" max="5" step="0.5" value="${v}" data-ucw="${esc(s)}" aria-label="${esc(s)} weight"><span class="v${v>0?" on":""}">${v?fmt(v,1).replace(/\.0$/,""):"off"}</span></label>`}).join("")+`<p class="hint" id="ucwH">${ucHint()}</p>`}
function ucHint(){const e=Object.entries(ucW()).sort((a,b)=>b[1]-a[1]);if(e.length<2)return `Only ${esc(e[0][0])} counts. Raise another stat to weigh them against each other.`;
  const [a,b]=[e[0],e[e.length-1]];return `With these weights, +10% ${esc(a[0])} counts as much as +${fmt(10*a[1]/b[1],0)}% ${esc(b[0])}.`}
document.addEventListener("input",e=>{const r=e.target.closest&&e.target.closest("[data-ucw]");if(!r)return;S.upW=Object.assign({Luck:1},S.upW||{},{[r.dataset.ucw]:+r.value});
  const v=r.parentElement.querySelector(".v");v.textContent=+r.value?String(+r.value):"off";v.classList.toggle("on",+r.value>0);$("ucwH").innerHTML=ucHint();save();clearTimeout(window._ucT);window._ucT=setTimeout(renderUpList,150)});
// every swap worth trying, with what it gives and what it costs
// chance an ore gets one particular modifier, at a Modifier Boost (in %) and luck. Same model as Modifier Odds:
// "any modifier" from the boost, then which one from rolls that keep the rarest.
const MODW_C=[["Perfect",.0001],["Lunar",.00025],["Mutated",.001],["Cosmic",.005],["Iridescent",.02],["Irradiated",.1],["Scorching",.25],["Glowing",.5],["Pure",.8],["Shiny",1]];
function modChanceCalc(u,mbPct,luck){const anyMod=ptAnyMod;
  const list=MODW_C.filter(([k])=>k!=="Lunar"||u==="Lunar");if(!list.some(([k])=>k===u))return 0;const tot=list.reduce((a,x)=>a+x[1],0);
  const f=N=>{let a=0;const o={};list.forEach(([k,w2])=>{const p=w2/tot;o[k]=Math.pow(1-a,N)-Math.pow(Math.max(0,1-a-p),N);a+=p});return o};
  const L=Math.max(1,11.662*Math.pow(Math.max(1,mbPct)/100,.838)+1.96352*Math.max(0,luck)/1000),parts=[f(1),f(Math.max(1,L*.172)),f(L)];
  return anyMod(mbPct)*(.313*parts[0][u]+.127*parts[1][u]+.559*parts[2][u])}
function upCandidates(){
  const base=effState(),now=compute(base),w=upGoal()[1];const s0=uScore(now.tot,w);
  const out=[];const add=(c)=>{const t=compute(c.state).tot;const gain=uScore(t,w)-s0;if(gain<=1e-9)return;
    const d={};Object.keys(w).forEach(s=>{const v=(t[s]||0)-(now.tot[s]||0);if(Math.abs(v)>0.01)d[s]=v});
    if(!Object.keys(d).length)return;out.push({...c,gain,d,tot:t})};
  // pans and shovels: straight from the shop
  const limited=p=>/limited/i.test(p.section||"")||!uMoney(p.price);
  G.pans.forEach(p=>{if(p.name===S.pan)return;const st=clone(base);st.pan=p.name;
    add({kind:"Pan",name:p.name,where:p.location,money:uMoney(p.price),pans:0,limited:limited(p),state:st,apply:()=>{S.pan=p.name}})});
  G.shovels.forEach(p=>{if(p.name===S.shovel)return;const st=clone(base);st.shovel=p.name;
    add({kind:"Shovel",name:p.name,where:p.location,money:uMoney(p.price),pans:0,limited:limited(p),state:st,apply:()=>{S.shovel=p.name}})});
  // equipment: the best slot for each piece. Rings can be worn more than once, so a ring you already wear
  // is still suggested for your other ring slots; only the slot that already holds it is skipped.
  const best={};
  SLOTDEF.forEach(([k,label,slot])=>{
    EQ.filter(x=>x.slot===slot).forEach(x=>{
      const cur=S.slots[k]||{};if(cur.n===x.n)return;
      if(ONE_ONLY.has(x.n)&&SLOTDEF.some(([kk])=>kk!==k&&(base.slots[kk]||{}).n===x.n))return;const st=clone(base);st.slots=Object.assign({},st.slots,{[k]:{n:x.n,l:"6",q:100,m:cur.m||"None"}});
      const t=compute(st).tot;const g=uScore(t,w)-s0;if(g<=1e-9)return;
      if(!best[x.n]||g>best[x.n].gain){const c=recipeCost(x);
        best[x.n]={kind:label,replaces:cur.n||"",name:x.n,rarity:x.r,money:x.cur==="$"?uMoney(x.price):0,
          other:x.cur!=="$"?fmt(uMoney(x.price),0)+" "+x.cur:"",limited:!!x.ev,pans:c.pans,unknown:c.unknown,gain:g,
          state:st,apply:()=>{S.slots[k]=Object.assign({},S.slots[k],{n:x.n,l:"6",q:100})},
          recipe:(x.rec||[]).map(([q,n])=>q+"× "+n).join(", ")}}})});
  Object.values(best).forEach(c=>add(c));
  // the same ring in several slots: swap it into every ring slot it beats (weakest first) as one suggestion
  const ringK=SLOTDEF.filter(d=>d[2]==="Ring").map(d=>d[0]);
  EQ.filter(x=>x.slot==="Ring"&&best[x.n]&&!ONE_ONLY.has(x.n)).forEach(x=>{let st=clone(base),sc=s0;const used=[];
    for(;;){let pick=null;ringK.forEach(k=>{const cur=st.slots[k]||{};if(cur.n===x.n)return;const t2=clone(st);t2.slots=Object.assign({},t2.slots,{[k]:{n:x.n,l:"6",q:100,m:cur.m||"None"}});
        const g=uScore(compute(t2).tot,w);if(g>sc+1e-9&&(!pick||g>pick.g))pick={k,g,t2,was:cur.n||"empty"}});
      if(!pick)break;st=pick.t2;sc=pick.g;used.push(pick)}
    if(used.length<2)return;const b1=best[x.n],nn=used.length;
    add({kind:`Rings ×${nn}`,replaces:Object.entries(used.reduce((o,u)=>(o[u.was]=(o[u.was]||0)+1,o),{})).map(([n,c])=>(c>1?c+"× ":"")+n).join(", "),name:`${x.n} ×${nn}`,rarity:x.r,money:(b1.money||0)*nn,other:b1.other?b1.other+` (×${nn})`:"",limited:b1.limited,pans:(b1.pans||0)*nn,unknown:b1.unknown,
      state:st,apply:()=>{used.forEach(u=>{S.slots[u.k]=Object.assign({},S.slots[u.k],{n:x.n,l:"6",q:100})})},recipe:b1.recipe?`${nn}× (${b1.recipe})`:""})});
  // equipment mutations: for each worn piece, the mutation that helps this goal most (no cost counted).
  // Festive needs the Christmas event, so it only shows with "Include event gear".
  const MLIM=new Set(((P.ench||{}).muts||[]).filter(m=>/event/i.test(m.ev||"")).map(m=>m.n));const bestMut={};
  SLOTDEF.forEach(([k,label])=>{const cur=(base.slots||{})[k];if(!cur||!cur.n)return;const curM=cur.m||"None";let bm=null;
    MUTS.forEach(([u])=>{if(u===curM||u==="None"||(MLIM.has(u)&&!S.upEvent))return;const st=clone(base);st.slots=Object.assign({},st.slots,{[k]:Object.assign({},cur,{m:u})});const g=uScore(compute(st).tot,w)-s0;
      if(g>1e-9&&(!bm||g>bm.g))bm={u,g,st}});
    if(!bm)return;const key=cur.n+"|"+curM;if(bestMut[key]&&bestMut[key].gain>=bm.g)return;
    bestMut[key]={kind:`Mutation (${label})`,name:`${bm.u} ${cur.n}`,replaces:curM==="None"?"no mutation":curM,money:0,pans:0,limited:MLIM.has(bm.u),gain:bm.g,state:bm.st,apply:()=>{S.slots[k]=Object.assign({},S.slots[k],{m:bm.u})}}});
  Object.values(bestMut).forEach(c=>add(c));
  // potions and limited consumables you don't have on yet. Halloween and Christmas treats only show with "Include event gear".
  ((P.x2||{}).potions||[]).forEach(po=>{if((base.pots||[]).includes(po.n))return;const st=clone(base);st.pots=[...(base.pots||[]),po.n];
    const m=/\$/.test(po.cost||"")?uMoney(po.cost):0;add({kind:"Potion",name:po.n,where:[po.fx,po.where].filter(Boolean).join(", "),money:m,other:m?"":String(po.cost||"").replace(/Meteor Shards/i,"shards"),pans:0,limited:false,state:st,apply:()=>{S.pots=[...(S.pots||[]),po.n]}})});
  // luck trinkets, Beach Umbrella and Mass Reactor at both the average and the max roll
  [["Beach Umbrella",false],["Beach Umbrella",true],["Mass Reactor",false],["Mass Reactor",true],["Nomad's Compass",false],["Senet Die",false]].forEach(([n,mx])=>{
    if(base.trinket===n&&(!TRROLL[n]||!!base.trkMax===mx))return;const st=clone(base);st.trinket=n;st.trkMax=mx;
    add({kind:"Trinket",name:TRLAB(n,mx),replaces:base.trinket?TRLAB(base.trinket,!!base.trkMax):"",where:n==="Nomad's Compass"?"6 deposits stacked: ×1.9 total luck":n==="Senet Die"?"counted as ×1.33 luck":"",money:0,pans:0,limited:false,state:st,apply:()=>{S.trinket=n;S.trkMax=mx}})});
  if(base.trinket!=="Embalmer's Salt"){const st=clone(base);st.trinket="Embalmer's Salt";add({kind:"Trinket",name:"Embalmer's Salt",replaces:base.trinket||"",where:"maxed out: +100% Sell Boost",money:0,pans:0,limited:false,state:st,apply:()=>{S.trinket="Embalmer's Salt"}})}
  // totems and the XP Cookie (the cookie only comes from Cookie Time and the Christmas shop, so it counts as event)
  [["luckTotem","Luck Totem","2× luck, 300 Meteor Shards"],["strTotem","Strength Totem","2× dig and shake strength, 180 Meteor Shards"],["lumTotem","Luminant Totem","1.5× capacity, +50% speeds, 600 Meteor Shards"],["cookie","XP Cookie","+1× most stats, 1 min",true]].forEach(([k,n,fx,ev])=>{
    if((base.b||{})[k])return;const st=clone(base);st.b=Object.assign({},st.b,{[k]:true});add({kind:ev?"Consumable":"Totem",name:n,where:fx,money:0,pans:0,limited:!!ev,state:st,apply:()=>{S.b[k]=true}})});
  const CEV={"Candy Corn":1,"Ghost Gummy":1,"Gingerbread Cookie":1};
  CONS.forEach(c=>{if((base.cons||[]).includes(c.n))return;const st=clone(base);st.cons=[...(base.cons||[]),c.n];
    add({kind:"Consumable",name:c.n,where:c.fx,money:0,pans:0,limited:!!CEV[c.n],state:st,apply:()=>{S.cons=[...(S.cons||[]),c.n]}})});
  // pan enchants: each one you don't have. Effort = rolls to hit it on the best enchant table (one roll counted as 10 pans),
  // or 1 when there's an Enchant Book for it
  const EN=P.ench||{pan:[]};
  if(base.pan)EN.pan.forEach(e=>{if(e.n===base.panEn)return;const st=clone(base);st.panEn=e.n;const ps=(e.ch||[]).map(x=>parseFloat(x)/100).filter(x=>x>0),best=ps.length?Math.max(...ps):0;
    add({kind:"Pan enchant",name:e.n,replaces:base.panEn||"",where:e.src?e.src:best?`~1 in ${fmt(1/best,0)} rolls`:"",money:0,pans:e.src?0:best?Math.round(10/best):0,unknown:!e.src&&!best,limited:false,state:st,apply:()=>{S.panEn=e.n},enchant:true})});
  // museum: for each rarity row, the best mineral you don't display yet, in that row's emptiest or weakest slot
  // (at full size and no modifier; effort = pans to find one at your luck)
  // no museum yet (or "No museum"): start from an empty one, so its slots still get suggestions
  const mb=(base.mus&&base.mus!=="none"?musBoard(base):null)||blankBoard();
  if(mb){const shown=new Set();MORDER.forEach(r=>(mb[r]||[]).forEach(sl=>{if(sl&&sl.m&&sl.m!=="Any")shown.add(String(sl.m).toLowerCase())}));
    MORDER.forEach(r=>{const row=Array.from({length:MSLOTS[r]},(_,i)=>(mb[r]||[])[i]||{m:null,u:"None"});
      // weakest slot: empty first, else the one whose removal costs the least for this goal
      let wi=row.findIndex(sl=>!sl.m);if(wi<0){let lo=Infinity;row.forEach((sl,i)=>{const b2=JSON.parse(JSON.stringify(mb));b2[r]=row.map((q,j)=>j===i?{m:null,u:"None"}:q);const t2=clone(base);t2.mus="custom";t2.museumBoard=b2;const sc=uScore(compute(t2).tot,w);if(s0-sc<lo){lo=s0-sc;wi=i}})}
      let bestM=null;P.mins.filter(m=>m.r===r&&!shown.has(m.n.toLowerCase())).forEach(m=>{const b2=JSON.parse(JSON.stringify(mb));b2[r]=row.map((q,j)=>j===wi?{m:m.n,u:"None"}:q);const t2=clone(base);t2.mus="custom";t2.museumBoard=b2;
        const g=uScore(compute(t2).tot,w)-s0;if(g>1e-9&&(!bestM||g>bestM.g))bestM={m,g,st:t2,b2}});
      if(!bestM)return;const pn=pansFor(bestM.m.n),was=row[wi].m;
      add({kind:`Museum (${r})`,name:bestM.m.n,replaces:was?(was==="Any"?"Any "+r:was):"",rarity:r,money:0,pans:pn==null?0:pn,unknown:pn==null,limited:false,state:bestM.st,
        apply:()=>{S.mus="custom";S.museumBoard=bestM.b2},where:[pn==null?"not panned":"",base.mus!=="custom"?"Try it copies your museum into a custom one":""].filter(Boolean).join(", ")})})}
  // museum modifiers: for every display, the best modifier for this goal. Effort = pans to find the mineral ÷ the chance it
  // rolls that modifier at your Modifier Boost and luck (same model as Modifier Odds and the farm routes)
  if(mb){const T=compute(base).tot,mbx=Math.max(0,T["Modifier Boost"]||0),lk=T.Luck||0;
    MORDER.forEach(r=>(mb[r]||[]).forEach((sl,i)=>{if(!sl||!sl.m)return;const curU=sl.u||"None";let bestU=null;
      Object.keys(MODS).forEach(u=>{if(u===curU||u==="None"||u==="Lunar")return;const b2=JSON.parse(JSON.stringify(mb));b2[r][i]={m:sl.m,u};const t2=clone(base);t2.mus="custom";t2.museumBoard=b2;
        const ch=modChanceCalc(u,mbx,lk);if(ch<=0&&!S.upEvent)return;const g=uScore(compute(t2).tot,w)-s0;if(g<=1e-9)return;const find=sl.m==="Any"?Math.min(...P.mins.filter(m=>m.r===r).map(m=>pansFor(m.n)).filter(v=>v!=null)):pansFor(sl.m);
        const pn=find!=null&&isFinite(find)&&ch>0?find/ch:null;const c={g,u,pn,st:t2,b2,ch};const val=g;if(!bestU||val>bestU.val)bestU={...c,val}});
      if(!bestU)return;
      // the mineral itself adds nothing to this goal: suggest "Any" of that rarity, so any mineral with the modifier will do
      if(sl.m!=="Any"){const b3=JSON.parse(JSON.stringify(bestU.b2));b3[r][i]={m:"Any",u:bestU.u};const t3=clone(base);t3.mus="custom";t3.museumBoard=b3;
        if(uScore(compute(t3).tot,w)>=uScore(compute(bestU.st).tot,w)-1e-9){const fa=Math.min(...P.mins.filter(m=>m.r===r).map(m=>pansFor(m.n)).filter(v=>v!=null));
          bestU={...bestU,b2:b3,st:t3,any:true,pn:isFinite(fa)&&bestU.ch>0?fa/bestU.ch:bestU.pn}}}
      const nm=bestU.any||sl.m==="Any"?`Any ${r}`:sl.m;
      add({kind:`Museum modifier (${r})`,name:`${bestU.u} ${nm}`,replaces:(bestU.any?sl.m+", ":"")+(curU==="None"?"no modifier":curU),rarity:r,money:0,pans:bestU.pn==null?0:bestU.pn,unknown:bestU.pn==null,limited:false,state:bestU.st,
        apply:()=>{S.mus="custom";S.museumBoard=bestU.b2},where:[bestU.ch>0?`${bestU.u} on ~1 in ${fmt(1/bestU.ch,0)} ores`:"",base.mus!=="custom"?"Try it copies your museum into a custom one":""].filter(Boolean).join(", ")})}))}
  const effort=c=>Math.max(1,(c.pans||0)+(c.money||0)/1000)*(c.unknown?20:1);
  out.forEach(c=>{c.effort=effort(c);c.value=c.gain/c.effort});
  const keep=S.upEvent?out:out.filter(c=>!c.limited);
  keep.sort((a,b)=>b.gain-a.gain);
  return keep}
function renderUp(){
  const on=S.showUp===true;$("showUp").checked=on;$("upBody").hidden=!on;
  $("upGoal").innerHTML=[...UGOALS.map(([n])=>n),"Custom"].map(n=>`<button type="button" class="chip" data-ug="${esc(n)}" aria-pressed="${(S.upGoal||"Luck")===n}">${esc(n)}</button>`).join("");renderUcw();
  $("upCat").innerHTML=(S.upMode==="path"?[]:UCAT).map(([v,n])=>`<button type="button" class="chip" data-ucat="${v}" aria-pressed="${(S.upCat||"all")===v}">${n}</button>`).join("");$("upCat").parentElement.hidden=S.upMode==="path";
  $("upSort").innerHTML=[["list","Top 10"],["path","Upgrade path"]].map(([v,n])=>`<button type="button" class="chip" data-um="${v}" aria-pressed="${(S.upMode||"list")===v}">${n}</button>`).join("")+(`<button type="button" class="chip" data-uev="1" aria-pressed="${!!S.upEvent}" title="Event and limited-time gear you can't just go and get">Include event gear</button>`);
  if(!on){$("upList").innerHTML="";$("upHint").textContent="";return}
  renderUpList()}
// Upgrade path: take the biggest gain, apply it, then pick again from there. Skipped steps are left out
// and the path is worked out again without them.
const upKey=c=>c.kind+"|"+c.name;
function upPath(n){const real=S,skip=new Set(S.upSkip||[]),steps=[];let cur=clone(real);
  try{for(let i=0;i<n;i++){S=cur;const c=upCandidates().find(x=>!skip.has(upKey(x)));if(!c)break;c.apply();cur=clone(S);steps.push(Object.assign(c,{after:cur}))}}
  finally{S=real}
  return steps}
const upRow=(c,i,btns)=>{const gains=Object.entries(c.d).sort((a,b)=>Math.abs(b[1])-Math.abs(a[1])).slice(0,3)
      .map(([s,v])=>`<span class="${v<0?"neg":"gain"}">${esc(s)} <b>${fv2(s,v)}</b></span>`).join("");
    const money=c.money?uMoneyTxt(c.money):c.other||(c.limited?"event":"");
    const grind=c.pans?uPansTxt(c.pans):"";
    const meta=c.kind+(c.replaces?" (instead of "+c.replaces+")":"")+(c.where?", "+c.where:"")+(c.recipe?", "+c.recipe:"")+(c.unknown?", some materials aren't panned":"");
    return `<div class="upi${btns.length>1?" pth":""}">${btns.length>1?`<span class="upnum">${i+1}</span>`:""}<span class="upn"><b>${esc(c.name)}</b><span class="uph" title="${esc(meta)}">${esc(meta)}</span><span class="upg">${gains}</span></span>
      <span class="upm">${esc(money)}</span><span class="upp">${esc(grind)}</span><span class="upb">${btns.join("")}</span></div>`};
// boosts multiply (gear + flat points), so a goal stat at 0 from gear can't be raised by museum, totems or cookies
function zeroNote(){const R=compute(effState());const z=Object.keys(upGoal()[1]).filter(k=>((R.base[k]||0)+(R.flat[k]||0))<=1e-9);
  return z.length?`<br><b>${esc(z.join(", "))}</b> is 0 from your gear, and museum, totem and cookie boosts multiply what gear gives, so they can't raise it yet. Gear with ${esc(z.join(" or "))} comes first.`:""}
function renderPath(){const steps=upPath(8);const sk=(S.upSkip||[]).length;
  $("upHint").innerHTML=`Each step is picked after the ones above it are done. Equipment is shown at 6★ and 100% quality.`+zeroNote()+(sk?` <button type="button" class="rst" data-upunskip="1">Bring back ${sk} skipped</button>`:"");
  if(!steps.length){$("upList").innerHTML='<p class="hint">Nothing here beats what you already have for this goal.</p>';UPLAST=[];return}
  const tm=steps.reduce((a,c)=>a+(c.money||0),0),tp=steps.reduce((a,c)=>a+(c.pans||0),0);
  $("upList").innerHTML=steps.map((c,i)=>upRow(c,i,[`<button type="button" class="btn sm" data-upto="${i}" title="Applies steps 1 to ${i+1}">${i?"Do 1–"+(i+1):"Do it"}</button>`,`<button type="button" class="btn sm ghost" data-upskip="${i}" title="Leave this out and work the path out again">Skip</button>`])).join("")
    +`<div class="uptot"><span>Whole path</span><span class="upm">${tm?esc(uMoneyTxt(tm)):""}</span><span class="upp">${tp?esc(uPansTxt(tp)):""}</span><span class="upb">${steps.length>1?`<button type="button" class="btn sm" data-upto="${steps.length-1}" title="Applies every step at once">Do all ${steps.length}</button>`:""}</span></div>`;
  UPLAST=steps}
// what kind of suggestion it is, for the filter
const UCAT=[["all","All"],["gear","Gear"],["museum","Museum"],["mut","Mutations & enchants"],["boost","Potions & boosts"]];
const ucat=c=>/^Museum/.test(c.kind)?"museum":/^(Mutation|Pan enchant)/.test(c.kind)?"mut":/^(Potion|Consumable|Totem)$/.test(c.kind)?"boost":"gear";
function renderUpList(){
  if(S.upMode==="path")return renderPath();
  const cf=S.upCat||"all";const list=upCandidates().filter(c=>cf==="all"||ucat(c)===cf).slice(0,10);
  $("upHint").innerHTML=`Equipment is shown at 6★ and 100% quality. These are alternatives, so try one at a time; to do several at once, use the <button type="button" class="rst" data-uppath="1">Upgrade path</button>, which has a Do all button.`+zeroNote();
  if(!list.length){$("upList").innerHTML='<p class="hint">Nothing here beats what you already have for this goal.</p>';return}
  $("upList").innerHTML=list.map((c,i)=>upRow(c,i,[`<button type="button" class="btn sm" data-uptry="${i}">Try it</button>`])).join("");
  UPLAST=list}
const fv2=(s,v)=>(v<0?"−":"+")+(PCT.has(s)?fmt(Math.abs(v),1)+"%":fmt(Math.abs(v),Math.abs(v)<10?1:0));
let UPLAST=[],UPUNDO=null;
$("showUp").addEventListener("change",()=>{S.showUp=$("showUp").checked;save();renderUp()});
document.addEventListener("click",e=>{
  const g=e.target.closest("[data-ug]");if(g){S.upGoal=g.dataset.ug;save();renderUp();return}
  const uc=e.target.closest("[data-ucat]");if(uc){S.upCat=uc.dataset.ucat;save();renderUp();return}
  const um=e.target.closest("[data-um]");if(um){S.upMode=um.dataset.um;save();renderUp();return}
  const sk=e.target.closest("[data-upskip]");if(sk){const c=UPLAST[+sk.dataset.upskip];if(c){S.upSkip=[...(S.upSkip||[]),upKey(c)];save();renderUpList()}return}
  if(e.target.closest("[data-upunskip]")){S.upSkip=[];save();renderUpList();return}
  if(e.target.closest("[data-uppath]")){S.upMode="path";save();renderUp();return}
  const ut=e.target.closest("[data-upto]");if(ut){const c=UPLAST[+ut.dataset.upto];if(!c)return;UPUNDO=clone(S);const keep={upMode:S.upMode,upSkip:S.upSkip,upGoal:S.upGoal,upW:S.upW,upEvent:S.upEvent};Object.assign(S,clone(c.after),keep);save();all();toastUp(+ut.dataset.upto?`Did steps 1–${+ut.dataset.upto+1}`:`Did ${c.name}`);return}
  const ev=e.target.closest("[data-uev]");if(ev){S.upEvent=!S.upEvent;save();renderUp();return}
  const t=e.target.closest("[data-uptry]");if(t){const c=UPLAST[+t.dataset.uptry];if(!c)return;
    UPUNDO=clone(S);c.apply();save();all();toastUp(`Tried ${c.name}`);return}
  const u=e.target.closest("[data-upundo]");if(u&&UPUNDO){Object.assign(S,UPUNDO);UPUNDO=null;save();all();return}});
function toastUp(msg){let d=document.querySelector(".uptoast");if(!d){d=document.createElement("div");d.className="uptoast";document.body.appendChild(d)}
  d.innerHTML=`${esc(msg)} <button type="button" class="btn sm" data-upundo="1">Undo</button>`;d.hidden=false;clearTimeout(toastUp.t);toastUp.t=setTimeout(()=>{d.hidden=true},6000)}

// stats spread: the four "Your stats" numbers this build gives, in the same rounding Settings uses
function spreadVals(){const t=compute(S).tot;return {luck:String(Math.round(t.Luck||0)),cap:String(Math.round(t.Capacity||0)),sb:String(Math.round((t["Size Boost"]||0)*10)/10),mb:String(Math.round(t["Modifier Boost"]||0))}}
function renderSpread(){const v=spreadVals();let y={};try{y=window.parent.ptYou.get()||{}}catch(e){}
  const F=[["luck","Luck",""],["cap","Pan capacity",""],["sb","Size Boost %","%"],["mb","Modifier Boost %","%"]];
  $("spread").innerHTML=F.map(([k,n])=>{const same=String(y[k]??"")===v[k];return `<div class="sp1${same?" ok":""}"><small>${n}</small><b>${fmt(+v[k],k==="sb"?1:0)}</b><small class="now">${same?"Matches Your stats":y[k]?"Your stats: "+esc(fmt(+y[k],k==="sb"?1:0)):"Not set in Your stats"}</small></div>`}).join("")}

document.addEventListener("click",e=>{if(!e.target.closest("#spSet"))return;try{window.parent.ptYou.set(spreadVals(),window)}catch(e){}renderSpread();toast("Your stats updated")});
function render(){renderSpread();if(typeof fillProg==="function"&&$("progSum"))fillProg();
  renderIso();renderParts();renderUp();
  const r=compute(effState());
  const f=(s,v)=>PCT.has(s)?fmt(v,1)+"%":fmt(v,s==="Luck"||s==="Capacity"?0:1);
  $("out").innerHTML=`<table class="out"><tr><th>Stat</th><th>Gear</th><th>Boost pile</th><th>Total</th><th class="bkc" title="Show this stat in the detailed breakdown">Breakdown</th></tr>${STATS.map(s=>{const show=r.base[s]||r.tot[s]||s==="Luck";if(!show)return "";const on=!(S.brkHide||[]).includes(s);
    return `<tr class="${s==="Luck"?"big":""}"><td>${s}</td><td>${f(s,r.base[s]+r.flat[s])}</td><td>${["Toughness","Inventory Size"].includes(s)?"-":"×"+fmt(1+r.pile[s],2)}</td><td class="tot">${f(s,r.tot[s])}</td><td class="bkc"><button type="button" class="sw2" role="switch" data-bstat="${esc(s)}" aria-checked="${on}" aria-label="Show ${esc(s)} in the detailed breakdown" title="${on?"Shown":"Hidden"} in the detailed breakdown"></button></td></tr>`}).join("")}</table>
    <p class="hint" style="margin-top:8px">${[r.ev>1?`Events multiply final luck by ×${r.ev}.`:"",r.luckMult>1?`Your trinket multiplies final luck by ×${fmt(r.luckMult,2)}.`:"",r.mt.n?`Museum: ${r.mt.n} display${r.mt.n===1?"":"s"} counted.`:"No museum counted.",...r.notes].filter(Boolean).join(" ")}</p>`;
  const mtS=musTotals(S);$("musTxt").textContent=S.mus==="none"?"":mtS.n?Object.entries(mtS.t).filter(([,v])=>v).map(([k,v])=>`${k} ${v<0?"−":"+"}${fmt(Math.abs(v),3)}×`).join(", "):"That museum board is empty. Fill it in on the Museum Planner page.";
}
// ---- save the build as an image: gear, boosts, then the stats table (what "Your stats" shows) ----
// build name: used as the image title and file name, and as the first line of the Discord copies
const bTitle=()=>String(S.bname||"").trim()||"My build";
$("bName").value=S.bname||"";$("bName").addEventListener("input",()=>{S.bname=$("bName").value;save()});
const RHX={Ascended:"#ffd36b",Exotic:"#f17ad6",Mythic:"#f0687f",Legendary:"#f2b53a",Epic:"#b880ee",Rare:"#68a6f0",Uncommon:"#6cc46e",Common:"#a3adb8"};
const MUTHX={Silver:"#a9b4be",Gold:"#d9a520",Diamond:"#5fc8e8",Granite:"#8d8d86",Overclocked:"#e0602f",Festive:"#d23c3c",Sunforged:"#ffc457",Prismatic:"#c05bd8"};
// copy the stat panel as text, ready to paste into Discord
$("cpStats").onclick=async()=>{const st=effState(),t=compute(st).tot;const gear=[S.pan&&"Pan: "+S.pan,S.shovel&&"Shovel: "+S.shovel].filter(Boolean).join(", ");
  const hid=new Set(S.brkHide||[]),lines=SHOW.filter(s=>t[s]&&!hid.has(s)).map(s=>`**${s}:** ${fv(s,t[s])}`);
  if(!lines.length){ptToast("Nothing to copy yet. Pick some gear first.");return}
  const txt=discordCompactAnsi(["**"+(String(S.bname||"").trim()||"My Prospecting stats")+"**",gear,...lines].filter(Boolean));let ok=false;
  try{await navigator.clipboard.writeText(txt);ok=true}catch(e){try{const ta=document.createElement("textarea");ta.value=txt;ta.style.position="fixed";ta.style.opacity="0";document.body.appendChild(ta);ta.select();ok=document.execCommand("copy");ta.remove()}catch(e2){}}
  ptToast(ok?"Stats copied, paste them anywhere":"Couldn't copy, your browser blocked it")};
$("toImg").onclick=()=>{const st=effState();const r=compute(st);
  const hasGear=st.pan||st.shovel||SLOTDEF.some(([k])=>((st.slots||{})[k]||{}).n);
  if(!hasGear){ptToast("Pick some gear first");return}
  ptSaveImg(bTitle(),()=>buildImage(st,r))};
// ---- the saved build card: pan, shovel and museum up top, then stats, equipment and boosts ----
async function buildImage(st,r){
  const F='"IBM Plex Sans","Segoe UI",system-ui,sans-serif',FD='"Chakra Petch","Segoe UI",system-ui,sans-serif',FM='"IBM Plex Mono",Consolas,monospace';
  try{await document.fonts.ready}catch(e){}
  const W=1300,PAD=40,GAP=16,IW=W-PAD*2,BG="#14181c",CARD="#1b2026",LINE="#2a3139",TX="#e6e9ec",MU="#98a2ad",GOLD="#f2b53a";
  // ---- gather ----
  const pan=G.pans.find(x=>x.name===st.pan),sh=G.shovels.find(x=>x.name===st.shovel);
  const board=st.mus!=="none"?musBoard(st):null,mt=musTotals(st);
  const musName=st.mus==="board"?"Museum Planner board":st.mus==="custom"?"Custom museum":String(st.mus||"").startsWith("lo:")?st.mus.slice(3):"";
  const disp=[];if(board)Object.entries(board).forEach(([rar,arr])=>(arr||[]).forEach(sl=>{if(sl&&sl.m){const m=MIN[String(sl.m).toLowerCase()];disp.push({n:sl.m,ic:m&&m.ic,r:m?m.r:rar,any:sl.m==="Any"})}}));
  const RO=["Ascended","Exotic","Mythic","Legendary","Epic","Rare","Uncommon","Common"];disp.sort((a,b)=>RO.indexOf(a.r)-RO.indexOf(b.r));
  const musStats=Object.entries(mt.t).filter(([,v])=>Math.abs(v)>1e-9).sort((a,b)=>b[1]-a[1]);
  const gOf=(k,l)=>{const v=(st.slots||{})[k];if(!v||!v.n)return {slot:l,empty:true};const x=EQB[v.n];return {slot:l,n:v.n,ic:x&&P.eimg[x.img],r:x?x.r:"",st:v.l==="0"?0:v.l==="5"?5:6,mu:v.m||"None",q:v.q??100}};
  const top2=[gOf("neck","Necklace"),gOf("charm","Charm")],rings=SLOTDEF.filter(d=>d[2]==="Ring").map(([k,l])=>gOf(k,l)).filter(g=>!g.empty);
  const gear=[...top2.filter(g=>!g.empty),...rings];
  const MODCOL={Perfect:"#5ef1e1",Treasured:"#ffd849",Entombed:"#40c8be",Lunar:"#ffe99b",Voidtorn:"#a35bff",Mutated:"#a07bff",Cosmic:"#ff5f9e",Electrified:"#ffeb0b",Iridescent:"#f36bff",Irradiated:"#67ff20",Crystalline:"#b7e6ff",Scorching:"#ff861c",Glowing:"#fff292",Pure:"#ffffff",Shiny:"#d4e7ff"};
  const MROWS=board?MORDER.map(r=>({r,slots:Array.from({length:MSLOTS[r]},(_,i)=>{const sl=(board[r]||[])[i]||{};const mm=sl.m&&sl.m!=="Any"?MIN[String(sl.m).toLowerCase()]:null;return {m:sl.m||null,any:sl.m==="Any",ic:mm&&mm.ic,u:sl.u||"None"}})})):[];
  const boosts=[];const lab=k=>{if(BLAB[k])return BLAB[k];const e=document.querySelector(`[data-b="${k}"]`);return e?e.parentElement.textContent.trim():k};
  Object.entries(st.b||{}).forEach(([k,v])=>{if(v&&!runeCovers(st,k))boosts.push({t:lab(k),col:TX})});
  (st.pots||[]).forEach(n=>boosts.push({t:n,col:"#b880ee"}));(st.cons||[]).forEach(n=>boosts.push({t:n,col:"#e0a050"}));
  if(sunOn(st))boosts.push({t:"Sun Blessing (assumed charged)",col:"#ffc800"});if(rhyOn(st))boosts.push({t:st.shEn+" full streak (assumed)",col:TX});(st.runes||[]).forEach(n=>boosts.push({t:n+" rune",col:"#68a6f0"}));
  const n=st.n||{};if(+n.friendTotem>=0)boosts.push({t:`Friendship Totem (${+n.friendTotem} nearby)`,col:TX});if(+n.friends>0)boosts.push({t:`${+n.friends} friend${+n.friends===1?"":"s"} online`,col:TX});
  if(+n.mastery>0)boosts.push({t:`Location mastery +${n.mastery}×`,col:TX});if(+n.flatLuck>0)boosts.push({t:`+${fmt(+n.flatLuck,0)} flat luck`,col:statHex("Luck")});if(+n.flatDig>0)boosts.push({t:`+${fmt(+n.flatDig,0)} flat dig strength`,col:statHex("Dig Strength")});
  const hideS=new Set(S.brkHide||[]),stats=SHOW.filter(x=>(Math.abs(r.tot[x]||0)>1e-9||x==="Luck")&&!hideS.has(x));
  const LV=brkLvl(),DET=LV===2?brkData(st).stats:null;
  const sub=[];const ex=[r.ev>1?`events ×${r.ev} luck`:"",r.luckMult>1?`trinket ×${fmt(r.luckMult,2)} luck`:""].filter(Boolean);if(ex.length)sub.push("Includes "+ex.join(" and "));
  if((S.isoOff||[]).length||S.only)sub.push("Only some parts counted");
  // ---- measure ----
  const m=document.createElement("canvas").getContext("2d");
  const chipRows=(list,w,font)=>{m.font=font;const rows=[[]];let x=0;list.forEach(ch=>{const cw=m.measureText(ch.t).width+22;if(x+cw>w&&rows[rows.length-1].length){rows.push([]);x=0}rows[rows.length-1].push({...ch,w:cw});x+=cw+8});return rows};
  // pan / shovel lines: base stats, plus the passive when it's a stat (+25% Size Boost, 1.1× additional Luck)
  const pasL=it=>{if(!it||!it.passive)return [];const ps=passive(it.passive),L2=Object.entries(ps.o).filter(([,v])=>v).map(([k,v])=>[k,(v<0?"−":"+")+fmt(Math.abs(v),0)+"%"]);if(ps.lm&&ps.lm!==1)L2.push(["Luck","+"+fmt(ps.lm-1,2)+"×"]);return L2};
  const panL=pan?[["Luck",fmt(+pan.luck||0,2)],["Capacity",fmt(+pan.capacity||0,0)],["Shake Strength",fmt(+pan.strength||0,2)],...pasL(pan)]:[];
  const shL=sh?[["Dig Strength",fmt(+sh.strength||0,2)],["Dig Speed",fmt((+sh.speed||0)*100,0)+"%"],["Toughness",fmt(+sh.toughness||0,0)],...pasL(sh)]:[];
  const HERO=Math.max(212,122+(Math.max(panL.length,shL.length)-1)*24+(st.trinket?46:24)),SC=4,STH=96,SECH=44,TOPH=104,RC=4,RH=98,MRH=58;
  const statRowsN=Math.ceil(stats.length/SC),ringRowsN=Math.ceil(rings.length/RC),hasTop=top2.some(g=>!g.empty);
  const bRows=boosts.length?chipRows(boosts,IW-36,`13px ${F}`):[];
  const DROW=25,DCW=(IW-GAP)/2;
  const dH=d=>58+30+Math.max(1,d.F.length)*DROW+(d.fo1||!d.M.length?0:30+d.M.length*DROW)+(d.X.length?30+d.X.length*DROW:0)+10;
  let detH=0,dPos=[];if(DET){const col=[0,0];DET.forEach(d=>{const h=dH(d),c2=col[0]<=col[1]?0:1;dPos.push({c:c2,y:col[c2],h});col[c2]+=h+12});detH=Math.max(col[0],col[1])}
  let H=PAD+(sub.length?88:62)+HERO+GAP+(stats.length?SECH+(DET?detH:statRowsN*(STH+12)):0)+(hasTop?SECH+TOPH+12:0)+(rings.length?SECH+ringRowsN*(RH+12):0)+(MROWS.length?SECH+MROWS.length*MRH+20:0)+(boosts.length?SECH+bRows.length*32+28:0)+PAD-4;
  // ---- images ----
  const srcs=[pan&&G.img[pan.image],sh&&G.img[sh.image],...gear.map(g=>g.ic),...MROWS.flatMap(x=>x.slots.map(q=>q.ic))].filter(Boolean);
  const IMG={};await Promise.all([...new Set(srcs)].map(s=>new Promise(res=>{const i=new Image();i.onload=()=>{IMG[s]=i;res()};i.onerror=()=>res();i.src=s})));
  // ---- draw ----
  const cv=document.createElement("canvas"),sc=2;cv.width=W*sc;cv.height=H*sc;const c=cv.getContext("2d");c.scale(sc,sc);
  const rr=(x,y,w,h,rad)=>{c.beginPath();c.moveTo(x+rad,y);c.arcTo(x+w,y,x+w,y+h,rad);c.arcTo(x+w,y+h,x,y+h,rad);c.arcTo(x,y+h,x,y,rad);c.arcTo(x,y,x+w,y,rad);c.closePath()};
  const fit=(t,w)=>{t=String(t);if(c.measureText(t).width<=w)return t;while(t.length>1&&c.measureText(t+"…").width>w)t=t.slice(0,-1);return t+"…"};
  const card=(x,y,w,h,edge)=>{c.fillStyle=CARD;rr(x,y,w,h,14);c.fill();c.strokeStyle=LINE;c.lineWidth=1;rr(x+.5,y+.5,w-1,h-1,14);c.stroke();if(edge){c.save();rr(x,y,w,h,14);c.clip();c.fillStyle=edge;c.fillRect(x,y,4,h);c.restore()}};
  const label=(t,x,y,col)=>{c.fillStyle=col||MU;c.font=`700 11.5px ${F}`;let xx=x;for(const ch of t){c.fillText(ch,xx,y);xx+=c.measureText(ch).width+1.3}};
  const img=(src,x,y,s,tile)=>{if(tile){c.fillStyle="#12161a";rr(x,y,s,s,10);c.fill()}const i=IMG[src];if(!i)return;const k=Math.min((s-(tile?8:0))/i.width,(s-(tile?8:0))/i.height),w=i.width*k,h=i.height*k;c.drawImage(i,x+(s-w)/2,y+(s-h)/2,w,h)};
  const sec=(t,y)=>{c.fillStyle=TX;c.font=`700 20px ${FD}`;c.fillText(t,PAD,y+26)};
  c.fillStyle=BG;c.fillRect(0,0,W,H);
  // header
  c.font=`600 13px ${F}`;const mb="Made by @__coastal";const mw=c.measureText(mb).width+28,mx=W-PAD-mw,my=PAD-6;c.fillStyle="rgba(20,184,166,.14)";rr(mx,my,mw,26,13);c.fill();c.strokeStyle="rgba(20,184,166,.6)";c.lineWidth=1;rr(mx,my,mw,26,13);c.stroke();c.fillStyle="#2dd4bf";c.fillText(mb,mx+14,my+17.5);
  c.fillStyle=TX;c.font=`700 34px ${FD}`;c.fillText(fit(bTitle(),IW-mw-24),PAD,PAD+30);
  c.font=`600 15px ${F}`;{let xx=PAD;stats.forEach((k,i)=>{const t1=fv(k,r.tot[k]||0)+" ",t2=k.toLowerCase(),sep=i<stats.length-1?"   ":"";const w=c.measureText(t1+t2+sep).width;if(xx+w>PAD+IW){return}
    c.fillStyle=statHex(k);c.fillText(t1,xx,PAD+54);xx+=c.measureText(t1).width;c.fillStyle=MU;c.fillText(t2+sep,xx,PAD+54);xx+=c.measureText(t2+sep).width})}
  let y=PAD+62;if(sub.length){c.font=`14px ${F}`;c.fillStyle=MU;c.fillText(fit(sub.join(", "),IW),PAD,PAD+78);y=PAD+88}
  // hero: pan, shovel, museum
  const hw=(IW-GAP*2)/3;
  const tool=(x,kind,it,en,lines,edge)=>{card(x,y,hw,HERO,edge);label(kind,x+20,y+30,edge);
    if(!it){c.fillStyle=MU;c.font=`15px ${F}`;c.fillText("None picked",x+20,y+64);return}
    img(G.img[it.image],x+20,y+46,92,true);const tx=x+128,tw=hw-148;
    c.fillStyle=it["name color"]||TX;c.font=`700 20px ${FD}`;c.fillText(fit(it.name,tw),tx,y+70);
    c.font=`13px ${F}`;c.fillStyle=en?"#c9a7f5":MU;c.fillText(fit(en?"Enchant: "+en:"No enchant",tw),tx,y+92);
    lines.forEach(([k,v],i)=>{const yy=y+122+i*24;c.font=`13px ${F}`;c.fillStyle=MU;c.fillText(k,tx,yy);c.font=`600 14px ${FM}`;c.fillStyle=statHex(k);c.textAlign="right";c.fillText(v,x+hw-20,yy);c.textAlign="left"});
    if(kind==="Pan"&&st.trinket){c.font=`12.5px ${F}`;c.fillStyle=MU;c.fillText(fit("Trinket: "+TRLAB(st.trinket,st.trkMax),hw-40),x+20,y+HERO-16)}};
  tool(PAD,"Pan",pan,st.panEn,panL,"#e0a95b");
  tool(PAD+hw+GAP,"Shovel",sh,st.shEn,shL,"#8fb4d9");
  // museum card
  {const x=PAD+(hw+GAP)*2;card(x,y,hw,HERO,"#3cc2a8");label("Museum",x+20,y+30,"#3cc2a8");
    if(!board||!mt.n){c.fillStyle=MU;c.font=`15px ${F}`;c.fillText("No museum counted",x+20,y+64)}
    else{c.fillStyle=TX;c.font=`700 20px ${FD}`;c.fillText(fit(musName,hw-40),x+20,y+62);c.font=`13px ${F}`;c.fillStyle=MU;c.fillText(`${mt.n} display${mt.n===1?"":"s"}`,x+20,y+84);
      const ms=musStats.slice(0,4);ms.forEach(([k,v],i)=>{const col=i%2,row=Math.floor(i/2),xx=x+20+col*((hw-40)/2),yy=y+112+row*24;c.font=`13px ${F}`;c.fillStyle=MU;c.fillText(fit(k,(hw-40)/2-80),xx,yy);c.font=`600 14px ${FM}`;c.fillStyle=statHex(k);c.textAlign="right";c.fillText("+"+fmt(v,2)+"×",xx+(hw-40)/2-14,yy);c.textAlign="left"});
      c.font=`12.5px ${F}`;c.fillStyle=MU;c.fillText("Every slot is listed below",x+20,y+HERO-20)}}
  y+=HERO+GAP;
  // equipment: necklace and charm as two big cards, then the rings
  const stars=(g,x,yy,fs)=>{c.font=`600 ${fs}px ${FM}`;c.fillStyle=GOLD;const t=g.st+"★";c.fillText(t,x,yy);return x+c.measureText(t).width};
  // Prismatic is a rainbow mutation in-game, so it's drawn with a rainbow gradient instead of one flat colour
  const mutTxt=(g,x,yy,fs,w)=>{const none=g.mu==="None";c.font=none?`${fs}px ${F}`:`600 ${fs}px ${F}`;const t=fit(none?"No mutation":g.mu,w);
    if(g.mu==="Prismatic"){const tw=c.measureText(t).width,gr=c.createLinearGradient(x,0,x+tw,0);["#ff6b6b","#ffb347","#ffe66d","#6ee7a8","#5ec8ff","#a78bfa","#f472b6"].forEach((col,i,arr)=>gr.addColorStop(i/(arr.length-1),col));c.fillStyle=gr}
    else c.fillStyle=none?MU:(MUTHX[g.mu]||TX);c.fillText(t,x,yy)};
  if(hasTop){sec("Necklace & Charm",y);y+=SECH;const tw2=(IW-GAP)/2;
    top2.forEach((g,i)=>{const x=PAD+i*(tw2+GAP);card(x,y,tw2,TOPH,g.empty?null:RHX[g.r]);
      if(g.empty){label(g.slot,x+22,y+32);c.fillStyle=MU;c.font=`15px ${F}`;c.fillText("Empty",x+22,y+62);return}
      img(g.ic,x+20,y+16,72,true);const tx=x+108,tw=tw2-128;label(g.slot,tx,y+30);
      c.font=`700 19px ${FD}`;c.fillStyle=RHX[g.r]||TX;c.fillText(fit(g.n,tw),tx,y+56);
      c.font=`13px ${F}`;c.fillStyle=MU;c.fillText(g.r,tx,y+82);let xx=tx+c.measureText(g.r+"   ").width;xx=stars(g,xx,y+82,13);
      c.font=`13px ${F}`;c.fillStyle=MU;c.fillText("   ",xx,y+82);xx+=c.measureText("   ").width;mutTxt(g,xx,y+82,13,x+tw2-20-xx-60);
      c.textAlign="right";c.font=`600 13px ${FM}`;c.fillStyle=g.q>=100?TX:MU;c.fillText(g.q+"% quality",x+tw2-20,y+82);c.textAlign="left"});
    y+=TOPH+12}
  if(rings.length){sec(`Rings (${rings.length} of 8)`,y);y+=SECH;const rw=(IW-12*(RC-1))/RC;
    rings.forEach((g,i)=>{const x=PAD+(i%RC)*(rw+12),yy=y+Math.floor(i/RC)*(RH+12);card(x,yy,rw,RH,RHX[g.r]);
      img(g.ic,x+18,yy+18,60,true);label(g.slot,x+86,yy+30);c.textAlign="right";c.font=`600 12.5px ${FM}`;c.fillStyle=g.q>=100?TX:MU;c.fillText(g.q+"%",x+rw-16,yy+30);c.textAlign="left";
      c.font=`700 16px ${FD}`;c.fillStyle=RHX[g.r]||TX;c.fillText(fit(g.n,rw-104),x+86,yy+56);
      const xx=stars(g,x+86,yy+80,13);c.font=`13px ${F}`;c.fillStyle=MU;c.fillText("   ",xx,yy+80);mutTxt(g,xx+c.measureText("   ").width,yy+80,13,x+rw-16-xx-30)});
    y+=ringRowsN*(RH+12)}
  // museum: all 18 slots, by rarity. "ANY" = no mineral bonus, only the modifier counts
  if(MROWS.length){sec(`Museum (${mt.n} of 18 filled)`,y);y+=SECH;card(PAD,y,IW,MROWS.length*MRH+8);
    const LW=120,sw3=(IW-LW-40-12*2)/3;
    MROWS.forEach((row,j)=>{const yy=y+4+j*MRH;if(j){c.strokeStyle=LINE;c.beginPath();c.moveTo(PAD+16,yy+.5);c.lineTo(PAD+IW-16,yy+.5);c.stroke()}
      c.fillStyle=RHX[row.r]||TX;c.font=`700 14px ${F}`;c.fillText(row.r,PAD+20,yy+34);
      row.slots.forEach((q,i)=>{const x=PAD+20+LW+i*(sw3+12),ic=40,iy=yy+9;
        c.fillStyle=(RHX[row.r]||MU)+(q.m?"22":"0d");rr(x,iy,ic,ic,9);c.fill();
        if(q.any){c.fillStyle=RHX[row.r]||TX;c.font=`700 11px ${F}`;c.textAlign="center";c.fillText("ANY",x+ic/2,iy+ic/2+4);c.textAlign="left"}
        else if(q.ic&&IMG[q.ic]){const im=IMG[q.ic],k=Math.min((ic-6)/im.width,(ic-6)/im.height);c.drawImage(im,x+(ic-im.width*k)/2,iy+(ic-im.height*k)/2,im.width*k,im.height*k)}
        const tx=x+ic+12,tw=sw3-ic-14;
        if(!q.m){c.fillStyle=MU;c.font=`13px ${F}`;c.fillText("Empty",tx,yy+34);return}
        c.fillStyle=q.any?MU:TX;c.font=`600 14px ${F}`;c.fillText(fit(q.any?`Any ${row.r}`:q.m,tw),tx,yy+25);
        const u=q.u,ul=u==="None"?"No modifier":u==="Any"?"Any modifier":String(u).startsWith("Any of: ")?String(u).slice(8).split("/").join(" or "):u;
        c.fillStyle=MODCOL[u]||MU;c.font=MODCOL[u]?`600 12.5px ${F}`:`12.5px ${F}`;c.fillText(fit(ul+(q.any&&u!=="None"&&u!=="Any"?" (modifier only)":""),tw),tx,yy+44)})});
    y+=MROWS.length*MRH+20}
  // boosts
  if(boosts.length){sec("Boosts",y);y+=SECH;card(PAD,y,IW,bRows.length*32+16);
    bRows.forEach((row,j)=>{let xx=PAD+18;row.forEach(ch=>{const yy=y+12+j*32;c.strokeStyle=ch.col+"88";c.lineWidth=1;rr(xx,yy,ch.w,24,12);c.stroke();c.fillStyle=ch.col+"14";rr(xx,yy,ch.w,24,12);c.fill();c.fillStyle=ch.col;c.font=`13px ${F}`;c.fillText(ch.t,xx+11,yy+16.5);xx+=ch.w+8})})}
  // stats, at the bottom: only the stats switched on; the full breakdown when "Show breakdown" is on
  if(boosts.length)y+=bRows.length*32+28;
  if(stats.length&&!DET){sec("Stats",y);y+=SECH;const sw=(IW-12*(SC-1))/SC;
    stats.forEach((k,i)=>{const x=PAD+(i%SC)*(sw+12),yy=y+Math.floor(i/SC)*(STH+12),col=statHex(k);card(x,yy,sw,STH);
      c.fillStyle=col;c.beginPath();c.arc(x+22,yy+26,4,0,Math.PI*2);c.fill();c.font=`600 13px ${F}`;c.fillStyle=MU;c.fillText(fit(k,sw-50),x+34,yy+30.5);
      c.font=`600 28px ${FM}`;c.fillStyle=col;c.fillText(fit(fv(k,r.tot[k]||0),sw-40),x+18,yy+66);
      const flat=["Toughness","Inventory Size"].includes(k);c.font=`12px ${F}`;c.fillStyle=MU;if(LV===1)c.fillText(fit(flat?"from gear":`${fv(k,(r.base[k]||0)+(r.flat[k]||0))} × ${fmt(1+(r.pile[k]||0),2)}${k==="Luck"&&(r.ev||1)*(r.luckMult||1)!==1?` × ${fmt((r.ev||1)*(r.luckMult||1),2)}`:""}`,sw-36),x+18,yy+86)})}
  if(DET&&DET.length){sec("Stats",y);y+=SECH;const tv=(s2,v)=>PCT.has(s2)?fmt(v,1)+"%":fmt(v,s2==="Luck"||s2==="Capacity"?0:1);
    DET.forEach((d,i)=>{const p=dPos[i],x=PAD+p.c*(DCW+GAP),y0=y+p.y,col=statHex(d.s);card(x,y0,DCW,p.h,col);
      c.font=`700 19px ${FD}`;c.fillStyle=col;c.fillText(d.s,x+20,y0+32);
      c.textAlign="right";c.font=`600 22px ${FM}`;c.fillStyle=TX;c.fillText(tv(d.s,d.total),x+DCW-20,y0+33);
      const fm=d.fo1||(d.mult===1&&d.xm===1)?"":`${tv(d.s,d.flatT)} × ${mxf(d.mult)}${d.xm!==1?` × ${fmt(d.xm,2)}`:""}`;c.font=`12.5px ${FM}`;c.fillStyle=MU;c.fillText(fm,x+DCW-20,y0+50);c.textAlign="left";
      let yy=y0+58;const head=(t,v)=>{c.strokeStyle=LINE;c.beginPath();c.moveTo(x+16,yy+.5);c.lineTo(x+DCW-16,yy+.5);c.stroke();label(t,x+20,yy+20);c.textAlign="right";c.font=`600 13px ${FM}`;c.fillStyle=TX;c.fillText(v,x+DCW-20,yy+20);c.textAlign="left";yy+=30};
      const line=(o,txt)=>{const neg=o.v<0||(txt.startsWith("×")&&o.v<1);c.font=`600 13.5px ${F}`;c.fillStyle=TX;const lb=o.x.label;const lw=Math.min(c.measureText(lb).width,DCW-150);c.fillText(fit(lb,DCW-150),x+20,yy+16);
        if(o.x.sub){c.font=`12px ${F}`;c.fillStyle=MU;c.fillText(fit(o.x.sub,DCW-150-lw-8),x+20+lw+8,yy+16)}
        c.textAlign="right";c.font=`600 13px ${FM}`;c.fillStyle=neg?"#f0687f":"#3cc2a8";c.fillText(txt,x+DCW-20,yy+16);c.textAlign="left";yy+=DROW};
      head("Flat points",tv(d.s,d.flatT));if(d.F.length)d.F.forEach(o=>line(o,(o.v<0?"−":"+")+tv(d.s,Math.abs(o.v))));else{c.font=`12.5px ${F}`;c.fillStyle=MU;c.fillText("None",x+20,yy+16);yy+=DROW}
      if(!d.fo1&&d.M.length){head("Multiplier (from ×1)","×"+mxf(d.mult));d.M.forEach(o=>line(o,(o.v<0?"−":"+")+mxf(Math.abs(o.v))+"×"))}
      if(d.X.length){head("Multiplies the total","×"+fmt(d.xm,2));d.X.forEach(o=>line(o,"×"+fmt(o.v,2)))}})}
  return await new Promise(res=>cv.toBlob(res,"image/png"))}
// ---- gear picker with hover preview ----
const clone=o=>JSON.parse(JSON.stringify(o));
// rings the game only lets you wear one of at a time
// rings the game only lets you wear once: the known list plus anything whose description says so
const ONE_ONLY=new Set(["Dredge Master's Ring","Ring of Champions","Ring of the Stars","Scarab Signet","Embalmer's Ring","Ring of Ra",...EQ.filter(x=>/only one can be worn/i.test(x.d||"")).map(x=>x.n)]);
const takenElsewhere=(k,n)=>ONE_ONLY.has(n)&&SLOTDEF.some(([kk])=>kk!==k&&(S.slots[kk]||{}).n===n);
const slotOf=k=>k==="pan"||k==="shovel"?null:SLOTDEF.find(d=>d[0]===k);
const curName=k=>k==="pan"?S.pan:k==="shovel"?S.shovel:((S.slots[k]||{}).n||"");
const itemsFor=k=>k==="pan"?G.pans.map(x=>({n:x.name,r:"",img:G.img[x.image],x,kind:"pan"})):k==="shovel"?G.shovels.map(x=>({n:x.name,r:"",img:G.img[x.image],x,kind:"shovel"})):EQ.filter(x=>x.slot===slotOf(k)[2]).map(x=>({n:x.n,r:x.r,img:P.eimg[x.img],x,kind:"eq"}));
const withItem=(k,n)=>{const t=clone(S);if(k==="pan")t.pan=n;else if(k==="shovel")t.shovel=n;else{(t.slots[k]=t.slots[k]||{}).n=n}return t};
const SHOW=["Luck","Capacity","Shake Strength","Shake Speed","Dig Strength","Dig Speed","Size Boost","Modifier Boost","Sell Boost","Inventory Size","Walk Speed","Jump Power","Toughness"];
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
  const v=S.slots[k]||{};const sub=it&&it.kind==="eq"?` <span style="text-transform:none;letter-spacing:0;font-weight:400">${v.l==="0"?"no stars":v.l==="5"?"5★":"6★"}, ${(v.m&&v.m!=="None")?v.m:"no mutation"}, ${v.q??100}% quality</span>`:"";
  const st=itemStats(k,it).map(([n,val])=>n==="Passive"?`<div><span>Passive</span><span style="text-align:right">${esc(val)}</span></div>`:`<div><span>${esc(n)}</span><span class="mono ${val<0?"dn":""}">${PCT.has(n)||(it.kind==="eq"&&it.x.st.find(z=>z[0]===n&&z[5]))?(val>0?"+":"")+fmt(val,1)+"%":(val>0&&it.kind==="eq"?"+":"")+fmt(val,2)}</span></div>`).join("");
  let dl;
  if(mode==="current"){const without=compute(withItem(k,""));dl=deltaRows(without,cur);dl=dl.length?`<div class="pvt">What it adds to your totals</div><div class="pvs">${dl.map(([s,x,y])=>`<div><span>${s}</span><span class="mono ${y>x?"up":"dn"}">${sgn(s,y-x)}</span></div>`).join("")}</div>`:""}
  else if(it&&takenElsewhere(k,it.n)){dl=`<div class="pvt">Only one can be worn</div><span class="muted">${esc(it.n)} is already in another slot.</span>`}
  else{const nx=compute(withItem(k,it?it.n:""));const rows=deltaRows(cur,nx);dl=`<div class="pvt">${curName(k)===(it?it.n:"")?"Already equipped":"Your totals if you pick this"}</div>`+(rows.length?`<div class="pvs">${rows.map(([s,x,y])=>`<div><span>${s}</span><span class="mono">${fv(s,x)} → <b class="${y>x?"up":"dn"}">${fv(s,y)}</b> <span class="${y>x?"up":"dn"}">(${sgn(s,y-x)})</span></span></div>`).join("")}</div>`:`<span class="muted">No change.</span>`)}
  return head+(st?`<div class="pvt">Item stats${sub}</div><div class="pvs">${st}</div>`:"")+dl}
function paintPicks(){document.querySelectorAll("[data-pick]").forEach(b=>{const k=b.dataset.pick;const n=curName(k);const it=n&&itemsFor(k).find(i=>i.n===n);
  b.innerHTML=`${it&&it.img?`<img src="${it.img}" alt="">`:""}<span class="pn ${n?"":"nil"}">${n?esc(n):k==="pan"?"No pan":k==="shovel"?"No shovel":"Empty"}</span>${it&&it.r?`<span class="rr" style="--rc:${rc(it.r)}">${it.r}</span>`:""}<span class="car" aria-hidden="true">▾</span>`})}
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
  // trinkets: the luck ones and Embalmer's Salt are counted; the rest only kick in on certain pans, so they're listed
  const TRN=((P.x2||{}).trinkets||[]);if(S.trinket&&!TRN.some(t=>t.n===S.trinket))S.trinket="";
  $("trinket").innerHTML=`<option value="">No trinket</option>`+TRN.map(t=>`<option value="${esc(t.n)}"${t.n===S.trinket?" selected":""}>${esc(t.n)}</option>`).join("");
  const tk=TRN.find(t=>t.n===S.trinket);$("trkRollW").hidden=!TRROLL[S.trinket];$("trkRoll").value=S.trkMax?"max":"avg";
  const tr=TRROLL[S.trinket]?compute(S).trk:null;
  const tkTxt=!tk?"":tk.n==="Embalmer's Salt"?`${tk.n}: counted as maxed out, +100% Sell Boost (it builds up 0.25% per item panned and resets when you sell).`
    :tr?`${tk.n}: counted at the ${S.trkMax?"max":"average"} roll, about ${fmt(tr.n,0)} minerals a pan${tk.n==="Beach Umbrella"?` × ${fmt(tr.pm*100,0)}% modified`:" (20 kept)"} = +${fmt(tr.luck,0)} base luck.`
    :tk.n==="Nomad's Compass"?`${tk.n}: counted as always stacked, 6 deposits × +15% = ×1.9 on your total luck.`:tk.n==="Senet Die"?`${tk.n}: rolls ×0.5 to ×3 luck each full pan, counted as ×1.33 on your total luck.`
    :`${tk.n}: ${tk.fx} (not counted in the stats, it depends on what you pan)`;
  const pe=EN.pan.find(e=>e.n===S.panEn),se=EN.shovel.find(e=>e.n===S.shEn);
  $("enNote").textContent=[tkTxt,pe?`${pe.n}: `+[...Object.entries(pe.m).map(([k,v])=>`${v}× pan ${k.toLowerCase()}`),...Object.entries(pe.a).map(([k,v])=>`${v>0?"+":"−"}${Math.abs(v)}${["Shake Speed","Size Boost","Modifier Boost","Sell Boost"].includes(k)?"%":""} ${k.toLowerCase()}`)].join(", ")+".":"",se?`${se.n}: ${se.d}`:""].filter(Boolean).join(" ")}
// ---- custom museum editor ----
const MORDER=["Exotic","Mythic","Legendary","Epic","Rare","Uncommon","Common"],MSLOTS={Exotic:1,Mythic:2,Legendary:3,Epic:3,Rare:3,Uncommon:3,Common:3};
const blankBoard=()=>Object.fromEntries(MORDER.map(r=>[r,Array.from({length:MSLOTS[r]},()=>({m:null,u:"None"}))]));
const boostTxt=m=>m&&m.mu?m.mu.b.map(([s,v])=>`${s} ${v<0?"−":"+"}${Math.abs(v)}×`).join(", "):"";
function musEditor(){const ed=$("musEd");$("musCopy").hidden=S.mus==="custom";if(S.mus!=="custom"){ed.innerHTML="";return}
  if(!S.museumBoard)S.museumBoard=blankBoard();const bd=S.museumBoard;
  ed.innerHTML=MORDER.map(r=>{const opts=P.mins.filter(m=>m.r===r&&m.mu);return `<div class="mrow" style="--rc:${rc(r)}"><span class="rl">${r}</span><div class="mslots">${(bd[r]||[]).map((sl,i)=>`<div class="msl">
    <input type="text" data-mmi="${r}|${i}" placeholder="Empty" aria-label="${r} display ${i+1}">
    <select data-mu="${r}|${i}" aria-label="${r} display ${i+1} modifier">${P.mods.map(md=>`<option value="${esc(md[0])}"${md[0]===(sl.u||"None")?" selected":""}>${md[0]==="None"?"No modifier":esc(md[0])}</option>`).join("")}</select></div>`).join("")}</div></div>`}).join("");
  // each display is a search box with the mineral's picture, in the list and once picked; "Any" shows the same ? tile as museum views elsewhere
  ed.querySelectorAll("[data-mmi]").forEach(inp=>{const [r,i]=inp.dataset.mmi.split("|"),sl=()=>S.museumBoard[r][+i];
    const items=[{n:"Empty",v:null,tag:"No mineral"},{n:"Any",v:"Any",ic:ANY_IMG,tag:"Only the modifier counts"}].concat(P.mins.filter(m=>m.r===r&&m.mu).map(m=>({n:m.n,v:m.n,ic:m.ic,col:rc(r),tag:boostTxt(m)})));
    makeAC({inp,items,keep:true,cur:()=>sl().m||"",icon:()=>{const v=sl().m;if(!v)return "";if(v==="Any")return ANY_IMG;const m=P.mins.find(x=>x.n===v);return m&&m.ic},
      pick:x=>{sl().m=x.v;save();render()}})})}
// the "Any" display tile as a picture: a rounded square with a ?, like .pt-many
const ANY_IMG="data:image/svg+xml,"+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 34 34"><rect width="34" height="34" rx="8" fill="#2a3038"/><text x="17" y="23.5" text-anchor="middle" font-family="Segoe UI,system-ui,sans-serif" font-size="18" font-weight="700" fill="#9aa4ae">?</text></svg>');
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
// ---- the build as Build Sheets text (paste it in Build Sheets > Edit as text > Paste as new build) ----
function buildSheetText(){const L=[];const r=compute(S);const tv=(s,v)=>PCT.has(s)?fmt(v,1)+"%":fmt(v,0);
  const eqT=v=>{const t=[];if(v.l==="5")t.push("5★");else if(v.l==="0")t.push("0★");if((v.q??100)!==100)t.push((v.q??100)+"% quality");return `${v.n}${v.m&&v.m!=="None"?` (${v.m})`:""}${t.length?" // "+t.join(", "):""}`};
  L.push("Title: "+((S.bname||"").trim()||"Stat Calculator build"),"Subtitle: GRAY From the Stat Calculator","Notes:");
  // totals, each in its stat's colour
  [["Luck","GREEN BOLD"],["Capacity","GOLD"],["Size Boost","RED"],["Modifier Boost","LIME"],["Sell Boost","YELLOW"]].forEach(([st,c])=>{const v=r.tot[st]||0;if(v>0)L.push(`- ${c} ${st}: ${tv(st,v)}`)});
  L.push("- FADED Totals with every boost ticked in the Stat Calculator");
  if(sunOn(S))L.push("- FADED Sun Blessing counted as fully charged");
  if(rhyOn(S))L.push(`- FADED ${S.shEn} counted at a full perfect-dig streak`);
  if(S.trinket==="Nomad's Compass")L.push("- FADED Nomad's Compass counted fully stacked");
  if(S.trinket==="Senet Die")L.push("- FADED Senet Die counted as ×1.33");
  if(TRROLL[S.trinket])L.push(`- FADED ${S.trinket} counted at the ${S.trkMax?"max":"average"} roll`);
  if(S.trinket==="Embalmer's Salt")L.push("- FADED Embalmer's Salt counted as maxed");
  // museum: the most used modifier goes on top, any other one is written after its mineral
  const mb=musBoard()||{};const cnt={};MORDER.forEach(rr=>(mb[rr]||[]).forEach(sl=>{if(sl&&sl.m&&sl.u&&sl.u!=="None")cnt[sl.u]=(cnt[sl.u]||0)+1}));
  const main=(Object.entries(cnt).sort((a,b)=>b[1]-a[1])[0]||["Any"])[0];
  L.push("","Museum","Modifier: "+main);
  MORDER.forEach(rr=>{L.push(`${rr}: `+Array.from({length:MSLOTS[rr]},(_,i)=>{const sl=(mb[rr]||[])[i];if(!sl||!sl.m)return "-";const u=sl.u||"None";
    const ov=main==="Any"?(u!=="None"?u:""):(u===main?"":u);return sl.m+(ov?` (${ov})`:"")}).join(" | "))});
  // equipment
  L.push("","Equipment");if(S.slots.charm&&S.slots.charm.n)L.push("Charm: "+eqT(S.slots.charm));if(S.slots.neck&&S.slots.neck.n)L.push("Necklace: "+eqT(S.slots.neck));
  const rings=[];SLOTDEF.filter(d=>d[2]==="Ring").forEach(([k])=>{const v=S.slots[k];if(!v||!v.n)return;const t=eqT(v);const g=rings.find(x=>x.t===t);if(g)g.c++;else rings.push({t,c:1})});
  if(rings.length){L.push("Rings:");rings.forEach(g=>L.push(`- ${g.c}× ${g.t}`))}
  if((S.runes||[]).length)L.push("Runes: "+S.runes.join(", "));
  (S.pots||[]).forEach(n=>L.push("Extra: Potion = "+n));
  (S.cons||[]).forEach(n=>L.push("Extra: Consumable = "+n));
  const BN={luckTotem:"Luck Totem",strTotem:"Strength Totem",lumTotem:"Luminant Totem",cookie:"XP Cookie",daily:"Daily login luck",dailyStr:"Daily login strength",empower:"Empowering sluice",egg:"Easter Sluice (Egg Hunter)",meteor:"Meteor shower",weather:"Weather event"};
  Object.keys(BN).forEach(k=>{if(S.b&&S.b[k])L.push(`Extra: ${k==="meteor"||k==="weather"?"Event":"Boost"} = ${BN[k]}`)});
  if(+S.n.friendTotem>=0)L.push(`Extra: Boost = Friendship Totem // ${+S.n.friendTotem} nearby`);
  L.push("","Pan & shovel");
  if(S.pan)L.push("Pan: "+[S.pan,S.panEn?"enchant "+S.panEn:"",S.trinket?"trinket "+S.trinket:""].filter(Boolean).join("; "));
  if(S.shovel)L.push("Shovel: "+[S.shovel,S.shEn?"enchant "+S.shEn:""].filter(Boolean).join("; "));
  return L.join("\n")}
$("toBuildTxt").onclick=async()=>{const t=buildSheetText();try{await navigator.clipboard.writeText(t);toast("Copied. In Build Sheets: Edit as text, then Paste as new build")}catch(e){toast("Couldn't copy")}};
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
  const bd=clone(st.museumBoard||blankBoard());MORDER.forEach(r=>(bd[r]||[]).forEach(sl=>{if(sl&&sl.m)sl.m=sl.m==="Any"?"Any":R(sl.m,P.mins.filter(x=>x.r===r).map(x=>x.n),"")||null}));
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
  const mp=moneyPots().filter(p=>!S.pots.includes(p.n)).length;
  $("potAdd").innerHTML=`<option value="">Add a potion…</option>${mp?`<option value="__money">＋ Every money potion (${mp})</option>`:""}`+PO.filter(p=>!S.pots.includes(p.n)).map(p=>`<option value="${esc(p.n)}">${esc(p.n)}, ${esc(p.fx)}</option>`).join("");
  $("potSum").textContent=S.pots.length?`${S.pots.length} potion${S.pots.length===1?"":"s"} active (click to ${$("potBox").open?"hide":"show"})`:"No potions active";$("potBox").hidden=!S.pots.length;
  $("potList").innerHTML=S.pots.map(n=>`<span class="bchip">${esc(n)}<button type="button" data-rmpot="${esc(n)}" aria-label="Remove ${esc(n)}">×</button></span>`).join("")}
function toast(t){document.querySelectorAll(".ctoast").forEach(x=>x.remove());const d=document.createElement("div");d.className="ctoast";d.setAttribute("role","status");d.textContent=t;d.style.cssText="position:fixed;left:50%;bottom:20px;transform:translateX(-50%);background:var(--fg);color:var(--bg);padding:8px 14px;border-radius:8px;font-size:13.5px;z-index:40";document.body.appendChild(d);setTimeout(()=>d.remove(),2200)}
// every potion bought with money, except the Traveling Merchant's (he isn't always around)
const moneyPots=()=>((P.x2||{}).potions||[]).filter(p=>/\$/.test(p.cost)&&!/travel/i.test(p.where||""));
$("potBox").addEventListener("toggle",fillPots);
$("potClear").onclick=()=>{if(!(S.pots||[]).length)return;S.pots=[];save();fillPots();render();toast("Potions cleared")};
document.addEventListener("click",e=>{const b=e.target.closest("[data-rmpot]");if(!b)return;S.pots=(S.pots||[]).filter(n=>n!==b.dataset.rmpot);save();fillPots();render()});
// boosts you turn on for a while: one dropdown to add them, chips to see and remove them (numbers stay editable on the chip)
const BOOSTS=[["Totems",[["b","luckTotem","Luck Totem (+1× luck)"],["b","strTotem","Strength Totem (+1× strength)"],["b","lumTotem","Luminant Totem (+0.5× capacity, +50% speed)"],["n","friendTotem","Friendship Totem",0,"players nearby"]]],
  ["Daily and sluices",[["b","daily","Daily login luck (2× luck)"],["b","dailyStr","Daily login strength (2× dig strength)"],["b","empower","Empowering sluice (1.4× luck and capacity)"],["b","egg","Easter Sluice, Egg Hunter (1.5×)"],["b","cookie","XP Cookie"]]],
  ["Runes",[["b","sun","Sunblessed / Abyssal rune (+0.2× luck)"],["b","solo","Solitude rune (+0.2× luck)"],["b","purity","Purity rune (+1× luck, no modifiers)"],["b","vet","Veteran rune (+0.25× luck when mastered)"]]],
  ["Events and time",[["b","meteor","Meteor Shower (×2 luck)"],["b","weather","Weather event (×1.5 luck)"],["b","night","Night (counts Night Luck)"]]],
  ["Limited consumables",CONS.map(c=>["c",c.n,`${c.n}, ${c.fx}`])],
  ["Other",[["n","friends","Friends online",1,"online"],["n","flatLuck","Other flat luck",100,"luck"],["n","flatDig","Flat dig strength",10,"strength"]]]];
const bOn=([k,key])=>k==="b"?!!S.b[key]:k==="c"?(S.cons||[]).includes(key):key==="friendTotem"?(+S.n.friendTotem>=0):(+S.n[key]>0);
function fillBoosts(){S.cons=(S.cons||[]).filter(n=>CONS.some(c=>c.n===n));
  $("bAdd").innerHTML=`<option value="">Add a boost…</option>`+BOOSTS.map(([g,l])=>{const off=l.filter(x=>!bOn(x));return off.length?`<optgroup label="${esc(g)}">${off.map(x=>`<option value="${x[0]}:${esc(x[1])}">${esc(x[2])}</option>`).join("")}</optgroup>`:""}).join("");
  const on=BOOSTS.flatMap(([,l])=>l.filter(bOn));
  $("bList").innerHTML=on.map(x=>{const lab=x[0]==="c"?x[1]:x[2].replace(/\s*\(.*$/,"");return `<span class="bchip">${esc(lab)}${x[0]==="n"?`<input type="number" min="${x[1]==="friendTotem"?0:0}" data-n="${x[1]}" value="${esc(S.n[x[1]])}" aria-label="${esc(x[2])}" title="${esc(x[4])}">`:""}<button type="button" data-rmb="${x[0]}:${esc(x[1])}" aria-label="Remove ${esc(lab)}">×</button></span>`}).join("")||'<span class="hint">None on. Add totems, daily boosts, runes, events and more from the list.</span>';
  fillProg()}
function fillProg(){const b=S.b,n=S.n;const P_=[b.trader!==false&&"Trader",b.lighthouse&&"Lighthouse",b.ancient&&"Ancient",b.spirits&&"Spirits",+n.dredge>0&&`${n.dredge} Dredge quests`,+n.xp>0&&`${n.xp} Experience`,+n.tomb>0&&`Tomb Mastery ${n.tomb}`,+n.mastery>0&&`Mastery +${n.mastery}×`].filter(Boolean);
  $("progSum").textContent=P_.length?P_.join(", "):"Nothing set yet: quest luck, Dredge quests, Experience, masteries"}
document.addEventListener("change",e=>{if(e.target.id!=="bAdd"||!e.target.value)return;const [k,...r]=e.target.value.split(":");const key=r.join(":");const x=BOOSTS.flatMap(([,l])=>l).find(y=>y[0]===k&&y[1]===key);
  if(k==="b")S.b[key]=true;else if(k==="c")S.cons=[...(S.cons||[]),key];else if(x)S.n[key]=x[3];if(key==="sun"||key==="solo"||key==="purity"||key==="vet")syncRuneFlags();save();all()});
document.addEventListener("click",e=>{const r=e.target.closest("[data-rmb]");if(!r)return;const [k,...rr]=r.dataset.rmb.split(":");const key=rr.join(":");
  if(k==="b")S.b[key]=false;else if(k==="c")S.cons=(S.cons||[]).filter(n=>n!==key);else S.n[key]=key==="friendTotem"?-1:0;if(["sun","solo","purity","vet"].includes(key))syncRuneFlags();save();all()});
$("bClear").onclick=()=>{BOOSTS.flatMap(([,l])=>l).forEach(x=>{if(x[0]==="b")S.b[x[1]]=false;else if(x[0]==="n")S.n[x[1]]=x[1]==="friendTotem"?-1:0});S.cons=[];save();all();toast("Boosts cleared")};
// rune ticks here keep the rune list (shared with the Runes page) in step
function syncRuneFlags(){const R=new Set(S.runes||[]);const set=(n,on)=>on?R.add(n):R.delete(n);set("Solitude",!!S.b.solo);set("Purity",!!S.b.purity);set("Veteran",!!S.b.vet);if(!S.b.sun){R.delete("Sunblessed");R.delete("Abyssal")}else if(!R.has("Sunblessed")&&!R.has("Abyssal"))R.add("Sunblessed");S.runes=[...R]}
function fillCons(){fillBoosts()}
function fillRhy(){const k=STREAK[S.shEn];$("rhyWrap").hidden=!k;$("rhy").checked=S.rhy!==false;if(k)$("rhyTxt").textContent=`Full perfect-dig streak (+${k[1]}× ${k[0].toLowerCase()})`}
function fillRunes(){const RU=(S.runes||[]).filter(n=>!["Sunblessed","Abyssal","Solitude","Purity","Veteran"].includes(n));$("runeList").innerHTML=RU.map(n=>`<span class="bchip" style="padding-right:10px">${esc(n)}</span>`).join("")||'<span class="hint">None</span>'}
window.ptSetRunes=list=>{S.runes=list||[];S.b.sun=S.runes.includes("Sunblessed")||S.runes.includes("Abyssal");S.b.solo=S.runes.includes("Solitude");S.b.purity=S.runes.includes("Purity");S.b.vet=S.runes.includes("Veteran");save();all()};
$("runePage").onclick=()=>{try{window.parent.ptCallTool("runes","ptOpenItem","")}catch(e){}};
function all(){fillEnch();fillPots();fillCons();fillRhy();fillRunes();$("allMut").innerHTML=`<option value="">Set all mutations…</option>`+MUTS.map(m=>`<option value="${m[0]}">${m[0]==="None"?"No mutation":m[0]}</option>`).join("");fillTools();buildSlots();paintPicks();fillMus();musEditor();
  document.querySelectorAll("[data-b]").forEach(i=>i.checked=i.dataset.b==="trader"?S.b.trader!==false:!!S.b[i.dataset.b]);document.querySelectorAll("[data-n]").forEach(i=>i.value=S.n[i.dataset.n]??0);$("ownedOnly").checked=!!S.owned;render()}
document.addEventListener("change",e=>{const t=e.target;
  if(t.id==="potAdd"){if(t.value==="__money"){const add=moneyPots().map(p=>p.n).filter(n=>!(S.pots||[]).includes(n));S.pots=[...(S.pots||[]),...add];fillPots();toast(`Added ${add.length} money potion${add.length===1?"":"s"}`)}else if(t.value){S.pots=[...(S.pots||[]),t.value];fillPots()}else return}
  else if(t.id==="bAdd"){return}
  else if(t.id==="rhy"){S.rhy=t.checked}
  else if(t.dataset.mm){const [r,i]=t.dataset.mm.split("|");S.museumBoard[r][+i].m=t.value||null}
  else if(t.dataset.mu){const [r,i]=t.dataset.mu.split("|");S.museumBoard[r][+i].u=t.value}
  else if(t.id==="mus"){S.mus=t.value;musEditor()}else if(t.id==="panEn"){S.panEn=t.value;fillEnch()}else if(t.id==="shEn"){S.shEn=t.value;fillEnch();fillRhy()}else if(t.id==="trinket"){S.trinket=t.value;fillEnch()}else if(t.id==="trkRoll"){S.trkMax=t.value==="max";fillEnch()}
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
// coming back to this tab: re-read the museum, but only rebuild when it actually changed.
// Rebuilding on every focus replaced the buttons under the mouse, so the first click on the page got lost.
const musSig=()=>{try{return ["mp-board","mp-loadouts"].map(k=>localStorage.getItem(k)||"").join("|")}catch(e){return ""}};
let lastMus=musSig();
window.addEventListener("focus",()=>{const sg=musSig();if(sg===lastMus)return;lastMus=sg;fillMus();render()});
window.ptRefresh=()=>{fillMus();render()};window.ptYouChanged=renderSpread;
// ---- Build finder: searches gear, mutations, tools, trinket and museum for the best build for a goal ----
// "Rare finds per pan" scores luck × capacity^0.565: for a mineral that's the rarest in its zone, odds per mineral go up in step
// with luck and a pan holds 0.678 × capacity^0.565 minerals (the capacity graph in How It Works). Everything you've set under
// Boosts stays as it is, so every build is compared with the same boosts.
const BF_UNIQ=new Set(["Dredge Master's Ring","Ring of Champions","Ring of the Stars","Scarab Signet","Embalmer's Ring","Ring of Ra"]);
const BF_GOALS=[["rare","Rare finds per pan"],["luck","Luck only"]];
const BF_SKIPMUS=new Set();
function bfCfg(){S.bf=Object.assign({goal:"rare",muts:MUTS.map(m=>m[0]).filter(m=>m!=="Festive"),tools:true,trinket:true,museum:true,owned:false,perfect:true},S.bf||{});return S.bf}
function bfScore(st,goal){const t=compute(st).tot;const L=Math.max(1e-9,t.Luck),C=Math.max(1e-9,t.Capacity);return goal==="luck"?Math.log(L):Math.log(L)+.565*Math.log(C)}
function renderBf(){const c=bfCfg();const on=S.showBf===true;$("showBf").checked=on;$("bfBody").hidden=!on;if(!on)return;
  $("bfGoal").innerHTML=BF_GOALS.map(([k,l])=>`<button type="button" class="chip" data-bfg="${k}" aria-pressed="${c.goal===k}">${l}</button>`).join("");
  $("bfMuts").innerHTML=MUTS.map(m=>`<button type="button" class="chip" data-bfm="${esc(m[0])}" aria-pressed="${c.muts.includes(m[0])}">${esc(m[0])}</button>`).join("");
  ["tools","trinket","museum","owned","perfect"].forEach(k=>$("bf_"+k).checked=!!c[k]);
  $("bfGoalTxt").innerHTML=c.goal==="luck"?"Highest total luck. Capacity doesn't count.":"Best odds per pan at the rarest minerals: <b>luck × capacity<sup>0.565</sup></b>. Capacity gives more minerals per pan but fades (see the capacity graph in How It Works), while luck keeps paying off for the rarest ones."}
// the search itself, shared by the finder card here and the Best Build tool (which passes its own scoring)
// c: {muts, tools, trinket, museum, owned, perfect, night, useful}; scoreTot(totals, state) -> bigger is better
async function bfEngine(c,scoreTot,onProg){
  // skipped parts (can't get them): never picked
  const SKI=c.skip||{item:[],en:[],min:[]},skI=new Set(SKI.item||[]),skE=new Set(SKI.en||[]),skM=new Set(SKI.min||[]);
  const ok=n=>(!c.owned||own(n))&&!skI.has(n);
  const EN=(P.ench||{pan:[],shovel:[]});const noPerf=c.perfect===false;
  const base=clone(S);base.only=null;if(c.night!=null)base.b=Object.assign({},base.b,{night:!!c.night});if(noPerf||c.streak===false)base.rhy=false;
  // conditions you can (or can't) keep up, from the Best Build tool's Assumptions tab
  if(c.sun===false)base.noSun=true;if(c.sun===true)delete base.noSun;if(c.nomad===false)base.nomadOff=true;if(c.nomad===true)delete base.nomadOff;
  if(c.trkMax!=null)base.trkMax=!!c.trkMax;if(c.mastery!=null)base.n=Object.assign({},base.n,{mastery:+c.mastery||0});
  if(c.events)base.b=Object.assign({},base.b,{meteor:!!c.events.meteor,weather:!!c.events.weather});
  // a brand-new build (Build Maker): no equipment, trinket or museum to start from
  if(c.fresh){base.slots={};if(c.trinket)base.trinket="";if(c.museum){base.museumBoard={};base.mus="custom"}}
  // potions and consumables (Build Maker): none, every one at once, or as set here
  if(c.cons==="none"){base.pots=[];base.cons=[]}else if(c.cons==="all"){base.pots=((P.x2||{}).potions||[]).map(p=>p.n);base.cons=CONS.map(x=>x.n)}
  else if(c.cons==="pick"){const PN=((P.x2||{}).potions||[]).map(p=>p.n);base.pots=(c.pots||[]).filter(n=>PN.includes(n));base.cons=(c.consList||[]).filter(n=>CONS.some(x=>x.n===n))}
  // can't do perfect digs: streak enchants never build up, and digging without Mastered means autopan at about two thirds of your luck
  const tot=st=>{const t=compute(st).tot;if(noPerf&&st.shEn!=="Mastered")t.Luck*=2/3;return t};
  // ties: when a choice does nothing for the goal, the one with the most in every other stat wins (a tiny second score)
  const SEC=["Luck","Capacity","Size Boost","Modifier Boost","Sell Boost","Dig Strength","Shake Strength","Dig Speed","Shake Speed"];
  const score0=st=>scoreTot(tot(st),st);
  const score=st=>{const t=tot(st);return scoreTot(t,st)+1e-6*SEC.reduce((a,k)=>a+Math.log(1+Math.max(0,+t[k]||0)),0)};
  const pans=G.pans.filter(x=>ok(x.name)||(x.name===base.pan&&!skI.has(x.name))),shovels=G.shovels.filter(x=>ok(x.name)||(x.name===base.shovel&&!skI.has(x.name)));
  const shEns=["",...EN.shovel.map(x=>x.n).filter(n=>(!noPerf||!STREAK[n])&&!skE.has(n))];
  const panEns=["",...EN.pan.map(x=>x.n).filter(n=>!skE.has(n))];
  const TRN=((P.x2||{}).trinkets||[]).map(t=>t.n).filter(n=>ok(n)||(n===base.trinket&&!skI.has(n)));
  const POOL={};["Necklace","Charm","Ring"].forEach(sl=>POOL[sl]=EQ.filter(x=>x.slot===sl&&EQB[x.n]&&ok(x.n)).map(x=>x.n));
  const muts=MUTS.filter(m=>c.muts.includes(m[0])).map(m=>m[0]);
  const useful=c.useful||["Luck","Capacity"];
  // museum: strength before speed, so slots and modifiers are only picked for speed when they also give something else useful
  const musUseful=c.musUseful||useful;
  const MC={};MORDER.forEach(r=>MC[r]=P.mins.filter(m=>m.r===r&&!BF_SKIPMUS.has(m.n)&&!skM.has(m.n)&&m.mu&&m.mu.b&&m.mu.b.some(([k])=>musUseful.includes(k))).map(m=>m.n).concat(["Any"]));
  const MODN=Object.keys(MODS).filter(u=>u==="None"||MODS[u][1].some(k=>musUseful.includes(k)));
  const start=clone(base);if(c.museum){start.museumBoard=clone(musBoard(base)||{});start.mus="custom"}
  if(noPerf&&STREAK[start.shEn])start.shEn="";
  // a skipped part you already have is taken off before the search
  if(skI.has(start.pan)&&pans.length)start.pan=pans[0].name;if(skI.has(start.shovel)&&shovels.length)start.shovel=shovels[0].name;
  if(skE.has(start.panEn))start.panEn="";if(skE.has(start.shEn))start.shEn="";if(skI.has(start.trinket))start.trinket="";
  SLOTDEF.forEach(([k])=>{const v=start.slots[k];if(v&&skI.has(v.n))delete start.slots[k]});
  if(start.museumBoard)Object.values(start.museumBoard).forEach(a=>(a||[]).forEach((x,i)=>{if(x&&skM.has(x.m))a[i]={m:"Any",u:x.u}}));
  // pieces you already wear keep their stars and roll; anything new is counted at 6★ and a 100% roll
  SLOTDEF.forEach(([k])=>{const v=start.slots[k];if(v&&v.n&&!muts.includes(v.m||"None"))v.m=muts[muts.length-1]});
  const before=tot(base),beforeSc=score(base);
  let rs=12345;const rnd=()=>{rs=(rs*1103515245+12345)%2147483648;return rs/2147483648};
  let best=null;const RESTARTS=c.restarts||6;
  for(let rep=0;rep<RESTARTS;rep++){if(onProg)onProg(rep,RESTARTS);await new Promise(r=>setTimeout(r,20));
    const st=clone(start);
    if(rep>0){SLOTDEF.forEach(([k,,slot])=>{const pool=POOL[slot];if(!pool.length)return;let n,tries=0;do{n=pool[Math.floor(rnd()*pool.length)]}while(BF_UNIQ.has(n)&&tries++<50&&Object.entries(st.slots).some(([kk,v])=>kk!==k&&v&&v.n===n));st.slots[k]={n,l:"6",m:muts[Math.floor(rnd()*muts.length)],q:100}})}
    let cur=score(st),changed=true,it=0;
    while(changed&&it++<25){changed=false;
      if(c.tools){
        {let bb=null;for(const p of pans)for(const e of panEns){const v=score(Object.assign({},st,{pan:p.name,panEn:e}));if(!bb||v>bb.v)bb={v,p:p.name,e}}if(bb&&bb.v>cur+1e-12){st.pan=bb.p;st.panEn=bb.e;cur=bb.v;changed=true}}
        {let bb=null;for(const p of shovels)for(const e of shEns){const v=score(Object.assign({},st,{shovel:p.name,shEn:e}));if(!bb||v>bb.v)bb={v,p:p.name,e}}if(bb&&bb.v>cur+1e-12){st.shovel=bb.p;st.shEn=bb.e;cur=bb.v;changed=true}}
        {let bb=null;for(const p of pans)for(const q of shovels){const v=score(Object.assign({},st,{pan:p.name,shovel:q.name}));if(!bb||v>bb.v)bb={v,p:p.name,s:q.name}}if(bb&&bb.v>cur+1e-12){st.pan=bb.p;st.shovel=bb.s;cur=bb.v;changed=true}}}
      if(c.trinket){let bb=null;for(const n of ["",...TRN]){const v=score(Object.assign({},st,{trinket:n}));if(!bb||v>bb.v)bb={v,n}}if(bb&&bb.v>cur+1e-12){st.trinket=bb.n;cur=bb.v;changed=true}}
      for(const [k,,slot] of SLOTDEF){let bb=null;const others=Object.entries(st.slots).filter(([kk])=>kk!==k).map(([,v])=>v&&v.n);const keep=st.slots[k];
        for(const n of POOL[slot]){if(BF_UNIQ.has(n)&&others.includes(n))continue;for(const m of muts){const same=keep&&keep.n===n;st.slots[k]=same?Object.assign({},keep,{m}):{n,l:"6",m,q:100};const v=score(st);if(!bb||v>bb.v)bb={v,slot:st.slots[k]}}}
        st.slots[k]=keep;if(bb&&bb.v>cur+1e-12){st.slots[k]=bb.slot;cur=bb.v;changed=true}}
      if(c.museum){const brd=st.museumBoard;for(const r of MORDER){brd[r]=(brd[r]||[]).slice(0,MSLOTS[r]);for(let i=0;i<MSLOTS[r];i++){const keep=brd[r][i];const used=new Set(Object.values(brd).flat().filter(x=>x&&x.m&&x.m!=="Any").map(x=>x.m));let bb=null;
        for(const m of MC[r]){if(m!=="Any"&&used.has(m)&&!(keep&&keep.m===m))continue;for(const u of MODN){brd[r][i]={m,u};const v=score(st);if(!bb||v>bb.v)bb={v,m,u}}}
        brd[r][i]=keep;if(bb&&bb.v>cur+1e-12){brd[r][i]={m:bb.m,u:bb.u};cur=bb.v;changed=true}}}}
    }
    if(!best||cur>best.sc+1e-12)best={sc:cur,st};
  }
  // anything that adds nothing to the goal becomes "Any" (or nothing): museum slots, enchants, trinket, gear slots
  {const f=best.st,s0=()=>score0(f);let ref=s0();const same=()=>Math.abs(s0()-ref)<1e-12;
    if(c.museum)MORDER.forEach(r=>((f.museumBoard||{})[r]||[]).forEach((x,i,a)=>{if(!x||x.m==="Any")return;const keep=x;a[i]={m:"Any",u:x.u};if(!same()){a[i]={m:x.m,u:"None"};if(!same())a[i]=keep}}));
    const any=f.anyParts={slots:{}};
    if(c.tools){for(const k of ["panEn","shEn"]){if(!f[k])continue;const keep=f[k];f[k]="";if(same())any[k]=true;else f[k]=keep}
      // a pan or shovel where every other one scores the same: any will do
      if(f.pan&&pans.every(p=>{const keep=f.pan;f.pan=p.name;const r=same();f.pan=keep;return r}))any.pan=true;
      if(f.shovel&&shovels.every(p=>{const keep=f.shovel;f.shovel=p.name;const r=same();f.shovel=keep;return r}))any.shovel=true}
    if(c.trinket&&f.trinket){const keep=f.trinket;f.trinket="";if(same())any.trinket=true;else f.trinket=keep}
    SLOTDEF.forEach(([k])=>{const v=f.slots[k];if(!v||!v.n)return;delete f.slots[k];if(same())any.slots[k]=true;else f.slots[k]=v});}
  // why this build: for each part, the best thing you could put there instead and how much worse it is
  const fin=best.st,sc=score0(best.st),why=[];const pct=v=>{const d=v-sc;return Math.abs(d)<1e-12?0:(Math.exp(d)-1)*100};
  const lab=(p,e)=>p+(e?", "+e:"");
  if(c.tools){
    {let bb=null;for(const p of pans){if(p.name===fin.pan)continue;for(const e of panEns){const v=score0(Object.assign({},fin,{pan:p.name,panEn:e}));if(!bb||v>bb.v)bb={v,t:lab(p.name,e)}}}if(bb)why.push({part:"Pan",pick:lab(fin.pan,fin.panEn),alt:bb.t,pct:pct(bb.v)})}
    {let bb=null;for(const e of panEns){if(e===fin.panEn)continue;const v=score0(Object.assign({},fin,{panEn:e}));if(!bb||v>bb.v)bb={v,t:e||"no enchant"}}if(bb)why.push({part:"Pan enchant",pick:fin.panEn||"no enchant",alt:bb.t,pct:pct(bb.v)})}
    {let bb=null;for(const p of shovels){if(p.name===fin.shovel)continue;for(const e of shEns){const v=score0(Object.assign({},fin,{shovel:p.name,shEn:e}));if(!bb||v>bb.v)bb={v,t:lab(p.name,e)}}}if(bb)why.push({part:"Shovel",pick:lab(fin.shovel,fin.shEn),alt:bb.t,pct:pct(bb.v)})}
    {let bb=null;for(const e of shEns){if(e===fin.shEn)continue;const v=score0(Object.assign({},fin,{shEn:e}));if(!bb||v>bb.v)bb={v,t:e||"no enchant"}}if(bb)why.push({part:"Shovel enchant",pick:fin.shEn||"no enchant",alt:bb.t,pct:pct(bb.v)})}}
  if(c.trinket){let bb=null;for(const n of ["",...TRN]){if(n===fin.trinket)continue;const v=score0(Object.assign({},fin,{trinket:n}));if(!bb||v>bb.v)bb={v,t:n||"no trinket"}}if(bb)why.push({part:"Trinket",pick:fin.trinket||"no trinket",alt:bb.t,pct:pct(bb.v)})}
  const seen=new Set();
  for(const [k,l,slot] of SLOTDEF){const v0=fin.slots[k];if(!v0||!v0.n)continue;const key=slot+"|"+v0.n+"|"+v0.m;if(seen.has(key))continue;seen.add(key);
    const cnt=SLOTDEF.filter(([kk,,sl])=>sl===slot&&fin.slots[kk]&&fin.slots[kk].n===v0.n&&fin.slots[kk].m===v0.m).length;
    const others=Object.entries(fin.slots).filter(([kk])=>kk!==k).map(([,v])=>v&&v.n);let bi=null,bm=null;
    for(const n of POOL[slot]){if(n===v0.n||(BF_UNIQ.has(n)&&others.includes(n)))continue;for(const m of muts){fin.slots[k]={n,l:"6",m,q:100};const v=score0(fin);if(!bi||v>bi.v)bi={v,t:n+(m!=="None"?` (${m})`:"")}}}
    for(const m of muts){if(m===v0.m)continue;fin.slots[k]=Object.assign({},v0,{m});const v=score0(fin);if(!bm||v>bm.v)bm={v,t:m}}
    fin.slots[k]=v0;const nm=(slot==="Ring"&&cnt>1?cnt+"× ":"")+v0.n+(v0.m&&v0.m!=="None"?` (${v0.m})`:"");
    if(bi)why.push({part:slot==="Ring"?"Ring":l,pick:nm,alt:bi.t,pct:pct(bi.v),note:cnt>1?"for one of them":""});
    if(bm)why.push({part:"Mutation",pick:`${v0.m||"None"} on ${v0.n}`,alt:bm.t,pct:pct(bm.v),note:cnt>1?"on one of them":""})}
  // a part that adds nothing to the goal: going without it scores the same, so the alternative is "anything"
  const zero=(o)=>Math.abs(score0(Object.assign({},fin,o))-sc)<1e-12;
  const AP=fin.anyParts||{slots:{}};
  why.forEach(w=>{if((w.part==="Pan"&&AP.pan)||(w.part==="Shovel"&&AP.shovel)){w.pick="Any";w.alt="Any";w.none=true;w.pct=0}
    if((w.part==="Pan enchant"&&AP.panEn)||(w.part==="Shovel enchant"&&AP.shEn)||(w.part==="Trinket"&&AP.trinket)){w.pick="Any";w.alt="Any";w.none=true;w.pct=0}});
  why.forEach(w=>{if(w.pct!==0)return;
    if((w.part==="Pan enchant"&&zero({panEn:""}))||(w.part==="Shovel enchant"&&zero({shEn:""}))||(w.part==="Trinket"&&zero({trinket:""}))){w.alt="Any";w.none=true}});
  // what every build here was compared under
  const as=[];const b=fin.b||{},n=fin.n||{};
  as.push("Every new piece at 6★ with a 100% roll; pieces you already had keep theirs");
  if(b.night)as.push("It's night, so Night Luck counts (Dullahan's Curse)");else as.push("It's day: Night Luck doesn't count");
  if(sunOn(fin))as.push("Sun Blessing fully charged: it fills in sunlight or from Luminant Totems");
  if(rhyOn(fin)&&STREAK[fin.shEn])as.push(`${fin.shEn} at a full perfect-dig streak`);
  if(noPerf)as.push("No perfect digs: autopan, which only gets your full luck with Mastered");
  if(fin.trinket==="Nomad's Compass")as.push(fin.nomadOff?"Nomad's Compass not stacked (no luck from it)":"Nomad's Compass fully stacked (×1.9 luck)");
  if(fin.noSun&&sunGear(fin).length)as.push("Sun Blessing not counted (you said you can't keep it charged)");
  if(!noPerf&&fin.rhy===false)as.push("Streak enchants not counted (you said you can't hold a perfect-dig streak)");
  if(fin.trinket==="Senet Die")as.push("Senet Die at its average roll (×1.33 luck)");
  if(TRROLL[fin.trinket])as.push(`${fin.trinket} at its ${fin.trkMax?"max":"average"} roll`);
  if(+n.mastery>0)as.push(`Location mastery +${n.mastery}× luck`);
  const rn=(fin.runes||[]).length?fin.runes:[b.purity&&"Purity",b.vet&&"Veteran",b.sun&&"Abyssal or Sunblessed",b.solo&&"Solitude"].filter(Boolean);if(rn.length)as.push("Runes: "+rn.join(", "));
  if(c.cons==="all")as.push("Every potion and consumable active at once");else if(c.cons==="none"||(c.cons==="pick"&&!(fin.pots||[]).length&&!(fin.cons||[]).length))as.push("No potions or consumables");
  else{if((fin.pots||[]).length)as.push("Potions: "+fin.pots.join(", "));if((fin.cons||[]).length)as.push("Consumables: "+fin.cons.join(", "))}
  if(b.luckTotem||b.strTotem||b.lumTotem||+n.friendTotem>=0)as.push("Totems as set under Boosts");
  if(b.meteor||b.weather)as.push("Event: "+[b.meteor&&"Meteor Shower",b.weather&&"weather"].filter(Boolean).join(" + "));
  as.push("Luck and capacity worked out with the formulas in How It Works, which are estimates fitted on testing");
  return {st:best.st,sc:best.sc,before,beforeSc,base,tot:tot(best.st),museum:!!c.museum,why,assume:as}}
// finder results as spreadsheet rows (shared with the Best Build tool)
window.ptFinderRows=(R,extra)=>{const it=v=>v&&v.n?v.n+(v.m&&v.m!=="None"?` (${v.m})`:""):"";const st=R.st,b=R.base||S;const out=[...(extra||[])];
  out.push(["Luck",Math.round(R.tot.Luck),"now",Math.round(R.before.Luck)],["Capacity",Math.round(R.tot.Capacity),"now",Math.round(R.before.Capacity)],[],["Part","Best build","Now"]);
  out.push(["Pan",[st.pan,st.panEn].filter(Boolean).join(", "),[b.pan,b.panEn].filter(Boolean).join(", ")],["Shovel",[st.shovel,st.shEn].filter(Boolean).join(", "),[b.shovel,b.shEn].filter(Boolean).join(", ")],["Trinket",st.trinket||"",b.trinket||""]);
  SLOTDEF.forEach(([k,l])=>out.push([l,it(st.slots[k]),it(b.slots&&b.slots[k])]));
  if(R.museum){out.push([],["Museum","Mineral","Modifier"]);MORDER.forEach(r=>((st.museumBoard||{})[r]||[]).forEach((x,i)=>{if(x&&x.m)out.push([`${r} ${i+1}`,x.m,x.u||""])}))}
  if(R.why&&R.why.length){out.push([],["Alternatives","Picked","Best alternative","% worse if swapped"]);R.why.forEach(w=>out.push([w.part,w.pick,w.alt+(w.note?` (${w.note})`:""),Math.round(-w.pct*10)/10]))}
  if(R.assume){out.push([],["Assumes"]);R.assume.forEach(a=>out.push([a]))}
  return out};
// "why" and "assumptions" as HTML, shared by the finder here and the Best Build tool
window.ptWhyHTML=R=>{if(!R||!R.why)return "";const f=w=>w.pct===0?(w.none?`<span class="bfnone">No bonus</span>`:"Same"):w.pct>-0.05?"about the same":fmt(-w.pct,-w.pct<10?1:0)+"% worse";
  // "no enchant", "no trinket" and "Any" as a quiet pill instead of plain words
  const nm=t=>/^(no enchant|no trinket|Any)$/.test(t)?`<span class="bfnone">${t==="Any"?"Any":"None"}</span>`:esc(t);
  return `<details class="bfwhy" open><summary><b>Alternatives and what they cost</b></summary><table class="bfwt"><tr><th></th><th>Picked</th><th>Best alternative</th><th>If you swapped it</th></tr>${R.why.map(w=>`<tr><td>${esc(w.part)}</td><td>${nm(w.pick)}</td><td>${nm(w.alt)}${w.note&&!w.none?` <span class="hint">(${esc(w.note)})</span>`:""}</td><td class="${w.pct>-1?"near":""}">${f(w)}</td></tr>`).join("")}</table>
  <p class="hint">"Same" means swapping changes nothing. "No bonus" means that part adds nothing to this goal, so use anything there. "About the same" or under 1% is a near tie: use whichever you have.</p></details>
  <details class="bfwhy"><summary><b>What this assumes</b></summary><ul class="bfas">${R.assume.map(a=>`<li>${esc(a)}</li>`).join("")}</ul><p class="hint">How it's worked out: <button type="button" class="lnk" data-opentool="mechanics">How It Works</button>, <button type="button" class="lnk" data-opentool="formulas">Formulas</button></p></details>`};
window.ptWhyCSS=`.bfnone{display:inline-block;padding:1px 8px;border-radius:999px;background:var(--sunk);border:1px solid var(--line);color:var(--muted);font:600 11.5px var(--f-body,inherit)}.bfwhy{margin-top:10px;border:1px solid var(--line);border-radius:10px;padding:8px 12px}.bfwhy summary{cursor:pointer}.bfwt{width:100%;border-collapse:collapse;font-size:13px;margin-top:6px}.bfwt th{text-align:left;font:600 11px var(--f-body);color:var(--muted);padding:4px 6px;border-bottom:1px solid var(--line)}.bfwt td{padding:5px 6px;border-bottom:1px dashed var(--line);vertical-align:top}.bfwt td:first-child{color:var(--muted);white-space:nowrap}.bfwt td:last-child{white-space:nowrap;font-family:var(--f-mono)}.bfwt td.near{color:var(--warn,#9a5b00)}.bfas{margin:6px 0;padding-left:18px;font-size:13.5px;display:flex;flex-direction:column;gap:3px}.lnk{background:none;border:0;padding:0;color:var(--accent);font:inherit;text-decoration:underline;cursor:pointer}`;
async function runBf(){const c=bfCfg();if(!c.muts.length){ptToast("Pick at least one mutation");return}
  const btn=$("bfRun");btn.disabled=true;const prog=$("bfProg");const goal=c.goal;
  const sf=goal==="luck"?t=>Math.log(Math.max(1e-9,t.Luck)):t=>Math.log(Math.max(1e-9,t.Luck))+.565*Math.log(Math.max(1e-9,t.Capacity));
  const R=await bfEngine(Object.assign({},c,{useful:goal==="luck"?["Luck"]:["Luck","Capacity"]}),sf,(i,n)=>prog.textContent=`Searching… ${i+1} of ${n}`);
  btn.disabled=false;prog.textContent="";BF_LAST={st:R.st,goal,before:R.before,beforeSc:R.beforeSc,sc:R.sc,tot:R.tot,museum:c.museum,why:R.why,assume:R.assume};showBf()}
// for the Best Build tool and other tools
// quality boxes stay tucked away at a 100% roll; click to change, or pick 5★ to see them
document.addEventListener("click",e=>{const q=e.target.closest("[data-qopen]");if(!q)return;const inp=document.querySelector(`[data-q="${q.dataset.qopen}"]`);q.hidden=true;if(inp){inp.hidden=false;inp.focus();inp.select()}});
document.addEventListener("change",e=>{const t=e.target;if(!t.dataset||!t.dataset.lvl)return;const k=t.dataset.lvl,inp=document.querySelector(`[data-q="${k}"]`),qb=document.querySelector(`[data-qopen="${k}"]`);if(!inp||!qb)return;const show=t.value!=="6"||+inp.value!==100;inp.hidden=!show;qb.hidden=show});
window.ptFindBuild=(c,sf,onProg)=>bfEngine(c,sf,onProg);
window.ptConsumables=()=>CONS.map(c=>({n:c.n,fx:c.fx}));
// the saved build card for any build (Build Maker shows it on the page)
window.ptBuildImage=async(st,title)=>{const keep={bname:S.bname,isoOff:S.isoOff,only:S.only,brkLevel:S.brkLevel,brkHide:S.brkHide};
  Object.assign(S,{bname:title||"",isoOff:[],only:null,brkLevel:0,brkHide:[]});try{return await buildImage(st,compute(st))}finally{Object.assign(S,keep)}};
window.ptBuildTextOf=st=>{const keep=S;S=Object.assign(clone(keep),st);window.S=S;try{return buildSheetText()}finally{S=keep;window.S=keep}};
window.ptUseBuild=(st,museum)=>{Object.assign(S,{pan:st.pan,panEn:st.panEn,shovel:st.shovel,shEn:st.shEn,trinket:st.trinket,slots:clone(st.slots)});if(museum){S.mus="custom";S.museumBoard=clone(st.museumBoard)}if(st.b&&"night" in st.b)S.b.night=st.b.night;if(st.rhy===false)S.rhy=false;save();all()};
// a build's gear with your own boosts (for comparing builds fairly)
window.ptTotalsWithGear=g=>{const st=Object.assign(clone(S),{pan:g.pan||"",panEn:g.panEn||"",shovel:g.shovel||"",shEn:g.shEn||"",trinket:g.trinket||"",slots:clone(g.slots||{}),mus:"custom",museumBoard:clone(g.museumBoard||{}),only:null});return compute(st).tot};
window.ptSlotDefs=()=>SLOTDEF.map(([k,l,slot])=>[k,l,slot]);
window.ptCalcSnapshot=()=>clone(S);
window.ptMusRows=()=>MORDER.map(r=>[r,MSLOTS[r]]);
let BF_LAST=null;
function showBf(){const R=BF_LAST;if(!R){$("bfOut").innerHTML="";return}const st=R.st,t=R.tot||compute(st).tot;
  const g=Math.exp((R.sc!=null?R.sc:bfScore(st,R.goal))-R.beforeSc)-1;const mut=v=>v&&v.m&&v.m!=="None"?` (${esc(v.m)})`:"";
  const row=(lab,now,was)=>`<tr class="${now===was?"":"chg"}"><td>${lab}</td><td>${now||"-"}</td><td class="was">${now===was?"":(was||"-")}</td></tr>`;
  const it=v=>v&&v.n?esc(v.n)+mut(v)+(v.l==="6"&&(v.q??100)===100?"":`, ${v.l==="5"?"5":"6"}★ ${v.q??100}%`):"";
  const rows=[row("Pan",esc(st.pan)+(st.panEn?`, ${esc(st.panEn)}`:""),esc(S.pan)+(S.panEn?`, ${esc(S.panEn)}`:"")),row("Shovel",esc(st.shovel)+(st.shEn?`, ${esc(st.shEn)}`:""),esc(S.shovel)+(S.shEn?`, ${esc(S.shEn)}`:"")),row("Trinket",esc(st.trinket||""),esc(S.trinket||""))]
    .concat(SLOTDEF.map(([k,l])=>row(l,it(st.slots[k]),it(S.slots[k]))));
  let mus="";if(R.museum){const b=st.museumBoard||{};mus=`<h3 class="bfh">Museum</h3><div class="bfmus">${MORDER.map(r=>`<div><span class="lab" style="color:${rc(r)}">${r}</span> ${(b[r]||[]).filter(Boolean).map(x=>`${esc(x.m)}${x.u&&x.u!=="None"?` <span class="hint">(${esc(x.u)})</span>`:""}`).join(", ")||"-"}</div>`).join("")}</div>`}
  const capL=.565*t.Luck/Math.max(1,t.Capacity);
  $("bfOut").innerHTML=`<div class="bfsum"><div><span class="lab">Luck</span><b>${fmt(t.Luck,0)}</b> <span class="hint">was ${fmt(R.before.Luck,0)}</span></div><div><span class="lab">Capacity</span><b>${fmt(t.Capacity,0)}</b> <span class="hint">was ${fmt(R.before.Capacity,0)}</span></div><div><span class="lab">${R.goal==="luck"?"Luck":"Rare finds per pan"}</span><b class="${g>0.0005?"pos":""}">${g>0.0005?(g<1?"+"+fmt(g*100,g<.1?1:0)+"%":"×"+fmt(g+1,g+1<10?2:0)):"no better build found"}</b></div></div>
    ${R.goal==="luck"?"":`<p class="hint">At this build 1 capacity is worth about ${fmt(capL,capL<10?2:0)} luck (0.565 × luck ÷ capacity).</p>`}
    <table class="bft"><tr><th></th><th>Best build</th><th>Now</th></tr>${rows.join("")}</table>${mus}
    ${window.ptWhyHTML(R)}<div class="bfa"><button type="button" class="btn" id="bfUse">Use this build</button><button type="button" class="btn" id="bfCopy">Copy for Build Sheets</button><button type="button" class="btn" id="bfCsv">Download as spreadsheet</button></div>`}
$("showBf").addEventListener("change",()=>{S.showBf=$("showBf").checked;save();renderBf()});
$("bfRun").addEventListener("click",runBf);
document.head.insertAdjacentHTML("beforeend",`<style>${window.ptWhyCSS}</style>`);
document.addEventListener("click",async e=>{if(e.target.closest("#bfCsv")&&BF_LAST){if(await ptDownloadCSV("Best build",window.ptFinderRows(Object.assign({base:S},BF_LAST),[["Goal",BF_LAST.goal==="luck"?"Luck only":"Rare finds per pan"],[]])))ptToast("Download started");return}const o=e.target.closest("[data-opentool]");if(o){try{window.parent.ptOpenTool(o.dataset.opentool)}catch(err){}}});
$("bfMore").addEventListener("click",()=>{try{window.parent.ptOpenTool("bestbuild")}catch(e){}});
["tools","trinket","museum","owned","perfect"].forEach(k=>$("bf_"+k).addEventListener("change",()=>{bfCfg()[k]=$("bf_"+k).checked;save()}));
document.addEventListener("click",e=>{const g=e.target.closest("[data-bfg]");if(g){bfCfg().goal=g.dataset.bfg;save();renderBf();return}
  const m=e.target.closest("[data-bfm]");if(m){const c=bfCfg(),n=m.dataset.bfm;c.muts=c.muts.includes(n)?c.muts.filter(x=>x!==n):c.muts.concat([n]);c.muts=MUTS.map(x=>x[0]).filter(x=>c.muts.includes(x));save();renderBf();return}
  if(e.target.closest("#bfUse")&&BF_LAST){window.ptUseBuild(BF_LAST.st,BF_LAST.museum);ptToast("Build loaded into the calculator");BF_LAST=null;showBf();return}
  if(e.target.closest("#bfCopy")&&BF_LAST){const keep=S;S=Object.assign(clone(keep),BF_LAST.st);window.S=S;let txt="";try{txt=buildSheetText()}finally{S=keep;window.S=keep}
    (navigator.clipboard?navigator.clipboard.writeText(txt):Promise.reject()).then(()=>ptToast("Copied, paste it into Build Sheets → Edit as text"),()=>ptToast("Couldn't copy, your browser blocked it"))}});
["shMenu","bsMenu"].forEach(id=>$(id).addEventListener("click",e=>{if(e.target.closest(".smi"))setTimeout(()=>$(id).open=false,0)}));
document.addEventListener("click",e=>{["shMenu","bsMenu"].forEach(id=>{const m=$(id);if(m.open&&!e.target.closest("#"+id))m.open=false})});
$("shareB").addEventListener("click",async()=>{const url=await ptCopyShare(buildSheetText());ptToast(url?"Share link copied: it opens this build as a build sheet":"Couldn't copy, your browser blocked it")});
renderBf();
all();
