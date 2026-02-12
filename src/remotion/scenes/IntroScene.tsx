import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Img,
} from 'remotion';

export const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoScale = spring({
    frame,
    fps,
    config: {
      damping: 100,
      stiffness: 200,
      mass: 0.5,
    },
  });

  const textOpacity = interpolate(frame, [30, 50], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const subtitleOpacity = interpolate(frame, [50, 70], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        background: 'hsl(var(--background))',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      <div
        style={{
          transform: `scale(${logoScale})`,
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontSize: 80,
            fontWeight: 'bold',
            color: 'hsl(var(--foreground))',
            marginBottom: 30,
          }}
        >
          Meu Societário
        </div>
        <div
          style={{
            fontSize: 32,
            color: 'hsl(var(--muted-foreground))',
            opacity: textOpacity,
            fontWeight: 400,
          }}
        >
          Gestão de processos corporativos
        </div>
        <div
          style={{
            fontSize: 24,
            color: 'hsl(var(--muted-foreground))',
            opacity: subtitleOpacity,
            marginTop: 20,
            fontWeight: 300,
          }}
        >
          Kanban · Formulários · Acompanhamento
        </div>
      </div>
    </AbsoluteFill>
  );
};
