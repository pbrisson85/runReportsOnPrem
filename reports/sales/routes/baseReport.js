const router = require('express').Router()
const buildReport = require('../routines/baseReport')
const getCols = require('../data/baseCols/labelCols')
const getReportConfig = require('../utils/getReportConfig')

// @route   POST /api/sales/byProgram
// @desc
// @access

// Generate full weekly report of ALL programs for FG Only (biggest picture)
router.post('/', async (req, res) => {
  console.log(`\nget get SALES base report route HIT...`)

  const config = await getReportConfig(req.body)  

  console.log(config)
 
  const labelCols = getCols(req.body) // (COULD ADD THIS TO THE CONFIG FILE + add explanation, why would it be undefined)

  const response = await buildReport( config, labelCols)

  console.log(`get get SALES base report route COMPLETE. \n`)
  res.send(response)
})

module.exports = router
