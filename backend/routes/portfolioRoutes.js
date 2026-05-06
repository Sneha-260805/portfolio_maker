const express = require('express');
const router = express.Router();
const {
  createPortfolio,
  getPortfolio,
  updatePortfolio,
  getPortfolioHTML,
  downloadPortfolioHTML,
} = require('../controllers/portfolioController');

router.post('/', createPortfolio);
router.get('/:slug', getPortfolio);
router.put('/:slug', updatePortfolio);
router.get('/:slug/html', getPortfolioHTML);
router.get('/:slug/download', downloadPortfolioHTML);

module.exports = router;
