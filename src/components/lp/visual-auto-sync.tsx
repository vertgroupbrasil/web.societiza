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
  chrome: "#F4F2F0",
}

// 0 – card monitorando, status "Em análise"
// 1 – status → "Aprovada"
// 2 – notif contador
// 3 – notif cliente
// 4 – hold
// 5 – reset
const DURATIONS = [1400, 800, 650, 650, 1600, 500]

function MonitorCard({ approved }: { approved: boolean }) {
  return (
    <div className="rounded-xl border p-3 flex flex-col gap-2.5"
      style={{ backgroundColor: C.surface, border: `1px solid ${C.border}` }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="rounded-md flex items-center justify-center shrink-0"
            style={{ width: 24, height: 24, backgroundColor: "rgba(55,50,47,0.05)" }}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <rect x="1.5" y="5.5" width="9" height="6" rx="0.6" stroke={C.muted} strokeWidth="1" />
              <path d="M0.5 5.5L6 1.5L11.5 5.5" stroke={C.muted} strokeWidth="1" strokeLinecap="round" />
              <rect x="4.5" y="8" width="3" height="3.5" rx="0.4" fill={C.muted} />
            </svg>
          </div>
          <div>
            <p className="text-[9.5px] font-semibold leading-none" style={{ color: C.text }}>Viabilidade · Prefeitura SC</p>
            <p className="text-[8px] mt-0.5 leading-none" style={{ color: C.muted }}>Padaria do João</p>
          </div>
        </div>
        <div className="flex items-center gap-1 rounded-full px-2 py-1"
          style={{ backgroundColor: C.orangeBg, border: `0.5px solid ${C.orange}30` }}>
          <motion.svg width="8" height="8" viewBox="0 0 8 8" fill="none"
            animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
            <path d="M4 1C5.66 1 7 2.34 7 4" stroke={C.orange} strokeWidth="1" strokeLinecap="round" />
            <path d="M4 7C2.34 7 1 5.66 1 4" stroke={C.orange} strokeWidth="1" strokeLinecap="round" />
          </motion.svg>
          <span className="text-[7.5px] font-medium" style={{ color: C.orange }}>Verficação automática</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-[8px]" style={{ color: C.muted }}>Status:</span>
        <AnimatePresence mode="wait">
          {approved ? (
            <motion.div key="ok" className="flex items-center gap-1.5 rounded-full px-2 py-0.5"
              style={{ backgroundColor: C.greenBg, border: `0.5px solid ${C.green}30` }}
              initial={{ opacity: 0, scale: 0.85, x: -4 }} animate={{ opacity: 1, scale: 1, x: 0 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.32, ease: [0.34, 1.56, 0.64, 1] }}>
              <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                <path d="M1.5 4L3 5.5L6.5 2.5" stroke={C.green} strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="text-[8px] font-semibold" style={{ color: C.green }}>Aprovada</span>
            </motion.div>
          ) : (
            <motion.div key="pending" className="flex items-center gap-1.5 rounded-full px-2 py-0.5"
              style={{ backgroundColor: C.amberBg, border: `0.5px solid ${C.amber}30` }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: 4 }}
              transition={{ duration: 0.2 }}>
              <motion.div className="rounded-full" style={{ width: 5, height: 5, backgroundColor: C.amber }}
                animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 1.2, repeat: Infinity }} />
              <span className="text-[8px] font-medium" style={{ color: C.amber }}>Em análise</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

function NotifRow({ visible, isAccountant }: { visible: boolean; isAccountant: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div className="flex items-start gap-2 rounded-lg px-2.5 py-2 border"
          style={{ backgroundColor: C.surface, border: `1px solid ${C.border}` }}
          initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.32, ease: [0.34, 1.56, 0.64, 1] }}>
          <div className="rounded shrink-0 flex items-center justify-center"
            style={{ width: 22, height: 22, backgroundColor: isAccountant ? C.orangeBg : C.greenBg }}>
            {isAccountant ? (
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                <rect x="1" y="2" width="3.5" height="7" rx="0.6" stroke={C.orange} strokeWidth="0.9" />
                <rect x="6" y="2" width="3.5" height="4.5" rx="0.6" stroke={C.orange} strokeWidth="0.9" />
              </svg>
            ) : (
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                <rect x="1" y="2.5" width="9" height="6.5" rx="0.8" stroke={C.green} strokeWidth="0.9" />
                <path d="M1.5 3L5.5 6L9.5 3" stroke={C.green} strokeWidth="0.9" strokeLinecap="round" />
              </svg>
            )}
          </div>
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-1.5">
              <span className="text-[8.5px] font-semibold leading-none" style={{ color: C.text }}>
                {isAccountant ? "Notificação no board" : "E-mail ao cliente"}
              </span>
              <span className="rounded-full px-1 text-[7px] font-medium"
                style={{ backgroundColor: isAccountant ? C.orangeBg : C.greenBg, color: isAccountant ? C.orange : C.green }}>
                {isAccountant ? "Contador" : "Cliente"}
              </span>
            </div>
            <p className="text-[8px] leading-snug" style={{ color: C.sub }}>
              {isAccountant ? "Viabilidade aprovada — Padaria do Pedro" : "A viabilidade da sua empresa foi aprovada"}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function VisualAutoSync() {
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    let cur = 0
    let t: NodeJS.Timeout
    const run = () => { setPhase(cur); t = setTimeout(() => { cur = (cur + 1) % DURATIONS.length; run() }, DURATIONS[cur]) }
    run()
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="w-full h-full flex flex-col overflow-hidden" style={{ backgroundColor: C.surface }}>
      {/* Chrome bar */}
      <div className="flex items-center gap-1.5 px-3 py-2.5 shrink-0" style={{ backgroundColor: C.chrome, borderBottom: `1px solid ${C.border}` }}>
        <div className="rounded-full" style={{ width: 7, height: 7, backgroundColor: "#FC645F" }} />
        <div className="rounded-full" style={{ width: 7, height: 7, backgroundColor: "#FDBC40" }} />
        <div className="rounded-full" style={{ width: 7, height: 7, backgroundColor: "#34C84A" }} />
      </div>

      <div className="flex-1 p-4 flex flex-col gap-2.5" style={{ backgroundColor: C.bg }}>
        <MonitorCard approved={phase >= 1} />
        <NotifRow visible={phase >= 2} isAccountant={true} />
        <NotifRow visible={phase >= 3} isAccountant={false} />
      </div>
    </div>
  )
}
