import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Download, Code2, Server, Cloud } from 'lucide-react';
import { PageTransition } from '../components/layout/PageTransition';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { FadeIn } from '../components/animations/FadeIn';
import { SlideIn } from '../components/animations/SlideIn';
import { staggerContainer, staggerItem } from '../lib/utils/animations';

export const About = () => {
  const { t } = useTranslation();

  const services = [
    {
      icon: Code2,
      title: t('about.services.frontend.title'),
      description: t('about.services.frontend.description'),
    },
    {
      icon: Server,
      title: t('about.services.backend.title'),
      description: t('about.services.backend.description'),
    },
    {
      icon: Cloud,
      title: t('about.services.devops.title'),
      description: t('about.services.devops.description'),
    },
  ];

  const interests = [
    t('about.interestsList.music'),
    t('about.interestsList.literature'),
    t('about.interestsList.technology'),
    t('about.interestsList.travel'),
    t('about.interestsList.photography'),
  ];

  return (
    <PageTransition>
      <div className="min-h-screen pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <FadeIn className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold gradient-text mb-4">
              {t('about.title')}
            </h1>
            <div className="w-20 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full" />
          </FadeIn>

          {/* Main Content */}
          <div className="grid md:grid-cols-2 gap-12 mb-16">
            {/* Image */}
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

            {/* Bio */}
            <SlideIn direction="right">
              <div className="space-y-6 text-light/80">
                <p className="text-lg leading-relaxed">
                  {t('about.bio1')}
                </p>
                <p className="text-lg leading-relaxed">
                  {t('about.bio2')}
                </p>
                <p className="text-lg leading-relaxed">
                  {t('about.bio3')}
                </p>

                <div className="flex items-center space-x-4 pt-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold gradient-text">3+</div>
                    <div className="text-sm text-light/60">{t('home.hero.stats.experience')}</div>
                  </div>
                  <div className="w-px h-12 bg-white/20" />
                  <div className="text-center">
                    <div className="text-3xl font-bold gradient-text">20+</div>
                    <div className="text-sm text-light/60">{t('home.hero.stats.projects')}</div>
                  </div>
                </div>

                <Button variant="primary" className="mt-6">
                  <Download className="w-4 h-4 mr-2" />
                  {t('home.hero.downloadCV')}
                </Button>
              </div>
            </SlideIn>
          </div>

          {/* Services */}
          <FadeIn>
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              {t('about.whatIDo')}
            </h2>
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
                  <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                  <p className="text-light/70">{service.description}</p>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Interests */}
          <FadeIn>
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
              {t('about.interests')}
            </h2>
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
      </div>
    </PageTransition>
  );
};
