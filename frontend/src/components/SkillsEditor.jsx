import { useState } from 'react';

function SkillsEditor({ skills, onChange }) {
  const [input, setInput] = useState('');

  const addSkill = () => {
    const trimmed = input.trim();
    if (!trimmed || skills.includes(trimmed)) {
      setInput('');
      return;
    }
    onChange([...skills, trimmed]);
    setInput('');
  };

  const handleKeyDown = (e) => {
    // Add on Enter or comma
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addSkill();
    }
  };

  const handleRemove = (index) => onChange(skills.filter((_, i) => i !== index));

  return (
    <div style={{ marginBottom: '20px' }}>
      <label>Skills</label>

      {/* Skill tags */}
      <div style={styles.tagsRow}>
        {skills.map((s, i) => (
          <span key={i} style={styles.tag}>
            {s}
            <button
              onClick={() => handleRemove(i)}
              style={styles.tagRemove}
              title={`Remove ${s}`}
            >
              ×
            </button>
          </span>
        ))}
        {skills.length === 0 && (
          <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>No skills added yet</span>
        )}
      </div>

      {/* Input row */}
      <div style={styles.inputRow}>
        <input
          placeholder="Type a skill and press Enter or comma"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{ marginBottom: 0 }}
        />
        <button onClick={addSkill} style={styles.addBtn}>Add</button>
      </div>
    </div>
  );
}

const styles = {
  tagsRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginTop: '8px',
    marginBottom: '10px',
    minHeight: '32px',
    alignItems: 'center',
  },
  tag: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '5px',
    background: '#ede9fe',
    color: '#5b21b6',
    padding: '4px 10px 4px 12px',
    borderRadius: '20px',
    fontSize: '0.85rem',
    fontWeight: '500',
  },
  tagRemove: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#7c3aed',
    fontWeight: '700',
    fontSize: '1rem',
    lineHeight: 1,
    padding: 0,
  },
  inputRow: { display: 'flex', gap: '8px', alignItems: 'center' },
  addBtn: {
    background: '#6366f1',
    color: '#fff',
    border: 'none',
    borderRadius: '7px',
    padding: '9px 16px',
    fontWeight: '600',
    fontSize: '0.88rem',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    flexShrink: 0,
  },
};

export default SkillsEditor;
