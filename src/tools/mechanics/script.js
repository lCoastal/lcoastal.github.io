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
  const L=Math.max(1,+S.luck||1);
  $("luckT").innerHTML="<tr><th>Listed chance</th><th>At your luck</th><th>Change</th></tr>"+[.2,.05,.01,.001,.0001,.00001].map(b=>{const e=eff(b,L);return`<tr><td>${p(b)} (${oneIn(b)})</td><td>${p(e)} (${oneIn(e)})</td><td>${(e/b).toFixed(e/b>=100?0:1)}×</td></tr>`}).join("");
  const c=Math.max(1,+S.cap||1),q=Math.min(1,Math.max(0,(+S.pick||0)/100)),n=panItems(c),per=1-Math.pow(1-q,n);
  $("capOut").innerHTML=`Between <b>${Math.round(.5*Math.sqrt(c))}</b> and <b>${Math.round(2.5*Math.sqrt(c))}</b> minerals per pan, <b>${n.toFixed(1)}</b> on average, so a ${p(q)} chance per mineral comes up in <b>${p(per)}</b> of pans (${oneIn(per)}).`;
  const B=Math.max(0,+S.bw||0),SB=Math.max(0,+S.sb||0)/100,M=(S.mag?1.5:1)*zoneSize(S.wz),wm=wtModel(Math.max(1,+S.wcap||1)),base=B*(1+SB)*M,kg=v=>v>=100?v.toFixed(1)+" kg":v.toFixed(2)+" kg";
  $("wOut").innerHTML=B>0?`Lightest <b>${kg(base*.75)}</b> · half come out heavier than <b>${kg(base*wm.q(.5))}</b> · heaviest <b>${kg(base*15.5)}</b>`:"";
  const {s,list,tot}=modShares((+S.mbp||0)/100,S.night,L),mx=Math.max(...Object.values(s));
  $("modT").innerHTML="<tr><th>Modifier</th><th>With no boost</th><th>At your boost</th><th class='bw'></th></tr>"+[...list].reverse().map(([k,w])=>`<tr><td>${k}</td><td>${p(w/tot)}</td><td>${p(s[k])}</td><td class="bw"><div class="bar" style="width:${(s[k]/mx*100).toFixed(1)}%"></div></td></tr>`).join("")+`<tr><td colspan="4" style="font-family:var(--f-body);text-align:left;color:var(--muted)">Shares are of modified minerals. Of everything you pan, multiply by the share that gets a modifier (about ${p(1-Math.pow(.937,(+S.mbp||0)/100))} at your boost).</td></tr>`;
}
[["luck","luck"],["cap","cap"],["pick","pick"],["mb","mbp"],["bw","bw"],["sb","sb"],["wcap","wcap"]].forEach(([id,k])=>{$(id).value=S[k];$(id).addEventListener("input",()=>{S[k]=$(id).value;save();render()})});
$("wz").innerHTML=zoneSizeOpts(S.wz||"");$("wz").onchange=()=>{S.wz=$("wz").value;save();render()};$("mag").checked=!!S.mag;$("mag").onchange=()=>{S.mag=$("mag").checked;save();render()};
$("night").checked=!!S.night;$("night").onchange=()=>{S.night=$("night").checked;save();render()};
render();
})();
