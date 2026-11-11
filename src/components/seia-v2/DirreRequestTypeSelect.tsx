import React, { useEffect, useState } from 'react';
import { FilamentSelect, type SelectOption } from '@/components/filament';
import {
  DIRRE_REQUEST_GROUPS,
  dirreRequest,
  type DirreRequestGroup,
} from '@/data/dirreRequestTypes';

export function DirreRequestTypeSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
  legacyOptions?: SelectOption[];
}) {
  const [group, setGroup] = useState<DirreRequestGroup>(() => dirreRequest(value)?.group || 'licencas');

  useEffect(() => {
    const item = dirreRequest(value);
    if (item) {
      setGroup(item.group);
    }
  }, [value]);

  const family = DIRRE_REQUEST_GROUPS.find((g) => g.id === group) || DIRRE_REQUEST_GROUPS[0];
  const currentItem = dirreRequest(value);
  const selectValue = currentItem?.id || value;

  const options: SelectOption[] = [
    { value: '', label: 'Selecione um ato ambiental (limpar)...' },
    ...family.entries.map((a) => ({
      value: a.id,
      label: a.label,
    })),
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-dirre-request-types>
      <div className="space-y-1">
        <label
          htmlFor="dirre-request-group"
          className="text-xs font-semibold text-slate-700 dark:text-slate-200"
        >
          Grupo do ato administrativo ambiental *
        </label>
        <FilamentSelect
          id="dirre-request-group"
          ariaLabel="Grupo do ato administrativo ambiental"
          value={group}
          onChange={(v) => {
            if (!DIRRE_REQUEST_GROUPS.some((g) => g.id === v)) return;
            setGroup(v as DirreRequestGroup);
            onChange('');
          }}
          options={DIRRE_REQUEST_GROUPS.map((g) => ({ value: g.id, label: g.label }))}
        />
      </div>
      <div className="space-y-1">
        <label
          htmlFor="cotic-field-2"
          className="text-xs font-semibold text-slate-700 dark:text-slate-200"
        >
          Tipo de Ato Requerido *
        </label>
        <FilamentSelect
          id="cotic-field-2"
          ariaLabel="Tipo de Ato Requerido"
          searchable
          required
          options={options}
          value={selectValue}
          onChange={onChange}
        />
      </div>
    </div>
  );
}
