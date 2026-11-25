// Module 6: nearby places, restaurants and activities (Google Maps searches).
import {S,esc,maps,pos,toast} from '../state.js';
export const view=()=>{const d=S.g.dest||(S.g.loc&&S.g.loc.label)||'';
return`<h2>Explore near ${esc(d||'you')}</h2><div class="card">${[['Best restaurants','best restaurants'],['Places to explore','tourist attractions'],['Activities','things to do'],['Cafes','cafes']].map(x=>`<a class="btn s" target="_blank" rel="noopener" href="${esc(maps(x[1]+' near '+d))}">${x[0]}</a>`).join('')}<button data-a="near">Near my current location</button></div>`};
async function near(){const c=await pos();if(!c)return toast('Location unavailable');open(maps('restaurants, attractions near '+c.latitude+','+c.longitude),'_blank')}
export const actions={near};
