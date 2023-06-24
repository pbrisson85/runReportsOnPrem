const router = require('express').Router()
const buildDrillDown = require('../routines/buildDrillDown')

// @route   POST /api/sales/drillDown/forProgByFrzSoakSize/
// @desc    Get drilldown data for a given report and filter
// @access  Private

router.post('/', async (req, res) => {
  const { option, filters, columnDataName, reportName, colType, periodStart, periodEnd } = req.body

  console.log(`\nget drilldown data for ${reportName} route HIT...`)

  console.log('option', option)
  console.log('filters', filters)
  console.log('columnDataName', columnDataName)
  console.log('reportName', reportName)
  console.log('colType', colType)
  console.log('periodStart', periodStart)
  console.log('periodEnd', periodEnd)

  const resp = await buildDrillDown(option, filters, columnDataName, reportName, colType, periodStart, periodEnd)

  console.log(`get drilldown data for ${reportName} route COMPLETE. \n`)
  res.send(resp)
})

module.exports = router
