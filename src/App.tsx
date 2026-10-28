import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Plus,
  Calendar,
  Search,
  RotateCcw,
  Sparkles,
  SlidersHorizontal,
  Flame,
  CheckCircle2,
  Waves,
  BrainCircuit,
} from 'lucide-react';
import {
  StudyBlock,
  UserDailyEnergy,
  ResilientStreakRecord,
  ToastMessage,
} from './types';
import {
  storageService,
  formatDateToISO,
  addDaysToISO,
  getDayNamePt,
} from './services/storageService';
import { EnergyBatterySelector } from './components/EnergyBatterySelector';
import { MetricsCards } from './components/MetricsCards';
import { ProgressBar } from './components/ProgressBar';
import { StudyBlockCard } from './components/StudyBlockCard';
import { PomodoroTimerModal } from './components/PomodoroTimerModal';
import { LiquidScheduleModal } from './components/LiquidScheduleModal';
import { StudyBlockModal } from './components/StudyBlockModal';
import { ToastContainer } from './components/ToastContainer';

export default function App() {
  const [blocks, setBlocks] = useState<StudyBlock[]>([]);
  const [streak, setStreak] = useState<ResilientStreakRecord>({
    currentStreak: 0,
    longestStreak: 0,
    lastActiveDate: null,
    history: {},
  });
  const [currentEnergy, setCurrentEnergy] = useState<UserDailyEnergy | null>(null);

  // Filters & Navigation
  const [dateFilter, setDateFilter] = useState<'hoje' | 'amanha' | 'semana' | 'todos'>('hoje');
  const [statusFilter, setStatusFilter] = useState<'todos' | 'pendentes' | 'concluidos'>('todos');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals & Active State
  const [focusingBlock, setFocusingBlock] = useState<StudyBlock | null>(null);
  const [isFocusModalOpen, setIsFocusModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [editingBlock, setEditingBlock] = useState<StudyBlock | null>(null);

  // Toast System
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((toast: Omit<ToastMessage, 'id'>) => {
    const id = 'toast-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);
    const newToast: ToastMessage = { ...toast, id };
    setToasts((prev) => [...prev, newToast]);

    const duration = toast.durationMs || 6500;
    setTimeout(() => {
      setToasts((current) => current.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Load Initial Data from localStorage
  const loadData = useCallback(() => {
    const loadedBlocks = storageService.getStudyBlocks();
    const loadedStreak = storageService.getResilientStreak();
    const loadedEnergy = storageService.getUserDailyEnergy();

    setBlocks(loadedBlocks);
    setStreak(loadedStreak);
    // If no energy set yet, default to 'media' so user has an active starting flow
    if (!loadedEnergy) {
      storageService.setUserDailyEnergy('media');
      setCurrentEnergy('media');
    } else {
      setCurrentEnergy(loadedEnergy);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handle Energy Selection
  const handleSelectEnergy = (energy: UserDailyEnergy) => {
    storageService.setUserDailyEnergy(energy);
    setCurrentEnergy(energy);
    setStreak(storageService.getResilientStreak());

    if (energy === 'baixa') {
      addToast({
        type: 'comfort',
        title: 'Modo Manutenção Ativado 🪫',
        message: 'Priorizamos micro-tarefas de até 15 minutos. Respeite seu ritmo hoje sem culpa.',
        durationMs: 5000,
      });
    } else if (energy === 'alta') {
      addToast({
        type: 'info',
        title: 'Alta Energia ⚡',
        message: 'Blocos teóricos e complexos foram posicionados no topo para seu pico de foco.',
        durationMs: 4500,
      });
    } else {
      addToast({
        type: 'info',
        title: 'Modo Regular 🔋',
        message: 'Fluxo balanceado entre teoria e exercícios ativado.',
        durationMs: 4000,
      });
    }
  };

  // Handle Liquid Schedule Rebalance ("Não consigo fazer hoje")
  const handleRebalanceBlock = (block: StudyBlock) => {
    const result = storageService.rebalanceLiquidSchedule(block.id);

    if (result.success) {
      loadData();
      addToast({
        type: 'comfort',
        title: 'Cronograma Líquido Atualizado 🌿',
        message: result.message,
        actionLabel: 'Ver Semana',
        onAction: () => setIsScheduleModalOpen(true),
        durationMs: 8000,
      });
    } else {
      addToast({
        type: 'warning',
        title: 'Não foi possível rebalancear',
        message: result.message,
      });
    }
  };

  // Handle Quick Status Toggle
  const handleToggleStatus = (block: StudyBlock) => {
    const nextStatus = block.status === 'concluido' ? 'nao_iniciado' : 'concluido';
    storageService.updateStudyBlock(block.id, {
      status: nextStatus,
      completedAt: nextStatus === 'concluido' ? new Date().toISOString() : undefined,
    });
    loadData();

    if (nextStatus === 'concluido') {
      addToast({
        type: 'success',
        title: 'Bloco Concluído! ✨',
        message: block.isMaintenance
          ? 'Micro-tarefa concluída! Seu streak resiliente está garantido.'
          : `Excelente! ${block.durationMinutes} minutos de foco registrados.`,
        durationMs: 4000,
      });
    }
  };

  // Handle Focus Completion in Pomodoro
  const handlePomodoroComplete = (blockId: string) => {
    storageService.updateStudyBlock(blockId, {
      status: 'concluido',
      completedAt: new Date().toISOString(),
    });
    loadData();
    addToast({
      type: 'success',
      title: 'Sessão de Foco Finalizada! 🎯',
      message: 'Métricas atualizadas e progresso salvo com sucesso.',
      durationMs: 4500,
    });
  };

  // Create / Edit Block
  const handleSaveBlock = (
    data: Omit<StudyBlock, 'id' | 'createdAt'>,
    existingId?: string
  ) => {
    if (existingId) {
      storageService.updateStudyBlock(existingId, data);
      addToast({
        type: 'info',
        title: 'Bloco Atualizado',
        message: 'As alterações foram salvas.',
        durationMs: 3500,
      });
    } else {
      storageService.addStudyBlock(data);
      addToast({
        type: 'success',
        title: 'Bloco Adicionado ao Cronograma',
        message: `${data.title} (${data.durationMinutes} min) agendado com sucesso.`,
        durationMs: 4000,
      });
    }
    loadData();
  };

  // Delete Block
  const handleDeleteBlock = (blockId: string) => {
    storageService.deleteStudyBlock(blockId);
    loadData();
    addToast({
      type: 'info',
      title: 'Bloco Removido',
      message: 'O bloco foi excluído do seu cronograma.',
      durationMs: 3000,
    });
  };

  // Reset to initial sample data
  const handleResetData = () => {
    if (window.confirm('Deseja restaurar os dados de exemplo do StudyFlow? Seus blocos atuais serão redefinidos.')) {
      storageService.resetAllData();
      loadData();
      addToast({
        type: 'info',
        title: 'Dados Restaurados',
        message: 'Cronograma e histórico redefinidos para os valores de exemplo.',
        durationMs: 4000,
      });
    }
  };

  const todayISO = formatDateToISO();
  const tomorrowISO = addDaysToISO(todayISO, 1);
  const endOfWeekISO = addDaysToISO(todayISO, 6);

  // Today's metrics
  const todayBlocks = useMemo(() => {
    return blocks.filter((b) => b.scheduledDate === todayISO);
  }, [blocks, todayISO]);

  const plannedMinutesToday = useMemo(() => {
    return todayBlocks.reduce((sum, b) => sum + b.durationMinutes, 0);
  }, [todayBlocks]);

  const completedMinutesToday = useMemo(() => {
    return todayBlocks
      .filter((b) => b.status === 'concluido')
      .reduce((sum, b) => sum + b.durationMinutes, 0);
  }, [todayBlocks]);

  const completedBlocksTodayCount = useMemo(() => {
    return todayBlocks.filter((b) => b.status === 'concluido').length;
  }, [todayBlocks]);

  const rebalancedBlocksCount = useMemo(() => {
    return blocks.filter((b) => Boolean(b.reallocatedFrom) || b.status === 'remanejado').length;
  }, [blocks]);

  const maintenanceCountToday = useMemo(() => {
    return todayBlocks.filter((b) => b.isMaintenance || b.energyRequirement === 'baixa').length;
  }, [todayBlocks]);

  // Filtered & Organized Blocks for display
  const displayedBlocks = useMemo(() => {
    let list = [...blocks];

    // Date filter
    if (dateFilter === 'hoje') {
      list = list.filter((b) => b.scheduledDate === todayISO);
    } else if (dateFilter === 'amanha') {
      list = list.filter((b) => b.scheduledDate === tomorrowISO);
    } else if (dateFilter === 'semana') {
      list = list.filter((b) => b.scheduledDate >= todayISO && b.scheduledDate <= endOfWeekISO);
    }

    // Status filter
    if (statusFilter === 'pendentes') {
      list = list.filter((b) => b.status !== 'concluido');
    } else if (statusFilter === 'concluidos') {
      list = list.filter((b) => b.status === 'concluido');
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.subject.toLowerCase().includes(q) ||
          b.category.toLowerCase().includes(q)
      );
    }

    // Energy Priority Reordering:
    // If Low Energy: micro-tasks (<=15m) or isMaintenance or 'baixa' come FIRST
    // If High Energy: 'alta' theoretical blocks come FIRST
    // If Medium Energy: 'media' exercises come FIRST
    // Completed items always sink to the bottom smoothly
    list.sort((a, b) => {
      // 1. Completed sink to bottom
      if (a.status === 'concluido' && b.status !== 'concluido') return 1;
      if (a.status !== 'concluido' && b.status === 'concluido') return -1;

      // 2. Energy requirement matching current battery
      if (currentEnergy === 'baixa') {
        const aMaint = a.isMaintenance || a.energyRequirement === 'baixa' || a.durationMinutes <= 15 ? 1 : 0;
        const bMaint = b.isMaintenance || b.energyRequirement === 'baixa' || b.durationMinutes <= 15 ? 1 : 0;
        if (aMaint !== bMaint) return bMaint - aMaint;
      } else if (currentEnergy === 'alta') {
        const aHigh = a.energyRequirement === 'alta' ? 1 : 0;
        const bHigh = b.energyRequirement === 'alta' ? 1 : 0;
        if (aHigh !== bHigh) return bHigh - aHigh;
      } else if (currentEnergy === 'media') {
        const aMed = a.energyRequirement === 'media' ? 1 : 0;
        const bMed = b.energyRequirement === 'media' ? 1 : 0;
        if (aMed !== bMed) return bMed - aMed;
      }

      // 3. Fallback: duration shortest first
      return a.durationMinutes - b.durationMinutes;
    });

    return list;
  }, [blocks, dateFilter, statusFilter, searchQuery, todayISO, tomorrowISO, endOfWeekISO, currentEnergy]);

  return (
    <div className="min-h-screen bg-[#0c0f17] text-slate-100 flex flex-col selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Top Brand Navigation Header */}
      <header className="border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-teal-500 to-emerald-400 p-[1.5px] flex items-center justify-center shadow-lg shadow-indigo-950/50">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-indigo-400">
                <BrainCircuit className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold tracking-tight text-white">StudyFlow</h1>
                <span className="text-[10px] font-semibold text-teal-400 bg-teal-950/80 border border-teal-800/60 px-1.5 py-0.5 rounded uppercase tracking-wider">
                  Fluo Adaptive
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Cronograma líquido resiliente · Consistência sem culpa
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsScheduleModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-300 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors"
              title="Ver visão geral da semana e distribuição líquida"
            >
              <Waves className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Cronograma Líquido</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setEditingBlock(null);
                setIsBlockModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-md active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Novo Bloco</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 md:py-8 flex-1 w-full space-y-6">
        {/* 1. Modo Bateria & Seletor de Energia Diária */}
        <section aria-label="Seletor de Nível de Energia">
          <EnergyBatterySelector
            currentEnergy={currentEnergy}
            onSelectEnergy={handleSelectEnergy}
            maintenanceCountToday={maintenanceCountToday}
          />
        </section>

        {/* 2. Cards de Métricas */}
        <section aria-label="Métricas Principais">
          <MetricsCards
            streak={streak}
            plannedMinutesToday={plannedMinutesToday}
            completedMinutesToday={completedMinutesToday}
            completedBlocksTodayCount={completedBlocksTodayCount}
            totalBlocksTodayCount={todayBlocks.length}
            currentEnergy={currentEnergy}
            rebalancedBlocksCount={rebalancedBlocksCount}
            onOpenWeeklySchedule={() => setIsScheduleModalOpen(true)}
          />
        </section>

        {/* 3. Barra de Progresso Geral */}
        <section aria-label="Barra de Progresso">
          <ProgressBar
            completedMinutes={completedMinutesToday}
            totalMinutes={plannedMinutesToday}
            completedBlocksCount={completedBlocksTodayCount}
            totalBlocksCount={todayBlocks.length}
          />
        </section>

        {/* 4. Controls & Filters Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2">
          {/* Date Segmented Control */}
          <div className="flex items-center gap-1 p-1 bg-slate-900/90 border border-slate-800 rounded-xl self-start overflow-x-auto max-w-full">
            <button
              type="button"
              onClick={() => setDateFilter('hoje')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                dateFilter === 'hoje'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Hoje ({getDayNamePt(todayISO, true)})
            </button>
            <button
              type="button"
              onClick={() => setDateFilter('amanha')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                dateFilter === 'amanha'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Amanhã
            </button>
            <button
              type="button"
              onClick={() => setDateFilter('semana')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                dateFilter === 'semana'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Esta Semana
            </button>
            <button
              type="button"
              onClick={() => setDateFilter('todos')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                dateFilter === 'todos'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Todos os Blocos
            </button>
          </div>

          {/* Search & Status Filters */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-56">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar por tópico..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            {/* Status Selector */}
            <div className="flex items-center gap-1 p-1 bg-slate-900/90 border border-slate-800 rounded-xl text-xs">
              <button
                type="button"
                onClick={() => setStatusFilter('todos')}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  statusFilter === 'todos' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Todos
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('pendentes')}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  statusFilter === 'pendentes' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                A Fazer
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('concluidos')}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  statusFilter === 'concluidos' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Concluídos
              </button>
            </div>
          </div>
        </div>

        {/* 5. Study Blocks List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span className="font-semibold text-slate-300">
              {dateFilter === 'hoje'
                ? `Blocos de Hoje · ${todayBlocks.length} planejados`
                : dateFilter === 'amanha'
                ? 'Blocos de Amanhã'
                : dateFilter === 'semana'
                ? 'Blocos da Semana'
                : 'Todos os Blocos'}
            </span>
            <span>
              Ordenados com prioridade para{' '}
              <strong className="text-slate-200 capitalize">
                {currentEnergy === 'alta' ? 'Alta Energia ⚡' : currentEnergy === 'media' ? 'Modo Regular 🔋' : 'Modo Manutenção 🪫'}
              </strong>
            </span>
          </div>

          {displayedBlocks.length > 0 ? (
            <div className="grid grid-cols-1 gap-3.5">
              {displayedBlocks.map((block) => (
                <StudyBlockCard
                  key={block.id}
                  block={block}
                  currentEnergy={currentEnergy}
                  onStartFocus={(target) => {
                    setFocusingBlock(target);
                    setIsFocusModalOpen(true);
                  }}
                  onToggleStatus={handleToggleStatus}
                  onRebalance={handleRebalanceBlock}
                  onEdit={(target) => {
                    setEditingBlock(target);
                    setIsBlockModalOpen(true);
                  }}
                  onDelete={handleDeleteBlock}
                />
              ))}
            </div>
          ) : (
            <div className="bg-slate-900/40 border border-dashed border-slate-800 rounded-3xl p-10 text-center">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 mx-auto flex items-center justify-center mb-3">
                <Sparkles className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-semibold text-slate-200 mb-1">
                Nenhum bloco de estudo encontrado
              </h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
                {searchQuery
                  ? 'Nenhum resultado corresponde à sua busca.'
                  : 'Nenhum bloco cadastrado para este filtro. Que tal criar uma micro-tarefa leve para o seu dia?'}
              </p>
              <button
                type="button"
                onClick={() => {
                  setEditingBlock(null);
                  setIsBlockModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-md active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>Adicionar Novo Bloco</span>
              </button>
            </div>
          )}
        </div>

        {/* Secondary helper / Reset capability */}
        <div className="pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
          <span>
            Arquitetura 100% Client-Side · Persistência local no navegador via localStorage.
          </span>
          <button
            type="button"
            onClick={handleResetData}
            className="flex items-center gap-1 text-slate-400 hover:text-slate-200 transition-colors"
            title="Restaura os dados originais de exemplo"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restaurar dados de exemplo</span>
          </button>
        </div>
      </main>

      {/* Integrated Pomodoro Focus Modal */}
      <PomodoroTimerModal
        isOpen={isFocusModalOpen}
        block={focusingBlock}
        currentEnergy={currentEnergy}
        onClose={() => {
          setIsFocusModalOpen(false);
          setFocusingBlock(null);
        }}
        onComplete={handlePomodoroComplete}
      />

      {/* Liquid Schedule Weekly Inspector Modal */}
      <LiquidScheduleModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        blocks={blocks}
      />

      {/* Create / Edit Study Block Modal */}
      <StudyBlockModal
        isOpen={isBlockModalOpen}
        initialBlock={editingBlock}
        onClose={() => {
          setIsBlockModalOpen(false);
          setEditingBlock(null);
        }}
        onSave={handleSaveBlock}
      />

      {/* Floating Reassuring Toasts Container */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
