import { collection, addDoc, getDocs, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { sampleProjects, sampleExperiences, sampleSkills } from './sampleData';

export const seedDatabase = async () => {
  try {
    console.log('🌱 Iniciando carga de datos de ejemplo...');

    // Clear existing data (opcional)
    const clearCollection = async (collectionName: string) => {
      const querySnapshot = await getDocs(collection(db, collectionName));
      const deletePromises = querySnapshot.docs.map((doc) => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
      console.log(`✓ Colección ${collectionName} limpiada`);
    };

    // Limpiar colecciones existentes (opcional - comenta si no quieres borrar datos)
    // await clearCollection('projects');
    // await clearCollection('experiences');
    // await clearCollection('skills');

    // Agregar proyectos
    console.log('📁 Agregando proyectos...');
    const projectPromises = sampleProjects.map((project) =>
      addDoc(collection(db, 'projects'), project)
    );
    await Promise.all(projectPromises);
    console.log(`✓ ${sampleProjects.length} proyectos agregados`);

    // Agregar experiencias
    console.log('💼 Agregando experiencias...');
    const experiencePromises = sampleExperiences.map((experience) =>
      addDoc(collection(db, 'experiences'), {
        ...experience,
        createdAt: new Date(),
      })
    );
    await Promise.all(experiencePromises);
    console.log(`✓ ${sampleExperiences.length} experiencias agregadas`);

    // Agregar habilidades
    console.log('⚡ Agregando habilidades...');
    const skillPromises = sampleSkills.map((skill) =>
      addDoc(collection(db, 'skills'), skill)
    );
    await Promise.all(skillPromises);
    console.log(`✓ ${sampleSkills.length} habilidades agregadas`);

    console.log('✅ ¡Base de datos cargada exitosamente!');
    return { success: true, message: 'Datos de ejemplo cargados correctamente' };
  } catch (error) {
    console.error('❌ Error al cargar datos:', error);
    return { success: false, message: 'Error al cargar datos de ejemplo' };
  }
};

// Función para agregar solo datos faltantes (sin borrar existentes)
export const addSampleData = async () => {
  try {
    console.log('➕ Agregando datos de ejemplo...');

    // Agregar proyectos
    const projectPromises = sampleProjects.map((project) =>
      addDoc(collection(db, 'projects'), project)
    );
    await Promise.all(projectPromises);

    // Agregar experiencias
    const experiencePromises = sampleExperiences.map((experience) =>
      addDoc(collection(db, 'experiences'), {
        ...experience,
        createdAt: new Date(),
      })
    );
    await Promise.all(experiencePromises);

    // Agregar habilidades
    const skillPromises = sampleSkills.map((skill) =>
      addDoc(collection(db, 'skills'), skill)
    );
    await Promise.all(skillPromises);

    console.log('✅ Datos agregados exitosamente');
    return { success: true, message: 'Datos de ejemplo agregados correctamente' };
  } catch (error) {
    console.error('❌ Error al agregar datos:', error);
    return { success: false, message: 'Error al agregar datos de ejemplo' };
  }
};
