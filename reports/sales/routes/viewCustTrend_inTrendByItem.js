const router = require('express').Router()
const buildDrilldown = require('../routines/viewCustTrend_inTrendByItem')
const { getStartOfWeek } = require('../queries/postgres/getDateStartByWeek')
const { getWeekForDate } = require('../queries/postgres/getWeekForDate')

// @route   POST /api/sales/detail/forProgBySpecBrndSize/
// @desc
// @access  Private

router.post('/', async (req, res) => {
  // While in drilldown of an item, can drill down again to return the customeer trend for that item.

  const { program, option, filters, columnDataName, colType, periodEnd, showFyTrend, format } = req.body
  let { periodStart } = req.body

  console.log(`\nget level two drilldown on item for ${format} route HIT...`)

  // Note that start date is the END of the first week. Need the beginning of the same week to pull invoice dates that are after this:
  const startOfWeek = await getStartOfWeek(periodStart)
  periodStart = startOfWeek[0].formatted_date_start

  let response = null

  const startWeek = await getWeekForDate(periodStart) // temporarily until I change the data that is being passed by the front end to the week
  const endWeek = await getWeekForDate(periodEnd) // temporarily until I change the data that is being passed by the front end to the week

  response = await buildDrilldown(filters[0], periodStart, periodEnd, program, filters, showFyTrend, startWeek, endWeek)

  console.log(`get level two drilldown on item for ${format}  route COMPLETE. \n`)

  res.send(response)
})

module.exports = router
