'use client'

import { useState } from "react"
import { motion } from "motion/react"
import { LandingBadge } from "./landing-badge"
import { landingBentoCards } from "./landing-bento-cards"

export function LandingBentoGridSection() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  return (
    <div id="funcionalidades" className="w-full border-b border-border flex flex-col justify-center items-center scroll-mt-28">
      <div className="self-stretch px-4 sm:px-6 md:px-8 lg:px-0 lg:max-w-[1060px] lg:w-[1060px] py-8 sm:py-12 md:py-16 border-b border-border flex justify-center items-center gap-6">
        <div className="w-full max-w-[616px] lg:w-[616px] px-4 sm:px-6 py-4 sm:py-5 shadow-[0px_2px_4px_rgba(50,45,43,0.06)] overflow-hidden rounded-lg flex flex-col justify-start items-center gap-3 sm:gap-4 shadow-none">
          <LandingBadge
            icon={
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect x="1" y="1" width="4" height="4" stroke="#151011" strokeWidth="1" fill="none" />
                <rect x="7" y="1" width="4" height="4" stroke="#151011" strokeWidth="1" fill="none" />
                <rect x="1" y="7" width="4" height="4" stroke="#151011" strokeWidth="1" fill="none" />
                <rect x="7" y="7" width="4" height="4" stroke="#151011" strokeWidth="1" fill="none" />
              </svg>
            }
            text="Para o seu escritório"
          />
          <div className="w-full max-w-[598.06px] lg:w-[598.06px] text-center flex justify-center flex-col text-foreground text-xl sm:text-2xl md:text-3xl lg:text-5xl font-semibold leading-tight md:leading-[60px] font-sans tracking-tight">
            Menos burocracia. Mais clareza para todo mundo.
          </div>
          <div className="self-stretch text-center text-muted-foreground text-sm sm:text-base font-normal leading-6 sm:leading-7 font-sans">
            Societiza organiza a abertura de empresas do jeito que o contador precisa: processo centralizado, cliente acompanhando, rotina menos manual e equipe trabalhando com o mesmo contexto.
          </div>
        </div>
      </div>

      <div className="self-stretch flex justify-center items-start">
        <div className="w-4 sm:w-6 md:w-8 lg:w-12 self-stretch relative overflow-hidden">
          <div className="w-[120px] sm:w-[140px] md:w-[162px] left-[-40px] sm:left-[-50px] md:left-[-58px] top-[-120px] absolute flex flex-col justify-start items-start">
            {Array.from({ length: 200 }).map((_, index) => (
              <div
                key={index}
                className="self-stretch h-3 sm:h-4 rotate-[-45deg] origin-top-left outline outline-[0.5px] outline-border/70 outline-offset-[-0.25px]"
              />
            ))}
          </div>
        </div>

        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-0 border-x border-border">
          {landingBentoCards.map((card, index) => {
            const isTopRow = index < 2
            const isLeftColumn = index % 2 === 0
            const isHovered = hoveredCard === index

            return (
              <div
                key={card.title}
                className={`relative overflow-hidden flex flex-col justify-start items-start min-h-[420px] sm:min-h-[480px] ${
                  isTopRow ? "border-b" : ""
                } ${isLeftColumn ? "border-r-0 md:border-r" : ""} border-border`}
              >
                {/* Texto */}
                <div className="relative z-10 flex flex-col gap-2 p-6 sm:p-8 md:p-10 lg:p-12 pb-0">
                  <h3 className="text-foreground text-lg sm:text-xl font-semibold leading-tight font-sans">
                    {card.title}
                  </h3>
                  <p className="text-muted-foreground text-sm md:text-base font-normal leading-relaxed font-sans">
                    {card.description}
                  </p>
                </div>

                {/*
                  Stack de cards — hover só no próprio card visual, não na célula inteira.
                  A âncora é sempre bottom:0, então subir o `top` expande para cima
                  sem deixar espaço vazio embaixo.
                */}
                <motion.div
                  className="absolute inset-x-6 sm:inset-x-8 md:inset-x-10 lg:inset-x-12 bottom-0"
                  animate={{ top: isHovered ? '38%' : '42%' }}
                  transition={{ duration: 0.45, ease: [0.34, 1.1, 0.64, 1] }}
                  onMouseEnter={() => setHoveredCard(index)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  {/* Card folder — bounce sutil com delay */}
                  <motion.div
                    style={{
                      position: 'absolute',
                      left: 14,
                      right: 14,
                      bottom: 0,
                      borderRadius: '12px 12px 0 0',
                      backgroundColor: '#f7ece8',
                      borderTop: '1px solid rgba(236,217,210,1)',
                      borderLeft: '1px solid rgba(236,217,210,1)',
                      borderRight: '1px solid rgba(236,217,210,1)',
                    }}
                    animate={{ top: isHovered ? -17 : -12 }}
                    transition={
                      isHovered
                        ? { type: 'spring', stiffness: 260, damping: 20, delay: 0.07 }
                        : { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
                    }
                  />

                  {/* Card principal */}
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '12px 12px 0 0',
                    overflow: 'hidden',
                    borderTop: '1px solid rgba(236,217,210,1)',
                    borderLeft: '1px solid rgba(236,217,210,1)',
                    borderRight: '1px solid rgba(236,217,210,1)',
                  }}>
                    <card.Visual />
                  </div>
                </motion.div>
              </div>
            )
          })}
        </div>

        <div className="w-4 sm:w-6 md:w-8 lg:w-12 self-stretch relative overflow-hidden">
          <div className="w-[120px] sm:w-[140px] md:w-[162px] left-[-40px] sm:left-[-50px] md:left-[-58px] top-[-120px] absolute flex flex-col justify-start items-start">
            {Array.from({ length: 200 }).map((_, index) => (
              <div
                key={index}
                className="self-stretch h-3 sm:h-4 rotate-[-45deg] origin-top-left outline outline-[0.5px] outline-border/70 outline-offset-[-0.25px]"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
