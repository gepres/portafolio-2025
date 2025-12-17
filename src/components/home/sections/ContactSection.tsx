import { FadeIn } from '../../animations/FadeIn';
import { SlideIn } from '../../animations/SlideIn';
import { ContactInfo } from '../partials/ContactInfo';
import { ContactForm } from '../partials/ContactForm';
import { useTranslation } from 'react-i18next';

export const ContactSection = () => {
  const { t } = useTranslation();

  return (
    <section id="contact" className="relative py-24 px-4 overflow-x-hidden">
      <div className="max-w-5xl mx-auto">
        <FadeIn className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold gradient-text mb-4">
            {t('home.contact.title')}
          </h2>
          <p className="text-xl text-slate-600 dark:text-light/70">
            {t('home.contact.subtitle')}
          </p>
          <div className="w-20 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full mt-4" />
        </FadeIn>

        <div className="grid md:grid-cols-2 gap-12">
          <SlideIn direction="left">
            <ContactInfo />
          </SlideIn>

          <SlideIn direction="right">
            <ContactForm />
          </SlideIn>
        </div>
      </div>
    </section>
  );
};
