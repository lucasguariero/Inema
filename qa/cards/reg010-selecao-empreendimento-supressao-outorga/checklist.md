# Checklist de QA — REG010: Seleção do Empreendimento e Verificações (TL001 e TL002)

## 1. Identificação do Card
- **Título**: 1. REG010 - Implementar seleção do empreendimento e verificações de supressão e Outorga
- **Módulo**: Requerimento de Licenciamento / APE (TL001 e TL002)
- **Resultado**: NÃO RESOLVIDO (Bloqueio Impeditivo na TL001)

---

## 2. Validações Executadas
- [x] **Seleção de Requerimento APE**: Acesso à Etapa 02 com APE disponível e abertura do questionário.
- [ ] **Seleção de Empreendimento Rural (C001 / RNG-002)**: Disparo do bloqueio "O empreendimento selecionado não está vinculado ao CEFIR nem possui CAR ativo" (Print 01).
- [ ] **Preenchimento Manual do CEFIR (C002)**: Campo exibido, preenchido com CEFIR ativo "BA-2927408-2026-0005", porém a trava de validação não é liberada e o botão Próximo permanece inoperante (Print 02).
- [ ] **Módulo de Empreendimentos**: Ausência de campo para vínculo de CEFIR/CAR ao inserir imóvel rural (Print 03).
- [x] **Propriedade Rural Ativa**: Cadastro de Imóvel Rural com CEFIR ativo confirmado no sistema (Print 04).
- [ ] **Verificações de Supressão e Outorga (TL002)**: Bloqueado por dependência da TL001.

---

## 3. Evidências (anexos.zip)
- Print 01 - Bloqueio CEFIR ao selecionar Empreendimento Rural.png
- Print 02 - Preenchimento manual do CEFIR sem desbloqueio do avanco.png
- Print 03 - Cadastro de Empreendimento sem campo de vinculo com CEFIR.png
- Print 04 - Imovel Rural com CEFIR ativo cadastrado no sistema.png
