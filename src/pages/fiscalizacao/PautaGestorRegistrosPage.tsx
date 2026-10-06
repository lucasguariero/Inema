import { useMemo, useRef, useState } from 'react';
import { ArrowDown, ArrowUp, ChevronLeft, ChevronRight, Settings2, MoreHorizontal } from 'lucide-react';
import { FilamentTabs } from '@/components/filament/Tabs';
import { FilamentSelect } from '@/components/filament/Select';
import { TableContainer, TableToolbar } from '@/components/filament/Table';
import { GlaTable, GlaTableHead, GlaTh, GlaTableBody, GlaTableRow, GlaTd } from '@/components/common/GlaTable';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GlaCheckbox } from '@/components/gla/primitives/GlaCheckbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { TIPOS_PAUTA, criarRegistrosPauta, diasEmAberto, nivelSla, type GuiaPauta, type RegistroPauta } from '@/data/pautaGestorMock';
import { PautaFiltros } from './PautaFiltros';
import { PautaRegistroDialog } from './PautaRegistroDialog';
import { FILTROS_VAZIOS, filtrosDaConsulta, consultarPauta, limparInaplicaveis, validarFiltros, duplicidades, executarComando, acessoPauta, SESSAO_SIMULADA, MSG, type GrupoFiltro, type SessaoPauta } from '@/lib/pautaGestor';
import './pautaGestor.css';
import { COLUNAS, COLUNAS_PADRAO, colunasAplicaveis, colunasObrigatorias, type Coluna } from '@/lib/pautaColunas';

export function PautaGestorRegistrosPage({ sessao = SESSAO_SIMULADA, registrosIniciais }: { sessao?: SessaoPauta; registrosIniciais?: RegistroPauta[] }) {
  const [guia, setGuia] = useState<GuiaPauta>('Todos');
  const [registros, setRegistros] = useState(() => registrosIniciais || criarRegistrosPauta());
  const [filtros, setFiltros] = useState({ ...FILTROS_VAZIOS });
  const [aplicados, setAplicados] = useState({ ...FILTROS_VAZIOS });
  const [grupos, setGrupos] = useState<Record<GrupoFiltro, boolean>>({ dados: false, localizacao: false, periodo: false, classificacao: false });
  const [erro, setErro] = useState('');
  const [feedback, setFeedback] = useState('');
  const [crescente, setCrescente] = useState(false);
  const [pagina, setPagina] = useState(1);
  const [porPagina, setPorPagina] = useState(10);
  const [colunas, setColunas] = useState<Coluna[]>(COLUNAS_PADRAO);
  const [rascunhoColunas, setRascunhoColunas] = useState<Coluna[]>(COLUNAS_PADRAO);
  const [configurando, setConfigurando] = useState(false);
  const [selecionado, setSelecionado] = useState<RegistroPauta | null>(null);
  const [operacao, setOperacao] = useState('');
  const acionador = useRef<HTMLElement | null>(null);
  const linhas = useMemo(() => consultarPauta(registros, guia, aplicados, sessao).sort((a, b) => {
    const data = a.data.localeCompare(b.data) * (crescente ? 1 : -1);
    return data || a.numero.localeCompare(b.numero);
  }), [registros, guia, aplicados, crescente, sessao]);
  const aplicaveis = colunasAplicaveis(guia, sessao);
  const obrigatorias = colunasObrigatorias(linhas, registros, sessao);
  const visiveis = aplicaveis.filter(c => colunas.includes(c) || obrigatorias.includes(c));
  const ultimaPagina = Math.max(1, Math.ceil(linhas.length / porPagina));
  const paginaAtual = Math.min(pagina, ultimaPagina);
  const inicio = (paginaAtual - 1) * porPagina;
  const paginadas = linhas.slice(inicio, inicio + porPagina);
  const trocarGuia = (id: string) => {
    if (guia === 'RA' || guia === 'AC' || id === 'RA' || id === 'AC') setGrupos({ dados: false, localizacao: false, periodo: false, classificacao: false });
    setGuia(id as GuiaPauta);
    setFiltros(f => limparInaplicaveis(f, id as GuiaPauta));
    setAplicados(f => limparInaplicaveis(f, id as GuiaPauta));
    setErro(''); setFeedback(''); setPagina(1);
  };
  const consultar = () => {
    const criterios = filtrosDaConsulta(filtros, grupos);
    const mensagem = validarFiltros(criterios);
    setErro(mensagem); setFeedback('');
    if (!mensagem) { setAplicados(criterios); setPagina(1); }
  };
  const abrir = (registro: RegistroPauta, acao: string) => { acionador.current = document.activeElement as HTMLElement; setSelecionado(registro); setOperacao(acao); };
  const celula = (r: RegistroPauta, coluna: Coluna) => {
    switch (coluna) {
      case 'data': return r.data.split('-').reverse().join('/');
      case 'numero': return <span className="font-mono text-slate-800">{r.numero}</span>;
      case 'dias': {
        const dias = diasEmAberto(r), nivel = nivelSla(dias);
        return <Badge variant={nivel === 'orange' ? 'warning' : nivel} className={nivel === 'orange' ? 'pauta-sla-orange' : nivel === 'warning' ? 'text-amber-800' : ''} aria-label={`${dias} dias em aberto`}>{dias}</Badge>;
      }
      case 'status': return <Badge variant={r.status === 'Arquivado' ? 'gray' : r.status === 'Em Análise Técnica' ? 'warning' : r.status === 'Registrado' ? 'gray' : 'primary'} className={r.status === 'Em Análise Técnica' ? 'text-amber-800' : ''}>{r.status}</Badge>;
      case 'acoes': return <Button color="gray" size="sm" aria-label={`Ações de ${r.numero}`} onClick={() => abrir(r, 'acoes')}><MoreHorizontal className="h-4 w-4" />Ações</Button>;
      case 'duplicados': {
        const n = duplicidades(r, registros, undefined, sessao).length;
        return n ? <Button color="gray" size="sm" className="bg-transparent ring-0 shadow-none px-0 hover:bg-transparent" aria-label={`Ver duplicados: ${n} possíveis duplicados de ${r.numero}`} onClick={() => abrir(r, 'duplicados')}><Badge variant="primary">{n}</Badge></Button> : <span className="text-slate-500">0</span>;
      }
      default: return r[coluna] || '—';
    }
  };
  if (!acessoPauta(sessao)) return <p role="alert" className="text-sm">{MSG[3]}</p>;
  return (
    <div className="pauta-gestor space-y-5">
      <h1 className="text-xl font-bold text-slate-900">Pauta do Gestor - Registros</h1>
      <FilamentTabs tabs={TIPOS_PAUTA.map(id => ({ id, label: id }))} activeTab={guia} onChange={trocarGuia} />
      {guia !== 'RA' && guia !== 'AC' && <PautaFiltros guia={guia} filtros={filtros} registros={registros} sessao={sessao} erro={erro} onChange={setFiltros} onGrupo={(g, aberto) => setGrupos(prev => ({ ...prev, [g]: aberto }))} onConsultar={consultar} onLimpar={() => { setFiltros({ ...FILTROS_VAZIOS }); setErro(''); }} />}
      {feedback && <p role="status" className="text-xs text-[var(--color-text-link)]">{feedback}</p>}
      <TableContainer toolbar={linhas.length > 0 && <TableToolbar actions={<div className="flex items-center flex-wrap gap-3"><span className="text-xs text-slate-600">Ordenar:</span><FilamentSelect ariaLabel="Ordenar" className="w-40 pauta-select" value={crescente ? 'antigos' : 'recentes'} options={[{ value: 'recentes', label: 'Mais recentes' }, { value: 'antigos', label: 'Mais antigos' }]} onChange={v => { setCrescente(v === 'antigos'); setPagina(1); }} /><Button color="gray" size="sm" onClick={() => { setRascunhoColunas([...visiveis]); setConfigurando(true); }}><Settings2 className="w-3.5 h-3.5" />Configurar colunas</Button></div>} />} pagination={<div className="flex items-center justify-between flex-wrap gap-3 w-full text-xs text-slate-600">
        <span aria-live="polite">{linhas.length ? `${inicio + 1}–${Math.min(inicio + porPagina, linhas.length)} de ${linhas.length} registros` : '0 registros'}</span>
        <div className="flex items-center gap-2"><span>Por página</span><FilamentSelect id="registros-por-pagina" className="w-20 pauta-select" value={String(porPagina)} options={['10', '25', '50']} onChange={v => { setPorPagina(Number(v)); setPagina(1); }} /><Button size="sm" color="gray" aria-label="Página anterior" disabled={paginaAtual <= 1} onClick={() => setPagina(p => p - 1)}><ChevronLeft className="w-4 h-4" /></Button><span>{paginaAtual} / {ultimaPagina}</span><Button size="sm" color="gray" aria-label="Próxima página" disabled={paginaAtual >= ultimaPagina} onClick={() => setPagina(p => p + 1)}><ChevronRight className="w-4 h-4" /></Button></div>
      </div>}>
        {linhas.length ? <GlaTable className="min-w-[980px]">
          <GlaTableHead><GlaTableRow>{visiveis.map(c => <GlaTh key={c} aria-sort={c === 'data' ? crescente ? 'ascending' : 'descending' : undefined}>{c === 'data' ? <Button color="gray" size="sm" className="bg-transparent ring-0 shadow-none px-0 h-6 uppercase text-[10px]" onClick={() => { setCrescente(!crescente); setPagina(1); }} aria-label={crescente ? 'Ordenar data decrescente' : 'Ordenar data crescente'}>Data{crescente ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}</Button> : COLUNAS[c]}</GlaTh>)}</GlaTableRow></GlaTableHead>
          <GlaTableBody>{paginadas.map(r => <GlaTableRow key={r.id}>{visiveis.map(c => <GlaTd key={c}>{celula(r, c)}</GlaTd>)}</GlaTableRow>)}</GlaTableBody>
        </GlaTable> : <div className="py-16 text-center" role="status"><h2 className="text-sm font-semibold">{guia === 'RA' || guia === 'AC' ? 'Não há dados disponíveis' : MSG[1]}</h2>{(guia === 'RA' || guia === 'AC') && <p className="mt-2 text-xs text-slate-500">{MSG[4]}</p>}</div>}
      </TableContainer>
      <Dialog open={configurando} onOpenChange={setConfigurando}><DialogContent className="pauta-dialog max-w-lg"><DialogHeader><DialogTitle>Configurar colunas</DialogTitle><DialogDescription>Colunas obrigatórias dependem das operações e relações disponíveis.</DialogDescription></DialogHeader><div className="grid sm:grid-cols-2 gap-4">{aplicaveis.map(c => <GlaCheckbox key={c} id={`coluna-${c}`} label={COLUNAS[c]} checked={rascunhoColunas.includes(c) || obrigatorias.includes(c)} disabled={obrigatorias.includes(c)} onChange={e => setRascunhoColunas(prev => e.target.checked ? [...prev, c] : prev.filter(v => v !== c))} />)}</div><DialogFooter><Button size="sm" color="gray" onClick={() => setConfigurando(false)}>Cancelar</Button><Button size="sm" onClick={() => { setColunas((Object.keys(COLUNAS) as Coluna[]).filter(c => obrigatorias.includes(c) || rascunhoColunas.includes(c))); setConfigurando(false); }}>Aplicar</Button></DialogFooter></DialogContent></Dialog>
      {selecionado && <PautaRegistroDialog key={`${selecionado.id}-${operacao}`} registro={selecionado} registros={registros} inicial={operacao} sessao={sessao} onClose={() => setSelecionado(null)} onRestoreFocus={() => acionador.current?.focus({ preventScroll: true })} onExecutar={comando => {
        const resultado = executarComando(registros, comando, sessao);
        setRegistros(resultado.registros); setFeedback(resultado.mensagem); setSelecionado(null);
      }} />}
    </div>
  );
}
