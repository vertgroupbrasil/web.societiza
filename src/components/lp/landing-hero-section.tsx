import Image from "next/image"

import type { LandingHeroCard } from "./landing-hero-cards"

type LandingHeroSectionProps = {
  activeCard: number
  cards: LandingHeroCard[]
}

export function LandingHeroSection({
  activeCard,
  cards,
}: LandingHeroSectionProps) {
  return (
    <>
      <div className="w-full max-w-[937px] lg:w-[937px] flex flex-col justify-center items-center gap-3 sm:gap-4 md:gap-5 lg:gap-6">
        <div className="self-stretch rounded-[3px] flex flex-col justify-center items-center gap-4 sm:gap-5 md:gap-6 lg:gap-8">
          <div className="w-full text-center flex justify-center flex-col text-foreground text-[24px] xs:text-[28px] sm:text-[36px] md:text-[52px] lg:text-[75px] font-normal leading-[1.1] sm:leading-[1.15] md:leading-[1.2] lg:leading-24 font-serif px-2 sm:px-4 md:px-0">
            Conforto para o contador
            <br/>
            Transparência para o cliente
          </div>
          <div className="w-full max-w-[506.08px] lg:w-[506.08px] text-center flex justify-center flex-col text-muted-foreground sm:text-lg md:text-xl leading-[1.4] sm:leading-[1.45] md:leading-[1.5] lg:leading-7 font-sans px-2 sm:px-4 md:px-0 lg:text-lg font-medium text-sm">
            Menos burocracia, menos cobrança e mais clareza em cada etapa da abertura de empresas.
          </div>
        </div>
      </div>

      <div className="w-full max-w-[497px] lg:w-[497px] flex flex-col justify-center items-center gap-6 sm:gap-8 md:gap-10 lg:gap-12 relative z-10 mt-6 sm:mt-8 md:mt-10 lg:mt-12">
        <div className="backdrop-blur-[8.25px] flex justify-start items-center gap-4">
          <a
            href="#interesse"
            className="h-10 sm:h-11 md:h-12 px-6 sm:px-8 md:px-10 lg:px-12 py-2 sm:py-[6px] relative bg-primary overflow-hidden rounded-full flex justify-center items-center transition-transform duration-200 hover:-translate-y-0.5"
          >
            <div className="w-20 sm:w-24 md:w-28 lg:w-44 h-[41px] absolute left-0 top-[-0.5px] bg-gradient-to-b mix-blend-multiply" />
            <div className="flex flex-col justify-center text-primary-foreground text-sm sm:text-base md:text-[15px] font-medium leading-5 font-sans">
              Quero acesso antecipado
            </div>
          </a>
        </div>
      </div>

      <div className="absolute top-[232px] sm:top-[248px] md:top-[264px] lg:top-[320px] left-1/2 transform -translate-x-1/2 z-0 pointer-events-none">
        <Image
          src="/mask-group-pattern.svg"
          alt=""
          width={2808}
          height={2514}
          className="w-[936px] sm:w-[1404px] md:w-[2106px] lg:w-[2808px] h-auto opacity-30 sm:opacity-40 md:opacity-50 mix-blend-multiply"
          style={{
            filter: "hue-rotate(15deg) saturate(0.7) brightness(1.2)",
          }}
        />
      </div>

      <div className="w-full max-w-[960px] lg:w-[960px] pt-2 sm:pt-4 pb-6 sm:pb-8 md:pb-10 px-2 sm:px-4 md:px-6 lg:px-11 flex flex-col justify-center items-center gap-2 relative z-5 my-8 sm:my-12 md:my-16 lg:my-16 mb-0 lg:pb-0">
        <div className="w-full max-w-[960px] lg:w-[960px] h-[200px] sm:h-[280px] md:h-[450px] lg:h-[695.55px] bg-card shadow-[0px_0px_0px_0.9056603908538818px_rgba(21,16,17,0.08)] overflow-hidden rounded-[6px] sm:rounded-[8px] lg:rounded-[9.06px] flex flex-col justify-start items-start">
          <div className="self-stretch flex-1 flex justify-start items-start">
            <div className="w-full h-full flex items-center justify-center">
              <div className="relative w-full h-full overflow-hidden">
                {cards.map(({ Visual, title }, index) => (
                  <div
                    key={title}
                    className={`absolute inset-0 transition-all duration-500 ease-in-out ${
                      activeCard === index
                        ? "opacity-100 scale-100 blur-0"
                        : "opacity-0 scale-95 blur-sm"
                    }`}
                  >
                    <Visual isActive={activeCard === index} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
