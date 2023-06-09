const generateSalesDataRoutine = require('../routines/generateSales')
const router = require('express').Router()

// @route   GET /api/sales/generateSalesData
// @desc
// @access

// Generate sales data
router.get('/:fy', async (req, res) => {
  console.log(`\generate sales data given FY route HIT...`)

  const sales = await generateSalesDataRoutine(req.params.fy)

  res.send(`generate sales data routine complete: for FY: ${req.params.fy}`)
  console.log(`generate sales data routine complete: for FY: ${req.params.fy} \n`)
})

module.exports = router
