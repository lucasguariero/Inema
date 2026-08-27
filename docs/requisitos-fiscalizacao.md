# Requisitos - Módulo Fiscalização

> Documentos: DOR001 (Denúncia Interna) e DOR002 (Denúncia Externa)
> Atualização: 2026-08-27

---

## Visão Geral

O módulo de Fiscalização terá duas vertentes:
- **Denúncia Interna**: Usuário interno (servidor INEMA) cadastra denúncia manualmente
- **Denúncia Externa**: Usuário externo (cidadão) acessa via Portal do Usuário

---

## Atores do Sistema

| Código | Ator | Tipo | Descrição |
|--------|------|------|-----------|
| 01 | Usuário Externo | Externo | Cidadão, PF ou PJ que acessa o Portal |
| 02 | Usuário Interno (Atendente/Técnico) | Interno | Servidor que cadastra denúncias manually |
| 03 | Gestor de Fiscalização | Interno | Análise, triagem, despacho |
| 04 | Técnico de Fiscalização | Interno | Vistorias, relatórios, autos de infração |

---

## Fluxo Principal - Denúncia Interna (DOR001)

1. Usuário interno autentica pelo Gov.br
2. Acessa o módulo Fiscalização
3. Preenche as seções:
   - **Detalhes do Registro**: Origem, data/hora, número original
   - **Ocorrência**: Período, descrição, anexos
   - **Localização**: Município, endereço, coordenadas, complemento
   - **Denunciante**: Identificado ou anônimo
4. Salva como rascunho ou finaliza
5. Sistema gera número RD (ano.000000/INEMA/RD)
6. Encaminha à pauta do gestor

---

## Fluxo Principal - Denúncia Externa (DOR002)

1. Usuário externo autentica pelo Gov.br
2. Escolhe: denúncia anônima ou identificada
3. Se anônimo → formulário sem dados pessoais
4. Se identificado → importa dados do cadastro básico
5. Preenche Ocorrência e Localização
6. Salva rascunho ou finaliza
7. Gera RD e encaminha à pauta do gestor

---

## Seções do Formulário

### Detalhes do Registro (Apenas Interna)

| Campo | Tipo | Obrigatório | Observações |
|-------|------|-------------|-------------|
| Origem | Lista | Sim | Call center, Correspondência, E-mail, Ofício, Ouvidoria, Presencial, SEI, Telefone |
| Órgão | Lista | Condicional | Obrigatório se Origem = Ofício |
| Outros – órgão | Texto | Condicional | Se órgão = Outros |
| Data e Hora do comunicado | Data/hora | Sim | |
| Número original | Texto | Condicional | Obrigatório para Ofício ou Call Center |

### Ocorrência

| Campo | Tipo | Obrigatório | Observações |
|-------|------|-------------|-------------|
| Período da ocorrência | Data inicial e final | Ao menos uma | |
| Descrição | Área de texto | Sim | Limite 7.000 caracteres |
| Anexos | Upload múltiplo | Não | Ver formatos permitidos |

### Localização

| Campo | Tipo | Obrigatório | Observações |
|-------|------|-------------|-------------|
| Município | Lista | Sim | |
| CEP | Texto | Não | Busca automática nos Correios |
| Endereço/Local | Texto | Sim | |
| Bairro | Texto | Não | |
| Número | Texto | Não | |
| Ponto de referência | Área de texto | Sim | Limite 1.000 caracteres |
| Tipo de coordenada | Lista | Condicional | Geográfica/Grau decimal, Grau/Min/Seg, UTM 23, UTM 24 |
| Latitude | Numérico | Condicional | Até 10 caracteres, permite zero |
| Longitude | Numérico | Condicional | Até 10 caracteres, permite zero |
| Adicionar coordenada | Botão | Não | Permite mais de uma |
| Complemento | Lista multisseleção | Sim | Máximo 3 itens |
| Descrição do complemento | Área de texto | Sim | Limite 1.000 caracteres |

### Denunciante

| Campo | Tipo | Obrigatório | Observações |
|-------|------|-------------|-------------|
| Denunciante identificado | SIM/NÃO | Sim | |
| CPF/CNPJ | Texto | Não | Se identificado |
| Nome/Razão Social | Texto | Condicional | Obrigatório se identificado |
| Telefone/Celular | Texto | Condicional | Obrigatório se identificado |
| Outro telefone | Texto | Não | Se identificado |
| E-mail | Texto | Não | Se identificado |

---

## Regras de Negócio Principais

| Código | Nome | Descrição |
|--------|------|-----------|
| RN001 | Numeração RD | Padrão: ano.número sequencial 6 dígitos/INEMA/RD |
| RN002 | Status | Após finalizar = "Registrado" |
| RN003 | Rascunho automático | Salvar automaticamente durante edição |
| RN004 | Prazo rascunho | 24 horas |
| RN005 | Novo registro | Alertar sobre rascunho existente |
| RN006 | Condicionais origem | Se Ofício → exigir Órgão |
| RN007 | Anexos | .pdf, .doc, .docx, .txt, .jpeg, .jpg, .png, .bmp, .xls, .xlsx, .mp3, .mp4, .shp, .shx, .dbf, .prj, .kml, .kmz, .zip |
| RN008 | Coordenadas | Aceitar valor zero, converter para grau decimal |
| RN009 | Complementos | Máximo 3 itens |
| RN010 | Identificação | Se SIM → Nome e Telefone obrigatórios |
| RN011 | Anonimato | Exibir alerta uma única vez |
| RN012 | Encaminhamento | Encaminhar à pauta do gestor |
| RN017 | Sequencial | Reiniciar a cada ano |

---

## Mensagens do Sistema

| Código | Ação | Tipo | Texto |
|--------|------|------|-------|
| MSG001 | Finalizar sem obrigatórios | Alerta | Preencher campos obrigatórios! |
| MSG002 | Coordenadas zero | Confirmação | Ausência em área rural compromete apuração! |
| MSG003 | Salvar rascunho | Informativa | Rascunho ficará por 24 horas |
| MSG004 | Finalizar | Confirmação | Após finalizar não será possível alterar! |
| MSG005 | Finalização concluída | Sucesso | RD cadastrado! Nº: 2026.000000/INEMA/RD |
| MSG006 | Nova denúncia com rascunho | Alerta | Existe rascunho, deseja continuar? |
| MSG007 | Anonimato | Informativa | Identificação garante mais agilidade... |
| MSG009 | Orientação anexos | Informativa | Lista de formatos aceitos |

---

## Diferenças: Denúncia Interna vs Externa

| Aspecto | Interna | Externa |
|---------|---------|---------|
| Autenticação | Gov.br (usuário interno) | Gov.br (usuário externo) |
| Seção Detalhes do Registro | Sim (origem, órgão, número) | Não |
| Escolha anonimato | Não | Sim |
| Cadastro básico | Não | Sim (para identificado) |
| Importação dados | Não | Sim (para identificado) |
| Consulta própria | Sim | Sim |

---

## Próximos Passos

- [ ] Analisar requisitos vs padrão do sistema
- [ ] Mapear componentes necessários
- [ ] Criar protótipo HTML/Tailwind
- [ ] Validar com padrão UI do INEMA

---

## Tarefas Realizadas

### 2026-08-27
- [x] Leitura dos documentos DOR001 e DOR002
- [x] Extração dos requisitos principais
- [x] Documentação em markdown
