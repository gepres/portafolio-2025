import { CVExperience } from './CVExperience';
import type { CVData } from '../../types';

interface CVRightColumnProps {
  cvData: CVData;
  isPdf?: boolean;
}

export const CVRightColumn = ({ cvData, isPdf }: CVRightColumnProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-8">
      {/* Experience */}
      <CVExperience experience={cvData.experience} isPdf={isPdf} />
    </div>
  );
};
