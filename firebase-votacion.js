import {initializeApp} from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js';
import {getAuth,signInAnonymously,onAuthStateChanged} from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js';
import {getFirestore,doc,collection,setDoc,onSnapshot,serverTimestamp} from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js';
import {firebaseConfig,pollId} from './firebase-config.js';
const app=initializeApp(firebaseConfig), auth=getAuth(app),db=getFirestore(app);
const poll=doc(db,'votaciones',pollId), votes=collection(poll,'votos');
export function connect({onPoll,onVotes,onError,onUser}={}){
  const error=e=>{console.error(e);onError?.(e.message||String(e));};
  let unsubPoll=()=>{},unsubVotes=()=>{};
  onAuthStateChanged(auth,u=>{if(u){onUser?.(u);unsubPoll();unsubVotes();unsubPoll=onSnapshot(poll,s=>onPoll?.(s.data()),error);unsubVotes=onSnapshot(votes,s=>{const counts=[0,0,0];s.forEach(d=>{const n=['historia_clinica','experiencia_paciente','operacion_hospitalaria'].indexOf(d.data().opcion);if(n>=0)counts[n]++});onVotes?.(counts,s.size)},error)}else signInAnonymously(auth).catch(error)},error);
  return ()=>{unsubPoll();unsubVotes()};
}
export async function castVote(option){if(!auth.currentUser)throw Error('Todavía se está conectando Firebase');await setDoc(doc(votes,auth.currentUser.uid),{opcion:option,creadoEn:serverTimestamp()});}
