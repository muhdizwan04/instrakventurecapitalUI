import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [clientProfile, setClientProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check if user has a client profile (separates client users from admin users)
    const checkClientProfile = async (userId) => {
        if (!userId) {
            setClientProfile(null);
            return null;
        }
        
        try {
            const { data, error } = await supabase
                .from('client_profiles')
                .select('id')
                .eq('id', userId)
                .maybeSingle();
            
            if (error && error.code !== 'PGRST116') {
                // PGRST116 = no rows found (expected for admin users)
                console.log('[AuthContext] Error checking client profile:', error.message);
            }
            
            setClientProfile(data || null);
            return data;
        } catch (err) {
            console.log('[AuthContext] Client profile check failed:', err);
            setClientProfile(null);
            return null;
        }
    };

    useEffect(() => {
        // OPTIMIZATION: Start client profile check early from localStorage
        let earlyProfileCheck = null;
        try {
            const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
            if (supabaseUrl) {
                const projectRef = supabaseUrl.split('.')[0].split('//')[1];
                const storageKey = `sb-${projectRef}-auth-token`;
                const localData = localStorage.getItem(storageKey);
                if (localData) {
                    const parsed = JSON.parse(localData);
                    const userId = parsed?.user?.id;
                    if (userId) {
                        earlyProfileCheck = checkClientProfile(userId);
                    }
                }
            }
        } catch (e) {
            // Fall through to normal flow
        }

        // Get initial session (runs in parallel with earlyProfileCheck)
        const t0 = performance.now();
        console.log('[Auth] 🔄 getSession START');
        supabase.auth.getSession().then(async ({ data: { session }, error }) => {
            console.log(`[Auth] ✅ getSession done in ${Math.round(performance.now() - t0)}ms, user=${session?.user?.email || 'none'}`);
            setUser(session?.user ?? null);
            
            if (session?.user) {
                const t1 = performance.now();
                if (earlyProfileCheck) {
                    await earlyProfileCheck;
                } else {
                    await checkClientProfile(session.user.id);
                }
                console.log(`[Auth] ✅ checkClientProfile done in ${Math.round(performance.now() - t1)}ms`);
            }
            
            setLoading(false);
        }).catch(err => {
            console.error(`[Auth] ❌ getSession FAILED after ${Math.round(performance.now() - t0)}ms:`, err.message);
            setLoading(false);
        });

        // Listen for auth changes
        // CRITICAL: Do NOT await inside onAuthStateChange callback.
        // Awaiting a Supabase call here blocks the auth state machine (deadlock).
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            
            if (session?.user) {
                checkClientProfile(session.user.id);
            } else {
                setClientProfile(null);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const login = async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });
        if (error) throw error;
        
        // Check client profile after login
        if (data.user) {
            await checkClientProfile(data.user.id);
        }
        
        return data;
    };

    const signup = async (email, password, metadata = {}) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: metadata
            }
        });
        if (error) throw error;

        // Only upsert profile when Supabase returns a session (e.g. "Confirm email" is off).
        // If email confirmation is required, session is null — RLS would block anon inserts;
        // profile is created by handle_verified_user() after the user verifies.
        if (data.user && data.session) {
            const { error: profileError } = await supabase.from('client_profiles').upsert(
                {
                    id: data.user.id,
                    email,
                    full_name: metadata.full_name || '',
                    company_name: metadata.company_name || '',
                    phone: metadata.phone || ''
                },
                { onConflict: 'id' }
            );
            if (profileError) {
                console.error('[AuthContext] client_profiles upsert:', profileError);
            } else {
                await checkClientProfile(data.user.id);
            }
        }

        return data;
    };

    const logout = async () => {
        console.log('[AuthContext] Logout called');
        try {
            // Race signOut against a 2-second timeout to prevent hanging
            const { error } = await Promise.race([
                supabase.auth.signOut(),
                new Promise((_, reject) => setTimeout(() => reject(new Error('Logout timed out')), 2000))
            ]);
            
            if (error) throw error;
        } catch (error) {
            console.error('[AuthContext] Logout error:', error);
        } finally {
            // Always clear local state
            setClientProfile(null);
            setUser(null);
            // Full navigation so UI matches signed-out state; land on Register (not home)
            window.location.href = '/register';
        }
    };

    // isClient = user exists AND has a client profile (not an admin)
    const isClient = !!(user && clientProfile);

    return (
        <AuthContext.Provider value={{ 
            user, 
            clientProfile,
            isClient,  // Use this to check if user is a CLIENT (not admin)
            loading, 
            login, 
            logout, 
            signup 
        }}>
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
