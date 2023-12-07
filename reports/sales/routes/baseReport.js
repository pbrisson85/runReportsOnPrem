const router = require('express').Router()
const buildReport = require('../routines/baseReport/baseReport')
const getReportConfig = require('../utils/getReportConfig')

// @route   POST /api/sales/byProgram
// @desc
// @access

// Generate full weekly report of ALL programs for FG Only (biggest picture)
router.post('/', async (req, res) => {
  console.log(`\nget get SALES base report route HIT...`)

  const config = await getReportConfig(req.body)  

  const response = await buildReport(config)

  console.log(`get get SALES base report route COMPLETE. \n`)
  res.send(response)
})

module.exports = router
