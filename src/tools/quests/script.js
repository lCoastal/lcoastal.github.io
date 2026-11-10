
const $=id=>document.getElementById(id);
const Q=(P.x2&&P.x2.quests||[]).map((q,i)=>({...q,id:q.loc+"|"+q.npc+"|"+q.n,i}));
let D={};try{D=JSON.parse(localStorage.getItem("pq-done")||"{}")||{}}catch(e){}
let F={hide:false,bp:false,buff:false,loc:""};try{Object.assign(F,JSON.parse(localStorage.getItem("pq-f")||"{}"))}catch(e){}
const saveD=()=>{try{localStorage.setItem("pq-done",JSON.stringify(D))}catch(e){}};const saveF=()=>{try{localStorage.setItem("pq-f",JSON.stringify(F))}catch(e){}};
const LOCS=[...new Set(Q.map(q=>q.loc))];$("loc").innerHTML+=LOCS.map(l=>`<option${l===F.loc?" selected":""}>${esc(l)}</option>`).join("");
// link mineral names inside step text so Ctrl+click opens them
const MNAMES=P.mins.map(m=>m.n).sort((a,b)=>b.length-a.length);
const MRE=new RegExp("\\b("+MNAMES.map(n=>n.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")).join("|")+")s?\\b","gi");
const linkM=t=>esc(t).replace(MRE,(m,n)=>{const real=MNAMES.find(x=>x.toLowerCase()===n.toLowerCase());return `<span class="mlink" data-mineral="${esc(real)}">${window.ptIc?ptIc(real):""}${m}</span>`});
const st=q=>D[q.id]||{s:[],d:false};
const isDone=q=>{const s=st(q);return s.d||(q.steps.length>0&&q.steps.every((_,k)=>s.s[k]))};
function render(){const t=$("q").value.trim().toLowerCase();
  ["hideDone","onlyBp","onlyBuff"].forEach((id,k)=>$(id).setAttribute("aria-pressed",String([F.hide,F.bp,F.buff][k])));
  const rows=Q.filter(q=>(!F.loc||q.loc===F.loc)&&(!F.hide||!isDone(q))&&(!F.bp||/blueprint/i.test(q.rw))&&(!F.buff||q.buff)&&(!t||(q.n+" "+q.npc+" "+q.steps.join(" ")+" "+q.rw+" "+q.buff+" "+q.loc).toLowerCase().includes(t)));
  $("count").textContent=`${rows.length} quests · ${Q.filter(isDone).length} of ${Q.length} finished`;
  $("list").innerHTML=LOCS.map(l=>{const rs=rows.filter(q=>q.loc===l);if(!rs.length)return "";const all=Q.filter(q=>q.loc===l),dn=all.filter(isDone).length;
    return `<section class="loc"><div class="lh"><h2>${esc(l)}</h2><span class="lbar">${dn} / ${all.length} done<span class="bar"><i style="width:${all.length?dn/all.length*100:0}%"></i></span></span></div><div class="qs">${rs.map(q=>{const s=st(q),done=isDone(q);
      const rw=q.rw?q.rw.split(/\s*•\s*/).filter(Boolean).map(r=>`<span class="${/blueprint/i.test(r)?"bp":""}">${esc(r)}</span>`).join(""):"";
      return `<article class="q${done?" done":""}"><div class="qh"><div><b>${esc(q.n)}</b><div class="npc">${q.npc?"From "+esc(q.npc):""}</div></div><button type="button" class="donebtn" data-done="${q.i}" aria-pressed="${done}">${done?"✓ Done":"Mark done"}</button></div>
        ${q.sub?`<p class="qsub">${esc(q.sub)}</p>`:""}
        ${q.steps.length?`<ul class="steps">${q.steps.map((x,k)=>`<li><label class="${s.s[k]||s.d?"ok":""}"><input type="checkbox" data-q="${q.i}" data-k="${k}"${s.s[k]||s.d?" checked":""}><span>${linkM(x)}</span></label></li>`).join("")}</ul>`:""}
        ${rw||q.buff?`<div class="rw">${rw}${q.buff?`<span class="buff">${esc(q.buff)}</span>`:""}</div>`:""}</article>`}).join("")}</div></section>`}).join("")||'<div class="empty">No quests match these filters.</div>';
}
$("q").oninput=render;$("loc").onchange=()=>{F.loc=$("loc").value;saveF();render()};
[["hideDone","hide"],["onlyBp","bp"],["onlyBuff","buff"]].forEach(([id,k])=>$(id).onclick=()=>{F[k]=!F[k];saveF();render()});
// Dredge Master never ends: refuse to mark it done with a random line, then undo it
const INF_MSGS=["This can never truly be done.","You can't finish this.","You're lying.","Nice try.","The Dredge Master is never satisfied.","There is always more ore.","Done? Done?? No.","He has another request already.","The river does not run dry, and neither does this quest.","Finished? Not in this lifetime.","Back to panning.","Who told you that you were done?","The grind is eternal.","Sure you are, buddy."];
let lastInf=-1;
const isInf=q=>q.n==="Dredge Master";
function refuse(q){let i;do{i=Math.floor(Math.random()*INF_MSGS.length)}while(INF_MSGS.length>1&&i===lastInf);lastInf=i;
  delete D[q.id];saveD();render();const btn=document.querySelector(`[data-done="${q.i}"]`);const art=btn&&btn.closest(".q");if(!art)return;
  art.classList.add("done");art.querySelectorAll("input[data-q]").forEach(c=>c.checked=true);btn.textContent="✓ Done";btn.setAttribute("aria-pressed","true");
  const m=document.createElement("p");m.className="infmsg";m.setAttribute("role","status");m.textContent=INF_MSGS[i];art.querySelector(".qh").after(m);
  clearTimeout(refuse.t);refuse.t=setTimeout(()=>{m.classList.add("out");setTimeout(()=>{render();const nb=document.querySelector(`[data-done="${q.i}"]`);nb&&document.activeElement===document.body&&nb.focus()},400)},2200)}
document.addEventListener("change",e=>{const t=e.target;if(t.dataset.q==null)return;const q=Q[+t.dataset.q];
  if(isInf(q)){const s=Object.assign({s:[],d:false},D[q.id]);s.s[+t.dataset.k]=t.checked;D[q.id]=s;if(q.steps.every((_,k)=>s.s[k])){refuse(q);return}saveD();render();return}const s=Object.assign({s:[],d:false},D[q.id]);if(s.d&&!t.checked){s.d=false;s.s=q.steps.map(()=>true)}s.s[+t.dataset.k]=t.checked;D[q.id]=s;saveD();render()});
document.addEventListener("click",e=>{if(e.ctrlKey||e.metaKey)return;const b=e.target.closest("[data-done]");if(!b)return;const q=Q[+b.dataset.done];if(isInf(q)){refuse(q);return}const done=isDone(q);D[q.id]=done?{s:[],d:false}:{s:q.steps.map(()=>true),d:true};saveD();render();const nb=document.querySelector(`[data-done="${b.dataset.done}"]`);nb&&nb.focus()});
window.ptOpenItem=name=>{$("q").value=name;F.loc="";$("loc").value="";render()};
render();
