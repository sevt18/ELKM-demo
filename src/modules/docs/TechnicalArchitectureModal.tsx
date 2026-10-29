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
  CheckCircle2,
  Network,
  Share2,
  ExternalLink,
  Download,
  Maximize2,
  Image as ImageIcon
} from 'lucide-react';
import { FIREBASE_PROJECT_NAME, FIREBASE_PROJECT_INFO } from '../../firebase/config';

interface TechnicalArchitectureModalProps {
  onClose: () => void;
}

export const TechnicalArchitectureModal: React.FC<TechnicalArchitectureModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'diagram' | 'adr3' | 'adr2' | 'adr1'>('overview');
  const [diagramView, setDiagramView] = useState<'c4' | 'lifecycle'>('c4');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [syncMsg, setSyncMsg] = useState<string | null>(null);
  const [isImageExpanded, setIsImageExpanded] = useState(false);

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
                DIAGRAMAS & ADRs
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight mt-0.5">
              {FIREBASE_PROJECT_NAME}
            </h2>
            <p className="text-slate-400 text-xs mt-0.5">
              Sistema ELKM · Monolito Modular con Cloud Firestore, Firebase Storage y Diagramas de Arquitectura C4/Mermaid.
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
            onClick={() => setActiveTab('diagram')}
            className={`px-3 py-1.5 rounded-lg font-medium text-xs flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
              activeTab === 'diagram'
                ? 'bg-cyan-600 text-white font-bold'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
          >
            <Network className="w-3.5 h-3.5 text-cyan-300" />
            <span>Diagrama de Arquitectura</span>
            <span className="px-1.5 py-0.2 rounded text-[9px] bg-cyan-400 text-slate-950 font-bold ml-1">Ver</span>
          </button>

          <button
            onClick={() => setActiveTab('adr3')}
            className={`px-3 py-1.5 rounded-lg font-medium text-xs flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
              activeTab === 'adr3'
                ? 'bg-rose-600 text-white font-bold'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
          >
            <Share2 className="w-3.5 h-3.5 text-rose-300" />
            <span>ADR 003: Comunicación & Swagger</span>
            <span className="px-1.5 py-0.2 rounded text-[9px] bg-rose-400 text-slate-950 font-bold ml-1">Nuevo</span>
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
            <span>ADR 001: Arquitectura</span>
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

        {/* TAB 1.5: DIAGRAMA DE ARQUITECTURA (INTERNO) */}
        {activeTab === 'diagram' && (
          <div className="space-y-5 animate-in fade-in duration-150">
            {/* Header Card */}
            <div className="bg-slate-950 p-4 rounded-xl border border-cyan-500/40">
              <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-slate-800">
                <div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold uppercase">
                    Visualizador de Arquitectura Nativo
                  </span>
                  <h3 className="text-base font-bold text-white mt-1">
                    Diagrama del Sistema & Ciclo Operativo ELKM
                  </h3>
                </div>
                <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-lg border border-slate-800">
                  <button
                    onClick={() => setDiagramView('c4')}
                    className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors cursor-pointer ${
                      diagramView === 'c4'
                        ? 'bg-cyan-600 text-white shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    1. Arquitectura por Capas (C4)
                  </button>
                  <button
                    onClick={() => setDiagramView('lifecycle')}
                    className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors cursor-pointer ${
                      diagramView === 'lifecycle'
                        ? 'bg-cyan-600 text-white shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    2. Ciclo de Vida del Kit
                  </button>
                </div>
              </div>

              <p className="text-slate-400 text-xs mt-2">
                {diagramView === 'c4'
                  ? 'Representación visual de la arquitectura técnica: Monolito Modular en React 19, capa de contratos, servicios desacoplados y persistencia en Google Cloud Firebase.'
                  : 'Diagrama de máquina de estados y reglas operativas del inventario: desde el alta con validación estricta, salidas a eventos, triaje dinámico (+1 ciclo) y mantenimiento preventivo.'}
              </p>
            </div>

            {/* VISTA 1: ARQUITECTURA C4 Y CAPAS DEL SISTEMA */}
            {diagramView === 'c4' && (
              <div className="space-y-4">
                {/* Visual Architecture Diagram Image */}
                <div className="bg-slate-950 p-4 rounded-xl border border-cyan-500/50 space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-cyan-400" />
                      Diagrama de Arquitectura de Software ELKM (Imagen Oficial)
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setIsImageExpanded(true)}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-[11px] font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                        title="Ver en pantalla completa"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                        <span>Ampliar</span>
                      </button>
                      <a
                        href="/architecture_diagram.jpg"
                        download="ELKM_Diagrama_Arquitectura.jpg"
                        className="px-2.5 py-1 bg-cyan-600 hover:bg-cyan-500 text-slate-950 rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                        title="Descargar diagrama en alta resolución"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Descargar JPG</span>
                      </a>
                    </div>
                  </div>

                  <div 
                    onClick={() => setIsImageExpanded(true)}
                    className="relative rounded-lg overflow-hidden border border-slate-800 bg-slate-900 group cursor-pointer shadow-lg"
                  >
                    <img
                      src="/architecture_diagram.jpg"
                      alt="Diagrama de Arquitectura de Software ELKM"
                      className="w-full h-auto object-contain rounded-lg transition-transform duration-200 group-hover:scale-[1.01]"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white text-xs font-semibold backdrop-blur-2xs">
                      <Maximize2 className="w-5 h-5 text-cyan-400" />
                      <span>Haz clic para ampliar en pantalla completa</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-400 text-center">
                    Esquema técnico oficial: Modelo de 3 Tiers (Actores, Frontend Monolito Modular en React 19, Google Cloud Firebase BaaS).
                  </p>
                </div>
                {/* Layer 1: Actors */}
                <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                      <span>👥</span> Capa 1: Usuarios y Roles Operativos (Navegador Web / HTTPS)
                    </span>
                    <span className="text-[10px] font-mono text-slate-500 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                      Control de Acceso ABAC / RBAC
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                    <div className="p-2.5 bg-slate-900/90 rounded-lg border border-slate-800">
                      <strong className="text-white block font-semibold mb-0.5">👤 Administrador General</strong>
                      <span className="text-slate-400">Control total del catálogo, bajas de activo, parámetros y auditoría técnica.</span>
                    </div>
                    <div className="p-2.5 bg-slate-900/90 rounded-lg border border-slate-800">
                      <strong className="text-white block font-semibold mb-0.5">📦 Operario de Bodega</strong>
                      <span className="text-slate-400">Despachos logísticos a eventos y triaje en rampa (+1 ciclo acumulativo).</span>
                    </div>
                    <div className="p-2.5 bg-slate-900/90 rounded-lg border border-slate-800">
                      <strong className="text-white block font-semibold mb-0.5">🔧 Técnico de Taller</strong>
                      <span className="text-slate-400">Mantenimiento preventivo, calibración, actas técnicas y reinicio de ciclos.</span>
                    </div>
                  </div>
                </div>

                {/* Visual Arrow */}
                <div className="flex items-center justify-center gap-2 text-slate-500 text-[11px] font-mono">
                  <span>↓</span>
                  <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800 text-slate-400">
                    Tráfico Seguro HTTPS · Interfaz React 19 SPA
                  </span>
                  <span>↓</span>
                </div>

                {/* Layer 2: Frontend Monolito Modular */}
                <div className="p-3.5 bg-slate-950 rounded-xl border border-cyan-500/40 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                      <FolderTree className="w-4 h-4 text-cyan-400" />
                      Capa 2: Frontend Monolito Modular (src/modules/*)
                    </span>
                    <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800">
                      Vite + TypeScript + Tailwind CSS
                    </span>
                  </div>

                  {/* Bounded Contexts Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px]">
                    <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                      <strong className="text-emerald-400 block mb-0.5">modules/auth</strong>
                      <span className="text-slate-400 text-[10px]">Autenticación dual (Email/Pass + Google) y perfiles en Firestore.</span>
                    </div>
                    <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                      <strong className="text-emerald-400 block mb-0.5">modules/inventory</strong>
                      <span className="text-slate-400 text-[10px]">Catálogo de kits, validación estricta de campos y fotos en Storage.</span>
                    </div>
                    <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                      <strong className="text-emerald-400 block mb-0.5">modules/dispatch</strong>
                      <span className="text-slate-400 text-[10px]">Programación de eventos de campo y calendario logístico.</span>
                    </div>
                    <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                      <strong className="text-emerald-400 block mb-0.5">modules/returns</strong>
                      <span className="text-slate-400 text-[10px]">Rampa de recepción, triaje dinámico (+1 ciclo) y fotos de evidencia.</span>
                    </div>
                    <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                      <strong className="text-emerald-400 block mb-0.5">modules/maintenance</strong>
                      <span className="text-slate-400 text-[10px]">Taller de servicio técnico, certificados PDF y reinicio de ciclos a cero.</span>
                    </div>
                    <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                      <strong className="text-emerald-400 block mb-0.5">modules/alerts</strong>
                      <span className="text-slate-400 text-[10px]">Monitoreo de umbrales preventivos (&ge;100%) y riesgo operativo.</span>
                    </div>
                  </div>

                  {/* Shared Sub-layer */}
                  <div className="pt-2 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-300">
                    <span className="flex items-center gap-1.5">
                      <span className="text-amber-400 font-bold">Contratos Canónicos:</span>
                      <code className="text-slate-400 font-mono">src/types/elkm.ts</code> (Kit, DispatchEvent, ReturnLog, UserProfile)
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="text-sky-400 font-bold">Componente Compartido:</span>
                      <code className="text-slate-400 font-mono">FirebaseFileUpload.tsx</code>
                    </span>
                  </div>
                </div>

                {/* Visual Arrow */}
                <div className="flex items-center justify-center gap-2 text-slate-500 text-[11px] font-mono">
                  <span>↓</span>
                  <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800 text-slate-400">
                    Llamadas Asíncronas Tipadas · Inyección de Dependencias
                  </span>
                  <span>↓</span>
                </div>

                {/* Layer 3: BaaS Services */}
                <div className="p-3.5 bg-slate-950 rounded-xl border border-indigo-500/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-400 flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-indigo-400" />
                      Capa 3: Servicios BaaS Desacoplados (src/firebase/)
                    </span>
                    <span className="text-[10px] font-mono text-indigo-300 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-800">
                      Firebase Web SDK v11
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                    <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                      <strong className="text-white block font-semibold mb-0.5">📡 firestoreService.ts</strong>
                      <span className="text-slate-400">CRUD tipado, listeners reactivos en tiempo real (<code>onSnapshot</code>) y transacciones.</span>
                    </div>
                    <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                      <strong className="text-white block font-semibold mb-0.5">💾 storageService.ts</strong>
                      <span className="text-slate-400">Subida asíncrona de archivos, seguimiento de progreso (0-100%), sanitización y límite de 25MB.</span>
                    </div>
                    <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                      <strong className="text-white block font-semibold mb-0.5">🛡️ errors.ts</strong>
                      <span className="text-slate-400">Manejo centralizado de excepciones de Firebase y mensajes amigables al operador.</span>
                    </div>
                  </div>
                </div>

                {/* Visual Arrow */}
                <div className="flex items-center justify-center gap-2 text-slate-500 text-[11px] font-mono">
                  <span>↕</span>
                  <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800 text-slate-400">
                    Conexión WebSocket Sincronizada · TLS 1.3 / Encriptación en Reposo
                  </span>
                  <span>↕</span>
                </div>

                {/* Layer 4: Google Cloud Firebase */}
                <div className="p-3.5 bg-slate-950 rounded-xl border border-emerald-500/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                      <Database className="w-4 h-4 text-emerald-400" />
                      Capa 4: Backend-as-a-Service en Google Cloud Firebase
                    </span>
                    <span className="text-[10px] font-mono text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                      Project ID: true-framing-gn2tx
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                    <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 space-y-1">
                      <strong className="text-amber-300 block font-semibold">Cloud Firestore</strong>
                      <span className="text-slate-400 block font-mono text-[10px] truncate">
                        ID: {FIREBASE_PROJECT_INFO.firestoreDatabaseId}
                      </span>
                      <p className="text-slate-400 text-[10px]">
                        Colecciones activas: <code>/kits</code>, <code>/dispatches</code>, <code>/returns</code>, <code>/users</code>. Reglas de seguridad ABAC en <code>firestore.rules</code>.
                      </p>
                    </div>

                    <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 space-y-1">
                      <strong className="text-sky-300 block font-semibold">Firebase Storage</strong>
                      <span className="text-slate-400 block font-mono text-[10px] truncate">
                        Bucket: {FIREBASE_PROJECT_INFO.storageBucket}
                      </span>
                      <p className="text-slate-400 text-[10px]">
                        Directorios en la nube: <code>kits/</code> (portadas), <code>manuals/</code> (PDFs), <code>returns/</code> (evidencias), <code>reports/</code> (certificados).
                      </p>
                    </div>

                    <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 space-y-1">
                      <strong className="text-purple-300 block font-semibold">Firebase Authentication</strong>
                      <span className="text-slate-400 block font-mono text-[10px]">
                        Método Dual: Email & Pass + Google
                      </span>
                      <p className="text-slate-400 text-[10px]">
                        Emisión de tokens JWT de sesión segura y sincronización de perfil con roles de bodega en Firestore.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* VISTA 2: CICLO DE VIDA Y REGLAS DE NEGOCIO DEL KIT */}
            {diagramView === 'lifecycle' && (
              <div className="space-y-3">
                <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                    Flujo Operativo y Máquina de Estados del Kit en Bodega
                  </span>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    Trazabilidad automatizada de los kits a través de 6 fases operativas, controlando la acumulación de fatiga física mediante ciclos de evento y triaje dinámico.
                  </p>
                </div>

                {/* Workflow Steps in Cards */}
                <div className="space-y-2.5 text-[11px]">
                  
                  {/* Step 1 */}
                  <div className="p-3 bg-slate-950 rounded-xl border border-emerald-500/30 flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      1
                    </span>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <strong className="text-white text-xs">Alta Inicial & Validación Estricta</strong>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                          Estado: DISPONIBLE
                        </span>
                      </div>
                      <p className="text-slate-400">
                        Se ingresa el kit completando obligatoriamente todos los campos (nombre, categoría, SKU único, ubicación en bodega, umbral de ciclos, especificaciones técnicas, foto en Storage y componentes). Inicia con <strong>0 ciclos operativos</strong>.
                      </p>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="p-3 bg-slate-950 rounded-xl border border-sky-500/30 flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-sky-500/20 text-sky-400 border border-sky-500/40 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      2
                    </span>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <strong className="text-white text-xs">Orden de Despacho Logístico a Evento</strong>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-950 text-sky-300 border border-sky-800">
                          Estado: EN_EVENTO
                        </span>
                      </div>
                      <p className="text-slate-400">
                        El operario crea una orden de despacho asignando el kit a un evento, cliente y recinto. El kit cambia de estado para evitar dobles reservas.
                      </p>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="p-3 bg-slate-950 rounded-xl border border-amber-500/30 flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      3
                    </span>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <strong className="text-white text-xs">Retorno en Rampa & Triaje Dinámico (+1 Ciclo)</strong>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-800">
                          Regla: +1 Ciclo Obligatorio
                        </span>
                      </div>
                      <p className="text-slate-400">
                        Al llegar de vuelta a bodega, el operario inspecciona el kit y sube foto de evidencia a Storage. El motor suma automáticamente <strong>+1 ciclo de fatiga operativa</strong> y aplica la regla de triaje:
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-[10px]">
                        <div className="p-2 bg-slate-900 rounded border border-emerald-900/60 text-emerald-300">
                          <strong>• Óptimo:</strong> Sin daños visibles. Continúa a evaluación de umbral de ciclos.
                        </div>
                        <div className="p-2 bg-slate-900 rounded border border-amber-900/60 text-amber-300">
                          <strong>• Calibración:</strong> Desajuste leve. Se envía directamente a <code>mantenimiento</code>.
                        </div>
                        <div className="p-2 bg-slate-900 rounded border border-rose-900/60 text-rose-300">
                          <strong>• Crítico:</strong> Daño grave o componente faltante. Pasa a <code>bloqueado</code>.
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Step 4 */}
                  <div className="p-3 bg-slate-950 rounded-xl border border-rose-500/30 flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/40 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      4
                    </span>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <strong className="text-white text-xs">Evaluación Automatizada de Umbral de Ciclos</strong>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-950 text-rose-300 border border-rose-800">
                          Semáforo de Tolerancia
                        </span>
                      </div>
                      <p className="text-slate-400">
                        Si los ciclos acumulados alcanzan o superan el umbral límite (&ge;100% de tolerancia), el sistema dispara de forma autónoma una <strong>Alerta Preventiva Crítica</strong> y cambia el estado del kit a <code>mantenimiento</code>, impidiendo nuevos despachos.
                      </p>
                    </div>
                  </div>

                  {/* Step 5 */}
                  <div className="p-3 bg-slate-950 rounded-xl border border-indigo-500/30 flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/40 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      5
                    </span>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <strong className="text-white text-xs">Servicio Técnico en Taller & Reinicio de Ciclos</strong>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-950 text-indigo-300 border border-indigo-800">
                          Estado: MANTENIMIENTO &rarr; DISPONIBLE
                        </span>
                      </div>
                      <p className="text-slate-400">
                        El técnico realiza el mantenimiento (preventivo, correctivo o calibración), adjunta el acta técnica en PDF a Storage, y el sistema <strong>reinicia el contador de ciclos a 0</strong>, retornando el kit al inventario activo en estado <code>disponible</code>.
                      </p>
                    </div>
                  </div>

                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB: ADR 003 - ESTRATEGIA DE COMUNICACIÓN & SWAGGER */}
        {activeTab === 'adr3' && (
          <div className="space-y-5 animate-in fade-in duration-150">
            {/* Header Card */}
            <div className="bg-slate-950 p-4 rounded-xl border border-rose-500/40">
              <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold uppercase">
                      Architectural Decision Record
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold uppercase">
                      OpenAPI 3.0 / Swagger
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white mt-1">
                    ADR 003: Estrategia de Comunicación
                  </h3>
                </div>
                <div className="text-right text-[11px] text-slate-400">
                  <span className="text-emerald-400 font-bold">Estado: Aceptado</span> · 28 de Octubre de 2026
                </div>
              </div>
              <p className="text-slate-400 text-xs mt-2">
                <strong>Autores:</strong> Sebastián Jiménez Mena (202320048) & Samuel David Quintana (202310319) · <strong>Proyecto:</strong> ELKM - Event Lifecycle & Kit Manager
              </p>
            </div>

            {/* Las 3 Decisiones Fundamentales */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="bg-slate-950 p-3.5 rounded-xl border border-rose-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-rose-400 font-bold text-xs flex items-center gap-1.5">
                    <Share2 className="w-4 h-4 text-rose-400" />
                    1. Paradigma de Comunicación
                  </span>
                  <span className="px-1.5 py-0.2 rounded text-[9px] bg-rose-950 text-rose-300 border border-rose-800 font-bold">
                    Híbrido
                  </span>
                </div>
                <h4 className="text-white font-semibold text-xs">Síncrono (REST) + Asíncrono (Eventos)</h4>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  <strong>Síncrono (HTTPS):</strong> Transacciones atómicas de alta, despacho, triaje y mantenimiento con respuesta inmediata.
                  <br />
                  <strong>Asíncrono (Observer):</strong> Listeners reactivos en tiempo real (<code className="text-rose-300">onSnapshot</code>) y carga de fotos/actas técnicas en background.
                </p>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-cyan-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-cyan-400 font-bold text-xs flex items-center gap-1.5">
                    <Network className="w-4 h-4 text-cyan-400" />
                    2. Tecnología Seleccionada
                  </span>
                  <span className="px-1.5 py-0.2 rounded text-[9px] bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold">
                    REST / JSON
                  </span>
                </div>
                <h4 className="text-white font-semibold text-xs">REST sobre HTTP/1.1 & HTTP/2</h4>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Adoptado por su <strong>extrema simplicidad, ubicuidad en navegadores y baja complejidad cognitiva</strong> para el equipo de 2 personas. Cero tooling intermedio, payloads JSON nativos y depuración transparente en DevTools.
                </p>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-emerald-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-emerald-400 font-bold text-xs flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-emerald-400" />
                    3. Contrato de Servicios
                  </span>
                  <span className="px-1.5 py-0.2 rounded text-[9px] bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
                    Swagger + TS
                  </span>
                </div>
                <h4 className="text-white font-semibold text-xs">OpenAPI 3.0 + Tipado Canónico</h4>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  <strong>El contrato más básico y plausible:</strong> Sin necesidad de compiladores binarios (<code className="text-emerald-300">protoc</code>). Sincronizado 1:1 con las interfaces TypeScript de <code className="text-emerald-300">src/types/elkm.ts</code>.
                </p>
              </div>
            </div>

            {/* Alternativas Descartadas */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-white flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                Alternativas Descartadas y Justificación Técnica (Sesión 11 IUSH)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
                <div className="p-3 bg-slate-900 rounded-lg border border-red-500/30 space-y-1">
                  <div className="flex items-center justify-between">
                    <strong className="text-red-400 font-semibold">SOAP (WSDL / XML)</strong>
                    <span className="px-1.5 py-0.2 rounded text-[9px] bg-red-950 text-red-300 font-bold">Descartado</span>
                  </div>
                  <p className="text-slate-400 text-[10.5px]">
                    <strong>Sobrecarga Masiva & Penalización FinOps:</strong> Payloads XML con sobres SOAP entre un 300% y 500% más pesados que JSON. Alto costo de procesamiento CPU y obsolescencia en aplicaciones web modernas.
                  </p>
                </div>

                <div className="p-3 bg-slate-900 rounded-lg border border-red-500/30 space-y-1">
                  <div className="flex items-center justify-between">
                    <strong className="text-red-400 font-semibold">gRPC (.proto / Protobuf)</strong>
                    <span className="px-1.5 py-0.2 rounded text-[9px] bg-red-950 text-red-300 font-bold">Descartado</span>
                  </div>
                  <p className="text-slate-400 text-[10.5px]">
                    <strong>Incompatibilidad Nativa con Navegadores:</strong> Requiere desplegar proxies intermedios (Envoy o gRPC-Web), agregando infraestructura innecesaria, costos mensuales fijos y complejidad con compiladores binarios.
                  </p>
                </div>

                <div className="p-3 bg-slate-900 rounded-lg border border-red-500/30 space-y-1">
                  <div className="flex items-center justify-between">
                    <strong className="text-red-400 font-semibold">GraphQL (Schema Definition - SDL)</strong>
                    <span className="px-1.5 py-0.2 rounded text-[9px] bg-red-950 text-red-300 font-bold">Descartado</span>
                  </div>
                  <p className="text-slate-400 text-[10.5px]">
                    <strong>Sobrecarga de Servidor Intermedio (Caso Prime Video):</strong> Requiere costear un servidor gateway dedicado (Apollo), agregando saltos de red, latencia y perdiendo el caché HTTP nativo del navegador.
                  </p>
                </div>

                <div className="p-3 bg-slate-900 rounded-lg border border-red-500/30 space-y-1">
                  <div className="flex items-center justify-between">
                    <strong className="text-red-400 font-semibold">Webhooks como Canal Primario</strong>
                    <span className="px-1.5 py-0.2 rounded text-[9px] bg-red-950 text-red-300 font-bold">Descartado</span>
                  </div>
                  <p className="text-slate-400 text-[10.5px]">
                    <strong>Inviabilidad en Clientes Web:</strong> Los navegadores en rampas de bodega están tras redes corporativas o NAT y no poseen IPs públicas estáticas para recibir peticiones push entrantes.
                  </p>
                </div>
              </div>
            </div>

            {/* Buenas Prácticas FinOps & Green Software */}
            <div className="bg-slate-950 p-4 rounded-xl border border-emerald-500/30 space-y-2">
              <h4 className="text-xs font-bold text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Buenas Prácticas Adoptadas (Green Software, FinOps & Calidad de Código)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 text-[10.5px]">
                <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                  <span className="text-white font-bold block mb-1">Principio KISS & YAGNI</span>
                  <p className="text-slate-400">Solución directa y libre de abstracciones innecesarias, adaptada a la velocidad de entrega del equipo.</p>
                </div>
                <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                  <span className="text-white font-bold block mb-1">Códigos HTTP Semánticos</span>
                  <p className="text-slate-400">200 OK, 201 Created, 400 Bad Request, 401 Unauthorized, 404 Not Found, 409 Conflict, 500 Error.</p>
                </div>
                <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                  <span className="text-white font-bold block mb-1">Tipado Estricto End-to-End</span>
                  <p className="text-slate-400">Zero uso de <code>any</code>. Interfaces canónicas validadas estáticamente en tiempo de compilación.</p>
                </div>
                <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                  <span className="text-white font-bold block mb-1">FinOps: -85% de Tráfico</span>
                  <p className="text-slate-400">Suscripciones reactivas por eventos evitan el sondeo continuo (polling), reduciendo facturación y energía.</p>
                </div>
              </div>
            </div>

            {/* Visor de Endpoints OpenAPI / Swagger */}
            <div className="bg-slate-950 p-4 rounded-xl border border-indigo-500/30 space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-400" />
                  <span className="text-xs font-bold text-white">
                    Catálogo de Endpoints de la API REST (Registrado en docs/swagger.json)
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-indigo-950 text-indigo-300 border border-indigo-800">
                  11 Endpoints Oficiales
                </span>
              </div>

              <div className="space-y-2 text-[11px]">
                {/* Endpoint 1 */}
                <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800">GET</span>
                    <code className="text-white font-semibold">/kits</code>
                    <span className="text-slate-400 text-[10.5px] hidden sm:inline">— Listar catálogo de inventario técnico y ciclos</span>
                  </div>
                  <span className="text-slate-500 text-[10px] font-mono">200 OK</span>
                </div>

                {/* Endpoint 2 */}
                <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-sky-950 text-sky-400 border border-sky-800">POST</span>
                    <code className="text-white font-semibold">/kits</code>
                    <span className="text-slate-400 text-[10.5px] hidden sm:inline">— Registrar kit con validación obligatoria de todos los campos</span>
                  </div>
                  <span className="text-slate-500 text-[10px] font-mono">201 Created / 400 Bad Request</span>
                </div>

                {/* Endpoint 3 */}
                <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800">GET</span>
                    <code className="text-white font-semibold">/kits/{`{id}`}</code>
                    <span className="text-slate-400 text-[10.5px] hidden sm:inline">— Consultar ficha técnica y ciclos de vida de un kit</span>
                  </div>
                  <span className="text-slate-500 text-[10px] font-mono">200 OK / 404 Not Found</span>
                </div>

                {/* Endpoint 4 */}
                <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-amber-950 text-amber-400 border border-amber-800">PUT</span>
                    <code className="text-white font-semibold">/kits/{`{id}`}</code>
                    <span className="text-slate-400 text-[10.5px] hidden sm:inline">— Actualizar ubicación en bodega o notas técnicas</span>
                  </div>
                  <span className="text-slate-500 text-[10px] font-mono">200 OK</span>
                </div>

                {/* Endpoint 5 */}
                <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-rose-950 text-rose-400 border border-rose-800">DELETE</span>
                    <code className="text-white font-semibold">/kits/{`{id}`}</code>
                    <span className="text-slate-400 text-[10.5px] hidden sm:inline">— Dar de baja kit del inventario activo</span>
                  </div>
                  <span className="text-slate-500 text-[10px] font-mono">200 OK</span>
                </div>

                {/* Endpoint 6 */}
                <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-sky-950 text-sky-400 border border-sky-800">POST</span>
                    <code className="text-white font-semibold">/dispatches</code>
                    <span className="text-slate-400 text-[10.5px] hidden sm:inline">— Emitir orden de despacho y cambiar estado a 'despachado'</span>
                  </div>
                  <span className="text-slate-500 text-[10px] font-mono">201 Created / 409 Conflict</span>
                </div>

                {/* Endpoint 7 */}
                <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-sky-950 text-sky-400 border border-sky-800">POST</span>
                    <code className="text-white font-semibold">/returns</code>
                    <span className="text-slate-400 text-[10.5px] hidden sm:inline">— Triaje en rampa, acumulación atómica +1 ciclo y evaluación de umbral</span>
                  </div>
                  <span className="text-slate-500 text-[10px] font-mono">201 Created</span>
                </div>

                {/* Endpoint 8 */}
                <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-sky-950 text-sky-400 border border-sky-800">POST</span>
                    <code className="text-white font-semibold">/maintenance</code>
                    <span className="text-slate-400 text-[10.5px] hidden sm:inline">— Emitir orden de servicio técnico para kits con ciclos cumplidos</span>
                  </div>
                  <span className="text-slate-500 text-[10px] font-mono">201 Created</span>
                </div>

                {/* Endpoint 9 */}
                <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-amber-950 text-amber-400 border border-amber-800">PUT</span>
                    <code className="text-white font-semibold">/maintenance/{`{id}`}/complete</code>
                    <span className="text-slate-400 text-[10.5px] hidden sm:inline">— Completar mantenimiento, adjuntar acta y reiniciar ciclos a 0</span>
                  </div>
                  <span className="text-slate-500 text-[10px] font-mono">200 OK</span>
                </div>

                {/* Endpoint 10 */}
                <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-sky-950 text-sky-400 border border-sky-800">POST</span>
                    <code className="text-white font-semibold">/auth/login</code>
                    <span className="text-slate-400 text-[10.5px] hidden sm:inline">— Autenticar credenciales y obtener perfil con rol operativo</span>
                  </div>
                  <span className="text-slate-500 text-[10px] font-mono">200 OK / 401 Unauthorized</span>
                </div>
              </div>
            </div>

            {/* Accesos a Archivos Físicos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Documento ADR 003 Completo</span>
                  <code className="text-rose-300 font-semibold">docs/adr-003-estrategia-de-comunicacion.md</code>
                </div>
                <button
                  onClick={() => copyToClipboard('docs/adr-003-estrategia-de-comunicacion.md', 'adr3path')}
                  className="p-1.5 text-slate-400 hover:text-white rounded cursor-pointer hover:bg-slate-800 transition-colors"
                  title="Copiar ruta"
                >
                  {copiedKey === 'adr3path' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Especificación OpenAPI / Swagger</span>
                  <code className="text-emerald-300 font-semibold">docs/swagger.json</code>
                </div>
                <button
                  onClick={() => copyToClipboard('docs/swagger.json', 'swaggerpath')}
                  className="p-1.5 text-slate-400 hover:text-white rounded cursor-pointer hover:bg-slate-800 transition-colors"
                  title="Copiar ruta"
                >
                  {copiedKey === 'swaggerpath' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
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

      {/* Full-Screen Lightbox Modal for Diagram Image */}
      {isImageExpanded && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/95 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative max-w-6xl w-full max-h-[96vh] flex flex-col items-center">
            <button
              onClick={() => setIsImageExpanded(false)}
              className="absolute -top-10 right-0 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
            >
              <X className="w-5 h-5" />
              <span>Cerrar Vista Completa</span>
            </button>
            <img
              src="/architecture_diagram.jpg"
              alt="Diagrama de Arquitectura de Software ELKM"
              className="max-h-[85vh] w-auto max-w-full rounded-xl border border-slate-700 shadow-2xl object-contain bg-slate-950"
            />
            <div className="mt-3 flex items-center gap-4 text-xs text-slate-300">
              <span className="font-semibold text-white">Diagrama Oficial de Arquitectura · ELKM</span>
              <a
                href="/architecture_diagram.jpg"
                download="ELKM_Diagrama_Arquitectura.jpg"
                className="px-3 py-1 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold rounded-lg flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Descargar Imagen JPG</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
