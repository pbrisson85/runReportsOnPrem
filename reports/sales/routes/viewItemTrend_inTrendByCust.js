const router = require('express').Router()
const viewItemTrend = require('../routines/viewItemTrend')
const { getStartOfWeek } = require('../queries/postgres/getDateStartByWeek')
const { getWeekForDate } = require('../queries/postgres/getWeekForDate')
const labelCols = require('../queries/hardcode/cols_byItem')
const getReportConfig = require('../utils/getReportConfig')

// @route   POST /api/sales/drillDown/forProgBySpecSoakSize
// @desc
// @access  Private

// on all routes change the following:
// Instead of entering the start and end dates, enter the start week, end week. Then the same variables can be used for prior years.

router.post('/', async (req, res) => {
  const { option, filters, columnDataName, colType, periodEnd, showFyTrend, format } = req.body
  let { program, periodStart } = req.body

  const config = getReportConfig(req.body)

  console.log(`\nget drilldown data for ${format} route HIT...`)

  const startWeek = await getWeekForDate(periodStart) // temporarily until I change the data that is being passed by the front end to the week
  const endWeek = await getWeekForDate(periodEnd) // temporarily until I change the data that is being passed by the front end to the week

  // Note that start date is the END of the first week. Need the beginning of the same week to pull invoice dates that are after this:
  const startOfWeek = await getStartOfWeek(periodStart)
  periodStart = startOfWeek[0].formatted_date_start

  // Determine level of report being shown: (NOTE THAT THIS COULD MORE EASILY BE DONE WITH A SPECIFIC FLAG INSTEAD OF TRYING TO PARSE THE FILTERS)
  let level = null

  if (filters[2] === null) {
    // two level report
    if (filters[0] === 'SUBTOTAL' || filters[1] === 'SUBTOTAL') level = 1
    if (filters[0] !== 'SUBTOTAL' && filters[1] !== 'SUBTOTAL') level = 2
    if (filters[1] === 'TOTAL') level = 0
  } else {
    // three level report
    if (filters[1] === 'SUBTOTAL' && filters[2] === 'SUBTOTAL') level = 1
    if (filters[1] !== 'SUBTOTAL' && filters[2] === 'SUBTOTAL') level = 2
    if (filters[1] !== 'SUBTOTAL' && filters[2] !== 'SUBTOTAL' && filters[1] !== 'TOTAL' && filters[2] !== 'TOTAL') level = 3
    if (filters[1] === 'TOTAL' && filters[2] === 'TOTAL') level = 0
  }

  const response = await viewItemTrend(
    labelCols,
    config,
    config.program,
    periodStart,
    periodEnd,
    filters,
    showFyTrend,
    startWeek,
    endWeek,
    level
  )

  console.log(`get drilldown data for ${format} route COMPLETE. \n`)

  res.send(response)
})

module.exports = router
