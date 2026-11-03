import React, { useState, useMemo, useEffect } from 'react';
import {
  MapPin,
  Layers,
  Filter,
  Download,
  Search,
  Calendar,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  X,
  ExternalLink,
  ShieldCheck,
  ShieldAlert,
  TreePine,
  Activity,
  FileSpreadsheet,
  FileText,
  UserCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { InputWrapper } from '@/components/filament/InputWrapper';
import { AsasItem, CamadasMapaAsas, CategoriaAsas, SituacaoAsas } from '@/types/faunaR3R4';
import { getAsasList, subscribeFaunaR3R4 } from '@/data/faunaR3R4Mock';
import { BahiaFaunaMap } from './BahiaFaunaMap';
import { PerfilDemonstrativoFauna } from './AsasListPage';

interface MapaAsasDestinacoesPageProps {
  onNavigate?: (route: string, params?: Record<string, string>) => void;
  perfilAtivo?: PerfilDemonstrativoFauna;
  onTrocarPerfil?: (p: PerfilDemonstrativoFauna) => void;
}

export const MapaAsasDestinacoesPage: React.FC<MapaAsasDestinacoesPageProps> = ({
  onNavigate,
  perfilAtivo: perfilProp = 'cgfau',
  onTrocarPerfil
}) => {
  const [perfilLocal, setPerfilLocal] = useState<PerfilDemonstrativoFauna>(perfilProp);
  const perfil = onTrocarPerfil ? perfilProp : perfilLocal;

  const [items, setItems] = useState<AsasItem[]>([]);
  const [selectedAsas, setSelectedAsas] = useState<AsasItem | undefined>(undefined);
  const [drawerAberto, setDrawerAberto] = useState<boolean>(false);
  const [abaFicha, setAbaFicha] = useState<'geral' | 'solturas'>('geral');

  // Filtros Avançados
  const [busca, setBusca] = useState<string>('');
  const [filtroSituacoes, setFiltroSituacoes] = useState<string[]>([]);
  const [filtroCategoria, setFiltroCategoria] = useState<string>('todas');
  const [filtroUr, setFiltroUr] = useState<string>('todas');
  const [filtroMunicipio, setFiltroMunicipio] = useState<string>('todos');
  const [filtroGrupo, setFiltroGrupo] = useState<string>('todos');
  const [filtroEspecie, setFiltroEspecie] = useState<string>('');
  const [filtroAno, setFiltroAno] = useState<string>('todos');
  const [painelFiltrosAberto, setPainelFiltrosAberto] = useState<boolean>(false);

  // Modo GeoBahia Offline determinístico (RN-004 / MSG002 / RNF-002)
  const [isGeoBahiaOffline, setIsGeoBahiaOffline] = useState<boolean>(false);

  // Camadas Geográficas (CEFIR ligado por padrão ao abrir)
  const [camadas, setCamadas] = useState<CamadasMapaAsas>({
    cefir: true, // RN-004: camada CEFIR ligada ao abrir
    vegetacao: false,
    hidrografia: true,
    uc: true,
    areasPotenciais: false,
    municipios: false,
    biomas: true,
    bacias: false,
    urs: true,
    base: 'ruas'
  });

  useEffect(() => {
    setItems(getAsasList());
    const unsub = subscribeFaunaR3R4(() => {
      setItems(getAsasList());
    });
    return () => unsub();
  }, []);

  const handleToggleCamada = (chave: keyof CamadasMapaAsas) => {
    if (chave === 'base') {
      setCamadas((c) => ({ ...c, base: c.base === 'ruas' ? 'satelite' : 'ruas' }));
    } else {
      setCamadas((c) => ({ ...c, [chave]: !c[chave] }));
    }
  };

  // RN-003 e CA003: Áreas Indeferidas e Desativadas NUNCA aparecem no mapa nem na lista lateral
  const itensElegiveisMapa = useMemo(() => {
    return items.filter((a) => a.situacao !== 'Indeferida' && a.situacao !== 'Desativada');
  }, [items]);

  // Contagem de Áreas Sem Delimitação entre as elegíveis (RN-006 / CA006 / MSG003)
  const areasSemDelimitacao = useMemo(() => {
    return itensElegiveisMapa.filter((a) => !a.delimitacao);
  }, [itensElegiveisMapa]);

  // Filtragem e sincronização entre lista e mapa
  const itensFiltrados = useMemo(() => {
    return itensElegiveisMapa.filter((item) => {
      if (busca) {
        const termo = busca.toLowerCase();
        const match =
          item.numero.toLowerCase().includes(termo) ||
          item.propriedade.nome.toLowerCase().includes(termo) ||
          item.propriedade.municipio.toLowerCase().includes(termo);
        if (!match) return false;
      }

      if (filtroSituacoes.length > 0) {
        // RN-003: Em complementação e Aguardando termo são exibidas como Em análise
        const situacaoEquivalente =
          ['Em análise', 'Em complementação', 'Aguardando termo', 'Em cadastro'].includes(item.situacao)
            ? 'Em análise'
            : item.situacao;

        const matchSituacao =
          filtroSituacoes.includes(item.situacao) || filtroSituacoes.includes(situacaoEquivalente);
        if (!matchSituacao) return false;
      }

      if (filtroCategoria !== 'todas' && item.categoria !== filtroCategoria) return false;
      if (filtroUr !== 'todas' && item.propriedade.ur !== filtroUr) return false;
      if (filtroMunicipio !== 'todos' && item.propriedade.municipio !== filtroMunicipio) return false;

      if (filtroGrupo !== 'todos') {
        const temGrupo = item.solturas.some((s) => s.grupo === filtroGrupo);
        if (!temGrupo) return false;
      }

      if (filtroEspecie) {
        const temEspecie = item.solturas.some(
          (s) =>
            s.especie.toLowerCase().includes(filtroEspecie.toLowerCase()) ||
            s.nomeCientifico.toLowerCase().includes(filtroEspecie.toLowerCase())
        );
        if (!temEspecie) return false;
      }

      if (filtroAno !== 'todos') {
        const temAno = item.solturas.some((s) => String(s.ano) === filtroAno);
        if (!temAno) return false;
      }

      return true;
    });
  }, [itensElegiveisMapa, busca, filtroSituacoes, filtroCategoria, filtroUr, filtroMunicipio, filtroGrupo, filtroEspecie, filtroAno]);

  // Contadores do Dashboard
  const totalAnimaisSoltos = useMemo(() => {
    return itensFiltrados.reduce((acc, a) => acc + a.solturas.reduce((sAcc, s) => sAcc + s.quantidade, 0), 0);
  }, [itensFiltrados]);

  const handleSelectAsas = (asas: AsasItem) => {
    setSelectedAsas(asas);
    setDrawerAberto(true);
  };

  const handleExportarPlanilha = () => {
    const headers = ['Numero', 'Propriedade', 'Categoria', 'Municipio', 'UR', 'Bioma', 'Situacao', 'Solturas_Total'];
    const rows = itensFiltrados.map((a) => [
      a.numero,
      `"${a.propriedade.nome}"`,
      a.categoria,
      a.propriedade.municipio,
      a.propriedade.ur,
      a.propriedade.bioma,
      a.situacao,
      a.solturas.reduce((acc, s) => acc + s.quantidade, 0)
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `INEMA_MAPA_ASAS_EXPORT_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportarImagemRelatorio = () => {
    window.print();
  };

  // BLOQUEIO DE ACESSO PARA PORTAL EXTERNO (RN-001 / CA001 / Sigilo Cartográfico)
  if (perfil === 'requerente') {
    return (
      <div
        data-testid="bloqueio-perfil-externo-mapa"
        className="max-w-2xl mx-auto my-16 p-8 bg-white dark:bg-slate-900 rounded-2xl border border-rose-200 dark:border-rose-900 shadow-xl text-center space-y-4"
      >
        <div className="w-16 h-16 mx-auto rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 flex items-center justify-center text-rose-600">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          Acesso Restrito — Sigilo Cartográfico de Fauna Silvestre (RN-001)
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          Conforme a Portaria de Proteção à Biodiversidade e o requisito RN-001 do DR010, a visualização espacial de
          coordenadas exatas e polígonos de Áreas de Soltura de Animais Silvestres é <strong>estritamente restrita</strong> aos
          perfis internos da Coordenação de Fauna (CGFAU), CETAS e Unidades Regionais (URs).
        </p>
        <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs text-slate-500">
          Usuários externos e requerentes não possuem permissão de consulta cartográfica geral.
        </div>
        <div className="pt-2 flex justify-center gap-3">
          <Button
            variant="outline"
            onClick={() => {
              if (onTrocarPerfil) onTrocarPerfil('cgfau');
              else setPerfilLocal('cgfau');
            }}
          >
            Trocar para Perfil CGFAU (Demonstração)
          </Button>
          {onNavigate && (
            <Button variant="primary" onClick={() => onNavigate('fauna-asas')} className="bg-[#0F4C3A] text-white">
              Ir para Minhas ASAS (DR009)
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-7xl mx-auto pb-8" data-testid="pagina-mapa-asas-destinacoes">
      {/* Topbar Institucional do Mapa */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Dashboard</span>
            <span>›</span>
            <span>Gestão de Fauna</span>
            <span>›</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              Mapa de ASAS e Destinações (DR010)
            </span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <span>Mapa de ASAS e Destinações</span>
            <Badge variant="outline" className="text-[10px] text-emerald-800 border-emerald-300 bg-emerald-50">
              Consulta Restrita CGFAU / CETAS / UR
            </Badge>
          </h1>
        </div>

        {/* Indicador de Perfil e Ações Globais */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Alternador de Perfil Demonstrativo */}
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 text-xs">
            <span className="text-[11px] font-medium text-slate-500 pl-1.5 flex items-center gap-1">
              <UserCheck className="w-3.5 h-3.5 text-[#0F4C3A]" /> Perfil:
            </span>
            <select
              value={perfil}
              onChange={(e) => {
                const val = e.target.value as PerfilDemonstrativoFauna;
                if (onTrocarPerfil) onTrocarPerfil(val);
                else setPerfilLocal(val);
              }}
              data-testid="seletor-perfil-mapa"
              className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-xs rounded-lg px-2 py-1 font-semibold border-none cursor-pointer"
            >
              <option value="cgfau">Coordenador CGFAU</option>
              <option value="tecnico">Técnico CETAS / UR</option>
              <option value="requerente">Portal Externo (Bloqueado)</option>
            </select>
          </div>

          {/* Toggle de Simulação GeoBahia Offline */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsGeoBahiaOffline((prev) => !prev)}
            data-testid="btn-toggle-simulacao-geobahia"
            className={`text-xs gap-1.5 h-9 ${
              isGeoBahiaOffline ? 'border-amber-500 text-amber-800 bg-amber-50' : ''
            }`}
            title="Simular indisponibilidade temporária do serviço GeoBahia (RNF-002)"
          >
            <Activity className="w-3.5 h-3.5" />
            <span>{isGeoBahiaOffline ? 'GeoBahia: Offline' : 'GeoBahia: Online'}</span>
          </Button>

          {/* Botões de Exportação */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportarPlanilha}
            data-testid="btn-exportar-planilha-mapa"
            className="text-xs gap-1.5 h-9"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" /> Planilha
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportarImagemRelatorio}
            data-testid="btn-exportar-mapa-relatorio"
            className="text-xs gap-1.5 h-9"
          >
            <FileText className="w-3.5 h-3.5" /> Exportar Mapa
          </Button>
        </div>
      </div>

      {/* Alerta de Áreas Sem Delimitação Geográfica (RN-003 / CA003) */}
      {areasSemDelimitacao.length > 0 && (
        <div
          data-testid="alerta-areas-sem-delimitacao"
          className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl flex items-center justify-between text-xs text-amber-900 dark:text-amber-200"
        >
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>Atenção:</strong> Existem <strong>{areasSemDelimitacao.length}</strong> área(s) de soltura
              cadastradas sem delimitação geográfica válida no sistema. Elas não são plotadas no mapa.
            </span>
          </div>
          {onNavigate && (
            <button
              onClick={() => onNavigate('fauna-asas')}
              data-testid="link-filtrar-sem-geometria-dr009"
              className="text-xs font-bold text-emerald-800 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Ver pendentes no DR009</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          )}
        </div>
      )}

      {/* Toolbar de Busca, Filtros Avançados e Resumo */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs p-3.5 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Buscar por número ASAS, nome da propriedade ou município..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              data-testid="input-busca-mapa"
              className="w-full h-9 pl-9 pr-4 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0F4C3A]/20 focus:border-[#0F4C3A]"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPainelFiltrosAberto((prev) => !prev)}
              data-testid="btn-painel-filtros-mapa"
              className={`text-xs gap-1.5 h-9 ${
                filtroSituacoes.length > 0 ||
                filtroCategoria !== 'todas' ||
                filtroUr !== 'todas' ||
                filtroGrupo !== 'todos' ||
                filtroAno !== 'todos'
                  ? 'border-emerald-600 text-[#0F4C3A] bg-emerald-50/50'
                  : ''
              }`}
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Filtros do Mapa</span>
              {(filtroSituacoes.length > 0 ||
                filtroCategoria !== 'todas' ||
                filtroUr !== 'todas' ||
                filtroGrupo !== 'todos' ||
                filtroAno !== 'todos') && <span className="w-2 h-2 rounded-full bg-emerald-600" />}
            </Button>
          </div>
        </div>

        {/* Painel Recolhível de Filtros Avançados do Mapa */}
        {painelFiltrosAberto && (
          <div
            data-testid="painel-filtros-avancados-mapa"
            className="pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 text-xs"
          >
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">Situação da ASAS (C004 / RN-003)</label>
              <select
                data-testid="select-filtro-situacao-mapa"
                value={filtroSituacoes[0] || 'todas'}
                onChange={(e) => {
                  const val = e.target.value;
                  setFiltroSituacoes(val === 'todas' ? [] : [val]);
                }}
                className="w-full h-8 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 font-medium"
              >
                <option value="todas">Todas as elegíveis</option>
                <option value="Ativa">Ativa (Apta)</option>
                <option value="Certificado vencido">Certificado vencido</option>
                <option value="Suspensa">Suspensa</option>
                <option value="Em análise">Em análise / trâmite</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">Categoria</label>
              <select
                value={filtroCategoria}
                onChange={(e) => setFiltroCategoria(e.target.value)}
                className="w-full h-8 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2"
              >
                <option value="todas">Todas as categorias</option>
                <option value="Categoria I">Categoria I</option>
                <option value="Categoria II">Categoria II</option>
                <option value="Categoria III">Categoria III</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">Unidade Regional (UR)</label>
              <select
                value={filtroUr}
                onChange={(e) => setFiltroUr(e.target.value)}
                className="w-full h-8 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2"
              >
                <option value="todas">Todas as URs</option>
                <option value="URCH">URCH (Chapada)</option>
                <option value="URES">URES (Litoral Leste)</option>
                <option value="UROE">UROE (Oeste)</option>
                <option value="URPD">URPD (Paraguaçu-Delta)</option>
                <option value="URPS">URPS (Porto Seguro)</option>
                <option value="URRC">URRC (Rio de Contas)</option>
                <option value="URSF">URSF (São Francisco)</option>
                <option value="URSO">URSO (Sudoeste)</option>
                <option value="URSU">URSU (Sul)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">Grupo de Fauna Solta</label>
              <select
                value={filtroGrupo}
                onChange={(e) => setFiltroGrupo(e.target.value)}
                className="w-full h-8 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2"
              >
                <option value="todos">Todos os grupos</option>
                <option value="Aves">Aves</option>
                <option value="Mamíferos">Mamíferos</option>
                <option value="Répteis">Répteis</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">Ano Histórico da Soltura</label>
              <select
                value={filtroAno}
                onChange={(e) => setFiltroAno(e.target.value)}
                className="w-full h-8 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2"
              >
                <option value="todos">Todos os anos</option>
                <option value="2026">2026</option>
                <option value="2025">2025</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
              </select>
            </div>

            <div className="sm:col-span-3">
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Destacar Espécie Solta (Foco no Mapa)
              </label>
              <input
                type="text"
                placeholder="Ex: Arara-canindé, Papagaio-verdadeiro, Jiboia..."
                value={filtroEspecie}
                onChange={(e) => setFiltroEspecie(e.target.value)}
                className="w-full h-8 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5"
              />
            </div>

            <div className="flex items-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setFiltroSituacoes([]);
                  setFiltroCategoria('todas');
                  setFiltroUr('todas');
                  setFiltroGrupo('todos');
                  setFiltroEspecie('');
                  setFiltroAno('todos');
                  setBusca('');
                }}
                className="w-full h-8 text-[11px]"
              >
                Limpar Filtros
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Grid Principal: Mapa Interativo + Lista Lateral Sincronizada */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[620px]">
        {/* Painel do Mapa Interativo (8 Colunas) */}
        <div className="lg:col-span-8 h-full">
          <BahiaFaunaMap
            asasList={itensFiltrados}
            selectedAsasId={selectedAsas?.id}
            onSelectAsas={handleSelectAsas}
            camadas={camadas}
            onToggleCamada={handleToggleCamada}
            isGeoBahiaOffline={isGeoBahiaOffline}
            onToggleGeoBahiaOffline={() => setIsGeoBahiaOffline((v) => !v)}
            destaqueEspecieOuGrupo={filtroEspecie || (filtroGrupo !== 'todos' ? filtroGrupo : undefined)}
          />
        </div>

        {/* Lista Lateral de Áreas de Soltura Sincronizada (4 Colunas) */}
        <div className="lg:col-span-4 h-full bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col overflow-hidden text-xs">
          <div className="p-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/40 flex items-center justify-between">
            <span className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide text-[11px]">
              Áreas Mapeadas ({itensFiltrados.filter((a) => a.delimitacao).length})
            </span>
            <span className="text-[11px] text-slate-500">
              Total Solturas: <strong>{totalAnimaisSoltos}</strong>
            </span>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 p-1">
            {itensFiltrados.filter((a) => a.delimitacao).map((item) => {
              const isSelected = selectedAsas?.id === item.id;
              const totalSolturasItem = item.solturas.reduce((acc, s) => acc + s.quantidade, 0);

              return (
                <div
                  key={item.id}
                  data-testid={`card-lista-mapa-asas-${item.id}`}
                  onClick={() => handleSelectAsas(item)}
                  className={`p-3 rounded-xl transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-mono font-bold text-[#0F4C3A] dark:text-emerald-400 block">
                        {item.numero}
                      </span>
                      <h4 className="font-semibold text-slate-900 dark:text-white line-clamp-1">
                        {item.propriedade.nome}
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        {item.propriedade.municipio} ({item.propriedade.ur}) · {item.categoria}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <Badge
                        variant={
                          ['Em complementação', 'Aguardando termo', 'Em cadastro', 'Em análise'].includes(item.situacao)
                            ? 'gray'
                            : item.situacao === 'Ativa'
                            ? 'success'
                            : item.situacao === 'Certificado vencido'
                            ? 'danger'
                            : item.situacao === 'Suspensa'
                            ? 'warning'
                            : 'gray'
                        }
                        dot
                        className="text-[10px]"
                      >
                        {['Em complementação', 'Aguardando termo', 'Em cadastro', 'Em análise'].includes(item.situacao)
                          ? 'Em análise'
                          : item.situacao}
                      </Badge>
                      <span className="block text-[10px] text-slate-400 mt-1 font-mono">
                        {totalSolturasItem} solturas
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* DRAWER / FICHA RESUMIDA DA ASAS (TL002 - RN-005) */}
      {drawerAberto && selectedAsas && (
        <div
          role="dialog"
          aria-modal="true"
          data-testid="drawer-ficha-resumida-asas"
          className="fixed inset-y-0 right-0 z-50 w-full sm:w-[500px] bg-white dark:bg-slate-900 shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden text-xs"
        >
          {/* Header do Drawer */}
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-sm text-[#0F4C3A] dark:text-emerald-400">
                  {selectedAsas.numero}
                </span>
                <Badge variant="outline" className="text-[10px]">
                  {selectedAsas.categoria}
                </Badge>
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-1">
                {selectedAsas.propriedade.nome}
              </h3>
            </div>

            <button
              onClick={() => setDrawerAberto(false)}
              className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 cursor-pointer"
              aria-label="Fechar ficha da ASAS"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Abas da Ficha Resumida (Dados Gerais vs Solturas DR008) */}
          <div className="border-b border-slate-200 dark:border-slate-800 px-4 pt-2 flex gap-4">
            <button
              onClick={() => setAbaFicha('geral')}
              className={`pb-2 font-semibold border-b-2 transition-colors cursor-pointer ${
                abaFicha === 'geral'
                  ? 'border-[#0F4C3A] text-[#0F4C3A] dark:text-emerald-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Dados Gerais & Aptidão
            </button>
            <button
              onClick={() => setAbaFicha('solturas')}
              className={`pb-2 font-semibold border-b-2 transition-colors cursor-pointer ${
                abaFicha === 'solturas'
                  ? 'border-[#0F4C3A] text-[#0F4C3A] dark:text-emerald-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Solturas Realizadas ({selectedAsas.solturas.length})
            </button>
          </div>

          {/* Conteúdo do Drawer */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {abaFicha === 'geral' ? (
              <div className="space-y-4">
                {/* Resumo de Situação e Validade */}
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Situação no Mapa (RN-003):</span>
                    <Badge
                      variant={
                        ['Em complementação', 'Aguardando termo', 'Em cadastro', 'Em análise'].includes(selectedAsas.situacao)
                          ? 'gray'
                          : selectedAsas.situacao === 'Ativa'
                          ? 'success'
                          : selectedAsas.situacao === 'Certificado vencido'
                          ? 'danger'
                          : selectedAsas.situacao === 'Suspensa'
                          ? 'warning'
                          : 'gray'
                      }
                      dot
                    >
                      {['Em complementação', 'Aguardando termo', 'Em cadastro', 'Em análise'].includes(selectedAsas.situacao)
                        ? 'Em análise'
                        : selectedAsas.situacao}
                    </Badge>
                  </div>

                  {['Em complementação', 'Aguardando termo'].includes(selectedAsas.situacao) && (
                    <div className="flex justify-between items-center text-[10px] text-slate-600 bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-200 dark:border-slate-700">
                      <span>Situação Original (DR009):</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {selectedAsas.situacao} (exibida como 'Em análise' no mapa)
                      </span>
                    </div>
                  )}

                  {selectedAsas.motivoSuspensao && (
                    <div className="p-2 bg-amber-50 border border-amber-200 rounded text-amber-900 text-[11px]">
                      <strong>Motivo da Suspensão:</strong> {selectedAsas.motivoSuspensao}
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Validade do Certificado:</span>
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                      {selectedAsas.dataValidadeCertificado || 'Não emitido'}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Última Vistoria Oficial:</span>
                    <span className="font-mono text-slate-700 dark:text-slate-300">
                      {selectedAsas.dataUltimaVistoria || 'Pendente'}
                    </span>
                  </div>
                </div>

                {/* Localização e Atributos Físicos */}
                <div className="space-y-2 border-t border-slate-100 dark:border-slate-800 pt-3">
                  <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
                    Caracterização Ambiental
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <span className="text-slate-500 block">Município / UR:</span>
                      <strong>
                        {selectedAsas.propriedade.municipio} ({selectedAsas.propriedade.ur})
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Bioma:</span>
                      <strong>{selectedAsas.propriedade.bioma}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Bacia Hidrográfica:</span>
                      <strong>{selectedAsas.propriedade.bacia}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Área Georreferenciada:</span>
                      <strong>{selectedAsas.delimitacao?.areaHa || 0} hectares</strong>
                    </div>
                  </div>
                </div>

                {/* Espécies e Grupos Adequados da Vistoria (RN-018) */}
                <div className="space-y-1.5 border-t border-slate-100 dark:border-slate-800 pt-3">
                  <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
                    Grupos e Espécies Adequadas (Vistoria F-TEC-133)
                  </h4>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700">
                    {selectedAsas.vistoria?.especiesAdequadasTexto ||
                      'Área em análise técnica; aptidão a ser definida no laudo de vistoria.'}
                  </p>
                </div>

                {/* Sigilo de Dados Pessoais (Proteção Legal) */}
                <div className="p-3 bg-slate-100 dark:bg-slate-800/40 rounded-xl text-[10px] text-slate-500 leading-tight">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 inline mr-1" />
                  Dados pessoais de contato e documentos do proprietário protegidos sob sigilo funcional.
                </div>
              </div>
            ) : (
              /* Aba Solturas Realizadas */
              <div className="space-y-3">
                {selectedAsas.solturas.length === 0 ? (
                  <div className="py-12 text-center text-slate-400">
                    <p className="font-medium">Nenhuma soltura registrada para esta ASAS.</p>
                  </div>
                ) : (
                  selectedAsas.solturas.map((s) => (
                    <div
                      key={s.id}
                      className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1"
                    >
                      <div className="flex justify-between items-start font-bold">
                        <span className="text-slate-900 dark:text-white">
                          {s.especie} (<em>{s.nomeCientifico}</em>)
                        </span>
                        <span className="text-emerald-800 font-mono text-sm">+{s.quantidade}</span>
                      </div>
                      <p className="text-slate-500 text-[11px]">
                        Data: <span className="font-mono text-slate-700 dark:text-slate-300">{s.data}</span> · Origem:{' '}
                        {s.unidadeOrigem}
                      </p>
                      <p className="font-mono text-[10px] text-[#0F4C3A] font-bold">
                        Termo: {s.termoSolturaNumero}
                      </p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Rodapé do Drawer com Link para Cadastro Completo */}
          {onNavigate && (
            <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 flex justify-end">
              <Button
                variant="primary"
                size="sm"
                onClick={() => onNavigate('fauna-asas', { id: selectedAsas.id, subview: 'requerimento', modo: 'ver' })}
                data-testid="btn-abrir-cadastro-completo-dr009"
                className="text-xs gap-1.5 h-8 bg-[#0F4C3A] text-white"
              >
                <span>Abrir Cadastro Completo no DR009</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
