# Skills Map - Claude Code x Features

## Objetivo

Mapear as skills disponiveis em .agents/skills, explicar como cada uma funciona
na pratica e consolidar um padrao geral para cruzar feature + skill no projeto
Societiza.

## Escopo da analise

- Fonte principal: arquivos .agents/skills/\*/SKILL.md
- Foco: missao, gatilhos, tipo de entrega, limites e papel no fluxo
- Resultado final: matriz de recomendacao por feature

## Inventario de skills

Total de skills locais identificadas: 20

1. societiza-operating-system
2. societiza-code-rules
3. brainstorming
4. frontend-design
5. ui-ux-pro-max
6. animate
7. audit
8. webapp-testing
9. next-best-practices
10. shadcn
11. vercel-composition-patterns
12. typescript-advanced-types
13. vercel-react-view-transitions
14. seo-audit
15. programmatic-seo
16. ai-seo
17. copywriting
18. social-content
19. deploy-to-vercel
20. web-design-guidelines

## Como cada skill funciona

### 1) societiza-operating-system

- Missao: skill mestra de orquestracao para tarefas Societiza.
- Quando usar: praticamente qualquer tarefa do projeto.
- Entrega esperada: roteamento para skills especializadas + enforcement de regras.
- Regras centrais: bloqueio de backend por padrao, docs de feature obrigatorias,
  expectativa de validacao com Jest e Playwright.
- Limite: nao substitui skills especializadas; coordena o fluxo.

### 2) societiza-code-rules

- Missao: contrato primario de escrita de codigo frontend.
- Quando usar: escrita, refatoracao, review e organizacao de frontend.
- Entrega esperada: arquitetura feature-based consistente, barrels index.ts,
  camadas service -> hooks -> components, separacao de responsabilidades.
- Limite: escopo frontend do repositorio; nao cobre backend.

### 3) brainstorming

- Missao: desenhar antes de implementar.
- Quando usar: trabalho criativo, novas features, mudancas de comportamento.
- Entrega esperada: proposta de abordagens + design aprovado antes de codigo.
- Regra forte: hard gate para impedir implementacao sem aprovacao de design.

### 4) frontend-design

- Missao: construir UI de alto nivel, com direcao visual intencional.
- Quando usar: criacao de paginas/componentes e demandas de design.
- Entrega esperada: interface funcional e distintiva, evitando padrao generico.
- Regra forte: exige contexto de audiencia, caso de uso e tom de marca.

### 5) ui-ux-pro-max

- Missao: apoiar escolhas de estilo, paleta, tipografia e linguagem visual.
- Quando usar: refinamento de UI/UX e composicao visual.
- Entrega esperada: recomendacao de sistema visual e aplicacao no contexto.
- Limite: funciona como acelerador de decisao de design, nao como substituto de
  arquitetura de codigo.

### 6) animate

- Missao: adicionar motion com proposito (feedback, transicao, orientacao).
- Quando usar: animacoes, micro-interacoes, transicoes de estado.
- Entrega esperada: plano de motion e implementacao com foco em usabilidade.
- Regra forte: respeitar prefers-reduced-motion e performance.

### 7) audit

- Missao: auditoria tecnica em acessibilidade, performance, theming,
  responsividade e anti-patterns.
- Quando usar: review tecnico e checks de qualidade.
- Entrega esperada: relatorio com severidade P0-P3 e plano de acao.
- Limite: aponta problemas, nao e skill de correcao automatica.

### 8) webapp-testing

- Missao: validar comportamento de app web com Playwright.
- Quando usar: testes de fluxo visual, regressao funcional e debug de UI.
- Entrega esperada: scripts de teste, evidencias de execucao e observacoes.
- Limite: foco em comportamento de app rodando, nao em regra arquitetural.

### 9) next-best-practices

- Missao: aplicar convencoes e boas praticas de Next.js App Router.
- Quando usar: codigo Next.js, RSC boundaries, padroes async e metadata.
- Entrega esperada: implementacao aderente as convencoes da plataforma.
- Limite: especializado em Next.js.

### 10) shadcn

- Missao: gerenciar ecossistema shadcn/ui no projeto.
- Quando usar: adicionar, ajustar, compor e corrigir componentes shadcn.
- Entrega esperada: componentes consistentes com stack e padrao do projeto.
- Limite: depende de componentes.json e convencoes do setup atual.

### 11) vercel-composition-patterns

- Missao: escalar arquitetura de componentes React por composicao.
- Quando usar: excesso de props booleanas, APIs de componentes pouco escalaveis,
  necessidade de compound components.
- Entrega esperada: APIs de componente mais reutilizaveis e sustentaveis.

### 12) typescript-advanced-types

- Missao: elevar type-safety com tipos avancados.
- Quando usar: generics, mapped types, conditional types e utilitarios.
- Entrega esperada: contratos de tipos robustos e inferencia mais confiavel.

### 13) vercel-react-view-transitions

- Missao: aplicar transicoes nativas de view em React.
- Quando usar: animar mudancas de rota, shared elements, transicoes de estado.
- Entrega esperada: UX de transicao mais suave sem dependencia pesada externa.
- Limite: depende de suporte de plataforma e estrategia de fallback.

### 14) seo-audit

- Missao: diagnosticar SEO tecnico e on-page.
- Quando usar: queda de ranking, baixa indexacao, problemas de descoberta.
- Entrega esperada: diagnostico priorizado por impacto.

### 15) programmatic-seo

- Missao: desenhar SEO em escala com templates e dados.
- Quando usar: paginas em massa por combinacoes de termo, local, categoria.
- Entrega esperada: estrategia de estrutura de paginas, dados e interlinking.

### 16) ai-seo

- Missao: otimizar conteudo para mecanismos e respostas geradas por IA.
- Quando usar: objetivo de citacao em respostas de LLMs.
- Entrega esperada: recomendacoes de extracao, citabilidade e cobertura.

### 17) copywriting

- Missao: produzir copy de conversao para paginas.
- Quando usar: homepage, landing, pricing, features, reposicionamento de mensagem.
- Entrega esperada: copy clara, orientada a beneficio e acao.

### 18) social-content

- Missao: estruturar conteudo para canais sociais.
- Quando usar: calendario, posts, threads e distribuicao de conteudo.
- Entrega esperada: ideias por pilar, formatos por canal e ritmo editorial.

### 19) deploy-to-vercel

- Missao: operacionalizar deploy na Vercel.
- Quando usar: pedido de publicar preview ou producao.
- Entrega esperada: URL de deploy e fluxo de publicacao correto.
- Regra forte: preview por padrao; producao somente com pedido explicito.

### 20) web-design-guidelines

- Missao: checar conformidade de UI com guidelines web.
- Quando usar: review de qualidade visual e acessibilidade orientada por padrao.
- Entrega esperada: findings objetivos com referencia ao codigo.

## Agrupamento macro por categoria

- Governanca e orquestracao:
  - societiza-operating-system
  - societiza-code-rules
- Descoberta e estrategia:
  - brainstorming
- Frontend, UI e experiencia:
  - frontend-design
  - ui-ux-pro-max
  - animate
  - shadcn
  - web-design-guidelines
- Engenharia e arquitetura:
  - next-best-practices
  - vercel-composition-patterns
  - typescript-advanced-types
  - vercel-react-view-transitions
- Qualidade e validacao:
  - audit
  - webapp-testing
- Conteudo e crescimento:
  - seo-audit
  - programmatic-seo
  - ai-seo
  - copywriting
  - social-content
- Release e entrega:
  - deploy-to-vercel

## Padrao geral observado no projeto

1. Existe uma camada de comando central:

- societiza-operating-system roteia o trabalho e impone fronteiras.
- societiza-code-rules define como codar no frontend.

2. O fluxo ideal repete esta sequencia:

- descoberta e desenho (brainstorming quando aplicavel);
- implementacao com regras de arquitetura;
- validacao tecnica (audit e webapp-testing);
- documentacao de feature;
- deploy em preview.

3. Skills especializadas sao acionadas por tipo de problema:

- UI e design: frontend-design, ui-ux-pro-max, shadcn, animate;
- arquitetura/codigo: next-best-practices, composition patterns,
  typescript advanced types;
- crescimento: SEO, AI SEO, copy, social.

4. Qualidade e governanca sao tratadas como parte do fluxo, nao como pos-processo.

## Matriz de cruzamento: feature x skills recomendadas

### accountancy

- Base obrigatoria: societiza-operating-system, societiza-code-rules
- Implementacao: next-best-practices, typescript-advanced-types
- UI: frontend-design, shadcn, ui-ux-pro-max
- Qualidade: audit, webapp-testing
- Entrega: deploy-to-vercel

### auth

- Base obrigatoria: societiza-operating-system, societiza-code-rules
- Implementacao: next-best-practices, vercel-composition-patterns
- UI: frontend-design, shadcn
- Qualidade: audit, webapp-testing
- Entrega: deploy-to-vercel

### dashboard

- Base obrigatoria: societiza-operating-system, societiza-code-rules
- Implementacao: next-best-practices, typescript-advanced-types,
  vercel-composition-patterns
- UI e motion: frontend-design, shadcn, animate,
  vercel-react-view-transitions
- Qualidade: audit, webapp-testing
- Entrega: deploy-to-vercel

### form

- Base obrigatoria: societiza-operating-system, societiza-code-rules
- Descoberta: brainstorming (mudancas de fluxo)
- Implementacao: next-best-practices, typescript-advanced-types,
  vercel-composition-patterns
- UI e UX: frontend-design, shadcn, ui-ux-pro-max, animate
- Qualidade: audit, webapp-testing
- Entrega: deploy-to-vercel

### workflow

- Base obrigatoria: societiza-operating-system, societiza-code-rules
- Descoberta: brainstorming (fluxos operacionais)
- Implementacao: next-best-practices, typescript-advanced-types,
  vercel-composition-patterns
- UI e transicoes: frontend-design, shadcn, animate,
  vercel-react-view-transitions
- Qualidade: audit, webapp-testing
- Entrega: deploy-to-vercel

### workflow-template

- Base obrigatoria: societiza-operating-system, societiza-code-rules
- Descoberta: brainstorming
- Implementacao: next-best-practices, typescript-advanced-types,
  vercel-composition-patterns
- UI e builder experience: frontend-design, shadcn, ui-ux-pro-max, animate,
  vercel-react-view-transitions
- Qualidade: audit, webapp-testing
- Entrega: deploy-to-vercel
- Go-to-market (quando aplicavel): seo-audit, ai-seo, copywriting,
  social-content, programmatic-seo

## Recomendacao de uso operacional

- Sempre iniciar pelo par:
  - societiza-operating-system
  - societiza-code-rules
- Acoplar skills especializadas por tarefa, nao por moda.
- Tratar audit e testes como gates de saida de mudanca.
- Atualizar docs/features sempre que houver mudanca relevante de arquitetura,
  fluxo ou acoplamento.

## Conclusao

O repositorio possui um sistema de skills em camadas:

- camada 1: governanca e contratos;
- camada 2: especializacao por dominio tecnico;
- camada 3: validacao e release.

Esse desenho favorece consistencia tecnica e permite cruzar features com skills
sem depender de conhecimento tacito da equipe.
