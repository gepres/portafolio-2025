import { useTranslation } from 'react-i18next';
import type { CVSoftSkill } from '../../types';

interface CVSoftSkillsProps {
  softSkills: CVSoftSkill[];
}

export const CVSoftSkills = ({ softSkills }: CVSoftSkillsProps) => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language as 'es' | 'en';

  const getText = (text: string | { es: string; en: string } | undefined): string => {
    if (!text) return '';
    if (typeof text === 'string') return text;
    return text[currentLang] || text.es || text.en || '';
  };

  return (
    <div className="mb-8">
      <h3 className="text-xl font-bold mb-4 uppercase tracking-wider">
        {currentLang === 'es' ? 'Mis Habilidades' : 'My Skills'}
      </h3>
      <div className="space-y-3">
        {softSkills.map((skill) => (
          <div key={skill.id} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-gray-700 dark:bg-gray-300"></div>
            <p className="text-sm">{getText(skill.name)}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
