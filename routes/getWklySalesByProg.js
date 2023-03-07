const router = require('express').Router()
const getWklySalesByProg = require('../queries/postgres/getWklyProgSales')

// @route   GET /api/sales/getSalesByProgram/:program/:fy
// @desc
// @access

// Generate sales data
router.get('/:program/:fy', async (req, res) => {
  console.log(`\nget get weekly sales by program: ${req.params.program} for fy: ${req.params.fy} route HIT...`)

  const wklyProgSalesSchedule = await getWklySalesByProg(req.params.program, req.params.fy)

  console.log(`get weekly sales by program: ${req.params.program} for fy: ${req.params.fy} route COMPLETE. \n`)
  res.send(wklyProgSalesSchedule)
})

module.exports = router

// NEED A ROUTE THAT SHOWS ALL OTHER SALES NOT FOR ONE OF THE SPECIFIC PROGRAMS AND THAT DOES INCLUDE BY PRODUCT SALES
