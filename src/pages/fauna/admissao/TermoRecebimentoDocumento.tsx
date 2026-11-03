import React, { useState } from 'react';
import { Printer, Download, ArrowLeft, CheckCircle2, AlertCircle, FileCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TermoRecebimentoItem } from '@/types/faunaAdmissao';
import { buildTrPdfBlob } from './trPdfGenerator';

interface TermoRecebimentoDocumentoProps {
  termo: TermoRecebimentoItem;
  onVoltar?: () => void;
  usuarioEmissao?: string;
  dataHoraEmissao?: string;
}

export const TermoRecebimentoDocumento: React.FC<TermoRecebimentoDocumentoProps> = ({
  termo,
  onVoltar,
  usuarioEmissao = 'Dra. Gabriela Santos - Matrícula 8841-2',
  dataHoraEmissao = new Date().toLocaleString('pt-BR'),
}) => {
  // Garantir mínimo de 5 linhas para tabela de pré-cadastro (especificação seção 6.2)
  const linhasTabela = [...termo.animais];
  while (linhasTabela.length < 5) {
    linhasTabela.push({
      id: `placeholder-${linhasTabela.length}`,
      especieId: '',
      especieNomeCientifico: '',
      especieNomePopular: '',
      quantidadeMacho: 0,
      quantidadeFemea: 0,
      quantidadeIndeterminado: 0,
      quantidadeTotal: 0,
      saldoPendenteTriagem: 0,
    });
  }

  const [downloadSucesso, setDownloadSucesso] = useState(false);

  const handlePrint = () => {
    // Impressão a partir do mesmo arquivo PDF vetorial dedicado (Seção 6.2 e RNF-102)
    const blob = buildTrPdfBlob(termo, usuarioEmissao, dataHoraEmissao);
    const blobUrl = URL.createObjectURL(blob);
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    iframe.src = blobUrl;
    document.body.appendChild(iframe);

    iframe.onload = () => {
      try {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
      } catch {
        window.open(blobUrl, '_blank');
      }
      setTimeout(() => {
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
        URL.revokeObjectURL(blobUrl);
      }, 5000);
    };
  };

  const handleDownload = () => {
    // Geração de arquivo PDF dedicado autêntico (RNF-102 e Seção 6.2)
    const blob = buildTrPdfBlob(termo, usuarioEmissao, dataHoraEmissao);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `TR_${termo.numeroTr.replace(/\//g, '-')}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setDownloadSucesso(true);
    setTimeout(() => {
      URL.revokeObjectURL(url);
      setDownloadSucesso(false);
    }, 6000);
  };

  // Helper para renderizar caixa de opção (X) ou ( )
  const renderOption = (selected: boolean, label: string) => (
    <span className="inline-flex items-center gap-1 font-mono text-[10pt] mr-3 whitespace-nowrap">
      <span className="font-bold">{selected ? '(X)' : '( )'}</span>
      <span className="font-sans font-normal text-slate-800 uppercase text-[9pt]">{label}</span>
    </span>
  );

  return (
    <div className="min-h-screen bg-slate-100 py-6 px-2 sm:px-4 print:p-0 print:bg-white text-slate-900 font-sans">
      {/* Barra Superior de Ações (Oculta na Impressão) */}
      <div className="max-w-[210mm] w-full mx-auto mb-4 bg-white p-3 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between gap-3 overflow-x-auto print:hidden">
        <div className="flex items-center gap-2 shrink-0">
          {onVoltar && (
            <Button
              variant="outline"
              size="sm"
              onClick={onVoltar}
              className="text-xs h-8 text-slate-700 border-slate-300 whitespace-nowrap shrink-0"
            >
              <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
              Voltar ao Painel
            </Button>
          )}
          <span className="text-xs font-semibold text-slate-700 whitespace-nowrap shrink-0">
            Documento Oficial: <span className="font-mono text-emerald-800">{termo.numeroTr}</span>
          </span>
          {termo.comprovantePendente && (
            <span className="text-[11px] font-medium bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full inline-flex items-center gap-1 whitespace-nowrap shrink-0">
              <AlertCircle className="w-3 h-3 text-amber-600" />
              Comprovante de Apreensão Pendente
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {downloadSucesso && (
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-300 px-2.5 py-1 rounded-md inline-flex items-center gap-1 whitespace-nowrap shrink-0">
              <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
              PDF gerado com sucesso!
            </span>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
            className="text-xs h-8 text-slate-700 border-slate-300 whitespace-nowrap shrink-0"
          >
            <Download className="w-3.5 h-3.5 mr-1.5" />
            Baixar PDF
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handlePrint}
            className="text-xs h-8 bg-[#0F4C3A] hover:bg-[#0c3d2e] text-white font-semibold whitespace-nowrap shrink-0"
          >
            <Printer className="w-3.5 h-3.5 mr-1.5" />
            Imprimir TR
          </Button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* FOLHA A4 RETRATO (Margens de 1,5 cm, formato oficial F-TEC-205-00) */}
      {/* ========================================================================= */}
      <div
        id="doc001-container"
        className="max-w-[210mm] min-h-[297mm] mx-auto bg-white p-[15mm] border border-slate-300 shadow-md print:border-none print:shadow-none print:p-0 print:max-w-none print:w-full"
        style={{ fontFamily: 'Arial, sans-serif' }}
      >
        {/* Cabeçalho Oficial */}
        <div className="border border-slate-800 flex items-center justify-between p-2 mb-2">
          {/* Espaço reservado vazio para futura inserção da logomarca oficial (sem texto, símbolo ou imagem fictícia) */}
          <div
            data-testid="doc001-logo-reserved"
            className="w-[85px] h-[52px] border border-dashed border-slate-300 rounded bg-slate-50/50"
          />

          {/* Título Central */}
          <div className="flex-1 text-center px-2">
            <h1 className="text-[10pt] font-bold tracking-wider uppercase text-slate-900 leading-tight">
              ESTADO DA BAHIA
            </h1>
            <h2 className="text-[9pt] font-semibold uppercase text-slate-800 leading-tight">
              INSTITUTO DO MEIO AMBIENTE E RECURSOS HÍDRICOS — INEMA
            </h2>
            <div data-testid="doc001-titulo" className="text-[12pt] font-bold text-slate-900 uppercase mt-1 tracking-wide">
              Termo de Recebimento de Animal Silvestre
            </div>
            <span className="text-[8pt] font-mono text-slate-600 block">
              Modelo F-TEC-205-00 (Release 2 / CGFAU)
            </span>
          </div>

          {/* Destaque Nº DO TR */}
          <div className="w-[180px] border border-slate-800 bg-slate-50 p-1.5 text-center">
            <span className="text-[8pt] font-bold text-slate-700 uppercase block">
              Nº DO TR
            </span>
            <span className="text-[13pt] font-mono font-bold text-slate-900 block leading-tight">
              {termo.numeroTr}
            </span>
          </div>
        </div>

        {/* 1. Bloco Identificação */}
        <div className="border border-slate-800 mb-2">
          <div className="bg-[#D9D9D9] px-2 py-0.5 text-[9pt] font-bold uppercase border-b border-slate-800">
            1. IDENTIFICAÇÃO DO RECEBIMENTO
          </div>
          <div className="p-2 grid grid-cols-5 gap-2 text-[9pt]">
            <div className="col-span-1">
              <span className="font-bold block text-[8pt]">DATA:</span>
              <span className="font-mono">{termo.dataRecebimento}</span>
            </div>
            <div className="col-span-1">
              <span className="font-bold block text-[8pt]">HORA:</span>
              <span className="font-mono">{termo.horaRecebimento}</span>
            </div>
            <div className="col-span-1">
              <span className="font-bold block text-[8pt]">LOTE:</span>
              <span>{renderOption(termo.lote, 'Sim')} {renderOption(!termo.lote, 'Não')}</span>
            </div>
            <div className="col-span-1">
              <span className="font-bold block text-[8pt]">QTD. TOTAL:</span>
              <span className="font-bold font-mono text-[10pt]">{termo.quantidadeTotal}</span>
            </div>
            <div className="col-span-1">
              <span className="font-bold block text-[8pt]">UNIDADE:</span>
              <span className="font-semibold text-[8.5pt]">{termo.unidadeNome} ({termo.unidadeSigla})</span>
            </div>
          </div>
        </div>

        {/* 2. Bloco Fato Gerador */}
        <div className="border border-slate-800 mb-2">
          <div className="bg-[#D9D9D9] px-2 py-0.5 text-[9pt] font-bold uppercase border-b border-slate-800 flex justify-between">
            <span>2. FATO GERADOR (PROCEDÊNCIA DE ADMISSÃO) *</span>
            <span className="text-[8pt] font-normal italic">Todas as opções são impressas</span>
          </div>
          <div className="p-2 text-[9pt] space-y-1.5">
            <div className="flex flex-wrap gap-y-1">
              {renderOption(termo.fatoGerador === 'Entrega voluntária', 'Entrega Voluntária')}
              {renderOption(termo.fatoGerador === 'Apreensão', 'Apreensão')}
              {renderOption(termo.fatoGerador === 'Resgate', 'Resgate')}
              {renderOption(termo.fatoGerador === 'Transferência', 'Transferência')}
              {renderOption(termo.fatoGerador === 'Transferência interestadual', 'Transferência Interestadual')}
            </div>
            <div className="grid grid-cols-2 gap-4 pt-1 border-t border-slate-200 text-[8.5pt]">
              <div>
                <span className="font-bold mr-2">Instituição Responsável:</span>
                {renderOption(termo.instituicaoResponsavel === 'INEMA', 'INEMA')}
                {renderOption(termo.instituicaoResponsavel === 'Outras', `Outras: ${termo.instituicaoEspecificar || '________________'}`)}
              </div>
              <div>
                <span className="font-bold mr-2">Órgão / Autoridade de Origem:</span>
                <span>{termo.orgaoOrigem || 'Não informado'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Bloco Em Caso de Apreensão */}
        <div className="border border-slate-800 mb-2">
          <div className="bg-[#D9D9D9] px-2 py-0.5 text-[9pt] font-bold uppercase border-b border-slate-800">
            3. EM CASO DE APREENSÃO
          </div>
          <div className="p-2 text-[8.5pt] space-y-1">
            <div className="grid grid-cols-3 gap-2">
              <div>
                <span className="font-bold block">Documento da Apreensão:</span>
                <span>
                  {termo.documentoApreensaoTipo
                    ? `(X) ${termo.documentoApreensaoTipo} Nº ${termo.documentoApreensaoNumero || 'S/N'}`
                    : '( ) Auto de Infração / Boletim de Ocorrência'}
                </span>
              </div>
              <div>
                <span className="font-bold block">Data de Lavratura:</span>
                <span>{termo.dataLavratura || '____/____/________'}</span>
              </div>
              <div>
                <span className="font-bold block">Comprovante Anexado no Sistema:</span>
                <span>
                  {renderOption(termo.comprovanteAnexado, 'Sim')}
                  {renderOption(!termo.comprovanteAnexado, 'Não (Pendente)')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Bloco Agente / Instituição Responsável pela Destinação */}
        <div className="border border-slate-800 mb-2">
          <div className="bg-[#D9D9D9] px-2 py-0.5 text-[9pt] font-bold uppercase border-b border-slate-800">
            4. DADOS DO AGENTE / INSTITUIÇÃO RESPONSÁVEL PELA DESTINAÇÃO *
          </div>
          <div className="p-2 text-[8.5pt] grid grid-cols-3 gap-2">
            <div className="col-span-2">
              <span className="font-bold">Nome / Razão Social:</span> {termo.agenteNomeRazaoSocial}
            </div>
            <div>
              <span className="font-bold">RG / Matrícula:</span> {termo.agenteRgMatricula || '—'}
            </div>
            <div>
              <span className="font-bold">CPF / CNPJ:</span> <span className="font-mono">{termo.agenteCpfCnpj}</span>
            </div>
            <div className="col-span-2">
              <span className="font-bold">Logradouro:</span> {termo.agenteLogradouro || 'Não informado'}
            </div>
            <div>
              <span className="font-bold">Município:</span> {termo.agenteMunicipio}
            </div>
            <div>
              <span className="font-bold">Estado (UF):</span> {termo.agenteUf}
            </div>
            <div>
              <span className="font-bold">CEP:</span> {termo.agenteCep || '—'}
            </div>
          </div>
        </div>

        {/* 5. Bloco Entregador & 6. Bloco Local de Origem */}
        <div className="grid grid-cols-2 gap-2 mb-2">
          {/* Entregador */}
          <div className="border border-slate-800">
            <div className="bg-[#D9D9D9] px-2 py-0.5 text-[9pt] font-bold uppercase border-b border-slate-800">
              5. DADOS DO ENTREGADOR (QUANDO HOUVER)
            </div>
            <div className="p-2 text-[8.5pt] space-y-1">
              <div>
                <span className="font-bold">Nome:</span> {termo.entregadorNome || 'Mesmo do responsável'}
              </div>
              <div>
                <span className="font-bold">Documento / Matrícula:</span> {termo.entregadorDocumento || '—'}
              </div>
            </div>
          </div>

          {/* Local de Origem */}
          <div className="border border-slate-800">
            <div className="bg-[#D9D9D9] px-2 py-0.5 text-[9pt] font-bold uppercase border-b border-slate-800">
              6. DADOS DO LOCAL DE ORIGEM DO(S) ANIMAL(IS) *
            </div>
            <div className="p-2 text-[8.5pt] space-y-1">
              <div>
                <span className="font-bold">Município / UF:</span> {termo.localOrigemMunicipio} / {termo.localOrigemUf}
              </div>
              <div>
                <span className="font-bold">Logradouro / CEP:</span>{' '}
                {termo.localOrigemLogradouro ? `${termo.localOrigemLogradouro} - ${termo.localOrigemCep || ''}` : 'Não informado'}
              </div>
            </div>
          </div>
        </div>

        {/* 7. Bloco Tabela de Animais (Pré-Cadastro) */}
        <div className="border border-slate-800 mb-2">
          <div className="bg-[#D9D9D9] px-2 py-0.5 text-[9pt] font-bold uppercase border-b border-slate-800 flex justify-between items-center">
            <span>7. DADOS DO(S) ANIMAL(IS) — PRÉ-CADASTRO *</span>
            <span className="text-[7.5pt] font-normal italic">Mínimo de 5 linhas no formulário físico</span>
          </div>

          <table className="w-full text-left text-[8pt] border-collapse">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-800 text-[7.5pt]">
                <th className="border-r border-slate-800 px-1 py-1 text-center w-8">Item</th>
                <th className="border-r border-slate-800 px-1 py-1 text-center w-6">M</th>
                <th className="border-r border-slate-800 px-1 py-1 text-center w-6">F</th>
                <th className="border-r border-slate-800 px-1 py-1 text-center w-8">I</th>
                <th className="border-r border-slate-800 px-2 py-1">Nome Científico / Gênero</th>
                <th className="border-r border-slate-800 px-2 py-1">Nome Popular</th>
                <th className="border-r border-slate-800 px-1 py-1 text-center w-12">Condição</th>
                <th className="border-r border-slate-800 px-2 py-1 w-24">Marcação</th>
                <th className="border-r border-slate-800 px-1 py-1 text-center w-12">Origem</th>
                <th className="px-2 py-1">Local de Origem / Referência</th>
              </tr>
            </thead>
            <tbody>
              {linhasTabela.map((linha, index) => {
                const isEmpty = !linha.especieNomePopular && !linha.especieNomeCientifico;
                return (
                  <tr key={linha.id || index} className="border-b border-slate-300 min-h-[22px]">
                    <td className="border-r border-slate-800 px-1 py-1 text-center font-mono">
                      {index + 1}
                    </td>
                    <td className="border-r border-slate-800 px-1 py-1 text-center font-mono">
                      {isEmpty ? '' : linha.quantidadeMacho || '0'}
                    </td>
                    <td className="border-r border-slate-800 px-1 py-1 text-center font-mono">
                      {isEmpty ? '' : linha.quantidadeFemea || '0'}
                    </td>
                    <td className="border-r border-slate-800 px-1 py-1 text-center font-mono font-bold">
                      {isEmpty ? '' : linha.quantidadeIndeterminado || '0'}
                    </td>
                    <td className="border-r border-slate-800 px-2 py-1 italic">
                      {linha.especieNomeCientifico || linha.generoOuFamilia || ''}
                    </td>
                    <td className="border-r border-slate-800 px-2 py-1 font-semibold">
                      {linha.especieNomePopular || ''}
                    </td>
                    <td className="border-r border-slate-800 px-1 py-1 text-center font-mono">
                      {linha.condicaoAnimal === 'Saudável'
                        ? 'S'
                        : linha.condicaoAnimal === 'Mutilado/Ferido'
                        ? 'MF'
                        : linha.condicaoAnimal === 'Doente'
                        ? 'D'
                        : linha.condicaoAnimal === 'Óbito'
                        ? 'O'
                        : ''}
                    </td>
                    <td className="border-r border-slate-800 px-2 py-1 font-mono text-[7.5pt]">
                      {linha.tipoNumeroMarcacao || '—'}
                    </td>
                    <td className="border-r border-slate-800 px-1 py-1 text-center font-mono">
                      {linha.origemAnimal === 'Vida livre'
                        ? 'VL'
                        : linha.origemAnimal === 'Cativeiro'
                        ? 'CV'
                        : ''}
                    </td>
                    <td className="px-2 py-1 text-[7.5pt]">
                      {linha.localOrigemPontoOuCoordenadas || ''}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* 8. Bloco Legendas Oficiais */}
        <div className="border border-slate-800 p-1.5 mb-2 bg-slate-50 text-[7.5pt] leading-tight space-y-0.5">
          <div className="font-bold">LEGENDAS:</div>
          <div>
            <span className="font-semibold">1 - Sexo:</span> M - Macho | F - Fêmea | I - Indeterminado (no cadastro em lote, a quantidade é registrada em I até a individualização na triagem).
          </div>
          <div>
            <span className="font-semibold">2 - Condição do Animal:</span> S - Saudável | MF - Mutilado/Ferido | D - Doente | O - Óbito.
          </div>
          <div>
            <span className="font-semibold">3 - Origem do Animal:</span> VL - Vida Livre | CV - Cativeiro.
          </div>
          <div className="italic text-slate-600">
            * Em caso de filhote ou espécime sem dimorfismo sexual evidente, registrar anotação no campo Observações.
          </div>
        </div>

        {/* 9. Bloco Observações */}
        <div className="border border-slate-800 mb-3 min-h-[40px]">
          <div className="bg-[#D9D9D9] px-2 py-0.5 text-[8.5pt] font-bold uppercase border-b border-slate-800">
            9. OBSERVAÇÕES
          </div>
          <div className="p-2 text-[8pt] text-slate-800">
            {termo.observacoes || 'Nenhuma observação complementar registrada no momento do recebimento.'}
          </div>
        </div>

        {/* 10. Bloco Assinaturas (Sempre juntas na última página) */}
        <div className="border border-slate-800 p-3 mb-2 bg-white">
          <div className="grid grid-cols-2 gap-6 pt-6">
            <div className="text-center">
              <div className="border-b border-slate-900 mb-1 w-3/4 mx-auto"></div>
              <span className="text-[8pt] font-bold block">Assinatura do Responsável pela Destinação *</span>
              <span className="text-[7.5pt] text-slate-700 block">
                Nome: {termo.agenteNomeRazaoSocial}
              </span>
            </div>
            <div className="text-center">
              <div className="border-b border-slate-900 mb-1 w-3/4 mx-auto"></div>
              <span className="text-[8pt] font-bold block">Assinatura do Responsável pelo Recebimento *</span>
              <span className="text-[7.5pt] text-slate-700 block">
                Nome/Matrícula: {termo.recebedorNome} ({termo.recebedorMatricula})
              </span>
            </div>
          </div>
        </div>

        {/* 11. Rodapé Institucional */}
        <div className="pt-2 border-t border-slate-400 text-center text-[7.5pt] text-slate-600 flex justify-between items-center">
          <span>Termo de Recebimento de Animal Silvestre</span>
          <span>Emitido em: {dataHoraEmissao} por: {usuarioEmissao}</span>
          <span className="font-mono font-bold">Página 1 de 1 | F-TEC-205-00</span>
        </div>
      </div>
    </div>
  );
};
