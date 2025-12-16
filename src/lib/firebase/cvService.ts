import {
  collection,
  doc,
  getDocs,
  updateDoc,
  addDoc,
  deleteDoc,
} from 'firebase/firestore';
import { db } from './config';
import {
  getExperiences,
  getSkills,
  getProfileInfo,
  getContactInfo,
  getCompetencies,
} from './firestore';
import type {
  CVEducation,
  CVLanguage,
  CVData,
} from '../../types';

// Education (solo esta colección es nueva para el CV)
export const getCVEducation = async (): Promise<CVEducation[]> => {
  try {
    const snapshot = await getDocs(collection(db, 'cv_education'));
    return snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() } as CVEducation))
      .sort((a, b) => a.order - b.order);
  } catch (error) {
    console.error('Error fetching CV education:', error);
    return [];
  }
};

export const createCVEducation = async (education: Omit<CVEducation, 'id'>) => {
  const docRef = await addDoc(collection(db, 'cv_education'), education);
  return docRef.id;
};

export const updateCVEducation = async (id: string, data: Partial<CVEducation>) => {
  const docRef = doc(db, 'cv_education', id);
  await updateDoc(docRef, data);
};

export const deleteCVEducation = async (id: string) => {
  await deleteDoc(doc(db, 'cv_education', id));
};

// Languages (solo esta colección es nueva para el CV)
export const getCVLanguages = async (): Promise<CVLanguage[]> => {
  try {
    const snapshot = await getDocs(collection(db, 'cv_languages'));
    return snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() } as CVLanguage))
      .sort((a, b) => a.order - b.order);
  } catch (error) {
    console.error('Error fetching CV languages:', error);
    return [];
  }
};

export const createCVLanguage = async (language: Omit<CVLanguage, 'id'>) => {
  const docRef = await addDoc(collection(db, 'cv_languages'), language);
  return docRef.id;
};

export const updateCVLanguage = async (id: string, data: Partial<CVLanguage>) => {
  const docRef = doc(db, 'cv_languages', id);
  await updateDoc(docRef, data);
};

export const deleteCVLanguage = async (id: string) => {
  await deleteDoc(doc(db, 'cv_languages', id));
};

// Get All CV Data - Reutilizando colecciones existentes
export const getAllCVData = async (): Promise<CVData | null> => {
  try {
    const [
      profileInfo,
      contactInfo,
      education,
      languages,
      softSkills,
      technicalSkills,
      experience
    ] = await Promise.all([
      getProfileInfo(),        // Reutiliza colección 'profile'
      getContactInfo(),        // Reutiliza colección 'contact'
      getCVEducation(),        // Nueva colección 'cv_education'
      getCVLanguages(),        // Nueva colección 'cv_languages'
      getCompetencies(),       // Reutiliza colección 'competencies' (soft skills)
      getSkills(),             // Reutiliza colección 'skills'
      getExperiences(),        // Reutiliza colección 'experiences'
    ]);

    // Verificar que tengamos la información mínima necesaria
    if (!profileInfo && !contactInfo) {
      return null;
    }

    // Helper para convertir BilingualText a string
    const getText = (value: string | { es: string; en: string } | undefined, defaultVal = ''): string => {
      if (!value) return defaultVal;
      return typeof value === 'string' ? value : (value.es || value.en || defaultVal);
    };

    // Combinar los 3 párrafos de bio para crear el summary
    const getBioSummary = (): { es: string; en: string } => {
      if (!profileInfo?.bio) {
        return { es: '', en: '' };
      }

      const { paragraph1, paragraph2, paragraph3 } = profileInfo.bio;

      const getTextValue = (text: string | { es: string; en: string } | undefined): { es: string; en: string } => {
        if (!text) return { es: '', en: '' };
        if (typeof text === 'string') return { es: text, en: text };
        return text;
      };

      const p1 = getTextValue(paragraph1);
      const p2 = getTextValue(paragraph2);
      const p3 = getTextValue(paragraph3);

      return {
        es: [p1.es, p2.es, p3.es].filter(p => p).join(' '),
        en: [p1.en, p2.en, p3.en].filter(p => p).join(' '),
      };
    };

    // Combinar profile y contact para crear personalInfo
    const personalInfo = {
      id: 'main' as const,
      fullName: getText(profileInfo?.fullName, 'Genaro Pretill Escobar'),
      title: profileInfo?.title || { es: '', en: '' },
      summary: getBioSummary(),
      email: contactInfo?.email || '',
      phone: contactInfo?.phone || '',
      location: contactInfo?.location || { es: '', en: '' },
      website: profileInfo?.socialLinks?.website || '',
      updatedAt: profileInfo?.updatedAt || contactInfo?.updatedAt,
    };

    return {
      personalInfo,
      education,
      languages,
      softSkills: softSkills.map(comp => ({
        id: comp.id,
        name: comp.name,
        order: comp.order,
      })),
      technicalSkills: technicalSkills.map((skill, index) => ({
        id: skill.id,
        name: skill.name,
        level: skill.level,
        category: mapSkillCategory(skill.category),
        order: skill.order || index,
      })),
      experience: experience.map((exp, index) => ({
        id: exp.id,
        position: exp.role,
        company: exp.company,
        startDate: exp.startDate,
        endDate: exp.endDate,
        description: exp.description,
        technologies: exp.technologies || [],
        current: exp.current,
        order: exp.order || index,
      })),
    };
  } catch (error) {
    console.error('Error fetching all CV data:', error);
    return null;
  }
};

// Helper para mapear categorías de skills
function mapSkillCategory(category: string): 'frontend' | 'backend' | 'tools' | 'cloud' | 'design' {
  const categoryMap: Record<string, 'frontend' | 'backend' | 'tools' | 'cloud' | 'design'> = {
    'frontend': 'frontend',
    'backend': 'backend',
    'database': 'backend',
    'cloud_devops': 'cloud',
    'project_management': 'tools',
    'design': 'design',
    'other': 'tools',
  };
  return categoryMap[category] || 'tools';
}
