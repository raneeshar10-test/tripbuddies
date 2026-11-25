// Module 5: split expenses. Only the author can mark paid / delete (enforced in firestore.rules too).
import {db,doc,collection,addDoc,updateDoc,deleteDoc} from '../firebase.js';
import {S,$,esc,nm,gp,toast} from '../state.js';
export const view=()=>{const ids=Object.keys(S.members);
return`<h2>New split</h2><div class="card"><input id="st" placeholder="What for? (e.g. Dinner)"><input id="sa" type="number" min="0" step="0.01" placeholder="Total amount"><p class="m">Who shared this?</p>
${ids.map(i=>`<label class="c"><input type="checkbox" class="sm" value="${esc(i)}" checked> ${esc(nm(i))}</label>`).join('')}<button data-a="split">Create split</button></div>
<h2>Splits</h2>${S.splits.map(sp=>{const au=sp.author===S.uid;
return`<div class="card"><div class="row"><b>${esc(sp.title)}</b><span>${esc(sp.total)} total</span></div><div class="m">By ${esc(nm(sp.author))} · ${(sp.total/sp.members.length).toFixed(2)} each</div>
${sp.members.map(i=>`<div class="row"><span>${esc(nm(i))}</span>${sp.paid&&sp.paid[i]?'<span class="tag">Paid ✓</span>':''}${i===sp.author?'<span class="tag">Author</span>':(au?`<button class="s" data-a="paid" data-id="${esc(sp.id)}" data-m="${esc(i)}">${sp.paid&&sp.paid[i]?'Undo':'Mark paid'}</button>`:'')}</div>`).join('')}
${au?`<button class="d" data-a="delsp" data-id="${esc(sp.id)}">Delete split</button>`:'<p class="m">Only the author can mark paid or delete.</p>'}</div>`}).join('')||'<p class="m">No splits yet.</p>'}`};
async function split(){const t=$('st').value.trim(),a=parseFloat($('sa').value),m=[...document.querySelectorAll('.sm:checked')].map(x=>x.value);
  if(!t||!(a>0)||!m.length)return toast('Add title, amount and members');
  await addDoc(collection(db,gp('splits')),{title:t,total:a,members:m,paid:{},author:S.uid,ts:Date.now()})}
async function paid(e){const sp=S.splits.find(x=>x.id===e.dataset.id);if(!sp||sp.author!==S.uid)return;const p={...(sp.paid||{})};p[e.dataset.m]=!p[e.dataset.m];await updateDoc(doc(db,gp('splits/'+sp.id)),{paid:p})}
async function delsp(e){const sp=S.splits.find(x=>x.id===e.dataset.id);if(sp&&sp.author===S.uid&&confirm('Delete this split?'))await deleteDoc(doc(db,gp('splits/'+sp.id)))}
export const actions={split,paid,delsp};
