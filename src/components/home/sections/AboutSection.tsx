import { motion } from 'framer-motion';
import { Download } from 'lucide-react';
import { FadeIn } from '../../animations/FadeIn';
import { SlideIn } from '../../animations/SlideIn';
import { Button } from '../../ui/Button';
import { ServiceCard } from '../partials/ServiceCard';
import { InterestTag } from '../partials/InterestTag';
import { staggerContainer } from '../../../lib/utils/animations';
import { services } from '../../../data/services';
import { interests } from '../../../data/interests';
import { useTranslation } from 'react-i18next';

export const AboutSection = () => {
  const { t } = useTranslation();

  return (
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
            <ServiceCard key={index} service={service} />
          ))}
        </motion.div>

        <FadeIn>
          <h3 className="text-3xl md:text-4xl font-bold text-center mb-8">
            {t('home.about.interests')}
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            {interests.map((interest) => (
              <InterestTag key={interest} interest={interest} />
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
};
