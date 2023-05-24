const router = require('express').Router()
const saleByProgramRoutine = require('../routines/wklyReportByProgram')
const { getStartOfWeek } = require('../queries/postgres/generateSalesData/getDateStartByWeek')

// @route   POST /api/sales/getSalesByProgram
// @desc
// @access

// Generate sales data
router.post('/', async (req, res) => {
  console.log(`\nget get weekly sales by processing level for ${req.body.start} through ${req.body.end} route HIT...`)

  // Note that start date is the END of the first week. Need the beginning of the same week to pull invoice dates that are after this:
  const startWeek = await getStartOfWeek(req.body.start)

  const resp = await saleByProgramRoutine(startWeek[0].formatted_date_start, req.body.end)

  console.log(`get get weekly sales by processing level for ${req.body.start} through ${req.body.end} route COMPLETE. \n`)
  res.send(resp)
  //res.send({ data, cols })
})

module.exports = router
