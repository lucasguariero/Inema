import React, { useState, useMemo } from 'react';
import {
  Megaphone,
  FlaskConical,
  ShieldCheck,
  FileText,
  Calendar,
  Search,
  X,
  ExternalLink,
  CheckCircle2,
  Building2,
  MapPin,
  Clock,
  Download,
  AlertCircle,
  FileCheck,
  Eye,
  SearchCheck
} from 'lucide-react';
import { SeiaV2Breadcrumb } from '@/components/seia-v2/SeiaV2Breadcrumb';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TableContainer, TableToolbar, InputWrapper } from '@/components/filament';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';

export interface ConsultaPublicaItem {
  id: string;
  categoriaCodigo: string;
  categoriaLabel: string;
  categoriaVariant: 'blue' | 'emerald' | 'rose' | 'amber' | 'purple';
  portaria: string;
  orgao: string;
  municipio: string;
  dataAbertura: string;
  encerramento: string;
  qtdDocumentos: number;
  empreendimento?: string;
  requerente?: string;
  resumo?: string;
}

interface AcessoPublicoPageProps {
  onNavigate?: (route: string) => void;
}

export const AcessoPublicoPage: React.FC<AcessoPublicoPageProps> = ({ onNavigate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoriaFilter, setCategoriaFilter] = useState('todos');
  const [selectedConsulta, setSelectedConsulta] = useState<ConsultaPublicaItem | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isEventosModalOpen, setIsEventosModalOpen] = useState(false);
  const [authCode, setAuthCode] = useState('');
  const [authResult, setAuthResult] = useState<{ status: 'idle' | 'valid' | 'invalid'; msg?: string }>({ status: 'idle' });

  // Lista fidedigna com os dados exatos do screenshot do GLA (step01-portal.png)
  const [consultas] = useState<ConsultaPublicaItem[]>([
    {
      id: 'c-1',
      categoriaCodigo: 'LP',
      categoriaLabel: 'LP – Licença Prévia',
      categoriaVariant: 'blue',
      portaria: 'LP-2026-002',
      orgao: 'INEMA',
      municipio: 'Ilhéus',
      dataAbertura: '01/04/2026',
      encerramento: '01/04/2028',
      qtdDocumentos: 1,
      empreendimento: 'Complexo Logístico e Portuário Sul',
      requerente: 'Bahia Mineração S.A.',
      resumo: 'Licença Prévia aprovada com ateste de viabilidade ambiental e diretrizes para o Estudo de Impacto Ambiental detalhado.',
    },
    {
      id: 'c-2',
      categoriaCodigo: 'LO',
      categoriaLabel: 'LO – Licença de Operação',
      categoriaVariant: 'emerald',
      portaria: 'LO-2026-002',
      orgao: 'INEMA',
      municipio: 'Salvador',
      dataAbertura: '02/03/2026',
      encerramento: '02/03/2029',
      qtdDocumentos: 5,
      empreendimento: 'Terminal Marítimo de Passageiros e Cargas',
      requerente: 'Sociedade de Portos da Bahia S.A.',
      resumo: 'Licença de Operação vigente com cumprimento de todas as condicionantes de controle de ruído e efluentes.',
    },
    {
      id: 'c-3',
      categoriaCodigo: 'LU',
      categoriaLabel: 'LU – Licença Unificada',
      categoriaVariant: 'rose',
      portaria: 'LAU-2026-001',
      orgao: 'INEMA',
      municipio: 'Abaíra',
      dataAbertura: '03/02/2026',
      encerramento: '03/02/2027',
      qtdDocumentos: 3,
      empreendimento: 'Usina Fotovoltaica Chapada Solar',
      requerente: 'Sol do Sertão Energias Renováveis Ltda.',
      resumo: 'Licenciamento Ambiental Unificado concedido contemplando as etapas de implantação e operação simultâneas.',
    },
    {
      id: 'c-4',
      categoriaCodigo: 'LP',
      categoriaLabel: 'LP – Licença Prévia',
      categoriaVariant: 'blue',
      portaria: 'LP-2026-001',
      orgao: 'INEMA',
      municipio: 'Salvador',
      dataAbertura: '15/01/2026',
      encerramento: '15/01/2028',
      qtdDocumentos: 1,
      empreendimento: 'Linha de Transmissão 230kV Salvador Norte',
      requerente: 'Companhia Hidro Elétrica do São Francisco',
      resumo: 'Aprovada a concepção da linha com desvio de áreas de preservação permanente e mananciais.',
    },
    {
      id: 'c-5',
      categoriaCodigo: 'LO',
      categoriaLabel: 'LO – Licença de Operação',
      categoriaVariant: 'emerald',
      portaria: 'LO-2026-001',
      orgao: 'INEMA',
      municipio: 'Barreiras',
      dataAbertura: '02/02/2022',
      encerramento: '02/02/2024',
      qtdDocumentos: 1,
      empreendimento: 'Agropecuária Rio Branco - Fase 2',
      requerente: 'Cooperativa dos Produtores do Oeste da Bahia',
      resumo: 'Licença de Operação arquivada por decurso de prazo. Processo em fase de renovação.',
    },
    {
      id: 'c-6',
      categoriaCodigo: 'ASV',
      categoriaLabel: 'ASV – Supressão Vegetal',
      categoriaVariant: 'amber',
      portaria: 'ASV-2026-003',
      orgao: 'INEMA',
      municipio: 'Gentio do Ouro',
      dataAbertura: '18/01/2026',
      encerramento: '18/01/2028',
      qtdDocumentos: 2,
      empreendimento: 'Complexo Eólico Ventos da Bahia',
      requerente: 'Parque Eólico Serra Pelada SPE',
      resumo: 'Autorização de Supressão Vegetal com destinação obrigatória de material lenhoso e salvamento de fauna.',
    },
    {
      id: 'c-7',
      categoriaCodigo: 'OUT',
      categoriaLabel: 'OUT – Outorga Hídrica',
      categoriaVariant: 'purple',
      portaria: 'OUT-2026-008',
      orgao: 'INEMA',
      municipio: 'Barreiras',
      dataAbertura: '10/01/2026',
      encerramento: '10/01/2031',
      qtdDocumentos: 4,
      empreendimento: 'Captação Superficial no Rio Grande',
      requerente: 'Agropecuária Vale Verde S.A.',
      resumo: 'Outorga de direito de uso de recursos hídricos para irrigação de pivô central.',
    },
  ]);

  const eventosMock = [
    {
      data: '15/10/2026 às 09:30',
      titulo: 'Audiência Pública: EIA/RIMA Complexo Portuário Sul',
      local: 'Centro de Convenções de Ilhéus / Transmissão Online',
      tipo: 'Audiência Pública',
    },
    {
      data: '22/10/2026 às 14:00',
      titulo: 'Consulta Pública para Criação de APA Regional do Rio Grande',
      local: 'Câmara Municipal de Barreiras',
      tipo: 'Consulta Pública',
    },
    {
      data: '08/11/2026 às 10:00',
      titulo: 'Apresentação do Plano de Manejo Parque Estadual Serra do Conduru',
      local: 'Sede Regional do INEMA - UBA Ilhéus',
      tipo: 'Reunião Técnica Pública',
    },
  ];

  const handleVerificarAutenticidade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authCode.trim()) return;

    if (authCode.toUpperCase().includes('2026') || authCode.length >= 8) {
      setAuthResult({
        status: 'valid',
        msg: `Documento autêntico! Certidão emitida e registrada eletronicamente no acervo do INEMA. Hash validado com chave pública institucional.`,
      });
    } else {
      setAuthResult({
        status: 'invalid',
        msg: `Código não localizado. Verifique se digitou o código de validação exatamente como consta no rodapé do documento.`,
      });
    }
  };

  const filteredConsultas = useMemo(() => {
    return consultas.filter((c) => {
      const matchSearch =
        searchTerm === '' ||
        c.portaria.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.municipio.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.categoriaLabel.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.empreendimento && c.empreendimento.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (c.requerente && c.requerente.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchCategoria =
        categoriaFilter === 'todos' || c.categoriaCodigo === categoriaFilter;

      return matchSearch && matchCategoria;
    });
  }, [consultas, searchTerm, categoriaFilter]);

  const getBadgeColor = (variant: ConsultaPublicaItem['categoriaVariant']) => {
    switch (variant) {
      case 'emerald':
        return 'success' as const;
      case 'amber':
        return 'warning' as const;
      case 'rose':
        return 'danger' as const;
      case 'purple':
        return 'primary' as const;
      case 'blue':
      default:
        return 'info' as const;
    }
  };

  return (
    <div className="space-y-6 w-full pb-10">
      {/* Breadcrumb */}
      <SeiaV2Breadcrumb
        items={[
          { label: 'Início', route: 'inicio', href: '/?rota=seia-v2&tela=inicio' },
          { label: 'Acesso Público', route: 'acesso-publico' },
        ]}
      />

      {/* Cabeçalho da Página (conforme screenshot step01-portal.png) */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
          Acesso Público
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-4xl leading-relaxed">
          Portal público para consulta de atos ambientais, licenças emitidas, documentos públicos e processos.
          As informações exibidas seguem critérios institucionais de transparência, publicidade e proteção de dados pessoais.
        </p>
      </div>

      {/* Botões de Ação Rápida */}
      <div className="flex flex-wrap items-center gap-3">
        <Button
          variant="primary"
          onClick={() => (onNavigate ? onNavigate('consulta-externa') : (window.location.href = '/?rota=seia-v2&tela=consulta-externa'))}
          className="bg-[#0F4C3A] hover:bg-[#0c3d2e] text-white text-xs sm:text-sm h-10 px-4 font-semibold shadow-2xs gap-2 cursor-pointer"
        >
          <SearchCheck className="w-4 h-4" />
          <span>Acompanhar Registros</span>
        </Button>

        <Button
          variant="outline"
          onClick={() => onNavigate?.('cidadao')}
          className="border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs sm:text-sm h-10 px-4 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 shadow-2xs gap-2 cursor-pointer"
        >
          <Megaphone className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
          <span>Registrar Denúncia Ambiental</span>
        </Button>

        <Button
          variant="outline"
          onClick={() => onNavigate?.('emergencia-externa')}
          className="border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs sm:text-sm h-10 px-4 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 shadow-2xs gap-2 cursor-pointer"
        >
          <FlaskConical className="w-4 h-4 text-rose-600 dark:text-rose-400" />
          <span>Registrar Emergência Química</span>
        </Button>

        <Button
          variant="outline"
          onClick={() => {
            setIsAuthModalOpen(true);
            setAuthResult({ status: 'idle' });
            setAuthCode('');
          }}
          className="border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs sm:text-sm h-10 px-4 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 shadow-2xs gap-2 cursor-pointer"
        >
          <ShieldCheck className="w-4 h-4 text-slate-500" />
          <span>Verificar Autenticidade de Documento</span>
        </Button>
      </div>

      {/* Cards de Métricas e Ações (Grid 2 colunas conforme step01-portal.png) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card 1: Licenças Publicadas */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <FileText className="w-4 h-4 text-slate-400 dark:text-slate-500" />
              <span className="text-xs sm:text-sm font-semibold">Licenças publicadas</span>
            </div>
            <div className="text-4xl font-bold text-slate-900 dark:text-slate-100 my-2">5</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mb-4">Últimos 6 meses</div>
          </div>
          <Button
            variant="outline"
            onClick={() => {
              const el = document.getElementById('tabela-consultas');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="w-full text-xs font-medium border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 h-9 cursor-pointer"
          >
            Buscar nova licença
          </Button>
        </div>

        {/* Card 2: Eventos */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <Calendar className="w-4 h-4 text-slate-400 dark:text-slate-500" />
              <span className="text-xs sm:text-sm font-semibold">Eventos</span>
            </div>
            <div className="text-4xl font-bold text-slate-900 dark:text-slate-100 my-2">03</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mb-4">Nos próximos 60 dias</div>
          </div>
          <Button
            variant="outline"
            onClick={() => setIsEventosModalOpen(true)}
            className="w-full text-xs font-medium border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 h-9 cursor-pointer"
          >
            Visualizar agenda de eventos
          </Button>
        </div>
      </div>

      {/* Histórico de Consultas (Card com Tabela do step01-portal.png) */}
      <TableContainer
        id="tabela-consultas"
        heading="Histórico de Consultas"
        description="Relação de portarias, licenças e atos expedidos disponíveis para consulta pública"
        toolbar={
          <TableToolbar
            searchValue={searchTerm}
            onSearchChange={setSearchTerm}
            searchPlaceholder="Pesquisar portaria, município..."
            actions={
              <div className="flex items-center gap-2">
                <select
                  value={categoriaFilter}
                  onChange={(e) => setCategoriaFilter(e.target.value)}
                  className="h-9 px-2.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-[#0F4C3A] cursor-pointer"
                >
                  <option value="todos">Todas categorias</option>
                  <option value="LP">LP – Licença Prévia</option>
                  <option value="LO">LO – Licença de Operação</option>
                  <option value="LU">LU – Licença Unificada</option>
                  <option value="ASV">ASV – Supressão Vegetal</option>
                  <option value="OUT">OUT – Outorga Hídrica</option>
                </select>
              </div>
            }
          />
        }
      >
        <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/40 dark:bg-slate-800/20">
                <th className="py-3.5 px-4 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  CATEGORIA
                </th>
                <th className="py-3.5 px-4 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  PORTARIA
                </th>
                <th className="py-3.5 px-4 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  ÓRGÃO
                </th>
                <th className="py-3.5 px-4 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  MUNICÍPIO
                </th>
                <th className="py-3.5 px-4 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  DATA ABERTURA
                </th>
                <th className="py-3.5 px-4 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  ENCERRAMENTO
                </th>
                <th className="py-3.5 px-4 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-center">
                  DOCUMENTOS
                </th>
                <th className="py-3.5 px-4 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">
                  AÇÕES
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {filteredConsultas.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-sm text-slate-500 dark:text-slate-400">
                    Nenhuma portaria ou licença encontrada com os filtros informados.
                  </td>
                </tr>
              ) : (
                filteredConsultas.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    {/* Categoria */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <Badge
                        color={getBadgeColor(item.categoriaVariant)}
                        size="xs"
                      >
                        {item.categoriaLabel}
                      </Badge>
                    </td>

                    {/* Portaria */}
                    <td className="py-3.5 px-4 font-semibold text-xs sm:text-sm text-slate-900 dark:text-slate-100 whitespace-nowrap">
                      {item.portaria}
                    </td>

                    {/* Órgão */}
                    <td className="py-3.5 px-4 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                      {item.orgao}
                    </td>

                    {/* Município */}
                    <td className="py-3.5 px-4 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                      {item.municipio}
                    </td>

                    {/* Data Abertura */}
                    <td className="py-3.5 px-4 text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-mono whitespace-nowrap">
                      {item.dataAbertura}
                    </td>

                    {/* Encerramento */}
                    <td className="py-3.5 px-4 text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-mono whitespace-nowrap">
                      {item.encerramento}
                    </td>

                    {/* Documentos */}
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      {item.qtdDocumentos > 1 ? (
                        <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold text-xs justify-center">
                          <FileText className="w-4 h-4" />
                          <span>{item.qtdDocumentos}</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center justify-center text-slate-300 dark:text-slate-600">
                          <FileText className="w-4 h-4" />
                        </span>
                      )}
                    </td>

                    {/* Ações */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <Button
                        variant="outline"
                        size="xs"
                        onClick={() => setSelectedConsulta(item)}
                        className="h-7 text-xs font-medium text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:text-[#0F4C3A] dark:hover:text-emerald-400 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5 mr-1 text-slate-500" />
                        <span>Visualizar</span>
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
      </TableContainer>

      {/* Modal 1: Detalhes da Portaria / Licença */}
      <Dialog open={!!selectedConsulta} onOpenChange={(open) => !open && setSelectedConsulta(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader className="pr-8">
            <div className="flex items-center gap-2 mb-1.5">
              {selectedConsulta && (
                <Badge color={getBadgeColor(selectedConsulta.categoriaVariant)} size="sm">
                  {selectedConsulta.categoriaLabel}
                </Badge>
              )}
              <span className="text-xs text-slate-400 font-mono">
                Validade até {selectedConsulta?.encerramento}
              </span>
            </div>
            <DialogTitle className="text-base font-bold text-slate-900 dark:text-slate-100">
              Portaria {selectedConsulta?.portaria}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500 dark:text-slate-400">
              Certidão e ato autorizativo expedido pelo Instituto do Meio Ambiente e Recursos Hídricos (INEMA).
            </DialogDescription>
          </DialogHeader>

          {selectedConsulta && (
            <div className="space-y-3.5 py-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
              <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-100 dark:border-slate-800 space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">Município:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedConsulta.municipio}/BA</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">Requerente:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedConsulta.requerente}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">Empreendimento:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedConsulta.empreendimento}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">Data de Publicação DOE:</span>
                  <span className="font-mono text-slate-700 dark:text-slate-300">{selectedConsulta.dataAbertura}</span>
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Resumo Institucional:
                </span>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {selectedConsulta.resumo}
                </p>
              </div>

              <div className="pt-2">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-2">
                  Documentos Públicos Disponíveis ({selectedConsulta.qtdDocumentos}):
                </span>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between p-2 rounded-lg border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800/40 text-xs">
                    <span className="inline-flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                      <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                      Publicação Oficial no Diário Oficial (DOE)
                    </span>
                    <button
                      onClick={() => alert('Download do extrato do DOE iniciado.')}
                      className="text-[#0F4C3A] dark:text-emerald-400 font-semibold hover:underline inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Download className="w-3 h-3" /> PDF
                    </button>
                  </div>
                  {selectedConsulta.qtdDocumentos > 1 && (
                    <div className="flex items-center justify-between p-2 rounded-lg border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800/40 text-xs">
                      <span className="inline-flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                        <FileText className="w-3.5 h-3.5 text-blue-600" />
                        Parecer Técnico Conclusivo Simplificado
                      </span>
                      <button
                        onClick={() => alert('Download do parecer técnico público iniciado.')}
                        className="text-[#0F4C3A] dark:text-emerald-400 font-semibold hover:underline inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Download className="w-3 h-3" /> PDF
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="border-t border-slate-100 dark:border-slate-800 pt-3">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setSelectedConsulta(null)}
              className="text-xs h-8"
            >
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal 2: Verificar Autenticidade de Documento */}
      <Dialog open={isAuthModalOpen} onOpenChange={setIsAuthModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader className="pr-8">
            <div className="inline-flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Verificador de Autenticidade</span>
            </div>
            <DialogTitle className="text-base font-bold text-slate-900 dark:text-slate-100">
              Validar Certidão ou Ato do INEMA
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500 dark:text-slate-400">
              Informe o Código de Controle ou Hash impresso no rodapé do documento para atestar a autenticidade jurídica.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleVerificarAutenticidade} className="space-y-4 py-2">
            <InputWrapper label="Código Verificador / Hash do Documento" required>
              <input
                type="text"
                placeholder="Ex: 2026.029-A8F4-91BC ou LP-2026-002"
                value={authCode}
                onChange={(e) => {
                  setAuthCode(e.target.value);
                  setAuthResult({ status: 'idle' });
                }}
                className="fi-input block w-full border-none bg-transparent py-1.5 px-3 text-xs sm:text-sm uppercase font-mono text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-slate-100"
              />
            </InputWrapper>

            {authResult.status === 'valid' && (
              <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Documento Autêntico e Válido</p>
                  <p className="mt-0.5 text-slate-600 dark:text-slate-300">{authResult.msg}</p>
                </div>
              </div>
            )}

            {authResult.status === 'invalid' && (
              <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Documento não localizado</p>
                  <p className="mt-0.5 text-slate-600 dark:text-slate-300">{authResult.msg}</p>
                </div>
              </div>
            )}

            <DialogFooter className="border-t border-slate-100 dark:border-slate-800 pt-3 flex gap-2 justify-end">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => setIsAuthModalOpen(false)}
                className="text-xs h-8"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                size="sm"
                variant="primary"
                className="bg-[#0F4C3A] hover:bg-[#0c3d2e] text-white text-xs h-8"
              >
                Verificar
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal 3: Agenda de Eventos e Audiências */}
      <Dialog open={isEventosModalOpen} onOpenChange={setIsEventosModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader className="pr-8">
            <div className="inline-flex items-center gap-1.5 text-slate-700 dark:text-slate-300 mb-1">
              <Calendar className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-bold uppercase tracking-wider">Agenda Pública de Eventos</span>
            </div>
            <DialogTitle className="text-base font-bold text-slate-900 dark:text-slate-100">
              Audiências Públicas e Consultas (60 Dias)
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500 dark:text-slate-400">
              Eventos com participação social programados pela Ouvidoria e Diretorias do INEMA.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2">
            {eventosMock.map((evento, idx) => (
              <div
                key={idx}
                className="p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 space-y-1 text-xs"
              >
                <div className="flex items-center justify-between">
                  <Badge color="primary" size="xs">{evento.tipo}</Badge>
                  <span className="font-mono text-slate-500 text-[11px]">{evento.data}</span>
                </div>
                <h4 className="font-semibold text-slate-900 dark:text-slate-100 mt-1">
                  {evento.titulo}
                </h4>
                <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 text-[11px]">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  <span>{evento.local}</span>
                </div>
              </div>
            ))}
          </div>

          <DialogFooter className="border-t border-slate-100 dark:border-slate-800 pt-3">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsEventosModalOpen(false)}
              className="text-xs h-8"
            >
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
