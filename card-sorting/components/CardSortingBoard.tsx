import React, { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates, arrayMove } from '@dnd-kit/sortable';
import confetti from 'canvas-confetti';
import {
  CardItem,
  GroupContainer,
  Participant,
  CardSortingSubmission,
} from '@/types/card-sorting';
import { INITIAL_MODULES } from '@/data/initial-modules';
import { DroppableContainer } from '@/components/DroppableContainer';
import { SortableCard } from '@/components/SortableCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { saveCardSortingSubmission } from '@/lib/supabase';
import {
  Plus,
  Save,
  CheckCircle2,
  Copy,
  Download,
  RotateCcw,
  Sparkles,
  Layers,
  Building2,
  Code2,
  X,
  AlertCircle
} from 'lucide-react';

interface CardSortingBoardProps {
  participant: Participant;
  onResetParticipant: () => void;
}

export const CardSortingBoard: React.FC<CardSortingBoardProps> = ({
  participant,
  onResetParticipant,
}) => {
  // Inicialização de módulos indexados por ID
  const initialCardsMap = INITIAL_MODULES.reduce((acc, card) => {
    acc[card.id] = card;
    return acc;
  }, {} as Record<string, CardItem>);

  const [cards] = useState<Record<string, CardItem>>(initialCardsMap);

  // Grupos criados pelo usuário (iniciados com 3 sugestões editáveis)
  const [groups, setGroups] = useState<GroupContainer[]>([
    { id: 'group-1', name: 'Regulação & Processos', createdAt: new Date().toISOString() },
    { id: 'group-2', name: 'Fiscalização & Emergências', createdAt: new Date().toISOString() },
    { id: 'group-3', name: 'Biodiversidade & Unidades de Conservação', createdAt: new Date().toISOString() },
  ]);

  // Estrutura de containers: 'unassigned' + cada group.id
  const [items, setItems] = useState<Record<string, string[]>>({
    unassigned: INITIAL_MODULES.map((c) => c.id),
    'group-1': [],
    'group-2': [],
    'group-3': [],
  });

  const [activeCardId, setActiveCardId] = useState<string | null>(null);

  // Estados de criação de novo grupo
  const [newGroupName, setNewGroupName] = useState('');
  const [isAddingGroup, setIsAddingGroup] = useState(false);

  // Estados de salvamento / submissão
  const [isSaving, setIsSaving] = useState(false);
  const [submittedData, setSubmittedData] = useState<CardSortingSubmission | null>(null);
  const [saveStatusMessage, setSaveStatusMessage] = useState<string>('');
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);

  // Sensores do DnD Kit (distância mínima de 5px para não disparar em cliques)
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Localizador de qual container contém determinado cardId
  const findContainer = (id: string): string | null => {
    if (id in items) return id;
    for (const containerId of Object.keys(items)) {
      if (items[containerId].includes(id)) {
        return containerId;
      }
    }
    return null;
  };

  // Handlers do Drag and Drop
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveCardId(active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeContainer = findContainer(activeId);
    const overContainer = findContainer(overId);

    if (!activeContainer || !overContainer || activeContainer === overContainer) {
      return;
    }

    setItems((prev) => {
      const activeItems = prev[activeContainer];
      const overItems = prev[overContainer];

      const activeIndex = activeItems.indexOf(activeId);
      const overIndex = overItems.indexOf(overId);

      let newIndex: number;
      if (overId in prev) {
        newIndex = overItems.length + 1;
      } else {
        const isBelowOverItem =
          over &&
          active.rect.current.translated &&
          active.rect.current.translated.top > over.rect.top + over.rect.height;

        const modifier = isBelowOverItem ? 1 : 0;
        newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
      }

      return {
        ...prev,
        [activeContainer]: prev[activeContainer].filter((item) => item !== activeId),
        [overContainer]: [
          ...prev[overContainer].slice(0, newIndex),
          items[activeContainer][activeIndex],
          ...prev[overContainer].slice(newIndex, prev[overContainer].length),
        ],
      };
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    const activeId = active.id as string;
    const overId = over ? (over.id as string) : null;

    const activeContainer = findContainer(activeId);
    const overContainer = overId ? findContainer(overId) : null;

    if (!activeContainer || !overContainer || activeContainer !== overContainer) {
      setActiveCardId(null);
      return;
    }

    const activeIndex = items[activeContainer].indexOf(activeId);
    const overIndex = items[overContainer].indexOf(overId!);

    if (activeIndex !== overIndex) {
      setItems((prev) => ({
        ...prev,
        [overContainer]: arrayMove(prev[overContainer], activeIndex, overIndex),
      }));
    }

    setActiveCardId(null);
  };

  // Gerenciamento de Grupos
  const handleAddGroup = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = newGroupName.trim();
    if (!trimmed) return;

    const newId = `group-${Date.now()}`;
    const newGroup: GroupContainer = {
      id: newId,
      name: trimmed,
      createdAt: new Date().toISOString(),
    };

    setGroups((prev) => [...prev, newGroup]);
    setItems((prev) => ({
      ...prev,
      [newId]: [],
    }));

    setNewGroupName('');
    setIsAddingGroup(false);
  };

  const handleRenameGroup = (groupId: string, newTitle: string) => {
    setGroups((prev) =>
      prev.map((g) => (g.id === groupId ? { ...g, name: newTitle } : g))
    );
  };

  const handleDeleteGroup = (groupId: string) => {
    const cardsToReturn = items[groupId] || [];
    setItems((prev) => {
      const next = { ...prev };
      delete next[groupId];
      next.unassigned = [...next.unassigned, ...cardsToReturn];
      return next;
    });
    setGroups((prev) => prev.filter((g) => g.id !== groupId));
  };

  // Métricas de progresso
  const totalCardsCount = INITIAL_MODULES.length;
  const unassignedCount = items.unassigned?.length || 0;
  const assignedCount = totalCardsCount - unassignedCount;
  const progressPercentage = Math.round((assignedCount / totalCardsCount) * 100);

  // Ação de Salvar Estrutura
  const handleSaveStructure = async () => {
    setIsSaving(true);
    setSaveStatusMessage('Compilando arquitetura...');

    const submissionPayload: CardSortingSubmission = {
      participant_name: participant.name,
      participant_department: participant.department,
      submitted_at: new Date().toISOString(),
      summary: {
        total_cards: totalCardsCount,
        total_groups: groups.length,
        assigned_cards: assignedCount,
        unassigned_cards: unassignedCount,
        assigned_percentage: progressPercentage,
      },
      structure_payload: {
        groups: groups.map((g) => ({
          group_id: g.id,
          group_name: g.name,
          cards: (items[g.id] || []).map((cardId) => {
            const card = cards[cardId];
            return {
              id: card.id,
              code: card.code,
              title: card.title,
            };
          }),
        })),
        unassigned_cards: (items.unassigned || []).map((cardId) => {
          const card = cards[cardId];
          return {
            id: card.id,
            code: card.code,
            title: card.title,
          };
        }),
      },
    };

    const result = await saveCardSortingSubmission(submissionPayload);

    setIsSaving(false);
    setSubmittedData(submissionPayload);

    if (result.persistedToSupabase) {
      setSaveStatusMessage('Sua proposta de organização foi registrada com sucesso.');
    } else {
      setSaveStatusMessage('Sua proposta de organização foi gravada com sucesso.');
    }

    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#0F4C3A', '#22c55e', '#10b981', '#3b82f6'],
      });
    } catch {
      // Ignora erro se canvas não estiver disponível
    }
  };

  const handleCopySummary = () => {
    if (!submittedData) return;
    const textLines = [
      `PROPOSTA DE ARQUITETURA DE INFORMAÇÃO — SEIA V2`,
      `Participante: ${submittedData.participant_name} (${submittedData.participant_department})`,
      `Data de Submissão: ${new Date(submittedData.submitted_at).toLocaleString('pt-BR')}`,
      `Total de Grupos: ${submittedData.summary.total_groups} | Módulos Alocados: ${submittedData.summary.assigned_cards}/${submittedData.summary.total_cards} (${submittedData.summary.assigned_percentage}%)`,
      ``,
      `--- GRUPOS E MÓDULOS PROPOSTOS ---`
    ];

    submittedData.structure_payload.groups.forEach((g, idx) => {
      textLines.push(`\n${idx + 1}. [${g.group_name}] (${g.cards.length} módulos)`);
      if (g.cards.length === 0) {
        textLines.push(`   (Nenhum módulo alocado)`);
      } else {
        g.cards.forEach((c) => {
          textLines.push(`   • [${c.code || 'MOD'}] ${c.title}`);
        });
      }
    });

    if (submittedData.structure_payload.unassigned_cards.length > 0) {
      textLines.push(`\n--- MÓDULOS NÃO ALOCADOS (${submittedData.structure_payload.unassigned_cards.length}) ---`);
      submittedData.structure_payload.unassigned_cards.forEach((c) => {
        textLines.push(`   • [${c.code || 'MOD'}] ${c.title}`);
      });
    }

    navigator.clipboard.writeText(textLines.join('\n'));
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2500);
  };

  const handleDownloadJson = () => {
    if (!submittedData) return;
    const blob = new Blob([JSON.stringify(submittedData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `card-sorting-${participant.name.toLowerCase().replace(/\s+/g, '-')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const activeCard = activeCardId ? cards[activeCardId] : null;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* Topbar Institucional */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#0F4C3A] flex items-center justify-center text-white font-bold text-xs shadow-xs">
              IN
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#0F4C3A]">
                  Card Sorting
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-xs text-slate-500">Novo INEMA</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
                <span>{participant.name}</span>
                <span className="text-slate-400 font-normal">({participant.department})</span>
              </div>
            </div>
          </div>

          {/* Barra de Progresso e Ação de Salvar */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col items-end mr-2">
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-slate-500">Agrupados:</span>
                <strong className="text-slate-800 font-mono">
                  {assignedCount} / {totalCardsCount}
                </strong>
                <Badge variant={progressPercentage === 100 ? "brand" : "secondary"} className="text-[10px]">
                  {progressPercentage}%
                </Badge>
              </div>
              <div className="w-32 h-1.5 bg-slate-200 rounded-full overflow-hidden mt-1">
                <div
                  className="h-full bg-[#0F4C3A] transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>

            <Button
              onClick={handleSaveStructure}
              disabled={isSaving}
              className="bg-[#0F4C3A] hover:bg-[#0b382b] text-white flex items-center gap-1.5 text-xs font-semibold h-9 px-4"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Salvando...' : 'Salvar Estrutura'}</span>
            </Button>

            <button
              onClick={onResetParticipant}
              className="text-xs text-slate-500 hover:text-slate-800 hover:bg-slate-100 p-2 rounded-md transition-colors"
              title="Trocar participante"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* DndContext Principal */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* COLUNA ESQUERDA: Módulos Soltos (Unassigned) */}
          <aside className="lg:col-span-4 flex flex-col gap-3">
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-[#0F4C3A]" />
                    Módulos Soltos
                  </h2>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Arraste os módulos para os grupos na direita
                  </p>
                </div>
                <Badge variant={unassignedCount > 0 ? "secondary" : "brand"} className="text-xs font-mono">
                  {unassignedCount} pendentes
                </Badge>
              </div>
            </div>

            <DroppableContainer
              id="unassigned"
              title="Cartões Disponíveis para Agrupamento"
              isUnassigned={true}
              cards={(items.unassigned || []).map((id) => cards[id]).filter(Boolean)}
            />
          </aside>

          {/* ÁREA DIREITA: Grid de Grupos / Containers Criados */}
          <section className="lg:col-span-8 flex flex-col gap-4">
            {/* Header de Ação dos Grupos */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-[#0F4C3A]" />
                  Grupos Criados ({groups.length})
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Crie quantos grupos desejar e dê os nomes de menus que você gostaria de ver no sistema.
                </p>
              </div>

              {isAddingGroup ? (
                <form onSubmit={handleAddGroup} className="flex items-center gap-2 w-full sm:w-auto">
                  <Input
                    placeholder="Nome do novo grupo..."
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                    className="h-8 text-xs w-full sm:w-56"
                    autoFocus
                  />
                  <Button type="submit" size="sm" className="bg-[#0F4C3A] hover:bg-[#0b382b] text-white h-8 text-xs">
                    Criar
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setIsAddingGroup(false);
                      setNewGroupName('');
                    }}
                    className="h-8 px-2 text-slate-500 hover:text-slate-800"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </form>
              ) : (
                <Button
                  onClick={() => setIsAddingGroup(true)}
                  variant="outline"
                  size="sm"
                  className="border-dashed border-[#0F4C3A] text-[#0F4C3A] hover:bg-emerald-50 h-8 text-xs font-semibold flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Novo Grupo</span>
                </Button>
              )}
            </div>

            {/* Grid Responsivo de Grupos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {groups.map((group) => (
                <DroppableContainer
                  key={group.id}
                  id={group.id}
                  title={group.name}
                  cards={(items[group.id] || []).map((id) => cards[id]).filter(Boolean)}
                  onRename={handleRenameGroup}
                  onDelete={handleDeleteGroup}
                />
              ))}

              {groups.length === 0 && (
                <div className="col-span-full p-12 text-center bg-white rounded-xl border-2 border-dashed border-slate-300">
                  <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <h3 className="text-sm font-semibold text-slate-700">Nenhum grupo criado ainda</h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                    Clique no botão &quot;Novo Grupo&quot; acima para começar a definir os menus e categorias do sistema.
                  </p>
                </div>
              )}
            </div>
          </section>
        </main>

        {/* Drag Overlay para fluidez visual enquanto arrasta */}
        <DragOverlay>
          {activeCard ? <SortableCard card={activeCard} isOverlay={true} /> : null}
        </DragOverlay>
      </DndContext>

      {/* Modal de Conclusão e Resumo da Estrutura */}
      {submittedData && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            <div className="bg-emerald-50 p-5 sm:p-6 border-b border-emerald-100 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-[#0F4C3A] text-white flex items-center justify-center shadow-md shrink-0">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">
                    Proposta Registrada com Sucesso!
                  </h3>
                  <p className="text-xs text-emerald-800 mt-0.5">
                    Obrigado pela colaboração! Sua organização servirá de insumo direto para o menu do novo SEIA.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSubmittedData(null)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-md hover:bg-emerald-100/50 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1">
              {/* Resumo de Métricas */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
                  <div className="text-[11px] text-slate-500 font-medium">Grupos Criados</div>
                  <div className="text-lg font-bold text-slate-800 font-mono mt-0.5">
                    {submittedData.summary.total_groups}
                  </div>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
                  <div className="text-[11px] text-slate-500 font-medium">Módulos Alocados</div>
                  <div className="text-lg font-bold text-[#0F4C3A] font-mono mt-0.5">
                    {submittedData.summary.assigned_cards} / {submittedData.summary.total_cards}
                  </div>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
                  <div className="text-[11px] text-slate-500 font-medium">Conclusão</div>
                  <div className="text-lg font-bold text-slate-800 font-mono mt-0.5">
                    {submittedData.summary.assigned_percentage}%
                  </div>
                </div>
              </div>

              {/* Lista dos Grupos Definidos pelo Participante */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs text-slate-700 font-semibold">
                  <span className="flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-[#0F4C3A]" />
                    Estrutura de Menus Proposta:
                  </span>
                  <span className="text-[11px] text-slate-500 font-normal">
                    {submittedData.summary.total_groups} categorias
                  </span>
                </div>

                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {submittedData.structure_payload.groups.map((group, idx) => (
                    <div
                      key={group.group_id}
                      className="p-3 rounded-xl border border-slate-200 bg-slate-50/60 flex flex-col gap-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                          <span className="w-4 h-4 rounded-full bg-emerald-100 text-[#0F4C3A] text-[10px] flex items-center justify-center font-mono">
                            {idx + 1}
                          </span>
                          {group.group_name}
                        </span>
                        <Badge variant="secondary" className="text-[10px] font-mono">
                          {group.cards.length} {group.cards.length === 1 ? 'módulo' : 'módulos'}
                        </Badge>
                      </div>

                      {group.cards.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {group.cards.map((card) => (
                            <span
                              key={card.id}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[11px] text-slate-700 font-medium shadow-2xs"
                            >
                              {card.code && (
                                <span className="font-mono text-[9px] text-slate-500">{card.code}</span>
                              )}
                              <span>{card.title}</span>
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400 italic">Nenhum cartão alocado neste grupo.</span>
                      )}
                    </div>
                  ))}

                  {submittedData.structure_payload.unassigned_cards.length > 0 && (
                    <div className="p-3 rounded-xl border border-amber-200 bg-amber-50/60 flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-amber-900">
                          Módulos Não Alocados
                        </span>
                        <Badge variant="secondary" className="text-[10px] font-mono text-amber-800 bg-amber-100">
                          {submittedData.structure_payload.unassigned_cards.length} restantes
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {submittedData.structure_payload.unassigned_cards.map((card) => (
                          <span
                            key={card.id}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white border border-amber-200 text-[11px] text-slate-700 font-medium"
                          >
                            {card.code && (
                              <span className="font-mono text-[9px] text-slate-500">{card.code}</span>
                            )}
                            <span>{card.title}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs text-slate-500">
                Participante: <strong className="text-slate-700">{submittedData.participant_name}</strong>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  onClick={handleCopySummary}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1.5 text-xs cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedSummary ? 'Resumo Copiado!' : 'Copiar Resumo'}</span>
                </Button>
                <Button
                  onClick={handleDownloadJson}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1.5 text-xs cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Baixar JSON</span>
                </Button>
                <Button
                  onClick={() => setSubmittedData(null)}
                  size="sm"
                  className="bg-[#0F4C3A] hover:bg-[#0b382b] text-white flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
                >
                  <span>Concluir</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
