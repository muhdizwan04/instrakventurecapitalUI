import React, { useState, useMemo, useEffect } from 'react';
import { 
    Mail, Search, Trash2, RefreshCw, FileDown, CheckCircle, Clock, 
    AlertCircle, Users, Briefcase, FileText, Filter, MoreVertical,
    Phone, Building2, ExternalLink, MessageSquare, X, ChevronDown,
    Inbox, Send, Archive, Loader2, Eye
} from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabase';

const InquiriesManager = () => {
    const [view, setView] = useState('list'); // 'list' | 'kanban'
    const [selectedInquiry, setSelectedInquiry] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [inquiries, setInquiries] = useState([]);
    const [noteInput, setNoteInput] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterType, setFilterType] = useState('all');
    const [services, setServices] = useState([]);

    const CRM_STATUSES = [
        { id: 'new', label: 'New', color: 'bg-blue-500', lightColor: 'bg-blue-50 text-blue-700 border-blue-200' },
        { id: 'in_progress', label: 'In Progress', color: 'bg-yellow-500', lightColor: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
        { id: 'contacted', label: 'Contacted', color: 'bg-purple-500', lightColor: 'bg-purple-50 text-purple-700 border-purple-200' },
        { id: 'qualified', label: 'Qualified', color: 'bg-green-500', lightColor: 'bg-green-50 text-green-700 border-green-200' },
        { id: 'resolved', label: 'Resolved', color: 'bg-gray-400', lightColor: 'bg-gray-50 text-gray-600 border-gray-200' },
        { id: 'lost', label: 'Lost', color: 'bg-red-500', lightColor: 'bg-red-50 text-red-600 border-red-200' }
    ];

    // Fetch services dynamically from database
    useEffect(() => {
        const fetchServices = async () => {
            try {
                const { data, error } = await supabase
                    .from('site_content')
                    .select('content')
                    .eq('id', 'services')
                    .single();
                
                if (!error && data?.content?.items) {
                    setServices(data.content.items);
                }
            } catch (err) {
                console.error('Error fetching services:', err);
            }
        };
        fetchServices();
    }, []);

    useEffect(() => {
        fetchInquiries();
    }, []);

    const fetchInquiries = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('inquiries')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            const transformed = data.map(item => ({
                id: item.id,
                type: item.type,
                name: item.name,
                email: item.email,
                subject: item.subject || `${item.type} Inquiry`,
                message: item.message || '',
                date: new Date(item.created_at).toLocaleDateString(),
                createdAt: item.created_at,
                status: item.status || 'new',
                metadata: {
                    ...(item.metadata || {}),
                    companyName: item.company_name,
                    phone: item.phone,
                    notes: item.metadata?.notes || []
                }
            }));

            setInquiries(transformed);
        } catch (err) {
            console.error('Error fetching inquiries:', err);
            toast.error('Failed to load inquiries');
        } finally {
            setLoading(false);
        }
    };

    // Dynamic inquiry types from actual data + services
    const inquiryTypes = useMemo(() => {
        const typesFromData = [...new Set(inquiries.map(i => i.type))];
        return typesFromData.map(type => ({
            id: type,
            label: type.charAt(0).toUpperCase() + type.slice(1).replace(/_/g, ' ')
        }));
    }, [inquiries]);

    const filteredInquiries = useMemo(() => {
        return inquiries
            .filter(inq => filterStatus === 'all' || inq.status === filterStatus)
            .filter(inq => filterType === 'all' || inq.type === filterType)
            .filter(inq =>
                inq.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                inq.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                inq.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (inq.metadata?.companyName || '').toLowerCase().includes(searchQuery.toLowerCase())
            );
    }, [inquiries, filterStatus, filterType, searchQuery]);

    // Stats
    const stats = useMemo(() => ({
        total: inquiries.length,
        new: inquiries.filter(i => i.status === 'new').length,
        inProgress: inquiries.filter(i => i.status === 'in_progress' || i.status === 'contacted').length,
        resolved: inquiries.filter(i => i.status === 'resolved' || i.status === 'qualified').length
    }), [inquiries]);

    const handleUpdateStatus = async (id, newStatus) => {
        try {
            const { error } = await supabase
                .from('inquiries')
                .update({ status: newStatus })
                .eq('id', id);

            if (error) throw error;

            setInquiries(prev => prev.map(inq =>
                inq.id === id ? { ...inq, status: newStatus } : inq
            ));

            if (selectedInquiry?.id === id) {
                setSelectedInquiry(prev => ({ ...prev, status: newStatus }));
            }
            toast.success(`Status updated`);
        } catch (err) {
            console.error('Error updating status:', err);
            toast.error('Failed to update status');
        }
    };

    const handleAddNote = async () => {
        if (!noteInput.trim() || !selectedInquiry) return;

        const newNote = {
            id: Date.now(),
            text: noteInput,
            date: new Date().toISOString(),
            author: 'Admin'
        };

        const updatedNotes = [newNote, ...(selectedInquiry.metadata.notes || [])];
        const updatedMetadata = { ...selectedInquiry.metadata, notes: updatedNotes };

        try {
            const { error } = await supabase
                .from('inquiries')
                .update({ metadata: updatedMetadata })
                .eq('id', selectedInquiry.id);

            if (error) throw error;

            setInquiries(prev => prev.map(inq =>
                inq.id === selectedInquiry.id ? { ...inq, metadata: updatedMetadata } : inq
            ));
            setSelectedInquiry(prev => ({ ...prev, metadata: updatedMetadata }));
            setNoteInput('');
            toast.success('Note added');
        } catch (err) {
            console.error('Error adding note:', err);
            toast.error('Failed to add note');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this inquiry?')) return;

        try {
            const { error } = await supabase
                .from('inquiries')
                .delete()
                .eq('id', id);

            if (error) throw error;

            setInquiries(prev => prev.filter(inq => inq.id !== id));
            setSelectedInquiry(null);
            toast.success('Inquiry deleted');
        } catch (err) {
            console.error('Error deleting:', err);
            toast.error('Failed to delete');
        }
    };

    const handleExportCSV = () => {
        const headers = ['Date', 'Type', 'Status', 'Name', 'Email', 'Company', 'Subject'];
        const csvContent = [
            headers.join(','),
            ...filteredInquiries.map(inq => [
                `"${inq.date}"`,
                `"${inq.type}"`,
                `"${inq.status}"`,
                `"${inq.name}"`,
                `"${inq.email}"`,
                `"${inq.metadata?.companyName || ''}"`,
                `"${inq.subject.replace(/"/g, '""')}"`
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `inquiries_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success('Export complete');
    };

    const getStatusStyle = (status) => {
        return CRM_STATUSES.find(s => s.id === status)?.lightColor || 'bg-gray-100 text-gray-600';
    };

    // Inquiry Card Component
    const InquiryCard = ({ inquiry, compact = false }) => (
        <div
            onClick={() => setSelectedInquiry(inquiry)}
            className={`bg-white rounded-lg border border-gray-200 p-4 cursor-pointer hover:shadow-md hover:border-blue-300 transition-all ${
                selectedInquiry?.id === inquiry.id ? 'ring-2 ring-blue-500 border-blue-500' : ''
            } ${compact ? 'p-3' : ''}`}
        >
            <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                        {inquiry.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h4 className="font-semibold text-sm text-gray-900">{inquiry.name}</h4>
                        <p className="text-xs text-gray-500">{inquiry.email}</p>
                    </div>
                </div>
                <span className="text-[10px] text-gray-400">{inquiry.date}</span>
            </div>
            
            <p className="text-sm text-gray-700 font-medium mb-2 line-clamp-1">{inquiry.subject}</p>
            
            {!compact && inquiry.message && (
                <p className="text-xs text-gray-500 line-clamp-2 mb-3">{inquiry.message}</p>
            )}
            
            <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-medium">
                    {inquiry.type}
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium border ${getStatusStyle(inquiry.status)}`}>
                    {CRM_STATUSES.find(s => s.id === inquiry.status)?.label || inquiry.status}
                </span>
                {inquiry.metadata.notes?.length > 0 && (
                    <span className="text-[10px] text-gray-400 flex items-center gap-1">
                        <MessageSquare size={10} /> {inquiry.metadata.notes.length}
                    </span>
                )}
            </div>
        </div>
    );

    // Detail Panel Component
    const DetailPanel = () => {
        if (!selectedInquiry) return (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 bg-gray-50">
                <Inbox size={48} className="mb-3 opacity-30" />
                <p className="text-sm">Select an inquiry to view details</p>
            </div>
        );

        return (
            <div className="flex-1 flex flex-col bg-white overflow-hidden">
                {/* Header */}
                <div className="p-5 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-lg font-bold">
                                {selectedInquiry.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">{selectedInquiry.name}</h2>
                                <div className="flex items-center gap-3 text-sm text-gray-500">
                                    <a href={`mailto:${selectedInquiry.email}`} className="hover:text-blue-600 flex items-center gap-1">
                                        <Mail size={14} /> {selectedInquiry.email}
                                    </a>
                                    {selectedInquiry.metadata.phone && (
                                        <span className="flex items-center gap-1">
                                            <Phone size={14} /> {selectedInquiry.metadata.phone}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <button onClick={() => setSelectedInquiry(null)} className="p-1 hover:bg-gray-100 rounded">
                            <X size={18} className="text-gray-400" />
                        </button>
                    </div>

                    <div className="flex items-center gap-3">
                        <select
                            value={selectedInquiry.status}
                            onChange={(e) => handleUpdateStatus(selectedInquiry.id, e.target.value)}
                            className={`text-sm font-medium px-3 py-1.5 rounded-lg border cursor-pointer ${getStatusStyle(selectedInquiry.status)}`}
                        >
                            {CRM_STATUSES.map(status => (
                                <option key={status.id} value={status.id}>{status.label}</option>
                            ))}
                        </select>
                        <span className="text-xs text-gray-400 px-2 py-1 bg-gray-100 rounded">{selectedInquiry.type}</span>
                        <span className="text-xs text-gray-400">{selectedInquiry.date}</span>
                        <button
                            onClick={() => handleDelete(selectedInquiry.id)}
                            className="ml-auto p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-5 space-y-5">
                    {/* Subject & Message */}
                    <div className="bg-gray-50 rounded-xl p-4">
                        <h3 className="font-semibold text-gray-900 mb-2">{selectedInquiry.subject}</h3>
                        <p className="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed">
                            {selectedInquiry.message || 'No message provided.'}
                        </p>
                    </div>

                    {/* Metadata */}
                    {Object.entries(selectedInquiry.metadata).filter(([k, v]) => v && k !== 'notes').length > 0 && (
                        <div className="bg-blue-50 rounded-xl p-4">
                            <h4 className="text-sm font-semibold text-blue-900 mb-3 flex items-center gap-2">
                                <Briefcase size={14} /> Application Details
                            </h4>
                            <div className="grid grid-cols-2 gap-3">
                                {Object.entries(selectedInquiry.metadata)
                                    .filter(([key, value]) => value && key !== 'notes')
                                    .map(([key, value]) => (
                                        <div key={key}>
                                            <span className="text-[10px] text-blue-600 uppercase tracking-wide">{key.replace(/([A-Z])/g, ' $1')}</span>
                                            <p className="text-sm font-medium text-gray-800">{String(value)}</p>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    )}

                    {/* Notes */}
                    <div className="bg-white border border-gray-200 rounded-xl p-4">
                        <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <MessageSquare size={14} /> Notes ({selectedInquiry.metadata.notes?.length || 0})
                        </h4>

                        <div className="flex gap-2 mb-4">
                            <input
                                type="text"
                                value={noteInput}
                                onChange={(e) => setNoteInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleAddNote()}
                                placeholder="Add a note..."
                                className="flex-1 px-3 py-2 bg-gray-50 rounded-lg text-sm border border-gray-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 outline-none"
                            />
                            <button
                                onClick={handleAddNote}
                                disabled={!noteInput.trim()}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
                            >
                                Add
                            </button>
                        </div>

                        <div className="space-y-2 max-h-48 overflow-y-auto">
                            {(selectedInquiry.metadata.notes || []).length === 0 ? (
                                <p className="text-xs text-gray-400 text-center py-4">No notes yet</p>
                            ) : (
                                selectedInquiry.metadata.notes.map((note, idx) => (
                                    <div key={idx} className="bg-yellow-50 border border-yellow-100 p-3 rounded-lg">
                                        <p className="text-sm text-gray-700">{note.text}</p>
                                        <div className="flex justify-between mt-2 text-[10px] text-gray-400">
                                            <span>{new Date(note.date).toLocaleString()}</span>
                                            <span>{note.author}</span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex gap-2">
                        <a
                            href={`mailto:${selectedInquiry.email}`}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                        >
                            <Send size={16} /> Reply via Email
                        </a>
                        <button
                            onClick={() => handleUpdateStatus(selectedInquiry.id, 'resolved')}
                            className="flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                        >
                            <CheckCircle size={16} /> Mark Resolved
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="animate-spin text-blue-600" size={40} />
            </div>
        );
    }

    return (
        <div className="space-y-5 h-[calc(100vh-120px)] flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Inquiries</h1>
                    <p className="text-sm text-gray-500">Manage leads and customer inquiries</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={handleExportCSV}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                        <FileDown size={16} /> Export
                    </button>
                    <button
                        onClick={fetchInquiries}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                        <RefreshCw size={16} /> Refresh
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4">
                <div className="bg-white rounded-xl p-4 border border-gray-200">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Total</span>
                        <Inbox size={18} className="text-gray-400" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
                </div>
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-blue-600">New</span>
                        <AlertCircle size={18} className="text-blue-500" />
                    </div>
                    <p className="text-2xl font-bold text-blue-700 mt-1">{stats.new}</p>
                </div>
                <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-100">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-yellow-600">In Progress</span>
                        <Clock size={18} className="text-yellow-500" />
                    </div>
                    <p className="text-2xl font-bold text-yellow-700 mt-1">{stats.inProgress}</p>
                </div>
                <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-green-600">Resolved</span>
                        <CheckCircle size={18} className="text-green-500" />
                    </div>
                    <p className="text-2xl font-bold text-green-700 mt-1">{stats.resolved}</p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex gap-3 items-center bg-white rounded-xl p-3 border border-gray-200">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by name, email, or company..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                </div>

                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                >
                    <option value="all">All Status</option>
                    {CRM_STATUSES.map(s => (
                        <option key={s.id} value={s.id}>{s.label}</option>
                    ))}
                </select>

                <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                >
                    <option value="all">All Types</option>
                    {inquiryTypes.map(t => (
                        <option key={t.id} value={t.id}>{t.label}</option>
                    ))}
                </select>

                <span className="text-sm text-gray-500">
                    {filteredInquiries.length} result{filteredInquiries.length !== 1 ? 's' : ''}
                </span>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex gap-5 min-h-0 overflow-hidden">
                {/* List */}
                <div className="w-[420px] flex flex-col bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="flex-1 overflow-y-auto p-3 space-y-3">
                        {filteredInquiries.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                                <Search size={32} className="mb-2 opacity-30" />
                                <p className="text-sm">No inquiries found</p>
                            </div>
                        ) : (
                            filteredInquiries.map(inq => (
                                <InquiryCard key={inq.id} inquiry={inq} />
                            ))
                        )}
                    </div>
                </div>

                {/* Detail Panel */}
                <div className="flex-1 bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col">
                    <DetailPanel />
                </div>
            </div>
        </div>
    );
};

export default InquiriesManager;
