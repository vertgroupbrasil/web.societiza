'use client'

import { cn } from '@societiza/lib/utils'
import { DecorIcon } from '@societiza/components/ui/decor-icon'
import React from 'react'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Mail, AlertTriangle, Sparkles } from 'lucide-react'

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
      <div className="rounded-full" style={{ width: 7, height: 7, backgroundColor: '#FC645F' }} />
      <div className="rounded-full" style={{ width: 7, height: 7, backgroundColor: '#FDBC40' }} />
      <div className="rounded-full" style={{ width: 7, height: 7, backgroundColor: '#34C84A' }} />
    </div>
  )
}

// ─── Animation 1: Cliente sempre informado ───────────────────────────────────

const clientStages = ['Documentação', 'Viabilidade', 'Registro', 'Alvará']
// 0 – estático: 2 etapas done, 3 ativa
// 1 – etapa 3 done, 4 ativa
// 2 – toast aparece
// 3 – hold
// 4 – reset
const CLIENT_DURATIONS = [1200, 700, 600, 1800, 400]

function ClientNotificationsAnimation() {
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    let cur = 0
    let t: NodeJS.Timeout
    const run = () => { setPhase(cur); t = setTimeout(() => { cur = (cur + 1) % CLIENT_DURATIONS.length; run() }, CLIENT_DURATIONS[cur]) }
    run()
    return () => clearTimeout(t)
  }, [])

  const doneUntil = phase <= 0 ? 1 : 2
  const showToast = phase >= 2 && phase <= 3

  return (
    <div className="w-full h-full flex items-center justify-center" style={{ perspective: '700px' }}>
      <motion.div
        className="w-full rounded-lg overflow-hidden"
        style={{ backgroundColor: C.surface, border: `1px solid ${C.border}`, maxWidth: 240, rotateX: 5, rotateY: -7, transformStyle: 'preserve-3d' }}
        animate={{ y: [0, -4, 0], rotateX: [5, 3, 5], rotateY: [-7, -5, -7] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Chrome />
        <div className="p-3 flex flex-col gap-2">
          <div>
            <p className="text-[9.5px] font-semibold leading-none" style={{ color: C.text }}>Borracharia Três Irmãos</p>
            <p className="text-[8px] mt-0.5 leading-none" style={{ color: C.muted }}>Acompanhe seu processo</p>
          </div>
          <div className="flex items-center gap-0.5">
            {clientStages.map((s, i) => {
              const done = i <= doneUntil
              const active = i === doneUntil + 1
              return (
                <React.Fragment key={s}>
                  <div className="flex flex-col items-center gap-0.5">
                    <motion.div className="rounded-full flex items-center justify-center"
                      style={{ width: 14, height: 14, backgroundColor: done ? C.orange : active ? C.orangeBg : C.surface, border: `1.5px solid ${done || active ? C.orange : C.border}` }}
                      animate={{ scale: active ? 1.15 : 1 }} transition={{ duration: 0.3 }}>
                      {done && <svg width="7" height="7" viewBox="0 0 7 7" fill="none"><path d="M1.5 3.5L3 5L5.5 2" stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                      {active && <motion.div className="rounded-full" style={{ width: 4, height: 4, backgroundColor: C.orange }} animate={{ scale: [1, 1.4, 1] }} transition={{ duration: 1, repeat: Infinity }} />}
                    </motion.div>
                    <span className="text-[6.5px] leading-none text-center" style={{ color: done || active ? C.sub : C.muted, maxWidth: 28 }}>{s}</span>
                  </div>
                  {i < clientStages.length - 1 && (
                    <div className="flex-1 h-px mx-0.5 mb-3 rounded-full overflow-hidden" style={{ backgroundColor: C.border, minWidth: 8 }}>
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
              <motion.div className="flex items-start gap-2 rounded-lg px-2.5 py-2 border"
                style={{ backgroundColor: C.greenBg, border: `1px solid ${C.green}25` }}
                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}>
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="shrink-0 mt-0.5">
                  <path d="M2 5L4 7L8 3" stroke={C.green} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <p className="text-[8.5px] leading-tight" style={{ color: C.green }}>
                  <span className="font-semibold">Viabilidade aprovada</span> — você foi notificado por e-mail
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}

// ─── Animation 2: Alertas inteligentes ───────────────────────────────────────

// 0 – processo aberto, contador: há 0 dias
// 1 – há 2 dias
// 2 – há 4 dias, alerta aparece (amber)
// 3 – notificação "Avisar cliente" aparece
// 4 – hold
// 5 – reset
const ALERT_DURATIONS = [600, 700, 700, 800, 1600, 400]

function ContadorAlertsAnimation() {
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    let cur = 0
    let t: NodeJS.Timeout
    const run = () => { setPhase(cur); t = setTimeout(() => { cur = (cur + 1) % ALERT_DURATIONS.length; run() }, ALERT_DURATIONS[cur]) }
    run()
    return () => clearTimeout(t)
  }, [])

  const days = phase <= 0 ? 0 : phase === 1 ? 2 : 4
  const stalled = phase >= 2
  const showNotif = phase >= 3 && phase <= 4

  return (
    <div className="w-full h-full flex items-center justify-center" style={{ perspective: '700px' }}>
      <motion.div
        className="w-full rounded-lg overflow-hidden"
        style={{ backgroundColor: C.bg, border: `1px solid ${C.border}`, maxWidth: 240, rotateX: 4, rotateY: 9, transformStyle: 'preserve-3d' }}
        animate={{ y: [0, -4, 0], rotateX: [4, 2, 4], rotateY: [9, 7, 9] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Chrome />
        <div className="p-3 flex flex-col gap-2">
          {/* Process card */}
          <motion.div className="rounded-lg border p-2.5"
            style={{ backgroundColor: C.surface, border: `1px solid ${stalled ? C.amber + '60' : C.border}` }}
            animate={{ borderColor: stalled ? C.amber + '60' : C.border }} transition={{ duration: 0.4 }}>
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-[9.5px] font-semibold leading-none" style={{ color: C.text }}>Elétrica Nogueira LTDA</p>
                <p className="text-[8px] mt-0.5" style={{ color: C.muted }}>Viabilidade · 2/5 etapas</p>
              </div>
              <motion.div className="rounded-full px-1.5 py-0.5"
                style={{ backgroundColor: stalled ? C.amberBg : 'rgba(55,50,47,0.06)' }}
                animate={{ backgroundColor: stalled ? C.amberBg : 'rgba(55,50,47,0.06)' }} transition={{ duration: 0.3 }}>
                <motion.span className="text-[8px] font-medium tabular-nums" style={{ color: stalled ? C.amber : C.muted }}>
                  há {days}d
                </motion.span>
              </motion.div>
            </div>
            <div className="h-1 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(55,50,47,0.08)' }}>
              <div className="h-full rounded-full" style={{ width: '40%', backgroundColor: C.orange }} />
            </div>
          </motion.div>

          {/* Alert */}
          <AnimatePresence>
            {stalled && (
              <motion.div className="flex items-center gap-2 rounded-lg px-2.5 py-2 border"
                style={{ backgroundColor: C.amberBg, border: `1px solid ${C.amber}30` }}
                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}>
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="shrink-0">
                  <path d="M5 1L9 8.5H1L5 1Z" stroke={C.amber} strokeWidth="1" strokeLinejoin="round" />
                  <path d="M5 4.5V6" stroke={C.amber} strokeWidth="1" strokeLinecap="round" />
                  <circle cx="5" cy="7.5" r="0.5" fill={C.amber} />
                </svg>
                <p className="text-[8.5px] font-medium" style={{ color: C.amber }}>Processo parado há 4 dias</p>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showNotif && (
              <motion.div className="flex items-center justify-between rounded-lg px-2.5 py-2 border"
                style={{ backgroundColor: C.surface, border: `1px solid ${C.border}` }}
                initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}>
                <p className="text-[8.5px]" style={{ color: C.sub }}>Notificação enviada ao contador</p>
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M2 5L4 7L8 3" stroke={C.green} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}

// ─── Animation 3: Emails automáticos por evento ───────────────────────────────

const emailEvents = [
  { event: 'Viabilidade aprovada', to: 'contador', label: 'Notificação no board' },
  { event: 'Processo avançou', to: 'cliente', label: 'E-mail ao cliente' },
  { event: 'Doc. pendente', to: 'cliente', label: 'Lembrete ao cliente' },
]
// 0 – vazio
// 1,2,3 – email 0,1,2 aparece
// 4 – hold
// 5 – reset
const EMAIL_DURATIONS = [500, 700, 700, 700, 1800, 400]

function EmailFlowAnimation() {
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    let cur = 0
    let t: NodeJS.Timeout
    const run = () => { setPhase(cur); t = setTimeout(() => { cur = (cur + 1) % EMAIL_DURATIONS.length; run() }, EMAIL_DURATIONS[cur]) }
    run()
    return () => clearTimeout(t)
  }, [])

  const visible = phase >= 5 ? 3 : phase

  return (
    <div className="w-full h-full flex items-center justify-center" style={{ perspective: '700px' }}>
      <motion.div
        className="w-full rounded-lg overflow-hidden"
        style={{ backgroundColor: C.surface, border: `1px solid ${C.border}`, maxWidth: 240, rotateX: 6, rotateY: -5, transformStyle: 'preserve-3d' }}
        animate={{ y: [0, -4, 0], rotateX: [6, 4, 6], rotateY: [-5, -3, -5] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Chrome />
        <div className="p-3 flex flex-col gap-1.5">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[9px] font-semibold" style={{ color: C.text }}>Disparos automáticos</p>
            <div className="flex items-center gap-1 rounded-full px-1.5 py-0.5" style={{ backgroundColor: C.orangeBg }}>
              <motion.div className="rounded-full" style={{ width: 4, height: 4, backgroundColor: C.orange }}
                animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.2, repeat: Infinity }} />
              <span className="text-[7.5px] font-medium" style={{ color: C.orange }}>ao vivo</span>
            </div>
          </div>

          {emailEvents.map((e, i) => (
            <AnimatePresence key={i}>
              {i < visible && (
                <motion.div className="flex items-center gap-2 rounded-lg px-2.5 py-2 border"
                  style={{ backgroundColor: C.surface, border: `1px solid ${C.border}` }}
                  initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}>
                  <div className="shrink-0 rounded flex items-center justify-center"
                    style={{ width: 18, height: 18, backgroundColor: e.to === 'contador' ? C.orangeBg : C.greenBg }}>
                    <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                      <rect x="1" y="2" width="7" height="5" rx="0.6" stroke={e.to === 'contador' ? C.orange : C.green} strokeWidth="0.9" />
                      <path d="M1.5 2.5L4.5 5L7.5 2.5" stroke={e.to === 'contador' ? C.orange : C.green} strokeWidth="0.9" strokeLinecap="round" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[8.5px] font-medium leading-none truncate" style={{ color: C.text }}>{e.label}</p>
                    <p className="text-[7.5px] mt-0.5 leading-none" style={{ color: C.muted }}>{e.event}</p>
                  </div>
                  <svg width="9" height="9" viewBox="0 0 9 9" fill="none" className="shrink-0">
                    <path d="M1.5 4.5L3.5 6.5L7.5 2.5" stroke={C.green} strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </motion.div>
              )}
            </AnimatePresence>
          ))}

          {/* Placeholder rows */}
          {Array.from({ length: Math.max(0, 3 - visible) }).map((_, i) => (
            <div key={`ph-${i}`} className="flex items-center gap-2 rounded-lg px-2.5 py-2 border border-dashed"
              style={{ borderColor: C.border, opacity: 0.35 }}>
              <div className="rounded shrink-0" style={{ width: 18, height: 18, backgroundColor: 'rgba(55,50,47,0.06)' }} />
              <div className="flex-1 space-y-1">
                <div className="rounded-full" style={{ height: 6, width: '60%', backgroundColor: 'rgba(55,50,47,0.08)' }} />
                <div className="rounded-full" style={{ height: 5, width: '40%', backgroundColor: 'rgba(55,50,47,0.06)' }} />
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

// ─── Types ────────────────────────────────────────────────────────────────────

type Feature = {
  step: string
  title: string
  description: string
  highlight?: string
  icon: React.ReactNode
  animation: React.ReactNode
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const features: Feature[] = [
  {
    step: '01',
    title: 'Cliente sempre informado por email',
    icon: <Mail />,
    description: 'Cada movimentação no processo gera um email automático para o cliente. Ele acompanha tudo em tempo real, sem precisar perguntar nada.',
    animation: <ClientNotificationsAnimation />,
    highlight: 'Transparência total = confiança',
  },
  {
    step: '02',
    title: 'Alertas inteligentes para o contador',
    icon: <AlertTriangle />,
    description: 'Se um processo fica parado por alguns dias, você recebe um alerta com a sugestão de entrar em contato com o cliente via WhatsApp para destravar o processo.',
    animation: <ContadorAlertsAnimation />,
    highlight: 'Nenhum processo esquecido',
  },
  {
    step: '03',
    title: 'Emails automáticos por evento',
    icon: <Mail />,
    description: 'Proposta aceita? Documento necessário? Etapa concluída? O sistema dispara emails personalizados automaticamente, mantendo todos alinhados.',
    animation: <EmailFlowAnimation />,
    highlight: 'Zero emails manuais',
  },
]

// ─── Components ───────────────────────────────────────────────────────────────

function FeatureCard({ feature }: { feature: Feature }) {
  return (
    <div className={cn('relative flex flex-col gap-6 px-6 pt-10 pb-8')}>
      <div className="absolute -inset-y-4 -left-px w-px bg-border" />
      <div className="absolute -inset-y-4 -right-px w-px bg-border" />
      <div className="absolute -inset-x-4 -top-px h-px bg-border" />
      <div className="absolute -right-4 -bottom-px -left-4 h-px bg-border" />
      <DecorIcon className="size-3.5" position="top-left" />

      <div className="relative h-40 w-full overflow-hidden rounded-xl border bg-muted/30">
        {feature.animation}
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="flex w-fit items-center justify-center rounded-lg border bg-muted/20 p-2 [&_svg]:size-4 [&_svg]:text-primary">
            {feature.icon}
          </div>
          <div className="w-fit rounded-md border px-3 py-0.5 text-xs">Etapa {feature.step}</div>
        </div>
        <h3 className="font-semibold text-base leading-snug text-foreground">{feature.title}</h3>
        <p className="text-muted-foreground text-xs leading-relaxed">{feature.description}</p>
        {feature.highlight && (
          <div className="flex items-center gap-1.5 rounded-lg border border-primary/20 bg-primary/5 px-3 py-1.5">
            <Sparkles className="h-3 w-3 text-primary" />
            <span className="text-xs font-medium text-primary">{feature.highlight}</span>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Export ───────────────────────────────────────────────────────────────────

export function FeaturesShowcase() {
  return (
    <section id="como-funciona" className="py-20 md:py-28">
      <div className="mx-auto mb-14 max-w-2xl space-y-3 text-center">
        <div className="flex justify-center">
          <div className="rounded-md border px-4 py-1 text-sm">Comunicação Inteligente</div>
        </div>
        <h2 className="font-bold text-3xl tracking-tight md:text-5xl">
          Cliente e contador sempre conectados
        </h2>
        <p className="text-muted-foreground text-sm leading-relaxed md:text-base">
          Cada movimentação gera uma notificação. O cliente sabe exatamente o que está acontecendo, e o contador nunca deixa um processo parar.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {features.map((feature) => (
          <FeatureCard feature={feature} key={feature.step} />
        ))}
      </div>
    </section>
  )
}
