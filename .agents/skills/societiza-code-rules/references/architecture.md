# Arquitetura Base

O frontend do projeto é orientado a features.

Estrutura principal:

- `src/app/` para rotas
- `src/features/` para features de domínio
- `src/components/` para componentes compartilhados
- `src/routes/endpoints.ts` para endpoints centralizados
- `src/lib/`, `src/hooks/`, `src/types/` para suporte compartilhado global

Regras:

- Sempre localizar a feature dona do problema antes de criar arquivos novos.
- Sempre estender a feature existente antes de criar uma feature paralela.
- A API pública de uma feature deve sair do `index.ts` da própria feature e dos
  `index.ts` internos das subpastas que forem consumidas.
- O fluxo padrão de abstração é:
  - endpoints
  - schemas
  - server/services
  - hooks
  - components
  - components/ui
- Helpers internos da feature devem preferir `lib/`.
- Usar `utils/` apenas quando a feature já estiver organizada assim ou quando o
  bucket for realmente misc e não pertencer claramente a outra camada.
