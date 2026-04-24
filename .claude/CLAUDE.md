# web.societiza — Frontend Societiza

Stack: Next.js 15 · React 19 · TypeScript strict · TanStack Query v5 · Zod · React Hook Form · shadcn/ui · Tailwind · Sonner

---

## Agente principal

Este repositório tem um único agente orquestrador:

| Agente | Gatilho | Função |
|--------|---------|--------|
| `frontend-engineer` | `/frontend-engineer` | Orquestra todo o ciclo de uma feature: leitura de spec, planejamento, implementação, quality gate e commit |

---

## Modos de implementação

O agente opera em dois modos, detectados automaticamente no `/read-spec`:

| Modo | Quando | Estratégia |
|------|--------|-----------|
| **FULL** | Spec aprovada + `logic.md` ou `docs/integration/` disponíveis | Implementação completa na ordem canônica (Tasks 1-12) |
| **VISUAL-FIRST** | Spec aprovada + sem backend documentado | Visual primeiro: UI navegável com mock data, contratos propostos pelo frontend — nunca bloqueia |

**O agente nunca bloqueia por falta de backend.** Quando o backend não existe, entra em modo VISUAL-FIRST e arquiteta o visual imediatamente.

---

## Comandos disponíveis

| Comando | Uso |
|---------|-----|
| `/read-spec [nome]` | Busca a spec no repositório `product.societiza` via MCP GitHub tool. Valida `status: approved`, lê `spec.md` + `logic.md`, detecta modo (FULL ou VISUAL-FIRST) |

---

## Skills carregadas pelo agente

| Skill | Localização | Quando é carregada |
|-------|-------------|-------------------|
| `frontend-architecture` | `skills/frontend-architecture/` | Phase 3 — antes de qualquer implementação de código |
| `spec-engineer` | `skills/spec-engineer/` | Phase 2 — transforma spec em plano de implementação estruturado |
| `visual-architect` | `skills/visual-architect/` | Phase 0.5 — ativada automaticamente em MODO: VISUAL-FIRST |

---

## Regras ativas (não negociáveis)

### Backend boundary
O frontend engineer **nunca toca** em código do backend (`api.societiza` ou qualquer outro repo backend). Se um contrato de API estiver errado ou ausente, a ação correta é:
- Modo FULL: criar mock com MSW + `BACKEND_NEEDED.md`
- Modo VISUAL-FIRST: propor contrato em `docs/integration/[feature].md` + criar mock com MSW

Nunca reescrever regra de negócio no frontend.

### Camada imutável
Componentes em `components/ui/` são **imutáveis na integração** — desenhados para receber props processadas e nunca precisar de mudança quando o backend chegar. Apenas schemas e services são ajustados na integração.

### Git flow
- Sempre criar branch a partir de `develop`
- Nomenclatura obrigatória: `feat/*`, `fix/*`, `chore/*`, `refactor/*`, `docs/*`
- **Nunca commitar diretamente em `main`, `master` ou `develop`**

### Quality gate
- `npm run build` **deve passar** antes de qualquer commit
- Build-gate executado após grupo de dados (Tasks 2-5) E após grupo visual (Tasks 7-9)
- `npm run lint` deve passar (warnings tolerados com justificativa explícita)
- `npx tsc --noEmit` deve passar após cada task de implementação

### Tipos
- `z.infer<typeof schema>` é a **única** fonte de tipos — nunca declarar interfaces manuais duplicando contrato de schema

### Mutations
- Toda mutation **sempre** invalida queries relevantes no `onSuccess`
- Toda mutation **sempre** exibe toast de sucesso **e** toast de erro — nunca só um dos dois
- Toast usa `sonner`, posicionado no topo-direito

### Specs
- Nunca implementar spec com `status: draft` — apenas `status: approved`
- O `/read-spec` usa MCP GitHub tool (`mcp__github__get_file_contents`) — não usa `gh` CLI
- Specs ficam em `product.societiza/specs/{feature}/spec.md` + `logic.md`
