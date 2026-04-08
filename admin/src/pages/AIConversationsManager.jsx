import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import {
    Bot, Search, RefreshCw, MessageSquare, Clock, Inbox,
    TrendingUp, Calendar, Filter, ChevronLeft, ChevronRight,
    Loader2, Users, Hash, Zap
} from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabase';
import ChatReplayViewer from '../components/ChatReplayViewer';

const INTENT_CONFIG = {
    SERVICE_INQUIRY: { label: 'Service Inquiry', color: 'bg-blue-50 text-blue-700 border-blue-200' },
    FUNDING_REQUEST: { label: 'Funding Request', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    CONTACT_REQUEST: { label: 'Contact Request', color: 'bg-purple-50 text-purple-700 border-purple-200' },
    GENERAL_INFO: { label: 'General Info', color: 'bg-gray-100 text-gray-700 border-gray-200' },
    FORM_SUBMISSION: { label: 'Form Submission', color: 'bg-amber-50 text-amber-700 border-amber-200' },
};

const INTENTS = ['SERVICE_INQUIRY', 'FUNDING_REQUEST', 'CONTACT_REQUEST', 'GENERAL_INFO', 'FORM_SUBMISSION'];
const PAGE_SIZE = 20;

function getTimeAgo(dateStr) {
    if (!dateStr) return '';
    const seconds = Math.floor((new Date() - new Date(dateStr)) / 1000);
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 172800) return 'Yesterday';
    return `${Math.floor(seconds / 86400)}d ago`;
}

const AIConversationsManager = () => {
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterIntent, setFilterIntent] = useState('all');
    const [filterService, setFilterService] = useState('all');
    const [page, setPage] = useState(0);
    const [totalCount, setTotalCount] = useState(0);
    const [services, setServices] = useState([]);
    const [stats, setStats] = useState({ total: 0, today: 0, topIntent: '—', avgMessages: 0 });
    const pollingRef = useRef(null);

    const fetchConversations = useCallback(async (silent = false) => {
        if (!silent) setLoading(true);
        try {
            // Build query
            let query = supabase
                .from('chat_conversations')
                .select('*', { count: 'exact' })
                .order('updated_at', { ascending: false });

            if (filterIntent !== 'all') query = query.eq('intent', filterIntent);
            if (filterService !== 'all') query = query.eq('service_mentioned', filterService);
            if (searchQuery.trim()) {
                const s = searchQuery.trim();
                query = query.or(`visitor_name.ilike.%${s}%,visitor_email.ilike.%${s}%,session_id.ilike.%${s}%`);
            }

            const from = page * PAGE_SIZE;
            const to = from + PAGE_SIZE - 1;
            query = query.range(from, to);

            const { data, error, count } = await query;
            if (error) throw error;

            setConversations(data || []);
            setTotalCount(count || 0);
        } catch (err) {
            console.error('Error fetching conversations:', err);
            if (!silent) toast.error('Failed to load conversations');
        } finally {
            if (!silent) setLoading(false);
        }
    }, [filterIntent, filterService, searchQuery, page]);

    const fetchStats = useCallback(async () => {
        try {
            const { data, error } = await supabase
                .from('chat_conversations')
                .select('intent, messages, created_at');
            if (error) throw error;
            if (!data) return;

            const total = data.length;
            const todayStart = new Date();
            todayStart.setHours(0, 0, 0, 0);
            const today = data.filter(c => new Date(c.created_at) >= todayStart).length;

            // Top intent
            const intentCounts = {};
            data.forEach(c => {
                if (c.intent) intentCounts[c.intent] = (intentCounts[c.intent] || 0) + 1;
            });
            const topIntent = Object.entries(intentCounts).sort((a, b) => b[1] - a[1])[0];

            // Avg messages
            const totalMsgs = data.reduce((sum, c) => {
                const msgs = Array.isArray(c.messages) ? c.messages.filter(m => m.role !== 'system').length : 0;
                return sum + msgs;
            }, 0);

            setStats({
                total,
                today,
                topIntent: topIntent ? (INTENT_CONFIG[topIntent[0]]?.label || topIntent[0]) : '—',
                avgMessages: total > 0 ? (totalMsgs / total).toFixed(1) : 0,
            });
        } catch (err) {
            console.error('Error fetching stats:', err);
        }
    }, []);

    const fetchServices = useCallback(async () => {
        try {
            const { data } = await supabase
                .from('chat_conversations')
                .select('service_mentioned')
                .not('service_mentioned', 'is', null);
            if (data) {
                const unique = [...new Set(data.map(d => d.service_mentioned).filter(Boolean))];
                setServices(unique.sort());
            }
        } catch (err) {
            console.error('Error fetching services:', err);
        }
    }, []);

    // Initial load
    useEffect(() => {
        fetchStats();
        fetchServices();
    }, [fetchStats, fetchServices]);

    useEffect(() => {
        fetchConversations();
    }, [fetchConversations]);

    // Polling every 30s
    useEffect(() => {
        pollingRef.current = setInterval(() => {
            fetchConversations(true);
            fetchStats();
        }, 30000);
        return () => clearInterval(pollingRef.current);
    }, [fetchConversations, fetchStats]);

    // Reset page when filters change
    useEffect(() => {
        setPage(0);
    }, [searchQuery, filterIntent, filterService]);

    const totalPages = Math.ceil(totalCount / PAGE_SIZE);

    return (
        <div className="space-y-4 h-[calc(100vh-2rem)] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center shrink-0">
                <div>
                    <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                        <Bot size={22} className="text-[var(--accent-primary)]" /> AI Conversations
                    </h1>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Monitor chatbot sessions and visitor interactions</p>
                </div>
                <div className="flex gap-2 items-center">
                    <span className="text-[10px] text-gray-400 dark:text-gray-500 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                        Auto-refresh 30s
                    </span>
                    <button
                        onClick={() => { fetchConversations(); fetchStats(); }}
                        className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                        <RefreshCw size={14} /> Refresh
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4 shrink-0">
                <div className="bg-white dark:bg-[#1E293B] rounded-xl p-4 border border-gray-100 dark:border-gray-700 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Total Sessions</p>
                        <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{stats.total}</p>
                    </div>
                    <div className="w-10 h-10 bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center justify-center text-gray-400">
                        <MessageSquare size={20} />
                    </div>
                </div>
                <div className="rounded-xl p-4 text-white shadow-lg relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0A3D62 0%, #1A365D 100%)' }}>
                    <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-8 -mt-8 blur-xl" />
                    <div className="relative z-10">
                        <p className="text-xs font-medium text-white/90 mb-1">Today</p>
                        <p className="text-2xl font-bold">{stats.today}</p>
                    </div>
                    <div className="absolute right-3 bottom-3 w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center z-10">
                        <Calendar size={20} className="text-white" />
                    </div>
                </div>
                <div className="bg-white dark:bg-[#1E293B] rounded-xl p-4 border border-gray-100 dark:border-gray-700 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Top Intent</p>
                        <p className="text-sm font-bold text-gray-800 dark:text-gray-100 truncate">{stats.topIntent}</p>
                    </div>
                    <div className="w-10 h-10 bg-amber-50 dark:bg-amber-900/30 rounded-lg flex items-center justify-center text-amber-500">
                        <Zap size={20} />
                    </div>
                </div>
                <div className="bg-white dark:bg-[#1E293B] rounded-xl p-4 border border-gray-100 dark:border-gray-700 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Avg Messages</p>
                        <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{stats.avgMessages}</p>
                    </div>
                    <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/30 rounded-lg flex items-center justify-center text-blue-500">
                        <Hash size={20} />
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex gap-3 items-center bg-white dark:bg-[#1E293B] rounded-xl p-2 border border-gray-200 dark:border-gray-700 shrink-0">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by name, email, or session ID..."
                        className="w-full pl-9 pr-4 py-2 bg-transparent text-sm focus:outline-none text-gray-800 dark:text-gray-200"
                    />
                </div>
                <div className="h-6 w-px bg-gray-200 dark:bg-gray-600" />
                <select
                    value={filterIntent}
                    onChange={(e) => setFilterIntent(e.target.value)}
                    className="px-3 py-1.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-xs font-medium focus:outline-none text-gray-600 dark:text-gray-300"
                >
                    <option value="all">All Intents</option>
                    {INTENTS.map(i => (
                        <option key={i} value={i}>{INTENT_CONFIG[i]?.label || i}</option>
                    ))}
                </select>
                <select
                    value={filterService}
                    onChange={(e) => setFilterService(e.target.value)}
                    className="px-3 py-1.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-xs font-medium focus:outline-none text-gray-600 dark:text-gray-300"
                >
                    <option value="all">All Services</option>
                    {services.map(s => (
                        <option key={s} value={s}>{s.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</option>
                    ))}
                </select>
            </div>

            {/* Table */}
            <div className="flex-1 bg-white dark:bg-[#1E293B] rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col min-h-0">
                {loading ? (
                    <div className="flex-1 flex items-center justify-center">
                        <Loader2 className="animate-spin text-[#0A3D62]" size={32} />
                    </div>
                ) : conversations.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                        <Inbox size={32} className="mb-2 opacity-30" />
                        <p className="text-xs">No conversations found</p>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto flex-1 overflow-y-auto">
                            <table className="w-full text-left">
                                <thead className="sticky top-0 bg-gray-50 dark:bg-[#0F172A] border-b border-gray-100 dark:border-gray-700 z-10">
                                    <tr>
                                        <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Visitor</th>
                                        <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Intent</th>
                                        <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Service</th>
                                        <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 text-center">Messages</th>
                                        <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 text-right">Last Active</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                                    {conversations.map(conv => {
                                        const intentCfg = INTENT_CONFIG[conv.intent] || INTENT_CONFIG.GENERAL_INFO;
                                        const msgCount = Array.isArray(conv.messages) ? conv.messages.filter(m => m.role !== 'system').length : 0;
                                        const name = conv.visitor_name || 'Anonymous';
                                        const email = conv.visitor_email || null;

                                        return (
                                            <tr
                                                key={conv.id}
                                                onClick={() => setSelectedConversation(conv)}
                                                className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                                            >
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-[var(--accent-primary)] text-white flex items-center justify-center text-xs font-bold shrink-0">
                                                            {name.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">{name}</p>
                                                            {email ? (
                                                                <p className="text-[11px] text-gray-400 dark:text-gray-500 truncate">{email}</p>
                                                            ) : (
                                                                <p className="text-[11px] text-gray-300 dark:text-gray-600 italic">No email</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className={`text-[10px] px-2 py-0.5 rounded border font-semibold whitespace-nowrap ${intentCfg.color}`}>
                                                        {intentCfg.label}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    {conv.service_mentioned ? (
                                                        <span className="text-xs text-gray-600 dark:text-gray-300">
                                                            {conv.service_mentioned.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                                                        </span>
                                                    ) : (
                                                        <span className="text-xs text-gray-300 dark:text-gray-600">—</span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
                                                        {msgCount}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <span className="text-xs text-gray-500 dark:text-gray-400">{getTimeAgo(conv.updated_at)}</span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between bg-gray-50/50 dark:bg-[#0F172A]/50 shrink-0">
                            <p className="text-[11px] text-gray-500 dark:text-gray-400">
                                Showing {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, totalCount)} of {totalCount}
                            </p>
                            <div className="flex gap-1">
                                <button
                                    onClick={() => setPage(p => Math.max(0, p - 1))}
                                    disabled={page === 0}
                                    className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-gray-600 dark:text-gray-300"
                                >
                                    <ChevronLeft size={14} />
                                </button>
                                <span className="px-3 py-1 text-xs font-medium text-gray-600 dark:text-gray-300">
                                    {page + 1} / {totalPages || 1}
                                </span>
                                <button
                                    onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                                    disabled={page >= totalPages - 1}
                                    className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-gray-600 dark:text-gray-300"
                                >
                                    <ChevronRight size={14} />
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Chat Replay Viewer */}
            {selectedConversation && (
                <ChatReplayViewer
                    conversation={selectedConversation}
                    onClose={() => setSelectedConversation(null)}
                />
            )}
        </div>
    );
};

export default AIConversationsManager;
