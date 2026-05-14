"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "motion/react"
import type React from "react"
import { landingPlatformFeatureCards } from "./landing-platform-feature-cards"

// Badge component for consistency
function Badge({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="px-[14px] py-[6px] bg-card shadow-[0px_0px_0px_4px_rgba(255,85,0,0.05)] overflow-hidden rounded-[90px] flex justify-start items-center gap-[8px] border border-border/70 shadow-xs">
      <div className="w-[14px] h-[14px] relative overflow-hidden flex items-center justify-center">{icon}</div>
      <div className="text-center flex justify-center flex-col text-foreground text-xs font-medium leading-3 font-sans">
        {text}
      </div>
    </div>
  )
}

export default function DocumentationSection() {
  const [activeCard, setActiveCard] = useState(0)
  const [animationKey, setAnimationKey] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const cards = [
{
  title: "Monte workflows do jeito da sua operação",
  description:
    "Crie etapas, tarefas e campos que refletem o processo real da sua contabilidade, sem precisar se adaptar a um fluxo engessado.",
  image: "/modern-dashboard-interface-with-data-visualization.jpg",
},
{
  title: "Enxergue gargalos e processos parados",
  description:
    "Visualize onde os processos travam, quais etapas acumulam pendências e o que precisa de atenção para sua operação andar com mais ritmo.",
  image: "/analytics-dashboard.png",
},
{
  title: "Você e seu cliente sempre notificados",
  description:
    "Mantenha sua equipe e seu cliente atualizados sobre movimentações, pendências e avanços do processo sem depender de acompanhamento manual.",
  image: "/team-collaboration-interface-with-shared-workspace.jpg",
},

  ]

  useEffect(() => {
    if (isPaused) return

    intervalRef.current = setInterval(() => {
      setActiveCard((prev) => (prev + 1) % cards.length)
      setAnimationKey((prev) => prev + 1)
    }, 5000)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [cards.length, isPaused])

  const handleCardClick = (index: number) => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    setIsPaused(true)
    setActiveCard(index)
    setAnimationKey((prev) => prev + 1)
  }

  return (
    <div id="plataforma" className="w-full border-b border-border flex flex-col justify-center items-center scroll-mt-28">
      {/* Header Section */}
      <div className="self-stretch px-6 md:px-24 py-12 md:py-16 border-b border-border flex justify-center items-center gap-6">
        <div className="w-full px-6 py-5 shadow-[0px_2px_4px_rgba(50,45,43,0.06)] overflow-hidden rounded-lg flex flex-col justify-start items-center gap-4 shadow-none">
          <Badge
            icon={
              <div className="w-[10.50px] h-[10.50px] outline outline-[1.17px] outline-foreground outline-offset-[-0.58px] rounded-full"></div>
            }
            text="Plataforma"
          />
          <div className="self-stretch text-center flex justify-center flex-col text-foreground text-3xl md:text-5xl font-semibold leading-tight md:leading-[60px] font-sans tracking-tight">
            Uma plataforma pensada para a operação contábil
          </div>
          <div className="self-stretch text-center text-muted-foreground text-base font-normal leading-7 font-sans">
            Estruture workflows, monitore o andamento dos processos e mantenha equipe e clientes informados com uma experiência muito mais clara do início ao fim.
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="self-stretch px-4 md:px-9 overflow-hidden flex justify-start items-center">
        <div className="flex-1 py-8 md:py-11 flex flex-col md:flex-row justify-start items-center gap-6 md:gap-12">
          {/* Left Column - Feature Cards */}
          <div className="w-full md:w-auto md:max-w-[400px] flex flex-col justify-center items-center gap-4 order-2 md:order-1">
            {cards.map((card, index) => {
              const isActive = index === activeCard

              return (
                <div
                  key={index}
                  onClick={() => handleCardClick(index)}
                  className={`w-full overflow-hidden flex flex-col justify-start items-start transition-all duration-300 cursor-pointer ${
                    isActive
                      ? "bg-card shadow-[0px_0px_0px_0.75px_rgba(236,217,210,1)_inset]"
                      : "border border-border/70"
                  }`}
                >
                  <div
                    className={`w-full h-0.5 bg-border/80 overflow-hidden ${isActive && !isPaused ? "opacity-100" : "opacity-0"}`}
                  >
                    <div
                      key={animationKey}
                      className="h-0.5 bg-primary animate-[progressBar_5s_linear_forwards] will-change-transform"
                    />
                  </div>
                  <div className="px-6 py-5 w-full flex flex-col gap-2">
                    <div className="self-stretch flex justify-center flex-col text-foreground text-sm font-semibold leading-6 font-sans">
                      {card.title}
                    </div>
                    <div className="self-stretch text-muted-foreground text-[13px] font-normal leading-[22px] font-sans whitespace-pre-line">
                      {card.description}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Right Column - Visual */}
          <div className="w-full md:w-auto rounded-lg flex flex-col justify-center items-center gap-2 order-1 md:order-2 md:px-0 px-[00]">
            <div className="w-full md:w-[580px] h-[250px] md:h-[420px] bg-card shadow-[0px_0px_0px_0.9056603908538818px_rgba(21,16,17,0.08)] overflow-hidden rounded-lg flex flex-col">
              {/* Mac chrome */}
              <div className="shrink-0 flex items-center gap-1.5 px-4 border-b border-border" style={{ height: 36, backgroundColor: '#f7ece8' }}>
                <div className="rounded-full" style={{ width: 9, height: 9, backgroundColor: '#FC645F' }} />
                <div className="rounded-full" style={{ width: 9, height: 9, backgroundColor: '#FDBC40' }} />
                <div className="rounded-full" style={{ width: 9, height: 9, backgroundColor: '#34C84A' }} />
              </div>
              {/* Visual area */}
              <div className="relative flex-1 overflow-hidden">
                {landingPlatformFeatureCards.map(({ Visual, title }, index) => (
                  <AnimatePresence key={title} mode="wait">
                    {activeCard === index && (
                      <motion.div
                        key={title}
                        className="absolute inset-0"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                      >
                        <Visual isActive={true} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes progressBar {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(0%);
          }
        }
      `}</style>
    </div>
  )
}
