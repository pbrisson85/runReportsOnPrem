const router = require('express').Router()
const { getWeekForDate } = require('../queries/postgres/getWeekForDate')
const getReportConfig = require('../utils/getReportConfig')
const { getSo_detail, getSoTagged_detail, getSoUntagged_detail } = require('../queries/postgres/getDetail_inTrendByCust/getSo')
const { getSoByWk_detail, getSoByWkTagged_detail, getSoByWkUntagged_detail } = require('../queries/postgres/getDetail_inTrendByCust/getSoByWeek')
const { getSales_detail } = require('../queries/postgres/getDetail_inTrendByCust/getSales')

// @route   POST /api/sales/detail/forProgBySpecBrndSize/
// @desc
// @access  Private

router.post('/', async (req, res) => {
  const { columnDataName, colType, periodStart, periodEnd, fyTrendCol, fyYtdTrendCol, reportFormat } = req.body
  let { year } = req.body

  console.log(`\nget detail data in trend by customer for ${reportFormat} route HIT...`)

  const config = getReportConfig(req.body)
  let detail = null

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

  console.log(`get detail data in trend by customer for ${reportFormat} route COMPLETE. \n`)
  res.send(detail)
})

module.exports = router
