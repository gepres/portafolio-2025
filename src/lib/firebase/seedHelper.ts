import { seedCVData } from './seedCVData';

/**
 * Helper para ejecutar el seed desde la consola del navegador
 *
 * Para usar:
 * 1. Abre la consola del navegador (F12)
 * 2. Ejecuta: (window as any).seedCV()
 */
if (typeof window !== 'undefined') {
  (window as any).seedCV = async () => {
    console.log('🌱 Iniciando seed de datos del CV...');
    const result = await seedCVData();
    if (result.success) {
      console.log('✅ Seed completado:', result.message);
    } else {
      console.error('❌ Error en seed:', result.error);
    }
    return result;
  };
}

export { seedCVData };
