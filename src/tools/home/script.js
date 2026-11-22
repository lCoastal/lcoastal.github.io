const $=id=>document.getElementById(id);
const go=id=>{try{window.parent.ptOpenTool(id)}catch(e){}};
document.addEventListener("click",e=>{const f=e.target.closest("[data-fid]");if(f){try{window.parent.ptCallTool("builds","ptOpenFeatured",f.dataset.fid)}catch(err){}return}
  const g=e.target.closest("[data-go]");if(!g)return;if(g.dataset.feat){try{window.parent.ptCallTool("builds","ptOpenFeatured","")}catch(err){}return}go(g.dataset.go)});
// small game pictures on the three jobs
[["bestbuild","Equipment","Guardian Pendant"],["calc","Equipment","Prismatic Star"],["planner","Mineral","Key of Life"]].forEach(([id,k,n])=>{let u="";try{u=window.parent.ptIcon?window.parent.ptIcon(k,n):""}catch(e){}if(!u&&k==="Mineral"){const m=MIN[n.toLowerCase()];u=m&&m.ic}if(u)$("ic-"+id).innerHTML=`<img src="${u}" alt="">`});
(async()=>{let list=[];try{const bw=await window.parent.ptBuildsWin();list=bw&&bw.ptFeaturedInfo?bw.ptFeaturedInfo():[]}catch(e){}
  $("feat").innerHTML=list.length?list.map(f=>`<button type="button" class="fc" data-fid="${esc(f.id)}"><b>${esc(f.t)}</b><span class="by">by ${esc(f.by)}</span><span class="g">${esc(f.goal)}</span><span class="o">${esc(f.odds)}</span></button>`).join(""):'<p class="hint">No featured builds yet.</p>'})();
