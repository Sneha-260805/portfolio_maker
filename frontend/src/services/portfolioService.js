import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/portfolios';

/** Create a new portfolio. Returns { portfolio, slug }. */
export const createPortfolio = (data) => axios.post(BASE_URL, data);

/** Fetch a portfolio by slug. Returns portfolio document. */
export const getPortfolio = (slug) => axios.get(`${BASE_URL}/${slug}`);

/** Update an existing portfolio by slug. Returns { portfolio, slug }. */
export const updatePortfolio = (slug, data) => axios.put(`${BASE_URL}/${slug}`, data);
