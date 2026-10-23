/* V18: keep search/language tools inside header, never floating over hero. */
(()=>{'use strict';
function init(){
 const header=document.querySelector('.v15-header'),row=header?.querySelector('.v15-hrow'),tools=document.querySelector('.v8-tools');
 if(row&&tools&&tools.parentElement!==row){row.appendChild(tools)}
 // Prevent duplicate reservation buttons obscuring important text.
 const w=document.querySelector('.v15-sticky-wa');if(w){w.setAttribute('aria-label','الحجز عبر واتساب')}
 const menu=header?.querySelector('.v15-menu-toggle');menu?.setAttribute('aria-label','فتح وإغلاق قائمة التنقل');
 document.querySelectorAll('img:not([fetchpriority="high"])').forEach(img=>{if(!img.hasAttribute('loading'))img.loading='lazy';img.decoding='async'});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();