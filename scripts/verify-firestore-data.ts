import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
const auth = getAuth(app);

async function verify() {
  await signInWithEmailAndPassword(auth, 'admin.sistema@elkm-events.com', 'ElkmSecure2026!');
  
  const collections = ['kits', 'dispatches', 'returns', 'users'];
  console.log('\n📊 ESTADO EN LA NUBE - FIRESTORE:');
  for (const col of collections) {
    const snap = await getDocs(collection(db, col));
    console.log(`📁 Colección '/${col}': ${snap.size} documentos`);
    snap.docs.forEach((d) => console.log(`   - ID: ${d.id}`));
  }
}

verify().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
