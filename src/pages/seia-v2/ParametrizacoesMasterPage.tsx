import React, { useState } from 'react';
import {
  Settings,
  Plus,
  Search,
  Filter,
  Layers,
  FileText,
  Sliders,
  Building2,
  Globe2,
  Scale,
  ShieldCheck,
  AlertTriangle,
  Coins,
  FileSpreadsheet,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  Edit2,
  Trash2,
  Download,
  Info,
  ChevronRight,
  FolderTree,
  ArrowRight,
  BookOpen,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FilamentTabs, FilamentTabItem } from '@/components/filament/Tabs';
import { Section } from '@/components/filament/Section';
import { InputWrapper } from '@/components/filament/InputWrapper';
import { FilamentSelect } from '@/components/filament/Select';
import { TableContainer, TableToolbar } from '@/components/filament/Table';
import { KpiCard } from '@/components/dashboard/KpiCard';
import { SeiaV2Breadcrumb } from '@/components/seia-v2/SeiaV2Breadcrumb';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

interface ParametrizacoesMasterPageProps {
  onNavigate?: (route: string) => void;
}

export const ParametrizacoesMasterPage: React.FC<ParametrizacoesMasterPageProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState('tipologias');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [viewItemModal, setViewItemModal] = useState<any>(null);

  const tabs: FilamentTabItem[] = [
    { id: 'tipologias', label: 'Tipologias & Divisões', badge: '148', badgeVariant: 'primary' },
    { id: 'residuos', label: 'Resíduos & Classes IBAMA', badge: '820', badgeVariant: 'gray' },
    { id: 'produtos-perigosos', label: 'Produtos Perigosos (ONU)', badge: '412', badgeVariant: 'gray' },
    { id: 'setores', label: 'Setores & Organograma', badge: '28', badgeVariant: 'gray' },
    { id: 'orgaos-intervenientes', label: 'Órgãos Intervenientes', badge: '14', badgeVariant: 'gray' },
    { id: 'legislacoes', label: 'Legislações & Portarias', badge: '64', badgeVariant: 'gray' },
    { id: 'tipos-documentos', label: 'Tipos de Documento', badge: '52', badgeVariant: 'gray' },
    { id: 'informativos', label: 'Informativos de Tela', badge: '19', badgeVariant: 'gray' },
    { id: 'financeiro-juros', label: 'Juros & Índices DAE', badge: 'Vigente', badgeVariant: 'sage' },
    { id: 'confissao-divida', label: 'Minutas de Confissão', badge: 'Ativo', badgeVariant: 'sage' },
  ];

  // Tipologias mock data
  const tipologiasMock = [
    {
      id: 'TIP-IND-001',
      divisao: 'Divisão I — Indústria e Transformação',
      codigo: 'IND.01.04',
      nome: 'Fabricação de Produtos Químicos e Fertilizantes Nitrogenados',
      potencialPoluidor: 'Alto',
      porte: 'Médio / Grande / Excepcional',
      estudoExigido: 'EIA / RIMA ou RCA / PCA',
      status: 'Ativo',
    },
    {
      id: 'TIP-AGRO-002',
      divisao: 'Divisão II — Agropecuária e Silvicultura',
      codigo: 'AGR.03.11',
      nome: 'Cultura Irrigada em Pivô Central acima de 200 hectares',
      potencialPoluidor: 'Médio',
      porte: 'Grande',
      estudoExigido: 'PCA com Balanço Hídrico Integrado',
      status: 'Ativo',
    },
    {
      id: 'TIP-MIN-003',
      divisao: 'Divisão III — Mineração e Extração',
      codigo: 'MIN.02.01',
      nome: 'Lavra de Rochas Ornamentais, Granito e Mármore a Céu Aberto',
      potencialPoluidor: 'Alto',
      porte: 'Médio / Grande',
      estudoExigido: 'PRAD + PCA + Licença Prévia e Instalação (LP/LI)',
      status: 'Ativo',
    },
    {
      id: 'TIP-INFRA-004',
      divisao: 'Divisão IV — Infraestrutura e Energia',
      codigo: 'INF.05.02',
      nome: 'Parques Eólicos e Linhas de Transmissão de Alta Tensão (>= 230kV)',
      potencialPoluidor: 'Médio',
      porte: 'Excepcional',
      estudoExigido: 'EIA / RIMA e Anuência DISUC / IPHAN',
      status: 'Ativo',
    },
    {
      id: 'TIP-HIDRO-005',
      divisao: 'Divisão V — Recursos Hídricos e Saneamento',
      codigo: 'SAN.01.08',
      nome: 'Estação de Tratamento de Esgoto Sanitário (ETE) Urbana',
      potencialPoluidor: 'Médio',
      porte: 'Médio / Grande',
      estudoExigido: 'Outorga de Lançamento de Efluentes CERH + PCA',
      status: 'Ativo',
    },
  ];

  // Residuos mock data
  const residuosMock = [
    {
      codigoIbama: '13 02 05*',
      nome: 'Óleos de motor, de engrenagens e de lubrificação minerais não clorados',
      classificacao: 'Classe I — Perigoso',
      estadoFisico: 'Líquido / Oleoso',
      destinacaoPadrao: 'Rerrefino Obrigatório / Coprocessamento',
      origem: 'Oficinas, Indústrias, Usinas e Máquinas Pesadas',
      status: 'Ativo',
    },
    {
      codigoIbama: '16 01 03',
      nome: 'Pneus e artefatos de borracha inservíveis fora de uso',
      classificacao: 'Classe II-B — Inerte',
      estadoFisico: 'Sólido',
      destinacaoPadrao: 'Trituração e Co-processamento em Cimenteiras',
      origem: 'Logística Reversa / Frotas Automotivas',
      status: 'Ativo',
    },
    {
      codigoIbama: '18 01 03*',
      nome: 'Resíduos de serviços de saúde com risco biológico e agentes infecciosos',
      classificacao: 'Classe I — Perigoso',
      estadoFisico: 'Sólido / Embalado',
      destinacaoPadrao: 'Incineração / Autoclavagem Especializada',
      origem: 'Hospitais, Clínicas e Centros de Triagem (CRAS)',
      status: 'Ativo',
    },
    {
      codigoIbama: '17 01 01',
      nome: 'Betão / Concreto de construção civil e demolição sem contaminantes',
      classificacao: 'Classe II-B — Inerte',
      estadoFisico: 'Sólido Fragmentado',
      destinacaoPadrao: 'Britagem para Pavimentação e Sub-base',
      origem: 'Obras de Infraestrutura Rodoviária e Urbana',
      status: 'Ativo',
    },
  ];

  // Produtos Perigosos mock data
  const produtosPerigososMock = [
    {
      numeroOnu: 'ONU 1202',
      nomeApropriado: 'ÓLEO DIESEL ou GASÓLEO ou COMBUSTÍVEL PARA MOTORES DIESEL',
      classeRisco: 'Classe 3 — Líquidos Inflamáveis',
      numeroRisco: '30',
      guiaEmergencia: 'Ficha de Emergência NBR 7503 / Guia 128',
      exigeDtrp: 'Sim (Obrigatório)',
      status: 'Ativo',
    },
    {
      numeroOnu: 'ONU 1830',
      nomeApropriado: 'ÁCIDO SULFÚRICO contendo mais de 51% de ácido puro',
      classeRisco: 'Classe 8 — Substâncias Corrosivas',
      numeroRisco: '80',
      guiaEmergencia: 'Ficha de Emergência NBR 7503 / Guia 137',
      exigeDtrp: 'Sim (Obrigatório)',
      status: 'Ativo',
    },
    {
      numeroOnu: 'ONU 1075',
      nomeApropriado: 'GASES DE PETRÓLEO LIQUEFEITOS (GLP comercial)',
      classeRisco: 'Classe 2.1 — Gases Inflamáveis',
      numeroRisco: '23',
      guiaEmergencia: 'Ficha de Emergência NBR 7503 / Guia 115',
      exigeDtrp: 'Sim (Obrigatório)',
      status: 'Ativo',
    },
  ];

  // Setores mock data
  const setoresMock = [
    {
      sigla: 'DISUC',
      nome: 'Diretoria de Sustentabilidade e Unidades de Conservação',
      titular: 'Dra. Maria Cristina Santos',
      email: 'disuc.inema@inema.ba.gov.br',
      setorSuperior: 'Gabinete da Diretoria Geral (DG)',
      competencia: 'Autorização em UCs, Parques Estaduais, APA, AAD, AAV e Pesquisa',
      status: 'Ativo',
    },
    {
      sigla: 'DIFIS',
      nome: 'Diretoria de Fiscalização e Monitoramento Ambiental',
      titular: 'Cap. Roberto Oliveira Silva',
      email: 'difis.inema@inema.ba.gov.br',
      setorSuperior: 'Gabinete da Diretoria Geral (DG)',
      competencia: 'Autos de Infração, Apreensões, DTRP, Plantão de Emergências e CRAS',
      status: 'Ativo',
    },
    {
      sigla: 'DIPRE',
      nome: 'Diretoria de Regulação e Licenciamento Ambiental',
      titular: 'Dr. Leonardo Cavalcanti Neto',
      email: 'dipre.inema@inema.ba.gov.br',
      setorSuperior: 'Gabinete da Diretoria Geral (DG)',
      competencia: 'Licenciamento Ordinário (LP/LI/LO), ANSLA, CERH e Enquadramentos',
      status: 'Ativo',
    },
    {
      sigla: 'COASP',
      nome: 'Coordenação de Atendimento, Protocolo e Serviços',
      titular: 'Thays Carvalho Miranda',
      email: 'coasp.inema@inema.ba.gov.br',
      setorSuperior: 'Diretoria de Regulação (DIPRE)',
      competencia: 'Triagem de Requerimentos, CND, DAEs e Suporte aos Técnicos',
      status: 'Ativo',
    },
  ];

  // Órgãos Intervenientes mock data
  const orgaosMock = [
    {
      sigla: 'IPHAN',
      nome: 'Instituto do Patrimônio Histórico e Artístico Nacional',
      tipoManifestacao: 'Anuência Prévia e Arqueologia',
      prazoDias: '30 dias úteis',
      convenio: 'Termo de Cooperação Técnica SEI nº 009/2023',
      status: 'Ativo',
    },
    {
      sigla: 'FUNAI',
      nome: 'Fundação Nacional dos Povos Indígenas',
      tipoManifestacao: 'Parecer Consultivo / Raio 10km Terra Indígena',
      prazoDias: '45 dias úteis',
      convenio: 'Protocolo Integrado Nacional',
      status: 'Ativo',
    },
    {
      sigla: 'ICMBio',
      nome: 'Instituto Chico Mendes de Conservação da Biodiversidade',
      tipoManifestacao: 'Autorização para Intervenção em UC Federal',
      prazoDias: '60 dias úteis',
      convenio: 'Acordo de Gestão Compartilhada SNUC',
      status: 'Ativo',
    },
    {
      sigla: 'CERB',
      nome: 'Companhia de Engenharia Hídrica e de Saneamento da Bahia',
      tipoManifestacao: 'Intervenção e Captação Subterrânea / Poços',
      prazoDias: '20 dias úteis',
      convenio: 'Portaria Conjunta INEMA/CERB 004/2021',
      status: 'Ativo',
    },
  ];

  return (
    <div className="space-y-6">
      <SeiaV2Breadcrumb
        items={[
          { label: 'Início', route: 'inicio' },
          { label: 'Configuração do Sistema' },
          { label: 'Parametrizações & Tabelas Mestres' },
        ]}
        onNavigate={onNavigate}
      />

      {/* Header institucional */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Parametrizações & Tabelas Mestres do Sistema
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Gestão normativa das tipologias de licenciamento, catálogo de resíduos e produtos perigosos, setores e parâmetros financeiros.
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <Button
            onClick={() => setCreateModalOpen(true)}
            className="bg-[#0F4C3A] hover:bg-[#0c3d2e] text-white text-xs h-9 font-semibold shadow-2xs w-full sm:w-auto"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            <span>+ Novo Registro Parametrizado</span>
          </Button>
        </div>
      </div>

      {/* KPIs de Parametrização */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Tipologias Ativas"
          value="148"
          trend="5 grandes divisões"
          trendType="neutral"
          icon={FolderTree}
          chartData={[130, 135, 140, 142, 145, 148, 148]}
        />
        <KpiCard
          title="Resíduos & Produtos"
          value="1.232 itens"
          trend="Tabela IBAMA e ONU"
          trendType="up"
          icon={AlertTriangle}
          chartData={[1100, 1150, 1180, 1200, 1220, 1230, 1232]}
        />
        <KpiCard
          title="Órgãos Intervenientes"
          value="14 órgãos"
          trend="Convênios integrados SEI"
          trendType="neutral"
          icon={Building2}
          chartData={[10, 11, 12, 12, 13, 14, 14]}
        />
        <KpiCard
          title="Taxa Selic & Multa DAE"
          value="1.00% a.m."
          trend="Multa 2% + Correção IPCA"
          trendType="neutral"
          icon={Coins}
          chartData={[1, 1, 1, 1, 1, 1, 1]}
        />
      </div>

      {/* Abas Superiores de Parametrizações */}
      <div className="border-b border-slate-200 dark:border-slate-800">
        <FilamentTabs items={tabs} activeTab={activeTab} onChange={setActiveTab} />
      </div>

      {/* Conteúdo Dinâmico por Aba */}
      {activeTab === 'tipologias' && (
        <TableContainer
          toolbar={
            <TableToolbar
              searchValue={searchQuery}
              onSearchChange={setSearchQuery}
              searchPlaceholder="Buscar por código, divisão, tipologia ou estudo..."
              actions={
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setFilterModalOpen(true)}
                    className="text-xs h-8 text-slate-600 dark:text-slate-300"
                  >
                    <Filter className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                    Filtros Avançados
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs h-8 text-slate-600 dark:text-slate-300">
                    <Download className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                    Exportar Tabela (CSV)
                  </Button>
                </div>
              }
            />
          }
        >
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
                <th className="py-3 px-4">Código & Divisão</th>
                <th className="py-3 px-4">Descrição da Atividade / Tipologia</th>
                <th className="py-3 px-4">Potencial Poluidor</th>
                <th className="py-3 px-4">Porte Enquadrado</th>
                <th className="py-3 px-4">Estudo Ambiental Base</th>
                <th className="py-3 px-4">Situação</th>
                <th className="py-3 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {tipologiasMock
                .filter(
                  (row) =>
                    !searchQuery ||
                    row.codigo.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    row.divisao.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    row.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    row.estudoExigido.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-mono font-bold text-slate-900 dark:text-slate-100">{row.codigo}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">{row.divisao}</div>
                    </td>
                    <td className="py-3 px-4 max-w-xs">
                      <div className="font-medium text-slate-800 dark:text-slate-200">{row.nome}</div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        color={row.potencialPoluidor === 'Alto' ? 'danger' : 'warning'}
                        dot
                        size="xs"
                      >
                        {row.potencialPoluidor}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300">{row.porte}</td>
                    <td className="py-3 px-4">
                      <span className="text-[11px] font-mono text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                        {row.estudoExigido}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <Badge color="success" dot size="xs">
                        {row.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="xs"
                          onClick={() => setViewItemModal(row)}
                          className="h-7 w-7 p-0 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="xs"
                          className="h-7 w-7 p-0 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </TableContainer>
      )}

      {activeTab === 'residuos' && (
        <TableContainer
          toolbar={
            <TableToolbar
              searchValue={searchQuery}
              onSearchChange={setSearchQuery}
              searchPlaceholder="Buscar por código IBAMA, descrição ou classificação..."
              actions={
                <Button variant="outline" size="sm" className="text-xs h-8 text-slate-600 dark:text-slate-300">
                  <Download className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                  Exportar Tabela (CSV)
                </Button>
              }
            />
          }
        >
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
                <th className="py-3 px-4">Código IBAMA</th>
                <th className="py-3 px-4">Descrição do Resíduo</th>
                <th className="py-3 px-4">Classificação NBR 10004</th>
                <th className="py-3 px-4">Estado Físico</th>
                <th className="py-3 px-4">Destinação Padrão</th>
                <th className="py-3 px-4">Situação</th>
                <th className="py-3 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {residuosMock
                .filter(
                  (row) =>
                    !searchQuery ||
                    row.codigoIbama.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    row.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    row.classificacao.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    row.origem.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((row) => (
                  <tr key={row.codigoIbama} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-slate-100">
                      {row.codigoIbama}
                    </td>
                    <td className="py-3 px-4 max-w-sm">
                      <div className="font-medium text-slate-800 dark:text-slate-200">{row.nome}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">{row.origem}</div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        color={row.classificacao.includes('Classe I') ? 'danger' : 'gray'}
                        dot
                        size="xs"
                      >
                        {row.classificacao}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300">{row.estadoFisico}</td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300">{row.destinacaoPadrao}</td>
                    <td className="py-3 px-4">
                      <Badge color="success" dot size="xs">
                        {row.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="xs"
                          onClick={() => setViewItemModal(row)}
                          className="h-7 w-7 p-0 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="xs"
                          className="h-7 w-7 p-0 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </TableContainer>
      )}

      {activeTab === 'produtos-perigosos' && (
        <TableContainer
          toolbar={
            <TableToolbar
              searchValue={searchQuery}
              onSearchChange={setSearchQuery}
              searchPlaceholder="Buscar por número ONU, nome apropriado ou classe de risco..."
              actions={
                <Button variant="outline" size="sm" className="text-xs h-8 text-slate-600 dark:text-slate-300">
                  <Download className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                  Exportar Tabela (CSV)
                </Button>
              }
            />
          }
        >
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
                <th className="py-3 px-4">Número ONU</th>
                <th className="py-3 px-4">Nome Apropriado para Embarque</th>
                <th className="py-3 px-4">Classe de Risco</th>
                <th className="py-3 px-4">Nº de Risco</th>
                <th className="py-3 px-4">Guia / Ficha de Emergência</th>
                <th className="py-3 px-4">Exige DTRP</th>
                <th className="py-3 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {produtosPerigososMock
                .filter(
                  (row) =>
                    !searchQuery ||
                    row.numeroOnu.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    row.nomeApropriado.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    row.classeRisco.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((row) => (
                  <tr key={row.numeroOnu} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-rose-700 dark:text-rose-400">
                      {row.numeroOnu}
                    </td>
                    <td className="py-3 px-4 max-w-sm font-medium text-slate-800 dark:text-slate-200">
                      {row.nomeApropriado}
                    </td>
                    <td className="py-3 px-4">
                      <Badge color="warning" dot size="xs">
                        {row.classeRisco}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-700 dark:text-slate-300">
                      {row.numeroRisco}
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300">{row.guiaEmergencia}</td>
                    <td className="py-3 px-4">
                      <Badge color="success" dot size="xs">
                        {row.exigeDtrp}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="xs"
                          onClick={() => setViewItemModal(row)}
                          className="h-7 w-7 p-0 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="xs"
                          className="h-7 w-7 p-0 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </TableContainer>
      )}

      {activeTab === 'setores' && (
        <TableContainer
          toolbar={
            <TableToolbar
              searchValue={searchQuery}
              onSearchChange={setSearchQuery}
              searchPlaceholder="Buscar por sigla, nome da diretoria, titular ou e-mail..."
              actions={
                <Button variant="outline" size="sm" className="text-xs h-8 text-slate-600 dark:text-slate-300">
                  <Download className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                  Exportar Tabela (CSV)
                </Button>
              }
            />
          }
        >
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
                <th className="py-3 px-4">Sigla</th>
                <th className="py-3 px-4">Nome do Setor / Diretoria</th>
                <th className="py-3 px-4">Titular / Representante</th>
                <th className="py-3 px-4">E-mail Institucional</th>
                <th className="py-3 px-4">Setor Superior</th>
                <th className="py-3 px-4">Situação</th>
                <th className="py-3 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {setoresMock
                .filter(
                  (row) =>
                    !searchQuery ||
                    row.sigla.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    row.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    row.titular.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    row.email.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((row) => (
                  <tr key={row.sigla} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-[#0F4C3A] dark:text-emerald-400">
                      {row.sigla}
                    </td>
                    <td className="py-3 px-4 max-w-xs">
                      <div className="font-semibold text-slate-800 dark:text-slate-200">{row.nome}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">{row.competencia}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-700 dark:text-slate-300 font-medium">{row.titular}</td>
                    <td className="py-3 px-4 font-mono text-slate-600 dark:text-slate-400">{row.email}</td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300">{row.setorSuperior}</td>
                    <td className="py-3 px-4">
                      <Badge color="success" dot size="xs">
                        {row.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="xs"
                          onClick={() => setViewItemModal(row)}
                          className="h-7 w-7 p-0 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="xs"
                          className="h-7 w-7 p-0 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </TableContainer>
      )}

      {activeTab === 'orgaos-intervenientes' && (
        <TableContainer
          toolbar={
            <TableToolbar
              searchValue={searchQuery}
              onSearchChange={setSearchQuery}
              searchPlaceholder="Buscar por órgão, razão social, manifestação ou convênio..."
              actions={
                <Button variant="outline" size="sm" className="text-xs h-8 text-slate-600 dark:text-slate-300">
                  <Download className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                  Exportar Tabela (CSV)
                </Button>
              }
            />
          }
        >
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
                <th className="py-3 px-4">Órgão / Sigla</th>
                <th className="py-3 px-4">Razão Social & Nome Completo</th>
                <th className="py-3 px-4">Tipo de Manifestação</th>
                <th className="py-3 px-4">Prazo Legal Regulamentar</th>
                <th className="py-3 px-4">Convênio / Base Legal SEI</th>
                <th className="py-3 px-4">Situação</th>
                <th className="py-3 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {orgaosMock
                .filter(
                  (row) =>
                    !searchQuery ||
                    row.sigla.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    row.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    row.tipoManifestacao.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    row.convenio.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((row) => (
                  <tr key={row.sigla} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-slate-100">
                      {row.sigla}
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-800 dark:text-slate-200">{row.nome}</td>
                    <td className="py-3 px-4">
                      <Badge color="primary" dot size="xs">
                        {row.tipoManifestacao}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">{row.prazoDias}</td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{row.convenio}</td>
                    <td className="py-3 px-4">
                      <Badge color="success" dot size="xs">
                        {row.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="xs"
                          onClick={() => setViewItemModal(row)}
                          className="h-7 w-7 p-0 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="xs"
                          className="h-7 w-7 p-0 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </TableContainer>
      )}

      {activeTab === 'legislacoes' && (
        <TableContainer
          toolbar={
            <TableToolbar
              searchValue={searchQuery}
              onSearchChange={setSearchQuery}
              searchPlaceholder="Buscar por norma, ementa, órgão ou ano..."
              actions={
                <Button className="bg-[#0F4C3A] hover:bg-[#0c3d2e] text-white text-xs h-8 font-semibold">
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  <span>+ Cadastrar Legislação</span>
                </Button>
              }
            />
          }
        >
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
                <th className="py-3 px-4">Norma / Ato</th>
                <th className="py-3 px-4">Ementa / Síntese</th>
                <th className="py-3 px-4">Esfera / Emissor</th>
                <th className="py-3 px-4">Data Publicação</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {[
                {
                  ato: 'Portaria INEMA nº 25.753/2022',
                  ementa: 'Regulamenta os procedimentos técnicos de Autorização de Supressão Vegetal (ASV) e Manejo de Fauna no âmbito estadual.',
                  emissor: 'INEMA / Diretoria Geral',
                  data: '15/12/2022',
                  status: 'Vigente',
                },
                {
                  ato: 'Decreto Estadual nº 14.024/2012',
                  ementa: 'Regulamento da Lei Estadual nº 10.431/2006 (Política Estadual de Meio Ambiente e de Proteção à Biodiversidade).',
                  emissor: 'Governo do Estado da Bahia',
                  data: '06/06/2012',
                  status: 'Vigente',
                },
                {
                  ato: 'Resolução CEPRAM nº 4.570/2017',
                  ementa: 'Dispõe sobre o enquadramento de atividades e empreendimentos dispensados de licenciamento ambiental (ANSLA).',
                  emissor: 'CEPRAM / SEMA',
                  data: '18/10/2017',
                  status: 'Vigente',
                },
                {
                  ato: 'Lei Estadual nº 11.631/2009',
                  ementa: 'Institui a Taxa de Fiscalização Ambiental do Estado da Bahia (TFA) e altera tabela de atos regulatórios.',
                  emissor: 'Assembleia Legislativa da Bahia',
                  data: '30/12/2009',
                  status: 'Vigente',
                },
              ].map((leg) => (
                <tr key={leg.ato} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-slate-100">{leg.ato}</td>
                  <td className="py-3 px-4 max-w-md text-slate-700 dark:text-slate-300">{leg.ementa}</td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-400 font-medium">{leg.emissor}</td>
                  <td className="py-3 px-4 font-mono text-slate-600 dark:text-slate-400">{leg.data}</td>
                  <td className="py-3 px-4">
                    <Badge color="success" dot size="xs">
                      {leg.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Button variant="ghost" size="xs" className="text-[#0F4C3A] dark:text-emerald-400 font-semibold">
                      <FileText className="w-3.5 h-3.5 mr-1" />
                      <span>DOE</span>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableContainer>
      )}

      {activeTab === 'tipos-documentos' && (
        <TableContainer
          toolbar={
            <TableToolbar
              searchValue={searchQuery}
              onSearchChange={setSearchQuery}
              searchPlaceholder="Buscar por código oficial, formulário ou diretoria..."
              actions={
                <Button className="bg-[#0F4C3A] hover:bg-[#0c3d2e] text-white text-xs h-8 font-semibold">
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  <span>+ Novo Modelo</span>
                </Button>
              }
            />
          }
        >
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
                <th className="py-3 px-4">Código do Documento</th>
                <th className="py-3 px-4">Nome do Formulário / Modelo</th>
                <th className="py-3 px-4">Módulo de Aplicação</th>
                <th className="py-3 px-4">Obrigatoriedade</th>
                <th className="py-3 px-4">Versão</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {[
                {
                  codigo: 'F-DIPRE-ENQ-01',
                  nome: 'Requerimento e Parecer Técnico de Enquadramento Prévio',
                  modulo: 'Regulação / DIPRE',
                  obrig: 'Obrigatório no Protocolo',
                  versao: 'v3.2 (2026)',
                  status: 'Ativo',
                },
                {
                  codigo: 'F-DUC-069-00',
                  nome: 'Formulário Oficial de Anuência em Unidade de Conservação',
                  modulo: 'Biodiversidade / DISUC',
                  obrig: 'Condicionado a UC',
                  versao: 'v2.0 (2025)',
                  status: 'Ativo',
                },
                {
                  codigo: 'F-DIFIS-AUTO-02',
                  nome: 'Auto de Infração e Termo de Notificação Ambiental',
                  modulo: 'Fiscalização / DIFIS',
                  obrig: 'Lavratura de Campo',
                  versao: 'v4.1 (2026)',
                  status: 'Ativo',
                },
                {
                  codigo: 'F-DTRP-MAN-01',
                  nome: 'Manifesto de Transporte de Cargas e Resíduos Perigosos',
                  modulo: 'Transporte / DTRP',
                  obrig: 'Obrigatório com QR Code',
                  versao: 'v1.8 (2024)',
                  status: 'Ativo',
                },
              ].map((doc) => (
                <tr key={doc.codigo} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-slate-100">{doc.codigo}</td>
                  <td className="py-3 px-4 font-medium text-slate-800 dark:text-slate-200">{doc.nome}</td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{doc.modulo}</td>
                  <td className="py-3 px-4">
                    <Badge color="primary" dot size="xs">{doc.obrig}</Badge>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-600 dark:text-slate-400">{doc.versao}</td>
                  <td className="py-3 px-4">
                    <Badge color="success" dot size="xs">{doc.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableContainer>
      )}

      {activeTab === 'informativos' && (
        <TableContainer
          toolbar={
            <TableToolbar
              searchValue={searchQuery}
              onSearchChange={setSearchQuery}
              searchPlaceholder="Buscar por informativo, tela ou público..."
              actions={
                <Button className="bg-[#0F4C3A] hover:bg-[#0c3d2e] text-white text-xs h-8 font-semibold">
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  <span>+ Novo Informativo</span>
                </Button>
              }
            />
          }
        >
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
                <th className="py-3 px-4">Identificador</th>
                <th className="py-3 px-4">Título do Informativo</th>
                <th className="py-3 px-4">Tela / Local de Exibição</th>
                <th className="py-3 px-4">Público-Alvo</th>
                <th className="py-3 px-4">Vigência</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {[
                {
                  id: 'INF-001',
                  titulo: 'Manutenção Preventiva de Certificados Digitais do SEI',
                  tela: 'Página Inicial & Topbar Geral',
                  publico: 'Todos os Usuários',
                  vigencia: '28/09 a 05/10/2026',
                  status: 'Publicado',
                },
                {
                  id: 'INF-002',
                  titulo: 'Contagem regressiva de SLA (20 dias) ativada para DISUC',
                  tela: 'Pauta de Enquadramento & UCs',
                  publico: 'Técnicos e Gestores',
                  vigencia: 'Indeterminada',
                  status: 'Publicado',
                },
                {
                  id: 'INF-003',
                  titulo: 'Emissão imediata de CND automatizada sem taxa bancária',
                  tela: 'Portal do Cidadão / CND',
                  publico: 'Cidadãos e Empresas',
                  vigencia: 'Até 31/12/2026',
                  status: 'Publicado',
                },
              ].map((inf) => (
                <tr key={inf.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-slate-100">{inf.id}</td>
                  <td className="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200">{inf.titulo}</td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{inf.tela}</td>
                  <td className="py-3 px-4">
                    <Badge color="primary" dot size="xs">{inf.publico}</Badge>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-600 dark:text-slate-400">{inf.vigencia}</td>
                  <td className="py-3 px-4">
                    <Badge color="success" dot size="xs">{inf.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableContainer>
      )}

      {activeTab === 'financeiro-juros' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Section heading="Configuração de Juros de Mora e Atualização Monetária (DAE)">
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputWrapper label="Índice de Correção Monetária">
                  <FilamentSelect
                    value="SELIC"
                    options={[
                      { value: 'SELIC', label: 'Taxa Referencial SELIC (Mensal)' },
                      { value: 'IPCA', label: 'IPCA / IBGE Acumulado' },
                      { value: 'UFIR', label: 'UFIR-BA (Unidade Fiscal do Estado)' },
                    ]}
                    onChange={() => {}}
                  />
                </InputWrapper>
                <InputWrapper label="Juros Moratórios ao Mês (%)">
                  <input
                    type="text"
                    defaultValue="1,00%"
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 font-mono"
                  />
                </InputWrapper>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputWrapper label="Multa de Mora Padrão (%)">
                  <input
                    type="text"
                    defaultValue="2,00%"
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 font-mono"
                  />
                </InputWrapper>
                <InputWrapper label="Dias de Tolerância para Compensação">
                  <input
                    type="number"
                    defaultValue="3"
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 font-mono"
                  />
                </InputWrapper>
              </div>

              <InputWrapper label="Base Legal Regulamentar">
                <textarea
                  rows={2}
                  defaultValue="Lei Estadual nº 11.631/2009 e Decreto Estadual nº 14.024/2012 — Regulamento da Taxa de Fiscalização Ambiental e Licenciamento."
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100"
                />
              </InputWrapper>

              <div className="flex justify-end gap-2 pt-2">
                <Button className="bg-[#0F4C3A] hover:bg-[#0c3d2e] text-white text-xs h-8">
                  Salvar Alterações de Juros
                </Button>
              </div>
            </div>
          </Section>

          <Section heading="Histórico de Índices Aplicados">
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700 flex justify-between items-center">
                <div>
                  <div className="font-semibold text-slate-900 dark:text-slate-100">SELIC + 1% a.m. (Vigente)</div>
                  <div className="text-[11px] text-slate-500">Vigência desde 01/01/2024 até o presente</div>
                </div>
                <Badge variant="success">Em Aplicação</Badge>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700 flex justify-between items-center opacity-75">
                <div>
                  <div className="font-semibold text-slate-900 dark:text-slate-100">IPCA + 0.5% a.m.</div>
                  <div className="text-[11px] text-slate-500">Vigência de 01/01/2021 até 31/12/2023</div>
                </div>
                <Badge variant="gray">Encerrado</Badge>
              </div>
            </div>
          </Section>
        </div>
      )}

      {activeTab === 'confissao-divida' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Section heading="Minuta Padrão do Instrumento de Confissão de Dívida">
            <div className="space-y-4 text-xs">
              <InputWrapper label="Autoridade Signatária do INEMA">
                <input
                  type="text"
                  defaultValue="Diretor Geral do Instituto do Meio Ambiente e Recursos Hídricos (INEMA)"
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 font-medium"
                />
              </InputWrapper>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputWrapper label="Cargo do Gestor">
                  <input
                    type="text"
                    defaultValue="Diretor Geral"
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100"
                  />
                </InputWrapper>
                <InputWrapper label="Matrícula Funcional">
                  <input
                    type="text"
                    defaultValue="98.112.440-1"
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 font-mono"
                  />
                </InputWrapper>
              </div>

              <InputWrapper label="Texto da Cláusula de Vencimento Antecipado">
                <textarea
                  rows={4}
                  defaultValue="O inadimplemento de 03 (três) parcelas consecutivas ou alternadas ensejará a rescisão de pleno direito do presente parcelamento, com o vencimento antecipado do saldo devedor remanescente e imediato encaminhamento à Procuradoria Geral do Estado (PGE) para inscrição em Dívida Ativa."
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100"
                />
              </InputWrapper>

              <div className="flex justify-end gap-2 pt-2">
                <Button className="bg-[#0F4C3A] hover:bg-[#0c3d2e] text-white text-xs h-8">
                  Salvar Minuta Padrão
                </Button>
              </div>
            </div>
          </Section>

          <Section heading="Pré-visualização do Documento Oficial (F-FIN-PARC-01)">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-200 dark:border-slate-700 space-y-3 font-serif text-slate-800 dark:text-slate-200 text-[11px] leading-relaxed">
              <div className="text-center font-bold font-sans text-xs pb-2 border-b border-slate-200 dark:border-slate-700">
                GOVERNO DO ESTADO DA BAHIA<br />
                INSTITUTO DO MEIO AMBIENTE E RECURSOS HÍDRICOS — INEMA<br />
                TERMO DE CONFISSÃO DE DÍVIDA E PARCELAMENTO ADMINISTRATIVO
              </div>
              <p>
                Pelo presente instrumento, de um lado o <strong>ESTADO DA BAHIA</strong>, por intermédio do <strong>INEMA</strong>, e de outro lado o <strong>REQUERENTE COMPROMISSÁRIO</strong>, têm entre si justo e acordado o parcelamento dos débitos ambientais oriundos de taxas e penalidades apuradas.
              </p>
              <p>
                <strong>CLÁUSULA PRIMEIRA:</strong> O Devedor reconhece expressamente e confessa de forma irretratável a totalidade do débito consolidado atualizado monetariamente.
              </p>
            </div>
          </Section>
        </div>
      )}

      {/* Modal de Criação de Parâmetro */}
      <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900 dark:text-slate-100">
              Novo Cadastro Parametrizado
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2 text-xs">
            <InputWrapper label="Módulo de Destino">
              <FilamentSelect
                value={activeTab}
                options={[
                  { value: 'tipologias', label: 'Tipologia / Atividade' },
                  { value: 'residuos', label: 'Resíduo (Código IBAMA)' },
                  { value: 'produtos-perigosos', label: 'Produto Perigoso (ONU)' },
                  { value: 'setores', label: 'Setor Organizacional' },
                  { value: 'orgaos-intervenientes', label: 'Órgão Interveniente' },
                ]}
                onChange={() => {}}
              />
            </InputWrapper>

            <InputWrapper label="Código Identificador">
              <input
                type="text"
                placeholder="Ex: IND.02.99 / ONU 3082"
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 font-mono"
              />
            </InputWrapper>

            <InputWrapper label="Descrição / Nome Oficial">
              <input
                type="text"
                placeholder="Nome completo do registro parametrizado"
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100"
              />
            </InputWrapper>

            <InputWrapper label="Base Normativa / Portaria">
              <input
                type="text"
                placeholder="Ex: Portaria INEMA nº 25.753/2022"
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100"
              />
            </InputWrapper>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setCreateModalOpen(false)}>
              Cancelar
            </Button>
            <Button
              size="sm"
              onClick={() => setCreateModalOpen(false)}
              className="bg-[#0F4C3A] hover:bg-[#0c3d2e] text-white font-semibold"
            >
              Salvar Parâmetro
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ParametrizacoesMasterPage;
