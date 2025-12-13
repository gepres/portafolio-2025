import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PageTransition } from '../components/layout/PageTransition';
import { FadeIn } from '../components/animations/FadeIn';
import { Card } from '../components/ui/Card';
import { getExperiences } from '../lib/firebase/firestore';
import { formatDate, calculateDuration } from '../lib/utils/helpers';
import type { Experience as ExperienceType } from '../types';
import { staggerContainer, staggerItem } from '../lib/utils/animations';
import { Briefcase } from 'lucide-react';

export const Experience = () => {
  const [experiences, setExperiences] = useState<ExperienceType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const data = await getExperiences();
        setExperiences(data);
      } catch (error) {
        console.error('Error fetching experiences:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExperiences();
  }, []);

  return (
    <PageTransition>
      <div className="min-h-screen pt-24 pb-16 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <FadeIn className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold gradient-text mb-4">
              Experiencia
            </h1>
            <p className="text-xl text-light/70">Mi trayectoria profesional</p>
            <div className="w-20 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full mt-4" />
          </FadeIn>

          {/* Timeline */}
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <motion.div
              className="relative"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {/* Timeline line */}
              <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary to-accent" />

              {experiences.map((exp, index) => (
                <motion.div
                  key={exp.id}
                  variants={staggerItem}
                  className={`relative mb-12 ${
                    index % 2 === 0 ? 'md:pr-1/2 md:text-right' : 'md:pl-1/2 md:ml-auto'
                  }`}
                >
                  {/* Timeline dot */}
                  <div className="absolute left-8 md:left-1/2 w-4 h-4 bg-primary rounded-full transform -translate-x-1/2 z-10 ring-4 ring-slate-900" />

                  {/* Content */}
                  <Card className={`ml-16 md:ml-0 ${index % 2 === 0 ? 'md:mr-12' : 'md:ml-12'}`}>
                    <div className="flex items-start space-x-4 mb-4">
                      {exp.logo ? (
                        <img
                          src={exp.logo}
                          alt={exp.company}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center">
                          <Briefcase className="w-6 h-6" />
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="text-xl font-bold gradient-text">{exp.role}</h3>
                        <p className="text-primary font-semibold">{exp.company}</p>
                        <p className="text-light/60 text-sm">
                          {formatDate(exp.startDate)} - {exp.endDate === 'present' ? 'Presente' : formatDate(exp.endDate)}
                          {' · '}
                          {calculateDuration(exp.startDate, exp.endDate)}
                        </p>
                      </div>
                    </div>

                    <p className="text-light/70 mb-4">{exp.description}</p>

                    {exp.achievements && exp.achievements.length > 0 && (
                      <ul className="space-y-2 mb-4">
                        {exp.achievements.map((achievement, i) => (
                          <li key={i} className="flex items-start space-x-2 text-light/70 text-sm">
                            <span className="text-primary mt-1">•</span>
                            <span>{achievement}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    <div className="flex flex-wrap gap-2">
                      {exp.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1 bg-primary/20 text-primary text-xs rounded-full"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </PageTransition>
  );
};
