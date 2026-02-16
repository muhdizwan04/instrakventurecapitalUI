import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { Users, Search, Mail, Phone, Building2, Calendar, RefreshCcw, Loader2, Filter, Download, X, ChevronDown, FileText, Table } from 'lucide-react';

const UsersManager = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState(null);

    // Filter state
    const [showFilter, setShowFilter] = useState(false);
    const [filterType, setFilterType] = useState('all'); // all, date, month, year
    const [filterDateFrom, setFilterDateFrom] = useState('');
    const [filterDateTo, setFilterDateTo] = useState('');
    const [filterMonth, setFilterMonth] = useState(''); // YYYY-MM
    const [filterYear, setFilterYear] = useState('');

    // Download state
    const [showDownload, setShowDownload] = useState(false);
    const downloadRef = useRef(null);
    const filterRef = useRef(null);

    const fetchUsers = async () => {
        setLoading(true);
        setError(null);
        try {
            const { data, error: fetchError } = await supabase
                .from('client_profiles')
                .select('*')
                .order('created_at', { ascending: false });

            if (fetchError) throw fetchError;
            setUsers(data || []);
        } catch (err) {
            console.error('Error fetching users:', err);
            setError('Failed to load users. Make sure the client_profiles table exists.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Close dropdowns on outside click
    useEffect(() => {
        const handleClick = (e) => {
            if (downloadRef.current && !downloadRef.current.contains(e.target)) setShowDownload(false);
            if (filterRef.current && !filterRef.current.contains(e.target)) setShowFilter(false);
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    // Apply search + date filters
    const filteredUsers = users.filter(user => {
        const search = searchTerm.toLowerCase();
        const matchesSearch =
            user.email?.toLowerCase().includes(search) ||
            user.full_name?.toLowerCase().includes(search) ||
            user.company_name?.toLowerCase().includes(search);

        if (!matchesSearch) return false;

        // Date filters
        if (filterType === 'date' && (filterDateFrom || filterDateTo)) {
            const created = new Date(user.created_at);
            if (filterDateFrom && created < new Date(filterDateFrom)) return false;
            if (filterDateTo) {
                const end = new Date(filterDateTo);
                end.setHours(23, 59, 59, 999);
                if (created > end) return false;
            }
        }
        if (filterType === 'month' && filterMonth) {
            const created = new Date(user.created_at);
            const [y, m] = filterMonth.split('-').map(Number);
            if (created.getFullYear() !== y || created.getMonth() + 1 !== m) return false;
        }
        if (filterType === 'year' && filterYear) {
            const created = new Date(user.created_at);
            if (created.getFullYear() !== parseInt(filterYear)) return false;
        }
        return true;
    });

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('en-MY', {
            year: 'numeric', month: 'short', day: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    const clearFilters = () => {
        setFilterType('all');
        setFilterDateFrom('');
        setFilterDateTo('');
        setFilterMonth('');
        setFilterYear('');
    };

    const hasActiveFilter = filterType !== 'all';

    // --- Download functions ---

    const getFilterLabel = () => {
        if (filterType === 'date') return `${filterDateFrom || '...'} to ${filterDateTo || '...'}`;
        if (filterType === 'month') return filterMonth;
        if (filterType === 'year') return filterYear;
        return 'All';
    };

    const downloadCSV = () => {
        const headers = ['Name', 'Email', 'Company', 'Phone', 'Registered'];
        const rows = filteredUsers.map(u => [
            u.full_name || '', u.email || '', u.company_name || '', u.phone || '',
            u.created_at ? new Date(u.created_at).toLocaleString('en-MY') : ''
        ]);
        const csv = [headers.join(','), ...rows.map(r => r.map(c => `"${(c || '').replace(/"/g, '""')}"`).join(','))].join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `registered_clients_${getFilterLabel().replace(/\s+/g, '_')}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        setShowDownload(false);
    };

    const downloadPDF = () => {
        const win = window.open('', '_blank');
        const rows = filteredUsers.map(u => `
            <tr>
                <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;">${u.full_name || '-'}</td>
                <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;">${u.email || '-'}</td>
                <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;">${u.company_name || '-'}</td>
                <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;">${u.phone || '-'}</td>
                <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;">${u.created_at ? new Date(u.created_at).toLocaleString('en-MY') : '-'}</td>
            </tr>
        `).join('');
        win.document.write(`
            <html><head><title>Registered Clients</title>
            <style>body{font-family:Arial,sans-serif;padding:40px;color:#1a365d}
            h1{font-size:24px;margin-bottom:4px}p.sub{color:#6b7280;margin-bottom:24px;font-size:14px}
            table{width:100%;border-collapse:collapse;font-size:13px}
            th{background:#f3f4f6;padding:10px 12px;text-align:left;font-weight:600;border-bottom:2px solid #d1d5db}
            @media print{body{padding:20px}}</style></head><body>
            <h1>Registered Clients Report</h1>
            <p class="sub">Filter: ${getFilterLabel()} &nbsp;|&nbsp; Total: ${filteredUsers.length} clients &nbsp;|&nbsp; Generated: ${new Date().toLocaleString('en-MY')}</p>
            <table>
                <thead><tr>
                    <th>Name</th><th>Email</th><th>Company</th><th>Phone</th><th>Registered</th>
                </tr></thead>
                <tbody>${rows}</tbody>
            </table>
            <script>setTimeout(()=>{window.print()},500)</script>
            </body></html>
        `);
        win.document.close();
        setShowDownload(false);
    };

    // Generate year options from users
    const years = [...new Set(users.map(u => new Date(u.created_at).getFullYear()))].sort((a, b) => b - a);

    return (
        <div className="p-8">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-[var(--text-primary)] flex items-center gap-3">
                        <Users size={32} />
                        Registered Clients
                    </h1>
                    <p className="text-[var(--text-secondary)] mt-1">
                        View and manage client accounts registered on the website
                    </p>
                </div>
                <button
                    onClick={fetchUsers}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 bg-[var(--accent-primary)] text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                    <RefreshCcw size={18} className={loading ? 'animate-spin' : ''} />
                    Refresh
                </button>
            </div>

            {/* Search + Filter + Download Bar */}
            <div className="mb-6 flex flex-wrap items-center gap-3">
                {/* Search */}
                <div className="relative flex-1 min-w-[240px] max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search by name, email, or company..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent text-sm"
                    />
                </div>

                {/* Filter Button */}
                <div className="relative" ref={filterRef}>
                    <button
                        onClick={() => { setShowFilter(!showFilter); setShowDownload(false); }}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors ${hasActiveFilter ? 'bg-blue-50 border-blue-300 text-blue-700' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                    >
                        <Filter size={16} />
                        Filter
                        {hasActiveFilter && <span className="bg-blue-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">ON</span>}
                        <ChevronDown size={14} />
                    </button>

                    {showFilter && (
                        <div className="absolute top-full mt-2 left-0 bg-white border border-gray-200 rounded-xl shadow-xl p-4 z-50 w-80">
                            <div className="flex justify-between items-center mb-3">
                                <span className="font-bold text-sm text-gray-700">Filter by Date</span>
                                {hasActiveFilter && (
                                    <button onClick={clearFilters} className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1">
                                        <X size={12} /> Clear
                                    </button>
                                )}
                            </div>

                            {/* Filter Type Tabs */}
                            <div className="grid grid-cols-4 gap-1 bg-gray-100 p-1 rounded-lg mb-3">
                                {[
                                    { value: 'all', label: 'All' },
                                    { value: 'date', label: 'Date' },
                                    { value: 'month', label: 'Month' },
                                    { value: 'year', label: 'Year' },
                                ].map(tab => (
                                    <button key={tab.value}
                                        onClick={() => setFilterType(tab.value)}
                                        className={`text-xs py-1.5 rounded-md font-medium transition-colors ${filterType === tab.value ? 'bg-white shadow text-gray-800' : 'text-gray-500 hover:text-gray-700'}`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>

                            {/* Date Range */}
                            {filterType === 'date' && (
                                <div className="space-y-2">
                                    <div>
                                        <label className="text-xs text-gray-500 font-medium">From</label>
                                        <input type="date" value={filterDateFrom} onChange={e => setFilterDateFrom(e.target.value)}
                                            className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-500 font-medium">To</label>
                                        <input type="date" value={filterDateTo} onChange={e => setFilterDateTo(e.target.value)}
                                            className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                                    </div>
                                </div>
                            )}

                            {/* Month Picker */}
                            {filterType === 'month' && (
                                <div>
                                    <label className="text-xs text-gray-500 font-medium">Select Month</label>
                                    <input type="month" value={filterMonth} onChange={e => setFilterMonth(e.target.value)}
                                        className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                                </div>
                            )}

                            {/* Year Picker */}
                            {filterType === 'year' && (
                                <div>
                                    <label className="text-xs text-gray-500 font-medium">Select Year</label>
                                    <select value={filterYear} onChange={e => setFilterYear(e.target.value)}
                                        className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm">
                                        <option value="">All Years</option>
                                        {years.map(y => <option key={y} value={y}>{y}</option>)}
                                    </select>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Download Button */}
                <div className="relative" ref={downloadRef}>
                    <button
                        onClick={() => { setShowDownload(!showDownload); setShowFilter(false); }}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 text-sm font-medium transition-colors"
                    >
                        <Download size={16} />
                        Download
                        <ChevronDown size={14} />
                    </button>

                    {showDownload && (
                        <div className="absolute top-full mt-2 right-0 bg-white border border-gray-200 rounded-xl shadow-xl p-3 z-50 w-56">
                            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-2 px-1">
                                Download {filteredUsers.length} {hasActiveFilter ? 'filtered' : ''} clients
                            </p>
                            <button onClick={downloadCSV}
                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 text-sm text-gray-700 transition-colors text-left">
                                <Table size={18} className="text-green-600" />
                                <div>
                                    <p className="font-medium">Excel / CSV</p>
                                    <p className="text-[10px] text-gray-400">.csv spreadsheet file</p>
                                </div>
                            </button>
                            <button onClick={downloadPDF}
                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 text-sm text-gray-700 transition-colors text-left">
                                <FileText size={18} className="text-red-500" />
                                <div>
                                    <p className="font-medium">PDF Report</p>
                                    <p className="text-[10px] text-gray-400">Print-ready document</p>
                                </div>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Active Filter Badge */}
            {hasActiveFilter && (
                <div className="mb-4 flex items-center gap-2">
                    <span className="text-xs text-gray-500">Filtered by:</span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 border border-blue-200 text-blue-700 rounded-full text-xs font-medium">
                        <Calendar size={12} />
                        {filterType === 'date' && `${filterDateFrom || '...'} → ${filterDateTo || '...'}`}
                        {filterType === 'month' && (filterMonth ? new Date(filterMonth + '-01').toLocaleDateString('en-MY', { year: 'numeric', month: 'long' }) : 'Select month')}
                        {filterType === 'year' && (filterYear || 'Select year')}
                        <button onClick={clearFilters} className="ml-1 hover:text-red-500"><X size={12} /></button>
                    </span>
                </div>
            )}

            {/* Error State */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                    <p>{error}</p>
                    <p className="text-sm mt-1">Run the SQL to create the client_profiles table in Supabase.</p>
                </div>
            )}

            {/* Loading State */}
            {loading && !error && (
                <div className="flex items-center justify-center py-16">
                    <Loader2 className="animate-spin text-[var(--accent-primary)]" size={48} />
                </div>
            )}

            {/* Users Table */}
            {!loading && !error && (
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">User</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Company</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Phone</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Registered</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredUsers.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                                            {searchTerm || hasActiveFilter ? 'No users match your filters.' : 'No registered clients yet.'}
                                        </td>
                                    </tr>
                                ) : (
                                    filteredUsers.map((user) => (
                                        <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-[var(--accent-primary)] rounded-full flex items-center justify-center text-white font-semibold">
                                                        {user.full_name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || '?'}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900">{user.full_name || 'No name'}</p>
                                                        <p className="text-sm text-gray-500 flex items-center gap-1">
                                                            <Mail size={12} />
                                                            {user.email}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 text-gray-600">
                                                    <Building2 size={16} />
                                                    {user.company_name || '-'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 text-gray-600">
                                                    <Phone size={16} />
                                                    {user.phone || '-'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 text-gray-600">
                                                    <Calendar size={16} />
                                                    {formatDate(user.created_at)}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Stats Card */}
            {!loading && !error && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">
                        <span className="font-semibold text-[var(--accent-primary)]">{filteredUsers.length}</span>
                        {' '}registered client{filteredUsers.length !== 1 && 's'}
                        {searchTerm && ` matching "${searchTerm}"`}
                        {hasActiveFilter && ` (filtered)`}
                    </p>
                </div>
            )}
        </div>
    );
};

export default UsersManager;
