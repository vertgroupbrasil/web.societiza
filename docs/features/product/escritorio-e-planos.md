# Escritório e Planos

> Documento de produto. Não contém decisões técnicas nem de implementação.
> Atualizado em 06/04/2026.

---

## 1. Visão da feature

Um Escritório é o espaço de trabalho de um escritório de contabilidade dentro da Societiza. Quando alguém cria uma conta na plataforma, o primeiro passo é criar — ou entrar em — um Escritório. É dentro dele que tudo acontece: os processos de abertura de empresa, os templates de workflow configurados pela equipe, os membros da contabilidade, e o plano de assinatura.

Cada Escritório tem uma identidade real: CNPJ, nome legal, nome fantasia, endereço, telefone, e-mail e foto de perfil. Não é um workspace genérico — é a representação digital do escritório de contabilidade que o contador já conhece no mundo físico.

Um usuário pode fazer parte de mais de um Escritório ao mesmo tempo — como acontece no Notion ou no Canva. Um contador que trabalha em dois escritórios diferentes usa a mesma conta e alterna entre os dois contextos. Ao trocar de Escritório, tudo o que ele vê muda: os processos são daquele escritório, os templates são daquele escritório, a equipe é daquele escritório. Os dados nunca se misturam.

O plano de assinatura pertence ao Escritório, não ao usuário individualmente. Quando o contador que administra um Escritório assina o plano Escrivaninha ou Executivo, é aquele Escritório que se torna premium — e todos os membros dentro dele passam a operar com as capacidades do plano pago, sem precisar pagar separadamente.

---

## 2. Problema que resolve

Hoje a Societiza não tem planos implementados. Qualquer conta criada tem acesso irrestrito a tudo, sem distinção entre quem paga e quem não paga. Isso torna o modelo comercial inviável: não há como limitar o uso gratuito, não há como cobrar pelo crescimento da equipe, e não há razão concreta para um escritório fazer upgrade.

Além disso, um contador não consegue fazer parte de mais de um escritório na mesma conta. Se ele atua em dois lugares, precisa criar contas separadas — perdendo a centralização que é a proposta central do produto.

Por fim, não havia um conceito de "Escritório" claro e gerenciável pelo próprio usuário. O único registro de uma contabilidade no sistema era uma entidade administrativa da Societiza, não algo que o contador criasse, configurasse e sentisse como seu.

---

## 3. Para quem é

- **AccountingAdmin**: o profissional que cria o Escritório na Societiza. É o responsável pelo espaço — gerencia membros, configurações e, quando aplicável, o plano de assinatura. Quem paga é quem criou.
- **Membros do Escritório**: contadores e colaboradores convidados pelo admin para operar dentro do Escritório. Se beneficiam do plano pago sem precisar assinar individualmente.
- **Contadores com múltiplos vínculos**: profissionais que atuam em mais de um escritório e precisam trocar de contexto dentro da mesma conta, sem gerenciar múltiplos acessos.

---

## 4. Como melhora a experiência atual

**Antes:**
- Criar conta = ter acesso total sem nenhuma configuração de contexto
- Um usuário = um único contexto de trabalho (e mesmo isso sem clareza)
- Sem planos, sem limites, sem razão para pagar
- Sem identidade real do escritório na plataforma

**Depois:**
- Criar conta → criar (ou entrar em) um Escritório com identidade real: CNPJ, nome, foto
- Trocar de Escritório em segundos — cada um com seus próprios processos, templates e equipe
- Plano free com limitações claras e visíveis → quando o escritório cresce, há uma razão concreta para fazer upgrade
- O AccountingAdmin gerencia equipe e plano em um único lugar

---

## 5. Os planos

### Grátis

Para contadores que estão começando ou querem experimentar a plataforma.

- O usuário pode **criar 1 Escritório** — esse Escritório é free (sem automações, sem membros extras)
- O usuário pode **entrar em 1 Escritório de outra pessoa** (premium ou free, tanto faz)
- Total de Escritórios acessíveis: **2**
- **5 processos ativos** no Escritório que ele criou
- **1 membro** no Escritório (só o próprio admin)
- **1 template de workflow ativo** por vez
- Sem automações de workflow
- Sem convite de membros
- Com foto de perfil e dados cadastrais do Escritório (CNPJ, nome, endereço, etc.)

### Escrivaninha

Para contadores que trabalham em equipe ou operam com mais volume.

- O usuário pode **criar 1 Escritório premium**
- O usuário pode **entrar em 2 outros Escritórios** (de qualquer plano)
- Total de Escritórios acessíveis: **3**
- **50 processos ativos** no Escritório que ele criou
- **3 membros** no Escritório (incluindo o admin)
- **Múltiplos templates de workflow ativos**
- Com automações de workflow
- Com convite de membros por e-mail e por link
- Cobrança mensal ou anual (anual com desconto)

### Executivo

Para contadores que gerenciam múltiplos escritórios ou operações de maior escala.

- O usuário pode **criar até 3 Escritórios premium**
- O usuário pode **entrar em quantos Escritórios quiser** (sem limite de entrada)
- **200 processos ativos** por Escritório que ele criou
- **8 membros** por Escritório (incluindo o admin)
- **Múltiplos templates de workflow ativos**
- Com automações de workflow
- Com convite de membros por e-mail e por link
- Cobrança mensal ou anual (anual com desconto)

---

## 6. Regras de negócio

### Premium é do usuário, herda para o Escritório
Quando um usuário paga um plano, os Escritórios que ele cria se tornam premium. Os membros desses Escritórios se beneficiam das capacidades do plano pago sem precisar pagar individualmente. Se o usuário deixar de pagar, o Escritório cai para o plano free.

### Limite de processos é por Escritório criado
O limite de processos ativos (5, 50, 200) é por Escritório que o usuário administra — não é uma cota total entre todos os Escritórios.

### Downgrade = freeze
Quando um Escritório cai de plano (por cancelamento, inadimplência ou downgrade manual), os dados existentes ficam intactos. Nenhum processo é deletado, nenhum membro é removido automaticamente. O que muda é que não é possível criar novos processos nem convidar novos membros até que o uso esteja dentro dos limites do novo plano.

### Transferência de adminship
Se o admin de um Escritório excluir a conta, a administração do Escritório passa automaticamente para o membro mais antigo da equipe. Sem o pagador original, o Escritório cai para o plano free e entra em estado de freeze — mais processos e membros do que o plano free permite, mas sem que os dados sejam perdidos. O novo admin pode fazer upgrade para restaurar o plano premium.

### Troca de Escritório
Ao trocar de Escritório, o usuário vê apenas os dados daquele Escritório: seus processos, seus templates, seus membros. Não há cruzamento de dados entre Escritórios diferentes.

### Programa de indicação
Se um usuário indicar 3 pessoas que assinarem qualquer plano pago, ele ganha 1 mês grátis do plano que já usa. O benefício é cumulativo — a cada 3 conversões validadas, 1 mês adicional é creditado.

---

## 7. Como se conecta com o produto existente

**Accountancy (abolida)** — O conceito anterior de "accountancy" era uma entidade administrativa usada internamente pela Societiza para gerenciar clientes cadastrados. Não era algo que o usuário final criava ou controlava. O Escritório substitui esse conceito completamente: agora é o próprio contador que cria, configura e gerencia seu espaço de trabalho. Os campos de dados (CNPJ, nome legal, nome fantasia, endereço, etc.) são os mesmos — o que muda é a propriedade e o propósito da entidade.

**UserInvite (existe hoje, parcialmente)** — O sistema de convite por e-mail evolui para suportar convite por link também. O convite passa a ser contextualizado: é um convite para um Escritório específico, não apenas para a plataforma.

**Workflow e WorkflowTemplate (existem hoje)** — Continuam funcionando como são. O contexto do Escritório ativo é o discriminante: ao trocar de Escritório, o usuário vê os processos e templates daquele Escritório. Os limites de processos ativos e templates ativos passam a ser aplicados por Escritório.

**Dashboard (futuro)** — Quando existir, deve operar no contexto do Escritório ativo. Informações de uso do plano (processos vs limite, membros vs limite) são candidatas naturais para aparecer nessa camada.

**Automações (futuro)** — As automações de workflow, quando implementadas, serão uma capacidade exclusiva de Escritórios premium (Escrivaninha e Executivo).

**Notificações (futuro)** — Serão configuradas por Escritório, não por usuário.

---

## 8. O que não é

- **Não é a feature Accountancy renomeada.** Accountancy era uma ferramenta de gestão interna da Societiza. Escritório é uma entidade do usuário final — ele cria, gerencia e paga por ela. A similitude nos campos de dados (CNPJ, endereço, etc.) é coincidência de domínio, não equivalência de função.
- **Não é compartilhamento de dados entre Escritórios.** Cada Escritório é completamente isolado. Processos, templates e membros de um Escritório nunca aparecem em outro, mesmo que o mesmo usuário seja admin de ambos.
- **Não é um módulo de billing completo.** Histórico de faturas, gestão de chargeback, notas fiscais e relatórios financeiros detalhados não fazem parte do escopo desta feature.
- **Não é um sistema de permissões granulares por função.** No MVP, todos os membros de um Escritório operam com permissões amplas dentro daquele contexto. Controles finos como "esse membro pode operar processos mas não pode editar templates" são uma feature futura separada.
- **Não é uma biblioteca de templates da Societiza.** Os templates de workflow que um usuário vê ao estar em um Escritório são os templates que aquele Escritório criou — não um catálogo geral da plataforma.

---

## 9. Custos adicionais

O plano Escrivaninha e o plano Executivo exigem integração com um processador de pagamento. Isso representa um custo externo e uma nova dependência de produto:

- O processador é responsável por cobrar os Escritórios mensalmente ou anualmente
- Webhooks do processador atualizam o status de plano do Escritório na plataforma em tempo real
- A escolha do processador afeta taxas, experiência de checkout, suporte a PIX e boleto, e complexidade de integração
- Processadores compatíveis com o mercado brasileiro: Stripe (com suporte a BRL), Pagar.me, Iugu — a decisão precisa ser tomada antes da implementação

E-mails de convite já são cobertos pelo Brevo, que já está implementado na plataforma.

---

## 10. Perguntas abertas

- **Preços**: os valores dos planos Escrivaninha e Executivo ainda não estão definidos. A landing page atual tem valores de uma versão anterior do modelo comercial que foi revisado.
- **Trial**: existe um período de trial para os planos pagos? Se sim, quantos dias e com qual acesso?
- **Limite de templates ativos**: os planos pagos permitem "múltiplos templates ativos" — mas quantos exatamente? Sem limite? Ou um número específico?
- **Vantagens pessoais de perfil**: além das capacidades que o plano dá ao Escritório, existem benefícios ligados ao perfil pessoal do usuário pagante? Isso ainda não está definido.
- **Org switcher na navegação**: onde o usuário troca de Escritório? Header? Sidebar? Como é o fluxo de criar um novo Escritório versus entrar em um existente via convite?
- **Roles no MVP**: admin e membro são suficientes para o primeiro lançamento, ou já existe necessidade de um nível de acesso mais restrito para certos membros?
