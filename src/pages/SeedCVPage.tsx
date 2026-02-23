import { useState } from 'react';
import { seedCVData } from '../lib/firebase/seedCVData';
import { SEOHead } from '../components/SEOHead';
import { Database, CheckCircle, XCircle, Loader } from 'lucide-react';

export const SeedCVPage = () => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSeed = async () => {
    setStatus('loading');
    setMessage('Poblando datos del CV en Firestore...');

    try {
      const result = await seedCVData();
      if (result.success) {
        setStatus('success');
        setMessage(result.message || 'Datos del CV poblados correctamente. Ahora puedes ir a /cv');
      } else {
        setStatus('error');
        setMessage('Error al poblar los datos. Revisa la consola.');
      }
    } catch (error) {
      setStatus('error');
      setMessage(`Error: ${error instanceof Error ? error.message : 'Error desconocido'}`);
      console.error('Error seeding CV data:', error);
    }
  };

  return (
    <>
    <SEOHead
      title="Seed CV | Admin"
      description="Admin utility page."
      canonical="https://genaropretill.com/seed-cv"
      noindex={true}
    />
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Database className="w-10 h-10 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Configurar CV
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Agrega educación e idiomas. El CV reutiliza tus datos existentes de experiencia, skills y perfil
          </p>
        </div>

        {status === 'idle' && (
          <button
            onClick={handleSeed}
            className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            <Database className="w-5 h-5" />
            Agregar Educación e Idiomas
          </button>
        )}

        {status === 'loading' && (
          <div className="text-center py-8">
            <Loader className="w-12 h-12 text-blue-600 dark:text-blue-400 animate-spin mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">{message}</p>
          </div>
        )}

        {status === 'success' && (
          <div className="text-center py-8">
            <CheckCircle className="w-16 h-16 text-green-600 dark:text-green-400 mx-auto mb-4" />
            <p className="text-gray-900 dark:text-white font-semibold mb-4">{message}</p>
            <a
              href="/cv"
              className="inline-block py-3 px-6 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all"
            >
              Ver CV
            </a>
          </div>
        )}

        {status === 'error' && (
          <div className="text-center py-8">
            <XCircle className="w-16 h-16 text-red-600 dark:text-red-400 mx-auto mb-4" />
            <p className="text-red-600 dark:text-red-400 font-semibold mb-4">{message}</p>
            <button
              onClick={handleSeed}
              className="py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all"
            >
              Intentar de Nuevo
            </button>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            ¿Qué agrega esta función?
          </h3>
          <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
            <li>✓ Educación (2 títulos académicos)</li>
            <li>✓ Idiomas (Español e Inglés)</li>
          </ul>
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 mt-4">
            Datos reutilizados automáticamente:
          </h3>
          <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
            <li>• Información personal (de Profile y Contact)</li>
            <li>• Experiencia laboral (de Experiences)</li>
            <li>• Soft skills (de Competencias)</li>
            <li>• Technical skills (de Skills)</li>
          </ul>
        </div>
      </div>
    </div>
    </>
  );
};
