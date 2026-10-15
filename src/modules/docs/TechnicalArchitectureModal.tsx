import React, { useState } from 'react';
import { 
  X, 
  BookOpen, 
  Database, 
  GitBranch, 
  ShieldCheck, 
  Cpu, 
  Copy, 
  Check, 
  HardDrive, 
  KeyRound, 
  FileText, 
  FolderTree, 
  Layers,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import { FIREBASE_PROJECT_NAME, FIREBASE_PROJECT_INFO } from '../../firebase/config';

interface TechnicalArchitectureModalProps {
  onClose: () => void;
}

export const TechnicalArchitectureModal: React.FC<TechnicalArchitectureModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'adr2' | 'adr1'>('overview');
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
          <div className="pr-8">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-semibold">
                FIREBASE BACKEND
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-sky-500/20 text-sky-300 border border-sky-500/40 font-semibold">
                FIREBASE STORAGE
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-500/20 text-purple-300 border border-purple-500/40 font-semibold">
                ADR DOCUMENTATION
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight mt-0.5">
              {FIREBASE_PROJECT_NAME}
            </h2>
            <p className="text-slate-400 text-xs mt-0.5">
              Sistema ELKM · Monolito Modular con Cloud Firestore, Firebase Storage y Registros de Decisiones Arquitectónicas (ADRs).
            </p>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-lg font-medium text-xs flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
              activeTab === 'overview'
                ? 'bg-emerald-600 text-white font-bold'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Ficha Técnica y Conexión</span>
          </button>

          <button
            onClick={() => setActiveTab('adr2')}
            className={`px-3 py-1.5 rounded-lg font-medium text-xs flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
              activeTab === 'adr2'
                ? 'bg-amber-600 text-white font-bold'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
          >
            <FolderTree className="w-3.5 h-3.5 text-amber-300" />
            <span>ADR 002: Estructura Interna</span>
            <span className="px-1.5 py-0.2 rounded text-[9px] bg-amber-400 text-slate-950 font-bold ml-1">Nuevo</span>
          </button>

          <button
            onClick={() => setActiveTab('adr1')}
            className={`px-3 py-1.5 rounded-lg font-medium text-xs flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
              activeTab === 'adr1'
                ? 'bg-indigo-600 text-white font-bold'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>ADR 001: Arquitectura Seleccionada</span>
          </button>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
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
                    } catch (e: unknown) {
                      setSyncMsg(`Error: ${e instanceof Error ? e.message : 'Error al sincronizar'}`);
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
          </div>
        )}

        {/* TAB 2: ADR 002 */}
        {activeTab === 'adr2' && (
          <div className="space-y-5 animate-in fade-in duration-150">
            <div className="bg-slate-950 p-4 rounded-xl border border-amber-500/40">
              <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-slate-800">
                <div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold uppercase">
                    Architectural Decision Record
                  </span>
                  <h3 className="text-base font-bold text-white mt-1">
                    ADR 002: Estructura Interna del Repositorio
                  </h3>
                </div>
                <div className="text-right text-[11px] text-slate-400">
                  <span className="text-emerald-400 font-bold">Estado: Aceptado</span> · 14 de Octubre de 2026
                </div>
              </div>
              <p className="text-slate-400 text-xs mt-2">
                <strong>Autores:</strong> Sebastián Jiménez Mena (202320048) & Samuel David Quintana (202310319) · <strong>Proyecto:</strong> ELKM
              </p>
            </div>

            {/* Resumen de las 3 Decisiones Centrales */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                  <GitBranch className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>1. Monorepo (vs Multirepo)</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Un solo repositorio para cliente, esquemas, reglas BaaS y docs. Elimina sincronización cruzada de PRs y versionado de librerías para 2 desarrolladores.
                </p>
              </div>

              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
                <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs">
                  <Layers className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>2. Por Capas (vs Hexagonal)</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Presentación &rarr; Lógica de Dominio &rarr; Servicios BaaS. Evita la sobreingeniería de puertos y adaptadores abstractos en un stack reactivo con Firebase.
                </p>
              </div>

              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                  <FolderTree className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>3. Funcional (vs Técnico)</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Carpetas agrupadas por Bounded Contexts (<code className="text-slate-300">src/modules/*</code>). Principio de localidad, alta cohesión y paralelismo sin conflictos en Git.
                </p>
              </div>
            </div>

            {/* Alternativas Descartadas */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                Alternativas Descartadas y Razones del Rechazo
              </h4>
              <div className="space-y-2">
                <div className="p-3 bg-slate-950/90 rounded-lg border border-slate-800 text-[11px] space-y-1">
                  <strong className="text-slate-200">❌ Multirepo (Repositorios Múltiples):</strong>
                  <p className="text-slate-400">
                    Descartado por la alta fricción operativa para un equipo de 2 personas. Gestionar dependencias entre repos, publicar paquetes privados y coordinar múltiples pipelines de CI/CD retrasaría el desarrollo del MVP sin reportar beneficio de infraestructura.
                  </p>
                </div>

                <div className="p-3 bg-slate-950/90 rounded-lg border border-slate-800 text-[11px] space-y-1">
                  <strong className="text-slate-200">❌ Arquitectura Hexagonal (Ports & Adapters / Clean Architecture estricta):</strong>
                  <p className="text-slate-400">
                    Descartada por sobreingeniería severa. En un frontend con Firebase BaaS, aislar puertos abstractos de entrada/salida y use-cases individuales quintuplicaría el número de archivos sin necesidad, dificultando el uso de listeners en tiempo real (<code className="text-amber-300">onSnapshot</code>) y asumiendo una hipotética sustitución de base de datos que está fuera de alcance.
                  </p>
                </div>

                <div className="p-3 bg-slate-950/90 rounded-lg border border-slate-800 text-[11px] space-y-1">
                  <strong className="text-slate-200">❌ Organización Técnica por Tipo de Archivo (components/, views/, services/):</strong>
                  <p className="text-slate-400">
                    Descartada por provocar baja cohesión y alta dispersión. Modificar una funcionalidad obligaría a abrir 5 carpetas distintas, facilitando el código espagueti y provocando cuellos de botella y conflictos de merge constantes entre los dos desarrolladores.
                  </p>
                </div>
              </div>
            </div>

            {/* Buenas Prácticas Adoptadas */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Buenas Prácticas Implementadas en el Proyecto
              </h4>
              <ul className="list-disc pl-5 space-y-1 text-[11px] text-slate-300">
                <li><strong>Commits semánticos y atómicos:</strong> Cada cambio modifica coordinadamente tipos, reglas y componentes dentro de un único commit verificable.</li>
                <li><strong>Encapsulación estricta en servicios:</strong> Los componentes visuales nunca invocan directamente el SDK de Firebase; pasan por <code className="text-emerald-300">firestoreService.ts</code> y <code className="text-sky-300">storageService.ts</code>.</li>
                <li><strong>Contratos canónicos centralizados:</strong> <code className="text-amber-300">src/types/elkm.ts</code> define las interfaces únicas del dominio, prohibiendo el uso de <code className="text-slate-400">any</code>.</li>
                <li><strong>Sanitización previa al guardado:</strong> <code className="text-cyan-300">sanitizePayload</code> previene guardar valores <code className="text-slate-400">undefined</code> que rechazaría Firestore.</li>
                <li><strong>Fronteras modulares autónomas:</strong> Prohibido importar elementos privados entre módulos funcionales hermanos; se promueven componentes a <code className="text-purple-300">src/shared/components/</code>.</li>
              </ul>
            </div>

            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between text-[11px]">
              <span className="text-slate-400">
                Documento Markdown completo disponible en: <code className="text-amber-300">docs/adr-002-estructura-interna-del-repositorio.md</code>
              </span>
              <button
                onClick={() => copyToClipboard('docs/adr-002-estructura-interna-del-repositorio.md', 'adr2path')}
                className="p-1 text-slate-400 hover:text-white rounded cursor-pointer"
                title="Copiar ruta"
              >
                {copiedKey === 'adr2path' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: ADR 001 */}
        {activeTab === 'adr1' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="bg-slate-950 p-4 rounded-xl border border-indigo-500/40">
              <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-slate-800">
                <div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-bold uppercase">
                    Architectural Decision Record
                  </span>
                  <h3 className="text-base font-bold text-white mt-1">
                    ADR 001: Arquitectura Seleccionada para el Proyecto ELKM
                  </h3>
                </div>
                <div className="text-right text-[11px] text-slate-400">
                  <span className="text-emerald-400 font-bold">Estado: Aceptado</span> · 11 de Octubre de 2026
                </div>
              </div>
              <p className="text-slate-400 text-xs mt-2">
                <strong>Autores:</strong> Sebastián Jiménez Mena (202320048) & Samuel David Quintana (202310319) · <strong>Proyecto:</strong> ELKM
              </p>
            </div>

            <div className="space-y-3 text-[11px] text-slate-300 leading-relaxed bg-slate-950 p-4 rounded-xl border border-slate-800">
              <h4 className="text-xs font-bold text-amber-400">Decisiones Principales de ADR 001:</h4>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-400">
                <li><strong className="text-white">Arquitectura: Monolito Modular</strong> en React 19 + TypeScript + Vite, estructurado en módulos de dominio desacoplados.</li>
                <li><strong className="text-white">BaaS y Persistencia: Google Cloud Firestore + Firebase Storage + Auth</strong> para reactividad en tiempo real y trazabilidad sin mantenimiento de servidores.</li>
                <li><strong className="text-white">Desarrollo Acelerado con Google IA</strong> como copiloto para optimizar tiempos de scaffolding y prototipado rápido hacia producción.</li>
                <li><strong className="text-white">Mitigación de Riesgos de "Vibe Coding":</strong> Verificación humana rigurosa, tipado estricto con TypeScript, compilación continua y auditoría de reglas de seguridad.</li>
              </ul>
            </div>

            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between text-[11px]">
              <span className="text-slate-400">
                Documento Markdown original disponible en: <code className="text-indigo-300">docs/adr-001-arquitectura-seleccionada.md</code>
              </span>
              <button
                onClick={() => copyToClipboard('docs/adr-001-arquitectura-seleccionada.md', 'adr1path')}
                className="p-1 text-slate-400 hover:text-white rounded cursor-pointer"
                title="Copiar ruta"
              >
                {copiedKey === 'adr1path' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        )}

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
