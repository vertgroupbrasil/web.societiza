import React from 'react';
import { AbsoluteFill, Sequence } from 'remotion';
import {
  IntroScene,
  LoginScene,
  DashboardScene,
  KanbanScene,
  CardDetailScene,
  FormScene,
  OutroScene,
} from './scenes';

export const PromoVideo: React.FC = () => {
  // Duração de cada cena (em frames, 60fps)
  const INTRO_DURATION = 180; // 3 segundos
  const LOGIN_DURATION = 300; // 5 segundos
  const DASHBOARD_DURATION = 240; // 4 segundos
  const KANBAN_DURATION = 360; // 6 segundos - tempo para ver o kanban bem
  const CARD_DETAIL_DURATION = 360; // 6 segundos - tempo para ver tarefas
  const FORM_DURATION = 420; // 7 segundos - tempo para preencher form
  const OUTRO_DURATION = 240; // 4 segundos

  return (
    <AbsoluteFill style={{ background: 'hsl(var(--background))' }}>
      {/* Introdução - Logo e slogan */}
      <Sequence durationInFrames={INTRO_DURATION}>
        <IntroScene />
      </Sequence>

      {/* Login - Tela de autenticação */}
      <Sequence from={INTRO_DURATION} durationInFrames={LOGIN_DURATION}>
        <LoginScene />
      </Sequence>

      {/* Dashboard - Visão geral dos módulos */}
      <Sequence
        from={INTRO_DURATION + LOGIN_DURATION}
        durationInFrames={DASHBOARD_DURATION}
      >
        <DashboardScene />
      </Sequence>

      {/* Kanban Board - Gestão visual de processos */}
      <Sequence
        from={INTRO_DURATION + LOGIN_DURATION + DASHBOARD_DURATION}
        durationInFrames={KANBAN_DURATION}
      >
        <KanbanScene />
      </Sequence>

      {/* Detalhes do Card - Drawer com tarefas e progresso */}
      <Sequence
        from={
          INTRO_DURATION +
          LOGIN_DURATION +
          DASHBOARD_DURATION +
          KANBAN_DURATION
        }
        durationInFrames={CARD_DETAIL_DURATION}
      >
        <CardDetailScene />
      </Sequence>

      {/* Formulário - Criação de novo processo */}
      <Sequence
        from={
          INTRO_DURATION +
          LOGIN_DURATION +
          DASHBOARD_DURATION +
          KANBAN_DURATION +
          CARD_DETAIL_DURATION
        }
        durationInFrames={FORM_DURATION}
      >
        <FormScene />
      </Sequence>

      {/* Encerramento - Features e CTA */}
      <Sequence
        from={
          INTRO_DURATION +
          LOGIN_DURATION +
          DASHBOARD_DURATION +
          KANBAN_DURATION +
          CARD_DETAIL_DURATION +
          FORM_DURATION
        }
        durationInFrames={OUTRO_DURATION}
      >
        <OutroScene />
      </Sequence>
    </AbsoluteFill>
  );
};