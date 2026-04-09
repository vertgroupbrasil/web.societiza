# Feature Map - Dashboard

## Objetivo

A feature `dashboard` é atualmente uma feature mínima. Ela funciona mais como
shell estrutural de navegação do que como domínio próprio de negócio.

## Superfície funcional

Arquivo principal:

- [sidebar.tsx](/Users/henilveira/Documents/societiza/web.societiza/src/features/dashboard/components/sidebar.tsx)

## Microserviços internos da feature

### 1. Microserviço de shell visual

Arquivo:

- [sidebar.tsx](/Users/henilveira/Documents/societiza/web.societiza/src/features/dashboard/components/sidebar.tsx)

Responsabilidade:

- encapsular o layout lateral do dashboard;
- montar `SidebarProvider`, `AppSidebar`, `SidebarInset` e `SidebarTrigger`;
- definir a largura visual da sidebar.

## Dependências

- componentes compartilhados shadcn customizados em `src/components/ui/shadcnui`
- `AppSidebar`, que vive fora da feature

## Leitura arquitetural

Esta feature não possui:

- service layer próprio
- query hooks
- mutation hooks
- schemas
- contexts

Na prática, `dashboard` hoje é apenas um invólucro visual para o layout do
painel.

## Limitações e riscos

- o nome da feature sugere domínio de dashboard, mas a implementação atual é
  apenas um componente de shell;
- se métricas, cards ou painéis de negócio forem adicionados no futuro, a
  feature precisará evoluir para uma estrutura mais completa.
