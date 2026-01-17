import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, Building2, ArrowLeft, Save, MapPin, TrendingUp, ShieldCheck, Loader2, GripVertical, Image as ImageIcon } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import toast from 'react-hot-toast';
import { useContent } from '../hooks/useContent';

const ProjectListingManager = () => {
    const [view, setView] = useState('list');
    const [editingProject, setEditingProject] = useState(null);

    const defaultContent = {
        title: 'Strategic Project Listings',
        subtitle: 'Exclusive access to high-potential industrial and infrastructure developments across the ASEAN region.',
        projects: [
            {
                id: 1,
                title: 'Sustainable Energy Hub Alpha',
                location: 'Kuala Lumpur, Malaysia',
                category: 'Renewable Energy',
                description: 'A cutting-edge renewable energy facility integrating solar-hydrogen production and smart grid management.',
                imageUrl: '',
                valuation: 'RM 1.2 Billion',
                status: 'Expansion Phase'
            }
        ]
    };

    const { content, loading, saving, saveContent } = useContent('project_listing', defaultContent);
    const [formData, setFormData] = useState(defaultContent);

    useEffect(() => {
        if (content && !loading) {
            setFormData(prev => ({ ...prev, ...content }));
        }
    }, [content, loading]);

    const handleEdit = (project) => {
        setEditingProject(project);
        setView('edit');
    };

    const handleCreate = () => {
        setEditingProject({
            id: Date.now(),
            title: '',
            location: '',
            category: 'Infrastructure',
            description: '',
            imageUrl: '',
            valuation: '',
            status: 'Initial Development'
        });
        setView('edit');
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this project?')) {
            const updatedProjects = formData.projects.filter(p => p.id !== id);
            setFormData(prev => ({ ...prev, projects: updatedProjects }));
            toast.success('Project removed from list.');
        }
    };

    const handleSaveProject = (e) => {
        e.preventDefault();
        const existing = formData.projects.find(p => p.id === editingProject.id);
        let updatedProjects;
        if (existing) {
            updatedProjects = formData.projects.map(p => p.id === editingProject.id ? editingProject : p);
        } else {
            updatedProjects = [...formData.projects, editingProject];
        }
        setFormData(prev => ({ ...prev, projects: updatedProjects }));
        setView('list');
    };

    const handleSaveAll = async () => {
        await saveContent(formData);
    };

    const handleDragEnd = (result) => {
        if (!result.destination) return;
        const items = Array.from(formData.projects);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        setFormData(prev => ({ ...prev, projects: items }));
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="animate-spin text-[var(--accent-primary)]" size={32} />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-heading text-[var(--accent-primary)] mb-2">Project Listing Manager</h1>
                    <p className="text-[var(--text-secondary)]">Manage high-potential project listings and details.</p>
                </div>
                {view === 'list' && (
                    <div className="flex gap-3">
                        <button onClick={handleSaveAll} disabled={saving} className="btn-save">
                            {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                            <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                        </button>
                        <button onClick={handleCreate} className="btn-add">
                            <Plus size={18} />
                            <span>Add New Project</span>
                        </button>
                    </div>
                )}
            </div>

            {view === 'list' ? (
                <div className="space-y-6">
                    {/* Page Settings */}
                    <div className="glass-card p-6 border-l-4 border-l-[var(--accent-secondary)]">
                        <h3 className="font-bold text-[var(--accent-primary)] mb-4">Page Header Content</h3>
                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Page Title</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                    className="w-full px-4 py-3 rounded-lg border border-[var(--border-light)] focus:ring-2 focus:ring-[var(--accent-primary)] outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Page Subtitle</label>
                                <textarea
                                    value={formData.subtitle}
                                    onChange={(e) => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
                                    rows={2}
                                    className="w-full px-4 py-3 rounded-lg border border-[var(--border-light)] focus:ring-2 focus:ring-[var(--accent-primary)] outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Projects List */}
                    <div className="glass-card p-0 overflow-hidden">
                        <div className="p-4 border-b border-[var(--border-light)] bg-[var(--bg-tertiary)] bg-opacity-30">
                            <h3 className="font-bold text-[var(--accent-primary)]">Project List</h3>
                        </div>

                        <div className="divide-y divide-[var(--border-light)]">
                            <DragDropContext onDragEnd={handleDragEnd}>
                                <Droppable droppableId="projects">
                                    {(provided) => (
                                        <div {...provided.droppableProps} ref={provided.innerRef}>
                                            {formData.projects.map((project, index) => (
                                                <Draggable key={project.id} draggableId={project.id.toString()} index={index}>
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
                                                                <div className="w-16 h-12 bg-gray-100 rounded overflow-hidden flex items-center justify-center border border-gray-200">
                                                                    {project.imageUrl ? (
                                                                        <img src={project.imageUrl} alt="" className="w-full h-full object-cover" />
                                                                    ) : (
                                                                        <Building2 size={24} className="text-gray-400" />
                                                                    )}
                                                                </div>
                                                                <div>
                                                                    <div className="flex items-center gap-2">
                                                                        <h3 className="font-bold text-[var(--text-primary)] text-lg">{project.title}</h3>
                                                                        <span className="px-2 py-0.5 bg-blue-50 text-[var(--accent-primary)] text-[10px] font-bold uppercase rounded-full border border-blue-100">{project.category}</span>
                                                                    </div>
                                                                    <div className="flex items-center gap-3 text-sm text-[var(--text-secondary)]">
                                                                        <span className="flex items-center gap-1"><MapPin size={14} /> {project.location}</span>
                                                                        <span className="flex items-center gap-1 text-[var(--accent-secondary)] font-medium font-heading tracking-wide"><TrendingUp size={14} /> {project.valuation}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <button onClick={() => handleEdit(project)} className="p-2 text-[var(--text-secondary)] hover:text-[var(--accent-primary)] hover:bg-blue-50 rounded-lg transition-colors">
                                                                    <Edit2 size={18} />
                                                                </button>
                                                                <button onClick={() => handleDelete(project.id)} className="p-2 text-[var(--text-secondary)] hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                                                    <Trash2 size={18} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                            {formData.projects.length === 0 && (
                                                <div className="p-12 text-center text-[var(--text-muted)]">
                                                    No projects listed. Click "Add New Project" to start.
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </Droppable>
                            </DragDropContext>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="max-w-4xl mx-auto glass-card p-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <button onClick={() => setView('list')} className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--accent-primary)] mb-6 transition-colors">
                        <ArrowLeft size={18} /> <span>Back to List</span>
                    </button>

                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-[var(--accent-primary)]">
                        <Edit2 size={24} className="text-[var(--accent-secondary)]" />
                        {formData.projects.find(p => p.id === editingProject.id) ? 'Edit Project' : 'New Project'}
                    </h2>

                    <form onSubmit={handleSaveProject} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Project Title</label>
                                <input
                                    type="text"
                                    value={editingProject.title}
                                    onChange={e => setEditingProject({ ...editingProject, title: e.target.value })}
                                    className="w-full px-4 py-3 rounded-lg border border-[var(--border-light)] focus:ring-2 focus:ring-[var(--accent-primary)] outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Category</label>
                                <input
                                    type="text"
                                    value={editingProject.category}
                                    onChange={e => setEditingProject({ ...editingProject, category: e.target.value })}
                                    className="w-full px-4 py-3 rounded-lg border border-[var(--border-light)] focus:ring-2 focus:ring-[var(--accent-primary)] outline-none"
                                    placeholder="e.g. Infrastructure, Renewable Energy"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Location</label>
                                <input
                                    type="text"
                                    value={editingProject.location}
                                    onChange={e => setEditingProject({ ...editingProject, location: e.target.value })}
                                    className="w-full px-4 py-3 rounded-lg border border-[var(--border-light)] focus:ring-2 focus:ring-[var(--accent-primary)] outline-none"
                                    placeholder="e.g. Kuala Lumpur, Malaysia"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Status</label>
                                <select
                                    value={editingProject.status}
                                    onChange={e => setEditingProject({ ...editingProject, status: e.target.value })}
                                    className="w-full px-4 py-3 rounded-lg border border-[var(--border-light)] focus:ring-2 focus:ring-[var(--accent-primary)] outline-none"
                                >
                                    <option value="Initial Development">Initial Development</option>
                                    <option value="Strategic Planning">Strategic Planning</option>
                                    <option value="Expansion Phase">Expansion Phase</option>
                                    <option value="Commissioning">Commissioning</option>
                                    <option value="Operational">Operational</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Project Valuation / Funding Goal</label>
                            <input
                                type="text"
                                value={editingProject.valuation}
                                onChange={e => setEditingProject({ ...editingProject, valuation: e.target.value })}
                                className="w-full px-4 py-3 rounded-lg border border-[var(--border-light)] focus:ring-2 focus:ring-[var(--accent-primary)] outline-none font-heading tracking-wide"
                                placeholder="e.g. RM 1.2 Billion"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Description</label>
                            <textarea
                                value={editingProject.description}
                                onChange={e => setEditingProject({ ...editingProject, description: e.target.value })}
                                rows={4}
                                className="w-full px-4 py-3 rounded-lg border border-[var(--border-light)] focus:ring-2 focus:ring-[var(--accent-primary)] outline-none"
                                placeholder="Detailed project overview..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Image URL</label>
                            <div className="flex gap-2">
                                <div className="flex-1 relative">
                                    <ImageIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        value={editingProject.imageUrl}
                                        onChange={e => setEditingProject({ ...editingProject, imageUrl: e.target.value })}
                                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-[var(--border-light)] focus:ring-2 focus:ring-[var(--accent-primary)] outline-none"
                                        placeholder="https://..."
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setView('list')}
                                className="px-6 py-3 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn-add px-8 py-3 shadow-md flex items-center gap-2 transition-colors font-bold"
                            >
                                <Plus size={18} /> Add to List
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default ProjectListingManager;
