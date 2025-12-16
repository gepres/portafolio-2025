import { useTranslation } from 'react-i18next';
import type { CVLanguage } from '../../types';

interface CVLanguagesProps {
  languages: CVLanguage[];
}

export const CVLanguages = ({ languages }: CVLanguagesProps) => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language as 'es' | 'en';

  const getText = (text: string | { es: string; en: string } | undefined): string => {
    if (!text) return '';
    if (typeof text === 'string') return text;
    return text[currentLang] || text.es || text.en || '';
  };

  // Determinar el porcentaje de relleno según el nivel
  const getLevelPercentage = (level: string | { es: string; en: string }): number => {
    const levelText = getText(level);

    // Validar que levelText no sea undefined o null
    if (!levelText) {
      return 50; // Default si no hay nivel
    }

    const levelLower = levelText.toLowerCase();

    if (levelLower.includes('nativo') || levelLower.includes('native')) {
      return 100;
    } else if (levelLower.includes('intermedio') || levelLower.includes('intermediate')) {
      return 50;
    } else if (levelLower.includes('básico') || levelLower.includes('basic')) {
      return 25;
    } else if (levelLower.includes('avanzado') || levelLower.includes('advanced')) {
      return 75;
    }

    return 50; // Default
  };

  return (
    <div className="mb-8">
      <h3 className="text-xl font-bold mb-4 uppercase tracking-wider">
        {currentLang === 'es' ? 'Lenguajes' : 'Languages'}
      </h3>
      <div className="flex gap-6 items-center justify-center">
        {languages.map((lang) => {
          const percentage = getLevelPercentage(lang.level);
          const size = 100; // Tamaño del círculo más grande
          const radius = 42;
          const strokeWidth = 8;
          const normalizedRadius = radius - strokeWidth / 2;
          const circumference = normalizedRadius * 2 * Math.PI;
          const strokeDashoffset = circumference - (percentage / 100) * circumference;
          const center = size / 2;

          return (
            <div key={lang.id} className="text-center">
              <div
                className="rounded-full flex items-center justify-center mb-2 relative"
                style={{ width: `${size}px`, height: `${size}px` }}
              >
                {/* SVG Circle Progress */}
                <svg
                  className="absolute inset-0 -rotate-90"
                  width={size}
                  height={size}
                  viewBox={`0 0 ${size} ${size}`}
                >
                  {/* Background circle */}
                  <circle
                    cx={center}
                    cy={center}
                    r={normalizedRadius}
                    fill="none"
                    className="stroke-gray-300 dark:stroke-gray-600"
                    strokeWidth={strokeWidth}
                  />
                  {/* Progress circle */}
                  <circle
                    cx={center}
                    cy={center}
                    r={normalizedRadius}
                    fill="none"
                    className="stroke-gray-700 dark:stroke-gray-300"
                    strokeWidth={strokeWidth}
                    strokeDasharray={`${circumference} ${circumference}`}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                  />
                </svg>
                {/* Text - centered with flex */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-semibold uppercase leading-none text-gray-900 dark:text-white">{getText(lang.language)}</span>
                </div>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-300 uppercase">{getText(lang.level)}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
