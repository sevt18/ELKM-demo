import React, { useState } from 'react';
import { Kit, TriageOption, ReturnLog } from '../types/elkm';
import { StatusBadge } from './StatusBadge';
import { 
  RotateCcw, 
  CheckCircle, 
  AlertTriangle, 
  Ban, 
  Clock,
  ExternalLink,
  Image as ImageIcon
} from 'lucide-react';
import { FirebaseFileUpload } from '../shared/components/FirebaseFileUpload';

interface ReturnsViewProps {
  kits: Kit[];
  preSelectedKitId?: string;
  onProcessReturn: (
    kitId: string,
    eventName: string,
    operatorName: string,
    triageResult: TriageOption,
    notes: string,
    evidenceImageUrl?: string
  ) => { log: ReturnLog; updatedKit: Kit };
  returnLogs: ReturnLog[];
}

export const ReturnsView: React.FC<ReturnsViewProps> = ({
  kits,
  preSelectedKitId,
  onProcessReturn,
  returnLogs,
}) => {
  const [selectedKitId, setSelectedKitId] = useState<string>(
    preSelectedKitId || (kits.length > 0 ? kits[0].id : '')
  );
  const [eventName, setEventName] = useState('Festival Stereo Sound 2026');
  const [operatorName, setOperatorName] = useState('Administración Bodega');
  const [triageOption, setTriageOption] = useState<TriageOption>('optimo');
  const [notes, setNotes] = useState('');
  const [evidenceImageUrl, setEvidenceImageUrl] = useState<string | undefined>(undefined);
  
  const [lastProcessed, setLastProcessed] = useState<{
    log: ReturnLog;
    updatedKit: Kit;
  } | null>(null);

  const selectedKit = kits.find((k) => k.id === selectedKitId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedKitId) return;

    let finalNotes = notes.trim();
    if (!finalNotes) {
      if (triageOption === 'optimo') {
        finalNotes = 'Retorno verificado en rampa sin novedades técnicas.';
      } else if (triageOption === 'calibracion') {
        finalNotes = 'Desgaste operativo detectado. Trasladado a taller preventivo.';
      } else {
        finalNotes = 'Falla o daño reportado en devolución. Bloqueado de inventario.';
      }
    }

    const result = onProcessReturn(
      selectedKitId,
      eventName,
      operatorName,
      triageOption,
      finalNotes,
      evidenceImageUrl
    );

    setLastProcessed(result);
    setNotes('');
    setEvidenceImageUrl(undefined);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="pb-3 border-b border-slate-200">
        <h2 className="text-base font-bold text-slate-900 tracking-tight">
          Recepción & Retorno de Eventos
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Registro de ingreso con incremento automático de ciclo (+1) y evidencia fotográfica en Firebase Storage.
        </p>
      </div>

      {/* Confirmation strip */}
      {lastProcessed && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-emerald-900 shadow-2xs">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-emerald-600" />
            <div>
              <span className="font-semibold text-emerald-950">Retorno procesado: </span>
              <span className="text-emerald-900">{lastProcessed.updatedKit.name} ({lastProcessed.updatedKit.sku})</span>
              <span className="text-emerald-700 ml-2 font-mono">
                Ciclos: {lastProcessed.log.previousCycles} &rarr; <strong className="text-emerald-950">{lastProcessed.log.newCycles}</strong>
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={lastProcessed.updatedKit.status} size="sm" />
            <button
              onClick={() => setLastProcessed(null)}
              className="text-emerald-700 hover:text-emerald-950 ml-2 cursor-pointer font-medium"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Form & History */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Clean Form */}
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-5 space-y-4 text-xs shadow-xs"
        >
          {/* Kit selection */}
          <div>
            <label className="block text-slate-700 font-medium mb-1">
              Equipo a Recibir en Bodega
            </label>
            <select
              value={selectedKitId}
              onChange={(e) => setSelectedKitId(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-slate-800 shadow-2xs"
            >
              {kits.map((kit) => (
                <option key={kit.id} value={kit.id}>
                  {kit.sku} — {kit.name} ({kit.currentCycles}/{kit.cycleThreshold} c.)
                </option>
              ))}
            </select>
          </div>

          {/* Event & Responsible */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-medium mb-1">
                Evento de Procedencia
              </label>
              <input
                type="text"
                required
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-900 focus:outline-none focus:border-slate-800 shadow-2xs"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-medium mb-1">
                Responsable de Ingreso
              </label>
              <input
                type="text"
                required
                value={operatorName}
                onChange={(e) => setOperatorName(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-900 focus:outline-none focus:border-slate-800 shadow-2xs"
              />
            </div>
          </div>

          {/* Triage Options */}
          <div>
            <label className="block text-slate-700 font-medium mb-2">
              Triaje de Recepción Técnica
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setTriageOption('optimo')}
                className={`p-3 rounded-lg border text-left transition-colors cursor-pointer ${
                  triageOption === 'optimo'
                    ? 'bg-slate-900 border-slate-900 text-white font-medium shadow-xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <CheckCircle className={`w-3.5 h-3.5 ${triageOption === 'optimo' ? 'text-emerald-400' : 'text-emerald-600'}`} />
                  <span className="font-semibold text-xs">Retorno Óptimo</span>
                </div>
                <p className={`text-[11px] leading-snug ${triageOption === 'optimo' ? 'text-slate-300' : 'text-slate-500'}`}>
                  Sin fallas. Si llega al umbral pasa a preventivo.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setTriageOption('calibracion')}
                className={`p-3 rounded-lg border text-left transition-colors cursor-pointer ${
                  triageOption === 'calibracion'
                    ? 'bg-slate-900 border-slate-900 text-white font-medium shadow-xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <AlertTriangle className={`w-3.5 h-3.5 ${triageOption === 'calibracion' ? 'text-amber-400' : 'text-amber-600'}`} />
                  <span className="font-semibold text-xs">Calibración</span>
                </div>
                <p className={`text-[11px] leading-snug ${triageOption === 'calibracion' ? 'text-slate-300' : 'text-slate-500'}`}>
                  Desgaste leve o desajuste. Pasa a taller.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setTriageOption('critico')}
                className={`p-3 rounded-lg border text-left transition-colors cursor-pointer ${
                  triageOption === 'critico'
                    ? 'bg-slate-900 border-slate-900 text-white font-medium shadow-xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <Ban className={`w-3.5 h-3.5 ${triageOption === 'critico' ? 'text-rose-400' : 'text-rose-600'}`} />
                  <span className="font-semibold text-xs">Daño Crítico</span>
                </div>
                <p className={`text-[11px] leading-snug ${triageOption === 'critico' ? 'text-slate-300' : 'text-slate-500'}`}>
                  Avería o rotura. Pasa a bloqueado.
                </p>
              </button>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-slate-700 font-medium mb-1">
              Observaciones del Ingreso
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Notas breves sobre el estado físico o componentes devueltos..."
              className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-800 shadow-2xs"
            />
          </div>

          {/* Firebase Storage File Upload: Return Evidence */}
          <FirebaseFileUpload
            label="Evidencia Fotográfica / Acta de Retorno"
            directory="returns"
            accept="image/*,application/pdf"
            value={evidenceImageUrl}
            onChange={setEvidenceImageUrl}
            helperText="Sube foto del kit, conectores o daños observados (Firebase Storage)"
          />

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Confirmar Retorno (+1 Ciclo)</span>
          </button>
        </form>

        {/* Right: Clean History Feed */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-4 space-y-3 text-xs shadow-xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="font-medium text-slate-800 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Bitácora de Retornos Recientes</span>
            </span>
            <span className="font-mono text-slate-500 text-[11px]">{returnLogs.length}</span>
          </div>

          <div className="space-y-2.5 max-h-[480px] overflow-y-auto pr-1">
            {returnLogs.map((log) => (
              <div
                key={log.id}
                className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-900">{log.kitName}</span>
                  <StatusBadge status={log.resultingStatus} size="sm" />
                </div>
                <div className="text-[11px] text-slate-500">
                  {log.eventName} · {log.timestamp.slice(0, 16)}
                </div>
                {log.notes && (
                  <p className="text-[11px] text-slate-600 bg-white p-2 rounded-lg border border-slate-100 italic">
                    "{log.notes}"
                  </p>
                )}
                
                {/* Evidence Image from Firebase Storage */}
                {log.evidenceImageUrl && (
                  <div className="pt-1 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg overflow-hidden bg-slate-200 border border-slate-300 shrink-0">
                      <img
                        src={log.evidenceImageUrl}
                        alt="Evidencia"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <a
                      href={log.evidenceImageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-emerald-700 hover:text-emerald-800 flex items-center gap-1 font-medium underline"
                    >
                      <ImageIcon className="w-3 h-3 text-emerald-600" />
                      <span>Ver evidencia fotográfica en Storage</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                )}

                <div className="flex items-center justify-between text-[11px] text-slate-600 pt-1 font-mono border-t border-slate-100/80">
                  <span>Ciclos: {log.previousCycles} &rarr; <strong className="text-slate-900">{log.newCycles}</strong></span>
                  <span className="text-slate-500 capitalize">{log.triageResult}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
