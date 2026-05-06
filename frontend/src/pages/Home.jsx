import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Home() {
  const [slug, setSlug] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLoad = (e) => {
    e.preventDefault();
    const trimmed = slug.trim();
    if (!trimmed) {
      setError('Please enter a portfolio slug');
      return;
    }
    navigate(`/editor/${trimmed}`);
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* Hero */}
        <div style={styles.badge}>✦ MERN Portfolio Builder</div>
        <h1 style={styles.title}>Build Your Portfolio<br />in Minutes</h1>
        <p style={styles.subtitle}>
          Drag-and-drop sections, choose a theme, preview live, and share your portfolio
          at a unique public URL — no sign-up required.
        </p>

        {/* CTA */}
        <Link to="/editor" style={styles.createBtn}>
          ✦ Create New Portfolio
        </Link>

        {/* Divider */}
        <div style={styles.divider}>
          <span style={styles.dividerText}>or load an existing one using its slug</span>
        </div>

        {/* Load existing form */}
        <form onSubmit={handleLoad} style={styles.loadForm}>
          <input
            placeholder="Enter your portfolio slug (e.g. jane-doe)"
            value={slug}
            onChange={(e) => { setSlug(e.target.value); setError(''); }}
            style={styles.slugInput}
          />
          <div style={styles.slugHelp}>
            New here? Click Create New Portfolio first. Your slug is created after you save and appears in your public URL.
          </div>
          {error && <div style={styles.error}>{error}</div>}
          <button type="submit" style={styles.loadBtn}>Load &amp; Edit →</button>
        </form>

        {/* Features */}
        <div style={styles.features}>
          {[
            ['🎨', 'Three themes', 'Modern, Dark, Minimal'],
            ['⠿', 'Drag & drop', 'Reorder sections freely'],
            ['⚡', 'Live preview', 'See changes instantly'],
            ['🔗', 'Public URL', 'Share with one link'],
            ['⬇', 'Download', 'Export as HTML file'],
            ['💾', 'MongoDB', 'Data persists across sessions'],
          ].map(([icon, title, desc]) => (
            <div key={title} style={styles.feature}>
              <span style={styles.featureIcon}>{icon}</span>
              <div>
                <div style={styles.featureTitle}>{title}</div>
                <div style={styles.featureDesc}>{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 20px',
  },
  card: {
    background: '#fff',
    borderRadius: '20px',
    padding: '52px 44px',
    maxWidth: '620px',
    width: '100%',
    boxShadow: '0 25px 60px rgba(0,0,0,0.2)',
    textAlign: 'center',
  },
  badge: {
    display: 'inline-block',
    background: '#ede9fe',
    color: '#6d28d9',
    padding: '5px 14px',
    borderRadius: '20px',
    fontSize: '0.78rem',
    fontWeight: 700,
    letterSpacing: '0.5px',
    marginBottom: '18px',
  },
  title: {
    fontSize: '2.4rem',
    fontWeight: 800,
    color: '#1e293b',
    lineHeight: 1.2,
    marginBottom: '14px',
  },
  subtitle: {
    color: '#64748b',
    fontSize: '1rem',
    lineHeight: 1.7,
    marginBottom: '32px',
  },
  createBtn: {
    display: 'inline-block',
    background: '#6366f1',
    color: '#fff',
    padding: '14px 36px',
    borderRadius: '10px',
    textDecoration: 'none',
    fontWeight: 700,
    fontSize: '1rem',
    transition: 'background 0.18s',
    boxShadow: '0 4px 14px rgba(99,102,241,0.4)',
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    margin: '28px 0',
    color: '#cbd5e1',
  },
  dividerText: {
    color: '#94a3b8',
    fontSize: '0.85rem',
    whiteSpace: 'nowrap',
    flex: 1,
  },
  loadForm: { textAlign: 'left' },
  slugInput: {
    width: '100%',
    padding: '11px 14px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '0.95rem',
    fontFamily: 'inherit',
    marginBottom: '8px',
  },
  slugHelp: {
    color: '#64748b',
    fontSize: '0.78rem',
    lineHeight: 1.45,
    margin: '-2px 0 10px',
    textAlign: 'center',
  },
  error: { color: '#dc2626', fontSize: '0.82rem', marginBottom: '8px' },
  loadBtn: {
    width: '100%',
    background: '#f1f5f9',
    color: '#374151',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    padding: '11px',
    fontWeight: 600,
    fontSize: '0.92rem',
    cursor: 'pointer',
  },
  features: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '14px',
    marginTop: '36px',
    textAlign: 'left',
  },
  feature: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
    padding: '12px',
    background: '#f8fafc',
    borderRadius: '10px',
    border: '1px solid #f1f5f9',
  },
  featureIcon: { fontSize: '1.2rem', marginTop: '1px' },
  featureTitle: { fontWeight: 600, fontSize: '0.88rem', color: '#1e293b' },
  featureDesc: { fontSize: '0.78rem', color: '#94a3b8', marginTop: '2px' },
};

export default Home;
