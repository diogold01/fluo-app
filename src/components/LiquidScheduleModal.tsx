import React from 'react';
import { X, CalendarDays, Waves, Sparkles, CheckCircle, Clock } from 'lucide-react';
import { storageService, formatDateToISO } from '../services/storageService';
import { StudyBlock } from '../types';

interface LiquidScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  blocks: StudyBlock[];
}

export const LiquidScheduleModal: React.FC<LiquidScheduleModalProps> = ({
  isOpen,
  onClose,
  blocks,
}) => {
  if (!isOpen) return null;

  const today = formatDateToISO();
  const weeklyData = storageService.getWeeklyWorkload(today);
  const maxMinutes = Math.max(...weeklyData.map((d) => d.totalMinutes), 60);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl shadow-cyan-950/40 text-slate-100 overflow-hidden">
        {/* Glow */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between mb-4 relative z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Waves className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-100">
                Cronograma Líquido Semanal
              </h3>
              <p className="text-xs text-slate-400">
                Distribuição adaptativa de carga horária para prevenir sobrecarga
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Info callout */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 mb-6 relative z-10 text-xs text-slate-300 leading-relaxed flex items-start gap-3">
          <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-cyan-300 font-medium">Como funciona a mecânica Fluo:</strong> Ao acionar <em>"Não consigo fazer hoje"</em>, tarefas longas são fracionadas em micro-doses de até 25 minutos e remanejadas automaticamente para os dias com menor soma de minutos agendados. O descanso é respeitado sem interromper sua consistência.
          </div>
        </div>

        {/* 7 Days Bar Chart */}
        <div className="grid grid-cols-7 gap-2 md:gap-3 py-4 relative z-10">
          {weeklyData.map((day) => {
            const heightPercent = Math.max(12, Math.round((day.totalMinutes / maxMinutes) * 100));
            const isLightest = day.totalMinutes <= 30 && !day.isToday;

            return (
              <div key={day.date} className="flex flex-col items-center">
                {/* Minute Label */}
                <span className="text-[11px] font-mono text-slate-400 mb-2">
                  {day.totalMinutes}m
                </span>

                {/* Vertical Bar Track */}
                <div className="w-full h-36 bg-slate-950 rounded-2xl p-1 border border-slate-800 flex flex-col justify-end relative group">
                  <div
                    className={`w-full rounded-xl transition-all duration-500 ${
                      day.isToday
                        ? 'bg-gradient-to-t from-indigo-600 to-indigo-400 shadow-sm shadow-indigo-500/30'
                        : isLightest
                        ? 'bg-gradient-to-t from-teal-600 to-teal-400 shadow-sm shadow-teal-500/20'
                        : 'bg-gradient-to-t from-slate-700 to-slate-600'
                    }`}
                    style={{ height: `${heightPercent}%` }}
                  />

                  {/* Tooltip on hover */}
                  <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:flex flex-col bg-slate-800 border border-slate-700 text-slate-200 text-[10px] p-2 rounded-lg shadow-lg pointer-events-none whitespace-nowrap z-20">
                    <span className="font-semibold">{day.dayName} ({day.date})</span>
                    <span>{day.blocksCount} blocos ({day.totalMinutes} min)</span>
                    <span className="text-emerald-400">{day.completedMinutes} min concluídos</span>
                  </div>
                </div>

                {/* Day of Week */}
                <div className="mt-2 text-center">
                  <span
                    className={`text-xs font-semibold block ${
                      day.isToday ? 'text-indigo-400' : 'text-slate-300'
                    }`}
                  >
                    {day.dayName}
                  </span>
                  <span className="text-[10px] text-slate-500 block">
                    {day.date.split('-').slice(1).join('/')}
                  </span>
                </div>

                {day.isToday && (
                  <span className="text-[9px] uppercase tracking-wider font-semibold text-indigo-400 mt-0.5">
                    Hoje
                  </span>
                )}
                {isLightest && !day.isToday && (
                  <span className="text-[9px] font-medium text-teal-400 mt-0.5">
                    Leve
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
              <span>Dia Atual</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-500" />
              <span>Dias Leves (Alvos de Rebalanceamento)</span>
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
          >
            Fechar Janela
          </button>
        </div>
      </div>
    </div>
  );
};
