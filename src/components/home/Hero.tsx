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
          <div className="relative w-40 h-40">
            {profile?.avatarHero ? (
              <div className="w-full h-full rounded-full overflow-hidden glass border-2 border-transparent bg-gradient-to-r from-primary to-accent p-1">
                <img
                  src={profile.avatarHero}
                  alt={fullName}
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
            ) : (
              <>
                {/* Glow effect background */}
                <motion.div
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-primary via-accent to-primary blur-2xl opacity-40"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.4, 0.6, 0.4],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />

                {/* Outer rotating ring */}
                <motion.div
                  className="absolute inset-0"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <div className="absolute top-0 left-1/2 w-3 h-3 bg-primary rounded-full -translate-x-1/2 shadow-lg shadow-primary/50" />
                  <div className="absolute bottom-0 left-1/2 w-3 h-3 bg-accent rounded-full -translate-x-1/2 shadow-lg shadow-accent/50" />
                  <div className="absolute left-0 top-1/2 w-2 h-2 bg-primary rounded-full -translate-y-1/2 shadow-md shadow-primary/50" />
                  <div className="absolute right-0 top-1/2 w-2 h-2 bg-accent rounded-full -translate-y-1/2 shadow-md shadow-accent/50" />
                </motion.div>

                {/* Inner counter-rotating ring */}
                <motion.div
                  className="absolute inset-4"
                  animate={{ rotate: -360 }}
                  transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                >
                  <div className="absolute top-0 left-1/2 w-2 h-2 bg-accent/70 rounded-full -translate-x-1/2" />
                  <div className="absolute bottom-0 left-1/2 w-2 h-2 bg-primary/70 rounded-full -translate-x-1/2" />
                </motion.div>

                {/* Code symbol container */}
                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  style={{ perspective: '1000px' }}
                >
                  <motion.div
                    className="text-6xl font-bold gradient-text"
                    style={{ transformStyle: 'preserve-3d' }}
                    animate={{
                      rotateY: [0, 360],
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      rotateY: {
                        duration: 8,
                        repeat: Infinity,
                        ease: "linear"
                      },
                      scale: {
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }
                    }}
                  >
                    &lt;/&gt;
                  </motion.div>
                </motion.div>

                {/* Floating particles */}
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-primary/60 rounded-full"
                    style={{
                      left: '50%',
                      top: '50%',
                    }}
                    animate={{
                      x: [0, Math.cos(i * 60 * Math.PI / 180) * 80, 0],
                      y: [0, Math.sin(i * 60 * Math.PI / 180) * 80, 0],
                      opacity: [0, 1, 0],
                      scale: [0, 1.5, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: i * 0.5,
                      ease: "easeInOut"
                    }}
                  />
                ))}
              </>
            )}
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
