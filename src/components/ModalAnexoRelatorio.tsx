import React, { useState, useEffect } from 'react';
import { 
  RegistroFiscalizacaoExterno, 
  TipoRelatorioRegulatorio 
} from '../types/fiscalizacao-externa';
import { FilamentSelect } from './filament';

interface ModalAnexoRelatorioProps {
  isOpen: boolean;
  registro: RegistroFiscalizacaoExterno | null;
  tipoInicial?: TipoRelatorioRegulatorio;
  onClose: () => void;
  onSuccess: (relatorio: {
    id: string;
    tipo: TipoRelatorioRegulatorio;
    nomeArquivo: string;
    tamanhoBytes: number;
    dataHoraEnvio: string;
    usuarioEnvio: string;
  }) => void;
}

export const ModalAnexoRelatorio: React.FC<ModalAnexoRelatorioProps> = ({
  isOpen,
  registro,
  tipoInicial = 'Preliminar',
  onClose,
  onSuccess
}) => {
  const [tipoRelatorio, setTipoRelatorio] = useState<TipoRelatorioRegulatorio>(tipoInicial);
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [observacoes, setObservacoes] = useState('');
  const [alertaErro, setAlertaErro] = useState<string | null>(null);
  const [confirmandoEnvio, setConfirmandoEnvio] = useState(false);
  const [sucessoToast, setSucessoToast] = useState(false);

  useEffect(() => {
    if (tipoInicial) {
      setTipoRelatorio(tipoInicial);
    }
    setArquivo(null);
    setObservacoes('');
    setAlertaErro(null);
    setConfirmandoEnvio(false);
    setSucessoToast(false);
  }, [isOpen, tipoInicial]);

  if (!isOpen || !registro) return null;

  // Extensões permitidas pela RN013
  const EXTENSOES_PERMITIDAS = [
    'jpeg', 'jpg', 'png', 'bmp', 'mp3', 'mp4', 'pdf',
    'doc', 'docx', 'txt', 'xls', 'xlsx', 'shp', 'shx',
    'dbf', 'prj', 'kml', 'kmz', 'zip'
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAlertaErro(null);
    if (e.target.files && e.target.files[0]) {
      const f = e.target.files[0];
      const ext = f.name.split('.').pop()?.toLowerCase() || '';

      // Validação de formato e tamanho (máx 50MB, RN013 e RN014)
      if (!EXTENSOES_PERMITIDAS.includes(ext) || f.size > 50 * 1024 * 1024) {
        setAlertaErro('MSG005: O arquivo selecionado possui formato ou tamanho não permitido.');
        setArquivo(null);
        return;
      }

      setArquivo(f);
    }
  };

  const handleIniciarEnvio = () => {
    setAlertaErro(null);

    // Validação MSG006: Selecione o tipo de relatório e um arquivo para continuar
    if (!tipoRelatorio || !arquivo) {
      setAlertaErro('MSG006: Selecione o tipo de relatório e um arquivo para continuar.');
      return;
    }

    // Abre confirmação MSG007
    setConfirmandoEnvio(true);
  };

  const handleConfirmarEnvio = () => {
    setConfirmandoEnvio(false);

    const novoAnexo = {
      id: 'rel-' + Date.now(),
      tipo: tipoRelatorio,
      nomeArquivo: arquivo ? arquivo.name : 'relatorio.pdf',
      tamanhoBytes: arquivo ? arquivo.size : 1024 * 1024,
      dataHoraEnvio: new Date().toLocaleString('pt-BR', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
      }),
      usuarioEnvio: 'Giovani Silva (Gov.br)'
    };

    setSucessoToast(true);

    setTimeout(() => {
      onSuccess(novoAnexo);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
      <div className="bg-white rounded-xl max-w-lg w-full p-6 space-y-4 shadow-xl border border-slate-200 animate-scaleUp">
        
        {/* Cabeçalho do Modal */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2 text-inema-green font-bold text-base">
            <span className="material-symbols-outlined text-xl">upload_file</span>
            <h3>Anexar Relatório Regulatório</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Identificação do Registro */}
        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Registro Vinculado</span>
            <span className="text-xs font-bold text-slate-800">{registro.numeroRegistro}</span>
          </div>
          <span className="text-xs px-2.5 py-1 bg-inema-sage text-inema-green font-semibold rounded-full">
            {registro.tipoRegistro}
          </span>
        </div>

        {/* Mensagem de Erro */}
        {alertaErro && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-center gap-2">
            <span className="material-symbols-outlined text-base text-red-600">warning</span>
            <span>{alertaErro}</span>
          </div>
        )}

        {/* Toast de Sucesso MSG008 */}
        {sucessoToast && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg flex items-center gap-2 font-bold animate-fadeIn">
            <span className="material-symbols-outlined text-base text-emerald-600">check_circle</span>
            <span>MSG008: Relatório anexado com sucesso.</span>
          </div>
        )}

        {/* Formulário de Envio */}
        <div className="space-y-3.5">
          {/* Tipo de Relatório (LEG010) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1" title="LEG010: Selecione Preliminar, Conclusivo ou Complementar">
              Tipo de Relatório (LEG010) <span className="text-red-500">*</span>
            </label>
            <FilamentSelect
              value={tipoRelatorio}
              onChange={(val) => setTipoRelatorio(val as TipoRelatorioRegulatorio)}
              options={[
                { value: 'Preliminar', label: 'Preliminar (RPEQ)' },
                { value: 'Conclusivo', label: 'Conclusivo' },
                { value: 'Complementar', label: 'Complementar' },
              ]}
            />
          </div>

          {/* Arquivo para Upload (LEG009 / RN013) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1" title="LEG009: Selecione um arquivo em formato permitido">
              Arquivo (LEG009) <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              onChange={handleFileChange}
              className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-inema-sage file:text-inema-green hover:file:bg-inema-sage-dark"
            />
            {arquivo && (
              <div className="mt-1.5 p-2 bg-emerald-50 text-emerald-800 rounded border border-emerald-200 text-[11px] flex items-center justify-between">
                <span className="truncate">{arquivo.name}</span>
                <span className="text-[10px] text-emerald-600 font-bold shrink-0 ml-2">
                  {(arquivo.size / (1024 * 1024)).toFixed(2)} MB
                </span>
              </div>
            )}
            <p className="text-[10px] text-slate-400 mt-1">
              Formatos aceitos: PDF, DOC, DOCX, XLS, XLSX, JPG, PNG, MP4, MP3, ZIP, SHP, KML (máx 50MB).
            </p>
          </div>

          {/* Observações Opcionais */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Observações Adicionais (Opcional)
            </label>
            <textarea
              rows={2}
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              placeholder="Descreva esclarecimentos sobre o arquivo ou providências adotadas"
              className="w-full text-xs rounded-lg border-slate-300 focus:border-inema-green focus:ring-inema-green"
            />
          </div>
        </div>

        {/* Rodapé de Botões: Anexar (BOT008) e Cancelar (BOT009) */}
        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-50 transition-colors"
          >
            Cancelar (BOT009)
          </button>
          <button
            type="button"
            onClick={handleIniciarEnvio}
            className="px-5 py-2 bg-inema-green text-white rounded-lg text-xs font-bold hover:bg-inema-green-hover transition-colors shadow-xs flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-base">upload</span>
            <span>Anexar (BOT008)</span>
          </button>
        </div>

        {/* Submodal MSG007: Confirmação do Envio */}
        {confirmandoEnvio && (
          <div className="fixed inset-0 bg-slate-900/60 z-60 flex items-center justify-center p-4 backdrop-blur-xs">
            <div className="bg-white rounded-xl max-w-sm w-full p-5 space-y-3 shadow-2xl border border-slate-200 animate-scaleUp">
              <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
                <span className="material-symbols-outlined text-xl">help</span>
              </div>
              <div className="text-center space-y-1">
                <h4 className="text-sm font-bold text-slate-800">Confirmar Anexação</h4>
                <p className="text-xs text-slate-600 font-semibold">
                  MSG007: Deseja anexar este relatório ao registro?
                </p>
                <p className="text-[11px] text-slate-500">
                  O arquivo será gravado com registro na auditoria do sistema (RN015).
                </p>
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setConfirmandoEnvio(false)}
                  className="flex-1 py-1.5 border border-slate-300 text-slate-700 font-semibold rounded-lg text-xs hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleConfirmarEnvio}
                  className="flex-1 py-1.5 bg-inema-green text-white font-bold rounded-lg text-xs hover:bg-inema-green-hover"
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
export default ModalAnexoRelatorio;
