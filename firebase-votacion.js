import {initializeApp} from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js';
import {getAuth,signInAnonymously,onAuthStateChanged} from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js';
import {getFirestore,doc,collection,setDoc,onSnapshot,serverTimestamp} from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js';
import {firebaseConfig,pollId} from './firebase-config.js';
const app=initializeApp(firebaseConfig), auth=getAuth(app),db=getFirestore(app);
const OPTIONS={seminario2026:['historia_clinica','experiencia_paciente','operacion_hospitalaria'],digitaltwins2026:['robots','modelo_virtual','historia_digital','interoperabilidad'],reemplazoia2026:['dr_chatgpt','paciencia_enfermeria','turnos_12_horas','ventaja_ia','si_reemplazara']};
const target=(id)=>{if(!OPTIONS[id])throw Error('Encuesta desconocida');const poll=doc(db,'votaciones',id);return {poll,votes:collection(poll,'votos'),options:OPTIONS[id]}};
export function connect({onPoll,onVotes,onError,onUser,id=pollId}={}){
 const {poll,votes,options}=target(id);const error=e=>{console.error(e);onError?.(e.message||String(e));};let unsubPoll=()=>{},unsubVotes=()=>{};
 onAuthStateChanged(auth,u=>{if(u){onUser?.(u);unsubPoll();unsubVotes();unsubPoll=onSnapshot(poll,s=>onPoll?.(s.data()),error);unsubVotes=onSnapshot(votes,s=>{const counts=options.map(()=>0);s.forEach(d=>{const n=options.indexOf(d.data().opcion);if(n>=0)counts[n]++});onVotes?.(counts,s.size)},error)}else signInAnonymously(auth).catch(error)},error);
 return ()=>{unsubPoll();unsubVotes()};
}
export async function castVote(option,id=pollId){if(!auth.currentUser)throw Error('Todavía se está conectando Firebase');const {votes,options}=target(id);if(!options.includes(option))throw Error('Opción inválida');await setDoc(doc(votes,auth.currentUser.uid),{opcion:option,creadoEn:serverTimestamp()});}
