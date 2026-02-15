import React from 'react';
import { usePageContent } from '../hooks/usePageContent';
import DynamicForm from './DynamicForm';
import { useFormSubmit } from '../hooks/useFormSubmit';

/**
 * A component that renders a dynamic form if configured in admin,
 * or falls back to a provided static form.
 */
const DynamicServiceForm = ({ serviceId, fallbackForm, title }) => {
    // Fetch all service pages content
    const { content, loading: contentLoading } = usePageContent('service_pages', { pages: [] });

    // Find the current service
    const service = content?.pages?.find(p => p.id === serviceId);

    // Use the dynamic form submit hook
    const { submitForm, loading: submitLoading } = useFormSubmit(serviceId);

    const handleDynamicSubmit = async (formData) => {
        return await submitForm(formData);
    };

    if (contentLoading) {
        return (
            <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--accent-primary)]"></div>
            </div>
        );
    }

    // If dynamic fields are configured and not empty, use DynamicForm
    if (service?.fields && service.fields.length > 0) {
        return (
            <DynamicForm
                fields={service.fields}
                title={title || `Inquiry for ${service.title}`}
                onSubmit={handleDynamicSubmit}
                loading={submitLoading}
            />
        );
    }

    // Fallback to the original hardcoded form
    return fallbackForm;
};

export default DynamicServiceForm;
