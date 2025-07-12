import React, { useState, useEffect } from 'react';
import Button from './Button';
import XIcon from './icons/XIcon';

interface BacklogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (backlog: { totalVideos: number; videosPerDay: number; lastUpdated: string }) => void;
  currentBacklog?: {
    totalVideos: number;
    videosPerDay: number;
    lastUpdated: string;
  };
  channelName: string;
}

const BacklogModal: React.FC<BacklogModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  currentBacklog,
  channelName 
}) => {
  const [totalVideos, setTotalVideos] = useState(0);
  const [frequency, setFrequency] = useState('daily');
  const [customDays, setCustomDays] = useState(2);

  useEffect(() => {
    if (isOpen) {
      if (currentBacklog) {
        setTotalVideos(currentBacklog.totalVideos);
        if (currentBacklog.videosPerDay === 1) {
          setFrequency('daily');
        } else if (currentBacklog.videosPerDay === 0.5) {
          setFrequency('every-2-days');
        } else if (currentBacklog.videosPerDay === 1/3) {
          setFrequency('every-3-days');
        } else {
          setFrequency('custom');
          setCustomDays(Math.round(1 / currentBacklog.videosPerDay));
        }
      } else {
        setTotalVideos(0);
        setFrequency('daily');
        setCustomDays(2);
      }
    }
  }, [isOpen, currentBacklog]);

  if (!isOpen) return null;

  const getVideosPerDay = () => {
    switch (frequency) {
      case 'daily': return 1;
      case 'every-2-days': return 0.5;
      case 'every-3-days': return 1/3;
      case 'custom': return 1 / customDays;
      default: return 1;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (totalVideos < 0) {
      alert('O número de vídeos deve ser positivo.');
      return;
    }
    
    onSave({
      totalVideos,
      videosPerDay: getVideosPerDay(),
      lastUpdated: new Date().toISOString()
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-base-200 rounded-xl shadow-2xl p-6 w-full max-w-md relative">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
        >
          <XIcon />
        </button>
        
        <h2 className="text-2xl font-bold mb-6 text-white">
          Configurar Backlog
        </h2>
        <p className="text-slate-300 mb-4">Canal: <strong>{channelName}</strong></p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-slate-300 font-semibold mb-2">
              Quantidade de Vídeos no Backlog
            </label>
            <input
              type="number"
              min="0"
              value={totalVideos}
              onChange={(e) => setTotalVideos(parseInt(e.target.value) || 0)}
              className="w-full bg-base-300 text-slate-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
              placeholder="Ex: 10"
              required
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-2">
              Frequência de Postagem
            </label>
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              className="w-full bg-base-300 text-slate-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
            >
              <option value="daily">1 vídeo por dia</option>
              <option value="every-2-days">1 vídeo a cada 2 dias</option>
              <option value="every-3-days">1 vídeo a cada 3 dias</option>
              <option value="custom">Personalizado</option>
            </select>
          </div>

          {frequency === 'custom' && (
            <div>
              <label className="block text-slate-300 font-semibold mb-2">
                1 vídeo a cada quantos dias?
              </label>
              <input
                type="number"
                min="1"
                value={customDays}
                onChange={(e) => setCustomDays(parseInt(e.target.value) || 1)}
                className="w-full bg-base-300 text-slate-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
                placeholder="Ex: 5"
              />
            </div>
          )}

          <div className="bg-base-300 p-3 rounded-lg">
            <h4 className="text-slate-300 font-semibold mb-2">Previsão:</h4>
            <p className="text-slate-400 text-sm">
              Com {totalVideos} vídeos e frequência de{' '}
              {frequency === 'daily' ? '1 vídeo por dia' :
               frequency === 'every-2-days' ? '1 vídeo a cada 2 dias' :
               frequency === 'every-3-days' ? '1 vídeo a cada 3 dias' :
               `1 vídeo a cada ${customDays} dias`}, 
              você terá conteúdo para aproximadamente{' '}
              <strong className="text-white">
                {Math.floor(totalVideos / getVideosPerDay())} dias
              </strong>.
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1">
              Salvar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BacklogModal;