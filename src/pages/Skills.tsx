import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PageTransition } from '../components/layout/PageTransition';
import { FadeIn } from '../components/animations/FadeIn';
import { Card } from '../components/ui/Card';
import { getSkills } from '../lib/firebase/firestore';
import type { Skill, SkillCategory } from '../types';
import { staggerContainer, staggerItem } from '../lib/utils/animations';

const categoryNames: Record<SkillCategory, string> = {
  frontend: 'Frontend Development',
  backend: 'Backend Development',
  database: 'Database',
  cloud_devops: 'Cloud & DevOps',
  project_management: 'Project Management',
  design: 'Design',
  other: 'Otros',
};

export const Skills = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const data = await getSkills();
        setSkills(data);
      } catch (error) {
        console.error('Error fetching skills:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<SkillCategory, Skill[]>);

  return (
    <PageTransition>
      <div className="min-h-screen pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <FadeIn className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold gradient-text mb-4">
              Habilidades
            </h1>
            <p className="text-xl text-light/70">Mi stack tecnológico</p>
            <div className="w-20 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full mt-4" />
          </FadeIn>

          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="space-y-16">
              {Object.entries(groupedSkills).map(([category, categorySkills]) => (
                <FadeIn key={category}>
                  <h2 className="text-3xl font-bold mb-8 text-center">
                    {categoryNames[category as SkillCategory]}
                  </h2>

                  <motion.div
                    className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                  >
                    {categorySkills.map((skill) => (
                      <motion.div
                        key={skill.id}
                        variants={staggerItem}
                        whileHover={{ scale: 1.05, rotateY: 10 }}
                        style={{ transformStyle: 'preserve-3d' }}
                      >
                        <Card className="h-full">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold">{skill.name}</h3>
                            <span className="text-2xl">{skill.icon}</span>
                          </div>

                          {/* Progress bar */}
                          <div className="mb-3">
                            <div className="flex justify-between text-sm text-light/60 mb-2">
                              <span>Nivel</span>
                              <span>{skill.level}%</span>
                            </div>
                            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                              <motion.div
                                className="h-full gradient-primary"
                                initial={{ width: 0 }}
                                whileInView={{ width: `${skill.level}%` }}
                                viewport={{ once: true }}
                                transition={{ duration: 1, delay: 0.2 }}
                              />
                            </div>
                          </div>

                          {(skill.yearsOfExperience || skill.projectsCount) && (
                            <div className="flex justify-between text-sm text-light/60 pt-3 border-t border-white/10">
                              {skill.yearsOfExperience && (
                                <span>{skill.yearsOfExperience}+ años</span>
                              )}
                              {skill.projectsCount && (
                                <span>{skill.projectsCount} proyectos</span>
                              )}
                            </div>
                          )}
                        </Card>
                      </motion.div>
                    ))}
                  </motion.div>
                </FadeIn>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
};
