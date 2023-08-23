const router = require('express').Router()
const buildReport = require('../../shared/routines/baseReport')
const { getStartOfWeek } = require('../../shared/queries/postgres/getDateStartByWeek')
const { getWeekForDate } = require('../../shared/queries/postgres/getWeekForDate')
const getDefaults = require('../utils/getDefaults')
const labelCols = require('../queries/hardcode/cols')
const getReportConfig = require('../../shared/utils/getReportConfig')

// @route   POST /api/sales/byProgram
// @desc
// @access

// Generate full weekly report of ALL programs for FG Only (biggest picture)
router.post('/', async (req, res) => {
  console.log(`\nget get weekly sales species group, program for ${req.body.start} through ${req.body.end} route HIT...`)

  console.log('req.body', req.body)

  const config = getReportConfig(req.body)
  const program = null

  // If no program, start, or end passed then default to the current fiscal year, first program alphabetically
  let defaultDate = false
  if (typeof typeof req.body.start === 'undefined' || typeof req.body.end === 'undefined') {
    const { start, end } = await getDefaults()
    req.body.start = start
    req.body.end = end
    defaultDate = true
  }

  // If showFyTrend param not passed in body then default to false
  if (typeof typeof req.body.showFyTrend === 'undefined') {
    req.body.showFyTrend = false
  }

  const startWeek = await getWeekForDate(req.body.start) // temporarily until I change the data that is being passed by the front end to the week
  const endWeek = await getWeekForDate(req.body.end) // temporarily until I change the data that is being passed by the front end to the week

  // Note that start date is the END of the first week. Need the beginning of the same week to pull invoice dates that are after this:
  const startOfWeek = await getStartOfWeek(req.body.start)
  const periodStart = startOfWeek[0].formatted_date_start

  const resp = await buildReport(periodStart, req.body.end, program, req.body.showFyTrend, startWeek, endWeek, config, labelCols)

  // if default date then add to response
  if (defaultDate) {
    resp.defaultDate = req.body.end
  }

  console.log(`get weekly sales species group, program for ${req.body.start} through ${req.body.end} route COMPLETE. \n`)
  res.send(resp)
})

module.exports = router
