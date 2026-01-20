import React, { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { toast, Toaster } from 'react-hot-toast';

const EmailVerificationListener = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const processedRef = useRef(false);

    useEffect(() => {
        // Check for Supabase verification hash parameters
        // Example: #access_token=...&type=signup...
        const hash = window.location.hash;
        
        if (hash && hash.includes('type=signup') && !processedRef.current) {
            processedRef.current = true;
            
            // Set up a listener for the sign-in event that follows verification
            const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
                if (event === 'SIGNED_IN') {
                    // Show success notification
                    toast.success('Email successfully verified! API access granted.', {
                        duration: 5000,
                        icon: '✅',
                        style: {
                            background: '#F0FDF4',
                            color: '#166534',
                            border: '1px solid #BBF7D0',
                            fontWeight: '500'
                        }
                    });

                    // If user is on login page, redirect to home/dashboard
                    if (location.pathname === '/login') {
                        setTimeout(() => navigate('/', { replace: true }), 1500);
                    }
                }
            });

            return () => {
                subscription.unsubscribe();
            };
        } else if (hash && hash.includes('error_description')) {
            // Handle verification errors
            const params = new URLSearchParams(hash.substring(1));
            const errorDescription = params.get('error_description');
            if (errorDescription) {
                 toast.error(`Verification failed: ${errorDescription.replace(/\+/g, ' ')}`);
            }
        }
    }, [location, navigate]);

    // renders nothing visible, just the Toaster container
    // We use a container specifically for this, or rely on page-level ones. 
    // Ideally put Toaster at root. Since we want to ensure it shows even on Login:
    return <Toaster position="top-right" />;
};

export default EmailVerificationListener;
