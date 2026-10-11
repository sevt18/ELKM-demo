import React from 'react';
import { KitStatus } from '../types/elkm';

interface StatusBadgeProps {
  status: KitStatus;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  if (status === 'disponible') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 font-medium rounded transition-colors ${
          size === 'sm'
            ? 'px-2 py-0.5 text-[11px] text-emerald-800 bg-emerald-50 border border-emerald-200'
            : 'px-2.5 py-0.5 text-xs text-emerald-800 bg-emerald-50 border border-emerald-200'
        }`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        <span>Disponible</span>
      </span>
    );
  }

  if (status === 'en_evento') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 font-medium rounded transition-colors ${
          size === 'sm'
            ? 'px-2 py-0.5 text-[11px] text-sky-800 bg-sky-50 border border-sky-200'
            : 'px-2.5 py-0.5 text-xs text-sky-800 bg-sky-50 border border-sky-200'
        }`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
        <span>En Campo</span>
      </span>
    );
  }

  if (status === 'mantenimiento') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 font-medium rounded transition-colors ${
          size === 'sm'
            ? 'px-2 py-0.5 text-[11px] text-amber-800 bg-amber-50 border border-amber-200'
            : 'px-2.5 py-0.5 text-xs text-amber-800 bg-amber-50 border border-amber-200'
        }`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
        <span>Mantenimiento</span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded transition-colors ${
        size === 'sm'
          ? 'px-2 py-0.5 text-[11px] text-rose-800 bg-rose-50 border border-rose-200'
          : 'px-2.5 py-0.5 text-xs text-rose-800 bg-rose-50 border border-rose-200'
      }`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
      <span>Bloqueado</span>
    </span>
  );
};
