# Contrato das Pastas

## `src/routes/endpoints.ts`

- Toda feature nova integrada à API deve registrar seus endpoints aqui.
- Seguir o agrupamento por domínio/feature já usado no projeto.
- Rotas parametrizadas devem ser funções.
- Não espalhar endpoint hardcoded dentro de services.

## `schemas/`

- Um arquivo por objeto relevante da feature.
- Modelar DTOs de entrada e saída.
- O schema é a fonte da verdade do formato de dados.

## `server/types/`

- Inferir types a partir dos schemas sempre que possível.
- Não duplicar modelagem manual quando o schema já resolve.

## `server/services/`

- Fazer apenas request/fetch/axios parsing básico.
- Sem toast.
- Sem query cache.
- Sem state de UI.
- Sem regra de domínio de apresentação.

## `hooks/queries/`

- Toda leitura da service deve passar por hook de query.
- Sempre existir `query-options.ts` quando a feature possui queries.
- Os hooks devem consumir as query options, não recriar key/fn do zero.

## `hooks/mutations/`

- Toda escrita da service deve passar por hook de mutation.
- Nunca chamar request inline em componente.
- Toda mutation deve ter estratégia explícita de refetch/invalidate.
- Preferir UI otimista quando fizer sentido para a UX.
- Erro deve ter tratamento consistente e previsível.

## `hooks/forms/`

- Para lógica de formulário reutilizável ou crescente.
- Se a lógica de formulário sair do trivial, ela sai do componente.

## `hooks/utils/`

- Hooks utilitários sem responsabilidade primária de query ou mutation.

## `hooks/components/`

- Hook de orchestration para componentes da feature.
- Usar quando um componente precisa coordenar mutation, state, regras e efeitos
  sem empurrar isso para `components/ui/`.

## `contexts/`

- Usar apenas para estado compartilhado transversalmente.
- Se houver mais de um contexto da feature, criar subpasta específica.
- Context não substitui hook de query ou mutation.

## `constants/`

- Somente valores imutáveis compartilhados.
- Labels, options, tokens, maps, limites, estados fixos e variações.

## `components/`

- Componentes de composição e orchestration da feature.
- Podem usar hooks, contexts e integrar UI com lógica da feature.

## `components/forms/`

- Componentes de formulário da feature.
- Podem usar hooks, preferencialmente `hooks/forms`.
- Não devem virar bucket de primitives visuais.

## `components/ui/`

- Somente apresentação, estrutura visual e estado visual local.
- Não podem depender de fetch, mutation, service ou regra de domínio para
  “carregar”.

## `README.md`

- Obrigatório para features relevantes.
- Deve refletir o domínio real da feature, não conteúdo copiado de outra pasta.
