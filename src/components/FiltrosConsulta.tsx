import React, { useState } from 'react';
import { FiltrosConsultaExterna } from '../types/fiscalizacao-externa';

interface FiltrosConsultaProps {
  filtros: FiltrosConsultaExterna;
  onChange: (novosFiltros: FiltrosConsultaExterna) => void;
  onSearch: (filtros: FiltrosConsultaExterna) => void;
  onClear: () => void;
}

export const FiltrosConsulta: React.FC<FiltrosConsultaProps> = ({
  filtros,
  onChange,
  onSearch,
  onClear
}) => {
  const [erroPeriodo, setErroPeriodo] = useState<string | null>(null);

  const STATUS_OPCOES = [
    'Todos',
    'Emergência Registrada',
    'Denúncia Registrada',
    'Análise Técnica',
    'Em Fiscalização',
    'Em Vistoria',
    'Concluído',
    'Arquivado',
    'Cancelado'
  ];

  const MUNICIPIOS_BAHIA = [
    'Todos',
    'Salvador',
    'Camaçari',
    'Feira de Santana',
    'Simões Filho',
    'Candeias',
    'Dias d\'Ávila',
    'Lauro de Freitas',
    'Ilhéus',
    'Itabuna',
    'Vitória da Conquista',
    'Barreiras',
    'Juazeiro',
    'Porto Seguro',
    'Alagoinhas',
    'Jequié'
  ];

  const TIPOS_REGISTRO = [
    'Todos',
    'Denúncia Ambiental (RD)',
    'Emergência Química (RE)'
  ];

  const TIPOS_EMERGENCIA = [
    'Todos',
    'Acidente no transporte rodoviário de produtos químicos',
    'Acidente em via férrea',
    'Acidente industrial em planta química ou petroquímica',
    'Incidente no modal aquaviário ou terminal marítimo',
    'Lançamento ou descarte irregular de efluentes ou produtos químicos',
    'Vazamento em sistema subterrâneo de combustíveis',
    'Ocorrência com produto químico perigoso em ETA/ETE',
    'Efluente de barragem de rejeitos',
    'Efluente de barragem de aterro industrial ou sanitário',
    'Ruptura ou falha em sistema de contenção',
    'Mortandade de peixes ou fauna aquática por contaminação',
    'Pluma de contaminação',
    'Mancha de origem desconhecida',
    'Afloramento de contaminantes',
    'Outros'
  ];

  // Mudança do tipo de registro com regra RN004
  const handleTipoRegistroChange = (novoTipo: string) => {
    const atualizado: FiltrosConsultaExterna = {
      ...filtros,
      tipoRegistro: novoTipo,
      // Se não for Emergência Química, limpa o tipo de emergência química (RN004)
      tipoEmergencia: novoTipo === 'Emergência Química (RE)' ? filtros.tipoEmergencia : ''
    };
    onChange(atualizado);
  };

  // Submissão com validações RN005 (MSG001 e MSG002)
  const handleConsultar = (e: React.FormEvent) => {
    e.preventDefault();
    setErroPeriodo(null);

    const hojeStr = new Date().toISOString().split('T')[0];

    // Validação MSG002: O período do registro não pode conter data futura
    if (
      (filtros.dataInicial && filtros.dataInicial > hojeStr) ||
      (filtros.dataFinal && filtros.dataFinal > hojeStr)
    ) {
      setErroPeriodo('MSG002: O período do registro não pode conter data futura.');
      return;
    }

    // Validação MSG001: A data inicial não pode ser posterior à data final
    if (filtros.dataInicial && filtros.dataFinal && filtros.dataInicial > filtros.dataFinal) {
      setErroPeriodo('MSG001: A data inicial não pode ser posterior à data final.');
      return;
    }

    onSearch(filtros);
  };

  const handleLimpar = () => {
    setErroPeriodo(null);
    onClear();
  };

  const isEmergenciaQuimica = filtros.tipoRegistro === 'Emergência Química (RE)';

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2 text-inema-green font-bold text-sm">
          <span className="material-symbols-outlined text-lg">tune</span>
          <h3>Filtros de Pesquisa (DOR005.1)</h3>
        </div>
        <span className="text-[11px] text-slate-400">
          Refine por status, protocolo, município, tipo e datas
        </span>
      </div>

      {erroPeriodo && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-center gap-2 animate-fadeIn">
          <span className="material-symbols-outlined text-base text-red-600">error</span>
          <span>{erroPeriodo}</span>
        </div>
      )}

      <form onSubmit={handleConsultar} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {/* Status (LEG001) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1" title="LEG001: Selecione a situação atual do registro">
              Status / Situação (LEG001)
            </label>
            <select
              value={filtros.status || 'Todos'}
              onChange={(e) => onChange({ ...filtros, status: e.target.value })}
              className="w-full text-xs rounded-lg border-slate-300 focus:border-inema-green focus:ring-inema-green"
            >
              {STATUS_OPCOES.map((st) => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>

          {/* Número do Registro (LEG002) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1" title="LEG002: Informe o número do protocolo do RD ou RE">
              Número do Registro (LEG002)
            </label>
            <input
              type="text"
              value={filtros.numeroRegistro || ''}
              onChange={(e) => onChange({ ...filtros, numeroRegistro: e.target.value })}
              placeholder="Ex: 2026.000004/INEMA/RE"
              className="w-full text-xs rounded-lg border-slate-300 focus:border-inema-green focus:ring-inema-green font-mono"
            />
          </div>

          {/* Município (LEG003) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1" title="LEG003: Selecione o município da ocorrência">
              Município (LEG003)
            </label>
            <select
              value={filtros.municipio || 'Todos'}
              onChange={(e) => onChange({ ...filtros, municipio: e.target.value })}
              className="w-full text-xs rounded-lg border-slate-300 focus:border-inema-green focus:ring-inema-green"
            >
              {MUNICIPIOS_BAHIA.map((mun) => (
                <option key={mun} value={mun}>{mun}</option>
              ))}
            </select>
          </div>

          {/* Tipo de Registro (LEG004) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1" title="LEG004: Selecione Denúncia Ambiental ou Emergência Química">
              Tipo de Registro (LEG004)
            </label>
            <select
              value={filtros.tipoRegistro || 'Todos'}
              onChange={(e) => handleTipoRegistroChange(e.target.value)}
              className="w-full text-xs rounded-lg border-slate-300 focus:border-inema-green focus:ring-inema-green font-medium"
            >
              {TIPOS_REGISTRO.map((tp) => (
                <option key={tp} value={tp}>{tp}</option>
              ))}
            </select>
          </div>

          {/* Tipo da Emergência Química (LEG005 - Condicional RN004) */}
          <div>
            <label 
              className={`block text-xs font-semibold mb-1 ${isEmergenciaQuimica ? 'text-slate-700' : 'text-slate-400'}`}
              title="LEG005: Disponível somente quando o tipo de registro for Emergência Química"
            >
              Tipo da Emergência Química (LEG005)
            </label>
            <select
              disabled={!isEmergenciaQuimica}
              value={filtros.tipoEmergencia || ''}
              onChange={(e) => onChange({ ...filtros, tipoEmergencia: e.target.value })}
              className={`w-full text-xs rounded-lg border-slate-300 ${
                isEmergenciaQuimica 
                  ? 'bg-white focus:border-inema-green focus:ring-inema-green text-slate-800' 
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed border-slate-200'
              }`}
            >
              <option value="">{isEmergenciaQuimica ? 'Todos os Tipos Químicos' : 'Habilitado apenas para RE'}</option>
              {TIPOS_EMERGENCIA.filter(t => t !== 'Todos').map((tipo) => (
                <option key={tipo} value={tipo}>{tipo}</option>
              ))}
            </select>
            {!isEmergenciaQuimica && (
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                RN004 - Habilitado somente para RE
              </span>
            )}
          </div>

          {/* Período: Data Inicial e Final (LEG006, RN005) */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1" title="LEG006: Data inicial de cadastramento">
                Data Inicial
              </label>
              <input
                type="date"
                max={new Date().toISOString().split('T')[0]}
                value={filtros.dataInicial || ''}
                onChange={(e) => onChange({ ...filtros, dataInicial: e.target.value })}
                className="w-full text-xs rounded-lg border-slate-300 focus:border-inema-green focus:ring-inema-green"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1" title="LEG006: Data final de cadastramento">
                Data Final
              </label>
              <input
                type="date"
                max={new Date().toISOString().split('T')[0]}
                value={filtros.dataFinal || ''}
                onChange={(e) => onChange({ ...filtros, dataFinal: e.target.value })}
                className="w-full text-xs rounded-lg border-slate-300 focus:border-inema-green focus:ring-inema-green"
              />
            </div>
          </div>
        </div>

        {/* Botões de Ação dos Filtros: Consultar (BOT001) e Limpar (BOT002) */}
        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={handleLimpar}
            className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-50 transition-colors flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-base">restart_alt</span>
            <span>Limpar filtros</span>
          </button>
          <button
            type="submit"
            className="px-5 py-2 bg-inema-green text-white rounded-lg text-xs font-bold hover:bg-inema-green-hover transition-colors shadow-xs flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-base">search</span>
            <span>Consultar</span>
          </button>
        </div>
      </form>
    </div>
  );
};
export default FiltrosConsulta;
