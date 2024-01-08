const router = require('express').Router()
const viewTrend = require('../routines/rowSlice/rowSlice')
const labelCols_byItem = require('../data/sliceCols/colsByItem')
const labelCols_byFreshFrozen = require('../data/sliceCols/colsByFreshFrozen')
const labelCols_byProgram = require('../data/sliceCols/colsByProgram')
const labelCols_bySpecies = require('../data/sliceCols/colsBySpecies')
const labelCols_bySpeciesGroup = require('../data/sliceCols/colsBySpeciesGroup')
const getReportConfig = require('../../utils/getReportConfig')
const getViewTrendConfig = require('../../utils/getViewTrendConfig')

router.post('/', async (req, res) => {
  const { rightMenuSelection } = req.body

  req.body.module = 'inven'

  const config = await getReportConfig(req.body)

  console.log(`\n${config.user} - get drilldown data for ${config.baseFormat.dataName} route HIT...`)

  let response = null
  let cols = null
  const trendQuery = getViewTrendConfig(rightMenuSelection)

  switch (rightMenuSelection) {
    case 'Trend By Item':
      cols = labelCols_byItem
      break
    case 'Trend By Fresh vs Frozen':
      cols = labelCols_byFreshFrozen
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

  console.log(`${config.user} - get drilldown data for ${config.baseFormat.dataName} route COMPLETE. \n`)
  res.send(response)
})

module.exports = router
