import type { ReactNode } from "react"

type LandingHeroVisualProps = {
  isActive: boolean
}

function Surface({
  children,
  className = "",
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={`rounded-[28px] border border-[rgba(55,50,47,0.08)] bg-[#FCFBFA] shadow-[0px_20px_60px_rgba(55,50,47,0.06)] ${className}`}
    >
      {children}
    </div>
  )
}

function SkeletonLine({
  className = "",
  delay = "0s",
  duration = "3.6s",
}: {
  className?: string
  delay?: string
  duration?: string
}) {
  return (
    <div
      className={`rounded-full bg-[linear-gradient(90deg,#F1ECE7_0%,#FFF6F0_50%,#F1ECE7_100%)] animate-pulse ${className}`}
      style={{ animationDelay: delay, animationDuration: duration }}
    />
  )
}

function StepDot({
  active,
  delay = "0s",
}: {
  active?: boolean
  delay?: string
}) {
  return (
    <div
      className={`size-3 rounded-full border border-[rgba(55,50,47,0.14)] ${
        active ? "bg-[#FF5500] shadow-[0px_0px_0px_6px_rgba(255,85,0,0.10)] animate-pulse" : "bg-white"
      }`}
      style={{ animationDelay: delay, animationDuration: "3.2s" }}
    />
  )
}

export function WorkflowHeroVisual({ isActive }: LandingHeroVisualProps) {
  return (
    <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_top,#FFF4EE_0%,#F9F5F2_42%,#F7F5F3_100%)] p-4 sm:p-6 md:p-8 lg:p-10">
      <Surface className="relative h-full w-full overflow-hidden p-4 sm:p-5 md:p-6 lg:p-8">
        <div className="pointer-events-none absolute inset-x-6 top-0 h-24 bg-[radial-gradient(circle_at_center,rgba(255,85,0,0.12),transparent_72%)] blur-3xl" />

        <div className="relative z-10 flex h-full flex-col gap-3 sm:gap-4">
          <div className="flex items-center justify-between gap-3">
            <SkeletonLine className="h-8 w-28 sm:w-36" />

            <div className="flex items-center gap-2">
              <SkeletonLine className="h-8 w-12 rounded-2xl" delay="0.2s" />
              <SkeletonLine className="h-8 w-16 rounded-2xl" delay="0.35s" />
              <div
                className={`h-8 w-8 rounded-2xl border border-[#FF5500]/20 bg-[#FFEFE7] ${
                  isActive ? "animate-pulse" : ""
                }`}
                style={{ animationDuration: "4.4s" }}
              />
            </div>
          </div>

          <div className="grid flex-1 grid-cols-2 gap-3 md:grid-cols-4">
            {[0, 1, 2, 3].map((columnIndex) => (
              <div
                key={columnIndex}
                className="rounded-[22px] border border-[rgba(55,50,47,0.08)] bg-white/85 p-3 sm:p-4"
              >
                <div className="mb-3 flex items-center justify-between gap-2">
                  <SkeletonLine className="h-3 w-14 sm:w-16" delay={`${columnIndex * 0.15}s`} />
                  <div className="size-2 rounded-full bg-[#37322F]/12" />
                </div>

                <div className="space-y-3">
                  {[0, 1, 2].map((cardIndex) => {
                    const isHighlighted = columnIndex === 1 && cardIndex === 0

                    return (
                      <div
                        key={cardIndex}
                        className={`rounded-[18px] border bg-[#FCFBFA] p-3 transition-all duration-500 ${
                          isHighlighted
                            ? "border-[#FF5500]/30 shadow-[0px_10px_30px_rgba(255,85,0,0.10)]"
                            : "border-[rgba(55,50,47,0.08)]"
                        } ${isHighlighted && isActive ? "animate-pulse" : ""}`}
                        style={{
                          animationDuration: "4.8s",
                          animationDelay: `${cardIndex * 0.2}s`,
                          transform:
                            isHighlighted && isActive
                              ? "translateY(-2px)"
                              : columnIndex === 0 && cardIndex === 2
                                ? "translateX(4px)"
                                : "translateX(0)",
                        }}
                      >
                        <div className="mb-2 flex items-center gap-2">
                          <div className="size-5 rounded-full bg-[#FFEFE7]" />
                          <SkeletonLine className="h-2.5 flex-1" delay={`${cardIndex * 0.1}s`} />
                        </div>
                        <SkeletonLine className="mb-2 h-2.5 w-4/5" delay="0.15s" />
                        <div className="flex items-center gap-2">
                          <StepDot active={isHighlighted && isActive} delay="0.25s" />
                          <SkeletonLine className="h-2 w-full" delay="0.2s" />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {[0, 1, 2].map((itemIndex) => (
              <div
                key={itemIndex}
                className="rounded-[18px] border border-[rgba(55,50,47,0.08)] bg-white/70 p-3"
                style={{
                  transform: itemIndex === 1 ? "translateY(-6px)" : "translateY(0)",
                }}
              >
                <SkeletonLine className="mb-2 h-2.5 w-2/3" delay={`${itemIndex * 0.16}s`} />
                <SkeletonLine className="h-2 w-full" delay={`${itemIndex * 0.21}s`} />
              </div>
            ))}
          </div>
        </div>
      </Surface>
    </div>
  )
}

export function AutomationHeroVisual({ isActive }: LandingHeroVisualProps) {
  return (
    <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_center,#FFF2EA_0%,#F8F3EF_46%,#F7F5F3_100%)] p-4 sm:p-6 md:p-8 lg:p-10">
      <Surface className="relative h-full w-full overflow-hidden p-4 sm:p-5 md:p-6 lg:p-8">
        <div className="grid h-full grid-cols-[1fr_auto_1fr] items-center gap-3 sm:gap-4 md:gap-6">
          <div className="space-y-3">
            {[0, 1, 2].map((sourceIndex) => (
              <div
                key={sourceIndex}
                className="rounded-[20px] border border-[rgba(55,50,47,0.08)] bg-white/80 p-3 sm:p-4"
              >
                <div className="mb-2 flex items-center gap-2">
                  <div
                    className={`size-2.5 rounded-full bg-[#37322F]/15 ${
                      isActive ? "animate-pulse" : ""
                    }`}
                    style={{
                      animationDelay: `${sourceIndex * 0.28}s`,
                      animationDuration: "3.8s",
                    }}
                  />
                  <SkeletonLine className="h-2.5 w-2/3" delay={`${sourceIndex * 0.18}s`} />
                </div>
                <SkeletonLine className="h-2 w-full" delay="0.2s" />
              </div>
            ))}
          </div>

          <div className="relative flex h-full min-h-[180px] items-center justify-center">
            <div className="absolute left-[-28px] right-[-28px] top-1/2 h-px -translate-y-1/2 bg-[linear-gradient(90deg,rgba(55,50,47,0.08),rgba(255,85,0,0.28),rgba(55,50,47,0.08))]" />

            <div
              className={`absolute size-3 rounded-full bg-[#FF5500] ${
                isActive ? "animate-ping" : ""
              }`}
              style={{ left: "-10px", animationDuration: "3s" }}
            />

            <div
              className={`absolute size-3 rounded-full bg-[#FF5500] ${
                isActive ? "animate-ping" : ""
              }`}
              style={{ right: "-10px", animationDuration: "3s", animationDelay: "0.8s" }}
            />

            <div
              className={`absolute size-[156px] rounded-full border border-[rgba(55,50,47,0.08)] ${
                isActive ? "animate-spin" : ""
              }`}
              style={{ animationDuration: "18s" }}
            />
            <div className="absolute size-[112px] rounded-full border border-[#FF5500]/18" />
            <div className="absolute size-[76px] rounded-full bg-[#37322F] shadow-[0px_18px_50px_rgba(55,50,47,0.20)]" />
            <div className="absolute size-8 rounded-full border border-white/40" />
          </div>

          <div className="space-y-3">
            {[0, 1, 2].map((outputIndex) => (
              <div
                key={outputIndex}
                className={`rounded-[20px] border bg-white/88 p-3 sm:p-4 transition-all duration-500 ${
                  outputIndex === 1
                    ? "border-[#FF5500]/25 shadow-[0px_14px_34px_rgba(255,85,0,0.10)]"
                    : "border-[rgba(55,50,47,0.08)]"
                } ${outputIndex === 1 && isActive ? "animate-pulse" : ""}`}
                style={{
                  animationDuration: "4.6s",
                  animationDelay: `${outputIndex * 0.24}s`,
                }}
              >
                <div className="mb-2 flex items-center justify-between gap-2">
                  <SkeletonLine className="h-2.5 w-2/3" delay={`${outputIndex * 0.16}s`} />
                  <div className="size-5 rounded-full bg-[#FFEFE7]" />
                </div>
                <SkeletonLine className="mb-2 h-2 w-full" delay="0.2s" />
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-[#FF5500]" />
                  <SkeletonLine className="h-2 w-3/4" delay="0.25s" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Surface>
    </div>
  )
}

export function NotificationsHeroVisual({ isActive }: LandingHeroVisualProps) {
  return (
    <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_top_right,#FFF0E6_0%,#F8F3EF_44%,#F7F5F3_100%)] p-4 sm:p-6 md:p-8 lg:p-10">
      <Surface className="relative h-full w-full overflow-hidden p-4 sm:p-5 md:p-6 lg:p-8">
        <div className="grid h-full grid-cols-1 gap-4 md:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[24px] border border-[rgba(55,50,47,0.08)] bg-white/88 p-4 sm:p-5">
            <SkeletonLine className="mb-4 h-3 w-1/2" />

            <div className="relative ml-2 flex h-[220px] flex-col justify-between">
              <div className="absolute bottom-4 left-[5px] top-4 w-px bg-[rgba(55,50,47,0.08)]" />

              {[0, 1, 2, 3].map((stepIndex) => (
                <div key={stepIndex} className="relative flex items-start gap-3">
                  <StepDot
                    active={stepIndex === 2}
                    delay={`${stepIndex * 0.18}s`}
                  />
                  <div className="flex-1 rounded-[18px] border border-[rgba(55,50,47,0.08)] bg-[#FCFBFA] p-3">
                    <SkeletonLine className="mb-2 h-2.5 w-2/3" delay={`${stepIndex * 0.14}s`} />
                    <SkeletonLine className="h-2 w-full" delay={`${stepIndex * 0.18}s`} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative flex h-full items-center justify-center">
            <div className="relative h-full w-full">
              {[
                "top-8 left-4 md:left-8",
                "top-24 right-0 md:right-4",
                "bottom-20 left-8 md:left-16",
                "bottom-6 right-6 md:right-10",
              ].map((position, index) => (
                <div
                  key={position}
                  className={`absolute ${position} w-[180px] rounded-[22px] border bg-white/90 p-4 shadow-[0px_20px_40px_rgba(55,50,47,0.08)] ${
                    index === 1 ? "border-[#FF5500]/20" : "border-[rgba(55,50,47,0.08)]"
                  } ${isActive ? "animate-pulse" : ""}`}
                  style={{
                    animationDuration: "4.8s",
                    animationDelay: `${index * 0.32}s`,
                    transform:
                      index % 2 === 0 ? "rotate(-2deg)" : "rotate(2deg)",
                  }}
                >
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <div className="size-8 rounded-full bg-[#FFEFE7]" />
                      <SkeletonLine className="h-2.5 w-16" delay={`${index * 0.14}s`} />
                    </div>
                    <div
                      className={`size-2 rounded-full bg-[#FF5500] ${
                        index === 1 && isActive ? "animate-ping" : ""
                      }`}
                      style={{ animationDuration: "2.8s" }}
                    />
                  </div>
                  <SkeletonLine className="mb-2 h-2.5 w-full" delay="0.18s" />
                  <SkeletonLine className="h-2 w-4/5" delay="0.24s" />
                </div>
              ))}

              <div className="absolute inset-[18%] rounded-[28px] border border-dashed border-[rgba(255,85,0,0.18)]" />
            </div>
          </div>
        </div>
      </Surface>
    </div>
  )
}
