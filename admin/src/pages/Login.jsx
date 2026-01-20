import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Lock, Mail, Loader2, ShieldCheck } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            console.error('Login error:', err);
            setError(err.message || 'Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[var(--bg-secondary)]">
            {/* Premium Background Accents */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[var(--accent-secondary)] opacity-[0.03] blur-[100px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[var(--accent-primary)] opacity-[0.05] blur-[100px]" />
            </div>

            <div className="w-full max-w-md p-8 relative z-10">


                {/* Login Card */}
                <div className="glass-card shadow-2xl border-white/50 animate-in fade-in zoom-in duration-500">
                    <div className="mb-8">
                        <h2 className="text-2xl font-heading font-bold text-[var(--text-primary)] mb-2">Welcome Back</h2>
                        <p className="text-sm text-[var(--text-secondary)]">Please sign in to access the management portal.</p>
                    </div>
                    
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg text-red-700 text-sm flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] ml-1">
                                Email Address
                            </label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[var(--text-muted)] group-focus-within:text-[var(--accent-primary)] transition-colors" size={18} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="admin@instrak.com"
                                    className="w-full pl-12 pr-4 py-3.5 bg-[var(--bg-tertiary)] border-transparent focus:bg-white border focus:border-[var(--accent-primary)] rounded-xl text-[var(--text-primary)] placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-[var(--accent-primary)]/5 transition-all outline-none"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] ml-1">
                                Password
                            </label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[var(--text-muted)] group-focus-within:text-[var(--accent-primary)] transition-colors" size={18} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full pl-12 pr-12 py-3.5 bg-[var(--bg-tertiary)] border-transparent focus:bg-white border focus:border-[var(--accent-primary)] rounded-xl text-[var(--text-primary)] placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-[var(--accent-primary)]/5 transition-all outline-none"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 bg-gradient-to-r from-[#0A3D62] to-[#1E6F9F] text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-[#0A3D62]/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 active:scale-[0.98]"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="animate-spin" size={20} />
                                        <span>Authenticating...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Sign Into Portal</span>
                                        <ShieldCheck size={18} className="opacity-70" />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <div className="mt-10 text-center animate-in fade-in slide-in-from-bottom duration-1000">
                    <p className="text-[var(--text-muted)] text-sm font-medium">
                        © 2026 Instrak Venture Capital Berhad
                    </p>
                    <div className="mt-4 flex items-center justify-center gap-4 text-xs font-bold text-[var(--accent-primary)] opacity-50">
                        <span className="hover:opacity-100 cursor-pointer transition-opacity">Privacy Policy</span>
                        <span className="w-1 h-1 rounded-full bg-[var(--text-muted)]" />
                        <span className="hover:opacity-100 cursor-pointer transition-opacity">Security Standards</span>
                    </div>
                </div>
            </div>

            <style>{`
                .glass-card {
                    background: white;
                    border: 1px solid rgba(0,0,0,0.05);
                    border-radius: 24px;
                    padding: 3rem;
                    position: relative;
                    overflow: hidden;
                }
                .glass-card::after {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 5px;
                    background: linear-gradient(90deg, #0A3D62, #C9A227);
                }
                @font-face {
                  font-family: 'Playfair Display';
                  font-style: normal;
                  font-weight: 400;
                  font-display: swap;
                  src: url(https://fonts.gstatic.com/s/playfairdisplay/v30/nuFvD7K6E1n0beWSM3N6knrv-P7VatZfOTX6.woff2) format('woff2');
                }
            `}</style>
        </div>
    );
};

export default Login;

