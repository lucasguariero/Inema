import React, { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CardItem } from '@/types/card-sorting';
import { SortableCard } from '@/components/SortableCard';
import { cn } from '@/lib/utils';
import { Folder, Trash2, Edit2, Check, X, Layers, HelpCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface DroppableContainerProps {
  id: string;
  title: string;
  isUnassigned?: boolean;
  cards: CardItem[];
  onRename?: (id: string, newTitle: string) => void;
  onDelete?: (id: string) => void;
}

export const DroppableContainer: React.FC<DroppableContainerProps> = ({
  id,
  title,
  isUnassigned = false,
  cards,
  onRename,
  onDelete,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id,
    data: {
      type: 'Container',
      containerId: id,
    },
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);

  const handleSaveRename = () => {
    if (editedTitle.trim() && onRename) {
      onRename(id, editedTitle.trim());
    }
    setIsEditing(false);
  };

  const handleCancelRename = () => {
    setEditedTitle(title);
    setIsEditing(false);
  };

  const cardIds = cards.map((c) => c.id);

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex flex-col rounded-xl border transition-all duration-200",
        isUnassigned
          ? "bg-slate-100/70 border-slate-200/80 shadow-inner"
          : "bg-white border-slate-200/90 shadow-xs hover:border-slate-300",
        isOver && "ring-2 ring-[#0F4C3A] border-emerald-400 bg-emerald-50/20"
      )}
    >
      {/* Header do Container */}
      <div className={cn(
        "p-3.5 border-b flex items-center justify-between gap-2 rounded-t-xl",
        isUnassigned ? "bg-slate-200/60 border-slate-200" : "bg-slate-50/80 border-slate-100"
      )}>
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className={cn(
            "p-1.5 rounded-md shrink-0",
            isUnassigned ? "bg-slate-200 text-slate-700" : "bg-emerald-50 text-[#0F4C3A]"
          )}>
            {isUnassigned ? <Layers className="w-4 h-4" /> : <Folder className="w-4 h-4" />}
          </div>

          {isEditing && !isUnassigned ? (
            <div className="flex items-center gap-1 flex-1">
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveRename();
                  if (e.key === 'Escape') handleCancelRename();
                }}
                className="h-7 text-xs font-semibold px-2 border border-emerald-500 rounded bg-white w-full focus:outline-hidden"
                autoFocus
              />
              <button
                onClick={handleSaveRename}
                className="p-1 rounded hover:bg-emerald-100 text-emerald-800"
                title="Salvar nome"
              >
                <Check className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleCancelRename}
                className="p-1 rounded hover:bg-slate-200 text-slate-500"
                title="Cancelar"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 truncate">
              <h3 className="text-xs sm:text-sm font-bold text-slate-800 truncate" title={title}>
                {title}
              </h3>
              {!isUnassigned && onRename && (
                <button
                  onClick={() => {
                    setEditedTitle(title);
                    setIsEditing(true);
                  }}
                  className="opacity-40 hover:opacity-100 text-slate-600 transition-opacity p-0.5 rounded hover:bg-slate-200"
                  title="Renomear grupo"
                >
                  <Edit2 className="w-3 h-3" />
                </button>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Badge
            variant={cards.length > 0 ? "brand" : "secondary"}
            className="text-[11px] font-mono px-2 py-0.5"
          >
            {cards.length} {cards.length === 1 ? 'item' : 'itens'}
          </Badge>

          {!isUnassigned && onDelete && (
            <button
              onClick={() => onDelete(id)}
              className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
              title="Excluir este grupo (os módulos retornarão aos soltos)"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Lista Sortable de Cartões */}
      <div className={cn(
        "p-3 flex-1 flex flex-col gap-2.5 min-h-[160px] overflow-y-auto max-h-[calc(100vh-280px)]",
        isUnassigned ? "max-h-[calc(100vh-250px)]" : ""
      )}>
        <SortableContext items={cardIds} strategy={verticalListSortingStrategy}>
          {cards.map((card) => (
            <SortableCard key={card.id} card={card} />
          ))}
        </SortableContext>

        {cards.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-200 rounded-lg text-center text-slate-400">
            <HelpCircle className="w-6 h-6 mb-1 text-slate-300 stroke-1" />
            <p className="text-xs font-medium text-slate-500">
              {isUnassigned ? 'Todos os módulos foram agrupados!' : 'Solte os módulos aqui'}
            </p>
            <p className="text-[10px] text-slate-400 mt-0.5">
              {isUnassigned ? 'Excelente organização!' : 'Arraste cartões da esquerda para este grupo'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
