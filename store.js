import {firebaseConfig} from './config.js';
import {defaultSettings,initialContent} from './data.js';

const LOCAL_KEY = 'dr-munir-clinic-local-draft-v3';
const collections = ['services','faqs','articles','gallery'];
const clone = obj => JSON.parse(JSON.stringify(obj));
let publishedState = {settings:clone(defaultSettings),content:clone(initialContent)};
const inEditor = typeof location!=='undefined' && /\/admin\.html$/.test(location.pathname);
const isPreview = typeof location!=='undefined' && new URLSearchParams(location.search).get('preview')==='1';
function validateContentData(raw){
  if(!raw || typeof raw!=='object' || !raw.settings || !raw.content)throw Error('ملف البيانات غير صالح');
  for(const key of collections){
    if(!Array.isArray(raw.content[key]) || raw.content[key].length>300)throw Error(`قسم ${key} غير صالح`);
    for(const item of raw.content[key])if(!item || typeof item!=='object'||typeof item.id!=='string'||item.id.length>150)throw Error('يوجد سجل غير صالح');
  }
  return {settings:{...clone(defaultSettings),...raw.settings},content:Object.fromEntries(collections.map(k=>[k,clone(raw.content[k])]))};
}
function demoState(){
  if(!inEditor && !isPreview)return {...clone(publishedState),appointments:[]};
  try {
    const saved=JSON.parse(localStorage.getItem(LOCAL_KEY));
    if(saved?.settings && saved?.content)return {...validateContentData(saved),appointments:[]};
  }catch{}
  return {...clone(publishedState),appointments:[]};
}
function saveDemo(state){
  if(!inEditor)throw Error('التعديل متاح داخل لوحة الإدارة فقط');
  localStorage.setItem(LOCAL_KEY,JSON.stringify({...state,appointments:[]}));
}
const configured = Boolean(firebaseConfig.apiKey?.trim() && firebaseConfig.projectId?.trim() && firebaseConfig.appId?.trim());

export async function createStore(forceDemo=false){
  if(!configured || forceDemo){
    try {
      const response=await fetch(new URL('./site-data.json',import.meta.url),{cache:'no-store'});
      if(response.ok) publishedState=validateContentData(await response.json());
    } catch(err) { console.info('Using bundled default content',err?.message||''); }
    return {
      mode:'demo', isSeeded:true,
      async getSettings(){return clone(demoState().settings)},
      exportData(){const v=demoState();return {settings:v.settings,content:v.content}},
      importData(v){if(!inEditor)throw Error('افتح لوحة الإدارة');const data=validateContentData(v);saveDemo(data)},
      async list(kind,publicOnly=false){return clone(demoState().content[kind]||[]).filter(i=>!publicOnly || i.published)},
      async listAppointments(){return []},
      async submitAppointment(){throw Error('الحجز الإلكتروني غير مفعل. يرجى الاتصال بالعيادة مباشرة.')},
      async updateAppointment(){throw Error('لا توجد حجوزات إلكترونية في الوضع الثابت')},
      async removeAppointment(){throw Error('لا توجد حجوزات إلكترونية في الوضع الثابت')},
      async saveSettings(data){const s=demoState();s.settings={...s.settings,...data};saveDemo(s)},
      async saveItem(kind,data,id){if(!collections.includes(kind))throw new Error('مجموعة غير صحيحة');const s=demoState();const arr=s.content[kind];const newId=id||`${kind}-${Date.now()}-${Math.random().toString(36).slice(2,6)}`;const i=arr.findIndex(x=>x.id===newId);const record={...(i>=0?arr[i]:{}),...data,id:newId};if(i>=0)arr[i]=record;else arr.push(record);saveDemo(s);return newId},
      async removeItem(kind,id){if(!collections.includes(kind))throw Error('مجموعة غير صحيحة');const s=demoState();s.content[kind]=s.content[kind].filter(x=>x.id!==id);saveDemo(s)},
      async uploadImage(file){if(file.size>1024*850)throw Error('في وضع التجربة، حجم الصورة الأقصى 850 كيلوبايت. استخدم رابط صورة أو فعّل Firebase Storage.');return await new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(r.result);r.onerror=reject;r.readAsDataURL(file)})},
      async signIn(){throw new Error('وضع محلي بلا تسجيل دخول')},
      async signOut(){},
      onAuth(cb){cb({uid:'local-demo',email:'demo@local'});return ()=>{}},
      async checkAdmin(){return true},
      async initialize(){return false}
    };
  }

  const [appSDK,dbSDK,authSDK,storageSDK] = await Promise.all([
    import('https://www.gstatic.com/firebase12.19.0/firebase-app.js'),
    import('https://www.gstatic.com/firebase12.19.0/firebase-firestore.js'),
    import('https://www.gstatic.com/firebase12.19.0/firebase-auth.js'),
    import('https://www.gstatic.com/firebase12.19.0/firebase-storage.js')
  ]);
  const app=appSDK.initializeApp(firebaseConfig);
  const db=dbSDK.getFirestore(app);
  const auth=authSDK.getAuth(app);
  const storage=storageSDK.getStorage(app);
  const settingsRef=dbSDK.doc(db,'settings','main');
  let seeded=false;
  const documentData = snap => ({id:snap.id,...snap.data()});
  return {
    mode:'firebase',
    get isSeeded(){return seeded},
    async getSettings(){const snap=await dbSDK.getDoc(settingsRef);seeded=snap.exists();return snap.exists()?{...clone(defaultSettings),...snap.data()}:clone(defaultSettings)},
    async list(kind,publicOnly=false){if(!collections.includes(kind))throw Error('مجموعة غير صحيحة');const c=dbSDK.collection(db,kind);const q=publicOnly?dbSDK.query(c,dbSDK.where('published','==',true)):c;const snap=await dbSDK.getDocs(q);if(publicOnly&&!seeded&&snap.empty)return clone(initialContent[kind]);return snap.docs.map(documentData)},
    async listAppointments(){const snap=await dbSDK.getDocs(dbSDK.collection(db,'appointments'));return snap.docs.map(documentData)},
    async submitAppointment(data){const ref=await dbSDK.addDoc(dbSDK.collection(db,'appointments'),{...data,status:'pending',createdAt:dbSDK.serverTimestamp()});return {demo:false,id:ref.id}},
    async updateAppointment(id,status){await dbSDK.updateDoc(dbSDK.doc(db,'appointments',id),{status})},
    async removeAppointment(id){await dbSDK.deleteDoc(dbSDK.doc(db,'appointments',id))},
    async saveSettings(data){await dbSDK.setDoc(settingsRef,{...data,updatedAt:dbSDK.serverTimestamp()},{merge:true});seeded=true},
    async saveItem(kind,data,id){if(!collections.includes(kind))throw Error('مجموعة غير صحيحة');const ref=id?dbSDK.doc(db,kind,id):dbSDK.doc(dbSDK.collection(db,kind));await dbSDK.setDoc(ref,{...data,updatedAt:dbSDK.serverTimestamp()},{merge:true});return ref.id},
    async removeItem(kind,id){await dbSDK.deleteDoc(dbSDK.doc(db,kind,id))},
    async uploadImage(file){
      if(!/^image\/(jpeg|png|webp)$/.test(file.type))throw Error('يمكن رفع صور JPG أو PNG أو WebP فقط.');
      if(file.size>4*1024*1024)throw Error('حجم الصورة لا يجب أن يتجاوز 4 ميجابايت.');
      const ext={'image/jpeg':'jpg','image/png':'png','image/webp':'webp'}[file.type];
      const user=auth.currentUser;
      if(!user)throw Error('يجب تسجيل الدخول');
      const path=`media/${user.uid}/${Date.now()}-${crypto.randomUUID()}.${ext}`;
      const ref=storageSDK.ref(storage,path);
      await storageSDK.uploadBytes(ref,file,{contentType:file.type,cacheControl:'public,max-age=86400'});
      return storageSDK.getDownloadURL(ref);
    },
    signIn(email,password){return authSDK.signInWithEmailAndPassword(auth,email,password)},
    signOut(){return authSDK.signOut(auth)},
    onAuth(cb){return authSDK.onAuthStateChanged(auth,cb)},
    async checkAdmin(user){if(!user)return false;const snap=await dbSDK.getDoc(dbSDK.doc(db,'admins',user.uid));return Boolean(snap.exists()&&snap.data().active===true)},
    async initialize(){
      const snap=await dbSDK.getDoc(settingsRef);
      if(snap.exists())return false;
      for(const kind of collections){
        for(const item of initialContent[kind]){
          const {id,...data}=item;
          await dbSDK.setDoc(dbSDK.doc(db,kind,id),{...data,updatedAt:dbSDK.serverTimestamp()});
        }
      }
      await dbSDK.setDoc(settingsRef,{...clone(defaultSettings),updatedAt:dbSDK.serverTimestamp()});
      seeded=true;
      return true;
    }
  };
}
