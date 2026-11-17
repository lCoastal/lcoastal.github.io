(()=>{
const $=id=>document.getElementById(id);
const ORDER=["Exotic","Mythic","Legendary","Epic","Rare","Uncommon","Common"],SLOTS={Exotic:1,Mythic:2,Legendary:3,Epic:3,Rare:3,Uncommon:3,Common:3};
const MULT={Common:.005,Uncommon:.0075,Rare:.0125,Epic:.02,Legendary:.03,Mythic:.05,Exotic:.08};
const STATS=["Luck","Size Boost","Sell Boost","Capacity","Modifier Boost","Dig Strength","Shake Strength","Dig Speed","Shake Speed","Walk Speed"];
const MINS=P.mins.filter(m=>m.mu&&m.mu.b);const MIN=Object.fromEntries(MINS.map(m=>[m.n.toLowerCase(),m]));
const MODS=P.mods;const MOD=Object.fromEntries(MODS.map(m=>[m[0],m]));
const MA=(n,u)=>{try{return window.parent.ptModAllowed(n,u)}catch(e){return true}};
const MO=n=>{try{return window.parent.ptModOnly(n)}catch(e){return null}};
const r4=v=>Math.round(v*10000)/10000,fxT=v=>r4(1+v)+"×",sg=v=>(v<0?"−":"+")+r4(Math.abs(v));
const ic=n=>{const m=MIN[String(n).toLowerCase()];return m&&m.ic?`<img src="${m.ic}" alt="">`:""};
const rc=r=>"var(--c-"+r.toLowerCase()+")";
// what one display gives: the mineral's museum boost plus its modifier on every stat that modifier touches
function gainOf(r,s){const g=new Array(10).fill(0);if(!s||!s.m)return g;const m=MIN[String(s.m).toLowerCase()];if(m)m.mu.b.forEach(([k,v])=>{const i=STATS.indexOf(k);if(i>=0)g[i]+=v});
  const md=MOD[s.u||"None"];if(md)md[1].forEach(k=>{const i=STATS.indexOf(k);if(i>=0)g[i]+=MULT[r]*md[2]});return g}
const totalsOf=b=>{const t=new Array(10).fill(0);ORDER.forEach(r=>(b[r]||[]).forEach(s=>gainOf(r,s).forEach((v,i)=>t[i]+=v)));return t};
const blank=()=>Object.fromEntries(ORDER.map(r=>[r,Array.from({length:SLOTS[r]},()=>({m:null,u:"None"}))]));

// ================= the search (pure functions: these also run inside a Web Worker) =================
// Small exact solver: two-phase simplex (Bland's rule) + branch and bound for 0/1 variables.
// lp(c,rows,n): maximise c·x, x>=0, rows=[{a:{j:v},t:"<="|">="|"=",b}]
function lp(c,rows,n){
  const m=rows.length;const R=rows.map(r=>({a:Object.assign({},r.a),t:r.t,b:r.b}));
  R.forEach(r=>{if(r.b<0){for(const j in r.a)r.a[j]=-r.a[j];r.b=-r.b;r.t=r.t==="<="?">=":r.t===">="?"<=":"="}});
  let ns=0,na=0;R.forEach(r=>{if(r.t!=="=")ns++;if(r.t!=="<=")na++});
  const N=n+ns+na,W=N+1,T=new Float64Array((m+1)*W),basis=new Int32Array(m);
  let si=n,ai=n+ns;const art=[];
  R.forEach((r,i)=>{const o=i*W;for(const j in r.a)T[o+ +j]=r.a[j];T[o+N]=r.b;
    if(r.t==="<="){T[o+si]=1;basis[i]=si++}else if(r.t===">="){T[o+si]=-1;si++;T[o+ai]=1;basis[i]=ai;art.push(ai++)}else{T[o+ai]=1;basis[i]=ai;art.push(ai++)}});
  const z=m*W,EPS=1e-9;
  const pivot=(pr,pc)=>{const po=pr*W,pv=T[po+pc];for(let j=0;j<W;j++)T[po+j]/=pv;
    for(let i=0;i<=m;i++){if(i===pr)continue;const o=i*W,f=T[o+pc];if(Math.abs(f)<1e-15)continue;for(let j=0;j<W;j++)T[o+j]-=f*T[po+j]}basis[pr]=pc};
  // most negative reduced cost (fast); after many pivots without progress fall back to Bland's rule so it can't cycle
  const run=(allowed)=>{let stall=0,last=Infinity;for(let it=0;it<20000;it++){let pc=-1;
      if(stall<50){let mn=-EPS;for(let j=0;j<N;j++){if(T[z+j]<mn&&allowed(j)){mn=T[z+j];pc=j}}}
      else for(let j=0;j<N;j++){if(!allowed(j))continue;if(T[z+j]<-EPS){pc=j;break}}
      const zv=T[z+N];if(Math.abs(zv-last)<1e-12)stall++;else stall=0;last=zv;
      if(pc<0)return 0;let pr=-1,best=Infinity;for(let i=0;i<m;i++){const a=T[i*W+pc];if(a>EPS){const q=T[i*W+N]/a;if(q<best-1e-12||(Math.abs(q-best)<=1e-12&&basis[i]<basis[pr])){best=q;pr=i}}}
      if(pr<0)return 2;pivot(pr,pc)}return 3};
  // phase 1: minimise the artificials
  if(art.length){const isA=new Uint8Array(N);art.forEach(j=>isA[j]=1);
    for(let j=0;j<W;j++)T[z+j]=0;art.forEach(j=>T[z+j]=1);
    for(let i=0;i<m;i++)if(isA[basis[i]]){const o=i*W;for(let j=0;j<W;j++)T[z+j]-=T[o+j]}
    run(()=>true);if(-T[z+N]>1e-7)return {status:"infeasible"};
    for(let i=0;i<m;i++)if(isA[basis[i]]){const o=i*W;let pc=-1;for(let j=0;j<n+ns;j++)if(Math.abs(T[o+j])>EPS){pc=j;break}if(pc>=0)pivot(i,pc)}
    for(let i=0;i<=m;i++)art.forEach(j=>T[i*W+j]=0)}
  for(let j=0;j<W;j++)T[z+j]=0;for(let j=0;j<n;j++)T[z+j]=-(c[j]||0);
  for(let i=0;i<m;i++){const b=basis[i];if(b<n&&c[b]){const o=i*W,f=c[b];for(let j=0;j<W;j++)T[z+j]+=f*T[o+j]}}
  const st=run(j=>j<n+ns);if(st===2)return {status:"unbounded"};
  const x=new Float64Array(n);for(let i=0;i<m;i++)if(basis[i]<n)x[basis[i]]=T[i*W+N];
  return {status:"ok",x,z:T[z+N]}}
// Pick exactly one column per group so every constraint total reaches its target, with the highest value.
// cols: [{grp, v, a:[...per constraint]}], need: [...targets]. Branch and bound on the LP, with a rounding step at
// every node: try every mix of the columns the LP split between, which usually finds a good answer straight away.
function mckp(cols,ngrp,need,opt){opt=opt||{};const n=cols.length,K=need.length,deadline=Date.now()+(opt.ms||6000),TOL=1e-7;
  const rows=[];for(let g=0;g<ngrp;g++){const a={};cols.forEach((c,j)=>{if(c.grp===g)a[j]=1});rows.push({a,t:"=",b:1})}
  for(let k=0;k<K;k++){const a={};cols.forEach((c,j)=>{if(c.a[k])a[j]=c.a[k]});rows.push({a,t:">=",b:need[k]})}
  const c=cols.map(x=>x.v);let best=opt.start||null,nodes=0;
  const tryRound=x=>{const per=[];for(let g=0;g<ngrp;g++)per.push([]);x.forEach((v,j)=>{if(v>1e-6)per[cols[j].grp].push(j)});
    let combos=1;per.forEach(p=>combos*=p.length);if(combos>512)per.forEach((p,g)=>{p.sort((a,b)=>x[b]-x[a]);per[g]=p.slice(0,2)});
    const pick=new Array(ngrp);const rec=g=>{if(g===ngrp){let v=0;const s=new Array(K).fill(0);pick.forEach(j=>{v+=cols[j].v;for(let k=0;k<K;k++)s[k]+=cols[j].a[k]||0});
        if(s.every((t,k)=>t>=need[k]-1e-9)&&(!best||v>best.z+TOL))best={pick:pick.slice(),z:v};return}
      per[g].forEach(j=>{pick[g]=j;rec(g+1)})};rec(0)};
  const heap=[];const push=(ex,bound)=>{heap.push({ex,bound});let i=heap.length-1;while(i){const p=(i-1)>>1;if(heap[p].bound>=heap[i].bound)break;[heap[p],heap[i]]=[heap[i],heap[p]];i=p}};
  const pop=()=>{const top=heap[0],last=heap.pop();if(heap.length){heap[0]=last;let i=0;for(;;){const l=2*i+1,r=l+1;let m=i;if(l<heap.length&&heap[l].bound>heap[m].bound)m=l;if(r<heap.length&&heap[r].bound>heap[m].bound)m=r;if(m===i)break;[heap[m],heap[i]]=[heap[i],heap[m]];i=m}}return top};
  push([],Infinity);
  while(heap.length&&Date.now()<deadline){const nd=pop();if(best&&nd.bound<=best.z+TOL)continue;nodes++;
    const r=lp(c,rows.concat(nd.ex),n);if(r.status!=="ok")continue;if(best&&r.z<=best.z+TOL)continue;
    tryRound(r.x);
    // branch on the group whose LP choice is most split: one side keeps its biggest column, the other drops it
    let bg=-1,bj=-1,bm=1;for(let g=0;g<ngrp;g++){let mx=0,mj=-1;r.x.forEach((v,j)=>{if(cols[j].grp===g&&v>mx){mx=v;mj=j}});if(mx<1-1e-6&&mx<bm){bm=mx;bg=g;bj=mj}}
    if(bg<0)continue;
    push(nd.ex.concat([{a:{[bj]:1},t:"<=",b:0}]),r.z);push(nd.ex.concat([{a:{[bj]:1},t:">=",b:1}]),r.z)}
  return {best,nodes,done:!heap.length||heap.every(h=>best&&h.bound<=best.z+TOL)}}

// J = {opts:{rarity:[{n,u,g}]}, slots:{rarity:k}, order:[...], need:[10], W:[10], start, ms}
function solveMuseum(J){const t0=Date.now(),K=10,EPS=1e-12;
  const val=g=>{let s=0;for(let k=0;k<K;k++)s+=g[k]*J.W[k];return s};
  const neg=new Array(K).fill(false);J.order.forEach(r=>J.opts[r].forEach(o=>o.g.forEach((v,k)=>{if(v<0)neg[k]=true})));
  const CS=[];for(let k=0;k<K;k++)if(Math.abs(J.need[k])>1e-12||neg[k])CS.push(k);
  const dom=(a,b)=>{for(const k of CS)if(a[k]<b[k]-EPS)return false;return val(a)>=val(b)-EPS};
  let exact=true;const cols=[];
  J.order.forEach((r,gi)=>{let os=J.opts[r].map(o=>Object.assign({v:val(o.g)},o));const k=J.slots[r];
    // a modifier beaten by another modifier on the same mineral is never needed
    os.forEach(o=>{if(o.keep)o.v+=J.keepBonus||0});
    const domO=(a,b)=>{for(const k of CS)if(a.g[k]<b.g[k]-EPS)return false;return a.v>=b.v-EPS};
    os=os.filter((o,i)=>!os.some((p,j)=>j!==i&&p.n===o.n&&domO(p,o)&&(!domO(o,p)||j<i)));
    // an option beaten by at least k other minerals is never needed either
    os=os.filter((o,i)=>{const ms=new Set();os.forEach((p,j)=>{if(p.n!==o.n&&domO(p,o)&&(!domO(o,p)||j<i))ms.add(p.n)});return ms.size<k});
    if(os.length>48){exact=false;os.sort((a,b)=>b.v-a.v);const keep=new Set(os.slice(0,36));CS.forEach(c=>os.slice().sort((a,b)=>b.g[c]-a.g[c]).slice(0,4).forEach(o=>keep.add(o)));os=[...keep]}
    // every set of k different minerals for this rarity, then only the sets nothing else beats
    const out=[],g=new Array(K).fill(0),pick=[],used=new Set();let vv=0;
    const rec=(st,left)=>{if(!left){out.push({g:g.slice(),v:vv,pick:pick.slice()});return}
      for(let i=st;i<os.length;i++){const o=os[i];if(used.has(o.n))continue;used.add(o.n);for(let q=0;q<K;q++)g[q]+=o.g[q];vv+=o.v;pick.push({n:o.n,u:o.u});rec(i+1,left-1);pick.pop();vv-=o.v;for(let q=0;q<K;q++)g[q]-=o.g[q];used.delete(o.n)}};
    if(os.length<k)return;rec(0,k);out.sort((a,b)=>b.v-a.v);const keep=[];
    for(const x of out){let d=false;for(const y of keep)if(domO(y,x)){d=true;break}if(!d)keep.push(x)}
    keep.forEach(x=>cols.push({grp:gi,v:x.v,a:CS.map(c=>x.g[c]),pick:x.pick,g:x.g}))});
  const res=mckp(cols,J.order.length,CS.map(c=>J.need[c]-1e-9),{ms:J.ms,start:J.start});
  const out={done:res.done&&exact,capped:!exact,finished:res.done,nodes:res.nodes,cols:cols.length,ms:Date.now()-t0,z:res.best?res.best.z:null,picks:null};
  if(res.best&&res.best.pick){out.picks={};res.best.pick.forEach((j,gi)=>out.picks[J.order[gi]]=cols[j].pick)}
  return out}
// ================= page =================
let S={src:"A",paste:"",mods:["None","Perfect","Treasured","Entombed"],own:false,skip:[],goal:"have"};
try{Object.assign(S,JSON.parse(localStorage.getItem("mo-s")||"{}"))}catch(e){}
const save=()=>{try{localStorage.setItem("mo-s",JSON.stringify(S))}catch(e){}};
const getLS=k=>{try{return JSON.parse(localStorage.getItem(k)||"null")}catch(e){return null}};
const validBoard=b=>b&&ORDER.every(r=>Array.isArray(b[r]));
function parseSetup(txt){const b=blank();let n=0;const fill={};ORDER.forEach(r=>fill[r]=0);
  String(txt).split(/\r?\n/).forEach(line=>{const m=line.match(/^\s*([A-Za-z]+)\s*:\s*(.+)$/);if(!m||/^total/i.test(m[1]))return;
    m[2].split(/,(?![^()]*\))/).forEach(part=>{const p=part.trim().match(/^(.+?)\s*(?:\(([^)]+)\))?$/);if(!p)return;const mm=MIN[p[1].trim().toLowerCase()];if(!mm)return;const r=mm.r;
      if(!SLOTS[r]||fill[r]>=SLOTS[r])return;b[r][fill[r]++]={m:mm.n,u:MOD[(p[2]||"None").trim()]?(p[2]||"None").trim():"None"};n++})});
  return n?b:null}
function sources(){const L=(getLS("mp-loadouts")||[]).filter(o=>o&&o.name&&validBoard(o.board));
  const o=[["A","Museum Planner board"]];if(filled(getLS("mp-board-b")))o.push(["B","Museum Planner: Museum B (compare)"]);
  L.forEach((x,i)=>o.push(["L:"+x.name,"Saved: "+x.name]));o.push(["paste","Paste a setup"]);return o}
function curBoard(){if(S.src==="A")return getLS("mp-board");if(S.src==="B")return getLS("mp-board-b");if(S.src==="paste")return parseSetup(S.paste);
  if(S.src.startsWith("L:")){const x=(getLS("mp-loadouts")||[]).find(o=>o&&o.name===S.src.slice(2));return x&&x.board}return null}
const filled=b=>b?ORDER.reduce((a,r)=>a+(b[r]||[]).filter(x=>x&&x.m).length,0):0;
function drawInputs(){const so=sources();if(!so.some(x=>x[0]===S.src))S.src="A";
  $("src").innerHTML=so.map(([v,l])=>`<option value="${esc(v)}"${v===S.src?" selected":""}>${esc(l)}</option>`).join("");
  $("pasteBox").hidden=S.src!=="paste";$("paste").value=S.paste;
  $("mods").innerHTML=MODS.map(m=>`<label class="ck"><input type="checkbox" data-mod="${esc(m[0])}"${S.mods.includes(m[0])?" checked":""}><span>${m[0]==="None"?"No modifier":esc(m[0])}${m[1].length?` <small>${esc(m[1].join(", "))}${m[2]>1?" ×"+m[2]:""}</small>`:""}</span></label>`).join("");
  $("ownOnly").checked=!!S.own;
  $("goal").innerHTML=`<option value="have">The stats your museum boosts, by how much they grow</option><option value="all">Every stat, by how much it grows</option>`+STATS.map(s=>`<option value="${s}"${S.goal===s?" selected":""}>${s} first</option>`).join("");$("goal").value=S.goal;
  $("skips").innerHTML=S.skip.map(n=>`<button type="button" class="chip" data-unskip="${esc(n)}" title="Put ${esc(n)} back">${esc(n)} ✕</button>`).join("");
  const b=curBoard(),t=b&&totalsOf(b);
  $("curSum").innerHTML=b&&filled(b)?STATS.map((s,i)=>Math.abs(t[i])>1e-9?`<span>${s} <b>${fxT(t[i])}</b></span>`:"").join("")+`<span>${filled(b)} of 18 displays</span>`:`<p class="hint">${S.src==="paste"?"Paste a setup above.":"That museum is empty. Fill it in the Museum Planner first."}</p>`}
$("src").onchange=e=>{S.src=e.target.value;save();drawInputs()};
$("paste").oninput=e=>{S.paste=e.target.value;save();drawInputs()};
$("mods").addEventListener("change",e=>{const m=e.target.dataset.mod;if(!m)return;S.mods=e.target.checked?[...new Set([...S.mods,m])]:S.mods.filter(x=>x!==m);save()});
$("ownOnly").onchange=e=>{S.own=e.target.checked;save()};
$("goal").onchange=e=>{S.goal=e.target.value;save()};
$("skips").addEventListener("click",e=>{const b=e.target.closest("[data-unskip]");if(!b)return;S.skip=S.skip.filter(x=>x!==b.dataset.unskip);save();drawInputs()});
makeAC({inp:$("skipIn"),free:true,items:MINS.filter(m=>m.mu).map(m=>({n:m.n,tag:m.r,ic:m.ic,col:rc(m.r)})),pick:x=>{if(!S.skip.includes(x.n))S.skip.push(x.n);$("skipIn").value="";save();drawInputs()}});

// run the search in a Web Worker so the page stays responsive; fall back to running it here
let worker=null;
function runSearch(J){return new Promise(res=>{try{if(!worker){const src=[lp,mckp,solveMuseum].map(f=>f.toString()).join("\n")+"\nonmessage=e=>postMessage(solveMuseum(e.data));";
      worker=new Worker(URL.createObjectURL(new Blob([src],{type:"text/javascript"})))}
    worker.onmessage=e=>res(e.data);worker.onerror=()=>{worker=null;setTimeout(()=>res(solveMuseum(J)),20)};worker.postMessage(J)}catch(e){setTimeout(()=>res(solveMuseum(J)),20)}})}

let LAST=null;
$("go").onclick=async()=>{const b=curBoard();if(!b||!filled(b)){$("out").innerHTML='<p class="hint">That museum is empty. Fill it in the Museum Planner or paste a setup first.</p>';return}
  const cur=totalsOf(b);const own=(()=>{try{return window.parent.ptStore.all()}catch(e){return {}}})();
  const onBoard=new Set();ORDER.forEach(r=>(b[r]||[]).forEach(s=>s&&s.m&&onBoard.add(s.m)));
  // how much each stat counts: by how much it grows compared to now; stats outside the goal only break ties
  const W=STATS.map((s,i)=>{const base=1/(1+Math.max(0,cur[i]));if(S.goal==="all")return base;if(S.goal==="have")return Math.abs(cur[i])>1e-9?base:base*.01;return S.goal===s?base*1000:base*.01});
  const opts={};ORDER.forEach(r=>{opts[r]=[];MINS.filter(m=>m.r===r).forEach(m=>{
      if(!onBoard.has(m.n)&&(S.skip.includes(m.n)||(S.own&&!(own[m.n]||{}).own)))return;
      const only=MO(m.n);const mods=only?[only]:S.mods.filter(u=>MOD[u]&&MA(m.n,u));
      // whatever is on the board now always counts as possible
      ORDER.forEach(rr=>(b[rr]||[]).forEach(s=>{if(s&&s.m===m.n&&s.u&&MOD[s.u]&&!mods.includes(s.u))mods.push(s.u)}));
      mods.forEach(u=>opts[r].push({n:m.n,u,g:gainOf(r,{m:m.n,u}),keep:ORDER.some(rr=>(b[rr]||[]).some(s=>s&&s.m===m.n&&(s.u||"None")===u))}))})});
  const KB=1e-5,curVal=cur.reduce((a,v,i)=>a+v*W[i],0)+KB*filled(b);
  $("out").innerHTML='<div class="busy"><div class="spin"></div>Checking every combination…</div>';$("go").disabled=true;
  const res=await runSearch({opts,slots:SLOTS,order:ORDER,need:cur,W,keepBonus:KB,start:{z:curVal+1e-6,pick:null},ms:9000});
  $("go").disabled=false;LAST={b,cur,res,W,opts};show();if(window.innerWidth<880)$("out").scrollIntoView({behavior:"smooth",block:"start"})};

function placed(b,picks){// put the new minerals in the displays where the same mineral already is, the rest in order
  const nb=blank();ORDER.forEach(r=>{const now=(b[r]||[]).map(s=>s||{m:null,u:"None"}),nw=(picks[r]||[]).slice(),out=new Array(SLOTS[r]).fill(null);
    now.forEach((s,i)=>{const j=nw.findIndex(x=>x.n===s.m);if(j>=0){out[i]={m:nw[j].n,u:nw[j].u};nw.splice(j,1)}});
    for(let i=0;i<SLOTS[r];i++)if(!out[i])out[i]=nw.length?(x=>({m:x.n,u:x.u}))(nw.shift()):{m:null,u:"None"};nb[r]=out});return nb}
const mineHTML=(n,u)=>n?`<span class="mn">${ic(n)}<span>${esc(n)}<small>${esc(u||"None")}</small></span></span>`:'<span class="mn"><span>Empty</span></span>';
function statTable(a,b2){const rows=STATS.map((s,i)=>[s,a[i],b2[i]]).filter(([,x,y])=>Math.abs(x)>1e-9||Math.abs(y)>1e-9);
  return `<table class="t"><tr><th>Stat</th><th>Now</th><th>After</th><th>Change</th></tr>${rows.map(([s,x,y])=>{const d=y-x,z=Math.abs(d)<1e-9;return `<tr><td>${s}</td><td>${fxT(x)}</td><td>${fxT(y)}</td><td class="${z?"same":d>0?"up":"down"}">${z?"same":sg(d)}</td></tr>`}).join("")}</table>`}
let NEWB=null;
function show(){const {b,cur,res,W,opts}=LAST;const o=$("out");
  const proof=res.done?"Every combination was checked, so this is the best possible."
    :!res.finished?`Stopped after ${Math.round(res.ms/1000)} s, so this is the best it found, not proven best. Untick modifiers you don't need to make it faster.`
    :"With this many modifiers ticked it only checked the strongest options for each rarity, so this is very likely but not proven best. Untick modifiers you don't need for a full check.";
  if(res.picks){NEWB=placed(b,res.picks);const nt=totalsOf(NEWB);
    const ch=[];ORDER.forEach(r=>NEWB[r].forEach((s,i)=>{const was=(b[r]||[])[i]||{m:null,u:"None"};if(was.m!==s.m||(was.u||"None")!==(s.u||"None"))ch.push({r,was,s})}));
    const up=STATS.filter((s,i)=>nt[i]>cur[i]+1e-9).length;
    o.innerHTML=`<div class="verdict yes"><span class="ic">✅</span><div><b>Yes, it can be improved</b><span>${ch.length} swap${ch.length===1?"":"s"} raise ${up} stat${up===1?"":"s"} without lowering any. ${proof}</span></div></div>
      <h3 class="sec">Swaps</h3><div class="swaps">${ch.map(c=>`<div class="sw" style="--rc:${rc(c.r)}"><span class="rr">${c.r}</span><span class="old">${mineHTML(c.was.m,c.was.u)}</span><span class="ar">→</span>${mineHTML(c.s.m,c.s.u)}</div>`).join("")}</div>
      <h3 class="sec">What it does</h3>${statTable(cur,nt)}
      <div class="acts"><button type="button" class="btn pri" id="toCmp">Compare in the Museum Planner</button><button type="button" class="btn" id="toPl">Open in the Museum Planner</button><button type="button" class="btn" id="cpTxt">Copy as text</button><button type="button" class="btn" id="toImg">Save as image</button></div>`;
    $("toImg").onclick=()=>ptSaveImg("Museum improvement",()=>resultImage({ok:true,ch,cur,nt,proof}));
    $("toCmp").onclick=()=>{try{window.parent.ptSendMuseum("compare",NEWB,"Improved")}catch(e){}};
    $("toPl").onclick=()=>{try{window.parent.ptSendMuseum("planner",NEWB,"Improved museum")}catch(e){}};
    $("cpTxt").onclick=()=>{const t=totalsOf(NEWB);const txt=ORDER.map(r=>r+": "+NEWB[r].map(x=>x.m?x.m+(x.u&&x.u!=="None"?" ("+x.u+")":""):"empty").join(", ")).join("\n")+"\n\nTotal: "+STATS.map((s,i)=>Math.abs(t[i])>1e-9?s+" "+fxT(t[i]):"").filter(Boolean).join(", ");
      try{navigator.clipboard.writeText(txt).then(()=>ptToast&&ptToast("Copied"))}catch(e){}};
    return}
  // nothing beats it on every stat: list the single swaps with the most gain, and what each costs
  const val=g=>g.reduce((a,v,i)=>a+v*W[i],0);const onBoard=new Set();ORDER.forEach(r=>(b[r]||[]).forEach(s=>s&&s.m&&onBoard.add(s.m)));const T=[];
  ORDER.forEach(r=>(b[r]||[]).forEach((s,i)=>{const g0=gainOf(r,s);opts[r].forEach(op=>{if(op.n!==s.m&&onBoard.has(op.n))return;if(op.n===s.m&&op.u===(s.u||"None"))return;
    const d=op.g.map((v,k)=>v-g0[k]);const v=val(d);if(v>1e-9)T.push({r,i,s,op,d,v})})}));
  T.sort((x,y)=>y.v-x.v);const seen=new Set(),from={},top=[];for(const t of T){const k=t.r+t.i;if(seen.has(t.op.n)||(from[k]||0)>=2)continue;seen.add(t.op.n);from[k]=(from[k]||0)+1;top.push(t);if(top.length>=8)break}
  const fxl=d=>STATS.map((s,i)=>Math.abs(d[i])>1e-9?`<span class="${d[i]>0?"up":"down"}">${s} ${sg(d[i])}</span>`:"").filter(Boolean).join(" · ");
  o.innerHTML=`<div class="verdict"><span class="ic">🏆</span><div><b>${res.done?"Your museum can't be improved":"No improvement found"}</b><span>${res.done?"Nothing beats it without lowering at least one stat, with the modifiers and minerals you allowed.":proof}</span></div></div>
    ${top.length?`<h3 class="sec">Best trades if you're happy to lose a little</h3><p class="hint">One display changed at a time, ranked by ${S.goal==="all"?"total gain (every stat counted by how much it grows)":S.goal==="have"?"total gain in the stats your museum boosts":S.goal}.</p><div class="acts" style="margin-top:0"><button type="button" class="btn" id="toImg">Save as image</button></div><div class="swaps" style="margin-top:6px">${top.map(t=>`<div class="trade" style="--rc:${rc(t.r)}"><div class="top"><span class="rr">${t.r}</span>${mineHTML(t.s.m,t.s.u)}<span class="ar">→</span>${mineHTML(t.op.n,t.op.u)}</div><div class="fx">${fxl(t.d)}</div></div>`).join("")}</div>`:'<p class="hint" style="margin-top:10px">No single swap gains more than it loses either.</p>'}`;
  const ib=document.getElementById("toImg");if(ib)ib.onclick=()=>ptSaveImg("Museum trades",()=>resultImage({ok:false,top}))}
// ---- the result as a picture (drawn in the dark style; the toolkit maps colours to your theme) ----
const IMGC={Common:"#a3adb8",Uncommon:"#6cc46e",Rare:"#68a6f0",Epic:"#b880ee",Legendary:"#f2b53a",Mythic:"#f0687f",Exotic:"#f17ad6"};
const loadImg=src=>new Promise(r=>{const i=new Image();i.onload=()=>r(i);i.onerror=()=>r(null);i.src=src});
function rr(c,x,y,w,h,r){c.beginPath();c.moveTo(x+r,y);c.arcTo(x+w,y,x+w,y+h,r);c.arcTo(x+w,y+h,x,y+h,r);c.arcTo(x,y+h,x,y,r);c.arcTo(x,y,x+w,y,r);c.closePath()}
function fit(c,t,max){t=String(t);if(c.measureText(t).width<=max)return t;while(t.length>1&&c.measureText(t+"…").width>max)t=t.slice(0,-1);return t+"…"}
async function resultImage(o){try{await document.fonts.ready}catch(e){}
  const F='"IBM Plex Sans","Segoe UI",system-ui,sans-serif',FD='"Chakra Petch","Segoe UI",system-ui,sans-serif',FM='"IBM Plex Mono",Consolas,monospace';
  const W=1100,PAD=36,RH=64,rows=o.ok?o.ch:o.top;const stats=o.ok?STATS.map((s,i)=>[s,o.cur[i],o.nt[i]]).filter(([,a,b])=>Math.abs(a)>1e-9||Math.abs(b)>1e-9):[];
  const H=PAD+110+28+Math.max(1,rows.length)*(RH+(o.ok?8:26))+(o.ok?52+stats.length*34:0)+40;
  const cv=document.createElement("canvas"),sc=2;cv.width=W*sc;cv.height=H*sc;const c=cv.getContext("2d");c.scale(sc,sc);
  c.fillStyle="#14181c";c.fillRect(0,0,W,H);
  c.fillStyle="#98a2ad";c.font=`600 12px ${F}`;c.fillText("MUSEUM IMPROVER",PAD,PAD+8);
  c.fillStyle=o.ok?"#3cc2a8":"#e6e9ec";c.font=`700 32px ${FD}`;c.fillText(o.ok?"Yes, it can be improved":"Can't be improved",PAD,PAD+44);
  c.fillStyle="#98a2ad";c.font=`14px ${F}`;
  const sub=o.ok?`${o.ch.length} swap${o.ch.length===1?"":"s"} raise ${STATS.filter((s,i)=>o.nt[i]>o.cur[i]+1e-9).length} stats without lowering any`:"Nothing beats it without lowering a stat. Best trades if you're happy to lose a little:";
  c.fillText(fit(c,sub,W-PAD*2-200),PAD,PAD+72);
  c.font=`600 13px ${F}`;const mb="Made by @__coastal";const mw=c.measureText(mb).width+28,mx=W-PAD-mw,my=PAD-6;c.fillStyle="rgba(20,184,166,.14)";rr(c,mx,my,mw,26,13);c.fill();c.strokeStyle="rgba(20,184,166,.6)";c.lineWidth=1;rr(c,mx,my,mw,26,13);c.stroke();c.fillStyle="#2dd4bf";c.fillText(mb,mx+20,my+17.5);c.fillStyle="#14b8a6";c.beginPath();c.arc(mx+12,my+13,3,0,Math.PI*2);c.fill();
  let y=PAD+110;c.fillStyle="#98a2ad";c.font=`600 12px ${F}`;c.fillText(o.ok?"SWAPS":"BEST TRADES",PAD,y);y+=14;
  const half=(W-PAD*2-150-40)/2;
  const mineral=async(n,u,x,yy,dim)=>{if(!n){c.fillStyle="#5d6670";c.font=`italic 14px ${F}`;c.fillText("Empty",x,yy+RH/2+5);return}const m=MIN[String(n).toLowerCase()];let tx=x;
    if(m&&m.ic){const im=await loadImg(m.ic);if(im){c.globalAlpha=dim?.6:1;c.drawImage(im,x,yy+10,44,44);c.globalAlpha=1}tx=x+54}
    c.fillStyle=dim?"#b9c2cb":"#e6e9ec";c.font=`700 16px ${FD}`;c.fillText(fit(c,n,half-60),tx,yy+30);c.fillStyle=u&&u!=="None"?"#3cc2a8":"#98a2ad";c.font=`600 11.5px ${F}`;c.fillText((u||"None").toUpperCase(),tx,yy+48)};
  for(const t of rows){const r=t.r,col=IMGC[r],was=o.ok?t.was:t.s,now=o.ok?t.s:{m:t.op.n,u:t.op.u},h=RH+(o.ok?0:18);
    c.fillStyle="#1c2126";rr(c,PAD,y,W-PAD*2,h,10);c.fill();c.strokeStyle="#2d343b";c.lineWidth=1;rr(c,PAD,y,W-PAD*2,h,10);c.stroke();c.fillStyle=col;rr(c,PAD,y,5,h,3);c.fill();
    c.fillStyle=col;c.font=`700 12px ${F}`;c.fillText(r.toUpperCase(),PAD+18,y+RH/2+4);
    await mineral(was.m,was.u,PAD+150,y,true);c.fillStyle="#98a2ad";c.font=`20px ${F}`;c.fillText("→",PAD+150+half+4,y+RH/2+7);await mineral(now.m,now.u,PAD+150+half+40,y,false);
    if(!o.ok){let x=PAD+150;c.font=`12.5px ${FM}`;STATS.forEach((s,i)=>{const d=t.d[i];if(Math.abs(d)<1e-9)return;const txt=`${s} ${sg(d)}`;c.fillStyle=d>0?"#3cc2a8":"#ef7a66";c.fillText(txt,x,y+RH+8);x+=c.measureText(txt).width+18})}
    y+=h+8}
  if(o.ok){y+=18;c.fillStyle="#98a2ad";c.font=`600 12px ${F}`;c.fillText("WHAT IT DOES",PAD,y);y+=10;
    const cx=[PAD+14,W-PAD-330,W-PAD-200,W-PAD-14];
    c.fillStyle="#98a2ad";c.font=`600 11px ${F}`;[["NOW",1],["AFTER",2],["CHANGE",3]].forEach(([t,i])=>c.fillText(t,cx[i]-c.measureText(t).width,y+2));y+=12;
    stats.forEach(([s,a,b],k)=>{const yy=y+k*34;c.fillStyle=k%2?"#171b1f":"#1c2126";rr(c,PAD,yy,W-PAD*2,30,6);c.fill();
      c.fillStyle="#e6e9ec";c.font=`14px ${F}`;c.fillText(s,cx[0],yy+20);c.font=`14px ${FM}`;c.fillStyle="#b9c2cb";
      const ra=(t,x)=>c.fillText(t,x-c.measureText(t).width,yy+20);ra(fxT(a),cx[1]);ra(fxT(b),cx[2]);const d=b-a,z=Math.abs(d)<1e-9;c.fillStyle=z?"#98a2ad":d>0?"#3cc2a8":"#ef7a66";c.font=`600 14px ${FM}`;ra(z?"same":sg(d),cx[3])})}
  return await new Promise(res=>cv.toBlob(res,"image/png"))}
drawInputs();
window.addEventListener("storage",()=>drawInputs());window.ptStoreChanged=()=>{};
})();
