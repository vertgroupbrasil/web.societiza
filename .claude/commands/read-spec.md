# read-spec

Busca e lê a spec de uma feature do repositório `product.societiza` no GitHub.

## Uso

```
/read-spec [nome-da-feature]
```

Exemplos:
- `/read-spec abertura-de-empresa`
- `/read-spec portal-cliente`
- `/read-spec societario-workflow-process`

---

## Execução

O argumento recebido é `$ARGUMENTS` (o nome da feature/spec — deve corresponder ao nome do diretório dentro de `specs/`).

### Passo 1 — Descobrir specs disponíveis

Usar o MCP GitHub tool para listar os diretórios disponíveis:

```
mcp__github__get_file_contents(
  owner="vertgroupbrasil",
  repo="product.societiza",
  path="specs"
)
```

Isso retorna os diretórios de specs. Guardar a lista para uso no Passo 4 (caso a spec não seja encontrada).

### Passo 2 — Buscar spec.md

```
mcp__github__get_file_contents(
  owner="vertgroupbrasil",
  repo="product.societiza",
  path="specs/$ARGUMENTS/spec.md"
)
```

Se retornar erro 404 ou "Not Found": ir para o Passo 5 (spec não encontrada).

Se encontrar: ler o conteúdo completo (o MCP tool retorna o conteúdo já decodificado).

### Passo 3 — Validar status da spec

Ler o frontmatter do arquivo `spec.md`. Procurar pelo campo `status`:

```yaml
---
status: approved
---
```

**Regras de validação:**
- `status: approved` → prosseguir normalmente
- `status: draft` → **BLOQUEAR** com mensagem:
  > "⛔ Spec `$ARGUMENTS` está em status `draft`. Specs em rascunho não podem ser implementadas. Aprovar a spec no repositório `product.societiza` antes de prosseguir."
- Campo `status` ausente → **AVISAR** e perguntar ao usuário se deseja continuar:
  > "⚠️ Spec `$ARGUMENTS` não tem campo `status` no frontmatter. Recomendado: adicionar `status: approved` no product.societiza. Deseja prosseguir mesmo assim?"
- Qualquer outro valor → tratar como `draft` e bloquear

### Passo 4 — Buscar logic.md (opcional, mas importante)

```
mcp__github__get_file_contents(
  owner="vertgroupbrasil",
  repo="product.societiza",
  path="specs/$ARGUMENTS/logic.md"
)
```

- Se existir com `status: approved`: ler o conteúdo completo → sinalizar **logic.md disponível**
- Se existir com `status: draft`: ignorar (tratar como não existente)
- Se não existir (404): sinalizar **logic.md ausente**

### Passo 5 — Verificar documentação de integração local

Verificar se existe arquivo de integração no repositório local:

```
Verificar: docs/integration/$ARGUMENTS.md
```

- Se existir: ler o conteúdo → sinalizar **doc de integração disponível**
- Se não existir: sinalizar **doc de integração ausente**

### Passo 6 — Spec não encontrada

Se `specs/$ARGUMENTS/spec.md` não existir no repositório, listar specs disponíveis e informar:

> "Não encontrei a spec `$ARGUMENTS` no repositório product.societiza.
>
> Specs disponíveis:
> [lista dos diretórios em specs/]
>
> Qual delas é a que você quer usar? Ou descreva a feature diretamente e implementarei a partir da descrição."

### Passo 7 — Detectar e reportar o modo de implementação

Com base nos sinais dos passos anteriores, determinar o modo:

#### MODO: FULL
**Condição**: spec.md aprovada + (logic.md aprovado OU doc de integração local existente)

```
╔══════════════════════════════════════════════════╗
║  MODO: FULL                                      ║
║  ✅ spec.md aprovada                             ║
║  ✅ logic.md disponível [ou doc de integração]   ║
║                                                  ║
║  → Implementação completa (Tasks 1-12 em ordem)  ║
║  → Classificar endpoints: READY / PARTIAL / MISSING ║
╚══════════════════════════════════════════════════╝
```

#### MODO: VISUAL-FIRST
**Condição**: spec.md aprovada + sem logic.md + sem doc de integração local

```
╔══════════════════════════════════════════════════╗
║  MODO: VISUAL-FIRST                              ║
║  ✅ spec.md aprovada                             ║
║  ⚪ logic.md ausente                             ║
║  ⚪ doc de integração ausente                    ║
║                                                  ║
║  → Arquitetura visual primeiro                   ║
║  → Schemas Zod PROPOSTOS (inferidos da spec)     ║
║  → Feature navegável com mock data               ║
║  → Gerar docs/integration/[feature].md           ║
╚══════════════════════════════════════════════════╝
```

### Passo 8 — Outputar para o contexto do agente

Após detectar o modo:

1. Exibir o conteúdo completo da `spec.md`
2. Se `logic.md` disponível: exibir também
3. Se doc de integração local: exibir também
4. Exibir claramente o **MODO** detectado (FULL ou VISUAL-FIRST)
5. Sinalizar que a spec está carregada e o agente pode prosseguir para Phase 2

---

## Notas técnicas

- O MCP tool `mcp__github__get_file_contents` retorna o conteúdo já decodificado (sem necessidade de `base64 -d`)
- Se o MCP GitHub tool não estiver disponível no contexto, **não usar** `gh` CLI como fallback sem informar o usuário — informar que a ferramenta de integração GitHub não está disponível e solicitar que o usuário cole o conteúdo da spec manualmente
- O repositório `vertgroupbrasil/product.societiza` pode ser privado — se o MCP tool retornar erro de autenticação, informar ao usuário
