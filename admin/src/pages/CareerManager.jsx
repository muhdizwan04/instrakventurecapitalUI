import React, { useState, useMemo, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, Briefcase, ArrowLeft, Save, MapPin, Clock, Settings, Users, FileText, Download, Mail, Loader2, GripVertical } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import toast from 'react-hot-toast';
import { useContent } from '../hooks/useContent';

const CareerManager = () => {
    const [activeTab, setActiveTab] = useState('jobs');
    const [view, setView] = useState('list');
    const [editingJob, setEditingJob] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    const defaultData = {
        pageSettings: {
            pageTitle: 'Join Our Elite Team',
            pageSubtitle: 'Building a legacy of financial excellence and industrial leadership.',
            mainHeading: 'Career at Instrak',
            description: 'We look for professionals who embody our values of integrity, transparency, and strategic foresight.\n\nTo those who are interested, kindly drop your resume by direct email.',
            contactEmail: 'vacancy@instrakventurecapital.com'
        },
        jobs: [
            { id: 1, title: 'Senior Financial Analyst', location: 'Kuala Lumpur', type: 'Full-time', summary: 'Seeking an experienced analyst for our equity team.' },
            { id: 2, title: 'Legal Counsel', location: 'Singapore', type: 'Contract', summary: 'Corporate law specialist needed for contract financing.' },
            { id: 3, title: 'Investment Manager', location: 'Jakarta', type: 'Full-time', summary: 'Leading our expansion into Indonesian markets.' },
        ],
        applications: [
            { id: 1, name: 'Alice Tan', email: 'alice@example.com', job: 'Senior Financial Analyst', date: '2024-03-10', status: 'New' },
            { id: 2, name: 'David Lee', email: 'david.l@gmail.com', job: 'Global Application', date: '2024-03-09', status: 'Reviewed' },
            { id: 3, name: 'Siti Aminah', email: 'siti@yahoo.com', job: 'Legal Counsel', date: '2024-03-08', status: 'Interviewing' },
        ]
    };

    const { content, loading, saving, saveContent } = useContent('career', defaultData);
    const [pageSettings, setPageSettings] = useState(defaultData.pageSettings);
    const [jobs, setJobs] = useState(defaultData.jobs);
    const [applications, setApplications] = useState(defaultData.applications);

    useEffect(() => {
        if (content && !loading) {
            if (content.pageSettings) setPageSettings(content.pageSettings);
            if (content.jobs) setJobs(content.jobs);
            if (content.applications) setApplications(content.applications);
        }
    }, [content, loading]);

    // --- SEARCH ---
    const filteredJobs = useMemo(() => {
        return jobs.filter(job =>
            job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            job.location.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [jobs, searchQuery]);

    const filteredApplications = useMemo(() => {
        return applications.filter(app =>
            app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            app.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            app.job.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [applications, searchQuery]);


    // --- HANDLERS ---
    const handleEditJob = (job) => {
        setEditingJob(job);
        setView('edit');
    };

    const handleCreateJob = () => {
        setEditingJob({ id: Date.now(), title: '', location: '', type: 'Full-time', summary: '' });
        setView('edit');
    };

    const handleDeleteJob = (id) => {
        if (window.confirm('Delete this job posting?')) {
            setJobs(prev => prev.filter(j => j.id !== id));
            toast.success('Job deleted.');
        }
    };

    const handleSaveJob = async (e) => {
        e.preventDefault();
        if (editingJob) {
            let updatedJobs;
            const existing = jobs.find(j => j.id === editingJob.id);
            if (existing) {
                updatedJobs = jobs.map(j => j.id === editingJob.id ? editingJob : j);
            } else {
                updatedJobs = [...jobs, editingJob];
            }
            setJobs(updatedJobs);
            await saveContent({ pageSettings, jobs: updatedJobs, applications });
            setView('list');
        }
    };

    const handleDragEnd = (result) => {
        if (!result.destination) return;
        const items = Array.from(jobs);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        setJobs(items);
        saveContent({ pageSettings, jobs: items, applications });
    };

    const handleSaveSettings = async (e) => {
        e.preventDefault();
        await saveContent({ pageSettings, jobs, applications });
    };

    const handleDownloadResume = (appName) => {
        toast.success(`Downloading resume for ${appName}...`);
    };

    // --- RENDERERS ---

    if (view === 'edit') {
        return (
            <div className="max-w-3xl mx-auto glass-card p-8 animate-in fade-in slide-in-from-bottom-4 duration-300 space-y-6">
                <button onClick={() => setView('list')} className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--accent-primary)] mb-6">
                    <ArrowLeft size={18} /> Back to Jobs
                </button>
                <h2 className="text-2xl font-bold mb-6">Edit Job Posting</h2>
                <form onSubmit={handleSaveJob} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Job Title</label>
                            <input type="text" required value={editingJob.title} onChange={e => setEditingJob({ ...editingJob, title: e.target.value })} className="w-full px-4 py-3 rounded-lg border border-[var(--border-light)] outline-none focus:ring-2 focus:ring-[var(--accent-primary)]" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Employment Type</label>
                            <select value={editingJob.type} onChange={e => setEditingJob({ ...editingJob, type: e.target.value })} className="w-full px-4 py-3 rounded-lg border border-[var(--border-light)] outline-none focus:ring-2 focus:ring-[var(--accent-primary)] bg-white">
                                <option>Full-time</option>
                                <option>Part-time</option>
                                <option>Contract</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Location</label>
                        <input type="text" value={editingJob.location} onChange={e => setEditingJob({ ...editingJob, location: e.target.value })} className="w-full px-4 py-3 rounded-lg border border-[var(--border-light)] outline-none focus:ring-2 focus:ring-[var(--accent-primary)]" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Description</label>
                        <textarea rows={5} value={editingJob.summary} onChange={e => setEditingJob({ ...editingJob, summary: e.target.value })} className="w-full px-4 py-3 rounded-lg border border-[var(--border-light)] outline-none focus:ring-2 focus:ring-[var(--accent-primary)]" />
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                        <button type="submit" className="px-6 py-2 bg-[var(--accent-primary)] text-white rounded-lg hover:bg-[#08304e] shadow-md flex items-center gap-2"><Save size={18} /> Save Posting</button>
                    </div>
                </form>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header & Tabs */}
            <div>
                <h1 className="text-3xl font-heading text-[var(--accent-primary)] mb-2">Careers Manager</h1>
                <p className="text-[var(--text-secondary)] mb-6">Manage page content, job openings, and incoming applications.</p>

                <div className="flex border-b border-[var(--border-light)]">
                    {[
                        { id: 'jobs', label: 'Job Postings', icon: Briefcase },
                        { id: 'applications', label: 'Applications', icon: Users },
                        { id: 'settings', label: 'Page Content', icon: Settings },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => { setActiveTab(tab.id); setSearchQuery(''); }}
                            className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors border-b-2 ${activeTab === tab.id
                                ? 'border-[var(--accent-primary)] text-[var(--accent-primary)]'
                                : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                                }`}
                        >
                            <tab.icon size={18} />
                            {tab.label}
                            {tab.id === 'applications' && (
                                <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{applications.filter(a => a.status === 'New').length}</span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* JOBS TAB */}
            {activeTab === 'jobs' && (
                <div className="glass-card p-0 overflow-hidden animate-in fade-in duration-300">
                    <div className="p-4 border-b border-[var(--border-light)] bg-[var(--bg-tertiary)] bg-opacity-30 flex items-center gap-4 justify-between">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--text-muted)]" size={18} />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search jobs by title or location..."
                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-[var(--border-light)] focus:ring-1 focus:ring-[var(--accent-primary)] outline-none"
                            />
                        </div>
                        <button
                            onClick={handleCreateJob}
                            className="flex items-center gap-2 px-4 py-2 bg-[var(--accent-primary)] text-white rounded-lg hover:bg-[#08304e] transition-colors shadow-md text-sm"
                        >
                            <Plus size={16} />
                            <span>Post Job</span>
                        </button>
                    </div>

                    <div className="divide-y divide-[var(--border-light)]">
                        {filteredJobs.length === 0 ? (
                            <div className="p-8 text-center text-[var(--text-muted)]">No jobs found matching your search.</div>
                        ) : (
                            <DragDropContext onDragEnd={handleDragEnd}>
                                <Droppable droppableId="jobs">
                                    {(provided) => (
                                        <div {...provided.droppableProps} ref={provided.innerRef}>
                                            {filteredJobs.map((job, index) => (
                                                <Draggable key={job.id} draggableId={job.id.toString()} index={index} isDragDisabled={searchQuery !== ''}>
                                                    {(provided, snapshot) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            className={`p-6 flex items-center justify-between transition-colors group ${snapshot.isDragging ? 'bg-blue-50 shadow-lg z-10' : 'hover:bg-[var(--bg-secondary)]'}`}
                                                        >
                                                            <div className="flex items-center gap-4">
                                                                <div {...provided.dragHandleProps} className="text-gray-400 hover:text-gray-600 cursor-grab p-1">
                                                                    <GripVertical size={20} />
                                                                </div>
                                                                <div>
                                                                    <h3 className="font-bold text-[var(--text-primary)] text-lg mb-1">{job.title}</h3>
                                                                    <div className="flex gap-4 text-sm text-[var(--text-muted)]">
                                                                        <span className="flex items-center gap-1"><MapPin size={14} /> {job.location}</span>
                                                                        <span className="flex items-center gap-1"><Clock size={14} /> {job.type}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <button onClick={() => handleEditJob(job)} className="p-2 text-[var(--text-secondary)] hover:text-[var(--accent-primary)] hover:bg-blue-50 rounded-lg">
                                                                    <Edit2 size={18} />
                                                                </button>
                                                                <button onClick={() => handleDeleteJob(job.id)} className="p-2 text-[var(--text-secondary)] hover:text-red-500 hover:bg-red-50 rounded-lg">
                                                                    <Trash2 size={18} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            </DragDropContext>
                        )}
                    </div>
                </div>
            )}

            {/* APPLICATIONS TAB */}
            {activeTab === 'applications' && (
                <div className="glass-card p-0 overflow-hidden animate-in fade-in duration-300">
                    <div className="p-4 border-b border-[var(--border-light)] bg-[var(--bg-tertiary)] bg-opacity-30">
                        <div className="relative max-w-md">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--text-muted)]" size={18} />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search applicants..."
                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-[var(--border-light)] focus:ring-1 focus:ring-[var(--accent-primary)] outline-none"
                            />
                        </div>
                    </div>
                    <div className="divide-y divide-[var(--border-light)]">
                        {filteredApplications.map(app => (
                            <div key={app.id} className="p-6 flex items-center justify-between hover:bg-[var(--bg-secondary)] transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center font-bold">
                                        {app.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-[var(--text-primary)]">{app.name}</h4>
                                        <p className="text-sm text-[var(--text-secondary)]">{app.job}</p>
                                        <p className="text-xs text-[var(--text-muted)]">{app.email} • {app.date}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={`px-2 py-1 text-xs font-bold rounded-full ${app.status === 'New' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                                        {app.status}
                                    </span>
                                    <button onClick={() => handleDownloadResume(app.name)} className="flex items-center gap-1 px-3 py-1.5 border border-[var(--border-light)] rounded hover:bg-[var(--bg-tertiary)] text-sm transition-colors">
                                        <Download size={14} /> Resume
                                    </button>
                                    <button className="p-2 text-[var(--text-muted)] hover:text-[var(--accent-primary)]">
                                        <Mail size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* SETTINGS TAB */}
            {activeTab === 'settings' && (
                <div className="glass-card p-8 animate-in fade-in duration-300">
                    <form onSubmit={handleSaveSettings} className="space-y-6 max-w-4xl">
                        <h3 className="text-xl font-bold mb-4">Edit Static Page Content</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Hero Title</label>
                                <input type="text" value={pageSettings.pageTitle} onChange={e => setPageSettings({ ...pageSettings, pageTitle: e.target.value })} className="w-full px-4 py-3 rounded-lg border border-[var(--border-light)] outline-none focus:ring-2 focus:ring-[var(--accent-primary)]" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Hero Subtitle</label>
                                <input type="text" value={pageSettings.pageSubtitle} onChange={e => setPageSettings({ ...pageSettings, pageSubtitle: e.target.value })} className="w-full px-4 py-3 rounded-lg border border-[var(--border-light)] outline-none focus:ring-2 focus:ring-[var(--accent-primary)]" />
                            </div>
                        </div>

                        <div className="pt-4 border-t border-[var(--border-light)]">
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Main Heading</label>
                                <input type="text" value={pageSettings.mainHeading} onChange={e => setPageSettings({ ...pageSettings, mainHeading: e.target.value })} className="w-full px-4 py-3 rounded-lg border border-[var(--border-light)] outline-none focus:ring-2 focus:ring-[var(--accent-primary)]" />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Detailed Description</label>
                                <textarea rows={6} value={pageSettings.description} onChange={e => setPageSettings({ ...pageSettings, description: e.target.value })} className="w-full px-4 py-3 rounded-lg border border-[var(--border-light)] outline-none focus:ring-2 focus:ring-[var(--accent-primary)]" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Resume Email Address (receiving)</label>
                                <div className="flex gap-2">
                                    <Mail className="text-[var(--text-muted)] mt-3" size={20} />
                                    <input type="email" value={pageSettings.contactEmail} onChange={e => setPageSettings({ ...pageSettings, contactEmail: e.target.value })} className="w-full px-4 py-3 rounded-lg border border-[var(--border-light)] outline-none focus:ring-2 focus:ring-[var(--accent-primary)]" />
                                </div>
                                <p className="text-xs text-[var(--text-muted)] mt-1">Applications sent via the site will be directed to this email.</p>
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <button
                                type="submit"
                                disabled={saving}
                                className="px-6 py-2 bg-[var(--accent-primary)] text-white rounded-lg hover:bg-[#08304e] shadow-md flex items-center gap-2 disabled:opacity-50"
                            >
                                {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                                <span>{saving ? 'Saving...' : 'Save Settings'}</span>
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default CareerManager;
