import React, { useState, useEffect } from 'react';
import useLocalStorage from './hooks/useLocalStorage';
import { Channel } from './types';
import ChannelCard from './components/ChannelCard';
import AddChannelModal from './components/AddChannelModal';
import Button from './components/Button';
import PlusIcon from './components/icons/PlusIcon';
import CogIcon from './components/icons/CogIcon';
import SettingsSidebar from './components/SettingsSidebar';

const initialChannels: Channel[] = [
  {
    id: '1',
    name: 'Canal de Design',
    imageUrl: 'https://picsum.photos/seed/design/400/200',
    country: { name: 'Brazil', code: 'BR' },
    tools: [
      { id: 't1', name: 'Figma', url: 'https://figma.com' },
      { id: 't2', name: 'Dribbble', url: 'https://dribbble.com' },
      { id: 't3', name: 'Behance', url: 'https://behance.net' },
    ],
  },
  {
    id: '2',
    name: 'Desenvolvimento Web',
    imageUrl: 'https://picsum.photos/seed/development/400/200',
    country: { name: 'United States', code: 'US' },
    tools: [
      { id: 't4', name: 'GitHub', url: 'https://github.com' },
      { id: 't5', name: 'VS Code', url: 'https://code.visualstudio.com/' },
    ],
  },
  {
    id: '3',
    name: 'Marketing Digital',
    imageUrl: 'https://picsum.photos/seed/marketing/400/200',
    country: { name: 'Portugal', code: 'PT' },
    tools: [
      { id: 't6', name: 'Google Analytics', url: 'https://analytics.google.com/' },
      { id: 't7', name: 'Canva', url: 'https://canva.com' },
      { id: 't8', name: 'Trello', url: 'https://trello.com' },
      { id: 't9', name: 'HubSpot', url: 'https://hubspot.com' },
    ],
  },
];

const App: React.FC = () => {
  const [channels, setChannels] = useLocalStorage<Channel[]>('channels', initialChannels);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [channelToEdit, setChannelToEdit] = useState<Channel | null>(null);
  const [theme, setTheme] = useLocalStorage<string>('theme', 'teal');
  const [layout, setLayout] = useLocalStorage<'grid' | 'list'>('layout', 'grid');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const handleOpenAddModal = () => {
    setChannelToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (channel: Channel) => {
    setChannelToEdit(channel);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setChannelToEdit(null);
  };

  const handleSaveChannel = (channelData: Omit<Channel, 'id'> & { id?: string }) => {
    if (channelData.id) {
      setChannels(prevChannels =>
        prevChannels.map(c =>
          c.id === channelData.id ? { ...c, ...(channelData as Channel) } : c
        )
      );
    } else {
      const newChannel: Channel = {
        ...(channelData as Omit<Channel, 'id'>),
        id: crypto.randomUUID(),
      };
      setChannels(prevChannels => [...prevChannels, newChannel]);
    }
  };

  const handleDeleteChannel = (channelId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este canal?')) {
      setChannels(prevChannels => prevChannels.filter((channel) => channel.id !== channelId));
    }
  };

  return (
    <div className="min-h-screen bg-base-100 font-sans">
      <header className="bg-base-200/80 backdrop-blur-sm sticky top-0 z-40 shadow-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <h1 className="text-3xl font-bold text-white">
              <span className="text-brand-primary">Organizador</span> de Canais
            </h1>
            <div className="flex items-center gap-2 sm:gap-4">
              <Button onClick={handleOpenAddModal}>
                <PlusIcon className="w-5 h-5"/>
                <span className="hidden sm:inline">Adicionar Canal</span>
              </Button>
              <button 
                onClick={() => setIsSettingsOpen(true)} 
                className="p-2.5 rounded-full text-slate-300 hover:bg-base-300 hover:text-white transition-colors"
                aria-label="Open settings"
              >
                <CogIcon />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        {channels.length > 0 ? (
          <div className={layout === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
            : "flex flex-col items-center gap-6"
          }>
            {channels.map((channel) => (
              <ChannelCard
                key={channel.id}
                channel={channel}
                onDelete={handleDeleteChannel}
                onEdit={handleOpenEditModal}
                layout={layout}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <h2 className="text-2xl font-semibold text-slate-400">Nenhum canal encontrado.</h2>
            <p className="text-slate-500 mt-2">Clique em "Adicionar Canal" para começar a organizar seus links!</p>
          </div>
        )}
      </main>

      <AddChannelModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSaveChannel={handleSaveChannel}
        channelToEdit={channelToEdit}
      />
      <SettingsSidebar 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currentTheme={theme}
        onThemeChange={setTheme}
        currentLayout={layout}
        onLayoutChange={setLayout}
      />
    </div>
  );
};

export default App;