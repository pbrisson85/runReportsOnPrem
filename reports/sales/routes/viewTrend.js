const router = require('express').Router()
const { getStartOfWeek } = require('../queries/postgres/getDateStartByWeek')
const { getWeekForDate } = require('../queries/postgres/getWeekForDate')
const viewCustTrend = require('../routines/viewCustTrend')
const viewItemTrend = require('../routines/viewItemTrend')
const viewSalesPersonTrend = require('../routines/viewSalespersonTrend')
const labelCols_byItem = require('../queries/hardcode/cols_byItem')
const labelCols_byCustomer = require('../queries/hardcode/cols_byCustomer')
const labelCols_bySalesperson = require('../queries/hardcode/cols_bySalesperson')
const getReportConfig = require('../utils/getReportConfig')
const getViewTrendConfig = require('../utils/getViewTrendConfig')

// @route   POST /api/sales/drillDown/forProgBySpecSoakSize
// @desc
// @access  Private

router.post('/', async (req, res) => {
  const { rightMenuSelection, periodEnd, showFyTrend, reportFormat } = req.body
  let { periodStart } = req.body

  const config = getReportConfig(req.body)

  console.log(`\n${config.user} - get drilldown data for ${reportFormat} route HIT...`)

  const startWeek = await getWeekForDate(periodStart, config) // temporarily until I change the data that is being passed by the front end to the week
  const endWeek = await getWeekForDate(periodEnd, config) // temporarily until I change the data that is being passed by the front end to the week

  // Note that start date is the END of the first week. Need the beginning of the same week to pull invoice dates that are after this:
  const startOfWeek = await getStartOfWeek(periodStart)
  periodStart = startOfWeek[0].formatted_date_start

  let response = null

  console.log('rightMenuSelection: ', rightMenuSelection)

  const trendQuery = getViewTrendConfig(rightMenuSelection)

  if (rightMenuSelection === 'Trend By Item') {
    response = await viewItemTrend(labelCols_byItem, config, periodStart, periodEnd, showFyTrend, startWeek, endWeek, trendQuery)
  } else if (rightMenuSelection === 'Trend By Customer') {
    response = await viewItemTrend(labelCols_byCustomer, config, periodStart, periodEnd, showFyTrend, startWeek, endWeek, trendQuery)
  } else if (rightMenuSelection === 'Trend By Salesperson') {
    response = await viewSalesPersonTrend(labelCols_bySalesperson, config, periodStart, periodEnd, showFyTrend, startWeek, endWeek)
  }

  console.log(`${config.user} - get drilldown data for ${reportFormat} route COMPLETE. \n`)

  res.send(response)
})

module.exports = router
