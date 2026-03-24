# WorkflowProcess — Domain Model

> **Status:** A implementar
> **Módulo:** `src/Modules/WorkflowProcess/` > **Padrão:** Event-Driven, DDD, CQRS — mesma estrutura dos demais módulos

---

## Visão Geral

`WorkflowProcess` representa a **execução concreta de um processo** baseado em um `WorkflowTemplate`. Quando um escritório de contabilidade abre um processo (Abertura de Empresa, Alteração, Baixa), uma instância de `WorkflowProcess` é criada a partir do template correspondente. O aggregate acompanha o estado do processo, qual etapa está ativa e armazena os valores preenchidos em cada step e task.

**Dependências externas:**

- `Accountancy` — o processo pertence a um escritório (`AccountancyId`)
- `WorkflowTemplate` — o processo segue a estrutura de um template (`TemplateId`)

---

## Aggregate Root

### `WorkflowProcess`

| Campo           | Tipo                        | Descrição                                     |
| --------------- | --------------------------- | --------------------------------------------- |
| `Id`            | `Guid`                      | Identificador único                           |
| `ProcessNumber` | `string`                    | Número de controle do processo                |
| `ProcessType`   | `ProcessType`               | Tipo do processo (Abertura, Alteração, Baixa) |
| `Status`        | `ProcessStatus`             | Estado atual do processo                      |
| `Notes`         | `string?`                   | Observações livres                            |
| `ExpiresAt`     | `DateTimeOffset?`           | Prazo de vencimento                           |
| `StartedAt`     | `DateTimeOffset?`           | Quando o processo foi iniciado                |
| `CompletedAt`   | `DateTimeOffset?`           | Quando o processo foi concluído               |
| `AccountancyId` | `Guid`                      | Referência ao escritório responsável          |
| `TemplateId`    | `Guid`                      | Referência ao template utilizado              |
| `CurrentStepId` | `Guid?`                     | Step atualmente em execução                   |
| `Steps`         | `List<ProcessStepInstance>` | Instâncias dos steps com dados preenchidos    |

---

## Entidades Filhas

### `ProcessStepInstance`

Representa a execução de um step do template. Armazena os valores preenchidos nos campos e as instâncias das tasks daquele step.

| Campo         | Tipo                          | Descrição                                      |
| ------------- | ----------------------------- | ---------------------------------------------- |
| `Id`          | `Guid`                        | Identificador único                            |
| `StepId`      | `Guid`                        | Referência ao `WorkflowTemplateStep` de origem |
| `FieldValues` | `List<ProcessStepFieldValue>` | Valores preenchidos nos campos do step         |
| `Tasks`       | `List<ProcessTaskInstance>`   | Instâncias das tasks do step                   |

---

### `ProcessStepFieldValue`

Valor preenchido em um campo de um step.

| Campo     | Tipo     | Descrição                                   |
| --------- | -------- | ------------------------------------------- |
| `Id`      | `Guid`   | Identificador único                         |
| `FieldId` | `Guid`   | Referência ao `TemplateStepField` de origem |
| `Value`   | `string` | Valor serializado como string               |

---

### `ProcessTaskInstance`

Representa a execução de uma task dentro de um step. Armazena os valores preenchidos nos campos da task.

| Campo         | Tipo                          | Descrição                                          |
| ------------- | ----------------------------- | -------------------------------------------------- |
| `Id`          | `Guid`                        | Identificador único                                |
| `TaskId`      | `Guid`                        | Referência ao `WorkflowTemplateStepTask` de origem |
| `FieldValues` | `List<ProcessTaskFieldValue>` | Valores preenchidos nos campos da task             |

---

### `ProcessTaskFieldValue`

Valor preenchido em um campo de uma task.

| Campo     | Tipo     | Descrição                                       |
| --------- | -------- | ----------------------------------------------- |
| `Id`      | `Guid`   | Identificador único                             |
| `FieldId` | `Guid`   | Referência ao `TemplateStepTaskField` de origem |
| `Value`   | `string` | Valor serializado como string                   |

---

## Enumerações

### `ProcessType`

Define o tipo de processo jurídico/contábil.

| Valor       | Descrição                       |
| ----------- | ------------------------------- |
| `Abertura`  | Abertura de empresa             |
| `Alteracao` | Alteração contratual            |
| `Baixa`     | Encerramento / baixa da empresa |

### `ProcessStatus`

Ciclo de vida do processo.

| Valor        | Descrição                          |
| ------------ | ---------------------------------- |
| `Initiated`  | Processo criado, aguardando início |
| `InProgress` | Processo em andamento              |
| `Completed`  | Processo concluído com sucesso     |
| `Cancelled`  | Processo cancelado                 |

---

## Hierarquia de Composição

```
WorkflowProcess (AggregateRoot)
└── Steps: List<ProcessStepInstance>
    ├── FieldValues: List<ProcessStepFieldValue>
    └── Tasks: List<ProcessTaskInstance>
        └── FieldValues: List<ProcessTaskFieldValue>
```

---

## Domain Events Esperados

Seguindo o padrão do módulo `WorkflowTemplate`, os eventos de domínio devem ser definidos em `WorkflowProcess.Domain/Events/DomainEvents.cs`:

| Evento                         | Quando disparar                                             |
| ------------------------------ | ----------------------------------------------------------- |
| `WorkflowProcessCreated`       | Ao criar um novo processo                                   |
| `WorkflowProcessStarted`       | Ao iniciar a execução (`StartedAt` preenchido)              |
| `WorkflowProcessStepAdvanced`  | Ao avançar para o próximo step (`CurrentStepId` atualizado) |
| `WorkflowProcessCompleted`     | Ao concluir o processo                                      |
| `WorkflowProcessCancelled`     | Ao cancelar o processo                                      |
| `ProcessStepFieldValueSet`     | Ao preencher o valor de um campo de step                    |
| `ProcessTaskInstanceCompleted` | Ao concluir uma task                                        |

---

## Notas de Implementação

**Criação do processo:** ao criar um `WorkflowProcess`, instanciar automaticamente os `ProcessStepInstance` para todos os steps do template referenciado, e dentro de cada um os `ProcessTaskInstance` correspondentes às tasks. Os `FieldValue`s ficam vazios até serem preenchidos pelo usuário.

**`CurrentStepId`:** aponta para o `ProcessStepInstance.Id` do step ativo (não diretamente o `WorkflowTemplateStep.Id`). O aggregate deve controlar a lógica de avanço de step.

**`Value` como `string`:** o campo `Value` em `ProcessStepFieldValue` e `ProcessTaskFieldValue` é serializado como string independente do `FieldType` (Text, Boolean, Integer, Select, Date). A deserialização/validação é de responsabilidade da Application layer.

**Referências cross-module:** `AccountancyId` e `TemplateId` são referências fracas (apenas `Guid`). Não há navegação direta entre módulos — a consistência é verificada na Application layer no momento da criação.
