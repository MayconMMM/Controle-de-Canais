import React, { useState, useEffect, useRef } from 'react';
import { Channel, Tool, Country } from '../types';
import { countries } from '../data/countries';
import Button from './Button';
import XIcon from './icons/XIcon';
import PlusIcon from './icons/PlusIcon';
import TrashIcon from './icons/TrashIcon';

interface AddChannelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveChannel: (channel: Omit<Channel, 'id'> & { id?: string }) => void;
  channelToEdit: Channel | null;
}

const UploadIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
  </svg>
);

const AddChannelModal: React.FC<AddChannelModalProps> = ({ isOpen, onClose, onSaveChannel, channelToEdit }) => {
  const isEditing = !!channelToEdit;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [country, setCountry] = useState<string>('');
  const [tools, setTools] = useState<(Omit<Tool, 'id'> & { id?: string })[]>([{ name: '', url: '' }]);

  useEffect(() => {
    if (isOpen) {
      if (isEditing && channelToEdit) {
        setName(channelToEdit.name);
        setImageUrl(channelToEdit.imageUrl);
        setCountry(JSON.stringify(channelToEdit.country));
        setTools(channelToEdit.tools.length > 0 ? [...channelToEdit.tools] : [{ name: '', url: '' }]);
      } else {
        setName('');
        setImageUrl('');
        setCountry('');
        setTools([{ name: '', url: '' }]);
      }
    }
  }, [isOpen, channelToEdit, isEditing]);

  if (!isOpen) return null;

  const handleToolChange = (index: number, field: 'name' | 'url', value: string) => {
    const newTools = tools.map((tool, i) => {
      if (i === index) {
        return { ...tool, [field]: value };
      }
      return tool;
    });
    setTools(newTools);
  };

  const addToolField = () => {
    setTools([...tools, { name: '', url: '' }]);
  };

  const removeToolField = (index: number) => {
    const newTools = tools.filter((_, i) => i !== index);
    setTools(newTools);
  };
  
  const handleImageUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !imageUrl || !country) {
      alert("Por favor, preencha o nome do canal, adicione uma imagem e selecione um país.");
      return;
    }
    
    const validTools = tools
      .filter(tool => tool.name && tool.url)
      .map(tool => ({
        ...tool,
        id: tool.id || crypto.randomUUID(),
      }));
      
    const selectedCountry: Country = JSON.parse(country);

    const channelData = {
      name,
      imageUrl,
      country: selectedCountry,
      tools: validTools,
    };

    if (isEditing && channelToEdit) {
      onSaveChannel({ ...channelData, id: channelToEdit.id });
    } else {
      onSaveChannel(channelData);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 transition-opacity duration-300">
      <div className="bg-base-200 rounded-xl shadow-2xl p-6 w-full max-w-lg relative animate-fade-in-up">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors">
          <XIcon />
        </button>
        <h2 className="text-2xl font-bold mb-6 text-white">{isEditing ? 'Editar Canal' : 'Adicionar Novo Canal'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[80vh] overflow-y-auto pr-2">
          <input
            type="text"
            placeholder="Nome do Canal"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-base-300 text-slate-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
            required
          />

          <div>
            <label htmlFor="country-select" className="block text-slate-300 font-semibold mb-2">País</label>
            <select
              id="country-select"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full bg-base-300 text-slate-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
              required
            >
              <option value="" disabled>Selecione um país</option>
              {countries.sort((a, b) => a.name.localeCompare(b.name)).map((c) => (
                <option key={c.code} value={JSON.stringify(c)}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-slate-300 font-semibold mb-2">Imagem do Canal</label>
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <div className="w-24 h-24 flex-shrink-0 bg-base-300 rounded-lg flex items-center justify-center border-2 border-dashed border-base-300">
                {imageUrl ? (
                  <img src={imageUrl} alt="Preview do canal" className="w-full h-full object-cover rounded-lg" />
                ) : (
                  <span className="text-xs text-slate-400 text-center p-2">Preview</span>
                )}
              </div>
              <div className="flex-grow w-full space-y-2">
                <input
                  type="url"
                  placeholder="Cole a URL da imagem aqui"
                  value={imageUrl.startsWith('data:') ? '' : imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full bg-base-300 text-slate-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
                />
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/png, image/jpeg, image/gif, image/webp"
                />
                <Button type="button" variant="secondary" onClick={handleImageUploadClick} className="w-full">
                  <UploadIcon />
                  Enviar Imagem
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-slate-300 pt-2">Ferramentas / Links</h3>
            {tools.map((tool, index) => (
              <div key={tool.id || index} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Nome da Ferramenta"
                  value={tool.name}
                  onChange={(e) => handleToolChange(index, 'name', e.target.value)}
                  className="w-1/2 bg-base-300 text-slate-200 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
                />
                <input
                  type="url"
                  placeholder="URL da Ferramenta"
                  value={tool.url}
                  onChange={(e) => handleToolChange(index, 'url', e.target.value)}
                  className="w-1/2 bg-base-300 text-slate-200 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
                />
                <button
                  type="button"
                  onClick={() => removeToolField(index)}
                  className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                  aria-label="Remover ferramenta"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>
            ))}
            <Button type="button" variant="secondary" onClick={addToolField} className="w-full mt-2">
              <PlusIcon className="w-5 h-5"/> Adicionar Ferramenta
            </Button>
          </div>

          <div className="flex justify-end pt-4">
            <Button type="submit">{isEditing ? 'Salvar Alterações' : 'Salvar Canal'}</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddChannelModal;