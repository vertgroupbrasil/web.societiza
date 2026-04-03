# Feature Map - Workflow

## Objetivo

A feature `workflow` sustenta a experiência operacional do módulo societário em
formato board/kanban. É a camada onde o usuário acompanha e opera processos,
visualiza etapas, abre drawers e interage com tarefas.

## Superfície funcional

Componentes principais:

- [Board.tsx](/Users/henilveira/Documents/societiza/web.societiza/src/features/workflow/components/Board.tsx)
- [Column.tsx](/Users/henilveira/Documents/societiza/web.societiza/src/features/workflow/components/Column.tsx)
- [Card.tsx](/Users/henilveira/Documents/societiza/web.societiza/src/features/workflow/components/Card.tsx)
- [CorporateDrawer.tsx](/Users/henilveira/Documents/societiza/web.societiza/src/features/workflow/components/CorporateDrawer.tsx)
- [new-process-form.tsx](/Users/henilveira/Documents/societiza/web.societiza/src/features/workflow/components/forms/new-process-form.tsx)
- [edit-process-form.tsx](/Users/henilveira/Documents/societiza/web.societiza/src/features/workflow/components/forms/edit-process-form.tsx)

Subcomponentes utilitários de UI:

- filtros
- busca
- progress bar
- checklist de tarefas
- diálogo de processo

## Microserviços internos da feature

### 1. Microserviço de contrato do domínio societário

Arquivos:

- [process.schema.ts](/Users/henilveira/Documents/societiza/web.societiza/src/features/workflow/schemas/process.schema.ts)
- [stage.schema.ts](/Users/henilveira/Documents/societiza/web.societiza/src/features/workflow/schemas/stage.schema.ts)
- [utils.schema.ts](/Users/henilveira/Documents/societiza/web.societiza/src/features/workflow/schemas/utils.schema.ts)
- [corporate.types.ts](/Users/henilveira/Documents/societiza/web.societiza/src/features/workflow/server/types/corporate.types.ts)

Responsabilidade:

- descrever processo, etapas, tipos de processo e tarefas;
- fornecer tipos inferidos do domínio operacional;
- encapsular filtros e lógica auxiliar.

### 2. Microserviço de integração HTTP

Arquivo:

- [corporate.service.ts](/Users/henilveira/Documents/societiza/web.societiza/src/features/workflow/server/services/corporate.service.ts)

Responsabilidade:

- fornecer CRUD e listagens do fluxo operacional;
- expor `create`, `update`, `delete`, `getProcesses`, `getStages`,
  `getProcessTypes`, `getProcessById`.

Ponto crítico:

- o service ainda conversa com `API_ENDPOINTS.workflowTemplate`, não com uma
  API operacional isolada de processos. Isso evidencia uma fase de transição do
  domínio.

### 3. Microserviço de leitura e cache do board

Arquivos:

- [query-options.ts](/Users/henilveira/Documents/societiza/web.societiza/src/features/workflow/hooks/queries/query-options.ts)
- [useCorporateQueries.ts](/Users/henilveira/Documents/societiza/web.societiza/src/features/workflow/hooks/queries/useCorporateQueries.ts)

Responsabilidade:

- organizar query keys de `corporate`;
- listar processos por etapas;
- listar etapas e tipos;
- buscar processos e etapas por id.

Subserviços derivados:

- `processesByStages`
- `processById`
- `listStages`
- `stageById`
- `listProcessTypes`
- `processTypeById`

### 4. Microserviço de mutation operacional

Arquivo:

- [useCorporateMutations.ts](/Users/henilveira/Documents/societiza/web.societiza/src/features/workflow/hooks/mutations/useCorporateMutations.ts)

Responsabilidade:

- criar processo;
- atualizar processo;
- arquivar/remover processo;
- refrescar dados visíveis do board;
- popular cache individual de processo recém-criado.

### 5. Microserviço de orquestração de contexto

Arquivos:

- [CorporateProvider.tsx](/Users/henilveira/Documents/societiza/web.societiza/src/features/workflow/contexts/CorporateProvider.tsx)
- [CorporateFilterContext.tsx](/Users/henilveira/Documents/societiza/web.societiza/src/features/workflow/contexts/filters/CorporateFilterContext.tsx)
- [CorporateTableContext.tsx](/Users/henilveira/Documents/societiza/web.societiza/src/features/workflow/contexts/table/CorporateTableContext.tsx)
- [CorporateUIContext.tsx](/Users/henilveira/Documents/societiza/web.societiza/src/features/workflow/contexts/ui/CorporateUIContext.tsx)
- [useCorporateContext.tsx](/Users/henilveira/Documents/societiza/web.societiza/src/features/workflow/contexts/useCorporateContext.tsx)

Responsabilidade:

- compor os três subcontextos da feature;
- separar preocupações de filtro, tabela e UI;
- fornecer infraestrutura de estado para o board.

Essa feature usa múltiplos “microserviços de estado”, e o provider principal só
os compõe.

### 6. Microserviço de lógica utilitária do board

Arquivos:

- [useCorporateFilters.ts](/Users/henilveira/Documents/societiza/web.societiza/src/features/workflow/hooks/utils/useCorporateFilters.ts)
- [useDebounce.ts](/Users/henilveira/Documents/societiza/web.societiza/src/features/workflow/hooks/utils/useDebounce.ts)
- [useTaskSequentialLogic.ts](/Users/henilveira/Documents/societiza/web.societiza/src/features/workflow/hooks/utils/useTaskSequentialLogic.ts)
- [corporate.utils.ts](/Users/henilveira/Documents/societiza/web.societiza/src/features/workflow/utils/corporate.utils.ts)

Responsabilidade:

- filtrar board e pesquisa;
- debouncing de interação;
- lógica sequencial de tarefas;
- utilidades de transformação do domínio.

### 7. Microserviço de formulários operacionais

Arquivos:

- [useProcessForm.tsx](/Users/henilveira/Documents/societiza/web.societiza/src/features/workflow/hooks/forms/useProcessForm.tsx)
- [useEditProcessForm.tsx](/Users/henilveira/Documents/societiza/web.societiza/src/features/workflow/hooks/forms/useEditProcessForm.tsx)
- [new-process-form.tsx](/Users/henilveira/Documents/societiza/web.societiza/src/features/workflow/components/forms/new-process-form.tsx)
- [edit-process-form.tsx](/Users/henilveira/Documents/societiza/web.societiza/src/features/workflow/components/forms/edit-process-form.tsx)

Responsabilidade:

- capturar criação e edição de processo;
- conectar formulários ao service e às mutations.

## Fluxo de dados do board

1. `Board.tsx` consome queries de processos, etapas e tipos.
2. O `CorporateProvider` oferece estado de filtro, tabela e UI.
3. O board distribui processos em colunas.
4. `Card` representa uma unidade operacional.
5. `CorporateDrawer` abre o detalhe do processo.
6. Mudanças disparam mutations.
7. O cache do board é atualizado por `refreshVisibleAndMarkStale`.

## Acoplamentos

- acoplamento forte com `workflow-template` via endpoints reutilizados;
- dependência do catálogo global de endpoints;
- dependência dos contexts da própria feature;
- dependência da política global de refetch;
- dependência do domínio legado de “processo/etapa/tipo” em português.

## Pontos fortes

- boa separação entre estado de UI, filtro e tabela;
- query key factory bem definida;
- board baseado em domínio claro;
- utilitários específicos para lógica sequencial.

## Limitações e riscos

- o service está semanticamente desalinhado com seu nome: ele fala em
  `corporate/process`, mas usa endpoints de `workflowTemplate`;
- o README atual está desatualizado e ainda reflete uma versão anterior da
  feature;
- parte do domínio operacional ainda convive com contratos herdados da API
  antiga e da nova API de template.
