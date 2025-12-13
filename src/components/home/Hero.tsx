import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';
import { staggerContainer, staggerItem } from '../../lib/utils/animations';
import { ScrollIndicator } from './ScrollIndicator';

const socialLinks = [
  { icon: Github, href: 'https://github.com', label: 'GitHub' },
  { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
  { icon: Mail, href: 'mailto:contact@example.com', label: 'Email' },
];

export const Hero = () => {
  const scrollToProjects = () => {
    const projectsSection = document.getElementById('projects');
    if (projectsSection) {
      const offset = 80;
      const elementPosition = projectsSection.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      const offset = 80;
      const elementPosition = contactSection.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 pt-16">
      <motion.div
        className="max-w-5xl mx-auto text-center"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {/* Avatar */}
        <motion.div variants={staggerItem} className="mb-8 flex justify-center">
          <div className="relative">
            <div className="w-32 h-32 rounded-full overflow-hidden glass border-2 border-transparent bg-gradient-to-r from-primary to-accent p-1">
              <div className="w-full h-full rounded-full bg-dark-light flex items-center justify-center text-6xl font-bold gradient-text">
                G
              </div>
            </div>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-accent blur-xl opacity-50 animate-pulse-glow" />
          </div>
        </motion.div>

        {/* Greeting */}
        <motion.p
          variants={staggerItem}
          className="text-primary text-lg md:text-xl mb-4 font-medium"
        >
          Hola, soy
        </motion.p>

        {/* Name */}
        <motion.h1
          variants={staggerItem}
          className="text-5xl md:text-7xl font-bold mb-4 gradient-text"
        >
          Genaro Pretill
        </motion.h1>

        {/* Title */}
        <motion.h2
          variants={staggerItem}
          className="text-2xl md:text-4xl font-semibold text-light/90 mb-6"
        >
          Full Stack Developer
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          variants={staggerItem}
          className="text-xl md:text-2xl text-light/70 mb-8"
        >
          React & Node.js Specialist
        </motion.p>

        {/* Description */}
        <motion.p
          variants={staggerItem}
          className="text-lg text-light/60 max-w-2xl mx-auto mb-12"
        >
          Apasionado por crear experiencias web modernas, escalables y de alto rendimiento.
          Especializado en arquitecturas cloud-native y desarrollo full stack.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={staggerItem}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
        >
          <Button
            variant="primary"
            size="lg"
            onClick={scrollToProjects}
            className="group"
          >
            Ver Proyectos
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={scrollToContact}
          >
            Contactar
          </Button>
        </motion.div>

        {/* Social Links */}
        <motion.div
          variants={staggerItem}
          className="flex justify-center space-x-6"
        >
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 glass-hover rounded-full flex items-center justify-center cursor-hover transition-all hover:scale-110 hover:glow"
              aria-label={link.label}
            >
              <link.icon className="w-5 h-5" />
            </a>
          ))}
        </motion.div>
      </motion.div>

      <ScrollIndicator />
    </section>
  );
};
