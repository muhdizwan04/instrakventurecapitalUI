import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
    Users, Briefcase, FileText, Mail, TrendingUp, MessageSquare, 
    ArrowRight, Loader2, Clock, AlertCircle, CheckCircle, 
    Newspaper, Settings, Home, ExternalLink, RefreshCw
} from 'lucide-react';
import { supabase } from '../lib/supabase';

const Dashboard = () => {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        inquiries: { total: 0, new: 0, inProgress: 0 },
        services: 0,
        news: 0
    });
    const [recentInquiries, setRecentInquiries] = useState([]);
    const [inquiryTypes, setInquiryTypes] = useState([]);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            // Fetch inquiries
            const { data: inquiriesData } = await supabase
                .from('inquiries')
                .select('id, type, status, name, email, created_at')
                .order('created_at', { ascending: false });

            // Fetch services count from site_content
            const { data: servicesData } = await supabase
                .from('site_content')
                .select('content')
                .eq('id', 'services')
                .single();

            // Fetch news count from site_content
            const { data: newsData } = await supabase
                .from('site_content')
                .select('content')
                .eq('id', 'news')
                .single();

            if (inquiriesData) {
                // Calculate stats
                const newCount = inquiriesData.filter(i => i.status === 'new').length;
                const inProgressCount = inquiriesData.filter(i => ['in_progress', 'contacted'].includes(i.status)).length;

                setStats({
                    inquiries: { 
                        total: inquiriesData.length, 
                        new: newCount, 
                        inProgress: inProgressCount 
                    },
                    services: servicesData?.content?.items?.length || 0,
                    news: newsData?.content?.articles?.length || 0
                });

                // Recent 5 inquiries
                setRecentInquiries(inquiriesData.slice(0, 5));

                // Dynamic inquiry types with counts
                const typeCounts = {};
                inquiriesData.forEach(inq => {
                    typeCounts[inq.type] = (typeCounts[inq.type] || 0) + 1;
                });
                setInquiryTypes(
                    Object.entries(typeCounts)
                        .map(([type, count]) => ({ type, count }))
                        .sort((a, b) => b.count - a.count)
                );
            }
        } catch (err) {
            console.error('Error fetching dashboard data:', err);
        } finally {
            setLoading(false);
        }
    };

    const getTimeAgo = (dateStr) => {
        const seconds = Math.floor((new Date() - new Date(dateStr)) / 1000);
        if (seconds < 60) return 'Just now';
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
        if (seconds < 172800) return 'Yesterday';
        return `${Math.floor(seconds / 86400)}d ago`;
    };

    const quickLinks = [
        { label: 'Home Page', path: '/home', icon: Home, color: 'text-[var(--accent-primary)] bg-gray-50' },
        { label: 'Services', path: '/services', icon: Briefcase, color: 'text-[var(--accent-primary)] bg-gray-50' },
        { label: 'News', path: '/news', icon: Newspaper, color: 'text-[var(--accent-primary)] bg-gray-50' },
        { label: 'Inquiries', path: '/inquiries', icon: Mail, color: 'text-[var(--accent-primary)] bg-gray-50' },
        { label: 'Settings', path: '/global-settings', icon: Settings, color: 'text-gray-600 bg-gray-50' },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="animate-spin text-blue-600" size={40} />
            </div>
        );
    }

    return (
        <div className="space-y-4 h-[calc(100vh-2rem)] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center shrink-0">
                <div>
                    <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-xs text-gray-500">Welcome back! Here's your overview.</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={fetchDashboardData}
                        className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                        <RefreshCw size={14} /> Refresh
                    </button>
                    <a
                        href="http://localhost:5173"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-1.5 bg-[var(--accent-primary)] text-white rounded-lg text-xs font-medium hover:opacity-90 transition-colors"
                    >
                        <ExternalLink size={14} /> View Site
                    </a>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-4 gap-4 shrink-0">
                <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-gray-500">Total Inquiries</span>
                        <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center text-[var(--accent-primary)]">
                            <Mail size={16} />
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-[var(--text-primary)] mb-1">{stats.inquiries.total}</p>
                    <Link to="/inquiries" className="text-[10px] text-[var(--accent-primary)] hover:underline flex items-center gap-1 font-medium">
                        View all <ArrowRight size={10} />
                    </Link>
                </div>

                <div className="bg-[var(--accent-primary)] rounded-xl p-4 text-white shadow-lg relative overflow-hidden">
                    {/* Background pattern */}
                    <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-8 -mt-8 blur-xl"></div>
                    
                    <div className="flex items-center justify-between mb-2 relative z-10">
                        <span className="text-xs font-medium text-white/90">New (Unread)</span>
                        <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                            <AlertCircle size={16} className="text-white" />
                        </div>
                    </div>
                    <p className="text-2xl font-bold mb-1 relative z-10">{stats.inquiries.new}</p>
                    <p className="text-[10px] text-white/70 font-medium relative z-10">Requires attention</p>
                </div>

                <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-gray-500">Active Services</span>
                        <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center text-[var(--accent-primary)]">
                            <Briefcase size={16} />
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-[var(--text-primary)] mb-1">{stats.services}</p>
                    <Link to="/services" className="text-[10px] text-[var(--accent-primary)] hover:underline flex items-center gap-1 font-medium">
                        Manage services <ArrowRight size={10} />
                    </Link>
                </div>

                <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-gray-500">News Articles</span>
                        <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center text-[var(--accent-primary)]">
                            <Newspaper size={16} />
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-[var(--text-primary)] mb-1">{stats.news}</p>
                    <Link to="/news" className="text-[10px] text-[var(--accent-primary)] hover:underline flex items-center gap-1 font-medium">
                        Manage articles <ArrowRight size={10} />
                    </Link>
                </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-3 gap-4 flex-1 min-h-0">
                {/* Recent Inquiries */}
                <div className="col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col overflow-hidden">
                    <div className="flex justify-between items-center px-4 py-3 border-b border-gray-100 shrink-0">
                        <h3 className="font-semibold text-gray-900 text-sm">Recent Inquiries</h3>
                        <Link to="/inquiries" className="text-xs text-[var(--accent-primary)] hover:underline flex items-center gap-1">
                            View all <ArrowRight size={12} />
                        </Link>
                    </div>
                    <div className="divide-y divide-gray-100 overflow-y-auto custom-scrollbar">
                        {recentInquiries.length === 0 ? (
                            <div className="p-8 text-center text-gray-400">
                                <Mail size={24} className="mx-auto mb-2 opacity-30" />
                                <p className="text-xs">No inquiries yet</p>
                            </div>
                        ) : (
                            recentInquiries.slice(0, 5).map(inq => (
                                <div key={inq.id} className="px-4 py-3 hover:bg-gray-50 transition-colors flex items-center gap-3 border-b border-gray-50 last:border-0">
                                    <div className="w-8 h-8 rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center text-[var(--accent-primary)] text-xs font-bold border border-gray-100 shrink-0">
                                        {inq.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <p className="font-medium text-[var(--text-primary)] text-sm truncate">{inq.name}</p>
                                            {inq.status === 'new' && (
                                                <span className="px-1.5 py-0.5 bg-[var(--accent-primary)] text-white text-[9px] rounded-full font-medium tracking-wide">NEW</span>
                                            )}
                                        </div>
                                        <p className="text-xs text-gray-400 truncate">{inq.email}</p>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <span className="text-[10px] px-1.5 py-0.5 bg-gray-50 text-gray-600 rounded border border-gray-100 uppercase tracking-wider">{inq.type}</span>
                                        <p className="text-[10px] text-gray-400 mt-0.5">{getTimeAgo(inq.created_at)}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Right Sidebar */}
                <div className="space-y-4 flex flex-col overflow-hidden">
                    {/* Inquiry Types Breakdown */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 shrink-0">
                        <h3 className="font-semibold text-gray-900 mb-3 text-sm">Inquiries by Type</h3>
                        <div className="space-y-2">
                            {inquiryTypes.length === 0 ? (
                                <p className="text-xs text-gray-400 text-center py-2">No data yet</p>
                            ) : (
                                inquiryTypes.slice(0, 4).map(item => (
                                    <div key={item.type} className="flex items-center justify-between">
                                        <span className="text-xs text-gray-600 capitalize">{item.type.replace(/_/g, ' ')}</span>
                                        <div className="flex items-center gap-2">
                                            <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                <div 
                                                    className="h-full bg-[var(--accent-primary)] rounded-full"
                                                    style={{ width: `${(item.count / stats.inquiries.total) * 100}%` }}
                                                />
                                            </div>
                                            <span className="text-xs font-semibold text-gray-900 w-4 text-right">{item.count}</span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex-1">
                        <h3 className="font-semibold text-gray-900 mb-3 text-sm">Quick Links</h3>
                        <div className="grid grid-cols-2 gap-2">
                            {quickLinks.map(link => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className="flex flex-col items-center justify-center p-2 rounded-lg border border-gray-100 hover:border-[var(--accent-primary)] hover:shadow-sm transition-all group text-center"
                                >
                                    <div className={`w-8 h-8 ${link.color} rounded-lg flex items-center justify-center group-hover:bg-[var(--accent-primary)] group-hover:text-white transition-colors mb-1`}>
                                        <link.icon size={16} />
                                    </div>
                                    <span className="text-xs font-medium text-gray-700">{link.label}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
