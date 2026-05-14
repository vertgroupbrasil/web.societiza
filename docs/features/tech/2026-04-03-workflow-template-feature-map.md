# Feature Map - Workflow Template

## Objetivo

A feature `workflow-template` é o núcleo de configuração do produto. Ela
permite criar, listar, editar, rascunhar, publicar e reorganizar templates de
workflow que serão usados pelo módulo societário.

É a feature mais complexa do frontend atual.

## Superfície funcional

Componentes principais:

- [societario-home.tsx](/Users/henilveira/Documents/societiza/web.societiza/src/features/workflow-template/components/societario-home.tsx)
- [template-list.tsx](/Users/henilveira/Documents/societiza/web.societiza/src/features/workflow-template/components/template-list.tsx)
- [template-builder.tsx](/Users/henilveira/Documents/societiza/web.societiza/src/features/workflow-template/components/template-builder.tsx)
- [template-kanban.tsx](/Users/henilveira/Documents/societiza/web.societiza/src/features/workflow-template/components/template-kanban.tsx)

Subcomponentes estratégicos:

- [create-template-dialog.tsx](/Users/henilveira/Documents/societiza/web.societiza/src/features/workflow-template/components/ui/create-template-dialog.tsx)
- [template-column.tsx](/Users/henilveira/Documents/societiza/web.societiza/src/features/workflow-template/components/ui/template-column.tsx)
- [template-process-sheet.tsx](/Users/henilveira/Documents/societiza/web.societiza/src/features/workflow-template/components/ui/template-process-sheet.tsx)
- [template-task-card.tsx](/Users/henilveira/Documents/societiza/web.societiza/src/features/workflow-template/components/ui/template-task-card.tsx)
- [template-task-editor.tsx](/Users/henilveira/Documents/societiza/web.societiza/src/features/workflow-template/components/ui/template-task-editor.tsx)
- [template-field-editor.tsx](/Users/henilveira/Documents/societiza/web.societiza/src/features/workflow-template/components/ui/template-field-editor.tsx)
- [template-task-sheet.tsx](/Users/henilveira/Documents/societiza/web.societiza/src/features/workflow-template/components/ui/template-task-sheet.tsx)

## Microserviços internos da feature

### 1. Microserviço de contrato e schemas

Arquivos:

- [template.schema.ts](/Users/henilveira/Documents/societiza/web.societiza/src/features/workflow-template/schemas/template.schema.ts)
- [step.schema.ts](/Users/henilveira/Documents/societiza/web.societiza/src/features/workflow-template/schemas/step.schema.ts)
- [task.schema.ts](/Users/henilveira/Documents/societiza/web.societiza/src/features/workflow-template/schemas/task.schema.ts)
- [field.schema.ts](/Users/henilveira/Documents/societiza/web.societiza/src/features/workflow-template/schemas/field.schema.ts)
- [template.types.ts](/Users/henilveira/Documents/societiza/web.societiza/src/features/workflow-template/server/types/template.types.ts)

Responsabilidade:

- descrever list item, detail item, status, DTOs e parâmetros de mutation;
- centralizar tipagem de template, etapa, tarefa e campo;
- tipar o retorno da API e os parâmetros internos de operação.

### 2. Microserviço de integração HTTP do template

Arquivo:

- [template.service.ts](/Users/henilveira/Documents/societiza/web.societiza/src/features/workflow-template/server/services/template.service.ts)

Responsabilidade:

- listar templates;
- buscar template por id;
- criar template;
- criar draft a partir de template;
- atualizar template;
- ativar, arquivar e publicar;
- adicionar, atualizar e remover steps;
- adicionar, atualizar e remover tasks;
- adicionar, atualizar e remover fields de step e task.

Subresponsabilidades importantes:

- parsear `options` do backend, que chega como string JSON;
- serializar `options` na ida para o backend;
- ordenar fields durante o `transformDetail`.

Este é o principal microserviço de integração da feature.

### 3. Microserviço de leitura e cache

Arquivos:

- [query-options.ts](/Users/henilveira/Documents/societiza/web.societiza/src/features/workflow-template/hooks/queries/query-options.ts)
- [use-workflow-template-queries.ts](/Users/henilveira/Documents/societiza/web.societiza/src/features/workflow-template/hooks/queries/use-workflow-template-queries.ts)

Responsabilidade:

- organizar query keys de lista e detalhe;
- materializar leitura de templates;
- sustentar seleção entre ativos, drafts e detalhe corrente.

### 4. Microserviço de mutação de template

Arquivo:

- [use-template-mutations.ts](/Users/henilveira/Documents/societiza/web.societiza/src/features/workflow-template/hooks/mutations/use-template-mutations.ts)

Responsabilidade:

- criar template;
- criar draft;
- atualizar template;
- ativar template;
- arquivar template;
- publicar workflow.

Pontos importantes:

- usa `refreshVisibleAndMarkStale`;
- centraliza mensagens de erro com `getApiErrorMessage`;
- já reflete o ciclo draft/publish.

### 5. Microserviço de mutação de steps

Arquivo:

- [use-step-mutations.ts](/Users/henilveira/Documents/societiza/web.societiza/src/features/workflow-template/hooks/mutations/use-step-mutations.ts)

Responsabilidade:

- adicionar etapa com optimistic update;
- atualizar etapa;
- remover etapa;
- reordenar etapas.

Subresponsabilidade importante:

- gerar `tempId` para criação otimista;
- reconciliar cache local com o id real retornado pela API.

### 6. Microserviço de mutação de tasks

Arquivo:

- [use-task-mutations.ts](/Users/henilveira/Documents/societiza/web.societiza/src/features/workflow-template/hooks/mutations/use-task-mutations.ts)

Responsabilidade:

- adicionar tarefa com optimistic update;
- atualizar tarefa;
- remover tarefa;
- reordenar tarefas.

### 7. Microserviço de mutação de fields

Arquivo:

- [use-field-mutations.ts](/Users/henilveira/Documents/societiza/web.societiza/src/features/workflow-template/hooks/mutations/use-field-mutations.ts)

Responsabilidade:

- adicionar, atualizar, remover e reordenar fields de etapa;
- adicionar, atualizar, remover e reordenar fields de tarefa;
- aplicar optimistic update e rollback.

Esta feature separa fields de etapa e fields de tarefa como dois
subdomínios próximos, mas distintos.

### 8. Microserviço de cache otimista e reconciliação

Arquivo:

- [template-cache.ts](/Users/henilveira/Documents/societiza/web.societiza/src/features/workflow-template/lib/template-cache.ts)

Responsabilidade:

- atualizar cache de detalhe do template sem roundtrip completo;
- restaurar cache em rollback;
- substituir step/task/field temporário por definitivo;
- encapsular operações de replace em estruturas aninhadas.

Este arquivo funciona como infraestrutura de estado local da feature.

### 9. Microserviço de validação e erro

Arquivos:

- [template-validation.ts](/Users/henilveira/Documents/societiza/web.societiza/src/features/workflow-template/lib/template-validation.ts)
- [api-error.ts](/Users/henilveira/Documents/societiza/web.societiza/src/features/workflow-template/lib/api-error.ts)

Responsabilidade:

- traduzir erros da API em mensagens acionáveis;
- validar aspectos importantes antes de publicar;
- reduzir a incidência de falhas opacas na UI.

### 10. Microserviço de geração de labels e naming transitório

Arquivos:

- [entity-labels.ts](/Users/henilveira/Documents/societiza/web.societiza/src/features/workflow-template/lib/entity-labels.ts)
- [field-labels.ts](/Users/henilveira/Documents/societiza/web.societiza/src/features/workflow-template/lib/field-labels.ts)

Responsabilidade:

- gerar rótulos amigáveis;
- evitar colisões triviais de nomes temporários;
- sustentar experiência de criação sequencial de step/task/field.

### 11. Microserviço de constantes e política de stale time

Arquivo:

- [template.constants.ts](/Users/henilveira/Documents/societiza/web.societiza/src/features/workflow-template/constants/template.constants.ts)

Responsabilidade:

- concentrar constantes da feature;
- sustentar stale times e enums visuais.

## Fluxo de dados principal

1. A home societária mostra ativos e drafts.
2. A lista usa queries de template para obter catálogo e estado.
3. O builder carrega um detail por id.
4. O `template.service` transforma o payload bruto em shape utilizável.
5. Steps, tasks e fields são editados por mutations específicas.
6. O cache é atualizado otimisticamente.
7. A API confirma e o cache é reconciliado.
8. Publish e draft mudam o ciclo de vida do template.

## Acoplamentos

- dependência forte do catálogo global de endpoints;
- dependência forte do `fetcher`;
- dependência da política global de `query-refresh`;
- dependência cruzada com `workflow`, porque o board operacional consome o mesmo
  espaço conceitual;
- dependência da API de workflow-template para todo o ciclo de vida.

## Pontos fortes

- feature bem modularizada;
- separação clara entre template, step, task e field;
- suporte a optimistic UI;
- suporte a draft/publish;
- camada de transformação de contrato centralizada no service.

## Limitações e riscos

- alta complexidade estrutural;
- qualquer mudança no contrato da API afeta service, schemas e cache helpers;
- a feature depende muito da integridade da ordenação;
- publish, draft e edição em uso convivem em uma zona de transição entre UX e
  domínio backend;
- parte do comportamento ainda depende de convivência com o módulo `workflow`.
