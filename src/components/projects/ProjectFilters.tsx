import { motion } from 'framer-motion';
import type { ProjectFilterCategory } from '../../types';

interface ProjectFiltersProps {
  activeFilter: ProjectFilterCategory;
  onFilterChange: (filter: ProjectFilterCategory) => void;
}

const filters: { label: string; value: ProjectFilterCategory }[] = [
  { label: 'Todos', value: 'all' },
  { label: 'Frontend', value: 'frontend' },
  { label: 'Backend', value: 'backend' },
  { label: 'Full Stack', value: 'fullstack' },
  { label: 'Mobile', value: 'mobile' },
];

export const ProjectFilters = ({ activeFilter, onFilterChange }: ProjectFiltersProps) => {
  return (
    <div className="flex flex-wrap justify-center gap-3 mb-12">
      {filters.map((filter) => (
        <motion.button
          key={filter.value}
          onClick={() => onFilterChange(filter.value)}
          className={`px-6 py-2 rounded-full cursor-hover transition-all relative ${
            activeFilter === filter.value
              ? 'text-white'
              : 'text-slate-600 dark:text-light/60 hover:text-primary'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {activeFilter === filter.value && (
            <motion.div
              layoutId="activeFilter"
              className="absolute inset-0 gradient-primary rounded-full"
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          )}
          <span className="relative z-10">{filter.label}</span>
        </motion.button>
      ))}
    </div>
  );
};
