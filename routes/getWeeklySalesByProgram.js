const router = require('express').Router()
const getWeeklySalesByProgram = require('../queries/postgres/getSalesByWeekByProgram')

// @route   GET /api/sales/getSalesByProgram/:program/:fy
// @desc
// @access

// Generate sales data
router.get('/:program/:fy', async (req, res) => {
  console.log(`\nget get weekly sales by program: ${req.params.program} for fy: ${req.params.fy} route HIT...`)

  const weeklyProgramSalesSchedule = await getWeeklySalesByProgram(req.params.program, req.params.fy)

  console.log(`get weekly sales by program: ${req.params.program} for fy: ${req.params.fy} route COMPLETE. \n`)
  res.send(weeklyProgramSalesSchedule)
})

module.exports = router
