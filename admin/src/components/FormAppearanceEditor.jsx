import React from 'react';
import { Palette, Eye } from 'lucide-react';
import { ColorField } from './AppearanceEditor';

export const FORM_DEFAULTS = {
    sectionBg: '#F5F7FA', sectionTitle: '', sectionSubtitle: '', sectionTitleColor: '#1A365D', sectionSubtitleColor: '#4A5568',
    cardBg: '#FFFFFF', cardBorderColor: 'rgba(26,54,93,0.1)', cardRadius: 'md', cardShadow: 'subtle',
    labelColor: '#1A365D', inputBg: '#FFFFFF', inputBorderColor: 'rgba(26,54,93,0.2)', inputFocusColor: '#B8860B', inputRadius: 'sm',
    placeholderColor: '#9CA3AF', headingColor: '#1A365D', headingSeparator: true,
    btnBg: '#1A365D', btnText: '#FFFFFF', btnLabel: 'Submit Inquiry', btnRadius: 'sm', btnStyle: 'solid',
    btnHoverBg: '#152c4a',
};

const RADIUS_OPTIONS = [{ v: 'none', label: '0' }, { v: 'sm', label: '6' }, { v: 'md', label: '12' }, { v: 'lg', label: '16' }, { v: 'xl', label: '24' }];
const SHADOW_OPTIONS = [{ v: 'none', label: 'None' }, { v: 'subtle', label: 'Subtle' }, { v: 'medium', label: 'Medium' }, { v: 'strong', label: 'Strong' }];

const FormAppearanceEditor = ({ formStyles = {}, onChange }) => {
    const fs = { ...FORM_DEFAULTS, ...formStyles };
    const upd = (key, val) => onChange({ ...fs, [key]: val });

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2 text-sm font-bold text-gray-600 uppercase tracking-wider">
                <Palette size={16} className="text-purple-500" /> Form Design & Appearance
            </div>

            {/* Section Wrapper */}
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-4">
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Form Section Wrapper</div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <ColorField label="Section Background" value={fs.sectionBg} defaultValue="#F5F7FA" onChange={v => upd('sectionBg', v)} />
                    <ColorField label="Title Color" value={fs.sectionTitleColor} defaultValue="#1A365D" onChange={v => upd('sectionTitleColor', v)} />
                    <ColorField label="Subtitle/Description Color" value={fs.sectionSubtitleColor} defaultValue="#4A5568" onChange={v => upd('sectionSubtitleColor', v)} hint="Color for the subtitle text below the title" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Section Title</label>
                        <input value={fs.sectionTitle || ''} onChange={e => upd('sectionTitle', e.target.value)} className="input-field text-sm" placeholder="e.g. Request a Consultation" />
                        <p className="text-[10px] text-gray-400 mt-1">Main heading above the form</p>
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Section Subtitle / Description</label>
                        <textarea
                            value={fs.sectionSubtitle || ''}
                            onChange={e => upd('sectionSubtitle', e.target.value)}
                            className="input-field text-sm min-h-[80px] resize-y"
                            placeholder="e.g. Tell us about your business and we'll connect you with our Virtual CFO team."
                        />
                        <p className="text-[10px] text-gray-400 mt-1">Descriptive text shown below the title (this is what appears on the page)</p>
                    </div>
                </div>
            </div>

            {/* Form Card */}
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-4">
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Form Card</div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <ColorField label="Card Background" value={fs.cardBg} defaultValue="#FFFFFF" onChange={v => upd('cardBg', v)} />
                    <ColorField label="Card Border" value={fs.cardBorderColor} defaultValue="rgba(26,54,93,0.1)" onChange={v => upd('cardBorderColor', v)} />
                    <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Corner Radius</label>
                        <div className="flex bg-white p-1 rounded-lg border border-gray-200 h-8">
                            {RADIUS_OPTIONS.map(({ v, label }) => (
                                <button key={v} type="button" onClick={() => upd('cardRadius', v)}
                                    className={`flex-1 text-[10px] font-bold rounded transition-all ${(fs.cardRadius || 'md') === v ? 'bg-blue-500 text-white' : 'text-gray-400 hover:text-gray-600'}`}>{label}</button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Shadow</label>
                        <div className="flex bg-white p-1 rounded-lg border border-gray-200 h-8">
                            {SHADOW_OPTIONS.map(({ v, label }) => (
                                <button key={v} type="button" onClick={() => upd('cardShadow', v)}
                                    className={`flex-1 text-[9px] font-bold rounded transition-all ${(fs.cardShadow || 'subtle') === v ? 'bg-blue-500 text-white' : 'text-gray-400 hover:text-gray-600'}`}>{label}</button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Labels & Inputs */}
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-4">
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Fields & Labels</div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <ColorField label="Label Color" value={fs.labelColor} defaultValue="#1A365D" onChange={v => upd('labelColor', v)} />
                    <ColorField label="Input Background" value={fs.inputBg} defaultValue="#FFFFFF" onChange={v => upd('inputBg', v)} />
                    <ColorField label="Input Border" value={fs.inputBorderColor} defaultValue="rgba(26,54,93,0.2)" onChange={v => upd('inputBorderColor', v)} />
                    <ColorField label="Focus Ring" value={fs.inputFocusColor} defaultValue="#B8860B" onChange={v => upd('inputFocusColor', v)} />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <ColorField label="Placeholder Color" value={fs.placeholderColor} defaultValue="#9CA3AF" onChange={v => upd('placeholderColor', v)} hint="Color for placeholder text in inputs" />
                    <ColorField label="Heading Color" value={fs.headingColor} defaultValue="#1A365D" onChange={v => upd('headingColor', v)} />
                    <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Input Radius</label>
                        <div className="flex bg-white p-1 rounded-lg border border-gray-200 h-8">
                            {RADIUS_OPTIONS.map(({ v, label }) => (
                                <button key={v} type="button" onClick={() => upd('inputRadius', v)}
                                    className={`flex-1 text-[10px] font-bold rounded transition-all ${(fs.inputRadius || 'sm') === v ? 'bg-blue-500 text-white' : 'text-gray-400 hover:text-gray-600'}`}>{label}</button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Submit Button */}
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-4">
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Submit Button</div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <ColorField label="Button Background" value={fs.btnBg} defaultValue="#1A365D" onChange={v => upd('btnBg', v)} />
                    <ColorField label="Button Text" value={fs.btnText} defaultValue="#FFFFFF" onChange={v => upd('btnText', v)} />
                    <ColorField label="Hover Background" value={fs.btnHoverBg} defaultValue="#152c4a" onChange={v => upd('btnHoverBg', v)} />
                    <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Button Style</label>
                        <div className="flex bg-white p-1 rounded-lg border border-gray-200 h-8">
                            {[{ v: 'solid', label: 'Solid' }, { v: 'outline', label: 'Outline' }, { v: 'gradient', label: 'Gradient' }].map(({ v, label }) => (
                                <button key={v} type="button" onClick={() => upd('btnStyle', v)}
                                    className={`flex-1 text-[10px] font-bold rounded transition-all ${(fs.btnStyle || 'solid') === v ? 'bg-blue-500 text-white' : 'text-gray-400 hover:text-gray-600'}`}>{label}</button>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Button Label</label>
                        <input value={fs.btnLabel || ''} onChange={e => upd('btnLabel', e.target.value)} className="input-field text-sm font-bold" placeholder="Submit Inquiry" />
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Button Radius</label>
                        <div className="flex bg-white p-1 rounded-lg border border-gray-200 h-8">
                            {RADIUS_OPTIONS.map(({ v, label }) => (
                                <button key={v} type="button" onClick={() => upd('btnRadius', v)}
                                    className={`flex-1 text-[10px] font-bold rounded transition-all ${(fs.btnRadius || 'sm') === v ? 'bg-blue-500 text-white' : 'text-gray-400 hover:text-gray-600'}`}>{label}</button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Live Preview */}
                <div>
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1"><Eye size={10} /> Preview</div>
                    <div className="p-4 bg-white rounded-lg border border-gray-200 flex justify-center">
                        <button type="button" style={{
                            padding: '12px 32px', fontWeight: 600, fontSize: '0.95rem', cursor: 'default',
                            borderRadius: { none: 0, sm: 6, md: 12, lg: 16, xl: 24 }[fs.btnRadius || 'sm'] + 'px',
                            ...(fs.btnStyle === 'outline' ? { background: 'transparent', color: fs.btnBg || '#1A365D', border: `2px solid ${fs.btnBg || '#1A365D'}` }
                                : fs.btnStyle === 'gradient' ? { background: `linear-gradient(135deg, ${fs.btnBg || '#1A365D'}, ${fs.btnHoverBg || '#152c4a'})`, color: fs.btnText || '#FFFFFF', border: 'none' }
                                : { background: fs.btnBg || '#1A365D', color: fs.btnText || '#FFFFFF', border: 'none' })
                        }}>
                            {fs.btnLabel || 'Submit Inquiry'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FormAppearanceEditor;
