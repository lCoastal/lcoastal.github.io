
const ORDER=["Ascended","Exotic","Mythic","Legendary","Epic","Rare","Uncommon","Common"];
const SLOTS=["Ring","Necklace","Charm"];
const E=P.equip.map((x,i)=>({...x,i,img:P.eimg[x.img]||""}));
const BYN=Object.fromEntries(E.map(x=>[x.n.toLowerCase(),x]));
const at=(s,l)=>l==="5"?s[2]:l==="6"?s[4]:+(s[4]*1.6).toFixed(3);
const unit=s=>s[5]?"%":"";
const sv=(s,l)=>{const v=at(s,l);return (v>0&&s[0]!=="Status Timer Speed"?"+":"")+fmt(v)+unit(s)};
let st={q:"",lvl:"6",sort:"rarity",rev:false,slot:"",rar:"",fav:false,own:false,ev:true,bpTag:true,bp:""};
try{Object.assign(st,JSON.parse(localStorage.getItem("pe-f")||"{}"),{q:""})}catch(e){}
const save=()=>{try{localStorage.setItem("pe-f",JSON.stringify(st))}catch(e){}};
// limited-time items: click to cycle Show → Separate area at the bottom → Hide
if(!st.evMode)st.evMode=st.ev===false?"hide":"show";
const EVM={show:["Show limited","Limited-time items are mixed in with everything else. Click to move them to their own area at the bottom."],sep:["Limited at the bottom","Limited-time items have their own area at the bottom. Click to hide them."],hide:["Hide limited","Limited-time items are hidden. Click to show them again."]};
const $=id=>document.getElementById(id);
$("lvl").value=st.lvl;$("sort").value=st.sort;
const KCOL={"Luck":"luck","Capacity":"cap","Size Boost":"size","Dig Strength":"digstr","Dig Speed":"digspd","Sell Boost":"sell","Walk Speed":"walk","Modifier Boost":"mod","Shake Strength":"shkstr","Shake Speed":"shkspd"};
const slotsEl=$("slots"),rarsEl=$("rars");
// type and stat filters: pick as many as you like
if(!Array.isArray(st.slots))st.slots=st.slot?[st.slot]:[];if(!Array.isArray(st.stats))st.stats=[];if(!st.match)st.match="all";
["",...SLOTS].forEach(s=>slotsEl.insertAdjacentHTML("beforeend",`<button type="button" class="chip" data-slot="${s}">${s?s+"s":"All"}</button>`));
const STAT_ORDER=["Luck","Capacity","Size Boost","Modifier Boost","Sell Boost","Dig Strength","Dig Speed","Shake Strength","Shake Speed","Walk Speed"];
// only stats that 3 or more pieces have; rarer ones are easier to find with the search box
const STATCOUNT={};E.forEach(x=>new Set(x.st.map(s=>s[0])).forEach(n=>STATCOUNT[n]=(STATCOUNT[n]||0)+1));
const ALLSTATS=Object.keys(STATCOUNT).filter(n=>STATCOUNT[n]>=3).sort((a,b)=>{const i=STAT_ORDER.indexOf(a),j=STAT_ORDER.indexOf(b);return (i<0?99:i)-(j<0?99:j)||a.localeCompare(b)});
st.stats=st.stats.filter(n=>ALLSTATS.includes(n));
const statsEl=$("stats");
statsEl.insertAdjacentHTML("beforeend",`<button type="button" class="chip sm" data-stat="">Any</button>`+ALLSTATS.map(n=>`<button type="button" class="chip sm" data-stat="${esc(n)}" style="--kc:${KCOL[n]?`var(--k-${KCOL[n]})`:"var(--fg)"}">${KCOL[n]?`<span style="color:var(--k-${KCOL[n]})">${esc(n)}</span>`:esc(n)}</button>`).join(""));
function drawFilters(){slotsEl.querySelectorAll("[data-slot]").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.slot?st.slots.includes(b.dataset.slot):!st.slots.length)));
  statsEl.querySelectorAll("[data-stat]").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.stat?st.stats.includes(b.dataset.stat):!st.stats.length)));
  $("matchRow").querySelectorAll("[data-match]").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.match===st.match)));
  const open=!!st.moreF;$("slots").hidden=!open;$("stats").hidden=!open;$("matchRow").hidden=!open;
  const act=st.slots.length+st.stats.length;const mb=$("moreF");mb.setAttribute("aria-expanded",String(open));mb.setAttribute("aria-pressed",String(open||act>0));
  mb.textContent="Type & stat filters";mb.title=act&&!open?"Some type or stat filters are on. Click to see them.":""}
const toggleIn=(arr,v)=>arr.includes(v)?arr.filter(x=>x!==v):[...arr,v];
$("matchRow").onclick=e=>{const m=e.target.closest("[data-match]");if(m){st.match=m.dataset.match;save();drawFilters();render()}};
$("moreF").onclick=()=>{st.moreF=!st.moreF;save();drawFilters()};
statsEl.onclick=e=>{
  const b=e.target.closest("[data-stat]");if(!b)return;st.stats=b.dataset.stat?toggleIn(st.stats,b.dataset.stat):[];save();drawFilters();render()};
// items you hid with the eye button
if(!Array.isArray(st.hidden))st.hidden=[];
// rarities: pick as many as you like
if(!Array.isArray(st.rars))st.rars=st.rar?[st.rar]:[];
["",...ORDER].forEach(r=>rarsEl.insertAdjacentHTML("beforeend",`<button type="button" class="chip r" style="--rc:${r?rc(r):"var(--accent)"}" data-rar="${r}">${r||"All"}</button>`));
const drawRars=()=>rarsEl.querySelectorAll("[data-rar]").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.rar?st.rars.includes(b.dataset.rar):!st.rars.length)));drawRars();
const press=(sel,attr,val)=>document.querySelectorAll(sel).forEach(b=>b.setAttribute("aria-pressed",String(b.dataset[attr]===val)));
slotsEl.onclick=e=>{const b=e.target.closest("[data-slot]");if(!b)return;st.slots=b.dataset.slot?toggleIn(st.slots,b.dataset.slot):[];if(st.slots.length===SLOTS.length)st.slots=[];save();drawFilters();render()};
drawFilters();
rarsEl.onclick=e=>{const b=e.target.closest("[data-rar]");if(!b)return;const v=b.dataset.rar;st.rars=v?(st.rars.includes(v)?st.rars.filter(x=>x!==v):[...st.rars,v]):[];if(st.rars.length===ORDER.length)st.rars=[];save();drawRars();render()};
[["fFav","fav"],["fOwn","own"],["fBpTag","bpTag"]].forEach(([id,k])=>{$(id).setAttribute("aria-pressed",String(st[k]));$(id).onclick=()=>{st[k]=!st[k];$(id).setAttribute("aria-pressed",String(st[k]));save();render()}});
$("fEv").onclick=()=>{st.evMode={show:"sep",sep:"hide",hide:"show"}[st.evMode]||"show";save();render()};
$("unhide").onclick=()=>{const n=st.hidden.length;st.hidden=[];save();render();toast(`Unhid ${n} item${n===1?"":"s"}`)};
$("fBp").value=st.bp;$("fBp").onchange=()=>{st.bp=$("fBp").value;save();render()};
const BPI='<svg viewBox="0 0 16 16" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="1.6" d="M2.5 2.5h8l3 3v8h-11z M5 6.5h6 M5 9h6 M5 11.5h4"/></svg>';
// rings you can only wear one of at a time (always shown, not hidden with the Blueprint tag toggle)
const ONE_ONLY=new Set(["Dredge Master's Ring","Ring of Champions","Ring of the Stars"]);
const oneTag=x=>ONE_ONLY.has(x.n)?`<span class="one1" title="You can only wear one ${esc(x.n)} at a time, even with free ring slots">Only 1 can be worn</span>`:"";
// the quest(s) that give an item's blueprint, from the blueprint source text ("Quest “Name” from …")
const QUESTS=(P.x2&&P.x2.quests)||[];
function bpQuests(x){const m=String(x.bp||"").match(/[“"]([^”"]+)[”"]/);if(!m)return [];const nz=t=>t.toLowerCase().replace(/[‘’]/g,"'").trim();const n=nz(m[1]);
  return QUESTS.filter(q=>{const qn=nz(q.n);return qn===n||qn.startsWith(n+" [")})}
function bpSection(x){if(!x.bp)return "";const qs=bpQuests(x);
  return `<div class="psec" id="bpq"><h3><span>Blueprint</span>${qs.length?`<button type="button" class="btn" data-qopen="${esc(qs[0].n.replace(/\s*\[\d+\]$/,""))}" style="font-size:12px;padding:4px 10px">Open in Quest Tracker</button>`:""}</h3>
    <p style="margin:0;font-size:13.5px">${esc(x.bp)}.</p>${!qs.length&&/^Quest/.test(x.bp)?`<p class="muted" style="margin:0;font-size:12.5px">The quest's steps aren't in the Quest Tracker yet.</p>`:""}
    ${qs.map(q=>`<div class="bpq"><div class="bpqh"><b>${esc(q.n)}</b><span>${esc(q.npc||"")}${q.loc?` · <span class="lk" data-location="${esc(q.loc)}">${esc(q.loc)}</span>`:""}</span></div>
      ${q.steps&&q.steps.length?`<ol>${q.steps.map(t=>`<li>${esc(t)}</li>`).join("")}</ol>`:""}
      ${q.rw?`<div class="bprw"><span class="lab">Rewards</span> ${esc(q.rw)}</div>`:""}</div>`).join("")}</div>`}
const bpTag=x=>x.bp?`<span class="bp" title="${esc(x.bp)}">${BPI}Blueprint</span>`:"";
$("q").oninput=()=>{st.q=$("q").value.trim().toLowerCase();render()};
$("lvl").onchange=()=>{st.lvl=$("lvl").value;save();render()};
$("sort").onchange=()=>{st.sort=$("sort").value;st.rev=false;save();render()};
$("dir").onclick=()=>{st.rev=!st.rev;save();render()};
const priceHtml=x=>x.price==null?"—":x.cur==="$"?"$"+fmt(x.price):`${fmt(x.price)}<small>${esc(x.cur)}</small>`;
const matHtml=([q,n,kg],big)=>{const m=MIN[n.toLowerCase()];return `<span data-mineral="${esc(n)}" title="${esc(n)}${kg?" (+"+esc(kg)+")":""} · Ctrl+click to open">${m&&m.ic?`<img src="${m.ic}" alt="" width="18" height="18" loading="lazy">`:""}<span class="q">${q}×</span>${esc(n)}${kg?` <span class="muted">+${esc(kg)}</span>`:""}</span>`};
const sName=n=>KCOL[n]?`<span class="sk" style="color:var(--k-${KCOL[n]})">${esc(n)}</span>`:esc(n);
const stHtml=(x,hl)=>x.st.map(s=>`<span class="${at(s,st.lvl)<0?"neg":""}${hl&&s[0].toLowerCase().includes(hl)?" hl":""}">${sName(s[0])} <em>${sv(s,st.lvl)}</em></span>`).join("");

// rarity sort shows the rarest first, so it counts as descending
const RNAT=-1;
function render(){
  const t=st.q;const all=Store.all();
  {const b=$("fEv");b.innerHTML=`<span class="evw">${Object.entries(EVM).map(([k,v])=>`<span${k===st.evMode?"":` aria-hidden="true" style="visibility:hidden"`}>${v[0]}</span>`).join("")}</span>`;b.title=EVM[st.evMode][1];b.setAttribute("aria-pressed",String(st.evMode!=="hide"))}
  let rows=E.filter(x=>(!st.slots.length||st.slots.includes(x.slot))&&(!st.stats.length||(st.match==="any"?st.stats.some(n=>x.st.some(s=>s[0]===n)):st.stats.every(n=>x.st.some(s=>s[0]===n))))&&(!st.rars.length||st.rars.includes(x.r))&&!st.hidden.includes(x.n)&&(st.evMode!=="hide"||!x.ev)&&(!st.fav||(all[x.n]||{}).fav)&&(!st.own||(all[x.n]||{}).own)&&(!st.bp||(st.bp==="yes")===!!x.bp)
    &&(!t||(x.n+" "+x.slot+" "+x.st.map(s=>s[0]).join(" ")+" "+x.rec.map(r=>r[1]).join(" ")).toLowerCase().includes(t)));
  const sorter={rarity:(a,b)=>a.i-b.i,type:(a,b)=>ORDER.indexOf(a.r)-ORDER.indexOf(b.r)||a.i-b.i,price:(a,b)=>(a.cur!=="$")-(b.cur!=="$")||(a.price??0)-(b.price??0),name:(a,b)=>a.n.localeCompare(b.n)}[st.sort];
  rows.sort(sorter);if(st.rev)rows.reverse();
  {const d=(st.rev?-1:1)*(st.sort==="rarity"?RNAT:1);$("dir").innerHTML=d>0?"<b>↑</b> Ascending":"<b>↓</b> Descending";$("dir").title="Click to sort "+(d>0?"descending":"ascending")}
  const hl=E.some(x=>x.st.some(s=>s[0].toLowerCase()===t))?t:"";
  // groups: [heading, rows, colour, which tag the rows can skip]
  let lim=[];if(st.evMode==="sep"){lim=rows.filter(x=>x.ev);rows=rows.filter(x=>!x.ev)}
  const groups=st.sort==="rarity"?(st.rev?[...ORDER].reverse():ORDER).map(r=>[r,rows.filter(x=>x.r===r),rc(r),"r"]).filter(g=>g[1].length)
    :st.sort==="type"?(st.rev?[...SLOTS].reverse():SLOTS).map(t=>[t+"s",rows.filter(x=>x.slot===t),"var(--line)","slot"]).filter(g=>g[1].length)
    :[["",rows,"var(--line)",""]];
  if(lim.length)groups.push(["Limited-time",lim,"var(--ev)",""]);
  $("list").innerHTML=groups.some(g=>g[1].length)?groups.map(([r,rs,gc,skip])=>`<section class="grp${skip==="r"?"":" neutral"}" style="--rc:${gc}">${r?`<div class="gh"><b>${r}</b><span>${rs.length} ${rs.length===1?"item":"items"}</span></div>`:""}
    <table class="eq"><thead><tr><th aria-label="Icon"></th><th>Name</th><th>Stats (${st.lvl==="p"?"Prismatic":st.lvl+"★ max"})</th><th>Recipe</th><th style="text-align:right">Price</th><th aria-label="Favourite and owned"></th></tr></thead><tbody>
    ${rs.map(x=>`<tr tabindex="0" data-open="${x.i}"${skip==="r"?` style="--rc:${rc(x.r)};--nc:${rc(x.r)}"`:` class="plain" style="--rc:var(--line);--nc:${rc(x.r)}"`}><td class="ic"><div class="icon">${x.img?`<img src="${x.img}" alt="" width="36" height="36" loading="lazy">`:""}</div></td>
      <td><div class="nm"><b>${esc(x.n)}</b><span>${skip==="slot"?"":x.slot}${skip==="r"?"":(skip==="slot"?"":" · ")+"<span style=\"color:"+rc(x.r)+"\">"+x.r+"</span>"}${x.ev?" · limited-time":""}</span>${ONE_ONLY.has(x.n)?`<span class="tags">${oneTag(x)}${bpTag(x)}</span>`:bpTag(x)}</div></td>
      <td class="sts-c"><div class="sts">${stHtml(x,hl)}</div></td>
      <td class="rec-c"><div class="rec">${x.rec.map(m=>matHtml(m)).join("")}</div></td>
      <td class="pr">${priceHtml(x)}</td><td class="t"><span class="tg">${tgHtml(x.n)}<button type="button" class="hidebtn" data-hide="${esc(x.n)}" title="Hide ${esc(x.n)}" aria-label="Hide ${esc(x.n)}"><svg viewBox="0 0 16 16" width="15" height="15" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="1.5" d="M1.5 8s2.4-4.5 6.5-4.5S14.5 8 14.5 8s-2.4 4.5-6.5 4.5S1.5 8 1.5 8z"/><circle cx="8" cy="8" r="2" fill="none" stroke="currentColor" stroke-width="1.5"/><path stroke="currentColor" stroke-width="1.5" d="M2.5 13.5l11-11"/></svg></button></span></td></tr>`).join("")}</tbody></table></section>`).join(""):'<div class="empty">Nothing matches these filters.</div>';
  {const u=$("unhide");u.hidden=!st.hidden.length;u.textContent="Unhide all";u.title=st.hidden.length?"Hidden: "+st.hidden.join(", "):""}
  $("count").textContent=`Showing ${rows.length+lim.length} of ${E.length} items`;
  document.body.classList.toggle("nobp",!st.bpTag);
}
window.onStoreChange=()=>{if(st.fav||st.own)render()};
$("list").addEventListener("click",e=>{const bpt=e.target.closest(".bp");if(bpt&&!e.ctrlKey&&!e.metaKey){const tr=bpt.closest("[data-open]");if(tr){e.stopPropagation();showEquip(+tr.dataset.open);setTimeout(()=>{const s=document.getElementById("bpq");if(s)s.scrollIntoView({block:"start",behavior:"smooth"})},60);return}}const h=e.target.closest("[data-hide]");if(h){e.stopPropagation();if(!st.hidden.includes(h.dataset.hide))st.hidden.push(h.dataset.hide);save();render();toast(`Hid ${h.dataset.hide}. Use “Unhide all” to bring it back.`);return}if(e.ctrlKey||e.metaKey)return;const r=e.target.closest("[data-open]");if(r)showEquip(+r.dataset.open)});
$("list").addEventListener("keydown",e=>{if((e.key==="Enter"||e.key===" ")&&e.target.matches("tr[data-open]")){e.preventDefault();showEquip(+e.target.dataset.open)}});

// pop-up
const scrim=$("scrim"),page=$("page");let lastFocus=null,cur=null;
function cmpTable(x,y){
  const names=[...new Set([...x.st.map(s=>s[0]),...(y?y.st.map(s=>s[0]):[])])];
  const g=(it,n)=>{const s=it&&it.st.find(z=>z[0]===n);return s?{v:at(s,cmpLvl),u:unit(s)}:null};
  return `<table class="st"><tr><th>Stat</th><th>${esc(x.n)}</th>${y?`<th>${esc(y.n)}</th><th>Difference</th>`:""}</tr>${names.map(n=>{const a=g(x,n),b=y?g(y,n):null;const d=(a?a.v:0)-(b?b.v:0);
    return `<tr><td>${esc(n)}</td><td>${a?fmt(a.v)+a.u:"—"}</td>${y?`<td>${b?fmt(b.v)+b.u:"—"}</td><td class="${d>0?"up":d<0?"dn":""}">${d>0?"+":d<0?"−":"±"}${fmt(Math.abs(d))}${(a||b).u}</td>`:""}</tr>`}).join("")}</table>`}
let cmpLvl="6";
function showEquip(i){
  const x=E[i];if(!x)return;cur=x;try{window.ptRecent&&ptRecent("Equipment",x.n)}catch(e){}
  page.style.setProperty("--gc",rc(x.r));
  const others=E.filter(y=>y.slot===x.slot&&y!==x);
  page.innerHTML=`<div class="ph"><div class="icon">${x.img?`<img src="${window.ptBig?ptBig(x.img):x.img}" alt="" width="120" height="120">`:""}</div>
      <div><span class="rr" style="--rc:${rc(x.r)}">${x.r} ${x.slot}${x.ev?" · limited-time":""}</span><h2 id="pname">${esc(x.n)}</h2>${oneTag(x)}</div>
      <div class="pv">${x.price==null?"—":x.cur==="$"?"$"+fmt(x.price):fmt(x.price)+" "+esc(x.cur)}<small>craft cost</small></div>
      <button type="button" class="btn" id="pclose">Close</button></div>
    ${x.d?`<p class="desc">${esc(x.d)}</p>`:""}
    ${["Dredge Master's Ring","Ring of Champions","Ring of the Stars"].includes(x.n)?`<p style="margin:0;color:var(--warn);font-weight:600;font-size:13.5px">Only one can be worn at a time.</p>`:""}
    ${x.bp?`<div class="bpbox"><b>Needs a blueprint</b>${x.bp==="Needs a blueprint"?"The wiki doesn't say where this blueprint comes from":esc(x.bp)}.</div>`:""}
    <div class="acts">${tgHtml(x.n)}<button type="button" class="btn pri" id="addCk">Add to crafting checklist</button><button type="button" class="btn" id="addCk6">Add as 6★ (2 crafts)</button></div>
    <div class="psec"><h3>Stats by star level</h3><div class="tw"><table class="st"><tr><th>Stat</th><th>5★ range</th><th>6★ range</th><th>Prismatic max</th></tr>
      ${x.st.map(s=>`<tr><td>${sName(s[0])}</td><td>${fmt(s[1])} – ${fmt(s[2])}${unit(s)}</td><td>${fmt(s[3])} – ${fmt(s[4])}${unit(s)}</td><td>${fmt(s[4]*1.6)}${unit(s)}</td></tr>`).join("")}</table></div>
      <p class="muted" style="margin:0;font-size:12.5px">Prismatic gear gives 1.6× the 6★ values.</p></div>
    <div class="psec"><h3>Recipe</h3><ul class="ing">${x.rec.map(([q,n,kg])=>{const m=MIN[n.toLowerCase()];return `<li style="--rc:${m?rc(m.r):"var(--line)"}" data-mineral="${esc(n)}" title="Ctrl+click to open ${esc(n)}">${m&&m.ic?`<img src="${m.ic}" alt="" width="26" height="26">`:""}<span class="q">${q}×</span><span>${esc(n)}${kg?` <span class="muted">(+${esc(kg)})</span>`:""}<br><span class="rr" style="--rc:${m?rc(m.r):"var(--muted)"}">${m?m.r:""}</span></span></li>`}).join("")}</ul></div>
    ${catSection(x)}
    <div class="psec"><h3><span>Compare</span><span style="display:flex;gap:6px;flex-wrap:wrap"><select id="cmpWith" aria-label="Compare with"><option value="">Compare with another ${x.slot.toLowerCase()}…</option>${others.map(y=>`<option value="${y.i}">${esc(y.n)} (${y.r})</option>`).join("")}</select>
      <select id="cmpLvl" aria-label="Compare at"><option value="5">5★ max</option><option value="6">6★ max</option><option value="p">Prismatic</option></select></span></h3><div class="tw" id="cmpOut">${cmpTable(x,null)}</div></div>${bpSection(x)}`;
  $("cmpLvl").value=cmpLvl;
  const upd=()=>{cmpLvl=$("cmpLvl").value;const y=E[+$("cmpWith").value];$("cmpOut").innerHTML=cmpTable(x,$("cmpWith").value?y:null)};
  $("cmpWith").onchange=upd;$("cmpLvl").onchange=upd;
  const add=n=>{let ok=false;try{ok=window.parent.ptChecklistAdd(x.n,n)}catch(e){}toast(ok?`Added ${x.n}${n>1?" (6★)":""} to your crafting checklist`:"Couldn't reach the crafting checklist")};
  $("addCk").onclick=()=>add(1);$("addCk6").onclick=()=>add(2);
  lastFocus=document.activeElement;scrim.hidden=false;$("pclose").onclick=closeEquip;$("pclose").focus();
}
// the mineral the Mutation Forge (Frozen Peak) uses to reroll this item's mutation
const CATS=Object.fromEntries(Object.entries((P.ench&&P.ench.cat)||{}).map(([k,v])=>[k.toLowerCase(),v]));
function catSection(x){const c=CATS[x.n.toLowerCase()]||x.cat;if(!c)return "";const m=MIN[c.toLowerCase()];
  return `<div class="psec"><h3><span>Mutation catalyst</span><button type="button" class="btn" id="toMut" style="padding:4px 10px;font-size:12px;text-transform:none;letter-spacing:0">See mutation odds</button></h3>
    <ul class="ing"><li style="--rc:${m?rc(m.r):"var(--line)"}" data-mineral="${esc(c)}" title="Ctrl+click to open ${esc(c)}">${m&&m.ic?`<img src="${m.ic}" alt="" width="26" height="26">`:""}<span>${esc(c)}<br><span class="rr" style="--rc:${m?rc(m.r):"var(--muted)"}">${m?m.r:""}</span></span></li></ul>
    <p class="muted" style="margin:0;font-size:12.5px">Put ${esc(c)} into the Mutation Forge at Frozen Peak to roll a new mutation on this ${esc(x.slot.toLowerCase())}. More catalysts make the better mutations more likely.</p></div>`}
document.addEventListener("click",e=>{if(e.target.closest("#toMut")){try{closeEquip();window.parent.ptCallTool("mutations","ptOpenTab","mut")}catch(err){}}});
function toast(t){const d=document.createElement("div");d.className="toast";d.textContent=t;d.setAttribute("role","status");document.body.appendChild(d);setTimeout(()=>d.remove(),2200)}
function closeEquip(){scrim.hidden=true;lastFocus&&lastFocus.focus&&lastFocus.focus()}
scrim.addEventListener("click",e=>{if(e.target===scrim)closeEquip()});
scrim.addEventListener("click",e=>{const q=e.target.closest("[data-qopen]");if(!q)return;closeEquip();try{window.parent.ptCallTool("quests","ptOpenItem",q.dataset.qopen)}catch(err){}});
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!scrim.hidden)closeEquip()});
window.ptOpenItem=name=>{const x=BYN[String(name).toLowerCase()];if(x)showEquip(x.i)};
render();
