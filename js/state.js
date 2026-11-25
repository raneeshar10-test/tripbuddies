// Shared state and helpers used by every module.
export const S={tab:'photos',gid:null,g:null,uid:null,members:{},photos:[],splits:[],alerts:[]};
export const hooks={render:()=>{}};
export const MEALS=['Breakfast','Lunch','Tea','Dinner'],DEF={Breakfast:'08:00',Lunch:'13:00',Tea:'16:30',Dinner:'20:00'};
export const $=id=>document.getElementById(id);
export const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const ls={get:k=>{try{return localStorage.getItem(k)}catch(e){return null}},set:(k,v)=>{try{localStorage.setItem(k,v)}catch(e){}}};
export const gp=p=>'groups/'+S.gid+(p?'/'+p:'');
export const isAdmin=()=>!!S.g&&S.g.admin===S.uid;
export const nm=id=>(S.members[id]&&S.members[id].name)||'Member';
export const maps=q=>'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(q);
export const pos=()=>new Promise(r=>navigator.geolocation?navigator.geolocation.getCurrentPosition(p=>r(p.coords),()=>r(null),{timeout:8000}):r(null));
export function toast(t){const e=$('toast');e.textContent=t;e.style.display='block';setTimeout(()=>e.style.display='none',9000)}
