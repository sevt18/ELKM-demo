import React from 'react';
import { Plus, RotateCw, LogOut, Database, BookOpen } from 'lucide-react';
import { Navigation, ActiveTab } from './Navigation';
import { Kit, UserProfile, DispatchEvent } from '../types/elkm';
import { FIREBASE_PROJECT_NAME } from '../firebase/config';

interface HeaderProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  onOpenNewKit: () => void;
  onResetDemoData: () => void;
  onLogout: () => void;
  onOpenDocs: () => void;
  currentUser: UserProfile;
  kits: Kit[];
  dispatches: DispatchEvent[];
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  onOpenNewKit,
  onResetDemoData,
  onLogout,
  onOpenDocs,
  currentUser,
  kits,
  dispatches,
}) => {
  const alertCount = kits.filter((k) => k.currentCycles >= k.cycleThreshold).length;
  const maintenanceCount = kits.filter((k) => k.status === 'mantenimiento' || k.status === 'bloqueado').length;
  const dispatchCount = dispatches.filter((d) => d.status === 'en_evento').length;

  return (
    <header className="sticky top-0 z-30 w-full bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14 gap-3">
          
          {/* Zone 1: Brand Wordmark & Firebase Project Name */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              E
            </div>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-sm font-bold tracking-tight text-slate-900 leading-tight">
                  ELKM
                </span>
                <button
                  type="button"
                  onClick={onOpenDocs}
                  title="Ver detalles de conexión y arquitectura Firebase"
                  className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/80 transition-colors cursor-pointer"
                >
                  <Database className="w-2.5 h-2.5 text-emerald-600" />
                  <span className="max-w-[130px] sm:max-w-[200px] truncate">{FIREBASE_PROJECT_NAME}</span>
                </button>
              </div>
              <span className="text-[10px] text-slate-500 font-medium block leading-none mt-0.5">
                Control de Bodega & Eventos
              </span>
            </div>
          </div>

          {/* Zone 2: Navigation Links */}
          <div className="flex-1 justify-center hidden md:flex">
            <Navigation
              activeTab={activeTab}
              onTabChange={onTabChange}
              alertCount={alertCount}
              maintenanceCount={maintenanceCount}
              dispatchCount={dispatchCount}
            />
          </div>

          {/* Zone 3: Actions */}
          <div className="flex items-center gap-2 shrink-0">
            
            {/* View Architecture & Connection */}
            <button
              onClick={onOpenDocs}
              title="Ver arquitectura y parámetros de conexión Firebase"
              className="px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-slate-600" />
              <span className="hidden lg:inline text-[11px]">Arquitectura</span>
            </button>

            <button
              onClick={onOpenNewKit}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span className="hidden sm:inline">Nuevo Kit</span>
            </button>

            <button
              onClick={onResetDemoData}
              title="Restaurar datos predeterminados en Firebase"
              className="p-1.5 text-slate-500 hover:text-slate-900 border border-slate-200 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>

            {/* User & Logout */}
            <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200 ml-1">
              <div className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-700">
                {currentUser.avatarInitials || 'U'}
              </div>
              <button
                onClick={onLogout}
                title="Cerrar Sesión"
                className="flex items-center gap-1 px-1.5 py-1 text-xs text-slate-500 hover:text-rose-600 transition-colors cursor-pointer rounded"
              >
                <span className="hidden xl:inline text-[11px] text-slate-600 font-medium">
                  {currentUser.name.split(' ')[0]}
                </span>
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
