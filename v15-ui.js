(()=>{'use strict';const header=document.querySelector('.v15-header');if(!header)return;
const toggle=header.querySelector('.v15-menu-toggle'),nav=header.querySelector('.v15-nav');
function close(){header.dataset.open='false';toggle?.setAttribute('aria-expanded','false')}
toggle?.addEventListener('click',()=>{const open=header.dataset.open!=='true';header.dataset.open=String(open);toggle.setAttribute('aria-expanded',String(open))});
nav?.addEventListener('click',e=>{if(e.target.closest('a'))close()});document.addEventListener('keydown',e=>{if(e.key==='Escape')close()});document.addEventListener('click',e=>{if(!header.contains(e.target))close()});
const active=location.pathname.split('/').pop()||'index.html';nav?.querySelectorAll('[data-route]').forEach(a=>{if(a.dataset.route===active||(active.startsWith('exam-')&&a.dataset.route==='services-catalog.html')||(active==='health-article.html'&&a.dataset.route==='awareness-topics.html'))a.setAttribute('aria-current','page')});
})();