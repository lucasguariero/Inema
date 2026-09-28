import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { CardItem } from '@/types/card-sorting';
import { GripVertical, Layers } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface SortableCardProps {
  card: CardItem;
  isOverlay?: boolean;
}

export const SortableCard: React.FC<SortableCardProps> = ({ card, isOverlay = false }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: card.id,
    data: {
      type: 'Card',
      card,
    },
    disabled: isOverlay,
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        "group relative rounded-lg border border-slate-200 bg-white p-3.5 transition-all select-none",
        "hover:border-emerald-500 hover:shadow-md hover:-translate-y-0.5",
        "cursor-grab active:cursor-grabbing",
        isDragging && "opacity-30 border-dashed border-emerald-400 bg-emerald-50/40 shadow-none",
        isOverlay && "border-[#0F4C3A] shadow-xl rotate-1 scale-102 cursor-grabbing ring-2 ring-[#0F4C3A]/20 bg-white z-50"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          {card.code && (
            <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200 font-semibold">
              {card.code}
            </span>
          )}
          {card.systemOrigin && (
            <Badge variant="brand" className="text-[10px] px-1.5 py-0">
              {card.systemOrigin}
            </Badge>
          )}
        </div>
        <div className="text-slate-400 group-hover:text-emerald-700 transition-colors shrink-0">
          <GripVertical className="w-4 h-4" />
        </div>
      </div>

      <h4 className="text-xs sm:text-sm font-semibold text-slate-900 mt-2 leading-snug">
        {card.title}
      </h4>

      <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
        {card.description}
      </p>
    </div>
  );
};
