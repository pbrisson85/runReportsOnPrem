const router = require('express').Router()
const buildDrillDown_byItem_level3 = require('../routines/buildDrillDown_byItem_level3')
const buildDrillDown_byItem_level2 = require('../routines/buildDrillDown_byItem_level2')
const buildDrillDown_byItem_level1 = require('../routines/buildDrillDown_byItem_level1')
const buildDrillDown_byItem_level0 = require('../routines/buildDrillDown_byItem_level0')
const { getStartOfWeek } = require('../../shared/queries/postgres/getDateStartByWeek')
const buildDrillDown_byCustomer_level3 = require('../routines/buildDrillDown_byCustomer_level3')
const buildDrillDown_byCustomer_level2 = require('../routines/buildDrillDown_byCustomer_level2')
const buildDrillDown_byCustomer_level1 = require('../routines/buildDrillDown_byCustomer_level1')
const buildDrillDown_byCustomer_level0 = require('../routines/buildDrillDown_byCustomer_level0')

// @route   POST /api/sales/drillDown/forProgBySpecSoakSize
// @desc    Get drilldown data for a given report and filter
// @access  Private

router.post('/', async (req, res) => {
  const { program, option, filters, columnDataName, reportName, colType, periodStart, periodEnd, showFyTrend } = req.body

  console.log('program: ', program)
  console.log('option: ', option)
  console.log('filters: ', filters)
  console.log('columnDataName: ', columnDataName)
  console.log('reportName: ', reportName)
  console.log('colType: ', colType)
  console.log('periodStart: ', periodStart)
  console.log('periodEnd: ', periodEnd)
  console.log('showFyTrend: ', showFyTrend)

  console.log(`\nget drilldown data for ${reportName} route HIT...`)

  // Note that start date is the END of the first week. Need the beginning of the same week to pull invoice dates that are after this:
  const startWeek = await getStartOfWeek(periodStart)

  let response = null

  if (filters[1] === 'SUBTOTAL') {
    console.log('hit level 1')
    // level 1 subtotal
    response = await buildDrillDown_byItem_level1(program, startWeek[0].formatted_date_start, periodEnd, filters, showFyTrend)
  }

  if (filters[1] !== 'SUBTOTAL' && filters[2] === 'SUBTOTAL') {
    console.log('hit level 2')
    // level 2 subtotal
    response = await buildDrillDown_byItem_level2(program, startWeek[0].formatted_date_start, periodEnd, filters, showFyTrend)
  }

  if (filters[1] !== 'TOTAL' && filters[1] !== 'SUBTOTAL' && filters[2] !== 'SUBTOTAL') {
    console.log('hit level 3')
    // level 3 subtotal
    response = await buildDrillDown_byItem_level3(program, startWeek[0].formatted_date_start, periodEnd, filters, showFyTrend)
  }

  if (filters[1] === 'TOTAL') {
    console.log('hit level 0')
    // level 0 total
    response = await buildDrillDown_byItem_level0(program, startWeek[0].formatted_date_start, periodEnd, filters, showFyTrend)
  }

  console.log(`get drilldown data for ${reportName} route COMPLETE. \n`)
  res.send(response)
})

module.exports = router
