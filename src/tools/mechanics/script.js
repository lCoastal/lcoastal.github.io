(()=>{
const $=id=>document.getElementById(id);
let S={luck:1000,cap:1000,pick:.1,mb:1,night:false};try{Object.assign(S,JSON.parse(localStorage.getItem("pmc-s")||"{}"))}catch(e){}
const save=()=>{try{localStorage.setItem("pmc-s",JSON.stringify(S))}catch(e){}};
const p=(x,d)=>{if(!isFinite(x))return"–";const v=x*100;return(v>=10?v.toFixed(1):v>=1?v.toFixed(2):v.toPrecision(2))+"%"};
const oneIn=x=>x>0?"1 in "+Math.round(1/x).toLocaleString():"–";
// luck: a quarter roll once, a quarter luck/2 times, half luck times, keeping the rarest
const eff=(b,L)=>{L=Math.max(1,L);const f=l=>1-Math.pow(1-b,l);return .25*f(1)+.25*f(Math.max(1,L/2))+.5*f(L)};
const MODW=[["Perfect",.0001],["Lunar",.00025],["Mutated",.001],["Cosmic",.005],["Iridescent",.02],["Irradiated",.1],["Scorching",.25],["Glowing",.5],["Pure",.8],["Shiny",1]];
function modShares(mbx,night,luck){const list=MODW.filter(([k])=>night||k!=="Lunar"),tot=list.reduce((a,x)=>a+x[1],0);
  const f=N=>{let a=0;const o={};list.forEach(([k,w])=>{const q=w/tot;o[k]=Math.pow(1-a,N)-Math.pow(Math.max(0,1-a-q),N);a+=q});return o};
  const L=Math.max(1,10.12*Math.max(0,mbx)+Math.max(0,luck||0)/1000),pt=[f(1),f(Math.max(1,L/2)),f(L)],s={};
  list.forEach(([k])=>s[k]=.338*pt[0][k]+.268*pt[1][k]+.394*pt[2][k]);return{s,list,tot}}
function render(){
  const L=Math.max(1,+S.luck||1);
  $("luckT").innerHTML="<tr><th>Listed chance</th><th>At your luck</th><th>Change</th></tr>"+[.2,.05,.01,.001,.0001,.00001].map(b=>{const e=eff(b,L);return`<tr><td>${p(b)} (${oneIn(b)})</td><td>${p(e)} (${oneIn(e)})</td><td>${(e/b).toFixed(e/b>=100?0:1)}×</td></tr>`}).join("");
  const c=Math.max(1,+S.cap||1),q=Math.min(1,Math.max(0,(+S.pick||0)/100)),n=Math.sqrt(c),per=1-Math.pow(1-q,n);
  $("capOut").innerHTML=`About <b>${n.toFixed(1)}</b> picks per pan, so a ${p(q)} pick comes up in <b>${p(per)}</b> of pans (${oneIn(per)}).`;
  const {s,list,tot}=modShares(+S.mb||0,S.night,L),mx=Math.max(...Object.values(s));
  $("modT").innerHTML="<tr><th>Modifier</th><th>With no boost</th><th>At your boost</th><th class='bw'></th></tr>"+[...list].reverse().map(([k,w])=>`<tr><td>${k}</td><td>${p(w/tot)}</td><td>${p(s[k])}</td><td class="bw"><div class="bar" style="width:${(s[k]/mx*100).toFixed(1)}%"></div></td></tr>`).join("")+`<tr><td colspan="4" style="font-family:var(--f-body);text-align:left;color:var(--muted)">Shares are of modified minerals. Of everything you pan, multiply by 36%.</td></tr>`;
}
[["luck","luck"],["cap","cap"],["pick","pick"],["mb","mb"]].forEach(([id,k])=>{$(id).value=S[k];$(id).addEventListener("input",()=>{S[k]=$(id).value;save();render()})});
$("night").checked=!!S.night;$("night").onchange=()=>{S.night=$("night").checked;save();render()};
render();
})();
