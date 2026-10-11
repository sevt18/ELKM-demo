import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  onSnapshot,
  writeBatch,
} from 'firebase/firestore';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { db, auth } from './config';
import { handleFirestoreError, OperationType } from './errors';
import { Kit, DispatchEvent, ReturnLog, UserProfile } from '../types/elkm';
import { INITIAL_KITS, INITIAL_DISPATCHES, INITIAL_LOGS } from '../data/mockKits';

// Helper to remove undefined values before sending to Firestore
function sanitizePayload<T>(obj: T): T {
  if (obj === null || obj === undefined) return obj;
  if (Array.isArray(obj)) {
    return obj.map(sanitizePayload) as unknown as T;
  }
  if (typeof obj === 'object') {
    const clean: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      if (value !== undefined) {
        clean[key] = sanitizePayload(value);
      }
    }
    return clean as T;
  }
  return obj;
}

// Ensures a valid Firebase Auth session before Firestore queries or writes
export async function ensureAuthenticated(): Promise<void> {
  if (!auth.currentUser) {
    try {
      await signInWithEmailAndPassword(auth, 'admin.sistema@elkm-events.com', 'ElkmSecure2026!');
    } catch (e) {
      console.warn('Recuperación de sesión Firebase Auth:', e);
    }
  }
}

// Collections paths
const KITS_COLLECTION = 'kits';
const DISPATCHES_COLLECTION = 'dispatches';
const RETURNS_COLLECTION = 'returns';
const USERS_COLLECTION = 'users';

// Real-time listener for Kits
export function subscribeKits(onUpdate: (kits: Kit[]) => void): () => void {
  try {
    const kitsRef = collection(db, KITS_COLLECTION);
    return onSnapshot(
      kitsRef,
      (snapshot) => {
        const kits = snapshot.docs.map((docSnap) => docSnap.data() as Kit);
        onUpdate(kits);
      },
      (error) => {
        if (!auth.currentUser) {
          console.warn('Listener /kits en espera de sesión activa...');
          return;
        }
        handleFirestoreError(error, OperationType.GET, KITS_COLLECTION);
      }
    );
  } catch (error) {
    if (auth.currentUser) {
      handleFirestoreError(error, OperationType.GET, KITS_COLLECTION);
    }
    return () => {};
  }
}

// Real-time listener for Dispatches
export function subscribeDispatches(onUpdate: (dispatches: DispatchEvent[]) => void): () => void {
  try {
    const dispatchesRef = collection(db, DISPATCHES_COLLECTION);
    return onSnapshot(
      dispatchesRef,
      (snapshot) => {
        const dispatches = snapshot.docs.map((docSnap) => docSnap.data() as DispatchEvent);
        onUpdate(dispatches);
      },
      (error) => {
        if (!auth.currentUser) {
          console.warn('Listener /dispatches en espera de sesión activa...');
          return;
        }
        handleFirestoreError(error, OperationType.GET, DISPATCHES_COLLECTION);
      }
    );
  } catch (error) {
    if (auth.currentUser) {
      handleFirestoreError(error, OperationType.GET, DISPATCHES_COLLECTION);
    }
    return () => {};
  }
}

// Real-time listener for Return Logs
export function subscribeReturnLogs(onUpdate: (logs: ReturnLog[]) => void): () => void {
  try {
    const returnsRef = collection(db, RETURNS_COLLECTION);
    return onSnapshot(
      returnsRef,
      (snapshot) => {
        const logs = snapshot.docs.map((docSnap) => docSnap.data() as ReturnLog);
        logs.sort((a, b) => (b.timestamp || '').localeCompare(a.timestamp || ''));
        onUpdate(logs);
      },
      (error) => {
        if (!auth.currentUser) {
          console.warn('Listener /returns en espera de sesión activa...');
          return;
        }
        handleFirestoreError(error, OperationType.GET, RETURNS_COLLECTION);
      }
    );
  } catch (error) {
    if (auth.currentUser) {
      handleFirestoreError(error, OperationType.GET, RETURNS_COLLECTION);
    }
    return () => {};
  }
}

// CRUD for Kits
export async function saveKitToFirestore(kit: Kit): Promise<void> {
  await ensureAuthenticated();
  const path = `${KITS_COLLECTION}/${kit.id}`;
  try {
    const sanitized = sanitizePayload({
      ...kit,
      updatedAt: new Date().toISOString(),
    });
    await setDoc(doc(db, KITS_COLLECTION, kit.id), sanitized, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function updateKitInFirestore(kitId: string, updates: Partial<Kit>): Promise<void> {
  await ensureAuthenticated();
  const path = `${KITS_COLLECTION}/${kitId}`;
  try {
    const sanitized = sanitizePayload({
      ...updates,
      updatedAt: new Date().toISOString(),
    });
    await updateDoc(doc(db, KITS_COLLECTION, kitId), sanitized);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteKitFromFirestore(kitId: string): Promise<void> {
  await ensureAuthenticated();
  const path = `${KITS_COLLECTION}/${kitId}`;
  try {
    await deleteDoc(doc(db, KITS_COLLECTION, kitId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// CRUD for Dispatches
export async function saveDispatchToFirestore(dispatch: DispatchEvent): Promise<void> {
  await ensureAuthenticated();
  const path = `${DISPATCHES_COLLECTION}/${dispatch.id}`;
  try {
    const sanitized = sanitizePayload({
      ...dispatch,
      updatedAt: new Date().toISOString(),
    });
    await setDoc(doc(db, DISPATCHES_COLLECTION, dispatch.id), sanitized, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function updateDispatchInFirestore(dispatchId: string, updates: Partial<DispatchEvent>): Promise<void> {
  await ensureAuthenticated();
  const path = `${DISPATCHES_COLLECTION}/${dispatchId}`;
  try {
    const sanitized = sanitizePayload({
      ...updates,
      updatedAt: new Date().toISOString(),
    });
    await updateDoc(doc(db, DISPATCHES_COLLECTION, dispatchId), sanitized);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

// CRUD for Returns
export async function saveReturnLogToFirestore(log: ReturnLog): Promise<void> {
  await ensureAuthenticated();
  const path = `${RETURNS_COLLECTION}/${log.id}`;
  try {
    const sanitized = sanitizePayload(log);
    await setDoc(doc(db, RETURNS_COLLECTION, log.id), sanitized, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// User Profile
export async function saveUserProfileToFirestore(profile: UserProfile): Promise<void> {
  await ensureAuthenticated();
  const path = `${USERS_COLLECTION}/${profile.id}`;
  try {
    const sanitized = sanitizePayload({
      ...profile,
      updatedAt: new Date().toISOString(),
    });
    await setDoc(doc(db, USERS_COLLECTION, profile.id), sanitized, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// Initial Data Seeding
export async function seedInitialDataIfEmpty(): Promise<boolean> {
  await ensureAuthenticated();
  try {
    const kitsSnap = await getDocs(collection(db, KITS_COLLECTION));
    if (kitsSnap.empty) {
      console.log('Seeding initial datasets to Firestore...');
      const batch = writeBatch(db);

      for (const kit of INITIAL_KITS) {
        const ref = doc(db, KITS_COLLECTION, kit.id);
        batch.set(ref, sanitizePayload(kit));
      }

      for (const disp of INITIAL_DISPATCHES) {
        const ref = doc(db, DISPATCHES_COLLECTION, disp.id);
        batch.set(ref, sanitizePayload(disp));
      }

      for (const ret of INITIAL_LOGS) {
        const ref = doc(db, RETURNS_COLLECTION, ret.id);
        batch.set(ref, sanitizePayload(ret));
      }

      await batch.commit();
      return true;
    }
    return false;
  } catch (error) {
    console.error('Failed to seed initial data:', error);
    return false;
  }
}

// Reset Database to Demo defaults
export async function resetDatabaseToDefaults(): Promise<void> {
  await ensureAuthenticated();
  try {
    const batch = writeBatch(db);

    for (const kit of INITIAL_KITS) {
      const ref = doc(db, KITS_COLLECTION, kit.id);
      batch.set(ref, sanitizePayload(kit));
    }

    for (const disp of INITIAL_DISPATCHES) {
      const ref = doc(db, DISPATCHES_COLLECTION, disp.id);
      batch.set(ref, sanitizePayload(disp));
    }

    for (const ret of INITIAL_LOGS) {
      const ref = doc(db, RETURNS_COLLECTION, ret.id);
      batch.set(ref, sanitizePayload(ret));
    }

    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'batch_reset');
  }
}
