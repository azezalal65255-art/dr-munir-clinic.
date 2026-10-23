(()=>{'use strict';
const put=(sel,val,max=650)=>{const e=document.querySelector(sel);if(e&&typeof val==='string'&&val.trim())e.textContent=val.slice(0,max)};
const secureLink=x=>{try{const u=new URL(x);return u.protocol==='https:'?u.href:null}catch{return null}};
fetch('site-presentation.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw Error('site-presentation');return r.json()}).then(d=>{
const h=d.homepage||{},f=d.footer||{},brand=d.branding||{};
put('.v15-brand strong',brand.clinicName,100);put('.v15-brand small',brand.tagline,140);
put('body[data-page="home"] h1',h.heroTitle,140);put('body[data-page="home"] .fx-slider .fx-sub',h.heroSubtitle,260);
put('[data-home-section="patient"] h2',h.stepsTitle,130);
put('#v8-values .v8-value:nth-of-type(1) p',h.vision,650);put('#v8-values .v8-value:nth-of-type(2) p',h.mission,650);
const goals=document.querySelector('#v8-values .v8-value:nth-of-type(3) ul');if(goals&&typeof h.goals==='string'&&h.goals.trim()){
 goals.replaceChildren(...h.goals.split(/[،,\n]/).map(v=>v.trim()).filter(Boolean).slice(0,7).map(v=>{const li=document.createElement('li');li.textContent=v;return li}));}
if(f.email&&/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email))document.querySelectorAll('.v15-footer a[href^="mailto:"]').forEach(a=>{a.href='mailto:'+f.email;a.textContent=f.email});
if(f.phone&&/^\+?\d{7,15}$/.test(f.phone)){const a=document.querySelector('.v15-footer a[href="tel:738007272"]');if(a){a.href='tel:'+f.phone;a.textContent=f.phone}}
if(f.whatsapp&&/^\+?\d{7,15}$/.test(f.whatsapp)){const n=f.whatsapp.replace(/^\+/, '');const full=n.startsWith('967')?n:'967'+n;const a=document.querySelector('.v15-footer a[href="tel:782007272"]');if(a){a.href='tel:'+f.whatsapp;a.textContent=f.whatsapp}document.querySelectorAll('.v15-sticky-wa,.v15-book-now').forEach(a=>a.href='https://wa.me/'+full)}
const urls=[['instagram','instagram.com'],['youtube','youtube.com'],['facebook','facebook.com']];for(const [key,domain]of urls){const u=secureLink(f[key]);if(!u||!new URL(u).hostname.endsWith(domain))continue;const a=document.querySelector('.v15-footer a[href*="'+domain+'"]');if(a)a.href=u}
}).catch(()=>{});
})();