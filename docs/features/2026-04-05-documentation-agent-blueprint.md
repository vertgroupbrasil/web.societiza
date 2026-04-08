# Padrao de Documentacao e Blueprint de Agent

## Contexto de entrada

Identificar o padrao das documentacoes do projeto em docs/features para definir
um padrao geral que permita estruturar um agent responsavel por manter a
qualidade e consistencia das documentacoes conforme o contexto de projeto.

## 1) Padrao identificado em docs/features

### Secoes recorrentes e frequencia

- Frequencia alta:
  - Objetivo
  - Superficie funcional
  - Microservicos internos da feature
  - Fluxo de dados
  - Acoplamentos
  - Limitacoes e riscos
- Frequencia media:
  - Pontos fortes
  - Dependencias (em algumas features aparece dentro de acoplamentos)
  - Leitura arquitetural (features mais enxutas)
- Frequencia baixa:
  - Validacao explicita
  - Leitura recomendada
  - Subresponsabilidades detalhadas por microservico

### Granularidade esperada por secao

- Objetivo:
  - 1 a 3 paragrafos, descrevendo dominio e papel da feature no produto.
- Superficie funcional:
  - lista de arquivos/componentes principais e papel funcional de cada bloco.
- Microservicos internos:
  - estrutura numerada por dominio tecnico (schema, service, query, mutation,
    contexto, utilitarios), com arquivos e responsabilidades.
- Fluxo de dados:
  - sequencia em passos numerados, do gatilho de UI ate cache/estado final.
- Acoplamentos:
  - dependencias internas e externas (endpoints, fetcher, query policy,
    contexts, libs, APIs externas).
- Pontos fortes:
  - ganhos arquiteturais observaveis e nao opinativos.
- Limitacoes e riscos:
  - dividas tecnicas, inconsistencias de contrato, riscos de manutencao.
- Validacao:
  - o que foi validado (ou por que nao se aplica), com escopo claro.

### Variacoes permitidas

- Feature minima:
  - pode ter menos secoes de microservicos e foco em shell visual,
    desde que explicite ausencias importantes (ex.: sem hooks, sem schemas).
- Feature complexa:
  - detalhamento completo por subdominio com subresponsabilidades e
    observacoes de transicao/legado.
- Documento de governanca:
  - pode priorizar contexto, decisoes, impacto, limites e validacao,
    em vez de fluxo de dados de uma feature unica.

## 2) Template canonico de documentacao

```markdown
# Feature Map - <Nome da Feature>

## Objetivo

Descreva o papel da feature no produto, seu dominio e os principais casos de
uso cobertos.

## Superficie funcional

Arquivos/componentes principais:

- [arquivo-ou-componente-1](caminho/real)
- [arquivo-ou-componente-2](caminho/real)
- [arquivo-ou-componente-3](caminho/real)

Papel da superficie:

- componente A: responsabilidade principal
- componente B: responsabilidade principal

## Microservicos internos da feature

### 1. Microservico de contrato e schemas

Arquivos:

- [schema-1](caminho/real)
- [schema-2](caminho/real)

Responsabilidade:

- contrato de dados
- inferencia de tipos

### 2. Microservico de integracao HTTP

Arquivos:

- [service](caminho/real)

Responsabilidade:

- operacoes de API
- isolamento de endpoints/fetcher

Dependencias externas:

- endpoint group X
- cliente HTTP Y

### 3. Microservico de leitura e cache

Arquivos:

- [query-options](caminho/real)
- [queries hook](caminho/real)

Responsabilidade:

- query keys
- leitura e materializacao de estado

### 4. Microservico de mutacao

Arquivos:

- [mutations hook](caminho/real)

Responsabilidade:

- operacoes de escrita
- refresh/invalidation/optimistic updates

### 5. Microservico de contexto e orquestracao (quando aplicavel)

Arquivos:

- [provider/contextos](caminho/real)

Responsabilidade:

- composicao de estado da feature
- regras de coordenacao de UI

## Fluxo de dados

1. Evento inicial na UI.
2. Hook de leitura ou mutacao acionado.
3. Service chama backend/API externa.
4. Resposta e normalizada.
5. Cache/estado da feature e atualizado.
6. UI reflete o novo estado.

## Acoplamentos

- dependencias globais do app
- dependencias externas da feature
- acoplamentos legados/transicionais

## Pontos fortes

- ganhos de modularidade
- pontos de consistencia tecnica

## Limitacoes e riscos

- riscos de contrato/API
- riscos de acoplamento
- dividas tecnicas relevantes

## Validacao

- verificacoes realizadas
- limitacoes de validacao (se houver)

## Observacoes

- Fato observado: <descrever evidencia encontrada no codigo>
- Recomendacao: <descrever melhoria proposta>
- Hipotese: <registrar incerteza quando nao houver evidencia suficiente>
```

Regras de aplicacao:

- linguagem tecnica objetiva;
- citar arquivos reais sempre que houver evidencia;
- separar fato observado de recomendacao;
- evitar conclusoes sem suporte no codigo.

## 3) Blueprint do agent de documentacao

### Missao do agent

Documentar e manter mapas de features com consistencia editorial e arquitetural,
baseado em evidencia real da codebase.

### Escopo

- Cobre:
  - mapeamento de feature por responsabilidade tecnica;
  - descricao de fluxo de dados e acoplamentos;
  - consolidacao de riscos e limitacoes;
  - atualizacao de indice de documentacao quando necessario.
- Nao cobre:
  - alteracao de comportamento da aplicacao;
  - refatoracao de codigo sem pedido explicito;
  - inferencias sobre backend sem evidencias no frontend.

### Entradas obrigatorias

- contexto da feature ou dominio a documentar;
- pasta alvo (normalmente src/features/<feature>);
- documentos de referencia:
  - docs/features/\*
  - docs/features/2026-04-03-societiza-code-rules.md
  - docs/features/2026-04-03-societiza-operating-system.md

### Pipeline de trabalho

1. Levantar artefatos da feature (componentes, schemas, services, hooks,
   contexts, utils).
2. Extrair responsabilidades por camada.
3. Mapear fluxo de dados principal.
4. Identificar acoplamentos globais e externos.
5. Registrar pontos fortes, limitacoes e riscos com evidencia.
6. Gerar documento no template canonico.
7. Atualizar indice de docs/features, quando aplicavel.
8. Revisar linguagem e consistencia antes de publicar.

### Criterios de qualidade

- cobertura completa das secoes obrigatorias;
- coerencia com arquitetura feature-based;
- rastreabilidade entre afirmacao e arquivo de evidencia;
- separacao explicita entre fato, recomendacao e hipotese;
- texto tecnico claro, sem opiniao vaga.

### Estrutura de saida padrao

- Secao 1: padrao identificado.
- Secao 2: template canonico.
- Secao 3: blueprint do agent.
- Secao 4: prompt-base reutilizavel.
- Secao 5: ambiguidades e perguntas de alinhamento.

### Checklist de revisao antes de publicar

- todas as secoes obrigatorias estao presentes;
- arquivos citados existem;
- nao ha inferencia sem evidencia;
- riscos e limitacoes estao claros;
- documento foi adicionado ao indice quando pertinente.

## 4) Prompt base para esse agent

```markdown
Mapeie a documentacao da feature <nome-da-feature> seguindo o padrao de
docs/features.

Entrada:

- contexto: <mudanca/objetivo>
- alvo: src/features/<nome-da-feature>
- referencias obrigatorias:
  - docs/features/2026-04-03-features-map-index.md
  - docs/features/2026-04-03-societiza-code-rules.md
  - docs/features/2026-04-03-societiza-operating-system.md

Tarefa:

1. Levantar arquivos reais da feature por camada tecnica.
2. Estruturar o mapa com: Objetivo, Superficie funcional,
   Microservicos internos, Fluxo de dados, Acoplamentos,
   Pontos fortes, Limitacoes e riscos, Validacao.
3. Diferenciar fato observado, recomendacao e hipotese.
4. Gerar o arquivo em docs/features com nome datado.
5. Atualizar o indice de docs/features.

Restricoes:

- nao inventar arquivos;
- nao inferir sem evidencia;
- manter consistencia com arquitetura feature-based.
```

## 5) Ambiguidades e perguntas de alinhamento

1. O padrao de links deve migrar para relativo em todos os docs existentes, ou
   manter compatibilidade com links absolutos legados?
2. A secao Validacao deve ser obrigatoria em 100% dos documentos, inclusive
   quando a mudanca for apenas documental?
3. O nivel minimo de evidencia por secao deve ser formalizado (ex.: ao menos
   2 arquivos por microservico)?
4. O agent deve sempre atualizar o indice central automaticamente, ou somente
   quando for criado um novo tipo de documento?
5. Em documentos de governanca (nao feature), devemos manter o mesmo template
   ou usar um template proprio?
6. Hipoteses sem confirmacao devem bloquear publicacao ou podem ser publicadas
   desde que marcadas explicitamente?
7. O documento final deve conter uma secao fixa de recomendacoes priorizadas
   (curto, medio, longo prazo) ou isso deve ficar opcional?
