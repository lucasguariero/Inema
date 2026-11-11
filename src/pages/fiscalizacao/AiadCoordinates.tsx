import { useState } from 'react';
import { InputWrapper } from '@/components/filament/InputWrapper';
import { FilamentSelect } from '@/components/filament/Select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import {
  digits,
  maskDecimal,
  maskSeconds,
  validCoordinates,
  MSG,
  type Coordinates,
  type CoordinatePair
} from '@/lib/aiad';
import { MapPin, Navigation, Plus, Trash2, Map, CheckCircle2 } from 'lucide-react';

interface Props {
  value: Coordinates;
  coordsList?: CoordinatePair[];
  disabled: boolean;
  onChange: (main: Coordinates, list: CoordinatePair[]) => void;
  onError: (msg: string) => void;
  onNotice?: (msg: string) => void;
  preserveDeviceCoordinates?: boolean;
}

const BAHIA_CITIES = [
  { name: 'Salvador', lat: '-12,9714', lon: '-38,5014', x: 78, y: 55 },
  { name: 'Feira de Santana', lat: '-12,2564', lon: '-38,9618', x: 74, y: 51 },
  { name: 'Vitória da Conquista', lat: '-14,8661', lon: '-40,8394', x: 62, y: 73 },
  { name: 'Barreiras', lat: '-12,1439', lon: '-44,9978', x: 25, y: 49 },
  { name: 'Juazeiro', lat: '-9,4138', lon: '-40,5036', x: 64, y: 22 },
  { name: 'Ilhéus', lat: '-14,7889', lon: '-39,0494', x: 76, y: 71 },
  { name: 'Porto Seguro', lat: '-16,4497', lon: '-39,0647', x: 77, y: 88 },
  { name: 'Lençóis (Chapada)', lat: '-12,5611', lon: '-41,3894', x: 57, y: 54 }
];

export function AiadCoordinates({
  value: c,
  coordsList,
  disabled,
  onChange,
  onError,
  onNotice,
  preserveDeviceCoordinates = false
}: Props) {
  const [mapOpen, setMapOpen] = useState(false);
  const [selectedPin, setSelectedPin] = useState<{ lat: string; lon: string; name?: string }>({
    lat: '-12,9714',
    lon: '-38,5014',
    name: 'Salvador'
  });

  const list: CoordinatePair[] =
    coordsList && coordsList.length > 0
      ? coordsList
      : [{ ...c, id: 'coord-1' }];

  const updatePair = (id: string, patch: Partial<CoordinatePair>) => {
    const nextList = list.map(item => {
      if (item.id === id) {
        return { ...item, ...patch, validated: false };
      }
      return item;
    });
    const main = nextList[0] || c;
    onChange(main, nextList);
    onError('');
  };

  const handleValidatePair = (pair: CoordinatePair) => {
    const valid = validCoordinates(pair);
    const nextList = list.map(item =>
      item.id === pair.id ? { ...item, validated: valid } : item
    );
    const main = nextList[0];
    onChange(main, nextList);
    if (valid) {
      onError('');
      onNotice?.(MSG[19]);
    } else {
      onError(MSG[20]);
    }
  };

  const addCoordinate = () => {
    const newPair: CoordinatePair = {
      id: `coord-${crypto.randomUUID().slice(0, 8)}`,
      type: 'decimal',
      lat: '',
      lon: '',
      latD: '',
      latM: '',
      latS: '',
      lonD: '',
      lonM: '',
      lonS: '',
      validated: false
    };
    const nextList = [...list, newPair];
    onChange(nextList[0], nextList);
    onError('');
    onNotice?.('Novo par de coordenadas adicionado.');
  };

  const removeCoordinate = (id: string) => {
    if (list.length <= 1) return;
    const nextList = list.filter(item => item.id !== id);
    onChange(nextList[0], nextList);
    onError('');
  };

  const handleGeolocation = () => {
    if (disabled) return;
    if (!navigator.geolocation) {
      onError(MSG[30]);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      pos => {
        const latStr = preserveDeviceCoordinates ? pos.coords.latitude.toFixed(6).replace('.', ',') : '-' + Math.abs(pos.coords.latitude).toFixed(4).replace('.', ',');
        const lonStr = preserveDeviceCoordinates ? pos.coords.longitude.toFixed(6).replace('.', ',') : '-' + Math.abs(pos.coords.longitude).toFixed(4).replace('.', ',');
        updatePair(list[0].id, {
          type: 'decimal',
          lat: latStr,
          lon: lonStr,
          validated: false
        });
        onNotice?.('Localização obtida do dispositivo. Clique em "Validar coordenada" para confirmar.');
      },
      () => {
        // Se negado ou com falha, exibe MSG030 mantendo alternativas
        onError(MSG[30]);
      },
      { timeout: 5000 }
    );
  };

  const handleApplyMapPin = () => {
    updatePair(list[0].id, {
      type: 'decimal',
      lat: selectedPin.lat,
      lon: selectedPin.lon,
      validated: false
    });
    setMapOpen(false);
    onNotice?.(`Ponto selecionado no mapa (${selectedPin.name || 'Personalizado'}). Clique em "Validar coordenada" para confirmar.`);
  };

  return (
    <div className="aiad-coordinates space-y-4" data-testid="aiad-coordinates">
      {/* Top action bar: Geolocalização, Mapa demonstrativo, Adicionar par */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-700 pb-3">
        <div className="flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            color="gray"
            type="button"
            disabled={disabled}
            onClick={handleGeolocation}
            className="flex items-center gap-1.5"
            title="Obter coordenadas pelo GPS do dispositivo (BOT021)"
          >
            <Navigation className="h-4 w-4 text-emerald-700 dark:text-emerald-400" />
            Minha localização
          </Button>

          <Button
            size="sm"
            color="gray"
            type="button"
            disabled={disabled}
            onClick={() => setMapOpen(true)}
            className="flex items-center gap-1.5"
            title="Selecionar ponto no mapa da Bahia (BOT022)"
          >
            <Map className="h-4 w-4 text-emerald-700 dark:text-emerald-400" />
            Selecionar no mapa
          </Button>
        </div>

        <Button
          size="sm"
          color="gray"
          type="button"
          disabled={disabled}
          onClick={addCoordinate}
          className="flex items-center gap-1.5 shrink-0"
          title="Adicionar par adicional de coordenadas (BOT024)"
        >
          <Plus className="h-4 w-4" />
          Adicionar coordenada
        </Button>
      </div>

      {/* Lista de pares de coordenadas */}
      <div className="space-y-4">
        {list.map((pair, index) => (
          <div
            key={pair.id}
            className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/20 p-3.5 space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Par de Coordenadas #{index + 1}
                </span>
                <Badge color={pair.validated ? 'success' : 'gray'}>
                  {pair.validated ? 'Validada' : 'Pendente de validação'}
                </Badge>
              </div>

              {list.length > 1 && (
                <Button
                  size="xs"
                  color="danger"
                  outlined
                  type="button"
                  disabled={disabled}
                  onClick={() => removeCoordinate(pair.id)}
                  className="flex items-center gap-1"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Remover
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="aiad-label" htmlFor={`coord-type-${pair.id}`}>
                  Tipo de coordenada
                </label>
                <FilamentSelect
                  id={`coord-type-${pair.id}`}
                  ariaLabel="Tipo de coordenada"
                  className="aiad-select"
                  value={pair.type}
                  disabled={disabled}
                  options={[
                    { value: 'decimal', label: 'Grau Decimal' },
                    { value: 'gms', label: 'Grau/Minuto/Segundo' },
                    { value: 'utm23', label: 'UTM 23S' },
                    { value: 'utm24', label: 'UTM 24S' }
                  ]}
                  onChange={type =>
                    updatePair(pair.id, {
                      type: type as Coordinates['type'],
                      lat: '',
                      lon: '',
                      latD: '',
                      latM: '',
                      latS: '',
                      lonD: '',
                      lonM: '',
                      lonS: '',
                      validated: false
                    })
                  }
                />
              </div>

              {pair.type !== 'gms' && (
                <>
                  <InputWrapper
                    label="Latitude"
                    disabled={disabled}
                  >
                    <input
                      aria-label="Latitude"
                      className="aiad-input"
                      inputMode="numeric"
                      autoComplete="off"
                      disabled={disabled}
                      maxLength={pair.type === 'decimal' ? 10 : undefined}
                      value={pair.lat}
                      onChange={e =>
                        updatePair(pair.id, {
                          lat: pair.type === 'decimal' ? maskDecimal(e.target.value) : digits(e.target.value)
                        })
                      }
                    />
                  </InputWrapper>

                  <InputWrapper
                    label="Longitude"
                    disabled={disabled}
                  >
                    <input
                      aria-label="Longitude"
                      className="aiad-input"
                      inputMode="numeric"
                      autoComplete="off"
                      disabled={disabled}
                      maxLength={pair.type === 'decimal' ? 10 : undefined}
                      value={pair.lon}
                      onChange={e =>
                        updatePair(pair.id, {
                          lon: pair.type === 'decimal' ? maskDecimal(e.target.value) : digits(e.target.value)
                        })
                      }
                    />
                  </InputWrapper>
                </>
              )}
            </div>

            {/* GMS Inputs */}
            {pair.type === 'gms' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                {(['lat', 'lon'] as const).map(axis => (
                  <div key={axis} className="space-y-1">
                    <span className="aiad-label">
                      {axis === 'lat' ? 'Latitude (Graus / Minutos / Segundos)' : 'Longitude (Graus / Minutos / Segundos)'}
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                      <InputWrapper label="Graus" disabled={disabled}>
                        <input
                          aria-label={`${axis === 'lat' ? 'Latitude' : 'Longitude'} — Graus`}
                          className="aiad-input"
                          inputMode="numeric"
                          disabled={disabled}
                          maxLength={2}
                          value={String(pair[`${axis}D` as keyof CoordinatePair] || '')}
                          onChange={e => updatePair(pair.id, { [`${axis}D`]: digits(e.target.value).slice(0, 2) })}
                        />
                      </InputWrapper>
                      <InputWrapper label="Minutos" disabled={disabled}>
                        <input
                          aria-label={`${axis === 'lat' ? 'Latitude' : 'Longitude'} — Minutos`}
                          className="aiad-input"
                          inputMode="numeric"
                          disabled={disabled}
                          maxLength={2}
                          value={String(pair[`${axis}M` as keyof CoordinatePair] || '')}
                          onChange={e => updatePair(pair.id, { [`${axis}M`]: digits(e.target.value).slice(0, 2) })}
                        />
                      </InputWrapper>
                      <InputWrapper label="Segundos" disabled={disabled}>
                        <input
                          aria-label={`${axis === 'lat' ? 'Latitude' : 'Longitude'} — Segundos`}
                          className="aiad-input"
                          inputMode="numeric"
                          disabled={disabled}
                          maxLength={5}
                          value={String(pair[`${axis}S` as keyof CoordinatePair] || '')}
                          onChange={e => updatePair(pair.id, { [`${axis}S`]: maskSeconds(e.target.value) })}
                          onBlur={() => {
                            const val = String(pair[`${axis}S` as keyof CoordinatePair] || '');
                            if (val) updatePair(pair.id, { [`${axis}S`]: maskSeconds(val, true) });
                          }}
                        />
                      </InputWrapper>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center gap-2 pt-1">
              <Button
                size="sm"
                color="gray"
                type="button"
                disabled={disabled}
                onClick={() => handleValidatePair(pair)}
              >
                Validar coordenada
              </Button>
              {pair.validated && (
                <span className="flex items-center gap-1 text-xs text-emerald-700 dark:text-emerald-400 font-medium">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  {MSG[19]}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal do Mapa Demonstrativo da Bahia (BOT022, RN069) */}
      <Dialog open={mapOpen} onOpenChange={setMapOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Selecionar Coordenadas no Mapa da Bahia</DialogTitle>
            <DialogDescription>
              Clique em um município de referência ou na malha territorial para capturar as coordenadas demonstrativas.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="relative w-full h-72 bg-emerald-950/10 dark:bg-emerald-950/40 rounded-xl border border-emerald-800/20 overflow-hidden flex items-center justify-center">
              {/* Bahia State SVG representation */}
              <svg viewBox="0 0 100 100" className="w-full h-full p-4">
                <path
                  d="M20,40 Q25,20 50,15 Q75,10 85,30 Q90,55 80,75 Q75,95 50,90 Q30,85 15,65 Z"
                  fill="currentColor"
                  className="text-emerald-600/20 stroke-emerald-600 stroke-1"
                />
                {BAHIA_CITIES.map(city => {
                  const isSelected = selectedPin.name === city.name;
                  return (
                    <g
                      key={city.name}
                      className="cursor-pointer transition-transform hover:scale-125"
                      onClick={() => setSelectedPin({ lat: city.lat, lon: city.lon, name: city.name })}
                    >
                      <circle
                        cx={city.x}
                        cy={city.y}
                        r={isSelected ? 3.5 : 2}
                        className={isSelected ? 'fill-red-500 stroke-white stroke-1' : 'fill-emerald-800'}
                      />
                      <text
                        x={city.x + 3}
                        y={city.y + 1}
                        fontSize="3"
                        className="fill-slate-800 dark:fill-slate-200 select-none font-medium"
                      >
                        {city.name}
                      </text>
                    </g>
                  );
                })}
              </svg>

              <div className="absolute bottom-2 left-2 bg-white/90 dark:bg-slate-900/90 rounded-md px-2.5 py-1 text-xs border border-slate-200 dark:border-slate-700 shadow-sm">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Ponto selecionado: </span>
                <span className="font-mono text-emerald-700 dark:text-emerald-400">
                  {selectedPin.name} ({selectedPin.lat}, {selectedPin.lon})
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {BAHIA_CITIES.map(c => (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => setSelectedPin({ lat: c.lat, lon: c.lon, name: c.name })}
                  className={`text-xs px-2 py-1 rounded-md border transition-colors ${
                    selectedPin.name === c.name
                      ? 'bg-emerald-800 text-white border-emerald-900'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          <DialogFooter className="flex justify-between items-center w-full">
            <Button
              size="sm"
              color="gray"
              type="button"
              onClick={() => {
                setMapOpen(false);
                onError(MSG[31]);
              }}
              className="text-xs"
            >
              Simular falha de mapa
            </Button>
            <div className="flex gap-2">
              <Button size="sm" color="gray" type="button" onClick={() => setMapOpen(false)}>
                Cancelar
              </Button>
              <Button size="sm" color="primary" type="button" onClick={handleApplyMapPin}>
                Usar este ponto
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
