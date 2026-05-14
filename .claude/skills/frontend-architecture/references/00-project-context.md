# Project Context — Societiza

Societiza is a B2B SaaS for Brazilian accounting firms that manage corporate
processes through workflows and kanban-like stages.

---

## Core concepts

- `Accountancy`: the accounting firm using the platform
- `Process`: a corporate process for a client company
- `Workflow template`: reusable process structure
- `Step` or `Stage`: a kanban column
- `Task`: a checklist or form inside a step
- `Field`: an input inside a step or task

---

## Frontend stack

The frontend stack is centered on:

- Next.js 15 App Router
- React 19
- TypeScript strict mode
- TanStack Query v5
- Zod
- react-hook-form
- shadcn/ui
- Tailwind
- Sonner (toasts)

The current project is frontend-first in day-to-day work. Backend exists, but
must only be touched when the user explicitly asks for backend.

---

## Personas — Usuários principais da plataforma

### Contador (Accountancy user)

O contador é o usuário primário da plataforma. Ele é funcionário ou sócio de um escritório de contabilidade que usa o Societiza para gerenciar os processos dos seus clientes.

**O que o contador faz na plataforma:**
- Configura templates de workflow (estrutura de etapas, tarefas e campos)
- Acompanha o board de processos em andamento
- Gerencia múltiplos clientes (empresários) simultaneamente
- Atualiza o status de etapas e tarefas dos processos
- Usa filtros para priorizar trabalho urgente no board

**Características relevantes para o frontend:**
- Usuário power — conhece o fluxo bem, valoriza eficiência
- Trabalha no desktop como plataforma principal
- Lida com múltiplos processos ao mesmo tempo
- Precisa de feedback claro de sucesso/erro nas ações (mutations)
- Não tolera inconsistências de dados no board (cache invalidation importa muito)

**Features que pertencem ao contador:**
- Dashboard e board operacional (`workflow`)
- Template builder (`workflow-template`)
- Gestão de contabilidade (`accountancy`)
- Configuração de etapas, tarefas e campos

---

### Empresário (Client user)

O empresário é o cliente do escritório de contabilidade. Ele acessa a plataforma para acompanhar o andamento do processo da sua empresa (tipicamente abertura de empresa, regularização, ou outros processos societários).

**O que o empresário faz na plataforma:**
- Acompanha o progresso do processo da sua empresa
- Recebe notificações sobre atualizações
- Envia documentos ou informações quando solicitado
- Visualiza o status atual da abertura ou processo em andamento

**Características relevantes para o frontend:**
- Usuário ocasional — não usa a plataforma diariamente
- Pode acessar via mobile ou desktop
- Não conhece os detalhes do fluxo interno — precisa de linguagem simples
- Expectativa de UX mais próxima de produto B2C (simplicidade, clareza)
- Não vê o board interno do contador — tem sua própria visão de acompanhamento

**Features que pertencem ao empresário (portal do cliente):**
- Visão do andamento do processo
- Upload de documentos
- Comunicação com o escritório
- Notificações de atualização

---

## Relação entre os domínios

```
Contador configura → WorkflowTemplate (estrutura)
Contador opera    → Workflow + Board (operação)
Empresário acessa → Portal do Cliente (acompanhamento)
```

As features de template e board são separadas intencionalmente — configuração
não é operação, e o frontend não deve colapsar esses mundos.

O portal do cliente é uma superfície separada com UX própria — não é apenas
um "modo read-only" do board do contador.
