# Feature Map - Accountancy

## Objetivo

A feature `accountancy` sustenta o módulo de gerenciamento de contabilidades.
Ela cobre listagem, detalhe, criação, edição e remoção de contabilidades.

## Superfície funcional

Arquivos principais:

- [accountancy-form-dialog.tsx](/Users/henilveira/Documents/societiza/web.societiza/src/features/accountancy/components/accountancy-form-dialog.tsx)
- [columns.tsx](/Users/henilveira/Documents/societiza/web.societiza/src/features/accountancy/components/columns.tsx)
- [data-table.tsx](/Users/henilveira/Documents/societiza/web.societiza/src/features/accountancy/components/data-table.tsx)

Papel da superfície:

- `data-table.tsx` orquestra a listagem;
- `columns.tsx` define leitura e ações da tabela;
- `accountancy-form-dialog.tsx` encapsula create/edit.

## Microserviços internos da feature

### 1. Microserviço de contrato e validação

Arquivos:

- [accountancy.schema.ts](/Users/henilveira/Documents/societiza/web.societiza/src/features/accountancy/schemas/accountancy.schema.ts)

Responsabilidade:

- definir o shape da entidade `Accountancy`;
- definir o input de criação e edição;
- centralizar coerção e tipos inferidos.

### 2. Microserviço de integração HTTP

Arquivo:

- [accountancy.service.ts](/Users/henilveira/Documents/societiza/web.societiza/src/features/accountancy/server/services/accountancy.service.ts)

Responsabilidade:

- encapsular chamadas REST para `/accountancy`;
- expor `getAll`, `getById`, `create`, `update`, `delete`;
- isolar a feature do `fetcher` e do catálogo de endpoints.

Dependências externas:

- `API_ENDPOINTS.accountancy`
- `fetcher` global baseado em Axios

### 3. Microserviço de leitura e cache

Arquivo:

- [useAccountancyQueries.ts](/Users/henilveira/Documents/societiza/web.societiza/src/features/accountancy/hooks/queries/useAccountancyQueries.ts)

Responsabilidade:

- transformar o serviço HTTP em queries do TanStack Query;
- expor `useAccountancies` e `useAccountancyById`;
- manter cache indexado por endpoint e por id.

Observação:

- a feature ainda usa uma convenção mais antiga de `QUERY_KEY`, sem a fábrica de
  `queryOptions` mais sofisticada vista em outras features.

### 4. Microserviço de mutação e sincronização de tela

Arquivo:

- [useAccountancyMutations.ts](/Users/henilveira/Documents/societiza/web.societiza/src/features/accountancy/hooks/mutations/useAccountancyMutations.ts)

Responsabilidade:

- encapsular create, update e delete;
- sincronizar a tela após mutation;
- emitir feedback via Sonner.

Ponto importante:

- a feature já usa `refreshVisibleAndMarkStale`, então está aderente ao padrão
  mais recente de refetch amigável para UX.

## Fluxo de dados

1. A tabela pede dados via `useAccountancies`.
2. A query chama `accountancyService.getAll`.
3. O serviço usa `fetcher` e o catálogo de endpoints.
4. O resultado volta tipado para a tabela.
5. Create/update/delete disparam mutation hooks.
6. O hook refresca as queries visíveis e marca o restante como stale.

## Acoplamentos

- depende do catálogo global de endpoints;
- depende do `fetcher` global;
- depende da política global de refresh via `query-refresh`;
- depende de Sonner para feedback visual.

## Pontos fortes

- estrutura pequena e clara;
- CRUD previsível;
- acoplamento baixo dentro da própria feature;
- policy de refresh já atualizada.

## Limitações e riscos

- não há `index.ts` público da feature;
- não há um `query-options.ts` dedicado, então a feature está funcional, mas
  menos modular do que `workflow-template`;
- a documentação interna do comportamento do form dialog ainda depende de
  leitura de componente.
