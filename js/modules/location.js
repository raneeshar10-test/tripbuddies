// Module 3: admin shares a location.
import {db,doc,updateDoc} from '../firebase.js';
import {S,$,esc,isAdmin,gp,maps,pos,toast} from '../state.js';
export const view=()=>{const l=S.g.loc;return`<h2>📍 Shared location</h2><div class="card">${l?`<b>${esc(l.label||'Shared spot')}</b><br><a class="btn s" target="_blank" rel="noopener" href="${esc(maps(l.lat?l.lat+','+l.lng:l.label))}">Open in Maps</a><div class="m">Updated ${new Date(l.ts).toLocaleString()}</div>`:'<p class="m">Nothing shared yet.</p>'}
${isAdmin()?`<input id="ll" placeholder="Place name (e.g. Hotel Lake View)" value="${esc(l&&l.label||'')}"><button data-a="loc">Share my current location</button><button class="s" data-a="locn">Share place name only</button>`:''}</div>`};
async function loc(){const c=await pos();if(!c)return toast('Location unavailable');await updateDoc(doc(db,gp()),{loc:{lat:c.latitude,lng:c.longitude,label:$('ll').value.trim()||'Shared location',ts:Date.now()}})}
async function locn(){const v=$('ll').value.trim();if(v)await updateDoc(doc(db,gp()),{loc:{label:v,ts:Date.now()}})}
export const actions={loc,locn};
