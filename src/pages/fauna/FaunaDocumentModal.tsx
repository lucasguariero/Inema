import React, { useState, useEffect } from 'react';
import { X, Printer, Download, ZoomIn, ZoomOut, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AsasItem, GuardiaoItem, LaudoTecnicoCetasLote, TgasDocumento } from '@/types/faunaR3R4';

export type TipoDocumentoFauna =
  | 'DR009-DOC001' // Certificado ASAS
  | 'DR009-DOC002' // Parecer de Indeferimento ASAS
  | 'DR009-DOC003' // Termo de Compromisso ASAS
  | 'DR012-DOC001' // TGAS Guardião
  | 'DR012-DOC002' // Laudo Técnico CETAS em Lote
  | 'DR012-DOC003'; // Notificação Guardião

interface FaunaDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  tipo: TipoDocumentoFauna;
  asas?: AsasItem;
  guardiao?: GuardiaoItem;
  tgas?: TgasDocumento;
  laudo?: LaudoTecnicoCetasLote;
}

export const FaunaDocumentModal: React.FC<FaunaDocumentModalProps> = ({
  isOpen,
  onClose,
  tipo,
  asas,
  guardiao,
  tgas,
  laudo
}) => {
  const [zoom, setZoom] = useState<number>(100);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleDownload = () => {
    window.print();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      data-testid="modal-documento-fauna"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto"
    >
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Topbar do Modal */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-400 flex items-center justify-center font-bold text-xs">
              A4
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                {tipo === 'DR009-DOC001' && 'Certificado de Área de Soltura (DOC001)'}
                {tipo === 'DR009-DOC002' && 'Notificação de Indeferimento de ASAS (DOC002)'}
                {tipo === 'DR009-DOC003' && 'Termo de Compromisso da ASAS (DOC003 — Anexo V)'}
                {tipo === 'DR012-DOC001' && 'Termo de Guarda de Animais Silvestres (DOC001 — TGAS)'}
                {tipo === 'DR012-DOC002' && 'Laudo Técnico de Indicação do CETAS em Lote (DOC002)'}
                {tipo === 'DR012-DOC003' && 'Notificação Técnica de Adequação (DOC003)'}
                <Badge variant="outline" className="text-[10px] bg-emerald-50 text-emerald-700 border-emerald-300">
                  SEIA V2 Oficial
                </Badge>
              </h3>
              <p className="text-xs text-slate-500">
                Visualização oficial em folha A4 com simulação de assinaturas e QR Code
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Controles de Zoom */}
            <div className="flex items-center bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-0.5 text-xs">
              <button
                onClick={() => setZoom((z) => Math.max(70, z - 10))}
                className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-slate-600 dark:text-slate-300 cursor-pointer"
                title="Reduzir zoom"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="px-2 font-mono text-[11px] text-slate-600 dark:text-slate-300">{zoom}%</span>
              <button
                onClick={() => setZoom((z) => Math.min(130, z + 10))}
                className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-slate-600 dark:text-slate-300 cursor-pointer"
                title="Aumentar zoom"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>

            <Button size="sm" variant="outline" onClick={handleDownload} className="text-xs gap-1.5 h-8">
              <Printer className="w-3.5 h-3.5" /> Imprimir
            </Button>
            <Button size="sm" variant="outline" onClick={handleDownload} className="text-xs gap-1.5 h-8">
              <Download className="w-3.5 h-3.5" /> Baixar PDF
            </Button>

            <button
              onClick={onClose}
              data-testid="btn-fechar-modal-documento"
              className="w-8 h-8 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors ml-2 cursor-pointer"
              aria-label="Fechar modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Corpo do Documento (Folha A4 estilizada) */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-100 dark:bg-slate-950 flex justify-center">
          <div
            style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
            className="w-[210mm] min-h-[297mm] bg-white text-slate-900 shadow-xl border border-slate-300 p-10 flex flex-col justify-between text-xs transition-transform duration-150 relative select-none"
          >
            {/* Marca d'água de demonstração */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
              <span className="text-7xl font-black rotate-[-35deg] text-slate-900 uppercase">
                DEMONSTRAÇÃO SEIA
              </span>
            </div>

            {/* Cabeçalho Institucional do Estado da Bahia */}
            <div>
              <div className="flex items-center justify-between border-b-2 border-[#0F4C3A] pb-4 mb-6">
                <div className="flex items-center gap-4">
                  <img src="/logo.svg" alt="INEMA" className="h-12 w-auto object-contain" />
                  <div>
                    <h1 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                      GOVERNO DO ESTADO DA BAHIA
                    </h1>
                    <h2 className="text-xs font-semibold text-[#0F4C3A]">
                      SECRETARIA DO MEIO AMBIENTE — SEMA
                    </h2>
                    <p className="text-[11px] text-slate-600 font-medium">
                      INSTITUTO DO MEIO AMBIENTE E RECURSOS HÍDRICOS — INEMA
                    </p>
                    <p className="text-[10px] text-slate-500">
                      Coordenação de Gestão de Fauna Silvestre — CGFAU
                    </p>
                  </div>
                </div>
                <div className="text-right text-[10px] text-slate-500">
                  <p className="font-mono font-bold text-slate-800">SISTEMA SEIA V2</p>
                  <p>Gestão de Fauna Silvestre</p>
                  <p className="mt-1">
                    Emissão: {new Date().toLocaleDateString('pt-BR')} às {new Date().toLocaleTimeString('pt-BR')}
                  </p>
                </div>
              </div>

              {/* CONTEÚDO ESPECÍFICO DO DOCUMENTO */}

              {/* 1. DR009-DOC001: CERTIFICADO ASAS */}
              {tipo === 'DR009-DOC001' && asas && (
                <div className="space-y-4">
                  <div className="text-center my-6">
                    <span className="text-xs font-bold uppercase tracking-widest text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                      CERTIFICADO OFICIAL
                    </span>
                    <h2 className="text-base font-bold text-slate-900 mt-2">
                      CERTIFICADO DE ÁREA DE SOLTURA DE ANIMAIS SILVESTRES (ASAS)
                    </h2>
                    <p className="text-xs font-mono font-bold text-[#0F4C3A] mt-1">
                      Nº {asas.numero} — PROCESSO SEI: {asas.processoSei || '015.1102.2026.0004128-99'}
                    </p>
                  </div>

                  <p className="text-justify leading-relaxed">
                    O <strong>INSTITUTO DO MEIO AMBIENTE E RECURSOS HÍDRICOS - INEMA</strong>, autarquia estadual
                    vinculada à Secretaria do Meio Ambiente do Estado da Bahia, no uso de suas atribuições legais
                    e considerando o parecer técnico favorável emitido na Vistoria Oficial{' '}
                    <strong>{asas.vistoria?.numero || 'F-TEC-133/2026-012'}</strong>, concede o presente{' '}
                    <strong>CERTIFICADO DE CADASTRO</strong> à propriedade abaixo qualificada:
                  </p>

                  <div className="border border-slate-200 rounded-lg p-3 bg-slate-50 space-y-2">
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div>
                        <span className="text-slate-500 font-medium">Nome do Imóvel:</span>{' '}
                        <strong className="text-slate-800">{asas.propriedade.nome}</strong>
                      </div>
                      <div>
                        <span className="text-slate-500 font-medium">Classificação ASAS:</span>{' '}
                        <strong className="text-emerald-800">{asas.categoria}</strong>
                      </div>
                      <div>
                        <span className="text-slate-500 font-medium">Proprietário / Requerente:</span>{' '}
                        <strong className="text-slate-800">{asas.requerente.nomeOuRazaoSocial}</strong>
                      </div>
                      <div>
                        <span className="text-slate-500 font-medium">CPF/CNPJ:</span>{' '}
                        <span className="font-mono">{asas.requerente.cpfCnpj}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 font-medium">Município / UF:</span>{' '}
                        <strong className="text-slate-800">{asas.propriedade.municipio} / BA</strong>
                      </div>
                      <div>
                        <span className="text-slate-500 font-medium">CEFIR:</span>{' '}
                        <span className="font-mono">{asas.propriedade.numeroCefir || 'Dispensa comprovada'}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 font-medium">Bioma / Bacia:</span>{' '}
                        <span>
                          {asas.propriedade.bioma} — {asas.propriedade.bacia} ({asas.propriedade.ur})
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 font-medium">Área Georreferenciada:</span>{' '}
                        <strong>{asas.delimitacao?.areaHa || 1450.75} hectares</strong>
                      </div>
                      <div className="col-span-2">
                        <span className="text-slate-500 font-medium">Responsável Técnico:</span>{' '}
                        <span>
                          {asas.responsavelTecnico?.nome || 'Dr. Lucas Sampaio Guimarães'} (
                          {asas.responsavelTecnico?.conselhoClasse}:{' '}
                          {asas.responsavelTecnico?.numeroRegistro} — ART nº{' '}
                          {asas.responsavelTecnico?.artNumero})
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-bold text-[11px] text-slate-800 uppercase border-b border-slate-200 pb-1">
                      Aptidão e Condições Técnicas Fixadas
                    </h4>
                    <p className="text-justify text-[11px] text-slate-700 leading-relaxed">
                      {asas.vistoria?.especiesAdequadasTexto ||
                        'Área apta para recepção de aves e mamíferos silvestres da Caatinga e Cerrado, em conformidade com o plano de manejo homologado.'}
                    </p>
                    <p className="text-[10px] text-slate-500 italic">
                      * Em caso de categoria II ou III, a permanência de animais em recintos de aclimatação é
                      condicionada à entrega tempestiva dos relatórios trimestrais assinados pelo Responsável
                      Técnico (RN-034).
                    </p>
                  </div>

                  <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-lg text-emerald-950 text-[11px] space-y-1">
                    <div className="flex items-center justify-between font-bold">
                      <span>Validade do Certificado: 2 (dois) anos</span>
                      <span>
                        Vigência: {asas.dataEmissaoCertificado || '10/05/2024'} até{' '}
                        {asas.dataValidadeCertificado || '10/05/2026'}
                      </span>
                    </div>
                    <p className="text-[10px] text-emerald-800">
                      A renovação deverá ser solicitada com antecedência mínima de 60 dias do vencimento.
                    </p>
                  </div>
                </div>
              )}

              {/* 2. DR009-DOC002: PARECER DE INDEFERIMENTO ASAS */}
              {tipo === 'DR009-DOC002' && asas && (
                <div className="space-y-4">
                  <div className="text-center my-6">
                    <span className="text-xs font-bold uppercase tracking-widest text-rose-800 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
                      NOTIFICAÇÃO FORMAL
                    </span>
                    <h2 className="text-base font-bold text-slate-900 mt-2">
                      NOTIFICAÇÃO DE INDEFERIMENTO DE REQUERIMENTO DE ASAS
                    </h2>
                    <p className="text-xs font-mono font-bold text-rose-700 mt-1">
                      Nº NOT-IND-{asas.numero} — PROCESSO SEI: {asas.processoSei || '015.1102.2025.0088192-12'}
                    </p>
                  </div>

                  <p className="text-justify leading-relaxed">
                    O <strong>INSTITUTO DO MEIO AMBIENTE E RECURSOS HÍDRICOS - INEMA</strong>, por meio da
                    Coordenação de Gestão de Fauna Silvestre — CGFAU, comunica o{' '}
                    <strong>INDEFERIMENTO DEFINITIVO</strong> do Requerimento de Cadastro de Área de Soltura de
                    Animais Silvestres formulado para o imóvel <strong>{asas.propriedade.nome}</strong>, localizado
                    no município de <strong>{asas.propriedade.municipio} / BA</strong>.
                  </p>

                  <div className="border border-rose-200 rounded-lg p-3 bg-rose-50/50 space-y-2">
                    <h4 className="font-bold text-rose-900 text-xs">Fundamentação Técnica e Legal:</h4>
                    <p className="text-justify text-[11px] text-rose-950 leading-relaxed">
                      {asas.vistoria?.justificativa ||
                        'Área não atende aos requisitos mínimos de isolamento fitossanitário e segurança contra predadores ou ações antrópicas degradantes.'}
                    </p>
                  </div>

                  <p className="text-[11px] text-slate-600">
                    O processo é encerrado na esfera administrativa com status de somente leitura.
                  </p>
                </div>
              )}

              {/* 3. DR009-DOC003: TERMO DE COMPROMISSO ASAS (ANEXO V) */}
              {tipo === 'DR009-DOC003' && asas && (
                <div className="space-y-4">
                  <div className="text-center my-6">
                    <span className="text-xs font-bold uppercase tracking-widest text-[#0F4C3A] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                      ANEXO V — TERMO FORMAL
                    </span>
                    <h2 className="text-base font-bold text-slate-900 mt-2">
                      TERMO DE COMPROMISSO E COOPERAÇÃO TÉCNICA — ASAS
                    </h2>
                    <p className="text-xs font-mono font-bold text-slate-700 mt-1">
                      VINCULADO AO CERTIFICADO Nº {asas.numero}
                    </p>
                  </div>

                  <p className="text-justify leading-relaxed">
                    Pelo presente instrumento, de um lado o <strong>INEMA</strong>, e de outro o proprietário{' '}
                    <strong>{asas.requerente.nomeOuRazaoSocial}</strong>, celebram o presente Termo de Compromisso
                    para viabilizar a soltura monitorada de espécimes da fauna silvestre na propriedade{' '}
                    <strong>{asas.propriedade.nome}</strong>, sob as cláusulas do Decreto Estadual de Proteção à Fauna.
                  </p>

                  <div className="text-[11px] space-y-2 border-l-2 border-slate-300 pl-3">
                    <p>
                      <strong>Cláusula Primeira:</strong> O Compromissário assume a guarda protetiva da área sem
                      direito de apropriação ou posse privada sobre os animais soltos.
                    </p>
                    <p>
                      <strong>Cláusula Segunda:</strong> É terminantemente proibida a prática de caça, perseguição
                      ou captura de qualquer animal na propriedade.
                    </p>
                    <p>
                      <strong>Cláusula Terceira:</strong> Fica franqueado aos fiscais e técnicos do INEMA o livre
                      acesso para vistorias periódicas.
                    </p>
                  </div>
                </div>
              )}

              {/* 4. DR012-DOC001: TGAS GUARDIÃO (ANEXO III) */}
              {tipo === 'DR012-DOC001' && guardiao && (
                <div className="space-y-4">
                  <div className="text-center my-6">
                    <span className="text-xs font-bold uppercase tracking-widest text-[#0F4C3A] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                      ANEXO III — TERMO FORMAL
                    </span>
                    <h2 className="text-base font-bold text-slate-900 mt-2">
                      TERMO DE GUARDA DE ANIMAIS SILVESTRES (TGAS)
                    </h2>
                    <p className="text-xs font-mono font-bold text-[#0F4C3A] mt-1">
                      Nº {guardiao.tgasVigente?.numero || 'TGAS-2026/0001'} — CADASTRO:{' '}
                      {guardiao.numeroCadastro}
                    </p>
                  </div>

                  <p className="text-justify leading-relaxed">
                    O <strong>INSTITUTO DO MEIO AMBIENTE E RECURSOS HÍDRICOS - INEMA</strong> confere a guarda
                    excepcional, a título precário e gratuito, dos espécimes silvestres discriminados neste
                    instrumento a(o) Guardião(ã):
                  </p>

                  <div className="border border-slate-200 rounded-lg p-3 bg-slate-50 grid grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <span className="text-slate-500">Guardião Habilitado:</span>{' '}
                      <strong>{guardiao.requerente.nomeOuRazaoSocial}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500">CPF/CNPJ:</span>{' '}
                      <span className="font-mono">{guardiao.requerente.cpfCnpj}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Endereço do Recinto:</span>{' '}
                      <span>{guardiao.recinto.endereco}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Município:</span>{' '}
                      <strong>{guardiao.recinto.municipio} / BA</strong>
                    </div>
                    <div>
                      <span className="text-slate-500">Dimensões do Recinto:</span>{' '}
                      <span>
                        {guardiao.recinto.comprimentoM}m x {guardiao.recinto.larguraM}m x{' '}
                        {guardiao.recinto.alturaM}m ({guardiao.recinto.areaM2} m²)
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500">Vigência Inicial:</span>{' '}
                      <strong>12 (doze) meses com prorrogação anual automática</strong>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h4 className="font-bold text-[11px] text-slate-800 uppercase border-b border-slate-200 pb-1">
                      Relação de Animais Confiados Sob Guarda
                    </h4>
                    <table className="w-full text-[10px] border border-slate-200">
                      <thead className="bg-slate-100 font-bold">
                        <tr>
                          <th className="p-1.5 text-left">Nº Digital</th>
                          <th className="p-1.5 text-left">Espécie</th>
                          <th className="p-1.5 text-left">Marcação Física</th>
                          <th className="p-1.5 text-left">Sexo</th>
                          <th className="p-1.5 text-left">Situação</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(guardiao.tgasVigente?.animaisSobGuarda || []).map((an, i) => (
                          <tr key={i} className="border-t border-slate-200">
                            <td className="p-1.5 font-mono font-bold text-slate-700">{an.numeroDigital}</td>
                            <td className="p-1.5">
                              <strong>{an.nomeComum}</strong> (<em>{an.nomeCientifico}</em>)
                            </td>
                            <td className="p-1.5 font-mono">
                              {an.tipoMarcacao}: {an.codigoMarcacao}
                            </td>
                            <td className="p-1.5">{an.sexo}</td>
                            <td className="p-1.5">
                              <Badge variant="outline" className="text-[9px]">
                                {an.situacaoAnimal}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="text-[10px] space-y-1 text-slate-700 leading-relaxed border-t border-slate-200 pt-2">
                    <p>
                      <strong>Obrigações Mandatórias:</strong> 1) Comunicação de óbito ou fuga em até 48 horas; 2)
                      Submissão de relatório semestral assinado por Médico Veterinário (CRMV); 3) Proibição absoluta
                      de reprodução, venda ou cessão; 4) Em caso de encerramento, devolução obrigatória dos animais
                      ao CETAS.
                    </p>
                  </div>
                </div>
              )}

              {/* 5. DR012-DOC002: LAUDO TÉCNICO DO CETAS EM LOTE */}
              {tipo === 'DR012-DOC002' && (laudo || guardiao?.laudosCetas[0]) && (
                <div className="space-y-4">
                  {(() => {
                    const l = laudo || guardiao?.laudosCetas[0]!;
                    return (
                      <>
                        <div className="text-center my-6">
                          <span className="text-xs font-bold uppercase tracking-widest text-[#0F4C3A] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                            DOC002 — CETAS OFICIAL
                          </span>
                          <h2 className="text-base font-bold text-slate-900 mt-2">
                            LAUDO TÉCNICO VETERINÁRIO DE INDICAÇÃO EM LOTE
                          </h2>
                          <p className="text-xs font-mono font-bold text-slate-700 mt-1">
                            Nº {l.numero} — EMISSÃO: {l.dataEmissao}
                          </p>
                        </div>

                        <p className="text-justify leading-relaxed">
                          O Médico Veterinário signatário do Centro de Triagem de Animais Silvestres — CETAS,
                          certifica a avaliação clínica, comportamental e sanitária do lote de animais abaixo
                          indicados para guarda excepcional, atestando a impossibilidade definitiva de soltura:
                        </p>

                        <div className="space-y-3">
                          {l.animaisLote.map((an, idx) => (
                            <div
                              key={idx}
                              className="border border-slate-200 rounded-lg p-2.5 bg-slate-50 text-[11px] space-y-1"
                            >
                              <div className="flex justify-between font-bold text-slate-900 border-b border-slate-200 pb-1">
                                <span>
                                  {idx + 1}. {an.nomeComum} (<em>{an.nomeCientifico}</em>) — Nº Digital:{' '}
                                  {an.numeroDigital}
                                </span>
                                <span className="font-mono text-emerald-800">
                                  {an.tipoMarcacao}: {an.codigoMarcacao}
                                </span>
                              </div>
                              <p>
                                <strong>Anamnese / Histórico:</strong> {an.anamnese || 'Animal domesticado de longa data.'}
                              </p>
                              <p>
                                <strong>Exame Físico por Sistemas:</strong>{' '}
                                {an.exameFisicoSistemas || 'Plumagem aparada e atrofia muscular crônica.'}
                              </p>
                              <p>
                                <strong>Avaliação Comportamental:</strong>{' '}
                                {an.avaliacaoComportamental || 'Imprinting humano irreversível.'}
                              </p>
                              <p className="text-rose-900 font-medium">
                                <strong>Justificativa de Inaptidão para Soltura:</strong>{' '}
                                {an.justificativaImpossibilidadeSoltura ||
                                  'Incapacidade de sobrevivência autônoma no meio silvestre.'}
                              </p>
                            </div>
                          ))}
                        </div>
                      </>
                    );
                  })()}
                </div>
              )}

              {/* 6. DR012-DOC003: NOTIFICAÇÃO TÉCNICA */}
              {tipo === 'DR012-DOC003' && guardiao && (
                <div className="space-y-4">
                  <div className="text-center my-6">
                    <span className="text-xs font-bold uppercase tracking-widest text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                      NOTIFICAÇÃO FORMAL
                    </span>
                    <h2 className="text-base font-bold text-slate-900 mt-2">
                      NOTIFICAÇÃO DE REGULARIZAÇÃO E ADEQUAÇÃO DE GUARDA
                    </h2>
                    <p className="text-xs font-mono font-bold text-amber-900 mt-1">
                      Nº NOT-GUARD-{guardiao.numeroCadastro}
                    </p>
                  </div>

                  <p className="text-justify leading-relaxed">
                    Fica notificado(a) o(a) Sr.(a){' '}
                    <strong>{guardiao.requerente.nomeOuRazaoSocial}</strong> a cumprir as exigências sanitárias e
                    estruturais apontadas pela fiscalização, no prazo de{' '}
                    <strong>{guardiao.vistoria?.prazoAdequacaoDias || 30} (trinta) dias</strong>, sob pena de
                    recolhimento cautelar dos animais e encerramento do Termo de Guarda.
                  </p>
                </div>
              )}
            </div>

            {/* Rodapé com Assinaturas Simuladas e QR Code Institucional */}
            <div className="border-t border-slate-300 pt-6 mt-8">
              <div className="grid grid-cols-3 gap-6 items-end">
                {/* QR Code de Autenticidade */}
                <div className="flex items-center gap-2">
                  <div className="w-16 h-16 bg-white border border-slate-300 p-1 rounded flex items-center justify-center">
                    {/* SVG simulando QR Code */}
                    <svg viewBox="0 0 24 24" className="w-full h-full text-slate-800" fill="currentColor">
                      <rect x="2" y="2" width="6" height="6" />
                      <rect x="16" y="2" width="6" height="6" />
                      <rect x="2" y="16" width="6" height="6" />
                      <rect x="10" y="2" width="2" height="2" />
                      <rect x="10" y="6" width="4" height="2" />
                      <rect x="2" y="10" width="2" height="4" />
                      <rect x="6" y="10" width="2" height="2" />
                      <rect x="14" y="10" width="4" height="2" />
                      <rect x="10" y="14" width="2" height="4" />
                      <rect x="14" y="14" width="2" height="2" />
                      <rect x="18" y="14" width="4" height="4" />
                      <rect x="10" y="20" width="4" height="2" />
                    </svg>
                  </div>
                  <div className="text-[9px] text-slate-500 leading-tight">
                    <p className="font-bold text-slate-700">Validação Digital</p>
                    <p>Código: <span className="font-mono text-slate-900">FAU-2026-X99</span></p>
                    <p>inema.ba.gov.br/autenticidade</p>
                  </div>
                </div>

                {/* Assinatura 1 */}
                <div className="text-center text-[10px]">
                  <div className="border-b border-slate-400 pb-1 mb-1 font-serif italic text-slate-600">
                    Assinado digitalmente via SEI-BA
                  </div>
                  <p className="font-bold text-slate-800">Dr. Herickles Almado</p>
                  <p className="text-slate-500">Coordenação de Gestão de Fauna — CGFAU</p>
                  <p className="text-[9px] text-slate-400">Matrícula 88.412-9</p>
                </div>

                {/* Assinatura 2 */}
                <div className="text-center text-[10px]">
                  <div className="border-b border-slate-400 pb-1 mb-1 font-serif italic text-slate-600">
                    Assinado digitalmente via gov.br
                  </div>
                  <p className="font-bold text-slate-800">Diretoria Geral do INEMA</p>
                  <p className="text-slate-500">Diretor(a) Geral</p>
                  <p className="text-[9px] text-slate-400">Decreto Estadual nº 14.024/2012</p>
                </div>
              </div>

              <div className="text-center text-[9px] text-slate-400 mt-4 border-t border-slate-200 pt-2">
                Documento emitido eletronicamente pelo Sistema Estadual de Informações Ambientais (SEIA V2). Simulação
                demonstrativa conforme normas da Portaria INEMA e Portaria SEMA vigentes.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
