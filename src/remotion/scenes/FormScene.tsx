import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

export const FormScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = spring({
    frame,
    fps,
    config: { damping: 100 },
  });

  // Step indicators animation
  const step1Active = frame >= 0;
  const step2Active = frame >= 120;
  const step3Active = frame >= 240;

  const fieldAppear = (index: number) =>
    spring({
      frame: frame - 20 - index * 10,
      fps,
      config: { damping: 100 },
    });

  const fields = [
    {
      label: 'Nome da Empresa *',
      value: 'Tech Solutions Desenvolvimento de Software Ltda',
      icon: '🏢',
    },
    {
      label: 'Contabilidade Responsável *',
      value: 'LUZ CONTADORES S/S',
      icon: '📋',
    },
    {
      label: 'Etapa Inicial *',
      value: 'Proposta/Formulário',
      icon: '📍',
    },
  ];

  const typing = (fieldIndex: number) => {
    const startFrame = 50 + fieldIndex * 30;
    const endFrame = startFrame + 40;
    return interpolate(frame, [startFrame, endFrame], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
  };

  const submitButton = spring({
    frame: frame - 160,
    fps,
    config: { damping: 100, stiffness: 300 },
  });

  return (
    <AbsoluteFill
      style={{
        background: 'hsl(var(--background))',
        padding: 50,
        fontFamily: 'system-ui, -apple-system, sans-serif',
        opacity: fadeIn,
      }}
    >
      <div
        style={{
          maxWidth: 900,
          margin: '0 auto',
          width: '100%',
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <div
            style={{
              fontSize: 40,
              fontWeight: 600,
              color: 'hsl(var(--foreground))',
              marginBottom: 10,
            }}
          >
            Novo Processo
          </div>
          <div
            style={{
              fontSize: 18,
              color: 'hsl(var(--muted-foreground))',
            }}
          >
            Preencha as informações do processo corporativo
          </div>
        </div>

        {/* Form Card */}
        <div
          style={{
            background: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: 16,
            padding: 50,
          }}
        >
          {/* Progress Steps */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: 50,
              position: 'relative',
            }}
          >
            {/* Progress Line */}
            <div
              style={{
                position: 'absolute',
                top: 24,
                left: 50,
                right: 50,
                height: 3,
                background: 'hsl(var(--muted))',
                zIndex: 0,
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: step3Active ? '100%' : step2Active ? '50%' : '0%',
                  background: 'hsl(var(--primary))',
                  transition: 'width 0.5s',
                }}
              />
            </div>

            {['Dados Básicos', 'Endereço', 'Documentos'].map((step, idx) => {
              const isActive =
                (idx === 0 && step1Active) ||
                (idx === 1 && step2Active) ||
                (idx === 2 && step3Active);
              const isCompleted =
                (idx === 0 && step2Active) || (idx === 1 && step3Active);

              return (
                <div
                  key={idx}
                  style={{
                    flex: 1,
                    textAlign: 'center',
                    position: 'relative',
                    zIndex: 1,
                  }}
                >
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: '50%',
                      background: isActive || isCompleted
                        ? 'hsl(var(--primary))'
                        : 'hsl(var(--muted))',
                      color: isActive || isCompleted
                        ? 'white'
                        : 'hsl(var(--muted-foreground))',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 18,
                      fontWeight: 'bold',
                      margin: '0 auto 12px',
                      transition: 'all 0.3s',
                      border: `3px solid ${
                        isActive
                          ? 'hsl(var(--primary))'
                          : isCompleted
                            ? 'transparent'
                            : 'hsl(var(--border))'
                      }`,
                    }}
                  >
                    {isCompleted ? '✓' : idx + 1}
                  </div>
                  <div
                    style={{
                      fontSize: 14,
                      color: isActive
                        ? 'hsl(var(--primary))'
                        : 'hsl(var(--muted-foreground))',
                      fontWeight: isActive ? 600 : 400,
                    }}
                  >
                    {step}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Tipo de Processo Tabs */}
          <div
            style={{
              marginBottom: 30,
              opacity: interpolate(frame, [10, 30], [0, 1], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              }),
            }}
          >
            <div
              style={{
                fontSize: 14,
                fontWeight: 500,
                color: 'hsl(var(--foreground))',
                marginBottom: 12,
              }}
            >
              Tipo de Processo *
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 8,
                background: 'hsl(var(--muted))',
                padding: 6,
                borderRadius: 10,
              }}
            >
              {[
                'Abertura de empresa',
                'Alteração com regin',
                'Alteração sem regin',
              ].map((tipo, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '10px 16px',
                    borderRadius: 6,
                    background:
                      idx === 0 ? 'hsl(var(--background))' : 'transparent',
                    color:
                      idx === 0
                        ? 'hsl(var(--foreground))'
                        : 'hsl(var(--muted-foreground))',
                    fontSize: 13,
                    fontWeight: idx === 0 ? 600 : 400,
                    textAlign: 'center',
                    border:
                      idx === 0 ? '1px solid hsl(var(--border))' : 'none',
                  }}
                >
                  {tipo}
                </div>
              ))}
            </div>
          </div>

          {/* Form Fields */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {fields.map((field, index) => {
              const appear = fieldAppear(index);
              const typingProgress = typing(index);
              const chars = Math.floor(typingProgress * field.value.length);

              return (
                <div
                  key={index}
                  style={{
                    opacity: appear,
                    transform: `translateY(${interpolate(appear, [0, 1], [20, 0])}px)`,
                  }}
                >
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 500,
                      color: 'hsl(var(--foreground))',
                      marginBottom: 8,
                    }}
                  >
                    {field.label}
                  </div>
                  <div
                    style={{
                      background: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: 8,
                      padding: '12px 16px',
                      fontSize: 15,
                      minHeight: 48,
                      display: 'flex',
                      alignItems: 'center',
                      fontFamily: 'monospace',
                      color: 'hsl(var(--foreground))',
                    }}
                  >
                    <span
                      style={{
                        marginRight: 8,
                        fontSize: 18,
                      }}
                    >
                      {field.icon}
                    </span>
                    {field.value.substring(0, chars)}
                    {chars > 0 && chars < field.value.length && (
                      <span style={{ marginLeft: 2 }}>|</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Submit Button */}
          {submitButton > 0 && (
            <div
              style={{
                marginTop: 40,
                opacity: submitButton,
                transform: `scale(${interpolate(submitButton, [0, 1], [0.95, 1])})`,
              }}
            >
              <div
                style={{
                  background: 'hsl(var(--primary))',
                  color: 'hsl(var(--primary-foreground))',
                  padding: '14px 24px',
                  borderRadius: 8,
                  fontSize: 16,
                  fontWeight: 600,
                  textAlign: 'center',
                }}
              >
                Criar processo
              </div>
            </div>
          )}
        </div>
      </div>
    </AbsoluteFill>
  );
};
