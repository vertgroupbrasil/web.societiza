'use client';

import { motion } from 'motion/react';
import {
  FileText,
  Building2,
  Kanban,
  Bot,
  ClipboardCheck,
  MapPin,
  LayoutTemplate,
  Shield,
} from 'lucide-react';

const icons = [
  { icon: FileText, x: '-8%', y: '15%', delay: 0, size: 18, rotate: -12 },
  { icon: Building2, x: '102%', y: '20%', delay: 0.3, size: 20, rotate: 8 },
  { icon: Kanban, x: '-6%', y: '55%', delay: 0.6, size: 16, rotate: 15 },
  { icon: Bot, x: '104%', y: '60%', delay: 0.2, size: 22, rotate: -6 },
  { icon: ClipboardCheck, x: '-4%', y: '85%', delay: 0.5, size: 14, rotate: -20 },
  { icon: MapPin, x: '102%', y: '85%', delay: 0.4, size: 16, rotate: 10 },
  { icon: LayoutTemplate, x: '10%', y: '-5%', delay: 0.1, size: 16, rotate: 5 },
  { icon: Shield, x: '88%', y: '-5%', delay: 0.7, size: 18, rotate: -8 },
];

export function FloatingIcons() {
  return (
    <div className="absolute inset-0 pointer-events-none z-10 hidden lg:block">
      {icons.map((item, idx) => (
        <motion.div
          key={idx}
          className="absolute"
          style={{ left: item.x, top: item.y }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            delay: 1.0 + item.delay,
            duration: 0.4,
            type: 'spring',
            stiffness: 200,
          }}
        >
          <motion.div
            animate={{
              y: [0, -8, 0],
              rotate: [item.rotate, item.rotate + 3, item.rotate],
            }}
            transition={{
              duration: 3 + idx * 0.4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-card border border-border text-muted-foreground shadow-sm"
          >
            <item.icon style={{ width: item.size, height: item.size }} />
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
}
