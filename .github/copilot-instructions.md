# Agent Instructions - Societiza

## Objetivo

Este documento define como um agente de IA deve escrever e organizar código neste repositório.
A prioridade e manter consistencia com a arquitetura feature-based existente, reduzir acoplamento e manter imports centralizados.

## Regras Nao Negociaveis

1. Toda funcionalidade nova deve nascer em uma pasta propria dentro de [src/features](src/features).
2. Nao misturar codigo de features diferentes na mesma pasta.
3. Cada pasta relevante deve ter um arquivo index.ts exportando tudo daquela pasta.
4. Imports internos de uma feature devem preferir o index da propria feature (barrel), evitando caminhos profundos.
5. Componentes compartilhados entre features devem ficar fora da feature, em [src/components](src/components) ou [src/lib](src/lib), nunca em uma feature especifica.
6. Respeitar os aliases do projeto definidos em [tsconfig.json](tsconfig.json#L1), especialmente @societiza/_ e aliases de feature (@corporate/_, @form/\*, etc).

## Arquitetura Base (Feature-Based)

Cada feature deve seguir este formato (adaptar somente quando houver necessidade real):

src/features/<nome-da-feature>/

- index.ts
- README.md (opcional, recomendado para features complexas)
- components/
  - index.ts
  - ui/
    - index.ts
  - forms/
    - index.ts
- constants/
  - index.ts
- contexts/
  - index.ts
  - filters/
  - table/
  - ui/
- hooks/
  - index.ts
  - forms/
    - index.ts
  - mutations/
    - index.ts
  - queries/
    - index.ts
  - utils/
    - index.ts
- schemas/
  - index.ts
- server/
  - index.ts
  - types/
    - index.ts
  - services/
    - index.ts
  - utils/
    - index.ts
- utils/
  - index.ts

Observacao: a estrutura real de [src/features/form](src/features/form) deve ser usada como referencia principal.

## Convencoes de Barrel (index.ts)

### Regra

Sempre exportar para cima em cascata, ate chegar no index da feature.

### Exemplo de fluxo

- hooks/forms/useX.ts
- hooks/forms/index.ts -> export \* from './useX'
- hooks/index.ts -> export \* from './forms'
- feature/index.ts -> export \* from './hooks'

### Regra de import

Preferir:

- import {...} from '@societiza/features/minha-feature'

Ou, quando fizer sentido local:

- import {...} from '../index'

Evitar:

- imports profundos e repetitivos apontando para arquivos internos sem necessidade.

## Separacao de Responsabilidades

### schemas/

- Definir contratos de dados (Zod) por dominio.
- Separar schema por assunto (nao um arquivo gigante).

### server/types/

- Inferir tipos a partir de schemas quando aplicavel.
- Tipos de transporte (DTO) e resposta devem ficar aqui.

### server/services/

- Camada mais baixa de chamadas HTTP.
- Nao colocar regra de UI aqui.
- Retornar response.data tipado.

### hooks/queries/

- Encapsular leitura de dados (React Query).
- Query keys e options organizadas em arquivos dedicados quando necessario.

### hooks/mutations/

- Encapsular escrita (create/update/delete).
- Invalidar queries relacionadas com criterio.

### hooks/forms/

- Orquestrar react-hook-form, validacoes, efeitos e fluxo de submit.

### hooks/utils/

- Regras auxiliares e reutilizaveis da feature.

### components/

- Componentes de tela e composicao da feature.

### components/ui/

- Componentes visuais da feature (apenas se forem especificos da feature).
- Se for reutilizavel entre features, mover para [src/components/ui](src/components/ui).

### contexts/

- Estado de tela e composicao local da feature (filtros, tabela, UI state).

### constants/

- Mapeamentos e configuracoes estaticas da feature (ex.: cores de progresso, labels, regras fixas).

## Padroes Tecnicos do Repositorio

1. TypeScript estrito habilitado; evitar any.
2. noUnusedLocals esta ativo; nao deixar variaveis/simbolos sem uso.
3. exactOptionalPropertyTypes ativo; cuidado com props opcionais e undefined.
4. Usar alias @societiza/\* em vez de caminhos relativos longos.
5. Manter coerencia com Next.js App Router ja existente.
6. Em client components, usar "use client" apenas quando necessario.

## Convencao de Nomenclatura e Case

Padrao capturado a partir da feature de referencia em [src/features/form](src/features/form).

1. Pastas: `kebab-case` e minusculas.

- Exemplos: `hooks/forms`, `hooks/queries`, `components/forms/sections`.

2. Arquivos gerais `.ts/.tsx`: preferir `kebab-case`.

- Exemplos: `company-form.tsx`, `query-options.ts`, `form.constants.ts`, `form.service.ts`.

3. Arquivos de secao com escopo por dominio: usar sufixo por ponto quando fizer sentido.

- Exemplos: `basic-data.company.tsx`, `address-data.partners.tsx`.

4. Componentes React (nome do simbolo exportado): `PascalCase`.

- Exemplos: `CompanyDataForm`, `FormRenderer`, `FinishDialog`.

5. Hooks (nome do simbolo exportado): `camelCase` com prefixo `use`.

- Exemplos: `useOpeningForm`, `useFormMutations`, `useCepLookup`.

6. Funcoes utilitarias e variaveis: `camelCase`.

- Exemplos: `getStepById`, `getProgressPercentage`, `saveCompanyDataAndProceed`.

7. Tipos e interfaces: `PascalCase`.

- Exemplos: `FormStepConfig`, `CompanyData`, `PartnersData`.

8. Constantes globais e listas imutaveis: `UPPER_SNAKE_CASE`.

- Exemplos: `FORM_STEPS`, `UFs`, `REQUIRED_FIELDS`.

9. Schemas Zod: seguir sufixo explicito com contexto.

- Preferencia: `camelCase` + `Schema` para schema principal (ex.: `openingFormSchemaResponse`).
- Quando houver padrao legado na feature (ex.: `_companyData`, `_partners`), manter consistencia local e evitar renomeacao sem necessidade.

10. Chaves de payload/API: manter o contrato do backend (normalmente `snake_case`) sem forcar conversao para `camelCase`.

- Exemplos: `processo_id`, `empresa_id`, `val_capital_social`.

### Regra Pratica (resumo rapido)

- `PascalCase`: componentes, tipos, interfaces.
- `camelCase`: hooks, funcoes, variaveis, schemas (quando nao houver legado).
- `kebab-case`: arquivos e pastas.
- `UPPER_SNAKE_CASE`: constantes compartilhadas.
- `snake_case`: campos de contrato externo (API/DTO), preservando compatibilidade.

## Checklist Obrigatorio Ao Criar Nova Feature

1. Criar pasta da feature em [src/features](src/features).
2. Criar subpastas de arquitetura (components, hooks, schemas, server, etc).
3. Criar todos os index.ts necessarios (barrels).
4. Implementar schemas e tipos primeiro, depois services, depois hooks, depois UI.
5. Garantir que imports internos passam pelo index da feature sempre que possivel.
6. Evitar duplicacao de logica entre features; extrair para shared quando fizer sentido.
7. Validar build local com npm run build.
8. Se aplicavel, rodar npm run test e corrigir regressao.

## Anti-Patterns (Nao Fazer)

1. Criar arquivos de feature fora de [src/features](src/features).
2. Importar profundamente arquivos internos ignorando os barrels sem necessidade.
3. Colocar regra de negocio em componentes de UI.
4. Colocar chamada HTTP direta em componente React.
5. Misturar tipos de API com estado de UI no mesmo arquivo sem criterio.
6. Criar componente supostamente compartilhado dentro de uma feature.

## Exemplo de Fluxo Recomendado (Nova Funcionalidade)

1. Definir schema em schemas/.
2. Inferir/criar tipos em server/types/.
3. Criar service em server/services/.
4. Criar hooks de queries/mutations/forms conforme necessidade.
5. Criar componentes em components/ e components/ui/.
6. Expor tudo via index.ts por nivel.
7. Consumir pela tela usando import centralizado da feature.

## Criterio de Qualidade Minimo para PR

- Arquitetura da feature respeitada.
- Sem erros de tipagem.
- Sem quebrar npm run build.
- Imports consistentes com barrels.
- Sem codigo morto evidente.

## Notas de Contexto do Projeto

- O projeto usa forte organizacao por feature e ja possui referencia clara em [src/features/form](src/features/form).
- Existe uso de React Query para data-fetching e Zod para validacao.
- O padrao esperado e evoluir essas features mantendo modularidade e previsibilidade de imports.
