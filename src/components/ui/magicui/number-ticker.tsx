'use client';

import { cn } from '@societiza/lib/utils';
import { useEffect, useRef, type ComponentPropsWithoutRef } from 'react';

type NumberTickerProps = ComponentPropsWithoutRef<'span'> & {
  value: number;
  startValue?: number;
  decimalPlaces?: number;
  delay?: number;
};

export function NumberTicker({
  value,
  startValue = 0,
  decimalPlaces = 0,
  delay = 0,
  className,
  ...props
}: NumberTickerProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const start = window.setTimeout(() => {
      const duration = 1200;
      const begin = performance.now();

      const tick = (now: number) => {
        const progress = Math.min((now - begin) / duration, 1);
        const current = startValue + (value - startValue) * progress;
        node.textContent = current.toFixed(decimalPlaces);
        if (progress < 1) {
          window.requestAnimationFrame(tick);
        }
      };

      window.requestAnimationFrame(tick);
    }, delay * 1000);

    return () => window.clearTimeout(start);
  }, [decimalPlaces, delay, startValue, value]);

  return (
    <span
      ref={ref}
      className={cn('inline-block tabular-nums', className)}
      {...props}
    >
      {startValue.toFixed(decimalPlaces)}
    </span>
  );
}
