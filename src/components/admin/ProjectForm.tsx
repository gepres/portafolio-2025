import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FormModal } from './FormModal';
import { Input } from '../ui/Input';
import { TechnologyInput } from '../ui/TechnologyInput';
import { BilingualInput } from './BilingualInput';

import { createEmptyBilingualText, isBilingualText, stringToBilingualText, getLocalizedText } from '../../lib/utils/i18n';
import { getExperiences } from '../../lib/firebase/firestore';
import type { Project, ProjectCategory, Experience } from '../../types';

interface ProjectFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Project, 'id'>) => Promise<void>;
  project?: Project;
  isLoading?: boolean;
}

export const ProjectForm = ({
  isOpen,
  onClose,
  onSubmit,
  project,
  isLoading = false,
}: ProjectFormProps) => {
  const { t, i18n } = useTranslation();
  
  const categories: { value: ProjectCategory; label: string }[] = [
    { value: 'frontend', label: t('admin.skillForm.categories.frontend', { defaultValue: 'Frontend' }) },
    { value: 'backend', label: t('admin.skillForm.categories.backend', { defaultValue: 'Backend' }) },
    { value: 'mobile', label: t('admin.skillForm.categories.mobile', { defaultValue: 'Mobile' }) },
    { value: 'fullstack', label: t('admin.skillForm.categories.fullstack', { defaultValue: 'Fullstack' }) },
  ];

  const [formData, setFormData] = useState({
    title: createEmptyBilingualText(),
    description: createEmptyBilingualText(),
    longDescription: createEmptyBilingualText(),
    technologies: [] as string[],
    category: 'frontend' as ProjectCategory,
    imageUrl: '',
    demoUrl: '',
    githubUrl: '',
    clientId: '',
    featured: false,
  });
  const [experiences, setExperiences] = useState<Experience[]>([]);

  useEffect(() => {
    const fetchExperiences = async () => {
      const data = await getExperiences();
      setExperiences(data);
    };
    fetchExperiences();
  }, []);

  useEffect(() => {
    if (project) {
      setFormData({
        title: isBilingualText(project.title) ? project.title : stringToBilingualText(project.title),
        description: isBilingualText(project.description) ? project.description : stringToBilingualText(project.description),
        longDescription: project.longDescription 
          ? (isBilingualText(project.longDescription) ? project.longDescription : stringToBilingualText(project.longDescription))
          : createEmptyBilingualText(),
        technologies: project.technologies || [],
        category: project.category,
        imageUrl: project.imageUrl || '',
        demoUrl: project.demoUrl || '',
        githubUrl: project.githubUrl || '',
        clientId: project.clientId || '',
        featured: project.featured,
      });
    } else {
      // Reset form
      setFormData({
        title: createEmptyBilingualText(),
        description: createEmptyBilingualText(),
        longDescription: createEmptyBilingualText(),
        technologies: [],
        category: 'frontend',
        imageUrl: '',
        demoUrl: '',
        githubUrl: '',
        clientId: '',
        featured: false,
      });
    }
  }, [project, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const projectData: Omit<Project, 'id'> = {
      title: formData.title,
      description: formData.description,
      longDescription: (formData.longDescription.es || formData.longDescription.en) ? formData.longDescription : null,
      technologies: formData.technologies,
      category: formData.category,
      imageUrl: formData.imageUrl || null,
      demoUrl: formData.demoUrl || null,
      githubUrl: formData.githubUrl || null,
      clientId: formData.clientId || null,
      featured: formData.featured,
      createdAt: project?.createdAt || new Date(),
    };

    await onSubmit(projectData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
      title={project ? t('admin.projectForm.editProject') : t('admin.projectForm.newProject')}
      onSubmit={handleSubmit}
      isLoading={isLoading}
      submitText={project ? t('common.update') : t('common.create')}
    >
      <div className="space-y-6">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <BilingualInput
              label={t('admin.projectForm.title')}
              value={formData.title}
              onChange={(value) => setFormData({ ...formData, title: value })}
              placeholder={{ 
                es: t('admin.projectForm.titlePlaceholder', { lng: 'es' }), 
                en: t('admin.projectForm.titlePlaceholder', { lng: 'en' }) 
              }}
              required
            />
          </div>
          <div className="pt-8">
             <label className="flex items-center space-x-2 cursor-pointer glass px-4 py-2 rounded-lg border border-white/10 hover:bg-white/5 transition-colors">
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
                className="w-5 h-5 rounded border-white/20 bg-white/10 text-primary focus:ring-primary"
              />
              <span className="text-sm font-medium">{t('admin.projectForm.featured')}</span>
            </label>
          </div>
        </div>

        <BilingualInput
          label={t('admin.projectForm.shortDescription')}
          type="textarea"
          value={formData.description}
          onChange={(value) => setFormData({ ...formData, description: value })}
          placeholder={{ 
            es: t('admin.projectForm.shortDescPlaceholder', { lng: 'es' }), 
            en: t('admin.projectForm.shortDescPlaceholder', { lng: 'en' }) 
          }}
          required
        />

        <BilingualInput
          label={t('admin.projectForm.longDescription')}
          type="textarea"
          value={formData.longDescription}
          onChange={(value) => setFormData({ ...formData, longDescription: value })}
          placeholder={{ 
            es: t('admin.projectForm.longDescPlaceholder', { lng: 'es' }), 
            en: t('admin.projectForm.longDescPlaceholder', { lng: 'en' }) 
          }}
        />

        <div>
          <label className="block text-sm font-medium mb-2">
            {t('admin.projectForm.technologies')} <span className="text-red-400">*</span>
          </label>
          <TechnologyInput
            value={formData.technologies}
            onChange={(technologies) => setFormData((prev) => ({ ...prev, technologies }))}
            placeholder={t('admin.projectForm.techPlaceholder')}
            required
          />
        </div>

      <div className="grid md:grid-cols-2 gap-4">
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
            {t('admin.projectForm.client')}
          </label>
          <select
            name="clientId"
            value={formData.clientId}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg glass border border-white/10 focus:border-primary focus:outline-none transition-all"
          >
            <option value="" className="bg-dark">{t('admin.projectForm.noClient')}</option>
            {experiences.map((exp) => (
              <option key={exp.id} value={exp.id} className="bg-dark">
                {exp.company} - {getLocalizedText(exp.role, i18n.language as 'es' | 'en')}
              </option>
            ))}
          </select>
          <p className="text-xs text-light/30 mt-1">
            {t('admin.projectForm.clientPlaceholder')}
          </p>
        </div>
      </div>



      <div>
        <label className="block text-sm font-medium mb-2">{t('admin.projectForm.image')}</label>
        <Input
          name="imageUrl"
          value={formData.imageUrl}
          onChange={handleChange}
          placeholder="https://ejemplo.com/imagen.jpg"
          type="url"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">{t('admin.projectForm.demo')}</label>
          <Input
            name="demoUrl"
            value={formData.demoUrl}
            onChange={handleChange}
            placeholder="https://demo.ejemplo.com"
            type="url"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">{t('admin.projectForm.github')}</label>
          <Input
            name="githubUrl"
            value={formData.githubUrl}
            onChange={handleChange}
            placeholder="https://github.com/usuario/repo"
            type="url"
          />
        </div>
        </div>
      </div>
    </FormModal>
  );
};
