const router = require('express').Router()
const getDetail_invenFg = require('../../shared/routines/getDetail_invenFg')
const getDetail_salesOrder = require('../../shared/routines/getDetail_salesOrder')
const getDetail_salesInvoice = require('../../shared/routines/getDetail_salesInvoice')
const getDetail_purchaseOrder = require('../../shared/routines/getDetail_purchaseOrder')
const { getWeekForDate } = require('../../shared/queries/postgres/getWeekForDate')

// @route   POST /api/sales/detail/forProgBySpecBrndSize/
// @desc    Get drilldown data for a given report and filter
// @access  Private

router.post('/', async (req, res) => {
  const { program, option, filters, columnDataName, reportName, colType, periodStart, periodEnd, fyTrendCol, fyYtdTrendCol } = req.body
  let { year } = req.body

  const config = {
    l1_field: 'ms.fg_fresh_frozen',
    l2_field: 'ms.brand',
    l3_field: 'ms.size_name',
  }

  console.log(`\nget detail data for ${reportName} route HIT...`)

  let response = null

  if (colType === 'invenFg') {
    response = await getDetail_invenFg(config, program, filters, columnDataName)
  }

  if (colType === 'salesOrder') {
    response = await getDetail_salesOrder(config, program, filters, columnDataName)
  }

  if (colType === 'salesInvoice') {
    // Transform all queries to have a start week, end week, and year
    let startWeek = 1
    let endWeek = 53
    let priorYearData = false

    if (fyYtdTrendCol) {
      startWeek = await getWeekForDate(periodStart)
      endWeek = await getWeekForDate(periodEnd)
      priorYearData = true
      year = columnDataName.split('_')[0]
    }
    if (fyTrendCol) {
      priorYearData = true
      year = columnDataName.split('_')[0]
    }
    if (columnDataName.split('-')[1]?.charAt(0) === 'W') {
      startWeek = columnDataName.split('-')[1].split('W')[1]
      endWeek = columnDataName.split('-')[1].split('W')[1]
      year = columnDataName.split('-')[0]
    }
    response = await getDetail_salesInvoice(config, program, filters, startWeek, endWeek, year)
  }

  if (colType === 'purchaseOrder') {
    response = await getDetail_purchaseOrder(config, program, filters)
  }

  console.log(`get detail data for ${reportName} route COMPLETE. \n`)
  res.send(response)
})

module.exports = router
