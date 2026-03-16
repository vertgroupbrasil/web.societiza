"use client"

import { cn } from "@societiza/lib/utils"

interface GridSectionProps {
  children: React.ReactNode
  className?: string
  /** Is this the first/hero section? If true, no top separator is shown */
  isHero?: boolean
}

function GridCross({ className }: { className?: string }) {
  return (
    <svg
      className={cn("h-4 w-4 text-muted-foreground/60", className)}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M8 0V16M0 8H16" stroke="currentColor" strokeWidth="1" />
    </svg>
  )
}

/** 
 * Separator component with diagonal stripe pattern 
 * Appears between sections to create visual break
 */
export function GridSeparator({ className }: { className?: string }) {
  return (
    <div className={cn("relative", className)}>
      {/* Vertical Lines - continuous through separator */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute left-8 top-0 h-full w-px bg-border/50 sm:left-12 lg:left-24" />
        <div className="absolute right-8 top-0 h-full w-px bg-border/50 sm:right-12 lg:right-24" />
      </div>

      {/* Top Horizontal Line with Crosses */}
      <div className="pointer-events-none absolute left-0 right-0 top-0" aria-hidden="true">
        <div className="absolute left-8 right-8 top-0 h-px bg-border/50 sm:left-12 sm:right-12 lg:left-24 lg:right-24" />
        <GridCross className="absolute left-8 top-0 -translate-x-1/2 -translate-y-1/2 sm:left-12 lg:left-24" />
        <GridCross className="absolute right-8 top-0 translate-x-1/2 -translate-y-1/2 sm:right-12 lg:right-24" />
      </div>

      {/* Diagonal Stripe Pattern Background */}
      <div className="relative h-10 w-full sm:h-12 lg:h-16">
        {/* Left vertical cut (white space) */}
        <div className="absolute left-0 top-0 z-10 h-full w-8 bg-background sm:w-12 lg:w-24" />
        
        {/* Right vertical cut (white space) */}
        <div className="absolute right-0 top-0 z-10 h-full w-8 bg-background sm:w-12 lg:w-24" />
        
        {/* Diagonal stripe pattern area */}
        <div
          className="absolute inset-0 left-8 right-8 sm:left-12 sm:right-12 lg:left-24 lg:right-24"
          style={{
            backgroundImage: `repeating-linear-gradient(
              -45deg,
              transparent,
              transparent 8px,
              rgba(156, 163, 175, 0.25) 8px,
              rgba(156, 163, 175, 0.25) 9px
            )`,
          }}
        />
      </div>

      {/* Bottom Horizontal Line with Crosses */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0" aria-hidden="true">
        <div className="absolute bottom-0 left-8 right-8 h-px bg-border/50 sm:left-12 sm:right-12 lg:left-24 lg:right-24" />
        <GridCross className="absolute bottom-0 left-8 -translate-x-1/2 translate-y-1/2 sm:left-12 lg:left-24" />
        <GridCross className="absolute bottom-0 right-8 translate-x-1/2 translate-y-1/2 sm:right-12 lg:right-24" />
      </div>
    </div>
  )
}

export function GridSection({
  children,
  className,
  isHero = false,
}: GridSectionProps) {
  return (
    <>
      {/* Separator with pattern - only show if not hero section */}
      {!isHero && <GridSeparator />}

      <section className={cn("relative", isHero && "overflow-hidden", className)}>
        {/* Vertical Lines */}
        <div className={cn("pointer-events-none absolute inset-0", isHero && "z-20")} aria-hidden="true">
          <div className="absolute left-8 top-0 h-full w-px bg-border/50 sm:left-12 lg:left-24" />
          <div className="absolute right-8 top-0 h-full w-px bg-border/50 sm:right-12 lg:right-24" />
        </div>

        {/* Right-side mask: visible only on hero, clips overflow content at the vertical line */}
        {isHero && (
          <div
            className="pointer-events-none absolute right-0 top-0 z-10 h-full w-8 bg-background sm:w-12 lg:w-24"
            aria-hidden="true"
          />
        )}

        {/* Top Horizontal Line with Crosses - only for hero */}
        {isHero && (
          <div className="py-32 pointer-events-none absolute left-0 right-0 top-0" aria-hidden="true">
            <div className="absolute left-6 right-6 top-0 h-px bg-border/50 sm:left-8 sm:right-8 lg:left-24 lg:right-24" />
            <GridCross className="absolute left-8 top-0 -translate-x-1/2 -translate-y-1/2 sm:left-12 lg:left-24" />
            <GridCross className="absolute right-8 top-0 translate-x-1/2 -translate-y-1/2 sm:right-12 lg:right-24" />
          </div>
        )}

        {/* Content Area */}
        <div className="relative px-24 py-24 sm:px-24 sm:py-16 lg:px-32 lg:py-8">
          <div className="mx-auto max-w-7xl">{children}</div>
        </div>
      </section>
    </>
  )
}

interface LandingGridProps {
  children: React.ReactNode
  className?: string
}

export function LandingGrid({ children, className }: LandingGridProps) {
  return (
    <div className={cn("relative bg-background", className)}>
      {children}
    </div>
  )
}

// Helper component for full-width sections that break out of the grid
interface GridBreakoutProps {
  children: React.ReactNode
  className?: string
}

export function GridBreakout({ children, className }: GridBreakoutProps) {
  return (
    <div className={cn("relative -mx-8 sm:-mx-12 lg:-mx-16", className)}>
      {children}
    </div>
  )
}
