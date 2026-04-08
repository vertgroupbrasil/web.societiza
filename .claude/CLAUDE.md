# web.societiza — Frontend Societiza

Stack: Next.js · React 19 · TypeScript · TanStack Query · Zod · React Hook Form · shadcn/ui

---

## Como trabalhar com Claude Code neste repo

| Tarefa                                          | Use                                             |
| ----------------------------------------------- | ----------------------------------------------- |
| Entender o projeto, domínio e stack             | `/operating-system`                             |
| Planejar implementação de uma feature           | `/feature-plan [nome]`                          |
| Verificar regras de código antes de implementar | skills/code-rules (carregado pelo feature-plan) |

---

## Skills disponíveis

- `.claude/skills/operating-system/` — contexto do projeto, skill routing, playbooks
- `.claude/skills/feature-plan/` — planejamento de implementação com boundary rules
- `.claude/skills/code-rules/` — 15 regras canônicas de código (carregadas pelo feature-plan)

---

## Regras ativas

- **Backend boundary** — backend bloqueado por padrão em sessões de frontend
- **Types from schema** — `z.infer<typeof schema>` é a única fonte de tipos
- **Mutations sempre invalidam queries e sempre exibem toast de sucesso e erro**
- **`npm run build` deve passar antes de qualquer merge**
