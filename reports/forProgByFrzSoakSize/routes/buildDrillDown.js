const router = require('express').Router()

// @route   POST /api/sales/drillDown/forProgBySpecSoakSize
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

  res.send('ok')

  //const resp = await runDrilldown(reportName, filterName, start, end, filter)

  console.log(`get drilldown data for ${reportName} route COMPLETE. \n`)
  //res.send(resp)
})

module.exports = router
