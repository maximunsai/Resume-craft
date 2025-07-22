'use client';

import { useState, useEffect } from 'react';
import { useNativeSpeechSynthesis } from '@/hooks/useNativeSpeechSynthesis';
import { useInterviewStore } from '@/store/interviewStore';
import { UserCog, Check } from 'lucide-react';

export const VoiceSelectionMenu = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    // This hook provides the list of native browser voices.
    const { voices, supported: ttsSupported } = useNativeSpeechSynthesis();
    
    // The correct, performant way to get state and actions from the store.
    const { selectedVoice, setSelectedVoice } = useInterviewStore(state => ({
        selectedVoice: state.selectedVoice,
        setSelectedVoice: state.setSelectedVoice,
    }));

    // This effect sets a default native voice when the component loads.
    useEffect(() => {
        if (!selectedVoice && voices.length > 0) {
            const defaultVoice = voices.find(v => v.name.includes('Google US English')) || voices.find(v => v.name.includes('Microsoft David')) || voices[0];
            setSelectedVoice(defaultVoice);
        }
    }, [voices, selectedVoice, setSelectedVoice]);

    // The VoiceSelectionMenu is now correctly understood to control the FALLBACK native voice.
    // The premium voice is handled separately.
    if (!ttsSupported) {
        return null;
    }

    return (
        <div className="relative">
            <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-700 rounded-lg text-sm hover:bg-gray-600 transition-colors w-52 justify-between"
            >
                <UserCog size={16} />
                <span className="truncate flex-1 text-left">
                    {selectedVoice ? selectedVoice.name : 'Select Fallback Voice'}
                </span>
            </button>

            {isMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-72 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-10">
                    <p className="p-3 text-xs text-gray-400 border-b border-gray-700">Select Fallback Voice</p>
                    <ul className="max-h-60 overflow-y-auto">
                        {voices.length > 0 ? voices.map(voiceOption => (
                            <li key={voiceOption.name}>
                                <button 
                                    onClick={() => {
                                        setSelectedVoice(voiceOption);
                                        setIsMenuOpen(false);
                                    }}
                                    className={`w-full text-left px-3 py-2 text-sm hover:bg-yellow-500/20 flex items-center justify-between ${selectedVoice?.name === voiceOption.name ? 'text-yellow-400' : ''}`}
                                >
                                    <span>{voiceOption.name}</span>
                                    {selectedVoice?.name === voiceOption.name && <Check size={16} />}
                                </button>
                            </li>
                        )) : (
                            <li className="px-3 py-2 text-sm text-gray-500">No native voices found.</li>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
};