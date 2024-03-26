const router = require('express').Router()
const buildReport = require('../routines/baseReport/baseReport')
const getReportConfig = require('../../utils/getReportConfig')

// Generate full weekly report of ALL programs for FG Only (biggest picture)
router.post('/', async (req, res) => {
  console.log(`\nget CASH_PO base report route HIT...`)

  req.body.module = 'cash_po'

  const config = await getReportConfig(req.body)

  const response = await buildReport(config)

  console.log(`get get CASH_PO base report route COMPLETE. \n`)
  res.send(response)
})

module.exports = router
