import React from 'react';

const mini = { w: 120, h: 72 };
const c = { text: '#94a3b8', accent: '#3b82f6', bg: '#f1f5f9', line: '#cbd5e1', card: '#ffffff' };

const Thumb = ({ children }) => (
    <svg viewBox={`0 0 ${mini.w} ${mini.h}`} fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <rect width={mini.w} height={mini.h} rx="4" fill={c.bg} />
        {children}
    </svg>
);

const previews = {
    standard: (
        <Thumb>
            <rect x="20" y="12" width="80" height="4" rx="2" fill={c.accent} />
            <rect x="30" y="22" width="60" height="3" rx="1.5" fill={c.line} />
            <rect x="15" y="32" width="90" height="2" rx="1" fill={c.text} />
            <rect x="15" y="38" width="90" height="2" rx="1" fill={c.text} />
            <rect x="15" y="44" width="70" height="2" rx="1" fill={c.text} />
            <rect x="15" y="54" width="90" height="2" rx="1" fill={c.text} />
            <rect x="15" y="60" width="50" height="2" rx="1" fill={c.text} />
        </Thumb>
    ),
    'mission-card': (
        <Thumb>
            <rect x="10" y="8" width="46" height="56" rx="4" fill={c.card} stroke={c.line} strokeWidth="0.8" />
            <rect x="16" y="14" width="34" height="3" rx="1.5" fill={c.accent} />
            <rect x="16" y="22" width="30" height="2" rx="1" fill={c.text} />
            <rect x="16" y="27" width="34" height="2" rx="1" fill={c.text} />
            <rect x="16" y="32" width="20" height="2" rx="1" fill={c.text} />
            <rect x="64" y="8" width="46" height="56" rx="4" fill={c.card} stroke={c.line} strokeWidth="0.8" />
            <rect x="70" y="14" width="34" height="3" rx="1.5" fill={c.accent} />
            <rect x="70" y="22" width="30" height="2" rx="1" fill={c.text} />
            <rect x="70" y="27" width="34" height="2" rx="1" fill={c.text} />
            <rect x="70" y="32" width="20" height="2" rx="1" fill={c.text} />
        </Thumb>
    ),
    list: (
        <Thumb>
            <rect x="20" y="8" width="80" height="4" rx="2" fill={c.accent} />
            {[20, 32, 44, 56].map((y, i) => (
                <g key={i}>
                    <circle cx="18" cy={y + 2} r="3" fill={c.accent} opacity="0.4" />
                    <rect x="26" y={y} width="60" height="3" rx="1.5" fill={c.text} />
                    <rect x="26" y={y + 5} width="40" height="2" rx="1" fill={c.line} />
                </g>
            ))}
        </Thumb>
    ),
    grid: (
        <Thumb>
            <rect x="20" y="6" width="80" height="4" rx="2" fill={c.accent} />
            {[[8, 18], [42, 18], [76, 18]].map(([x, y], i) => (
                <g key={i}>
                    <rect x={x} y={y} width="32" height="46" rx="3" fill={c.card} stroke={c.line} strokeWidth="0.8" />
                    <circle cx={x + 16} cy={y + 12} r="6" fill={c.accent} opacity="0.2" />
                    <rect x={x + 5} y={y + 24} width="22" height="3" rx="1.5" fill={c.text} />
                    <rect x={x + 5} y={y + 30} width="18" height="2" rx="1" fill={c.line} />
                    <rect x={x + 5} y={y + 35} width="22" height="2" rx="1" fill={c.line} />
                </g>
            ))}
        </Thumb>
    ),
    cards: (
        <Thumb>
            {[[8, 10], [42, 10], [76, 10]].map(([x, y], i) => (
                <g key={i}>
                    <rect x={x} y={y} width="32" height="52" rx="4" fill={c.card} stroke={c.accent} strokeWidth="0.6" opacity="0.9" />
                    <rect x={x + 4} y={y + 6} width="24" height="3" rx="1.5" fill={c.accent} />
                    <rect x={x + 4} y={y + 14} width="20" height="2" rx="1" fill={c.text} />
                    <rect x={x + 4} y={y + 19} width="24" height="2" rx="1" fill={c.text} />
                    <rect x={x + 4} y={y + 24} width="16" height="2" rx="1" fill={c.text} />
                    <rect x={x + 4} y={y + 38} width="18" height="6" rx="3" fill={c.accent} opacity="0.2" />
                </g>
            ))}
        </Thumb>
    ),
    accordion: (
        <Thumb>
            <rect x="20" y="6" width="80" height="4" rx="2" fill={c.accent} />
            {[16, 30, 44, 56].map((y, i) => (
                <g key={i}>
                    <rect x="12" y={y} width="96" height={i === 1 ? 10 : 8} rx="2" fill={c.card} stroke={c.line} strokeWidth="0.6" />
                    <rect x="18" y={y + 3} width="40" height="2" rx="1" fill={i === 1 ? c.accent : c.text} />
                    <polygon points={i === 1 ? `${100},${y + 2} ${104},${y + 2} ${102},${y + 6}` : `${100},${y + 6} ${104},${y + 6} ${102},${y + 2}`} fill={c.line} />
                </g>
            ))}
        </Thumb>
    ),
    'boxed-group': (
        <Thumb>
            <rect x="8" y="6" width="104" height="60" rx="4" fill={c.card} stroke={c.accent} strokeWidth="1" />
            <rect x="14" y="12" width="50" height="3" rx="1.5" fill={c.accent} />
            {[22, 34, 46].map((y, i) => (
                <g key={i}>
                    <circle cx="20" cy={y + 2} r="3" fill={c.accent} opacity="0.3" />
                    <rect x="28" y={y} width="60" height="3" rx="1.5" fill={c.text} />
                    <rect x="28" y={y + 5} width="40" height="2" rx="1" fill={c.line} />
                </g>
            ))}
        </Thumb>
    ),
    'mind-map': (
        <Thumb>
            <rect x="40" y="26" width="40" height="20" rx="10" fill={c.accent} opacity="0.2" />
            <rect x="48" y="33" width="24" height="3" rx="1.5" fill={c.accent} />
            {[[8, 8, 30, 30], [84, 8, 76, 30], [8, 50, 30, 42], [84, 50, 76, 42]].map(([x, y, lx, ly], i) => (
                <g key={i}>
                    <rect x={x} y={y} width="28" height="14" rx="3" fill={c.card} stroke={c.line} strokeWidth="0.6" />
                    <rect x={x + 4} y={y + 4} width="20" height="2" rx="1" fill={c.text} />
                    <rect x={x + 4} y={y + 8} width="14" height="2" rx="1" fill={c.line} />
                    <line x1={lx} y1={ly} x2={x < 40 ? x + 28 : x} y2={y + 7} stroke={c.line} strokeWidth="0.6" />
                </g>
            ))}
        </Thumb>
    ),
    'icon-group': (
        <Thumb>
            <rect x="20" y="6" width="80" height="4" rx="2" fill={c.accent} />
            {[10, 38, 66, 94].map((x, i) => (
                <g key={i}>
                    <circle cx={x + 10} cy="30" r="10" fill={c.accent} opacity="0.15" />
                    <circle cx={x + 10} cy="30" r="4" fill={c.accent} opacity="0.5" />
                    <rect x={x + 2} y="44" width="16" height="2" rx="1" fill={c.text} />
                    <rect x={x + 4} y="50" width="12" height="2" rx="1" fill={c.line} />
                </g>
            ))}
        </Thumb>
    ),
    'image-grid': (
        <Thumb>
            {[[8, 8], [42, 8], [76, 8], [8, 40], [42, 40], [76, 40]].map(([x, y], i) => (
                <g key={i}>
                    <rect x={x} y={y} width="32" height="26" rx="3" fill={c.card} stroke={c.line} strokeWidth="0.6" />
                    <rect x={x + 2} y={y + 2} width="28" height="14" rx="2" fill={c.accent} opacity="0.1" />
                    <rect x={x + 5} y={y + 18} width="22" height="2" rx="1" fill={c.text} />
                    <rect x={x + 5} y={y + 22} width="16" height="2" rx="1" fill={c.line} />
                </g>
            ))}
        </Thumb>
    ),
    'profile-cards': (
        <Thumb>
            {[[8, 12], [42, 12], [76, 12]].map(([x, y], i) => (
                <g key={i}>
                    <rect x={x} y={y} width="32" height="50" rx="4" fill={c.card} stroke={c.line} strokeWidth="0.6" />
                    <circle cx={x + 16} cy={y + 14} r="8" fill={c.accent} opacity="0.15" />
                    <circle cx={x + 16} cy={y + 11} r="3" fill={c.line} />
                    <rect x={x + 10} y={y + 16} width="12" height="4" rx="2" fill={c.line} />
                    <rect x={x + 6} y={y + 28} width="20" height="2" rx="1" fill={c.text} />
                    <rect x={x + 8} y={y + 33} width="16" height="2" rx="1" fill={c.accent} opacity="0.5" />
                    <rect x={x + 6} y={y + 39} width="20" height="2" rx="1" fill={c.line} />
                </g>
            ))}
        </Thumb>
    ),
    'statement-block': (
        <Thumb>
            <rect x="10" y="10" width="100" height="52" rx="4" fill={c.card} stroke={c.accent} strokeWidth="0.8" />
            <rect x="18" y="18" width="6" height="12" rx="1" fill={c.accent} opacity="0.3" />
            <rect x="30" y="18" width="60" height="3" rx="1.5" fill={c.accent} />
            <rect x="30" y="26" width="70" height="2" rx="1" fill={c.text} />
            <rect x="30" y="32" width="70" height="2" rx="1" fill={c.text} />
            <rect x="30" y="38" width="50" height="2" rx="1" fill={c.text} />
            <rect x="30" y="48" width="40" height="3" rx="1.5" fill={c.text} />
            <rect x="30" y="54" width="30" height="2" rx="1" fill={c.line} />
        </Thumb>
    ),
    dialog: (
        <Thumb>
            {/* Person silhouette */}
            <circle cx="28" cy="24" r="10" fill={c.accent} opacity="0.15" />
            <circle cx="28" cy="21" r="4" fill={c.line} />
            <rect x="20" y="27" width="16" height="8" rx="4" fill={c.line} />
            {/* Speech bubble */}
            <rect x="46" y="10" width="64" height="36" rx="6" fill={c.card} stroke={c.accent} strokeWidth="0.8" />
            <polygon points="46,28 38,32 46,34" fill={c.card} stroke={c.accent} strokeWidth="0.8" strokeLinejoin="round" />
            <rect x="46" y="27" width="4" height="8" fill={c.card} />
            <rect x="52" y="17" width="50" height="2" rx="1" fill={c.text} />
            <rect x="52" y="23" width="46" height="2" rx="1" fill={c.text} />
            <rect x="52" y="29" width="36" height="2" rx="1" fill={c.text} />
            <rect x="52" y="35" width="24" height="2" rx="1" fill={c.line} />
            {/* Name area */}
            <rect x="14" y="48" width="40" height="3" rx="1.5" fill={c.text} />
            <rect x="18" y="54" width="32" height="2" rx="1" fill={c.accent} opacity="0.5" />
        </Thumb>
    ),
};

const LAYOUT_META = [
    { value: 'standard', label: 'Standard Text', desc: 'Simple paragraph content' },
    { value: 'mission-card', label: 'Mission Card', desc: 'Side-by-side glass cards' },
    { value: 'list', label: 'Professional List', desc: 'Bulleted list with icons' },
    { value: 'grid', label: 'Feature Grid', desc: '3-column card grid' },
    { value: 'cards', label: 'Interactive Cards', desc: 'Clickable styled cards' },
    { value: 'accordion', label: 'Accordion', desc: 'Expandable sections' },
    { value: 'boxed-group', label: 'Command Box', desc: 'Bordered group with header' },
    { value: 'mind-map', label: 'Mind Map', desc: 'Hub-and-spoke layout' },
    { value: 'icon-group', label: 'Icon Group', desc: 'Icon circles with labels' },
    { value: 'image-grid', label: 'Image Grid', desc: 'Photo grid with captions' },
    { value: 'profile-cards', label: 'Profile Cards', desc: 'Person cards with photo' },
    { value: 'statement-block', label: 'Statement Block', desc: 'Quote block with attribution' },
    { value: 'dialog', label: 'Dialog / Quote', desc: 'Person photo with speech bubble' },
];

const LayoutPicker = ({ value, onChange }) => (
    <div>
        <label className="text-[10px] font-bold text-gray-400 uppercase block mb-2">Layout Type</label>
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-2">
            {LAYOUT_META.map(o => (
                <button
                    key={o.value}
                    type="button"
                    onClick={() => onChange(o.value)}
                    className={`relative rounded-xl border-2 text-center transition-all overflow-hidden group ${value === o.value ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-200' : 'border-gray-200 hover:border-gray-300 bg-white'}`}
                >
                    <div className="p-1.5">
                        {previews[o.value] || previews.standard}
                    </div>
                    <div className={`px-1 pb-2 ${value === o.value ? 'text-blue-700' : 'text-gray-500'}`}>
                        <span className="text-[10px] font-bold block leading-tight">{o.label}</span>
                        <span className="text-[8px] text-gray-400 block leading-tight mt-0.5 group-hover:text-gray-500">{o.desc}</span>
                    </div>
                    {value === o.value && (
                        <div className="absolute top-1 right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                            <svg width="8" height="8" viewBox="0 0 8 8" fill="none"><path d="M1.5 4L3 5.5L6.5 2" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        </div>
                    )}
                </button>
            ))}
        </div>
    </div>
);

export { LAYOUT_META, previews };
export default LayoutPicker;
