
const $=id=>document.getElementById(id);
const G=P.gear;const EQ=P.equip;const EQB=Object.fromEntries(EQ.map(x=>[x.n,x]));
const STATS=["Luck","Capacity","Shake Strength","Shake Speed","Dig Strength","Dig Speed","Size Boost","Modifier Boost","Sell Boost","Inventory Size","Walk Speed","Toughness"];
const PCT=new Set(["Shake Speed","Dig Speed","Size Boost","Modifier Boost","Sell Boost"]);
const SLOTDEF=[["neck","Necklace","Necklace"],["charm","Charm","Charm"],...Array.from({length:8},(_,i)=>["r"+i,"Ring "+(i+1),"Ring"])];
const MUTS=[["None",1,{}],["Silver",1.1,{}],["Gold",1.2,{}],["Diamond",1.35,{}],["Granite",1.36,{"Dig Strength":24,"Shake Strength":6}],["Overclocked",1.36,{"Dig Speed":10,"Shake Speed":10}],["Festive",1.4,{"Luck":50,"Size Boost":10}],["Sunforged",1.5,{"Luck":300,"Sell Boost":30}],["Prismatic",1.6,{}]];
const MUT=Object.fromEntries(MUTS.map(m=>[m[0],m]));
const mutLabel=m=>m[0]==="None"?"No mutation":`${m[0]} ×${m[1]}${Object.keys(m[2]).length?" +":""}`;
const MULT={Common:.005,Uncommon:.0075,Rare:.0125,Epic:.02,Legendary:.03,Mythic:.05,Exotic:.08};
const MODS=Object.fromEntries(P.mods.map(m=>[m[0],m]));
window.S=null;let S={pan:"",shovel:"",slots:{},mus:"board",b:{},n:{friendTotem:-1,friends:0,mastery:0,flatLuck:0,flatDig:0},owned:false};
window.S=S;try{const s=JSON.parse(localStorage.getItem("pcalc")||"null");if(s)S=Object.assign(S,s,{b:Object.assign({},s.b),n:Object.assign(S.n,s.n)})}catch(e){}
{const seen=new Set();Object.keys(S.slots).sort().forEach(k=>{const v=S.slots[k];if(v&&["Dredge Master's Ring","Ring of Champions","Ring of the Stars","Scarab Signet","Embalmer's Ring","Ring of Ra"].includes(v.n)){if(seen.has(v.n))v.n="";else seen.add(v.n)}})}
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
    <select data-mut="${k}" data-ptmut aria-label="${l} mutation">${MUTS.map(m=>`<option value="${m[0]}">${mutLabel(m)}</option>`).join("")}</select>
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
// Each line is "what changes if you take just that away"; anything left over (two sources boosting each other) is shown as "Overlap".
function brkSources(B){const L=[];const lab=k=>{const e=document.querySelector(`[data-b="${k}"]`);return e?e.parentElement.textContent.trim():k};
  if(B.pan){if(B.panEn)L.push({key:"pan:",label:`Pan enchant: ${B.panEn}`,cut:t=>{t.panEn=""}});L.push({key:"pan:",label:"Pan: "+B.pan,cut:t=>{t.pan="";t.panEn=""},minus:B.panEn?0:null})}
  if(B.shovel){if(B.shEn)L.push({key:"shovel:",label:`Shovel enchant: ${B.shEn}`,cut:t=>{t.shEn=""}});L.push({key:"shovel:",label:"Shovel: "+B.shovel,cut:t=>{t.shovel="";t.shEn=""},minus:B.shEn?0:null})}
  SLOTDEF.forEach(([k,l])=>{const v=(B.slots||{})[k];if(v&&v.n)L.push({key:"slot:"+k,label:`${l}: ${v.n}`,sub:[v.l==="0"?"0★":v.l==="5"?"5★":"6★",v.m&&v.m!=="None"?v.m:"",(v.q??100)<100?(v.q??100)+"%":""].filter(Boolean).join(" · "),cut:t=>{t.slots=Object.assign({},t.slots);delete t.slots[k]}})});
  const bd=B.mus!=="none"?musBoard(B):null;
  if(bd)MORDER.forEach(r=>(bd[r]||[]).forEach((sl,i)=>{if(!sl||!sl.m)return;const u=sl.u||"None";
    L.push({key:"group:museum",label:`Museum: ${sl.m==="Any"?"Any "+r:sl.m}`,sub:[sl.m==="Any"?"":r,u==="None"?"":u].filter(Boolean).join(" · "),cut:t=>{const b2=JSON.parse(JSON.stringify(musBoard(t)||{}));if(b2[r]&&b2[r][i])b2[r][i]={m:null,u:"None"};t.mus="custom";t.museumBoard=b2}})}));
  Object.entries(B.b||{}).forEach(([k,v])=>{if(!v||k==="meteor"||k==="weather")return;L.push({key:"group:boosts",label:lab(k),cut:t=>{t.b=Object.assign({},t.b,{[k]:false})}})});
  (B.pots||[]).forEach(n=>L.push({key:"group:boosts",label:"Potion: "+n,cut:t=>{t.pots=(t.pots||[]).filter(x=>x!==n)}}));
  (B.runes||[]).forEach(n=>L.push({key:"group:boosts",label:"Rune: "+n,cut:t=>{t.runes=(t.runes||[]).filter(x=>x!==n)}}));
  const n=B.n||{};
  if(+n.friendTotem>=0)L.push({key:"group:boosts",label:`Friendship Totem (${+n.friendTotem} nearby)`,cut:t=>{t.n=Object.assign({},t.n,{friendTotem:-1})}});
  if(+n.friends>0)L.push({key:"group:boosts",label:`${+n.friends} friend${+n.friends===1?"":"s"} online`,cut:t=>{t.n=Object.assign({},t.n,{friends:0})}});
  if(+n.mastery>0)L.push({key:"group:boosts",label:"Location mastery",cut:t=>{t.n=Object.assign({},t.n,{mastery:0})}});
  if(+n.flatLuck>0)L.push({key:"group:boosts",label:"Flat luck (quests, potions)",cut:t=>{t.n=Object.assign({},t.n,{flatLuck:0})}});
  if(+n.flatDig>0)L.push({key:"group:boosts",label:"Flat dig strength",cut:t=>{t.n=Object.assign({},t.n,{flatDig:0})}});
  if(B.b&&B.b.meteor)L.push({key:"group:events",label:"Meteor shower",cut:t=>{t.b=Object.assign({},t.b,{meteor:false})}});
  if(B.b&&B.b.weather)L.push({key:"group:events",label:"Weather event",cut:t=>{t.b=Object.assign({},t.b,{weather:false})}});
  return L}
// how much detail: 0 just stats, 1 semi (flat × multiplier = total), 2 full breakdown. Old saves: "show breakdown" off = 0
const brkLvl=()=>S.brkLevel!=null?+S.brkLevel:(S.showBrk===false?0:2);
const LVLN=["Just stats","Semi","Full breakdown"];
const BRK_STATS=["Luck","Capacity","Size Boost","Modifier Boost","Sell Boost","Dig Strength","Shake Strength","Dig Speed","Shake Speed","Walk Speed","Inventory Size","Toughness"];
const FLAT_ONLY=new Set(["Toughness","Inventory Size"]);
// per-stat breakdown data, shared by the page and the saved image
// returns [{s,flatT,mult,xm,total,F:[{x,v}],M:[{x,v}],X:[{x,v}]}] for every stat you have that isn't switched off
function brkData(B){const R=compute(B);
  const src=brkSources(B).map(x=>{const t=clone(B);x.cut(t);return {...x,W:compute(t)}});
  src.forEach((x,i)=>{if(x.minus===0)x.minusOf=src[i-1]});
  const fl=(o,s)=>(o.base[s]||0)+(o.flat[s]||0),hide=new Set(S.brkHide||[]);
  const stats=BRK_STATS.filter(s=>(Math.abs(R.tot[s]||0)>1e-9||s==="Luck")&&!hide.has(s));
  const out=stats.map(s=>{const fo1=FLAT_ONLY.has(s),flatT=fl(R,s),mult=fo1?1:1+(R.pile[s]||0);const F=[],M=[],X=[];let fSum=0,mSum=0;
    src.forEach(x=>{let df=flatT-fl(x.W,s),dm=fo1?0:(R.pile[s]||0)-(x.W.pile[s]||0);
      if(x.minusOf){df-=flatT-fl(x.minusOf.W,s);dm-=fo1?0:(R.pile[s]||0)-(x.minusOf.W.pile[s]||0)}
      if(Math.abs(df)>1e-9){F.push({x,v:df});fSum+=df}if(Math.abs(dm)>1e-9){M.push({x,v:dm});mSum+=dm}
      if(s==="Luck"){const re=R.ev/(x.W.ev||1),rl=R.luckMult/(x.W.luckMult||1);if(Math.abs(re-1)>1e-9)X.push({x,v:re});if(Math.abs(rl-1)>1e-9)X.push({x,v:rl})}});
    const ov={label:"Overlap",sub:"sources boosting each other"};
    if(Math.abs(flatT-fSum)>1e-6)F.push({x:ov,v:flatT-fSum});if(!fo1&&Math.abs(mult-1-mSum)>1e-6)M.push({x:ov,v:mult-1-mSum});
    F.sort((a,b)=>b.v-a.v);M.sort((a,b)=>b.v-a.v);
    return {s,flatT,mult,xm:s==="Luck"?(R.ev||1)*(R.luckMult||1):1,total:R.tot[s]||0,F,M,X,fo1}});
  return {R,src,stats:out}}
function renderParts(){const B=clone(S);(S.isoOff||[]).forEach(g=>Object.assign(B,strip(B,g)));const D=brkData(B);
  const tv=(s,v)=>PCT.has(s)?fmt(v,1)+"%":fmt(v,s==="Luck"||s==="Capacity"?0:1);
  const sv=(s,v)=>(v<0?"−":"+")+tv(s,Math.abs(v));
  const row=(x,txt,neg)=>`<div class="pt${x.key&&S.only===x.key?" on":""}"${x.key?` role="button" tabindex="0" data-only="${esc(x.key)}" aria-pressed="${S.only===x.key}"`:""}><b>${esc(x.label)}${x.sub?` <small>${esc(x.sub)}</small>`:""}</b><span class="lk2" style="color:${neg?"var(--neg,#c53030)":"var(--accent)"}">${txt}</span></div>`;
  const lv=brkLvl();
  const cards=lv===1?D.stats.map(({s,flatT,mult,xm,total,fo1})=>`<div class="bks bksemi"><div class="bkst"><b style="color:${statHex(s)}">${esc(s)}</b></div><div class="sem"><div><small>Flat points</small><b>${tv(s,flatT)}</b></div><div><small>Multiplier</small><b>${fo1?"—":"×"+fmt(mult,2)}</b></div>${xm!==1?`<div><small>Events &amp; tools</small><b>×${fmt(xm,2)}</b></div>`:""}<div class="semt"><small>Total</small><b style="color:${statHex(s)}">${tv(s,total)}</b></div></div></div>`).join(""):D.stats.map(({s,flatT,mult,xm,total,F,M,X,fo1})=>{
    const formula=fo1||(mult===1&&xm===1)?"":`${tv(s,flatT)} × ${fmt(mult,2)}${xm!==1?` × ${fmt(xm,2)}`:""} = `;
    return `<div class="bks"><div class="bkst"><b style="color:${statHex(s)}">${esc(s)}</b><span>${formula}<em>${tv(s,total)}</em></span></div>
      <div class="bksub"><span>Flat points</span><span>${tv(s,flatT)}</span></div>${F.length?F.map(o=>row(o.x,sv(s,o.v),o.v<0)).join(""):'<p class="bkn">None</p>'}
      ${fo1||!M.length?"":`<div class="bksub"><span>Multiplier (from ×1)</span><span>×${fmt(mult,2)}</span></div>${M.map(o=>row(o.x,(o.v<0?"−":"+")+fmt(Math.abs(o.v),2)+"×",o.v<0)).join("")}`}
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
  "Inventory Size":"1;37",
  "Toughness":"1;31"
};
function discordCompactAnsi(lines){
  const esc="\u001b[",reset=esc+"0m";
  const colored=lines.map(line=>{
    if(line==="**My Prospecting stats**")return esc+"1;37mMy Prospecting stats"+reset;
    if(line.startsWith("Pan:"))return esc+"0;37m"+line+reset;
    const m=line.match(/^\\*\\*([^:*]+):\\*\\*/);
    if(!m)return line;
    const stat=m[1],color=STAT_ANSI[stat]||"0;37";
    return esc+color+"m"+line.replace(/^\\*\\*([^:*]+):\\*\\*/,stat+":").replace(/\\*\\*/g,"")+reset;
  });
  return "```ansi\n"+colored.join("\n")+"\n```";
}
// copy the breakdown as Discord text, at the level the slider is on
$("cpBrk").onclick=async()=>{const B=clone(S);(S.isoOff||[]).forEach(g=>Object.assign(B,strip(B,g)));const D=brkData(B),lv=brkLvl();
  if(!D.stats.length){ptToast("No stats to copy yet");return}
  const tv=(s,v)=>PCT.has(s)?fmt(v,1)+"%":fmt(v,s==="Luck"||s==="Capacity"?0:1),sv=(s,v)=>(v<0?"−":"+")+tv(s,Math.abs(v));
  const L=["**My Prospecting stats**"];const gear=[B.pan&&"Pan: "+B.pan+(B.panEn?" ("+B.panEn+")":""),B.shovel&&"Shovel: "+B.shovel+(B.shEn?" ("+B.shEn+")":"")].filter(Boolean).join(" · ");if(gear)L.push(gear);L.push("");
  const lbl=x=>x.label+(x.sub?` (${x.sub})`:"");
  D.stats.forEach(d=>{const sum=d.fo1||(d.mult===1&&d.xm===1)?"":`${tv(d.s,d.flatT)} × ${fmt(d.mult,2)}${d.xm!==1?` × ${fmt(d.xm,2)}`:""} = `;
    if(lv===0){L.push(`**${d.s}:** ${tv(d.s,d.total)}`);return}
    if(lv===1){L.push(`**${d.s}:** ${sum}**${tv(d.s,d.total)}**`);return}
    L.push(`**${d.s}: ${tv(d.s,d.total)}**${sum?` (${sum.replace(/ = $/,"")})`:""}`);
    L.push(`> __Flat points: ${tv(d.s,d.flatT)}__`);d.F.forEach(o=>L.push(`> - ${lbl(o.x)}: ${sv(d.s,o.v)}`));
    if(!d.fo1&&d.M.length){L.push(`> __Multiplier: ×${fmt(d.mult,2)}__`);d.M.forEach(o=>L.push(`> - ${lbl(o.x)}: ${(o.v<0?"−":"+")+fmt(Math.abs(o.v),2)}×`))}
    if(d.X.length){L.push(`> __Multiplies the total: ×${fmt(d.xm,2)}__`);d.X.forEach(o=>L.push(`> - ${lbl(o.x)}: ×${fmt(o.v,2)}`))}
    L.push("")});
  const txt=lv===2?L.join("\n").trim():discordCompactAnsi(L);let ok=false;
  try{await navigator.clipboard.writeText(txt);ok=true}catch(e){try{const ta=document.createElement("textarea");ta.value=txt;ta.style.position="fixed";ta.style.opacity="0";document.body.appendChild(ta);ta.select();ok=document.execCommand("copy");ta.remove()}catch(e2){}}
  ptToast(!ok?"Couldn't copy, your browser blocked it":txt.length>2000?`Copied, but it's ${fmt(txt.length,0)} characters: Discord allows 2,000 (4,000 with Nitro). Switch some stats off or use Semi`:"Copied, paste it into Discord")};
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
  else if(g==="boosts"){S.b={};S.n={friendTotem:-1,friends:0,mastery:0,flatLuck:0,flatDig:0};S.pots=[];S.runes=[]}S.only=null;save();all()}
$("resetAll").onclick=()=>{const b=$("resetAll");if(!b.classList.contains("arm")){b.classList.add("arm");b.textContent="Reset everything?";setTimeout(()=>{b.classList.remove("arm");b.textContent="Reset everything"},2500);return}
  ["tools","jewelry","museum","boosts"].forEach(g=>resetGroup(g));S.isoOff=[];S.only=null;S.owned=false;b.classList.remove("arm");b.textContent="Reset everything";save();all()};
// ---- what to upgrade next ----------------------------------------------------
// Tries every pan, shovel and piece of equipment in your slots, works out what each one would add to the goal you
// pick, and what it would cost: money from the shop, or the minerals you'd have to farm (turned into pans with the
// same luck model as Luck Odds). Equipment is compared at 6★ and 100% quality, which is the best it can roll.
const UGOALS=[["Luck",{Luck:1}],["Capacity",{Capacity:1}],["Modifier Boost",{"Modifier Boost":1}],["Luck + Size",{Luck:1,"Size Boost":1}],
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
function upGoal(){const g=UGOALS.find(g=>g[0]===S.upGoal)||UGOALS[0];return g}
// every swap worth trying, with what it gives and what it costs
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
  // equipment: the best slot for each piece you aren't already wearing
  const worn=new Set(SLOTDEF.map(([k])=>(S.slots[k]||{}).n).filter(Boolean));
  const best={};
  SLOTDEF.forEach(([k,label,slot])=>{
    EQ.filter(x=>x.slot===slot).forEach(x=>{
      if(worn.has(x.n))return;
      const cur=S.slots[k]||{};const st=clone(base);st.slots=Object.assign({},st.slots,{[k]:{n:x.n,l:"6",q:100,m:cur.m||"None"}});
      const t=compute(st).tot;const g=uScore(t,w)-s0;if(g<=1e-9)return;
      if(!best[x.n]||g>best[x.n].gain){const c=recipeCost(x);
        best[x.n]={kind:label,name:x.n,rarity:x.r,money:x.cur==="$"?uMoney(x.price):0,
          other:x.cur!=="$"?fmt(uMoney(x.price),0)+" "+x.cur:"",limited:!!x.ev,pans:c.pans,unknown:c.unknown,gain:g,
          state:st,apply:()=>{S.slots[k]=Object.assign({},S.slots[k],{n:x.n,l:"6",q:100})},
          recipe:(x.rec||[]).map(([q,n])=>q+"× "+n).join(", ")}}})});
  Object.values(best).forEach(c=>add(c));
  const effort=c=>Math.max(1,(c.pans||0)+(c.money||0)/1000)*(c.unknown?20:1);
  out.forEach(c=>{c.effort=effort(c);c.value=c.gain/c.effort});
  const keep=S.upEvent?out:out.filter(c=>!c.limited);
  keep.sort((a,b)=>(S.upSort||"value")==="value"?b.value-a.value:b.gain-a.gain);
  return keep}
function renderUp(){
  const on=S.showUp!==false;$("showUp").checked=on;$("upBody").hidden=!on;
  $("upGoal").innerHTML=UGOALS.map(([n])=>`<button type="button" class="chip" data-ug="${esc(n)}" aria-pressed="${(S.upGoal||"Luck")===n}">${esc(n)}</button>`).join("");
  $("upSort").innerHTML=[["value","Best for the effort"],["gain","Biggest gain"]].map(([v,n])=>`<button type="button" class="chip" data-us="${v}" aria-pressed="${(S.upSort||"value")===v}">${n}</button>`).join("");
  $("upSort").insertAdjacentHTML("beforeend",`<button type="button" class="chip" data-uev="1" aria-pressed="${!!S.upEvent}" title="Event and limited-time gear you can't just go and get">Include event gear</button>`);
  if(!on){$("upList").innerHTML="";$("upHint").textContent="";return}
  const list=upCandidates().slice(0,10);
  $("upHint").innerHTML=`Equipment is shown at 6★ and 100% quality.`;
  if(!list.length){$("upList").innerHTML='<p class="hint">Nothing here beats what you already have for this goal.</p>';return}
  $("upList").innerHTML=list.map((c,i)=>{
    const gains=Object.entries(c.d).sort((a,b)=>Math.abs(b[1])-Math.abs(a[1])).slice(0,3)
      .map(([s,v])=>`<span class="${v<0?"neg":"gain"}">${esc(s)} <b>${fv2(s,v)}</b></span>`).join("");
    const money=c.money?uMoneyTxt(c.money):c.other||(c.limited?"event":"");
    const grind=c.pans?uPansTxt(c.pans):"";
    const meta=c.kind+(c.where?" · "+c.where:"")+(c.recipe?" · "+c.recipe:"")+(c.unknown?" · some materials aren't panned":"");
    return `<div class="upi"><span class="upn"><b>${esc(c.name)}</b><span class="uph" title="${esc(meta)}">${esc(meta)}</span><span class="upg">${gains}</span></span>
      <span class="upm">${esc(money)}</span><span class="upp">${esc(grind)}</span>
      <button type="button" class="btn sm" data-uptry="${i}">Try it</button></div>`}).join("");
  UPLAST=list}
const fv2=(s,v)=>(v<0?"−":"+")+(PCT.has(s)?fmt(Math.abs(v),1)+"%":fmt(Math.abs(v),Math.abs(v)<10?1:0));
let UPLAST=[],UPUNDO=null;
$("showUp").addEventListener("change",()=>{S.showUp=$("showUp").checked;save();renderUp()});
document.addEventListener("click",e=>{
  const g=e.target.closest("[data-ug]");if(g){S.upGoal=g.dataset.ug;save();renderUp();return}
  const so=e.target.closest("[data-us]");if(so){S.upSort=so.dataset.us;save();renderUp();return}
  const ev=e.target.closest("[data-uev]");if(ev){S.upEvent=!S.upEvent;save();renderUp();return}
  const t=e.target.closest("[data-uptry]");if(t){const c=UPLAST[+t.dataset.uptry];if(!c)return;
    UPUNDO=clone(S);c.apply();save();all();toastUp(`Tried ${c.name}`);return}
  const u=e.target.closest("[data-upundo]");if(u&&UPUNDO){Object.assign(S,UPUNDO);UPUNDO=null;save();all();return}});
function toastUp(msg){let d=document.querySelector(".uptoast");if(!d){d=document.createElement("div");d.className="uptoast";document.body.appendChild(d)}
  d.innerHTML=`${esc(msg)} <button type="button" class="btn sm" data-upundo="1">Undo</button>`;d.hidden=false;clearTimeout(toastUp.t);toastUp.t=setTimeout(()=>{d.hidden=true},6000)}

function render(){
  renderIso();renderParts();renderUp();
  const r=compute(effState());
  const f=(s,v)=>PCT.has(s)?fmt(v,1)+"%":fmt(v,s==="Luck"||s==="Capacity"?0:1);
  $("out").innerHTML=`<table class="out"><tr><th>Stat</th><th>Gear</th><th>Boost pile</th><th>Total</th><th class="bkc" title="Show this stat in the detailed breakdown">Breakdown</th></tr>${STATS.map(s=>{const show=r.base[s]||r.tot[s]||s==="Luck";if(!show)return "";const on=!(S.brkHide||[]).includes(s);
    return `<tr class="${s==="Luck"?"big":""}"><td>${s}</td><td>${f(s,r.base[s]+r.flat[s])}</td><td>${["Toughness","Inventory Size"].includes(s)?"—":"×"+fmt(1+r.pile[s],2)}</td><td class="tot">${f(s,r.tot[s])}</td><td class="bkc"><button type="button" class="sw2" role="switch" data-bstat="${esc(s)}" aria-checked="${on}" aria-label="Show ${esc(s)} in the detailed breakdown" title="${on?"Shown":"Hidden"} in the detailed breakdown"></button></td></tr>`}).join("")}</table>
    <p class="hint" style="margin-top:8px">${[r.ev>1?`Events multiply final luck by ×${r.ev}.`:"",r.luckMult>1?`Your tools add ×${fmt(r.luckMult,2)} luck at the end.`:"",r.mt.n?`Museum: ${r.mt.n} display${r.mt.n===1?"":"s"} counted.`:"No museum counted.",...r.notes].filter(Boolean).join(" ")}</p>`;
  const mtS=musTotals(S);$("musTxt").textContent=S.mus==="none"?"":mtS.n?Object.entries(mtS.t).filter(([,v])=>v).map(([k,v])=>`${k} ${v<0?"−":"+"}${fmt(Math.abs(v),3)}×`).join(" · "):"That museum board is empty. Fill it in on the Museum Planner page.";
}
// ---- save the build as an image: gear, boosts, then the stats table (what "Your stats" shows) ----
const RHX={Ascended:"#ffd36b",Exotic:"#f17ad6",Mythic:"#f0687f",Legendary:"#f2b53a",Epic:"#b880ee",Rare:"#68a6f0",Uncommon:"#6cc46e",Common:"#a3adb8"};
const MUTHX={Silver:"#a9b4be",Gold:"#d9a520",Diamond:"#5fc8e8",Granite:"#8d8d86",Overclocked:"#e0602f",Festive:"#d23c3c",Sunforged:"#ffc457",Prismatic:"#c05bd8"};
// copy the stat panel as text, ready to paste into Discord
$("cpStats").onclick=async()=>{const st=effState(),t=compute(st).tot;const gear=[S.pan&&"Pan: "+S.pan,S.shovel&&"Shovel: "+S.shovel].filter(Boolean).join(" · ");
  const lines=SHOW.filter(s=>t[s]).map(s=>`${s}: ${fv(s,t[s])}`);
  if(!lines.length){ptToast("Nothing to copy yet. Pick some gear first.");return}
  const txt=discordCompactAnsi(["**My Prospecting stats**",gear,...lines].filter(Boolean));let ok=false;
  try{await navigator.clipboard.writeText(txt);ok=true}catch(e){try{const ta=document.createElement("textarea");ta.value=txt;ta.style.position="fixed";ta.style.opacity="0";document.body.appendChild(ta);ta.select();ok=document.execCommand("copy");ta.remove()}catch(e2){}}
  ptToast(ok?"Stats copied, paste them anywhere":"Couldn't copy, your browser blocked it")};
$("toImg").onclick=()=>{const st=effState();const r=compute(st);
  const hasGear=st.pan||st.shovel||SLOTDEF.some(([k])=>((st.slots||{})[k]||{}).n);
  if(!hasGear){ptToast("Pick some gear first");return}
  ptSaveImg("My build",()=>buildImage(st,r))};
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
  const boosts=[];const lab=k=>{const e=document.querySelector(`[data-b="${k}"]`);return e?e.parentElement.textContent.trim():k};
  Object.entries(st.b||{}).forEach(([k,v])=>{if(v)boosts.push({t:lab(k),col:TX})});
  (st.pots||[]).forEach(n=>boosts.push({t:n,col:"#b880ee"}));(st.runes||[]).forEach(n=>boosts.push({t:n+" rune",col:"#68a6f0"}));
  const n=st.n||{};if(+n.friendTotem>=0)boosts.push({t:`Friendship Totem (${+n.friendTotem} nearby)`,col:TX});if(+n.friends>0)boosts.push({t:`${+n.friends} friend${+n.friends===1?"":"s"} online`,col:TX});
  if(+n.mastery>0)boosts.push({t:`Location mastery +${n.mastery}×`,col:TX});if(+n.flatLuck>0)boosts.push({t:`+${fmt(+n.flatLuck,0)} flat luck`,col:statHex("Luck")});if(+n.flatDig>0)boosts.push({t:`+${fmt(+n.flatDig,0)} flat dig strength`,col:statHex("Dig Strength")});
  const hideS=new Set(S.brkHide||[]),stats=SHOW.filter(x=>(Math.abs(r.tot[x]||0)>1e-9||x==="Luck")&&!hideS.has(x));
  const LV=brkLvl(),DET=LV===2?brkData(st).stats:null;
  const sub=[];const ex=[r.ev>1?`events ×${r.ev} luck`:"",r.luckMult>1?`tools ×${fmt(r.luckMult,2)} luck`:""].filter(Boolean);if(ex.length)sub.push("Includes "+ex.join(" and "));
  if((S.isoOff||[]).length||S.only)sub.push("Only some parts counted");
  // ---- measure ----
  const m=document.createElement("canvas").getContext("2d");
  const chipRows=(list,w,font)=>{m.font=font;const rows=[[]];let x=0;list.forEach(ch=>{const cw=m.measureText(ch.t).width+22;if(x+cw>w&&rows[rows.length-1].length){rows.push([]);x=0}rows[rows.length-1].push({...ch,w:cw});x+=cw+8});return rows};
  const HERO=212,SC=4,STH=96,SECH=44,TOPH=104,RC=4,RH=98,MRH=58;
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
  const label=(t,x,y,col)=>{c.fillStyle=col||MU;c.font=`700 11.5px ${F}`;let xx=x;for(const ch of t.toUpperCase()){c.fillText(ch,xx,y);xx+=c.measureText(ch).width+1.3}};
  const img=(src,x,y,s,tile)=>{if(tile){c.fillStyle="#12161a";rr(x,y,s,s,10);c.fill()}const i=IMG[src];if(!i)return;const k=Math.min((s-(tile?8:0))/i.width,(s-(tile?8:0))/i.height),w=i.width*k,h=i.height*k;c.drawImage(i,x+(s-w)/2,y+(s-h)/2,w,h)};
  const sec=(t,y)=>{c.fillStyle=TX;c.font=`700 20px ${FD}`;c.fillText(t,PAD,y+26)};
  c.fillStyle=BG;c.fillRect(0,0,W,H);
  // header
  c.font=`600 13px ${F}`;const mb="Made by @__coastal";const mw=c.measureText(mb).width+28,mx=W-PAD-mw,my=PAD-6;c.fillStyle="rgba(20,184,166,.14)";rr(mx,my,mw,26,13);c.fill();c.strokeStyle="rgba(20,184,166,.6)";c.lineWidth=1;rr(mx,my,mw,26,13);c.stroke();c.fillStyle="#14b8a6";c.beginPath();c.arc(mx+12,my+13,3,0,Math.PI*2);c.fill();c.fillStyle="#2dd4bf";c.fillText(mb,mx+20,my+17.5);
  c.fillStyle=TX;c.font=`700 34px ${FD}`;c.fillText("My build",PAD,PAD+30);
  const luckTot=r.tot.Luck||0;c.font=`600 15px ${F}`;c.fillStyle=MU;const tag=`${fmt(luckTot,0)} luck · ${fmt(r.tot.Capacity||0,0)} capacity`;c.fillText(tag,PAD,PAD+54);
  let y=PAD+62;if(sub.length){c.font=`14px ${F}`;c.fillStyle=MU;c.fillText(fit(sub.join(" · "),IW),PAD,PAD+78);y=PAD+88}
  // hero: pan, shovel, museum
  const hw=(IW-GAP*2)/3;
  const tool=(x,kind,it,en,lines,edge)=>{card(x,y,hw,HERO,edge);label(kind,x+20,y+30,edge);
    if(!it){c.fillStyle=MU;c.font=`15px ${F}`;c.fillText("None picked",x+20,y+64);return}
    img(G.img[it.image],x+20,y+46,92,true);const tx=x+128,tw=hw-148;
    c.fillStyle=it["name color"]||TX;c.font=`700 20px ${FD}`;c.fillText(fit(it.name,tw),tx,y+70);
    c.font=`13px ${F}`;c.fillStyle=en?"#c9a7f5":MU;c.fillText(fit(en?"Enchant: "+en:"No enchant",tw),tx,y+92);
    lines.forEach(([k,v],i)=>{const yy=y+122+i*24;c.font=`13px ${F}`;c.fillStyle=MU;c.fillText(k,tx,yy);c.font=`600 14px ${FM}`;c.fillStyle=statHex(k);c.textAlign="right";c.fillText(v,x+hw-20,yy);c.textAlign="left"});
    if(kind==="Pan"&&st.trinket){c.font=`12.5px ${F}`;c.fillStyle=MU;c.fillText(fit("Trinket: "+st.trinket,hw-40),x+20,y+HERO-16)}};
  tool(PAD,"Pan",pan,st.panEn,pan?[["Luck",fmt(+pan.luck||0,2)],["Capacity",fmt(+pan.capacity||0,0)],["Shake Strength",fmt(+pan.strength||0,2)]].concat(pan.passive?[]:[]):[],"#e0a95b");
  tool(PAD+hw+GAP,"Shovel",sh,st.shEn,sh?[["Dig Strength",fmt(+sh.strength||0,2)],["Dig Speed",fmt((+sh.speed||0)*100,0)+"%"],["Toughness",fmt(+sh.toughness||0,0)]]:[],"#8fb4d9");
  // museum card
  {const x=PAD+(hw+GAP)*2;card(x,y,hw,HERO,"#3cc2a8");label("Museum",x+20,y+30,"#3cc2a8");
    if(!board||!mt.n){c.fillStyle=MU;c.font=`15px ${F}`;c.fillText("No museum counted",x+20,y+64)}
    else{c.fillStyle=TX;c.font=`700 20px ${FD}`;c.fillText(fit(musName,hw-40),x+20,y+62);c.font=`13px ${F}`;c.fillStyle=MU;c.fillText(`${mt.n} display${mt.n===1?"":"s"}`,x+20,y+84);
      const ms=musStats.slice(0,4);ms.forEach(([k,v],i)=>{const col=i%2,row=Math.floor(i/2),xx=x+20+col*((hw-40)/2),yy=y+112+row*24;c.font=`13px ${F}`;c.fillStyle=MU;c.fillText(fit(k,(hw-40)/2-80),xx,yy);c.font=`600 14px ${FM}`;c.fillStyle=statHex(k);c.textAlign="right";c.fillText("+"+fmt(v,2)+"×",xx+(hw-40)/2-14,yy);c.textAlign="left"});
      c.font=`12.5px ${F}`;c.fillStyle=MU;c.fillText("Every slot is listed below",x+20,y+HERO-20)}}
  y+=HERO+GAP;
  // equipment: necklace and charm as two big cards, then the rings
  const stars=(g,x,yy,fs)=>{c.font=`600 ${fs}px ${FM}`;c.fillStyle=GOLD;const t=g.st+"★";c.fillText(t,x,yy);return x+c.measureText(t).width};
  const mutTxt=(g,x,yy,fs,w)=>{const none=g.mu==="None";c.fillStyle=none?MU:(MUTHX[g.mu]||TX);c.font=none?`${fs}px ${F}`:`600 ${fs}px ${F}`;c.fillText(fit(none?"No mutation":g.mu,w),x,yy)};
  if(hasTop){sec("Necklace & Charm",y);y+=SECH;const tw2=(IW-GAP)/2;
    top2.forEach((g,i)=>{const x=PAD+i*(tw2+GAP);card(x,y,tw2,TOPH,g.empty?null:RHX[g.r]);
      if(g.empty){label(g.slot,x+22,y+32);c.fillStyle=MU;c.font=`15px ${F}`;c.fillText("Empty",x+22,y+62);return}
      img(g.ic,x+20,y+16,72,true);const tx=x+108,tw=tw2-128;label(g.slot,tx,y+30);
      c.font=`700 19px ${FD}`;c.fillStyle=RHX[g.r]||TX;c.fillText(fit(g.n,tw),tx,y+56);
      c.font=`13px ${F}`;c.fillStyle=MU;c.fillText(g.r,tx,y+82);let xx=tx+c.measureText(g.r+"   ").width;xx=stars(g,xx,y+82,13);
      c.font=`13px ${F}`;c.fillStyle=MU;c.fillText("  ·  ",xx,y+82);xx+=c.measureText("  ·  ").width;mutTxt(g,xx,y+82,13,x+tw2-20-xx-60);
      c.textAlign="right";c.font=`600 13px ${FM}`;c.fillStyle=g.q>=100?TX:MU;c.fillText(g.q+"% quality",x+tw2-20,y+82);c.textAlign="left"});
    y+=TOPH+12}
  if(rings.length){sec(`Rings (${rings.length} of 8)`,y);y+=SECH;const rw=(IW-12*(RC-1))/RC;
    rings.forEach((g,i)=>{const x=PAD+(i%RC)*(rw+12),yy=y+Math.floor(i/RC)*(RH+12);card(x,yy,rw,RH,RHX[g.r]);
      img(g.ic,x+18,yy+18,60,true);label(g.slot,x+86,yy+30);c.textAlign="right";c.font=`600 12.5px ${FM}`;c.fillStyle=g.q>=100?TX:MU;c.fillText(g.q+"%",x+rw-16,yy+30);c.textAlign="left";
      c.font=`700 16px ${FD}`;c.fillStyle=RHX[g.r]||TX;c.fillText(fit(g.n,rw-104),x+86,yy+56);
      const xx=stars(g,x+86,yy+80,13);c.font=`13px ${F}`;c.fillStyle=MU;c.fillText("  ·  ",xx,yy+80);mutTxt(g,xx+c.measureText("  ·  ").width,yy+80,13,x+rw-16-xx-30)});
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
      const fm=d.fo1||(d.mult===1&&d.xm===1)?"":`${tv(d.s,d.flatT)} × ${fmt(d.mult,2)}${d.xm!==1?` × ${fmt(d.xm,2)}`:""}`;c.font=`12.5px ${FM}`;c.fillStyle=MU;c.fillText(fm,x+DCW-20,y0+50);c.textAlign="left";
      let yy=y0+58;const head=(t,v)=>{c.strokeStyle=LINE;c.beginPath();c.moveTo(x+16,yy+.5);c.lineTo(x+DCW-16,yy+.5);c.stroke();label(t,x+20,yy+20);c.textAlign="right";c.font=`600 13px ${FM}`;c.fillStyle=TX;c.fillText(v,x+DCW-20,yy+20);c.textAlign="left";yy+=30};
      const line=(o,txt)=>{const neg=o.v<0||(txt.startsWith("×")&&o.v<1);c.font=`600 13.5px ${F}`;c.fillStyle=TX;const lb=o.x.label;const lw=Math.min(c.measureText(lb).width,DCW-150);c.fillText(fit(lb,DCW-150),x+20,yy+16);
        if(o.x.sub){c.font=`12px ${F}`;c.fillStyle=MU;c.fillText(fit(o.x.sub,DCW-150-lw-8),x+20+lw+8,yy+16)}
        c.textAlign="right";c.font=`600 13px ${FM}`;c.fillStyle=neg?"#f0687f":"#3cc2a8";c.fillText(txt,x+DCW-20,yy+16);c.textAlign="left";yy+=DROW};
      head("Flat points",tv(d.s,d.flatT));if(d.F.length)d.F.forEach(o=>line(o,(o.v<0?"−":"+")+tv(d.s,Math.abs(o.v))));else{c.font=`12.5px ${F}`;c.fillStyle=MU;c.fillText("None",x+20,yy+16);yy+=DROW}
      if(!d.fo1&&d.M.length){head("Multiplier (from ×1)","×"+fmt(d.mult,2));d.M.forEach(o=>line(o,(o.v<0?"−":"+")+fmt(Math.abs(o.v),2)+"×"))}
      if(d.X.length){head("Multiplies the total","×"+fmt(d.xm,2));d.X.forEach(o=>line(o,"×"+fmt(o.v,2)))}})}
  return await new Promise(res=>cv.toBlob(res,"image/png"))}
// ---- gear picker with hover preview ----
const clone=o=>JSON.parse(JSON.stringify(o));
// rings the game only lets you wear one of at a time
const ONE_ONLY=new Set(["Dredge Master's Ring","Ring of Champions","Ring of the Stars","Scarab Signet","Embalmer's Ring","Ring of Ra"]);
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
    <select data-mm="${r}|${i}" aria-label="${r} display ${i+1}"><option value="">— empty —</option><option value="Any"${sl.m==="Any"?" selected":""}>Anything (only the modifier counts)</option>${opts.map(m=>`<option value="${esc(m.n)}"${m.n===sl.m?" selected":""}>${esc(m.n)} · ${esc(boostTxt(m))}</option>`).join("")}</select>
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
// coming back to this tab: re-read the museum, but only rebuild when it actually changed.
// Rebuilding on every focus replaced the buttons under the mouse, so the first click on the page got lost.
const musSig=()=>{try{return ["mp-board","mp-loadouts"].map(k=>localStorage.getItem(k)||"").join("|")}catch(e){return ""}};
let lastMus=musSig();
window.addEventListener("focus",()=>{const sg=musSig();if(sg===lastMus)return;lastMus=sg;fillMus();render()});
window.ptRefresh=()=>{fillMus();render()};
all();
