# Portfolio Builder

A full-stack MERN application that lets users create, edit, preview, and share a personal portfolio — without any sign-up required.

---

## Features

- **Drag-and-drop section ordering** — reorder About, Projects, Skills, Contact via `@dnd-kit`
- **Live preview panel** — updates instantly as you type, reflects the selected theme
- **Three themes** — Modern (indigo), Dark (navy), Minimal (serif)
- **MongoDB persistence** — portfolios are saved and retrievable by slug
- **Public shareable URL** — `http://localhost:5000/p/<slug>`
- **Generated HTML download** — self-contained HTML file with inline CSS
- **Load existing portfolio** — enter your slug on the Home page to edit

---

## Tech Stack

| Layer     | Technology                                      |
|-----------|--------------------------------------------------|
| Frontend  | React 18, Vite, React Router v6, Axios, @dnd-kit |
| Backend   | Node.js, Express.js                              |
| Database  | MongoDB, Mongoose                                |
| Utilities | slugify, dotenv, cors, nodemon                   |

---

## Folder Structure

```
portfolio-builder/
├── backend/
│   ├── server.js                  # Express app entry, public /p/:slug route
│   ├── config/
│   │   └── db.js                  # Mongoose connection
│   ├── models/
│   │   └── Portfolio.js           # Mongoose schema
│   ├── routes/
│   │   └── portfolioRoutes.js     # Route definitions
│   ├── controllers/
│   │   └── portfolioController.js # Business logic
│   ├── utils/
│   │   └── generatePortfolioHTML.js  # HTML + inline CSS generator
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── index.html
│   ├── vite.config.js             # Proxy /api → localhost:5000
│   ├── src/
│   │   ├── App.jsx                # Router setup
│   │   ├── main.jsx
│   │   ├── index.css
│   │   ├── components/
│   │   │   ├── LivePreview.jsx    # Theme-aware real-time preview
│   │   │   ├── ThemeSwitcher.jsx  # Theme selection buttons
│   │   │   ├── ProjectEditor.jsx  # Add/remove projects
│   │   │   ├── SkillsEditor.jsx   # Tag-style skills input
│   │   │   ├── ContactEditor.jsx  # Contact fields
│   │   │   └── DragSectionList.jsx # @dnd-kit drag reorder
│   │   ├── pages/
│   │   │   ├── Home.jsx           # Landing + load-by-slug
│   │   │   └── Editor.jsx         # Main editor page
│   │   └── services/
│   │       └── portfolioService.js # Axios API calls
│   └── package.json
│
└── README.md
```

---

## Setup Instructions

### Prerequisites

- Node.js ≥ 18
- MongoDB running locally (or MongoDB Atlas URI)

### 1. MongoDB

Start MongoDB locally:

```bash
mongod
```

The database `portfolio_builder` is created automatically on first save.

### 2. Backend

```bash
cd backend
npm install

# Create .env from the example
cp .env.example .env
# Edit .env if needed (defaults work for local MongoDB)

npm run dev
# Server starts at http://localhost:5000
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
# App starts at http://localhost:3000
```

Open **http://localhost:3000** in your browser.

---

## API Endpoints

| Method | Endpoint                              | Description                          |
|--------|---------------------------------------|--------------------------------------|
| POST   | `/api/portfolios`                     | Create a new portfolio               |
| GET    | `/api/portfolios/:slug`               | Get portfolio JSON by slug           |
| PUT    | `/api/portfolios/:slug`               | Update existing portfolio            |
| GET    | `/api/portfolios/:slug/html`          | Return generated HTML (text/html)    |
| GET    | `/api/portfolios/:slug/download`      | Download HTML file                   |
| GET    | `/p/:slug`                            | Public portfolio viewer (browser)    |

### Example Request — Create Portfolio

```bash
curl -X POST http://localhost:5000/api/portfolios \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "theme": "modern",
    "sectionOrder": ["about","projects","skills","contact"],
    "about": { "title": "Full-Stack Developer", "description": "I build web apps." },
    "projects": [{ "title": "My App", "techStack": "React, Node", "githubLink": "https://github.com/..." }],
    "skills": ["JavaScript","React","Node.js","MongoDB"],
    "contact": { "email": "jane@example.com", "github": "https://github.com/janedoe" }
  }'
```

Response includes `slug` (e.g. `jane-doe`) and `portfolio`.

---

## Testing the Full Flow

1. **Open** http://localhost:3000 → click **Create New Portfolio**
2. **Fill in** your name, pick a theme, drag sections to reorder
3. **Watch** the right panel update in real time (live preview)
4. **Click** "Save Portfolio" → see the public URL in the success banner
5. **Open** `http://localhost:5000/p/<your-slug>` in a new tab to view the public page
6. **Click** "⬇ Download HTML" to save the self-contained HTML file
7. **Edit** any field and click "Update Portfolio" — the public URL refreshes instantly
8. **Return** to Home and enter your slug to reload and continue editing

---

## Example Public URL

```
http://localhost:5000/p/jane-doe
http://localhost:5000/p/swetha-suravajjula
```

If the same name is used twice, a short timestamp suffix is appended automatically (e.g. `jane-doe-k7x2p`).

---

## Note on JSP vs Express Rendering

The original project requirement mentioned JSP (JavaServer Pages) for public portfolio rendering.
**This project does not use JSP** — it is a pure Node.js/Express application.

**Why:** JSP requires a Java/Tomcat runtime, which is incompatible with a Node.js/Express stack.
Portfolio HTML is generated server-side by `utils/generatePortfolioHTML.js` and served directly
by Express as `text/html` at the `/p/:slug` route. This achieves the same result (a fully rendered,
shareable HTML page) without any Java dependency.

If JSP is strictly required (e.g. the project must integrate with an existing Java EE system),
the `generatedHtml` string stored in MongoDB could be embedded into a JSP template by a separate
Java backend — but that is outside the scope of this Node.js project.
