import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Card } from '../../ui/Card';
import { staggerItem } from '../../../lib/utils/animations';
import { getLocalizedText } from '../../../lib/utils/i18n';
import { useTranslation } from 'react-i18next';
import type { Service } from '../../../types';

interface ServiceCardProps {
  service: Service;
}

export const ServiceCard = ({ service }: ServiceCardProps) => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language as 'es' | 'en';

  const title = getLocalizedText(service.title, currentLang);
  const description = getLocalizedText(service.description, currentLang);

  // Get the Lucide icon component by name, fallback to Code2 if not found
  const IconComponent = (Icons as any)[service.icon] || Icons.Code2;

  return (
    <motion.div variants={staggerItem}>
      <Card className="h-full group hover:scale-105 transition-transform duration-300">
        <div className="w-16 h-16 rounded-lg gradient-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform text-white">
          <IconComponent className="w-8 h-8" />
        </div>
        <h4 className="text-xl font-semibold mb-3">{title}</h4>
        <p className="text-slate-600 dark:text-light/70">{description}</p>
      </Card>
    </motion.div>
  );
};
