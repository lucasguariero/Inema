import React, { useState, useRef, useEffect, useId } from 'react';
import { ChevronDown, Check, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import * as Popover from '@radix-ui/react-popover';

export interface SelectOption {
  value: string;
  label: string;
  group?: string;
  badge?: string;
  description?: string;
}

export interface FilamentSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: (string | SelectOption)[];
  placeholder?: string;
  disabled?: boolean;
  searchable?: boolean;
  className?: string;
  prefixIcon?: React.ComponentType<{ className?: string }>;
  id?: string;
  name?: string;
  required?: boolean;
  ariaLabel?: string;
  'aria-describedby'?: string;
  'aria-invalid'?: boolean;
  /** Legacy compatibility flag. All popovers now use a portal without changing form layout. */
  inlinePopup?: boolean;
}

export const FilamentSelect: React.FC<FilamentSelectProps> = ({
  value,
  onChange,
  options,
  placeholder = 'Selecione...',
  disabled = false,
  searchable = false,
  className,
  prefixIcon: PrefixIcon,
  id,
  name,
  required = false,
  ariaLabel,
  'aria-describedby': describedBy,
  'aria-invalid': invalid,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const [activeIndex, setActiveIndex] = useState(0);
  const fold = (text: string) => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase();

  // Normaliza opções
  const normalizedOptions: SelectOption[] = options.map((opt) =>
    typeof opt === 'string' ? { value: opt, label: opt } : opt
  );

  const selectedOption = normalizedOptions.find((opt) => opt.value === value);

  // Auto-habilita busca se tiver mais de 8 opções e searchable não estiver explicitamente false
  const shouldEnableSearch = searchable || normalizedOptions.length > 8;

  const filteredOptions = normalizedOptions.filter((opt) =>
    fold(opt.label).includes(fold(searchTerm)) || (opt.group ? fold(opt.group).includes(fold(searchTerm)) : false)
  );

  useEffect(() => {
    if (!isOpen || !listRef.current) return;
    const list = listRef.current, option = list.querySelectorAll<HTMLElement>('[role="option"]')[activeIndex];
    if (!option) return;
    const row = option.getBoundingClientRect(), bounds = list.getBoundingClientRect();
    if (row.top < bounds.top) list.scrollTop -= bounds.top - row.top;
    else if (row.bottom > bounds.bottom) list.scrollTop += row.bottom - bounds.bottom;
  }, [isOpen, activeIndex]);
  const close = (restore = true) => {
    setIsOpen(false); setSearchTerm('');
    if (restore) triggerRef.current?.focus({ preventScroll: true });
  };
  const open = (last = false) => {
    setSearchTerm('');
    const selected = normalizedOptions.findIndex(opt => opt.value === value);
    setActiveIndex(last ? normalizedOptions.length - 1 : Math.max(0, selected));
    setIsOpen(true);
  };
  const keyboard = (e: React.KeyboardEvent, searching = false) => {
    if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); close(); }
    else if (e.key === 'Tab') close(); // Leave the trigger by native Tab / Shift+Tab order.
    else if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(e.key)) {
      e.preventDefault();
      const last = Math.max(0, filteredOptions.length - 1);
      setActiveIndex(i => e.key === 'Home' ? 0 : e.key === 'End' ? last : Math.max(0, Math.min(last, i + (e.key === 'ArrowDown' ? 1 : -1))));
    } else if (e.key === 'Enter' || (e.key === ' ' && !searching)) {
      e.preventDefault();
      if (filteredOptions[activeIndex]) handleSelect(filteredOptions[activeIndex].value);
    }
  };

  const handleSelect = (val: string) => {
    onChange(val);
    close();
  };

  return (
    <Popover.Root open={isOpen} modal={false} onOpenChange={next => next ? open() : close(false)}>
    <div ref={containerRef} className={cn('relative w-full', className)}>
      {/* Hidden input para compatibilidade com formulários */}
      {name && <input type="hidden" name={name} value={value} required={required} />}

      {/* Trigger Button com visual Filament */}
      <Popover.Trigger asChild><button
        type="button"
        id={id}
        ref={triggerRef}
        aria-controls={isOpen ? listId : undefined}
        aria-label={ariaLabel}
        aria-describedby={describedBy}
        aria-invalid={invalid}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        disabled={disabled}
        onKeyDown={e => { if (!disabled && ['ArrowDown', 'ArrowUp'].includes(e.key)) { e.preventDefault(); open(e.key === 'ArrowUp'); } }}
        className={cn(
          'fi-select-trigger fi-input-wrp w-full min-h-9 text-left text-xs rounded-lg border flex items-center justify-between gap-2 px-3 py-2 transition-all cursor-pointer shadow-2xs outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-green-alpha-20)] focus-visible:border-[var(--input-border-focus)]',
          disabled
            ? 'bg-slate-100 dark:bg-slate-800/60 border-slate-200 dark:border-slate-800 text-slate-400 cursor-not-allowed opacity-60'
            : isOpen
            ? 'bg-white dark:bg-slate-800 border-[var(--input-border-focus)] ring-2 ring-[var(--color-green-alpha-20)] text-slate-900 dark:text-slate-100'
            : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 hover:border-slate-400 dark:hover:border-slate-600'
        )}
      >
        <div className="flex items-center gap-2 truncate">
          {PrefixIcon && <PrefixIcon className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
          <span
            title={selectedOption ? (selectedOption.group ? `${selectedOption.group} · ${selectedOption.label}` : selectedOption.label) : undefined}
            className={cn('truncate font-normal', !selectedOption && 'text-slate-400')}
          >
            {selectedOption ? (selectedOption.group ? `${selectedOption.group} · ${selectedOption.label}` : selectedOption.label) : placeholder}
          </span>
        </div>
        <ChevronDown
          className={cn(
            'w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200',
            isOpen && 'rotate-180 text-[var(--color-text-link)]'
          )}
        />
      </button></Popover.Trigger>

      {/* Dropdown Popover com visual Filament */}
      {isOpen && <Popover.Portal><Popover.Content role="presentation" align="start" sideOffset={6} collisionPadding={8} avoidCollisions
        className={cn('fi-select-popover z-50 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-1.5 shadow-xl flex flex-col min-h-0', containerRef.current?.closest('.cotic-refinement') && 'cotic-refinement')}
        style={{width:'var(--radix-popover-trigger-width)',maxWidth:'calc(100vw - 16px)',maxHeight:'min(16rem, var(--radix-popover-content-available-height))'}}
        onOpenAutoFocus={e=>{e.preventDefault();(shouldEnableSearch?searchInputRef.current:listRef.current)?.focus({preventScroll:true});}}
        onCloseAutoFocus={e=>e.preventDefault()}
        onEscapeKeyDown={e=>{e.preventDefault();e.stopPropagation();close();}}>
          {/* Campo de Busca Rápida (Searchable) */}
          {shouldEnableSearch && (
            <div className="p-1 pb-1.5 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700">
                <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <input
                  ref={searchInputRef}
                  type="text"
                  role="combobox"
                  aria-label="Pesquisar opções"
                  aria-expanded="true"
                  aria-controls={listId}
                  aria-activedescendant={filteredOptions[activeIndex] ? `${listId}-${activeIndex}` : undefined}
                  onKeyDown={e => keyboard(e, true)}
                  value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); setActiveIndex(0); }}
                  placeholder="Pesquisar..."
                  className="w-full text-xs bg-transparent border-none outline-none text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
                />
              </div>
            </div>
          )}

          {/* Lista de Opções */}
          <div ref={listRef} id={listId} tabIndex={shouldEnableSearch ? -1 : 0} aria-activedescendant={!shouldEnableSearch && filteredOptions[activeIndex] ? `${listId}-${activeIndex}` : undefined} onKeyDown={e => keyboard(e)} role="listbox" aria-label={ariaLabel || placeholder} className="overflow-y-auto min-h-0 max-h-48 py-1 space-y-0.5 custom-scrollbar outline-none">
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-2 text-center text-xs text-slate-400">
                Nenhum resultado encontrado.
              </div>
            ) : (
              filteredOptions.map((opt, index) => {
                const isSelected = opt.value === value;
                const showGroupHeader = Boolean(opt.group) && (index === 0 || filteredOptions[index - 1].group !== opt.group);
                return (
                  <React.Fragment key={opt.value}>
                    {showGroupHeader && (
                      <div
                        role="presentation"
                        className={cn(
                          'px-2.5 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 select-none',
                          index === 0 ? 'pt-1' : 'pt-2.5 mt-1 border-t border-slate-100 dark:border-slate-800'
                        )}
                      >
                        {opt.group}
                      </div>
                    )}
                    <button
                      type="button"
                      role="option"
                      id={`${listId}-${index}`}
                      tabIndex={-1}
                      onMouseMove={() => setActiveIndex(index)}
                      aria-selected={isSelected}
                      onClick={() => handleSelect(opt.value)}
                      className={cn(
                        'fi-select-option w-full min-h-9 text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between gap-2 transition-colors cursor-pointer',
                        activeIndex === index && 'ring-1 ring-inset ring-[var(--input-border-focus)] bg-[var(--color-brand-primary-subtle)]',
                        isSelected
                          ? 'bg-[var(--color-brand-primary-subtle)] text-[var(--color-text-link)] font-semibold'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/70 hover:text-slate-900 dark:hover:text-slate-100'
                      )}
                    >
                      <div className="min-w-0">
                        <div className="whitespace-normal break-words">{opt.label}</div>
                        {opt.description && (
                          <span className="text-xs text-slate-400 block truncate">
                            {opt.description}
                          </span>
                        )}
                      </div>
                      {isSelected && (
                        <Check className="w-3.5 h-3.5 text-[var(--color-text-link)] shrink-0" />
                      )}
                    </button>
                  </React.Fragment>
                );
              })
            )}
          </div>
        </Popover.Content></Popover.Portal>}
    </div>
    </Popover.Root>
  );
};
