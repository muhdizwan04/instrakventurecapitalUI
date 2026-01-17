import React, { useState, useEffect } from 'react';
import { Save, ShieldCheck, Eye, Scale, Plus, Trash2, Loader2, GripVertical, Target, Users, Handshake, Edit, Building2, Type, LayoutTemplate, Star, Lightbulb, Square } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import toast from 'react-hot-toast';
import { useContent } from '../hooks/useContent';
import IconPicker from '../components/IconPicker';
import PreviewPageHero from '../components/PreviewPageHero';
import ImageUpload from '../components/ImageUpload';
import * as AllIcons from 'lucide-react'; // Rename to avoid confusion

import SharedStyleControls from '../components/StyleControls';
const StyleControls = ({ section, onUpdate }) => {
    const styles = section.styles || {};
    const handleChange = (field, value) => {
        onUpdate({ styles: { ...styles, [field]: value } });
    };

    return (
        <div className="mb-6 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <h4 className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 pb-2 border-b border-gray-100">
                <Edit size={14} /> Section Styling
            </h4>

            <div className="space-y-4">
                {/* Visual Settings */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 block">Text Align</label>
                        <select
                            value={styles.textAlign || 'left'}
                            onChange={(e) => handleChange('textAlign', e.target.value)}
                            className="input-field text-xs py-1.5"
                        >
                            <option value="left">Left</option>
                            <option value="center">Center</option>
                            <option value="justify">Justify</option>
                            <option value="right">Right</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 block">Text Color</label>
                        <div className="flex items-center gap-2 border border-gray-200 rounded px-2 bg-gray-50 h-[34px]">
                            <div className="w-4 h-4 rounded-full border border-gray-300 shadow-sm" style={{ backgroundColor: styles.textColor || '#1A365D' }}></div>
                            <input
                                type="color"
                                value={styles.textColor || '#1A365D'}
                                onChange={(e) => handleChange('textColor', e.target.value)}
                                className="opacity-0 absolute w-8 cursor-pointer"
                            />
                            <span className="text-xs text-gray-500 font-mono flex-1 text-right">{styles.textColor || '#1A365D'}</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 block">Background</label>
                        <div className="flex items-center gap-2 border border-gray-200 rounded px-2 bg-gray-50 h-[34px]">
                            <div className="w-4 h-4 rounded-full border border-gray-300 shadow-sm" style={{ backgroundColor: styles.bgColor || '#FFFFFF' }}></div>
                            <input
                                type="color"
                                value={styles.bgColor || '#FFFFFF'}
                                onChange={(e) => handleChange('bgColor', e.target.value)}
                                className="opacity-0 absolute w-8 cursor-pointer"
                            />
                            <span className="text-xs text-gray-500 font-mono flex-1 text-right">{styles.bgColor || '#FFFFFF'}</span>
                        </div>
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 block">Overlay Opacity</label>
                        <div className="flex items-center gap-2 h-[34px]">
                            <input
                                type="range" min="0" max="1" step="0.1"
                                value={styles.overlayOpacity !== undefined ? styles.overlayOpacity : 0}
                                onChange={(e) => handleChange('overlayOpacity', parseFloat(e.target.value))}
                                className="flex-1 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                            />
                            <span className="text-xs font-mono w-8 text-right">{styles.overlayOpacity !== undefined ? styles.overlayOpacity : 0}</span>
                        </div>
                    </div>
                </div>

                <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 block">Background Image</label>
                    <div className="flex gap-2">
                        <input
                            value={styles.backgroundImage || ''}
                            onChange={(e) => handleChange('backgroundImage', e.target.value)}
                            className="input-field text-xs"
                            placeholder="Image URL (https://...)"
                        />
                        <select
                            value={styles.backgroundSize || 'cover'}
                            onChange={(e) => handleChange('backgroundSize', e.target.value)}
                            className="input-field text-xs w-24 py-1.5"
                        >
                            <option value="cover">Cover</option>
                            <option value="contain">Contain</option>
                            <option value="auto">Auto</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
};




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

const AboutManager = () => {
    // Default Data Structure
    const defaultData = {
        sections: [
            { id: 'hero', type: 'hero', title: 'Mission, Vision & Values', subtitle: 'The foundational pillars of Instrak Venture Capital Berhad.' },
            {
                id: 'mission',
                type: 'mission',
                missionTitle: 'Our Mission',
                missionText: 'To be the catalyst for sustainable growth in the ASEAN region, bridging the gap between visionary entrepreneurs and strategic capital through disciplined governance and ethical excellence.',
                visionTitle: 'Our Vision',
                visionText: 'To set the benchmark for venture capital integrity, becoming the trusted partner of choice for institutional investors and high-growth industrial leaders worldwide.',
                values: [
                    { id: 'val-1', title: 'Governance', text: 'We adhere to the highest standards of corporate governance to ensure long-term stability and stakeholder value.', icon: 'ShieldCheck' },
                    { id: 'val-2', title: 'Transparency', text: 'Open communication and clear, disciplined reporting are at the heart of our institutional operations.', icon: 'Eye' },
                    { id: 'val-3', title: 'Integrity', text: 'Honesty and unwavering moral principles guide our investment decisions and sustainable partnerships.', icon: 'Scale' }
                ]
            },
            { id: 'board', type: 'board', title: 'Board of Directors', subtitle: 'Guided by seasoned leaders with a commitment to integrity.' },
            { id: 'partners', type: 'partners', title: 'Strategic Partners', subtitle: 'Collaborating with world-class institutions.' },
            { id: 'trust', type: 'trust', title: 'Governance & Compliance', subtitle: 'Strict regulatory oversight and compliance.' }
        ]
    };

    const defaultBoardData = {
        directors: [
            { id: 'dir-1', name: 'KAHAR KAMARUDIN, ANS', role: 'GROUP CHIEF EXECUTIVE OFFICER (GCEO)', image: '', bio: '' },
            { id: 'dir-2', name: 'PROF IR. DR. NORIDAH', role: 'NON-EXECUTIVE DIRECTOR', image: '', bio: '' }
        ]
    };

    const defaultPartnersData = {
        partners: [{ id: 'p-1', name: 'Chubb International Insurance', category: 'Insurance Partner', description: 'Global insurance coverage for fund protection and trade credit insurance.', partnership: 'Protection of funds through comprehensive insurance policies', logo: 'https://companieslogo.com/img/orig/CB-90768b55.png?t=1632720960' }],
        banks: [
            { id: 'b-1', name: 'Maybank Berhad', role: 'Origin Bank & Trustees', swift: 'MBBEMYKL (MT103)', branch: 'Mid Valley Branch', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Maybank_Logo.svg/2560px-Maybank_Logo.svg.png' }
        ],
        trustContent: {
            title: 'Governance & Compliance',
            description: 'All fund management and investment activities are conducted under strict regulatory oversight and compliance.',
            regulators: [
                { id: 1, title: 'Securities Commission', subtitle: 'Malaysia (SC)' },
                { id: 2, title: 'Central Bank', subtitle: 'Bank Negara Malaysia' }
            ]
        }
    };

    // --- HOOKS ---
    const { content, loading, saving, saveContent } = useContent('about', defaultData);
    const { content: boardContent, loading: boardLoading, saveContent: saveBoard } = useContent('board', defaultBoardData);
    const { content: partnersContent, loading: partnersLoading, saveContent: savePartners } = useContent('partners', defaultPartnersData);

    // --- STATE ---
    const [sections, setSections] = useState(defaultData.sections);
    const [activeSection, setActiveSection] = useState(null);

    // Board State
    const [directors, setDirectors] = useState(defaultBoardData.directors);

    // Partners State
    const [partners, setPartners] = useState(defaultPartnersData.partners);
    const [banks, setBanks] = useState(defaultPartnersData.banks);
    const [trustContent, setTrustContent] = useState(defaultPartnersData.trustContent);

    // --- EFFECTS ---
    useEffect(() => {
        if (content?.sections && !loading) {
            // Ensure every section has an ID and required fields to prevent breakage
            let sanitizedSections = content.sections.map((s, i) => ({
                ...s,
                id: s.id || `section-${i}-${Date.now()}`,
                type: s.type || 'custom',
                title: s.title || s.missionTitle || 'Untitled Section',
                styles: s.styles || { textAlign: 'left', textColor: '#1A365D', bgColor: '#FFFFFF' }
            }));

            // Ensure mandatory sections (hero, mission, board, partners, trust) exist
            const requiredIds = ['hero', 'mission', 'board', 'partners', 'trust'];
            requiredIds.forEach(reqId => {
                if (!sanitizedSections.find(s => s.id === reqId)) {
                    const defaultSec = defaultData.sections.find(s => s.id === reqId);
                    if (defaultSec) sanitizedSections.push(defaultSec);
                }
            });

            setSections(sanitizedSections);
        }
    }, [content, loading]);

    // Sync Board Data
    useEffect(() => {
        if (boardContent?.directors && !boardLoading) {
            setDirectors(boardContent.directors);
        }
    }, [boardContent, boardLoading]);

    // Sync Partners Data
    useEffect(() => {
        if (partnersContent && !partnersLoading) {
            if (partnersContent.partners) setPartners(partnersContent.partners);
            if (partnersContent.banks) setBanks(partnersContent.banks);
            if (partnersContent.trustContent) setTrustContent(partnersContent.trustContent);
        }
    }, [partnersContent, partnersLoading]);

    // ... (rest of code) ...

    const handleDragEnd = (result) => {
        if (!result.destination) return;
        const { source, destination } = result;

        if (source.droppableId === 'about-tabs') {
            const items = Array.from(sections);
            const [reorderedItem] = items.splice(source.index, 1);
            items.splice(destination.index, 0, reorderedItem);
            setSections(items);
            // Proactively set active section to the reordered item to maintain context
            setActiveSection(reorderedItem.id);
        } else if (source.droppableId === 'board-list') {
            const items = Array.from(directors);
            const [reorderedItem] = items.splice(source.index, 1);
            items.splice(destination.index, 0, reorderedItem);
            setDirectors(items);
        } else if (source.droppableId === 'partners-list') {
            const items = Array.from(partners);
            const [reorderedItem] = items.splice(source.index, 1);
            items.splice(destination.index, 0, reorderedItem);
            setPartners(items);
        } else if (source.droppableId === 'banks-list') {
            const items = Array.from(banks);
            const [reorderedItem] = items.splice(source.index, 1);
            items.splice(destination.index, 0, reorderedItem);
            setBanks(items);
        }
    };

    // --- SUB-EDITORS HANDLERS ---

    // Board Handlers
    const handleAddDirector = () => setDirectors([...directors, { id: `dir-${Date.now()}`, name: 'New Director', role: 'Role', image: '', bio: '' }]);
    const handleUpdateDirector = (id, field, value) => setDirectors(directors.map(d => d.id === id ? { ...d, [field]: value } : d));
    const handleDeleteDirector = (id) => { if (confirm('Remove director?')) setDirectors(directors.filter(d => d.id !== id)); };

    // Partner Handlers
    const handleAddPartner = () => setPartners([...partners, { id: `p-${Date.now()}`, name: 'New Partner', category: 'Category', description: 'Desc', partnership: 'Details', logo: '' }]);
    const handleUpdatePartner = (id, field, value) => setPartners(partners.map(p => p.id === id ? { ...p, [field]: value } : p));
    const handleDeletePartner = (id) => { if (confirm('Remove partner?')) setPartners(partners.filter(p => p.id !== id)); };

    // Bank Handlers
    const handleAddBank = () => setBanks([...banks, { id: `b-${Date.now()}`, name: 'New Bank', role: 'Role', swift: '', branch: '', logo: '' }]);
    const handleUpdateBank = (id, field, value) => setBanks(banks.map(b => b.id === id ? { ...b, [field]: value } : b));
    const handleDeleteBank = (id) => { if (confirm('Remove bank?')) setBanks(banks.filter(b => b.id !== id)); };


    // --- HELPER HANDLERS ---
    const updateSection = (id, updates) => {
        setSections(sections.map(s => s.id === id ? { ...s, ...updates } : s));
    };

    const addCustomSection = () => {
        const newSection = {
            id: `section-${Date.now()}`,
            type: 'custom',
            title: 'New Custom Section',
            content: 'Enter content here...',
            icon: 'Lightbulb'
        };
        setSections([...sections, newSection]);
        setActiveSection(newSection.id);
    };

    const removeSection = (id) => {
        if (confirm('Are you sure you want to remove this section?')) {
            setSections(sections.filter(s => s.id !== id));
            if (activeSection === id) setActiveSection(sections[0]?.id || null);
        }
    };

    const handleSave = async () => {
        try {
            await Promise.all([
                saveContent({ sections }),
                saveBoard({ directors }),
                savePartners({ partners, banks, trustContent })
            ]);
            toast.success('All changes saved successfully!');
        } catch (error) {
            console.error(error);
            toast.error('Failed to save changes.');
        }
    };

    // Trust Handler
    const handleUpdateTrust = (field, value) => setTrustContent(prev => ({ ...prev, [field]: value }));

    // -- Sub-Editors -- //

    const renderHeroEditor = (section) => (
        <div className="space-y-6">
            <SharedStyleControls section={section} onUpdate={(updates) => updateSection(section.id, updates)} />
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                <h3 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
                    <LayoutTemplate size={16} /> Header Section
                </h3>
                <div className="space-y-4">
                    <div>
                        <label className="label">Page Title</label>
                        <input
                            value={section.title || ''}
                            onChange={(e) => updateSection(section.id, { title: e.target.value })}
                            className="input-field font-heading font-bold text-lg text-[var(--accent-primary)]"
                        />
                    </div>
                    <div>
                        <label className="label">Subtitle</label>
                        <textarea
                            rows={2}
                            value={section.subtitle || ''}
                            onChange={(e) => updateSection(section.id, { subtitle: e.target.value })}
                            className="input-field"
                        />
                    </div>
                </div>
            </div>
        </div>
    );

    const renderMissionEditor = (section) => (
        <div className="space-y-8">
            <SharedStyleControls section={section} onUpdate={(updates) => updateSection(section.id, updates)} />
            {/* Mission & Vision Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100">
                    <div className="flex items-center gap-2 mb-3 text-[var(--accent-primary)]">
                        <Target size={18} />
                        <span className="font-bold text-sm uppercase">Mission Statement</span>
                    </div>
                    <div className="space-y-3">
                        <input
                            value={section.missionTitle || ''}
                            onChange={(e) => updateSection(section.id, { missionTitle: e.target.value })}
                            className="input-field font-bold bg-white"
                            placeholder="Title (e.g. Our Mission)"
                        />
                        <textarea
                            rows={4}
                            value={section.missionText || ''}
                            onChange={(e) => updateSection(section.id, { missionText: e.target.value })}
                            className="input-field bg-white"
                            placeholder="Mission description..."
                        />
                    </div>
                </div>

                <div className="p-4 bg-purple-50/50 rounded-xl border border-purple-100">
                    <div className="flex items-center gap-2 mb-3 text-purple-700">
                        <Eye size={18} />
                        <span className="font-bold text-sm uppercase">Vision Statement</span>
                    </div>
                    <div className="space-y-3">
                        <input
                            value={section.visionTitle || ''}
                            onChange={(e) => updateSection(section.id, { visionTitle: e.target.value })}
                            className="input-field font-bold bg-white"
                            placeholder="Title (e.g. Our Vision)"
                        />
                        <textarea
                            rows={4}
                            value={section.visionText || ''}
                            onChange={(e) => updateSection(section.id, { visionText: e.target.value })}
                            className="input-field bg-white"
                            placeholder="Vision description..."
                        />
                    </div>
                </div>
            </div>

            {/* Core Values */}
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-gray-700 flex items-center gap-2">
                        <Star size={16} className="text-yellow-500" /> Core Values
                    </h3>
                    <button
                        onClick={() => {
                            const newVal = { id: `val-${Date.now()}`, title: 'New Value', text: '', icon: 'Star' };
                            updateSection(section.id, { values: [...(section.values || []), newVal] });
                        }}
                        className="btn-secondary text-xs py-1.5 px-3"
                    >
                        + Add Value
                    </button>
                </div>
                <div className="space-y-3">
                    {(section.values || []).map((val, idx) => (
                        <div key={val.id || idx} className="p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow group relative">
                            <button
                                className="absolute top-2 right-2 text-gray-300 hover:text-red-500 p-1 rounded-md hover:bg-red-50 transition-colors"
                                onClick={() => {
                                    if (confirm('Delete value?')) {
                                        const newValues = section.values.filter(v => v.id !== val.id);
                                        updateSection(section.id, { values: newValues });
                                    }
                                }}
                            >
                                <Trash2 size={16} />
                            </button>

                            <div className="flex gap-4 items-start">
                                <div className="shrink-0 pt-1">
                                    <IconPicker value={val.icon} onChange={(icon) => {
                                        const newValues = [...section.values];
                                        newValues[idx] = { ...val, icon };
                                        updateSection(section.id, { values: newValues });
                                    }} />
                                </div>
                                <div className="flex-1 space-y-2">
                                    <input
                                        value={val.title}
                                        onChange={(e) => {
                                            const newValues = [...section.values];
                                            newValues[idx] = { ...val, title: e.target.value };
                                            updateSection(section.id, { values: newValues });
                                        }}
                                        className="input-field font-bold"
                                        placeholder="Value Title"
                                    />
                                    <textarea
                                        value={val.text}
                                        onChange={(e) => {
                                            const newValues = [...section.values];
                                            newValues[idx] = { ...val, text: e.target.value };
                                            updateSection(section.id, { values: newValues });
                                        }}
                                        className="input-field text-xs text-gray-600"
                                        rows={2}
                                        placeholder="Description"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                    {(!section.values || section.values.length === 0) && (
                        <div className="text-center p-6 bg-gray-50 border border-dashed border-gray-200 rounded-lg text-gray-400 text-sm">
                            No values added yet.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    const renderBoardEditor = (section) => (
        <div className="space-y-6">
            <SharedStyleControls section={section} onUpdate={(updates) => updateSection(section.id, updates)} />
            <div className="flex justify-between items-center mb-4 bg-white py-2 border-b border-gray-100">
                <div>
                    <h3 className="font-bold text-[var(--accent-primary)] flex items-center gap-2">
                        <Users size={18} /> Board of Directors
                    </h3>
                    <p className="text-xs text-gray-500">Drag items to reorder</p>
                </div>
                <button onClick={handleAddDirector} className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-2">
                    <Plus size={14} /> Add Director
                </button>
            </div>

            <Droppable droppableId="board-list">
                {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                        {directors.map((director, index) => (
                            <Draggable key={director.id} draggableId={director.id} index={index}>
                                {(provided, snapshot) => (
                                    <div ref={provided.innerRef} {...provided.draggableProps} className={`p-4 bg-white border border-[var(--border-light)] rounded-xl relative group transition-all ${snapshot.isDragging ? 'shadow-2xl ring-2 ring-[var(--accent-primary)] rotate-1 z-50' : 'hover:shadow-md hover:border-blue-200'}`}>
                                        <div className="absolute top-3 right-3 flex gap-1 z-10">
                                            <div {...provided.dragHandleProps} className="text-gray-300 hover:text-[var(--accent-primary)] cursor-grab p-1.5 rounded hover:bg-gray-100"><GripVertical size={16} /></div>
                                            <button onClick={() => handleDeleteDirector(director.id)} className="text-gray-300 hover:text-red-500 p-1.5 rounded hover:bg-red-50"><Trash2 size={16} /></button>
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="w-20 shrink-0">
                                                <ImageUpload value={director.image} onChange={(url) => handleUpdateDirector(director.id, 'image', url)} folder="directors" aspectRatio="3/4" />
                                            </div>
                                            <div className="flex-1 space-y-3 min-w-0 pr-8">
                                                <div>
                                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 block">Name</label>
                                                    <input value={director.name} onChange={(e) => handleUpdateDirector(director.id, 'name', e.target.value)} className="input-field font-bold text-[#1A365D]" placeholder="Director Name" />
                                                </div>
                                                <div>
                                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 block">Role</label>
                                                    <input value={director.role} onChange={(e) => handleUpdateDirector(director.id, 'role', e.target.value)} className="input-field text-xs text-[#B8860B] font-bold" placeholder="Role / Position" />
                                                </div>
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
        </div>
    );

    const renderPartnersEditor = (section) => (
        <div className="space-y-10">
            <SharedStyleControls section={section} onUpdate={(updates) => updateSection(section.id, updates)} />
            {/* Partners List */}
            <div>
                <div className="flex justify-between items-center mb-4 bg-white py-2 border-b border-gray-100">
                    <h3 className="font-bold text-[var(--accent-primary)] flex items-center gap-2">
                        <Handshake size={18} /> Strategic Partners
                    </h3>
                    <button onClick={handleAddPartner} className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-2">
                        <Plus size={14} /> Add Partner
                    </button>
                </div>
                <Droppable droppableId="partners-list">
                    {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                            {partners.map((p, index) => (
                                <Draggable key={p.id} draggableId={p.id} index={index}>
                                    {(provided, snapshot) => (
                                        <div ref={provided.innerRef} {...provided.draggableProps} className={`p-4 bg-white border border-gray-200 rounded-xl group relative ${snapshot.isDragging ? 'shadow-xl ring-2 ring-blue-500 z-50' : 'hover:shadow-md'}`}>
                                            <div className="flex justify-between mb-3">
                                                <div className="flex gap-2">
                                                    <div {...provided.dragHandleProps} className="text-gray-300 hover:text-gray-600 cursor-grab"><GripVertical size={16} /></div>
                                                </div>
                                                <button onClick={() => handleDeletePartner(p.id)} className="text-gray-300 hover:text-red-500"><Trash2 size={16} /></button>
                                            </div>
                                            <div className="flex flex-col gap-3">
                                                <div className="flex gap-3 items-center">
                                                    <div className="w-12 h-12 bg-gray-50 border rounded-lg flex items-center justify-center shrink-0 p-1">
                                                        {p.logo ? <img src={p.logo} className="w-full h-full object-contain" /> : <Building2 size={20} className="text-gray-300" />}
                                                    </div>
                                                    <input value={p.logo} onChange={e => handleUpdatePartner(p.id, 'logo', e.target.value)} className="input-field text-xs font-mono flex-1" placeholder="Logo Image URL" />
                                                </div>
                                                <div className="grid grid-cols-2 gap-3">
                                                    <input value={p.name} onChange={e => handleUpdatePartner(p.id, 'name', e.target.value)} className="input-field font-bold" placeholder="Partner Name" />
                                                    <input value={p.category} onChange={e => handleUpdatePartner(p.id, 'category', e.target.value)} className="input-field text-xs uppercase text-[#B8860B] font-bold" placeholder="Category" />
                                                </div>
                                                <textarea value={p.description} onChange={e => handleUpdatePartner(p.id, 'description', e.target.value)} className="input-field text-xs text-gray-600" rows={2} placeholder="Description" />
                                            </div>
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </div>

            {/* Banks List */}
            <div>
                <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-2">
                    <h3 className="font-bold text-green-700 flex items-center gap-2">
                        <Building2 size={18} /> Banking Partners
                    </h3>
                    <button onClick={handleAddBank} className="text-xs bg-green-50 text-green-600 border border-green-200 px-3 py-1.5 rounded-lg font-bold hover:bg-green-100 flex items-center gap-2">
                        <Plus size={14} /> Add Bank
                    </button>
                </div>
                <Droppable droppableId="banks-list">
                    {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                            {banks.map((b, index) => (
                                <Draggable key={b.id} draggableId={b.id} index={index}>
                                    {(provided, snapshot) => (
                                        <div ref={provided.innerRef} {...provided.draggableProps} className={`p-4 bg-white border border-green-100 rounded-xl group relative ${snapshot.isDragging ? 'shadow-xl ring-2 ring-green-500 z-50' : 'hover:shadow-md'}`}>
                                            <div className="flex justify-between mb-3">
                                                <div {...provided.dragHandleProps} className="text-gray-300 hover:text-gray-600 cursor-grab"><GripVertical size={16} /></div>
                                                <button onClick={() => handleDeleteBank(b.id)} className="text-gray-300 hover:text-red-500"><Trash2 size={16} /></button>
                                            </div>
                                            <div className="space-y-3">
                                                <div className="flex gap-3">
                                                    <div className="w-10 h-10 bg-gray-50 border rounded-lg flex items-center justify-center shrink-0 p-1">
                                                        {b.logo ? <img src={b.logo} className="w-full h-full object-contain" /> : <Building2 size={16} className="text-gray-300" />}
                                                    </div>
                                                    <input value={b.name} onChange={e => handleUpdateBank(b.id, 'name', e.target.value)} className="input-field font-bold flex-1" placeholder="Bank Name" />
                                                </div>
                                                <div className="grid grid-cols-2 gap-3">
                                                    <input value={b.role} onChange={e => handleUpdateBank(b.id, 'role', e.target.value)} className="input-field text-xs uppercase text-gray-500 font-bold" placeholder="Role" />
                                                    <input value={b.logo} onChange={e => handleUpdateBank(b.id, 'logo', e.target.value)} className="input-field text-xs font-mono" placeholder="Logo URL" />
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
            </div>
        </div>
    );

    const renderTrustEditor = (section) => (
        <div className="space-y-6">
            <SharedStyleControls section={section} onUpdate={(updates) => updateSection(section.id, updates)} />
            <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
                <div className="flex items-center gap-2 mb-4 text-[var(--accent-primary)] border-b border-gray-100 pb-2">
                    <ShieldCheck size={20} />
                    <h3 className="font-bold text-base">Governance Content</h3>
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="label">Section Title</label>
                        <input value={trustContent.title} onChange={e => handleUpdateTrust('title', e.target.value)} className="input-field font-bold text-lg" />
                    </div>
                    <div>
                        <label className="label">Description</label>
                        <textarea value={trustContent.description} onChange={e => handleUpdateTrust('description', e.target.value)} className="input-field text-sm" rows={5} />
                    </div>
                </div>
            </div>

            <div className="bg-amber-50 p-4 rounded-lg flex gap-3 text-sm text-amber-800 border border-amber-100">
                <ShieldCheck className="shrink-0 mt-0.5" size={18} />
                <div>
                    <p className="font-bold mb-1">Compliance Regulators</p>
                    <p className="opacity-80">Regulator names and logos are managed globally to ensure compliance across all pages.</p>
                </div>
            </div>
        </div>
    );


    const renderCustomEditor = (section) => (
        <div className="space-y-6">
            <SharedStyleControls section={section} onUpdate={(updates) => updateSection(section.id, updates)} />
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                <h3 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
                    <Edit size={16} /> Custom Section Editor
                </h3>
                <div className="space-y-4">
                    <div>
                        <label className="label">Section Title</label>
                        <input
                            value={section.title || ''}
                            onChange={(e) => updateSection(section.id, { title: e.target.value })}
                            className="input-field font-bold text-lg"
                        />
                    </div>
                    <div>
                        <label className="label">Content</label>
                        <textarea
                            rows={10}
                            value={section.content || ''}
                            onChange={(e) => updateSection(section.id, { content: e.target.value })}
                            className="input-field font-mono text-sm"
                            placeholder="Enter text or HTML..."
                        />
                    </div>
                    <div className="p-3 bg-yellow-50 text-yellow-800 text-xs rounded border border-yellow-100 flex gap-2">
                        <Lightbulb size={16} className="shrink-0" />
                        <p>You can use Markdown or basic HTML tags for rich text formatting in the content area.</p>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderPlaceholderEditor = (section) => (
        <div className="text-center p-12 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
            <LayoutTemplate size={48} className="mx-auto mb-3 opacity-20" />
            <p>Editor for <strong>{section.type}</strong> is not configured.</p>
        </div>
    );

    const getEditor = (section) => {
        switch (section.type) {
            case 'hero': return renderHeroEditor(section);
            case 'mission': return renderMissionEditor(section);
            case 'board': return renderBoardEditor(section);
            case 'partners': return renderPartnersEditor(section);
            case 'trust': return renderTrustEditor(section);
            case 'custom': return renderCustomEditor(section);
            default: return renderPlaceholderEditor(section);
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'hero': return <LayoutTemplate size={18} />;
            case 'mission': return <Target size={18} />;
            case 'board': return <Users size={18} />;
            case 'partners': return <Handshake size={18} />;
            case 'trust': return <ShieldCheck size={18} />;
            case 'custom': return <Lightbulb size={18} />;
            default: return <Square size={18} />;
        }
    };

    // Proactively set active section if none
    useEffect(() => {
        if (!activeSection && sections.length > 0) {
            setActiveSection(sections[0].id);
        }
    }, [sections, activeSection]);

    // Render Tab Button
    const renderTab = (section, provided, snapshot) => {
        const isActive = activeSection === section.id;
        return (
            <div
                ref={provided.innerRef}
                {...provided.draggableProps}
                className={`flex items-center group
                    ${isActive
                        ? 'bg-white border text-[var(--accent-primary)] shadow-sm z-10'
                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200 border border-transparent'}
                    rounded-t-lg transition-all duration-200 mr-1
                    ${snapshot.isDragging ? 'shadow-lg ring-2 ring-[var(--accent-primary)] opacity-90' : ''}
                `}
                style={{
                    ...provided.draggableProps.style,
                    borderBottom: isActive ? '1px solid white' : undefined,
                    marginBottom: isActive ? '-1px' : undefined
                }}
            >
                {/* Drag Handle */}
                <div
                    {...provided.dragHandleProps}
                    className={`pl-2 pr-1 cursor-grab active:cursor-grabbing opacity-30 hover:opacity-100 transition-opacity ${isActive ? 'opacity-50' : ''}`}
                >
                    <GripVertical size={14} />
                </div>

                {/* Main Clickable Area */}
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault(); // Prevent any default drag behavior
                        setActiveSection(section.id);
                    }}
                    className="relative z-20 flex items-center gap-2 px-3 py-3 font-bold text-sm bg-transparent border-none cursor-pointer focus:outline-none"
                >
                    {getIcon(section.type)}
                    <span className="whitespace-nowrap">{section.title || section.missionTitle || 'Untitled'}</span>
                </button>

                {/* Delete Button (Custom Only) */}
                {section.type === 'custom' && (
                    <button
                        onClick={(e) => { e.stopPropagation(); removeSection(section.id); }}
                        className="pr-2 pl-1 text-gray-400 hover:text-red-500 transition-colors"
                        title="Delete Section"
                    >
                        <Trash2 size={13} />
                    </button>
                )}
            </div>
        );
    };

    return (
        <div className="space-y-4 h-[calc(100vh-100px)] flex flex-col">
            <DragDropContext onDragEnd={handleDragEnd}>
                <div className="flex justify-between items-center shrink-0">
                    <div>
                        <h1 className="text-3xl font-heading text-[var(--accent-primary)] mb-1">About Us Manager</h1>
                        <p className="text-[var(--text-secondary)]">Manage content blocks and preview changes in real-time.</p>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={addCustomSection} className="btn-add">
                            <Plus size={18} /> Add Section
                        </button>
                        <button onClick={handleSave} disabled={saving} className="btn-save">
                            {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </div>

                {/* TAB BAR */}
                <div className="shrink-0 border-b border-gray-200">
                    <Droppable droppableId="about-tabs" direction="horizontal">
                        {(provided) => (
                            <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                className="flex gap-1 overflow-x-auto no-scrollbar px-1 pt-2"
                            >
                                {sections.map((section, index) => (
                                    <Draggable key={section.id} draggableId={section.id} index={index}>
                                        {(provided, snapshot) => renderTab(section, provided, snapshot)}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </div>

                {/* SPLIT VIEW CONTENT */}
                <div className="flex gap-6 flex-1 min-h-0">
                    {/* LEFT: EDITOR (50%) */}
                    <div className="flex-1 min-w-0 glass-card p-0 flex flex-col overflow-hidden bg-white shadow-sm">
                        {(() => {
                            const activeSectionData = sections.find(s => s.id === activeSection);
                            if (activeSectionData) {
                                return (
                                    <>
                                        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                                            <div>
                                                <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Editing Section</span>
                                                <h2 className="text-xl font-heading text-[var(--accent-primary)] truncate">
                                                    {activeSectionData.title || activeSectionData.missionTitle || 'Untitled Section'}
                                                </h2>
                                            </div>
                                            <div className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold uppercase rounded-full tracking-wider border border-blue-100">
                                                {activeSectionData.type}
                                            </div>
                                        </div>
                                        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                                            {getEditor(activeSectionData)}
                                        </div>
                                    </>
                                );
                            }
                            return (
                                <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8 text-center">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                        <Edit size={24} />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-600 mb-2">Select a Section</h3>
                                    <p className="text-sm">Click a tab above to start editing.</p>
                                </div>
                            );
                        })()}
                    </div>

                    {/* RIGHT: LIVE PREVIEW (50%) */}
                    <div className="flex-1 min-w-0 glass-card p-0 flex flex-col overflow-hidden bg-white shadow-xl ring-1 ring-gray-200">
                        <div className="p-3 border-b border-gray-100 bg-gray-50 flex justify-between items-center shrink-0">
                            <h3 className="font-bold text-gray-700 flex items-center gap-2 text-sm">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                Live Preview
                            </h3>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] text-gray-400 font-mono bg-white px-2 py-1 rounded border">DESKTOP</span>
                            </div>
                        </div>

                        {/* Preview Scroll Area */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar bg-white relative">
                            <div className="preview-content min-h-full">
                                {sections.map(section => {
                                    const isActive = activeSection === section.id;
                                    // Highlight the active section in the preview
                                    const activeStyle = isActive
                                        ? { boxShadow: '0 0 0 2px var(--accent-primary) inset', position: 'relative', zIndex: 10 }
                                        : { opacity: activeSection ? 0.3 : 1, filter: activeSection ? 'grayscale(1)' : 'none', transition: 'all 0.3s ease' };

                                    const styles = section.styles || {};
                                    const containerStyle = {
                                        ...activeStyle,
                                        backgroundColor: styles.bgColor || 'transparent',
                                        color: styles.textColor || 'inherit',
                                        textAlign: styles.textAlign || 'left',
                                        backgroundImage: styles.backgroundImage ? `url(${styles.backgroundImage})` : 'none',
                                        backgroundSize: styles.backgroundSize || 'cover',
                                        backgroundPosition: 'center',
                                        position: 'relative',
                                        overflow: 'hidden'
                                    };

                                    return (
                                        <div key={section.id}
                                            onClick={() => setActiveSection(section.id)}
                                            className="cursor-pointer transition-all duration-200 hover:opacity-100 hover:filter-none"
                                            style={containerStyle}
                                        >
                                            {/* Overlay for opacity */}
                                            {styles.backgroundImage && (
                                                <div
                                                    style={{
                                                        position: 'absolute', inset: 0, background: 'black',
                                                        opacity: styles.overlayOpacity !== undefined ? styles.overlayOpacity : 0.4,
                                                        zIndex: 0,
                                                        pointerEvents: 'none'
                                                    }}
                                                />
                                            )}

                                            {/* Content Wrapper to ensure text is above overlay */}
                                            <div style={{ position: 'relative', zIndex: 1 }}>
                                                {section.type === 'hero' && (
                                                    <PreviewPageHero
                                                        title={section.title}
                                                        subtitle={section.subtitle}
                                                        style={{ background: 'transparent' }}
                                                    />
                                                )}
                                                {section.type === 'mission' && (
                                                    <div style={{ padding: '80px 20px', backgroundColor: styles.bgColor || 'transparent', backgroundImage: styles.backgroundImage ? `url(${styles.backgroundImage})` : undefined, backgroundSize: styles.backgroundSize || 'cover', backgroundPosition: 'center', position: 'relative' }}>
                                                        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
                                                            {/* Mission Statement Card */}
                                                            <div style={{
                                                                background: 'linear-gradient(135deg, #1A365D 0%, #0F2445 100%)',
                                                                borderRadius: '24px',
                                                                padding: '4rem',
                                                                color: 'white',
                                                                position: 'relative',
                                                                overflow: 'hidden',
                                                                boxShadow: '0 20px 40px rgba(10, 37, 64, 0.15)',
                                                                marginBottom: '4rem'
                                                            }}>
                                                                {/* Decorative Background Element */}
                                                                <div style={{ position: 'absolute', top: '-10%', right: '-5%', opacity: 0.05, transform: 'scale(1.5)' }}>
                                                                    <AllIcons.Globe size={400} />
                                                                </div>

                                                                <div style={{ position: 'relative', zIndex: 10, maxWidth: '800px' }}>
                                                                    <h6 style={{ color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 'bold', marginBottom: '1rem' }}>Our Purpose</h6>
                                                                    <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', lineHeight: '1.2', color: '#FFFFFF' }}>{section.missionTitle || 'Our Mission'}</h2>
                                                                    <p style={{ fontSize: '1.25rem', lineHeight: '1.8', opacity: 0.9, marginBottom: '2rem' }}>
                                                                        {section.missionText}
                                                                    </p>

                                                                    <div style={{ height: '1px', background: 'rgba(255,255,255,0.2)', margin: '2rem 0' }}></div>

                                                                    <h3 style={{ fontSize: '1.5rem', color: '#D4AF37', marginBottom: '1rem' }}>{section.visionTitle || 'Our Vision'}</h3>
                                                                    <p style={{ fontSize: '1.1rem', lineHeight: '1.8', opacity: 0.8 }}>
                                                                        {section.visionText}
                                                                    </p>
                                                                </div>
                                                            </div>

                                                            {/* Core Values Grid */}
                                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                                                                {(section.values || []).map((v, i) => {
                                                                    const IconComponent = AllIcons[v.icon] || AllIcons.ShieldCheck;
                                                                    return (
                                                                        <div key={i} className="glass-card" style={{
                                                                            padding: '2.5rem',
                                                                            background: 'white',
                                                                            borderTop: '4px solid #D4AF37',
                                                                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
                                                                        }}>
                                                                            <div style={{
                                                                                width: '60px', height: '60px',
                                                                                background: 'rgba(212, 175, 55, 0.1)',
                                                                                borderRadius: '12px',
                                                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                                                marginBottom: '1.5rem',
                                                                                color: '#D4AF37'
                                                                            }}>
                                                                                <IconComponent size={30} />
                                                                            </div>
                                                                            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#1A365D', fontWeight: 'bold' }}>{v.title}</h3>
                                                                            <p style={{ color: '#64748B', lineHeight: '1.7' }}>{v.text}</p>
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                                {section.type === 'board' && (
                                                    <div style={{ padding: '100px 0', background: styles.bgColor || '#F8FAFC', position: 'relative' }}>
                                                        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px', position: 'relative', zIndex: 1 }}>
                                                            <div style={{ textAlign: styles.textAlign || 'center', marginBottom: '4rem' }}>
                                                                <h6 style={{ color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 'bold' }}>Leadership</h6>
                                                                <h2 style={{ fontSize: '2.25rem', fontWeight: 'bold', marginTop: '0.5rem', color: styles.textColor || '#1A365D' }}>{section.title || 'Board of Directors'}</h2>
                                                                <p style={{ maxWidth: '600px', margin: '1rem auto 0', color: styles.textColor ? styles.textColor : '#64748B', opacity: styles.textColor ? 0.8 : 1 }}>
                                                                    {section.subtitle || 'Guided by seasoned leaders with a commitment to integrity, compliance, and industrial excellence.'}
                                                                </p>
                                                            </div>

                                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2.5rem' }}>
                                                                {directors.map((d, i) => (
                                                                    <div key={i} className="glass-card" style={{
                                                                        background: 'white',
                                                                        overflow: 'hidden',
                                                                        border: 'none',
                                                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                                                                        borderRadius: '1rem',
                                                                        textAlign: 'left'
                                                                    }}>
                                                                        <div style={{
                                                                            height: '280px',
                                                                            background: 'linear-gradient(to bottom, #F1F5F9 0%, #E2E8F0 100%)',
                                                                            display: 'flex', alignItems: 'flex-end', justifyContent: 'center', position: 'relative'
                                                                        }}>
                                                                            {d.image || DEFAULT_IMAGES[d.id] ? (
                                                                                <img src={d.image || DEFAULT_IMAGES[d.id]} alt={d.name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center' }} />
                                                                            ) : (
                                                                                <div style={{ textAlign: 'center', paddingBottom: '2rem', opacity: 0.4 }}>
                                                                                    <AllIcons.User size={80} color="#1A365D" />
                                                                                </div>
                                                                            )}
                                                                            <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '4px', background: '#D4AF37' }}></div>
                                                                        </div>
                                                                        <div style={{ padding: '2rem' }}>
                                                                            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: '#1A365D', fontWeight: 'bold' }}>{d.name}</h3>
                                                                            <p style={{ color: '#D4AF37', fontWeight: '600', fontSize: '0.75rem', letterSpacing: '0.5px', textTransform: 'uppercase' }}>{d.role}</p>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                                {section.type === 'partners' && (
                                                    <div style={{ backgroundColor: styles.bgColor || 'transparent', position: 'relative' }}>
                                                        {/* Highlights & Tombstone (Mock Visuals for context) */}
                                                        <div style={{ background: '#FFFFFF', borderBottom: '1px solid #E2E8F0', padding: '1rem' }}>
                                                            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', opacity: 0.6, transform: 'scale(0.8)' }}>
                                                                {[
                                                                    { icon: <AllIcons.Shield size={24} />, title: 'USD 1 Billion', desc: 'Committed Capital' },
                                                                    { icon: <AllIcons.Handshake size={24} />, title: 'Fund Protection', desc: 'Chubb International' },
                                                                    { icon: <AllIcons.Building2 size={24} />, title: 'Trustee Managed', desc: 'Maybank Trustees' },
                                                                    { icon: <AllIcons.Globe size={24} />, title: 'Global Reach', desc: 'Dubai / Intl.' },
                                                                ].map((item, i) => (
                                                                    <div key={i} style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem', borderRight: '1px solid #eee' }}>
                                                                        <div style={{ color: '#D4AF37' }}>{item.icon}</div>
                                                                        <div><div style={{ fontWeight: 'bold', color: '#1A365D' }}>{item.title}</div></div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>

                                                        {/* Tombstone Mock */}
                                                        <section style={{ padding: '40px 0', background: '#0A2540', color: 'white', textAlign: 'center', marginBottom: '40px' }}>
                                                            <div style={{ border: '2px solid rgba(212, 175, 55, 0.3)', padding: '2rem', maxWidth: '400px', margin: '0 auto' }}>
                                                                <AllIcons.Award size={32} style={{ color: '#D4AF37', margin: '0 auto 1rem' }} />
                                                                <h2 style={{ fontSize: '1.5rem', color: '#FFFFFF' }}>USD 1 Billion</h2>
                                                                <p style={{ color: '#D4AF37' }}>Investment Commitment Signed</p>
                                                            </div>
                                                        </section>

                                                        {/* Partners Content */}
                                                        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px 80px' }}>
                                                            <div style={{ textAlign: styles.textAlign || 'center', marginBottom: '4rem' }}>
                                                                <h2 style={{ fontSize: '2.25rem', color: styles.textColor || '#1A365D', fontWeight: 'bold' }}>{section.title || 'Strategic Banking & Insurance'}</h2>
                                                                {section.subtitle && <p className="mt-2" style={{ color: styles.textColor ? styles.textColor : '#6b7280', opacity: styles.textColor ? 0.8 : 1 }}>{section.subtitle}</p>}
                                                            </div>

                                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
                                                                {partners.map((partner, i) => (
                                                                    <div key={i} style={{ border: '1px solid #E2E8F0', borderRadius: '16px', padding: '3rem', position: 'relative', background: 'white', textAlign: 'left' }}>
                                                                        <div style={{ position: 'absolute', top: '2rem', right: '2rem' }}><AllIcons.ShieldCheck size={24} color="#D4AF37" /></div>
                                                                        <h3 style={{ fontSize: '1.5rem', color: '#1A365D', fontWeight: 'bold', marginBottom: '0.5rem' }}>{partner.name}</h3>
                                                                        <span style={{ display: 'inline-block', background: '#F0F9FF', color: '#0369A1', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '600', marginBottom: '2rem' }}>
                                                                            {partner.category}
                                                                        </span>
                                                                        <p style={{ color: '#475569', marginBottom: '1.5rem', lineHeight: '1.6' }}>{partner.description}</p>
                                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#0F172A', fontWeight: '500' }}>
                                                                            <AllIcons.CheckCircle2 size={18} color="#16A34A" />
                                                                            <span>{partner.partnership}</span>
                                                                        </div>
                                                                    </div>
                                                                ))}

                                                                {banks.map((bank, i) => (
                                                                    <div key={i} style={{ border: '1px solid #E2E8F0', borderRadius: '16px', padding: '3rem', position: 'relative', background: 'white', textAlign: 'left' }}>
                                                                        <div style={{ position: 'absolute', top: '2rem', right: '2rem' }}><AllIcons.Building2 size={24} color="#D4AF37" /></div>
                                                                        <h3 style={{ fontSize: '1.5rem', color: '#1A365D', fontWeight: 'bold', marginBottom: '0.5rem' }}>{bank.name}</h3>
                                                                        <span style={{ display: 'inline-block', background: '#F0FDF4', color: '#166534', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '600', marginBottom: '2rem' }}>
                                                                            {bank.role}
                                                                        </span>
                                                                        <p style={{ color: '#475569', marginBottom: '1.5rem', lineHeight: '1.6' }}>{bank.description}</p>
                                                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                                                            {bank.branch && <div style={{ fontSize: '0.9rem', color: '#64748B' }}>📍 {bank.branch}</div>}
                                                                            {bank.location && <div style={{ fontSize: '0.9rem', color: '#64748B' }}>📍 {bank.location}</div>}
                                                                            {bank.swift && <div style={{ fontSize: '0.9rem', color: '#64748B' }}>🌐 SWIFT: {bank.swift}</div>}
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                                {section.type === 'trust' && (
                                                    <div style={{ padding: '60px 20px', background: 'transparent', textAlign: 'center' }}>
                                                        <h2 style={{ fontSize: '1.8rem', color: '#1A365D', marginBottom: '20px' }}>{trustContent.title}</h2>
                                                        <p style={{ maxWidth: '600px', margin: '0 auto 30px auto', color: '#666' }}>{trustContent.description}</p>
                                                        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                                                            {trustContent.regulators.map(r => (
                                                                <div key={r.id} style={{ background: '#F5F7FA', padding: '10px 20px', borderRadius: '4px' }}>
                                                                    <div style={{ fontWeight: 'bold', color: '#1A365D', fontSize: '0.8rem' }}>{r.title}</div>
                                                                    <div style={{ fontSize: '0.7rem', color: '#888' }}>{r.subtitle}</div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                                {section.type === 'custom' && (
                                                    <div style={{ padding: '60px 20px', background: 'transparent' }}>
                                                        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
                                                            {section.title && <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', color: '#1A365D' }}>{section.title}</h2>}
                                                            <div style={{ color: '#4A5568', lineHeight: '1.7', whiteSpace: 'pre-wrap', textAlign: 'left' }}>
                                                                {section.content}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
            </DragDropContext>
        </div>
    );
};

export default AboutManager;
