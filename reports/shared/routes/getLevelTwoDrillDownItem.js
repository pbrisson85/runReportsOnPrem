const router = require('express').Router()
const buildDrilldown = require('../routines/getCustomerTrendByItem_levelTwoDrilldown')
const { getStartOfWeek } = require('../queries/postgres/getDateStartByWeek')

// @route   POST /api/sales/detail/forProgBySpecBrndSize/
// @desc    Get drilldown data for a given report and filter
// @access  Private

router.post('/', async (req, res) => {
  // While in drilldown of an item, can drill down again to return the customeer trend for that item.

  const { program, option, filters, columnDataName, reportName, colType, periodStart, periodEnd, showFyTrend } = req.body

  console.log(`\nget level two drilldown on item route HIT...`)

  // Note that start date is the END of the first week. Need the beginning of the same week to pull invoice dates that are after this:
  let startWeek = await getStartOfWeek(periodStart)
  startWeek = startWeek[0].formatted_date_start

  let response = null

  response = await buildDrilldown(filters[0], startWeek, periodEnd, program, filters)

  console.log(`get level two drilldown on item route COMPLETE. \n`)

  res.send(response)
})

module.exports = router
