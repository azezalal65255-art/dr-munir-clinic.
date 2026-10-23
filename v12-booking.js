/* Populate booking exam field from the same authoritative catalog used throughout the website. */
(async()=>{'use strict';const select=document.getElementById('fservice');if(!select)return;
try{const response=await fetch('services-catalog.json',{cache:'no-cache'});if(!response.ok)return;const data=await response.json();
const groups=(data.groups||[]).filter(g=>g.visible!==false);if(!groups.length)return;
select.replaceChildren();const place=document.createElement('option');place.value='';place.textContent='اختر الفحص أو الإجراء';select.append(place);
for(const g of groups){const optgroup=document.createElement('optgroup');optgroup.label=g.title;
for(const item of g.items||[]){if(item.visible===false)continue;const opt=document.createElement('option');opt.value=item.id||item.title;opt.textContent=item.title;optgroup.append(opt)}select.append(optgroup)}
const wanted=new URLSearchParams(location.search).get('service');if(wanted){for(const option of select.options){if(option.text===wanted||option.value===wanted){select.value=option.value;break}}}
}catch(e){console.warn('Booking uses fallback options:',e)}
})();
