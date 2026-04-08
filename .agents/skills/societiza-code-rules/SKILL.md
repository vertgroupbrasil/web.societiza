---
name: societiza-code-rules
description: Primary code-rules skill for the Societiza frontend. Use for any task that writes, refactors, reviews, or organizes frontend code in this project. Enforces feature-based architecture, barrel imports through index.ts, service-to-hooks-to-components layering, presentation-only components/ui, required query-options, mutation refetch plus optimistic UI, and required feature README plus docs/features documentation.
user-invocable: true
argument-hint: '[feature, file, or change]'
---

# Societiza Code Rules

Esta é a fonte primária das regras de código do frontend do `web.societiza`.

Use esta skill sempre que a tarefa envolver escrita, refatoração, revisão ou
organização de código frontend no projeto.

## Leitura obrigatória

Leia nesta ordem:

1. `references/architecture.md`
2. `references/folder-contracts.md`
3. `references/import-and-barrel-rules.md`
4. `references/hooks-and-data-flow.md`
5. `references/components-rules.md`

Leia adicionalmente quando necessário:

- documentação da feature: `references/docs-and-readmes.md`
- validação e qualidade: `references/testing-and-quality.md`
- execução prática: `references/checklists.md`

## Regras mandatórias

- Todo código frontend deve respeitar a arquitetura feature-based do projeto.
- Todo import interno deve sair de um `index.ts` público quando esse barrel já
  existir.
- `server/services` é a camada HTTP mais primitiva da feature.
- Nenhum componente deve chamar service diretamente; chamadas de service devem
  ser encapsuladas em hooks da própria feature.
- Toda feature com queries deve ter `hooks/queries/query-options.ts`.
- Toda mutation deve viver em `hooks/mutations/`, usar service da feature,
  tratar erro de forma consistente e ter estratégia explícita de
  refetch/invalidate.
- Preferir UI otimista em mutations quando a interface se beneficiar disso.
- `components/ui/` é somente apresentação e estado visual local.
- `components/ui/` não pode conter mutation orchestration, query orchestration,
  regra de domínio, validação de negócio, service call ou action handler de
  negócio.
- Se um componente precisar orquestrar actions, criar hook próprio e consumir
  esse hook em componente fora de `components/ui/`.
- Toda feature relevante deve ter `README.md` refletindo o domínio real dela.
- Toda mudança relevante deve atualizar `docs/features/`.

## Papel das outras skills

Esta skill define **como o código do frontend deve ser escrito**.

Ela não substitui skills de UI, UX, copy ou testing. Essas skills entram por
cima desta, mas sem quebrar estas regras de código.

## Escopo

- Esta skill cobre somente frontend do `web.societiza`.
- Ela não autoriza backend.
- Quando uma task exigir backend, isso deve ser tratado pela skill mestra e pelo
  boundary já existente, não por esta skill.
