import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  X,
  Volume2,
  VolumeX,
  ShieldCheck,
  Zap,
  BatteryMedium,
  BatteryLow,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { StudyBlock, UserDailyEnergy } from '../types';
import { audioService } from '../services/audioService';

interface PomodoroTimerModalProps {
  block: StudyBlock | null;
  currentEnergy: UserDailyEnergy | null;
  isOpen: boolean;
  onClose: () => void;
  onComplete: (blockId: string) => void;
}

export const PomodoroTimerModal: React.FC<PomodoroTimerModalProps> = ({
  block,
  currentEnergy,
  isOpen,
  onClose,
  onComplete,
}) => {
  // Determine adaptive default minutes
  const isMaintenanceMode = currentEnergy === 'baixa' || (block?.isMaintenance ?? false);
  const defaultMinutes = isMaintenanceMode ? 15 : 25;

  const [mode, setMode] = useState<'focus' | 'break'>('focus');
  const [totalSeconds, setTotalSeconds] = useState(defaultMinutes * 60);
  const [secondsRemaining, setSecondsRemaining] = useState(defaultMinutes * 60);
  const [isActive, setIsActive] = useState(false);
  const [ambientSound, setAmbientSound] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync initial duration when block changes or opens
  useEffect(() => {
    if (isOpen && block) {
      const initialMinutes = currentEnergy === 'baixa' || block.isMaintenance ? 15 : 25;
      setMode('focus');
      setTotalSeconds(initialMinutes * 60);
      setSecondsRemaining(initialMinutes * 60);
      setIsActive(false);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      audioService.toggleAmbient(false);
    };
  }, [isOpen, block, currentEnergy]);

  // Timer interval countdown
  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            handleTimerFinished();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive]);

  const handleTimerFinished = () => {
    setIsActive(false);
    audioService.playChime();

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#6366f1', '#14b8a6', '#10b981', '#f59e0b'],
      });
    } catch {
      // Ignore
    }

    if (mode === 'focus') {
      // Suggest switch to break
      setMode('break');
      const breakSeconds = 5 * 60;
      setTotalSeconds(breakSeconds);
      setSecondsRemaining(breakSeconds);
    } else {
      // Break finished
      setMode('focus');
      setTotalSeconds(defaultMinutes * 60);
      setSecondsRemaining(defaultMinutes * 60);
    }
  };

  const handleStartPause = () => {
    audioService.playTick();
    setIsActive(!isActive);
  };

  const handleReset = (minutes?: number) => {
    audioService.playTick();
    setIsActive(false);
    const targetMin = minutes || (mode === 'focus' ? defaultMinutes : 5);
    setTotalSeconds(targetMin * 60);
    setSecondsRemaining(targetMin * 60);
  };

  const handleToggleAmbient = () => {
    const nextState = !ambientSound;
    setAmbientSound(nextState);
    audioService.toggleAmbient(nextState);
  };

  const handleFinishBlock = () => {
    if (!block) return;
    audioService.playChime();
    try {
      confetti({
        particleCount: 100,
        spread: 90,
        origin: { y: 0.5 },
      });
    } catch {
      // Ignore
    }
    if (ambientSound) {
      audioService.toggleAmbient(false);
      setAmbientSound(false);
    }
    onComplete(block.id);
    onClose();
  };

  if (!isOpen || !block) return null;

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const progressRatio = totalSeconds > 0 ? (totalSeconds - secondsRemaining) / totalSeconds : 0;
  const progressPercent = Math.round(progressRatio * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl shadow-indigo-950/40 text-slate-100 overflow-hidden">
        {/* Glow ambient background effect */}
        <div className="absolute -top-24 -right-24 w-52 h-52 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-52 h-52 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between mb-4 relative z-10">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Temporizador Adaptativo
            </span>
            {isMaintenanceMode && (
              <span className="text-xs text-teal-400 flex items-center gap-1 bg-teal-950/60 border border-teal-800/60 px-2 py-0.5 rounded-md">
                <ShieldCheck className="w-3 h-3" />
                Dose Leve (15m)
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Target Block Details */}
        <div className="mb-6 relative z-10 bg-slate-950/60 border border-slate-800/80 rounded-2xl p-3.5">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-semibold text-slate-300">{block.subject}</span>
            <span className="flex items-center gap-1 font-mono text-[11px]">
              {block.energyRequirement === 'alta' && <Zap className="w-3 h-3 text-amber-400" />}
              {block.energyRequirement === 'media' && <BatteryMedium className="w-3 h-3 text-emerald-400" />}
              {block.energyRequirement === 'baixa' && <BatteryLow className="w-3 h-3 text-teal-400" />}
              <span className="capitalize">{block.energyRequirement} Energia</span>
            </span>
          </div>
          <h4 className="text-sm font-medium text-slate-100 line-clamp-2">
            {block.title}
          </h4>
        </div>

        {/* Mode Selector (Focus 15m / 25m vs Break) */}
        <div className="flex items-center justify-center gap-2 mb-6 relative z-10">
          <button
            type="button"
            onClick={() => {
              setMode('focus');
              handleReset(15);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              mode === 'focus' && totalSeconds === 15 * 60
                ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            Micro-Foco (15 min)
          </button>

          <button
            type="button"
            onClick={() => {
              setMode('focus');
              handleReset(25);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              mode === 'focus' && totalSeconds === 25 * 60
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            Pomodoro (25 min)
          </button>

          <button
            type="button"
            onClick={() => {
              setMode('break');
              handleReset(5);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              mode === 'break'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            Pausa (5 min)
          </button>
        </div>

        {/* Timer Digital Display & Circular Indicator */}
        <div className="flex flex-col items-center justify-center my-4 relative z-10">
          <div className="relative w-48 h-48 flex items-center justify-center">
            {/* SVG Progress Circle */}
            <svg className="w-full h-full -rotate-90">
              <circle
                cx="96"
                cy="96"
                r="82"
                stroke="currentColor"
                strokeWidth="6"
                className="text-slate-800"
                fill="transparent"
              />
              <circle
                cx="96"
                cy="96"
                r="82"
                stroke="currentColor"
                strokeWidth="6"
                className={`transition-all duration-500 ${
                  mode === 'break'
                    ? 'text-emerald-400'
                    : isMaintenanceMode
                    ? 'text-teal-400'
                    : 'text-indigo-400'
                }`}
                strokeDasharray={2 * Math.PI * 82}
                strokeDashoffset={2 * Math.PI * 82 * (1 - progressRatio)}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>

            {/* Centered digits */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-mono text-4xl font-bold tracking-tight text-white">
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
              </span>
              <span className="text-[11px] uppercase tracking-wider text-slate-400 mt-1 font-medium">
                {mode === 'focus' ? (isActive ? 'Foco em andamento' : 'Pausado') : 'Pausa restauradora'}
              </span>
            </div>
          </div>
        </div>

        {/* Controls: Play/Pause, Reset, Ambient Audio */}
        <div className="flex items-center justify-center gap-3 mt-4 mb-6 relative z-10">
          <button
            type="button"
            onClick={() => handleReset()}
            className="p-3 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Reiniciar tempo"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleStartPause}
            className={`px-8 py-3.5 rounded-2xl font-semibold text-sm flex items-center gap-2 transition-all shadow-lg active:scale-95 ${
              isActive
                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
            }`}
          >
            {isActive ? (
              <>
                <Pause className="w-4 h-4 fill-slate-950" />
                <span>Pausar</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>{secondsRemaining < totalSeconds ? 'Continuar' : 'Iniciar Foco'}</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleToggleAmbient}
            className={`p-3 rounded-2xl transition-colors ${
              ambientSound
                ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                : 'bg-slate-800/80 hover:bg-slate-700 text-slate-400'
            }`}
            title="Som ambiente de chuva suave/ruído relaxante para foco"
          >
            {ambientSound ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>

        {/* Complete Block Button */}
        <div className="pt-4 border-t border-slate-800 relative z-10 flex flex-col gap-2">
          <button
            type="button"
            onClick={handleFinishBlock}
            className="w-full py-3 rounded-2xl font-semibold text-xs flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-md shadow-emerald-950/40 active:scale-95"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Concluir Bloco de Estudo Agora</span>
          </button>
          <p className="text-[11px] text-center text-slate-500">
            Atualiza imediatamente seu streak resiliente e barra de progresso.
          </p>
        </div>
      </div>
    </div>
  );
};
