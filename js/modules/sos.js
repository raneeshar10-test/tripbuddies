// Module 7: emergency alerts to all members + SMS to the emergency contact.
import {db,doc,collection,addDoc,updateDoc} from '../firebase.js';
import {S,$,esc,nm,isAdmin,gp,maps,pos,toast} from '../state.js';
export const banner=()=>{const a=S.alerts[0];return a&&Date.now()-a.ts<6*3600e3?`<div class="alert">🚨 <b>${esc(a.type)}</b> from ${esc(nm(a.by))}: ${esc(a.note)} ${a.map?`<a style="color:#fff" target="_blank" rel="noopener" href="${esc(a.map)}">Location</a>`:''}</div>`:''};
export const view=()=>`<h2>Emergency alert</h2><div class="card"><p class="m">Alerts every member instantly and prepares an SMS to the emergency contact${S.g.third?' ('+esc(S.g.third)+')':''}.</p>
<select id="at"><option>Accident</option><option>Natural disaster</option><option>Medical emergency</option><option>Lost / unsafe</option><option>Other</option></select><textarea id="an" rows="2" placeholder="What happened?"></textarea><button class="d" data-a="sos">Send alert</button></div>
${isAdmin()?`<div class="card"><b>Emergency contact (third person)</b><input id="et" type="tel" value="${esc(S.g.third||'')}"><button data-a="third">Save</button></div>`:''}
<h2>Past alerts</h2>${S.alerts.map(a=>`<div class="card"><b>${esc(a.type)}</b> · ${esc(nm(a.by))}<div>${esc(a.note)}</div><div class="m">${new Date(a.ts).toLocaleString()}</div></div>`).join('')||'<p class="m">None.</p>'}`;
async function third(){await updateDoc(doc(db,gp()),{third:$('et').value.trim()});toast('Saved')}
async function sos(){
  const type=$('at').value,note=$('an').value.trim()||'Needs help',c=await pos(),map=c?maps(c.latitude+','+c.longitude):'';
  await addDoc(collection(db,gp('alerts')),{type,note,map,by:S.uid,ts:Date.now()});
  const nums=[S.g.third,...Object.values(S.members).map(m=>m.phone)].filter(Boolean),body=`TripBuddies ALERT (${S.g.name}): ${type} - ${note}. From ${nm(S.uid)}. ${map}`;
  toast('Alert sent to the group');if(nums.length)location.href='sms:'+nums.join(',')+'?&body='+encodeURIComponent(body);
}
export const actions={third,sos};
