import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, GripVertical, Loader2 } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import toast from 'react-hot-toast';
import { useContent } from '../hooks/useContent';
import ImageUpload from '../components/ImageUpload';

// Default director images from client assets
const DEFAULT_IMAGES = {
    'dir-1': '/src/assets/directors/Picture3.png',
    'dir-2': '/src/assets/directors/Picture2.png',
    'dir-3': '/src/assets/directors/Picture4.png',
    'dir-4': '/src/assets/directors/Picture5.png',
    'dir-5': '/src/assets/directors/Picture6.png',
    'dir-6': '/src/assets/directors/Picture7.png',
    'dir-7': '/src/assets/directors/Picture8.png',
};

const BoardManager = () => {
    const defaultDirectors = [
        { id: 'dir-1', name: 'KAHAR KAMARUDIN, ANS', role: 'GROUP CHIEF EXECUTIVE OFFICER (GCEO)', image: '', bio: '' },
        { id: 'dir-2', name: 'PROF IR. DR. NORIDAH', role: 'NON-EXECUTIVE DIRECTOR', image: '', bio: '' },
        { id: 'dir-3', name: "RAFI YA'ACOB", role: 'CHIEF OPERATING OFFICER (COO)', image: '', bio: '' },
        { id: 'dir-4', name: 'ZALIZA YAHYA, CPA', role: 'CHIEF FINANCIAL OFFICER (CFO)', image: '', bio: '' },
        { id: 'dir-5', name: 'NORZALIZA ABD GHAFAR', role: 'GENERAL MANAGER', image: '', bio: '' },
        { id: 'dir-6', name: 'NORLI HIDAYATUL AINI', role: 'GENERAL MANAGER', image: '', bio: '' },
        { id: 'dir-7', name: 'DR. SUHAILY SHAHIMI', role: 'INTERNAL AUDITOR', image: '', bio: '' },
    ];

    const { content, loading, saving, saveContent } = useContent('board', { directors: defaultDirectors });
    const [directors, setDirectors] = useState(defaultDirectors);

    useEffect(() => {
        if (content?.directors && !loading) {
            setDirectors(content.directors);
        }
    }, [content, loading]);

    const handleDragEnd = (result) => {
        if (!result.destination) return;

        const items = Array.from(directors);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        setDirectors(items);
        toast.success('Order updated!');
    };

    const handleSave = async (e) => {
        e.preventDefault();
        await saveContent({ directors });
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to remove this director?')) {
            setDirectors(prev => prev.filter(d => d.id !== id));
        }
    };

    const handleAdd = () => {
        const newDirector = {
            id: `dir-${Date.now()}`,
            name: 'New Director',
            role: 'Role Title',
            image: '',
            bio: ''
        };
        setDirectors([...directors, newDirector]);
        toast.success('New director card added');
    };

    const handleUpdate = (id, field, value) => {
        setDirectors(directors.map(d => d.id === id ? { ...d, [field]: value } : d));
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-heading text-[var(--accent-primary)] mb-2">Board of Directors</h1>
                    <p className="text-[var(--text-secondary)]">Manage leadership profiles. Drag and drop to reorder.</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={handleAdd} className="btn-add">
                        <Plus size={18} />
                        <span>Add Director</span>
                    </button>
                    <button onClick={handleSave} disabled={saving} className="btn-save">
                        {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                        <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Editor Column - 2/3 width */}
                <div className="lg:col-span-2">
                    <DragDropContext onDragEnd={handleDragEnd}>
                        <Droppable droppableId="board-list" direction="horizontal">
                            {(provided) => (
                                <div
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                    className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
                                >
                                    {directors.map((director, index) => (
                                        <Draggable key={director.id} draggableId={director.id} index={index}>
                                            {(provided, snapshot) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    className={`glass-card p-4 flex flex-col gap-3 group h-full ${snapshot.isDragging ? 'shadow-2xl ring-2 ring-[var(--accent-primary)] rotate-1 bg-white z-50' : 'hover:shadow-md'
                                                        }`}
                                                >
                                                    {/* Drag Handle */}
                                                    <div
                                                        {...provided.dragHandleProps}
                                                        className="absolute top-2 right-2 z-10 text-gray-400 hover:text-[var(--accent-primary)] cursor-grab active:cursor-grabbing p-1 rounded bg-white/80 hover:bg-white"
                                                    >
                                                        <GripVertical size={18} />
                                                    </div>

                                                    {/* Image Upload */}
                                                    <ImageUpload
                                                        value={director.image}
                                                        onChange={(url) => handleUpdate(director.id, 'image', url)}
                                                        folder="directors"
                                                        aspectRatio="3/4"
                                                    />

                                                    {/* Details */}
                                                    <div className="space-y-2 flex-1">
                                                        <div>
                                                            <label className="text-[10px] font-bold uppercase text-[var(--accent-primary)] mb-1 block">Full Name</label>
                                                            <input
                                                                value={director.name}
                                                                onChange={(e) => handleUpdate(director.id, 'name', e.target.value)}
                                                                className="w-full p-2 border border-[var(--border-light)] rounded focus:border-[var(--accent-primary)] font-heading font-bold outline-none text-sm"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="text-[10px] font-bold uppercase text-[var(--text-muted)] mb-1 block">Position / Role</label>
                                                            <input
                                                                value={director.role}
                                                                onChange={(e) => handleUpdate(director.id, 'role', e.target.value)}
                                                                className="w-full p-2 border border-[var(--border-light)] rounded focus:border-[var(--accent-primary)] text-xs outline-none"
                                                            />
                                                        </div>
                                                        <div className="pt-2 mt-auto">
                                                            <button
                                                                onClick={() => handleDelete(director.id)}
                                                                className="text-red-500 text-xs flex items-center gap-1 hover:underline w-full justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                                            >
                                                                <Trash2 size={12} /> Remove Profile
                                                            </button>
                                                        </div>
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

                {/* Live Preview Column - 1/3 width */}
                <div className="lg:col-span-1">
                    <div className="glass-card p-4 bg-[var(--bg-tertiary)] sticky top-8">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--text-muted)] mb-4">Live Preview</h3>

                        {/* Preview Header */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                            <div className="bg-[#F5F7FA] text-[#1A365D] p-4 text-center border-b-4 border-[#B8860B]">
                                <h4 className="font-heading font-bold text-lg">Board of Directors</h4>
                                <p className="text-xs text-gray-600 mt-1">Guided by seasoned leaders</p>
                            </div>

                            {/* Preview Cards */}
                            <div className="p-4 space-y-3 max-h-[500px] overflow-y-auto bg-white">
                                {directors.slice(0, 4).map((d) => (
                                    <div key={d.id} className="flex items-center gap-3 p-2 bg-[#F5F7FA] rounded-lg border border-gray-100">
                                        <div className="w-12 h-14 bg-gray-200 rounded overflow-hidden flex-shrink-0 border border-[#B8860B]/30">
                                            {d.image || DEFAULT_IMAGES[d.id] ? (
                                                <img src={d.image || DEFAULT_IMAGES[d.id]} alt={d.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-br from-[#1A365D] to-[#2D5A8B] flex items-center justify-center text-white text-xs font-bold">{d.name?.charAt(0)}</div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h5 className="font-bold text-xs text-[#1A365D] truncate">{d.name}</h5>
                                            <p className="text-[10px] text-[#B8860B] truncate">{d.role}</p>
                                        </div>
                                    </div>
                                ))}
                                {directors.length > 4 && (
                                    <p className="text-center text-xs text-gray-400">+{directors.length - 4} more directors</p>
                                )}
                            </div>
                        </div>

                        <p className="text-[10px] text-center text-gray-400 mt-3">
                            Changes sync to client after saving
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BoardManager;
