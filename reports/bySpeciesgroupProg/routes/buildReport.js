const router = require('express').Router()
const buildReport = require('../routines/buildReport')
const { getStartOfWeek } = require('../../shared/queries/postgres/getDateStartByWeek')
const { getWeekForDate } = require('../../shared/queries/postgres/getWeekForDate')
const getDefaults = require('../utils/getDefaults')

// @route   POST /api/sales/byProgram
// @desc
// @access

// Generate full weekly report of ALL programs for FG Only (biggest picture)
router.post('/', async (req, res) => {
  console.log(`\nget get weekly sales species group, program for ${req.body.start} through ${req.body.end} route HIT...`)

  // If no program, start, or end passed then default to the current fiscal year, first program alphabetically
  if (typeof typeof req.body.start === 'undefined' || typeof req.body.end === 'undefined') {
    const { start, end } = await getDefaults()
    req.body.start = start
    req.body.end = end
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

  const resp = await buildReport(periodStart, req.body.end, req.body.showFyTrend, startWeek, endWeek)

  console.log(`get weekly sales species group, program for ${req.body.start} through ${req.body.end} route COMPLETE. \n`)
  res.send(resp)
})

module.exports = router
