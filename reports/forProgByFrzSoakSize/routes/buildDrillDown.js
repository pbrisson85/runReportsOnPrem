const router = require('express').Router()
const buildDrillDown = require('../routines/buildDrillDown')
const { getStartOfWeek } = require('../../shared/queries/postgres/getDateStartByWeek')

// @route   POST /api/sales/drillDown/forProgBySpecSoakSize
// @desc    Get drilldown data for a given report and filter
// @access  Private

router.post('/', async (req, res) => {
  const { program, option, filters, columnDataName, reportName, colType, periodStart, periodEnd } = req.body

  console.log(`\nget drilldown data for ${reportName} route HIT...`)

  // Note that start date is the END of the first week. Need the beginning of the same week to pull invoice dates that are after this:
  const startWeek = await getStartOfWeek(periodStart)

  const resp = await buildDrillDown(program, option, filters, columnDataName, reportName, colType, startWeek, periodEnd)

  console.log(`get drilldown data for ${reportName} route COMPLETE. \n`)
  res.send(resp)
})

module.exports = router
