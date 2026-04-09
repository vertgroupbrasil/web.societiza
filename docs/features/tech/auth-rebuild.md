# Auth — Reconstrução completa da feature

## O que mudou

A feature `auth` foi reconstruída do zero. O sistema anterior foi criado para
um backend Django e ficou desatualizado após a migração do backend para ASP.NET
Core. Além disso, havia bugs críticos que impediam logout e proteção de rotas
de funcionar corretamente.

## Por que mudou

O backend de autenticação foi reescrito no módulo Identity com ASP.NET Core,
novos endpoints REST, JWT com HttpOnly cookies para refresh token, e suporte
a forgot/reset password via email. O frontend precisava ser alinhado a este
contrato e ter os bugs críticos corrigidos.

## Bugs corrigidos

| Arquivo | Bug | Correção |
|---|---|---|
| `auth.service.ts` | `logout()` chamava endpoint de login | Corrigido para `auth.logout` |
| `logout-button.tsx` | `await logout` sem `.mutateAsync()` — nunca executava | Corrigido |
| `middleware.ts` | Lia `accessToken` de header errado | Lê `cookies.get('access_token')` |
| `middleware.ts` | Redirecionava para URL de API, não `/login` | Corrigido para `new URL('/login', request.url)` |
| `routes.conf.ts` | `'/dashboard/*'` com `startsWith` nunca batia | Corrigido para `'/dashboard'` |
| `useAuthMutations.ts` | Query keys eram URLs de endpoint | Substituído por `authQueryKeys` semântico |
| `axios.ts` | Refresh hardcoded em string | Usa `API_ENDPOINTS.auth.refresh` |

## Migração de endpoints

| Anterior (Django) | Novo (ASP.NET) |
|---|---|
| `POST /accounts/token/` | `POST /api/v1/identity/auth/login` |
| `POST /accounts/token/logout/` | `POST /api/v1/identity/auth/logout` |
| `POST /accounts/token/refresh/` | `POST /api/v1/identity/auth/refresh` |
| — | `POST /api/v1/identity/auth/forgot-password` |
| — | `POST /api/v1/identity/auth/reset-password` |
| `GET /accounts/get-user/` | Mantido (gap — ver README) |

## Impacto arquitetural

Arquivos criados:
- `src/lib/auth-token.ts` — utilitário de cookie para access token
- `src/features/auth/schemas/` — 3 novos schemas (forgot-password, reset-password, current-user)
- `src/features/auth/server/services/` — 3 novos services
- `src/features/auth/hooks/queries/query-options.ts` e `use-auth-queries.ts`
- `src/features/auth/hooks/mutations/` — 4 mutations separadas (uma por operação)
- `src/features/auth/hooks/forms/` — 3 form hooks separados
- `src/features/auth/components/forms/` — 2 novos forms (forgot-password, reset-password)
- `src/app/(routes)/auth/forgot-password/page.tsx`
- `src/app/(routes)/auth/reset-password/page.tsx`
- `src/features/auth/index.ts` — barrel público

Arquivos reescritos:
- `src/lib/axios.ts` — interceptors de Authorization + refresh automático
- `src/middleware.ts` — leitura correta de cookie + redirect correto
- `src/routes/endpoints.ts` — novos endpoints de auth
- `src/routes/routes.conf.ts` — correção do pattern de protected routes
- `src/features/auth/schemas/auth.schema.ts`
- `src/features/auth/server/services/auth.service.ts`
- `src/features/auth/components/forms/login-form.tsx`
- `src/features/auth/components/ui/logout-button.tsx`

Arquivos removidos (substituídos):
- `src/features/auth/hooks/forms/useAuthForm.ts` → `use-login-form.ts`
- `src/features/auth/hooks/mutations/useAuthMutations.ts` → mutations individuais

## Pontos de atenção

- `useCurrentUser` usa endpoint legado Django. Quando o backend criar endpoint
  equivalente no módulo Identity, atualizar `current-user.service.ts` e o schema.
- O cookie `access_token` expira em 15 minutos (alinhado com JWT). O refresh
  automático mantém a sessão ativa sem interrupção para o usuário.
- `queryClient.clear()` no logout garante que dados de sessão não persistam.

## Validação executada

A ser executada pelo usuário:

```bash
npm run build
npm run lint
npm run test
npx playwright test
```
