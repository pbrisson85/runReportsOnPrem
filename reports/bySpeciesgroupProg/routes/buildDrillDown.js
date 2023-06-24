const router = require('express').Router()

// @route   POST /api/sales/drillDown/bySpeciesgroupProg/item
// @desc    Get drilldown data for a given report and filter
// @access  Private

router.post('/bySpeciesgroupProg/item', async (req, res) => {
  console.log(`\nget drilldown data for ${req.params.reportName} route HIT...`)

  const { colType, columnDataName, filters } = req.body

  console.log('colType', colType)
  console.log('columnDataName', columnDataName)
  console.log('filters', filters)

  res.send('ok')

  //const resp = await runDrilldown(reportName, filterName, start, end, filter)

  console.log(`get drilldown data for ${req.params.reportName} route COMPLETE. \n`)
  //res.send(resp)
})

module.exports = router
