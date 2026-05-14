import type { ComponentType } from "react"

import { VisualChaosToOrder } from "./visual-caos-to-order"
import { VisualProgressTimeline } from "./visual-progress-timeline"
import { VisualAutoSync } from "./visual-auto-sync"
import { VisualTeamwork } from "./visual-teamwork"

type LandingBentoVisualProps = {
  isActive?: boolean
}

export type LandingBentoCard = {
  title: string
  description: string
  Visual: ComponentType<LandingBentoVisualProps>
}

export const landingBentoCards: LandingBentoCard[] = [
  {
    title: "O seu societário, sem caos",
    description:
      "Pare de espalhar a abertura da empresa entre planilhas, anotações, portais públicos e conversas soltas.",
    Visual: VisualChaosToOrder,
  },
  {
    title: "Transparência para o cliente",
    description:
      "Envie um link de rastreio do processo societário para o cliente e reduza cobrança no WhatsApp transformando a experiência dele.",
    Visual: VisualProgressTimeline,
  },
  {
    title: "Menos acompanhamento manual",
    description:
      "O contador não deveria perder tempo verificando o mesmo status na prefeitura várias vezes por dia.",
    Visual: VisualAutoSync,
  },
  {
    title: "Trabalhe em equipe, sem ruído",
    description:
      "Trabalhe colaborativamente com sua equipe para centralizar seus processos.",
    Visual: VisualTeamwork,
  },
]
