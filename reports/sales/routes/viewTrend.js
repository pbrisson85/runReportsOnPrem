const router = require('express').Router()
const viewItemTrend = require('../routines/viewItemTrend')
const { getStartOfWeek } = require('../queries/postgres/getDateStartByWeek')
const { getWeekForDate } = require('../queries/postgres/getWeekForDate')
const viewCustTrend_baseReport = require('../routines/viewCustTrend_baseReport')
const labelCols_byItem = require('../queries/hardcode/cols_byItem')
const labelCols_byCustomer = require('../queries/hardcode/cols_byCustomer')
const getReportConfig = require('../utils/getReportConfig')

// @route   POST /api/sales/drillDown/forProgBySpecSoakSize
// @desc
// @access  Private

router.post('/', async (req, res) => {
  const { option, filters, columnDataName, colType, periodEnd, showFyTrend, format, queryLevel: level } = req.body
  let { program, periodStart } = req.body

  const config = getReportConfig(req.body)

  console.log(`\nget drilldown data for ${format} route HIT...`)

  const startWeek = await getWeekForDate(periodStart) // temporarily until I change the data that is being passed by the front end to the week
  const endWeek = await getWeekForDate(periodEnd) // temporarily until I change the data that is being passed by the front end to the week

  // Note that start date is the END of the first week. Need the beginning of the same week to pull invoice dates that are after this:
  const startOfWeek = await getStartOfWeek(periodStart)
  periodStart = startOfWeek[0].formatted_date_start

  let response = null

  if (option === 'Trend By Item') {
    response = await viewItemTrend(
      labelCols_byItem,
      config,
      config.program,
      periodStart,
      periodEnd,
      filters,
      showFyTrend,
      startWeek,
      endWeek,
      level
    )
  } else if (option === 'Trend By Customer') {
    // option is top customer weight, margin, or bottom customer weight.
    // Pull one set of data and filter/sum at the end based on the option.

    response = await viewCustTrend_baseReport(
      labelCols_byCustomer,
      config,
      config.program,
      periodStart,
      periodEnd,
      filters,
      showFyTrend,
      startWeek,
      endWeek,
      level
    )
  }

  console.log(`get drilldown data for ${format} route COMPLETE. \n`)

  res.send(response)
})

module.exports = router
