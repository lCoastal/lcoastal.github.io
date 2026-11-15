
const ORDER=["Ascended","Exotic","Mythic","Legendary","Epic","Rare","Uncommon","Common"];
const SLOTS=["Ring","Necklace","Charm"];
const E=P.equip.map((x,i)=>({...x,i,img:P.eimg[x.img]||""}));
const BYN=Object.fromEntries(E.map(x=>[x.n.toLowerCase(),x]));
// values at 100% quality. p = 6★ Prismatic (×1.6), s = 6★ Sunforged (×1.5, plus +300 Luck and +30% Sell Boost on top)
const at=(s,l)=>l==="5"?s[2]:l==="6"?s[4]:+(s[4]*(l==="s"?1.5:1.6)).toFixed(3);
const SUNADD=[["Luck",300,0],["Sell Boost",30,1]];
const LVLN={"5":"5★ max","6":"6★ max","p":"6★ Prismatic","s":"6★ Sunforged"};
const LVLS={"5":"5★","6":"6★","p":"Prismatic","s":"Sunforged"};const LKEYS=Object.keys(LVLN);
// an item's stat rows at a level, as [name, value, isPct]; Sunforged adds Luck and Sell Boost even if the item has none
function statsAt(x,l){const out=x.st.map(s=>[s[0],at(s,l),s[5]?1:0]);if(l==="s")SUNADD.forEach(([n,a,p])=>{const o=out.find(r=>r[0]===n);if(o)o[1]=+(o[1]+a).toFixed(3);else out.push([n,a,p])});return out}
const unit=s=>s[5]?"%":"";
const sv=(s,l)=>{const v=at(s,l);return (v>0&&s[0]!=="Status Timer Speed"?"+":"")+fmt(v)+unit(s)};
const svr=r=>(r[1]>0&&r[0]!=="Status Timer Speed"?"+":"")+fmt(r[1])+(r[2]?"%":"");
let st={q:"",lvl:"6",sort:"rarity",rev:false,slot:"",rar:"",fav:false,own:false,ev:true,bpTag:true,bp:""};
try{Object.assign(st,JSON.parse(localStorage.getItem("pe-f")||"{}"),{q:""})}catch(e){}
const save=()=>{try{localStorage.setItem("pe-f",JSON.stringify(st))}catch(e){}};
// limited-time items: click to cycle Show → Separate area at the bottom → Hide
if(!st.evMode)st.evMode=st.ev===false?"hide":"show";
const EVM={show:["Show limited","Limited-time items are mixed in with everything else. Click to move them to their own area at the bottom."],sep:["Limited at the bottom","Limited-time items have their own area at the bottom. Click to hide them."],hide:["Hide limited","Limited-time items are hidden. Click to show them again."]};
const $=id=>document.getElementById(id);
// value levels shown in the list: pick as many as you like (always kept in 5★ → Sunforged order)
if(!Array.isArray(st.lvls))st.lvls=[st.lvl||"6"];st.lvls=LKEYS.filter(k=>st.lvls.includes(k));if(!st.lvls.length)st.lvls=["6"];st.lvl=st.lvls[0];
$("lvls").insertAdjacentHTML("beforeend",`<button type="button" class="chip sm" data-lv="">All</button>`+LKEYS.map(k=>`<button type="button" class="chip sm" data-lv="${k}">${LVLN[k]}</button>`).join(""));
const drawLvls=()=>$("lvls").querySelectorAll("[data-lv]").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.lv?st.lvls.includes(b.dataset.lv):st.lvls.length===LKEYS.length)));drawLvls();
$("lvls").onclick=e=>{const b=e.target.closest("[data-lv]");if(!b)return;const k=b.dataset.lv;
  if(!k)st.lvls=st.lvls.length===LKEYS.length?["6"]:[...LKEYS];
  else{const nx=st.lvls.includes(k)?st.lvls.filter(x=>x!==k):[...st.lvls,k];if(!nx.length)return;st.lvls=LKEYS.filter(x=>nx.includes(x))}
  st.lvl=st.lvls[0];save();drawLvls();render()};
$("sort").value=st.sort;
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
const ONE_ONLY=new Set(["Dredge Master's Ring","Ring of Champions","Ring of the Stars","Scarab Signet","Embalmer's Ring","Ring of Ra"]);
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
$("sort").onchange=()=>{st.sort=$("sort").value;st.rev=false;save();render()};
$("dir").onclick=()=>{st.rev=!st.rev;save();render()};
const priceHtml=x=>x.price==null?"—":x.cur==="$"?"$"+fmt(x.price):`${fmt(x.price)}<small>${esc(x.cur)}</small>`;
const matHtml=([q,n,kg],big)=>{const m=MIN[n.toLowerCase()];return `<span data-mineral="${esc(n)}" title="${esc(n)}${kg?" (+"+esc(kg)+")":""} · Ctrl+click to open">${m&&m.ic?`<img src="${m.ic}" alt="" width="18" height="18" loading="lazy">`:""}<span class="q">${q}×</span>${esc(n)}${kg?` <span class="muted">+${esc(kg)}</span>`:""}</span>`};
const sName=n=>KCOL[n]?`<span class="sk" style="color:var(--k-${KCOL[n]})">${esc(n)}</span>`:esc(n);
const stHtml=(x,hl)=>st.lvls.length===1?statsAt(x,st.lvl).map(r=>`<span class="${r[1]<0?"neg":""}${hl&&r[0].toLowerCase().includes(hl)?" hl":""}">${sName(r[0])} <em>${svr(r)}</em></span>`).join(""):multiHtml(x,hl);
// one row per stat, one column per picked level; Sunforged can add Luck and Sell Boost rows the item doesn't normally have
function multiRows(x){const per=st.lvls.map(l=>statsAt(x,l));const names=[];per.forEach(rs=>rs.forEach(r=>{if(!names.includes(r[0]))names.push(r[0])}));
  return names.map(n=>({n,v:per.map(rs=>rs.find(r=>r[0]===n)||null)}))}
const multiHtml=(x,hl)=>`<table class="mst"><tr><th></th>${st.lvls.map(l=>`<th>${LVLS[l]}</th>`).join("")}</tr>${multiRows(x).map(({n,v})=>`<tr${hl&&n.toLowerCase().includes(hl)?' class="hl"':""}><td>${sName(n)}</td>${v.map(r=>r?`<td class="${r[1]<0?"neg":""}">${svr(r)}</td>`:`<td class="na">—</td>`).join("")}</tr>`).join("")}</table>`;

// rarity sort shows the rarest first, so it counts as descending
const RNAT=-1;
let LAST=[];
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
  LAST=groups;
  $("list").innerHTML=groups.some(g=>g[1].length)?groups.map(([r,rs,gc,skip])=>`<section class="grp${skip==="r"?"":" neutral"}" style="--rc:${gc}">${r?`<div class="gh"><b>${r}</b><span>${rs.length} ${rs.length===1?"item":"items"}</span></div>`:""}
    <table class="eq"><colgroup><col class="c-ic"><col class="c-nm"${st.lvls.length>1?` style="width:${st.lvls.length>2?17:20}%"`:""}><col class="c-st"${st.lvls.length>1?` style="width:${12+10*st.lvls.length}%"`:""}><col class="c-rc"><col class="c-pr"><col class="c-t"></colgroup><thead><tr><th aria-label="Icon"></th><th>Name</th><th>${st.lvls.length===1?`Stats (${LVLN[st.lvl]})`:"Stats"}</th><th>Recipe</th><th style="text-align:center">Price</th><th aria-label="Favourite and owned"></th></tr></thead><tbody>
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
  const A=statsAt(x,cmpLvl),B=y?statsAt(y,cmpLvl2):[];
  const names=[...new Set([...A.map(r=>r[0]),...B.map(r=>r[0])])];
  const g=(rows,n)=>{const r=rows.find(z=>z[0]===n);return r?{v:r[1],u:r[2]?"%":""}:null};
  const hx=`${esc(x.n)}<br><small class="muted">${LVLN[cmpLvl]}</small>`,hy=y?`${esc(y.n)}<br><small class="muted">${LVLN[cmpLvl2]}</small>`:"";
  return `<table class="st"><tr><th>Stat</th><th>${hx}</th>${y?`<th>${hy}</th><th>Difference</th>`:""}</tr>${names.map(n=>{const a=g(A,n),b=y?g(B,n):null;const d=(a?a.v:0)-(b?b.v:0);
    return `<tr><td>${esc(n)}</td><td>${a?fmt(a.v)+a.u:"—"}</td>${y?`<td>${b?fmt(b.v)+b.u:"—"}</td><td class="${d>0?"up":d<0?"dn":""}">${d>0?"+":d<0?"−":"±"}${fmt(Math.abs(d))}${(a||b).u}</td>`:""}</tr>`}).join("")}</table>`}
let cmpLvl="6",cmpLvl2="p";
function showEquip(i){
  const x=E[i];if(!x)return;cur=x;try{window.ptRecent&&ptRecent("Equipment",x.n)}catch(e){}
  page.style.setProperty("--gc",rc(x.r));
  const others=E.filter(y=>y.slot===x.slot&&y!==x);
  page.innerHTML=`<div class="ph"><div class="icon">${x.img?`<img src="${window.ptBig?ptBig(x.img):x.img}" alt="" width="120" height="120">`:""}</div>
      <div><span class="rr" style="--rc:${rc(x.r)}">${x.r} ${x.slot}${x.ev?" · limited-time":""}</span><h2 id="pname">${esc(x.n)}</h2>${oneTag(x)}</div>
      <div class="pv">${x.price==null?"—":x.cur==="$"?"$"+fmt(x.price):fmt(x.price)+" "+esc(x.cur)}<small>craft cost</small></div>
      <button type="button" class="btn" id="pclose">Close</button></div>
    ${x.d?`<p class="desc">${esc(x.d)}</p>`:""}
    ${["Dredge Master's Ring","Ring of Champions","Ring of the Stars","Scarab Signet","Embalmer's Ring","Ring of Ra"].includes(x.n)?`<p style="margin:0;color:var(--warn);font-weight:600;font-size:13.5px">Only one can be worn at a time.</p>`:""}
    ${x.bp?`<div class="bpbox"><b>Needs a blueprint</b>${x.bp==="Needs a blueprint"?"The wiki doesn't say where this blueprint comes from":esc(x.bp)}.</div>`:""}
    <div class="acts">${tgHtml(x.n)}<button type="button" class="btn pri" id="addCk">Add to crafting checklist</button><button type="button" class="btn" id="addCk6">Add as 6★ (2 crafts)</button></div>
    <div class="psec"><h3>Stats by star level</h3><div class="tw"><table class="st"><tr><th>Stat</th><th>5★ max</th><th>6★ max</th><th>6★ Prismatic</th><th>6★ Sunforged</th></tr>
      ${(()=>{const S=statsAt(x,"s");return S.map(r=>{const s=x.st.find(z=>z[0]===r[0]);const u=r[2]?"%":"";return `<tr><td>${sName(r[0])}</td><td>${s?fmt(at(s,"5"))+u:"—"}</td><td>${s?fmt(at(s,"6"))+u:"—"}</td><td>${s?fmt(at(s,"p"))+u:"—"}</td><td>${fmt(r[1])+u}</td></tr>`}).join("")})()}</table></div>
      <p class="muted" style="margin:0;font-size:12.5px">All at 100% quality. Prismatic gives 1.6× the 6★ values. Sunforged gives 1.5× plus +300 Luck and +30% Sell Boost.</p></div>
    <div class="psec"><h3>Recipe</h3><ul class="ing">${x.rec.map(([q,n,kg])=>{const m=MIN[n.toLowerCase()];return `<li style="--rc:${m?rc(m.r):"var(--line)"}" data-mineral="${esc(n)}" title="Ctrl+click to open ${esc(n)}">${m&&m.ic?`<img src="${m.ic}" alt="" width="26" height="26">`:""}<span class="q">${q}×</span><span>${esc(n)}${kg?` <span class="muted">(+${esc(kg)})</span>`:""}<br><span class="rr" style="--rc:${m?rc(m.r):"var(--muted)"}">${m?m.r:""}</span></span></li>`}).join("")}</ul></div>
    ${catSection(x)}
    <div class="psec"><h3><span>Compare</span><span style="display:flex;gap:6px;flex-wrap:wrap"><select id="cmpWith" aria-label="Compare with"><option value="">Compare with…</option><option value="${x.i}">${esc(x.n)} (this one, another level)</option>${others.map(y=>`<option value="${y.i}">${esc(y.n)} (${y.r})</option>`).join("")}</select>
      <select id="cmpLvl" aria-label="This item's level">${Object.entries(LVLN).map(([k,v])=>`<option value="${k}">${v}</option>`).join("")}</select><select id="cmpLvl2" aria-label="Other item's level" hidden>${Object.entries(LVLN).map(([k,v])=>`<option value="${k}">vs ${v}</option>`).join("")}</select></span></h3><div class="tw" id="cmpOut">${cmpTable(x,null)}</div></div>${bpSection(x)}`;
  $("cmpLvl").value=cmpLvl;$("cmpLvl2").value=cmpLvl2;
  const upd=e=>{const w=$("cmpWith").value;const y=w?E[+w]:null;
    // comparing with itself at the same level shows nothing useful, so move the other side to the next level
    if(e&&e.target.id==="cmpWith"&&y===x&&$("cmpLvl2").value===$("cmpLvl").value){const ks=Object.keys(LVLN);$("cmpLvl2").value=ks[(ks.indexOf($("cmpLvl").value)+1)%ks.length]}
    cmpLvl=$("cmpLvl").value;cmpLvl2=$("cmpLvl2").value;$("cmpLvl2").hidden=!y;$("cmpOut").innerHTML=cmpTable(x,y)};
  $("cmpWith").onchange=upd;$("cmpLvl").onchange=upd;$("cmpLvl2").onchange=upd;
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
// picture of the list as it is now (same filters, sort, value level and tags), one fixed column grid so every group lines up
const RHX={Ascended:"#ffd36b",Exotic:"#f17ad6",Mythic:"#f0687f",Legendary:"#f2b53a",Epic:"#b880ee",Rare:"#68a6f0",Uncommon:"#6cc46e",Common:"#a3adb8"};
const KHX={Luck:"#86f34a",Capacity:"#f0b44a","Size Boost":"#ff6b6b","Dig Strength":"#ff9d7f","Dig Speed":"#8ecbff","Sell Boost":"#ffd21f","Walk Speed":"#d6dbe0","Modifier Boost":"#39e06a","Shake Strength":"#ff8fb1","Shake Speed":"#b9a6ff"};
async function equipImage(){
  const groups=LAST.filter(g=>g[1].length);if(!groups.length)return null;
  try{await document.fonts.ready}catch(e){}
  const F='"IBM Plex Sans","Segoe UI",system-ui,sans-serif',FD='"Chakra Petch","Segoe UI",system-ui,sans-serif',FM='"IBM Plex Mono",Consolas,monospace';
  const NL=st.lvls.length,STW=NL===1?300:150+105*NL;
  const W=1300+(NL===1?0:STW-300),PAD=32,IW=W-PAD*2;
  // one shared grid: icon | name | stats | recipe | price (the picture gets wider for each extra value level)
  const CW=[70,290,STW,0,120];CW[3]=IW-CW.reduce((a,b)=>a+b,0);const CX=[];CW.reduce((a,w)=>(CX.push(a),a+w),PAD);
  const m=document.createElement("canvas").getContext("2d");
  const lvl=st.lvls.map(l=>LVLN[l]).join(", ");
  // lay out each row first so we know the picture height
  const recLay=x=>{m.font=`13px ${F}`;const lines=[[]];let lx=0;const av=CW[3]-24;x.rec.forEach(([q,n,kg])=>{const t=`${q}× ${n}${kg?" +"+kg:""}`;const w=22+m.measureText(t).width+14;if(lx+w>av&&lines[lines.length-1].length){lines.push([]);lx=0}lines[lines.length-1].push({t,n,w});lx+=w});return lines};
  const tagsOf=x=>[...(ONE_ONLY.has(x.n)?[["ONLY 1 CAN BE WORN","#f0a35a"]]:[]),...(x.bp&&st.bpTag?[["BLUEPRINT","#7fb2ff"]]:[])];
  const G=groups.map(([title,rows,gc,skip])=>({title,skip,col:title==="Limited-time"?"#f0955f":skip==="r"?RHX[title]||"#3a424b":"#3a424b",rows:rows.map(x=>{const S=NL===1?statsAt(x,st.lvl):multiRows(x),R=recLay(x),T=tagsOf(x);
    const subTxt=[skip==="slot"?"":x.slot,skip==="r"?"":x.r,x.ev?"limited-time":""].filter(Boolean).join(" · ");
    const nameH=24+(subTxt?18:0)+(T.length?24:0);const h=Math.max(70,(S.length+(NL>1?1:0))*21+18,R.length*26+18,nameH+18);return {x,S,R,T,subTxt,h}})}));
  const HEAD=96,GH=40,TH=30,GGAP=14;
  const H=PAD+HEAD+G.reduce((a,g)=>a+GH+TH+g.rows.reduce((b,r)=>b+r.h,0)+GGAP,0)-GGAP+PAD;
  const sc=H*2>30000?1:2;const cv=document.createElement("canvas");cv.width=W*sc;cv.height=H*sc;const c=cv.getContext("2d");c.scale(sc,sc);
  const rr=(x,y,w,h,r)=>{c.beginPath();c.moveTo(x+r,y);c.arcTo(x+w,y,x+w,y+h,r);c.arcTo(x+w,y+h,x,y+h,r);c.arcTo(x,y+h,x,y,r);c.arcTo(x,y,x+w,y,r);c.closePath()};
  const fit=(t,w)=>{t=String(t);if(c.measureText(t).width<=w)return t;while(t.length>1&&c.measureText(t+"…").width>w)t=t.slice(0,-1);return t+"…"};
  const srcs=new Set();G.forEach(g=>g.rows.forEach(r=>{if(r.x.img)srcs.add(r.x.img);r.x.rec.forEach(([,n])=>{const mm=MIN[n.toLowerCase()];if(mm&&mm.ic)srcs.add(mm.ic)})}));
  const IMG={};await Promise.all([...srcs].map(s=>new Promise(res=>{const i=new Image();i.onload=()=>{IMG[s]=i;res()};i.onerror=()=>res();i.src=s})));
  c.fillStyle="#14181c";c.fillRect(0,0,W,H);
  // header: title, what the picture shows, made-by badge
  c.font=`600 13px ${F}`;const mb="Made by @__coastal";const mw=c.measureText(mb).width+28,mx=W-PAD-mw,my=PAD-2;c.fillStyle="rgba(20,184,166,.14)";rr(mx,my,mw,26,13);c.fill();c.strokeStyle="rgba(20,184,166,.6)";c.lineWidth=1;rr(mx,my,mw,26,13);c.stroke();c.fillStyle="#14b8a6";c.beginPath();c.arc(mx+12,my+13,3,0,Math.PI*2);c.fill();c.fillStyle="#2dd4bf";c.fillText(mb,mx+20,my+17.5);
  c.fillStyle="#e6e9ec";c.font=`700 34px ${FD}`;c.fillText("Equipment",PAD,PAD+30);
  const n=G.reduce((a,g)=>a+g.rows.length,0);const sub=[`${n} item${n===1?"":"s"}`,`stats at ${lvl}, 100% quality`];if(st.slots.length)sub.push(st.slots.join(", ")+"s");if(st.stats.length)sub.push("with "+st.stats.join(st.match==="any"?" or ":" + "));if(st.rars.length)sub.push(st.rars.join(", "));if(st.q)sub.push(`search “${st.q}”`);if(st.fav)sub.push("favourites");if(st.own)sub.push("owned");
  c.fillStyle="#98a2ad";c.font=`15px ${F}`;c.fillText(fit(sub.join(" · "),IW),PAD,PAD+60);
  let y=PAD+HEAD;
  G.forEach((g,gi)=>{const gh=GH+TH+g.rows.reduce((a,r)=>a+r.h,0);
    c.fillStyle="#191d22";rr(PAD,y,IW,gh,8);c.fill();c.save();rr(PAD,y,IW,gh,8);c.clip();c.fillStyle=g.col;c.fillRect(PAD,y,5,gh);c.fillStyle="#1e2329";c.fillRect(PAD+5,y,IW,GH);c.restore();
    c.strokeStyle=g.col;c.lineWidth=1;rr(PAD+.5,y+.5,IW-1,gh-1,8);c.stroke();
    if(g.title){c.fillStyle=g.skip==="r"||g.title==="Limited-time"?g.col:"#e6e9ec";c.font=`700 19px ${FD}`;c.fillText(g.title,PAD+18,y+27)}
    c.fillStyle="#98a2ad";c.font=`13px ${F}`;const ct=`${g.rows.length} ${g.rows.length===1?"item":"items"}`;c.fillText(ct,W-PAD-16-c.measureText(ct).width,y+26);
    let yy=y+GH;c.font=`600 11px ${F}`;c.fillStyle="#98a2ad";["","Name",NL===1?`Stats (${lvl})`:"Stats","Recipe","Price"].forEach((t,i)=>{const u=t.toUpperCase();c.fillText(u,i===4?CX[i]+(CW[i]-c.measureText(u).width)/2:CX[i]+12,yy+20)});
    yy+=TH;const line=(x0,y0,x1,y1)=>{c.beginPath();c.moveTo(x0,y0);c.lineTo(x1,y1);c.stroke()};c.strokeStyle=g.col+"66";line(PAD+5,y+GH,W-PAD,y+GH);line(PAD+5,yy,W-PAD,yy);
    g.rows.forEach((r,k)=>{const x=r.x,rc=RHX[x.r]||"#e6e9ec";if(k%2){c.fillStyle="rgba(255,255,255,.025)";c.fillRect(PAD+5,yy,IW-5,r.h)}
      c.strokeStyle=g.col+"40";for(let i=1;i<5;i++)line(CX[i]+.5,yy,CX[i]+.5,yy+r.h);if(k)line(PAD+5,yy+.5,W-PAD,yy+.5);
      const im=IMG[x.img];if(im){c.save();c.shadowColor=rc+"88";c.shadowBlur=10;c.drawImage(im,CX[0]+13,yy+r.h/2-24,48,48);c.restore()}
      // name block
      const nh=24+(r.subTxt?18:0)+(r.T.length?24:0);let ny=yy+(r.h-nh)/2;
      c.fillStyle=rc;c.font=`700 17px ${FD}`;c.fillText(fit(x.n,CW[1]-24),CX[1]+12,ny+18);ny+=24;
      if(r.subTxt){c.fillStyle="#98a2ad";c.font=`12px ${F}`;c.fillText(fit(r.subTxt,CW[1]-24),CX[1]+12,ny+12);ny+=18}
      if(r.T.length){let tx=CX[1]+12;c.font=`700 10.5px ${F}`;r.T.forEach(([t,col])=>{const tw=c.measureText(t).width+14;c.strokeStyle=col;rr(tx,ny+2,tw,18,4);c.stroke();c.fillStyle=col;c.fillText(t,tx+7,ny+15);tx+=tw+6})}
      // stats
      const vtx=(sn,v,p)=>(v>0&&sn!=="Status Timer Speed"?"+":"")+fmt(v)+(p?"%":"");
      if(NL===1){let sy=yy+(r.h-r.S.length*21)/2;r.S.forEach(([sn,v,p])=>{c.font=`600 13.5px ${F}`;c.fillStyle=KHX[sn]||"#e6e9ec";c.fillText(sn,CX[2]+12,sy+15);const nw=c.measureText(sn+" ").width;
        c.font=`14px ${FM}`;c.fillStyle=v<0?"#ef7a66":"#e6e9ec";c.fillText(vtx(sn,v,p),CX[2]+12+nw,sy+15);sy+=21})}
      else{// small grid: stat name, then one right-aligned value per level
        const nameW=150,colW=(CW[2]-24-nameW)/NL,colR=i=>CX[2]+12+nameW+colW*(i+1);let sy=yy+(r.h-(r.S.length+1)*21)/2;
        c.font=`600 10.5px ${F}`;c.fillStyle="#98a2ad";st.lvls.forEach((l,i)=>{const t=LVLS[l].toUpperCase();c.fillText(t,colR(i)-c.measureText(t).width,sy+14)});sy+=21;
        r.S.forEach(({n:sn,v})=>{c.font=`600 13.5px ${F}`;c.fillStyle=KHX[sn]||"#e6e9ec";c.fillText(fit(sn,nameW-8),CX[2]+12,sy+15);
          c.font=`14px ${FM}`;v.forEach((q,i)=>{const t=q?vtx(sn,q[1],q[2]):"—";c.fillStyle=!q?"#5d6670":q[1]<0?"#ef7a66":"#e6e9ec";c.fillText(t,colR(i)-c.measureText(t).width,sy+15)});sy+=21})}
      // recipe
      let ry=yy+(r.h-r.R.length*26)/2;r.R.forEach(ln=>{let rx=CX[3]+12;ln.forEach(it=>{const mm=MIN[it.n.toLowerCase()];const mi=mm&&IMG[mm.ic];if(mi)c.drawImage(mi,rx,ry+3,18,18);c.font=`13px ${F}`;const q=it.t.split("× ")[0]+"×";c.fillStyle="#98a2ad";c.fillText(q,rx+22,ry+17);const qw=c.measureText(q+" ").width;c.fillStyle="#e6e9ec";c.fillText(it.t.slice(q.length+1),rx+22+qw,ry+17);rx+=it.w});ry+=26});
      // price
      c.font=`600 14px ${FM}`;c.fillStyle="#e6e9ec";const sh=v=>{const u=[[1e12,"T"],[1e9,"B"],[1e6,"M"],[1e3,"K"]].find(([d])=>v>=d);return u?fmt(v/u[0],2)+u[1]:fmt(v)};const pt=x.price==null?"—":x.cur==="$"?"$"+sh(x.price):sh(x.price)+" "+x.cur;c.fillText(pt,CX[4]+(CW[4]-c.measureText(pt).width)/2,yy+r.h/2+5);
      yy+=r.h});
    y+=gh+GGAP});
  return await new Promise(res=>cv.toBlob(res,"image/png"))}
$("toImg").onclick=()=>{if(!LAST.some(g=>g[1].length)){toast("Nothing to show with these filters");return}ptSaveImg("Equipment "+st.lvls.map(l=>LVLS[l]).join(" + "),equipImage)};
render();
