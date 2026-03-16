"use client";

import { Button } from "@societiza/components/ui/button";
import { ArrowRight, FileSpreadsheet, StickyNote, Mail, MessageCircle, FileText, Table } from "lucide-react";
import { motion } from "motion/react";

const floatingItems = [
  { name: "Google Sheets", icon: FileSpreadsheet, position: { top: "15%", left: "8%" } },
  { name: "Notion", icon: StickyNote, position: { top: "20%", right: "10%" } },
  { name: "Excel", icon: Table, position: { top: "45%", left: "3%" } },
  { name: "WhatsApp", icon: MessageCircle, position: { bottom: "30%", right: "5%" } },
  { name: "E-mails", icon: Mail, position: { bottom: "20%", left: "10%" } },
  { name: "Papelada", icon: FileText, position: { top: "50%", right: "8%" } },
];

export function AbandonMessSection() {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Subtle grid background */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}
      />
      
      {/* Floating badges */}
      {floatingItems.map((item, index) => (
        <motion.div
          key={item.name}
          className="absolute hidden md:flex items-center gap-2 px-4 py-2 bg-background border border-border rounded-full shadow-sm text-sm text-muted-foreground"
          style={item.position}
          animate={{ y: [0, -10, 0] }}
          transition={{
            duration: 3 + index * 0.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: index * 0.3,
          }}
        >
          <item.icon className="w-4 h-4" />
          <span>{item.name}</span>
        </motion.div>
      ))}

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        {/* Badge */}
        <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-border bg-background text-sm font-medium mb-8">
          Simplifique
        </div>

        {/* Headline */}
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 text-balance max-w-4xl mx-auto leading-tight">
          Esqueça a bagunça.
          <br />
          <span className="text-primary">Abrace a organização.</span>
        </h2>

        {/* Subtitle */}
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
          Chega de planilhas perdidas, anotações espalhadas e processos manuais. 
          Centralize tudo em um só lugar e tenha controle total do seu escritório.
        </p>

        {/* CTA Button */}
        <Button size="lg" className="rounded-full px-8 gap-2">
          Comece agora
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Bottom border decoration */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[200px] h-px bg-border" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-3 border border-border rounded-full bg-background -mb-1.5" />
    </section>
  );
}
