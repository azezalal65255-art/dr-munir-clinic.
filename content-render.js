/* V12 public rendering from uploaded JSON files. Does not save user data. */
(()=>{'use strict';
const $=(s,root=document)=>root.querySelector(s);
const make=(tag,cls,text)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text!=null)e.textContent=String(text);return e};
const imageAllowed=s=>/^[\w-]+\.(jpg|png|jpeg|webp)$/i.test(s||'')?s:'photo-ultrasound.jpg';
const groupImages=['photo-ultrasound.jpg','photo-doppler.jpg','photo-biopsy.jpg','photo-catheters.jpg'];
const relUrl=u=>/^(https:\/\/|(?:[a-z0-9-]+\.html)(?:#[\w-]+)?$)/i.test(u||'')?u:'services-catalog.html';
const groupList=d=>Array.isArray(d?.groups)?d.groups.filter(g=>g.visible!==false):[];
function groupCard(g,i){const a=make('a','v12-service');a.href='services-catalog.html#'+encodeURIComponent(g.id);const img=make('img');img.src=imageAllowed(g.image||groupImages[i%4]);img.loading='lazy';img.alt='صورة توضيحية لمعدات '+g.title;const body=make('div');const h=make('h3',null,g.title);const count=(g.items||[]).filter(x=>x.visible!==false).length;const p=make('p',null,g.description||`مجموعة من ${count} فحصًا وإجراءً بحسب التقييم الطبي.`);const span=make('span','v12-link','عرض الفحوصات ←');body.append(h,p,span);a.append(img,body);return a}
function listGroup(g){const wrap=make('article','v12-group');wrap.id=g.id;const h=make('h2',null,g.title);wrap.append(h);if(g.description)wrap.append(make('p','v12-muted',g.description));const ol=make('ol');for(const x of g.items||[]){if(x.visible===false)continue;const li=make('li');const link=make('a','v13-exam-link',x.title);link.href=/^exam-\d{2}$/.test(x.id||'')?x.id+'.html':'services-catalog.html';li.append(link);ol.append(li)}wrap.append(ol);return wrap}
function homepage(d){const groups=groupList(d);const grid=$('[data-home-section="services"] .fx-grid');if(grid){grid.replaceChildren(...groups.map(groupCard))}
 const detail=$('[data-home-section="exams"] .fx-detail-grid');if(detail){detail.replaceChildren(...groups.map(g=>{const de=make('details','fx-detail');const sm=make('summary',null,g.title);sm.append(make('small',null,`${(g.items||[]).filter(x=>x.visible!==false).length} فحص/إجراء`));const ol=make('ol');for(const x of (g.items||[]).filter(x=>x.visible!==false).slice(0,3)){const li=make('li');const a=make('a','v13-exam-link',x.title);a.href=/^exam-\d{2}$/.test(x.id||'')?x.id+'.html':'services-catalog.html';li.append(a);ol.append(li)}const more=make('a','v12-link','عرض جميع فحوصات هذا القسم ←');more.href='services-catalog.html#'+encodeURIComponent(g.id);de.append(sm,ol,more);return de}))}
}
function legacyServices(d){const old=$('body[data-page="services"] .cards-3');if(!old)return;old.replaceChildren(...groupList(d).map(groupCard));const h=old.parentElement?.querySelector('h2');if(h)h.textContent='فحوصات العيادة حسب المجموعات الأربع الرسمية'}
function catalog(d){const root=$('#v12-services-catalog');if(!root)return;
 const search=$('#v12-service-search');const count=$('#v12-service-count');
 const draw=()=>{const q=(search?.value||'').trim().toLowerCase();root.replaceChildren();let hits=0;for(const g of groupList(d)){const visibleItems=(g.items||[]).filter(x=>x.visible!==false&&(x.title||'').toLowerCase().includes(q));if(!visibleItems.length&&q)continue;const grp={...g,items:visibleItems};root.append(listGroup(grp));hits+=visibleItems.length}if(count)count.textContent=`${hits} فحصًا وإجراءً`};search?.addEventListener('input',draw);draw();}
fetch('services-catalog.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw Error();return r.json()}).then(d=>{homepage(d);legacyServices(d);catalog(d)}).catch(()=>{const root=$('#v12-services-catalog');if(root)root.append(make('p',null,'تعذر تحميل القائمة. يرجى تحديث الصفحة أو التواصل مع العيادة.'))});
})();
