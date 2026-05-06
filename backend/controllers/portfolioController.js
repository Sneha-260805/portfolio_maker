const Portfolio = require('../models/Portfolio');
const slugify = require('slugify');
const generatePortfolioHTML = require('../utils/generatePortfolioHTML');

/**
 * Generates a URL-friendly slug from the user's name.
 * Appends a short base-36 timestamp if the slug is already taken.
 */
const generateUniqueSlug = async (name) => {
  const base = slugify(name, { lower: true, strict: true });
  const exists = await Portfolio.findOne({ slug: base });
  if (!exists) return base;
  return `${base}-${Date.now().toString(36)}`;
};

// POST /api/portfolios — create a new portfolio
const createPortfolio = async (req, res) => {
  try {
    const { name, about, projects, skills, contact, theme, sectionOrder, customSections } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const slug = await generateUniqueSlug(name.trim());

    // Drop projects with empty titles and skills with empty values
    const cleanProjects = (projects || []).filter((p) => p.title && p.title.trim());
    const cleanSkills = (skills || []).filter((s) => s && s.trim());

    const data = {
      name: name.trim(),
      slug,
      theme: theme || 'modern',
      sectionOrder: sectionOrder || ['about', 'projects', 'skills', 'contact'],
      about: about || {},
      projects: cleanProjects,
      skills: cleanSkills,
      contact: contact || {},
      customSections: customSections || {},
    };

    data.generatedHtml = generatePortfolioHTML(data);

    const portfolio = await Portfolio.create(data);
    res.status(201).json({ portfolio, slug: portfolio.slug });
  } catch (error) {
    console.error('createPortfolio error:', error);
    res.status(500).json({ error: 'Server error while creating portfolio' });
  }
};

// GET /api/portfolios/:slug — retrieve portfolio JSON
const getPortfolio = async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ slug: req.params.slug });
    if (!portfolio) return res.status(404).json({ error: 'Portfolio not found' });
    res.status(200).json(portfolio);
  } catch (error) {
    console.error('getPortfolio error:', error);
    res.status(500).json({ error: 'Server error while fetching portfolio' });
  }
};

// PUT /api/portfolios/:slug — update existing portfolio
const updatePortfolio = async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ slug: req.params.slug });
    if (!portfolio) return res.status(404).json({ error: 'Portfolio not found' });

    const { name, about, projects, skills, contact, theme, sectionOrder, customSections } = req.body;

    if (name) portfolio.name = name.trim();
    if (theme) portfolio.theme = theme;
    if (sectionOrder) portfolio.sectionOrder = sectionOrder;
    if (about !== undefined) portfolio.about = about;
    if (projects !== undefined)
      portfolio.projects = projects.filter((p) => p.title && p.title.trim());
    if (skills !== undefined)
      portfolio.skills = skills.filter((s) => s && s.trim());
    if (contact !== undefined) portfolio.contact = contact;
    if (customSections !== undefined) {
      portfolio.customSections = customSections;
      // Mixed type requires explicit dirty-marking so Mongoose includes it in the update
      portfolio.markModified('customSections');
    }

    portfolio.generatedHtml = generatePortfolioHTML(portfolio);
    await portfolio.save();

    res.status(200).json({ portfolio, slug: portfolio.slug });
  } catch (error) {
    console.error('updatePortfolio error:', error);
    res.status(500).json({ error: 'Server error while updating portfolio' });
  }
};

// GET /api/portfolios/:slug/html — return HTML as text/html
const getPortfolioHTML = async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ slug: req.params.slug });
    if (!portfolio) return res.status(404).json({ error: 'Portfolio not found' });
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(portfolio.generatedHtml);
  } catch (error) {
    console.error('getPortfolioHTML error:', error);
    res.status(500).json({ error: 'Server error while fetching HTML' });
  }
};

// GET /api/portfolios/:slug/download — download HTML file
const downloadPortfolioHTML = async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ slug: req.params.slug });
    if (!portfolio) return res.status(404).json({ error: 'Portfolio not found' });
    res.setHeader('Content-Type', 'text/html');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${portfolio.slug}-portfolio.html"`
    );
    res.status(200).send(portfolio.generatedHtml);
  } catch (error) {
    console.error('downloadPortfolioHTML error:', error);
    res.status(500).json({ error: 'Server error while downloading HTML' });
  }
};

module.exports = {
  createPortfolio,
  getPortfolio,
  updatePortfolio,
  getPortfolioHTML,
  downloadPortfolioHTML,
};
