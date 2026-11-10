
const $=id=>document.getElementById(id);const EV=(P.x2&&P.x2.events)||[];
// timed areas: open for 30 minutes starting at these minutes past the hour
const AREAS=[{n:"Infernal Heart",start:15,len:30,c:"var(--c-mythic)"},{n:"Timelocked Sanctuary",start:45,len:30,c:"var(--c-epic)"}];
const mmss=s=>{s=Math.max(0,Math.round(s));const h=Math.floor(s/3600),m=Math.floor(s%3600/60),x=s%60;return (h?h+":"+String(m).padStart(2,"0"):m)+":"+String(x).padStart(2,"0")};
const clock=d=>d.toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"});
function tick(){const now=new Date();const secH=now.getUTCMinutes()*60+now.getUTCSeconds();
  const toRoll=1800-(secH%1800);const nextRoll=new Date(now.getTime()+toRoll*1000);
  let h=`<div class="tm"><span class="lab">Next event roll</span><b>Events can start at :00 and :30</b><span class="cd">${mmss(toRoll)}</span><div class="bar"><i style="width:${(1800-toRoll)/1800*100}%"></i></div><small>Next roll at ${clock(nextRoll)} your time. Every server gets the same event.</small></div>`;
  AREAS.forEach(a=>{const st=a.start*60,en=st+a.len*60;let open,left;const s=secH;
    const inWin=x=>((x-st)%3600+3600)%3600<a.len*60;open=inWin(s);
    if(open){left=a.len*60-((s-st)%3600+3600)%3600}else{left=((st-s)%3600+3600)%3600}
    const at=new Date(now.getTime()+left*1000);
    h+=`<div class="tm" style="--tc:${a.c}"><span class="lab">Timed area</span><b><span data-location="${esc(a.n)}">${esc(a.n)}</span></b><span class="st ${open?"open":"shut"}">${open?"Open now":"Closed"}</span><span class="cd">${mmss(left)}</span><div class="bar"><i style="width:${open?(1-left/(a.len*60))*100:(1-left/((60-a.len)*60))*100}%"></i></div><small>${open?"Closes":"Opens"} at ${clock(at)} your time. Open :${String(a.start).padStart(2,"0")}–:${String((a.start+a.len)%60).padStart(2,"0")} every hour.</small></div>`});
  $("timers").innerHTML=h}
$("tz").textContent=`Times are shown in your local time (${Intl.DateTimeFormat().resolvedOptions().timeZone||"your time zone"}). The game counts minutes past the hour, so these line up wherever you are.`;
let onlyReg=false;
function render(){const q=$("q").value.trim().toLowerCase();$("onlyReg").setAttribute("aria-pressed",String(onlyReg));
  const groups={};EV.filter(e=>(!onlyReg||/Regular/.test(e.cat))&&(!q||(e.n+" "+e.d+" "+e.fx.join(" ")).toLowerCase().includes(q))).forEach(e=>(groups[e.cat||"Other"]=groups[e.cat||"Other"]||[]).push(e));
  const COL={"Regular Events":"var(--accent)","Limited-Time Events":"var(--ev)","Admin-Exclusive Events":"var(--c-exotic)"};
  $("evs").innerHTML=Object.entries(groups).map(([c,es])=>`<p class="grp">${esc(c)}</p><div class="ev">${es.map(e=>`<div class="e" style="border-top:3px solid ${COL[c]||"var(--line)"}"><b>${esc(e.n)}</b>${e.d?`<p>${esc(e.d)}</p>`:""}${e.fx.length?`<ul>${e.fx.map(f=>`<li${f.startsWith("  ")?' style="margin-left:14px;list-style:circle"':""}>${esc(f.trim())}</li>`).join("")}</ul>`:""}</div>`).join("")}</div>`).join("")||'<div class="empty">No events match.</div>'}
$("q").oninput=render;$("onlyReg").onclick=()=>{onlyReg=!onlyReg;render()};
render();tick();setInterval(tick,1000);
