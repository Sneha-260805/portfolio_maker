import { useState } from 'react';

const emptyProject = () => ({
  title: '',
  description: '',
  techStack: '',
  githubLink: '',
  liveLink: '',
});

function ProjectEditor({ projects, onChange }) {
  const [draft, setDraft] = useState(emptyProject());
  const [error, setError] = useState('');

  const updateDraft = (field, value) => setDraft((prev) => ({ ...prev, [field]: value }));

  const handleAdd = () => {
    if (!draft.title.trim()) {
      setError('Project title is required');
      return;
    }
    setError('');
    onChange([...projects, { ...draft }]);
    setDraft(emptyProject());
  };

  const handleRemove = (index) => onChange(projects.filter((_, i) => i !== index));

  return (
    <div style={styles.wrapper}>
      <label>Projects</label>

      {/* Existing project cards */}
      {projects.map((p, i) => (
        <div key={i} style={styles.card}>
          <div style={{ flex: 1 }}>
            <div style={styles.cardTitle}>{p.title}</div>
            {p.description && <div style={styles.cardMeta}>{p.description}</div>}
            {p.techStack && <div style={styles.cardMeta}>🛠 {p.techStack}</div>}
            <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
              {p.githubLink && <a href={p.githubLink} target="_blank" rel="noreferrer" style={styles.link}>GitHub</a>}
              {p.liveLink && <a href={p.liveLink} target="_blank" rel="noreferrer" style={styles.link}>Live</a>}
            </div>
          </div>
          <button onClick={() => handleRemove(i)} style={styles.removeBtn} title="Remove project">✕</button>
        </div>
      ))}

      {/* Add-new form */}
      <div style={styles.addBox}>
        <div style={styles.addTitle}>+ Add Project</div>
        {error && <div style={styles.error}>{error}</div>}
        <input
          placeholder="Project Title *"
          value={draft.title}
          onChange={(e) => updateDraft('title', e.target.value)}
        />
        <textarea
          placeholder="Description"
          value={draft.description}
          onChange={(e) => updateDraft('description', e.target.value)}
          style={{ minHeight: '70px' }}
        />
        <input
          placeholder="Tech Stack (e.g. React, Node.js, MongoDB)"
          value={draft.techStack}
          onChange={(e) => updateDraft('techStack', e.target.value)}
        />
        <input
          placeholder="GitHub Link"
          value={draft.githubLink}
          onChange={(e) => updateDraft('githubLink', e.target.value)}
        />
        <input
          placeholder="Live Demo Link"
          value={draft.liveLink}
          onChange={(e) => updateDraft('liveLink', e.target.value)}
        />
        <button onClick={handleAdd} style={styles.addBtn}>Add Project</button>
      </div>
    </div>
  );
}

const styles = {
  wrapper: { marginBottom: '20px' },
  card: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
    padding: '12px 14px',
    background: '#fff',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    marginTop: '8px',
  },
  cardTitle: { fontWeight: '600', fontSize: '0.95rem', color: '#1e293b', marginBottom: '4px' },
  cardMeta: { fontSize: '0.82rem', color: '#64748b', marginBottom: '2px' },
  link: { fontSize: '0.8rem', color: '#6366f1', textDecoration: 'none' },
  removeBtn: {
    background: 'none',
    border: 'none',
    color: '#ef4444',
    cursor: 'pointer',
    fontSize: '0.9rem',
    padding: '2px 4px',
    borderRadius: '4px',
    flexShrink: 0,
  },
  addBox: {
    border: '2px dashed #e2e8f0',
    borderRadius: '10px',
    padding: '16px',
    marginTop: '12px',
    background: '#f8fafc',
  },
  addTitle: { fontWeight: '600', fontSize: '0.9rem', color: '#475569', marginBottom: '12px' },
  error: { fontSize: '0.82rem', color: '#dc2626', marginBottom: '8px' },
  addBtn: {
    background: '#6366f1',
    color: '#fff',
    border: 'none',
    borderRadius: '7px',
    padding: '9px 18px',
    fontWeight: '600',
    fontSize: '0.88rem',
    cursor: 'pointer',
    marginTop: '4px',
  },
};

export default ProjectEditor;
