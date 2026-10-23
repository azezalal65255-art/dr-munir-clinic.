/* V12 homepage layout engine: read-only published configuration; no public editing */
(()=>{'use strict';
const main=document.querySelector('main#main-content'); if(!main)return;
const fixed=new Map([...main.querySelectorAll(':scope > section[data-home-section]')].map(x=>[x.dataset.homeSection,x]));
const defaultMainTitle=new Map([...fixed].map(([id,el])=>[id,el.querySelector('h1,h2,h3')?.textContent||'']));
const externalLink=u=>/^(https:\/\/|mailto:|tel:|(?:[a-z0-9-]+\.html)(?:#[\w-]+)?$|^#[\w-]+$)/i.test(u||'')?u:'#contact';
const validImg=u=>/^[\w-]+\.(?:jpg|jpeg|png|webp)$/i.test(u||'')?u:'photo-ultrasound.jpg';
const v=(t,len=400)=>typeof t==='string'?t.slice(0,len):'';
function custom(cfg){
 const sec=document.createElement('section');sec.className='v12-custom';sec.dataset.homeSection=cfg.id;
 const div=document.createElement('div');div.className='v12-container';
 const wrap=document.createElement('div');wrap.className='v12-custom-inner';
 if(cfg.image){const im=document.createElement('img');im.src=validImg(cfg.image);im.alt=v(cfg.imageAlt)||'صورة طبية إيضاحية';im.loading='lazy';wrap.append(im)}
 const content=document.createElement('div');const h=document.createElement('h2');h.textContent=v(cfg.title);content.append(h);
 const p=document.createElement('p');p.textContent=v(cfg.subtitle,900);content.append(p);
 if(cfg.linkLabel){const a=document.createElement('a');a.className='v12-link';a.href=externalLink(cfg.link);a.textContent=v(cfg.linkLabel);content.append(a)}
 wrap.append(content);div.append(wrap);sec.append(div);return sec;
}
function apply(d){
 if(!d||!Array.isArray(d.sections))return;
 const sections=[...d.sections].sort((a,b)=>(Number(a.order)||0)-(Number(b.order)||0));
 const seen=new Set();
 for(const cfg of sections){if(!cfg||typeof cfg.id!=='string'||seen.has(cfg.id))continue;seen.add(cfg.id);
  let el=fixed.get(cfg.id);
  if(!el){if(cfg.kind!=='custom'||!/^custom-[a-z\d-]+$/i.test(cfg.id))continue;el=custom(cfg)}
  el.hidden=cfg.visible===false;el.style.display=cfg.visible===false?'none':'';
  if(fixed.has(cfg.id)){
   const h=el.querySelector('h1,h2,h3');if(h)h.textContent=(typeof cfg.title==='string'&&cfg.title.trim())?v(cfg.title):defaultMainTitle.get(cfg.id);
   if(cfg.subtitle&&cfg.id!=='home-section-1'){
    const p=el.querySelector('.fx-lead,.v8-lead');if(p)p.textContent=v(cfg.subtitle,900);
   }
  }
  main.appendChild(el);
 }
 for(const [id,el] of fixed)if(!seen.has(id))main.appendChild(el);
 // إبقاء بطاقات معلومات العيادة بعد أول قسم رئيسي وليس فوق السلايدر
 const stats=main.querySelector(':scope > .fx-stats');const hero=main.querySelector('[data-home-section="home-section-1"]');if(stats&&hero)hero.after(stats);
 if(d.appearance){
   const hex=/^#[0-9a-f]{6}$/i;
   const root=document.documentElement;
   if(hex.test(d.appearance.primary||''))root.style.setProperty('--v12-primary',d.appearance.primary);
   if(hex.test(d.appearance.accent||''))root.style.setProperty('--v12-accent',d.appearance.accent);
 }
}
fetch('homepage-layout.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw Error();return r.json()}).then(apply).catch(()=>{});
})();
