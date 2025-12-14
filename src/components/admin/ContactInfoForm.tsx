import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '../ui/Button';
import { BilingualInput } from './BilingualInput';
import type { ContactInfo, BilingualText } from '../../types';
import { useTranslation } from 'react-i18next';

interface ContactInfoFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<ContactInfo>) => Promise<void>;
  contactInfo?: ContactInfo | null;
  isLoading?: boolean;
}

export const ContactInfoForm = ({
  isOpen,
  onClose,
  onSubmit,
  contactInfo,
  isLoading = false,
}: ContactInfoFormProps) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<Partial<ContactInfo>>({
    email: '',
    location: { es: '', en: '' },
    phone: '',
    whatsapp: '',
  });

  useEffect(() => {
    if (contactInfo) {
      setFormData(contactInfo);
    }
  }, [contactInfo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark/80 backdrop-blur-sm p-4">
      <div className="glass rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 glass border-b border-white/10 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold gradient-text">
            {t('admin.contactInfoForm.title')}
          </h2>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-lg glass-hover flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              {t('admin.contactInfoForm.email')}
            </label>
            <input
              type="email"
              value={formData.email || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="w-full px-4 py-3 rounded-lg glass border border-white/10 focus:border-primary focus:outline-none"
              placeholder="contact@example.com"
              required
            />
          </div>

          <BilingualInput
            label={t('admin.contactInfoForm.location')}
            value={formData.location as BilingualText}
            onChange={(value) => setFormData(prev => ({ ...prev, location: value }))}
            required
          />

          <div>
            <label className="block text-sm font-medium mb-2">
              {t('admin.contactInfoForm.phone')}
            </label>
            <input
              type="tel"
              value={formData.phone || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              className="w-full px-4 py-3 rounded-lg glass border border-white/10 focus:border-primary focus:outline-none"
              placeholder="+51 999 999 999"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              {t('admin.contactInfoForm.whatsapp')}
            </label>
            <input
              type="tel"
              value={formData.whatsapp || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, whatsapp: e.target.value }))}
              className="w-full px-4 py-3 rounded-lg glass border border-white/10 focus:border-primary focus:outline-none"
              placeholder="+51 999 999 999"
            />
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t border-white/10">
            <Button type="button" variant="outline" onClick={onClose}>
              {t('common.cancel')}
            </Button>
            <Button type="submit" variant="primary" isLoading={isLoading}>
              {t('common.save')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
