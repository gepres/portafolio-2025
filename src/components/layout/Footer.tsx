import { Link } from 'react-router-dom';
import { Github, Linkedin, Mail, ArrowUp, Twitter } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useProfile } from '../../hooks/useCMS';
import { getLocalizedText } from '../../lib/utils/i18n';

export const Footer = () => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language as 'es' | 'en';
  const { profile } = useProfile();
  const [showScrollTop, setShowScrollTop] = useState(false);

  const fullName = profile ? getLocalizedText(profile.fullName, currentLang) : 'Your Name';
  const avatarInitial = profile?.avatarInitial || 'G';

  const footerLinks = [
    { name: t('nav.home'), path: '/' },
    { name: t('nav.about'), path: '/about' },
    { name: t('nav.projects'), path: '/projects' },
    { name: t('nav.contact'), path: '/contact' },
  ];

  const socialLinks = [
    { icon: Github, href: profile?.socialLinks?.github || '', label: 'GitHub', show: !!profile?.socialLinks?.github },
    { icon: Linkedin, href: profile?.socialLinks?.linkedin || '', label: 'LinkedIn', show: !!profile?.socialLinks?.linkedin },
    { icon: Twitter, href: profile?.socialLinks?.twitter || '', label: 'Twitter', show: !!profile?.socialLinks?.twitter },
    { icon: Mail, href: profile?.socialLinks?.email || 'mailto:contact@example.com', label: 'Email', show: !!profile?.socialLinks?.email },
  ].filter(link => link.show);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative mt-20 glass border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center font-bold text-xl">
                {avatarInitial}
              </div>
              <span className="font-bold text-xl gradient-text">
                {fullName}
              </span>
            </div>
            <p className="text-slate-600 dark:text-light/60 text-sm">
              {t('footer.description')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">{t('footer.quickLinks')}</h3>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-slate-600 dark:text-light/60 hover:text-primary transition-colors cursor-hover"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-semibold text-lg mb-4">{t('footer.followMe')}</h3>
            {socialLinks.length > 0 ? (
              <div className="flex space-x-4">
                {socialLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 glass-hover rounded-lg flex items-center justify-center cursor-hover transition-transform hover:scale-110"
                    aria-label={link.label}
                  >
                    <link.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-slate-600 dark:text-light/60 text-sm">
                {t('footer.noSocialLinks')}
              </p>
            )}
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-white/10 text-center text-slate-600 dark:text-light/60 text-sm">
          <p>{t('footer.madeWith')}</p>
        </div>
      </div>

      {/* Back to Top Button */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{
          opacity: showScrollTop ? 1 : 0,
          y: showScrollTop ? 0 : 20,
        }}
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 w-12 h-12 gradient-primary rounded-full flex items-center justify-center shadow-lg cursor-hover z-30"
        style={{ pointerEvents: showScrollTop ? 'auto' : 'none' }}
      >
        <ArrowUp className="w-6 h-6" />
      </motion.button>
    </footer>
  );
};
