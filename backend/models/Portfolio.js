const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  techStack: { type: String, default: '' },
  githubLink: { type: String, default: '' },
  liveLink: { type: String, default: '' },
});

const contactSchema = new mongoose.Schema({
  email: { type: String, default: '' },
  phone: { type: String, default: '' },
  linkedin: { type: String, default: '' },
  github: { type: String, default: '' },
});

const aboutSchema = new mongoose.Schema({
  title: { type: String, default: '' },
  description: { type: String, default: '' },
});

const experienceSchema = new mongoose.Schema({
  jobTitle: { type: String, default: '' },
  company: { type: String, default: '' },
  location: { type: String, default: '' },
  startDate: { type: String, default: '' },
  endDate: { type: String, default: '' },
  currentlyWorking: { type: Boolean, default: false },
  employmentType: { type: String, default: '' },
  description: { type: [String], default: [] },
  skillsUsed: { type: [String], default: [] },
});

const portfolioSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    theme: {
      type: String,
      enum: ['modern', 'dark', 'fun'],
      default: 'modern',
    },
    sectionOrder: {
      type: [String],
      default: ['about', 'projects', 'skills', 'experience', 'contact'],
    },
    about: { type: aboutSchema, default: () => ({}) },
    projects: { type: [projectSchema], default: [] },
    skills: { type: [String], default: [] },
    experience: { type: [experienceSchema], default: [] },
    contact: { type: contactSchema, default: () => ({}) },
    // Freeform sections added by the user (e.g. Experience, Education, custom titles)
    // Stored as { [sectionId]: { title: string, body: string } }
    customSections: { type: mongoose.Schema.Types.Mixed, default: {} },
    // Stores the fully generated HTML for public display and download
    generatedHtml: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Portfolio', portfolioSchema);
