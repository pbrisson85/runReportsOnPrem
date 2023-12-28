const router = require('express').Router()
const viewTrend = require('../routines/viewTrend/viewTrend')
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
const getReportConfig = require('../../utils/getReportConfig')
const getViewTrendConfig = require('../../utils/getViewTrendConfig')
const addCustomerName = require('../routines/helpers/trendByCustomer')

// @route   POST /api/sales/drillDown/forProgBySpecSoakSize
// @desc
// @access  Private

router.post('/', async (req, res) => {
  const { rightMenuSelection, reportFormat, useProjection, startDate, endDate } = req.body

  const config = await getReportConfig(req.body)
  console.log('slice report config:', config)

  console.log(`\n${config.user} - get drilldown data for ${reportFormat.dataName} route HIT...`)

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

  response = await viewTrend(cols, config, trendQuery, useProjection, startDate, endDate)

  // CUSTOM ROUTINES FOR SPECIFIC REPORTS
  if (rightMenuSelection === 'Trend By Customer') {
    const data = await addCustomerName(response.data)
    response = {
      ...response,
      data,
    }
  }

  console.log(`${config.user} - get drilldown data for ${reportFormat.dataName} route COMPLETE. \n`)
  res.send(response)
})

module.exports = router
