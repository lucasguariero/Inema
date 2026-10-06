import { useRef, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Section } from '@/components/filament/Section';
import { InputWrapper } from '@/components/filament/InputWrapper';
import { FilamentSelect } from '@/components/filament/Select';
import { TableContainer } from '@/components/filament/Table';
import { GlaTable, GlaTableHead, GlaTh, GlaTableBody, GlaTableRow, GlaTd } from '@/components/common/GlaTable';
import { GlaRadioGroup } from '@/components/gla/primitives/GlaRadioGroup';
import { Button } from '@/components/ui/button';
import { diasEmAberto, type RegistroPauta } from '@/data/pautaGestorMock';
import { ACOES, MSG, duplicidades, podeExecutar, referenciaEspacial, EIXOS, MOTIVOS_ARQUIVAMENTO, DESTINOS_SIMULADOS, EXTENSOES_ARQUIVOS, arquivoPermitido, type AcaoPauta, type ComandoPauta, type SessaoPauta } from '@/lib/pautaGestor';

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
  const [tipoDestino, setTipoDestino] = useState('');
  const fileInput = useRef<HTMLInputElement>(null);
  const enviado = useRef(false);
  const versoes = useRef(Object.fromEntries(registros.map(item => [item.id, item.versao])));
  const comando = (acao: AcaoPauta): ComandoPauta => ({ acao, id: r.id, versao: r.versao, versoes: versoes.current });
  const executar = (c: ComandoPauta) => {
    if (enviado.current) return;
    enviado.current = true;
    try { onExecutar(c); } catch (error) { setErro(error instanceof Error ? error.message : MSG[31]); enviado.current = false; setConfirmacao(null); }
  };
  const candidatos = duplicidades(r, registros);
  const espacial = referenciaEspacial(r);
  const pai = registros.find(item => item.id === r.pai);
  const titulo = confirmacao ? 'Confirmar operação' : visao === 'acoes' ? 'Ações do Registro' : visao === 'duplicados' ? 'Possíveis Duplicidades' : visao === 'visualizar' ? 'Detalhes do Registro' : ACOES[visao as AcaoPauta];
  const textoConfirmacao = confirmacao?.acao === 'anexar' ? MSG[16] : confirmacao?.acao === 'arquivar' ? MSG[11] : confirmacao?.acao === 'encaminhar' ? `Encaminhar para ${confirmacao.destino}` : MSG[19];
  const leitura = (label: string, value: React.ReactNode) => <div><dt className="text-xs text-slate-500 mb-1">{label}</dt><dd className="text-xs text-slate-800 break-words">{value === '' || value === undefined || value === null ? '—' : value}</dd></div>;
  const selecao = (label: string, value: string, onChange: (value: string) => void, options: string[]) => <InputWrapper label={label} required className="border-0 shadow-none overflow-visible"><FilamentSelect ariaLabel={label} value={value} onChange={onChange} options={options} className="pauta-select" placeholder="Selecione..." /></InputWrapper>;
  const texto = (label: string, value: string, onChange: (value: string) => void, obrigatorio = true) => <InputWrapper label={label} required={obrigatorio}><textarea aria-label={label} value={value} onChange={e => onChange(e.target.value)} className="fi-input w-full min-h-24 p-3 text-xs outline-none bg-transparent" /></InputWrapper>;
  return <Dialog open onOpenChange={open => { if (!open) onClose(); }}><DialogContent className="pauta-dialog max-w-3xl" onCloseAutoFocus={e => { e.preventDefault(); onRestoreFocus(); }}><DialogHeader><DialogTitle>{titulo}</DialogTitle><DialogDescription className="font-mono">{r.numero}</DialogDescription></DialogHeader>
    {erro && <p role="alert" className="text-xs text-rose-700">{erro}</p>}
    {confirmacao ? <p className="text-sm">{textoConfirmacao}</p> : <>
      {visao === 'acoes' && <div className="grid sm:grid-cols-2 gap-2">{(Object.keys(ACOES) as AcaoPauta[]).filter(acao => acao !== 'anexar' && podeExecutar(sessao, r, acao)).map(acao => <Button color="gray" size="md" className="justify-start" key={acao} onClick={() => { setVisao(acao); setErro(''); }}>{ACOES[acao]}</Button>)}</div>}
      {visao === 'visualizar' && <div className="space-y-4">
        <Section compact heading="Dados do registro"><dl className="grid sm:grid-cols-2 gap-4">{leitura('Tipo do Registro', r.tipo)}{leitura('Status/Situação', r.status)}{leitura('Data', r.data.split('-').reverse().join('/'))}{leitura('Origem', r.origem)}{leitura('Município', r.municipio)}{leitura('Dias em Aberto', diasEmAberto(r))}{leitura('Demandante', r.demandante)}{leitura('Classificação', [r.eixo, r.subitem, r.emergencia].filter(Boolean).join(' / '))}</dl></Section>
        <Section compact heading="Descrição"><p className="text-xs leading-relaxed">{r.descricao}</p></Section>
        {(r.coordenada || r.coordenadaDocumento) && <Section compact heading="Coordenada"><a href="#informacoes-geoespaciais" className="text-xs text-[var(--color-text-link)] underline underline-offset-2" onClick={e => { e.preventDefault(); setVisao('geo'); }}>{(r.coordenada || r.coordenadaDocumento)?.lat.toFixed(6)}, {(r.coordenada || r.coordenadaDocumento)?.lng.toFixed(6)}</a>{r.coordenadaDocumento && !r.coordenada && <p className="text-xs text-slate-500 mt-1">{r.coordenadaDocumento.documento}</p>}</Section>}
        <Section compact heading="Arquivos">{r.arquivos.length ? <ul className="space-y-2 text-xs">{r.arquivos.map((f, i) => <li key={i}>{f.url ? <a href={f.url} download={f.nome} className="text-[var(--color-text-link)] underline">{f.nome}</a> : f.nome}</li>)}</ul> : <p className="text-xs text-slate-500">Nenhum arquivo anexado.</p>}</Section>
        <Section compact heading="Histórico"><ol className="space-y-3">{r.historico.map((h, i) => <li key={i} className="text-xs border-b border-slate-100 pb-3 last:border-0"><p className="font-semibold">{h.acao}</p><p className="text-slate-500 mt-1">{new Date(h.data).toLocaleString('pt-BR')} · {h.usuario} · {h.perfil}</p>{h.anterior && <p className="mt-1">Anterior: {h.anterior}</p>}{h.novo && <p className="mt-1">{h.novo}</p>}{h.justificativa && <p className="mt-1">Justificativa: {h.justificativa}</p>}<p className="mt-1 text-slate-500">{h.resultado}</p></li>)}</ol></Section>
      </div>}
      {visao === 'duplicados' && <>
        <GlaRadioGroup name="duplicidade" label="Registros e processos com possível duplicidade" value={alvo} onChange={setAlvo} options={candidatos.map(c => ({ value: c.id, label: c.numero, description: `${'tipo' in c ? c.status : 'Processo'} · ${c.data.split('-').reverse().join('/')} · ${c.municipio}` }))} />
        {!candidatos.length && <p className="text-xs text-slate-500">Nenhum registro relacionado disponível.</p>}
        <p className="text-xs text-slate-500">Entre registros, o mais antigo será a Referência Principal. Ao anexar a um processo, o processo será a referência.</p>
      </>}
      {visao === 'desanexar' && <><p className="text-xs">Referência Principal: <span className="font-mono">{pai?.numero || r.processo || r.pai}</span></p><InputWrapper label="Justificativa" required><textarea aria-label="Justificativa" className="fi-input w-full min-h-24 p-3 text-xs outline-none bg-transparent" value={justificativa} onChange={e => setJustificativa(e.target.value)} /></InputWrapper></>}
      {visao === 'arquivar' && <div className="space-y-4">{selecao('Motivo do arquivamento', motivo, setMotivo, MOTIVOS_ARQUIVAMENTO)}{motivo === 'Outros' && texto('Descrição do motivo', descricaoMotivo, setDescricaoMotivo)}{texto('Justificativa', justificativa, setJustificativa)}</div>}
      {visao === 'encaminhar' && selecao('Destino', destino, setDestino, DESTINOS_SIMULADOS)}
      {visao === 'eixo' && <div className="grid sm:grid-cols-2 gap-4">{selecao('Eixo Temático', eixo, v => { setEixo(v); setSubitem(''); }, Object.keys(EIXOS))}{selecao('Subitem', subitem, setSubitem, EIXOS[eixo] || [])}</div>}
      {visao === 'comentario' && texto('Comentário', comentario, setComentario, false)}
      {visao === 'arquivos' && <div className="space-y-4">
        <InputWrapper label="Arquivos" className="border-0 shadow-none"><input ref={fileInput} type="file" aria-label="Selecionar arquivos" multiple accept={EXTENSOES_ARQUIVOS.map(e => `.${e}`).join(',')} className="sr-only" onChange={e => {
          const files = Array.from(e.target.files || []);
          if (files.some(f => !arquivoPermitido(f.name))) { setErro(MSG[32]); setArquivos([]); }
          else { setArquivos(files); setErro(''); }
        }} /><Button size="sm" color="gray" onClick={() => fileInput.current?.click()}>Selecionar arquivos</Button></InputWrapper>
        <p className="text-xs text-slate-500">Formatos permitidos: {EXTENSOES_ARQUIVOS.join(', ')}.</p>
        {(arquivos.length > 0 || r.arquivos.length > 0) && <TableContainer><GlaTable><GlaTableHead><GlaTableRow><GlaTh>Arquivo</GlaTh><GlaTh>Tamanho</GlaTh></GlaTableRow></GlaTableHead><GlaTableBody>{[...r.arquivos.map(f => ({ name: f.nome, size: f.tamanho })), ...arquivos].map((f, i) => <GlaTableRow key={i}><GlaTd>{f.name}</GlaTd><GlaTd>{(f.size / 1024).toLocaleString('pt-BR', { maximumFractionDigits: 1 })} KB</GlaTd></GlaTableRow>)}</GlaTableBody></GlaTable></TableContainer>}
      </div>}
      {visao === 'pdf' && <p className="text-xs leading-relaxed">A geração do PDF com os arquivos incorporados depende do serviço documental do GLA. Este protótipo não emite o documento oficial nem substitui essa geração por impressão da tela.</p>}
      {visao === 'processo' && <p className="text-xs leading-relaxed">O fluxo de formação de processo (PE003) não está detalhado no DOR011. A operação deverá incluir todos os registros relacionados e preservar a referência principal. Não será criado um processo fictício ou um formulário sem o documento desse fluxo.</p>}
      {visao === 'oficio' && <p className="text-xs leading-relaxed">O modelo oficial editável, a numeração e o fluxo posterior do ofício aguardam definição (RN041). Nenhum documento é emitido e o status do registro permanece inalterado.</p>}
      {visao === 'converter' && <div className="space-y-4">{selecao('Tipo de destino', tipoDestino, setTipoDestino, ['RD', 'RE', 'RT'].filter(t => t !== r.tipo))}{tipoDestino && <p className="text-xs">{MSG[26].replace('{tipoDestino}', tipoDestino)}</p>}<p className="text-xs text-slate-500">A conclusão depende da validação dos campos obrigatórios do documento do tipo de destino (RN044). Sem essa definição, o protótipo preserva o registro original.</p></div>}
      {visao === 'geo' && (espacial ? <div className="space-y-4"><Section compact heading="Visualizar informações geoespaciais"><dl className="grid sm:grid-cols-2 gap-4">{leitura('Fonte da referência', espacial.fonte)}{leitura('Município', espacial.municipio)}{espacial.coordenada && leitura('Coordenada', `${espacial.coordenada.lat.toFixed(6)}, ${espacial.coordenada.lng.toFixed(6)}`)}</dl></Section><p className="text-xs text-slate-500">A referência e o contexto do registro foram preservados. A abertura do ambiente interno exige o contrato de integração e a autenticação do GeoBahia.</p></div> : <p role="alert" className="text-xs text-rose-700">{MSG[33]}</p>)}
    </>}
    <DialogFooter>{confirmacao ? <><Button color="gray" size="sm" onClick={() => setConfirmacao(null)}>Cancelar</Button><Button size="sm" onClick={() => executar(confirmacao)}>Confirmar</Button></> : <>
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
      }}>Adicionar arquivos</Button>}
      {visao === 'geo' && espacial && <Button size="sm" onClick={() => setErro(MSG[34])}>Abrir GeoBahia</Button>}
    </>}</DialogFooter>
  </DialogContent></Dialog>;
}
