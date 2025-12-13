import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Briefcase } from 'lucide-react';
import { FadeIn } from '../../animations/FadeIn';
import { ExperienceCard } from '../partials/ExperienceCard';
import { staggerContainer } from '../../../lib/utils/animations';
import { getExperiences } from '../../../lib/firebase/firestore';
import type { Experience } from '../../../types';
import { useTranslation } from 'react-i18next';

export const ExperienceSection = () => {
  const { t } = useTranslation();
  const [experiences, setExperiences] = useState<Experience[]>([]);

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const expData = await getExperiences();
        setExperiences(expData);
      } catch (error) {
        console.error('Error fetching experiences:', error);
      }
    };

    fetchExperiences();
  }, []);

  return (
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
              <ExperienceCard key={exp.id} experience={exp} index={index} />
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
  );
};
