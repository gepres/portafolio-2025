import { Timestamp } from 'firebase/firestore';

// Bilingual text support
export interface BilingualText {
  es: string;
  en: string;
}

export interface Project {
  id: string;
  title: string | BilingualText;
  description: string | BilingualText;
  longDescription?: string | BilingualText | null;
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
  role: string | BilingualText;
  startDate: string;
  endDate: string;
  description: string | BilingualText;
  achievements?: (string | BilingualText)[];
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

// Profile Information
export interface ProfileInfo {
  id: 'main';
  fullName: string | BilingualText;
  avatarHero?: string; // Avatar para la sección Hero (circular pequeño)
  avatarAbout?: string; // Avatar para la sección About (cuadrado grande)
  avatarInitial?: string; // Letra inicial como fallback
  title: string | BilingualText;
  subtitle: string | BilingualText;
  description: string | BilingualText;
  bio: {
    paragraph1: string | BilingualText;
    paragraph2: string | BilingualText;
    paragraph3: string | BilingualText;
  };
  stats: {
    yearsOfExperience: number;
    projectsCompleted: number;
  };
  socialLinks: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    email?: string;
    whatsapp?: string;
  };
  cvUrl?: string;
  updatedAt?: Timestamp;
}

// Service Offered
export interface Service {
  id: string;
  icon: string; // devicon class or emoji
  title: string | BilingualText;
  description: string | BilingualText;
  order: number;
  active: boolean;
}

// Interest
export interface Interest {
  id: string;
  name: string | BilingualText;
  order: number;
  active: boolean;
}

// Competency (Soft Skills)
export interface Competency {
  id: string;
  name: string | BilingualText;
  order: number;
  active: boolean;
}

// Contact Information
export interface ContactInfo {
  id: 'main';
  email: string;
  location: string | BilingualText;
  phone?: string;
  whatsapp?: string;
  updatedAt?: Timestamp;
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
