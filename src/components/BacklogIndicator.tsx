import React from 'react';
import { calculateBacklogInfo, formatDate, getStatusColor, getStatusText } from '../utils/backlogCalculations';

interface BacklogIndicatorProps {
  backlog: {
    totalVideos: number;
    videosPerDay: number;
    lastUpdated: string;
  };
  isCompact?: boolean;
}

const BacklogIndicator: React.FC<BacklogIndicatorProps> = ({ backlog, isCompact = false }) => {
  const backlogInfo = calculateBacklogInfo(
    backlog.totalVideos,
    backlog.videosPerDay,
    backlog.lastUpdated
  );

  if (isCompact) {
    return (
      <div className="flex items-center gap-2 text-sm">
        <div className={`w-2 h-2 rounded-full ${
          backlogInfo.isCritical ? 'bg-red-500' : 
          backlogInfo.isLowStock ? 'bg-yellow-500' : 'bg-green-500'
        }`} />
        <span className={getStatusColor(backlogInfo)}>
          {backlogInfo.remainingVideos} vídeos
        </span>
      </div>
    );
  }

  return (
    <div className="bg-base-300 rounded-lg p-3 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-slate-300 text-sm font-medium">Backlog de Vídeos</span>
        <span className={`text-xs font-bold ${getStatusColor(backlogInfo)}`}>
          {getStatusText(backlogInfo)}
        </span>
      </div>
      
      <div className="space-y-1 text-sm">
        <div className="flex justify-between">
          <span className="text-slate-400">Vídeos restantes:</span>
          <span className={`font-semibold ${getStatusColor(backlogInfo)}`}>
            {backlogInfo.remainingVideos}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-slate-400">Dias restantes:</span>
          <span className="text-slate-200">{backlogInfo.daysRemaining}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-slate-400">Acaba em:</span>
          <span className="text-slate-200">{formatDate(backlogInfo.endDate)}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-slate-400">Frequência:</span>
          <span className="text-slate-200">
            {backlog.videosPerDay === 1 ? '1 vídeo/dia' : 
             backlog.videosPerDay < 1 ? `1 vídeo a cada ${Math.round(1/backlog.videosPerDay)} dias` :
             `${backlog.videosPerDay} vídeos/dia`}
          </span>
        </div>
      </div>
      
      {(backlogInfo.isLowStock || backlogInfo.isCritical) && (
        <div className={`text-xs p-2 rounded ${
          backlogInfo.isCritical ? 'bg-red-900/30 text-red-300' : 'bg-yellow-900/30 text-yellow-300'
        }`}>
          {backlogInfo.isCritical ? 
            '⚠️ Estoque crítico! Produza mais vídeos urgentemente.' :
            '📢 Estoque baixo. Considere produzir mais vídeos em breve.'
          }
        </div>
      )}
    </div>
  );
};

export default BacklogIndicator;