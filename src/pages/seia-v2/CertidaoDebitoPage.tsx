import React, { useState } from 'react';
import {
  FileCheck,
  Search,
  Download,
  ShieldCheck,
  QrCode,
  CheckCircle2,
  AlertCircle,
  Building2,
  Printer,
  ArrowRight,
  HelpCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FilamentTabs, FilamentTabItem } from '@/components/filament/Tabs';
import { Section } from '@/components/filament/Section';
import { InputWrapper } from '@/components/filament/InputWrapper';
import { SeiaV2Breadcrumb } from '@/components/seia-v2/SeiaV2Breadcrumb';

interface CertidaoDebitoPageProps {
  onNavigate?: (route: string) => void;
}

export const CertidaoDebitoPage: React.FC<CertidaoDebitoPageProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState('emissao-rapida');
  const [documentoConsulta, setDocumentoConsulta] = useState('');
  const [isConsulting, setIsConsulting] = useState(false);
  const [certidaoGerada, setCertidaoGerada] = useState<any>(null);

  const tabs: FilamentTabItem[] = [
    { id: 'emissao-rapida', label: 'Emissão Rápida (Cidadão / Empresa)', badge: 'Online', badgeVariant: 'primary' },
    { id: 'pauta-analise', label: 'Pauta Técnica de Certidões', badge: '14', badgeVariant: 'warning' },
    { id: 'validar-autenticidade', label: 'Validar Autenticidade', badge: 'QR Code', badgeVariant: 'gray' },
  ];

  const handleConsultar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!documentoConsulta.trim()) return;

    setIsConsulting(true);
    setTimeout(() => {
      setIsConsulting(false);
      setCertidaoGerada({
        numeroCertidao: 'CND-INEMA-2026-099412',
        requerente: 'Indústria e Comércio de Alimentos Bahia S.A.',
        cnpj: documentoConsulta,
        tipo: 'Certidão Negativa de Débitos e Infrações Ambientais',
        situacao: 'NADA CONSTA',
        codigoAutenticidade: 'A4F9-8812-BC90-1124-E99A',
        dataEmissao: new Date().toLocaleDateString('pt-BR'),
        validade: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR'),
      });
    }, 600);
  };

  return (
    <div className="space-y-6">
      <SeiaV2Breadcrumb
        items={[
          { label: 'Início', route: 'inicio' },
          { label: 'Serviços & Financeiro', route: 'seia-daes' },
          { label: 'Certidão de Débito Ambiental (CND)' },
        ]}
        onNavigate={onNavigate}
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Certidão de Débitos e Infrações Ambientais
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Emissão instantânea de certidão negativa (CND) para pessoas físicas, empresas e processos licitatórios.
          </p>
        </div>
      </div>

      <div className="border-b border-slate-200 dark:border-slate-800">
        <FilamentTabs items={tabs} activeTab={activeTab} onChange={setActiveTab} />
      </div>

      {activeTab === 'emissao-rapida' && (
        <div className="space-y-6 max-w-4xl">
          {/* Formulário de Consulta (Template 5) */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
            <form onSubmit={handleConsultar} className="space-y-4">
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Search className="w-4 h-4 text-[#0F4C3A]" />
                Consulta de Regularidade Ambiental
              </h2>
              <p className="text-xs text-slate-500">
                Informe o CPF ou CNPJ para checagem imediata na base de autos de infração e taxas do INEMA.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-2">
                <div className="sm:col-span-8">
                  <input
                    type="text"
                    placeholder="Digite o CPF ou CNPJ (ex: 00.000.000/0001-00)"
                    value={documentoConsulta}
                    onChange={(e) => setDocumentoConsulta(e.target.value)}
                    className="w-full px-4 py-2.5 text-xs font-mono rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-[#0F4C3A]/20 focus:border-[#0F4C3A]"
                    required
                  />
                </div>
                <div className="sm:col-span-4">
                  <Button
                    type="submit"
                    disabled={isConsulting}
                    className="w-full bg-[#0F4C3A] hover:bg-[#0c3d2e] text-white text-xs h-10 font-semibold"
                  >
                    <span>{isConsulting ? 'Consultando...' : 'Emitir Certidão'}</span>
                    <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Button>
                </div>
              </div>
            </form>
          </div>

          {/* Resultado / Documento Oficial da CND */}
          {certidaoGerada && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-[#0F4C3A]/30 p-6 sm:p-8 shadow-xl space-y-6 animate-in fade-in duration-300">
              <div className="border-b border-slate-200 dark:border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#0F4C3A] flex items-center justify-center font-bold">
                    <ShieldCheck className="w-7 h-7" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#0F4C3A]">
                      Estado da Bahia • INEMA
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
                      {certidaoGerada.tipo}
                    </h3>
                  </div>
                </div>

                <div className="text-right font-mono text-xs">
                  <div className="text-slate-500">Número da Certidão:</div>
                  <strong className="text-slate-900 dark:text-slate-100">{certidaoGerada.numeroCertidao}</strong>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 text-emerald-900 flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                <div className="text-xs leading-relaxed">
                  <strong>CERTIFICA-SE</strong> que, consultados os registros do Instituto do Meio Ambiente e Recursos Hídricos (INEMA), <strong>NÃO CONSTAM DÉBITOS PENDENTES</strong> ou autos de infração com trânsito em julgado para a pessoa jurídica acima qualificada.
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <span className="text-slate-500">Razão Social:</span>
                  <p className="font-semibold text-slate-900 dark:text-slate-100">{certidaoGerada.requerente}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-slate-500">CNPJ Consultado:</span>
                  <p className="font-mono font-semibold text-slate-900 dark:text-slate-100">{certidaoGerada.cnpj}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-slate-500">Data de Emissão:</span>
                  <p className="font-semibold text-slate-900 dark:text-slate-100">{certidaoGerada.dataEmissao}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-slate-500">Validade Legal (90 dias):</span>
                  <p className="font-semibold text-emerald-700 dark:text-emerald-400">{certidaoGerada.validade}</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 font-mono">Código de Autenticidade Digital:</span>
                  <p className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200">{certidaoGerada.codigoAutenticidade}</p>
                </div>
                <QrCode className="w-10 h-10 text-slate-700 dark:text-slate-300" />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button variant="outline" size="sm" className="text-xs">
                  <Printer className="w-4 h-4 mr-1.5" />
                  <span>Imprimir Certidão</span>
                </Button>
                <Button size="sm" className="bg-[#0F4C3A] hover:bg-[#0c3d2e] text-white text-xs font-semibold">
                  <Download className="w-4 h-4 mr-1.5" />
                  <span>Baixar Certidão Oficial em PDF</span>
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'pauta-analise' && (
        <div className="bg-white dark:bg-slate-900 p-8 rounded-xl border border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500">
          <FileCheck className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <h3 className="font-bold text-slate-800 dark:text-slate-200">Pauta Técnica de Certidões com Pendências</h3>
          <p className="mt-1">14 solicitações aguardando baixa manual de débitos ou decisão de recurso.</p>
        </div>
      )}
    </div>
  );
};
