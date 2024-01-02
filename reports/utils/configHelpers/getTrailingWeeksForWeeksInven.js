const getClosestWeekEndDate = require('./getClosestWeekEndDate')
const getTrailingWeeksStartDate = require('./getTrailingWeeksStartDate')

// Since totalsStart and totalsEnd could be on a fiscal or calendar period, need to convert both to the last completed week

const getTrailingWeeksForWeeksInven = async reqBody => {
  const totalsEndDate = reqBody.totalsEnd?.date_end ?? (await getClosestWeekEndDate(new Date(), 'getTrailingWeeksForWeeksInven'))

  // Runs specific KPIs for trailing weeks
  const closestYtdWeekEndDate = await getClosestWeekEndDate(totalsEndDate, 'getTrailingWeeksForWeeksInven')

  const trailingWeeksConfig = [
    {
      weeks: 12,
      start: getTrailingWeeksStartDate(12, closestYtdWeekEndDate),
      end: closestYtdWeekEndDate,
      dataName: 'WeeksInventoryBasedOn12WkSales',
    },
  ]

  return trailingWeeksConfig
}

module.exports = getTrailingWeeksForWeeksInven
