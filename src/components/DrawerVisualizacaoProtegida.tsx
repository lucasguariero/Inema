import React, { useState } from 'react';
import { 
  RegistroFiscalizacaoExterno, 
  TipoRelatorioRegulatorio 
} from '../types/fiscalizacao-externa';

interface DrawerVisualizacaoProtegidaProps {
  isOpen: boolean;
  registro: RegistroFiscalizacaoExterno | null;
  onClose: () => void;
  onBaixarPdf: (registro: RegistroFiscalizacaoExterno) => void;
  onAnexarRelatorio?: (registro: RegistroFiscalizacaoExterno, tipo: TipoRelatorioRegulatorio) => void;
}

export const DrawerVisualizacaoProtegida: React.FC<DrawerVisualizacaoProtegidaProps> = ({
  isOpen,
  registro,
  onClose,
  onBaixarPdf,
  onAnexarRelatorio
}) => {
  const [abaAtiva, setAbaAtiva] = useState<'geral' | 'comunicante' | 'relatorios' | 'historico'>('geral');

  if (!isOpen || !registro) return null;

  const isRE = registro.tipoRegistro === 'Emergência Química (RE)';

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-2xl bg-white shadow-2xl flex flex-col border-l border-slate-200 animate-slideLeft">
          
          {/* Cabeçalho do Drawer */}
          <div className="p-5 bg-inema-green text-white flex items-center justify-between shadow-xs">
            <div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-400 text-xl">
                  {isRE ? 'warning' : 'report'}
                </span>
                <span className="font-mono font-bold text-base tracking-wide">
                  {registro.numeroRegistro}
                </span>
              </div>
              <p className="text-xs text-white/80 mt-0.5">
                Visualização Protegida do Registro Externo (RN010)
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onBaixarPdf(registro)}
                className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                title="BOT004: Baixar PDF"
              >
                <span className="material-symbols-outlined text-base">picture_as_pdf</span>
                <span>Baixar PDF</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                title="Fechar visualização"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>
          </div>

          {/* Banner de Proteção de Dados (RN010) */}
          <div className="px-5 py-2.5 bg-emerald-50 border-b border-emerald-200 text-emerald-900 text-xs flex items-center gap-2">
            <span className="material-symbols-outlined text-base text-emerald-700">shield</span>
            <span>
              <strong>RN010 (Somente Leitura):</strong> Dados pessoais e notas técnicas internas são resguardados para a visualização externa.
            </span>
          </div>

          {/* Abas de Navegação Interna */}
          <div className="flex border-b border-slate-200 px-5 bg-slate-50 gap-4 text-xs font-semibold text-slate-600">
            <button
              type="button"
              onClick={() => setAbaAtiva('geral')}
              className={`py-3 border-b-2 flex items-center gap-1.5 transition-colors ${
                abaAtiva === 'geral'
                  ? 'border-inema-green text-inema-green font-bold'
                  : 'border-transparent hover:text-slate-900'
              }`}
            >
              <span className="material-symbols-outlined text-base">info</span>
              <span>Dados Gerais</span>
            </button>
            <button
              type="button"
              onClick={() => setAbaAtiva('comunicante')}
              className={`py-3 border-b-2 flex items-center gap-1.5 transition-colors ${
                abaAtiva === 'comunicante'
                  ? 'border-inema-green text-inema-green font-bold'
                  : 'border-transparent hover:text-slate-900'
              }`}
            >
              <span className="material-symbols-outlined text-base">person</span>
              <span>Comunicante</span>
            </button>
            <button
              type="button"
              onClick={() => setAbaAtiva('relatorios')}
              className={`py-3 border-b-2 flex items-center gap-1.5 transition-colors ${
                abaAtiva === 'relatorios'
                  ? 'border-inema-green text-inema-green font-bold'
                  : 'border-transparent hover:text-slate-900'
              }`}
            >
              <span className="material-symbols-outlined text-base">attach_file</span>
              <span>Relatórios ({registro.relatoriosAnexados.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setAbaAtiva('historico')}
              className={`py-3 border-b-2 flex items-center gap-1.5 transition-colors ${
                abaAtiva === 'historico'
                  ? 'border-inema-green text-inema-green font-bold'
                  : 'border-transparent hover:text-slate-900'
              }`}
            >
              <span className="material-symbols-outlined text-base">history</span>
              <span>Histórico</span>
            </button>
          </div>

          {/* Conteúdo das Abas */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
            
            {/* Aba 1: Dados Gerais */}
            {abaAtiva === 'geral' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Status Atual</span>
                    <span className="font-bold text-slate-800 text-sm">{registro.status}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Data do Cadastro</span>
                    <span className="font-bold text-slate-800">{registro.dataHoraCadastro}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Tipo de Registro</span>
                    <span className="font-medium text-slate-700">{registro.tipoRegistro}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Município da Ocorrência</span>
                    <span className="font-medium text-slate-700">{registro.municipio}</span>
                  </div>
                </div>

                {/* Tipologia Química */}
                {registro.tipoEmergenciaQuimica && (
                  <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200">
                    <span className="text-[10px] text-amber-800 uppercase font-bold block mb-0.5">Tipologia Química (RN027)</span>
                    <span className="font-semibold text-amber-900">{registro.tipoEmergenciaQuimica}</span>
                    {registro.descricaoTipoOutros && (
                      <p className="text-xs text-amber-800 mt-1 italic">
                        Especificação: {registro.descricaoTipoOutros}
                      </p>
                    )}
                  </div>
                )}

                {/* Descrição do Fato */}
                <div className="space-y-1">
                  <span className="font-bold text-slate-700 text-xs">Descrição da Ocorrência:</span>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-700 whitespace-pre-wrap leading-relaxed">
                    {registro.descricao}
                  </div>
                </div>

                {/* Localização e Referência */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <span className="font-bold text-slate-700 text-xs block border-b pb-1">Localização Detalhada</span>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Endereço:</span>
                      <span className="font-medium text-slate-800">{registro.endereco}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Bairro / Número:</span>
                      <span className="font-medium text-slate-800">
                        {registro.bairro || 'Não informado'} {registro.numero ? `, nº ${registro.numero}` : ''}
                      </span>
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Ponto de Referência:</span>
                    <span className="font-medium text-slate-800">{registro.pontoReferencia}</span>
                  </div>
                </div>

                {/* Áreas Atingidas */}
                {registro.areasAtingidas && registro.areasAtingidas.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="font-bold text-slate-700 text-xs block">Áreas Atingidas Declaradas (RN013):</span>
                    <div className="flex flex-wrap gap-1.5">
                      {registro.areasAtingidas.map((area) => (
                        <span key={area} className="px-2.5 py-1 bg-inema-sage text-inema-green font-semibold rounded-full text-xs">
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Coordenadas */}
                {registro.coordenadas && registro.coordenadas.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="font-bold text-slate-700 text-xs block">Coordenadas Registradas (RN011):</span>
                    <div className="space-y-1">
                      {registro.coordenadas.map((c, i) => (
                        <div key={c.id || i} className="p-2 bg-slate-50 rounded border border-slate-200 font-mono text-[11px] text-slate-700">
                          #{i + 1} [{c.tipo}]: Lat {c.latitude}, Long {c.longitude}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Aba 2: Comunicante */}
            {abaAtiva === 'comunicante' && (
              <div className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <span className="font-bold text-slate-700 text-xs block border-b pb-1">Identificação do Comunicante</span>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Nome / Razão Social:</span>
                      <span className="font-bold text-slate-800">{registro.comunicante.nomeRazaoSocial}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">CPF / CNPJ:</span>
                      <span className="font-mono text-slate-800">{registro.comunicante.cpfCnpj || 'Não informado'}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Telefone de Contato:</span>
                      <span className="font-medium text-slate-800">{registro.comunicante.telefone}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">E-mail:</span>
                      <span className="font-medium text-slate-800">{registro.comunicante.email || 'Não informado'}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <span className="font-bold text-slate-700 text-xs block border-b pb-1">Vínculo Empresarial Declarado</span>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Possui vínculo com a causadora?</span>
                    <span className="font-bold text-slate-800">{registro.comunicante.vinculoEmpresa}</span>
                  </div>
                  {registro.comunicante.vinculoEmpresa === 'SIM' ? (
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Empresa onde trabalha:</span>
                        <span className="font-medium text-slate-800">{registro.comunicante.nomeEmpresaTrabalho}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Cargo exercido:</span>
                        <span className="font-medium text-slate-800">{registro.comunicante.cargo}</span>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <span className="text-[10px] text-slate-400 block">Classificação:</span>
                      <span className="font-medium text-slate-800">
                        {registro.comunicante.classificacaoSemVinculo}
                        {registro.comunicante.outrasInstituicoesNome && ` (${registro.comunicante.outrasInstituicoesNome})`}
                      </span>
                    </div>
                  )}

                  {registro.comunicante.empresaResponsavelInformada && (
                    <div className="pt-2 border-t">
                      <span className="text-[10px] text-slate-400 block">Empresa Responsável Informada:</span>
                      <span className="font-medium text-slate-800">{registro.comunicante.empresaResponsavelInformada}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Aba 3: Relatórios Anexados */}
            {abaAtiva === 'relatorios' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-700">Relatórios Regulatórios Vinculados:</span>
                  {isRE && onAnexarRelatorio && (
                    <button
                      type="button"
                      onClick={() => onAnexarRelatorio(registro, 'Conclusivo')}
                      className="px-3 py-1.5 bg-inema-green text-white rounded-lg text-xs font-semibold hover:bg-inema-green-hover flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-sm">add</span>
                      <span>Anexar Relatório</span>
                    </button>
                  )}
                </div>

                {registro.relatoriosAnexados.length === 0 ? (
                  <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200">
                    <span className="material-symbols-outlined text-3xl text-slate-400">folder_open</span>
                    <p className="text-slate-600 font-medium mt-1">Nenhum relatório regulatório anexado ainda.</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Utilize as opções de anexo para enviar relatórios Preliminares (RPEQ), Conclusivos ou Complementares.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {registro.relatoriosAnexados.map((rel) => (
                      <div key={rel.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="material-symbols-outlined text-2xl text-inema-green">description</span>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-800">{rel.tipo}</span>
                              <span className="text-[10px] px-2 py-0.5 bg-slate-200 text-slate-700 rounded-full font-mono">
                                {(rel.tamanhoBytes / (1024 * 1024)).toFixed(2)} MB
                              </span>
                            </div>
                            <span className="text-xs text-slate-600 block font-mono">{rel.nomeArquivo}</span>
                            <span className="text-[10px] text-slate-400">
                              Enviado em {rel.dataHoraEnvio} por {rel.usuarioEnvio}
                            </span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => alert(`Iniciando download do arquivo ${rel.nomeArquivo}...`)}
                          className="p-1.5 rounded-lg hover:bg-white text-slate-600 hover:text-inema-green border border-slate-200"
                          title="Baixar arquivo"
                        >
                          <span className="material-symbols-outlined text-lg">download</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Aba 4: Histórico / Auditoria */}
            {abaAtiva === 'historico' && (
              <div className="space-y-3">
                <span className="font-bold text-slate-700 text-xs block">Trilha de Auditoria e Eventos (RN015):</span>
                <div className="relative pl-6 border-l-2 border-inema-green/30 space-y-4">
                  {registro.historico.map((ev) => (
                    <div key={ev.id} className="relative group">
                      <span className="absolute -left-[31px] top-0 w-3 h-3 rounded-full bg-inema-green border-2 border-white"></span>
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-800 text-xs">{ev.acao}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{ev.dataHora}</span>
                        </div>
                        <p className="text-xs text-slate-600">{ev.detalhes}</p>
                        <span className="text-[10px] text-slate-400 block">Responsável: {ev.usuario}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Rodapé do Drawer */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">
              Protocolo SEIA Oficial | INEMA Bahia
            </span>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 bg-slate-700 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors"
            >
              Fechar
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
export default DrawerVisualizacaoProtegida;
