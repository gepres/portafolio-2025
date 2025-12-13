import { useTranslation } from 'react-i18next';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
  submitText?: string;
}

export const FormModal = ({
  isOpen,
  onClose,
  title,
  children,
  onSubmit,
  isLoading = false,
  submitText,
}: FormModalProps) => {
  const { t } = useTranslation();
  const actualSubmitText = submitText || t('common.save');

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="xl">
      <form onSubmit={onSubmit}>
        <div className="space-y-6">
          {children}
        </div>
        
        {/* Footer */}
        <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-white/10">
          <Button type="button" variant="outline" onClick={onClose}>
            {t('common.cancel')}
          </Button>
          <Button type="submit" variant="primary" isLoading={isLoading}>
            {actualSubmitText}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
