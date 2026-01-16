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
        { label: 'Home Page', path: '/home', icon: Home, color: 'bg-blue-500' },
        { label: 'Services', path: '/services', icon: Briefcase, color: 'bg-green-500' },
        { label: 'News', path: '/news', icon: Newspaper, color: 'bg-purple-500' },
        { label: 'Inquiries', path: '/inquiries', icon: Mail, color: 'bg-orange-500' },
        { label: 'Settings', path: '/global-settings', icon: Settings, color: 'bg-gray-500' },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="animate-spin text-blue-600" size={40} />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-sm text-gray-500">Welcome back! Here's your overview.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={fetchDashboardData}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                        <RefreshCw size={16} /> Refresh
                    </button>
                    <a
                        href="http://localhost:5173"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                        <ExternalLink size={16} /> View Site
                    </a>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-4 gap-4">
                <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-gray-500">Total Inquiries</span>
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Mail size={20} className="text-blue-600" />
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{stats.inquiries.total}</p>
                    <Link to="/inquiries" className="text-xs text-blue-600 hover:underline flex items-center gap-1 mt-2">
                        View all <ArrowRight size={12} />
                    </Link>
                </div>

                <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-xl p-5 text-white shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-white/80">New (Unread)</span>
                        <AlertCircle size={20} className="text-white/60" />
                    </div>
                    <p className="text-3xl font-bold">{stats.inquiries.new}</p>
                    <p className="text-xs text-white/70 mt-2">Needs attention</p>
                </div>

                <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-gray-500">Active Services</span>
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <Briefcase size={20} className="text-green-600" />
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{stats.services}</p>
                    <Link to="/services" className="text-xs text-green-600 hover:underline flex items-center gap-1 mt-2">
                        Manage <ArrowRight size={12} />
                    </Link>
                </div>

                <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-gray-500">News Articles</span>
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <Newspaper size={20} className="text-purple-600" />
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{stats.news}</p>
                    <Link to="/news" className="text-xs text-purple-600 hover:underline flex items-center gap-1 mt-2">
                        Manage <ArrowRight size={12} />
                    </Link>
                </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-3 gap-6">
                {/* Recent Inquiries */}
                <div className="col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="flex justify-between items-center p-4 border-b border-gray-100">
                        <h3 className="font-semibold text-gray-900">Recent Inquiries</h3>
                        <Link to="/inquiries" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                            View all <ArrowRight size={14} />
                        </Link>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {recentInquiries.length === 0 ? (
                            <div className="p-8 text-center text-gray-400">
                                <Mail size={32} className="mx-auto mb-2 opacity-30" />
                                <p className="text-sm">No inquiries yet</p>
                            </div>
                        ) : (
                            recentInquiries.map(inq => (
                                <div key={inq.id} className="p-4 hover:bg-gray-50 transition-colors flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
                                        {inq.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <p className="font-medium text-gray-900 truncate">{inq.name}</p>
                                            {inq.status === 'new' && (
                                                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] rounded-full font-medium">New</span>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-500 truncate">{inq.email}</p>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">{inq.type}</span>
                                        <p className="text-xs text-gray-400 mt-1">{getTimeAgo(inq.created_at)}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Right Sidebar */}
                <div className="space-y-6">
                    {/* Inquiry Types Breakdown */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                        <h3 className="font-semibold text-gray-900 mb-4">Inquiries by Type</h3>
                        <div className="space-y-3">
                            {inquiryTypes.length === 0 ? (
                                <p className="text-sm text-gray-400 text-center py-4">No data yet</p>
                            ) : (
                                inquiryTypes.slice(0, 5).map(item => (
                                    <div key={item.type} className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600 capitalize">{item.type.replace(/_/g, ' ')}</span>
                                        <div className="flex items-center gap-2">
                                            <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                                                <div 
                                                    className="h-full bg-blue-500 rounded-full"
                                                    style={{ width: `${(item.count / stats.inquiries.total) * 100}%` }}
                                                />
                                            </div>
                                            <span className="text-sm font-semibold text-gray-900 w-6 text-right">{item.count}</span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                        <h3 className="font-semibold text-gray-900 mb-4">Quick Links</h3>
                        <div className="grid grid-cols-2 gap-2">
                            {quickLinks.map(link => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className="flex items-center gap-2 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                                >
                                    <div className={`w-8 h-8 ${link.color} rounded-lg flex items-center justify-center`}>
                                        <link.icon size={16} className="text-white" />
                                    </div>
                                    <span className="text-sm font-medium text-gray-700">{link.label}</span>
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
