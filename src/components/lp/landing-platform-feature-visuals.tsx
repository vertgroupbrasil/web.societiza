'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'

const C = {
  bg: '#FAFAF8',
  surface: '#FFFFFF',
  border: 'rgba(55, 50, 47, 0.08)',
  borderMed: 'rgba(55, 50, 47, 0.12)',
  muted: 'rgba(55, 50, 47, 0.40)',
  text: '#2D2A26',
  sub: '#6B6560',
  orange: '#E85D04',
  orangeBg: '#FFF4ED',
  green: '#0F9D58',
  greenBg: '#E8F5E9',
  amber: '#F59E0B',
  amberBg: '#FFFBEB',
  indigo: '#5B5FC7',
  indigoBg: '#F0F0FF',
  cyan: '#0891B2',
  cyanBg: '#ECFEFF',
  chrome: '#F5F4F2',
}

// Smooth easing without bounce - more fluid
const smooth = { duration: 0.9, ease: [0.32, 0.72, 0, 1] }
const smoothFast = { duration: 0.3, ease: [0.32, 0.72, 0, 1] }
const smoothSlow = { duration: 0.7, ease: [0.32, 0.72, 0, 1] }

export type LandingPlatformFeatureVisualProps = { isActive: boolean }

// ─── macOS-style cursor ───────────────────────────────────────────────────────

function Cursor({
  x,
  y,
  clicking,
  visible = true,
}: {
  x: number
  y: number
  clicking: boolean
  visible?: boolean
}) {
  return (
    <motion.div
      className="absolute pointer-events-none z-50"
      style={{ marginLeft: -1, marginTop: -1 }}
      animate={{
        left: x,
        top: y,
        scale: clicking ? 0.85 : 1,
        opacity: visible ? 1 : 0,
      }}
      transition={{
        left: { duration: 0.55, ease: [0.32, 0.72, 0, 1] },
        top: { duration: 0.55, ease: [0.32, 0.72, 0, 1] },
        scale: { duration: 0.1, ease: [0.32, 0.72, 0, 1] },
        opacity: { duration: 0.2, ease: [0.32, 0.72, 0, 1] },
      }}
    >
      {/* macOS-style pointer */}
      <svg width="18" height="22" viewBox="0 0 18 22" fill="none">
        <path
          d="M1.5 0.5L1.5 17L5.8 13L9.5 20.5L12 19.5L8.3 12H15L1.5 0.5Z"
          fill="black"
          stroke="white"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
      </svg>
    </motion.div>
  )
}

// ─── Visual 1: Workflow (kanban builder with mouse) ───────────────────────────

const WF_TITLE_TARGET = 'Santa Catarina'
const WF_DESC_TARGET = 'Workflow baseado em SC'
const SHEET_W = 178

const WF_PHASES = [900, 600, 700, 600, 700, 650, 700, 700, 350, 1200, 1000, 700, 350, 700, 480, 480, 530, 2500, 300]

function WFDragHandle({ color, active }: { color: string; active?: boolean }) {
  return (
    <motion.svg 
      width="8" height="10" viewBox="0 0 8 10" fill="none" 
      style={{ flexShrink: 0 }}
      animate={{ scale: active ? 1.1 : 1 }}
      transition={smooth}
    >
      <circle cx="2" cy="2" r="1.1" fill={color} />
      <circle cx="6" cy="2" r="1.1" fill={color} />
      <circle cx="2" cy="5" r="1.1" fill={color} />
      <circle cx="6" cy="5" r="1.1" fill={color} />
      <circle cx="2" cy="8" r="1.1" fill={color} />
      <circle cx="6" cy="8" r="1.1" fill={color} />
    </motion.svg>
  )
}

function WFFieldIcon({ type, color }: { type: 'text' | 'select' | 'checkbox'; color: string }) {
  if (type === 'text') return (
    <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
      <path d="M1.5 2.5H7.5M4.5 2.5V7" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
  if (type === 'select') return (
    <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
      <path d="M2.5 4L4.5 6L6.5 4" stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M1.5 2.5H7.5" stroke={color} strokeWidth="1" strokeLinecap="round" />
    </svg>
  )
  return (
    <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
      <rect x="1" y="1" width="7" height="7" rx="1.5" stroke={color} strokeWidth="1" />
      <path d="M3 4.5L4 5.5L6 3.5" stroke={color} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

type WFColInfo = { name: string; color: string; bg: string }
type WFFieldItem = { id: string; type: 'text' | 'select' | 'checkbox' }

type WFSheetProps = {
  col: WFColInfo
  open: boolean
  fields: WFFieldItem[]
  draggingId: string | null
  activeBtns: ('text' | 'select' | 'checkbox')[]
}

function WFSheet({ col, open, fields, draggingId, activeBtns }: WFSheetProps) {
  const btnDefs = [
    { id: 'text' as const, label: 'Texto' },
    { id: 'select' as const, label: 'Select' },
    { id: 'checkbox' as const, label: 'Check' },
  ]
  const fieldLabels: Record<string, string> = { text: 'Campo de texto', select: 'Menu de opções' }

  return (
    <motion.div
      className="absolute top-0 right-0 bottom-0 flex flex-col overflow-hidden"
      style={{
        width: SHEET_W,
        backgroundColor: C.surface,
        borderLeft: `1px solid ${C.border}`,
        borderRadius: '12px 0 0 0',
        zIndex: 30,
      }}
      initial={{ x: SHEET_W, opacity: 0 }}
      animate={{ x: open ? 0 : SHEET_W, opacity: open ? 1 : 0 }}
      transition={smooth}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2.5 shrink-0 border-b" style={{ borderColor: C.border }}>
        <p className="text-[9.5px] font-semibold" style={{ color: C.text }}>{col.name}</p>
        <span className="text-[7px] uppercase tracking-wider font-medium" style={{ color: C.muted }}>campos</span>
      </div>

      {/* Fixed name input */}
      <div className="px-3 py-2 shrink-0 border-b" style={{ borderColor: C.border }}>
        <div className="flex items-center gap-1.5 rounded-lg border px-2 py-1.5" style={{ backgroundColor: C.chrome, borderColor: C.border }}>
          <span className="text-[7px] font-medium uppercase tracking-wide shrink-0" style={{ color: C.muted }}>Nome</span>
          <span className="text-[9px] font-medium" style={{ color: C.text }}>{col.name}</span>
        </div>
      </div>

      {/* Field type buttons */}
      <div className="flex items-center gap-1.5 px-3 py-2 shrink-0 border-b" style={{ borderColor: C.border }}>
        {btnDefs.map(({ id, label }) => {
          const active = activeBtns.includes(id)
          return (
            <motion.div 
              key={id}
              className="flex items-center gap-1 rounded-lg px-2 py-1.5 border text-[7.5px] font-medium"
              style={{
                border: `1px solid ${active ? col.color + '40' : C.border}`,
                backgroundColor: active ? col.bg : 'transparent',
                color: active ? col.color : C.sub,
              }}
              animate={{ backgroundColor: active ? col.bg : 'transparent' }}
              transition={smooth}
            >
              <WFFieldIcon type={id} color={active ? col.color : C.muted} />
              {label}
            </motion.div>
          )
        })}
      </div>

      {/* Fields list */}
      <div className="flex-1 px-3 py-2 flex flex-col gap-2 overflow-hidden relative">
        <AnimatePresence mode="popLayout">
          {fields.map((f) => {
            const isDragging = f.id === draggingId
            return (
              <motion.div
                key={f.id}
                className="flex items-center gap-2 rounded-lg border px-2.5 py-2 shrink-0"
                style={{
                  backgroundColor: isDragging ? col.bg : C.chrome,
                  border: `1px solid ${isDragging ? col.color + '30' : C.border}`,
                }}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ 
                  opacity: 1, 
                  x: 0, 
                  y: isDragging ? -40 : 0, 
                  scale: isDragging ? 1.03 : 1,
                }}
                exit={{ opacity: 0 }}
                transition={smooth}
              >
                <WFDragHandle color={isDragging ? col.color : C.muted} active={isDragging} />
                <motion.div 
                  className="rounded-md shrink-0 flex items-center justify-center"
                  style={{ width: 16, height: 16, backgroundColor: col.bg }}
                >
                  <WFFieldIcon type={f.type} color={col.color} />
                </motion.div>
                <span className="text-[8px] font-medium" style={{ color: C.sub }}>{fieldLabels[f.type]}</span>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

function WFColumnInner({ col, cardName, cardPct }: { col: WFColInfo; cardName: string; cardPct: number }) {
  return (
    <div className="flex flex-col" style={{ width: 108, height: '100%' }}>
      <div 
        className="flex items-center gap-1 px-2 py-2 rounded-t-xl"
        style={{
          backgroundColor: col.bg,
          borderTop: `1.5px solid ${col.color}25`,
          borderLeft: `1.5px solid ${col.color}25`,
          borderRight: `1.5px solid ${col.color}25`,
        }}
      >
        <WFDragHandle color={col.color + '70'} />
        <span className="text-[8.5px] font-semibold flex-1 leading-none" style={{ color: col.color }}>{col.name}</span>
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <circle cx="2" cy="5" r="1" fill={col.color} opacity="0.4" />
          <circle cx="5" cy="5" r="1" fill={col.color} opacity="0.4" />
          <circle cx="8" cy="5" r="1" fill={col.color} opacity="0.4" />
        </svg>
      </div>
      <div 
        className="flex-1 p-2 flex flex-col gap-2 overflow-hidden rounded-b-xl"
        style={{
          backgroundColor: col.bg + '40',
          borderBottom: `1.5px solid ${col.color}15`,
          borderLeft: `1.5px solid ${col.color}15`,
          borderRight: `1.5px solid ${col.color}15`,
        }}
      >
        <div 
          className="rounded-xl border px-2.5 py-2 flex flex-col gap-2"
          style={{ backgroundColor: C.surface, borderColor: C.border }}
        >
          <p className="text-[8px] font-medium leading-tight" style={{ color: C.text }}>{cardName}</p>
          <div className="flex items-center gap-1.5">
            <div className="flex-1 rounded-full overflow-hidden" style={{ height: 4, backgroundColor: col.bg }}>
              <motion.div 
                style={{ height: '100%', backgroundColor: col.color + '90', borderRadius: 999 }}
                initial={{ width: 0 }}
                animate={{ width: `${cardPct}%` }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
            <span className="text-[7px] font-medium" style={{ color: C.muted }}>{cardPct}%</span>
          </div>
        </div>
        <div 
          className="rounded-xl border border-dashed px-2.5 py-2"
          style={{ borderColor: col.color + '30' }}
        >
          <span className="text-[7px] font-medium" style={{ color: col.color + '70' }}>+ Adicionar</span>
        </div>
      </div>
    </div>
  )
}

// Typewriter text component with size growth animation
function TypewriterText({ 
  text, 
  isTyping, 
  baseSize = 11,
  finalSize = 11,
  color,
  defaultColor,
  isDefault = false,
}: { 
  text: string
  isTyping: boolean
  baseSize?: number
  finalSize?: number
  color: string
  defaultColor: string
  isDefault?: boolean
}) {
  return (
    <motion.span
      className="font-semibold inline-block origin-left"
      style={{ 
        color: isDefault ? defaultColor : color,
        minWidth: 8,
      }}
      animate={{
        fontSize: isTyping ? baseSize : finalSize,
        scale: isTyping ? 0.95 : 1,
      }}
      transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
    >
      {text.split('').map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 3 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.15, 
            delay: i * 0.04,
            ease: [0.32, 0.72, 0, 1]
          }}
        >
          {char}
        </motion.span>
      ))}
    </motion.span>
  )
}

export function WorkflowFeatureVisual({ isActive }: LandingPlatformFeatureVisualProps) {
  const [phase, setPhase] = useState(0)
  const [typedTitle, setTypedTitle] = useState('')
  const [typedDesc, setTypedDesc] = useState('')

  useEffect(() => {
    if (phase === 9) {
      let i = 0
      const id = setInterval(() => { 
        i++
        setTypedTitle(WF_TITLE_TARGET.slice(0, i))
        if (i >= WF_TITLE_TARGET.length) clearInterval(id) 
      }, 65)
      return () => clearInterval(id)
    }
    if (phase === 10) {
      let i = 0
      const id = setInterval(() => { 
        i++
        setTypedDesc(WF_DESC_TARGET.slice(0, i))
        if (i >= WF_DESC_TARGET.length) clearInterval(id) 
      }, 45)
      return () => clearInterval(id)
    }
    if (phase === 18) { setTypedTitle(''); setTypedDesc('') }
  }, [phase])

  useEffect(() => {
    let cur = 0
    let t: NodeJS.Timeout
    const run = () => { setPhase(cur); t = setTimeout(() => { cur = (cur + 1) % WF_PHASES.length; run() }, WF_PHASES[cur]) }
    run()
    return () => clearTimeout(t)
  }, [])

  const col1: WFColInfo = { name: 'Etapa 1', color: C.indigo, bg: C.indigoBg }
  const col2: WFColInfo = { name: 'Etapa 2', color: C.orange, bg: C.orangeBg }
  const col3: WFColInfo = { name: 'Etapa 3', color: C.cyan, bg: C.cyanBg }

  const isReset = phase >= 18
  const showCol2 = phase >= 1 && !isReset
  const showCol3 = phase >= 3 && !isReset
  const col3IsDragging = phase === 5
  const col3DragX = col3IsDragging ? -120 : 0
  const columnsReordered = phase >= 6 && !isReset

  const titleIsTyping = phase === 9 && typedTitle.length < WF_TITLE_TARGET.length
  const descIsTyping = phase === 10 && typedDesc.length < WF_DESC_TARGET.length
  const titleIsEditing = phase >= 8 && phase <= 9
  const descIsEditing = phase === 10
  
  const displayTitle = isReset || phase < 8 ? 'Seu template' : phase === 8 ? '' : phase === 9 ? typedTitle : WF_TITLE_TARGET
  const displayDesc = isReset || phase < 10 ? 'Descrição do template' : phase === 10 ? typedDesc : WF_DESC_TARGET
  const isDefaultTitle = phase < 8 || isReset
  const isDefaultDesc = phase < 10 || isReset

  const sheetOpen = phase >= 12 && !isReset

  const fields: WFFieldItem[] = []
  if (phase >= 14) fields.push({ id: 'f-text', type: 'text' })
  if (phase >= 15) fields.push({ id: 'f-select', type: 'select' })

  const orderedFields: WFFieldItem[] = phase >= 17
    ? [{ id: 'f-select', type: 'select' }, { id: 'f-text', type: 'text' }]
    : fields

  const draggingId = phase === 16 ? 'f-select' : null

  const activeBtns: ('text' | 'select' | 'checkbox')[] = []
  if (phase >= 14) activeBtns.push('text')
  if (phase >= 15) activeBtns.push('select')

  // Precise cursor positions - pixel perfect alignment
  const cursorMap: Record<number, [number, number]> = {
    0:  [200, 95],      // + Nova etapa button
    1:  [320, 95],      // clicking + Nova etapa
    2:  [360, 100],      // after col2 appears
    3:  [355, 100],      // clicking again for col3
    4:  [265, 90],     // moving to col3 header
    5:  [150, 90],     // dragging col3 left
    6:  [230, 130],     // after reorder
    7:  [95, 22],       // moving to title edit icon
    8:  [95, 22],       // clicking edit icon
    9:  [75, 22],       // in title input (typing)
    10: [75, 38],       // in description input (typing)
    11: [52, 130],      // moving to col1 header
    12: [52, 130],      // clicking col1
    13: [452, 150],     // moving to Texto button in sheet
    14: [490, 150],     // clicking Texto, moving to Select
    15: [420, 245],     // in field list, near select field
    16: [420, 190],     // dragging select up
    17: [200, 152],     // after reorder
  }
  const [cx, cy] = cursorMap[Math.min(phase, 17)] ?? [290, 200]
  const clicking = [1, 3, 8, 12, 14].includes(phase)

  return (
    <div className="w-full h-full flex flex-col overflow-hidden relative select-none" style={{ backgroundColor: C.bg }}>
      {/* Toolbar */}
      <div 
        className="flex items-center justify-between px-4 py-2.5 border-b shrink-0"
        style={{ backgroundColor: C.surface, borderColor: C.border }}
      >
        <div className="flex items-center gap-2.5">
          <div 
            className="rounded-lg shrink-0" 
            style={{ width: 16, height: 16, backgroundColor: C.indigoBg, border: `1.5px solid ${C.indigo}25` }}
          />
          <div className="flex flex-col" style={{ gap: 4 }}>
            <div className="flex items-center gap-1.5">
              {/* Title with typewriter effect */}
              {phase === 9 && typedTitle ? (
                <TypewriterText 
                  text={typedTitle} 
                  isTyping={titleIsTyping}
                  baseSize={9}
                  finalSize={11}
                  color={C.text}
                  defaultColor={C.muted}
                />
              ) : (
                <motion.span 
                  className="text-[11px] font-semibold" 
                  style={{ color: isDefaultTitle ? C.muted : C.text, minWidth: 8 }}
                  layout
                  transition={smooth}
                >
                  {displayTitle}
                </motion.span>
              )}
              {titleIsEditing && (
                <motion.span 
                  animate={{ opacity: [1, 0.3, 1] }} 
                  transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }}
                  style={{ display: 'inline-block', width: 2, height: 12, backgroundColor: C.indigo, borderRadius: 1, flexShrink: 0 }} 
                />
              )}
              <motion.div 
                className="rounded-md flex items-center justify-center shrink-0"
                style={{ width: 18, height: 18, backgroundColor: phase >= 8 && phase <= 10 ? C.indigoBg : 'transparent' }}
                animate={{ scale: phase === 8 ? 0.92 : 1 }}
                transition={smoothFast}
              >
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M2 7.5L5.5 4L7 5.5L3.5 9L1.5 9.5L2 7.5Z" stroke={phase >= 8 && phase <= 10 ? C.indigo : C.muted} strokeWidth="1.1" strokeLinejoin="round" fill="none" />
                  <path d="M5.5 4L7 5.5" stroke={phase >= 8 && phase <= 10 ? C.indigo : C.muted} strokeWidth="1.1" strokeLinecap="round" />
                </svg>
              </motion.div>
            </div>
            <div className="flex items-center gap-1">
              {/* Description with typewriter effect */}
              {phase === 10 && typedDesc ? (
                <TypewriterText 
                  text={typedDesc} 
                  isTyping={descIsTyping}
                  baseSize={7}
                  finalSize={8}
                  color={C.sub}
                  defaultColor={C.muted}
                />
              ) : (
                <motion.span 
                  className="text-[8px]" 
                  style={{ color: isDefaultDesc ? C.muted : C.sub, minWidth: 8 }} 
                  layout 
                  transition={smooth}
                >
                  {displayDesc}
                </motion.span>
              )}
              {descIsEditing && (
                <motion.span 
                  animate={{ opacity: [1, 0.3, 1] }} 
                  transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }}
                  style={{ display: 'inline-block', width: 1.5, height: 9, backgroundColor: C.indigo, borderRadius: 1, flexShrink: 0 }} 
                />
              )}
            </div>
          </div>
        </div>
        <div 
          className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-[8.5px] font-semibold shrink-0"
          style={{ backgroundColor: C.orangeBg, color: C.orange, border: `1.5px solid ${C.orange}20` }}
        >
          Salvar template
        </div>
      </div>

      {/* Board */}
      <div className="flex-1 relative overflow-hidden">
        <div className="absolute inset-0 p-4 flex items-start gap-3">

          {/* Normal column order (phases 0–5) */}
          {!isReset && !columnsReordered && (
            <>
              <motion.div 
                style={{ height: '100%' }} 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={smooth}
              >
                <WFColumnInner col={col1} cardName="Padaria do Pedro" cardPct={40} />
              </motion.div>

              <AnimatePresence>
                {showCol2 && (
                  <motion.div 
                    key="col2-n" 
                    style={{ height: '100%' }}
                    initial={{ opacity: 0, x: 30 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    exit={{ opacity: 0 }}
                    transition={smooth}
                  >
                    <WFColumnInner col={col2} cardName="Borracharia Silva" cardPct={15} />
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {showCol3 && (
                  <motion.div 
                    key="col3-n" 
                    style={{ height: '100%' }}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: col3DragX }}
                    exit={{ opacity: 0 }}
                    transition={smooth}
                  >
                    <WFColumnInner col={col3} cardName="Eletrica Nogueira" cardPct={60} />
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}

          {/* Reordered columns: [col1, col3, col2] (phases 6+) */}
          <AnimatePresence>
            {!isReset && columnsReordered && (
              <motion.div 
                key="cols-reordered" 
                className="flex gap-3" 
                style={{ height: '100%' }}
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                transition={smooth}
              >
                <WFColumnInner col={col1} cardName="Padaria do Pedro" cardPct={40} />
                <WFColumnInner col={col3} cardName="Eletrica Nogueira" cardPct={60} />
                <WFColumnInner col={col2} cardName="Borracharia Silva" cardPct={15} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* + Nova etapa button */}
          {!isReset && (
            <motion.div
              className="flex items-center gap-1.5 rounded-xl border border-dashed px-2.5 shrink-0 self-start text-[7.5px] font-medium"
              style={{ height: 30, borderColor: C.borderMed, color: C.muted }}
              animate={{ scale: [1, 3].includes(phase) ? 0.95 : 1 }}
              transition={smoothFast}
            >
              <span style={{ fontSize: 12, lineHeight: 1, fontWeight: 500 }}>+</span> Nova etapa
            </motion.div>
          )}

          <WFSheet col={col1} open={sheetOpen} fields={orderedFields} draggingId={draggingId} activeBtns={activeBtns} />
        </div>
      </div>

      <Cursor x={cx} y={cy} clicking={clicking} visible={!isReset} />
    </div>
  )
}

// ─── Visual 2: Insights with interactive charts ───────────────────────────────

const metrics = [
  { label: 'Ativos', value: '18', key: 'active' },
  { label: 'Parados', value: '4', alert: true, key: 'stalled' },
  { label: 'Concluidos', value: '7', key: 'completed' },
  { label: 'Media dias', value: '11d', key: 'avg' },
]

const barData = [
  { stage: 'Doc.', pct: 35, count: 5, color: C.indigo, key: 'documentacao' },
  { stage: 'Viab.', pct: 80, count: 8, bottleneck: true, color: C.amber, key: 'viabilidade' },
  { stage: 'Reg.', pct: 55, count: 6, color: C.cyan, key: 'registro' },
  { stage: 'Alv.', pct: 25, count: 3, color: C.green, key: 'alvara' },
  { stage: 'Ok', pct: 45, count: 7, color: C.orange, key: 'concluido' },
]

const donutData = [
  { label: 'MEI', value: 45, color: C.indigo },
  { label: 'LTDA', value: 30, color: C.orange },
  { label: 'EIRELI', value: 15, color: C.cyan },
  { label: 'Outros', value: 10, color: C.chrome },
]

const INS_D = [600, 800, 600, 800, 600, 800, 2200, 400]

export function InsightsFeatureVisual({ isActive }: LandingPlatformFeatureVisualProps) {
  const [phase, setPhase] = useState(0)
  const [hoveredBar, setHoveredBar] = useState<number | null>(null)
  const [hoveredDonut, setHoveredDonut] = useState<number | null>(null)
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null)
  const [cursorPos, setCursorPos] = useState<[number, number]>([210, 170])
  const [clicking, setClicking] = useState(false)

  useEffect(() => {
    let cur = 0
    let t: NodeJS.Timeout
    const run = () => { 
      setPhase(cur)
      
      // Cursor animation sequence - precise positions
      if (cur === 1) {
        setCursorPos([150, 300])
        setHoveredBar(1)
      } else if (cur === 2) {
        setCursorPos([230, 270])
        setHoveredBar(2)
      } else if (cur === 3) {
        setCursorPos([530, 200])
        setClicking(true)
        setTimeout(() => {
          setClicking(false)
          setSelectedFilter('registro')
        }, 200)
      } else if (cur === 4) {
        setCursorPos([500, 260])
        setHoveredBar(null)
        setHoveredDonut(0)
      } else if (cur === 5) {
        setCursorPos([355, 155])
        setHoveredDonut(1)
      } else if (cur === 6) {
        setHoveredDonut(null)
        setSelectedFilter(null)
      } else {
        setHoveredBar(null)
        setHoveredDonut(null)
        setCursorPos([210, 170])
      }
      
      t = setTimeout(() => { cur = (cur + 1) % INS_D.length; run() }, INS_D[cur]) 
    }
    run()
    return () => clearTimeout(t)
  }, [])

  const showBars = phase >= 1
  const showBottleneck = phase >= 2 && phase <= 6

  // Calculate donut segments
  const total = donutData.reduce((a, b) => a + b.value, 0)
  let cumulative = 0
  const donutSegments = donutData.map((d, i) => {
    const start = cumulative
    cumulative += (d.value / total) * 100
    return { ...d, start, end: cumulative, index: i }
  })

  return (
    <div className="w-full h-full flex flex-col p-4 gap-3 relative" style={{ backgroundColor: C.bg }}>
      {/* Header with filter indicator */}
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-semibold" style={{ color: C.text }}>Visao geral</p>
        <AnimatePresence>
          {selectedFilter && (
            <motion.div 
              className="flex items-center gap-1.5 rounded-full px-2.5 py-1"
              style={{ backgroundColor: C.cyanBg, border: `1px solid ${C.cyan}30` }}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={smooth}
            >
              <span className="text-[7.5px] font-medium" style={{ color: C.cyan }}>Filtro: {selectedFilter}</span>
              <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                <path d="M2 2L6 6M6 2L2 6" stroke={C.cyan} strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Metrics row */}
      <div className="grid grid-cols-4 gap-2">
        {metrics.map((m, i) => (
          <motion.div 
            key={m.label} 
            className="rounded-xl border px-2.5 py-2"
            style={{ 
              backgroundColor: m.alert && showBottleneck ? C.amberBg : C.surface, 
              border: `1.5px solid ${m.alert && showBottleneck ? C.amber + '30' : C.border}` 
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ 
              opacity: 1, 
              y: 0,
              backgroundColor: m.alert && showBottleneck ? C.amberBg : C.surface 
            }}
            transition={{ ...smooth, delay: i * 0.05 }}
          >
            <p className="text-[12px] font-bold leading-none" style={{ color: m.alert && showBottleneck ? C.amber : C.text }}>
              {m.value}
            </p>
            <p className="text-[7.5px] mt-1 leading-none font-medium" style={{ color: C.muted }}>{m.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts row */}
      <div className="flex gap-3 flex-1">
        {/* Bar chart */}
        <motion.div 
          className="flex-1 rounded-xl border p-3 flex flex-col gap-2" 
          style={{ backgroundColor: C.surface, border: `1.5px solid ${C.border}` }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...smooth, delay: 0.15 }}
        >
          <p className="text-[8.5px] font-semibold" style={{ color: C.muted }}>Processos por etapa</p>
          <div className="flex items-end gap-2 flex-1 relative">
            {barData.map(({ stage, pct, count, bottleneck, color, key }, i) => {
              const isHovered = hoveredBar === i
              return (
                <div key={stage} className="flex-1 flex flex-col items-center gap-1.5 relative">
                  {/* Tooltip */}
                  <AnimatePresence>
                    {isHovered && (
                      <motion.div 
                        className="absolute -top-8 left-1/2 rounded-lg px-2 py-1 z-10"
                        style={{ 
                          backgroundColor: C.text, 
                          transform: 'translateX(-50%)',
                        }}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        transition={smoothFast}
                      >
                        <p className="text-[7px] font-semibold text-white whitespace-nowrap">{count} processos</p>
                        <div 
                          className="absolute left-1/2 -bottom-1 w-2 h-2 rotate-45"
                          style={{ backgroundColor: C.text, transform: 'translateX(-50%)' }}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  <div className="w-full flex items-end justify-center" style={{ height: 65 }}>
                    <motion.div 
                      className="rounded-t-md cursor-pointer"
                      style={{ 
                        width: '75%',
                        backgroundColor: isHovered ? color : (bottleneck && showBottleneck ? C.orange : C.chrome),
                      }}
                      initial={{ height: 0 }}
                      animate={{ 
                        height: showBars ? `${pct}%` : 0, 
                        backgroundColor: isHovered ? color : (bottleneck && showBottleneck ? C.orange : C.chrome),
                        scale: isHovered ? 1.05 : 1,
                      }}
                      transition={{ 
                        height: { duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: i * 0.06 },
                        backgroundColor: smoothFast,
                        scale: smoothFast,
                      }} 
                    />
                  </div>
                  <span 
                    className="text-[7px] font-medium leading-none" 
                    style={{ color: isHovered ? color : (bottleneck && showBottleneck ? C.orange : C.muted) }}
                  >
                    {stage}
                  </span>
                </div>
              )
            })}
          </div>
        </motion.div>

        {/* Donut chart */}
        <motion.div 
          className="rounded-xl border p-3 flex flex-col gap-2" 
          style={{ backgroundColor: C.surface, border: `1.5px solid ${C.border}`, width: 120 }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...smooth, delay: 0.2 }}
        >
          <p className="text-[8.5px] font-semibold" style={{ color: C.muted }}>Tipo empresa</p>
          <div className="flex-1 flex items-center justify-center relative">
            <svg width="70" height="70" viewBox="0 0 70 70">
              {donutSegments.map((seg, i) => {
                const isHovered = hoveredDonut === i
                const radius = 28
                const circumference = 2 * Math.PI * radius
                const strokeDasharray = `${((seg.end - seg.start) / 100) * circumference} ${circumference}`
                const strokeDashoffset = -((seg.start / 100) * circumference)
                
                return (
                  <motion.circle
                    key={seg.label}
                    cx="35"
                    cy="35"
                    r={radius}
                    fill="none"
                    stroke={seg.color}
                    strokeWidth={isHovered ? 10 : 8}
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    style={{ transformOrigin: '35px 35px', transform: 'rotate(-90deg)' }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, strokeWidth: isHovered ? 10 : 8 }}
                    transition={{ ...smooth, delay: i * 0.1 }}
                  />
                )
              })}
              <text x="35" y="35" textAnchor="middle" dominantBaseline="middle" style={{ fontSize: 9, fontWeight: 600, fill: C.text }}>
                {hoveredDonut !== null ? `${donutData[hoveredDonut].value}%` : '100%'}
              </text>
            </svg>
            
            {/* Donut tooltip */}
            <AnimatePresence>
              {hoveredDonut !== null && (
                <motion.div 
                  className="absolute -right-1 top-1/2 rounded-lg px-2 py-1"
                  style={{ backgroundColor: C.text }}
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -5 }}
                  transition={smoothFast}
                >
                  <p className="text-[7px] font-semibold text-white whitespace-nowrap">{donutData[hoveredDonut].label}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Legend */}
          <div className="flex flex-wrap gap-x-2 gap-y-1">
            {donutData.map((d, i) => (
              <div key={d.label} className="flex items-center gap-1">
                <div className="rounded-full" style={{ width: 5, height: 5, backgroundColor: d.color }} />
                <span className="text-[6.5px] font-medium" style={{ color: hoveredDonut === i ? d.color : C.muted }}>{d.label}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottleneck alert */}
      <AnimatePresence>
        {showBottleneck && !selectedFilter && (
          <motion.div 
            className="flex items-center gap-2 rounded-xl border px-3 py-2"
            style={{ backgroundColor: C.amberBg, border: `1.5px solid ${C.amber}20` }}
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: 5 }}
            transition={smooth}
          >
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none" className="shrink-0">
              <path d="M7 2L12 11.5H2L7 2Z" stroke={C.amber} strokeWidth="1.2" strokeLinejoin="round" fill={C.amberBg} />
              <path d="M7 6V8" stroke={C.amber} strokeWidth="1.2" strokeLinecap="round" />
              <circle cx="7" cy="9.5" r="0.7" fill={C.amber} />
            </svg>
            <p className="text-[8.5px]" style={{ color: C.amber }}>
              <span className="font-semibold">Viabilidade</span> tem 4 processos parados ha +3 dias
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <Cursor x={cursorPos[0]} y={cursorPos[1]} clicking={clicking} />
    </div>
  )
}

// ─── Visual 3: Email Notifications (client & accountant) ──────────────────────

const NOTIF_D = [500, 700, 700, 700, 700, 2500, 400]

// Email card with elegant hover animation
function EmailCard({ 
  type, 
  show, 
  showPulse, 
  isHovered,
  delay = 0 
}: { 
  type: 'contador' | 'cliente'
  show: boolean
  showPulse: boolean
  isHovered: boolean
  delay?: number
}) {
  const isContador = type === 'contador'
  const color = isContador ? C.orange : C.green
  const bg = isContador ? C.orangeBg : C.greenBg
  const email = isContador ? 'joao@contabil.com' : 'borracharia@email.com'
  const label = isContador ? 'Contador' : 'Cliente'
  const message = isContador 
    ? 'Processo avancou: Borracharia Tres Irmaos movido para Alvara'
    : 'Seu processo avancou! Agora estamos na etapa de Alvara.'

  return (
    <AnimatePresence>
      {show && (
        <motion.div 
          className="rounded-xl border p-3 flex flex-col gap-2 relative overflow-hidden"
          style={{ backgroundColor: C.surface, border: `1.5px solid ${C.border}`, width: 180 }}
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ 
            opacity: 1, 
            y: 0, 
            scale: isHovered ? 1.02 : 1,
          }}
          exit={{ opacity: 0, y: 15, scale: 0.98 }}
          transition={{ ...smooth, delay }}
        >
          {/* Hover highlight effect */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{ backgroundColor: bg }}
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 0.3 : 0 }}
            transition={smoothFast}
          />
          
          <div className="flex items-center gap-2 relative z-10">
            <motion.div 
              className="rounded-lg flex items-center justify-center"
              style={{ width: 24, height: 24, backgroundColor: bg }}
              animate={{ 
                scale: isHovered ? 1.1 : 1,
                rotate: isHovered ? [0, -5, 5, 0] : 0,
              }}
              transition={{ 
                scale: smoothFast,
                rotate: { duration: 0.4, ease: [0.32, 0.72, 0, 1] }
              }}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <rect x="1" y="2.5" width="10" height="7" rx="1" stroke={color} strokeWidth="1.1" />
                <path d="M1.5 3.5L6 7L10.5 3.5" stroke={color} strokeWidth="1.1" strokeLinecap="round" />
              </svg>
            </motion.div>
            <div className="flex-1">
              <p className="text-[8px] font-semibold" style={{ color: C.text }}>{label}</p>
              <p className="text-[7px]" style={{ color: C.muted }}>{email}</p>
            </div>
            <motion.div 
              className="rounded-full"
              style={{ width: 6, height: 6, backgroundColor: color }}
              animate={{ 
                scale: showPulse ? [1, 1.4, 1] : (isHovered ? 1.2 : 1), 
                opacity: showPulse ? [1, 0.5, 1] : 1 
              }}
              transition={{ 
                duration: showPulse ? 1.2 : 0.3, 
                repeat: showPulse ? Infinity : 0,
                ease: [0.32, 0.72, 0, 1]
              }}
            />
          </div>
          <motion.div 
            className="rounded-lg p-2 relative z-10"
            style={{ backgroundColor: C.chrome }}
            animate={{ backgroundColor: isHovered ? bg : C.chrome }}
            transition={smoothFast}
          >
            <p className="text-[7.5px] font-medium" style={{ color: C.sub }}>
              {message}
            </p>
          </motion.div>
          <div className="flex items-center gap-1.5 relative z-10">
            <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
              <circle cx="4" cy="4" r="3" stroke={C.muted} strokeWidth="0.8" />
              <path d="M4 2V4.5L5.5 5.5" stroke={C.muted} strokeWidth="0.8" strokeLinecap="round" />
            </svg>
            <span className="text-[6.5px]" style={{ color: C.muted }}>Enviado automaticamente</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function NotificationsFeatureVisual({ isActive }: LandingPlatformFeatureVisualProps) {
  const [phase, setPhase] = useState(0)
  const [hoveredEmail, setHoveredEmail] = useState<'contador' | 'cliente' | null>(null)

  useEffect(() => {
    let cur = 0
    let t: NodeJS.Timeout
    const run = () => { 
      setPhase(cur)
      
      // Hover animation sequence
      if (cur === 3) {
        setHoveredEmail('contador')
      } else if (cur === 4) {
        setHoveredEmail('cliente')
      } else {
        setHoveredEmail(null)
      }
      
      t = setTimeout(() => { cur = (cur + 1) % NOTIF_D.length; run() }, NOTIF_D[cur]) 
    }
    run()
    return () => clearTimeout(t)
  }, [])

  const showConnection = phase >= 1 && phase <= 5
  const showContadorEmail = phase >= 2 && phase <= 5
  const showClienteEmail = phase >= 3 && phase <= 5
  const showPulse = phase >= 4 && phase <= 5

  return (
    <div className="w-full h-full flex flex-col p-5 gap-4 relative overflow-hidden" style={{ backgroundColor: C.bg }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-semibold" style={{ color: C.text }}>Notificações Automáticas</p>
        <motion.div 
          className="flex items-center gap-1.5 rounded-full px-2.5 py-1.5" 
          style={{ backgroundColor: C.greenBg }}
          animate={{ scale: showPulse ? [1, 1.02, 1] : 1 }}
          transition={{ duration: 1.5, repeat: showPulse ? Infinity : 0, ease: "easeInOut" }}
        >
          <motion.div 
            className="rounded-full" 
            style={{ width: 5, height: 5, backgroundColor: C.green }}
            animate={{ opacity: showPulse ? [1, 0.5, 1] : 1 }} 
            transition={{ duration: 1, repeat: showPulse ? Infinity : 0, ease: "easeInOut" }} 
          />
          <span className="text-[8px] font-semibold" style={{ color: C.green }}>Sincronizado</span>
        </motion.div>
      </div>

      {/* Central workflow card */}
      <motion.div 
        className="mx-auto rounded-xl border px-4 py-3 relative z-10"
        style={{ backgroundColor: C.surface, border: `1.5px solid ${C.border}`, width: '85%' }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={smooth}
      >
        <div className="flex items-center gap-3">
          <div className="rounded-lg flex items-center justify-center" style={{ width: 28, height: 28, backgroundColor: C.orangeBg }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <rect x="2" y="2" width="4" height="10" rx="1" stroke={C.orange} strokeWidth="1.2" />
              <rect x="8" y="2" width="4" height="6" rx="1" stroke={C.orange} strokeWidth="1.2" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-[9px] font-semibold" style={{ color: C.text }}>Borracharia Tres Irmaos</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[7.5px] font-medium px-1.5 py-0.5 rounded" style={{ backgroundColor: C.cyanBg, color: C.cyan }}>Registro</span>
              <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                <path d="M1 4H7M5 2L7 4L5 6" stroke={C.muted} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="text-[7.5px] font-medium px-1.5 py-0.5 rounded" style={{ backgroundColor: C.greenBg, color: C.green }}>Alvará</span>
            </div>
          </div>
          <motion.div 
            className="rounded-full flex items-center justify-center"
            style={{ width: 20, height: 20, backgroundColor: C.greenBg }}
            animate={{ scale: showConnection ? [1, 1.15, 1] : 1 }}
            transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M2.5 5L4.5 7L7.5 3" stroke={C.green} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.div>
        </div>
      </motion.div>

      {/* Connection lines and email cards */}
      <div className="flex-1 relative">
        {/* Connection lines - animated paths */}
        {/* Container is ~380px wide (420-40 padding), cards are 180px wide with 16px gap */}
        {/* Left card center: ~100px, Right card center: ~280px, Workflow card center: ~190px */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 380 140" preserveAspectRatio="xMidYMid meet" style={{ zIndex: 1 }}>
          {/* Line to contador - starts from center, goes down, then to left card */}
          <motion.path
            d="M 190 0 L 190 28 L 100 28 L 100 58"
            fill="none"
            stroke={C.orange}
            strokeWidth="1.5"
            strokeDasharray="4 3"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ 
              pathLength: showConnection ? 1 : 0, 
              opacity: showConnection ? 1 : 0,
              strokeWidth: hoveredEmail === 'contador' ? 2.5 : 1.5,
            }}
            transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
          />
          {/* Line to cliente - starts from center, goes down, then to right card */}
          <motion.path
            d="M 190 0 L 190 28 L 280 28 L 280 58"
            fill="none"
            stroke={C.green}
            strokeWidth="1.5"
            strokeDasharray="4 3"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ 
              pathLength: showConnection ? 1 : 0, 
              opacity: showConnection ? 1 : 0,
              strokeWidth: hoveredEmail === 'cliente' ? 2.5 : 1.5,
            }}
            transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1], delay: 0.15 }}
          />
          
          {/* Animated dots along the path */}
          {showPulse && (
            <>
              <motion.circle
                r="3"
                fill={C.orange}
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: [0, 1, 1, 0],
                  cx: [190, 190, 100, 100],
                  cy: [0, 28, 28, 58],
                }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              />
              <motion.circle
                r="3"
                fill={C.green}
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: [0, 1, 1, 0],
                  cx: [190, 190, 280, 280],
                  cy: [0, 28, 28, 58],
                }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear", delay: 0.3 }}
              />
            </>
          )}
        </svg>

        {/* Email cards container */}
        <div className="absolute inset-x-0 bottom-0 flex justify-center gap-4 pb-2" style={{ zIndex: 2 }}>
          <EmailCard 
            type="contador" 
            show={showContadorEmail} 
            showPulse={showPulse} 
            isHovered={hoveredEmail === 'contador'}
          />
          <EmailCard 
            type="cliente" 
            show={showClienteEmail} 
            showPulse={showPulse}
            isHovered={hoveredEmail === 'cliente'}
            delay={0.1}
          />
        </div>
      </div>

      {/* Sync indicator */}
      <motion.div 
        className="flex items-center justify-center gap-3 py-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: showConnection ? 1 : 0.3 }}
        transition={smooth}
      >
        <motion.div 
          className="flex items-center gap-1.5"
          animate={{ scale: hoveredEmail === 'contador' ? 1.05 : 1 }}
          transition={smoothFast}
        >
          <div className="rounded-full" style={{ width: 4, height: 4, backgroundColor: C.orange }} />
          <span className="text-[7px] font-medium" style={{ color: C.muted }}>Contador notificado</span>
        </motion.div>
        <div className="rounded-full" style={{ width: 3, height: 3, backgroundColor: C.borderMed }} />
        <motion.div 
          className="flex items-center gap-1.5"
          animate={{ scale: hoveredEmail === 'cliente' ? 1.05 : 1 }}
          transition={smoothFast}
        >
          <div className="rounded-full" style={{ width: 4, height: 4, backgroundColor: C.green }} />
          <span className="text-[7px] font-medium" style={{ color: C.muted }}>Cliente notificado</span>
        </motion.div>
      </motion.div>
    </div>
  )
}
