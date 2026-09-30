import React, { useState } from 'react';
import {
  FileCheck,
  Search,
  Download,
  ShieldCheck,
  QrCode,
  CheckCircle2,
  AlertCircle,
  Building2,
  Printer,
  ArrowRight,
  HelpCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FilamentTabs, FilamentTabItem } from '@/components/filament/Tabs';
import { Section } from '@/components/filament/Section';
import { InputWrapper } from '@/components/filament/InputWrapper';
import { SeiaV2Breadcrumb } from '@/components/seia-v2/SeiaV2Breadcrumb';
import { TableContainer, TableToolbar } from '@/components/filament/Table';
import { PdfPreviewDrawer, PdfDocumentData } from '@/components/seia-v2/PdfPreviewDrawer';

interface CertidaoDebitoPageProps {
  onNavigate?: (route: string) => void;
}

export const CertidaoDebitoPage: React.FC<CertidaoDebitoPageProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState('emissao-rapida');
  const [documentoConsulta, setDocumentoConsulta] = useState('');
  const [isConsulting, setIsConsulting] = useState(false);
  const [certidaoGerada, setCertidaoGerada] = useState<any>(null);
  const [pdfDrawerOpen, setPdfDrawerOpen] = useState(false);
  const [pdfData, setPdfData] = useState<PdfDocumentData | null>(null);

  const tabs: FilamentTabItem[] = [
    { id: 'emissao-rapida', label: 'Emissão Rápida (Cidadão / Empresa)', badge: 'Online', badgeVariant: 'primary' },
    { id: 'pauta-analise', label: 'Pauta Técnica de Certidões', badge: '14', badgeVariant: 'warning' },
    { id: 'validar-autenticidade', label: 'Validar Autenticidade', badge: 'QR Code', badgeVariant: 'gray' },
  ];

  const handleConsultar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!documentoConsulta.trim()) return;

    setIsConsulting(true);
    setTimeout(() => {
      setIsConsulting(false);
      setCertidaoGerada({
        numeroCertidao: 'CND-INEMA-2026-099412',
        requerente: 'Indústria e Comércio de Alimentos Bahia S.A.',
        cnpj: documentoConsulta,
        tipo: 'Certidão Negativa de Débitos e Infrações Ambientais',
        situacao: 'NADA CONSTA',
        codigoAutenticidade: 'A4F9-8812-BC90-1124-E99A',
        dataEmissao: new Date().toLocaleDateString('pt-BR'),
        validade: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR'),
      });
    }, 600);
  };

  return (
    <div className="space-y-6">
      <SeiaV2Breadcrumb
        items={[
          { label: 'Início', route: 'inicio', href: '/?rota=seia-v2&tela=inicio' },
          { label: 'Financeiro', route: 'certidao-debito' },
          { label: 'Certidão de Débito Ambiental (CND)' },
        ]}
        onNavigate={onNavigate}
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Certidão de Débitos e Infrações Ambientais
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Emissão instantânea de certidão negativa (CND) para pessoas físicas, empresas e processos licitatórios.
          </p>
        </div>
      </div>

      <div className="border-b border-slate-200 dark:border-slate-800">
        <FilamentTabs items={tabs} activeTab={activeTab} onChange={setActiveTab} />
      </div>

      {activeTab === 'emissao-rapida' && (
        <div className="space-y-6 max-w-4xl">
          {/* Formulário de Consulta (Template 5) */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs overflow-hidden">
            <div className="px-5 py-3.5 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/20">
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Search className="w-4 h-4 text-[#0F4C3A] dark:text-emerald-400" />
                <span>Consulta de Regularidade Ambiental</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Informe o CPF ou CNPJ para checagem imediata na base de autos de infração e taxas do INEMA.
              </p>
            </div>
            <form onSubmit={handleConsultar} className="p-5">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                <div className="sm:col-span-8">
                  <input
                    type="text"
                    placeholder="Digite o CPF ou CNPJ (ex: 00.000.000/0001-00)"
                    value={documentoConsulta}
                    onChange={(e) => setDocumentoConsulta(e.target.value)}
                    className="w-full px-4 py-2 text-xs font-mono rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-[#0F4C3A]/20 focus:border-[#0F4C3A]"
                    required
                  />
                </div>
                <div className="sm:col-span-4">
                  <Button
                    type="submit"
                    disabled={isConsulting}
                    className="w-full bg-[#0F4C3A] hover:bg-[#0c3d2e] text-white text-xs h-9 font-semibold"
                  >
                    <span>{isConsulting ? 'Consultando...' : 'Emitir Certidão'}</span>
                    <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Button>
                </div>
              </div>
            </form>
          </div>

          {/* Resultado / Documento Oficial da CND */}
          {certidaoGerada && (
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs space-y-0 animate-in fade-in duration-300">
              <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-[#0F4C3A] dark:text-emerald-400 flex items-center justify-center font-bold">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#0F4C3A] dark:text-emerald-400">
                      Estado da Bahia • INEMA
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">
                      {certidaoGerada.tipo}
                    </h3>
                  </div>
                </div>

                <div className="text-left sm:text-right font-mono text-xs">
                  <div className="text-slate-500 dark:text-slate-400 text-[10px]">Número da Certidão:</div>
                  <strong className="text-slate-900 dark:text-slate-100">{certidaoGerada.numeroCertidao}</strong>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="p-3.5 rounded-lg bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-900/40 text-emerald-900 dark:text-emerald-200 flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <div className="text-xs leading-relaxed">
                    <strong>CERTIFICA-SE</strong> que, consultados os registros do Instituto do Meio Ambiente e Recursos Hídricos (INEMA), <strong>NÃO CONSTAM DÉBITOS PENDENTES</strong> ou autos de infração com trânsito em julgado para a pessoa jurídica acima qualificada.
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-0.5">
                    <span className="text-slate-500 dark:text-slate-400 text-[11px]">Razão Social:</span>
                    <p className="font-semibold text-slate-900 dark:text-slate-100">{certidaoGerada.requerente}</p>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-slate-500 dark:text-slate-400 text-[11px]">CNPJ Consultado:</span>
                    <p className="font-mono font-semibold text-slate-900 dark:text-slate-100">{certidaoGerada.cnpj}</p>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-slate-500 dark:text-slate-400 text-[11px]">Data de Emissão:</span>
                    <p className="font-semibold text-slate-900 dark:text-slate-100">{certidaoGerada.dataEmissao}</p>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-slate-500 dark:text-slate-400 text-[11px]">Validade Legal (90 dias):</span>
                    <p className="font-semibold text-emerald-700 dark:text-emerald-400">{certidaoGerada.validade}</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono block">Código de Autenticidade Digital:</span>
                    <p className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5">{certidaoGerada.codigoAutenticidade}</p>
                  </div>
                  <QrCode className="w-8 h-8 text-slate-600 dark:text-slate-400" />
                </div>
              </div>

              <div className="px-6 py-3.5 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/20 flex items-center justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs h-8"
                  onClick={() => {
                    setPdfData({
                      tipo: 'CND',
                      titulo: 'Certidão Negativa de Débitos Ambientais (CND)',
                      codigoDocumento: certidaoGerada.numeroCertidao,
                      interessado: certidaoGerada.requerente,
                      cpfCnpj: certidaoGerada.cnpj,
                      dataEmissao: certidaoGerada.dataEmissao,
                      validade: certidaoGerada.validade,
                      autenticidadeToken: certidaoGerada.codigoAutenticidade,
                      status: 'Válido',
                    });
                    setPdfDrawerOpen(true);
                  }}
                >
                  <Printer className="w-3.5 h-3.5 mr-1.5" />
                  <span>Visualizar / Imprimir PDF</span>
                </Button>
                <Button
                  size="sm"
                  className="bg-[#0F4C3A] hover:bg-[#0c3d2e] text-white text-xs h-8 font-semibold"
                  onClick={() => {
                    setPdfData({
                      tipo: 'CND',
                      titulo: 'Certidão Negativa de Débitos Ambientais (CND)',
                      codigoDocumento: certidaoGerada.numeroCertidao,
                      interessado: certidaoGerada.requerente,
                      cpfCnpj: certidaoGerada.cnpj,
                      dataEmissao: certidaoGerada.dataEmissao,
                      validade: certidaoGerada.validade,
                      autenticidadeToken: certidaoGerada.codigoAutenticidade,
                      status: 'Válido',
                    });
                    setPdfDrawerOpen(true);
                  }}
                >
                  <Download className="w-3.5 h-3.5 mr-1.5" />
                  <span>Baixar Certidão Oficial em PDF</span>
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'pauta-analise' && (
        <TableContainer
          toolbar={
            <TableToolbar
              searchValue=""
              searchPlaceholder="Buscar por protocolo, requerente, CNPJ ou pendência..."
              actions={
                <Button variant="outline" size="sm" className="text-xs h-8 text-slate-600 dark:text-slate-300">
                  <Download className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                  <span>Exportar Pauta</span>
                </Button>
              }
            />
          }
        >
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
                <th className="py-3 px-4">Protocolo CND</th>
                <th className="py-3 px-4">Requerente / CNPJ</th>
                <th className="py-3 px-4">Tipo da Solicitação</th>
                <th className="py-3 px-4">Motivo da Pendência</th>
                <th className="py-3 px-4">Técnico Designado</th>
                <th className="py-3 px-4">Status & SLA</th>
                <th className="py-3 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {[
                {
                  id: 'CND-SOL-2026-00812',
                  requerente: 'Mineração Vale do Ouro Ltda.',
                  cnpj: '08.912.441/0001-20',
                  tipo: 'Certidão Positiva com Efeito de Negativa (CPEN)',
                  pendencia: 'Comprovante de pagamento da parcela 04/24 do parcelamento',
                  tecnico: 'Auditor Carlos Fontes (DIRRE)',
                  status: 'Em Análise de Comprovante',
                  statusColor: 'warning',
                  sla: '2 dias restantes',
                },
                {
                  id: 'CND-SOL-2026-00799',
                  requerente: 'Agropecuária Rio Corrente S.A.',
                  cnpj: '33.109.844/0001-90',
                  tipo: 'Certidão Negativa de Débitos (CND)',
                  pendencia: 'Auto de Infração nº 2025-0912 sob recurso administrativo',
                  tecnico: 'Dra. Luiza Miranda (PROJUR/INEMA)',
                  status: 'Aguardando Parecer Jurídico',
                  statusColor: 'danger',
                  sla: '1 dia restante',
                },
                {
                  id: 'CND-SOL-2026-00754',
                  requerente: 'Energia Solar Nordeste SPE S.A.',
                  cnpj: '44.892.112/0001-14',
                  tipo: 'Certidão Negativa de Débitos (CND)',
                  pendencia: 'Confirmação de baixa de DAE bancário pelo sistema financeiro',
                  tecnico: 'Tesouraria INEMA',
                  status: 'Conciliação Bancária',
                  statusColor: 'info',
                  sla: 'No prazo',
                },
              ].map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                  <td className="py-3.5 px-4 font-mono font-semibold text-slate-900 dark:text-slate-100">
                    {row.id}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-900 dark:text-slate-100">{row.requerente}</div>
                    <div className="text-[11px] font-mono text-slate-500">{row.cnpj}</div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300">{row.tipo}</td>
                  <td className="py-3.5 px-4 max-w-xs text-slate-600 dark:text-slate-400">{row.pendencia}</td>
                  <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300">{row.tecnico}</td>
                  <td className="py-3.5 px-4">
                    <Badge color={row.statusColor as any} dot size="xs">
                      {row.status}
                    </Badge>
                    <div className="text-[10px] text-slate-400 mt-0.5">{row.sla}</div>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Button variant="ghost" size="xs" className="text-[#0F4C3A] dark:text-emerald-400 font-semibold">
                      <span>Analisar</span>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableContainer>
      )}

      {activeTab === 'validar-autenticidade' && (
        <div className="max-w-2xl bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs overflow-hidden">
          <div className="px-5 py-3.5 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/20">
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <QrCode className="w-4 h-4 text-[#0F4C3A] dark:text-emerald-400" />
              <span>Validação de Autenticidade Digital de Certidões</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Insira o código de autenticidade impresso no rodapé da certidão emitida para verificar sua validade jurídica.
            </p>
          </div>
          <div className="p-5 space-y-4">
            <InputWrapper label="Código de Autenticidade Digital *" required>
              <input
                type="text"
                placeholder="Ex: A4F9-8812-BC90-1124-E99A"
                className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              />
            </InputWrapper>
            <Button className="bg-[#0F4C3A] hover:bg-[#0c3d2e] text-white text-xs h-9 font-semibold">
              <ShieldCheck className="w-4 h-4 mr-1.5" />
              <span>Verificar Validade</span>
            </Button>
          </div>
        </div>
      )}

      {/* Drawer / Modal Oficial de Pré-Visualização PDF */}
      <PdfPreviewDrawer
        open={pdfDrawerOpen}
        onOpenChange={setPdfDrawerOpen}
        data={pdfData}
      />
    </div>
  );
};
