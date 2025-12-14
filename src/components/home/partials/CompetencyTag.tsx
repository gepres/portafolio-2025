import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

interface CompetencyTagProps {
  competency: string;
}

export const CompetencyTag = ({ competency }: CompetencyTagProps) => {
  return (
    <motion.div
      className="flex items-center space-x-2 px-5 py-3 glass rounded-lg border border-primary/20 hover:border-primary/40 transition-all"
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
    >
      <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
      <span className="font-medium">{competency}</span>
    </motion.div>
  );
};
