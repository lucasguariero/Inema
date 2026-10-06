# Regressão ampliada — FilamentSelect
Componente existente, API pública preservada; nenhuma dependência nova.

## Bug confirmado e corrigido
No modal Novo Usuário do SEIA V2, Escape com Select aberto fechava também o Dialog. Radix processava a captura do documento antes do stopPropagation do handler React.
Correção mínima: listener de keydown na janela do container apenas enquanto aberto; trata somente Escape originado dentro do Select. Cancela propagação, fecha popover e restaura foco. Cleanup remove listener. Segundo Escape com Select fechado continua chegando ao Dialog.

## Consumidores reais — M10, todos aprovados
| Área | Rota | Instância | Particularidade |
|---|---|---|---|
| Fiscalização | ?rota=fisc-pauta-gestor-registros&escopo=pauta-gestor | Ordenar | Valor controlado |
| Fauna | ?rota=fauna-especies | Nova Espécie / Grupo Animal | Formulário de página, não modal |
| SEIA V2 | ?rota=seia-v2&tela=usuarios-roles | Novo Usuário / Lotação | Modal, valor inicial DIPRE fixo no consumidor mock |
| Unidade de Conservação | ?rota=uc-agendamento | Novo Agendamento / UC | Formulário de página, valor controlado |

Em cada um: abrir, mouse, ArrowDown/ArrowUp, Home/End, Enter, Escape, Tab/Shift+Tab, fechamento, valor inicial e foco. Sem pageerror.
No SEIA V2 onChange preexistente é no-op: o teste prova emissão/fechamento/foco, não persistência da seleção. Não corrigido fora desta rodada.

## Busca e disabled — M09 + regressão v1
Fixture controlada começa Jaguaquara; três opções Abaíra/Jaguaquara/Xique-Xique. Busca Abaíra e Abaira, seleção por mouse/teclado, clique externo, disabled sem abertura, Home/End/Enter, Tab/Shift+Tab com destinos de foco, dois caminhos listbox/combobox. Município real da Fiscalização cobre 417 opções.
Não se afirma que cada consumidor sem busca exposta oferece busca ou que seu formulário foi salvo. A cobertura completa está distribuída entre instâncias representativas.
P02 repete Escape no SEIA V2 publicado. Nenhuma regressão restante nos caminhos testados; não é auditoria de todos os consumidores do repositório.
