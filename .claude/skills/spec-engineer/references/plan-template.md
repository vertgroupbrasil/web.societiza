# Plano de Implementação Frontend — [Nome da Feature]

## Referência
- Spec: product.societiza/specs/[arquivo].md
- Data: [data]
- Branch: feat/[nome]
- Base: develop

---

## Dependências de Backend

| Endpoint | Método | Status | Ação |
|----------|--------|--------|------|
| /api/... | POST | READY | Implementar normalmente |
| /api/... | GET | MISSING | Criar mock em `_mock.ts` |
| /api/... | PUT | PARTIAL | Implementar com atenção — contrato incompleto |

**Legenda:**
- `READY` — endpoint documentado e disponível
- `PARTIAL` — endpoint existe mas contrato tem lacunas
- `MISSING` — endpoint não existe — scaffold com mock MSW

---

## Regras de negócio que afetam o frontend

(lista das regras extraídas da spec que têm impacto direto em validação, estados, ou fluxos de UI)

- [Regra 1]: [descrição e impacto na UI]
- [Regra 2]: [descrição e impacto na UI]

---

## Fluxo de UX

(diagrama textual do fluxo do usuário)

```
Usuário entra na tela
  → [o que aparece: loading skeleton / lista vazia / lista com dados]
  → Usuário clica em [ação principal]
    → [o que o sistema mostra: dialog / sheet / redirect]
    → Usuário preenche [formulário / confirma / cancela]
      → Sucesso: [o que acontece: toast + refresh + redirect]
      → Erro: [o que aparece: toast de erro + mensagem amigável]
  → [outros fluxos alternativos]
```

---

## Estados visuais a implementar

| Estado | Componente | Tratamento |
|--------|-----------|-----------|
| Loading inicial | Skeleton com [N] cards | `[ComponenteSkeleton]` |
| Lista vazia | Empty state | "[Mensagem em português]" + [CTA se aplicável] |
| Erro de carregamento | Error state | "[Mensagem amigável]" + botão "Tentar novamente" |
| Mutation em andamento | Loader no botão | `isPending` no botão de submit |
| Mutation sucesso | Toast sonner | "[Mensagem de sucesso em português]" |
| Mutation erro | Toast sonner | "[Mensagem de erro em português]" |

---

## Tasks

### Task 1 — Git Setup
- [ ] Verificar branch atual com `git branch --show-current`
- [ ] Criar `feat/[nome]` a partir de `develop` se necessário
- [ ] Confirmar que não está em `main`, `master` ou `develop`

**Critério de conclusão**: branch `feat/[nome]` ativo

---

### Task 2 — Schema Layer
**Arquivos**: `src/features/[feature]/schemas/`

- [ ] `[entity].schema.ts` — schema de response da entidade principal
- [ ] `[entity].schema.ts` — schema de create DTO
- [ ] `[entity].schema.ts` — schema de update DTO
- [ ] `[entity].schema.ts` — schema de validação de formulário (se aplicável)
- [ ] `index.ts` — barrel exportando todos os schemas e tipos inferidos
- [ ] Tipos exportados via `z.infer<typeof schema>` em `server/types/[entity].types.ts`
- [ ] `npx tsc --noEmit` deve passar

**Regras críticas:**
- Schema de response modela o que a API devolve
- Schema de request (DTO) modela o payload que o frontend envia
- Tipos nunca são declarados manualmente — sempre `z.infer<>`
- Nulidade, opcional e ausência de campo são modelados com precisão (`.nullable()`, `.optional()`, `.nullish()`)

**Critério de conclusão**: `npx tsc --noEmit` passa sem erros

---

### Task 3 — Service Layer
**Arquivos**: `src/features/[feature]/server/services/`

- [ ] Registrar endpoints em `src/routes/endpoints.ts` (agrupados por domínio)
- [ ] `[entity].service.ts` — funções fetch tipadas usando `fetcher` de `@societiza/lib/axios`
- [ ] `index.ts` — barrel
- [ ] `server/types/[entity].types.ts` — tipos públicos inferidos dos schemas
- [ ] `server/types/index.ts` — barrel
- [ ] `npx tsc --noEmit` deve passar

**Regras críticas:**
- Service faz request e parse — apenas isso
- Sem toast, sem query cache, sem hook de React
- Usar `schema.parse(response.data)` para parsear responses
- Rotas parametrizadas são funções em `API_ENDPOINTS`

**Critério de conclusão**: `npx tsc --noEmit` passa sem erros

---

### Task 4 — Query Layer
**Arquivos**: `src/features/[feature]/hooks/queries/`

- [ ] `query-options.ts` — queryKeys hierárquicas + queryOptions para cada query
- [ ] `use[Entity]Queries.ts` — hooks finos consumindo as options
- [ ] `index.ts` — barrel
- [ ] `hooks/index.ts` — barrel do diretório hooks
- [ ] `staleTime` definido por tipo de dado (dados operacionais = conservador, dados estáticos = maior)
- [ ] `npx tsc --noEmit` deve passar

**Regras críticas:**
- `query-options.ts` é obrigatório — centraliza keys e funções
- Hooks são finos — não recriam `queryKey` nem `queryFn`
- `enabled` definido em `query-options.ts`, não no componente
- Componente consome hook, nunca service diretamente

**Critério de conclusão**: `npx tsc --noEmit` passa sem erros

---

### Task 5 — Mutation Layer
**Arquivos**: `src/features/[feature]/hooks/mutations/`

- [ ] `use[Entity]Mutations.ts` — hook com todas as operações de escrita da feature
- [ ] `invalidateQueries` no `onSuccess` de cada mutation
- [ ] Toast de sucesso em português no `onSuccess`
- [ ] Toast de erro em português no `onError`
- [ ] `index.ts` — barrel
- [ ] `npx tsc --noEmit` deve passar

**Regras críticas:**
- Toda mutation invalida queries relevantes — nunca omitir
- Toda mutation tem toast de sucesso E toast de erro — nunca só um
- `onError` nunca vazio — mínimo: log + toast de erro
- Toast usa `sonner`
- UI otimista com rollback quando há ganho real de UX

**Critério de conclusão**: `npx tsc --noEmit` passa sem erros

---

### Task 6 — Form Layer (somente se a feature tiver formulários)
**Arquivos**: `src/features/[feature]/hooks/forms/`

- [ ] `use[Entity]Form.ts` — hook com `useForm`, resolver Zod, defaults, submit, reset
- [ ] Integração com mutation hook
- [ ] Sincronização de edição via `form.reset()` quando dados chegam
- [ ] `defaultValues` explícitos para todos os campos
- [ ] `index.ts` — barrel
- [ ] `npx tsc --noEmit` deve passar

**Regras críticas:**
- Schema do form é o schema de request (DTO), nunca o de response
- `defaultValues` sempre explícitos para evitar campo controlado undefined
- `reset()` para sincronizar edição assíncrona
- Hook de form não renderiza JSX — apenas lógica

**Critério de conclusão**: `npx tsc --noEmit` passa sem erros

---

### Task 7 — Componentes UI
**Arquivos**: `src/features/[feature]/components/ui/`

- [ ] `[Component].tsx` — componente visual puro para cada bloco da UI
- [ ] `[Component]Skeleton.tsx` — skeleton para cada estado de loading
- [ ] `[Component]Empty.tsx` — empty state com mensagem ou CTA
- [ ] `[Component]Error.tsx` — error state com mensagem amigável
- [ ] `index.ts` — barrel
- [ ] `npx tsc --noEmit` deve passar

**Regras críticas:**
- Componentes ui/ recebem dados prontos via props — nunca buscam dados
- `useQuery` e `useMutation` são proibidos em `components/ui/`
- Callbacks são recebidos via props, nunca implementados internamente
- `useState`, `useEffect` para estado visual local são permitidos

**Critério de conclusão**: `npx tsc --noEmit` passa sem erros

---

### Task 8 — Componentes de Orquestração
**Arquivos**: `src/features/[feature]/components/`

- [ ] `[Feature]Screen.tsx` ou `[Feature]Container.tsx` — composição de hooks + UI
- [ ] Tratamento de loading, empty e error states
- [ ] Conversão de dados brutos em props visuais
- [ ] `index.ts` — barrel
- [ ] `npx tsc --noEmit` deve passar

**Regras críticas:**
- Componentes de orquestração consomem hooks — nunca services diretamente
- Quando a orquestração crescer demais: extrair para `hooks/components/`
- Props para `components/ui/` devem ser primitivos ou dados preparados, nunca objetos de query completos

**Critério de conclusão**: `npx tsc --noEmit` passa sem erros

---

### Task 9 — Integração de Rota/Página
**Arquivos**: `src/app/[rota]/`

- [ ] Criar ou atualizar `page.tsx`
- [ ] Prefetch no server quando possível:
  ```tsx
  await queryClient.prefetchQuery(entityQueryOptions.list())
  ```
- [ ] `HydrationBoundary` envolvendo o componente client
- [ ] `params` assíncronos seguindo padrão Next.js 15:
  ```tsx
  const { id } = await params
  ```
- [ ] `npx tsc --noEmit` deve passar

**Regras críticas:**
- `src/app/` é entrypoint — lógica de domínio fica na feature
- Páginas server component por padrão
- Componentes com hooks precisam de `'use client'`

**Critério de conclusão**: `npx tsc --noEmit` passa sem erros

---

### Task 10 — Mock de Backend (somente para endpoints MISSING)
**Arquivos**: `src/features/[feature]/_mock.ts`

- [ ] Handler MSW para cada endpoint `MISSING`
- [ ] Dados realistas que passam na validação do schema Zod
- [ ] Comentário em cada handler:
  ```ts
  // TODO: remover quando [endpoint] estiver disponível no backend
  ```
- [ ] Criar ou atualizar `BACKEND_NEEDED.md` com o contrato necessário

**Regras críticas:**
- Mock deve espelhar exatamente o schema Zod
- Zero alterações no código de produção quando o backend chegar
- Dados do mock devem ser realistas o suficiente para validar o fluxo completo

**Critério de conclusão**: aplicação funciona com mock ativo

---

### Task 11 — Quality Gate
- [ ] `npm run build` passou sem erros
- [ ] `npm run lint` passou (warnings justificados documentados)
- [ ] `npm run test -- src/features/[feature]` passou (se aplicável)
- [ ] `npx playwright test` passou para fluxos UI (se aplicável)
- [ ] Codex review executado via `/codex:rescue`
- [ ] Todos os erros `CRITICAL` e `WARNING` do Codex review resolvidos

**Critério de conclusão**: todos os checks passam, resultado documentado

---

### Task 12 — Commit e PR
- [ ] `git add` apenas arquivos da feature (nunca `git add .`)
- [ ] Commit: `feat([feature]): [descrição imperativa em português]`
- [ ] Rascunho de PR gerado com:
  - Resumo do que foi implementado
  - Dependências de backend (ready vs missing)
  - Resultado da validação executada
  - Riscos conhecidos

**Critério de conclusão**: commit criado, rascunho de PR pronto para abrir

---

## Sugestões para o Backend

(contratos de API que o frontend precisa — para compartilhar com o time de backend)

### [MÉTODO] [/api/path]

**Payload de request:**
```json
{
  "campo": "tipo"
}
```

**Payload de response esperado:**
```json
{
  "campo": "tipo"
}
```

**Observações:**
- [regra ou comportamento esperado]

---

## Riscos

- [Risco 1]: [descrição e mitigação]
- [Risco 2]: [descrição e mitigação]
