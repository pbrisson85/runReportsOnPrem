const getClosestWeekEndDate = require('./getClosestWeekEndDate')
const getClosestWeekStartDate = require('./getClosestWeekStartDate')
const getTrailingWeeksStartDate = require('./getTrailingWeeksStartDate')
const getWeekForDate = require('./getWeekForDate')
const getStartOfFiscalYear = require('./getStartOfFiscalYear')

// Since totalsStart and totalsEnd could be on a fiscal or calendar period, need to convert both to the last completed week

const getTrailingWeeks = async reqBody => {
  const today = new Date()

  const totalsStartDate = reqBody.totalsStart?.date_start ?? (await getStartOfFiscalYear())
  const totalsEndDate = reqBody.totalsEnd?.date_end ?? (await getClosestWeekEndDate(today))

  console.log('debug: totalsEndDate: ', totalsEndDate)
  console.log('debug: reqBody.totalsEnd?.date_end', reqBody.totalsEnd?.date_end)

  // Runs specific KPIs for trailing weeks
  const closestYtdWeekStartDate = await getClosestWeekStartDate(totalsStartDate)
  const closestYtdWeekEndDate = await getClosestWeekEndDate(totalsEndDate)

  console.log('debug: closestYtdWeekStartDate', closestYtdWeekStartDate)
  console.log('debug: closestYtdWeekEndDate', closestYtdWeekEndDate)

  const trailingWeeksConfig = [
    {
      weeks: await getWeekForDate(closestYtdWeekEndDate, reqBody.user),
      start: closestYtdWeekStartDate,
      end: closestYtdWeekEndDate,
      dataName: 'aveWeeklySales', // matches kpi columns
    },
    {
      weeks: 2,
      start: getTrailingWeeksStartDate(2, closestYtdWeekEndDate),
      end: closestYtdWeekEndDate,
      dataName: 'twoWkAveSales', // matches kpi columns
    },
    {
      weeks: 4,
      start: getTrailingWeeksStartDate(4, closestYtdWeekEndDate),
      end: closestYtdWeekEndDate,
      dataName: 'fourWkAveSales', // matches kpi columns
    },
    {
      weeks: 8,
      start: getTrailingWeeksStartDate(8, closestYtdWeekEndDate),
      end: closestYtdWeekEndDate,
      dataName: 'eightWkAveSales', // matches kpi columns
    },
    {
      weeks: 12,
      start: getTrailingWeeksStartDate(12, closestYtdWeekEndDate),
      end: closestYtdWeekEndDate,
      dataName: 'twelveWkAveSales', // matches kpi columnse
    },
  ]

  return trailingWeeksConfig
}

module.exports = getTrailingWeeks
