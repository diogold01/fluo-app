import {
  StudyBlock,
  UserDailyEnergy,
  ResilientStreakRecord,
  RebalanceResult,
  DayStreakActivity,
} from '../types';

const STORAGE_KEYS = {
  BLOCKS: 'studyflow_blocks_v2',
  USER_ENERGY: 'studyflow_daily_energy_v2',
  ENERGY_DATE: 'studyflow_energy_date_v2',
  RESILIENT_STREAK: 'studyflow_resilient_streak_v2',
  PREFERENCES: 'studyflow_preferences_v2',
};

// Helper: Format date to ISO YYYY-MM-DD in local time
export function formatDateToISO(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function parseISODate(isoString: string): Date {
  const [year, month, day] = isoString.split('-').map(Number);
  return new Date(year, (month || 1) - 1, day || 1);
}

export function addDaysToISO(isoString: string, days: number): string {
  const d = parseISODate(isoString);
  d.setDate(d.getDate() + days);
  return formatDateToISO(d);
}

export function getDayNamePt(isoString: string, short = false): string {
  const d = parseISODate(isoString);
  const daysShort = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const daysFull = [
    'Domingo',
    'Segunda-feira',
    'Terça-feira',
    'Quarta-feira',
    'Quinta-feira',
    'Sexta-feira',
    'Sábado',
  ];
  return short ? daysShort[d.getDay()] : daysFull[d.getDay()];
}

// Generate default realistic sample data centered around the current date
export function generateInitialSampleBlocks(referenceDate: string = formatDateToISO()): StudyBlock[] {
  const today = referenceDate;
  const tomorrow = addDaysToISO(today, 1);
  const day3 = addDaysToISO(today, 2);
  const day4 = addDaysToISO(today, 3);
  const day5 = addDaysToISO(today, 4);

  return [
    {
      id: 'block-1',
      title: 'Estruturas de Dados: Grafos e Busca em Largura (BFS)',
      subject: 'Ciência da Computação',
      category: 'teoria',
      energyRequirement: 'alta',
      status: 'nao_iniciado',
      durationMinutes: 45,
      scheduledDate: today,
      isMaintenance: false,
      notes: 'Estudo aprofundado dos algoritmos BFS e matriz de adjacência.',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'block-2',
      title: 'Resolução de 10 Exercícios Práticos de SQL e Joins',
      subject: 'Bancos de Dados',
      category: 'exercicios',
      energyRequirement: 'media',
      status: 'nao_iniciado',
      durationMinutes: 30,
      scheduledDate: today,
      isMaintenance: false,
      notes: 'Focar em Left Joins e agregações com HAVING.',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'block-3',
      title: 'Flashcards de Sinapses e Neurotransmissores',
      subject: 'Neurociência Cognitiva',
      category: 'revisao',
      energyRequirement: 'baixa',
      status: 'concluido',
      durationMinutes: 15,
      scheduledDate: today,
      isMaintenance: true,
      notes: 'Revisão ativa com repetição espaçada (15 cards rápidos).',
      completedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    },
    {
      id: 'block-4',
      title: 'Micro-Revisão: Princípios SOLID em TypeScript',
      subject: 'Engenharia de Software',
      category: 'revisao',
      energyRequirement: 'baixa',
      status: 'nao_iniciado',
      durationMinutes: 15,
      scheduledDate: today,
      isMaintenance: true,
      notes: 'Leitura rápida dos conceitos de Inversão de Dependência e Liskov.',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'block-5',
      title: 'Modelagem de Sistemas Distribuídos e Teorema CAP',
      subject: 'Arquitetura de Sistemas',
      category: 'teoria',
      energyRequirement: 'alta',
      status: 'nao_iniciado',
      durationMinutes: 60,
      scheduledDate: tomorrow,
      isMaintenance: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'block-6',
      title: 'Leitura de Artigo sobre Aprendizado Ativo e Retenção',
      subject: 'Metacognição',
      category: 'leitura',
      energyRequirement: 'baixa',
      status: 'nao_iniciado',
      durationMinutes: 20,
      scheduledDate: tomorrow,
      isMaintenance: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'block-7',
      title: 'Implementação de Testes Automatizados com Vitest',
      subject: 'Engenharia de Software',
      category: 'projeto',
      energyRequirement: 'media',
      status: 'nao_iniciado',
      durationMinutes: 45,
      scheduledDate: day3,
      isMaintenance: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'block-8',
      title: 'Resumo Esquemático de Álgebra Linear: Autovetores',
      subject: 'Matemática Aplicada',
      category: 'teoria',
      energyRequirement: 'alta',
      status: 'nao_iniciado',
      durationMinutes: 40,
      scheduledDate: day4,
      isMaintenance: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'block-9',
      title: 'Revisão Rápida de Vocabulário Técnico',
      subject: 'Inglês Instrumental',
      category: 'revisao',
      energyRequirement: 'baixa',
      status: 'nao_iniciado',
      durationMinutes: 15,
      scheduledDate: day5,
      isMaintenance: true,
      createdAt: new Date().toISOString(),
    },
  ];
}

export function generateInitialStreak(referenceDate: string = formatDateToISO()): ResilientStreakRecord {
  const history: Record<string, DayStreakActivity> = {};
  
  // Create 6 past consecutive days completed to show resilient streak
  for (let i = 6; i >= 1; i--) {
    const pastDate = addDaysToISO(referenceDate, -i);
    // Alternate some maintenance days to illustrate the resilient streak philosophy
    const isMaintenanceDay = i % 2 === 0;
    history[pastDate] = {
      date: pastDate,
      completedMinutes: isMaintenanceDay ? 15 : 45,
      maintenanceCompleted: isMaintenanceDay,
      standardCompleted: !isMaintenanceDay,
      energyLevel: isMaintenanceDay ? 'baixa' : 'media',
      blocksCompletedCount: isMaintenanceDay ? 1 : 2,
    };
  }

  // Today has 1 completed block (block-3 is 15 min maintenance)
  history[referenceDate] = {
    date: referenceDate,
    completedMinutes: 15,
    maintenanceCompleted: true,
    standardCompleted: false,
    energyLevel: 'media',
    blocksCompletedCount: 1,
  };

  return {
    currentStreak: 7,
    longestStreak: 14,
    lastActiveDate: referenceDate,
    history,
  };
}

class StorageService {
  // Study Blocks CRUD
  getStudyBlocks(): StudyBlock[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.BLOCKS);
      if (!data) {
        const initial = generateInitialSampleBlocks();
        this.saveStudyBlocks(initial);
        return initial;
      }
      return JSON.parse(data) as StudyBlock[];
    } catch (e) {
      console.error('Error loading study blocks from storage:', e);
      return generateInitialSampleBlocks();
    }
  }

  saveStudyBlocks(blocks: StudyBlock[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.BLOCKS, JSON.stringify(blocks));
    } catch (e) {
      console.error('Error saving study blocks to storage:', e);
    }
  }

  addStudyBlock(blockData: Omit<StudyBlock, 'id' | 'createdAt'>): StudyBlock {
    const blocks = this.getStudyBlocks();
    const newBlock: StudyBlock = {
      ...blockData,
      id: 'block-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      createdAt: new Date().toISOString(),
    };
    blocks.unshift(newBlock);
    this.saveStudyBlocks(blocks);
    return newBlock;
  }

  updateStudyBlock(id: string, updates: Partial<StudyBlock>): StudyBlock | null {
    const blocks = this.getStudyBlocks();
    const index = blocks.findIndex((b) => b.id === id);
    if (index === -1) return null;

    const updated = { ...blocks[index], ...updates };
    blocks[index] = updated;
    this.saveStudyBlocks(blocks);

    // If block was completed, record in resilient streak
    if (updates.status === 'concluido') {
      this.recordBlockCompleted(updated);
    }

    return updated;
  }

  deleteStudyBlock(id: string): boolean {
    const blocks = this.getStudyBlocks();
    const filtered = blocks.filter((b) => b.id !== id);
    if (filtered.length !== blocks.length) {
      this.saveStudyBlocks(filtered);
      return true;
    }
    return false;
  }

  // Energy Level Tracking
  getUserDailyEnergy(): UserDailyEnergy | null {
    try {
      const savedDate = localStorage.getItem(STORAGE_KEYS.ENERGY_DATE);
      const today = formatDateToISO();
      
      // If recorded on a previous day, keep it as previous or allow reassessment
      const energy = localStorage.getItem(STORAGE_KEYS.USER_ENERGY) as UserDailyEnergy | null;
      if (savedDate !== today && !energy) {
        return null;
      }
      return energy;
    } catch (e) {
      console.error('Error getting user daily energy:', e);
      return null;
    }
  }

  setUserDailyEnergy(energy: UserDailyEnergy): void {
    try {
      const today = formatDateToISO();
      localStorage.setItem(STORAGE_KEYS.USER_ENERGY, energy);
      localStorage.setItem(STORAGE_KEYS.ENERGY_DATE, today);

      // Update streak record today energy level
      const streak = this.getResilientStreak();
      if (!streak.history[today]) {
        streak.history[today] = {
          date: today,
          completedMinutes: 0,
          maintenanceCompleted: false,
          standardCompleted: false,
          energyLevel: energy,
          blocksCompletedCount: 0,
        };
      } else {
        streak.history[today].energyLevel = energy;
      }
      this.saveResilientStreak(streak);
    } catch (e) {
      console.error('Error saving user daily energy:', e);
    }
  }

  // Resilient Streak Record
  getResilientStreak(): ResilientStreakRecord {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.RESILIENT_STREAK);
      if (!data) {
        const initial = generateInitialStreak();
        this.saveResilientStreak(initial);
        return initial;
      }
      const parsed = JSON.parse(data) as ResilientStreakRecord;
      // Recalculate streak to ensure consistency
      this.recalculateStreak(parsed);
      return parsed;
    } catch (e) {
      console.error('Error getting resilient streak:', e);
      return generateInitialStreak();
    }
  }

  saveResilientStreak(streak: ResilientStreakRecord): void {
    try {
      localStorage.setItem(STORAGE_KEYS.RESILIENT_STREAK, JSON.stringify(streak));
    } catch (e) {
      console.error('Error saving resilient streak:', e);
    }
  }

  recordBlockCompleted(block: StudyBlock): void {
    const streak = this.getResilientStreak();
    const date = block.scheduledDate || formatDateToISO();

    if (!streak.history[date]) {
      streak.history[date] = {
        date,
        completedMinutes: block.durationMinutes,
        maintenanceCompleted: block.isMaintenance || block.energyRequirement === 'baixa',
        standardCompleted: !block.isMaintenance && block.energyRequirement !== 'baixa',
        energyLevel: this.getUserDailyEnergy(),
        blocksCompletedCount: 1,
      };
    } else {
      const entry = streak.history[date];
      entry.completedMinutes += block.durationMinutes;
      entry.blocksCompletedCount += 1;
      if (block.isMaintenance || block.energyRequirement === 'baixa') {
        entry.maintenanceCompleted = true;
      } else {
        entry.standardCompleted = true;
      }
    }

    streak.lastActiveDate = date;
    this.recalculateStreak(streak);
    this.saveResilientStreak(streak);
  }

  // Recalculates streak where maintenance-only days COUNT as fulfilled days
  private recalculateStreak(streak: ResilientStreakRecord): void {
    const today = formatDateToISO();
    let current = 0;
    let checkDate = today;

    // Check if today was completed (either maintenance or standard)
    const todayActivity = streak.history[today];
    const todayDone = todayActivity && (todayActivity.maintenanceCompleted || todayActivity.standardCompleted || todayActivity.completedMinutes > 0);

    if (todayDone) {
      current++;
      checkDate = addDaysToISO(today, -1);
    } else {
      // If today not done yet, streak can continue from yesterday
      checkDate = addDaysToISO(today, -1);
    }

    // Go back day by day
    while (true) {
      const activity = streak.history[checkDate];
      if (activity && (activity.maintenanceCompleted || activity.standardCompleted || activity.completedMinutes > 0)) {
        current++;
        checkDate = addDaysToISO(checkDate, -1);
      } else {
        break;
      }
    }

    streak.currentStreak = current;
    if (current > streak.longestStreak) {
      streak.longestStreak = current;
    }
  }

  // Liquid Schedule: Intelligent Rebalancing ("Cronograma Líquido")
  // Triggered when user selects "Não consigo fazer hoje"
  rebalanceLiquidSchedule(blockId: string): RebalanceResult {
    const blocks = this.getStudyBlocks();
    const targetBlock = blocks.find((b) => b.id === blockId);

    if (!targetBlock) {
      return {
        success: false,
        message: 'Bloco de estudo não encontrado.',
        wasSplit: false,
        originalBlockTitle: '',
        reallocatedTo: [],
      };
    }

    const today = formatDateToISO();
    const originalDate = targetBlock.scheduledDate || today;

    // Find the next 6 days (excluding originalDate)
    const upcomingDays: { date: string; workloadMinutes: number; dayName: string }[] = [];
    for (let i = 1; i <= 6; i++) {
      const nextDate = addDaysToISO(originalDate, i);
      // Calculate planned minutes for that day
      const dayMinutes = blocks
        .filter((b) => b.scheduledDate === nextDate && b.status !== 'concluido')
        .reduce((sum, b) => sum + b.durationMinutes, 0);

      upcomingDays.push({
        date: nextDate,
        workloadMinutes: dayMinutes,
        dayName: getDayNamePt(nextDate),
      });
    }

    // Sort days by lowest planned minutes (lightest days first)
    upcomingDays.sort((a, b) => a.workloadMinutes - b.workloadMinutes);

    const reallocatedTo: { date: string; dayName: string; minutes: number; title: string }[] = [];
    let wasSplit = false;

    // Rule: If task is long (>30 min), split into 2 smaller maintenance blocks
    // and reallocate to the subsequent days with lowest workload
    if (targetBlock.durationMinutes > 30) {
      wasSplit = true;
      const part1Duration = Math.ceil(targetBlock.durationMinutes / 2 / 5) * 5; // e.g. 45 -> 25 min or 20 min
      const part2Duration = targetBlock.durationMinutes - part1Duration;

      // Select top 2 lightest days
      const targetDay1 = upcomingDays[0];
      const targetDay2 = upcomingDays[1] || upcomingDays[0];

      // Remove the original block from active list
      const filteredBlocks = blocks.filter((b) => b.id !== targetBlock.id);

      // Create Part 1 as maintenance block
      const part1Block: StudyBlock = {
        id: 'block-' + Date.now() + '-p1',
        title: `${targetBlock.title} (Parte 1: Micro-Revisão)`,
        subject: targetBlock.subject,
        category: targetBlock.category === 'teoria' ? 'revisao' : targetBlock.category,
        energyRequirement: 'baixa',
        status: 'nao_iniciado',
        durationMinutes: Math.min(part1Duration, 25),
        scheduledDate: targetDay1.date,
        isMaintenance: true,
        notes: `Dose leve rebalanceada do dia ${originalDate}. ${targetBlock.notes || ''}`.trim(),
        originalDuration: targetBlock.durationMinutes,
        reallocatedFrom: originalDate,
        createdAt: new Date().toISOString(),
      };

      // Create Part 2 as maintenance block
      const part2Block: StudyBlock = {
        id: 'block-' + Date.now() + '-p2',
        title: `${targetBlock.title} (Parte 2: Aplicação Rápida)`,
        subject: targetBlock.subject,
        category: targetBlock.category,
        energyRequirement: 'baixa',
        status: 'nao_iniciado',
        durationMinutes: Math.min(part2Duration, 25),
        scheduledDate: targetDay2.date,
        isMaintenance: true,
        notes: `Dose complementar rebalanceada do dia ${originalDate}. ${targetBlock.notes || ''}`.trim(),
        originalDuration: targetBlock.durationMinutes,
        reallocatedFrom: originalDate,
        createdAt: new Date().toISOString(),
      };

      filteredBlocks.push(part1Block, part2Block);
      this.saveStudyBlocks(filteredBlocks);

      reallocatedTo.push(
        {
          date: targetDay1.date,
          dayName: targetDay1.dayName,
          minutes: part1Block.durationMinutes,
          title: part1Block.title,
        },
        {
          date: targetDay2.date,
          dayName: targetDay2.dayName,
          minutes: part2Block.durationMinutes,
          title: part2Block.title,
        }
      );
    } else {
      // Short task (<= 30 min): move to the lightest subsequent day as maintenance
      const targetDay = upcomingDays[0];
      const updatedBlocks = blocks.map((b) => {
        if (b.id === targetBlock.id) {
          return {
            ...b,
            scheduledDate: targetDay.date,
            isMaintenance: true,
            energyRequirement: 'baixa' as const,
            reallocatedFrom: originalDate,
            notes: `Remanejado do dia ${originalDate} para equilíbrio de carga. ${b.notes || ''}`.trim(),
          };
        }
        return b;
      });

      this.saveStudyBlocks(updatedBlocks);

      reallocatedTo.push({
        date: targetDay.date,
        dayName: targetDay.dayName,
        minutes: targetBlock.durationMinutes,
        title: targetBlock.title,
      });
    }

    return {
      success: true,
      message:
        'Tudo bem, descanso faz parte da retenção. Remanejámos o conteúdo em doses menores para os seus dias mais leves.',
      wasSplit,
      originalBlockTitle: targetBlock.title,
      reallocatedTo,
    };
  }

  // Calculate weekly workload summary
  getWeeklyWorkload(startDateISO: string = formatDateToISO()): {
    date: string;
    dayName: string;
    totalMinutes: number;
    completedMinutes: number;
    blocksCount: number;
    isToday: boolean;
  }[] {
    const blocks = this.getStudyBlocks();
    const today = formatDateToISO();
    const result = [];

    // 7 days view
    for (let i = 0; i < 7; i++) {
      const date = addDaysToISO(startDateISO, i);
      const dayBlocks = blocks.filter((b) => b.scheduledDate === date);
      const totalMinutes = dayBlocks.reduce((sum, b) => sum + b.durationMinutes, 0);
      const completedMinutes = dayBlocks
        .filter((b) => b.status === 'concluido')
        .reduce((sum, b) => sum + b.durationMinutes, 0);

      result.push({
        date,
        dayName: getDayNamePt(date, true),
        totalMinutes,
        completedMinutes,
        blocksCount: dayBlocks.length,
        isToday: date === today,
      });
    }

    return result;
  }

  // Reset to sample data if user wants to restore fresh state
  resetAllData(): void {
    const today = formatDateToISO();
    const sampleBlocks = generateInitialSampleBlocks(today);
    const sampleStreak = generateInitialStreak(today);
    this.saveStudyBlocks(sampleBlocks);
    this.saveResilientStreak(sampleStreak);
    this.setUserDailyEnergy('media');
  }
}

export const storageService = new StorageService();
