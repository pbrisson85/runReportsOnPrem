const router = require('express').Router()
const buildDrillDown_byItem_level2 = require('../routines/buildDrillDown_byItem_level2')
const buildDrillDown_byItem_level1 = require('../routines/buildDrillDown_byItem_level1')
const buildDrillDown_byItem_level0 = require('../routines/buildDrillDown_byItem_level0')
const { getStartOfWeek } = require('../../shared/queries/postgres/getDateStartByWeek')
const buildDrillDown_byCustomer_level2 = require('../routines/buildDrillDown_byCustomer_level2')
const buildDrillDown_byCustomer_level1 = require('../routines/buildDrillDown_byCustomer_level1')
const buildDrillDown_byCustomer_level0 = require('../routines/buildDrillDown_byCustomer_level0')

// @route   POST /api/sales/drillDown/forProgBySpecSoakSize
// @desc    Get drilldown data for a given report and filter
// @access  Private

router.post('/', async (req, res) => {
  const { program, option, filters, columnDataName, reportName, colType, periodStart, periodEnd } = req.body

  console.log(`\nget drilldown data for ${reportName} route HIT...`)

  console.log('program: ', program)
  console.log('option: ', option)
  console.log('filters: ', filters)
  console.log('columnDataName: ', columnDataName)
  console.log('reportName: ', reportName)
  console.log('colType: ', colType)
  console.log('periodStart: ', periodStart)
  console.log('periodEnd: ', periodEnd)

  // Note that start date is the END of the first week. Need the beginning of the same week to pull invoice dates that are after this:
  const startWeek = await getStartOfWeek(periodStart)

  let response = null

  if (option === 'Trend By Item') {
    if (colType === 'salesInvoice') {
      if (filters[1] === 'SUBTOTAL') {
        // level 1 subtotal
        response = await buildDrillDown_byItem_level1(program, startWeek[0].formatted_date_start, periodEnd, filters)
      }

      if (filters[1] !== 'SUBTOTAL' && filters[2] === 'SUBTOTAL') {
        // level 2 subtotal
        response = await buildDrillDown_byItem_level2(program, startWeek[0].formatted_date_start, periodEnd, filters)
      }

      if (filters[1] === 'TOTAL') {
        // level 0 total
        response = await buildDrillDown_byItem_level0(program, startWeek[0].formatted_date_start, periodEnd, filters)
      }
    }
  } else {
    // option is top customer weight, margin, or bottom customer weight.
    // Pull one set of data and filter/sum at the end based on the option.

    if (filters[1] === 'SUBTOTAL') {
      // level 1 subtotal
      response = await buildDrillDown_byCustomer_level1(program, startWeek[0].formatted_date_start, periodEnd, filters)
    }

    if (filters[1] !== 'SUBTOTAL' && filters[2] === 'SUBTOTAL') {
      // level 2 subtotal
      response = await buildDrillDown_byCustomer_level2(program, startWeek[0].formatted_date_start, periodEnd, filters)
    }

    if (filters[1] === 'TOTAL') {
      // level 0 total
      response = await buildDrillDown_byCustomer_level0(program, startWeek[0].formatted_date_start, periodEnd, filters)
    }
  }

  console.log(`get drilldown data for ${reportName} route COMPLETE. \n`)

  console.log('response: ', response)

  res.send(response)
})

module.exports = router
