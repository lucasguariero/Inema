import { getInfractions, infractionSummary } from '@/lib/aiad';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { type Aiad, coordinateText, getCoordsList, composedText, formatAiadDisplayNumber, formatAiadDisplayProcess } from '@/lib/aiad';
import { downloadAiadPdf, OFICIAL_FOOTER_ADDRESS, OFICIAL_FOOTER_CONTACT, SEIA_ORIENTATION } from '@/lib/aiadPdf';
import inemaLogo from '@/assets/logo-inema-color.png';
import { Download, Printer, CheckCircle2, FileText } from 'lucide-react';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  auto: Aiad | null;
}

export function AiadPreviewModal({ open, onOpenChange, auto }: Props) {
  const [activeVia, setActiveVia] = useState<'cliente' | 'inema'>('cliente');

  if (!auto) return null;

  const f = auto.fields;
  const isDraft = auto.status === 'rascunho' || !auto.number;
  const coordsList = getCoordsList(f);
  const now = new Date();
  const printTimestamp = now.toLocaleDateString('pt-BR') + ' às ' + now.toLocaleTimeString('pt-BR');

  const techSig = auto.signatures.find(s => s.role === 'tecnico');
  const coordSig = auto.signatures.find(s => s.role === 'coordenacao');

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    downloadAiadPdf(auto);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[92vh] overflow-y-auto p-0 border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 [&>button]:z-20">
        <DialogHeader className="p-4 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10 flex flex-row flex-wrap items-center justify-between gap-3 pr-12">
          <div>
            <DialogTitle className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <FileText className="h-5 w-5 text-emerald-800 dark:text-emerald-400" />
              Visualização Institucional do Auto de Infração
            </DialogTitle>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Apresentação oficial somente leitura (RN063 / RN065). Não altera o status nem forma o processo.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex bg-slate-100 dark:bg-slate-700 p-0.5 rounded-lg border border-slate-300 dark:border-slate-600">
              <button
                type="button"
                onClick={() => setActiveVia('cliente')}
                className={`text-xs px-2.5 py-1 rounded-md font-medium transition-colors ${
                  activeVia === 'cliente'
                    ? 'bg-emerald-800 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                1ª Via — Pessoa autuada
              </button>
              <button
                type="button"
                onClick={() => setActiveVia('inema')}
                className={`text-xs px-2.5 py-1 rounded-md font-medium transition-colors ${
                  activeVia === 'inema'
                    ? 'bg-emerald-800 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                2ª Via — INEMA
              </button>
            </div>
          </div>
        </DialogHeader>

        {/* Folha do Documento Oficial A4 formatada */}
        <div className="p-6">
          <div className="relative mx-auto bg-white dark:bg-slate-950 shadow-md border border-slate-300 dark:border-slate-700 rounded-sm p-8 max-w-3xl text-slate-900 dark:text-slate-100 text-xs leading-relaxed space-y-5">
            {/* Tarja d'água de Rascunho se aplicável */}
            {isDraft && (
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-10 select-none">
                <span className="text-4xl md:text-5xl font-black text-red-600 rotate-[-30deg] border-4 border-red-600 p-4 rounded-xl text-center">
                  RASCUNHO — MODELO DEMONSTRATIVO
                </span>
              </div>
            )}

            {/* Faixa Demonstrativa Superior */}
            <div className="bg-amber-100 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 px-3 py-1.5 rounded text-center font-bold text-xs uppercase tracking-wider">
              MODELO DEMONSTRATIVO — SEM VALIDADE LEGAL
            </div>

            {/* Cabeçalho Tipográfico Institucional Oficial */}
            <div className="border-b-2 border-emerald-900 pb-3 flex items-start justify-between gap-4">
              <div className="space-y-0.5">
                <img src={inemaLogo} alt="INEMA" className="h-10 w-auto object-contain" />
                <p className="text-[10px] font-bold tracking-wider text-slate-600 dark:text-slate-400 uppercase">
                  Governo do Estado da Bahia — Secretaria do Meio Ambiente (SEMA)
                </p>
                <h2 className="text-sm font-extrabold text-emerald-900 dark:text-emerald-400">
                  INSTITUTO DO MEIO AMBIENTE E RECURSOS HÍDRICOS — INEMA
                </h2>
                <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 tracking-wide uppercase">
                  AUTO DE INFRAÇÃO — ADVERTÊNCIA
                </h3>
              </div>

              <div className="text-right shrink-0">
                <span className="inline-block bg-emerald-900 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                  {activeVia === 'cliente' ? '1ª VIA — PESSOA AUTUADA' : '2ª VIA — INEMA / PROCESSO'}
                </span>
                <p className="text-[10px] text-emerald-800 dark:text-emerald-400 font-bold uppercase mt-0.5">
                  {activeVia === 'cliente' ? '1ª via - Cliente' : '2ª via INEMA'}
                </p>
                <p className="text-[11px] font-mono font-bold text-slate-700 dark:text-slate-300 mt-1">
                  {formatAiadDisplayNumber(auto.number)}
                </p>
              </div>
            </div>

            {/* Seção 1: Processos e Identificação */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-50 dark:bg-slate-900 p-3 rounded border border-slate-200 dark:border-slate-800">
              <div>
                <span className="block font-bold text-[10px] text-slate-500 uppercase">Auto nº</span>
                <span className="font-mono font-semibold">{formatAiadDisplayNumber(auto.number)}</span>
              </div>
              <div>
                <span className="block font-bold text-[10px] text-slate-500 uppercase">Processo Originador</span>
                <span className="font-mono font-semibold">{(auto.process ? formatAiadDisplayProcess(auto.process) : 'Sem processo vinculado')}</span>
              </div>
              <div>
                <span className="block font-bold text-[10px] text-slate-500 uppercase">Processo do Auto</span>
                <span className="font-mono font-semibold">{auto.relatedProcess ? formatAiadDisplayProcess(auto.relatedProcess) : 'Não formado'}</span>
              </div>
              <div>
                <span className="block font-bold text-[10px] text-slate-500 uppercase">Data Elaboração</span>
                <span>{f.date}</span>
              </div>
            </div>

            {/* Seção 2: Autuado */}
            <div className="space-y-1.5">
              <h4 className="font-bold text-[11px] text-emerald-900 dark:text-emerald-400 uppercase border-b border-slate-200 dark:border-slate-800 pb-1">
                1. Identificação da Pessoa Autuada
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <div className="md:col-span-2">
                  <span className="font-semibold text-slate-500">Nome / Razão Social: </span>
                  <span className="font-bold">{f.name || '—'}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-500">CPF / CNPJ: </span>
                  <span className="font-mono">{f.document || '—'}</span>
                </div>
                <div className="md:col-span-2">
                  <span className="font-semibold text-slate-500">Endereço: </span>
                  <span>{f.address}, CEP: {f.cep}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-500">Município / UF: </span>
                  <span>{f.city} / {f.uf}</span>
                </div>
                <div className="md:col-span-3">
                  <span className="font-semibold text-slate-500">Contatos: </span>
                  <span>E-mail: {f.email || '—'} | Telefone: {f.phone || '—'}</span>
                  {f.enterprise && (
                    <span className="block text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                      <strong>Empreendimento vinculado:</strong> {f.enterprise}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Seção 3: Infração */}
            <div className="space-y-1.5">
              <h4 className="font-bold text-[11px] text-emerald-900 dark:text-emerald-400 uppercase border-b border-slate-200 dark:border-slate-800 pb-1">
                2. Descrição da Infração e Constatação
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 bg-slate-50 dark:bg-slate-900 p-2.5 rounded border border-slate-200 dark:border-slate-800">
                <div>
                  <span className="font-semibold text-slate-500">Data Constatação: </span>
                  <span>{f.inspectionDate || f.date}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-500">Horário Constatação: </span>
                  <span>{f.inspectionTime ? `${f.inspectionTime} h` : '—'}</span>
                </div>
                <div className="md:col-span-3">
                  <span className="font-semibold text-slate-500">Local da Inspeção: </span>
                  <span>{f.inspection} — {f.inspectionAddress}, CEP: {f.inspectionCep}, {f.inspectionCity}/{f.inspectionUf}</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800 text-[11px] text-justify leading-relaxed space-y-2">
                <div>
                  <span className="font-bold block mb-0.5">Texto Composto do Auto (RN012):</span>
                  <p className="text-slate-800 dark:text-slate-200">{composedText(auto)}</p>
                </div>
                {f.facts && (
                  <div className="pt-1.5 border-t border-slate-200 dark:border-slate-800 text-[10px] text-slate-500">
                    <span className="font-semibold">Descrição técnica dos fatos: </span>
                    {f.facts}
                  </div>
                )}
              </div>
            </div>

            {/* Seção 4: Coordenadas */}
            <div className="space-y-1.5">
              <h4 className="font-bold text-[11px] text-emerald-900 dark:text-emerald-400 uppercase border-b border-slate-200 dark:border-slate-800 pb-1">
                3. Coordenadas Geográficas da Infração
              </h4>
              <table className="w-full text-left border-collapse border border-slate-200 dark:border-slate-800">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-800 text-[10px] uppercase font-bold text-slate-600 dark:text-slate-300">
                    <th className="p-1.5 border border-slate-200 dark:border-slate-700">Ponto</th>
                    <th className="p-1.5 border border-slate-200 dark:border-slate-700">Tipo</th>
                    <th className="p-1.5 border border-slate-200 dark:border-slate-700">Coordenadas</th>
                    <th className="p-1.5 border border-slate-200 dark:border-slate-700">Situação</th>
                  </tr>
                </thead>
                <tbody>
                  {coordsList.map((c, i) => (
                    <tr key={c.id || i} className="border-b border-slate-200 dark:border-slate-800 font-mono text-[11px]">
                      <td className="p-1.5 font-bold">Ponto #{i + 1}</td>
                      <td className="p-1.5">{c.type.toUpperCase()}</td>
                      <td className="p-1.5">{coordinateText(c)}</td>
                      <td className="p-1.5 font-sans">
                        <Badge color={c.validated ? 'success' : 'gray'}>
                          {c.validated ? 'Validada' : 'Não validada'}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Seção 5: Fundamentação e Prazos */}
            <div className="space-y-1.5">
              <h4 className="font-bold text-[11px] text-emerald-900 dark:text-emerald-400 uppercase border-b border-slate-200 dark:border-slate-800 pb-1">
                4. Dispositivo Normativo e Prazos Legais
              </h4>
              <div className="space-y-2 text-[11px]">
                <p>
                  <strong>Fundamento Legal (RN007): </strong>
                  Art. 180, I, da Lei 10.431 de 20/12/2006, c/c Art. 248, I do Regulamento, aprovado pelo Decreto Estadual nº 14.024 de 06/06/2012.
                </p>
                {getInfractions(f).map((infraction, index) => <div key={infraction.id}><strong>Infração {index + 1}</strong><p className="whitespace-pre-line">{infractionSummary(infraction)}</p></div>)}
                <div className="p-2.5 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 rounded text-amber-900 dark:text-amber-200 space-y-1 text-[11px]">
                  <p>
                    <strong>Prazo para Defesa (RN021): </strong>
                    Prazo para defesa junto ao INEMA: 20 dias da ciência do Auto, de acordo com o Art. 192, I, da Lei 10.431 de 20/12/2006.
                  </p>
                  <p>
                    <strong>Prazo para Recurso (RN022): </strong>
                    Prazo para recurso ao CEPRAM: 20 dias da decisão do INEMA, de acordo com o Art. 192, II, da Lei 10.431 de 20/12/2006.
                  </p>
                </div>
              </div>
            </div>

            {/* Seção 6: Assinaturas */}
            <div className="space-y-2 pt-2">
              <h4 className="font-bold text-[11px] text-emerald-900 dark:text-emerald-400 uppercase border-b border-slate-200 dark:border-slate-800 pb-1">
                5. Assinaturas Eletrônicas Institucionais
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800">
                  <span className="font-bold block text-slate-700 dark:text-slate-300">
                    Autoridade Fiscalizadora (Técnico Autor)
                  </span>
                  {techSig ? (
                    <div className="mt-1 space-y-0.5 text-[10px] text-slate-600 dark:text-slate-400">
                      <p className="font-semibold text-emerald-800 dark:text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" /> Assinado eletronicamente por {techSig.user}
                      </p>
                      <p>Data/hora: {new Date(techSig.at).toLocaleString('pt-BR')}</p>
                      <p className="font-mono text-[9px] break-all">Hash SHA-256: {techSig.hash}</p>
                    </div>
                  ) : (
                    <p className="text-[11px] text-slate-400 mt-1 italic">Aguardando assinatura técnica</p>
                  )}
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800">
                  <span className="font-bold block text-slate-700 dark:text-slate-300">
                    Coordenação Técnica da Fiscalização
                  </span>
                  {coordSig ? (
                    <div className="mt-1 space-y-0.5 text-[10px] text-slate-600 dark:text-slate-400">
                      <p className="font-semibold text-emerald-800 dark:text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" /> Validado e assinado por {coordSig.user}
                      </p>
                      <p>Data/hora: {new Date(coordSig.at).toLocaleString('pt-BR')}</p>
                      <p className="font-mono text-[9px] break-all">Hash SHA-256: {coordSig.hash}</p>
                    </div>
                  ) : (
                    <p className="text-[11px] text-slate-400 mt-1 italic">Aguardando validação da Coordenação</p>
                  )}
                </div>
              </div>
            </div>

            {/* Rodapé Oficial da RN071 */}
            <div className="pt-4 border-t border-slate-300 dark:border-slate-700 text-center space-y-1 text-[10px] text-slate-500 dark:text-slate-400">
              <p className="font-semibold">{OFICIAL_FOOTER_ADDRESS}</p>
              <p>{OFICIAL_FOOTER_CONTACT}</p>
              <p>{SEIA_ORIENTATION}</p>
              <p>QR Code: destino oficial pendente de definição.</p>
              <p>
                Documento emitido eletronicamente via Sistema Estadual de Informações Ambientais (SEIA). Emissão: {printTimestamp}. Indicação da via: {activeVia === 'cliente' ? '1ª via - Cliente' : '2ª via INEMA'}.
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="p-4 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 sticky bottom-0 z-10 flex flex-row items-center justify-between">
          <div className="text-xs text-slate-500">
            Formato: 2 vias institucionais com rodapé regulamentar (RN071)
          </div>
          <div className="flex gap-2">
            <Button size="sm" color="gray" type="button" onClick={handlePrint} className="flex items-center gap-1.5">
              <Printer className="h-4 w-4" />
              Imprimir
            </Button>
            <Button size="sm" color="primary" type="button" onClick={handleDownload} className="flex items-center gap-1.5">
              <Download className="h-4 w-4" />
              Baixar PDF Demonstrativo
            </Button>
            <Button size="sm" color="gray" type="button" onClick={() => onOpenChange(false)}>
              Fechar
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
