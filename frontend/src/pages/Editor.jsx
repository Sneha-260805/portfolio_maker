import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import LivePreview from '../components/LivePreview.jsx';
import ThemeSwitcher from '../components/ThemeSwitcher.jsx';
import ProjectEditor from '../components/ProjectEditor.jsx';
import SkillsEditor from '../components/SkillsEditor.jsx';
import ExperienceEditor from '../components/ExperienceEditor.jsx';
import ContactEditor from '../components/ContactEditor.jsx';
import DragSectionList from '../components/DragSectionList.jsx';
import { createPortfolio, updatePortfolio, getPortfolio } from '../services/portfolioService.js';

const initialData = {
  name: '',
  theme: 'modern',
  sectionOrder: ['about', 'projects', 'skills', 'experience', 'contact'],
  about: { title: '', description: '' },
  projects: [],
  skills: [],
  experience: [],
  contact: { email: '', phone: '', linkedin: '', github: '' },
  customSections: {}, // { [id]: { title, body } }
};

// Labels for the 4 fixed sections shown in DragSectionList
const STANDARD_LABELS = {
  about:    '👤 About',
  projects: '🚀 Projects',
  skills:   '🛠 Skills',
  experience: 'Experience',
  contact:  '📬 Contact',
};

const STANDARD_IDS = ['about', 'projects', 'skills', 'experience', 'contact'];

const normalizeSectionOrder = (order = initialData.sectionOrder) => {
  const nextOrder = order.length ? [...order] : [...initialData.sectionOrder];
  if (nextOrder.includes('experience')) return nextOrder;

  const contactIndex = nextOrder.indexOf('contact');
  if (contactIndex === -1) return [...nextOrder, 'experience'];

  nextOrder.splice(contactIndex, 0, 'experience');
  return nextOrder;
};

function Editor() {
  const { slug: urlSlug } = useParams();
  const [formData, setFormData] = useState(initialData);
  const [slug, setSlug] = useState(urlSlug || null);
  const [isFetching, setIsFetching] = useState(false); // true while loading an existing portfolio
  const [isSaving, setIsSaving] = useState(false);     // true while POST/PUT is in flight
  const [fetchError, setFetchError] = useState(null);
  const [saveError, setSaveError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [activePanel, setActivePanel] = useState('editor'); // 'editor' | 'preview' (mobile toggle)

  // Load existing portfolio when navigating to /editor/:slug
  useEffect(() => {
    if (!urlSlug) return;
    setIsFetching(true);
    setFetchError(null);
    getPortfolio(urlSlug)
      .then((res) => {
        const p = res.data;
        setFormData({
          name: p.name || '',
          theme: p.theme || 'modern',
          sectionOrder: normalizeSectionOrder(p.sectionOrder),
          about: p.about || initialData.about,
          projects: p.projects || [],
          skills: p.skills || [],
          experience: p.experience || [],
          contact: p.contact || initialData.contact,
          customSections: p.customSections || {},
        });
        setSlug(urlSlug);
      })
      .catch(() => setFetchError('Portfolio not found. Check the slug and try again.'))
      .finally(() => setIsFetching(false));
  }, [urlSlug]);

  // Partial updater — keeps the rest of formData intact
  const update = (key, value) => setFormData((prev) => ({ ...prev, [key]: value }));

  // Add a section by name. Standard names re-add
  // a removed standard section; anything else creates a new custom section.
  const handleAddSection = (name) => {
    const lc = name.trim().toLowerCase();
    if (STANDARD_IDS.includes(lc)) {
      if (!formData.sectionOrder.includes(lc)) {
        update('sectionOrder', [...formData.sectionOrder, lc]);
      }
      return;
    }
    const id = `custom-${Date.now()}`;
    setFormData((prev) => ({
      ...prev,
      sectionOrder: [...prev.sectionOrder, id],
      customSections: { ...prev.customSections, [id]: { title: name.trim(), body: '' } },
    }));
  };

  // Remove a section from the order. Also deletes custom section data.
  const handleDeleteSection = (id) => {
    setFormData((prev) => {
      const newOrder = prev.sectionOrder.filter((s) => s !== id);
      const newCustom = { ...prev.customSections };
      if (!STANDARD_IDS.includes(id)) delete newCustom[id];
      return { ...prev, sectionOrder: newOrder, customSections: newCustom };
    });
  };

  const handleSave = async () => {
    setSaveError(null);
    setSuccessMsg(null);

    if (!formData.name.trim()) {
      setSaveError('Name is required before saving.');
      return;
    }

    setIsSaving(true);
    try {
      if (slug) {
        await updatePortfolio(slug, formData);
        setSuccessMsg(`Portfolio updated! Public URL: http://localhost:5000/p/${slug}`);
      } else {
        const res = await createPortfolio(formData);
        const newSlug = res.data.slug;
        setSlug(newSlug);
        // Update the browser URL without reloading
        window.history.replaceState({}, '', `/editor/${newSlug}`);
        setSuccessMsg(`Portfolio saved! Public URL: http://localhost:5000/p/${newSlug}`);
      }
    } catch (err) {
      setSaveError(err.response?.data?.error || 'Failed to save portfolio. Is the backend running?');
    } finally {
      setIsSaving(false);
    }
  };

  if (fetchError) {
    return (
      <div style={styles.centered}>
        <div style={styles.errorBox}>
          <h2 style={{ marginBottom: '10px' }}>404 — Portfolio not found</h2>
          <p style={{ color: '#64748b', marginBottom: '20px' }}>{fetchError}</p>
          <Link to="/" style={styles.backLink}>← Back to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.root}>
      {/* ── Top bar ────────────────────────────────────────────── */}
      <div style={styles.topBar}>
        <Link to="/" style={styles.logoLink}>← Portfolio Builder</Link>

        {/* Mobile: toggle editor/preview */}
        <div style={styles.mobileToggle}>
          <button
            style={{ ...styles.toggleBtn, ...(activePanel === 'editor' ? styles.toggleActive : {}) }}
            onClick={() => setActivePanel('editor')}
          >
            Editor
          </button>
          <button
            style={{ ...styles.toggleBtn, ...(activePanel === 'preview' ? styles.toggleActive : {}) }}
            onClick={() => setActivePanel('preview')}
          >
            Preview
          </button>
        </div>

        <button onClick={handleSave} disabled={isSaving || isFetching} style={styles.saveBtn}>
          {isSaving ? 'Saving…' : slug ? 'Update Portfolio' : 'Save Portfolio'}
        </button>
      </div>

      {/* ── Main layout ─────────────────────────────────────────── */}
      <div style={styles.layout}>

        {/* LEFT — Editor panel: hidden when Preview mode is active */}
        <div style={{ ...styles.editorPanel, ...(activePanel === 'preview' ? { display: 'none' } : {}) }}>
          {isFetching && (
            <div style={styles.loadingBanner}>Loading portfolio…</div>
          )}

          {/* Name */}
          <div style={styles.section}>
            <label>Full Name *</label>
            <input
              placeholder="e.g. Jane Doe"
              value={formData.name}
              onChange={(e) => update('name', e.target.value)}
            />
          </div>

          {/* Theme */}
          <div style={styles.section}>
            <ThemeSwitcher theme={formData.theme} onChange={(t) => update('theme', t)} />
          </div>

          {/* Section order drag-and-drop */}
          <div style={styles.section}>
            <DragSectionList
              sectionOrder={formData.sectionOrder}
              sectionLabels={{
                ...STANDARD_LABELS,
                ...Object.fromEntries(
                  Object.entries(formData.customSections).map(([id, s]) => [id, `✏️ ${s.title}`])
                ),
              }}
              onOrderChange={(order) => update('sectionOrder', order)}
              onAddSection={handleAddSection}
              onDeleteSection={handleDeleteSection}
            />
          </div>

          {/* About */}
          <div style={styles.section}>
            <label>About</label>
            <input
              placeholder="Title / Role (e.g. Full-Stack Developer)"
              value={formData.about.title}
              onChange={(e) => update('about', { ...formData.about, title: e.target.value })}
            />
            <textarea
              placeholder="Write a short description about yourself…"
              value={formData.about.description}
              onChange={(e) => update('about', { ...formData.about, description: e.target.value })}
            />
          </div>

          {/* Projects */}
          <div style={styles.section}>
            <ProjectEditor
              projects={formData.projects}
              onChange={(p) => update('projects', p)}
            />
          </div>

          {/* Skills */}
          <div style={styles.section}>
            <SkillsEditor
              skills={formData.skills}
              onChange={(s) => update('skills', s)}
            />
          </div>

          {/* Experience */}
          <div style={styles.section}>
            <ExperienceEditor
              experience={formData.experience}
              onChange={(items) => update('experience', items)}
            />
          </div>

          {/* Contact */}
          <div style={styles.section}>
            <ContactEditor
              contact={formData.contact}
              onChange={(c) => update('contact', c)}
            />
          </div>

          {/* Custom section editors — one card per custom section */}
          {Object.entries(formData.customSections).map(([id, section]) => (
            <div key={id} style={styles.section}>
              <label>✏️ {section.title}</label>
              <textarea
                placeholder={`Write content for "${section.title}"…`}
                value={section.body}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    customSections: {
                      ...prev.customSections,
                      [id]: { ...prev.customSections[id], body: e.target.value },
                    },
                  }))
                }
              />
            </div>
          ))}

          {/* Feedback */}
          {saveError && <div style={styles.alertError}>{saveError}</div>}
          {successMsg && <div style={styles.alertSuccess}>{successMsg}</div>}

          {/* Action buttons */}
          <div style={styles.actionsRow}>
            <button onClick={handleSave} disabled={isSaving || isFetching} style={styles.saveBtnLarge}>
              {isSaving ? 'Saving…' : slug ? '💾 Update Portfolio' : '💾 Save Portfolio'}
            </button>

            {slug && (
              <>
                <a
                  href={`http://localhost:5000/p/${slug}`}
                  target="_blank"
                  rel="noreferrer"
                  style={styles.actionLink}
                >
                  🔗 View Public URL
                </a>
                <a
                  href={`http://localhost:5000/api/portfolios/${slug}/download`}
                  target="_blank"
                  rel="noreferrer"
                  style={{ ...styles.actionLink, background: '#f0fdf4', color: '#15803d', border: '1px solid #bbf7d0' }}
                >
                  ⬇ Download HTML
                </a>
              </>
            )}
          </div>

          {slug && (
            <div style={styles.slugBox}>
              Public URL: <code>http://localhost:5000/p/{slug}</code>
            </div>
          )}
        </div>

        {/* RIGHT — Live preview panel: always visible; fills full width when editor is hidden */}
        <div style={styles.previewPanel}>
          <div style={styles.previewLabel}>
            <span>⚡ Live Preview</span>
            <span style={{ fontSize: '0.75rem', opacity: 0.7, textTransform: 'none', letterSpacing: 0 }}>
              Updates as you type
            </span>
          </div>
          <div style={{ flex: 1, overflow: 'auto' }}>
            <LivePreview data={formData} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Styles ─────────────────────────────────────────────────── */
const styles = {
  root: { display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' },
  topBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 20px',
    background: '#fff',
    borderBottom: '1px solid #e2e8f0',
    flexShrink: 0,
    gap: '12px',
  },
  logoLink: {
    color: '#6366f1',
    textDecoration: 'none',
    fontWeight: 700,
    fontSize: '0.9rem',
    whiteSpace: 'nowrap',
  },
  saveBtn: {
    background: '#6366f1',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    padding: '9px 20px',
    fontWeight: 700,
    fontSize: '0.88rem',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  mobileToggle: {
    display: 'flex',
    background: '#f1f5f9',
    borderRadius: '8px',
    padding: '3px',
    gap: '2px',
  },
  toggleBtn: {
    background: 'none',
    border: 'none',
    borderRadius: '6px',
    padding: '6px 14px',
    fontSize: '0.82rem',
    fontWeight: 500,
    color: '#64748b',
    cursor: 'pointer',
  },
  toggleActive: { background: '#fff', color: '#1e293b', fontWeight: 700, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
  layout: { display: 'flex', flex: 1, overflow: 'hidden' },
  editorPanel: {
    width: '46%',
    minWidth: '320px',
    overflowY: 'auto',
    padding: '20px 24px',
    background: '#f8fafc',
    borderRight: '1px solid #e2e8f0',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  previewPanel: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    background: '#f1f5f9',
  },
  previewLabel: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 18px',
    background: '#1e293b',
    color: '#fff',
    fontSize: '0.8rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.8px',
    flexShrink: 0,
  },
  section: {
    background: '#fff',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    padding: '18px',
    marginBottom: '12px',
  },
  loadingBanner: {
    background: '#ede9fe',
    color: '#6d28d9',
    padding: '10px 16px',
    borderRadius: '8px',
    fontSize: '0.88rem',
    marginBottom: '10px',
    textAlign: 'center',
  },
  alertError: {
    background: '#fef2f2',
    color: '#dc2626',
    border: '1px solid #fecaca',
    padding: '12px 16px',
    borderRadius: '8px',
    fontSize: '0.88rem',
    marginBottom: '10px',
  },
  alertSuccess: {
    background: '#f0fdf4',
    color: '#15803d',
    border: '1px solid #bbf7d0',
    padding: '12px 16px',
    borderRadius: '8px',
    fontSize: '0.88rem',
    wordBreak: 'break-all',
    marginBottom: '10px',
  },
  actionsRow: { display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '12px' },
  saveBtnLarge: {
    background: '#6366f1',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    padding: '13px',
    fontWeight: 700,
    fontSize: '0.96rem',
    cursor: 'pointer',
    textAlign: 'center',
  },
  actionLink: {
    display: 'block',
    textAlign: 'center',
    padding: '11px',
    borderRadius: '10px',
    background: '#ede9fe',
    color: '#5b21b6',
    fontWeight: 600,
    fontSize: '0.88rem',
    textDecoration: 'none',
    border: '1px solid #c4b5fd',
  },
  slugBox: {
    background: '#f8fafc',
    border: '1px dashed #c7d2fe',
    borderRadius: '8px',
    padding: '12px 14px',
    fontSize: '0.82rem',
    color: '#475569',
    wordBreak: 'break-all',
    marginBottom: '16px',
  },
  centered: { display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' },
  errorBox: {
    background: '#fff',
    padding: '40px',
    borderRadius: '16px',
    textAlign: 'center',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    maxWidth: '420px',
  },
  backLink: { color: '#6366f1', fontWeight: 600, textDecoration: 'none' },
};

export default Editor;
