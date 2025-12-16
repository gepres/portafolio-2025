import { CVEducation } from './CVEducation';
import { CVLanguages } from './CVLanguages';
import { CVSoftSkills } from './CVSoftSkills';
import { CVSkills } from './CVSkills';
import type { CVData } from '../../types';

interface CVLeftColumnProps {
  cvData: CVData;
}

export const CVLeftColumn = ({ cvData }: CVLeftColumnProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-8 space-y-8">
      <CVEducation education={cvData.education} />
      <CVLanguages languages={cvData.languages} />
      <CVSoftSkills softSkills={cvData.softSkills} />
      <CVSkills technicalSkills={cvData.technicalSkills} />
    </div>
  );
};
