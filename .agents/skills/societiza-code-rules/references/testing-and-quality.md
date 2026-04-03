# Testes e Qualidade

Padrão mínimo para mudança de código:

- tentar Jest
- tentar Playwright quando houver UI, navegação, interação ou risco de
  regressão visual/comportamental

## Quando Playwright é obrigatório

- páginas
- dialogs, sheets, drawers
- formulários
- drag and drop
- toasts
- estados assíncronos de UI
- navegação
- fluxos de workflow/template

## Quando registrar legado

Se Jest ou Playwright falharem por problema pré-existente:

- dizer exatamente qual comando foi rodado
- dizer o que falhou
- dizer se é relacionado ou não à mudança

## Fechamento esperado

- build executado quando aplicável
- Jest executado quando aplicável
- Playwright executado quando aplicável
- documentação atualizada quando a mudança for relevante
