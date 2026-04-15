"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@shadcn/index"

const C = {
  bg: "#F7F5F3",
  surface: "#FFFFFF",
  border: "rgba(55, 50, 47, 0.10)",
  muted: "rgba(55, 50, 47, 0.35)",
  text: "#37322F",
  sub: "#605A57",
  orange: "#FF5500",
  orangeBg: "#FFEFE7",
  chrome: "#F4F2F0",
}

const avatars = [
  {
    src: "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-3.png",
    fallback: "OS",
    name: "Olivia Sparks",
  },
  {
    src: "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-6.png",
    fallback: "HL",
    name: "Howard Lloyd",
  },
  {
    src: "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-5.png",
    fallback: "HR",
    name: "Hallie Richards",
  },
  {
    src: "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-16.png",
    fallback: "JW",
    name: "Jenny Wilson",
  },
]

const tasks = [
  { label: "Verificar doc. do sócio", memberIndex: 0 },
  { label: "Consultar viabilidade", memberIndex: 1 },
  { label: "Enviar link ao cliente", memberIndex: 2 },
]

function TeamAvatar({ memberIndex, size = 14 }: { memberIndex: number; size?: number }) {
  const member = avatars[memberIndex] ?? avatars[0]

  return (
    <Avatar
      className="shrink-0 border-[1.5px] border-white"
      style={{ width: size, height: size }}
    >
      <AvatarImage src={member.src} alt={member.name} />
      <AvatarFallback
        className="leading-none"
        style={{ fontSize: size * 0.44, fontWeight: 700 }}
      >
        {member.fallback}
      </AvatarFallback>
    </Avatar>
  )
}

function TaskRow({ label, memberIndex, done, active }: { label: string; memberIndex: number; done: boolean; active: boolean }) {
  return (
    <motion.div className="flex items-center gap-2 rounded-lg px-2.5 py-2"
      style={{ backgroundColor: active ? C.orangeBg : "transparent", border: `1px solid ${active ? `${C.orange}20` : "transparent"}` }}
      animate={{ backgroundColor: active ? C.orangeBg : "rgba(0,0,0,0)" }}
      transition={{ duration: 0.3 }}>
      <motion.div className="rounded flex items-center justify-center shrink-0"
        style={{ width: 14, height: 14, backgroundColor: done ? C.orange : C.surface, border: `1.5px solid ${done ? C.orange : C.border}` }}
        animate={{ backgroundColor: done ? C.orange : C.surface }} transition={{ duration: 0.2 }}>
        <AnimatePresence>
          {done && (
            <motion.svg width="8" height="8" viewBox="0 0 8 8" fill="none"
              initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: [0.34, 1.56, 0.64, 1] }}>
              <path d="M1.5 4L3 5.5L6.5 2.5" stroke="white" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
            </motion.svg>
          )}
        </AnimatePresence>
      </motion.div>
      <span className="flex-1 text-[9px] leading-tight" style={{ color: done ? C.muted : C.sub, textDecoration: done ? "line-through" : "none" }}>
        {label}
      </span>
      <TeamAvatar memberIndex={memberIndex} />
    </motion.div>
  )
}

// 0 – processo aberto, 3 tarefas sem concluir
// 1 – tarefa 0 done
// 2 – tarefa 1 ativa
// 3 – tarefa 1 done
// 4 – tarefa 2 ativa
// 5 – hold
// 6 – reset
const DURATIONS = [700, 800, 500, 900, 700, 1400, 500]

export function VisualTeamwork() {
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    let cur = 0
    let t: NodeJS.Timeout
    const run = () => { setPhase(cur); t = setTimeout(() => { cur = (cur + 1) % DURATIONS.length; run() }, DURATIONS[cur]) }
    run()
    return () => clearTimeout(t)
  }, [])

  const task0Done = phase >= 1
  const task1Active = phase >= 2 && phase < 3
  const task1Done = phase >= 3
  const task2Active = phase >= 4
  const progress = phase >= 3 ? 66 : phase >= 1 ? 33 : 0

  return (
    <div className="w-full h-full flex flex-col overflow-hidden" style={{ backgroundColor: C.surface }}>
      {/* Chrome */}
      <div className="flex items-center gap-1.5 px-3 py-2.5 shrink-0" style={{ backgroundColor: C.chrome, borderBottom: `1px solid ${C.border}` }}>
        <div className="rounded-full" style={{ width: 7, height: 7, backgroundColor: "#FC645F" }} />
        <div className="rounded-full" style={{ width: 7, height: 7, backgroundColor: "#FDBC40" }} />
        <div className="rounded-full" style={{ width: 7, height: 7, backgroundColor: "#34C84A" }} />
      </div>

      <div className="flex-1 p-4 flex flex-col gap-3" style={{ backgroundColor: C.bg }}>
        {/* Header */}
        <div className="rounded-lg border px-3 py-2.5 flex items-center justify-between gap-2" style={{ backgroundColor: C.surface, border: `1px solid ${C.border}` }}>
          <div>
            <p className="text-[10.5px] font-semibold leading-tight" style={{ color: C.text }}>Padaria do Pedro</p>
            <p className="text-[8px] mt-0.5" style={{ color: C.muted }}>Viabilidade · etapa 2 de 5</p>
          </div>
          <div className="flex -space-x-1 shrink-0">
            {avatars.map((avatar, index) => (
              <TeamAvatar key={avatar.name} memberIndex={index} />
            ))}
          </div>
        </div>

        {/* Progress */}
        <div className="h-1 rounded-full overflow-hidden" style={{ backgroundColor: "rgba(55,50,47,0.08)" }}>
          <motion.div className="h-full rounded-full" style={{ backgroundColor: C.orange }}
            animate={{ width: `${progress}%` }} transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }} />
        </div>

        {/* Tasks */}
        <div className="rounded-lg border flex flex-col divide-y overflow-hidden" style={{ backgroundColor: C.surface, border: `1px solid ${C.border}` }}>
          <div className="px-3 py-2" style={{ borderBottom: `1px solid ${C.border}` }}>
            <p className="text-[7.5px] uppercase tracking-wider font-semibold" style={{ color: C.muted }}>Tarefas</p>
          </div>
          {tasks.map((task, i) => (
            <TaskRow key={i} label={task.label} memberIndex={task.memberIndex}
              done={i === 0 ? task0Done : i === 1 ? task1Done : false}
              active={i === 1 ? task1Active : i === 2 ? task2Active : false} />
          ))}
        </div>
      </div>
    </div>
  )
}
