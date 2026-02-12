import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

// Mock do ProcessCard baseado no componente real
const ProcessCardMock: React.FC<{
  process: any;
  delay: number;
}> = ({ process, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const appear = spring({
    frame: frame - delay,
    fps,
    config: { damping: 100 },
  });

  return (
    <div
      style={{
        background: 'hsl(var(--card))',
        border: '3px dashed hsl(var(--foreground) / 0.1)',
        borderRadius: 12,
        padding: 20,
        marginBottom: 12,
        opacity: appear,
        transform: `scale(${interpolate(appear, [0, 1], [0.9, 1])})`,
        cursor: 'pointer',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: 12,
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: 16,
              fontWeight: 600,
              color: 'hsl(var(--foreground))',
              marginBottom: 8,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {process.nome}
          </div>
          <div
            style={{
              fontSize: 12,
              color: 'hsl(var(--muted-foreground))',
              background: 'hsl(var(--muted))',
              padding: '4px 10px',
              borderRadius: 6,
              display: 'inline-block',
            }}
          >
            {process.tipo}
          </div>
        </div>
        <div
          style={{
            fontSize: 11,
            fontWeight: 600,
            padding: '4px 8px',
            borderRadius: 6,
            background: process.urgent ? '#fef2f2' : '#f0fdf4',
            color: process.urgent ? '#dc2626' : '#16a34a',
            border: `1px solid ${process.urgent ? '#fca5a5' : '#86efac'}`,
          }}
        >
          {process.urgent ? '🔴' : '🟢'}
        </div>
      </div>

      {/* Company */}
      <div
        style={{
          fontSize: 13,
          color: 'hsl(var(--muted-foreground))',
          marginBottom: 12,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
        }}
      >
        <span>🏢</span>
        <span
          style={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {process.contabilidade}
        </span>
      </div>

      {/* Progress Bar */}
      <div
        style={{
          height: 8,
          background: 'hsl(var(--muted))',
          borderRadius: 4,
          overflow: 'hidden',
          marginBottom: 8,
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${process.progress}%`,
            background: `linear-gradient(90deg, ${process.urgent ? '#dc2626' : '#16a34a'}, ${process.urgent ? '#f87171' : '#4ade80'})`,
            borderRadius: 4,
          }}
        />
      </div>

      {/* Date */}
      <div
        style={{
          fontSize: 12,
          color: 'hsl(var(--muted-foreground))',
          display: 'flex',
          alignItems: 'center',
          gap: 4,
        }}
      >
        <span>📅</span>
        <span>
          {process.urgent ? 'Expirado há' : 'Expira em'} {process.days} dia
          {process.days !== 1 ? 's' : ''}
        </span>
      </div>
    </div>
  );
};

export const KanbanScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = spring({
    frame,
    fps,
    config: { damping: 100 },
  });

  const searchFocus = interpolate(frame, [80, 100], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const columns = [
    {
      id: 1,
      name: 'Proposta/Formulário',
      color: '#3b82f6',
      cards: [
        {
          nome: 'Tech Solutions Ltda',
          tipo: 'Abertura de empresa',
          contabilidade: 'LUZ CONTADORES S/S',
          progress: 25,
          days: 45,
          urgent: false,
        },
        {
          nome: 'Padaria Pão Quente ME',
          tipo: 'Abertura de empresa',
          contabilidade: 'SILVA CONTABILIDADE',
          progress: 15,
          days: 50,
          urgent: false,
        },
      ],
    },
    {
      id: 2,
      name: 'Viabilidade',
      color: '#8b5cf6',
      cards: [
        {
          nome: 'Consultoria Business Pro',
          tipo: 'Abertura de empresa',
          contabilidade: 'LUZ CONTADORES S/S',
          progress: 40,
          days: 30,
          urgent: false,
        },
        {
          nome: 'Loja Fashion Style',
          tipo: 'Alteração contratual',
          contabilidade: 'COSTA & ASSOCIADOS',
          progress: 35,
          days: 28,
          urgent: false,
        },
      ],
    },
    {
      id: 3,
      name: 'Registro',
      color: '#06b6d4',
      cards: [
        {
          nome: 'Restaurante Sabor Mineiro',
          tipo: 'Abertura de empresa',
          contabilidade: 'LUZ CONTADORES S/S',
          progress: 60,
          days: 20,
          urgent: false,
        },
      ],
    },
    {
      id: 4,
      name: 'Alvarás',
      color: '#10b981',
      cards: [
        {
          nome: 'Farmácia Saúde Total',
          tipo: 'Abertura de empresa',
          contabilidade: 'SANTOS CONTABIL',
          progress: 75,
          days: 3,
          urgent: true,
        },
      ],
    },
  ];

  return (
    <AbsoluteFill
      style={{
        background: 'hsl(var(--background))',
        padding: 30,
        fontFamily: 'system-ui, -apple-system, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        opacity: fadeIn,
      }}
    >
      {/* Header */}
      <div
        style={{
          borderBottom: '1px solid hsl(var(--border))',
          paddingBottom: 20,
          marginBottom: 20,
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: 16,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 36,
                fontWeight: 600,
                color: 'hsl(var(--foreground))',
              }}
            >
              Societário
            </div>
          </div>
          <div
            style={{
              background: 'hsl(var(--primary))',
              color: 'hsl(var(--primary-foreground))',
              padding: '10px 20px',
              borderRadius: 8,
              fontSize: 15,
              fontWeight: 600,
            }}
          >
            + Novo Processo
          </div>
        </div>

        {/* Search Bar */}
        <div
          style={{
            display: 'flex',
            gap: 12,
            alignItems: 'center',
          }}
        >
          <div
            style={{
              flex: 1,
              maxWidth: 450,
              border: `2px solid ${
                searchFocus > 0.5
                  ? 'hsl(var(--primary))'
                  : 'hsl(var(--border))'
              }`,
              borderRadius: 8,
              padding: '10px 16px',
              background: 'hsl(var(--background))',
              fontSize: 15,
              color: 'hsl(var(--muted-foreground))',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              transition: 'border-color 0.3s',
            }}
          >
            <span>🔍</span>
            <span>Buscar por nome, contabilidade...</span>
          </div>
          <div
            style={{
              padding: '10px 20px',
              borderRadius: 8,
              border: '1px solid hsl(var(--border))',
              fontSize: 15,
              fontWeight: 500,
              color: 'hsl(var(--foreground))',
              background: 'hsl(var(--background))',
            }}
          >
            🔽 Filtros
          </div>
        </div>
      </div>

      {/* Kanban Columns */}
      <div
        style={{
          display: 'flex',
          gap: 20,
          flex: 1,
          overflow: 'hidden',
          minHeight: 0,
        }}
      >
        {columns.map((column, colIndex) => {
          const columnAppear = spring({
            frame: frame - 20 - colIndex * 5,
            fps,
            config: { damping: 100 },
          });

          return (
            <div
              key={column.id}
              style={{
                flex: 1,
                minWidth: 320,
                display: 'flex',
                flexDirection: 'column',
                opacity: columnAppear,
                transform: `translateY(${interpolate(columnAppear, [0, 1], [30, 0])}px)`,
              }}
            >
              {/* Column Header */}
              <div
                style={{
                  background: column.color,
                  color: 'white',
                  padding: '14px 18px',
                  borderRadius: '12px 12px 0 0',
                  fontSize: 17,
                  fontWeight: 600,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span>{column.name}</span>
                <span
                  style={{
                    background: 'rgba(255,255,255,0.25)',
                    borderRadius: 20,
                    padding: '4px 12px',
                    fontSize: 14,
                  }}
                >
                  {column.cards.length}
                </span>
              </div>

              {/* Cards Container */}
              <div
                style={{
                  background: 'hsl(var(--muted) / 0.3)',
                  padding: 12,
                  borderRadius: '0 0 12px 12px',
                  flex: 1,
                  minHeight: 0,
                  overflow: 'hidden',
                }}
              >
                {column.cards.map((card, cardIndex) => (
                  <ProcessCardMock
                    key={cardIndex}
                    process={card}
                    delay={30 + colIndex * 5 + cardIndex * 8}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
