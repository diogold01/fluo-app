import React from 'react';
import { Zap, BatteryMedium, BatteryLow, Sparkles, ShieldCheck } from 'lucide-react';
import { UserDailyEnergy } from '../types';

interface EnergyBatterySelectorProps {
  currentEnergy: UserDailyEnergy | null;
  onSelectEnergy: (energy: UserDailyEnergy) => void;
  maintenanceCountToday: number;
}

export const EnergyBatterySelector: React.FC<EnergyBatterySelectorProps> = ({
  currentEnergy,
  onSelectEnergy,
  maintenanceCountToday,
}) => {
  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 md:p-5 backdrop-blur-sm shadow-lg shadow-black/20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Header Question & Explanation */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider font-semibold text-indigo-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Modo Bateria & Cognição Adaptativa
            </span>
            {currentEnergy === 'baixa' && (
              <span className="text-xs text-teal-400 flex items-center gap-1 font-medium bg-teal-950/60 border border-teal-800/60 px-2 py-0.5 rounded-md">
                <ShieldCheck className="w-3.5 h-3.5" />
                Manutenção Protegida
              </span>
            )}
          </div>
          <h2 className="text-base md:text-lg font-semibold text-slate-100">
            Qual é o seu nível de energia hoje?
          </h2>
          <p className="text-xs text-slate-400 max-w-xl">
            {currentEnergy === 'alta' && (
              <span>⚡ <strong className="text-amber-300">Carga Intensa:</strong> Prioriza blocos densos e teóricos no pico da sua clareza mental.</span>
            )}
            {currentEnergy === 'media' && (
              <span>🔋 <strong className="text-emerald-300">Modo Regular:</strong> Foco equilibrado em resolução de exercícios e consolidação prática.</span>
            )}
            {currentEnergy === 'baixa' && (
              <span>🪫 <strong className="text-teal-300">Modo Manutenção:</strong> Micro-tarefas de até 15 min preservam seu hábito sem culpa de produtividade tóxica.</span>
            )}
            {!currentEnergy && (
              <span>Selecione sua energia para reorganizar automaticamente o dia e proteger seu ritmo de estudos.</span>
            )}
          </p>
        </div>

        {/* 3 Quick Action Selectors */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950/80 border border-slate-800 rounded-xl self-start md:self-center shrink-0">
          {/* Alta */}
          <button
            type="button"
            onClick={() => onSelectEnergy('alta')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all ${
              currentEnergy === 'alta'
                ? 'bg-amber-500/20 text-amber-200 border border-amber-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
            title="Alta Energia: Prioriza teoria densa e novas aprendizagens"
          >
            <Zap className={`w-4 h-4 ${currentEnergy === 'alta' ? 'text-amber-400 fill-amber-400' : 'text-slate-400'}`} />
            <span className="font-semibold">Alta</span>
            <span className="hidden sm:inline text-[11px] opacity-75">· ⚡ Intensa</span>
          </button>

          {/* Média */}
          <button
            type="button"
            onClick={() => onSelectEnergy('media')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all ${
              currentEnergy === 'media'
                ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
            title="Média Energia: Exercícios e fluxo regular"
          >
            <BatteryMedium className={`w-4 h-4 ${currentEnergy === 'media' ? 'text-emerald-400' : 'text-slate-400'}`} />
            <span className="font-semibold">Média</span>
            <span className="hidden sm:inline text-[11px] opacity-75">· 🔋 Regular</span>
          </button>

          {/* Baixa */}
          <button
            type="button"
            onClick={() => onSelectEnergy('baixa')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all ${
              currentEnergy === 'baixa'
                ? 'bg-teal-500/20 text-teal-200 border border-teal-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
            title="Baixa Energia: Micro-tarefas de até 15 min e manutenção do hábito"
          >
            <BatteryLow className={`w-4 h-4 ${currentEnergy === 'baixa' ? 'text-teal-400' : 'text-slate-400'}`} />
            <span className="font-semibold">Baixa</span>
            <span className="hidden sm:inline text-[11px] opacity-75">· 🪫 Manutenção</span>
          </button>
        </div>
      </div>

      {/* Low Energy Mode Active Banner Notification */}
      {currentEnergy === 'baixa' && (
        <div className="mt-3.5 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs text-teal-300 bg-teal-950/30 -mx-4 -mb-4 p-3 px-4 rounded-b-2xl">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse shrink-0" />
            <span>
              <strong>Foco em Micro-Doses ativado:</strong> O plano do dia foi otimizado para blocos de até 15 min. Seu streak resiliente continua 100% preservado.
            </span>
          </div>
          <span className="text-teal-200/80 font-mono text-[11px]">
            {maintenanceCountToday} {maintenanceCountToday === 1 ? 'micro-tarefa disponível' : 'micro-tarefas disponíveis'}
          </span>
        </div>
      )}
    </div>
  );
};
