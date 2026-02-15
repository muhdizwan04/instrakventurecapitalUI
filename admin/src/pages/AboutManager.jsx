import React, { useState, useEffect } from 'react';
import { Save, ShieldCheck, Eye, Scale, Plus, Trash2, Loader2, GripVertical, Target, Users, Handshake, Edit, Building2, Type, LayoutTemplate, Star, Lightbulb, Square, Award } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import toast from 'react-hot-toast';
import { useContent } from '../hooks/useContent';
import IconPicker from '../components/IconPicker';
import PreviewPageHero from '../components/PreviewPageHero';
import ImageUpload from '../components/ImageUpload';
import * as AllIcons from 'lucide-react'; // Rename to avoid confusion

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

const DESIGN_PRESETS = {
    luxury: {
        name: 'VVIP Luxury',
        styles: { bgColor: '#FFFFFF', textColor: '#1A365D', layoutType: 'cards', textAlign: 'center' }
    },
    institutional: {
        name: 'Institutional Navy',
        styles: { bgColor: '#0A2540', textColor: '#FFFFFF', layoutType: 'grid', textAlign: 'left', overlayOpacity: 0.8 }
    },
    glass: {
        name: 'Modern Glass',
        styles: { bgColor: '#F8FAFC', textColor: '#1A365D', layoutType: 'list', textAlign: 'center' }
    },
    mindmap: {
        name: 'VVIP Mind Map',
        styles: { bgColor: '#FFFFFF', textColor: '#1A365D', layoutType: 'mindmap', textAlign: 'center' }
    },
    boxed: {
        name: 'Tactical Boxed Group',
        styles: { bgColor: '#FFFFFF', textColor: '#1A365D', layoutType: 'boxed-group', textAlign: 'left', groupTitle: 'OPERATIONAL PROTOCOLS' }
    }
};

const SectionStyleEditor = ({ section, onUpdate }) => {
    const styles = section.styles || { textAlign: 'left', textColor: '#1A365D', bgColor: '#FFFFFF' };

    const updateStyle = (field, value) => {
        onUpdate(section.id, { styles: { ...styles, [field]: value } });
    };

    const applyPreset = (presetKey) => {
        const preset = DESIGN_PRESETS[presetKey];
        if (preset) {
            onUpdate(section.id, { styles: { ...styles, ...preset.styles } });
            toast.success(`Applied ${preset.name} style`);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            {/* Design Presets - PRO Feature */}
            <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 mb-6">
                <h3 className="text-xs font-bold text-blue-700 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Star size={14} className="fill-blue-500" /> Design Presets
                </h3>
                <div className="flex flex-wrap gap-2">
                    {Object.entries(DESIGN_PRESETS).map(([key, preset]) => (
                        <button
                            key={key}
                            onClick={() => applyPreset(key)}
                            className="px-4 py-2 bg-white border border-blue-200 rounded-lg text-sm font-bold text-blue-700 hover:bg-blue-600 hover:text-white transition-all shadow-sm hover:shadow-md"
                        >
                            {preset.name}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Background Controls */}
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-4">
                    <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                        <LayoutTemplate size={16} className="text-blue-500" /> Background & Layout
                    </h3>

                    <div>
                        <label className="label">Background Color</label>
                        <div className="flex gap-2">
                            <input
                                type="color"
                                value={styles.bgColor || '#FFFFFF'}
                                onChange={(e) => updateStyle('bgColor', e.target.value)}
                                className="w-10 h-10 rounded border border-gray-200 cursor-pointer"
                            />
                            <input
                                type="text"
                                value={styles.bgColor || '#FFFFFF'}
                                onChange={(e) => updateStyle('bgColor', e.target.value)}
                                className="input-field flex-1 font-mono text-xs"
                                placeholder="#FFFFFF"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="label">Background Image URL</label>
                        <ImageUpload
                            value={styles.backgroundImage || ''}
                            onChange={(url) => updateStyle('backgroundImage', url)}
                            folder="backgrounds"
                        />
                    </div>

                    {styles.backgroundImage && (
                        <div className="space-y-3 pt-2">
                            <div>
                                <label className="label">Overlay Opacity ({Math.round((styles.overlayOpacity || 0.4) * 100)}%)</label>
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.05"
                                    value={styles.overlayOpacity !== undefined ? styles.overlayOpacity : 0.4}
                                    onChange={(e) => updateStyle('overlayOpacity', parseFloat(e.target.value))}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                />
                            </div>
                            <div>
                                <label className="label">Background Size</label>
                                <select
                                    value={styles.backgroundSize || 'cover'}
                                    onChange={(e) => updateStyle('backgroundSize', e.target.value)}
                                    className="input-field"
                                >
                                    <option value="cover">Cover</option>
                                    <option value="contain">Contain</option>
                                    <option value="auto">Auto</option>
                                </select>
                            </div>
                        </div>
                    )}
                </div>

                {/* Typography, Alignment & Layout */}
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-4">
                    <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                        <Type size={16} className="text-purple-500" /> Layout & Typography
                    </h3>

                    <div>
                        <label className="label">Layout Type</label>
                        <select
                            value={styles.layoutType || 'standard'}
                            onChange={(e) => updateStyle('layoutType', e.target.value)}
                            className="input-field"
                        >
                            <option value="standard">Standard (Text)</option>
                            <option value="list">Professional List</option>
                            <option value="grid">Feature Grid</option>
                            <option value="cards">Interactive Cards</option>
                            <option value="mind-map">Conceptual Mind Map (VVIP)</option>
                            <option value="boxed-group">Command Box (Strategic)</option>
                            <option value="accordion">Accordion (Collapse)</option>
                            <option value="image-grid">Premium Image Grid</option>
                            <option value="icon-group">Icon Connectivity Group</option>
                        </select>
                        <p className="text-[10px] text-gray-400 mt-1 italic">
                            {['list', 'grid', 'cards', 'accordion', 'image-grid', 'icon-group'].includes(styles.layoutType)
                                ? "Manage structured items in the Content tab."
                                : "Content renders as standard text/HTML."}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="label">Text Color</label>
                            <div className="flex gap-2">
                                <input
                                    type="color"
                                    value={styles.textColor || '#1A365D'}
                                    onChange={(e) => updateStyle('textColor', e.target.value)}
                                    className="w-10 h-10 rounded border border-gray-200 cursor-pointer"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="label">Text Alignment</label>
                            <div className="flex bg-white p-1 rounded-lg border border-gray-200">
                                {['left', 'center', 'right'].map((align) => (
                                    <button
                                        key={align}
                                        onClick={() => updateStyle('textAlign', align)}
                                        className={`flex-1 py-2 rounded-md text-xs font-bold capitalize transition-all
                                            ${styles.textAlign === align ? 'bg-blue-500 text-white shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                                    >
                                        {align}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
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
                missionText: 'To be the catalyst for sustainable growth in the GLOBAL region, bridging the gap between visionary entrepreneurs and strategic capital through disciplined governance and ethical excellence.',
                visionTitle: 'Our Vision',
                visionText: 'To set the benchmark for venture capital integrity, becoming the trusted partner of choice for institutional investors and high-growth industrial leaders worldwide.',
                values: [
                    { id: 'val-1', title: 'Governance', text: 'We adhere to the highest standards of corporate governance to ensure long-term stability and stakeholder value.', icon: 'ShieldCheck' },
                    { id: 'val-2', title: 'Transparency', text: 'Open communication and clear, disciplined reporting are at the heart of our institutional operations.', icon: 'Eye' },
                    { id: 'val-3', title: 'Integrity', text: 'Honesty and unwavering moral principles guide our investment decisions and sustainable partnerships.', icon: 'Scale' }
                ]
            },
            { id: 'board', type: 'board', title: 'Board of Directors', subtitle: 'Guided by seasoned leaders with a commitment to integrity.' },
            {
                id: 'philosophy',
                type: 'custom',
                title: 'Our Strategic Philosophy',
                subtitle: 'The principles that guide our investment and advisory mandates.',
                items: [
                    { id: 'phil-1', title: 'Institutional Rigour', description: 'Decisions guided by robust governance and analytical frameworks.', icon: 'Shield' },
                    { id: 'phil-2', title: 'Global Insight', description: 'Access to diverse markets, alternative investments, and strategic opportunities.', icon: 'Globe' },
                    { id: 'phil-3', title: 'Tailored Solutions', description: 'Portfolios designed to reflect objectives, risk appetite, and time horizon.', icon: 'Target' },
                    { id: 'phil-4', title: 'Alignment of Interests', description: 'Mandate structures ensure client objectives remain central.', icon: 'Users' }
                ],
                styles: { layoutType: 'icon-group', textAlign: 'center', textColor: '#1A365D', bgColor: '#F8FAFC' }
            },
            {
                id: 'operating-model',
                type: 'custom',
                title: 'Our Operating Model',
                subtitle: 'IVC functions through a mandate-based engagement structure.',
                content: '- Evaluated internally\n- Structurally designed\n- Risk-assessed\n- Legally documented\n- Monitored through institutional reporting protocols\n\nThis approach ensures discipline, confidentiality, and long-term capital alignment.',
                items: [
                    { id: 'op-1', title: 'Evaluated internally' },
                    { id: 'op-2', title: 'Structurally designed' },
                    { id: 'op-3', title: 'Risk-assessed' },
                    { id: 'op-4', title: 'Legally documented' },
                    { id: 'op-5', title: 'Monitored through institutional reporting protocols' }
                ],
                styles: { layoutType: 'list', textAlign: 'left', textColor: '#1A365D', bgColor: '#FFFFFF' }
            },
            {
                id: 'capital-corridor',
                type: 'custom',
                title: 'Our Global Capital Corridor',
                subtitle: 'IVC specializes in cross-border capital structuring across key financial regions:',
                content: '- Asia: Regional growth hub\n- Middle East: Strategic capital hub\n- Europe: Institutional investment hub\n- United States: Global financial hub',
                items: [
                    { id: 'cap-1', title: 'Asia', description: 'Regional growth hub', icon: 'Globe' },
                    { id: 'cap-2', title: 'Middle East', description: 'Strategic capital hub', icon: 'Globe' },
                    { id: 'cap-3', title: 'Europe', description: 'Institutional investment hub', icon: 'Globe' },
                    { id: 'cap-4', title: 'United States', description: 'Global financial hub', icon: 'Globe' }
                ],
                styles: { layoutType: 'grid', textAlign: 'center', textColor: '#1A365D', bgColor: '#F8FAFC' }
            },
            { id: 'milestone', type: 'milestone', title: 'Investment Milestone' },
            { id: 'partners', type: 'partners', title: 'Strategic Partners', subtitle: 'Collaborating with world-class institutions.' },
            {
                id: 'closing',
                type: 'custom',
                title: 'Committed to Strategic Excellence',
                subtitle: 'Instrak Venture Capital Berhad remains dedicated to bridging the gap between visionary potential and strategic capital.',
                content: 'Our commitment to excellence, integrity, and sustainable growth drives every partnership we forge. We invite you to join us in shaping the future of global industry.',
                styles: { layoutType: 'standard', textAlign: 'center', textColor: '#1A365D', bgColor: '#FFFFFF' }
            }
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
            { id: 'b-1', name: 'Maybank Berhad', role: 'Origin Bank & Trustees', swift: 'MBBEMYKL (MT103)', branch: 'Mid Valley Branch', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Maybank_Logo.svg/2560px-Maybank_Logo.svg.png' },
            { id: 'b-2', name: 'Emirates Islamic Bank', role: 'Nominated Trustees Bank', location: 'Dubai, UAE', logo: 'https://upload.wikimedia.org/wikipedia/commons/e/ea/Emirates_Islamic_Logo.png' }
        ],
        milestone: {
            headline: 'USD 1 Billion',
            subtitle: 'Investment Commitment Signed',
            description: 'INSTRAK Venture Capital Berhad has secured strategic investment commitments to support project financing and high-growth equity investments across the ASEAN region.'
        }
    };

    // --- HOOKS ---
    const { content, loading, saving, saveContent } = useContent('about', defaultData);
    const { content: boardContent, loading: boardLoading, saveContent: saveBoard } = useContent('board', defaultBoardData);
    const { content: partnersContent, loading: partnersLoading, saveContent: savePartners } = useContent('partners', defaultPartnersData);

    // --- STATE ---
    const [sections, setSections] = useState(defaultData.sections);
    const [activeSection, setActiveSection] = useState(null);
    const [editorTab, setEditorTab] = useState('content'); // 'content' or 'design'

    // Board State
    const [directors, setDirectors] = useState(defaultBoardData.directors);

    // Partners State
    const [partners, setPartners] = useState(defaultPartnersData.partners);
    const [banks, setBanks] = useState(defaultPartnersData.banks);
    const [milestone, setMilestone] = useState(defaultPartnersData.milestone);

    // --- EFFECTS ---
    useEffect(() => {
        if (content?.sections && !loading) {
            // Ensure every section has an ID and required fields to prevent breakage
            let sanitizedSections = content.sections
                // Filter out old 'trust' sections (replaced by 'milestone')
                .filter(s => s.type !== 'trust' && s.id !== 'trust')
                .map((s, i) => ({
                    ...s,
                    id: s.id || `section-${i}-${Date.now()}`,
                    type: s.type || 'custom',
                    title: s.title || s.missionTitle || 'Untitled Section',
                    styles: s.styles || { textAlign: 'left', textColor: '#1A365D', bgColor: '#FFFFFF' }
                }));

            // Ensure mandatory sections exist
            const requiredIds = ['hero', 'mission', 'philosophy', 'board', 'operating-model', 'capital-corridor', 'milestone', 'partners', 'closing'];
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
            if (partnersContent.milestone) setMilestone(partnersContent.milestone);
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
    const handleAddDirector = () => {
        const newDirector = { id: `dir-${Date.now()}`, name: 'New Director', role: 'Role', image: '', bio: '' };
        setDirectors(prev => [...prev, newDirector]);
        toast.success('New director added');
    };
    const handleUpdateDirector = (id, field, value) => setDirectors(prev => prev.map(d => d.id === id ? { ...d, [field]: value } : d));
    const handleDeleteDirector = (id) => {
        if (window.confirm('Remove director?')) {
            setDirectors(prev => prev.filter(d => d.id !== id));
            toast.success('Director removed');
        }
    };

    // Partner Handlers
    const handleAddPartner = () => setPartners(prev => [...prev, { id: `p-${Date.now()}`, name: 'New Partner', category: 'Category', description: 'Desc', partnership: 'Details', logo: '' }]);
    const handleUpdatePartner = (id, field, value) => setPartners(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
    const handleDeletePartner = (id) => { if (window.confirm('Remove partner?')) setPartners(prev => prev.filter(p => p.id !== id)); };

    // Bank Handlers
    const handleAddBank = () => setBanks(prev => [...prev, { id: `b-${Date.now()}`, name: 'New Bank', role: 'Role', swift: '', branch: '', logo: '' }]);
    const handleUpdateBank = (id, field, value) => setBanks(prev => prev.map(b => b.id === id ? { ...b, [field]: value } : b));
    const handleDeleteBank = (id) => { if (window.confirm('Remove bank?')) setBanks(prev => prev.filter(b => b.id !== id)); };


    // --- HELPER HANDLERS ---
    const updateSection = (id, updates) => {
        setSections(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
    };

    const addCustomSection = () => {
        const newSection = {
            id: `section-${Date.now()}`,
            type: 'custom',
            title: 'New Custom Section',
            content: 'Enter content here...',
            icon: 'Lightbulb'
        };
        setSections(prev => [...prev, newSection]);
        setActiveSection(newSection.id);
    };

    const removeSection = (id) => {
        if (window.confirm('Are you sure you want to remove this section?')) {
            setSections(prev => prev.filter(s => s.id !== id));
            if (activeSection === id) setActiveSection(sections[0]?.id || null);
        }
    };

    const handleSave = async () => {
        try {
            await Promise.all([
                saveContent({ sections }, { silent: true }),
                saveBoard({ directors }, { silent: true }),
                savePartners({ partners, banks, milestone }, { silent: true })
            ]);
            toast.success('All changes saved successfully!');
        } catch (error) {
            console.error(error);
            toast.error('Failed to save changes.');
        }
    };

    // Milestone Handler
    const handleUpdateMilestone = (field, value) => setMilestone(prev => ({ ...prev, [field]: value }));

    // -- Sub-Editors -- //

    const renderHeroEditor = (section) => (
        <div className="space-y-6">
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

    const renderCustomEditor = (section) => (
        <div className="space-y-6">
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                        <Edit size={16} /> Custom Section Editor
                    </h3>
                    {section.styles?.layoutType !== 'standard' && (
                        <button
                            onClick={() => {
                                const newItem = { id: Date.now(), title: 'New Item', description: '', icon: 'CheckCircle', image: '', tags: '' };
                                updateSection(section.id, { items: [...(section.items || []), newItem] });
                            }}
                            className="text-xs flex items-center gap-1 text-[var(--accent-primary)] bg-blue-50 px-3 py-1.5 rounded-md hover:bg-blue-100 transition-all font-semibold"
                        >
                            <Plus size={14} /> Add Structured Item
                        </button>
                    )}
                </div>

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
                        <label className="label">Subtitle (Optional)</label>
                        <input
                            value={section.subtitle || ''}
                            onChange={(e) => updateSection(section.id, { subtitle: e.target.value })}
                            className="input-field"
                            placeholder="Brief description below the title..."
                        />
                    </div>

                    {section.styles?.layoutType === 'boxed-group' && (
                        <div className="animate-in slide-in-from-left duration-300">
                            <label className="label text-blue-600 font-bold uppercase tracking-wider text-[10px]">Box Group Header</label>
                            <input
                                value={section.groupTitle || ''}
                                onChange={(e) => updateSection(section.id, { groupTitle: e.target.value })}
                                className="input-field border-blue-200 bg-blue-50/20 font-bold"
                                placeholder="e.g. STRATEGIC PILLARS"
                            />
                        </div>
                    )}

                    {section.styles?.layoutType === 'standard' || !section.styles?.layoutType ? (
                        <div>
                            <label className="label">Legacy Content (HTML/Text)</label>
                            <textarea
                                rows={10}
                                value={section.content || ''}
                                onChange={(e) => updateSection(section.id, { content: e.target.value })}
                                className="input-field font-mono text-sm"
                                placeholder="Enter text or HTML..."
                            />
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <label className="label">Structured Items</label>
                            <DragDropContext onDragEnd={(result) => {
                                if (!result.destination) return;
                                const items = Array.from(section.items || []);
                                const [reorderedItem] = items.splice(result.source.index, 1);
                                items.splice(result.destination.index, 0, reorderedItem);
                                updateSection(section.id, { items });
                            }}>
                                <Droppable droppableId={`items-${section.id}`}>
                                    {(provided) => (
                                        <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                                            {(section.items || []).map((item, idx) => (
                                                <div key={item.id || idx} className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm relative group">
                                                    <div className="flex gap-4">
                                                        <div className="flex flex-col gap-2 shrink-0">
                                                            <IconPicker
                                                                value={item.icon || 'CheckCircle'}
                                                                onChange={(icon) => {
                                                                    const newItems = [...section.items];
                                                                    newItems[idx] = { ...item, icon };
                                                                    updateSection(section.id, { items: newItems });
                                                                }}
                                                            />
                                                            <div className="w-16 h-16 bg-gray-50 border rounded-lg overflow-hidden">
                                                                <ImageUpload
                                                                    value={item.image}
                                                                    onChange={(url) => {
                                                                        const newItems = [...section.items];
                                                                        newItems[idx] = { ...item, image: url };
                                                                        updateSection(section.id, { items: newItems });
                                                                    }}
                                                                    folder="sections"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="flex-1 space-y-2">
                                                            <div className="flex gap-2">
                                                                <input
                                                                    value={item.title}
                                                                    onChange={(e) => {
                                                                        const newItems = [...section.items];
                                                                        newItems[idx] = { ...item, title: e.target.value };
                                                                        updateSection(section.id, { items: newItems });
                                                                    }}
                                                                    className="input-field font-bold py-1"
                                                                    placeholder="Item Title"
                                                                />
                                                                <button
                                                                    onClick={() => {
                                                                        const newItems = section.items.filter((_, i) => i !== idx);
                                                                        updateSection(section.id, { items: newItems });
                                                                    }}
                                                                    className="text-gray-300 hover:text-red-500"
                                                                >
                                                                    <Trash2 size={16} />
                                                                </button>
                                                            </div>
                                                            <textarea
                                                                value={item.description}
                                                                onChange={(e) => {
                                                                    const newItems = [...section.items];
                                                                    newItems[idx] = { ...item, description: e.target.value };
                                                                    updateSection(section.id, { items: newItems });
                                                                }}
                                                                className="input-field text-xs h-16"
                                                                placeholder="Short description..."
                                                            />
                                                            <input
                                                                value={item.tags || ''}
                                                                onChange={(e) => {
                                                                    const newItems = [...section.items];
                                                                    newItems[idx] = { ...item, tags: e.target.value };
                                                                    updateSection(section.id, { items: newItems });
                                                                }}
                                                                className="input-field text-[10px] py-1 font-mono"
                                                                placeholder="Tags (comma separated for Image Grid)..."
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            </DragDropContext>
                            {(!section.items || section.items.length === 0) && (
                                <div className="text-center p-8 bg-gray-50 border border-dashed border-gray-300 rounded-xl text-gray-400">
                                    No items added. Click "Add Structured Item" to begin.
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    const renderBoardEditor = (section) => (
        <div className="space-y-6">
            <div className="flex items-center px-1">
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Drag items to reorder</p>
            </div>

            <Droppable droppableId="board-list" direction="horizontal">
                {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {directors.map((director, index) => (
                            <Draggable key={director.id} draggableId={director.id} index={index}>
                                {(provided, snapshot) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        className={`p-4 bg-white border border-gray-200 rounded-xl relative group transition-all h-full
                                            ${snapshot.isDragging ? 'shadow-2xl ring-2 ring-[var(--accent-primary)] rotate-1 z-50' : 'hover:shadow-md hover:border-blue-200'}`}
                                    >
                                        <div className="absolute top-2 right-2 flex gap-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <div {...provided.dragHandleProps} className="text-gray-400 hover:text-[var(--accent-primary)] cursor-grab p-1 rounded hover:bg-white shadow-sm bg-white/80"><GripVertical size={14} /></div>
                                            <button
                                                onClick={() => handleDeleteDirector(director.id)}
                                                className="text-gray-400 hover:text-red-500 p-1 rounded hover:bg-red-50 shadow-sm bg-white/80"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>

                                        <div className="flex flex-row gap-4 h-full">
                                            <div className="w-32 shrink-0">
                                                <div className="aspect-[3/4] rounded-lg overflow-hidden shadow-sm border border-gray-100 bg-gray-50 flex items-center justify-center">
                                                    <ImageUpload
                                                        value={director.image}
                                                        onChange={(url) => handleUpdateDirector(director.id, 'image', url)}
                                                        folder="directors"
                                                        aspectRatio="3/4"
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex-1 min-w-0 flex flex-col gap-2">
                                                <div>
                                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 block">Name</label>
                                                    <input
                                                        value={director.name}
                                                        onChange={(e) => handleUpdateDirector(director.id, 'name', e.target.value)}
                                                        className="input-field font-heading font-bold text-[var(--accent-primary)] text-sm py-1"
                                                        placeholder="Name"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 block">Role</label>
                                                    <input
                                                        value={director.role}
                                                        onChange={(e) => handleUpdateDirector(director.id, 'role', e.target.value)}
                                                        className="input-field text-xs text-[#B8860B] font-bold py-1"
                                                        placeholder="Role"
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <textarea
                                                        value={director.bio || ''}
                                                        onChange={(e) => handleUpdateDirector(director.id, 'bio', e.target.value)}
                                                        className="input-field text-xs text-gray-600 h-full min-h-[60px] resize-none py-1"
                                                        placeholder="Bio..."
                                                    />
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
            {/* Partners List */}
            <div>
                <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-2">
                    <h3 className="font-bold text-[var(--accent-primary)] text-sm uppercase tracking-wider">Strategic Partners</h3>
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
                    <h3 className="font-bold text-green-700 text-sm uppercase tracking-wider">Banking Partners</h3>
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

    const renderMilestoneEditor = (section) => (
        <div className="space-y-6">
            {/* Milestone Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Headline</label>
                        <input
                            value={milestone.headline || ''}
                            onChange={e => handleUpdateMilestone('headline', e.target.value)}
                            className="input-field font-heading font-bold text-2xl text-[var(--accent-primary)]"
                            placeholder="e.g., USD 1 Billion"
                        />
                        <p className="text-[10px] text-gray-400 mt-1">The main figure or achievement to highlight.</p>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Subtitle</label>
                        <input
                            value={milestone.subtitle || ''}
                            onChange={e => handleUpdateMilestone('subtitle', e.target.value)}
                            className="input-field text-[#B8860B] font-bold"
                            placeholder="e.g., Investment Commitment Signed"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Description</label>
                        <textarea
                            value={milestone.description || ''}
                            onChange={e => handleUpdateMilestone('description', e.target.value)}
                            className="input-field text-sm text-gray-600"
                            rows={5}
                            placeholder="Describe this achievement..."
                        />
                    </div>
                </div>

                {/* Preview Card */}
                <div className="hidden lg:block">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Preview</label>
                    <div className="p-6 bg-gradient-to-br from-[#0A2540] to-[#1A365D] rounded-xl shadow-lg text-white">
                        <div className="text-center">
                            <p className="text-4xl font-heading font-bold text-white mb-2">
                                {milestone.headline || 'USD 1 Billion'}
                            </p>
                            <p className="text-[#D4AF37] font-bold text-sm uppercase tracking-wider">
                                {milestone.subtitle || 'Investment Commitment Signed'}
                            </p>
                            <p className="text-gray-300 text-xs mt-4 leading-relaxed line-clamp-3">
                                {milestone.description || 'Description will appear here...'}
                            </p>
                        </div>
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
            case 'milestone': return renderMilestoneEditor(section);
            case 'partners': return renderPartnersEditor(section);
            case 'custom': return renderCustomEditor(section);
            default: return renderPlaceholderEditor(section);
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'hero': return <LayoutTemplate size={18} />;
            case 'mission': return <Target size={18} />;
            case 'board': return <Users size={18} />;
            case 'milestone': return <Award size={18} />;
            case 'partners': return <Handshake size={18} />;
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
                {/* COMPACT HEADER & TABS */}
                <div className="shrink-0 bg-white border-b border-gray-200 sticky top-0 z-20">
                    <div className="flex items-center justify-between px-1 py-2 gap-4">
                        {/* Tabs Container */}
                        <div className="flex-1 min-w-0 overflow-x-auto no-scrollbar">
                            <Droppable droppableId="about-tabs" direction="horizontal">
                                {(provided) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                        className="flex gap-1"
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
                    </div>
                </div>

                {/* EDITOR CONTENT */}
                <div className="flex-1 min-h-0 bg-gray-50/50">
                    <div className="h-full flex flex-col w-full">
                        {(() => {
                            const activeSectionData = sections.find(s => s.id === activeSection);
                            if (activeSectionData) {
                                return (
                                    <div className="flex-1 overflow-y-auto custom-scrollbar relative">
                                        {/* CONSOLIDATED STICKY HEADER */}
                                        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-100 px-6 py-4 flex items-center justify-between shadow-sm">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-gray-50 rounded-lg text-[var(--accent-primary)]">
                                                    {getIcon(activeSectionData.type)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <input
                                                        value={activeSectionData.title || activeSectionData.missionTitle || ''}
                                                        onChange={(e) => updateSection(activeSectionData.id, { title: e.target.value })}
                                                        className="text-lg font-heading text-gray-800 font-bold leading-tight bg-transparent border-0 focus:ring-0 focus:outline-none w-full hover:bg-gray-50 focus:bg-gray-50 px-2 py-1 rounded-lg transition-colors -ml-2"
                                                        placeholder="Section Title"
                                                    />
                                                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 pl-2">
                                                        {activeSectionData.type}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                {/* SECTION SPECIFIC ADD ACTIONS */}
                                                {activeSectionData.type === 'board' && (
                                                    <button onClick={handleAddDirector} className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-xs font-bold border border-blue-100">
                                                        <Plus size={14} /> Add Director
                                                    </button>
                                                )}
                                                {activeSectionData.type === 'partners' && (
                                                    <div className="flex gap-2">
                                                        <button onClick={handleAddPartner} className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-xs font-bold border border-blue-100">
                                                            <Plus size={14} /> Add Partner
                                                        </button>
                                                        <button onClick={handleAddBank} className="flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors text-xs font-bold border border-green-100">
                                                            <Plus size={14} /> Add Bank
                                                        </button>
                                                    </div>
                                                )}

                                                <div className="w-px h-6 bg-gray-100 mx-1" />

                                                {/* GLOBAL ACTIONS */}
                                                <button onClick={addCustomSection} className="p-2 text-gray-500 hover:text-[var(--accent-primary)] hover:bg-gray-50 rounded-lg transition-colors border border-gray-100" title="Add New Section">
                                                    <Plus size={18} />
                                                </button>
                                                <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-6 py-2 bg-[var(--accent-primary)] text-white rounded-lg hover:bg-[#0f294d] transition-colors shadow-md text-xs font-bold disabled:opacity-50">
                                                    {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                                                    {saving ? 'Saving...' : 'Save Changes'}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="p-6">
                                            {/* CONTENT / DESIGN TOGGLE */}
                                            <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-xl mb-6 w-fit border border-gray-200">
                                                <button
                                                    onClick={() => setEditorTab('content')}
                                                    className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all
                                                        ${editorTab === 'content' ? 'bg-white text-[var(--accent-primary)] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                                >
                                                    <Edit size={14} /> Content Editor
                                                </button>
                                                <button
                                                    onClick={() => setEditorTab('design')}
                                                    className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all
                                                        ${editorTab === 'design' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                                >
                                                    <LayoutTemplate size={14} /> Design & Styles
                                                </button>
                                            </div>

                                            <div className="bg-white rounded-xl">
                                                {editorTab === 'content' ? getEditor(activeSectionData) : <SectionStyleEditor section={activeSectionData} onUpdate={updateSection} />}
                                            </div>
                                        </div>
                                    </div>
                                );
                            }
                            return (
                                <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8 text-center">
                                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                        <Edit size={20} />
                                    </div>
                                    <p className="text-sm font-medium text-gray-500">Select a section from the top bar to edit</p>
                                </div>
                            );
                        })()}
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
