import React from 'react';
import { Target, CheckCircle } from 'lucide-react';

interface ProgressBarProps {
  completedMinutes: number;
  totalMinutes: number;
  completedBlocksCount: number;
  totalBlocksCount: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  completedMinutes,
  totalMinutes,
  completedBlocksCount,
  totalBlocksCount,
}) => {
  const percentage = totalMinutes > 0 ? Math.min(100, Math.round((completedMinutes / totalMinutes) * 100)) : 0;

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 md:p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Target className="w-3.5 h-3.5" />
          </div>
          <span className="text-sm font-semibold text-slate-200">
            Progresso Adaptativo do Dia
          </span>
          <span className="text-xs text-slate-400">
            · {completedBlocksCount} de {totalBlocksCount} blocos concluídos
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-slate-400">
            {completedMinutes} min de {totalMinutes} min planejados
          </span>
          <span className="text-slate-600">|</span>
          <span className={`font-semibold ${percentage === 100 ? 'text-emerald-400' : 'text-indigo-400'}`}>
            {percentage}%
          </span>
        </div>
      </div>

      {/* Progress track */}
      <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out bg-gradient-to-r from-indigo-500 via-teal-500 to-emerald-400"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-indigo-400 shrink-0" />
          <span>Foco Teórico & Prática</span>
          <span className="w-2 h-2 rounded-full bg-teal-400 shrink-0 ml-2" />
          <span>Micro-Doses de Manutenção</span>
        </span>
        {percentage === 100 && (
          <span className="text-emerald-400 font-medium flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5" />
            Meta diária atingida com equilíbrio!
          </span>
        )}
      </div>
    </div>
  );
};
