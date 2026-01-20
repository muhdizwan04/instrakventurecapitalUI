import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Users, Search, Mail, Phone, Building2, Calendar, RefreshCcw, Loader2 } from 'lucide-react';

const UsersManager = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState(null);

    const fetchUsers = async () => {
        setLoading(true);
        setError(null);
        try {
            // Fetch from client_profiles table
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

    const filteredUsers = users.filter(user => {
        const search = searchTerm.toLowerCase();
        return (
            user.email?.toLowerCase().includes(search) ||
            user.full_name?.toLowerCase().includes(search) ||
            user.company_name?.toLowerCase().includes(search)
        );
    });

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('en-MY', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

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

            {/* Search Bar */}
            <div className="mb-6">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search by name, email, or company..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent"
                    />
                </div>
            </div>

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
                                            {searchTerm ? 'No users match your search.' : 'No registered clients yet.'}
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
                    </p>
                </div>
            )}
        </div>
    );
};

export default UsersManager;
