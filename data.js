export const MAP_URL = 'https://maps.app.goo.gl/PD1CCavZWN6o9GWs9';

export const defaultSettings = {
  clinicName: 'عيادة د. منير الشكري',
  specialty: 'الأشعة التشخيصية وسحب الخزع والعينات وتركيب القساطر',
  heroTitle: 'رعاية تشخيصية متخصصة، ومعلومات واضحة لكل مريض',
  heroDescription: 'تعرّف على خدمات عيادة د. منير الشكري، واستعد لموعدك، وتواصل معنا مباشرة للاستفسار عن الفحوصات والإجراءات المتاحة.',
  aboutTitle: 'رعاية طبية تبدأ بفهم احتياجك',
  aboutText: 'تقدم العيادة خدمات الأشعة التشخيصية وسحب الخزع والعينات وتركيب القساطر. نحرص على توفير معلومات واضحة عن الخدمات والإرشادات اللازمة، مع التأكيد على أن تحديد الإجراء المناسب يتم بعد التقييم الطبي.',
  doctorBio: 'تُقدَّم خدمات العيادة بإشراف د. منير الشكري. يمكن الاطلاع على الخدمات والتواصل مع العيادة للاطلاع على تفاصيل الإجراءات ومواعيدها.',
  address: 'صنعاء – شارع الزبيري – برج المختبرات الدولية',
  phone1: '738007272',
  phone2: '782007272',
  whatsapp: '',
  mapUrl: MAP_URL,
  announcement: 'نستقبل استفساراتكم من السبت إلى الخميس',
  hours: {
    '0': {open:true,from:'08:00',to:'22:00'},
    '1': {open:true,from:'08:00',to:'22:00'},
    '2': {open:true,from:'08:00',to:'22:00'},
    '3': {open:true,from:'08:00',to:'22:00'},
    '4': {open:true,from:'08:00',to:'22:00'},
    '5': {open:false,from:'08:00',to:'22:00'},
    '6': {open:true,from:'08:00',to:'22:00'}
  }
};

export const initialContent = {
  services: [
    {id:'diagnostic-imaging',title:'الأشعة التشخيصية',short:'فحوصات تصويرية تساعد الطبيب على تقييم الحالة وتحديد الخطوات المناسبة.',body:'تساعد الأشعة التشخيصية الطبيب في الاطلاع على صور لأجزاء من الجسم ضمن خطة التقييم الطبي. يختلف نوع الفحص وطريقة التحضير حسب الحالة وطلب الطبيب. تواصل مع العيادة للاستفسار عن الفحوصات المتاحة والمتطلبات الخاصة بكل فحص.',icon:'scan',imageUrl:'',order:1,published:true},
    {id:'biopsies-samples',title:'سحب الخزع والعينات',short:'الحصول على عينات لأغراض الفحص والتحليل بناءً على التقييم الطبي.',body:'قد يوصي الطبيب بسحب خزعة أو عينة للمساعدة على الوصول إلى تشخيص أدق. يتحدد نوع العينة وطريقة الإجراء والتحضير اللازم وفق الحالة والتاريخ الطبي. لا توقف أي دواء، خاصة مميعات الدم، دون الرجوع للطبيب.',icon:'sample',imageUrl:'',order:2,published:true},
    {id:'catheters',title:'تركيب القساطر',short:'إجراءات متخصصة تُحدَّد ملاءمتها ونوعها وفق الاحتياج الطبي.',body:'قد تُستخدم القساطر في إجراءات طبية متعددة، وتختلف متطلبات كل إجراء ووسائل متابعته. للاستفسار عن أنواع القساطر التي توفرها العيادة وخطوات الاستعداد، يرجى التواصل مسبقًا مع فريق العيادة.',icon:'activity',imageUrl:'',order:3,published:true}
  ],
  faqs: [
    {id:'faq-1',question:'كيف أستفسر عن إجراء معين؟',answer:'يمكنك الاتصال على 738007272 أو 782007272 للاستفسار عن توفر الإجراء وموعده ومتطلبات التحضير.',order:1,published:true},
    {id:'faq-2',question:'هل تحتاج جميع الفحوصات إلى صيام؟',answer:'لا. تختلف تعليمات التحضير بحسب نوع الفحص أو الإجراء؛ يُرجى الالتزام بالتعليمات التي تقدمها العيادة للحالة المحددة.',order:2,published:true},
    {id:'faq-3',question:'ماذا أحضر معي إلى العيادة؟',answer:'يفيد إحضار طلب الطبيب والتقارير والصور السابقة وقائمة الأدوية المستخدمة إن وجدت، وتؤكد العيادة ما يلزم لكل خدمة.',order:3,published:true},
    {id:'faq-4',question:'هل أوقف مميعات الدم قبل الخزعة؟',answer:'لا توقف مميعات الدم أو أي دواء من تلقاء نفسك. أخبر الطبيب بالأدوية التي تتناولها، واتبع تعليماته الخاصة بالإجراء.',order:4,published:true},
    {id:'faq-5',question:'هل طلب الموعد عبر الموقع يعني أنه مؤكد؟',answer:'لا، يُعدّ الطلب مبدئيًا حتى تتواصل معك العيادة لتأكيد الموعد والتفاصيل.',order:5,published:true}
  ],
  articles: [
    {id:'article-imaging',title:'ما دور الأشعة التشخيصية في التقييم الطبي؟',summary:'تعرف على دور التصوير الطبي وكيف يختار الطبيب الفحص المناسب.',body:'تساعد الفحوصات التصويرية الطبيب في تكوين صورة أوضح عن بعض أجزاء الجسم.\n\nلا يوجد فحص واحد مناسب لجميع الحالات؛ يعتمد الاختيار على الأعراض والتاريخ المرضي ونتائج الفحص السريري.\n\nاحرص على إبلاغ الطبيب بالتقارير والفحوصات السابقة، والتزم بتعليمات التحضير المحددة للفحص.',imageUrl:'',order:1,published:true},
    {id:'article-biopsy',title:'معلومات مهمة قبل سحب الخزعة أو العينة',summary:'أسئلة واستعدادات عامة يمكن مناقشتها مع الطبيب قبل الإجراء.',body:'تُستخدم الخزع والعينات للحصول على مادة تساعد المختبر والطبيب في تقييم الحالة.\n\nقبل الإجراء أخبر الطبيب عن الأمراض المزمنة، والحساسية، والحمل المحتمل، وجميع الأدوية المستخدمة، وبخاصة مميعات الدم.\n\nتختلف التحضيرات والمخاطر والتعليمات اللاحقة بحسب نوع الإجراء، لذلك تكون تعليمات الطبيب المعالج هي المرجع.',imageUrl:'',order:2,published:true},
    {id:'article-visit',title:'كيف تستعد لزيارة عيادة الأشعة؟',summary:'خطوات بسيطة لتسهيل الزيارة والاستفادة من الاستشارة.',body:'تواصل مع العيادة لتأكيد وقت الزيارة ومتطلبات الفحص.\n\nأحضر طلب الفحص أو الإجراء وأي تقارير أو صور سابقة مرتبطة بالحالة، مع قائمة الأدوية الحالية.\n\nإذا كنت بحاجة إلى مساعدة أو مرافق، استفسر من العيادة مسبقًا. لا تتبع تعليمات صيام أو إيقاف دواء إلا وفق التوجيه الطبي المناسب.',imageUrl:'',order:3,published:true}
  ],
  gallery: []
};

export const dayNames = {'0':'الأحد','1':'الاثنين','2':'الثلاثاء','3':'الأربعاء','4':'الخميس','5':'الجمعة','6':'السبت'};
export const sectionLabels = {services:'الخدمات',faqs:'الأسئلة الشائعة',articles:'المقالات',gallery:'المعرض'};
export const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function safeUrl(value) {
  try {const u=new URL(String(value||''),location.href);return ['https:','http:'].includes(u.protocol)?u.href:''} catch{return ''}
}
export function safeTel(v){return String(v||'').replace(/[^0-9+]/g,'')}
export function sorted(items){return [...items].sort((a,b)=>(Number(a.order)||999)-(Number(b.order)||999))}
export function formatHour(v){if(!v)return '';const [h,m]=v.split(':').map(Number);return `${h%12||12}:${String(m).padStart(2,'0')} ${h<12?'ص':'م'}`}
export function getWorkDays(hours){const days=Object.entries(dayNames).filter(([id])=>hours?.[id]?.open);return days.map(([id,name])=>({id,name,...hours[id]}))}
export function friendlyError(e){
  const code=String(e?.code||'');
  if(code.includes('invalid-credential')||code.includes('wrong-password')||code.includes('invalid-email'))return 'بيانات تسجيل الدخول غير صحيحة.';
  if(code.includes('permission-denied')||code.includes('unauthorized'))return 'لا توجد صلاحية لهذه العملية. راجع حساب المسؤول وقواعد الحماية.';
  if(code.includes('network'))return 'تعذر الاتصال بالشبكة. تحقق من الإنترنت.';
  if(code.includes('storage'))return 'تعذر رفع الصورة؛ قد تحتاج خدمة الصور إلى تفعيل خطة Blaze أو مراجعة إعدادات Storage.';
  return e?.message || 'حدث خطأ غير متوقع.';
}
export function safeImage(value){const v=String(value||'');return /^data:image\/(?:png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(v)?v:safeUrl(v)}
