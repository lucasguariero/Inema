import React, { useState, useEffect } from 'react';
import { GuardiaoListPage, GuardiaoSubView } from './GuardiaoListPage';
import { GuardiaoRequerimentoPage } from './GuardiaoRequerimentoPage';
import { GuardiaoAnaliseVistoriaPage } from './GuardiaoAnaliseVistoriaPage';
import { GuardiaoVinculoTgasPage } from './GuardiaoVinculoTgasPage';
import { GuardiaoAcompanhamentoPage } from './GuardiaoAcompanhamentoPage';
import { GuardiaoEncerramentoPage } from './GuardiaoEncerramentoPage';

interface GuardiaoModulePageProps {
  onNavigate?: (route: string, params?: Record<string, string>) => void;
}

export const GuardiaoModulePage: React.FC<GuardiaoModulePageProps> = ({ onNavigate }) => {
  const [subView, setSubView] = useState<GuardiaoSubView>('listagem');
  const [selecionadoId, setSelecionadoId] = useState<string | undefined>(undefined);
  const [perfilAtivo, setPerfilAtivo] = useState<'cgfau' | 'cetas' | 'requerente'>('cgfau');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const v = params.get('subview') as GuardiaoSubView;
    const id = params.get('id');

    if (v && ['listagem', 'requerimento', 'analise-vistoria', 'vinculo-tgas', 'acompanhamento', 'encerramento'].includes(v)) {
      setSubView(v);
    }
    if (id) setSelecionadoId(id);
  }, []);

  const handleAbrirSubView = (novaSubView: GuardiaoSubView, id?: string) => {
    setSelecionadoId(id);
    setSubView(novaSubView);
  };

  const handleVoltar = () => {
    setSubView('listagem');
    setSelecionadoId(undefined);
  };

  return (
    <div data-testid="modulo-fauna-guardiao-root">
      {subView === 'listagem' && (
        <GuardiaoListPage
          onAbrirSubView={handleAbrirSubView}
          perfilAtivo={perfilAtivo}
          onTrocarPerfil={setPerfilAtivo}
        />
      )}

      {subView === 'requerimento' && (
        <GuardiaoRequerimentoPage
          guardiaoId={selecionadoId}
          onVoltar={handleVoltar}
          perfilAtivo={perfilAtivo}
          onConcluido={handleVoltar}
        />
      )}

      {subView === 'analise-vistoria' && selecionadoId && (
        <GuardiaoAnaliseVistoriaPage
          guardiaoId={selecionadoId}
          onVoltar={handleVoltar}
          perfilAtivo={perfilAtivo}
          onConcluido={handleVoltar}
        />
      )}

      {subView === 'vinculo-tgas' && selecionadoId && (
        <GuardiaoVinculoTgasPage
          guardiaoId={selecionadoId}
          onVoltar={handleVoltar}
          perfilAtivo={perfilAtivo}
          onConcluido={handleVoltar}
        />
      )}

      {subView === 'acompanhamento' && selecionadoId && (
        <GuardiaoAcompanhamentoPage
          guardiaoId={selecionadoId}
          onVoltar={handleVoltar}
          perfilAtivo={perfilAtivo}
          onConcluido={handleVoltar}
        />
      )}

      {subView === 'encerramento' && selecionadoId && (
        <GuardiaoEncerramentoPage
          guardiaoId={selecionadoId}
          onVoltar={handleVoltar}
          perfilAtivo={perfilAtivo}
          onConcluido={handleVoltar}
        />
      )}
    </div>
  );
};
