import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from './config';
import type { ProjectCategory } from '../../types';

/**
 * Migración para actualizar categorías antiguas de proyectos
 *
 * Mapeo de categorías antiguas a nuevas:
 * - 'web' -> 'frontend'
 * - 'desktop' -> 'fullstack'
 * - 'other' -> 'fullstack'
 */
export const migrateProjectCategories = async () => {
  try {
    const snapshot = await getDocs(collection(db, 'projects'));
    const categoryMap: Record<string, ProjectCategory> = {
      'web': 'frontend',
      'desktop': 'fullstack',
      'other': 'fullstack',
      // Las categorías válidas se mantienen
      'frontend': 'frontend',
      'backend': 'backend',
      'fullstack': 'fullstack',
      'mobile': 'mobile',
    };

    let migratedCount = 0;
    const updates: Promise<void>[] = [];

    snapshot.docs.forEach((docSnapshot) => {
      const data = docSnapshot.data();
      const currentCategory = data.category;

      // Si la categoría no es válida o necesita migración
      if (currentCategory && categoryMap[currentCategory]) {
        const newCategory = categoryMap[currentCategory];

        // Solo actualizar si la categoría cambió
        if (currentCategory !== newCategory) {
          console.log(`Migrando proyecto "${data.title}": ${currentCategory} -> ${newCategory}`);
          updates.push(
            updateDoc(doc(db, 'projects', docSnapshot.id), {
              category: newCategory
            })
          );
          migratedCount++;
        }
      } else {
        console.warn(`Proyecto "${data.title}" tiene categoría inválida: ${currentCategory}`);
      }
    });

    await Promise.all(updates);

    return {
      success: true,
      message: `Migración completada. ${migratedCount} proyectos actualizados.`,
      migratedCount
    };
  } catch (error) {
    console.error('Error en migración:', error);
    return {
      success: false,
      message: 'Error al migrar categorías de proyectos',
      migratedCount: 0
    };
  }
};

/**
 * Función de diagnóstico para ver las categorías actuales
 */
export const diagnosticProjectCategories = async () => {
  try {
    const snapshot = await getDocs(collection(db, 'projects'));
    const categories: Record<string, number> = {};

    snapshot.docs.forEach((docSnapshot) => {
      const data = docSnapshot.data();
      const category = data.category || 'undefined';
      categories[category] = (categories[category] || 0) + 1;
    });

    console.log('Categorías encontradas en la base de datos:');
    Object.entries(categories).forEach(([cat, count]) => {
      console.log(`  ${cat}: ${count} proyecto(s)`);
    });

    return categories;
  } catch (error) {
    console.error('Error en diagnóstico:', error);
    return {};
  }
};
