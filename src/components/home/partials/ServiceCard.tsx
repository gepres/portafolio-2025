import { motion } from 'framer-motion';
import { Card } from '../../ui/Card';
import { staggerItem } from '../../../lib/utils/animations';
import type { Service } from '../../../data/services';

interface ServiceCardProps {
  service: Service;
}

export const ServiceCard = ({ service }: ServiceCardProps) => {
  return (
    <motion.div variants={staggerItem}>
      <Card className="h-full group hover:scale-105 transition-transform duration-300">
        <div className="w-16 h-16 rounded-lg gradient-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
          <service.icon className="w-8 h-8" />
        </div>
        <h4 className="text-xl font-semibold mb-3">{service.title}</h4>
        <p className="text-slate-600 dark:text-light/70">{service.description}</p>
      </Card>
    </motion.div>
  );
};
