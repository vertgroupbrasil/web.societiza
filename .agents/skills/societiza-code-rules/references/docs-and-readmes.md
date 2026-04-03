# Documentação da Feature

Toda feature relevante deve manter dois níveis de documentação.

## `src/features/{feature}/README.md`

Deve explicar:

- domínio da feature
- regra de negócio
- entidades principais
- fluxo de dados
- responsabilidades de cada camada
- integrações externas
- decisões de arquitetura específicas da feature

Regras:

- não copiar README de outra feature
- o conteúdo precisa refletir o domínio real da pasta
- se a feature ainda não tiver README válido, corrigir isso ao mexer nela

## `docs/features/YYYY-MM-DD-{feature}.md`

Obrigatório para:

- mudanças relevantes
- reworks estruturais
- novos comportamentos
- integrações importantes

Deve explicar:

- o que mudou
- por que mudou
- impacto arquitetural
- fluxo afetado
- pontos de atenção
- conflitos ou limitações
- validação executada
