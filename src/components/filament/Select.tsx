import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SelectOption {
  value: string;
  label: string;
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
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Normaliza opções
  const normalizedOptions: SelectOption[] = options.map((opt) =>
    typeof opt === 'string' ? { value: opt, label: opt } : opt
  );

  const selectedOption = normalizedOptions.find((opt) => opt.value === value);

  // Auto-habilita busca se tiver mais de 8 opções e searchable não estiver explicitamente false
  const shouldEnableSearch = searchable || normalizedOptions.length > 8;

  const filteredOptions = normalizedOptions.filter((opt) =>
    opt.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Fechar ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      if (shouldEnableSearch && searchInputRef.current) {
        setTimeout(() => searchInputRef.current?.focus(), 50);
      }
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, shouldEnableSearch]);

  // Teclado (Esc para fechar)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isOpen && e.key === 'Escape') {
        setIsOpen(false);
        setSearchTerm('');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleSelect = (val: string) => {
    onChange(val);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div ref={containerRef} className={cn('relative w-full', className)}>
      {/* Hidden input para compatibilidade com formulários */}
      {name && <input type="hidden" name={name} value={value} required={required} />}

      {/* Trigger Button com visual Filament */}
      <button
        type="button"
        id={id}
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={cn(
          'fi-select-trigger fi-input-wrp w-full text-left text-xs rounded-xl border flex items-center justify-between gap-2 px-3 py-2 transition-all cursor-pointer shadow-2xs outline-none',
          disabled
            ? 'bg-slate-100 dark:bg-slate-800/60 border-slate-200 dark:border-slate-800 text-slate-400 cursor-not-allowed opacity-60'
            : isOpen
            ? 'bg-white dark:bg-slate-800 border-blue-600 ring-2 ring-blue-500/20 text-slate-900 dark:text-slate-100'
            : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 hover:border-slate-400 dark:hover:border-slate-600'
        )}
      >
        <div className="flex items-center gap-2 truncate">
          {PrefixIcon && <PrefixIcon className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
          <span className={cn('truncate font-normal', !selectedOption && 'text-slate-400')}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>
        <ChevronDown
          className={cn(
            'w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200',
            isOpen && 'rotate-180 text-blue-600 dark:text-blue-400'
          )}
        />
      </button>

      {/* Dropdown Popover com visual Filament */}
      {isOpen && (
        <div className="fi-select-popover absolute left-0 top-full mt-1.5 w-full z-50 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-1.5 shadow-xl animate-in fade-in-0 zoom-in-95 max-h-64 flex flex-col">
          {/* Campo de Busca Rápida (Searchable) */}
          {shouldEnableSearch && (
            <div className="p-1 pb-1.5 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700">
                <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Pesquisar..."
                  className="w-full text-xs bg-transparent border-none outline-none text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
                />
              </div>
            </div>
          )}

          {/* Lista de Opções */}
          <div className="overflow-y-auto max-h-48 py-1 space-y-0.5 custom-scrollbar">
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-2 text-center text-xs text-slate-400">
                Nenhum resultado encontrado.
              </div>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected = opt.value === value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleSelect(opt.value)}
                    className={cn(
                      'fi-select-option w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between gap-2 transition-colors cursor-pointer',
                      isSelected
                        ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-semibold'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/70 hover:text-slate-900 dark:hover:text-slate-100'
                    )}
                  >
                    <div className="truncate">
                      <div className="truncate">{opt.label}</div>
                      {opt.description && (
                        <span className="text-[10px] text-slate-400 block truncate">
                          {opt.description}
                        </span>
                      )}
                    </div>
                    {isSelected && (
                      <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
