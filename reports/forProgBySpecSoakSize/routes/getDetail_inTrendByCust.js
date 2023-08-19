const router = require('express').Router()
const getDetail_salesOrder = require('../../shared/routines/getDetail_inTrendByCust/salesOrder')
const getDetail_salesInvoice = require('../../shared/routines/getDetail_inTrendByCust/salesInvoice')
const { getWeekForDate } = require('../../shared/queries/postgres/getWeekForDate')

// @route   POST /api/sales/detail/forProgBySpecBrndSize/
// @desc    Get drilldown data for a given report and filter
// @access  Private

router.post('/', async (req, res) => {
  const { program, option, filters, columnDataName, reportName, colType, periodStart, periodEnd, fyTrendCol, fyYtdTrendCol } = req.body
  let { year } = req.body

  const config = {
    l1_field: 'ms.species',
    l2_field: 'ms.fg_treatment',
    l3_field: 'ms.size_name',
  }

  console.log(`\nget detail data for ${reportName} route HIT...`)

  let response = null

  if (colType === 'salesOrder') {
    response = await getDetail_salesOrder(config, program, filters, columnDataName)
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
    response = await getDetail_salesInvoice(config, program, filters, startWeek, endWeek, year)
  }

  console.log(`get detail data for ${reportName} route COMPLETE. \n`)
  res.send(response)
})

module.exports = router
