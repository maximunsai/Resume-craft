// src/components/VoiceSelectionMenu.tsx

'use client';

import { useState, useEffect } from 'react';
import { useSpeechSynthesis, AppVoice } from '@/hooks/useSpeechSynthesis'; // Your existing hook
import { useInterviewStore } from '@/store/interviewStore';
import { UserCog } from 'lucide-react';

export const VoiceSelectionMenu = () => {
    // Local state to control if the dropdown is open
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    // Get the list of voices from our hook
    const { voices, supported: ttsSupported } = useSpeechSynthesis();
    
    // Get the currently selected voice and the function to set it from our global store
    const { selectedVoice, setSelectedVoice } = useInterviewStore();

    // Effect to set a default voice when the component loads and voices are available
    useEffect(() => {
        if (!selectedVoice && voices.length > 0) {
            // Prefer a high-quality Google voice, otherwise take the first available
            const defaultVoice = voices.find(v => v.name.includes('Google US English')) || voices[0];
            setSelectedVoice(defaultVoice);
        }
    }, [voices, selectedVoice, setSelectedVoice]);

    // Don't render anything if TTS is not supported by the browser
    if (!ttsSupported) {
        return null;
    }

    return (
        <div className="relative">
            {/* The button that shows the current voice and toggles the menu */}
            <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-700 rounded-lg text-sm hover:bg-gray-600 transition-colors"
            >
                <UserCog size={16} />
                <span className="truncate w-40 text-left">
                    {selectedVoice ? selectedVoice.name : 'Loading Voices...'}
                </span>
            </button>

            {/* The dropdown menu */}
            {isMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-72 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-10">
                    <p className="p-3 text-xs text-gray-400 border-b border-gray-700">Select Interviewer Voice</p>
                    <ul className="max-h-60 overflow-y-auto">
                        {voices.length > 0 ? voices.map(voiceOption => (
                            <li key={voiceOption.name}>
                                <button 
                                    onClick={() => {
                                        setSelectedVoice(voiceOption);
                                        setIsMenuOpen(false);
                                    }}
                                    className={`w-full text-left px-3 py-2 text-sm hover:bg-yellow-500/20 ${selectedVoice?.name === voiceOption.name ? 'text-yellow-400' : ''}`}
                                >
                                    {voiceOption.name}
                                </button>
                            </li>
                        )) : (
                            <li className="px-3 py-2 text-sm text-gray-500">No voices available.</li>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
};