(()=>{
const $=id=>document.getElementById(id);
const F=["luck","cap","dstr","dspd","sstr","sspd","dly","fix"];
let S=Object.fromEntries(F.map(k=>[k,""]));try{Object.assign(S,JSON.parse(localStorage.getItem("rpm-s")||"{}"))}catch(e){}
const save=()=>{try{localStorage.setItem("rpm-s",JSON.stringify(S))}catch(e){}};
const num=k=>{const v=parseFloat(S[k]);return isFinite(v)?v:NaN};
// community-tested timing: seconds per dig and shakes per second, speeds in percent
const digT=x=>143.9*Math.pow(x,-0.9324),shakeRate=x=>23.514*x/(442.88+x);
function model(b){
  // a pan never takes more digs or shakes than its capacity, however weak the shovel or pan
  const items=panItems(b.cap),digs=Math.min(Math.ceil(b.cap),Math.ceil(b.cap/b.dstr)),shakes=Math.min(Math.ceil(b.cap),Math.ceil(b.cap/b.sstr));
  const td=digT(b.dspd)+b.dly,sr=shakeRate(b.sspd),dT=digs*td,sT=shakes/sr,T=dT+sT+b.fix;
  return {items,digs,shakes,td,sr,dT,sT,T,ppm:60/T,mpm:items*60/T,rpp:b.luck*items,rpm:b.luck*items*60/T};
}
const big=v=>v>=1e9?fmt(v/1e9,2)+"B":v>=1e6?fmt(v/1e6,2)+"M":v>=1e4?fmt(v/1e3,1)+"k":fmt(v,0);
const sec=v=>v<10?fmt(v,2)+" s":v<120?fmt(v,1)+" s":fmt(v/60,1)+" min";
const tile=(l,v,s)=>`<div class="tile"><span class="l">${l}</span><span class="v">${v}</span>${s?`<span class="s">${s}</span>`:""}</div>`;
function read(){const b={luck:num("luck"),cap:num("cap"),dstr:num("dstr"),dspd:num("dspd"),sstr:num("sstr"),sspd:num("sspd"),dly:num("dly"),fix:num("fix")};
  if(!isFinite(b.dly))b.dly=0;if(!isFinite(b.fix))b.fix=1.15;if(!isFinite(b.luck))b.luck=1;return b}
function ready(b){return b.cap>0&&b.dstr>0&&b.dspd>0&&b.sstr>0&&b.sspd>0}
function render(){
  const b=read(),ok=ready(b),part=!ok&&b.cap>0;$("out").hidden=!ok&&!part;$("gainCard").hidden=!ok;$("steps").hidden=!ok;
  if(part){const items=panItems(b.cap),miss=[["dstr","Dig Strength"],["dspd","Dig Speed"],["sstr","Shake Strength"],["sspd","Shake Speed"]].filter(([k])=>!(num(k)>0)).map(x=>x[1]);
    $("tiles").innerHTML=tile("Rolls per pan",num("luck")>0?big(b.luck*items):"–",num("luck")>0?"luck × minerals per pan":"type your luck for rolls")+tile("Minerals per pan",fmt(items,0));
    $("warn").textContent="Add "+miss.join(", ").replace(/, ([^,]*)$/," and $1")+" for per-minute numbers.";$("warn").hidden=false}
  if(ok){const m=model(b);
    $("tiles").innerHTML=tile("Rolls per minute",big(m.rpm),num("luck")>0?"luck × minerals per minute":"type your luck for rolls")+tile("Rolls per pan",big(m.rpp))+tile("Minerals per minute",fmt(m.mpm,0))+tile("Minerals per pan",fmt(m.items,0))+tile("Pans per minute",fmt(m.ppm,2))+tile("Time per pan",sec(m.T));
    $("steps").innerHTML=`<table class="t r"><tr><th>Step</th><th>Count</th><th>Each</th><th>Total</th><th>Share</th></tr>
      <tr><td>Digging</td><td>${fmt(m.digs,0)} digs</td><td>${sec(m.td)}</td><td>${sec(m.dT)}</td><td>${fmt(100*m.dT/m.T,0)}%</td></tr>
      <tr><td>Shaking</td><td>${fmt(m.shakes,0)} shakes</td><td>${fmt(m.sr,1)} per s</td><td>${sec(m.sT)}</td><td>${fmt(100*m.sT/m.T,0)}%</td></tr>
      <tr><td>Fixed</td><td></td><td></td><td>${sec(b.fix)}</td><td>${fmt(100*b.fix/m.T,0)}%</td></tr>
      <tr><td><b>Whole pan</b></td><td></td><td></td><td><b>${sec(m.T)}</b></td><td>100%</td></tr></table>`;
    const w=[];if(b.dspd>650)w.push("Dig Speed above about 600% hasn't been tested, so dig time may be shorter here than in game.");if(m.shakes>10)w.push(`This pan needs ${fmt(m.shakes,0)} shakes; the shake test was at 6 per pan, so shaking may take longer.`);
    $("warn").textContent=w.join(" ");$("warn").hidden=!w.length;
    const G=[["Capacity","cap"],["Dig Strength","dstr"],["Dig Speed","dspd"],["Shake Strength","sstr"],["Shake Speed","sspd"]].map(([n,k])=>{const c={...b};c[k]=b[k]*1.1;const r=model(c);return {n,v:r.rpm,p:r.rpm/m.rpm-1,ppm:r.ppm}});
    const best=Math.max(...G.map(g=>g.p));
    $("gain").innerHTML=`<table class="t r"><tr><th>+10% of</th><th>Rolls per minute</th><th>Change</th><th>Pans per minute</th></tr>${G.sort((a,c)=>c.p-a.p).map(g=>`<tr${g.p===best&&best>0?' class="best"':""}><td>${g.n}</td><td>${big(g.v)}</td><td>${g.p>=0?"+":""}${fmt(100*g.p,1)}%</td><td>${fmt(g.ppm,2)}</td></tr>`).join("")}</table>`;
  }
  const SP=[100,150,200,250,300,400,500,600,800,1000,1250,1500,2000];
  $("speedTab").innerHTML=`<table class="t r"><tr><th>Speed</th><th>Time per dig</th><th>Shakes per second</th></tr>${SP.map(x=>`<tr${ok&&(Math.abs(x-b.dspd)<x*.08||Math.abs(x-b.sspd)<x*.08)?' class="best"':""}><td>${x}%</td><td>${fmt(digT(x),2)} s${x>650?" *":""}</td><td>${fmt(shakeRate(x),1)}</td></tr>`).join("")}</table><p class="hint">* Not tested above about 600% Dig Speed.</p>`;
}
F.forEach(k=>{$(k).value=S[k];$(k).addEventListener("input",e=>{S[k]=e.target.value;save();render()})});
$("fromCalc").onclick=async()=>{let t=null;try{t=await window.parent.ptGetTotals()}catch(e){}if(!t)return;
  const map={luck:"Luck",cap:"Capacity",dstr:"Dig Strength",dspd:"Dig Speed",sstr:"Shake Strength",sspd:"Shake Speed"};
  Object.entries(map).forEach(([k,n])=>{if(t[n]!=null){S[k]=String(Math.round(t[n]*100)/100);$(k).value=S[k]}});save();render()};
ptPageButtons($("acts"),()=>"Rolls per minute",()=>{const r=ptPageRead($("oh"),[{h:"",el:$("steps")},{h:"What speeds it up most",el:$("gain")}]);r.title="Rolls per minute";
  const b=read();r.sub=[`Luck ${fmt(b.luck,0)}`,`Capacity ${fmt(b.cap,0)}`,`Dig ${fmt(b.dstr,0)} at ${fmt(b.dspd,0)}%`,`Shake ${fmt(b.sstr,1)} at ${fmt(b.sspd,0)}%`];return r});
render();
})();
