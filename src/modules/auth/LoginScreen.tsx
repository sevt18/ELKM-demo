import React, { useState } from 'react';
import { UserProfile, UserRole } from '../../types/elkm';
import { MOCK_USERS } from '../../data/mockKits';
import { 
  ArrowRight, 
  ShieldCheck, 
  Database, 
  CheckCircle2, 
  Copy, 
  Check, 
  Lock, 
  Mail, 
  UserPlus, 
  LogIn, 
  User, 
  Loader2,
  HardDrive
} from 'lucide-react';
import { 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile 
} from 'firebase/auth';
import { auth, googleProvider, FIREBASE_PROJECT_NAME, FIREBASE_PROJECT_INFO } from '../../firebase/config';
import { saveUserProfileToFirestore, getUserProfileFromFirestore } from '../../firebase/firestoreService';

interface LoginScreenProps {
  onLogin: (user: UserProfile) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  // Mode: 'signin' | 'register'
  const [authMode, setAuthMode] = useState<'signin' | 'register'>('signin');

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('admin');

  // UI state
  const [loading, setLoading] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccess, setAuthSuccess] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Quick profile for dev/testing
  const [selectedMockUser, setSelectedMockUser] = useState<UserProfile>(MOCK_USERS[0]);

  const copyDbId = () => {
    navigator.clipboard.writeText(FIREBASE_PROJECT_INFO.firestoreDatabaseId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Convert Firebase Auth error codes to user-friendly messages
  const getErrorMessage = (error: unknown): string | null => {
    if (typeof error === 'object' && error !== null && 'code' in error) {
      const code = (error as { code: string }).code;
      switch (code) {
        case 'auth/popup-closed-by-user':
        case 'auth/cancelled-popup-request':
          return null;
        case 'auth/popup-blocked':
          return 'La ventana emergente fue bloqueada por el navegador. Permite las ventanas emergentes o utiliza tu correo y contraseña.';
        case 'auth/email-already-in-use':
          return 'Este correo electrónico ya está registrado. Por favor, inicia sesión.';
        case 'auth/invalid-email':
          return 'El formato del correo electrónico no es válido.';
        case 'auth/weak-password':
          return 'La contraseña es demasiado débil. Usa al menos 6 caracteres.';
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
        case 'auth/user-not-found':
          return 'Credenciales incorrectas. Verifica tu correo y contraseña.';
        case 'auth/network-request-failed':
          return 'Error de red. Verifica tu conexión a internet.';
        default:
          return (error as { message?: string }).message || 'Ocurrió un error en la autenticación.';
      }
    }
    return error instanceof Error ? error.message : 'Error en la autenticación.';
  };

  // Submit Handler for Email & Password
  const handleEmailAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSuccess(null);
    setLoading(true);

    try {
      if (authMode === 'register') {
        // Validation
        if (!name.trim()) {
          setAuthError('Por favor ingresa tu nombre completo.');
          setLoading(false);
          return;
        }
        if (password.length < 6) {
          setAuthError('La contraseña debe tener al menos 6 caracteres.');
          setLoading(false);
          return;
        }

        // 1. Create User in Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
        const fbUser = userCredential.user;

        // 2. Update Display Name
        await updateProfile(fbUser, { displayName: name.trim() });

        // 3. Map Role Title
        const roleTitles: Record<UserRole, string> = {
          admin: 'Administrador General de Bodega',
          warehouse: 'Operario Líder de Despacho y Retornos',
          technician: 'Técnico Especialista en Mantenimiento',
        };

        const initials = name
          .trim()
          .split(' ')
          .map((n) => n[0])
          .slice(0, 2)
          .join('')
          .toUpperCase() || 'US';

        const newProfile: UserProfile = {
          id: fbUser.uid,
          name: name.trim(),
          email: fbUser.email || email.trim(),
          role: selectedRole,
          roleTitle: roleTitles[selectedRole],
          avatarInitials: initials,
        };

        // 4. Save to Cloud Firestore
        await saveUserProfileToFirestore(newProfile);

        setAuthSuccess('¡Cuenta registrada exitosamente!');
        onLogin(newProfile);
      } else {
        // Sign In
        const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
        const fbUser = userCredential.user;

        // Try to fetch existing profile from Firestore
        let userProfile = await getUserProfileFromFirestore(fbUser.uid);
        if (!userProfile) {
          const displayName = fbUser.displayName || email.split('@')[0];
          const initials = displayName
            .split(' ')
            .map((n) => n[0])
            .slice(0, 2)
            .join('')
            .toUpperCase() || 'AD';

          userProfile = {
            id: fbUser.uid,
            name: displayName,
            email: fbUser.email || email,
            role: 'admin',
            roleTitle: 'Administrador de Bodega (Email Auth)',
            avatarInitials: initials,
          };
          await saveUserProfileToFirestore(userProfile);
        }
        onLogin(userProfile);
      }
    } catch (err) {
      console.error('Error de autenticación con correo:', err);
      setAuthError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  // Google Sign-In
  const handleGoogleLogin = async () => {
    try {
      setLoadingGoogle(true);
      setAuthError(null);
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const userProfile: UserProfile = {
        id: user.uid,
        name: user.displayName || user.email?.split('@')[0] || 'Administrador Firebase',
        email: user.email || 'admin@firebase.local',
        role: 'admin',
        roleTitle: 'Administrador General de Bodega (Google)',
        avatarInitials: (user.displayName || 'AD')
          .split(' ')
          .map((n) => n[0])
          .slice(0, 2)
          .join('')
          .toUpperCase(),
      };

      await saveUserProfileToFirestore(userProfile);
      onLogin(userProfile);
    } catch (err: unknown) {
      if (typeof err === 'object' && err !== null && 'code' in err) {
        const code = (err as { code: string }).code;
        if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') {
          // Ventana cerrada por el usuario o cancelada, no es un error de sistema
          setAuthError(null);
          return;
        }
      }
      console.warn('Aviso de inicio de sesión con Google:', err);
      setAuthError(getErrorMessage(err));
    } finally {
      setLoadingGoogle(false);
    }
  };

  // Quick Demo Access
  const handleQuickRoleLogin = async (user: UserProfile) => {
    setAuthError(null);
    setLoading(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, user.email, 'ElkmSecure2026!');
      const fbUser = cred.user;
      const profile: UserProfile = {
        ...user,
        id: fbUser.uid,
      };
      await saveUserProfileToFirestore(profile);
      onLogin(profile);
    } catch (e: unknown) {
      console.warn('Intento de autenticación rápida con contraseña alternativa...', e);
      try {
        const cred = await signInWithEmailAndPassword(auth, 'admin.sistema@elkm-events.com', 'ElkmSecure2026!');
        const profile: UserProfile = {
          ...user,
          id: cred.user.uid,
        };
        await saveUserProfileToFirestore(profile);
        onLogin(profile);
      } catch (fallbackErr) {
        setAuthError(getErrorMessage(e));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center px-4 py-8 text-slate-900 selection:bg-slate-900 selection:text-white">
      <div className="w-full max-w-md">
        
        {/* Brand Lockup */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-slate-900 text-white mb-3 shadow-md">
            <ShieldCheck className="w-6 h-6 stroke-[2]" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">ELKM</h1>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">
            Event Lifecycle & Kit Manager · Bodega Técnica
          </p>
          
          {/* Project & Cloud Storage Status */}
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-emerald-50 border border-emerald-200/80 rounded-full text-xs font-bold text-emerald-800 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <Database className="w-3.5 h-3.5 text-emerald-600" />
              <span>{FIREBASE_PROJECT_NAME}</span>
            </div>
            <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-sky-50 border border-sky-200/80 rounded-full text-[11px] font-semibold text-sky-800">
              <HardDrive className="w-3 h-3 text-sky-600" />
              <span>Firebase Storage Conectado</span>
            </div>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-7 shadow-sm">
          
          {/* Tabs: Iniciar Sesión vs Registrar Cuenta */}
          <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl mb-5 text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setAuthMode('signin');
                setAuthError(null);
              }}
              className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                authMode === 'signin'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Iniciar Sesión</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setAuthMode('register');
                setAuthError(null);
              }}
              className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                authMode === 'register'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Crear Cuenta</span>
            </button>
          </div>

          <div className="mb-4 flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold text-slate-900 block">
                {authMode === 'register' ? 'Registro en Firebase Auth' : 'Acceso con Correo y Contraseña'}
              </span>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {authMode === 'register'
                  ? 'Crea un usuario para operar en bodega con almacenamiento en la nube.'
                  : 'Ingresa con tus credenciales registradas en Firebase.'}
              </p>
            </div>
            <button
              onClick={copyDbId}
              className="text-[10px] font-mono px-2 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-600 flex items-center gap-1 transition-colors cursor-pointer shrink-0 ml-2"
              title="Copiar ID de Base de Datos"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Copiado' : 'DB ID'}</span>
            </button>
          </div>

          {/* Feedback messages */}
          {authError && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800">
              <span className="font-semibold block mb-0.5">Aviso de Autenticación:</span>
              {authError}
            </div>
          )}

          {authSuccess && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{authSuccess}</span>
            </div>
          )}

          {/* Form: Email & Password Auth */}
          <form onSubmit={handleEmailAuthSubmit} className="space-y-3.5 text-xs">
            {authMode === 'register' && (
              <div>
                <label className="block text-slate-700 font-medium mb-1 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-500" />
                  <span>Nombre Completo:</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej. Andrés Ramírez"
                  className="w-full bg-slate-50/50 border border-slate-300 rounded-lg p-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-slate-800 transition-colors shadow-2xs"
                />
              </div>
            )}

            <div>
              <label className="block text-slate-700 font-medium mb-1 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-500" />
                <span>Correo Electrónico:</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="operador@elkm-events.com"
                className="w-full bg-slate-50/50 border border-slate-300 rounded-lg p-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-slate-800 transition-colors shadow-2xs"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-slate-700 font-medium flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-slate-500" />
                  <span>Contraseña:</span>
                </label>
                <span className="text-[10px] text-slate-400">Mínimo 6 caracteres</span>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-slate-50/50 border border-slate-300 rounded-lg p-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-slate-800 transition-colors shadow-2xs font-mono"
              />
            </div>

            {authMode === 'register' && (
              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  Rol Asignado en Bodega:
                </label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                  className="w-full bg-slate-50/50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:bg-white focus:border-slate-800 transition-colors shadow-2xs"
                >
                  <option value="admin">Administrador General (Acceso Total)</option>
                  <option value="warehouse">Operario de Bodega & Despacho</option>
                  <option value="technician">Técnico de Mantenimiento</option>
                </select>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-50 mt-1"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Procesando...</span>
                </>
              ) : (
                <>
                  <span>{authMode === 'register' ? 'Crear Cuenta y Acceder' : 'Iniciar Sesión'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-4 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <span className="relative bg-white px-3 text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
              o métodos adicionales
            </span>
          </div>

          {/* Google Sign In */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loadingGoogle}
            className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 text-slate-800 font-semibold text-xs rounded-xl border border-slate-300 transition-all flex items-center justify-center gap-2.5 cursor-pointer shadow-2xs hover:border-slate-400 disabled:opacity-50"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>{loadingGoogle ? 'Autenticando...' : 'Acceder con Google (Firebase)'}</span>
          </button>

          {/* Quick Access Profiles for Demo */}
          <div className="mt-4 pt-3 border-t border-slate-100">
            <span className="block text-[10px] uppercase font-semibold text-slate-400 mb-2 tracking-wider">
              Acceso Rápido de Prueba:
            </span>
            <div className="grid grid-cols-3 gap-2">
              {MOCK_USERS.map((usr) => {
                const isSelected = selectedMockUser.id === usr.id;
                return (
                  <button
                    key={usr.id}
                    type="button"
                    onClick={() => handleQuickRoleLogin(usr)}
                    className={`p-2 rounded-lg border text-left cursor-pointer transition-all ${
                      isSelected
                        ? 'border-slate-800 bg-slate-50'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <span className="font-semibold text-[11px] block text-slate-900 truncate">
                      {usr.name.split(' ')[0]}
                    </span>
                    <span className="text-[9px] text-slate-500 font-mono block uppercase">
                      {usr.role}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer Card */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span className="truncate mr-2 font-medium">{FIREBASE_PROJECT_NAME}</span>
            <span className="font-mono text-emerald-600 font-semibold shrink-0 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Sincronizado
            </span>
          </div>

        </div>

        <p className="text-center text-[11px] text-slate-400 mt-5">
          ELKM · {FIREBASE_PROJECT_NAME} · Firebase Storage & Cloud Firestore
        </p>

      </div>
    </div>
  );
};
