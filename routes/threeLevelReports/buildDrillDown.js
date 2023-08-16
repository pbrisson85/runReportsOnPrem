const router = require('express').Router()
const buildDrillDown_byItem_level3 = require('../../shared/routines/drilldown/buildDrillDown_byItem_level3')
const buildDrillDown_byItem_level2 = require('../../shared/routines/drilldown/buildDrillDown_byItem_level2')
const buildDrillDown_byItem_level1 = require('../../shared/routines/drilldown/buildDrillDown_byItem_level1')
const buildDrillDown_byItem_level0 = require('../../shared/routines/drilldown/buildDrillDown_byItem_level0')
const buildDrillDown_byCustomer_level3 = require('../../shared/routines/drilldown/buildDrillDown_byCustomer_level3')
const buildDrillDown_byCustomer_level2 = require('../../shared/routines/drilldown/buildDrillDown_byCustomer_level2')
const buildDrillDown_byCustomer_level1 = require('../../shared/routines/drilldown/buildDrillDown_byCustomer_level1')
const buildDrillDown_byCustomer_level0 = require('../../shared/routines/drilldown/buildDrillDown_byCustomer_level0')
const { getStartOfWeek } = require('../../shared/queries/postgres/getDateStartByWeek')
const { getWeekForDate } = require('../../shared/queries/postgres/getWeekForDate')

const labelCols_byCust_forProgByFrzBrndSize = require('../../reports/forProgByFrzBrndSize/queries/hardcode/cols_byCustomer')
const labelCols_byItem_l0_forProgByFrzBrndSize = require('../../reports/forProgByFrzBrndSize/queries/hardcode/cols_byItem_level0')
const labelCols_byItem_l1_forProgByFrzBrndSize = require('../../reports/forProgByFrzBrndSize/queries/hardcode/cols_byItem_level1')
const labelCols_byItem_l2_forProgByFrzBrndSize = require('../../reports/forProgByFrzBrndSize/queries/hardcode/cols_byItem_level2')
const labelCols_byItem_l3_forProgByFrzBrndSize = require('../../reports/forProgByFrzBrndSize/queries/hardcode/cols_byItem_level3')

const labelCols_byCust_forProgByFrzSoakSize = require('../../reports/forProgByFrzSoakSize/queries/hardcode/cols_byCustomer')
const labelCols_byItem_l0_forProgByFrzSoakSize = require('../../reports/forProgByFrzSoakSize/queries/hardcode/cols_byItem_level0')
const labelCols_byItem_l1_forProgByFrzSoakSize = require('../../reports/forProgByFrzSoakSize/queries/hardcode/cols_byItem_level1')
const labelCols_byItem_l2_forProgByFrzSoakSize = require('../../reports/forProgByFrzSoakSize/queries/hardcode/cols_byItem_level2')
const labelCols_byItem_l3_forProgByFrzSoakSize = require('../../reports/forProgByFrzSoakSize/queries/hardcode/cols_byItem_level3')

const labelCols_byCust_forProgBySpecBrndSize = require('../../reports/forProgBySpecBrndSize/queries/hardcode/cols_byCustomer')
const labelCols_byItem_l0_forProgBySpecBrndSize = require('../../reports/forProgBySpecBrndSize/queries/hardcode/cols_byItem_level0')
const labelCols_byItem_l1_forProgBySpecBrndSize = require('../../reports/forProgBySpecBrndSize/queries/hardcode/cols_byItem_level1')
const labelCols_byItem_l2_forProgBySpecBrndSize = require('../../reports/forProgBySpecBrndSize/queries/hardcode/cols_byItem_level2')
const labelCols_byItem_l3_forProgBySpecBrndSize = require('../../reports/forProgBySpecBrndSize/queries/hardcode/cols_byItem_level3')

const labelCols_byCust_forProgBySpecSoakSize = require('../../reports/forProgBySpecSoakSize/queries/hardcode/cols_byCustomer')
const labelCols_byItem_l0_forProgBySpecSoakSize = require('../../reports/forProgBySpecSoakSize/queries/hardcode/cols_byItem_level0')
const labelCols_byItem_l1_forProgBySpecSoakSize = require('../../reports/forProgBySpecSoakSize/queries/hardcode/cols_byItem_level1')
const labelCols_byItem_l2_forProgBySpecSoakSize = require('../../reports/forProgBySpecSoakSize/queries/hardcode/cols_byItem_level2')
const labelCols_byItem_l3_forProgBySpecSoakSize = require('../../reports/forProgBySpecSoakSize/queries/hardcode/cols_byItem_level3')

// @route   POST /api/sales/drillDown/forProgBySpecSoakSize
// @desc    Get drilldown data for a given report and filter
// @access  Private

router.post('/', async (req, res) => {
  const { program, option, filters, columnDataName, reportName, colType, periodEnd, showFyTrend } = req.body
  let { periodStart } = req.body

  // Set config and cols
  let config = null
  let labelCols_byCust = null
  let labelCols_byItem_l0 = null
  let labelCols_byItem_l1 = null
  let labelCols_byItem_l2 = null
  let labelCols_byItem_l3 = null

  switch (report) {
    case 'frzBrndSize':
      labelCols_byCust = labelCols_byCust_forProgByFrzBrndSize
      labelCols_byItem_l0 = labelCols_byItem_l0_forProgByFrzBrndSize
      labelCols_byItem_l1 = labelCols_byItem_l1_forProgByFrzBrndSize
      labelCols_byItem_l2 = labelCols_byItem_l2_forProgByFrzBrndSize
      labelCols_byItem_l3 = labelCols_byItem_l3_forProgByFrzBrndSize

      config = {
        l1_field: 'ms.fg_fresh_frozen',
        l2_field: 'ms.brand',
        l3_field: 'ms.size_name',
      }
      break
    case 'frzSoakSize':
      labelCols_byCust = labelCols_byCust_forProgByFrzSoakSize
      labelCols_byItem_l0 = labelCols_byItem_l0_forProgByFrzSoakSize
      labelCols_byItem_l1 = labelCols_byItem_l1_forProgByFrzSoakSize
      labelCols_byItem_l2 = labelCols_byItem_l2_forProgByFrzSoakSize
      labelCols_byItem_l3 = labelCols_byItem_l3_forProgByFrzSoakSize

      config = {
        l1_field: 'ms.fg_fresh_frozen',
        l2_field: 'ms.fg_treatment',
        l3_field: 'ms.size_name',
      }
      break
    case 'specBrndSize':
      labelCols_byCust = labelCols_byCust_forProgBySpecBrndSize
      labelCols_byItem_l0 = labelCols_byItem_l0_forProgBySpecBrndSize
      labelCols_byItem_l1 = labelCols_byItem_l1_forProgBySpecBrndSize
      labelCols_byItem_l2 = labelCols_byItem_l2_forProgBySpecBrndSize
      labelCols_byItem_l3 = labelCols_byItem_l3_forProgBySpecBrndSize

      config = {
        l1_field: 'ms.species',
        l2_field: 'ms.brand',
        l3_field: 'ms.size_name',
      }
      break
    case 'specSoakSize':
      labelCols_byCust = labelCols_byCust_forProgBySpecSoakSize
      labelCols_byItem_l0 = labelCols_byItem_l0_forProgBySpecSoakSize
      labelCols_byItem_l1 = labelCols_byItem_l1_forProgBySpecSoakSize
      labelCols_byItem_l2 = labelCols_byItem_l2_forProgBySpecSoakSize
      labelCols_byItem_l3 = labelCols_byItem_l3_forProgBySpecSoakSize

      config = {
        l1_field: 'ms.species',
        l2_field: 'ms.fg_treatment',
        l3_field: 'ms.size_name',
      }
      break
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
