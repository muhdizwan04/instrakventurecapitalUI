import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Lock, Mail, User, Building2, Phone, Loader2 } from 'lucide-react';
import styles from './Login.module.css';

const Register = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        fullName: '',
        companyName: '',
        phone: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [registrationSuccess, setRegistrationSuccess] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const { signup } = useAuth();

    const from = location.state?.from?.pathname || '/';

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        try {
            await signup(formData.email, formData.password, {
                full_name: formData.fullName,
                company_name: formData.companyName,
                phone: formData.phone
            });
            setRegistrationSuccess(true);
        } catch (err) {
            console.error('Registration error:', err);
            setError(err.message || 'Failed to create account');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={`${styles.card} ${styles.cardWide}`}>
                <div className={styles.header}>
                    <h1 className={styles.title}>{registrationSuccess ? 'Check Your Email' : 'Create Account'}</h1>
                    <p className={styles.subtitle}>{registrationSuccess ? 'We have sent a verification link to your email' : 'Register to access our financing services'}</p>
                </div>

                {registrationSuccess ? (
                    <div style={{ textAlign: 'center', padding: '1rem 0 2rem' }}>
                        <div style={{ 
                            width: '80px', 
                            height: '80px', 
                            background: 'rgba(34, 197, 94, 0.1)', 
                            borderRadius: '50%', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            margin: '0 auto 2rem' 
                        }}>
                             <Mail size={40} color="#22C55E" />
                        </div>
                        
                        <p style={{ color: '#4A5568', marginBottom: '2rem', lineHeight: '1.6' }}>
                            Please check <strong>{formData.email}</strong> to verify your account.<br/>
                            Once verified, you can sign in to access all services.
                        </p>

                        <Link 
                            to="/login" 
                            className={styles.submitButton}
                            style={{ 
                                textDecoration: 'none', 
                                display: 'inline-flex', 
                                justifyContent: 'center',
                                background: '#1A365D' 
                            }}
                        >
                            Proceed to Sign In
                        </Link>
                    </div>
                ) : (
                    <>
                        {error && (
                            <div className={styles.error}>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formRow}>
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Full Name *</label>
                            <div className={styles.inputWrapper}>
                                <User className={styles.inputIcon} size={18} />
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    placeholder="Your full name"
                                    className={styles.input}
                                    required
                                />
                            </div>
                        </div>

                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Email Address *</label>
                            <div className={styles.inputWrapper}>
                                <Mail className={styles.inputIcon} size={18} />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="your@email.com"
                                    className={styles.input}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className={styles.formRow}>
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Company Name</label>
                            <div className={styles.inputWrapper}>
                                <Building2 className={styles.inputIcon} size={18} />
                                <input
                                    type="text"
                                    name="companyName"
                                    value={formData.companyName}
                                    onChange={handleChange}
                                    placeholder="Company (optional)"
                                    className={styles.input}
                                />
                            </div>
                        </div>

                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Phone Number</label>
                            <div className={styles.inputWrapper}>
                                <Phone className={styles.inputIcon} size={18} />
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="+60 12-345 6789"
                                    className={styles.input}
                                />
                            </div>
                        </div>
                    </div>

                    <div className={styles.formRow}>
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Password *</label>
                            <div className={styles.inputWrapper}>
                                <Lock className={styles.inputIcon} size={18} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Min. 6 chars"
                                    className={styles.input}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className={styles.eyeButton}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Confirm *</label>
                            <div className={styles.inputWrapper}>
                                <Lock className={styles.inputIcon} size={18} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Confirm password"
                                    className={styles.input}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={styles.submitButton}
                    >
                        {loading ? (
                            <>
                                <Loader2 className={styles.spinner} size={20} />
                                Creating Account...
                            </>
                        ) : (
                            'Create Account'
                        )}
                    </button>
                </form>



                        <div className={styles.footer}>
                            <p>Already have an account?</p>
                            <Link to="/login" state={{ from: location.state?.from }} className={styles.link}>
                                Sign In
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Register;
