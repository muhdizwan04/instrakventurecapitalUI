import React, { useEffect, useMemo, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Plus, Save, Trash2, Loader2, GripVertical, Newspaper, Calendar, Link as LinkIcon, Image as ImageIcon, ToggleLeft, ToggleRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { useContent } from '../hooks/useContent';
import ImageUpload from '../components/ImageUpload';

const makeId = (prefix) => `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;

const DEFAULT_DATA = {
    hero: {
        title: 'News & Events',
        subtitle: 'Articles, announcements, and upcoming events—managed from the admin panel and synced to the client site.',
        buttonLabel: '',
        buttonLink: '',
        styles: {
            bgColor: '#FAFBFC',
            titleFontFamily: 'var(--font-heading)',
            titleFontSize: '2.8rem',
            titleFontWeight: '700',
            titleColor: '#1A365D',
            titleAlign: 'center',
            subtitleFontFamily: 'var(--font-main)',
            subtitleFontSize: '1.15rem',
            subtitleColor: '#4A5568',
            subtitleAlign: 'center',
            buttonFontFamily: 'var(--font-heading)',
            buttonFontSize: '1rem',
            buttonFontWeight: '600',
            buttonColor: '#FFFFFF',
            buttonBgColor: '#1A365D'
        }
    },
    blocks: [
        {
            id: 'block-latest',
            title: 'Latest Updates',
            subtitle: 'Browse our latest articles and events.',
            ctaLabel: 'View all',
            ctaLink: '/latest-news-2',
            styles: {
                bgColor: '#FFFFFF',
                textColor: '#1A365D'
            },
            items: [
                {
                    id: 'item-1',
                    type: 'news',
                    title: 'New announcement',
                    excerpt: 'Add a short summary here. This will appear on the magazine card.',
                    date: new Date().toISOString().slice(0, 10),
                    image: '',
                    link: '/latest-news-2',
                    buttonLabel: 'Read more',
                    published: true
                }
            ]
        }
    ]
};

const NewsManager = () => {
    // NOTE: We store the new schema under a new content key.
    // This avoids breaking any legacy "latest_news" schema and allows the client to opt-in.
    const { content, loading, saving, saveContent } = useContent('news_events', DEFAULT_DATA);

    const [hero, setHero] = useState(DEFAULT_DATA.hero);
    const [blocks, setBlocks] = useState(DEFAULT_DATA.blocks);
    const [activeBlockId, setActiveBlockId] = useState(DEFAULT_DATA.blocks[0]?.id || null);
    const [activeItemId, setActiveItemId] = useState(null);

    useEffect(() => {
        if (!content || loading) return;
        if (content.hero) setHero({ ...DEFAULT_DATA.hero, ...content.hero, styles: { ...DEFAULT_DATA.hero.styles, ...(content.hero.styles || {}) } });
        if (Array.isArray(content.blocks) && content.blocks.length > 0) {
            const sanitized = content.blocks.map((b, idx) => ({
                id: b.id || makeId(`block-${idx}`),
                title: b.title || `Block ${idx + 1}`,
                subtitle: b.subtitle || '',
                ctaLabel: b.ctaLabel || '',
                ctaLink: b.ctaLink || '',
                styles: b.styles || { bgColor: '#FFFFFF', textColor: '#1A365D' },
                items: Array.isArray(b.items) ? b.items.map((it, i) => ({
                    id: it.id || makeId(`item-${idx}-${i}`),
                    type: it.type === 'event' ? 'event' : 'news',
                    title: it.title || 'Untitled',
                    excerpt: it.excerpt || '',
                    date: it.date || '',
                    image: it.image || '',
                    link: it.link || '',
                    buttonLabel: it.buttonLabel || 'Read more',
                    published: it.published !== false,
                    styles: it.styles || {}
                })) : []
            }));
            setBlocks(sanitized);
            setActiveBlockId(prev => sanitized.find(b => b.id === prev)?.id || sanitized[0]?.id || null);
        }
    }, [content, loading]);

    const activeBlock = useMemo(() => blocks.find(b => b.id === activeBlockId), [blocks, activeBlockId]);
    const activeItem = useMemo(() => activeBlock?.items?.find(it => it.id === activeItemId) ?? null, [activeBlock, activeItemId]);

    useEffect(() => {
        if (!activeBlockId && blocks.length > 0) setActiveBlockId(blocks[0].id);
    }, [blocks, activeBlockId]);

    useEffect(() => {
        if (activeItemId && activeBlock && !(activeBlock.items || []).some(it => it.id === activeItemId)) setActiveItemId(null);
    }, [activeBlockId, activeBlock?.items, activeItemId]);

    const updateBlock = (blockId, updates) => setBlocks(prev => prev.map(b => (b.id === blockId ? { ...b, ...updates } : b)));
    const updateBlockStyles = (blockId, styles) => setBlocks(prev => prev.map(b => (b.id === blockId ? { ...b, styles } : b)));

    const addBlock = () => {
        const b = {
            id: makeId('block'),
            title: 'New Block',
            subtitle: '',
            ctaLabel: '',
            ctaLink: '',
            styles: { bgColor: '#FFFFFF', textColor: '#1A365D' },
            items: []
        };
        setBlocks(prev => [...prev, b]);
        setActiveBlockId(b.id);
        toast.success('Block added');
    };

    const removeBlock = (blockId) => {
        if (!window.confirm('Remove this block?')) return;
        setBlocks(prev => {
            const next = prev.filter(b => b.id !== blockId);
            setActiveBlockId(curr => (curr === blockId ? (next[0]?.id || null) : curr));
            return next;
        });
        toast.success('Block removed');
    };

    const addItem = (blockId) => {
        const item = {
            id: makeId('item'),
            type: 'news',
            title: 'New item',
            excerpt: '',
            date: new Date().toISOString().slice(0, 10),
            image: '',
            link: '',
            buttonLabel: 'Read more',
            published: true,
            styles: {}
        };
        setBlocks(prev => prev.map(b => (b.id === blockId ? { ...b, items: [...(b.items || []), item] } : b)));
        setActiveItemId(item.id);
        toast.success('Item added');
    };

    const updateItem = (blockId, itemId, updates) => {
        setBlocks(prev => prev.map(b => {
            if (b.id !== blockId) return b;
            return { ...b, items: (b.items || []).map(it => (it.id === itemId ? { ...it, ...updates } : it)) };
        }));
    };

    const removeItem = (blockId, itemId) => {
        if (!window.confirm('Remove this item?')) return;
        setBlocks(prev => prev.map(b => (b.id === blockId ? { ...b, items: (b.items || []).filter(it => it.id !== itemId) } : b)));
        toast.success('Item removed');
    };

    const handleDragEnd = (result) => {
        const { source, destination } = result;
        if (!destination) return;

        // Reorder blocks (tabs)
        if (source.droppableId === 'blocks' && destination.droppableId === 'blocks') {
            const next = [...blocks];
            const [moved] = next.splice(source.index, 1);
            next.splice(destination.index, 0, moved);
            setBlocks(next);
            setActiveBlockId(moved.id);
            return;
        }

        // Reorder items within active block
        if (source.droppableId === 'items' && destination.droppableId === 'items' && activeBlock) {
            const nextItems = [...(activeBlock.items || [])];
            const [moved] = nextItems.splice(source.index, 1);
            nextItems.splice(destination.index, 0, moved);
            updateBlock(activeBlock.id, { items: nextItems });
        }
    };

    const handleSave = async () => {
        const ok = await saveContent({ hero, blocks });
        if (ok) toast.success('News & Events updated!');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="animate-spin text-[var(--accent-primary)]" size={32} />
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-10">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-heading text-[var(--accent-primary)] mb-2">News & Events</h1>
                    <p className="text-[var(--text-secondary)]">Create magazine-style blocks and manage articles with images + button links.</p>
                </div>
                <button onClick={handleSave} disabled={saving} className="btn-save">
                    {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                    <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                </button>
            </div>

            {/* Hero Editor */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
                <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                    <Newspaper size={18} className="text-[var(--accent-primary)]" />
                    <h3 className="text-lg font-bold text-gray-800">Page Hero</h3>
                </div>
                <div className="grid gap-4">
                    <div>
                        <label className="label">Title</label>
                        <input value={hero.title || ''} onChange={(e) => setHero({ ...hero, title: e.target.value })} className="input-field" placeholder="News & Events" />
                    </div>
                    <div>
                        <label className="label">Summary / Subtitle</label>
                        <textarea value={hero.subtitle || ''} onChange={(e) => setHero({ ...hero, subtitle: e.target.value })} className="input-field" rows={2} placeholder="Stay updated with the latest..." />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="label">Button label (optional)</label>
                            <input value={hero.buttonLabel || ''} onChange={(e) => setHero({ ...hero, buttonLabel: e.target.value })} className="input-field" placeholder="e.g. View all" />
                        </div>
                        <div>
                            <label className="label">Button link (optional)</label>
                            <input value={hero.buttonLink || ''} onChange={(e) => setHero({ ...hero, buttonLink: e.target.value })} className="input-field" placeholder="/latest-news-2" />
                        </div>
                    </div>
                </div>
                <div className="border-t border-gray-200 pt-4 mt-4">
                    <h4 className="text-sm font-bold text-gray-600 mb-3">Header background & font</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Header background colour</label>
                            <div className="flex items-center gap-2">
                                <input type="color" value={(hero.styles || {}).bgColor || '#FAFBFC'} onChange={(e) => setHero({ ...hero, styles: { ...(hero.styles || {}), bgColor: e.target.value } })} className="w-8 h-8 rounded border cursor-pointer" />
                                <input type="text" value={(hero.styles || {}).bgColor || ''} onChange={(e) => setHero({ ...hero, styles: { ...(hero.styles || {}), bgColor: e.target.value } })} className="input-field text-xs flex-1 font-mono" placeholder="#FAFBFC" />
                            </div>
                        </div>
                    </div>
                    <h4 className="text-sm font-bold text-gray-600 mb-3 mt-2">Hero font & alignment</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                            <span className="text-xs font-bold text-gray-500 uppercase block mb-2">Title</span>
                            <div className="space-y-2">
                                <div><label className="text-[10px] text-gray-400">Align</label><select value={(hero.styles || {}).titleAlign || 'center'} onChange={(e) => setHero({ ...hero, styles: { ...(hero.styles || {}), titleAlign: e.target.value } })} className="input-field text-xs w-full"> <option value="left">Left</option><option value="center">Center</option><option value="right">Right</option></select></div>
                                <div><label className="text-[10px] text-gray-400">Font family</label><input value={(hero.styles || {}).titleFontFamily || ''} onChange={(e) => setHero({ ...hero, styles: { ...(hero.styles || {}), titleFontFamily: e.target.value } })} className="input-field text-xs" placeholder="var(--font-heading)" /></div>
                                <div><label className="text-[10px] text-gray-400">Font size</label><input value={(hero.styles || {}).titleFontSize || ''} onChange={(e) => setHero({ ...hero, styles: { ...(hero.styles || {}), titleFontSize: e.target.value } })} className="input-field text-xs" placeholder="2.8rem" /></div>
                                <div><label className="text-[10px] text-gray-400">Font weight</label><select value={(hero.styles || {}).titleFontWeight || '700'} onChange={(e) => setHero({ ...hero, styles: { ...(hero.styles || {}), titleFontWeight: e.target.value } })} className="input-field text-xs w-full"><option value="400">400</option><option value="600">600</option><option value="700">700</option><option value="800">800</option></select></div>
                                <div className="flex items-center gap-2"><input type="color" value={(hero.styles || {}).titleColor || '#1A365D'} onChange={(e) => setHero({ ...hero, styles: { ...(hero.styles || {}), titleColor: e.target.value } })} className="w-8 h-8 rounded border cursor-pointer" /><input type="text" value={(hero.styles || {}).titleColor || ''} onChange={(e) => setHero({ ...hero, styles: { ...(hero.styles || {}), titleColor: e.target.value } })} className="input-field text-xs flex-1" placeholder="#1A365D" /></div>
                            </div>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                            <span className="text-xs font-bold text-gray-500 uppercase block mb-2">Summary / Subtitle</span>
                            <div className="space-y-2">
                                <div><label className="text-[10px] text-gray-400">Align</label><select value={(hero.styles || {}).subtitleAlign || 'center'} onChange={(e) => setHero({ ...hero, styles: { ...(hero.styles || {}), subtitleAlign: e.target.value } })} className="input-field text-xs w-full"><option value="left">Left</option><option value="center">Center</option><option value="right">Right</option></select></div>
                                <div><label className="text-[10px] text-gray-400">Font family</label><input value={(hero.styles || {}).subtitleFontFamily || ''} onChange={(e) => setHero({ ...hero, styles: { ...(hero.styles || {}), subtitleFontFamily: e.target.value } })} className="input-field text-xs" placeholder="var(--font-main)" /></div>
                                <div><label className="text-[10px] text-gray-400">Font size</label><input value={(hero.styles || {}).subtitleFontSize || ''} onChange={(e) => setHero({ ...hero, styles: { ...(hero.styles || {}), subtitleFontSize: e.target.value } })} className="input-field text-xs" placeholder="1.15rem" /></div>
                                <div className="flex items-center gap-2"><label className="text-[10px] text-gray-400">Color</label><input type="color" value={(hero.styles || {}).subtitleColor || '#4A5568'} onChange={(e) => setHero({ ...hero, styles: { ...(hero.styles || {}), subtitleColor: e.target.value } })} className="w-8 h-8 rounded border cursor-pointer" /><input type="text" value={(hero.styles || {}).subtitleColor || ''} onChange={(e) => setHero({ ...hero, styles: { ...(hero.styles || {}), subtitleColor: e.target.value } })} className="input-field text-xs flex-1" /></div>
                            </div>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                            <span className="text-xs font-bold text-gray-500 uppercase block mb-2">Button</span>
                            <div className="space-y-2">
                                <div><label className="text-[10px] text-gray-400">Font family</label><input value={(hero.styles || {}).buttonFontFamily || ''} onChange={(e) => setHero({ ...hero, styles: { ...(hero.styles || {}), buttonFontFamily: e.target.value } })} className="input-field text-xs" placeholder="var(--font-heading)" /></div>
                                <div><label className="text-[10px] text-gray-400">Font size</label><input value={(hero.styles || {}).buttonFontSize || ''} onChange={(e) => setHero({ ...hero, styles: { ...(hero.styles || {}), buttonFontSize: e.target.value } })} className="input-field text-xs" placeholder="1rem" /></div>
                                <div><label className="text-[10px] text-gray-400">Font weight</label><select value={(hero.styles || {}).buttonFontWeight || '600'} onChange={(e) => setHero({ ...hero, styles: { ...(hero.styles || {}), buttonFontWeight: e.target.value } })} className="input-field text-xs w-full"><option value="400">400</option><option value="600">600</option><option value="700">700</option></select></div>
                                <div className="flex items-center gap-2"><label className="text-[10px] text-gray-400">Text color</label><input type="color" value={(hero.styles || {}).buttonColor || '#FFFFFF'} onChange={(e) => setHero({ ...hero, styles: { ...(hero.styles || {}), buttonColor: e.target.value } })} className="w-8 h-8 rounded border cursor-pointer" /><input type="text" value={(hero.styles || {}).buttonColor || ''} onChange={(e) => setHero({ ...hero, styles: { ...(hero.styles || {}), buttonColor: e.target.value } })} className="input-field text-xs flex-1" /></div>
                                <div className="flex items-center gap-2"><label className="text-[10px] text-gray-400">BG color</label><input type="color" value={(hero.styles || {}).buttonBgColor || '#1A365D'} onChange={(e) => setHero({ ...hero, styles: { ...(hero.styles || {}), buttonBgColor: e.target.value } })} className="w-8 h-8 rounded border cursor-pointer" /><input type="text" value={(hero.styles || {}).buttonBgColor || ''} onChange={(e) => setHero({ ...hero, styles: { ...(hero.styles || {}), buttonBgColor: e.target.value } })} className="input-field text-xs flex-1" /></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Blocks + Items */}
            <DragDropContext onDragEnd={handleDragEnd}>
                {/* Blocks Tab Bar */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between p-4 border-b border-gray-100">
                        <div className="flex items-center gap-2">
                            <Newspaper size={18} className="text-[var(--accent-primary)]" />
                            <h3 className="text-lg font-bold text-gray-800">Magazine Blocks</h3>
                        </div>
                        <button onClick={addBlock} className="text-xs flex items-center gap-1 text-blue-600 bg-blue-50 px-3 py-2 rounded-lg hover:bg-blue-100 font-bold border border-blue-100">
                            <Plus size={14} /> Add Block
                        </button>
                    </div>

                    <div className="px-3 py-2 border-b border-gray-100 overflow-x-auto">
                        <Droppable droppableId="blocks" direction="horizontal">
                            {(provided) => (
                                <div ref={provided.innerRef} {...provided.droppableProps} className="flex gap-2" style={{ width: 'max-content' }}>
                                    {blocks.map((b, idx) => (
                                        <Draggable key={b.id} draggableId={b.id} index={idx}>
                                            {(prov, snap) => (
                                                <div
                                                    ref={prov.innerRef}
                                                    {...prov.draggableProps}
                                                    className={`flex items-center gap-2 rounded-lg border px-2 py-1.5 transition-all ${activeBlockId === b.id
                                                        ? 'bg-blue-50 border-blue-200 text-blue-700'
                                                        : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                                                        } ${snap.isDragging ? 'shadow-lg ring-2 ring-blue-300' : ''}`}
                                                    style={prov.draggableProps.style}
                                                >
                                                    <div {...prov.dragHandleProps} className="text-gray-300 hover:text-gray-500 cursor-grab">
                                                        <GripVertical size={14} />
                                                    </div>
                                                    <button onClick={() => setActiveBlockId(b.id)} className="text-xs font-bold whitespace-nowrap max-w-[160px] truncate">
                                                        {b.title || 'Untitled Block'}
                                                    </button>
                                                    <button onClick={() => removeBlock(b.id)} className="text-gray-300 hover:text-red-500" title="Remove block">
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </div>

                    {/* Active block editor */}
                    <div className="p-5">
                        {!activeBlock ? (
                            <div className="text-sm text-gray-400 py-10 text-center">Add a block to start managing News & Events.</div>
                        ) : (
                            <div className="space-y-6">
                                {/* Block – title, subtitle, CTA, appearance, fonts */}
                                <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
                                    <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Block</h4>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="label">Block Title</label>
                                        <input value={activeBlock.title || ''} onChange={e => updateBlock(activeBlock.id, { title: e.target.value })} className="input-field" />
                                    </div>
                                    <div>
                                        <label className="label">Block Subtitle</label>
                                        <input value={activeBlock.subtitle || ''} onChange={e => updateBlock(activeBlock.id, { subtitle: e.target.value })} className="input-field" />
                                    </div>
                                    <div>
                                        <label className="label">Block Button Label (optional)</label>
                                        <input value={activeBlock.ctaLabel || ''} onChange={e => updateBlock(activeBlock.id, { ctaLabel: e.target.value })} className="input-field" placeholder="e.g. View all" />
                                    </div>
                                    <div>
                                        <label className="label">Block Button Link (optional)</label>
                                        <div className="flex items-center gap-2">
                                            <LinkIcon size={16} className="text-gray-400" />
                                            <input value={activeBlock.ctaLink || ''} onChange={e => updateBlock(activeBlock.id, { ctaLink: e.target.value })} className="input-field" placeholder="/latest-news-2 or https://..." />
                                        </div>
                                    </div>
                                </div>

                                {/* Block styles */}
                                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                                    <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Appearance</div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Background</label>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="color"
                                                    value={activeBlock.styles?.bgColor || '#FFFFFF'}
                                                    onChange={e => updateBlockStyles(activeBlock.id, { ...(activeBlock.styles || {}), bgColor: e.target.value })}
                                                    className="w-9 h-9 rounded border cursor-pointer"
                                                />
                                                <input
                                                    value={activeBlock.styles?.bgColor || '#FFFFFF'}
                                                    onChange={e => updateBlockStyles(activeBlock.id, { ...(activeBlock.styles || {}), bgColor: e.target.value })}
                                                    className="input-field text-xs font-mono"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Text</label>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="color"
                                                    value={activeBlock.styles?.textColor || '#1A365D'}
                                                    onChange={e => updateBlockStyles(activeBlock.id, { ...(activeBlock.styles || {}), textColor: e.target.value })}
                                                    className="w-9 h-9 rounded border cursor-pointer"
                                                />
                                                <input
                                                    value={activeBlock.styles?.textColor || '#1A365D'}
                                                    onChange={e => updateBlockStyles(activeBlock.id, { ...(activeBlock.styles || {}), textColor: e.target.value })}
                                                    className="input-field text-xs font-mono"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Block font & alignment (title, subtitle, button) */}
                                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                                    <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Block font & alignment</div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="p-3 bg-white rounded-lg border border-gray-100">
                                            <span className="text-xs font-bold text-gray-500 uppercase block mb-2">Title</span>
                                            <div className="space-y-2">
                                                <div><label className="text-[10px] text-gray-400">Align</label><select value={activeBlock.styles?.titleAlign || 'left'} onChange={e => updateBlockStyles(activeBlock.id, { ...(activeBlock.styles || {}), titleAlign: e.target.value })} className="input-field text-xs w-full"><option value="left">Left</option><option value="center">Center</option><option value="right">Right</option></select></div>
                                                <div><label className="text-[10px] text-gray-400">Font family</label><input value={activeBlock.styles?.titleFontFamily || ''} onChange={e => updateBlockStyles(activeBlock.id, { ...(activeBlock.styles || {}), titleFontFamily: e.target.value })} className="input-field text-xs" placeholder="var(--font-heading)" /></div>
                                                <div><label className="text-[10px] text-gray-400">Font size</label><input value={activeBlock.styles?.titleFontSize || ''} onChange={e => updateBlockStyles(activeBlock.id, { ...(activeBlock.styles || {}), titleFontSize: e.target.value })} className="input-field text-xs" placeholder="2rem" /></div>
                                                <div><label className="text-[10px] text-gray-400">Font weight</label><select value={activeBlock.styles?.titleFontWeight || '800'} onChange={e => updateBlockStyles(activeBlock.id, { ...(activeBlock.styles || {}), titleFontWeight: e.target.value })} className="input-field text-xs w-full"><option value="400">400</option><option value="600">600</option><option value="700">700</option><option value="800">800</option></select></div>
                                                <div className="flex items-center gap-2"><input type="color" value={activeBlock.styles?.titleColor || activeBlock.styles?.textColor || '#1A365D'} onChange={e => updateBlockStyles(activeBlock.id, { ...(activeBlock.styles || {}), titleColor: e.target.value })} className="w-8 h-8 rounded border cursor-pointer" /><input type="text" value={activeBlock.styles?.titleColor || ''} onChange={e => updateBlockStyles(activeBlock.id, { ...(activeBlock.styles || {}), titleColor: e.target.value })} className="input-field text-xs flex-1" placeholder="#1A365D" /></div>
                                            </div>
                                        </div>
                                        <div className="p-3 bg-white rounded-lg border border-gray-100">
                                            <span className="text-xs font-bold text-gray-500 uppercase block mb-2">Subtitle</span>
                                            <div className="space-y-2">
                                                <div><label className="text-[10px] text-gray-400">Align</label><select value={activeBlock.styles?.subtitleAlign || 'left'} onChange={e => updateBlockStyles(activeBlock.id, { ...(activeBlock.styles || {}), subtitleAlign: e.target.value })} className="input-field text-xs w-full"><option value="left">Left</option><option value="center">Center</option><option value="right">Right</option></select></div>
                                                <div><label className="text-[10px] text-gray-400">Font family</label><input value={activeBlock.styles?.subtitleFontFamily || ''} onChange={e => updateBlockStyles(activeBlock.id, { ...(activeBlock.styles || {}), subtitleFontFamily: e.target.value })} className="input-field text-xs" placeholder="var(--font-main)" /></div>
                                                <div><label className="text-[10px] text-gray-400">Font size</label><input value={activeBlock.styles?.subtitleFontSize || ''} onChange={e => updateBlockStyles(activeBlock.id, { ...(activeBlock.styles || {}), subtitleFontSize: e.target.value })} className="input-field text-xs" placeholder="1rem" /></div>
                                                <div className="flex items-center gap-2"><label className="text-[10px] text-gray-400">Color</label><input type="color" value={activeBlock.styles?.subtitleColor || activeBlock.styles?.textColor || '#4A5568'} onChange={e => updateBlockStyles(activeBlock.id, { ...(activeBlock.styles || {}), subtitleColor: e.target.value })} className="w-8 h-8 rounded border cursor-pointer" /><input type="text" value={activeBlock.styles?.subtitleColor || ''} onChange={e => updateBlockStyles(activeBlock.id, { ...(activeBlock.styles || {}), subtitleColor: e.target.value })} className="input-field text-xs flex-1" /></div>
                                            </div>
                                        </div>
                                        <div className="p-3 bg-white rounded-lg border border-gray-100">
                                            <span className="text-xs font-bold text-gray-500 uppercase block mb-1">Button (block header CTA)</span>
                                            <p className="text-[10px] text-gray-400 mb-2">Styles the &quot;View all&quot; (or your label) button next to the block title above the cards.</p>
                                            <div className="space-y-2">
                                                <div><label className="text-[10px] text-gray-400">Font family</label><input value={activeBlock.styles?.buttonFontFamily || ''} onChange={e => updateBlockStyles(activeBlock.id, { ...(activeBlock.styles || {}), buttonFontFamily: e.target.value })} className="input-field text-xs" placeholder="var(--font-heading)" /></div>
                                                <div><label className="text-[10px] text-gray-400">Font size</label><input value={activeBlock.styles?.buttonFontSize || ''} onChange={e => updateBlockStyles(activeBlock.id, { ...(activeBlock.styles || {}), buttonFontSize: e.target.value })} className="input-field text-xs" placeholder="0.9rem" /></div>
                                                <div><label className="text-[10px] text-gray-400">Font weight</label><select value={activeBlock.styles?.buttonFontWeight || '800'} onChange={e => updateBlockStyles(activeBlock.id, { ...(activeBlock.styles || {}), buttonFontWeight: e.target.value })} className="input-field text-xs w-full"><option value="400">400</option><option value="600">600</option><option value="700">700</option><option value="800">800</option></select></div>
                                                <div className="flex items-center gap-2"><label className="text-[10px] text-gray-400">Text color</label><input type="color" value={activeBlock.styles?.buttonColor || '#1A365D'} onChange={e => updateBlockStyles(activeBlock.id, { ...(activeBlock.styles || {}), buttonColor: e.target.value })} className="w-8 h-8 rounded border cursor-pointer" /><input type="text" value={activeBlock.styles?.buttonColor || ''} onChange={e => updateBlockStyles(activeBlock.id, { ...(activeBlock.styles || {}), buttonColor: e.target.value })} className="input-field text-xs flex-1" /></div>
                                                <div className="flex items-center gap-2"><label className="text-[10px] text-gray-400">BG / border</label><input type="color" value={activeBlock.styles?.buttonBgColor || '#B8860B'} onChange={e => updateBlockStyles(activeBlock.id, { ...(activeBlock.styles || {}), buttonBgColor: e.target.value })} className="w-8 h-8 rounded border cursor-pointer" /><input type="text" value={activeBlock.styles?.buttonBgColor || ''} onChange={e => updateBlockStyles(activeBlock.id, { ...(activeBlock.styles || {}), buttonBgColor: e.target.value })} className="input-field text-xs flex-1" /></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Items (News / Events) – list only */}
                                <div className="flex items-center justify-between">
                                    <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Items (News / Events)</h4>
                                    <button onClick={() => addItem(activeBlock.id)} className="text-xs flex items-center gap-1 text-blue-600 bg-blue-50 px-3 py-2 rounded-lg hover:bg-blue-100 font-bold border border-blue-100">
                                        <Plus size={14} /> Add Item
                                    </button>
                                </div>

                                <Droppable droppableId="items">
                                    {(provided) => (
                                        <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-2">
                                            {(activeBlock.items || []).map((it, idx) => (
                                                <Draggable key={it.id} draggableId={it.id} index={idx}>
                                                    {(prov, snap) => (
                                                        <div
                                                            ref={prov.innerRef}
                                                            {...prov.draggableProps}
                                                            className={`flex items-center gap-3 rounded-lg border p-2 transition-all ${activeItemId === it.id ? 'border-blue-300 bg-blue-50 ring-1 ring-blue-200' : 'border-gray-200 bg-white hover:bg-gray-50'} ${snap.isDragging ? 'shadow-lg ring-2 ring-blue-300' : ''}`}
                                                            style={prov.draggableProps.style}
                                                        >
                                                            <div {...prov.dragHandleProps} className="text-gray-300 hover:text-gray-500 cursor-grab shrink-0">
                                                                <GripVertical size={16} />
                                                            </div>
                                                            <div className="w-12 h-8 rounded overflow-hidden border bg-gray-100 shrink-0">
                                                                {it.image ? <img src={it.image} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-300"><ImageIcon size={14} /></div>}
                                                            </div>
                                                            <div className="min-w-0 flex-1">
                                                                <span className="text-sm font-medium text-gray-800 truncate block">{it.title || 'Untitled'}</span>
                                                                <span className={`text-[10px] font-bold uppercase ${(it.type || '').toLowerCase() === 'event' ? 'text-amber-600' : 'text-blue-600'}`}>{(it.type || 'news')}</span>
                                                            </div>
                                                            <button type="button" onClick={() => setActiveItemId(activeItemId === it.id ? null : it.id)} className="text-xs font-bold text-blue-600 hover:text-blue-700 shrink-0">
                                                                {activeItemId === it.id ? 'Done' : 'Edit'}
                                                            </button>
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>

                                {(activeBlock.items || []).length === 0 && (
                                    <div className="text-center p-8 bg-gray-50 border border-dashed border-gray-200 rounded-xl text-gray-400 text-sm">
                                        No items yet. Click “Add Item” to create your first news/event card.
                                    </div>
                                )}

                                {/* Item detail – below the list */}
                                {activeItem && (
                                    <div className="mt-6 p-5 bg-gray-50 rounded-xl border border-gray-200">
                                        <div className="flex items-center justify-between mb-4">
                                            <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Item detail – {activeItem.title || 'Untitled'}</h4>
                                            <button type="button" onClick={() => setActiveItemId(null)} className="text-xs text-gray-500 hover:text-gray-700">Close</button>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="md:col-span-2">
                                                <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Title</label>
                                                <input value={activeItem.title || ''} onChange={e => updateItem(activeBlock.id, activeItem.id, { title: e.target.value })} className="input-field font-bold bg-white" />
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Type</label>
                                                <select value={activeItem.type || 'news'} onChange={e => updateItem(activeBlock.id, activeItem.id, { type: e.target.value })} className="input-field bg-white">
                                                    <option value="news">News</option>
                                                    <option value="event">Event</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1 flex items-center gap-2"><Calendar size={12} /> Date</label>
                                                <input type="date" value={activeItem.date || ''} onChange={e => updateItem(activeBlock.id, activeItem.id, { date: e.target.value })} className="input-field bg-white" />
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Excerpt / Summary</label>
                                                <textarea value={activeItem.excerpt || ''} onChange={e => updateItem(activeBlock.id, activeItem.id, { excerpt: e.target.value })} className="input-field text-sm h-20 resize-none bg-white" placeholder="Short summary shown on the card..." />
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1 flex items-center gap-2"><LinkIcon size={12} /> Link (button destination)</label>
                                                <input value={activeItem.link || ''} onChange={e => updateItem(activeBlock.id, activeItem.id, { link: e.target.value })} className="input-field font-mono text-xs bg-white" placeholder="/page or https://..." />
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Button text (for this card)</label>
                                                <input value={activeItem.buttonLabel ?? ''} onChange={e => updateItem(activeBlock.id, activeItem.id, { buttonLabel: e.target.value })} className="input-field text-sm bg-white text-gray-900" placeholder="e.g. Read more" />
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Image</label>
                                                <div className="rounded-lg overflow-hidden border bg-white p-2 max-w-[280px]">
                                                    <ImageUpload
                                                        value={activeItem.image}
                                                        onChange={val => updateItem(activeBlock.id, activeItem.id, { image: val })}
                                                        aspectRatio="16/10"
                                                        maxSizeMB={2}
                                                        maxWidth={900}
                                                    />
                                                </div>
                                            </div>
                                            <div className="md:col-span-2 flex items-center justify-between gap-4">
                                                <button
                                                    type="button"
                                                    onClick={() => updateItem(activeBlock.id, activeItem.id, { published: !activeItem.published })}
                                                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-bold ${activeItem.published ? 'bg-green-50 border-green-200 text-green-700' : 'bg-gray-100 border-gray-200 text-gray-500'}`}
                                                >
                                                    {activeItem.published ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                                                    {activeItem.published ? 'Published' : 'Hidden'}
                                                </button>
                                                <button onClick={() => { removeItem(activeBlock.id, activeItem.id); setActiveItemId(null); }} className="text-red-600 bg-red-50 px-3 py-2 rounded-lg hover:bg-red-100 text-xs font-bold border border-red-100 flex items-center gap-2">
                                                    <Trash2 size={14} /> Delete item
                                                </button>
                                            </div>

                                            {/* Font (this card) – card title, summary, button */}
                                            <div className="md:col-span-2 border-t border-gray-200 pt-4 mt-2">
                                                <h5 className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-3">Font (this card)</h5>
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    <div className="p-3 bg-white rounded-lg border border-gray-100">
                                                        <span className="text-xs font-bold text-gray-500 uppercase block mb-2">Card title</span>
                                                        <div className="space-y-2">
                                                            <div><label className="text-[10px] text-gray-400">Font family</label><input value={activeItem.styles?.itemTitleFontFamily ?? ''} onChange={e => updateItem(activeBlock.id, activeItem.id, { styles: { ...(activeItem.styles || {}), itemTitleFontFamily: e.target.value } })} className="input-field text-xs bg-white" placeholder="var(--font-heading)" /></div>
                                                            <div><label className="text-[10px] text-gray-400">Font size</label><input value={activeItem.styles?.itemTitleFontSize ?? ''} onChange={e => updateItem(activeBlock.id, activeItem.id, { styles: { ...(activeItem.styles || {}), itemTitleFontSize: e.target.value } })} className="input-field text-xs bg-white" placeholder="1.2rem" /></div>
                                                            <div><label className="text-[10px] text-gray-400">Font weight</label><select value={activeItem.styles?.itemTitleFontWeight ?? '900'} onChange={e => updateItem(activeBlock.id, activeItem.id, { styles: { ...(activeItem.styles || {}), itemTitleFontWeight: e.target.value } })} className="input-field text-xs w-full bg-white"><option value="400">400</option><option value="600">600</option><option value="700">700</option><option value="800">800</option><option value="900">900</option></select></div>
                                                            <div className="flex items-center gap-2"><label className="text-[10px] text-gray-400">Color</label><input type="color" value={activeItem.styles?.itemTitleColor ?? '#1A365D'} onChange={e => updateItem(activeBlock.id, activeItem.id, { styles: { ...(activeItem.styles || {}), itemTitleColor: e.target.value } })} className="w-8 h-8 rounded border cursor-pointer" /><input type="text" value={activeItem.styles?.itemTitleColor ?? ''} onChange={e => updateItem(activeBlock.id, activeItem.id, { styles: { ...(activeItem.styles || {}), itemTitleColor: e.target.value } })} className="input-field text-xs flex-1 bg-white" /></div>
                                                        </div>
                                                    </div>
                                                    <div className="p-3 bg-white rounded-lg border border-gray-100">
                                                        <span className="text-xs font-bold text-gray-500 uppercase block mb-2">Card summary / excerpt</span>
                                                        <div className="space-y-2">
                                                            <div><label className="text-[10px] text-gray-400">Font family</label><input value={activeItem.styles?.itemExcerptFontFamily ?? ''} onChange={e => updateItem(activeBlock.id, activeItem.id, { styles: { ...(activeItem.styles || {}), itemExcerptFontFamily: e.target.value } })} className="input-field text-xs bg-white" placeholder="var(--font-main)" /></div>
                                                            <div><label className="text-[10px] text-gray-400">Font size</label><input value={activeItem.styles?.itemExcerptFontSize ?? ''} onChange={e => updateItem(activeBlock.id, activeItem.id, { styles: { ...(activeItem.styles || {}), itemExcerptFontSize: e.target.value } })} className="input-field text-xs bg-white" placeholder="0.95rem" /></div>
                                                            <div className="flex items-center gap-2"><label className="text-[10px] text-gray-400">Color</label><input type="color" value={activeItem.styles?.itemExcerptColor ?? '#4A5568'} onChange={e => updateItem(activeBlock.id, activeItem.id, { styles: { ...(activeItem.styles || {}), itemExcerptColor: e.target.value } })} className="w-8 h-8 rounded border cursor-pointer" /><input type="text" value={activeItem.styles?.itemExcerptColor ?? ''} onChange={e => updateItem(activeBlock.id, activeItem.id, { styles: { ...(activeItem.styles || {}), itemExcerptColor: e.target.value } })} className="input-field text-xs flex-1 bg-white" /></div>
                                                        </div>
                                                    </div>
                                                    <div className="p-3 bg-white rounded-lg border border-gray-100">
                                                        <span className="text-xs font-bold text-gray-500 uppercase block mb-1">Card button (rectangle)</span>
                                                        <div className="space-y-2">
                                                            <div><label className="text-[10px] text-gray-400">Button text</label><input value={activeItem.styles?.itemButtonLabel ?? ''} onChange={e => updateItem(activeBlock.id, activeItem.id, { styles: { ...(activeItem.styles || {}), itemButtonLabel: e.target.value } })} className="input-field text-xs bg-white text-gray-900" placeholder="e.g. Read more" /></div>
                                                            <div><label className="text-[10px] text-gray-400">Font family</label><input value={activeItem.styles?.itemBtnFontFamily ?? ''} onChange={e => updateItem(activeBlock.id, activeItem.id, { styles: { ...(activeItem.styles || {}), itemBtnFontFamily: e.target.value } })} className="input-field text-xs bg-white" placeholder="var(--font-heading)" /></div>
                                                            <div><label className="text-[10px] text-gray-400">Font size</label><input value={activeItem.styles?.itemBtnFontSize ?? ''} onChange={e => updateItem(activeBlock.id, activeItem.id, { styles: { ...(activeItem.styles || {}), itemBtnFontSize: e.target.value } })} className="input-field text-xs bg-white" placeholder="0.9rem" /></div>
                                                            <div><label className="text-[10px] text-gray-400">Font weight</label><select value={activeItem.styles?.itemBtnFontWeight ?? '800'} onChange={e => updateItem(activeBlock.id, activeItem.id, { styles: { ...(activeItem.styles || {}), itemBtnFontWeight: e.target.value } })} className="input-field text-xs w-full bg-white"><option value="400">400</option><option value="600">600</option><option value="700">700</option><option value="800">800</option></select></div>
                                                            <div className="flex items-center gap-2"><label className="text-[10px] text-gray-400">Text color</label><input type="color" value={activeItem.styles?.itemBtnColor ?? '#FFFFFF'} onChange={e => updateItem(activeBlock.id, activeItem.id, { styles: { ...(activeItem.styles || {}), itemBtnColor: e.target.value } })} className="w-8 h-8 rounded border cursor-pointer" /><input type="text" value={activeItem.styles?.itemBtnColor ?? ''} onChange={e => updateItem(activeBlock.id, activeItem.id, { styles: { ...(activeItem.styles || {}), itemBtnColor: e.target.value } })} className="input-field text-xs flex-1 bg-white" /></div>
                                                            <div className="flex items-center gap-2"><label className="text-[10px] text-gray-400">BG color</label><input type="color" value={activeItem.styles?.itemBtnBgColor ?? '#1A365D'} onChange={e => updateItem(activeBlock.id, activeItem.id, { styles: { ...(activeItem.styles || {}), itemBtnBgColor: e.target.value } })} className="w-8 h-8 rounded border cursor-pointer" /><input type="text" value={activeItem.styles?.itemBtnBgColor ?? ''} onChange={e => updateItem(activeBlock.id, activeItem.id, { styles: { ...(activeItem.styles || {}), itemBtnBgColor: e.target.value } })} className="input-field text-xs flex-1 bg-white" /></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </DragDropContext>
        </div>
    );
};

export default NewsManager;
