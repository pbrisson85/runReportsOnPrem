const router = require('express').Router()
const getDetail_invenFg = require('../routines/getDetail_inTrendByItem/invenFG')
const getDetail_salesOrder = require('../routines/getDetail_inTrendByItem/salesOrder')
const getDetail_salesInvoice = require('../routines/getDetail_inTrendByItem/salesInvoice')
const getDetail_purchaseOrder = require('../routines/getDetail_inTrendByItem/purchaseOrder')
const { getWeekForDate } = require('../queries/postgres/getWeekForDate')

// @route   POST /api/sales/detail/forProgBySpecBrndSize/
// @desc
// @access  Private

router.post('/', async (req, res) => {
  const { program, option, filters, columnDataName, reportName, colType, periodStart, periodEnd, fyTrendCol, fyYtdTrendCol } = req.body
  let { year } = req.body

  console.log(`\nget detail data in trend by customer for ${reportName} route HIT...`)

  let response = null

  if (colType === 'invenFg') {
    response = await getDetail_invenFg(program, filters, columnDataName)
  }

  if (colType === 'salesOrder') {
    response = await getDetail_salesOrder(program, filters, columnDataName)
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
    response = await getDetail_salesInvoice(program, filters, startWeek, endWeek, year)
  }

  if (colType === 'purchaseOrder') {
    response = await getDetail_purchaseOrder(program, filters)
  }

  console.log(`get detail data in trend by customer for ${reportName} route COMPLETE. \n`)

  res.send(response)
})

module.exports = router
