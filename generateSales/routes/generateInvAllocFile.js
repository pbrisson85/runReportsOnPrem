const generateInvAllocFile = require('../routines/generateInvAllocFile')
const router = require('express').Router()

// @route   GET /api/sales/generateInvAllocData
// @desc
// @access

// Generate sales data
router.get('/:fy', async (req, res) => {
  console.log(`\generate invoice alloc data given FY route HIT...`)

  const invoiceAllocData = await generateInvAllocFile(req.params.fy)

  res.send({ message: `generate invoice alloc data routine complete: for FY: ${req.params.fy}`, data: invoiceAllocData })
  console.log(`generate invoice alloc data routine complete: for FY: ${req.params.fy} \n`)
})

module.exports = router
