import { useState } from 'react';
import * as Icons from 'lucide-react';
import { Search, X } from 'lucide-react';

// Lista de iconos más comunes y útiles para servicios/proyectos
const commonIcons = [
  'Code2', 'Server', 'Cloud', 'Database', 'Smartphone', 'Monitor',
  'Laptop', 'Tablet', 'Globe', 'Wifi', 'Cpu', 'HardDrive',
  'Terminal', 'FileCode', 'GitBranch', 'Package', 'Boxes', 'Layers',
  'Zap', 'Rocket', 'Compass', 'Target', 'Award', 'TrendingUp',
  'BarChart', 'PieChart', 'Activity', 'Settings', 'Tool', 'Wrench',
  'Briefcase', 'Folder', 'FolderOpen', 'File', 'FileText', 'Image',
  'Video', 'Music', 'Headphones', 'Mic', 'Camera', 'Film',
  'Palette', 'Paintbrush', 'Pen', 'Edit', 'Layout', 'Grid',
  'Box', 'Package2', 'Container', 'Boxes', 'Archive', 'Inbox',
  'Mail', 'MessageSquare', 'Send', 'Users', 'User', 'UserPlus',
  'Heart', 'Star', 'Bookmark', 'Tag', 'Hash', 'AtSign',
  'Link', 'Lock', 'Unlock', 'Key', 'Shield', 'ShieldCheck',
  'Eye', 'EyeOff', 'Search', 'Filter', 'SlidersHorizontal', 'Download',
  'Upload', 'Share', 'Copy', 'Clipboard', 'Check', 'X',
  'Plus', 'Minus', 'ChevronRight', 'ChevronLeft', 'ArrowRight', 'ArrowLeft',
];

interface IconPickerProps {
  value: string;
  onChange: (iconName: string) => void;
  label?: string;
}

export const IconPicker = ({ value, onChange, label }: IconPickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filteredIcons = commonIcons.filter(icon =>
    icon.toLowerCase().includes(search.toLowerCase())
  );

  const SelectedIcon = value && (Icons as any)[value] ? (Icons as any)[value] : Icons.Code2;

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium mb-2">{label}</label>
      )}

      {/* Selected Icon Display */}
      <div
        onClick={() => setIsOpen(true)}
        className="w-full px-4 py-3 rounded-lg glass border border-white/10 cursor-pointer hover:border-primary transition-all flex items-center space-x-3"
      >
        <div className="w-8 h-8 rounded gradient-primary flex items-center justify-center">
          <SelectedIcon className="w-5 h-5" />
        </div>
        <span className="flex-1">{value || 'Seleccionar icono'}</span>
        <Search className="w-4 h-4 text-light/60" />
      </div>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark/80 backdrop-blur-sm p-4">
          <div className="glass rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <h3 className="text-xl font-bold">Seleccionar Icono</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="w-10 h-10 rounded-lg glass-hover flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search */}
            <div className="p-6 border-b border-white/10">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-light/60" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar icono..."
                  className="w-full pl-10 pr-4 py-3 rounded-lg glass border border-white/10 focus:border-primary focus:outline-none"
                  autoFocus
                />
              </div>
            </div>

            {/* Icons Grid */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-3">
                {filteredIcons.map((iconName) => {
                  const IconComponent = (Icons as any)[iconName];
                  if (!IconComponent) return null;

                  const isSelected = value === iconName;

                  return (
                    <button
                      key={iconName}
                      onClick={() => {
                        onChange(iconName);
                        setIsOpen(false);
                        setSearch('');
                      }}
                      className={`
                        aspect-square rounded-lg flex items-center justify-center transition-all
                        ${isSelected
                          ? 'gradient-primary scale-110'
                          : 'glass-hover hover:scale-105'
                        }
                      `}
                      title={iconName}
                    >
                      <IconComponent className="w-5 h-5" />
                    </button>
                  );
                })}
              </div>

              {filteredIcons.length === 0 && (
                <div className="text-center py-12">
                  <Search className="w-16 h-16 mx-auto mb-4 text-light/30" />
                  <p className="text-light/60">No se encontraron iconos</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-white/10 flex justify-between items-center">
              <p className="text-sm text-light/60">
                {filteredIcons.length} iconos disponibles
              </p>
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 rounded-lg glass-hover font-medium"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
