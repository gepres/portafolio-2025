import { useTranslation } from 'react-i18next';
import { CVLeftColumn } from './CVLeftColumn';
import { CVRightColumn } from './CVRightColumn';
import type { CVData } from '../../types';

interface CVTemplateProps {
  cvData: CVData;
  isPdf?: boolean;
}

export const CVTemplate = ({ cvData, isPdf }: CVTemplateProps) => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language as 'es' | 'en';

  const getText = (text: string | { es: string; en: string } | undefined): string => {
    if (!text) return '';
    if (typeof text === 'string') return text;
    return text[currentLang] || text.es || text.en || '';
  };

  return (
    <div className="w-full max-w-[210mm] mx-auto bg-white shadow-2xl">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 p-8 border-b border-gray-300">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 md:gap-8">
          {/* Name and Title - 60% */}
          <div className="md:flex-[0.6]">
            <h1 className="text-4xl font-bold uppercase tracking-wider text-gray-900 dark:text-white">
              {cvData.personalInfo.fullName}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mt-2 uppercase tracking-wide">
              {getText(cvData.personalInfo.title)}
            </p>
          </div>

          {/* Contact Info - 40% */}
          <div className="md:flex-[0.4] md:text-right text-sm">
            <p className="text-gray-600 dark:text-gray-300">{getText(cvData.personalInfo.location)}</p>
            <p className="text-gray-600 mt-1 dark:text-gray-300">{cvData.personalInfo.phone}</p>
            <p className="text-gray-600 mt-1 dark:text-gray-300">{cvData.personalInfo.email}</p>
            {cvData.personalInfo.website && (
              <p className="text-gray-600 mt-1 dark:text-gray-300">{cvData.personalInfo.website}</p>
            )}
          </div>
        </div>
      </div>

      {/* Bio */}

      <div className="bg-white dark:bg-gray-800 p-8 border-b border-gray-300">
        <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed text-justify">
          {getText(cvData.personalInfo.summary)}
        </p>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 md:grid-cols-[35%_65%]">
        <CVLeftColumn cvData={cvData} isPdf={isPdf} />
        <CVRightColumn cvData={cvData} isPdf={isPdf} />
      </div>
    </div>
  );
};
