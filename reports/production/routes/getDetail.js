const router = require('express').Router()
const getReportConfig = require('../../utils/getReportConfig')
const { getInven_detail } = require('../postgres/getDetail/getInven')
const { getPo_detail } = require('../postgres/getDetail/getOpenPo')
const { getSo_detail } = require('../postgres/getDetail/getSo')
const getProduction_detail = require('../postgres/getDetail/getProductionFg')
const detailColsMap = require('../data/detailCols/colsMap')
const groupByOptions = require('../../filters/data/detailGroupBy')

// @route   POST /api/sales/detail/forProgBySpecBrndSize/
// @desc
// @access  Private

router.post('/', async (req, res) => {
  const { colStartDate, colEndDate, timeSeriesCol } = req.body
  let { colType } = req.body // for now manually determining if projeciton vs sales below. Need to override col type to projection to get correct cols

  req.body.module = 'production'

  const config = await getReportConfig(req.body)

  let data = null

  console.log(`\n${config.user} - get detail data for ${config.baseFormat.dataName} route HIT...`)

  if (colType === 'inven') {
    data = await getInven_detail(config)
  }

  if (colType === 'salesOrder') {
    data = await getSo_detail(config, config.dates.salesOrders.startDate, config.dates.salesOrders.endDate)
  }

  if (colType === 'purchaseOrder') {
    data = await getPo_detail(config)
  }

  if (colType.substring(0, 2) === 'wo') {
    const woActivity = colType.split('_')[1]

    if (timeSeriesCol) {
      data = await getProduction_detail(config, colStartDate, colEndDate, woActivity)
    } else {
      data = await getProduction_detail(config, config.dates.totals.primary.startDate, config.dates.totals.primary.endDate, woActivity)
    }

    colType = 'production'
  }

  // Assign columns and menu
  const cols = detailColsMap[colType]
  const menu = groupByOptions[colType]

  console.log(`${config.user} - get detail data for ${config.baseFormat.dataName} route COMPLETE. \n`)
  res.send({ data, cols, menu })
})

module.exports = router
