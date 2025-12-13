import { useState, useEffect } from 'react';
import { ExternalLink, Github, Check, Building2 } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import type { Project, Experience } from '../../types';
import { getExperiences } from '../../lib/firebase/firestore';

interface ProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ProjectModal = ({ project, isOpen, onClose }: ProjectModalProps) => {
  const [clientExperience, setClientExperience] = useState<Experience | null>(null);

  useEffect(() => {
    const fetchClient = async () => {
      if (project?.clientId) {
        const experiences = await getExperiences();
        const client = experiences.find(exp => exp.id === project.clientId);
        setClientExperience(client || null);
      } else {
        setClientExperience(null);
      }
    };

    fetchClient();
  }, [project?.clientId]);

  if (!project) return null;

  const features = project.longDescription?.split('\n').filter((line) => line.trim()) || [];

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <div className="space-y-6">
        {/* Image */}
        <div className="relative aspect-video rounded-lg overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20">
          {project.imageUrl ? (
            <img
              src={project.imageUrl}
              alt={project.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-9xl font-bold text-white/10">
              {project.title[0]}
            </div>
          )}
        </div>

        {/* Title & Meta */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-3xl font-bold gradient-text">{project.title}</h2>
            <span className="px-3 py-1 glass rounded-full text-sm font-semibold capitalize">
              {project.category}
            </span>
          </div>

          {/* Client Info */}
          {clientExperience && (
            <div className="flex items-center space-x-2 text-light/60 mb-4">
              <Building2 className="w-4 h-4" />
              <span className="text-sm">
                {clientExperience.company} · {clientExperience.role}
              </span>
            </div>
          )}

          {/* Technologies */}
          <div className="flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1.5 bg-primary/20 text-primary text-sm rounded-full font-medium"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Description */}
        <div>
          <h3 className="text-xl font-semibold mb-3">Descripción</h3>
          <p className="text-light/70 leading-relaxed whitespace-pre-line">{project.description}</p>
        </div>

        {/* Features/Details */}
        {features.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold mb-3">Detalles del Proyecto</h3>
            <ul className="space-y-2">
              {features.map((feature, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-light/70">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Links */}
        {(project.demoUrl?.trim() || project.githubUrl?.trim()) && (
          <div className="flex flex-wrap gap-4 pt-4 border-t border-white/10">
            {project.demoUrl?.trim() && (
              <Button
                variant="primary"
                onClick={() => window.open(project.demoUrl!, '_blank')}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Ver Demo en Vivo
              </Button>
            )}
            {project.githubUrl?.trim() && (
              <Button
                variant="outline"
                onClick={() => window.open(project.githubUrl!, '_blank')}
              >
                <Github className="w-4 h-4 mr-2" />
                Ver Código Fuente
              </Button>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};
