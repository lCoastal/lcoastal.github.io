(()=>{
window.ptNoImgTheme=true;
const $=id=>document.getElementById(id);
const MUTS=[["Perfect", 24, 26764, "#22b8cf", "Panning"], ["Treasured", 15, 0, "#d4a017", "Special"], ["Lunar", 14, 10705, "#e8c95a", "Panning"], ["Voidtorn", 11, 0, "#7b3fe4", "Special"], ["Mutated", 9, 2676, "#9b4dca", "Panning"], ["Cosmic", 6, 535, "#e64fa8", "Panning"], ["Electrified", 5, 0, "#f2d22e", "Special"], ["Iridescent", 3.5, 134, "#c46fe0", "Panning"], ["Irradiated", 2.5, 27, "#3fbf4f", "Panning"], ["Crystalline", 2, 0, "#7cc6f0", "Special"], ["Scorching", 2, 11, "#f0642a", "Panning"], ["Glowing", 1.6, 5, "#f2c230", "Panning"], ["Pure", 1.35, 3, "#cfd6dd", "Panning"], ["Shiny", 1.2, 3, "#4b8df0", "Panning"], ["Purified", 1, 0, "#e6e9ec", "Special"], ["Charming", 1, 0, "#f28cb8", "Event"], ["Rosy", 1, 0, "#e0485c", "Event"], ["Ghostly", 1, 0, "#8fe39a", "Event"], ["Spooky", 1, 0, "#2fc4b2", "Event"], ["Jolly", 1, 0, "#d94040", "Event"], ["Hearthflame", 1, 0, "#f08a30", "Event"], ["Summer", 1, 0, "#f5b942", "Event"], ["Tidal", 1, 0, "#3aa0d8", "Event"]]
;
const MIN=Object.fromEntries(P.mins.map(m=>[m.n.toLowerCase(),m]));
const RC={Common:"#a3aab5",Uncommon:"#4ade80",Rare:"#60a5fa",Epic:"#c084fc",Legendary:"#fbbf24",Mythic:"#f87171",Exotic:"#f0abfc"};
const LOC={};P.mins.forEach(m=>(m.ch||[]).forEach(c=>{const q=parseFloat(String(c[1]).replace(/[%,]/g,""))/100;if(q>0)(LOC[c[0]]=LOC[c[0]]||[]).push({m,p:q})}));
const bl=n=>n.replace(/\s*\((inside|outside) Firefly Zones\)/,"").replace(/\s*\(when in the loot pool\)/,"");
function full(loc){const b=bl(loc),own=LOC[loc]||[];let out;
  if(b!==loc&&LOC[b])out=LOC[b].filter(x=>!own.some(y=>y.m===x.m)).concat(own);
  else if(own.length<2){const seen=new Set();out=[];Object.keys(LOC).filter(v=>v!==loc&&bl(v)===loc).forEach(v=>LOC[v].concat(own).forEach(x=>{if(!seen.has(x.m)){seen.add(x.m);out.push(x)}}))}
  else out=[...own];return out.length<2?[]:out}
function best(m,L){let top=null;Object.keys(LOC).forEach(z=>{const list=full(z).sort((a,b)=>a.p-b.p),tot=list.reduce((s,x)=>s+x.p,0);let c=0;
  const f=(lo,hi,l)=>Math.pow(1-lo,l)-Math.pow(1-hi,l);
  list.forEach(x=>{const lo=c/tot,hi=(c+x.p)/tot;c+=x.p;if(x.m!==m)return;const e=.25*f(lo,hi,1)+.25*f(lo,hi,Math.max(1,L/2))+.5*f(lo,hi,Math.max(1,L));if(!top||e>top.e)top={z:bl(z),e}})});return top}
let S={min:"",kg:"",mod:"None",luck:"",who:""};try{Object.assign(S,JSON.parse(localStorage.getItem("pfc-s")||"{}"))}catch(e){}
const save=()=>{try{localStorage.setItem("pfc-s",JSON.stringify(S))}catch(e){}};
$("mins").innerHTML=P.mins.map(m=>`<option value="${esc(m.n)}">`).join("");
$("mod").innerHTML='<option value="None">None</option>'+MUTS.map(x=>`<option>${esc(x[0])}</option>`).join("");
const SUF=["","K","M","B","T","Qa","Qi"];
const money=v=>{if(!isFinite(v))return"–";let i=0;while(v>=1000&&i<SUF.length-1){v/=1000;i++}return"$"+(i?v.toFixed(v>=100?0:v>=10?1:2):Math.round(v).toLocaleString())+SUF[i]};
const imgs={};const getImg=src=>new Promise(r=>{if(!src)return r(null);if(imgs[src])return r(imgs[src]);const i=new Image();i.onload=()=>{imgs[src]=i;r(i)};i.onerror=()=>r(null);i.src=src});
const rr=(x,a,b,w,h,r)=>{x.beginPath();x.moveTo(a+r,b);x.arcTo(a+w,b,a+w,b+h,r);x.arcTo(a+w,b+h,a,b+h,r);x.arcTo(a,b+h,a,b,r);x.arcTo(a,b,a+w,b,r);x.closePath()};
const css=n=>getComputedStyle(document.documentElement).getPropertyValue(n).trim();
let tok=0;
async function draw(){const my=++tok;const m=MIN[(S.min||"").trim().toLowerCase()],cv=$("cv"),x=cv.getContext("2d"),W=cv.width,H=cv.height;
  $("err").textContent=m||!S.min?"":"That mineral isn't in the list.";
  const rc=m?RC[m.r]||"#a3aab5":"#a3aab5",mut=MUTS.find(k=>k[0]===S.mod),mc=mut?mut[3]:null,acc=css("--accent")||"#14b8a6";
  const img=m?await getImg(m.ic):null;if(my!==tok)return;
  // background
  const g=x.createLinearGradient(0,0,W,H);g.addColorStop(0,"#0c1017");g.addColorStop(1,"#151b26");x.fillStyle=g;x.fillRect(0,0,W,H);
  const rg=x.createRadialGradient(250,280,10,250,280,330);rg.addColorStop(0,rc+"55");rg.addColorStop(1,rc+"00");x.fillStyle=rg;x.fillRect(0,0,W,H);
  x.strokeStyle=rc+"aa";x.lineWidth=4;rr(x,10,10,W-20,H-20,26);x.stroke();
  if(img){const s=300,r=Math.min(s/img.width,s/img.height);x.imageSmoothingQuality="high";x.drawImage(img,250-img.width*r/2,280-img.height*r/2,img.width*r,img.height*r)}
  else{x.fillStyle="#ffffff22";x.font="600 120px 'Chakra Petch',sans-serif";x.textAlign="center";x.fillText("?",250,320);x.textAlign="left"}
  const X0=500;let y=110;
  x.font="600 22px 'IBM Plex Sans',sans-serif";const tag=m?m.r.toUpperCase():"MINERAL";
  const pill=(t,c,px)=>{const w=x.measureText(t).width+32;x.fillStyle=c+"33";rr(x,px,y-28,w,40,20);x.fill();x.strokeStyle=c;x.lineWidth=2;x.stroke();x.fillStyle=c;x.fillText(t,px+16,y);return px+w+12};
  let px=pill(tag,rc,X0);if(mut)pill(mut[0].toUpperCase(),mc,px);
  y+=82;x.fillStyle="#ffffff";x.font="700 64px 'Chakra Petch',sans-serif";let nm=m?m.n:"Pick a mineral";while(x.measureText(nm).width>W-X0-50&&nm.length>3)nm=nm.slice(0,-2)+"…";x.fillText(nm,X0,y);
  const kg=+S.kg;y+=70;x.font="700 46px 'IBM Plex Mono',monospace";x.fillStyle=rc;x.fillText(kg>0?kg.toLocaleString(undefined,{maximumFractionDigits:2})+" kg":"– kg",X0,y);
  // stats
  const L=Math.max(1,+S.luck||1),b=m?best(m,L):null,sell=mut?mut[1]:1,val=m&&kg>0?parseFloat(String(m.v).replace(/[^0-9.]/g,""))*kg*sell:NaN;
  const mOdds=mut&&mut[2]>0?1/mut[2]:mut?0:1,comb=b&&mOdds?b.e*mOdds:0;
  const stat=(lab,v,yy)=>{x.fillStyle="#9aa4b2";x.font="600 18px 'IBM Plex Sans',sans-serif";x.fillText(lab.toUpperCase(),X0,yy);x.fillStyle="#ffffff";x.font="600 30px 'IBM Plex Mono',monospace";x.fillText(v,X0,yy+38)};
  y+=60;stat("Sells for",money(val),y);
  const oneIn=e=>e>0?"1 in "+Math.round(1/e).toLocaleString():"–";
  stat("Odds",comb?oneIn(comb):b?oneIn(b.e)+(mut?" + modifier":""):"–",y+100);
  x.fillStyle="#9aa4b2";x.font="500 17px 'IBM Plex Sans',sans-serif";
  if(b)x.fillText(`in ${b.z} at ${L.toLocaleString()} luck${mut&&mut[2]>0?", modifier at 1× boost":""}`,X0,y+168);
  if(S.who){x.font="600 20px 'IBM Plex Sans',sans-serif";x.fillStyle=acc;x.textAlign="center";x.fillText("Found by "+S.who,250,500);x.textAlign="left"}
}
[["min","input"],["kg","input"],["mod","change"],["luck","input"],["who","input"]].forEach(([k,ev])=>{$(k).value=S[k]||"";$(k).addEventListener(ev,()=>{S[k]=$(k).value;save();draw()})});
if(!$("mod").value)$("mod").value="None";
$("save").onclick=()=>ptSaveImg((S.min||"Find")+" card",()=>new Promise(r=>$("cv").toBlob(r,"image/png")));
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(draw);draw();
})();
