const router = require('express').Router()
const buildReport = require('../routines/baseReportCopy')
const { getStartOfWeek } = require('../../../database/queries/postgres/getDateStartByWeek')
const { getWeekForDate } = require('../../../database/queries/postgres/getWeekForDate')
const getDefaults = require('../utils/getReportDefaults')
const getCols = require('../data/baseCols/labelCols')
const getReportConfig = require('../utils/getReportConfig')

// @route   POST /api/sales/byProgram
// @desc
// @access

// Generate full weekly report of ALL programs for FG Only (biggest picture)
router.post('/', async (req, res) => {
  console.log(`\nget get SALES base report route HIT...`)

  let { start, end, year } = req.body

  const config = getReportConfig(req.body)

  // If start, or end passed then default (COULD ADD THIS TO THE CONFIG FILE + add explanation, why would it be undefined)
  let defaultDateFlag = false
  if (typeof start === 'undefined' || typeof end === 'undefined') {
    const { defaultStart, defaultEnd, defaultYear } = await getDefaults()
    start = defaultStart
    end = defaultEnd
    year = defaultYear
    defaultDateFlag = true
  }

  // Note that start date is the END of the first week. Need the beginning of the same week to pull invoice dates that are after this: (COULD ADD THIS TO THE CONFIG FILE + add explanation, why would it be undefined)
  const startOfWeek = await getStartOfWeek(start)
  const periodStart = startOfWeek[0].formatted_date_start
  const labelCols = getCols(req.body) // (COULD ADD THIS TO THE CONFIG FILE + add explanation, why would it be undefined)

  const startWeek = await getWeekForDate(start, config) // temporarily until I change the data that is being passed by the front end to the week
  const endWeek = await getWeekForDate(end, config) // temporarily until I change the data that is being passed by the front end to the week

  const response = await buildReport(periodStart, end, startWeek, endWeek, config, labelCols, year)

  /* CUSTOMIZE RESPONSE */

  // if default date then add to response
  if (defaultDateFlag) {
    response.defaultDate = end
  }

  console.log(`get get SALES base report route COMPLETE. \n`)
  res.send(response)
})

module.exports = router
