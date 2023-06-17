const generateInvAllocFile = require('../routines/generateInAllocFile')
const router = require('express').Router()

// @route   GET /api/sales/generateInvAllocData
// @desc
// @access

// Generate sales data
router.get('/:fy', async (req, res) => {
  console.log(`\generate invoice alloc data given FY route HIT...`)

  const invoiceAllocData = await generateInvAllocFile(req.params.fy)

  res.send(`generate invoice alloc data routine complete: for FY: ${req.params.fy}`)
  console.log(`generate invoice alloc data routine complete: for FY: ${req.params.fy} \n`)
})

module.exports = router
