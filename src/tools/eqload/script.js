
const $=id=>document.getElementById(id);
const EQ=P.equip||[];const EB=Object.fromEntries(EQ.map(x=>[x.n,x]));const IMG=n=>{const x=EB[n];return x&&x.img?(P.eimg||{})[x.img]||"":""};
const MUTS=[["None",1,{}],["Silver",1.1,{}],["Gold",1.2,{}],["Diamond",1.35,{}],["Granite",1.36,{"Dig Strength":24,"Shake Strength":6}],["Overclocked",1.36,{"Dig Speed":10,"Shake Speed":10}],["Festive",1.4,{"Luck":50,"Size Boost":10}],["Prismatic",1.6,{}]];
const MUT=Object.fromEntries(MUTS.map(m=>[m[0],m]));
const MCOL={Silver:"#d6d6d6",Gold:"#ffcc33",Diamond:"#7fd8ff",Granite:"#c8a27a",Overclocked:"#6b8cff",Festive:"#ff6b6b",Prismatic:"#ff5fd2"};
const RHEX={Common:"#a3adb8",Uncommon:"#6cc46e",Rare:"#68a6f0",Epic:"#b880ee",Legendary:"#f2b53a",Mythic:"#f0687f",Exotic:"#f17ad6",Ascended:"#ffd36b"};
const ONE_ONLY=new Set(["Dredge Master's Ring","Ring of Champions","Ring of the Stars"]);
const PCT=new Set(["Shake Speed","Size Boost","Modifier Boost","Sell Boost","Dig Speed"]);
// slots: necklace, charm, 6 normal rings, then rings 7 and 8 (unlocked together with Robux)
const SLOTS=[["neck","Necklace","Necklace"],["charm","Charm","Charm"],...Array.from({length:6},(_,i)=>["r"+i,"Ring "+(i+1),"Ring"]),["r6","Ring 7","Ring"],["r7","Ring 8","Ring"]];
const blank=n=>({id:"l"+Date.now().toString(36)+Math.random().toString(36).slice(2,6),name:n||randomName(),notes:"",nRings:6,robux:false,slots:{}});
const ADJ=["Lucky","Molten","Frozen","Glowing","Ancient","Swift","Golden","Radiant","Mighty","Prismatic","Stormy","Crystal","Royal","Shiny","Cosmic","Hidden"],NOUN=["Hoard","Kit","Setup","Arsenal","Haul","Rig","Stash","Toolkit","Loadout","Gearset"];
function randomName(){return ADJ[Math.random()*ADJ.length|0]+" "+NOUN[Math.random()*NOUN.length|0]}
let D={list:[],cur:null,cmp:null};try{Object.assign(D,JSON.parse(localStorage.getItem("pt-eqload")||"{}"))}catch(e){}
if(!Array.isArray(D.list)||!D.list.length){D.list=[blank()];D.cur=D.list[0].id}
if(!D.list.some(l=>l.id===D.cur))D.cur=D.list[0].id;
const save=()=>{try{localStorage.setItem("pt-eqload",JSON.stringify(D))}catch(e){}};
const L=()=>D.list.find(l=>l.id===D.cur);
const owned=(l,k)=>{if(k==="neck"||k==="charm")return true;if(k==="r6"||k==="r7")return !!l.robux;return +k.slice(1)<Math.max(0,Math.min(6,+l.nRings||0))};
// one stat line on an item at its stars, quality and mutation
const valOf=(s,v)=>{const lo=v.l==="5"?s[1]:s[3],hi=v.l==="5"?s[2]:s[4];return (lo+(hi-lo)*(v.q??100)/100)*(MUT[v.m||"None"]||MUTS[0])[1]};
function itemStats(v){const x=EB[v.n];if(!x)return [];const out=x.st.map(s=>[s[0],valOf(s,v),!!s[5]]);Object.entries((MUT[v.m||"None"]||MUTS[0])[2]).forEach(([n,a])=>{const o=out.find(z=>z[0]===n);if(o)o[1]+=a;else out.push([n,a,PCT.has(n)])});return out}
function totals(l){const t={};SLOTS.forEach(([k])=>{const v=l.slots[k];if(!v||!v.n||!owned(l,k))return;itemStats(v).forEach(([n,a,p])=>{t[n]=t[n]||{v:0,p};t[n].v+=a})});return t}
const ORDER=["Luck","Capacity","Size Boost","Sell Boost","Modifier Boost","Dig Strength","Dig Speed","Shake Strength","Shake Speed","Walk Speed","Inventory Size","Jump Power"];
const sortStats=o=>Object.keys(o).sort((a,b)=>(ORDER.indexOf(a)+99)%99-(ORDER.indexOf(b)+99)%99||a.localeCompare(b));
const valT=(a,p)=>(a<0?"−":"+")+fmt(Math.abs(a),2)+(p?"%":"");
const starT=v=>(v.l==="5"?"5★":"6★")+((v.q??100)!==100?` · ${v.q}%`:"");
function tile(l,k,label,kind,big){const own=owned(l,k);const v=l.slots[k];const x=v&&v.n?EB[v.n]:null;
  if(!own)return `<div class="tile lock${big?" big":""}" aria-label="${esc(label)} (not unlocked)"><span class="tk">${esc(label)}</span><span class="plus">🔒</span><span class="tag">Not unlocked</span></div>`;
  if(!x)return `<button type="button" class="tile empty${big?" big":""}" data-slot="${k}" aria-label="Pick a ${kind.toLowerCase()} for ${esc(label)}"><span class="tk">${esc(label)}</span><span class="plus">+</span><span class="tag">Empty</span></button>`;
  const mu=v.m&&v.m!=="None"?v.m:"";const img=IMG(x.n);
  return `<button type="button" class="tile${big?" big":""}" data-slot="${k}" data-tipk="${k}" data-equip="${esc(x.n)}" style="--tc:${RHEX[x.r]||"#3a444d"};--mc:${MCOL[mu]||"#fff"}" aria-label="${esc(label)}: ${esc(x.n)}"><span class="tk">${esc(label)}</span><span class="st">${v.l==="5"?"5★":"6★"} · ${v.q??100}%</span>${img?`<img src="${img}" alt="">`:""}<span class="meta">${mu?`<span class="mu">${esc(mu)}</span>`:""}<span class="tn">${esc(x.n)}</span><span class="tag" style="color:${RHEX[x.r]}">${x.r}</span></span></button>`}
function render(){const l=L();
  $("sel").innerHTML=D.list.map(x=>`<option value="${x.id}"${x.id===l.id?" selected":""}>${esc(x.name||"Untitled loadout")}</option>`).join("");
  if(document.activeElement!==$("name"))$("name").value=l.name;if(document.activeElement!==$("notes"))$("notes").value=l.notes||"";
  $("nRings").value=l.nRings;$("oRobux").checked=!!l.robux;
  $("panel").innerHTML=`<div class="toprow">${tile(l,"neck","Necklace","Necklace",true)}${tile(l,"charm","Charm","Charm",true)}</div><h3>Rings</h3><div class="rings">${SLOTS.slice(2).map(([k,lab])=>tile(l,k,lab,"Ring")).join("")}</div>`;
  const t=totals(l);const ks=sortStats(t);
  $("sum").innerHTML=ks.length?ks.map(n=>`<div class="ln"><span style="color:${statVar(n)}">${esc(n)}</span><span>${valT(t[n].v,t[n].p)}</span></div>`).join(""):'<p class="hint">Nothing equipped yet. Click a slot to add something.</p>';
  const cnt=SLOTS.filter(([k])=>owned(l,k)&&l.slots[k]&&l.slots[k].n).length,tot=SLOTS.filter(([k])=>owned(l,k)).length;
  $("sumNote").textContent=`${cnt} of ${tot} slots filled. Equipment only: museum, pan, shovel and boosts aren't included.`;
  renderCmp()}
// ---- hover card with the item's stats ----
const tip=$("tip");
function tipHTML(v){const x=EB[v.n];const mu=v.m&&v.m!=="None"?v.m:"";return `<b style="color:${RHEX[x.r]}">${mu?`<span style="color:${MCOL[mu]}">${esc(mu)}</span> `:""}${esc(x.n)}</b><small>${x.r} ${esc(x.slot)} · ${starT(v)}${ONE_ONLY.has(x.n)?" · only 1 can be worn":""}</small>${itemStats(v).map(([n,a,p])=>`<div class="ln"><span style="color:${statHex(n)}">${esc(n)}</span><span>${valT(a,p)}</span></div>`).join("")}`}
// in the picker, show an option's stats at the stars, quality and mutation picked above
const pickV=n=>({n,l:$("pkL").value,q:Math.max(0,Math.min(100,+$("pkP").value||0)),m:$("pkM").value});
document.addEventListener("mouseover",e=>{const o=e.target.closest("[data-tipn]");if(o){tip.innerHTML=tipHTML(pickV(o.dataset.tipn));tip.style.display="block";return}
  const t=e.target.closest("[data-tipk]");if(!t){tip.style.display="none";return}const v=L().slots[t.dataset.tipk];if(!v||!v.n)return;tip.innerHTML=tipHTML(v);tip.style.display="block"});
document.addEventListener("focusin",e=>{const o=e.target.closest("[data-tipn]");if(!o)return;tip.innerHTML=tipHTML(pickV(o.dataset.tipn));const b=o.getBoundingClientRect();tip.style.display="block";tip.style.left=Math.min(innerWidth-tip.offsetWidth-8,b.right+8)+"px";tip.style.top=Math.max(8,Math.min(innerHeight-tip.offsetHeight-8,b.top))+"px"});
document.addEventListener("mousemove",e=>{if(tip.style.display!=="block")return;const w=tip.offsetWidth,h=tip.offsetHeight;let x=e.clientX+14,y=e.clientY+14;if(x+w>innerWidth-8)x=e.clientX-w-14;if(y+h>innerHeight-8)y=innerHeight-h-8;tip.style.left=Math.max(8,x)+"px";tip.style.top=Math.max(8,y)+"px"});
document.addEventListener("mouseleave",()=>tip.style.display="none");
// touch screens fire a fake hover on tap: hide the card again so it doesn't stick
["touchstart","scroll"].forEach(ev=>window.addEventListener(ev,()=>{tip.style.display="none"},{passive:true,capture:true}));
// ---- picker ----
let PK=null;
$("pkM").innerHTML=MUTS.map(m=>`<option value="${m[0]}">${m[0]==="None"?"No mutation":m[0]+" (×"+m[1]+")"}</option>`).join("");
function openPick(k){const l=L();const def=SLOTS.find(s=>s[0]===k);const v=l.slots[k]||{};PK={k,kind:def[2],label:def[1],sel:v.n||""};
  $("pkT").textContent=`${def[1]}: pick a ${def[2].toLowerCase()}`;$("pkQ").value="";$("pkL").value=v.l||"6";$("pkP").value=v.q??100;$("pkM").value=v.m||"None";
  $("ov").hidden=false;drawPick();setTimeout(()=>$("pkQ").focus(),0)}
function drawPick(){const l=L();const q=$("pkQ").value.trim().toLowerCase();
  const used=new Set(SLOTS.filter(([k])=>k!==PK.k&&l.slots[k]&&l.slots[k].n&&owned(l,k)).map(([k])=>l.slots[k].n));
  const RO=["Exotic","Mythic","Legendary","Epic","Rare","Uncommon","Common"];
  const items=EQ.filter(x=>x.slot===PK.kind&&(!q||(x.n+" "+x.st.map(s=>s[0]).join(" ")).toLowerCase().includes(q))).sort((a,b)=>RO.indexOf(a.r)-RO.indexOf(b.r)||a.n.localeCompare(b.n));
  $("pkList").innerHTML=items.map(x=>{const blocked=ONE_ONLY.has(x.n)&&used.has(x.n);const img=IMG(x.n);
    return `<button type="button" class="pi" data-pick="${esc(x.n)}" data-tipn="${esc(x.n)}" data-equip="${esc(x.n)}" style="--rc:${rc(x.r)}" aria-pressed="${PK.sel===x.n}"${blocked?` disabled title="Only 1 can be worn and it's already in another slot"`:""}>${img?`<img src="${img}" alt="">`:""}<span><b>${esc(x.n)}</b><small>${x.r}${x.ev?" · limited":""}${blocked?" · already worn":""}</small></span></button>`}).join("")||'<p class="hint">Nothing matches.</p>'}
function closePick(){$("ov").hidden=true;PK=null;tip.style.display="none"}
function setSlot(patch){const l=L();l.slots[PK.k]=Object.assign({},l.slots[PK.k]||{},patch);save();render()}
$("pkQ").oninput=drawPick;$("pkX").onclick=closePick;$("ov").addEventListener("click",e=>{if(e.target===$("ov"))closePick()});
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!$("ov").hidden)closePick()});
$("pkList").addEventListener("click",e=>{if(e.ctrlKey||e.metaKey)return;const b=e.target.closest("[data-pick]");if(!b||b.disabled)return;PK.sel=b.dataset.pick;setSlot({n:PK.sel,l:$("pkL").value,q:Math.max(0,Math.min(100,+$("pkP").value||0)),m:$("pkM").value});closePick()});
["pkL","pkP","pkM"].forEach(id=>$(id).addEventListener("change",()=>{const l=L();if(l.slots[PK.k]&&l.slots[PK.k].n)setSlot({l:$("pkL").value,q:Math.max(0,Math.min(100,+$("pkP").value||0)),m:$("pkM").value})}));
$("pkClear").onclick=()=>{const l=L();delete l.slots[PK.k];save();render();closePick()};
$("panel").addEventListener("click",e=>{if(e.ctrlKey||e.metaKey)return;const t=e.target.closest("[data-slot]");if(t){tip.style.display="none";openPick(t.dataset.slot)}});
// ---- loadout list, name, slots, notes ----
$("sel").onchange=()=>{D.cur=$("sel").value;if(D.cmp===D.cur)D.cmp=null;save();render()};
$("bNew").onclick=()=>{const n=blank();const c=L();n.nRings=c.nRings;n.robux=c.robux;D.list.push(n);D.cur=n.id;save();render();$("name").focus();$("name").select()};
$("bDup").onclick=()=>{const c=JSON.parse(JSON.stringify(L()));c.id=blank().id;c.name=(c.name||"Loadout")+" (copy)";D.list.push(c);D.cur=c.id;save();render();toast("Duplicated")};
let armDel=false,delT=null;
$("bDel").onclick=()=>{if(!armDel){armDel=true;$("bDel").textContent="Click again to delete";clearTimeout(delT);delT=setTimeout(()=>{armDel=false;$("bDel").textContent="Delete"},3000);return}
  armDel=false;$("bDel").textContent="Delete";const gone=L().name;D.list=D.list.filter(l=>l.id!==D.cur);if(!D.list.length)D.list=[blank()];D.cur=D.list[0].id;if(!D.list.some(l=>l.id===D.cmp))D.cmp=null;save();render();toast(`Deleted "${gone}"`)};
$("name").oninput=()=>{L().name=$("name").value;save();const o=$("sel").querySelector(`option[value="${D.cur}"]`);if(o)o.textContent=$("name").value||"Untitled loadout";renderCmp()};
$("name").addEventListener("blur",()=>{if(!L().name.trim()){L().name=randomName();save();render()}});
$("notes").oninput=()=>{L().notes=$("notes").value;save()};
$("nRings").oninput=()=>{L().nRings=Math.max(0,Math.min(6,+$("nRings").value||0));save();render()};
$("oRobux").onchange=()=>{L().robux=$("oRobux").checked;save();render()};
// ---- compare ----
// % better or worse than the other loadout; "new" when the other has none of that stat
const pctT=(a,b)=>{if(Math.abs(a-b)<1e-9)return "same";if(Math.abs(b)<1e-9)return a>0?"new":"—";const p=(a-b)/Math.abs(b)*100;return (p>0?"+":"−")+fmt(Math.abs(p),Math.abs(p)<10?1:0)+"%"+(p>0?" better":" worse")};
function renderCmp(){const l=L();const others=D.list.filter(x=>x.id!==l.id);
  $("cmpSel").innerHTML=`<option value="">${others.length?"Pick a loadout":"Make another loadout to compare"}</option>`+others.map(x=>`<option value="${x.id}"${x.id===D.cmp?" selected":""}>${esc(x.name||"Untitled loadout")}</option>`).join("");
  const o=others.find(x=>x.id===D.cmp);if(!o){$("cmp").innerHTML='<p class="hint">Pick another saved loadout to see the stat differences side by side.</p>';return}
  const a=totals(l),b=totals(o);const ks=sortStats(Object.assign({},a,b));
  const rows=ks.map(n=>{const va=(a[n]||{v:0}).v,vb=(b[n]||{v:0}).v,p=(a[n]||b[n]).p;const d=va-vb;const cl=d>1e-9?"up":d<-1e-9?"dn":"";return `<tr><td style="color:${statVar(n)}">${esc(n)}</td><td data-l="${esc(l.name)}">${valT(va,p)}</td><td data-l="${esc(o.name)}">${valT(vb,p)}</td><td class="${cl}" data-l="Difference">${Math.abs(d)<1e-9?"same":valT(d,p)}</td><td class="${cl}" data-l="% better / worse">${pctT(va,vb)}</td></tr>`}).join("");
  // which slots hold something different
  const desc=v=>v&&v.n?`${v.m&&v.m!=="None"?v.m+" ":""}${v.n} (${starT(v)})`:"empty";
  const diffs=SLOTS.filter(([k])=>owned(l,k)||owned(o,k)).map(([k,lab])=>{const x=owned(l,k)?desc(l.slots[k]):"not unlocked",y=owned(o,k)?desc(o.slots[k]):"not unlocked";return x===y?null:`<li><b>${esc(lab)}:</b> ${esc(x)} vs ${esc(y)}</li>`}).filter(Boolean);
  $("cmp").innerHTML=`<div style="overflow-x:auto"><table class="cmp"><tr><th>Stat</th><th>${esc(l.name)}</th><th>${esc(o.name)}</th><th>Difference</th><th title="How much better or worse this loadout is than the other one, for each stat">% better / worse</th></tr>${rows||'<tr><td colspan="5" class="hint">Both are empty.</td></tr>'}</table></div>${diffs.length?`<p class="lab" style="margin:10px 0 4px">Different slots</p><ul class="diffl">${diffs.join("")}</ul>`:'<p class="hint" style="margin-top:8px">Same items in every slot.</p>'}`}
$("cmpSel").onchange=()=>{D.cmp=$("cmpSel").value||null;save();renderCmp()};
// ---- copy as text ----
function toast(t){const d=document.createElement("div");d.className="toast";d.setAttribute("role","status");d.textContent=t;document.body.appendChild(d);setTimeout(()=>d.remove(),2200)}
function asText(l){const lines=[l.name||"Loadout"];const one=v=>v&&v.n?`${v.m&&v.m!=="None"?v.m+" ":""}${v.n} (${starT(v)})`:"empty";
  lines.push("Necklace: "+one(l.slots.neck),"Charm: "+one(l.slots.charm));
  const rs=SLOTS.slice(2).filter(([k])=>owned(l,k)).map(([k])=>l.slots[k]).filter(v=>v&&v.n);const g=[];rs.forEach(v=>{const s=one(v);const o=g.find(x=>x.s===s);if(o)o.c++;else g.push({s,c:1})});
  lines.push("Rings: "+(g.length?g.map(x=>`${x.c}× ${x.s}`).join(", "):"none"));
  const t=totals(l);const ks=sortStats(t);if(ks.length)lines.push("","Totals: "+ks.map(n=>`${n} ${valT(t[n].v,t[n].p)}`).join(", "));
  if((l.notes||"").trim())lines.push("","Notes: "+l.notes.trim());return lines.join("\n")}
function copyText(txt){const done=()=>toast("Copied");const fb=()=>{const ta=document.createElement("textarea");ta.value=txt;ta.style.position="fixed";ta.style.opacity="0";document.body.appendChild(ta);ta.select();try{document.execCommand("copy");done()}catch(e){toast("Copy not available here")}ta.remove()};
  try{navigator.clipboard.writeText(txt).then(done,fb)}catch(e){fb()}}
$("bCopy").onclick=()=>copyText(asText(L()));
// ---- save as image: the equipment panel, the totals and the notes ----
async function loadImage(){const l=L();const F='"IBM Plex Sans","Segoe UI",system-ui,sans-serif',FD='"Chakra Petch","Segoe UI",system-ui,sans-serif',FM='"IBM Plex Mono",Consolas,monospace';try{await document.fonts.ready}catch(e){}
  const W=1200,PAD=40,LW=760,GAP=14,TS=(LW-GAP*3)/4;const t=totals(l);const ks=sortStats(t);
  const m=document.createElement("canvas").getContext("2d");const wrap=(s,w,font)=>{m.font=font;const out=[];String(s).split("\n").forEach(par=>{const ws=par.split(" ");let ln="";ws.forEach(x=>{const tt=ln?ln+" "+x:x;if(m.measureText(tt).width>w&&ln){out.push(ln);ln=x}else ln=tt});out.push(ln)});return out};
  const notes=(l.notes||"").trim()?wrap(l.notes.trim(),W-PAD*2-28,`14px ${F}`):[];
  const ringRows=2;const panelH=24+150+40+ringRows*TS+GAP*(ringRows-1)+20;const sumH=60+Math.max(1,ks.length)*34;
  const H=PAD+92+Math.max(panelH,sumH)+(notes.length?40+notes.length*20+20:0)+PAD;
  const cv=document.createElement("canvas");const sc=2;cv.width=W*sc;cv.height=H*sc;const c=cv.getContext("2d");c.scale(sc,sc);
  const rr=(x,y,w,h,r)=>{c.beginPath();c.moveTo(x+r,y);c.arcTo(x+w,y,x+w,y+h,r);c.arcTo(x+w,y+h,x,y+h,r);c.arcTo(x,y+h,x,y,r);c.arcTo(x,y,x+w,y,r);c.closePath()};
  const fit=(s,w)=>{if(c.measureText(s).width<=w)return s;while(s.length>1&&c.measureText(s+"…").width>w)s=s.slice(0,-1);return s+"…"};
  const img=src=>new Promise(res=>{if(!src)return res(null);const i=new Image();i.onload=()=>res(i);i.onerror=()=>res(null);i.src=src});
  c.fillStyle="#14181c";c.fillRect(0,0,W,H);
  c.font=`600 13px ${F}`;const mb="Made by @__coastal";const mw=c.measureText(mb).width+28,mx=W-PAD-mw,my=PAD-6;c.fillStyle="rgba(20,184,166,.14)";rr(mx,my,mw,26,13);c.fill();c.strokeStyle="rgba(20,184,166,.6)";c.lineWidth=1;rr(mx,my,mw,26,13);c.stroke();c.fillStyle="#14b8a6";c.beginPath();c.arc(mx+12,my+13,3,0,Math.PI*2);c.fill();c.fillStyle="#2dd4bf";c.fillText(mb,mx+20,my+17.5);
  c.fillStyle="#e6e9ec";c.font=`700 34px ${FD}`;c.fillText(fit(l.name||"Loadout",W-PAD*2-mw-20),PAD,PAD+30);
  const cnt=SLOTS.filter(([k])=>owned(l,k)&&l.slots[k]&&l.slots[k].n).length,tot=SLOTS.filter(([k])=>owned(l,k)).length;
  c.fillStyle="#98a2ad";c.font=`15px ${F}`;c.fillText(`${cnt} of ${tot} slots filled`,PAD,PAD+58);
  const y0=PAD+82;c.fillStyle="#1a2026";rr(PAD,y0,LW+28,panelH,14);c.fill();c.strokeStyle="#2f3942";rr(PAD,y0,LW+28,panelH,14);c.stroke();
  const icons={};await Promise.all(SLOTS.map(([k])=>{const v=l.slots[k];return v&&v.n?img(IMG(v.n)).then(i=>icons[k]=i):null}));
  const drawTile=(k,label,x,y,w,h,big)=>{const own=owned(l,k);const v=l.slots[k];const it=v&&v.n?EB[v.n]:null;const col=it?RHEX[it.r]:"#3a444d";
    c.fillStyle=own&&it?"#1d242b":"#12171b";rr(x,y,w,h,12);c.fill();c.lineWidth=2;c.strokeStyle=col;if(!it)c.setLineDash([5,4]);rr(x,y,w,h,12);c.stroke();c.setLineDash([]);c.lineWidth=1;
    c.fillStyle="#98a2ad";c.font=`700 10px ${F}`;c.fillText(label.toUpperCase(),x+9,y+16);
    if(!own){c.fillStyle="#5d6670";c.font=`12px ${F}`;c.fillText("Not unlocked",x+9,y+h-12);return}
    if(!it){c.fillStyle="#5d6670";c.font=`12px ${F}`;c.fillText("Empty",x+9,y+h-12);return}
    c.fillStyle="#ffd36b";c.font=`700 11px ${F}`;const stt=(v.l==="5"?"5★":"6★")+" · "+(v.q??100)+"%";c.fillText(stt,x+w-9-c.measureText(stt).width,y+16);
    const mu=v.m&&v.m!=="None"?v.m:"";const ic=icons[k];
    if(big){if(ic)c.drawImage(ic,x+12,y+(h-84)/2+6,84,84);const tx=x+(ic?108:12);let ty=y+h/2-6;
      if(mu){c.fillStyle=MCOL[mu];c.font=`700 11px ${F}`;c.fillText(mu.toUpperCase(),tx,ty-16)}
      c.fillStyle="#e6e9ec";c.font=`600 16px ${F}`;c.fillText(fit(it.n,x+w-tx-10),tx,ty+4);c.fillStyle=col;c.font=`600 12px ${F}`;c.fillText(it.r,tx,ty+24)}
    else{const s=Math.min(w*.55,90);if(ic)c.drawImage(ic,x+(w-s)/2,y+22,s,s);let ty=y+h-26;c.fillStyle="#e6e9ec";c.font=`600 12px ${F}`;const nm=fit(it.n,w-14);c.fillText(nm,x+(w-c.measureText(nm).width)/2,ty);
      c.fillStyle=col;c.font=`600 11px ${F}`;c.fillText(it.r,x+(w-c.measureText(it.r).width)/2,ty+15);
      if(mu){c.fillStyle=MCOL[mu];c.font=`700 10px ${F}`;const mt=mu.toUpperCase();c.fillText(mt,x+(w-c.measureText(mt).width)/2,ty-15)}}};
  const px=PAD+14,BW=(LW-GAP)/2;drawTile("neck","Necklace",px,y0+14,BW,150,true);drawTile("charm","Charm",px+BW+GAP,y0+14,BW,150,true);
  c.fillStyle="#98a2ad";c.font=`700 12px ${F}`;c.fillText("RINGS",px,y0+14+150+26);
  SLOTS.slice(2).forEach(([k,lab],i)=>{const cx=px+(i%4)*(TS+GAP),cy=y0+14+150+40+Math.floor(i/4)*(TS+GAP);drawTile(k,lab,cx,cy,TS,TS,false)});
  const sx=PAD+LW+28+GAP,SW=W-PAD-sx;c.fillStyle="#1c2126";rr(sx,y0,SW,Math.max(panelH,sumH),14);c.fill();c.strokeStyle="#2d343b";rr(sx,y0,SW,Math.max(panelH,sumH),14);c.stroke();
  c.fillStyle="#98a2ad";c.font=`700 12px ${F}`;c.fillText("TOTAL STATS",sx+16,y0+28);
  if(!ks.length){c.fillStyle="#5d6670";c.font=`italic 14px ${F}`;c.fillText("Nothing equipped",sx+16,y0+60)}
  ks.forEach((n,i)=>{const yy=y0+52+i*34;c.fillStyle=statHex(n);c.font=`600 14px ${F}`;c.fillText(n,sx+16,yy+14);const vt=valT(t[n].v,t[n].p);c.fillStyle="#e6e9ec";c.font=`500 14px ${FM}`;c.fillText(vt,sx+SW-16-c.measureText(vt).width,yy+14);if(i<ks.length-1){c.strokeStyle="#262d34";c.beginPath();c.moveTo(sx+16,yy+26);c.lineTo(sx+SW-16,yy+26);c.stroke()}});
  if(notes.length){let y=y0+Math.max(panelH,sumH)+20;c.fillStyle="#1c2126";rr(PAD,y,W-PAD*2,notes.length*20+44,12);c.fill();c.strokeStyle="#2d343b";rr(PAD,y,W-PAD*2,notes.length*20+44,12);c.stroke();
    c.fillStyle="#98a2ad";c.font=`700 12px ${F}`;c.fillText("NOTES",PAD+14,y+22);c.fillStyle="#e6e9ec";c.font=`14px ${F}`;notes.forEach((ln,i)=>c.fillText(ln,PAD+14,y+44+i*20))}
  return await new Promise(res=>cv.toBlob(res,"image/png"))}
window.ptLoadoutImage=loadImage;
$("bImg").onclick=async()=>{let blob=null;try{blob=await loadImage()}catch(e){console.error(e)}if(!blob){toast("Couldn't draw the image");return}
  const nm=(L().name||"Loadout").replace(/[\\/:*?"<>|]+/g," ").trim()||"Loadout";
  try{await window.parent.ptSave(nm+".png",blob);toast((()=>{try{return window.parent.ptImgMsg()}catch(e){return "Image saved"}})())}catch(e){const c=e&&e.code;if(c!=="declined")toast(c==="rate_limited"?"A save prompt is already open":"Couldn't save the image here")}};
window.ptOpenFor=(kind,name)=>{const x=EB[name];if(!x)return;const l=L();const k=x.slot==="Necklace"?"neck":x.slot==="Charm"?"charm":(SLOTS.slice(2).find(([k])=>owned(l,k)&&!(l.slots[k]&&l.slots[k].n))||["r0"])[0];openPick(k)};
render();
