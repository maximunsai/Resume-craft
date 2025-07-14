'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { FileText, Lock, Mail } from 'lucide-react'; // Import icons for a better UI

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (isRegistering) {
                const { error: signUpError } = await supabase.auth.signUp({ email, password });
                if (signUpError) throw signUpError;
                alert('Registration successful! Please check your email to confirm your account.');
                // Optional: redirect to a "check your email" page
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
    
    // Consistent dark-themed input styles
    const inputStyles = "w-full p-3 pl-10 border border-gray-600 bg-gray-700 text-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors";

    return (
        // Main container inherits dark theme from globals.css
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-md p-8 space-y-8 bg-gray-800 rounded-2xl shadow-2xl border border-gray-700">
                <div className="text-center">
                    <div className="inline-block p-3 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-lg mb-4">
                       <FileText className="w-8 h-8 text-gray-900" />
                    </div>
                    <h1 className="text-3xl font-poppins font-bold text-white">
                        {isRegistering ? 'Enter the Forge' : 'Welcome Back'}
                    </h1>
                    <p className="mt-2 text-gray-400">
                        {isRegistering ? 'Create an account to start crafting.' : 'Sign in to access your projects.'}
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleAuth}>
                    <div className="space-y-4">
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
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
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
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

                <p 
                    className="mt-4 text-center text-sm text-gray-400" 
                >
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
    );
}