const getClosestWeekEndDate = require('./getClosestWeekEndDate')
const getStartOfFiscalYear = require('./getStartOfFiscalYear')

const getDatesTotalsPrimary = async reqBody => {
  if (typeof reqBody.totalsStartPrimary?.date_start !== 'undefined' && typeof reqBody.totalsEndPrimary?.date_end !== 'undefined') {
    return { startDatePrimary: reqBody.totalsStartPrimary?.date_start, endDatePrimary: reqBody.totalsEndPrimary?.date_end }
  }

  // Defaults
  const endDatePrimary = await getClosestWeekEndDate(new Date(), 'getDatesTotalsPrimary')
  const startDatePrimary = await getStartOfFiscalYear() // beginning of fiscal year

  return { startDatePrimary, endDatePrimary }
}

module.exports = getDatesTotalsPrimary
