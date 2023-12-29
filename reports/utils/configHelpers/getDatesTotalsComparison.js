const getClosestWeekEndDate = require('./getClosestWeekEndDate')
const getStartOfFiscalYear = require('./getStartOfFiscalYear')

const getDatesTotalsComparison = async reqBody => {
  if (typeof reqBody.totalsStartComparison?.date_start !== 'undefined' && typeof reqBody.totalsEndComparison?.date_end !== 'undefined') {
    return { startDate: reqBody.totalsStartComparison?.date_start, endDate: reqBody.totalsEndComparison?.date_end }
  }

  // Defaults
  const endDate = await getClosestWeekEndDate(new Date(), 'getDatesTotalsComparison')
  const startDate = await getStartOfFiscalYear() // beginning of fiscal year

  return { startDate, endDate }
}

module.exports = getDatesTotalsComparison
