import { useState } from 'react';
import { motion } from 'framer-motion';
import { FadeIn } from '../../animations/FadeIn';
import { ProjectCard } from '../../projects/ProjectCard';
import { ProjectModal } from '../../projects/ProjectModal';
import { ProjectFilters } from '../../projects/ProjectFilters';
import { useProjects } from '../../../hooks/useProjects';
import type { Project, ProjectFilterCategory } from '../../../types';
import { useTranslation } from 'react-i18next';

export const ProjectsSection = () => {
  const { t } = useTranslation();
  const { projects, loading: projectsLoading } = useProjects();
  const [activeFilter, setActiveFilter] = useState<ProjectFilterCategory>('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredProjects = activeFilter === 'all'
    ? projects.slice(0, 6)
    : projects.filter((p) => p.category === activeFilter);

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  return (
    <>
      <section id="projects" className="relative py-24 px-4 bg-slate-100/50 dark:bg-dark-light/50">
        <div className="max-w-7xl mx-auto">
          <FadeIn className="text-center mb-12">
            <h2 className="text-4xl md:text-6xl font-bold gradient-text mb-4">
              {t('home.projects.title')}
            </h2>
            <p className="text-xl text-slate-600 dark:text-light/70 max-w-2xl mx-auto">
              {t('home.projects.subtitle')}
            </p>
            <div className="w-20 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full mt-4" />
          </FadeIn>

          <ProjectFilters
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />

          {projectsLoading ? (
            <div className="text-center py-20">
              <div className="inline-block w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredProjects.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <ProjectCard
                    project={project}
                    onClick={() => handleProjectClick(project)}
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <FadeIn className="text-center py-20">
              <div className="glass rounded-2xl p-12 max-w-md mx-auto">
                <h3 className="text-2xl font-bold mb-4">{t('common.comingSoon')}</h3>
                <p className="text-slate-600 dark:text-light/70">
                  {t('common.adminProjectsMessage')}
                </p>
              </div>
            </FadeIn>
          )}
        </div>
      </section>

      <ProjectModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setTimeout(() => setSelectedProject(null), 300);
        }}
      />
    </>
  );
};
