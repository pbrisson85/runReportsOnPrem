const router = require('express').Router()
const buildDrillDown_byItem_level2 = require('../routines/buildDrillDown_byItem_level2')
const buildDrillDown_byItem_level1 = require('../routines/buildDrillDown_byItem_level1')
const buildDrillDown_byItem_level0 = require('../routines/buildDrillDown_byItem_level0')
const { getStartOfWeek } = require('../../shared/queries/postgres/getDateStartByWeek')
const { getWeekForDate } = require('../../shared/queries/postgres/getWeekForDate')
const buildDrillDown_byCustomer_level2 = require('../routines/buildDrillDown_byCustomer_level2')
const buildDrillDown_byCustomer_level1 = require('../routines/buildDrillDown_byCustomer_level1')
const buildDrillDown_byCustomer_level0 = require('../routines/buildDrillDown_byCustomer_level0')

// @route   POST /api/sales/drillDown/forProgBySpecSoakSize
// @desc    Get drilldown data for a given report and filter
// @access  Private

router.post('/', async (req, res) => {
  const { program, option, filters, columnDataName, reportName, colType, periodStart, periodEnd, showFyTrend } = req.body

  console.log(`\nget drilldown data for ${reportName} route HIT...`)

  periodStart = await getWeekForDate(periodStart) // temporarily until I change the data that is being passed by the front end to the week
  periodEnd = await getWeekForDate(periodEnd) // temporarily until I change the data that is being passed by the front end to the week

  let response = null

  if (option === 'Trend By Item') {
    if (filters[1] === 'SUBTOTAL') {
      // level 1 subtotal
      response = await buildDrillDown_byItem_level1(program, periodStart, periodEnd, filters, showFyTrend)
    }

    if (!filters[1].includes('TOTAL') && !filters[0].includes('TOTAL')) {
      // level 2 subtotal
      response = await buildDrillDown_byItem_level2(program, periodStart, periodEnd, filters, showFyTrend)
    }

    if (filters[1] === 'TOTAL') {
      // level 0 total
      response = await buildDrillDown_byItem_level0(program, periodStart, periodEnd, filters, showFyTrend)
    }
  } else {
    // option is top customer weight, margin, or bottom customer weight.
    // Pull one set of data and filter/sum at the end based on the option.

    if (filters[1] === 'SUBTOTAL') {
      // level 1 subtotal
      response = await buildDrillDown_byCustomer_level1(program, periodStart, periodEnd, filters, showFyTrend)
    }

    if (!filters[1].includes('TOTAL') && !filters[0].includes('TOTAL')) {
      // level 2 subtotal
      response = await buildDrillDown_byCustomer_level2(program, periodStart, periodEnd, filters, showFyTrend)
    }

    if (filters[1] === 'TOTAL') {
      // level 0 total
      response = await buildDrillDown_byCustomer_level0(program, periodStart, periodEnd, filters, showFyTrend)
    }
  }

  console.log(`get drilldown data for ${reportName} route COMPLETE. \n`)

  res.send(response)
})

module.exports = router
