const router = require('express').Router()
const buildReport = require('../routines/baseReport/baseReport')
const getReportConfig = require('../../utils/getReportConfig')


// Generate full weekly report of ALL programs for FG Only (biggest picture)
router.post('/', async (req, res) => {
  console.log(`\nget get INVEN base report route HIT...`)

  const config = await getReportConfig(req.body)  
  console.log('inven base report config:', config)

  const response = await buildReport(config)

  console.log(`get get INVEN base report route COMPLETE. \n`)
  res.send(response)
})

module.exports = router