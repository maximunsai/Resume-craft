import { create } from 'zustand';

// Define the Message type
export type Message = {
  sender: 'user' | 'AI';
  text: string;
};

// Define the InterviewStore type
interface InterviewStore {
  messages: Message[];
  selectedPersonaId: string | null; // Added: To store the ID for premium voices
  selectedVoice: string | null;     // Added: To store the ID for standard voices
  stage: 'Technical' | 'HR' | 'Situational' | 'General'; // Added: To track interview stage
  
  // Actions
  addMessage: (message: Message) => void;
  updateLastAIMessage: (text: string) => void; // New action for streaming updates
  startNewInterview: (initialMessage?: string) => void;
  clearInterview: () => void;
  setSelectedPersonaId: (id: string | null) => void;
  setSelectedVoice: (id: string | null) => void;
  setStage: (stage: InterviewStore['stage']) => void; // Action to set the stage
}

// Create the Zustand store
export const useInterviewStore = create<InterviewStore>((set, get) => ({
  // --- Initial State ---
  messages: [],
  selectedPersonaId: null, // Initialize
  selectedVoice: null,     // Initialize
  stage: 'General',        // Initialize with a default stage (e.g., 'General' or 'Behavioral')

  // --- Actions ---
  addMessage: (message) => set((state) => ({
    messages: [...state.messages, message]
  })),

  updateLastAIMessage: (text) => set((state) => {
    // Find the last message and update its text
    const lastMessage = state.messages[state.messages.length - 1];
    if (lastMessage && lastMessage.sender === 'AI') {
      // Create a new array with the updated last message
      const updatedMessages = [...state.messages.slice(0, -1), { ...lastMessage, text }];
      return { messages: updatedMessages };
    }
    // If somehow no AI message is last, add a new one (shouldn't typically happen if placeholder added)
    return { messages: [...state.messages, { sender: 'AI', text }] };
  }),

  startNewInterview: (initialMessage) => set((state) => ({
    messages: initialMessage ? [{ sender: 'AI', text: initialMessage }] : [],
    // You might want to reset other state here too if starting fresh,
    // like selectedPersonaId, selectedVoice, stage based on the new interview context
  })),

  clearInterview: () => set({
    messages: [],
    // You might want to reset selectedPersonaId and selectedVoice here too,
    // or keep them if they persist across interviews.
    // For now, let's reset them to ensure a clean slate unless intentionally persisted.
    selectedPersonaId: null,
    selectedVoice: null,
    stage: 'General' // Reset stage to default
  }),

  setSelectedPersonaId: (id) => set({ selectedPersonaId: id }),
  setSelectedVoice: (id) => set({ selectedVoice: id }),
  setStage: (stage) => set({ stage: stage }),
}));