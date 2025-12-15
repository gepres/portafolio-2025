import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';
import { staggerContainer, staggerItem } from '../../lib/utils/animations';
// import { ScrollIndicator } from './ScrollIndicator';
import { useTranslation } from 'react-i18next';
import { useProfile } from '../../hooks/useCMS';
import { getLocalizedText } from '../../lib/utils/i18n';

export const Hero = () => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language as 'es' | 'en';
  const { profile } = useProfile();

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

  const socialLinks = [
    { icon: Github, href: profile?.socialLinks?.github || '#', label: 'GitHub', show: !!profile?.socialLinks?.github },
    { icon: Linkedin, href: profile?.socialLinks?.linkedin || '#', label: 'LinkedIn', show: !!profile?.socialLinks?.linkedin },
    { icon: Mail, href: profile?.socialLinks?.email || 'mailto:contact@example.com', label: 'Email', show: !!profile?.socialLinks?.email },
  ].filter(link => link.show);

  const fullName = profile ? getLocalizedText(profile.fullName, currentLang) : 'Your Name';
  const title = profile ? getLocalizedText(profile.title, currentLang) : t('home.hero.title');
  const subtitle = profile ? getLocalizedText(profile.subtitle, currentLang) : t('home.hero.subtitle');
  const description = profile ? getLocalizedText(profile.description, currentLang) : t('home.hero.description');
  // const avatarInitial = profile?.avatarInitial || 'G';

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
              {profile?.avatarHero ? (
                <img
                  src={profile.avatarHero}
                  alt={fullName}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <div
                  className="w-full h-full rounded-full bg-slate-200 dark:bg-dark-light flex items-center justify-center overflow-hidden"
                  style={{ perspective: '1000px' }}
                >
                  <img
                    src="/images/logo.svg"
                    alt="Logo"
                    className="w-20 h-20 animate-spin3d"
                    style={{ transformStyle: 'preserve-3d' }}
                  />
                </div>
              )}
            </div>
            {/* <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-accent blur-xl opacity-50 animate-pulse-glow" /> */}
          </div>
        </motion.div>

        {/* Greeting */}
        <motion.p
          variants={staggerItem}
          className="text-primary text-lg md:text-xl mb-4 font-medium"
        >
          {t('home.hero.greeting')}
        </motion.p>

        {/* Name */}
        <motion.h1
          variants={staggerItem}
          className="text-5xl md:text-7xl font-bold mb-4 gradient-text"
        >
          {fullName}
        </motion.h1>

        {/* Title */}
        <motion.h2
          variants={staggerItem}
          className="text-2xl md:text-4xl font-semibold text-slate-700 dark:text-light/90 mb-6"
        >
          {title}
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          variants={staggerItem}
          className="text-xl md:text-2xl text-slate-600 dark:text-light/70 mb-8"
        >
          {subtitle}
        </motion.p>

        {/* Description */}
        <motion.p
          variants={staggerItem}
          className="text-lg text-slate-600 dark:text-light/60 max-w-2xl mx-auto mb-12"
        >
          {description}
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
            {t('home.hero.viewProjects')}
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={scrollToContact}
          >
            {t('home.hero.contact')}
          </Button>
        </motion.div>

        {/* Social Links */}
        {socialLinks.length > 0 && (
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
        )}
      </motion.div>

      {/* <ScrollIndicator /> */}
    </section>
  );
};
