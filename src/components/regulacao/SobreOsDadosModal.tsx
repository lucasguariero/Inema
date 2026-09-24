import React, { useEffect } from 'react';
import { X, Info, Database, Clock, ShieldCheck, MapPin } from 'lucide-react';

interface SobreOsDadosModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SobreOsDadosModal: React.FC<SobreOsDadosModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto font-sans" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-200"
        onClick={onClose}
      />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-lg rounded-xl bg-white shadow-xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#0F4C3A] flex items-center justify-center border border-emerald-200/60">
                <Info className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Sobre os dados</h3>
                <p className="text-[11px] text-slate-500">Origem, sincronização e cobertura das consultas</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
              aria-label="Fechar painel"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-4 text-xs text-slate-700">
            {/* Bloco 1: Referência da Base */}
            <div className="flex items-start gap-3 p-3.5 rounded-lg bg-slate-50 border border-slate-200">
              <Database className="w-4 h-4 text-[#0F4C3A] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-900 block">Referência da Fonte</span>
                <p className="text-slate-600 mt-0.5 leading-relaxed">
                  Dados originários do <strong>SEIA</strong> (Sistema Estadual de Informações Ambientais e Recursos Hídricos). A consulta é restrita a registros consolidados da base de dados do SEIA.
                </p>
              </div>
            </div>

            {/* Bloco 2: Atualização */}
            <div className="flex items-start gap-3 p-3.5 rounded-lg bg-slate-50 border border-slate-200">
              <Clock className="w-4 h-4 text-[#0F4C3A] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-900 block">Data e Hora da Atualização</span>
                <p className="text-slate-600 mt-0.5 leading-relaxed">
                  Última sincronização realizada em <strong>22/09/2026 às 10:00</strong> (rotina de carga matutina do SEIA).
                </p>
              </div>
            </div>

            {/* Bloco 3: Cobertura da Consulta */}
            <div className="flex items-start gap-3 p-3.5 rounded-lg bg-slate-50 border border-slate-200">
              <ShieldCheck className="w-4 h-4 text-[#0F4C3A] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-900 block">Cobertura da Consulta</span>
                <p className="text-slate-600 mt-0.5 leading-relaxed">
                  Compreende todos os processos, atos autorizativos, licenças, outorgas e cadastros sob competência da Diretoria de Regulação (DIRRE), Unidades Regionais (URs) e coordenações técnicas (COASP, CGF, CEG, CRH, CGDIS, COMIN).
                </p>
              </div>
            </div>

            {/* Bloco 4: Critérios Cadastrais */}
            <div className="flex items-start gap-3 p-3.5 rounded-lg bg-slate-50 border border-slate-200">
              <MapPin className="w-4 h-4 text-[#0F4C3A] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-900 block">Recorte Cadastral</span>
                <p className="text-slate-600 mt-0.5 leading-relaxed">
                  Município e tipologia refletem os vínculos cadastrais atuais registrados no SEIA. Dias sem movimentação e prazos utilizam marcos cronológicos formais das ocorrências de tramitação.
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 transition-colors shadow-2xs cursor-pointer"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
