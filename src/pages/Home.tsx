import { Hero } from '../components/home/Hero';
import { AnimatedBackground } from '../components/home/AnimatedBackground';
import { PageTransition } from '../components/layout/PageTransition';
import { AboutSection } from '../components/home/sections/AboutSection';
import { ProjectsSection } from '../components/home/sections/ProjectsSection';
import { ExperienceSection } from '../components/home/sections/ExperienceSection';
import { SkillsSection } from '../components/home/sections/SkillsSection';
import { ContactSection } from '../components/home/sections/ContactSection';

export const Home = () => {
  return (
    <PageTransition>
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
