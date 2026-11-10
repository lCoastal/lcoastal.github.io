
const C=P.codes||{};const A=C["Active Codes"]||{hdr:[],rows:[]},X=C["Expired Codes"]||{hdr:[],rows:[]};
const hn=h=>h.replace(/^!\s*/,"").trim();
const up=C.updated?new Date(C.updated):null;
document.getElementById("upd").textContent="Codes can expire without notice, so if one says it's invalid it has probably ended.";
const rewards=(hdr,r)=>hdr.slice(1).map((h,i)=>[hn(h),r[i+1]]).filter(([,v])=>v&&v!=="—"&&v!=="-");
const CC=C.custom||[];
document.getElementById("act").innerHTML=(A.rows.length||CC.length)?CC.map(x=>`<div class="code" style="border-color:var(--ev)"><div class="ctop"><code>${esc(x.c)}</code><button type="button" class="btn pri" data-copy="${esc(x.c)}">Copy</button></div><div class="rw"><span>Added by you</span>${x.rw?`<span>${esc(x.rw)}</span>`:""}</div></div>`).join("")+A.rows.map(r=>`<div class="code"><div class="ctop"><code>${esc(r[0])}</code><button type="button" class="btn pri" data-copy="${esc(r[0])}">Copy</button></div>
  <div class="rw">${rewards(A.hdr,r).map(([h,v])=>`<span>${esc(h)} <b>${esc(v)}</b></span>`).join("")}</div></div>`).join(""):'<div class="empty">No active codes right now.</div>';
document.getElementById("ext").innerHTML=`<tr>${X.hdr.map(h=>`<th>${esc(hn(h))}</th>`).join("")}</tr>`+X.rows.map(r=>`<tr>${r.map(c=>`<td>${esc(c)}</td>`).join("")}</tr>`).join("");
document.getElementById("exp").querySelector("summary").textContent=`Expired codes (${X.rows.length})`;
function toast(t){const d=document.createElement("div");d.className="toast";d.setAttribute("role","status");d.textContent=t;document.body.appendChild(d);setTimeout(()=>d.remove(),1800)}
document.addEventListener("click",async e=>{const b=e.target.closest("[data-copy]");if(!b)return;const t=b.dataset.copy;let ok=false;
  try{await navigator.clipboard.writeText(t);ok=true}catch(err){try{const ta=document.createElement("textarea");ta.value=t;document.body.appendChild(ta);ta.select();ok=document.execCommand("copy");ta.remove()}catch(e2){}}
  toast(ok?`Copied “${t}”`:`Couldn't copy — the code is “${t}”`)});
