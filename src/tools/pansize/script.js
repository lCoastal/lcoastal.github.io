(()=>{
const $=id=>document.getElementById(id);
let S={cap:"",want:""};try{Object.assign(S,JSON.parse(localStorage.getItem("ps-s")||"{}"))}catch(e){}
const youPush=ptYouLink(S,{cap:"cap"},()=>{$("cap").value=S.cap;render()});
const save=()=>{try{localStorage.setItem("ps-s",JSON.stringify(S))}catch(e){}youPush()};
ptPageButtons($("acts"),()=>"Pan size "+(S.cap||""),()=>{const r=ptPageRead(null,[{h:"Minerals per pan",el:$("sum")},{h:"Capacity you need for "+(S.want||"")+" minerals",el:$("need")}]);r.title="Pan size";r.sub=["Capacity "+Number(S.cap||0).toLocaleString("en-US")];return r},"Estimates from a fitted model, so real results can differ.");
// fewest = ½√C, average = 0.678·C^0.565 (shared panItems), most ≈ 2.5√C
const lo=C=>Math.floor(.5*Math.sqrt(C)),hi=C=>2.5*Math.sqrt(C);
// how common each pan size is: share of logged full pans (14,306 pans, capacity 5,600-10,500) by minerals ÷ √capacity,
// in steps of 0.05 starting at 0.45. Turned back into mineral counts for the capacity you type.
const SHAPE=[0.17,1.84,2.8,3.24,3.45,3.21,3.46,3.6,3.9,4.35,4.1,4.15,4.05,4.4,4.56,4.1,4.73,4.41,4.75,4.33,4.57,3.43,2.61,2.11,1.85,1.6,1.36,1.27,1.1,1.11,0.82,0.8,0.79,0.69,0.5,0.38,0.43,0.37,0.29,0.18,0.13,0.01];
const SH0=.45,SHW=.05;
function shareOf(x0,x1){let t=0;SHAPE.forEach((v,i)=>{const a=SH0+i*SHW,b=a+SHW,o=Math.min(b,x1)-Math.max(a,x0);if(o>0)t+=v*o/SHW});return t}
function dist(C){const r=Math.sqrt(C),a=lo(C),b=Math.round(hi(C)),step=Math.max(1,Math.ceil((b-a+1)/14)),rows=[];
  for(let s=a;s<=b;s+=step){const e=Math.min(b,s+step-1);rows.push({s,e,p:shareOf(s/r,(e+1)/r)})}
  const tot=rows.reduce((t,x)=>t+x.p,0)||1;rows.forEach(x=>x.p=x.p/tot*100);return rows}
const n0=v=>fmt(Math.round(v),0);
["cap","want"].forEach(k=>{$(k).value=S[k];$(k).addEventListener("input",e=>{S[k]=e.target.value;save();render()})});
$("fromCalc").onclick=async()=>{let t=null;try{t=await window.parent.ptGetTotals()}catch(e){}if(!t||!t.Capacity)return;S.cap=String(Math.round(t.Capacity));$("cap").value=S.cap;save();render()};
function render(){const C=+S.cap||0;$("out").hidden=!(C>0);
  if(C>0){const a=lo(C),m=panItems(C),b=hi(C);
    const tile=(l,v,s,c)=>`<div${c?` class="${c}"`:""}><span class="lab">${l}</span><b>${v}</b>${s?`<small>${s}</small>`:""}</div>`;
    $("sum").innerHTML=tile("Fewest",n0(a),"½ × √capacity, rounded down")+tile("Average",fmt(m,1),"what you get over many pans","avg")+tile("Most",n0(b),"about 2.5 × √capacity");
    const x=v=>((v-a)/(b-a)*100).toFixed(1);
    $("range").innerHTML=`<div class="track"></div><div class="mk" style="left:0"></div><div class="mk" style="left:${x(m)}%"></div><div class="mk" style="left:calc(100% - 2px)"></div>
      <span class="lb l" style="left:0">${n0(a)}</span><span class="lb" style="left:${x(m)}%">avg ${fmt(m,1)}</span><span class="lb r" style="left:100%">${n0(b)}</span>`;
    const D=dist(C),mx=Math.max(...D.map(d=>d.p));
    $("dist").innerHTML=D.map(d=>{const has=m>=d.s&&m<d.e+1;return `<div class="dr${has?" avg":""}"><span class="dl">${d.s===d.e?n0(d.s):n0(d.s)+"–"+n0(d.e)}</span><span class="db"><i style="width:${(d.p/mx*100).toFixed(1)}%"></i></span><span class="dp">${d.p<.1&&d.p>0?"<0.1":fmt(d.p,1)}%</span></div>`}).join("");
    const t0=(D.find(d=>d.s>=2.2*Math.sqrt(C))||D[D.length-1]).s,top=D.filter(d=>d.s>=t0).reduce((t,d)=>t+d.p,0);
    $("distNote").textContent=`The highlighted row holds the average. About ${fmt(top,1)}% of pans reach ${n0(t0)} or more. From 14,306 logged pans at 5,600–10,500 capacity; at much lower or higher capacity the shape is a best guess.`}
  $("distCard").hidden=!(C>0);
  const n=+S.want||0;
  if(n>0){const avg=Math.pow(n/0.6779,1/0.56474),can=Math.pow(n/2.5,2),always=Math.pow(2*n,2);
    const tile=(l,v,s,c)=>`<div${c?` class="${c}"`:""}><span class="lab">${l}</span><b>${v}</b>${s?`<small>${s}</small>`:""}</div>`;
    $("need").innerHTML=tile("Possible at all",n0(can),"capacity where the best pans reach it")+tile("On average",n0(avg),"capacity to average it","avg")+tile("Every pan",n0(always),"capacity where even the fewest reach it")}
  else $("need").innerHTML=""}
render();
})();
