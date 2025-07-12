export interface BacklogInfo {
  remainingVideos: number;
  daysRemaining: number;
  endDate: Date;
  isLowStock: boolean;
  isCritical: boolean;
}

export function calculateBacklogInfo(
  totalVideos: number,
  videosPerDay: number,
  lastUpdated: string
): BacklogInfo {
  const lastUpdateDate = new Date(lastUpdated);
  const today = new Date();
  
  // Calculate how many days have passed since last update
  const daysPassed = Math.floor((today.getTime() - lastUpdateDate.getTime()) / (1000 * 60 * 60 * 24));
  
  // Calculate videos consumed based on posting frequency
  const videosConsumed = daysPassed * videosPerDay;
  
  // Calculate remaining videos
  const remainingVideos = Math.max(0, totalVideos - videosConsumed);
  
  // Calculate days remaining
  const daysRemaining = videosPerDay > 0 ? Math.floor(remainingVideos / videosPerDay) : 0;
  
  // Calculate end date
  const endDate = new Date(today);
  endDate.setDate(endDate.getDate() + daysRemaining);
  
  // Determine status
  const isLowStock = remainingVideos <= 5 && remainingVideos > 2;
  const isCritical = remainingVideos <= 2;
  
  return {
    remainingVideos,
    daysRemaining,
    endDate,
    isLowStock,
    isCritical
  };
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

export function getStatusColor(backlogInfo: BacklogInfo): string {
  if (backlogInfo.isCritical) return 'text-red-400';
  if (backlogInfo.isLowStock) return 'text-yellow-400';
  return 'text-green-400';
}

export function getStatusText(backlogInfo: BacklogInfo): string {
  if (backlogInfo.isCritical) return 'CRÍTICO';
  if (backlogInfo.isLowStock) return 'BAIXO ESTOQUE';
  return 'OK';
}