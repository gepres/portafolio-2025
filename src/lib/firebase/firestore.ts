import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  setDoc,
  Timestamp,
} from 'firebase/firestore';
import { db } from './config';
import type {
  Project,
  Experience,
  Skill,
  SiteSettings,
  ProfileInfo,
  Service,
  Interest,
  Competency,
  ContactInfo
} from '../../types';

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

// Helper to safely get seconds from Date or Timestamp
const getDateSeconds = (date: Date | Timestamp | undefined): number => {
  if (!date) return 0;
  if ('seconds' in date) {
    return date.seconds;
  }
  return Math.floor(date.getTime() / 1000);
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
        return getDateSeconds(b.createdAt) - getDateSeconds(a.createdAt);
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
      .sort((a, b) => getDateSeconds(b.createdAt) - getDateSeconds(a.createdAt));
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
          const categoryOrder = {
            frontend: 0,
            backend: 1,
            database: 2,
            cloud_devops: 3,
            project_management: 4,
            design: 5,
            other: 6
          };
          return (categoryOrder[a.category] || 99) - (categoryOrder[b.category] || 99);
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

// Profile Information
export const getProfileInfo = async (): Promise<ProfileInfo | null> => {
  try {
    const docRef = doc(db, 'profile', 'main');
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? (docSnap.data() as ProfileInfo) : null;
  } catch (error) {
    console.error('Error fetching profile info:', error);
    return null;
  }
};

export const updateProfileInfo = async (data: Partial<ProfileInfo>) => {
  const docRef = doc(db, 'profile', 'main');
  const cleanedData = cleanUndefined({
    ...data,
    updatedAt: Timestamp.now(),
  });

  try {
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      await updateDoc(docRef, cleanedData);
    } else {
      await setDoc(docRef, { id: 'main', ...cleanedData } as ProfileInfo);
    }
  } catch (error) {
    console.error('Error updating profile info:', error);
    throw error;
  }
};

// Services
export const getServices = async (): Promise<Service[]> => {
  try {
    const snapshot = await getDocs(collection(db, 'services'));
    return snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() } as Service))
      .filter(service => service.active)
      .sort((a, b) => a.order - b.order);
  } catch (error) {
    console.error('Error fetching services:', error);
    return [];
  }
};

export const createService = async (service: Omit<Service, 'id'>) => {
  const docRef = await addDoc(collection(db, 'services'), service);
  return docRef.id;
};

export const updateService = async (id: string, data: Partial<Service>) => {
  const docRef = doc(db, 'services', id);
  await updateDoc(docRef, data);
};

export const deleteService = async (id: string) => {
  await deleteDoc(doc(db, 'services', id));
};

// Interests
export const getInterests = async (): Promise<Interest[]> => {
  try {
    const snapshot = await getDocs(collection(db, 'interests'));
    return snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() } as Interest))
      .filter(interest => interest.active)
      .sort((a, b) => a.order - b.order);
  } catch (error) {
    console.error('Error fetching interests:', error);
    return [];
  }
};

export const createInterest = async (interest: Omit<Interest, 'id'>) => {
  const docRef = await addDoc(collection(db, 'interests'), interest);
  return docRef.id;
};

export const updateInterest = async (id: string, data: Partial<Interest>) => {
  const docRef = doc(db, 'interests', id);
  await updateDoc(docRef, data);
};

export const deleteInterest = async (id: string) => {
  await deleteDoc(doc(db, 'interests', id));
};

// Competencies (Soft Skills)
export const getCompetencies = async (): Promise<Competency[]> => {
  try {
    const snapshot = await getDocs(collection(db, 'competencies'));
    return snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() } as Competency))
      .filter(competency => competency.active)
      .sort((a, b) => a.order - b.order);
  } catch (error) {
    console.error('Error fetching competencies:', error);
    return [];
  }
};

export const createCompetency = async (competency: Omit<Competency, 'id'>) => {
  const docRef = await addDoc(collection(db, 'competencies'), competency);
  return docRef.id;
};

export const updateCompetency = async (id: string, data: Partial<Competency>) => {
  const docRef = doc(db, 'competencies', id);
  await updateDoc(docRef, data);
};

export const deleteCompetency = async (id: string) => {
  await deleteDoc(doc(db, 'competencies', id));
};

// Contact Information
export const getContactInfo = async (): Promise<ContactInfo | null> => {
  try {
    const docRef = doc(db, 'contact', 'main');
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? (docSnap.data() as ContactInfo) : null;
  } catch (error) {
    console.error('Error fetching contact info:', error);
    return null;
  }
};

export const updateContactInfo = async (data: Partial<ContactInfo>) => {
  const docRef = doc(db, 'contact', 'main');
  const cleanedData = cleanUndefined({
    ...data,
    updatedAt: Timestamp.now(),
  });

  try {
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      await updateDoc(docRef, cleanedData);
    } else {
      await setDoc(docRef, { id: 'main', ...cleanedData } as ContactInfo);
    }
  } catch (error) {
    console.error('Error updating contact info:', error);
    throw error;
  }
};
