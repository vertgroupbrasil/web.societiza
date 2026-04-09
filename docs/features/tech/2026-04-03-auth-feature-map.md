# Feature Map - Auth

## Objetivo

A feature `auth` sustenta autenticação de sessão, login de usuário e logout na
camada frontend.

## Superfície funcional

Arquivos principais:

- [login-form.tsx](/Users/henilveira/Documents/societiza/web.societiza/src/features/auth/components/forms/login-form.tsx)
- [logout-button.tsx](/Users/henilveira/Documents/societiza/web.societiza/src/features/auth/components/ui/logout-button.tsx)

## Microserviços internos da feature

### 1. Microserviço de contrato

Arquivo:

- [auth.schema.ts](/Users/henilveira/Documents/societiza/web.societiza/src/features/auth/schemas/auth.schema.ts)

Responsabilidade:

- definir o payload de autenticação;
- servir de fonte de verdade para formulário e service.

### 2. Microserviço de integração HTTP

Arquivo:

- [auth.service.ts](/Users/henilveira/Documents/societiza/web.societiza/src/features/auth/server/services/auth.service.ts)

Responsabilidade:

- encapsular `login`, `logout` e `refresh`;
- chamar os endpoints de autenticação do backend;
- devolver os payloads crus da autenticação.

Dependências externas:

- `API_ENDPOINTS.auth`
- `fetcher`

Observação importante:

- a implementação atual de `logout()` faz `POST` em `api.auth.login`, o que
  parece uma inconsistência ou resquício legado. A documentação registra isso
  como comportamento observado, não como comportamento desejado.

### 3. Microserviço de formulário

Arquivo:

- [useAuthForm.ts](/Users/henilveira/Documents/societiza/web.societiza/src/features/auth/hooks/forms/useAuthForm.ts)

Responsabilidade:

- conectar schema, `react-hook-form` e a superfície de login;
- normalizar validação local antes da mutation.

### 4. Microserviço de mutation de sessão

Arquivo:

- [useAuthMutations.ts](/Users/henilveira/Documents/societiza/web.societiza/src/features/auth/hooks/mutations/useAuthMutations.ts)

Responsabilidade:

- expor mutations de `login`, `logout` e `refresh`;
- invalidar query keys associadas aos endpoints de auth.

Observação:

- essa feature ainda usa uma estratégia simples de `invalidateQueries`;
- não há camada adicional de sessão em contexto local dentro da feature.

## Fluxo de dados

1. `login-form.tsx` usa `useAuthForm`.
2. O hook valida o payload pelo schema.
3. A submissão chama `useAuthMutations().login`.
4. A mutation chama o `auth.service`.
5. O backend emite token ou falha.
6. O frontend invalida queries relacionadas à autenticação.

## Acoplamentos

- depende do catálogo global de endpoints;
- depende do `fetcher` global;
- depende de TanStack Query para mutations;
- depende do fluxo global de autenticação do app, que está fora desta feature.

## Limitações e riscos

- `logout()` no service parece apontar para endpoint incorreto;
- não existe um módulo explícito de `session query` ou `current user` dentro da
  feature;
- a coesão é boa para login, mas a feature ainda é pequena e não cobre o ciclo
  completo de autorização.
