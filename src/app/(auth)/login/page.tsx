'use client';

import { useState, useEffect, useRef } from 'react';
import { FileText, Lock, Mail, User, Star, Briefcase, Award } from 'lucide-react';

// --- FIX 1: Define the shape of a single particle ---
// This tells TypeScript what a "Particle" object looks like.
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
    // Existing login state
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    
    // Enhanced animation state
    const [animationPhase, setAnimationPhase] = useState('loading'); // loading -> intro -> character -> magic -> reveal -> complete
    
    // --- FIX 2: Tell useState it will hold an array of Particles ---
    const [particles, setParticles] = useState<Particle[]>([]); // Changed from useState([]) to useState<Particle[]>([])
    
    const canvasRef = useRef(null);

    // Initialize particles and start animation sequence
    useEffect(() => {
        // This part now works because TypeScript knows what a Particle is.
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

        // Animation sequence with enhanced timing
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

    // Particle animation loop
    useEffect(() => {
        let animationFrameId: number;

        const animateParticles = () => {
            setParticles(prevParticles => prevParticles.map(p => {
                let newX = p.x + p.vx;
                let newY = p.y + p.vy;

                // Boundary checks
                if (newX > window.innerWidth) newX = 0;
                if (newX < 0) newX = window.innerWidth;
                if (newY > window.innerHeight) newY = 0;
                if (newY < 0) newY = window.innerHeight;

                return {
                    ...p,
                    x: newX,
                    y: newY,
                };
            }));
            animationFrameId = requestAnimationFrame(animateParticles);
        };

        animationFrameId = requestAnimationFrame(animateParticles);
        
        return () => cancelAnimationFrame(animationFrameId);
    }, []);


    // --- The rest of your component remains unchanged ---
    // It was already well-structured. The only issue was the type inference.

    const handleAuth = async () => {
        setLoading(true);
        setError(null);

        try {
            if (isRegistering) {
                await new Promise(resolve => setTimeout(resolve, 1500));
                alert('Registration successful! Please check your email to confirm your account.');
            } else {
                await new Promise(resolve => setTimeout(resolve, 1500));
                alert('Login successful! Redirecting...');
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
            
            {/* Animated Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-pink-900/20 animate-pulse"></div>
            
            {/* Dynamic Particle System */}
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

            {/* Loading Screen */}
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

            {/* Company Logo/Intro */}
            <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-2000 ease-out ${
                animationPhase === 'intro' 
                    ? 'opacity-100 scale-100' 
                    : animationPhase === 'character'
                    ? 'opacity-100 scale-75 translate-y-[-300px]'
                    : 'opacity-0 scale-50'
            } z-30`}>
                <div className="text-center">
                    <div className="relative mb-6">
                        <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mx-auto flex items-center justify-center shadow-2xl ring-4 ring-white/20">
                            <Briefcase className="w-12 h-12 text-white" />
                        </div>
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center animate-bounce">
                            <Star className="w-4 h-4 text-white" />
                        </div>
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                        Career Forge
                    </h1>
                    <p className="text-gray-300 text-lg">Crafting Professional Excellence</p>
                </div>
            </div>

            {/* Enhanced Animated Character */}
            <div 
                className={`absolute transition-all duration-2000 ease-out z-20 ${
                    animationPhase === 'loading' || animationPhase === 'intro'
                        ? '-left-40 top-1/2 opacity-0 scale-75' 
                        : animationPhase === 'character'
                        ? 'left-16 top-1/2 opacity-100 scale-100'
                        : animationPhase === 'magic'
                        ? 'left-1/3 top-1/2 opacity-100 scale-110'
                        : 'left-8 top-1/2 opacity-30 scale-90'
                } transform -translate-y-1/2`}
                style={{
                    filter: animationPhase === 'magic' ? 'drop-shadow(0 0 20px #FDE047)' : 'none'
                }}
            >
                <div className="relative">
                    {/* Enhanced Character */}
                    <div className="w-20 h-28 relative">
                        {/* Head with face */}
                        <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full mx-auto mb-2 relative shadow-lg">
                            {/* Eyes */}
                            <div className="absolute top-3 left-2 w-2 h-2 bg-gray-800 rounded-full animate-blink"></div>
                            <div className="absolute top-3 right-2 w-2 h-2 bg-gray-800 rounded-full animate-blink"></div>
                            {/* Smile */}
                            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-2 border-b-2 border-gray-800 rounded-full"></div>
                            {/* Hair */}
                            <div className="absolute -top-1 left-1 w-10 h-6 bg-gray-700 rounded-t-full"></div>
                        </div>
                        
                        {/* Business Suit Body */}
                        <div className="w-10 h-12 bg-gradient-to-b from-gray-700 to-gray-800 rounded-lg mx-auto mb-2 relative">
                            {/* Tie */}
                            <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-2 h-8 bg-red-600 rounded-sm"></div>
                            {/* Suit buttons */}
                            <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-yellow-400 rounded-full"></div>
                            <div className="absolute top-5 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-yellow-400 rounded-full"></div>
                        </div>
                        
                        {/* Dynamic Arms */}
                        <div className={`absolute top-12 -left-3 w-8 h-3 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full transition-all duration-1000 shadow-lg ${
                            animationPhase === 'magic' ? 'rotate-45 scale-110' : 'rotate-12'
                        }`}></div>
                        <div className={`absolute top-12 -right-3 w-8 h-3 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full transition-all duration-1000 shadow-lg ${
                            animationPhase === 'magic' ? '-rotate-45 scale-110' : '-rotate-12'
                        }`}></div>
                        
                        {/* Professional Pants */}
                        <div className="absolute bottom-0 left-2 w-3 h-8 bg-gray-800 rounded-lg shadow-md"></div>
                        <div className="absolute bottom-0 right-2 w-3 h-8 bg-gray-800 rounded-lg shadow-md"></div>
                        
                        {/* Shoes */}
                        <div className="absolute -bottom-2 left-1 w-4 h-3 bg-black rounded-lg"></div>
                        <div className="absolute -bottom-2 right-1 w-4 h-3 bg-black rounded-lg"></div>
                    </div>
                    
                    {/* Enhanced Speech Bubble */}
                    <div className={`absolute -top-20 -right-12 bg-white rounded-2xl px-4 py-3 shadow-2xl transition-all duration-500 border-2 border-yellow-400 ${
                        (animationPhase === 'character' || animationPhase === 'magic') ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
                    }`}>
                        <div className="text-gray-800 text-sm font-bold whitespace-nowrap flex items-center">
                            {animationPhase === 'character' && (
                                <>
                                    <User className="w-4 h-4 mr-2 text-blue-500" />
                                    "Let me unlock your potential!"
                                </>
                            )}
                            {animationPhase === 'magic' && (
                                <>
                                    <Award className="w-4 h-4 mr-2 text-yellow-500 animate-spin" />
                                    "Revealing your career path..."
                                </>
                            )}
                        </div>
                        <div className="absolute bottom-0 left-6 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white transform translate-y-full"></div>
                    </div>

                    {/* Magic Sparkles */}
                    {animationPhase === 'magic' && (
                        <div className="absolute inset-0">
                            {[...Array(10)].map((_, i) => (
                                <div
                                    key={i}
                                    className="absolute w-2 h-2 bg-yellow-400 rounded-full animate-ping"
                                    style={{
                                        left: `${Math.random() * 80}px`,
                                        top: `${Math.random() * 120}px`,
                                        animationDelay: `${Math.random() * 1}s`,
                                        animationDuration: '1.5s'
                                    }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Enhanced Animated Resume */}
            <div 
                className={`absolute transition-all duration-2000 ease-out z-15 ${
                    animationPhase === 'loading' || animationPhase === 'intro' || animationPhase === 'character'
                        ? 'left-16 top-1/2 opacity-0 scale-50 rotate-45'
                        : animationPhase === 'magic'
                        ? 'left-1/2 top-1/2 opacity-100 scale-105 rotate-0'
                        : 'left-1/2 top-1/2 opacity-0 scale-150 rotate-12'
                } transform -translate-x-1/2 -translate-y-1/2`}
                style={{
                    filter: animationPhase === 'magic' ? 'drop-shadow(0 0 30px rgba(253, 224, 71, 0.5))' : 'none'
                }}
            >
                <div className="w-80 h-96 bg-gradient-to-br from-white to-gray-100 rounded-2xl shadow-2xl p-8 border-4 border-yellow-400 relative overflow-hidden">
                    {/* Resume Header */}
                    <div className="flex items-center mb-6">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-4">
                            <User className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-800 text-lg">Professional Resume</h3>
                            <p className="text-gray-600 text-sm">Career Excellence</p>
                        </div>
                    </div>
                    
                    {/* Animated Content Sections */}
                    <div className="space-y-4">
                        {/* Skills Section */}
                        <div className="space-y-2">
                            <div className="flex items-center mb-2">
                                <Award className="w-4 h-4 text-yellow-500 mr-2" />
                                <div className="h-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full w-20"></div>
                            </div>
                            {[100, 85, 95, 78].map((width, i) => (
                                <div key={i} className="flex items-center space-x-2">
                                    <div className="h-2 bg-gray-300 rounded-full flex-1">
                                        <div 
                                            className="h-2 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full transition-all duration-2000 ease-out"
                                            style={{ 
                                                width: animationPhase === 'magic' ? `${width}%` : '0%',
                                                transitionDelay: `${i * 200}ms`
                                            }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        {/* Experience Timeline */}
                        <div className="mt-6">
                            <div className="flex items-center mb-3">
                                <Briefcase className="w-4 h-4 text-blue-500 mr-2" />
                                <div className="h-3 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full w-24"></div>
                            </div>
                            <div className="space-y-3">
                                {[1, 2, 3].map((_, i) => (
                                    <div key={i} className="flex items-start space-x-3">
                                        <div className={`w-3 h-3 bg-blue-500 rounded-full mt-1 transition-all duration-500 ${
                                            animationPhase === 'magic' ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
                                        }`} style={{ transitionDelay: `${i * 300}ms` }}></div>
                                        <div className="flex-1">
                                            <div className={`h-2 bg-gray-300 rounded mb-1 transition-all duration-700 ${
                                                animationPhase === 'magic' ? 'w-full opacity-100' : 'w-0 opacity-0'
                                            }`} style={{ transitionDelay: `${i * 300 + 200}ms` }}></div>
                                            <div className={`h-1 bg-gray-200 rounded w-3/4 transition-all duration-700 ${
                                                animationPhase === 'magic' ? 'opacity-100' : 'opacity-0'
                                            }`} style={{ transitionDelay: `${i * 300 + 400}ms` }}></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Floating Elements */}
                    <div className="absolute top-4 right-4">
                        <div className={`w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center transition-all duration-1000 ${
                            animationPhase === 'magic' ? 'animate-bounce' : ''
                        }`}>
                            <Star className="w-3 h-3 text-white" />
                        </div>
                    </div>

                    {/* Magic Overlay */}
                    {animationPhase === 'magic' && (
                        <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 to-transparent animate-pulse"></div>
                    )}
                </div>
            </div>

            {/* Enhanced Login Form */}
            <div className={`min-h-screen flex items-center justify-center p-4 transition-all duration-2000 ${
                animationPhase === 'complete' ? 'opacity-100' : 'opacity-0'
            }`}>
                <div className={`w-full max-w-lg p-10 space-y-8 bg-gray-900/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-700/50 transform transition-all duration-2000 ${
                    animationPhase === 'complete' ? 'scale-100 translate-y-0' : 'scale-90 translate-y-8'
                }`}>
                    
                    {/* Enhanced Header */}
                    <div className="text-center relative">
                        <div className="inline-block p-4 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 rounded-2xl mb-6 transform transition-all duration-500 hover:scale-110 hover:rotate-6 shadow-2xl">
                           <FileText className="w-10 h-10 text-white" />
                           <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
                        </div>
                        
                        <h1 className="text-4xl font-bold text-transparent bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text mb-2">
                            {isRegistering ? 'Join the Revolution' : 'Welcome Back, Creator'}
                        </h1>
                        <p className="text-gray-400 text-lg">
                            {isRegistering ? 'Begin your journey to professional excellence' : 'Continue crafting your success story'}
                        </p>
                        
                        {/* Animated Underline */}
                        <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mx-auto mt-4 animate-pulse"></div>
                    </div>

                    {/* Enhanced Form */}
                    <div className="mt-10 space-y-6">
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
                                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-yellow-400/0 via-yellow-400/0 to-yellow-400/0 group-focus-within:from-yellow-400/10 group-focus-within:via-orange-500/10 group-focus-within:to-red-500/10 transition-all duration-300 pointer-events-none"></div>
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
                                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-yellow-400/0 via-yellow-400/0 to-yellow-400/0 group-focus-within:from-yellow-400/10 group-focus-within:via-orange-500/10 group-focus-within:to-red-500/10 transition-all duration-300 pointer-events-none"></div>
                            </div>
                        </div>

                        {/* Enhanced Submit Button */}
                        <div className="pt-4">
                            <button 
                                type="button"
                                onClick={handleAuth}
                                disabled={loading}
                                className="w-full p-4 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white font-bold text-lg rounded-xl hover:shadow-2xl active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 relative overflow-hidden group"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 via-orange-400 to-red-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <div className="relative flex items-center justify-center">
                                    {loading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                                            <span>Processing Your Request...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>{isRegistering ? 'Create Your Account' : 'Access Your Workspace'}</span>
                                            <div className="ml-3 w-6 h-6 bg-white/20 rounded-full flex items-center justify-center group-hover:rotate-180 transition-transform duration-500">
                                                <div className="w-3 h-3 bg-white rounded-full"></div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </button>
                        </div>
                        
                        {/* Enhanced Error Display */}
                        {error && (
                            <div className="text-center text-red-400 text-sm mt-4 p-4 bg-red-900/20 rounded-xl border border-red-800 backdrop-blur-sm animate-pulse">
                                <div className="flex items-center justify-center">
                                    <div className="w-4 h-4 bg-red-500 rounded-full mr-2 animate-bounce"></div>
                                    {error}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Enhanced Toggle */}
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

            {/* Enhanced Background Effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Floating Geometric Shapes */}
                {[...Array(8)].map((_, i) => (
                    <div
                        key={`shape-${i}`}
                        className="absolute opacity-20 animate-float"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 5}s`,
                            animationDuration: `${8 + Math.random() * 4}s`
                        }}
                    >
                        <div className={`w-${4 + Math.floor(Math.random() * 8)} h-${4 + Math.floor(Math.random() * 8)} bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg transform rotate-45`}></div>
                    </div>
                ))}
                
                {/* Glowing Orbs */}
                {[...Array(5)].map((_, i) => (
                    <div
                        key={`orb-${i}`}
                        className="absolute w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 3}s`,
                            animationDuration: `${4 + Math.random() * 2}s`
                        }}
                    />
                ))}
            </div>

            {/* Custom CSS Animations */}
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
