const router = require('express').Router()
const buildDrillDown_byItem_level3 = require('../routines/buildDrillDown_byItem_level3')
const { getStartOfWeek } = require('../../shared/queries/postgres/getDateStartByWeek')

// @route   POST /api/sales/drillDown/forProgBySpecBrndSize
// @desc    Get drilldown data for a given report and filter
// @access  Private

router.post('/', async (req, res) => {
  const { program, option, filters, columnDataName, reportName, colType, periodStart, periodEnd } = req.body

  console.log(`\nget drilldown data for ${reportName} route HIT...`)

  // Note that start date is the END of the first week. Need the beginning of the same week to pull invoice dates that are after this:
  const startWeek = await getStartOfWeek(periodStart)

  let response = null

  if (option === 'Item') {
    response = await buildDrillDown_byItem_level3(program, startWeek[0].formatted_date_start, periodEnd, filters)
  } else {
    console.log(`option ${option} not yet implemented`)

    return res.send('not yet implemented')
  }

  console.log(`get drilldown data for ${reportName} route COMPLETE. \n`)
  res.send(response)
})

module.exports = router
