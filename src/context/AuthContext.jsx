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
                .select('*')
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
        // Get initial session
        supabase.auth.getSession().then(async ({ data: { session }, error }) => {
            console.log('[AuthContext] getSession result:', { 
                hasSession: !!session, 
                email: session?.user?.email,
                verified: session?.user?.email_confirmed_at,
                error: error?.message 
            });
            
            setUser(session?.user ?? null);
            
            // Check if this is a client user (not admin)
            if (session?.user) {
                await checkClientProfile(session.user.id);
            }
            
            setLoading(false);
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            console.log('[AuthContext] Auth state changed:', _event, session?.user?.email);
            setUser(session?.user ?? null);
            
            if (session?.user) {
                await checkClientProfile(session.user.id);
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
        
        // Create profile in client_profiles table
        if (data.user) {
            const { error: profileError } = await supabase.from('client_profiles').insert({
                id: data.user.id,
                email: email,
                full_name: metadata.full_name || '',
                company_name: metadata.company_name || '',
                phone: metadata.phone || ''
            });
            
            if (profileError) {
                console.error('[AuthContext] Error creating client profile:', profileError);
            } else {
                // Set the client profile after creation
                await checkClientProfile(data.user.id);
            }
        }
        
        return data;
    };

    const logout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        setClientProfile(null);
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
