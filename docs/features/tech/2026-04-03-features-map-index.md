# Mapa das Features do Frontend

## Objetivo

Este índice centraliza a documentação detalhada das features atuais do frontend
do Societiza.

Cada arquivo mapeia:

- objetivo da feature;
- superfície visual;
- microserviços internos da feature;
- serviços HTTP e integrações externas;
- hooks de query e mutation;
- contextos e orquestração de estado;
- schemas e contratos;
- riscos, limites e pontos de acoplamento.

## Features documentadas

- [Accountancy](/Users/henilveira/Documents/societiza/web.societiza/docs/features/2026-04-03-accountancy-feature-map.md)
- [Auth](/Users/henilveira/Documents/societiza/web.societiza/docs/features/2026-04-03-auth-feature-map.md)
- [Dashboard](/Users/henilveira/Documents/societiza/web.societiza/docs/features/2026-04-03-dashboard-feature-map.md)
- [Form](/Users/henilveira/Documents/societiza/web.societiza/docs/features/2026-04-03-form-feature-map.md)
- [Workflow](/Users/henilveira/Documents/societiza/web.societiza/docs/features/2026-04-03-workflow-feature-map.md)
- [Workflow Template](/Users/henilveira/Documents/societiza/web.societiza/docs/features/2026-04-03-workflow-template-feature-map.md)
- [Skills x Features (Claude Code)](2026-04-05-skills-feature-cross-map.md)
- [Padrao de Documentacao e Blueprint de Agent](2026-04-05-documentation-agent-blueprint.md)

## Leitura recomendada

1. Ler `Workflow` e `Workflow Template` primeiro, porque concentram o domínio
   principal do produto.
2. Ler `Form` em seguida, porque ele funciona como fluxo paralelo de coleta de
   dados e reaproveita parte do mesmo domínio corporativo.
3. Ler `Accountancy`, `Auth` e `Dashboard` por último, porque são features mais
   lineares e com menor complexidade interna.
