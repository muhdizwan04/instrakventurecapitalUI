import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    // Check if the logged-in user is in the admin_users whitelist
    const checkAdminStatus = async (userEmail) => {
        console.log('[Auth] Checking admin status for:', userEmail);
        if (!userEmail) {
            setIsAdmin(false);
            return false;
        }

        try {
            // Use RPC to avoid RLS recursion on admin_users table
            const { data, error } = await supabase.rpc('is_admin');

            if (error) {
                // Don't log network errors as errors - they're expected when connection is lost
                const isNetworkError = error.message?.toLowerCase().includes('network') || 
                                     error.message?.toLowerCase().includes('connection') ||
                                     error.message?.toLowerCase().includes('failed to fetch');
                
                if (!isNetworkError) {
                    console.error('[Auth] Error checking admin status via RPC:', error);
                }
                // Keep current admin status on network errors (don't reset to false)
                // This prevents kicking out admins when connection is temporarily lost
                if (!isNetworkError) {
                    setIsAdmin(false);
                }
                return false;
            }

            console.log('[Auth] Admin check result (RPC):', data);

            const adminStatus = !!data;
            setIsAdmin(adminStatus);
            return adminStatus;
        } catch (err) {
            // Don't log network errors as errors
            const isNetworkError = err.message?.toLowerCase().includes('network') || 
                                 err.message?.toLowerCase().includes('connection') ||
                                 err.message?.toLowerCase().includes('failed to fetch');
            
            if (!isNetworkError) {
                console.error('[Auth] Admin check panic:', err);
            }
            // Keep current admin status on network errors
            if (!isNetworkError) {
                setIsAdmin(false);
            }
            return false;
        }
    };

    useEffect(() => {
        // OPTIMIZATION: Check for local session immediately to unblock guests
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        let hasLocalSession = false;
        
        try {
            if (supabaseUrl) {
                const projectRef = supabaseUrl.split('.')[0].split('//')[1];
                const storageKey = `sb-${projectRef}-auth-token`;
                const localData = localStorage.getItem(storageKey);
                if (localData) {
                    hasLocalSession = true;
                }
            }
        } catch (e) {
            console.warn('[Admin Auth] Local storage check failed', e);
        }

        if (!hasLocalSession) {
            setLoading(false);
        }

        // If we have a local session, start admin check early (in parallel with getSession)
        let earlyAdminCheck = null;
        if (hasLocalSession) {
            try {
                const localData = JSON.parse(localStorage.getItem(
                    `sb-${supabaseUrl.split('.')[0].split('//')[1]}-auth-token`
                ));
                const email = localData?.user?.email;
                if (email) {
                    earlyAdminCheck = checkAdminStatus(email);
                }
            } catch (e) {
                // Fall through to normal flow
            }
        }

        // Get initial session
        supabase.auth.getSession().then(async ({ data: { session } }) => {
            setUser(session?.user ?? null);
            // If early check was for the same email, await it.
            // However, if early check FAILED (returned false), but we have a valid session,
            // we should TRY AGAIN with the verified session token to be sure.
            if (session?.user?.email) {
                // await checkAdminStatus(session.user.email);
                // Temporarily disabling automatic check to debug network issues
                 await checkAdminStatus(session.user.email);
            }
            setLoading(false);
        }).catch(err => {
            console.error('[Admin Auth] getSession failed:', err);
            toast.error('Unable to verify login session. You may be working offline.');
            setLoading(false);
        });

        // Listen for auth changes
        // CRITICAL: Do NOT await inside onAuthStateChange callback.
        // Awaiting a Supabase call (like rpc) here blocks the auth state machine,
        // which prevents ALL subsequent Supabase requests from resolving (deadlock).
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            if (session?.user?.email) {
                // Fire and forget — don't block the auth state machine
                checkAdminStatus(session.user.email);
            } else {
                setIsAdmin(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    // Safety timeout: If auth check hangs for more than 2.5 seconds, stop loading
    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading((currentLoading) => {
                if (currentLoading) {
                    console.warn('[Admin Auth] Auth check timed out, forcing loading=false');
                    toast.error('Authentication check timed out. Proceeding in offline mode.');
                    return false;
                }
                return currentLoading;
            });
        }, 2500);
        return () => clearTimeout(timer);
    }, []);

    const login = async (email, password) => {
        // Race the login against the timeout
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });
        
        if (error) throw error;

        // After successful auth, verify this user is an admin
        const adminStatus = await checkAdminStatus(email);
        if (!adminStatus) {
            // Not an admin — sign them out immediately
            await supabase.auth.signOut();
            throw new Error('Access denied. This account is not authorized to access the admin panel.');
        }

        return data;
    };

    const logout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        setIsAdmin(false);
    };

    return (
        <AuthContext.Provider value={{ user, isAdmin, loading, login, logout }}>
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
