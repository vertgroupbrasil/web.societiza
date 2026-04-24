---
name: frontend-architecture
description: Master architecture and code rules skill for Societiza frontend. Load this skill before implementing any feature. Contains 18 reference files (00-17) covering all mandatory code rules. Every rule is non-negotiable.
---

# Frontend Architecture — Regras Canônicas de Código

Esta é a skill mestra de arquitetura e código do frontend Societiza.

**Ação obrigatória ao carregar esta skill:**

Ler TODOS os arquivos de referência em `skills/frontend-architecture/references/` em ordem numérica, de `00-project-context.md` até `17-backend-boundary.md`.

Não pular nenhum arquivo. Não resumir. Ler na íntegra.

---

## Arquivos a carregar (ordem obrigatória)

```
00-project-context.md
01-architecture.md
02-creating-a-feature.md
03-typescript-and-schemas.md
04-queries.md
05-mutations.md
06-forms.md
07-components.md
08-naming-conventions.md
09-testing.md
10-imports-and-barrels.md
11-build-and-quality.md
12-git-and-commits.md
13-documentation.md
14-folder-contracts.md
15-workflow-domain.md
16-ux-principles.md
17-backend-boundary.md
```

---

## Princípios de aplicação

### Toda regra é mandatória

As regras contidas nesses arquivos não são sugestões, não são guidelines opcionais, e não são best practices situacionais.

São regras. Obrigatórias. Não negociáveis.

### Em caso de conflito entre abordagens

Quando houver dúvida entre duas abordagens válidas, escolher a **mais restritiva**.

Exemplos:
- Dúvida entre usar `unknown` ou um tipo genérico: usar `unknown` e narrowing com Zod
- Dúvida entre colocar lógica no componente ou no hook: colocar no hook
- Dúvida entre barrel ou deep import: barrel
- Dúvida entre `any` ou modelagem correta: modelagem correta

### Violação detectada → parar e corrigir

Se durante a implementação uma regra for violada:

1. **Parar** a execução da task atual
2. **Identificar** qual regra foi violada (citar o arquivo e seção)
3. **Corrigir** a violação
4. **Continuar** somente após a correção
5. Nunca avançar com violação conhecida em aberto

---

## Resumo das regras mais críticas (referência rápida)

As regras completas estão nos arquivos de referência. Este resumo é apenas para orientação rápida — não substitui a leitura dos arquivos.

| Área | Regra mais crítica |
|------|--------------------|
| Tipos | `z.infer<typeof schema>` é a única fonte — nunca interface manual duplicando schema |
| Queries | `query-options.ts` é obrigatório — nunca recriar key ou fn fora dele |
| Mutations | Toda mutation invalida queries + toast sucesso + toast erro |
| Componentes | `components/ui/` nunca usa `useQuery`, `useMutation` ou service |
| Imports | Barrel é entrega, não dívida — toda subpasta sai com `index.ts` |
| Build | `npm run build` deve passar antes de qualquer commit |
| Git | Nunca commitar em `main`, `master` ou `develop` |
| Backend | Frontend nunca toca em código de backend — nunca |
| UX | Todo estado async tem loading + error + empty tratados |
| Forms | Schema de request guia o form, nunca o schema de response |
