import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '../ui/Button';
import { BilingualInput } from './BilingualInput';
import type { Competency, BilingualText } from '../../types';
import { useTranslation } from 'react-i18next';

interface CompetencyFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Competency, 'id'>) => Promise<void>;
  competency?: Competency;
  isLoading?: boolean;
}

export const CompetencyForm = ({
  isOpen,
  onClose,
  onSubmit,
  competency,
  isLoading = false,
}: CompetencyFormProps) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<Omit<Competency, 'id'>>({
    name: { es: '', en: '' },
    order: 0,
    active: true,
  });

  useEffect(() => {
    if (competency) {
      setFormData({
        name: competency.name,
        order: competency.order,
        active: competency.active,
      });
    } else {
      setFormData({
        name: { es: '', en: '' },
        order: 0,
        active: true,
      });
    }
  }, [competency]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
    // Limpiar el formulario después de crear exitosamente
    if (!competency) {
      setFormData({
        name: { es: '', en: '' },
        order: 0,
        active: true,
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark/80 backdrop-blur-sm p-4">
      <div className="glass rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 glass border-b border-white/10 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold gradient-text">
            {competency ? t('admin.competencyForm.editTitle') : t('admin.competencyForm.createTitle')}
          </h2>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-lg glass-hover flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <BilingualInput
            label={t('admin.competencyForm.name')}
            value={formData.name as BilingualText}
            onChange={(value) => setFormData(prev => ({ ...prev, name: value }))}
            required
          />

          <div>
            <label className="block text-sm font-medium mb-2">
              {t('admin.competencyForm.order')}
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
              {t('admin.competencyForm.active')}
            </label>
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t border-white/10">
            <Button type="button" variant="outline" onClick={onClose}>
              {t('common.cancel')}
            </Button>
            <Button type="submit" variant="primary" isLoading={isLoading}>
              {competency ? t('common.update') : t('common.create')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
