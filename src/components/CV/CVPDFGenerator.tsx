import { useState } from 'react';
import { Download } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import toast from 'react-hot-toast';

interface CVPDFGeneratorProps {
  fullName: string;
}

export const CVPDFGenerator = ({ fullName }: CVPDFGeneratorProps) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePDF = async () => {
    setIsGenerating(true);
    const loadingToast = toast.loading('Generando PDF...');

    try {
      // Buscar primero el elemento oculto para PDF (desktop), si no existe usar el visible
      let element = document.getElementById('cv-template-pdf');

      // Si no existe el contenedor oculto, buscar el visible (fallback)
      if (!element) {
        element = document.getElementById('cv-template');
      }

      if (!element) {
        throw new Error('CV template not found');
      }

      // Hacer visible temporalmente si es el contenedor oculto
      const wasPdfContainer = element.id === 'cv-template-pdf';
      if (wasPdfContainer) {
        element.style.visibility = 'visible';
        element.style.position = 'absolute';
        element.style.left = '0';
        element.style.top = '0';
      }

      // Captura el elemento como imagen con calidad optimizada
      const canvas = await html2canvas(element, {
        scale: 1.5, // Reducido de 2 a 1.5 para menor tamaño
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
      });

      // Ancho estándar A4 en mm
      const pdfWidth = 210;

      // Calcular altura proporcional al contenido
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;

      // Crear PDF con altura personalizada (una sola página larga)
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [pdfWidth, imgHeight], // [ancho, alto] personalizado
        compress: true, // Habilitar compresión
      });

      // Convertir a JPEG con compresión (70% calidad)
      const imgData = canvas.toDataURL('image/jpeg', 0.7);

      // Agregar la imagen completa en una sola página
      pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight, undefined, 'FAST');

      // Generar nombre del archivo
      const year = new Date().getFullYear();
      const fileName = `CV_${fullName.replace(/\s+/g, '')}_${year}.pdf`;

      // Detectar si es móvil
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

      if (isMobile) {
        // En móviles, abrir en nueva pestaña
        const pdfBlob = pdf.output('blob');
        const blobUrl = URL.createObjectURL(pdfBlob);

        // Crear un link temporal
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = fileName;
        link.target = '_blank';

        // Trigger download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Limpiar el blob URL después de un tiempo
        setTimeout(() => URL.revokeObjectURL(blobUrl), 100);
      } else {
        // En desktop, descarga directa
        pdf.save(fileName);
      }

      toast.success('PDF generado exitosamente', { id: loadingToast });

      // Restaurar visibilidad del contenedor oculto si se usó
      const pdfElement = document.getElementById('cv-template-pdf');
      if (pdfElement) {
        pdfElement.style.visibility = 'hidden';
        pdfElement.style.position = 'fixed';
        pdfElement.style.left = '-9999px';
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Error al generar el PDF', { id: loadingToast });

      // Restaurar visibilidad en caso de error también
      const pdfElement = document.getElementById('cv-template-pdf');
      if (pdfElement) {
        pdfElement.style.visibility = 'hidden';
        pdfElement.style.position = 'fixed';
        pdfElement.style.left = '-9999px';
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <button
      onClick={generatePDF}
      disabled={isGenerating}
      className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
    >
      <Download className="w-5 h-5" />
      <span>{isGenerating ? 'Generando...' : 'Descargar PDF'}</span>
    </button>
  );
};
