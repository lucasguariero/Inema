import React, { useMemo } from 'react';
import { Signer } from '@/types/signature';
import { generateQrMatrix } from '@/components/signature/qrGenerator';
import { ShieldCheck, CheckCircle2, Clock, XCircle, ExternalLink, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface SignatureStampProps {
  signers: Signer[];
  codigoVerificador: string;
  hashSha256?: string;
  className?: string;
  compact?: boolean;
}

/**
 * Componente oficial do Selo de Assinatura Eletrônica SEIA V2
 * Diagramado para inclusão no rodapé de documentos A4 (DocumentPaper)
 * [CAT-A] e [CAT-B] com conformidade anti-AI-slop.
 */
export const SignatureStamp: React.FC<SignatureStampProps> = ({
  signers,
  codigoVerificador,
  hashSha256,
  className = '',
  compact = false,
}) => {
  const signedList = signers.filter((s) => s.status === 'assinado');
  const hasRefused = signers.some((s) => s.status === 'recusado');
  const hasCancelled = signers.some((s) => s.status === 'cancelado');
  const isFullySigned = signers.length > 0 && signedList.length === signers.length;

  // URL dinâmica coerente com o ambiente de execução
  const targetUrl = useMemo(() => {
    if (typeof window !== 'undefined') {
      const origin = window.location.origin;
      return `${origin}/?rota=autenticidade-documento&codigo=${codigoVerificador}`;
    }
    return `https://inema.acto.com.br/?rota=autenticidade-documento&codigo=${codigoVerificador}`;
  }, [codigoVerificador]);

  // Gera matriz real de QR Code para a URL da consulta demonstrativa
  const qrMatrix = useMemo(() => {
    try {
      return generateQrMatrix(targetUrl);
    } catch {
      return null;
    }
  }, [targetUrl]);

  const renderQrCodeSvg = () => {
    if (!qrMatrix || qrMatrix.length === 0) {
      return (
        <div className="w-24 h-24 bg-slate-100 flex items-center justify-center text-[10px] text-slate-400">
          QR Indisponível
        </div>
      );
    }

    const N = qrMatrix.length;

    // Renderiza cada módulo como um elemento <rect> em viewBox proporcional
    return (
      <svg
        className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 signature-qr-code"
        data-qr-code="true"
        data-testid="signature-stamp-qrcode"
        viewBox={`0 0 ${N} ${N}`}
        xmlns="http://www.w3.org/2000/svg"
        aria-label={`QR Code para validação demonstrativa em: ${targetUrl}`}
      >
        {/* Fundo branco */}
        <rect width={N} height={N} fill="white" />

        {/* Módulos do QR Code */}
        {qrMatrix.map((row, r) =>
          row.map((cell, c) => {
            if (!cell) return null;
            // Destaca os finders (cantos) no verde institucional #0F4C3A
            const isTopLeftFinder = r < 7 && c < 7;
            const isTopRightFinder = r < 7 && c >= N - 7;
            const isBottomLeftFinder = r >= N - 7 && c < 7;
            const isFinder = isTopLeftFinder || isTopRightFinder || isBottomLeftFinder;

            return (
              <rect
                key={`${r}-${c}`}
                x={c}
                y={r}
                width={1}
                height={1}
                fill={isFinder ? '#0F4C3A' : '#1e293b'}
              />
            );
          })
        )}
      </svg>
    );
  };

  return (
    <div
      className={`border-t-2 border-dashed border-slate-300 dark:border-slate-700 pt-5 mt-8 ${className}`}
      data-testid="signature-stamp-container"
    >
      <div className="bg-slate-50/90 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl p-3.5 sm:p-4 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-700/60 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#0F4C3A] dark:text-emerald-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
              Selo Demonstrativo de Assinatura Eletrônica — SEIA V2
            </span>
          </div>

          <div className="flex items-center gap-2">
            {isFullySigned ? (
              <Badge color="success" dot size="xs">
                Demonstração — Assinatura Concluída
              </Badge>
            ) : hasRefused ? (
              <Badge color="danger" dot size="xs">
                Demonstração — Assinatura Recusada
              </Badge>
            ) : hasCancelled ? (
              <Badge color="gray" dot size="xs">
                Demonstração — Solicitação Cancelada
              </Badge>
            ) : (
              <Badge color="warning" dot size="xs">
                Demonstração — Assinaturas em Andamento ({signedList.length}/{signers.length})
              </Badge>
            )}
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
          {/* QR Code Real Gerado para a URL e Código de 12 Caracteres */}
          <div className="flex flex-col items-center text-center sm:text-left sm:items-start md:flex-row gap-3.5 flex-shrink-0">
            <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-2xs">
              {renderQrCodeSvg()}
            </div>
            <div className="space-y-1 text-xs">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block uppercase">
                Código Verificador (12 caracteres)
              </span>
              <span className="font-mono text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900 px-2 py-1 rounded border border-slate-200 dark:border-slate-700 tracking-widest inline-block select-all">
                {codigoVerificador}
              </span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 max-w-[220px] leading-tight pt-1">
                Código verificador fictício para validação na consulta demonstrativa.
              </p>
              <div className="pt-0.5">
                <a
                  href={targetUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] text-[#0F4C3A] hover:underline font-semibold dark:text-emerald-400"
                >
                  <span>Verificar autenticidade</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <span className="text-[10px] text-slate-400 block italic">
                  Ambiente demonstrativo de simulação
                </span>
              </div>
            </div>
          </div>

          {/* Lista de Signatários do Documento */}
          <div className="w-full flex-1 border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-700/60 pt-4 md:pt-0 md:pl-6 space-y-3">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
              Signatários Habilitados (Simulação)
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {signers.map((sig) => (
                <div key={sig.id} className={`p-2.5 sm:p-3 rounded-lg border text-xs transition-colors ${
                    sig.status === 'assinado'
                      ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200/80 dark:border-emerald-900/40 text-emerald-950 dark:text-emerald-200'
                      : sig.status === 'recusado'
                      ? 'bg-rose-50/60 dark:bg-rose-950/20 border-rose-200/80 dark:border-rose-900/40 text-rose-950 dark:text-rose-200'
                      : sig.status === 'cancelado'
                      ? 'bg-slate-100/70 dark:bg-slate-800/60 border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-0.5">
                      <div className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                        {sig.status === 'assinado' && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                        )}
                        {sig.status === 'pendente' && (
                          <Clock className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                        )}
                        {sig.status === 'bloqueado_ordem' && (
                          <Clock className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        )}
                        {sig.status === 'recusado' && (
                          <XCircle className="w-3.5 h-3.5 text-rose-600 flex-shrink-0" />
                        )}
                        <span>{sig.nome}</span>
                        {sig.ehSuplente && (
                          <span className="text-[10px] text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-1.5 py-0.2 rounded border border-amber-200 font-normal">
                            Suplente
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        {sig.cargo} • Matrícula <span className="font-mono">{sig.matricula}</span>
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      {sig.status === 'assinado' ? (
                        <div className="space-y-0.5">
                          <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 block">
                            Assinado em {sig.dataAssinatura} às {sig.horaAssinatura}
                          </span>
                          <span className="text-[9px] text-slate-400 font-mono block">
                            (Horário Oficial de Brasília)
                          </span>
                        </div>
                      ) : sig.status === 'recusado' ? (
                        <span className="text-[10px] font-semibold text-rose-700 dark:text-rose-400 block">
                          Recusa Fundamentada
                        </span>
                      ) : sig.status === 'bloqueado_ordem' ? (
                        <span className="text-[10px] text-slate-400 block">
                          Aguardando ordem {sig.ordem - 1}
                        </span>
                      ) : sig.status === 'cancelado' ? (
                        <span className="text-[10px] text-slate-500 font-medium block">
                          Cancelado com a solicitação
                        </span>
                      ) : (
                        <span className="text-[10px] text-amber-600 font-medium block">
                          Pendente de assinatura
                        </span>
                      )}
                    </div>
                  </div>

                  {sig.justificativaRecusa && (
                    <div className="mt-2 pt-2 border-t border-rose-200/60 dark:border-rose-900/40 text-[11px] text-rose-800 dark:text-rose-300 italic">
                      "Motivo da recusa: {sig.justificativaRecusa}"
                    </div>
                  )}
                </div>
              ))}
            </div>

            {hashSha256 && (
              <div className="pt-2 text-[10px] text-slate-400 font-mono break-all leading-tight">
                <span className="font-sans font-semibold text-slate-500">
                  Identificador Demonstrativo de Integridade (Hash):{' '}
                </span>
                {hashSha256}
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700/60 text-[10px] text-slate-500 dark:text-slate-400 text-center sm:text-left leading-relaxed flex items-start gap-1.5">
          <Info className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
          <span>
            Documento em ambiente demonstrativo do SEIA V2 (Bahia). As assinaturas e códigos acima são simulados
            para validação funcional com Thays e Matheus, sem validade de certificação digital de produção.
          </span>
        </div>
      </div>
    </div>
  );
};
