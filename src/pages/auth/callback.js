import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from 'lib/supabase';

const AuthCallback = () => {
    const router = useRouter();

    useEffect(() => {
        const handleAuthCallback = async () => {
            const { code } = router.query;

            if (code) {
                const { error } = await supabase.auth.exchangeCodeForSession(code);

                if (error) {
                    console.error('Error exchanging code for session:', error);
                    router.push('/signin?error=auth_code_error');
                } else {
                    router.push('/');
                }
            } else {
                // Handle cases where there is no code (e.g. hash fragment or just direct navigation)
                // supabase.auth.onAuthStateChange in _app.js might handle some cases, 
                // but if we land here without code, we should probably redirect home or to signin

                // Check if we have a session anyway
                const { data: { session } } = await supabase.auth.getSession();
                if (session) {
                    router.push('/');
                } else {
                    // Give it a moment or redirect
                    router.push('/');
                }
            }
        };

        if (router.isReady) {
            handleAuthCallback();
        }
    }, [router.isReady, router.query]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-primary">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-white mb-4">Verifying authentication...</h2>
                <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
            </div>
        </div>
    );
};

export default AuthCallback;
