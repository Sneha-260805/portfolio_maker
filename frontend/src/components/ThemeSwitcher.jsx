const THEMES = [
  { id: 'modern', label: 'Modern', bg: '#6366f1', desc: 'Clean indigo' },
  { id: 'dark',   label: 'Dark',   bg: '#1e1b4b', desc: 'Deep navy' },
  { id: 'fun',    label: 'Fun',    bg: 'linear-gradient(135deg,#f97316,#ec4899,#8b5cf6)', desc: 'Vibrant pop' },
];

function ThemeSwitcher({ theme, onChange }) {
  return (
    <div style={{ marginBottom: '20px' }}>
      <label>Theme</label>
      <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
        {THEMES.map((t) => (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            style={{
              flex: 1,
              background: t.bg,
              color: '#fff',
              border: theme === t.id ? '3px solid #f59e0b' : '3px solid transparent',
              borderRadius: '10px',
              padding: '10px 8px',
              cursor: 'pointer',
              fontWeight: theme === t.id ? '700' : '500',
              fontSize: '0.85rem',
              transition: 'all 0.18s',
              boxShadow: theme === t.id ? '0 0 0 2px #f59e0b44' : 'none',
            }}
          >
            <div>{t.label}</div>
            <div style={{ fontSize: '0.7rem', opacity: 0.8, marginTop: '2px' }}>{t.desc}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default ThemeSwitcher;
