import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { pageVariants } from '../../lib/utils/animations';

interface PageTransitionProps {
  children: ReactNode;
}

export const PageTransition = ({ children }: PageTransitionProps) => {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
    >
      {children}
    </motion.div>
  );
};
