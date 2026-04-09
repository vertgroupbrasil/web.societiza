# Prompt Mestre de Contexto de Produto da Societiza

## Como usar este material

Use este texto como prompt-base para planejamento, discovery, implementacao de
feature, melhoria de feature existente, integracao entre backend e frontend,
discussao de produto, definicao de priorizacao e avaliacao de impacto entre
modulos.

Este material deve servir para pessoas e IAs que atuam em:

- produto;
- frontend;
- backend;
- infra;
- automacao;
- dados;
- UX;
- planejamento estrategico.

A intencao aqui nao e ensinar como programar cada camada. A intencao principal
e explicar com profundidade o que a Societiza e, quais problemas ela resolve,
como as features se conectam, o que ja existe de fato, o que ainda e futuro, o
que e prioridade e quais obstaculos estruturais precisam ser considerados em
qualquer planejamento.

Importante:

- nao descarte nenhuma das informacoes abaixo;
- nao trate como existente uma feature que ainda e futura;
- pode detalhar como uma feature futura deveria funcionar, desde que isso fique
  claramente marcado como visao futura e nao como comportamento ja entregue;
- ao planejar algo novo, preserve a coerencia com o nucleo do produto;
- quando houver conflito entre narrativa de produto e estado tecnico atual do
  codigo, explicite o gap em vez de fingir que ele nao existe.

## Prompt

Voce esta trabalhando no produto Societiza. Antes de propor, planejar,
implementar ou revisar qualquer feature, assuma o contexto abaixo como regra de
negocio principal do produto.

### 1. O que a Societiza e

A Societiza nasceu para mudar a maneira como o Brasil abre empresas. Hoje, a
operacao societaria das contabilidades e extremamente fragmentada. Os dados de
um mesmo processo ficam despejados em planilhas, sites de prefeitura, portais
de viabilidade, documentos espalhados, conversas no WhatsApp, e em outros
softwares que nao compartilham contexto entre si. Isso gera retrabalho, perda
de informacao, falta de previsibilidade, dependencia excessiva de memoria
humana e baixa capacidade de escalar a operacao com qualidade.

A Societiza existe para centralizar essa operacao e reduzir a burocracia
percebida pelo contador. O objetivo nao e apenas organizar tarefas. O objetivo
e transformar a abertura de empresas em uma operacao estruturada, clara,
configuravel, colaborativa e progressivamente automatizavel.

A plataforma deve concentrar toda a regra de negocio da abertura de empresas:
desde a proposta ao cliente, coleta dos dados iniciais, execucao operacional,
acompanhamento do andamento, notificacoes, documentos, pendencias e conclusao
da abertura.

### 2. Visao, missao e valores

A visao da Societiza e se tornar o sistema operacional da abertura de empresas
no Brasil para contabilidades. A plataforma nao deve ser vista como um conjunto
de telas soltas, nem como apenas um kanban. Ela deve ser a camada central da
operacao societaria.

A missao e descomplicar a vida do contador. Isso significa reduzir burocracia,
reduzir caos operacional, reduzir dependencia de controles improvisados e dar
mais clareza, velocidade e previsibilidade para a equipe da contabilidade e
para o cliente final.

Os valores que devem orientar qualquer decisao de produto sao:

- centralizacao de informacao;
- clareza operacional;
- configurabilidade real sem perder simplicidade;
- automacao com proposito;
- colaboracao em equipe;
- confiabilidade;
- continuidade entre features;
- melhor experiencia para contador e cliente;
- escalabilidade operacional para pequenos e medios escritorios.

### 3. ICP e modelo de negocio

O ICP atual da Societiza sao contabilidades de pequeno e medio porte e
contadores autonomos. Sao operacoes que normalmente sofrem com controle manual,
uso excessivo de planilhas, dependencia de WhatsApp, dificuldade para padronizar
processos e baixa visibilidade sobre gargalos.

A Societiza e um SaaS B2B. O modelo comercial ainda nao esta totalmente
fechado, mas a direcao atual e trabalhar com um plano principal por assinatura
e um freemium. As limitacoes do freemium ainda nao estao definidas, mas hoje a
linha de pensamento esta centrada principalmente em quantidade de processos
rodados ou quantidade de processos ativos.

O produto deve ser pensado como software de time. Ele nao e apenas um painel
pessoal. Quem compra e um usuario principal, que representa a contabilidade, e
depois convida outras pessoas para a equipe.

### 4. Estrutura de conta, equipe e permissao

Hoje o produto e vendido como uma estrutura de equipe. Um usuario principal
cria a conta da contabilidade e pode convidar outros membros. No MVP atual,
todos os convidados operam na pratica como administradores: podem editar
templates de workflow, criar processos, editar processos e usar a ferramenta de
forma ampla.

No futuro, faz sentido existir cargos e permissoes mais granulares no ato de
convidar usuarios, com papeis como administrador, operador, gestor ou
visualizador. Porem isso ainda nao esta consolidado como comportamento atual do
produto.

### 5. Autenticacao: visao de produto versus realidade tecnica atual

Do ponto de vista de produto, a autenticacao foi concebida com email e senha,
refresh token em cookies e access token em cache, com middleware no backend
validando o access token e, quando necessario, usando o refresh token para
renovar a sessao. No futuro, a intencao e migrar para login apenas com Google,
para evitar armazenar senhas no banco e simplificar a experiencia.

Entretanto, e importante registrar um gap tecnico atual: o backend existente no
repositorio hoje nao expoe publicamente esse fluxo completo como contrato
observavel de API do mesmo jeito que a narrativa de produto descreve. O backend
atual possui um modulo `Identity`, mas o que esta exposto hoje de forma clara
na API sao fluxos de convite e aceite de convite, alem de um servico JWT
voltado a password reset. Isso significa que qualquer planejamento envolvendo
autenticacao precisa distinguir explicitamente:

- a historia de produto desejada;
- o que o frontend hoje espera em alguns pontos;
- e o que o backend efetivamente expoe hoje.

Esse desalinhamento nao deve ser escondido. Ele deve ser tratado como gap
arquitetural e de integracao.

### 6. Nucleo atual do produto

O nucleo atual da Societiza gira em torno da operacao societaria. O carro-chefe
do produto e a ferramenta societaria, que funciona como centro de execucao e
acompanhamento da abertura de empresas.

#### 6.1. Societario

O societario e um quadro kanban, hoje sem drag and drop no uso operacional do
workflow, com colunas ordenadas que representam as etapas pelas quais um
processo passa desde o inicio ate a conclusao. O objetivo dessa feature nao e
apenas visualizar cards; ela e o principal centro operacional da equipe.

Cada processo representa uma abertura de empresa, ou um caso semelhante dentro
da contabilidade. Dentro do processo existem tarefas e campos configuraveis.
Esses elementos precisam ser suficientemente claros para que qualquer membro da
equipe entenda em que ponto o caso esta, o que falta, o que esta travado e o
que precisa ser feito em seguida.

Do ponto de vista de experiencia do usuario, o societario deve transmitir
controle, previsibilidade e continuidade. O contador nao deve sentir que esta
apenas preenchendo software. Ele deve sentir que esta tocando a operacao real
da contabilidade em um unico lugar.

#### 6.2. Workflow template

O template do workflow e a camada de configuracao do societario. Ele permite
que a contabilidade defina suas etapas, tarefas e campos de acordo com o
processo operacional que ja utiliza no mundo real. Se a contabilidade ja possui
um processo consolidado, a plataforma deve permitir reproduzi-lo. Se o usuario
nao quiser configurar tudo do zero, ele deve conseguir usar um template pronto.

O template precisa refletir o modelo mental do uso real do workflow. Em outras
palavras, a experiencia ideal de configuracao deve parecer uma extensao natural
da experiencia operacional. Ordem de etapas, ordem de tarefas e ordem de campos
importam. A estrutura nao e decorativa; ela carrega semantica operacional.

Tambem e importante distinguir workflow ativo de draft. O ativo representa o
fluxo em uso real. O draft representa uma versao editavel para alteracoes.
Planejamentos e implementacoes nessa area nao podem confundir essas duas coisas.

#### 6.3. Campos dentro de etapas e tarefas

Hoje existe no produto a ideia de inputs de texto, caixas de selecao e outros
campos configuraveis dentro de etapas e tarefas do template do workflow. Esses
campos sao o mecanismo atual para capturar e estruturar parte das informacoes
operacionais necessarias durante a execucao do processo.

Isso e muito importante para evitar uma confusao de contexto:

o produto **ainda nao possui**, como feature consolidada de MVP, um formulario
nativo completo de abertura de empresa como modulo principal e oficial do
produto. O que existe hoje, do ponto de vista de regra de negocio consolidada,
sao campos configuraveis dentro do workflow-template. Portanto, ao planejar,
nao trate a feature futura de formulario de abertura como se ela ja fosse uma
capacidade principal entregue e estabilizada.

#### 6.4. Accountancy

A feature de accountancy representa a contabilidade dentro da plataforma. Ela
e importante porque o produto e vendido para equipes e escritorios. Ela guarda
dados da propria contabilidade e ajuda a sustentar a identidade da operacao
dentro do sistema.

Mesmo quando uma feature parecer focada em workflow, deve-se lembrar que a
entidade da contabilidade e o contorno organizacional do produto. Convites,
branding futuro, equipe, ownership de processos e outros desdobramentos devem
partir desse contexto.

### 7. Dashboard como proxima feature mandatoria

Depois das melhorias no societario, a proxima grande feature mandatoria da
Societiza e o dashboard.

Ainda nao esta definido exatamente quais dados esse dashboard vai conter, nem
como ele sera implementado tecnicamente, mas do ponto de vista de produto ele
deve ser a camada de leitura da operacao, enquanto o societario continua sendo
a camada de execucao.

O dashboard nao pode ser passivo. Ele deve ser interativo. Cada numero, card ou
grafico que represente um conjunto operacional de dados deve, idealmente,
permitir navegacao para a area operacional correspondente.

Exemplo obrigatorio de mental model:

- se existir um grafico de pizza com os processos mais parados;
- ao clicar em um segmento desse grafico;
- o usuario deve ir para o societario;
- com um filtro aplicado;
- vendo exatamente os processos ligados a esse insight.

Essa interatividade precisa ser consistente. Se um grafico e clicavel, os
graficos equivalentes tambem devem seguir uma logica de clicabilidade coerente.
O usuario nao pode ficar adivinhando quais cards navegam e quais apenas exibem
informacao. A regra desejada e: insight deve virar acao.

Os grupos de dados mais promissores para esse dashboard sao:

- total de processos ativos;
- total de processos concluidos em um periodo;
- processos novos em um periodo;
- distribuicao de processos por etapa;
- processos mais parados;
- etapas com maior acumulacao;
- processos aguardando cliente;
- tarefas pendentes;
- movimentacoes recentes;
- alertas e riscos;
- gargalos operacionais;
- indicadores de necessidade de contato com cliente.

O dashboard deve comecar profundamente conectado ao societario. Ele nao deve
nascer como um modulo analitico isolado. Ele deve resumir a operacao real e
levar o usuario de volta ao trabalho com contexto e filtros.

### 8. Automacao como extensao natural do workflow

Um dos potenciais mais fortes da Societiza esta nas tarefas automatizaveis.
Hoje o contador perde muito tempo consultando repetidamente sites de prefeitura
para verificar se determinada resposta saiu, como viabilidade, alvara ou outra
informacao publica. No futuro, essas verificacoes repetitivas devem poder virar
tarefas automatizadas do proprio workflow.

Essa automacao nao deve nascer como modulo desconectado. Ela deve ser
entendida como extensao do processo ja configurado no workflow. O objetivo nao
e criar uma automacao aleatoria, e sim substituir trabalho manual repetitivo
dentro do fluxo real da contabilidade.

Essa automacao, porem, nao faz parte do MVP atual consolidado.

### 9. Features futuras relevantes

#### 9.1. Importacao e exportacao de processos

Importacao e exportacao sao estrategicamente importantes porque a adocao do
produto depende de o usuario conseguir migrar parte da operacao sem sentir que
precisa recomecar do zero.

Hoje existem duas direcoes principais imaginadas:

- importacao por planilha;
- importacao assistida por IA via MCP Server.

A importacao por planilha parece obvia, mas tem varios riscos: exige colunas
perfeitamente padronizadas, nao representa bem estrutura de tarefas e campos,
pode trazer dados inconsistentes e dificilmente reconstrui com inteligencia o
estado real do processo.

A importacao por IA usando MCP Server e mais promissora, porque poderia ajudar
a interpretar dados desestruturados, mas esta fora das prioridades imediatas do
MVP.

Exportacao tambem e importante para confianca do usuario e para eventual
relatorio, auditoria, backup ou migracao futura.

#### 9.2. Notificacoes

A Societiza deve ter notificacoes por email e, futuramente, por WhatsApp. Essas
notificacoes devem atender tanto o cliente final quanto a equipe interna da
contabilidade.

Para o cliente, faz sentido notificar movimentacao de etapa, movimentacao de
tarefa, mudancas importantes no andamento e possiveis necessidades de acao.

Para a contabilidade, faz sentido alertar processos parados, gargalos, etapas
travadas, risco de atraso ou momentos em que seria recomendavel atualizar o
cliente.

Essa feature deve ser pensada como extensao do acompanhamento operacional e nao
como um canal de mensagens isolado.

#### 9.3. MCP Server e IA operacional

Existe uma visao de MCP Server para conectar uma IA que ja rode na maquina do
usuario ou para servir como agente operacional no dia a dia do contador. Essa
IA poderia ajudar em importacao, consulta de informacoes, perguntas sobre
processos e suporte operacional a partir de prompts.

Essa IA precisa conhecer o contexto real da operacao, e nao apenas responder de
forma generica. O valor dela aumenta quando esta conectada ao estado do
workflow, das tarefas e das informacoes da contabilidade.

#### 9.4. Controle de alvaras

Queremos uma feature de controle de alvaras para que a contabilidade consiga
gerenciar os alvaras dos clientes, acompanhar vencimentos e notificar tanto a
equipe interna quanto o cliente final.

A modelagem dessa ligacao com o societario ainda nao esta fechada, mas existe
uma direcao clara: a Societiza pode evoluir da abertura da empresa para a
continuidade regulatoria da vida desse cliente.

#### 9.5. Formulario nativo de abertura de empresa

Hoje muitas contabilidades usam ferramentas externas de formulario para coletar
informacoes como dados administrativos, quadro societario, cotas, nomes, email,
profissao e outras respostas necessarias para abrir a empresa.

No futuro, queremos que a Societiza permita criar esse formulario de forma
nativa, com branding da contabilidade, e que as respostas alimentem diretamente
o processo do cliente dentro da plataforma.

Mas e crucial manter a distincao:

- isso e uma feature futura de produto;
- nao deve ser tratada como capacidade consolidada do MVP atual;
- o que existe hoje como verdade operacional sao campos configuraveis dentro do
  workflow-template.

#### 9.6. Certificados digitais em nuvem

Queremos uma feature de controle de certificados digitais em nuvem
criptografados. O problema aqui e serio: muitas contabilidades nao seguem
praticas adequadas para armazenar dados sensiveis dos clientes. A Societiza
quer oferecer um local seguro, confiavel e pratico para armazenar,
disponibilizar download e acompanhar vencimentos desses certificados.

Essa feature se conecta naturalmente com notificacoes, dados do cliente e, no
futuro, com uma visao mais ampla da vida operacional e regulatoria do cliente.

### 10. Obstaculos atuais e gaps estruturais

Ao planejar qualquer feature, leve em conta estes obstaculos reais:

#### 10.1. Migracao de dados para dentro do sistema

Esse e um dos maiores desafios de produto. Os dados atuais dos usuarios estao
espalhados em planilhas, WhatsApp, emails, cadernos operacionais, ERPs e sites
publicos. Trazer isso para dentro da plataforma de forma confiavel e uma dor
grande, e qualquer funcionalidade de importacao precisa reconhecer que a origem
sera, em muitos casos, despadronizada e sem semantica limpa.

#### 10.2. Variacao de regra de negocio por cidade, estado e prefeitura

O Brasil nao tem um fluxo unico de abertura de empresa. Cada estado, cidade e,
em muitos casos, cada prefeitura relevante pode impor regras, sequencias,
exigencias, portais, nomenclaturas e limitacoes diferentes. Isso significa que
qualquer automacao, template pronto ou fluxo considerado "padrao" precisa ser
tratado com cuidado.

O produto precisa ser suficientemente configuravel para acomodar essas
diferencas, sem assumir que existe um processo nacional totalmente uniforme.

#### 10.3. Dependencia de sistemas externos instaveis

Boa parte da operacao societaria depende de sites publicos e sistemas externos
que podem ser lentos, confusos, instaveis, ter captcha, mudar layout sem aviso
ou ate ficar fora do ar. Isso impacta diretamente futuras automacoes e deve ser
considerado nas decisoes de produto, engenharia e operacao.

#### 10.4. Gap entre narrativa de produto e contratos tecnicos atuais

Algumas historias do produto ja estao claras, mas o backend atual ainda nao
implementa ou nao expoe exatamente esses contratos da forma esperada. O caso da
autenticacao e o exemplo mais importante. Isso significa que planejamento
estrategico e planejamento tecnico precisam sempre explicitar:

- o que ja existe de verdade;
- o que e comportamento esperado de produto;
- o que ainda precisa ser alinhado entre frontend, backend e infra.

#### 10.5. Permissoes ainda pouco granulares

Hoje o modelo de permissao e simples e todos os convidados acabam com poderes
amplos. Isso pode virar gargalo conforme o produto evoluir para operacoes com
mais pessoas e mais sensibilidade de acao.

#### 10.6. Dashboard ainda sem definicao final de metricas

Sabemos que o dashboard e obrigatorio e estrategico, mas ainda nao existe
definicao fechada de metrica, fonte de verdade, visualizacao final ou
interatividade completa. O planejamento dessa feature precisa combinar visao de
produto com a realidade operacional do societario.

### 11. Como novas features devem se comportar

Qualquer feature nova deve fortalecer o nucleo da plataforma. Ela nao deve
nascer isolada, nem competir com o societario como centro operacional.

Perguntas obrigatorias ao planejar algo novo:

- isso centraliza ou espalha ainda mais a informacao?
- isso reduz retrabalho real da contabilidade?
- isso melhora a clareza operacional?
- isso conversa com a equipe como unidade, e nao apenas com um usuario isolado?
- isso pode se conectar ao workflow ou ao dashboard?
- isso melhora a experiencia do cliente final ou da equipe interna?
- isso respeita a diferenca entre o que ja existe e o que ainda e visao futura?

### 12. Semantica de prioridade

Ao priorizar o produto, use a seguinte ordem semantica:

#### Prioridade 1. Fortalecer o nucleo operacional atual

Isso significa melhorar societario, workflow-template, consistencia de uso,
qualidade da operacao, clareza da interface, confiabilidade e capacidade de
configuracao.

#### Prioridade 2. Entregar o dashboard

O dashboard e a proxima feature grande e mandatoria apos as melhorias no
societario. Ele deve ser uma camada de leitura operacional e gerencial,
interativa e conectada ao societario.

#### Prioridade 3. Melhorar a capacidade de acompanhamento e continuidade

Aqui entram notificacoes, leituras de gargalo, visibilidade de parados e outras
funcionalidades que ampliem a capacidade de acompanhamento da operacao.

#### Prioridade 4. Reduzir friccao de entrada e aumentar automacao

Aqui entram importacao, exportacao, MCP Server, IA assistiva e automacao de
tarefas repetitivas.

#### Prioridade 5. Expandir o produto para a vida operacional do cliente alem
da abertura

Aqui entram controle de alvaras, certificados digitais e outros modulos que
expandem a plataforma da abertura para a manutencao da vida regulatoria do
cliente.

### 13. Guardrails para qualquer IA ou time usando este contexto

- nao invente features atuais que ainda nao existem;
- nao rebaixe nenhuma informacao acima para uma frase superficial;
- ao falar de uma feature existente, descreva seu papel no produto e sua
  experiencia esperada, nao apenas o nome da feature;
- ao falar de uma feature futura, deixe claro que ela e futura;
- preserve a Societiza como plataforma central da operacao societaria;
- trate o societario como o nucleo atual do produto;
- trate o dashboard como a proxima feature mandataria;
- trate os campos em etapas e tarefas como a forma atual de captura de dados,
  sem confundir isso com um modulo oficial e consolidado de formulario de
  abertura no MVP;
- explicite gaps tecnicos quando existirem, em vez de mascarar esses gaps com
  linguagem vaga.
