import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc, writeBatch, collection, getDocs } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';
import { INITIAL_KITS, INITIAL_DISPATCHES, INITIAL_LOGS, MOCK_USERS } from '../src/data/mockKits';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
const auth = getAuth(app);

function sanitize(obj: any): any {
  if (obj === null || obj === undefined) return obj;
  if (Array.isArray(obj)) return obj.map(sanitize);
  if (typeof obj === 'object') {
    const res: Record<string, any> = {};
    for (const [k, v] of Object.entries(obj)) {
      if (v !== undefined) res[k] = sanitize(v);
    }
    return res;
  }
  return obj;
}

async function run() {
  console.log('🚀 Iniciando subida de datos a Firebase Firestore...');
  console.log(`📡 Database ID: ${firebaseConfig.firestoreDatabaseId}`);

  const email = 'admin.sistema@elkm-events.com';
  const pass = 'ElkmSecure2026!';

  try {
    try {
      await signInWithEmailAndPassword(auth, email, pass);
      console.log('✅ Autenticado en Firebase con usuario admin de sistema.');
    } catch (e: any) {
      if (e.code === 'auth/user-not-found' || e.code === 'auth/invalid-credential') {
        console.log('Creando usuario de sistema en Firebase Auth...');
        await createUserWithEmailAndPassword(auth, email, pass);
        console.log('✅ Creado y autenticado en Firebase Auth.');
      } else {
        throw e;
      }
    }

    console.log(`📦 Subiendo ${INITIAL_KITS.length} Kits a /kits/...`);
    for (const kit of INITIAL_KITS) {
      await setDoc(doc(db, 'kits', kit.id), sanitize({
        ...kit,
        updatedAt: new Date().toISOString(),
      }), { merge: true });
      console.log(`   + Kit: ${kit.id} (${kit.name})`);
    }

    console.log(`📋 Subiendo ${INITIAL_DISPATCHES.length} Despachos a /dispatches/...`);
    for (const disp of INITIAL_DISPATCHES) {
      await setDoc(doc(db, 'dispatches', disp.id), sanitize({
        ...disp,
        updatedAt: new Date().toISOString(),
      }), { merge: true });
      console.log(`   + Despacho: ${disp.id} (${disp.eventName})`);
    }

    console.log(`📝 Subiendo ${INITIAL_LOGS.length} Logs de Retorno a /returns/...`);
    for (const log of INITIAL_LOGS) {
      await setDoc(doc(db, 'returns', log.id), sanitize(log), { merge: true });
      console.log(`   + Retorno: ${log.id} (${log.kitName})`);
    }

    console.log(`👤 Subiendo ${MOCK_USERS.length} Perfiles de Usuario a /users/...`);
    for (const user of MOCK_USERS) {
      await setDoc(doc(db, 'users', user.id), sanitize({
        ...user,
        updatedAt: new Date().toISOString(),
      }), { merge: true });
      console.log(`   + Usuario: ${user.id} (${user.name})`);
    }

    console.log('\n🎉 ¡TODOS LOS DATOS FUERON SUBIDOS EXITOSAMENTE A FIREBASE FIRESTORE!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error al subir datos:', err);
    process.exit(1);
  }
}

run();
