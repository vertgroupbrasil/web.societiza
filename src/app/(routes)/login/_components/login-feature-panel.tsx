'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { VisualCentralizedFlow } from '@societiza/components/lp/visual-centralized-flow';
import { VisualProgressTimeline } from '@societiza/components/lp/visual-progress-timeline';
import { VisualTeamwork } from '@societiza/components/lp/visual-teamwork';

// ── Features que aparecem no painel direito ───────────────────────────────────

const FEATURES = [
  {
    id: 'workflow',
    tag: 'Societário',
    title: 'Organize cada processo do seu jeito',
    description:
      'Etapas, tarefas e campos personalizados que refletem a operação real do seu escritório.',
    Visual: VisualCentralizedFlow,
  },
  {
    id: 'timeline',
    tag: 'Acompanhamento',
    title: 'Visão clara de cada abertura de empresa',
    description:
      'Acompanhe o progresso de todos os processos em tempo real, sem perder nenhuma etapa.',
    Visual: VisualProgressTimeline,
  },
  {
    id: 'team',
    tag: 'Equipe',
    title: 'Sua equipe opera em sincronia',
    description:
      'Delegue tarefas, acompanhe execuções e mantenha todos alinhados sem precisar de planilhas.',
    Visual: VisualTeamwork,
  },
];

const INTERVAL_MS = 5000;

// ── Componente ────────────────────────────────────────────────────────────────

export function LoginFeaturePanel() {
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);

  const next = useCallback(() => {
    setActive((prev) => (prev + 1) % FEATURES.length);
    setProgress(0);
  }, []);

  // Progresso da barra e avanço automático
  useEffect(() => {
    const start = performance.now();
    let raf: number;

    const tick = (now: number) => {
      const elapsed = now - start;
      const pct = Math.min((elapsed / INTERVAL_MS) * 100, 100);
      setProgress(pct);
      if (pct < 100) {
        raf = requestAnimationFrame(tick);
      } else {
        next();
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, next]);

  const feature = FEATURES[active];

  return (
    <div
      className="w-full h-full flex flex-col"
      style={{
        background:
          'linear-gradient(135deg, #1A1714 0%, #2A2420 40%, #1E1A17 100%)',
      }}
    >
      {/* Visual animado */}
      <div className="flex-1 relative overflow-hidden">
        {/* Gradiente de sobreposição sutil no topo */}
        <div className="absolute inset-x-0 top-0 h-24 z-10 bg-gradient-to-b from-[#1A1714]/60 to-transparent pointer-events-none" />

        <AnimatePresence mode="wait">
          <motion.div
            key={feature.id}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          >
            <feature.Visual />
          </motion.div>
        </AnimatePresence>

        {/* Gradiente na base do visual */}
        <div className="absolute inset-x-0 bottom-0 h-48 z-10 bg-gradient-to-t from-[#1A1714] to-transparent pointer-events-none" />
      </div>

      {/* Texto + indicadores */}
      <div className="relative z-20 px-10 pb-10 pt-2 space-y-6">
        {/* Tag */}
        <AnimatePresence mode="wait">
          <motion.div
            key={feature.id + '-tag'}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.35 }}
          >
            <span
              className="inline-block text-[11px] font-semibold tracking-widest uppercase rounded-full px-3 py-1"
              style={{
                background: 'rgba(232, 93, 4, 0.15)',
                color: '#E85D04',
                border: '1px solid rgba(232, 93, 4, 0.3)',
              }}
            >
              {feature.tag}
            </span>
          </motion.div>
        </AnimatePresence>

        {/* Título e descrição */}
        <AnimatePresence mode="wait">
          <motion.div
            key={feature.id + '-text'}
            className="space-y-2"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4, delay: 0.05 }}
          >
            <h2 className="text-2xl font-bold text-white leading-snug">
              {feature.title}
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
              {feature.description}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Indicadores com barra de progresso */}
        <div className="flex items-center gap-2">
          {FEATURES.map((f, i) => (
            <button
              key={f.id}
              onClick={() => {
                setActive(i);
                setProgress(0);
              }}
              className="relative h-1 rounded-full overflow-hidden transition-all duration-300 focus-visible:outline-none"
              style={{
                width: active === i ? 40 : 20,
                background: 'rgba(255,255,255,0.18)',
              }}
            >
              {active === i && (
                <motion.div
                  className="absolute inset-y-0 left-0 rounded-full"
                  style={{
                    background: '#E85D04',
                    width: `${progress}%`,
                  }}
                />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
