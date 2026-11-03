import React, { useState } from 'react';
import {
  ZoomIn,
  ZoomOut,
  Layers,
  MapPin,
  AlertTriangle,
  RefreshCw,
  Compass,
  Eye,
  CheckCircle2,
  Info,
  Maximize2
} from 'lucide-react';
import { AsasItem, CamadasMapaAsas, SituacaoAsas } from '@/types/faunaR3R4';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface BahiaFaunaMapProps {
  asasList: AsasItem[];
  selectedAsasId?: string;
  onSelectAsas: (asas: AsasItem) => void;
  camadas: CamadasMapaAsas;
  onToggleCamada: (chave: keyof CamadasMapaAsas) => void;
  isGeoBahiaOffline?: boolean;
  onToggleGeoBahiaOffline?: () => void;
  destaqueEspecieOuGrupo?: string;
}

export const BahiaFaunaMap: React.FC<BahiaFaunaMapProps> = ({
  asasList,
  selectedAsasId,
  onSelectAsas,
  camadas,
  onToggleCamada,
  isGeoBahiaOffline = false,
  onToggleGeoBahiaOffline,
  destaqueEspecieOuGrupo
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [showLayerMenu, setShowLayerMenu] = useState<boolean>(false);

  // RN-002: Excluir Indeferida e Desativada do mapa
  // Agrupar Em análise, Em complementação e Aguardando termo como categoria cinza
  const visibleAsas = asasList.filter((a) => {
    if (!a.delimitacao) return false; // Sem delimitação não plota
    if (a.situacao === 'Indeferida' || a.situacao === 'Desativada') return false;
    return true;
  });

  // RN-004 e CA002: Contagens por situação com quantidades dinâmicas na legenda
  const qtdAtivas = asasList.filter((a) => a.situacao === 'Ativa').length;
  const qtdVencidas = asasList.filter(
    (a) => a.situacao === 'Certificado vencido' || a.situacao === 'Certificado Vencido'
  ).length;
  const qtdSuspensas = asasList.filter((a) => a.situacao === 'Suspensa').length;
  const qtdEmAnalise = asasList.filter((a) =>
    ['Em análise', 'Em complementação', 'Aguardando termo', 'Em cadastro'].includes(a.situacao)
  ).length;

  const getMarkerColor = (situacao: SituacaoAsas): { bg: string; border: string; text: string } => {
    switch (situacao) {
      case 'Ativa':
        return { bg: '#10b981', border: '#047857', text: '#ffffff' };
      case 'Certificado vencido':
        return { bg: '#ef4444', border: '#b91c1c', text: '#ffffff' };
      case 'Suspensa':
        return { bg: '#f59e0b', border: '#b45309', text: '#ffffff' };
      case 'Em análise':
      case 'Em complementação':
      case 'Aguardando termo':
      default:
        return { bg: '#64748b', border: '#334155', text: '#ffffff' };
    }
  };

  return (
    <div
      data-testid="bahia-fauna-map-container"
      className="relative w-full h-full min-h-[540px] bg-[#E9EFE6] dark:bg-slate-900 overflow-hidden rounded-xl border border-slate-300 dark:border-slate-800 shadow-inner flex flex-col select-none"
    >
      {/* Alerta de Falha do GeoBahia (RN-004 / MSG002 / RNF-002) */}
      {isGeoBahiaOffline && (
        <div
          data-testid="alerta-geobahia-offline"
          className="absolute top-3 left-3 right-16 z-30 bg-amber-500/95 text-amber-950 px-4 py-2.5 rounded-xl shadow-lg border border-amber-600 flex items-center justify-between text-xs backdrop-blur-xs font-medium"
        >
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-950 shrink-0" />
            <span>
              <strong>MSG002 — Modo GeoBahia Offline:</strong> Conexão remota indisponível. Exibindo
              dados vetoriais locais e camadas em contingência offline determinística.
            </span>
          </div>
          {onToggleGeoBahiaOffline && (
            <button
              onClick={onToggleGeoBahiaOffline}
              className="text-[11px] underline hover:text-white ml-2 font-bold cursor-pointer"
            >
              Restabelecer
            </button>
          )}
        </div>
      )}

      {/* Barra de Ferramentas do Mapa (Topo Esquerdo) */}
      <div className="absolute top-3 left-3 z-20 flex flex-col gap-2">
        {/* Controles de Zoom */}
        <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-xs rounded-xl shadow-md border border-slate-200 dark:border-slate-700 flex flex-col p-1">
          <button
            onClick={() => setZoomLevel((z) => Math.min(2.2, z + 0.3))}
            className="w-8 h-8 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 cursor-pointer"
            title="Aproximar mapa"
            aria-label="Aproximar mapa"
            data-testid="btn-zoom-in-mapa"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <div className="h-px bg-slate-200 dark:bg-slate-700 mx-1" />
          <button
            onClick={() => setZoomLevel((z) => Math.max(0.9, z - 0.3))}
            className="w-8 h-8 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 cursor-pointer"
            title="Afastar mapa"
            aria-label="Afastar mapa"
            data-testid="btn-zoom-out-mapa"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <div className="h-px bg-slate-200 dark:bg-slate-700 mx-1" />
          <button
            onClick={() => setZoomLevel(1)}
            className="w-8 h-8 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 cursor-pointer text-[10px] font-bold"
            title="Ajustar visão inicial da Bahia"
            aria-label="Ajustar visão inicial da Bahia"
            data-testid="btn-zoom-reset-mapa"
          >
            BA
          </button>
        </div>

        {/* Indicador de Escala e Agrupamento (RN-005 / CA005) */}
        <div
          data-testid="indicador-escala-agrupamento"
          className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-xs rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 px-2 py-1 text-[10px] font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5"
        >
          <span
            className={`w-2 h-2 rounded-full ${
              zoomLevel <= 1 ? 'bg-indigo-600 animate-pulse' : 'bg-emerald-500'
            }`}
          />
          <span>
            {zoomLevel <= 1
              ? 'Escala Estadual (Agrupamento Salvador: 40)'
              : 'Escala Local (Polígonos Detalhados)'}
          </span>
        </div>

        {/* Botão de Camadas */}
        <div className="relative">
          <button
            onClick={() => setShowLayerMenu((prev) => !prev)}
            data-testid="btn-toggle-camadas"
            className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-xs text-slate-800 dark:text-slate-100 px-3 py-2 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
          >
            <Layers className="w-4 h-4 text-[#0F4C3A] dark:text-emerald-400" />
            <span>Camadas</span>
            {camadas.cefir && (
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            )}
          </button>

          {/* Menu Dropdown de Camadas */}
          {showLayerMenu && (
            <div
              data-testid="menu-camadas-mapa"
              className="absolute top-11 left-0 z-30 w-64 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-3 text-xs space-y-2.5"
            >
              <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-1.5">
                <span>Camadas Geográficas</span>
                <button
                  onClick={() => setShowLayerMenu(false)}
                  className="text-slate-400 hover:text-slate-700 text-sm font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-1.5">
                <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300 font-medium">
                  <input
                    type="checkbox"
                    checked={camadas.cefir}
                    onChange={() => onToggleCamada('cefir')}
                    className="rounded text-emerald-700 focus:ring-emerald-600"
                  />
                  <span>Imóveis e Reserva Legal (CEFIR)</span>
                  <Badge variant="outline" className="text-[9px] py-0 px-1 text-emerald-700 border-emerald-300">
                    Padrão
                  </Badge>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={camadas.vegetacao}
                    onChange={() => onToggleCamada('vegetacao')}
                    className="rounded text-emerald-700 focus:ring-emerald-600"
                  />
                  <span>Cobertura Vegetal Nativa</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={camadas.hidrografia}
                    onChange={() => onToggleCamada('hidrografia')}
                    className="rounded text-emerald-700 focus:ring-emerald-600"
                  />
                  <span>Hidrografia (Rios e Bacias)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={camadas.uc}
                    onChange={() => onToggleCamada('uc')}
                    className="rounded text-emerald-700 focus:ring-emerald-600"
                  />
                  <span>Unidades de Conservação e ZA</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={camadas.biomas}
                    onChange={() => onToggleCamada('biomas')}
                    className="rounded text-emerald-700 focus:ring-emerald-600"
                  />
                  <span>Biomas (Caatinga, Cerrado, Mata)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={camadas.urs}
                    onChange={() => onToggleCamada('urs')}
                    className="rounded text-emerald-700 focus:ring-emerald-600"
                  />
                  <span>Unidades Regionais (URs)</span>
                </label>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                  Mapa Base
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => camadas.base !== 'ruas' && onToggleCamada('base')}
                    className={`flex-1 py-1 px-2 rounded-lg text-center font-medium ${
                      camadas.base === 'ruas'
                        ? 'bg-[#0F4C3A] text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    Vetor / Ruas
                  </button>
                  <button
                    onClick={() => camadas.base !== 'satelite' && onToggleCamada('base')}
                    className={`flex-1 py-1 px-2 rounded-lg text-center font-medium ${
                      camadas.base === 'satelite'
                        ? 'bg-[#0F4C3A] text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    Satélite
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* SVG Canvas do Mapa da Bahia */}
      <div className="flex-1 w-full h-full relative overflow-hidden flex items-center justify-center p-4">
        <svg
          viewBox="0 0 1000 850"
          className="w-full h-full transition-transform duration-300 ease-out drop-shadow-md"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          {/* Fundo do Oceano Atlântico e Estados Limítrofes */}
          <rect width="1000" height="850" fill={camadas.base === 'satelite' ? '#1e293b' : '#dbeafe'} />

          {/* Polígono Geral Representativo do Contorno Territorial da Bahia */}
          <path
            d="M 520,70 L 680,110 L 780,180 L 820,290 L 850,380 L 820,440 L 760,490 L 780,560 L 750,650 L 740,760 L 700,810 L 610,790 L 540,730 L 450,710 L 360,650 L 250,560 L 210,480 L 190,390 L 240,310 L 320,220 L 410,140 Z"
            fill={camadas.base === 'satelite' ? '#334155' : '#f8fafc'}
            stroke="#94a3b8"
            strokeWidth="3"
            strokeLinejoin="round"
          />

          {/* Camada Biomas */}
          {camadas.biomas && (
            <g opacity="0.45">
              {/* Caatinga - Norte e Centro */}
              <path
                d="M 520,70 L 680,110 L 780,180 L 760,340 L 550,420 L 410,300 L 410,140 Z"
                fill="#fde047"
                stroke="#eab308"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />
              {/* Cerrado - Oeste */}
              <path
                d="M 410,140 L 410,300 L 450,520 L 250,560 L 210,480 L 190,390 L 240,310 L 320,220 Z"
                fill="#fcd34d"
                stroke="#d97706"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />
              {/* Mata Atlântica - Leste e Litoral Sul */}
              <path
                d="M 780,180 L 820,290 L 850,380 L 820,440 L 760,490 L 780,560 L 750,650 L 740,760 L 700,810 L 610,790 L 580,620 L 550,420 L 760,340 Z"
                fill="#86efac"
                stroke="#16a34a"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />
            </g>
          )}

          {/* Camada Hidrografia (Rios Principais) */}
          {camadas.hidrografia && (
            <g stroke="#38bdf8" strokeWidth="2.5" fill="none" opacity="0.8">
              {/* Rio São Francisco */}
              <path d="M 280,560 Q 380,420 540,280 T 680,110" />
              {/* Rio Paraguaçu */}
              <path d="M 510,440 Q 620,430 750,440" />
              {/* Rio de Contas */}
              <path d="M 480,550 Q 610,540 760,560" />
            </g>
          )}

          {/* Camada CEFIR (Imóveis e Reservas Legais com Hatching / Polígonos Verdes) */}
          {camadas.cefir && (
            <g opacity="0.75">
              {visibleAsas.map((a) => {
                const x = (a.delimitacao?.centro.xPct || 50) * 10;
                const y = (a.delimitacao?.centro.yPct || 50) * 8.5;
                const r = Math.sqrt(a.delimitacao?.areaHa || 500) * 0.9;
                return (
                  <g key={`cefir-${a.id}`}>
                    <circle
                      cx={x}
                      cy={y}
                      r={Math.max(16, r)}
                      fill="#10b981"
                      fillOpacity="0.25"
                      stroke="#059669"
                      strokeWidth="2"
                      strokeDasharray="3 3"
                    />
                    <circle cx={x} cy={y} r={Math.max(8, r * 0.45)} fill="#059669" fillOpacity="0.35" />
                  </g>
                );
              })}
            </g>
          )}

          {/* Camada Unidades de Conservação */}
          {camadas.uc && (
            <g opacity="0.6">
              {/* Chapada Diamantina */}
              <polygon points="510,410 560,400 570,470 520,480" fill="#a855f7" stroke="#7e22ce" strokeWidth="2" />
              {/* Zona Costeira Sul */}
              <polygon points="720,620 760,610 770,690 730,700" fill="#a855f7" stroke="#7e22ce" strokeWidth="2" />
            </g>
          )}

          {/* Rótulos de Cidades Estratégicas para Orientação */}
          <g fontSize="11" fill="#475569" fontWeight="600" opacity="0.7">
            <text x="760" y="445">Salvador</text>
            <text x="660" y="420">Feira de Santana</text>
            <text x="590" y="150">Juazeiro</text>
            <text x="240" y="380">Barreiras</text>
            <text x="590" y="620">Vitória da Conquista</text>
            <text x="710" y="640">Ilhéus</text>
            <text x="500" y="460">Andaraí (Chapada)</text>
          </g>

          {/* Marcador Agrupado de Escala Estadual — Salvador/RMS com 40 ASAS (RN-005 — Demonstração de Agrupamento Regional) */}
          {zoomLevel <= 1 && (
            <g
              data-testid="cluster-marcador-salvador-40"
              className="cursor-pointer transition-transform duration-200 hover:scale-110"
              onClick={() => setZoomLevel(1.6)}
              transform="translate(770, 440)"
            >
              <circle cx="0" cy="0" r="26" fill="#4f46e5" fillOpacity="0.25" className="animate-ping" />
              <circle cx="0" cy="0" r="18" fill="#4f46e5" stroke="#ffffff" strokeWidth="2.5" />
              <text
                x="0"
                y="5"
                textAnchor="middle"
                fill="#ffffff"
                fontSize="13"
                fontWeight="bold"
                fontFamily="monospace"
              >
                40
              </text>
              <rect x="-60" y="21" width="120" height="15" rx="4" fill="#1e1b4b" fillOpacity="0.9" />
              <text x="0" y="31.5" textAnchor="middle" fill="#ffffff" fontSize="7.5" fontWeight="bold">
                Salvador / RMS (40 ASAS)
              </text>
            </g>
          )}

          {/* Marcadores das ASAS (Plotados nas Coordenadas Projetadas) */}
          {visibleAsas.map((a) => {
            const x = (a.delimitacao?.centro.xPct || 50) * 10;
            const y = (a.delimitacao?.centro.yPct || 50) * 8.5;
            const isSelected = selectedAsasId === a.id;
            const colors = getMarkerColor(a.situacao);
            const totalSolturas = a.solturas.reduce((acc, s) => acc + s.quantidade, 0);

            // Se houver busca ou filtro de espécie, destaca áreas com histórico
            const isDestaque =
              destaqueEspecieOuGrupo &&
              a.solturas.some(
                (s) =>
                  s.especie.toLowerCase().includes(destaqueEspecieOuGrupo.toLowerCase()) ||
                  s.grupo.toLowerCase().includes(destaqueEspecieOuGrupo.toLowerCase())
              );

            return (
              <g
                key={a.id}
                data-testid={`marcador-asas-${a.id}`}
                className="cursor-pointer transition-transform duration-200"
                onClick={() => onSelectAsas(a)}
                transform={`translate(${x}, ${y}) ${isSelected ? 'scale(1.25)' : isDestaque ? 'scale(1.15)' : 'scale(1)'}`}
              >
                {/* Efeito de Destaque / Pulsação se Selecionada */}
                {isSelected && (
                  <circle cx="0" cy="0" r="28" fill="#10b981" fillOpacity="0.3" className="animate-ping" />
                )}

                {/* Marcador em Pin */}
                <circle cx="0" cy="0" r="16" fill={colors.bg} stroke={colors.border} strokeWidth="3" />

                {/* Contagem de Solturas no Centro do Marcador (RN-007) */}
                <text
                  x="0"
                  y="4"
                  textAnchor="middle"
                  fill={colors.text}
                  fontSize="10"
                  fontWeight="bold"
                  fontFamily="monospace"
                >
                  {totalSolturas > 0 ? totalSolturas : '0'}
                </text>

                {/* Tag de Identificação Rápida */}
                <rect
                  x="-35"
                  y="18"
                  width="70"
                  height="16"
                  rx="4"
                  fill="white"
                  stroke="#cbd5e1"
                  strokeWidth="1"
                  className="shadow-xs"
                />
                <text
                  x="0"
                  y="29"
                  textAnchor="middle"
                  fill="#1e293b"
                  fontSize="8"
                  fontWeight="bold"
                >
                  {a.numero}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Legenda Oficial Acessível e Textual com Quantidades por Situação (RN-004 e CA002) */}
      <div
        data-testid="legenda-mapa-asas"
        className="absolute bottom-3 left-3 z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs rounded-xl shadow-md border border-slate-200 dark:border-slate-800 p-2.5 text-xs max-w-sm"
      >
        <div className="flex items-center justify-between mb-1.5">
          <span className="font-bold text-slate-800 dark:text-slate-200 text-[11px] uppercase tracking-wide">
            Legenda das Áreas de Soltura (RN-004)
          </span>
          <Badge variant="outline" className="text-[9px] bg-slate-100 text-slate-700 border-slate-300">
            6 Áreas Elegíveis Mapeadas
          </Badge>
        </div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-[11px]">
          <div className="flex items-center justify-between gap-1.5 bg-slate-50/80 dark:bg-slate-800/50 px-2 py-1 rounded-lg">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#10b981] border border-[#047857]" />
              <span className="text-slate-700 dark:text-slate-300">Ativa:</span>
            </div>
            <strong className="font-mono text-emerald-700 dark:text-emerald-400 font-bold" data-testid="legenda-qtd-ativa">{qtdAtivas}</strong>
          </div>
          <div className="flex items-center justify-between gap-1.5 bg-slate-50/80 dark:bg-slate-800/50 px-2 py-1 rounded-lg">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444] border border-[#b91c1c]" />
              <span className="text-slate-700 dark:text-slate-300">Vencida:</span>
            </div>
            <strong className="font-mono text-rose-700 dark:text-rose-400 font-bold" data-testid="legenda-qtd-vencida">{qtdVencidas}</strong>
          </div>
          <div className="flex items-center justify-between gap-1.5 bg-slate-50/80 dark:bg-slate-800/50 px-2 py-1 rounded-lg">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b] border border-[#b45309]" />
              <span className="text-slate-700 dark:text-slate-300">Suspensa:</span>
            </div>
            <strong className="font-mono text-amber-700 dark:text-amber-400 font-bold" data-testid="legenda-qtd-suspensa">{qtdSuspensas}</strong>
          </div>
          <div className="flex items-center justify-between gap-1.5 bg-slate-50/80 dark:bg-slate-800/50 px-2 py-1 rounded-lg">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#64748b] border border-[#334155]" />
              <span className="text-slate-700 dark:text-slate-300">Em Análise:</span>
            </div>
            <strong className="font-mono text-slate-700 dark:text-slate-300 font-bold" data-testid="legenda-qtd-analise">{qtdEmAnalise}</strong>
          </div>
        </div>
        <div className="text-[10px] text-slate-500 mt-1.5 border-t border-slate-100 dark:border-slate-800 pt-1 space-y-0.5">
          <p>
            * Conforme a <strong>RN-003</strong>, as situações <em>'Em complementação'</em> e <em>'Aguardando termo'</em> são representadas e contabilizadas sob a categoria visual <strong>'Em análise'</strong> (cinza) no mapa e na lista lateral.
          </p>
          <p>
            * <strong>Diferenciação cadastral:</strong> Áreas elegíveis possuem polígono vetorial e são plotadas no mapa; cadastros sem delimitação exigem arquivo KML (RN-006).
          </p>
          <p className="text-slate-600 dark:text-slate-300">
            * <strong>Agrupamento macroestadual:</strong> Em escala ampla, áreas com proximidade agrupam-se em marcadores regionais com contagem consolidada, desagrupando-se ao aproximar o zoom (RN-005).
          </p>
        </div>
      </div>

      {/* Rosa dos Ventos / Orientação */}
      <div className="absolute top-3 right-3 z-20 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xs rounded-full p-2 shadow-sm border border-slate-200 dark:border-slate-700 pointer-events-none">
        <Compass className="w-5 h-5 text-emerald-800 dark:text-emerald-400" />
      </div>
    </div>
  );
};
