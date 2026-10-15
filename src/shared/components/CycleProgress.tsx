import React from 'react';

interface CycleProgressProps {
  current: number;
  threshold: number;
  showPercent?: boolean;
  compact?: boolean;
}

export const CycleProgress: React.FC<CycleProgressProps> = ({
  current,
  threshold,
  showPercent = true,
  compact = false,
}) => {
  const percentage = Math.round((current / Math.max(1, threshold)) * 100);
  const isOverThreshold = current >= threshold;
  const isWarningZone = !isOverThreshold && current / threshold >= 0.8;

  const barColor = isOverThreshold
    ? 'bg-rose-500'
    : isWarningZone
    ? 'bg-amber-500'
    : 'bg-emerald-600';

  const textColor = isOverThreshold
    ? 'text-rose-600 font-semibold'
    : isWarningZone
    ? 'text-amber-700 font-medium'
    : 'text-slate-700';

  return (
    <div className="w-full space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-500">Ciclos de uso:</span>
        <div className="flex items-center gap-1.5">
          <span className={`font-mono text-xs tabular-nums ${textColor}`}>
            {current} / {threshold}
          </span>
          {showPercent && (
            <span className="font-mono text-[11px] tabular-nums text-slate-500">
              ({percentage}%)
            </span>
          )}
        </div>
      </div>

      {/* Hairline Progress Bar */}
      <div className={`w-full bg-slate-200 rounded-full overflow-hidden ${compact ? 'h-1' : 'h-1.5'}`}>
        <div
          className={`h-full transition-all duration-300 ${barColor}`}
          style={{ width: `${Math.min(100, percentage)}%` }}
        />
      </div>

      {isOverThreshold && !compact && (
        <span className="text-[11px] text-rose-600 font-medium block">
          Umbral preventivo superado
        </span>
      )}
    </div>
  );
};
