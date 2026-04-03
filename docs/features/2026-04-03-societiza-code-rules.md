# Societiza Code Rules

## Objetivo

Criar uma skill dedicada para ser a fonte primária das regras de escrita de
código do frontend do `web.societiza`, removendo a dependência de regras
espalhadas entre memória implícita, instruções verbais e duplicações na skill
mestra.

## Contexto

O projeto já tinha uma skill mestra de orquestração (`societiza-operating-system`),
mas ela acumulava ao mesmo tempo:

- roteamento entre skills
- regras de arquitetura
- política de testes
- convenções de documentação

Isso deixava as regras de código frontend pouco modulares e mais difíceis de
evoluir. Ao mesmo tempo, a base real do projeto já mostrava convenções fortes:

- endpoints centralizados em `src/routes/endpoints.ts`
- feature-based architecture
- uso recorrente de barrels `index.ts`
- uso de service -> hooks -> components
- necessidade de separar orchestration de `components/ui`

## O que foi criado

Foi criada a nova skill local:

- `.agents/skills/societiza-code-rules/`

Ela contém:

- `SKILL.md` com o contrato curto e mandatário
- `agents/openai.yaml` com metadados de interface
- referências específicas para:
  - arquitetura base
  - contrato de pastas
  - regras de import e barrel
  - hooks e fluxo de dados
  - regras de componentes
  - documentação da feature
  - testes e qualidade
  - checklists operacionais

## Decisões de arquitetura codificadas

### 1. Endpoints

Toda feature nova integrada à API deve registrar seus endpoints em
`src/routes/endpoints.ts`, seguindo agrupamento por domínio e rotas
parametrizadas por função.

### 2. Schemas e types

- `schemas/` modela DTOs por entidade relevante
- `server/types/` deve preferir inferência a partir dos schemas

### 3. Services

`server/services/` foi formalizado como a camada HTTP mais primitiva da feature:

- request/fetch/axios parsing básico
- sem toast
- sem state
- sem cache de query
- sem regra de UI

### 4. Hooks

O fluxo recomendado passou a ser explícito:

- `hooks/queries/` para leitura
- `hooks/mutations/` para escrita
- `hooks/forms/` para lógica de formulário
- `hooks/utils/` para hooks auxiliares
- `hooks/components/` para orchestration de componente

Também foi formalizada a exigência de `query-options.ts` em features com query.

### 5. Components

Foi fixada a separação:

- `components/ui/` = apresentação apenas
- `components/forms/` = composição de formulário
- `components/` = integração/orchestration da feature

Regra explícita:

`components/ui/` não pode conter `useQuery`, `useMutation`, service call, regra
de domínio, validação de negócio nem action handler de negócio.

### 6. Imports

A skill formaliza que imports internos devem sair de `index.ts` público quando
o barrel já existir.

Também define quando um barrel deve ser criado e quais exceções são aceitáveis.

### 7. Documentação

A skill torna obrigatório:

- `README.md` da feature refletindo o domínio real
- atualização de `docs/features/` para mudanças relevantes

Isso também corrige um problema já presente no projeto: há `README.md` de
features com conteúdo copiado e incorreto.

## Mudanças na skill mestra

A `societiza-operating-system` foi ajustada para:

- carregar `societiza-code-rules` antes de codar no frontend
- deixar de duplicar regras de arquitetura mais detalhadas
- continuar responsável pelo roteamento entre skills, boundary de backend,
  testes e fluxo geral de trabalho

Em outras palavras:

- `societiza-operating-system` decide **qual skill usar**
- `societiza-code-rules` decide **como o código frontend deve ser escrito**

## Impacto esperado

- menos improviso estrutural
- menos lógica de negócio vazando para `components/ui`
- menos deep imports desnecessários
- mais consistência entre features
- maior previsibilidade para criação e refatoração de código

## Limitações

- a skill não corrige automaticamente features já divergentes
- ela documenta o padrão alvo e o padrão operacional para mudanças futuras
- ainda será necessário revisar features legadas que usam `utils/`, `lib/`,
  `services/` ou `README.md` de forma inconsistente

## Validação

Validação executada nesta mudança:

- conferência estrutural dos diretórios de `src/features`
- leitura das referências atuais da `societiza-operating-system`
- leitura da organização real de `workflow-template`
- verificação de `src/routes/endpoints.ts`
- verificação de `README.md` legados para capturar inconsistências reais

Não houve necessidade de Jest ou Playwright, porque esta entrega altera apenas
skills e documentação operacional, sem código executável da aplicação.
