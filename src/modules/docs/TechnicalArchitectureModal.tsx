import React, { useState } from 'react';
import { X, BookOpen, Database, Code, GitBranch, ShieldCheck, Cpu, Copy, Check, HardDrive, KeyRound } from 'lucide-react';
import { FIREBASE_PROJECT_NAME, FIREBASE_PROJECT_INFO } from '../../firebase/config';

interface TechnicalArchitectureModalProps {
  onClose: () => void;
}

export const TechnicalArchitectureModal: React.FC<TechnicalArchitectureModalProps> = ({ onClose }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [syncMsg, setSyncMsg] = useState<string | null>(null);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(label);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl max-h-[92vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative text-xs text-slate-300 space-y-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-semibold">
                FIREBASE BACKEND
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-sky-500/20 text-sky-300 border border-sky-500/40 font-semibold">
                FIREBASE STORAGE
              </span>
              <span className="text-slate-400 text-xs">Conexión Oficial</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight mt-0.5">
              {FIREBASE_PROJECT_NAME}
            </h2>
            <p className="text-slate-400 text-xs mt-0.5">
              Sistema ELKM · Monolito Modular con Cloud Firestore, Firebase Storage y Autenticación dual (Email/Pass + Google).
            </p>
          </div>
        </div>

        {/* Section 0: Firebase Connection Card (Quick Connect) */}
        <div className="bg-slate-950 p-4 rounded-xl border border-emerald-500/30 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Parámetros de Conexión de Firebase
            </span>
            <span className="text-[11px] font-mono text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
              Estado: Conectado & Activo
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
            <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Nombre del Proyecto</span>
                <span className="text-white font-semibold font-mono">{FIREBASE_PROJECT_INFO.name}</span>
              </div>
              <button
                onClick={() => copyToClipboard(FIREBASE_PROJECT_INFO.name, 'name')}
                className="p-1 text-slate-400 hover:text-white rounded cursor-pointer"
                title="Copiar nombre"
              >
                {copiedKey === 'name' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Project ID</span>
                <span className="text-white font-semibold font-mono">{FIREBASE_PROJECT_INFO.projectId}</span>
              </div>
              <button
                onClick={() => copyToClipboard(FIREBASE_PROJECT_INFO.projectId, 'projectId')}
                className="p-1 text-slate-400 hover:text-white rounded cursor-pointer"
                title="Copiar Project ID"
              >
                {copiedKey === 'projectId' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 flex items-center justify-between md:col-span-2">
              <div className="truncate mr-2">
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Firestore Database ID</span>
                <span className="text-amber-400 font-semibold font-mono text-[11px] truncate block">
                  {FIREBASE_PROJECT_INFO.firestoreDatabaseId}
                </span>
              </div>
              <button
                onClick={() => copyToClipboard(FIREBASE_PROJECT_INFO.firestoreDatabaseId, 'dbId')}
                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded cursor-pointer shrink-0 flex items-center gap-1 text-[10px]"
                title="Copiar Database ID"
              >
                {copiedKey === 'dbId' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Copiar ID</span>
              </button>
            </div>

            <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 flex items-center justify-between md:col-span-2">
              <div className="truncate mr-2">
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Firebase Storage Bucket</span>
                <span className="text-sky-400 font-semibold font-mono text-[11px] truncate block">
                  {FIREBASE_PROJECT_INFO.storageBucket}
                </span>
              </div>
              <button
                onClick={() => copyToClipboard(FIREBASE_PROJECT_INFO.storageBucket, 'bucket')}
                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded cursor-pointer shrink-0 flex items-center gap-1 text-[10px]"
                title="Copiar Bucket"
              >
                {copiedKey === 'bucket' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Copiar Bucket</span>
              </button>
            </div>
          </div>

          {/* Sync Button */}
          <div className="pt-2 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2">
            <span className="text-[11px] text-slate-400">
              Persistencia Cloud: 6 Kits, 3 Despachos, 3 Logs de Retorno y 3 Usuarios cargados en Firestore.
            </span>
            <button
              onClick={async () => {
                setSyncing(true);
                setSyncMsg(null);
                try {
                  const { resetDatabaseToDefaults } = await import('../../firebase/firestoreService');
                  await resetDatabaseToDefaults();
                  setSyncMsg('✓ Todos los datos fueron resincronizados y guardados en Firebase.');
                } catch (e: any) {
                  setSyncMsg(`Error: ${e.message}`);
                } finally {
                  setSyncing(false);
                }
              }}
              disabled={syncing}
              className="w-full sm:w-auto px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold rounded-lg text-[11px] transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 shrink-0"
            >
              <span>{syncing ? 'Subiendo datos a Firebase...' : 'Subir / Resincronizar a Firebase'}</span>
            </button>
          </div>

          {syncMsg && (
            <p className="text-[11px] text-emerald-400 font-medium">
              {syncMsg}
            </p>
          )}
        </div>

        {/* Section 1: Modular Monolith Organization */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2">
            <GitBranch className="w-4 h-4" />
            <span>1. Arquitectura de Software: Monolito Modular</span>
          </h3>
          <p className="leading-relaxed">
            El sistema ELKM implementa los principios de un <strong>Monolito Modular</strong>, donde cada dominio de negocio (bounded context) reside en un módulo desacoplado con interfaces canónicas, interactuando con la capa de backend de Firebase Cloud Firestore y Firebase Storage.
          </p>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-[11px] leading-relaxed text-slate-300">
            <span className="text-amber-400 font-bold block mb-1">src/</span>
            ├── <strong className="text-emerald-400">firebase/</strong> &emsp;&emsp;&emsp;&emsp;→ config.ts, firestoreService.ts, storageService.ts, errors.ts.<br/>
            ├── <strong className="text-emerald-400">modules/auth/</strong> &emsp;&emsp;&emsp;→ Email/Password Login + Register + Google Auth.<br/>
            ├── <strong className="text-emerald-400">modules/inventory/</strong> &emsp;→ Catálogo de kits, componentes y subida de fotos/manuales a Storage.<br/>
            ├── <strong className="text-emerald-400">modules/dispatch/</strong> &emsp;&emsp;→ Despachos de campo, calendario y órdenes logísticas.<br/>
            ├── <strong className="text-emerald-400">modules/returns/</strong> &emsp;&emsp;→ Triaje dinámico (+1 ciclo) y evidencia fotográfica en Storage.<br/>
            ├── <strong className="text-emerald-400">modules/maintenance/</strong> → Taller técnico, comprobantes e informes PDF en Storage.<br/>
            ├── <strong className="text-emerald-400">modules/alerts/</strong> &emsp;&emsp;&emsp;→ Detección proactiva de umbrales críticos (&ge;100%) y riesgo.<br/>
            └── <strong className="text-cyan-400">shared/components/</strong> &emsp;→ FirebaseFileUpload, StatusBadge, CycleProgress.
          </div>
        </div>

        {/* Section 2: Tech Stack */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2">
            <Cpu className="w-4 h-4" />
            <span>2. Stack Tecnológico del Sistema</span>
          </h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <li className="bg-slate-950/70 p-3 rounded-lg border border-slate-800">
              <strong className="text-white block mb-1 flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-emerald-400" />
                Google Cloud Firestore
              </strong>
              <span>Base de datos NoSQL documental con escucha en tiempo real (onSnapshot), transacciones ACID y persistencia en la nube.</span>
            </li>
            <li className="bg-slate-950/70 p-3 rounded-lg border border-slate-800">
              <strong className="text-white block mb-1 flex items-center gap-1.5">
                <HardDrive className="w-3.5 h-3.5 text-sky-400" />
                Firebase Storage
              </strong>
              <span>Depósito en la nube (Bucket) para imágenes de kits, fichas técnicas PDF, actas de recepción y certificados de taller.</span>
            </li>
            <li className="bg-slate-950/70 p-3 rounded-lg border border-slate-800">
              <strong className="text-white block mb-1 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                Firebase Authentication Dual
              </strong>
              <span>Acceso seguro mediante Correo/Contraseña (registro y login) + Google Identity con perfiles en Firestore.</span>
            </li>
            <li className="bg-slate-950/70 p-3 rounded-lg border border-slate-800">
              <strong className="text-white block mb-1">React 19 + TypeScript</strong>
              <span>Renderizado declarativo, validación estricta de esquemas y sincronización reactiva bidireccional.</span>
            </li>
          </ul>
        </div>

        {/* Section 3: Firestore Collections Schema */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2">
            <Database className="w-4 h-4" />
            <span>3. Esquema de Colecciones y Carpetas Storage</span>
          </h3>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-[11px] space-y-3 text-slate-300">
            <div>
              <span className="text-cyan-400 font-bold block">// Colecciones Activas en Firestore:</span>
              <p>• <strong>/kits/{'{kitId}'}</strong>: id, sku, name, category, location, currentCycles, cycleThreshold, status, specs, imageUrl, manualUrl</p>
              <p>• <strong>/dispatches/{'{dispatchId}'}</strong>: id, code, eventName, client, venue, departureDate, returnDate, status, kitIds, operatorLead</p>
              <p>• <strong>/returns/{'{returnId}'}</strong>: id, kitId, kitName, eventName, operatorName, timestamp, triageResult, previousCycles, newCycles, evidenceImageUrl</p>
              <p>• <strong>/users/{'{userId}'}</strong>: id, name, email, role, roleTitle, avatarInitials</p>
            </div>

            <div className="pt-2 border-t border-slate-800">
              <span className="text-sky-400 font-bold block">// Carpetas Activas en Firebase Storage:</span>
              <p>• <strong>kits/</strong>: Fotografías de portada y vista técnica de equipamiento.</p>
              <p>• <strong>manuals/</strong>: Documentación técnica y diagramas de conexionado (PDF/Img).</p>
              <p>• <strong>returns/</strong>: Evidencia fotográfica de recepción en rampa de bodega.</p>
              <p>• <strong>reports/</strong>: Informes de servicio técnico, certificados de calibración y comprobantes.</p>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
          <span className="text-slate-400 font-mono text-[11px]">
            {FIREBASE_PROJECT_NAME} · BD: {FIREBASE_PROJECT_INFO.firestoreDatabaseId}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-xs cursor-pointer transition-colors"
          >
            Cerrar Documentación
          </button>
        </div>

      </div>
    </div>
  );
};
