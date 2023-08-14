const router = require('express').Router()
const buildDrillDown_byItem_level3 = require('../routines/getItemDrillDownForCustomer/buildDrillDown_byItem_level3')
const buildDrillDown_byItem_level2 = require('../routines/getItemDrillDownForCustomer/buildDrillDown_byItem_level2')
const buildDrillDown_byItem_level1 = require('../routines/getItemDrillDownForCustomer/buildDrillDown_byItem_level1')
const buildDrillDown_byItem_level0 = require('../routines/getItemDrillDownForCustomer/buildDrillDown_byItem_level0')
const { getStartOfWeek } = require('../../shared/queries/postgres/getDateStartByWeek')
const { getWeekForDate } = require('../../shared/queries/postgres/getWeekForDate')

// @route   POST /api/sales/drillDown/forProgBySpecSoakSize
// @desc    Get drilldown data for a given report and filter
// @access  Private

router.post('/', async (req, res) => {
  const { program, option, filters, columnDataName, reportName, colType, periodEnd, showFyTrend } = req.body
  let { periodStart } = req.body

  const config = {
    l1_field: 'ms.species',
    l2_field: 'ms.brand',
    l3_field: 'ms.size_name',
  }

  console.log(`\nget drilldown data for ${reportName} route HIT...`)

  const startWeek = await getWeekForDate(periodStart) // temporarily until I change the data that is being passed by the front end to the week
  const endWeek = await getWeekForDate(periodEnd) // temporarily until I change the data that is being passed by the front end to the week

  // Note that start date is the END of the first week. Need the beginning of the same week to pull invoice dates that are after this:
  const startOfWeek = await getStartOfWeek(periodStart)
  periodStart = startOfWeek[0].formatted_date_start

  let response = null

  if (filters[1] === 'SUBTOTAL') {
    console.log('hit level 1')
    // level 1 subtotal
    response = await buildDrillDown_byItem_level1(config, program, periodStart, periodEnd, filters, showFyTrend, startWeek, endWeek)
  }

  if (filters[1] !== 'SUBTOTAL' && filters[2] === 'SUBTOTAL') {
    console.log('hit level 2')
    // level 2 subtotal
    response = await buildDrillDown_byItem_level2(config, program, periodStart, periodEnd, filters, showFyTrend, startWeek, endWeek)
  }

  if (filters[1] !== 'TOTAL' && filters[1] !== 'SUBTOTAL' && filters[2] !== 'SUBTOTAL') {
    console.log('hit level 3')
    // level 3 subtotal
    response = await buildDrillDown_byItem_level3(config, program, periodStart, periodEnd, filters, showFyTrend, startWeek, endWeek)
  }

  if (filters[1] === 'TOTAL') {
    console.log('hit level 0')
    // level 0 total
    response = await buildDrillDown_byItem_level0(config, program, periodStart, periodEnd, filters, showFyTrend, startWeek, endWeek)
  }

  console.log(`get drilldown data for ${reportName} route COMPLETE. \n`)
  res.send(response)
})

module.exports = router
