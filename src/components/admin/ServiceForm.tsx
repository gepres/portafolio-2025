import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '../ui/Button';
import { BilingualInput } from './BilingualInput';
import { IconPicker } from './IconPicker';
import type { Service, BilingualText } from '../../types';
import { useTranslation } from 'react-i18next';

interface ServiceFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Service, 'id'>) => Promise<void>;
  service?: Service;
  isLoading?: boolean;
}

export const ServiceForm = ({
  isOpen,
  onClose,
  onSubmit,
  service,
  isLoading = false,
}: ServiceFormProps) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<Omit<Service, 'id'>>({
    icon: '',
    title: { es: '', en: '' },
    description: { es: '', en: '' },
    order: 0,
    active: true,
  });

  useEffect(() => {
    if (service) {
      setFormData({
        icon: service.icon,
        title: service.title,
        description: service.description,
        order: service.order,
        active: service.active,
      });
    } else {
      setFormData({
        icon: '',
        title: { es: '', en: '' },
        description: { es: '', en: '' },
        order: 0,
        active: true,
      });
    }
  }, [service]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
    // Limpiar el formulario después de crear exitosamente
    if (!service) {
      setFormData({
        icon: '',
        title: { es: '', en: '' },
        description: { es: '', en: '' },
        order: 0,
        active: true,
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark/80 backdrop-blur-sm p-4">
      <div className="glass rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 glass border-b border-white/10 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold gradient-text">
            {service ? t('admin.serviceForm.editTitle') : t('admin.serviceForm.createTitle')}
          </h2>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-lg glass-hover flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <IconPicker
            value={formData.icon}
            onChange={(iconName) => setFormData(prev => ({ ...prev, icon: iconName }))}
            label={t('admin.serviceForm.icon')}
          />

          <BilingualInput
            label={t('admin.serviceForm.title')}
            value={formData.title as BilingualText}
            onChange={(value) => setFormData(prev => ({ ...prev, title: value }))}
            required
          />

          <BilingualInput
            label={t('admin.serviceForm.description')}
            value={formData.description as BilingualText}
            onChange={(value) => setFormData(prev => ({ ...prev, description: value }))}
            multiline
            rows={4}
            required
          />

          <div>
            <label className="block text-sm font-medium mb-2">
              {t('admin.serviceForm.order')}
            </label>
            <input
              type="number"
              min="0"
              value={formData.order}
              onChange={(e) => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) }))}
              className="w-full px-4 py-3 rounded-lg glass border border-white/10 focus:border-primary focus:outline-none"
              required
            />
          </div>

          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="active"
              checked={formData.active}
              onChange={(e) => setFormData(prev => ({ ...prev, active: e.target.checked }))}
              className="w-5 h-5 rounded border-white/20 bg-dark-light focus:ring-primary"
            />
            <label htmlFor="active" className="text-sm font-medium cursor-pointer">
              {t('admin.serviceForm.active')}
            </label>
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t border-white/10">
            <Button type="button" variant="outline" onClick={onClose}>
              {t('common.cancel')}
            </Button>
            <Button type="submit" variant="primary" isLoading={isLoading}>
              {service ? t('common.update') : t('common.create')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
