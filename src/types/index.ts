import { Timestamp } from 'firebase/firestore';

export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string | null;
  category: ProjectCategory;
  technologies: string[];
  imageUrl?: string | null;
  demoUrl?: string | null;
  githubUrl?: string | null;
  clientId?: string | null; // ID de la experiencia/empresa relacionada
  featured: boolean;
  createdAt: Date | Timestamp;
}

export interface Experience {
  id: string;
  company: string;
  logo?: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string;
  achievements?: string[];
  technologies: string[];
  current: boolean;
  order?: number;
  createdAt?: Timestamp;
}

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  level: number;
  icon: string;
  yearsOfExperience?: number;
  projectsCount?: number;
  order: number;
}

export interface SiteSettings {
  id: 'main';
  siteTitle: string;
  aboutBio: string;
  cvUrl?: string;
  socialLinks: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    email?: string;
    whatsapp?: string;
  };
  contactEmail: string;
  theme: 'dark' | 'light' | 'auto';
  updatedAt: Timestamp;
}

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// Categorías de proyectos (sin 'all' - solo para proyectos individuales)
export type ProjectCategory = 'frontend' | 'backend' | 'fullstack' | 'mobile';

// Tipo para filtros de proyectos (incluye 'all')
export type ProjectFilterCategory = 'all' | ProjectCategory;

export type SkillCategory = 'frontend' | 'backend' | 'database' | 'cloud_devops' | 'project_management' | 'design' | 'other';
