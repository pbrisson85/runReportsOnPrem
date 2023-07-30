const router = require('express').Router()
const buildReport = require('../routines/buildReport')
const { getStartOfWeek } = require('../../shared/queries/postgres/getDateStartByWeek')

// @route   POST /api/sales/forProgramFfpds
// @desc
// @access

// Generate full weekly report of One program for FG Only (1st level drill down)
router.post('/', async (req, res) => {
  console.log(
    `\nget get weekly sales for ${req.body.program}, by freeze, soak, size during ${req.body.start} through ${req.body.end} route HIT...`
  )

  // Note that start date is the END of the first week. Need the beginning of the same week to pull invoice dates that are after this:
  const startWeek = await getStartOfWeek(req.body.start)

  // If showFyTrend param not passed in body then default to false
  if (typeof typeof req.body.showFyTrend === 'undefined') {
    req.body.showFyTrend = false
  }

  const resp = await buildReport(startWeek[0].formatted_date_start, req.body.end, req.body.program, req.body.showFyTrend)

  console.log(
    `get get weekly sales for ${req.body.program} by freeze, soak, size during ${req.body.start} through ${req.body.end} route COMPLETE. \n`
  )
  res.send(resp)
})

module.exports = router