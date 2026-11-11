import React, { useState, useEffect } from 'react';
import { getStoredDocuments } from '@/data/signatureMock';
import { SignableDocument } from '@/types/signature';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { InputWrapper } from '@/components/filament/InputWrapper';
import { SignedDocumentViewModal } from '@/components/signature/SignedDocumentViewModal';
import {
  Users,
  ShieldCheck,
  Search,
  CheckCircle2,
  AlertCircle,
  XCircle,
  FileText,
  Building2,
  Calendar,
  Info,
  ArrowLeft,
} from 'lucide-react';

export const SignaturePublicValidationPage: React.FC = () => {
  const [searchCode, setSearchCode] = useState('');
  const [searched, setSearched] = useState(false);
  const [matchedDoc, setMatchedDoc] = useState<SignableDocument | null>(null);
  const [viewingDoc, setViewingDoc] = useState<SignableDocument | null>(null);

  // Lê código da query string se existir
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('codigo') || params.get('c') || '';
      if (code) {
        setSearchCode(code);
        handleSearchCode(code);
      }
    }
  }, []);

  const handleSearchCode = (code: string) => {
    const clean = code.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
    const docs = getStoredDocuments();
    const found = docs.find((d) => {
      const docClean = d.codigoVerificador.toUpperCase().replace(/[^A-Z0-9]/g, '');
      return docClean === clean || d.hashSha256.toLowerCase() === code.trim().toLowerCase();
    });

    setMatchedDoc(found || null);
    setSearched(true);
  };

  const docs = getStoredDocuments();

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans pb-16">
      {/* Topbar Pública Institucional */}
      <header className="bg-[#0F4C3A] text-white py-4 px-4 sm:px-12 shadow-md">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <a href="/?rota=a-assinar&escopo=assinatura-eletronica" className="flex items-center"><img src="/logo.svg" alt="INEMA" className="h-9 w-auto object-contain" /></a>
            <div>
              <div className="font-bold text-sm tracking-wide uppercase">
                INEMA — Instituto do Meio Ambiente e Recursos Hídricos
              </div>
              <div className="text-xs text-white/80">
                Portal de Verificação de Autenticidade Documental — SEIA V2
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs text-white/80">
            <a
              href="/?rota=a-assinar&escopo=assinatura-eletronica"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-white font-medium transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Voltar ao Sistema</span>
            </a>
            <span className="hidden sm:inline text-white/40">•</span>
            <span className="hidden sm:inline text-right text-white/70">
              Governo do Estado da Bahia
            </span>
          </div>
        </div>
      </header>

      {/* Conteúdo Central */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 space-y-6">
        {/* Aviso Demonstrativo Discreto */}
        <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 text-amber-800 dark:text-amber-300 text-xs flex items-start gap-2.5 shadow-2xs">
          <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="font-semibold">Ambiente Demonstrativo:</strong> Consulta simulada do protótipo SEIA. Os documentos, assinaturas e códigos verificadores apresentados têm finalidade exclusivamente demonstrativa e não possuem fé pública.
          </div>
        </div>

        {/* Card de Busca */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-8 shadow-sm space-y-4">
          <div className="space-y-1">
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              Consultar Autenticidade de Documento Assinado
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Digite o código verificador constante no rodapé do documento ou cole o identificador de integridade.
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearchCode(searchCode);
            }}
            className="flex flex-col sm:flex-row gap-2.5 pt-2"
          >
            <div className="flex-1">
              <InputWrapper label="Código Verificador (12 caracteres alfanuméricos)" prefixIcon={Search}>
                <input
                  type="text"
                  value={searchCode}
                  onChange={(e) => setSearchCode(e.target.value)}
                  placeholder="Exemplo: 4KZ9-7YTR-2M1B ou 7T9X-4M2K-1Q8P"
                  className="fi-input block w-full border-none bg-transparent py-2 px-3 text-sm font-mono tracking-wider text-slate-900 dark:text-slate-100 placeholder:text-slate-400 placeholder:font-sans placeholder:tracking-normal focus:outline-none"
                />
              </InputWrapper>
            </div>

            <Button
              type="submit"
              className="bg-[#0F4C3A] hover:bg-[#0c3d2e] text-white text-xs h-10 px-5 font-semibold shadow-xs self-stretch sm:self-auto"
            >
              <Search className="w-4 h-4 mr-1.5" />
              <span>Verificar</span>
            </Button>
          </form>

          {/* Exemplos para Teste Rápido em 1-click */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 text-xs">
            <span className="text-slate-500 font-semibold block mb-2">
              Exemplos de Documentos Cadastrados (1-click para preencher):
            </span>
            <div className="flex flex-wrap gap-2">
              {docs.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => {
                    setSearchCode(d.codigoVerificador);
                    handleSearchCode(d.codigoVerificador);
                  }}
                  className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 font-mono text-[11px] text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                >
                  {d.codigoVerificador} ({d.tipoDocumento.split(' ')[0]})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Resultado da Busca */}
        {searched && (
          <div className="animate-in fade-in duration-200">
            {matchedDoc ? (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-8 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-xs uppercase tracking-wider font-bold text-emerald-700 dark:text-emerald-400">
                        Documento Localizado na Base Demonstrativa do Novo SEIA
                      </div>
                      <div className="text-base font-bold text-slate-900 dark:text-slate-100">
                        {matchedDoc.tipoDocumento}
                      </div>
                    </div>
                  </div>

                  <Badge
                    color={
                      matchedDoc.statusGeral === 'concluido'
                        ? 'success'
                        : matchedDoc.statusGeral === 'recusado'
                        ? 'danger'
                        : matchedDoc.statusGeral === 'cancelado'
                        ? 'gray'
                        : 'warning'
                    }
                    dot
                    size="sm"
                  >
                    {matchedDoc.statusGeral === 'concluido'
                      ? 'Demonstração — Assinatura Concluída'
                      : matchedDoc.statusGeral === 'recusado'
                      ? 'Demonstração — Assinatura Recusada'
                      : matchedDoc.statusGeral === 'cancelado'
                      ? 'Demonstração — Solicitação Cancelada'
                      : 'Demonstração — Assinaturas em Andamento'}
                  </Badge>
                </div>

                {/* Metadados */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 bg-slate-50 dark:bg-slate-850 rounded-xl flex flex-col gap-1 border border-slate-100 dark:border-slate-800">
                    <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      <span>Processo Administrativo</span>
                    </span>
                    <span className="font-mono font-bold text-slate-900 dark:text-slate-100 text-sm">
                      {matchedDoc.numeroProcesso}
                    </span>
                  </div>

                  <div className="p-3.5 bg-slate-50 dark:bg-slate-850 rounded-xl flex flex-col gap-1 border border-slate-100 dark:border-slate-800">
                    <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>Data de Criação e Emissão</span>
                    </span>
                    <span className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                      {matchedDoc.dataCriacao}
                    </span>
                  </div>

                  <div className="p-3.5 bg-slate-50 dark:bg-slate-850 rounded-xl flex flex-col gap-1 border border-slate-100 dark:border-slate-800">
                    <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <span>Requerente / Interessado</span>
                    </span>
                    <span className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                      {matchedDoc.requerente}
                    </span>
                  </div>

                  <div className="p-3.5 bg-slate-50 dark:bg-slate-850 rounded-xl flex flex-col gap-1 border border-slate-100 dark:border-slate-800">
                    <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      <span>Município</span>
                    </span>
                    <span className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                      {matchedDoc.municipio}
                    </span>
                  </div>
                </div>

                {/* Signatários */}
                <div className="space-y-3 pt-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                    Signatários Registrados no Ato (Simulação)
                  </div>

                  <div className="space-y-2">
                    {matchedDoc.signatarios.map((s) => (
                      <div
                        key={s.id}
                        className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                      >
                        <div className="space-y-0.5">
                          <div className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                            <span>{s.nome}</span>
                            <span className="text-slate-500 font-normal">({s.cargo})</span>
                          </div>
                          <div className="text-[11px] text-slate-500">
                            Matrícula: <span className="font-mono">{s.matricula}</span> • Vínculo:{' '}
                            {s.tipoVinculo === 'servidor_efetivo' ? 'Servidor Efetivo' : 'Cargo em Comissão'}
                          </div>
                        </div>

                        <div className="text-left sm:text-right flex-shrink-0">
                          {s.status === 'assinado' ? (
                            <div className="space-y-0.5">
                              <Badge color="success" dot size="xs">
                                Assinado em {s.dataAssinatura} {s.horaAssinatura}
                              </Badge>
                              <div className="text-[10px] text-slate-400">Horário Oficial de Brasília</div>
                            </div>
                          ) : s.status === 'recusado' ? (
                            <Badge color="danger" size="xs">
                              Recusa Fundamentada
                            </Badge>
                          ) : s.status === 'cancelado' ? (
                            <Badge color="gray" size="xs">
                              Cancelado com a Solicitação
                            </Badge>
                          ) : (
                            <Badge color="warning" size="xs">
                              Pendente
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Identificador Demonstrativo de Integridade (Hash) */}
                <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl font-mono text-[11px] break-all space-y-1">
                  <span className="font-sans font-bold text-slate-600 dark:text-slate-300 block">
                    Identificador Demonstrativo de Integridade (Hash):
                  </span>
                  <span className="text-slate-800 dark:text-slate-200">{matchedDoc.hashSha256}</span>
                </div>

                <div className="flex justify-end pt-2">
                  <Button
                    size="sm"
                    onClick={() => setViewingDoc(matchedDoc)}
                    className="bg-[#0F4C3A] hover:bg-[#0c3d2e] text-white text-xs h-9 px-4 font-semibold"
                  >
                    <FileText className="w-3.5 h-3.5 mr-1.5" />
                    <span>Visualizar Documento Completo</span>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
                  <XCircle className="w-6 h-6" />
                </div>
                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Nenhum Documento Localizado
                </h2>
                <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                  Não foi encontrado nenhum ato na base demonstrativa com o código verificador informado (
                  <span className="font-mono font-bold text-slate-800">{searchCode}</span>). Verifique se
                  houve erro de digitação ou utilize um dos exemplos demonstrativos acima.
                </p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Modal de Documento */}
      <SignedDocumentViewModal
        open={Boolean(viewingDoc)}
        onOpenChange={(open) => !open && setViewingDoc(null)}
        document={viewingDoc}
      />
    </div>
  );
};
