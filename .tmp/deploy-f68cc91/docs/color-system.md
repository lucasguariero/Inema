# Color System INEMA / SEIA

Fonte de verdade: `src/styles/globals.css`.

O verde oficial `#0F4C3A` ocupa o nível `700` da escala primitiva. Azul continua disponível apenas para domínios que precisem representar recursos hídricos; nunca é a cor primária de ação.

## Arquitetura

```text
--color-green-700
        ↓
--color-action-primary
        ↓
--button-primary-bg
```

- Primitivos: `--color-green-*`, `--color-red-*`, `--color-orange-*`, `--color-neutral-*`.
- Transparências: `--color-green-alpha-{08,20,32,56,72,100}`.
- Semânticos: `--color-{brand,action,surface,text,border,status}-*`.
- Componentes: `--button-*`, `--input-*`, `--card-*`, `--sidebar-*`, `--topbar-*`, `--badge-*`, `--table-*`, `--nav-*` e `--data-*`.

## Uso

Componentes devem consumir o token de componente mais específico disponível. Use um token semântico quando não existir token de componente. Hexadecimal direto fica restrito à declaração dos primitivos e a dados externos que não representem o design system.

```tsx
<button className="bg-[var(--button-primary-bg)] hover:bg-[var(--button-primary-bg-hover)] text-[var(--button-primary-text)]" />

<span className="bg-[var(--badge-warning-bg)] text-[var(--badge-warning-text)] border-[var(--badge-warning-border)]" />
```

## Status

- Sucesso: família verde, semanticamente separada de Brand.
- Atenção: família laranja.
- Crítico: família vermelha.
- Informação: família neutra; azul não assume papel de primary.

## Migração inicial

Esta primeira etapa cobre o shell SEIA V2, logo/topbar, navegação clara, botões e badges compartilhados, pills de status e a paleta dos gráficos da dashboard. Telas legadas continuam funcionais e podem migrar gradualmente, sem alterar layout ou regras de negócio.
