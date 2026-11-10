
const $=id=>document.getElementById(id);
let S={mb:"",luck:"",cap:"",mag:false,surge:false,night:false};try{Object.assign(S,JSON.parse(localStorage.getItem("pmo-s")||"{}"))}catch(e){}
const save=()=>{try{localStorage.setItem("pmo-s",JSON.stringify(S))}catch(e){}};
// the game's modifier weights; a modifier's base share is its weight ÷ the total (Treasured, Voidtorn, event ones etc. are 0 here)
const WEIGHT={Shiny:1,Pure:.8,Glowing:.5,Scorching:.25,Irradiated:.1,Iridescent:.02,Cosmic:.005,Mutated:.001,Lunar:.00025,Perfect:.0001};
const WSUM=Object.values(WEIGHT).reduce((a,b)=>a+b,0);
const BASE=Object.fromEntries(Object.entries(WEIGHT).map(([k,w])=>[k,w/WSUM*100]));
const PRICE={Perfect:24,Lunar:14,Mutated:9,Cosmic:6,Iridescent:3.5,Irradiated:2.5,Scorching:2,Glowing:1.6,Pure:1.35,Shiny:1.2};
const MUSE=Object.fromEntries(P.mods.map(m=>[m[0],m[1].join(", ")]));
// share of ores that get a normal (panning) modifier: about 36% in my tests at different boosts,
// so Modifier Boost changes which modifier you get far more than how often. Voidtorn and event modifiers come on top.
const NAT_MOD=.36;const anyMod=()=>NAT_MOD;
// Which modifier you get works like luck does for minerals: the game rolls the modifier several times and keeps
// the rarest, by the game's weights. Strength = 10.1 x Modifier Boost (x) + 1 per 1,000 luck (the wiki's "every 1k
// luck is an extra roll"), fitted on my tests with the Halloween event left out. A third of ores
// roll once, a quarter at half strength, the rest at full strength.
const MODW=[["Perfect",.0001],["Lunar",.00025],["Mutated",.001],["Cosmic",.005],["Iridescent",.02],["Irradiated",.1],["Scorching",.25],["Glowing",.5],["Pure",.8],["Shiny",1]];
const MOD_K=10.12,MOD_LUCK=1/1000,MOD_MIX=[.338,.268,.394];
function modShares(eff,night,luck){const list=MODW.filter(([k])=>night||k!=="Lunar");const tot=list.reduce((a,x)=>a+x[1],0);
  const f=N=>{let a=0;const o={};list.forEach(([k,w])=>{const p=w/tot;o[k]=Math.pow(1-a,N)-Math.pow(Math.max(0,1-a-p),N);a+=p});return o};
  const L=Math.max(1,MOD_K*Math.max(0,eff)/100+MOD_LUCK*Math.max(0,+luck||0)),parts=[f(1),f(Math.max(1,L/2)),f(L)];const s={};
  list.forEach(([k])=>s[k]=100*(MOD_MIX[0]*parts[0][k]+MOD_MIX[1]*parts[1][k]+MOD_MIX[2]*parts[2][k]));return s}
function shares(eff){return modShares(eff,S.night,S.luck)}
const oneInP=p=>p<=0?"—":p>=.5?fmt(p*100,1)+"%":`~1 in ${fmt(Math.round(1/p),0)}`;
function calcAll(){const mb=Math.max(0,+S.mb||0);
  const effAny=mb*(S.surge?2:1),effWhich=Math.max(1,mb*(S.surge?2:1));
  return {mb,effAny,effWhich,q:anyMod(effAny),sh:shares(effWhich),n:Math.max(1,Math.sqrt(Math.max(1,+S.cap||1)))}}
const ORDER=["Perfect","Lunar","Mutated","Cosmic","Iridescent","Irradiated","Scorching","Glowing","Pure","Shiny"];
function render(){["mb","luck","cap"].forEach(k=>$(k).value=S[k]);["mag","surge","night"].forEach(k=>$(k).checked=!!S[k]);
  const {effAny,effWhich,q,sh,n}=calcAll();
  $("sum").innerHTML=`<div><span class="lab">Ores with a modifier</span><b>${fmt(q*100,1)}%</b><div class="bar"><i style="width:${q*100}%"></i></div></div>
    <div><span class="lab">Effective boost</span><b>${fmt(effAny,0)}</b><span class="hint">${fmt(effWhich,0)} for which modifier</span></div>
    <div><span class="lab">Perfect per pan</span><b>${oneInP(1-Math.pow(1-q*sh.Perfect/100,n))}</b><span class="hint">about ${fmt(n,1)} ores per pan</span></div>`;
  const order=ORDER;
  $("tbl").innerHTML=`<table class="o"><thead><tr><th>Modifier</th><th>Share of modified</th><th>Base share</th><th>Per ore</th><th>Per pan</th><th>Sell ×</th></tr></thead><tbody>${order.map(k=>{const on=k!=="Lunar"||S.night;const s=on?(sh[k]||0):0;const po=q*s/100;
    return `<tr class="${on?"":"off"}"><td><span class="mn"><b>${k}</b><span>${k==="Lunar"&&!S.night?"Night only":"Museum: "+esc(MUSE[k]||"")}</span></span></td><td data-l="Share" class="${s>BASE[k]*1.05?"up":""}">${on?fmt(s,s<0.1?4:2)+"%":"—"}</td><td data-l="Base">${fmt(BASE[k],4)}%</td><td data-l="Per ore">${on?oneInP(po):"—"}</td><td data-l="Per pan">${on?oneInP(1-Math.pow(1-po,n)):"—"}</td><td data-l="Sell">${PRICE[k]}×</td></tr>`}).join("")}</tbody></table>`}
["mb","luck","cap"].forEach(k=>$(k).addEventListener("input",()=>{S[k]=$(k).value;save();render()}));
["mag","surge","night"].forEach(k=>$(k).addEventListener("change",()=>{S[k]=$(k).checked;save();render()}));
$("fromCalc").onclick=async()=>{let t=null;try{t=await window.parent.ptGetTotals()}catch(e){}if(!t)return;S.mb=Math.round(t["Modifier Boost"]||0);S.luck=Math.round(t.Luck||0);S.cap=Math.round(t.Capacity)||S.cap;save();render()};
// ---- save the results as an image (just the numbers, no page controls) ----
function toast(t){const d=document.createElement("div");d.className="toast";d.setAttribute("role","status");d.textContent=t;document.body.appendChild(d);setTimeout(()=>d.remove(),2200)}
async function modImage(){const {mb,effAny,effWhich,q,sh,n}=calcAll();
  const F='"IBM Plex Sans","Segoe UI",system-ui,sans-serif',FD='"Chakra Petch","Segoe UI",system-ui,sans-serif',FM='"IBM Plex Mono",Consolas,monospace';try{await document.fonts.ready}catch(e){}
  const rows=ORDER.filter(k=>k!=="Lunar"||S.night).map(k=>{const s=sh[k]||0,po=q*s/100;return {k,s,po,pp:1-Math.pow(1-po,n)}});
  const W=1200,PAD=40,RH=46,SUMH=78,H=PAD+90+SUMH+18+36+rows.length*RH+60;
  const cv=document.createElement("canvas");const sc=2;cv.width=W*sc;cv.height=H*sc;const c=cv.getContext("2d");c.scale(sc,sc);
  const rr=(x,y,w,h,r)=>{c.beginPath();c.moveTo(x+r,y);c.arcTo(x+w,y,x+w,y+h,r);c.arcTo(x+w,y+h,x,y+h,r);c.arcTo(x,y+h,x,y,r);c.arcTo(x,y,x+w,y,r);c.closePath()};
  const fit=(t,w)=>{if(c.measureText(t).width<=w)return t;while(t.length>1&&c.measureText(t+"…").width>w)t=t.slice(0,-1);return t+"…"};
  c.fillStyle="#14181c";c.fillRect(0,0,W,H);
  c.font=`600 13px ${F}`;const mbt="Made by @__coastal";const mw=c.measureText(mbt).width+28,mx=W-PAD-mw,my=PAD-6;c.fillStyle="rgba(20,184,166,.14)";rr(mx,my,mw,26,13);c.fill();c.strokeStyle="rgba(20,184,166,.6)";c.lineWidth=1;rr(mx,my,mw,26,13);c.stroke();c.fillStyle="#14b8a6";c.beginPath();c.arc(mx+12,my+13,3,0,Math.PI*2);c.fill();c.fillStyle="#2dd4bf";c.fillText(mbt,mx+20,my+17.5);
  c.fillStyle="#e6e9ec";c.font=`700 34px ${FD}`;c.fillText(`${fmt(mb,0)}% Modifier Boost`,PAD,PAD+30);
  const sub=[`Luck ${fmt(+S.luck||0,0)}`,`Capacity ${fmt(+S.cap||1,0)}`,`about ${fmt(n,1)} ores per pan`];if(S.surge)sub.push("Modifier Surge");if(S.night)sub.push("Night");
  c.fillStyle="#98a2ad";c.font=`15px ${F}`;c.fillText(sub.join(" · "),PAD,PAD+58);
  let y=PAD+82;const sums=[{lab:"Ores with a modifier",v:fmt(q*100,1)+"%",bar:q},{lab:"Effective boost",v:fmt(effAny,0),s:fmt(effWhich,0)+" for which modifier"},{lab:"Perfect per pan",v:oneInP(1-Math.pow(1-q*sh.Perfect/100,n)),s:`about ${fmt(n,1)} ores per pan`}];
  const bw=(W-PAD*2-24)/3;sums.forEach((b,i)=>{const x=PAD+i*(bw+12);c.fillStyle="#1c2126";rr(x,y,bw,SUMH,10);c.fill();c.strokeStyle="#2c333a";rr(x,y,bw,SUMH,10);c.stroke();
    c.fillStyle="#98a2ad";c.font=`600 11.5px ${F}`;c.fillText(b.lab.toUpperCase(),x+14,y+24);c.fillStyle="#e6e9ec";c.font=`500 21px ${FM}`;c.fillText(b.v,x+14,y+52);
    if(b.bar!=null){c.fillStyle="#2c333a";rr(x+14,y+62,bw-28,7,3.5);c.fill();c.fillStyle="#3cc2a8";rr(x+14,y+62,Math.max(7,(bw-28)*b.bar),7,3.5);c.fill()}
    else if(b.s){c.fillStyle="#98a2ad";c.font=`12px ${F}`;c.fillText(fit(b.s,bw-28),x+14,y+69)}});
  y+=SUMH+18;
  const cols=["Modifier","Share of modified","Base share","Per ore","Per pan","Sell ×"];const nameW=380,nw=(W-PAD*2-nameW-24)/(cols.length-1);const cx=i=>PAD+12+nameW+nw*i;
  c.font=`600 11px ${F}`;c.fillStyle="#98a2ad";cols.forEach((t,i)=>{const u=t.toUpperCase();if(!i)c.fillText(u,PAD+12,y+20);else c.fillText(u,cx(i)-c.measureText(u).width,y+20)});
  y+=30;c.strokeStyle="#2c333a";c.beginPath();c.moveTo(PAD,y);c.lineTo(W-PAD,y);c.stroke();
  rows.forEach((r,k)=>{const top=y+k*RH,mid=top+RH/2;if(k%2){c.fillStyle="#191d22";c.fillRect(PAD,top,W-PAD*2,RH)}
    c.fillStyle="#e6e9ec";c.font=`600 15px ${F}`;c.fillText(r.k,PAD+12,mid-2);c.fillStyle="#98a2ad";c.font=`11.5px ${F}`;c.fillText(fit("Museum: "+(MUSE[r.k]||""),nameW-12),PAD+12,mid+14);
    const vals=[fmt(r.s,r.s<0.1?4:2)+"%",fmt(BASE[r.k],4)+"%",oneInP(r.po),oneInP(r.pp),PRICE[r.k]+"×"];
    vals.forEach((v,i)=>{const x=cx(i+1);c.font=`14px ${FM}`;c.fillStyle=i===0&&r.s>BASE[r.k]*1.05?"#3cc2a8":"#e6e9ec";c.fillText(v,x-c.measureText(v).width,mid+5)})});
  y+=rows.length*RH+28;{const et="Estimates only: enchants, events, weather and Size Boost aren't counted, so real odds can differ.";c.font=`600 13px ${F}`;const ew=c.measureText(et).width+30,ex=PAD,ey=y-10;c.fillStyle="rgba(239,122,102,.14)";rr(ex,ey,ew,28,14);c.fill();c.strokeStyle="rgba(239,122,102,.65)";c.lineWidth=1;rr(ex,ey,ew,28,14);c.stroke();c.fillStyle="#ef7a66";c.beginPath();c.arc(ex+13,ey+14,3,0,Math.PI*2);c.fill();c.fillText(et,ex+22,ey+18.5)}
  return await new Promise(res=>cv.toBlob(res,"image/png"))}
window.ptModImage=modImage;
$("toImg").onclick=async()=>{let blob=null;try{blob=await modImage()}catch(e){console.error(e)}if(!blob){toast("Couldn't draw the image");return}
  try{await window.parent.ptSave(`Modifier odds ${fmt(Math.max(0,+S.mb||0),0)} boost.png`.replace(/[\\/:*?"<>|]+/g," "),blob);toast((()=>{try{return window.parent.ptImgMsg()}catch(e){return "Image saved"}})())}catch(e){const c=e&&e.code;if(c!=="declined")toast(c==="rate_limited"?"A save prompt is already open":"Couldn't save the image here")}};
render();
