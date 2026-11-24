const $=id=>document.getElementById(id);
const KEY="eqc-s",MAX=6;
let S={items:[],star:"6",q:100,mut:"None",diff:false,show:{cost:true,recipe:true,notes:true,niche:false}};
try{Object.assign(S,JSON.parse(localStorage.getItem(KEY)||"{}"))}catch(e){}
// stats that only matter in the Pharaoh's Tomb or for traps: hidden unless "Tomb & trap stats" is ticked
const NICHE=new Set(["Tomb Time","Trap Ward","Tomb Jar Finds","Lockpick Zone"]);
// one switch for everything that isn't a main stat: craft cost, recipe, notes and the tomb stats
if(S.extra==null)S.extra=false;
S.show={cost:S.extra,recipe:S.extra,notes:S.extra,niche:S.extra};
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}};
const EQ=(P.equip||[]).filter(x=>x.st&&x.st.length),EQB=Object.fromEntries(EQ.map(x=>[x.n,x]));
S.items=(S.items||[]).map(x=>typeof x==="string"?{n:x,m:""}:x).filter(x=>x&&EQB[x.n]).slice(0,MAX);
const MIC={};P.mins.forEach(m=>{MIC[m.n]=m.ic});
const img=x=>x&&x.img?(P.eimg||{})[x.img]||"":"";
// same mutation table as the Stat Calculator: [name, multiplier on every stat, flat stats it adds]
const MUTS=[["None",1,{}],["Silver",1.1,{}],["Gold",1.2,{}],["Diamond",1.35,{}],["Granite",1.36,{"Dig Strength":24,"Shake Strength":6}],["Overclocked",1.36,{"Dig Speed":10,"Shake Speed":10}],["Festive",1.4,{"Luck":50,"Size Boost":10}],["Sunforged",1.5,{"Luck":300,"Sell Boost":30}],["Prismatic",1.6,{}]];
const MUT=Object.fromEntries(MUTS.map(m=>[m[0],m]));
const ONE_ONLY=n=>/only one can be worn/i.test((EQB[n]||{}).d||"");
// a stat line is [name, low 5★, high 5★, low 6★, high 6★, is-percent]; quality picks a point between low and high
const lohi=s=>S.star==="5"?[s[1],s[2]]:[s[3],s[4]];
const statVal=(s,mu)=>{const [lo,hi]=lohi(s);return (lo+(hi-lo)*S.q/100)*mu[1]};
const isPct=new Set();EQ.forEach(x=>x.st.forEach(s=>{if(s[5])isPct.add(s[0])}));["Size Boost","Sell Boost","Modifier Boost","Dig Speed","Shake Speed"].forEach(n=>isPct.add(n));
const fv=(n,v)=>{const a=Math.abs(v),t=isPct.has(n)?fmt(a,a<10?1:0)+"%":fmt(a,a<10?2:0);return (v<0?"−":"")+t};
const fd=(n,v)=>Math.abs(v)<1e-9?"same":(v>0?"+":"−")+fv(n,Math.abs(v)).replace(/^−/,"");
const mutOf=it=>it.m||S.mut;
function statsOf(x,mn){const mu=MUT[mn]||MUTS[0];const o=new Map();x.st.forEach(s=>o.set(s[0],{v:statVal(s,mu),r:lohi(s).map(z=>z*mu[1])}));
  Object.entries(mu[2]).forEach(([n,a])=>{const e=o.get(n);if(e){e.v+=a;e.r=e.r.map(z=>z+a)}else o.set(n,{v:a,r:[a,a]})});return o}
const price=x=>x.price==null?"-":x.cur==="$"?"$"+fmt(x.price):fmt(x.price)+" "+esc(x.cur);

function render(){
  document.querySelectorAll("[data-star]").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.star===S.star)));
  $("extra").checked=!!S.extra;S.show={cost:S.extra,recipe:S.extra,notes:S.extra,niche:S.extra};
  $("q").value=S.q;$("qv").textContent=S.q+"%";$("mut").value=S.mut;$("diff").checked=!!S.diff;
  const items=S.items.map(it=>EQB[it.n]);
  if(!items.length){$("out").innerHTML=`<div class="empty"><p>Add two or more pieces above to compare them.</p><p class="hint">Try: ${["Ring of Ra","Ring of Champions","Sun's Gift"].filter(n=>EQB[n]).map(n=>`<button type="button" class="chip" data-quick="${esc(n)}">${esc(n)}</button>`).join(" ")}</p></div>`;return}
  const st=S.items.map((it,i)=>statsOf(items[i],mutOf(it)));
  // every stat any of them has, in a sensible order (luck first, then by how many items have it)
  const ORDER=["Luck","Capacity","Size Boost","Modifier Boost","Sell Boost","Dig Strength","Shake Strength","Dig Speed","Shake Speed","Walk Speed","Inventory Size","Toughness"];
  const allNames=[...new Set(st.flatMap(m=>[...m.keys()]))],hiddenN=allNames.filter(n=>NICHE.has(n)&&!S.show.niche).length;
  const names=allNames.filter(n=>S.show.niche||!NICHE.has(n)).sort((a,b)=>{const ia=ORDER.indexOf(a),ib=ORDER.indexOf(b);return (ia<0?99:ia)-(ib<0?99:ib)||a.localeCompare(b)});
  const head=items.map((x,i)=>`<th class="it" scope="col"><div class="ih"><button type="button" class="rm" data-rm="${i}" aria-label="Remove ${esc(x.n)}" title="Remove">×</button>${img(x)?`<img src="${img(x)}" alt="" loading="lazy">`:""}<b style="color:${rc(x.r)}">${esc(x.n)}</b><small>${esc(x.r)}, ${esc(x.slot)}${x.ev?", event":""}</small><select class="cm" data-cm="${i}" aria-label="Mutation for ${esc(x.n)}"><option value="">Top (${S.mut==="None"?"none":esc(S.mut)})</option>${MUTS.map(m=>`<option value="${m[0]}"${S.items[i].m===m[0]?" selected":""}>${m[0]==="None"?"No mutation":m[0]}</option>`).join("")}</select><button type="button" class="cp" data-cp="${i}" title="Add a copy of this piece, to compare it with another mutation">+ Copy</button>${i>0?`<span class="mv"><button type="button" data-mv="${i}" data-d="-1" aria-label="Move left" title="Move left">‹</button></span>`:""}</div></th>`).join("");
  const rows=names.map(n=>{const vals=st.map(m=>m.has(n)?m.get(n).v:null);const have=vals.filter(v=>v!=null);const best=have.length>1?Math.max(...have):null;
    return `<tr><th scope="row"><span class="sd" style="background:${statHex(n)}"></span>${esc(n)}</th>${vals.map((v,i)=>{if(v==null)return `<td class="na">-</td>`;
      const r=st[i].get(n).r,isBest=best!=null&&Math.abs(v-best)<1e-9&&have.filter(z=>Math.abs(z-best)<1e-9).length<have.length;
      const main=S.diff&&i>0?(vals[0]==null?`<span class="dn">new</span> ${fv(n,v)}`:`<span class="${v-vals[0]>1e-9?"up":v-vals[0]<-1e-9?"dn":""}">${fd(n,v-vals[0])}</span>`):fv(n,v);
      return `<td class="${isBest?"best":""}"><b>${main}</b><small>${fv(n,r[0])} – ${fv(n,r[1])}</small></td>`}).join("")}</tr>`}).join("");
  const recipe=x=>(x.rec||[]).length?`<div class="rec">${x.rec.map(([q,m])=>`<span>${MIC[m]?`<img src="${MIC[m]}" alt="" loading="lazy">`:""}${q}× ${esc(m)}</span>`).join("")}</div>`:"-";
  const notes=x=>[ONE_ONLY(x.n)?"Only one can be worn":"",x.bp?esc(x.bp):"",x.ev?"Event or limited-time item":""].filter(Boolean).map(t=>`<div>${t}</div>`).join("")||"-";
  $("out").innerHTML=`<div class="tw"><table class="cmp"><thead><tr><th class="corner" scope="col"><span>${items.length} of ${MAX}</span><small>${S.star}★, ${S.q}% quality</small></th>${head}</tr></thead>
    <tbody>${rows}
    ${[S.show.cost?`<th scope="row">Craft cost</th>${items.map(x=>`<td><b>${price(x)}</b></td>`).join("")}`:"",
       S.show.recipe?`<th scope="row">Recipe</th>${items.map(x=>`<td class="tl">${recipe(x)}</td>`).join("")}`:"",
       S.show.notes?`<th scope="row">Notes</th>${items.map(x=>`<td class="tl nt">${notes(x)}</td>`).join("")}`:""].filter(Boolean).map((r,i)=>`<tr${i===0?' class="sep"':""}>${r}</tr>`).join("")}
    </tbody></table></div>
    <p class="hint">The big number is each stat at ${S.star}★ and ${S.q}% quality with each column's mutation; underneath is its full range at ${S.star}★. The best value in each row is highlighted.${hiddenN?` ${hiddenN} tomb stat${hiddenN>1?"s are":" is"} hidden.`:""}${items.length<2?" Add another piece to compare.":""}</p>`}

// controls
$("mut").innerHTML=MUTS.map(m=>`<option value="${m[0]}">${m[0]==="None"?"No mutation":m[0]+" ×"+m[1]+(Object.keys(m[2]).length?" + "+Object.entries(m[2]).map(([k,v])=>v+" "+k).join(", "):"")}</option>`).join("");
$("mut").onchange=()=>{S.mut=$("mut").value;save();render()};
$("q").oninput=()=>{S.q=+$("q").value;save();render()};
$("extra").onchange=()=>{S.extra=$("extra").checked;save();render()};
$("diff").onchange=()=>{S.diff=$("diff").checked;save();render()};
$("clear").onclick=()=>{S.items=[];save();render()};
document.addEventListener("change",e=>{const c=e.target.closest("[data-cm]");if(!c)return;S.items[+c.dataset.cm].m=c.value;save();render()});
document.addEventListener("click",e=>{const b=e.target.closest("[data-star],[data-rm],[data-mv],[data-quick],[data-cp]");if(!b)return;
  if(b.dataset.star){S.star=b.dataset.star}
  else if(b.dataset.rm!=null){S.items.splice(+b.dataset.rm,1)}
  else if(b.dataset.mv!=null){const i=+b.dataset.mv,j=i+(+b.dataset.d);if(j>=0){[S.items[i],S.items[j]]=[S.items[j],S.items[i]]}}
  else if(b.dataset.quick){addItem(b.dataset.quick)}
  else if(b.dataset.cp!=null){if(S.items.length>=MAX){ptToast(`You can compare up to ${MAX} at once`);return}const i=+b.dataset.cp,it=S.items[i];
    // the copy gets the next mutation up, so the two columns differ straight away
    const used=new Set(S.items.filter(z=>z.n===it.n).map(mutOf)),cur=MUTS.findIndex(m=>m[0]===mutOf(it));let nx=MUTS.find((m,j)=>j>cur&&!used.has(m[0]))||MUTS.find(m=>!used.has(m[0]))||MUTS[0];
    S.items.splice(i+1,0,{n:it.n,m:nx[0]})}
  save();render()});
function addItem(n){if(!EQB[n])return;if(S.items.length>=MAX){ptToast(`You can compare up to ${MAX} at once`);return}S.items.push({n,m:""});save();render()}
makeAC({inp:$("add"),items:EQ.map(x=>({n:x.n,tag:(x.r+" "+x.slot).trim(),ic:img(x),col:rc(x.r)})),cur:()=>"",icon:()=>"",pick:x=>{addItem(x.n);$("add").value=""}});
render();
