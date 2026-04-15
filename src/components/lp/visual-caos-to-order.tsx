'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import type React from 'react'

const C = {
  bg: '#F7F5F3',
  surface: '#FFFFFF',
  border: 'rgba(55, 50, 47, 0.12)',
  soft: 'rgba(55, 50, 47, 0.08)',
  muted: 'rgba(55, 50, 47, 0.35)',
  text: '#37322F',
  sub: '#605A57',
  orange: '#FF5500',
  orangeBg: '#FFEFE7',
  chrome: '#F4F2F0',
}

// ─── ATO 1: Painéis flutuantes ────────────────────────────────────────────────

function SpreadsheetPanel({ enter, fusing }: { enter: boolean; fusing: boolean }) {
  return (
    <AnimatePresence>
      {enter && (
        <motion.div
          style={{ position: 'absolute', left: '4%', top: '8%', zIndex: 3, originX: 0.5, originY: 0.5 }}
          initial={{ opacity: 0, y: 14 }}
          animate={fusing
            ? { opacity: 0, scale: 0.7, x: 30, y: 10 }
            : { opacity: 1, y: 0, scale: 1, x: 0 }}
          exit={{ opacity: 0, scale: 0.85 }}
          transition={fusing
            ? { duration: 0.75, ease: [0.4, 0, 0.2, 1] }
            : { duration: 0.4, ease: [0.34, 1.2, 0.64, 1] }}
        >
          <motion.div
            animate={fusing ? {} : { y: [0, -4, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div style={{
              width: 104,
              borderRadius: 8,
              border: `1px solid ${C.border}`,
              backgroundColor: C.surface,
              overflow: 'hidden',
              boxShadow: '0 3px 12px rgba(55,50,47,0.09)',
              transform: 'rotate(-3deg)',
            }}>
              <div style={{ backgroundColor: C.bg, padding: 4 }}>
                {/* Column headers */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2, marginBottom: 2 }}>
                  {['Cliente', 'CNPJ', 'Status', 'Prazo'].map((label, i) => (
                    <div key={i} style={{ 
                      height: 8, 
                      backgroundColor: i === 0 ? 'rgba(55,50,47,0.14)' : 'rgba(55,50,47,0.07)', 
                      borderRadius: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 3,
                      color: C.sub,
                      fontWeight: 500,
                    }}>
                      {label}
                    </div>
                  ))}
                </div>
                {/* Data rows */}
                {[0,1,2,3].map(row => (
                  <div key={row} style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2, marginBottom: 2 }}>
                    {[0,1,2,3].map(col => {
                      const hl = (row === 1 && col === 2) || (row === 2 && col === 1)
                      return (
                        <div key={col} style={{
                          height: 7,
                          backgroundColor: hl ? C.orangeBg : row % 2 === 0 ? 'rgba(55,50,47,0.05)' : 'rgba(55,50,47,0.03)',
                          borderRadius: 2,
                          outline: hl ? `0.5px solid ${C.orange}30` : 'none',
                        }} />
                      )
                    })}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function ChatPanel({ enter, fusing }: { enter: boolean; fusing: boolean }) {
  const [pulse, setPulse] = useState(false)
  useEffect(() => {
    if (!enter || fusing) return
    const id = setInterval(() => setPulse(p => !p), 1600)
    return () => clearInterval(id)
  }, [enter, fusing])

  return (
    <AnimatePresence>
      {enter && (
        <motion.div
          style={{ position: 'absolute', right: '5%', top: '14%', zIndex: 2, originX: 0.5, originY: 0.5 }}
          initial={{ opacity: 0, y: 14 }}
          animate={fusing
            ? { opacity: 0, scale: 0.7, x: -25, y: 10 }
            : { opacity: 1, y: 0, scale: 1, x: 0 }}
          exit={{ opacity: 0, scale: 0.85 }}
          transition={fusing
            ? { duration: 0.8, ease: [0.4, 0, 0.2, 1], delay: 0.05 }
            : { duration: 0.4, ease: [0.34, 1.2, 0.64, 1], delay: 0.12 }}
        >
          <motion.div
            animate={fusing ? {} : { y: [0, -5, 0] }}
            transition={{ duration: 4.6, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          >
            <div style={{
              width: 88,
              borderRadius: 8,
              border: `1px solid ${C.border}`,
              backgroundColor: C.surface,
              overflow: 'hidden',
              boxShadow: '0 3px 12px rgba(55,50,47,0.09)',
              transform: 'rotate(4.5deg)',
            }}>
              {/* Chat header - WhatsApp style */}
              <div style={{ height: 18, backgroundColor: '#E8F5E9', borderBottom: '1px solid rgba(76,175,80,0.14)', display: 'flex', alignItems: 'center', gap: 4, padding: '0 6px' }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#A5D6A7' }} />
                <span style={{ fontSize: 4, color: C.text, fontWeight: 500 }}>Contabilidade</span>
              </div>
              {/* Bubbles */}
              <div style={{ backgroundColor: '#EFF3F2', padding: '5px 5px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{ alignSelf: 'flex-start', backgroundColor: C.surface, borderRadius: '2px 7px 7px 7px', padding: '4px 6px', maxWidth: 58, boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                  <span style={{ fontSize: 3.5, color: C.sub }}>E o alvará?</span>
                </div>
                <div style={{ alignSelf: 'flex-end', backgroundColor: '#D4F5C2', borderRadius: '7px 2px 7px 7px', padding: '4px 6px', maxWidth: 48, boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                  <span style={{ fontSize: 3.5, color: C.text }}>Saiu hoje!</span>
                </div>
                <motion.div
                  animate={{ opacity: pulse ? 1 : 0.65, boxShadow: pulse ? `0 0 0 1.5px ${C.orange}35, 0 1px 2px rgba(0,0,0,0.04)` : '0 1px 2px rgba(0,0,0,0.04)' }}
                  transition={{ duration: 0.45 }}
                  style={{ alignSelf: 'flex-start', backgroundColor: C.orangeBg, borderRadius: '2px 7px 7px 7px', padding: '4px 6px', maxWidth: 62 }}
                >
                  <span style={{ fontSize: 3.5, color: C.orange, fontWeight: 500 }}>Manda o CNPJ</span>
                  <div style={{ marginTop: 2 }}><span style={{ fontSize: 3, color: `${C.orange}90` }}>pra nota</span></div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function EmailPanel({ enter, fusing }: { enter: boolean; fusing: boolean }) {
  const [pulse, setPulse] = useState(false)
  useEffect(() => {
    if (!enter || fusing) return
    const id = setInterval(() => setPulse(p => !p), 2100)
    return () => clearInterval(id)
  }, [enter, fusing])

  const emails = [
    { from: 'Junta Comercial', subject: 'Registro aprovado' },
    { from: 'Prefeitura', subject: 'Alvará disponível', highlight: true },
    { from: 'Receita Federal', subject: 'CNPJ ativo' },
  ]

  return (
    <AnimatePresence>
      {enter && (
        <motion.div
          style={{ position: 'absolute', left: '14%', bottom: '10%', zIndex: 2, originX: 0.5, originY: 0.5 }}
          initial={{ opacity: 0, y: 14 }}
          animate={fusing
            ? { opacity: 0, scale: 0.7, x: 16, y: -12 }
            : { opacity: 1, y: 0, scale: 1, x: 0 }}
          exit={{ opacity: 0, scale: 0.85 }}
          transition={fusing
            ? { duration: 0.78, ease: [0.4, 0, 0.2, 1], delay: 0.08 }
            : { duration: 0.4, ease: [0.34, 1.2, 0.64, 1], delay: 0.22 }}
        >
          <motion.div
            animate={fusing ? {} : { y: [0, -3, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          >
            <div style={{
              width: 112,
              borderRadius: 8,
              border: `1px solid ${C.border}`,
              backgroundColor: C.surface,
              overflow: 'hidden',
              boxShadow: '0 3px 12px rgba(55,50,47,0.09)',
              transform: 'rotate(-2deg)',
            }}>
              {emails.map((email, i) => (
                <motion.div
                  key={i}
                  animate={email.highlight ? { backgroundColor: pulse ? C.orangeBg : 'rgba(255,239,231,0.55)' } : {}}
                  transition={{ duration: 0.5 }}
                  style={{
                    padding: '5px 6px',
                    backgroundColor: email.highlight ? C.orangeBg : i % 2 === 0 ? C.surface : C.bg,
                    borderBottom: i < 2 ? `1px solid ${C.soft}` : 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <div style={{ width: 11, height: 11, borderRadius: '50%', backgroundColor: email.highlight ? C.orangeBg : 'rgba(55,50,47,0.07)', border: `1px solid ${email.highlight ? C.orange + '28' : 'transparent'}`, flexShrink: 0 }} />
                    <span style={{ fontSize: 4, color: email.highlight ? C.orange : C.text, fontWeight: 500 }}>{email.from}</span>
                  </div>
                  <span style={{ fontSize: 3.5, color: email.highlight ? `${C.orange}` : C.sub, marginLeft: 15 }}>{email.subject}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ─── ATO 2: Kanban ────────────────────────────────────────────────────────────

const TASKS = {
  viabilidade: ['Consulta de zoneamento', 'Reunir documentos', 'Protocolar pedido'],
  registro: ['Contrato social', 'Pagar DARE', 'Aguardar deferimento'],
}

function MiniCard({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div style={{
      backgroundColor: C.surface,
      borderRadius: 6,
      border: `1px solid ${C.border}`,
      padding: '5px 7px',
      display: 'flex',
      flexDirection: 'column',
      gap: 2,
      boxShadow: '0 1px 3px rgba(55,50,47,0.05)',
    }}>
      <span style={{ fontSize: 5, color: C.text, fontWeight: 500 }}>{title}</span>
      <span style={{ fontSize: 4, color: C.sub }}>{subtitle}</span>
    </div>
  )
}


type FocusCardProps = {
  phase: number
  cardFocus: boolean
  checks: boolean[]
  allChecked: boolean
  col: 1 | 2
}

function FocusCard({ phase, cardFocus, checks, allChecked, col }: FocusCardProps) {
  const active = cardFocus
  const tasks = col === 1 ? TASKS.viabilidade : TASKS.registro
  
  return (
    <motion.div
      key={`fc-${col}`}
      initial={{ opacity: 0, x: col === 2 ? -14 : 0 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: col === 1 ? 14 : 0 }}
      transition={{ duration: 0.38, ease: [0.4, 0, 0.2, 1] }}
      style={{
        backgroundColor: C.surface,
        borderRadius: 7,
        border: `1.5px solid ${active ? C.orange : C.border}`,
        padding: '8px 8px 7px',
        display: 'flex',
        flexDirection: 'column',
        gap: 5,
        boxShadow: active
          ? `0 0 0 2px ${C.orange}18, 0 2px 10px rgba(55,50,47,0.09)`
          : '0 1px 4px rgba(55,50,47,0.06)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {phase === 6 && (
        <motion.div
          style={{ position: 'absolute', inset: 0, backgroundColor: C.orange, pointerEvents: 'none' }}
          initial={{ opacity: 0.09 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <span style={{ fontSize: 5.5, color: C.text, fontWeight: 600 }}>Café Aroma Ltda</span>
        <span style={{ fontSize: 4, color: C.sub }}>12.345.678/0001-90</span>
      </div>

      <div style={{ borderTop: `1px solid ${C.soft}`, paddingTop: 5, display: 'flex', flexDirection: 'column', gap: 4 }}>
        {tasks.map((task, i) => {
          const done = col === 2 ? true : checks[i]
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <motion.div
                animate={done
                  ? { backgroundColor: C.orange, borderColor: C.orange }
                  : { backgroundColor: C.surface, borderColor: 'rgba(55,50,47,0.22)' }}
                transition={{ duration: 0.18 }}
                style={{ width: 10, height: 10, borderRadius: 2.5, border: '1.5px solid rgba(55,50,47,0.22)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
              >
                <AnimatePresence>
                  {done && (
                    <motion.svg width="6" height="6" viewBox="0 0 6 6" fill="none"
                      initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                      transition={{ duration: 0.15, ease: [0.34, 1.5, 0.64, 1] }}>
                      <path d="M1 3L2.3 4.2L5 1.8" stroke="white" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
                    </motion.svg>
                  )}
                </AnimatePresence>
              </motion.div>
              <motion.span
                animate={{ opacity: done ? 0.45 : 1, textDecoration: done ? 'line-through' : 'none' }}
                style={{ fontSize: 4, color: C.sub }}
                transition={{ duration: 0.2 }}
              >
                {task}
              </motion.span>
            </div>
          )
        })}
      </div>

      <div style={{
        position: 'absolute', top: 8, right: 8,
        width: 6, height: 6, borderRadius: '50%',
        backgroundColor: allChecked || col === 2 ? C.orange : 'rgba(55,50,47,0.15)',
      }} />
    </motion.div>
  )
}

const colStyle = (bg: string): React.CSSProperties => ({
  flex: 1,
  borderRadius: 8,
  backgroundColor: bg,
  padding: '7px 6px',
  display: 'flex',
  flexDirection: 'column',
  gap: 5,
  alignSelf: 'flex-start',
  minWidth: 0,
})

function KanbanBoard({ phase }: { phase: number }) {
  const showKanban = phase >= 5
  const cardFocus = phase >= 6
  const checks: boolean[] = [phase >= 7, phase >= 8, phase >= 9]
  const allChecked = phase >= 9
  const cardMoved = phase >= 10

  const focusProps = { phase, cardFocus, checks, allChecked }

  return (
    <AnimatePresence>
      {showKanban && (
        <motion.div
          style={{ position: 'absolute', inset: 0, padding: '8px 8px 10px' }}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        >
          <div style={{ display: 'flex', gap: 5, alignItems: 'flex-start' }}>
            {/* Col 1 - Viabilidade */}
            <div style={colStyle('rgba(55,50,47,0.05)')}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, paddingBottom: 5, borderBottom: `1px solid ${C.soft}` }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: 'rgba(55,50,47,0.22)', flexShrink: 0 }} />
                <span style={{ fontSize: 5, color: C.text, fontWeight: 600 }}>Viabilidade</span>
              </div>
              <MiniCard title="Padaria do Zé" subtitle="Aguardando docs" />
              <AnimatePresence mode="popLayout">
                {!cardMoved && <FocusCard key="fc1" {...focusProps} col={1} />}
              </AnimatePresence>
            </div>

            {/* Col 2 - Registro */}
            <div style={colStyle(`${C.orangeBg}b0`)}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, paddingBottom: 5, borderBottom: `1px solid ${C.orange}20` }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: `${C.orange}90`, flexShrink: 0 }} />
                <span style={{ fontSize: 5, color: C.orange, fontWeight: 600 }}>Registro</span>
              </div>
              <MiniCard title="Tech Solutions" subtitle="Na Junta Comercial" />
              <AnimatePresence mode="popLayout">
                {cardMoved && <FocusCard key="fc2" {...focusProps} col={2} />}
              </AnimatePresence>
            </div>

            {/* Col 3 - Alvará */}
            <div style={colStyle('rgba(22,163,74,0.06)')}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, paddingBottom: 5, borderBottom: '1px solid rgba(22,163,74,0.15)' }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: 'rgba(22,163,74,0.45)', flexShrink: 0 }} />
                <span style={{ fontSize: 5, color: 'rgba(22,163,74,0.9)', fontWeight: 600 }}>Alvará</span>
              </div>
              <MiniCard title="Loja da Maria" subtitle="Vistoria agendada" />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ─── Phase runner ─────────────────────────────────────────────────────────────

const DURATIONS = [200, 380, 380, 1900, 850, 600, 520, 290, 270, 270, 820, 1100, 400]

export function VisualChaosToOrder() {
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    let cur = 0
    let t: NodeJS.Timeout
    const run = () => {
      setPhase(cur)
      t = setTimeout(() => { cur = (cur + 1) % DURATIONS.length; run() }, DURATIONS[cur])
    }
    run()
    return () => clearTimeout(t)
  }, [])

  const fusing = phase === 4
  const showChrome = phase >= 5

  return (
    <div className="w-full h-full flex flex-col overflow-hidden" style={{ backgroundColor: C.surface }}>
      {/* Chrome - título do app */}
      <AnimatePresence>
        {showChrome && (
          <motion.div
            style={{ height: 28, backgroundColor: C.chrome, borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 6, padding: '0 10px', flexShrink: 0 }}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 28 }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
          >
            <div style={{ display: 'flex', gap: 4 }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: '#FC645F' }} />
              <div style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: '#FDBC40' }} />
              <div style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: '#34C84A' }} />
            </div>
            <span style={{ fontSize: 6, color: C.sub, fontWeight: 500, marginLeft: 4 }}>Abertura de Empresas</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stage */}
      <div className="flex-1 relative overflow-hidden" style={{ backgroundColor: C.bg }}>
        <SpreadsheetPanel enter={phase >= 1 && phase <= 4} fusing={fusing} />
        <ChatPanel       enter={phase >= 2 && phase <= 4} fusing={fusing} />
        <EmailPanel      enter={phase >= 3 && phase <= 4} fusing={fusing} />
        <KanbanBoard phase={phase} />
      </div>
    </div>
  )
}
