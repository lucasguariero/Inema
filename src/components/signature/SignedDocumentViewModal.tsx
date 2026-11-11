import React from 'react';
import { SignableDocument } from '@/types/signature';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { SignatureStamp } from '@/components/signature/SignatureStamp';
import { Printer, Download, ExternalLink, FileText, CheckCircle2 } from 'lucide-react';

interface SignedDocumentViewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: SignableDocument | null;
}

export const SignedDocumentViewModal: React.FC<SignedDocumentViewModalProps> = ({
  open,
  onOpenChange,
  document,
}) => {
  if (!document) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl max-h-[95vh] flex flex-col">
        {/* Topbar do Modal */}
        <DialogHeader className="bg-slate-100 dark:bg-slate-850 px-6 py-3 border-b border-slate-200 dark:border-slate-800 flex-shrink-0">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#0F4C3A]" />
              <DialogTitle className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Visualização do Documento Oficial A4
              </DialogTitle>
              <span className="text-xs text-slate-500 font-mono">({document.codigoDocumento})</span>
            </div>

            <div className="flex items-center gap-2 mr-8">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.print()}
                className="text-xs h-7 text-slate-700 dark:text-slate-300"
              >
                <Printer className="w-3 h-3 mr-1" />
                <span>Imprimir</span>
              </Button>
              <a
                href={`/?rota=autenticidade-documento&codigo=${document.codigoVerificador}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs text-[#0F4C3A] hover:underline font-semibold dark:text-emerald-400 px-2"
              >
                <span>Verificar autenticidade</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </DialogHeader>

        {/* Folha A4 com Diagramação Institucional SEIA */}
        <div className="p-6 sm:p-10 overflow-y-auto bg-slate-200/60 dark:bg-slate-950 flex justify-center flex-1">
          <div
            className="w-full max-w-[800px] bg-white dark:bg-slate-900 shadow-lg rounded-sm border border-slate-300 dark:border-slate-800 p-8 sm:p-12 text-slate-900 dark:text-slate-100 font-sans leading-relaxed text-xs space-y-6"
            style={{ minHeight: '1000px' }}
          >
            {/* Cabeçalho Oficial do Estado da Bahia / INEMA */}
            <div className="text-center border-b border-slate-300 dark:border-slate-700 pb-5 space-y-1">
              <div className="font-bold text-sm tracking-wider uppercase text-slate-900 dark:text-slate-100">
                Estado da Bahia
              </div>
              <div className="font-semibold text-xs text-slate-700 dark:text-slate-300">
                Secretaria do Meio Ambiente — SEMA
              </div>
              <div className="font-bold text-xs text-[#0F4C3A] dark:text-emerald-400">
                Instituto do Meio Ambiente e Recursos Hídricos — INEMA
              </div>
              <div className="text-[10px] text-slate-500 pt-1">
                Sistema Estadual de Informações Ambientais e Recursos Hídricos — SEIA
              </div>
            </div>

            {/* Metadados do Processo */}
            <div className="p-3 bg-slate-50 dark:bg-slate-850 rounded-lg border border-slate-200 dark:border-slate-800 grid grid-cols-2 gap-2 text-[11px]">
              <div>
                <span className="font-semibold text-slate-600 dark:text-slate-400">Processo: </span>
                <span className="font-mono font-bold">{document.numeroProcesso}</span>
              </div>
              <div>
                <span className="font-semibold text-slate-600 dark:text-slate-400">Código do Ato: </span>
                <span className="font-mono">{document.codigoDocumento}</span>
              </div>
              <div>
                <span className="font-semibold text-slate-600 dark:text-slate-400">Requerente: </span>
                <span>{document.requerente}</span>
              </div>
              <div>
                <span className="font-semibold text-slate-600 dark:text-slate-400">Município: </span>
                <span>{document.municipio}</span>
              </div>
            </div>

            {/* Título do Documento */}
            <div className="text-center pt-2 pb-2">
              <h2 className="text-sm sm:text-base font-bold uppercase tracking-wide text-slate-900 dark:text-slate-100">
                {document.tipoDocumento}
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-1">
                {document.titulo}
              </p>
            </div>

            {/* Corpo Técnico / Minuta */}
            <div className="space-y-4 text-justify text-slate-800 dark:text-slate-200 text-xs leading-relaxed">
              <p>{document.conteudoResumido}</p>

              {document.parecerMinuta && (
                <>
                  <div className="space-y-1.5 pt-2">
                    <h3 className="font-bold uppercase tracking-wider text-[11px] text-[#0F4C3A] dark:text-emerald-400">
                      1. Síntese do Objeto e Localização
                    </h3>
                    <p>{document.parecerMinuta.sintese}</p>
                  </div>

                  <div className="space-y-1.5 pt-2">
                    <h3 className="font-bold uppercase tracking-wider text-[11px] text-[#0F4C3A] dark:text-emerald-400">
                      2. Fundamentação Técnica e Base Legal
                    </h3>
                    <p>{document.parecerMinuta.fundamentacao}</p>
                  </div>

                  <div className="space-y-1.5 pt-2">
                    <h3 className="font-bold uppercase tracking-wider text-[11px] text-[#0F4C3A] dark:text-emerald-400">
                      3. Conclusão Administrativa
                    </h3>
                    <p>
                      Diante do exposto e considerando a regularidade dos elementos instruídos nos autos, opina-se pelo{' '}
                      <strong className="uppercase">
                        {document.parecerMinuta.conclusao === 'deferido'
                          ? 'DEFERIMENTO'
                          : document.parecerMinuta.conclusao === 'indeferido'
                          ? 'INDEFERIMENTO'
                          : 'RETORNO EM DILIGÊNCIA'}
                      </strong>{' '}
                      do pleito, condicionado ao cumprimento das normas ambientais estaduais vigentes.
                    </p>
                  </div>

                  {document.parecerMinuta.observacoes && (
                    <div className="space-y-1.5 pt-2">
                      <h3 className="font-bold uppercase tracking-wider text-[11px] text-[#0F4C3A] dark:text-emerald-400">
                        4. Observações e Condicionantes
                      </h3>
                      <p>{document.parecerMinuta.observacoes}</p>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Selo Institucional de Assinatura Eletrônica no Rodapé */}
            <SignatureStamp
              signers={document.signatarios}
              codigoVerificador={document.codigoVerificador}
              hashSha256={document.hashSha256}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
