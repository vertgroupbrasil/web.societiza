import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

export const CardDetailScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const drawerSlide = spring({
    frame: frame - 10,
    fps,
    config: { damping: 100 },
  });

  const tasksAppear = (index: number) =>
    spring({
      frame: frame - 40 - index * 8,
      fps,
      config: { damping: 100 },
    });

  const progressAnim = interpolate(frame, [70, 110], [45, 65], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const tasks = [
    { id: 1, name: 'Análise de documentos', done: true },
    { id: 2, name: 'Consulta de viabilidade', done: true },
    { id: 3, name: 'Registro na Junta Comercial', done: true },
    { id: 4, name: 'Preenchimento de formulários', done: false },
    { id: 5, name: 'Pagamento de taxas', done: false },
    { id: 6, name: 'Obtenção de CNPJ', done: false },
  ];

  const checkTask = spring({
    frame: frame - 120,
    fps,
    config: { damping: 150, stiffness: 300 },
  });

  return (
    <AbsoluteFill
      style={{
        background: 'hsl(var(--background))',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      {/* Blurred Background (Kanban board behind) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'hsl(var(--muted) / 0.5)',
          backdropFilter: 'blur(8px)',
          opacity: interpolate(drawerSlide, [0, 1], [0, 1]),
        }}
      />

      {/* Drawer Panel */}
      <div
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          bottom: 0,
          width: 750,
          background: 'hsl(var(--background))',
          borderLeft: '1px solid hsl(var(--border))',
          boxShadow: '-10px 0 50px rgba(0,0,0,0.1)',
          transform: `translateX(${interpolate(drawerSlide, [0, 1], [750, 0])}px)`,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: 40,
            borderBottom: '1px solid hsl(var(--border))',
          }}
        >
          <div
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: 'hsl(var(--muted-foreground))',
              marginBottom: 12,
              textTransform: 'uppercase',
              letterSpacing: 1,
            }}
          >
            Editar Processo
          </div>
          <div
            style={{
              fontSize: 32,
              fontWeight: 600,
              color: 'hsl(var(--foreground))',
              marginBottom: 8,
            }}
          >
            Tech Solutions Ltda
          </div>
          <div
            style={{
              display: 'inline-block',
              fontSize: 13,
              color: 'hsl(var(--muted-foreground))',
              background: 'hsl(var(--muted))',
              padding: '6px 12px',
              borderRadius: 6,
            }}
          >
            Abertura de empresa
          </div>
        </div>

        {/* Content */}
        <div
          style={{
            flex: 1,
            padding: 40,
            overflowY: 'auto',
          }}
        >
          {/* Progress Section */}
          <div style={{ marginBottom: 40 }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 12,
              }}
            >
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                  color: 'hsl(var(--foreground))',
                }}
              >
                Progresso
              </div>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: 'hsl(var(--primary))',
                }}
              >
                {Math.round(progressAnim)}%
              </div>
            </div>
            <div
              style={{
                height: 12,
                background: 'hsl(var(--muted))',
                borderRadius: 8,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${progressAnim}%`,
                  background:
                    'linear-gradient(90deg, hsl(var(--primary)), hsl(var(--primary)) 80%)',
                  borderRadius: 8,
                }}
              />
            </div>
          </div>

          {/* Tasks Checklist */}
          <div>
            <div
              style={{
                fontSize: 20,
                fontWeight: 600,
                color: 'hsl(var(--foreground))',
                marginBottom: 20,
              }}
            >
              Tarefas do Processo
            </div>
            {tasks.map((task, index) => {
              const appear = tasksAppear(index);
              const isBeingChecked = index === 3 && checkTask > 0;

              return (
                <div
                  key={task.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    padding: '16px 0',
                    borderBottom:
                      index < tasks.length - 1
                        ? '1px solid hsl(var(--border))'
                        : 'none',
                    opacity: appear,
                    transform: `translateX(${interpolate(appear, [0, 1], [-20, 0])}px)`,
                  }}
                >
                  {/* Checkbox */}
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 6,
                      border: `2px solid ${
                        task.done || isBeingChecked
                          ? 'hsl(var(--primary))'
                          : 'hsl(var(--border))'
                      }`,
                      background:
                        task.done || isBeingChecked
                          ? 'hsl(var(--primary))'
                          : 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: 16,
                      fontWeight: 'bold',
                      transform: isBeingChecked
                        ? `scale(${interpolate(checkTask, [0, 1], [1, 1.2])})`
                        : 'scale(1)',
                    }}
                  >
                    {(task.done || isBeingChecked) && '✓'}
                  </div>

                  {/* Task Text */}
                  <span
                    style={{
                      fontSize: 16,
                      color:
                        task.done || isBeingChecked
                          ? 'hsl(var(--muted-foreground))'
                          : 'hsl(var(--foreground))',
                      textDecoration:
                        task.done || isBeingChecked
                          ? 'line-through'
                          : 'none',
                    }}
                  >
                    {task.name}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Info Cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 16,
              marginTop: 32,
              opacity: interpolate(frame, [60, 80], [0, 1], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              }),
            }}
          >
            <div
              style={{
                background: 'hsl(var(--muted))',
                padding: 20,
                borderRadius: 10,
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  color: 'hsl(var(--muted-foreground))',
                  marginBottom: 6,
                }}
              >
                Data de Criação
              </div>
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                  color: 'hsl(var(--foreground))',
                }}
              >
                10/02/2026
              </div>
            </div>
            <div
              style={{
                background: 'hsl(var(--muted))',
                padding: 20,
                borderRadius: 10,
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  color: 'hsl(var(--muted-foreground))',
                  marginBottom: 6,
                }}
              >
                Prazo Final
              </div>
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                  color: 'hsl(var(--foreground))',
                }}
              >
                10/05/2026
              </div>
            </div>
          </div>
        </div>

        {/* Footer with Actions */}
        <div
          style={{
            padding: 30,
            borderTop: '1px solid hsl(var(--border))',
            background: 'hsl(var(--background))',
            opacity: interpolate(frame, [100, 120], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            }),
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
            Salvar alterações
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
