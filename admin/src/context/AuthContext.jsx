import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';

const AuthContext = createContext();

const AUTH_SAFETY_TIMEOUT_MS = 18000; // 18s when session may be slow (e.g. after tab switch)

const isNetworkError = (error) => {
    if (!error) return false;
    const msg = (error.message || '').toLowerCase();
    const name = (error.name || '').toLowerCase();
    return (
        msg.includes('network') ||
        msg.includes('failed to fetch') ||
        msg.includes('load failed') ||
        msg.includes('connection') ||
        name.includes('retryablefetch')
    );
};

async function retryAsync(fn, { retries = 3, baseDelay = 800, shouldRetry = isNetworkError } = {}) {
    for (let attempt = 0; attempt <= retries; attempt++) {
        try {
            return await fn();
        } catch (err) {
            if (attempt === retries || !shouldRetry(err)) throw err;
            const delay = baseDelay * Math.pow(2, attempt);
            console.log(`[Auth] Retrying in ${delay}ms (attempt ${attempt + 1}/${retries})...`);
            await new Promise(r => setTimeout(r, delay));
        }
    }
}

async function warmUpSupabase() {
    try {
        await supabase.from('site_content').select('id', { count: 'exact', head: true });
    } catch (_) { /* ignore — just a wake-up ping */ }
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);
    const hadLocalSessionRef = useRef(false);

    const checkAdminStatus = useCallback(async (userEmail) => {
        if (!userEmail) {
            setIsAdmin(false);
            return false;
        }

        try {
            const result = await retryAsync(async () => {
                const { data, error } = await supabase.rpc('is_admin');
                if (error) throw error;
                return data;
            }, { retries: 2, baseDelay: 600 });

            const adminStatus = !!result;
            setIsAdmin(adminStatus);
            return adminStatus;
        } catch (err) {
            if (!isNetworkError(err)) {
                console.error('[Auth] Admin check failed:', err);
                setIsAdmin(false);
            }
            return false;
        }
    }, []);

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

        hadLocalSessionRef.current = !!hasLocalSession;
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

        retryAsync(
            () => supabase.auth.getSession(),
            { retries: 2, baseDelay: 800 }
        ).then(async ({ data: { session } }) => {
            setUser(session?.user ?? null);
            if (session?.user?.email) {
                await checkAdminStatus(session.user.email);
            }
            setLoading(false);
        }).catch(err => {
            console.error('[Admin Auth] getSession failed:', err);
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

    // When user returns to the tab: if we have no user but had a local session, re-check session (request may have been throttled while tab was in background).
    useEffect(() => {
        const onVisibilityChange = () => {
            if (document.visibilityState !== 'visible') return;
            if (user !== null) return; // already have session
            if (!hadLocalSessionRef.current) return;
            retryAsync(() => supabase.auth.getSession(), { retries: 2, baseDelay: 600 })
                .then(({ data: { session } }) => {
                    if (session?.user) {
                        setUser(session.user);
                        checkAdminStatus(session.user.email);
                        setLoading(false);
                    }
                })
                .catch(() => {});
        };
        document.addEventListener('visibilitychange', onVisibilityChange);
        return () => document.removeEventListener('visibilitychange', onVisibilityChange);
    }, [user, checkAdminStatus]);

    // Safety timeout: give getSession time to complete (e.g. after tab resume). If still no user and we had local session, try once more before giving up.
    useEffect(() => {
        const timer = setTimeout(async () => {
            setLoading((cur) => {
                if (!cur) return cur;
                // If we had a stored session but getSession hasn't resolved, try one more time (tab may have been in background)
                if (hadLocalSessionRef.current) {
                    retryAsync(() => supabase.auth.getSession(), { retries: 1, baseDelay: 1000 })
                        .then(({ data: { session } }) => {
                            setUser(session?.user ?? null);
                            if (session?.user?.email) {
                                checkAdminStatus(session.user.email);
                            }
                        })
                        .catch(() => {
                            console.warn('[Admin Auth] Auth check timed out, forcing loading=false');
                        })
                        .finally(() => setLoading(false));
                    return true; // keep loading until the retry settles
                }
                console.warn('[Admin Auth] Auth check timed out, forcing loading=false');
                return false;
            });
        }, AUTH_SAFETY_TIMEOUT_MS);
        return () => clearTimeout(timer);
    }, [checkAdminStatus]);

    const login = async (email, password) => {
        // Wake up Supabase if it's been idle (free-tier cold start)
        await warmUpSupabase();

        const data = await retryAsync(async () => {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });
            if (error) throw error;
            return data;
        }, { retries: 3, baseDelay: 1000 });

        const adminStatus = await checkAdminStatus(email);
        if (!adminStatus) {
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
