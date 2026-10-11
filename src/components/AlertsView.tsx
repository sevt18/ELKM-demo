import React, { useState } from 'react';
import { Kit } from '../types/elkm';
import { StatusBadge } from './StatusBadge';
import { 
  ShieldAlert, 
  Wrench, 
  CheckCircle2, 
} from 'lucide-react';

interface AlertsViewProps {
  kits: Kit[];
  onSendToMaintenance: (kitId: string) => void;
  onLockKit: (kitId: string) => void;
  onOpenKitDetails: (kit: Kit) => void;
  onNavigateToMaintenance: () => void;
}

export const AlertsView: React.FC<AlertsViewProps> = ({
  kits,
  onSendToMaintenance,
  onLockKit,
  onOpenKitDetails,
}) => {
  const [filterSeverity, setFilterSeverity] = useState<'all' | 'critical' | 'warning'>('all');

  const alertKits = kits.map((kit) => {
    const isExceeded = kit.currentCycles >= kit.cycleThreshold;
    const isNearThreshold = !isExceeded && kit.currentCycles / kit.cycleThreshold >= 0.85;

    let diagnosis = '';
    if (kit.category === 'Iluminación') {
      diagnosis = isExceeded ? 'Riesgo térmico en lámpara LED y holgura en motor Pan/Tilt' : 'Revisión preventiva de correas y óptica sugerida';
    } else if (kit.category === 'Audio') {
      diagnosis = isExceeded ? 'Riesgo de daño en transductores y bobinas acústicas' : 'Comprobación de filtros FFT y respuesta en frecuencia';
    } else if (kit.category === 'Video & Pantallas') {
      diagnosis = isExceeded ? 'Desgaste en fuentes de poder y tarjetas de recepción' : 'Inspección de puertos gigabit y sellado IP65';
    } else if (kit.category === 'Efectos Especiales') {
      diagnosis = isExceeded ? 'Riesgo de bloqueo de resistencia y conducto térmico' : 'Descalcificación preventiva de bomba de fluido';
    } else {
      diagnosis = isExceeded ? 'Fatiga en pernos cónicos y puntos de carga de rigging' : 'Verificación de tolerancias dimensionales en espigas';
    }

    return {
      kit,
      isExceeded,
      isNearThreshold,
      diagnosis,
      severity: isExceeded ? ('critical' as const) : isNearThreshold ? ('warning' as const) : null,
    };
  }).filter((item) => item.severity !== null);

  const displayedAlerts = alertKits.filter((item) => {
    if (filterSeverity === 'critical') return item.isExceeded;
    if (filterSeverity === 'warning') return item.isNearThreshold;
    return true;
  });

  const criticalCount = alertKits.filter((a) => a.isExceeded).length;
  const warningCount = alertKits.filter((a) => a.isNearThreshold).length;

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight">
            Alertas Preventivas de Bodega
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Equipos con umbral de ciclos alcanzado (&ge;100%) o en zona de advertencia (&ge;85%).
          </p>
        </div>

        {/* Severity Filter Controls */}
        <div className="flex items-center gap-1 bg-slate-100 p-0.5 border border-slate-200 rounded-lg text-xs self-start sm:self-auto">
          <button
            onClick={() => setFilterSeverity('all')}
            className={`px-3 py-1 rounded-md transition-colors cursor-pointer text-xs ${
              filterSeverity === 'all' ? 'bg-white text-slate-900 font-semibold shadow-xs border border-slate-200/60' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Todas ({alertKits.length})
          </button>
          <button
            onClick={() => setFilterSeverity('critical')}
            className={`px-3 py-1 rounded-md transition-colors cursor-pointer text-xs ${
              filterSeverity === 'critical' ? 'bg-rose-50 text-rose-800 font-semibold border border-rose-200' : 'text-slate-600 hover:text-rose-700'
            }`}
          >
            Críticas ({criticalCount})
          </button>
          <button
            onClick={() => setFilterSeverity('warning')}
            className={`px-3 py-1 rounded-md transition-colors cursor-pointer text-xs ${
              filterSeverity === 'warning' ? 'bg-amber-50 text-amber-800 font-semibold border border-amber-200' : 'text-slate-600 hover:text-amber-700'
            }`}
          >
            Preventivas ({warningCount})
          </button>
        </div>
      </div>

      {/* List */}
      {displayedAlerts.length === 0 ? (
        <div className="text-center py-16 bg-white border border-slate-200 rounded-xl shadow-xs">
          <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
          <p className="text-xs text-slate-500">No hay alertas activas. Todo el parque opera en parámetros seguros.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {displayedAlerts.map(({ kit, isExceeded, diagnosis }) => (
            <div
              key={kit.id}
              className={`border rounded-xl p-4 transition-colors shadow-xs ${
                isExceeded ? 'bg-rose-50/20 border-rose-200' : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 text-xs">
                <div>
                  <div className="text-[11px] font-mono text-slate-500">
                    {kit.sku} · {kit.category} · {kit.location}
                  </div>
                  <h3 className="text-sm font-semibold text-slate-900 mt-0.5">
                    {kit.name}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <StatusBadge status={kit.status} size="sm" />
                  <span
                    className={`px-2 py-0.5 rounded text-[11px] font-mono font-semibold ${
                      isExceeded ? 'text-rose-800 bg-rose-50 border border-rose-200' : 'text-amber-800 bg-amber-50 border border-amber-200'
                    }`}
                  >
                    {kit.currentCycles}/{kit.cycleThreshold} ciclos
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="pt-3 grid grid-cols-1 lg:grid-cols-12 gap-3 items-center text-xs">
                <div className="lg:col-span-8 space-y-1">
                  <span className="text-slate-500 font-medium block">Diagnóstico de Operación:</span>
                  <p className="text-slate-700 leading-relaxed">
                    {diagnosis}
                  </p>
                </div>

                <div className="lg:col-span-4 flex items-center justify-start lg:justify-end gap-2 pt-2 lg:pt-0">
                  <button
                    onClick={() => onOpenKitDetails(kit)}
                    className="px-2.5 py-1 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer text-xs font-medium"
                  >
                    Ficha
                  </button>

                  {kit.status !== 'bloqueado' && (
                    <button
                      onClick={() => onLockKit(kit.id)}
                      className="px-2.5 py-1 text-xs text-rose-700 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded transition-colors cursor-pointer font-medium"
                    >
                      Bloquear
                    </button>
                  )}

                  {kit.status !== 'mantenimiento' && (
                    <button
                      onClick={() => onSendToMaintenance(kit.id)}
                      className="px-2.5 py-1 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
                    >
                      <Wrench className="w-3 h-3 stroke-[2.5]" />
                      <span>Enviar a Taller</span>
                    </button>
                  )}
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};
