import { useTranslation } from 'react-i18next';
import type { CVExperience as CVExperienceType } from '../../types';

interface CVExperienceProps {
  experience: CVExperienceType[];
}

export const CVExperience = ({ experience }: CVExperienceProps) => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language as 'es' | 'en';

  const getText = (text: string | { es: string; en: string } | undefined): string => {
    if (!text) return '';
    if (typeof text === 'string') return text;
    return text[currentLang] || text.es || text.en || '';
  };

  return (
    <div className="mb-8">
      <h3 className="text-2xl font-bold mb-6 uppercase tracking-wider">
        {currentLang === 'es' ? 'Experiencia Laboral' : 'Work Experience'}
      </h3>
      <div className="space-y-6">
        {experience.map((exp) => (
          <div key={exp.id} className="border-l-2 border-gray-600 dark:border-gray-300 pl-4">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-2 gap-1 md:gap-0">
              <div>
                <h4 className="font-bold text-base uppercase">{getText(exp.position)}</h4>
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">{exp.company}</p>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 md:whitespace-nowrap md:ml-4">
                {exp.startDate} - {exp.endDate}
              </p>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed text-justify">
              {getText(exp.description)}
            </p>
            {exp.technologies && exp.technologies.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {exp.technologies.map((tech, idx) => (
                  <span
                    key={idx}
                    className="text-xs inline-flex text-center bg-gray-200 dark:bg-gray-700 rounded text-gray-700 dark:text-gray-300"
                    style={{
                      padding: '2px 8px',
                      lineHeight: '1.2',
                      verticalAlign: 'middle',
                      display: '',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minHeight: '24px'
                    }}
                  >
                    <span className="m-auto">
                      {tech}
                    </span>
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
