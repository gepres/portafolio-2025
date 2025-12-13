import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export const ScrollIndicator = () => {
  return (
    <motion.div
      className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer"
      animate={{
        y: [0, 10, 0],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      onClick={() => {
        window.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
      }}
    >
      <div className="flex flex-col items-center space-y-2">
        <span className="text-sm text-light/60">Scroll</span>
        <div className="w-6 h-10 border-2 border-primary/50 rounded-full flex items-start justify-center p-2">
          <motion.div
            className="w-1 h-2 bg-primary rounded-full"
            animate={{
              y: [0, 12, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </div>
        <ChevronDown className="w-4 h-4 text-primary/50" />
      </div>
    </motion.div>
  );
};
