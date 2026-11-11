import React, { useState, useEffect, useMemo } from 'react';
import {
  SignableDocument,
  SignatureStepConfig,
  SimulatedUser,
} from '@/types/signature';
import {
  getStoredDocuments,
  saveStoredDocuments,
  getStoredStepConfigs,
  saveStoredStepConfigs,
  getActiveSimulatedUser,
  setActiveSimulatedUser,
  resetSignatureState,
  SIMULATED_USERS,
} from '@/data/signatureMock';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FilamentTabs, FilamentTabItem } from '@/components/filament/Tabs';
import { TableContainer, TableToolbar } from '@/components/filament/Table';
import { FilamentSelect } from '@/components/filament/Select';
import { SignModal } from '@/components/signature/SignModal';
import { RefuseModal } from '@/components/signature/RefuseModal';
import { AddSignerModal } from '@/components/signature/AddSignerModal';
import { CancelSignatureModal } from '@/components/signature/CancelSignatureModal';
import { SignerManagementDrawer } from '@/components/signature/SignerManagementDrawer';
import { SignedDocumentViewModal } from '@/components/signature/SignedDocumentViewModal';
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  XCircle,
  Users,
  UserCheck,
  Sliders,
  RotateCcw,
  ExternalLink,
  Plus,
  Eye,
  Info,
  FileText,
} from 'lucide-react';

interface SignatureWorkspacePageProps {
  initialTab?: 'a-assinar' | 'todos' | 'parametrizacao';
  onNavigate?: (route: string) => void;
}

export const SignatureWorkspacePage: React.FC<SignatureWorkspacePageProps> = ({
  initialTab = 'a-assinar',
  onNavigate,
}) => {
  const [activeTab, setActiveTab] = useState<string>(initialTab);

  // Sincronização de aba com query param 'aba' e histórico (UX03)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlAba = params.get('aba');
      if (urlAba === 'parametrizacao') {
        setActiveTab('parametrizacao');
      } else if (urlAba === 'todos') {
        setActiveTab('todos');
      } else if (urlAba === 'a-assinar') {
        setActiveTab('a-assinar');
      } else if (initialTab) {
        setActiveTab(initialTab);
      }
    }
  }, [initialTab]);

  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const urlAba = params.get('aba');
      const rota = params.get('rota');
      if (urlAba === 'parametrizacao') {
        setActiveTab('parametrizacao');
      } else if (rota === 'a-assinar' || urlAba === 'a-assinar') {
        setActiveTab('a-assinar');
      } else if (rota === 'assinatura-eletronica' || urlAba === 'todos') {
        setActiveTab('todos');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (tabId === 'a-assinar') {
        url.searchParams.set('rota', 'a-assinar');
        url.searchParams.delete('aba');
      } else if (tabId === 'todos') {
        url.searchParams.set('rota', 'assinatura-eletronica');
        url.searchParams.delete('aba');
      } else if (tabId === 'parametrizacao') {
        url.searchParams.set('rota', 'assinatura-eletronica');
        url.searchParams.set('aba', 'parametrizacao');
      }
      url.searchParams.set('escopo', 'assinatura-eletronica');
      window.history.pushState({}, '', url.toString());
    }
    if (onNavigate) {
      if (tabId === 'a-assinar') {
        onNavigate('a-assinar');
      } else {
        onNavigate('assinatura-eletronica');
      }
    }
  };
  const [activeUser, setActiveUserState] = useState<SimulatedUser>(getActiveSimulatedUser());
  const [documents, setDocuments] = useState<SignableDocument[]>(getStoredDocuments());
  const [configs, setConfigs] = useState<SignatureStepConfig[]>(getStoredStepConfigs());
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [flowFilter, setFlowFilter] = useState('todos');

  // Estado dos Modais
  const [selectedDocForSign, setSelectedDocForSign] = useState<SignableDocument | null>(null);
  const [selectedDocForRefuse, setSelectedDocForRefuse] = useState<SignableDocument | null>(null);
  const [selectedDocForManage, setSelectedDocForManage] = useState<SignableDocument | null>(null);
  const [selectedDocForAddSigner, setSelectedDocForAddSigner] = useState<SignableDocument | null>(null);
  const [selectedDocForCancel, setSelectedDocForCancel] = useState<SignableDocument | null>(null);
  const [selectedDocForView, setSelectedDocForView] = useState<SignableDocument | null>(null);

  // Escuta eventos de atualização de dados locais
  useEffect(() => {
    const handleUpdate = () => {
      setDocuments(getStoredDocuments());
      setConfigs(getStoredStepConfigs());
      setActiveUserState(getActiveSimulatedUser());
    };

    window.addEventListener('seia-signature-updated', handleUpdate);
    window.addEventListener('seia-signature-configs-updated', handleUpdate);
    window.addEventListener('seia-signature-user-changed', handleUpdate);

    return () => {
      window.removeEventListener('seia-signature-updated', handleUpdate);
      window.removeEventListener('seia-signature-configs-updated', handleUpdate);
      window.removeEventListener('seia-signature-user-changed', handleUpdate);
    };
  }, []);

  // Alterna usuário simulado
  const handleUserChange = (userId: string) => {
    const user = SIMULATED_USERS.find((u) => u.id === userId) || SIMULATED_USERS[0];
    setActiveSimulatedUser(user);
    setActiveUserState(user);
  };

  // Opções para o FilamentSelect do Perfil Ativo
  const profileOptions = useMemo(
    () =>
      SIMULATED_USERS.map((u) => ({
        value: u.id,
        label: `${u.nome} (${u.papel === 'terceirizado' ? 'Terceirizado' : u.cargo.split(' ')[0]})`,
        description: `${u.cargo} • Matrícula: ${u.matricula}`,
      })),
    []
  );

  // Ação de Assinar (Formalização da assinatura com fuso America/Sao_Paulo e desbloqueio sequencial estrito)
  const handleConfirmSign = (docId: string, signerMatricula: string) => {
    const updated = documents.map((doc) => {
      if (doc.id !== docId) return doc;

      // Data e hora com fuso horário explícito de Brasília
      const now = new Date();
      const dateStr = now.toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' });
      const timeStr = now.toLocaleTimeString('pt-BR', {
        timeZone: 'America/Sao_Paulo',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });

      // Identifica o signatário que está assinando para obter sua ordem
      const currentSigning = doc.signatarios.find((s) => s.matricula === signerMatricula);
      const signedOrder = currentSigning?.ordem ?? 1;
      const nextOrder = signedOrder + 1;

      const newSignatarios = doc.signatarios.map((sig) => {
        if (sig.matricula === signerMatricula) {
          return {
            ...sig,
            status: 'assinado' as const,
            dataAssinatura: dateStr,
            horaAssinatura: timeStr,
            ipHash: '177.20.14.88 (Proxy INEMA)',
          };
        }
        // Desbloqueia EXCLUSIVAMENTE a próxima ordem sequencial (Item 5 do prompt)
        if (doc.ordemTipo === 'sequencial' && sig.ordem === nextOrder && sig.status === 'bloqueado_ordem') {
          return {
            ...sig,
            status: 'pendente' as const,
          };
        }
        // Ordens posteriores (ex: ordem 3, 4...) permanecem bloqueadas
        return sig;
      });

      const allSigned = newSignatarios.every((s) => s.status === 'assinado');
      const anyRefused = newSignatarios.some((s) => s.status === 'recusado');

      const newHistorico = [
        ...doc.historico,
        {
          id: `h-${Date.now()}`,
          dataHora: `${dateStr} ${timeStr}`,
          autorNome: activeUser.nome,
          autorCargo: activeUser.cargo,
          tipo: 'assinatura' as const,
          descricao: `Documento assinado eletronicamente por ${activeUser.nome} (${activeUser.cargo}) no Horário Oficial de Brasília.`,
          mensagemCodigo: 'MSG002',
        },
      ];

      return {
        ...doc,
        signatarios: newSignatarios,
        statusGeral: allSigned
          ? ('concluido' as const)
          : anyRefused
          ? ('recusado' as const)
          : ('em_assinatura' as const),
        historico: newHistorico,
      };
    });

    saveStoredDocuments(updated);
    setDocuments(updated);
  };

  // Ação de Recusa Fundamentada
  const handleConfirmRefuse = (docId: string, signerMatricula: string, reason: string) => {
    const updated = documents.map((doc) => {
      if (doc.id !== docId) return doc;

      const now = new Date();
      const dateStr = now.toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' });
      const timeStr = now.toLocaleTimeString('pt-BR', {
        timeZone: 'America/Sao_Paulo',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });

      const newSignatarios = doc.signatarios.map((sig) => {
        if (sig.matricula === signerMatricula) {
          return {
            ...sig,
            status: 'recusado' as const,
            justificativaRecusa: reason,
          };
        }
        return sig;
      });

      const newHistorico = [
        ...doc.historico,
        {
          id: `h-${Date.now()}`,
          dataHora: `${dateStr} ${timeStr}`,
          autorNome: activeUser.nome,
          autorCargo: activeUser.cargo,
          tipo: 'recusa' as const,
          descricao: `Assinatura recusada fundamentadamente: "${reason}". Notificação simulada enviada ao autor da minuta.`,
          mensagemCodigo: 'MSG005',
          detalhe: reason,
        },
      ];

      return {
        ...doc,
        signatarios: newSignatarios,
        statusGeral: 'recusado' as const,
        historico: newHistorico,
      };
    });

    saveStoredDocuments(updated);
    setDocuments(updated);
  };

  // Adicionar Signatário
  const handleAddSigner = (docId: string, newSignerData: any) => {
    const updated = documents.map((doc) => {
      if (doc.id !== docId) return doc;

      const now = new Date();
      const dateStr = now.toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' });
      const timeStr = now.toLocaleTimeString('pt-BR', {
        timeZone: 'America/Sao_Paulo',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });

      const newSigner = {
        ...newSignerData,
        id: `sig-${Date.now()}`,
      };

      const newHistorico = [
        ...doc.historico,
        {
          id: `h-${Date.now()}`,
          dataHora: `${dateStr} ${timeStr}`,
          autorNome: activeUser.nome,
          autorCargo: activeUser.cargo,
          tipo: 'adicao_signatario' as const,
          descricao: `Novo signatário adicionado: ${newSigner.nome} (${newSigner.cargo}) na ordem ${newSigner.ordem}.`,
          mensagemCodigo: 'MSG010',
        },
      ];

      return {
        ...doc,
        signatarios: [...doc.signatarios, newSigner],
        historico: newHistorico,
      };
    });

    saveStoredDocuments(updated);
    setDocuments(updated);
  };

  // Cancelar Solicitação (Preserva os eventos originais das assinaturas já realizadas — Item 5)
  const handleConfirmCancel = (docId: string, reason: string) => {
    const updated = documents.map((doc) => {
      if (doc.id !== docId) return doc;

      const now = new Date();
      const dateStr = now.toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' });
      const timeStr = now.toLocaleTimeString('pt-BR', {
        timeZone: 'America/Sao_Paulo',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });

      // Preserva quem já assinou com seus metadados originais; marca apenas os pendentes como cancelados
      const newSignatarios = doc.signatarios.map((s) => {
        if (s.status === 'assinado') {
          return s; // Mantém integridade do ato assinado antes do cancelamento
        }
        return {
          ...s,
          status: 'cancelado' as const,
        };
      });

      const newHistorico = [
        ...doc.historico,
        {
          id: `h-${Date.now()}`,
          dataHora: `${dateStr} ${timeStr}`,
          autorNome: activeUser.nome,
          autorCargo: activeUser.cargo,
          tipo: 'cancelamento' as const,
          descricao: `Solicitação de assinatura cancelada: "${reason}". Assinaturas previamente registradas permanecem no histórico demonstrativo.`,
          mensagemCodigo: 'MSG007',
          detalhe: reason,
        },
      ];

      return {
        ...doc,
        statusGeral: 'cancelado' as const,
        signatarios: newSignatarios,
        historico: newHistorico,
      };
    });

    saveStoredDocuments(updated);
    setDocuments(updated);
  };

  // Documentos pendentes para o usuário ativo (Pauta "A Assinar")
  const pendingForActiveUser = documents.filter((doc) => {
    const signer = doc.signatarios.find(
      (s) => s.matricula === activeUser.matricula || s.nome.toLowerCase() === activeUser.nome.toLowerCase()
    );
    return signer && (signer.status === 'pendente' || signer.status === 'bloqueado_ordem');
  });

  // Filtros para aba de todos os documentos
  const filteredAllDocs = documents.filter((doc) => {
    const matchSearch =
      !searchQuery ||
      [doc.numeroProcesso, doc.tipoDocumento, doc.requerente, doc.municipio, doc.codigoVerificador]
        .join(' ')
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

    const matchStatus =
      statusFilter === 'todos' ||
      (statusFilter === 'pendente' && (doc.statusGeral === 'pendente' || doc.statusGeral === 'em_assinatura')) ||
      (statusFilter === 'concluido' && doc.statusGeral === 'concluido') ||
      (statusFilter === 'recusado' && doc.statusGeral === 'recusado') ||
      (statusFilter === 'cancelado' && doc.statusGeral === 'cancelado');

    const matchFlow = flowFilter === 'todos' || doc.fluxo === flowFilter;

    return matchSearch && matchStatus && matchFlow;
  });

  const tabs: FilamentTabItem[] = [
    {
      id: 'a-assinar',
      label: 'A Assinar',
      badge: String(pendingForActiveUser.length),
      badgeVariant: pendingForActiveUser.length > 0 ? 'rose' : 'gray',
    },
    {
      id: 'todos',
      label: 'Documentos & Atos',
      badge: String(documents.length),
      badgeVariant: 'gray',
    },
    {
      id: 'parametrizacao',
      label: 'Parametrização por Etapa',
      badge: String(configs.length),
      badgeVariant: 'primary',
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Topbar Institucional do Módulo — Anti-AI-Slop e Alinhamento Visual (UX01) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              {activeTab === 'a-assinar'
                ? 'A Assinar'
                : activeTab === 'todos'
                ? 'Documentos & Atos'
                : 'Parametrização por Etapa'}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-2xl">
              Gestão e colheita de assinaturas eletrônicas integradas às etapas processuais do SEIA.
            </p>
          </div>

          {/* Controles de Perfil e Ações Demonstrativas */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            <div className="w-full sm:w-64">
              <FilamentSelect
                value={activeUser.id}
                onChange={handleUserChange}
                ariaLabel="Perfil Demonstrativo Ativo"
                options={profileOptions}
              />
            </div>

            <div className="flex items-center gap-2 justify-end flex-shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={resetSignatureState}
                title="Restaurar cenários originais de teste"
                className="text-xs h-9 px-3 text-slate-600 hover:text-slate-900"
              >
                <RotateCcw className="w-3.5 h-3.5 mr-1" />
                <span>Reiniciar cenário</span>
              </Button>

              <a
                href="/?rota=autenticidade-documento"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs text-[#0F4C3A] hover:underline font-semibold dark:text-emerald-400 px-2.5 py-1.5"
              >
                <span>Consulta Pública</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Faixa Informativa do Usuário Ativo */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-600 dark:text-slate-300 gap-2">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
            <span className="font-semibold text-slate-900 dark:text-slate-100">{activeUser.nome}</span>
            <span className="hidden sm:inline text-slate-400">•</span>
            <div className="text-slate-500 text-[11px] sm:text-xs">
              {activeUser.cargo} • Matrícula <span className="font-mono">{activeUser.matricula}</span>
            </div>
          </div>

          <div className="self-start sm:self-auto">
            {activeUser.tipoVinculo === 'terceirizado' ? (
              <Badge color="danger" size="xs">
                Terceirizado: Ação "Assinar" Bloqueada (MSG021)
              </Badge>
            ) : activeUser.ehSuplente ? (
              <Badge color="warning" size="xs">
                Suplente Ativa em Vigência (RN-VIG)
              </Badge>
            ) : (
              <Badge color="success" size="xs">
                Servidor Titular Habilitado
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Navegação por Abas com Rolagem Horizontal Suave (Item 1 do prompt) */}
      <div className="border-b border-slate-200 dark:border-slate-800 overflow-x-auto no-scrollbar">
        <div className="min-w-[480px]">
          <FilamentTabs
            items={tabs}
            activeTab={activeTab}
            onChange={handleTabChange}
          />
        </div>
      </div>

      {/* =========================================================================
          ABA 1: A ASSINAR (PENDÊNCIAS DO USUÁRIO LOGADO)
         ========================================================================= */}
      {activeTab === 'a-assinar' && (
        <div className="space-y-4">
          <TableContainer
            stableHeight={false}
            toolbar={
              <TableToolbar
                searchValue={searchQuery}
                onSearchChange={setSearchQuery}
                searchPlaceholder="Buscar documento pendente por processo, requerente ou código..."
                actions={
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">
                      Total pendente: <strong>{pendingForActiveUser.length}</strong>
                    </span>
                  </div>
                }
              />
            }
          >
            {pendingForActiveUser.length === 0 ? (
              <div className="p-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-[#0F4C3A] dark:text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Nenhuma pendência de assinatura para este perfil
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Todos os atos atribuídos a {activeUser.nome} já foram assinados ou não há novos processos
                  aguardando sua deliberação no momento.
                </p>
                <div className="pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveTab('todos')}
                    className="text-xs h-8"
                  >
                    Ver Todos os Documentos do Sistema
                  </Button>
                </div>
              </div>
            ) : (
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
                    <th className="py-3 px-4">Processo Administrativo</th>
                    <th className="py-3 px-4">Documento / Ato Oficial</th>
                    <th className="py-3 px-4">Fluxo & Etapa</th>
                    <th className="py-3 px-4">Requerente / Local</th>
                    <th className="py-3 px-4">Ordem & Status</th>
                    <th className="py-3 px-4 text-right">Ações Disponíveis</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {pendingForActiveUser.map((doc) => {
                    const mySigner = doc.signatarios.find(
                      (s) => s.matricula === activeUser.matricula || s.nome.toLowerCase() === activeUser.nome.toLowerCase()
                    );
                    const isBlocked = mySigner?.status === 'bloqueado_ordem';

                    return (
                      <tr
                        key={doc.id}
                        className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                      >
                        <td className="py-3 px-4 font-mono font-semibold text-slate-900 dark:text-slate-100">
                          <div className="flex items-center gap-1.5">
                            {doc.urgente && (
                              <span className="w-2 h-2 rounded-full bg-rose-500" title="Urgente" />
                            )}
                            <span>{doc.numeroProcesso}</span>
                          </div>
                          <div className="text-[10px] text-slate-400 font-sans font-normal pt-0.5">
                            Criado em {doc.dataCriacao}
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-900 dark:text-slate-100">
                            {doc.tipoDocumento}
                          </div>
                          <div className="text-[11px] text-slate-500 line-clamp-1">{doc.titulo}</div>
                        </td>

                        <td className="py-3 px-4">
                          <div className="font-medium text-slate-800 dark:text-slate-200">{doc.fluxoNome}</div>
                          <div className="text-[11px] text-slate-500">{doc.etapaAtual}</div>
                        </td>

                        <td className="py-3 px-4">
                          <div className="font-medium text-slate-800 dark:text-slate-200">{doc.requerente}</div>
                          <div className="text-[11px] text-slate-500">{doc.municipio}</div>
                        </td>

                        <td className="py-3 px-4">
                          <div className="space-y-1">
                            {isBlocked ? (
                              <Badge color="gray" size="xs">
                                Aguardando Ordem {mySigner ? mySigner.ordem - 1 : 1}
                              </Badge>
                            ) : (
                              <Badge color="warning" dot size="xs">
                                Pendente de Sua Assinatura
                              </Badge>
                            )}
                            <div className="text-[10px] text-slate-400">
                              Ordem {doc.ordemTipo === 'sequencial' ? 'Sequencial' : 'Indiferente'}
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              size="sm"
                              onClick={() => setSelectedDocForSign(doc)}
                              disabled={isBlocked || activeUser.tipoVinculo === 'terceirizado'}
                              title={
                                activeUser.tipoVinculo === 'terceirizado'
                                  ? 'Terceirizado não possui fé pública para assinar (MSG021)'
                                  : isBlocked
                                  ? 'Aguardando ordem sequencial anterior (MSG004)'
                                  : 'Assinar documento eletronicamente'
                              }
                              className="bg-[#0F4C3A] hover:bg-[#0c3d2e] text-white text-xs h-7 px-2.5 font-semibold"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                              <span>Assinar</span>
                            </Button>

                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedDocForRefuse(doc)}
                              className="text-xs h-7 px-2 text-rose-700 hover:bg-rose-50 border-rose-200"
                              title="Recusar assinatura com justificativa fundamentada"
                            >
                              <XCircle className="w-3.5 h-3.5 mr-1" />
                              <span>Recusar</span>
                            </Button>

                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedDocForManage(doc)}
                              className="text-xs h-7 px-2 text-slate-700 dark:text-slate-300"
                              title="Ver signatários e trilha de eventos"
                            >
                              <Users className="w-3.5 h-3.5" />
                            </Button>

                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedDocForView(doc)}
                              className="text-xs h-7 px-2 text-slate-700 dark:text-slate-300"
                              title="Visualizar documento A4"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </TableContainer>
        </div>
      )}

      {/* =========================================================================
          ABA 2: TODOS OS DOCUMENTOS DO SISTEMA
         ========================================================================= */}
      {activeTab === 'todos' && (
        <div className="space-y-4">
          <TableContainer
            toolbar={
              <TableToolbar
                searchValue={searchQuery}
                onSearchChange={setSearchQuery}
                searchPlaceholder="Buscar por processo, documento, código verificador ou requerente..."
                actions={
                  <div className="flex flex-wrap items-center gap-2">
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0F4C3A]"
                    >
                      <option value="todos">Todos os Status</option>
                      <option value="pendente">Em Andamento / Pendente</option>
                      <option value="concluido">Concluído / Assinado</option>
                      <option value="recusado">Recusado</option>
                      <option value="cancelado">Cancelado</option>
                    </select>

                    <select
                      value={flowFilter}
                      onChange={(e) => setFlowFilter(e.target.value)}
                      className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0F4C3A]"
                    >
                      <option value="todos">Todos os Fluxos</option>
                      <option value="regulacao_ansla">Regulação / ANSLA</option>
                      <option value="fiscalizacao_rfa">Fiscalização / RFA</option>
                      <option value="fiscalizacao_rae">Fiscalização / RAE</option>
                      <option value="recursos_hidricos_cerh">Recursos Hídricos / CERH</option>
                      <option value="biodiversidade_uc">Biodiversidade & UCs</option>
                    </select>
                  </div>
                }
              />
            }
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[800px]">
                <thead>
                <tr className="bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
                  <th className="py-3 px-4">Processo Administrativo</th>
                  <th className="py-3 px-4">Tipo de Documento</th>
                  <th className="py-3 px-4">Fluxo / Área</th>
                  <th className="py-3 px-4">Signatários ({'assinado'}/{'total'})</th>
                  <th className="py-3 px-4">Código Verificador</th>
                  <th className="py-3 px-4">Status Geral</th>
                  <th className="py-3 px-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredAllDocs.map((doc) => {
                  const signedCount = doc.signatarios.filter((s) => s.status === 'assinado').length;
                  const totalCount = doc.signatarios.length;

                  return (
                    <tr
                      key={doc.id}
                      className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-3 px-4 font-mono font-semibold text-slate-900 dark:text-slate-100">
                        {doc.numeroProcesso}
                        <div className="text-[10px] text-slate-400 font-sans font-normal pt-0.5">
                          {doc.requerente}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900 dark:text-slate-100">
                          {doc.tipoDocumento}
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono">{doc.codigoDocumento}</div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-medium text-slate-800 dark:text-slate-200">{doc.fluxoNome}</div>
                        <div className="text-[11px] text-slate-500">{doc.etapaAtual}</div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-800 dark:text-slate-200">
                          {signedCount} de {totalCount} assinados
                        </div>
                        <div className="text-[10px] text-slate-400">
                          Ordem {doc.ordemTipo === 'sequencial' ? 'Sequencial' : 'Indiferente'}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-mono bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 font-bold select-all">
                          {doc.codigoVerificador}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <Badge
                          color={
                            doc.statusGeral === 'concluido'
                              ? 'success'
                              : doc.statusGeral === 'recusado'
                              ? 'danger'
                              : doc.statusGeral === 'cancelado'
                              ? 'gray'
                              : 'warning'
                          }
                          dot
                          size="xs"
                        >
                          {doc.statusGeral === 'concluido'
                            ? 'Concluído'
                            : doc.statusGeral === 'recusado'
                            ? 'Recusado'
                            : doc.statusGeral === 'cancelado'
                            ? 'Cancelado'
                            : 'Em Assinatura'}
                        </Badge>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedDocForView(doc)}
                            className="text-xs h-7 px-2.5 text-slate-700 dark:text-slate-300 whitespace-nowrap"
                            title="Visualizar documento oficial A4"
                          >
                            <FileText className="w-3.5 h-3.5 mr-1 text-[#0F4C3A]" />
                            <span>Ver A4</span>
                          </Button>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedDocForManage(doc)}
                            className="text-xs h-7 px-2 text-slate-700 dark:text-slate-300"
                            title="Gestão de signatários e histórico"
                          >
                            <Users className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            </div>
          </TableContainer>
        </div>
      )}

      {/* ======
          ABA 3: PARAMETRIZAÇÃO POR ETAPA, DOCUMENTO E SIGNATÁRIO
         ========================================================================= */}
      {activeTab === 'parametrizacao' && (
        <div className="space-y-6">
          <div className="bg-slate-50 dark:bg-slate-850 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 space-y-1">
            <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-[#0F4C3A]" />
              <span>Parametrização por Etapa, Documento e Signatário (SEIA V2)</span>
            </div>
            <p className="leading-relaxed">
              Matriz demonstrativa que relaciona fluxo, etapa da tramitação, modelo documental, titularidade,
              suplência e vigência. A ação de assinar responde dinamicamente a esta parametrização.
            </p>
          </div>

          <TableContainer
            toolbar={
              <TableToolbar
                searchValue={searchQuery}
                onSearchChange={setSearchQuery}
                searchPlaceholder="Buscar por fluxo, etapa, documento ou responsável..."
                actions={
                  <Button
                    onClick={() => {
                      alert('Cadastro de nova regra aberta para homologação com Thays e Matheus.');
                    }}
                    className="bg-[#0F4C3A] hover:bg-[#0c3d2e] text-white text-xs h-8 font-semibold"
                  >
                    <Plus className="w-3.5 h-3.5 mr-1" />
                    <span>Nova Regra de Assinatura</span>
                  </Button>
                }
              />
            }
          >
            <div className="overflow-x-auto"><table className="w-full text-left text-xs min-w-[760px]">
              <thead>
                <tr className="bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
                  <th className="py-3 px-4">Fluxo / Área</th>
                  <th className="py-3 px-4">Etapa da Tramitação</th>
                  <th className="py-3 px-4">Tipo de Documento</th>
                  <th className="py-3 px-4">Exigência</th>
                  <th className="py-3 px-4">Papel & Titular</th>
                  <th className="py-3 px-4">Suplente & Vigência</th>
                  <th className="py-3 px-4">Ordem</th>
                  <th className="py-3 px-4 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {configs.map((cfg) => (
                  <tr
                    key={cfg.id}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3 px-4 font-semibold text-slate-900 dark:text-slate-100">
                      {cfg.fluxoNome}
                      <div className="text-[10px] text-slate-400 font-mono font-normal">{cfg.id}</div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800 dark:text-slate-200">{cfg.etapaNome}</div>
                      <div className="text-[11px] text-slate-500 line-clamp-1">{cfg.descricaoRegra}</div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900 dark:text-slate-100">
                        {cfg.tipoDocumentoNome}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">{cfg.tipoDocumentoCodigo}</div>
                    </td>

                    <td className="py-3 px-4">
                      <Badge
                        color={cfg.exigenciaAssinatura === 'obrigatoria' ? 'success' : 'gray'}
                        dot
                        size="xs"
                      >
                        {cfg.exigenciaAssinatura === 'obrigatoria' ? 'Obrigatória' : 'Opcional'}
                      </Badge>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900 dark:text-slate-100">
                        {cfg.responsavelTitularNome}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {cfg.papelNome} • Matr. <span className="font-mono">{cfg.responsavelTitularMatricula}</span>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      {cfg.responsavelSuplenteNome ? (
                        <div>
                          <div className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                            <span>{cfg.responsavelSuplenteNome}</span>
                            {cfg.suplenteAtivo && (
                              <Badge color="warning" size="xs">
                                Ativo
                              </Badge>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-500">
                            Vigência: {cfg.vigenciaInicio} a {cfg.vigenciaFim}
                          </div>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Sem suplente cadastrado</span>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <Badge color="primary" size="xs">
                        {cfg.tipoOrdemPadrao === 'sequencial' ? 'Sequencial' : 'Indiferente'}
                      </Badge>
                      <div className="text-[10px] text-slate-400 pt-0.5">
                        {cfg.quantidadeSignatariosPadrao} signatário(s)
                      </div>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const updated = configs.map((c) =>
                            c.id === cfg.id ? { ...c, suplenteAtivo: !c.suplenteAtivo } : c
                          );
                          saveStoredStepConfigs(updated);
                          setConfigs(updated);
                        }}
                        className="text-xs h-7 px-2 text-slate-700"
                        title="Alternar vigência do suplente"
                      >
                        {cfg.suplenteAtivo ? 'Desativar Suplente' : 'Ativar Suplente'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </TableContainer>
        </div>
      )}

      {/* =========================================================================
          MODAIS E DRAWERS DE INTERAÇÃO
         ========================================================================= */}
      <SignModal
        open={Boolean(selectedDocForSign)}
        onOpenChange={(open) => !open && setSelectedDocForSign(null)}
        document={selectedDocForSign}
        activeUser={activeUser}
        onConfirmSign={handleConfirmSign}
      />

      <RefuseModal
        open={Boolean(selectedDocForRefuse)}
        onOpenChange={(open) => !open && setSelectedDocForRefuse(null)}
        document={selectedDocForRefuse}
        activeUser={activeUser}
        onConfirmRefuse={handleConfirmRefuse}
      />

      <AddSignerModal
        open={Boolean(selectedDocForAddSigner)}
        onOpenChange={(open) => !open && setSelectedDocForAddSigner(null)}
        document={selectedDocForAddSigner}
        onAddSigner={handleAddSigner}
      />

      <CancelSignatureModal
        open={Boolean(selectedDocForCancel)}
        onOpenChange={(open) => !open && setSelectedDocForCancel(null)}
        document={selectedDocForCancel}
        onConfirmCancel={handleConfirmCancel}
      />

      <SignerManagementDrawer
        open={Boolean(selectedDocForManage)}
        onOpenChange={(open) => !open && setSelectedDocForManage(null)}
        document={selectedDocForManage}
        activeUser={activeUser}
        onOpenAddSigner={() => setSelectedDocForAddSigner(selectedDocForManage)}
        onOpenCancel={() => setSelectedDocForCancel(selectedDocForManage)}
        onOpenSign={() => setSelectedDocForSign(selectedDocForManage)}
        onOpenRefuse={() => setSelectedDocForRefuse(selectedDocForManage)}
        onOpenViewDocument={() => setSelectedDocForView(selectedDocForManage)}
      />

      <SignedDocumentViewModal
        open={Boolean(selectedDocForView)}
        onOpenChange={(open) => !open && setSelectedDocForView(null)}
        document={selectedDocForView}
      />
    </div>
  );
};
