import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, UserPlus, LogIn, ArrowRight } from 'lucide-react';
import styles from './ProtectedFormSection.module.css';

/**
 * Wraps form sections in service pages
 * Shows CTA when not logged in as CLIENT, shows children (form) when logged in as client
 */
const ProtectedFormSection = ({ children, serviceName = 'this service' }) => {
    const { isClient, loading, user, logout } = useAuth();
    const location = useLocation();

    // Show loading state
    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.loadingSpinner} />
                <p style={{ textAlign: 'center', marginTop: '1rem', color: '#718096' }}>Checking authentication...</p>
            </div>
        );
    }

    // User is logged in AS A CLIENT - show the form
    if (isClient) {
        return <>{children}</>;
    }

    // User logged in but Email NOT Verified
    if (user && !user.email_confirmed_at) {
        return (
            <div className={styles.container}>
                <div className={styles.card}>
                    <div className={styles.iconWrapper} style={{ background: 'rgba(234, 179, 8, 0.1)' }}>
                        <Lock size={32} color="#EAB308" />
                    </div>
                    
                    <h3 className={styles.title}>Email Verification Required</h3>
                    
                    <p className={styles.description}>
                        You have created an account but haven't verified your email yet.<br/>
                        Please check <strong>{user.email}</strong> and click the link to activate your profile.
                    </p>

                    <div className={styles.actions}>
                        <button 
                            type="button"
                            onClick={logout}
                            className={styles.secondaryButton}
                            style={{ width: '100%', justifyContent: 'center' }}
                        >
                            Logout & Refresh
                        </button>
                    </div>
                </div>
            </div>
        );
    }
    
    // User logged in, Verified, but NOT as client (e.g. Admin or Account Error)
    if (user && !isClient) {
        return (
            <div className={styles.container}>
                <div className={styles.card}>
                    <div className={styles.iconWrapper}>
                        <Lock size={32} />
                    </div>
                    
                    <h3 className={styles.title}>Client Access Only</h3>
                    
                    <p className={styles.description}>
                        You are currently logged in as <strong>{user.email}</strong>.<br/>
                        This account is not registered as a client profile.
                    </p>

                    <div className={styles.actions}>
                        <button 
                            type="button"
                            onClick={logout}
                            className={styles.primaryButton}
                            style={{ 
                                width: '100%', 
                                justifyContent: 'center',
                                backgroundColor: '#B8860B', // Force visible background
                                color: 'white',
                                cursor: 'pointer',
                                padding: '12px',
                                border: 'none',
                                borderRadius: '8px',
                                marginTop: '10px'
                            }}
                        >
                            Logout & Switch Account
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // User not logged in as client - show CTA
    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.iconWrapper}>
                    <Lock size={32} />
                </div>
                
                <h3 className={styles.title}>Login Required</h3>
                
                <p className={styles.description}>
                    Create an account or sign in to apply for {serviceName}. 
                    Registration is quick and gives you access to all our investment services.
                </p>

                <div className={styles.benefits}>
                    <div className={styles.benefit}>
                        <ArrowRight size={16} />
                        <span>Track your application status</span>
                    </div>
                    <div className={styles.benefit}>
                        <ArrowRight size={16} />
                        <span>Direct communication with our team</span>
                    </div>
                    <div className={styles.benefit}>
                        <ArrowRight size={16} />
                        <span>Access to exclusive investment opportunities</span>
                    </div>
                </div>

                <div className={styles.actions}>
                    <Link 
                        to="/register" 
                        state={{ from: location }}
                        className={styles.primaryButton}
                    >
                        <UserPlus size={18} />
                        Register Now
                    </Link>
                    <Link 
                        to="/login" 
                        state={{ from: location }}
                        className={styles.secondaryButton}
                    >
                        <LogIn size={18} />
                        Sign In
                    </Link>
                </div>

                <p className={styles.note}>
                    Already have an account? <Link to="/login" state={{ from: location }} className={styles.link}>Sign in here</Link>
                </p>
            </div>
        </div>
    );
};

export default ProtectedFormSection;
