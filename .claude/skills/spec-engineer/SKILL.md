---
name: spec-engineer
description: Transforms a product spec into a structured frontend implementation plan. Called by the frontend-engineer agent during Phase 2. Detects implementation mode (FULL vs VISUAL-FIRST), parses specs, classifies backend dependencies, generates ordered task breakdowns, and performs UX audits before implementation begins.
---

# Spec Engineer — Planejamento de Implementação Frontend

Esta skill recebe o conteúdo de uma spec de produto (lida via `/read-spec` ou fornecida pelo usuário) e transforma em um plano de implementação frontend estruturado e acionável.

A skill opera em dois modos distintos: **FULL** (backend disponível) ou **VISUAL-FIRST** (apenas spec).

---

## Passo 0 — Detectar modo de implementação

Antes de qualquer análise, identificar o modo reportado pelo `/read-spec`:

### MODO: FULL
**Quando**: spec.md aprovada + logic.md aprovado disponível **ou** `docs/integration/[feature].md` existe no repo local

**Comportamento**: planejamento completo na ordem canônica (Tasks 1-12).
Os endpoints são classificados como READY / PARTIAL / MISSING com base na documentação disponível.

### MODO: VISUAL-FIRST
**Quando**: spec.md aprovada + sem logic.md + sem doc de integração local

**Comportamento**: arquitetura visual primeiro — schemas propostos, mock data, UI navegável, contrato de integração gerado pelo frontend.
A ordem das tasks é diferente (visual antes dos dados — ver Passo 3).

**Ativar `skills/visual-architect`** antes de prosseguir para inferir entidades e propor schemas.

---

## Passo 1 — Parsear a spec

Independente do modo, parsear a spec procurando:

### 1.1 Identificação da feature
- Nome da feature
- Objetivo do produto (que problema ela resolve)
- Usuários envolvidos: contador (`Accountancy`), empresário (`cliente`), ou ambos

### 1.2 Fluxo de UX
Mapear o fluxo de interação passo a passo:
- O que o usuário vê ao entrar na tela
- Cada ação possível e o que o sistema responde
- Onde há loading, onde há erro, onde há vazio
- Transições entre estados

### 1.3 Endpoints ou operações de dados

**Em modo FULL**: identificar endpoints explicitamente mencionados
- Método HTTP (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`)
- Path completo (`/api/[recurso]/[sub-recurso]`)
- Shape do payload de request
- Shape do payload de response
- Casos de erro documentados

**Em modo VISUAL-FIRST**: inferir operações a partir da spec
- Cada ação do usuário → verbo (criar, listar, editar, excluir) + recurso
- Cada dado exibido → campo a ser retornado
- Cada formulário → payload de request proposto

### 1.4 Regras de negócio que afetam o frontend
Extrair apenas as regras com impacto direto em:
- Validações de formulário
- Estados condicionais da UI
- Permissões e controles de visibilidade
- Fluxos alternativos baseados em dados

### 1.5 Estados de erro
- Erros que devem ser mostrados ao usuário
- Mensagens esperadas em português
- Ações de recuperação disponíveis

---

## Passo 2 — Classificar dependências de backend

### Em modo FULL: classificação READY / PARTIAL / MISSING

Para cada endpoint identificado no Passo 1.3:

#### READY
Endpoint existe, está documentado em `docs/integration/[feature].md` ou `logic.md`, e o contrato está completo.

**Ação**: implementar normalmente.

#### PARTIAL
Endpoint existe mas o contrato está incompleto (campos não documentados, tipos ambíguos, comportamento de erro não especificado).

**Ação**: implementar com atenção, documentar as lacunas, perguntar ao time de backend se a lacuna for bloqueante.

#### MISSING
Endpoint não existe ainda ou não há documentação.

**Ação**: criar mock MSW em `_mock.ts` com contrato que espelha exatamente o schema Zod. Zero código de produção deve precisar mudar quando o backend entregar.

### Em modo VISUAL-FIRST: classificação PROPOSED

Todos os endpoints são **PROPOSED** — o frontend propõe o contrato:

| Operação | Endpoint Proposto | Payload | Ação |
|----------|------------------|---------|------|
| Listar [X] | GET /api/[x] | — | Schema proposto + mock MSW |
| Criar [X] | POST /api/[x] | { campos inferidos } | Schema proposto + mock MSW |
| Atualizar [X] | PUT /api/[x]/:id | { campos editáveis } | Schema proposto + mock MSW |

Todos os schemas criados em VISUAL-FIRST carregam o comentário:
```ts
// PROPOSTO — aguardando backend. Ver docs/integration/[feature].md
```

---

## Passo 3 — Gerar o task breakdown

### Em modo FULL — Ordem canônica (Tasks 1-12)

```
Task 1  — Git Setup
Task 2  — Schema Layer (Zod, baseado em contratos reais)
Task 3  — Service Layer (fetch functions)
Task 4  — Query Layer (TanStack Query)
Task 5  — Mutation Layer (invalidação + toasts)
Task 6  — Form Layer (somente se houver formulários)
Task 7  — UI Components (visuais puros)
Task 8  — Orchestration Components (wiring hooks)
Task 9  — Page/Route Integration (App Router)
Task 10 — Backend Mocks (somente para MISSING)
Task 11 — Quality Gate
Task 12 — Commit + PR Draft
```

### Em modo VISUAL-FIRST — Ordem visual-first (Tasks 1-13)

```
Task 1  — Git Setup
Task 2  — Schema Layer (schemas PROPOSTOS inferidos da spec)
Task 3  — Mock Layer (_mock.ts com dados realistas — vem ANTES do service)
Task 4  — UI Components (visual puro, props baseadas nos schemas propostos)
Task 5  — Orchestration Components (wiring hooks → UI com mock ativo)
Task 6  — Page/Route Integration (feature navegável e demonstrável)
Task 7  — Service Layer (fetch functions apontando para API — com MSW interceptando)
Task 8  — Query Layer (TanStack Query)
Task 9  — Mutation Layer (operações de escrita com mock)
Task 10 — Form Layer (se aplicável)
Task 11 — Integration Contract (gerar docs/integration/[feature].md)
Task 12 — Quality Gate
Task 13 — Commit + PR Draft
```

**Rationale da inversão**: em VISUAL-FIRST, a feature precisa ser navegável com dados realistas o mais rápido possível. O visual (Tasks 4-6) não depende do backend — depende apenas dos schemas propostos e do mock. A camada de dados (Tasks 7-10) é construída depois, mas de forma que quando o backend chegar, zero mudança na UI layer seja necessária.

### Para cada task, especificar (em qualquer modo)

- **Arquivos a criar ou modificar** com paths completos
- **O que cada arquivo contém** (responsabilidade clara)
- **Critério de conclusão** (o que valida que a task está pronta)
- **Verificação TypeScript** obrigatória: `npx tsc --noEmit`

---

## Passo 4 — Auditoria de UX

Antes de apresentar o plano, verificar:

### Loading states
- Toda operação async tem estado de loading identificado?
- Loading state usa skeleton (preferido) ou spinner?
- Skeleton tem a mesma dimensão/estrutura do conteúdo real?

### Error states
- Todo erro de API tem mensagem em português?
- A mensagem é amigável (não mostra chave técnica ou stack trace)?
- Há ação de recuperação disponível (retry, voltar, tentar novamente)?

### Empty states
- Toda lista pode ficar vazia?
- O empty state tem mensagem útil e/ou CTA?
- O empty state é diferente do loading state? (nunca mostrar vazio enquanto carrega)

### Mutation feedback
- Toda ação de escrita tem feedback imediato?
- Se a latência for perceptível: atualização otimista ou loader no botão?
- Sempre exibir toast de sucesso E toast de erro?

### Acessibilidade mínima
- Todos os elementos interativos têm nome acessível (`aria-label` ou texto visível)?
- Ações destrutivas têm dialog de confirmação?
- Formulários têm labels associados aos campos?

### Responsividade
- A feature funciona em mobile (min 375px)?
- A feature funciona em desktop?
- Layouts críticos foram considerados para ambas as telas?

---

## Passo 5 — Output do plano

### Sempre gerar: `docs/plans/[feature-name].md`
Usar o template em `skills/spec-engineer/references/plan-template.md` como base.

O plano deve:
- Ser completo o suficiente para ser executado sem perguntas adicionais
- Ser honesto sobre lacunas (em FULL: documentar PARTIAL; em VISUAL-FIRST: marcar tudo como PROPOSED)
- Ter paths reais de arquivos, não genéricos
- Ser acionável task por task

### Em modo VISUAL-FIRST, gerar adicionalmente: `docs/integration/[feature].md`
Usar a skill `visual-architect` (Passo 4) para gerar o contrato proposto pelo frontend.

Este documento serve como:
- Guia para o backend sobre o que o frontend precisa
- Contrato de referência para evitar divergências na integração
- Documentação viva — atualizar quando o backend entregar

### Apresentar o plano ao usuário para confirmação antes de executar qualquer código.

---

## O que esta skill NÃO faz

- Não executa código
- Não cria arquivos de implementação
- Não toma decisões sobre design visual
- Não inventa regras de negócio ausentes da spec
- Não substitui validação de contrato de backend com suposições
- Não bloqueia a implementação em modo VISUAL-FIRST — avança sempre com o que tem
