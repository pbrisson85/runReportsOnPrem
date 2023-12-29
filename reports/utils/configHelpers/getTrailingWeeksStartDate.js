const { subWeeks, addDays } = require('date-fns')

const getTrailingWeeksStartDate = (weeks, endDate) => {
  const startDate = addDays(subWeeks(new Date(endDate), weeks), 1)

  return startDate
}

module.exports = getTrailingWeeksStartDate
