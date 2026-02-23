import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { FadeIn } from '../../animations/FadeIn';
import { ProjectCard } from '../../projects/ProjectCard';
import { ProjectModal } from '../../projects/ProjectModal';
import { ProjectFilters } from '../../projects/ProjectFilters';
import { Button } from '../../ui/Button';
import { useProjects } from '../../../hooks/useProjects';
import type { Project, ProjectFilterCategory } from '../../../types';
import { useTranslation } from 'react-i18next';

export const ProjectsSection = () => {
  const { t } = useTranslation();
  const { projects, loading: projectsLoading, error: projectsError } = useProjects();
  const [activeFilter, setActiveFilter] = useState<ProjectFilterCategory>('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const filteredProjects = activeFilter === 'all'
    ? (showAll ? projects : projects.slice(0, 6))
    : projects.filter((p) => p.category === activeFilter);

  const hasMoreProjects = activeFilter === 'all' && projects.length > 6 && !showAll;

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleFilterChange = (filter: ProjectFilterCategory) => {
    setActiveFilter(filter);
    setShowAll(false); // Reset showAll when changing filter
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
            onFilterChange={handleFilterChange}
          />

          {projectsLoading ? (
            <div className="text-center py-20">
              <div className="inline-block w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : projectsError ? (
            <FadeIn className="text-center py-20">
              <div className="glass rounded-2xl p-12 max-w-md mx-auto">
                <p className="text-red-400 font-semibold mb-2">No se pudieron cargar los proyectos.</p>
                <p className="text-slate-500 dark:text-light/50 text-sm">{projectsError}</p>
              </div>
            </FadeIn>
          ) : filteredProjects.length > 0 ? (
            <>
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

              {hasMoreProjects && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.6 }}
                  className="text-center mt-12"
                >
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => setShowAll(true)}
                    className="group"
                  >
                    {t('home.projects.seeMore')}
                    <ChevronDown className="w-5 h-5 ml-2 group-hover:translate-y-1 transition-transform" />
                  </Button>
                </motion.div>
              )}
            </>
          ) : (
            <FadeIn className="text-center py-20">
              <div className="glass rounded-2xl p-12 max-w-md mx-auto">
                <h3 className="text-2xl font-bold mb-4">{t('common.coming_soon')}</h3>
                <p className="text-slate-600 dark:text-light/70">
                  {t('common.admin_projects_message')}
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
