-- ==============================================================================
-- SCHEMA DO SUPABASE: Tabela de Submissões do Card Sorting (INEMA)
-- ==============================================================================

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

-- Índices para consultas analíticas rápidas
create index if not exists idx_card_sorting_department on public.card_sorting_submissions (participant_department);
create index if not exists idx_card_sorting_submitted_at on public.card_sorting_submissions (submitted_at desc);

-- RLS (Row Level Security)
alter table public.card_sorting_submissions enable row level security;

-- Política de inserção pública (permite que qualquer stakeholder envie sem login)
create policy "Permitir insercao anonima de card sorting"
  on public.card_sorting_submissions
  for insert
  to anon, authenticated
  with check (true);

-- Política de leitura pública (ou restrita a admins via dashboard)
create policy "Permitir leitura de resultados"
  on public.card_sorting_submissions
  for select
  to anon, authenticated
  using (true);
