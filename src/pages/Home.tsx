import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Code2, Server, Cloud, Download, Briefcase, Mail, MapPin, Send, Copy } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import { Hero } from '../components/home/Hero';
import { AnimatedBackground } from '../components/home/AnimatedBackground';
import { PageTransition } from '../components/layout/PageTransition';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { FadeIn } from '../components/animations/FadeIn';
import { SlideIn } from '../components/animations/SlideIn';
import { ProjectCard } from '../components/projects/ProjectCard';
import { ProjectModal } from '../components/projects/ProjectModal';
import { ProjectFilters } from '../components/projects/ProjectFilters';
import { useProjects } from '../hooks/useProjects';
import { getExperiences, getSkills } from '../lib/firebase/firestore';
import { staggerContainer, staggerItem } from '../lib/utils/animations';
import { formatDate, calculateDuration, copyToClipboard } from '../lib/utils/helpers';
import type { Project, ProjectFilterCategory, Experience, Skill, SkillCategory } from '../types';
import { useTranslation } from 'react-i18next';
import { getLocalizedText } from '../lib/utils/i18n';

const services = [
  {
    icon: Code2,
    title: 'Frontend Development',
    description: 'Desarrollo de interfaces modernas y responsive con React, Next.js y TypeScript',
  },
  {
    icon: Server,
    title: 'Backend Development',
    description: 'APIs robustas y escalables con Node.js, NestJS y bases de datos SQL/NoSQL',
  },
  {
    icon: Cloud,
    title: 'DevOps & Cloud',
    description: 'Infraestructura cloud con AWS, Docker, Kubernetes y CI/CD pipelines',
  },
];

const interests = ['Música', 'Literatura', 'Tecnología', 'Viajes', 'Fotografía'];

const categoryNames: Record<SkillCategory, string> = {
  frontend: 'Frontend Development',
  backend: 'Backend Development',
  database: 'Database',
  cloud_devops: 'Cloud & DevOps',
  project_management: 'Project Management',
  design: 'Design',
  other: 'Otros',
};

const contactSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  subject: z.string().min(3, 'El asunto debe tener al menos 3 caracteres'),
  message: z.string().min(10, 'El mensaje debe tener al menos 10 caracteres'),
});

type ContactFormData = z.infer<typeof contactSchema>;

export const Home = () => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language as 'es' | 'en';
  const { projects, loading: projectsLoading } = useProjects();
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [activeFilter, setActiveFilter] = useState<ProjectFilterCategory>('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [expData, skillsData] = await Promise.all([
          getExperiences(),
          getSkills(),
        ]);
        setExperiences(expData);
        setSkills(skillsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const filteredProjects = activeFilter === 'all'
    ? projects.slice(0, 6)
    : projects.filter((p) => p.category === activeFilter);

  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<SkillCategory, Skill[]>);

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleCopyEmail = async () => {
    const success = await copyToClipboard('contact@example.com');
    if (success) {
      toast.success('Email copiado al portapapeles');
    }
  };

  const onSubmit = async (data: ContactFormData) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log('Form data:', data);
      toast.success('¡Mensaje enviado con éxito!');
      reset();
    } catch (error) {
      toast.error('Error al enviar el mensaje');
    }
  };

  return (
    <PageTransition>
      <AnimatedBackground />

      {/* Hero Section */}
      <Hero />

      {/* About Section */}
      <section id="about" className="relative py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <FadeIn className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold gradient-text mb-4">
              {t('home.about.title')}
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full" />
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <SlideIn direction="left">
              <div className="relative">
                <div className="aspect-square rounded-2xl overflow-hidden glass">
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-9xl font-bold gradient-text">
                    G
                  </div>
                </div>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary to-accent blur-2xl opacity-20 -z-10" />
              </div>
            </SlideIn>

            <SlideIn direction="right">
              <div className="space-y-6 text-slate-600 dark:text-light/90">
                <p className="text-lg leading-relaxed">
                  {t('home.about.bio1')}
                </p>
                <p className="text-lg leading-relaxed">
                  {t('home.about.bio2')}
                </p>
                <p className="text-lg leading-relaxed">
                  {t('home.about.bio3')}
                </p>

                <div className="flex items-center space-x-4 pt-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold gradient-text">3+</div>
                    <div className="text-sm text-slate-500 dark:text-light/60">{t('home.hero.stats.experience')}</div>
                  </div>
                  <div className="w-px h-12 bg-white/20" />
                  <div className="text-center">
                    <div className="text-3xl font-bold gradient-text">20+</div>
                    <div className="text-sm text-slate-500 dark:text-light/60">{t('home.hero.stats.projects')}</div>
                  </div>
                </div>

                <Button variant="primary" className="mt-6">
                  <Download className="w-4 h-4 mr-2" />
                  {t('home.hero.downloadCV')}
                </Button>
              </div>
            </SlideIn>
          </div>

          <FadeIn>
            <h3 className="text-3xl md:text-4xl font-bold text-center mb-12">
              {t('home.about.whatIDo')}
            </h3>
          </FadeIn>

          <motion.div
            className="grid md:grid-cols-3 gap-6 mb-16"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {services.map((service, index) => (
              <motion.div key={index} variants={staggerItem}>
                <Card className="h-full group hover:scale-105 transition-transform duration-300">
                  <div className="w-16 h-16 rounded-lg gradient-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <service.icon className="w-8 h-8" />
                  </div>
                  <h4 className="text-xl font-semibold mb-3">{service.title}</h4>
                  <p className="text-slate-600 dark:text-light/70">{service.description}</p>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          <FadeIn>
            <h3 className="text-3xl md:text-4xl font-bold text-center mb-8">
              {t('home.about.interests')}
            </h3>
            <div className="flex flex-wrap justify-center gap-4">
              {interests.map((interest) => (
                <motion.span
                  key={interest}
                  className="px-6 py-3 glass-hover rounded-full text-primary font-medium cursor-hover"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {interest}
                </motion.span>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Projects Section */}
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
                <h3 className="text-2xl font-bold mb-4">¡Próximamente!</h3>
                <p className="text-slate-600 dark:text-light/70">
                  Estoy trabajando en proyectos increíbles. Visita el panel de admin para agregar tus proyectos.
                </p>
              </div>
            </FadeIn>
          )}
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="relative py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <FadeIn className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold gradient-text mb-4">
              {t('home.experience.title')}
            </h2>
            <p className="text-xl text-slate-600 dark:text-light/70">{t('home.experience.subtitle')}</p>
            <div className="w-20 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full mt-4" />
          </FadeIn>

          {experiences.length > 0 ? (
            <motion.div
              className="relative"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-transparent via-primary to-accent" />

              {experiences.map((exp, index) => (
                <motion.div
                  key={exp.id}
                  variants={staggerItem}
                  className={`relative mb-12 ${
                    index % 2 === 0 ? 'md:pr-1/2 md:text-right' : 'md:pl-1/2 md:ml-auto'
                  }`}
                >
                  <div className="absolute left-8 md:left-1/2 w-4 h-4 bg-primary rounded-full transform -translate-x-1/2 z-10 ring-4 ring-slate-100 dark:ring-slate-900" />

                  <Card className={`ml-16 md:ml-0 ${index % 2 === 0 ? 'md:mr-12' : 'md:ml-12'}`}>
                    <div className="flex items-start space-x-4 mb-4">
                      {exp.logo ? (
                        <img
                          src={exp.logo}
                          alt={exp.company}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center">
                          <Briefcase className="w-6 h-6" />
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="text-xl font-bold gradient-text">{getLocalizedText(exp.role, currentLang)}</h3>
                        <p className="text-primary font-semibold">{exp.company}</p>
                        <p className="text-slate-500 dark:text-light/60 text-sm">
                          {formatDate(exp.startDate)} - {exp.endDate === 'present' ? t('admin.experienceForm.current') : formatDate(exp.endDate)}
                          {' · '}
                          {calculateDuration(exp.startDate, exp.endDate)}
                        </p>
                      </div>
                    </div>

                    <p className="text-slate-600 dark:text-light/70 mb-4">{getLocalizedText(exp.description, currentLang)}</p>

                    {exp.achievements && exp.achievements.length > 0 && (
                      <ul className="space-y-2 mb-4">
                        {exp.achievements.map((achievement, i) => (
                          <li key={i} className="flex items-start space-x-2 text-slate-600 dark:text-light/70 text-sm">
                            <span className="text-primary mt-1">•</span>
                            <span>{getLocalizedText(achievement, currentLang)}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    <div className="flex flex-wrap gap-2">
                      {exp.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1 bg-primary/20 text-primary text-xs rounded-full"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <FadeIn className="text-center py-20">
              <div className="glass rounded-2xl p-12 max-w-md mx-auto">
                <Briefcase className="w-16 h-16 mx-auto mb-4 text-primary" />
                <h3 className="text-2xl font-bold mb-4">Agrega tu Experiencia</h3>
                <p className="text-slate-600 dark:text-light/70 mb-6">
                  Accede al panel de admin para agregar tu experiencia profesional.
                </p>
              </div>
            </FadeIn>
          )}
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="relative py-24 px-4 bg-slate-100/50 dark:bg-dark-light/50">
        <div className="max-w-7xl mx-auto">
          <FadeIn className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold gradient-text mb-4">
              {t('home.skills.title')}
            </h2>
            <p className="text-xl text-slate-600 dark:text-light/70">{t('home.skills.subtitle')}</p>
            <div className="w-20 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full mt-4" />
          </FadeIn>

          {Object.keys(groupedSkills).length > 0 ? (
            <div className="space-y-16">
              {Object.entries(groupedSkills).map(([category, categorySkills]) => (
                <FadeIn key={category}>
                  <h3 className="text-3xl font-bold mb-8 text-center">
                    {categoryNames[category as SkillCategory]}
                  </h3>

                  <motion.div
                    className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                  >
                    {categorySkills.map((skill) => (
                      <motion.div
                        key={skill.id}
                        variants={staggerItem}
                        whileHover={{ scale: 1.05, rotateY: 10 }}
                        style={{ transformStyle: 'preserve-3d' }}
                      >
                        <Card className="h-full">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-lg font-semibold">{skill.name}</h4>
                            <span className="text-3xl">
                              {skill.icon?.includes('devicon-') ? (
                                <i className={`${skill.icon} colored`}></i>
                              ) : (
                                skill.icon
                              )}
                            </span>
                          </div>

                          <div className="mb-3">
                            <div className="flex justify-between text-sm text-slate-500 dark:text-light/60 mb-2">
                              <span>{t('admin.skillForm.level')}</span>
                              <span>{skill.level}%</span>
                            </div>
                            <div className="h-2 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                              <motion.div
                                className="h-full gradient-primary"
                                initial={{ width: 0 }}
                                whileInView={{ width: `${skill.level}%` }}
                                viewport={{ once: true }}
                                transition={{ duration: 1, delay: 0.2 }}
                              />
                            </div>
                          </div>

                          {(skill.yearsOfExperience || skill.projectsCount) && (
                            <div className="flex justify-between text-sm text-slate-500 dark:text-light/60 pt-3 border-t border-white/10">
                              {skill.yearsOfExperience && (
                                <span>{skill.yearsOfExperience}+ años</span>
                              )}
                              {skill.projectsCount && (
                                <span>{skill.projectsCount} proyectos</span>
                              )}
                            </div>
                          )}
                        </Card>
                      </motion.div>
                    ))}
                  </motion.div>
                </FadeIn>
              ))}
            </div>
          ) : (
            <FadeIn className="text-center py-20">
              <div className="glass rounded-2xl p-12 max-w-md mx-auto">
                <Code2 className="w-16 h-16 mx-auto mb-4 text-primary" />
                <h3 className="text-2xl font-bold mb-4">Agrega tus Habilidades</h3>
                <p className="text-slate-600 dark:text-light/70 mb-6">
                  Accede al panel de admin para agregar tus habilidades técnicas.
                </p>
              </div>
            </FadeIn>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="relative py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <FadeIn className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold gradient-text mb-4">
              {t('home.contact.title')}
            </h2>
            <p className="text-xl text-slate-600 dark:text-light/70">
              {t('home.contact.subtitle')}
            </p>
            <div className="w-20 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full mt-4" />
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-12">
            <SlideIn direction="left">
              <div className="space-y-6">
                <div>
                  <h3 className="text-3xl font-bold mb-6">{t('home.contact.info.title')}</h3>
                  <p className="text-slate-600 dark:text-light/70 leading-relaxed mb-8">
                    {t('home.contact.info.description')}
                  </p>
                </div>

                <Card className="flex items-start space-x-4 group cursor-pointer" onClick={handleCopyEmail}>
                  <div className="w-12 h-12 rounded-lg gradient-primary flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">{t('home.contact.info.email')}</h4>
                    <p className="text-slate-600 dark:text-light/70 text-sm flex items-center">
                      contact@example.com
                      <Copy className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </p>
                  </div>
                </Card>

                <Card className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-lg gradient-accent flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">{t('home.contact.info.location')}</h4>
                    <p className="text-slate-600 dark:text-light/70 text-sm">Lima, Perú</p>
                  </div>
                </Card>
              </div>
            </SlideIn>

            <SlideIn direction="right">
              <Card>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {t('home.contact.form.name')}
                    </label>
                    <input
                      {...register('name')}
                      className="w-full px-4 py-3 rounded-lg glass border border-white/10 focus:border-primary focus:outline-none transition-all"
                      placeholder={t('home.contact.form.namePlaceholder')}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {t('home.contact.form.email')}
                    </label>
                    <input
                      {...register('email')}
                      type="email"
                      className="w-full px-4 py-3 rounded-lg glass border border-white/10 focus:border-primary focus:outline-none transition-all"
                      placeholder={t('home.contact.form.emailPlaceholder')}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {t('home.contact.form.subject')}
                    </label>
                    <input
                      {...register('subject')}
                      className="w-full px-4 py-3 rounded-lg glass border border-white/10 focus:border-primary focus:outline-none transition-all"
                      placeholder={t('home.contact.form.subjectPlaceholder')}
                    />
                    {errors.subject && (
                      <p className="text-red-500 text-sm mt-1">{errors.subject.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {t('home.contact.form.message')}
                    </label>
                    <textarea
                      {...register('message')}
                      rows={5}
                      className="w-full px-4 py-3 rounded-lg glass border border-white/10 focus:border-primary focus:outline-none transition-all resize-none"
                      placeholder={t('home.contact.form.messagePlaceholder')}
                    />
                    {errors.message && (
                      <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    isLoading={isSubmitting}
                    className="w-full"
                  >
                    {!isSubmitting && <Send className="w-4 h-4 mr-2" />}
                    {t('home.contact.form.send')}
                  </Button>
                </form>
              </Card>
            </SlideIn>
          </div>
        </div>
      </section>

      {/* Project Modal */}
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
