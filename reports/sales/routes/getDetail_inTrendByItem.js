const router = require('express').Router()
const { getWeekForDate } = require('../queries/postgres/getWeekForDate')
const {
  byItem_getSo_detail,
  byItem_getSoTagged_detail,
  byItem_getSoUntagged_detail,
} = require('../queries/postgres/getDetail_inTrendByItem/getSo')
const {
  byItem_getSoByWk_detail,
  byItem_getSoByWkTagged_detail,
  byItem_getSoByWkUntagged_detail,
} = require('../queries/postgres/getDetail_inTrendByItem/getSoByWeek')
const { byItem_getSales_detail } = require('../queries/postgres/getDetail_inTrendByItem/getSales')
const { byItem_getFgPo_detail } = require('../queries/postgres/getDetail_inTrendByItem/getFgOpenPo')
const {
  byItem_getFgInven_detail,
  byItem_getFgInTransit_detail,
  byItem_getFgAtLoc_detail,
  byItem_getFgAtLoc_untagged_detail,
  byItem_getFgAtLoc_tagged_detail,
} = require('../../queries/postgres/getDetail_inTrendByItem/getFgInven')

// @route   POST /api/sales/detail/forProgBySpecBrndSize/
// @desc
// @access  Private

router.post('/', async (req, res) => {
  const { program, option, filters, columnDataName, colType, periodStart, periodEnd, fyTrendCol, fyYtdTrendCol, format } = req.body
  let { year } = req.body

  console.log(`\nget detail data in trend by customer for ${format} route HIT...`)

  let detail = null

  if (colType === 'invenFg') {
    switch (columnDataName) {
      case 'FG INVEN':
        detail = await byItem_getFgInven_detail(filters[0])
        break
      case 'FG IN TRANSIT':
        detail = await byItem_getFgInTransit_detail(filters[0])
        break
      case 'FG ON HAND':
        detail = await byItem_getFgAtLoc_detail(filters[0])
        break
      case 'FG ON HAND UNTAGGED':
        detail = await byItem_getFgAtLoc_untagged_detail(filters[0])
        break
      case 'FG ON HAND TAGGED':
        detail = await byItem_getFgAtLoc_tagged_detail(filters[0])
        break
    }
  }

  if (colType === 'salesOrder') {
    switch (columnDataName) {
      case 'FG OPEN ORDER':
        detail = await byItem_getSo_detail(filters[0])
        break
      case 'FG OPEN ORDER TAGGED':
        detail = await byItem_getSoTagged_detail(filters[0])
        break
      case 'FG OPEN ORDER UNTAGGED':
        detail = await byItem_getSoUntagged_detail(filters[0])
        break
      default:
        // Must be a trend column
        // note colName is 2023-W15_so , 2023-W15_so_untg, 2023-W15_so_tg
        const isSo = columnDataName.split('_').length === 2 && columnDataName.split('_')[1] === 'so'
        const isSoUntg = columnDataName.split('_')[2] === 'untg'
        const isSoTg = columnDataName.split('_')[2] === 'tg'
        const weekSerial = columnDataName.split('_')[0]

        // query trend for all sales orders
        if (isSo) detail = await byItem_getSoByWk_detail(filters[0], weekSerial)
        // query trend for untagged sales orders
        if (isSoUntg) detail = await byItem_getSoByWkUntagged_detail(filters[0], weekSerial)
        // query trend for tagged sales orders
        if (isSoTg) detail = await byItem_getSoByWkTagged_detail(filters[0], weekSerial)
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

    detail = await byItem_getSales_detail(startWeek, endWeek, filters, year)
  }

  if (colType === 'purchaseOrder') {
    detail = byItem_getFgPo_detail(filters[0])
  }

  console.log(`get detail data in trend by customer for ${format} route COMPLETE. \n`)

  res.send(detail)
})

module.exports = router
