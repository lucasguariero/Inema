# Memória do Sistema INEMA

> Última atualização: 2026-08-27

## Acesso

- **URL**: https://gla-inema-hml.acto.com.br/
- **Ambiente**: Homologação (hml)
- **Credenciais**: cpf: 000.000.000-00 / senha: admin123
- **Tech Stack**: Filament (Laravel/PHP)

---

## Estrutura Padrão do Sistema

### Topbar
- Logo INEMA (link para home)
- Pesquisa global
- Notificações (badge com número)
- Menu do usuário (avatar + dropdown)

### Sidebar
- Largura: 280px (fixa)
- Itens com ícone + texto
- Submenus expansíveis (botão com chevron)
- Padding dos itens: `py-1` (~4px)
- "Assistente INEMA" como botão final
- Itens ativos com `bg-sidebar-active`

### Main Content
- Breadcrumb no topo: Página > Ação
- Título h1
- Botões de ação (Criar, Gerar relatório, etc.)
- Barra de busca + filtros + alternar colunas
- Tabela com resultados
- Paginação

---

## Componentes Identificados

### Cards de Acesso Rápido
- Heading h3
- Descrição (parágrafo)
- Link "Acessar"

### Tabela de Listagem
- Checkbox para seleção em massa
- Headers clicáveis (ordenação)
- Colunas: Número, Tipo, Assunto, Requerente, Status, Setor Atual, Rascunho, Data Protocolo, Tags, Ações
- Ações: Visualizar, Editar, Outros (dropdown)
- Linhas clicáveis (acesso ao registro)

### Filtros
- Botão "Filtrar" com badge de contagem
- Botão "Alternar colunas"

### Paginação
- Status: "Exibindo X a Y de Z resultados"
- Dropdown "por página" (5, 10, 25, 50)

### Breadcrumbs
- Formato: Página > Subpágina (ex: Processos > Listar)

### Formulários
- Labels dos campos
- Campos de entrada
- Botões de salvar/cancelar

---

## Páginas Exploradas

| Página | URL | Observações |
|--------|-----|-------------|
| Início | / | Dashboard com cards de acesso rápido |
| Processos | /processos | Listagem com tabela |
| Criar Processo | /processos/create | Formulário de criação |

---

## Próximos Passos

- [ ] Receber documento de requisitos do Módulo de Fiscalização
- [ ] Analisar requisitos e mapear para o padrão do sistema
- [ ] Criar estrutura HTML/Tailwind do módulo

---

## Tarefas Realizadas

### 2026-08-27
- [x] Acesso ao sistema e navegação inicial
- [x] Captura da estrutura de componentes
- [x] Documentação dos padrões identificados
- [x] Leitura dos documentos de requisitos (DOR001 e DOR002)
- [x] Criação de docs/requisitos-fiscalizacao.md com requisitos extraídos
- [x] Exploração de formulários do sistema (Requerimento, Criar Processo)
- [x] Identificação do padrão wizard/stepper para formulários
- [x] Criação fiscalizacao-v1-formulario-simples.html (v1 - formulário simples)
- [x] Criação fiscalizacao.html (v2 - wizard/stepper estilo Stitch)
