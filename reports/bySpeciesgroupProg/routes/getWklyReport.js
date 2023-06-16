const router = require('express').Router()
const runWklyReport = require('../routines/runWklyReport')
const { getStartOfWeek } = require('../../shared/queries/postgres/getDateStartByWeek')
const getDistinctFiscalYears = require('../../shared/queries/postgres/getDistinctFiscalYears')
const { getDateEndPerWeek } = require('../../shared/queries/postgres/getDateEndPerWeek')

// @route   POST /api/sales/byProgram
// @desc
// @access

// Generate full weekly report of ALL programs for FG Only (biggest picture)
router.post('/', async (req, res) => {
  console.log(`\nget get weekly sales species group, program for ${req.body.start} through ${req.body.end} route HIT...`)

  // If no program, start, or end passed then default to the current fiscal year, first program alphabetically
  if (typeof typeof req.body.start === 'undefined' || typeof req.body.end === 'undefined') {
    const { start, end } = await getDefaults()
    req.body.start = start
    req.body.end = end
  }

  // Note that start date is the END of the first week. Need the beginning of the same week to pull invoice dates that are after this:
  const startWeek = await getStartOfWeek(req.body.start)

  const resp = await runWklyReport(startWeek[0].formatted_date_start, req.body.end)

  console.log(`get weekly sales species group, program for ${req.body.start} through ${req.body.end} route COMPLETE. \n`)
  res.send(resp)
  //res.send({ data, cols })
})

module.exports = router

const getDefaults = async () => {
  const fys = await getDistinctFiscalYears()

  // sort largest to smallest
  fys.sort((a, b) => {
    if (a.label > b.label) return -1
    if (a.label < b.label) return 1
    return 0
  })

  const periods = await getDateEndPerWeek(fys[0].label)
  const start = periods[0].displayname
  const end = periods[periods.length - 1].displayname

  return { start, end }
}
