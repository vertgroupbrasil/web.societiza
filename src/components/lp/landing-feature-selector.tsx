import type { LandingHeroCard } from "./landing-hero-cards"
import { LandingFeatureCard } from "./landing-feature-card"

type LandingFeatureSelectorProps = {
  activeCard: number
  cards: LandingHeroCard[]
  progress: number
  onCardClick: (index: number) => void
}

export function LandingFeatureSelector({
  activeCard,
  cards,
  progress,
  onCardClick,
}: LandingFeatureSelectorProps) {
  return (
    <div className="self-stretch border-y border-border flex justify-center items-start">
      <div className="w-4 sm:w-6 md:w-8 lg:w-12 self-stretch relative overflow-hidden">
        <div className="w-[120px] sm:w-[140px] md:w-[162px] left-[-40px] sm:left-[-50px] md:left-[-58px] top-[-120px] absolute flex flex-col justify-start items-start">
          {Array.from({ length: 50 }).map((_, index) => (
            <div
              key={index}
              className="self-stretch h-3 sm:h-4 rotate-[-45deg] origin-top-left outline outline-[0.5px] outline-border/70 outline-offset-[-0.25px]"
            />
          ))}
        </div>
      </div>

      <div className="flex-1 px-0 sm:px-2 md:px-0 flex flex-col md:flex-row justify-center items-stretch gap-0">
        {cards.map((card, index) => (
          <LandingFeatureCard
            key={card.title}
            title={card.title}
            description={card.description}
            isActive={activeCard === index}
            progress={activeCard === index ? progress : 0}
            onClick={() => onCardClick(index)}
          />
        ))}
      </div>

      <div className="w-4 sm:w-6 md:w-8 lg:w-12 self-stretch relative overflow-hidden">
        <div className="w-[120px] sm:w-[140px] md:w-[162px] left-[-40px] sm:left-[-50px] md:left-[-58px] top-[-120px] absolute flex flex-col justify-start items-start">
          {Array.from({ length: 50 }).map((_, index) => (
            <div
              key={index}
              className="self-stretch h-3 sm:h-4 rotate-[-45deg] origin-top-left outline outline-[0.5px] outline-border/70 outline-offset-[-0.25px]"
            />
          ))}
        </div>
      </div>
    </div>
  )
}
