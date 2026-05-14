# Fronteira Frontend/Backend — Regras de Separação

## Objetivo

Este documento define as regras de separação entre o trabalho de frontend e backend no contexto da Societiza. A fronteira é clara e não negociável.

O frontend engineer é responsável por `web.societiza` e nada mais. Backend existe e é separado.

---

## Regra fundamental

O frontend engineer **nunca edita arquivos em `api.societiza/`** ou em qualquer outro repositório de backend.

Esta regra não tem exceções. Não importa o motivo, a urgência, ou a simplicidade da mudança.

---

## O que fazer quando o contrato de API está errado ou ausente

### Situação 1: Endpoint retorna shape diferente do esperado

**Não fazer**: ajustar componente, hook ou schema para "encaixar" o dado incorreto como se fosse correto.

**Fazer**: criar uma função de **transform na service layer** que converte o shape atual para o shape esperado pelo frontend, e documentar a divergência.

```ts
// Correto — transform na service layer, não no componente
export async function fetchAccountancies(): Promise<Accountancy[]> {
  const response = await fetcher.get(API_ENDPOINTS.accountancy.getAll);
  const raw = rawAccountancyListSchema.parse(response.data);
  // Transform: API devolve `legal_name`, frontend espera `legalName`
  return raw.map((item) => ({
    ...item,
    legalName: item.legal_name,
  }));
}
```

O transform fica **na service**, não no componente, não no hook, não no schema.

### Situação 2: Endpoint não existe ainda

**Não fazer**: codificar a regra de negócio no frontend para compensar a ausência do backend.

**Fazer**:
1. Criar mock MSW em `_mock.ts` com o contrato esperado
2. Adicionar `// TODO: remover quando [endpoint] estiver disponível` no mock
3. Criar ou atualizar `BACKEND_NEEDED.md` descrevendo o contrato necessário

```ts
// _mock.ts
// TODO: remover quando POST /api/processes estiver disponível no backend
export const processMockHandlers = [
  http.post('/api/processes', async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({
      id: crypto.randomUUID(),
      ...body,
      createdAt: new Date().toISOString(),
    });
  }),
];
```

### Situação 3: Contrato é ambíguo ou incompleto

**Não fazer**: assumir o comportamento e implementar baseado em suposição.

**Fazer**: parar, documentar a ambiguidade, e perguntar ao time de backend antes de prosseguir.

Formato para documentar:

```markdown
## Ambiguidade de contrato — [Feature] [Endpoint]

**Endpoint**: GET /api/[recurso]
**Ambiguidade**: o campo `status` pode ser `null` ou simplesmente ausente na response?
**Impacto**: afeta o schema Zod (`.nullable()` vs `.optional()`) e o tratamento de UI

**Pergunta para o backend**: o campo `status` é omitido ou explicitamente `null` quando não definido?
```

---

## Regras de negócio — onde elas vivem

### Regras que pertencem ao backend

- Cálculos de preço, impostos, coeficientes
- Permissões e autorização (o que cada usuário pode fazer)
- Validações de integridade de dados (CPF/CNPJ únicos, conflitos)
- Regras de transição de estado (pode arquivar só se estiver ativo)
- Cálculos que envolvem dados de outras entidades

**Ação quando o frontend precisa dessas regras**: consumir da resposta da API. Se a API não retorna o resultado necessário para tomar a decisão na UI, documentar como `BACKEND_NEEDED` — não duplicar a regra no frontend.

### Regras que pertencem ao frontend

- Validação de campos no formulário (formato, comprimento, presença)
- Ordenação visual de listas (quando não afeta o dado persistido)
- Estado de UI local (drawer aberto/fechado, aba ativa, filtros temporários)
- Formatação de dados para exibição (datas, moeda, mascaramento)
- Controle de loading, error, empty states

---

## Dados sensíveis

Nunca armazenar diretamente em `localStorage`:
- Tokens de autenticação
- Dados de usuário (CPF, email, dados pessoais)
- Dados de negócio críticos (contratos, valores financeiros)
- Qualquer dado que deva ser protegido

Sempre usar o padrão de autenticação estabelecido no projeto (`auth` feature).

Se precisar de persistência local para UX (ex: preferências de layout): usar `localStorage` apenas para dados não sensíveis e documentar explicitamente no código.

---

## O que fazer quando o backend está atrasado

Situação comum: frontend está pronto para integrar mas o backend ainda não entregou o endpoint.

**Fluxo correto**:

1. Identificar o contrato esperado (o que o frontend vai consumir)
2. Criar mock MSW que implementa esse contrato exatamente
3. Desenvolver e testar o fluxo frontend completo contra o mock
4. Quando o backend entregar: remover o mock, sem alterar nenhum outro arquivo

O sinal de que o mock foi feito corretamente: **zero alterações de código de produção** quando o backend chegar.

Se for necessário alterar schema, service, ou hook quando o backend chegar, significa que o mock estava errado — o contrato não foi acordado antes da implementação.

---

## BACKEND_NEEDED.md

Arquivo criado/atualizado pelo frontend para comunicar contratos de API necessários ao time de backend.

Localização: raiz do repositório `web.societiza/BACKEND_NEEDED.md`

Formato por seção:

```markdown
## [Feature Name]

### [MÉTODO] [/api/path]

**Necessário para**: [qual fluxo de UX depende deste endpoint]
**Prioridade**: [Alta / Média / Baixa]

**Payload de request esperado**:
```json
{
  "campo": "tipo e descrição"
}
```

**Payload de response esperado**:
```json
{
  "id": "uuid",
  "campo": "valor"
}
```

**Regras de negócio que o backend deve aplicar**:
- [regra 1]
- [regra 2]

**Casos de erro esperados**:
- `400`: [quando acontece]
- `404`: [quando acontece]
- `409`: [quando acontece — conflito]

**Status**: PENDENTE / EM DESENVOLVIMENTO / ENTREGUE
```

---

## Comunicação com o time de backend

Quando identificar que um endpoint está `MISSING` ou `PARTIAL`:

1. Atualizar `BACKEND_NEEDED.md`
2. Incluir no PR description uma seção "Dependências de Backend" listando o que está pendente
3. Marcar o PR como "aguardando backend" se for bloqueante

Não criar o PR como se estivesse completo quando há dependências de backend pendentes.

---

## Resumo operacional

- Frontend nunca toca em `api.societiza/` — nunca, sem exceção
- Shape errado da API: transform na service layer, não no componente
- Endpoint ausente: mock MSW + BACKEND_NEEDED.md
- Contrato ambíguo: parar e perguntar, nunca assumir
- Regras de negócio do backend: consumir da API, não duplicar no frontend
- Dados sensíveis: nunca em localStorage diretamente
- Mock bem feito: zero alterações quando o backend chegar
