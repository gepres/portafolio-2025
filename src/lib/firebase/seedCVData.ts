import {
  createCVEducation,
  createCVLanguage,
} from './cvService';

/**
 * Función para poblar SOLO los datos de Educación e Idiomas del CV en Firestore
 * El resto de los datos (experiencia, skills, etc.) se reutilizan de las colecciones existentes
 *
 * Basado en el CV de Genaro Pretill Escobar
 */
export const seedCVData = async () => {
  try {
    console.log('Iniciando seed de datos del CV (educación e idiomas)...');

    // 1. Education
    const educationData = [
      {
        degree: {
          es: 'INGENIERIA DE SISTEMAS',
          en: 'SYSTEMS ENGINEERING',
        },
        institution: {
          es: 'Univ. San Luis Gonzaga',
          en: 'San Luis Gonzaga University',
        },
        startDate: '2015',
        endDate: '2019',
        order: 0,
      },
      {
        degree: {
          es: 'MATEMATICA E INFORMATICA',
          en: 'MATHEMATICS AND COMPUTER SCIENCE',
        },
        institution: {
          es: 'Univ. San Luis Gonzaga',
          en: 'San Luis Gonzaga University',
        },
        startDate: '2013',
        endDate: '2014',
        order: 1,
      },
    ];

    for (const edu of educationData) {
      await createCVEducation(edu);
    }
    console.log('✓ Educación creada');

    // 2. Languages
    const languagesData = [
      {
        language: {
          es: 'Español',
          en: 'Spanish',
        },
        level: {
          es: 'Nativo',
          en: 'Native',
        },
        order: 0,
      },
      {
        language: {
          es: 'Inglés',
          en: 'English',
        },
        level: {
          es: 'Intermedio',
          en: 'Intermediate',
        },
        order: 1,
      },
    ];

    for (const lang of languagesData) {
      await createCVLanguage(lang);
    }
    console.log('✓ Idiomas creados');

    console.log('✅ Seed de datos del CV completado exitosamente!');
    console.log('ℹ️  El resto de los datos (experiencia, skills, etc.) se obtienen de las colecciones existentes.');

    return {
      success: true,
      message: 'Datos de educación e idiomas creados. El CV usa los datos existentes de experiencia, skills, competencias y perfil.'
    };
  } catch (error) {
    console.error('❌ Error al poblar datos del CV:', error);
    return { success: false, error };
  }
};
