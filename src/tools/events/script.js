
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
  // Saturday update: the update goes live at 10:00 New York time and Admin Abuse starts 15 minutes before
  const U=nextUpdate(now),aa=U.aa,up=U.up,live=now>=aa&&now<new Date(up.getTime()+3600e3);
  const wd=d=>d.toLocaleDateString([], {weekday:"long"});
  h+=`<div class="tm" style="--tc:var(--c-exotic)"><span class="lab">Saturday update</span><b>Admin Abuse ${clock(aa)} · Update ${clock(up)}</b><span class="st ${live?"open":"shut"}">${live?(now<up?"Admin Abuse is on now":"Update is out"):wd(aa)+", your time"}</span><span class="cd">${live?(now<up?mmss((up-now)/1000):"Live"):mmss((aa-now)/1000)}</span><small>${live&&now<up?"Until the update":"Until Admin Abuse"}. Only on weeks with an update.</small><button type="button" class="btn sm" id="cpAA" style="align-self:flex-start;margin-top:4px">Copy for Discord</button></div>`;
  $("timers").innerHTML=h}
// offset (ms) of a time zone at a moment, from Intl (handles summer time)
function tzOff(d,tz){const p=Object.fromEntries(new Intl.DateTimeFormat("en-US",{timeZone:tz,hourCycle:"h23",year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",second:"2-digit"}).formatToParts(d).map(x=>[x.type,x.value]));
  return Date.UTC(+p.year,+p.month-1,+p.day,+p.hour%24,+p.minute,+p.second)-d.getTime()}
function atTz(y,m,d,h,mi,tz){let t=Date.UTC(y,m,d,h,mi);t-=tzOff(new Date(t),tz);t=Date.UTC(y,m,d,h,mi)-tzOff(new Date(t),tz);return new Date(t)}
const UTZ="America/New_York";
function nextUpdate(now){const p=Object.fromEntries(new Intl.DateTimeFormat("en-US",{timeZone:UTZ,year:"numeric",month:"numeric",day:"numeric",weekday:"short"}).formatToParts(now).map(x=>[x.type,x.value]));
  const dow=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].indexOf(p.weekday);
  for(let add=(6-dow+7)%7;;add+=7){const up=atTz(+p.year,+p.month-1,+p.day+add,10,0,UTZ);// keep this week's until an hour after the update
    if(now<new Date(up.getTime()+3600e3))return {up,aa:new Date(up.getTime()-15*60e3)}}}
// Discord turns <t:unix:t> into a time in each reader's own time zone
document.addEventListener("click",e=>{if(!e.target.closest("#cpAA"))return;const {up,aa}=nextUpdate(new Date());const u=x=>Math.floor(x.getTime()/1000);
  const txt=`**When there's an Update on Saturday** *(Sunday in New Zealand)* **at <t:${u(up)}:t>, an AA occurs at <t:${u(aa)}:t>, these times are already adapted to your timezone!**`;
  const done=ok=>ptToast(ok?"Copied. Paste it in Discord":"Couldn't copy");
  (navigator.clipboard?navigator.clipboard.writeText(txt).then(()=>done(true),()=>done(false)):Promise.resolve(done(false)))});
$("tz").textContent=`Times are shown in your local time (${Intl.DateTimeFormat().resolvedOptions().timeZone||"your time zone"}). The game counts minutes past the hour, so these line up wherever you are.`;
let onlyReg=false;
function render(){const q=$("q").value.trim().toLowerCase();$("onlyReg").setAttribute("aria-pressed",String(onlyReg));
  const groups={};EV.filter(e=>(!onlyReg||/Regular/.test(e.cat))&&(!q||(e.n+" "+e.d+" "+e.fx.join(" ")).toLowerCase().includes(q))).forEach(e=>(groups[e.cat||"Other"]=groups[e.cat||"Other"]||[]).push(e));
  const COL={"Regular Events":"var(--accent)","Limited-Time Events":"var(--ev)","Admin-Exclusive Events":"var(--c-exotic)"};
  $("evs").innerHTML=Object.entries(groups).map(([c,es])=>`<p class="grp">${esc(c)}</p><div class="ev">${es.map(e=>`<div class="e" style="border-top:3px solid ${COL[c]||"var(--line)"}"><b>${esc(e.n)}</b>${e.d?`<p>${esc(e.d)}</p>`:""}${e.fx.length?`<ul>${e.fx.map(f=>`<li${f.startsWith("  ")?' style="margin-left:14px;list-style:circle"':""}>${esc(f.trim())}</li>`).join("")}</ul>`:""}</div>`).join("")}</div>`).join("")||'<div class="empty">No events match.</div>'}
$("q").oninput=render;$("onlyReg").onclick=()=>{onlyReg=!onlyReg;render()};
render();tick();setInterval(tick,1000);
