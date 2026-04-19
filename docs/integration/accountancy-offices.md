# Integration Contract — accountancy-offices

> **Status:** PROPOSED — Frontend propõe este contrato. Backend ainda não implementado.
> **Gerado em:** 2026-04-19
> **Feature branch:** `feat/accountancy-offices`
> **Mock flag:** `src/features/accountancy-offices/server/services/office.service.ts` → `USE_MOCK = true`

---

## Visão geral

O módulo `accountancy-offices` introduz o conceito de **Escritório** como workspace do contador.
Cada usuário pode pertencer a múltiplos escritórios (como membro ou owner), ter um escritório ativo por sessão, e trocar de escritório através do `OfficeSwitcher` na sidebar.

---

## Schemas (fonte de verdade do frontend)

```ts
// OfficePlan
'Free' | 'Escrivaninha' | 'Executivo'

// OfficeStatus
'Active' | 'Frozen'

// MemberRole
'Owner' | 'Member'

// Office
{
  id: string
  cnpj: string
  legalName: string
  tradeName: string | null
  address: string
  city: string
  state: string           // sigla ex: 'SP'
  postalCode: string
  phone: string | null
  email: string | null
  profilePhotoUrl: string | null
  bannerUrl: string | null
  plan: OfficePlan
  status: OfficeStatus
  processCount: number
  memberCount: number
  isOwner: boolean        // true se o usuário autenticado é owner
  createdAt: string       // ISO 8601
  updatedAt: string       // ISO 8601
}

// Member
{
  id: string
  name: string
  email: string
  role: MemberRole
  avatarUrl: string | null
  joinedAt: string        // ISO 8601
}

// InviteLink
{
  token: string
  url: string             // URL completa para o frontend de convite
  officeId: string
  createdAt: string       // ISO 8601
}
```

---

## Endpoints propostos

### GET `/offices`

Lista todos os escritórios do usuário autenticado (como owner ou membro).

**Response 200:**
```json
[
  {
    "id": "office-001",
    "cnpj": "12.345.678/0001-99",
    "legalName": "Contábil Lima e Associados LTDA",
    "tradeName": "Contábil Lima",
    "address": "Rua das Flores, 456, Sala 302",
    "city": "São Paulo",
    "state": "SP",
    "postalCode": "01310-100",
    "phone": "(11) 3344-5566",
    "email": "contato@contabil-lima.com.br",
    "profilePhotoUrl": null,
    "bannerUrl": null,
    "plan": "Escrivaninha",
    "status": "Active",
    "processCount": 12,
    "memberCount": 3,
    "isOwner": true,
    "createdAt": "2025-01-10T00:00:00Z",
    "updatedAt": "2026-03-15T00:00:00Z"
  }
]
```

---

### POST `/offices`

Cria novo escritório. O usuário autenticado se torna owner automaticamente.

**Request body:**
```json
{
  "cnpj": "12.345.678/0001-99",
  "legalName": "Contábil Lima e Associados LTDA",
  "tradeName": "Contábil Lima",
  "address": "Rua das Flores, 456, Sala 302",
  "city": "São Paulo",
  "state": "SP",
  "postalCode": "01310-100",
  "phone": "(11) 3344-5566",
  "email": "contato@contabil-lima.com.br"
}
```

**Response 201:** Office criado (mesmo shape do GET).

**Regras de negócio:**
- `Free` permite 1 escritório como owner. Retornar `403` se já tiver atingido o limite.
- `Escrivaninha` permite 1 escritório como owner.
- `Executivo` permite até 3 escritórios como owner.

---

### GET `/offices/{id}`

Retorna dados de um escritório específico.

**Response 200:** Office (mesmo shape do GET `/offices`)
**Response 404:** Se o escritório não existir ou o usuário não tiver acesso.

---

### PUT `/offices/{id}`

Atualiza dados do escritório. Apenas o owner pode atualizar.

**Request body:** Todos os campos do `createOfficeDto` (todos opcionais no update).

**Response 200:** Office atualizado.
**Response 403:** Se não for owner.

---

### DELETE `/offices/{id}`

Remove o escritório. Apenas o owner pode remover.

**Response 204:** Sem body.
**Response 403:** Se não for owner.

---

### PUT `/offices/active`

Define o escritório ativo para a sessão do usuário autenticado.

**Request body:**
```json
{ "officeId": "office-001" }
```

**Response 200:**
```json
{ "activeOfficeId": "office-001" }
```

**Regras de negócio:**
- O usuário deve ser membro (ou owner) do escritório informado.

---

### GET `/offices/{id}/members`

Lista os membros do escritório.

**Response 200:**
```json
[
  {
    "id": "member-001",
    "name": "Carlos Henrique Lima",
    "email": "carlos@contabil-lima.com.br",
    "role": "Owner",
    "avatarUrl": null,
    "joinedAt": "2025-01-10T00:00:00Z"
  }
]
```

---

### DELETE `/offices/{id}/members/{memberId}`

Remove um membro do escritório. Apenas o owner pode remover. Owner não pode se remover.

**Response 204:** Sem body.
**Response 403:** Se não for owner, ou se tentar remover o owner.

---

### POST `/offices/{id}/members/invite-email`

Convida um usuário por e-mail.

**Request body:**
```json
{ "email": "usuario@email.com" }
```

**Response 200:**
```json
{ "message": "Convite enviado com sucesso." }
```

**Regras de negócio:**
- Plano `Free` não permite convidar membros — retornar `403`.
- `Escrivaninha` permite até 3 membros total.
- `Executivo` permite até 8 membros total.

---

### POST `/offices/{id}/members/invite-link`

Gera ou retorna o link de convite ativo do escritório.

**Response 200:**
```json
{
  "token": "inv_abc123xyz789",
  "url": "https://app.societiza.com.br/convite/inv_abc123xyz789",
  "officeId": "office-001",
  "createdAt": "2026-04-10T00:00:00Z"
}
```

**Regras de negócio:**
- Plano `Free` não tem acesso a invite link — retornar `403`.

---

### PUT `/offices/{id}/ownership`

Transfere a propriedade do escritório para outro membro.

**Request body:**
```json
{ "newOwnerId": "member-002" }
```

**Response 200:** Office atualizado com novo owner.

**Regras de negócio:**
- Apenas o owner atual pode transferir ownership.
- O `newOwnerId` deve ser membro ativo do escritório.
- Após a transferência, o usuário anterior vira `Member`.

---

## Limites por plano

| Plano | Processos | Membros | Escritórios owned | Escritórios total |
|-------|-----------|---------|-------------------|-------------------|
| Free | 5 | 1 | 1 | 2 |
| Escrivaninha | 50 | 3 | 1 | 3 |
| Executivo | 200 | 8 | 3 | 5 |

---

## Lógica de Freeze

Um escritório com `status: "Frozen"` ocorre quando o usuário faz downgrade e ultrapassa os limites do novo plano. Neste estado:
- Processos existentes ficam em modo **somente leitura**
- Novos membros não podem ser convidados
- Novos processos não podem ser criados
- O owner pode **reativar** fazendo upgrade do plano

O frontend renderiza `FrozenOfficeBanner` quando `office.status === 'Frozen'`.

---

## Integração no frontend

Quando o backend estiver disponível, apenas as seguintes mudanças são necessárias:

1. **`src/features/accountancy-offices/server/services/office.service.ts`**
   - Mudar `USE_MOCK = true` para `USE_MOCK = false`
   - Verificar se os shapes de resposta batem com os schemas Zod — ajustar se necessário

2. **`src/features/accountancy-offices/schemas/office.schema.ts`**
   - Ajustar campos se o backend retornar nomes diferentes (ex: `legal_name` vs `legalName`)

3. **Todo o resto permanece intacto** — componentes, hooks, queries, mutations, páginas.

---

## Autenticação

Todos os endpoints assumem autenticação via Bearer token (mesmo padrão do `/accounts/token/`).
O usuário "autenticado" é inferido do token — nunca passar `userId` na URL ou body.
