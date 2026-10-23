import {createStore} from './store.js';
import {esc,safeImage,sorted} from './data.js';

const root=document.getElementById('cms-list');
const kind=root?.dataset.kind;
const emptyText={events:'لا توجد فعاليات معلنة حاليًا.',jobs:'لا توجد وظائف منشورة حاليًا.',research:'لا توجد بحوث منشورة حاليًا.',videos:'لم تُنشر فيديوهات بعد.',articles:'لا توجد مقالات منشورة حاليًا.'};
const labels={events:'معلومات الفعالية',jobs:'التفاصيل وطريقة التقديم',research:'التفاصيل والمرجع',videos:'مشاهدة الفيديو',articles:'قراءة المقال'};
const imageFallback={events:'photo-ultrasound.jpg',jobs:'photo-ultrasound.jpg',research:'photo-doppler.jpg',videos:'photo-contrast.jpg',articles:'photo-ultrasound.jpg'};
const external = v => {try{const u=new URL(String(v||''));return u.protocol==='https:'?u.href:''}catch{return ''}};
const safeLink=v=>external(v);
const trunc=(v,max=120)=>String(v||'').trim().slice(0,max);
const safeId=x=>encodeURIComponent(String(x?.id||''));
function itemImage(x){const u=safeImage(x.imageUrl)||imageFallback[kind];return `<img src="${esc(u)}" alt="صورة توضيحية عن ${esc(trunc(x.title,120))}" loading="lazy" onerror="this.onerror=null;this.src='${imageFallback[kind]}'">`}
function itemCard(x){
 const detail=safeLink(x.linkUrl);
 const article=kind==='articles';
 const txt=trunc(x.short||x.summary||x.body,320);
 const date=x.date?`<span>📅 ${esc(x.date)}</span>`:'';
 const loc=x.location?`<span>📍 ${esc(trunc(x.location,120))}</span>`:'';
 const label=labels[kind]||'التفاصيل';
 const button=article?`<a class="cms-link" href="article.html?id=${safeId(x)}">${label} ←</a>`:detail?`<a class="cms-link" target="_blank" rel="noopener noreferrer" href="${esc(detail)}">${label} ↗</a>`:'';
 const paras=String(x.body||'').trim().split(/\n\s*\n/).filter(Boolean).slice(0,16).map(p=>`<p>${esc(p).replace(/\n/g,'<br>')}</p>`).join('');
 return `<article class="cms-card"><div class="cms-image">${itemImage(x)}</div><div class="cms-body"><h3>${esc(trunc(x.title,180))}</h3><div class="cms-meta">${date}${loc}</div><p>${esc(txt)}</p>${article?'':`<details class="cms-details"><summary>عرض التفاصيل</summary><div>${paras||'<p>للمزيد من المعلومات تواصل مع العيادة.</p>'}</div></details>`}${button}</div></article>`;
}
async function run(){if(!root||!kind)return;root.setAttribute('aria-busy','true');
 try {
  let s;try{s=await createStore()}catch(e){console.warn('Cloud unavailable; use public data',e);s=await createStore(true)}
  const records=await s.list(kind,true);
  const listed=sorted(records.filter(i=>i&&i.published===true));
  root.innerHTML=listed.length?`<div class="cms-grid">${listed.map(itemCard).join('')}</div>`:`<div class="cms-empty">${emptyText[kind]||'لا يوجد محتوى منشور حتى الآن.'}</div>`;
  if(new URLSearchParams(location.search).get('preview')==='1'&&s.mode==='demo')root.insertAdjacentHTML('afterbegin','<div class="cms-preview">معاينة من هذا الهاتف فقط؛ لن تظهر التعديلات للجمهور إلا بعد رفع site-data.json إلى GitHub.</div>');
 } catch(e){console.error(e);root.innerHTML='<div class="cms-empty">تعذر تحميل المحتوى الآن. يرجى تحديث الصفحة لاحقًا.</div>'}
 finally {root.setAttribute('aria-busy','false')}
}
run();
