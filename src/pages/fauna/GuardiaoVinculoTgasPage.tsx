import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  Award,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Plus,
  Trash2,
  FileText,
  ShieldCheck,
  ShieldAlert,
  Clock,
  Send,
  Building,
  UserCheck,
  Save
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AnimalIndicadoGuardiao, GuardiaoItem, LaudoTecnicoCetasLote, TgasDocumento } from '@/types/faunaR3R4';
import { saveGuardiaoItem, getGuardiaoById } from '@/data/faunaR3R4Mock';
import { FaunaDocumentModal, TipoDocumentoFauna } from './FaunaDocumentModal';

interface GuardiaoVinculoTgasPageProps {
  guardiaoId: string;
  onVoltar: () => void;
  perfilAtivo: 'cgfau' | 'cetas' | 'requerente';
  onConcluido?: () => void;
}

// Banco simulado de animais candidatos no CETAS Salvador (oriundos do DR008)
const ANIMAIS_CANDIDATOS_CETAS: AnimalIndicadoGuardiao[] = [
  {
    animalId: 'anim-cetas-01',
    numeroDigital: 'FAU-2026-0881',
    nomeComum: 'Papagaio-verdadeiro',
    nomeCientifico: 'Amazona aestiva',
    grupo: 'Aves',
    sexo: 'Fêmea',
    tipoMarcacao: 'Anilha Fechada',
    codigoMarcacao: 'BA-2026-AN-1092',
    situacaoAnimal: 'Sob guarda',
    anamnese: 'Apreensão do IBAMA em feira livre. Plumagem aparada cronicamente por mais de 5 anos.',
    exameFisicoSistemas: 'Atrofia muscular peitoral acentuada e perda funcional de voo.',
    avaliacaoComportamental: 'Animal dócil com imprinting humano acentuado; sem aversão a predadores.',
    justificativaImpossibilidadeSoltura:
      'Impossibilidade definitiva de soltura por incapacidade física de voo sustentado e docilidade extrema.',
    fotoUrl: 'papagaio_verdadeiro_02.jpg'
  },
  {
    animalId: 'anim-cetas-02',
    numeroDigital: 'FAU-2026-0882',
    nomeComum: 'Periquito-da-caatinga',
    nomeCientifico: 'Eupsittula cactorum',
    grupo: 'Aves',
    sexo: 'Macho',
    tipoMarcacao: 'Microchip',
    codigoMarcacao: '982.000.884.221.091',
    situacaoAnimal: 'Sob guarda',
    anamnese: 'Entregue voluntariamente em gaiola com histórico de domesticação.',
    exameFisicoSistemas: 'Fratura antiga consolidada na extremidade alar direita.',
    avaliacaoComportamental: 'Dependência total para alimentação.',
    justificativaImpossibilidadeSoltura: 'Deficiência alar permanente impedindo evasão.',
    fotoUrl: 'periquito_caatinga.jpg'
  },
  {
    animalId: 'anim-cetas-03',
    numeroDigital: 'FAU-2026-0883',
    nomeComum: 'Jabuti-piranga',
    nomeCientifico: 'Chelonoidis carbonarius',
    grupo: 'Répteis',
    sexo: 'Indeterminado',
    tipoMarcacao: 'Microchip',
    codigoMarcacao: '982.000.551.442.110',
    situacaoAnimal: 'Sob guarda',
    anamnese: 'Resgatado em área urbana após atropelamento com rachadura de carapaça.',
    exameFisicoSistemas: 'Carapaça tratada com resina cirúrgica consolidada.',
    avaliacaoComportamental: 'Alimentação adequada.',
    justificativaImpossibilidadeSoltura: 'Apto para guarda doméstica como animal de vida longa.',
    fotoUrl: 'jabuti_piranga.jpg'
  },
  // Animal Inválido: Sem marcação ativa (Para testar trava MSG005)
  {
    animalId: 'anim-cetas-sem-marca',
    numeroDigital: 'FAU-2026-9999',
    nomeComum: 'Canário-da-terra',
    nomeCientifico: 'Sicalis flaveola',
    grupo: 'Aves',
    sexo: 'Macho',
    tipoMarcacao: 'Sem marcação',
    codigoMarcacao: '',
    situacaoAnimal: 'Sob guarda',
    anamnese: 'Animal em triagem sem identificação física.',
    justificativaImpossibilidadeSoltura: 'Sem marcação.'
  },
  // Animal Inválido: Espécie Exótica/Invasora (Para testar trava MSG006)
  {
    animalId: 'anim-cetas-exotica',
    numeroDigital: 'FAU-2026-8888',
    nomeComum: 'Tigre-dágua-americano (Invasora)',
    nomeCientifico: 'Trachemys scripta elegans',
    grupo: 'Répteis',
    sexo: 'Macho',
    tipoMarcacao: 'Microchip',
    codigoMarcacao: '982.000.111.222.333',
    situacaoAnimal: 'Sob guarda',
    anamnese: 'Espécie exótica invasora proibida de guarda por particulares.',
    justificativaImpossibilidadeSoltura: 'Espécie exótica invasora.'
  }
];

export const GuardiaoVinculoTgasPage: React.FC<GuardiaoVinculoTgasPageProps> = ({
  guardiaoId,
  onVoltar,
  perfilAtivo,
  onConcluido
}) => {
  const guardiao = getGuardiaoById(guardiaoId);

  const [modalDocAberto, setModalDocAberto] = useState<boolean>(false);
  const [tipoDocModal, setTipoDocModal] = useState<TipoDocumentoFauna>('DR012-DOC001');

  // Animais já vinculados no TGAS vigente ou temporários
  const [animaisVinculados, setAnimaisVinculados] = useState<AnimalIndicadoGuardiao[]>(
    guardiao?.tgasVigente?.animaisSobGuarda || []
  );

  // Laudo Técnico em Lote
  const [laudoAssinado, setLaudoAssinado] = useState<boolean>(
    guardiao?.laudosCetas?.[0]?.assinado || false
  );
  const [msgErroLaudo, setMsgErroLaudo] = useState<string | null>(null);

  // Assinaturas do TGAS
  const [assGuardaConcluida, setAssGuardaConcluida] = useState<boolean>(
    guardiao?.tgasVigente?.assinaturaGuardiao?.concluida || false
  );
  const [assDgConcluida, setAssDgConcluida] = useState<boolean>(
    guardiao?.tgasVigente?.assinaturaDiretorGeral?.concluida || false
  );
  const [entregaConcluida, setEntregaConcluida] = useState<boolean>(
    Boolean(guardiao?.tgasVigente?.dataEntregaAnimais)
  );

  if (!guardiao) {
    return (
      <div className="p-8 text-center text-slate-500">
        <p>Guardião não encontrado.</p>
        <Button onClick={onVoltar} className="mt-4">
          Voltar
        </Button>
      </div>
    );
  }

  // Verifica se o termo está Vigente (Exige AMBAS as assinaturas, RN-017)
  const isTgasVigente = assGuardaConcluida && assDgConcluida;

  const handleAdicionarAnimal = (animal: AnimalIndicadoGuardiao) => {
    // Trava 1: Limite de 5 animais (RN-012 / MSG003)
    if (animaisVinculados.length >= 5) {
      alert('MSG003: Limite máximo legal atingido! É proibido vincular mais de 5 animais sob guarda por CPF/CNPJ e endereço (RN-012).');
      return;
    }

    // Trava 2: Animal sem marcação (RN-014 / MSG005)
    if (!animal.codigoMarcacao || animal.tipoMarcacao === 'Sem marcação') {
      alert('MSG005: O animal não possui marcação física ativa (anilha ou microchip). O vínculo ao guardião é bloqueado.');
      return;
    }

    // Trava 3: Espécie exótica ou invasora (RN-015 / MSG006)
    if (animal.nomeComum.includes('Invasora') || animal.nomeCientifico.includes('scripta')) {
      alert('MSG006: Espécies exóticas ou invasoras não são elegíveis para Termo de Guarda por particulares.');
      return;
    }

    // Já vinculado?
    if (animaisVinculados.some((a) => a.animalId === animal.animalId)) {
      alert('Este animal já está incluso na lista do termo.');
      return;
    }

    setAnimaisVinculados([...animaisVinculados, animal]);
    // Novo animal no termo exige nova assinatura e laudo complementar
    setLaudoAssinado(false);
  };

  const handleRemoverAnimal = (animalId: string) => {
    setAnimaisVinculados(animaisVinculados.filter((a) => a.animalId !== animalId));
  };

  const handleAssinarLaudoLote = () => {
    if (animaisVinculados.length === 0) {
      alert('Inclua pelo menos 1 animal no lote antes de assinar o laudo técnico do CETAS.');
      return;
    }
    setLaudoAssinado(true);
    setMsgErroLaudo(null);
  };

  const handleAssinarGuardiao = () => {
    setAssGuardaConcluida(true);
    alert('Assinatura do Guardião confirmada com sucesso via autenticação gov.br!');
  };

  const handleAssinarDiretorGeral = () => {
    if (!laudoAssinado) {
      setMsgErroLaudo('O Diretor-Geral só pode assinar o TGAS após a emissão e assinatura do Laudo Técnico pelo CETAS (RN-013).');
      return;
    }
    setAssDgConcluida(true);
    alert('Assinatura do Diretor-Geral confirmada via SEI-BA! O TGAS passa ao estado Vigente.');
  };

  const handleSalvarEstadoTermo = () => {
    // RN-013 / RN-019 / CA022: Novo animal em termo vigente exige a emissão e assinatura de novo Laudo Técnico
    if (!laudoAssinado) {
      const animalPendente = animaisVinculados[animaisVinculados.length - 1];
      const cod = animalPendente ? animalPendente.numeroDigital : 'indicado';
      setMsgErroLaudo(
        `MSG008: O animal ${cod} não possui Laudo Técnico do CETAS assinado. Emita ou anexe o laudo antes de vincular o animal. (RN-013)`
      );
      return;
    }
    setMsgErroLaudo(null);
    const laudoId = `laudo-${Date.now()}`;
    const novoLaudo: LaudoTecnicoCetasLote = {
      id: laudoId,
      numero: `LAUDO-CETAS-${new Date().getFullYear()}/0${Math.floor(10 + Math.random() * 90)}`,
      dataEmissao: new Date().toLocaleDateString('pt-BR'),
      veterinarioNome: 'Dr. Thiago Moreira',
      veterinarioCrmv: 'CRMV/BA 5512',
      animaisLote: animaisVinculados,
      assinado: laudoAssinado,
      dataAssinatura: laudoAssinado ? new Date().toLocaleString('pt-BR') : undefined
    };

    const novoTgas: TgasDocumento = {
      id: guardiao.tgasVigente?.id || `tgas-${Date.now()}`,
      numero: guardiao.tgasVigente?.numero || `TGAS-${new Date().getFullYear()}/00${Math.floor(10 + Math.random() * 90)}`,
      guardiaoId: guardiao.id,
      laudoTecnicoId: novoLaudo.id,
      dataEmissao: guardiao.tgasVigente?.dataEmissao || new Date().toLocaleDateString('pt-BR'),
      dataValidade: '2027-03-10',
      situacao: isTgasVigente ? 'Vigente' : 'Aguardando assinatura',
      animaisSobGuarda: animaisVinculados,
      assinaturaGuardiao: {
        concluida: assGuardaConcluida,
        data: assGuardaConcluida ? new Date().toLocaleString('pt-BR') : undefined,
        tipo: 'gov.br'
      },
      assinaturaDiretorGeral: {
        concluida: assDgConcluida,
        data: assDgConcluida ? new Date().toLocaleString('pt-BR') : undefined,
        processoSei: '015.1102.2026.0002341-99'
      },
      dataEntregaAnimais: entregaConcluida ? new Date().toLocaleDateString('pt-BR') : undefined
    };

    const atualizado: GuardiaoItem = {
      ...guardiao,
      tgasVigente: novoTgas,
      laudosCetas: [novoLaudo, ...guardiao.laudosCetas]
    };

    saveGuardiaoItem(atualizado);
    alert('Dados do Termo de Guarda e Laudo do CETAS salvos com sucesso.');
    if (onConcluido) onConcluido();
    else onVoltar();
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12" data-testid="pagina-guardiao-vinculo-tgas">
      {/* Topbar com Retorno */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onVoltar}
            data-testid="btn-voltar-vinculo"
            className="w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 flex items-center justify-center text-slate-600 cursor-pointer"
            title="Voltar"
            aria-label="Voltar"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-sm text-[#0F4C3A]">
                {guardiao.tgasVigente?.numero || 'NOVO TGAS'}
              </span>
              <Badge variant={isTgasVigente ? 'success' : 'warning'} dot>
                {isTgasVigente ? 'TGAS Vigente' : 'Aguardando Assinatura'}
              </Badge>
              <Badge variant="outline" className="text-[10px]">
                {animaisVinculados.length} / 5 animais
              </Badge>
            </div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              Vínculo de Animais e Termo de Guarda
            </h1>
            <p className="text-xs text-slate-500">
              Guardião: <strong>{guardiao.requerente.nomeOuRazaoSocial}</strong> · Recinto:{' '}
              {guardiao.recinto.municipio} / BA
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {animaisVinculados.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setTipoDocModal('DR012-DOC002');
                setModalDocAberto(true);
              }}
              data-testid="btn-ver-laudo-lote-a4"
              className="text-xs gap-1.5 h-9"
            >
              <FileText className="w-3.5 h-3.5" /> Laudo CETAS (DOC002)
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setTipoDocModal('DR012-DOC001');
              setModalDocAberto(true);
            }}
            data-testid="btn-ver-tgas-a4"
            className="text-xs gap-1.5 h-9 text-[#0F4C3A]"
          >
            <FileText className="w-3.5 h-3.5" /> Ver TGAS (DOC001)
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={handleSalvarEstadoTermo}
            data-testid="btn-salvar-tgas"
            className="text-xs gap-1.5 h-9 bg-[#0F4C3A] text-white"
          >
            <Save className="w-3.5 h-3.5" /> Salvar TGAS
          </Button>
        </div>
      </div>

      {/* Alerta de Pendência de Laudo Assinado (MSG008 / RN-013 / CA022) */}
      {msgErroLaudo && (
        <div
          data-testid="alerta-msg008-sem-laudo"
          className="p-3 bg-rose-50 border border-rose-300 rounded-xl text-rose-950 text-xs font-semibold flex items-center gap-2.5 shadow-xs"
        >
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
          <div>
            <strong className="text-rose-900 block">Exigência Legal de Laudo Técnico (RN-013 / RN-019):</strong>
            <span>{msgErroLaudo}</span>
          </div>
        </div>
      )}

      {/* 1. SELEÇÃO DE ANIMAIS CANDIDATOS DO CETAS (DR008) */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4 text-xs">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              1. Indicação de Animais pelo CETAS Salvador (DR008)
            </h3>
            <p className="text-[11px] text-slate-500">
              Espécies brasileiras sem condições de vida livre. Limite rigoroso de até 5 animais por guardião e
              endereço (RN-012).
            </p>
          </div>
          <Badge variant={animaisVinculados.length >= 5 ? 'danger' : 'success'}>
            Ocupação do Termo: {animaisVinculados.length} de 5 animais
          </Badge>
        </div>

        {/* Tabela de Animais Vinculados ao Guardião */}
        <div className="space-y-2">
          <h4 className="font-bold text-slate-800 dark:text-slate-200 text-xs">
            Animais Atualmente Vinculados a este Termo:
          </h4>
          {animaisVinculados.length === 0 ? (
            <div className="p-4 border border-dashed border-slate-300 rounded-xl text-center text-slate-400">
              Nenhum animal vinculado ainda. Selecione na lista do CETAS abaixo.
            </div>
          ) : (
            <table className="w-full text-left border border-slate-200 rounded-xl overflow-hidden">
              <thead className="bg-slate-50 text-slate-600 font-bold">
                <tr>
                  <th className="p-2.5">Nº Digital</th>
                  <th className="p-2.5">Espécie</th>
                  <th className="p-2.5">Marcação Física</th>
                  <th className="p-2.5">Sexo</th>
                  <th className="p-2.5">Motivo da Inaptidão para Soltura</th>
                  <th className="p-2.5 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {animaisVinculados.map((a) => (
                  <tr key={a.animalId} data-testid={`linha-animal-vinculado-${a.animalId}`}>
                    <td className="p-2.5 font-mono font-bold text-slate-800">{a.numeroDigital}</td>
                    <td className="p-2.5">
                      <strong>{a.nomeComum}</strong> (<em>{a.nomeCientifico}</em>)
                    </td>
                    <td className="p-2.5 font-mono text-emerald-800">
                      {a.tipoMarcacao}: {a.codigoMarcacao}
                    </td>
                    <td className="p-2.5">{a.sexo}</td>
                    <td className="p-2.5 text-slate-600 max-w-xs truncate">
                      {a.justificativaImpossibilidadeSoltura}
                    </td>
                    <td className="p-2.5 text-right">
                      <button
                        onClick={() => handleRemoverAnimal(a.animalId)}
                        data-testid={`btn-remover-animal-${a.animalId}`}
                        className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
                        title="Remover animal do termo"
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

        {/* Tabela de Candidatos Disponíveis no CETAS */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <h4 className="font-bold text-slate-800 dark:text-slate-200 text-xs">
            Animais Disponíveis para Indicação no CETAS:
          </h4>
          <table className="w-full text-left border border-slate-200 rounded-xl overflow-hidden bg-slate-50/50">
            <thead className="bg-slate-100 text-slate-600 font-bold">
              <tr>
                <th className="p-2.5">Nº Digital</th>
                <th className="p-2.5">Espécie</th>
                <th className="p-2.5">Marcação</th>
                <th className="p-2.5">Anamnese do CETAS</th>
                <th className="p-2.5 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {ANIMAIS_CANDIDATOS_CETAS.map((cand) => {
                const jaAdicionado = animaisVinculados.some((a) => a.animalId === cand.animalId);
                const isSemMarca = cand.tipoMarcacao === 'Sem marcação';
                const isExotica = cand.nomeComum.includes('Invasora');

                return (
                  <tr key={cand.animalId} data-testid={`linha-candidato-cetas-${cand.animalId}`}>
                    <td className="p-2.5 font-mono font-bold text-slate-700">{cand.numeroDigital}</td>
                    <td className="p-2.5">
                      <strong className={isExotica ? 'text-rose-600' : ''}>{cand.nomeComum}</strong> (
                      <em>{cand.nomeCientifico}</em>)
                    </td>
                    <td className="p-2.5 font-mono">
                      {isSemMarca ? (
                        <span className="text-rose-600 font-bold">Sem marcação</span>
                      ) : (
                        `${cand.tipoMarcacao}: ${cand.codigoMarcacao}`
                      )}
                    </td>
                    <td className="p-2.5 text-slate-500 max-w-xs truncate">{cand.anamnese}</td>
                    <td className="p-2.5 text-right">
                      <Button
                        variant={isSemMarca || isExotica ? 'danger' : 'outline'}
                        size="sm"
                        disabled={jaAdicionado}
                        onClick={() => handleAdicionarAnimal(cand)}
                        data-testid={`btn-vincular-animal-${cand.animalId}`}
                        className="h-7 text-[10px] gap-1"
                      >
                        {jaAdicionado ? 'Incluso' : <><Plus className="w-3 h-3" /> Indicar</>}
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. LAUDO TÉCNICO DO CETAS EM LOTE (DOC002) */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4 text-xs">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              2. Laudo Técnico Veterinário do CETAS em Lote (DOC002 — RN-013)
            </h3>
            <p className="text-[11px] text-slate-500">
              O Médico Veterinário emite um único laudo técnico para todo o lote indicado ao mesmo guardião.
            </p>
          </div>
          <Badge variant={laudoAssinado ? 'success' : 'warning'}>
            {laudoAssinado ? 'Laudo Assinado pelo Veterinário' : 'Assinatura Pendente'}
          </Badge>
        </div>

        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
          <p className="leading-relaxed text-slate-700">
            O Laudo DOC002 consolida os exames clínicos por sistemas, histórico e avaliação comportamental dos{' '}
            <strong>{animaisVinculados.length}</strong> animal(is) selecionados para o guardião{' '}
            <strong>{guardiao.requerente.nomeOuRazaoSocial}</strong>.
          </p>

          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-500">
              Responsável Técnico do CETAS: <strong>Dr. Thiago Moreira — CRMV/BA 5512</strong>
            </span>
            {!laudoAssinado ? (
              <Button
                variant="primary"
                size="sm"
                onClick={handleAssinarLaudoLote}
                data-testid="btn-assinar-laudo-cetas-lote"
                className="bg-[#0F4C3A] text-white text-xs gap-1.5 h-8"
              >
                <CheckCircle2 className="w-3.5 h-3.5" /> Assinar Laudo do Lote (CRMV)
              </Button>
            ) : (
              <span className="text-emerald-700 font-bold flex items-center gap-1 text-[11px]">
                <CheckCircle2 className="w-4 h-4" /> Laudo Oficial Homologado
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 3. ASSINATURAS DO TGAS E ENTREGA (DOC001 — RN-017) */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4 text-xs">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              3. Assinaturas Obrigatórias do TGAS (DOC001 — RN-017)
            </h3>
            <p className="text-[11px] text-slate-500">
              O TGAS só passa ao estado <strong>Vigente</strong> com ambas as assinaturas (Guardião e Diretor-Geral).
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Assinatura 1: Guardião */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-bold text-slate-800">1. Assinatura do Guardião</span>
              <Badge variant={assGuardaConcluida ? 'success' : 'warning'}>
                {assGuardaConcluida ? 'Concluída' : 'Pendente'}
              </Badge>
            </div>
            <p className="text-[11px] text-slate-500">
              Assinatura eletrônica via gov.br ou termo físico digitalizado anexado.
            </p>
            {!assGuardaConcluida ? (
              <Button
                variant="outline"
                size="sm"
                onClick={handleAssinarGuardiao}
                data-testid="btn-assinar-guardiao-tgas"
                className="w-full text-xs h-8 text-emerald-800 border-emerald-400"
              >
                Registrar Assinatura do Guardião (gov.br)
              </Button>
            ) : (
              <p className="text-[11px] text-emerald-700 font-bold">Assinado pelo Guardião via gov.br</p>
            )}
          </div>

          {/* Assinatura 2: Diretor-Geral */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-bold text-slate-800">2. Assinatura do Diretor-Geral (SEI-BA)</span>
              <Badge variant={assDgConcluida ? 'success' : 'warning'}>
                {assDgConcluida ? 'Concluída' : 'Pendente'}
              </Badge>
            </div>
            <p className="text-[11px] text-slate-500">
              Homologação formal pelo Diretor-Geral do INEMA no processo SEI-BA.
            </p>
            {!assDgConcluida ? (
              <Button
                variant="outline"
                size="sm"
                onClick={handleAssinarDiretorGeral}
                data-testid="btn-assinar-dg-tgas"
                className="w-full text-xs h-8 text-emerald-800 border-emerald-400"
              >
                Registrar Assinatura do Diretor-Geral (SEI)
              </Button>
            ) : (
              <p className="text-[11px] text-emerald-700 font-bold">Homologado pelo Diretor-Geral</p>
            )}
          </div>
        </div>

        {/* Entrega Física dos Animais (Bloqueada se não estiver Vigente) */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h4 className="font-bold text-slate-900">
              Entrega Física dos Animais pelo CETAS (RN-017)
            </h4>
            <p className="text-[11px] text-slate-500">
              A entrega presencial ao guardião somente é autorizada após o TGAS atingir o estado <strong>Vigente</strong>.
            </p>
          </div>

          {entregaConcluida ? (
            <Badge variant="success" dot className="text-xs">
              Animais Entregues ao Guardião
            </Badge>
          ) : (
            <Button
              variant="primary"
              size="sm"
              disabled={!isTgasVigente}
              onClick={() => {
                setEntregaConcluida(true);
                alert('Entrega física dos animais registrada com sucesso! Termo em plena execução.');
              }}
              data-testid="btn-confirmar-entrega-animais"
              className="text-xs gap-1.5 h-9 bg-[#0F4C3A] text-white disabled:opacity-50"
            >
              <CheckCircle2 className="w-3.5 h-3.5" /> Confirmar Entrega Física no CETAS
            </Button>
          )}
        </div>
      </div>

      {/* Modal Visualizador A4 de Documentos */}
      {modalDocAberto && (
        <FaunaDocumentModal
          isOpen={modalDocAberto}
          onClose={() => setModalDocAberto(false)}
          tipo={tipoDocModal}
          guardiao={guardiao}
        />
      )}
    </div>
  );
};
