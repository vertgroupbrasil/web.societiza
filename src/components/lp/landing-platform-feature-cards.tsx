import type { ComponentType } from "react"

import {
  InsightsFeatureVisual,
  NotificationsFeatureVisual,
  WorkflowFeatureVisual,
} from "./landing-platform-feature-visuals"

export type LandingPlatformFeatureVisualProps = {
  isActive: boolean
}

export type LandingPlatformFeatureCard = {
  title: string
  description: string
  Visual: ComponentType<LandingPlatformFeatureVisualProps>
}

export const landingPlatformFeatureCards: LandingPlatformFeatureCard[] = [
  {
    title: "Monte workflows do jeito da sua operação",
    description:
      "Crie etapas, tarefas e campos que refletem o processo real da sua contabilidade, sem precisar se adaptar a um fluxo engessado.",
    Visual: WorkflowFeatureVisual,
  },
  {
    title: "Enxergue gargalos e processos parados",
    description:
      "Visualize onde os processos travam, quais etapas acumulam pendências e o que precisa de atenção para sua operação andar com mais ritmo.",
    Visual: InsightsFeatureVisual,
  },
  {
    title: "Você e seu cliente sempre notificados",
    description:
      "Mantenha sua equipe e seu cliente atualizados sobre movimentações, pendências e avanços do processo sem depender de acompanhamento manual.",
    Visual: NotificationsFeatureVisual,
  },
]
