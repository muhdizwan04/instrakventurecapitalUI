import React, { useState, useMemo, useEffect } from 'react';
import { 
    Mail, Search, Trash2, RefreshCw, FileDown, CheckCircle, Clock, 
    AlertCircle, Inbox, MessageSquare, X,
    Phone, Send, Loader2, Calendar, CheckSquare, Square,
    Briefcase, Building2, User
} from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabase';

const ExportModal = ({ isOpen, onClose, onExport }) => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [columns, setColumns] = useState({
        date: true,
        type: true,
        status: true,
        name: true,
        email: true,
        company: true,
        phone: true,
        subject: true,
        message: true,
        notes: false
    });

    if (!isOpen) return null;

    const handleToggle = (col) => {
        setColumns(prev => ({ ...prev, [col]: !prev[col] }));
    };

    const handleExport = () => {
        onExport({ startDate, endDate, columns });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h3 className="font-bold text-gray-800 flex items-center gap-2">
                        <FileDown size={18} className="text-[var(--accent-primary)]" /> Export Inquiries
                    </h3>
                    <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-full text-gray-500">
                        <X size={18} />
                    </button>
                </div>
                
                <div className="p-6 space-y-6">
                    {/* Date Range */}
                    <div className="space-y-3">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Date Range</label>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs text-gray-400 mb-1">Start Date</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                                    <input 
                                        type="date" 
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-[var(--accent-primary)] focus:ring-1 focus:ring-[var(--accent-primary)]"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs text-gray-400 mb-1">End Date</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                                    <input 
                                        type="date" 
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-[var(--accent-primary)] focus:ring-1 focus:ring-[var(--accent-primary)]"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Columns */}
                    <div className="space-y-3">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Include Columns</label>
                        <div className="grid grid-cols-2 gap-2">
                            {Object.keys(columns).map(col => (
                                <button 
                                    key={col}
                                    onClick={() => handleToggle(col)}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm border transition-colors ${
                                        columns[col] 
                                        ? 'bg-[var(--bg-secondary)] border-[var(--accent-primary)] text-[var(--accent-primary)]' 
                                        : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
                                    }`}
                                >
                                    {columns[col] ? <CheckSquare size={16} /> : <Square size={16} />}
                                    <span className="capitalize">{col}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-2">
                    <button 
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleExport}
                        className="px-4 py-2 text-sm font-medium bg-[var(--accent-primary)] text-white rounded-lg hover:opacity-90 shadow-sm flex items-center gap-2"
                    >
                        <FileDown size={16} /> Export CSV
                    </button>
                </div>
            </div>
        </div>
    );
};

const InquiriesManager = () => {
    const [selectedInquiry, setSelectedInquiry] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [inquiries, setInquiries] = useState([]);
    const [noteInput, setNoteInput] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterType, setFilterType] = useState('all');
    const [showExportModal, setShowExportModal] = useState(false);

    const CRM_STATUSES = [
        { id: 'new', label: 'New', color: 'bg-blue-500', lightColor: 'bg-blue-50 text-blue-700 border-blue-200' },
        { id: 'in_progress', label: 'In Progress', color: 'bg-yellow-500', lightColor: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
        { id: 'contacted', label: 'Contacted', color: 'bg-purple-500', lightColor: 'bg-purple-50 text-purple-700 border-purple-200' },
        { id: 'qualified', label: 'Qualified', color: 'bg-green-500', lightColor: 'bg-green-50 text-green-700 border-green-200' },
        { id: 'resolved', label: 'Resolved', color: 'bg-gray-400', lightColor: 'bg-gray-100 text-gray-600 border-gray-200' },
        { id: 'lost', label: 'Lost', color: 'bg-red-500', lightColor: 'bg-red-50 text-red-600 border-red-200' }
    ];

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
                type: item.type || 'general',
                name: item.name || 'Unknown',
                email: item.email || '',
                subject: item.subject || `${item.type || 'General'} Inquiry`,
                message: item.message || '',
                date: item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Unknown Date',
                createdAt: item.created_at || new Date().toISOString(),
                status: item.status || 'new',
                metadata: {
                    ...(item.metadata || {}),
                    companyName: item.company_name,
                    phone: item.phone,
                    notes: Array.isArray(item.metadata?.notes) ? item.metadata.notes : []
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

    const executeExport = ({ startDate, endDate, columns }) => {
        let data = inquiries;

        if (startDate) {
            data = data.filter(i => new Date(i.createdAt) >= new Date(startDate));
        }
        if (endDate) {
            data = data.filter(i => new Date(i.createdAt) <= new Date(endDate));
        }

        const activeCols = Object.keys(columns).filter(k => columns[k]);
        const csvContent = [
            activeCols.join(','),
            ...data.map(row => 
                activeCols.map(col => {
                    let val = '';
                    if (col === 'company') val = row.metadata.companyName;
                    else if (col === 'phone') val = row.metadata.phone;
                    else if (col === 'notes') val = row.metadata.notes?.map(n => n.text).join(' | ');
                    else val = row[col];
                    return `"${String(val || '').replace(/"/g, '""')}"`;
                }).join(',')
            )
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `inquiries_export_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        toast.success('Export downloaded');
    };

    return (
        <div className="space-y-4 h-[calc(100vh-2rem)] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center shrink-0">
                <div>
                    <h1 className="text-xl font-bold text-gray-900">Inquiries</h1>
                    <p className="text-xs text-gray-500">Manage leads and customer inquiries</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setShowExportModal(true)}
                        className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                        <FileDown size={14} /> Export
                    </button>
                    <button
                        onClick={fetchInquiries}
                        className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                        <RefreshCw size={14} /> Refresh
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4 shrink-0">
                <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs font-medium text-gray-500 mb-1">Total</p>
                        <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
                    </div>
                    <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400">
                        <Inbox size={20} />
                    </div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-[var(--accent-primary)] shadow-sm flex items-center justify-between relative overflow-hidden">
                    <div className="absolute right-0 top-0 w-16 h-16 bg-[var(--accent-primary)] opacity-5 rounded-bl-full"></div>
                    <div className="relative z-10">
                        <p className="text-xs font-medium text-[var(--accent-primary)] mb-1">New</p>
                        <p className="text-2xl font-bold text-[var(--accent-primary)]">{stats.new}</p>
                    </div>
                    <div className="relative z-10 w-10 h-10 bg-[var(--bg-tertiary)] rounded-lg flex items-center justify-center text-[var(--accent-primary)]">
                        <AlertCircle size={20} />
                    </div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs font-medium text-yellow-600 mb-1">In Progress</p>
                        <p className="text-2xl font-bold text-gray-800">{stats.inProgress}</p>
                    </div>
                    <div className="w-10 h-10 bg-yellow-50 rounded-lg flex items-center justify-center text-yellow-500">
                        <Clock size={20} />
                    </div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs font-medium text-green-600 mb-1">Resolved</p>
                        <p className="text-2xl font-bold text-gray-800">{stats.resolved}</p>
                    </div>
                    <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-green-500">
                        <CheckCircle size={20} />
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex gap-3 items-center bg-white rounded-xl p-2 border border-gray-200 shrink-0">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by name, email, or company..."
                        className="w-full pl-9 pr-4 py-2 bg-transparent text-sm focus:outline-none"
                    />
                </div>
                <div className="h-6 w-px bg-gray-200"></div>
                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium focus:outline-none text-gray-600"
                >
                    <option value="all">All Status</option>
                    {CRM_STATUSES.map(s => (
                        <option key={s.id} value={s.id}>{s.label}</option>
                    ))}
                </select>
                <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium focus:outline-none text-gray-600"
                >
                    <option value="all">All Types</option>
                    {inquiryTypes.map(t => (
                        <option key={t.id} value={t.label}>{t.label}</option>
                    ))}
                </select>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex gap-4 min-h-0 overflow-hidden">
                {/* List */}
                <div className="w-[380px] flex flex-col bg-white rounded-xl border border-gray-200 overflow-hidden shrink-0">
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        {filteredInquiries.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                                <Search size={24} className="mb-2 opacity-30" />
                                <p className="text-xs">No inquiries found</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-50">
                                {filteredInquiries.map(inq => (
                                    <div
                                        key={inq.id}
                                        onClick={() => setSelectedInquiry(inq)}
                                        className={`p-4 cursor-pointer transition-all hover:bg-gray-50 ${
                                            selectedInquiry?.id === inq.id 
                                            ? 'bg-[var(--bg-tertiary)] border-l-4 border-l-[var(--accent-primary)]' 
                                            : 'border-l-4 border-l-transparent'
                                        }`}
                                    >
                                        <div className="flex justify-between items-start mb-1">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[8px] font-bold text-white shrink-0 ${
                                                    selectedInquiry?.id === inq.id ? 'bg-[var(--accent-primary)]' : 'bg-gray-400'
                                                }`}>
                                                    {inq.name.charAt(0).toUpperCase()}
                                                </div>
                                                <h4 className={`text-sm font-semibold truncate ${
                                                    selectedInquiry?.id === inq.id ? 'text-[var(--accent-primary)]' : 'text-gray-900'
                                                }`}>{inq.name}</h4>
                                            </div>
                                            <span className="text-[10px] text-gray-400 whitespace-nowrap">{inq.date}</span>
                                        </div>
                                        <p className="text-xs text-gray-600 truncate mb-2 pl-8">{inq.subject}</p>
                                        <div className="flex items-center gap-2 pl-8">
                                            <span className={`text-[10px] px-1.5 py-0.5 rounded border capitalize ${
                                                CRM_STATUSES.find(s => s.id === inq.status)?.lightColor || 'bg-gray-50 text-gray-500 border-gray-100'
                                            }`}>
                                                {CRM_STATUSES.find(s => s.id === inq.status)?.label || inq.status}
                                            </span>
                                            <span className="text-[10px] text-gray-400 capitalize">{inq.type}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Detail Panel */}
                <div className="flex-1 bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col">
                    {selectedInquiry ? (
                        <>
                            {/* Detail Header */}
                            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-start bg-gray-50/50">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-[var(--accent-primary)] text-white flex items-center justify-center text-xl font-bold shadow-sm">
                                        {selectedInquiry.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-gray-900">{selectedInquiry.subject}</h2>
                                        <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                                            <span className="flex items-center gap-1">
                                                <User size={12} /> {selectedInquiry.name}
                                            </span>
                                            {selectedInquiry.metadata.companyName && (
                                                <span className="flex items-center gap-1">
                                                    <Building2 size={12} /> {selectedInquiry.metadata.companyName}
                                                </span>
                                            )}
                                            <span className="flex items-center gap-1">
                                                <Clock size={12} /> {new Date(selectedInquiry.createdAt).toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <select
                                        value={selectedInquiry.status}
                                        onChange={(e) => handleUpdateStatus(selectedInquiry.id, e.target.value)}
                                        className={`text-xs font-semibold px-3 py-1.5 rounded-lg border cursor-pointer focus:outline-none ${
                                            CRM_STATUSES.find(s => s.id === selectedInquiry.status)?.lightColor || ''
                                        }`}
                                    >
                                        {CRM_STATUSES.map(status => (
                                            <option key={status.id} value={status.id}>{status.label}</option>
                                        ))}
                                    </select>
                                    <button 
                                        onClick={() => handleDelete(selectedInquiry.id)}
                                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            {/* Detail Content */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                                {/* Message */}
                                <div className="prose prose-sm max-w-none">
                                    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-2">Message</h3>
                                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 text-gray-700 text-sm whitespace-pre-wrap leading-relaxed">
                                        {selectedInquiry.message || 'No message provided.'}
                                    </div>
                                </div>

                                {/* Metadata Grid */}
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">Contact Details</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-3 bg-white border border-gray-200 rounded-lg flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                                                <Mail size={14} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-gray-400 uppercase">Email</p>
                                                <a href={`mailto:${selectedInquiry.email}`} className="text-xs font-medium text-blue-600 hover:underline">
                                                    {selectedInquiry.email}
                                                </a>
                                            </div>
                                        </div>
                                        {selectedInquiry.metadata.phone && (
                                            <div className="p-3 bg-white border border-gray-200 rounded-lg flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-green-50 text-green-600 flex items-center justify-center">
                                                    <Phone size={14} />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] text-gray-400 uppercase">Phone</p>
                                                    <p className="text-xs font-medium text-gray-900">{selectedInquiry.metadata.phone}</p>
                                                </div>
                                            </div>
                                        )}
                                        {Object.entries(selectedInquiry.metadata)
                                            .filter(([k, v]) => v && !['notes', 'companyName', 'phone'].includes(k))
                                            .map(([key, value]) => (
                                                <div key={key} className="p-3 bg-white border border-gray-200 rounded-lg">
                                                    <p className="text-[10px] text-gray-400 uppercase mb-1">{key.replace(/([A-Z])/g, ' $1')}</p>
                                                    <p className="text-xs font-medium text-gray-900 line-clamp-2">{String(value)}</p>
                                                </div>
                                            ))}
                                    </div>
                                </div>

                                {/* Notes Section */}
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3 flex items-center gap-2">
                                        Notes <span className="bg-gray-100 text-gray-600 px-1.5 rounded-full text-[10px]">{selectedInquiry.metadata.notes?.length || 0}</span>
                                    </h3>
                                    
                                    <div className="space-y-3 mb-4">
                                        {(selectedInquiry.metadata.notes || []).map((note, idx) => (
                                            <div key={idx} className="flex gap-3">
                                                <div className="w-6 h-6 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600 shrink-0 text-[10px] font-bold">
                                                    {(note.author || '?').charAt(0)}
                                                </div>
                                                <div className="bg-yellow-50/50 p-3 rounded-lg border border-yellow-100 flex-1">
                                                    <p className="text-xs text-gray-800 mb-1">{note.text}</p>
                                                    <p className="text-[10px] text-gray-400">{new Date(note.date).toLocaleString()}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={noteInput}
                                            onChange={(e) => setNoteInput(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && handleAddNote()}
                                            placeholder="Add an internal note..."
                                            className="flex-1 px-3 py-2 bg-gray-50 rounded-lg text-xs border border-gray-200 focus:border-[var(--accent-primary)] focus:outline-none"
                                        />
                                        <button
                                            onClick={handleAddNote}
                                            disabled={!noteInput.trim()}
                                            className="px-3 py-2 bg-[var(--accent-primary)] text-white rounded-lg text-xs font-medium hover:opacity-90 disabled:opacity-50 transition-colors"
                                        >
                                            Add
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Footer Actions */}
                            <div className="p-4 border-t border-gray-100 bg-gray-50 flex gap-3">
                                <a
                                    href={`mailto:${selectedInquiry.email}`}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
                                >
                                    <Send size={14} /> Reply via Email
                                </a>
                                <button
                                    onClick={() => handleUpdateStatus(selectedInquiry.id, 'resolved')}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700 transition-colors shadow-sm"
                                >
                                    <CheckCircle size={14} /> Mark Resolved
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-gray-400 bg-gray-50/50">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                <Inbox size={32} className="text-gray-300" />
                            </div>
                            <h3 className="text-sm font-semibold text-gray-900">No inquiry selected</h3>
                            <p className="text-xs text-gray-500 max-w-xs text-center mt-1">Select an item from the list to view its details, status, and manage notes.</p>
                        </div>
                    )}
                </div>
            </div>

            <ExportModal 
                isOpen={showExportModal} 
                onClose={() => setShowExportModal(false)} 
                onExport={executeExport} 
            />
        </div>
    );
};

export default InquiriesManager;
