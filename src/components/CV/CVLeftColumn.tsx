import { CVEducation } from './CVEducation';
import { CVLanguages } from './CVLanguages';
import { CVSoftSkills } from './CVSoftSkills';
import { CVSkills } from './CVSkills';
import type { CVData } from '../../types';

interface CVLeftColumnProps {
  cvData: CVData;
  isPdf?: boolean;
}

export const CVLeftColumn = ({ cvData, isPdf }: CVLeftColumnProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-8 space-y-8">
      <CVEducation education={cvData.education} />
      <CVLanguages languages={cvData.languages} />
      <CVSoftSkills softSkills={cvData.softSkills} isPdf={isPdf} />
      <CVSkills technicalSkills={cvData.technicalSkills} isPdf={isPdf} />
    </div>
  );
};
