
const $=id=>document.getElementById(id);
const DEF=[["S","#ff7f7f"],["A","#ffbf7f"],["B","#ffdf7f"],["C","#bfff7f"],["D","#7fbfff"]];
const PAL=["#ff7f7f","#ffbf7f","#ffdf7f","#bfff7f","#7fffd4","#7fbfff","#9f9fff","#ff9fe8","#d0a0ff","#c0c6cc"];
const ORDR=["Ascended","Exotic","Mythic","Legendary","Epic","Rare","Uncommon","Common"];
const POOLS={m:P.mins.filter(m=>m.ic).map(m=>({n:m.n,r:m.r,ic:m.ic})),e:P.equip.filter(x=>P.eimg&&P.eimg[x.img]).map(x=>({n:x.n,r:x.r,ic:P.eimg[x.img],slot:x.slot})),r:((P.x2||{}).runes||[]).filter(x=>x.ic).map(x=>({n:x.n,r:"",ic:x.ic}))};
const KIND={m:"minerals",e:"equipment",r:"runes"};
const rcol=r=>r?rc(r):"var(--accent)";
let S={k:"m",m:{t:"",rows:{}},e:{t:"",rows:{}},r:{t:"",rows:{}},rf:[],tf:""};try{Object.assign(S,JSON.parse(localStorage.getItem("pt-tier")||"{}"))}catch(e){}
const save=()=>{try{localStorage.setItem("pt-tier",JSON.stringify(S))}catch(e){}};
const L=()=>S[S.k]||(S[S.k]={t:"",rows:{}});
// each list keeps its own rows: [{id,label,c}]; older lists without them get S to D
const T=(l=L())=>l.tiers&&l.tiers.length?l.tiers:(l.tiers=DEF.map(([t,c])=>({id:t,label:t,c})));
const byN=()=>Object.fromEntries(POOLS[S.k].map(x=>[x.n,x]));
const nid=()=>"r"+Date.now().toString(36)+Math.floor(Math.random()*1e4);
let SELS=[],MULTI=false,EDIT=null,lpFired=false,lpT=null;
const toggleSel=n=>{const i=SELS.indexOf(n);if(i>=0){SELS.splice(i,1);if(!SELS.length)MULTI=false}else SELS.push(n)};
const itemHTML=x=>`<button type="button" class="it${SELS.includes(x.n)?" sel":""}" draggable="true" data-n="${esc(x.n)}" style="--rc:${rcol(x.r)}" title="${esc(x.n)}${x.r?` (${esc(x.r)})`:""}" aria-label="${esc(x.n)}${x.r?", "+esc(x.r):""}${SELS.includes(x.n)?", selected":""}"><img src="${x.ic}" alt=""><span><i>${esc(x.n)}</i></span></button>`;
function render(){const l=L(),N=byN(),tiers=T(l);
  document.querySelectorAll("[data-k]").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.k===S.k)));
  $("ttl").value=l.t||"";
  // drop names that no longer exist, and anything ranked twice
  const seen=new Set();tiers.forEach(t=>{l.rows[t.id]=(l.rows[t.id]||[]).filter(n=>N[n]&&!seen.has(n)&&seen.add(n))});
  $("tiers").innerHTML=tiers.map(t=>{const len=String(t.label).length;return `<div class="tier${SELS.length?" target":""}${EDIT===t.id?" editing":""}" style="--tc:${t.c}"><button type="button" class="tl${len>8?" vlong":len>3?" long":""}" data-edit="${esc(t.id)}" title="Edit this row" aria-label="Row ${esc(t.label)}, edit">${esc(t.label)||"&nbsp;"}</button><div class="tz" data-row="${esc(t.id)}">${l.rows[t.id].map(n=>itemHTML(N[n])).join("")}</div></div>`}).join("");
  drawEditor();
  const rars=ORDR.filter(r=>POOLS[S.k].some(x=>x.r===r));const rf=S.rf.filter(r=>rars.includes(r));
  $("rf").hidden=!rars.length;
  $("rf").innerHTML=`<span class="lab">Rarity</span><button type="button" class="chip" data-rall aria-pressed="${!rf.length}">All</button>`+rars.map(r=>`<button type="button" class="chip r" data-rr="${r}" style="--rc:${rc(r)}" aria-pressed="${rf.includes(r)}">${r}</button>`).join("");
  // equipment type: all, rings, charms or necklaces
  const types=[["","All"],["Ring","Rings"],["Charm","Charms"],["Necklace","Necklaces"]].filter(([v])=>!v||POOLS.e.some(x=>x.slot===v));
  $("tf").hidden=S.k!=="e";if(S.k==="e")$("tf").innerHTML=`<span class="lab">Type</span>`+types.map(([v,n])=>`<button type="button" class="chip" data-tt="${v}" aria-pressed="${(S.tf||"")===v}">${n}</button>`).join("");
  const tf=S.k==="e"?S.tf||"":"";
  const q=$("q").value.trim().toLowerCase();
  const left=POOLS[S.k].filter(x=>!seen.has(x.n)).sort((a,b)=>ORDR.indexOf(a.r)-ORDR.indexOf(b.r)||a.n.localeCompare(b.n));
  const shown=left.filter(x=>(!tf||x.slot===tf)&&(!rf.length||rf.includes(x.r))&&(!q||x.n.toLowerCase().includes(q)));
  $("pool").innerHTML=shown.map(itemHTML).join("")||`<span class="hint2">${left.length?"Nothing matches.":"Everything is ranked."}</span>`;
  $("pcnt").textContent=`${left.length} left`;
  $("selHint").textContent=MULTI?`${SELS.length} selected. Tap a row to move them together, tap an item to add or remove, or tap the pool to unrank them.`:(SELS.length===1?`Picked up ${SELS[0]}. Tap a row to drop it, or tap the pool to unrank it.`:"Tip: tap an item to pick it up, then tap a row to drop it. Hold Ctrl and click, or press and hold on a phone, to pick several at once.")}
// the row editor: rename, recolour, move or delete one row
function drawEditor(){const box=$("rowEd");const tiers=T();const i=tiers.findIndex(t=>t.id===EDIT);if(i<0){EDIT=null;box.hidden=true;return}const t=tiers[i];box.hidden=false;
  box.innerHTML=`<div class="reh"><span class="lab">Row name</span><input type="text" id="reName" maxlength="20" value="${esc(t.label)}" aria-label="Row name"><button type="button" class="btn" id="reDone">Done</button></div>
  <div class="swc" role="group" aria-label="Row colour">${PAL.map(c=>`<button type="button" style="--c:${c}" data-col="${c}" aria-label="Colour ${c}" aria-pressed="${t.c===c}"></button>`).join("")}</div>
  <div class="reb"><button type="button" class="btn" id="reUp"${i===0?" disabled":""}>Move up</button><button type="button" class="btn" id="reDn"${i===tiers.length-1?" disabled":""}>Move down</button><button type="button" class="btn warn" id="reDel"${tiers.length<2?" disabled":""}>Delete row</button></div>`}
function moveTo(n,row,before){const l=L();T(l).forEach(t=>{l.rows[t.id]=(l.rows[t.id]||[]).filter(x=>x!==n)});
  if(row){const a=l.rows[row]||(l.rows[row]=[]);const i=before?a.indexOf(before):-1;if(i>=0)a.splice(i,0,n);else a.push(n)}save();render()}
// move a whole group of items into a row at once (keeps their picked order)
function moveMany(names,row,before){const l=L();T(l).forEach(t=>{l.rows[t.id]=(l.rows[t.id]||[]).filter(x=>!names.includes(x))});
  if(row){const a=l.rows[row]||(l.rows[row]=[]);let i=(before&&!names.includes(before))?a.indexOf(before):-1;if(i<0)i=a.length;a.splice(i,0,...names)}save();render()}
const dropGroup=row=>{const names=SELS.slice();SELS=[];MULTI=false;moveMany(names,row,null)};
// tap to pick up and drop
document.addEventListener("click",e=>{
  if(lpFired){lpFired=false;return}// swallow the click that follows a long-press
  const k=e.target.closest("[data-k]");if(k){S.k=k.dataset.k;SELS=[];MULTI=false;EDIT=null;save();render();return}
  const itM=e.target.closest(".it");
  // ctrl/cmd + click starts (or extends) a multi-selection
  if((e.ctrlKey||e.metaKey)&&itM){MULTI=true;toggleSel(itM.dataset.n);render();return}
  // while multi-selecting: tap items to add/remove, tap a row or the pool to move them all
  if(MULTI&&SELS.length){
    if(itM){toggleSel(itM.dataset.n);render();return}
    const tier=e.target.closest(".tier");if(tier){const z=tier.querySelector("[data-row]");dropGroup(z?z.dataset.row:"");return}
    if(e.target.closest("#pool")){dropGroup("");return}
  }
  const ed=e.target.closest("[data-edit]");if(ed&&!SELS.length){EDIT=EDIT===ed.dataset.edit?null:ed.dataset.edit;render();if(EDIT){const i=$("reName");if(i){i.focus();i.select()}}return}
  const col=e.target.closest("[data-col]");if(col){const t=T().find(x=>x.id===EDIT);if(t){t.c=col.dataset.col;save();render()}return}
  const tt=e.target.closest("[data-tt]");if(tt){S.tf=tt.dataset.tt;save();render();return}
  if(e.target.closest("[data-rall]")){S.rf=[];save();render();return}const rr=e.target.closest("[data-rr]");if(rr){const r=rr.dataset.rr;S.rf=S.rf.includes(r)?S.rf.filter(x=>x!==r):S.rf.concat(r);save();render();return}
  // plain single pick-up and drop
  const it=itM,cur=SELS.length===1?SELS[0]:null;const zone=e.target.closest("[data-row]")||(cur&&ed?{dataset:{row:ed.dataset.edit}}:null);
  if(it&&(!cur||cur===it.dataset.n)){SELS=cur===it.dataset.n?[]:[it.dataset.n];render();return}
  if(cur&&zone){SELS=[];moveTo(cur,zone.dataset.row,it?it.dataset.n:null);return}
  if(it){SELS=[it.dataset.n];render()}});
document.addEventListener("keydown",e=>{if(e.key==="Escape"){if(SELS.length){SELS=[];MULTI=false;render()}else if(EDIT){EDIT=null;render()}}if(e.key==="Enter"&&e.target.id==="reName"){EDIT=null;render()}});
// press and hold an item on a touch screen to start multi-selecting
document.addEventListener("touchstart",e=>{const it=e.target.closest&&e.target.closest(".it");lpFired=false;clearTimeout(lpT);if(!it)return;const n=it.dataset.n;lpT=setTimeout(()=>{lpFired=true;MULTI=true;toggleSel(n);render();try{navigator.vibrate&&navigator.vibrate(15)}catch(x){}},420)},{passive:true});
document.addEventListener("touchmove",()=>clearTimeout(lpT),{passive:true});
document.addEventListener("touchend",()=>clearTimeout(lpT),{passive:true});
document.addEventListener("input",e=>{if(e.target.id!=="reName")return;const t=T().find(x=>x.id===EDIT);if(!t)return;t.label=e.target.value;save();
  const b=document.querySelector(`[data-edit="${CSS.escape(EDIT)}"]`);if(b){b.textContent=t.label||" ";const n=t.label.length;b.classList.toggle("long",n>3&&n<=8);b.classList.toggle("vlong",n>8)}});
$("rowEd").addEventListener("click",e=>{const tiers=T(),i=tiers.findIndex(t=>t.id===EDIT);if(i<0)return;const id=e.target.id;
  if(id==="reDone"){EDIT=null;render()}
  else if(id==="reUp"&&i>0){[tiers[i-1],tiers[i]]=[tiers[i],tiers[i-1]];save();render()}
  else if(id==="reDn"&&i<tiers.length-1){[tiers[i+1],tiers[i]]=[tiers[i],tiers[i+1]];save();render()}
  else if(id==="reDel"&&tiers.length>1){const l=L(),n=(l.rows[EDIT]||[]).length;delete l.rows[EDIT];tiers.splice(i,1);EDIT=null;save();render();ptToast(n?`Row deleted, ${n} item${n===1?"":"s"} back in the pool`:"Row deleted")}});
$("addRow").onclick=()=>{const tiers=T();if(tiers.length>=12){ptToast("That's the most rows a list can have");return}const t={id:nid(),label:"New",c:PAL[tiers.length%PAL.length]};tiers.push(t);EDIT=t.id;save();render();const i=$("reName");if(i){i.focus();i.select()}};
$("rstRows").onclick=()=>{const l=L();const keep={};DEF.forEach(([t])=>keep[t]=l.rows[t]||[]);l.tiers=null;l.rows=keep;EDIT=null;T(l);save();render();ptToast("Rows back to S, A, B, C and D")};
// drag and drop on a computer
let DR=null;
document.addEventListener("dragstart",e=>{const it=e.target.closest&&e.target.closest(".it");if(!it)return;DR=it.dataset.n;it.classList.add("drag");try{e.dataTransfer.setData("text/plain",DR);e.dataTransfer.effectAllowed="move"}catch(x){}});
document.addEventListener("dragend",()=>{DR=null;document.querySelectorAll(".drag,.over").forEach(x=>x.classList.remove("drag","over"))});
document.addEventListener("dragover",e=>{const z=e.target.closest&&e.target.closest("[data-row]");if(!z||!DR)return;e.preventDefault();document.querySelectorAll(".over").forEach(x=>x!==z&&x.classList.remove("over"));z.classList.add("over")});
document.addEventListener("drop",e=>{const z=e.target.closest&&e.target.closest("[data-row]");if(!z||!DR)return;e.preventDefault();const b=e.target.closest(".it");const n=DR;DR=null;const grp=(MULTI&&SELS.includes(n)&&SELS.length>1)?SELS.slice():null;SELS=[];MULTI=false;if(grp)moveMany(grp,z.dataset.row,b&&!grp.includes(b.dataset.n)?b.dataset.n:null);else moveTo(n,z.dataset.row,b&&b.dataset.n!==n?b.dataset.n:null)});
$("q").addEventListener("input",render);
$("ttl").addEventListener("input",()=>{L().t=$("ttl").value;save()});
const anyRanked=()=>{const l=L();return T(l).some(t=>(l.rows[t.id]||[]).length)};
$("clr").onclick=()=>{if(!anyRanked())return;L().rows={};SEL=null;save();render();ptToast("Cleared, everything is back in the pool")};
// copy as text for Discord: title, then "Row: item, item" per line
$("cpy").onclick=async()=>{if(!anyRanked()){ptToast("Rank something first");return}const l=L();
  const txt=[l.t?`**${l.t.trim()}**`:"",...T(l).map(t=>`${t.label||"?"}: ${(l.rows[t.id]||[]).join(", ")}`.trimEnd())].filter(Boolean).join("\n");let ok=false;
  try{await navigator.clipboard.writeText(txt);ok=true}catch(e){try{const ta=document.createElement("textarea");ta.value=txt;ta.style.position="fixed";ta.style.opacity="0";document.body.appendChild(ta);ta.select();ok=document.execCommand("copy");ta.remove()}catch(e2){}}
  ptToast(ok?"Tier list copied as text":"Couldn't copy, your browser blocked it")};
// import from text: works out the kind, keeps colours for rows with known names
$("imp").onclick=()=>{const b=$("impBox");b.hidden=!b.hidden;if(!b.hidden)$("impTx").focus()};
$("impNo").onclick=()=>{$("impBox").hidden=true};
$("impGo").onclick=()=>{const raw=$("impTx").value;const lines=raw.split(/\r?\n/).map(x=>x.trim()).filter(Boolean);if(!lines.length){ptToast("Paste a tier list first");return}
  let title="";const rows=[];lines.forEach((ln,i)=>{const m=ln.match(/^(.{1,30}?)\s*[:：]\s*(.*)$/);const clean=t=>t.replace(/^[#>*_\s]+|[*_\s]+$/g,"").trim();
    if(!m){if(!rows.length&&!title)title=clean(ln);return}rows.push({label:clean(m[1]).slice(0,20),items:m[2].split(/\s*[,|•;]\s*/).map(clean).filter(Boolean)})});
  if(!rows.length){ptToast("No rows found. Write them as Row name: item, item");return}
  const all=rows.flatMap(r=>r.items).map(x=>x.toLowerCase());
  const score=k=>{const s=new Set(POOLS[k].map(x=>x.n.toLowerCase()));return all.filter(x=>s.has(x)).length};
  const kinds=["m","e","r"].sort((a,b)=>score(b)-score(a)||(b===S.k)-(a===S.k));const k=kinds[0];if(!score(k)){ptToast("None of those names match a mineral, equipment or rune");return}
  const map=Object.fromEntries(POOLS[k].map(x=>[x.n.toLowerCase(),x.n]));const old=(S[k]&&S[k].tiers)||[];const miss=[];const used=new Set();
  const tiers=rows.map((r,i)=>{const o=old.find(t=>String(t.label).toLowerCase()===r.label.toLowerCase())||DEF.map(([t,c])=>({label:t,c})).find(t=>t.label.toLowerCase()===r.label.toLowerCase());return {id:nid()+i,label:r.label,c:o?o.c:PAL[i%PAL.length]}});
  const rowsOut={};rows.forEach((r,i)=>{rowsOut[tiers[i].id]=r.items.map(x=>{const n=map[x.toLowerCase()];if(!n){miss.push(x);return null}if(used.has(n))return null;used.add(n);return n}).filter(Boolean)});
  S[k]={t:title||(S[k]&&S[k].t)||"",tiers,rows:rowsOut};S.k=k;SEL=null;EDIT=null;save();$("impBox").hidden=true;$("impTx").value="";render();
  ptToast(`Loaded ${used.size} ${KIND[k]} into ${tiers.length} rows`+(miss.length?`. Not found: ${miss.slice(0,4).join(", ")}${miss.length>4?` and ${miss.length-4} more`:""}`:""))};
// picture of the list: one band per row with the item pictures and names
function loadImg(src){return new Promise(r=>{const i=new Image();i.onload=()=>r(i);i.onerror=()=>r(null);i.src=src})}
async function tierImage(){const l=L(),N=byN();const LW=150,SZ=96,TH=SZ+30,G=8,PAD=10;const F='"IBM Plex Sans",system-ui,sans-serif';
  const rows=T(l).map(t=>({t:t.label,c:t.c,items:(l.rows[t.id]||[]).map(n=>N[n]).filter(Boolean)}));
  // columns follow the busiest row (capped at 16) so there's no empty strip on the right
  const per=Math.min(16,Math.max(1,...rows.map(r=>r.items.length)));const bodyW=per*(SZ+G)-G;
  const mg=document.createElement("canvas").getContext("2d");mg.font=`800 44px ${F}`;const titleW=l.t?mg.measureText(l.t).width:0;
  const W=Math.max(LW+PAD*2+bodyW,Math.ceil(titleW)+48,420);
  const hs=rows.map(r=>Math.max(1,Math.ceil(r.items.length/per))*(TH+G)-G+PAD*2);
  const top=l.t?96:24,H=top+hs.reduce((a,b)=>a+b,0)+24;const cv=document.createElement("canvas");cv.width=W;cv.height=H;const g=cv.getContext("2d");
  g.fillStyle="#12161b";g.fillRect(0,0,W,H);if(l.t){g.fillStyle="#f2f5f7";g.font=`800 44px ${F}`;g.fillText(l.t,24,66)}
  const pics=await Promise.all(rows.flatMap(r=>r.items).map(x=>loadImg(x.ic).then(i=>[x.n,i])));const PI=Object.fromEntries(pics);
  // row labels: big for one or two letters, smaller and wrapped onto lines for words
  const label=(txt,cx,cy,h)=>{let z=txt.length<=2?48:txt.length<=4?36:26;g.fillStyle="#1a1d21";g.textAlign="center";const words=String(txt).split(/\s+/);let lines;
    for(;z>=13;z-=2){g.font=`800 ${z}px ${F}`;lines=[];let cur="";words.forEach(w=>{const t=cur?cur+" "+w:w;if(g.measureText(t).width>LW-16&&cur){lines.push(cur);cur=w}else cur=t});if(cur)lines.push(cur);if(lines.every(x=>g.measureText(x).width<=LW-16)&&lines.length*z*1.15<=h-10)break}
    const lh=z*1.15,y0=cy-(lines.length-1)*lh/2+z*.36;lines.forEach((x,i)=>g.fillText(x,cx,y0+i*lh));g.textAlign="left"};
  let y=top;rows.forEach((r,i)=>{const h=hs[i];g.fillStyle=r.c;g.fillRect(0,y,LW,h);label(r.t,LW/2,y+h/2,h);
    g.fillStyle=i%2?"#1a2027":"#171c22";g.fillRect(LW,y,W-LW,h);
    // items left-aligned; the canvas width already follows the widest row so there's no empty strip
    r.items.forEach((x,j)=>{const cx=LW+PAD+(j%per)*(SZ+G),cy=y+PAD+Math.floor(j/per)*(TH+G);g.fillStyle="#222a33";g.fillRect(cx,cy,SZ,TH);g.strokeStyle=RHX[x.r]||"#3cc2a8";g.lineWidth=3;g.strokeRect(cx+1.5,cy+1.5,SZ-3,TH-3);const im=PI[x.n];if(im)g.drawImage(im,cx+12,cy+8,SZ-24,SZ-24);
      let nm=x.n,z=14;g.font=`600 ${z}px ${F}`;while(g.measureText(nm).width>SZ-10&&z>10){z--;g.font=`600 ${z}px ${F}`}while(g.measureText(nm).width>SZ-10&&nm.length>3)nm=nm.slice(0,-2)+"…";g.fillStyle="#e6e9ec";g.textAlign="center";g.fillText(nm,cx+SZ/2,cy+TH-12);g.textAlign="left"});
    g.fillStyle="rgba(0,0,0,.35)";g.fillRect(0,y+h-1,W,1);y+=h});
  return new Promise(res=>cv.toBlob(res,"image/png"))}
const RHX={Ascended:"#ffd36b",Exotic:"#f17ad6",Mythic:"#f0687f",Legendary:"#f2b53a",Epic:"#b880ee",Rare:"#68a6f0",Uncommon:"#6cc46e",Common:"#a3adb8"};
$("toImg").onclick=()=>{if(!anyRanked()){ptToast("Rank something first");return}ptSaveImg((L().t||"Tier list").trim(),tierImage)};
render();
