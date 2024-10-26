const router = require('express').Router()
const viewTrend = require('../routines/rowSlice/rowSlice')
const labelCols_byItem = require('../data/sliceCols/colsByItem')
const labelCols_byCustomer = require('../data/sliceCols/colsByCustomer')
const labelCols_byCustType = require('../data/sliceCols/colsByCustType')
const labelCols_bySalesperson = require('../data/sliceCols/colsBySalesperson')
const labelCols_byUsVsExport = require('../data/sliceCols/colsByUsVsExport')
const labelCols_byNorthAmericaVsForeign = require('../data/sliceCols/colsByNorthAmericaVsForeign')
const labelCols_byCountry = require('../data/sliceCols/colsByCountry')
const labelCols_byState = require('../data/sliceCols/colsByState')
const labelCols_byFreshFrozen = require('../data/sliceCols/colsByFreshFrozen')
const labelCols_byProgram = require('../data/sliceCols/colsByProgram')
const labelCols_bySpecies = require('../data/sliceCols/colsBySpecies')
const labelCols_bySpeciesGroup = require('../data/sliceCols/colsBySpeciesGroup')
const getReportConfig = require('../../utils/getReportConfig')
const getViewTrendConfig = require('../../utils/getViewTrendConfig')
const addCustomerName = require('../routines/helpers/trendByCustomer')
const labelCols_byCreditTerms = require('../data/sliceCols/colsByCreditTerms')
const labelCols_byInsured = require('../data/sliceCols/colsByInsuredVsUninsured')

router.post('/', async (req, res) => {
  const { rightMenuSelection } = req.body

  req.body.module = 'sales'

  const config = await getReportConfig(req.body)

  console.log(`\n${config.user} - get drilldown data for ${config.baseFormat.dataName} route HIT...`)

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
    case 'Trend By Credit Terms':
      cols = labelCols_byCreditTerms
      break
    case 'Trend By Insured vs Uninsured':
      cols = labelCols_byInsured
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

  response = await viewTrend(cols, config, trendQuery)

  // CUSTOM ROUTINES FOR SPECIFIC REPORTS
  if (rightMenuSelection === 'Trend By Customer') {
    const data = await addCustomerName(response.data)
    response = {
      ...response,
      data,
    }
  }

  console.log(`${config.user} - get drilldown data for ${config.baseFormat.dataName} route COMPLETE. \n`)
  res.send(response)
})

module.exports = router
