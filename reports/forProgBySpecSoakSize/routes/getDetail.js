const router = require('express').Router()
const getDetail = require('../routes/getDetail')
const { getStartOfWeek } = require('../../shared/queries/postgres/getDateStartByWeek')

// @route   POST /api/sales/detail/bySpeciesgroupProg/
// @desc    Get drilldown data for a given report and filter
// @access  Private

router.post('/', async (req, res) => {
  const { program, option, filters, columnDataName, reportName, colType, periodStart, periodEnd } = req.body

  console.log(`\nget detail data for ${reportName} route HIT...`)

  // Note that start date is the END of the first week. Need the beginning of the same week to pull invoice dates that are after this:
  const startWeek = await getStartOfWeek(periodStart)

  const resp = await getDetail(program, option, filters, columnDataName, reportName, colType, startWeek, periodEnd)

  console.log(`get detail data for ${reportName} route COMPLETE. \n`)
  res.send(resp)
})

module.exports = router
