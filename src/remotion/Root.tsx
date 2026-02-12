import React from 'react';
import { Composition } from 'remotion';
import { PromoVideo } from './Composition';

export const RemotionRoot: React.FC = () => {
  // Total: ~35 segundos de vídeo (2100 frames @ 60fps)
  // 3s intro + 5s login + 4s dashboard + 6s kanban + 6s detail + 7s form + 4s outro
  const TOTAL_DURATION = 2100;

  return (
    <>
      <Composition
        id="MeuSocietarioPromo"
        component={PromoVideo}
        durationInFrames={TOTAL_DURATION}
        fps={60}
        width={1920}
        height={1080}
        defaultProps={{}}
      />
    </>
  );
};