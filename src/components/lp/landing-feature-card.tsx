type LandingFeatureCardProps = {
  title: string
  description: string
  isActive: boolean
  progress: number
  onClick: () => void
}

export function LandingFeatureCard({
  title,
  description,
  isActive,
  progress,
  onClick,
}: LandingFeatureCardProps) {
  return (
    <div
      className={`w-full md:flex-1 self-stretch px-6 py-5 overflow-hidden flex flex-col justify-start items-start gap-2 cursor-pointer relative border-b md:border-b-0 last:border-b-0 ${
        isActive
          ? "bg-card shadow-[0px_0px_0px_0.75px_rgba(236,217,210,1)_inset]"
          : "border-l-0 border-r-0 md:border border-border/80"
      }`}
      onClick={onClick}
    >
      {isActive && (
        <div className="absolute top-0 left-0 w-full h-0.5 bg-border/80">
          <div
            className="h-full bg-primary transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      <div className="self-stretch flex justify-center flex-col text-foreground text-sm md:text-sm font-semibold leading-6 md:leading-6 font-sans">
        {title}
      </div>
      <div className="self-stretch text-muted-foreground text-[13px] md:text-[13px] font-normal leading-[22px] md:leading-[22px] font-sans">
        {description}
      </div>
    </div>
  )
}
