import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Helper to parse date string like "Abril 2021" or "April 2021" to Date object
const parseDateStringToDate = (dateStr: string): Date | null => {
  if (!dateStr) return null;

  if (dateStr.toLowerCase() === 'presente' || dateStr.toLowerCase() === 'present') {
    return new Date();
  }

  const monthMap: { [key: string]: number } = {
    // Spanish
    'enero': 0, 'febrero': 1, 'marzo': 2, 'abril': 3, 'mayo': 4, 'junio': 5,
    'julio': 6, 'agosto': 7, 'septiembre': 8, 'setiembre': 8, 'octubre': 9, 'noviembre': 10, 'diciembre': 11,
    // English
    'january': 0, 'february': 1, 'march': 2, 'april': 3, 'may': 4, 'june': 5,
    'july': 6, 'august': 7, 'september': 8, 'october': 9, 'november': 10, 'december': 11,
  };

  // Try format "Mes Año" (e.g., "Abril 2021")
  const parts = dateStr.trim().split(' ');
  if (parts.length === 2) {
    const month = monthMap[parts[0].toLowerCase()];
    const year = parseInt(parts[1], 10);

    if (month !== undefined && !isNaN(year)) {
      return new Date(year, month);
    }
  }

  // Try format "YYYY-MM" (e.g., "2021-04")
  if (dateStr.includes('-')) {
    const [year, month] = dateStr.split('-');
    const yearNum = parseInt(year, 10);
    const monthNum = parseInt(month, 10);

    if (!isNaN(yearNum) && !isNaN(monthNum)) {
      return new Date(yearNum, monthNum - 1);
    }
  }

  return null;
};

export const formatDate = (dateString: string): string => {
  if (!dateString) return '';

  if (dateString.toLowerCase() === 'presente' || dateString.toLowerCase() === 'present') {
    return 'Presente';
  }

  // If already in text format (e.g., "Abril 2021"), return as is
  const parts = dateString.trim().split(' ');
  if (parts.length === 2 && isNaN(parseInt(parts[0]))) {
    return dateString;
  }

  // If in format "YYYY-MM", convert to text format
  if (dateString.includes('-')) {
    const [year, month] = dateString.split('-');
    const months = [
      'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
      'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
    ];
    return `${months[parseInt(month) - 1]} ${year}`;
  }

  return dateString;
};

export const calculateDuration = (startDate: string, endDate: string): string => {
  const start = parseDateStringToDate(startDate);
  const end = parseDateStringToDate(endDate);

  if (!start || !end) return '';

  const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;

  if (years > 0 && remainingMonths > 0) {
    return `${years} año${years > 1 ? 's' : ''} ${remainingMonths} mes${remainingMonths > 1 ? 'es' : ''}`;
  } else if (years > 0) {
    return `${years} año${years > 1 ? 's' : ''}`;
  } else if (months > 0) {
    return `${months} mes${months > 1 ? 'es' : ''}`;
  } else {
    return '1 mes';
  }
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: ReturnType<typeof setTimeout>;

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
};

export const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};
