import React, { useState, useRef, useEffect } from 'react';
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
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
  value,
  onChange,
  options,
  placeholder = 'Selecione uma opção...',
  className = '',
  icon,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleSelect = (val: string) => {
    onChange(val);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={`relative select-none ${className}`}>
      {/* Botão de Gatilho (Trigger) Enterprise */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full h-9 px-3 py-1.5 text-xs text-left bg-white border rounded-lg shadow-2xs flex items-center justify-between gap-2 transition-all duration-200 ease-in-out ${
          isOpen
            ? 'border-[#0F4C3A] ring-2 ring-[#0F4C3A]/20'
            : 'border-slate-200 hover:border-slate-300'
        } ${
          disabled
            ? 'opacity-50 cursor-not-allowed bg-slate-50'
            : 'cursor-pointer hover:bg-slate-50/50'
        } focus:outline-hidden focus:border-[#0F4C3A] focus:ring-2 focus:ring-[#0F4C3A]/20`}
      >
        <div className="flex items-center gap-2 truncate">
          {icon && <span className="text-slate-400 shrink-0">{icon}</span>}
          {selectedOption ? (
            <span className="text-slate-700 font-medium truncate">
              {selectedOption.label}
            </span>
          ) : (
            <span className="text-slate-400 truncate">{placeholder}</span>
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
        <div className="absolute z-50 left-0 right-0 mt-1 max-h-60 overflow-y-auto bg-white border border-slate-200 rounded-lg shadow-lg p-1 animate-in fade-in zoom-in-95 duration-150">
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <div
                key={opt.value}
                onClick={() => handleSelect(opt.value)}
                className={`flex items-center justify-between px-2.5 py-1.5 text-xs rounded-md cursor-pointer transition-all duration-150 ease-in-out ${
                  isSelected
                    ? 'bg-[#0F4C3A]/10 text-[#0F4C3A] font-semibold'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  {opt.icon && (
                    <span
                      className={`shrink-0 ${
                        isSelected ? 'text-[#0F4C3A]' : 'text-slate-400'
                      }`}
                    >
                      {opt.icon}
                    </span>
                  )}
                  <span className="truncate">{opt.label}</span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 ml-2">
                  {opt.badge && (
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 text-slate-500 border border-slate-200">
                      {opt.badge}
                    </span>
                  )}
                  {isSelected && (
                    <Check className="w-3.5 h-3.5 text-[#0F4C3A]" />
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
