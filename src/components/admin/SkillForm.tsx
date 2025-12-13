import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FormModal } from './FormModal';
import { Input } from '../ui/Input';
import type { Skill, SkillCategory } from '../../types';

interface SkillFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Skill, 'id'>) => Promise<void>;
  skill?: Skill;
  isLoading?: boolean;
}

export const SkillForm = ({
  isOpen,
  onClose,
  onSubmit,
  skill,
  isLoading = false,
}: SkillFormProps) => {
  const { t } = useTranslation();
  
  const categories: { value: SkillCategory; label: string }[] = [
    { value: 'frontend', label: t('admin.skillForm.categories.frontend', { defaultValue: 'Frontend' }) },
    { value: 'backend', label: t('admin.skillForm.categories.backend', { defaultValue: 'Backend' }) },
    { value: 'database', label: t('admin.skillForm.categories.database', { defaultValue: 'Database' }) },
    { value: 'cloud_devops', label: t('admin.skillForm.categories.cloud_devops', { defaultValue: 'Cloud & DevOps' }) },
    { value: 'project_management', label: t('admin.skillForm.categories.project_management', { defaultValue: 'Project Management' }) },
    { value: 'design', label: t('admin.skillForm.categories.design', { defaultValue: 'Design' }) },
    { value: 'other', label: t('admin.skillForm.categories.other', { defaultValue: 'Otro' }) },
  ];

  const [formData, setFormData] = useState({
    name: '',
    level: 50,
    category: 'frontend' as SkillCategory,
    icon: '',
  });

  useEffect(() => {
    if (skill) {
      setFormData({
        name: skill.name,
        level: skill.level,
        category: skill.category,
        icon: skill.icon || '',
      });
    } else {
      // Reset form
      setFormData({
        name: '',
        level: 50,
        category: 'frontend',
        icon: '',
      });
    }
  }, [skill, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const skillData: Omit<Skill, 'id'> = {
      name: formData.name,
      level: formData.level,
      category: formData.category,
      icon: formData.icon,
      order: skill?.order || 0,
    };

    await onSubmit(skillData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'level' ? Number(value) : value,
    }));
  };

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title={skill ? t('admin.skillForm.editSkill') : t('admin.skillForm.newSkill')}
      onSubmit={handleSubmit}
      isLoading={isLoading}
      submitText={skill ? t('common.save') : t('common.add')}
    >
      <div>
        <label className="block text-sm font-medium mb-2">
          {t('admin.skillForm.name')} <span className="text-red-400">*</span>
        </label>
        <Input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder={t('admin.skillForm.namePlaceholder')}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          {t('admin.skillForm.icon')}
        </label>
        <Input
          name="icon"
          value={formData.icon}
          onChange={handleChange}
          placeholder={t('admin.skillForm.iconPlaceholder')}
        />
        <a 
          href="https://devicon.dev/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-xs text-primary hover:text-primary-light mt-1 inline-block transition-colors"
        >
          {t('admin.skillForm.iconHelp')}
        </a>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          {t('admin.skillForm.category')} <span className="text-red-400">*</span>
        </label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 rounded-lg glass border border-white/10 focus:border-primary focus:outline-none transition-all"
        >
          {categories.map((cat) => (
            <option key={cat.value} value={cat.value} className="bg-dark">
              {cat.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          {t('admin.skillForm.level')}: <span className="text-primary font-bold">{formData.level}%</span>
        </label>
        <input
          type="range"
          name="level"
          min="0"
          max="100"
          step="5"
          value={formData.level}
          onChange={handleChange}
          className="w-full h-2 rounded-lg appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, #6366f1 0%, #6366f1 ${formData.level}%, rgba(255,255,255,0.1) ${formData.level}%, rgba(255,255,255,0.1) 100%)`,
          }}
        />
        <div className="flex justify-between text-xs text-light/30 mt-1">
          <span>{t('admin.skillForm.beginner')}</span>
          <span>{t('admin.skillForm.intermediate')}</span>
          <span>{t('admin.skillForm.expert')}</span>
        </div>
      </div>

      {/* Preview */}
      <div className="glass rounded-lg p-4">
        <p className="text-sm text-light/60 mb-2">{t('admin.skillForm.preview')}:</p>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">
                 {formData.icon.includes('devicon-') ? <i className={formData.icon}></i> : formData.icon}
              </span>
              <span className="font-medium">{formData.name || t('admin.skillForm.name')}</span>
            </div>
            <span className="text-sm text-light/60">{formData.level}%</span>
          </div>
          <div className="relative h-2 bg-dark-light rounded-full overflow-hidden">
            <div
              className="h-full gradient-primary transition-all duration-300"
              style={{ width: `${formData.level}%` }}
            />
          </div>
        </div>
      </div>
    </FormModal>
  );
};
