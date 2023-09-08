const router = require('express').Router()
const { getStartOfWeek } = require('../queries/postgres/getDateStartByWeek')
const { getWeekForDate } = require('../queries/postgres/getWeekForDate')
const viewTrend = require('../routines/viewTrend')
const labelCols_byItem = require('../queries/hardcode/cols_byItem')
const labelCols_byCustomer = require('../queries/hardcode/cols_byCustomer')
const labelCols_bySalesperson = require('../queries/hardcode/cols_bySalesperson')
const labelCols_byUsVsExport = require('../queries/hardcode/cols_byUsVsExport')
const labelCols_byNorthAmericaVsForeign = require('../queries/hardcode/cols_byNorthAmericaVsForeign')
const labelCols_byCountry = require('../queries/hardcode/cols_byCountry')
const labelCols_byState = require('../queries/hardcode/cols_byState')

const getReportConfig = require('../utils/getReportConfig')
const getViewTrendConfig = require('../utils/getViewTrendConfig')
const addCustomerName = require('../routines/custom/trendByCustomer')

// @route   POST /api/sales/drillDown/forProgBySpecSoakSize
// @desc
// @access  Private

router.post('/', async (req, res) => {
  const { rightMenuSelection, periodEnd, showFyTrend, reportFormat } = req.body
  let { periodStart } = req.body

  const config = getReportConfig(req.body)

  console.log(`\n${config.user} - get drilldown data for ${reportFormat} route HIT...`)

  const startWeek = await getWeekForDate(periodStart, config) // temporarily until I change the data that is being passed by the front end to the week
  const endWeek = await getWeekForDate(periodEnd, config) // temporarily until I change the data that is being passed by the front end to the week

  // Note that start date is the END of the first week. Need the beginning of the same week to pull invoice dates that are after this:
  const startOfWeek = await getStartOfWeek(periodStart)
  periodStart = startOfWeek[0].formatted_date_start

  console.log('rightMenuSelection: ', rightMenuSelection)

  let response = null
  let cols = null
  const trendQuery = getViewTrendConfig(rightMenuSelection)

  switch (rightMenuSelection) {
    case 'Trend By Item':
      cols = labelCols_byItem
      break
    case 'Trend By Customer':
      cols = labelCols_byCustomer
      break
    case 'Trend By Salesperson':
      cols = labelCols_bySalesperson
      break
    case 'Trend By USA vs Export':
      cols = labelCols_byUsVsExport
      break
    case 'Trend By North America vs Foreign':
      cols = labelCols_byNorthAmericaVsForeign
      break
    case 'Trend By Country':
      cols = labelCols_byCountry
      break
    case 'Trend By State':
      cols = labelCols_byState
      break
  }

  response = await viewTrend(cols, config, periodStart, periodEnd, showFyTrend, startWeek, endWeek, trendQuery)

  // CUSTOM ROUTINES FOR SPECIFIC REPORTS
  if (rightMenuSelection === 'Trend By Customer') {
    const data = await addCustomerName(response.data)
    response = {
      ...response,
      data,
    }
  }

  console.log(`${config.user} - get drilldown data for ${reportFormat} route COMPLETE. \n`)
  res.send(response)
})

module.exports = router
