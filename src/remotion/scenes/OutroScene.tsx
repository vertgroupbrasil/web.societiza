import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

export const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({
    frame,
    fps,
    config: {
      damping: 100,
      stiffness: 200,
    },
  });

  const textOpacity = interpolate(frame, [20, 40], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const featuresOpacity = interpolate(frame, [40, 60], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const features = [
    { icon: '📊', text: 'Kanban inteligente' },
    { icon: '⚡', text: 'Automatização de fluxos' },
    { icon: '📝', text: 'Formulários dinâmicos' },
    { icon: '🔔', text: 'Notificações em tempo real' },
    { icon: '📈', text: 'Relatórios detalhados' },
    { icon: '🔐', text: 'Segurança e conformidade' },
  ];

  return (
    <AbsoluteFill
      style={{
        background:
          'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--primary)) 100%)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 60,
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      <div
        style={{
          textAlign: 'center',
          transform: `scale(${scale})`,
          maxWidth: 1100,
        }}
      >
        <div
          style={{
            fontSize: 90,
            fontWeight: 'bold',
            color: 'white',
            marginBottom: 30,
            textShadow: '0 4px 30px rgba(0,0,0,0.2)',
          }}
        >
          Meu Societário
        </div>

        <div
          style={{
            fontSize: 32,
            color: 'rgba(255,255,255,0.95)',
            marginBottom: 60,
            opacity: textOpacity,
            fontWeight: 400,
          }}
        >
          A plataforma completa para gestão de processos corporativos
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 20,
            opacity: featuresOpacity,
          }}
        >
          {features.map((feature, index) => (
            <div
              key={index}
              style={{
                background: 'rgba(255,255,255,0.15)',
                backdropFilter: 'blur(10px)',
                padding: '20px',
                borderRadius: 12,
                fontSize: 16,
                color: 'white',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                border: '1px solid rgba(255,255,255,0.2)',
              }}
            >
              <span style={{ fontSize: 28 }}>{feature.icon}</span>
              <span>{feature.text}</span>
            </div>
          ))}
        </div>

        <div
          style={{
            marginTop: 60,
            fontSize: 24,
            color: 'rgba(255,255,255,0.9)',
            opacity: interpolate(frame, [70, 90], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            }),
            fontWeight: 500,
          }}
        >
          Simplifique sua gestão. Escale seu negócio.
        </div>
      </div>
    </AbsoluteFill>
  );
};
