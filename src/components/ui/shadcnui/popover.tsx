'use client';

import * as React from 'react';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import { motion } from 'framer-motion';

import { cn } from '@flowtec/lib/utils';

function Popover({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Root>) {
  return <PopoverPrimitive.Root data-slot="popover" {...props} />;
}

function PopoverTrigger({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Trigger>) {
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />;
}

function PopoverContent({
  className,
  align = 'center',
  sideOffset = 4,
  children,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Content>) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        data-slot="popover-content"
        align={align}
        sideOffset={sideOffset}
        asChild
        {...props}
      >
        <motion.div
          initial={{
            opacity: 0,
            scale: 0.9,
            y: -8,
          }}
          animate={{
            opacity: 1,
            scale: 1,
            y: 0,
          }}
          exit={{
            opacity: 0,
            scale: 0.95,
            y: -4,
          }}
          transition={{
            type: 'spring',
            damping: 25,
            stiffness: 400,
            duration: 0.2,
          }}
          className={cn(
            'bg-popover text-popover-foreground z-50 w-72 origin-[var(--radix-popover-content-transform-origin)] rounded-md border p-4 shadow-md outline-hidden',
            className,
          )}
        >
          {children}
        </motion.div>
      </PopoverPrimitive.Content>
    </PopoverPrimitive.Portal>
  );
}

function PopoverAnchor({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Anchor>) {
  return <PopoverPrimitive.Anchor data-slot="popover-anchor" {...props} />;
}

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor };
