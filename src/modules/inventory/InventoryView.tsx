import React, { useState, useMemo } from 'react';
import { Kit, EquipmentCategory } from '../../types/elkm';
import { StatusBadge } from '../../shared/components/StatusBadge';
import { CycleProgress } from '../../shared/components/CycleProgress';
import { 
  Search, 
  MapPin, 
  Calendar, 
  RotateCcw, 
  Wrench, 
  Info, 
  LayoutGrid, 
  Table as TableIcon,
  Plus,
  Layers
} from 'lucide-react';

interface InventoryViewProps {
  kits: Kit[];
  onSelectKitForReturn: (kitId: string) => void;
  onOpenKitDetails: (kit: Kit) => void;
  onSendToMaintenance: (kitId: string) => void;
  onOpenNewKit?: () => void;
}

export const InventoryView: React.FC<InventoryViewProps> = ({
  kits,
  onSelectKitForReturn,
  onOpenKitDetails,
  onSendToMaintenance,
  onOpenNewKit,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  const filteredKits = useMemo(() => {
    return kits.filter((kit) => {
      const matchesSearch =
        kit.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        kit.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        kit.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        kit.specs.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === 'all' || kit.status === statusFilter;

      const matchesCategory =
        categoryFilter === 'all' || kit.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [kits, searchTerm, statusFilter, categoryFilter]);

  // Metrics
  const totalCount = kits.length;
  const disponibleCount = kits.filter((k) => k.status === 'disponible').length;
  const enCampoCount = kits.filter((k) => k.status === 'en_evento').length;
  const mantenimientoCount = kits.filter((k) => k.status === 'mantenimiento').length;
  const bloqueadoCount = kits.filter((k) => k.status === 'bloqueado').length;
  const overThresholdCount = kits.filter((k) => k.currentCycles >= k.cycleThreshold).length;

  const categories: EquipmentCategory[] = [
    'Iluminación',
    'Audio',
    'Video & Pantallas',
    'Efectos Especiales',
    'Estructuras & Rigging',
  ];

  return (
    <div className="space-y-6">
      
      {/* Sober Minimalist Metrics Ribbon */}
      <div className="flex flex-wrap items-center justify-between gap-y-2 text-xs py-2.5 px-1 border-b border-slate-200 text-slate-600">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
          <span>Total: <strong className="font-mono text-slate-900">{totalCount}</strong></span>
          <span className="text-slate-300">·</span>
          <span>Disponibles: <strong className="font-mono text-emerald-700">{disponibleCount}</strong></span>
          <span className="text-slate-300">·</span>
          <span>En Campo: <strong className="font-mono text-sky-700">{enCampoCount}</strong></span>
          <span className="text-slate-300">·</span>
          <span>Mantenimiento: <strong className="font-mono text-amber-700">{mantenimientoCount}</strong></span>
          <span className="text-slate-300">·</span>
          <span>Bloqueados: <strong className="font-mono text-rose-700">{bloqueadoCount}</strong></span>
        </div>

        {overThresholdCount > 0 && (
          <span className="text-rose-700 font-mono text-[11px] font-semibold bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
            {overThresholdCount} equipos en umbral crítico
          </span>
        )}
      </div>

      {/* Control Bar: Search & Clean Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por kit, modelo o SKU..."
            className="w-full bg-white border border-slate-300 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-800 transition-colors shadow-2xs"
          />
        </div>

        {/* Filters & Actions */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Status selector */}
          <div className="flex items-center gap-1 bg-slate-100 p-0.5 border border-slate-200 rounded-lg text-xs">
            {[
              { id: 'all', label: 'Todos' },
              { id: 'disponible', label: 'Disponibles' },
              { id: 'en_evento', label: 'En Campo' },
              { id: 'mantenimiento', label: 'Taller' },
              { id: 'bloqueado', label: 'Bloqueados' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer text-[11px] ${
                  statusFilter === tab.id
                    ? 'bg-white text-slate-900 font-semibold shadow-xs border border-slate-200/60'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Category Dropdown */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-white border border-slate-300 text-slate-700 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-slate-800 shadow-2xs"
          >
            <option value="all">Categorías (Todas)</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          {/* New Kit Button */}
          {onOpenNewKit && (
            <button
              onClick={onOpenNewKit}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1 cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Crear Kit</span>
            </button>
          )}

          {/* View toggle */}
          <div className="flex items-center bg-slate-100 p-0.5 border border-slate-200 rounded-lg">
            <button
              onClick={() => setViewMode('cards')}
              title="Tarjetas"
              className={`p-1.5 rounded transition-colors ${
                viewMode === 'cards' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              title="Tabla"
              className={`p-1.5 rounded transition-colors ${
                viewMode === 'table' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>

      {/* Grid or Table */}
      {filteredKits.length === 0 ? (
        <div className="text-center py-16 bg-white border border-slate-200 rounded-xl">
          <p className="text-slate-500 text-xs">No se encontraron equipos con los filtros seleccionados.</p>
        </div>
      ) : viewMode === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredKits.map((kit) => (
            <div
              key={kit.id}
              className="bg-white border border-slate-200/90 rounded-xl p-4 flex flex-col justify-between hover:border-slate-300 transition-colors shadow-xs"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <div className="text-[11px] font-mono text-slate-500">
                      {kit.sku} · {kit.category}
                    </div>
                    <h3 className="text-sm font-semibold text-slate-900 mt-0.5">
                      {kit.name}
                    </h3>
                  </div>
                  <StatusBadge status={kit.status} size="sm" />
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 mb-3 leading-relaxed">
                  {kit.specs}
                </p>

                {/* Progress */}
                <div className="mb-3 bg-slate-50 p-2.5 rounded-lg border border-slate-200/80">
                  <CycleProgress
                    current={kit.currentCycles}
                    threshold={kit.cycleThreshold}
                  />
                </div>

                {/* Metadata */}
                <div className="space-y-1 text-xs text-slate-500 mb-4">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                    <span className="text-slate-600">{kit.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3 h-3 text-slate-400 shrink-0" />
                    <span className="truncate">Último: {kit.lastEventName}</span>
                  </div>
                  {kit.components && (
                    <div className="flex items-center gap-1.5 pt-0.5">
                      <Layers className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="text-slate-500">{kit.components.length} componentes inventariados</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => onOpenKitDetails(kit)}
                  className="px-2 py-1 text-xs text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-1 cursor-pointer font-medium"
                >
                  <Info className="w-3.5 h-3.5" />
                  <span>Ficha</span>
                </button>

                <div className="flex items-center gap-1.5">
                  {kit.status !== 'mantenimiento' && kit.status !== 'bloqueado' && (
                    <button
                      onClick={() => onSendToMaintenance(kit.id)}
                      className="px-2 py-1 text-xs text-amber-800 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded transition-colors flex items-center gap-1 cursor-pointer"
                      title="Enviar a Taller"
                    >
                      <Wrench className="w-3 h-3" />
                      <span>Taller</span>
                    </button>
                  )}

                  <button
                    onClick={() => onSelectKitForReturn(kit.id)}
                    className="px-2.5 py-1 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded transition-colors flex items-center gap-1 cursor-pointer shadow-2xs"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Retorno (+1)</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="overflow-x-auto bg-white border border-slate-200 rounded-xl shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
              <tr>
                <th className="px-3.5 py-2.5 font-semibold">Kit / SKU</th>
                <th className="px-3.5 py-2.5 font-semibold">Categoría</th>
                <th className="px-3.5 py-2.5 font-semibold">Estado</th>
                <th className="px-3.5 py-2.5 font-semibold w-48">Ciclos</th>
                <th className="px-3.5 py-2.5 font-semibold">Ubicación</th>
                <th className="px-3.5 py-2.5 font-semibold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredKits.map((kit) => (
                <tr key={kit.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-3.5 py-2.5">
                    <div className="font-semibold text-slate-900">{kit.name}</div>
                    <div className="font-mono text-[11px] text-slate-500">{kit.sku}</div>
                  </td>
                  <td className="px-3.5 py-2.5 text-slate-600">{kit.category}</td>
                  <td className="px-3.5 py-2.5">
                    <StatusBadge status={kit.status} size="sm" />
                  </td>
                  <td className="px-3.5 py-2.5">
                    <CycleProgress
                      current={kit.currentCycles}
                      threshold={kit.cycleThreshold}
                      compact={true}
                    />
                  </td>
                  <td className="px-3.5 py-2.5 text-slate-600">{kit.location}</td>
                  <td className="px-3.5 py-2.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onOpenKitDetails(kit)}
                        className="p-1 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
                        title="Ver detalles"
                      >
                        <Info className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onSelectKitForReturn(kit.id)}
                        className="px-2 py-0.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded transition-colors cursor-pointer shadow-2xs"
                      >
                        Retornar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
};
