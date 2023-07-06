const router = require('express').Router()
const getDetail_invenFg = require('../routines/getDetail_invenFg')
const getDetail_salesOrder = require('../routines/getDetail_salesOrder')
const getDetail_salesInvoice = require('../routines/getDetail_salesInvoice')
const getDetail_purchaseOrder = require('../routines/getDetail_purchaseOrder')
const { getStartOfWeek } = require('../../shared/queries/postgres/getDateStartByWeek')

// @route   POST /api/sales/detail/forProgBySpecBrndSize/
// @desc    Get drilldown data for a given report and filter
// @access  Private

router.post('/', async (req, res) => {
  const { program, option, filters, columnDataName, reportName, colType, periodStart, periodEnd, trend } = req.body

  console.log(`\nget detail data for ${reportName} route HIT...`)

  // Note that start date is the END of the first week. Need the beginning of the same week to pull invoice dates that are after this:
  let startWeek = await getStartOfWeek(periodStart)
  startWeek = startWeek[0].formatted_date_start

  let response = null

  if (colType === 'invenFg') {
    response = await getDetail_invenFg(program, filters, columnDataName)
  }

  if (colType === 'salesOrder') {
    response = await getDetail_salesOrder(program, filters, columnDataName)
  }

  if (colType === 'salesInvoice') {
    response = await getDetail_salesInvoice(program, filters, columnDataName, startWeek, periodEnd)
  }

  if (colType === 'purchaseOrder') {
    response = await getDetail_purchaseOrder(program, filters)
  }

  console.log(`get detail data for ${reportName} route COMPLETE. \n`)
  res.send(response)
})

module.exports = router
