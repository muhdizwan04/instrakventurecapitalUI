import React, { useState } from 'react';
import styles from './DynamicForm.module.css';
import { Toaster } from 'react-hot-toast';

const DynamicForm = ({ fields = [], title, onSubmit, loading }) => {
    // Initialize form state based on fields
    const [formData, setFormData] = useState(() => {
        const initial = {};
        fields.forEach(field => {
            initial[field.id] = field.type === 'checkbox' ? false : '';
        });
        return initial;
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await onSubmit(formData);
        
        // If the parent onSubmit returns true, reset the form
        if (success) {
            const resetData = {};
            fields.forEach(field => {
                resetData[field.id] = field.type === 'checkbox' ? false : '';
            });
            setFormData(resetData);
        }
    };

    if (!fields || fields.length === 0) {
        return (
            <div className={styles.formContainer}>
                <p className="text-center text-gray-500">This service does not have an inquiry form configured yet.</p>
            </div>
        );
    }

    return (
        <div className={styles.formContainer}>
            <Toaster position="top-right" />
            {title && <h3 className="text-xl font-bold mb-6 text-[var(--text-primary)]">{title}</h3>}
            
            <form onSubmit={handleSubmit}>
                <div className={styles.formGrid}>
                    {fields.map((field) => {
                        if (field.type === 'heading') {
                            return (
                                <div key={field.id} className={styles.fieldGroupFull}>
                                    <h3 className="text-lg font-bold text-[var(--accent-primary)] mt-6 mb-3 pb-2 border-b border-gray-100">
                                        {field.label}
                                    </h3>
                                </div>
                            );
                        }

                        if (field.type === 'section') {
                            return (
                                <div key={field.id} className={styles.fieldGroupFull}>
                                    <hr className="my-6 border-gray-100" />
                                </div>
                            );
                        }

                        return (
                            <div 
                                key={field.id} 
                                className={`${styles.fieldGroup} ${field.width === 'half' ? '' : styles.fieldGroupFull}`}
                            >
                                {field.type !== 'checkbox' && (
                                    <label className={styles.label} htmlFor={field.id}>
                                        {field.label} {field.required && '*'}
                                    </label>
                                )}

                                {field.type === 'select' ? (
                                    <select
                                        id={field.id}
                                        name={field.id}
                                        value={formData[field.id]}
                                        onChange={handleChange}
                                        className={styles.select}
                                        required={field.required}
                                    >
                                        <option value="">Select option...</option>
                                        {field.options?.map((opt, i) => (
                                            <option key={i} value={opt}>{opt}</option>
                                        ))}
                                    </select>
                                ) : field.type === 'textarea' ? (
                                    <textarea
                                        id={field.id}
                                        name={field.id}
                                        value={formData[field.id]}
                                        onChange={handleChange}
                                        className={styles.textarea}
                                        placeholder={field.placeholder}
                                        required={field.required}
                                        rows={4}
                                    />
                                ) : field.type === 'checkbox' ? (
                                    <label className={styles.checkboxGroup}>
                                        <input
                                            type="checkbox"
                                            id={field.id}
                                            name={field.id}
                                            checked={formData[field.id]}
                                            onChange={handleChange}
                                            className={styles.checkbox}
                                            required={field.required}
                                        />
                                        <span className={styles.label}>
                                            {field.label} {field.required && '*'}
                                        </span>
                                    </label>
                                ) : (
                                    <input
                                        type={field.type}
                                        id={field.id}
                                        name={field.id}
                                        value={formData[field.id]}
                                        onChange={handleChange}
                                        className={styles.input}
                                        placeholder={field.placeholder}
                                        required={field.required}
                                    />
                                )}
                            </div>
                        );
                    })}
                </div>

                <button 
                    type="submit" 
                    className={styles.submitButton}
                    disabled={loading}
                >
                    {loading ? 'Submitting...' : 'Submit Inquiry'}
                </button>
            </form>
        </div>
    );
};

export default DynamicForm;
