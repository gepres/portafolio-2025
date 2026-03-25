export const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined;

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}

export const isGAEnabled = (): boolean =>
  typeof window !== 'undefined' &&
  typeof window.gtag === 'function' &&
  !!GA_MEASUREMENT_ID;

export const pageview = (url: string, title?: string): void => {
  if (!isGAEnabled()) return;
  window.gtag('config', GA_MEASUREMENT_ID!, {
    page_path: url,
    page_title: title,
  });
};

export const event = (
  action: string,
  params?: {
    category?: string;
    label?: string;
    value?: number;
    [key: string]: unknown;
  }
): void => {
  if (!isGAEnabled()) return;
  window.gtag('event', action, params);
};

// Eventos predefinidos para el portfolio
export const trackCVDownload = (): void =>
  event('cv_download', { category: 'engagement', label: 'CV PDF' });

export const trackProjectView = (projectName: string): void =>
  event('project_view', { category: 'portfolio', label: projectName });

export const trackContactFormSubmit = (): void =>
  event('contact_form_submit', { category: 'engagement' });

export const trackSectionView = (section: string): void =>
  event('section_view', { category: 'navigation', label: section });
