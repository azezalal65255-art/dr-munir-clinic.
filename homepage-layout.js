(()=>{'use strict';
const main=document.querySelector('main#main-content');if(!main)return;
const els=[...main.querySelectorAll(':scope > section[data-home-section]')];
const safe=t=>typeof t==='string'?t:'';
async function apply(){let data;try{const r=await fetch('homepage-layout.json?'+Date.now(),{cache:'no-store'});if(!r.ok)return;data=await r.json()}catch(e){return}
if(!Array.isArray(data.sections))return;
const byId=new Map(els.map(x=>[x.dataset.homeSection,x]));
for(const cfg of data.sections){if(!cfg||!byId.has(cfg.id))continue;const el=byId.get(cfg.id);el.hidden=cfg.visible===false;el.style.display=cfg.visible===false?'none':'';
const h=el.querySelector('h1,h2,h3');if(h&&typeof cfg.title==='string'&&cfg.title.trim())h.textContent=cfg.title;
main.appendChild(el);byId.delete(cfg.id)}
for(const el of byId.values())main.appendChild(el);
}
apply();
})();