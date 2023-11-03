const router = require('express').Router()
const { getStartOfWeek } = require('../../../database/queries/postgres/getDateStartByWeek')
const { getWeekForDate } = require('../../../database/queries/postgres/getWeekForDate')
const viewTrend = require('../routines/viewTrendCopy')
const labelCols_byItem = require('../data/trendCols/colsByItem')
const labelCols_byCustomer = require('../data/trendCols/colsByCustomer')
const labelCols_byCustType = require('../data/trendCols/colsByCustType')
const labelCols_bySalesperson = require('../data/trendCols/colsBySalesperson')
const labelCols_byUsVsExport = require('../data/trendCols/colsByUsVsExport')
const labelCols_byNorthAmericaVsForeign = require('../data/trendCols/colsByNorthAmericaVsForeign')
const labelCols_byCountry = require('../data/trendCols/colsByCountry')
const labelCols_byState = require('../data/trendCols/colsByState')
const labelCols_byFreshFrozen = require('../data/trendCols/colsByFreshFrozen')
const labelCols_byProgram = require('../data/trendCols/colsByProgram')
const labelCols_bySpecies = require('../data/trendCols/colsBySpecies')
const labelCols_bySpeciesGroup = require('../data/trendCols/colsBySpeciesGroup')
const getReportConfig = require('../utils/getReportConfig')
const getViewTrendConfig = require('../utils/getViewTrendConfig')
const addCustomerName = require('../routines/custom/trendByCustomer')

// @route   POST /api/sales/drillDown/forProgBySpecSoakSize
// @desc
// @access  Private

router.post('/', async (req, res) => {
  const { rightMenuSelection, periodEnd, reportFormat, year } = req.body
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
    case 'Trend By Fresh vs Frozen':
      cols = labelCols_byFreshFrozen
      break
    case 'Trend By Customer Type':
      cols = labelCols_byCustType
      break
    case 'Trend By Program':
      cols = labelCols_byProgram
      break
    case 'Trend By Species':
      cols = labelCols_bySpecies
      break
    case 'Trend By Species Group':
      cols = labelCols_bySpeciesGroup
      break
  }

  response = await viewTrend(cols, config, periodStart, periodEnd, startWeek, endWeek, trendQuery, year)

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
