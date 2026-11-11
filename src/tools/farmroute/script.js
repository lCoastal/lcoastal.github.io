
const $=id=>document.getElementById(id);
let S={txt:"",got:{}};try{Object.assign(S,JSON.parse(localStorage.getItem("pfr-s")||"{}"))}catch(e){}
const save=()=>{try{localStorage.setItem("pfr-s",JSON.stringify(S))}catch(e){}};
const looseMin=n=>{const k=n.trim().toLowerCase();if(MIN[k])return MIN[k];const s=k.replace(/[^a-z0-9]/g,"");return s?P.mins.find(m=>m.n.toLowerCase().replace(/[^a-z0-9]/g,"")===s)||null:null};
function parse(txt){const out=[],bad=[];
  txt.split(/\n+/).forEach(line=>{line=line.trim();if(!line||/^total\b/i.test(line))return;let body=line;const m=line.match(/^([A-Za-z]+)\s*:\s*(.*)$/);if(m&&RT.RARS.some(r=>r.toLowerCase()===m[1].toLowerCase()))body=m[2];
    body.split(/,(?![^(]*\))/).forEach(it=>{it=it.trim();if(!it||/^empty$/i.test(it)||it==="—"||/^any\b/i.test(it))return;const mm=it.match(/^(.*?)\s*(?:\(([^)]+)\))?\s*$/);const mi=looseMin(mm[1]);
      let u=(mm[2]||"None").trim();if(/^any\b/i.test(u))u="None";u=RT.MODS.find(x=>x.toLowerCase()===u.toLowerCase())||u;
      if(!mi){bad.push(mm[1]);return}if(!out.some(o=>o.m===mi))out.push({m:mi,u})})});
  return {items:out,bad}}
function toast(t){const d=document.createElement("div");d.className="toast";d.setAttribute("role","status");d.textContent=t;d.style.cssText="position:fixed;left:50%;bottom:20px;transform:translateX(-50%);background:var(--fg);color:var(--bg);padding:8px 14px;border-radius:8px;font-size:13.5px;z-index:40";document.body.appendChild(d);setTimeout(()=>d.remove(),2200)}
let LAST=null;
// lock: freeze the stops, their order and what goes where, so ticking items doesn't reshuffle the route
function drawLock(){const on=!!(S.mode==="custom"?curList().lock:S.lock);const b=$("lockBtn");b.setAttribute("aria-pressed",String(on));b.innerHTML=on?"🔒 Route locked":"🔓 Lock route";
  b.title=on?"Click to unlock. The route will re-plan around what you still need.":"Keep the stops, their order and what you collect where exactly as they are now, even as you tick items off.";
  b.style.cssText=on?"background:var(--accent);border-color:var(--accent);color:var(--bg)":"";
  $("lockNote").hidden=!on;$("lockNote").textContent="Locked: stops stay in place as you tick items off. Odds still update if you change your stats. Unlock to re-plan."}
function render(){
  const cm=S.mode==="custom";drawMode();
  let items,got,lock;
  if(cm){const L=curList();items=customItems(L);got=L.got;lock=L.lock;drawCustom()}
  else{if(document.activeElement!==$("paste"))$("paste").value=S.txt;
    const p=parse(S.txt);items=p.items;got=S.got;lock=S.lock;
    $("parseInfo").innerHTML=!S.txt.trim()?"":`Found ${items.length} mineral${items.length===1?"":"s"}.`+(p.bad.length?` <span style="color:var(--neg)">Couldn't match: ${p.bad.map(esc).join(", ")}.</span>`:"")}
  if(!items.length){$("specials").hidden=true;$("sum").innerHTML="";$("stops").innerHTML=cm?'<div class="empty">Tick some minerals above to build your custom route.</div>':'<div class="empty">Paste your museum above, or press Use my Museum Planner board.</div>';$("issues").hidden=true;LAST=null;drawLock();return}
  const R=RT.plan(items.map(it=>({...it,c:got[it.key||it.m.n]?0:1})),{lock});LAST=R;
  drawLock();
  const done=R.T.filter(t=>!t.c).length;
  $("sum").innerHTML=RT.sumHTML(R,`<div><span class="lab">Collected</span><b>${done} / ${R.T.length}</b><span class="hint">items on the route</span></div>`);
  $("stops").innerHTML=RT.stopsHTML(R,{tick:true,kg:true});
  if(!R.zones.length)$("stops").innerHTML='<div class="empty">Nothing on your list can be farmed with these settings yet. See below for where each item drops.</div>';
  $("specials").hidden=!(R.special&&R.special.length);$("specialList").innerHTML=RT.specialHTML(R);
  $("issues").hidden=!R.issues.length;$("issueList").innerHTML=R.issues.map(x=>`<li>${x}</li>`).join("");
}
// ---- custom route: choose modifiers at the top, tick them per mineral ----
// S.cl: saved custom routes [{id,name,mods:[...],picks:{Mineral:[modifier,...]},got:{},lock}], S.cc: the open one
const CMODS=["None",...RT.MODS.filter(u=>u!=="None")];const modName=u=>u==="None"?"Any":u;
const cid=()=>"c"+Date.now().toString(36)+Math.random().toString(36).slice(2,5);
const CN_A=["Shiny","Lucky","Molten","Frozen","Glowing","Ancient","Golden","Radiant","Hidden","Swift","Prismatic","Stormy","Crystal","Royal","Sunlit","Moonlit"],CN_B=["Run","Haul","Route","Trip","Hunt","Loop","Grind","Sweep","Circuit","Trek"];
const cname=()=>CN_A[Math.random()*CN_A.length|0]+" "+CN_B[Math.random()*CN_B.length|0];
const newList=()=>({id:cid(),name:cname(),mods:["None"],picks:{},got:{}});
function curList(){if(!Array.isArray(S.cl)||!S.cl.length){S.cl=[newList()];S.cc=S.cl[0].id}let L=S.cl.find(x=>x.id===S.cc);if(!L){L=S.cl[0];S.cc=L.id}return L}
const RORD=RT.RARS;
function customItems(L){const out=[];Object.entries(L.picks||{}).forEach(([n,us])=>{const m=MIN[n.toLowerCase()];if(!m)return;(us||[]).forEach(u=>{if(L.mods.includes(u))out.push({m,u,key:n+"|"+u})})});
  return out.sort((a,b)=>RORD.indexOf(a.m.r)-RORD.indexOf(b.m.r)||a.m.n.localeCompare(b.m.n)||CMODS.indexOf(a.u)-CMODS.indexOf(b.u))}
let cRar="",cArm=0;
function drawMode(){const cm=S.mode==="custom";document.querySelectorAll("[data-mode]").forEach(b=>b.setAttribute("aria-pressed",String((b.dataset.mode==="custom")===cm)));$("modeMuseum").hidden=cm;$("modeCustom").hidden=!cm}
function shownMins(L){const q=$("cQ").value.trim().toLowerCase();const only=$("cOnly").checked;
  const nameQ=!!q&&P.mins.some(m=>m.n.toLowerCase().includes(q));
  return P.mins.filter(m=>(!cRar||m.r===cRar)&&(!q||m.n.toLowerCase().includes(q)||(!nameQ&&(m.ch||[]).some(c=>String(c[0]).toLowerCase().includes(q))))&&(!only||((L.picks[m.n]||[]).some(u=>L.mods.includes(u)))))
    .sort((a,b)=>RORD.indexOf(a.r)-RORD.indexOf(b.r)||a.n.localeCompare(b.n))}
function drawCustom(){const L=curList();
  $("cList").innerHTML=S.cl.map(x=>`<option value="${esc(x.id)}"${x.id===L.id?" selected":""}>${esc(x.name||"Untitled route")}</option>`).join("");
  if(document.activeElement!==$("cName"))$("cName").value=L.name||"";
  $("cDel").textContent=cArm?"Click again to delete":"Delete";
  $("cMods").innerHTML=CMODS.map(u=>`<button type="button" class="chip" data-cmod="${esc(u)}" aria-pressed="${L.mods.includes(u)}">${esc(modName(u))}</button>`).join("");
  $("cRar").innerHTML=["",...RORD].map(r=>`<button type="button" class="chip" data-crar="${r}" aria-pressed="${cRar===r}"${r?` style="color:${cRar===r?"var(--bg)":rc(r)}"`:""}>${r||"All"}</button>`).join("");
  const mods=CMODS.filter(u=>L.mods.includes(u));const list=shownMins(L);
  if(!mods.length){$("cGrid").innerHTML='<div class="none">Pick at least one modifier above.</div>';$("cInfo").textContent="";return}
  const on=(n,u)=>(L.picks[n]||[]).includes(u);
  let body="",last="";list.forEach(m=>{if(m.r!==last){last=m.r;body+=`<tr class="rg" style="--rc:${rc(m.r)}"><td colspan="${mods.length+1}">${m.r}</td></tr>`}
    const any=mods.some(u=>on(m.n,u));
    body+=`<tr${any?' class="on"':""}><td><span class="mn">${m.ic?`<img src="${m.ic}" alt="">`:""}<b data-mineral="${esc(m.n)}">${esc(m.n)}</b></span></td>${mods.map(u=>`<td><input type="checkbox" data-pick="${esc(m.n)}" data-u="${esc(u)}" aria-label="${esc(m.n)}: ${esc(modName(u))}"${on(m.n,u)?" checked":""}></td>`).join("")}</tr>`});
  const head=`<tr><th>Mineral</th>${mods.map(u=>{const all=list.length&&list.every(m=>on(m.n,u));return `<th><label title="Tick ${esc(modName(u))} for every mineral shown"><span>${esc(modName(u))}</span><input type="checkbox" data-colall="${esc(u)}"${all?" checked":""} aria-label="${esc(modName(u))} for every mineral shown"></label></th>`}).join("")}</tr>`;
  $("cGrid").innerHTML=list.length?`<table class="fr-grid"><thead>${head}</thead><tbody>${body}</tbody></table>`:'<div class="none">No minerals match.</div>';
  const n=customItems(L).length;$("cInfo").textContent=n?`${n} item${n===1?"":"s"} on this route.`:""}
document.addEventListener("click",e=>{const t=e.target;
  const md=t.closest("[data-mode]");if(md){S.mode=md.dataset.mode;cArm=0;save();render();return}
  const cm=t.closest("[data-cmod]");if(cm){const L=curList(),u=cm.dataset.cmod;L.mods=L.mods.includes(u)?L.mods.filter(x=>x!==u):[...L.mods,u];delete L.lock;save();render();return}
  const cr=t.closest("[data-crar]");if(cr){cRar=cr.dataset.crar;drawCustom();return}});
$("modeCustom").addEventListener("change",e=>{const t=e.target,L=curList();
  if(t.dataset.pick){const n=t.dataset.pick,u=t.dataset.u;const a=new Set(L.picks[n]||[]);if(t.checked)a.add(u);else{a.delete(u);delete L.got[n+"|"+u]}if(a.size)L.picks[n]=[...a];else delete L.picks[n];save();render();return}
  if(t.dataset.colall){const u=t.dataset.colall;shownMins(L).forEach(m=>{const a=new Set(L.picks[m.n]||[]);if(t.checked)a.add(u);else{a.delete(u);delete L.got[m.n+"|"+u]}if(a.size)L.picks[m.n]=[...a];else delete L.picks[m.n]});save();render();return}
  if(t.id==="cList"){S.cc=t.value;cArm=0;save();render();return}
  if(t.id==="cOnly"){drawCustom();return}});
$("cQ").addEventListener("input",()=>drawCustom());
$("cName").addEventListener("input",()=>{curList().name=$("cName").value;save();const o=$("cList").selectedOptions[0];if(o)o.textContent=$("cName").value||"Untitled route"});
$("cNew").onclick=()=>{const L=newList();curList();S.cl.push(L);S.cc=L.id;cArm=0;save();render();$("cName").focus();$("cName").select()};
$("cDel").onclick=()=>{if(!cArm){cArm=1;drawCustom();setTimeout(()=>{if(cArm){cArm=0;if(S.mode==="custom")drawCustom()}},4000);return}
  cArm=0;const L=curList();S.cl=S.cl.filter(x=>x.id!==L.id);if(!S.cl.length)S.cl=[newList()];S.cc=S.cl[0].id;save();render();toast(`Deleted “${L.name||"Untitled route"}”`)};
$("rtSet").insertAdjacentHTML("beforeend",RT.settingsHTML(true));RT.bind($("rtSet"),render);
let tm=null;$("paste").addEventListener("input",()=>{S.txt=$("paste").value;clearTimeout(tm);tm=setTimeout(()=>{save();render()},250)});
document.addEventListener("change",e=>{const c=e.target.closest("[data-got]");if(!c)return;const g=S.mode==="custom"?curList().got:S.got;if(c.checked)g[c.dataset.got]=1;else delete g[c.dataset.got];save();render()});
$("example").onclick=()=>{S.txt="Exotic: Vineheart (Iridescent)\nMythic: Inferlume (Iridescent), Chrysoberyl (Iridescent)\nLegendary: Diamond (Iridescent), Catseye (Iridescent), Firefly Stone (Iridescent)\nEpic: Emerald (Iridescent), Osmium (Iridescent), Ammonite Fossil (Iridescent)\nRare: Peridot (Iridescent), Jade (Iridescent), Diopside (Iridescent)\nUncommon: Coral (Iridescent), Malachite (Iridescent), Nickel (Iridescent)\nCommon: Copper (Iridescent), Obsidian (Iridescent), Pyrite (Iridescent)";S.got={};delete S.lock;save();render()};
$("fromPlanner").onclick=()=>{let bd=null;try{bd=JSON.parse(localStorage.getItem("mp-board")||"null")}catch(e){}
  if(!bd){$("parseInfo").textContent="Your Museum Planner board is empty. Fill it in on the Museum Planner first.";return}
  S.txt=RT.RARS.map(r=>r+": "+((bd[r]||[]).map(x=>x&&x.m?x.m+(x.u&&x.u!=="None"?" ("+x.u+")":""):"empty").join(", "))).join("\n");S.got={};delete S.lock;save();render()};
$("lockBtn").onclick=()=>{const o=S.mode==="custom"?curList():S;if(o.lock)delete o.lock;else if(LAST)o.lock=RT.lockOf(LAST);save();render()};
// ---- save the route as an image (same dark style as the museum images) ----
async function routeImage(R){const W=1200,PAD=40,F='"IBM Plex Sans","Segoe UI",system-ui,sans-serif',FD='"Chakra Petch","Segoe UI",system-ui,sans-serif',FM='"IBM Plex Mono",Consolas,monospace';
  try{await document.fonts.ready}catch(e){}
  const zs=R.zones;const where=t=>zs.filter(o=>t.cands[o.z]);
  const rows=zs.map((Z,idx)=>{const req=Z.ts.map(t=>({t,req:true}));const ex=Z.open?zs.slice(idx+1).flatMap(o=>o.ts.filter(t=>t.c>0&&t.cands[Z.z])).map(t=>({t,req:false})):[];return {Z,items:[...req,...ex]}});
  const ROW=40,H=PAD+100+rows.reduce((h,r)=>h+70+r.items.length*ROW+(r.Z.open?34:0)+14,0)+30;
  const cv=document.createElement("canvas");const sc=2;cv.width=W*sc;cv.height=H*sc;const c=cv.getContext("2d");c.scale(sc,sc);
  const rr=(x,y,w,h,r)=>{c.beginPath();c.moveTo(x+r,y);c.arcTo(x+w,y,x+w,y+h,r);c.arcTo(x+w,y+h,x,y+h,r);c.arcTo(x,y+h,x,y,r);c.arcTo(x,y,x+w,y,r);c.closePath()};
  const fit=(t,w)=>{if(c.measureText(t).width<=w)return t;while(t.length>1&&c.measureText(t+"…").width>w)t=t.slice(0,-1);return t+"…"};
  const img=src=>new Promise(res=>{if(!src)return res(null);const i=new Image();i.onload=()=>res(i);i.onerror=()=>res(null);i.src=src});
  c.fillStyle="#14181c";c.fillRect(0,0,W,H);
  c.fillStyle="#e6e9ec";c.font=`700 34px ${FD}`;c.fillText("My route",PAD,PAD+30);
  const open=zs.filter(z=>z.open),tot=open.reduce((s,z)=>s+z.pans,0);
  c.fillStyle="#98a2ad";c.font=`15px ${F}`;c.fillText(`${open.length} stop${open.length===1?"":"s"} left · ${R.T.filter(t=>t.c>0).length} items to collect${RT.st.stats&&tot?` · about ${RT.big(tot)} pans${RT.dur(tot)?" ("+RT.dur(tot)+")":""}`:""}`,PAD,PAD+58);
  c.font=`600 13px ${F}`;const mb="Made by @__coastal";const mw=c.measureText(mb).width+28,mx=W-PAD-mw,my=PAD-6;c.fillStyle="rgba(20,184,166,.14)";rr(mx,my,mw,26,13);c.fill();c.strokeStyle="rgba(20,184,166,.6)";c.lineWidth=1;rr(mx,my,mw,26,13);c.stroke();c.fillStyle="#14b8a6";c.beginPath();c.arc(mx+12,my+13,3,0,Math.PI*2);c.fill();c.fillStyle="#2dd4bf";c.fillText(mb,mx+20,my+17.5);
  let y=PAD+90,k=0;
  for(const {Z,items} of rows){const h=70+items.length*ROW+(Z.open?34:0);const done=!Z.open;if(!done||R.frozen)k++;
    c.globalAlpha=done?.55:1;c.fillStyle="#1c2126";rr(PAD,y,W-PAD*2,h,12);c.fill();c.strokeStyle="#2d343b";rr(PAD,y,W-PAD*2,h,12);c.stroke();
    c.fillStyle=done?"#5d6670":"#3cc2a8";rr(PAD,y,5,h,3);c.fill();
    c.beginPath();c.arc(PAD+36,y+34,15,0,Math.PI*2);c.fillStyle=done?"#5d6670":"#3cc2a8";c.fill();c.fillStyle="#14181c";c.font=`700 15px ${F}`;const nt=done?"✓":String(k);c.fillText(nt,PAD+36-c.measureText(nt).width/2,y+39);
    c.fillStyle="#e6e9ec";c.font=`700 21px ${FD}`;c.fillText(fit(Z.z,W-PAD*2-300),PAD+62,y+41);
    c.font=`13px ${F}`;c.fillStyle="#98a2ad";const est=done?"Done":RT.st.stats?`Expected pans  ${RT.big(Z.pans)}${RT.dur(Z.pans)?"  ·  "+RT.dur(Z.pans):""}`:`${items.filter(i=>i.req&&i.t.c>0).length} items here`;c.fillText(est,W-PAD-20-c.measureText(est).width,y+39);
    let iy=y+62;
    for(const {t,req} of items){const p=t.cands[Z.z];const w=where(t);let tag="",tc="";
      if(w.length<=1){tag="ONLY ON THIS STOP";tc="#f2b53a"}else{const b=w.reduce((a,o)=>!a||t.cands[o.z]>t.cands[a.z]?o:a,null);if(b.z===Z.z){tag="RECOMMENDED";tc="#3cc2a8"}else{tag="EXTRA";tc="#98a2ad"}}
      c.fillStyle=req?"#171b1f":"#191d21";rr(PAD+22,iy,W-PAD*2-44,ROW-6,8);c.fill();if(!req){c.setLineDash([4,3]);c.strokeStyle="#2d343b";rr(PAD+22,iy,W-PAD*2-44,ROW-6,8);c.stroke();c.setLineDash([])}
      const im=await img(t.m.ic);if(im)c.drawImage(im,PAD+30,iy+4,26,26);
      c.globalAlpha=done||!t.c?.55:1;c.fillStyle="#e6e9ec";c.font=`600 15px ${F}`;let nm=t.m.n+(t.u&&t.u!=="None"?" · "+t.u:"");if(!t.c)nm="✓ "+nm;c.fillText(fit(nm,430),PAD+66,iy+22);
      let tx=PAD+66+Math.min(430,c.measureText(nm).width)+12;c.font=`700 10.5px ${F}`;const tw=c.measureText(tag).width+14;c.strokeStyle=tc;c.fillStyle=tc;rr(tx,iy+9,tw,18,9);if(tag==="RECOMMENDED"){c.fill();c.fillStyle="#14181c"}else c.stroke();c.fillText(tag,tx+7,iy+22);
      if(!req){c.fillStyle="#98a2ad";c.font=`12px ${F}`;c.fillText("optional here",tx+tw+10,iy+22)}
      c.fillStyle="#b9c2cb";c.font=`13px ${FM}`;const od=RT.oneIn(p);c.fillText(od,W-PAD-36-c.measureText(od).width,iy+22);c.globalAlpha=done?.55:1;
      iy+=ROW}
    if(Z.open){const left=Z.ts.filter(t=>t.c>0);const next=zs.slice(zs.indexOf(Z)+1).find(o=>o.open);c.fillStyle="#3cc2a8";c.font=`600 13px ${F}`;c.fillText("Move on",PAD+24,iy+16);c.fillStyle="#cfd6dd";c.font=`13px ${F}`;c.fillText(fit(`once you have ${left.map(t=>(t.c>1?t.c+"× ":"")+t.m.n).join(", ")}${next?", then go to "+next.z:". That's the last stop"}.`,W-PAD*2-110),PAD+86,iy+16)}
    c.globalAlpha=1;y+=h+14}
  return await new Promise(res=>cv.toBlob(res,"image/png"))}
$("imgRoute").onclick=async()=>{if(!LAST||!LAST.zones.length){toast("Paste your museum first");return}let blob=null;try{blob=await routeImage(LAST)}catch(e){}if(!blob){toast("Couldn't draw the image");return}
  try{await window.parent.ptSave("My route.png",blob);toast((()=>{try{return window.parent.ptImgMsg()}catch(e){return "Image saved"}})())}catch(e){const c=e&&e.code;if(c!=="declined")toast(c==="rate_limited"?"A save prompt is already open":"Couldn't save the image here")}};
window.ptRouteImage=()=>LAST?routeImage(LAST):null;
$("copyRoute").onclick=async()=>{if(!LAST)return;const txt="Museum farm route\n"+RT.routeText(LAST);let ok=false;
  try{await navigator.clipboard.writeText(txt);ok=true}catch(e){try{const ta=document.createElement("textarea");ta.value=txt;ta.style.position="fixed";ta.style.opacity="0";document.body.appendChild(ta);ta.select();ok=document.execCommand("copy");ta.remove()}catch(e2){}}
  const b=$("copyRoute");const o=b.textContent;b.textContent=ok?"Copied!":"Couldn't copy";setTimeout(()=>b.textContent=o,1500)};
window.ptLoadRoute=txt=>{S.txt=txt;S.got={};delete S.lock;save();render()};
render();
