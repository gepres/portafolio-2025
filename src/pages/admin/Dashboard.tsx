import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { LogOut, FolderOpen, Briefcase, Code, Plus, Edit, Trash2, Eye } from 'lucide-react';
import { signOut } from '../../lib/firebase/auth';
import { useAuthContext } from '../../context/AuthContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { motion } from 'framer-motion';
import { staggerContainer, staggerItem } from '../../lib/utils/animations';
import { useProjects } from '../../hooks/useProjects';
import {
  getExperiences,
  getSkills,
  createProject,
  updateProject,
  deleteProject,
  createExperience,
  updateExperience,
  deleteExperience,
  createSkill,
  updateSkill,
  deleteSkill,
} from '../../lib/firebase/firestore';

import { ProjectForm } from '../../components/admin/ProjectForm';
import { ExperienceForm } from '../../components/admin/ExperienceForm';
import { SkillForm } from '../../components/admin/SkillForm';
import type { Experience, Skill, Project } from '../../types';
import { useTranslation } from 'react-i18next';
import { getLocalizedText } from '../../lib/utils/i18n';

type Section = 'projects' | 'experience' | 'skills' | 'overview';

export const Dashboard = () => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language as 'es' | 'en';
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { projects, refetch: refetchProjects } = useProjects(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [activeSection, setActiveSection] = useState<Section>('overview');
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);

  // Modal states
  const [projectFormOpen, setProjectFormOpen] = useState(false);
  const [experienceFormOpen, setExperienceFormOpen] = useState(false);
  const [skillFormOpen, setSkillFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | undefined>();
  const [editingExperience, setEditingExperience] = useState<Experience | undefined>();
  const [editingSkill, setEditingSkill] = useState<Skill | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = async () => {
    const [expData, skillsData] = await Promise.all([
      getExperiences(),
      getSkills(),
    ]);
    setExperiences(expData);
    setSkills(skillsData);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const { error } = await signOut();
      if (error) {
        toast.error(error);
      } else {
        toast.success(t('admin.dashboard.successLogout'));
        navigate('/admin/login');
      }
    } catch (error) {
      toast.error(t('admin.dashboard.errorLogout'));
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleViewPortfolio = () => {
    navigate('/');
  };

  // Project handlers
  const handleCreateProject = () => {
    setEditingProject(undefined);
    setProjectFormOpen(true);
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setProjectFormOpen(true);
  };

  const handleSubmitProject = async (data: Omit<Project, 'id'>) => {
    console.log('data origin',data);
    setIsSubmitting(true);
    try {
      if (editingProject) {
        await updateProject(editingProject.id, data);
        toast.success(t('admin.dashboard.successUpdateProject'));
      } else {
        await createProject(data);
        toast.success(t('admin.dashboard.successCreateProject'));
      }
      setProjectFormOpen(false);
      if (refetchProjects) refetchProjects();
    } catch (error) {
      toast.error(t('admin.dashboard.errorSaveProject'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (window.confirm(t('admin.dashboard.confirmDeleteProject'))) {
      try {
        await deleteProject(id);
        toast.success(t('admin.dashboard.successDeleteProject'));
        if (refetchProjects) refetchProjects();
      } catch (error) {
        toast.error(t('admin.dashboard.errorDeleteProject'));
      }
    }
  };

  // Experience handlers
  const handleCreateExperience = () => {
    setEditingExperience(undefined);
    setExperienceFormOpen(true);
  };

  const handleEditExperience = (experience: Experience) => {
    setEditingExperience(experience);
    setExperienceFormOpen(true);
  };

  const handleSubmitExperience = async (data: Omit<Experience, 'id'>) => {
    setIsSubmitting(true);
    try {
      if (editingExperience) {
        await updateExperience(editingExperience.id, data);
        toast.success(t('admin.dashboard.successUpdateExperience'));
      } else {
        await createExperience(data);
        toast.success(t('admin.dashboard.successCreateExperience'));
      }
      setExperienceFormOpen(false);
      await fetchData();
    } catch (error) {
      toast.error(t('admin.dashboard.errorSaveExperience'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteExperience = async (id: string) => {
    if (window.confirm(t('admin.dashboard.confirmDeleteExperience'))) {
      try {
        await deleteExperience(id);
        toast.success(t('admin.dashboard.successDeleteExperience'));
        await fetchData();
      } catch (error) {
        toast.error(t('admin.dashboard.errorDeleteExperience'));
      }
    }
  };

  // Skill handlers
  const handleCreateSkill = () => {
    setEditingSkill(undefined);
    setSkillFormOpen(true);
  };

  const handleEditSkill = (skill: Skill) => {
    setEditingSkill(skill);
    setSkillFormOpen(true);
  };

  const handleSubmitSkill = async (data: Omit<Skill, 'id'>) => {
    setIsSubmitting(true);
    try {
      if (editingSkill) {
        await updateSkill(editingSkill.id, data);
        toast.success(t('admin.dashboard.successUpdateSkill'));
      } else {
        await createSkill(data);
        toast.success(t('admin.dashboard.successCreateSkill'));
      }
      setSkillFormOpen(false);
      await fetchData();
    } catch (error) {
      toast.error(t('admin.dashboard.errorSaveSkill'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSkill = async (id: string) => {
    if (window.confirm(t('admin.dashboard.confirmDeleteSkill'))) {
      try {
        await deleteSkill(id);
        toast.success(t('admin.dashboard.successDeleteSkill'));
        await fetchData();
      } catch (error) {
        toast.error(t('admin.dashboard.errorDeleteSkill'));
      }
    }
  };

  const menuItems = [
    { id: 'projects' as Section, icon: FolderOpen, label: t('admin.dashboard.projects'), count: projects.length },
    { id: 'experience' as Section, icon: Briefcase, label: t('admin.dashboard.experience'), count: experiences.length },
    { id: 'skills' as Section, icon: Code, label: t('admin.dashboard.skills'), count: skills.length },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark">
      {/* Header */}
      <header className="glass border-b border-white/10 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center font-bold">
                G
              </div>
              <div>
                <h1 className="text-lg font-bold gradient-text">{t('admin.dashboard.title')}</h1>
                <p className="text-xs text-slate-600 dark:text-light/60">{user?.email}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={handleViewPortfolio}
                size="sm"
              >
                <Eye className="w-4 h-4 mr-2" />
                {t('admin.dashboard.viewPortfolio')}
              </Button>
              <Button
                variant="outline"
                onClick={handleLogout}
                isLoading={isLoggingOut}
                size="sm"
              >
                {!isLoggingOut && <LogOut className="w-4 h-4 mr-2" />}
                {t('admin.dashboard.logout')}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-3xl font-bold mb-2">
            {t('admin.dashboard.welcome')}, {user?.displayName || 'Admin'}
          </h2>
          <p className="text-slate-600 dark:text-light/70">
            {t('admin.dashboard.manageContent')}
          </p>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          className="grid md:grid-cols-3 gap-6 mb-12"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {menuItems.map((item) => (
            <motion.div key={item.label} variants={staggerItem}>
              <Card
                className="cursor-pointer hover:scale-105 transition-transform"
                onClick={() => setActiveSection(item.id)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-500 dark:text-light/60 text-sm mb-1">{item.label}</p>
                    <p className="text-3xl font-bold gradient-text">{item.count}</p>
                  </div>
                  <div className="w-12 h-12 rounded-lg gradient-primary flex items-center justify-center">
                    <item.icon className="w-6 h-6" />
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Section Tabs */}
        <div className="flex space-x-2 mb-8 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveSection('overview')}
            className={`px-6 py-3 rounded-lg font-medium transition-all whitespace-nowrap ${
              activeSection === 'overview'
                ? 'gradient-primary text-white'
                : 'glass-hover text-light/70'
            }`}
          >
            {t('admin.dashboard.overview')}
          </button>
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`px-6 py-3 rounded-lg font-medium transition-all whitespace-nowrap flex items-center space-x-2 ${
                activeSection === item.id
                  ? 'gradient-primary text-white'
                  : 'glass-hover text-light/70'
              }`}
            >
              <item.icon className="w-4 h-4" />
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        {/* Content Sections */}
        {activeSection === 'overview' && (
          <div className="space-y-8">
            {/* Recent Activity */}
            <Card>
              <h3 className="text-2xl font-bold mb-6">{t('admin.dashboard.recentActivity')}</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-4 glass rounded-lg">
                  <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center">
                    <FolderOpen className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{t('admin.dashboard.portfolioUpdated')}</p>
                    <p className="text-sm text-light/60">{t('admin.dashboard.timeAgo', { time: '2h' })}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 p-4 glass rounded-lg">
                  <div className="w-10 h-10 rounded-full gradient-accent flex items-center justify-center">
                    <Code className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{t('admin.dashboard.newSkills')}</p>
                    <p className="text-sm text-light/60">{t('admin.dashboard.timeAgo', { time: '1d' })}</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Quick Actions */}
            <Card>
              <h3 className="text-2xl font-bold mb-6">{t('admin.dashboard.quickActions')}</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <Button
                  variant="outline"
                  className="justify-start"
                  onClick={() => setActiveSection('projects')}
                >
                  <FolderOpen className="w-4 h-4 mr-2" />
                  {t('admin.dashboard.manageProjects')}
                </Button>
                <Button
                  variant="outline"
                  className="justify-start"
                  onClick={() => setActiveSection('experience')}
                >
                  <Briefcase className="w-4 h-4 mr-2" />
                  {t('admin.dashboard.manageExperience')}
                </Button>
                <Button
                  variant="outline"
                  className="justify-start"
                  onClick={() => setActiveSection('skills')}
                >
                  <Code className="w-4 h-4 mr-2" />
                  {t('admin.dashboard.manageSkills')}
                </Button>
              </div>
            </Card>
          </div>
        )}

        {activeSection === 'projects' && (
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold flex items-center">
                <FolderOpen className="w-6 h-6 mr-2 text-primary" />
                {t('admin.dashboard.projects')} ({projects.length})
              </h3>
              <Button variant="primary" onClick={handleCreateProject}>
                <Plus className="w-4 h-4 mr-2" />
                {t('admin.dashboard.newProject')}
              </Button>
            </div>

            {projects.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                  <div key={project.id} className="glass rounded-lg p-4 space-y-4">
                    {project.imageUrl && (
                      <img
                        src={project.imageUrl}
                        alt={getLocalizedText(project.title, currentLang)}
                        className="w-full h-40 object-cover rounded-lg"
                      />
                    )}
                    <div>
                      <h4 className="font-bold text-lg mb-2">{getLocalizedText(project.title, currentLang)}</h4>
                      <p className="text-sm text-light/70 line-clamp-2">{getLocalizedText(project.description, currentLang)}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.slice(0, 3).map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-1 bg-primary/20 text-primary text-xs rounded-full"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleEditProject(project)}
                      >
                        <Edit className="w-3 h-3 mr-1" />
                        {t('admin.dashboard.edit')}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteProject(project.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FolderOpen className="w-16 h-16 text-light/30 mx-auto mb-4" />
                <p className="text-light/70">{t('admin.dashboard.noProjects')}</p>
                <Button variant="primary" className="mt-4" onClick={handleCreateProject}>
                  <Plus className="w-4 h-4 mr-2" />
                  {t('admin.dashboard.createFirstProject')}
                </Button>
              </div>
            )}
          </Card>
        )}

        {activeSection === 'experience' && (
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold flex items-center">
                <Briefcase className="w-6 h-6 mr-2 text-primary" />
                {t('admin.dashboard.experience')} ({experiences.length})
              </h3>
              <Button variant="primary" onClick={handleCreateExperience}>
                <Plus className="w-4 h-4 mr-2" />
                {t('admin.dashboard.newExperience')}
              </Button>
            </div>

            {experiences.length > 0 ? (
              <div className="space-y-4">
                {experiences.map((exp) => (
                  <div key={exp.id} className="glass rounded-lg p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-bold text-lg gradient-text">{getLocalizedText(exp.role, currentLang)}</h4>
                        <p className="text-light/80 mb-2">{exp.company}</p>
                        <p className="text-sm text-light/60 mb-4">
                          {exp.startDate} - {exp.endDate}
                        </p>
                        <p className="text-light/70 mb-4">{getLocalizedText(exp.description, currentLang)}</p>
                        <div className="flex flex-wrap gap-2">
                          {exp.technologies.map((tech) => (
                            <span
                              key={tech}
                              className="px-3 py-1 bg-primary/20 text-primary text-sm rounded-full"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditExperience(exp)}
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteExperience(exp.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Briefcase className="w-16 h-16 text-light/30 mx-auto mb-4" />
                <p className="text-light/70">{t('admin.dashboard.noExperience')}</p>
                <Button variant="primary" className="mt-4" onClick={handleCreateExperience}>
                  <Plus className="w-4 h-4 mr-2" />
                  {t('admin.dashboard.addExperience')}
                </Button>
              </div>
            )}
          </Card>
        )}

        {activeSection === 'skills' && (
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold flex items-center">
                <Code className="w-6 h-6 mr-2 text-primary" />
                {t('admin.dashboard.skills')} ({skills.length})
              </h3>
              <Button variant="primary" onClick={handleCreateSkill}>
                <Plus className="w-4 h-4 mr-2" />
                {t('admin.dashboard.newSkill')}
              </Button>
            </div>

            {skills.length > 0 ? (
              <div className="space-y-6">
                {['frontend', 'backend', 'database', 'cloud_devops', 'project_management', 'design', 'other'].map((category) => {
                  const categorySkills = skills.filter((s) => s.category === category);
                  if (categorySkills.length === 0) return null;

                  const categoryLabels: Record<string, string> = {
                    frontend: t('admin.skillForm.categories.frontend'),
                    backend: t('admin.skillForm.categories.backend'),
                    database: t('admin.skillForm.categories.database'),
                    cloud_devops: t('admin.skillForm.categories.cloud_devops'),
                    project_management: t('admin.skillForm.categories.project_management'),
                    design: t('admin.skillForm.categories.design'),
                    other: t('admin.skillForm.categories.other'),
                  };

                  return (
                    <div key={category}>
                      <h4 className="text-xl font-bold mb-4 gradient-text">{categoryLabels[category]}</h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        {categorySkills.map((skill) => (
                          <div key={skill.id} className="glass rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                              <span className="font-medium">{skill.name}</span>
                              <div className="flex space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEditSkill(skill)}
                                >
                                  <Edit className="w-3 h-3" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDeleteSkill(skill.id)}
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                            <div className="relative h-2 bg-dark-light rounded-full overflow-hidden">
                              <div
                                className="h-full gradient-primary transition-all duration-500"
                                style={{ width: `${skill.level}%` }}
                              />
                            </div>
                            <p className="text-sm text-light/60 mt-2">{skill.level}% {t('admin.dashboard.mastery')}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <Code className="w-16 h-16 text-light/30 mx-auto mb-4" />
                <p className="text-light/70">{t('admin.dashboard.noSkills')}</p>
                <Button variant="primary" className="mt-4" onClick={handleCreateSkill}>
                  <Plus className="w-4 h-4 mr-2" />
                  {t('admin.dashboard.addSkill')}
                </Button>
              </div>
            )}
          </Card>
        )}
      </main>

      {/* Modals */}
      <ProjectForm
        isOpen={projectFormOpen}
        onClose={() => setProjectFormOpen(false)}
        onSubmit={handleSubmitProject}
        project={editingProject}
        isLoading={isSubmitting}
      />
      <ExperienceForm
        isOpen={experienceFormOpen}
        onClose={() => setExperienceFormOpen(false)}
        onSubmit={handleSubmitExperience}
        experience={editingExperience}
        isLoading={isSubmitting}
      />
      <SkillForm
        isOpen={skillFormOpen}
        onClose={() => setSkillFormOpen(false)}
        onSubmit={handleSubmitSkill}
        skill={editingSkill}
        isLoading={isSubmitting}
      />
    </div>
  );
};
