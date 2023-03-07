const router = require('express').Router()
const getWklySalesByProg = require('../routines/getWklyProgSales')

// @route   GET /api/sales/getSalesByProgram/:program/:fy
// @desc
// @access

// Generate sales data
router.get('/:program/:fy', async (req, res) => {
  console.log(`\nget get weekly sales by program: ${req.params.program} for fy: ${req.params.fy} route HIT...`)

  const { data, cols } = await getWklySalesByProg(req.params.program, req.params.fy)

  console.log(`get weekly sales by program: ${req.params.program} for fy: ${req.params.fy} route COMPLETE. \n`)
  res.send({ data, cols })
})

module.exports = router

// NEED A ROUTE THAT SHOWS ALL OTHER SALES NOT FOR ONE OF THE SPECIFIC PROGRAMS AND THAT DOES INCLUDE BY PRODUCT SALES
