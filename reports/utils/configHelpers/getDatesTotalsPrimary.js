const getClosestWeekEndDate = require('./getClosestWeekEndDate')
const getStartOfFiscalYear = require('./getStartOfFiscalYear')

const getDatesTotalsPrimary = async reqBody => {
  if (typeof reqBody.totalsStartPrimary?.date_start !== 'undefined' && typeof reqBody.totalsEndPrimary?.date_end !== 'undefined') {
    return { startDate: reqBody.totalsStartPrimary?.date_start, endDate: reqBody.totalsEndPrimary?.date_end }
  }

  // Defaults
  const endDate = await getClosestWeekEndDate(new Date())
  const startDate = await getStartOfFiscalYear() // beginning of fiscal year

  return { startDate, endDate }
}

module.exports = getDatesTotalsPrimary
