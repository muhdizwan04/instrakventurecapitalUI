import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Loader2, GripVertical, Target, Users, Handshake, Edit, Building2, LayoutTemplate, Star, Lightbulb, Award, Eye, Scale, ChevronDown, ChevronUp, Palette, Type, AlignLeft, AlignCenter, AlignRight, Bold, Italic, Underline, Minus, AArrowUp, Globe, Shield, FileText, UserCheck, Briefcase, MessageSquare, X, Columns, List, Grid3X3, Image, LayoutGrid } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import toast from 'react-hot-toast';
import { useContent } from '../hooks/useContent';
import IconPicker from '../components/IconPicker';
import ImageUpload from '../components/ImageUpload';

// ──────────────────────────────────────────────
// DEFAULT DATA — All user-provided content
// ──────────────────────────────────────────────
const ALL_SECTIONS = [
    {
        id: 'hero', type: 'hero',
        title: 'About Instrak Venture Capital',
        subtitle: 'A global asset and capital management institution specializing in disciplined portfolio mandates, cross-border wealth structuring, and institutional capital strategies.',
        styles: { bgColor: '#FFFFFF', textColor: '#1A365D', textAlign: 'center' }
    },
    {
        id: 'identity', type: 'custom',
        title: 'Our Identity',
        subtitle: '',
        content: 'Instrak Venture Capital Berhad (IVC) is a global asset and capital management institution specializing in disciplined portfolio mandates, cross-border wealth structuring, and institutional capital strategies.\n\nOperating across Asia, the Middle East, Europe, and the United States, IVC serves a select group of institutional investors, corporations, family offices, and ultra-high-net-worth individuals.\n\nWe do not operate as a retail investment platform.\nWe operate as a mandate-driven capital institution.',
        items: [],
        styles: { layoutType: 'standard', bgColor: '#FFFFFF', textColor: '#1A365D', textAlign: 'center' }
    },
    {
        id: 'mission', type: 'mission',
        title: 'Our Mission & Vision',
        missionTitle: 'Our Mission',
        missionText: 'To structure, protect, and grow global capital through disciplined asset management, transparent governance, and long-term institutional relationships.',
        visionTitle: 'Our Vision',
        visionText: 'To become a globally respected asset and capital management institution bridging strategic financial corridors between Asia, the Middle East, and major global markets.',
        values: [
            { id: 'val-1', title: 'Governance', text: 'Every mandate is structured under defined legal, financial, and risk oversight frameworks.', icon: 'ShieldCheck' },
            { id: 'val-2', title: 'Transparency', text: 'Investors receive clear reporting, structured fee models, and visibility into portfolio allocation.', icon: 'Eye' },
            { id: 'val-3', title: 'Integrity', text: 'We accept engagements selectively, prioritizing long-term institutional relationships over short-term transactions.', icon: 'Scale' }
        ],
        styles: { bgColor: '#FFFFFF', textColor: '#1A365D', textAlign: 'left' }
    },
    {
        id: 'philosophy', type: 'custom',
        title: 'Our Philosophy',
        subtitle: 'At IVC, capital is not treated as a speculative instrument. It is treated as a long-term responsibility.',
        items: [
            { id: 'phil-1', title: 'Governance', description: 'Every mandate is structured under defined legal, financial, and risk oversight frameworks.', icon: 'Shield' },
            { id: 'phil-2', title: 'Transparency', description: 'Investors receive clear reporting, structured fee models, and visibility into portfolio allocation.', icon: 'Eye' },
            { id: 'phil-3', title: 'Integrity', description: 'We accept engagements selectively, prioritizing long-term institutional relationships over short-term transactions.', icon: 'Scale' }
        ],
        styles: { layoutType: 'cards', bgColor: '#F8FAFC', textColor: '#1A365D', textAlign: 'center' }
    },
    {
        id: 'board', type: 'board',
        title: 'Board of Directors',
        subtitle: 'Guided by seasoned leaders with a commitment to integrity, compliance, and industrial excellence.',
        styles: { bgColor: '#F8FAFC', textColor: '#1A365D', textAlign: 'center' }
    },
    {
        id: 'operating-model', type: 'custom',
        title: 'Our Operating Model',
        subtitle: 'IVC functions through a mandate-based engagement structure. Each client relationship is:',
        content: 'This approach ensures discipline, confidentiality, and long-term capital alignment.',
        items: [
            { id: 'op-1', title: 'Evaluated internally', icon: 'CheckCircle' },
            { id: 'op-2', title: 'Structurally designed', icon: 'CheckCircle' },
            { id: 'op-3', title: 'Risk-assessed', icon: 'CheckCircle' },
            { id: 'op-4', title: 'Legally documented', icon: 'CheckCircle' },
            { id: 'op-5', title: 'Monitored through institutional reporting protocols', icon: 'CheckCircle' }
        ],
        styles: { layoutType: 'boxed-group', bgColor: '#FFFFFF', textColor: '#1A365D', textAlign: 'left', groupTitle: 'OPERATIONAL PROTOCOLS' }
    },
    {
        id: 'capital-corridor', type: 'custom',
        title: 'Our Global Capital Corridor',
        subtitle: 'IVC specializes in cross-border capital structuring across key financial regions:',
        items: [
            { id: 'cap-1', title: 'Asia', description: 'Regional growth hub', icon: 'Globe' },
            { id: 'cap-2', title: 'Middle East', description: 'Strategic capital hub', icon: 'Globe' },
            { id: 'cap-3', title: 'Europe', description: 'Institutional investment hub', icon: 'Globe' },
            { id: 'cap-4', title: 'United States', description: 'Global financial hub', icon: 'Globe' }
        ],
        styles: { layoutType: 'grid', bgColor: '#F8FAFC', textColor: '#1A365D', textAlign: 'center' }
    },
    {
        id: 'who-we-serve', type: 'custom',
        title: 'Who We Serve',
        subtitle: 'IVC works with a select group of global clients. Engagement is subject to internal governance review.',
        items: [
            { id: 'serve-1', title: 'Institutional investors', icon: 'Building2' },
            { id: 'serve-2', title: 'Family offices', icon: 'Users' },
            { id: 'serve-3', title: 'Publicly listed corporations', icon: 'Briefcase' },
            { id: 'serve-4', title: 'Strategic investment groups', icon: 'Target' },
            { id: 'serve-5', title: 'Ultra-high-net-worth individuals', icon: 'UserCheck' },
            { id: 'serve-6', title: 'Sovereign-linked entities', icon: 'Shield' }
        ],
        styles: { layoutType: 'icon-group', bgColor: '#FFFFFF', textColor: '#1A365D', textAlign: 'center' }
    },
    {
        id: 'core-pillars', type: 'custom',
        title: 'Core Business Pillars',
        subtitle: '',
        items: [
            { id: 'pillar-1', title: 'Asset Management', description: 'Institutional portfolio mandates focused on capital preservation, structured yield, and alternative asset allocation.', icon: 'Briefcase' },
            { id: 'pillar-2', title: 'Private Wealth & Family Office', description: 'Cross-border wealth structuring for ultra-high-net-worth individuals and multi-generational families.', icon: 'Users' },
            { id: 'pillar-3', title: 'Institutional Capital Solutions', description: 'Structured financing and capital market strategies supporting corporate growth and asset-backed investments.', icon: 'Building2' }
        ],
        styles: { layoutType: 'cards', bgColor: '#F8FAFC', textColor: '#1A365D', textAlign: 'center' }
    },
    {
        id: 'governance-framework', type: 'custom',
        title: 'Our Governance Framework',
        subtitle: 'IVC operates under institutional-grade governance principles.',
        items: [
            { id: 'gov-1', title: 'Risk Oversight', description: 'Structured portfolio allocation models, exposure limits, counterparty evaluation, periodic mandate review.', icon: 'Shield' },
            { id: 'gov-2', title: 'Legal Structuring', description: 'Institutional-grade documentation, cross-border compliance alignment, mandate-based engagement protocols.', icon: 'FileText' },
            { id: 'gov-3', title: 'Reporting Discipline', description: 'Periodic portfolio reporting, asset allocation transparency, risk exposure summaries.', icon: 'Eye' }
        ],
        styles: { layoutType: 'grid', bgColor: '#FFFFFF', textColor: '#1A365D', textAlign: 'left' }
    },
    {
        id: 'leadership-message', type: 'custom',
        title: 'Leadership Message',
        subtitle: 'From the Office of the Group CEO',
        content: 'Instrak Venture Capital Berhad was established with a singular objective: to build a disciplined capital institution that bridges strategic financial corridors across the world.\n\nIn a global environment where capital often moves faster than governance, we believe discipline, transparency, and integrity are the true foundations of sustainable wealth.\n\nOur approach is simple: We do not chase transactions.\nWe structure mandates.\nWe build long-term capital partnerships.',
        items: [],
        styles: { layoutType: 'standard', bgColor: '#0A2540', textColor: '#FFFFFF', textAlign: 'center' }
    },
    {
        id: 'institutional-conduct', type: 'custom',
        title: 'Institutional Conduct',
        subtitle: 'IVC maintains a selective engagement policy. We do not operate on transaction volume. We operate on mandate integrity.',
        items: [
            { id: 'conduct-1', title: 'Confidential', icon: 'Shield' },
            { id: 'conduct-2', title: 'Governance-reviewed', icon: 'ShieldCheck' },
            { id: 'conduct-3', title: 'Structurally designed', icon: 'Target' },
            { id: 'conduct-4', title: 'Institutionally documented', icon: 'FileText' }
        ],
        content: 'Each engagement is:',
        styles: { layoutType: 'list', bgColor: '#F8FAFC', textColor: '#1A365D', textAlign: 'left' }
    },
    { id: 'milestone', type: 'milestone', title: 'Investment Milestone', styles: { bgColor: '#0A2540', textColor: '#FFFFFF', textAlign: 'center' } },
    { id: 'partners', type: 'partners', title: 'Strategic Partners', subtitle: 'Collaborating with world-class institutions.', styles: { bgColor: '#FFFFFF', textColor: '#1A365D', textAlign: 'center' } },
    {
        id: 'closing', type: 'custom',
        title: 'Closing Statement',
        subtitle: '',
        content: 'IVC exists to serve capital with responsibility.\n\nWe structure wealth with discipline.\nWe govern capital with transparency.\nWe grow institutions with integrity.',
        items: [],
        styles: { layoutType: 'standard', bgColor: '#0A2540', textColor: '#FFFFFF', textAlign: 'center' }
    }
];

const DEFAULT_BOARD = {
    directors: [
        { id: 'dir-1', name: 'KAHAR KAMARUDIN, ANS', role: 'GROUP CHIEF EXECUTIVE OFFICER (GCEO)', image: '', bio: '' },
        { id: 'dir-2', name: 'PROF IR. DR. NORIDAH', role: 'NON-EXECUTIVE DIRECTOR', image: '', bio: '' },
        { id: 'dir-3', name: "RAFI YA'ACOB", role: 'CHIEF OPERATING OFFICER (COO)', image: '', bio: '' },
        { id: 'dir-4', name: 'ZALIZA YAHYA, CPA', role: 'CHIEF FINANCIAL OFFICER (CFO)', image: '', bio: '' },
        { id: 'dir-5', name: 'NORZALIZA ABD GHAFAR', role: 'GENERAL MANAGER', image: '', bio: '' },
        { id: 'dir-6', name: 'NORLI HIDAYATUL AINI', role: 'GENERAL MANAGER', image: '', bio: '' },
        { id: 'dir-7', name: 'DR. SUHAILY SHAHIMI', role: 'INTERNAL AUDITOR', image: '', bio: '' },
    ],
    styleColors: { nameColor: '', roleColor: '', bioColor: '', cardStyle: 'glass', cardColor: '#FFFFFF' }
};

const DEFAULT_PARTNERS = {
    partners: [{
        id: 'p-1', name: 'Chubb International Insurance', category: 'Insurance Partner',
        description: 'Global insurance coverage for fund protection and trade credit insurance.',
        partnership: 'Protection of funds through comprehensive insurance policies',
        logo: 'https://companieslogo.com/img/orig/CB-90768b55.png?t=1632720960'
    }],
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

// ──────────────────────────────────────────────
// LAYOUT OPTIONS (only what the client already supports)
// ──────────────────────────────────────────────
const LAYOUT_OPTIONS = [
    { value: 'standard', label: 'Standard Text' },
    { value: 'mission-card', label: 'Mission-style Card (glass card like Our Mission & Vision)' },
    { value: 'list', label: 'Professional List' },
    { value: 'grid', label: 'Feature Grid' },
    { value: 'cards', label: 'Interactive Cards' },
    { value: 'accordion', label: 'Accordion' },
    { value: 'boxed-group', label: 'Command Box' },
    { value: 'mind-map', label: 'Mind Map' },
    { value: 'icon-group', label: 'Icon Group' },
    { value: 'image-grid', label: 'Image Grid' },
    { value: 'profile-cards', label: 'Profile Cards' },
    { value: 'statement-block', label: 'Statement Block' },
];

// ──────────────────────────────────────────────
// INLINE STYLE CONTROLS (embedded in each editor)
// ──────────────────────────────────────────────
const InlineStyleControls = ({ styles = {}, onUpdate }) => {
    const [showGradient, setShowGradient] = useState(styles.bgGradient ? true : false);

    const update = (field, value) => onUpdate({ ...styles, [field]: value });

    return (
        <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
                <Palette size={14} /> Appearance
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {/* Background */}
                <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Background</label>
                    <div className="flex items-center gap-2">
                        <input type="color" value={styles.bgColor || '#FFFFFF'} onChange={e => update('bgColor', e.target.value)} className="w-8 h-8 rounded border cursor-pointer" />
                        <input type="text" value={styles.bgColor || '#FFFFFF'} onChange={e => update('bgColor', e.target.value)} className="input-field text-[10px] font-mono flex-1 py-1" />
                    </div>
                    <button onClick={() => setShowGradient(!showGradient)} className="text-[10px] text-blue-500 mt-1 hover:underline">
                        {showGradient ? 'Hide gradient' : '+ Gradient'}
                    </button>
                </div>

                {/* Gradient end color */}
                {showGradient && (
                    <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Gradient To</label>
                        <div className="flex items-center gap-2">
                            <input type="color" value={styles.bgGradient || '#1A365D'} onChange={e => update('bgGradient', e.target.value)} className="w-8 h-8 rounded border cursor-pointer" />
                            <input type="text" value={styles.bgGradient || '#1A365D'} onChange={e => update('bgGradient', e.target.value)} className="input-field text-[10px] font-mono flex-1 py-1" />
                        </div>
                    </div>
                )}

                {/* Title Color */}
                <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Title Color</label>
                    <div className="flex items-center gap-2">
                        <input type="color" value={styles.titleColor || '#1A365D'} onChange={e => update('titleColor', e.target.value)} className="w-8 h-8 rounded border cursor-pointer" />
                        <input type="text" value={styles.titleColor || '#1A365D'} onChange={e => update('titleColor', e.target.value)} className="input-field text-[10px] font-mono flex-1 py-1" />
                    </div>
                </div>

                {/* Text Color */}
                <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Text Color</label>
                    <div className="flex items-center gap-2">
                        <input type="color" value={styles.textColor || '#64748B'} onChange={e => update('textColor', e.target.value)} className="w-8 h-8 rounded border cursor-pointer" />
                        <input type="text" value={styles.textColor || '#64748B'} onChange={e => update('textColor', e.target.value)} className="input-field text-[10px] font-mono flex-1 py-1" />
                    </div>
                </div>

                {/* Item Title Color */}
                <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Item Title Color</label>
                    <div className="flex items-center gap-2">
                        <input type="color" value={styles.itemTitleColor || '#1A365D'} onChange={e => update('itemTitleColor', e.target.value)} className="w-8 h-8 rounded border cursor-pointer" />
                        <input type="text" value={styles.itemTitleColor || '#1A365D'} onChange={e => update('itemTitleColor', e.target.value)} className="input-field text-[10px] font-mono flex-1 py-1" />
                    </div>
                </div>

                {/* Icon Color */}
                <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Icon Color</label>
                    <div className="flex items-center gap-2">
                        <input type="color" value={styles.iconColor || '#C9A227'} onChange={e => update('iconColor', e.target.value)} className="w-8 h-8 rounded border cursor-pointer" />
                        <input type="text" value={styles.iconColor || '#C9A227'} onChange={e => update('iconColor', e.target.value)} className="input-field text-[10px] font-mono flex-1 py-1" placeholder="#C9A227" />
                    </div>
                    <p className="text-[10px] text-gray-400 mt-0.5">Applied to icons in this section.</p>
                </div>

                {/* Card/box style — glass or solid */}
                <div className="col-span-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Card / box style</label>
                    <div className="flex gap-2 mb-1.5">
                        <button type="button" onClick={() => update('cardStyle', 'glass')}
                            className={`flex-1 py-2 rounded-lg border text-xs font-medium transition-all ${(styles.cardStyle || 'glass') === 'glass' ? 'bg-blue-500 text-white border-blue-500' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'}`}>
                            Glass
                        </button>
                        <button type="button" onClick={() => update('cardStyle', 'solid')}
                            className={`flex-1 py-2 rounded-lg border text-xs font-medium transition-all ${styles.cardStyle === 'solid' ? 'bg-blue-500 text-white border-blue-500' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'}`}>
                            Solid
                        </button>
                    </div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Card colour</label>
                    <div className="flex items-center gap-2">
                        <input type="color" value={styles.cardColor || '#FFFFFF'} onChange={e => update('cardColor', e.target.value)} className="w-8 h-8 rounded border cursor-pointer" />
                        <input type="text" value={styles.cardColor || '#FFFFFF'} onChange={e => update('cardColor', e.target.value)} className="input-field text-[10px] font-mono flex-1 py-1" placeholder="#FFFFFF" />
                    </div>
                    <p className="text-[10px] text-gray-400 mt-0.5">Glass = tint; Solid = opaque background.</p>
                </div>

                {/* Title Alignment */}
                <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Title Align</label>
                    <div className="flex bg-white p-1 rounded-lg border border-gray-200 h-8">
                        {[{ v: 'left', icon: AlignLeft }, { v: 'center', icon: AlignCenter }, { v: 'right', icon: AlignRight }].map(({ v, icon: Icon }) => (
                            <button key={v} onClick={() => update('textAlign', v)}
                                className={`flex-1 flex items-center justify-center rounded text-xs transition-all ${styles.textAlign === v ? 'bg-blue-500 text-white' : 'text-gray-400 hover:text-gray-600'}`}>
                                <Icon size={14} />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Subtitle Alignment */}
                <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Subtitle Align</label>
                    <div className="flex bg-white p-1 rounded-lg border border-gray-200 h-8">
                        {[{ v: 'left', icon: AlignLeft }, { v: 'center', icon: AlignCenter }, { v: 'right', icon: AlignRight }].map(({ v, icon: Icon }) => (
                            <button key={v} onClick={() => update('subtitleAlign', v)}
                                className={`flex-1 flex items-center justify-center rounded text-xs transition-all ${(styles.subtitleAlign || 'center') === v ? 'bg-blue-500 text-white' : 'text-gray-400 hover:text-gray-600'}`}>
                                <Icon size={14} />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content Alignment */}
                <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Content Align</label>
                    <div className="flex bg-white p-1 rounded-lg border border-gray-200 h-8">
                        {[{ v: 'left', icon: AlignLeft }, { v: 'center', icon: AlignCenter }, { v: 'right', icon: AlignRight }].map(({ v, icon: Icon }) => (
                            <button key={v} onClick={() => update('contentAlign', v)}
                                className={`flex-1 flex items-center justify-center rounded text-xs transition-all ${styles.contentAlign === v ? 'bg-blue-500 text-white' : 'text-gray-400 hover:text-gray-600'}`}>
                                <Icon size={14} />
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Title Formatting */}
            <div>
                <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                    <Type size={12} /> Title Style
                </div>
                <div className="flex bg-white p-1 rounded-lg border border-gray-200 h-9 gap-0.5">
                    <button onClick={() => update('titleFontWeight', styles.titleFontWeight === 'bold' ? 'normal' : 'bold')}
                        className={`flex-1 flex items-center justify-center rounded text-xs font-bold transition-all ${styles.titleFontWeight === 'bold' ? 'bg-blue-500 text-white' : 'text-gray-400 hover:text-gray-600'}`}
                        title="Bold">
                        <Bold size={14} />
                    </button>
                    <button onClick={() => update('titleFontStyle', styles.titleFontStyle === 'italic' ? 'normal' : 'italic')}
                        className={`flex-1 flex items-center justify-center rounded text-xs transition-all ${styles.titleFontStyle === 'italic' ? 'bg-blue-500 text-white' : 'text-gray-400 hover:text-gray-600'}`}
                        title="Italic">
                        <Italic size={14} />
                    </button>
                    <button onClick={() => update('titleTextDecoration', styles.titleTextDecoration === 'underline' ? 'none' : 'underline')}
                        className={`flex-1 flex items-center justify-center rounded text-xs transition-all ${styles.titleTextDecoration === 'underline' ? 'bg-blue-500 text-white' : 'text-gray-400 hover:text-gray-600'}`}
                        title="Underline">
                        <Underline size={14} />
                    </button>
                    <button onClick={() => { update('titleFontWeight', 'normal'); update('titleFontStyle', 'normal'); update('titleTextDecoration', 'none'); }}
                        className={`flex-1 flex items-center justify-center rounded text-xs transition-all ${(!styles.titleFontWeight || styles.titleFontWeight === 'normal') && (!styles.titleFontStyle || styles.titleFontStyle === 'normal') && (!styles.titleTextDecoration || styles.titleTextDecoration === 'none') ? 'bg-gray-200 text-gray-700' : 'text-gray-400 hover:text-gray-600'}`}
                        title="Reset to Normal">
                        <Minus size={14} />
                    </button>
                </div>
                {/* Preview */}
                <div className="mt-2 px-3 py-2 bg-white rounded border border-gray-100">
                    <span className="text-xs text-gray-400">Preview: </span>
                    <span style={{
                        fontWeight: styles.titleFontWeight || 'normal',
                        fontStyle: styles.titleFontStyle || 'normal',
                        textDecoration: styles.titleTextDecoration || 'none',
                        textAlign: styles.textAlign || 'left',
                        fontSize: '14px',
                        color: styles.textColor || '#1A365D'
                    }}>Sample Title Text</span>
                </div>
            </div>

            {/* Title Font Size */}
            <div>
                <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                    <AArrowUp size={12} /> Title Size
                </div>
                <div className="flex items-center gap-3">
                    <input type="range" min="20" max="48" step="1" value={styles.titleFontSize || 32}
                        onChange={e => update('titleFontSize', parseInt(e.target.value))} className="flex-1 h-2 accent-blue-500" />
                    <span className="text-xs font-bold text-gray-600 bg-white border border-gray-200 px-2 py-1 rounded min-w-[42px] text-center">
                        {styles.titleFontSize || 32}px
                    </span>
                </div>
            </div>

            {/* Subtitle Font Size */}
            <div>
                <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                    <AArrowUp size={12} /> Subtitle Size
                </div>
                <div className="flex items-center gap-3">
                    <input type="range" min="12" max="28" step="1" value={styles.subtitleFontSize || 17}
                        onChange={e => update('subtitleFontSize', parseInt(e.target.value))} className="flex-1 h-2 accent-purple-500" />
                    <span className="text-xs font-bold text-gray-600 bg-white border border-gray-200 px-2 py-1 rounded min-w-[42px] text-center">
                        {styles.subtitleFontSize || 17}px
                    </span>
                </div>
            </div>

            {/* Content Font Size */}
            <div>
                <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                    <AArrowUp size={12} /> Content Size
                </div>
                <div className="flex items-center gap-3">
                    <input type="range" min="12" max="24" step="1" value={styles.contentFontSize || 16}
                        onChange={e => update('contentFontSize', parseInt(e.target.value))} className="flex-1 h-2 accent-green-500" />
                    <span className="text-xs font-bold text-gray-600 bg-white border border-gray-200 px-2 py-1 rounded min-w-[42px] text-center">
                        {styles.contentFontSize || 16}px
                    </span>
                </div>
            </div>

            {/* Box Width */}
            <div>
                <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                    <Columns size={12} /> Box Width
                </div>
                <div className="flex bg-white p-1 rounded-lg border border-gray-200 h-9 gap-0.5">
                    {[{ v: 'short', label: 'Short' }, { v: 'medium', label: 'Medium' }, { v: 'full', label: 'Full' }].map(({ v, label }) => (
                        <button key={v} onClick={() => update('boxWidth', v)}
                            className={`flex-1 flex items-center justify-center rounded text-[11px] font-bold transition-all ${(styles.boxWidth || 'medium') === v ? 'bg-blue-500 text-white' : 'text-gray-400 hover:text-gray-600'}`}>
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Box Position */}
            <div>
                <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                    <AlignCenter size={12} /> Box Position
                </div>
                <div className="flex bg-white p-1 rounded-lg border border-gray-200 h-9 gap-0.5">
                    {[{ v: 'left', icon: AlignLeft }, { v: 'center', icon: AlignCenter }, { v: 'right', icon: AlignRight }].map(({ v, icon: Icon }) => (
                        <button key={v} onClick={() => update('boxPosition', v)}
                            className={`flex-1 flex items-center justify-center rounded text-xs transition-all ${(styles.boxPosition || 'center') === v ? 'bg-blue-500 text-white' : 'text-gray-400 hover:text-gray-600'}`}>
                            <Icon size={14} />
                        </button>
                    ))}
                </div>
            </div>

            {/* Content Position */}
            <div>
                <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                    <Type size={12} /> Content Position
                </div>
                <div className="flex bg-white p-1 rounded-lg border border-gray-200 h-9 gap-0.5">
                    {[{ v: 'header', label: 'Header' }, { v: 'footer', label: 'Footer' }, { v: 'both', label: 'Both' }].map(({ v, label }) => (
                        <button key={v} onClick={() => update('contentPosition', v)}
                            className={`flex-1 flex items-center justify-center rounded text-[11px] font-bold transition-all ${(styles.contentPosition || 'footer') === v ? 'bg-blue-500 text-white' : 'text-gray-400 hover:text-gray-600'}`}>
                            {label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

// ──────────────────────────────────────────────
// ITEMS MANAGER — shared items editor
// ──────────────────────────────────────────────
const ItemsManager = ({ items = [], onChange }) => {
    const addItem = () => {
        onChange([...items, { id: `item-${Date.now()}`, title: 'New Item', description: '', icon: 'CheckCircle' }]);
    };

    const updateItem = (idx, field, value) => {
        const updated = [...items];
        updated[idx] = { ...updated[idx], [field]: value };
        onChange(updated);
    };

    const removeItem = (idx) => {
        onChange(items.filter((_, i) => i !== idx));
    };

    const handleDragEnd = (result) => {
        if (!result.destination) return;
        const reordered = [...items];
        const [moved] = reordered.splice(result.source.index, 1);
        reordered.splice(result.destination.index, 0, moved);
        onChange(reordered);
    };

    return (
        <div className="space-y-3">
            <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Items / Values</label>
                <button onClick={addItem} className="text-xs flex items-center gap-1 text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 font-bold border border-blue-100">
                    <Plus size={14} /> Add Item
                </button>
            </div>

            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="items-editor">
                    {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                            {items.map((item, idx) => (
                                <Draggable key={item.id || idx} draggableId={String(item.id || idx)} index={idx}>
                                    {(provided, snapshot) => (
                                        <div ref={provided.innerRef} {...provided.draggableProps}
                                            className={`p-3 bg-white rounded-lg border border-gray-200 group relative ${snapshot.isDragging ? 'shadow-lg ring-2 ring-blue-400' : 'hover:shadow-sm'}`}>
                                            <div className="flex gap-3 items-start">
                                                <div {...provided.dragHandleProps} className="text-gray-300 hover:text-gray-500 cursor-grab pt-1">
                                                    <GripVertical size={14} />
                                                </div>
                                                <div className="pt-1">
                                                    <IconPicker value={item.icon || 'CheckCircle'} onChange={(icon) => updateItem(idx, 'icon', icon)} />
                                                </div>
                                                <div className="flex-1 space-y-2">
                                                    <input value={item.title || ''} onChange={e => updateItem(idx, 'title', e.target.value)}
                                                        className="input-field font-bold text-sm py-1" placeholder="Item Title" />
                                                    {/* Image — upload or URL */}
                                                    {item.image !== undefined && item.image !== null ? (
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-12 h-12 rounded-lg overflow-hidden border border-gray-200 shrink-0 bg-gray-50">
                                                                <img src={item.image} alt="" className="w-full h-full object-cover" onError={e => { e.target.style.display = 'none'; }} />
                                                            </div>
                                                            <input value={item.image || ''} onChange={e => updateItem(idx, 'image', e.target.value)}
                                                                className="input-field text-[10px] py-1 flex-1 font-mono" placeholder="Paste image URL..." />
                                                            <label className="text-[10px] text-blue-500 hover:text-blue-700 cursor-pointer shrink-0 bg-blue-50 px-2 py-1 rounded border border-blue-100 font-bold">
                                                                Upload
                                                                <input type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={e => {
                                                                    const file = e.target.files[0];
                                                                    if (file) {
                                                                        const reader = new FileReader();
                                                                        reader.onload = (ev) => updateItem(idx, 'image', ev.target.result);
                                                                        reader.readAsDataURL(file);
                                                                    }
                                                                }} />
                                                            </label>
                                                            <button onClick={() => updateItem(idx, 'image', null)}
                                                                className="text-gray-300 hover:text-red-500 text-xs p-0.5 shrink-0" title="Remove image">
                                                                ✕
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <button onClick={() => updateItem(idx, 'image', '')}
                                                            className="text-[10px] text-gray-400 hover:text-blue-500 flex items-center gap-1">
                                                            <Plus size={10} /> Add Image
                                                        </button>
                                                    )}
                                                    {item.description !== undefined && item.description !== null ? (
                                                        <div className="relative">
                                                            <textarea value={item.description || ''} onChange={e => updateItem(idx, 'description', e.target.value)}
                                                                className="input-field text-xs h-14 resize-none py-1 pr-8" placeholder="Description..." />
                                                            <button onClick={() => updateItem(idx, 'description', null)}
                                                                className="absolute top-1 right-1 text-gray-300 hover:text-red-500 text-xs p-0.5 rounded" title="Remove description">
                                                                ✕
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <button onClick={() => updateItem(idx, 'description', '')}
                                                            className="text-[10px] text-gray-400 hover:text-blue-500 flex items-center gap-1">
                                                            <Plus size={10} /> Add Description
                                                        </button>
                                                    )}
                                                </div>
                                                <button onClick={() => removeItem(idx)} className="text-gray-300 hover:text-red-500 pt-1">
                                                    <Trash2 size={14} />
                                                </button>
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

            {items.length === 0 && (
                <div className="text-center p-6 bg-gray-50 border border-dashed border-gray-200 rounded-lg text-gray-400 text-sm">
                    No items added yet. Click "Add Item" to start.
                </div>
            )}
        </div>
    );
};

// ══════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════
const AboutManager = () => {
    // ── HOOKS ──
    const { content, loading, saving, saveContent } = useContent('about', { sections: ALL_SECTIONS });
    const { content: boardContent, loading: boardLoading, saveContent: saveBoard } = useContent('board', DEFAULT_BOARD);
    const { content: partnersContent, loading: partnersLoading, saveContent: savePartners } = useContent('partners', DEFAULT_PARTNERS);

    // ── STATE ──
    const [sections, setSections] = useState(ALL_SECTIONS);
    const [activeSection, setActiveSection] = useState(null);
    const [directors, setDirectors] = useState(DEFAULT_BOARD.directors);
    const [boardStyleColors, setBoardStyleColors] = useState(DEFAULT_BOARD.styleColors || { nameColor: '', roleColor: '', bioColor: '', cardStyle: 'glass', cardColor: '#FFFFFF' });
    const [partners, setPartners] = useState(DEFAULT_PARTNERS.partners);
    const [banks, setBanks] = useState(DEFAULT_PARTNERS.banks);
    const [milestone, setMilestone] = useState(DEFAULT_PARTNERS.milestone);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newSectionForm, setNewSectionForm] = useState({
        title: '', subtitle: '', layoutType: 'standard',
        bgColor: '#FFFFFF', textColor: '#1A365D', textAlign: 'left',
        fontWeight: 'normal', icon: 'Lightbulb',
        cardStyle: 'glass', cardColor: '#FFFFFF',
        initialItems: []
    });

    // ── SYNC FROM DB ──
    useEffect(() => {
        if (content?.sections && !loading) {
            const sanitized = content.sections.map((s, i) => ({
                ...s,
                id: s.id || `s-${i}-${Date.now()}`,
                type: s.type || 'custom',
                title: s.title || s.missionTitle || (s.type === 'milestone' ? 'Investment Milestone' : s.type === 'partners' ? 'Strategic Partners' : 'Untitled'),
                styles: s.styles || { bgColor: '#FFFFFF', textColor: '#1A365D', textAlign: 'left' }
            }));
            setSections(sanitized.length > 0 ? sanitized : ALL_SECTIONS);
        }
    }, [content, loading]);

    useEffect(() => {
        if (boardContent && !boardLoading) {
            if (boardContent.directors) setDirectors(boardContent.directors);
            if (boardContent.styleColors) setBoardStyleColors(boardContent.styleColors);
        }
    }, [boardContent, boardLoading]);
    useEffect(() => {
        if (partnersContent && !partnersLoading) {
            if (partnersContent.partners) setPartners(partnersContent.partners);
            if (partnersContent.banks) setBanks(partnersContent.banks);
            if (partnersContent.milestone) setMilestone(partnersContent.milestone);
        }
    }, [partnersContent, partnersLoading]);

    useEffect(() => { if (!activeSection && sections.length > 0) setActiveSection(sections[0].id); }, [sections, activeSection]);

    // ── HANDLERS ──
    const updateSection = (id, updates) => setSections(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
    const updateSectionStyles = (id, newStyles) => setSections(prev => prev.map(s => s.id === id ? { ...s, styles: newStyles } : s));

    const openAddModal = () => {
        setNewSectionForm({
            title: '', subtitle: '', layoutType: 'standard',
            bgColor: '#FFFFFF', textColor: '#1A365D', textAlign: 'left',
            fontWeight: 'normal', icon: 'Lightbulb',
            cardStyle: 'glass', cardColor: '#FFFFFF',
            initialItems: []
        });
        setShowAddModal(true);
    };

    const addNewSectionItem = () => {
        setNewSectionForm(prev => ({
            ...prev,
            initialItems: [...prev.initialItems, { id: `item-${Date.now()}`, title: '', description: '', icon: 'CheckCircle' }]
        }));
    };

    const updateNewSectionItem = (idx, field, value) => {
        setNewSectionForm(prev => {
            const updated = [...prev.initialItems];
            updated[idx] = { ...updated[idx], [field]: value };
            return { ...prev, initialItems: updated };
        });
    };

    const removeNewSectionItem = (idx) => {
        setNewSectionForm(prev => ({
            ...prev,
            initialItems: prev.initialItems.filter((_, i) => i !== idx)
        }));
    };

    const confirmAddSection = () => {
        const s = {
            id: `section-${Date.now()}`, type: 'custom',
            title: newSectionForm.title || 'New Section',
            subtitle: newSectionForm.subtitle || '',
            content: '',
            items: newSectionForm.initialItems,
            styles: {
                layoutType: newSectionForm.layoutType,
                bgColor: newSectionForm.bgColor,
                textColor: newSectionForm.textColor,
                textAlign: newSectionForm.textAlign,
                fontWeight: newSectionForm.fontWeight,
                icon: newSectionForm.icon,
                cardStyle: newSectionForm.cardStyle || 'glass',
                cardColor: newSectionForm.cardColor || '#FFFFFF'
            }
        };
        setSections(prev => [...prev, s]);
        setActiveSection(s.id);
        setShowAddModal(false);
        toast.success('Section added');
    };

    const removeSection = (id) => {
        if (!window.confirm('Remove this section?')) return;
        setSections(prev => prev.filter(s => s.id !== id));
        if (activeSection === id) setActiveSection(sections[0]?.id || null);
        toast.success('Section removed');
    };

    const handleSave = async () => {
        try {
            await Promise.all([
                saveContent({ sections }, { silent: true }),
                saveBoard({ directors, styleColors: boardStyleColors }, { silent: true }),
                savePartners({ partners, banks, milestone }, { silent: true })
            ]);
            toast.success('All changes saved!');
        } catch (err) {
            console.error(err);
            toast.error('Failed to save.');
        }
    };

    // ── DRAG ──
    const handleDragEnd = (result) => {
        if (!result.destination) return;
        const { source, destination } = result;
        if (source.droppableId === 'section-tabs') {
            const items = [...sections];
            const [moved] = items.splice(source.index, 1);
            items.splice(destination.index, 0, moved);
            setSections(items);
            setActiveSection(moved.id);
        } else if (source.droppableId === 'board-list') {
            const items = [...directors];
            const [moved] = items.splice(source.index, 1);
            items.splice(destination.index, 0, moved);
            setDirectors(items);
        } else if (source.droppableId === 'partners-list') {
            const items = [...partners];
            const [moved] = items.splice(source.index, 1);
            items.splice(destination.index, 0, moved);
            setPartners(items);
        } else if (source.droppableId === 'banks-list') {
            const items = [...banks];
            const [moved] = items.splice(source.index, 1);
            items.splice(destination.index, 0, moved);
            setBanks(items);
        }
    };

    // Board CRUD
    const addDirector = () => { setDirectors(prev => [...prev, { id: `dir-${Date.now()}`, name: 'New Director', role: 'Role', image: '', bio: '' }]); toast.success('Director added'); };
    const updateDirector = (id, f, v) => setDirectors(prev => prev.map(d => d.id === id ? { ...d, [f]: v } : d));
    const deleteDirector = (id) => { if (window.confirm('Remove?')) setDirectors(prev => prev.filter(d => d.id !== id)); };

    // Partner CRUD
    const addPartner = () => setPartners(prev => [...prev, { id: `p-${Date.now()}`, name: 'New Partner', category: '', description: '', partnership: '', logo: '' }]);
    const updatePartner = (id, f, v) => setPartners(prev => prev.map(p => p.id === id ? { ...p, [f]: v } : p));
    const deletePartner = (id) => { if (window.confirm('Remove?')) setPartners(prev => prev.filter(p => p.id !== id)); };

    // Bank CRUD
    const addBank = () => setBanks(prev => [...prev, { id: `b-${Date.now()}`, name: 'New Bank', role: '', swift: '', branch: '', logo: '' }]);
    const updateBank = (id, f, v) => setBanks(prev => prev.map(b => b.id === id ? { ...b, [f]: v } : b));
    const deleteBank = (id) => { if (window.confirm('Remove?')) setBanks(prev => prev.filter(b => b.id !== id)); };

    // Milestone
    const updateMilestone = (f, v) => setMilestone(prev => ({ ...prev, [f]: v }));

    // ══════════════════════════════════════════════
    // SECTION EDITORS
    // ══════════════════════════════════════════════

    const renderHeroEditor = (s) => (
        <div className="space-y-4">
            <div><label className="label">Page Title</label><input value={s.title || ''} onChange={e => updateSection(s.id, { title: e.target.value })} className="input-field font-bold text-lg" /></div>
            <div>
                <label className="label">Subtitle</label>
                <textarea rows={3} value={s.subtitle || ''} onChange={e => updateSection(s.id, { subtitle: e.target.value })} className="input-field" />
                <p className="text-[10px] text-gray-400 mt-1">Press Enter for new line. Press Enter twice for paragraph gap.</p>
            </div>
            <InlineStyleControls styles={s.styles || {}} onUpdate={(st) => updateSectionStyles(s.id, st)} />
        </div>
    );

    const renderMissionEditor = (s) => (
        <div className="space-y-6">
            <div>
                <label className="label">Section title</label>
                <input value={s.title || ''} onChange={e => updateSection(s.id, { title: e.target.value })} className="input-field font-bold bg-white" placeholder="e.g. Our Mission & Vision" />
                <p className="text-[10px] text-gray-400 mt-1">Main heading for this section on the About page.</p>
            </div>
            <div>
                <label className="label">Label above Mission (e.g. Our institutional Mandate)</label>
                <input value={s.mandateLabel || ''} onChange={e => updateSection(s.id, { mandateLabel: e.target.value })} className="input-field bg-white" placeholder="e.g. Our institutional Mandate" />
                <p className="text-[10px] text-gray-400 mt-1">Small label shown inside the card, above &quot;Our Mission&quot;.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100 space-y-3">
                    <div className="flex items-center gap-2 text-blue-700 font-bold text-xs uppercase"><Target size={14} /> Mission</div>
                    <input value={s.missionTitle || ''} onChange={e => updateSection(s.id, { missionTitle: e.target.value })} className="input-field font-bold bg-white" placeholder="Title" />
                    <textarea rows={4} value={s.missionText || ''} onChange={e => updateSection(s.id, { missionText: e.target.value })} className="input-field bg-white" placeholder="Mission..." />
                </div>
                <div className="p-4 bg-purple-50/50 rounded-xl border border-purple-100 space-y-3">
                    <div className="flex items-center gap-2 text-purple-700 font-bold text-xs uppercase"><Eye size={14} /> Vision</div>
                    <input value={s.visionTitle || ''} onChange={e => updateSection(s.id, { visionTitle: e.target.value })} className="input-field font-bold bg-white" placeholder="Title" />
                    <textarea rows={4} value={s.visionText || ''} onChange={e => updateSection(s.id, { visionText: e.target.value })} className="input-field bg-white" placeholder="Vision..." />
                </div>
            </div>

            {/* Values */}
            <div>
                <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2"><Star size={14} className="text-yellow-500" /> Core Values</span>
                    <button onClick={() => updateSection(s.id, { values: [...(s.values || []), { id: `val-${Date.now()}`, title: 'New Value', text: '', icon: 'Star' }] })} className="text-xs text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 font-bold border border-blue-100">+ Add Value</button>
                </div>
                <div className="space-y-2">
                    {(s.values || []).map((val, idx) => (
                        <div key={val.id || idx} className="p-3 bg-white rounded-lg border border-gray-200 flex gap-3 items-start group">
                            <IconPicker value={val.icon} onChange={icon => { const nv = [...s.values]; nv[idx] = { ...val, icon }; updateSection(s.id, { values: nv }); }} />
                            <div className="flex-1 space-y-2">
                                <input value={val.title} onChange={e => { const nv = [...s.values]; nv[idx] = { ...val, title: e.target.value }; updateSection(s.id, { values: nv }); }} className="input-field font-bold text-sm py-1" placeholder="Title" />
                                <textarea value={val.text} onChange={e => { const nv = [...s.values]; nv[idx] = { ...val, text: e.target.value }; updateSection(s.id, { values: nv }); }} className="input-field text-xs h-14 resize-none py-1" placeholder="Description" />
                            </div>
                            <button onClick={() => { const nv = s.values.filter(v => v.id !== val.id); updateSection(s.id, { values: nv }); }} className="text-gray-300 hover:text-red-500 pt-1"><Trash2 size={14} /></button>
                        </div>
                    ))}
                </div>
            </div>

            <InlineStyleControls styles={s.styles || {}} onUpdate={(st) => updateSectionStyles(s.id, st)} />
        </div>
    );

    const renderBoardEditor = (s) => (
        <div className="space-y-4">
            {/* Header Fields */}
            <div className="space-y-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div>
                    <label className="label">Section Label</label>
                    <input value={s.sectionLabel || ''} onChange={e => updateSection(s.id, { sectionLabel: e.target.value })}
                        className="input-field text-xs text-amber-700 font-bold" placeholder="e.g. Leadership" />
                </div>
                <div>
                    <label className="label">Title</label>
                    <input value={s.title || ''} onChange={e => updateSection(s.id, { title: e.target.value })}
                        className="input-field font-bold" placeholder="Board of Directors" />
                </div>
                <div>
                    <label className="label">Subtitle</label>
                    <input value={s.subtitle || ''} onChange={e => updateSection(s.id, { subtitle: e.target.value })}
                        className="input-field text-sm" placeholder="Subtitle..." />
                </div>
            </div>

            {/* Custom font colours for name, role, bio */}
            <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-200/80">
                <h4 className="text-sm font-bold text-amber-800 mb-3">Font colours (name, role, bio)</h4>
                <p className="text-xs text-amber-700/90 mb-3">Set colours for director name, role, and bio on the public page. Leave empty for site default.</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Name</label>
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-lg border border-amber-300 shrink-0 flex items-center justify-center text-[10px] font-bold" style={{ background: boardStyleColors.nameColor || '#1A365D', color: '#fff' }}>Aa</div>
                            <input type="color" value={boardStyleColors.nameColor || '#1A365D'} onChange={(e) => setBoardStyleColors(prev => ({ ...prev, nameColor: e.target.value }))} className="h-9 w-10 rounded border border-gray-300 cursor-pointer" />
                            <input type="text" value={boardStyleColors.nameColor || ''} onChange={(e) => setBoardStyleColors(prev => ({ ...prev, nameColor: e.target.value }))} className="input-field text-xs flex-1 py-1.5" placeholder="#1A365D" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Role</label>
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-lg border border-amber-300 shrink-0 flex items-center justify-center text-[10px] font-bold" style={{ background: boardStyleColors.roleColor || '#b8860b', color: '#fff' }}>Aa</div>
                            <input type="color" value={boardStyleColors.roleColor || '#b8860b'} onChange={(e) => setBoardStyleColors(prev => ({ ...prev, roleColor: e.target.value }))} className="h-9 w-10 rounded border border-gray-300 cursor-pointer" />
                            <input type="text" value={boardStyleColors.roleColor || ''} onChange={(e) => setBoardStyleColors(prev => ({ ...prev, roleColor: e.target.value }))} className="input-field text-xs flex-1 py-1.5" placeholder="#b8860b" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Bio</label>
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-lg border border-amber-300 shrink-0 flex items-center justify-center text-[10px] font-bold" style={{ background: boardStyleColors.bioColor || '#64748b', color: '#fff' }}>Aa</div>
                            <input type="color" value={boardStyleColors.bioColor || '#64748b'} onChange={(e) => setBoardStyleColors(prev => ({ ...prev, bioColor: e.target.value }))} className="h-9 w-10 rounded border border-gray-300 cursor-pointer" />
                            <input type="text" value={boardStyleColors.bioColor || ''} onChange={(e) => setBoardStyleColors(prev => ({ ...prev, bioColor: e.target.value }))} className="input-field text-xs flex-1 py-1.5" placeholder="#64748b" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 mt-3">
                <h4 className="text-sm font-bold text-gray-700 mb-2">Director card / box style</h4>
                <div className="flex gap-2 mb-2">
                    <button type="button" onClick={() => setBoardStyleColors(prev => ({ ...prev, cardStyle: 'glass' }))}
                        className={`flex-1 py-2 rounded-lg border text-xs font-medium ${(boardStyleColors.cardStyle || 'glass') === 'glass' ? 'bg-blue-500 text-white border-blue-500' : 'bg-white border-gray-200'}`}>Glass</button>
                    <button type="button" onClick={() => setBoardStyleColors(prev => ({ ...prev, cardStyle: 'solid' }))}
                        className={`flex-1 py-2 rounded-lg border text-xs font-medium ${boardStyleColors.cardStyle === 'solid' ? 'bg-blue-500 text-white border-blue-500' : 'bg-white border-gray-200'}`}>Solid</button>
                </div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Card colour</label>
                <div className="flex items-center gap-2">
                    <input type="color" value={boardStyleColors.cardColor || '#FFFFFF'} onChange={(e) => setBoardStyleColors(prev => ({ ...prev, cardColor: e.target.value }))} className="h-9 w-10 rounded border cursor-pointer" />
                    <input type="text" value={boardStyleColors.cardColor || '#FFFFFF'} onChange={(e) => setBoardStyleColors(prev => ({ ...prev, cardColor: e.target.value }))} className="input-field text-xs flex-1 py-1.5" placeholder="#FFFFFF" />
                </div>
            </div>

            <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Directors — drag to reorder</span>
                <button onClick={addDirector} className="text-xs flex items-center gap-1 text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 font-bold border border-blue-100"><Plus size={14} /> Add Director</button>
            </div>

            <Droppable droppableId="board-list">
                {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                        {directors.map((d, idx) => (
                            <Draggable key={d.id} draggableId={d.id} index={idx}>
                                {(prov, snap) => (
                                    <div ref={prov.innerRef} {...prov.draggableProps} className={`p-4 bg-white rounded-xl border border-gray-200 ${snap.isDragging ? 'shadow-lg ring-2 ring-blue-400' : 'hover:shadow-sm'}`}>
                                        <div className="flex gap-4">
                                            <div {...prov.dragHandleProps} className="text-gray-300 hover:text-gray-500 cursor-grab pt-2"><GripVertical size={16} /></div>
                                            <div className="w-24 shrink-0">
                                                <div className="aspect-[3/4] rounded-lg overflow-hidden border bg-gray-50">
                                                    <ImageUpload value={d.image} onChange={url => updateDirector(d.id, 'image', url)} folder="directors" aspectRatio="3/4" />
                                                </div>
                                            </div>
                                            <div className="flex-1 space-y-2">
                                                <input value={d.name} onChange={e => updateDirector(d.id, 'name', e.target.value)} className="input-field font-bold text-sm py-1" placeholder="Name" />
                                                <input value={d.role} onChange={e => updateDirector(d.id, 'role', e.target.value)} className="input-field text-xs text-amber-700 font-bold py-1" placeholder="Role" />
                                                <textarea value={d.bio || ''} onChange={e => updateDirector(d.id, 'bio', e.target.value)} className="input-field text-xs h-14 resize-none py-1" placeholder="Bio..." />
                                            </div>
                                            <button onClick={() => deleteDirector(d.id)} className="text-gray-300 hover:text-red-500 pt-1"><Trash2 size={14} /></button>
                                        </div>
                                    </div>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>

            <InlineStyleControls styles={s.styles || {}} onUpdate={(st) => updateSectionStyles(s.id, st)} />
        </div>
    );

    const renderMilestoneEditor = (s) => (
        <div className="space-y-4">
            <div>
                <label className="label">Section title</label>
                <input value={s.title || ''} onChange={e => updateSection(s.id, { title: e.target.value })} className="input-field font-bold bg-white" placeholder="e.g. Investment Milestone" />
                <p className="text-[10px] text-gray-400 mt-1">Heading shown above the milestone block on the About page.</p>
            </div>
            <div className="space-y-3">
                <div><label className="label">Headline</label><input value={milestone.headline || ''} onChange={e => updateMilestone('headline', e.target.value)} className="input-field font-bold text-xl" placeholder="e.g. USD 1 Billion" /></div>
                <div><label className="label">Subtitle</label><input value={milestone.subtitle || ''} onChange={e => updateMilestone('subtitle', e.target.value)} className="input-field text-amber-700 font-bold" /></div>
                <div><label className="label">Description</label><textarea rows={4} value={milestone.description || ''} onChange={e => updateMilestone('description', e.target.value)} className="input-field" /></div>
            </div>
            <InlineStyleControls styles={s.styles || {}} onUpdate={(st) => updateSectionStyles(s.id, st)} />
        </div>
    );

    const renderPartnersEditor = (s) => (
        <div className="space-y-6">
            <div>
                <label className="label">Section title</label>
                <input value={s.title || ''} onChange={e => updateSection(s.id, { title: e.target.value })} className="input-field font-bold bg-white" placeholder="e.g. Strategic Partners" />
                <label className="label mt-2 block">Section subtitle (optional)</label>
                <input value={s.subtitle || ''} onChange={e => updateSection(s.id, { subtitle: e.target.value })} className="input-field bg-white" placeholder="e.g. Collaborating with world-class institutions." />
                <p className="text-[10px] text-gray-400 mt-1">Shown on the About page above the partners and banks.</p>
            </div>
            {/* Partners */}
            <div>
                <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">Strategic Partners</span>
                    <button onClick={addPartner} className="text-xs text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 font-bold border border-blue-100"><Plus size={14} className="inline mr-1" />Add Partner</button>
                </div>
                <Droppable droppableId="partners-list">
                    {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                            {partners.map((p, idx) => (
                                <Draggable key={p.id} draggableId={p.id} index={idx}>
                                    {(prov, snap) => (
                                        <div ref={prov.innerRef} {...prov.draggableProps} className={`p-3 bg-white rounded-lg border border-gray-200 ${snap.isDragging ? 'shadow-lg ring-2 ring-blue-400' : ''}`}>
                                            <div className="flex gap-3 items-start">
                                                <div {...prov.dragHandleProps} className="text-gray-300 cursor-grab pt-1"><GripVertical size={14} /></div>
                                                <div className="flex-1 grid grid-cols-2 gap-2">
                                                    <input value={p.name} onChange={e => updatePartner(p.id, 'name', e.target.value)} className="input-field font-bold text-sm py-1" placeholder="Name" />
                                                    <input value={p.category} onChange={e => updatePartner(p.id, 'category', e.target.value)} className="input-field text-xs py-1 text-amber-700 font-bold" placeholder="Category" />
                                                    <textarea value={p.description} onChange={e => updatePartner(p.id, 'description', e.target.value)} className="input-field text-xs h-12 resize-none py-1 col-span-2" placeholder="Description" />
                                                    <input value={p.partnership || ''} onChange={e => updatePartner(p.id, 'partnership', e.target.value)} className="input-field text-xs py-1 col-span-2" placeholder="Partnership detail" />
                                                    <input value={p.logo || ''} onChange={e => updatePartner(p.id, 'logo', e.target.value)} className="input-field text-[10px] font-mono py-1 col-span-2" placeholder="Logo URL" />
                                                </div>
                                                <button onClick={() => deletePartner(p.id)} className="text-gray-300 hover:text-red-500 pt-1"><Trash2 size={14} /></button>
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

            {/* Banks */}
            <div>
                <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-bold text-green-700 uppercase tracking-wider">Banking Partners</span>
                    <button onClick={addBank} className="text-xs text-green-600 bg-green-50 px-3 py-1.5 rounded-lg hover:bg-green-100 font-bold border border-green-100"><Plus size={14} className="inline mr-1" />Add Bank</button>
                </div>
                <Droppable droppableId="banks-list">
                    {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                            {banks.map((b, idx) => (
                                <Draggable key={b.id} draggableId={b.id} index={idx}>
                                    {(prov, snap) => (
                                        <div ref={prov.innerRef} {...prov.draggableProps} className={`p-3 bg-white rounded-lg border border-green-100 ${snap.isDragging ? 'shadow-lg ring-2 ring-green-400' : ''}`}>
                                            <div className="flex gap-3 items-start">
                                                <div {...prov.dragHandleProps} className="text-gray-300 cursor-grab pt-1"><GripVertical size={14} /></div>
                                                <div className="flex-1 grid grid-cols-2 gap-2">
                                                    <input value={b.name} onChange={e => updateBank(b.id, 'name', e.target.value)} className="input-field font-bold text-sm py-1" placeholder="Bank Name" />
                                                    <input value={b.role} onChange={e => updateBank(b.id, 'role', e.target.value)} className="input-field text-xs py-1" placeholder="Role" />
                                                    <input value={b.swift || ''} onChange={e => updateBank(b.id, 'swift', e.target.value)} className="input-field text-xs py-1 font-mono" placeholder="SWIFT" />
                                                    <input value={b.branch || b.location || ''} onChange={e => updateBank(b.id, 'branch', e.target.value)} className="input-field text-xs py-1" placeholder="Branch/Location" />
                                                    <input value={b.logo || ''} onChange={e => updateBank(b.id, 'logo', e.target.value)} className="input-field text-[10px] font-mono py-1 col-span-2" placeholder="Logo URL" />
                                                </div>
                                                <button onClick={() => deleteBank(b.id)} className="text-gray-300 hover:text-red-500 pt-1"><Trash2 size={14} /></button>
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

            <InlineStyleControls styles={s.styles || {}} onUpdate={(st) => updateSectionStyles(s.id, st)} />
        </div>
    );

    const renderCustomEditor = (s) => {
        const layoutType = s.styles?.layoutType || 'standard';
        const isStructured = layoutType !== 'standard';

        return (
            <div className="space-y-4">
                <div><label className="label">Title</label><input value={s.title || ''} onChange={e => updateSection(s.id, { title: e.target.value })} className="input-field font-bold text-lg" /></div>
                <div><label className="label">Section Label <span className="text-gray-400 font-normal">(optional, shown below title)</span></label><input value={s.sectionLabel || ''} onChange={e => updateSection(s.id, { sectionLabel: e.target.value })} className="input-field text-xs text-amber-700 font-bold" placeholder="e.g. Leadership, Our Team" /></div>
                <div><label className="label">Subtitle</label><input value={s.subtitle || ''} onChange={e => updateSection(s.id, { subtitle: e.target.value })} className="input-field" placeholder="Brief description..." /></div>

                {/* Layout Type */}
                <div>
                    <label className="label">Layout Type</label>
                    <select value={layoutType} onChange={e => updateSectionStyles(s.id, { ...(s.styles || {}), layoutType: e.target.value })} className="input-field">
                        {LAYOUT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                </div>

                {layoutType === 'boxed-group' && (
                    <div><label className="label">Group Header</label><input value={s.groupTitle || ''} onChange={e => updateSection(s.id, { groupTitle: e.target.value })} className="input-field font-bold" placeholder="e.g. STRATEGIC PILLARS" /></div>
                )}

                {/* Content — for standard layout or as additional text */}
                <div>
                    <label className="label">Content / Text {isStructured ? '(Footer text, optional)' : ''}</label>
                    <textarea rows={isStructured ? 3 : 8} value={s.content || ''} onChange={e => updateSection(s.id, { content: e.target.value })} className="input-field text-sm" placeholder="Enter text content..." style={{ fontSize: `${s.styles?.contentFontSize || 14}px` }} />
                    <p className="text-[10px] text-gray-400 mt-1">Press Enter for new line. Press Enter twice for paragraph gap.</p>
                </div>

                {/* Items — for structured layouts */}
                {isStructured && (
                    <ItemsManager items={s.items || []} onChange={items => updateSection(s.id, { items })} />
                )}

                <InlineStyleControls styles={s.styles || {}} onUpdate={(st) => updateSectionStyles(s.id, st)} />
            </div>
        );
    };

    const getEditor = (s) => {
        switch (s.type) {
            case 'hero': return renderHeroEditor(s);
            case 'mission': return renderMissionEditor(s);
            case 'board': return renderBoardEditor(s);
            case 'milestone': return renderMilestoneEditor(s);
            case 'partners': return renderPartnersEditor(s);
            default: return renderCustomEditor(s);
        }
    };

    const getIcon = (type) => {
        const icons = { hero: LayoutTemplate, mission: Target, board: Users, milestone: Award, partners: Handshake, custom: Lightbulb };
        const Icon = icons[type] || Lightbulb;
        return <Icon size={16} />;
    };

    // ══════════════════════════════════════════════
    // RENDER
    // ══════════════════════════════════════════════
    if (loading || boardLoading || partnersLoading) {
        return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-gray-400" size={32} /></div>;
    }

    const active = sections.find(s => s.id === activeSection);

    return (
        <div className="flex flex-col w-full" style={{ height: 'calc(100vh - 56px - 48px)', overflow: 'hidden' }}>
            <DragDropContext onDragEnd={handleDragEnd}>
                {/* ── ACTION ROW (always visible) ── */}
                <div className="shrink-0 flex items-center justify-between bg-white px-4 py-2 border-b border-gray-100">
                    <h1 className="text-sm font-bold text-gray-700 tracking-wide uppercase">About Page Sections</h1>
                    <div className="flex items-center gap-2">
                        <button onClick={openAddModal} className="flex items-center gap-1.5 px-3 py-1.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg border border-blue-200 text-xs font-bold transition-all" title="Add Section"><Plus size={14} /> Add Section</button>
                        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-1.5 bg-[#22c55e] text-white rounded-lg hover:bg-[#16a34a] text-xs font-bold disabled:opacity-50 shadow-md transition-all">
                            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                            {saving ? 'Saving...' : 'Save All'}
                        </button>
                    </div>
                </div>

                {/* ── TAB BAR (scrollable) ── */}
                <div className="shrink-0 bg-white border-b border-gray-200">
                    <div className="overflow-x-auto px-2 py-1.5" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                        <Droppable droppableId="section-tabs" direction="horizontal">
                            {(provided) => (
                                <div ref={provided.innerRef} {...provided.droppableProps} className="flex gap-1" style={{ width: 'max-content' }}>
                                    {sections.map((s, idx) => (
                                        <Draggable key={s.id} draggableId={s.id} index={idx}>
                                            {(prov, snap) => (
                                                <div ref={prov.innerRef} {...prov.draggableProps}
                                                    className={`flex items-center gap-1 px-1 rounded-t-lg transition-all
                                                        ${activeSection === s.id ? 'bg-white border border-b-white text-blue-700 shadow-sm z-10' : 'bg-gray-100 text-gray-500 hover:bg-gray-200 border border-transparent'}
                                                        ${snap.isDragging ? 'shadow-lg ring-2 ring-blue-400' : ''}`}
                                                    style={{ ...prov.draggableProps.style, borderBottom: activeSection === s.id ? '1px solid white' : undefined, marginBottom: activeSection === s.id ? '-1px' : undefined }}>
                                                    <div {...prov.dragHandleProps} className="pl-1 pr-0.5 cursor-grab opacity-30 hover:opacity-100"><GripVertical size={12} /></div>
                                                    <button onClick={() => setActiveSection(s.id)} className="flex items-center gap-1.5 px-2 py-2 text-xs font-bold bg-transparent border-none cursor-pointer whitespace-nowrap">
                                                        {getIcon(s.type)}
                                                        <span className="max-w-[90px] truncate">{s.title || 'Untitled'}</span>
                                                    </button>
                                                    <button onClick={() => removeSection(s.id)} className="pr-1 text-gray-400 hover:text-red-500"><Trash2 size={11} /></button>
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

                {/* ── EDITOR AREA ── */}
                <div className="flex-1 min-h-0 overflow-y-auto bg-gray-50/50 px-4 py-5" style={{ scrollbarWidth: 'thin' }}>
                    {active ? (
                        <div>
                            {/* Section Header */}
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-white border rounded-lg text-blue-700">{getIcon(active.type)}</div>
                                <div>
                                    <h2 className="text-lg font-bold text-gray-800">{active.title || 'Untitled'}</h2>
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{active.type} section</span>
                                </div>
                            </div>

                            {/* Editor Content */}
                            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                                {getEditor(active)}
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400">
                            <Edit size={32} className="mb-3 opacity-20" />
                            <p className="text-sm">Select a section to edit</p>
                        </div>
                    )}
                </div>
            </DragDropContext>

            {/* ── ADD SECTION MODAL ── */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setShowAddModal(false)}>
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto mx-4" onClick={e => e.stopPropagation()}>
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-5 border-b border-gray-100">
                            <div>
                                <h3 className="text-lg font-bold text-gray-800">Add New Section</h3>
                                <p className="text-xs text-gray-400 mt-0.5">Configure layout, content and appearance</p>
                            </div>
                            <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600"><X size={18} /></button>
                        </div>

                        <div className="p-5 space-y-5">
                            {/* Title & Subtitle */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1.5">Section Title</label>
                                    <input value={newSectionForm.title} onChange={e => setNewSectionForm(p => ({ ...p, title: e.target.value }))} className="input-field font-bold" placeholder="e.g. Our Strategic Vision" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1.5">Subtitle</label>
                                    <input value={newSectionForm.subtitle} onChange={e => setNewSectionForm(p => ({ ...p, subtitle: e.target.value }))} className="input-field" placeholder="Brief description..." />
                                </div>
                            </div>

                            {/* Layout Type */}
                            <div>
                                <label className="text-[10px] font-bold text-gray-400 uppercase block mb-2">Layout Type</label>
                                <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                                    {LAYOUT_OPTIONS.map(o => {
                                        const layoutIcons = { standard: Type, 'mission-card': Target, list: List, grid: Grid3X3, cards: Columns, accordion: ChevronDown, 'boxed-group': LayoutGrid, 'mind-map': Globe, 'icon-group': Star, 'image-grid': Image, 'profile-cards': Users, 'statement-block': FileText };
                                        const LIcon = layoutIcons[o.value] || Type;
                                        return (
                                            <button key={o.value} onClick={() => setNewSectionForm(p => ({ ...p, layoutType: o.value }))}
                                                className={`p-3 rounded-xl border-2 text-center transition-all ${newSectionForm.layoutType === o.value ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-gray-300 text-gray-500'}`}>
                                                <LIcon size={18} className="mx-auto mb-1" />
                                                <span className="text-[10px] font-bold block">{o.label}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Icon Picker */}
                            <div>
                                <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1.5">Section Icon</label>
                                <div className="w-fit">
                                    <IconPicker value={newSectionForm.icon} onChange={icon => setNewSectionForm(p => ({ ...p, icon }))} />
                                </div>
                            </div>

                            {/* Items — only for structured layouts */}
                            {newSectionForm.layoutType !== 'standard' && (
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase">Items / Values</label>
                                        <button onClick={addNewSectionItem} className="text-xs flex items-center gap-1 text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 font-bold border border-blue-100"><Plus size={12} /> Add Item</button>
                                    </div>
                                    <div className="space-y-2">
                                        {newSectionForm.initialItems.map((item, idx) => (
                                            <div key={item.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200 flex gap-3 items-start">
                                                <IconPicker value={item.icon || 'CheckCircle'} onChange={icon => updateNewSectionItem(idx, 'icon', icon)} />
                                                <div className="flex-1 space-y-2">
                                                    <input value={item.title} onChange={e => updateNewSectionItem(idx, 'title', e.target.value)} className="input-field font-bold text-sm py-1" placeholder="Item title" />
                                                    <input value={item.description} onChange={e => updateNewSectionItem(idx, 'description', e.target.value)} className="input-field text-xs py-1" placeholder="Description..." />
                                                </div>
                                                <button onClick={() => removeNewSectionItem(idx)} className="text-gray-300 hover:text-red-500 pt-1"><Trash2 size={14} /></button>
                                            </div>
                                        ))}
                                        {newSectionForm.initialItems.length === 0 && (
                                            <div className="text-center p-4 bg-gray-50 border border-dashed border-gray-200 rounded-lg text-gray-400 text-xs">
                                                No items yet. Add items to populate this section.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Appearance */}
                            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-4">
                                <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                    <Palette size={14} /> Appearance
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    <div>
                                        <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Background</label>
                                        <div className="flex items-center gap-2">
                                            <input type="color" value={newSectionForm.bgColor} onChange={e => setNewSectionForm(p => ({ ...p, bgColor: e.target.value }))} className="w-8 h-8 rounded border cursor-pointer" />
                                            <input type="text" value={newSectionForm.bgColor} onChange={e => setNewSectionForm(p => ({ ...p, bgColor: e.target.value }))} className="input-field text-[10px] font-mono flex-1 py-1" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Text Color</label>
                                        <div className="flex items-center gap-2">
                                            <input type="color" value={newSectionForm.textColor} onChange={e => setNewSectionForm(p => ({ ...p, textColor: e.target.value }))} className="w-8 h-8 rounded border cursor-pointer" />
                                            <input type="text" value={newSectionForm.textColor} onChange={e => setNewSectionForm(p => ({ ...p, textColor: e.target.value }))} className="input-field text-[10px] font-mono flex-1 py-1" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Alignment</label>
                                        <div className="flex bg-white p-1 rounded-lg border border-gray-200 h-8">
                                            {[{ v: 'left', icon: AlignLeft }, { v: 'center', icon: AlignCenter }, { v: 'right', icon: AlignRight }].map(({ v, icon: Icon }) => (
                                                <button key={v} onClick={() => setNewSectionForm(p => ({ ...p, textAlign: v }))}
                                                    className={`flex-1 flex items-center justify-center rounded text-xs transition-all ${newSectionForm.textAlign === v ? 'bg-blue-500 text-white' : 'text-gray-400 hover:text-gray-600'}`}>
                                                    <Icon size={14} />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Font Weight</label>
                                        <div className="flex bg-white p-1 rounded-lg border border-gray-200 h-8">
                                            {[{ v: 'normal', label: 'Regular' }, { v: 'bold', label: 'Bold' }].map(({ v, label }) => (
                                                <button key={v} onClick={() => setNewSectionForm(p => ({ ...p, fontWeight: v }))}
                                                    className={`flex-1 flex items-center justify-center rounded text-xs font-medium transition-all ${newSectionForm.fontWeight === v ? 'bg-blue-500 text-white' : 'text-gray-400 hover:text-gray-600'}`}>
                                                    {label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="col-span-2">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Card / box style</label>
                                        <div className="flex gap-2 mb-1.5">
                                            <button type="button" onClick={() => setNewSectionForm(p => ({ ...p, cardStyle: 'glass' }))}
                                                className={`flex-1 py-2 rounded-lg border text-xs font-medium ${(newSectionForm.cardStyle || 'glass') === 'glass' ? 'bg-blue-500 text-white border-blue-500' : 'bg-white border-gray-200'}`}>Glass</button>
                                            <button type="button" onClick={() => setNewSectionForm(p => ({ ...p, cardStyle: 'solid' }))}
                                                className={`flex-1 py-2 rounded-lg border text-xs font-medium ${newSectionForm.cardStyle === 'solid' ? 'bg-blue-500 text-white border-blue-500' : 'bg-white border-gray-200'}`}>Solid</button>
                                        </div>
                                        <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Card colour</label>
                                        <div className="flex items-center gap-2">
                                            <input type="color" value={newSectionForm.cardColor || '#FFFFFF'} onChange={e => setNewSectionForm(p => ({ ...p, cardColor: e.target.value }))} className="w-8 h-8 rounded border cursor-pointer" />
                                            <input type="text" value={newSectionForm.cardColor || '#FFFFFF'} onChange={e => setNewSectionForm(p => ({ ...p, cardColor: e.target.value }))} className="input-field text-[10px] font-mono flex-1 py-1" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="flex items-center justify-end gap-3 p-5 border-t border-gray-100">
                            <button onClick={() => setShowAddModal(false)} className="px-5 py-2 text-sm font-bold text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all">Cancel</button>
                            <button onClick={confirmAddSection} className="px-6 py-2 bg-[#22c55e] text-white rounded-lg hover:bg-[#16a34a] text-sm font-bold shadow-md transition-all flex items-center gap-2">
                                <Plus size={16} /> Add Section
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AboutManager;
