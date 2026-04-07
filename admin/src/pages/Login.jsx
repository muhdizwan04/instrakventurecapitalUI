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
            const msg = (err.message || '').toLowerCase();
            const name = (err.name || '').toLowerCase();
            if (msg.includes('invalid login') || msg.includes('invalid email or password')) {
                setError('Invalid email or password.');
            } else if (msg.includes('access denied')) {
                setError(err.message);
            } else if (msg.includes('network') || msg.includes('load failed') || msg.includes('failed to fetch') || name.includes('retryablefetch')) {
                setError('Unable to reach the server. Check your connection and try again.');
            } else if (msg.includes('timed out')) {
                setError('Connection timed out. Please try again.');
            } else {
                setError(err.message || 'An unexpected error occurred.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#F5F6F8] dark:bg-[#0F172A] px-4 py-12">
            {/* Subtle background depth */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-[#1A365D]/[0.03]" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-[#1A365D]/[0.02]" />
            </div>

            <div className="w-full max-w-[420px] relative z-10">
                <div className="bg-white rounded-2xl border border-gray-200/80 shadow-lg shadow-gray-200/50 overflow-hidden">
                    {/* Accent */}
                    <div className="h-1 w-full bg-gradient-to-r from-[#1A365D] to-[#0A3D62]" />
                    <div className="p-8 sm:p-10">
                        <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Welcome back</h1>
                        <p className="text-gray-500 text-sm mt-1 mb-8">Sign in to the management portal</p>

                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-700 text-sm flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Email address</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="admin@instrak.com"
                                        className="w-full pl-12 pr-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1A365D]/20 focus:border-[#1A365D] focus:bg-white transition-colors"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full pl-12 pr-12 py-3 bg-gray-50/80 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1A365D]/20 focus:border-[#1A365D] focus:bg-white transition-colors"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3.5 bg-[#1A365D] text-white text-sm font-medium rounded-xl hover:bg-[#0F2942] focus:outline-none focus:ring-2 focus:ring-[#1A365D] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2.5 transition-colors shadow-sm"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="animate-spin" size={20} />
                                        <span>Signing in...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Sign in</span>
                                        <ShieldCheck size={18} className="opacity-80" />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                <p className="mt-8 text-center text-sm text-gray-500">
                    © 2026 Instrak Venture Capital Berhad
                </p>
                <p className="mt-2 text-center text-xs text-gray-400">
                    <button type="button" className="hover:text-gray-600 transition-colors">Privacy Policy</button>
                    <span className="mx-2">·</span>
                    <button type="button" className="hover:text-gray-600 transition-colors">Security</button>
                </p>
            </div>
        </div>
    );
};

export default Login;
