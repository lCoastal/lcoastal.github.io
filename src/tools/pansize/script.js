(()=>{
const $=id=>document.getElementById(id);
let S={cap:"",want:""};try{Object.assign(S,JSON.parse(localStorage.getItem("ps-s")||"{}"))}catch(e){}
const youPush=ptYouLink(S,{cap:"cap"},()=>{$("cap").value=S.cap;render()});
const save=()=>{try{localStorage.setItem("ps-s",JSON.stringify(S))}catch(e){}youPush()};
ptPageButtons($("acts"),()=>"Pan size "+(S.cap||""),()=>{const r=ptPageRead(null,[{h:"Minerals per pan",el:$("sum")},{h:"Capacity you need for "+(S.want||"")+" minerals",el:$("need")}]);r.title="Pan size";r.sub=["Capacity "+Number(S.cap||0).toLocaleString("en-US")];return r},"Estimates from a fitted model, so real results can differ.");
// fewest = ½√C, average = 0.678·C^0.565 (shared panItems), most ≈ 2.5√C
const lo=C=>.5*Math.sqrt(C),hi=C=>2.5*Math.sqrt(C);
const n0=v=>fmt(Math.round(v),0);
["cap","want"].forEach(k=>{$(k).value=S[k];$(k).addEventListener("input",e=>{S[k]=e.target.value;save();render()})});
$("fromCalc").onclick=async()=>{let t=null;try{t=await window.parent.ptGetTotals()}catch(e){}if(!t||!t.Capacity)return;S.cap=String(Math.round(t.Capacity));$("cap").value=S.cap;save();render()};
function render(){const C=+S.cap||0;$("out").hidden=!(C>0);
  if(C>0){const a=lo(C),m=panItems(C),b=hi(C);
    const tile=(l,v,s,c)=>`<div${c?` class="${c}"`:""}><span class="lab">${l}</span><b>${v}</b>${s?`<small>${s}</small>`:""}</div>`;
    $("sum").innerHTML=tile("Fewest",n0(a),"½ × √capacity")+tile("Average",fmt(m,1),"what you get over many pans","avg")+tile("Most",n0(b),"about 2.5 × √capacity");
    const x=v=>((v-a)/(b-a)*100).toFixed(1);
    $("range").innerHTML=`<div class="track"></div><div class="mk" style="left:0"></div><div class="mk" style="left:${x(m)}%"></div><div class="mk" style="left:calc(100% - 2px)"></div>
      <span class="lb l" style="left:0">${n0(a)}</span><span class="lb" style="left:${x(m)}%">avg ${fmt(m,1)}</span><span class="lb r" style="left:100%">${n0(b)}</span>`}
  const n=+S.want||0;
  if(n>0){const avg=Math.pow(n/0.6779,1/0.56474),can=Math.pow(n/2.5,2),always=Math.pow(2*n,2);
    const tile=(l,v,s,c)=>`<div${c?` class="${c}"`:""}><span class="lab">${l}</span><b>${v}</b>${s?`<small>${s}</small>`:""}</div>`;
    $("need").innerHTML=tile("Possible at all",n0(can),"capacity where the best pans reach it")+tile("On average",n0(avg),"capacity to average it","avg")+tile("Every pan",n0(always),"capacity where even the fewest reach it")}
  else $("need").innerHTML=""}
render();
})();
