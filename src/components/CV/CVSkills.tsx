import type { CVTechnicalSkill } from '../../types';

interface CVSkillsProps {
  technicalSkills: CVTechnicalSkill[];
}

export const CVSkills = ({ technicalSkills }: CVSkillsProps) => {
  // Orden de categorías
  const categoryOrder = ['frontend', 'backend', 'database', 'cloud_devops', 'project_management', 'tools', 'cloud', 'design'];

  // Mapear categorías del CV a categorías del sistema principal
  const categoryMap: Record<string, string> = {
    'frontend': 'frontend',
    'backend': 'backend',
    'tools': 'project_management',
    'cloud': 'cloud_devops',
    'design': 'design',
  };

  // Ordenar skills según el orden de categorías
  const sortedSkills = [...technicalSkills].sort((a, b) => {
    const categoryA = categoryMap[a.category] || a.category;
    const categoryB = categoryMap[b.category] || b.category;

    const indexA = categoryOrder.indexOf(categoryA);
    const indexB = categoryOrder.indexOf(categoryB);

    const orderA = indexA === -1 ? 999 : indexA;
    const orderB = indexB === -1 ? 999 : indexB;

    if (orderA !== orderB) {
      return orderA - orderB;
    }

    // Si están en la misma categoría, ordenar por nivel descendente
    return b.level - a.level;
  });

  return (
    <div className="mb-8">
      <h3 className="text-xl font-bold mb-4 uppercase tracking-wider">Skills</h3>
      <div className="space-y-3">
        {sortedSkills.map((skill) => (
          <div key={skill.id}>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">{skill.name}</span>
            </div>
            <div className="w-full bg-gray-300 dark:bg-gray-600 rounded-full h-2">
              <div
                className="bg-gray-700 dark:bg-gray-400 h-2 rounded-full transition-all"
                style={{ width: `${skill.level}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
