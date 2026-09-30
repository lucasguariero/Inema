import React from 'react';
import {
  FileText,
  Download,
  Printer,
  X,
  ShieldCheck,
  QrCode,
  Calendar,
  Building2,
  CheckCircle2,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export interface PdfDocumentData {
  tipo: 'CND' | 'DTRP' | 'PARECER_ENQUADRAMENTO' | 'DAE' | 'CONFISSAO_DIVIDA';
  titulo: string;
  codigoDocumento: string;
  interessado: string;
  cpfCnpj: string;
  processoSei?: string;
  dataEmissao: string;
  validade?: string;
  autenticidadeToken?: string;
  status: 'Válido' | 'Emitido' | 'Aprovado' | 'Pendente';
  corpoHtml?: React.ReactNode;
}

interface PdfPreviewDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: PdfDocumentData | null;
}

export const PdfPreviewDrawer: React.FC<PdfPreviewDrawerProps> = ({
  open,
  onOpenChange,
  data,
}) => {
  if (!data) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[96vw] sm:max-w-4xl p-0 overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 shadow-2xl rounded-2xl max-h-[92vh] flex flex-col">
        {/* Toolbar de Controle do Documento */}
        <div className="bg-slate-900 text-white px-3 sm:px-5 py-2.5 sm:py-3 flex items-center justify-between shrink-0 gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <FileText className="w-5 h-5 text-emerald-400 shrink-0" />
            <div className="min-w-0">
              <div className="text-xs font-bold text-slate-100 truncate">{data.titulo}</div>
              <div className="text-[10px] sm:text-[11px] font-mono text-slate-400 truncate">{data.codigoDocumento}</div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="text-xs h-8 px-2 sm:px-3 bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700"
            >
              <Printer className="w-3.5 h-3.5 sm:mr-1.5" />
              <span className="hidden sm:inline">Imprimir</span>
            </Button>
            <Button
              size="sm"
              className="text-xs h-8 px-2.5 sm:px-3 bg-[#0F4C3A] hover:bg-[#0c3d2e] text-white font-semibold"
            >
              <Download className="w-3.5 h-3.5 sm:mr-1.5" />
              <span className="hidden sm:inline">Baixar PDF Oficial</span>
              <span className="sm:hidden">Baixar</span>
            </Button>
            <button
              onClick={() => onOpenChange(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Visualizador de Folha A4 Simulado */}
        <div className="p-3 sm:p-6 overflow-y-auto flex-1 bg-slate-200/60 dark:bg-slate-950 flex justify-center">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 shadow-lg rounded-sm border border-slate-300 dark:border-slate-800 p-4 sm:p-8 md:p-12 text-slate-900 dark:text-slate-100 space-y-4 sm:space-y-6 text-xs font-serif leading-relaxed">
            {/* Cabeçalho Oficial do Estado da Bahia */}
            <div className="text-center pb-4 border-b-2 border-slate-900 dark:border-slate-100 space-y-1">
              <div className="font-sans font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300">
                GOVERNO DO ESTADO DA BAHIA
              </div>
              <div className="font-sans font-extrabold text-sm uppercase text-slate-900 dark:text-slate-100">
                SECRETARIA DO MEIO AMBIENTE • SEMA
              </div>
              <div className="font-sans font-bold text-xs text-[#0F4C3A] dark:text-emerald-400">
                INSTITUTO DO MEIO AMBIENTE E RECURSOS HÍDRICOS — INEMA
              </div>
            </div>

            {/* Título do Documento */}
            <div className="text-center space-y-1 py-2">
              <div className="font-sans font-bold text-base text-slate-900 dark:text-slate-100">
                {data.titulo}
              </div>
              <div className="font-mono text-xs text-slate-500 font-bold">
                Nº DE CONTROLE: {data.codigoDocumento}
              </div>
            </div>

            {/* Dados do Requerente / Processo */}
            <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-lg border border-slate-200 dark:border-slate-700 space-y-2 font-sans text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-slate-500 font-medium">Interessado / Razão Social:</span>
                  <div className="font-bold text-slate-900 dark:text-slate-100">{data.interessado}</div>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">CPF / CNPJ:</span>
                  <div className="font-mono font-bold text-slate-800 dark:text-slate-200">{data.cpfCnpj}</div>
                </div>
              </div>

              {data.processoSei && (
                <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                  <span className="text-slate-500 font-medium">Processo SEI-BA Vinculado:</span>
                  <div className="font-mono font-bold text-[#0F4C3A] dark:text-emerald-400">
                    {data.processoSei}
                  </div>
                </div>
              )}
            </div>

            {/* Conteúdo Conclusivo */}
            <div className="space-y-3 py-2 text-justify">
              <p>
                O <strong>INSTITUTO DO MEIO AMBIENTE E RECURSOS HÍDRICOS (INEMA)</strong>, no uso de suas atribuições legais conferidas pela Lei Estadual nº 12.212/2011 e pelo Decreto Estadual nº 14.024/2012, <strong>CERTIFICA E DECLARA</strong> a regularidade processual e enquadramento das informações prestadas nos autos eletrônicos.
              </p>
              <p>
                O presente documento foi emitido com base nos registros informatizados do Sistema Estadual de Informações Ambientais e Recursos Hídricos (SEIA V2) e sua autenticidade pode ser confirmada publicamente pelo QR Code ou pelo token de validação institucional.
              </p>
            </div>

            {/* Rodapé de Autenticidade & QR Code */}
            <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between font-sans text-[11px] text-slate-500">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-semibold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Documento Assinado Digitalmente com Certificado ICP-Brasil</span>
                </div>
                <div>Data de Emissão: <strong className="text-slate-700 dark:text-slate-300">{data.dataEmissao}</strong></div>
                {data.validade && <div>Validade: <strong className="text-slate-700 dark:text-slate-300">{data.validade}</strong></div>}
                <div className="font-mono text-[10px]">Chave de Validação: {data.autenticidadeToken || 'BA-2026-9811-A89F-4412'}</div>
              </div>

              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded border border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center text-slate-700 dark:text-slate-300 shrink-0">
                <QrCode className="w-10 h-10" />
                <span className="text-[8px] font-mono mt-0.5">Validar</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PdfPreviewDrawer;
