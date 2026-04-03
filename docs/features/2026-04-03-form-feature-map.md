# Feature Map - Form

## Objetivo

A feature `form` sustenta o fluxo de preenchimento de formulário societário,
incluindo dados da empresa, sócios, revisão, persistência local e integração
com consulta de CEP.

É uma das features mais ricas do frontend e opera quase como um pequeno produto
autônomo dentro do produto principal.

## Superfície funcional

Áreas visuais principais:

- [FormRenderer.tsx](/Users/henilveira/Documents/societiza/web.societiza/src/features/form/components/FormRenderer.tsx)
- [company-form.tsx](/Users/henilveira/Documents/societiza/web.societiza/src/features/form/components/forms/company-form.tsx)
- [partners-form.tsx](/Users/henilveira/Documents/societiza/web.societiza/src/features/form/components/forms/partners-form.tsx)
- [review-form.tsx](/Users/henilveira/Documents/societiza/web.societiza/src/features/form/components/forms/review-form.tsx)
- [form-viewer.tsx](/Users/henilveira/Documents/societiza/web.societiza/src/features/form/components/forms/form-viewer.tsx)
- [FinishedForm.tsx](/Users/henilveira/Documents/societiza/web.societiza/src/features/form/components/FinishedForm.tsx)

## Microserviços internos da feature

### 1. Microserviço de contrato e schemas

Arquivos principais:

- [form.schema.ts](/Users/henilveira/Documents/societiza/web.societiza/src/features/form/lib/schemas/form.schema.ts)
- [company.schema.ts](/Users/henilveira/Documents/societiza/web.societiza/src/features/form/lib/schemas/company.schema.ts)
- [partner.schema.ts](/Users/henilveira/Documents/societiza/web.societiza/src/features/form/lib/schemas/partner.schema.ts)
- [address.schema.ts](/Users/henilveira/Documents/societiza/web.societiza/src/features/form/lib/schemas/address.schema.ts)
- [viacep.schema.ts](/Users/henilveira/Documents/societiza/web.societiza/src/features/form/lib/schemas/viacep.schema.ts)
- [form.types.ts](/Users/henilveira/Documents/societiza/web.societiza/src/features/form/lib/types/form.types.ts)

Responsabilidade:

- definir o shape completo do formulário;
- inferir os tipos usados por components, hooks e services;
- separar empresa, sócios, endereço e resposta da API.

### 2. Microserviço de integração com backend corporativo

Arquivo:

- [form.service.ts](/Users/henilveira/Documents/societiza/web.societiza/src/features/form/services/form.service.ts)

Responsabilidade:

- criar formulário de abertura;
- criar parceiros/sócios;
- buscar formulário por id.

Observação importante:

- a feature usa endpoints montados sob `API_ENDPOINTS.corporate`, mas esses
  endpoints estão atualmente apontando para a API de `workflowTemplate`. Isso
  revela uma ponte entre fluxos legados e a nova API.

### 3. Microserviço externo de CEP

Arquivo:

- [viacep.service.ts](/Users/henilveira/Documents/societiza/web.societiza/src/features/form/services/viacep.service.ts)

Responsabilidade:

- consultar `https://viacep.com.br/ws/{cep}/json/`;
- devolver endereço estruturado para preenchimento assistido.

### 4. Microserviço de leitura e status do formulário

Arquivos:

- [query-options.ts](/Users/henilveira/Documents/societiza/web.societiza/src/features/form/hooks/queries/query-options.ts)
- [useFormQueries.ts](/Users/henilveira/Documents/societiza/web.societiza/src/features/form/hooks/queries/useFormQueries.ts)

Responsabilidade:

- buscar formulário por id;
- derivar estado resumido de conclusão;
- buscar CEP sob demanda;
- configurar stale time e retry.

Subserviço derivado:

- `getStatus` funciona como um microserviço interno de status agregado, porque
  interpreta a resposta do formulário e transforma em flags de progresso.

### 5. Microserviço de escrita do formulário

Arquivo:

- [useFormMutations.ts](/Users/henilveira/Documents/societiza/web.societiza/src/features/form/hooks/mutations/useFormMutations.ts)

Responsabilidade:

- persistir dados de empresa;
- persistir dados de sócios;
- atualizar cache local da query;
- sincronizar contexto da feature com a resposta da API;
- emitir toasts de sucesso/erro.

### 6. Microserviço de orquestração de estado

Arquivo central:

- [FormProvider.tsx](/Users/henilveira/Documents/societiza/web.societiza/src/features/form/contexts/FormProvider.tsx)

Responsabilidade:

- manter estado do wizard;
- controlar passo atual;
- restaurar rascunho do `localStorage`;
- salvar automaticamente rascunho local;
- decidir se o usuário pode avançar entre etapas;
- transformar resposta da API no shape interno do formulário;
- guardar `createdFormId`;
- sincronizar URL com a etapa.

Este é o principal orquestrador da feature.

### 7. Microserviços de efeito e validação por etapa

Arquivos:

- [useOpeningForm.tsx](/Users/henilveira/Documents/societiza/web.societiza/src/features/form/hooks/forms/useOpeningForm.tsx)
- [useCompanyFormEffects.tsx](/Users/henilveira/Documents/societiza/web.societiza/src/features/form/hooks/forms/useCompanyFormEffects.tsx)
- [usePartnersFormEffects.tsx](/Users/henilveira/Documents/societiza/web.societiza/src/features/form/hooks/forms/usePartnersFormEffects.tsx)
- [useCompanyFormValidation.ts](/Users/henilveira/Documents/societiza/web.societiza/src/features/form/hooks/utils/validators/useCompanyFormValidation.ts)
- [usePartnersFormValidation.ts](/Users/henilveira/Documents/societiza/web.societiza/src/features/form/hooks/utils/validators/usePartnersFormValidation.ts)
- [useReviewFormValidation.ts](/Users/henilveira/Documents/societiza/web.societiza/src/features/form/hooks/utils/validators/useReviewFormValidation.ts)

Responsabilidade:

- conectar regras de formulário por etapa;
- aplicar validações contextuais;
- desacoplar comportamento específico de empresa, sócios e revisão.

### 8. Microserviços utilitários da jornada

Arquivos:

- [useCepLookup.ts](/Users/henilveira/Documents/societiza/web.societiza/src/features/form/hooks/utils/useCepLookup.ts)
- [useDebouncedAutoSave.ts](/Users/henilveira/Documents/societiza/web.societiza/src/features/form/hooks/utils/useDebouncedAutoSave.ts)
- [useFormNavigation.ts](/Users/henilveira/Documents/societiza/web.societiza/src/features/form/hooks/utils/useFormNavigation.ts)
- [useFormPersistance.ts](/Users/henilveira/Documents/societiza/web.societiza/src/features/form/hooks/utils/useFormPersistance.ts)
- [masks.utils.ts](/Users/henilveira/Documents/societiza/web.societiza/src/features/form/lib/utils/masks.utils.ts)
- [validations.utils.ts](/Users/henilveira/Documents/societiza/web.societiza/src/features/form/lib/utils/validations.utils.ts)

Responsabilidade:

- lookup de CEP;
- autosave com debounce;
- navegação entre passos;
- persistência local;
- máscaras e validações utilitárias.

## Fluxo de dados principal

1. `FormProvider` inicializa estado vazio e tenta restaurar rascunho local.
2. As telas usam hooks e schemas específicos da etapa atual.
3. O usuário preenche empresa, sócios e revisão.
4. `useFormMutations` persiste empresa ou sócios.
5. A resposta da API passa por `updateFromApiResponse`.
6. O provider normaliza a resposta e injeta no estado interno.
7. Queries derivadas podem ler status, form completo ou CEP.
8. O fluxo pode ser retomado pelo `localStorage`.

## Acoplamentos

- forte dependência de `FormProvider`;
- dependência externa do ViaCEP;
- dependência do catálogo global de endpoints;
- dependência de convenções legadas em `API_ENDPOINTS.corporate`;
- dependência de Sonner para feedback;
- dependência do roteamento App Router para navegação de steps.

## Pontos fortes

- feature altamente modular;
- boa separação entre esquema, integração, estado e UI;
- suporte a recuperação de estado;
- tratamento dedicado por etapa.

## Limitações e riscos

- a ponte `corporate -> workflowTemplate` nos endpoints indica dívida técnica;
- o provider concentra bastante responsabilidade;
- o parsing de resposta da API é complexo e sensível a contrato;
- o README existente está desatualizado e descreve a feature como se fosse
  `societario`, não `form`.
