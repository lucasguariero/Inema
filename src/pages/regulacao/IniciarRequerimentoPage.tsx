import React, { useState } from 'react';
import { FilamentWizard, type WizardStep } from '@/components/filament/Wizard';
import { GlaCard, GlaButton, GlaRadioGroup, GlaNotification, type GlaRadioOption } from '@/components/gla';
import { DIRRE_REQUEST_GROUPS, getAtoDetails } from '@/data/dirreRequestTypes';
import { cn } from '@/lib/utils';

const STEPS: WizardStep[] = [
  { id: 1, label: 'Identificação' },
  { id: 2, label: 'Tipo de Solicitação' },
  { id: 3, label: 'Questionário' },
];

const TIPO_SOLICITACAO_OPTIONS: GlaRadioOption[] = [
  { value: 'regularizacao', label: 'Regularização Ambiental do Empreendimento' },
  { value: 'atos-administrativos', label: 'Atos Administrativos Ambientais' },
  { value: 'dtrp', label: 'Declaração de Transporte de Resíduos Perigosos (DTRP)' },
  { value: 'inexigibilidade', label: 'Declaração de Inexigibilidade' },
  { value: 'reposicao-florestal', label: 'Cumprimento de Reposição Florestal' },
  { value: 'dqc', label: 'Declaração de Queima Controlada (DQC)' },
  { value: 'diap', label: 'Declaração de Intervenção em Área de Preservação Permanente (DIAP)' },
  { value: 'rfp', label: 'Registro de Floresta de Produção (RFP)' },
  { value: 'ape', label: 'Autorização por Procedimento Especial de Licenciamento (APE)' },
  { value: 'lac', label: 'Licença Ambiental por Adesão e Compromisso (LAC)' },
  { value: 'rcfp', label: 'Registro de Corte/Exploração de Florestas Plantadas (RCFP)' },
  { value: 'lac-posto', label: 'Licença Ambiental por Adesão e Compromisso (LAC) – Posto de Combustível' },
];

export const IniciarRequerimentoPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(2);
  const [tipoSolicitacao, setTipoSolicitacao] = useState<string>('atos-administrativos');
  const [selectedAtoId, setSelectedAtoId] = useState<string>('');
  const [notice, setNotice] = useState<{ title: string; message: string } | null>(null);

  const selectedTipoLabel =
    TIPO_SOLICITACAO_OPTIONS.find((opt) => opt.value === tipoSolicitacao)?.label || 'Não selecionado';
  const selectedAto = selectedAtoId ? getAtoDetails(selectedAtoId) : undefined;

  const handleTipoChange = (value: string) => {
    setTipoSolicitacao(value);
    if (value !== 'atos-administrativos') {
      setSelectedAtoId('');
    }
  };

  const handleCancelar = () => {
    setTipoSolicitacao('atos-administrativos');
    setSelectedAtoId('');
    setCurrentStep(2);
    setNotice({
      title: 'Seleção reiniciada',
      message: 'Os campos locais desta demonstração foram restaurados para o estado inicial.',
    });
  };

  const handleSalvarRascunho = () => {
    setNotice({
      title: 'Rascunho mantido na sessão',
      message: 'Demonstração local sem envio ou gravação em base corporativa.',
    });
  };

  return (
    <div className="space-y-6 pb-8">
      {notice && (
        <GlaNotification
          type="info"
          title={notice.title}
          message={notice.message}
          onClose={() => setNotice(null)}
        />
      )}

      <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
        Identificação do Solicitante
      </h1>

      <GlaCard noPadding>
        <FilamentWizard
          steps={STEPS}
          currentStep={currentStep}
          onStepClick={(step) => setCurrentStep(step)}
        />

        <div className="p-6 space-y-5">
          {currentStep === 1 && (
            <div className="space-y-4">
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                Etapa de identificação do solicitante do requerimento no portal legado.
              </p>
              <div className="pt-2 flex items-center justify-end">
                <GlaButton type="button" variant="primary" onClick={() => setCurrentStep(2)}>
                  Próximo
                </GlaButton>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Tipo de Solicitação<span className="text-rose-500 ml-0.5">*</span>
                </div>
                <GlaRadioGroup
                  name="tipoSolicitacao"
                  options={TIPO_SOLICITACAO_OPTIONS}
                  value={tipoSolicitacao}
                  onChange={handleTipoChange}
                />
              </div>

              {tipoSolicitacao === 'atos-administrativos' && (
                <div
                  data-testid="atos-administrativos-grupos"
                  className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 p-4 space-y-3"
                >
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-700 dark:text-slate-200">
                    Atos Administrativos Ambientais
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-start">
                    {DIRRE_REQUEST_GROUPS.map((group) => (
                      <fieldset
                        key={group.id}
                        data-testid={`grupo-${group.id}`}
                        className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 space-y-2"
                      >
                        <legend className="px-1 text-xs font-bold text-slate-800 dark:text-slate-100">
                          {group.label}
                        </legend>
                        <div className="space-y-1.5">
                          {group.entries.map((entry) => {
                            const isSelected = selectedAtoId === entry.id;
                            const radioId = `ato-${entry.id}`;
                            return (
                              <label
                                key={entry.id}
                                htmlFor={radioId}
                                className="flex items-start gap-2 cursor-pointer select-none text-xs py-0.5"
                              >
                                <div className="relative flex items-center justify-center mt-0.5 shrink-0">
                                  <input
                                    id={radioId}
                                    type="radio"
                                    name="atoAdministrativo"
                                    value={entry.id}
                                    checked={isSelected}
                                    onChange={() => setSelectedAtoId(entry.id)}
                                    className="peer sr-only"
                                  />
                                  <div
                                    className={cn(
                                      'w-4 h-4 rounded-full border transition-colors flex items-center justify-center',
                                      'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 shadow-2xs',
                                      'peer-checked:border-[#0F4C3A]',
                                      'peer-focus-visible:ring-2 peer-focus-visible:ring-[#0F4C3A]/30'
                                    )}
                                  >
                                    <div
                                      className={cn(
                                        'w-2 h-2 rounded-full bg-[#0F4C3A] transition-transform scale-0',
                                        isSelected && 'scale-100'
                                      )}
                                    />
                                  </div>
                                </div>
                                <span
                                  className={cn(
                                    'text-slate-700 dark:text-slate-200 leading-snug',
                                    isSelected && 'font-semibold text-slate-900 dark:text-white'
                                  )}
                                >
                                  {entry.label}
                                </span>
                              </label>
                            );
                          })}
                        </div>
                      </fieldset>
                    ))}
                  </div>
                </div>
              )}

              <p className="text-xs text-slate-500 dark:text-slate-400">
                Selecione o tipo de solicitação que deseja realizar.
              </p>

              <div className="pt-2 flex items-center justify-between gap-3">
                <GlaButton type="button" variant="outline" onClick={() => setCurrentStep(1)}>
                  Anterior
                </GlaButton>
                <GlaButton type="button" variant="primary" onClick={() => setCurrentStep(3)}>
                  Próximo
                </GlaButton>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <div
                data-testid="resumo-tipo-solicitacao"
                className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 p-4 space-y-2 text-xs"
              >
                <div>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    Tipo de Solicitação:{' '}
                  </span>
                  <span className="text-slate-900 dark:text-white">{selectedTipoLabel}</span>
                </div>
                {tipoSolicitacao === 'atos-administrativos' && (
                  <div>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      Ato selecionado:{' '}
                    </span>
                    <span className="text-slate-900 dark:text-white">
                      {selectedAto
                        ? `${selectedAto.categoria} — ${selectedAto.label}`
                        : 'Nenhum ato selecionado'}
                    </span>
                  </div>
                )}
              </div>

              <div className="pt-2 flex items-center justify-between gap-3">
                <GlaButton type="button" variant="outline" onClick={() => setCurrentStep(2)}>
                  Anterior
                </GlaButton>
              </div>
            </div>
          )}
        </div>
      </GlaCard>

      <div className="flex items-center gap-2.5">
        <GlaButton type="button" variant="outline" onClick={handleCancelar}>
          Cancelar
        </GlaButton>
        <GlaButton type="button" variant="outline" onClick={handleSalvarRascunho}>
          Salvar Rascunho
        </GlaButton>
      </div>
    </div>
  );
};

export default IniciarRequerimentoPage;
