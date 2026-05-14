'use client';

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from 'recharts';
import { Activity, Building2, CheckCircle2, Clock3 } from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@shadcn/index';
import {
  dashboardMetrics,
  monthlyProcessData,
  planUsageData,
  recentSignals,
  statusData,
} from '../data';
import type { ChartConfig } from '@societiza/components/ui/shadcnui/chart';

const processChartConfig = {
  processos: {
    label: 'Processos',
    color: 'var(--chart-1)',
  },
  tarefas: {
    label: 'Tarefas',
    color: 'var(--chart-2)',
  },
} satisfies ChartConfig;

const statusChartConfig = {
  andamento: {
    label: 'Em andamento',
    color: 'var(--chart-1)',
  },
  cliente: {
    label: 'Aguardando cliente',
    color: 'var(--chart-2)',
  },
  revisao: {
    label: 'Revisão interna',
    color: 'var(--chart-3)',
  },
  finalizados: {
    label: 'Finalizados',
    color: 'var(--chart-4)',
  },
} satisfies ChartConfig;

const usageChartConfig = {
  usado: {
    label: 'Usado',
    color: 'var(--chart-1)',
  },
  limite: {
    label: 'Limite',
    color: 'var(--chart-5)',
  },
} satisfies ChartConfig;

const metricIcons = [Activity, CheckCircle2, Building2, Clock3];

export function DashboardOverview() {
  return (
    <main className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Visão decorativa do escritório com dados demonstrativos.
        </p>
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {dashboardMetrics.map((metric, index) => {
          const Icon = metricIcons[index];

          return (
            <Card key={metric.label}>
              <CardHeader className="flex flex-row items-center justify-between gap-3 pb-2">
                <CardDescription>{metric.label}</CardDescription>
                <Icon className="text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold">{metric.value}</div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {metric.detail}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.4fr_0.8fr]">
        <Card>
          <CardHeader>
            <CardTitle>Evolução operacional</CardTitle>
            <CardDescription>
              Processos e tarefas acompanhados nos últimos meses.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={processChartConfig}
              className="h-80 w-full"
            >
              <AreaChart data={monthlyProcessData}>
                <defs>
                  <linearGradient id="fillProcessos" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--color-processos)"
                      stopOpacity={0.4}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-processos)"
                      stopOpacity={0.05}
                    />
                  </linearGradient>
                  <linearGradient id="fillTarefas" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--color-tarefas)"
                      stopOpacity={0.35}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-tarefas)"
                      stopOpacity={0.05}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} width={32} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  dataKey="processos"
                  type="monotone"
                  fill="url(#fillProcessos)"
                  stroke="var(--color-processos)"
                  strokeWidth={2}
                />
                <Area
                  dataKey="tarefas"
                  type="monotone"
                  fill="url(#fillTarefas)"
                  stroke="var(--color-tarefas)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status dos processos</CardTitle>
            <CardDescription>
              Distribuição fake para dar contexto visual ao painel.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={statusChartConfig} className="h-80 w-full">
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                <Pie
                  data={statusData}
                  dataKey="total"
                  nameKey="status"
                  innerRadius={62}
                  outerRadius={96}
                  paddingAngle={3}
                />
              </PieChart>
            </ChartContainer>
            <div className="mt-4 grid gap-2">
              {statusData.map((item) => (
                <div
                  key={item.status}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-muted-foreground">{item.status}</span>
                  <span className="font-medium">{item.total}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1fr_0.8fr]">
        <Card>
          <CardHeader>
            <CardTitle>Uso do escritório</CardTitle>
            <CardDescription>
              Comparativo entre uso atual e limites demonstrativos.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={usageChartConfig} className="h-72 w-full">
              <BarChart data={planUsageData}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="resource" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} width={32} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar
                  dataKey="limite"
                  fill="var(--color-limite)"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="usado"
                  fill="var(--color-usado)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sinais recentes</CardTitle>
            <CardDescription>
              Pequenos insights estáticos para compor o dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            {recentSignals.map((signal) => (
              <div
                key={signal}
                className="rounded-lg border bg-muted/30 px-3 py-2 text-sm"
              >
                {signal}
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
