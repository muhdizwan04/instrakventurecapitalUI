import React from 'react';
import { usePageContent } from '../hooks/usePageContent';
import DynamicForm from './DynamicForm';
import { useFormSubmit } from '../hooks/useFormSubmit';

/**
 * A component that renders a dynamic form if configured in admin,
 * or falls back to a provided static form.
 */
const DynamicServiceForm = ({ serviceId, fallbackForm, title }) => {
    const { content, loading: contentLoading } = usePageContent('service_pages', { pages: [] });
    const service = content?.pages?.find(p => p.id === serviceId);
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

    if (service?.fields && service.fields.length > 0) {
        return (
            <DynamicForm
                fields={service.fields}
                title={title || `Inquiry for ${service.title}`}
                onSubmit={handleDynamicSubmit}
                loading={submitLoading}
                formStyles={service.formStyles || {}}
            />
        );
    }

    return fallbackForm;
};

export default DynamicServiceForm;
