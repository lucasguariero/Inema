import React, { useState } from 'react';
import {
  Bird,
  Plus,
  Search,
  Download,
  Eye,
  CheckCircle2,
  Calendar,
  Layers,
  FileCheck,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FilamentTabs, FilamentTabItem } from '@/components/filament/Tabs';
import { TableContainer, TableToolbar } from '@/components/filament/Table';
import { KpiCard } from '@/components/dashboard/KpiCard';
import { SeiaV2Breadcrumb } from '@/components/seia-v2/SeiaV2Breadcrumb';

interface SispassPerfisPageProps {
  onNavigate?: (route: string) => void;
}

export const SispassPerfisPage: React.FC<SispassPerfisPageProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState('perfis');
  const [searchTerm, setSearchTerm] = useState('');

  const tabs: FilamentTabItem[] = [
    { id: 'perfis', label: 'Criadores Cadastrados', badge: '8.420', badgeVariant: 'primary' },
    { id: 'validacao', label: 'Validação de Documentos', badge: '28', badgeVariant: 'warning' },
    { id: 'anilhas', label: 'Gestão de Anilhas Oficiais', badge: 'Ativo', badgeVariant: 'gray' },
  ];

  const criadoresMock = [
    {
      id: 'SISPASS-BA-09124',
      criador: 'Roberto Fonseca de Oliveira',
      cpf: '342.891.005-22',
      categoria: 'Criador Amador de Passeriformes (CAP)',
      plantel: '14 aves registradas',
      municipio: 'Salvador/BA',
      situacao: 'Regular e Licenciado',
      statusColor: 'success',
      dataRecadastro: '12/05/2026',
    },
    {
      id: 'SISPASS-BA-08819',
      criador: 'Danilo Silva Santana',
      cpf: '551.209.418-90',
      categoria: 'Criador Amador de Passeriformes (CAP)',
      plantel: '08 aves registradas',
      municipio: 'Vitória da Conquista/BA',
      situacao: 'Pendente Declaração Anual',
      statusColor: 'warning',
      dataRecadastro: 'Atrasado',
    },
    {
      id: 'SISPASS-BA-07912',
      criador: 'Mariana Alves Queiroz',
      cpf: '712.304.912-34',
      categoria: 'Criador Comercial Autorizado (CCA)',
      plantel: '45 aves registradas',
      municipio: 'Feira de Santana/BA',
      situacao: 'Regular e Licenciado',
      statusColor: 'success',
      dataRecadastro: '20/08/2026',
    },
    {
      id: 'SISPASS-BA-06411',
      criador: 'Claudio Peixoto Ramos',
      cpf: '109.843.219-55',
      categoria: 'Criador Amador de Passeriformes (CAP)',
      plantel: '02 aves registradas',
      municipio: 'Ilhéus/BA',
      situacao: 'Bloqueado por Infração',
      statusColor: 'danger',
      dataRecadastro: 'Suspenso',
    },
  ];

  const filteredCriadores = criadoresMock.filter(
    (row) =>
      !searchTerm ||
      row.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.criador.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.cpf.includes(searchTerm) ||
      row.municipio.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.categoria.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <SeiaV2Breadcrumb
        items={[
          { label: 'Início', route: 'inicio' },
          { label: 'Biodiversidade & Fauna', route: 'sispass' },
          { label: 'SISPASS — Manejo de Fauna' },
        ]}
        onNavigate={onNavigate}
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Sistema de Gestão de Passeriformes Silvestres (SISPASS)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Cadastro oficial de criadores amadores, anilhamento, declarações anuais de reprodução e transferências.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button variant="outline" size="sm" className="text-xs h-9">
            <Download className="w-3.5 h-3.5 mr-1.5" />
            <span>Exportar Relação</span>
          </Button>
          <Button className="bg-[#0F4C3A] hover:bg-[#0c3d2e] text-white text-xs h-9 font-semibold">
            <Plus className="w-4 h-4 mr-1.5" />
            <span>+ Novo Criador SISPASS</span>
          </Button>
        </div>
      </div>

      {/* KPIs do SISPASS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Criadores Cadastrados"
          value="8.420"
          trend="+5.4% no ano"
          trendType="up"
          icon={Bird}
          chartData={[7800, 7950, 8100, 8250, 8350, 8400, 8420]}
        />
        <KpiCard
          title="Validações Pendentes"
          value="28"
          trend="Triagem técnica"
          trendType="neutral"
          icon={FileCheck}
          chartData={[35, 32, 30, 28, 29, 28, 28]}
        />
        <KpiCard
          title="Plantel Monitorado"
          value="34.120"
          trend="Passeriformes anilhados"
          trendType="up"
          icon={ShieldCheck}
          chartData={[30000, 31000, 32000, 33000, 33800, 34000, 34120]}
        />
        <KpiCard
          title="Bloqueios / Infrações"
          value="04"
          trend="-2 este mês"
          trendType="down"
          icon={AlertTriangle}
          chartData={[8, 7, 6, 5, 5, 4, 4]}
        />
      </div>

      <div className="border-b border-slate-200 dark:border-slate-800">
        <FilamentTabs items={tabs} activeTab={activeTab} onChange={setActiveTab} />
      </div>

      {activeTab === 'perfis' && (
        <TableContainer
          toolbar={
            <TableToolbar
              searchValue={searchTerm}
              onSearchChange={setSearchTerm}
              searchPlaceholder="Buscar por registro SISPASS, criador, CPF, município..."
              actions={
                <Button variant="outline" size="sm" className="text-xs h-8 text-slate-600 dark:text-slate-300">
                  <Download className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                  <span>Exportar CSV</span>
                </Button>
              }
            />
          }
        >
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
                <th className="py-3 px-4">Registro SISPASS</th>
                <th className="py-3 px-4">Criador / CPF</th>
                <th className="py-3 px-4">Categoria</th>
                <th className="py-3 px-4">Plantel Registrado</th>
                <th className="py-3 px-4">Município</th>
                <th className="py-3 px-4">Situação</th>
                <th className="py-3 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredCriadores.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                  <td className="py-3.5 px-4 font-mono font-semibold text-slate-900 dark:text-slate-100">{row.id}</td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-900 dark:text-slate-100">{row.criador}</div>
                    <div className="text-[11px] font-mono text-slate-500">{row.cpf}</div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300">{row.categoria}</td>
                  <td className="py-3.5 px-4 font-mono text-slate-800 dark:text-slate-200">{row.plantel}</td>
                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">{row.municipio}</td>
                  <td className="py-3.5 px-4">
                    <Badge color={row.statusColor as any} dot size="xs">
                      {row.situacao}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Button variant="ghost" size="xs" className="text-[#0F4C3A] dark:text-emerald-400 font-semibold">
                      <Eye className="w-3.5 h-3.5 mr-1" />
                      <span>Plantel</span>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableContainer>
      )}

      {activeTab === 'validacao' && (
        <TableContainer
          toolbar={
            <TableToolbar
              searchValue={searchTerm}
              onSearchChange={setSearchTerm}
              searchPlaceholder="Buscar por solicitação, criador ou pendência..."
            />
          }
        >
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
                <th className="py-3 px-4">Protocolo de Validação</th>
                <th className="py-3 px-4">Criador Requerente</th>
                <th className="py-3 px-4">Tipo de Solicitação</th>
                <th className="py-3 px-4">Documento em Análise</th>
                <th className="py-3 px-4">Data de Envio</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {[
                {
                  id: 'SIS-DOC-2026-0041',
                  criador: 'Danilo Silva Santana (SISPASS-BA-08819)',
                  tipo: 'Declaração Anual de Reprodução',
                  documento: 'Laudo Veterinário e Anotação de Nascimentos',
                  data: '24/09/2026',
                  status: 'Aguardando Análise Documental',
                  statusColor: 'warning',
                },
                {
                  id: 'SIS-DOC-2026-0038',
                  criador: 'Claudio Peixoto Ramos (SISPASS-BA-06411)',
                  tipo: 'Defesa Prévia de Bloqueio',
                  documento: 'Recurso Administrativo de Infração Ambiental',
                  data: '18/09/2026',
                  status: 'Parecer Jurídico Pendente',
                  statusColor: 'danger',
                },
              ].map((val) => (
                <tr key={val.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                  <td className="py-3.5 px-4 font-mono font-semibold text-slate-900 dark:text-slate-100">{val.id}</td>
                  <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-slate-100">{val.criador}</td>
                  <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300">{val.tipo}</td>
                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">{val.documento}</td>
                  <td className="py-3.5 px-4 font-mono text-slate-600 dark:text-slate-400">{val.data}</td>
                  <td className="py-3.5 px-4">
                    <Badge color={val.statusColor as any} dot size="xs">
                      {val.status}
                    </Badge>
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

      {activeTab === 'anilhas' && (
        <TableContainer
          toolbar={
            <TableToolbar
              searchValue={searchTerm}
              onSearchChange={setSearchTerm}
              searchPlaceholder="Buscar por lote de anilhas, diâmetro ou criador..."
              actions={
                <Button className="bg-[#0F4C3A] hover:bg-[#0c3d2e] text-white text-xs h-8 font-semibold">
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  <span>+ Novo Lote de Anilhas</span>
                </Button>
              }
            />
          }
        >
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
                <th className="py-3 px-4">Lote Oficial</th>
                <th className="py-3 px-4">Diâmetro / Bitola</th>
                <th className="py-3 px-4">Numeração Inicial - Final</th>
                <th className="py-3 px-4">Fornecedor Credenciado</th>
                <th className="py-3 px-4">Estoque Disponível</th>
                <th className="py-3 px-4">Status do Lote</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {[
                {
                  lote: 'ANL-BA-2026-L01',
                  diametro: '2.5 mm (Curió / Bicudo)',
                  faixa: 'BA-2026-000100 a BA-2026-005000',
                  fornecedor: 'Metalúrgica AnelForte Ltda (Credenciada)',
                  estoque: '4.900 unidades',
                  status: 'Disponível para Emissão',
                  statusColor: 'success',
                },
                {
                  lote: 'ANL-BA-2026-L02',
                  diametro: '3.0 mm (Canário-da-terra / Coleiro)',
                  faixa: 'BA-2026-005001 a BA-2026-010000',
                  fornecedor: 'Metalúrgica AnelForte Ltda (Credenciada)',
                  estoque: '1.200 unidades',
                  status: 'Estoque Baixo',
                  statusColor: 'warning',
                },
              ].map((anl) => (
                <tr key={anl.lote} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                  <td className="py-3.5 px-4 font-mono font-semibold text-slate-900 dark:text-slate-100">{anl.lote}</td>
                  <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-slate-100">{anl.diametro}</td>
                  <td className="py-3.5 px-4 font-mono text-slate-700 dark:text-slate-300">{anl.faixa}</td>
                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">{anl.fornecedor}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-800 dark:text-slate-200">{anl.estoque}</td>
                  <td className="py-3.5 px-4">
                    <Badge color={anl.statusColor as any} dot size="xs">
                      {anl.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableContainer>
      )}
    </div>
  );
};
