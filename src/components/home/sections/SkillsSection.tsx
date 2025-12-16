import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Code2 } from 'lucide-react';
import { FadeIn } from '../../animations/FadeIn';
import { SkillCard } from '../partials/SkillCard';
import { staggerContainer } from '../../../lib/utils/animations';
import { getSkills } from '../../../lib/firebase/firestore';
import { categoryNames } from '../../../data/skillCategories';
import type { Skill, SkillCategory } from '../../../types';
import { useTranslation } from 'react-i18next';

export const SkillsSection = () => {
  const { t } = useTranslation();
  const [skills, setSkills] = useState<Skill[]>([]);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const skillsData = await getSkills();
        setSkills(skillsData);
      } catch (error) {
        console.error('Error fetching skills:', error);
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

  const categoryOrder: SkillCategory[] = [
    'frontend',
    'backend',
    'database',
    'cloud_devops',
    'project_management'
  ];

  const orderedCategories = categoryOrder.filter(category => groupedSkills[category]);

  return (
    <section id="skills" className="relative py-24 px-4 bg-slate-100/50 dark:bg-dark-light/50">
      <div className="max-w-7xl mx-auto">
        <FadeIn className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold gradient-text mb-4">
            {t('home.skills.title')}
          </h2>
          {/* <p className="text-xl text-slate-600 dark:text-light/70">{t('home.skills.subtitle')}</p> */}
          <div className="w-20 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full mt-4" />
        </FadeIn>

        {Object.keys(groupedSkills).length > 0 ? (
          <div className="space-y-16">
            {orderedCategories.map((category) => (
              <FadeIn key={category}>
                <h3 className="text-3xl font-bold mb-8 text-center">
                  {categoryNames[category as SkillCategory]}
                </h3>

                <motion.div
                  className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  {groupedSkills[category].map((skill) => (
                    <SkillCard key={skill.id} skill={skill} />
                  ))}
                </motion.div>
              </FadeIn>
            ))}
          </div>
        ) : (
          <FadeIn className="text-center py-20">
            <div className="glass rounded-2xl p-12 max-w-md mx-auto">
              <Code2 className="w-16 h-16 mx-auto mb-4 text-primary" />
              <h3 className="text-2xl font-bold mb-4">{t('home.skills.addSkills')}</h3>
              <p className="text-slate-600 dark:text-light/70 mb-6">
                {t('home.skills.addSkillsDesc')}
              </p>
            </div>
          </FadeIn>
        )}
      </div>
    </section>
  );
};
