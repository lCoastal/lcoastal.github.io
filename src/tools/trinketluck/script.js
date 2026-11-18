(()=>{
const $=id=>document.getElementById(id);
const TRN=(P.x2||{}).trinkets||[];
const info=n=>TRN.find(t=>t.n===n)||{};

// region base luck, offered as quick-fill chips
const REG=P.regLuck||{};

// chance an ore carries any modifier, from the Modifier Odds model (6.3% per 1x boost, compounding)
const anyMod=e=>1-Math.pow(1-.0631,Math.max(0,+e||0)/100);
// the Senet Die rolls x0.5 .. x3 each full pan; its real average works out to x1.33 (rolls lean low)
const dieAvg=1.33, dieLo=0.5, dieHi=3;

let S={base:"",mult:"",cap:"",mb:"",k:6};
try{Object.assign(S,JSON.parse(localStorage.getItem("pt-trinketluck")||"{}"))}catch(e){}
// cap and modifier boost are shared with the other tools; base luck seeds from shared luck once if empty
const youPush=ptYouLink(S,{cap:"cap",mb:"mb"},()=>{sync();render()});
if(S.base===""||S.base==null){try{const y=window.parent.ptYou.get();if(y.luck)S.base=y.luck}catch(e){}}
if(!(+S.cap>0))S.cap=1000;
const save=()=>{try{localStorage.setItem("pt-trinketluck",JSON.stringify(S))}catch(e){}youPush()};

function trinketMults(){
  const B=Math.max(1,+S.base||1),cap=Math.max(1,+S.cap||1),mb=Math.max(0,+S.mb||0),k=Math.max(0,Math.min(6,+S.k||0));
  const n=panItems(cap);                       // ores per pan
  const modPer=n*anyMod(mb);                   // modified ores per pan  -> Umbrella
  const destPer=Math.max(0,n-20);              // ores destroyed per pan -> Reactor
  return {
    B,cap,mb,k,n,modPer,destPer,
    rows:[
      {key:"nomad", name:"Nomad's Compass", mult:1+0.15*k, add:0, kind:"mult"},
      {key:"die",   name:"Senet Die",       mult:dieAvg,   add:0, kind:"die", lo:dieLo, hi:dieHi},
      {key:"umb",   name:"Beach Umbrella",  mult:1+25*modPer/B, add:25*modPer, kind:"add"},
      {key:"reac",  name:"Mass Reactor",    mult:1+25*destPer/B, add:25*destPer, kind:"add"},
    ],
  };
}

const fL=v=>fmt(Math.round(v),0);
function whyLine(r,c){
  const L0=c.B*(+S.mult>1?+S.mult:1);
  if(r.key==="nomad") return c.k>=6?"Maxed at +90% luck. Needs 5 pans each in 6 deposits this hour to hold.":`+${Math.round(15*c.k)}% luck at ${c.k} stack${c.k===1?"":"s"}. Slide to 6 for its full +90%.`;
  if(r.key==="die") return `Rolls a die every full pan: averages &times;1.33, but can <span class="risk">drop to &times;0.5 (halves your luck)</span> or spike to &times;3.`;
  if(r.key==="umb"){
    if(c.mb<=0) return `Does nothing at 0 modifier boost &mdash; it feeds on modified ores. Add modifier boost to make it work.`;
    return `${fmt(c.modPer,1)} modified ore${c.modPer<1.5?"":"s"} a pan &times; +25 base luck = +${fL(r.add)} base luck (&times;${fmt(r.mult,2)}).`;
  }
  if(r.key==="reac"){
    if(c.destPer<=0) return `Your pans hold ${fmt(c.n,1)} ores, under the 20 it needs to destroy any. No effect until capacity is higher (&gt; ~400).`;
    return `Destroys ${fmt(c.destPer,1)} ore${c.destPer<1.5?"":"s"} over 20 a pan for +${fL(r.add)} base luck (&times;${fmt(r.mult,2)}). <span class="risk">You lose those ores.</span>`;
  }
  return "";
}

function render(){
  // zone chips
  $("zones").innerHTML=`<span class="zlab">Fill base luck:</span>`+Object.entries(REG).map(([z,v])=>`<button type="button" class="zbtn" data-z="${v}">${esc(z)} &middot; ${fmt(v,0)}</button>`).join("");

  const c=trinketMults();
  const Mshow=+S.mult>1?+S.mult:1;
  const L0=c.B*Mshow;
  // rank by average luck multiplier, biggest first
  const ranked=[...c.rows].sort((a,b)=>b.mult-a.mult);
  const best=ranked[0];

  $("head").innerHTML=`At base luck <b>${fmt(c.B,0)}</b>${Mshow>1?` &times; ${fmt(Mshow,2)} = <b>${fL(L0)}</b> luck`:""} &middot; ~<b>${fmt(c.n,1)}</b> ores per pan`;

  const bestLuck=L0*best.mult;
  $("verdict").innerHTML=`Best for luck right now: <b>${esc(best.name)}</b> &mdash; about <b>&times;${fmt(best.mult,2)}</b> your luck`+(Mshow>1?` (&asymp; ${fL(bestLuck)})`:"")+`.`+(best.key==="die"?` It wins on average, but it's a gamble &mdash; a bad roll drops you to ${fL(L0*0.5)} luck.`:"")+(best.key==="nomad"&&c.k>=6?` The catch is upkeep &mdash; that's 5 pans in each of 6 deposits an hour to hold all the stacks.`:"");

  $("ranks").innerHTML=ranked.map((r,i)=>{
    const dead=r.mult<=1.0001;
    const extra=r.kind==="die"?`<span>&times;${r.lo} to &times;${r.hi}</span>`:(Mshow>1?`<span>&asymp; ${fL(L0*r.mult)}</span>`:`<span>of your luck</span>`);
    return `<div class="rank${i===0&&!dead?" win":""}${dead?" dead":""}">
      <div class="rpos">${dead?"&mdash;":"#"+(i+1)}</div>
      <div><p class="rname">${esc(r.name)}${i===0&&!dead?`<span class="rtag">Best luck</span>`:""}</p><p class="rwhy">${whyLine(r,c)}</p></div>
      <div class="rmult"><b>&times;${fmt(r.mult,2)}</b>${extra}</div>
    </div>`;
  }).join("");

  // explainers with real effect text + how to get
  $("explain").innerHTML=c.rows.map(r=>{
    const d=info(r.name);
    return `<div class="ex"><h4>${esc(r.name)}</h4><p class="eff">${esc(d.fx||"")}</p><p class="get"><b>Get it:</b> ${esc(d.how||"Not documented yet.")}${d.cost?` (${esc(d.cost)})`:""}${d.req?` &middot; needs ${esc(d.req)}`:""}</p></div>`;
  }).join("");
}

// mirror S into the fields
function sync(){["base","mult","cap","mb"].forEach(k=>{const el=$(k);if(el&&document.activeElement!==el)el.value=S[k]??""});$("k").value=S.k;$("kv").textContent=S.k}

["base","mult","cap","mb"].forEach(k=>$(k).addEventListener("input",()=>{S[k]=$(k).value;save();render()}));
$("k").addEventListener("input",()=>{S.k=+$("k").value;$("kv").textContent=S.k;save();render()});
$("zones").addEventListener("click",e=>{const b=e.target.closest("[data-z]");if(!b)return;S.base=+b.dataset.z;sync();save();render()});

// Save as image / Copy as text, built from what the page shows
ptPageButtons($("acts"),"Best Luck Trinket",()=>ptPageRead($("head"),[{h:"",el:$("ranks")}]),"Trinket luck is estimated. The Senet Die is random.");

sync();render();
})();
