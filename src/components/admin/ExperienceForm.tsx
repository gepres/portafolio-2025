import { useState, useEffect } from 'react';
import { FormModal } from './FormModal';
import { Input } from '../ui/Input';
import { TechnologyInput } from '../ui/TechnologyInput';
import type { Experience } from '../../types';

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
    role: '',
    startDate: '',
    endDate: '',
    description: '',
    technologies: [] as string[],
    current: false,
  });

  useEffect(() => {
    if (experience) {
      setFormData({
        company: experience.company,
        role: experience.role,
        startDate: experience.startDate,
        endDate: experience.endDate,
        description: experience.description,
        technologies: experience.technologies || [],
        current: experience.current,
      });
    } else {
      // Reset form
      setFormData({
        company: '',
        role: '',
        startDate: '',
        endDate: '',
        description: '',
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
      title={experience ? 'Editar Experiencia' : 'Nueva Experiencia'}
      onSubmit={handleSubmit}
      isLoading={isLoading}
      submitText={experience ? 'Actualizar' : 'Crear'}
    >
      <div>
        <label className="block text-sm font-medium mb-2">
          Empresa <span className="text-red-400">*</span>
        </label>
        <Input
          name="company"
          value={formData.company}
          onChange={handleChange}
          placeholder="Nombre de la empresa"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Cargo <span className="text-red-400">*</span>
        </label>
        <Input
          name="role"
          value={formData.role}
          onChange={handleChange}
          placeholder="Ej: Senior Full Stack Developer"
          required
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Fecha Inicio <span className="text-red-400">*</span>
          </label>
          <Input
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            placeholder="Ej: Enero 2022"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Fecha Fin {!formData.current && <span className="text-red-400">*</span>}
          </label>
          <Input
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            placeholder="Ej: Diciembre 2023"
            required={!formData.current}
            disabled={formData.current}
          />
        </div>
      </div>

      <div>
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            name="current"
            checked={formData.current}
            onChange={handleChange}
            className="w-5 h-5 rounded border-white/20 bg-white/10 text-primary focus:ring-primary"
          />
          <span className="text-sm font-medium">Trabajo Actual</span>
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Descripción <span className="text-red-400">*</span>
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe tus responsabilidades y logros..."
          required
          rows={4}
          className="w-full px-4 py-3 rounded-lg glass border border-white/10 focus:border-primary focus:outline-none transition-all resize-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Tecnologías <span className="text-red-400">*</span>
        </label>
        <TechnologyInput
          value={formData.technologies}
          onChange={(technologies) => setFormData((prev) => ({ ...prev, technologies }))}
          placeholder="Escribe o selecciona tecnologías..."
          required
        />
      </div>
    </FormModal>
  );
};
