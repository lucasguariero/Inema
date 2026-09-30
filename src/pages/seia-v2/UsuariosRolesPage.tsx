import React, { useState } from 'react';
import {
  Users,
  ShieldCheck,
  KeyRound,
  History,
  Lock,
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  Edit2,
  Trash2,
  UserPlus,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Clock,
  Laptop,
  AlertCircle,
  FileText,
  FileCheck2,
  Globe,
  Sliders,
  Sparkles,
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

interface UsuariosRolesPageProps {
  onNavigate?: (route: string) => void;
}

export const UsuariosRolesPage: React.FC<UsuariosRolesPageProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState('usuarios');
  const [searchQuery, setSearchQuery] = useState('');
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [selectedAuditLog, setSelectedAuditLog] = useState<any>(null);

  const tabs: FilamentTabItem[] = [
    { id: 'usuarios', label: 'Usuários do Sistema', badge: '1.420', badgeVariant: 'primary' },
    { id: 'roles', label: 'Perfis de Acesso & RBAC', badge: '8 perfis', badgeVariant: 'gray' },
    { id: 'atos-ambientais', label: 'Atos & Portarias Emitidas', badge: '312', badgeVariant: 'gray' },
    { id: 'auditoria', label: 'Trilha de Auditoria (Logs)', badge: 'Tempo Real', badgeVariant: 'sage' },
    { id: 'blacklist-ptra', label: 'Filtros PTRA & Termos', badge: '42 termos', badgeVariant: 'gray' },
  ];

  const usuariosMock = [
    {
      id: 'USR-0891',
      nome: 'Thays Carvalho Miranda',
      cpf: '***.441.895-**',
      email: 'thays.miranda@inema.ba.gov.br',
      tipo: 'Servidor Público Estadual',
      setor: 'COASP / Regulação DIPRE',
      perfil: 'Gestor de Atendimento & Triagem',
      status: 'Ativo',
      ultimoAcesso: 'Hoje às 08:41',
      avatarBg: 'bg-emerald-700',
    },
    {
      id: 'USR-0422',
      nome: 'Dr. Leonardo Cavalcanti Neto',
      cpf: '***.198.330-**',
      email: 'leonardo.cavalcanti@inema.ba.gov.br',
      tipo: 'Servidor Público Estadual',
      setor: 'DIPRE — Diretoria de Regulação',
      perfil: 'Diretor / Autoridade Julgadora',
      status: 'Ativo',
      ultimoAcesso: 'Hoje às 09:12',
      avatarBg: 'bg-blue-700',
    },
    {
      id: 'USR-0518',
      nome: 'Carlos Eduardo Fontes',
      cpf: '***.723.102-**',
      email: 'carlos.fontes@inema.ba.gov.br',
      tipo: 'Técnico Especialista em Meio Ambiente',
      setor: 'DIFIS — Fiscalização Ambiental',
      perfil: 'Fiscal de Campo / Técnico Operacional',
      status: 'Ativo',
      ultimoAcesso: 'Ontem às 17:30',
      avatarBg: 'bg-amber-700',
    },
    {
      id: 'USR-1104',
      nome: 'Mariana Pires Guimarães',
      cpf: '***.502.941-**',
      email: 'mariana.guimaraes@bioconsult.com.br',
      tipo: 'Requerente / Consultoria Externa',
      setor: 'BioConsult Bahia S/A',
      perfil: 'Responsável Técnico (ART)',
      status: 'Ativo',
      ultimoAcesso: '28/09/2026 às 14:15',
      avatarBg: 'bg-slate-700',
    },
    {
      id: 'USR-0099',
      nome: 'Ricardo Menezes Barreto',
      cpf: '***.331.409-**',
      email: 'ricardo.barreto@antigo.ba.gov.br',
      tipo: 'Ex-Colaborador',
      setor: 'Ex-DISUC',
      perfil: 'Acesso Revogado',
      status: 'Bloqueado',
      ultimoAcesso: '14/02/2025',
      avatarBg: 'bg-slate-600',
    },
  ];

  const rolesMock = [
    {
      id: 'ROL-ADMIN',
      nome: 'Administrador Geral do SEIA',
      descricao: 'Acesso irrestrito a configurações mestres, logs de segurança e gestão de usuários.',
      usuariosVinculados: 6,
      tempoInatividade: '30 minutos',
      nivel: 'Nível 5 (Máximo)',
    },
    {
      id: 'ROL-GESTOR',
      nome: 'Gestor de Diretoria (DISUC / DIFIS / DIPRE)',
      descricao: 'Distribuição de processos, aprovação de pareceres conclusivos e homologação de atos.',
      usuariosVinculados: 24,
      tempoInatividade: '60 minutos',
      nivel: 'Nível 4',
    },
    {
      id: 'ROL-TECNICO',
      nome: 'Técnico Analista Ambiental',
      descricao: 'Emissão de pareceres técnicos, inspeções em campo, notificações e enquadramentos.',
      usuariosVinculados: 180,
      tempoInatividade: '120 minutos',
      nivel: 'Nível 3',
    },
    {
      id: 'ROL-ATENDENTE',
      nome: 'Atendente de Protocolo & Triagem',
      descricao: 'Recebimento de requerimentos, conferência documental e abertura de denúncias/emergências.',
      usuariosVinculados: 65,
      tempoInatividade: '120 minutos',
      nivel: 'Nível 2',
    },
    {
      id: 'ROL-EXTERNO',
      nome: 'Requerente / Cidadão / RT',
      descricao: 'Acesso aos próprios requerimentos, preenchimento de formulários e emissão de DAEs.',
      usuariosVinculados: 1145,
      tempoInatividade: '20 minutos',
      nivel: 'Nível 1 (Público)',
    },
  ];

  const atosAmbientaisMock = [
    {
      numeroPortaria: 'Portaria INEMA nº 29.840/2026',
      processoSei: '088.0001.2026.004123-1',
      interessado: 'Parque Eólico Serra da Babilônia SPE S.A.',
      tipoAto: 'Licença de Operação (LO)',
      municipio: 'Morro do Chapéu / BA',
      dataPublicacao: '24/09/2026',
      status: 'Publicado em DOE',
    },
    {
      numeroPortaria: 'Portaria INEMA nº 29.839/2026',
      processoSei: '088.0001.2026.002981-8',
      interessado: 'Fazenda Santa Rita do Rio Grande Ltda',
      tipoAto: 'Outorga Preventiva e de Direito (CERH)',
      municipio: 'São Desidério / BA',
      dataPublicacao: '23/09/2026',
      status: 'Publicado em DOE',
    },
    {
      numeroPortaria: 'Portaria INEMA nº 29.835/2026',
      processoSei: '088.0001.2026.001944-0',
      interessado: 'Mineração Vale do São Francisco S/A',
      tipoAto: 'Licença de Instalação (LI)',
      municipio: 'Juazeiro / BA',
      dataPublicacao: '20/09/2026',
      status: 'Publicado em DOE',
    },
  ];

  const auditLogsMock = [
    {
      id: 'LOG-992140',
      timestamp: '30/09/2026 09:14:02',
      usuario: 'thays.miranda (COASP)',
      ip: '10.220.14.89 (Rede Interna INEMA)',
      acao: 'TRANSIÇÃO_STATUS_PROCESSO',
      detalhes: 'Alterou status do processo 2026-004123 para "Aguardando Validação"',
      modulo: 'Regulação / Enquadramento',
      tipo: 'info',
    },
    {
      id: 'LOG-992139',
      timestamp: '30/09/2026 09:12:45',
      usuario: 'leonardo.cavalcanti (DIPRE)',
      ip: '10.220.14.12 (Rede Interna INEMA)',
      acao: 'ASSINATURA_PORTARIA_ELETRONICA',
      detalhes: 'Assinou digitalmente a Portaria INEMA nº 29.840/2026 via Token SEI',
      modulo: 'Atos Ambientais',
      tipo: 'success',
    },
    {
      id: 'LOG-992138',
      timestamp: '30/09/2026 09:05:11',
      usuario: 'carlos.fontes (DIFIS)',
      ip: '189.102.88.19 (Móvel / 4G Campo)',
      acao: 'UPLOAD_AUTO_INFRACAO_PDF',
      detalhes: 'Anexou Auto de Infração nº 2026-00891 com fotos georreferenciadas',
      modulo: 'Fiscalização / DIFIS',
      tipo: 'info',
    },
    {
      id: 'LOG-992137',
      timestamp: '30/09/2026 08:44:20',
      usuario: '177.18.99.231 (Não autenticado)',
      ip: '177.18.99.231 (Provedor Externo)',
      acao: 'TENTATIVA_LOGIN_INVALIDA',
      detalhes: '3 tentativas sucessivas de senha incorreta para o usuário "admin_test"',
      modulo: 'Segurança / Autenticação',
      tipo: 'warning',
    },
  ];

  return (
    <div className="space-y-6">
      <SeiaV2Breadcrumb
        items={[
          { label: 'Início', route: 'inicio' },
          { label: 'Gestão e Controle' },
          { label: 'Administração & Perfis de Acesso' },
        ]}
        onNavigate={onNavigate}
      />

      {/* Header institucional */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Administração, Perfis de Acesso & Governança
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Gestão de credenciais de usuários, papéis RBAC, atos ambientais publicados e trilha completa de auditoria do SEIA V2.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            onClick={() => setUserModalOpen(true)}
            className="bg-[#0F4C3A] hover:bg-[#0c3d2e] text-white text-xs h-9 font-semibold shadow-2xs"
          >
            <UserPlus className="w-4 h-4 mr-1.5" />
            <span>+ Novo Usuário</span>
          </Button>
        </div>
      </div>

      {/* KPIs de Segurança e Usuários */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Usuários Ativos"
          value="1.420"
          trend="275 servidores + 1.145 externos"
          trendType="up"
          icon={Users}
          chartData={[1200, 1250, 1300, 1350, 1390, 1410, 1420]}
        />
        <KpiCard
          title="Perfis de Acesso (RBAC)"
          value="8 grupos"
          trend="Matriz de permissões estrita"
          trendType="neutral"
          icon={ShieldCheck}
          chartData={[8, 8, 8, 8, 8, 8, 8]}
        />
        <KpiCard
          title="Atos Publicados em DOE"
          value="312 atos"
          trend="+18 este mês"
          trendType="up"
          icon={FileCheck2}
          chartData={[250, 265, 280, 295, 305, 310, 312]}
        />
        <KpiCard
          title="Incidentes / Falhas de Auth"
          value="0 alertas"
          trend="Zero violações de segurança"
          trendType="neutral"
          icon={ShieldAlert}
          chartData={[0, 0, 0, 0, 0, 0, 0]}
        />
      </div>

      {/* Abas Superiores */}
      <div className="border-b border-slate-200 dark:border-slate-800">
        <FilamentTabs items={tabs} activeTab={activeTab} onChange={setActiveTab} />
      </div>

      {/* Conteúdo por Aba */}
      {activeTab === 'usuarios' && (
        <TableContainer
          toolbar={
            <TableToolbar
              searchValue={searchQuery}
              onSearchChange={setSearchQuery}
              searchPlaceholder="Buscar por usuário, e-mail, CPF, lotação ou perfil..."
              actions={
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="text-xs h-8 text-slate-600 dark:text-slate-300">
                    <Filter className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                    Filtrar por Lotação
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs h-8 text-slate-600 dark:text-slate-300">
                    <Download className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                    Exportar Relatório (CSV)
                  </Button>
                </div>
              }
            />
          }
        >
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
                <th className="py-3 px-4">Usuário & Contato</th>
                <th className="py-3 px-4">CPF</th>
                <th className="py-3 px-4">Lotação / Entidade</th>
                <th className="py-3 px-4">Perfil RBAC</th>
                <th className="py-3 px-4">Último Acesso</th>
                <th className="py-3 px-4">Situação</th>
                <th className="py-3 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {usuariosMock
                .filter(
                  (row) =>
                    !searchQuery ||
                    row.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    row.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    row.cpf.includes(searchQuery) ||
                    row.setor.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    row.perfil.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-8 h-8 rounded-full ${row.avatarBg} text-white font-bold flex items-center justify-center text-xs shadow-2xs`}
                        >
                          {row.nome.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 dark:text-slate-100">{row.nome}</div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400">{row.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600 dark:text-slate-400">{row.cpf}</td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-800 dark:text-slate-200">{row.setor}</div>
                      <div className="text-[10px] text-slate-500">{row.tipo}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        {row.perfil}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{row.ultimoAcesso}</td>
                    <td className="py-3 px-4">
                      <Badge color={row.status === 'Ativo' ? 'success' : 'danger'} dot size="xs">
                        {row.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="xs"
                          className="h-7 w-7 p-0 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
                          title="Ver Detalhes"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="xs"
                          className="h-7 w-7 p-0 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
                          title="Editar Permissões"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="xs"
                          className="h-7 w-7 p-0 text-slate-500 hover:text-rose-600 dark:hover:text-rose-400"
                          title="Redefinir Senha / Bloquear"
                        >
                          <KeyRound className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </TableContainer>
      )}

      {activeTab === 'roles' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rolesMock.map((role) => (
            <div
              key={role.id}
              className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xs hover:border-[#0F4C3A]/50 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/20 flex items-center justify-between">
                  <div className="font-mono text-[10px] text-slate-500 dark:text-slate-400 font-bold">{role.id}</div>
                  <Badge color="primary" dot size="xs">
                    {role.nivel}
                  </Badge>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 mb-1">{role.nome}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{role.descricao}</p>
                </div>
              </div>

              <div className="px-4 py-2.5 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/20 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                <div>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{role.usuariosVinculados}</span>{' '}
                  usuários
                </div>
                <div className="flex items-center gap-1 text-[11px]">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Sessão: {role.tempoInatividade}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'atos-ambientais' && (
        <TableContainer
          toolbar={
            <TableToolbar
              searchValue={searchQuery}
              onSearchChange={setSearchQuery}
              searchPlaceholder="Buscar por portaria, processo SEI, interessado ou município..."
              actions={
                <Button variant="outline" size="sm" className="text-xs h-8 text-slate-600 dark:text-slate-300">
                  <Download className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                  Exportar DOE (CSV)
                </Button>
              }
            />
          }
        >
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
                <th className="py-3 px-4">Número da Portaria / Ato</th>
                <th className="py-3 px-4">Processo SEI-BA</th>
                <th className="py-3 px-4">Interessado / Empreendimento</th>
                <th className="py-3 px-4">Categoria do Ato</th>
                <th className="py-3 px-4">Município</th>
                <th className="py-3 px-4">Publicação DOE</th>
                <th className="py-3 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {atosAmbientaisMock
                .filter(
                  (row) =>
                    !searchQuery ||
                    row.numeroPortaria.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    row.processoSei.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    row.interessado.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    row.tipoAto.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    row.municipio.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((row) => (
                  <tr key={row.numeroPortaria} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-slate-100">
                      {row.numeroPortaria}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600 dark:text-slate-400">{row.processoSei}</td>
                    <td className="py-3 px-4 max-w-xs font-medium text-slate-800 dark:text-slate-200">
                      {row.interessado}
                    </td>
                    <td className="py-3 px-4">
                      <Badge color="primary" dot size="xs">
                        {row.tipoAto}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{row.municipio}</td>
                    <td className="py-3 px-4 font-semibold text-emerald-700 dark:text-emerald-400">
                      {row.dataPublicacao}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Button
                        variant="outline"
                        size="xs"
                        className="text-xs h-7 text-slate-700 dark:text-slate-300"
                      >
                        <FileText className="w-3.5 h-3.5 mr-1 text-[#0F4C3A]" />
                        Ver DOE
                      </Button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </TableContainer>
      )}

      {activeTab === 'auditoria' && (
        <TableContainer
          toolbar={
            <TableToolbar
              searchValue={searchQuery}
              onSearchChange={setSearchQuery}
              searchPlaceholder="Buscar por evento, usuário, IP ou operação..."
              actions={
                <Button variant="outline" size="sm" className="text-xs h-8 text-slate-600 dark:text-slate-300">
                  <Download className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                  Exportar Logs
                </Button>
              }
            />
          }
        >
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">ID do Evento</th>
                <th className="py-3 px-4">Usuário Responsável</th>
                <th className="py-3 px-4">IP / Origem</th>
                <th className="py-3 px-4">Operação Executada</th>
                <th className="py-3 px-4">Módulo</th>
                <th className="py-3 px-4 text-right">Diff</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono text-[11px]">
              {auditLogsMock
                .filter(
                  (log) =>
                    !searchQuery ||
                    log.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    log.usuario.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    log.ip.includes(searchQuery) ||
                    log.acao.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    log.detalhes.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 text-slate-500">{log.timestamp}</td>
                    <td className="py-3 px-4 font-bold text-slate-800 dark:text-slate-200">{log.id}</td>
                    <td className="py-3 px-4 font-sans font-medium text-slate-900 dark:text-slate-100">
                      {log.usuario}
                    </td>
                    <td className="py-3 px-4 text-slate-500">{log.ip}</td>
                    <td className="py-3 px-4">
                      <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                        {log.acao}
                      </span>
                      <div className="font-sans text-[11px] text-slate-600 dark:text-slate-400 mt-1">
                        {log.detalhes}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-sans text-slate-600 dark:text-slate-400">{log.modulo}</td>
                    <td className="py-3 px-4 text-right font-sans">
                      <Button variant="ghost" size="xs" className="h-7 text-xs text-slate-600 dark:text-slate-400">
                        Ver JSON
                      </Button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </TableContainer>
      )}

      {/* Modal de Novo Usuário */}
      <Dialog open={userModalOpen} onOpenChange={setUserModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900 dark:text-slate-100">
              Cadastrar Novo Usuário no SEIA V2
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2 text-xs">
            <InputWrapper label="Nome Completo">
              <input
                type="text"
                placeholder="Nome do servidor ou analista"
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100"
              />
            </InputWrapper>

            <div className="grid grid-cols-2 gap-3">
              <InputWrapper label="CPF">
                <input
                  type="text"
                  placeholder="000.000.000-00"
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 font-mono"
                />
              </InputWrapper>
              <InputWrapper label="Matrícula SEI (opcional)">
                <input
                  type="text"
                  placeholder="98.110.000-1"
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 font-mono"
                />
              </InputWrapper>
            </div>

            <InputWrapper label="E-mail Institucional (@inema.ba.gov.br)">
              <input
                type="email"
                placeholder="nome.sobrenome@inema.ba.gov.br"
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100"
              />
            </InputWrapper>

            <InputWrapper label="Lotação / Setor">
              <FilamentSelect
                value="DIPRE"
                options={[
                  { value: 'DISUC', label: 'DISUC — Unidades de Conservação' },
                  { value: 'DIFIS', label: 'DIFIS — Fiscalização Ambiental' },
                  { value: 'DIPRE', label: 'DIPRE — Regulação Ambiental' },
                  { value: 'COASP', label: 'COASP — Atendimento e Triagem' },
                ]}
                onChange={() => {}}
              />
            </InputWrapper>

            <InputWrapper label="Perfil de Acesso (RBAC)">
              <FilamentSelect
                value="ROL-TECNICO"
                options={[
                  { value: 'ROL-ADMIN', label: 'Administrador Geral' },
                  { value: 'ROL-GESTOR', label: 'Gestor de Área' },
                  { value: 'ROL-TECNICO', label: 'Técnico Analista Ambiental' },
                  { value: 'ROL-ATENDENTE', label: 'Atendente de Protocolo' },
                ]}
                onChange={() => {}}
              />
            </InputWrapper>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setUserModalOpen(false)}>
              Cancelar
            </Button>
            <Button
              size="sm"
              onClick={() => setUserModalOpen(false)}
              className="bg-[#0F4C3A] hover:bg-[#0c3d2e] text-white font-semibold"
            >
              Criar Usuário & Enviar Acesso
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UsuariosRolesPage;
