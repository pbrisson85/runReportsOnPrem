const router = require('express').Router()
const getDetail_invenFg = require('../../shared/routines/getDetail_baseReport/invenFG')
const getDetail_salesOrder = require('../../shared/routines/getDetail_baseReport/salesOrder')
const getDetail_salesInvoice = require('../../shared/routines/getDetail_baseReport/salesInvoice')
const getDetail_purchaseOrder = require('../../shared/routines/getDetail_baseReport/purchaseOrder')
const { getWeekForDate } = require('../../shared/queries/postgres/getWeekForDate')

// @route   POST /api/sales/detail/forProgBySpecBrndSize/
// @desc
// @access  Private

router.post('/', async (req, res) => {
  const { option, filters, columnDataName, reportName, colType, periodStart, periodEnd, fyTrendCol, fyYtdTrendCol } = req.body
  let { program, year } = req.body

  const config = {
    l1_field: 'ms.species_group',
    l2_field: 'ms.program',
    program: null,
  }
  program = config.program

  console.log(`\nget detail data base report for ${reportName} route HIT...`)

  let response = null

  // Determine level of report being shown: (NOTE THAT THIS COULD MORE EASILY BE DONE WITH A SPECIFIC FLAG INSTEAD OF TRYING TO PARSE THE FILTERS)
  let level = null
  if (filters[0] === 'SUBTOTAL' || filters[1] === 'SUBTOTAL') level = 1
  if (filters[0] !== 'SUBTOTAL' && filters[1] !== 'SUBTOTAL') level = 2
  if (filters[1] === 'TOTAL') level = 0

  if (colType === 'invenFg') {
    response = await getDetail_invenFg(level, program, filters, columnDataName)
  }

  if (colType === 'salesOrder') {
    response = await getDetail_salesOrder(level, program, filters, columnDataName)
  }

  if (colType === 'salesInvoice') {
    // Transform all queries to have a start week, end week, and year
    let startWeek = await getWeekForDate(periodStart)
    let endWeek = await getWeekForDate(periodEnd)
    let priorYearData = false

    if (fyYtdTrendCol) {
      priorYearData = true
      year = columnDataName.split('_')[0]
    }
    if (fyTrendCol) {
      startWeek = 1
      endWeek = 53
      priorYearData = true
      year = columnDataName.split('_')[0]
    }
    if (columnDataName.split('-')[1]?.charAt(0) === 'W') {
      startWeek = columnDataName.split('-')[1].split('W')[1]
      endWeek = columnDataName.split('-')[1].split('W')[1]
      year = columnDataName.split('-')[0]
    }
    response = await getDetail_salesInvoice(level, program, filters, startWeek, endWeek, year)
  }

  if (colType === 'purchaseOrder') {
    response = await getDetail_purchaseOrder(level, program, filters)
  }

  console.log(`get detail data base report for ${reportName} route COMPLETE. \n`)
  res.send(response)
})

module.exports = router
