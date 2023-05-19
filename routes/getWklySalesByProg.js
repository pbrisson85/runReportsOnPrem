const router = require('express').Router()
const getWklySalesByProg = require('../routines/getWklyProgSales')
const getDistinctPrograms = require('../queries/postgres/filters/getDistinctPrograms')
const getDistinctFiscalYears = require('../queries/postgres/filters/getDistinctFiscalYears')
const { getDateEndPerWeek } = require('../queries/postgres/getDateEndPerWeek')

// @route   POST /api/sales/getSalesByProgram
// @desc
// @access

// Generate sales data
router.post('/', async (req, res) => {
  console.log(`\nget get weekly sales by program: ${req.body.program} for ${req.body.start} through ${req.body.end} route HIT...`)

  // If no program, start, or end passed then default to the current fiscal year, first program alphabetically
  if (typeof req.body.program === 'undefined' || typeof req.body.start === 'undefined' || typeof req.body.end === 'undefined') {
    const { program, start, end } = await getDefaults()
    req.body.program = program
    req.body.start = start
    req.body.end = end
  }

  const startDate = new Date(req.body.start)
  const endDate = new Date(req.body.end)

  console.log(`start date: ${startDate}`)
  console.log(`end date: ${endDate}`)

  const resp = await getWklySalesByProg(req.body.program, req.body.start, req.body.end)

  console.log(`get get weekly sales by program: ${req.body.program} for ${req.body.start} through ${req.body.end} route COMPLETE. \n`)
  res.send(resp)
  //res.send({ data, cols })
})

module.exports = router

/*
{
    "data": [
        {
            "row": "DRY",
            "2022-W17": {
                "weight": 52800,
                "revenue": 261360,
                "cogs": 218755.68,
                "othp": 2397.12,
                "netSales": 258962.88,
                "grossMargin": 40207.2,
                "revenuePerLb": 4.95,
                "cogsPerLb": 4.14,
                "othpPerLb": 0.05,
                "netSalesPerLb": 4.9,
                "grossMarginPerLb": 0.76
            },
      "cols": [
        {
            "dataname": "2022-W01",
            "displayname": "4/9/2022"
        },
        {
            "dataname": "2022-W02",
            "displayname": "4/16/2022"
        },
*/

const getDefaults = async () => {
  const fys = await getDistinctFiscalYears()

  // sort largest to smallest
  fys.sort((a, b) => {
    if (a.label > b.label) return -1
    if (a.label < b.label) return 1
    return 0
  })

  const periods = await getDateEndPerWeek(fys[0].label)

  const programs = await getDistinctPrograms(fys[0].label)
  programs.sort((a, b) => {
    if (a.label > b.label) return 1
    if (a.label < b.label) return -1
    return 0
  })

  const program = programs[0].dataName
  const start = periods[0].displayname
  const end = periods[periods.length - 1].displayname

  return { program, start, end }
}
