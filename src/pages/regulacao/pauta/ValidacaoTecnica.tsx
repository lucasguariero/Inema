import React from 'react';
import { ChevronLeft, ChevronRight, Download, Eye, History, Map } from 'lucide-react';
import { Badge, Button, FilamentWizard, Section, InputWrapper, GlaTable, GlaTableHead, GlaTableRow, GlaTableBody, GlaTh, GlaTd } from '@/components/filament';
import { pautaParecerAtual, type PautaProcesso } from '@/data/pautaCoordenador';
import { SeiaV2PageHeader } from '@/components/seia-v2/SeiaV2PageHeader';
import type { PautaMode } from '@/data/pautaTecnica';
import { PautaStatus } from './PautaArea';

export interface ValidacaoDraft { notes: string; step: number; savedAt?: string }
export function ValidacaoTecnica({ mode, processo: p, draft, onChange, onStep, onSave, onBack, onHistory, onDocuments, onDownload }: {
  mode: PautaMode; processo: PautaProcesso; draft: ValidacaoDraft; onChange: (notes: string) => void; onStep: (step: number) => void;
  onSave: () => void; onBack: () => void; onHistory: () => void; onDocuments: (id?: string) => void; onDownload: () => void;
}) {
  const readOnly = mode === 'view';
  const parecerAtual = pautaParecerAtual(p);
  const summary = (title: string, headings: string[], rows: string[][]) => <Section key={title} heading={title} collapsible compact className="pd-summary-section"><GlaTable aria-label={title}><GlaTableHead><GlaTableRow>{headings.map(h => <GlaTh key={h}>{h}</GlaTh>)}</GlaTableRow></GlaTableHead><GlaTableBody>{rows.map((row, i) => <GlaTableRow key={i}>{row.map((cell, j) => <GlaTd key={j}>{cell}</GlaTd>)}</GlaTableRow>)}</GlaTableBody></GlaTable></Section>;
  return <>
    <SeiaV2PageHeader title={`${readOnly ? 'Visualização do Processo' : 'Validação Técnica do Processo'} — ${p.numero}`} subtitle={p.empreendimento}
      backButton={{ label: 'Voltar à Pauta', onClick: onBack }} badge={readOnly ? <Badge color="gray" size="sm">Somente leitura</Badge> : undefined}
      actions={<><Button color="gray" size="xs" onClick={onHistory}><History className="w-3.5 h-3.5" />Histórico de Ações</Button><Button color="gray" size="xs" onClick={() => onDocuments()}><History className="w-3.5 h-3.5" />Histórico de Processos</Button></>} />
    <section className="pd-validation" aria-label={readOnly ? 'Visualização do Processo' : 'Validação Técnica'}>
      <dl className="pd-process-details">{[['Nº Processo', p.numero], ['Requerente', p.requerente], ['CPF/CNPJ', 'Não informado · dado fictício'], ['Município', p.municipio], ['Ato atribuído', p.ato]].map(([label, value]) => <div key={label}><dt>{label}</dt><dd className={label === 'Nº Processo' ? 'font-mono' : ''}>{value}</dd></div>)}<div><dt>Situação/Status</dt><dd><PautaStatus value={p.status} /></dd></div><div><dt>Prazo</dt><dd><Badge size="xs" color="gray">52 dias · exemplo</Badge></dd></div></dl>
      <FilamentWizard steps={[{ id: 1, label: 'Resumo' }, { id: 2, label: 'Pendências' }, { id: 3, label: 'Decisão da Coordenação' }]} currentStep={draft.step} onStepClick={onStep} />
      <div className="pd-validation-content">
        {draft.step === 1 && <div className="pd-summary-stack">
          {summary('Dados do Empreendimento', ['Item', 'Área (ha)'], [['Propriedade', '0,020'], ['Área de Preservação Permanente (APP)', 'Não possui']])}
          {summary('Sobreposições', ['Item', 'Geometria'], [['Área de Preservação Permanente (APP)', 'Polígono']])}
          {summary('Atos e Tipologia', ['Divisão', 'Tipologia'], [['A – Agricultura e Florestas', 'Agricultura Irrigada']])}
          <div className={`pd-technical-result${parecerAtual ? '' : ' pd-documents-pending'}`}><h2>{parecerAtual ? 'Resultado da Análise Técnica' : 'Documentos do Processo'}</h2><div>{parecerAtual ? <p>Situação: <Badge color={p.id === 'p03' ? 'success' : 'gray'} size="xs">{parecerAtual.resultado}</Badge><span className="pd-muted"> · resultado demonstrativo, sem decisão administrativa</span></p> : <p className="pd-muted">Parecer da análise atual indisponível nos dados demonstrativos deste processo.</p>}<div className="pd-document-actions"><Button color="gray" size="xs" onClick={onDownload}><Download className="w-3.5 h-3.5" />Download do Processo</Button><Button color="gray" size="xs" disabled={!parecerAtual} title={!parecerAtual ? 'Parecer da análise atual indisponível neste processo demonstrativo' : undefined} onClick={() => parecerAtual && onDocuments('parecer')}><Eye className="w-3.5 h-3.5" />Visualizar Parecer Técnico</Button><Button color="gray" size="xs" onClick={() => onDocuments('geoespacial')}><Map className="w-3.5 h-3.5" />Análise Geoespacial</Button></div></div></div>
        </div>}
        {draft.step === 2 && <Section heading="Pendências do Processo" compact><div className="pd-step-notice"><h2>{p.status === 'Manifestações Pendentes' ? 'Manifestação pendente — exemplo' : 'Nenhuma pendência nos dados demonstrativos'}</h2><p>{p.status === 'Manifestações Pendentes' ? 'O exemplo ilustra uma manifestação ainda não recebida. Nenhum prazo ou obrigação de resposta foi definido neste protótipo.' : 'Este estado vazio pertence ao protótipo e não certifica a regularidade do processo.'}</p><Button color="gray" size="sm" onClick={() => onDocuments()}>Consultar documentos do processo</Button></div><p className="pd-muted">A lista de campos, ações e regras desta etapa não foi detalhada no grupo de referência.</p></Section>}
        {draft.step === 3 && <Section heading="Decisão da Coordenação" compact><div className="pd-step-notice"><Badge color="gray">Decisão não registrada</Badge><p>O resultado técnico não é uma decisão administrativa. Os campos, permissões e operações de decisão não foram especificados no material recebido.</p><p>{readOnly ? 'Consulta somente leitura dos documentos e das anotações salvas neste navegador.' : 'É possível consultar os documentos e salvar anotações como rascunho local.'} Nenhuma aprovação, assinatura ou tramitação será realizada.</p><Button color="gray" size="sm" disabled={!parecerAtual} title={!parecerAtual ? 'Parecer da análise atual indisponível neste processo demonstrativo' : undefined} onClick={() => parecerAtual && onDocuments('parecer')}>Consultar parecer técnico</Button></div></Section>}
        {draft.step > 1 && readOnly && <Section heading="Anotações salvas neste navegador" compact><p className="whitespace-pre-wrap break-words">{draft.notes || 'Nenhuma anotação salva neste navegador.'}</p><p className="pd-muted">Somente leitura · rascunho local, sem validade administrativa.</p></Section>}
        {draft.step > 1 && !readOnly && <div className="pd-draft-notes"><InputWrapper label="Anotações de consulta (opcional)" hint="Somente neste navegador. Não envia manifestação nem registra decisão."><textarea aria-label="Anotações de consulta" value={draft.notes} onChange={e => onChange(e.target.value)} maxLength={4000} rows={4} /></InputWrapper></div>}
      </div>
      <footer className="pd-validation-footer"><Button color="gray" size="sm" onClick={onBack}>{readOnly ? 'Fechar consulta' : 'Cancelar'}</Button>{!readOnly && <Button color="gray" size="sm" onClick={onSave}>Salvar Rascunho</Button>}<Button color="gray" size="sm" disabled={draft.step === 1} onClick={() => onStep(draft.step - 1)}><ChevronLeft className="w-4 h-4" />Anterior</Button>{draft.step < 3 ? <Button size="sm" onClick={() => onStep(draft.step + 1)}>Próximo<ChevronRight className="w-4 h-4" /></Button> : <Button size="sm" onClick={onBack}>Voltar à Pauta</Button>}</footer>
    </section>
  </>;
}
