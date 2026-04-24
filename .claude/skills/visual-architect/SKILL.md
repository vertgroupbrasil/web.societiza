---
name: visual-architect
description: Skill de arquitetura visual para features sem backend disponível. Ativada quando existe spec aprovada mas não existe logic.md nem doc de integração. Produz feature completamente navegável com mock data, schemas Zod propostos, e contrato de integração para o backend implementar.
---

# Visual Architect — Arquitetura Visual a partir de Spec Pura

Esta skill é ativada exclusivamente em **MODO: VISUAL-FIRST** — quando existe spec aprovada mas não existe `logic.md` nem `docs/integration/[feature].md`.

Seu objetivo é produzir uma feature **completa, navegável e demonstrável** sem depender do backend — e fazer isso de forma que a integração posterior gere zero retrabalho na camada visual.

---

## Princípio Central: A Camada Imutável

```
┌─────────────────────────────────────────────────┐
│  CAMADA IMUTÁVEL (nunca muda na integração)      │
│  components/ui/ — componentes visuais puros      │
│  components/ — orquestração de hooks             │
│  hooks/forms/ — formulários e validação           │
├─────────────────────────────────────────────────┤
│  CAMADA DE DADOS (pode ajustar na integração)    │
│  schemas/ — contratos Zod (propostos → reais)    │
│  server/services/ — fetch functions               │
│  hooks/queries/ — TanStack Query                 │
│  hooks/mutations/ — operações de escrita          │
├─────────────────────────────────────────────────┤
│  MOCK LAYER (removida quando backend chegar)     │
│  _mock.ts — MSW handlers com dados realistas     │
│  BACKEND_NEEDED.md — contrato proposto           │
└─────────────────────────────────────────────────┘
```

**Regra de ouro**: design cada `components/ui/` para receber dados já processados via props tipadas. Quando o backend chegar e a camada de dados for atualizada, a UI permanece intacta — sem uma linha mudada.

---

## Passo 1 — Extrair entidades da spec

Ler a spec procurando **substantivos e dados que aparecem na UI**:

### 1.1 Identificar entidades principais
Procurar na spec por:
- "o usuário vê [X]" → X é uma entidade ou campo
- "lista de [X]" → X é uma coleção
- "detalhes de [X]" → X tem campos internos
- "criar [X]" / "editar [X]" / "excluir [X]" → X é mutável

**Exemplo de extração:**
```
Spec diz: "O contador vê a lista de processos abertos com nome da empresa, CNPJ, etapa atual e data de abertura."

Entidade: Processo
Campos inferidos:
  - nomeEmpresa: string
  - cnpj: string
  - etapaAtual: string (ou enum se a spec listar as etapas)
  - dataAbertura: string (ISO date)
  - id: string (sempre inferir um identificador)
```

### 1.2 Identificar ações do usuário
Para cada ação descrita na spec:
- "o usuário clica em [botão]" → verbo + recurso = endpoint proposto
- "preenche formulário com [campos]" → request payload
- "o sistema mostra [resultado]" → response payload

**Exemplo:**
```
Spec diz: "Ao clicar em 'Criar processo', abre um formulário com nome da empresa, CNPJ e tipo de processo."

Endpoint proposto: POST /api/processos
Request payload: { nomeEmpresa: string, cnpj: string, tipoProcesso: string }
Response: { id: string, ... (mesmos campos + id) }
```

### 1.3 Identificar relacionamentos
- "cada processo tem uma lista de etapas" → Processo → Etapa[] (nested ou separado)
- "um membro é responsável por um processo" → Processo.membroResponsavelId: string

---

## Passo 2 — Propor schemas Zod

Com as entidades e campos extraídos, criar schemas Zod que representam o **contrato que o frontend propõe ao backend**.

### 2.1 Convenções de schema proposto

Todo schema criado em VISUAL-FIRST mode deve ter o comentário de cabeçalho:
```ts
/**
 * SCHEMA PROPOSTO — VISUAL-FIRST MODE
 * Criado a partir de inferência da spec. Revisar contra implementação do backend.
 * @see docs/integration/[feature].md
 */
```

### 2.2 Tipos que a spec não especifica explicitamente

Usar estes defaults seguros quando o tipo não está explícito:
- Identificadores → `z.string().uuid()` (ou `z.string()` se o formato for desconhecido)
- Datas → `z.string().datetime()` (ISO 8601)
- Status/estados → `z.enum([...])` se a spec listar os estados, `z.string()` caso contrário
- Valores monetários → `z.number()` (não `z.string()` — o backend provavelmente retorna número)
- Booleanos de feature → `z.boolean()`
- Arrays → `z.array(itemSchema)` com `.min(0)` implícito

### 2.3 Nullability em schemas propostos

Ser conservador — quando em dúvida, preferir `.nullable()` a `.optional()` para campos que podem não ter valor. O backend pode ser mais permissivo na entrega:

```ts
// Preferir isso (campo presente mas pode ser null):
nomeFantasia: z.string().nullable(),

// Evitar isso quando não há garantia de que o campo virá:
// nomeFantasia: z.string().optional(),
```

### 2.4 Exemplo de schema proposto completo

```ts
/**
 * SCHEMA PROPOSTO — VISUAL-FIRST MODE
 * @see docs/integration/processos.md
 */
import { z } from 'zod'

export const processoSchema = z.object({
  id: z.string().uuid(),
  nomeEmpresa: z.string(),
  cnpj: z.string(),
  tipoProcesso: z.enum(['abertura', 'alteracao', 'encerramento']),
  etapaAtual: z.string(),
  etapaAtualIndex: z.number().int(),
  totalEtapas: z.number().int(),
  status: z.enum(['em_andamento', 'concluido', 'cancelado']),
  dataAbertura: z.string().datetime(),
  membroResponsavelId: z.string().uuid().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

export const processoCreateSchema = z.object({
  nomeEmpresa: z.string().min(1, 'Nome da empresa é obrigatório'),
  cnpj: z.string().length(14, 'CNPJ deve ter 14 dígitos'),
  tipoProcesso: z.enum(['abertura', 'alteracao', 'encerramento']),
})

export const processoListSchema = z.array(processoSchema)

export type Processo = z.infer<typeof processoSchema>
export type ProcessoCreate = z.infer<typeof processoCreateSchema>
```

---

## Passo 3 — Hierarquia de componentes do UX flow

Transformar o fluxo UX da spec em uma árvore de componentes.

### 3.1 Metodologia de decomposição

Para cada tela descrita na spec:
1. **Identificar o container** (a tela/página inteira)
2. **Identificar seções** (áreas funcionais distintas da tela)
3. **Identificar elementos atômicos** (cards, rows, badges, botões)

**Exemplo:**
```
Spec: "Tela de board kanban com colunas representando etapas. Cada coluna tem cards de processos."

Hierarquia:
  ProcessosBoard (container — orquestração)
    └── ProcessosBoardColumn (por etapa)
          └── ProcessoCard (por processo)
                ├── ProcessoCardHeader
                ├── ProcessoCardProgress
                └── ProcessoCardActions

States necessários:
  ProcessosBoardSkeleton (loading)
  ProcessosBoardEmpty (sem processos)
  ProcessosBoardError (falha de carregamento)
```

### 3.2 Regras de decomposição visual-first

- **Cada componente `ui/` recebe apenas dados já processados** — nenhum schema bruto diretamente
- **Props devem ser primitivos ou tipos simples** — nunca passar o objeto de query inteiro
- **Callbacks tipados** — `onSelect: (id: string) => void`, nunca generics desnecessários
- **Skeleton tem mesma estrutura do conteúdo** — mesmos slots, mesma altura

```tsx
// CERTO — props primitivas e tipadas
type ProcessoCardProps = {
  id: string
  nomeEmpresa: string
  etapaAtual: string
  progresso: number // 0-100
  status: 'em_andamento' | 'concluido' | 'cancelado'
  onSelect: (id: string) => void
}

// ERRADO — passa schema bruto
type ProcessoCardProps = {
  processo: Processo // nunca — isso acopla UI ao contrato de API
  onSelect: (processo: Processo) => void // nunca
}
```

### 3.3 Mapear estados visuais obrigatórios

Para cada tela/seção, documentar todos os estados:

| Estado | Trigger | Componente | Comportamento |
|--------|---------|-----------|---------------|
| Loading inicial | `isLoading === true` | `[X]Skeleton` | Skeleton com estrutura real |
| Lista vazia | `data.length === 0` | `[X]Empty` | Mensagem em português + CTA |
| Erro de carregamento | `isError === true` | `[X]Error` | Mensagem amigável + "Tentar novamente" |
| Mutation em andamento | `isPending === true` | Loader no botão | Botão desabilitado + spinner |
| Mutation sucesso | `onSuccess` | Toast sonner | Mensagem positiva em português |
| Mutation erro | `onError` | Toast sonner | Mensagem de erro em português |

---

## Passo 4 — Gerar contrato proposto (docs/integration)

Criar `docs/integration/[feature].md` com o contrato que o frontend **propõe** para o backend implementar.

Este documento serve como:
1. **Guia para o backend** — o que o frontend precisa para funcionar
2. **Contrato de referência** — evita divergências durante a integração
3. **Documentação viva** — atualizada quando o backend entregar

### 4.1 Estrutura do arquivo

```markdown
# Contrato de Integração — [Nome da Feature]

> **Status**: PROPOSTO (gerado em VISUAL-FIRST mode)
> **Criado em**: [data]
> **Revisão necessária**: quando o backend implementar, atualizar este arquivo com o contrato real

---

## Entidades

### [Entidade]

| Campo | Tipo | Nullable | Observações |
|-------|------|----------|-------------|
| id | string (UUID) | não | Identificador único |
| nomeEmpresa | string | não | Nome completo |
| ... | ... | ... | ... |

---

## Endpoints

### GET /api/[recurso]

**Descrição**: [o que retorna]

**Query params** (se aplicável):
| Param | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| page | number | não | Paginação |

**Response 200:**
```json
{
  "items": [...],
  "total": 0
}
```

**Response de erro esperado:**
| Status | Quando | Body |
|--------|--------|------|
| 401 | Não autenticado | `{ "error": "..." }` |
| 403 | Sem permissão | `{ "error": "..." }` |

---

### POST /api/[recurso]

**Request body:**
```json
{
  "campo": "tipo"
}
```

**Regras de negócio esperadas** (inferidas da spec):
- [regra 1]
- [regra 2]

---

## Notas para o backend

- [observação 1 sobre comportamento esperado]
- [observação 2 sobre campos ambíguos]
```

### 4.2 Propriedades do contrato proposto

- **Honesto sobre incerteza** — marcar campos com `(inferido da spec)` quando não há certeza
- **Completo o suficiente** — cobrir todos os endpoints necessários para a feature funcionar
- **Incluir exemplos** — exemplos de request/response com dados realistas
- **Listar regras inferidas** — o que o frontend espera que o backend valide

---

## Passo 5 — Mock data strategy

### 5.1 Princípios do mock perfeito

O mock MSW deve ser tão bom que o QA não consiga distinguir do backend real:
- **Dados realistas** — usar nomes brasileiros, CNPJs válidos, datas coerentes
- **Variedade** — mock de lista com 3-8 itens cobrindo diferentes estados
- **Latência simulada** — `await new Promise(r => setTimeout(r, 300))` para testar loading states
- **Erros simulados** — um endpoint pode retornar erro ocasional para testar error states

### 5.2 Estrutura do `_mock.ts`

```ts
/**
 * MOCK DE BACKEND — VISUAL-FIRST MODE
 * Remover cada handler quando o endpoint correspondente estiver disponível.
 * @see BACKEND_NEEDED.md
 * @see docs/integration/[feature].md
 */
import { http, HttpResponse, delay } from 'msw'
import { API_ENDPOINTS } from '@societiza/routes/endpoints'

// Dados de seed — realistas e variados
const mockProcessos = [
  {
    id: '550e8400-e29b-41d4-a716-446655440000',
    nomeEmpresa: 'Padaria do João LTDA',
    cnpj: '12345678000190',
    tipoProcesso: 'abertura',
    etapaAtual: 'Documentação',
    etapaAtualIndex: 0,
    totalEtapas: 5,
    status: 'em_andamento',
    dataAbertura: new Date().toISOString(),
    membroResponsavelId: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  // ... mais 2-3 itens cobrindo diferentes estados
] satisfies Processo[]

export const processosMockHandlers = [
  // TODO: remover quando GET /api/processos estiver disponível no backend
  http.get(API_ENDPOINTS.processos.list(), async () => {
    await delay(300) // simular latência real
    return HttpResponse.json({ items: mockProcessos, total: mockProcessos.length })
  }),

  // TODO: remover quando POST /api/processos estiver disponível no backend
  http.post(API_ENDPOINTS.processos.create(), async ({ request }) => {
    await delay(500)
    const body = await request.json()
    const novoProcesso = {
      id: crypto.randomUUID(),
      ...body,
      etapaAtual: 'Documentação',
      etapaAtualIndex: 0,
      totalEtapas: 5,
      status: 'em_andamento',
      dataAbertura: new Date().toISOString(),
      membroResponsavelId: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    return HttpResponse.json(novoProcesso, { status: 201 })
  }),
]
```

### 5.3 Validar mock contra schema

Sempre validar os dados de seed contra o schema Zod:
```ts
// No final do _mock.ts — garante que mock e schema estão sincronizados
mockProcessos.forEach(p => processoSchema.parse(p))
```

Se o `parse` falhar em desenvolvimento, o erro aparece no console — mock e schema sempre em sincronia.

---

## Passo 6 — Task order em VISUAL-FIRST mode

A ordem das tasks é diferente do modo FULL. O visual vem ANTES dos dados:

### Ordem VISUAL-FIRST

```
Task 1  — Git Setup
Task 2  — Schema Layer (schemas PROPOSTOS baseados na spec)
Task 3  — Mock Layer (_mock.ts com dados realistas completos)
Task 4  — UI Components (visual puro, props baseadas nos schemas)
Task 5  — Orchestration Components (wiring hooks → UI)
Task 6  — Page/Route Integration (feature navegável completa)
Task 7  — Service Layer (funções fetch apontando para mock via MSW)
Task 8  — Query Layer (TanStack Query consumindo services)
Task 9  — Mutation Layer (operações de escrita com mock)
Task 10 — Form Layer (se aplicável)
Task 11 — Integration Contract (docs/integration/[feature].md)
Task 12 — Quality Gate
Task 13 — Commit + PR
```

**Rationale**: Tasks 4-6 (visual) são independentes do backend. Implementá-las primeiro permite validar o design, o fluxo e os estados com dados de mock antes de construir a camada de dados. Quando o backend chegar, apenas Tasks 7-10 precisam de ajuste — sem tocar a UI.

---

## O que esta skill NÃO faz

- Não inventa regras de negócio ausentes da spec
- Não assume que o frontend sabe mais que o backend sobre domínio
- Não ignora a spec — toda inferência deve ter respaldo no texto
- Não cria componentes que buscam dados diretamente
- Não deixa mock sem `// TODO: remover quando...`
- Não entrega feature sem `docs/integration/` documentado
