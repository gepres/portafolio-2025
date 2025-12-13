import { motion } from 'framer-motion';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { slideInLeftVariants, slideInRightVariants } from '../../lib/utils/animations';
import type { ReactNode } from 'react';

interface SlideInProps {
  children: ReactNode;
  direction?: 'left' | 'right';
  delay?: number;
  className?: string;
}

export const SlideIn = ({ children, direction = 'left', delay = 0, className = '' }: SlideInProps) => {
  const { ref, inView } = useScrollAnimation();
  const variants = direction === 'left' ? slideInLeftVariants : slideInRightVariants;

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={variants}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
