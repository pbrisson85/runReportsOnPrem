const generateSalesDataRoutine = require('../routines/generateSalesDataRoutine')
const router = require('express').Router()

// @route   GET /api/sales/generateSalesData
// @desc
// @access

// Generate sales data
router.get('/', async (req, res) => {
  console.log(`\generate sales data given FY route HIT...`)

  const fy = 2022
  const sales = await generateSalesDataRoutine(fy)

  res.send(sales)
  console.log(`generate sales data routine complete: ${complete} for FY: ${fy} \n`)
})

module.exports = router
