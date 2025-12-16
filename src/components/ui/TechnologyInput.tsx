import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Plus } from 'lucide-react';
import { getSkills } from '../../lib/firebase/firestore';
import type { Skill, SkillCategory } from '../../types';

interface TechnologyInputProps {
  value: string[];
  onChange: (technologies: string[]) => void;
  placeholder?: string;
  required?: boolean;
}

export const TechnologyInput = ({
  value,
  onChange,
  placeholder,
  required = false,
}: TechnologyInputProps) => {
  const { t } = useTranslation();
  const [inputValue, setInputValue] = useState('');
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCustomInput, setShowCustomInput] = useState(false);

  const categoryLabels: Record<SkillCategory, string> = {
    frontend: t('admin.skillForm.categories.frontend'),
    backend: t('admin.skillForm.categories.backend'),
    database: t('admin.skillForm.categories.database'),
    cloud_devops: t('admin.skillForm.categories.cloud_devops'),
    project_management: t('admin.skillForm.categories.project_management'),
    design: t('admin.skillForm.categories.design'),
    other: t('admin.skillForm.categories.other'),
  };

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const data = await getSkills();
        setSkills(data);
      } catch (error) {
        console.error('Error fetching skills:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<SkillCategory, Skill[]>);

  const handleToggleTechnology = (techName: string) => {
    if (value.includes(techName)) {
      onChange(value.filter((t) => t !== techName));
    } else {
      onChange([...value, techName]);
    }
  };

  const handleAddCustom = () => {
    const trimmedTech = inputValue.trim();
    if (trimmedTech && !value.includes(trimmedTech)) {
      onChange([...value, trimmedTech]);
      setInputValue('');
      setShowCustomInput(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (inputValue.trim()) {
        handleAddCustom();
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Selected Technologies */}
      {value.length > 0 && (
        <div className="glass rounded-lg p-4">
          <p className="text-sm font-medium mb-3 text-slate-600 dark:text-light/70">
            {t('admin.technologyInput.selected')} ({value.length})
          </p>
          <div className="flex flex-wrap gap-2">
            {value.map((tech) => (
              <span
                key={tech}
                className="inline-flex items-center px-3 py-1.5 rounded-full bg-primary/20 text-primary text-sm font-medium"
              >
                {tech}
                <button
                  type="button"
                  onClick={() => handleToggleTechnology(tech)}
                  className="ml-2 hover:text-primary-light transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Skills from Database */}
      {loading ? (
        <div className="text-center py-8 glass rounded-lg">
          <div className="inline-block w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin mb-2" />
          <p className="text-slate-600 dark:text-light/60 text-sm">{t('admin.technologyInput.loading')}</p>
        </div>
      ) : (
        <div className="glass rounded-lg p-4 max-h-96 overflow-y-auto">
          <p className="text-sm font-medium mb-4 text-slate-600 dark:text-light/70">
            {t('admin.technologyInput.available')} ({skills.length} {t('admin.technologyInput.availableCount')})
          </p>

          {Object.entries(groupedSkills).map(([category, categorySkills]) => (
            <div key={category} className="mb-6 last:mb-0">
              <h4 className="text-xs font-semibold uppercase text-slate-500 dark:text-light/30 mb-3">
                {categoryLabels[category as SkillCategory]}
              </h4>
              <div className="flex flex-wrap gap-2">
                {categorySkills.map((skill) => {
                  const isSelected = value.includes(skill.name);
                  return (
                    <button
                      key={skill.id}
                      type="button"
                      onClick={() => handleToggleTechnology(skill.name)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                        isSelected
                          ? 'bg-primary text-white ring-2 ring-primary ring-offset-2 ring-offset-slate-50 dark:ring-offset-dark'
                          : 'bg-slate-200 dark:bg-white/5 text-slate-700 dark:text-light/70 hover:bg-slate-300 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-light'
                      }`}
                    >
                      {skill.name}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Custom Technology Input */}
      <div className="glass rounded-lg p-4">
        {!showCustomInput ? (
          <button
            type="button"
            onClick={() => setShowCustomInput(true)}
            className="w-full flex items-center justify-center space-x-2 py-2 text-sm font-medium text-primary hover:text-primary-light transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>{t('admin.technologyInput.addCustom')}</span>
          </button>
        ) : (
          <div className="space-y-2">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder || t('admin.technologyInput.placeholder')}
                className="flex-1 px-4 py-2 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white focus:border-primary focus:outline-none transition-all"
                autoFocus
              />
              <button
                type="button"
                onClick={handleAddCustom}
                disabled={!inputValue.trim()}
                className="px-4 py-2 rounded-lg bg-primary text-white font-medium hover:bg-primary-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t('admin.technologyInput.add')}
              </button>
            </div>
            <button
              type="button"
              onClick={() => {
                setShowCustomInput(false);
                setInputValue('');
              }}
              className="text-xs text-slate-500 dark:text-light/30 hover:text-slate-700 dark:hover:text-light transition-colors"
            >
              {t('admin.technologyInput.cancel')}
            </button>
          </div>
        )}
      </div>

      <input
        type="hidden"
        required={required && value.length === 0}
        value={value.join(',')}
      />
    </div>
  );
};
