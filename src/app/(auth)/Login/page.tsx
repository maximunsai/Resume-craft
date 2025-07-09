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
                alert('Registration successful! Please check your email to confirm.');
            } else {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
                router.push('/builder');
            }
        }catch (error) { // Change this line
        if (error instanceof Error) { // Add this check
            setError(error.message);
        } else {
            setError('An unexpected error occurred.');
        }
    }
    };
    
    // Simple inline styles for demonstration. Use Tailwind classes in a real app.
    const inputStyle = { border: '1px solid #ccc', padding: '8px', borderRadius: '4px', marginBottom: '10px', width: '100%' };
    const buttonStyle = { background: '#205295', color: 'white', padding: '10px', border: 'none', borderRadius: '4px', cursor: 'pointer', width: '100%' };

    return (
        <div style={{ maxWidth: '400px', margin: '100px auto', padding: '20px', background: '#F8F7F4', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            <h1 style={{ color: '#0A2647', textAlign: 'center' }}>{isRegistering ? 'Create Account' : 'Welcome Back'}</h1>
            <form onSubmit={handleAuth}>
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} required />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} required />
                <button type="submit" style={buttonStyle}>{isRegistering ? 'Register' : 'Login'}</button>
                {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
            </form>
            <p style={{ textAlign: 'center', marginTop: '20px', cursor: 'pointer', color: '#2C74B3' }} onClick={() => setIsRegistering(!isRegistering)}>
                {isRegistering ? 'Already have an account? Login' : "Don't have an account? Register"}
            </p>
        </div>
    );
}