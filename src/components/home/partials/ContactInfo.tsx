import { Mail, MapPin, Copy } from 'lucide-react';
import { Card } from '../../ui/Card';
import { useTranslation } from 'react-i18next';
import { copyToClipboard } from '../../../lib/utils/helpers';
import { toast } from 'react-hot-toast';

export const ContactInfo = () => {
  const { t } = useTranslation();

  const handleCopyEmail = async () => {
    const success = await copyToClipboard('contact@example.com');
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
            contact@example.com
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
          <p className="text-slate-600 dark:text-light/70 text-sm">Lima, Perú</p>
        </div>
      </Card>
    </div>
  );
};
