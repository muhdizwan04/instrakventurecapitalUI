import React, { useState } from 'react';
import {
    Palette, AlignLeft, AlignCenter, AlignRight,
    Bold, Italic, Underline, Minus, Type, AArrowUp, Columns
} from 'lucide-react';

const ColorField = ({ label, value, defaultValue = '#000000', onChange, hint, gradient, styles, onGradientChange }) => {
    const [showGrad, setShowGrad] = useState(!!styles?.bgGradient);
    const display = value || defaultValue;

    return (
        <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">{label}</label>
            <div className="flex items-center gap-2">
                <input type="color" value={display} onChange={e => onChange(e.target.value)} className="w-8 h-8 rounded border cursor-pointer" />
                <input type="text" value={display} onChange={e => onChange(e.target.value)} className="input-field text-[10px] font-mono flex-1 py-1" />
            </div>
            {gradient && (
                <>
                    <button type="button" onClick={() => setShowGrad(!showGrad)} className="text-[10px] text-blue-500 mt-1 hover:underline">
                        {showGrad ? 'Hide gradient' : '+ Gradient'}
                    </button>
                    {showGrad && (
                        <div className="mt-1">
                            <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Gradient To</label>
                            <div className="flex items-center gap-2">
                                <input type="color" value={styles?.bgGradient || '#1A365D'} onChange={e => onGradientChange(e.target.value)} className="w-8 h-8 rounded border cursor-pointer" />
                                <input type="text" value={styles?.bgGradient || '#1A365D'} onChange={e => onGradientChange(e.target.value)} className="input-field text-[10px] font-mono flex-1 py-1" />
                            </div>
                        </div>
                    )}
                </>
            )}
            {hint && <p className="text-[10px] text-gray-400 mt-0.5">{hint}</p>}
        </div>
    );
};

const AlignPicker = ({ label, value, defaultValue = 'left', onChange, options }) => {
    const opts = options || [
        { v: 'left', icon: AlignLeft },
        { v: 'center', icon: AlignCenter },
        { v: 'right', icon: AlignRight },
    ];
    return (
        <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">{label}</label>
            <div className="flex bg-white p-1 rounded-lg border border-gray-200 h-8">
                {opts.map(({ v, icon: Icon }) => (
                    <button key={v} type="button" onClick={() => onChange(v)}
                        className={`flex-1 flex items-center justify-center rounded text-xs transition-all ${(value || defaultValue) === v ? 'bg-blue-500 text-white' : 'text-gray-400 hover:text-gray-600'}`}>
                        <Icon size={14} />
                    </button>
                ))}
            </div>
        </div>
    );
};

/**
 * Shared appearance editor for admin section styling.
 *
 * @param {object}   styles       Current styles object
 * @param {function} onChange     Called with the full updated styles object
 * @param {Array}    colorFields  [{ key, label, default, gradient?, hint? }]
 * @param {Array}    features     Subset of: 'cardStyle','alignment','titleStyle','titleSize','subtitleSize','contentSize'
 */
const AppearanceEditor = ({
    styles = {},
    onChange,
    colorFields = [],
    features = [],
}) => {
    const update = (field, value) => onChange({ ...styles, [field]: value });
    const has = (f) => features.includes(f);

    return (
        <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
                <Palette size={14} /> Appearance
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {colorFields.map(cf => (
                    <ColorField
                        key={cf.key}
                        label={cf.label}
                        value={styles[cf.key]}
                        defaultValue={cf.default}
                        onChange={v => update(cf.key, v)}
                        hint={cf.hint}
                        gradient={cf.gradient}
                        styles={styles}
                        onGradientChange={cf.gradient ? v => update('bgGradient', v) : undefined}
                    />
                ))}

                {has('cardStyle') && (
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
                )}

                {has('alignment') && (
                    <>
                        <AlignPicker label="Title Align" value={styles.textAlign} onChange={v => update('textAlign', v)} />
                        <AlignPicker label="Subtitle Align" value={styles.subtitleAlign} defaultValue="center" onChange={v => update('subtitleAlign', v)} />
                        <AlignPicker label="Content Align" value={styles.contentAlign} onChange={v => update('contentAlign', v)} />
                    </>
                )}
            </div>

            {has('titleStyle') && (
                <div>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                        <Type size={12} /> Title Style
                    </div>
                    <div className="flex bg-white p-1 rounded-lg border border-gray-200 h-9 gap-0.5">
                        <button type="button" onClick={() => update('titleFontWeight', styles.titleFontWeight === 'bold' ? 'normal' : 'bold')}
                            className={`flex-1 flex items-center justify-center rounded text-xs font-bold transition-all ${styles.titleFontWeight === 'bold' ? 'bg-blue-500 text-white' : 'text-gray-400 hover:text-gray-600'}`}
                            title="Bold"><Bold size={14} /></button>
                        <button type="button" onClick={() => update('titleFontStyle', styles.titleFontStyle === 'italic' ? 'normal' : 'italic')}
                            className={`flex-1 flex items-center justify-center rounded text-xs transition-all ${styles.titleFontStyle === 'italic' ? 'bg-blue-500 text-white' : 'text-gray-400 hover:text-gray-600'}`}
                            title="Italic"><Italic size={14} /></button>
                        <button type="button" onClick={() => update('titleTextDecoration', styles.titleTextDecoration === 'underline' ? 'none' : 'underline')}
                            className={`flex-1 flex items-center justify-center rounded text-xs transition-all ${styles.titleTextDecoration === 'underline' ? 'bg-blue-500 text-white' : 'text-gray-400 hover:text-gray-600'}`}
                            title="Underline"><Underline size={14} /></button>
                        <button type="button" onClick={() => { update('titleFontWeight', 'normal'); update('titleFontStyle', 'normal'); update('titleTextDecoration', 'none'); }}
                            className={`flex-1 flex items-center justify-center rounded text-xs transition-all ${(!styles.titleFontWeight || styles.titleFontWeight === 'normal') && (!styles.titleFontStyle || styles.titleFontStyle === 'normal') && (!styles.titleTextDecoration || styles.titleTextDecoration === 'none') ? 'bg-gray-200 text-gray-700' : 'text-gray-400 hover:text-gray-600'}`}
                            title="Reset to Normal"><Minus size={14} /></button>
                    </div>
                    <div className="mt-2 px-3 py-2 bg-white rounded border border-gray-100">
                        <span className="text-xs text-gray-400">Preview: </span>
                        <span style={{
                            fontWeight: styles.titleFontWeight || 'normal',
                            fontStyle: styles.titleFontStyle || 'normal',
                            textDecoration: styles.titleTextDecoration || 'none',
                            fontSize: '14px',
                            color: styles.titleColor || styles.textColor || '#1A365D'
                        }}>Sample Title Text</span>
                    </div>
                </div>
            )}

            {has('titleSize') && (
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
            )}

            {has('subtitleSize') && (
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
            )}

            {has('contentSize') && (
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
            )}

            {has('boxWidth') && (
                <div>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                        <Columns size={12} /> Box Width
                    </div>
                    <div className="flex bg-white p-1 rounded-lg border border-gray-200 h-9 gap-0.5">
                        {[{ v: 'short', label: 'Short' }, { v: 'medium', label: 'Medium' }, { v: 'full', label: 'Full' }].map(({ v, label }) => (
                            <button key={v} type="button" onClick={() => update('boxWidth', v)}
                                className={`flex-1 flex items-center justify-center rounded text-[11px] font-bold transition-all ${(styles.boxWidth || 'medium') === v ? 'bg-blue-500 text-white' : 'text-gray-400 hover:text-gray-600'}`}>
                                {label}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {has('boxPosition') && (
                <div>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                        <AlignCenter size={12} /> Box Position
                    </div>
                    <div className="flex bg-white p-1 rounded-lg border border-gray-200 h-9 gap-0.5">
                        {[{ v: 'left', icon: AlignLeft }, { v: 'center', icon: AlignCenter }, { v: 'right', icon: AlignRight }].map(({ v, icon: Icon }) => (
                            <button key={v} type="button" onClick={() => update('boxPosition', v)}
                                className={`flex-1 flex items-center justify-center rounded text-xs transition-all ${(styles.boxPosition || 'center') === v ? 'bg-blue-500 text-white' : 'text-gray-400 hover:text-gray-600'}`}>
                                <Icon size={14} />
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {has('contentPosition') && (
                <div>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                        <Type size={12} /> Content Position
                    </div>
                    <div className="flex bg-white p-1 rounded-lg border border-gray-200 h-9 gap-0.5">
                        {[{ v: 'header', label: 'Header' }, { v: 'footer', label: 'Footer' }, { v: 'both', label: 'Both' }].map(({ v, label }) => (
                            <button key={v} type="button" onClick={() => update('contentPosition', v)}
                                className={`flex-1 flex items-center justify-center rounded text-[11px] font-bold transition-all ${(styles.contentPosition || 'footer') === v ? 'bg-blue-500 text-white' : 'text-gray-400 hover:text-gray-600'}`}>
                                {label}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export { ColorField, AlignPicker };
export default AppearanceEditor;
