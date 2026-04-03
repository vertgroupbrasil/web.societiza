'use client';

import { Button } from '@societiza/components/ui/button';
import {
  ArrowRight,
  FileSpreadsheet,
  StickyNote,
  Mail,
  MessageCircle,
  FileText,
  Table,
} from 'lucide-react';
import { motion } from 'motion/react';
import { stagger, staggerChild, vp } from '../_lib/animations';

const floatingItems = [
  { name: 'Google Sheets', icon: FileSpreadsheet, x: '8%', y: '15%', delay: 0 },
  { name: 'Notion', icon: StickyNote, x: '85%', y: '18%', delay: 0.5 },
  { name: 'Excel', icon: Table, x: '3%', y: '50%', delay: 1 },
  { name: 'WhatsApp', icon: MessageCircle, x: '88%', y: '60%', delay: 1.5 },
  { name: 'E-mails', icon: Mail, x: '10%', y: '78%', delay: 2 },
  { name: 'Papelada', icon: FileText, x: '82%', y: '80%', delay: 0.8 },
];

export function TransformSection() {
  return (
    <section className="relative overflow-hidden py-28 md:py-36">
      {/* Subtle grid background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Radial gradient center glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,var(--primary)/.04,transparent)]" />

      {/* Floating tool badges */}
      {floatingItems.map((item, index) => (
        <motion.div
          key={item.name}
          className="absolute hidden md:flex items-center gap-2 px-4 py-2 bg-background/90 border border-border/60 rounded-full text-sm text-muted-foreground backdrop-blur-sm"
          style={{ left: item.x, top: item.y }}
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
          animate={{ y: [0, -12, 0] }}
        >
          <item.icon className="w-4 h-4" />
          <span>{item.name}</span>
        </motion.div>
      ))}

      {/* Content */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={vp}
        variants={stagger(0.12)}
        className="relative z-10 mx-auto max-w-3xl px-6 text-center lg:px-8"
      >
        <motion.div
          variants={staggerChild}
          className="flex justify-center mb-8"
        >
          <div className="rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
            Simplifique
          </div>
        </motion.div>

        <motion.h2
          variants={staggerChild}
          className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 text-balance leading-tight"
        >
          Esquea a baguna.
          <br />
          <span className="text-primary">Abrace a organizao.</span>
        </motion.h2>

        <motion.p
          variants={staggerChild}
          className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10"
        >
          Chega de planilhas perdidas, anotaes espalhadas e processos manuais.
          Centralize tudo em um s lugar e tenha controle total do seu escritrio.
        </motion.p>

        <motion.div variants={staggerChild}>
          <Button
            size="lg"
            className="rounded-full px-8 gap-2 shadow-lg shadow-primary/20"
          >
            Comece agora
            <ArrowRight className="w-4 h-4" />
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}
