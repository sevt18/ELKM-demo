import React from 'react';
import { Package, Truck, RotateCcw, Wrench, ShieldAlert } from 'lucide-react';

export type ActiveTab = 'inventory' | 'dispatch' | 'returns' | 'maintenance' | 'alerts';

interface NavigationProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  alertCount: number;
  maintenanceCount: number;
  dispatchCount: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onTabChange,
  alertCount,
  maintenanceCount,
  dispatchCount,
}) => {
  const tabs = [
    {
      id: 'inventory' as ActiveTab,
      label: 'Inventario',
      icon: Package,
      badge: null,
    },
    {
      id: 'dispatch' as ActiveTab,
      label: 'Despachos',
      icon: Truck,
      badge: dispatchCount > 0 ? dispatchCount : null,
      badgeVariant: 'amber',
    },
    {
      id: 'returns' as ActiveTab,
      label: 'Retornos',
      icon: RotateCcw,
      badge: null,
    },
    {
      id: 'maintenance' as ActiveTab,
      label: 'Mantenimiento',
      icon: Wrench,
      badge: maintenanceCount > 0 ? maintenanceCount : null,
      badgeVariant: 'amber',
    },
    {
      id: 'alerts' as ActiveTab,
      label: 'Alertas',
      icon: ShieldAlert,
      badge: alertCount > 0 ? alertCount : null,
      badgeVariant: 'rose',
    },
  ];

  return (
    <>
      {/* Desktop Navigation Tabs */}
      <nav className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200/80">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                isActive
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-slate-900' : 'text-slate-500'}`} />
              <span className="whitespace-nowrap">{tab.label}</span>
              {tab.badge !== null && (
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-semibold ${
                    tab.badgeVariant === 'rose'
                      ? 'bg-rose-100 text-rose-700'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Mobile Bottom Navigation Bar */}
      <nav
        aria-label="Navegación móvil"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1.5 shadow-sm"
      >
        <div className="grid grid-cols-5 gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex flex-col items-center justify-center py-1.5 rounded transition-colors ${
                  isActive ? 'text-slate-900 font-semibold' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <div className="relative">
                  <Icon className="w-4 h-4 mb-0.5" />
                  {tab.badge !== null && (
                    <span className="absolute -top-1 -right-2 text-[9px] font-mono font-bold px-1 rounded-full bg-slate-900 text-white">
                      {tab.badge}
                    </span>
                  )}
                </div>
                <span className="text-[10px] leading-tight truncate">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
