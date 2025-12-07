const { getSales, getFilterOptions } = require('../services/salesService');

async function handleGetSales(req, res, next) {
  try {
    const result = getSales(req.query);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

async function handleGetFilterOptions(req, res, next) {
  try {
    const options = getFilterOptions();
    res.json(options);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getSales: handleGetSales,
  getFilterOptions: handleGetFilterOptions,
};
