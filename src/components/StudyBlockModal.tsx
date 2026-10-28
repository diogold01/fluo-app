import React, { useState, useEffect } from 'react';
import { X, Sparkles, Zap, BatteryMedium, BatteryLow, ShieldCheck, Clock } from 'lucide-react';
import { StudyBlock, EnergyRequirement, BlockCategory } from '../types';
import { formatDateToISO } from '../services/storageService';

interface StudyBlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<StudyBlock, 'id' | 'createdAt'>, existingId?: string) => void;
  initialBlock?: StudyBlock | null;
}

export const StudyBlockModal: React.FC<StudyBlockModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialBlock,
}) => {
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState<BlockCategory>('teoria');
  const [energyRequirement, setEnergyRequirement] = useState<EnergyRequirement>('media');
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [scheduledDate, setScheduledDate] = useState(formatDateToISO());
  const [isMaintenance, setIsMaintenance] = useState(false);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (initialBlock) {
      setTitle(initialBlock.title);
      setSubject(initialBlock.subject);
      setCategory(initialBlock.category);
      setEnergyRequirement(initialBlock.energyRequirement);
      setDurationMinutes(initialBlock.durationMinutes);
      setScheduledDate(initialBlock.scheduledDate);
      setIsMaintenance(initialBlock.isMaintenance);
      setNotes(initialBlock.notes || '');
    } else {
      setTitle('');
      setSubject('');
      setCategory('teoria');
      setEnergyRequirement('media');
      setDurationMinutes(30);
      setScheduledDate(formatDateToISO());
      setIsMaintenance(false);
      setNotes('');
    }
  }, [initialBlock, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !subject.trim()) return;

    onSave(
      {
        title: title.trim(),
        subject: subject.trim(),
        category,
        energyRequirement,
        durationMinutes: Number(durationMinutes),
        scheduledDate,
        isMaintenance: isMaintenance || durationMinutes <= 15,
        status: initialBlock ? initialBlock.status : 'nao_iniciado',
        notes: notes.trim() || undefined,
      },
      initialBlock?.id
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl shadow-black/40 text-slate-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              {initialBlock ? 'Editar Bloco de Estudo' : 'Novo Bloco de Estudo'}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Título do Conteúdo / Objetivo
            </label>
            <input
              type="text"
              required
              placeholder="ex.: Revisão de Limites e Derivadas ou Grafos BFS"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* Subject & Category Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Disciplina / Área
              </label>
              <input
                type="text"
                required
                placeholder="ex.: Cálculo, Algoritmos, Direito"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Categoria
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as BlockCategory)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors"
              >
                <option value="teoria">Teoria Conceitual</option>
                <option value="exercicios">Resolução de Exercícios</option>
                <option value="revisao">Revisão Espaçada</option>
                <option value="leitura">Leitura & Artigos</option>
                <option value="projeto">Projeto Prático</option>
              </select>
            </div>
          </div>

          {/* Energy Requirement Selector */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Demanda de Energia Cognitiva
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setEnergyRequirement('alta')}
                className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-medium border transition-all ${
                  energyRequirement === 'alta'
                    ? 'bg-amber-500/20 text-amber-200 border-amber-500/50'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                }`}
              >
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Alta (⚡)</span>
              </button>

              <button
                type="button"
                onClick={() => setEnergyRequirement('media')}
                className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-medium border transition-all ${
                  energyRequirement === 'media'
                    ? 'bg-emerald-500/20 text-emerald-200 border-emerald-500/50'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                }`}
              >
                <BatteryMedium className="w-3.5 h-3.5 text-emerald-400" />
                <span>Média (🔋)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setEnergyRequirement('baixa');
                  setIsMaintenance(true);
                  if (durationMinutes > 30) setDurationMinutes(15);
                }}
                className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-medium border transition-all ${
                  energyRequirement === 'baixa'
                    ? 'bg-teal-500/20 text-teal-200 border-teal-500/50'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                }`}
              >
                <BatteryLow className="w-3.5 h-3.5 text-teal-400" />
                <span>Baixa (🪫)</span>
              </button>
            </div>
          </div>

          {/* Duration & Scheduled Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Duração Planejada
              </label>
              <select
                value={durationMinutes}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setDurationMinutes(val);
                  if (val <= 15) setIsMaintenance(true);
                }}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors"
              >
                <option value={15}>15 minutos (Micro-Dose)</option>
                <option value={25}>25 minutos (Pomodoro)</option>
                <option value={30}>30 minutos (Padrão)</option>
                <option value={45}>45 minutos (Aprofundado)</option>
                <option value={60}>60 minutos (Intenso)</option>
                <option value={90}>90 minutos (Imersão)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Data do Cronograma
              </label>
              <input
                type="date"
                required
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          {/* Micro-maintenance checkbox */}
          <label className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-950/80 border border-slate-800 cursor-pointer text-xs text-slate-300 hover:border-slate-700 transition-colors">
            <input
              type="checkbox"
              checked={isMaintenance}
              onChange={(e) => setIsMaintenance(e.target.checked)}
              className="rounded border-slate-700 bg-slate-900 text-teal-500 focus:ring-teal-500"
            />
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-teal-400" />
              <span>
                <strong>Micro-tarefa de baixa energia (Modo Manutenção):</strong> conta para o streak mesmo em dias de cansaço.
              </span>
            </div>
          </label>

          {/* Notes */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Notas ou Pontos-Chave (opcional)
            </label>
            <textarea
              rows={2}
              placeholder="ex.: Focar nos exercícios ímpares da página 45"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
            />
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-md active:scale-95"
            >
              {initialBlock ? 'Salvar Alterações' : 'Criar Bloco'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
