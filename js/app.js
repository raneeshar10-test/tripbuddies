// Integration: wires all modules together (tabs, rendering, click routing).
import {authReady} from './firebase.js';
import {S,$,hooks,ls,toast} from './state.js';
import * as groups from './modules/groups.js';
import * as photos from './modules/photos.js';
import * as location from './modules/location.js';
import * as schedule from './modules/schedule.js';
import * as expenses from './modules/expenses.js';
import * as explore from './modules/explore.js';
import * as sos from './modules/sos.js';
const A={};[groups,photos,location,schedule,expenses,explore,sos].forEach(m=>Object.assign(A,m.actions||{}));
const TABS=[['photos','📷','Photos',()=>photos.view()],['plan','🍽️','Plan',()=>location.view()+schedule.view()],['money','💸','Split',()=>expenses.view()],['explore','🧭','Explore',()=>explore.view()],['sos','🚨','SOS',()=>sos.view()]];
hooks.render=function(msg){
  const app=$('app'),nav=$('nav');
  if(!S.gid||!S.g){nav.style.display='none';app.innerHTML=groups.homeView(typeof msg==='string'?msg:'');return}
  const a=document.activeElement;if(a&&/INPUT|TEXTAREA|SELECT/.test(a.tagName)&&a.type!=='checkbox'&&app.contains(a))return;
  nav.style.display='flex';
  nav.innerHTML=TABS.map(t=>`<button data-t="${t[0]}" class="${S.tab===t[0]?'on':''}">${t[1]}<br>${t[2]}</button>`).join('');
  app.innerHTML=groups.headerView()+sos.banner()+TABS.find(t=>t[0]===S.tab)[3]();
};
document.addEventListener('click',e=>{const t=e.target.closest('[data-t],[data-a]');if(!t)return;
  if(t.dataset.t){S.tab=t.dataset.t;hooks.render();return}
  e.preventDefault();const f=A[t.dataset.a];if(f)Promise.resolve(f(t)).catch(err=>{console.error(err);toast('Something went wrong: '+(err.code||err.message))})});
document.addEventListener('input',e=>{
  const t=e.target;
  if(t.id==='myn')ls.set('tb_name',t.value);
  else if(t.id==='myp')ls.set('tb_phone',t.value);
});
document.addEventListener('focusout',()=>setTimeout(()=>hooks.render(),200));
schedule.start();
(async()=>{
  try{S.uid=(await authReady).uid}catch(e){$('app').innerHTML='<div class="card">Could not sign in. Check js/config.js and that Anonymous sign-in is enabled in Firebase.</div>';return}
  const g=ls.get('tb_gid');if(g)await groups.enter(g,true);else hooks.render();
})();
