"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"

// Design tokens from config
const colors = {
  background: "#F7F5F3",
  surface: "#FFFFFF",
  stroke: "#37322F",
  strokeSecondary: "#605A57",
  borderSoft: "rgba(55, 50, 47, 0.12)",
  primary: "#FF5500",
  accentBg: "#FFEFE7",
}

// Skeleton components
function SkeletonLine({ width = "100%", height = 8 }: { width?: string | number; height?: number }) {
  return (
    <div
      className="rounded-full"
      style={{
        width,
        height,
        backgroundColor: "rgba(55, 50, 47, 0.08)",
      }}
    />
  )
}

function SkeletonPill({ width = 48, highlighted = false }: { width?: number; highlighted?: boolean }) {
  return (
    <div
      className="rounded-full"
      style={{
        width,
        height: 6,
        backgroundColor: highlighted ? colors.accentBg : "rgba(55, 50, 47, 0.06)",
        border: highlighted ? `1px solid ${colors.primary}` : "none",
      }}
    />
  )
}

function SkeletonAvatar({ size = 16 }: { size?: number }) {
  return (
    <div
      className="rounded-full"
      style={{
        width: size,
        height: size,
        backgroundColor: "rgba(55, 50, 47, 0.1)",
      }}
    />
  )
}

function CheckItem({ completed = false, delay = 0 }: { completed?: boolean; delay?: number }) {
  return (
    <motion.div
      className="flex items-center gap-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay, duration: 0.3 }}
    >
      <motion.div
        className="rounded-full flex items-center justify-center"
        style={{
          width: 10,
          height: 10,
          border: `1.5px solid ${completed ? colors.primary : "rgba(55, 50, 47, 0.2)"}`,
          backgroundColor: completed ? colors.primary : "transparent",
        }}
        animate={completed ? { scale: [1, 1.2, 1] } : {}}
        transition={{ duration: 0.3, delay }}
      >
        {completed && (
          <motion.svg
            width="6"
            height="6"
            viewBox="0 0 6 6"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.2, delay: delay + 0.1 }}
          >
            <motion.path
              d="M1 3L2.5 4.5L5 1.5"
              stroke="white"
              strokeWidth="1"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </motion.svg>
        )}
      </motion.div>
      <SkeletonLine width={Math.random() * 20 + 24} height={5} />
    </motion.div>
  )
}

// Process Card component
function ProcessCard({
  expanded = false,
  highlighted = false,
  moving = false,
  variant = "default",
  checkCompleted = false,
}: {
  expanded?: boolean
  highlighted?: boolean
  moving?: boolean
  variant?: "default" | "small" | "medium"
  checkCompleted?: boolean
}) {
  const heights = {
    default: expanded ? 88 : 52,
    small: 36,
    medium: 44,
  }

  return (
    <motion.div
      className="rounded-lg overflow-hidden"
      style={{
        backgroundColor: colors.surface,
        border: `1px solid ${highlighted ? colors.primary : colors.borderSoft}`,
        boxShadow: highlighted
          ? `0 0 0 3px ${colors.accentBg}, 0 4px 12px rgba(255, 85, 0, 0.08)`
          : moving
            ? "0 8px 24px rgba(55, 50, 47, 0.12)"
            : "0 1px 3px rgba(55, 50, 47, 0.04)",
      }}
      animate={{
        height: heights[variant],
      }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className="p-2.5 flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SkeletonAvatar size={14} />
            <SkeletonLine width={variant === "small" ? 32 : 48} height={6} />
          </div>
          {variant !== "small" && <SkeletonPill width={24} highlighted={highlighted} />}
        </div>

        <AnimatePresence>
          {expanded && variant === "default" && (
            <motion.div
              className="flex flex-col gap-1.5 mt-1"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <SkeletonLine width="80%" height={5} />
              <SkeletonPill width={36} />
              <div className="flex flex-col gap-1 mt-0.5">
                <CheckItem completed={checkCompleted} delay={0.2} />
                <CheckItem completed={false} delay={0.3} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

// Column component
function Column({
  cards,
  highlightedIndex = -1,
  expandedIndex = -1,
  movingIndex = -1,
  checkCompleted = false,
  receiving = false,
}: {
  cards: Array<{ variant: "default" | "small" | "medium" }>
  highlightedIndex?: number
  expandedIndex?: number
  movingIndex?: number
  checkCompleted?: boolean
  receiving?: boolean
}) {
  return (
    <motion.div
      className="flex flex-col gap-2 flex-1 min-w-0"
      animate={{
        scale: receiving ? 1.01 : 1,
      }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* Column header skeleton */}
      <div className="flex items-center justify-between px-1 mb-1">
        <SkeletonLine width={48} height={6} />
        <div
          className="rounded-full px-1.5 py-0.5"
          style={{ backgroundColor: "rgba(55, 50, 47, 0.06)" }}
        >
          <SkeletonLine width={12} height={5} />
        </div>
      </div>

      {/* Cards */}
      <div className="flex flex-col gap-2">
        {cards.map((card, index) => (
          <ProcessCard
            key={index}
            variant={card.variant}
            highlighted={index === highlightedIndex}
            expanded={index === expandedIndex}
            moving={index === movingIndex}
            checkCompleted={index === expandedIndex && checkCompleted}
          />
        ))}
      </div>
    </motion.div>
  )
}

// Top bar skeleton
function TopBar() {
  return (
    <div
      className="flex items-center justify-between px-3 py-2 border-b"
      style={{ borderColor: colors.borderSoft }}
    >
      <div className="flex items-center gap-3">
        {/* Window controls */}
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "rgba(55, 50, 47, 0.12)" }} />
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "rgba(55, 50, 47, 0.12)" }} />
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "rgba(55, 50, 47, 0.12)" }} />
        </div>

        {/* Search skeleton */}
        <div
          className="flex items-center gap-2 px-2.5 py-1.5 rounded-md"
          style={{ backgroundColor: "rgba(55, 50, 47, 0.04)" }}
        >
          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: "rgba(55, 50, 47, 0.15)" }} />
          <SkeletonLine width={64} height={5} />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <SkeletonPill width={40} />
        <SkeletonPill width={32} />
        <SkeletonAvatar size={20} />
      </div>
    </div>
  )
}

// Moving card overlay
function MovingCard({
  isVisible,
  fromX,
  toX,
}: {
  isVisible: boolean
  fromX: number
  toX: number
}) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="absolute z-20"
          style={{ top: 80 }}
          initial={{ x: fromX, opacity: 1 }}
          animate={{ x: toX, opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
        >
          <ProcessCard variant="default" expanded={true} highlighted={true} moving={true} checkCompleted={true} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Context detail overlay
function ContextDetail({ isVisible }: { isVisible: boolean }) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="absolute right-4 top-16 z-10 p-3 rounded-lg"
          style={{
            backgroundColor: colors.surface,
            border: `1px solid ${colors.borderSoft}`,
            boxShadow: "0 4px 16px rgba(55, 50, 47, 0.08)",
            width: 120,
          }}
          initial={{ opacity: 0, x: 10, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 10, scale: 0.95 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        >
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-1.5">
              <div
                className="w-1 h-1 rounded-full"
                style={{ backgroundColor: colors.primary }}
              />
              <SkeletonLine width={48} height={5} />
            </div>
            <SkeletonLine width="90%" height={4} />
            <SkeletonLine width="70%" height={4} />
            <div className="h-px" style={{ backgroundColor: colors.borderSoft }} />
            <div className="flex items-center gap-1">
              <SkeletonAvatar size={12} />
              <SkeletonLine width={32} height={4} />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function VisualCentralizedFlow() {
  const [phase, setPhase] = useState(0)

  // Animation phases:
  // 0: Initial fade in (0-600ms)
  // 1: Card highlight (600-1200ms)
  // 2: Card expand with details (1200-2000ms)
  // 3: Check item complete (2000-2400ms)
  // 4: Card moving (2400-2850ms)
  // 5: Column reorganize (2850-3200ms)
  // 6: Context detail appears (3200-4000ms)
  // 7: Idle (4000-4800ms)
  // 8: Reset/crossfade (4800-5200ms)

  useEffect(() => {
    const phases = [600, 600, 800, 400, 450, 350, 800, 800, 400]
    let currentPhase = 0
    let timeout: NodeJS.Timeout

    const runPhase = () => {
      setPhase(currentPhase)
      timeout = setTimeout(() => {
        currentPhase = (currentPhase + 1) % phases.length
        runPhase()
      }, phases[currentPhase])
    }

    runPhase()
    return () => clearTimeout(timeout)
  }, [])

  const isInitializing = phase === 0
  const isHighlighted = phase >= 1 && phase < 4
  const isExpanded = phase >= 2 && phase < 4
  const isCheckCompleted = phase >= 3 && phase < 4
  const isMoving = phase === 4
  const isReorganizing = phase >= 5 && phase < 8
  const showContext = phase >= 6 && phase < 8
  const isIdle = phase === 7

  // Column configurations
  const column1Cards: Array<{ variant: "default" | "small" | "medium" }> = [
    { variant: "default" },
    { variant: "small" },
    { variant: "medium" },
  ]

  const column2Cards: Array<{ variant: "default" | "small" | "medium" }> = [
    { variant: "medium" },
    { variant: "default" },
    { variant: "small" },
  ]

  const column3Cards: Array<{ variant: "default" | "small" | "medium" }> = [
    { variant: "small" },
    { variant: "medium" },
    { variant: "default" },
  ]

  const column4Cards: Array<{ variant: "default" | "small" | "medium" }> = [
    { variant: "default" },
    { variant: "small" },
  ]

  return (
    <div className="w-full aspect-[1.35/1] md:aspect-[16/10] relative">
      <motion.div
        className="w-full h-full rounded-2xl md:rounded-3xl overflow-hidden relative"
        style={{
          backgroundColor: colors.background,
          border: `1px solid ${colors.borderSoft}`,
          boxShadow: "0 2px 8px rgba(55, 50, 47, 0.04)",
        }}
        initial={{ opacity: 0.6 }}
        animate={{ opacity: isInitializing ? 0.8 : 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Main panel */}
        <div
          className="absolute inset-2 md:inset-4 rounded-xl md:rounded-2xl overflow-hidden"
          style={{
            backgroundColor: colors.surface,
            border: `1px solid ${colors.borderSoft}`,
            boxShadow: "0 1px 4px rgba(55, 50, 47, 0.03)",
          }}
        >
          {/* Top bar */}
          <TopBar />

          {/* Columns container */}
          <div className="p-3 md:p-4 h-[calc(100%-44px)] overflow-hidden">
            <div className="flex gap-3 md:gap-4 h-full relative">
              {/* Column 1 */}
              <motion.div
                className="flex-1 min-w-0"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0 }}
              >
                <Column
                  cards={isMoving || isReorganizing ? column1Cards.slice(1) : column1Cards}
                  highlightedIndex={isHighlighted && !isMoving ? 0 : -1}
                  expandedIndex={isExpanded && !isMoving ? 0 : -1}
                  checkCompleted={isCheckCompleted}
                />
              </motion.div>

              {/* Column 2 */}
              <motion.div
                className="flex-1 min-w-0"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <Column
                  cards={isReorganizing ? [{ variant: "default" }, ...column2Cards] : column2Cards}
                  receiving={isMoving}
                  highlightedIndex={isReorganizing ? 0 : -1}
                  expandedIndex={isReorganizing ? 0 : -1}
                  checkCompleted={isReorganizing}
                />
              </motion.div>

              {/* Column 3 */}
              <motion.div
                className="flex-1 min-w-0 hidden md:flex"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.12 }}
              >
                <Column cards={column3Cards} />
              </motion.div>

              {/* Column 4 */}
              <motion.div
                className="flex-1 min-w-0 hidden lg:flex"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.14 }}
              >
                <Column cards={column4Cards} />
              </motion.div>

              {/* Moving card overlay */}
              <div className="absolute inset-0 pointer-events-none">
                <MovingCard
                  isVisible={isMoving}
                  fromX={0}
                  toX={160}
                />
              </div>

              {/* Context detail */}
              <ContextDetail isVisible={showContext} />
            </div>
          </div>
        </div>

        {/* Subtle ambient gradient */}
        <div
          className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
          style={{
            background: `linear-gradient(to top, ${colors.background}, transparent)`,
            opacity: 0.4,
          }}
        />
      </motion.div>
    </div>
  )
}
