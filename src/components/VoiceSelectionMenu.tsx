// src/components/VoiceSelectionMenu.tsx - FIXED VERSION

'use client';
import { useState, useEffect } from 'react';
import { useInterviewStore } from '@/store/interviewStore';
import { UserCog, Check, ChevronDown } from 'lucide-react';

interface ClientVoice { 
  personaId: string; 
  name: string; 
}

export const VoiceSelectionMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [voices, setVoices] = useState<ClientVoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fixed the store selector
  const { selectedPersonaId, setSelectedPersonaId } = useInterviewStore(state => ({
    selectedPersonaId: state.selectedPersonaId,
    setSelectedPersonaId: state.setSelectedPersonaId,
  }));

  useEffect(() => {
    const fetchVoices = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch('/api/voices');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch voices: ${response.status}`);
        }
        
        const data = await response.json();
        setVoices(data);
        
        // Set a default if none is selected
        if (!selectedPersonaId && data.length > 0) {
          setSelectedPersonaId(data[0].personaId);
        }
      } catch (err) {
        console.error('Error fetching voices:', err);
        setError(err instanceof Error ? err.message : 'Failed to load voices');
      } finally {
        setIsLoading(false);
      }
    };

    fetchVoices();
  }, [selectedPersonaId, setSelectedPersonaId]);

  const currentVoiceName = voices.find(v => v.personaId === selectedPersonaId)?.name || 'Select Voice';

  const handleVoiceSelect = (personaId: string) => {
    setSelectedPersonaId(personaId);
    setIsMenuOpen(false);
  };

  if (error) {
    return (
      <div className="relative">
        <div className="flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-200 rounded-lg text-red-700">
          <UserCog size={16} />
          <span className="text-sm">Error loading voices</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Main Button */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        disabled={isLoading}
        className={`
          flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg
          hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-colors duration-200
        `}
      >
        <UserCog size={16} className="text-gray-600" />
        <span className="text-sm font-medium text-gray-700">
          {isLoading ? 'Loading...' : currentVoiceName}
        </span>
        <ChevronDown 
          size={16} 
          className={`text-gray-400 transition-transform duration-200 ${
            isMenuOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isMenuOpen && !isLoading && (
        <div className="absolute top-full left-0 mt-2 w-full min-w-[200px] bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="py-2">
            {voices.length === 0 ? (
              <div className="px-4 py-2 text-sm text-gray-500">
                No voices available
              </div>
            ) : (
              voices.map((voice) => (
                <button
                  key={voice.personaId}
                  onClick={() => handleVoiceSelect(voice.personaId)}
                  className={`
                    w-full flex items-center justify-between px-4 py-2 text-left
                    hover:bg-gray-50 focus:outline-none focus:bg-gray-50
                    transition-colors duration-150
                    ${selectedPersonaId === voice.personaId ? 'bg-blue-50' : ''}
                  `}
                >
                  <span className={`text-sm ${
                    selectedPersonaId === voice.personaId 
                      ? 'text-blue-700 font-medium' 
                      : 'text-gray-700'
                  }`}>
                    {voice.name}
                  </span>
                  {selectedPersonaId === voice.personaId && (
                    <Check size={16} className="text-blue-600" />
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}

      {/* Backdrop to close menu when clicking outside */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </div>
  );
};