import React, { useState } from 'react';
import { DispatchEvent, Kit } from '../../types/elkm';
import { 
  Calendar as CalendarIcon, 
  MapPin, 
  ArrowRight, 
  Plus, 
  RotateCcw,
  Truck
} from 'lucide-react';
import { StatusBadge } from '../../components/StatusBadge';

interface DispatchCalendarViewProps {
  dispatches: DispatchEvent[];
  kits: Kit[];
  onOpenNewDispatch: () => void;
  onDispatchToField: (dispatchId: string) => void;
  onSelectForReturn: (kitId: string) => void;
}

export const DispatchCalendarView: React.FC<DispatchCalendarViewProps> = ({
  dispatches,
  kits,
  onOpenNewDispatch,
  onDispatchToField,
  onSelectForReturn,
}) => {
  const [filterState, setFilterState] = useState<'all' | 'programado' | 'en_evento' | 'retornado'>('all');

  const filteredDispatches = dispatches.filter((d) => {
    if (filterState === 'all') return true;
    return d.status === filterState;
  });

  const activeInFieldCount = dispatches.filter((d) => d.status === 'en_evento').length;
  const scheduledCount = dispatches.filter((d) => d.status === 'programado').length;

  return (
    <div className="space-y-6">
      
      {/* Header & Ribbon */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight">
            Despachos & Calendario Logístico
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Salidas programadas y seguimiento de retornos estimados a bodega.
          </p>
        </div>

        <button
          onClick={onOpenNewDispatch}
          className="px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer self-start sm:self-auto shadow-xs"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Programar Salida</span>
        </button>
      </div>

      {/* Filter Tabs & Ribbon Counters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-1 bg-slate-100 p-0.5 border border-slate-200 rounded-lg">
          {[
            { id: 'all', label: 'Todos' },
            { id: 'programado', label: `Programados (${scheduledCount})` },
            { id: 'en_evento', label: `En Campo (${activeInFieldCount})` },
            { id: 'retornado', label: 'Retornados' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterState(tab.id as any)}
              className={`px-3 py-1 rounded-md transition-colors cursor-pointer text-xs ${
                filterState === tab.id
                  ? 'bg-white text-slate-900 font-semibold shadow-xs border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="text-slate-500 text-xs">
          {dispatches.length} eventos registrados en sistema
        </div>
      </div>

      {/* Event List */}
      <div className="space-y-3">
        {filteredDispatches.length === 0 ? (
          <div className="text-center py-16 bg-white border border-slate-200 rounded-xl shadow-xs">
            <p className="text-slate-500 text-xs">No hay eventos en este estado.</p>
          </div>
        ) : (
          filteredDispatches.map((disp) => {
            const assignedKits = kits.filter((k) => disp.kitIds.includes(k.id));

            return (
              <div
                key={disp.id}
                className="bg-white border border-slate-200/90 rounded-xl p-4 transition-colors shadow-xs hover:border-slate-300"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div>
                    <div className="text-[11px] font-mono text-slate-500">
                      {disp.code} · {disp.client}
                    </div>
                    <h3 className="text-sm font-semibold text-slate-900 mt-0.5">
                      {disp.eventName}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{disp.venue}</span>
                      </span>
                      <span className="text-slate-300">·</span>
                      <span>Resp: {disp.operatorLead.split(' ')[0]}</span>
                    </div>
                  </div>

                  {/* Date range & status */}
                  <div className="flex items-center gap-3 text-xs">
                    <div className="font-mono text-slate-700 flex items-center gap-2 bg-slate-50 px-2.5 py-1 rounded border border-slate-200">
                      <span>{disp.departureDate}</span>
                      <ArrowRight className="w-3 h-3 text-slate-400" />
                      <span className="text-emerald-700 font-medium">{disp.returnDate}</span>
                    </div>

                    <span
                      className={`px-2.5 py-0.5 rounded text-[11px] font-medium ${
                        disp.status === 'en_evento'
                          ? 'text-sky-800 bg-sky-50 border border-sky-200'
                          : disp.status === 'retornado'
                          ? 'text-emerald-800 bg-emerald-50 border border-emerald-200'
                          : 'text-slate-700 bg-slate-100 border border-slate-200'
                      }`}
                    >
                      {disp.status === 'en_evento'
                        ? 'En Campo'
                        : disp.status === 'retornado'
                        ? 'Retornado'
                        : 'Programado'}
                    </span>
                  </div>
                </div>

                {/* Assigned kits strip */}
                <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs text-slate-500">Kits vinculados:</span>
                    {assignedKits.map((kit) => (
                      <span
                        key={kit.id}
                        className="bg-slate-50 border border-slate-200 px-2 py-0.5 rounded text-xs text-slate-700 font-mono"
                      >
                        {kit.name} ({kit.currentCycles}/{kit.cycleThreshold} c.)
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div>
                    {disp.status === 'programado' && (
                      <button
                        onClick={() => onDispatchToField(disp.id)}
                        className="px-2.5 py-1 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
                      >
                        <Truck className="w-3 h-3 stroke-[2.5]" />
                        <span>Marcar Salida</span>
                      </button>
                    )}

                    {disp.status === 'en_evento' && assignedKits.length > 0 && (
                      <button
                        onClick={() => onSelectForReturn(assignedKits[0].id)}
                        className="px-2.5 py-1 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <RotateCcw className="w-3 h-3 stroke-[2.5]" />
                        <span>Recepcionar Retorno</span>
                      </button>
                    )}
                  </div>
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
