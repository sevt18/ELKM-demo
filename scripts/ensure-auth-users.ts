import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import firebaseConfig from '../firebase-applet-config.json';
import { MOCK_USERS } from '../src/data/mockKits';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

async function ensureMockUsers() {
  const pass = 'ElkmSecure2026!';
  for (const user of MOCK_USERS) {
    try {
      await signInWithEmailAndPassword(auth, user.email, pass);
      console.log(`✓ Usuario ya existe y autentica: ${user.email}`);
    } catch (e: any) {
      if (e.code === 'auth/user-not-found' || e.code === 'auth/invalid-credential') {
        try {
          const cred = await createUserWithEmailAndPassword(auth, user.email, pass);
          await updateProfile(cred.user, { displayName: user.name });
          console.log(`+ Creado usuario en Firebase Auth: ${user.email}`);
        } catch (createErr) {
          console.error(`Error creando ${user.email}:`, createErr);
        }
      } else {
        console.error(`Error con ${user.email}:`, e);
      }
    }
  }
}

ensureMockUsers().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
