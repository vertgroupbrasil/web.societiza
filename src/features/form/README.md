# Feature Form

## O que esta pasta representa

A pasta `form` concentra um fluxo frontend de preenchimento de dados ligado a
abertura de empresa, com etapas como empresa, socios, revisao, persistencia
local e consulta de CEP.

Mas este ponto e importante:

esta pasta nao deve ser interpretada sozinha como a prova de que o produto ja
possui uma feature oficial, consolidada e estabilizada de formulario nativo de
abertura de empresa no MVP.

Do ponto de vista da regra de negocio atual do produto, a forma oficial e
consolidada de capturar informacoes configuraveis ainda esta fortemente ligada
aos campos de etapas e tarefas do `workflow-template`.

## Papel atual no produto

Hoje esta feature deve ser lida como uma implementacao frontend existente, com
valor de exploracao e de fluxo, mas ainda nao como a definicao final da feature
de formulario de abertura que a Societiza pode vir a ter como produto central
no futuro.

Isso significa que qualquer trabalho nessa pasta precisa distinguir claramente:

- o que ja existe no codigo;
- o que e experimento ou legado;
- o que e direcao futura de produto;
- e o que faz parte do MVP consolidado.

## Estrutura geral

- `components/`: renderizacao do fluxo e telas de formulario
- `hooks/queries/`: leituras e query options
- `hooks/mutations/`: mutacoes da feature
- `hooks/forms/`: logica ligada as etapas do formulario
- `hooks/utils/`: persistencia local, navegacao, autosave e CEP
- `contexts/`: orquestracao global do estado do fluxo
- `services/`: chamadas de API e integracao com ViaCEP
- `lib/schemas/`: schemas e contratos locais
- `lib/types/`: tipos inferidos e auxiliares
- `constants/`: constantes da feature

## Alertas arquiteturais

- A feature ainda carrega sinais de acoplamento legado em `API_ENDPOINTS.corporate`.
- Parte da semantica dela pode sugerir uma feature de produto mais madura do
  que a regra de negocio atual realmente sustenta.
- Qualquer evolucao aqui deve ser alinhada com o papel futuro do formulario
  dentro do workflow, e nao tratada como modulo isolado e independente por
  default.
