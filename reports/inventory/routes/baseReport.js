const router = require('express').Router()
const buildReport = require('../routines/baseReportCopy')
const getCols = require('../data/baseCols/labelCols')
const getReportConfig = require('../utils/getReportConfig')

router.post('/', async (req, res) => {
  console.log('req.body', req.body)

  const labelCols = getCols(req.body) // (COULD ADD THIS TO THE CONFIG FILE + add explanation, why would it be undefined)
  const config = getReportConfig(req.body)

  console.log(`\n${config.user} - Generate Inventory Report route HIT...`)

  const response = await buildReport(config, labelCols)

  console.log(`${config.user} - Generate Inventory Report route COMPLETE. \n`)

  res.send(response)
})

module.exports = router
