# 🗂️ INEMA — Ferramenta Digital de Card Sorting

Aplicação web customizada para os stakeholders do **INEMA (Instituto do Meio Ambiente e Recursos Hídricos da Bahia)** realizarem a dinâmica de **Card Sorting**, permitindo co-criar e validar a **Arquitetura de Informação (IA)** do novo sistema.

---

## 🛠️ Stack Tecnológica

- **Framework**: Next.js 15 (App Router, React 19)
- **Estilização**: Tailwind CSS (paleta institucional `#0F4C3A` + `bg-slate-50`)
- **Componentes**: shadcn/ui (Button, Card, Input, Select, Badge)
- **Drag & Drop**: `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`
- **Persistência**: Supabase (`@supabase/supabase-js`) com fallback resiliente para `localStorage` e download direto em `.json`
- **Feedback Visual**: `canvas-confetti` + microinterações táteis

---

## 🚀 Como Executar Localmente

```bash
# 1. Acesse o diretório da aplicação
cd card-sorting

# 2. Instale as dependências (já instaladas)
npm install

# 3. Inicie o servidor de desenvolvimento
npm run dev
```

Acesse [http://localhost:3005](http://localhost:3005) no navegador.

---

## ☁️ Hospedagem em Subdomínio Próprio (Vercel)

Esta aplicação é autônoma e pode ser conectada diretamente a um novo projeto na Vercel:

1. No painel da Vercel, clique em **Add New... > Project**.
2. Selecione o repositório `Inema` e defina o **Root Directory** como:
   `card-sorting`
3. Em **Domains**, adicione o subdomínio desejado:
   - Exemplo: `cardsorting.inema.ba.gov.br` ou `inema-cardsorting.vercel.app`
4. Configure as variáveis de ambiente do Supabase (abaixo).

---

## 🗄️ Configuração do Supabase

### 1. Criar a Tabela no Supabase
Acesse o **SQL Editor** do seu projeto no Supabase e execute o script localizado em:
`supabase/schema.sql`

```sql
create table if not exists public.card_sorting_submissions (
  id uuid primary key default gen_random_uuid(),
  participant_name text not null,
  participant_department text not null,
  submitted_at timestamp with time zone default timezone('utc'::text, now()) not null,
  total_cards integer not null default 0,
  total_groups integer not null default 0,
  assigned_percentage integer not null default 0,
  summary jsonb not null default '{}'::jsonb,
  structure_payload jsonb not null default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

### 2. Variáveis de Ambiente
Crie um arquivo `.env.local` na pasta `card-sorting/` (ou adicione nas Environment Variables da Vercel):

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon-publica
```

*Nota: Mesmo sem as credenciais do Supabase configuradas, a aplicação funciona perfeitamente em modo fallback, armazenando cópia no `localStorage`, gerando pré-visualização do JSON e permitindo copiar e baixar o arquivo `.json`.*
