# Checklist de QA — SISPASS: Gatilho para Nova Homologação após Alteração Cadastral

## 1. Identificação do Card
- **Título**: SISPASS: Gatilho para Nova Homologação após Alteração Cadastral
- **Módulo**: SISPASS / Cadastro e Homologação
- **Tipo**: Reteste de Correção de Defeito (Bugfix)
- **Defeito Original**: Notificação disparava, mas situação do perfil permanecia como "Deferido" em vez de ir para "Pendente de nova homologação".
- **Correção do Dev**: Cadastrada a situação `pendente_nova_homologacao` e atualizada a chamada `SpSolicitacao.soli_siso_id` no serviço `SpRehomologacaoService::registrarAlteracao()`.

---

## 2. Objetivo do Teste
Validar que a alteração de dados cadastrais elegíveis (Nome, E-mail, Endereço, Telefone, Documento de Identificação) de um usuário com perfil SISPASS Deferido:
1. Dispara o gatilho orientado a eventos sem rotina periódica.
2. Altera a situação dos perfis para **"Pendente de nova homologação"** (em Meus Perfis e na Pauta Geral).
3. Cria ciclo de homologação com prazo de 30 dias corridos.
4. Notifica o usuário.
5. Disponibiliza a ação **"Reenviar para Nova Homologação"**.
6. Mantém o prazo original e acumula alterações secundárias no mesmo ciclo.

---

## 3. Matriz de Reteste & Cenários

- [x] **CT01 — Reteste Central (Bugfix) — REPROVADO**:
  - Usuário com perfil SISPASS "Deferido" (`Administrador do Sistema`, perfis Responsável Técnico e Criador Amador).
  - Alterado dado cadastral (Telefone para `(71) 98888-7777` em Meu Cadastro). Cadastro finalizado com sucesso.
  - **Resultado**: Os perfis em "Meus Perfis" PERMANECERAM na situação **"Deferido"** (Print 03).
  - **Resultado**: Na "Pauta Geral de Perfis" (/validar-documentos), os perfis continuam como **"Deferido"** e a aba de Pendentes permanece zerada (Print 04).

- [ ] **CT02 — Disparo de Notificação**: Notificações anteriores de 06:05 existiam, porém nenhuma nova notificação foi disparada pela alteração.

- [x] **CT03 — Ação de Reenvio Disponibilizada — REPROVADO**:
  - Com o perfil permanecendo em "Deferido", o botão/ação de reenvio não foi habilitado.

- [ ] **CT04 — Ciclo de 30 dias corridos**: Bloqueado pela não ocorrência da transição.

---

## 4. Evidências do Reteste (Padrão de Prints em anexos.zip)
- `Print 01 - Perfis Deferidos antes da alteracao cadastral.png`
- `Print 02 - Alteracao do telefone em Meu Cadastro e gravacao concluida.png`
- `Print 03 - Meus Perfis permanece Deferido sem transicao para Pendente de nova homologacao.png`
- `Print 04 - Pauta Geral de Perfis mantem situacao Deferido e contador de pendentes zerado.png`
