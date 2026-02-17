import { useState, useRef } from 'react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

// Helper to check if error is a network error
const isNetworkError = (error) => {
    if (!error) return false;
    const message = error.message?.toLowerCase() || '';
    const code = error.code?.toLowerCase() || '';
    return (
        message.includes('network') ||
        message.includes('connection') ||
        message.includes('failed to fetch') ||
        message.includes('load failed') ||
        code === 'network_error' ||
        code === 'fetch_error'
    );
};

// Retry helper with exponential backoff
const retryWithBackoff = async (fn, maxRetries = 2, baseDelay = 500) => {
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            return await fn();
        } catch (error) {
            const isLastAttempt = attempt === maxRetries;
            const isNetwork = isNetworkError(error);
            
            // Only retry network errors
            if (!isNetwork || isLastAttempt) {
                throw error;
            }
            
            const delay = baseDelay * Math.pow(2, attempt);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
};

/**
 * Custom hook for submitting forms to Supabase
 * @param {string} formType - Type of inquiry: 'contact', 'investor', 'consulting', 'contract', 'equity', 'realestate'
 */
export const useFormSubmit = (formType) => {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const submittingRef = useRef(false);

    /**
     * Submit form data to Supabase
     * @param {Object} formData - Common form fields (name, email, phone, companyName, subject, message)
     * @param {Object} metadata - Additional type-specific fields stored as JSONB
     */
    const submitForm = async (formData, metadata = {}) => {
        // Prevent double submission
        if (loading || submittingRef.current) {
            console.warn('Form submission already in progress, ignoring duplicate submit');
            return false;
        }

        setLoading(true);
        setSuccess(false);
        submittingRef.current = true;

        try {
            // Validate required fields
            if (!formData.email || !formData.email.trim()) {
                toast.error('Email is required');
                setLoading(false);
                submittingRef.current = false;
                return false;
            }

            // Wrap submission with retry logic for network errors
            await retryWithBackoff(async () => {
                // CRITICAL: Do NOT call supabase.auth.getUser() here!
                // It causes a deadlock when onAuthStateChange is processing (same issue as useContent).
                // Instead, get user email from session storage if available, or skip it.
                let userEmail = null;
                try {
                    // Try to get user email from session without blocking
                    // Use a timeout to prevent hanging
                    const sessionPromise = supabase.auth.getSession();
                    const timeoutPromise = new Promise((_, reject) => 
                        setTimeout(() => reject(new Error('Session check timeout')), 1000)
                    );
                    
                    const { data: { session } } = await Promise.race([sessionPromise, timeoutPromise]);
                    userEmail = session?.user?.email || null;
                } catch (authErr) {
                    // Ignore auth errors - form can be submitted without user
                    // This prevents deadlock if auth state is changing
                }

                const payload = {
                    type: formType,
                    // Note: user_id column doesn't exist in inquiries table
                    // If you need to track user, store it in metadata instead
                    name: formData.name || formData.fullName || formData.founderName || formData.contactPerson || formData.legalName || formData.primaryContact || '',
                    email: formData.email?.trim() || '',
                    phone: formData.phone || null,
                    company_name: formData.companyName || formData.company || formData.legalName || null,
                    subject: formData.subject || `${formType.toUpperCase().replace('_', ' ')} Inquiry`,
                    message: formData.message || formData.needs || formData.description || formData.companyOverview || formData.projectDescription || 'No description provided',
                    metadata: {
                        ...metadata,
                        ...formData, // Store everything in metadata for safety
                        // Store user account email in metadata if user is logged in (for admin display)
                        ...(userEmail ? { accountEmail: userEmail } : {})
                    }
                };

                const { error } = await supabase.from('inquiries').insert(payload);

                if (error) {
                    console.error('Supabase insert error:', error);
                    console.error('Payload:', payload);
                    throw error;
                }
            });

            toast.success('Thank you! Your inquiry has been submitted. We will contact you soon.');
            setSuccess(true);
            return true;
        } catch (err) {
            console.error('Form submission error:', err);
            
            // Better error messages
            if (err.code === '23505') {
                toast.error('This inquiry has already been submitted. Please wait for our response.');
            } else if (err.code === '23502') {
                toast.error('Please fill in all required fields.');
            } else if (err.message?.includes('network') || err.message?.includes('connection')) {
                toast.error('Network error. Please check your connection and try again.');
            } else if (err.message?.includes('400')) {
                toast.error('Invalid form data. Please check all fields and try again.');
            } else {
                toast.error(err.message || 'Something went wrong. Please try again or contact us directly.');
            }
            return false;
        } finally {
            setLoading(false);
            submittingRef.current = false;
        }
    };

    return { submitForm, loading, success };
};

export default useFormSubmit;
