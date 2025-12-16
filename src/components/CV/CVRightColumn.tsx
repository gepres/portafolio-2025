import { CVExperience } from './CVExperience';
import type { CVData } from '../../types';

interface CVRightColumnProps {
  cvData: CVData;
}

export const CVRightColumn = ({ cvData }: CVRightColumnProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-8">
      {/* Experience */}
      <CVExperience experience={cvData.experience} />
    </div>
  );
};
