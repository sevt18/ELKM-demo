import React, { useState } from 'react';
import { Kit, KitStatus } from '../../types/elkm';
import { StatusBadge } from '../../shared/components/StatusBadge';
import { CycleProgress } from '../../shared/components/CycleProgress';
import { 
  X, 
  MapPin, 
  Calendar, 
  RotateCcw, 
  Wrench, 
  History,
  FileText,
  ExternalLink,
  Image as ImageIcon,
  Camera
} from 'lucide-react';
import { FirebaseFileUpload } from '../../shared/components/FirebaseFileUpload';
import { updateKitInFirestore } from '../../firebase/firestoreService';

interface KitDetailModalProps {
  kit: Kit;
  onClose: () => void;
  onUpdateStatus: (kitId: string, newStatus: KitStatus) => void;
  onSelectForReturn: (kitId: string) => void;
  onOpenMaintenanceModal: (kit: Kit) => void;
}

export const KitDetailModal: React.FC<KitDetailModalProps> = ({
  kit,
  onClose,
  onUpdateStatus,
  onSelectForReturn,
  onOpenMaintenanceModal,
}) => {
  const [showUploadImage, setShowUploadImage] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | undefined>(kit.imageUrl);

  const handleImageUploaded = async (url: string | undefined) => {
    setCurrentImageUrl(url);
    try {
      await updateKitInFirestore(kit.id, { imageUrl: url });
      kit.imageUrl = url;
    } catch (err) {
      console.error('Error al actualizar imagen del kit en Firestore:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 shadow-xl relative space-y-5 text-slate-900">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with optional Image Banner */}
        <div className="space-y-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
            <span className="text-slate-900 font-bold">{kit.sku}</span>
            <span className="text-slate-300">·</span>
            <span className="text-slate-600 font-sans">{kit.category}</span>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-slate-900">{kit.name}</h2>
            <StatusBadge status={kit.status} size="md" />
          </div>

          {/* Kit Photo from Firebase Storage */}
          {currentImageUrl ? (
            <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-100 max-h-56 group">
              <img
                src={currentImageUrl}
                alt={kit.name}
                className="w-full h-48 object-cover"
              />
              <div className="absolute bottom-2 right-2 flex items-center gap-2">
                <a
                  href={currentImageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 bg-slate-900/80 hover:bg-slate-900 text-white rounded-lg text-[11px] font-medium backdrop-blur-xs flex items-center gap-1 transition-colors"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>Ver en Storage</span>
                </a>
                <button
                  type="button"
                  onClick={() => setShowUploadImage(!showUploadImage)}
                  className="px-2.5 py-1 bg-white/90 hover:bg-white text-slate-800 rounded-lg text-[11px] font-medium backdrop-blur-xs flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Camera className="w-3 h-3" />
                  <span>Cambiar Foto</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              <div className="flex items-center gap-2 text-slate-600">
                <ImageIcon className="w-4 h-4 text-slate-400" />
                <span>Sin foto técnica asignada</span>
              </div>
              <button
                type="button"
                onClick={() => setShowUploadImage(!showUploadImage)}
                className="text-xs text-slate-900 hover:text-slate-700 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Subir Foto a Firebase Storage</span>
              </button>
            </div>
          )}

          {/* Inline Image Upload Dropdown if toggled */}
          {showUploadImage && (
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <FirebaseFileUpload
                label="Subir Foto del Kit (Firebase Storage)"
                directory="kits"
                accept="image/*"
                value={currentImageUrl}
                onChange={handleImageUploaded}
                helperText="El archivo se guardará en tu bucket de Firebase Storage"
              />
            </div>
          )}

          {/* Manual Link if available */}
          {kit.manualUrl && (
            <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200/80 rounded-xl text-xs text-emerald-900">
              <span className="flex items-center gap-2 font-medium">
                <FileText className="w-4 h-4 text-emerald-700" />
                <span>Manual Técnico y Ficha de Mantenimiento</span>
              </span>
              <a
                href={kit.manualUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-medium text-[11px] flex items-center gap-1 transition-colors"
              >
                <span>Descargar PDF</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}
        </div>

        {/* Cycle Section */}
        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1.5">
          <CycleProgress
            current={kit.currentCycles}
            threshold={kit.cycleThreshold}
          />
          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
            <span>Umbral límite: <strong className="text-slate-700">{kit.cycleThreshold} eventos</strong></span>
            <span>Margen restante: <strong className={kit.cycleThreshold - kit.currentCycles <= 0 ? 'text-rose-700' : 'text-emerald-700'}>
              {kit.cycleThreshold - kit.currentCycles} ciclos
            </strong></span>
          </div>
        </div>

        {/* Specs & Location Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-0.5">
            <span className="text-slate-500 font-medium flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>Ubicación en Bodega:</span>
            </span>
            <p className="text-slate-900 font-semibold">{kit.location}</p>
          </div>

          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-0.5">
            <span className="text-slate-500 font-medium flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Último Evento:</span>
            </span>
            <p className="text-slate-900 font-semibold truncate">{kit.lastEventName}</p>
            <span className="text-[11px] text-slate-500 block">{kit.lastReturnDate}</span>
          </div>
        </div>

        {/* Full Specifications */}
        <div className="space-y-1 text-xs">
          <span className="font-semibold text-slate-700">Especificaciones Técnicas:</span>
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-slate-700 leading-relaxed font-mono text-[11px]">
            {kit.specs}
          </div>
        </div>

        {/* Components Breakdown */}
        {kit.components && kit.components.length > 0 && (
          <div className="space-y-1.5 text-xs">
            <span className="font-semibold text-slate-700">Componentes Integrados ({kit.components.length}):</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {kit.components.map((c) => (
                <div key={c.id} className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                  <div>
                    <span className="font-medium text-slate-900">{c.name}</span>
                    {c.serialOrSpec && (
                      <span className="text-[10px] text-slate-500 block font-mono">{c.serialOrSpec}</span>
                    )}
                  </div>
                  <span className="font-mono text-slate-900 font-semibold bg-white px-2 py-0.5 rounded border border-slate-200">
                    x{c.quantity}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Maintenance History */}
        <div className="space-y-2 text-xs">
          <span className="font-semibold text-slate-700 flex items-center gap-1.5">
            <History className="w-3.5 h-3.5 text-slate-500" />
            <span>Historial Técnico ({kit.serviceHistory.length}):</span>
          </span>

          {kit.serviceHistory.length === 0 ? (
            <p className="text-slate-500 italic p-3 bg-slate-50 rounded border border-slate-200">
              No registra intervenciones de taller previas.
            </p>
          ) : (
            <div className="space-y-1.5 max-h-48 overflow-y-auto">
              {kit.serviceHistory.map((s) => (
                <div key={s.id} className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-900">{s.type}</span>
                    <span className="text-[11px] text-slate-500">{s.date} · {s.technician}</span>
                  </div>
                  <p className="text-slate-600 text-[11px]">{s.notes}</p>
                  
                  {/* Service report attachment if stored in Firebase Storage */}
                  {s.reportAttachmentUrl && (
                    <div className="pt-1">
                      <a
                        href={s.reportAttachmentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] text-emerald-700 hover:text-emerald-800 flex items-center gap-1 font-medium underline"
                      >
                        <FileText className="w-3 h-3 text-emerald-600" />
                        <span>Ver comprobante / informe en Storage</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Change Status Fast Actions */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 mr-1">Forzar Estado:</span>
            <button
              onClick={() => onUpdateStatus(kit.id, 'disponible')}
              className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                kit.status === 'disponible'
                  ? 'bg-emerald-100 text-emerald-800 font-semibold'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Disponible
            </button>
            <button
              onClick={() => onUpdateStatus(kit.id, 'mantenimiento')}
              className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                kit.status === 'mantenimiento'
                  ? 'bg-amber-100 text-amber-800 font-semibold'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Mantenimiento
            </button>
            <button
              onClick={() => onUpdateStatus(kit.id, 'bloqueado')}
              className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                kit.status === 'bloqueado'
                  ? 'bg-rose-100 text-rose-800 font-semibold'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Bloqueado
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onSelectForReturn(kit.id);
                onClose();
              }}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Recepcionar Retorno</span>
            </button>
            <button
              onClick={() => {
                onOpenMaintenanceModal(kit);
                onClose();
              }}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>Ingresar a Taller</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
