import { useState, useEffect } from 'react';
import { FormModal } from './FormModal';
import { Input } from '../ui/Input';
import { TechnologyInput } from '../ui/TechnologyInput';
import { BilingualInput } from './BilingualInput';

import { createEmptyBilingualText, isBilingualText, stringToBilingualText } from '../../lib/utils/i18n';
import type { Experience } from '../../types';
import { useTranslation } from 'react-i18next';

interface ExperienceFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Experience, 'id'>) => Promise<void>;
  experience?: Experience;
  isLoading?: boolean;
}

export const ExperienceForm = ({
  isOpen,
  onClose,
  onSubmit,
  experience,
  isLoading = false,
}: ExperienceFormProps) => {
  const [formData, setFormData] = useState({
    company: '',
    role: createEmptyBilingualText(),
    startDate: '',
    endDate: '',
    description: createEmptyBilingualText(),
    technologies: [] as string[],
    current: false,
  });

  const { t } = useTranslation();

  useEffect(() => {
    if (experience) {
      setFormData({
        company: experience.company,
        role: isBilingualText(experience.role) ? experience.role : stringToBilingualText(experience.role),
        startDate: experience.startDate,
        endDate: experience.endDate,
        description: isBilingualText(experience.description) ? experience.description : stringToBilingualText(experience.description),
        technologies: experience.technologies || [],
        current: experience.current,
      });
    } else {
      // Reset form
      setFormData({
        company: '',
        role: createEmptyBilingualText(),
        startDate: '',
        endDate: '',
        description: createEmptyBilingualText(),
        technologies: [],
        current: false,
      });
    }
  }, [experience, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const experienceData: Omit<Experience, 'id'> = {
      company: formData.company,
      role: formData.role,
      startDate: formData.startDate,
      endDate: formData.current ? 'Presente' : formData.endDate,
      description: formData.description,
      technologies: formData.technologies,
      current: formData.current,
    };

    await onSubmit(experienceData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title={experience ? t('admin.experienceForm.editExperience') : t('admin.experienceForm.newExperience')}
      onSubmit={handleSubmit}
      isLoading={isLoading}
      submitText={experience ? t('common.update') : t('common.create')}
    >
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            {t('admin.experienceForm.company')} <span className="text-red-400">*</span>
          </label>
          <Input
            name="company"
            value={formData.company}
            onChange={handleChange}
            placeholder={t('admin.experienceForm.companyPlaceholder')}
            required
          />
        </div>
        <div className="pt-8">
           <label className="flex items-center space-x-2 cursor-pointer glass px-4 py-2 rounded-lg border border-white/10 hover:bg-white/5 transition-colors h-[46px]">
            <input
              type="checkbox"
              name="current"
              checked={formData.current}
              onChange={handleChange}
              className="w-5 h-5 rounded border-white/20 bg-white/10 text-primary focus:ring-primary"
            />
            <span className="text-sm font-medium">{t('admin.experienceForm.current')}</span>
          </label>
        </div>
      </div>

      <div>
        <BilingualInput
          label={t('admin.experienceForm.role')}
          value={formData.role}
          onChange={(value) => setFormData({ ...formData, role: value })}
          placeholder={{ 
            es: t('admin.experienceForm.rolePlaceholder', { lng: 'es' }), 
            en: t('admin.experienceForm.rolePlaceholder', { lng: 'en' }) 
          }}
          required
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            {t('admin.experienceForm.startDate')} <span className="text-red-400">*</span>
          </label>
          <Input
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            placeholder={t('admin.experienceForm.startDatePlaceholder')}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            {t('admin.experienceForm.endDate')} {!formData.current && <span className="text-red-400">*</span>}
          </label>
          <Input
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            placeholder={t('admin.experienceForm.endDatePlaceholder')}
            required={!formData.current}
            disabled={formData.current}
          />
        </div>
      </div>



      <div>
        <BilingualInput
          label={t('admin.experienceForm.description')}
          type="textarea"
          value={formData.description}
          onChange={(value) => setFormData({ ...formData, description: value })}
          placeholder={{ 
            es: t('admin.experienceForm.descriptionPlaceholder', { lng: 'es' }), 
            en: t('admin.experienceForm.descriptionPlaceholder', { lng: 'en' }) 
          }}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          {t('admin.experienceForm.technologies')} <span className="text-red-400">*</span>
        </label>
        <TechnologyInput
          value={formData.technologies}
          onChange={(technologies) => setFormData((prev) => ({ ...prev, technologies }))}
          placeholder={t('admin.experienceForm.techPlaceholder')}
          required
        />
      </div>
    </FormModal>
  );
};
