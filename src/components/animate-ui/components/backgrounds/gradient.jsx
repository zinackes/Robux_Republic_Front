'use client';;
import * as React from 'react';
import { motion } from 'motion/react';

import { cn } from '@/lib/utils';

function GradientBackground({
  className,
    children,
  transition = { duration: 15, ease: 'easeInOut', repeat: Infinity },
  ...props
}) {
  return (
    <motion.div
      data-slot="gradient-background"
      className={cn(
        ' bg-gradient-to-br px-5 py-3 rounded-xl from-blue-700 via-blue-500  to-pink-500 bg-[length:400%_400%]',
        className
      )}
      animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
      transition={transition}
      {...props}>
        {children}
    </motion.div>
  );
}

export { GradientBackground };
