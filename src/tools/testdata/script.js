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
  list.forEach(x=>{const lo=c/tot,hi=(c+x.p)/tot;c+=x.p;o[x.m.n]=.2983*f(lo,hi,1)+.0885*f(lo,hi,Math.max(1,.1376*Math.pow(L,.9823)))+.6132*f(lo,hi,Math.max(1,1.3018*L))});return o}
const ZONES=Object.keys(LOC);
const zoneOf=z=>{z=String(z||"").trim().toLowerCase();return ZONES.find(k=>k.toLowerCase()===z)||ZONES.find(k=>baseLoc(k).toLowerCase()===z)||null};
// modifier model, same as Modifier Odds
const MODW=[["Perfect",.0001],["Lunar",.00025],["Mutated",.001],["Cosmic",.005],["Iridescent",.02],["Irradiated",.1],["Scorching",.25],["Glowing",.5],["Pure",.8],["Shiny",1]];
const NORMAL=new Set(MODW.map(x=>x[0])),NAT_MOD=.36,MODPTS=[[0,0],[113,.096],[600,.348],[926,.39]],anyMod=e=>{e=Math.max(0,+e||0);for(let i=1;i<MODPTS.length;i++)if(e<=MODPTS[i][0]){const [a,pa]=MODPTS[i-1],[b,pb]=MODPTS[i];return pa+(pb-pa)*(e-a)/(b-a)}return MODPTS[MODPTS.length-1][1]},MOD_K=10.12,MOD_LUCK=1/1000,MOD_MIX=[.338,.268,.394];
function modShares(mbx,night,luck){const list=MODW.filter(([k])=>night||k!=="Lunar"),tot=list.reduce((a,x)=>a+x[1],0);
  const f=N=>{let a=0;const o={};list.forEach(([k,w])=>{const p=w/tot;o[k]=Math.pow(1-a,N)-Math.pow(Math.max(0,1-a-p),N);a+=p});return o};
  const L=Math.max(1,MOD_K*Math.max(0,mbx)+Math.min(50,MOD_LUCK*Math.max(0,luck||0))),pt=[f(1),f(Math.max(1,L/2)),f(L)],s={};
  list.forEach(([k])=>s[k]=MOD_MIX[0]*pt[0][k]+MOD_MIX[1]*pt[1][k]+MOD_MIX[2]*pt[2][k]);return s}

const FIELDS=[["","Ignore"],["name","Mineral"],["zone","Zone"],["mod","Modifier"],["weight","Weight (kg)"],["size","Size Boost"],["luck","Total Luck"],["mb","Modifier Boost"],["cap","Capacity"]];
const GUESS=[["name",/^(name|mineral|ore|item)/i],["zone",/zone|location|place|spot/i],["mod",/modifier$|^mod$|^modifier|mutation/i],["mb",/mod.*boost|modifier.*boost/i],["weight",/weight|kg|mass/i],["size",/size/i],["luck",/luck/i],["cap",/cap/i]];
let RAW="",ROWS=[],HEAD=[],MAP=[],LAST="";
const num=v=>{const n=parseFloat(String(v==null?"":v).replace(/[^0-9.eE+-]/g,""));return isFinite(n)?n:NaN};
const med=a=>{if(!a.length)return NaN;const s=[...a].sort((x,y)=>x-y),h=s.length>>1;return s.length%2?s[h]:(s[h-1]+s[h])/2};
const pct=(x,d=2)=>isFinite(x)?(x*100).toFixed(d)+"%":"–";
const fx=(x,d=2)=>isFinite(x)?x.toFixed(d)+"×":"–";

function detectSep(t){const lines=t.split(/\r?\n/).filter(l=>l.trim()).slice(0,20);let best="|",sc=-1;
  ["|","\t",",",";"].forEach(s=>{const c=lines.map(l=>l.split(s).length);const m=Math.min(...c);if(m>1&&m>sc&&c.every(x=>x===c[0]||x>=m)){sc=m;best=s}});return best}
function parse(){const sv=$("sep").value,sep=sv==="auto"?detectSep(RAW):sv;
  const lines=RAW.split(/\r?\n/).filter(l=>l.trim());const cells=lines.map(l=>l.split(sep).map(c=>c.trim()));
  const w=Math.max(0,...cells.map(r=>r.length));
  // a header line has no numbers where the next lines do
  if(!parse.touched){const f=cells[0]||[],s=cells[1]||[];$("hasHead").checked=f.some((c,i)=>isNaN(num(c))&&!isNaN(num(s[i])))||f.some(c=>GUESS.some(g=>g[1].test(c)))}
  const hh=$("hasHead").checked;HEAD=hh?cells[0]:[];ROWS=hh?cells.slice(1):cells;
  if(MAP.length!==w)guess(w);drawMap(w);
  $("fileInfo").textContent=ROWS.length.toLocaleString()+" rows · "+w+" columns · separator "+(sep==="\t"?"Tab":sep)}
function guess(w){MAP=Array(w).fill("");const used=new Set();
  for(let i=0;i<w;i++){const h=HEAD[i]||"";for(const[k,re]of GUESS){if(!used.has(k)&&re.test(h)&&!(k==="mod"&&/boost/i.test(h))&&!(k==="cap"&&/luck/i.test(h))){MAP[i]=k;used.add(k);break}}}
  // no header: look at the values
  for(let i=0;i<w;i++){if(MAP[i])continue;const vals=ROWS.slice(0,200).map(r=>r[i]||"").filter(Boolean);if(!vals.length)continue;
    const hit=f=>vals.filter(f).length/vals.length;let k="";
    if(!used.has("name")&&hit(v=>MIN[v.toLowerCase()])>.6)k="name";
    else if(!used.has("zone")&&hit(v=>zoneOf(v))>.6)k="zone";
    else if(!used.has("mod")&&hit(v=>NORMAL.has(v)||/^none$/i.test(v))>.4)k="mod";
    if(k){MAP[i]=k;used.add(k)}}}
function drawMap(w){let h='<div class="cols">';
  for(let i=0;i<w;i++){const ex=ROWS.slice(0,3).map(r=>r[i]||"").filter(Boolean).join(" · ");
    h+=`<label class="col${MAP[i]?" used":""}"><b>${esc(HEAD[i]||"Column "+(i+1))}</b><span class="ex">${esc(ex||"(empty)")}</span><select data-i="${i}">${FIELDS.map(([k,l])=>`<option value="${k}"${MAP[i]===k?" selected":""}>${l}</option>`).join("")}</select></label>`}
  $("map").innerHTML=h+"</div>";$("mapCard").hidden=false;
  const has=MAP.includes("name");$("run").disabled=!has;$("runInfo").textContent=has?"":"Pick which column is the mineral first."}
$("map").addEventListener("change",e=>{const s=e.target.closest("select");if(!s)return;const i=+s.dataset.i,v=s.value;
  if(v)MAP=MAP.map((x,j)=>x===v&&j!==i?"":x);MAP[i]=v;drawMap(MAP.length)});
$("sep").onchange=()=>{MAP=[];parse()};$("hasHead").onchange=()=>{parse.touched=true;MAP=[];parse()};$("reguess").onclick=()=>{MAP=[];parse()};
function load(t){RAW=t||"";parse.touched=false;MAP=[];$("outCard").hidden=true;if(!RAW.trim()){$("mapCard").hidden=true;$("fileInfo").textContent="";return}parse()}
$("pick").onclick=()=>$("file").click();
const readFile=f=>{if(!f)return;const r=new FileReader();r.onload=()=>{$("paste").value=String(r.result).slice(0,20000);load(String(r.result))};r.readAsText(f)};
$("file").onchange=e=>readFile(e.target.files[0]);
const dz=$("drop");["dragenter","dragover"].forEach(ev=>dz.addEventListener(ev,e=>{e.preventDefault();dz.classList.add("on")}));
["dragleave","drop"].forEach(ev=>dz.addEventListener(ev,e=>{e.preventDefault();dz.classList.remove("on")}));
dz.addEventListener("drop",e=>readFile(e.dataTransfer.files[0]));
let pt;$("paste").addEventListener("input",()=>{clearTimeout(pt);pt=setTimeout(()=>load($("paste").value),300)});

function run(){const col=k=>MAP.indexOf(k),g=(r,k)=>{const i=col(k);return i<0?"":r[i]||""};
  const rows=ROWS.map(r=>({name:g(r,"name"),zone:g(r,"zone"),mod:g(r,"mod"),w:num(g(r,"weight")),sb:num(g(r,"size")),luck:num(g(r,"luck")),mb:num(g(r,"mb")),cap:num(g(r,"cap"))})).filter(r=>r.name);
  const known=rows.filter(r=>MIN[r.name.toLowerCase()]),unknown={};rows.forEach(r=>{if(!MIN[r.name.toLowerCase()])unknown[r.name]=(unknown[r.name]||0)+1});
  let h="",txt=[];const sumBits=[`<b>${rows.length.toLocaleString()}</b> rows`];
  // ---- drop rates
  if(col("zone")>=0){const byZ={},noZ={};known.forEach(r=>{const z=zoneOf(r.zone);if(z)(byZ[z]=byZ[z]||[]).push(r);else if(r.zone)noZ[r.zone]=(noZ[r.zone]||0)+1});
    h+='<h3 class="sec">Drop rates</h3>';txt.push("DROP RATES");
    Object.entries(byZ).sort((a,b)=>b[1].length-a[1].length).forEach(([z,rs])=>{const ls=rs.map(r=>r.luck).filter(isFinite),L=ls.length?med(ls):1;
      const ex=dropShares(z,L),cnt={};rs.forEach(r=>{const n=MIN[r.name.toLowerCase()].n;cnt[n]=(cnt[n]||0)+1});const N=rs.length;
      const names=[...new Set([...Object.keys(ex),...Object.keys(cnt)])].sort((a,b)=>(ex[b]||0)-(ex[a]||0)||(cnt[b]||0)-(cnt[a]||0));
      h+=`<p class="note"><b>${esc(z)}</b> · ${N.toLocaleString()} rows · luck ${isFinite(L)&&ls.length?Math.round(L).toLocaleString():"not given (1 used)"}</p><div class="tw"><table class="t"><tr><th>Mineral</th><th>Seen</th><th>Your rate</th><th>Toolkit</th><th>Ratio</th></tr>`;
      txt.push(`${z} (${N} rows, luck ${Math.round(L)})`);
      names.forEach(n=>{const c=cnt[n]||0,o=c/N,e=ex[n],m=MIN[n.toLowerCase()],r=e>0?o/e:NaN,thin=e>0?e*N<10:c<10;
        const cls=!isFinite(r)?"off":thin?"":Math.abs(r-1)<.15?"ok":Math.abs(r-1)>.35?"off":"";
        h+=`<tr><td><span class="mn">${m&&m.ic?`<img src="${m.ic}" alt="">`:""}${esc(n)}${thin?' <span class="thin">thin data</span>':""}</span></td><td>${c.toLocaleString()}</td><td>${pct(o)}</td><td>${e>0?pct(e):"not listed"}</td><td class="${cls}">${fx(r)}</td></tr>`;
        txt.push(`  ${n}: ${c} seen, ${pct(o)} vs ${e>0?pct(e):"not listed"}, ${fx(r)}${thin?" (thin)":""}`)});
      h+="</table></div>"});
    const nz=Object.keys(noZ);if(nz.length)h+=`<p class="note">Zones the toolkit doesn't know, left out: ${esc(nz.join(", "))}</p>`;
    if(!Object.keys(byZ).length)h+='<p class="note">None of the zone names matched a zone the toolkit knows.</p>';
    sumBits.push(`<b>${Object.keys(byZ).length}</b> zones checked`)}
  // ---- modifiers
  if(col("mod")>=0){const N=rows.length,isNone=v=>!v||/^(none|no|-|n\/a|normal)$/i.test(v);
    const cnt={};let any=0,norm=0;rows.forEach(r=>{if(isNone(r.mod))return;any++;cnt[r.mod]=(cnt[r.mod]||0)+1;if(NORMAL.has(r.mod))norm++});
    const mbs=rows.map(r=>r.mb).filter(isFinite),ls=rows.map(r=>r.luck).filter(isFinite),MB=mbs.length?med(mbs):NaN,LK=ls.length?med(ls):0;
    const sh=isFinite(MB)?modShares(MB,!!cnt.Lunar,LK):null;
    h+=`<h3 class="sec">Modifiers</h3><p class="note">${pct(any/N,1)} of your minerals had a modifier, ${pct(norm/N,1)} a normal panning one. The toolkit expects ${pct(isFinite(MB)?anyMod(MB*100):NAT_MOD,0)} for normal ones${isFinite(MB)?` · Modifier Boost ${MB.toFixed(2)}×`:" · add the Modifier Boost column to compare the split"}.</p>`;
    txt.push("","MODIFIERS",`any: ${pct(any/N,1)}, normal: ${pct(norm/N,1)} (toolkit ${pct(isFinite(MB)?anyMod(MB*100):NAT_MOD,0)})${isFinite(MB)?", modifier boost "+MB.toFixed(2)+"x":""}`);
    h+='<div class="tw"><table class="t"><tr><th>Modifier</th><th>Seen</th><th>Share of normal</th><th>Toolkit</th><th>Ratio</th></tr>';
    const keys=[...MODW.map(x=>x[0]).reverse().filter(k=>cnt[k]||(sh&&sh[k]!=null)),...Object.keys(cnt).filter(k=>!NORMAL.has(k)).sort((a,b)=>cnt[b]-cnt[a])];
    keys.forEach(k=>{const c=cnt[k]||0,isN=NORMAL.has(k),o=isN&&norm?c/norm:NaN,e=isN&&sh?sh[k]:NaN,r=o/e,thin=c<10;
      const cls=!isN||!isFinite(r)||thin?"":Math.abs(r-1)<.2?"ok":Math.abs(r-1)>.5?"off":"";
      h+=`<tr><td>${esc(k)}${isN?"":' <span class="thin">event / other</span>'}${thin&&isN?' <span class="thin">thin data</span>':""}</td><td>${c.toLocaleString()}</td><td>${isN?pct(o):pct(c/N)+" of all"}</td><td>${isN&&sh?pct(e):"–"}</td><td class="${cls}">${isN?fx(r):"–"}</td></tr>`;
      txt.push(`  ${k}: ${c}${isN?`, ${pct(o)} vs ${sh?pct(e):"–"}, ${fx(r)}`:" (event/other)"}`)});
    h+="</table></div>";sumBits.push(`<b>${pct(any/N,1)}</b> modified`)}
  // ---- weights
  if(col("weight")>=0){const by={};known.forEach(r=>{const m=MIN[r.name.toLowerCase()];if(!(m.bw>0)||!(r.w>0))return;(by[m.n]=by[m.n]||[]).push(r)});
    const all=Object.values(by).flat().map(r=>r.w/MIN[r.name.toLowerCase()].bw);
    if(all.length){const sbs=Object.values(by).flat().map(r=>r.sb).filter(isFinite);
      h+=`<h3 class="sec">Weights</h3><p class="note">Weight ÷ base weight across ${all.length.toLocaleString()} minerals: median ${med(all).toFixed(1)}, top ${Math.max(...all).toFixed(1)}${sbs.length?` · Size Boost ${med(sbs).toFixed(2)}×`:""}.</p><div class="tw"><table class="t"><tr><th>Mineral</th><th>Seen</th><th>Base</th><th>Median kg</th><th>Heaviest kg</th><th>Median ÷ base</th></tr>`;
      txt.push("","WEIGHTS (weight / base weight)",`all: median ${med(all).toFixed(1)}, top ${Math.max(...all).toFixed(1)}`);
      Object.entries(by).sort((a,b)=>b[1].length-a[1].length).forEach(([n,rs])=>{const m=MIN[n.toLowerCase()],ws=rs.map(r=>r.w),q=med(ws)/m.bw;
        h+=`<tr><td><span class="mn">${m.ic?`<img src="${m.ic}" alt="">`:""}${esc(n)}${rs.length<10?' <span class="thin">thin data</span>':""}</span></td><td>${rs.length.toLocaleString()}</td><td>${m.bw}</td><td>${med(ws).toFixed(2)}</td><td>${Math.max(...ws).toFixed(2)}</td><td>${q.toFixed(1)}</td></tr>`;
        txt.push(`  ${n}: ${rs.length} seen, base ${m.bw}, median ${med(ws).toFixed(2)} kg, max ${Math.max(...ws).toFixed(2)} kg, ${q.toFixed(1)}x base`)});
      h+="</table></div>"}}
  const uk=Object.keys(unknown);if(uk.length)h+=`<p class="note">Names the toolkit doesn't know, left out of drop rates and weights: ${esc(uk.slice(0,20).join(", "))}${uk.length>20?" …":""}</p>`;
  if(!h)h='<p class="note">Map at least one of Zone, Modifier or Weight to get a comparison.</p>';
  $("sum").innerHTML=sumBits.join(" · ");$("out").innerHTML=h;$("outCard").hidden=false;LAST=txt.join("\n");
  $("outCard").scrollIntoView({behavior:"smooth",block:"start"})}
$("run").onclick=run;
$("copyOut").onclick=async()=>{const b=$("copyOut");try{await navigator.clipboard.writeText(LAST)}catch(e){const t=document.createElement("textarea");t.value=LAST;document.body.appendChild(t);t.select();try{document.execCommand("copy")}catch(_){}t.remove()}
  b.textContent="Copied";setTimeout(()=>b.textContent="Copy as text",1200)};
})();
