import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageTransition } from '../components/layout/PageTransition';
import { FadeIn } from '../components/animations/FadeIn';
import { ProjectCard } from '../components/projects/ProjectCard';
import { ProjectModal } from '../components/projects/ProjectModal';
import { ProjectFilters } from '../components/projects/ProjectFilters';
import { useProjects } from '../hooks/useProjects';
import type { Project, ProjectFilterCategory } from '../types';
import { useTranslation } from 'react-i18next';

export const Projects = () => {
  const { t } = useTranslation();
  const { projects, loading } = useProjects();
  const [activeFilter, setActiveFilter] = useState<ProjectFilterCategory>('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredProjects = activeFilter === 'all'
    ? projects
    : projects.filter((p) => p.category === activeFilter);

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  return (
    <PageTransition>
      <div className="min-h-screen pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <FadeIn className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold gradient-text mb-4">
              {t('projects.title')}
            </h1>
            <p className="text-xl text-light/70 max-w-2xl mx-auto">
              {t('projects.description')}
            </p>
            <div className="w-20 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full mt-4" />
          </FadeIn>

          {/* Filters */}
          <ProjectFilters
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />

          {/* Projects Grid */}
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence mode="popLayout">
                {filteredProjects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    layout
                  >
                    <ProjectCard
                      project={project}
                      onClick={() => handleProjectClick(project)}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          {!loading && filteredProjects.length === 0 && (
            <div className="text-center py-20">
              <p className="text-xl text-light/60">
                {t('projects.noProjects')}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      <ProjectModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setTimeout(() => setSelectedProject(null), 300);
        }}
      />
    </PageTransition>
  );
};
