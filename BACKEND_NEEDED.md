# BACKEND_NEEDED — Contratos de API pendentes

Este arquivo documenta os endpoints que o frontend precisa para integração plena.
Criado pelo frontend em modo **VISUAL-FIRST** — os contratos abaixo são propostos pelo frontend
com base na spec do produto. O backend deve implementar seguindo esses contratos para garantir
zero retrabalho na integração.

---

## accountancy-offices — Escritórios e Planos

Spec de referência: `product.societiza/specs/accountancy-offices/spec.md`
Feature local: `src/features/accountancy-offices/`
Doc de integração completa: `docs/integration/accountancy-offices.md` (gerado ao final da feature)

---

### GET /offices
Lista todos os escritórios do usuário autenticado (próprios + externos que é membro).

**Response esperada:**
```json
[
  {
    "id": "uuid",
    "cnpj": "12.345.678/0001-99",
    "legalName": "Contábil Lima e Associados LTDA",
    "tradeName": "Contábil Lima",
    "address": "Rua das Flores, 456",
    "city": "São Paulo",
    "state": "SP",
    "postalCode": "01310-100",
    "phone": "(11) 3344-5566",
    "email": "contato@exemplo.com.br",
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

**Regras:**
- Retorna escritórios onde o usuário é Owner OU Member
- `plan`: `"Free"` | `"Escrivaninha"` | `"Executivo"`
- `status`: `"Active"` | `"Frozen"`
- `isOwner`: true se o usuário autenticado é o Owner do escritório

---

### POST /offices
Cria um novo escritório para o usuário autenticado.

**Payload:**
```json
{
  "cnpj": "12.345.678/0001-99",
  "legalName": "Razão Social LTDA",
  "tradeName": "Nome Fantasia",
  "address": "Rua X, 123",
  "city": "São Paulo",
  "state": "SP",
  "postalCode": "01310-100",
  "phone": "(11) 99999-8888",
  "email": "contato@exemplo.com.br"
}
```

**Response:**
```json
{ "id": "uuid" }
```

**Regras:**
- O usuário criador se torna Owner automaticamente
- O escritório começa com plano `Free`
- Se o usuário já atingiu o limite de escritórios próprios do seu plano: retornar 422

---

### GET /offices/{id}
Retorna um escritório específico.

**Regras:** O usuário deve ser Owner ou Member do escritório.

---

### PUT /offices/{id}
Atualiza os dados de identidade do escritório (nome, CNPJ, endereço, etc.).

**Payload:** mesmo shape de POST /offices
**Regras:** Apenas o Owner pode atualizar.

---

### DELETE /offices/{id}
Deleta o escritório permanentemente.

**Regras:**
- Apenas o Owner pode deletar
- Escritório deve não ter outros membros (ou transferir ownership primeiro)
- O usuário não pode ficar sem nenhum escritório

---

### GET /offices/{id}/members
Lista membros do escritório.

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "Ana Paula Ferreira",
    "email": "ana@exemplo.com",
    "role": "Member",
    "avatarUrl": null,
    "joinedAt": "2025-03-22T00:00:00Z"
  }
]
```

---

### POST /offices/{id}/members/invite-email
Convida um membro por e-mail.

**Payload:**
```json
{ "email": "novo@membro.com" }
```

**Regras:**
- Disponível apenas para planos Escrivaninha e Executivo
- Limite de membros por plano deve ser respeitado
- E-mail de convite enviado via Brevo

---

### POST /offices/{id}/members/invite-link
Gera (ou retorna existente) link de convite para o escritório.

**Response:**
```json
{
  "token": "inv_abc123",
  "url": "https://app.societiza.com.br/convite/inv_abc123",
  "officeId": "uuid",
  "createdAt": "2026-04-10T00:00:00Z"
}
```

**Regras:** Apenas Escrivaninha e Executivo.

---

### DELETE /offices/{id}/members/{memberId}
Remove um membro do escritório.

**Regras:**
- Apenas Owner pode remover membros
- Owner não pode remover a si mesmo

---

### PUT /offices/{id}/ownership
Transfere ownership para outro membro.

**Payload:**
```json
{ "memberId": "uuid-do-novo-owner" }
```

**Regras:**
- O memberId deve ser membro atual do escritório
- Após transferência, o owner anterior vira Member
- O novo owner herda a responsabilidade do plano do escritório

---

### PUT /offices/active
Define qual escritório está ativo para o usuário autenticado (org switcher).

**Payload:**
```json
{ "officeId": "uuid" }
```

**Regras:** O usuário deve ser Owner ou Member do escritório informado.

---

*Gerado em: 2026-04-19 | Feature: accountancy-offices | Modo: VISUAL-FIRST*
