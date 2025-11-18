'use client';;
import * as React from 'react';
import { motion, AnimatePresence } from 'motion/react';

import { useIsInView } from '@/hooks/use-is-in-view';
import { getStrictContext } from '@/lib/get-strict-context';

const [RotatingTextProvider, useRotatingText] =
  getStrictContext('RotatingTextContext');

function RotatingTextContainer({
  ref,
  text,
  y = -50,
  duration = 2000,
  delay = 0,
  style,
  inView = false,
  inViewMargin = '0px',
  inViewOnce = true,
  ...props
}) {
  const [index, setIndex] = React.useState(0);

  const { ref: localRef, isInView } = useIsInView(ref, {
    inView,
    inViewOnce,
    inViewMargin,
  });

  React.useEffect(() => {
    if (!Array.isArray(text)) return;
    if (inView && !isInView) return;

    let intervalId;

    const timeoutId = setTimeout(() => {
      setIndex((prev) => (prev + 1) % text.length);
      intervalId = setInterval(() => setIndex((prev) => (prev + 1) % text.length), duration);
    }, delay);

    return () => {
      clearTimeout(timeoutId);
      if (intervalId) clearInterval(intervalId);
    };
  }, [text, duration, delay, inView, isInView]);

  const currentText = Array.isArray(text) ? text[index] : text;

  return (
    <RotatingTextProvider value={{ currentText, y, isInView }}>
      <div
        ref={localRef}
        style={{
          overflow: 'hidden',
          paddingBlock: '0.25rem',
          whiteSpace: 'nowrap',
          ...style,
        }}
        {...props} />
    </RotatingTextProvider>
  );
}

function RotatingText({
  transition = { duration: 0.3, ease: 'easeOut' },
  ...props
}) {
  const { currentText, y, isInView } = useRotatingText();

  return (
    <AnimatePresence mode="wait">
      {isInView && (
        <motion.div
          key={currentText}
          transition={transition}
          className={"text-blue-600"}
          initial={{ opacity: 0, y: -y }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y }}
          {...props}>
          {currentText}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export { RotatingTextContainer, RotatingText, useRotatingText };
