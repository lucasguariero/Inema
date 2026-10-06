import { useRef, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Section } from '@/components/filament/Section';
import { InputWrapper } from '@/components/filament/InputWrapper';
import { FilamentSelect } from '@/components/filament/Select';
import { TableContainer } from '@/components/filament/Table';
import { GlaTable, GlaTableHead, GlaTh, GlaTableBody, GlaTableRow, GlaTd } from '@/components/common/GlaTable';
import { GlaRadioGroup } from '@/components/gla/primitives/GlaRadioGroup';
import { Button } from '@/components/ui/button';
import { diasEmAberto, type RegistroPauta, type DocumentoRelacionadoPauta } from '@/data/pautaGestorMock';
import { ACOES, MSG, duplicidades, podeExecutar, referenciaEspacial, referenciasEspaciais, itemAutorizado, BLOQUEIOS_ACOES, destinosAutorizados, type ProcessoPauta, EIXOS, MOTIVOS_ARQUIVAMENTO, EXTENSOES_ARQUIVOS, arquivoPermitido, type AcaoPauta, type ComandoPauta, type SessaoPauta } from '@/lib/pautaGestor';

interface Props { registro: RegistroPauta; registros: RegistroPauta[]; inicial: string; sessao: SessaoPauta; onClose: () => void; onRestoreFocus: () => void; onExecutar: (c: ComandoPauta) => void; }
export function PautaRegistroDialog({ registro: r, registros, inicial, sessao, onClose, onRestoreFocus, onExecutar }: Props) {
  const [visao, setVisao] = useState(inicial);
  const [alvo, setAlvo] = useState('');
  const [justificativa, setJustificativa] = useState('');
  const [erro, setErro] = useState('');
  const [confirmacao, setConfirmacao] = useState<ComandoPauta | null>(null);
  const [motivo, setMotivo] = useState('');
  const [descricaoMotivo, setDescricaoMotivo] = useState('');
  const [destino, setDestino] = useState('');
  const [eixo, setEixo] = useState(r.eixo);
  const [subitem, setSubitem] = useState(r.subitem);
  const [comentario, setComentario] = useState('');
  const [arquivos, setArquivos] = useState<File[]>([]);
  const [relacionado, setRelacionado] = useState<RegistroPauta | ProcessoPauta | null>(null);
  const [documento, setDocumento] = useState<DocumentoRelacionadoPauta | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const enviado = useRef(false);
  const versoes = useRef(Object.fromEntries(registros.map(item => [item.id, item.versao])));
  const comando = (acao: AcaoPauta): ComandoPauta => ({ acao, id: r.id, versao: r.versao, versoes: versoes.current });
  const executar = (c: ComandoPauta) => {
    if (enviado.current) return;
    enviado.current = true;
    try { onExecutar(c); } catch (error) { setErro(error instanceof Error ? error.message : MSG[31]); enviado.current = false; setConfirmacao(null); }
  };
  const candidatos = duplicidades(r, registros, undefined, sessao);
  const espacial = referenciaEspacial(r);
  const pai = registros.find(item => item.id === r.pai);
  const titulo = relacionado ? 'Registro relacionado' : documento ? 'Documento relacionado' : confirmacao ? 'Confirmar operação' : visao === 'acoes' ? 'Ações do Registro' : visao === 'duplicados' ? 'Possíveis Duplicidades' : visao === 'visualizar' ? 'Detalhes do Registro' : ACOES[visao as AcaoPauta];
  const textoConfirmacao = confirmacao?.acao === 'anexar' ? MSG[16] : confirmacao?.acao === 'arquivar' ? MSG[11] : confirmacao?.acao === 'encaminhar' ? `Encaminhar para ${confirmacao.destino}` : MSG[19];
  const leitura = (label: string, value: React.ReactNode) => <div key={label}><dt className="text-xs text-slate-500 mb-1">{label}</dt><dd className="text-xs text-slate-800 break-words">{value === '' || value === undefined || value === null ? '—' : value}</dd></div>;
  const selecao = (label: string, value: string, onChange: (value: string) => void, options: string[]) => <InputWrapper label={label} required className="border-0 shadow-none overflow-visible"><FilamentSelect ariaLabel={label} value={value} onChange={onChange} options={options} className="pauta-select" placeholder="Selecione..." /></InputWrapper>;
  const texto = (label: string, value: string, onChange: (value: string) => void, obrigatorio = true) => <InputWrapper label={label} required={obrigatorio}><textarea aria-label={label} value={value} onChange={e => onChange(e.target.value)} className="fi-input w-full min-h-24 p-3 text-xs outline-none bg-transparent" /></InputWrapper>;
  const acessoRestrito = !['acoes', 'visualizar', 'geo', 'duplicados'].includes(visao) && !podeExecutar(sessao, r, visao as AcaoPauta);
  if (!itemAutorizado(sessao, r) || acessoRestrito || relacionado && !itemAutorizado(sessao, relacionado)) return <Dialog open onOpenChange={onClose}><DialogContent className="pauta-dialog"><DialogTitle>Acesso negado</DialogTitle><DialogDescription>{MSG[3]}</DialogDescription><Button size="sm" color="gray" onClick={onClose}>Fechar</Button></DialogContent></Dialog>;
  return <Dialog open onOpenChange={open => { if (!open) onClose(); }}><DialogContent className="pauta-dialog max-w-3xl" onCloseAutoFocus={e => { e.preventDefault(); onRestoreFocus(); }}><DialogHeader><DialogTitle>{titulo}</DialogTitle><DialogDescription className="font-mono">{relacionado?.numero || r.numero}</DialogDescription></DialogHeader>
    {erro && <p role="alert" className="text-xs text-rose-700">{erro}</p>}
    {relacionado ? <Section compact heading="Dados do registro relacionado"><dl className="grid sm:grid-cols-2 gap-4">{leitura('Nº do Registro / Processo', relacionado.numero)}{leitura('Data', relacionado.data.split('-').reverse().join('/'))}{leitura('Município', relacionado.municipio)}{'tipo' in relacionado && <>{leitura('Tipo do Registro', relacionado.tipo)}{leitura('Status/Situação', relacionado.status)}{leitura('Descrição', relacionado.descricao)}</>}</dl></Section> : documento ? <Section compact heading={`${documento.tipo} ${documento.identificador}`}><dl className="grid sm:grid-cols-2 gap-4">{leitura('Registro de origem', documento.registroOrigem)}{leitura('Documento', documento.nome)}</dl><p className="text-xs mt-4">{documento.conteudo}</p></Section> : confirmacao ? <p className="text-sm">{textoConfirmacao}</p> : <>
      {visao === 'acoes' && <div className="grid sm:grid-cols-2 gap-2">{(Object.keys(ACOES) as AcaoPauta[]).filter(acao => acao !== 'anexar' && (podeExecutar(sessao, r, acao) || !!BLOQUEIOS_ACOES[acao] && sessao.permissoes.includes(acao))).map(acao => <Button color="gray" size="md" className="justify-start" key={acao} disabled={!!BLOQUEIOS_ACOES[acao]} title={BLOQUEIOS_ACOES[acao]} onClick={() => { setVisao(acao); setErro(''); }}>{ACOES[acao]}</Button>)}</div>}
      {visao === 'visualizar' && <div className="space-y-4">
        <Section compact heading="Dados do registro"><dl className="grid sm:grid-cols-2 gap-4">{leitura('Tipo do Registro', r.tipo)}{leitura('Status/Situação', r.status)}{leitura('Data', r.data.split('-').reverse().join('/'))}{leitura('Origem', r.origem)}{leitura('Município', r.municipio)}{leitura('Dias em Aberto', diasEmAberto(r))}{sessao.verDemandante && leitura('Demandante', r.demandante)}{leitura('Classificação', [r.eixo, r.subitem, r.emergencia].filter(Boolean).join(' / '))}</dl></Section>
        <Section compact heading="Descrição"><p className="text-xs leading-relaxed">{r.descricao}</p></Section>
        {!!referenciasEspaciais(r).length && <Section compact heading="Coordenada">{referenciasEspaciais(r).map(ref => <div key={ref.fonte} className="mb-2 last:mb-0"><a href="#informacoes-geoespaciais" className="text-xs text-[var(--color-text-link)] underline underline-offset-2" onClick={e => { e.preventDefault(); setVisao('geo'); }}>{ref.coordenada.lat.toFixed(6)}, {ref.coordenada.lng.toFixed(6)}</a><p className="text-xs text-slate-500">{ref.fonte}</p></div>)}</Section>}
        <Section compact heading="Arquivos">{r.arquivos.length ? <ul className="space-y-2 text-xs">{r.arquivos.map((f, i) => <li key={i}>{f.url ? <a href={f.url} download={f.nome} className="text-[var(--color-text-link)] underline">{f.nome}</a> : f.nome}</li>)}</ul> : <p className="text-xs text-slate-500">Nenhum arquivo anexado.</p>}</Section>
        <Section compact heading="Histórico"><ol className="space-y-3">{r.historico.map((h, i) => <li key={i} className="text-xs border-b border-slate-100 pb-3 last:border-0"><p className="font-semibold">{h.acao}</p><p className="text-slate-500 mt-1">{new Date(h.data).toLocaleString('pt-BR')} · {h.usuario} · {h.perfil}</p>{h.anterior && <p className="mt-1">Anterior: {h.anterior}</p>}{h.novo && <p className="mt-1">{h.novo}</p>}{h.justificativa && <p className="mt-1">Justificativa: {h.justificativa}</p>}<p className="mt-1 text-slate-500">{h.resultado}</p></li>)}</ol></Section>
      </div>}
      {visao === 'duplicados' && <>
        <div className="space-y-3">{candidatos.map(c => <div key={c.id} className="flex items-center justify-between gap-3"><GlaRadioGroup name="duplicidade" label="" value={alvo} onChange={setAlvo} options={[{ value: c.id, label: c.numero, description: `${'tipo' in c ? c.status : 'Processo'} · ${c.data.split('-').reverse().join('/')} · ${c.municipio}` }]} /><Button size="sm" color="gray" aria-label={`Visualizar ${c.numero}`} onClick={() => { if (itemAutorizado(sessao, c)) setRelacionado(c); else setErro(MSG[3]); }}>Visualizar</Button></div>)}</div>
        {!candidatos.length && <p className="text-xs text-slate-500">Nenhum registro relacionado disponível.</p>}
        <p className="text-xs text-slate-500">Entre registros, o mais antigo será a Referência Principal. Ao anexar a um processo, o processo será a referência.</p>
      </>}
      {visao === 'desanexar' && <><p className="text-xs">Referência Principal: <span className="font-mono">{pai?.numero || r.processo || r.pai}</span></p><InputWrapper label="Justificativa" required><textarea aria-label="Justificativa" className="fi-input w-full min-h-24 p-3 text-xs outline-none bg-transparent" value={justificativa} onChange={e => setJustificativa(e.target.value)} /></InputWrapper></>}
      {visao === 'arquivar' && <div className="space-y-4">{selecao('Motivo do arquivamento', motivo, setMotivo, MOTIVOS_ARQUIVAMENTO)}{motivo === 'Outros' && texto('Descrição do motivo', descricaoMotivo, setDescricaoMotivo)}{texto('Justificativa', justificativa, setJustificativa)}</div>}
      {visao === 'encaminhar' && selecao('Destino', destino, setDestino, destinosAutorizados(sessao))}
      {visao === 'eixo' && <div className="grid sm:grid-cols-2 gap-4">{selecao('Eixo Temático', eixo, v => { setEixo(v); setSubitem(''); }, Object.keys(EIXOS))}{selecao('Subitem', subitem, setSubitem, EIXOS[eixo] || [])}</div>}
      {visao === 'comentario' && texto('Comentário', comentario, setComentario, false)}
      {visao === 'arquivos' && <div className="space-y-4">
        <InputWrapper label="Arquivos" className="border-0 shadow-none"><input ref={fileInput} type="file" aria-label="Selecionar arquivos" multiple accept={EXTENSOES_ARQUIVOS.map(e => `.${e}`).join(',')} className="sr-only" onChange={e => {
          const files = Array.from(e.target.files || []);
          if (files.some(f => !arquivoPermitido(f.name))) { setErro(MSG[32]); setArquivos([]); }
          else { setArquivos(files); setErro(''); }
        }} /><Button size="sm" color="gray" onClick={() => fileInput.current?.click()}>Selecionar arquivos</Button></InputWrapper>
        <p className="text-xs text-slate-500">Formatos permitidos: {EXTENSOES_ARQUIVOS.join(', ')}.</p>
        {(arquivos.length > 0 || r.arquivos.length > 0) && <TableContainer><GlaTable><GlaTableHead><GlaTableRow><GlaTh>Arquivo</GlaTh><GlaTh>Tamanho</GlaTh><GlaTh>Ações</GlaTh></GlaTableRow></GlaTableHead><GlaTableBody>{[...r.arquivos.map(f => ({ name: f.nome, size: f.tamanho })), ...arquivos].map((f, i) => <GlaTableRow key={i}><GlaTd className="break-all" title={f.name}>{f.name}</GlaTd><GlaTd>{(f.size / 1024).toLocaleString('pt-BR', { maximumFractionDigits: 1 })} KB</GlaTd><GlaTd>{i >= r.arquivos.length && <Button size="sm" color="gray" aria-label={`Remover ${f.name}`} onClick={() => setArquivos(prev => prev.filter((_, n) => n !== i - r.arquivos.length))}>Remover</Button>}</GlaTd></GlaTableRow>)}</GlaTableBody></GlaTable></TableContainer>}
      </div>}
      {visao === 'pdf' && <p className="text-xs leading-relaxed">A geração do PDF com os arquivos incorporados depende do serviço documental do GLA. Este protótipo não emite o documento oficial nem substitui essa geração por impressão da tela.</p>}
      {visao === 'processo' && <p className="text-xs leading-relaxed">O fluxo de formação de processo (PE003) não está detalhado no DOR011. A operação deverá incluir todos os registros relacionados e preservar a referência principal. Não será criado um processo fictício ou um formulário sem o documento desse fluxo.</p>}
      {visao === 'oficio' && <p className="text-xs leading-relaxed">O modelo oficial editável, a numeração e o fluxo posterior do ofício aguardam definição (RN041). Nenhum documento é emitido e o status do registro permanece inalterado.</p>}
      {visao === 'converter' && <p className="text-xs">{BLOQUEIOS_ACOES.converter}</p>}
      {visao === 'geo' && (espacial ? <div className="space-y-4">
        <Section compact heading="Referência principal"><dl className="grid sm:grid-cols-2 gap-4">{leitura('Fonte da referência', espacial.fonte)}{leitura('Município', espacial.municipio)}{espacial.coordenada && leitura('Coordenada', `${espacial.coordenada.lat.toFixed(6)}, ${espacial.coordenada.lng.toFixed(6)}`)}</dl></Section>
        <Section compact heading="Referências disponíveis"><dl className="space-y-3">{referenciasEspaciais(r).map((ref, i) => <div key={i}>{leitura(`${ref.origem} · ${ref.fonte}`, `${ref.coordenada.lat.toFixed(6)}, ${ref.coordenada.lng.toFixed(6)}`)}</div>)}</dl></Section>
        <Section compact heading="Documentos relacionados">
          {r.documentos?.length || r.arquivos.length ? <ul className="space-y-3">
            {r.documentos?.map(d => <li key={d.id} className="flex justify-between items-center gap-3 text-xs"><div className="min-w-0 break-words"><p>{d.tipo} · {d.identificador}</p><p className="text-slate-500 mt-1">Documento relacionado · {d.nome} · {d.registroOrigem}</p></div><Button size="sm" color="gray" className="shrink-0" onClick={() => setDocumento(d)}>Visualizar</Button></li>)}
            {r.arquivos.map((f, i) => <li key={`anexo-${i}`} className="flex justify-between items-center gap-3 text-xs">
              <div className="min-w-0 break-all"><p>{f.nome}</p><p className="text-slate-500 mt-1">Anexo · {f.documento ? `${f.documento.tipo} ${f.documento.identificador}` : f.nome.split('.').pop()?.toUpperCase()} · {r.numero}</p></div>
              {f.url ? <Button asChild size="sm" color="gray" className="shrink-0"><a href={f.url} target="_blank" rel="noopener noreferrer">Visualizar</a></Button> : f.documento ? <Button size="sm" color="gray" className="shrink-0" onClick={() => setDocumento(f.documento!)}>Visualizar metadados</Button> : <Button size="sm" color="gray" disabled className="shrink-0" title="Arquivo não disponível nesta sessão.">Visualizar</Button>}
            </li>)}
          </ul> : <p className="text-xs text-slate-500">Nenhum documento relacionado disponível.</p>}
        </Section><p className="text-xs text-slate-500">GeoBahia: integração pendente.</p>
      </div> : <p role="alert" className="text-xs text-rose-700">{MSG[33]}</p>)}
    </>}
    <DialogFooter>{relacionado || documento ? <Button color="gray" size="sm" onClick={() => { setRelacionado(null); setDocumento(null); }}>Voltar</Button> : confirmacao ? <><Button color="gray" size="sm" onClick={() => setConfirmacao(null)}>Cancelar</Button><Button size="sm" onClick={() => executar(confirmacao)}>Confirmar</Button></> : <>
      {visao !== 'acoes' && visao !== inicial && <Button color="gray" size="sm" onClick={() => { setVisao(inicial); setErro(''); }}>Voltar</Button>}
      <Button color="gray" size="sm" onClick={onClose}>{visao === 'acoes' || visao === 'visualizar' ? 'Fechar' : 'Cancelar'}</Button>
      {visao === 'duplicados' && <Button size="sm" disabled={!alvo || !podeExecutar(sessao, r, 'anexar')} onClick={() => setConfirmacao({ ...comando('anexar'), destino: alvo })}>Anexar</Button>}
      {visao === 'desanexar' && <Button size="sm" onClick={() => { if (!justificativa.trim()) setErro(MSG[20]); else { setErro(''); setConfirmacao({ ...comando('desanexar'), justificativa }); } }}>Desanexar</Button>}
      {visao === 'arquivar' && <Button size="sm" onClick={() => {
        if (!motivo || !justificativa.trim()) setErro(MSG[9]);
        else if (motivo === 'Outros' && !descricaoMotivo.trim()) setErro(MSG[10]);
        else { setErro(''); setConfirmacao({ ...comando('arquivar'), motivo, justificativa, descricaoMotivo }); }
      }}>Arquivar</Button>}
      {visao === 'encaminhar' && <Button size="sm" disabled={!destino} onClick={() => setConfirmacao({ ...comando('encaminhar'), destino })}>Encaminhar</Button>}
      {visao === 'eixo' && <Button size="sm" disabled={!eixo || !subitem} onClick={() => executar({ ...comando('eixo'), eixo, subitem })}>Salvar</Button>}
      {visao === 'comentario' && <Button size="sm" disabled={!comentario.trim()} onClick={() => executar({ ...comando('comentario'), comentario })}>Adicionar comentário</Button>}
      {visao === 'arquivos' && <Button size="sm" disabled={!arquivos.length} onClick={() => {
        const selecionados = arquivos.map(f => ({ nome: f.name, tamanho: f.size, url: URL.createObjectURL(f) }));
        executar({ ...comando('arquivos'), arquivos: selecionados });
        if (!enviado.current) selecionados.forEach(f => URL.revokeObjectURL(f.url));
      }}>Adicionar arquivo</Button>}
      {visao === 'geo' && espacial && <Button size="sm" disabled title={BLOQUEIOS_ACOES.geo}>Abrir GeoBahia</Button>}
    </>}</DialogFooter>
  </DialogContent></Dialog>;
}
