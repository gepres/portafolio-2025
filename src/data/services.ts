import { Code2, Server, Cloud } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface Service {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const services: Service[] = [
  {
    icon: Code2,
    title: 'Frontend Development',
    description: 'Desarrollo de interfaces modernas y responsive con React, Next.js y TypeScript',
  },
  {
    icon: Server,
    title: 'Backend Development',
    description: 'APIs robustas y escalables con Node.js, NestJS y bases de datos SQL/NoSQL',
  },
  {
    icon: Cloud,
    title: 'DevOps & Cloud',
    description: 'Infraestructura cloud con AWS, Docker, Kubernetes y CI/CD pipelines',
  },
];
