import React, { useState, useRef, useEffect, useId } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
  badge?: string;
  icon?: React.ReactNode;
}

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  dataTestId?: string;
  id?: string;
  ariaLabel?: string;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
  value,
  onChange,
  options,
  placeholder = 'Selecione uma opção...',
  className = '',
  icon,
  disabled = false,
  dataTestId,
  id,
  ariaLabel,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  const selectedOption = options.find((opt) => opt.value === value);

  // Sincroniza índice ativo com a opção selecionada ao abrir
  useEffect(() => {
    if (isOpen) {
      const idx = options.findIndex((opt) => opt.value === value);
      setActiveIndex(idx >= 0 ? idx : 0);
    }
  }, [isOpen, value, options]);

  // Rolagem automática para o item ativo por teclado
  useEffect(() => {
    if (isOpen && listRef.current) {
      const activeEl = listRef.current.querySelector<HTMLElement>(`[data-index="${activeIndex}"]`);
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [isOpen, activeIndex]);

  // Gerenciamento de clique fora e tecla Escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleWindowKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        event.preventDefault();
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleWindowKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleWindowKeyDown);
    };
  }, [isOpen]);

  const handleSelect = (val: string) => {
    onChange(val);
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    if (!isOpen) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => Math.min(options.length - 1, prev + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => Math.max(0, prev - 1));
    } else if (e.key === 'Home') {
      e.preventDefault();
      setActiveIndex(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      setActiveIndex(Math.max(0, options.length - 1));
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (options[activeIndex]) {
        handleSelect(options[activeIndex].value);
      }
    } else if (e.key === 'Tab') {
      setIsOpen(false);
    }
  };

  return (
    <div
      ref={containerRef}
      onKeyDown={handleKeyDown}
      className={`relative select-none ${className}`}
    >
      {/* Botão de Gatilho (Trigger) Enterprise */}
      <button
        ref={triggerRef}
        type="button"
        id={id}
        data-testid={dataTestId}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={isOpen ? listId : undefined}
        aria-label={ariaLabel || placeholder}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full h-9 px-3 py-1.5 text-xs text-left bg-white dark:bg-slate-800 border rounded-lg shadow-2xs flex items-center justify-between gap-2 transition-all duration-200 ease-in-out ${
          isOpen
            ? 'border-[#0F4C3A] ring-2 ring-[#0F4C3A]/20'
            : 'border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600'
        } ${
          disabled
            ? 'opacity-50 cursor-not-allowed bg-slate-50 dark:bg-slate-900'
            : 'cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-700/30'
        } focus:outline-hidden focus:border-[#0F4C3A] focus:ring-2 focus:ring-[#0F4C3A]/20`}
      >
        <div className="flex items-center gap-2 truncate">
          {icon && <span className="text-slate-400 shrink-0">{icon}</span>}
          {selectedOption ? (
            <span className="text-slate-800 dark:text-slate-100 font-medium truncate">
              {selectedOption.label}
            </span>
          ) : (
            <span className="text-slate-400 dark:text-slate-500 truncate">{placeholder}</span>
          )}
        </div>

        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform duration-200 ease-in-out ${
            isOpen ? 'rotate-180 text-[#0F4C3A]' : ''
          }`}
        />
      </button>

      {/* Menu Popover Customizado (Zero Azul do Navegador) */}
      {isOpen && (
        <div
          ref={listRef}
          id={listId}
          role="listbox"
          tabIndex={-1}
          aria-activedescendant={options[activeIndex] ? `${listId}-opt-${activeIndex}` : undefined}
          className="absolute z-50 left-0 min-w-full w-max mt-1 max-h-60 overflow-y-auto bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg p-1 animate-in fade-in zoom-in-95 duration-150 custom-scrollbar outline-none"
        >
          {options.map((opt, index) => {
            const isSelected = opt.value === value;
            const isActive = index === activeIndex;
            return (
              <div
                key={opt.value}
                id={`${listId}-opt-${index}`}
                role="option"
                data-index={index}
                aria-selected={isSelected}
                onClick={() => handleSelect(opt.value)}
                onMouseEnter={() => setActiveIndex(index)}
                className={`flex items-center justify-between px-2.5 py-1.5 text-xs rounded-md cursor-pointer transition-all duration-150 ease-in-out ${
                  isActive
                    ? 'bg-slate-100 dark:bg-slate-700/60 ring-1 ring-inset ring-[#0F4C3A]/30'
                    : ''
                } ${
                  isSelected
                    ? 'bg-[#0F4C3A]/10 text-[#0F4C3A] font-semibold dark:bg-[#0F4C3A]/30 dark:text-emerald-400'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/70 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  {opt.icon && (
                    <span
                      className={`shrink-0 ${
                        isSelected ? 'text-[#0F4C3A] dark:text-emerald-400' : 'text-slate-400'
                      }`}
                    >
                      {opt.icon}
                    </span>
                  )}
                  <span className="truncate">{opt.label}</span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 ml-2">
                  {opt.badge && (
                    <span className="text-xs font-mono px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 border border-slate-200 dark:border-slate-600">
                      {opt.badge}
                    </span>
                  )}
                  {isSelected && (
                    <Check className="w-3.5 h-3.5 text-[#0F4C3A] dark:text-emerald-400" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
