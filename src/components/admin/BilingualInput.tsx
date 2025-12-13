import { useState } from 'react';
import { cn } from '../../lib/utils/helpers';

export interface BilingualText {
  es: string;
  en: string;
}

interface BilingualInputProps {
  label: string;
  value: BilingualText;
  onChange: (value: BilingualText) => void;
  type?: 'text' | 'textarea';
  error?: Partial<BilingualText>;
  placeholder?: BilingualText;
  required?: boolean;
  className?: string;
}

export const BilingualInput = ({
  label,
  value,
  onChange,
  type = 'text',
  error,
  placeholder,
  required = false,
  className
}: BilingualInputProps) => {
  const [activeTab, setActiveTab] = useState<'es' | 'en'>('es');

  const inputClasses = "w-full px-4 py-3 rounded-lg glass border border-slate-200 dark:border-white/10 text-slate-900 dark:text-light placeholder:text-slate-400 dark:placeholder:text-light/30 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300";

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-slate-700 dark:text-light/80">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>

        <div className="flex bg-slate-100 dark:bg-white/5 rounded-lg p-1">
          <button
            type="button"
            onClick={() => setActiveTab('es')}
            className={cn(
              "px-3 py-1 text-xs font-medium rounded-md transition-all duration-200",
              activeTab === 'es'
                ? "bg-white dark:bg-white/10 text-primary shadow-sm"
                : "text-slate-500 dark:text-light/50 hover:text-slate-700 dark:hover:text-light/80"
            )}
          >
            🇪🇸 ES
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('en')}
            className={cn(
              "px-3 py-1 text-xs font-medium rounded-md transition-all duration-200",
              activeTab === 'en'
                ? "bg-white dark:bg-white/10 text-primary shadow-sm"
                : "text-slate-500 dark:text-light/50 hover:text-slate-700 dark:hover:text-light/80"
            )}
          >
            🇬🇧 EN
          </button>
        </div>
      </div>
      
      <div>
        {type === 'textarea' ? (
          <textarea
            value={value[activeTab]}
            onChange={(e) => onChange({ ...value, [activeTab]: e.target.value })}
            className={inputClasses}
            placeholder={placeholder?.[activeTab]}
            rows={4}
            required={required}
          />
        ) : (
          <input
            type="text"
            value={value[activeTab]}
            onChange={(e) => onChange({ ...value, [activeTab]: e.target.value })}
            className={inputClasses}
            placeholder={placeholder?.[activeTab]}
            required={required}
          />
        )}
        {error?.[activeTab] && (
          <p className="text-red-500 text-sm mt-1 animate-fadeIn">
            {error[activeTab]}
          </p>
        )}
        <p className="text-xs text-right text-slate-400 dark:text-light/30 mt-1">
          {activeTab === 'es' ? 'Editando Español' : 'Editing English'}
        </p>
      </div>
    </div>
  );
};
