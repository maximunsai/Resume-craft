'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { FileText, Lock, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Component 1: The New, High-Fidelity Animation Sequence ---

const AnimationSequence = ({ onComplete }: { onComplete: () => void }) => {
  // This state controls the entire timeline of the animation
  const [animationStep, setAnimationStep] = useState(0);

  useEffect(() => {
    // A simple, clear timeline for our sequence
    const sequenceTimeouts = [
      () => setAnimationStep(1), // Step 1: Character appears
      () => setAnimationStep(2), // Step 2: Resume slides in
      () => setAnimationStep(3), // Step 3: Character and Resume slide off, revealing the form
      onComplete,                // Step 4: Signal to the parent component that the animation is done
    ];

    if (animationStep < sequenceTimeouts.length) {
      // Adjust timing here to perfect the feel
      const duration = animationStep === 2 ? 2000 : 1500;
      const timer = setTimeout(sequenceTimeouts[animationStep], duration);
      return () => clearTimeout(timer);
    }
  }, [animationStep, onComplete]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* The Forge Master Character SVG */}
      <motion.div
        className="absolute top-1/2 left-0"
        initial={{ x: -200, y: '-50%' }}
        animate={{
          x: animationStep >= 1 ? '25vw' : -200, // Slides in from the left
          transition: { duration: 1, ease: 'circOut' },
        }}
      >
        {/* We wrap the SVG in a motion.div to control its position */}
        <motion.svg
          width="120"
          height="200"
          viewBox="0 0 120 200"
          // Animate the character's "action" pose
          animate={{
            y: animationStep === 2 ? [0, -10, 0] : 0, // Subtle hover/breathing effect
            transition: { repeat: Infinity, duration: 2, ease: 'easeInOut' },
          }}
        >
          <g>
            {/* Head */}
            <circle cx="60" cy="30" r="20" fill="#FBBF24" />
            {/* Body */}
            <rect x="40" y="50" width="40" height="70" rx="20" fill="#1F2937" />
            {/* Arm that will "drag" the resume */}
            <motion.line
              x1="75" y1="70" x2="110" y2="90"
              stroke="#FBBF24" strokeWidth="8" strokeLinecap="round"
              // The arm extends when the resume is present
              animate={{
                x2: animationStep === 2 ? 150 : 110,
                transition: { duration: 0.5, ease: 'backOut' },
              }}
            />
          </g>
        </motion.svg>
      </motion.div>

      {/* The Resume SVG */}
      <motion.div
        className="absolute top-1/2"
        style={{ y: '-50%' }}
        initial={{ x: '100vw', opacity: 0 }}
        // Animate the resume based on the current step
        animate={{
          x: animationStep === 2 ? 'calc(25vw + 140px)' : '100vw', // Slides in to meet the character
          opacity: animationStep === 2 ? 1 : 0,
          transition: { duration: 1, ease: 'circOut' },
        }}
      >
        {/* This entire group will be dragged off-screen */}
        <motion.div
          animate={{
            x: animationStep >= 3 ? '-150vw' : 0, // The "drag off" animation
            transition: { duration: 1.5, ease: 'circIn' },
          }}
        >
          <svg width="200" height="280" viewBox="0 0 200 280" fill="none">
            <rect width="200" height="280" rx="12" fill="#1F2937" stroke="#4B5567" strokeWidth="2" />
            <rect x="20" y="30" width="90" height="12" rx="4" fill="#FBBF24" />
            <rect x="20" y="60" width="160" height="6" rx="2" fill="#4B5567" />
            <rect x="20" y="72" width="140" height="6" rx="2" fill="#4B5567" />
            <rect x="20" y="92" width="160" height="6" rx="2" fill="#4B5567" />
            <rect x="20" y="104" width="160" height="6" rx="2" fill="#4B5567" />
            <rect x="20" y="116" width="120" height="6" rx="2" fill="#4B5567" />
          </svg>
        </motion.div>
      </motion.div>
    </div>
  );
};


// --- The Main LoginPage Component ---
// This orchestrates the animation and the form, now with the correct logic.

export default function LoginPage() {
    // State Management (unchanged)
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [showAnimation, setShowAnimation] = useState(true);
    
    // Hooks (unchanged)
    const router = useRouter();
    const supabase = createClient();

    // Supabase Auth Function (unchanged and correct)
    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            if (isRegistering) {
                const { error: signUpError } = await supabase.auth.signUp({ email, password });
                if (signUpError) throw signUpError;
                alert('Registration successful! Please check your email to confirm your account.');
            } else {
                const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
                if (signInError) throw signInError;
                router.push('/builder');
                router.refresh(); 
            }
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError('An unexpected error occurred.');
            }
        } finally {
            setLoading(false);
        }
    };

    const inputStyles = "w-full p-3 pl-10 border border-gray-700 bg-gray-800 text-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors placeholder-gray-500";

    return (
        <div className="min-h-screen bg-[#111827] flex items-center justify-center p-4 overflow-hidden relative">
            
            {/* The Animation Layer */}
            <AnimatePresence>
                {showAnimation && <AnimationSequence onComplete={() => setShowAnimation(false)} />}
            </AnimatePresence>

            {/* The Login Form Layer */}
            <AnimatePresence>
                {!showAnimation && (
                    <motion.div
                        className="w-full max-w-md"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.7, ease: 'backOut' }}
                    >
                        <div className="p-8 space-y-8 bg-[#1F2937] rounded-2xl shadow-2xl border border-gray-700">
                            <div className="text-center">
                                <div className="inline-block p-3 bg-yellow-400 rounded-lg mb-4">
                                   <FileText className="w-8 h-8 text-gray-900" />
                                </div>
                                <h1 className="text-3xl font-poppins font-bold text-white">
                                    {isRegistering ? 'Create Account' : 'Welcome Back'}
                                </h1>
                                <p className="mt-2 text-gray-400">
                                    {isRegistering ? 'Enter the forge to begin.' : 'Sign in to access your projects.'}
                                </p>
                            </div>

                            <form className="mt-8 space-y-6" onSubmit={handleAuth}>
                                <div className="space-y-4">
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                        <input 
                                            type="email" 
                                            placeholder="Email address" 
                                            value={email} 
                                            onChange={(e) => setEmail(e.target.value)} 
                                            className={inputStyles} 
                                            required 
                                        />
                                    </div>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                        <input 
                                            type="password" 
                                            placeholder="Password" 
                                            value={password} 
                                            onChange={(e) => setPassword(e.target.value)} 
                                            className={inputStyles} 
                                            required 
                                        />
                                    </div>
                                </div>

                                <div>
                                    <button 
                                        type="submit" 
                                        disabled={loading}
                                        className="w-full p-3 bg-yellow-400 text-gray-900 font-bold rounded-lg hover:bg-yellow-500 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
                                    >
                                        {loading ? 'Processing...' : (isRegistering ? 'Create Account' : 'Sign In')}
                                    </button>
                                </div>
                                {error && <p className="text-center text-red-400 text-sm mt-2">{error}</p>}
                            </form>

                            <p className="mt-4 text-center text-sm text-gray-400">
                                {isRegistering ? 'Already have an account? ' : "Don't have an account? "}
                                <span
                                  className="font-semibold text-yellow-400 hover:text-yellow-300 cursor-pointer"
                                  onClick={() => {
                                      setIsRegistering(!isRegistering);
                                      setError(null);
                                  }}
                                >
                                  {isRegistering ? 'Sign In' : 'Register'}
                                </span>
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
