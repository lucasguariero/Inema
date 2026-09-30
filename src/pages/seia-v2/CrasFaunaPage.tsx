import React, { useState } from 'react';
import {
  PawPrint,
  Plus,
  ArrowLeft,
  Search,
  Download,
  Eye,
  HeartPulse,
  Activity,
  Calendar,
  Layers,
  MapPin,
  CheckCircle2,
  Filter,
  Stethoscope,
  Microscope,
  Cpu,
  Compass,
  AlertCircle,
  FileSpreadsheet,
  Edit2,
  TreeDeciduous,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FilamentTabs, FilamentTabItem } from '@/components/filament/Tabs';
import { Section } from '@/components/filament/Section';
import { InputWrapper } from '@/components/filament/InputWrapper';
import { FilamentSelect } from '@/components/filament/Select';
import { KpiCard } from '@/components/dashboard/KpiCard';
import { SeiaV2Breadcrumb } from '@/components/seia-v2/SeiaV2Breadcrumb';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

interface CrasFaunaPageProps {
  onNavigate?: (route: string) => void;
}

export const CrasFaunaPage: React.FC<CrasFaunaPageProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState('tratamento');
  const [selectedAnimal, setSelectedAnimal] = useState<any>(null);
  const [newAdmissionOpen, setNewAdmissionOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const tabs: FilamentTabItem[] = [
    { id: 'tratamento', label: 'Prontuários em Tratamento', badge: '38', badgeVariant: 'warning' },
    { id: 'admissoes', label: 'Admissões & Apreensões', badge: '112', badgeVariant: 'primary' },
    { id: 'manejo', label: 'Manejo Clínico & Cirurgias', badge: '14 hoje', badgeVariant: 'gray' },
    { id: 'especies', label: 'Espécies & Grau de Ameaça', badge: '184', badgeVariant: 'gray' },
    { id: 'recintos', label: 'Recintos & Quarentena', badge: '16 recintos', badgeVariant: 'gray' },
    { id: 'solturas', label: 'Destinações & Áreas ASAS', badge: '84', badgeVariant: 'success' },
    { id: 'marcacoes', label: 'Microchips & Anilhas ISO', badge: '310', badgeVariant: 'gray' },
  ];

  const animaisMock = [
    {
      id: 'CRAS-BA-2026-00491',
      especie: 'Arara-azul-de-lear (Anodorhynchus leari)',
      classe: 'Aves (Psittacidae)',
      procedencia: 'Resgate de Apreensão — Fiscalização Regional Canudos',
      recinto: 'Recinto de Voo 03 (Quarentena)',
      anilhaMicrochip: 'Microchip 981.098.221.002',
      condicaoClinica: 'Reabilitação de Plumagem e Musculatura',
      status: 'Apto para Soltura Suave',
      statusColor: 'success' as const,
      dataEntrada: '14/08/2026',
      veterinario: 'Dr. Thiago Vasconcelos (CRMV-BA 3841)',
      grauAmeaca: 'Em Perigo (EN)',
    },
    {
      id: 'CRAS-BA-2026-00478',
      especie: 'Tamanduá-bandeira (Myrmecophaga tridactyla)',
      classe: 'Mamíferos (Pilosa)',
      procedencia: 'Atropelamento na BR-242 / Resgate Policial',
      recinto: 'Enfermaria Veterinária 01',
      anilhaMicrochip: 'Microchip 981.098.221.099',
      condicaoClinica: 'Pós-Cirúrgico Ortopédico (Membro Posterior)',
      status: 'Tratamento Intensivo',
      statusColor: 'warning' as const,
      dataEntrada: '02/09/2026',
      veterinario: 'Dra. Camila Nogueira (CRMV-BA 4120)',
      grauAmeaca: 'Vulnerável (VU)',
    },
    {
      id: 'CRAS-BA-2026-00412',
      especie: 'Jaguatirica (Leopardus pardalis)',
      classe: 'Mamíferos (Carnivora)',
      procedencia: 'Entrega Voluntária em Parque Estadual',
      recinto: 'Recinto de Felinos 02',
      anilhaMicrochip: 'Microchip 981.098.221.145',
      condicaoClinica: 'Exames Hematológicos Normais',
      status: 'Treinamento de Caça',
      statusColor: 'primary' as const,
      dataEntrada: '20/07/2026',
      veterinario: 'Dr. Thiago Vasconcelos (CRMV-BA 3841)',
      grauAmeaca: 'Quase Ameaçada (NT)',
    },
    {
      id: 'CRAS-BA-2026-00502',
      especie: 'Papagaio-do-peito-roxo (Amazona vinacea)',
      classe: 'Aves (Psittacidae)',
      procedencia: 'Apreensão em Feira Livre de Feira de Santana',
      recinto: 'Berçário e Nutrição Assistida',
      anilhaMicrochip: 'Anilha Metálica INEMA-BA-26-891',
      condicaoClinica: 'Desnutrição e Hipovitaminose A',
      status: 'Quarentena Sanitária',
      statusColor: 'warning' as const,
      dataEntrada: '26/09/2026',
      veterinario: 'Dra. Camila Nogueira (CRMV-BA 4120)',
      grauAmeaca: 'Vulnerável (VU)',
    },
  ];

  const admissoesMock = [
    {
      lote: 'LOTE-2026-089',
      data: '28/09/2026',
      origem: 'Companhia Independente de Polícia de Proteção Ambiental (COPPA)',
      municipio: 'Salvador / BA',
      totalAnimais: '42 espécimes',
      gruposTaxonomicos: 'Passeriformes e Psitacídeos',
      termoApreensao: 'TMA-DIFIS-2026-00341',
      status: 'Triagem Inicial Concluída',
    },
    {
      lote: 'LOTE-2026-088',
      data: '24/09/2026',
      origem: 'Entrega Voluntária de Cidadão',
      municipio: 'Camaçari / BA',
      totalAnimais: '01 espécime (Jiboia-constritora)',
      gruposTaxonomicos: 'Répteis (Boidae)',
      termoApreensao: 'TDEV-2026-00122',
      status: 'Em Quarentena Sanitária',
    },
  ];

  const recintosMock = [
    {
      codigo: 'REC-VOO-01',
      nome: 'Viveiro de Grandes Voo / Aves Silvestres',
      capacidadeMax: 30,
      ocupacaoAtual: 22,
      statusOcupacao: '73% de Lotação',
      higienizacao: 'Em dia (Realizada 28/09)',
    },
    {
      codigo: 'REC-FEL-02',
      nome: 'Recinto de Carnívoros & Felinos Neotropicais',
      capacidadeMax: 2,
      ocupacaoAtual: 1,
      statusOcupacao: '50% de Lotação',
      higienizacao: 'Em dia (Realizada 29/09)',
    },
    {
      codigo: 'ENF-VET-01',
      nome: 'Enfermaria Clínica & UTIs Neonatais',
      capacidadeMax: 10,
      ocupacaoAtual: 8,
      statusOcupacao: '80% de Lotação',
      higienizacao: 'Esterilização Diária',
    },
  ];

  return (
    <div className="space-y-6">
      <SeiaV2Breadcrumb
        items={[
          { label: 'Início', route: 'inicio' },
          { label: 'Biodiversidade & Fauna', route: 'cras' },
          { label: 'CRAS — Centro de Triagem de Animais Silvestres' },
        ]}
        onNavigate={onNavigate}
      />

      {/* Header Institucional */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Centro de Triagem e Reabilitação de Animais Silvestres (CRAS)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Gestão clínica veterinária, prontuários, lotes de apreensão COPPA, recintos e programas de soltura em áreas ASAS.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            onClick={() => setNewAdmissionOpen(true)}
            className="bg-[#0F4C3A] hover:bg-[#0c3d2e] text-white text-xs h-9 font-semibold shadow-2xs"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            <span>+ Nova Admissão de Animal</span>
          </Button>
        </div>
      </div>

      {/* KPIs CRAS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Animais em Cuidados"
          value="142"
          trend="82% Aves e Mamíferos"
          trendType="neutral"
          icon={PawPrint}
          chartData={[120, 125, 130, 138, 140, 142, 142]}
        />
        <KpiCard
          title="Taxa de Reabilitação"
          value="78.5%"
          trend="+5.2% no ano"
          trendType="up"
          icon={HeartPulse}
          chartData={[65, 68, 70, 72, 75, 76, 78]}
        />
        <KpiCard
          title="Solturas em Áreas ASAS"
          value="84 espécimes"
          trend="12 áreas cadastradas"
          trendType="up"
          icon={MapPin}
          chartData={[10, 18, 25, 40, 55, 70, 84]}
        />
        <KpiCard
          title="Ocupação de Recintos"
          value="82%"
          trend="16 de 20 recintos"
          trendType="neutral"
          icon={Layers}
          chartData={[70, 75, 78, 80, 80, 82, 82]}
        />
      </div>

      {/* Abas */}
      <div className="border-b border-slate-200 dark:border-slate-800">
        <FilamentTabs items={tabs} activeTab={activeTab} onChange={setActiveTab} />
      </div>

      {/* Toolbar */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder={`Buscar em ${tabs.find((t) => t.id === activeTab)?.label}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#0F4C3A]/20 focus:border-[#0F4C3A]"
            />
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="text-xs h-8 text-slate-600 dark:text-slate-300">
              <Filter className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
              Filtrar por Classe / Grau
            </Button>
            <Button variant="outline" size="sm" className="text-xs h-8 text-slate-600 dark:text-slate-300">
              <Download className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
              Livro de Registro (PDF)
            </Button>
          </div>
        </div>
      </div>

      {/* Tabela de Prontuários */}
      {activeTab === 'tratamento' && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
                  <th className="py-3 px-4">Prontuário CRAS</th>
                  <th className="py-3 px-4">Espécie (Científico / Comum)</th>
                  <th className="py-3 px-4">Procedência & Apreensão</th>
                  <th className="py-3 px-4">Recinto Atual</th>
                  <th className="py-3 px-4">Marcação / Microchip</th>
                  <th className="py-3 px-4">Status Clínico</th>
                  <th className="py-3 px-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {animaisMock.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-slate-100">
                      {row.id}
                      <div className="text-[10px] text-slate-400 font-sans font-normal">Entrada: {row.dataEntrada}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900 dark:text-slate-100">{row.especie}</div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] text-slate-500">{row.classe}</span>
                        <Badge variant="danger" className="text-[9px] py-0 px-1">
                          {row.grauAmeaca}
                        </Badge>
                      </div>
                    </td>
                    <td className="py-3 px-4 max-w-xs text-slate-600 dark:text-slate-300">{row.procedencia}</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        {row.recinto}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600 dark:text-slate-400 text-[11px]">
                      {row.anilhaMicrochip}
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={row.statusColor} className="text-[10px]">
                        {row.status}
                      </Badge>
                      <div className="text-[10px] text-slate-500 mt-1 truncate max-w-[180px]">
                        {row.condicaoClinica}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="xs"
                          onClick={() => setSelectedAnimal(row)}
                          className="h-7 w-7 p-0 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="xs"
                          className="h-7 w-7 p-0 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
                        >
                          <Stethoscope className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Aba de Admissões */}
      {activeTab === 'admissoes' && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
                  <th className="py-3 px-4">Lote de Admissão</th>
                  <th className="py-3 px-4">Data & Origem</th>
                  <th className="py-3 px-4">Município</th>
                  <th className="py-3 px-4">Quantitativo & Grupos</th>
                  <th className="py-3 px-4">Termo / Auto DIFIS</th>
                  <th className="py-3 px-4">Situação da Triagem</th>
                  <th className="py-3 px-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {admissoesMock.map((lote) => (
                  <tr key={lote.lote} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-slate-100">
                      {lote.lote}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800 dark:text-slate-200">{lote.origem}</div>
                      <div className="text-[10px] text-slate-500">Admitido em: {lote.data}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300">{lote.municipio}</td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900 dark:text-slate-100">{lote.totalAnimais}</div>
                      <div className="text-[10px] text-slate-500">{lote.gruposTaxonomicos}</div>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600 dark:text-slate-400">{lote.termoApreensao}</td>
                    <td className="py-3 px-4">
                      <Badge variant="success" className="text-[10px]">
                        {lote.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Button variant="ghost" size="xs" className="h-7 text-xs text-slate-600">
                        Ver Animais do Lote
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Aba de Recintos */}
      {activeTab === 'recintos' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recintosMock.map((recinto) => (
            <div
              key={recinto.codigo}
              className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-2xs space-y-3"
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-mono text-[10px] font-bold text-[#0F4C3A] dark:text-emerald-400">
                    {recinto.codigo}
                  </span>
                  <h3 className="font-bold text-xs text-slate-900 dark:text-slate-100 mt-0.5">{recinto.nome}</h3>
                </div>
                <Badge variant="primary" className="text-[10px]">
                  {recinto.statusOcupacao}
                </Badge>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Capacidade Máxima:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{recinto.capacidadeMax}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Ocupação Atual:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{recinto.ocupacaoAtual}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400 text-[11px] pt-1 border-t border-slate-100 dark:border-slate-800">
                  <span>Higienização:</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium">{recinto.higienizacao}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de Detalhes do Prontuário */}
      {selectedAnimal && (
        <Dialog open={!!selectedAnimal} onOpenChange={() => setSelectedAnimal(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <PawPrint className="w-5 h-5 text-[#0F4C3A]" />
                <span>Prontuário Veterinário — {selectedAnimal.id}</span>
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-3 text-xs py-2">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Espécie:</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100">{selectedAnimal.especie}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Identificação Individual:</span>
                  <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                    {selectedAnimal.anilhaMicrochip}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Veterinário Responsável:</span>
                  <span className="text-slate-800 dark:text-slate-200">{selectedAnimal.veterinario}</span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Evolução Clínica e Conduta:</label>
                <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
                  {selectedAnimal.condicaoClinica}. Animal mantido sob dieta hiperproteica com enriquecimento ambiental
                  para estimulação de forrageio.
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" size="sm" onClick={() => setSelectedAnimal(null)}>
                Fechar
              </Button>
              <Button size="sm" className="bg-[#0F4C3A] hover:bg-[#0c3d2e] text-white font-semibold">
                Emitir Laudo Veterinário (PDF)
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Modal de Nova Admissão */}
      <Dialog open={newAdmissionOpen} onOpenChange={setNewAdmissionOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900 dark:text-slate-100">
              Registrar Nova Admissão no CRAS
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2 text-xs">
            <InputWrapper label="Origem da Admissão">
              <FilamentSelect
                value="COPPA"
                options={[
                  { value: 'COPPA', label: 'Polícia Ambiental (COPPA)' },
                  { value: 'DIFIS', label: 'Fiscalização INEMA (DIFIS)' },
                  { value: 'VOLUNTARIA', label: 'Entrega Voluntária de Cidadão' },
                  { value: 'RESGATE', label: 'Resgate de Fauna / Atropelamento' },
                ]}
                onChange={() => {}}
              />
            </InputWrapper>

            <InputWrapper label="Espécie Silvestre">
              <input
                type="text"
                placeholder="Nome vulgar ou científico da espécie"
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100"
              />
            </InputWrapper>

            <div className="grid grid-cols-2 gap-3">
              <InputWrapper label="Quantidade (espécimes)">
                <input
                  type="number"
                  defaultValue="1"
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 font-mono"
                />
              </InputWrapper>
              <InputWrapper label="Recinto de Quarentena">
                <FilamentSelect
                  value="REC-VOO-01"
                  options={[
                    { value: 'REC-VOO-01', label: 'Recinto Voo 01' },
                    { value: 'ENF-VET-01', label: 'Enfermaria 01' },
                    { value: 'REC-FEL-02', label: 'Recinto Felinos 02' },
                  ]}
                  onChange={() => {}}
                />
              </InputWrapper>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setNewAdmissionOpen(false)}>
              Cancelar
            </Button>
            <Button
              size="sm"
              onClick={() => setNewAdmissionOpen(false)}
              className="bg-[#0F4C3A] hover:bg-[#0c3d2e] text-white font-semibold"
            >
              Concluir Entrada & Gerar Prontuário
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CrasFaunaPage;
