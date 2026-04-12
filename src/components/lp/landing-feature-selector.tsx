import { LandingFeatureCard } from "./landing-feature-card"

type LandingFeatureSelectorProps = {
  activeCard: number
  progress: number
  onCardClick: (index: number) => void
}

export function LandingFeatureSelector({
  activeCard,
  progress,
  onCardClick,
}: LandingFeatureSelectorProps) {
  return (
    <div className="self-stretch border-t border-[#E0DEDB] border-b border-[#E0DEDB] flex justify-center items-start">
      <div className="w-4 sm:w-6 md:w-8 lg:w-12 self-stretch relative overflow-hidden">
        <div className="w-[120px] sm:w-[140px] md:w-[162px] left-[-40px] sm:left-[-50px] md:left-[-58px] top-[-120px] absolute flex flex-col justify-start items-start">
          {Array.from({ length: 50 }).map((_, index) => (
            <div
              key={index}
              className="self-stretch h-3 sm:h-4 rotate-[-45deg] origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"
            />
          ))}
        </div>
      </div>

      <div className="flex-1 px-0 sm:px-2 md:px-0 flex flex-col md:flex-row justify-center items-stretch gap-0">
        <LandingFeatureCard
          title="Organize seu societário do seu jeito"
          description="Crie etapas, tarefas e campos que refletem a operação real do seu escritório."
          isActive={activeCard === 0}
          progress={activeCard === 0 ? progress : 0}
          onClick={() => onCardClick(0)}
        />
        <LandingFeatureCard
          title="Pare de consultar prefeitura no manual"
          description="Acompanhe mudanças no processo com automações que avisam sua equipe no momento certo."
          isActive={activeCard === 1}
          progress={activeCard === 1 ? progress : 0}
          onClick={() => onCardClick(1)}
        />
        <LandingFeatureCard
          title="Seu cliente acompanha tudo com clareza"
          description="Entregue mais transparência, reduza ansiedade e aumente o valor percebido do seu serviço."
          isActive={activeCard === 2}
          progress={activeCard === 2 ? progress : 0}
          onClick={() => onCardClick(2)}
        />
      </div>

      <div className="w-4 sm:w-6 md:w-8 lg:w-12 self-stretch relative overflow-hidden">
        <div className="w-[120px] sm:w-[140px] md:w-[162px] left-[-40px] sm:left-[-50px] md:left-[-58px] top-[-120px] absolute flex flex-col justify-start items-start">
          {Array.from({ length: 50 }).map((_, index) => (
            <div
              key={index}
              className="self-stretch h-3 sm:h-4 rotate-[-45deg] origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"
            />
          ))}
        </div>
      </div>
    </div>
  )
}
