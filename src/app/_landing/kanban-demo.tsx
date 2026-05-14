'use client';

import { motion } from 'motion/react';
import {
  FileText,
  Building2,
  CheckCircle2,
  Clock,
  Zap,
  Bot,
} from 'lucide-react';

interface KanbanCard {
  title: string;
  tag: string;
  tagColor: string;
  icon: typeof FileText;
  priority: string;
  hasAutomation?: boolean;
}

interface KanbanColumn {
  title: string;
  color: string;
  cards: KanbanCard[];
}

const columns: KanbanColumn[] = [
  {
    title: 'Documentação',
    color: 'bg-blue-500',
    cards: [
      {
        title: 'Contrato Social - Tech Solutions',
        tag: 'Contrato',
        tagColor:
          'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400',
        icon: FileText,
        priority: 'Alta',
      },
      {
        title: 'CNPJ - Studio Design',
        tag: 'CNPJ',
        tagColor:
          'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400',
        icon: FileText,
        priority: 'Média',
      },
    ],
  },
  {
    title: 'Prefeitura',
    color: 'bg-amber-500',
    cards: [
      {
        title: 'Viabilidade - Café Central',
        tag: 'Viabilidade',
        tagColor:
          'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400',
        icon: Building2,
        priority: 'Alta',
        hasAutomation: true,
      },
    ],
  },
  {
    title: 'Aguardando',
    color: 'bg-orange-500',
    cards: [
      {
        title: 'Alvará - Pet Shop Amigo',
        tag: 'Alvará',
        tagColor:
          'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400',
        icon: Clock,
        priority: 'Média',
        hasAutomation: true,
      },
    ],
  },
  {
    title: 'Concluído',
    color: 'bg-green-500',
    cards: [
      {
        title: 'IE - Consultoria Apex',
        tag: 'Inscrição',
        tagColor:
          'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400',
        icon: CheckCircle2,
        priority: 'Baixa',
      },
    ],
  },
];

export function KanbanDemo() {
  return (
    <div className="p-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-400" />
          <div className="w-3 h-3 rounded-full bg-yellow-400" />
          <div className="w-3 h-3 rounded-full bg-green-400" />
          <span className="ml-3 text-xs font-medium text-muted-foreground">
            Abertura de Empresas — Joinville/SC
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium flex items-center gap-1">
            <Zap className="w-3 h-3" />3 automações ativas
          </span>
        </div>
      </div>

      {/* Kanban columns */}
      <div className="grid grid-cols-4 gap-2.5">
        {columns.map((col, colIdx) => (
          <div key={col.title} className="space-y-2">
            {/* Column header */}
            <div className="flex items-center gap-1.5 px-1">
              <div className={`w-2 h-2 rounded-full ${col.color}`} />
              <span className="text-[11px] font-semibold text-foreground truncate">
                {col.title}
              </span>
              <span className="text-[10px] text-muted-foreground ml-auto">
                {col.cards.length}
              </span>
            </div>

            {/* Cards */}
            <div className="space-y-1.5">
              {col.cards.map((card, cardIdx) => (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.8 + colIdx * 0.15 + cardIdx * 0.1,
                    duration: 0.4,
                  }}
                  className="bg-background border border-border rounded-lg p-2.5 hover:border-primary/30 transition-colors cursor-default group"
                >
                  <div className="space-y-1.5">
                    <span
                      className={`inline-block text-[9px] font-semibold px-1.5 py-0.5 rounded ${card.tagColor}`}
                    >
                      {card.tag}
                    </span>
                    <p className="text-[10px] font-medium text-foreground leading-snug">
                      {card.title}
                    </p>
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-[9px] ${
                          card.priority === 'Alta'
                            ? 'text-red-500'
                            : card.priority === 'Média'
                              ? 'text-amber-500'
                              : 'text-green-500'
                        }`}
                      >
                        ● {card.priority}
                      </span>
                      {card.hasAutomation && (
                        <span className="flex items-center gap-0.5 text-[9px] text-primary font-medium">
                          <Bot className="w-3 h-3" />
                          Auto
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom status bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="mt-4 pt-3 border-t border-border flex items-center justify-between text-[10px] text-muted-foreground"
      >
        <div className="flex items-center gap-1.5">
          <Bot className="w-3.5 h-3.5 text-primary" />
          <span>
            <strong className="text-primary">Automação:</strong> Alvará do Pet
            Shop Amigo atualizado automaticamente
          </span>
        </div>
        <span className="text-[9px]">há 2 min</span>
      </motion.div>
    </div>
  );
}
