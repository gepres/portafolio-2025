import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '../ui/Button';
import { BilingualInput } from './BilingualInput';
import type { ProfileInfo, BilingualText } from '../../types';
import { useTranslation } from 'react-i18next';

interface ProfileFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<ProfileInfo>) => Promise<void>;
  profile?: ProfileInfo | null;
  isLoading?: boolean;
}

export const ProfileForm = ({
  isOpen,
  onClose,
  onSubmit,
  profile,
  isLoading = false,
}: ProfileFormProps) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<Partial<ProfileInfo>>({
    fullName: { es: '', en: '' },
    avatarHero: '',
    avatarAbout: '',
    avatarInitial: '',
    title: { es: '', en: '' },
    subtitle: { es: '', en: '' },
    description: { es: '', en: '' },
    bio: {
      paragraph1: { es: '', en: '' },
      paragraph2: { es: '', en: '' },
      paragraph3: { es: '', en: '' },
    },
    stats: {
      yearsOfExperience: 0,
      projectsCompleted: 0,
    },
    socialLinks: {
      github: '',
      linkedin: '',
      twitter: '',
      email: '',
      whatsapp: '',
    },
    cvUrl: '',
  });

  useEffect(() => {
    if (profile) {
      setFormData(profile);
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const updateBilingualField = (
    field: keyof Pick<ProfileInfo, 'fullName' | 'title' | 'subtitle' | 'description'>,
    value: BilingualText
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateBioParagraph = (
    paragraph: keyof ProfileInfo['bio'],
    value: BilingualText
  ) => {
    setFormData(prev => ({
      ...prev,
      bio: {
        ...prev.bio!,
        [paragraph]: value,
      },
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark/80 backdrop-blur-sm p-4">
      <div className="glass rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 glass border-b border-white/10 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold gradient-text">
            {t('admin.profileForm.title')}
          </h2>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-lg glass-hover flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* Basic Info */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">{t('admin.profileForm.basicInfo')}</h3>

            <BilingualInput
              label={t('admin.profileForm.fullName')}
              value={formData.fullName as BilingualText}
              onChange={(value) => updateBilingualField('fullName', value)}
              required
            />

            <div>
              <label className="block text-sm font-medium mb-2">
                {t('admin.profileForm.avatarHero')}
              </label>
              <input
                type="url"
                value={formData.avatarHero || ''}
                onChange={(e) =>
                  setFormData(prev => ({ ...prev, avatarHero: e.target.value }))
                }
                className="w-full px-4 py-3 rounded-lg glass border border-white/10 focus:border-primary focus:outline-none"
                placeholder="https://..."
              />
              <p className="text-xs text-light/60 mt-1">
                {t('admin.profileForm.avatarHeroHelp')}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                {t('admin.profileForm.avatarAbout')}
              </label>
              <input
                type="url"
                value={formData.avatarAbout || ''}
                onChange={(e) =>
                  setFormData(prev => ({ ...prev, avatarAbout: e.target.value }))
                }
                className="w-full px-4 py-3 rounded-lg glass border border-white/10 focus:border-primary focus:outline-none"
                placeholder="https://..."
              />
              <p className="text-xs text-light/60 mt-1">
                {t('admin.profileForm.avatarAboutHelp')}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                {t('admin.profileForm.avatarInitial')}
              </label>
              <input
                type="text"
                maxLength={1}
                value={formData.avatarInitial || ''}
                onChange={(e) =>
                  setFormData(prev => ({ ...prev, avatarInitial: e.target.value.toUpperCase() }))
                }
                className="w-full px-4 py-3 rounded-lg glass border border-white/10 focus:border-primary focus:outline-none"
                placeholder="G"
              />
              <p className="text-xs text-light/60 mt-1">
                {t('admin.profileForm.avatarInitialHelp')}
              </p>
            </div>

            <BilingualInput
              label={t('admin.profileForm.professionalTitle')}
              value={formData.title as BilingualText}
              onChange={(value) => updateBilingualField('title', value)}
              required
            />

            <BilingualInput
              label={t('admin.profileForm.subtitle')}
              value={formData.subtitle as BilingualText}
              onChange={(value) => updateBilingualField('subtitle', value)}
            />

            <BilingualInput
              label={t('admin.profileForm.description')}
              value={formData.description as BilingualText}
              onChange={(value) => updateBilingualField('description', value)}
              multiline
              rows={3}
            />
          </div>

          {/* Bio */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">{t('admin.profileForm.biography')}</h3>

            <BilingualInput
              label={t('admin.profileForm.paragraph1')}
              value={formData.bio?.paragraph1 as BilingualText}
              onChange={(value) => updateBioParagraph('paragraph1', value)}
              multiline
              rows={3}
            />

            <BilingualInput
              label={t('admin.profileForm.paragraph2')}
              value={formData.bio?.paragraph2 as BilingualText}
              onChange={(value) => updateBioParagraph('paragraph2', value)}
              multiline
              rows={3}
            />

            <BilingualInput
              label={t('admin.profileForm.paragraph3')}
              value={formData.bio?.paragraph3 as BilingualText}
              onChange={(value) => updateBioParagraph('paragraph3', value)}
              multiline
              rows={3}
            />
          </div>

          {/* Stats */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">{t('admin.profileForm.statistics')}</h3>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t('admin.profileForm.yearsOfExperience')}
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.stats?.yearsOfExperience || 0}
                  onChange={(e) =>
                    setFormData(prev => ({
                      ...prev,
                      stats: { ...prev.stats!, yearsOfExperience: parseInt(e.target.value) },
                    }))
                  }
                  className="w-full px-4 py-3 rounded-lg glass border border-white/10 focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  {t('admin.profileForm.projectsCompleted')}
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.stats?.projectsCompleted || 0}
                  onChange={(e) =>
                    setFormData(prev => ({
                      ...prev,
                      stats: { ...prev.stats!, projectsCompleted: parseInt(e.target.value) },
                    }))
                  }
                  className="w-full px-4 py-3 rounded-lg glass border border-white/10 focus:border-primary focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">{t('admin.profileForm.socialLinks')}</h3>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">GitHub</label>
                <input
                  type="url"
                  value={formData.socialLinks?.github || ''}
                  onChange={(e) =>
                    setFormData(prev => ({
                      ...prev,
                      socialLinks: { ...prev.socialLinks!, github: e.target.value },
                    }))
                  }
                  className="w-full px-4 py-3 rounded-lg glass border border-white/10 focus:border-primary focus:outline-none"
                  placeholder="https://github.com/username"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">LinkedIn</label>
                <input
                  type="url"
                  value={formData.socialLinks?.linkedin || ''}
                  onChange={(e) =>
                    setFormData(prev => ({
                      ...prev,
                      socialLinks: { ...prev.socialLinks!, linkedin: e.target.value },
                    }))
                  }
                  className="w-full px-4 py-3 rounded-lg glass border border-white/10 focus:border-primary focus:outline-none"
                  placeholder="https://linkedin.com/in/username"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={formData.socialLinks?.email || ''}
                  onChange={(e) =>
                    setFormData(prev => ({
                      ...prev,
                      socialLinks: { ...prev.socialLinks!, email: e.target.value },
                    }))
                  }
                  className="w-full px-4 py-3 rounded-lg glass border border-white/10 focus:border-primary focus:outline-none"
                  placeholder="mailto:your@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">WhatsApp</label>
                <input
                  type="tel"
                  value={formData.socialLinks?.whatsapp || ''}
                  onChange={(e) =>
                    setFormData(prev => ({
                      ...prev,
                      socialLinks: { ...prev.socialLinks!, whatsapp: e.target.value },
                    }))
                  }
                  className="w-full px-4 py-3 rounded-lg glass border border-white/10 focus:border-primary focus:outline-none"
                  placeholder="+51 999 999 999"
                />
              </div>
            </div>
          </div>

          {/* CV URL */}
          <div>
            <label className="block text-sm font-medium mb-2">
              {t('admin.profileForm.cvUrl')}
            </label>
            <input
              type="url"
              value={formData.cvUrl || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, cvUrl: e.target.value }))}
              className="w-full px-4 py-3 rounded-lg glass border border-white/10 focus:border-primary focus:outline-none"
              placeholder="https://..."
            />
          </div>

          {/* Actions */}
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
