import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Save, Shield, Handshake, Building2, GripVertical, Type, LayoutTemplate, Loader2 } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import toast from 'react-hot-toast';
import { useContent } from '../hooks/useContent';

const PartnersManager = () => {
    // Default data
    const defaultData = {
        pageHeader: { title: 'Strategic Partners & Trust', subtitle: 'Building institutional excellence through trusted partnerships and governance.' },
        partners: [{ id: 'p-1', name: 'Chubb International Insurance', category: 'Insurance Partner', description: 'Global insurance coverage for fund protection and trade credit insurance.', partnership: 'Protection of funds through comprehensive insurance policies', logo: 'https://companieslogo.com/img/orig/CB-90768b55.png?t=1632720960' }],
        banks: [
            { id: 'b-1', name: 'Maybank Berhad', role: 'Origin Bank & Trustees', swift: 'MBBEMYKL (MT103)', branch: 'Mid Valley Branch', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Maybank_Logo.svg/2560px-Maybank_Logo.svg.png' },
            { id: 'b-2', name: 'Emirates Islamic Bank', role: 'Nominated Trustees Bank', swift: '', location: 'Dubai, UAE', logo: 'https://upload.wikimedia.org/wikipedia/commons/e/ea/Emirates_Islamic_Logo.png' }
        ],
        trustContent: {
            title: 'Governance & Compliance',
            description: 'All fund management and investment activities are conducted under strict regulatory oversight and compliance with Malaysian financial regulations.',
            regulators: [
                { id: 1, title: 'Securities Commission', subtitle: 'Malaysia (SC)' },
                { id: 2, title: 'Central Bank', subtitle: 'Bank Negara Malaysia' },
                { id: 3, title: 'Trade Credit Insurance', subtitle: 'Fund Protection' }
            ]
        },
        customSections: []
    };

    const { content, loading, saving, saveContent } = useContent('partners', defaultData);

    const [pageHeader, setPageHeader] = useState(defaultData.pageHeader);
    const [partners, setPartners] = useState(defaultData.partners);
    const [banks, setBanks] = useState(defaultData.banks);
    const [trustContent, setTrustContent] = useState(defaultData.trustContent);
    const [customSections, setCustomSections] = useState(defaultData.customSections);

    useEffect(() => {
        if (content && !loading) {
            if (content.pageHeader) setPageHeader(content.pageHeader);
            if (content.partners) setPartners(content.partners);
            if (content.banks) setBanks(content.banks);
            if (content.trustContent) setTrustContent(content.trustContent);
            if (content.customSections) setCustomSections(content.customSections);
        }
    }, [content, loading]);

    // --- HANDLERS ---

    // Drag and Drop
    const handleDragEnd = (result) => {
        if (!result.destination) return;

        const { source, destination } = result;

        if (source.droppableId === 'partners-list') {
            const items = Array.from(partners);
            const [reorderedItem] = items.splice(source.index, 1);
            items.splice(destination.index, 0, reorderedItem);
            setPartners(items);
        } else if (source.droppableId === 'banks-list') {
            const items = Array.from(banks);
            const [reorderedItem] = items.splice(source.index, 1);
            items.splice(destination.index, 0, reorderedItem);
            setBanks(items);
        } else if (source.droppableId === 'custom-sections-list') {
            const items = Array.from(customSections);
            const [reorderedItem] = items.splice(source.index, 1);
            items.splice(destination.index, 0, reorderedItem);
            setCustomSections(items);
        }
    };

    // Partners CRUD
    const handleAddPartner = () => {
        setPartners([...partners, { id: `p-${Date.now()}`, name: 'New Partner', category: 'Category', description: 'Description', partnership: 'Partnership details', logo: '' }]);
    };
    const handleUpdatePartner = (id, field, value) => {
        setPartners(partners.map(p => p.id === id ? { ...p, [field]: value } : p));
    };
    const handleDeletePartner = (id) => {
        if (confirm('Delete this partner?')) setPartners(partners.filter(p => p.id !== id));
    };

    // Banks CRUD
    const handleAddBank = () => {
        setBanks([...banks, { id: `b-${Date.now()}`, name: 'New Bank', role: 'Role', swift: '', branch: '', logo: '' }]);
    };
    const handleUpdateBank = (id, field, value) => {
        setBanks(banks.map(b => b.id === id ? { ...b, [field]: value } : b));
    };
    const handleDeleteBank = (id) => {
        if (confirm('Delete this bank?')) setBanks(banks.filter(b => b.id !== id));
    };

    // Custom Sections CRUD
    const handleAddCustomSection = () => {
        setCustomSections([...customSections, { id: `cs-${Date.now()}`, title: 'New Section Title', content: 'Add your content here...' }]);
    };
    const handleUpdateCustomSection = (id, field, value) => {
        setCustomSections(customSections.map(s => s.id === id ? { ...s, [field]: value } : s));
    };
    const handleDeleteCustomSection = (id) => {
        if (confirm('Delete this section?')) setCustomSections(customSections.filter(s => s.id !== id));
    };

    // Trust Update
    const handleUpdateTrust = (field, value) => {
        setTrustContent(prev => ({ ...prev, [field]: value }));
    };
    const handleUpdateRegulator = (id, field, value) => {
        setTrustContent(prev => ({
            ...prev,
            regulators: prev.regulators.map(r => r.id === id ? { ...r, [field]: value } : r)
        }));
    };

    const handleSave = async () => {
        await saveContent({ pageHeader, partners, banks, trustContent, customSections });
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-heading text-[var(--accent-primary)] mb-2">Strategic Partners & Trust</h1>
                    <p className="text-[var(--text-secondary)]">Manage partners, banking relationships, and regulatory content.</p>
                </div>
                {loading ? (
                    <div className="flex items-center gap-2 px-6 py-2.5 bg-gray-300 text-gray-500 rounded-lg">
                        <Loader2 size={18} className="animate-spin" />
                        <span>Loading...</span>
                    </div>
                ) : (
                    <button onClick={handleSave} disabled={saving} className="btn-save">
                        {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                        <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                    </button>
                )}
            </div>

            <div className="flex flex-col lg:flex-row gap-8 items-start">

                {/* --- LEFT COLUMN: EDITOR --- */}
                <div className="w-full lg:w-1/2 space-y-8">

                    {/* 0. Page Header Settings */}
                    <div className="glass-card p-6 border-l-4 border-l-purple-600">
                        <h2 className="text-xl font-bold text-[var(--accent-primary)] flex items-center gap-2 mb-4"><Type size={20} /> Page Header</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase">Page Title</label>
                                <input value={pageHeader.title} onChange={e => setPageHeader({ ...pageHeader, title: e.target.value })} className="w-full p-2 border border-purple-100 rounded focus:ring-2 focus:ring-purple-100 outline-none font-bold text-[var(--accent-primary)]" />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase">Subtitle</label>
                                <textarea value={pageHeader.subtitle} onChange={e => setPageHeader({ ...pageHeader, subtitle: e.target.value })} className="w-full p-2 border border-purple-100 rounded focus:ring-2 focus:ring-purple-100 outline-none text-sm" rows={2} />
                            </div>
                        </div>
                    </div>

                    <DragDropContext onDragEnd={handleDragEnd}>

                        {/* 1. Partners Section */}
                        <div className="glass-card p-6 border-l-4 border-l-blue-600">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold text-[var(--accent-primary)] flex items-center gap-2"><Handshake size={20} /> Strategic Partners</h2>
                                <button onClick={handleAddPartner} className="btn-add px-3 py-1.5 text-xs">
                                    <Plus size={14} /> Add
                                </button>
                            </div>
                            <Droppable droppableId="partners-list">
                                {(provided) => (
                                    <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                                        {partners.map((p, index) => (
                                            <Draggable key={p.id} draggableId={p.id} index={index}>
                                                {(provided, snapshot) => (
                                                    <div ref={provided.innerRef} {...provided.draggableProps} className={`p-4 bg-white border border-[var(--border-light)] rounded-lg shadow-sm group ${snapshot.isDragging ? 'ring-2 ring-blue-500 z-50' : ''}`}>
                                                        <div className="flex gap-3">
                                                            <div {...provided.dragHandleProps} className="mt-1 text-gray-300 hover:text-gray-600 cursor-grab"><GripVertical size={20} /></div>
                                                            <div className="flex-1 space-y-3">
                                                                <div className="flex gap-2">
                                                                    <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center shrink-0 overflow-hidden border">
                                                                        {p.logo ? <img src={p.logo} alt="logo" className="w-full h-full object-contain" /> : <span className="text-[8px]">No Logo</span>}
                                                                    </div>
                                                                    <input value={p.logo} onChange={e => handleUpdatePartner(p.id, 'logo', e.target.value)} className="flex-1 text-xs border rounded px-2" placeholder="Logo Image URL" />
                                                                </div>
                                                                <input value={p.name} onChange={e => handleUpdatePartner(p.id, 'name', e.target.value)} className="w-full font-bold text-[#1A365D] border-b border-transparent focus:border-blue-300 outline-none pb-1" placeholder="Partner Name" />
                                                                <input value={p.category} onChange={e => handleUpdatePartner(p.id, 'category', e.target.value)} className="w-full text-xs font-bold text-[#B8860B] uppercase border-b border-transparent focus:border-blue-300 outline-none" placeholder="Category" />
                                                                <textarea value={p.description} onChange={e => handleUpdatePartner(p.id, 'description', e.target.value)} className="w-full text-sm text-gray-600 border rounded p-2 focus:border-blue-300 outline-none" rows={2} placeholder="Description" />
                                                                <input value={p.partnership} onChange={e => handleUpdatePartner(p.id, 'partnership', e.target.value)} className="w-full text-xs text-gray-500 italic bg-gray-50 p-2 rounded" placeholder="Partnership Details" />
                                                            </div>
                                                            <button onClick={() => handleDeletePartner(p.id)} className="text-gray-300 hover:text-red-500 self-start"><Trash2 size={16} /></button>
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

                        {/* 2. Banking Section */}
                        <div className="glass-card p-6 border-l-4 border-l-green-600">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold text-[var(--accent-primary)] flex items-center gap-2"><Building2 size={20} /> Banking Partners</h2>
                                <button onClick={handleAddBank} className="btn-add px-3 py-1.5 text-xs">
                                    <Plus size={14} /> Add
                                </button>
                            </div>
                            <Droppable droppableId="banks-list">
                                {(provided) => (
                                    <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                                        {banks.map((b, index) => (
                                            <Draggable key={b.id} draggableId={b.id} index={index}>
                                                {(provided, snapshot) => (
                                                    <div ref={provided.innerRef} {...provided.draggableProps} className={`p-4 bg-white border border-[var(--border-light)] rounded-lg shadow-sm group ${snapshot.isDragging ? 'ring-2 ring-green-500 z-50' : ''}`}>
                                                        <div className="flex gap-3">
                                                            <div {...provided.dragHandleProps} className="mt-1 text-gray-300 hover:text-gray-600 cursor-grab"><GripVertical size={20} /></div>
                                                            <div className="flex-1 space-y-2">
                                                                <div className="flex gap-2 mb-2">
                                                                    <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center shrink-0 overflow-hidden border">
                                                                        {b.logo ? <img src={b.logo} alt="logo" className="w-full h-full object-contain" /> : <span className="text-[8px]">No Logo</span>}
                                                                    </div>
                                                                    <input value={b.logo} onChange={e => handleUpdateBank(b.id, 'logo', e.target.value)} className="flex-1 text-xs border rounded px-2" placeholder="Logo Image URL" />
                                                                </div>
                                                                <input value={b.name} onChange={e => handleUpdateBank(b.id, 'name', e.target.value)} className="w-full font-bold text-[#1A365D] border-b border-transparent focus:border-green-300 outline-none pb-1" placeholder="Bank Name" />
                                                                <input value={b.role} onChange={e => handleUpdateBank(b.id, 'role', e.target.value)} className="w-full text-xs font-bold text-gray-500 uppercase" placeholder="Role" />
                                                                <div className="flex gap-2 text-xs">
                                                                    <input value={b.branch || b.location || ''} onChange={e => handleUpdateBank(b.id, 'branch', e.target.value)} className="flex-1 border rounded px-2 py-1" placeholder="Branch / Location" />
                                                                    <input value={b.swift} onChange={e => handleUpdateBank(b.id, 'swift', e.target.value)} className="flex-1 border rounded px-2 py-1 font-mono" placeholder="SWIFT Code" />
                                                                </div>
                                                            </div>
                                                            <button onClick={() => handleDeleteBank(b.id)} className="text-gray-300 hover:text-red-500 self-start"><Trash2 size={16} /></button>
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

                        {/* 3. Governance Section */}
                        <div className="glass-card p-6 border-l-4 border-l-amber-500">
                            <h2 className="text-xl font-bold text-[var(--accent-primary)] flex items-center gap-2 mb-4"><Shield size={20} /> Governance Content</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase">Title</label>
                                    <input value={trustContent.title} onChange={e => handleUpdateTrust('title', e.target.value)} className="w-full p-2 border border-blue-100 rounded focus:ring-2 focus:ring-blue-100 outline-none font-bold text-[#1A365D]" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase">Description</label>
                                    <textarea value={trustContent.description} onChange={e => handleUpdateTrust('description', e.target.value)} className="w-full p-2 border border-blue-100 rounded focus:ring-2 focus:ring-blue-100 outline-none text-sm" rows={3} />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-4">
                                    {trustContent.regulators.map(reg => (
                                        <div key={reg.id} className="p-3 bg-amber-50 rounded border border-amber-100">
                                            <input value={reg.title} onChange={e => handleUpdateRegulator(reg.id, 'title', e.target.value)} className="w-full bg-transparent text-sm font-bold text-[#1A365D] mb-1" />
                                            <input value={reg.subtitle} onChange={e => handleUpdateRegulator(reg.id, 'subtitle', e.target.value)} className="w-full bg-transparent text-xs text-gray-600" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* 4. Custom Sections (Dynamic) */}
                        <div className="glass-card p-6 border-l-4 border-l-gray-600">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold text-[var(--accent-primary)] flex items-center gap-2"><LayoutTemplate size={20} /> Custom Sections (Bottom)</h2>
                                <button onClick={handleAddCustomSection} className="btn-add px-3 py-1.5 text-xs">
                                    <Plus size={14} /> Add Title Section
                                </button>
                            </div>
                            <Droppable droppableId="custom-sections-list">
                                {(provided) => (
                                    <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                                        {customSections.map((sec, index) => (
                                            <Draggable key={sec.id} draggableId={sec.id} index={index}>
                                                {(provided, snapshot) => (
                                                    <div ref={provided.innerRef} {...provided.draggableProps} className={`p-4 bg-white border border-[var(--border-light)] rounded-lg shadow-sm group ${snapshot.isDragging ? 'ring-2 ring-gray-400 z-50' : ''}`}>
                                                        <div className="flex gap-3">
                                                            <div {...provided.dragHandleProps} className="mt-1 text-gray-300 hover:text-gray-600 cursor-grab"><GripVertical size={20} /></div>
                                                            <div className="flex-1 space-y-3">
                                                                <input value={sec.title} onChange={e => handleUpdateCustomSection(sec.id, 'title', e.target.value)} className="w-full font-bold text-gray-800 border-b border-transparent focus:border-gray-300 outline-none pb-1" placeholder="Section Title" />
                                                                <textarea value={sec.content} onChange={e => handleUpdateCustomSection(sec.id, 'content', e.target.value)} className="w-full text-sm text-gray-600 border rounded p-2 focus:border-gray-300 outline-none" rows={3} placeholder="Content goes here..." />
                                                            </div>
                                                            <button onClick={() => handleDeleteCustomSection(sec.id)} className="text-gray-300 hover:text-red-500 self-start"><Trash2 size={16} /></button>
                                                        </div>
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                            {customSections.length === 0 && <p className="text-xs text-gray-400 italic">No extra sections added.</p>}
                        </div>


                    </DragDropContext>

                </div>

                {/* --- RIGHT COLUMN: LIVE PREVIEW --- */}
                <div className="hidden lg:block w-1/2">
                    <div className="sticky top-6 rounded-xl overflow-hidden shadow-2xl border border-gray-200 h-[calc(100vh-100px)] overflow-y-auto no-scrollbar bg-white">
                        <div className="bg-gray-100 border-b p-2 text-center text-xs font-bold text-gray-400 uppercase tracking-widest">Live Site Preview</div>

                        {/* Preview Content */}
                        <div className="bg-white">

                            {/* Hero Mock */}
                            <div className="bg-[#F5F7FA] py-12 px-6 text-center mb-8 border-b-4 border-[#B8860B]">
                                <h1 className="text-3xl font-bold mb-2 text-[#1A365D]">{pageHeader.title}</h1>
                                <p className="text-gray-600 text-sm">{pageHeader.subtitle}</p>
                            </div>

                            {/* Partners Preview */}
                            <div className="px-8 pb-12">
                                <h2 className="text-xl font-bold text-[#1A365D] text-center mb-8 border-b pb-4">Insurance Partner</h2>
                                <div className="space-y-8">
                                    {partners.map(p => (
                                        <div key={p.id} className="text-center max-w-lg mx-auto">
                                            {p.logo ? (
                                                <img src={p.logo} alt={p.name} className="h-20 w-auto mx-auto mb-4 object-contain" />
                                            ) : (
                                                <div className="w-20 h-20 bg-gradient-to-br from-[#1A365D] to-[#2D5A8B] rounded-full mx-auto mb-4 flex items-center justify-center text-white font-bold text-xs p-2 shadow-lg">LOGO</div>
                                            )}
                                            <h3 className="text-2xl font-bold text-[#1A365D] mb-2">{p.name}</h3>
                                            <p className="text-[#B8860B] font-bold text-xs uppercase tracking-widest mb-4">{p.category}</p>
                                            <p className="text-gray-600 text-sm leading-relaxed mb-4">{p.description}</p>
                                            <div className="bg-gray-50 border-l-4 border-[#B8860B] p-3 text-xs text-gray-500 italic">
                                                {p.partnership}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Banking Preview */}
                            <div className="bg-[#F5F7FA] py-12 px-8">
                                <h2 className="text-xl font-bold text-[#1A365D] text-center mb-8">Banking Partners</h2>
                                <div className="grid grid-cols-1 gap-4 max-w-lg mx-auto">
                                    {banks.map((b, i) => (
                                        <div key={b.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 relative overflow-hidden">
                                            <div className={`absolute top-0 left-0 w-1 h-full ${i === 0 ? 'bg-[#FFCC00]' : 'bg-[#006747]'}`} />
                                            <div className="flex items-start gap-4">
                                                {b.logo && <img src={b.logo} alt={b.name} className="w-12 h-12 object-contain" />}
                                                <div>
                                                    <h3 className="text-lg font-bold text-[#1A365D]">{b.name}</h3>
                                                    <p className="text-[#B8860B] font-bold text-xs mb-2">{b.role}</p>
                                                    <div className="text-xs text-gray-500 space-y-1">
                                                        {b.branch && <p>Branch: {b.branch}</p>}
                                                        {b.location && <p>Location: {b.location}</p>}
                                                        {b.swift && <p className="font-mono bg-gray-100 inline-block px-1">SWIFT: {b.swift}</p>}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Governance Preview */}
                            <div className="py-12 px-8 text-center bg-white">
                                <h2 className="text-2xl font-bold text-[#1A365D] mb-4">{trustContent.title}</h2>
                                <p className="text-gray-600 text-sm max-w-lg mx-auto mb-8">{trustContent.description}</p>
                                <div className="grid grid-cols-3 gap-2 text-xs">
                                    {trustContent.regulators.map(r => (
                                        <div key={r.id} className="bg-gray-50 p-3 rounded">
                                            <div className="font-bold text-[#1A365D] mb-1">{r.title}</div>
                                            <div className="text-gray-500 text-[10px]">{r.subtitle}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Custom Sections Preview */}
                            {customSections.length > 0 && (
                                <div className="py-12 px-8 bg-gray-50 border-t border-gray-200">
                                    {customSections.map(sec => (
                                        <div key={sec.id} className="max-w-2xl mx-auto mb-12 last:mb-0 text-center">
                                            <h2 className="text-2xl font-bold text-[#1A365D] mb-4">{sec.title}</h2>
                                            <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{sec.content}</p>
                                        </div>
                                    ))}
                                </div>
                            )}

                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default PartnersManager;
