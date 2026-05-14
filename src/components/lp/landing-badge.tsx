import type React from "react"

type LandingBadgeProps = {
  icon: React.ReactNode
  text: string
}

export function LandingBadge({ icon, text }: LandingBadgeProps) {
  return (
    <div className="px-[14px] py-[6px] bg-card shadow-[0px_0px_0px_4px_rgba(255,85,0,0.05)] overflow-hidden rounded-[90px] flex justify-start items-center gap-[8px] border border-border/70 shadow-xs">
      <div className="w-[14px] h-[14px] relative overflow-hidden flex items-center justify-center">
        {icon}
      </div>
      <div className="text-center flex justify-center flex-col text-foreground text-xs font-medium leading-3 font-sans">
        {text}
      </div>
    </div>
  )
}
