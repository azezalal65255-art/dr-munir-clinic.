/* V12 — public renderer; no user-supplied text is ever interpreted as HTML */
(()=>{'use strict';
const $=(s,r=document)=>r.querySelector(s),all=(s,r=document)=>[...r.querySelectorAll(s)];
const fetchJSON=async path=>{const r=await fetch(path,{cache:'no-cache'});if(!r.ok)throw Error('Could not load '+path);return r.json()};
const el=(tag,cls,text)=>{const v=document.createElement(tag);if(cls)v.className=cls;if(text!==undefined)v.textContent=String(text||'');return v};
const safeImage=src=>typeof src==='string'&&/^[a-z0-9][a-z0-9_.-]{0,90}\.(jpg|jpeg|png|webp|avif)$/i.test(src)?src:'photo-ultrasound.jpg';
const normal=str=>String(str||'').trim().toLocaleLowerCase('ar').replace(/[أإآ]/g,'ا').replace(/ة/g,'ه');
const showErr=(root,msg)=>{root.replaceChildren(el('p','v12-empty',msg))};
const image=(src,alt,cls)=>{const img=el('img',cls);img.src=safeImage(src);img.loading='lazy';img.decoding='async';img.alt=alt||'صورة فوتوغرافية توضيحية لأجهزة التصوير الطبي، لا تمثل حالة مريض';img.onerror=()=>{if(img.src&&!img.src.endsWith('/photo-ultrasound.jpg'))img.src='photo-ultrasound.jpg'};return img};
const btn=(text,url,cls='v12-link')=>{const a=el('a',cls,text);a.href=url;return a};
const countVisible=g=>(g.items||[]).filter(x=>x.visible!==false).length;
const makeServiceCard=g=>{const art=el('article','v12-card');art.append(image(g.image));const b=el('div','v12-card-body');b.append(el('span','v12-chip',countVisible(g)+' فحصًا / إجراءً'));b.append(el('h3','',g.title));b.append(el('p','',g.description));b.append(btn('عرض فحوصات القسم ←','services-catalog.html#'+encodeURIComponent(g.id)));art.append(b);return art};
const makeDiseaseCard=a=>{const card=el('article','v12-card');card.append(image(a.image));const body=el('div','v12-card-body');body.append(el('span','v12-chip',a.category||'توعية طبية'),el('h3','',a.title),el('p','',a.overview||''),btn('قراءة المقال ←','disease.html?id='+encodeURIComponent(a.id)));card.append(body);return card};
function applyHome(layout,catalog,awareness){
 const main=$('main#main-content');if(!main)return;
 const sections=all(':scope > section[data-home-section]',main),byId=new Map(sections.map(x=>[x.dataset.homeSection,x]));
 const styles={auto:'',white:'v12-quiet',soft:'v12-soft'};
 const cfgs=Array.isArray(layout.sections)?layout.sections:[];
 cfgs.forEach((cfg,index)=>{const node=byId.get(cfg.id);if(!node)return;node.hidden=cfg.visible===false;
  node.classList.remove('v12-quiet','v12-soft');if(styles[cfg.style])node.classList.add(styles[cfg.style]);
  const h=$('h1,h2',node);if(h&&typeof cfg.title==='string'&&cfg.title.trim())h.textContent=cfg.title;
  const lead=$('[data-v12-subtitle],.fx-lead,.v8-subtitle,.fx-sub',node);if(lead&&typeof cfg.subtitle==='string'&&cfg.subtitle.trim())lead.textContent=cfg.subtitle;
  if((cfg.id==='home-section-1'||cfg.id==='doctor')&&typeof cfg.image==='string'&&cfg.image.trim()){const target=cfg.id==='home-section-1'?$('.fx-slide:first-child .fx-hero-img img',node):$('img',node);if(target)target.src=safeImage(cfg.image)}
  main.append(node);byId.delete(cfg.id);
 });
 for(const node of byId.values())main.append(node);
 if(layout.appearance&&/^#[0-9a-f]{6}$/i.test(layout.appearance.primary||''))document.documentElement.style.setProperty('--v12-primary',layout.appearance.primary);
 const groups=(catalog.groups||[]).filter(g=>g.visible!==false);
 const homeGroups=$('#v12-home-groups');if(homeGroups){homeGroups.replaceChildren();groups.slice(0,4).forEach(g=>homeGroups.append(makeServiceCard(g)))}
 const examTeaser=$('#v12-exam-teaser');if(examTeaser){examTeaser.replaceChildren();groups.slice(0,4).forEach(g=>{const c=el('p','v12-muted',(g.title||'')+' — '+countVisible(g)+' فحصًا');examTeaser.append(c)})}
 const featured=$('#v12-home-awareness');if(featured){featured.replaceChildren();let articles=(awareness.articles||[]).filter(x=>x.visible!==false&&x.featured===true);
 if(!articles.length)articles=(awareness.articles||[]).filter(x=>x.visible!==false);
 const setting=cfgs.find(x=>x.id==='awareness'),n=Math.min(6,Math.max(1,Number(setting&&setting.featuredCount||layout.appearance?.homepageArticleLimit||3)));
 articles.slice(0,n).forEach(a=>featured.append(makeDiseaseCard(a)))}
 const meter=$('#v12-services-count');if(meter)meter.textContent=groups.reduce((s,g)=>s+countVisible(g),0)+' فحصًا وإجراءً موزعة على '+groups.length+' أقسام';
}
function catalogPage(data){const root=$('#v12-catalog'),input=$('#v12-catalog-query'),counter=$('#v12-catalog-count');if(!root)return;
 const groups=data.groups||[];
 function draw(){const q=normal(input?.value);root.replaceChildren();let total=0;
 groups.filter(g=>g.visible!==false).forEach(g=>{const items=(g.items||[]).filter(it=>it.visible!==false&&(!q||normal(it.title+' '+g.title).includes(q)));
 if(!items.length)return;total+=items.length;
 const section=el('section','v12-group');section.id=g.id;
 const head=el('div','v12-group-head');head.append(image(g.image));const info=el('div');info.append(el('h2','',g.title),el('p','',g.description));head.append(info);section.append(head);
 const list=el('div','v12-exams');items.forEach((it,i)=>{const item=el('div','v12-exam');item.append(el('span','v12-num',String(i+1)));item.append(btn(it.title,'booking.html?service='+encodeURIComponent(it.title),'v12-exam-link'));list.append(item)});
 section.append(list);root.append(section)
 });if(counter)counter.textContent=total+' فحصًا أو إجراءً ظاهرًا';if(!total)showErr(root,'لم نعثر على فحوص تطابق البحث.')}
 input?.addEventListener('input',draw);draw()}
function awarenessPage(data){const root=$('#v12-topics'),input=$('#v12-topic-query'),select=$('#v12-topic-category'),counter=$('#v12-topic-count');if(!root)return;
 const articles=(data.articles||[]).filter(a=>a.visible!==false);
 if(select){[...new Set(articles.map(a=>a.category||'عام'))].forEach(n=>{const o=el('option','',n);o.value=n;select.append(o)})}
 function draw(){const q=normal(input?.value),category=select?.value||'';const selected=articles.filter(a=>(!q||normal(a.title+' '+a.overview+' '+a.category).includes(q))&&(!category||a.category===category));root.replaceChildren();selected.forEach(a=>root.append(makeDiseaseCard(a)));if(counter)counter.textContent=selected.length+' مقالًا';if(!selected.length)showErr(root,'لا توجد مقالات تطابق البحث.')}
 input?.addEventListener('input',draw);select?.addEventListener('change',draw);draw()}
function articlePage(data){const root=$('#v12-article');if(!root)return;
 const id=new URLSearchParams(location.search).get('id');const art=(data.articles||[]).find(a=>a.id===id&&a.visible!==false);
 if(!art){showErr(root,'هذا المقال غير موجود أو مخفي.');return}
 document.title=art.title+' | التوعية الطبية — عيادة د. منير الشكري';
 root.replaceChildren();root.append(el('span','v12-chip',art.category||'التوعية الطبية'),el('h1','',art.title));
 root.append(image(art.image,art.imageAlt||'صورة لأجهزة تصوير طبي توضيحية','v12-hero-img'));
 root.append(el('p','v12-caption','صورة فوتوغرافية إيضاحية لفحص أو جهاز طبي، وليست صورة تشخيصية للحالة أو للمريض.'));
 const banner=el('div','v12-disclaimer','المعلومات للتوعية العامة ولا تكفي للتشخيص أو تحديد العلاج، ويجب مراجعتها طبيًا قبل اعتمادها باسم العيادة.');root.append(banner);
 const fields=[['overview','ما الحالة؟'],['causes','الأسباب والعوامل المرتبطة'],['symptoms','الأعراض والعلامات المحتملة'],['diagnosis','كيف يساعد السونار أو الدوبلر في التقييم؟'],['preparation','ما الذي ينبغي معرفته قبل الفحص؟'],['care','خيارات المتابعة والعلاج'],['prevention','نصائح وتوضيحات مهمة'],['urgent','متى تستدعي الحالة رعاية عاجلة؟'],['faq','سؤال شائع']];
 fields.forEach(([key,title])=>{if(!art[key])return;const sec=el('section');sec.append(el('h2','',title),el('p','',art[key]));if(key==='urgent')sec.className='v12-alert v12-danger';root.append(sec)});
 const refs=(art.sources||[]).filter(r=>r.url&&/^https:\/\//.test(r.url));if(refs.length){root.append(el('h2','','مصادر موثوقة للمراجعة'));const ul=el('ul','v12-source-list');refs.forEach(ref=>{const li=el('li'),a=btn(ref.title||'مصدر طبي',ref.url);a.target='_blank';a.rel='noopener noreferrer';li.append(a);ul.append(li)});root.append(ul)}
 const actions=el('div','v12-actions');actions.append(btn('استعرض قائمة الفحوصات','services-catalog.html','v12-cta'),btn('اطلب موعدًا عبر واتساب','booking.html','v12-cta alt'));root.append(actions);
}
async function init(){const page=document.body.dataset.v12Page;
 if(page==='home'){try{const [layout,catalog,articles]=await Promise.all([fetchJSON('homepage-layout.json'),fetchJSON('services-catalog.json'),fetchJSON('awareness-content.json')]);applyHome(layout,catalog,articles)}catch(e){console.warn('V12 could not load JSON:',e)}}
 if(page==='catalog')try{catalogPage(await fetchJSON('services-catalog.json'))}catch{const root=$('#v12-catalog');if(root)showErr(root,'تعذر تحميل القائمة. تأكد من رفع services-catalog.json إلى GitHub.')}
 if(page==='awareness')try{awarenessPage(await fetchJSON('awareness-content.json'))}catch{const root=$('#v12-topics');if(root)showErr(root,'تعذر تحميل المقالات. تأكد من رفع awareness-content.json إلى GitHub.')}
 if(page==='article')try{articlePage(await fetchJSON('awareness-content.json'))}catch{const root=$('#v12-article');if(root)showErr(root,'تعذر تحميل المقال من الموقع.')}
}
init();
})();
