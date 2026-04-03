# Hooks e Fluxo de Dados

Fluxo padrão:

- `server/services` faz a chamada primitiva
- `hooks/queries` lê
- `hooks/mutations` escreve
- `hooks/forms` encapsula formulário
- `hooks/components` orquestra componente
- `components/` integra hooks com UI
- `components/ui/` só renderiza

## Query rules

- Query hook nunca deve chamar endpoint diretamente.
- Query hook usa service da feature.
- Query hook deve usar `query-options.ts`.
- Query key deve ser centralizada e estável.

## Mutation rules

- Mutation hook nunca deve viver dentro de componente.
- Mutation hook usa service da feature.
- Mutation hook deve definir refetch/invalidate.
- Mutation hook deve preferir UX otimista quando aplicável.
- Mutation hook deve centralizar toast/erro/sucesso da operação, não replicar
  isso em vários componentes.

## Form rules

- Se um componente de formulário tiver lógica de submit, transformação de dados,
  reset, erro ou sync de defaults de forma relevante, extrair para
  `hooks/forms`.

## Component orchestration rules

- Se um componente precisar coordenar reorder, save, publish, archive, delete,
  ou composição de vários hooks, mover a orchestration para `hooks/components`.
- Handlers com validação de negócio e `mutate`/`mutateAsync` são orchestration.
- Esse tipo de handler não pertence a `components/ui/`.
