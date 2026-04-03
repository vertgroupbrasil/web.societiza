# Regras de Import e Barrel

- Todo import interno do projeto deve sair de um `index.ts` público quando esse
  barrel existir.
- Se uma pasta faz parte da API pública da feature, ela deve ter `index.ts`.
- `components`, `hooks`, `constants`, `schemas`, `lib` e `server` devem expor
  superfície pública por barrel quando consumidos por outros arquivos.
- Não fazer deep import se já existir `index.ts` expondo o módulo.
- Exceção somente quando:
  - ainda não existe barrel na pasta;
  - ou o barrel criaria ciclo concreto que precisa ser resolvido primeiro.

## Regra prática

Ordem de preferência:

1. `@societiza/features/{feature}`
2. `../index` ou `../../index` por API pública da feature/subpasta
3. arquivo direto apenas se não existir barrel ainda

## Consequência operacional

- Se uma subpasta começar a ser reutilizada e ainda não tiver `index.ts`, criar
  esse barrel antes de propagar imports profundos.
- Não usar barrel como desculpa para expor detalhes privados da feature; só
  exportar a superfície que realmente deve ser consumida.
