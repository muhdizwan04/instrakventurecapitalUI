import React, { useState, useMemo, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, ArrowLeft, Save, Calendar, Image as ImageIcon, Loader2, GripVertical } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import toast from 'react-hot-toast';
import { useContent } from '../hooks/useContent';
import ImageUpload from '../components/ImageUpload';

const NewsManager = () => {
    const [view, setView] = useState('list');
    const [editingNews, setEditingNews] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    const defaultData = {
        pageHeader: { title: 'Latest News', subtitle: 'Keeping stakeholders informed on milestones, partnerships, and industrial growth.' },
        articles: [
            { id: 1, title: 'Instrak Expands to Vietnam', date: '2024-03-15', category: 'Expansion', summary: 'Strategic partnership signed with leading automated manufacturing firms.' },
            { id: 2, title: 'Annual General Meeting 2024', date: '2024-02-28', category: 'Corporate', summary: 'Board declares record dividends for shareholders.' },
        ]
    };

    const { content, loading, saving, saveContent } = useContent('news', defaultData);
    const [pageHeader, setPageHeader] = useState(defaultData.pageHeader);
    const [news, setNews] = useState(defaultData.articles);

    useEffect(() => {
        if (content && !loading) {
            if (content.pageHeader) setPageHeader(content.pageHeader);
            if (content.articles) setNews(content.articles);
        }
    }, [content, loading]);

    const filteredNews = useMemo(() => {
        return news.filter(item =>
            item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.summary.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [news, searchQuery]);

    const handleEdit = (item) => {
        setEditingNews(item);
        setView('edit');
    };

    const handleCreate = () => {
        setEditingNews({ id: Date.now(), title: '', date: new Date().toISOString().split('T')[0], category: 'General', summary: '' });
        setView('edit');
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this article?')) {
            const updatedNews = news.filter(n => n.id !== id);
            setNews(updatedNews);
            await saveContent({ pageHeader, articles: updatedNews });
            toast.success('Article deleted and saved!');
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (editingNews) {
            let updatedNews;
            const existing = news.find(n => n.id === editingNews.id);
            if (existing) {
                updatedNews = news.map(n => n.id === editingNews.id ? editingNews : n);
            } else {
                updatedNews = [...news, editingNews];
            }
            setNews(updatedNews);
            await saveContent({ pageHeader, articles: updatedNews });
            setView('list');
        }
    };

    const handleSaveAll = async () => {
        await saveContent({ pageHeader, articles: news });
    };

    const handleDragEnd = (result) => {
        if (!result.destination) return;
        const items = Array.from(news);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        setNews(items);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-heading text-[var(--accent-primary)] mb-2">News Manager</h1>
                    <p className="text-[var(--text-secondary)]">Publish latest news and press releases.</p>
                </div>
                <div className="flex gap-3">
                    {view === 'list' && (
                        <>
                            <button
                                onClick={handleSaveAll}
                                disabled={saving}
                                className="flex items-center gap-2 px-4 py-2 bg-[var(--accent-primary)] text-white rounded-lg hover:bg-[#08304e] transition-colors shadow-md disabled:opacity-50"
                            >
                                {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                                <span>{saving ? 'Saving...' : 'Save All'}</span>
                            </button>
                            <button
                                onClick={handleCreate}
                                className="flex items-center gap-2 px-4 py-2 border border-[var(--accent-primary)] text-[var(--accent-primary)] rounded-lg hover:bg-blue-50 transition-colors"
                            >
                                <Plus size={18} />
                                <span>New Article</span>
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Page Header Section */}
            {view === 'list' && (
                <div className="glass-card p-6 border-l-4 border-l-purple-600">
                    <h3 className="font-bold text-[var(--accent-primary)] mb-4">Page Header Settings</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">Page Title</label>
                            <input
                                type="text"
                                value={pageHeader.title}
                                onChange={(e) => setPageHeader({ ...pageHeader, title: e.target.value })}
                                className="w-full px-3 py-2 rounded border border-[var(--border-light)] focus:border-[var(--accent-primary)] outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">Subtitle</label>
                            <input
                                type="text"
                                value={pageHeader.subtitle}
                                onChange={(e) => setPageHeader({ ...pageHeader, subtitle: e.target.value })}
                                className="w-full px-3 py-2 rounded border border-[var(--border-light)] focus:border-[var(--accent-primary)] outline-none"
                            />
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Articles List */}
                <div className="lg:col-span-2">

                    {view === 'list' ? (
                        <div className="glass-card p-0 overflow-hidden">
                            <div className="p-4 border-b border-[var(--border-light)] bg-[var(--bg-tertiary)] bg-opacity-30 flex items-center gap-4">
                                <Search className="text-[var(--text-muted)]" size={18} />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search news by title or category..."
                                    className="bg-transparent outline-none w-full text-[var(--text-primary)]"
                                />
                            </div>
                            <div className="divide-y divide-[var(--border-light)]">
                                {filteredNews.length === 0 ? (
                                    <div className="p-8 text-center text-[var(--text-muted)]">No articles found.</div>
                                ) : (
                                    <DragDropContext onDragEnd={handleDragEnd}>
                                        <Droppable droppableId="articles">
                                            {(provided) => (
                                                <div {...provided.droppableProps} ref={provided.innerRef}>
                                                    {filteredNews.map((item, index) => (
                                                        <Draggable key={item.id} draggableId={item.id.toString()} index={index} isDragDisabled={searchQuery !== ''}>
                                                            {(provided, snapshot) => (
                                                                <div
                                                                    ref={provided.innerRef}
                                                                    {...provided.draggableProps}
                                                                    className={`p-6 flex items-center justify-between transition-colors group ${snapshot.isDragging ? 'bg-blue-50 shadow-lg z-10' : 'hover:bg-[var(--bg-secondary)]'}`}
                                                                >
                                                                    <div className="flex gap-4 items-center">
                                                                        <div {...provided.dragHandleProps} className="text-gray-400 hover:text-gray-600 cursor-grab p-1">
                                                                            <GripVertical size={20} />
                                                                        </div>
                                                                        <div className="w-16 h-16 bg-[var(--bg-tertiary)] rounded-lg flex items-center justify-center text-[var(--text-muted)]">
                                                                            {item.image ? <img src={item.image} alt="" className="w-full h-full object-cover rounded-lg" /> : <ImageIcon size={24} />}
                                                                        </div>
                                                                        <div>
                                                                            <h3 className="font-bold text-[var(--text-primary)] text-lg mb-1">{item.title}</h3>
                                                                            <div className="flex gap-3 text-sm text-[var(--text-muted)]">
                                                                                <span className="flex items-center gap-1"><Calendar size={14} /> {item.date}</span>
                                                                                <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-xs font-bold uppercase">{item.category}</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                        <button onClick={() => handleEdit(item)} className="p-2 text-[var(--text-secondary)] hover:text-[var(--accent-primary)] hover:bg-blue-50 rounded-lg"><Edit2 size={18} /></button>
                                                                        <button onClick={() => handleDelete(item.id)} className="p-2 text-[var(--text-secondary)] hover:text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={18} /></button>
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
                    ) : (
                        <div className="max-w-4xl mx-auto glass-card p-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
                            <button onClick={() => setView('list')} className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--accent-primary)] mb-6">
                                <ArrowLeft size={18} /> Back
                            </button>
                            <h2 className="text-2xl font-bold mb-6">Edit Article</h2>
                            <form onSubmit={handleSave} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="md:col-span-2 space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Headline</label>
                                            <input type="text" required value={editingNews.title} onChange={e => setEditingNews({ ...editingNews, title: e.target.value })} className="w-full px-4 py-3 rounded-lg border border-[var(--border-light)] outline-none focus:ring-2 focus:ring-[var(--accent-primary)]" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Content</label>
                                            <textarea rows={10} value={editingNews.summary} onChange={e => setEditingNews({ ...editingNews, summary: e.target.value })} className="w-full px-4 py-3 rounded-lg border border-[var(--border-light)] outline-none focus:ring-2 focus:ring-[var(--accent-primary)]" />
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Publish Date</label>
                                            <input type="date" value={editingNews.date} onChange={e => setEditingNews({ ...editingNews, date: e.target.value })} className="w-full px-4 py-3 rounded-lg border border-[var(--border-light)] outline-none focus:ring-2 focus:ring-[var(--accent-primary)]" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Category</label>
                                            <input type="text" value={editingNews.category} onChange={e => setEditingNews({ ...editingNews, category: e.target.value })} className="w-full px-4 py-3 rounded-lg border border-[var(--border-light)] outline-none focus:ring-2 focus:ring-[var(--accent-primary)]" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Feature Image</label>
                                            <ImageUpload
                                                value={editingNews.image || ''}
                                                onChange={(url) => setEditingNews({ ...editingNews, image: url })}
                                                folder="news"
                                                aspectRatio="16/9"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-end gap-3 pt-4 border-t border-[var(--border-light)]">
                                    <button type="submit" className="px-6 py-2 bg-[var(--accent-primary)] text-white rounded-lg hover:bg-[#08304e] shadow-md flex items-center gap-2"><Save size={18} /> Push to Live</button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>

                {/* Right Column - Live Preview */}
                {view === 'list' && (
                    <div className="glass-card p-0 overflow-hidden sticky top-6 max-h-[calc(100vh-180px)] overflow-y-auto">
                        <div className="bg-gray-100 border-b p-2 text-center text-xs font-bold text-gray-400 uppercase tracking-widest">Live Preview</div>

                        <div className="bg-[#F5F7FA] py-6 px-4 text-center border-b-4 border-[#B8860B]">
                            <h3 className="text-lg font-bold mb-1 font-heading text-[#1A365D]">{pageHeader.title}</h3>
                            <p className="text-xs text-gray-600">{pageHeader.subtitle}</p>
                        </div>

                        <div className="p-4 space-y-3 bg-white">
                            {news.slice(0, 3).map((article, i) => (
                                <div key={i} className="bg-[#F5F7FA] rounded-lg p-3">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Calendar size={12} className="text-[#B8860B]" />
                                        <span className="text-[10px] text-gray-500">{article.date}</span>
                                        <span className="ml-auto px-2 py-0.5 bg-[#1A365D] text-white rounded text-[8px] uppercase">{article.category}</span>
                                    </div>
                                    <h4 className="text-sm font-bold text-[#1A365D] mb-1">{article.title}</h4>
                                    <p className="text-[10px] text-gray-600 line-clamp-2">{article.summary}</p>
                                </div>
                            ))}
                            {news.length > 3 && (
                                <p className="text-center text-xs text-gray-400">+{news.length - 3} more articles</p>
                            )}
                            {news.length === 0 && (
                                <p className="text-center text-xs text-gray-400 py-4">No articles yet</p>
                            )}
                        </div>

                        <p className="text-[10px] text-center text-gray-400 p-3 bg-gray-50">
                            Changes sync to client after saving
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NewsManager;
