
const $=id=>document.getElementById(id);const X=P.x2||{runes:[],runeSlots:[]};
const SLOTS=X.runeSlots.length?X.runeSlots:[[1,1],[10,2],[20,3],[30,4],[40,5]];
const KIND=n=>/Abyssal|Sunblessed|Solitude|Purity|Veteran/.test(n)?["Luck","var(--c-legendary)"]:/Speed I|Mountain|Summit|Equalizer|Bunny/.test(n)?["Movement & speed","var(--c-rare)"]:/Critical/.test(n)?["Digging","var(--c-mythic)"]:/Annihilation/.test(n)?["Auto-destroy","var(--neg)"]:["Utility","var(--c-epic)"];
const KC={"Luck":"var(--c-legendary)","Movement & speed":"var(--c-rare)","Digging":"var(--c-mythic)","Utility":"var(--c-epic)","Auto-destroy":"var(--neg)"};
const R=X.runes.map(r=>({...r,k:r.c&&KC[r.c]?[r.c,KC[r.c]]:KIND(r.n)}));
let S={lvl:40,sel:[],fav:false,own:false};try{Object.assign(S,JSON.parse(localStorage.getItem("pr-s")||"{}"))}catch(e){}
const save=()=>{try{localStorage.setItem("pr-s",JSON.stringify(S))}catch(e){}};
const slotsFor=l=>SLOTS.filter(([lv])=>l>=lv).reduce((m,[,s])=>Math.max(m,s),1);
// rough summary of what the picked runes add
function summary(names){const out=[];let walk=0;names.forEach(n=>{if(/^Speed I$/.test(n))walk+=2;if(/Mountain Climber/.test(n))walk+=3});
  if(names.includes("Sunblessed"))out.push("+0.2× luck in sunlight");if(names.includes("Abyssal"))out.push("+0.2× luck at night");if(names.includes("Solitude"))out.push("+0.2× luck when alone");if(names.includes("Purity"))out.push("+1× luck, no modifiers");if(names.includes("Veteran"))out.push("+0.25× luck in fully mastered regions");if(names.includes("Seeker's Mark"))out.push("quest items 10% easier to get");
  if(walk)out.push(`+${walk} walk speed`);if(names.includes("Summit Seeker")&&walk)out.push(`+${walk*5}% dig & shake speed`);if(names.includes("Critical I")||names.includes("Critical II"))out.push("20% chance of 2× dig strength"+(names.includes("Critical I")&&names.includes("Critical II")?" (×2 runes)":""));
  if(names.some(n=>/Annihilation/.test(n)))out.push("auto-destroys "+names.filter(n=>/Annihilation/.test(n)).map(n=>({"Annihilation I":"common & uncommon","Annihilation II":"rare & epic","Annihilation III":"legendary"})[n]).join(", "));
  return out}
// combined effects that depend on more than one rune, shown on the rune they belong to
function combos(names){const o={};let walk=0;names.forEach(n=>{if(/^Speed I$/.test(n))walk+=2;if(/Mountain Climber/.test(n))walk+=3});
  if(names.includes("Summit Seeker"))o["Summit Seeker"]=walk?`With your runes: +${walk} walk speed → +${walk*5}% dig & shake speed`:"No walk speed runes picked, so this adds nothing yet";
  if(names.includes("Critical I")&&names.includes("Critical II"))o["Critical II"]="Stacks with Critical I";
  return o}
function render(){const max=slotsFor(+S.lvl||1);$("lvl").value=S.lvl;const extra=combos(S.sel);
  $("slots").innerHTML=Array.from({length:5},(_,i)=>{const n=S.sel[i];const r=R.find(x=>x.n===n);const locked=i>=max;
    return locked?`<div class="slot lock"><span class="lab">Slot ${i+1}</span><span>Unlocks at level ${SLOTS[i]?SLOTS[i][0]:"?"}</span></div>`:r?`<div class="slot full" style="--rc:${r.k[1]}"><div class="sh">${r.ic?`<img src="${r.ic}" alt="">`:""}<b>${esc(r.n)}</b></div><p class="bf">${esc(r.d)}</p>${extra[r.n]?`<p class="bf x">${esc(extra[r.n])}</p>`:""}<button type="button" data-rm="${esc(r.n)}">Remove</button></div>`:`<div class="slot"><span class="lab">Slot ${i+1}</span><span class="muted">Empty: add a rune below</span></div>`}).join("");
  const q=$("q").value.trim().toLowerCase();const all=Store.all();$("fFav").setAttribute("aria-pressed",String(S.fav));$("fOwn").setAttribute("aria-pressed",String(S.own));
  const rows=R.filter(r=>(!q||(r.n+" "+r.d+" "+r.w).toLowerCase().includes(q))&&(!S.fav||(all[r.n+" rune"]||{}).fav)&&(!S.own||(all[r.n+" rune"]||{}).own));
  const groups=["Luck","Movement & speed","Digging","Utility","Auto-destroy"];
  $("list").innerHTML=groups.map(g=>{const rs=rows.filter(r=>r.k[0]===g);if(!rs.length)return "";return `<p class="grp">${g}</p><div class="grid">${rs.map(r=>{const on=S.sel.includes(r.n);const loc=P.locs.find(l=>r.w.includes(l.n));
    return `<article class="r${on?" on":""}" style="--rc:${r.k[1]}"><div class="rh"><span class="nm">${r.ic?`<img class="ric" src="${r.ic}" alt="">`:""}<b>${esc(r.n)}</b></span><button type="button" class="add" data-add="${esc(r.n)}" aria-pressed="${on}">${on?"✓ In loadout":"Add"}</button></div><p>${esc(r.d)}</p><p class="w">${loc?`<span data-location="${esc(loc.n)}">${esc(r.w)}</span>`:esc(r.w)}</p>${tgHtml(r.n+" rune")}</article>`}).join("")}</div>`}).join("")||'<div class="empty">No runes match.</div>'}
function toast(t){const d=document.createElement("div");d.className="toast";d.setAttribute("role","status");d.textContent=t;document.body.appendChild(d);setTimeout(()=>d.remove(),2200)}
document.addEventListener("click",e=>{if(e.ctrlKey||e.metaKey)return;const a=e.target.closest("[data-add]"),rm=e.target.closest("[data-rm]");
  if(a){const n=a.dataset.add;if(S.sel.includes(n))S.sel=S.sel.filter(x=>x!==n);else{const max=slotsFor(+S.lvl||1);if(S.sel.length>=max){toast(`All ${max} rune slot${max>1?"s are":" is"} full at level ${S.lvl}`);return}S.sel.push(n)}save();render();const nb=document.querySelector(`[data-add="${CSS.escape(n)}"]`);nb&&nb.focus()}
  else if(rm){S.sel=S.sel.filter(x=>x!==rm.dataset.rm);save();render()}});
$("lvl").addEventListener("input",()=>{S.lvl=Math.max(1,+$("lvl").value||1);const max=slotsFor(S.lvl);if(S.sel.length>max)S.sel=S.sel.slice(0,max);save();render()});
$("q").oninput=render;$("fFav").onclick=()=>{S.fav=!S.fav;save();render()};$("fOwn").onclick=()=>{S.own=!S.own;save();render()};
$("clr").onclick=()=>{S.sel=[];save();render()};
// ---- save the loadout as an image ----
const KHEX={"Luck":"#f2b53a","Movement & speed":"#68a6f0","Digging":"#f0687f","Utility":"#b880ee","Auto-destroy":"#ef7a66"};
async function runeImage(){const W=1100,PAD=40,F='"IBM Plex Sans","Segoe UI",system-ui,sans-serif',FD='"Chakra Petch","Segoe UI",system-ui,sans-serif';try{await document.fonts.ready}catch(e){}
  const max=slotsFor(+S.lvl||1);const picks=S.sel.map(n=>R.find(x=>x.n===n)).filter(Boolean);const sm=summary(S.sel);
  const cv=document.createElement("canvas");const c=cv.getContext("2d");
  const wrap=(t,w,font)=>{c.font=font;const words=String(t).split(" ");const lines=[];let l="";words.forEach(x=>{const tt=l?l+" "+x:x;if(c.measureText(tt).width>w&&l){lines.push(l);l=x}else l=tt});if(l)lines.push(l);return lines};
  const CW=(W-PAD*2-16*4)/5;const cards=Array.from({length:5},(_,i)=>{const r=picks[i];return r?{r,d:wrap(r.d,CW-28,`13px ${F}`),w:wrap(r.w,CW-28,`12px ${F}`)}:null});
  const ch=Math.max(150,...cards.filter(Boolean).map(x=>104+x.d.length*18+10+x.w.length*16+16));const H=PAD+100+ch+40;
  const icons=await Promise.all(cards.map(x=>x&&x.r.ic?new Promise(res=>{const i=new Image();i.onload=()=>res(i);i.onerror=()=>res(null);i.src=x.r.ic}):null));
  const sc=2;cv.width=W*sc;cv.height=H*sc;c.scale(sc,sc);
  const rr=(x,y,w,h,r)=>{c.beginPath();c.moveTo(x+r,y);c.arcTo(x+w,y,x+w,y+h,r);c.arcTo(x+w,y+h,x,y+h,r);c.arcTo(x,y+h,x,y,r);c.arcTo(x,y,x+w,y,r);c.closePath()};
  c.fillStyle="#14181c";c.fillRect(0,0,W,H);
  c.fillStyle="#e6e9ec";c.font=`700 34px ${FD}`;c.fillText("Rune loadout",PAD,PAD+30);
  c.fillStyle="#98a2ad";c.font=`15px ${F}`;c.fillText(`Level ${S.lvl} · ${picks.length} of ${max} slot${max>1?"s":""} used`,PAD,PAD+58);
  c.font=`600 13px ${F}`;const mb="Made by @__coastal";const mw=c.measureText(mb).width+28,mx=W-PAD-mw,my=PAD-6;c.fillStyle="rgba(20,184,166,.14)";rr(mx,my,mw,26,13);c.fill();c.strokeStyle="rgba(20,184,166,.6)";c.lineWidth=1;rr(mx,my,mw,26,13);c.stroke();c.fillStyle="#14b8a6";c.beginPath();c.arc(mx+12,my+13,3,0,Math.PI*2);c.fill();c.fillStyle="#2dd4bf";c.fillText(mb,mx+20,my+17.5);
  const y=PAD+90;cards.forEach((x,i)=>{const cx=PAD+i*(CW+16);const locked=i>=max;
    if(!x){c.setLineDash([5,4]);c.strokeStyle="#2d343b";rr(cx,y,CW,ch,12);c.stroke();c.setLineDash([]);c.fillStyle="#5d6670";c.font=`600 11px ${F}`;c.fillText(`SLOT ${i+1}`,cx+14,y+26);c.font=`italic 14px ${F}`;c.fillText(locked?`Unlocks at level ${SLOTS[i]?SLOTS[i][0]:"?"}`:"Empty",cx+14,y+50);return}
    const col=KHEX[x.r.k[0]]||"#3cc2a8";c.fillStyle="#1c2126";rr(cx,y,CW,ch,12);c.fill();c.strokeStyle=col;c.lineWidth=1.5;rr(cx,y,CW,ch,12);c.stroke();c.lineWidth=1;c.fillStyle=col;rr(cx,y,CW,5,3);c.fill();
    c.fillStyle="#98a2ad";c.font=`600 11px ${F}`;c.fillText(`SLOT ${i+1} · ${x.r.k[0].toUpperCase()}`,cx+14,y+26);
    if(icons[i])c.drawImage(icons[i],cx+14,y+36,36,36);
    {const nx=cx+14+(icons[i]?44:0),room=cx+CW-12-nx;let fs=19;c.font=`700 ${fs}px ${FD}`;while(fs>12&&c.measureText(x.r.n).width>room){fs--;c.font=`700 ${fs}px ${FD}`}c.fillStyle=col;c.fillText(x.r.n,nx,y+61)}
    let ty=y+96;c.fillStyle="#e6e9ec";c.font=`13px ${F}`;x.d.forEach(l=>{c.fillText(l,cx+14,ty);ty+=18});
    ty+=8;c.fillStyle="#98a2ad";c.font=`12px ${F}`;x.w.forEach(l=>{c.fillText(l,cx+14,ty);ty+=16})});
  if(false){let sx=PAD,sy=y+ch+24;c.font=`600 13px ${F}`;c.fillStyle="#98a2ad";c.fillText("WHAT IT ADDS",PAD,sy);sy+=12;c.font=`13px ${F}`;
    sm.forEach(t=>{const w=c.measureText(t).width+24;if(sx+w>W-PAD){sx=PAD;sy+=32}c.fillStyle="rgba(60,194,168,.12)";rr(sx,sy,w,26,13);c.fill();c.strokeStyle="rgba(60,194,168,.5)";rr(sx,sy,w,26,13);c.stroke();c.fillStyle="#3cc2a8";c.fillText(t,sx+12,sy+17.5);sx+=w+8})}
  return await new Promise(res=>cv.toBlob(res,"image/png"))}
$("toImg").onclick=async()=>{if(!S.sel.length){toast("Pick at least one rune first");return}let blob=null;try{blob=await runeImage()}catch(e){}if(!blob){toast("Couldn't draw the image");return}
  try{await window.parent.ptSave("Rune loadout.png",blob);toast((()=>{try{return window.parent.ptImgMsg()}catch(e){return "Image saved"}})())}catch(e){const c=e&&e.code;if(c!=="declined")toast(c==="rate_limited"?"A save prompt is already open":"Couldn't save the image here")}};
window.ptRuneImage=runeImage;
$("toBuild").onclick=()=>{if(!S.sel.length){toast("Pick at least one rune first");return}try{window.parent.ptCallTool("builds","ptSetRunes",S.sel.slice())}catch(e){toast("Couldn't reach Build Sheets")}};
$("toCalc").onclick=()=>{try{window.parent.ptCallTool("calc","ptSetRunes",S.sel.slice())}catch(e){toast("Couldn't reach the Stat Calculator")}};
window.onStoreChange=()=>{if(S.fav||S.own)render()};
window.ptOpenItem=name=>{$("q").value=String(name).replace(/ rune$/,"");render()};
render();
