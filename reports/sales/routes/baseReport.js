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
  const { reportFormat } = req.body
  let { start, end, showFyTrend, year } = req.body

  const config = getReportConfig(req.body)

  // If showFyTrend param not passed in body then default to false (COULD ADD THIS TO THE CONFIG FILE + add explanation, why would it be undefined)
  if (typeof showFyTrend === 'undefined') {
    showFyTrend = false
  }

  // If start, or end passed then default (COULD ADD THIS TO THE CONFIG FILE + add explanation, why would it be undefined)
  let defaultDateFlag = false
  if (typeof typeof start === 'undefined' || typeof end === 'undefined') {
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

  console.log(`\n${config.user} - get get weekly sales species group, program for ${start} through ${end} for ${reportFormat} route HIT...`)

  const startWeek = await getWeekForDate(start, config) // temporarily until I change the data that is being passed by the front end to the week
  const endWeek = await getWeekForDate(end, config) // temporarily until I change the data that is being passed by the front end to the week

  const response = await buildReport(periodStart, end, showFyTrend, startWeek, endWeek, config, labelCols, year)

  /* CUSTOMIZE RESPONSE */
  // get seconds row
  config.itemType = 'SECONDS'
  const seconds = await buildReport(periodStart, end, showFyTrend, startWeek, endWeek, config, labelCols, year, true)
  seconds.data[0].totalRow = false
  seconds.data[0].nonFgRow = true

  // get by product row
  config.itemType = 'BY PRODUCT'
  const byProduct = await buildReport(periodStart, end, showFyTrend, startWeek, endWeek, config, labelCols, year, true)
  byProduct.data[0].totalRow = false
  byProduct.data[0].nonFgRow = true

  // get RM row
  config.itemType = 'RM'
  const rm = await buildReport(periodStart, end, showFyTrend, startWeek, endWeek, config, labelCols, year, true)
  rm.data[0].totalRow = false
  rm.data[0].nonFgRow = true

  // get All row
  config.itemType = null
  const allSales = await buildReport(periodStart, end, showFyTrend, startWeek, endWeek, config, labelCols, year, true)
  allSales.data[0].totalRow = false
  allSales.data[0].nonFgRow = true

  // union seconds and by product to response data, add total row, remove total row flags for front end css
  response.data = [...response.data, ...seconds.data, ...byProduct.data, ...rm.data, ...allSales.data]

  // if default date then add to response
  if (defaultDateFlag) {
    response.defaultDate = end
  }

  console.log(`${config.user} - get weekly sales species group, program for ${start} through ${end} for ${reportFormat} route COMPLETE. \n`)
  res.send(response)
})

module.exports = router
