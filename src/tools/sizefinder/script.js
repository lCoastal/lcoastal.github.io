(()=>{
const $=id=>document.getElementById(id);
let S={min:"",kg:"",cap:"",sb:"",good:"0.1",mag:false};try{Object.assign(S,JSON.parse(localStorage.getItem("sf-s")||"{}"))}catch(e){}
const youPush=ptYouLink(S,{sb:"sb",cap:"cap",mag:"mag"},()=>{["sb","cap"].forEach(k=>$(k).value=S[k]);$("mag").checked=!!S.mag;render()});
const save=()=>{try{localStorage.setItem("sf-s",JSON.stringify(S))}catch(e){}youPush()};
ptPageButtons($("acts"),()=>"Size Boost for "+(String(S.min).trim()||"a mineral"),()=>ptPageRead($("head"),[{h:"",el:$("sum")},{h:"Chance per mineral at each Size Boost",el:$("tbl")}]),"Estimates from a fitted model, so real results can differ.");
const MINS=P.mins.filter(m=>m.bw>0).sort((a,b)=>a.n.localeCompare(b.n));
const BY=Object.fromEntries(MINS.map(m=>[m.n.toLowerCase(),m]));
const pc=v=>!isFinite(v)?"—":fmt(Math.max(0,v),v<100?1:0)+"%";
const oneIn=p=>p<=0?"never":p>=.5?fmt(p*100,1)+"%":p>=.01?fmt(p*100,1)+"% (1 in "+fmt(Math.round(1/p),0)+")":"1 in "+fmt(Math.round(1/p),0);

["kg","cap","sb"].forEach(k=>{$(k).value=S[k];$(k).addEventListener("input",e=>{S[k]=e.target.value;save();render()})});
// mineral picker with pictures, same as the rest of the toolkit
const curMin=()=>BY[String(S.min).trim().toLowerCase()];
const AC=makeAC({inp:$("min"),items:MINS.map(m=>({n:m.n,tag:m.r,ic:m.ic,col:rc(m.r)})),cur:()=>{const m=curMin();return m?m.n:""},icon:()=>{const m=curMin();return m&&m.ic},pick:x=>{$("min").value=x.n;$("min").dispatchEvent(new Event("input"))}});
// registered after the picker so it can still tell typed text from the current pick
$("min").value=S.min;$("min").addEventListener("input",e=>{S.min=e.target.value;save();render()});
$("good").value=S.good;$("good").onchange=e=>{S.good=e.target.value;save();render()};
$("mag").checked=!!S.mag;$("mag").onchange=e=>{S.mag=e.target.checked;save();render()};
$("fromCalc").onclick=async()=>{let t=null;try{t=await window.parent.ptGetTotals()}catch(e){}if(!t)return;
  S.sb=String(Math.round((t["Size Boost"]||0)*10)/10);S.cap=String(Math.round(t.Capacity)||S.cap);$("sb").value=S.sb;$("cap").value=S.cap;save();render()};

// Size Boost (panel %) needed so a share p of the mineral reaches the weight
const need=(w,B,M,k)=>Math.max(0,(w/(B*M*k)-1)*100);
// chance one mineral reaches the weight at a Size Boost
const chance=(w,B,M,sb,model)=>model.sf(w/(B*M*(1+sb/100)));

function chart(w,B,M,model,lo,hi,rec,mine){
  const W=640,H=200,L=44,R=12,T=12,Bm=30,xs=s=>L+(s-lo)/(hi-lo)*(W-L-R),ys=p=>H-Bm-p*(H-Bm-T);
  let d="";for(let i=0;i<=200;i++){const s=lo+(hi-lo)*i/200;d+=(i?"L":"M")+xs(s).toFixed(1)+","+ys(chance(w,B,M,s,model)).toFixed(1)}
  const mk=(s,l)=>s>=lo&&s<=hi?`<line class="mk" x1="${xs(s)}" x2="${xs(s)}" y1="${T}" y2="${H-Bm}"/><text class="mkt" x="${xs(s)>W*.7?xs(s)-4:xs(s)+4}" text-anchor="${xs(s)>W*.7?"end":"start"}" y="${T+10}">${l}</text>`:"";
  const tk=[0,.25,.5,.75,1].map(f=>lo+f*(hi-lo));
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Chance per mineral against Size Boost"><line class="ax" x1="${L}" x2="${W-R}" y1="${H-Bm}" y2="${H-Bm}"/>
    ${[0,.5,1].map(p=>`<text x="${L-6}" y="${ys(p)+4}" text-anchor="end">${p*100}%</text><line class="ax" x1="${L}" x2="${W-R}" y1="${ys(p)}" y2="${ys(p)}" opacity=".4"/>`).join("")}
    <path d="${d}" fill="none" stroke="var(--accent)" stroke-width="2"/>${mk(rec,"recommended")}${mine!=null?mk(mine,"you"):""}
    ${tk.map(s=>`<text x="${xs(s)}" y="${H-Bm+16}" text-anchor="${s===tk[0]?"start":s===tk[4]?"end":"middle"}">${pc(s)}</text>`).join("")}</svg>`}

function render(){
  const m=BY[String(S.min).trim().toLowerCase()],w=+S.kg||0,cap=+S.cap||0,good=+S.good||.1,M=S.mag?1.5:1;
  if(!m||!(w>0)){$("out").hidden=true;return}
  $("out").hidden=false;
  const model=wtModel(cap||4000),B=m.bw;
  const minSB=need(w,B,M,WT_MAX),recSB=need(w,B,M,model.q(good)),halfSB=need(w,B,M,model.q(.5));
  const mine=S.sb===""?null:Math.max(0,+S.sb||0);
  $("head").innerHTML=`${m.ic?`<img src="${m.ic}" alt="">`:""}<div><b class="mlink" data-mineral="${esc(m.n)}" title="Open ${esc(m.n)}">${esc(m.n)} at ${fmt(w,2)} kg</b><br><span>Base weight ${B} kg · ${cap?fmt(cap,0)+" capacity":"capacity not set (4,000 used)"}${S.mag?" · Solar Magnifier":""}${cap&&(cap<1856||cap>7240)?' · <span class="warn">the chances are a rougher estimate at this capacity</span>':""}</span></div>`;
  const tile=(l,v,s,c)=>`<div${c?` class="${c}"`:""}><span class="lab">${l}</span><b>${v}</b>${s?`<small>${s}</small>`:""}</div>`;
  const goodTxt=$("good").selectedOptions[0].textContent;
  let h=tile("Minimum Size Boost",pc(minSB),minSB<=0?"no Size Boost needed to make it possible":"possible, but only with a perfect roll")
    +tile("Recommended",pc(recSB),goodTxt+" reach it","rec")
    +tile("Half of them reach it",pc(halfSB),"");
  if(mine!=null)h+=tile("Your chance now",oneIn(chance(w,B,M,mine,model)),"per "+m.n+" at "+pc(mine));
  $("sum").innerHTML=h;
  const hi=Math.max(recSB,halfSB,mine||0,minSB)*1.25+10,lo=Math.max(0,minSB*.9);
  $("chart").innerHTML=chart(w,B,M,model,lo,hi,recSB,mine);
  $("tbl").innerHTML=`<table class="t"><tr><th>Reaches ${fmt(w,2)} kg</th><th>Size Boost needed</th></tr>${[[1e-6,"Possible at all"],[.001,"1 in 1,000"],[.01,"1 in 100"],[.05,"1 in 20"],[.1,"1 in 10"],[.25,"1 in 4"],[.5,"Half of them"]].map(([p,l])=>`<tr><td>${l}</td><td>${pc(p<1e-5?minSB:need(w,B,M,model.q(p)))}</td></tr>`).join("")}</table>`;
}
render();
window.ptOpenFor=(kind,name)=>{if(kind!=="mineral")return;S.min=name;$("min").value=name;save();render();try{AC.sync()}catch(e){}};
})();
