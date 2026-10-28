import React from 'react';
import {
  Play,
  CheckCircle,
  Clock,
  Sparkles,
  Zap,
  BatteryMedium,
  BatteryLow,
  RotateCcw,
  ShieldCheck,
  Edit2,
  Trash2,
  ArrowRightLeft,
} from 'lucide-react';
import { StudyBlock, UserDailyEnergy } from '../types';

interface StudyBlockCardProps {
  block: StudyBlock;
  currentEnergy: UserDailyEnergy | null;
  onStartFocus: (block: StudyBlock) => void;
  onToggleStatus: (block: StudyBlock) => void;
  onRebalance: (block: StudyBlock) => void;
  onEdit: (block: StudyBlock) => void;
  onDelete: (blockId: string) => void;
}

export const StudyBlockCard: React.FC<StudyBlockCardProps> = ({
  block,
  currentEnergy,
  onStartFocus,
  onToggleStatus,
  onRebalance,
  onEdit,
  onDelete,
}) => {
  const isDone = block.status === 'concluido';
  const isReallocated = block.status === 'remanejado' || Boolean(block.reallocatedFrom);

  // Check if this block matches today's energy profile for emphasis
  const isIdealForEnergy =
    (currentEnergy === 'alta' && block.energyRequirement === 'alta') ||
    (currentEnergy === 'media' && block.energyRequirement === 'media') ||
    (currentEnergy === 'baixa' && (block.energyRequirement === 'baixa' || block.isMaintenance));

  // If user is in low energy mode and this task is long (>15 min)
  const isHeavyForLowEnergy = currentEnergy === 'baixa' && block.durationMinutes > 15 && !isDone;

  return (
    <div
      className={`group relative rounded-2xl p-4 md:p-5 transition-all duration-200 border ${
        isDone
          ? 'bg-slate-950/40 border-slate-900 opacity-75'
          : isIdealForEnergy
          ? 'bg-slate-900/90 border-indigo-500/50 shadow-md shadow-indigo-950/30'
          : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
      }`}
    >
      {/* Top Header: Subject and Energy Requirement (Zero-pill discipline, clean typography) */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="font-semibold text-slate-300">{block.subject}</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span className="capitalize">{block.category}</span>
          {block.isMaintenance && (
            <>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-teal-400 font-medium flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Micro-Manutenção
              </span>
            </>
          )}
          {isReallocated && (
            <>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-cyan-400 font-medium">Rebalanceado</span>
            </>
          )}
        </div>

        {/* Energy indicator badge */}
        <div className="flex items-center gap-1.5 text-xs">
          {block.energyRequirement === 'alta' && (
            <span className="flex items-center gap-1 text-amber-400 font-medium">
              <Zap className="w-3.5 h-3.5 fill-amber-400/40" />
              <span>Alta Energia</span>
            </span>
          )}
          {block.energyRequirement === 'media' && (
            <span className="flex items-center gap-1 text-emerald-400 font-medium">
              <BatteryMedium className="w-3.5 h-3.5" />
              <span>Regular</span>
            </span>
          )}
          {block.energyRequirement === 'baixa' && (
            <span className="flex items-center gap-1 text-teal-400 font-medium">
              <BatteryLow className="w-3.5 h-3.5" />
              <span>Baixa Energia</span>
            </span>
          )}
        </div>
      </div>

      {/* Main Title & Notes */}
      <div className="mb-3">
        <h3
          className={`text-base font-semibold transition-colors ${
            isDone ? 'line-through text-slate-500' : 'text-slate-100 group-hover:text-white'
          }`}
        >
          {block.title}
        </h3>
        {block.notes && (
          <p className="mt-1 text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {block.notes}
          </p>
        )}
      </div>

      {/* Metadata bar: duration & energy suggestion */}
      <div className="flex flex-wrap items-center justify-between gap-2 py-2 border-y border-slate-800/60 text-xs text-slate-400 mb-4">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 font-mono text-slate-300">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            {block.durationMinutes} minutos
          </span>
          {block.originalDuration && block.originalDuration !== block.durationMinutes && (
            <span className="text-[11px] text-slate-500">
              (original: {block.originalDuration}m)
            </span>
          )}
        </div>

        {isIdealForEnergy && !isDone && (
          <span className="text-indigo-400 text-[11px] font-medium flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            Recomendado para sua energia atual
          </span>
        )}
        {isHeavyForLowEnergy && (
          <span className="text-amber-400/90 text-[11px] font-medium">
            💡 Bloco denso para Modo Manutenção. Pode rebalancear abaixo.
          </span>
        )}
      </div>

      {/* Actions Row */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        {/* Primary Focus Button */}
        <div className="flex items-center gap-2">
          {!isDone ? (
            <button
              type="button"
              onClick={() => onStartFocus(block)}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-sm active:scale-95"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Focar Agora</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onToggleStatus(block)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
              title="Marcar como não concluído"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reabrir</span>
            </button>
          )}

          {/* Quick Complete Toggle Button */}
          <button
            type="button"
            onClick={() => onToggleStatus(block)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              isDone
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : 'text-slate-400 hover:text-emerald-400 hover:bg-slate-800'
            }`}
          >
            <CheckCircle className={`w-3.5 h-3.5 ${isDone ? 'fill-emerald-400/20 text-emerald-400' : ''}`} />
            <span>{isDone ? 'Concluído' : 'Marcar Concluído'}</span>
          </button>
        </div>

        {/* Secondary Actions: "Não consigo fazer hoje" & Edit / Delete */}
        <div className="flex items-center gap-1.5">
          {/* Quick Reschedule / Liquid Schedule button */}
          {!isDone && (
            <button
              type="button"
              onClick={() => onRebalance(block)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-cyan-400 hover:text-cyan-300 hover:bg-cyan-950/40 border border-cyan-800/40 transition-all active:scale-95"
              title="Rebalanceia este bloco automaticamente para os dias com menor carga horária sem culpa"
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
              <span>Não consigo fazer hoje</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => onEdit(block)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-colors"
            title="Editar bloco"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => onDelete(block.id)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
            title="Excluir bloco"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
