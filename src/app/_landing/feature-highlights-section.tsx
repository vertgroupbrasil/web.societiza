'use client'

import React from 'react'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { cn } from '@societiza/lib/utils'
import { DecorIcon } from '@societiza/components/ui/decor-icon'
import { Zap, Eye, Bell } from 'lucide-react'

// ─── Design tokens ────────────────────────────────────────────────────────────

const C = {
  bg: '#F7F5F3',
  surface: '#FFFFFF',
  border: 'rgba(55, 50, 47, 0.10)',
  muted: 'rgba(55, 50, 47, 0.35)',
  text: '#37322F',
  sub: '#605A57',
  orange: '#FF5500',
  orangeBg: '#FFEFE7',
  green: '#16A34A',
  greenBg: '#DCFCE7',
  amber: '#D97706',
  amberBg: '#FEF3C7',
  chrome: '#F0EDEA',
}

function Chrome() {
  return (
    <div className="flex items-center gap-1.5 px-3 py-2 border-b" style={{ backgroundColor: C.chrome, borderColor: C.border }}>
      <div className="rounded-full" style={{ width: 6, height: 6, backgroundColor: '#FC645F' }} />
      <div className="rounded-full" style={{ width: 6, height: 6, backgroundColor: '#FDBC40' }} />
      <div className="rounded-full" style={{ width: 6, height: 6, backgroundColor: '#34C84A' }} />
    </div>
  )
}

// ─── Mock 1: Automações ───────────────────────────────────────────────────────

// 0 – monitorando, status Em análise
// 1 – status → Aprovada
// 2 – notif contador aparece
// 3 – notif cliente aparece
// 4 – hold
// 5 – reset
const AUTO_D = [1400, 700, 600, 600, 1600, 400]

function AutomationsMockUI() {
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    let cur = 0
    let t: NodeJS.Timeout
    const run = () => { setPhase(cur); t = setTimeout(() => { cur = (cur + 1) % AUTO_D.length; run() }, AUTO_D[cur]) }
    run()
    return () => clearTimeout(t)
  }, [])

  const approved = phase >= 1

  return (
    <div className="w-full" style={{ perspective: '700px' }}>
      <motion.div className="w-full rounded-lg overflow-hidden"
        style={{ backgroundColor: C.bg, border: `1px solid ${C.border}`, rotateX: 4, rotateY: -6, transformStyle: 'preserve-3d' }}
        animate={{ y: [0, -3, 0], rotateX: [4, 2, 4], rotateY: [-6, -4, -6] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}>
        <Chrome />
        <div className="p-3 flex flex-col gap-2">
          {/* Monitor card */}
          <div className="rounded-lg border p-2.5" style={{ backgroundColor: C.surface, border: `1px solid ${C.border}` }}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <div className="rounded flex items-center justify-center shrink-0" style={{ width: 20, height: 20, backgroundColor: 'rgba(55,50,47,0.05)' }}>
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <rect x="1" y="4.5" width="8" height="5" rx="0.5" stroke={C.muted} strokeWidth="0.8" />
                    <path d="M0.5 4.5L5 1.5L9.5 4.5" stroke={C.muted} strokeWidth="0.8" strokeLinecap="round" />
                  </svg>
                </div>
                <div>
                  <p className="text-[8.5px] font-semibold leading-none" style={{ color: C.text }}>Viabilidade · Prefeitura SP</p>
                  <p className="text-[7.5px] mt-0.5" style={{ color: C.muted }}>Borracharia Três Irmãos</p>
                </div>
              </div>
              <div className="flex items-center gap-1 rounded-full px-1.5 py-0.5" style={{ backgroundColor: C.orangeBg }}>
                <motion.svg width="7" height="7" viewBox="0 0 7 7" fill="none" animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}>
                  <path d="M3.5 1C4.88 1 6 2.12 6 3.5" stroke={C.orange} strokeWidth="0.9" strokeLinecap="round" />
                  <path d="M3.5 6C2.12 6 1 4.88 1 3.5" stroke={C.orange} strokeWidth="0.9" strokeLinecap="round" />
                </motion.svg>
                <span className="text-[7px] font-medium" style={{ color: C.orange }}>auto</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[7.5px]" style={{ color: C.muted }}>Status:</span>
              <AnimatePresence mode="wait">
                {approved ? (
                  <motion.div key="ok" className="flex items-center gap-1 rounded-full px-1.5 py-0.5"
                    style={{ backgroundColor: C.greenBg }}
                    initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                    transition={{ duration: 0.28, ease: [0.34, 1.56, 0.64, 1] }}>
                    <svg width="7" height="7" viewBox="0 0 7 7" fill="none">
                      <path d="M1.5 3.5L3 5L5.5 2" stroke={C.green} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="text-[7.5px] font-semibold" style={{ color: C.green }}>Aprovada</span>
                  </motion.div>
                ) : (
                  <motion.div key="p" className="flex items-center gap-1 rounded-full px-1.5 py-0.5"
                    style={{ backgroundColor: C.amberBg }}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                    <motion.div className="rounded-full" style={{ width: 4, height: 4, backgroundColor: C.amber }}
                      animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.2, repeat: Infinity }} />
                    <span className="text-[7.5px] font-medium" style={{ color: C.amber }}>Em análise</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Notifs */}
          <AnimatePresence>
            {phase >= 2 && (
              <motion.div className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 border"
                style={{ backgroundColor: C.surface, border: `1px solid ${C.border}` }}
                initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.28, ease: [0.34, 1.56, 0.64, 1] }}>
                <div className="rounded shrink-0 flex items-center justify-center" style={{ width: 18, height: 18, backgroundColor: C.orangeBg }}>
                  <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                    <rect x="1" y="2" width="3" height="5.5" rx="0.5" stroke={C.orange} strokeWidth="0.8" />
                    <rect x="5.5" y="2" width="2.5" height="3.5" rx="0.5" stroke={C.orange} strokeWidth="0.8" />
                  </svg>
                </div>
                <p className="text-[8px]" style={{ color: C.sub }}>Notificação no board <span style={{ fontWeight: 600, color: C.text }}>contador</span></p>
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {phase >= 3 && (
              <motion.div className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 border"
                style={{ backgroundColor: C.surface, border: `1px solid ${C.border}` }}
                initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.28, ease: [0.34, 1.56, 0.64, 1] }}>
                <div className="rounded shrink-0 flex items-center justify-center" style={{ width: 18, height: 18, backgroundColor: C.greenBg }}>
                  <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                    <rect x="1" y="2" width="7" height="5" rx="0.5" stroke={C.green} strokeWidth="0.8" />
                    <path d="M1.5 2.5L4.5 5L7.5 2.5" stroke={C.green} strokeWidth="0.8" strokeLinecap="round" />
                  </svg>
                </div>
                <p className="text-[8px]" style={{ color: C.sub }}>E-mail ao <span style={{ fontWeight: 600, color: C.text }}>cliente</span></p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}

// ─── Mock 2: Transparência para o cliente ─────────────────────────────────────

const trackStages = ['Documentação', 'Viabilidade', 'Registro', 'Alvará', 'Pronto']
const TRACK_D = [1000, 700, 600, 1800, 400]

function ClientMockUI() {
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    let cur = 0
    let t: NodeJS.Timeout
    const run = () => { setPhase(cur); t = setTimeout(() => { cur = (cur + 1) % TRACK_D.length; run() }, TRACK_D[cur]) }
    run()
    return () => clearTimeout(t)
  }, [])

  const doneUntil = phase <= 0 ? 1 : 2
  const showToast = phase >= 2 && phase <= 3

  return (
    <div className="w-full" style={{ perspective: '700px' }}>
      <motion.div className="w-full rounded-lg overflow-hidden"
        style={{ backgroundColor: C.surface, border: `1px solid ${C.border}`, rotateX: 3, rotateY: 6, transformStyle: 'preserve-3d' }}
        animate={{ y: [0, -3, 0], rotateX: [3, 1, 3], rotateY: [6, 8, 6] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}>
        <Chrome />
        <div className="p-3 flex flex-col gap-2.5">
          <div>
            <p className="text-[9px] font-semibold" style={{ color: C.text }}>Bar do Zé Paulista ME</p>
            <p className="text-[7.5px]" style={{ color: C.muted }}>Acompanhe seu processo</p>
          </div>

          {/* Stages */}
          <div className="flex items-center">
            {trackStages.map((s, i) => {
              const done = i <= doneUntil
              const active = i === doneUntil + 1
              return (
                <React.Fragment key={s}>
                  <div className="flex flex-col items-center gap-0.5">
                    <motion.div className="rounded-full flex items-center justify-center"
                      style={{ width: 12, height: 12, backgroundColor: done ? C.orange : active ? C.orangeBg : C.surface, border: `1.5px solid ${done || active ? C.orange : C.border}` }}
                      animate={{ scale: active ? 1.15 : 1 }} transition={{ duration: 0.3 }}>
                      {done && <svg width="6" height="6" viewBox="0 0 6 6" fill="none"><path d="M1 3L2.5 4.5L5 2" stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                      {active && <motion.div className="rounded-full" style={{ width: 3.5, height: 3.5, backgroundColor: C.orange }} animate={{ scale: [1, 1.4, 1] }} transition={{ duration: 1, repeat: Infinity }} />}
                    </motion.div>
                    <span className="text-[6px] leading-none text-center" style={{ color: done || active ? C.sub : C.muted, maxWidth: 24 }}>{s}</span>
                  </div>
                  {i < trackStages.length - 1 && (
                    <div className="flex-1 h-px mx-0.5 mb-3 rounded-full overflow-hidden" style={{ backgroundColor: C.border, minWidth: 6 }}>
                      <motion.div className="h-full rounded-full" style={{ backgroundColor: C.orange }}
                        animate={{ scaleX: i < doneUntil ? 1 : 0 }} transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }} />
                    </div>
                  )}
                </React.Fragment>
              )
            })}
          </div>

          <AnimatePresence>
            {showToast && (
              <motion.div className="flex items-center gap-2 rounded-lg px-2.5 py-2 border"
                style={{ backgroundColor: C.orangeBg, border: `1px solid ${C.orange}25` }}
                initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}>
                <svg width="9" height="9" viewBox="0 0 9 9" fill="none" className="shrink-0">
                  <path d="M2 4.5L3.5 6L7 2.5" stroke={C.orange} strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <p className="text-[8px] font-medium" style={{ color: C.orange }}>Processo avançou para <span style={{ fontWeight: 700 }}>Registro</span></p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}

// ─── Mock 3: Alertas ──────────────────────────────────────────────────────────

const stalledProcesses = [
  { name: 'Elétrica Nogueira LTDA', days: 5, stage: 'Viabilidade' },
  { name: 'Clínica Dra. Fernanda', days: 2, stage: 'Registro' },
]
const ALERT_D = [800, 700, 800, 1800, 400]

function AlertsMockUI() {
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    let cur = 0
    let t: NodeJS.Timeout
    const run = () => { setPhase(cur); t = setTimeout(() => { cur = (cur + 1) % ALERT_D.length; run() }, ALERT_D[cur]) }
    run()
    return () => clearTimeout(t)
  }, [])

  const visibleAlerts = phase >= 4 ? 2 : phase <= 0 ? 0 : phase

  return (
    <div className="w-full" style={{ perspective: '700px' }}>
      <motion.div className="w-full rounded-lg overflow-hidden"
        style={{ backgroundColor: C.bg, border: `1px solid ${C.border}`, rotateX: 5, rotateY: -4, transformStyle: 'preserve-3d' }}
        animate={{ y: [0, -3, 0], rotateX: [5, 3, 5], rotateY: [-4, -2, -4] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}>
        <Chrome />
        <div className="p-3 flex flex-col gap-1.5">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[9px] font-semibold" style={{ color: C.text }}>Processos parados</p>
            <AnimatePresence>
              {visibleAlerts > 0 && (
                <motion.div className="rounded-full px-1.5 py-0.5" style={{ backgroundColor: C.amberBg }}
                  initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                  transition={{ duration: 0.25, ease: [0.34, 1.56, 0.64, 1] }}>
                  <span className="text-[7.5px] font-semibold" style={{ color: C.amber }}>{visibleAlerts} alerta{visibleAlerts > 1 ? 's' : ''}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {stalledProcesses.map((p, i) => (
            <AnimatePresence key={p.name}>
              {i < visibleAlerts && (
                <motion.div className="rounded-lg border p-2.5"
                  style={{ backgroundColor: C.surface, border: `1px solid ${i === 0 ? C.amber + '50' : C.border}` }}
                  initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[8.5px] font-medium leading-none" style={{ color: C.text }}>{p.name}</p>
                      <p className="text-[7.5px] mt-0.5" style={{ color: C.muted }}>{p.stage}</p>
                    </div>
                    <div className="rounded-full px-1.5 py-0.5" style={{ backgroundColor: i === 0 ? C.amberBg : 'rgba(55,50,47,0.06)' }}>
                      <span className="text-[7.5px] font-medium tabular-nums" style={{ color: i === 0 ? C.amber : C.muted }}>há {p.days}d</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          ))}

          {visibleAlerts === 0 && (
            <div className="rounded-lg border border-dashed p-2.5" style={{ borderColor: C.border, opacity: 0.4 }}>
              <div className="rounded-full mb-1.5" style={{ height: 7, width: '60%', backgroundColor: 'rgba(55,50,47,0.08)' }} />
              <div className="rounded-full" style={{ height: 6, width: '40%', backgroundColor: 'rgba(55,50,47,0.06)' }} />
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}

// ─── Feature card ─────────────────────────────────────────────────────────────

type Highlight = {
  badge: string
  icon: React.ElementType
  title: string
  description: string
  points: string[]
  mockUI: React.ReactNode
}

const highlights: Highlight[] = [
  {
    badge: 'Automações',
    icon: Zap,
    title: 'Pare de perder tempo consultando sites de prefeitura.',
    description: 'Uma das tarefas mais cansativas da rotina societária é verificar manualmente se algo mudou.',
    points: ['Viabilidade deferida — você é notificado.', 'Alvará liberado — você é notificado.', 'Qualquer atualização no processo — você é notificado.'],
    mockUI: <AutomationsMockUI />,
  },
  {
    badge: 'Transparência',
    icon: Eye,
    title: 'Seu cliente sempre sabe em que etapa está a empresa dele.',
    description: 'Nada pior do que clientes perguntando o tempo todo: "E aí, como está minha empresa?"',
    points: ['Seu cliente acompanha o progresso do processo.', 'Recebe notificações de atualização.', 'Menos mensagens no WhatsApp. Mais confiança.'],
    mockUI: <ClientMockUI />,
  },
  {
    badge: 'Alertas',
    icon: Bell,
    title: 'Nunca mais deixe um processo parado.',
    description: 'A Societiza identifica processos que estão parados por muito tempo e avisa sua equipe.',
    points: ['Lembrete para solicitar documentos ao cliente.', 'Alerta de processos travados há mais de X dias.', 'Mais velocidade e controle operacional.'],
    mockUI: <AlertsMockUI />,
  },
]

function HighlightCard({ highlight, className }: { highlight: Highlight; className?: string }) {
  const { badge, icon: Icon, title, description, points, mockUI } = highlight
  return (
    <div className={cn('relative flex flex-col gap-6 px-6 pt-10 pb-8', className)}>
      <div className="absolute -inset-y-4 -left-px w-px bg-border" />
      <div className="absolute -inset-y-4 -right-px w-px bg-border" />
      <div className="absolute -inset-x-4 -top-px h-px bg-border" />
      <div className="absolute -right-4 -bottom-px -left-4 h-px bg-border" />
      <DecorIcon className="size-3.5" position="top-left" />
      {mockUI}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="flex w-fit items-center justify-center rounded-lg border bg-muted/20 p-2 [&_svg]:size-4 [&_svg]:text-primary">
            <Icon />
          </div>
          <div className="w-fit rounded-md border px-3 py-0.5 text-xs">{badge}</div>
        </div>
        <h3 className="font-semibold text-base leading-snug text-foreground">{title}</h3>
        <p className="text-muted-foreground text-xs leading-relaxed">{description}</p>
        <ul className="space-y-1.5 pt-1">
          {points.map((p) => (
            <li key={p} className="flex items-start gap-2 text-xs text-muted-foreground">
              <span className="mt-1.5 size-1 shrink-0 rounded-full bg-primary" />
              {p}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export function FeatureHighlightsSection() {
  return (
    <div id="como-funciona" className="py-20 md:py-28">
      <div className="mx-auto mb-14 max-w-2xl space-y-3 text-center">
        <div className="flex justify-center">
          <div className="rounded-md border px-4 py-1 text-sm">Como funciona</div>
        </div>
        <h2 className="font-bold text-3xl tracking-tight md:text-5xl">
          Menos trabalho manual. <span className="text-primary">Mais controle.</span>
        </h2>
        <p className="text-muted-foreground text-sm leading-relaxed md:text-base">
          Cada funcionalidade foi construída para resolver uma dor real da rotina societária.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {highlights.map((h) => (
          <HighlightCard highlight={h} key={h.badge} />
        ))}
      </div>
    </div>
  )
}
