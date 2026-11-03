import React, { useState, useEffect } from 'react';
import { AsasListPage, PerfilDemonstrativoFauna } from './AsasListPage';
import { AsasRequerimentoPage } from './AsasRequerimentoPage';
import { AsasVistoriaPage } from './AsasVistoriaPage';
import { AsasDecisaoPage } from './AsasDecisaoPage';

export type AsasSubView = 'listagem' | 'requerimento' | 'vistoria' | 'decisao';

interface AsasModulePageProps {
  onNavigate?: (route: string, params?: Record<string, string>) => void;
}

export const AsasModulePage: React.FC<AsasModulePageProps> = ({ onNavigate }) => {
  const [subView, setSubView] = useState<AsasSubView>('listagem');
  const [selecionadoId, setSelecionadoId] = useState<string | undefined>(undefined);
  const [modoRequerimento, setModoRequerimento] = useState<'novo' | 'existente' | 'editar' | 'ver'>('novo');
  const [perfilAtivo, setPerfilAtivo] = useState<PerfilDemonstrativoFauna>('cgfau');

  // Sincronização com parâmetros de busca da URL
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const v = params.get('subview') as AsasSubView;
    const id = params.get('id');
    const m = params.get('modo') as 'novo' | 'existente' | 'editar' | 'ver';

    if (v && ['listagem', 'requerimento', 'vistoria', 'decisao'].includes(v)) {
      setSubView(v);
    }
    if (id) setSelecionadoId(id);
    if (m) setModoRequerimento(m);
  }, []);

  const handleAbrirRequerimento = (id?: string, modo: 'novo' | 'existente' | 'editar' | 'ver' = 'novo') => {
    setSelecionadoId(id);
    setModoRequerimento(modo);
    setSubView('requerimento');
  };

  const handleAbrirVistoria = (id: string) => {
    setSelecionadoId(id);
    setSubView('vistoria');
  };

  const handleAbrirDecisao = (id: string) => {
    setSelecionadoId(id);
    setSubView('decisao');
  };

  const handleVoltar = () => {
    setSubView('listagem');
    setSelecionadoId(undefined);
  };

  return (
    <div data-testid="modulo-fauna-asas-root">
      {subView === 'listagem' && (
        <AsasListPage
          onNavigate={onNavigate || (() => {})}
          onAbrirRequerimento={handleAbrirRequerimento}
          onAbrirVistoria={handleAbrirVistoria}
          onAbrirDecisao={handleAbrirDecisao}
          perfilAtivo={perfilAtivo}
          onTrocarPerfil={setPerfilAtivo}
        />
      )}

      {subView === 'requerimento' && (
        <AsasRequerimentoPage
          asasId={selecionadoId}
          modo={modoRequerimento}
          onVoltar={handleVoltar}
          perfilAtivo={perfilAtivo}
          onConcluido={handleVoltar}
        />
      )}

      {subView === 'vistoria' && selecionadoId && (
        <AsasVistoriaPage
          asasId={selecionadoId}
          onVoltar={handleVoltar}
          perfilAtivo={perfilAtivo}
          onConcluido={handleVoltar}
        />
      )}

      {subView === 'decisao' && selecionadoId && (
        <AsasDecisaoPage
          asasId={selecionadoId}
          onVoltar={handleVoltar}
          perfilAtivo={perfilAtivo}
          onConcluido={handleVoltar}
        />
      )}
    </div>
  );
};
