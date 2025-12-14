import { Mail, MapPin, Copy, Phone, MessageCircle, Github, Linkedin, Twitter } from 'lucide-react';
import { Card } from '../../ui/Card';
import { useTranslation } from 'react-i18next';
import { copyToClipboard } from '../../../lib/utils/helpers';
import { getLocalizedText } from '../../../lib/utils/i18n';
import { useContactInfo, useProfile } from '../../../hooks/useCMS';
import { toast } from 'react-hot-toast';

export const ContactInfo = () => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language as 'es' | 'en';
  const { contactInfo } = useContactInfo();
  const { profile } = useProfile();

  const email = contactInfo?.email || 'contact@example.com';
  const location = contactInfo?.location
    ? getLocalizedText(contactInfo.location, currentLang)
    : 'Lima, Perú';
  const phone = contactInfo?.phone;
  const whatsapp = contactInfo?.whatsapp;

  const socialLinks = [
    { icon: Github, href: profile?.socialLinks?.github || '', label: 'GitHub', show: !!profile?.socialLinks?.github },
    { icon: Linkedin, href: profile?.socialLinks?.linkedin || '', label: 'LinkedIn', show: !!profile?.socialLinks?.linkedin },
    { icon: Twitter, href: profile?.socialLinks?.twitter || '', label: 'Twitter', show: !!profile?.socialLinks?.twitter },
  ].filter(link => link.show);

  const handleCopyEmail = async () => {
    const success = await copyToClipboard(email);
    if (success) {
      toast.success('Email copiado al portapapeles');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-3xl font-bold mb-6">{t('home.contact.info.title')}</h3>
        <p className="text-slate-600 dark:text-light/70 leading-relaxed mb-8">
          {t('home.contact.info.description')}
        </p>
      </div>

      <Card className="flex items-start space-x-4 group cursor-pointer" onClick={handleCopyEmail}>
        <div className="w-12 h-12 rounded-lg gradient-primary flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
          <Mail className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold mb-1">{t('home.contact.info.email')}</h4>
          <p className="text-slate-600 dark:text-light/70 text-sm flex items-center">
            {email}
            <Copy className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
          </p>
        </div>
      </Card>

      <Card className="flex items-start space-x-4">
        <div className="w-12 h-12 rounded-lg gradient-accent flex items-center justify-center flex-shrink-0">
          <MapPin className="w-6 h-6" />
        </div>
        <div>
          <h4 className="font-semibold mb-1">{t('home.contact.info.location')}</h4>
          <p className="text-slate-600 dark:text-light/70 text-sm">{location}</p>
        </div>
      </Card>

      {phone && (
        <Card className="flex items-start space-x-4">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center flex-shrink-0">
            <Phone className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-semibold mb-1">{t('home.contact.info.phone')}</h4>
            <a
              href={`tel:${phone}`}
              className="text-slate-600 dark:text-light/70 text-sm hover:text-primary transition-colors"
            >
              {phone}
            </a>
          </div>
        </Card>
      )}

      {whatsapp && (
        <Card className="flex items-start space-x-4 group cursor-pointer" onClick={() => window.open(`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`, '_blank')}>
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
            <MessageCircle className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-semibold mb-1">{t('home.contact.info.whatsapp')}</h4>
            <p className="text-slate-600 dark:text-light/70 text-sm">{whatsapp}</p>
          </div>
        </Card>
      )}

      {socialLinks.length > 0 && (
        <Card className="space-y-3">
          <h4 className="font-semibold">{t('home.contact.info.socialNetworks')}</h4>
          <div className="flex space-x-3">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 glass-hover rounded-lg flex items-center justify-center cursor-hover transition-transform hover:scale-110"
                aria-label={link.label}
                title={link.label}
              >
                <link.icon className="w-6 h-6" />
              </a>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
