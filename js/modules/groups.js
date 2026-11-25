// Module 1: create/join groups, live subscriptions for the whole group.
import {db,doc,getDoc,setDoc,collection,onSnapshot} from '../firebase.js';
import {S,$,esc,ls,toast,hooks,nm,gp,DEF} from '../state.js';
const unsubs=[];
export function homeView(msg){return`<h1>🧭 TripBuddies</h1><p class="m">Private group space for your trip: photos, plans, expenses and safety alerts.</p>${msg?`<div class="card">${esc(msg)}</div>`:''}
<div class="card"><h2>Your details</h2><input id="myn" placeholder="Your name" value="${esc(ls.get('tb_name')||'')}"><input id="myp" type="tel" placeholder="Your phone (optional, for emergency SMS)" value="${esc(ls.get('tb_phone')||'')}"></div>
<div class="card"><h2>Create a group (you become admin)</h2><input id="gn" placeholder="Group name"><input id="gd" placeholder="Destination (e.g. Munnar, Kerala)"><input id="gt" type="tel" placeholder="Emergency contact number (third person)"><button data-a="create">Create group</button></div>
<div class="card"><h2>Join a group</h2><input id="gc" placeholder="Group code" style="text-transform:uppercase"><button data-a="join">Join</button></div>`}
export function headerView(){return`<div class="row"><h1>${esc(S.g.name)}</h1><span class="tag">Code ${esc(S.gid)}</span></div><p class="m">${Object.keys(S.members).length} members · ${S.g.admin===S.uid?'You are admin':'Admin: '+esc(nm(S.g.admin))} · <a href="#" data-a="leave" style="color:var(--mut)">switch group</a></p>`}
const me=()=>{const n=$('myn').value.trim(),p=$('myp').value.trim();if(!n){toast('Enter your name first');return null}ls.set('tb_name',n);ls.set('tb_phone',p);return{name:n,phone:p}};
async function create(){
  const m=me();if(!m)return;const name=$('gn').value.trim();if(!name)return toast('Enter a group name');
  const code=Array.from({length:6},()=>'ABCDEFGHJKMNPQRSTUVWXYZ23456789'[Math.random()*31|0]).join('');
  S.gid=code;
  await setDoc(doc(db,gp()),{name,dest:$('gd').value.trim(),third:$('gt').value.trim(),admin:S.uid,sched:DEF,loc:null,ts:Date.now()});
  await enter(code,false,m);
}
async function join(){
  const m=me();if(!m)return;const code=$('gc').value.trim().toUpperCase();if(!code)return;
  S.gid=code;
  try{if(!(await getDoc(doc(db,gp()))).exists()){S.gid=null;return toast('No group with that code')}}catch(e){S.gid=null;return toast('Could not look up group')}
  await enter(code,false,m);
}
export async function enter(code,quiet,m){
  S.gid=code;
  const s=await getDoc(doc(db,gp())).catch(()=>null);
  if(!s||!s.exists()){ls.set('tb_gid','');S.gid=null;S.g=null;return hooks.render(quiet?'':'Group not found')}
  m=m||{name:ls.get('tb_name')||'Member',phone:ls.get('tb_phone')||''};
  await setDoc(doc(db,gp('members/'+S.uid)),m,{merge:true});
  ls.set('tb_gid',code);S.g=s.data();unsubs.forEach(u=>u());unsubs.length=0;
  const sub=(p,fn)=>unsubs.push(onSnapshot(collection(db,gp(p)),q=>{fn(q.docs.map(d=>({id:d.id,...d.data()})));hooks.render()},e=>console.error(p,e)));
  unsubs.push(onSnapshot(doc(db,gp()),d=>{S.g=d.data();hooks.render()}));
  sub('members',a=>{S.members={};a.forEach(x=>S.members[x.id]=x)});
  sub('photos',a=>S.photos=a.sort((x,y)=>y.ts-x.ts));
  sub('splits',a=>S.splits=a.sort((x,y)=>y.ts-x.ts));
  let first=true;
  sub('alerts',a=>{a.sort((x,y)=>y.ts-x.ts);if(!first&&a[0]&&a[0].by!==S.uid&&!S.alerts.some(z=>z.id===a[0].id))toast('🚨 '+a[0].type+' alert from '+nm(a[0].by));first=false;S.alerts=a});
  hooks.render();
}
function leave(){ls.set('tb_gid','');unsubs.forEach(u=>u());unsubs.length=0;S.gid=null;S.g=null;hooks.render()}
export const actions={create,join,leave};
