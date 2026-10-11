import React, { useState } from 'react';
import { Kit } from '../types/elkm';
import { X, Hammer, Check } from 'lucide-react';
import { FirebaseFileUpload } from '../shared/components/FirebaseFileUpload';

interface MaintenanceActionModalProps {
  kit: Kit;
  onClose: () => void;
  onCompleteService: (
    kitId: string,
    technician: string,
    serviceType: 'Preventivo' | 'Correctivo' | 'Calibración' | 'Overhaul',
    notes: string,
    resetCycles: boolean,
    reportAttachmentUrl?: string
  ) => void;
}

export const MaintenanceActionModal: React.FC<MaintenanceActionModalProps> = ({
  kit,
  onClose,
  onCompleteService,
}) => {
  const [technician, setTechnician] = useState('Carlos Méndez (Técnico Bodega)');
  const [serviceType, setServiceType] = useState<'Preventivo' | 'Correctivo' | 'Calibración' | 'Overhaul'>('Preventivo');
  const [notes, setNotes] = useState('Limpieza profunda, lubricación de componentes mecánicos y prueba de carga superada.');
  const [resetCycles, setResetCycles] = useState(true);
  const [reportAttachmentUrl, setReportAttachmentUrl] = useState<string | undefined>(undefined);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCompleteService(kit.id, technician, serviceType, notes, resetCycles, reportAttachmentUrl);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg max-h-[92vh] overflow-y-auto p-6 shadow-xl relative text-slate-900">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5 pb-3 border-b border-slate-100">
          <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-900 flex items-center justify-center shrink-0">
            <Hammer className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Completar Servicio Técnico</h3>
            <p className="text-xs text-slate-500">
              {kit.name} <span className="font-mono font-medium text-slate-700">({kit.sku})</span>
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 font-medium mb-1">
              Tipo de Servicio Realizado:
            </label>
            <select
              value={serviceType}
              onChange={(e) => setServiceType(e.target.value as any)}
              className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-slate-800 text-xs shadow-2xs"
            >
              <option value="Preventivo">Mantenimiento Preventivo Rutinario</option>
              <option value="Calibración">Calibración Óptica / DMX / Acústica</option>
              <option value="Correctivo">Reparación Correctiva de Falla</option>
              <option value="Overhaul">Overhaul Completo de Sistema</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-700 font-medium mb-1">
              Técnico a Cargo:
            </label>
            <input
              type="text"
              required
              value={technician}
              onChange={(e) => setTechnician(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-slate-800 text-xs shadow-2xs"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-medium mb-1">
              Informe Técnico:
            </label>
            <textarea
              rows={3}
              required
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Detalla las pruebas realizadas o tolerancias verificadas..."
              className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-slate-800 text-xs shadow-2xs"
            />
          </div>

          {/* Firebase Storage File Upload: Service Certificate / Photo */}
          <FirebaseFileUpload
            label="Comprobante / Informe Adjunto (Firebase Storage)"
            directory="reports"
            accept="image/*,application/pdf"
            value={reportAttachmentUrl}
            onChange={setReportAttachmentUrl}
            helperText="Certificado de calibración, informe PDF o foto del servicio"
          />

          {/* Reset cycles */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
            <label className="flex items-start gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={resetCycles}
                onChange={(e) => setResetCycles(e.target.checked)}
                className="mt-0.5 rounded border-slate-300 text-slate-900 focus:ring-0"
              />
              <div>
                <span className="text-slate-900 font-medium block">
                  Reiniciar contador de ciclos operativos a 0
                </span>
                <span className="text-[11px] text-slate-500 leading-snug">
                  Actualmente acumula {kit.currentCycles} / {kit.cycleThreshold} ciclos.
                </span>
              </div>
            </label>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 p-2.5 rounded-lg text-emerald-800 text-[11px]">
            ✓ Al guardar, el kit pasará automáticamente a estado <strong>"Disponible"</strong> en bodega.
          </div>

          <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:text-slate-900 rounded-lg transition-colors font-medium text-xs cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs text-xs cursor-pointer"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Liberar a Bodega</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
