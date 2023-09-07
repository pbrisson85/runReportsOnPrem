const runShipToTests = require('../tests/testShipToCountryState')
const router = require('express').Router()

// @route   GET /api/sales/runTests
// @desc
// @access

// Generate sales data
router.get('/', async (req, res) => {
  console.log(`\route hit for running manual generate sales data tests...`)

  await runShipToTests()

  res.send(`route complete for running manual generate sales data tests...`)
  console.log(`route complete for running manual generate sales data tests... \n`)
})

module.exports = router