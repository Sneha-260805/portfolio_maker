/**
 * Escapes HTML special characters to prevent XSS in user-supplied content.
 */
const escapeHtml = (str) => {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
};

/**
 * Returns inline CSS for the requested theme.
 * Themes: modern | dark | fun
 */
const getThemeCSS = (theme) => {
  const themes = {
    modern: `
      :root{--bg:#f8fafc;--surface:#fff;--primary:#6366f1;--text:#1e293b;--muted:#64748b;--border:#e2e8f0;--tag-bg:#ede9fe;--tag-text:#5b21b6}
      *{box-sizing:border-box;margin:0;padding:0}
      body{background:var(--bg);color:var(--text);font-family:'Segoe UI',system-ui,sans-serif;line-height:1.6}
      header{background:var(--primary);color:#fff;padding:60px 40px;text-align:center}
      header h1{font-size:2.8rem;font-weight:700;margin-bottom:8px}
      header p{font-size:1.1rem;opacity:.85}
      main{max-width:900px;margin:0 auto;padding:40px 24px}
      section{background:var(--surface);border-radius:12px;padding:32px;margin-bottom:28px;box-shadow:0 4px 6px -1px rgba(0,0,0,.1)}
      h2{font-size:1.5rem;font-weight:700;color:var(--primary);margin-bottom:20px;padding-bottom:10px;border-bottom:2px solid var(--border)}
      .project-card{border:1px solid var(--border);border-radius:8px;padding:20px;margin-bottom:16px}
      .project-card h3{color:var(--text);margin-bottom:8px;font-size:1.05rem}
      .project-card p{color:var(--muted);margin-bottom:8px;font-size:.95rem}
      .tech{font-size:.85rem;color:var(--muted);margin-bottom:10px;font-style:italic}
      .links a{color:var(--primary);text-decoration:none;margin-right:16px;font-size:.9rem}
      .links a:hover{text-decoration:underline}
      .skills-grid{display:flex;flex-wrap:wrap;gap:10px}
      .skill-tag{background:var(--tag-bg);color:var(--tag-text);padding:6px 14px;border-radius:20px;font-size:.9rem;font-weight:500}
      .contact-grid{display:grid;gap:12px}
      .contact-item{font-size:.95rem}
      .contact-item strong{margin-right:8px}
      .contact-item a{color:var(--primary);text-decoration:none}
      .contact-item a:hover{text-decoration:underline}
      .custom-body{color:var(--text);line-height:1.75;white-space:pre-wrap}
      footer{text-align:center;padding:24px;color:var(--muted);font-size:.85rem;border-top:1px solid var(--border);margin-top:8px}
    `,
    dark: `
      :root{--bg:#0f172a;--surface:#1e293b;--primary:#818cf8;--text:#e2e8f0;--muted:#94a3b8;--border:#334155;--tag-bg:#312e81;--tag-text:#a5b4fc}
      *{box-sizing:border-box;margin:0;padding:0}
      body{background:var(--bg);color:var(--text);font-family:'Segoe UI',system-ui,sans-serif;line-height:1.6}
      header{background:linear-gradient(135deg,#1e1b4b,#312e81);color:#fff;padding:60px 40px;text-align:center}
      header h1{font-size:2.8rem;font-weight:700;margin-bottom:8px;color:#a5b4fc}
      header p{font-size:1.1rem;opacity:.75}
      main{max-width:900px;margin:0 auto;padding:40px 24px}
      section{background:var(--surface);border-radius:12px;padding:32px;margin-bottom:28px;border:1px solid var(--border);box-shadow:0 4px 6px -1px rgba(0,0,0,.4)}
      h2{font-size:1.5rem;font-weight:700;color:var(--primary);margin-bottom:20px;padding-bottom:10px;border-bottom:2px solid var(--border)}
      .project-card{border:1px solid var(--border);border-radius:8px;padding:20px;margin-bottom:16px;background:rgba(255,255,255,.03)}
      .project-card h3{color:var(--text);margin-bottom:8px;font-size:1.05rem}
      .project-card p{color:var(--muted);margin-bottom:8px;font-size:.95rem}
      .tech{font-size:.85rem;color:var(--muted);margin-bottom:10px;font-style:italic}
      .links a{color:var(--primary);text-decoration:none;margin-right:16px;font-size:.9rem}
      .links a:hover{text-decoration:underline}
      .skills-grid{display:flex;flex-wrap:wrap;gap:10px}
      .skill-tag{background:var(--tag-bg);color:var(--tag-text);padding:6px 14px;border-radius:20px;font-size:.9rem;font-weight:500}
      .contact-grid{display:grid;gap:12px}
      .contact-item{font-size:.95rem}
      .contact-item strong{margin-right:8px}
      .contact-item a{color:var(--primary);text-decoration:none}
      .contact-item a:hover{text-decoration:underline}
      .custom-body{color:var(--text);line-height:1.75;white-space:pre-wrap}
      footer{text-align:center;padding:24px;color:var(--muted);font-size:.85rem;border-top:1px solid var(--border);margin-top:8px}
    `,
    fun: `
      :root{--bg:#fdf4ff;--surface:#fff;--primary:#c026d3;--accent:#f97316;--text:#1a1a2e;--muted:#6b7280;--border:#f3e8ff}
      *{box-sizing:border-box;margin:0;padding:0}
      body{background:var(--bg);color:var(--text);font-family:'Segoe UI',system-ui,sans-serif;line-height:1.65}
      header{background:linear-gradient(135deg,#f97316 0%,#ec4899 50%,#8b5cf6 100%);color:#fff;padding:64px 40px;text-align:center}
      header h1{font-size:3rem;font-weight:800;margin-bottom:10px;letter-spacing:-1px}
      header p{font-size:1.1rem;opacity:.9;font-weight:500}
      main{max-width:900px;margin:0 auto;padding:40px 24px}
      section{background:var(--surface);border-radius:20px;padding:32px;margin-bottom:24px;box-shadow:0 4px 24px rgba(192,38,211,.1);border-left:5px solid var(--primary)}
      h2{font-size:1.35rem;font-weight:800;color:var(--primary);margin-bottom:20px;padding-bottom:10px;border-bottom:2px dashed var(--border)}
      .project-card{border:2px solid var(--border);border-radius:14px;padding:20px;margin-bottom:14px}
      .project-card h3{color:var(--text);margin-bottom:8px;font-weight:700}
      .project-card p{color:var(--muted);margin-bottom:8px;font-size:.95rem}
      .tech{font-size:.85rem;color:var(--primary);margin-bottom:10px;font-weight:600}
      .links a{color:var(--accent);text-decoration:none;margin-right:16px;font-size:.9rem;font-weight:600}
      .links a:hover{text-decoration:underline}
      .skills-grid{display:flex;flex-wrap:wrap;gap:10px}
      .skill-tag{padding:6px 16px;border-radius:20px;font-size:.88rem;font-weight:700;border:2px solid}
      .skill-tag:nth-child(3n+1){background:#fdf4ff;color:#a21caf;border-color:#e879f9}
      .skill-tag:nth-child(3n+2){background:#fff7ed;color:#c2410c;border-color:#fb923c}
      .skill-tag:nth-child(3n){background:#ecfdf5;color:#047857;border-color:#4ade80}
      .contact-grid{display:grid;gap:12px}
      .contact-item{font-size:.95rem;display:flex;align-items:center;gap:8px}
      .contact-item strong{min-width:72px}
      .contact-item a{color:var(--accent);text-decoration:none;font-weight:600}
      .contact-item a:hover{text-decoration:underline}
      .custom-body{color:var(--text);line-height:1.75;white-space:pre-wrap}
      footer{text-align:center;padding:28px;color:var(--muted);font-size:.85rem;border-top:2px dashed var(--border);margin-top:8px}
    `,
  };
  // 'minimal' was the old third theme — fall back to 'fun' gracefully
  return themes[theme] || themes.fun;
};

/* ── Section renderers ───────────────────────────────────────── */

const renderAbout = (about = {}) => `
  <section id="about">
    <h2>About Me</h2>
    ${about.title ? `<p style="font-weight:600;margin-bottom:8px">${escapeHtml(about.title)}</p>` : ''}
    <p>${escapeHtml(about.description) || 'Welcome to my portfolio.'}</p>
  </section>`;

const renderProjects = (projects = []) => {
  if (!projects.length) {
    return '<section id="projects"><h2>Projects</h2><p style="color:var(--muted)">No projects added yet.</p></section>';
  }
  const cards = projects
    .map(
      (p) => `
    <div class="project-card">
      <h3>${escapeHtml(p.title)}</h3>
      ${p.description ? `<p>${escapeHtml(p.description)}</p>` : ''}
      ${p.techStack ? `<p class="tech">Tech: ${escapeHtml(p.techStack)}</p>` : ''}
      <div class="links">
        ${p.githubLink ? `<a href="${escapeHtml(p.githubLink)}" target="_blank" rel="noopener noreferrer">GitHub</a>` : ''}
        ${p.liveLink ? `<a href="${escapeHtml(p.liveLink)}" target="_blank" rel="noopener noreferrer">Live Demo</a>` : ''}
      </div>
    </div>`
    )
    .join('');
  return `<section id="projects"><h2>Projects</h2>${cards}</section>`;
};

const renderSkills = (skills = []) => {
  if (!skills.length) {
    return '<section id="skills"><h2>Skills</h2><p style="color:var(--muted)">No skills added yet.</p></section>';
  }
  const tags = skills.map((s) => `<span class="skill-tag">${escapeHtml(s)}</span>`).join('');
  return `<section id="skills"><h2>Skills</h2><div class="skills-grid">${tags}</div></section>`;
};

const renderContact = (contact = {}) => {
  const items = [];
  if (contact.email)
    items.push(`<div class="contact-item"><strong>Email:</strong><a href="mailto:${escapeHtml(contact.email)}">${escapeHtml(contact.email)}</a></div>`);
  if (contact.phone)
    items.push(`<div class="contact-item"><strong>Phone:</strong><span>${escapeHtml(contact.phone)}</span></div>`);
  if (contact.linkedin)
    items.push(`<div class="contact-item"><strong>LinkedIn:</strong><a href="${escapeHtml(contact.linkedin)}" target="_blank" rel="noopener noreferrer">${escapeHtml(contact.linkedin)}</a></div>`);
  if (contact.github)
    items.push(`<div class="contact-item"><strong>GitHub:</strong><a href="${escapeHtml(contact.github)}" target="_blank" rel="noopener noreferrer">${escapeHtml(contact.github)}</a></div>`);

  const body = items.length
    ? `<div class="contact-grid">${items.join('')}</div>`
    : '<p style="color:var(--muted)">No contact info added yet.</p>';

  return `<section id="contact"><h2>Contact</h2>${body}</section>`;
};

/** Renders a user-defined custom section (any title, free-form body). */
const renderCustomSection = (id, section) => `
  <section id="${escapeHtml(id)}">
    <h2>${escapeHtml(section.title)}</h2>
    ${section.body
      ? `<p class="custom-body">${escapeHtml(section.body)}</p>`
      : '<p style="color:var(--muted)">No content yet.</p>'}
  </section>`;

const STANDARD_RENDERERS = {
  about: (d) => renderAbout(d.about),
  projects: (d) => renderProjects(d.projects),
  skills: (d) => renderSkills(d.skills),
  contact: (d) => renderContact(d.contact),
};

/* ── Main export ─────────────────────────────────────────────── */

const generatePortfolioHTML = (portfolio) => {
  const { name, theme, sectionOrder, about, projects, skills, contact, customSections = {} } = portfolio;
  const css = getThemeCSS(theme || 'modern');
  const order =
    sectionOrder && sectionOrder.length > 0
      ? sectionOrder
      : ['about', 'projects', 'skills', 'contact'];

  const sectionsHTML = order
    .map((key) => {
      const renderer = STANDARD_RENDERERS[key];
      if (renderer) return renderer({ about, projects, skills, contact });
      // Fall through to custom section
      if (customSections[key]) return renderCustomSection(key, customSections[key]);
      return '';
    })
    .join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(name)} | Portfolio</title>
  <style>${css}</style>
</head>
<body>
  <header>
    <h1>${escapeHtml(name)}</h1>
    ${about && about.title ? `<p>${escapeHtml(about.title)}</p>` : ''}
  </header>
  <main>
    ${sectionsHTML}
  </main>
  <footer>
    <p>Portfolio built with Portfolio Builder &mdash; ${new Date().getFullYear()}</p>
  </footer>
</body>
</html>`;
};

module.exports = generatePortfolioHTML;
