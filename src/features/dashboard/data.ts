export const dashboardMetrics = [
  {
    label: 'Processos ativos',
    value: '128',
    detail: '+12 neste mês',
  },
  {
    label: 'Tarefas concluídas',
    value: '342',
    detail: '87% no prazo',
  },
  {
    label: 'Clientes monitorados',
    value: '64',
    detail: '+8 novas empresas',
  },
  {
    label: 'Uso do plano',
    value: '72%',
    detail: 'Executivo',
  },
];

export const monthlyProcessData = [
  { month: 'Nov', processos: 72, tarefas: 142 },
  { month: 'Dez', processos: 84, tarefas: 168 },
  { month: 'Jan', processos: 91, tarefas: 184 },
  { month: 'Fev', processos: 107, tarefas: 228 },
  { month: 'Mar', processos: 118, tarefas: 264 },
  { month: 'Abr', processos: 128, tarefas: 342 },
];

export const statusData = [
  { status: 'Em andamento', total: 48, fill: 'var(--color-andamento)' },
  { status: 'Aguardando cliente', total: 24, fill: 'var(--color-cliente)' },
  { status: 'Revisão interna', total: 18, fill: 'var(--color-revisao)' },
  { status: 'Finalizados', total: 38, fill: 'var(--color-finalizados)' },
];

export const planUsageData = [
  { resource: 'Processos', usado: 128, limite: 180 },
  { resource: 'Membros', usado: 9, limite: 15 },
  { resource: 'Templates', usado: 22, limite: 40 },
  { resource: 'Automações', usado: 14, limite: 25 },
];

export const recentSignals = [
  '8 processos societários chegaram à etapa de assinatura.',
  '12 clientes enviaram documentos nas últimas 24h.',
  '3 alvarás precisam de revisão antes do vencimento.',
  'Plano Executivo com consumo saudável para a semana.',
];
