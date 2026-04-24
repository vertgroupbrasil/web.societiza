# Plano de Implementação Frontend — Nova Área de Configurações

## Referência
- Spec: solicitação visual aprovada pelo usuário no Codex
- Data: 2026-04-24
- Branch: feat/accountancy-offices
- Modo: VISUAL-FIRST

## Resumo
- Criar a área dedicada `/dashboard/configuracoes/*`.
- Reutilizar a infraestrutura de sidebar atual e trocar apenas o conteúdo da sidebar dentro da área de configurações.
- Migrar as telas de escritório, membros e plano para as novas rotas.
- Transformar as seções visuais em cards e remover títulos em caixa alta como `ENDEREÇO`.

## Rotas
- `/dashboard/configuracoes` redireciona para `/dashboard/configuracoes/preferencias`.
- `/dashboard/configuracoes/preferencias` renderiza preferências de aparência.
- `/dashboard/configuracoes/perfil` renderiza dados do usuário atual.
- `/dashboard/configuracoes/escritorio` renderiza configuração do escritório.
- `/dashboard/configuracoes/membros` renderiza membros do escritório.
- `/dashboard/configuracoes/plano` renderiza plano e uso.
- `/dashboard/escritorio/configuracoes`, `/dashboard/escritorio/membros` e `/dashboard/escritorio/plano` redirecionam para as novas rotas.

## Implementação
- `src/features/dashboard/components/sidebar.tsx` detecta `/dashboard/configuracoes` via `usePathname()` e alterna entre `AppSidebar` e `SettingsSidebar`.
- `src/components/ui/shadcnui/settings-sidebar.tsx` contém a navegação de configurações e o botão `Voltar para o app`.
- `src/components/nav-user.tsx` aponta perfil, preferências e escritório para as novas rotas.
- `OfficeSettingsScreen`, `OfficeMembersScreen`, `OfficePlanScreen` e `OfficeIdentityForm` usam cards por seção.
- `OfficeSettingsScreen` chama `form.reset()` quando os dados do escritório carregam.

## Quality Gate
- `npx tsc --noEmit`
- `npm run build`
- Validação visual em `/dashboard/configuracoes/preferencias`, `/perfil`, `/escritorio`, `/membros` e `/plano`.
