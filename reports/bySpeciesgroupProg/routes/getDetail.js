const router = require('express').Router()
const getDetail_invenFg = require('../routines/getDetail_invenFg')
const getDetail_salesOrder = require('../routines/getDetail_salesOrder')
const getDetail_salesInvoice = require('../routines/getDetail_salesInvoice')
const getDetail_purchaseOrder = require('../routines/getDetail_purchaseOrder')
const { getStartOfWeek } = require('../../shared/queries/postgres/getDateStartByWeek')
const { getWeekForDate } = require('../../shared/queries/postgres/getWeekForDate')

// @route   POST /api/sales/detail/forProgBySpecBrndSize/
// @desc    Get drilldown data for a given report and filter
// @access  Private

router.post('/', async (req, res) => {
  const { program, option, filters, columnDataName, reportName, colType, periodStart, periodEnd } = req.body

  console.log(`\nget detail data for ${reportName} route HIT...`)

  const startWeek = await getWeekForDate(periodStart) // temporarily until I change the data that is being passed by the front end to the week
  const endWeek = await getWeekForDate(periodEnd) // temporarily until I change the data that is being passed by the front end to the week

  // Note that start date is the END of the first week. Need the beginning of the same week to pull invoice dates that are after this:
  const startOfWeek = await getStartOfWeek(periodStart)
  periodStart = startOfWeek[0].formatted_date_start

  let response = null

  if (colType === 'invenFg') {
    response = await getDetail_invenFg(program, filters, columnDataName)
  }

  if (colType === 'salesOrder') {
    response = await getDetail_salesOrder(program, filters, columnDataName)
  }

  if (colType === 'salesInvoice') {
    response = await getDetail_salesInvoice(program, filters, columnDataName, periodStart, periodEnd)
  }

  if (colType === 'purchaseOrder') {
    response = await getDetail_purchaseOrder(program, filters)
  }

  console.log(`get detail data for ${reportName} route COMPLETE. \n`)
  res.send(response)
})

module.exports = router
