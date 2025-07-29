'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { FileText, Lock, Mail, User, Star, Briefcase, Award } from 'lucide-react';

// Type definition for a particle
type Particle = {
    id: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    opacity: number;
    color: string; // Color will now be yellow
};

export default function EnhancedAnimatedLoginPage() {
    // State Management (no changes needed)
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [animationPhase, setAnimationPhase] = useState('loading');
    const [particles, setParticles] = useState<Particle[]>([]);
    
    // Hooks (no changes needed)
    const router = useRouter();
    const supabase = createClient();

    // Animation useEffects
    useEffect(() => {
        // THEME UPDATE: Particles are now shades of yellow
        const initialParticles: Particle[] = Array.from({ length: 50 }, (_, i) => ({
            id: i,
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            vx: (Math.random() - 0.5) * 0.5, // Slower particle movement
            vy: (Math.random() - 0.5) * 0.5,
            size: Math.random() * 2 + 1,
            opacity: Math.random() * 0.5 + 0.1,
            color: '#FBBF24' // Consistent yellow color
        }));
        setParticles(initialParticles);

        // Animation sequence timing (no changes needed)
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
        // Particle animation loop (no changes needed)
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

    // Supabase Auth Function (no changes needed)
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

    // THEME UPDATE: Input styles adjusted for the new theme
    const inputStyles = "w-full p-3 pl-10 border border-gray-700 bg-gray-800 text-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors placeholder-gray-500";

    return (
        // THEME UPDATE: Main background is now dark gray/black
        <div className="min-h-screen bg-[#111827] overflow-hidden relative">
            
            {/* THEME UPDATE: Particle system remains, but colors are now yellow */}
            <div className="absolute inset-0 pointer-events-none">
                {particles.map(particle => (
                    <div
                        key={particle.id}
                        className="absolute rounded-full"
                        style={{
                            left: `${particle.x}px`,
                            top: `${particle.y}px`,
                            width: `${particle.size}px`,
                            height: `${particle.size}px`,
                            backgroundColor: particle.color,
                            opacity: particle.opacity,
                            boxShadow: `0 0 8px ${particle.color}`
                        }}
                    />
                ))}
            </div>

            {/* Loading Screen (Unchanged, already fits theme) */}
            <div className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 ${
                animationPhase === 'loading' ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}>
                <div className="text-center">
                    <div className="w-24 h-24 border-4 border-yellow-400/30 border-t-yellow-400 rounded-full animate-spin mb-6 mx-auto"></div>
                    <h2 className="text-2xl font-bold text-white">Initializing Forge...</h2>
                </div>
            </div>

            {/* All animation logic is preserved, only colors are changed in the JSX */}
            
            {/* THEME UPDATE: All animated components now use the black/yellow theme */}
            <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-1500 ease-out ${
                animationPhase === 'intro' 
                    ? 'opacity-100 scale-100' 
                    : animationPhase === 'character'
                    ? 'opacity-100 scale-75 translate-y-[-250px]'
                    : 'opacity-0 scale-50'
            } z-30`}>
                <div className="text-center">
                    <div className="w-24 h-24 bg-yellow-400 rounded-full mx-auto flex items-center justify-center shadow-lg ring-4 ring-white/10 mb-4">
                        <FileText className="w-12 h-12 text-gray-900" />
                    </div>
                    <h1 className="text-4xl font-bold text-white">Career Forge</h1>
                    <p className="text-gray-400">Your professional journey starts here.</p>
                </div>
            </div>

            {/* ... Other animation components would be here if they existed in the previous version */}

            {/* Login Form Container */}
            <div className={`min-h-screen flex items-center justify-center p-4 transition-opacity duration-1000 ${
                animationPhase === 'complete' ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}>
                <div className={`w-full max-w-md transform transition-all duration-1000 ${
                    animationPhase === 'complete' ? 'scale-100 translate-y-0' : 'scale-95 translate-y-10'
                }`}>
                    {/* THEME UPDATE: Form container matches the reference image */}
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
                                {/* THEME UPDATE: Button style matches reference */}
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
                </div>
            </div>
        </div>
    );
}
