const router = require('express').Router()
const buildReport = require('../routines/baseReport')
const { getStartOfWeek } = require('../queries/postgres/getDateStartByWeek')
const { getWeekForDate } = require('../queries/postgres/getWeekForDate')
const getDefaults = require('../utils/getReportDefaults')
const getCols = require('../queries/hardcode/cols')
const getReportConfig = require('../utils/getReportConfig')

// @route   POST /api/sales/byProgram
// @desc
// @access

// Generate full weekly report of ALL programs for FG Only (biggest picture)
router.post('/', async (req, res) => {
  const { format } = req.body
  let { start, end, showFyTrend } = req.body

  const config = getReportConfig(req.body)

  // If showFyTrend param not passed in body then default to false (COULD ADD THIS TO THE CONFIG FILE + add explanation, why would it be undefined)
  if (typeof showFyTrend === 'undefined') {
    showFyTrend = false
  }

  // If start, or end passed then default (COULD ADD THIS TO THE CONFIG FILE + add explanation, why would it be undefined)
  let defaultDateFlag = false
  if (typeof typeof start === 'undefined' || typeof end === 'undefined') {
    const { defaultStart, defaultEnd } = await getDefaults()
    start = defaultStart
    end = defaultEnd
    defaultDateFlag = true
  }

  // Note that start date is the END of the first week. Need the beginning of the same week to pull invoice dates that are after this: (COULD ADD THIS TO THE CONFIG FILE + add explanation, why would it be undefined)
  const startOfWeek = await getStartOfWeek(start)
  const periodStart = startOfWeek[0].formatted_date_start

  const labelCols = getCols(req.body) // (COULD ADD THIS TO THE CONFIG FILE + add explanation, why would it be undefined)

  console.log(`\nget get weekly sales species group, program for ${start} through ${end} for ${format} route HIT...`)

  const startWeek = await getWeekForDate(start) // temporarily until I change the data that is being passed by the front end to the week
  const endWeek = await getWeekForDate(end) // temporarily until I change the data that is being passed by the front end to the week

  const response = await buildReport(periodStart, end, showFyTrend, startWeek, endWeek, config, labelCols)

  // if default date then add to response
  if (defaultDateFlag) {
    response.defaultDate = end
  }

  console.log(`get weekly sales species group, program for ${start} through ${end} for ${format} route COMPLETE. \n`)
  res.send(response)
})

module.exports = router
