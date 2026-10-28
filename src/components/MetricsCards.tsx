import React from 'react';
import { Flame, Clock, Battery, CalendarDays, CheckCircle2, Waves } from 'lucide-react';
import { ResilientStreakRecord, UserDailyEnergy } from '../types';

interface MetricsCardsProps {
  streak: ResilientStreakRecord;
  plannedMinutesToday: number;
  completedMinutesToday: number;
  completedBlocksTodayCount: number;
  totalBlocksTodayCount: number;
  currentEnergy: UserDailyEnergy | null;
  rebalancedBlocksCount: number;
  onOpenWeeklySchedule: () => void;
}

export const MetricsCards: React.FC<MetricsCardsProps> = ({
  streak,
  plannedMinutesToday,
  completedMinutesToday,
  completedBlocksTodayCount,
  totalBlocksTodayCount,
  currentEnergy,
  rebalancedBlocksCount,
  onOpenWeeklySchedule,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Streak Resiliente */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 transition-all hover:border-slate-700">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-slate-400">Streak Resiliente</span>
          <div className="w-8 h-8 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
            <Flame className="w-4 h-4 fill-orange-400/30" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold tracking-tight text-slate-100">
            {streak.currentStreak}
          </span>
          <span className="text-xs text-slate-400">dias seguidos</span>
        </div>
        <div className="mt-2 text-[11px] text-emerald-400 flex items-center gap-1.5 font-medium">
          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
          <span>Micro-tarefas sustentam o streak</span>
        </div>
      </div>

      {/* 2. Carga & Foco de Hoje */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 transition-all hover:border-slate-700">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-slate-400">Tempo de Estudo Hoje</span>
          <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Clock className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold tracking-tight text-slate-100">
            {completedMinutesToday}
          </span>
          <span className="text-xs text-slate-400">/ {plannedMinutesToday} min</span>
        </div>
        <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between">
          <span>{completedBlocksTodayCount} de {totalBlocksTodayCount} blocos concluídos</span>
        </div>
      </div>

      {/* 3. Modo Bateria Atual */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 transition-all hover:border-slate-700">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-slate-400">Modo Bateria Atual</span>
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center border ${
            currentEnergy === 'alta'
              ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
              : currentEnergy === 'media'
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
              : 'bg-teal-500/10 border-teal-500/20 text-teal-400'
          }`}>
            <Battery className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold tracking-tight text-slate-100 capitalize">
            {currentEnergy === 'alta' ? 'Alta ⚡' : currentEnergy === 'media' ? 'Média 🔋' : 'Baixa 🪫'}
          </span>
        </div>
        <div className="mt-2 text-[11px] text-slate-400">
          {currentEnergy === 'alta' && 'Foco em teoria e absorção densa'}
          {currentEnergy === 'media' && 'Prática regular e exercícios'}
          {currentEnergy === 'baixa' && 'Modo manutenção em micro-doses'}
        </div>
      </div>

      {/* 4. Cronograma Líquido & Rebalanceamento */}
      <div 
        onClick={onOpenWeeklySchedule}
        className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 transition-all hover:border-indigo-500/50 cursor-pointer group"
        title="Clique para ver a distribuição de carga semanal"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-slate-400 group-hover:text-indigo-300 transition-colors">
            Cronograma Líquido
          </span>
          <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform">
            <Waves className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold tracking-tight text-slate-100">
            {rebalancedBlocksCount}
          </span>
          <span className="text-xs text-slate-400">remanejados sem atraso</span>
        </div>
        <div className="mt-2 text-[11px] text-indigo-400 flex items-center gap-1 font-medium group-hover:underline">
          <CalendarDays className="w-3.5 h-3.5" />
          <span>Inspecionar distribuição da semana &rarr;</span>
        </div>
      </div>
    </div>
  );
};
