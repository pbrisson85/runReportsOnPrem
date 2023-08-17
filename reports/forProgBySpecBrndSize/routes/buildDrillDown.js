const router = require('express').Router()
const buildDrillDown_byItem_level3 = require('../../shared/routines/viewItemTrend_baseReport/level3')
const buildDrillDown_byItem_level2 = require('../../shared/routines/viewItemTrend_baseReport/level2')
const buildDrillDown_byItem_level1 = require('../../shared/routines/viewItemTrend_baseReport/level1')
const buildDrillDown_byItem_level0 = require('../../shared/routines/viewItemTrend_baseReport/level0')
const buildDrillDown_byCustomer_level3 = require('../../shared/routines/viewCustTrend_baseReport/level3')
const buildDrillDown_byCustomer_level2 = require('../../shared/routines/viewCustTrend_baseReport/level2')
const buildDrillDown_byCustomer_level1 = require('../../shared/routines/viewCustTrend_baseReport/level1')
const buildDrillDown_byCustomer_level0 = require('../../shared/routines/viewCustTrend_baseReport/level0')
const { getStartOfWeek } = require('../../shared/queries/postgres/getDateStartByWeek')
const { getWeekForDate } = require('../../shared/queries/postgres/getWeekForDate')
const labelCols_byCust = require('../queries/hardcode/cols_byCustomer')
const labelCols_byItem_l0 = require('../queries/hardcode/cols_byItem_level0')
const labelCols_byItem_l1 = require('../queries/hardcode/cols_byItem_level1')
const labelCols_byItem_l2 = require('../queries/hardcode/cols_byItem_level2')
const labelCols_byItem_l3 = require('../queries/hardcode/cols_byItem_level3')

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

  if (option === 'Trend By Item') {
    if (filters[1] === 'SUBTOTAL') {
      // level 1 subtotal
      console.log(`getting level 1 subtotal for ${colType}...`)
      response = await buildDrillDown_byItem_level1(
        labelCols_byItem_l1,
        config,
        program,
        periodStart,
        periodEnd,
        filters,
        showFyTrend,
        startWeek,
        endWeek
      )
    }

    if (filters[1] !== 'SUBTOTAL' && filters[2] === 'SUBTOTAL') {
      // level 2 subtotal
      console.log(`getting level 2 subtotal for ${colType}...`)
      response = await buildDrillDown_byItem_level2(
        labelCols_byItem_l2,
        config,
        program,
        periodStart,
        periodEnd,
        filters,
        showFyTrend,
        startWeek,
        endWeek
      )
    }

    if (filters[1] !== 'TOTAL' && filters[1] !== 'SUBTOTAL' && filters[2] !== 'SUBTOTAL') {
      // level 3 subtotal
      console.log(`getting level 3 subtotal for ${colType}...`)
      response = await buildDrillDown_byItem_level3(
        labelCols_byItem_l3,
        config,
        program,
        periodStart,
        periodEnd,
        filters,
        showFyTrend,
        startWeek,
        endWeek
      )
    }

    if (filters[1] === 'TOTAL') {
      // level 0 total
      console.log(`getting level 0 subtotal for ${colType}...`)
      response = await buildDrillDown_byItem_level0(
        labelCols_byItem_l0,
        config,
        program,
        periodStart,
        periodEnd,
        filters,
        showFyTrend,
        startWeek,
        endWeek
      )
    }
  } else {
    // option is top customer weight, margin, or bottom customer weight.
    // Pull one set of data and filter/sum at the end based on the option.

    if (filters[1] === 'SUBTOTAL') {
      // level 1 subtotal
      console.log(`getting level 1 subtotal for ${colType}...`)
      response = await buildDrillDown_byCustomer_level1(
        labelCols_byCust,
        config,
        program,
        periodStart,
        periodEnd,
        filters,
        showFyTrend,
        startWeek,
        endWeek
      )
    }

    if (filters[1] !== 'SUBTOTAL' && filters[2] === 'SUBTOTAL') {
      // level 2 subtotal
      console.log(`getting level 2 subtotal for ${colType}...`)
      response = await buildDrillDown_byCustomer_level2(
        labelCols_byCust,
        config,
        program,
        periodStart,
        periodEnd,
        filters,
        showFyTrend,
        startWeek,
        endWeek
      )
    }

    if (filters[1] !== 'TOTAL' && filters[1] !== 'SUBTOTAL' && filters[2] !== 'SUBTOTAL') {
      // level 3 subtotal
      console.log(`getting level 3 subtotal for ${colType}...`)
      response = await buildDrillDown_byCustomer_level3(
        labelCols_byCust,
        config,
        program,
        periodStart,
        periodEnd,
        filters,
        showFyTrend,
        startWeek,
        endWeek
      )
    }

    if (filters[1] === 'TOTAL') {
      // level 0 total
      console.log(`getting level 0 subtotal for ${colType}...`)
      response = await buildDrillDown_byCustomer_level0(
        labelCols_byCust,
        config,
        program,
        periodStart,
        periodEnd,
        filters,
        showFyTrend,
        startWeek,
        endWeek
      )
    }
  }

  console.log(`get drilldown data for ${reportName} route COMPLETE. \n`)
  res.send(response)
})

module.exports = router
