# [Docs] Mapeamento de Endpoints — Módulo WorkflowTemplate

> Documentação de referência para o frontend, contendo todos os endpoints do módulo **WorkflowTemplate** e seus submódulos (**Step**, **StepTask**, **StepField**, **StepTaskField**) com exemplos de requisição e resposta prontos para uso.

---

## Sumário

- [WorkflowTemplate](#workflowtemplate)
  - [POST — Criar Template](#post--criar-template)
  - [PUT — Atualizar Template](#put--atualizar-template)
  - [PATCH — Ativar Template](#patch--ativar-template)
  - [PATCH — Arquivar Template](#patch--arquivar-template)
  - [GET — Listar Templates](#get--listar-templates)
  - [GET — Detalhar Template](#get--detalhar-template)
- [WorkflowTemplateStep](#workflowtemplatestep)
  - [POST — Adicionar Etapa](#post--adicionar-etapa)
  - [PUT — Atualizar Etapa](#put--atualizar-etapa)
  - [DELETE — Remover Etapa](#delete--remover-etapa)
- [WorkflowTemplateStepTask](#workflowtemplateSteptask)
  - [POST — Adicionar Tarefa](#post--adicionar-tarefa)
  - [PUT — Atualizar Tarefa](#put--atualizar-tarefa)
  - [DELETE — Remover Tarefa](#delete--remover-tarefa)
- [WorkflowTemplateStepField](#workflowtemplateStepfield)
  - [POST — Adicionar Campo à Etapa](#post--adicionar-campo-à-etapa)
  - [PUT — Atualizar Campo da Etapa](#put--atualizar-campo-da-etapa)
  - [DELETE — Remover Campo da Etapa](#delete--remover-campo-da-etapa)
- [WorkflowTemplateStepTaskField](#workflowtemplateSteptaskfield)
  - [POST — Adicionar Campo à Tarefa](#post--adicionar-campo-à-tarefa)
  - [PUT — Atualizar Campo da Tarefa](#put--atualizar-campo-da-tarefa)
  - [DELETE — Remover Campo da Tarefa](#delete--remover-campo-da-tarefa)

---

## WorkflowTemplate

### POST — Criar Template

Cria um novo template de workflow. O template é criado com status `Draft` por padrão.

```
POST /v1/workflow-template
```

**Request Body**

```json
{
  "name": "Template Santa Catarina",
  "description": "Template padrão para processos societários no estado de Santa Catarina."
}
```

| Campo         | Tipo     | Obrigatório | Descrição             |
| ------------- | -------- | ----------- | --------------------- |
| `name`        | `string` | ✅          | Nome do template      |
| `description` | `string` | ✅          | Descrição do template |

**Respostas**

| Status            | Corpo                | Descrição                   |
| ----------------- | -------------------- | --------------------------- |
| `200 OK`          | `{ "id": "<guid>" }` | Template criado com sucesso |
| `400 Bad Request` | —                    | Dados inválidos ou ausentes |

---

### PUT — Atualizar Template

Atualiza o nome e/ou a descrição de um template existente.

```
PUT /v1/workflow-template/{workflowTemplateId}
```

**Path Params**

| Parâmetro            | Tipo            | Descrição      |
| -------------------- | --------------- | -------------- |
| `workflowTemplateId` | `string` (GUID) | ID do template |

**Request Body**

```json
{
  "name": "Template Santa Catarina v2",
  "description": "Versão atualizada do template padrão do estado de Santa Catarina."
}
```

| Campo         | Tipo     | Obrigatório | Descrição                  |
| ------------- | -------- | ----------- | -------------------------- |
| `name`        | `string` | ✅          | Novo nome do template      |
| `description` | `string` | ✅          | Nova descrição do template |

**Respostas**

| Status            | Descrição                       |
| ----------------- | ------------------------------- |
| `200 OK`          | Template atualizado com sucesso |
| `400 Bad Request` | Dados inválidos ou ausentes     |
| `404 Not Found`   | Template não encontrado         |

---

### PATCH — Ativar Template

Altera o status do template para `Active`.

```
PATCH /v1/workflow-template/{workflowTemplateId}/activate
```

**Path Params**

| Parâmetro            | Tipo            | Descrição      |
| -------------------- | --------------- | -------------- |
| `workflowTemplateId` | `string` (GUID) | ID do template |

**Request Body**

Nenhum corpo necessário.

**Respostas**

| Status            | Descrição                    |
| ----------------- | ---------------------------- |
| `200 OK`          | Template ativado com sucesso |
| `400 Bad Request` | Requisição inválida          |
| `404 Not Found`   | Template não encontrado      |

---

### PATCH — Arquivar Template

Altera o status do template para `Archived`.

```
PATCH /v1/workflow-template/{workflowTemplateId}/archive
```

**Path Params**

| Parâmetro            | Tipo            | Descrição      |
| -------------------- | --------------- | -------------- |
| `workflowTemplateId` | `string` (GUID) | ID do template |

**Request Body**

Nenhum corpo necessário.

**Respostas**

| Status            | Descrição                      |
| ----------------- | ------------------------------ |
| `200 OK`          | Template arquivado com sucesso |
| `400 Bad Request` | Requisição inválida            |
| `404 Not Found`   | Template não encontrado        |

---

### GET — Listar Templates

Retorna uma lista resumida de todos os templates de workflow cadastrados.

```
GET /v1/workflow-template
```

**Request Body**

Nenhum corpo necessário.

**Resposta de Sucesso — `200 OK`**

```json
[
  {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "name": "Onboarding de Clientes",
    "description": "Template padrão para onboarding de novos clientes"
  },
  {
    "id": "7cb92e41-1234-4abc-9def-1a2b3c4d5e6f",
    "name": "Revisão de Contratos",
    "description": "Fluxo de revisão e aprovação de contratos"
  }
]
```

| Campo         | Tipo            | Descrição                       |
| ------------- | --------------- | ------------------------------- |
| `id`          | `string` (GUID) | Identificador único do template |
| `name`        | `string`        | Nome do template                |
| `description` | `string`        | Descrição do template           |

**Respostas**

| Status            | Descrição                   |
| ----------------- | --------------------------- |
| `200 OK`          | Lista retornada com sucesso |
| `400 Bad Request` | Requisição inválida         |

---

### GET — Detalhar Template

Retorna os dados completos de um template específico, incluindo etapas, tarefas e campos de cada nível.

```
GET /v1/workflow-template/{workflowTemplateId}
```

**Path Params**

| Parâmetro            | Tipo            | Descrição      |
| -------------------- | --------------- | -------------- |
| `workflowTemplateId` | `string` (GUID) | ID do template |

**Resposta de Sucesso — `200 OK`**

```json
{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "name": "Onboarding de Clientes",
  "description": "Template padrão para onboarding de novos clientes",
  "templateVersion": 1,
  "status": "Active",
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-03-10T14:30:00Z",
  "steps": [
    {
      "id": "a1b2c3d4-0000-0000-0000-000000000001",
      "title": "Coleta de Dados",
      "description": "Recolher informações básicas do cliente",
      "order": 1,
      "fields": [
        {
          "id": "f1000000-0000-0000-0000-000000000001",
          "label": "Nome Completo",
          "fieldType": "Text",
          "options": null
        },
        {
          "id": "f1000000-0000-0000-0000-000000000002",
          "label": "Tipo de Cliente",
          "fieldType": "Select",
          "options": ["PF", "PJ"]
        }
      ],
      "tasks": [
        {
          "id": "b2000000-0000-0000-0000-000000000001",
          "title": "Enviar formulário de cadastro",
          "description": "Solicitar preenchimento do formulário inicial",
          "type": "Form",
          "configuration": {},
          "order": 1,
          "isOptional": false,
          "fields": [
            {
              "id": "f2000000-0000-0000-0000-000000000001",
              "label": "Documento",
              "fieldType": "Text",
              "options": null
            }
          ]
        }
      ]
    }
  ]
}
```

**Estrutura da resposta**

`WorkflowTemplateDetailResponse`

| Campo             | Tipo            | Descrição                                    |
| ----------------- | --------------- | -------------------------------------------- |
| `id`              | `string` (GUID) | Identificador do template                    |
| `name`            | `string`        | Nome do template                             |
| `description`     | `string`        | Descrição do template                        |
| `templateVersion` | `int`           | Versão atual do template                     |
| `status`          | `string`        | Status atual (`Draft`, `Active`, `Archived`) |
| `createdAt`       | `datetime`      | Data de criação                              |
| `updatedAt`       | `datetime`      | Data da última atualização                   |
| `steps`           | `array`         | Lista de etapas, ordenadas por `order`       |

`WorkflowTemplateStepDetailResponse` — item de `steps`

| Campo         | Tipo            | Descrição                               |
| ------------- | --------------- | --------------------------------------- |
| `id`          | `string` (GUID) | Identificador da etapa                  |
| `title`       | `string`        | Título da etapa                         |
| `description` | `string`        | Descrição da etapa                      |
| `order`       | `int`           | Posição da etapa no fluxo               |
| `fields`      | `array`         | Campos associados à etapa               |
| `tasks`       | `array`         | Tarefas da etapa, ordenadas por `order` |

`WorkflowTemplateStepFieldDetailResponse` — item de `steps[].fields`

| Campo       | Tipo            | Descrição                                        |
| ----------- | --------------- | ------------------------------------------------ |
| `id`        | `string` (GUID) | Identificador do campo                           |
| `label`     | `string`        | Rótulo exibido para o campo                      |
| `fieldType` | `string`        | Tipo do campo (ex: `Text`, `Select`, etc.)       |
| `options`   | `array\|null`   | Opções disponíveis (apenas para campos `Select`) |

`WorkflowTemplateStepTaskDetailResponse` — item de `steps[].tasks`

| Campo           | Tipo            | Descrição                                   |
| --------------- | --------------- | ------------------------------------------- |
| `id`            | `string` (GUID) | Identificador da tarefa                     |
| `title`         | `string`        | Título da tarefa                            |
| `description`   | `string`        | Descrição da tarefa                         |
| `type`          | `string`        | Tipo da tarefa (ex: `Form`, etc.)           |
| `configuration` | `object`        | Configurações específicas do tipo de tarefa |
| `order`         | `int`           | Posição da tarefa dentro da etapa           |
| `isOptional`    | `bool`          | Indica se a tarefa pode ser ignorada        |
| `fields`        | `array`         | Campos associados à tarefa                  |

`WorkflowTemplateStepTaskFieldDetailResponse` — item de `steps[].tasks[].fields`

| Campo       | Tipo            | Descrição                                        |
| ----------- | --------------- | ------------------------------------------------ |
| `id`        | `string` (GUID) | Identificador do campo                           |
| `label`     | `string`        | Rótulo exibido para o campo                      |
| `fieldType` | `string`        | Tipo do campo (ex: `Text`, `Select`, etc.)       |
| `options`   | `array\|null`   | Opções disponíveis (apenas para campos `Select`) |

**Respostas**

| Status            | Descrição                    |
| ----------------- | ---------------------------- |
| `200 OK`          | Dados do template retornados |
| `400 Bad Request` | Requisição inválida          |
| `404 Not Found`   | Template não encontrado      |

---

## WorkflowTemplateStep

### POST — Adicionar Etapa

Adiciona uma nova etapa (step) ao template especificado.

```
POST /v1/workflow-template/{workflowTemplateId}/step
```

**Path Params**

| Parâmetro            | Tipo            | Descrição      |
| -------------------- | --------------- | -------------- |
| `workflowTemplateId` | `string` (GUID) | ID do template |

**Request Body**

```json
{
  "title": "Coleta de Dados",
  "description": "Recolher informações básicas do cliente",
  "order": 1
}
```

| Campo         | Tipo     | Obrigatório | Descrição                           |
| ------------- | -------- | ----------- | ----------------------------------- |
| `title`       | `string` | ✅          | Título da etapa                     |
| `description` | `string` | ✅          | Descrição da etapa                  |
| `order`       | `int`    | ✅          | Posição da etapa no fluxo (1-based) |

**Respostas**

| Status            | Corpo                | Descrição                   |
| ----------------- | -------------------- | --------------------------- |
| `200 OK`          | `{ "id": "<guid>" }` | Etapa criada com sucesso    |
| `400 Bad Request` | —                    | Dados inválidos ou ausentes |
| `404 Not Found`   | —                    | Template não encontrado     |

---

### PUT — Atualizar Etapa

Atualiza título, descrição e/ou ordem de uma etapa existente.

```
PUT /v1/workflow-template/{workflowTemplateId}/step/{workflowStepId}
```

**Path Params**

| Parâmetro            | Tipo            | Descrição      |
| -------------------- | --------------- | -------------- |
| `workflowTemplateId` | `string` (GUID) | ID do template |
| `workflowStepId`     | `string` (GUID) | ID da etapa    |

**Request Body**

```json
{
  "title": "Coleta de Dados Atualizada",
  "description": "Descrição revisada da etapa de coleta",
  "order": 2
}
```

| Campo         | Tipo     | Obrigatório | Descrição               |
| ------------- | -------- | ----------- | ----------------------- |
| `title`       | `string` | ✅          | Novo título da etapa    |
| `description` | `string` | ✅          | Nova descrição da etapa |
| `order`       | `int`    | ✅          | Nova posição da etapa   |

**Respostas**

| Status            | Descrição                           |
| ----------------- | ----------------------------------- |
| `200 OK`          | Etapa atualizada com sucesso        |
| `400 Bad Request` | Dados inválidos ou ausentes         |
| `404 Not Found`   | Template ou etapa não encontrado(a) |

---

### DELETE — Remover Etapa

Remove uma etapa do template especificado.

```
DELETE /v1/workflow-template/{workflowTemplateId}/step/{workflowStepId}
```

**Path Params**

| Parâmetro            | Tipo            | Descrição      |
| -------------------- | --------------- | -------------- |
| `workflowTemplateId` | `string` (GUID) | ID do template |
| `workflowStepId`     | `string` (GUID) | ID da etapa    |

**Request Body**

Nenhum corpo necessário.

**Respostas**

| Status            | Descrição                           |
| ----------------- | ----------------------------------- |
| `200 OK`          | Etapa removida com sucesso          |
| `400 Bad Request` | Requisição inválida                 |
| `404 Not Found`   | Template ou etapa não encontrado(a) |

---

## WorkflowTemplateStepTask

### POST — Adicionar Tarefa

Adiciona uma nova tarefa a uma etapa do template especificado.

```
POST /v1/workflow-template/{workflowTemplateId}/step/{workflowStepId}/task
```

**Path Params**

| Parâmetro            | Tipo            | Descrição      |
| -------------------- | --------------- | -------------- |
| `workflowTemplateId` | `string` (GUID) | ID do template |
| `workflowStepId`     | `string` (GUID) | ID da etapa    |

**Request Body**

```json
{
  "title": "Enviar formulário de cadastro",
  "description": "Solicitar preenchimento do formulário inicial",
  "type": "Form",
  "configuration": {},
  "order": 1,
  "isOptional": false
}
```

| Campo           | Tipo     | Obrigatório | Descrição                                   |
| --------------- | -------- | ----------- | ------------------------------------------- |
| `title`         | `string` | ✅          | Título da tarefa                            |
| `description`   | `string` | ✅          | Descrição da tarefa                         |
| `type`          | `string` | ✅          | Tipo da tarefa (ex: `Form`)                 |
| `configuration` | `object` | ✅          | Configurações específicas do tipo de tarefa |
| `order`         | `int`    | ✅          | Posição da tarefa dentro da etapa           |
| `isOptional`    | `bool`   | ✅          | Indica se a tarefa pode ser ignorada        |

**Respostas**

| Status            | Corpo                | Descrição                           |
| ----------------- | -------------------- | ----------------------------------- |
| `200 OK`          | `{ "id": "<guid>" }` | Tarefa criada com sucesso           |
| `400 Bad Request` | —                    | Dados inválidos ou ausentes         |
| `404 Not Found`   | —                    | Template ou etapa não encontrado(a) |

---

### PUT — Atualizar Tarefa

Atualiza os dados de uma tarefa existente em uma etapa.

```
PUT /v1/workflow-template/{workflowTemplateId}/step/{workflowStepId}/task/{workflowTaskId}
```

**Path Params**

| Parâmetro            | Tipo            | Descrição      |
| -------------------- | --------------- | -------------- |
| `workflowTemplateId` | `string` (GUID) | ID do template |
| `workflowStepId`     | `string` (GUID) | ID da etapa    |
| `workflowTaskId`     | `string` (GUID) | ID da tarefa   |

**Request Body**

```json
{
  "title": "Enviar formulário atualizado",
  "description": "Descrição revisada da tarefa",
  "type": "Form",
  "configuration": {},
  "order": 2,
  "isOptional": true
}
```

| Campo           | Tipo     | Obrigatório | Descrição                              |
| --------------- | -------- | ----------- | -------------------------------------- |
| `title`         | `string` | ✅          | Novo título da tarefa                  |
| `description`   | `string` | ✅          | Nova descrição da tarefa               |
| `type`          | `string` | ✅          | Novo tipo da tarefa                    |
| `configuration` | `object` | ✅          | Nova configuração da tarefa            |
| `order`         | `int`    | ✅          | Nova posição da tarefa dentro da etapa |
| `isOptional`    | `bool`   | ✅          | Atualiza se a tarefa pode ser ignorada |

**Respostas**

| Status            | Descrição                                   |
| ----------------- | ------------------------------------------- |
| `200 OK`          | Tarefa atualizada com sucesso               |
| `400 Bad Request` | Dados inválidos ou ausentes                 |
| `404 Not Found`   | Template, etapa ou tarefa não encontrado(a) |

---

### DELETE — Remover Tarefa

Remove uma tarefa de uma etapa do template especificado.

```
DELETE /v1/workflow-template/{workflowTemplateId}/step/{workflowStepId}/task/{workflowTaskId}
```

**Path Params**

| Parâmetro            | Tipo            | Descrição      |
| -------------------- | --------------- | -------------- |
| `workflowTemplateId` | `string` (GUID) | ID do template |
| `workflowStepId`     | `string` (GUID) | ID da etapa    |
| `workflowTaskId`     | `string` (GUID) | ID da tarefa   |

**Request Body**

Nenhum corpo necessário.

**Respostas**

| Status            | Descrição                                   |
| ----------------- | ------------------------------------------- |
| `200 OK`          | Tarefa removida com sucesso                 |
| `400 Bad Request` | Requisição inválida                         |
| `404 Not Found`   | Template, etapa ou tarefa não encontrado(a) |

---

## WorkflowTemplateStepField

### POST — Adicionar Campo à Etapa

Adiciona um novo campo a uma etapa do template especificado.

```
POST /v1/workflow-template/{workflowTemplateId}/step/{workflowStepId}/fields
```

**Path Params**

| Parâmetro            | Tipo            | Descrição      |
| -------------------- | --------------- | -------------- |
| `workflowTemplateId` | `string` (GUID) | ID do template |
| `workflowStepId`     | `string` (GUID) | ID da etapa    |

**Request Body**

```json
{
  "label": "Tipo de Cliente",
  "fieldType": "Select",
  "options": ["PF", "PJ"]
}
```

| Campo       | Tipo          | Obrigatório | Descrição                                      |
| ----------- | ------------- | ----------- | ---------------------------------------------- |
| `label`     | `string`      | ✅          | Rótulo exibido para o campo                    |
| `fieldType` | `string`      | ✅          | Tipo do campo (ex: `Text`, `Select`, etc.)     |
| `options`   | `array\|null` | ❌          | Opções disponíveis (obrigatório para `Select`) |

**Respostas**

| Status            | Corpo                | Descrição                           |
| ----------------- | -------------------- | ----------------------------------- |
| `200 OK`          | `{ "id": "<guid>" }` | Campo criado com sucesso            |
| `400 Bad Request` | —                    | Dados inválidos ou ausentes         |
| `404 Not Found`   | —                    | Template ou etapa não encontrado(a) |

---

### PUT — Atualizar Campo da Etapa

Atualiza o label, tipo e opções de um campo existente em uma etapa.

```
PUT /v1/workflow-template/{workflowTemplateId}/step/{workflowStepId}/fields/{workflowFieldId}
```

**Path Params**

| Parâmetro            | Tipo            | Descrição      |
| -------------------- | --------------- | -------------- |
| `workflowTemplateId` | `string` (GUID) | ID do template |
| `workflowStepId`     | `string` (GUID) | ID da etapa    |
| `workflowFieldId`    | `string` (GUID) | ID do campo    |

**Request Body**

```json
{
  "label": "Tipo de Cliente Atualizado",
  "fieldType": "Select",
  "options": ["PF", "PJ", "Internacional"]
}
```

| Campo       | Tipo          | Obrigatório | Descrição             |
| ----------- | ------------- | ----------- | --------------------- |
| `label`     | `string`      | ✅          | Novo rótulo do campo  |
| `fieldType` | `string`      | ✅          | Novo tipo do campo    |
| `options`   | `array\|null` | ❌          | Novas opções do campo |

**Respostas**

| Status            | Descrição                                  |
| ----------------- | ------------------------------------------ |
| `200 OK`          | Campo atualizado com sucesso               |
| `400 Bad Request` | Dados inválidos ou ausentes                |
| `404 Not Found`   | Template, etapa ou campo não encontrado(a) |

---

### DELETE — Remover Campo da Etapa

Remove um campo de uma etapa do template especificado.

```
DELETE /v1/workflow-template/{workflowTemplateId}/step/{workflowStepId}/fields/{workflowFieldId}
```

**Path Params**

| Parâmetro            | Tipo            | Descrição      |
| -------------------- | --------------- | -------------- |
| `workflowTemplateId` | `string` (GUID) | ID do template |
| `workflowStepId`     | `string` (GUID) | ID da etapa    |
| `workflowFieldId`    | `string` (GUID) | ID do campo    |

**Request Body**

Nenhum corpo necessário.

**Respostas**

| Status            | Descrição                                  |
| ----------------- | ------------------------------------------ |
| `200 OK`          | Campo removido com sucesso                 |
| `400 Bad Request` | Requisição inválida                        |
| `404 Not Found`   | Template, etapa ou campo não encontrado(a) |

---

## WorkflowTemplateStepTaskField

### POST — Adicionar Campo à Tarefa

Adiciona um novo campo a uma tarefa de uma etapa do template especificado.

```
POST /v1/workflow-template/{workflowTemplateId}/step/{workflowStepId}/task/{workflowTaskId}/fields
```

**Path Params**

| Parâmetro            | Tipo            | Descrição      |
| -------------------- | --------------- | -------------- |
| `workflowTemplateId` | `string` (GUID) | ID do template |
| `workflowStepId`     | `string` (GUID) | ID da etapa    |
| `workflowTaskId`     | `string` (GUID) | ID da tarefa   |

**Request Body**

```json
{
  "label": "Documento",
  "fieldType": "Text",
  "options": null
}
```

| Campo       | Tipo          | Obrigatório | Descrição                                      |
| ----------- | ------------- | ----------- | ---------------------------------------------- |
| `label`     | `string`      | ✅          | Rótulo exibido para o campo                    |
| `fieldType` | `string`      | ✅          | Tipo do campo (ex: `Text`, `Select`, etc.)     |
| `options`   | `array\|null` | ❌          | Opções disponíveis (obrigatório para `Select`) |

**Respostas**

| Status            | Corpo                | Descrição                                   |
| ----------------- | -------------------- | ------------------------------------------- |
| `200 OK`          | `{ "id": "<guid>" }` | Campo criado com sucesso                    |
| `400 Bad Request` | —                    | Dados inválidos ou ausentes                 |
| `404 Not Found`   | —                    | Template, etapa ou tarefa não encontrado(a) |

---

### PUT — Atualizar Campo da Tarefa

Atualiza o label, tipo e opções de um campo existente em uma tarefa.

```
PUT /v1/workflow-template/{workflowTemplateId}/step/{workflowStepId}/task/{workflowTaskId}/fields/{workflowFieldId}
```

**Path Params**

| Parâmetro            | Tipo            | Descrição      |
| -------------------- | --------------- | -------------- |
| `workflowTemplateId` | `string` (GUID) | ID do template |
| `workflowStepId`     | `string` (GUID) | ID da etapa    |
| `workflowTaskId`     | `string` (GUID) | ID da tarefa   |
| `workflowFieldId`    | `string` (GUID) | ID do campo    |

**Request Body**

```json
{
  "label": "Número do Documento",
  "fieldType": "Text",
  "options": null
}
```

| Campo       | Tipo          | Obrigatório | Descrição             |
| ----------- | ------------- | ----------- | --------------------- |
| `label`     | `string`      | ✅          | Novo rótulo do campo  |
| `fieldType` | `string`      | ✅          | Novo tipo do campo    |
| `options`   | `array\|null` | ❌          | Novas opções do campo |

**Respostas**

| Status            | Descrição                                          |
| ----------------- | -------------------------------------------------- |
| `200 OK`          | Campo atualizado com sucesso                       |
| `400 Bad Request` | Dados inválidos ou ausentes                        |
| `404 Not Found`   | Template, etapa, tarefa ou campo não encontrado(a) |

---

### DELETE — Remover Campo da Tarefa

Remove um campo de uma tarefa de uma etapa do template especificado.

```
DELETE /v1/workflow-template/{workflowTemplateId}/step/{workflowStepId}/task/{workflowTaskId}/fields/{workflowFieldId}
```

**Path Params**

| Parâmetro            | Tipo            | Descrição      |
| -------------------- | --------------- | -------------- |
| `workflowTemplateId` | `string` (GUID) | ID do template |
| `workflowStepId`     | `string` (GUID) | ID da etapa    |
| `workflowTaskId`     | `string` (GUID) | ID da tarefa   |
| `workflowFieldId`    | `string` (GUID) | ID do campo    |

**Request Body**

Nenhum corpo necessário.

**Respostas**

| Status            | Descrição                                          |
| ----------------- | -------------------------------------------------- |
| `200 OK`          | Campo removido com sucesso                         |
| `400 Bad Request` | Requisição inválida                                |
| `404 Not Found`   | Template, etapa, tarefa ou campo não encontrado(a) |

---

## Ciclo de Status do Template

```
Draft ──► Active ──► Archived
```

| Status     | Descrição                                      |
| ---------- | ---------------------------------------------- |
| `Draft`    | Estado inicial ao criar o template             |
| `Active`   | Template disponível para uso (`/activate`)     |
| `Archived` | Template desativado e fora de uso (`/archive`) |

---
