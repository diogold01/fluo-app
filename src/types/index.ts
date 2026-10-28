export type EnergyRequirement = 'alta' | 'media' | 'baixa';

export type BlockStatus = 'nao_iniciado' | 'em_andamento' | 'concluido' | 'remanejado';

export type BlockCategory = 'teoria' | 'exercicios' | 'revisao' | 'leitura' | 'projeto';

export interface StudyBlock {
  id: string;
  title: string;
  subject: string;
  category: BlockCategory;
  energyRequirement: EnergyRequirement;
  status: BlockStatus;
  durationMinutes: number; // ex: 15, 30, 45, 60
  scheduledDate: string; // ISO YYYY-MM-DD
  isMaintenance: boolean; // booleano para micro-tarefas de baixa energia
  notes?: string;
  originalDuration?: number;
  reallocatedFrom?: string; // original ISO date if rebalanced
  completedAt?: string;
  createdAt: string;
}

export type UserDailyEnergy = 'alta' | 'media' | 'baixa';

export interface DayStreakActivity {
  date: string; // ISO YYYY-MM-DD
  completedMinutes: number;
  maintenanceCompleted: boolean;
  standardCompleted: boolean;
  energyLevel: UserDailyEnergy | null;
  blocksCompletedCount: number;
}

export interface ResilientStreakRecord {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string | null;
  history: Record<string, DayStreakActivity>;
}

export interface ToastMessage {
  id: string;
  type: 'info' | 'success' | 'comfort' | 'warning';
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  durationMs?: number;
}

export interface RebalanceResult {
  success: boolean;
  message: string;
  wasSplit: boolean;
  originalBlockTitle: string;
  reallocatedTo: {
    date: string;
    dayName: string;
    minutes: number;
    title: string;
  }[];
}
