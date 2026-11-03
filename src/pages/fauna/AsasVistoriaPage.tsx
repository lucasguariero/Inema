import React, { useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Save,
  Plus,
  Trash2,
  Upload,
  Camera,
  FileText,
  ShieldCheck,
  Building,
  Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AsasItem, RecintoAsas, VistoriaAsas } from '@/types/faunaR3R4';
import { saveAsasItem, getAsasById } from '@/data/faunaR3R4Mock';
import { PerfilDemonstrativoFauna } from './AsasListPage';

interface AsasVistoriaPageProps {
  asasId: string;
  onVoltar: () => void;
  perfilAtivo: PerfilDemonstrativoFauna;
  onConcluido?: () => void;
}

export const AsasVistoriaPage: React.FC<AsasVistoriaPageProps> = ({
  asasId,
  onVoltar,
  perfilAtivo,
  onConcluido
}) => {
  const asas = getAsasById(asasId);

  const [numeroVistoria, setNumeroVistoria] = useState<string>(
    asas?.vistoria?.numero || `F-TEC-133/${new Date().getFullYear()}-0${Math.floor(10 + Math.random() * 90)}`
  );
  const [dataVistoria, setDataVistoria] = useState<string>(
    asas?.vistoria?.data || new Date().toISOString().slice(0, 10)
  );
  const [equipeTexto, setEquipeTexto] = useState<string>(
    asas?.vistoria?.equipe?.join(', ') || 'Mariana Lins (Bióloga INEMA), Roberto Freire (Eng. Florestal INEMA)'
  );
  const [ucAte3km, setUcAte3km] = useState<string>(
    asas?.vistoria?.ucAte3km || 'Parque Nacional da Chapada Diamantina (Zona de Amortecimento a 1,8 km)'
  );
  const [vegetacaoPct, setVegetacaoPct] = useState<number>(asas?.vistoria?.vegetacaoPct || 82);
  const [acoesAntropicas, setAcoesAntropicas] = useState<string>(
    asas?.vistoria?.acoesAntropicas?.join(', ') || 'Cerca perimetral conservada, estrada vicinal de baixo fluxo'
  );
  const [recursosHidricos, setRecursosHidricos] = useState<string>(
    asas?.vistoria?.recursosHidricos?.join(', ') || 'Nascente perene com mata ciliar preservada e açude'
  );
  const [especiesAdequadas, setEspeciesAdequadas] = useState<string>(
    asas?.vistoria?.especiesAdequadasTexto ||
      'Área com excelente potencial para aves silvestres da Caatinga e Cerrado (Psittacidae, Columbidae, Thraupidae) e pequenos mamíferos não ameaçados.'
  );

  // Recintos (Obrigatórios para Categoria II e III)
  const [recintos, setRecintos] = useState<RecintoAsas[]>(
    asas?.vistoria?.recintos || [
      {
        id: 'rec-01',
        nome: 'Recinto de Aclimatação Aves I',
        finalidade: 'Aclimatação',
        comprimentoM: 12,
        larguraM: 4,
        alturaM: 3.5,
        areaM2: 48,
        capacidadeIndividuos: 25
      }
    ]
  );

  const [resultado, setResultado] = useState<'Favorável' | 'Desfavorável'>(
    asas?.vistoria?.resultado || 'Favorável'
  );
  const [justificativa, setJustificativa] = useState<string>(
    asas?.vistoria?.justificativa ||
      'A propriedade apresenta cobertura vegetal nativa densa e contínua, disponibilidade abundante de água e recintos adequados às normas do INEMA.'
  );

  const [fotos, setFotos] = useState<string[]>(
    asas?.vistoria?.fotos || ['foto_recinto_01.jpg', 'foto_vegetacao_nativa.jpg']
  );

  const [novoRecinto, setNovoRecinto] = useState<{
    nome: string;
    finalidade: 'Aclimatação' | 'Readaptação' | 'Quarentena' | 'Manutenção';
    comprimento: number;
    largura: number;
    altura: number;
    capacidade: number;
  }>({
    nome: '',
    finalidade: 'Aclimatação',
    comprimento: 10,
    largura: 4,
    altura: 3,
    capacidade: 20
  });

  const [modalNovoRecintoAberto, setModalNovoRecintoAberto] = useState<boolean>(false);

  if (!asas) {
    return (
      <div className="p-8 text-center text-slate-500">
        <p>Área de Soltura não encontrada.</p>
        <Button onClick={onVoltar} className="mt-4">
          Voltar
        </Button>
      </div>
    );
  }

  const handleAdicionarRecinto = () => {
    if (!novoRecinto.nome.trim()) {
      alert('Informe o nome do recinto.');
      return;
    }
    const novo: RecintoAsas = {
      id: `rec-${Date.now()}`,
      nome: novoRecinto.nome,
      finalidade: novoRecinto.finalidade,
      comprimentoM: novoRecinto.comprimento,
      larguraM: novoRecinto.largura,
      alturaM: novoRecinto.altura,
      areaM2: novoRecinto.comprimento * novoRecinto.largura,
      capacidadeIndividuos: novoRecinto.capacidade
    };
    setRecintos([...recintos, novo]);
    setNovoRecinto({
      nome: '',
      finalidade: 'Aclimatação',
      comprimento: 10,
      largura: 4,
      altura: 3,
      capacidade: 20
    });
    setModalNovoRecintoAberto(false);
  };

  const handleRemoverRecinto = (id: string) => {
    setRecintos(recintos.filter((r) => r.id !== id));
  };

  const handleSalvarVistoria = (concluir: boolean = false) => {
    // RN-015: Categoria II e III exigem recintos
    if ((asas.categoria === 'Categoria II' || asas.categoria === 'Categoria III') && recintos.length === 0) {
      alert('Propriedades de Categoria II e III exigem o cadastramento de pelo menos um recinto na vistoria.');
      return;
    }

    if (fotos.length === 0) {
      alert('É obrigatório o anexo de pelo menos 1 registro fotográfico da vistoria.');
      return;
    }

    const vistoriaAtualizada: VistoriaAsas = {
      id: asas.vistoria?.id || `vist-${Date.now()}`,
      numero: numeroVistoria,
      data: dataVistoria,
      equipe: equipeTexto.split(',').map((s) => s.trim()).filter(Boolean),
      ucAte3km: ucAte3km.trim() || undefined,
      vegetacaoPct: Number(vegetacaoPct),
      vegetacaoHa: Number(((Number(vegetacaoPct) / 100) * (asas.delimitacao?.areaHa || 500)).toFixed(1)),
      acoesAntropicas: acoesAntropicas.split(',').map((s) => s.trim()).filter(Boolean),
      recursosHidricos: recursosHidricos.split(',').map((s) => s.trim()).filter(Boolean),
      recintos,
      especiesAdequadasTexto: especiesAdequadas,
      fotos,
      relatorioPdfNome: `Relatorio_Vistoria_${numeroVistoria.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`,
      resultado,
      justificativa,
      concluida: concluir
    };

    const asasAtualizada: AsasItem = {
      ...asas,
      vistoria: vistoriaAtualizada,
      dataUltimaVistoria: dataVistoria,
      historico: [
        ...asas.historico,
        {
          id: `h-${Date.now()}`,
          dataHora: new Date().toLocaleString('pt-BR'),
          usuario: perfilAtivo === 'cgfau' ? 'Dr. Herickles Almado' : 'Técnico de Vistoria',
          papel: 'Equipe de Vistoria',
          acao: concluir
            ? `Vistoria oficial F-TEC-133 homologada com parecer ${resultado}.`
            : `Rascunho de vistoria F-TEC-133 atualizado.`
        }
      ]
    };

    saveAsasItem(asasAtualizada);
    if (onConcluido) onConcluido();
    else onVoltar();
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12" data-testid="pagina-asas-vistoria">
      {/* Topbar com Retorno */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onVoltar}
            data-testid="btn-voltar-vistoria"
            className="w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
            title="Voltar"
            aria-label="Voltar"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-sm text-[#0F4C3A]">
                F-TEC-133 OFICIAL
              </span>
              <Badge variant="outline" className="text-[10px]">
                {asas.numero} — {asas.categoria}
              </Badge>
            </div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              Registro de Vistoria Técnica de ASAS
            </h1>
            <p className="text-xs text-slate-500">
              Imóvel: <strong>{asas.propriedade.nome}</strong> · {asas.propriedade.municipio} / BA
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleSalvarVistoria(false)}
            data-testid="btn-salvar-rascunho-vistoria"
            className="text-xs gap-1.5 h-9"
          >
            <Save className="w-3.5 h-3.5" /> Salvar Rascunho
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => handleSalvarVistoria(true)}
            data-testid="btn-concluir-vistoria"
            className="text-xs gap-1.5 h-9 bg-[#0F4C3A] hover:bg-[#0c3c2e] text-white"
          >
            <CheckCircle2 className="w-3.5 h-3.5" /> Homologar Vistoria F-TEC-133
          </Button>
        </div>
      </div>

      {/* Formulário Oficial F-TEC-133 */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-6 text-xs">
        {/* Identificação Geral da Vistoria */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3 pb-2 border-b border-slate-100 dark:border-slate-800">
            1. Identificação da Vistoria e Equipe Técnica
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Número do Laudo F-TEC-133 *
              </label>
              <input
                type="text"
                value={numeroVistoria}
                onChange={(e) => setNumeroVistoria(e.target.value)}
                data-testid="input-numero-vistoria"
                className="w-full h-9 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 px-3 text-xs font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">Data da Vistoria In Loco *</label>
              <input
                type="date"
                value={dataVistoria}
                onChange={(e) => setDataVistoria(e.target.value)}
                data-testid="input-data-vistoria"
                className="w-full h-9 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 px-3 text-xs font-mono"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Equipe Técnica de Vistoriadores (INEMA) *
              </label>
              <input
                type="text"
                value={equipeTexto}
                onChange={(e) => setEquipeTexto(e.target.value)}
                placeholder="Nomes e cargos separados por vírgula..."
                className="w-full h-9 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 px-3 text-xs"
              />
            </div>
          </div>
        </div>

        {/* 2. Vegetação e Unidades de Conservação */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3 pb-2 border-b border-slate-100 dark:border-slate-800">
            2. Cobertura Vegetal e Unidades de Conservação Próximas
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Vegetação Nativa Preservada (%) *
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={vegetacaoPct}
                  onChange={(e) => setVegetacaoPct(Number(e.target.value))}
                  data-testid="input-vegetacao-pct"
                  className="w-24 h-9 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 px-3 text-xs font-bold"
                />
                <span className="text-slate-500">% do total do imóvel</span>
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Unidade de Conservação (UC) ou RPPN em raio de até 3 km (RN-006)
              </label>
              <input
                type="text"
                value={ucAte3km}
                onChange={(e) => setUcAte3km(e.target.value)}
                placeholder="Nome da UC e distância estimada..."
                className="w-full h-9 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 px-3 text-xs"
              />
              <p className="text-[10px] text-slate-500 mt-1">
                * Conforme RN-006, proximidade ou sobreposição com UC gera aviso técnico e NÃO bloqueia a emissão do certificado.
              </p>
            </div>

            <div className="sm:col-span-3">
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Recursos Hídricos Naturais e Artificiais
              </label>
              <input
                type="text"
                value={recursosHidricos}
                onChange={(e) => setRecursosHidricos(e.target.value)}
                className="w-full h-9 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 px-3 text-xs"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Ações Antrópicas Observadas no Entorno
              </label>
              <input
                type="text"
                value={acoesAntropicas}
                onChange={(e) => setAcoesAntropicas(e.target.value)}
                className="w-full h-9 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 px-3 text-xs"
              />
            </div>
          </div>
        </div>

        {/* 3. Recintos e Instalações Físicas (Obrigatório Cat II e III) */}
        <div>
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                3. Recintos e Instalações (Obrigatórios para Categoria II e III)
              </h3>
              <p className="text-[11px] text-slate-500">
                Dimensões físicas, capacidade e finalidade dos recintos inspecionados.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setModalNovoRecintoAberto(true)}
              data-testid="btn-adicionar-recinto-vistoria"
              className="text-xs gap-1.5 h-8 text-[#0F4C3A]"
            >
              <Plus className="w-3.5 h-3.5" /> Adicionar Recinto
            </Button>
          </div>

          {recintos.length === 0 ? (
            <div className="p-4 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-center text-slate-400">
              Nenhum recinto adicionado. Se a área for Categoria II ou III, ao menos um recinto é mandatório.
            </div>
          ) : (
            <table className="w-full text-left border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
              <thead className="bg-slate-50 dark:bg-slate-800 text-slate-600 font-bold">
                <tr>
                  <th className="p-2.5">Nome do Recinto</th>
                  <th className="p-2.5">Finalidade</th>
                  <th className="p-2.5">Dimensões (C x L x A)</th>
                  <th className="p-2.5">Área (m²)</th>
                  <th className="p-2.5">Capacidade Máxima</th>
                  <th className="p-2.5 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {recintos.map((r) => (
                  <tr key={r.id}>
                    <td className="p-2.5 font-semibold text-slate-800 dark:text-slate-200">{r.nome}</td>
                    <td className="p-2.5">
                      <Badge variant="outline" className="text-[10px]">
                        {r.finalidade}
                      </Badge>
                    </td>
                    <td className="p-2.5 font-mono">
                      {r.comprimentoM}m x {r.larguraM}m x {r.alturaM}m
                    </td>
                    <td className="p-2.5 font-bold">{r.areaM2} m²</td>
                    <td className="p-2.5 font-mono text-emerald-800 font-bold">
                      {r.capacidadeIndividuos} indivíduos
                    </td>
                    <td className="p-2.5 text-right">
                      <button
                        onClick={() => handleRemoverRecinto(r.id)}
                        className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
                        title="Remover recinto"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* 4. Espécies e Grupos Adequados (RN-018: Texto Livre) */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2 pb-2 border-b border-slate-100 dark:border-slate-800">
            4. Espécies e Grupos Taxonômicos Adequados (RN-018)
          </h3>
          <p className="text-[11px] text-slate-500 mb-2">
            Descreva detalhadamente em texto livre os grupos e espécies que a área comporta, considerando vegetação,
            disponibilidade alimentar e ausência de predadores antrópicos. (Não utilizar catálogo fechado).
          </p>
          <textarea
            rows={3}
            value={especiesAdequadas}
            onChange={(e) => setEspeciesAdequadas(e.target.value)}
            data-testid="textarea-especies-adequadas"
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 p-3 text-xs"
          />
        </div>

        {/* 5. Fotos e Evidências */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2 pb-2 border-b border-slate-100 dark:border-slate-800">
            5. Evidências Fotográficas da Vistoria (Mínimo 1 obrigatória)
          </h3>
          <div className="flex flex-wrap items-center gap-3">
            {fotos.map((f, i) => (
              <div
                key={i}
                className="px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-300 dark:border-slate-700 flex items-center gap-2 text-slate-700 dark:text-slate-300 font-mono"
              >
                <Camera className="w-3.5 h-3.5 text-emerald-700" />
                <span>{f}</span>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFotos([...fotos, `foto_adicional_${Date.now()}.jpg`])}
              className="text-xs h-8 gap-1.5"
            >
              <Upload className="w-3.5 h-3.5" /> Anexar Foto
            </Button>
          </div>
        </div>

        {/* 6. Conclusão e Parecer */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 space-y-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            6. Parecer Técnico Conclusivo e Homologação
          </h3>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer font-bold text-emerald-800 text-xs">
              <input
                type="radio"
                name="resultadoVistoria"
                value="Favorável"
                checked={resultado === 'Favorável'}
                onChange={() => setResultado('Favorável')}
                data-testid="radio-resultado-favoravel"
                className="text-emerald-700 focus:ring-emerald-600"
              />
              <span>Resultado Favorável (Apta para Certificado)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer font-bold text-rose-800 text-xs">
              <input
                type="radio"
                name="resultadoVistoria"
                value="Desfavorável"
                checked={resultado === 'Desfavorável'}
                onChange={() => setResultado('Desfavorável')}
                data-testid="radio-resultado-desfavoravel"
                className="text-rose-700 focus:ring-rose-600"
              />
              <span>Resultado Desfavorável (Indeferimento)</span>
            </label>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Justificativa do Parecer Técnico *
            </label>
            <textarea
              rows={3}
              value={justificativa}
              onChange={(e) => setJustificativa(e.target.value)}
              data-testid="textarea-justificativa-parecer"
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white p-3 text-xs"
            />
          </div>
        </div>
      </div>

      {/* Modal para Adicionar Recinto */}
      {modalNovoRecintoAberto && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4"
        >
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 max-w-md w-full p-6 space-y-4 text-xs">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Cadastrar Novo Recinto de Manejo
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Nome / Identificação *</label>
                <input
                  type="text"
                  value={novoRecinto.nome}
                  onChange={(e) => setNovoRecinto({ ...novoRecinto, nome: e.target.value })}
                  placeholder="Ex: Viveiro de Voo Aves Caatinga"
                  className="w-full h-8 rounded-lg border border-slate-200 dark:border-slate-700 px-2.5 text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Finalidade *</label>
                <select
                  value={novoRecinto.finalidade}
                  onChange={(e) =>
                    setNovoRecinto({
                      ...novoRecinto,
                      finalidade: e.target.value as any
                    })
                  }
                  className="w-full h-8 rounded-lg border border-slate-200 dark:border-slate-700 px-2.5 text-xs"
                >
                  <option value="Aclimatação">Aclimatação</option>
                  <option value="Readaptação">Readaptação</option>
                  <option value="Quarentena">Quarentena</option>
                  <option value="Manutenção">Manutenção</option>
                </select>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">Comprimento (m)</label>
                  <input
                    type="number"
                    value={novoRecinto.comprimento}
                    onChange={(e) =>
                      setNovoRecinto({ ...novoRecinto, comprimento: Number(e.target.value) })
                    }
                    className="w-full h-8 rounded-lg border border-slate-200 dark:border-slate-700 px-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">Largura (m)</label>
                  <input
                    type="number"
                    value={novoRecinto.largura}
                    onChange={(e) => setNovoRecinto({ ...novoRecinto, largura: Number(e.target.value) })}
                    className="w-full h-8 rounded-lg border border-slate-200 dark:border-slate-700 px-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">Altura (m)</label>
                  <input
                    type="number"
                    value={novoRecinto.altura}
                    onChange={(e) => setNovoRecinto({ ...novoRecinto, altura: Number(e.target.value) })}
                    className="w-full h-8 rounded-lg border border-slate-200 dark:border-slate-700 px-2 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Capacidade de Indivíduos</label>
                <input
                  type="number"
                  value={novoRecinto.capacidade}
                  onChange={(e) => setNovoRecinto({ ...novoRecinto, capacidade: Number(e.target.value) })}
                  className="w-full h-8 rounded-lg border border-slate-200 dark:border-slate-700 px-2.5 text-xs"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setModalNovoRecintoAberto(false)}
                className="text-xs"
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleAdicionarRecinto}
                className="text-xs bg-[#0F4C3A] text-white"
              >
                Salvar Recinto
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
