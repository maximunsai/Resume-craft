'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client'; // Restored for Supabase
import { useRouter } from 'next/navigation'; // Restored for routing
import { FileText, Lock, Mail, User, Star, Briefcase, Award } from 'lucide-react';

// Type definition for a particle (no changes needed here)
type Particle = {
    id: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    opacity: number;
    color: string;
};

export default function EnhancedAnimatedLoginPage() {
    // --- State Management ---
    // All state variables are correctly in place.
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [animationPhase, setAnimationPhase] = useState('loading');
    const [particles, setParticles] = useState<Particle[]>([]);
    
    // --- Hooks ---
    // Initialize Supabase client and Next.js router
    const router = useRouter();
    const supabase = createClient();

    // --- Animation useEffects (Unchanged) ---
    // This logic remains the same as it controls the visual flow.
    useEffect(() => {
        const initialParticles: Particle[] = Array.from({ length: 50 }, (_, i) => ({
            id: i,
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            size: Math.random() * 3 + 1,
            opacity: Math.random() * 0.8 + 0.2,
            color: ['#FDE047', '#FBBF24', '#F59E0B', '#3B82F6', '#8B5CF6'][Math.floor(Math.random() * 5)]
        }));
        setParticles(initialParticles);

        const timer1 = setTimeout(() => setAnimationPhase('intro'), 1000);
        const timer2 = setTimeout(() => setAnimationPhase('character'), 2500);
        const timer3 = setTimeout(() => setAnimationPhase('magic'), 4500);
        const timer4 = setTimeout(() => setAnimationPhase('reveal'), 6500);
        const timer5 = setTimeout(() => setAnimationPhase('complete'), 8000);
        
        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
            clearTimeout(timer3);
            clearTimeout(timer4);
            clearTimeout(timer5);
        };
    }, []);

    useEffect(() => {
        let animationFrameId: number;
        const animateParticles = () => {
            setParticles(prevParticles => prevParticles.map(p => {
                let newX = p.x + p.vx;
                let newY = p.y + p.vy;
                if (newX > window.innerWidth) newX = 0;
                if (newX < 0) newX = window.innerWidth;
                if (newY > window.innerHeight) newY = 0;
                if (newY < 0) newY = window.innerHeight;
                return { ...p, x: newX, y: newY };
            }));
            animationFrameId = requestAnimationFrame(animateParticles);
        };
        animationFrameId = requestAnimationFrame(animateParticles);
        return () => cancelAnimationFrame(animationFrameId);
    }, []);

    // --- CORRECTED handleAuth Function ---
    // Merged from your original, working code.
    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault(); // CRITICAL: Prevents page reload on form submission
        setLoading(true);
        setError(null);

        try {
            if (isRegistering) {
                // Real Supabase sign-up logic
                const { error: signUpError } = await supabase.auth.signUp({ email, password });
                if (signUpError) throw signUpError;
                // Using alert for now as in original, but a dedicated page is better UX
                alert('Registration successful! Please check your email to confirm your account.');
            } else {
                // Real Supabase sign-in logic
                const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
                if (signInError) throw signInError;
                // Real routing logic
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

    const inputStyles = "w-full p-4 pl-12 border-2 border-gray-600 bg-gray-800/50 backdrop-blur-sm text-gray-200 rounded-xl focus:ring-4 focus:ring-yellow-500/30 focus:border-yellow-400 transition-all duration-300 hover:border-gray-500 placeholder-gray-400";

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 overflow-hidden relative">
            {/* All animation divs remain the same */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-pink-900/20 animate-pulse"></div>
            <div className="absolute inset-0 pointer-events-none">
                {particles.map(particle => (
                    <div
                        key={particle.id}
                        className="absolute rounded-full transition-all duration-1000 ease-out"
                        style={{
                            left: `${particle.x}px`,
                            top: `${particle.y}px`,
                            width: `${particle.size}px`,
                            height: `${particle.size}px`,
                            backgroundColor: particle.color,
                            opacity: animationPhase === 'magic' ? 1 : particle.opacity * 0.6,
                            transform: animationPhase === 'magic' ? `scale(${particle.size * 2})` : 'scale(1)',
                            boxShadow: animationPhase === 'magic' ? `0 0 20px ${particle.color}` : 'none'
                        }}
                    />
                ))}
            </div>
            {/* ... other animation divs ... */}
            <div className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 ${
                animationPhase === 'loading' ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}>
                <div className="text-center">
                    <div className="w-32 h-32 border-4 border-yellow-400/30 border-t-yellow-400 rounded-full animate-spin mb-8 mx-auto"></div>
                    <h2 className="text-3xl font-bold text-white mb-4">Preparing Your Workspace</h2>
                    <div className="flex space-x-2 justify-center">
                        <div className="w-3 h-3 bg-yellow-400 rounded-full animate-bounce"></div>
                        <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                </div>
            </div>

            {/* --- CORRECTED LOGIN FORM --- */}
            <div className={`min-h-screen flex items-center justify-center p-4 transition-all duration-2000 ${
                animationPhase === 'complete' ? 'opacity-100' : 'opacity-0'
            }`}>
                <div className={`w-full max-w-lg p-10 space-y-8 bg-gray-900/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-700/50 transform transition-all duration-2000 ${
                    animationPhase === 'complete' ? 'scale-100 translate-y-0' : 'scale-90 translate-y-8'
                }`}>
                    
                    <div className="text-center relative">
                        {/* ... header content ... */}
                    </div>

                    {/* The form element is now correctly wrapping the inputs and button */}
                    <form className="mt-10 space-y-6" onSubmit={handleAuth}>
                        <div className="space-y-5">
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400 group-focus-within:text-yellow-400 group-focus-within:scale-110 transition-all duration-300" />
                                <input 
                                    type="email" 
                                    placeholder="Enter your email address" 
                                    value={email} 
                                    onChange={(e) => setEmail(e.target.value)} 
                                    className={inputStyles} 
                                    required 
                                />
                                {/* ... decorative div ... */}
                            </div>
                            
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400 group-focus-within:text-yellow-400 group-focus-within:scale-110 transition-all duration-300" />
                                <input 
                                    type="password" 
                                    placeholder="Enter your password" 
                                    value={password} 
                                    onChange={(e) => setPassword(e.target.value)} 
                                    className={inputStyles} 
                                    required 
                                />
                                {/* ... decorative div ... */}
                            </div>
                        </div>

                        <div className="pt-4">
                            {/* The button is now type="submit" */}
                            <button 
                                type="submit"
                                disabled={loading}
                                className="w-full p-4 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white font-bold text-lg rounded-xl hover:shadow-2xl active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 relative overflow-hidden group"
                            >
                                <div className="relative flex items-center justify-center">
                                    {loading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                                            <span>Processing...</span>
                                        </>
                                    ) : (
                                        <span>{isRegistering ? 'Create Your Account' : 'Access Your Workspace'}</span>
                                    )}
                                </div>
                            </button>
                        </div>
                        
                        {error && (
                            <div className="text-center text-red-400 text-sm mt-4 p-4 bg-red-900/20 rounded-xl border border-red-800 backdrop-blur-sm">
                                {error}
                            </div>
                        )}
                    </form>

                    <div className="pt-6 text-center">
                        <p className="text-gray-400 text-base">
                            {isRegistering ? 'Already part of our community? ' : "Ready to start your journey? "}
                            <span
                              className="font-bold text-transparent bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text hover:from-orange-500 hover:to-red-500 cursor-pointer transition-all duration-300 hover:scale-105 inline-block"
                              onClick={() => {
                                  setIsRegistering(!isRegistering);
                                  setError(null);
                              }}
                            >
                              {isRegistering ? 'Sign In Here' : 'Join Us Today'}
                            </span>
                        </p>
                    </div>
                </div>
            </div>

            {/* ... background effects and style tag ... */}
            <style jsx>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-20px) rotate(180deg); }
                }
                @keyframes blink {
                    0%, 90%, 100% { opacity: 1; }
                    95% { opacity: 0; }
                }
                .animate-float {
                    animation: float 6s ease-in-out infinite;
                }
                .animate-blink {
                    animation: blink 3s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
}
