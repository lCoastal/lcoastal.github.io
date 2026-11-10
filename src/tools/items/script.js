
const $=id=>document.getElementById(id);const X=P.x2||{potions:[],runes:[],runeSlots:[],totems:[]};
const TABS=["pot","tot","trn"];let tab="pot";try{tab=localStorage.getItem("pi-tab")||"pot"}catch(e){}
// Potions and Totems are two separate pages that share this file; the toolkit's tab strip switches between them
const PAGEINFO={pot:["Potions","Every potion: what it does, how long it lasts and where to buy it.<br>Potions can be switched on in the Stat Calculator's Boosts."],tot:["Totems","Every totem and what it adds to your boosts."],trn:["Trinkets","Every trinket: what its perk does and how to get it."]};
function setTab(t){if(!TABS.includes(t))t="pot";tab=t;$("ttl").textContent=PAGEINFO[t][0];document.querySelector(".lede").innerHTML=PAGEINFO[t][1];document.title=PAGEINFO[t][0];try{window.parent.ptSubChanged&&window.parent.ptSubChanged("items",t)}catch(e){}TABS.forEach(k=>{$("t-"+k).setAttribute("aria-selected",String(k===t));$("t-"+k).tabIndex=k===t?0:-1;$("p-"+k).hidden=k!==t});try{localStorage.setItem("pi-tab",t)}catch(e){}}
document.querySelector(".tabs").addEventListener("click",e=>{const b=e.target.closest("[role=tab]");if(b)setTab(b.id.slice(2))});
document.querySelector(".tabs").addEventListener("keydown",e=>{if(!/Arrow(Left|Right)/.test(e.key))return;const i=TABS.indexOf(tab);const n=TABS[(i+(e.key==="ArrowRight"?1:TABS.length-1))%TABS.length];setTab(n);$("t-"+n).focus()});
window.ptOpenTab=setTab;
// "+300 Luck, +200 Capacity, +3 Walkspeed (20 min)" -> chips
const fxParts=fx=>{const m=String(fx).match(/\(([^)]*)\)\s*$/);return {time:m?m[1]:"",parts:String(fx).replace(/\([^)]*\)\s*$/,"").split(/,\s*/).map(x=>x.trim()).filter(Boolean)}};
// "+300 Luck" -> "Luck", so each effect can take its stat colour
const fxStat=p=>p.replace(/^[+\-−]?[\d.,]+%?\s*/,"");
const fxChips=fx=>{const {time,parts}=fxParts(fx);
  return `<div class="fx">${parts.map(p=>`<span style="--kc:${statVar(fxStat(p))}">${esc(p)}</span>`).join("")}${time?`<span class="t">${esc(time)}</span>`:""}</div>`};
// what a potion is paid with: money ($), Meteor Shards, or either
const payKinds=c=>({money:/\$/.test(c),shards:/shard/i.test(c)});
let cur="both";try{cur=localStorage.getItem("pi-cur")||"both"}catch(e){}
let hideTM=false;try{hideTM=localStorage.getItem("pi-hidetm")==="1"}catch(e){}
const costHTML=c=>String(c).split(/\s*\/\s*/).map(x=>`<span class="${/shard/i.test(x)?"cs":/\$/.test(x)?"cm":""}">${esc(x)}</span>`).join(" or ");
const shownPots=()=>{const q=$("pq").value.trim().toLowerCase();return X.potions.filter(p=>{const k=payKinds(p.cost);return (!q||(p.n+" "+p.fx+" "+p.where).toLowerCase().includes(q))&&(cur==="both"||k[cur])&&!(hideTM&&/travel/i.test(p.where||""))})};
function pots(){document.querySelectorAll("[data-cur]").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.cur===cur)));const groups={};shownPots().forEach(p=>(groups[p.where]=groups[p.where]||[]).push(p));
  $("pots").innerHTML=Object.entries(groups).map(([w,ps])=>`<div><p class="grp">${esc(w)}</p><div class="grid">${ps.map(p=>`<div class="it"><b>${esc(p.n)}</b>${fxChips(p.fx)}<p class="cost">${costHTML(p.cost)}</p>${p.d&&p.d!=="???"?`<p class="d">${esc(p.d)}</p>`:""}</div>`).join("")}</div></div>`).join("")||'<div class="empty">No potions match.</div>'}
$("pq").oninput=pots;
$("hideTM").checked=hideTM;$("hideTM").onchange=()=>{hideTM=$("hideTM").checked;try{localStorage.setItem("pi-hidetm",hideTM?"1":"0")}catch(e){}pots()};
document.querySelector("[aria-label='Paid with']").addEventListener("click",e=>{const b=e.target.closest("[data-cur]");if(!b)return;cur=b.dataset.cur;try{localStorage.setItem("pi-cur",cur)}catch(e){}pots()});
pots();
// ---- save the potions currently shown as an image, grouped by shop like the page ----
function toast(t){const d=document.createElement("div");d.className="toast";d.setAttribute("role","status");d.textContent=t;document.body.appendChild(d);setTimeout(()=>d.remove(),2200)}
async function potImage(){const list=shownPots();if(!list.length)return null;
  const F='"IBM Plex Sans","Segoe UI",system-ui,sans-serif',FD='"Chakra Petch","Segoe UI",system-ui,sans-serif',FM='"IBM Plex Mono",Consolas,monospace';try{await document.fonts.ready}catch(e){}
  const W=1300,PAD=40,GAP=14,COLS=3,CW=(W-PAD*2-GAP*(COLS-1))/COLS,IN=16;
  const m=document.createElement("canvas").getContext("2d");
  const wrap=(t,w,font)=>{m.font=font;const ws=String(t).split(" ");const o=[];let l="";ws.forEach(x=>{const tt=l?l+" "+x:x;if(m.measureText(tt).width>w&&l){o.push(l);l=x}else l=tt});if(l)o.push(l);return o};
  // effect chips flow left to right and wrap inside the card
  const chipRows=p=>{const {time,parts}=fxParts(p.fx);const all=parts.map(x=>({t:x,col:statHex(fxStat(x))})).concat(time?[{t:time,col:"#98a2ad",tm:true}]:[]);m.font=`12px ${F}`;const rows=[[]];let w=0;all.forEach(ch=>{const cw=m.measureText(ch.t).width+18;if(w+cw>CW-IN*2&&rows[rows.length-1].length){rows.push([]);w=0}rows[rows.length-1].push({...ch,w:cw});w+=cw+6});return rows};
  const card=p=>{const cr=chipRows(p);const dl=p.d&&p.d!=="???"?wrap(p.d,CW-IN*2,`italic 13px ${F}`):[];return {p,cr,dl,h:IN+22+8+cr.length*26+6+20+(dl.length?6+dl.length*18:0)+IN}};
  const groups=[];list.forEach(p=>{let g=groups.find(x=>x.w===p.where);if(!g)groups.push(g={w:p.where,cards:[]});g.cards.push(card(p))});
  let H=PAD+92;groups.forEach(g=>{H+=34;for(let i=0;i<g.cards.length;i+=COLS)H+=Math.max(...g.cards.slice(i,i+COLS).map(c=>c.h))+GAP;H+=8});H+=PAD;
  const cv=document.createElement("canvas");const sc=2;cv.width=W*sc;cv.height=H*sc;const c=cv.getContext("2d");c.scale(sc,sc);
  const rr=(x,y,w,h,r)=>{c.beginPath();c.moveTo(x+r,y);c.arcTo(x+w,y,x+w,y+h,r);c.arcTo(x+w,y+h,x,y+h,r);c.arcTo(x,y+h,x,y,r);c.arcTo(x,y,x+w,y,r);c.closePath()};
  const fit=(t,w)=>{if(c.measureText(t).width<=w)return t;while(t.length>1&&c.measureText(t+"…").width>w)t=t.slice(0,-1);return t+"…"};
  c.fillStyle="#14181c";c.fillRect(0,0,W,H);
  c.font=`600 13px ${F}`;const mb="Made by @__coastal";const mw=c.measureText(mb).width+28,mx=W-PAD-mw,my=PAD-6;c.fillStyle="rgba(20,184,166,.14)";rr(mx,my,mw,26,13);c.fill();c.strokeStyle="rgba(20,184,166,.6)";c.lineWidth=1;rr(mx,my,mw,26,13);c.stroke();c.fillStyle="#14b8a6";c.beginPath();c.arc(mx+12,my+13,3,0,Math.PI*2);c.fill();c.fillStyle="#2dd4bf";c.fillText(mb,mx+20,my+17.5);
  const title=cur==="money"?"Potions you buy with money":cur==="shards"?"Potions you buy with shards":"All potions";
  c.fillStyle="#e6e9ec";c.font=`700 34px ${FD}`;c.fillText(title,PAD,PAD+30);
  const q=$("pq").value.trim();const sub=[`${list.length} potion${list.length===1?"":"s"}`];if(q)sub.push(`matching "${q}"`);
  c.fillStyle="#98a2ad";c.font=`15px ${F}`;c.fillText(sub.join(" · "),PAD,PAD+58);
  let y=PAD+92;
  groups.forEach(g=>{c.fillStyle="#98a2ad";c.font=`700 12px ${F}`;c.fillText(g.w.toUpperCase(),PAD,y+18);y+=34;
    for(let i=0;i<g.cards.length;i+=COLS){const row=g.cards.slice(i,i+COLS);const rh=Math.max(...row.map(x=>x.h));
      row.forEach((cd,j)=>{const x=PAD+j*(CW+GAP);c.fillStyle="#1c2126";rr(x,y,CW,rh,9);c.fill();c.strokeStyle="#2d343b";c.lineWidth=1;rr(x,y,CW,rh,9);c.stroke();c.fillStyle="#3cc2a8";c.fillRect(x+9,y,CW-18,3);
        let yy=y+IN+16;c.fillStyle="#e6e9ec";c.font=`700 17px ${FD}`;c.fillText(fit(cd.p.n,CW-IN*2),x+IN,yy);yy+=14;
        cd.cr.forEach(rw=>{let cx=x+IN;rw.forEach(ch=>{c.strokeStyle=ch.tm?"#2d343b":ch.col+"88";c.lineWidth=1;rr(cx,yy,ch.w,21,10.5);c.stroke();c.fillStyle=ch.col;c.font=`12px ${F}`;c.fillText(ch.t,cx+9,yy+14.5);cx+=ch.w+6});yy+=26});
        yy+=20;c.font=`500 13px ${FM}`;let cx=x+IN;String(cd.p.cost).split(/\s*\/\s*/).forEach((pt,k)=>{if(k){c.fillStyle="#98a2ad";c.font=`13px ${F}`;c.fillText(" or ",cx,yy);cx+=c.measureText(" or ").width;c.font=`500 13px ${FM}`}c.fillStyle=/shard/i.test(pt)?"#ff6ec7":/\$/.test(pt)?"#e6e9ec":"#e6e9ec";c.fillText(pt,cx,yy);cx+=c.measureText(pt).width});
        if(cd.dl.length){yy+=6;c.fillStyle="#98a2ad";c.font=`italic 13px ${F}`;cd.dl.forEach(l=>{yy+=18;c.fillText(l,x+IN,yy)})}});
      y+=rh+GAP}
    y+=8});
  return await new Promise(res=>cv.toBlob(res,"image/png"))}
window.ptPotImage=potImage;
$("potImg").onclick=async()=>{let blob=null;try{blob=await potImage()}catch(e){console.error(e)}if(!blob){toast("No potions to save. Change the search or filter.");return}
  const nm=cur==="money"?"Money potions":cur==="shards"?"Shard potions":"Potions";
  try{await window.parent.ptSave(nm+".png",blob);toast((()=>{try{return window.parent.ptImgMsg()}catch(e){return "Image saved"}})())}catch(e){const c=e&&e.code;if(c!=="declined")toast(c==="rate_limited"?"A save prompt is already open":"Couldn't save the image here")}};
const TOT=[...X.totems,{n:"Luminant Totem",cost:"600 Meteor Shards",d:"+0.5× capacity multiplier and +50 shake and dig speed for nearby players.",where:"Rotwood Swamp"},{n:"Friendship Totem",cost:"",d:"+0.4× luck with just you, plus +0.2× for each other player in range (up to +5.2× with 20 players).",where:""}];
// stat names in totem text take their stat colour (luck green and so on)
const STATW=/\b(luck|capacity|size boost|sell boost|modifier boost|dig strength|dig speed|shake strength|shake speed|walk ?speed|strength)\b/gi;
// "dig and shake strength" / "shake and dig speed": colour each half with its own stat
const pair=(a,b,kind)=>`<span style="color:${statVar(a+" "+kind)};font-weight:600">${a}</span> and <span style="color:${statVar(b+" "+kind)};font-weight:600">${b} ${kind}</span>`;
const statText=t=>{const P=[];let h=esc(t).replace(/\b(dig|shake) and (dig|shake) (strength|speed)\b/gi,(m,a,b,k)=>{P.push(pair(a,b,k));return "\u0000"+(P.length-1)+"\u0000"});
  h=h.replace(STATW,w=>/^strength$/i.test(w)?w:`<span style="color:${statVar(w.replace(/walkspeed/i,"walk speed"))};font-weight:600">${w}</span>`);
  return h.replace(/\u0000(\d+)\u0000/g,(m,i)=>P[+i])};
const statText0=t=>esc(t).replace(STATW,w=>{const k=/^strength$/i.test(w)?null:w;return k?`<span style="color:${statVar(k.replace(/walkspeed/i,"walk speed"))};font-weight:600">${w}</span>`:w});
// trinkets: perk, how to get it, where, any mastery needed, and a link to the quest when there is one
const TRN=X.trinkets||[];
$("trns").innerHTML=TRN.map(t=>`<div class="it"><b>${esc(t.n)}</b><p>${statText(t.fx)}</p>
  ${t.req?`<p><span class="rq">Needs ${esc(t.req)}</span></p>`:""}
  <p class="hint" style="font-size:13px"><span class="lab" style="margin-right:6px">How to get</span>${esc(t.how)}</p>
  ${t.cost?`<p class="cost">${costHTML(t.cost)}</p>`:""}
  <p class="src"><span class="lk" data-location="${esc(t.where)}">${esc(t.where)}</span>${t.quest?` · <button type="button" class="qlink" data-quest="${esc(t.quest)}">${esc(t.quest)} quest</button>`:""}</p></div>`).join("")||'<p class="hint">No trinkets found.</p>';
document.addEventListener("click",e=>{const q=e.target.closest("[data-quest]");if(q){try{window.parent.ptCallTool("quests","ptOpenItem",q.dataset.quest)}catch(err){}}});
$("tots").innerHTML=TOT.map(t=>`<div class="it"><b>${esc(t.n)}</b><p>${statText(t.d)}</p>${t.cost?`<p class="cost">${costHTML(t.cost)}</p>`:""}${t.where&&t.where!==t.cost?`<p class="src">${esc(t.where)}</p>`:""}</div>`).join("");
$("slots").innerHTML=`<tr><th>Level</th><th>Rune slots</th></tr>`+X.runeSlots.map(([l,s])=>`<tr><td>${l}</td><td>${s}</td></tr>`).join("");
const RC=n=>/Annihilation/.test(n)?"var(--neg)":/Sun|Critical|Discovery/.test(n)?"var(--c-legendary)":/Abyssal|Singularity/.test(n)?"var(--c-epic)":/Purity|Mountain|Summit|Speed/.test(n)?"var(--c-rare)":"var(--accent)";
$("runes").innerHTML=X.runes.map(r=>`<div class="it" style="--ac:${RC(r.n)}"><b>${esc(r.n)}</b><p>${esc(r.d)}</p><p class="src">${(()=>{const l=P.locs.find(l=>r.w.includes(l.n));return l?`<span data-location="${esc(l.n)}">${esc(r.w)}</span>`:esc(r.w)})()}</p></div>`).join("");
setTab(tab);
