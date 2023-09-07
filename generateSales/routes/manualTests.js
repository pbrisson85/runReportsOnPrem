const runShipToTests = require('../tests/testShipToCountryState')
const router = require('express').Router()

// @route   GET /api/sales/runTests
// @desc
// @access

// Generate sales data
router.get('/', async (req, res) => {
  console.log(`\nroute hit for running manual generate sales data tests...`)

  const errors = await runShipToTests()

  res.send(JSON.stringify(errors))
  console.log(`route complete for running manual generate sales data tests... \n`)
})

module.exports = router
