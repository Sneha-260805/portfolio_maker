/**
 * LivePreview — renders the portfolio in real-time using inline React styles
 * that mirror the theme CSS injected into the generated HTML file.
 * Themes: modern | dark | fun
 */

// Cycling colours for the fun theme's skill tags (index % 3)
const FUN_TAG_COLORS = [
  { background: '#fdf4ff', color: '#a21caf', border: '2px solid #e879f9' },
  { background: '#fff7ed', color: '#c2410c', border: '2px solid #fb923c' },
  { background: '#ecfdf5', color: '#047857', border: '2px solid #4ade80' },
];

const THEMES = {
  modern: {
    wrapper:     { background: '#f8fafc', color: '#1e293b', fontFamily: "'Segoe UI',system-ui,sans-serif", minHeight: '100%' },
    header:      { background: '#6366f1', color: '#fff', padding: '40px 32px', textAlign: 'center' },
    headerH1:    { fontSize: '2rem', fontWeight: 700, marginBottom: '6px' },
    headerSub:   { opacity: 0.85, fontSize: '0.95rem' },
    main:        { padding: '24px' },
    section:     { background: '#fff', borderRadius: '12px', padding: '22px', marginBottom: '18px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' },
    h2:          { color: '#6366f1', fontSize: '1.1rem', fontWeight: 700, marginBottom: '14px', paddingBottom: '8px', borderBottom: '2px solid #e2e8f0' },
    projectCard: { border: '1px solid #e2e8f0', borderRadius: '8px', padding: '14px', marginBottom: '10px' },
    projectTitle:{ fontWeight: 600, marginBottom: '5px', color: '#1e293b' },
    muted:       { color: '#64748b', fontSize: '0.85rem', marginBottom: '4px' },
    linkStyle:   { color: '#6366f1', textDecoration: 'none', fontSize: '0.82rem', marginRight: '12px' },
    skillsWrap:  { display: 'flex', flexWrap: 'wrap', gap: '8px' },
    skillTag:    { background: '#ede9fe', color: '#5b21b6', padding: '4px 12px', borderRadius: '20px', fontSize: '0.82rem', fontWeight: 500 },
    contactItem: { fontSize: '0.88rem', marginBottom: '7px', color: '#1e293b' },
    contactLink: { color: '#6366f1', textDecoration: 'none' },
    customBody:  { color: '#1e293b', lineHeight: 1.75, whiteSpace: 'pre-wrap', fontSize: '0.95rem' },
  },
  dark: {
    wrapper:     { background: '#0f172a', color: '#e2e8f0', fontFamily: "'Segoe UI',system-ui,sans-serif", minHeight: '100%' },
    header:      { background: 'linear-gradient(135deg,#1e1b4b,#312e81)', color: '#fff', padding: '40px 32px', textAlign: 'center' },
    headerH1:    { fontSize: '2rem', fontWeight: 700, marginBottom: '6px', color: '#a5b4fc' },
    headerSub:   { opacity: 0.75, fontSize: '0.95rem' },
    main:        { padding: '24px' },
    section:     { background: '#1e293b', borderRadius: '12px', padding: '22px', marginBottom: '18px', border: '1px solid #334155' },
    h2:          { color: '#818cf8', fontSize: '1.1rem', fontWeight: 700, marginBottom: '14px', paddingBottom: '8px', borderBottom: '2px solid #334155' },
    projectCard: { border: '1px solid #334155', borderRadius: '8px', padding: '14px', marginBottom: '10px', background: 'rgba(255,255,255,0.03)' },
    projectTitle:{ fontWeight: 600, marginBottom: '5px', color: '#e2e8f0' },
    muted:       { color: '#94a3b8', fontSize: '0.85rem', marginBottom: '4px' },
    linkStyle:   { color: '#818cf8', textDecoration: 'none', fontSize: '0.82rem', marginRight: '12px' },
    skillsWrap:  { display: 'flex', flexWrap: 'wrap', gap: '8px' },
    skillTag:    { background: '#312e81', color: '#a5b4fc', padding: '4px 12px', borderRadius: '20px', fontSize: '0.82rem', fontWeight: 500 },
    contactItem: { fontSize: '0.88rem', marginBottom: '7px', color: '#e2e8f0' },
    contactLink: { color: '#818cf8', textDecoration: 'none' },
    customBody:  { color: '#e2e8f0', lineHeight: 1.75, whiteSpace: 'pre-wrap', fontSize: '0.95rem' },
  },
  fun: {
    wrapper:     { background: '#fdf4ff', color: '#1a1a2e', fontFamily: "'Segoe UI',system-ui,sans-serif", minHeight: '100%' },
    header:      { background: 'linear-gradient(135deg,#f97316,#ec4899,#8b5cf6)', color: '#fff', padding: '40px 32px', textAlign: 'center' },
    headerH1:    { fontSize: '2.2rem', fontWeight: 800, marginBottom: '8px', letterSpacing: '-0.5px' },
    headerSub:   { opacity: 0.9, fontSize: '0.95rem', fontWeight: 500 },
    main:        { padding: '24px' },
    section:     { background: '#fff', borderRadius: '20px', padding: '22px', marginBottom: '18px', boxShadow: '0 4px 24px rgba(192,38,211,0.09)', borderLeft: '5px solid #c026d3' },
    h2:          { color: '#c026d3', fontSize: '1.1rem', fontWeight: 800, marginBottom: '14px', paddingBottom: '8px', borderBottom: '2px dashed #f3e8ff' },
    projectCard: { border: '2px solid #f3e8ff', borderRadius: '14px', padding: '14px', marginBottom: '10px' },
    projectTitle:{ fontWeight: 700, marginBottom: '5px', color: '#1a1a2e' },
    muted:       { color: '#6b7280', fontSize: '0.85rem', marginBottom: '4px' },
    linkStyle:   { color: '#f97316', textDecoration: 'none', fontSize: '0.82rem', marginRight: '12px', fontWeight: 600 },
    skillsWrap:  { display: 'flex', flexWrap: 'wrap', gap: '8px' },
    skillTag:    null, // handled per-index via FUN_TAG_COLORS
    contactItem: { fontSize: '0.88rem', marginBottom: '7px', color: '#1a1a2e', display: 'flex', alignItems: 'center', gap: '6px' },
    contactLink: { color: '#f97316', textDecoration: 'none', fontWeight: 600 },
    customBody:  { color: '#1a1a2e', lineHeight: 1.75, whiteSpace: 'pre-wrap', fontSize: '0.95rem' },
  },
};

function LivePreview({ data }) {
  const { name, theme, sectionOrder, about, projects, skills, contact, customSections = {} } = data;
  // Fall back to 'fun' for old 'minimal' data still in the DB
  const t = THEMES[theme] || THEMES.fun;

  const getSkillTagStyle = (i) => {
    if (theme === 'fun') {
      return {
        ...FUN_TAG_COLORS[i % 3],
        padding: '4px 14px',
        borderRadius: '20px',
        fontSize: '0.82rem',
        fontWeight: 700,
        border: FUN_TAG_COLORS[i % 3].border,
      };
    }
    return t.skillTag;
  };

  const renderSection = (section) => {
    switch (section) {
      case 'about':
        return (
          <div key="about" style={t.section}>
            <div style={t.h2}>About Me</div>
            {about.title && <div style={{ fontWeight: 600, marginBottom: '6px', fontSize: '0.95rem' }}>{about.title}</div>}
            <div style={t.muted}>{about.description || <em>No description yet.</em>}</div>
          </div>
        );

      case 'projects':
        return (
          <div key="projects" style={t.section}>
            <div style={t.h2}>Projects</div>
            {projects.length === 0 ? (
              <div style={t.muted}><em>No projects added yet.</em></div>
            ) : (
              projects.map((p, i) => (
                <div key={i} style={t.projectCard}>
                  <div style={t.projectTitle}>{p.title}</div>
                  {p.description && <div style={t.muted}>{p.description}</div>}
                  {p.techStack && <div style={{ ...t.muted, fontStyle: 'italic' }}>Tech: {p.techStack}</div>}
                  <div style={{ marginTop: '6px' }}>
                    {p.githubLink && <a href={p.githubLink} target="_blank" rel="noreferrer" style={t.linkStyle}>GitHub ↗</a>}
                    {p.liveLink   && <a href={p.liveLink}   target="_blank" rel="noreferrer" style={t.linkStyle}>Live Demo ↗</a>}
                  </div>
                </div>
              ))
            )}
          </div>
        );

      case 'skills':
        return (
          <div key="skills" style={t.section}>
            <div style={t.h2}>Skills</div>
            <div style={t.skillsWrap}>
              {skills.length === 0 ? (
                <div style={t.muted}><em>No skills added yet.</em></div>
              ) : (
                skills.map((s, i) => (
                  <span key={i} style={getSkillTagStyle(i)}>{s}</span>
                ))
              )}
            </div>
          </div>
        );

      case 'contact':
        return (
          <div key="contact" style={t.section}>
            <div style={t.h2}>Contact</div>
            {contact.email && (
              <div style={t.contactItem}>
                <strong>Email:</strong>
                <a href={`mailto:${contact.email}`} style={t.contactLink}>{contact.email}</a>
              </div>
            )}
            {contact.phone && <div style={t.contactItem}><strong>Phone:</strong> {contact.phone}</div>}
            {contact.linkedin && (
              <div style={t.contactItem}>
                <strong>LinkedIn:</strong>
                <a href={contact.linkedin} target="_blank" rel="noreferrer" style={t.contactLink}>{contact.linkedin}</a>
              </div>
            )}
            {contact.github && (
              <div style={t.contactItem}>
                <strong>GitHub:</strong>
                <a href={contact.github} target="_blank" rel="noreferrer" style={t.contactLink}>{contact.github}</a>
              </div>
            )}
            {!contact.email && !contact.phone && !contact.linkedin && !contact.github && (
              <div style={t.muted}><em>No contact info added yet.</em></div>
            )}
          </div>
        );

      default: {
        // Custom section
        const cs = customSections[section];
        if (!cs) return null;
        return (
          <div key={section} style={t.section}>
            <div style={t.h2}>{cs.title}</div>
            {cs.body
              ? <div style={t.customBody}>{cs.body}</div>
              : <div style={t.muted}><em>No content yet.</em></div>
            }
          </div>
        );
      }
    }
  };

  return (
    <div style={t.wrapper}>
      <div style={t.header}>
        <div style={t.headerH1}>{name || 'Your Name'}</div>
        {about.title && <div style={t.headerSub}>{about.title}</div>}
      </div>
      <div style={t.main}>
        {sectionOrder.map((section) => renderSection(section))}
      </div>
    </div>
  );
}

export default LivePreview;
