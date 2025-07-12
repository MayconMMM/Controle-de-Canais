import React, { useEffect, useState } from 'react';
import XIcon from './icons/XIcon';
import GridIcon from './icons/GridIcon';
import ListIcon from './icons/ListIcon';

interface SettingsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: string;
  onThemeChange: (theme: string) => void;
  currentLayout: 'grid' | 'list';
  onLayoutChange: (layout: 'grid' | 'list') => void;
}

const themes = [
    { name: 'teal', color: 'bg-teal-500' },
    { name: 'indigo', color: 'bg-indigo-500' },
    { name: 'crimson', color: 'bg-rose-500' },
    { name: 'forest', color: 'bg-green-600' },
    { name: 'violet', color: 'bg-violet-500' },
    { name: 'orange', color: 'bg-orange-500' },
    { name: 'gold', color: 'bg-yellow-500' },
    { name: 'slate', color: 'bg-slate-500' },
];

const SettingsSidebar: React.FC<SettingsSidebarProps> = ({ isOpen, onClose, currentTheme, onThemeChange, currentLayout, onLayoutChange }) => {
    const [isRendering, setIsRendering] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsRendering(true);
        } else {
            const timer = setTimeout(() => setIsRendering(false), 300); // Match animation duration
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!isRendering) {
        return null;
    }

    return (
        <div 
            className={`fixed inset-0 z-50 transition-colors duration-300 ${isOpen ? 'bg-black/60' : 'bg-transparent pointer-events-none'}`}
            onClick={onClose}
            role="dialog"
            aria-modal="true"
        >
            <div
                className={`fixed top-0 right-0 h-full w-80 bg-base-200 shadow-2xl p-6 flex flex-col gap-8 transform ${isOpen ? 'animate-slide-in-right' : 'animate-slide-out-right'}`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-white">Configurações</h2>
                    <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-base-300 transition-colors">
                        <XIcon />
                    </button>
                </div>

                {/* Theme Selection */}
                <div>
                    <h3 className="text-lg font-semibold text-slate-300 mb-3">Tema de Cores</h3>
                    <div className="grid grid-cols-4 gap-3">
                        {themes.map(theme => (
                            <button
                                key={theme.name}
                                onClick={() => onThemeChange(theme.name)}
                                className={`w-full h-12 rounded-lg ${theme.color} transition-all duration-200 border-2 ${currentTheme === theme.name ? 'border-white' : 'border-transparent'} hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-base-200 focus:ring-white`}
                                aria-label={`Select ${theme.name} theme`}
                            />
                        ))}
                    </div>
                </div>

                {/* Layout Selection */}
                <div>
                    <h3 className="text-lg font-semibold text-slate-300 mb-3">Estilo de Layout</h3>
                    <div className="flex bg-base-300 rounded-lg p-1">
                        <button 
                            onClick={() => onLayoutChange('grid')}
                            className={`w-1/2 py-2 rounded-md flex items-center justify-center gap-2 transition-colors duration-200 ${currentLayout === 'grid' ? 'bg-brand-primary text-white' : 'text-slate-300 hover:bg-base-100'}`}
                        >
                            <GridIcon className="w-5 h-5" />
                            Grid
                        </button>
                        <button 
                            onClick={() => onLayoutChange('list')}
                            className={`w-1/2 py-2 rounded-md flex items-center justify-center gap-2 transition-colors duration-200 ${currentLayout === 'list' ? 'bg-brand-primary text-white' : 'text-slate-300 hover:bg-base-100'}`}
                        >
                           <ListIcon className="w-5 h-5" />
                            Lista
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsSidebar;