// Backend layer: the only file that talks to Firebase directly.
import {initializeApp} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {getAuth,signInAnonymously,onAuthStateChanged} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {getFirestore,doc,getDoc,setDoc,updateDoc,deleteDoc,addDoc,collection,onSnapshot} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import {getStorage,ref,uploadBytes,getDownloadURL} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";
import {firebaseConfig} from "./config.js";
const app=initializeApp(firebaseConfig);
export const auth=getAuth(app),db=getFirestore(app),storage=getStorage(app);
export {doc,getDoc,setDoc,updateDoc,deleteDoc,addDoc,collection,onSnapshot,ref,uploadBytes,getDownloadURL};
export const authReady=new Promise((res,rej)=>{
  onAuthStateChanged(auth,u=>{if(u)res(u)});
  signInAnonymously(auth).catch(rej);
});
