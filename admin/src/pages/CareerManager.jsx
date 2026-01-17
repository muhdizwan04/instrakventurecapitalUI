import React, { useState, useMemo, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, Briefcase, ArrowLeft, ArrowRight, Save, MapPin, Clock, Settings, Users, FileText, Download, Mail, Loader2, GripVertical, LayoutTemplate, Lightbulb, Type, Edit, Eye, Smartphone, Monitor } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import toast from 'react-hot-toast';
import { useContent } from '../hooks/useContent';
import StyleControls from '../components/StyleControls';
import PreviewPageHero from '../components/PreviewPageHero';

const CareerManager = () => {
    const [activeTab, setActiveTab] = useState('sections'); // 'sections', 'jobs', 'applications'
    const [view, setView] = useState('list'); // 'list' or 'edit-job'
    const [editingJob, setEditingJob] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [previewMode, setPreviewMode] = useState('desktop');

    // For Sections Management
    const [activeSection, setActiveSection] = useState(null);

    const defaultData = {
        sections: [
            {
                id: 'hero',
                type: 'hero',
                title: 'Join Our Elite Team',
                subtitle: 'Building a legacy of financial excellence and industrial leadership.',
                styles: { textAlign: 'center', textColor: '#FFFFFF', bgColor: '#1A365D', overlayOpacity: 0.5 }
            },
            {
                id: 'intro',
                type: 'intro',
                title: 'Career at Instrak',
                description: 'We look for professionals who embody our values of integrity, transparency, and strategic foresight.\n\nTo those who are interested, kindly drop your resume by direct email.',
                email: 'vacancy@instrakventurecapital.com',
                styles: { textAlign: 'left', textColor: '#1A365D', bgColor: '#FFFFFF' }
            },
            {
                id: 'jobs',
                type: 'jobs',
                title: 'Open Positions',
                styles: { textAlign: 'center', textColor: '#1A365D', bgColor: '#FAFBFC' }
            }
        ],
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

    // State
    const [sections, setSections] = useState(defaultData.sections);
    const [jobs, setJobs] = useState(defaultData.jobs);
    const [applications, setApplications] = useState(defaultData.applications);

    useEffect(() => {
        if (content && !loading) {
            // Migration Logic: If no sections (old data), migrate pageSettings
            if (!content.sections && content.pageSettings) {
                const newSections = [
                    {
                        id: 'hero',
                        type: 'hero',
                        title: content.pageSettings.pageTitle || defaultData.sections[0].title,
                        subtitle: content.pageSettings.pageSubtitle || defaultData.sections[0].subtitle,
                        styles: defaultData.sections[0].styles
                    },
                    {
                        id: 'intro',
                        type: 'intro',
                        title: content.pageSettings.mainHeading || defaultData.sections[1].title,
                        description: content.pageSettings.description || defaultData.sections[1].description,
                        email: content.pageSettings.contactEmail || defaultData.sections[1].email,
                        styles: defaultData.sections[1].styles
                    },
                    { id: 'jobs', type: 'jobs', title: 'Open Positions', styles: defaultData.sections[2].styles }
                ];
                setSections(newSections);
            } else if (content.sections) {
                setSections(content.sections);
            }

            if (content.jobs) setJobs(content.jobs);
            if (content.applications) setApplications(content.applications);
        }
    }, [content, loading]);

    // --- SAVE HANDLERS ---
    const handleSaveGlobal = async () => {
        await saveContent({ sections, jobs, applications });
        toast.success('All changes saved!');
    };

    // --- SECTIONS MANAGERS ---
    const handleDragEnd = (result) => {
        if (!result.destination) return;
        const items = Array.from(sections);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        setSections(items);
    };

    const updateSection = (id, updates) => {
        setSections(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
    };

    const addCustomSection = () => {
        setSections(prev => [...prev, {
            id: `custom-${Date.now()}`,
            type: 'custom',
            title: 'New Section',
            content: '',
            styles: { textAlign: 'left', textColor: '#1A365D', bgColor: '#FFFFFF' }
        }]);
    };

    const deleteSection = (id) => {
        if (['hero', 'intro', 'jobs'].includes(id)) {
            toast.error("Cannot delete core sections.");
            return;
        }
        if (window.confirm("Delete this section?")) {
            setSections(prev => prev.filter(s => s.id !== id));
            if (activeSection === id) setActiveSection(null);
        }
    };

    // --- JOB MANAGERS ---
    const filteredJobs = useMemo(() => {
        return jobs.filter(job =>
            job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            job.location.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [jobs, searchQuery]);

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
            // Auto-save when job is modified
            await saveContent({ sections, jobs: updatedJobs, applications });
            setView('list');
        }
    };

    const handleDeleteJob = (id) => {
        if (window.confirm('Delete this job posting?')) {
            const updated = jobs.filter(j => j.id !== id);
            setJobs(updated);
            saveContent({ sections, jobs: updated, applications }); // Auto-sync
            toast.success('Job deleted.');
        }
    };

    const handleDragJobEnd = (result) => {
        if (!result.destination) return;
        const items = Array.from(jobs);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        setJobs(items);
        saveContent({ sections, jobs: items, applications }); // Auto-sync
    };

    // --- APPLICATION MANAGERS ---
    const filteredApplications = useMemo(() => {
        return applications.filter(app =>
            app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            app.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            app.job.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [applications, searchQuery]);

    // --- EDITORS ---
    const renderSectionEditor = (section) => {
        if (!section) return <div className="text-center text-gray-400 mt-10">Select a section to edit</div>;

        return (
            <div className="space-y-4 animate-in fade-in">
                <StyleControls section={section} onUpdate={(updates) => updateSection(section.id, updates)} />

                <div>
                    <label className="label">Section Title</label>
                    <input
                        value={section.title || ''}
                        onChange={(e) => updateSection(section.id, { title: e.target.value })}
                        className="input-field"
                    />
                </div>

                {section.type === 'hero' && (
                    <div>
                        <label className="label">Subtitle</label>
                        <input
                            value={section.subtitle || ''}
                            onChange={(e) => updateSection(section.id, { subtitle: e.target.value })}
                            className="input-field"
                        />
                    </div>
                )}

                {section.type === 'intro' && (
                    <>
                        <div>
                            <label className="label">Description</label>
                            <textarea
                                rows={5}
                                value={section.description || ''}
                                onChange={(e) => updateSection(section.id, { description: e.target.value })}
                                className="input-field"
                            />
                        </div>
                        <div>
                            <label className="label">Contact Email</label>
                            <input
                                value={section.email || ''}
                                onChange={(e) => updateSection(section.id, { email: e.target.value })}
                                className="input-field"
                            />
                        </div>
                    </>
                )}

                {section.type === 'custom' && (
                    <div>
                        <label className="label">Content (Markdown supported)</label>
                        <textarea
                            rows={8}
                            value={section.content || ''}
                            onChange={(e) => updateSection(section.id, { content: e.target.value })}
                            className="input-field font-mono text-sm"
                        />
                    </div>
                )}

                {section.type === 'jobs' && (
                    <div className="p-4 bg-blue-50 text-blue-800 rounded-lg text-sm">
                        Content for this section is managed in the <strong>Job Postings</strong> tab.
                    </div>
                )}
            </div>
        );
    };

    // --- MAIN RENDER ---

    // Job Editor View
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
                            <input type="text" required value={editingJob.title} onChange={e => setEditingJob({ ...editingJob, title: e.target.value })} className="input-field" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Employment Type</label>
                            <select value={editingJob.type} onChange={e => setEditingJob({ ...editingJob, type: e.target.value })} className="input-field bg-white">
                                <option>Full-time</option>
                                <option>Part-time</option>
                                <option>Contract</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Location</label>
                        <input type="text" value={editingJob.location} onChange={e => setEditingJob({ ...editingJob, location: e.target.value })} className="input-field" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Description</label>
                        <textarea rows={5} value={editingJob.summary} onChange={e => setEditingJob({ ...editingJob, summary: e.target.value })} className="input-field" />
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                        <button type="submit" className="btn-primary flex items-center gap-2"><Save size={18} /> Save Posting</button>
                    </div>
                </form>
            </div>
        );
    }

    return (
        <div className="space-y-6 h-[calc(100vh-100px)] flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-heading text-[var(--accent-primary)] mb-2">Careers Manager</h1>
                    <p className="text-[var(--text-secondary)]">Manage page layout, job openings, and applications.</p>
                </div>
                <div className="flex gap-3">
                    {activeTab === 'sections' && (
                        <button onClick={addCustomSection} className="btn-add">
                            <Plus size={18} />
                            <span>Add Section</span>
                        </button>
                    )}
                    <button onClick={handleSaveGlobal} disabled={saving} className="btn-save">
                        {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                        <span>{saving ? 'Saving...' : 'Save All Changes'}</span>
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar pb-2">
                {[
                    { id: 'sections', label: 'Page Layout', icon: LayoutTemplate },
                    { id: 'jobs', label: 'Job Postings', icon: Briefcase },
                    { id: 'applications', label: 'Applications', icon: Users },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => { setActiveTab(tab.id); setSearchQuery(''); }}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-all whitespace-nowrap ${activeTab === tab.id
                            ? 'bg-[var(--accent-primary)] text-white shadow-md'
                            : 'bg-white border border-gray-200 text-[var(--text-secondary)] hover:bg-gray-50'
                            }`}
                    >
                        <tab.icon size={16} />
                        <span>{tab.label}</span>
                        {tab.id === 'applications' && applications.filter(a => a.status === 'New').length > 0 && (
                            <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full ml-1">
                                {applications.filter(a => a.status === 'New').length}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* CONTENT AREA */}
            <div className="flex-1 min-h-0 bg-transparent flex flex-col">

                {/* 1. SECTIONS TAB (Split View) */}
                {activeTab === 'sections' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1 min-h-0">
                        {/* LEFT COLUMN: List & Editor */}
                        <div className="min-w-0 flex flex-col gap-6 h-full">
                            {/* Horizontal Draggable List */}
                            <div className="glass-card p-4 shrink-0 bg-white shadow-sm border border-gray-100">
                                <DragDropContext onDragEnd={handleDragEnd}>
                                    <Droppable droppableId="career-sections" direction="horizontal">
                                        {(provided) => (
                                            <div {...provided.droppableProps} ref={provided.innerRef} className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                                                {sections.map((section, index) => (
                                                    <Draggable key={section.id} draggableId={section.id} index={index}>
                                                        {(provided, snapshot) => (
                                                            <div
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                                onClick={() => setActiveSection(section.id)}
                                                                className={`
                                                                    flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer whitespace-nowrap transition-all select-none text-sm
                                                                    ${activeSection === section.id
                                                                        ? 'bg-[var(--accent-primary)] text-white border-[var(--accent-primary)] shadow-md'
                                                                        : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)]'}
                                                                    ${snapshot.isDragging ? 'shadow-lg ring-2 ring-[var(--accent-primary)] z-50' : ''}
                                                                `}
                                                            >
                                                                <GripVertical size={12} className={activeSection === section.id ? 'text-white/50' : 'text-gray-300'} />
                                                                <span className="font-medium">{section.title}</span>
                                                                {section.type === 'custom' && (
                                                                    <button
                                                                        onClick={(e) => { e.stopPropagation(); deleteSection(section.id); }}
                                                                        className={`ml-1 p-1 rounded-full hover:bg-white/20 ${activeSection === section.id ? 'text-white' : 'text-gray-400 hover:text-red-500'}`}
                                                                    >
                                                                        <Trash2 size={12} />
                                                                    </button>
                                                                )}
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                ))}
                                                {provided.placeholder}
                                            </div>
                                        )}
                                    </Droppable>
                                </DragDropContext>
                            </div>

                            {/* Editor Area */}
                            <div className="glass-card flex-1 flex flex-col min-h-0 bg-white shadow-sm border border-gray-100 overflow-hidden">
                                <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                                    <h2 className="font-heading text-lg text-[var(--accent-primary)] flex items-center gap-2">
                                        <Edit size={16} />
                                        {sections.find(s => s.id === activeSection)?.title || 'Edit Section'}
                                    </h2>
                                </div>
                                <div className="p-6 overflow-y-auto custom-scrollbar flex-1 bg-white">
                                    {renderSectionEditor(sections.find(s => s.id === activeSection))}
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: Live Preview */}
                        <div className="glass-card p-6 bg-[var(--bg-tertiary)] h-fit min-w-0">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--text-muted)] mb-6">Live Preview</h3>

                            <div className="bg-white rounded-xl shadow-lg border border-[var(--border-light)] h-[600px] overflow-y-auto no-scrollbar relative w-full select-none overflow-x-hidden">
                                {sections.map(section => {
                                    const isActive = activeSection === section.id;
                                    const styles = section.styles || {};
                                    const commonStyle = {
                                        backgroundColor: styles.bgColor || 'transparent',
                                        color: styles.textColor || 'inherit',
                                        textAlign: styles.textAlign || 'left',
                                        backgroundImage: styles.backgroundImage ? `url(${styles.backgroundImage})` : undefined,
                                        backgroundSize: styles.backgroundSize || 'cover',
                                        backgroundPosition: 'center',
                                        position: 'relative',
                                        width: '100%',
                                        overflow: 'hidden'
                                    };

                                    const overlay = styles.backgroundImage && (
                                        <div style={{
                                            position: 'absolute', inset: 0, background: 'black',
                                            opacity: styles.overlayOpacity || 0, zIndex: 0, pointerEvents: 'none'
                                        }} />
                                    );

                                    const contentWrapper = (
                                        <div className="relative z-10 w-full">
                                            {section.type === 'hero' && (
                                                <PreviewPageHero
                                                    title={section.title}
                                                    subtitle={section.subtitle}
                                                    style={{ background: 'transparent' }}
                                                />
                                            )}

                                            {section.type === 'intro' && (
                                                <div style={{ position: 'relative', zIndex: 1, padding: '60px 20px', width: '100%', maxWidth: '1000px', margin: '0 auto' }}>
                                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', alignItems: 'center' }}>
                                                        <div style={{ textAlign: styles.textAlign || 'left', minWidth: 0 }}>
                                                            <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: styles.textColor || '#1A365D', lineHeight: '1.2' }}>{section.title}</h2>
                                                            <p style={{ color: styles.textColor ? styles.textColor : '#4A5568', fontSize: '1rem', lineHeight: '1.6', marginBottom: '1.5rem', whiteSpace: 'pre-wrap', opacity: styles.textColor ? 0.9 : 1 }}>
                                                                {section.description}
                                                            </p>
                                                            {section.email && (
                                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: styles.textColor || '#D97706', fontWeight: 'bold', fontSize: '0.9rem' }}>
                                                                    <Mail size={16} />
                                                                    <span>{section.email}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="glass-card" style={{ height: '240px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #F5F7FA 0%, #FFFFFF 100%)', borderRadius: '16px', border: '1px border-[var(--border-light)]', padding: '1.5rem' }}>
                                                            <p style={{ fontStyle: 'italic', color: '#B8860B', textAlign: 'center', fontSize: '1.1rem' }}>"Integrity is the bedrock of our institutional success."</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {section.type === 'jobs' && (
                                                <div style={{ position: 'relative', zIndex: 1, padding: '60px 20px', width: '100%', maxWidth: '1000px', margin: '0 auto' }}>
                                                    <div style={{ marginBottom: '3rem' }}>
                                                        <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem', color: styles.textColor || '#1A365D', textAlign: styles.textAlign || 'center' }}>{section.title}</h2>
                                                        <p style={{ color: styles.textColor ? styles.textColor : '#4A5568', opacity: 0.8, textAlign: styles.textAlign || 'center', fontSize: '0.9rem' }}>Current opportunities at Instrak Venture Capital</p>
                                                    </div>

                                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
                                                        {(jobs.length > 0 ? jobs : [1, 2]).map((job, i) => (
                                                            <div key={i} className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
                                                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                                                                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(26, 54, 93, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1A365D' }}>
                                                                        <Briefcase size={20} />
                                                                    </div>
                                                                    <div style={{ flex: 1, minWidth: 0 }}>
                                                                        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: '#1A365D', fontWeight: 'bold', truncate: true }}>{job.title || 'Job Title'}</h3>
                                                                        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem', flexWrap: 'wrap', fontSize: '0.8rem', color: '#64748B' }}>
                                                                            <span className="flex items-center gap-1"><MapPin size={12} /> {job.location || 'Remote'}</span>
                                                                            <span className="flex items-center gap-1"><Clock size={12} /> {job.type || 'Full-time'}</span>
                                                                        </div>
                                                                        <p style={{ color: '#64748B', fontSize: '0.85rem', lineHeight: '1.5', marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{job.summary || 'Short job description goes here...'}</p>
                                                                        <div style={{ color: '#B8860B', fontWeight: '600', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                                            Read More <ArrowRight size={14} />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {section.type === 'custom' && (
                                                <div style={{ padding: '40px 20px', width: '100%', maxWidth: '800px', margin: '0 auto' }}>
                                                    {section.title && <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: styles.textColor || '#1A365D' }}>{section.title}</h2>}
                                                    <div style={{ lineHeight: '1.6', fontSize: '0.95rem', whiteSpace: 'pre-wrap' }}>
                                                        {section.content || <span className="text-gray-400 italic">No content...</span>}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );

                                    return (
                                        <div
                                            key={section.id}
                                            onClick={() => setActiveSection(section.id)}
                                            className={`
                                                relative cursor-pointer transition-all border-2
                                                ${isActive ? 'border-[var(--accent-primary)] z-10' : 'border-transparent hover:border-gray-100'}
                                            `}
                                            style={commonStyle}
                                        >
                                            {overlay}
                                            {contentWrapper}

                                            {isActive && (
                                                <div className="absolute top-2 right-2 bg-[var(--accent-primary)] text-white text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider font-bold z-50 pointer-events-none shadow-sm">
                                                    Active
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}

                {/* 2. JOBS TAB */}
                {activeTab === 'jobs' && (
                    <div className="glass-card p-0 overflow-hidden h-full flex flex-col">
                        <div className="p-4 border-b border-[var(--border-light)] bg-[var(--bg-tertiary)] bg-opacity-30 flex items-center gap-4 justify-between shrink-0">
                            <div className="relative flex-1 max-w-md">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--text-muted)]" size={18} />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search jobs..."
                                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-[var(--border-light)] focus:ring-1 focus:ring-[var(--accent-primary)] outline-none"
                                />
                            </div>
                            <button
                                onClick={() => { setEditingJob({ id: Date.now(), title: '', location: '', type: 'Full-time', summary: '' }); setView('edit'); }}
                                className="flex items-center gap-2 px-4 py-2 bg-[#1A365D] text-white rounded-lg hover:bg-[#08304e] transition-all shadow-md text-sm font-medium"
                            >
                                <Plus size={16} /> <span>Post Job</span>
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto">
                            <DragDropContext onDragEnd={handleDragJobEnd}>
                                <Droppable droppableId="jobs-list">
                                    {(provided) => (
                                        <div {...provided.droppableProps} ref={provided.innerRef} className="divide-y divide-[var(--border-light)]">
                                            {filteredJobs.map((job, index) => (
                                                <Draggable key={job.id} draggableId={job.id.toString()} index={index} isDragDisabled={searchQuery !== ''}>
                                                    {(provided, snapshot) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            className={`p-6 flex items-center justify-between transition-colors group ${snapshot.isDragging ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                                                        >
                                                            <div className="flex items-center gap-4">
                                                                <div {...provided.dragHandleProps} className="text-gray-300 hover:text-gray-600 cursor-grab p-1">
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
                                                            <div className="flex gap-2">
                                                                <button onClick={() => { setEditingJob(job); setView('edit'); }} className="p-2 text-gray-500 hover:text-blue-600 bg-gray-100 hover:bg-blue-50 rounded"><Edit2 size={16} /></button>
                                                                <button onClick={() => handleDeleteJob(job.id)} className="p-2 text-gray-500 hover:text-red-600 bg-gray-100 hover:bg-red-50 rounded"><Trash2 size={16} /></button>
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
                        </div>
                    </div>
                )}

                {/* 3. APPLICATIONS TAB */}
                {activeTab === 'applications' && (
                    <div className="glass-card p-0 overflow-hidden h-full flex flex-col">
                        <div className="p-4 border-b border-[var(--border-light)] bg-[var(--bg-tertiary)] bg-opacity-30 shrink-0">
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
                        <div className="flex-1 overflow-y-auto divide-y divide-[var(--border-light)]">
                            {filteredApplications.map(app => (
                                <div key={app.id} className="p-6 flex items-center justify-between hover:bg-[var(--bg-secondary)] transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center font-bold">
                                            {app.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-[var(--text-primary)]">{app.name}</h4>
                                            <p className="text-sm text-[var(--text-secondary)]">{app.job}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`px-2 py-1 text-xs font-bold rounded-full ${app.status === 'New' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                                            {app.status}
                                        </span>
                                        <button onClick={() => toast.success(`Downloading ${app.name}'s resume...`)} className="flex items-center gap-1 px-3 py-1.5 border border-[var(--border-light)] rounded hover:bg-[var(--bg-tertiary)] text-sm transition-colors">
                                            <Download size={14} /> Resume
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
            `}</style>
        </div>
    );
};

export default CareerManager;
