(()=>{
const $=id=>document.getElementById(id);
const MIN=Object.fromEntries(P.mins.map(m=>[m.n.toLowerCase(),m]));
// drop tables per zone, same as the luck tools use
const LOC={};P.mins.forEach(m=>(m.ch||[]).forEach(c=>{const p=parseFloat(String(c[1]).replace(/[%,]/g,""))/100;if(p>0)(LOC[c[0]]=LOC[c[0]]||[]).push({m,p})}));
const baseLoc=n=>n.replace(/\s*\((inside|outside) Firefly Zones\)/,"").replace(/\s*\(when in the loot pool\)/,"");
function fullList(loc){const b=baseLoc(loc),own=LOC[loc]||[];let out;
  if(b!==loc&&LOC[b])out=LOC[b].filter(x=>!own.some(y=>y.m===x.m)).concat(own);
  else if(own.length<2){const seen=new Set();out=[];Object.keys(LOC).filter(v=>v!==loc&&baseLoc(v)===loc).forEach(v=>LOC[v].concat(own).forEach(x=>{if(!seen.has(x.m)){seen.add(x.m);out.push(x)}}))}
  else out=[...own];return out.length<2?[]:out}
function dropShares(loc,L){const list=fullList(loc).sort((a,b)=>a.p-b.p),tot=list.reduce((s,x)=>s+x.p,0);let c=0;L=Math.max(1,L);
  const f=(lo,hi,l)=>Math.pow(1-lo,l)-Math.pow(1-hi,l),o={};
  list.forEach(x=>{const [lo,hi,sn]=tieSpan(list,x,tot);o[x.m.n]=(.2891*f(lo,hi,1)+.0280*f(lo,hi,Math.max(1,.04317*L))+.1905*f(lo,hi,Math.max(1,.40579*L))+.4924*f(lo,hi,Math.max(1,1.74153*L)))/sn*rareBand(tot/x.p)});return o}
const ZONES=Object.keys(LOC);
const zoneOf=z=>{z=String(z||"").trim().toLowerCase();return ZONES.find(k=>k.toLowerCase()===z)||ZONES.find(k=>baseLoc(k).toLowerCase()===z)||null};
// modifier model, same as Modifier Odds
const MODW=[["Perfect",.0001],["Lunar",.00025],["Mutated",.001],["Cosmic",.005],["Iridescent",.02],["Irradiated",.1],["Scorching",.25],["Glowing",.5],["Pure",.8],["Shiny",1]];
const NORMAL=new Set(MODW.map(x=>x[0])),NAT_MOD=.36,anyMod=e=>1-Math.pow(1-.0631,Math.max(0,+e||0)/100);
function modShares(mbx,night,luck){const list=MODW.filter(([k])=>night||k!=="Lunar"),tot=list.reduce((a,x)=>a+x[1],0);
  const f=N=>{let a=0;const o={};list.forEach(([k,w])=>{const p=w/tot;o[k]=Math.pow(1-a,N)-Math.pow(Math.max(0,1-a-p),N);a+=p});return o};
  const L=Math.max(1,11.662*Math.pow(Math.max(0,mbx),.838)+1.96352*Math.max(0,luck||0)/1000),pt=[f(1),f(Math.max(1,L*.172)),f(L)],s={};
  list.forEach(([k])=>s[k]=.313*pt[0][k]+.127*pt[1][k]+.559*pt[2][k]);return s}

const FIELDS=[["","Ignore"],["name","Mineral"],["zone","Zone"],["mod","Modifier"],["weight","Weight (kg)"],["size","Size Boost"],["luck","Total Luck"],["mb","Modifier Boost"],["cap","Capacity"],["pan","Pan number"]];
const GUESS=[["name",/^(name|mineral|ore|item)/i],["zone",/zone|location|place|spot/i],["mod",/modifier$|^mod$|^modifier|mutation/i],["mb",/mod.*boost|modifier.*boost/i],["weight",/weight|kg|mass/i],["size",/size/i],["luck",/luck/i],["cap",/cap/i],["pan",/^pan(\s*(no|#|number|id))?$/i]];
let RAW="",ROWS=[],HEAD=[],MAP=[],LAST="";
const num=v=>{const n=parseFloat(String(v==null?"":v).replace(/[^0-9.eE+-]/g,""));return isFinite(n)?n:NaN};
// min/max without spreading (spreading hundreds of thousands of values overflows the call stack)
const mn=a=>{let m=Infinity;for(let i=0;i<a.length;i++)if(a[i]<m)m=a[i];return m},mx=a=>{let m=-Infinity;for(let i=0;i<a.length;i++)if(a[i]>m)m=a[i];return m};
const med=a=>{if(!a.length)return NaN;const s=[...a].sort((x,y)=>x-y),h=s.length>>1;return s.length%2?s[h]:(s[h-1]+s[h])/2};
const pct=(x,d=2)=>isFinite(x)?(x*100).toFixed(d)+"%":"–";
const fx=(x,d=2)=>isFinite(x)?x.toFixed(d)+"×":"–";

// split one line, honouring "quoted" cells (CSV exports wrap every cell in quotes, "" inside means a quote)
function splitLine(l,sep){if(l.indexOf('"')<0)return l.split(sep).map(c=>c.trim());
  const out=[];let cur="",q=false;
  for(let i=0;i<l.length;i++){const ch=l[i];
    if(q){if(ch==='"'){if(l[i+1]==='"'){cur+='"';i++}else q=false}else cur+=ch}
    else if(ch==='"'&&!cur.trim())q=true,cur="";
    else if(l.startsWith(sep,i)){out.push(cur.trim());cur="";i+=sep.length-1}
    else cur+=ch}
  out.push(cur.trim());return out}
function detectSep(t){const lines=t.split(/\r?\n/).filter(l=>l.trim()).slice(0,20);let best="|",sc=-1;
  ["|","\t",",",";"].forEach(s=>{const c=lines.map(l=>splitLine(l,s).length);const m=mn(c);if(m>1&&m>sc&&c.every(x=>x===c[0]||x>=m)){sc=m;best=s}});return best}
function parse(){const sv=$("sep").value,sep=sv==="auto"?detectSep(RAW):sv;
  const lines=RAW.split(/\r?\n/).filter(l=>l.trim());const cells=lines.map(l=>splitLine(l,sep));
  const w=Math.max(0,mx(cells.map(r=>r.length)));
  // a header line has no numbers where the next lines do
  if(!parse.touched){const f=cells[0]||[],s=cells[1]||[];$("hasHead").checked=f.some((c,i)=>isNaN(num(c))&&!isNaN(num(s[i])))||f.some(c=>GUESS.some(g=>g[1].test(c)))}
  const hh=$("hasHead").checked;HEAD=hh?cells[0]:[];ROWS=hh?cells.slice(1):cells;
  if(MAP.length!==w)guess(w);drawMap(w);
  $("fileInfo").textContent=ROWS.length.toLocaleString()+" rows, "+w+" columns, separator "+(sep==="\t"?"Tab":sep)}
function guess(w){MAP=Array(w).fill("");const used=new Set();
  for(let i=0;i<w;i++){const h=HEAD[i]||"";for(const[k,re]of GUESS){if(!used.has(k)&&re.test(h)&&!(k==="mod"&&/boost/i.test(h))&&!(k==="cap"&&/luck/i.test(h))){MAP[i]=k;used.add(k);break}}}
  // no header: look at the values
  for(let i=0;i<w;i++){if(MAP[i])continue;const vals=ROWS.slice(0,200).map(r=>r[i]||"").filter(Boolean);if(!vals.length)continue;
    const hit=f=>vals.filter(f).length/vals.length;let k="";
    if(!used.has("name")&&hit(v=>MIN[v.toLowerCase()])>.6)k="name";
    else if(!used.has("zone")&&hit(v=>zoneOf(v))>.6)k="zone";
    else if(!used.has("mod")&&hit(v=>NORMAL.has(v)||/^(none|unknown)$/i.test(v))>.4)k="mod";
    if(k){MAP[i]=k;used.add(k)}}
  // numbers without a header: tell the columns apart by how their values behave
  const st=[];for(let i=0;i<w;i++){if(MAP[i])continue;const raw=ROWS.slice(0,2000).map(r=>r[i]||"").filter(v=>v&&!/^(unknown|none|n\/a|nan|-)$/i.test(v));
    if(!raw.length||raw.some(v=>/[:\/]/.test(v))||raw.filter(v=>isNaN(+v)).length>raw.length*.02)continue;const v=raw.map(Number).filter(isFinite),d=new Set(v).size;
    let up=0;for(let j=1;j<v.length;j++)if(v[j]>=v[j-1])up++;
    st.push({i,int:v.every(Number.isInteger),med:med(v),d,n:v.length,mono:up>=v.length-2})}
  const take=(k,f,by)=>{if(used.has(k))return;const cs=st.filter(x=>!MAP[x.i]&&f(x));if(by)cs.sort(by);const c=cs[0];if(c){MAP[c.i]=k;used.add(k)}};
  take("pan",x=>x.int&&x.mono&&x.d>1&&x.d<x.n/3);
  take("weight",x=>!x.int&&x.d>x.n*.5&&x.med<1e4);
  take("luck",x=>!x.int&&x.med>=500);
  take("size",x=>!x.int&&x.med>=1&&x.med<500&&x.d<=x.n*.2);
  take("mb",x=>!x.int&&x.med>=1&&x.med<500&&x.d<=x.n*.2);
  take("cap",x=>x.int&&x.med>=50&&x.d<=Math.max(3,x.n*.01),(a,b)=>a.d-b.d);
  if(!used.has("luck"))take("luck",x=>x.med>=500&&x.d<=x.n*.2&&MAP.indexOf("cap")!==x.i)}
function drawMap(w){let h='<div class="cols">';
  for(let i=0;i<w;i++){const ex=ROWS.slice(0,3).map(r=>r[i]||"").filter(Boolean).join(", ");
    h+=`<label class="col${MAP[i]?" used":""}"><b>${esc(HEAD[i]||"Column "+(i+1))}</b><span class="ex">${esc(ex||"(empty)")}</span><select data-i="${i}">${FIELDS.map(([k,l])=>`<option value="${k}"${MAP[i]===k?" selected":""}>${l}</option>`).join("")}</select></label>`}
  $("map").innerHTML=h+"</div>";$("mapCard").hidden=false;
  const has=MAP.includes("name");$("run").disabled=!has;$("runInfo").textContent=has?"":"Pick which column is the mineral first."}
$("map").addEventListener("change",e=>{const s=e.target.closest("select");if(!s)return;const i=+s.dataset.i,v=s.value;
  if(v)MAP=MAP.map((x,j)=>x===v&&j!==i?"":x);MAP[i]=v;drawMap(MAP.length)});
$("sep").onchange=()=>{MAP=[];parse()};$("hasHead").onchange=()=>{parse.touched=true;MAP=[];parse()};$("reguess").onclick=()=>{MAP=[];parse()};
function load(t){RAW=t||"";parse.touched=false;MAP=[];$("outCard").hidden=true;if(!RAW.trim()){$("mapCard").hidden=true;$("fileInfo").textContent="";return}parse()}
$("pick").onclick=()=>$("file").click();
const PREV=200000;let FROMFILE=false;
const readFile=f=>{if(!f)return;const r=new FileReader();r.onload=()=>{const t=String(r.result);FROMFILE=t.length>PREV;$("paste").value=FROMFILE?t.slice(0,t.lastIndexOf("\n",PREV)):t;load(t);
  if(FROMFILE)$("fileInfo").textContent+=", whole file used, the box above only shows the start"};r.readAsText(f)};
$("file").onchange=e=>readFile(e.target.files[0]);
const dz=$("drop");["dragenter","dragover"].forEach(ev=>dz.addEventListener(ev,e=>{e.preventDefault();dz.classList.add("on")}));
["dragleave","drop"].forEach(ev=>dz.addEventListener(ev,e=>{e.preventDefault();dz.classList.remove("on")}));
dz.addEventListener("drop",e=>readFile(e.dataTransfer.files[0]));
let pt;$("paste").addEventListener("input",()=>{clearTimeout(pt);pt=setTimeout(()=>{FROMFILE=false;load($("paste").value)},300)});
// pasting into a box that holds a file preview replaces it instead of mixing the two
$("paste").addEventListener("paste",e=>{const t=e.clipboardData&&e.clipboardData.getData("text");if(!t)return;const a=$("paste");if(a.selectionStart===a.selectionEnd&&a.value.trim()){e.preventDefault();a.value=t;a.dispatchEvent(new Event("input"))}});

function run(){const col=k=>MAP.indexOf(k),g=(r,k)=>{const i=col(k);return i<0?"":r[i]||""};
  const ZAL={"abyssal depths":"Abyssal Depth","the magma furnace":"Magma Furnace","rubble creek":"Rubble Creek Sands"};const zn=z=>ZAL[String(z).trim().toLowerCase()]||z;
  const rows=ROWS.map(r=>({name:g(r,"name"),zone:zn(g(r,"zone")),mod:g(r,"mod"),w:num(g(r,"weight")),sb:num(g(r,"size")),luck:num(g(r,"luck")),mb:num(g(r,"mb")),cap:num(g(r,"cap")),pan:g(r,"pan")})).filter(r=>r.name);
  const named=rows.filter(r=>MIN[r.name.toLowerCase()]),unknown={};rows.forEach(r=>{if(!MIN[r.name.toLowerCase()])unknown[r.name]=(unknown[r.name]||0)+1});
  // minerals that can't drop in the zone they were logged in didn't come from panning there
  // (usually taken out of storage or the museum, traded, or a chest), so they stay out of drop rates and weights
  const ZSEL=$("zoneAll").value,canDrop={},stray={};
  const known=named.filter(r=>{const z=col("zone")>=0?zoneOf(r.zone):ZSEL;if(!z)return true;
    if(!canDrop[z]){canDrop[z]=new Set(fullList(z).map(x=>x.m.n));Object.keys(LOC).forEach(k=>{if(baseLoc(k)===z)LOC[k].forEach(x=>canDrop[z].add(x.m.n))})}if(!canDrop[z].size)return true;
    const n=MIN[r.name.toLowerCase()].n;if(canDrop[z].has(n))return true;const k=n+" in "+z;stray[k]=(stray[k]||0)+1;return false});
  let h="",txt=[];const sumBits=[`<b>${rows.length.toLocaleString()}</b> rows`];
  // ---- drop rates
  const ZALL=$("zoneAll").value;if(col("zone")>=0||ZALL){const byZ={},noZ={};known.forEach(r=>{const z=col("zone")>=0?zoneOf(r.zone):ZALL;if(z)(byZ[z]=byZ[z]||[]).push(r);else if(r.zone)noZ[r.zone]=(noZ[r.zone]||0)+1});
    h+='<h3 class="sec">Drop rates</h3>';txt.push("DROP RATES");
    Object.entries(byZ).sort((a,b)=>b[1].length-a[1].length).forEach(([z,rs])=>{const ls=rs.map(r=>r.luck).filter(isFinite),L=ls.length?med(ls):1;
      // expected rate averaged over every row's own luck (bucketed ~2% apart so it stays fast)
      const bk=new Map();rs.forEach(r=>{const l=isFinite(r.luck)&&r.luck>0?r.luck:L,k=Math.round(Math.log(Math.max(1,l))/.02);bk.set(k,(bk.get(k)||0)+1)});
      const ex={};bk.forEach((n,k)=>{const d=dropShares(z,Math.exp(k*.02));for(const m in d)ex[m]=(ex[m]||0)+d[m]*n/rs.length});const cnt={};rs.forEach(r=>{const n=MIN[r.name.toLowerCase()].n;cnt[n]=(cnt[n]||0)+1});const N=rs.length;
      const names=[...new Set([...Object.keys(ex),...Object.keys(cnt)])].sort((a,b)=>(ex[b]||0)-(ex[a]||0)||(cnt[b]||0)-(cnt[a]||0));
      h+=`<p class="note"><b>${esc(z)}</b>, ${N.toLocaleString()} rows, luck ${ls.length?(mn(ls)===mx(ls)?Math.round(L).toLocaleString():Math.round(mn(ls)).toLocaleString()+" – "+Math.round(mx(ls)).toLocaleString()+" (each row's own luck used)"):"not given (1 used)"}</p><div class="tw"><table class="t"><tr><th>Mineral</th><th>Seen</th><th>Your rate</th><th>Toolkit</th><th>Ratio</th></tr>`;
      txt.push(`${z} (${N} rows, luck ${Math.round(L)})`);
      names.forEach(n=>{const c=cnt[n]||0,o=c/N,e=ex[n],m=MIN[n.toLowerCase()],r=e>0?o/e:NaN,thin=e>0?e*N<10:c<10;
        const cls=!isFinite(r)?"off":thin?"":Math.abs(r-1)<.15?"ok":Math.abs(r-1)>.35?"off":"";
        h+=`<tr><td><span class="mn">${m&&m.ic?`<img src="${m.ic}" alt="">`:""}${esc(n)}${thin?' <span class="thin">thin data</span>':""}</span></td><td>${c.toLocaleString()}</td><td>${pct(o)}</td><td>${e>0?pct(e):"not listed"}</td><td class="${cls}">${fx(r)}</td></tr>`;
        txt.push(`  ${n}: ${c} seen, ${pct(o)} vs ${e>0?pct(e):"not listed"}, ${fx(r)}${thin?" (thin)":""}`)});
      h+="</table></div>"});
    const nz=Object.keys(noZ);if(nz.length)h+=`<p class="note">Zones the toolkit doesn't know, left out: ${esc(nz.join(", "))}</p>`;
    if(!Object.keys(byZ).length)h+='<p class="note">None of the zone names matched a zone the toolkit knows.</p>';
    sumBits.push(`<b>${Object.keys(byZ).length}</b> zones checked`)}
  // ---- items per pan
  if(col("pan")>=0){const per=new Map();rows.forEach(r=>{if(r.pan==="")return;const k=r.pan;let o=per.get(k);if(!o){o={n:0,cap:r.cap};per.set(k,o)}o.n++});
    const byCap=new Map();per.forEach(o=>{const c=isFinite(o.cap)?o.cap:NaN,k=isFinite(c)?c:"?";let g=byCap.get(k);if(!g){g=[];byCap.set(k,g)}g.push(o.n)});
    const all=[...per.values()].map(o=>o.n);
    if(all.length){const avg=a=>a.reduce((x,y)=>x+y,0)/a.length;
      h+=`<h3 class="sec">Items per pan</h3><p class="note">${all.length.toLocaleString()} pans, ${avg(all).toFixed(2)} items per pan on average. The first and last pan may be cut off by when logging started or stopped.</p><div class="tw"><table class="t"><tr><th>Capacity</th><th>Pans</th><th>Average</th><th>Fewest – most</th><th>Toolkit</th><th>Ratio</th></tr>`;
      txt.push("","ITEMS PER PAN",`${all.length} pans, average ${avg(all).toFixed(2)}`);
      [...byCap.entries()].sort((a,b)=>b[1].length-a[1].length).forEach(([c,a])=>{const m=avg(a),e=c==="?"?NaN:panItems(c),r=m/e,thin=a.length<20;
        const cls=!isFinite(r)||thin?"":Math.abs(r-1)<.03?"ok":Math.abs(r-1)>.1?"off":"";
        h+=`<tr><td>${c==="?"?"not given":Number(c).toLocaleString()}${thin?' <span class="thin">thin data</span>':""}</td><td>${a.length.toLocaleString()}</td><td>${m.toFixed(2)}</td><td>${mn(a)} – ${mx(a)}</td><td>${isFinite(e)?e.toFixed(2):"–"}</td><td class="${cls}">${fx(r,3)}</td></tr>`;
        txt.push(`  capacity ${c}: ${a.length} pans, ${m.toFixed(2)} avg vs ${isFinite(e)?e.toFixed(2):"-"}, ${fx(r,3)}`)});
      h+="</table></div>";sumBits.push(`<b>${avg(all).toFixed(1)}</b> items per pan`)}}
  // ---- modifiers
  if(col("mod")>=0){const N=rows.length,isNone=v=>!v||/^(none|no|-|n\/a|normal|unknown)$/i.test(v);
    const cnt={};let any=0,norm=0;rows.forEach(r=>{if(isNone(r.mod))return;any++;cnt[r.mod]=(cnt[r.mod]||0)+1;if(NORMAL.has(r.mod))norm++});
    const mbs=rows.map(r=>r.mb).filter(isFinite),ls=rows.map(r=>r.luck).filter(isFinite),MB=mbs.length?med(mbs):NaN,LK=ls.length?med(ls):0;
    const sh=isFinite(MB)?modShares(MB,!!cnt.Lunar,LK):null;
    h+=`<h3 class="sec">Modifiers</h3><p class="note">${pct(any/N,1)} of your minerals had a modifier, ${pct(norm/N,1)} a normal panning one. The toolkit expects ${pct(isFinite(MB)?anyMod(MB*100):NAT_MOD,0)} for normal ones${isFinite(MB)?`, Modifier Boost ${MB.toFixed(2)}×`:", add the Modifier Boost column to compare the split"}.</p>`;
    txt.push("","MODIFIERS",`any: ${pct(any/N,1)}, normal: ${pct(norm/N,1)} (toolkit ${pct(isFinite(MB)?anyMod(MB*100):NAT_MOD,0)})${isFinite(MB)?", modifier boost "+MB.toFixed(2)+"x":""}`);
    h+='<div class="tw"><table class="t"><tr><th>Modifier</th><th>Seen</th><th>Share of normal</th><th>Toolkit</th><th>Ratio</th></tr>';
    const keys=[...MODW.map(x=>x[0]).reverse().filter(k=>cnt[k]||(sh&&sh[k]!=null)),...Object.keys(cnt).filter(k=>!NORMAL.has(k)).sort((a,b)=>cnt[b]-cnt[a])];
    keys.forEach(k=>{const c=cnt[k]||0,isN=NORMAL.has(k),o=isN&&norm?c/norm:NaN,e=isN&&sh?sh[k]:NaN,r=o/e,thin=c<10;
      const cls=!isN||!isFinite(r)||thin?"":Math.abs(r-1)<.2?"ok":Math.abs(r-1)>.5?"off":"";
      h+=`<tr><td>${esc(k)}${isN?"":' <span class="thin">event / other</span>'}${thin&&isN?' <span class="thin">thin data</span>':""}</td><td>${c.toLocaleString()}</td><td>${isN?pct(o):pct(c/N)+" of all"}</td><td>${isN&&sh?pct(e):"–"}</td><td class="${cls}">${isN?fx(r):"–"}</td></tr>`;
      txt.push(`  ${k}: ${c}${isN?`, ${pct(o)} vs ${sh?pct(e):"–"}, ${fx(r)}`:" (event/other)"}`)});
    h+="</table></div>";sumBits.push(`<b>${pct(any/N,1)}</b> modified`)}
  // ---- weights: game range is 0.75 to 17 × base weight × (1 + Size Boost) × the zone's size factor
  if(col("weight")>=0){const WMIN=.75,WMAX=17,by={},hasZ=col("zone")>=0||!!ZALL,zk=r=>(col("zone")>=0?zoneOf(r.zone):ZALL)||"";known.forEach(r=>{const m=MIN[r.name.toLowerCase()];if(!(m.bw>0)||!(r.w>0))return;const k=m.n+"\u0001"+zk(r);(by[k]=by[k]||[]).push(r)});
    const flat=Object.values(by).flat(),all=flat.map(r=>r.w/MIN[r.name.toLowerCase()].bw);
    if(all.length){const sbs=flat.map(r=>r.sb).filter(isFinite),hasS=sbs.length>0,S=hasS?med(sbs):NaN;
      const q=r=>r.w/(MIN[r.name.toLowerCase()].bw*(1+r.sb)*zoneSize(zk(r)));
      const allQ=hasS?flat.filter(r=>isFinite(r.sb)).map(q):[];let out=0;allQ.forEach(x=>{if(x<WMIN*.995||x>WMAX*1.005)out++});
      const pc=x=>isFinite(x)?(x*100).toFixed(1)+"%":"–";
      h+=`<h3 class="sec">Weights</h3><p class="note">The game rolls weights from <b>0.75 × base × (1 + Size Boost)</b> up to <b>17 × base × (1 + Size Boost)</b>, times the zone's size factor (×0.80 to ×1.20) when the file has a Zone column. Each row is one mineral in one zone. Its lightest and heaviest are the ones closest to their limits, each measured against its own Size Boost and zone, so the possible column matches the percentage.${hasS?` Size Boost ${S.toFixed(2)}×. ${out?`<b>${out.toLocaleString()}</b> minerals fell outside that range: a base weight is probably off.`:"Every mineral fell inside that range."}`:" Add the Size Boost column to compare against it."}<br>Smallest and biggest show how close your lightest and heaviest got to the limits: 100% means it hit the limit.</p><div class="tw"><table class="t"><tr><th>Mineral</th>${hasZ?"<th>Zone</th>":""}<th>Seen</th><th>Base</th><th>Lightest kg</th><th>Smallest possible</th><th>Smallest</th><th>Heaviest kg</th><th>Biggest possible</th><th>Biggest</th></tr>`;
      txt.push("","WEIGHTS (range 0.75 to 17 x base x (1 + size boost) x zone factor)"+(hasS?`, size boost ${S.toFixed(2)}x, ${out} outside`:""));
      const tot={};Object.entries(by).forEach(([k,rs])=>{const n=k.split("\u0001")[0];tot[n]=(tot[n]||0)+rs.length});
      Object.entries(by).sort((a,b)=>{const[na,za]=a[0].split("\u0001"),[nb,zb]=b[0].split("\u0001");return tot[nb]-tot[na]||na.localeCompare(nb)||b[1].length-a[1].length||za.localeCompare(zb)}).forEach(([k,rs])=>{const[n,zn]=k.split("\u0001"),m=MIN[n.toLowerCase()],ws=rs.map(r=>r.w);
        // compare each mineral with the limits for its own Size Boost and zone; show the one closest to each limit
        const rq=hasS?rs.filter(r=>isFinite(r.sb)):[];let rl=null,rh=null;rq.forEach(r=>{const v=q(r);if(!rl||v<rl.v)rl={r,v};if(!rh||v>rh.v)rh={r,v}});
        const ql=rl?rl.v:NaN,qh=rh?rh.v:NaN,lim=(r,k)=>k*m.bw*(1+r.sb)*zoneSize(zk(r));
        const smin=rl?lim(rl.r,WMIN):NaN,smax=rh?lim(rh.r,WMAX):NaN,ps=ql/WMIN,pb=qh/WMAX,lo=rl?rl.r.w:mn(ws),hi=rh?rh.r.w:mx(ws);
        // smallest: 100% = hit the floor, above = never got that light; biggest: 100% = hit the ceiling
        const cs=!isFinite(ps)?"":ps<.995?"off":ps<=1.05?"ok":"",cb=!isFinite(pb)?"":pb>1.005?"off":pb>=.95?"ok":"";
        h+=`<tr><td><span class="mn">${m.ic?`<img src="${m.ic}" alt="">`:""}${esc(n)}${rs.length<10?' <span class="thin">thin data</span>':""}</span></td>${hasZ?`<td>${esc(zn||"–")}${zn?` <span class="thin">×${zoneSize(zn).toFixed(2)}</span>`:""}</td>`:""}<td>${rs.length.toLocaleString()}</td><td>${m.bw}</td><td>${lo.toFixed(2)}</td><td>${isFinite(smin)?smin.toFixed(2):"–"}</td><td class="${cs}">${pc(ps)}</td><td>${hi.toFixed(2)}</td><td>${isFinite(smax)?smax.toFixed(2):"–"}</td><td class="${cb}">${pc(pb)}</td></tr>`;
        txt.push(`  ${n}${hasZ?` in ${zn||"unknown zone"}`:""}: ${rs.length} seen, base ${m.bw}, lightest ${lo.toFixed(2)} kg (${pc(ps)} of smallest possible), heaviest ${hi.toFixed(2)} kg (${pc(pb)} of biggest possible)`)});
      h+="</table></div>"}}
  const sk=Object.entries(stray).sort((a,b)=>b[1]-a[1]),sn=sk.reduce((t,x)=>t+x[1],0);
  if(sn){h+=`<p class="note"><b>${sn.toLocaleString()}</b> mineral${sn===1?"":"s"} can't drop in the zone ${sn===1?"it was":"they were"} logged in, so ${sn===1?"it's":"they're"} left out of drop rates and weights. They usually come from taking minerals out of storage or the museum, trades or chests, not panning: ${esc(sk.slice(0,8).map(([k,c])=>k+" ×"+c.toLocaleString()).join(", "))}${sk.length>8?", …":""}.</p>`;
    txt.push("",`LEFT OUT (can't drop in the zone they were logged in): ${sn}`,...sk.map(([k,c])=>`  ${k}: ${c}`))}
  const uk=Object.keys(unknown);if(uk.length)h+=`<p class="note">Names the toolkit doesn't know, left out of drop rates and weights: ${esc(uk.slice(0,20).join(", "))}${uk.length>20?" …":""}</p>`;
  if(!h)h='<p class="note">Map at least one of Zone, Modifier, Weight or Pan number to get a comparison.</p>';
  $("sum").innerHTML=sumBits.join(", ");$("out").innerHTML=h;$("outCard").hidden=false;LAST=txt.join("\n");
  $("outCard").scrollIntoView({behavior:"smooth",block:"start"})}
$("zoneAll").insertAdjacentHTML("beforeend",ZONES.slice().sort().map(z=>`<option>${esc(z)}</option>`).join(""));
$("run").onclick=run;
$("copyOut").onclick=async()=>{const b=$("copyOut");try{await navigator.clipboard.writeText(LAST)}catch(e){const t=document.createElement("textarea");t.value=LAST;document.body.appendChild(t);t.select();try{document.execCommand("copy")}catch(_){}t.remove()}
  b.textContent="Copied";setTimeout(()=>b.textContent="Copy as text",1200)};
})();
