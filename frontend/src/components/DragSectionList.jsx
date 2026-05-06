import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Standard section IDs — these map to dedicated form editors
const STANDARD_IDS = ['about', 'projects', 'skills', 'experience', 'contact'];

/** A single draggable + deletable row. */
function SortableItem({ id, label, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.45 : 1,
    zIndex: isDragging ? 999 : 'auto',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px 12px',
    background: isDragging ? '#ede9fe' : '#fff',
    border: `1px solid ${isDragging ? '#818cf8' : '#e2e8f0'}`,
    borderRadius: '8px',
    marginBottom: '8px',
    fontSize: '0.9rem',
    fontWeight: 500,
    color: '#374151',
    boxShadow: isDragging ? '0 4px 12px rgba(99,102,241,0.22)' : 'none',
    userSelect: 'none',
  };

  return (
    <div ref={setNodeRef} style={style}>
      {/* Drag handle — only this area is draggable */}
      <span
        {...attributes}
        {...listeners}
        style={{ color: '#94a3b8', fontSize: '1.1rem', cursor: 'grab', flexShrink: 0, lineHeight: 1 }}
        title="Drag to reorder"
      >
        ⠿⠿
      </span>

      {/* Section label */}
      <span style={{ flex: 1 }}>{label}</span>

      {/* Delete button */}
      <button
        onClick={() => onDelete(id)}
        title={`Remove "${label}"`}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: '#cbd5e1',
          fontSize: '1.1rem',
          lineHeight: 1,
          padding: '2px 6px',
          borderRadius: '4px',
          flexShrink: 0,
          transition: 'color 0.15s',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = '#ef4444')}
        onMouseLeave={(e) => (e.currentTarget.style.color = '#cbd5e1')}
      >
        ×
      </button>
    </div>
  );
}

/**
 * Drag-and-drop section list with add + delete support.
 *
 * Props:
 *   sectionOrder   — current ordered array of section IDs
 *   sectionLabels  — { [id]: displayLabel } for all sections (standard + custom)
 *   onOrderChange  — called with the new reordered array
 *   onAddSection   — called with the typed section name string
 *   onDeleteSection— called with the section ID to remove
 */
function DragSectionList({ sectionOrder, sectionLabels, onOrderChange, onAddSection, onDeleteSection }) {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = ({ active, over }) => {
    if (!over || active.id === over.id) return;
    const oldIndex = sectionOrder.indexOf(active.id);
    const newIndex = sectionOrder.indexOf(over.id);
    onOrderChange(arrayMove(sectionOrder, oldIndex, newIndex));
  };

  const handleAdd = () => {
    const name = input.trim();
    if (!name) return;

    const lc = name.toLowerCase();

    // Trying to add a standard section that's already present?
    if (STANDARD_IDS.includes(lc) && sectionOrder.includes(lc)) {
      setError(`"${name}" is already in your layout.`);
      return;
    }

    // Trying to add a custom section whose title already exists?
    const existingLabels = Object.values(sectionLabels).map((l) =>
      l.replace(/^[^\w\s]+\s*/, '').toLowerCase()  // strip leading emoji
    );
    if (!STANDARD_IDS.includes(lc) && existingLabels.includes(lc)) {
      setError(`A section named "${name}" already exists.`);
      return;
    }

    setError('');
    onAddSection(name);
    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') { e.preventDefault(); handleAdd(); }
  };

  return (
    <div style={{ marginBottom: '4px' }}>
      <label>
        Section Order{' '}
        <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0, color: '#94a3b8' }}>
          (drag · add · remove)
        </span>
      </label>

      {/* Sortable list */}
      <div style={{ marginTop: '8px' }}>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={sectionOrder} strategy={verticalListSortingStrategy}>
            {sectionOrder.map((id) => (
              <SortableItem
                key={id}
                id={id}
                label={sectionLabels[id] || id}
                onDelete={onDeleteSection}
              />
            ))}
          </SortableContext>
        </DndContext>

        {sectionOrder.length === 0 && (
          <div style={{ color: '#94a3b8', fontSize: '0.85rem', padding: '10px 0', textAlign: 'center' }}>
            No sections — add one below.
          </div>
        )}
      </div>

      {/* Add section input */}
      <div style={{ marginTop: '10px' }}>
        {error && (
          <div style={{ color: '#dc2626', fontSize: '0.8rem', marginBottom: '6px' }}>{error}</div>
        )}
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            placeholder='Add section — e.g. "Experience", "Awards"'
            value={input}
            onChange={(e) => { setInput(e.target.value); setError(''); }}
            onKeyDown={handleKeyDown}
            style={{ marginBottom: 0, fontSize: '0.88rem' }}
          />
          <button
            onClick={handleAdd}
            style={{
              background: '#6366f1',
              color: '#fff',
              border: 'none',
              borderRadius: '7px',
              padding: '0 16px',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
          >
            + Add
          </button>
        </div>
        <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '5px', lineHeight: 1.4 }}>
          Type "about", "projects", "skills", "experience", or "contact" to restore a removed standard section.
          Any other name creates a custom text section.
        </p>
      </div>
    </div>
  );
}

export default DragSectionList;
