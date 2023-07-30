const router = require('express').Router()
const getDetail_salesOrder = require('../routines/getDetail_inDrillDownByCust_salesOrder')
const getDetail_salesInvoice = require('../routines/getDetail_inDrillDownByCust_salesInvoice')
const { getStartOfWeek } = require('../../shared/queries/postgres/getDateStartByWeek')
const { getWeekForDate } = require('../../shared/queries/postgres/getWeekForDate')

// @route   POST /api/sales/detail/forProgBySpecBrndSize/
// @desc    Get drilldown data for a given report and filter
// @access  Private

router.post('/', async (req, res) => {
  const { program, option, filters, columnDataName, reportName, colType, periodStart, periodEnd } = req.body

  console.log(`\nget detail data for ${reportName} route HIT...`)

  periodStart = await getWeekForDate(periodStart) // temporarily until I change the data that is being passed by the front end to the week
  periodEnd = await getWeekForDate(periodEnd) // temporarily until I change the data that is being passed by the front end to the week

  let response = null

  if (colType === 'salesOrder') {
    response = await getDetail_salesOrder(program, filters, columnDataName)
  }

  if (colType === 'salesInvoice') {
    response = await getDetail_salesInvoice(program, filters, columnDataName, periodStart, periodEnd)
  }

  console.log(`get detail data for ${reportName} route COMPLETE. \n`)
  res.send(response)
})

module.exports = router
