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
        subtitle: 'Articles, announcements, and upcoming events—managed from the admin panel and synced to the client site.'
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

    useEffect(() => {
        if (!content || loading) return;
        if (content.hero) setHero(content.hero);
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
                    published: it.published !== false
                })) : []
            }));
            setBlocks(sanitized);
            setActiveBlockId(prev => sanitized.find(b => b.id === prev)?.id || sanitized[0]?.id || null);
        }
    }, [content, loading]);

    const activeBlock = useMemo(() => blocks.find(b => b.id === activeBlockId), [blocks, activeBlockId]);

    useEffect(() => {
        if (!activeBlockId && blocks.length > 0) setActiveBlockId(blocks[0].id);
    }, [blocks, activeBlockId]);

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
            published: true
        };
        setBlocks(prev => prev.map(b => (b.id === blockId ? { ...b, items: [...(b.items || []), item] } : b)));
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
                        <input value={hero.title || ''} onChange={(e) => setHero({ ...hero, title: e.target.value })} className="input-field" />
                    </div>
                    <div>
                        <label className="label">Subtitle</label>
                        <input value={hero.subtitle || ''} onChange={(e) => setHero({ ...hero, subtitle: e.target.value })} className="input-field" />
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
                                {/* Block meta */}
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

                                {/* Items */}
                                <div className="flex items-center justify-between">
                                    <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Items (News / Events)</h4>
                                    <button onClick={() => addItem(activeBlock.id)} className="text-xs flex items-center gap-1 text-blue-600 bg-blue-50 px-3 py-2 rounded-lg hover:bg-blue-100 font-bold border border-blue-100">
                                        <Plus size={14} /> Add Item
                                    </button>
                                </div>

                                <Droppable droppableId="items">
                                    {(provided) => (
                                        <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-3">
                                            {(activeBlock.items || []).map((it, idx) => (
                                                <Draggable key={it.id} draggableId={it.id} index={idx}>
                                                    {(prov, snap) => (
                                                        <div
                                                            ref={prov.innerRef}
                                                            {...prov.draggableProps}
                                                            className={`bg-white rounded-xl border border-gray-200 p-4 ${snap.isDragging ? 'shadow-lg ring-2 ring-blue-300' : 'shadow-sm'}`}
                                                            style={prov.draggableProps.style}
                                                        >
                                                            <div className="flex items-start gap-4">
                                                                <div {...prov.dragHandleProps} className="text-gray-300 hover:text-gray-500 cursor-grab pt-2">
                                                                    <GripVertical size={16} />
                                                                </div>

                                                                <div className="w-28 shrink-0">
                                                                    <div className="rounded-lg overflow-hidden border bg-gray-50">
                                                                        <ImageUpload
                                                                            value={it.image}
                                                                            onChange={val => updateItem(activeBlock.id, it.id, { image: val })}
                                                                            aspectRatio="16/10"
                                                                            maxSizeMB={2}
                                                                            maxWidth={900}
                                                                        />
                                                                    </div>
                                                                </div>

                                                                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                                                                    <div className="md:col-span-2">
                                                                        <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Title</label>
                                                                        <input value={it.title || ''} onChange={e => updateItem(activeBlock.id, it.id, { title: e.target.value })} className="input-field font-bold" />
                                                                    </div>

                                                                    <div>
                                                                        <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Type</label>
                                                                        <select value={it.type || 'news'} onChange={e => updateItem(activeBlock.id, it.id, { type: e.target.value })} className="input-field">
                                                                            <option value="news">News</option>
                                                                            <option value="event">Event</option>
                                                                        </select>
                                                                    </div>

                                                                    <div>
                                                                        <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1 flex items-center gap-2"><Calendar size={12} /> Date</label>
                                                                        <input type="date" value={it.date || ''} onChange={e => updateItem(activeBlock.id, it.id, { date: e.target.value })} className="input-field" />
                                                                    </div>

                                                                    <div className="md:col-span-2">
                                                                        <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Excerpt / Summary</label>
                                                                        <textarea value={it.excerpt || ''} onChange={e => updateItem(activeBlock.id, it.id, { excerpt: e.target.value })} className="input-field text-sm h-20 resize-none" placeholder="Short summary shown in the magazine card..." />
                                                                    </div>

                                                                    <div className="md:col-span-2">
                                                                        <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1 flex items-center gap-2"><LinkIcon size={12} /> Link (button destination)</label>
                                                                        <input value={it.link || ''} onChange={e => updateItem(activeBlock.id, it.id, { link: e.target.value })} className="input-field font-mono text-xs" placeholder="/some-page or https://..." />
                                                                    </div>

                                                                    <div>
                                                                        <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Button Label</label>
                                                                        <input value={it.buttonLabel || ''} onChange={e => updateItem(activeBlock.id, it.id, { buttonLabel: e.target.value })} className="input-field" placeholder="Read more" />
                                                                    </div>

                                                                    <div className="flex items-end justify-between gap-3">
                                                                        <div className="flex items-center gap-2">
                                                                            <button
                                                                                type="button"
                                                                                onClick={() => updateItem(activeBlock.id, it.id, { published: !it.published })}
                                                                                className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-bold transition-all ${it.published ? 'bg-green-50 border-green-200 text-green-700' : 'bg-gray-50 border-gray-200 text-gray-500'}`}
                                                                                title="Toggle published"
                                                                            >
                                                                                {it.published ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                                                                                {it.published ? 'Published' : 'Hidden'}
                                                                            </button>
                                                                            <span className="text-[10px] text-gray-400 flex items-center gap-1"><ImageIcon size={12} /> Image optional</span>
                                                                        </div>

                                                                        <button onClick={() => removeItem(activeBlock.id, it.id)} className="text-red-600 bg-red-50 px-3 py-2 rounded-lg hover:bg-red-100 text-xs font-bold border border-red-100 flex items-center gap-2">
                                                                            <Trash2 size={14} /> Delete
                                                                        </button>
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

                                {(activeBlock.items || []).length === 0 && (
                                    <div className="text-center p-8 bg-gray-50 border border-dashed border-gray-200 rounded-xl text-gray-400 text-sm">
                                        No items yet. Click “Add Item” to create your first news/event card.
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
