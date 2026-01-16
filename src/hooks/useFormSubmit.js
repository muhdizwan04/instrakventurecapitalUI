import { useState } from 'react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

/**
 * Custom hook for submitting forms to Supabase
 * @param {string} formType - Type of inquiry: 'contact', 'investor', 'consulting', 'contract', 'equity', 'realestate'
 */
export const useFormSubmit = (formType) => {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    /**
     * Submit form data to Supabase
     * @param {Object} formData - Common form fields (name, email, phone, companyName, subject, message)
     * @param {Object} metadata - Additional type-specific fields stored as JSONB
     */
    const submitForm = async (formData, metadata = {}) => {
        setLoading(true);
        setSuccess(false);

        try {
            const { error } = await supabase.from('inquiries').insert({
                type: formType,
                name: formData.name || formData.fullName || formData.founderName || formData.contactPerson || '',
                email: formData.email || '',
                phone: formData.phone || null,
                company_name: formData.companyName || formData.company || null,
                subject: formData.subject || `${formType.charAt(0).toUpperCase() + formType.slice(1)} Inquiry`,
                message: formData.message || formData.needs || formData.description || formData.companyOverview || formData.projectDescription || null,
                metadata: {
                    ...metadata,
                    // Flatten any remaining form fields into metadata
                    ...Object.fromEntries(
                        Object.entries(formData).filter(([key]) => 
                            !['name', 'fullName', 'founderName', 'contactPerson', 'email', 'phone', 'companyName', 'company', 'subject', 'message', 'needs', 'description', 'companyOverview', 'projectDescription'].includes(key)
                        )
                    )
                }
            });

            if (error) throw error;

            toast.success('Thank you! Your inquiry has been submitted. We will contact you soon.');
            setSuccess(true);
            return true;
        } catch (err) {
            console.error('Form submission error:', err);
            toast.error('Something went wrong. Please try again or contact us directly.');
            return false;
        } finally {
            setLoading(false);
        }
    };

    return { submitForm, loading, success };
};

export default useFormSubmit;
