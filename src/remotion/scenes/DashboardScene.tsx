import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

export const DashboardScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = spring({
    frame,
    fps,
    config: {
      damping: 100,
    },
  });

  const societarioHover = spring({
    frame: frame - 60,
    fps,
    config: {
      damping: 100,
    },
  });

  return (
    <AbsoluteFill
      style={{
        background: 'hsl(var(--background))',
        padding: 60,
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      {/* Header */}
      <div
        style={{
          opacity: fadeIn,
          marginBottom: 50,
        }}
      >
        <div
          style={{
            fontSize: 48,
            fontWeight: 'bold',
            color: 'hsl(var(--foreground))',
            marginBottom: 10,
          }}
        >
          Dashboard
        </div>
        <div
          style={{
            fontSize: 24,
            color: 'hsl(var(--muted-foreground))',
          }}
        >
          Escolha um módulo para começar
        </div>
      </div>

      {/* Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 40,
          maxWidth: 1200,
        }}
      >
        {/* Societário Card - Destaque */}
        {[
          {
            title: 'Societário',
            desc: 'Gestão de processos corporativos',
            icon: '🏢',
            processes: 24,
            highlight: true,
          },
          {
            title: 'Certificados',
            desc: 'Controle de certificações',
            icon: '📜',
            processes: 18,
            highlight: false,
          },
          {
            title: 'Licenças',
            desc: 'Alvarás e licenciamentos',
            icon: '✅',
            processes: 12,
            highlight: false,
          },
          {
            title: 'Gestão',
            desc: 'Configurações gerais',
            icon: '⚙️',
            processes: 8,
            highlight: false,
          },
        ].map((card, index) => {
          const progress = spring({
            frame: frame - 15 - index * 8,
            fps,
            config: {
              damping: 100,
            },
          });

          const isHighlighted = card.highlight && societarioHover > 0;

          return (
            <div
              key={index}
              style={{
                background: 'hsl(var(--card))',
                border: `2px solid ${
                  isHighlighted
                    ? 'hsl(var(--primary))'
                    : 'hsl(var(--border))'
                }`,
                borderRadius: 16,
                padding: 40,
                transform: `translateY(${interpolate(progress, [0, 1], [50, 0])}px) scale(${
                  isHighlighted ? 1.02 : 1
                })`,
                opacity: progress,
                boxShadow: isHighlighted
                  ? '0 20px 40px rgba(0,0,0,0.15)'
                  : '0 4px 12px rgba(0,0,0,0.05)',
                transition: 'all 0.3s',
              }}
            >
              <div style={{ fontSize: 72, marginBottom: 20 }}>{card.icon}</div>
              <div
                style={{
                  fontSize: 32,
                  fontWeight: 'bold',
                  color: 'hsl(var(--foreground))',
                  marginBottom: 10,
                }}
              >
                {card.title}
              </div>
              <div
                style={{
                  fontSize: 18,
                  color: 'hsl(var(--muted-foreground))',
                  marginBottom: 20,
                }}
              >
                {card.desc}
              </div>
              <div
                style={{
                  fontSize: 48,
                  fontWeight: 'bold',
                  color: 'hsl(var(--primary))',
                }}
              >
                {card.processes}
              </div>
              <div
                style={{
                  fontSize: 16,
                  color: 'hsl(var(--muted-foreground))',
                  marginTop: 8,
                }}
              >
                processos ativos
              </div>
            </div>
          );
        })}
      </div>

      {/* Arrow pointing to Societário */}
      {societarioHover > 0.5 && (
        <div
          style={{
            position: 'absolute',
            top: 360,
            left: 500,
            fontSize: 48,
            opacity: interpolate(societarioHover, [0.5, 1], [0, 1]),
          }}
        >
          ☝️
        </div>
      )}
    </AbsoluteFill>
  );
};
