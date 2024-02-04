const getClosestWeekStartDate = require('./getClosestWeekStartDate')

const getTrailingWeeksRowDates = async reqBody => {
  // earlier of ytd start or trailing 12 weeks start
  const closestYtdWeekStartDate = await getClosestWeekStartDate(totalsStartDate, 'getTrailingWeeksForRows')
}

module.exports = getTrailingWeeksRowDates
