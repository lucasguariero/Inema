import { Section } from '@/components/filament/Section';
import { InputWrapper } from '@/components/filament/InputWrapper';
import { FilamentSelect } from '@/components/filament/Select';
import { Button } from '@/components/ui/button';
import municipiosBahia from '@/data/municipiosBahia.json';
import type { GuiaPauta, RegistroPauta } from '@/data/pautaGestorMock';
import { aplicaEm, itemAutorizado, AREAS, EIXOS, EMERGENCIAS, ORIGENS, ORIGENS_COM_SETOR, STATUS, MSG, LEG, type FiltrosPauta, type GrupoFiltro, type SessaoPauta } from '@/lib/pautaGestor';

interface Props {
  guia: GuiaPauta; filtros: FiltrosPauta; registros: RegistroPauta[]; erro: string; sessao: SessaoPauta;
  onChange: (f: FiltrosPauta) => void; onGrupo: (g: GrupoFiltro, aberto: boolean) => void;
  onConsultar: () => void; onLimpar: () => void;
}
export function PautaFiltros({ guia, filtros: f, registros: dados, sessao, erro, onChange, onGrupo, onConsultar, onLimpar }: Props) {
  const registros = dados.filter(r => itemAutorizado(sessao, r) && (guia === 'Todos' || r.tipo === guia));
  const orgaos = [...new Set(registros.filter(r => !f.origem || r.origem === f.origem).map(r => r.orgao))];
  const setores = [...new Set(registros.filter(r => r.origem === f.origem && (!f.orgao || r.orgao === f.orgao)).map(r => r.setor))];
  const alterar = (campo: keyof FiltrosPauta, valor: string) => {
    const next = { ...f, [campo]: valor };
    if (campo === 'origem') {
      const compativeis = registros.filter(r => r.origem === valor || !valor);
      if (!compativeis.some(r => r.orgao === next.orgao)) next.orgao = '';
      next.setor = '';
    }
    if (campo === 'orgao') next.setor = '';
    if (campo === 'eixo') next.subitem = '';
    onChange(next);
  };
  const legendas: Partial<Record<keyof FiltrosPauta, number>> = { origem: 1, setor: 3, municipio: 4, inicial: 5, numero: 6, palavra: 7, demandante: 8, coordenada: 9, status: 10, eixo: 11, area: 12, dias: 13, emergencia: 14, uc: 15 };
  const hint = (campo: keyof FiltrosPauta) => legendas[campo] && <span id={`leg-filtro-${legendas[campo]}`} data-leg={legendas[campo]} className="pauta-helper">{LEG[legendas[campo]!]}</span>;
  const select = (campo: keyof FiltrosPauta, label: string, options: string[]) => <InputWrapper key={campo} label={label} hint={hint(campo)} className="border-0 shadow-none overflow-visible">
    <FilamentSelect id={`filtro-${campo}`} ariaLabel={label} value={f[campo]} onChange={v => alterar(campo, v)} options={[...(campo === 'formato' ? [] : [{ value: '', label: 'Todos' }]), ...options.map(value => ({ value, label: value }))]} className="pauta-select" />
  </InputWrapper>;
  const input = (campo: keyof FiltrosPauta, label: string, tipo = 'text', placeholder?: string) => <InputWrapper key={campo} label={label} hint={hint(campo)} valid={!(erro === MSG[5] && ['inicial', 'final'].includes(campo)) && !(erro === MSG[6] && campo === 'coordenada') && !(erro.includes('CPF ou CNPJ') && campo === 'demandante')}>
    <input aria-label={label} aria-describedby={legendas[campo] ? `leg-filtro-${legendas[campo]}` : campo === 'final' ? 'leg-filtro-5' : undefined} type={tipo} className="fi-input block w-full h-9 px-3 text-xs bg-transparent outline-none" value={f[campo]} onChange={e => alterar(campo, e.target.value)} placeholder={placeholder} />
  </InputWrapper>;
  const grupo = (id: GrupoFiltro, titulo: string, campos: React.ReactNode) => <Section compact collapsible defaultCollapsed onCollapsedChange={c => onGrupo(id, !c)} heading={titulo} className="overflow-visible" key={id}>
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">{campos}</div>
  </Section>;
  return <div className="space-y-2">
    <p data-leg="22" className="pauta-helper">{LEG[22]}</p>
    {grupo('dados', 'Dados do registro', <>
      {aplicaEm(guia, ['RD', 'RE', 'RC']) && <>{select('origem', 'Origem', ORIGENS)}{select('orgao', 'Órgão', orgaos)}</>}
      {aplicaEm(guia, ['RD']) && ORIGENS_COM_SETOR.includes(f.origem) && select('setor', 'Setor de origem', setores)}
      {input('numero', 'Número do Registro')}{input('palavra', 'Palavra-chave')}
      {sessao.verDemandante && aplicaEm(guia, ['RD', 'RE', 'RC', 'RT']) && input('demandante', guia === 'RD' ? 'Denunciante' : guia === 'RE' || guia === 'RC' ? 'Comunicante' : guia === 'RT' ? 'Técnico' : 'Demandante', 'text', 'Nome ou CPF/CNPJ')}
    </>)}
    {grupo('localizacao', 'Localização', <>
      {select('municipio', 'Município', municipiosBahia.municipios.map(m => m.nome))}
      {select('formato', 'Formato da coordenada', ['Grau Decimal', 'Grau/Minuto/Segundo', 'UTM'])}
      {input('coordenada', 'Coordenada', 'text', f.formato === 'UTM' ? '24S 570000 8570000' : f.formato === 'Grau/Minuto/Segundo' ? '12°54\'36"S 38°21\'00"W' : '-12.910000, -38.350000')}
      {aplicaEm(guia, ['RD', 'RE', 'RA', 'RT']) && select('area', 'Área Atingida', AREAS)}
      {aplicaEm(guia, ['RT', 'RD', 'RE']) && select('uc', 'Unidade de Conservação', [...new Set(registros.map(r => r.uc).filter(Boolean))])}
    </>)}
    {grupo('periodo', 'Período e situação', <>
      {input('inicial', 'Data inicial', 'date')}{input('final', 'Data final', 'date')}
      {select('status', 'Status', guia === 'Todos' ? STATUS : [...new Set(registros.filter(r => r.tipo === guia).map(r => r.status))])}
      {select('dias', 'Dias em Aberto', ['0-89', '90-149', '150-180', '181+'])}
    </>)}
    {aplicaEm(guia, ['RD', 'RE', 'RT', 'RC', 'RA']) && grupo('classificacao', 'Classificação', <>
      {aplicaEm(guia, ['RD', 'RT', 'RC', 'RA']) && <>{select('eixo', 'Eixo Temático', Object.keys(EIXOS))}{select('subitem', 'Subitem', EIXOS[f.eixo] || [])}</>}
      {aplicaEm(guia, ['RE']) && select('emergencia', 'Tipo de Emergência', EMERGENCIAS)}
    </>)}
    {erro && <p role="alert" className="text-xs text-rose-700 pt-2">{erro}</p>}
    <div className="flex justify-end gap-2 pt-2"><Button size="md" color="gray" onClick={onLimpar}>Limpar filtros</Button><Button size="md" onClick={onConsultar}>Consultar</Button></div>
  </div>;
}
