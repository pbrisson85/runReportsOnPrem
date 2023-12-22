const getTrailingWeeksStartDate = (weeks, endDate) => {
  const startDate = addDays(subWeeks(endDate, weeks), 1)

  return startDate
}

module.exports = getTrailingWeeksStartDate
