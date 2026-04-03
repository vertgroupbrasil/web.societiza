# Regras de Componentes

## `components/ui/`

Permitido:

- layout
- texto
- primitives
- composição visual
- estado visual local
- `useState`, `useEffect`, `useMemo` para comportamento visual local

Proibido:

- `useQuery`
- `useMutation`
- service calls
- action handlers de domínio
- validação de negócio
- toast de regra de negócio
- fetch para carregar componente

## `components/`

- Pode consumir hooks da feature.
- Pode coordenar query, mutation, form, context e UI.
- É a camada correta para ligar hooks a componentes de UI.

## `components/forms/`

- Pode consumir hooks, preferencialmente `hooks/forms`.
- Foca em composição de formulário da feature.
- Não deve virar lugar de tokens visuais ou primitives compartilhadas.

## Regra de separação

Se o componente visual precisa:

- salvar
- atualizar
- remover
- publicar
- arquivar
- reordenar
- validar regra de domínio

então:

- criar hook dedicado
- consumir o hook em componente fora de `components/ui`
- deixar `components/ui` receber props e callbacks
