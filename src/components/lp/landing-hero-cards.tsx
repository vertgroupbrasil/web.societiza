import type { ComponentType } from "react"

import {
  AutomationHeroVisual,
  NotificationsHeroVisual,
  WorkflowHeroVisual,
} from "./landing-hero-visuals"
import { VisualCentralizedFlow } from "./visual-centralized-flow"

export type LandingHeroVisualProps = {
  isActive: boolean
}

export type LandingHeroCard = {
  title: string
  description: string
  Visual: ComponentType<LandingHeroVisualProps>
}

export const landingHeroCards: LandingHeroCard[] = [
  {
    title: "Organize seu societário do seu jeito",
    description:
      "Crie etapas, tarefas e campos que refletem a operação real do seu escritório.",
    Visual: VisualCentralizedFlow,
  },
  {
    title: "Pare de consultar prefeitura no manual",
    description:
      "Acompanhe mudanças no processo com automações que avisam sua equipe no momento certo.",
    Visual: AutomationHeroVisual,
  },
  {
    title: "Seu cliente acompanha tudo com clareza",
    description:
      "Entregue mais transparência, reduza ansiedade e aumente o valor percebido do seu serviço.",
    Visual: NotificationsHeroVisual,
  },
]
