import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, User } from 'lucide-react';
import { useAuthContext } from '../../context/AuthContext';
import { cn } from '../../lib/utils/helpers';
import ThemeToggle from '../ThemeToggle';
import { LanguageToggle } from '../LanguageToggle';
import { useTranslation } from 'react-i18next';


export const Navbar = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { isAuthenticated } = useAuthContext();

  const navLinks = [
    { name: t('nav.about'), path: '/', hash: '#about', id: 'about' },
    { name: t('nav.projects'), path: '/', hash: '#projects', id: 'projects' },
    { name: t('nav.experience'), path: '/', hash: '#experience', id: 'experience' },
    { name: t('nav.skills'), path: '/', hash: '#skills', id: 'skills' },
    { name: t('nav.contact'), path: '/', hash: '#contact', id: 'contact' },
  ];

  const [activeSection, setActiveSection] = useState<string>('');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      // Scroll spy para activar la sección actual
      const sections = navLinks.map(link => link.id);
      let currentSection = '';

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const rect = element.getBoundingClientRect();
          // Si la sección está visible en el viewport (considerando el offset del navbar)
          if (rect.top <= 100 && rect.bottom >= 100) {
            currentSection = sectionId;
            break;
          }
        }
      }

      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Call once on mount
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const [prevLocation, setPrevLocation] = useState(location);

  if (prevLocation !== location) {
    setPrevLocation(location);
    setIsOpen(false);
  }

  const scrollToSection = (hash: string) => {
    if (location.pathname !== '/') {
      window.location.href = '/' + hash;
      return;
    }
    const id = hash.substring(1);
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, hash: string) => {
    if (hash) {
      e.preventDefault();
      scrollToSection(hash);
    }
  };

  const handleMobileNavClick = (e: React.MouseEvent<HTMLAnchorElement>, hash: string) => {
    e.preventDefault();
    // Cierra el menú primero, luego espera que termine la animación (300ms) antes de hacer scroll
    setIsOpen(false);
    setTimeout(() => scrollToSection(hash), 320);
  };

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (location.pathname === '/') {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      setActiveSection(''); // Reset active section
    }
  };

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-40 transition-all duration-300',
        scrolled ? 'glass shadow-lg' : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" onClick={handleLogoClick} className="flex items-center space-x-2 cursor-hover">
            {/* <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center font-bold text-xl">
              G
            </div>
            <span className="font-bold text-xl gradient-text hidden sm:block">
              Genaro Pretill
            </span> */}
            <img src="/images/logo.svg" alt="Genaro Pretill Logo" className="w-10 h-10" />
            <span className="font-bold text-xl gradient-text hidden sm:block">
              Genaro Pretill
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;

              return (
                <a
                  key={link.name}
                  href={link.path + link.hash}
                  onClick={(e) => handleSmoothScroll(e, link.hash)}
                  className={cn(
                    'px-4 py-2 rounded-lg transition-all duration-300 cursor-hover relative group',
                    isActive
                      ? 'text-slate-900 dark:text-primary'
                      : 'text-slate-600 dark:text-light/80 hover:text-primary'
                  )}
                >
                  {link.name}
                  {isActive && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-secondary"
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                </a>
              );
            })}
          </div>

          {/* Theme Toggle + Admin link (solo si autenticado) */}
          <div className="hidden lg:flex items-center space-x-4">
            <LanguageToggle />
            <ThemeToggle />
            {isAuthenticated && (
              <Link
                to="/admin/dashboard"
                className="px-4 py-2 glass-hover rounded-lg flex items-center space-x-2 cursor-hover"
              >
                <User className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-lg glass-hover cursor-hover"
            aria-label={isOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'}
            aria-expanded={isOpen}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden glass border-t border-white/10"
          >
            <div className="px-4 py-6 space-y-2">
              {navLinks.map((link) => {
                const isActive = activeSection === link.id;

                return (
                  <a
                    key={link.name}
                    href={link.path + link.hash}
                    onClick={(e) => handleMobileNavClick(e, link.hash)}
                    className={cn(
                      'block px-4 py-3 rounded-lg transition-all duration-300 min-h-[48px] flex items-center',
                      isActive
                        ? 'bg-primary/20 text-primary'
                        : 'text-slate-600 dark:text-light/80 hover:bg-white/5'
                    )}
                  >
                    {link.name}
                  </a>
                );
              })}

              {/* Theme and Language Toggles */}
              <div className="flex items-center justify-center space-x-4 pt-4 pb-2 border-t border-white/10 mt-4">
                <LanguageToggle />
                <ThemeToggle />
              </div>

              {isAuthenticated && (
                <Link
                  to="/admin/dashboard"
                  className="block px-4 py-3 rounded-lg bg-primary/20 text-primary text-center min-h-[48px] flex items-center justify-center"
                >
                  Dashboard
                </Link>
              )}
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
