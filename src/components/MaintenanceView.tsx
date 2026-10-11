import React, { useState } from 'react';
import { Kit } from '../types/elkm';
import { StatusBadge } from './StatusBadge';
import { CycleProgress } from './CycleProgress';
import { CheckCircle, Hammer } from 'lucide-react';

interface MaintenanceViewProps {
  kits: Kit[];
  onOpenServiceAction: (kit: Kit) => void;
  onOpenKitDetails: (kit: Kit) => void;
}

export const MaintenanceView: React.FC<MaintenanceViewProps> = ({
  kits,
  onOpenServiceAction,
  onOpenKitDetails,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'active' | 'history'>('active');

  const workshopKits = kits.filter(
    (k) => k.status === 'mantenimiento' || k.status === 'bloqueado'
  );

  const allServiceRecords = kits
    .flatMap((k) =>
      k.serviceHistory.map((s) => ({
        ...s,
        kitName: k.name,
        kitSku: k.sku,
        kitId: k.id,
      }))
    )
    .sort((a, b) => (a.date < b.date ? 1 : -1));

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight">
            Taller Técnico & Mantenimiento
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Inspección de equipos retenidos, calibración y reinicio de ciclos a cero.
          </p>
        </div>

        {/* Sub tabs */}
        <div className="flex items-center gap-1 bg-slate-100 p-0.5 border border-slate-200 rounded-lg text-xs self-start sm:self-auto">
          <button
            onClick={() => setActiveSubTab('active')}
            className={`px-3 py-1 rounded-md transition-colors cursor-pointer text-xs ${
              activeSubTab === 'active' ? 'bg-white text-slate-900 font-semibold shadow-xs border border-slate-200/60' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            En Taller ({workshopKits.length})
          </button>
          <button
            onClick={() => setActiveSubTab('history')}
            className={`px-3 py-1 rounded-md transition-colors cursor-pointer text-xs ${
              activeSubTab === 'history' ? 'bg-white text-slate-900 font-semibold shadow-xs border border-slate-200/60' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Historial ({allServiceRecords.length})
          </button>
        </div>
      </div>

      {activeSubTab === 'active' ? (
        workshopKits.length === 0 ? (
          <div className="text-center py-16 bg-white border border-slate-200 rounded-xl shadow-xs">
            <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
            <p className="text-xs text-slate-500">El taller está al día. No hay equipos en mantenimiento ni bloqueados.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {workshopKits.map((kit) => (
              <div
                key={kit.id}
                className="bg-white border border-slate-200/90 rounded-xl p-4 flex flex-col justify-between space-y-3 shadow-xs hover:border-slate-300"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <div className="text-[11px] font-mono text-slate-500">
                        {kit.sku} · {kit.category} · {kit.location}
                      </div>
                      <h3 className="text-sm font-semibold text-slate-900 mt-0.5">
                        {kit.name}
                      </h3>
                    </div>
                    <StatusBadge status={kit.status} size="sm" />
                  </div>

                  <p className="text-xs text-slate-600 mb-3">
                    {kit.specs}
                  </p>

                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-xs mb-3">
                    <span className="text-[11px] text-slate-500 block mb-0.5 font-medium">Diagnóstico:</span>
                    <p className="text-slate-700 italic text-[11px]">
                      {kit.notes || 'Revisión por ciclo preventivo acumulado.'}
                    </p>
                  </div>

                  <CycleProgress
                    current={kit.currentCycles}
                    threshold={kit.cycleThreshold}
                    compact={true}
                  />
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onOpenKitDetails(kit)}
                    className="text-xs text-slate-600 hover:text-slate-900 transition-colors cursor-pointer font-medium"
                  >
                    Ficha
                  </button>

                  <button
                    onClick={() => onOpenServiceAction(kit)}
                    className="px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded transition-colors flex items-center gap-1 cursor-pointer shadow-2xs"
                  >
                    <Hammer className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Realizar Servicio & Liberar</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        /* History */
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden text-xs shadow-xs">
          {allServiceRecords.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              No hay servicios registrados en la bitácora histórica.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {allServiceRecords.map((record) => (
                <div key={record.id} className="p-3.5 hover:bg-slate-50 transition-colors space-y-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-slate-900 font-semibold">{record.kitSku}</span>
                      <span className="font-semibold text-slate-900">{record.kitName}</span>
                      <span className="text-[11px] text-slate-600 bg-slate-100 px-1.5 py-0.2 rounded font-mono">
                        {record.type}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500 font-mono">
                      {record.date} · {record.technician}
                    </span>
                  </div>

                  <p className="text-slate-600 text-xs">
                    {record.notes}
                  </p>

                  {record.cyclesResetToZero && (
                    <span className="text-emerald-700 text-[11px] block font-mono font-medium">
                      ✓ Contador reseteado a 0
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
