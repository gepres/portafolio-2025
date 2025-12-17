import { motion } from 'framer-motion';
import { Briefcase } from 'lucide-react';
import { Card } from '../../ui/Card';
import { staggerItem } from '../../../lib/utils/animations';
import { formatDate, calculateDuration } from '../../../lib/utils/helpers';
import { getLocalizedText } from '../../../lib/utils/i18n';
import type { Experience } from '../../../types';
import { useTranslation } from 'react-i18next';

interface ExperienceCardProps {
  experience: Experience;
  index: number;
}

export const ExperienceCard = ({ experience, index }: ExperienceCardProps) => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language as 'es' | 'en';

  return (
    <motion.div
      variants={staggerItem}
      className={`relative mb-12 ${
        index % 2 === 0 ? 'md:pr-1/2 md:text-right' : 'md:pl-1/2 md:ml-auto'
      }`}
    >
      <div className="absolute left-8 md:left-1/2 w-4 h-4 bg-primary rounded-full transform -translate-x-1/2 z-10 ring-4 ring-slate-100 dark:ring-slate-900" />

      <Card className={`ml-16 md:ml-0 ${index % 2 === 0 ? 'md:mr-12' : 'md:ml-12'}`}>
        <div className="flex items-start space-x-4 mb-4">
          {experience.logo ? (
            <img
              src={experience.logo}
              alt={experience.company}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center text-white">
              <Briefcase className="w-6 h-6" />
            </div>
          )}
          <div className="flex-1">
            <h3 className="text-xl font-bold gradient-text">{getLocalizedText(experience.role, currentLang)}</h3>
            <p className="text-primary font-semibold">{experience.company}</p>
            <p className="text-slate-500 dark:text-light/60 text-sm">
              {formatDate(experience.startDate)} - {experience.endDate === 'present' ? t('admin.experienceForm.current') : formatDate(experience.endDate)}
              {' · '}
              {calculateDuration(experience.startDate, experience.endDate)}
            </p>
          </div>
        </div>

        <p className="text-slate-600 dark:text-light/70 mb-4">{getLocalizedText(experience.description, currentLang)}</p>

        {experience.achievements && experience.achievements.length > 0 && (
          <ul className="space-y-2 mb-4">
            {experience.achievements.map((achievement, i) => (
              <li key={i} className="flex items-start space-x-2 text-slate-600 dark:text-light/70 text-sm">
                <span className="text-primary mt-1">•</span>
                <span>{getLocalizedText(achievement, currentLang)}</span>
              </li>
            ))}
          </ul>
        )}

        <div className="flex flex-wrap gap-2">
          {experience.technologies.map((tech) => (
            <span
              key={tech}
              className="px-3 py-1 bg-primary/20 text-primary text-xs rounded-full"
            >
              {tech}
            </span>
          ))}
        </div>
      </Card>
    </motion.div>
  );
};
