
const PW=window.parent;
const get=()=>{try{return PW.ptSettings()}catch(e){return {compact:false,short:false,dec:2,scroll:true}}};
const set=(k,v)=>{try{PW.ptSetSetting(k,v)}catch(e){}draw()};
const UN=[["Qi",1e18],["Qa",1e15],["T",1e12],["B",1e9],["M",1e6]];
const sh=(n,d)=>{for(const [u,x] of UN)if(n>=x){let v=(n/x).toFixed(d);if(v.includes("."))v=v.replace(/0+$/,"").replace(/\.$/,"");return v+u}return n.toLocaleString("en-US")};
const ACC=(()=>{try{return PW.PT_ACCENTS}catch(e){return null}})()||{teal:["Teal","#0f7c6b","#3cc2a8"]};
document.getElementById("acc").innerHTML=Object.entries(ACC).map(([k,[n,l,d]])=>`<button type="button" class="swb" role="radio" data-a="${k}" style="--l:${l};--d:${d}" aria-label="${n}" title="${n}"></button>`).join("");
function draw(){const c=get();
  document.querySelectorAll("#imgm [data-m]").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.m===(c.img||"save"))));
  document.querySelectorAll("#thm [data-t]").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.t===(c.theme||"auto"))));
  document.querySelectorAll("#acc [data-a]").forEach(b=>b.setAttribute("aria-checked",String(b.dataset.a===(c.accent||"teal"))));
  document.getElementById("accN").textContent=(ACC[c.accent||"teal"]||ACC.teal)[0];
  document.querySelectorAll(".sw[data-k]").forEach(b=>b.setAttribute("aria-checked",String(c[b.dataset.k]!==false&&!!c[b.dataset.k])));
  document.querySelectorAll("#dec [data-d]").forEach(b=>b.setAttribute("aria-pressed",String(+b.dataset.d===+c.dec)));
  document.getElementById("dec").setAttribute("aria-disabled",String(!c.short));
  document.getElementById("ex1").textContent=c.short?`$1,000,000,000 → $${sh(1e9,c.dec)}`:"$1,000,000,000 stays as it is";
  document.getElementById("ex2").textContent=`~1 in 64,543,541,734 → ~1 in ${sh(64543541734,c.dec)}`;
  const rv=c.recent===undefined?8:+c.recent;document.querySelectorAll("#rec [data-r]").forEach(b=>b.setAttribute("aria-pressed",String(+b.dataset.r===rv)));
  if(!REC){const k=document.getElementById("hkNow");k.classList.remove("rec");k.textContent=lab(c.hk);document.getElementById("hkSet").textContent="Change"}
  const h=c.hk||{};document.getElementById("hkReset").hidden=!!h.ctrl&&!h.alt&&!h.shift&&!h.meta&&String(h.key).toLowerCase()==="k"}
// record a new shortcut: modifiers plus one key, two keys at most; Esc cancels
let REC=false;const lab=h=>{try{return PW.ptHkLabel(h)}catch(e){return "Ctrl + K"}};
const MODS=["Control","Alt","Shift","Meta","AltGraph","OS"];
function msg(t,bad){const m=document.getElementById("hkMsg");m.textContent=t||"";m.classList.toggle("bad",!!bad)}
function stopRec(){REC=false;try{PW.ptHkRecording=false}catch(e){}draw()}
document.getElementById("hkSet").onclick=()=>{if(REC){stopRec();msg("");return}REC=true;try{PW.ptHkRecording=true}catch(e){}const k=document.getElementById("hkNow");k.classList.add("rec");k.textContent="Press keys…";document.getElementById("hkSet").textContent="Cancel";msg("Press the key or keys you want. Esc cancels.")};
document.getElementById("hkReset").onclick=()=>{set("hk",{ctrl:true,key:"k"});msg("Back to "+lab({ctrl:true,key:"k"})+".")};
document.addEventListener("keydown",e=>{if(!REC)return;e.preventDefault();e.stopPropagation();
  const k=document.getElementById("hkNow");
  if(e.key==="Escape"){stopRec();msg("");return}
  if(MODS.includes(e.key)){k.textContent=lab({ctrl:e.ctrlKey,alt:e.altKey,shift:e.shiftKey,meta:e.metaKey,key:""})+" + …";return}
  const printable=e.key.length===1;
  const h={ctrl:e.ctrlKey,alt:e.altKey,shift:e.shiftKey&&!printable?true:false,meta:e.metaKey,key:e.key.length===1?e.key.toLowerCase():e.key};
  // a capital letter or a symbol typed with Shift still counts Shift as one of the two keys
  if(e.shiftKey&&printable)h.shift=true;
  const n=[h.ctrl,h.alt,h.shift,h.meta].filter(Boolean).length+1;
  if(n>2){k.textContent=lab(h);msg("That's "+n+" keys. Use one key, or two pressed together.",true);return}
  if(n===1&&["Tab","Enter","Backspace"," "].includes(e.key)){msg("That key is needed for typing. Pick another, or add Ctrl or Alt.",true);return}
  set("hk",h);stopRec();msg("Search now opens with "+lab(h)+".")},true);
document.addEventListener("click",e=>{const s=e.target.closest(".sw[data-k]");if(s){set(s.dataset.k,s.getAttribute("aria-checked")!=="true");return}
  const d=e.target.closest("#dec [data-d]");if(d){set("dec",+d.dataset.d);return}
  const r=e.target.closest("#rec [data-r]");if(r){set("recent",+r.dataset.r);return}
  const im=e.target.closest("#imgm [data-m]");if(im){set("img",im.dataset.m);return}
  const t=e.target.closest("#thm [data-t]");if(t){set("theme",t.dataset.t);return}
  const a=e.target.closest("#acc [data-a]");if(a)set("accent",a.dataset.a)});
draw();
