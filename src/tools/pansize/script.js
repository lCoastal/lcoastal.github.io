(()=>{
const $=id=>document.getElementById(id);
let S={cap:"",want:"",dv:"rows"};try{Object.assign(S,JSON.parse(localStorage.getItem("ps-s")||"{}"))}catch(e){}
const youPush=ptYouLink(S,{cap:"cap"},()=>{$("cap").value=S.cap;render()});
const save=()=>{try{localStorage.setItem("ps-s",JSON.stringify(S))}catch(e){}youPush()};
ptPageButtons($("acts"),()=>"Pan size "+(S.cap||""),()=>{const r=ptPageRead(null,[{h:"Minerals per pan",el:$("sum")},{h:"Capacity you need for "+(S.want||"")+" minerals",el:$("need")}]);r.title="Pan size";if(CHART&&!$("distCard").hidden)r.chart=CHART;r.sub=[+S.cap>0?"Capacity "+Number(S.cap).toLocaleString("en-US"):"Any capacity"];return r},"Estimates from a fitted model, so real results can differ.");
// fewest = ½√C, average = 0.678·C^0.565 (shared panItems), most ≈ 2.5√C
const lo=C=>Math.floor(.5*Math.sqrt(C)),hi=C=>2.5*Math.sqrt(C);
// how common each pan size is: share of logged full pans (14,306 pans, capacity 5,600-10,500) by minerals ÷ √capacity,
// in steps of 0.05 starting at 0.45. Turned back into mineral counts for the capacity you type.
const SHAPE=[0.17,1.84,2.8,3.24,3.45,3.21,3.46,3.6,3.9,4.35,4.1,4.15,4.05,4.4,4.56,4.1,4.73,4.41,4.75,4.33,4.57,3.43,2.61,2.11,1.85,1.6,1.36,1.27,1.1,1.11,0.82,0.8,0.79,0.69,0.5,0.38,0.43,0.37,0.29,0.18,0.13,0.01];
const SH0=.45,SHW=.05;let CHART=null;
function shareOf(x0,x1){let t=0;SHAPE.forEach((v,i)=>{const a=SH0+i*SHW,b=a+SHW,o=Math.min(b,x1)-Math.max(a,x0);if(o>0)t+=v*o/SHW});return t}
function dist(C,n){const r=Math.sqrt(C),a=lo(C),b=Math.round(hi(C)),step=Math.max(1,Math.ceil((b-a+1)/(n||14))),rows=[];
  for(let s=a;s<=b;s+=step){const e=Math.min(b,s+step-1);rows.push({s,e,p:shareOf(s/r,(e+1)/r)})}
  const tot=rows.reduce((t,x)=>t+x.p,0)||1;rows.forEach(x=>x.p=x.p/tot*100);return rows}
const n0=v=>fmt(Math.round(v),0);
document.querySelectorAll("[data-dv]").forEach(b=>b.addEventListener("click",()=>{S.dv=b.dataset.dv;save();render()}));
["cap","want"].forEach(k=>{$(k).value=S[k];$(k).addEventListener("input",e=>{S[k]=e.target.value;save();render()})});
$("fromCalc").onclick=async()=>{let t=null;try{t=await window.parent.ptGetTotals()}catch(e){}if(!t||!t.Capacity)return;S.cap=String(Math.round(t.Capacity));$("cap").value=S.cap;save();render()};
// the chart: in minerals for your capacity, or in multiples of √capacity when no capacity is typed
function drawDist(C){const pc=p=>p<.1&&p>0?"<0.1":fmt(p,1),H0="How common each pan size is";
  const row=(l,p,w,on)=>`<div class="dr${on?" avg":""}"><span class="dl">${l}</span><span class="db"><i style="width:${w.toFixed(1)}%"></i></span><span class="dp">${pc(p)}%</span></div>`;
  const dv=["rows","cols","atleast"].includes(S.dv)?S.dv:"rows";
  document.querySelectorAll("[data-dv]").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.dv===dv)));
  $("distCard").hidden=false;
  if(!(C>0)){universal(dv,pc,row,H0);return}
  const m=panItems(C);
  $("distHint").textContent=dv==="atleast"?"Your chance that a full pan gives at least this many minerals.":dv==="cols"?"Each column is a range of pan sizes; taller means more common. Hover or tap a column for its numbers.":"Share of full pans that land in each range at your capacity. Most pans spread evenly over the lower part; the top end is rare.";
    const D=dist(C),mx=Math.max(...D.map(d=>d.p)),rng=d=>d.s===d.e?n0(d.s):n0(d.s)+"–"+n0(d.e);
    if(dv==="rows"){$("dist").innerHTML=D.map(d=>row(rng(d),d.p,d.p/mx*100,m>=d.s&&m<d.e+1)).join("");
      CHART={h:H0,kind:"rows",bars:D.map(d=>({l:rng(d),p:d.p,t:pc(d.p)+"%",on:m>=d.s&&m<d.e+1}))}}
    else if(dv==="atleast"){let left=100;const bars=[];$("dist").innerHTML=D.map(d=>{const v=Math.max(0,left),on=m>=d.s&&m<d.e+1;bars.push({l:"≥ "+n0(d.s),p:v,t:pc(v)+"%",on});const h=row("≥ "+n0(d.s),v,v,on);left-=d.p;return h}).join("");
      CHART={h:"Chance a pan gives at least",kind:"rows",bars}}
    else{const K=dist(C,30),km=Math.max(...K.map(d=>d.p)),ai=K.findIndex(d=>m>=d.s&&m<d.e+1);
      $("dist").innerHTML=`<div class="cols">${K.map((d,i)=>`<span class="cl${i===ai?" avg":""}" tabindex="0" title="${rng(d)} minerals: ${pc(d.p)}% of pans"><i style="height:${(d.p/km*100).toFixed(1)}%"></i></span>`).join("")}</div>
        <div class="cax"><span>${n0(K[0].s)}</span><span style="left:${((ai+.5)/K.length*100).toFixed(1)}%" class="mid">avg ${fmt(m,1)}</span><span class="r">${n0(K[K.length-1].e)}</span></div>
        <p class="hint ctip" id="ctip">&nbsp;</p>`;
      CHART={h:H0,kind:"cols",bars:K.map((d,i)=>({l:rng(d),p:d.p,t:pc(d.p)+"%",on:i===ai})),axis:[n0(K[0].s),"avg "+fmt(m,1),(ai+.5)/K.length,n0(K[K.length-1].e)]};
      $("dist").querySelectorAll(".cl").forEach(el=>{const show=()=>{$("ctip").textContent=el.title};el.addEventListener("mouseenter",show);el.addEventListener("focus",show);el.addEventListener("click",show)})}
    const t0=(D.find(d=>d.s>=2.2*Math.sqrt(C))||D[D.length-1]).s,top=D.filter(d=>d.s>=t0).reduce((t,d)=>t+d.p,0);
    $("distNote").textContent=`The highlighted ${dv==="cols"?"column":"row"} holds the average. About ${fmt(top,1)}% of pans reach ${n0(t0)} or more. From 14,306 logged pans at 5,600–10,500 capacity; at much lower or higher capacity the shape is a best guess.`;CHART.note=$("distNote").textContent}
// no capacity typed: the measured shape itself, as multiples of √capacity (works for any capacity)
function universal(dv,pc,row,H0){const B=SHAPE.slice();B[1]+=B[0];B[B.length-2]+=B[B.length-1];const K=B.slice(1,-1).map((p,i)=>({a:.5+i*.05,p}));// 0.5 to 2.5, steps of 0.05
  const f2=v=>v.toFixed(2).replace(/0$/,""),R=[];for(let i=0;i<K.length;i+=2)R.push({a:K[i].a,b:K[i].a+.1,p:K[i].p+(K[i+1]?K[i+1].p:0)});
  const mx=Math.max(...R.map(d=>d.p)),U=" × √cap";
  $("distHint").textContent=(dv==="atleast"?"Your chance that a full pan gives at least this many minerals, ":dv==="cols"?"Taller columns are more common pan sizes, ":"Share of full pans in each range, ")+"shown as multiples of √capacity so it works for any capacity. Type your capacity above to see it in minerals.";
  if(dv==="rows"){$("dist").innerHTML=R.map(d=>row(f2(d.a)+"–"+f2(d.b)+"×",d.p,d.p/mx*100,false)).join("");
    CHART={h:H0+" (any capacity)",kind:"rows",bars:R.map(d=>({l:f2(d.a)+"–"+f2(d.b)+U,p:d.p,t:pc(d.p)+"%"}))}}
  else if(dv==="atleast"){let left=100;const bars=[];$("dist").innerHTML=R.map(d=>{const v=Math.max(0,left);bars.push({l:"≥ "+f2(d.a)+U,p:v,t:pc(v)+"%"});const h=row("≥ "+f2(d.a)+"×",v,v,false);left-=d.p;return h}).join("");
    CHART={h:"Chance a pan gives at least (any capacity)",kind:"rows",bars}}
  else{const km=Math.max(...K.map(d=>d.p));
    $("dist").innerHTML=`<div class="cols">${K.map(d=>`<span class="cl" tabindex="0" title="${f2(d.a)}–${f2(d.a+.05)} × √capacity: ${pc(d.p)}% of pans"><i style="height:${(d.p/km*100).toFixed(1)}%"></i></span>`).join("")}</div>
      <div class="cax"><span>0.5×</span><span style="left:50%" class="mid">1.5×</span><span class="r">2.5× √cap</span></div>
      <p class="hint ctip" id="ctip">&nbsp;</p>`;
    CHART={h:H0+" (any capacity)",kind:"cols",bars:K.map(d=>({l:f2(d.a),p:d.p,t:pc(d.p)+"%"})),axis:["0.5 × √cap","1.5 × √cap",.5,"2.5 × √cap"]};
    $("dist").querySelectorAll(".cl").forEach(el=>{const show=()=>{$("ctip").textContent=el.title};el.addEventListener("mouseenter",show);el.addEventListener("focus",show);el.addEventListener("click",show)})}
  const top=R.filter(d=>d.a>=2.19).reduce((t,d)=>t+d.p,0);
  $("distNote").textContent=`Multiply by √capacity to get minerals: at 8,000 capacity √capacity is about 89, so 1× is 89 minerals and 2.5× is 224. About ${fmt(top,1)}% of pans reach 2.2× or more. From 14,306 logged pans at 5,600–10,500 capacity.`;CHART.note=$("distNote").textContent}
function render(){const C=+S.cap||0;$("out").hidden=!(C>0);
  if(C>0){const a=lo(C),m=panItems(C),b=hi(C);
    const tile=(l,v,s,c)=>`<div${c?` class="${c}"`:""}><span class="lab">${l}</span><b>${v}</b>${s?`<small>${s}</small>`:""}</div>`;
    $("sum").innerHTML=tile("Fewest",n0(a),"½ × √capacity, rounded down")+tile("Average",fmt(m,1),"what you get over many pans","avg")+tile("Most",n0(b),"about 2.5 × √capacity");
    const x=v=>((v-a)/(b-a)*100).toFixed(1);
    $("range").innerHTML=`<div class="track"></div><div class="mk" style="left:0"></div><div class="mk" style="left:${x(m)}%"></div><div class="mk" style="left:calc(100% - 2px)"></div>
      <span class="lb l" style="left:0">${n0(a)}</span><span class="lb" style="left:${x(m)}%">avg ${fmt(m,1)}</span><span class="lb r" style="left:100%">${n0(b)}</span>`;
  }
  drawDist(C);
  const n=+S.want||0;
  if(n>0){const avg=Math.pow(n/0.6779,1/0.56474),can=Math.pow(n/2.5,2),always=Math.pow(2*n,2);
    const tile=(l,v,s,c)=>`<div${c?` class="${c}"`:""}><span class="lab">${l}</span><b>${v}</b>${s?`<small>${s}</small>`:""}</div>`;
    $("need").innerHTML=tile("Possible at all",n0(can),"capacity where the best pans reach it")+tile("On average",n0(avg),"capacity to average it","avg")+tile("Every pan",n0(always),"capacity where even the fewest reach it")}
  else $("need").innerHTML=""}
render();
})();
