"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"

const C = {
  bg: "#F7F5F3",
  surface: "#FFFFFF",
  border: "rgba(55, 50, 47, 0.10)",
  muted: "rgba(55, 50, 47, 0.35)",
  text: "#37322F",
  sub: "#605A57",
  orange: "#FF5500",
  orangeBg: "#FFEFE7",
  green: "#16A34A",
  greenBg: "#DCFCE7",
  amber: "#D97706",
  amberBg: "#FEF3C7",
}

const stages = [
  { label: "Doc." },
  { label: "Viab." },
  { label: "Reg." },
  { label: "Alvará" },
  { label: "Ok" },
]

// 0 – etapas 0+1 done, 2 active
// 1 – etapa 2 completa
// 2 – etapa 3 ativa
// 3 – toast aparece
// 4 – hold
// 5 – reset
const DURATIONS = [900, 700, 500, 800, 1600, 400]

function StageNode({ state }: { state: "done" | "active" | "idle" }) {
  return (
    <motion.div
      className="rounded-full flex items-center justify-center shrink-0"
      style={{
        width: 18, height: 18,
        backgroundColor: state === "done" ? C.orange : state === "active" ? C.orangeBg : C.surface,
        border: `1.5px solid ${state === "idle" ? C.border : C.orange}`,
      }}
      animate={{ scale: state === "active" ? 1.18 : 1 }}
      transition={{ duration: 0.3 }}
    >
      {state === "done" && (
        <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
          <path d="M2 4L3.5 5.5L6.5 2.5" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
      {state === "active" && (
        <motion.div className="rounded-full" style={{ width: 5, height: 5, backgroundColor: C.orange }}
          animate={{ scale: [1, 1.4, 1] }} transition={{ duration: 1, repeat: Infinity }} />
      )}
    </motion.div>
  )
}

function Connector({ filled }: { filled: boolean }) {
  return (
    <div className="flex-1 h-[1.5px] mx-0.5 rounded-full overflow-hidden" style={{ backgroundColor: C.border }}>
      <motion.div className="h-full rounded-full origin-left" style={{ backgroundColor: C.orange }}
        initial={{ scaleX: 0 }} animate={{ scaleX: filled ? 1 : 0 }}
        transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }} />
    </div>
  )
}

function Toast({ visible }: { visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="flex items-start gap-2 rounded-xl  border px-3 py-2.5"
          style={{ backgroundColor: C.surface, border: `1px solid ${C.border}` }}
          initial={{ opacity: 0, y: 10, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 4 }}
          transition={{ duration: 0.38, ease: [0.34, 1.56, 0.64, 1] }}
        >
          <div className="rounded-md flex items-center justify-center shrink-0"
            style={{ width: 24, height: 24, backgroundColor: C.orangeBg }}>
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
              <rect x="1" y="5" width="9" height="5.5" rx="0.7" stroke={C.orange} strokeWidth="1" />
              <path d="M0.5 5L5.5 1.5L10.5 5" stroke={C.orange} strokeWidth="1" strokeLinecap="round" />
            </svg>
          </div>
          <div className="flex flex-col gap-0.5">
            <p className="text-[9.5px] font-semibold leading-none" style={{ color: C.text }}>Processo avançou</p>
            <p className="text-[8.5px] leading-snug" style={{ color: C.sub }}>
              Padaria do Pedro entrou em{" "}
              <span style={{ color: C.orange, fontWeight: 600 }}>Registro</span>
            </p>
            <p className="text-[8px] mt-0.5" style={{ color: C.muted }}>Escritório Almeida · agora</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function VisualProgressTimeline() {
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    let cur = 0
    let t: NodeJS.Timeout
    const run = () => { setPhase(cur); t = setTimeout(() => { cur = (cur + 1) % DURATIONS.length; run() }, DURATIONS[cur]) }
    run()
    return () => clearTimeout(t)
  }, [])

  const stateOf = (i: number): "done" | "active" | "idle" => {
    if (phase <= 0) return i <= 1 ? "done" : i === 2 ? "active" : "idle"
    if (phase === 1) return i <= 2 ? "done" : i === 3 ? "idle" : "idle"
    return i <= 2 ? "done" : i === 3 ? "active" : "idle"
  }

  const conn = [true, true, phase >= 1, false]
  const showToast = phase >= 3 && phase <= 4
  const activeStage = phase <= 0 ? "Viabilidade" : "Registro"

  return (
    <div className="w-full h-full flex flex-col overflow-hidden" style={{ backgroundColor: C.surface }}>
      {/* Chrome */}
      <div className="flex items-center gap-1.5 px-3 py-2.5 shrink-0" style={{ backgroundColor: '#F4F2F0', borderBottom: `1px solid ${C.border}` }}>
        <div className="rounded-full" style={{ width: 7, height: 7, backgroundColor: "#FC645F" }} />
        <div className="rounded-full" style={{ width: 7, height: 7, backgroundColor: "#FDBC40" }} />
        <div className="rounded-full" style={{ width: 7, height: 7, backgroundColor: "#34C84A" }} />
      </div>

      <div className="flex-1 p-4 flex flex-col gap-4 relative" style={{ backgroundColor: C.bg }}>
        {/* Company */}
        <div className="rounded-lg border px-3 py-2.5" style={{ backgroundColor: C.surface, border: `1px solid ${C.border}` }}>
          <p className="text-[11px] font-semibold" style={{ color: C.text }}>Padaria do Pedro</p>
          <p className="text-[8.5px] mt-0.5" style={{ color: C.muted }}>Abertura · Simples</p>
        </div>

        {/* Timeline */}
        <div className="flex items-center px-1">
          {stages.map((s, i) => (
            <div key={i} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-1">
                <StageNode state={stateOf(i)} />
                <span className="text-[7px] leading-none text-center"
                  style={{ color: stateOf(i) !== "idle" ? C.sub : C.muted, fontWeight: stateOf(i) === "active" ? 600 : 400, maxWidth: 30 }}>
                  {s.label}
                </span>
              </div>
              {i < stages.length - 1 && (
                <div className="flex-1 mb-4"><Connector filled={conn[i]} /></div>
              )}
            </div>
          ))}
        </div>

        {/* Active stage pill */}
        <div className="rounded-lg px-2.5 py-2" style={{ backgroundColor: C.orangeBg, border: `1px solid ${C.orange}20` }}>
          <p className="text-[9px] font-semibold" style={{ color: C.orange }}>{activeStage} · Em andamento</p>
          <p className="text-[8px] mt-0.5" style={{ color: "rgba(255,85,0,0.65)" }}>Previsão: em breve</p>
        </div>

        {/* Toast — posição absoluta para não afetar o layout */}
        <div className="absolute bottom-4 left-4 right-4">
          <Toast visible={showToast} />
        </div>
      </div>
    </div>
  )
}
