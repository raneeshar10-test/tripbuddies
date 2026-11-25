// Module 4: meal schedule + reminders 10 min before (fires while the page is open).
import {db,doc,updateDoc} from '../firebase.js';
import {S,$,esc,isAdmin,gp,toast,ls,MEALS,DEF} from '../state.js';
export const view=()=>{const s=S.g.sched||DEF;return`<h2>⏰ Meal times</h2><div class="card"><p class="m">Everyone gets a reminder 10 minutes before.</p>
${MEALS.map(k=>`<div class="row"><b>${k}</b>${isAdmin()?`<input type="time" id="t_${k}" value="${esc(s[k]||DEF[k])}" style="width:130px">`:`<span>${esc(s[k]||DEF[k])}</span>`}</div>`).join('')}
${isAdmin()?'<button data-a="sched">Save schedule</button>':''}<button class="s" data-a="notif">Enable notifications</button></div>`};
async function sched(){const s={};MEALS.forEach(k=>s[k]=$('t_'+k).value||DEF[k]);await updateDoc(doc(db,gp()),{sched:s});toast('Schedule saved')}
function notif(){if('Notification' in window)Notification.requestPermission().then(r=>toast(r==='granted'?'Notifications on':'Blocked; in-page reminders still work'));else toast('Not supported; in-page reminders still work')}
export function start(){setInterval(()=>{if(!S.g)return;const n=new Date(),s=S.g.sched||DEF;
  MEALS.forEach(k=>{const[h,m]=(s[k]||DEF[k]).split(':').map(Number),d=new Date(n);d.setHours(h,m-10,0,0);const key='tb_r_'+S.gid+k+d.toDateString();
  if(Math.abs(n-d)<45000&&!ls.get(key)){ls.set(key,1);const msg=k+' in 10 minutes ('+s[k]+')';toast('⏰ '+msg);try{if(Notification.permission==='granted')new Notification('TripBuddies',{body:msg})}catch(e){}}})},20000)}
export const actions={sched,notif};
