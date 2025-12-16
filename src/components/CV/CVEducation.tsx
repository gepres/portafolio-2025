import { useTranslation } from 'react-i18next';
import type { CVEducation as CVEducationType } from '../../types';

interface CVEducationProps {
  education: CVEducationType[];
}

export const CVEducation = ({ education }: CVEducationProps) => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language as 'es' | 'en';

  const getText = (text: string | { es: string; en: string }) => {
    return typeof text === 'string' ? text : text[currentLang];
  };

  return (
    <div className="mb-8">
      <h3 className="text-xl font-bold mb-4 uppercase tracking-wider">
        {currentLang === 'es' ? 'Educación' : 'Education'}
      </h3>
      <div className="space-y-4">
        {education.map((edu) => (
          <div key={edu.id} className="border-l-2 border-gray-300 pl-4">
            <h4 className="font-bold text-sm uppercase">{getText(edu.degree)}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">{getText(edu.institution)}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {edu.startDate} - {edu.endDate}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
