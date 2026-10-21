import React, { useState } from 'react';
import { EquipmentCategory, Kit, KitComponentItem } from '../../types/elkm';
import { 
  X, 
  Plus, 
  Trash2, 
  PackageCheck, 
  Layers, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles, 
  FileText, 
  Camera, 
  MapPin, 
  Barcode, 
  RotateCw,
  Info
} from 'lucide-react';
import { FirebaseFileUpload } from '../../shared/components/FirebaseFileUpload';

interface NewKitModalProps {
  onClose: () => void;
  onAddKit: (newKit: Kit) => void;
}

// Preset images by category to assist quick registration if user has no image file handy
const CATEGORY_PRESET_IMAGES: Record<EquipmentCategory, string> = {
  'Audio': 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600&auto=format&fit=crop&q=80',
  'Iluminación': 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&auto=format&fit=crop&q=80',
  'Video & Pantallas': 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&auto=format&fit=crop&q=80',
  'Efectos Especiales': 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&auto=format&fit=crop&q=80',
  'Estructuras & Rigging': 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=600&auto=format&fit=crop&q=80',
};

const CATEGORIES: EquipmentCategory[] = [
  'Iluminación',
  'Audio',
  'Video & Pantallas',
  'Efectos Especiales',
  'Estructuras & Rigging',
];

export const NewKitModal: React.FC<NewKitModalProps> = ({ onClose, onAddKit }) => {
  // Form values (start empty or unselected to force deliberate user input)
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState<EquipmentCategory | ''>('');
  const [location, setLocation] = useState('');
  const [cycleThreshold, setCycleThreshold] = useState<string>('');
  const [specs, setSpecs] = useState('');
  
  // Storage files
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
  const [manualUrl, setManualUrl] = useState<string | undefined>(undefined);
  const [noManualNeeded, setNoManualNeeded] = useState(false);

  // Components list (starts empty to enforce adding real equipment parts)
  const [components, setComponents] = useState<KitComponentItem[]>([]);

  // Inline component builder state
  const [newCompName, setNewCompName] = useState('');
  const [newCompQty, setNewCompQty] = useState(1);
  const [newCompSpec, setNewCompSpec] = useState('');
  const [componentError, setComponentError] = useState<string | null>(null);

  // Validation errors map
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  // Quick generator for SKU helper
  const handleGenerateSku = () => {
    const catCode = category ? category.slice(0, 3).toUpperCase() : 'GEN';
    const randomNum = Math.floor(100 + Math.random() * 900);
    const suggestedSku = `ELKM-${catCode}-${randomNum}`;
    setSku(suggestedSku);
    if (errors.sku) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.sku;
        return next;
      });
    }
  };

  // Quick component templates helper
  const handleLoadTemplateComponents = () => {
    const selectedCat = category || 'Audio';
    let templateItems: KitComponentItem[] = [];

    switch (selectedCat) {
      case 'Audio':
        templateItems = [
          { id: `c-${Date.now()}-1`, name: 'Unidad de Potencia / Mezcladora', quantity: 1, serialOrSpec: 'Chasis Principal' },
          { id: `c-${Date.now()}-2`, name: 'Cableado XLR / PowerCON', quantity: 4, serialOrSpec: 'Neutrik Pro 10m' },
          { id: `c-${Date.now()}-3`, name: 'Flightcase Rígido con Foam', quantity: 1, serialOrSpec: 'Case Shock-Mount' },
        ];
        break;
      case 'Iluminación':
        templateItems = [
          { id: `c-${Date.now()}-1`, name: 'Cabezal Móvil LED / Spot', quantity: 2, serialOrSpec: 'IP65 DMX512' },
          { id: `c-${Date.now()}-2`, name: 'Garra de Anclaje Rápido & Guaya', quantity: 2, serialOrSpec: 'C-Clamp 50kg' },
          { id: `c-${Date.now()}-3`, name: 'Cable DMX 5 pines + PowerCON', quantity: 2, serialOrSpec: 'Híbrido 5m' },
        ];
        break;
      case 'Video & Pantallas':
        templateItems = [
          { id: `c-${Date.now()}-1`, name: 'Módulo Gabinete LED P3.9', quantity: 4, serialOrSpec: '500x500mm Die-Cast' },
          { id: `c-${Date.now()}-2`, name: 'Tarjeta Receptora Novastar', quantity: 4, serialOrSpec: 'MRV336' },
          { id: `c-${Date.now()}-3`, name: 'Cables Interconexión Datos & AC', quantity: 4, serialOrSpec: 'EtherCON / PowerCON' },
        ];
        break;
      case 'Efectos Especiales':
        templateItems = [
          { id: `c-${Date.now()}-1`, name: 'Máquina Sparkular / Humo Bajo', quantity: 1, serialOrSpec: 'DMX Control Unit' },
          { id: `c-${Date.now()}-2`, name: 'Mando a Distancia Inalámbrico', quantity: 1, serialOrSpec: 'RF 433MHz' },
          { id: `c-${Date.now()}-3`, name: 'Cable de Alimentación Blindado', quantity: 1, serialOrSpec: 'PowerCON True1' },
        ];
        break;
      default:
        templateItems = [
          { id: `c-${Date.now()}-1`, name: 'Tramo Truss Cuadrado 2m', quantity: 2, serialOrSpec: 'Aluminio F34 290mm' },
          { id: `c-${Date.now()}-2`, name: 'Kit Conectores Cónicos & Pines', quantity: 8, serialOrSpec: 'Bulones Acero Cónico' },
          { id: `c-${Date.now()}-3`, name: 'Base Pesada de Acero', quantity: 1, serialOrSpec: 'Baseplate 800x800mm' },
        ];
    }

    setComponents(templateItems);
    if (errors.components) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.components;
        return next;
      });
    }
  };

  // Add component inline
  const handleAddComponent = () => {
    setComponentError(null);
    const cleanName = newCompName.trim();
    const cleanSpec = newCompSpec.trim();

    if (!cleanName) {
      setComponentError('Debes ingresar el nombre del componente.');
      return;
    }

    if (cleanName.length < 2) {
      setComponentError('El nombre del componente debe tener al menos 2 caracteres.');
      return;
    }

    if (!newCompQty || newCompQty < 1) {
      setComponentError('La cantidad debe ser mínimo 1 unidad.');
      return;
    }

    if (!cleanSpec) {
      setComponentError('Debes ingresar el número de serie, modelo o especificación técnica.');
      return;
    }

    const newComponent: KitComponentItem = {
      id: `comp-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: cleanName,
      quantity: Math.floor(newCompQty),
      serialOrSpec: cleanSpec,
    };

    setComponents((prev) => [...prev, newComponent]);
    setNewCompName('');
    setNewCompQty(1);
    setNewCompSpec('');

    if (errors.components) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.components;
        return next;
      });
    }
  };

  const handleRemoveComponent = (id: string) => {
    const updated = components.filter((c) => c.id !== id);
    setComponents(updated);
    if (updated.length === 0 && hasAttemptedSubmit) {
      setErrors((prev) => ({
        ...prev,
        components: 'El kit debe contener al menos 1 componente físico registrado.',
      }));
    }
  };

  // Validation engine
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // 1. Nombre
    if (!name.trim()) {
      newErrors.name = 'El nombre del kit es obligatorio.';
    } else if (name.trim().length < 4) {
      newErrors.name = 'El nombre debe tener al menos 4 caracteres descriptivos.';
    }

    // 2. Categoría
    if (!category) {
      newErrors.category = 'Debes seleccionar una categoría de equipamiento.';
    }

    // 3. SKU
    if (!sku.trim()) {
      newErrors.sku = 'El código SKU o de barras es obligatorio para control de inventario.';
    } else if (sku.trim().length < 3) {
      newErrors.sku = 'El código SKU debe tener al menos 3 caracteres alfanuméricos.';
    }

    // 4. Ubicación
    if (!location.trim()) {
      newErrors.location = 'La ubicación física en bodega es obligatoria (ej. Bahía A-05 / Rack 3).';
    } else if (location.trim().length < 3) {
      newErrors.location = 'Ingresa una ubicación clara en bodega (mínimo 3 caracteres).';
    }

    // 5. Umbral de Ciclos
    const thresholdNum = Number(cycleThreshold);
    if (!cycleThreshold || isNaN(thresholdNum)) {
      newErrors.cycleThreshold = 'Debes ingresar el número de ciclos límite antes de mantenimiento.';
    } else if (!Number.isInteger(thresholdNum) || thresholdNum < 5 || thresholdNum > 500) {
      newErrors.cycleThreshold = 'El umbral de ciclos debe ser un número entero entre 5 y 500.';
    }

    // 6. Especificaciones Técnicas
    if (!specs.trim()) {
      newErrors.specs = 'Las especificaciones técnicas y operativas son obligatorias.';
    } else if (specs.trim().length < 10) {
      newErrors.specs = 'Detalla las especificaciones del kit (mínimo 10 caracteres).';
    }

    // 7. Foto / Portada del Kit
    if (!imageUrl || !imageUrl.trim()) {
      newErrors.imageUrl = 'Debes adjuntar o seleccionar una foto de portada para el kit.';
    }

    // 8. Ficha Técnica / Manual (PDF)
    if (!noManualNeeded && (!manualUrl || !manualUrl.trim())) {
      newErrors.manualUrl = 'Adjunta el manual/ficha técnica en PDF o marca la casilla si el equipo no posee manual.';
    }

    // 9. Componentes físicos
    if (components.length === 0) {
      newErrors.components = 'Debes registrar al menos 1 componente físico (chasis, cables, maletín, etc.).';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setHasAttemptedSubmit(true);

    const isValid = validateForm();
    if (!isValid) {
      // Scroll to top of modal to display global errors alert
      const modalContainer = document.getElementById('new-kit-modal-container');
      if (modalContainer) {
        modalContainer.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }

    const id = `KIT-${Date.now().toString().slice(-4)}`;
    const finalThreshold = Number(cycleThreshold);

    const newKit: Kit = {
      id,
      sku: sku.trim().toUpperCase(),
      name: name.trim(),
      category: category as EquipmentCategory,
      location: location.trim(),
      currentCycles: 0,
      cycleThreshold: finalThreshold,
      status: 'disponible',
      specs: specs.trim(),
      components,
      lastEventName: 'Alta Inicial en Bodega',
      lastReturnDate: new Date().toISOString().replace('T', ' ').slice(0, 16),
      lastTriageResult: 'nuevo',
      serviceHistory: [],
      imageUrl: imageUrl?.trim(),
      manualUrl: noManualNeeded ? undefined : manualUrl?.trim(),
      notes: `Kit registrado formalmente con ${components.length} componentes inventariados y validación estricta de campos.`,
    };

    onAddKit(newKit);
    onClose();
  };

  // Calculate completion percentage
  const totalFields = 8;
  let completedFields = 0;
  if (name.trim().length >= 4) completedFields++;
  if (category) completedFields++;
  if (sku.trim().length >= 3) completedFields++;
  if (location.trim().length >= 3) completedFields++;
  if (cycleThreshold && Number(cycleThreshold) >= 5 && Number(cycleThreshold) <= 500) completedFields++;
  if (specs.trim().length >= 10) completedFields++;
  if (imageUrl) completedFields++;
  if (components.length > 0) completedFields++;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        id="new-kit-modal-container"
        className="bg-white border border-slate-200 rounded-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto p-6 shadow-2xl relative text-slate-900"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          title="Cerrar ventana"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-xs">
            <PackageCheck className="w-5 h-5" />
          </div>
          <div className="pr-8">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900">Alta de Nuevo Kit Técnico</h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-800 border border-amber-300">
                Validación Estricta Activa
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Todos los campos marcados con asterisco (<span className="text-rose-500 font-bold">*</span>) son obligatorios para garantizar la integridad en Firestore y Storage.
            </p>
          </div>
        </div>

        {/* Progress Bar of Completion */}
        <div className="mb-4 bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-600 font-medium">Progreso del Formulario:</span>
            <span className="font-bold text-slate-900 font-mono">{completedFields} / {totalFields}</span>
          </div>
          <div className="flex-1 max-w-xs bg-slate-200 h-2 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-300 rounded-full ${
                completedFields === totalFields ? 'bg-emerald-500' : 'bg-slate-800'
              }`}
              style={{ width: `${(completedFields / totalFields) * 100}%` }}
            />
          </div>
          <span className="text-[11px] font-semibold text-slate-500">
            {completedFields === totalFields ? (
              <span className="text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Completo
              </span>
            ) : (
              `${Math.round((completedFields / totalFields) * 100)}%`
            )}
          </span>
        </div>

        {/* Global Error Banner */}
        {hasAttemptedSubmit && Object.keys(errors).length > 0 && (
          <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-900 animate-in fade-in duration-200">
            <div className="flex items-center gap-2 font-bold text-rose-800 mb-1.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>Por favor completa o corrige los siguientes campos obligatorios:</span>
            </div>
            <ul className="list-disc pl-5 space-y-0.5 text-[11px] text-rose-700">
              {Object.entries(errors).map(([fieldKey, errorMsg]) => (
                <li key={fieldKey}>{errorMsg}</li>
              ))}
            </ul>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-4 text-xs">
          
          {/* Main Kit Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            
            {/* 1. Name */}
            <div className="sm:col-span-2">
              <div className="flex items-center justify-between mb-1">
                <label className="text-slate-800 font-semibold">
                  Nombre Oficial del Kit <span className="text-rose-500">*</span>
                </label>
                {name.trim().length >= 4 && (
                  <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Válido
                  </span>
                )}
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) {
                    setErrors((prev) => {
                      const next = { ...prev };
                      delete next.name;
                      return next;
                    });
                  }
                }}
                placeholder="Ej. Kit Sonorización Portátil 1000W / Línea Array VTX A8..."
                className={`w-full bg-white border rounded-lg p-2.5 text-slate-900 focus:outline-none text-xs shadow-2xs transition-colors ${
                  errors.name 
                    ? 'border-rose-400 bg-rose-50/20 focus:border-rose-500 focus:ring-1 focus:ring-rose-500' 
                    : 'border-slate-300 focus:border-slate-800'
                }`}
              />
              {errors.name && (
                <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3 h-3 shrink-0" /> {errors.name}
                </p>
              )}
            </div>

            {/* 2. Category */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-slate-800 font-semibold">
                  Categoría Técnica <span className="text-rose-500">*</span>
                </label>
                {category && (
                  <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Válida
                  </span>
                )}
              </div>
              <select
                value={category}
                onChange={(e) => {
                  const val = e.target.value as EquipmentCategory | '';
                  setCategory(val);
                  if (errors.category) {
                    setErrors((prev) => {
                      const next = { ...prev };
                      delete next.category;
                      return next;
                    });
                  }
                }}
                className={`w-full bg-white border rounded-lg p-2.5 text-slate-900 focus:outline-none text-xs shadow-2xs transition-colors cursor-pointer ${
                  errors.category 
                    ? 'border-rose-400 bg-rose-50/20 focus:border-rose-500' 
                    : 'border-slate-300 focus:border-slate-800'
                }`}
              >
                <option value="" disabled>— Selecciona una Categoría Técnica —</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              {errors.category && (
                <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3 h-3 shrink-0" /> {errors.category}
                </p>
              )}
            </div>

            {/* 3. SKU */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-slate-800 font-semibold flex items-center gap-1">
                  <Barcode className="w-3.5 h-3.5 text-slate-500" />
                  <span>Código SKU / Barras <span className="text-rose-500">*</span></span>
                </label>
                <button
                  type="button"
                  onClick={handleGenerateSku}
                  className="text-[10px] text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-1.5 py-0.5 rounded flex items-center gap-1 transition-colors cursor-pointer"
                  title="Sugerir SKU basado en categoría"
                >
                  <Sparkles className="w-3 h-3 text-amber-600" />
                  <span>Sugerir</span>
                </button>
              </div>
              <input
                type="text"
                value={sku}
                onChange={(e) => {
                  setSku(e.target.value);
                  if (errors.sku) {
                    setErrors((prev) => {
                      const next = { ...prev };
                      delete next.sku;
                      return next;
                    });
                  }
                }}
                placeholder="Ej. ELKM-AUD-450"
                className={`w-full bg-white border rounded-lg p-2.5 text-slate-900 font-mono focus:outline-none text-xs shadow-2xs transition-colors uppercase ${
                  errors.sku 
                    ? 'border-rose-400 bg-rose-50/20 focus:border-rose-500 focus:ring-1 focus:ring-rose-500' 
                    : 'border-slate-300 focus:border-slate-800'
                }`}
              />
              {errors.sku && (
                <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3 h-3 shrink-0" /> {errors.sku}
                </p>
              )}
            </div>

            {/* 4. Location */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-slate-800 font-semibold flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  <span>Ubicación en Bodega <span className="text-rose-500">*</span></span>
                </label>
                {location.trim().length >= 3 && (
                  <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Válida
                  </span>
                )}
              </div>
              <input
                type="text"
                value={location}
                onChange={(e) => {
                  setLocation(e.target.value);
                  if (errors.location) {
                    setErrors((prev) => {
                      const next = { ...prev };
                      delete next.location;
                      return next;
                    });
                  }
                }}
                placeholder="Ej. Bahía Audio A-05 / Muelle 2"
                className={`w-full bg-white border rounded-lg p-2.5 text-slate-900 focus:outline-none text-xs shadow-2xs transition-colors ${
                  errors.location 
                    ? 'border-rose-400 bg-rose-50/20 focus:border-rose-500 focus:ring-1 focus:ring-rose-500' 
                    : 'border-slate-300 focus:border-slate-800'
                }`}
              />
              {errors.location && (
                <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3 h-3 shrink-0" /> {errors.location}
                </p>
              )}
            </div>

            {/* 5. Cycle Threshold */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-slate-800 font-semibold flex items-center gap-1">
                  <RotateCw className="w-3.5 h-3.5 text-slate-500" />
                  <span>Umbral Límite de Ciclos <span className="text-rose-500">*</span></span>
                </label>
                <span className="text-[10px] text-slate-500">(5 - 500 ciclos)</span>
              </div>
              <input
                type="number"
                min={5}
                max={500}
                value={cycleThreshold}
                onChange={(e) => {
                  setCycleThreshold(e.target.value);
                  if (errors.cycleThreshold) {
                    setErrors((prev) => {
                      const next = { ...prev };
                      delete next.cycleThreshold;
                      return next;
                    });
                  }
                }}
                placeholder="Ej. 50"
                className={`w-full bg-white border rounded-lg p-2.5 text-slate-900 font-mono focus:outline-none text-xs shadow-2xs transition-colors ${
                  errors.cycleThreshold 
                    ? 'border-rose-400 bg-rose-50/20 focus:border-rose-500 focus:ring-1 focus:ring-rose-500' 
                    : 'border-slate-300 focus:border-slate-800'
                }`}
              />
              {errors.cycleThreshold && (
                <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3 h-3 shrink-0" /> {errors.cycleThreshold}
                </p>
              )}
            </div>
          </div>

          {/* 6. Technical Specifications */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-slate-800 font-semibold">
                Descripción & Especificaciones Técnicas <span className="text-rose-500">*</span>
              </label>
              <span className="text-[10px] text-slate-500">
                {specs.trim().length} / mín. 10 caracteres
              </span>
            </div>
            <textarea
              rows={2}
              value={specs}
              onChange={(e) => {
                setSpecs(e.target.value);
                if (errors.specs) {
                  setErrors((prev) => {
                    const next = { ...prev };
                    delete next.specs;
                    return next;
                  });
                }
              }}
              placeholder="Detalla potencia, conectores, voltajes, dimensiones, requerimientos de transporte y seguridad..."
              className={`w-full bg-white border rounded-lg p-2.5 text-slate-900 focus:outline-none text-xs shadow-2xs transition-colors ${
                errors.specs 
                  ? 'border-rose-400 bg-rose-50/20 focus:border-rose-500 focus:ring-1 focus:ring-rose-500' 
                  : 'border-slate-300 focus:border-slate-800'
              }`}
            />
            {errors.specs && (
              <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3 h-3 shrink-0" /> {errors.specs}
              </p>
            )}
          </div>

          {/* 7 & 8: Files Upload in Firebase Storage */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="font-semibold text-slate-800 flex items-center gap-1.5 text-xs">
                <Camera className="w-3.5 h-3.5 text-slate-600" />
                <span>Archivos Técnicos en Firebase Storage</span>
              </span>
              {category && !imageUrl && (
                <button
                  type="button"
                  onClick={() => {
                    setImageUrl(CATEGORY_PRESET_IMAGES[category as EquipmentCategory]);
                    if (errors.imageUrl) {
                      setErrors((prev) => {
                        const next = { ...prev };
                        delete next.imageUrl;
                        return next;
                      });
                    }
                  }}
                  className="text-[11px] text-slate-700 hover:text-slate-950 bg-white border border-slate-300 hover:border-slate-400 px-2 py-0.5 rounded shadow-2xs transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3 text-amber-600" />
                  <span>Cargar foto de catálogo para {category}</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Image Upload */}
              <div className="space-y-1">
                <FirebaseFileUpload
                  label="Foto / Portada del Kit *"
                  directory="kits"
                  accept="image/*"
                  value={imageUrl}
                  onChange={(url) => {
                    setImageUrl(url);
                    if (errors.imageUrl) {
                      setErrors((prev) => {
                        const next = { ...prev };
                        delete next.imageUrl;
                        return next;
                      });
                    }
                  }}
                  helperText="Fotografía clara del equipo en rampa o bahía"
                />
                {errors.imageUrl && (
                  <p className="text-[11px] text-rose-600 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3 h-3 shrink-0" /> {errors.imageUrl}
                  </p>
                )}
              </div>

              {/* Manual Upload */}
              <div className="space-y-1.5">
                {!noManualNeeded ? (
                  <>
                    <FirebaseFileUpload
                      label="Ficha Técnica / Manual (PDF) *"
                      directory="manuals"
                      accept="application/pdf,image/*"
                      value={manualUrl}
                      onChange={(url) => {
                        setManualUrl(url);
                        if (errors.manualUrl) {
                          setErrors((prev) => {
                            const next = { ...prev };
                            delete next.manualUrl;
                            return next;
                          });
                        }
                      }}
                      helperText="Diagrama de conexión o manual de usuario en PDF"
                    />
                    {errors.manualUrl && (
                      <p className="text-[11px] text-rose-600 flex items-center gap-1 font-medium">
                        <AlertCircle className="w-3 h-3 shrink-0" /> {errors.manualUrl}
                      </p>
                    )}
                  </>
                ) : (
                  <div className="p-3 bg-white border border-slate-200 rounded-lg text-slate-500 text-xs flex items-center gap-2">
                    <Info className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>Registrado como kit sin manual físico disponible.</span>
                  </div>
                )}

                <div className="pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-[11px] text-slate-600 hover:text-slate-900 select-none">
                    <input
                      type="checkbox"
                      checked={noManualNeeded}
                      onChange={(e) => {
                        setNoManualNeeded(e.target.checked);
                        if (e.target.checked && errors.manualUrl) {
                          setErrors((prev) => {
                            const next = { ...prev };
                            delete next.manualUrl;
                            return next;
                          });
                        }
                      }}
                      className="rounded border-slate-300 text-slate-900 focus:ring-slate-800"
                    />
                    <span>Este equipo no requiere / no dispone de manual PDF</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* 9: Dynamic Component Builder (Strict validation: Minimum 1 item) */}
          <div className={`p-3.5 rounded-xl border space-y-3 transition-colors ${
            errors.components 
              ? 'bg-rose-50/30 border-rose-300' 
              : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="font-semibold text-slate-800 flex items-center gap-1.5 text-xs">
                <Layers className="w-3.5 h-3.5 text-slate-600" />
                <span>Componentes Físicos del Kit <span className="text-rose-500">*</span> ({components.length}):</span>
              </span>

              <button
                type="button"
                onClick={handleLoadTemplateComponents}
                className="text-[11px] text-slate-700 hover:text-slate-950 bg-white border border-slate-300 hover:border-slate-400 px-2 py-0.5 rounded shadow-2xs transition-colors cursor-pointer flex items-center gap-1"
                title="Cargar lista de componentes recomendados"
              >
                <Sparkles className="w-3 h-3 text-amber-600" />
                <span>Cargar plantilla de componentes para {category || 'Audio'}</span>
              </button>
            </div>

            {errors.components && (
              <p className="text-[11px] text-rose-600 flex items-center gap-1 font-medium bg-rose-100/60 p-2 rounded-lg border border-rose-200">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {errors.components}
              </p>
            )}

            {/* Components List */}
            {components.length > 0 ? (
              <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                {components.map((comp) => (
                  <div
                    key={comp.id}
                    className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200 text-xs shadow-2xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-slate-900 font-bold bg-slate-100 px-1.5 py-0.5 rounded text-[11px]">
                        x{comp.quantity}
                      </span>
                      <span className="text-slate-800 font-semibold">{comp.name}</span>
                      {comp.serialOrSpec && (
                        <span className="text-[11px] text-slate-500 font-mono">({comp.serialOrSpec})</span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveComponent(comp.id)}
                      className="text-slate-400 hover:text-rose-600 p-1 transition-colors cursor-pointer"
                      title="Eliminar componente"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-3 bg-white border border-dashed border-slate-300 rounded-lg text-center text-slate-400 text-xs">
                No hay componentes registrados aún. Agrega al menos 1 componente individual o usa la plantilla recomendada.
              </div>
            )}

            {/* Component Error notification */}
            {componentError && (
              <p className="text-[11px] text-rose-600 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3 h-3 shrink-0" /> {componentError}
              </p>
            )}

            {/* Add component inline inputs */}
            <div className="pt-2 border-t border-slate-200 grid grid-cols-12 gap-2 items-center">
              <input
                type="text"
                placeholder="Nombre (ej. Chasis, Cable, Lente)..."
                value={newCompName}
                onChange={(e) => {
                  setNewCompName(e.target.value);
                  setComponentError(null);
                }}
                className="col-span-5 bg-white border border-slate-300 rounded p-1.5 text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:border-slate-800 shadow-2xs"
              />
              <input
                type="number"
                min={1}
                value={newCompQty}
                onChange={(e) => {
                  setNewCompQty(Number(e.target.value));
                  setComponentError(null);
                }}
                className="col-span-2 bg-white border border-slate-300 rounded p-1.5 text-slate-900 text-xs font-mono text-center focus:outline-none focus:border-slate-800 shadow-2xs"
                placeholder="Cant"
              />
              <input
                type="text"
                placeholder="Serie o Especificación..."
                value={newCompSpec}
                onChange={(e) => {
                  setNewCompSpec(e.target.value);
                  setComponentError(null);
                }}
                className="col-span-4 bg-white border border-slate-300 rounded p-1.5 text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:border-slate-800 shadow-2xs"
              />
              <button
                type="button"
                onClick={handleAddComponent}
                className="col-span-1 p-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
                title="Agregar componente a la lista"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100">
            <span className="text-[11px] text-slate-500">
              {completedFields === totalFields ? (
                <span className="text-emerald-600 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Listo para guardar en Firestore
                </span>
              ) : (
                <span className="text-amber-700 font-medium">
                  Faltan {totalFields - completedFields} campos por completar
                </span>
              )}
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-slate-600 hover:text-slate-900 rounded-lg transition-colors font-medium text-xs cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className={`px-4 py-2 font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs text-xs cursor-pointer ${
                  completedFields === totalFields
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                    : 'bg-slate-900 hover:bg-slate-800 text-white'
                }`}
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Guardar Kit Completo</span>
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
};
