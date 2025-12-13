import { motion } from 'framer-motion';
import { Card } from '../../ui/Card';
import { staggerItem } from '../../../lib/utils/animations';
import type { Skill } from '../../../types';
import { useTranslation } from 'react-i18next';

interface SkillCardProps {
  skill: Skill;
}

export const SkillCard = ({ skill }: SkillCardProps) => {
  const { t } = useTranslation();

  return (
    <motion.div
      variants={staggerItem}
      whileHover={{ scale: 1.05, rotateY: 10 }}
      style={{ transformStyle: 'preserve-3d' }}
    >
      <Card className="h-full">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold">{skill.name}</h4>
          <span className="text-3xl">
            {skill.icon?.includes('devicon-') ? (
              <i className={`${skill.icon} colored`}></i>
            ) : (
              skill.icon
            )}
          </span>
        </div>

        <div className="mb-3">
          <div className="flex justify-between text-sm text-slate-500 dark:text-light/60 mb-2">
            <span>{t('admin.skillForm.level')}</span>
            <span>{skill.level}%</span>
          </div>
          <div className="h-2 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full gradient-primary"
              initial={{ width: 0 }}
              whileInView={{ width: `${skill.level}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.2 }}
            />
          </div>
        </div>

        {(skill.yearsOfExperience || skill.projectsCount) && (
          <div className="flex justify-between text-sm text-slate-500 dark:text-light/60 pt-3 border-t border-white/10">
            {skill.yearsOfExperience && (
              <span>{skill.yearsOfExperience}+ años</span>
            )}
            {skill.projectsCount && (
              <span>{skill.projectsCount} proyectos</span>
            )}
          </div>
        )}
      </Card>
    </motion.div>
  );
};
