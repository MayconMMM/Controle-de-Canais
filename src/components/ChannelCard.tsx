import React from 'react';
import { Channel } from '../types';
import { calculateBacklogInfo } from '../utils/backlogCalculations';
import TrashIcon from './icons/TrashIcon';
import PencilIcon from './icons/PencilIcon';
import VideoIcon from './icons/VideoIcon';
import BacklogIndicator from './BacklogIndicator';

interface ChannelCardProps {
  channel: Channel;
  onDelete: (channelId: string) => void;
  onEdit: (channel: Channel) => void;
  onBacklogEdit: (channel: Channel) => void;
  layout: 'grid' | 'list';
}

const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
  const target = e.target as HTMLImageElement;
  target.onerror = null;
  target.src = `https://picsum.photos/seed/${Math.random()}/400/200`;
};

const ChannelCard: React.FC<ChannelCardProps> = ({ channel, onDelete, onEdit, layout }) => {
const ChannelCard: React.FC<ChannelCardProps> = ({ channel, onDelete, onEdit, onBacklogEdit, layout }) => {
  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(channel);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(channel.id);
  };

  const handleBacklogClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onBacklogEdit(channel);
  };

  const actions = (
    <div className="flex gap-2">
      <button 
        onClick={handleBacklogClick}
        className="bg-black bg-opacity-50 p-1.5 rounded-full text-white hover:bg-purple-600 transition-colors duration-200"
        aria-label="Manage video backlog"
      >
        <VideoIcon className="w-5 h-5" />
      </button>
      <button 
        onClick={handleEditClick}
        className="bg-black bg-opacity-50 p-1.5 rounded-full text-white hover:bg-brand-primary transition-colors duration-200"
        aria-label="Edit channel"
      >
        <PencilIcon className="w-5 h-5" />
      </button>
      <button 
        onClick={handleDeleteClick}
        className="bg-black bg-opacity-50 p-1.5 rounded-full text-white hover:bg-red-600 transition-colors duration-200"
        aria-label="Delete channel"
      >
        <TrashIcon className="w-5 h-5" />
      </button>
    </div>
  );

  // Calculate backlog status for visual indicators
  const backlogInfo = channel.backlog ? calculateBacklogInfo(
    channel.backlog.totalVideos,
    channel.backlog.videosPerDay,
    channel.backlog.lastUpdated
  ) : null;

  const cardClassName = `bg-base-200 rounded-xl shadow-lg overflow-hidden flex flex-col transition-transform hover:scale-105 duration-300 ease-in-out ${
    backlogInfo?.isCritical ? 'ring-2 ring-red-500' :
    backlogInfo?.isLowStock ? 'ring-2 ring-yellow-500' : ''
  }`;
  if (layout === 'list') {
    return (
      <div className={`bg-base-200 rounded-xl shadow-lg flex w-full transition-transform hover:scale-[1.02] duration-300 ease-in-out ${
        backlogInfo?.isCritical ? 'ring-2 ring-red-500' :
        backlogInfo?.isLowStock ? 'ring-2 ring-yellow-500' : ''
      }`}>
        <img
          src={channel.imageUrl}
          alt={channel.name}
          className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-l-xl flex-shrink-0"
          onError={handleImageError}
        />
        <div className="p-4 flex flex-col flex-grow relative w-full min-w-0">
          <div className="absolute top-3 right-3">
            {actions}
          </div>
          <div className="flex items-center gap-2 mb-2 pr-20">
            <img 
              src={`https://flagcdn.com/w20/${channel.country.code.toLowerCase()}.png`}
              width="20"
              alt={`${channel.country.name} flag`}
              className="rounded-sm flex-shrink-0"
              title={channel.country.name}
            />
            <h3 className="text-xl font-bold text-white truncate">{channel.name}</h3>
            {channel.backlog && (
              <BacklogIndicator backlog={channel.backlog} isCompact />
            )}
          </div>
          <div className="mt-auto flex flex-wrap gap-2">
            {channel.tools.map((tool) => (
              <a
                key={tool.id}
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-base-300 text-center text-slate-200 px-3 py-1.5 text-sm rounded-lg hover:bg-brand-primary hover:text-white transition-all duration-200 ease-in-out truncate shadow"
              >
                {tool.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cardClassName}>
      <div className="relative">
        <img
          src={channel.imageUrl}
          alt={channel.name}
          className="w-full h-40 object-cover"
          onError={handleImageError}
        />
        <div className="absolute top-2 right-2">
          {actions}
        </div>
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex items-center gap-2 mb-4">
          <img 
            src={`https://flagcdn.com/w20/${channel.country.code.toLowerCase()}.png`}
            width="20"
            alt={`${channel.country.name} flag`}
            className="rounded-sm flex-shrink-0"
            title={channel.country.name}
          />
          <h3 className="text-xl font-bold text-white truncate">{channel.name}</h3>
        </div>
        
        {channel.backlog && (
          <div className="mb-4">
            <BacklogIndicator backlog={channel.backlog} />
          </div>
        )}
        
        <div className="mt-auto grid grid-cols-1 sm:grid-cols-2 gap-2">
          {channel.tools.map((tool) => (
            <a
              key={tool.id}
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-base-300 text-center text-slate-200 px-3 py-2 rounded-lg hover:bg-brand-primary hover:text-white transition-all duration-200 ease-in-out truncate shadow"
            >
              {tool.name}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChannelCard;