import React, { useState, useEffect } from 'react';
import {
  Search,
  FileText,
  FolderKanban,
  ShieldAlert,
  PawPrint,
  FileCheck,
  Settings,
  UserCircle,
  Landmark,
  Layers,
  ArrowRight,
  Sparkles,
  Command,
  Sun,
  Moon,
  LogOut,
  Sliders,
  Compass,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useTheme } from '@/context/ThemeContext';

interface GlobalCommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNavigate: (route: string) => void;
}

interface CommandItem {
  id: string;
  category: 'Navegação' | 'Ações Rápidas' | 'Processos Recentes' | 'Configurações';
  label: string;
  description?: string;
  route?: string;
  action?: () => void;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

export const GlobalCommandPalette: React.FC<GlobalCommandPaletteProps> = ({
  open,
  onOpenChange,
  onNavigate,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { isDarkMode, toggleDarkMode } = useTheme();

  const commands: CommandItem[] = [
    // Ações Rápidas
    {
      id: 'cmd-novo-req',
      category: 'Ações Rápidas',
      label: 'Novo Requerimento Unificado',
      description: 'Abrir formulário de licenciamento ambiental',
      route: 'formulario',
      icon: FileText,
      badge: 'F-REQ',
    },
    {
      id: 'cmd-nova-denuncia',
      category: 'Ações Rápidas',
      label: 'Registrar Nova Denúncia Ambiental',
      description: 'Abertura de atendimento DIFIS',
      route: 'atendente',
      icon: ShieldAlert,
      badge: 'DIFIS',
    },
    {
      id: 'cmd-nova-emergencia',
      category: 'Ações Rápidas',
      label: 'Registrar Emergência com Produtos Perigosos',
      description: 'Plantão de atendimento de emergências',
      route: 'emergencia-interna',
      icon: ShieldAlert,
      badge: 'Emergência',
    },
    {
      id: 'cmd-toggle-theme',
      category: 'Ações Rápidas',
      label: isDarkMode ? 'Mudar para Modo Claro (Light)' : 'Mudar para Modo Escuro (Dark)',
      description: 'Alternar paleta visual do sistema',
      action: () => toggleDarkMode(),
      icon: isDarkMode ? Sun : Moon,
    },

    // Navegação Principal & Telas
    {
      id: 'cmd-inicio',
      category: 'Navegação',
      label: 'Visão Geral / Início',
      description: 'Painel inicial integrado do SEIA V2',
      route: 'inicio',
      icon: FolderKanban,
    },
    {
      id: 'cmd-relatorios',
      category: 'Navegação',
      label: 'Relatórios Gerenciais & Indicadores',
      description: 'Dashboard analítico, gráficos de aging e metas',
      route: 'relatorios',
      icon: Layers,
    },
    {
      id: 'cmd-pauta',
      category: 'Navegação',
      label: 'Pauta de Processos / Tabela Operacional',
      description: 'Gestão da esteira de processos do analista',
      route: 'tabela',
      icon: FolderKanban,
    },
    {
      id: 'cmd-enquadramento',
      category: 'Navegação',
      label: 'Enquadramento & Triagem de Atos',
      description: 'Distribuição técnica e parecer F-DIPRE-ENQ-01',
      route: 'enquadramento',
      icon: FileCheck,
      badge: 'DIPRE',
    },
    {
      id: 'cmd-cadastros',
      category: 'Navegação',
      label: 'Cadastros Básicos (RT, Representantes, Empreendimentos)',
      description: 'Gestão de vínculos e procurações',
      route: 'cadastros-basicos',
      icon: UserCircle,
    },
    {
      id: 'cmd-cras',
      category: 'Navegação',
      label: 'Gestão de Fauna Silvestre (CRAS)',
      description: 'Prontuários veterinários, apreensões e solturas',
      route: 'cras',
      icon: PawPrint,
      badge: 'CRAS',
    },
    {
      id: 'cmd-sispass',
      category: 'Navegação',
      label: 'Criadores SISPASS / Passeriformes',
      description: 'Gestão de anilhas e transferências de aves',
      route: 'sispass',
      icon: PawPrint,
    },
    {
      id: 'cmd-cerh',
      category: 'Navegação',
      label: 'Recursos Hídricos / CERH & Outorgas',
      description: 'Cadastro estadual de usuários de água',
      route: 'cerh',
      icon: Compass,
      badge: 'CERH',
    },
    {
      id: 'cmd-ansla',
      category: 'Navegação',
      label: 'Dispensa de Licenciamento (ANSLA)',
      description: 'Atividades de baixo impacto e declaração online',
      route: 'ansla',
      icon: FileCheck,
      badge: 'ANSLA',
    },
    {
      id: 'cmd-cefir',
      category: 'Navegação',
      label: 'Cadastro de Imóveis Rurais (CEFIR)',
      description: 'Consulta e regularização de imóveis rurais',
      route: 'cefir',
      icon: FileText,
      badge: 'CEFIR',
    },
    {
      id: 'cmd-reposicao',
      category: 'Navegação',
      label: 'Reposição Florestal (CRF)',
      description: 'Créditos de reposição e plano de corte',
      route: 'reposicao-florestal',
      icon: Compass,
      badge: 'CRF',
    },
    {
      id: 'cmd-dtrp',
      category: 'Navegação',
      label: 'Transporte de Resíduos Perigosos (DTRP)',
      description: 'Declarações e manifestos de transporte',
      route: 'dtrp',
      icon: FileText,
      badge: 'DIFIS',
    },
    {
      id: 'cmd-consulta-difis',
      category: 'Navegação',
      label: 'Consultar Registros de Fiscalização',
      description: 'Painel interno de denúncias e autos de infração',
      route: 'consulta-interna',
      icon: ShieldAlert,
    },
    {
      id: 'cmd-parametrizacao',
      category: 'Navegação',
      label: 'Parametrizações & Tabelas Mestres',
      description: 'Tipologias, resíduos IBAMA, produtos ONU e setores',
      route: 'parametrizacao',
      icon: Sliders,
    },
    {
      id: 'cmd-admin',
      category: 'Navegação',
      label: 'Administração, Perfis RBAC & Auditoria',
      description: 'Gestão de usuários, papéis e audit log',
      route: 'usuarios-roles',
      icon: Settings,
    },
    {
      id: 'cmd-financeiro',
      category: 'Navegação',
      label: 'Financeiro, DAE & Parcelamento',
      description: 'Emissão de taxas, CND e acordos de dívida',
      route: 'seia-daes',
      icon: Landmark,
    },
    {
      id: 'cmd-parcelamento',
      category: 'Navegação',
      label: 'Parcelamento de Débitos e Multas',
      description: 'Simulação e emissão de parcelas de autos',
      route: 'parcelamento-debito',
      icon: Landmark,
    },
    {
      id: 'cmd-design-system',
      category: 'Navegação',
      label: 'Catálogo do Design System SEIA V2',
      description: 'Tokens, componentes e padrões de interface',
      route: 'design-system',
      icon: Layers,
      badge: 'V2',
    },
    {
      id: 'cmd-roteiro',
      category: 'Navegação',
      label: 'Roteiro de Apresentação & Mapeamento',
      description: 'Demonstração executiva dos fluxos SEIA V2',
      route: 'roteiro',
      icon: Layers,
    },

    // Processos Recentes
    {
      id: 'cmd-proc-1',
      category: 'Processos Recentes',
      label: 'REQ-2026-09124 — Agropecuária Vale Verde S.A.',
      description: 'Licença de Instalação (LI) + Outorga CERH • Barreiras/BA',
      route: 'enquadramento',
      icon: FileText,
      badge: 'Em Análise',
    },
    {
      id: 'cmd-proc-2',
      category: 'Processos Recentes',
      label: 'REQ-2026-09088 — Petroquímica Camaçari S.A.',
      description: 'Renovação de Licença de Operação (RLO) + DTRP',
      route: 'tabela',
      icon: FileText,
      badge: 'Pendente',
    },
    {
      id: 'cmd-proc-3',
      category: 'Processos Recentes',
      label: 'CRAS-BA-2026-00491 — Arara-azul-de-lear',
      description: 'Reabilitação e Treinamento de Voo • Canudos/BA',
      route: 'cras',
      icon: PawPrint,
      badge: 'Apto Soltura',
    },
  ];

  // Normalização para busca por aproximação insensível a acentos
  const normalizeSearchText = (text: string) =>
    (text || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();

  const filteredCommands = commands.filter((cmd) => {
    if (!query.trim()) return true;
    const q = normalizeSearchText(query);
    return (
      normalizeSearchText(cmd.label).includes(q) ||
      normalizeSearchText(cmd.category).includes(q) ||
      (cmd.description && normalizeSearchText(cmd.description).includes(q)) ||
      (cmd.badge && normalizeSearchText(cmd.badge).includes(q)) ||
      (cmd.route && normalizeSearchText(cmd.route).includes(q))
    );
  });

  const handleSelect = (cmd: CommandItem) => {
    onOpenChange(false);
    setQuery('');
    if (cmd.action) {
      cmd.action();
    } else if (cmd.route) {
      if (onNavigate) {
        onNavigate(cmd.route);
      } else {
        window.location.href = `/?rota=seia-v2&tela=${cmd.route}`;
      }
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1 < filteredCommands.length ? prev + 1 : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 >= 0 ? prev - 1 : filteredCommands.length - 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          handleSelect(filteredCommands[selectedIndex]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, selectedIndex, filteredCommands]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[94vw] sm:max-w-2xl max-h-[85vh] p-0 overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl rounded-2xl flex flex-col">
        {/* Header do Omnisearch */}
        <div className="flex items-center px-3.5 sm:px-4 py-3 sm:py-3.5 border-b border-slate-200 dark:border-slate-800 gap-2.5 sm:gap-3 shrink-0">
          <Search className="w-5 h-5 text-[#0F4C3A] dark:text-emerald-400 shrink-0" />
          <input
            type="text"
            placeholder="Digite para buscar telas, módulos, processos ou ações..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full text-sm bg-transparent border-none text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden"
          />
          <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono font-medium text-slate-500 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded">
            ESC
          </kbd>
        </div>

        {/* Lista de Resultados */}
        <div className="max-h-[380px] overflow-y-auto p-2 space-y-1">
          {filteredCommands.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-500">
              Nenhum resultado encontrado para <span className="font-semibold">"{query}"</span>
            </div>
          ) : (
            filteredCommands.map((cmd, idx) => {
              const Icon = cmd.icon;
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={cmd.id}
                  onClick={() => handleSelect(cmd)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-100 border border-emerald-200 dark:border-emerald-800/60'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        isSelected
                          ? 'bg-[#0F4C3A] text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold truncate">{cmd.label}</div>
                      {cmd.description && (
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                          {cmd.description}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 ml-3">
                    {cmd.badge && (
                      <Badge variant="primary" className="text-[10px] py-0 px-1.5">
                        {cmd.badge}
                      </Badge>
                    )}
                    <span className="text-[10px] text-slate-400 font-medium hidden sm:inline">
                      {cmd.category}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Rodapé Informativo */}
        <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="px-1 py-0.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-[10px] font-mono">
                ↑
              </kbd>{' '}
              <kbd className="px-1 py-0.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-[10px] font-mono">
                ↓
              </kbd>{' '}
              Navegar
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-[10px] font-mono">
                ↵
              </kbd>{' '}
              Selecionar
            </span>
          </div>
          <span className="font-mono text-[10px]">SEIA V2 Omnisearch</span>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GlobalCommandPalette;
