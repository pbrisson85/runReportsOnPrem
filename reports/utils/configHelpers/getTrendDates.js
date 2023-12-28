const getClosestWeekEndDate = require('./getClosestWeekEndDate')
const getTrailingWeeksStartDate = require('./getTrailingWeeksStartDate')

const getTrendDates = async reqBody => {
  if (typeof reqBody.trendStartPrimary?.date_start !== 'undefined' && typeof reqBody.trendEndPrimary?.date_end !== 'undefined') {
    return { startDate: reqBody.trendStartPrimary?.date_start, endDate: reqBody.trendEndPrimary?.date_end }
  }

  // Defaults
  const endDate = await getClosestWeekEndDate(new Date())
  const startDate = getTrailingWeeksStartDate(5, endDate)

  return { startDate, endDate }
}

module.exports = getTrendDates
