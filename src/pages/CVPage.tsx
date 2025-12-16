import { useCV } from '../hooks/useCV';
import { CVTemplate } from '../components/CV/CVTemplate';
import { CVPDFGenerator } from '../components/CV/CVPDFGenerator';
import ThemeToggle from '../components/ThemeToggle';
import { LanguageToggle } from '../components/LanguageToggle';
import { Loader } from '../components/ui/Loader';
import { FileText } from 'lucide-react';

export const CVPage = () => {
  const { cvData, loading, error } = useCV();

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Error al cargar el CV</h2>
          <p className="text-gray-600 dark:text-gray-400">{error.message}</p>
        </div>
      </div>
    );
  }

  if (!cvData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No se encontró información del CV</h2>
          <p className="text-gray-600 dark:text-gray-400">Por favor, configura los datos del CV en el dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-12 px-4">
        <div className="max-w-[210mm] mx-auto">
          {/* Action Buttons */}
          <div className="mb-8 flex justify-between items-center">
            <div className="flex gap-3">
              <ThemeToggle />
              <LanguageToggle />
            </div>
            <CVPDFGenerator fullName={cvData.personalInfo.fullName} />
          </div>

          {/* CV Template - Visible (responsive) */}
          <CVTemplate cvData={cvData} />
        </div>
      </div>

      {/* CV Template - Hidden para PDF (desktop fixed width) */}
      <div
        id="cv-template-pdf"
        className="fixed"
        style={{
          position: 'fixed',
          left: '-9999px',
          top: '0',
          width: '900px',
          backgroundColor: '#ffffff',
          zIndex: -1,
          visibility: 'hidden',
        }}
      >
        <CVTemplate cvData={cvData} />
      </div>
    </>
  );
};
