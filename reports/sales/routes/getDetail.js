const router = require('express').Router()
const getReportConfig = require('../../utils/getReportConfig')
const { getInven_detail } = require('../postgres/getDetail/getInven')
const { getPo_detail } = require('../postgres/getDetail/getOpenPo')
const { getSales_detail } = require('../postgres/getDetail/getSales')
const { getSalesProjection_detail } = require('../postgres/getDetail/getSalesProjection')
const { getSo_detail } = require('../postgres/getDetail/getSo')
const detailColsMap = require('../data/detailCols/colsMap')
const groupByOptions = require('../../filters/data/detailGroupBy')

// @route   POST /api/sales/detail/forProgBySpecBrndSize/
// @desc
// @access  Private

router.post('/', async (req, res) => {
  const { colStartDate, colEndDate, timeSeriesCol } = req.body
  let { colType } = req.body // for now manually determining if projeciton vs sales below. Need to override col type to projection to get correct cols

  req.body.module = 'sales'

  const config = await getReportConfig(req.body)

  let data = null

  console.log(`\n${config.user} - get detail data for ${config.baseFormat.dataName} route HIT...`)

  if (colType === 'inven') {
    data = await getInven_detail(config)
  }

  if (colType === 'salesOrder' && !timeSeriesCol) {
    data = await getSo_detail(config, config.salesOrders.startDate, config.salesOrders.endDate)
  }

  if (colType === 'salesOrder' && timeSeriesCol) {
    data = await getSo_detail(config, colStartDate, colEndDate)
  }

  if (colType === 'salesInvoice' && !timeSeriesCol) {
    if (config.totals.useProjection?.so || config.totals.useProjection?.pr) {
      data = await getSalesProjection_detail(config, config.totals.primary.startDate, config.totals.primary.endDate, config.totals.useProjection) // Should try to combine with getSales_detail
      colType = 'salesProjection' // for now manually determining if projeciton vs sales below. Need to override col type to projection to get correct cols
    } else {
      data = await getSales_detail(config, config.totals.primary.startDate, config.totals.primary.endDate)
    }
  }

  if (colType === 'salesInvoice' && timeSeriesCol) {
    if (config.totals.useProjection?.so || config.totals.useProjection?.pr) {
      data = await getSalesProjection_detail(config, colStartDate, colEndDate, config.totals.useProjection) // Should try to combine with getSales_detail
      colType = 'salesProjection' // for now manually determining if projeciton vs sales below. Need to override col type to projection to get correct cols
    } else {
      data = await getSales_detail(config, colStartDate, colEndDate)
    }
  }

  if (colType === 'purchaseOrder') {
    data = await getPo_detail(config)
  }

  // Assign columns and menu
  const cols = detailColsMap[colType]
  const menu = groupByOptions[colType]

  console.log(`${config.user} - get detail data for ${config.baseFormat.dataName} route COMPLETE. \n`)
  res.send({ data, cols, menu })
})

module.exports = router
