# Princípios de UX — Societiza Frontend

## Objetivo

Este documento define os princípios de UX que todo componente, tela e feature deve respeitar. Eles não são opcionais — são parte do contrato de entrega.

---

## 1. Estados assíncronos

Toda operação assíncrona precisa de três estados tratados explicitamente:

### Loading

- **Skeleton é sempre preferido** a spinner quando o layout do conteúdo é previsível
- Spinner é aceitável para ações pontuais (botão de submit, ação específica)
- Nada é inaceitável — nunca deixar a tela em branco ou congelada enquanto carrega
- Skeleton deve ter a mesma estrutura dimensional do conteúdo real (não um retângulo genérico)

```tsx
// Correto — skeleton com estrutura real
export function WorkflowListSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-16 w-full rounded-lg" />
      ))}
    </div>
  );
}
```

### Error

- Toda mensagem de erro da API deve ser traduzida para português amigável
- Nunca mostrar chave técnica de erro, código de status, ou stack trace para o usuário
- Sempre oferecer uma ação de recuperação quando possível (botão "Tentar novamente", link "Voltar")
- Se o erro for de permissão (401/403): redirecionar ou explicar claramente que acesso não é permitido

```tsx
// Correto — erro amigável com ação de recuperação
export function WorkflowErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center gap-4 py-12">
      <p className="text-muted-foreground">
        Não foi possível carregar os processos.
      </p>
      <Button variant="outline" onClick={onRetry}>
        Tentar novamente
      </Button>
    </div>
  );
}
```

### Empty

- Todo estado vazio deve ter mensagem útil em português
- Quando fizer sentido, incluir CTA para a ação principal (ex: "Criar primeiro processo")
- Empty state não deve ser genérico — deve ser específico para o contexto
- Never mostrar empty state enquanto ainda está carregando (distinguir loading de vazio)

```tsx
// Correto — empty state específico com CTA
export function WorkflowEmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="flex flex-col items-center gap-4 py-12">
      <p className="text-muted-foreground">
        Nenhum processo encontrado para este cliente.
      </p>
      <Button onClick={onCreate}>Criar primeiro processo</Button>
    </div>
  );
}
```

---

## 2. Formulários

### Validação

- **Validar no submit por padrão** (`mode: 'onSubmit'` no `useForm`)
- Validar no blur apenas para campos que se beneficiam de feedback em tempo real:
  - CPF/CNPJ (quando tem máscara e validação de dígito verificador)
  - Email (quando há verificação de disponibilidade)
  - Senhas (quando há confirmação de senha)
- Nunca validar on keystroke para campos simples — gera UX ansiosa

### Mensagens de erro de formulário

- Em português
- Específicas ao campo: "CNPJ inválido" em vez de "Campo inválido"
- Posicionadas abaixo do campo com `<FormMessage />`
- Nunca usar alert/modal para erro de validação de campo

### Submit

- Botão de submit deve mostrar estado de loading enquanto a mutation está pendente:
  ```tsx
  <Button type="submit" disabled={isPending}>
    {isPending ? 'Salvando...' : 'Salvar'}
  </Button>
  ```
- Botão deve ser desabilitado durante `isPending` — nunca permitir double submit
- Após sucesso: resetar o form, fechar o dialog, e mostrar toast

---

## 3. Feedback de mutations

Toda ação de escrita precisa de feedback imediato ao usuário:

### Atualização otimista (preferida quando previsível)

Usar quando:
- O resultado da ação é determinístico e previsível
- A latência é perceptível e degrada a experiência
- Há rollback possível e implementado

```ts
onMutate: async (variables) => {
  await queryClient.cancelQueries({ queryKey: entityQueryKeys.detail(id) });
  const previous = queryClient.getQueryData(entityQueryKeys.detail(id));
  queryClient.setQueryData(entityQueryKeys.detail(id), (old) => ({
    ...old,
    ...optimisticUpdate,
  }));
  return { previous };
},
onError: (_err, _variables, context) => {
  if (context?.previous) {
    queryClient.setQueryData(entityQueryKeys.detail(id), context.previous);
  }
  toast.error('Erro ao atualizar. Alterações desfeitas.');
},
```

### Loading no botão (alternativa)

Quando atualização otimista não for apropriada: mostrar loader no botão ou na área de ação.

### Toasts

- **Sempre: sucesso E erro** — nunca só um
- Toast de sucesso: mensagem positiva específica ("Template publicado com sucesso.")
- Toast de erro: mensagem amigável específica ("Não foi possível publicar o template.")
- Nunca mostrar mensagem técnica de erro no toast
- Usar `sonner` — sempre
- Posicionamento: topo-direito (configurado globalmente no `<Toaster />`)

---

## 4. Navegação

### Nunca deixar o usuário preso

- Toda tela deve ter um caminho de volta (breadcrumb, botão Voltar, ou link)
- Toda dialog/sheet deve ter botão de fechar explícito (X ou botão "Cancelar")
- Toda ação destrutiva deve ter confirmação com caminho de cancelar

### Ações destrutivas

Obrigatório para: delete, archive, desativar, cancelar processo irreversível.

```tsx
// Correto — dialog de confirmação com texto específico
<AlertDialog>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Excluir template?</AlertDialogTitle>
      <AlertDialogDescription>
        Esta ação não pode ser desfeita. O template será removido permanentemente.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancelar</AlertDialogCancel>
      <AlertDialogAction onClick={handleDelete} className="bg-destructive">
        Confirmar exclusão
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

**Proibido**: usar `window.confirm()`, `window.alert()`, ou `window.prompt()` em qualquer parte do produto.

### Após mutations

- Após criação bem-sucedida: redirecionar para o detalhe OU fechar dialog e refreshar lista
- Após exclusão: redirecionar para a lista OU fechar dialog e remover da lista
- Após edição: fechar dialog e mostrar dados atualizados

---

## 5. Acessibilidade

### Elementos interativos

Todo elemento interativo deve ter nome acessível:

```tsx
// Correto — aria-label quando sem texto visível
<Button aria-label="Excluir template" onClick={handleDelete}>
  <Trash2 className="h-4 w-4" />
</Button>

// Correto — texto visível é suficiente
<Button onClick={handleDelete}>
  Excluir template
</Button>
```

### Formulários

- `<label>` associado a cada input (via `htmlFor` ou wrapper `<FormItem>`)
- Nunca usar placeholder como substituto do label
- Mensagens de erro associadas ao campo via `aria-describedby` (o `<FormMessage />` do shadcn/ui faz isso automaticamente)

### Foco

- Após abrir dialog ou sheet: o foco deve ir para o primeiro elemento focável
- Após fechar: o foco deve retornar ao elemento que abriu
- Trap de foco dentro de modais (shadcn/ui Radix handles this)

---

## 6. Responsividade

Toda feature deve funcionar em:
- Mobile: mínimo 375px de largura
- Desktop: desde 1024px

### Abordagem

- Mobile-first: começar com o layout mobile e expandir para desktop
- Usar classes Tailwind responsivas: `sm:`, `md:`, `lg:`, `xl:`
- Tabelas que não cabem em mobile: considerar layout alternativo (cards empilhados)
- Dialogs em mobile: verificar se não ultrapassa a viewport em telas pequenas

### Elementos críticos em mobile

- Botões: mínimo 44x44px de área de toque (Tailwind: `min-h-11 min-w-11`)
- Inputs: nunca menores que a fonte base (evitar zoom automático do iOS)
- Scroll: garantir que listas longas são scrolláveis, não cortadas

---

## 7. Toasts — Configuração e uso

### Biblioteca

Sempre `sonner`. Nunca `react-toastify`, `react-hot-toast`, ou custom toast.

### Posicionamento

```tsx
// Configuração global no layout raiz
<Toaster position="top-right" />
```

### Uso correto

```ts
import { toast } from 'sonner';

// Sucesso
toast.success('Contabilidade criada com sucesso.');

// Erro
toast.error('Não foi possível criar a contabilidade. Tente novamente.');

// Informação (usar com moderação)
toast.info('Sincronização em andamento...');
```

### Mensagens

- Curtas (máximo 2 linhas)
- Em português
- Específicas ao contexto — nunca genéricas
- Sem jargão técnico ("500 Internal Server Error" nunca aparece para o usuário)

---

## Resumo operacional

- Todo async: loading + error + empty tratados explicitamente
- Skeleton preferido ao spinner para loading de conteúdo
- Erros da API: sempre mensagem amigável em português
- Forms: validar no submit por padrão, blur para campos com feedback em tempo real
- Mutations: feedback imediato (otimista ou loader no botão)
- Toasts: sempre sucesso E erro, usando sonner, posição topo-direito
- Ações destrutivas: sempre dialog de confirmação com `AlertDialog`
- Nunca: `window.confirm()`, `window.alert()`, placeholder como label
- Acessibilidade: nome acessível em todos os interativos
- Responsivo: funciona em 375px e em 1024px+
