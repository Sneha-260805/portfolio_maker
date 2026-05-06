import { useState } from 'react';

const emptyExperience = () => ({
  jobTitle: '',
  company: '',
  location: '',
  startDate: '',
  endDate: '',
  currentlyWorking: false,
  employmentType: '',
  description: [],
  skillsUsed: [],
});

const employmentTypes = [
  'Full-time',
  'Part-time',
  'Internship',
  'Freelance',
  'Contract',
  'Volunteer',
];

const formatDate = (value) => {
  if (!value) return '';
  const [year, month] = value.split('-');
  if (!year || !month) return value;
  return new Date(Number(year), Number(month) - 1).toLocaleString('en', {
    month: 'short',
    year: 'numeric',
  });
};

function ExperienceEditor({ experience, onChange }) {
  const [draft, setDraft] = useState(emptyExperience());
  const [descriptionText, setDescriptionText] = useState('');
  const [skillsText, setSkillsText] = useState('');
  const [error, setError] = useState('');

  const updateDraft = (field, value) => setDraft((prev) => ({ ...prev, [field]: value }));

  const handleAdd = () => {
    if (!draft.jobTitle.trim()) {
      setError('Job title is required');
      return;
    }

    const nextItem = {
      ...draft,
      jobTitle: draft.jobTitle.trim(),
      company: draft.company.trim(),
      location: draft.location.trim(),
      endDate: draft.currentlyWorking ? '' : draft.endDate,
      description: descriptionText
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean),
      skillsUsed: skillsText
        .split(',')
        .map((skill) => skill.trim())
        .filter(Boolean),
    };

    setError('');
    onChange([...experience, nextItem]);
    setDraft(emptyExperience());
    setDescriptionText('');
    setSkillsText('');
  };

  const handleRemove = (index) => onChange(experience.filter((_, i) => i !== index));

  return (
    <div style={styles.wrapper}>
      <label>Experience</label>

      {experience.map((item, i) => {
        const dateRange = [
          formatDate(item.startDate),
          item.currentlyWorking ? 'Present' : formatDate(item.endDate),
        ].filter(Boolean).join(' - ');
        const meta = [item.company, item.employmentType, item.location, dateRange].filter(Boolean).join(' | ');

        return (
          <div key={i} style={styles.card}>
            <div style={{ flex: 1 }}>
              <div style={styles.cardTitle}>{item.jobTitle}</div>
              {meta && <div style={styles.cardMeta}>{meta}</div>}
              {item.description?.length > 0 && (
                <ul style={styles.bullets}>
                  {item.description.map((line, index) => (
                    <li key={index}>{line}</li>
                  ))}
                </ul>
              )}
              {item.skillsUsed?.length > 0 && (
                <div style={styles.cardMeta}>Skills: {item.skillsUsed.join(', ')}</div>
              )}
            </div>
            <button onClick={() => handleRemove(i)} style={styles.removeBtn} title="Remove experience">x</button>
          </div>
        );
      })}

      <div style={styles.addBox}>
        <div style={styles.addTitle}>+ Add Experience</div>
        {error && <div style={styles.error}>{error}</div>}
        <input
          placeholder="Job Title *"
          value={draft.jobTitle}
          onChange={(e) => updateDraft('jobTitle', e.target.value)}
        />
        <input
          placeholder="Company / Organization"
          value={draft.company}
          onChange={(e) => updateDraft('company', e.target.value)}
        />
        <input
          placeholder="Location"
          value={draft.location}
          onChange={(e) => updateDraft('location', e.target.value)}
        />
        <select
          value={draft.employmentType}
          onChange={(e) => updateDraft('employmentType', e.target.value)}
        >
          <option value="">Employment Type</option>
          {employmentTypes.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
        <div style={styles.twoCol}>
          <input
            type="month"
            aria-label="Start date"
            value={draft.startDate}
            onChange={(e) => updateDraft('startDate', e.target.value)}
          />
          <input
            type="month"
            aria-label="End date"
            value={draft.endDate}
            disabled={draft.currentlyWorking}
            onChange={(e) => updateDraft('endDate', e.target.value)}
          />
        </div>
        <label style={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={draft.currentlyWorking}
            onChange={(e) => updateDraft('currentlyWorking', e.target.checked)}
            style={styles.checkbox}
          />
          Currently working here
        </label>
        <textarea
          placeholder="Responsibilities / achievements, one bullet per line"
          value={descriptionText}
          onChange={(e) => setDescriptionText(e.target.value)}
        />
        <input
          placeholder="Skills used (comma separated)"
          value={skillsText}
          onChange={(e) => setSkillsText(e.target.value)}
        />
        <button onClick={handleAdd} style={styles.addBtn}>Add Experience</button>
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
  bullets: { margin: '6px 0 6px 18px', color: '#64748b', fontSize: '0.82rem', lineHeight: 1.45 },
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
  twoCol: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '10px',
    textTransform: 'none',
    letterSpacing: 0,
    fontSize: '0.86rem',
    fontWeight: 600,
  },
  checkbox: { width: 'auto', margin: 0 },
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

export default ExperienceEditor;
