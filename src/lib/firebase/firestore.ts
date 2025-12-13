import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { db } from './config';
import type { Project, Experience, Skill, SiteSettings } from '../../types';

// Helper function to clean undefined values (Firebase doesn't accept undefined)
const cleanUndefined = <T extends Record<string, any>>(obj: T): T => {
  const cleaned = { ...obj };
  Object.keys(cleaned).forEach(key => {
    if (cleaned[key] === undefined) {
      delete cleaned[key];
    }
  });
  return cleaned;
};

// Projects
export const getProjects = async () => {
  try {
    const snapshot = await getDocs(collection(db, 'projects'));
    return snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() } as Project))
      .sort((a, b) => {
        // Primero los destacados, luego por fecha
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0);
      });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
};

export const getAllProjects = async () => {
  try {
    const snapshot = await getDocs(collection(db, 'projects'));
    return snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() } as Project))
      .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
  } catch (error) {
    console.error('Error fetching all projects:', error);
    return [];
  }
};

export const getProjectById = async (id: string) => {
  const docRef = doc(db, 'projects', id);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? ({ id: docSnap.id, ...docSnap.data() } as Project) : null;
};

export const createProject = async (project: Omit<Project, 'id'>) => {
  console.log('project', project);
  const cleanedProject = cleanUndefined({
    ...project,
    createdAt: project.createdAt || Timestamp.now(),
  });
  const docRef = await addDoc(collection(db, 'projects'), cleanedProject);
  return docRef.id;
};

export const updateProject = async (id: string, data: Partial<Project>) => {
  const docRef = doc(db, 'projects', id);
  const cleanedData = cleanUndefined(data);
  await updateDoc(docRef, cleanedData);
};

export const deleteProject = async (id: string) => {
  await deleteDoc(doc(db, 'projects', id));
};

// Helper function to parse date strings like "Abril 2020" or "April 2020"
const parseDateString = (dateStr: string): number => {
  if (dateStr.toLowerCase() === 'presente' || dateStr.toLowerCase() === 'present') {
    return Date.now(); // Current date for "Presente"
  }

  const monthMap: { [key: string]: number } = {
    // Spanish
    'enero': 0, 'febrero': 1, 'marzo': 2, 'abril': 3, 'mayo': 4, 'junio': 5,
    'julio': 6, 'agosto': 7, 'septiembre': 8, 'setiembre': 8, 'octubre': 9, 'noviembre': 10, 'diciembre': 11,
    // English
    'january': 0, 'february': 1, 'march': 2, 'april': 3, 'may': 4, 'june': 5,
    'july': 6, 'august': 7, 'september': 8, 'october': 9, 'november': 10, 'december': 11,
  };

  const parts = dateStr.trim().split(' ');
  if (parts.length !== 2) return 0;

  const month = monthMap[parts[0].toLowerCase()];
  const year = parseInt(parts[1], 10);

  if (month === undefined || isNaN(year)) return 0;

  return new Date(year, month).getTime();
};

// Experience
export const getExperiences = async () => {
  try {
    const snapshot = await getDocs(collection(db, 'experiences'));
    return snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() } as Experience))
      .sort((a, b) => {
        // Primero: trabajos actuales (Presente)
        const aIsPresent = a.endDate.toLowerCase() === 'presente' || a.endDate.toLowerCase() === 'present' || a.current;
        const bIsPresent = b.endDate.toLowerCase() === 'presente' || b.endDate.toLowerCase() === 'present' || b.current;

        if (aIsPresent && !bIsPresent) return -1;
        if (!aIsPresent && bIsPresent) return 1;

        // Después: ordenar por fecha de inicio, más reciente primero
        const dateA = parseDateString(a.startDate);
        const dateB = parseDateString(b.startDate);
        return dateB - dateA; // Descendente (más reciente primero)
      });
  } catch (error) {
    console.error('Error fetching experiences:', error);
    return [];
  }
};

export const createExperience = async (experience: Omit<Experience, 'id' | 'createdAt'>) => {
  const docRef = await addDoc(collection(db, 'experiences'), {
    ...experience,
    createdAt: Timestamp.now(),
  });
  return docRef.id;
};

export const updateExperience = async (id: string, data: Partial<Experience>) => {
  const docRef = doc(db, 'experiences', id);
  await updateDoc(docRef, data);
};

export const deleteExperience = async (id: string) => {
  await deleteDoc(doc(db, 'experiences', id));
};

// Skills
export const getSkills = async () => {
  try {
    const snapshot = await getDocs(collection(db, 'skills'));
    return snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() } as Skill))
      .sort((a, b) => {
        // Ordenar por categoría primero, luego por nivel
        if (a.category !== b.category) {
          const categoryOrder = { Frontend: 0, Backend: 1, DevOps: 2, Other: 3 };
          return categoryOrder[a.category] - categoryOrder[b.category];
        }
        return b.level - a.level; // Mayor nivel primero
      });
  } catch (error) {
    console.error('Error fetching skills:', error);
    return [];
  }
};

export const createSkill = async (skill: Omit<Skill, 'id'>) => {
  const docRef = await addDoc(collection(db, 'skills'), skill);
  return docRef.id;
};

export const updateSkill = async (id: string, data: Partial<Skill>) => {
  const docRef = doc(db, 'skills', id);
  await updateDoc(docRef, data);
};

export const deleteSkill = async (id: string) => {
  await deleteDoc(doc(db, 'skills', id));
};

// Settings
export const getSettings = async () => {
  const docRef = doc(db, 'settings', 'main');
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? (docSnap.data() as SiteSettings) : null;
};

export const updateSettings = async (data: Partial<SiteSettings>) => {
  const docRef = doc(db, 'settings', 'main');
  await updateDoc(docRef, {
    ...data,
    updatedAt: Timestamp.now(),
  });
};
