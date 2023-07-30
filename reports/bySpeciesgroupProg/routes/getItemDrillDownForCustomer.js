const router = require('express').Router()
const buildDrillDown_byItem_level2 = require('../routines/getItemDrillDownForCustomer/buildDrillDown_byItem_level2')
const buildDrillDown_byItem_level1 = require('../routines/getItemDrillDownForCustomer/buildDrillDown_byItem_level1')
const buildDrillDown_byItem_level0 = require('../routines/getItemDrillDownForCustomer/buildDrillDown_byItem_level0')
const { getStartOfWeek } = require('../../shared/queries/postgres/getDateStartByWeek')
const { getWeekForDate } = require('../../shared/queries/postgres/getWeekForDate')

// @route   POST /api/sales/drillDown/forProgBySpecSoakSize
// @desc    Get drilldown data for a given report and filter
// @access  Private

// on all routes change the following:
// Instead of entering the start and end dates, enter the start week, end week. Then the same variables can be used for prior years.

router.post('/', async (req, res) => {
  const { program, option, filters, columnDataName, reportName, colType, periodEnd, showFyTrend } = req.body
  let { periodStart } = req.body

  console.log(`\nget drilldown data for ${reportName} route HIT...`)

  const startWeek = await getWeekForDate(periodStart) // temporarily until I change the data that is being passed by the front end to the week
  const endWeek = await getWeekForDate(periodEnd) // temporarily until I change the data that is being passed by the front end to the week

  // Note that start date is the END of the first week. Need the beginning of the same week to pull invoice dates that are after this:
  const startOfWeek = await getStartOfWeek(periodStart)
  periodStart = startOfWeek[0].formatted_date_start

  let response = null

  if (filters[1] === 'SUBTOTAL') {
    // level 1 subtotal
    response = await buildDrillDown_byItem_level1(program, periodStart, periodEnd, filters, showFyTrend, startWeek, endWeek)
  }

  if (!filters[1].includes('TOTAL') && !filters[0].includes('TOTAL')) {
    // level 2 subtotal
    response = await buildDrillDown_byItem_level2(program, periodStart, periodEnd, filters, showFyTrend, startWeek, endWeek)
  }

  if (filters[1] === 'TOTAL') {
    // level 0 total
    response = await buildDrillDown_byItem_level0(program, periodStart, periodEnd, filters, showFyTrend, startWeek, endWeek)
  }

  console.log(`get drilldown data for ${reportName} route COMPLETE. \n`)

  res.send(response)
})

module.exports = router
