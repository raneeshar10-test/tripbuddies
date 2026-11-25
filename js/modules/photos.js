// Module 2: shared group photos (Firebase Storage + Firestore index).
import {db,storage,collection,addDoc,ref,uploadBytes,getDownloadURL} from '../firebase.js';
import {S,$,esc,nm,gp,toast} from '../state.js';
export const view=()=>`<h2>Group photos</h2><div class="card"><input type="file" id="ph" accept="image/*" multiple><button data-a="upl">Share photos</button></div>
<div class="g">${S.photos.map(p=>`<a href="${esc(p.url)}" target="_blank" rel="noopener"><img loading="lazy" src="${esc(p.url)}" alt="Photo by ${esc(nm(p.by))}"></a>`).join('')||'<p class="m">No photos yet.</p>'}</div>`;
async function upl(){
  const f=[...$('ph').files];if(!f.length)return;toast('Uploading…');
  for(const x of f){try{
    const r=ref(storage,`groups/${S.gid}/${Date.now()}_${x.name.replace(/[^\w.-]/g,'_')}`);
    await uploadBytes(r,x);await addDoc(collection(db,gp('photos')),{url:await getDownloadURL(r),by:S.uid,ts:Date.now()});
  }catch(e){console.error(e);toast('Upload failed for one photo')}}
  toast('Photos shared ✓');
}
export const actions={upl};
