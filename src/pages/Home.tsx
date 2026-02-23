import { useEffect, useState } from 'react';
import { SEOHead } from '../components/SEOHead';
import { Hero } from '../components/home/Hero';
import { AnimatedBackground } from '../components/home/AnimatedBackground';
import { PageTransition } from '../components/layout/PageTransition';
import { AboutSection } from '../components/home/sections/AboutSection';
import { ProjectsSection } from '../components/home/sections/ProjectsSection';
import { ExperienceSection } from '../components/home/sections/ExperienceSection';
import { SkillsSection } from '../components/home/sections/SkillsSection';
import { ContactSection } from '../components/home/sections/ContactSection';
import { Loader } from '../components/ui/Loader';
import { useProfile, useServices, useCompetencies, useInterests, useContactInfo } from '../hooks/useCMS';
import { useProjects } from '../hooks/useProjects';
import { getExperiences, getSkills } from '../lib/firebase/firestore';

export const Home = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { loading: profileLoading } = useProfile();
  const { loading: servicesLoading } = useServices();
  const { loading: competenciesLoading } = useCompetencies();
  const { loading: interestsLoading } = useInterests();
  const { loading: contactLoading } = useContactInfo();
  const { loading: projectsLoading } = useProjects();
  const [experiencesLoading, setExperiencesLoading] = useState(true);
  const [skillsLoading, setSkillsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          getExperiences(),
          getSkills(),
        ]);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setExperiencesLoading(false);
        setSkillsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Verificar si todos los datos han terminado de cargar
    const allLoaded = !profileLoading &&
      !servicesLoading &&
      !competenciesLoading &&
      !interestsLoading &&
      !contactLoading &&
      !projectsLoading &&
      !experiencesLoading &&
      !skillsLoading;

    if (allLoaded) {
      // Pequeño delay para mejor experiencia de usuario
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [
    profileLoading,
    servicesLoading,
    competenciesLoading,
    interestsLoading,
    contactLoading,
    projectsLoading,
    experiencesLoading,
    skillsLoading
  ]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <PageTransition>
      <SEOHead
        title="Genaro Pretill | Full Stack Developer — React, Vue.js & NestJS"
        description="Full Stack Developer especializado en React.js, Vue.js, NestJS, TypeScript y arquitecturas modernas. Ver proyectos y experiencia."
        canonical="https://genaropretill.com/"
      />
      <AnimatedBackground />
      <Hero />
      <AboutSection />
      <ProjectsSection />
      <ExperienceSection />
      <SkillsSection />
      <ContactSection />
    </PageTransition>
  );
};
