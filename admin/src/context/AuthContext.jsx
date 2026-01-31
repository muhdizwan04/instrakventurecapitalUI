import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // OPTIMIZATION: Check for local session immediately to unblock guests
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        let hasLocalSession = false;
        
        try {
            if (supabaseUrl) {
                // Extract project ref from URL (e.g. https://xyz.supabase.co -> xyz)
                const projectRef = supabaseUrl.split('.')[0].split('//')[1];
                const storageKey = `sb-${projectRef}-auth-token`;
                const localData = localStorage.getItem(storageKey);
                if (localData) {
                    hasLocalSession = true;
                }
            }
        } catch (e) {
            console.warn('[AuthContext] Local storage check failed', e);
        }

        // If no local session, we can release loading state immediately for guests
        if (!hasLocalSession) {
            console.log('[AuthContext] No local session found, skipping wait.');
            setLoading(false);
        }

        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            setLoading(false);
        }).catch(err => {
            console.error('[AuthContext] getSession failed:', err);
            toast.error('Unable to verify login session. You may be working offline.');
            setLoading(false);
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    // Safety timeout: If auth check hangs for more than 2.5 seconds, stop loading
    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading((currentLoading) => {
                if (currentLoading) {
                    console.warn('[AuthContext] Auth check timed out, forcing loading=false');
                    toast.error('Authentication check timed out. Proceeding in offline mode.');
                    return false;
                }
                return currentLoading;
            });
        }, 2500);
        return () => clearTimeout(timer);
    }, []);

    const login = async (email, password) => {
        // Create a timeout promise
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Login request timed out. Please check your network connection.')), 10000);
        });

        // Race the login against the timeout
        const loginPromise = supabase.auth.signInWithPassword({
            email,
            password
        });

        const { data, error } = await Promise.race([loginPromise, timeoutPromise]);
        
        if (error) throw error;
        return data;
    };

    const logout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
