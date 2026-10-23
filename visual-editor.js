/* V12 mobile content editor: no credentials, no server writes, sanitized JSON export. */
(()=>{'use strict';
const $=s=>document.querySelector(s);
const el=(tag,cls,txt)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(txt!==undefined)e.textContent=String(txt);return e};
const key='munir_v12_editor_draft';
const images=[...Array.from({length:46},(_,i)=>'exam-'+String(i+1).padStart(2,'0')+'.webp'),'photo-ultrasound.jpg','photo-doppler.jpg','photo-biopsy.jpg','photo-catheters.jpg','photo-contrast.jpg','photo-barium.jpg','photo-tumors.jpg','doctor.jpg','logo.jpg'];
let state=null,original=null,history=[],tab='home',dirty=false;
const clone=o=>JSON.parse(JSON.stringify(o));
const normalizeList=a=>a.forEach((v,i)=>v.order=i+1);
const say=t=>{$('#alert').textContent=t};
const mark=()=>{dirty=true;$('#save-label').textContent='توجد تغييرات لم تُنشر بعد';};
function snapshot(){if(!state)return;history.push(clone(state));if(history.length>24)history.shift()}
function mutate(cb){snapshot();cb();mark();draw();}
function uid(prefix){return prefix+'-'+Math.random().toString(36).slice(2,11)}
function b(text,click,cls){const x=el('button',cls,text);x.type='button';x.addEventListener('click',click);return x}
function actions(target,opts){const row=el('div','ed-actions');for(const [label,fn,style] of opts)row.append(b(label,fn,style||'ed-soft'));target.append(row);return row}
function field(root,label,value,onValue,{long=false,kind='text',options=null,tip='',maxLength=1200}={}){
 const lab=el('label',null,label);let input;
 if(options){input=el('select');for(const [val,text] of options){const op=el('option',null,text);op.value=val;input.append(op)}input.value=value||'';}
 else if(long){input=el('textarea');input.value=value||'';input.maxLength=maxLength;}
 else{input=el('input');input.type=kind;input.value=value??'';input.maxLength=maxLength;}
 input.addEventListener(kind==='color'?'input':'change',()=>{snapshot();onValue(input.value);mark();if(kind==='color')return;});
 lab.append(input);if(tip)lab.append(el('small','ed-mini',tip));root.append(lab);return input
}
function check(root,label,value,onValue){const lab=el('label','ed-check');const inp=el('input');inp.type='checkbox';inp.checked=value!==false;inp.addEventListener('change',()=>{snapshot();onValue(inp.checked);mark();});lab.append(inp,document.createTextNode(label));root.append(lab)}
function imgField(root,obj){const opts=[['','لا توجد صورة'],...images.map(x=>[x,x])];const fields=el('div','ed-fields');const select=field(fields,'صورة من مكتبة الموقع',obj.image||'',val=>{obj.image=val;const im=root.querySelector('.ed-preview img');if(im)im.src=val||'photo-ultrasound.jpg'},{options:opts});field(fields,'اسم ملف صورة إضافية رفعتها سابقًا إلى GitHub',obj.image||'',val=>{if(val&&!/^(?:)?[\w-]+\.(jpg|jpeg|png|webp)$/i.test(val)){say('اسم الصورة غير صالح؛ استخدم اسم ملف محلي مثل my-scan.jpg');return}obj.image=val;select.value=val},{maxLength:100});root.append(fields);const preview=el('div','ed-preview');const im=el('img');im.src=obj.image||'photo-ultrasound.jpg';im.alt='معاينة الصورة';im.onerror=()=>{im.onerror=null;im.src='photo-ultrasound.jpg'};preview.append(im,el('div',null,'صورة إيضاحية من ملفات العيادة؛ لا تُعد صورة لحالة مرضية حقيقية.'));root.append(preview)}
function switchTab(t){tab=t;document.querySelectorAll('.ed-tabs button').forEach(x=>x.classList.toggle('active',x.dataset.tab===tab));document.querySelectorAll('.ed-tab').forEach(x=>x.hidden=x.id!=='tab-'+tab);draw()}
function home(){const wrap=$('#home-items');wrap.replaceChildren();const arr=state.home.sections;
 arr.forEach((s,i)=>{const article=el('article','ed-item');const top=el('div','ed-top');top.append(el('strong',null,`${i+1}. ${s.title||s.label||s.id}`));const opts=[['↑ أعلى',()=>move(arr,i,-1)],['↓ أسفل',()=>move(arr,i,1)]];
 if(s.kind==='custom'){opts.push(['⧉ تكرار',()=>mutate(()=>{const copy=clone(s);copy.id=uid('custom');arr.splice(i+1,0,copy);normalizeList(arr)})]);opts.push(['🗑 حذف',()=>remove(arr,i)])}
 top.append(actions(el('div'),opts));article.append(top);const fields=el('div','ed-fields ed-two');check(fields,'إظهار القسم',s.visible,v=>s.visible=v);
 field(fields,'العنوان الظاهر',s.title||'',v=>{s.title=v},{maxLength:140});
 field(fields,'النص الوصفي (للأقسام الداعمة أو المخصصة)',s.subtitle||'',v=>s.subtitle=v,{long:true,maxLength:900});
 if(s.kind==='custom'){field(fields,'نص زر الانتقال',s.linkLabel||'',v=>s.linkLabel=v);field(fields,'رابط الزر (https أو صفحة محلية)',s.link||'',v=>s.link=v,{maxLength:300});}
 article.append(fields);if(s.kind==='custom')imgField(article,s);else article.append(el('p','ed-muted','قسم ثابت مرتبط بتصميم الموقع الحالي؛ تغيّر ترتيب القسم وظهوره وعنوانه، وبعض أوصافه فقط. تغيير عناصره الداخلية يعتمد على محرر الخدمات أو المحتوى.'));
 wrap.append(article)});
 const pr=$('#primary-color');const ac=$('#accent-color');pr.value=state.home.appearance?.primary||'#0b6283';ac.value=state.home.appearance?.accent||'#14856d';
}
function move(arr,i,delta){if(i+delta<0||i+delta>=arr.length)return;mutate(()=>{[arr[i],arr[i+delta]]=[arr[i+delta],arr[i]];normalizeList(arr)})}
function remove(arr,i){if(!confirm('هل تريد حذف هذا العنصر من ملف النشر؟ يمكن استعادته من نسخة احتياطية.'))return;mutate(()=>{arr.splice(i,1);normalizeList(arr)})}
function groupEditor(g,i){const wrap=el('article','ed-item');const top=el('div','ed-top');top.append(el('strong',null,`${i+1}. ${g.title} — ${(g.items||[]).length} فحصًا`));const all=state.services.groups;
 actions(top,[['↑ نقل المجموعة',()=>move(all,i,-1)],['↓ نقل المجموعة',()=>move(all,i,1)],['⧉ نسخ المجموعة',()=>mutate(()=>{const x=clone(g);x.id=uid('group');x.items.forEach(y=>y.id=uid('exam'));all.splice(i+1,0,x)})],['🗑 حذف المجموعة',()=>remove(all,i),'ed-red']]);wrap.append(top);
 const details=el('details');details.open=i===0;const sm=el('summary',null,'تعديل المجموعة والفحوصات');details.append(sm);const fields=el('div','ed-fields ed-two');check(fields,'إظهار المجموعة',g.visible,v=>g.visible=v);field(fields,'اسم المجموعة',g.title||'',v=>g.title=v);field(fields,'وصف موجز',g.description||'',v=>g.description=v,{long:true});details.append(fields);imgField(details,g);
 details.append(actions(el('div'),[['＋ فحص جديد',()=>mutate(()=>{g.items.push({id:uid('exam'),title:'فحص جديد',visible:true,order:g.items.length+1})})]]));
 const exams=el('div','ed-group-exams');(g.items||[]).forEach((x,j)=>{
 const block=el('div','ed-exam');const title=el('div','ed-top');title.append(el('strong',null,`${j+1} — ${x.title}`));
 actions(title,[['↑',()=>move(g.items,j,-1)],['↓',()=>move(g.items,j,1)],['⧉ نسخة',()=>mutate(()=>{const copy=clone(x);copy.id=uid('exam');g.items.splice(j+1,0,copy)})],['🗑',()=>remove(g.items,j),'ed-red']]);block.append(title);
 const fieldset=el('div','ed-fields ed-two');field(fieldset,'عنوان الفحص',x.title||'',v=>{x.title=v});check(fieldset,'إظهار الفحص',x.visible,v=>x.visible=v);
 if(all.length>1){const opt=all.filter(o=>o!==g).map(o=>[o.id,o.title]);opt.unshift(['','نقل إلى مجموعة أخرى']);field(fieldset,'نقل الفحص إلى مجموعة', '',id=>{if(!id)return;mutate(()=>{g.items.splice(j,1);all.find(a=>a.id===id)?.items.push(x);normalizeList(g.items)})},{options:opt});}
 block.append(fieldset);exams.append(block)});details.append(exams);wrap.append(details);return wrap
}
function services(){const root=$('#service-items');root.replaceChildren(...state.services.groups.map(groupEditor))}
const articleFields=[['title','عنوان المقال',140],['category','التصنيف',100],['overview','النبذة والتعريف',1800],['causes','الأسباب وعوامل الخطورة',2300],['symptoms','الأعراض والعلامات',2200],['diagnosis','التشخيص ودور السونار/الدوبلر',2300],['preparation','التحضير للفحوصات',2100],['care','العلاج والمتابعة (تثقيفيًا)',2100],['prevention','الوقاية والنصائح',2100],['urgent','متى يلزم التقييم العاجل؟',2000],['faq','سؤال وجواب',1500]];
function articleCard(a,i){const outer=el('article','ed-item');const details=el('details');const summary=el('summary',null,`${i+1}. ${a.title} — ${a.category||'عام'}`);details.append(summary);
 const actionsRow=el('div');actions(actionsRow,[['↑ للأعلى',()=>move(state.articles.articles,i,-1)],['↓ للأسفل',()=>move(state.articles.articles,i,1)],['⧉ نسخ كمسودة',()=>mutate(()=>{const c=clone(a);c.id=uid('topic');c.title+=' (نسخة)';c.visible=false;state.articles.articles.splice(i+1,0,c)})],['🗑 حذف',()=>remove(state.articles.articles,i),'ed-red']]);details.append(actionsRow);
 const fields=el('div','ed-fields ed-two');check(fields,'المقال منشور',a.visible,v=>a.visible=v);check(fields,'إبراز المقال في الرئيسية',a.featured,v=>a.featured=v);
 for(const [k,label,max] of articleFields)field(fields,label,a[k]||'',v=>{a[k]=v},{long:k!=='title'&&k!=='category',maxLength:max});details.append(fields);
 imgField(details,a);const src=Array.isArray(a.sources)&&a.sources.length?a.sources[0].url:'';const srcT=Array.isArray(a.sources)&&a.sources.length?a.sources[0].title:'';const sf=el('div','ed-fields ed-two');field(sf,'عنوان المصدر الطبي',srcT,v=>{a.sources=a.sources||[];if(!a.sources.length)a.sources.push({title:'مصدر طبي',url:''});a.sources[0].title=v});field(sf,'رابط المصدر https://',src,v=>{a.sources=a.sources||[];if(!a.sources.length)a.sources.push({title:'مصدر طبي',url:''});a.sources[0].url=v},{maxLength:450});details.append(sf);outer.append(details);return outer
}
function articles(){const root=$('#article-items');root.replaceChildren();const q=$('#article-filter').value.trim().toLowerCase();state.articles.articles.forEach((a,i)=>{if(q&&!`${a.title} ${a.category} ${a.overview}`.toLowerCase().includes(q))return;root.append(articleCard(a,i))})}
function draw(){if(!state)return;if(tab==='home')home();if(tab==='services')services();if(tab==='articles')articles()}
function save(){try{localStorage.setItem(key,JSON.stringify(state));dirty=false;$('#save-label').textContent='المسودة محفوظة في هذا الهاتف فقط';say('حُفظت المسودة محليًا. للتحديث العام نزّل الملفات الثلاثة وارفعها إلى GitHub.')}catch(e){say('تعذر الحفظ على هذا الهاتف؛ يمكنك تنزيل ملفات JSON مباشرة.')}}
function safeOutput(t){const d=clone(t);if(d.home?.sections)normalizeList(d.home.sections);if(d.services?.groups)d.services.groups.forEach(g=>normalizeList(g.items||[]));if(d.articles?.articles)normalizeList(d.articles.articles);return d}
function download(filename,obj){const blob=new Blob([JSON.stringify(obj,null,2)],{type:'application/json;charset=utf-8'});const url=URL.createObjectURL(blob),a=el('a');a.href=url;a.download=filename;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),3500);say(`تم تجهيز ${filename}. ارفعه إلى جذر GitHub بنفس الاسم؛ لا تغلق المحرر قبل تنزيل بقية الملفات.`)}
async function init({reset=false}={}){
try{
 const [h,s,a]=await Promise.all(['homepage-layout.json','services-catalog.json','awareness-content.json'].map(async f=>{const r=await fetch(f,{cache:'no-store'});if(!r.ok)throw Error(f);return r.json()}));
 original={home:h,services:s,articles:a};const draft=!reset?localStorage.getItem(key):null;
 if(draft){try{const p=JSON.parse(draft);state=validate(p)?p:clone(original)}catch{state=clone(original)}}else state=clone(original);
 if(!state.home.appearance)state.home.appearance={primary:'#0b6283',accent:'#14856d'};
 dirty=false;draw();say('تم تحميل بيانات الموقع. لديك الآن محرر الواجهة والخدمات والمقالات.');
 }catch(e){say('تعذر تحميل البيانات: ارفع ملفات homepage-layout.json وservices-catalog.json وawareness-content.json إلى GitHub أولًا.')}}
function validate(x){return x&&Array.isArray(x.home?.sections)&&Array.isArray(x.services?.groups)&&Array.isArray(x.articles?.articles)}
function bind(){document.querySelectorAll('.ed-tabs button').forEach(x=>x.onclick=()=>switchTab(x.dataset.tab));
 $('#add-home').onclick=()=>mutate(()=>{state.home.sections.push({id:uid('custom'),kind:'custom',label:'قسم مخصص',title:'عنوان القسم الجديد',subtitle:'اكتب الوصف الذي ترغب في ظهوره',visible:true,order:state.home.sections.length+1,image:'photo-ultrasound.jpg',linkLabel:'اكتشف المزيد',link:'services-catalog.html'})});
 $('#show-all').onclick=()=>mutate(()=>state.home.sections.forEach(x=>x.visible=true));
 $('#primary-color').oninput=e=>{state.home.appearance.primary=e.target.value;mark()};$('#accent-color').oninput=e=>{state.home.appearance.accent=e.target.value;mark()};
 $('#add-group').onclick=()=>mutate(()=>state.services.groups.push({id:uid('group'),title:'مجموعة فحوصات جديدة',visible:true,description:'',image:'photo-ultrasound.jpg',items:[]}));
 $('#add-exam').onclick=()=>{if(!state.services.groups.length){say('أنشئ مجموعة أولًا');return}const sel=prompt('اكتب رقم المجموعة لإضافة الفحص فيها من 1 إلى '+state.services.groups.length,'1');if(sel===null)return;const g=state.services.groups[Number(sel)-1];if(!g){say('رقم المجموعة غير صحيح');return}mutate(()=>g.items.push({id:uid('exam'),title:'فحص جديد',visible:true,order:g.items.length+1}))};
 $('#show-all-exams').onclick=()=>mutate(()=>state.services.groups.forEach(g=>{g.visible=true;g.items.forEach(x=>x.visible=true)}));
 $('#add-article').onclick=()=>mutate(()=>state.articles.articles.unshift({id:uid('topic'),title:'عنوان الموضوع الجديد',category:'تثقيف صحي',overview:'',causes:'',symptoms:'',diagnosis:'',preparation:'',care:'',prevention:'',urgent:'',faq:'',image:'photo-ultrasound.jpg',imageAlt:'صورة توضيحية لمعدات الأشعة',sources:[],reviewed:false,featured:false,visible:false,order:1}));
 $('#article-filter').oninput=articles;$('#expand-articles').onclick=()=>$('#article-items').querySelectorAll('details').forEach(d=>d.open=true);
 $('#save').onclick=save;$('#quick-save').onclick=save;$('#go-deploy').onclick=()=>switchTab('deploy');
 $('#undo').onclick=()=>{if(!history.length){say('لا توجد تعديلات سابقة لاستعادتها');return}state=history.pop();mark();draw();say('تم التراجع عن آخر تعديل مسجل')};
 $('#reset').onclick=()=>{if(!confirm('هل تريد تجاهل مسودة هاتفك والعودة لإعدادات الموقع المنشورة؟'))return;localStorage.removeItem(key);history=[];init({reset:true})};
 $('#backup').onclick=()=>download('munir-v12-backup.json',safeOutput(state));
 document.querySelectorAll('[data-download]').forEach(x=>x.onclick=()=>{const f=x.dataset.download;const d=safeOutput(state);const names={home:'homepage-layout.json',services:'services-catalog.json',articles:'awareness-content.json'};download(names[f],d[f])});
 $('#import-file').onchange=async e=>{const f=e.target.files?.[0];if(!f||f.size>2e6){say('ملف كبير جدًا أو غير صالح');return}try{const d=JSON.parse(await f.text());snapshot();if(validate(d))state=d;else if(Array.isArray(d.sections))state.home=d;else if(Array.isArray(d.groups))state.services=d;else if(Array.isArray(d.articles))state.articles=d;else throw Error('shape');mark();draw();say('تم استيراد المحتوى. راجع التغييرات ثم نزّل ملفات النشر.')}catch{say('تعذر استيراد ملف JSON؛ تحقق من صحة تنسيقه.') }e.target.value=''};
 window.addEventListener('beforeunload',e=>{if(dirty){e.preventDefault();e.returnValue=''}});
}
bind();init();
})();
