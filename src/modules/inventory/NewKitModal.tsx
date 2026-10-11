import React, { useState } from 'react';
import { EquipmentCategory, Kit, KitComponentItem } from '../../types/elkm';
import { X, Plus, Trash2, PackageCheck, Layers } from 'lucide-react';
import { FirebaseFileUpload } from '../../shared/components/FirebaseFileUpload';

interface NewKitModalProps {
  onClose: () => void;
  onAddKit: (newKit: Kit) => void;
}

export const NewKitModal: React.FC<NewKitModalProps> = ({ onClose, onAddKit }) => {
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState<EquipmentCategory>('Audio');
  const [location, setLocation] = useState('Bahía Audio A-05');
  const [cycleThreshold, setCycleThreshold] = useState<number>(50);
  const [specs, setSpecs] = useState('');
  
  // Firebase Storage file states
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
  const [manualUrl, setManualUrl] = useState<string | undefined>(undefined);

  // Dynamic initial components builder
  const [components, setComponents] = useState<KitComponentItem[]>([
    { id: '1', name: 'Unidad Principal / Chasis', quantity: 1, serialOrSpec: 'Principal' },
    { id: '2', name: 'Flightcase / Maletín de Transporte', quantity: 1, serialOrSpec: 'Case Pro' },
    { id: '3', name: 'Juego de Cables de Potencia y Señal', quantity: 2, serialOrSpec: 'Neutrik PowerCON / XLR' },
  ]);

  const [newCompName, setNewCompName] = useState('');
  const [newCompQty, setNewCompQty] = useState(1);
  const [newCompSpec, setNewCompSpec] = useState('');

  const handleAddComponent = () => {
    if (!newCompName.trim()) return;
    setComponents([
      ...components,
      {
        id: `comp-${Date.now()}`,
        name: newCompName.trim(),
        quantity: Math.max(1, newCompQty),
        serialOrSpec: newCompSpec.trim() || 'Estándar',
      },
    ]);
    setNewCompName('');
    setNewCompQty(1);
    setNewCompSpec('');
  };

  const handleRemoveComponent = (id: string) => {
    setComponents(components.filter((c) => c.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const id = `KIT-${Date.now().toString().slice(-4)}`;
    const finalSku = sku.trim() || `ELKM-${category.slice(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;

    const newKit: Kit = {
      id,
      sku: finalSku,
      name: name.trim(),
      category,
      location: location.trim() || 'Bodega Central',
      currentCycles: 0,
      cycleThreshold: Math.max(5, cycleThreshold),
      status: 'disponible',
      specs: specs.trim() || `${name.trim()} con ${components.length} componentes inventariados.`,
      components,
      lastEventName: 'Alta Inicial en Bodega',
      lastReturnDate: new Date().toISOString().replace('T', ' ').slice(0, 16),
      lastTriageResult: 'nuevo',
      serviceHistory: [],
      imageUrl,
      manualUrl,
      notes: 'Kit registrado con soporte de almacenamiento en Firebase Storage.',
    };

    onAddKit(newKit);
    onClose();
  };

  const categories: EquipmentCategory[] = [
    'Iluminación',
    'Audio',
    'Video & Pantallas',
    'Efectos Especiales',
    'Estructuras & Rigging',
  ];

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
            <PackageCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Alta de Kit Personalizado</h3>
            <p className="text-xs text-slate-500">
              Registra equipamiento flexible con archivos adjuntos en Firebase Storage
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {/* Main Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-slate-700 font-medium mb-1">
                Nombre del Kit:
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej. Kit Sonorización Portátil 1000W, Consola Broadcast..."
                className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-slate-800 text-xs shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">
                Categoría:
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as EquipmentCategory)}
                className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-slate-800 text-xs shadow-2xs"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">
                Código SKU / Barras:
              </label>
              <input
                type="text"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="Ej. ELKM-AUD-045 (Autogenerado)"
                className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-slate-800 text-xs shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">
                Ubicación en Bodega:
              </label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Ej. Rack A-10 / Muelle 2"
                className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-slate-800 text-xs shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">
                Umbral Límite de Ciclos:
              </label>
              <input
                type="number"
                min={5}
                max={500}
                required
                value={cycleThreshold}
                onChange={(e) => setCycleThreshold(Number(e.target.value))}
                className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-slate-800 text-xs font-mono shadow-2xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-medium mb-1">
              Descripción General / Especificaciones:
            </label>
            <textarea
              rows={2}
              value={specs}
              onChange={(e) => setSpecs(e.target.value)}
              placeholder="Detalla potencia, conectividad o requisitos de transporte..."
              className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-slate-800 text-xs shadow-2xs"
            />
          </div>

          {/* Firebase Storage File Uploads */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-slate-100">
            <FirebaseFileUpload
              label="Foto / Portada del Kit"
              directory="kits"
              accept="image/*"
              value={imageUrl}
              onChange={setImageUrl}
              helperText="Imagen JPG, PNG o WebP (Firebase Storage)"
            />

            <FirebaseFileUpload
              label="Ficha Técnica / Manual (PDF)"
              directory="manuals"
              accept="application/pdf,image/*"
              value={manualUrl}
              onChange={setManualUrl}
              helperText="Documento de especificaciones PDF"
            />
          </div>

          {/* Dynamic Component Builder */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-slate-600" />
                <span>Componentes Iniciales ({components.length}):</span>
              </span>
            </div>

            {/* List */}
            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
              {components.map((comp) => (
                <div
                  key={comp.id}
                  className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-slate-900 font-semibold">x{comp.quantity}</span>
                    <span className="text-slate-800 font-medium">{comp.name}</span>
                    {comp.serialOrSpec && (
                      <span className="text-[11px] text-slate-500 font-mono">({comp.serialOrSpec})</span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveComponent(comp.id)}
                    className="text-slate-400 hover:text-rose-600 p-1 transition-colors cursor-pointer"
                    title="Eliminar"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add component inline */}
            <div className="pt-2 border-t border-slate-200 grid grid-cols-12 gap-2 items-center">
              <input
                type="text"
                placeholder="Nombre componente..."
                value={newCompName}
                onChange={(e) => setNewCompName(e.target.value)}
                className="col-span-6 bg-white border border-slate-300 rounded p-1.5 text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:border-slate-800 shadow-2xs"
              />
              <input
                type="number"
                min={1}
                value={newCompQty}
                onChange={(e) => setNewCompQty(Number(e.target.value))}
                className="col-span-2 bg-white border border-slate-300 rounded p-1.5 text-slate-900 text-xs font-mono text-center focus:outline-none focus:border-slate-800 shadow-2xs"
                placeholder="Cant"
              />
              <input
                type="text"
                placeholder="Serie/Esp."
                value={newCompSpec}
                onChange={(e) => setNewCompSpec(e.target.value)}
                className="col-span-3 bg-white border border-slate-300 rounded p-1.5 text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:border-slate-800 shadow-2xs"
              />
              <button
                type="button"
                onClick={handleAddComponent}
                className="col-span-1 p-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
                title="Agregar"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
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
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs text-xs cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Guardar Kit</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
