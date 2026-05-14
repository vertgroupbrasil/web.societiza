import type { ReactNode } from "react"

type LandingFrameProps = {
  children: ReactNode
}

export function LandingFrame({ children }: LandingFrameProps) {
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-start overflow-x-hidden bg-background">
      <div className="relative flex flex-col justify-start items-center w-full">
        <div className="w-full max-w-none px-4 sm:px-6 md:px-8 lg:px-0 lg:max-w-[1060px] lg:w-[1060px] relative flex flex-col justify-start items-start min-h-screen">
          <div className="absolute left-4 top-0 z-0 h-full w-px bg-border shadow-[1px_0px_0px_rgba(255,255,255,0.9)] sm:left-6 md:left-8 lg:left-0" />
          <div className="absolute right-4 top-0 z-0 h-full w-px bg-border shadow-[1px_0px_0px_rgba(255,255,255,0.9)] sm:right-6 md:right-8 lg:right-0" />

          <div className="relative z-10 flex self-stretch flex-col items-center justify-center gap-4 overflow-hidden border-b border-border/60 pt-[9px] sm:gap-6 md:gap-8 lg:gap-[66px]">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
