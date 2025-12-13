import { motion } from 'framer-motion';

interface InterestTagProps {
  interest: string;
}

export const InterestTag = ({ interest }: InterestTagProps) => {
  return (
    <motion.span
      className="px-6 py-3 glass-hover rounded-full text-primary font-medium cursor-hover"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {interest}
    </motion.span>
  );
};
