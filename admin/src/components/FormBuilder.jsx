import React from 'react';
import { Plus, Trash2, GripVertical, Settings2, CheckCircle2, Circle } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const FIELD_TYPES = [
    { value: 'text', label: 'Single Line Text' },
    { value: 'email', label: 'Email Address' },
    { value: 'tel', label: 'Phone Number' },
    { value: 'number', label: 'Number' },
    { value: 'textarea', label: 'Multi-line Text' },
    { value: 'select', label: 'Dropdown Select' },
    { value: 'checkbox', label: 'Checkbox' },
    { value: 'heading', label: 'Section Heading' },
    { value: 'section', label: 'Visual Separator (Line)' }
];

const FormBuilder = ({ fields = [], onChange }) => {
    const addField = () => {
        const newField = {
            id: `field_${Date.now()}`,
            label: 'New Field',
            type: 'text',
            required: false,
            width: 'full',
            placeholder: '',
            options: [] // for select type
        };
        onChange([...fields, newField]);
    };

    const removeField = (id) => {
        onChange(fields.filter(f => f.id !== id));
    };

    const updateField = (id, updates) => {
        onChange(fields.map(f => f.id === id ? { ...f, ...updates } : f));
    };

    const handleDragEnd = (result) => {
        if (!result.destination) return;
        const items = Array.from(fields);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        onChange(items);
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-[var(--accent-primary)]">Form Configuration</h3>
                <button 
                    type="button" 
                    onClick={addField}
                    className="flex items-center gap-2 px-3 py-1.5 bg-[var(--accent-primary)] text-white rounded-md hover:bg-opacity-90 transition-all text-sm font-medium"
                >
                    <Plus size={16} /> Add Field
                </button>
            </div>

            {fields.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
                    <p className="text-gray-500">No fields added yet. Click "Add Field" to start building the form.</p>
                </div>
            ) : (
                <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="form-fields">
                        {(provided) => (
                            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                                {fields.map((field, index) => (
                                    <Draggable key={field.id} draggableId={field.id} index={index}>
                                        {(provided, snapshot) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                className={`bg-white border rounded-xl p-4 shadow-sm transition-all ${snapshot.isDragging ? 'shadow-xl ring-2 ring-[var(--accent-primary)] ring-opacity-50' : 'hover:border-gray-300'}`}
                                            >
                                                <div className="flex items-start gap-3">
                                                    <div {...provided.dragHandleProps} className="mt-2 text-gray-400 hover:text-gray-600 cursor-grab">
                                                        <GripVertical size={20} />
                                                    </div>

                                                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                                        <div className="space-y-1">
                                                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Label</label>
                                                            <input 
                                                                type="text" 
                                                                value={field.label}
                                                                onChange={(e) => updateField(field.id, { label: e.target.value })}
                                                                className="w-full px-3 py-2 border rounded-md text-sm outline-none focus:ring-1 focus:ring-[var(--accent-primary)]"
                                                                placeholder="e.g., Company Name"
                                                            />
                                                        </div>

                                                        <div className="space-y-1">
                                                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</label>
                                                            <select 
                                                                value={field.type}
                                                                onChange={(e) => updateField(field.id, { type: e.target.value })}
                                                                className="w-full px-3 py-2 border rounded-md text-sm outline-none focus:ring-1 focus:ring-[var(--accent-primary)]"
                                                            >
                                                                {FIELD_TYPES.map(t => (
                                                                    <option key={t.value} value={t.value}>{t.label}</option>
                                                                ))}
                                                            </select>
                                                        </div>

                                                        <div className="space-y-1">
                                                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Width</label>
                                                            <select 
                                                                value={field.width || 'full'}
                                                                onChange={(e) => updateField(field.id, { width: e.target.value })}
                                                                className="w-full px-3 py-2 border rounded-md text-sm outline-none focus:ring-1 focus:ring-[var(--accent-primary)]"
                                                            >
                                                                <option value="full">Full Width</option>
                                                                <option value="half">Half Width</option>
                                                            </select>
                                                        </div>

                                                        <div className="flex items-end gap-3 pb-2">
                                                            <label className="flex items-center gap-2 cursor-pointer select-none">
                                                                <input 
                                                                    type="checkbox" 
                                                                    className="hidden"
                                                                    checked={field.required}
                                                                    onChange={(e) => updateField(field.id, { required: e.target.checked })}
                                                                />
                                                                {field.required ? (
                                                                    <CheckCircle2 size={18} className="text-green-600" />
                                                                ) : (
                                                                    <Circle size={18} className="text-gray-300" />
                                                                )}
                                                                <span className={`text-sm ${field.required ? 'text-green-600 font-medium' : 'text-gray-500'}`}>Required</span>
                                                            </label>

                                                            <div className="flex-1"></div>

                                                            <button 
                                                                type="button"
                                                                onClick={() => removeField(field.id)}
                                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-all"
                                                                title="Delete Field"
                                                            >
                                                                <Trash2 size={18} />
                                                            </button>
                                                        </div>

                                                        {field.type === 'select' && (
                                                            <div className="col-span-full space-y-1 mt-2">
                                                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Options (comma separated)</label>
                                                                <input 
                                                                    type="text" 
                                                                    value={field.options?.join(', ') || ''}
                                                                    onChange={(e) => updateField(field.id, { options: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                                                                    className="w-full px-3 py-2 border rounded-md text-sm outline-none focus:ring-1 focus:ring-[var(--accent-primary)]"
                                                                    placeholder="Option 1, Option 2, Option 3"
                                                                />
                                                            </div>
                                                        )}

                                                        <div className="col-span-full space-y-1 mt-1">
                                                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Placeholder (optional)</label>
                                                            <input 
                                                                type="text" 
                                                                value={field.placeholder || ''}
                                                                onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
                                                                className="w-full px-3 py-2 border rounded-md text-sm outline-none focus:ring-1 focus:ring-[var(--accent-primary)]"
                                                                placeholder="e.g., Enter your company name"
                                                            />
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
                </DragDropContext>
            )}
        </div>
    );
};

export default FormBuilder;
