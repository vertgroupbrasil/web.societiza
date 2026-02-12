'use client';

import { useEffect, useState } from 'react';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';

interface Props {
  processoId: string; // ✅ string normal
}

export const FinishedForm = ({ processoId }: Props) => {
  const { width, height } = useWindowSize();
  const [showConfetti, setShowConfetti] = useState(true);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (hasMounted) {
      const t = setTimeout(() => setShowConfetti(false), 5000);
      return () => clearTimeout(t);
    }
  }, [hasMounted]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      {hasMounted && showConfetti && (
        <Confetti
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={300}
          gravity={0.3}
        />
      )}

      <div className="text-center space-y-8">
        <h1 className="text-6xl font-bold">Obrigado! 🎉</h1>
        <p className="text-xl text-gray-700 max-w-md mx-auto">
          Seu formulário (ID: {processoId}) foi enviado com sucesso. Em breve
          entraremos em contato!
        </p>
      </div>
    </div>
  );
};