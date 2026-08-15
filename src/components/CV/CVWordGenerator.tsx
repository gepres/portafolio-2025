import { useState } from 'react';
import { FileText } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  AlignmentType,
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  TabStopPosition,
  TabStopType,
  TextRun,
} from 'docx';
import { saveAs } from 'file-saver';
import toast from 'react-hot-toast';
import { trackCVDownload } from '../../lib/analytics/gtag';
import type { BilingualText, CVData, CVExperience } from '../../types';

interface CVWordGeneratorProps {
  cvData: CVData;
}

type Lang = 'es' | 'en';

const resolveText = (
  text: string | BilingualText | undefined,
  lang: Lang
): string => {
  if (!text) return '';
  if (typeof text === 'string') return text;
  return text[lang] || text.es || text.en || '';
};

const translate = (key: 'professionalExperience' | 'freelanceExperience' | 'education' | 'technicalSkills' | 'languages' | 'softSkills' | 'summary', lang: Lang): string => {
  const dict: Record<typeof key, Record<Lang, string>> = {
    professionalExperience: { es: 'Experiencia Profesional', en: 'Professional Experience' },
    freelanceExperience: { es: 'Proyectos Freelance', en: 'Freelance Projects' },
    education: { es: 'Educación', en: 'Education' },
    technicalSkills: { es: 'Habilidades Técnicas', en: 'Technical Skills' },
    languages: { es: 'Idiomas', en: 'Languages' },
    softSkills: { es: 'Habilidades Blandas', en: 'Soft Skills' },
    summary: { es: 'Perfil Profesional', en: 'Professional Summary' },
  };
  return dict[key][lang];
};

const sectionHeading = (text: string): Paragraph =>
  new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 280, after: 140 },
    children: [
      new TextRun({
        text: text.toUpperCase(),
        bold: true,
        size: 26,
        color: '1F2937',
      }),
    ],
  });

// Agrega un bloque de experiencia (encabezado + items). No hace nada si la lista viene vacía.
const pushExperienceBlock = (
  children: Paragraph[],
  experiences: CVExperience[],
  heading: string,
  lang: Lang
): void => {
  if (experiences.length === 0) return;

  children.push(sectionHeading(heading));
  const sortedExp = [...experiences].sort((a, b) => a.order - b.order);

  sortedExp.forEach((exp) => {
    // Position + dates on same line via tab stop
    children.push(
      new Paragraph({
        spacing: { before: 120, after: 40 },
        tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
        children: [
          new TextRun({
            text: resolveText(exp.position, lang).toUpperCase(),
            bold: true,
            size: 22,
            color: '111827',
          }),
          new TextRun({ text: '\t' }),
          new TextRun({
            text: `${exp.startDate} - ${exp.endDate}`,
            size: 20,
            color: '6B7280',
          }),
        ],
      })
    );

    children.push(
      new Paragraph({
        spacing: { after: 80 },
        children: [
          new TextRun({
            text: exp.company,
            italics: true,
            bold: true,
            size: 21,
            color: '374151',
          }),
        ],
      })
    );

    const description = resolveText(exp.description, lang);
    if (description) {
      children.push(
        new Paragraph({
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 80 },
          children: [new TextRun({ text: description, size: 21, color: '374151' })],
        })
      );
    }

    if (exp.technologies && exp.technologies.length > 0) {
      children.push(
        new Paragraph({
          spacing: { after: 120 },
          children: [
            new TextRun({
              text: `Tech: `,
              bold: true,
              size: 20,
              color: '6B7280',
            }),
            new TextRun({
              text: exp.technologies.join(' · '),
              size: 20,
              color: '4B5563',
            }),
          ],
        })
      );
    }
  });
};

const buildDocument = (cvData: CVData, lang: Lang): Document => {
  const { personalInfo, experience, education, technicalSkills, languages, softSkills } = cvData;

  const children: Paragraph[] = [];

  // Header: Name
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 80 },
      children: [
        new TextRun({
          text: personalInfo.fullName.toUpperCase(),
          bold: true,
          size: 40,
          color: '111827',
        }),
      ],
    })
  );

  // Title
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 120 },
      children: [
        new TextRun({
          text: resolveText(personalInfo.title, lang).toUpperCase(),
          size: 24,
          color: '4B5563',
        }),
      ],
    })
  );

  // Contact info line
  const contactParts: string[] = [
    resolveText(personalInfo.location, lang),
    personalInfo.phone,
    personalInfo.email,
  ].filter(Boolean);
  if (personalInfo.website) contactParts.push(personalInfo.website);
  if (personalInfo.linkedin) contactParts.push(personalInfo.linkedin);
  if (personalInfo.github) contactParts.push(personalInfo.github);

  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 280 },
      children: [
        new TextRun({
          text: contactParts.join('  •  '),
          size: 20,
          color: '4B5563',
        }),
      ],
    })
  );

  // Summary
  const summary = resolveText(personalInfo.summary, lang);
  if (summary) {
    children.push(sectionHeading(translate('summary', lang)));
    children.push(
      new Paragraph({
        alignment: AlignmentType.JUSTIFIED,
        spacing: { after: 160 },
        children: [new TextRun({ text: summary, size: 22, color: '374151' })],
      })
    );
  }

  // Work Experience: empresa y freelance en bloques separados
  pushExperienceBlock(
    children,
    experience.filter((exp) => exp.employmentType !== 'freelance'),
    translate('professionalExperience', lang),
    lang
  );

  pushExperienceBlock(
    children,
    experience.filter((exp) => exp.employmentType === 'freelance'),
    translate('freelanceExperience', lang),
    lang
  );

  // Education
  if (education.length > 0) {
    children.push(sectionHeading(translate('education', lang)));
    const sortedEdu = [...education].sort((a, b) => a.order - b.order);

    sortedEdu.forEach((edu) => {
      children.push(
        new Paragraph({
          spacing: { before: 100, after: 40 },
          tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
          children: [
            new TextRun({
              text: resolveText(edu.degree, lang).toUpperCase(),
              bold: true,
              size: 21,
              color: '111827',
            }),
            new TextRun({ text: '\t' }),
            new TextRun({
              text: `${edu.startDate} - ${edu.endDate}`,
              size: 20,
              color: '6B7280',
            }),
          ],
        })
      );
      children.push(
        new Paragraph({
          spacing: { after: 80 },
          children: [
            new TextRun({
              text: resolveText(edu.institution, lang),
              italics: true,
              size: 20,
              color: '4B5563',
            }),
          ],
        })
      );
    });
  }

  // Technical Skills
  if (technicalSkills.length > 0) {
    children.push(sectionHeading(translate('technicalSkills', lang)));

    const grouped = technicalSkills.reduce<Record<string, string[]>>((acc, skill) => {
      if (!acc[skill.category]) acc[skill.category] = [];
      acc[skill.category].push(skill.name);
      return acc;
    }, {});

    Object.entries(grouped).forEach(([category, names]) => {
      children.push(
        new Paragraph({
          spacing: { after: 60 },
          children: [
            new TextRun({
              text: `${category.charAt(0).toUpperCase() + category.slice(1)}: `,
              bold: true,
              size: 21,
              color: '374151',
            }),
            new TextRun({
              text: names.join(', '),
              size: 21,
              color: '4B5563',
            }),
          ],
        })
      );
    });
  }

  // Languages
  if (languages.length > 0) {
    children.push(sectionHeading(translate('languages', lang)));
    const sortedLang = [...languages].sort((a, b) => a.order - b.order);

    sortedLang.forEach((l) => {
      children.push(
        new Paragraph({
          spacing: { after: 60 },
          children: [
            new TextRun({
              text: `${resolveText(l.language, lang)}: `,
              bold: true,
              size: 21,
              color: '374151',
            }),
            new TextRun({
              text: resolveText(l.level, lang),
              size: 21,
              color: '4B5563',
            }),
          ],
        })
      );
    });
  }

  // Soft Skills
  if (softSkills.length > 0) {
    children.push(sectionHeading(translate('softSkills', lang)));
    const sortedSoft = [...softSkills].sort((a, b) => a.order - b.order);
    const names = sortedSoft.map((s) => resolveText(s.name, lang)).filter(Boolean);
    children.push(
      new Paragraph({
        spacing: { after: 120 },
        children: [
          new TextRun({
            text: names.join(' · '),
            size: 21,
            color: '374151',
          }),
        ],
      })
    );
  }

  return new Document({
    creator: personalInfo.fullName,
    title: `CV - ${personalInfo.fullName}`,
    description: `CV generado desde el portafolio (${lang})`,
    styles: {
      default: {
        document: {
          run: { font: 'Calibri', size: 22 },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            margin: { top: 1000, bottom: 1000, left: 1000, right: 1000 },
          },
        },
        children,
      },
    ],
  });
};

export const CVWordGenerator = ({ cvData }: CVWordGeneratorProps) => {
  const { i18n } = useTranslation();
  const [isGenerating, setIsGenerating] = useState(false);

  const generateWord = async () => {
    setIsGenerating(true);
    const loadingToast = toast.loading('Generando Word...');

    try {
      const lang = (i18n.language as Lang) === 'en' ? 'en' : 'es';
      const doc = buildDocument(cvData, lang);
      const blob = await Packer.toBlob(doc);

      const year = new Date().getFullYear();
      const fileName = `CV_${cvData.personalInfo.fullName.replace(/\s+/g, '')}_${year}.docx`;
      saveAs(blob, fileName);

      trackCVDownload('word');
      toast.success('Word generado exitosamente', { id: loadingToast });
    } catch (error) {
      console.error('Error generating Word:', error);
      toast.error('Error al generar el Word', { id: loadingToast });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <button
      onClick={generateWord}
      disabled={isGenerating}
      className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
    >
      <FileText className="w-5 h-5" />
      <span>{isGenerating ? 'Generando...' : 'Descargar Word'}</span>
    </button>
  );
};
