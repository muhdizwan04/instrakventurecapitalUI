import React, { useState } from 'react';
import * as Icons from 'lucide-react';

const ICON_List = [
    'Activity', 'Award', 'BarChart2', 'Briefcase', 'Building', 'Building2', 'Calendar',
    'CheckCircle', 'ChevronRight', 'CircleDollarSign', 'Clock', 'Code', 'Coins', 'CreditCard',
    'Database', 'DollarSign', 'Eye', 'FileText', 'Flag', 'Folder', 'Globe', 'GraduationCap',
    'Growth', 'HardHat', 'Heart', 'Home', 'Image', 'Key', 'Landmark', 'Layers', 'Layout',
    'LineChart', 'Link', 'Lock', 'Mail', 'MapPin', 'MessageCircle', 'Monitor', 'MousePointer',
    'Package', 'PenTool', 'Phone', 'PieChart', 'PlayCircle', 'Plus', 'Power', 'Printer',
    'Rocket', 'Save', 'Search', 'Send', 'Settings', 'Share2', 'Shield', 'ShieldCheck',
    'ShoppingBag', 'Smartphone', 'Star', 'Sun', 'Tag', 'Target', 'Terminal', 'ThumbsUp',
    'Tool', 'Trash2', 'TrendingUp', 'Truck', 'Tv', 'User', 'Users', 'Video', 'Wallet',
    'Zap', 'Fuel', 'Car', 'Factory', 'Cpu', 'Scale'
];

const IconPicker = ({ value, onChange, compact = false }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');

    const filteredIcons = ICON_List.filter(iconName =>
        iconName.toLowerCase().includes(search.toLowerCase())
    );

    const SelectedIcon = Icons[value] || Icons.HelpCircle;

    return (
        <div className="relative">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-2 border border-[var(--border-light)] rounded-lg hover:bg-gray-50 transition-colors ${compact ? 'p-2 justify-center' : 'px-3 py-2 w-full text-left'}`}
            >
                <div className={`${compact ? 'w-6 h-6' : 'w-8 h-8'} bg-blue-50 text-blue-600 rounded flex items-center justify-center shrink-0`}>
                    <SelectedIcon size={compact ? 14 : 18} />
                </div>
                {!compact && (
                    <>
                        <span className="text-sm font-medium text-gray-700 flex-1">{value || 'Select Icon'}</span>
                        <Icons.ChevronDown size={16} className="text-gray-400" />
                    </>
                )}
            </button>

            {isOpen && (
                <div className="absolute z-50 top-full left-0 right-0 mt-2 bg-white border border-[var(--border-light)] rounded-lg shadow-xl p-3 w-64 max-h-64 flex flex-col">
                    <input
                        type="text"
                        placeholder="Search icons..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full px-3 py-2 border border-[var(--border-light)] rounded mb-2 text-sm outline-none focus:border-blue-500"
                        autoFocus
                    />
                    <div className="grid grid-cols-5 gap-2 overflow-y-auto min-h-0 custom-scrollbar">
                        {filteredIcons.map(iconName => {
                            const Icon = Icons[iconName];
                            if (!Icon) return null;
                            return (
                                <button
                                    key={iconName}
                                    type="button"
                                    onClick={() => {
                                        onChange(iconName);
                                        setIsOpen(false);
                                    }}
                                    className={`p-2 rounded hover:bg-blue-50 hover:text-blue-600 flex items-center justify-center transition-colors ${value === iconName ? 'bg-blue-100 text-blue-700 ring-1 ring-blue-300' : 'text-gray-500'}`}
                                    title={iconName}
                                >
                                    <Icon size={20} />
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default IconPicker;
