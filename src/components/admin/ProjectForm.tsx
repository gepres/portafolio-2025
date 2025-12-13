import { useState, useEffect } from 'react';
import { FormModal } from './FormModal';
import { Input } from '../ui/Input';
import { TechnologyInput } from '../ui/TechnologyInput';
import { getExperiences } from '../../lib/firebase/firestore';
import type { Project, ProjectCategory, Experience } from '../../types';

interface ProjectFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Project, 'id'>) => Promise<void>;
  project?: Project;
  isLoading?: boolean;
}

const categories: { value: ProjectCategory; label: string }[] = [
  { value: 'frontend', label: 'Frontend' },
  { value: 'backend', label: 'Backend' },
  { value: 'mobile', label: 'Mobile' },
  { value: 'fullstack', label: 'Fullstack' },
];

export const ProjectForm = ({
  isOpen,
  onClose,
  onSubmit,
  project,
  isLoading = false,
}: ProjectFormProps) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    longDescription: '',
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
        title: project.title,
        description: project.description,
        longDescription: project.longDescription || '',
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
        title: '',
        description: '',
        longDescription: '',
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
      longDescription: formData.longDescription || null,
      technologies: formData.technologies,
      category: formData.category,
      imageUrl: formData.imageUrl || null,
      demoUrl: formData.demoUrl || null,
      githubUrl: formData.githubUrl || null,
      clientId: formData.clientId || null,
      featured: formData.featured,
      createdAt: project?.createdAt || new Date(),
    };
    console.log('projectData',projectData);

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
      title={project ? 'Editar Proyecto' : 'Nuevo Proyecto'}
      onSubmit={handleSubmit}
      isLoading={isLoading}
      submitText={project ? 'Actualizar' : 'Crear'}
    >
      <div>
        <label className="block text-sm font-medium mb-2">
          Título <span className="text-red-400">*</span>
        </label>
        <Input
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Nombre del proyecto"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Descripción Corta <span className="text-red-400">*</span>
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Descripción breve del proyecto (2-3 líneas)"
          required
          rows={3}
          className="w-full px-4 py-3 rounded-lg glass border border-white/10 focus:border-primary focus:outline-none transition-all resize-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Descripción Detallada
        </label>
        <textarea
          name="longDescription"
          value={formData.longDescription}
          onChange={handleChange}
          placeholder="Descripción completa del proyecto"
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

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Categoría <span className="text-red-400">*</span>
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
            Cliente / Empresa
          </label>
          <select
            name="clientId"
            value={formData.clientId}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg glass border border-white/10 focus:border-primary focus:outline-none transition-all"
          >
            <option value="" className="bg-dark">Sin asignar</option>
            {experiences.map((exp) => (
              <option key={exp.id} value={exp.id} className="bg-dark">
                {exp.company} - {exp.role}
              </option>
            ))}
          </select>
          <p className="text-xs text-light/30 mt-1">
            Relaciona este proyecto con una experiencia laboral
          </p>
        </div>
      </div>

      <div>
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            name="featured"
            checked={formData.featured}
            onChange={handleChange}
            className="w-5 h-5 rounded border-white/20 bg-white/10 text-primary focus:ring-primary"
          />
          <span className="text-sm font-medium">Proyecto Destacado</span>
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">URL de Imagen</label>
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
          <label className="block text-sm font-medium mb-2">URL Demo</label>
          <Input
            name="demoUrl"
            value={formData.demoUrl}
            onChange={handleChange}
            placeholder="https://demo.ejemplo.com"
            type="url"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">URL GitHub</label>
          <Input
            name="githubUrl"
            value={formData.githubUrl}
            onChange={handleChange}
            placeholder="https://github.com/usuario/repo"
            type="url"
          />
        </div>
      </div>
    </FormModal>
  );
};
