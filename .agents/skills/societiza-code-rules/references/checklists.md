# Checklists

## Nova feature frontend

- criar endpoints em `src/routes/endpoints.ts`
- criar schemas DTO por entidade relevante
- inferir types a partir dos schemas
- criar service primitivo
- criar `query-options.ts`
- criar hooks de queries e mutations
- criar `hooks/forms` se houver formulário
- criar `hooks/components` se houver orchestration
- criar `components/`, `components/forms/`, `components/ui/`
- criar `README.md` da feature
- criar doc em `docs/features/`

## Mutation nova

- service já existe ou foi criado
- mutation criada em `hooks/mutations/`
- erro tratado de forma consistente
- refetch/invalidate definido
- UI otimista avaliada
- componente não chama service diretamente

## Componente visual com ação

- parte visual em `components/ui/`
- orchestration em hook
- integração em componente fora de `ui`

## Revisão arquitetural

- imports passam por barrel
- sem deep import indevido
- sem hooks de mutation/query em `components/ui/`
- sem service call em componente
- README da feature condiz com o domínio real
- `docs/features/` atualizado se a mudança foi relevante
