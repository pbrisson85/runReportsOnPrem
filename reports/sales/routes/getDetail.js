const router = require('express').Router()
const { getWeekForDate } = require('../queries/postgres/getWeekForDate')
const getReportConfig = require('../utils/getReportConfig')
const {
  getFgInven_detail,
  getFgInTransit_detail,
  getFgAtLoc_detail,
  getFgAtLoc_untagged_detail,
  getFgAtLoc_tagged_detail,
} = require('../queries/postgres/getDetail/getFgInven')
const { getFgPo_detail } = require('../queries/postgres/getDetail/getFgOpenPo')
const { getSales_detail } = require('../queries/postgres/getDetail/getSales')
const { getSo_detail, getSoTagged_detail, getSoUntagged_detail } = require('../queries/postgres/getDetail/getSo')
const { getSoByWk_detail, getSoByWkTagged_detail, getSoByWkUntagged_detail } = require('../queries/postgres/getDetail/getSoByWeek')

// @route   POST /api/sales/detail/forProgBySpecBrndSize/
// @desc
// @access  Private

router.post('/', async (req, res) => {
  const { columnDataName, colType, periodStart, periodEnd, fyTrendCol, fyYtdTrendCol, reportFormat } = req.body
  let { year } = req.body

  console.log(`\nget detail data for ${reportFormat} route HIT...`)

  const config = getReportConfig(req.body)
  let detail = null

  if (colType === 'invenFg') {
    switch (columnDataName) {
      case 'FG INVEN':
        detail = await getFgInven_detail(config)
        break
      case 'FG IN TRANSIT':
        detail = await getFgInTransit_detail(config)
        break
      case 'FG ON HAND':
        detail = await getFgAtLoc_detail(config)
        break
      case 'FG ON HAND UNTAGGED':
        detail = await getFgAtLoc_untagged_detail(config)
        break
      case 'FG ON HAND TAGGED':
        detail = await getFgAtLoc_tagged_detail(config)
        break
    }
  }

  if (colType === 'salesOrder') {
    switch (columnDataName) {
      case 'FG OPEN ORDER':
        detail = await getSo_detail(config)
        break
      case 'FG OPEN ORDER TAGGED':
        detail = await getSoTagged_detail(config)
        break
      case 'FG OPEN ORDER UNTAGGED':
        detail = await getSoUntagged_detail(config)
        break
      default:
        // Must be a trend column
        // note colName is 2023-W15_so , 2023-W15_so_untg, 2023-W15_so_tg
        const isSo = columnDataName.split('_').length === 2 && columnDataName.split('_')[1] === 'so'
        const isSoUntg = columnDataName.split('_')[2] === 'untg'
        const isSoTg = columnDataName.split('_')[2] === 'tg'
        const weekSerial = columnDataName.split('_')[0]

        // query trend for all sales orders
        if (isSo) detail = await getSoByWk_detail(config, weekSerial)
        // query trend for untagged sales orders
        if (isSoUntg) detail = await getSoByWkUntagged_detail(config, weekSerial)
        // query trend for tagged sales orders
        if (isSoTg) detail = await getSoByWkTagged_detail(config, weekSerial)
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
    detail = await getSales_detail(config, startWeek, endWeek, year)
  }

  if (colType === 'purchaseOrder') {
    detail = await getFgPo_detail(config)
  }

  console.log(`get detail data for ${reportFormat} route COMPLETE. \n`)
  res.send(detail)
})

module.exports = router
