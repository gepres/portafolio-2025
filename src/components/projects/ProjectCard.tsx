import { motion } from 'framer-motion';
import { ExternalLink, Github, Star } from 'lucide-react';
import { Card } from '../ui/Card';
import type { Project } from '../../types';

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

export const ProjectCard = ({ project, onClick }: ProjectCardProps) => {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className="cursor-pointer"
      onClick={onClick}
    >
      <Card className="h-full overflow-hidden p-0 group">
        {/* Image */}
        <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20">
          {project.imageUrl ? (
            <img
              src={project.imageUrl}
              alt={project.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-6xl font-bold text-slate-300 dark:text-white/10">
              {project.title[0]}
            </div>
          )}

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-6">
            <div className="flex space-x-4">
              {project.demoUrl && (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="p-3 glass-hover rounded-full cursor-hover"
                  title="Ver Demo"
                >
                  <ExternalLink className="w-5 h-5" />
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="p-3 glass-hover rounded-full cursor-hover"
                  title="Ver Código"
                >
                  <Github className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>

          {/* Featured badge */}
          {project.featured && (
            <div className="absolute top-4 right-4 px-3 py-1 bg-accent/90 backdrop-blur-sm rounded-full text-xs font-semibold flex items-center space-x-1">
              <Star className="w-3 h-3 fill-current" />
              <span>Destacado</span>
            </div>
          )}

          {/* Category badge */}
          <div className="absolute top-4 left-4 px-3 py-1 glass backdrop-blur-sm rounded-full text-xs font-semibold capitalize">
            {project.category}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-xl font-bold mb-2 gradient-text line-clamp-1">{project.title}</h3>
          <p className="text-slate-600 dark:text-light/70 text-sm mb-4 line-clamp-2">
            {project.description}
          </p>

          {/* Tech stack */}
          <div className="flex flex-wrap gap-2">
            {project.technologies.slice(0, 4).map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 bg-primary/20 text-primary text-xs rounded-full font-medium"
              >
                {tech}
              </span>
            ))}
            {project.technologies.length > 4 && (
              <span className="px-3 py-1 bg-primary/20 text-primary text-xs rounded-full font-medium">
                +{project.technologies.length - 4}
              </span>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
