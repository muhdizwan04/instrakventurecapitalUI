import React from 'react';
import { X, Bot, User, AlertTriangle, Clock, Mail, Tag, ExternalLink } from 'lucide-react';

const INTENT_CONFIG = {
    SERVICE_INQUIRY: { label: 'Service Inquiry', color: 'bg-blue-50 text-blue-700 border-blue-200' },
    FUNDING_REQUEST: { label: 'Funding Request', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    CONTACT_REQUEST: { label: 'Contact Request', color: 'bg-purple-50 text-purple-700 border-purple-200' },
    GENERAL_INFO: { label: 'General Info', color: 'bg-gray-100 text-gray-700 border-gray-200' },
    FORM_SUBMISSION: { label: 'Form Submission', color: 'bg-amber-50 text-amber-700 border-amber-200' },
};

function renderMarkdown(text) {
    if (!text) return '';
    return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\[([^\]]+)\]\(((?:\/|https?:\/\/)[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-600 underline hover:text-blue-800">$1</a>')
        .replace(/\n/g, '<br/>');
}

function getTimeAgo(dateStr) {
    if (!dateStr) return '';
    const seconds = Math.floor((new Date() - new Date(dateStr)) / 1000);
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 172800) return 'Yesterday';
    return `${Math.floor(seconds / 86400)}d ago`;
}

const ChatReplayViewer = ({ conversation, onClose }) => {
    if (!conversation) return null;

    const messages = Array.isArray(conversation.messages) ? conversation.messages : [];
    const intentCfg = INTENT_CONFIG[conversation.intent] || INTENT_CONFIG.GENERAL_INFO;
    const visitorName = conversation.visitor_name || 'Anonymous';
    const visitorEmail = conversation.visitor_email || null;

    return (
        <div className="fixed inset-0 z-50 flex items-stretch justify-end bg-black/40 backdrop-blur-sm" onClick={onClose}>
            <div
                className="w-full max-w-lg bg-white dark:bg-[#1E293B] shadow-2xl flex flex-col animate-slideInRight overflow-hidden"
                onClick={(e) => e.stopPropagation()}
                style={{ animation: 'slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}
            >
                {/* Header */}
                <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-[#0A3D62] to-[#1A365D] text-white">
                    <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center text-lg font-bold">
                                {visitorName.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h3 className="font-bold text-sm">{visitorName}</h3>
                                {visitorEmail && (
                                    <p className="text-xs text-white/70 flex items-center gap-1 mt-0.5">
                                        <Mail size={10} /> {visitorEmail}
                                    </p>
                                )}
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                        >
                            <X size={18} />
                        </button>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-[10px] px-2 py-0.5 rounded border font-semibold ${intentCfg.color}`}>
                            {intentCfg.label}
                        </span>
                        {conversation.service_mentioned && (
                            <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 text-white/80 border border-white/20 font-medium">
                                {conversation.service_mentioned.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                            </span>
                        )}
                        <span className="text-[10px] text-white/60 flex items-center gap-1 ml-auto">
                            <Clock size={10} />
                            {conversation.updated_at ? getTimeAgo(conversation.updated_at) : ''}
                        </span>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-[#0F172A]">
                    {messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400">
                            <Bot size={32} className="mb-2 opacity-30" />
                            <p className="text-xs">No messages in this conversation</p>
                        </div>
                    ) : (
                        messages.filter(m => m.role !== 'system').map((msg, i) => (
                            <div
                                key={i}
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                {msg.role !== 'user' && (
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mr-2 mt-1 ${
                                        msg.role === 'error'
                                            ? 'bg-red-100 text-red-500'
                                            : 'bg-[#0A3D62] text-white'
                                    }`}>
                                        {msg.role === 'error' ? <AlertTriangle size={12} /> : <Bot size={12} />}
                                    </div>
                                )}
                                <div
                                    className={`max-w-[80%] px-3.5 py-2.5 text-sm leading-relaxed rounded-2xl ${
                                        msg.role === 'user'
                                            ? 'bg-[#0A3D62] text-white rounded-br-md'
                                            : msg.role === 'error'
                                            ? 'bg-red-50 text-red-700 border border-red-200 rounded-bl-md'
                                            : 'bg-white dark:bg-[#1E293B] text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-bl-md shadow-sm'
                                    }`}
                                >
                                    {msg.role === 'user' ? (
                                        <span>{msg.content}</span>
                                    ) : (
                                        <span dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.content) }} />
                                    )}
                                </div>
                                {msg.role === 'user' && (
                                    <div className="w-6 h-6 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center shrink-0 ml-2 mt-1 text-white">
                                        <User size={12} />
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                <div className="px-5 py-3 border-t border-gray-100 dark:border-gray-700 bg-white dark:bg-[#1E293B] flex items-center justify-between">
                    <div className="text-[10px] text-gray-400 dark:text-gray-500">
                        {messages.filter(m => m.role !== 'system').length} messages · Session: <span className="font-mono">{conversation.session_id?.slice(0, 16)}…</span>
                    </div>
                    <div className="text-[10px] text-gray-400 dark:text-gray-500">
                        {conversation.created_at ? new Date(conversation.created_at).toLocaleString() : ''}
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default ChatReplayViewer;
