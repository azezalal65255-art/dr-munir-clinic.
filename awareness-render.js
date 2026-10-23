/* V12 articles; all text inserted as text, no raw HTML to prevent content injection. */
(()=>{'use strict';
const $=s=>document.querySelector(s);const make=(t,c,txt)=>{const e=document.createElement(t);if(c)e.className=c;if(txt!==undefined)e.textContent=String(txt);return e};
const imgSafe=x=>/^[a-z\d_-]+\.(jpg|jpeg|png|webp)$/i.test(x||'')?x:'photo-ultrasound.jpg';
const articleUrl=x=>'health-article.html?id='+encodeURIComponent(x.id);
function card(a){const c=make('article','v12-article-card');const link=make('a');link.href=articleUrl(a);
const image=make('img');image.src=imgSafe(a.image);image.alt=a.imageAlt||'صورة توضيحية لمعدات الفحص الطبي';image.loading='lazy';link.append(image);const body=make('div','v12-article-body');body.append(make('small',null,a.category||'معلومات طبية'),make('h3',null,a.title),make('p',null,a.overview||''));const more=make('a','v12-link','اقرأ الموضوع ←');more.href=articleUrl(a);body.append(more);c.append(link,body);return c}
function cards(root,articles,limit=0){if(!root)return;root.replaceChildren(...(limit?articles.slice(0,limit):articles).map(card));if(!articles.length)root.append(make('p',null,'لا توجد موضوعات مطابقة لبحثك.'))}
function all(articles){const grid=$('#v12-awareness-grid');if(!grid)return;
const search=$('#v12-awareness-search'),select=$('#v12-awareness-category');const categories=[...new Set(articles.map(a=>a.category).filter(Boolean))];if(select){for(const cat of categories){const opt=make('option',null,cat);opt.value=cat;select.append(opt)}}
const draw=()=>{const q=(search?.value||'').trim().toLowerCase();const cat=select?.value||'';const matches=articles.filter(a=>(!cat||a.category===cat)&&(!q||(a.title+' '+a.overview+' '+a.symptoms).toLowerCase().includes(q)));cards(grid,matches);const count=$('#v12-awareness-count');if(count)count.textContent=`${matches.length} موضوعًا`};search?.addEventListener('input',draw);select?.addEventListener('change',draw);draw();}
function featured(articles){const container=$('#v12-home-awareness');if(!container)return;cards(container,articles.filter(x=>x.featured).length?articles.filter(x=>x.featured):articles,3)}
function detail(articles){const container=$('#v12-article-detail');if(!container)return;const id=new URLSearchParams(location.search).get('id')||new URLSearchParams(location.search).get('article')||new URLSearchParams(location.search).get('slug');const a=articles.find(x=>x.id===id||x.slug===id||x.title===id);if(!a){container.append(make('h1',null,'الموضوع غير متوفر'),make('p',null,'قد يكون الرابط قديمًا أو تغيّر عنوان المقال.'),make('a','v12-link','عرض جميع موضوعات التوعية'));container.lastChild.href='awareness-topics.html';return}
 document.title=a.title+' | التوعية الطبية | عيادة د. منير الشكري';const m=$('meta[name="description"]');if(m)m.content=(a.overview||'').slice(0,160);
 container.append(make('div','v12-crumb','التوعية الطبية / '+(a.category||'التثقيف الصحي')),make('h1',null,a.title));
 const figure=make('figure','v12-figure');const img=make('img');img.src=imgSafe(a.image);img.alt=a.imageAlt||'صورة طبية توضيحية';img.loading='lazy';figure.append(img,make('figcaption',null,'الصورة للتوضيح فقط ولا تمثل نتيجة فحص أو حالة مريض.'));container.append(figure);
 for(const [key,title] of [['overview','نبذة عن الحالة'],['causes','الأسباب والعوامل المرتبطة'],['symptoms','الأعراض والعلامات'],['diagnosis','كيف يساعد التصوير الطبي في التقييم؟'],['preparation','الاستعداد للفحص أو الإجراء'],['care','العلاج والمتابعة'],['prevention','التوعية والوقاية'],['urgent','متى تستدعي الأعراض مراجعة عاجلة؟'],['faq','أسئلة شائعة']]){
  if(!a[key])continue;const section=make('section','v12-detail-section');section.append(make('h2',null,title),make('p',null,a[key]));container.append(section)
 }
 if(Array.isArray(a.sources)&&a.sources.length){const refs=make('section','v12-detail-section');refs.append(make('h2',null,'مصادر للاطلاع'));const ul=make('ul');for(const s of a.sources){if(!/^https:\/\//.test(s.url||''))continue;const li=make('li'),anchor=make('a',null,s.title||s.url);anchor.href=s.url;anchor.target='_blank';anchor.rel='noopener noreferrer';li.append(anchor);ul.append(li)}refs.append(ul);container.append(refs)}
 container.append(make('p','v12-disclaimer','هذا محتوى تثقيفي عام غير مراجع سريريًا من العيادة حتى تاريخ النشر، ولا يعد تشخيصًا أو علاجًا. اطلب تقييمًا طبيًا عند ظهور أعراض جديدة أو مقلقة.'));
}
fetch('awareness-content.json',{cache:'no-store',signal:AbortSignal.timeout(10000)}).then(r=>{if(!r.ok)throw Error();return r.json()}).then(d=>{
const articles=(d.articles||[]).filter(x=>x.visible!==false).sort((a,b)=>(Number(a.order)||0)-(Number(b.order)||0));all(articles);featured(articles);detail(articles)
}).catch(()=>{for(const id of ['#v12-awareness-grid','#v12-article-detail']){const root=$(id);if(root){root.replaceChildren(make('p',null,'تعذر تحميل المحتوى. تحقق من الاتصال ثم أعد المحاولة.'),make('a','v12-link','العودة إلى مكتبة التوعية'));root.lastChild.href='awareness-topics.html'}}});
})();
