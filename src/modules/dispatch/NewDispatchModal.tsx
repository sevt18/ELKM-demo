import React, { useState } from 'react';
import { Kit, DispatchEvent } from '../../types/elkm';
import { X, Calendar, Truck, Check } from 'lucide-react';

interface NewDispatchModalProps {
  kits: Kit[];
  onClose: () => void;
  onAddDispatch: (newEvent: DispatchEvent) => void;
}

export const NewDispatchModal: React.FC<NewDispatchModalProps> = ({
  kits,
  onClose,
  onAddDispatch,
}) => {
  const [eventName, setEventName] = useState('');
  const [client, setClient] = useState('');
  const [venue, setVenue] = useState('');
  const [departureDate, setDepartureDate] = useState('2026-10-11');
  const [returnDate, setReturnDate] = useState('2026-10-13');
  const [operatorLead, setOperatorLead] = useState('Administración Bodega');
  const [selectedKitIds, setSelectedKitIds] = useState<string[]>([]);
  const [notes, setNotes] = useState('');

  const availableKits = kits.filter((k) => k.status === 'disponible');

  const toggleKitSelection = (kitId: string) => {
    setSelectedKitIds((prev) =>
      prev.includes(kitId) ? prev.filter((id) => id !== kitId) : [...prev, kitId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventName.trim() || selectedKitIds.length === 0) return;

    const newDispatch: DispatchEvent = {
      id: `DISP-${Date.now().toString().slice(-6)}`,
      code: `DSP-${Math.floor(100 + Math.random() * 900)}`,
      eventName: eventName.trim(),
      client: client.trim() || 'Cliente General',
      venue: venue.trim() || 'Locación Principal',
      departureDate,
      returnDate,
      status: 'programado',
      kitIds: selectedKitIds,
      operatorLead: operatorLead.trim(),
      notes: notes.trim() || 'Despacho registrado en calendario ELKM.',
    };

    onAddDispatch(newDispatch);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-xl max-h-[92vh] overflow-y-auto p-6 shadow-xl relative text-slate-900">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5 pb-3 border-b border-slate-100">
          <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-900 flex items-center justify-center shrink-0">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Programar Salida a Campo</h3>
            <p className="text-xs text-slate-500">
              Asigna kits disponibles y fija las fechas del calendario logístico
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 font-medium mb-1">
              Nombre del Evento:
            </label>
            <input
              type="text"
              required
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              placeholder="Ej. Concierto Filarmónica / Festival Primavera..."
              className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-slate-800 text-xs shadow-2xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-medium mb-1">
                Cliente / Productora:
              </label>
              <input
                type="text"
                value={client}
                onChange={(e) => setClient(e.target.value)}
                placeholder="Ej. Productora Live"
                className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-slate-800 text-xs shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">
                Locación / Venue:
              </label>
              <input
                type="text"
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                placeholder="Ej. Foro Principal / Hotel W"
                className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-slate-800 text-xs shadow-2xs"
              />
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <div>
              <label className="block text-slate-700 font-medium mb-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-600" />
                <span>Fecha de Salida:</span>
              </label>
              <input
                type="date"
                required
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-900 focus:outline-none focus:border-slate-800 text-xs font-mono shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-600" />
                <span>Fecha Estimada Retorno:</span>
              </label>
              <input
                type="date"
                required
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-900 focus:outline-none focus:border-slate-800 text-xs font-mono shadow-2xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-medium mb-1">
              Responsable de Salida:
            </label>
            <input
              type="text"
              required
              value={operatorLead}
              onChange={(e) => setOperatorLead(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-slate-800 text-xs shadow-2xs"
            />
          </div>

          {/* Kit Selection */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-slate-700 font-medium">
                Kits Disponibles ({selectedKitIds.length} seleccionados):
              </label>
            </div>

            {availableKits.length === 0 ? (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-xs">
                No hay kits disponibles en este momento.
              </div>
            ) : (
              <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1 border border-slate-200 rounded-lg p-2 bg-slate-50">
                {availableKits.map((kit) => {
                  const isChecked = selectedKitIds.includes(kit.id);
                  return (
                    <label
                      key={kit.id}
                      onClick={() => toggleKitSelection(kit.id)}
                      className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors text-xs ${
                        isChecked
                          ? 'bg-white border border-slate-400 text-slate-900 shadow-2xs'
                          : 'bg-white/60 hover:bg-white text-slate-700 border border-slate-200/60'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                            isChecked
                              ? 'bg-slate-900 border-slate-900 text-white'
                              : 'border-slate-300 bg-white'
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <div>
                          <span className="font-semibold text-slate-900">{kit.name}</span>
                          <span className="text-[11px] text-slate-500 ml-1.5 font-mono">({kit.sku})</span>
                        </div>
                      </div>
                      <span className="font-mono text-[11px] text-slate-500">
                        {kit.currentCycles}/{kit.cycleThreshold} c.
                      </span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-slate-700 font-medium mb-1">
              Notas Logísticas:
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Instrucciones para rampa o precauciones..."
              className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-slate-800 text-xs shadow-2xs"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:text-slate-900 rounded-lg transition-colors font-medium text-xs cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={selectedKitIds.length === 0}
              className={`px-4 py-2 font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs text-xs ${
                selectedKitIds.length > 0
                  ? 'bg-slate-900 hover:bg-slate-800 text-white cursor-pointer'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Truck className="w-4 h-4 stroke-[2.5]" />
              <span>Guardar Salida</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
