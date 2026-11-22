(()=>{
const $=id=>document.getElementById(id);
let S={luck:1000,cap:1000,pick:.1,mbp:100,night:false,bw:.2,sb:1476,wcap:7240,mag:false};try{Object.assign(S,JSON.parse(localStorage.getItem("pmc-s")||"{}"))}catch(e){}
const save=()=>{try{localStorage.setItem("pmc-s",JSON.stringify(S))}catch(e){}};
const p=(x,d)=>{if(!isFinite(x))return"–";const v=x*100;return(v>=10?v.toFixed(1):v>=1?v.toFixed(2):v.toPrecision(2))+"%"};
const oneIn=x=>x>0?"1 in "+Math.round(1/x).toLocaleString():"–";
// luck: 29% roll once, 3% about luck/23 times, 19% about 0.41 x luck, 49% about 1.74 x luck, keeping the rarest; base odds 1 in ~18M to ~1.5B get up to x1.86
const eff=(b,L)=>{L=Math.max(1,L);const f=l=>1-Math.pow(1-b,l);return (.2891*f(1)+.0280*f(Math.max(1,.04317*L))+.1905*f(Math.max(1,.40579*L))+.4924*f(Math.max(1,1.74153*L)))*(typeof rareBand==="function"?rareBand(1/b):1)};
const MODW=[["Perfect",.0001],["Lunar",.00025],["Mutated",.001],["Cosmic",.005],["Iridescent",.02],["Irradiated",.1],["Scorching",.25],["Glowing",.5],["Pure",.8],["Shiny",1]];
function modShares(mbx,night,luck){const list=MODW.filter(([k])=>night||k!=="Lunar"),tot=list.reduce((a,x)=>a+x[1],0);
  const f=N=>{let a=0;const o={};list.forEach(([k,w])=>{const q=w/tot;o[k]=Math.pow(1-a,N)-Math.pow(Math.max(0,1-a-q),N);a+=q});return o};
  const L=Math.max(1,11.662*Math.pow(Math.max(0,mbx),.838)+1.96352*Math.max(0,luck||0)/1000),pt=[f(1),f(Math.max(1,L*.172)),f(L)],s={};
  list.forEach(([k])=>s[k]=.313*pt[0][k]+.127*pt[1][k]+.559*pt[2][k]);return{s,list,tot}}
function render(){
  ["luck","luck2"].forEach(id=>{const e=$(id);if(e&&document.activeElement!==e&&e.value!==String(S.luck))e.value=S.luck});
  const L=Math.max(1,+S.luck||1);
  $("luckT").innerHTML="<tr><th>Listed chance</th><th>At your luck</th><th>Change</th></tr>"+[.2,.05,.01,.001,.0001,.00001].map(b=>{const e=eff(b,L);return`<tr><td>${p(b)} (${oneIn(b)})</td><td>${p(e)} (${oneIn(e)})</td><td>${(e/b).toFixed(e/b>=100?0:1)}×</td></tr>`}).join("");
  const c=Math.max(1,+S.cap||1),q=Math.min(1,Math.max(0,(+S.pick||0)/100)),n=panItems(c),per=1-Math.pow(1-q,n);
  $("capOut").innerHTML=`Between <b>${Math.round(.5*Math.sqrt(c))}</b> and <b>${Math.round(2.5*Math.sqrt(c))}</b> minerals per pan, <b>${n.toFixed(1)}</b> on average, so a ${p(q)} chance per mineral comes up in <b>${p(per)}</b> of pans (${oneIn(per)}).`;
  {const g=x=>Math.pow(1+1000/x,.565)-1,L2=Math.max(1,+S.luck||1);$("capG").innerHTML=capGraph(c,g);
   $("capVs").innerHTML=`At <b>${Math.round(c).toLocaleString()}</b> capacity, the next +1,000 gives <b>${(g(c)*100).toFixed(c<3000?1:2)}%</b> more minerals per pan. With <b>${Math.round(L2).toLocaleString()}</b> luck, 1 capacity is worth about <b>${(.565*L2/c).toFixed(.565*L2/c<10?2:0)}</b> luck, and 1 luck about <b>${(c/(.565*L2)).toFixed(c/(.565*L2)<10?2:0)}</b> capacity.`}
  const B=Math.max(0,+S.bw||0),SB=Math.max(0,+S.sb||0)/100,M=(S.mag?1.5:1)*zoneSize(S.wz),wm=wtModel(Math.max(1,+S.wcap||1)),base=B*(1+SB)*M,kg=v=>v>=100?v.toFixed(1)+" kg":v.toFixed(2)+" kg";
  $("wOut").innerHTML=B>0?`Lightest <b>${kg(base*.75)}</b> · half come out heavier than <b>${kg(base*wm.q(.5))}</b> · heaviest <b>${kg(base*15.5)}</b>`:"";
  const {s,list,tot}=modShares((+S.mbp||0)/100,S.night,L),mx=Math.max(...Object.values(s));
  $("modT").innerHTML="<tr><th>Modifier</th><th>With no boost</th><th>At your boost</th><th class='bw'></th></tr>"+[...list].reverse().map(([k,w])=>`<tr><td>${k}</td><td>${p(w/tot)}</td><td>${p(s[k])}</td><td class="bw"><div class="bar" style="width:${(s[k]/mx*100).toFixed(1)}%"></div></td></tr>`).join("")+`<tr><td colspan="4" style="font-family:var(--f-body);text-align:left;color:var(--muted)">Shares are of modified minerals. Of everything you pan, multiply by the share that gets a modifier (about ${p(1-Math.pow(.937,(+S.mbp||0)/100))} at your boost).</td></tr>`;
}
[["luck","luck"],["luck2","luck"],["cap","cap"],["pick","pick"],["mb","mbp"],["bw","bw"],["sb","sb"],["wcap","wcap"]].forEach(([id,k])=>{$(id).value=S[k];$(id).addEventListener("input",()=>{S[k]=$(id).value;save();render()})});
$("wz").innerHTML=zoneSizeOpts(S.wz||"");$("wz").onchange=()=>{S.wz=$("wz").value;save();render()};$("mag").checked=!!S.mag;$("mag").onchange=()=>{S.mag=$("mag").checked;save();render()};
$("night").checked=!!S.night;$("night").onchange=()=>{S.night=$("night").checked;save();render()};
render();
})();

// next +1,000 capacity: % more minerals per pan, from 1,000 up to a bit past your capacity
function capGraph(c,g){const W=640,H=230,L=46,R=14,T=14,B=34,x0=1000,x1=Math.max(32000,Math.ceil(c*1.25/4000)*4000),y1=Math.ceil(g(x0)*100/10)*10;
  const xs=x=>L+(x-x0)/(x1-x0)*(W-L-R),ys=y=>T+(1-y/y1)*(H-T-B);let d="";for(let i=0;i<=160;i++){const x=x0+(x1-x0)*i/160;d+=(i?"L":"M")+xs(x).toFixed(1)+","+ys(g(x)*100).toFixed(1)}
  const xt=[];const st=x1<=32000?4000:x1<=80000?10000:25000;for(let x=Math.ceil(x0/st)*st;x<=x1;x+=st)xt.push(x);if(xt[0]!==x0)xt.unshift(x0);
  const yt=[0,y1/4,y1/2,3*y1/4,y1];const k=v=>v>=1000?(v/1000)+"k":String(v);const cx=Math.min(x1,Math.max(x0,c)),cy=g(cx)*100;
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Extra minerals per pan from the next 1,000 capacity, at each capacity">
  ${yt.map(y=>`<line class="gl" x1="${L}" x2="${W-R}" y1="${ys(y)}" y2="${ys(y)}"/><text class="tk" x="${L-6}" y="${ys(y)+4}" text-anchor="end">${+y.toFixed(1)}%</text>`).join("")}
  ${xt.map(x=>`<text class="tk" x="${xs(x)}" y="${H-B+16}" text-anchor="middle">${k(x)}</text>`).join("")}
  <text class="tk" x="${(L+W-R)/2}" y="${H-4}" text-anchor="middle">Capacity</text>
  <path class="ln" d="${d}"/>${c>=x0?`<circle class="dot" cx="${xs(cx)}" cy="${ys(cy)}" r="5"/><text class="dl" x="${xs(cx)+(xs(cx)>W-120?-9:9)}" y="${ys(cy)-9}" text-anchor="${xs(cx)>W-120?"end":"start"}">+${cy.toFixed(cy<3?2:1)}%</text>`:""}</svg>`}
