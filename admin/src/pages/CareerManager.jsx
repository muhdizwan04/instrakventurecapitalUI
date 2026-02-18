import React, { useState, useMemo, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, Briefcase, ArrowLeft, ArrowRight, Save, MapPin, Clock, Settings, Users, FileText, Download, Mail, Loader2, GripVertical, LayoutTemplate, Lightbulb, Type, Edit, Eye, Smartphone, Monitor } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import toast from 'react-hot-toast';
import { useContent } from '../hooks/useContent';


const CareerManager = () => {
    const [activeTab, setActiveTab] = useState('sections'); // 'sections', 'jobs', 'applications'
    const [view, setView] = useState('list'); // 'list' or 'edit-job'
    const [editingJob, setEditingJob] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [previewMode, setPreviewMode] = useState('desktop');

    // For Sections Management


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
                rightBoxContent: '"Integrity is the bedrock of our institutional success."',
                styles: { textAlign: 'left', textColor: '#1A365D', bgColor: '#FFFFFF', rightBoxBgColor: '#FFFFFF', rightBoxTextColor: '#fde68a', rightBoxStyle: 'solid' }
            },
            {
                id: 'jobs',
                type: 'jobs',
                title: 'Open Positions',
                styles: {
                    textAlign: 'center',
                    textColor: '#1A365D',
                    bgColor: '#FAFBFC',
                    titleColor: '#1A365D',
                    titleFontSize: 32,
                    cardStyle: 'glass',
                    cardColor: '#FFFFFF',
                    iconColor: '#1A365D',
                    buttonColor: '#1A365D',
                    buttonIconColor: '#B8860B',
                    buttonOutlineColor: '#B8860B',
                    buttonBgColor: 'transparent',
                    defaultApplyLink: '',
                    applyButtonLabel: 'Apply Now',
                    openApplyInNewTab: false
                }
            }
        ],
        jobs: [
            { id: 1, title: 'Senior Financial Analyst', location: 'Kuala Lumpur', type: 'Full-time', summary: 'Seeking an experienced analyst for our equity team.', applyLink: '' },
            { id: 2, title: 'Legal Counsel', location: 'Singapore', type: 'Contract', summary: 'Corporate law specialist needed for corporate financing.', applyLink: '' },
            { id: 3, title: 'Investment Manager', location: 'Jakarta', type: 'Full-time', summary: 'Leading our expansion into Indonesian markets.', applyLink: '' },
        ],
        applications: []
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


    const updateSection = (id, updates) => {
        setSections(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
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

    const deleteApplication = async (appId) => {
        if (!window.confirm('Are you sure you want to delete this application?')) return;
        const updated = applications.filter(app => app.id !== appId);
        setApplications(updated);
        await saveContent({ sections, jobs, applications: updated });
        toast.success('Application deleted');
    };

    // --- EDITORS ---
    const renderSectionEditor = (section) => {
        if (!section) return null;

        return (
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
                <h3 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-3 capitalize flex items-center gap-2">
                    <Edit size={16} className="text-[var(--accent-primary)]" />
                    {section.title || section.id} Content
                </h3>

                <div className="space-y-4">
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
                            <div className="border-t border-gray-200 pt-4 mt-4">
                                <h4 className="text-sm font-bold text-gray-600 mb-3">Right box (quote / custom content)</h4>
                                <div>
                                    <label className="label text-xs">Box content</label>
                                    <textarea
                                        rows={3}
                                        value={section.rightBoxContent || ''}
                                        onChange={(e) => updateSection(section.id, { rightBoxContent: e.target.value })}
                                        className="input-field text-sm"
                                        placeholder='"Integrity is the bedrock of our institutional success."'
                                    />
                                    <p className="text-[10px] text-gray-400 mt-1">Text shown in the white box on the right. Leave empty to hide the box.</p>
                                </div>
                                <div className="mt-3">
                                    <label className="label text-xs">Box style</label>
                                    <div className="flex gap-2">
                                        <button type="button" onClick={() => updateSection(section.id, { styles: { ...(section.styles || {}), rightBoxStyle: 'solid' } })} className={`flex-1 py-2 rounded-lg border text-xs font-medium ${(section.styles || {}).rightBoxStyle !== 'glass' ? 'bg-blue-500 text-white border-blue-500' : 'bg-white text-gray-600 border-gray-200'}`}>Solid</button>
                                        <button type="button" onClick={() => updateSection(section.id, { styles: { ...(section.styles || {}), rightBoxStyle: 'glass' } })} className={`flex-1 py-2 rounded-lg border text-xs font-medium ${(section.styles || {}).rightBoxStyle === 'glass' ? 'bg-blue-500 text-white border-blue-500' : 'bg-white text-gray-600 border-gray-200'}`}>Glass (transparent)</button>
                                    </div>
                                    <p className="text-[10px] text-gray-400 mt-1">Glass = semi-transparent with blur.</p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                                    <div>
                                        <label className="label text-xs">Box background colour</label>
                                        <div className="flex items-center gap-2">
                                            <input type="color" value={(section.styles || {}).rightBoxBgColor || '#FFFFFF'} onChange={(e) => updateSection(section.id, { styles: { ...(section.styles || {}), rightBoxBgColor: e.target.value } })} className="w-8 h-8 rounded border cursor-pointer" />
                                            <input type="text" value={(section.styles || {}).rightBoxBgColor || ''} onChange={(e) => updateSection(section.id, { styles: { ...(section.styles || {}), rightBoxBgColor: e.target.value } })} className="input-field text-xs flex-1 py-1.5 font-mono" placeholder="#FFFFFF" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="label text-xs">Box text colour</label>
                                        <div className="flex items-center gap-2">
                                            <input type="color" value={(section.styles || {}).rightBoxTextColor || '#fde68a'} onChange={(e) => updateSection(section.id, { styles: { ...(section.styles || {}), rightBoxTextColor: e.target.value } })} className="w-8 h-8 rounded border cursor-pointer" />
                                            <input type="text" value={(section.styles || {}).rightBoxTextColor || ''} onChange={(e) => updateSection(section.id, { styles: { ...(section.styles || {}), rightBoxTextColor: e.target.value } })} className="input-field text-xs flex-1 py-1.5 font-mono" placeholder="#fde68a" />
                                        </div>
                                    </div>
                                </div>
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
                        <div className="border-t border-gray-200 pt-4 mt-4">
                            <h4 className="text-sm font-bold text-gray-600 mb-3">Open Position section (title & cards)</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="label text-xs">Title colour</label>
                                    <div className="flex items-center gap-2">
                                        <input type="color" value={(section.styles || {}).titleColor || '#1A365D'} onChange={(e) => updateSection(section.id, { styles: { ...(section.styles || {}), titleColor: e.target.value } })} className="w-8 h-8 rounded border cursor-pointer" />
                                        <input type="text" value={(section.styles || {}).titleColor || ''} onChange={(e) => updateSection(section.id, { styles: { ...(section.styles || {}), titleColor: e.target.value } })} className="input-field text-xs flex-1 py-1.5 font-mono" placeholder="#1A365D" />
                                    </div>
                                </div>
                                <div>
                                    <label className="label text-xs">Title font size (px)</label>
                                    <input type="number" min={18} max={48} value={(section.styles || {}).titleFontSize ?? 32} onChange={(e) => updateSection(section.id, { styles: { ...(section.styles || {}), titleFontSize: e.target.value ? parseInt(e.target.value, 10) : undefined } })} className="input-field text-sm w-full py-1.5" />
                                </div>
                                <div>
                                    <label className="label text-xs">Card / box style</label>
                                    <div className="flex gap-2">
                                        <button type="button" onClick={() => updateSection(section.id, { styles: { ...(section.styles || {}), cardStyle: 'glass' } })} className={`flex-1 py-2 rounded-lg border text-xs font-medium ${(section.styles || {}).cardStyle !== 'solid' ? 'bg-blue-500 text-white border-blue-500' : 'bg-white text-gray-600 border-gray-200'}`}>Glass (transparent)</button>
                                        <button type="button" onClick={() => updateSection(section.id, { styles: { ...(section.styles || {}), cardStyle: 'solid' } })} className={`flex-1 py-2 rounded-lg border text-xs font-medium ${(section.styles || {}).cardStyle === 'solid' ? 'bg-blue-500 text-white border-blue-500' : 'bg-white text-gray-600 border-gray-200'}`}>Solid</button>
                                    </div>
                                    <p className="text-[10px] text-gray-400 mt-1">Glass = semi-transparent when job listings are shown.</p>
                                </div>
                                <div>
                                    <label className="label text-xs">Card colour</label>
                                    <div className="flex items-center gap-2">
                                        <input type="color" value={(section.styles || {}).cardColor || '#FFFFFF'} onChange={(e) => updateSection(section.id, { styles: { ...(section.styles || {}), cardColor: e.target.value } })} className="w-8 h-8 rounded border cursor-pointer" />
                                        <input type="text" value={(section.styles || {}).cardColor || ''} onChange={(e) => updateSection(section.id, { styles: { ...(section.styles || {}), cardColor: e.target.value } })} className="input-field text-xs flex-1 py-1.5 font-mono" placeholder="#FFFFFF" />
                                    </div>
                                </div>
                                <div>
                                    <label className="label text-xs">Big icon colour (Briefcase)</label>
                                    <div className="flex items-center gap-2">
                                        <input type="color" value={(section.styles || {}).iconColor || '#1A365D'} onChange={(e) => updateSection(section.id, { styles: { ...(section.styles || {}), iconColor: e.target.value } })} className="w-8 h-8 rounded border cursor-pointer" />
                                        <input type="text" value={(section.styles || {}).iconColor || ''} onChange={(e) => updateSection(section.id, { styles: { ...(section.styles || {}), iconColor: e.target.value } })} className="input-field text-xs flex-1 py-1.5 font-mono" placeholder="#1A365D" />
                                    </div>
                                    <p className="text-[10px] text-gray-400 mt-1">Card Briefcase icon + location/clock icons + left border.</p>
                                </div>
                                <div>
                                    <label className="label text-xs">Button text colour</label>
                                    <div className="flex items-center gap-2">
                                        <input type="color" value={(section.styles || {}).buttonColor || '#1A365D'} onChange={(e) => updateSection(section.id, { styles: { ...(section.styles || {}), buttonColor: e.target.value } })} className="w-8 h-8 rounded border cursor-pointer" />
                                        <input type="text" value={(section.styles || {}).buttonColor || ''} onChange={(e) => updateSection(section.id, { styles: { ...(section.styles || {}), buttonColor: e.target.value } })} className="input-field text-xs flex-1 py-1.5 font-mono" placeholder="#1A365D" />
                                    </div>
                                    <p className="text-[10px] text-gray-400 mt-1">Apply button label text.</p>
                                </div>
                                <div>
                                    <label className="label text-xs">Small icon colour (arrow)</label>
                                    <div className="flex items-center gap-2">
                                        <input type="color" value={(section.styles || {}).buttonIconColor || '#B8860B'} onChange={(e) => updateSection(section.id, { styles: { ...(section.styles || {}), buttonIconColor: e.target.value } })} className="w-8 h-8 rounded border cursor-pointer" />
                                        <input type="text" value={(section.styles || {}).buttonIconColor || ''} onChange={(e) => updateSection(section.id, { styles: { ...(section.styles || {}), buttonIconColor: e.target.value } })} className="input-field text-xs flex-1 py-1.5 font-mono" placeholder="#B8860B" />
                                    </div>
                                    <p className="text-[10px] text-gray-400 mt-1">Arrow icon next to Apply button.</p>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="label text-xs">Default apply link (URL)</label>
                                    <input type="text" value={(section.styles || {}).defaultApplyLink || ''} onChange={(e) => updateSection(section.id, { styles: { ...(section.styles || {}), defaultApplyLink: e.target.value.trim() } })} className="input-field text-sm w-full py-1.5 font-mono" placeholder="https://form.url or mailto:vacancy@company.com" />
                                    <p className="text-[10px] text-gray-400 mt-1">Used when a job has no per-job apply link. Can be a form URL or mailto: email.</p>
                                </div>
                                <div>
                                    <label className="label text-xs">Apply button label</label>
                                    <input type="text" value={(section.styles || {}).applyButtonLabel || 'Apply Now'} onChange={(e) => updateSection(section.id, { styles: { ...(section.styles || {}), applyButtonLabel: e.target.value || 'Apply Now' } })} className="input-field text-sm w-full py-1.5" placeholder="Apply Now" />
                                </div>
                                <div>
                                    <label className="label text-xs">Button outline colour</label>
                                    <div className="flex items-center gap-2">
                                        <input type="color" value={(section.styles || {}).buttonOutlineColor || '#B8860B'} onChange={(e) => updateSection(section.id, { styles: { ...(section.styles || {}), buttonOutlineColor: e.target.value } })} className="w-8 h-8 rounded border cursor-pointer" />
                                        <input type="text" value={(section.styles || {}).buttonOutlineColor || ''} onChange={(e) => updateSection(section.id, { styles: { ...(section.styles || {}), buttonOutlineColor: e.target.value } })} className="input-field text-xs flex-1 py-1.5 font-mono" placeholder="#B8860B" />
                                    </div>
                                    <p className="text-[10px] text-gray-400 mt-1">Border around Apply button.</p>
                                </div>
                                <div>
                                    <label className="label text-xs">Button background colour</label>
                                    <div className="flex items-center gap-2">
                                        <input type="color" value={((section.styles || {}).buttonBgColor && (section.styles || {}).buttonBgColor !== 'transparent') ? (section.styles || {}).buttonBgColor : '#f0f4f8'} onChange={(e) => updateSection(section.id, { styles: { ...(section.styles || {}), buttonBgColor: e.target.value } })} className="w-8 h-8 rounded border cursor-pointer" />
                                        <input type="text" value={(section.styles || {}).buttonBgColor || ''} onChange={(e) => updateSection(section.id, { styles: { ...(section.styles || {}), buttonBgColor: e.target.value.trim() || 'transparent' } })} className="input-field text-xs flex-1 py-1.5 font-mono" placeholder="transparent or #hex" />
                                    </div>
                                    <p className="text-[10px] text-gray-400 mt-1">Fill behind Apply button. Use transparent for none.</p>
                                </div>
                                <div className="flex items-center gap-2 pt-6">
                                    <input type="checkbox" id="openApplyNewTab" checked={!!(section.styles || {}).openApplyInNewTab} onChange={(e) => updateSection(section.id, { styles: { ...(section.styles || {}), openApplyInNewTab: e.target.checked } })} className="rounded border-gray-300" />
                                    <label htmlFor="openApplyNewTab" className="text-xs font-medium text-gray-600">Open apply link in new tab</label>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="border-t border-gray-200 pt-4 mt-4">
                        <h4 className="text-sm font-bold text-gray-600 mb-3">Section style (font colour, align, background)</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="label text-xs">Font colour</label>
                                <div className="flex items-center gap-2">
                                    <input type="color" value={(section.styles || {}).textColor || '#1A365D'} onChange={(e) => updateSection(section.id, { styles: { ...(section.styles || {}), textColor: e.target.value } })} className="w-8 h-8 rounded border cursor-pointer" />
                                    <input type="text" value={(section.styles || {}).textColor || ''} onChange={(e) => updateSection(section.id, { styles: { ...(section.styles || {}), textColor: e.target.value } })} className="input-field text-xs flex-1 py-1.5 font-mono" placeholder="#1A365D" />
                                </div>
                            </div>
                            <div>
                                <label className="label text-xs">Align</label>
                                <select value={(section.styles || {}).textAlign || 'center'} onChange={(e) => updateSection(section.id, { styles: { ...(section.styles || {}), textAlign: e.target.value } })} className="input-field text-sm w-full py-1.5 bg-white">
                                    <option value="left">Left</option>
                                    <option value="center">Center</option>
                                    <option value="right">Right</option>
                                </select>
                            </div>
                            <div>
                                <label className="label text-xs">Background colour</label>
                                <div className="flex items-center gap-2">
                                    <input type="color" value={(section.styles || {}).bgColor || '#FFFFFF'} onChange={(e) => updateSection(section.id, { styles: { ...(section.styles || {}), bgColor: e.target.value } })} className="w-8 h-8 rounded border cursor-pointer" />
                                    <input type="text" value={(section.styles || {}).bgColor || ''} onChange={(e) => updateSection(section.id, { styles: { ...(section.styles || {}), bgColor: e.target.value } })} className="input-field text-xs flex-1 py-1.5 font-mono" placeholder="#FFFFFF" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
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
                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Apply link (URL)</label>
                        <input type="url" value={editingJob.applyLink || ''} onChange={e => setEditingJob({ ...editingJob, applyLink: e.target.value.trim() })} className="input-field" placeholder="https://... or mailto:email@company.com" />
                        <p className="text-[10px] text-gray-400 mt-1">Link for the &quot;Apply Now&quot; button. Leave empty to use the default from Open Position section.</p>
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

                    <button onClick={handleSaveGlobal} disabled={saving} className="btn-save">
                        {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                        <span>{saving ? 'Saving...' : 'Save All Changes'}</span>
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar pb-2">
                {[
                    { id: 'sections', label: 'Page Content', icon: FileText },
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
                    <div className="flex-1 overflow-y-auto min-h-0 bg-transparent">
                        <div className="w-full space-y-8 pb-10">
                            {sections.map(section => (
                                <div key={section.id} className="animate-in fade-in slide-in-from-bottom-2">
                                    {renderSectionEditor(section)}
                                </div>
                            ))}
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
                                onClick={() => { setEditingJob({ id: Date.now(), title: '', location: '', type: 'Full-time', summary: '', applyLink: '' }); setView('edit'); }}
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
                                        <button 
                                            onClick={() => deleteApplication(app.id)} 
                                            className="flex items-center gap-1 px-3 py-1.5 border border-red-200 text-red-600 rounded hover:bg-red-50 text-sm transition-colors"
                                        >
                                            <Trash2 size={14} /> Delete
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
