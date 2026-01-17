import React from 'react';
import { Edit } from 'lucide-react';

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

export default StyleControls;
