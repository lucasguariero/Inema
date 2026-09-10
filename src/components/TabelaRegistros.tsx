import React, { useState } from 'react';
import { 
  RegistroFiscalizacaoExterno, 
  TipoRelatorioRegulatorio 
} from '../types/fiscalizacao-externa';

interface TabelaRegistrosProps {
  registros: RegistroFiscalizacaoExterno[];
  total: number;
  paginaAtual: number;
  totalPaginas: number;
  onPaginaChange: (novaPagina: number) => void;
  onVisualizar: (registro: RegistroFiscalizacaoExterno) => void;
  onBaixarPdf: (registro: RegistroFiscalizacaoExterno) => void;
  onAnexarRelatorio: (registro: RegistroFiscalizacaoExterno, tipo: TipoRelatorioRegulatorio) => void;
  onProcessoClick?: (numeroProcesso: string) => void;
}

export const TabelaRegistros: React.FC<TabelaRegistrosProps> = ({
  registros,
  total,
  paginaAtual,
  totalPaginas,
  onPaginaChange,
  onVisualizar,
  onBaixarPdf,
  onAnexarRelatorio,
  onProcessoClick
}) => {
  const [menuAbertoId, setMenuAbertoId] = useState<string | null>(null);

  // Badge de Status oficial do Design System INEMA
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'Emergência Registrada':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            <span>Emergência Registrada</span>
          </span>
        );
      case 'Denúncia Registrada':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-50 text-sky-800 border border-sky-200">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span>
            <span>Denúncia Registrada</span>
          </span>
        );
      case 'Análise Técnica':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-200">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            <span>Análise Técnica</span>
          </span>
        );
      case 'Em Fiscalização':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-800 border border-purple-200">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
            <span>Em Fiscalização</span>
          </span>
        );
      case 'Em Vistoria':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-800 border border-indigo-200">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
            <span>Em Vistoria</span>
          </span>
        );
      case 'Concluído':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>Concluído</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            <span>{status}</span>
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden space-y-0">
      {/* Barra de Totalização (RN008) */}
      <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-700">Registros Encontrados:</span>
          <span className="px-2 py-0.5 bg-inema-sage text-inema-green font-bold text-xs rounded-full">
            {total}
          </span>
        </div>
        <div className="text-xs text-slate-500">
          Página <strong>{paginaAtual}</strong> de <strong>{Math.max(totalPaginas, 1)}</strong>
        </div>
      </div>

      {/* Tabela de Resultados (RN007) */}
      <div className="overflow-x-auto min-h-[300px]">
        {registros.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-2xl">search_off</span>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-slate-700">
                MSG004 (Informativa - RN017):
              </p>
              <p className="text-sm text-slate-500">
                Nenhum registro foi encontrado para os filtros informados.
              </p>
            </div>
          </div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-600 font-semibold uppercase tracking-wider border-b border-slate-200 text-[11px]">
              <tr>
                <th className="px-4 py-3">Número do Registro</th>
                <th className="px-4 py-3">Data e Hora</th>
                <th className="px-4 py-3">Tipo de Registro</th>
                <th className="px-4 py-3">Município</th>
                <th className="px-4 py-3">Status / Situação</th>
                <th className="px-4 py-3 text-right">Ações (LEG008)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {registros.map((reg) => {
                const isRE = reg.tipoRegistro === 'Emergência Química (RE)';
                const vinculoEmpresa = reg.comunicante.vinculoEmpresa === 'SIM';
                const temProcesso = !!reg.processoFormal;

                return (
                  <tr key={reg.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Número do Registro com link Meus Processos (RN022) */}
                    <td className="px-4 py-3 font-semibold text-slate-800">
                      <div>
                        {temProcesso ? (
                          <button
                            type="button"
                            onClick={() => onProcessoClick && onProcessoClick(reg.processoFormal!)}
                            className="text-inema-green hover:underline flex items-center gap-1 font-bold"
                            title={`RN022: Associado ao Processo ${reg.processoFormal}`}
                          >
                            <span>{reg.numeroRegistro}</span>
                            <span className="material-symbols-outlined text-xs">open_in_new</span>
                          </button>
                        ) : (
                          <span>{reg.numeroRegistro}</span>
                        )}
                        {reg.tipoEmergenciaQuimica && (
                          <span className="block text-[10px] text-slate-500 font-sans truncate max-w-[220px]" title={reg.tipoEmergenciaQuimica}>
                            {reg.tipoEmergenciaQuimica}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Data e Hora */}
                    <td className="px-4 py-3 whitespace-nowrap text-slate-600">
                      {reg.dataHoraCadastro}
                    </td>

                    {/* Tipo de Registro */}
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 font-medium ${isRE ? 'text-amber-800' : 'text-emerald-800'}`}>
                        <span className="material-symbols-outlined text-sm">
                          {isRE ? 'warning' : 'report'}
                        </span>
                        <span>{reg.tipoRegistro}</span>
                      </span>
                    </td>

                    {/* Município */}
                    <td className="px-4 py-3 font-medium">
                      {reg.municipio}
                    </td>

                    {/* Status / Situação (LEG007) */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      {renderStatusBadge(reg.status)}
                    </td>

                    {/* Ações (BOT003, BOT004, BOT005, BOT006, BOT007) */}
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1">
                        {/* BOT003: Visualizar Registro Protegido */}
                        <button
                          type="button"
                          onClick={() => onVisualizar(reg)}
                          className="p-1.5 rounded-lg text-slate-600 hover:text-inema-green hover:bg-inema-sage/50 transition-colors"
                          title="BOT003: Visualizar registro em modo protegido (RN010)"
                        >
                          <span className="material-symbols-outlined text-lg">visibility</span>
                        </button>

                        {/* BOT004: Baixar PDF */}
                        <button
                          type="button"
                          onClick={() => onBaixarPdf(reg)}
                          className="p-1.5 rounded-lg text-slate-600 hover:text-red-700 hover:bg-red-50 transition-colors"
                          title="BOT004: Baixar PDF oficial com dados autorizados (RN011)"
                        >
                          <span className="material-symbols-outlined text-lg">picture_as_pdf</span>
                        </button>

                        {/* Ações de Relatórios Regulatórios para RE (RN012) */}
                        {isRE && (
                          <div className="relative inline-block text-left">
                            <button
                              type="button"
                              onClick={() => setMenuAbertoId(menuAbertoId === reg.id ? null : reg.id)}
                              className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                              title="Anexar Relatórios Regulatórios (RN012)"
                            >
                              <span className="material-symbols-outlined text-lg">post_add</span>
                            </button>

                            {/* Dropdown de Relatórios */}
                            {menuAbertoId === reg.id && (
                              <div 
                                className="origin-top-right absolute right-0 mt-1 w-56 rounded-xl shadow-lg bg-white ring-1 ring-black/5 divide-y divide-slate-100 z-30 animate-fadeIn text-left"
                                onMouseLeave={() => setMenuAbertoId(null)}
                              >
                                <div className="p-1.5">
                                  {/* BOT005: RPEQ - apenas com vínculo SIM */}
                                  {vinculoEmpresa ? (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setMenuAbertoId(null);
                                        onAnexarRelatorio(reg, 'Preliminar');
                                      }}
                                      className="w-full text-left px-3 py-2 text-xs rounded-lg text-slate-700 hover:bg-inema-sage/40 hover:text-inema-green flex items-center gap-2"
                                    >
                                      <span className="material-symbols-outlined text-sm text-inema-green">upload_file</span>
                                      <span>Anexar RPEQ (Preliminar)</span>
                                    </button>
                                  ) : (
                                    <div className="px-3 py-1.5 text-[10px] text-slate-400 bg-slate-50 rounded-lg">
                                      RPEQ disponível apenas para quem declarou vínculo empresarial
                                    </div>
                                  )}

                                  {/* BOT006: Relatório Conclusivo */}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setMenuAbertoId(null);
                                      onAnexarRelatorio(reg, 'Conclusivo');
                                    }}
                                    className="w-full text-left px-3 py-2 text-xs rounded-lg text-slate-700 hover:bg-inema-sage/40 hover:text-inema-green flex items-center gap-2"
                                  >
                                    <span className="material-symbols-outlined text-sm text-inema-green">task_alt</span>
                                    <span>Anexar Relatório Conclusivo</span>
                                  </button>

                                  {/* BOT007: Relatório Complementar */}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setMenuAbertoId(null);
                                      onAnexarRelatorio(reg, 'Complementar');
                                    }}
                                    className="w-full text-left px-3 py-2 text-xs rounded-lg text-slate-700 hover:bg-inema-sage/40 hover:text-inema-green flex items-center gap-2"
                                  >
                                    <span className="material-symbols-outlined text-sm text-inema-green">note_add</span>
                                    <span>Anexar Complementar</span>
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Paginação Oficial (BOT010, RN008) */}
      <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
        <button
          type="button"
          disabled={paginaAtual <= 1}
          onClick={() => onPaginaChange(paginaAtual - 1)}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg border flex items-center gap-1 transition-colors ${
            paginaAtual <= 1
              ? 'border-slate-200 text-slate-300 cursor-not-allowed bg-slate-100'
              : 'border-slate-300 text-slate-700 hover:bg-white bg-slate-50'
          }`}
        >
          <span className="material-symbols-outlined text-sm">chevron_left</span>
          <span>Anterior</span>
        </button>

        <span className="text-xs text-slate-500 font-medium">
          Página {paginaAtual} de {Math.max(totalPaginas, 1)}
        </span>

        <button
          type="button"
          disabled={paginaAtual >= totalPaginas}
          onClick={() => onPaginaChange(paginaAtual + 1)}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg border flex items-center gap-1 transition-colors ${
            paginaAtual >= totalPaginas
              ? 'border-slate-200 text-slate-300 cursor-not-allowed bg-slate-100'
              : 'border-slate-300 text-slate-700 hover:bg-white bg-slate-50'
          }`}
        >
          <span>Próxima</span>
          <span className="material-symbols-outlined text-sm">chevron_right</span>
        </button>
      </div>
    </div>
  );
};
export default TabelaRegistros;
