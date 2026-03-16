Feature Societário
Esta feature implementa um sistema completo de gestão de processos societários em formato kanban, seguindo a arquitetura clean code baseada em features.

Estrutura de Arquivos
text
features/societario/
├── components/ # Componentes React
│ ├── ui/ # Componentes de interface específicos
│ │ ├── ProcessProgressBar.tsx
│ │ ├── SearchBar.tsx
│ │ ├── FiltersDialog.tsx
│ │ └── TaskChecklist.tsx
│ ├── KanbanBoard.tsx # Componente principal
│ ├── KanbanColumn.tsx # Coluna do kanban
│ ├── ProcessCard.tsx # Card do processo
│ └── ProcessDrawer.tsx # Drawer de detalhes
├── hooks/ # Hooks customizados
│ ├── queries/ # Hooks de consulta
│ │ ├── queryOptions.ts # Factory de query options
│ │ └── useSocietarioQueries.ts
│ ├── mutations/ # Hooks de mutação
│ │ └── useSocietarioMutations.ts
│ └── utils/ # Hooks utilitários
│ ├── useSocietarioFilters.ts
│ └── useTaskSequentialLogic.ts
├── server/ # Camada de servidor
│ ├── services/ # Chamadas para API
│ │ └── societario.service.ts
│ ├── types/ # Tipos TypeScript
│ │ └── societario.types.ts
│ └── validators/ # Validação de dados
│ └── societario.validators.ts
├── schemas/ # Schemas Zod
│ └── societario.schema.ts
├── constants/ # Constantes
│ └── societario.constants.ts
├── contexts/ # Contextos React
│ └── societario.context.tsx
└── index.ts # Ponto único de exportação
Principais Funcionalidades
Kanban Board: Visualização em colunas por etapa do processo

Filtros Avançados: Sistema completo de filtragem com TanStack Table

Pesquisa Global: Busca em tempo real por nome de empresa

Tarefas Sequenciais: Lógica de marcação sequencial de tarefas

Drawer Responsivo: Interface adaptativa para detalhes do processo

Progress Tracking: Barras de progresso coloridas por urgência

Stage Navigation: Avanço e retorno entre etapas

Como Usar
tsx
import {
KanbanBoard,
SocietarioProvider
} from '@societiza/features/societario';

function SocietarioPage() {
return (
<SocietarioProvider>
<KanbanBoard />
</SocietarioProvider>
);
}
Tecnologias Utilizadas
React 18+ com TypeScript

TanStack Table v8 para filtragem

TanStack Query v5 para cache e mutações

Shadcn UI para componentes

Zod para validação

Tailwind CSS para estilização

Arquitetura
Esta implementação segue os princípios:

Feature-based: Tudo relacionado ao societário fica nesta pasta

Separation of Concerns: Server-side (services, types, validators) separado do client-side (components, hooks, contexts)

Clean Code: Responsabilidades bem definidas e código testável

TypeScript End-to-End: Tipagem completa da API aos componentes
