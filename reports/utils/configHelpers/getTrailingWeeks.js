const getClosestWeekEndDate = require('./getClosestWeekEndDate')
const getClosestWeekStartDate = require('./getClosestWeekStartDate')
const getTrailingWeeksStartDate = require('./getTrailingWeeksStartDate')
const getWeekForDate = require('./getWeekForDate')

// Since totalsStart and totalsEnd could be on a fiscal or calendar period, need to convert both to the last completed week

const getTrailingWeeks = async (totalsStartDate, totalsEndDate) => {
  // Runs specific KPIs for trailing weeks
  const closestYtdWeekStartDate = await getClosestWeekStartDate(totalsStartDate)
  const closestYtdWeekEndDate = await getClosestWeekEndDate(totalsEndDate)

  const trailingWeeksConfig = [
    {
      weeks: await getWeekForDate(closestYtdWeekEndDate),
      start: closestYtdWeekStartDate,
      end: new Date(closestYtdWeekEndDate),
      dataName: 'aveWeeklySales', // matches kpi columns
    },
    {
      weeks: 2,
      start: getTrailingWeeksStartDate(2, closestYtdWeekEndDate),
      end: new Date(closestYtdWeekEndDate),
      dataName: 'twoWkAveSales', // matches kpi columns
    },
    {
      weeks: 4,
      start: getTrailingWeeksStartDate(4, new Date(reqBody.totalsEnd?.date_end ?? defaultEnd)),
      end: new Date(closestYtdWeekEndDate),
      dataName: 'fourWkAveSales', // matches kpi columns
    },
    {
      weeks: 8,
      start: getTrailingWeeksStartDate(8, new Date(reqBody.totalsEnd?.date_end ?? defaultEnd)),
      end: new Date(closestYtdWeekEndDate),
      dataName: 'eightWkAveSales', // matches kpi columns
    },
    {
      weeks: 12,
      start: getTrailingWeeksStartDate(12, new Date(reqBody.totalsEnd?.date_end ?? defaultEnd)),
      end: new Date(closestYtdWeekEndDate),
      dataName: 'twelveWkAveSales', // matches kpi columnse
    },
  ]

  console.log('trailingWeeksConfig', trailingWeeksConfig)

  return trailingWeeksConfig
}

module.exports = getTrailingWeeks
