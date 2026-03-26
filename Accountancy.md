# Documentacao de Endpoints - Modulo Accountancy

Este guia explica como implementar o consumo de todos os endpoints do modulo Accountancy na API do Societiza.

## Visao geral

- Base URL local: `http://localhost:5258/api`
- Prefixo de versao nas rotas: `v{version}`
- Versao atual dos endpoints de Accountancy: `v1`
- Recurso: `accountancy`

Rotas finais:

- `POST /api/v1/accountancy`
- `PUT /api/v1/accountancy/{accountancyId}`
- `DELETE /api/v1/accountancy/{accountancyId}`
- `GET /api/v1/accountancy`
- `GET /api/v1/accountancy/{accountancyId}`

Observacoes:

- A API tambem aceita versao via header `X-Api-Version`, mas os endpoints ja usam versao na URL.
- Todos os responses JSON seguem `camelCase`.

## Contratos de dados

### Create/Update body

```json
{
  "cnpj": "12.345.678/0001-95",
  "legalName": "Contabilidade Exemplo LTDA",
  "tradeName": "Contab Exemplo",
  "address": "Rua A, 123",
  "city": "Sao Paulo",
  "state": "SP",
  "postalCode": "01310-100",
  "phone": "(11) 99999-8888",
  "email": "contato@exemplo.com"
}
```

Campos:

- `cnpj` (string, obrigatorio)
- `legalName` (string, obrigatorio, max 150)
- `tradeName` (string, opcional, max 150)
- `address` (string, obrigatorio, max 200)
- `city` (string, obrigatorio, max 100)
- `state` (string, obrigatorio, max 2)
- `postalCode` (string, obrigatorio, CEP valido)
- `phone` (string, obrigatorio, telefone valido)
- `email` (string, opcional, email valido, max 100)

### Response de identificador

Usado no `POST`:

```json
{
  "id": "6d1f03d7-7e06-4d6f-9f67-2af2f23b848d"
}
```

### Response de detalhe

Usado no `GET` por id e no `GET` de lista:

```json
{
  "id": "6d1f03d7-7e06-4d6f-9f67-2af2f23b848d",
  "cnpj": "12345678000195",
  "legalName": "Contabilidade Exemplo LTDA",
  "tradeName": "Contab Exemplo",
  "address": "Rua A, 123",
  "city": "Sao Paulo",
  "state": "SP",
  "postalCode": "01310-100",
  "phone": "(11) 99999-8888",
  "email": "contato@exemplo.com",
  "createdAt": "2026-03-25T12:34:56.789+00:00",
  "updatedAt": "2026-03-25T13:00:00.000+00:00"
}
```

## Contrato padrao de erro

Quando ocorre falha de validacao, conflito, nao encontrado ou bad request, a API responde com `ProblemDetails`:

```json
{
  "title": "Validation Error",
  "type": "ValidationError",
  "detail": "One or more validation errors occurred.",
  "status": 400,
  "errors": [
    {
      "code": "NotEmptyValidator",
      "message": "CNPJ is required"
    }
  ]
}
```

Notas:

- `title` varia conforme o tipo (`Validation Error`, `Not Found`, `Conflict`, `Bad Request`).
- `type` contem o codigo de erro interno.
- O array `errors` aparece principalmente em erros de validacao.

## Endpoints (todos)

## 1) Criar contabilidade

- Metodo: `POST`
- Rota: `/api/v1/accountancy`
- Body: contrato `Create/Update body`

Sucesso:

- `200 OK` com `{ "id": "guid" }`

Falhas comuns:

- `400 Bad Request` se validacao falhar
- `409 Conflict` se ja existir contabilidade com o mesmo CNPJ

Exemplo cURL:

```bash
curl -X POST "http://localhost:5258/api/v1/accountancy" \
  -H "Content-Type: application/json" \
  -d '{
    "cnpj": "12.345.678/0001-95",
    "legalName": "Contabilidade Exemplo LTDA",
    "tradeName": "Contab Exemplo",
    "address": "Rua A, 123",
    "city": "Sao Paulo",
    "state": "SP",
    "postalCode": "01310-100",
    "phone": "(11) 99999-8888",
    "email": "contato@exemplo.com"
  }'
```

## 2) Atualizar contabilidade

- Metodo: `PUT`
- Rota: `/api/v1/accountancy/{accountancyId}`
- Parametro de rota: `accountancyId` (GUID)
- Body: contrato `Create/Update body`

Sucesso:

- `200 OK` sem body

Falhas comuns:

- `400 Bad Request` se validacao falhar
- `404 Not Found` se o agregado nao existir
- `409 Conflict` se o agregado estiver marcado como deletado

Exemplo cURL:

```bash
curl -X PUT "http://localhost:5258/api/v1/accountancy/6d1f03d7-7e06-4d6f-9f67-2af2f23b848d" \
  -H "Content-Type: application/json" \
  -d '{
    "cnpj": "12.345.678/0001-95",
    "legalName": "Contabilidade Exemplo LTDA - Atualizada",
    "tradeName": "Contab Exemplo",
    "address": "Rua A, 123",
    "city": "Sao Paulo",
    "state": "SP",
    "postalCode": "01310-100",
    "phone": "(11) 99999-8888",
    "email": "contato@exemplo.com"
  }'
```

## 3) Excluir contabilidade (soft delete)

- Metodo: `DELETE`
- Rota: `/api/v1/accountancy/{accountancyId}`
- Parametro de rota: `accountancyId` (GUID)

Sucesso:

- `200 OK` sem body

Falhas comuns:

- `400 Bad Request` para GUID invalido ou payload invalido
- `404 Not Found` se nao existir
- `409 Conflict` se ja estiver deletado

Exemplo cURL:

```bash
curl -X DELETE "http://localhost:5258/api/v1/accountancy/6d1f03d7-7e06-4d6f-9f67-2af2f23b848d"
```

## 4) Listar todas as contabilidades

- Metodo: `GET`
- Rota: `/api/v1/accountancy`
- Query params: nenhum

Comportamento:

- Retorna apenas contabilidades ativas (`isDeleted = false`).
- Ordena por `legalName` e depois por `createdAt`.

Sucesso:

- `200 OK` com `AccountancyDetailResponse[]`

Falhas comuns:

- `400 Bad Request` em casos de erro de contrato/processamento

Exemplo cURL:

```bash
curl -X GET "http://localhost:5258/api/v1/accountancy"
```

## 5) Buscar contabilidade por ID

- Metodo: `GET`
- Rota: `/api/v1/accountancy/{accountancyId}`
- Parametro de rota: `accountancyId` (GUID)

Sucesso:

- `200 OK` com `AccountancyDetailResponse`

Falhas comuns:

- `400 Bad Request` para GUID invalido
- `404 Not Found` se nao existir

Exemplo cURL:

```bash
curl -X GET "http://localhost:5258/api/v1/accountancy/6d1f03d7-7e06-4d6f-9f67-2af2f23b848d"
```

## Como implementar no client (passo a passo)

## 1) Defina os tipos

- `CreateAccountancyInput`
- `UpdateAccountancyInput`
- `AccountancyDetail`
- `ProblemDetails`

## 2) Centralize o client HTTP

- Base URL: `http://localhost:5258/api`
- Default headers: `Content-Type: application/json`
- Interceptor para mapear `status` e `ProblemDetails`

## 3) Implemente funcoes por endpoint

- `createAccountancy(input)` -> `POST /v1/accountancy`
- `updateAccountancy(id, input)` -> `PUT /v1/accountancy/{id}`
- `deleteAccountancy(id)` -> `DELETE /v1/accountancy/{id}`
- `getAllAccountancies()` -> `GET /v1/accountancy`
- `getAccountancyById(id)` -> `GET /v1/accountancy/{id}`

## 4) Trate erros por status

- `400`: mostrar mensagens de validacao por campo
- `404`: mostrar mensagem de registro nao encontrado
- `409`: mostrar conflito de regra de negocio (ex.: CNPJ duplicado, agregado deletado)

## 5) Fluxo recomendado de tela

- Criacao: envia `POST`, guarda `id` retornado
- Edicao: busca por id (`GET`), preenche formulario, envia `PUT`
- Exclusao: confirma usuario e chama `DELETE`
- Listagem: usa `GET /accountancy` para grid principal

## Regras de negocio importantes

- O CNPJ deve ser valido e unico para criacao.
- Exclusao e logica (soft delete).
- Registro soft-deleted nao aparece na listagem.
- Atualizacao e exclusao dependem da existencia do agregado no event store.

## Referencias no codigo

- Endpoints web: `src/Web/Endpoints/Modules/Accountancy`
- Rotas: `src/Web/Endpoints/Routes/AccountancyRoutes.cs`
- Comandos/queries/response: `src/Modules/Accountancy/Accountancy.Shared`
- Handlers: `src/Modules/Accountancy/Accountancy.Application/UseCases`
- Validadores: `src/Modules/Accountancy/Accountancy.Application/UseCases/Validators`
- Mapeamento de erros para HTTP: `src/Core/Core.Endpoints/Extensions/EndpointBaseExtensions.cs`
