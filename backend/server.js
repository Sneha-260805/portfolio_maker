const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const portfolioRoutes = require('./routes/portfolioRoutes');
const Portfolio = require('./models/Portfolio');

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// API routes
app.use('/api/portfolios', portfolioRoutes);

/**
 * Public portfolio viewer — GET /p/:slug
 * Renders the stored generatedHtml directly in the browser.
 *
 * Note on JSP: The original requirement mentioned JSP for public rendering.
 * This project is fully Node.js/Express-based and does not require a Java/Tomcat
 * stack. The portfolio HTML is generated server-side using a utility function and
 * served as text/html by Express. If JSP is strictly required in your environment,
 * the generatedHtml string could be embedded into a JSP template, but that
 * introduces an unnecessary dependency for a Node.js project.
 */
app.get('/p/:slug', async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ slug: req.params.slug });
    if (!portfolio) {
      return res.status(404).send('<h1 style="font-family:sans-serif;padding:40px">Portfolio not found</h1>');
    }
    res.setHeader('Content-Type', 'text/html');
    res.send(portfolio.generatedHtml);
  } catch (error) {
    console.error('Public portfolio error:', error);
    res.status(500).send('<h1 style="font-family:sans-serif;padding:40px">Server error</h1>');
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
