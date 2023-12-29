const getClosestWeekEndDate = require('./getClosestWeekEndDate')
const getStartOfFiscalYear = require('./getStartOfFiscalYear')

const getDatesTotalsComparison = async reqBody => {
  if (typeof reqBody.totalsStartComparison?.date_start !== 'undefined' && typeof reqBody.totalsEndComparison?.date_end !== 'undefined') {
    return { startDateComparison: reqBody.totalsStartComparison?.date_start, endDateComparison: reqBody.totalsEndComparison?.date_end }
  }

  // Defaults
  const endDateComparison = await getClosestWeekEndDate(new Date(), 'getDatesTotalsComparison')
  const startDateComparison = await getStartOfFiscalYear() // beginning of fiscal year

  return { startDateComparison, endDateComparison }
}

module.exports = getDatesTotalsComparison
