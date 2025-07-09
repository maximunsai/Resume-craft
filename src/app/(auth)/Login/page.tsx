// src/app/(auth)/login/page.tsx
'use client';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const supabase = createClient();

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            if (isRegistering) {
                const { error } = await supabase.auth.signUp({ email, password });
                if (error) throw error;
                // Use a non-problematic string here
                alert('Registration successful! Please check your email to confirm your account.');
            } else {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
                router.push('/builder');
                router.refresh(); // Good practice to refresh router state after login
            }
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError('An unexpected error occurred.');
            }
        }
    };
    
    // Using Tailwind classes for styling is better practice, but inline styles for demo
    const inputStyle = "w-full p-2 border border-gray-300 rounded mb-4 text-[#0A2647] bg-white focus:outline-none focus:ring-2 focus:ring-[#2C74B3]";
    const buttonStyle = "w-full p-3 bg-[#205295] text-white font-bold rounded-lg hover:bg-[#143F6B] transition-colors duration-300";

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F8F7F4]">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg">
                <div>
                    <h1 className="text-3xl font-bold text-center text-[#0A2647]">
                        {isRegistering ? 'Create Your Account' : 'Welcome Back'}
                    </h1>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleAuth}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <input 
                                type="email" 
                                placeholder="Email address" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                className={inputStyle} 
                                required 
                            />
                        </div>
                        <div>
                            <input 
                                type="password" 
                                placeholder="Password" 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                className={inputStyle} 
                                required 
                            />
                        </div>
                    </div>

                    <div>
                        <button type="submit" className={buttonStyle}>
                            {isRegistering ? 'Register' : 'Login'}
                        </button>
                    </div>
                    {error && <p className="text-center text-red-500 text-sm mt-2">{error}</p>}
                </form>
                <p 
                    className="mt-4 text-center text-sm text-[#2C74B3] hover:text-[#205295] cursor-pointer" 
                    onClick={() => {
                        setIsRegistering(!isRegistering);
                        setError(null); // Clear error on switch
                    }}
                >
                    {/* THIS IS THE CORRECTED LINE */}
                    {isRegistering ? 'Already have an account? Login' : "Don't have an account? Register"}
                </p>
            </div>
        </div>
    );
}