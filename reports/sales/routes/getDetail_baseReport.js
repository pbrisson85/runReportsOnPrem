const router = require('express').Router()
const { getWeekForDate } = require('../queries/postgres/getWeekForDate')
const getReportConfig = require('../utils/getReportConfig')
const {
  getFgInven_detail,
  getFgInTransit_detail,
  getFgAtLoc_detail,
  getFgAtLoc_untagged_detail,
  getFgAtLoc_tagged_detail,
} = require('../queries/postgres/getDetail_baseReport/getFgInven')
const { getFgPo_detail } = require('../queries/postgres/getDetail_baseReport/getFgOpenPo')
const { getSales_detail } = require('../queries/postgres/getDetail_baseReport/getSales')
const { getSo_detail, getSoTagged_detail, getSoUntagged_detail } = require('../queries/postgres/getDetail_baseReport/getSo')
const { getSoByWk_detail, getSoByWkTagged_detail, getSoByWkUntagged_detail } = require('../queries/postgres/getDetail_baseReport/getSoByWeek')

// @route   POST /api/sales/detail/forProgBySpecBrndSize/
// @desc
// @access  Private

router.post('/', async (req, res) => {
  const { option, filters, columnDataName, colType, periodStart, periodEnd, fyTrendCol, fyYtdTrendCol, format } = req.body
  let { program, year } = req.body

  console.log(`\nget detail data base report for ${format} route HIT...`)

  const config = getReportConfig(req.body)
  let detail = null
  let level = null

  if (filters[2] === null) {
    // two level report
    if (filters[0] === 'SUBTOTAL' || filters[1] === 'SUBTOTAL') level = 1
    if (filters[0] !== 'SUBTOTAL' && filters[1] !== 'SUBTOTAL') level = 2
    if (filters[1] === 'TOTAL') level = 0
  } else {
    // three level report
    if (filters[1] === 'SUBTOTAL' && filters[2] === 'SUBTOTAL') level = 1
    if (filters[1] !== 'SUBTOTAL' && filters[2] === 'SUBTOTAL') level = 2
    if (filters[1] !== 'SUBTOTAL' && filters[2] !== 'SUBTOTAL' && filters[1] !== 'TOTAL' && filters[2] !== 'TOTAL') level = 3
    if (filters[1] === 'TOTAL' && filters[2] === 'TOTAL') level = 0
  }

  if (colType === 'invenFg') {
    switch (columnDataName) {
      case 'FG INVEN':
        detail = await getFgInven_detail(config, config.program, filters, level)
        break
      case 'FG IN TRANSIT':
        detail = await getFgInTransit_detail(config, config.program, filters, level)
        break
      case 'FG ON HAND':
        detail = await getFgAtLoc_detail(config, config.program, filters, level)
        break
      case 'FG ON HAND UNTAGGED':
        detail = await getFgAtLoc_untagged_detail(config, config.program, filters, level)
        break
      case 'FG ON HAND TAGGED':
        detail = await getFgAtLoc_tagged_detail(config, config.program, filters, level)
        break
    }
  }

  if (colType === 'salesOrder') {
    switch (columnDataName) {
      case 'FG OPEN ORDER':
        detail = await getSo_detail(config, config.program, filters, level)
        break
      case 'FG OPEN ORDER TAGGED':
        detail = await getSoTagged_detail(config, config.program, filters, level)
        break
      case 'FG OPEN ORDER UNTAGGED':
        detail = await getSoUntagged_detail(config, config.program, filters, level)
        break
      default:
        // Must be a trend column
        // note colName is 2023-W15_so , 2023-W15_so_untg, 2023-W15_so_tg
        const isSo = columnDataName.split('_').length === 2 && columnDataName.split('_')[1] === 'so'
        const isSoUntg = columnDataName.split('_')[2] === 'untg'
        const isSoTg = columnDataName.split('_')[2] === 'tg'
        const weekSerial = columnDataName.split('_')[0]

        // query trend for all sales orders
        if (isSo) detail = await getSoByWk_detail(config, config.program, filters, weekSerial, level)
        // query trend for untagged sales orders
        if (isSoUntg) detail = await getSoByWkUntagged_detail(config, config.program, filters, weekSerial, level)
        // query trend for tagged sales orders
        if (isSoTg) detail = await getSoByWkTagged_detail(config, config.program, filters, weekSerial, level)
        break
    }
  }

  if (colType === 'salesInvoice') {
    // Transform all queries to have a start week, end week, and year
    let startWeek = await getWeekForDate(periodStart)
    let endWeek = await getWeekForDate(periodEnd)
    let priorYearData = false

    if (fyYtdTrendCol) {
      priorYearData = true
      year = columnDataName.split('_')[0]
    }
    if (fyTrendCol) {
      startWeek = 1
      endWeek = 53
      priorYearData = true
      year = columnDataName.split('_')[0]
    }
    if (columnDataName.split('-')[1]?.charAt(0) === 'W') {
      startWeek = columnDataName.split('-')[1].split('W')[1]
      endWeek = columnDataName.split('-')[1].split('W')[1]
      year = columnDataName.split('-')[0]
    }
    detail = await getSales_detail(config, startWeek, endWeek, config.program, filters, year, level)
  }

  if (colType === 'purchaseOrder') {
    detail = await getFgPo_detail(config, config.program, filters, level)
  }

  console.log(`get detail data base report for ${format} route COMPLETE. \n`)
  res.send(detail)
})

module.exports = router
