import React, { useState } from 'react';
import {
  Layers,
  FileCheck2,
  Lock,
  Unlock,
  Users,
  Search,
  Filter,
  Download,
  Eye,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText,
  UserCheck,
  Building2,
  ArrowRight,
  ShieldCheck,
  Send,
  X,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FilamentTabs, TabItem } from '@/components/filament/Tabs';
import { Section } from '@/components/filament/Section';
import { InputWrapper } from '@/components/filament/InputWrapper';
import { TableContainer, TableToolbar } from '@/components/filament/Table';
import { KpiCard } from '@/components/dashboard/KpiCard';
import { SeiaV2Breadcrumb } from '@/components/seia-v2/SeiaV2Breadcrumb';

import { PdfPreviewDrawer, PdfDocumentData } from '@/components/seia-v2/PdfPreviewDrawer';

interface PautaEnquadramentoPageProps {
  onNavigate?: (route: string) => void;
}

export const PautaEnquadramentoPage: React.FC<PautaEnquadramentoPageProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProcesso, setSelectedProcesso] = useState<any>(null);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [pdfPreviewData, setPdfPreviewData] = useState<PdfDocumentData | null>(null);
  const [isPdfDrawerOpen, setIsPdfDrawerOpen] = useState(false);

  const handleOpenParecerPdf = (proc: any) => {
    setPdfPreviewData({
      tipo: 'PARECER_ENQUADRAMENTO',
      titulo: 'PARECER TÉCNICO DE ENQUADRAMENTO AMBIENTAL (F-DIPRE-ENQ-01)',
      codigoDocumento: `ENQ-${proc.id || '2026-09124'}`,
      interessado: proc.requerente || 'Agropecuária Vale Verde S.A.',
      cpfCnpj: proc.cnpj || '04.892.112/0001-90',
      processoSei: `088.0001.2026.${proc.id?.replace(/\D/g, '') || '09124'}-1`,
      dataEmissao: '30/09/2026',
      validade: '12 meses para protocolo dos estudos',
      autenticidadeToken: 'DIPRE-BA-2026-ENQ-9811',
      status: 'Aprovado',
    });
    setIsPdfDrawerOpen(true);
  };

  const tabs: TabItem[] = [
    { id: 'todos', label: 'Pauta da Área', badge: '27', badgeColor: 'primary' },
    { id: 'aguardando', label: 'Aguardando Distribuição', badge: '12', badgeColor: 'warning' },
    { id: 'em-analise', label: 'Em Análise Técnica', badge: '8', badgeColor: 'primary' },
    { id: 'desbloqueios', label: 'Desbloqueios APE', badge: '3', badgeColor: 'danger' },
    { id: 'validar-perfis', label: 'Validação de Perfis', badge: '7', badgeColor: 'default' },
  ];

  const processosMock = [
    {
      id: 'REQ-2026-09124',
      dataAbertura: '26/09/2026',
      requerente: 'Agropecuária Vale Verde S.A.',
      cnpj: '04.892.112/0001-90',
      empreendimento: 'Complexo Agroindustrial Barreiras - Gleba A',
      municipio: 'Barreiras / BA',
      atosPropostos: 'Licença de Instalação (LI) + Outorga Subterrânea CERH',
      tecnicoResponsavel: 'Eng. Caick Vinicius (DISUC)',
      situacao: 'Aguardando Parecer',
      statusColor: 'warning',
      sla: 'SLA: 3 dias restantes'
    },
    {
      id: 'REQ-2026-09088',
      dataAbertura: '24/09/2026',
      requerente: 'Petroquímica Camaçari S.A.',
      cnpj: '14.209.841/0001-30',
      empreendimento: 'Terminal de Hidrocarbonetos do Polo',
      municipio: 'Camaçari / BA',
      atosPropostos: 'Renovação de Licença de Operação (RLO) + DTRP',
      tecnicoResponsavel: 'Bióloga Fernanda Souza (DIPRE)',
      situacao: 'Em Validação de Atos',
      statusColor: 'info',
      sla: 'SLA: 1 dia restante'
    },
    {
      id: 'REQ-2026-08994',
      dataAbertura: '19/09/2026',
      requerente: 'Complexo Eólico do São Francisco',
      cnpj: '33.910.221/0001-05',
      empreendimento: 'Parque Eólico Serra do Assuruá IV',
      municipio: 'Gentio do Ouro / BA',
      atosPropostos: 'Autorização de Supressão Vegetal (ASV) + CRF',
      tecnicoResponsavel: 'Eng. Florestal Bruno Carvalho',
      situacao: 'Enquadramento Deferido',
      statusColor: 'success',
      sla: 'Concluído no Prazo'
    }
  ];

  const desbloqueiosMock = [
    {
      protocolo: 'DESB-2026-0041',
      processoOrigem: 'SEI-BA-019.4421.2025/APE',
      requerente: 'Mineração Serra do Ouro Ltda.',
      empreendimento: 'Mina Morro Alto (Jacobina / BA)',
      motivoBloqueio: 'Inadimplência de Condicionante nº 4 (Relatório Semestral)',
      dataEnvio: '28/09/2026',
      situacao: 'Aguardando Análise do Gestor',
      statusColor: 'warning'
    },
    {
      protocolo: 'DESB-2026-0038',
      processoOrigem: 'SEI-BA-011.8902.2024/APE',
      requerente: 'Cerâmica São José de Juazeiro',
      empreendimento: 'Forno e Jazida Juazeiro',
      motivoBloqueio: 'Divergência de Coordenadas SIRGAS 2000 na APE',
      dataEnvio: '20/09/2026',
      situacao: 'Desbloqueio Autorizado',
      statusColor: 'success'
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Breadcrumb */}
      <SeiaV2Breadcrumb
        items={[
          { label: 'Início', route: 'inicio', href: '/?rota=seia-v2&tela=inicio' },
          { label: 'Enquadramento', route: 'enquadramento' },
          { label: 'Pauta da Área & Triagem' },
        ]}
        onNavigate={onNavigate}
      />

      {/* Header da Página */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Pauta da Área — Enquadramento & Triagem de Atos
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Distribuição técnica, validação de tipologias ambientais, parecer oficial F-DIPRE-ENQ-01 e desbloqueios da APE.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button variant="outline" size="sm" className="text-xs h-9">
            <Download className="w-3.5 h-3.5 mr-1.5" />
            <span>Exportar Pauta</span>
          </Button>
          <Button
            onClick={() => setActiveModal('distribuir-lote')}
            className="bg-[#0F4C3A] hover:bg-[#0c3d2e] text-white text-xs h-9 font-semibold shadow-xs"
          >
            <Users className="w-4 h-4 mr-1.5" />
            <span>Distribuir Processos em Lote</span>
          </Button>
        </div>
      </div>

      {/* KPIs de Enquadramento */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Aguardando Triagem"
          value="12 Requerimentos"
          trend="SLA Médio: 2.8 dias"
          trendType="neutral"
          icon={Clock}
          chartData={[15, 14, 13, 12, 11, 12, 12]}
        />
        <KpiCard
          title="Em Análise Técnica"
          value="08 Processos"
          trend="4 Analistas Ativos"
          trendType="up"
          icon={FileCheck2}
          chartData={[5, 6, 7, 7, 8, 8, 8]}
        />
        <KpiCard
          title="Atos Enquadrados no Mês"
          value="142 Atos"
          trend="+18% vs mês anterior"
          trendType="up"
          icon={Layers}
          chartData={[90, 100, 115, 125, 130, 138, 142]}
        />
        <KpiCard
          title="Solicitações de Desbloqueio"
          value="03 Pendentes"
          trend="Prazo Máximo: 48h"
          trendType="down"
          icon={Unlock}
          chartData={[6, 5, 4, 3, 3, 3, 3]}
        />
      </div>

      {/* Abas de Navegação */}
      <div className="border-b border-slate-200 dark:border-slate-800">
        <FilamentTabs
          tabs={tabs}
          activeTab={activeTab}
          onChange={setActiveTab}
        />
      </div>

      {/* TAB 1: PAUTA DE ENQUADRAMENTO */}
      {activeTab !== 'desbloqueios' && (
        <TableContainer
          toolbar={
            <TableToolbar
              searchValue={searchTerm}
              onSearchChange={setSearchTerm}
              searchPlaceholder="Buscar por requerimento, interessado, CPF/CNPJ ou ato..."
              actions={
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveModal('distribuir-lote')}
                  className="text-xs h-8"
                >
                  <Users className="w-3.5 h-3.5 mr-1 text-[#0F4C3A]" />
                  <span>Distribuir em Lote</span>
                </Button>
              }
            />
          }
        >
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
                <th className="py-3 px-4">Nº Requerimento</th>
                <th className="py-3 px-4">Requerente / CPF-CNPJ</th>
                <th className="py-3 px-4">Empreendimento & Local</th>
                <th className="py-3 px-4">Atos Pré-Enquadrados</th>
                <th className="py-3 px-4">Técnico & Situação</th>
                <th className="py-3 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {processosMock
                .filter(
                  (proc) =>
                    !searchTerm ||
                    proc.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    proc.requerente.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    proc.cnpj.includes(searchTerm) ||
                    proc.atosPropostos.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((proc) => (
                  <tr key={proc.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-slate-100">
                      {proc.id}
                      <div className="text-[10px] text-slate-400 font-normal mt-0.5">{proc.dataAbertura}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900 dark:text-slate-100">{proc.requerente}</div>
                      <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400">{proc.cnpj}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-slate-800 dark:text-slate-200 font-medium">{proc.empreendimento}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">{proc.municipio}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300">
                      <span className="font-medium text-[#0F4C3A] dark:text-emerald-400">{proc.atosPropostos}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-800 dark:text-slate-200">{proc.tecnicoResponsavel}</div>
                      <Badge color={proc.statusColor as any} dot size="xs" className="mt-1">
                        {proc.situacao}
                      </Badge>
                      <div className="text-[10px] font-mono text-slate-400 mt-0.5">{proc.sla}</div>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Button
                        variant="ghost"
                        size="xs"
                        onClick={() => {
                          setSelectedProcesso(proc);
                          setActiveModal('parecer-enquadramento');
                        }}
                        className="text-[#0F4C3A] dark:text-emerald-400 font-semibold"
                      >
                        <FileCheck2 className="w-3.5 h-3.5 mr-1" />
                        <span>Enquadrar</span>
                      </Button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </TableContainer>
      )}

      {/* TAB 2: DESBLOQUEIOS DA APE */}
      {activeTab === 'desbloqueios' && (
        <TableContainer
          toolbar={
            <TableToolbar
              searchValue={searchTerm}
              onSearchChange={setSearchTerm}
              searchPlaceholder="Buscar por protocolo, processo SEI ou requerente..."
            />
          }
        >
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
                <th className="py-3 px-4">Nº Protocolo Desbloqueio</th>
                <th className="py-3 px-4">Processo de Origem (SEI)</th>
                <th className="py-3 px-4">Requerente & Empreendimento</th>
                <th className="py-3 px-4">Motivo do Bloqueio</th>
                <th className="py-3 px-4">Situação</th>
                <th className="py-3 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {desbloqueiosMock
                .filter(
                  (desb) =>
                    !searchTerm ||
                    desb.protocolo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    desb.processoOrigem.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    desb.requerente.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((desb) => (
                  <tr key={desb.protocolo} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-slate-100">
                      {desb.protocolo}
                      <div className="text-[10px] text-slate-400 font-normal mt-0.5">Enviado: {desb.dataEnvio}</div>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-medium text-slate-800 dark:text-slate-200">
                      {desb.processoOrigem}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900 dark:text-slate-100">{desb.requerente}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">{desb.empreendimento}</div>
                    </td>
                    <td className="py-3.5 px-4 text-rose-700 dark:text-rose-400 font-medium">
                      {desb.motivoBloqueio}
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge color={desb.statusColor as any} dot size="xs">
                        {desb.situacao}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Button variant="ghost" size="xs" className="text-[#0F4C3A] dark:text-emerald-400">
                        <Unlock className="w-3.5 h-3.5 mr-1" />
                        <span>Analisar Desbloqueio</span>
                      </Button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </TableContainer>
      )}

      {/* MODAL 1: DISTRIBUIR EM LOTE */}
      {activeModal === 'distribuir-lote' && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-start border-b pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold text-[#0F4C3A] uppercase">DISUC / DIPRE</span>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-0.5">Distribuir Processos para Analista</h3>
              </div>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <InputWrapper label="Selecione o Analista Técnico Responsável" required>
                <select className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                  <option>Eng. Caick Vinicius — 4 processos em andamento (Carga: Baixa)</option>
                  <option>Bióloga Fernanda Souza — 8 processos em andamento (Carga: Média)</option>
                  <option>Eng. Florestal Bruno Carvalho — 6 processos em andamento (Carga: Média)</option>
                </select>
              </InputWrapper>

              <InputWrapper label="Prazo Interno de Enquadramento" required>
                <select className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                  <option>SLA Padrão — 5 dias úteis</option>
                  <option>Prioritário / Decisão Judicial — 48 horas</option>
                  <option>Projeto Estruturante do Estado — 72 horas</option>
                </select>
              </InputWrapper>

              <InputWrapper label="Despacho / Instruções Técnicas">
                <textarea rows={3} placeholder="Instruções específicas para o analista sobre tipologias ou estudos..." className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800" />
              </InputWrapper>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t">
              <Button variant="outline" size="sm" onClick={() => setActiveModal(null)}>Cancelar</Button>
              <Button size="sm" onClick={() => setActiveModal(null)} className="bg-[#0F4C3A] text-white">Confirmar Distribuição</Button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: PARECER DE ENQUADRAMENTO */}
      {activeModal === 'parecer-enquadramento' && selectedProcesso && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-start border-b pb-3">
              <div>
                <span className="font-mono text-xs font-bold text-slate-500">F-DIPRE-ENQ-01</span>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Parecer Técnico de Enquadramento</h3>
              </div>
              <Badge variant="warning">Em Elaboração</Badge>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border">
                <span className="font-bold text-slate-900 dark:text-slate-100">{selectedProcesso.id} — {selectedProcesso.requerente}</span>
                <p className="text-slate-500 mt-0.5">{selectedProcesso.empreendimento} ({selectedProcesso.municipio})</p>
              </div>

              <Section title="Definição Oficial dos Atos Ambientais Exigidos" compact>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded text-[#0F4C3A]" />
                    <span>Licença de Instalação (LI) — Resolução CEPRAM nº 4.570/2017</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded text-[#0F4C3A]" />
                    <span>Outorga de Direito de Uso da Água (CERH) — Captação Subterrânea</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded text-[#0F4C3A]" />
                    <span>Autorização de Supressão Vegetal (ASV) + Reposição Florestal</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded text-[#0F4C3A]" />
                    <span>Declaração de Transporte de Resíduos Perigosos (DTRP)</span>
                  </label>
                </div>
              </Section>

              <InputWrapper label="Conclusão e Justificativa do Parecer" required>
                <textarea defaultValue="Empreendimento devidamente enquadrado com base nas diretrizes da Portaria INEMA nº 25.753/2022. Estudos ambientais (RCA/PCA) deverão ser protocolados no prazo legal." rows={3} className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800" />
              </InputWrapper>
            </div>

            <div className="flex items-center justify-between pt-3 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleOpenParecerPdf(selectedProcesso)}
                className="text-xs text-slate-700 dark:text-slate-300"
              >
                <FileText className="w-3.5 h-3.5 mr-1.5 text-[#0F4C3A]" />
                Visualizar Parecer Timbrado (PDF)
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setActiveModal(null)}>Salvar Minuta</Button>
                <Button size="sm" onClick={() => setActiveModal(null)} className="bg-[#0F4C3A] text-white">Emitir e Notificar Requerente</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Drawer de Visualização de PDF Timbrado */}
      <PdfPreviewDrawer
        open={isPdfDrawerOpen}
        onOpenChange={setIsPdfDrawerOpen}
        data={pdfPreviewData}
      />
    </div>
  );
};
