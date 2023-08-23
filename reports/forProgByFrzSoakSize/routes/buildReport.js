const router = require('express').Router()
const buildReport = require('../../shared/routines/baseReport')
const { getStartOfWeek } = require('../../shared/queries/postgres/getDateStartByWeek')
const { getWeekForDate } = require('../../shared/queries/postgres/getWeekForDate')
const labelCols = require('../queries/hardcode/cols')
const getReportConfig = require('../../shared/utils/getReportConfig')

// @route   POST /api/sales/forProgramFfpds
// @desc
// @access

// Generate full weekly report of One program for FG Only (1st level drill down)
router.post('/', async (req, res) => {
  console.log(
    `\nget get weekly sales for ${req.body.program}, by freeze, soak, size during ${req.body.start} through ${req.body.end} route HIT...`
  )

  const config = getReportConfig(req.body)

  // Note that start date is the END of the first week. Need the beginning of the same week to pull invoice dates that are after this:
  const startOfWeek = await getStartOfWeek(req.body.start)
  const periodStart = startOfWeek[0].formatted_date_start

  // If showFyTrend param not passed in body then default to false
  if (typeof typeof req.body.showFyTrend === 'undefined') {
    req.body.showFyTrend = false
  }

  const startWeek = await getWeekForDate(req.body.start) // temporarily until I change the data that is being passed by the front end to the week
  const endWeek = await getWeekForDate(req.body.end) // temporarily until I change the data that is being passed by the front end to the week

  const resp = await buildReport(periodStart, req.body.end, req.body.program, req.body.showFyTrend, startWeek, endWeek, config, labelCols)

  console.log(
    `get get weekly sales for ${req.body.program} by freeze, soak, size during ${req.body.start} through ${req.body.end} route COMPLETE. \n`
  )
  res.send(resp)
})

module.exports = router
